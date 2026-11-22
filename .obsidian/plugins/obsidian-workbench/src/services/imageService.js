"use strict";

const { normalizePath, Notice } = require("obsidian");

/**
 * 图片服务：上传存档 + 格式转换 + 压缩。
 *
 * 转换引擎双轨（按可用性自动降级）：
 *   1. sharp（首选）：sharp.nodejs.cn —— 基于 libvips，支持 webp/avif/jpeg/png 与
 *      质量、尺寸、metadata。sharp 走 Node-API（ABI 稳定），Electron 下可加载，
 *      但需在插件目录本地安装：cd .obsidian/plugins/obsidian-workbench && npm i sharp
 *   2. Canvas（兜底）：浏览器 createImageBitmap + canvas.toBlob，支持 webp/jpeg/png，
 *      无原生依赖、零安装，但不支持 avif 与高质量重采样。
 *
 * 设计原则：没装 sharp 也必须能用；装了 sharp 自动启用全部能力。
 */

const SUPPORTED_OUT = ["webp", "avif", "jpeg", "jpg", "png"];

let sharpModule; // undefined = 未探测, null = 不可用
let sharpError = "";
let pluginDir = ""; // 由 main.js 用 manifest.dir 注入（绝对路径）

/**
 * 注入插件绝对目录。Obsidian 的 require 解析基址不一定是插件目录，
 * 因此除常规 require 外，再用绝对路径兜底定位本地安装的 sharp。
 */
function setPluginDir(dir) {
  pluginDir = String(dir || "");
  sharpModule = undefined; // 允许重探
}

function loadSharp() {
  if (sharpModule !== undefined) return sharpModule;
  const attempts = [];
  // 1) 常规解析（插件目录有 node_modules 时通常可命中）
  attempts.push(() => require("sharp"));
  // 2) 绝对路径兜底
  if (pluginDir) {
    attempts.push(() => {
      const nodePath = require("path");
      return require(nodePath.join(pluginDir, "node_modules", "sharp"));
    });
  }
  for (const attempt of attempts) {
    try {
      sharpModule = attempt();
      sharpError = "";
      return sharpModule;
    } catch (e) {
      sharpError = String((e && e.message) || e);
    }
  }
  sharpModule = null;
  return sharpModule;
}

function engineInfo() {
  const sharp = loadSharp();
  return {
    engine: sharp ? "sharp" : "canvas",
    sharpVersion: sharp ? (sharp.versions ? sharp.versions.sharp : "unknown") : null,
    libvips: sharp && sharp.versions ? sharp.versions.vips : null,
    formats: sharp
      ? Object.keys(sharp.format || {}).filter((k) => sharp.format[k].output && sharp.format[k].output.buffer)
      : ["webp", "jpeg", "png"],
    error: sharpError
  };
}

const MIME = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  bmp: "image/bmp",
  svg: "image/svg+xml"
};

function extOf(name) {
  const i = String(name).lastIndexOf(".");
  return i < 0 ? "" : name.slice(i + 1).toLowerCase();
}

function baseOf(name) {
  const i = String(name).lastIndexOf(".");
  return i < 0 ? name : name.slice(0, i);
}

/**
 * 归档目录：assets/<YYYY-MM>/（对齐 AGENTS.md「assets 是全库附件落盘位置」）
 */
function assetDirFor(date) {
  const d = date || new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `assets/${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

async function ensureFolder(app, path) {
  const abs = app.vault.getAbstractFileByPath(normalizePath(path));
  if (abs) return abs;
  try {
    return await app.vault.createFolder(normalizePath(path));
  } catch (e) {
    // 并发创建冲突：再查一次
    return app.vault.getAbstractFileByPath(normalizePath(path));
  }
}

/**
 * 上传/粘贴的图片存档：写入 assets/<YYYY-MM>/，可选转格式与重命名。
 * 入参：ArrayBuffer / Uint8Array / Blob / base64 dataURL 字符串。
 * 返回 { file, path, engine }
 */
async function saveImage(app, input, opts) {
  const o = opts || {};
  const name = o.name || `pasted-${Date.now()}.png`;
  const targetExt = (o.format || extOf(name) || "png").toLowerCase();
  const dir = o.dir || assetDirFor(o.date);
  await ensureFolder(app, dir);

  let bytes;
  if (typeof input === "string") {
    // dataURL 或 base64
    const comma = input.indexOf(",");
    const b64 = comma >= 0 ? input.slice(comma + 1) : input;
    const bin = atob(b64);
    bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  } else if (input instanceof ArrayBuffer) {
    bytes = new Uint8Array(input);
  } else if (input && input.buffer instanceof ArrayBuffer) {
    bytes = new Uint8Array(input.buffer);
  } else if (input && typeof input.arrayBuffer === "function") {
    bytes = new Uint8Array(await input.arrayBuffer());
  } else {
    throw new Error("无法识别的图片输入类型");
  }

  let outBytes = bytes;
  let outExt = extOf(name) || "png";
  let engine = "none";

  const needConvert = o.format && o.format !== extOf(name);
  const needResize = o.maxWidth && o.maxWidth > 0;
  const needQuality = typeof o.quality === "number";
  if (needConvert || needResize || needQuality) {
    const conv = await convertBuffer(bytes, outExt, {
      format: targetExt,
      quality: o.quality,
      maxWidth: o.maxWidth
    });
    outBytes = conv.bytes;
    outExt = conv.ext;
    engine = conv.engine;
  }

  const finalName = `${baseOf(name)}.${outExt}`;
  let path = normalizePath(`${dir}/${finalName}`);
  if (app.vault.getAbstractFileByPath(path)) {
    path = normalizePath(`${dir}/${baseOf(name)}-${Date.now()}.${outExt}`);
  }
  const file = await app.vault.createBinary(path, outBytes.buffer ? outBytes.buffer : outBytes);
  return { file, path, engine, bytes: outBytes.length };
}

/**
 * 单缓冲转换：sharp 可用走 sharp，否则 canvas。
 * 返回 { bytes: Uint8Array, ext, engine }
 */
async function convertBuffer(bytes, srcExt, opts) {
  const o = opts || {};
  const format = String(o.format || srcExt || "png").toLowerCase();
  if (!SUPPORTED_OUT.includes(format)) throw new Error(`不支持的目标格式：${format}`);
  const ext = format === "jpg" ? "jpeg" : format;
  const sharp = loadSharp();

  if (sharp) {
    let pipe = sharp(Buffer.from(bytes), { failOn: "none" });
    if (o.maxWidth) pipe = pipe.resize({ width: o.maxWidth, withoutEnlargement: true });
    if (format === "webp") pipe = pipe.webp({ quality: o.quality == null ? 82 : o.quality });
    else if (format === "avif") pipe = pipe.avif({ quality: o.quality == null ? 60 : o.quality });
    else if (ext === "jpeg") pipe = pipe.jpeg({ quality: o.quality == null ? 85 : o.quality, mozjpeg: true });
    else if (format === "png") pipe = pipe.png({ compressionLevel: 9 });
    const buf = await pipe.toBuffer();
    return { bytes: new Uint8Array(buf), ext: format === "jpeg" ? "jpg" : format, engine: "sharp" };
  }

  // Canvas 兜底（仅渲染进程可用）
  if (typeof document === "undefined") throw new Error("当前环境无 Canvas，也无法加载 sharp");
  if (format === "avif") throw new Error("AVIF 需要安装 sharp（canvas 不支持编码 AVIF）");
  const blob = new Blob([bytes], { type: MIME[srcExt] || "image/png" });
  const bitmap = await createImageBitmap(blob);
  const scale = o.maxWidth && bitmap.width > o.maxWidth ? o.maxWidth / bitmap.width : 1;
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, w, h);
  if (bitmap.close) bitmap.close();
  const mime = format === "webp" ? "image/webp" : format === "png" ? "image/png" : "image/jpeg";
  const outBlob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("canvas.toBlob 失败"))), mime, o.quality == null ? 0.85 : o.quality)
  );
  const arr = new Uint8Array(await outBlob.arrayBuffer());
  return { bytes: arr, engine: "canvas", ext: format === "jpeg" ? "jpg" : format };
}

/**
 * 批量转换库内图片。files: TFile[]；opts: { format, quality, maxWidth, replace }
 * replace=true 时：新文件写入同目录，并把引用改指新文件（保守：仅改同名前缀的 wiki 嵌入）。
 */
async function convertFiles(app, files, opts, onProgress) {
  const o = opts || {};
  const results = [];
  let done = 0;
  for (const f of files) {
    done += 1;
    if (onProgress) onProgress(done, files.length, f.path);
    try {
      const srcExt = extOf(f.name);
      if (o.skipSameFormat && srcExt === (o.format || "").toLowerCase()) {
        results.push({ file: f, skipped: true, reason: "已是目标格式" });
        continue;
      }
      if (srcExt === "svg" || srcExt === "gif") {
        results.push({ file: f, skipped: true, reason: "矢量/动图不转换" });
        continue;
      }
      const buf = await app.vault.readBinary(f);
      const conv = await convertBuffer(new Uint8Array(buf), srcExt, o);
      const dir = f.parent ? f.parent.path : "";
      const outName = `${baseOf(f.name)}.${conv.ext}`;
      let outPath = normalizePath(dir ? `${dir}/${outName}` : outName);
      if (app.vault.getAbstractFileByPath(outPath) && outPath !== f.path) {
        outPath = normalizePath(dir ? `${dir}/${baseOf(f.name)}-${Date.now()}.${conv.ext}` : `${baseOf(f.name)}-${Date.now()}.${conv.ext}`);
      }
      const created = await app.vault.createBinary(outPath, conv.bytes.buffer);
      results.push({
        file: f,
        created,
        engine: conv.engine,
        from: buf.byteLength,
        to: conv.bytes.length,
        saved: buf.byteLength - conv.bytes.length
      });
    } catch (e) {
      results.push({ file: f, error: String((e && e.message) || e) });
    }
  }
  return results;
}

/**
 * 收集库内可转换的图片文件。
 */
function collectImages(app, folderPrefix) {
  const prefix = (folderPrefix || "").replace(/^\/+|\/+$/g, "");
  return app.vault.getFiles().filter((f) => {
    const e = f.extension.toLowerCase();
    if (!["png", "jpg", "jpeg", "webp", "bmp"].includes(e)) return false;
    if (prefix && !(f.path === prefix || f.path.startsWith(prefix + "/"))) return false;
    return true;
  });
}

module.exports = {
  SUPPORTED_OUT,
  setPluginDir,
  loadSharp,
  engineInfo,
  assetDirFor,
  saveImage,
  convertBuffer,
  convertFiles,
  collectImages,
  extOf,
  baseOf
};

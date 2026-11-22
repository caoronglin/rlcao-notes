"use strict";

const { normalizePath } = require("obsidian");

/**
 * 附件管理服务：
 *  - 全库收集附件引用（![[…]] / [[…]] 嵌入与链接、![](...)、HTML <img>）
 *  - 与磁盘上的附件文件做差集 → 孤儿附件 / 坏引用 / 体积榜
 *  - 孤儿批量归档（git mv 语义：vault rename，目录按日期）
 *
 * 约定（AGENTS.md §2）：assets/ 是全库附件落盘位置；本服务扫描
 * vault 内全部附件扩展名文件，不假设附件只在 assets/。
 */

/** 安全解码：文件名里的裸 % 会让 decodeURIComponent 抛 URI malformed */
function safeDecode(s) {
  try {
    return decodeURIComponent(s);
  } catch (e) {
    return s;
  }
}

const ATTACHMENT_EXTS = new Set([
  "png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "tiff", "tif",
  "pdf", "mp4", "mp3", "wav", "zip", "docx", "xlsx", "pptx"
]);

// 引用提取时的行内代码/围栏剥离
function stripCode(text) {
  const out = [];
  let inFence = false;
  for (const line of text.split("\n")) {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      out.push("");
      continue;
    }
    out.push(inFence ? "" : line);
  }
  return out.join("\n").replace(/`[^`\n]*`/g, "");
}

/**
 * 从一篇 md 的文本提取它引用的全部附件目标。
 * 返回 [{ raw, target }]，target 统一为不含路径的 basename（Obsidian 唯一解析语义）。
 */
function extractAttachmentRefs(text) {
  const body = stripCode(text);
  const refs = [];
  const seen = new Set();
  const push = (raw, target) => {
    const t = String(target || "").trim();
    if (!t) return;
    if (seen.has(t + "|" + raw)) return;
    seen.add(t + "|" + raw);
    refs.push({ raw, target: t });
  };

  // Obsidian: ![[img.png]] / [[img.png]]（含别名、锚点，含子路径）
  for (const m of body.matchAll(/\[\[([^\]]+)\]\]/g)) {
    const inner = m[1].replace(/\\\|/g, "|").split("|")[0];
    const head = inner.split("#")[0].trim();
    if (!head) continue;
    const base = head.split("/").pop();
    if (ATTACHMENT_EXTS.has(base.split(".").pop().toLowerCase())) push(m[0], base);
  }
  // Markdown: ![alt](path) —— 不含 http(s) 与 data:
  for (const m of body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)) {
    const p = m[2].trim().split(/\s+/)[0];
    if (/^(https?:|data:|mailto:|#)/i.test(p)) continue;
    const base = safeDecode(p.split("/").pop() || "");
    if (ATTACHMENT_EXTS.has(base.split(".").pop().toLowerCase())) push(m[0], base);
  }
  // HTML: <img src="…">
  for (const m of body.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) {
    const p = m[1].trim();
    if (/^(https?:|data:)/i.test(p)) continue;
    const base = safeDecode(p.split("/").pop() || "");
    if (ATTACHMENT_EXTS.has(base.split(".").pop().toLowerCase())) push(m[0], base);
  }
  return refs;
}

/**
 * 全库体检：孤儿附件 / 坏引用 / 体积榜。
 * opts.progress 可选回调。
 */
async function auditVault(app, opts) {
  const allFiles = app.vault.getFiles();
  const mdFiles = allFiles.filter((f) => f.extension === "md");
  const attachments = allFiles.filter((f) => ATTACHMENT_EXTS.has(f.extension));

  // basename → 附件文件（同名冲突记 ambiguous）
  const byName = new Map();
  const ambiguous = new Set();
  for (const a of attachments) {
    if (byName.has(a.name)) ambiguous.add(a.name);
    byName.set(a.name, a.name);
  }

  const referencedNames = new Set();
  const missingRefs = []; // { file, raw, target }
  for (const md of mdFiles) {
    if (md.path.startsWith(".obsidian/")) continue;
    let text = "";
    try {
      text = await app.vault.cachedRead(md);
    } catch (e) {
      continue;
    }
    for (const r of extractAttachmentRefs(text)) {
      referencedNames.add(r.target);
      if (!byName.has(r.target)) {
        missingRefs.push({ file: md, raw: r.raw, target: r.target });
      }
    }
  }

  const orphans = attachments.filter((a) => !referencedNames.has(a.name));
  const orphansAmbiguous = attachments.filter(
    (a) => referencedNames.has(a.name) && ambiguous.has(a.name)
  );

  const sizeTop = attachments
    .map((a) => ({ file: a, size: a.stat ? a.stat.size : 0 }))
    .sort((x, y) => y.size - x.size)
    .slice(0, 15);

  const totalBytes = attachments.reduce((s, a) => s + (a.stat ? a.stat.size : 0), 0);
  const orphanBytes = orphans.reduce((s, a) => s + (a.stat ? a.stat.size : 0), 0);

  return {
    attachments,
    orphans,
    orphansAmbiguous,
    missingRefs,
    sizeTop,
    totalBytes,
    orphanBytes,
    mdCount: mdFiles.length
  };
}

/**
 * 孤儿批量归档：移动到 4-存档/<日期>_孤儿附件/，并写 README。
 * files: TFile[]（由 UI 勾选）。返回移动成功的清单。
 */
async function archiveOrphans(app, files, note) {
  if (!files || !files.length) return { moved: [], failed: [] };
  const stamp = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const day = `${stamp.getFullYear()}-${pad(stamp.getMonth() + 1)}-${pad(stamp.getDate())}`;
  const destDir = `4-存档/${day}_孤儿附件`;
  const moved = [];
  const failed = [];
  for (const f of files) {
    try {
      const dest = normalizePath(`${destDir}/${f.name}`);
      const target = app.vault.getAbstractFileByPath(dest);
      const finalPath = target ? normalizePath(`${destDir}/${stamp.getTime()}_${f.name}`) : dest;
      await app.vault.rename(f, finalPath);
      moved.push({ from: f.path, to: finalPath });
    } catch (e) {
      failed.push({ file: f, error: String(e && e.message) });
    }
  }
  if (moved.length) {
    const readmePath = normalizePath(`${destDir}/README.md`);
    const lines = [
      `# ${day} 孤儿附件归档`,
      "",
      `来源：附件管理器检测为未被任何笔记引用的附件（${note || "手动触发"}）。`,
      `数量：${moved.length}${failed.length ? `，失败 ${failed.length}` : ""}`,
      "",
      "| 原位置 | 归档位置 |",
      "|---|---|"
    ];
    for (const m of moved) lines.push(`| ${m.from} | ${m.to} |`);
    const existed = app.vault.getAbstractFileByPath(readmePath);
    const content = lines.join("\n") + "\n";
    if (existed) {
      const old = await app.vault.read(existed);
      await app.vault.modify(existed, old + "\n\n---\n\n" + content);
    } else {
      await app.vault.create(readmePath, content);
    }
  }
  return { moved, failed, destDir };
}

/**
 * 整理计划（不改动任何文件）：把散落在 assets/ 之外的附件收进 assets/<年-月>/。
 * 返回 { items: [{ file, dest }], bytes }
 */
function planOrganize(app) {
  let files = [];
  try {
    files = app.vault.getFiles();
  } catch (e) {
    files = [];
  }
  const items = [];
  let bytes = 0;
  for (const f of files) {
    const ext = String(f.extension || "").toLowerCase();
    if (!ATTACHMENT_EXTS.has(ext)) continue;
    if (f.path.startsWith("assets/") || f.path.startsWith("4-存档/") || f.path.startsWith(".obsidian/")) continue;
    const parent = f.parent ? f.parent.path : "";
    // 只为散落在库根或在笔记目录里的附件做归档
    if (parent && /^assets\//.test(parent)) continue;
    const d = f.stat && f.stat.mtime ? new Date(f.stat.mtime) : new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const dir = `assets/${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
    items.push({ file: f, dest: normalizePath(`${dir}/${f.name}`) });
    bytes += f.stat ? f.stat.size : 0;
  }
  return { items, bytes };
}

/**
 * 执行整理：移动文件 + 改写「带路径的」引用。
 * 说明：Obsidian 用文件名解析 [[name]]，移动后普通双链仍然有效；
 * 只有显式带路径的引用（![[assets/old/x.png]] 或 ![](old/x.png)）需要改写。
 */
async function applyOrganize(app, plan, onProgress) {
  const moved = [];
  const failed = [];
  const rewrites = new Map(); // oldPath -> newPath

  for (const item of plan.items) {
    try {
      let dest = item.dest;
      if (app.vault.getAbstractFileByPath(dest)) {
        const dot = dest.lastIndexOf(".");
        dest = dest.slice(0, dot) + "-" + Date.now() + dest.slice(dot);
      }
      await app.vault.rename(item.file, dest);
      rewrites.set(item.file.path, dest);
      moved.push({ from: item.file.path, to: dest });
      if (onProgress) onProgress(moved.length, plan.items.length);
    } catch (e) {
      failed.push({ file: item.file.path, error: String(e && e.message) });
    }
  }

  // 改写带路径的引用
  let touched = 0;
  if (rewrites.size) {
    let mds = [];
    try {
      mds = app.vault.getMarkdownFiles();
    } catch (e) {
      mds = [];
    }
    for (const md of mds) {
      let text = "";
      try {
        text = await app.vault.read(md);
      } catch (e) {
        continue;
      }
      let next = text;
      for (const [oldPath, newPath] of rewrites) {
        if (!next.includes(oldPath)) continue;
        next = next.split(oldPath).join(newPath);
      }
      if (next !== text) {
        try {
          await app.vault.modify(md, next);
          touched += 1;
        } catch (e) {
          /* 忽略单篇失败 */
        }
      }
    }
  }

  if (moved.length) {
    const pad = (n) => String(n).padStart(2, "0");
    const now = new Date();
    const day = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const readme = normalizePath(`assets/整理记录-${day}.md`);
    const lines = [
      `# 附件整理 ${day}`,
      "",
      `移动 ${moved.length} 个附件到 assets/<年-月>/，改写 ${touched} 篇笔记中的带路径引用。`,
      "",
      "| 原位置 | 新位置 |",
      "|---|---|"
    ];
    for (const m of moved) lines.push(`| ${m.from} | ${m.to} |`);
    const existing = app.vault.getAbstractFileByPath(readme);
    if (existing) {
      const oldText = await app.vault.read(existing);
      await app.vault.modify(existing, oldText + "\n\n" + lines.join("\n") + "\n");
    } else {
      await app.vault.create(readme, lines.join("\n") + "\n");
    }
  }

  return { moved, failed, touched };
}

/**
 * 通用附件上传入库：任意类型写入 assets/<年-月>/，返回文件。
 * 与图片工具同源，避免两套落盘逻辑。
 */
async function saveAttachment(app, input, opts) {
  const o = opts || {};
  const name = o.name || `attachment-${Date.now()}`;
  const d = o.date || new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const dir = o.dir || `assets/${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  if (!app.vault.getAbstractFileByPath(normalizePath(dir))) {
    try {
      await app.vault.createFolder(normalizePath(dir));
    } catch (e) {
      /* 已存在 */
    }
  }
  let bytes;
  if (input instanceof ArrayBuffer) bytes = new Uint8Array(input);
  else if (input && input.buffer instanceof ArrayBuffer) bytes = new Uint8Array(input.buffer);
  else if (input && typeof input.arrayBuffer === "function") bytes = new Uint8Array(await input.arrayBuffer());
  else throw new Error("无法识别的附件输入");

  let path = normalizePath(`${dir}/${name}`);
  if (app.vault.getAbstractFileByPath(path)) {
    const dot = name.lastIndexOf(".");
    const base = dot > 0 ? name.slice(0, dot) : name;
    const ext = dot > 0 ? name.slice(dot) : "";
    path = normalizePath(`${dir}/${base}-${Date.now()}${ext}`);
  }
  const file = await app.vault.createBinary(path, bytes.buffer);
  return { file, path };
}

module.exports = {
  planOrganize,
  applyOrganize,
  saveAttachment,
  ATTACHMENT_EXTS,
  extractAttachmentRefs,
  auditVault,
  archiveOrphans
};

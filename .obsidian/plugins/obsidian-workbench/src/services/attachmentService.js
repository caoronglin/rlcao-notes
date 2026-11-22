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

module.exports = {
  ATTACHMENT_EXTS,
  extractAttachmentRefs,
  auditVault,
  archiveOrphans
};

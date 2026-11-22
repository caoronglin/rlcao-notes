"use strict";

const { normalizePath, Notice } = require("obsidian");

/**
 * 隐私区服务：
 *  - 锁定 = 写入 .obsidian/app.json 的 userIgnoreFilters（搜索/链接/图谱完全不索引该目录）
 *          + 在 .gitignore 追加该目录（可选，防止隐私内容进入版本历史）
 *  - 解锁 = 移除以上两者
 * Obsidian 的 userIgnoreFilters 支持正则；变更后需重载（提示用户）。
 */

const APP_JSON = ".obsidian/app.json";

async function readJson(adapter, path, fallback) {
  try {
    const raw = await adapter.read(path);
    return raw ? JSON.parse(raw) : { ...fallback };
  } catch (e) {
    return { ...fallback };
  }
}

async function writeJson(adapter, path, obj) {
  await adapter.write(path, JSON.stringify(obj, null, 2));
}

function filterPatternFor(folder) {
  // userIgnoreFilters 是正则；对 vault/隐私 匹配目录本身与其下一切
  return "^" + folder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(/|$)";
}

/**
 * 当前锁定状态。
 */
async function status(app, settings) {
  const folder = (settings.privacyFolder || "").replace(/^\/+|\/+$/g, "");
  const adapter = app.vault.adapter;
  const appJson = await readJson(adapter, APP_JSON, {});
  const pattern = folder ? filterPatternFor(folder) : "";
  const filters = Array.isArray(appJson.userIgnoreFilters) ? appJson.userIgnoreFilters : [];
  const hidden = Boolean(pattern) && filters.some((f) => String(f).trim() === pattern);
  let gitExcluded = false;
  try {
    const gi = await adapter.read(".gitignore");
    gitExcluded = Boolean(folder) && new RegExp("^" + folder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "/?$", "m").test(gi);
  } catch (e) {
    /* no .gitignore */
  }
  const abs = folder ? app.vault.getAbstractFileByPath(normalizePath(folder)) : null;
  const fileCount = abs && abs.children ? abs.children.length : 0;
  return { folder, hidden, gitExcluded, fileCount, pattern };
}

/**
 * 一键锁定/解锁。返回操作后的状态说明文本。
 */
async function setHidden(app, settings, hidden) {
  const folder = (settings.privacyFolder || "").replace(/^\/+|\/+$/g, "");
  if (!folder) throw new Error("请先在设置中填写隐私区目录");
  const adapter = app.vault.adapter;
  const pattern = filterPatternFor(folder);

  // 1) Obsidian 索引隐身
  const appJson = await readJson(adapter, APP_JSON, {});
  const filters = Array.isArray(appJson.userIgnoreFilters) ? appJson.userIgnoreFilters.slice() : [];
  const idx = filters.findIndex((f) => String(f).trim() === pattern);
  if (hidden && idx < 0) filters.push(pattern);
  if (!hidden && idx >= 0) filters.splice(idx, 1);
  appJson.userIgnoreFilters = filters;
  await writeJson(adapter, APP_JSON, appJson);

  // 2) Git 排除（同步管理，避免隐私内容进入版本历史）
  let gi = "";
  try {
    gi = await adapter.read(".gitignore");
  } catch (e) {
    gi = "";
  }
  const lineRe = new RegExp("^" + folder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "/?\\s*$", "m");
  if (hidden && !lineRe.test(gi)) {
    gi = (gi.endsWith("\n") || !gi ? gi : gi + "\n") +
      "\n# ===== Obsidian Workbench 隐私区（勿提交，解锁后可移除）=====\n" + folder + "/\n";
    await adapter.write(".gitignore", gi);
  }
  if (!hidden && lineRe.test(gi)) {
    const lines = gi.split("\n").filter((l) => !lineRe.test(l + "\n") && !(l.trim() === folder || l.trim() === folder + "/"));
    await adapter.write(".gitignore", lines.join("\n"));
  }

  const st = await status(app, settings);
  const verb = hidden ? "已锁定" : "已解锁";
  new Notice(
    `隐私区 ${verb}（${folder}，${st.fileCount} 个文件）。搜索与链接索引${hidden ? "不再收录该区" : "已恢复"}，需重载 Obsidian 生效。`,
    8000
  );
  return st;
}

/**
 * 确保隐私区目录存在（首次使用时创建，并放一份说明文件）。
 */
async function ensureFolder(app, settings) {
  const folder = (settings.privacyFolder || "").replace(/^\/+|\/+$/g, "");
  if (!folder) throw new Error("请先在设置中填写隐私区目录");
  const abs = app.vault.getAbstractFileByPath(normalizePath(folder));
  if (!abs) {
    await app.vault.createFolder(normalizePath(folder));
    await app.vault.create(
      normalizePath(folder + "/说明.md"),
      "---\ntags: [privacy]\n---\n\n# 隐私区\n\n本目录由 Obsidian Workbench 隐私模块管理。\n\n- 锁定后：搜索、反向链接、图谱完全不收录本目录，且被 Git 排除。\n- 解锁后：恢复正常索引。\n- 切换后需重载 Obsidian（Ctrl/Cmd+P → Reload app without saving）。\n"
    );
    new Notice("隐私区目录已创建：" + folder);
  }
  return abs;
}

module.exports = { status, setHidden, ensureFolder };

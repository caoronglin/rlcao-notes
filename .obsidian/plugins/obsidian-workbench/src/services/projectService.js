"use strict";

const { normalizePath, Notice } = require("obsidian");
const { formatDate } = require("../utils");

/**
 * 项目管理服务：扫描 projectFolder 的一级实体（目录项目或单文件项目），
 * 读取 frontmatter 状态；支持基于模板的新建。
 */

function parseFrontmatter(text) {
  const out = {};
  if (!text || !text.startsWith("---")) return out;
  const end = text.indexOf("\n---", 3);
  if (end < 0) return out;
  const block = text.slice(4, end);
  for (const line of block.split("\n")) {
    const idx = line.indexOf(":");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (!key || !val) continue;
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    out[key] = val;
  }
  return out;
}

const MAIN_FILE_NAMES = ["index.md", "README.md"];

/**
 * 目录项目的「主文件」：同名 .md → index.md → README.md → 第一个带 type:project 的 md。
 */
function pickMainFile(dirAbs) {
  const sameName = dirAbs.children.find(
    (c) => c.extension === "md" && c.basename === dirAbs.name
  );
  if (sameName) return sameName;
  for (const name of MAIN_FILE_NAMES) {
    const hit = dirAbs.children.find((c) => c.name === name);
    if (hit) return hit;
  }
  return dirAbs.children.find((c) => c.extension === "md") || null;
}

/**
 * 列出项目：projectFolder 下的一级目录与 .md 文件。
 * 返回 [{ name, kind, file, status, due, priority, noteCount }]
 */
async function listProjects(app, settings) {
  const folder = (settings.projectFolder || "").replace(/^\/+|\/+$/g, "");
  if (!folder) return [];
  const abs = app.vault.getAbstractFileByPath(normalizePath(folder));
  if (!abs || !abs.children) return [];
  const out = [];
  for (const child of abs.children) {
    if (child.extension === "md") {
      let meta = {};
      try {
        meta = parseFrontmatter(await app.vault.cachedRead(child));
      } catch (e) {
        /* ignore */
      }
      out.push({
        name: child.basename,
        kind: "file",
        file: child,
        status: meta.status || "",
        due: meta.due || "",
        priority: meta.priority || "",
        noteCount: 1
      });
    } else if (child.children) {
      const main = pickMainFile(child);
      let meta = {};
      if (main) {
        try {
          meta = parseFrontmatter(await app.vault.cachedRead(main));
        } catch (e) {
          /* ignore */
        }
      }
      out.push({
        name: child.name,
        kind: "dir",
        file: main,
        status: meta.status || "",
        due: meta.due || "",
        priority: meta.priority || "",
        noteCount: child.children.length
      });
    }
  }
  out.sort((a, b) => (a.name < b.name ? -1 : 1));
  return out;
}

const PROJECT_TEMPLATE = [
  "---",
  'type: project',
  'status: 进行中',
  'created: {DATE}',
  'due: ""',
  'priority: 普通',
  'tags: [project]',
  "---",
  "# {TITLE}",
  "",
  "## 目标与完成标准",
  "",
  "## 里程碑",
  "- [ ] 确认目标与范围",
  "- [ ] 完成关键工作",
  "- [ ] 整理结果与交付物",
  "",
  "## 下一步行动",
  "- [ ] ",
  "",
  "## 关联实验、笔记与附件",
  "",
  "## 决策与进展日志",
  "",
  "## 风险与待确认",
  ""
].join("\n");

/**
 * 新建项目：在 projectFolder 下创建 <name>.md（若模板存在则优先用库内模板）。
 */
async function createProject(app, settings, name) {
  const clean = (name || "").trim();
  if (!clean) throw new Error("项目名不能为空");
  const folder = (settings.projectFolder || "").replace(/^\/+|\/+$/g, "");
  if (!folder) throw new Error("请先在设置中填写项目目录");
  if (!app.vault.getAbstractFileByPath(normalizePath(folder))) {
    await app.vault.createFolder(normalizePath(folder));
  }
  const target = normalizePath(`${folder}/${clean}.md`);
  if (app.vault.getAbstractFileByPath(target)) {
    throw new Error(`已存在同名项目：${clean}.md`);
  }
  // 库内 Templater 模板优先
  let content = null;
  const tplPath = normalizePath("muban/project-dashboard-template.md");
  const tplFile = app.vault.getAbstractFileByPath(tplPath);
  if (tplFile) {
    content = await app.vault.cachedRead(tplFile);
    content = content
      .replace(/\{\{VALUE:[^}]*\}\}/g, clean)
      .replace(/\{\{DATE:YYYY-MM-DD\}\}/g, formatDate(new Date(), "YYYY-MM-DD"))
      .replace(/\{\{DATE\}\}/g, formatDate(new Date(), "YYYY-MM-DD"));
  } else {
    content = PROJECT_TEMPLATE.replace(/\{DATE\}/g, formatDate(new Date(), "YYYY-MM-DD"))
      .replace(/\{TITLE\}/g, clean)
      .replace(/\{DATE\}/g, formatDate(new Date(), "YYYY-MM-DD"));
  }
  const file = await app.vault.create(target, content);
  new Notice(`项目已创建：${clean}`);
  await app.workspace.getLeaf(false).openFile(file);
  return file;
}

module.exports = { listProjects, createProject, parseFrontmatter };

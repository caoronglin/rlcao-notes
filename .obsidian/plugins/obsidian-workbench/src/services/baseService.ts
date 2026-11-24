// @ts-nocheck -- 渐进迁移: 语法已迁 TS, 类型化排入后续批次
"use strict";

import { normalizePath, Notice } from "obsidian";

/**
 * 多维表格（Bases / duowei-table）支持：
 *   - 扫描库内 .base 与 .duowei 文件
 *   - 新建 .duowei（duowei-table 插件识别的最小合法结构）
 *
 * 说明：.base 是 Obsidian 官方 Bases 的格式，本体由 Obsidian 渲染，
 * 插件只负责发现/打开/归档；.duowei 由 duowei-table 插件渲染。
 */

const BASE_EXTS = ["base", "duowei"];

const KIND_LABEL = {
  base: "Bases",
  duowei: "Duowei"
};

const DEFAULT_FOLDER = "vault/工作台";

function listBases(app, folderPrefix) {
  const prefix = String(folderPrefix || "").replace(/^\/+|\/+$/g, "");
  let files = [];
  try {
    files = app.vault.getFiles();
  } catch (e) {
    return [];
  }
  return files
    .filter((f) => BASE_EXTS.includes(String(f.extension || "").toLowerCase()))
    .filter((f) => !prefix || f.path === prefix || f.path.startsWith(prefix + "/"))
    .filter((f) => !f.path.startsWith("4-存档/"))
    .map((f) => ({
      file: f,
      kind: KIND_LABEL[String(f.extension).toLowerCase()] || f.extension,
      ext: String(f.extension).toLowerCase()
    }))
    .sort((a, b) => (a.file.path < b.file.path ? -1 : 1));
}

/** duowei-table 的最小可识别结构（空表：一行一列的表头） */
function duoweiTemplate(title) {
  return (
    JSON.stringify(
      {
        version: 1,
        name: title || "新建工作表",
        views: [{ type: "table", name: "表格" }],
        fields: [
          { id: "title", name: "名称", type: "text" },
          { id: "status", name: "状态", type: "select", options: ["待开始", "进行中", "已完成"] }
        ],
        rows: []
      },
      null,
      2
    ) + "\n"
  );
}

async function createBase(app, name, folder) {
  const title = String(name || "新建工作表").trim() || "新建工作表";
  const dir = normalizePath(folder || DEFAULT_FOLDER);
  if (!app.vault.getAbstractFileByPath(dir)) {
    try {
      await app.vault.createFolder(dir);
    } catch (e) {
      /* 已存在 */
    }
  }
  let path = normalizePath(`${dir}/${title}.duowei`);
  if (app.vault.getAbstractFileByPath(path)) {
    path = normalizePath(`${dir}/${title}-${Date.now()}.duowei`);
  }
  const file = await app.vault.create(path, duoweiTemplate(title));
  new Notice(`已创建多维表格：${path}`);
  await app.workspace.getLeaf(false).openFile(file);
  return file;
}

export {
  BASE_EXTS,
  listBases,
  createBase,
  duoweiTemplate,
  DEFAULT_FOLDER
};

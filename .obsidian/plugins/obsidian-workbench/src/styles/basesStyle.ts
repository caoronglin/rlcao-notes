// @ts-nocheck -- 渐进迁移: 语法已迁 TS, 类型化排入后续批次
"use strict";

/**
 * 多维表格（duowei-table / Bases）统一样式。
 * 目标：把 .mt-* 组件的默认外观对齐工作台的 Ant Design 风格——
 * 更轻的分隔线、更稳定的行高、表头吸顶、按钮不抢戏。
 * 由「多维表格：应用统一样式」命令写入 .obsidian/snippets/workbench-bases.css。
 */
const BASE_STYLE_CSS = `/* 由 Obsidian Workbench 生成：多维表格统一外观 */

/* 命令栏：扁平化，去掉重阴影 */
.mt-command-bar {
  gap: 6px;
  padding: 6px 10px;
  border-radius: 10px;
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
  box-shadow: none;
}

.mt-command-button {
  border-radius: 7px;
  font-size: 0.82em;
  padding: 3px 9px;
  border: 1px solid transparent;
  background: transparent;
  box-shadow: none;
}

.mt-command-button:hover {
  background: var(--background-modifier-hover);
  border-color: var(--background-modifier-border);
}

/* 表头：吸顶 + 细分隔线 */
.mt-table thead th,
.mt-table__header {
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--background-secondary);
  font-weight: 600;
  font-size: 0.82em;
  letter-spacing: 0.01em;
  border-bottom: 1px solid var(--background-modifier-border);
}

/* 行：等距、hover 轻高亮，去掉斑马纹的脏感 */
.mt-table tbody tr,
.mt-row {
  border-bottom: 1px solid color-mix(in srgb, var(--background-modifier-border) 60%, transparent);
}

.mt-table tbody tr:hover,
.mt-row:hover {
  background: var(--background-modifier-hover);
}

.mt-table td,
.mt-cell {
  padding: 6px 10px;
  font-size: 0.86em;
  vertical-align: middle;
}

/* 单元格编辑器 */
.mt-cell-editor {
  border-radius: 7px;
  border: 1px solid var(--interactive-accent);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--interactive-accent) 22%, transparent);
}

/* 看板与画廊卡片：统一圆角 + 轻阴影 */
.mt-kanban-card,
.mt-gallery-card {
  border-radius: 10px;
  border: 1px solid var(--background-modifier-border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
  background: var(--background-primary);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.mt-kanban-card:hover,
.mt-gallery-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px -8px rgba(0, 0, 0, 0.45);
}

.mt-gallery-card__cover { border-radius: 8px 8px 0 0; }

/* 徽章与计数 */
.mt-command-button__badge {
  border-radius: 999px;
  font-size: 0.68em;
  padding: 0 5px;
  background: color-mix(in srgb, var(--interactive-accent) 18%, transparent);
  color: var(--text-normal);
}
`;

export {
  BASE_STYLE_CSS
};

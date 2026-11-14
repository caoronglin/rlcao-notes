# 2026-11-14 归档说明

本次归档伴随「工作台重做 + 插件收敛 + 配置纳入版本控制」一起进行。

## 1. CSS 片段（`obsidian-snippets/`）

| 文件 | 原位置 | 被谁取代 | 理由 |
|---|---|---|---|
| `workbench.css` | `.obsidian/snippets/` | `antd-workbench.css` | 旧版首页样式，长期未启用（不在 `appearance.json` 的启用清单里），且与 `workflow-workbench.css` 规则重叠 |
| `workflow-workbench.css` | `.obsidian/snippets/` | `antd-workbench.css` | 半成品：只有 48 行，首页卡片大多没有样式 |
| `ui-polish.css` | `.obsidian/snippets/` | — | 515 行的全局美化，从未启用；启用会与 Minimal 主题和 `notes-focus.css` 打架 |
| `readable-width.css` | `.obsidian/snippets/` | `notes-focus.css` | 两者都限 900px 行宽，`notes-focus.css` 更完整（还管行高与 UI 字号） |
| `supercharged-links-gen.css` | `.obsidian/snippets/` | — | Supercharged Links 插件早已不在本库，这是它自动生成的空文件 |

## 2. 社区插件（未进仓库）

下架 7 个插件：Better Export PDF、Various Complements、Calendar、Advanced Tables（table-editor）、Image Toolkit、HTML Studio（zj-html-studio）、Mindmap NextGen。

- 插件包**没有**放进仓库（约 13 MB 二进制，进来只会让库变胖），整体备份在库外：
  `/mnt/data/_backup/obsidian-plugins-archive-2026-11-14/`
- 同时备份了当时的 `.obsidian/` 全量：`/mnt/data/_backup/obsidian-config-2026-11-14-1528.tgz`
- 恢复方式：把插件目录拷回 `.obsidian/plugins/<id>/`，再把 id 加进 `.obsidian/community-plugins.json`。

Mindmap NextGen 由自研插件 `xl-toolbox` 取代，功能对照见 `AGENTS.md` §10。

## 3. 需要一起看的改动

- `.gitignore`：`.obsidian/` 由整目录排除改为白名单（配置与自研插件入库，插件设置仍排除）。
- `Home.md` / `panel/*.md`：工作台按 Ant Design 规范重写。
- `.cnb.yml` + `scripts/ci/vault_check.py`：CNB 上每次推送跑一次库结构自检。

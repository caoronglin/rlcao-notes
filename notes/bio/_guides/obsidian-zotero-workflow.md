---
collection:
  profile: notebook
  id: bio
title: obsidian-zotero-workflow
date: 2026-10-06
---
# Obsidian + Zotero 科研工作台完整配置指南

>综合三篇知乎文章的最佳实践：
> - [手把手教程！zotero和obsidian如何联动](https://zhuanlan.zhihu.com/p/672287270) — Zotero Integration 注释同步
> - [Obsidian+Zotero打造最强科研工具链](https://zhuanlan.zhihu.com/p/639325772) — Mdnotes + DataView 文献管理
> - [打造自己的工作台](https://zhuanlan.zhihu.com/p/409409946) — Obsidian Workspace 布局
> - [项目看板 2.0：一个研究生的 Obsidian 项目管理实践](https://sspai.com/post/98928) — 项目看板 + 里程碑规划

---

## 目录

1. [整体架构](#1-整体架构)
2. [Zotero 端配置](#2-zotero-端配置)
3. [Obsidian 端配置](#3-obsidian-端配置)
4. [模板详解](#4-模板详解)
5. [工作台布局](#5-工作台布局)
6. [DataView 查询集](#6-dataview-查询集)
7. [标签体系](#7-标签体系)
8. [项目管理：项目看板 2.0](#8-项目管理项目看板-20)
9. [Git 备份策略](#9-git-备份策略)
10. [日常使用流程](#10-日常使用流程)

---

## 1. 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                    浏览器端                               │
│             Zotero Connector 插件                         │
│           (一键抓取文献元数据 + PDF)                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    Zotero 7                              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ PDF 管理      │  │ PDF 阅读批注  │  │ 文献元数据管理  │  │
│  │ (附件管理)    │  │ (高亮+批注)  │  │ (标签+条目)    │  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘  │
│         │                 │                   │          │
│         │           Zotero Integration        │          │
│         │           (同步批注到 Obsidian)       │          │
│         │                 │                   │          │
│         └─────┬───────────┴───────────────────┘          │
│               │  Mdnotes (导出元数据笔记)                  │
│               │  Better BibTex (生成 citekey)             │
└───────────────┼─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│                    Obsidian                              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Mdnotes       │  │ Zotero       │  │ DataView      │  │
│  │ 文献元数据笔记 │  │ Integration  │  │ 论文库表格     │  │
│  │ (自动生成)    │  │ 批注笔记      │  │ (综述查询)    │  │
│  └──────────────┘  └──────────────┘  └───────────────┘  │
│                                                          │
│  Workspace 快速切换：文献阅读 | 综述写作 | 日常记录        │
└─────────────────────────────────────────────────────────┘
```

### 核心理念

| 工具 | 职责 | 哲学 |
|------|------|------|
| **Zotero** | PDF 下载、管理、阅读、批注 | 做好一件事 |
| **Obsidian** | Markdown 笔记编辑、综述写作、知识关联 | UNIX 哲学 |
| **Mdnotes** | 元数据 → Markdown（桥梁） | 最小耦合 |
| **Zotero Integration** | 批注 → 双链笔记（桥梁） | 即时同步 |
| **DataView** | 论文库 → 表格查询 | 结构化展示 |

---

## 2. Zotero 端配置

### 2.1 安装所需插件

| 插件 | 作用 | 安装方式 |
|------|------|---------|
| **Better BibTex for Zotero** | 生成 citekey，Mdnotes 模板引用 | [GitHub](https://github.com/retorquere/zotero-better-bibtex) |
| **Mdnotes** | 自动生成文献元数据 Markdown 笔记 | [GitHub](https://github.com/argenos/zotero-mdnotes) |
| **zotero-markdb-connect** | Zotero ↔ Obsidian 双向跳转 + 标签同步 | [GitHub](https://github.com/daeh/zotero-markdb-connect) |

### 2.2 Better BibTex 配置

1. 打开 Zotero → 编辑 → 首选项 → Better BibTeX
2. 在「Citation key formula」中设置格式，推荐：`[auth:lower][year]` → 生成如 `smith2024`
3. 确保「Automatically update citation keys on change」勾选

### 2.3 Zotero-markdb-connect 配置

1. 安装后在 Zotero → 工具 → markdb 首选项
2. 设置 **同步文件夹路径** 为 Obsidian 库中存放批注笔记的目录，例如：

   ```
   D:/data/rlcao/notes/bio/_annotations/
   ```

3. 设置 Obsidian 库名（vault name）：

   ```
   rlcao
   ```

4. 设置默认文件过滤器为：`*.md`
5. 联动使用 Better BibTex 的 `citekey` 来识别条目

### 2.4 Mdnotes 配置（关键）

1. 打开 Zotero → 工具 → Mdnotes 首选项
2. 设置**模板目录**指向：

   ```
   D:/data/rlcao/muban/
   ```

3. 确保模板文件命名为 `Mdnotes Default Template.md`（不要改这个名字）
4. 在 Zotero → 编辑 → 首选项 → 高级 → 编辑器
5. 搜索 `mdnotes.placeholder.` 可以自定义占位符

---

## 3. Obsidian 端配置

### 3.1 所需插件

| 插件 | 作用 | 安装位置 |
|------|------|---------|
| **Zotero Integration** | 导入 Zotero 批注到 Obsidian | 社区插件 |
| **DataView** | 元数据表格化展示 | 社区插件 |
| **Tag Wrangler** | 标签管理增强 | 社区插件 |
| **Advanced Tables** | 表格编辑增强 | 社区插件 |
| **Excalidraw** | 绘制示意图 | 社区插件 |
| **Recent Files** | 最近文件侧栏 | 社区插件 |
| **Calendar** | 日历视图 | 社区插件 |

### 3.2 Zotero Integration 插件配置

1. 在 Obsidian 社区插件中安装 Zotero Integration
2. 插件设置 → Note Import Location：

   ```
   notes/bio/_annotations/
   ```

3. Import Formats → 设置导入格式模板路径：

   ```
   muban/zotero-annotation-template.md
   ```

4. 设置图片附件路径：

   ```
   assets/zotero-annotations/
   ```

### 3.3 模板配置

确认 Obsidian 核心插件中的「模板」功能已开启：

- 设置 → 核心插件 → 模板 → 启用
- 模板文件夹位置：`muban/`

现在你输入 `Ctrl/Cmd + P` → 输入「模板」即可插入 `research-note-template.md`

---

## 4. 模板详解

### 4.1 Mdnotes Default Template

>位置：`muban/mdnotes-default-template.md`

```yaml
---
作者:: {{author}}
作者机构::
日期:: {{date}}
出处:: {{publicationTitle}}
标签:: {{tags}}
citekey:: {{citekey}}
DOI:: {{DOI}}
pdf:: {{pdfAttachments}}
zotero:: {{localLibrary}}
备注::
阅读状态:: [[status/to_read]]
---
```

**语法说明：**

- `::` 是 DataView 的键值对语法，双冒号后自动识别为字段
- `{% raw %}{% raw %}{{}}{% endraw %}{% endraw %}` 是 Mdnotes 占位符，由插件自动填充
- `#status/to_read` 是嵌套标签（Obsidian 支持），用于过滤查询

**自动填充效果：**

```yaml
---
作者:: Smith J; Wang L
日期:: 2024-03-15
出处:: Nature Biotechnology
标签:: [[scRNA-seq]] [[macaque]]
citekey:: smith2024
DOI:: 10.1038/s41587-024-xxxxx
pdf:: [PDF](attachments::Smith_2024.pdf)
zotero:: [Zotero](zotero://select/library/items/ABCDEF)
---
```

### 4.2 Zotero Annotation Template

>位置：`muban/zotero-annotation-template.md`

这个模板用于 Zotero Integration 导入批注。Jinja2 语法动态渲染每条批注。

**颜色映射规则：**

| 颜色 | 含义 | 本文采用的语义 |
|------|------|---------------|
| 🔵 `#2ea8e5` (蓝) | 关键概念/定义 | 方法要点 |
| 🔴 `#ff6666` (红) | 重要结论 | 核心结果 |
| 🟡 `#ffd400` (黄) | 值得注意 | 我的思考触发点 |
| 🟣 `#a28ae5` (紫) | 疑问 | 待深挖 |
| 🟢 `#5fb236` (绿) | 实验方法 | 可复用方案 |

### 4.3 Research Note Template

>位置：`muban/research-note-template.md`

用于手动新建论文笔记（当不需要全量 Mdnotes 导出时）。通过 Obsidian 核心插件「模板」插入。

---

## 5. 工作台布局

利用 Obsidian 核心插件「工作区」（Workspace），可以保存不同任务的布局，一键切换。

### 开启工作区

设置 → 核心插件 → 工作区 → 启用

左侧栏会出现「管理工作区布局」图标。

### 布局 A：文献阅读

```
┌──────────────┬──────────────────────┬──────────────┐
│  文件列表     │                      │  Zotero 批注   │
│  (左侧栏)    │   编辑区               │  (右侧栏)     │
│              │   (论文笔记)           │              │
│  最近文件     │                      │  局部关系图谱  │
│  (Recent)    │                      │              │
└──────────────┴──────────────────────┴──────────────┘
```

**保存为**：`文献阅读`

### 布局 B：综述写作

```
┌──────────────┬──────────────────────┬──────────────┐
│  文件列表     │                      │  大纲         │
│              │   编辑区               │  (Outliner)  │
│  DataView    │   (综述 MD)           │              │
│  论文表格     │                      │  关系图谱      │
│              │                      │  (全局)       │
└──────────────┴──────────────────────┴──────────────┘
```

**保存为**：`综述写作`

### 布局 C：日常记录

```
┌──────────────┬──────────────────────┬──────────────┐
│  文件列表     │                      │  日历         │
│              │   编辑区               │  (Calendar)  │
│  标签面板     │   (课堂笔记/实验记录)   │              │
│              │                      │  时间线       │
│              │                      │              │
└──────────────┴──────────────────────┴──────────────┘
```

**保存为**：`日常记录`

### 使用方式

1. 按上方的分区排布好面板
2. 点击左侧栏「管理工作区布局」→ 输入名称 → 保存
3. 下次只需点击「管理工作区布局」→ 选择布局名 → 一键切换

---

## 6. DataView 查询集

将以下查询放入你的笔记中，DataView 会自动渲染成表格。

### 6.1 论文库总览

```dataview
table 日期, 出处, 作者, 阅读状态, 备注
from [[paper]]
sort 日期 desc
```

### 6.2 按标签筛选

```dataview
table 日期, 出处, 作者, 阅读状态
from [[paper]] and [[scRNA-seq]]
sort 日期 desc
```

### 6.3 按阅读状态筛选

```dataview
table 日期, 出处, 作者, 标签
from [[status/reading]]
sort 日期 desc
```

### 6.4 特定领域的综述用表

```dataview
table 日期, 出处, 作者机构, 备注, pdf
from [[bio/single-cell]]
sort 日期 asc
```

### 6.5 待读论文

```dataview
task from [[paper]]
where !completed
```

### 6.6 年度阅读统计

```dataview
table length(rows) as "文献数量"
from [[paper]]
where 年份 != null
group by 年份 as "年份"
sort 年份 desc
```

---

## 7. 标签体系

统一的标签规范，让 DataView 查询更高效。

### 7.1 状态标签

| 标签 | 含义 |
|------|------|
| `#status/to_read` | 待读 |
| `#status/reading` | 正在读 |
| `#status/read` | 已读完 |
| `#status/reviewed` | 已综述 |

### 7.2 领域标签

| 标签 | 含义 |
|------|------|
| `#bio/scRNA-seq` | 单细胞转录组 |
| `#bio/epigenomics` | 表观基因组学 |
| `#bio/methylation` | DNA 甲基化 |
| `#bio/multiomics` | 多组学 |
| `#bio/macrophage` | 巨噬细胞相关 |

### 7.3 类型标签

| 标签 | 含义 |
|------|------|
| `#type/review` | 综述文章 |
| `#type/research` | 研究论文 |
| `#type/preprint` | 预印本 |
| `#type/method` | 方法学论文 |

### 7.4 Zotero 端彩色标签（zotero-markdb-connect 同步）

| 颜色 | 含义 |
|------|------|
| 🟢 绿 | 已同步到 Obsidian |
| 🔵 蓝 | 已生成 Mdnotes 笔记 |
| 🟣 紫 | 待精读 |
| 🟠 橙 | 综述引用候选 |

---

## 8. 项目管理：项目看板 2.0

>参考：[项目看板 2.0：一个研究生的 Obsidian 项目管理实践](https://sspai.com/post/98928) — 西郊次生林

研究生阶段的科研项目往往没有明确的路径可循，需要不断试错。传统的甘特图规划不适合这类探索性项目。**项目看板 2.0** 提出了一套基于 **里程碑规划 + PARA 标签 + 周志 + Canvas** 的方案。

### 8.1 核心理念

| 理念 | 说明 |
|------|------|
| **里程碑规划** | 用成就节点代替精确排期，适合探索性项目 |
| **PARA 标签法** | 用标签代替文件夹，项目知识卡片打上项目标签 |
| **周志系统** | 所有待办、灵感、碎碎念写在周志中，Dataview 汇总 |
| **Canvas 路线图** | 用 Obsidian Canvas 绘制里程碑图，红色=活跃路径 |

### 8.2 所需插件

| 插件 | 作用 |
|------|------|
| **Tasks** | 高级任务管理（已安装） |
| **Periodic Notes** | 自动创建周志文件 |
| **Calendar** | 日历视图，快速跳转 |
| **Dataview** | 任务/笔记汇总（已安装） |

### 8.3 标签体系（PARA 标签法）

为每个项目分配一个唯一标签，格式：`#project/项目名`

```
[[project/my-research]]      ← 我的研究项目
[[project/literature-review]] ← 文献综述项目
```

笔记打上项目标签后，Dataview 自动汇总到项目看板：

```dataview
table 创建日期, 标签
from [[project/my-research]]
sort 创建日期 desc
```

### 8.4 项目看板模板

位置：`muban/project-dashboard-template.md`

在 Obsidian 中用 Templater 新建项目时选择此模板：

- 自动创建项目看板
- 预留 Canvas 规划图引用
- Dataview 自动汇总项目笔记、任务、周志

### 8.5 里程碑规划（Canvas）

用 Obsidian 核心插件 Canvas 绘制路线图：

1. 新建 Canvas：`项目/XXX/XXX-plan.canvas`
2. 每个节点是一个里程碑
3. 用箭头连接里程碑顺序
4. **红色节点** = 当前活跃路径
5. 项目看板用 `![[XXX-plan.canvas]]` 嵌入

### 8.6 周志系统

使用 Periodic Notes 插件，所有项目共用一套周志：

- 文件名格式：`YYYY-Www`（如 `2026-W24`）
- 各项目日志用一级标题区分
- 待办任务直接写在对应标题下
- Dataview 自动汇总到各项目看板

### 8.7 任务管理

**轻量方式** — 直接 Markdown 任务列表，Dataview 汇总：

```markdown
- [ ] 分析单细胞数据
- [x] 阅读文献
```

**高级方式** — Tasks 插件，支持开始/截止日期、优先级、重复：

```markdown
- [ ] 完成实验设计 📅 2026-06-20 ⏫ 🔁 every week
```

汇总到项目看板的 Tasks 查询：

```tasks
not done
path includes 项目/周志
sort by priority
```

### 8.8 完整工作流

```
每天打开 Obsidian
  ↓
点击项目看板（从首页/面板）
  ↓
查看待办任务 → 开始工作
  ↓
工作过程中零碎信息记入周志
  ↓
有价值的想法 → 整理为知识卡片 + 打项目标签
  ↓
每周复盘 → 修改 Canvas 路线图 → 规划下批任务
  ↓
项目完成 → 项目看板 finished: true（归档）
```

---

## 9. Git 备份策略

本库已启用 Git，通过 `D:/data/rlcao/.gitignore` 控制备份范围。

### 当前备份的内容

```
✅ notes/          → 笔记（含论文笔记、课堂笔记、实验记录）
✅ muban/          → 模板文件
✅ _posts/         → 博客文章
✅ wiki/           → Wiki 页面
✅ assets/         → 资产文件
```

### 不备份的内容

```
❌ .obsidian/      → 插件配置（含 API Key，安全考虑）
❌ 日记/           → 个人日记隐私
❌ panel/          → 临时面板
❌ .trash/         → 回收站
```

### 推荐操作

```bash
# 查看待提交变更
cd D:/data/rlcao && git status

# 提交更新
git add .
git commit -m "feat: 添加科研工作台模板和配置指南"

# 推送到远程（如果配置了远程仓库）
git push
```

>建议配置远程仓库（GitHub/Gitee），实现多设备同步和灾难恢复。

---

## 10. 日常使用流程

### 发现一篇论文时

```
1. 浏览器 → Zotero Connector 一键抓取
2. Zotero 中打标签 (#scRNA-seq, [[status/to_read]])
3. Zotero → 右键 → Mdnotes → 创建完整导出笔记
4. 自动生成 Markdown 笔记到 notes/bio/ 下
```

### 阅读论文时

```
1. Zotero 中双击 PDF → 内置阅读器打开
2. 高亮关键段落 + 写批注
3. Obsidian → Ctrl+P → Zotero Integration 导入批注
4. 导入的批注自动分类（按颜色）
```

### 整理综述时

```
1. 切换到「综述写作」工作区
2. DataView 表格自动汇总所有相关论文
3. 点击笔记链接快速跳转
4. 在编辑区撰写综述，引用时跳回原文
```

### 每日备份

```bash
# 一键备份
cd D:/data/rlcao && git add . && git commit -m "vault backup: $(date +'%Y-%m-%d %H:%M:%S')"
```

>可配置 cron 任务自动执行每日备份。

---

## 致谢

本文综合了以下三篇知乎文章的最佳实践，并结合实际需求做了融合优化：

1. [第37期 手把手教程！zotero和obsidian如何联动](https://zhuanlan.zhihu.com/p/672287270) — Zotero Integration 注释同步方案
2. [Obsidian+Zotero打造最强科研工具链](https://zhuanlan.zhihu.com/p/639325772) — Mdnotes + DataView 文献管理方案
3. [打造自己的工作台【玩转Obsidian的保姆级教程】](https://zhuanlan.zhihu.com/p/409409946) — Workspace 布局方案
4. [项目看板 2.0：一个研究生的 Obsidian 项目管理实践](https://sspai.com/post/98928) — 里程碑规划 + PARA 标签 + 周志

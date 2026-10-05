---
title: 存档索引 · 2026-10-05
date: 2026-10-05
tags: [存档, PARA]
---

# 存档索引 · 2026-10-05

按 PARA §3.1「归档现有文件」建立。本次只归档**确认的沉淀物**，不做推测性清理。

回滚点：git tag `pre-PARA-2026-10-05` → `b85d50a`

---

## 酶工程-被取代版本/

来自 `notes/class-notes/` 的**双树分叉**。同一门课被拆到两棵目录树，各带一个 `_MOC.md`。

| 文件 | 原位置 | 被谁取代 | 理由 |
|---|---|---|---|
| `酶工程复习.md` | `class-notes/class-notes/` | `notes/class-notes/酶工程/REVIEW_KNOWLEDGE.md` | md5 不同但内容同源；后者带教材元数据与「全 9 章知识整理」结构，为完善版 |
| `酶工程_MOC-stub.md` | `class-notes/酶工程/_MOC.md` | `notes/class-notes/酶工程/_MOC.md` | 77 字节占位索引，仅 1 条链接；已由合并后的完整 MOC 取代 |

分叉的另一侧（真实索引 + 第 2、5 课）已 `git mv` 归并进 `notes/class-notes/酶工程/`，误嵌套层 `class-notes/class-notes/` 已消除。

---

## _posts-重复内容/

| 文件 | 原位置 | 被谁取代 | 理由 |
|---|---|---|---|
| `利用Hexo框架搭建静态博客.md` | `_posts/` | `_posts/hexo.md` | 同一篇文章，仅去除粗体标记；`hexo.md` 具备完整 Hexo-Next frontmatter |

---

## 空存根（已删除，git 无记录）

这三个目录**为空或仅含 `.gitkeep`**，Git 本就不跟踪空目录，故无文件留存。记录于此以便重建。

| 目录 | 状态 | 说明 |
|---|---|---|
| `notes/RUST/` | 0 文件 | 空存根，从未写入 |
| `assets/zotero-annotations/` | 0 文件 | ⚠️ `muban/zotero-annotation-template.md` 已存在但落盘端为空，Zotero 工作流未接通，重建时需一并配置 |
| `assets/zotlit-img/` | 仅 `.gitkeep` | zotlit 插件的图床中转目录，同样未接通 |

---

## 刻意**未**归档的内容

PARA §3.3「永远不要在需要存放内容前创建空文件夹」的反向原则：**有实内容的目录不因体量小而归档**。

| 保留项 | 体量 | 判定 |
|---|---|---|
| `notes/lab-notes/wuli/` | 2 份实验报告，19.5 KB | 实体资料，领域/资源 |
| `notes/CNN/` | 3 篇笔记，3.6 KB | 兴趣资源 |
| `notes/数据分析/` | 1 篇，703 B | 技能资源 |
| `notes/bio/生信学习/covid_cite.h5ad` | **289 MB** | ⚠️ 见下 |

### 关于 `covid_cite.h5ad`（289 MB）

体量最大，但**刻意不归档**，理由有三：

1. 它是 `notes/bio/生信学习/AnnData.ipynb` 与 `AnnData.md` 直接引用的教程数据，属**活资源**而非沉淀物。
2. 移动它会切断 notebook 的可复现性。
3. 它已由 `.gitignore` 的 `*.h5ad` 规则排除，**不占仓库体积**，归档它换不来任何收益。

附带发现：该数据集的 lamindb 实例记录的是 **Windows 路径** `D:/data/rlcao/notes/bio/生信学习/单细胞/笔记/my_data`，而当前平台为 Linux（`/media/rlcao/...`）。**该 lamindb 实例在当前平台已失效**，与本文件是否移动无关。
---
collection:
  profile: notebook
  id: bio
title: 附录三　来源与许可清单
date: '2026-10-05'
updated: '2026-10-05T22:26:26.000000+08:00'
active_menu: notes
tags:
- 生信
- 教材
---

# 附录三　来源与许可清单

> 逐条的书目细节与核对过程见 [](/report/sources-check.md/)。
> 本表回答两个问题：**这段文字出自哪个文件**、**它能不能公开再分发**。

## 1 源文件清单

| slug | 源文件（相对 `bioedu/`） | 语言 | 本书用在 | 章节 |
|---|---|---|---|---|
| `genetics` | `md/genetics-4e/genetics-4e.md` | 中文 | 第一、二编 | ch01–02, 07–08 |
| `structural` | `md/structural-biology/structural-biology.md` | 中文 | 第一编 | ch03–05 |
| `primer` | `md/bioinformatics-genome-analysis-primer/*.md` | 中文 | 第一、二编 | ch06, 10–14, 17–18 |
| `chenming` | `md/bioinformatics-4e-chenming/bioinformatics-4e-chenming.md` | 中文 | 二、四、六编 | ch09, 15–16, 19, 45, 51 |
| ~~`info`~~ | `md/info-system-management-engineer-2e/*.md` | 中文 | **已整编移除** | — |
| `algorithms` | `md/intro-bioinformatics-algorithms/*.md` | 英文 | 第三编 | ch20–23, 25–27 |
| `mount` | `md/bioinformatics-sequence-genome-analysis/*.md` | 英文 | 二、三编 | ch24, 28–32 |
| `data-skills` | `md/bioinformatics-data-skills/*.md` | 英文 | 第四编 | ch34–42 |
| `python-for-biologists` | `md/python-for-biologists/*.md` | 英文 | 第四编 | ch43 |
| `biopython` | `md/biopython-tutorial-cookbook/*.md` | 英文 | 第四编 | ch44 |
| `deepchem` | `md/deepchem-book/*.md` | 英文 | 第六编 | ch52–57 |
| `brm` | `md/brm-bsa-seq-qtl-mapping/*.md` | 英文 | 第三编 | ch33 |
| `scanpy` | `web/scanpy/**/*.md` | 英文 | 第五编 | ch47–50 |
| `scbp` | `web/sc-best-practices/**/*.md` | 英文 | 第五编 | ch46 |
| `ml` | `web/machine_learning_compilation/**/*.md` | 英文 | （未入章，见 §4） | — |

**已排除**（`tools/excluded.yml`）：`scanpy:genindex.md`、`scanpy:search.md`、
`tutorials/basics/index.md`，以及根目录重复的 Mount PDF 副本。

## 2 许可与版权状态 —— ⚠️ 必读

**本项目内部的所有源材料均为受版权保护的商业出版物或受许可文档，
本地 PDF 文件名中可见 `z-library` 字样。本书把它们的正文重新排印进了一本合订教材，
这构成对原作品的再分发。**

| 源 | 版权状态 | 证据 | 可否再分发 |
|---|---|---|---|
| `python-for-biologists` | **CC BY-NC-SA 3.0** | PDF 版权页明文 | ✅ 可以（须署名、非商用、相同方式共享） |
| `brm`（BSA-seq 论文） | 期刊论文，© The Author(s) 2019, OUP | PDF 页眉 | ⚠️ 学术引用可行，整本再分发需授权 |
| `data-skills` | © 2015 Vince Buffalo, O'Reilly | PDF 版权页 | ❌ 不可 |
| 其余书籍 | 受版权保护的商业出版物 | 见文件名中的 z-library 标记 | ❌ 不可 |
| `scanpy` / `scbp` / `ml` 站点文档 | 按各自站点许可（多为 BSD/CC） | 未逐站核对 | ⚠️ **未核** |

### 这意味着什么

- `book/` 下的产物（`dist/` 里的 HTML、PDF、DOCX）**不能公开分发**。
- 它的正当用途是**本地阅读与教学准备**。
- 若要对外发布，必须先移除受版权保护的书稿正文，只保留编者撰写的部分
  （导语、编者注、术语表、附录），并逐站核对其许可。
- ⚠️ 上述许可判断基于本地文件中**能读到的**版权页；
  未读到版权页的书（见 `sources-check.md` §6）其许可状态**未知**，
  在未知状态下按"不可再分发"处理。

## 3 图片资源

`book/assets/<slug>/` 下的图片全部**逐字节复制自源 PDF 的内嵌图像**
（MinerU 抽取），未做重绘、未做替换。文件名保留原内容哈希。
合计约 2300 张。

因此图片的版权随其所属作品，**同样不可再分发**。

## 4 未进入任何章的源

| 源 | 原因 |
|---|---|
| `md/info-system-management-engineer-2e/*.md`（信息系统管理工程师教程，第 2 版） | **整编移除**。该书与生信主线无实质关联，且原书页眉标为"第7编"，与本书主线冲突。经编者判断删除 4 章，正文减少约 70 万字符；源文件仍只读保留在 `md/` 下。 |

| 源 | 原因 |
|---|---|
| `web/machine_learning_compilation` | 已抓取 50 个文件，但内容与 `deepchem-book` 高度重叠且质量较低，未收入正文。**这是取舍不是遗漏**；如需收入，应先做与第六编的去重判定。 |
| `web/sc-best-practices` 其余页面 | 抓取未完成（只拿到 `introduction/prior-art.md` 一页），故 ch46 内容偏薄。 |

## 5 溯源方法

每章 frontmatter 下有 HTML 注释：

```
```

格式为 `slug:切片[页码区间]`。页码区间来自 `_work/chunks/<slug>/*.pdf`
的文件名（如 `brm_p0001-0007.pdf` → `c01` = p0001–0007），
**不是**从正文位置估算的。取不到锚点的切片不带页码标注。

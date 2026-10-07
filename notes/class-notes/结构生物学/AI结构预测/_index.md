---
title: AI 蛋白质结构预测 · 文献专题
date: 2026-10-07
tags: [课程, 结构生物学, 文献精读, AI结构预测]
status: primary
类型: 文献专题
来源: PubMed / Crossref / bioRxiv 检索，32 篇元数据逐条核验
---

# AI 蛋白质结构预测 · 文献专题

《结构生物学》课程文献阅读汇报的文献底稿。共 **32 篇**（期刊 30 + 预印本 2），按 6 个主题模块聚类。

> 所有条目元数据（作者、卷期页、DOI）经 PubMed 与 Crossref 核验；策展内容（创新点 / 原理 / 关键结果 / 局限 / 图示）锚定论文摘要原文，未做二次推算。

## 模块导航

### [[notes/class-notes/结构生物学/AI结构预测/01-范式起点-从衍射反演到可微分建模|范式起点：从衍射反演到可微分建模]]

5 篇 · 为什么折叠问题在 2021 年才算解决

AlphaFold1 用深度学习势替代距离几何，AlphaFold2 用 Evoformer 直出坐标结构，把 50 年的蛋白质折叠问题在 CASP14 盲测上推到接近实验精度。

### [[notes/class-notes/结构生物学/AI结构预测/02-基础设施-预测结构成为公共数据|基础设施：预测结构成为公共数据]]

4 篇 · 2.1 亿个模型之后，数据如何被检索和消费

AFDB 让预测结构从一次性产物变成可检索的公共资产，Foldseek 补上结构检索的算力瓶颈，功能注释工具开始直接消费预测模型。

### [[notes/class-notes/结构生物学/AI结构预测/03-复合物与多模态-从蛋白到生物分子相互作用|复合物与多模态：从蛋白到生物分子相互作用]]

7 篇 · AlphaFold3 的扩散式共折叠究竟解决了什么

预测对象从单体扩展到蛋白–核酸–配体共折叠，第三方基准显示优势真实但随体系尺寸与柔性收敛。

### [[notes/class-notes/结构生物学/AI结构预测/04-从预测到设计-生成式蛋白设计|从预测到设计：生成式蛋白设计]]

5 篇 · 结构预测的能力如何转化为可设计的分子

ProteinMPNN 在给定骨架上生成序列，RFdiffusion 反向生成骨架，Evo 2 把尺度推向全生命域基因组——结构知识开始反向驱动设计。

### [[notes/class-notes/结构生物学/AI结构预测/05-序列即结构-蛋白语言模型|序列即结构：蛋白语言模型]]

3 篇 · 结构信息是否已经编码在序列语言模型里

ESMFold 证明不必检索同源序列也能出结构，ESM3 进一步让模型跨序列—结构—功能三模态生成。

### [[notes/class-notes/结构生物学/AI结构预测/06-边界与闭环-局限、评测与实验反哺|边界与闭环：局限、评测与实验反哺]]

8 篇 · 预测的边界在哪里，以及实验方法如何被 AI 反哺

官方盲测、独立基准与失败案例共同划出能力边界；与此同时，AlphaFold 正在反向加速晶体学与 NMR 实验。

---

## 配套产物

- 课程索引：[[notes/class-notes/结构生物学/_index|结构生物学]]
- 综述正文：`[[notes/class-notes/结构生物学/AI结构预测/00-综述正文|综述正文]]`
- 离线可视化：`index.html` + `dataset.json`（本机生成于 agent 项目目录）
- PDF：`notes/class-notes/结构生物学/AI结构预测/文献PDF/`（开放获取全文下载结果，`.gitignore` 已排除 `*.pdf`）

## 复现

```bash
# 检索与核验
python3 work/build_dataset.py      # PubMed efetch → papers.json + 策展层 → dataset.json
# 生成 Obsidian 笔记
python3 work/build_obsidian.py
# 下载开放获取 PDF
env no_proxy='*' python3 work/download_pdfs.py <输出目录>
```


---
title: 生物信息学实验
date: 2026-10-27
tags: [课程, 生信, 课程实验]
status: primary
---

# 生物信息学实验

>[!info] 本目录
>《生物信息学》课程实验的**原始输出 + 报告**。原始数据（序列、比对结果、数据表）留在 `01/`、`02/`、`03/` 各自目录里，报告只做提炼；知识沉淀（方法、文献、实验记录）进 `vault/`，两边不互相搬动文件。

## 实验导航

| 课次 | 报告 | 核心任务 | 研究分子 | 关键结果 |
|---|---|---|---|---|
| 实验一 | [[notes/生信实验/01/生物信息学实验报告_1_曹荣麟-2024014209_1\|生物信息学实验报告_1]]（PDF 同名，5 页） | 浏览 NCBI 数据库、解读 GenBank 序列文件、PubMed 检索文献 | 玉米 `ZmFIE1`（Gene ID 542075） | 4 号染色体 37,782,884–37,788,773（减链），14 外显子 1766 nt，编码 461 aa；母源等位基因去甲基化激活、父源保持甲基化沉默 |
| 实验二 | [[notes/生信实验/02/生物信息学实验报告_2_曹荣麟-2024014209\|生物信息学实验报告_2]]（PDF 同名，5 页） | Entrez 搜索、EBI 浏览、Needle/Water 双序列比对 | 玉米 `ZmFIE1`（任务 1.1 按题目检索人 EGF） | 5 正 5 旁 FIE1/FIE2；10 组 EMBOSS，核酸 56.3→58.5%，蛋白 58.0→72.3% |
| 实验三 | [[notes/生信实验/03/生物信息学实验报告_3_曹荣麟-2024014209\|生物信息学实验报告_3]]（PDF 同名，5 页） | BLASTN / BLASTP / PSI-BLAST / DELTA-BLAST / 翻译搜索 | 玉米 `ZmFIE1`（`NM_001111711.1` / `NP_001105181.1`） | 9 BLASTN + 10 BLASTP + PSI 12 轮 + DELTA + 3 翻译搜索；blastn 335 条而 megablast 27；PSI 12 轮未收敛；保存 10 直系 + 10 并系 + 21 分层序列 |

## 目录结构

三个实验目录采用同一套约定：

```
01/ 或 02/
├── 生物信息学实验报告_N_曹荣麟-2024014209_N.md   报告正文
├── 生物信息学实验报告_N_曹荣麟-2024014209_N.pdf  5 页 A4（*.pdf 不入库）
├── data/          数值数据表（CSV）+ 作图配置（JSON），可复现
├── charts/        可交互 ECharts 图（报告插图的交互版）
├── records/       数据库原始记录（实验一：GenBank/gene_table/UniProt/PubMed）
├── image-*.png    报告插图与证据截图
├── fig_*.svg / .png   自绘插图（SVG 源 + 无头 Chrome 3× 截图）
├── shot-*.png     数据库网页截图（NCBI / ENA / UniProt / PDBe / Ensembl）
└── （实验二额外）sequences/、emboss_results/、scripts/   原始序列、EMBOSS 输出与作图脚本
```

实验三另有一套本地 BLAST 环境：

```
03/
├── tools/deb/          BLAST+ 2.16.0（Debian 包解压，含 blastn / blastp / psiblast / deltablast / blastx / tblastx）
├── db/nucleotide/      核酸库：11 个植物物种 Ensembl Plants cDNA + FIE 家族 RefSeq mRNA（652,197 条）
├── db/protein/         蛋白库：Swiss-Prot + FIE 家族 RefSeq 蛋白（576,022 条）
├── db/cdd/             DELTA-BLAST 所需的 CDD 库（cdd_delta，1.5 Gb 压缩包解压）
├── queries/fie/        query FASTA（ZmFIE1 mRNA / 蛋白 / 27 aa 片段）
├── results/            BLASTN/BLASTP/翻译搜索 TSV + 日志 + 耗时，PSI-BLAST 逐轮 12 套
├── sequences/          10 直系 + 10 并系 + 21 条 DELTA 分层序列 + 清单 TSV
└── scripts/            检索、汇总统计、序列整理、作图、交互图生成脚本
```

## 库内对应物

| 课程产物 | 库内位置 |
|---|---|
| 实验报告的可复现流程 | [[vault/方法/生信分析/05_基因记录与序列文件解读\|方法 05：基因记录与序列文件解读]]（实验一）<br>[[vault/方法/生信分析/04_序列检索与双序列比对\|方法 04：序列检索与双序列比对]]（实验二）<br>[[vault/方法/生信分析/06_BLAST数据库搜索与参数选择\|方法 06：BLAST 数据库搜索与参数选择]]（实验三） |
| 实验过程留痕 | [[vault/实验记录/2026-10-25-194000-生信实验一 NCBI浏览与序列文件解读\|实验记录：生信实验一]]<br>[[vault/实验记录/2026-10-25-195500-生信实验二 Entrez搜索与双序列比对\|实验记录：生信实验二]]<br>[[vault/实验记录/2026-11-06-120000-生信实验三 BLAST数据库搜索\|实验记录：生信实验三]] |
| 项目总览与决策日志 | [[vault/项目/生信实验课程/生信实验课程-项目概览\|生信实验课程]] |
| 知识结构（Ctrl+Alt+M 出导图） | [[vault/大纲笔记/生信实验课程知识结构\|生信实验课程知识结构]] |
| 文献库 | [[vault/文献笔记/Hermon 2007 maize Fie1 基因印记\|Hermon 2007]] · [[vault/文献笔记/Ni 2019 maize PRC2 组分更新与互作\|Ni 2019]] · [[vault/文献笔记/Wang 2025 Fie1-PRC2 与 H3K27me3\|Wang 2025]] · [[vault/文献笔记/Shi 2025 AGL11-FIE 与无融合生殖\|Shi 2025]] |
| 本机工具链与踩坑 | [[vault/系统与工具/电脑管理/生物信息学实验工具链 2026-10-27\|生物信息学实验工具链]] |

## 归档

初稿与被取代版本见 [[4-存档/2026-10-27/README|存档索引 · 2026-10-27]]（实验一初稿 `练习NCBI.md`、初稿 PDF 与 10 张残留截图）；2026-11-06 的 EGF→FIE1 替换见 [[4-存档/2026-11-06/README|存档索引 · 2026-11-06]]。

## 任务书原件

- 实验一：`01/NCBI.pdf`
- 实验二：`02/实验2 DP(1).pdf`（英文）、`02/实验2 DP(1).zh-CN.pdf`（中文版）
- 实验三：`03/实验3 BLAST.pdf`

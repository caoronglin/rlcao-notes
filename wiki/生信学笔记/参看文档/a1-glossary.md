---
title: 附录一　术语表
collection:
  profile: wiki
  id: 生信学笔记
active_menu: 生信学笔记
date: '2026-10-05'
tags:
- 生信
- 教材
---

# 附录一　术语表

> 体例见 [](/report/style.md/) ①。本表经 `bio-analysis` 复核（记录见
> [../report/domain-check.md](/report/domain-check.md/) §3）。
>
> **列的含义**：
> - **口径**：本书统一采用的译名/写法；
> - **别写**：容易与之混淆、但**含义不同**的写法；
> - **首现**：本书首次给出完整解释的章。
>
> ⚠️ 覆盖面说明：来自 `sc-best-practices` 与 `machine_learning_compilation`
> 的术语**未全部复核**，原因见 `sources-check.md` §4（前者只抓到 1 页）。

## A 遗传学

| 术语 | 口径 | 别写 | 首现 |
|---|---|---|---|
| 等位基因 | 等位基因（allele） | 拟基因 | [ch01](/wiki/生信学笔记/参看文档/ch01/) |
| 纯合子 / 杂合子 | 同左（homozygous / heterozygous） | — | [ch01](/wiki/生信学笔记/参看文档/ch01/) |
| 分离比 | 分离比（segregation ratio） | 分离率 | [ch01](/wiki/生信学笔记/参看文档/ch01/) |
| 自由组合定律 | 自由组合定律 | 独立分配（遗传学早期亦用，需注明语境） | [ch01](/wiki/生信学笔记/参看文档/ch01/) |
| 连锁 / 交换 | 连锁与交换（linkage / crossing-over） | 连锁交换定律 | [ch01](/wiki/生信学笔记/参看文档/ch01/) |
| 交换率 | 交换率（recombination frequency） | 重组率（指结果，非参数） | [ch01](/wiki/生信学笔记/参看文档/ch01/) |
| 数量性状 | 数量性状（quantitative trait） | 连续性状（不等价） | [ch07](/wiki/生信学笔记/参看文档/ch07/) |
| 数量性状基因座 | 数量性状基因座（QTL, quantitative trait locus） | 基因（gene）——QTL 是区间不是基因 | [ch07](/wiki/生信学笔记/参看文档/ch07/) |
| 表观遗传 | 表观遗传（epigenetics） |  epigenetics 直写 | [ch07](/wiki/生信学笔记/参看文档/ch07/) |
| 假基因 | 假基因（pseudogene） | 重复基因 | [ch13](/wiki/生信学笔记/参看文档/ch13/) |

## B 序列与比对

| 术语 | 口径 | 别写 | 首现 |
|---|---|---|---|
| 读段 / 读长 | **读段 = read（片段）；读长 = read length（长度）** | ⚠️ 两者**不可互译**，这是本书特别分列的一条 | [ch13](/wiki/生信学笔记/参看文档/ch13/) |
| 全局比对 | 全局比对（global alignment） | — | [ch06](/wiki/生信学笔记/参看文档/ch06/) |
| 局部比对 | 局部比对（local alignment） | — | [ch06](/wiki/生信学笔记/参看文档/ch06/) |
| 动态规划 | 动态规划（dynamic programming） | 递归算法（不等价，DP 特指带缓存的分解） | [ch22](/wiki/生信学笔记/参看文档/ch22/) |
| 打分矩阵 | 打分矩阵（scoring matrix） | 替换矩阵（可，但本书统一"打分矩阵"） | [ch06](/wiki/生信学笔记/参看文档/ch06/) |
| 空位罚分 | 空位罚分（gap penalty） | 空格罚分 | [ch06](/wiki/生信学笔记/参看文档/ch06/) |
| E 值 | E 值（E-value） | p 值——**两者不同**，见下条 | [ch06](/wiki/生信学笔记/参看文档/ch06/) |
| bit score | bit score | 分数（score 指原始分，非 bit） | [ch06](/wiki/生信学笔记/参看文档/ch06/) |
| 比对显著性 | 沿用所引教材口径，Karlin–Altschul 与贝叶斯**并列不合并** | — | [ch24](/wiki/生信学笔记/参看文档/ch24/) |
| 多重检验校正 | 多重检验校正（multiple testing correction） | — | [ch07](/wiki/生信学笔记/参看文档/ch07/) |
| FDR | FDR（错误发现率） | 多重检验校正——**FDR 是方法之一，非同义词** | [ch51](/wiki/生信学笔记/参看文档/ch51/) |

## C 基因组与注释

| 术语 | 口径 | 别写 | 首现 |
|---|---|---|---|
| 基因组注释 | 基因组注释（genome annotation） | 基因预测（见下） | [ch13](/wiki/生信学笔记/参看文档/ch13/) |
| 基因预测 | 从头基因预测（ab initio gene prediction） | 注释（同上） | [ch30](/wiki/生信学笔记/参看文档/ch30/) |
| 非编码 RNA | 非编码 RNA（non-coding RNA, ncRNA） | 无功能 RNA | [ch13](/wiki/生信学笔记/参看文档/ch13/) |
| 宏基因组学 | 宏基因组学（metagenomics） | 宏基因组（对象） | [ch17](/wiki/生信学笔记/参看文档/ch17/) |
| 宏基因组 | 宏基因组（metagenome） | 宏基因组学（方法） | [ch17](/wiki/生信学笔记/参看文档/ch17/) |
| 分箱 | 分箱（binning） | 聚类（目标不同） | [ch17](/wiki/生信学笔记/参看文档/ch17/) |

## D 蛋白质与结构

| 术语 | 口径 | 别写 | 首现 |
|---|---|---|---|
| 内在无序区 | 内在无序区（IDR, intrinsically disordered region） | 无序蛋白（不等价） | [ch03](/wiki/生信学笔记/参看文档/ch03/) |
| 同源建模 | 同源建模（homology modeling） | 同源折叠 | [ch30](/wiki/生信学笔记/参看文档/ch30/) |
| 折叠识别 | 折叠识别（fold recognition） | 折叠预测（范围更广） | [ch30](/wiki/生信学笔记/参看文档/ch30/) |
| 对接 | 分子对接（docking） | 配体匹配 | [ch17](/wiki/生信学笔记/参看文档/ch17/) |
| 冷冻电镜 | 冷冻电镜（cryo-EM） | 低温电镜（旧称） | [ch03](/wiki/生信学笔记/参看文档/ch03/) |

## E 演化与统计

| 术语 | 口径 | 别写 | 首现 |
|---|---|---|---|
| 系统发育 / 系统发生 | 树本身用"系统发育树（phylogenetic tree）"；推断过程用"系统发生（phylogenetics）" | 进化树（口语） | [ch17](/wiki/生信学笔记/参看文档/ch17/) |
| 邻接法 | 邻接法（neighbor joining） | 最近邻（nearest neighbor，不同算法） | [ch26](/wiki/生信学笔记/参看文档/ch26/) |
| bootstrap | bootstrap 值（自展支持率） | 自举（音译） | [ch28](/wiki/生信学笔记/参看文档/ch28/) |
| 卡方检验 | 卡方检验（χ² test, chi-square test） | 平方和检验 | [ch07](/wiki/生信学笔记/参看文档/ch07/) |
| 贝叶斯推断 | 贝叶斯推断 | — | [ch24](/wiki/生信学笔记/参看文档/ch24/) |
| 过拟合 | 过拟合（overfitting） | 欠拟合（不等价） | [ch51](/wiki/生信学笔记/参看文档/ch51/) |
| 正则化 | 正则化（regularization） | 平滑（部分场合等价） | [ch51](/wiki/生信学笔记/参看文档/ch51/) |
| 批次效应 | 批次效应（batch effect） | 系统误差 | [ch13](/wiki/生信学笔记/参看文档/ch13/) |

## F 工程与工具

| 术语 | 口径 | 别写 | 首现 |
|---|---|---|---|
| 可复现 | 可复现（reproducible）；可重跑 ≠ 可复现 | — | [ch34](/wiki/生信学笔记/参看文档/ch34/) |
| 稳健 | 稳健（robust） | 强壮 | [ch34](/wiki/生信学笔记/参看文档/ch34/) |
| 流式处理 | 流式处理（streaming） | 管道（pipeline 是组织方式） | [ch34](/wiki/生信学笔记/参看文档/ch34/) |
| 索引 | 索引（index）；⚠️ 与 BLAST 的"索引库"同名不同义 | — | [ch34](/wiki/生信学笔记/参看文档/ch34/) |
| 降维 | 降维（dimensionality reduction） | 降阶 | [ch46](/wiki/生信学笔记/参看文档/ch46/) |
| 细胞周期 | 细胞周期（cell cycle） | 分裂周期 | [ch46](/wiki/生信学笔记/参看文档/ch46/) |
| SMILES | SMILES（简化分子输入行输入系统） | — | [ch53](/wiki/生信学笔记/参看文档/ch53/) |
| 自监督学习 | 自监督学习（self-supervised learning） | 无监督（不等价） | [ch53](/wiki/生信学笔记/参看文档/ch53/) |
| 迁移学习 | 迁移学习（transfer learning） | 微调（fine-tuning 是其手段之一） | [ch53](/wiki/生信学笔记/参看文档/ch53/) |
| 数据泄漏 | 数据泄漏（data leakage） | 过拟合（症状不同） | [ch51](/wiki/生信学笔记/参看文档/ch51/) |

## G 已知未收录

以下概念在源材料中出现但本表**未收录**，如实说明原因：

- `sc-best-practices` 站点的单细胞术语（仅抓到 1 页，样本不足）；
- `machine_learning_compilation` 站点的材料编译术语（未进入任何章）。

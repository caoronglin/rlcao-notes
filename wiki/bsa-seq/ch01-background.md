---
title: 第一章、BSA-Seq 与三种分析方法的原理
collection:
  profile: wiki
  id: bsa-seq
active_menu: bsa-seq
tags: [BSA-Seq, QTL-seq, SNP index, G-statistic, 原理]
---

# 第一章、BSA-Seq 与三种分析方法的原理

## 1.1 什么是 BSA-Seq

**BSA（Bulked Segregant Analysis，混合分组分析）** 的思路很朴素：在一个分离群体里，

按目标性状挑出两个极端表型组（最高/最矮、抗病/感病），把每组若干单株的 DNA 等量混合成

两个"混池"（bulk），然后比较两个混池之间的等位基因频率差异。

- 如果一个基因**与性状无关**，它的两个等位基因在两个混池中随机分离，频率应该接近；
- 如果某个基因**决定性状**，则由于表型选择，它的等位基因会在两个混池中被"富集"：
  一个池里 A 多，另一个池里 a 多。

把二代测序（NGS）接到 BSA 上，就叫 **BSA-Seq**（也叫 QTL-seq）。它省掉了传统 BSA

耗时费力的分子标记开发和遗传作图步骤，能快速定位质量和数量性状位点（QTL）。

论文（2020, BMC Bioinformatics）的表述：

>BSA, coupled with next-generation sequencing, allows the rapid identification of both
>qualitative and quantitative trait loci (QTL), and this technique is referred to as BSA-Seq here.

## 1.2 GATK4 上游产物：AD 与 DP

BSA-Seq 下游分析的原料是变异位点的**等位深度（Allele Depth, AD）**：

| 概念 | 含义 |
| --- | --- |
| REF | 与参考基因组一致的碱基 |
| ALT | 与参考基因组不同的碱基 |
| AD (Allele Depth) | 支持该位点的 REF / ALT 读段数，GATK 里形如 `"25,39"` |
| ADREF / ADALT | 即上例中的 25 和 39 |
| DP (Depth per sample) | 该位点在该样本中的测序深度，代码中统一定义为 `DP = ADREF + ADALT` |

下标 `1` / `2` 分别表示第一个混池（fb, first bulk）和第二个混池（sb, second bulk）。

PyBSASeq 的输入就是 GATK4 结果中挑出的列：`CHROM, POS, REF, ALT, fb.AD, fb.GQ, sb.AD, sb.GQ`。

>注意：GATK 输出的 DP 有时会大于或小于 AD 之和，PyBSASeq 一律用 `DP = ADREF + ADALT`
>重算，保证所有统计量口径一致（源码 `sv_filtering()` 中的 `fb_ld` / `sb_ld`）。

## 1.3 三种分析方法

### 方法一：SNP index（等位基因频率）法

对每个 SNP 计算混池中的 ALT 频率（即 SNP index）：

```
SNP_index(池) = ADALT(池) / DP(池)

Δ(SNP index) = ADALT2/DP2 − ADALT1/DP1
```

Δ 的绝对值越大，该 SNP 越可能与性状关联。滑窗内对所有 SNP 的 Δ 取平均，

得到滑窗曲线；用重抽样/模拟得到置信区间作为阈值。代表实现：QTLseqr（R）。

### 方法二：G 统计量法

对每个 SNP 构建 2×2 列联表（两个池 × REF/ALT），计算似然比 G：

```
G = 2 · Σ Oi · ln(Oi / Ei)
```

其中 `Oi` 为观测值（ADREF1、ADALT1、ADREF2、ADALT2），`Ei` 为无效假设下的期望值：

`Ei = 行和 × 列和 / 总和`。G 值越大越可能关联性状。代表实现：Magwene 等（`bsaseq`）、QTLseqr。

### 方法三：显著 SV 方法（PyBSASeq 的卖点）

前两种方法本质上都在**逐个 SNP 地量化 REF/ALT 富集程度**，单个 SNP 的统计功效有限，

必须靠高测序深度才能把主效 QTL 顶出阈值线。

PyBSASeq 换了一个检测单元：不再看单个 SNP 有多显著，而是看**一个染色体区间里

"显著 SV"占全部 SV 的比例有多高**：

```
对一个 SV：Fisher 精确检验（2×2 表 = 两池的 REF/ALT 计数）
           p < alpha（默认 0.01）→ 该 SV 记为显著 SV（sSV）

对一个滑窗：sSV/totalSV 比值
           比值越高 → 该区间越可能存在控制性状的基因
```

由于一个 2 Mb 滑窗里平均有几千个 SNP（论文中平均 6984 个），

这是在**滑窗层面**做统计，而不是在 SNP 层面，因此统计功效大得多。

论文实测：与现有方法相比**灵敏度提高 5 倍以上**，测序成本降低约 **80%**。

>原文：The significant SNP method allows the detection of SNP-trait associations at
>much lower sequencing coverage than the current methods, leading to ~ 80% lower
>sequencing cost.

## 1.4 为什么"富集比例"比"绝对个数"好

论文里有一段很关键的推理（Enrichment of sSNPs 小节）：

1. 直接数滑窗里 sSV 的**绝对个数**会被 SNP 密度干扰 —— SNP 分布在不同染色体、同一染色体
   不同区域极不均匀，若目标基因恰好落在 SNP 稀疏区，就会被漏掉。
2. 因此改用 **sSV/totalSV 比值**，即"归一化"后的富集程度。论文 Fig.1a（绝对个数）
   与 Fig.1b（比值）对比：第 2 条染色体上的第一个峰、以及第 3、6、9 条染色体上的峰，
   SNP 个数少但 sSV 富集比例高 —— 只有比值法才能看到它们。

## 1.5 三种方法的阈值口径差异

| 方法 | 阈值作用层级 | 阈值求法 | 默认分位 |
| --- | --- | --- | --- |
| SNP index 法 | **SNP 层面** | 模拟 10000 次 Δ 值，取置信区间 | 99% CI |
| G 统计量法 | **SNP 层面** | 模拟 10000 次 G 值，取分位 | 99.5 百分位 |
| 显著 SV 法 | **滑窗层面** | 模拟 10000 次 sSV/totalSV 比值，取分位 | 99.5 百分位 |

>论文明确指出这是"显著 SV 方法"与另两种方法的**根本区别**：
>both the SNP index method and the G-statistic method use SNP-level thresholds to
>identify significant sliding windows; whereas the significant SNP method uses
>sliding window-level thresholds.

## 1.6 滑窗（sliding window）算法

三种方法都用滑窗把点数据变成曲线：

- 窗口大小 `sw_size`：默认 **2,000,000 bp（2 Mb）**
- 步长 `incremental_step`：默认 **10,000 bp**
- 滑窗内的统计量：
  - 显著 SV 法：`sSV / totalSV`（比值）
  - SNP index 法：窗口内所有 SNP 的 Δ 的**均值**
  - G 统计量法：窗口内所有 SNP 的 G 的**均值**

**空窗口处理**：若某滑窗内 SV 数为 0，其比值/G/Δ 会用前一个滑窗的值代替（源码 `zeroSV()`）；

若染色体**第一个**滑窗就是空的，先填占位符 `'empty'`，稍后用最近的非空值回填（源码 `replace_zero()`）。

## 1.7 分辨率与"峰"的形状

所有方法都用同样的滑窗设置，因此**分辨率相同**。论文特别解释了为什么峰往往很宽：

- 因果位点内的 SNP 因**表型选择**而富集；
- 因果位点两侧的 SNP 因**连锁不平衡（LD）**而富集，离得越远富集越弱；
- 任何一次重组都会削弱侧翼 SNP 的富集。

因此曲线应该是"因果位点最高、向两侧衰减"的峰。极端情况如论文中的第 8 号染色体，

**整条染色体的 sSV/totalSV 都高于阈值** —— 这不代表整条染色体都参与耐冷性，

而应结合着丝粒位置、重组率等信息去判断（该染色体上实际有两个 QTL：

近端臂一个微效、远端臂一个主效）。

## 1.8 参考文献

1. Michelmore RW, Paran I, Kesseli RV. Identification of markers linked to disease-resistance genes by bulked segregant analysis. *PNAS* 1991;88:9828–32.
2. Takagi H, et al. QTL-seq: rapid mapping of quantitative trait loci in rice by whole genome resequencing of DNA from two bulked populations. *Plant J* 2013;74:174–83.
3. Magwene PM, Willis JH, Kelly JK. The statistics of bulk segregant analysis using next generation sequencing. *PLoS Comput Biol* 2011;7:e1002255.（G 统计量法原始文献）
4. Mansfeld BN, Grumet R. QTLseqr: an R package for bulk segregant analysis with next-generation sequencing. *Plant Genome* 2018;11.
5. Yang Z, et al. Mapping of quantitative trait loci underlying cold tolerance in rice seedlings via high-throughput sequencing of pooled extremes. *PLoS One* 2013;8:e68433.（论文的测试数据来源）
6. Zhang J, Panthee DR. PyBSASeq: a simple and effective algorithm for bulked segregant analysis with whole-genome sequencing data. *BMC Bioinformatics* 2020;21:99.
7. Zhang J, Panthee DR. Next-generation sequencing-based bulked segregant analysis without sequencing the parental genomes. *G3* 2021;jkab400.
8. Sonsungsan P, et al. A k-mer-based bulked segregant analysis approach to map seed traits in unphased heterozygous potato genomes. *G3* 2024;14(4):jkae035.（另一种技术路线，见[第十一章](ch11-related-methods-kmer.md)）

>**一个重要的分支：不比对参考基因组的 BSA**
>本项目的所有方法都建立在"GATK 比对到参考基因组得到 AD"之上。
>若物种没有高质量参考基因组、基因组高度杂合或多倍体，可以改走 **k-mer 富集**路线
>（直接比较混池间的 k-mer 计数，不需比对）。两种路线的对比见
>[第十一章、相关方法](ch11-related-methods-kmer.md)。

→ 下一章：[第二章、项目结构与运行环境](ch02-project-structure.md)

---
title: 第八章、论文案例：水稻冷害 QTL 与降采样验证
collection:
  profile: wiki
  id: bsa-seq
active_menu: bsa-seq
tags: [论文, 水稻, 冷害, QTL, 降采样, 灵敏度]
---

# 第八章、论文案例：水稻冷害 QTL 与降采样验证

本章整理 BMC Bioinformatics (2020) 论文的实验设计与结论，并附上本仓库自带数据的复现结果。

## 8.1 实验材料与测序

| 项目 | 内容 |
| --- | --- |
| 群体 | 水稻 **F3** 群体，共 **10,800** 株 |
| 亲本之一 | *Oryza sativa* subsp. *japonica* **Nipponbare**（用作参考基因组，Release 41） |
| 极端感冷池（ES, extremely cold-sensitive） | **430** 株 |
| 极端耐冷池（ET, extremely cold-tolerant） | **385** 株 |
| 测序平台 | Illumina HiSeq 2000，101 bp 双端 |
| 数据量 | ES ≈ 3.6 亿 reads；ET ≈ 4.4 亿 reads |
| 实际覆盖度 | SRR834927 = **84×**；SRR834931 = **103×**（Lander/Waterman 公式估算） |
| 数据来源 | Yang Z, et al. *PLoS One* 2013;8:e68433（NCBI SRA: SRR834927 / SRR834931） |

>**这就是 argparse 里 `-b` 默认值 `430,385` 的来历** —— 作者把自己的实验参数
>直接写成了程序默认值。

## 8.2 分析规模与"算不动"的问题

| 指标 | 数值 |
| --- | --- |
| 过滤后 SNP 总数 | **1,303,084** |
| 显著 SNP（sSNP, p < 0.01） | **240,351** |
| 全基因组 sSNP/totalSNP | **0.184** |
| 滑窗设置 | 2 Mb 窗口 / 10 kb 步长 |
| 滑窗总数 | **34,919** |
| 平均每窗 SNP 数 | **6,984** |
| 单次滑窗阈值模拟耗时 | ≈ **2 分钟**（i7-6700 3.4 GHz，32 GB RAM） |

如果对全部 34,919 个滑窗都做滑窗特异模拟：

```
34,919 × 2 min ≈ 48 天
```

论文原文的说法是 *would take more than a month*。这就是必须"先重抽样粗筛、

再对候选峰精筛"两段式设计的根本原因。

## 8.3 论文 Table 1：染色体分布

| 染色体 | sSNP | totalSNP | sSNP/totalSNP |
| --- | --- | --- | --- |
| 1 | 52,093 | 160,780 | 0.324 |
| 2 | 48,912 | 125,059 | 0.391 |
| 3 | 3,502 | 45,927 | 0.076 |
| 4 | 3,743 | 62,317 | 0.060 |
| 5 | 15,482 | 102,474 | 0.151 |
| 6 | 7,653 | 159,857 | 0.048 |
| 7 | 12,679 | 128,658 | 0.099 |
| 8 | 54,372 | 132,646 | **0.410** |
| 9 | 1,709 | 57,971 | 0.029 |
| 10 | 28,711 | 98,646 | 0.291 |
| 11 | 5,235 | 180,319 | 0.029 |
| 12 | 6,260 | 48,430 | 0.129 |
| **全基因组** | **240,351** | **1,303,084** | **0.184** |

**关键点**：sSNP 个数多的染色体（8、1、2、10、5）并不等于 sSNP/totalSNP 比值高。

第 11 号染色体 sSNP 只有 5,235 个，但 SNP 总数有 180,319 —— 比值 0.029，全基因组最低。

**这就是必须用比值而非个数的直接证据。**

## 8.4 主要结论

### 8.4.1 检出的 QTL 数量

- Yang et al. 用 G 统计量法验证了 **6 个主效耐冷 QTL**
- PyBSASeq 在**同样的数据**上，除了全部 6 个主效 QTL，还额外检出 **10 个以上微效 QTL**
- 新峰出现在**除第 5、10 号染色体之外的每条染色体**上

论文对"多出来的峰"的解释：

>Plant cold tolerance is a complex quantitative trait controlled by many genes.
>The additional QTLs detected via the significant SNP method may represent the
>minor QTLs that have small phenotypic effects.

### 8.4.2 一个被滑窗特异阈值"救回来"的假阳性

| 峰 | sSNP/totalSNP | SNP 数 | 全局阈值 | 结论 |
| --- | --- | --- | --- | --- |
| 第 3 号染色体第一个峰 | 0.0929 | **2,260** | 0.087 | 比值虽高于全局阈值，但 SNP 数不到平均值（6,984）的 1/3 → **滑窗特异阈值判定为假阳性** |

这是论文最有说服力的一处论证：**只看全局阈值会误报**。

### 8.4.3 第 8 号染色体的"整条超阈值"现象

第 8 号染色体的 sSNP/totalSNP 比值**全部高于阈值**（Table 1 里也是 0.410 最高）。

论文明确提醒这**不意味着**整条染色体都参与耐冷性：

>An extreme case was chromosome 8 where all of its sSNP/totalSNP ratios were greater
>than the threshold, which does not imply that all the SNPs on chromosome 8 were
>involved in conditioning the cold tolerance trait.

真正的解释是：因果位点最高，两侧因连锁不平衡逐渐衰减，

但**任何重组都会削弱侧翼的富集**。第 8 号染色体上靠近着丝粒的区域重组受抑制，

所以整条染色体的富集衰减得很慢。实际上该染色体只有两个 QTL：

近端臂一个微效、远端臂一个主效。

>**这一段的实践意义**：区间很宽时不要试图"缩小到几十 kb"，
>而应该结合着丝粒位置、重组热点、其他方法交叉验证来判断真正的因果区。

## 8.5 降采样实验：灵敏度的直接证明

为了回答"到底能省多少测序钱"，作者用 `seqtk` 对原始 reads 抽样到

**40% / 30% / 20%**（用不同随机种子，保证双端成对选取）：

| reads 比例 | 折算覆盖度 | sSNP 方法 | SNP index 方法 | G 统计量方法 |
| --- | --- | --- | --- | --- |
| 100% | 84× / 103× | 6 个主效 + >10 微效 | 6 主效 + 1 微效（chr2） | 6 主效 + 1 微效 |
| 40% | ≈34× / 41× | 大部分主效 + 多个微效（chr9 一个峰为假阳性） | chr2/5/10 的 QTL **丢失** | chr2/5/10 的 QTL **丢失** |
| 30% | ≈25× / 31× | 7 个峰全部显著 | 全部 QTL **丢失** | chr1/chr8 的峰勉强高于阈值 |
| **20%** | **17× / 21×** | **全部已验证主效 QTL + 1 个微效仍可检出** | 全部丢失 | 全部丢失 |

**结论**：在 20% 覆盖度（17×/21×）下，传统方法全军覆没，

显著 SV 方法仍能检出所有已证实的主效 QTL 加一个微效 QTL ——

>manifesting that the significant SNP method is at least **five times more sensitive**.

对应约 **80% 的测序成本节省**，这对大基因组物种（小麦、玉米、林木）意义重大。

### 降采样实验中的两个细节

1. **假阳性随深度下降而增加**：30% 覆盖度时第 9 号染色体出现一个假阳性峰，
   原因是该滑窗只有 **963 个 SNP**（远低于平均）。再次验证"滑窗特异阈值"的必要性。
2. **峰会漂移**：30% 覆盖度时第 2 号染色体上一个峰的位置**移动了 1.86 Mb**。
   论文的解释是该峰紧邻**着丝粒**，局部重组率极低，曲线噪声大，
   降采样后峰位漂移不可避免。这也说明：**低深度下的峰坐标要谨慎解读**。

## 8.6 三种方法的公平对比

为了避免"不同 SNP calling 流程带来的偏差"，作者把 SNP index 方法和 G 统计量方法

**也在 Python 里重新实现**，用**完全相同的 SNP 数据集**跑三种方法。

这三套脚本的过滤条件（比 PyBSASeq 更严，用于复现 Yang et al. 的结果）：

```
fb.GQ ≥ 99,  sb.GQ ≥ 99,
fb.DP ≥ 40,  sb.DP ≥ 40,
100 ≤ fb.DP + sb.DP ≤ 400
```

对比结论：

- **一致性**：三种方法的峰/谷位置几乎完全重合（论文 Figure S1），
  说明 PyBSASeq 的实现是正确的
- **阈值差异**：Yang et al. 与 Mansfeld & Grumet 用的是**非参数方法**算 G 统计量阈值，
  作者改用模拟法后阈值在全染色体上更一致、也更不保守
- **灵敏度差异**：即使把最严的过滤条件给另外两种方法，显著 SV 方法仍然**最灵敏**，
  能多检出微效 QTL
- **阈值口径不同**：SNP index 法用 **99% 置信区间**；
  G 统计量法与显著 SV 方法用 **99.5 百分位**
- **统计层级不同**（最本质的区别）：

| 方法 | 阈值作用层级 |
| --- | --- |
| SNP index 法 | SNP 层面 |
| G 统计量法 | SNP 层面 |
| **显著 SV 方法** | **滑窗层面** |

论文的解释是：

>The average number of SNPs was 6,984 in the sliding windows, much higher than the
>average sequencing coverage in either bulk (84× in the first bulk and 103× in the
>second bulk), which could be why the significant SNP method has much higher
>statistical power and is more sensitive in the detection of SNP-trait associations.

即：单个位点的深度只有几十，但一个滑窗里有近 7000 个位点 ——

把 7000 个弱信号聚合成一个强信号，这就是灵敏度的来源。

## 8.7 论文的适用边界与展望

- **输入格式限定**：目前只测试过 SNP 和小 InDel 的 calling 结果；
  理论上也能处理 GATK4 的拷贝数变异和结构变异数据（代码里保留了 InDel，见 4.1.1）
- **区间分辨率**：三种方法滑窗设置相同 → 分辨率相同。
  灵敏度高带来的代价是**显著区间偏宽**（第 8 号染色体是极端例子）
- **成本**：作者估计可降低约 80% 测序成本，使 BSA-Seq 更适用于大基因组物种
- **后续工作**：2021 年 G3 论文进一步去掉了"必须有亲本基因组"的限制

## 8.8 第二篇论文（G3 2021）：不测亲本也能做

标题：*Next-generation sequencing-based bulked segregant analysis without

sequencing the parental genomes*

摘要要点：

>Our original algorithm was developed to analyze BSA-Seq data in which genome
>sequences of one parent served as the reference sequences in genotype calling and,
>thus, required the availability of high-quality assembled parental genome sequences.
>Here, we modified the original script to effectively detect the genomic
>region–trait associations using only bulk genome sequences. … Our results
>demonstrate that the genomic region(s) associated with the trait of interest could
>be reliably identified via the significant structural variant method without using
>the parental genome sequences.

在代码里对应三条实现：

1. **单文件输入**（`-i bulks.csv`）：不做亲本对接，直接用全量 SV
2. **Δ(AF) 取绝对值**：`if num_ipfiles == 1 and parent1 != 'ref': df['Delta_AF'] = df['Delta_AF'].abs()`
3. **阈值改为单侧绝对值分位点**：`DAF_abs_Thrshld`，
   判显著时 `DAF > Threshold_DAF`

如果虽然没给亲本文件、但变异检测时**是用亲本基因组做的参考**，

则加 `--parent ref`，程序会按"有方向信息"处理（带符号 ΔAF + 双侧 CI）。

## 8.9 本仓库数据的复现记录

用仓库自带的 `Data/Rice/` 数据做的实测（**注意：本地数据只含 chr9 和 chr11 两条染色体**，

无法复现论文的 12 条染色体全图）：

```bash
# 抽出 chr9，跑完整染色体
awk -F, 'NR==1 || $1==9' Data/Rice/parents.csv > p9.csv
awk -F, 'NR==1 || $1==9' Data/Rice/bulks.csv   > b9.csv
python PyBSASeq.py -i p9.csv,b9.csv -b 430,385 -p F2 -r 100 -o BSASeq.csv
```

运行台账（`misc_info.csv`）：

```
Number of SVs in the entire dataframe - p9,169701
Number of SVs in the entire dataframe - b9,165812
Chromosome sizes,[22940221]
Number of SVs after drop of SVs with calculation-generated NA value,59049
Average SVs per sliding window,1912
Average locus depth in bulk 2696321,7.50
Average locus depth in bulk 2696322,7.61
Genome-wide sSV/totalSV ratio threshold,0.03165
Running time,[0.39]        ← 单位：分钟，本机 (Python 3.14 + pandas 3.0)
```

结果（`BSASeq.csv`）：

| CHROM | POS | AvgLD(池1) | AvgLD(池2) | sSV | totalSV | sSV/totalSV | Threshold_sSV | Significance_sSV/GS/AF/TT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 9 | 1,960,001 | 7.80 | 7.67 | 124 | 1,511 | **0.0821** | 0.0334 | 1 / 1 / 1 / 1 |

`sv_region.csv` 显示 chr9 上 **1 – 3,640,001 bp** 整段超阈值（365 个滑窗、89 个局部峰），

其中最高的峰在 **1,960,001**（滑窗口径比值 0.0715；`BSASeq.csv` 用独立子集重算后为 0.0821）。

>提醒：`BSASeq.csv` 里的 `sSV/totalSV`、`GS`、`DAF` 是在 **`bulk_df_di`（DI==1 的独立子集）**
>上重算的，与 `sliding_windows.csv` / `sv_region.csv` 里基于全量 SV 的数值**口径不同**，
>不应当做"不一致"来理解。

### 与论文数值的差异及原因

| 项目 | 论文 | 本次复现 | 原因 |
| --- | --- | --- | --- |
| 覆盖度 | 84× / 103× | 平均位点深度仅 **7.5×** | 本地 `Data/Rice/*.csv` 是从原始数据**抽稀/子集化**的测试数据（`wc -l` 只有 16 万行），不是论文的全量数据 |
| 过滤后 SV 数 | 1,303,084（全基因组） | 59,049（chr9） | 同上 + 只有一条染色体 |
| 平均每窗 SV 数 | 6,984 | 1,912 | 同上 |
| 重复次数 | 10,000 | 100 | 为快速验证而调小 |
| 全局比值阈值 | 0.087 | 0.0317 | 样本量与重复次数不同 |

**结论**：数值不可直接比较，但**流程行为完全一致** ——

峰被检出、四列显著性全为 1、区域与滑窗统计自洽。

这验证了代码的可运行性与逻辑正确性。

>跑 `-i p9.csv,b9.csv -a True` 或重复执行同一命令，会命中"复用已有结果"分支，
>用 `bsaseq_plot_sw()` 在 **3.5 秒**内重绘，不重算任何统计量。
>
>若改用默认的 `-r 10000` 重跑（先删 `Results/`）：wall clock **2 分 17 秒**、
>内存峰值 **851 MB**、全局比值阈值 **0.03295**、峰仍在 **1,960,001**、
>显著区域 **1 – 3,630,001**（364 个滑窗）。除区域末端差 10 kb（滑窗噪声）外与上表一致。
>详细分阶段耗时见[第十章 10.3.4](ch10-troubleshooting.md)。

→ 下一章：[第九章、函数速查表](ch09-api-reference.md)

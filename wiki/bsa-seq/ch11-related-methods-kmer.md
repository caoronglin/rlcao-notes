---
title: 第十一章、相关方法：无参考基因组的 k-mer BSA
collection:
  profile: wiki
  id: bsa-seq
active_menu: bsa-seq
tags: [BSA-k-mer, k-mer, 马铃薯, 免参考基因组, 相关方法]
---

# 第十一章、相关方法：无参考基因组的 K-mer BSA

项目 `docs/refernces/` 下另有一篇 2024 年的 BSA 方法论文，思路与 PyBSASeq 互补，

放在一起读更能理解"BSA-Seq 到底有哪些技术路线"。

>Sonsungsan P, Nganga ML, Lieberman MC, Amundson KR, Stewart V, Plaimas K, Comai L, Henry IM.
>**A k-mer-based bulked segregant analysis approach to map seed traits in unphased
>heterozygous potato genomes.** *G3 Genes|Genomes|Genetics* 2024;14(4):jkae035.
>doi:10.1093/g3journal/jkae035
>本地文件：`docs/refernces/jkae035.pdf`

## 11.1 它要解决什么问题

论文摘要里的定位非常清楚：

>… most require population structures that fit the models available and a reference genome.
>Instead, high-throughput short-read sequencing can be combined with BSA of k-mers
>(BSA-k-mer) to map traits that appear refractory to standard approaches. This method can
>be applied to any organism and is particularly useful for species with genomes diverged
>from the closest sequenced genome. It is also instrumental when dealing with highly
>**heterozygous and potentially polyploid genomes without phased haplotype assemblies** …
>Finally, it is flexible in terms of population structure.

对 PyBSASeq 而言，这些都是**硬约束**：

| 约束 | PyBSASeq | BSA-k-mer |
| --- | --- | --- |
| 参考基因组 | **必须有**（GATK variant calling 的前提） | **不需要**（只在最后定位时用近缘基因组） |
| 亲本基因型 | 有亲本时要求"双亲互为异等位纯合" | 不要求；高度杂合也能做 |
| 群体结构 | 必须声明 F2 / RIL / BC | 与群体结构模型无关 |
| 多倍体 / 未分型单倍型 | 不适用 | **适用** |
| 结构变异 / 存在缺失 | 依赖调用结果 | k-mer 层面天然可捕获 |

**核心区别在"检测单元"**：PyBSASeq 比对到参考基因组后看**位点**的等位深度；

BSA-k-mer 根本不做比对，直接看**序列片段（k-mer）**在两个混池里的计数差异。

## 11.2 材料与表型

| 项 | 内容 |
| --- | --- |
| 物种 | 二倍体马铃薯（*Solanum tuberosum*） |
| 亲本 | GND（母本，**无**种胚紫斑）× IvP35（父本，纯合显性紫斑） |
| 群体 | 52 个 F1 互交得到的 F2；共观察 **1,128** 粒 F2 种子 |
| 表型 | 种胚紫斑（38.4% 有斑）、种子大小（31% 小粒） |
| 测序样本 | 81 个（8 F1 + 73 F2），每份组织提取 DNA 后 Illumina 测序 |
| 分组 | 有斑（N=53）vs 无斑（N=28）；大粒（N=38）vs 小粒（N=43） |

一个意外发现：**F1 只有 57% 出现紫斑**。IvP35 按文献记载应是纯合显性紫斑，

流式细胞术确认无斑的 F1 仍是二倍体 —— 说明 **GND 里存在抑制紫斑表达的因子**。

这也正是"标准方法做不出来、换 k-mer 方法才成"的动机。

## 11.3 方法流程

```
各样本 Illumina 短读
   │  Jellyfish（多线程 hash）
   ▼
31-bp k-mer 计数（每个样本独立做）
   │  过滤① 只出现 1 次的 k-mer（测序错误/污染）
   ▼
按表型分 4 个混池（有斑/无斑、大粒/小粒），池内合并 k-mer 列表
   │  GenomeScope 2.0 建 k-mer 谱 → 确定每个池的最小计数阈值
   │  过滤② 池内出现 < 5 次的 k-mer
   ▼
两两混池比较 31-mer 计数
   │  过滤③ 只保留在某一池中富集 > 2.5 倍的 k-mer
   ▼
显著富集 k-mer 列表  ← 到此为止完全不需要参考基因组
   │  把含有这些 k-mer 的 reads 用 BWA 比对到近缘参考基因组（DM v6.1）
   │  统计每个 200 kb 非重叠 bin 的 reads 数（MQ < 40 丢弃）
   │  按每个池的总 reads 归一化
   ▼
富集峰 → 候选区（染色体 10 远端、染色体 6 近端）
```

关键参数一览：

| 参数 | 取值 |
| --- | --- |
| k-mer 长度 | **31 bp** |
| 最小出现次数（单样本） | > 1 |
| 最小计数（池内） | ≥ 5 |
| 富集倍数阈值 | **> 2.5 倍** |
| 定位用 bin | **200 kb**（非重叠） |
| 比对质量过滤 | **MQ ≥ 40** |

## 11.4 结果

### 11.4.1 标准方法全部失败

作者先用常规路线做了对照：

- 用 **618,599** 个"双亲各自纯合且彼此不同"的 SNP 对 F2 分型
- 按 **100 kb** bin 汇总，R/qtl 的 single interval mapping + 二值性状模型
- 结果：**种子紫斑和种子大小都没有检出显著 QTL**

原因正是 11.1 表格里的那些约束：**GND 在因果位点是杂合的**，

纯合-纯合型标记无法区分"带因果等位基因的单倍型"和"不带的"。

### 11.4.2 K-mer 方法成功

| 性状 | 定位结果 | 解释 |
| --- | --- | --- |
| 种胚紫斑 | 染色体 **10 远端**（47.8 Mb 到末端） | GND 来源的**显性、孢子体**作用的抑制因子；该区域含 *StANTHOCYANIN1*（Soltu.DM.10G020850.1，52,601,941）与 *StAN2*（Soltu.DM.10G020820.1，52,546,308）两个 MYB 类基因，且与已有花青素定位研究一致 |
| 种子大小 | 染色体 **6 近端**（峰中心 4.8–6.0 Mb） | GND 来源的显性、孢子体作用因子；**新位点**，该区间 44 个注释基因中没有已知的种子大小调控基因 |

紫斑的结果提供了一个很有说服力的"生物学合理性验证"：

定位区间与既有的马铃薯色素研究吻合。

### 11.4.3 亲本溯源

用亲本 reads 反查富集 k-mer 的来源，作者确定：

- 两个性状的信号都**主要来自 GND 亲本**
- 这直接支持了"GND 携带显性抑制/促进等位基因"的模型

## 11.5 K-mer 方法的优势与代价

**优势**

1. **不需要参考基因组**（至少在第一阶段）
2. **不受参考基因组连锁关系约束** —— 论文原文：
   *the k-mer approach is not sensitive to linkage or other expectations based on the
   reference genome used*
3. **能捕获结构变异与存在/缺失变异**：

   >an insertion could be present in one bulk and not the other or absent in the
   >reference genome, making that source of variation undetectable to conventional
   >mapping while the inserted sequences would be identifiable as enriched k-mers

4. **理论上能区分全部 4 个亲本单倍型**（常规方法只能区分双亲纯合标记）
5. **群体结构自由**，不需要事先假定 F2/RIL/BC

**代价**

- k-mer 是**无位置信息**的，必须借助近缘参考基因组才能落到染色体坐标上；
  若近缘基因组也高度分化，定位精度会下降
- 分辨率取决于 bin 大小（本例 200 kb），比 PyBSASeq 的 2 Mb 滑窗并不更细
  —— 实际分辨率主要由**群体大小和重组事件数**决定，而不是算法
- 缺少 PyBSASeq 那样的一整套统计显著性框架（模拟阈值、滑窗特异检验、配对 t 检验）；
  判据是相对朴素的**倍数富集**
- 库大、k 值敏感，需要仔细设定计数阈值（本例用 GenomeScope 2.0 来定）

## 11.6 与 PyBSASeq 的定位对比

| 维度 | PyBSASeq | BSA-k-mer |
| --- | --- | --- |
| 检测单元 | GATK 检出的 SV 位点的等位深度 | 31-mer 计数 |
| 参考基因组 | 必需 | 不需要 |
| 亲本要求 | 有亲本时需纯合多态标记 | 无要求，可高度杂合 |
| 群体结构 | 必须声明 F2/RIL/BC | 无关 |
| 主统计量 | Fisher 精确检验 + sSV/totalSV 比值 | 混池间 k-mer 计数富集倍数 |
| 阈值来源 | 10,000 次模拟（全局 + 滑窗特异） | 倍数阈值（> 2.5×）+ 计数阈值 |
| 平滑/分箱 | 2 Mb 滑窗 / 10 kb 步长 | 200 kb 非重叠 bin |
| 显著性输出 | 4 列（sSV / GS / AF / TT） | 单列（富集与否） |
| 群体规模要求 | 混池各数百株（默认 430/385） | 本例每个池仅 28–53 个个体 |
| 典型适用 | 有参考基因组、亲本纯合多态的作物 | 无/差参考基因组、多倍体、高度杂合、结构变异 |

**共同思想**：都靠"混池把弱信号聚合起来"，都把**染色体区间**（不是单个位点）

作为判定单元。**差别**在于聚合的对象是一个区间内的位点（PyBSASeq），

还是同一段序列的计数（k-mer）。

## 11.7 实践建议

- **有参考基因组 + 亲本可用**：优先 PyBSASeq，统计框架完整、能给出置信区间和显著性
- **无参考基因组 / 高度杂合 / 多倍体 / 怀疑是结构变异**：用 BSA-k-mer 或类似的
  k-mer 富集思路
- **两者可以联合**：先用 k-mer 富集粗定位（免参考基因组），
  再把区间内的 k-mer/reads 比对到近缘基因组做精细定位 —— 这正是本文的做法
- **无论用哪种方法，都别只依赖一种证据**：本文的标准 QTL 定位与 k-mer 方法
  结论相反，论文的价值恰恰在于说明了"模型假设不成立时方法会集体失效"

## 11.8 与 PyBSASeq 共享的"BSA 基本盘"

最后回到[第一章](ch01-background.md)的那句核心逻辑，两篇论文都在验证同一件事：

>表型选择 → 混池中目标等位基因（或对应的序列片段）被富集 →
>富集程度与到因果位点的距离成反比（连锁不平衡） → 用富集曲线找峰

PyBSASeq 用 Fisher + sSV/totalSV 比值衡量富集，BSA-k-mer 用 k-mer 计数倍数衡量富集 ——

**度量方式不同，思路完全一致**。

→ 返回：[目录](index.md)

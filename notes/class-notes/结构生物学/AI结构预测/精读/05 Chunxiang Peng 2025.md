---
title: Chunxiang Peng 2025｜A comprehensive benchmarking of the AlphaFold3 for predicting biomacromolecules and their interactions.
date: 2026-10-08
tags: [课程, 结构生物学, 文献精读, 复合物与多模态]
status: primary
类型: 精读笔记
来源: Chunxiang Peng et al. *Brief Bioinform* 2025，DOI [10.1093/bib/bbaf616](https://doi.org/10.1093/bib/bbaf616)
模块: 复合物与多模态：从蛋白到生物分子相互作用
主键: 41313605
---

# A comprehensive benchmarking of the AlphaFold3 for predicting biomacromolecules and their interactions.

**Chunxiang Peng et al.** · *Brief Bioinform* · 2025 · DOI [10.1093/bib/bbaf616](https://doi.org/10.1093/bib/bbaf616)

> 所属模块：[[notes/class-notes/结构生物学/AI结构预测/03-复合物与多模态-从蛋白到生物分子相互作用|复合物与多模态：从蛋白到生物分子相互作用]]
# A comprehensive benchmarking of the AlphaFold3 for predicting biomacromolecules and their interactions

作者：Chunxiang Peng, Wentao Ni, Quancheng Liu, Gang Hu, Wei Zheng；期刊：*Briefings in Bioinformatics*, 2025, 26；DOI: 10.1093/bib/bbaf616

## 一句话结论
在自建的非冗余九类数据集上，AlphaFold3（server 与 standalone 两个版本）相对 AlphaFold2 / AlphaFold-Multimer / RoseTTAFoldNA 等基线在局部结构精度上普遍有统计显著但幅度很小的提升，在抗原–抗体复合物与蛋白–核酸复合物上优势明显，在蛋白单体、蛋白多聚体上全局精度（TM-score）与旧管线基本持平；而对 RNA 单体，trRosettaRNA 的全局精度更高，AlphaFold3 仅在 LDDT 与相互作用网络保真度（INF）上领先。

## 研究问题
AlphaFold3（2024 年 5 月发布）在原论文中的性能声明基于 DeepMind 内部版本与内部评测，此前缺少第三方独立基准。本文的定位是：用统一的、按 AlphaFold3 训练集（PDB 截止 2021-09-30）严格去冗余的九类数据集，公平评测公开可用的 AlphaFold3 server 与 standalone 包，并与各任务的最先进（SOTA）专线方法对照，回答"AlphaFold3 相对上一代与专线工具在各类生物大分子及其相互作用上到底强多少、弱在哪里"。

## 方法与数据
**版本与运行设置**：AlphaFold3 v3.0.1 与 AlphaFold-Multimer v2.3.0 的训练数据含 2021-09-30 前释放的全部 PDB 结构；AlphaFold2 v2.3.0 训练集截止 2018-04-30。AlphaFold2 运行时使用模板库最大日期 2021-09-30（与 AlphaFold3 一致）。AlphaFold3 结果同时来自官方 server 与 standalone 包（文中称 AlphaFold3-server / AlphaFold3-local）。除特别说明外全部默认参数，每个靶标取默认排序分数最高的模型。统计检验以 Wilcoxon 符号秩检验为主，另用两样本比例检验（DockQ 成功率）与 Bonferroni 校正（RNA 多方法两两比较）。

**九类数据集**（均从新近 PDB 条目构造，并对照 AlphaFold3 训练集去冗余）：
- Benchmark-I 蛋白单体：150 个（60–1700 aa，2024-01-01 后释放；序列相似度 >40% 且覆盖 >80% 者剔除；CD-HIT 去冗余），DomainParser 分为 108 单域 + 42 多域，LOMETS3 分为 86 "easy" + 64 "hard"。
- Benchmark-II 孤儿蛋白：113 个（41–1012 aa），HHblits 搜 UniRef30 无同源序列者入选。
- Benchmark-III 多构象蛋白：60 组，每组同一序列两个构象差异最大（TM-score < 0.80）的结构，取自 M-SADA 基准。
- Benchmark-IV 蛋白多聚体：206 个（100–3000 aa，最多 11 链），其中 35 异聚体 + 171 同聚体；按链数分组后用 US-align 以 TM-score=0.5 聚类去冗余。
- Benchmark-V 肽–蛋白复合物：80 个（69–1172 aa；蛋白链 >40 aa，肽链 5–30 残基）。
- Benchmark-VI 抗原–抗体复合物：102 个（360–2168 aa；配对 VH/VL 结合单链蛋白抗原）。
- Benchmark-VII RNA 单体：52 条（40–1000 nt，2022-05-01 后释放；BLASTN e-value<10 排除训练集同源），按最佳模板 TM-score 是否 >0.50 分为 22 "easy" + 30 "hard"。
- Benchmark-VIII RNA 多聚体：23 个（26–814 nt，2023-05-01 后释放）。
- Benchmark-IX 蛋白–核酸复合物：59 个（2023-05-01 后释放，总残基数 <1000 且每条核酸链 ≥10 nt 以保证 RoseTTAFoldNA 可用）。

**指标**：TM-score（US-align，参数 "-TMscore 7 -ter 0"）、LDDT（OpenStructure 默认设置）、DockQ（引用包 [52] 默认选项）、FNAT（用 DockQ 计算，评蛋白–核酸界面）、INF（ClaRNA 默认选项，仅 RNA，度量 W-C / 非 W-C / 碱基堆积相互作用的 Matthews 相关系数）、CDR-TMscore（模型按抗原叠合后计算 VH/VL 六条 CDR 环的 TM-score）。

## 关键图表解读
（PMC 提取未保留图像，以下均为正文图注与行文所述内容）
- Fig.1（单体 Benchmark-I）：A/B 全 150 单体的 TM-score、LDDT 逐靶对比散点，C/D 108 单域，E/F 42 多域；蓝=server 对 AF2，红=local 对 AF2。G 为噬菌体内溶素 8TW1 示例。
- Fig.2（单序列模式与孤儿蛋白）：A/B 150 单体单序列模式的 TM/LDDT 对比，C/D 孤儿蛋白 TM/LDDT，E/F 14 个 AlphaFold3 流程完全检不到同源序列的孤儿蛋白。
- Fig.3（多构象 Benchmark-III）：A 各蛋白两状态的最高 TM-score；B/C 分别对状态 1、2 特异性最高模型的（TM-score, 特异性）图，黄色阴影区为既准且特异的模型；D 为 4TU7 示例。
- Fig.4（多聚体 Benchmark-IV）：A/B/C 分别为 TM-score、LDDT、DockQ 的 head-to-head。
- Fig.5（异聚/同聚拆分）：A/D、B/E、C/F 分别为 TM、LDDT、DockQ 在 35 异聚体与 171 同聚体上的对比；G/H 为同二聚体 8FV3 与 8JGX 的模型对比。
- Fig.6（抗原–抗体 Benchmark-VI）：A–D 为 TM-score、LDDT、DockQ、CDR-TMscore 对比；E 为 8ts0 示例。
- Fig.7（RNA Benchmark-VII）：A–C 五方法 TM、LDDT、INF 分布；D–O AlphaFold3 与其余四方法的逐靶对比（方=easy，三角=hard）；P–V 为 7URM 链 v 的实验结构与各方法模型。
- Fig.8（RNA 多聚体 Benchmark-VIII）：A/B TM、LDDT 对比；C 为 8VVJ 示例。
- Fig.9（蛋白–核酸 Benchmark-IX）：A/B TM、LDDT 对比；C 为复合物中蛋白、RNA、DNA 亚基各自的 TM-score 分布（长黑线=均值，短白线=中位数）；D 为 8A0X 示例。
- Fig.10（蛋白–核酸界面）：A 为 FNAT 对比；B 为 8PI9 示例。
- 补充材料：Fig.S1–S17（含稳定性 20 次重跑分布 S1/S5/S7/S8、运行时间 S9–S17）、Table S1–S39（靶标清单 S1–S9，其余为各比较的统计与置信区间）。正文无表格（0 表）。

## 主要结果与关键数字
**Benchmark-I（150 单体）**：TM-score——AF3-server 0.817 vs AF2 0.812（P=.16，server 在 86/150=57.3% 靶上更高）；AF3-local 0.812（P=.44，77/150=51.3%）。LDDT——server 0.792 vs 0.787（P=2.67×10⁻³，98/150=65.3%）；local 0.790（P=3.77×10⁻³，95/150=63.3%）。全局精度无显著差异，局部精度显著但幅度小。108 单域两者相当；42 多域仅 LDDT 提升显著（P=5.53×10⁻⁴ / 3.47×10⁻⁴）。案例 8TW1（两域内溶素）：AF3-server 0.916、AF3-local 0.873 vs AF2 0.562——AF2 单域各 0.990/0.840 但域间朝向错误。案例 8JGO：server 0.934 vs local 0.636（差约 0.300）；各跑 20 次共 100 个模型后两版分布几乎一致、20 次后 top 模型同为 0.633，但 TM 分布横跨 0.6–1.0，说明预测不稳定且内置排序不可靠。easy（86）：TM 0.911/0.907 vs 0.906，LDDT 0.860/0.860 vs 0.854，仅 LDDT 显著；hard（64）：TM 0.691/0.685 vs 0.687，LDDT 0.700/0.697/0.697，正确率 AF2 75.0% vs AF3 71.9%/70.3%（不显著）；easy 比 hard 高约 20%–30%。严格子集（52 个与训练集及彼此 <25% 序列一致性的单体）：三方法相当，无显著差异。

**单序列模式（150 单体，无 MSA/模板）**：TM 0.413（AF3-local）vs 0.353（AF2），P=2.92×10⁻⁷；LDDT 0.433 vs 0.377，P=1.96×10⁻⁹；TM≥0.5 比例 26.0% vs 16.0%。作者归因于 AF3 只用 4 层 EvoFormer 处理 MSA、48 层 PairFormer，对 MSA 依赖更低；但两者绝对精度都很低。

**Benchmark-II（113 孤儿蛋白）**：TM——server 0.877 vs 0.864（P=.08，65/113=57.5%）；local 0.871（P=.36）。LDDT——server 0.800 vs 0.786（P=.02，68/113=60.2%）；local 0.794（P=.09）。14 个 AF3 流程零同源的孤儿：AF2 反而略优但不显著；其中 4 个 AF2 流程能检出少量同源序列且 AF2 一致占优；剔除后剩余 10 个 TM 0.884/0.878/0.869、LDDT 0.793/0.792/0.790。

**Benchmark-III（60 组多构象）**：两状态均预测正确——server 14/60（23.3%）、local 12/60（20.0%）、AF2 9/60（15.0%）；仅一态——30/60（50.0%）、32/60（53.3%）、29/60（48.3%）；两态皆错——16/60（26.7%）、16/60（26.7%）、22/60（36.7%）。生成"既准又特异"（对一态 TM>0.8 且对另一态 <0.8）的状态数：server 32、local 54、AF2 43（满额 120）。4TU7（双域同二聚体，两实验构象间 TM 仅 0.530）：仅 AF3-server 两态都准（链 A 0.916、链 B 0.853），AF2 为 0.772/0.574，AF3-local 为 0.882/0.697。

**Benchmark-IV（206 多聚体）**：TM-score——server 0.821（+1.1%）、local 0.824 vs AF-Multimer 0.812（P=.49 / .74，不显著）；正确折叠数 174/178 vs 173。LDDT——0.860/0.861 vs 0.851（+1.1%/+1.2%），P=2.42×10⁻⁴ / 8.55×10⁻⁴（显著）。DockQ——server 0.589（+3.7%）vs 0.568；正确界面（DockQ≥0.23）161/206（78.2%）vs 148/206（71.8%），P=.14 / .19（不显著）。ipTM 与 DockQ 相关性 0.81/0.79 vs 0.76。异聚体（35）：DockQ server 0.640（+9.4%，P=.04）、local 0.656（+12.1%，P=4.25×10⁻³）；同聚体（171）：LDDT 小幅显著提升，DockQ 0.579/0.578 vs 0.568（P=.72/.76 不显著）。案例：8FV3 AF3 TM 0.974/DockQ 0.735，AF-Multimer 0.475/0.010；8JGX 相反，AF-Multimer 0.950/0.767，AF3 约 0.507/0.159。以 0.8×ipTM+0.2×pTM 选优的模型整合未带来显著提升。不稳定性案例：8VA1 server 0.976 vs local 0.304；8JF2 server 0.289 vs local 0.779；20 次重跑 LDDT 分布紧、TM 分布宽（约 0.2–1.0），8VA1 server 最高 0.992 vs local 0.666。

**Benchmark-V（80 肽–蛋白复合物）**：三方法几乎相同——TM 约 0.91–0.92，pLDDT 约 0.86，DockQ 约 0.63；>95% 达 TM≥0.5，约 85% 达 DockQ≥0.23，>85% 达 TM≥0.80 但仅约 40% 达 DockQ≥0.80。作者指出 TM/LDDT 被蛋白骨架主导、对肽朝向错误不敏感，DockQ 才暴露逐靶大差异。

**Benchmark-VI（102 抗原–抗体）**：TM-score——0.739/0.735 vs 0.683（+8.1%/+7.5%，P=6.82×10⁻⁴ / 3.41×10⁻⁴），在 65/66 个复合物上占优，超 0.05 的优势靶数 33/31 vs 11/9。LDDT——0.828/0.828 vs 0.812（+1.9%/+2.0%，P=3.92×10⁻⁹ / 2.80×10⁻⁹）。DockQ——0.422/0.418 vs 0.325（+29.8%/+28.6%，P=2.36×10⁻⁵ / 2.00×10⁻⁵）；但正确界面率仅 27.5%/28.4% vs 9.8%。CDR-TMscore——0.183/0.176 vs 0.074（P=2.27×10⁻⁴ / 8.94×10⁻⁶）；CDR-TMscore≥0.5 仅 18.6%/17.6% vs 7.8%。案例 8ts0：全局 TM 0.974/0.976 vs 0.810，但 CDR-TMscore 0.840/0.887 vs 0.003。

**Benchmark-VII（52 RNA 单体）**：TM-score——trRosettaRNA 0.548 > NuFold 0.525 > AF3 0.510/0.504 > RoseTTAFoldNA 0.449 > RhoFold+ 0.431；hard（30）上 trRosettaRNA 0.457 领先、AF3 与 NuFold 均约 0.40；easy（22）上 NuFold 0.700 > trRosettaRNA 0.672 > AF3 0.654/0.652。LDDT——AF3 0.713/0.715 最高，比次优至少高 13.0%，全部两两比较 Bonferroni 校正后 P<10⁻⁴；比其余四方法中最好者高的靶数 39/52（75.0%）与 41/52（78.8%）。INF——AF3 0.814/0.816 最高，比次优至少高 2.9%（校正后 P<10⁻²），34/52（65.4%）靶占优。案例 7URM 链 v（tRNAUTu1A P 位结合态）：AF3 TM 0.727/0.613、LDDT 0.796/0.797、INF 0.93/0.94，能正确建出高度柔性的可变环；RoseTTAFoldNA TM 0.312、LDDT 0.477、INF 0.66，可变环与 D 臂错为双螺旋。

**Benchmark-VIII（23 RNA 多聚体）**：TM-score——0.300/0.299 vs 0.242（+23.9%/+23.5%），P=9.18×10⁻² / 1.19×10⁻¹（不显著）；正确折叠（TM≥0.5）仅 2/23，RoseTTAFoldNA 为 0。LDDT——0.564/0.571 vs 0.462（+22.2%/+23.6%），P=2.14×10⁻³ / 6.71×10⁻³（显著），17/23 靶占优。案例 8VVJ：AF3 TM 0.758/0.735、LDDT 0.752/0.755 vs RFNA 0.439/0.637。

**Benchmark-IX（59 蛋白–核酸复合物）**：TM-score——server 0.745（+14.1%）、local 0.741 vs 0.653，P=1.04×10⁻⁵ / 6.45×10⁻⁶；42/59 靶占优，17 靶优势 >0.1 而 RFNA 仅 2 靶。LDDT——0.774（+14.3%）、0.753（+11.2%）vs 0.677，P=1.75×10⁻¹⁰。亚基拆分：122 个蛋白亚基 TM 0.875/0.873 vs 0.835；RNA 亚基 0.401 vs 0.297（+35.0%）；DNA 亚基 0.309 vs 0.267（+15.7%）。FNAT——0.410/0.417 vs 0.186（P=2.50×10⁻⁶）；捕获过半天然接触的比例 35.6% vs 16.9%。案例 8A0X（HigAB–DNA）：AF3 建出 DNA 弯曲（DNA 亚基 TM 约 0.600 vs 0.343），整体 TM>0.850 vs 0.311；案例 8PI9：FNAT 约 0.850 vs 0.013，整体 TM>0.950 vs 0.447。

**运行时间**（NVIDIA A100 40GB + AMD EPYC 7763，每任务 8 CPU 核、40GB 内存）：AF3-local 在所有基准上最快——单体约 20 min vs AF2 约 160 min；单序列模式约 3 vs 19 min；孤儿蛋白约 20 vs 74 min；多聚体约 31 vs 297 min；肽–蛋白约 34 vs 272 min；抗原–抗体约 47 vs 382 min；RNA 单体约 10 min vs RoseTTAFoldNA 约 445、RhoFold+ 约 402、NuFold 约 531、trRosettaRNA 约 426 min；RNA 多聚体约 11 vs 799 min；蛋白–核酸约 23 vs 996 min。

**结论中的对比口径**：作者给出 AF3 平均 TM-score 序列——蛋白单体 0.898、蛋白复合物 0.821、RNA 单体 0.510、蛋白–核酸 0.745（其中 0.898 与 Benchmark-I 的 0.817 口径不一致，原文未解释，疑为不同子集或笔误）。

## 对照与消融
本文是基准论文，无算法消融，其"对照"与稳健性设计为：
- **对照工具按任务选型**：蛋白类对 AlphaFold2 / AlphaFold-Multimer（同训练数据截至 2021-09-30 的模板库）；RNA 单体对 RoseTTAFoldNA、RhoFold+、NuFold、trRosettaRNA 四法；RNA 多聚体与蛋白–核酸仅对 RoseTTAFoldNA（作者称其为目前唯一可端到端建模此类复合物的工具）。
- **双版本对照**：AlphaFold3-server vs AlphaFold3-local 在所有基准上并行给出。
- **难度分层**：单体按 LOMETS3 分 easy/hard、按 DomainParser 分单域/多域；RNA 按模板 TM-score 分 easy/hard；多聚体分异聚/同聚。
- **严格去冗余子集**：52 个 <25% 序列一致性单体子集、14 个零同源孤儿蛋白子集。
- **信息剥夺消融**：单序列模式（无 MSA、无模板）对比 AF2 与 AF3。
- **抽样稳定性分析**：8JGO、8VA1、8JF2、7URM_v、8UPT_A、8QA9、8P5Q 等靶上各版本 20 次×5 模型重跑，考察模型分布与排序能力。
- **集成尝试（负结果）**：以 0.8×ipTM+0.2×pTM 选优合并 AF3 与 AF-Multimer 模型未显著提升 TM-score，作者据此主张需要针对性的模型精度估计（EMA）方法。

## 作者自述的局限
1. 单体预测精度或已进入平台期（至少对现有架构与数据库规模），尤其是单域蛋白；作者同时承认"更深 MSA + Monte Carlo 采样已被证明能带来超过 AlphaFold3 的显著提升"（引 [23]）。
2. 多构象蛋白：AF3 预测多稳定于单一状态，采样、识别与打分替代构象的专门方法仍缺失；用户对可能有多个构象状态的蛋白应谨慎使用。
3. 模型排序是主要瓶颈：重跑实验显示 server 与 local 来自相似模型分布，但单次运行 top-1 可能选错；内置排序难以区分高质量模型。
4. 抗原–抗体界面：绝对精度仍低（正确界面仅约 27.5%–28.4%，CDR 正确折叠约 18%），高保真界面预测仍是重大挑战；这与 CASP16 中 >30% 寡聚体（尤其抗原–抗体）仍极具挑战、多数组仅预测对约四分之一的观察一致。
5. RNA 多聚体：正确全局折叠 <10%，需要方法论创新而非渐进改进。
6. 蛋白–核酸复合物与 RNA 单体的平均 TM（0.745/0.510）远低于蛋白单体与蛋白复合物，仍存在明显精度差距。
7. 对照口径瑕疵：AF2 单体权重训练数据截止 2018-04-30，若用与 AF3 相同训练集重训结论或有变化（作者预期差异不大）。
8. 高阶组装（high-order assemblies）类靶标在本基准中覆盖有限。

## 我的评价
- **基准设计整体严谨**：九个数据集统一以 AlphaFold3 训练集截止日（2021-09-30）为时间锚、以序列一致性+覆盖度为去冗余标准，且 AlphaFold2 用同一模板库，这在公平性上比多数早期比较更强；难度分层（easy/hard、单域/多域、异聚/同聚）和严格子集（<25% 一致性、零同源孤儿）进一步保护了结论。
- **结论被"统计显著 vs 实际幅度"之间的张力主导**：多处优势（单体 LDDT +0.005、多聚体 LDDT +0.9%–1.2%、DockQ +3.7%）统计显著但量级极小，读者应区分"显著"与"有意义"；作者在结论中也如实把提升描述为 minor。
- **对照工具有倾斜风险**：蛋白–核酸与 RNA 多聚体只对 RoseTTAFoldNA（其绝对精度很低），因此"大幅领先"部分源于对照弱，而 RNA 单体对四法的比较显示 AF3 全局精度其实居中，说明多对照比单对照更能揭示真实位置。
- **难度分布不均对结论的影响**：Benchmark-I 中 easy/hard 靶性能差 20%–30%，而单体整体均值 0.81–0.82 被 easy 靶抬高；在严格子集上 AF3 的优势消失，提示"AlphaFold3 局部精度更优"的结论对训练集同源污染敏感。抗原–抗体数据集的"显著优势"是其最强结论，但绝对成功率仍低，提示任务本身远未解决。
- **一致性疑点（原文内部）**：(a) 方法部分称 Benchmark-III 从 M-SADA 选 60 组，结果段落开头又写"nine sets of structures"，两处矛盾且 60 与正文结果数字（14/60 等）吻合，疑似笔误；(b) Fig.2 图注写"102 orphan proteins"，正文与数据量均为 113；(c) 结论段单体平均 TM 0.898 与 Benchmark-I 的 0.817 不一致；(d) RNA 一节把 Benchmark-VII 误写为"see Dataset for Benchmark-IV"。这些不影响主结论，但说明细节校对不足。
- **图与表的呈现**：正文 0 表、10 图，所有量化对比（40 余项）都在补充材料，对读者查证不利；PMC 提取无图像，图内数字无法二次核验。

## 可复现要点
- 版本锚点：AlphaFold3 v3.0.1（server + standalone）、AlphaFold-Multimer v2.3.0、AlphaFold2 v2.3.0；AF2 模板库最大日期 2021-09-30。
- 靶标清单与全部统计在 Supplementary Tables S1–S39（S1–S9 为九类数据集成员列表）。
- 指标实现：TM-score 用 US-align（-TMscore 7 -ter 0）；LDDT 用 OpenStructure 默认；DockQ 用 [52] 包；FNAT 由 DockQ 输出；INF 用 ClaRNA；CDR-TMscore 为按抗原叠合后六条 CDR 环的 TM-score。
- 抽样协议：server 与 local 每靶各 20 次（server 每次 5 模型、共 100 模型）考察分布；稳定性分析涉及 8JGO、8VA1、8JF2、7URM_v、8UPT_A、8QA9、8P5Q。
- 硬件：NVIDIA A100 40GB GPU、AMD EPYC 7763 64 核 CPU、每任务 8 核 40GB 内存。

## 术语
- TM-score：模板建模分数，全局拓扑相似度（>0.5 视为同一折叠）。
- LDDT（local distance difference test）：免叠合的局部距离差检验。
- DockQ：整合 Fnat、iRMS、LRMS 的界面质量复合分数（≥0.23 视为正确界面）。
- FNAT（fraction of native contacts）：天然接触保留比例。
- INF（interaction network fidelity）：RNA 相互作用网络保真度（Matthews 相关系数）。
- CDR（complementarity-determining region）：抗体互补决定区；CDR-TMscore 为本文新引入的 CDR 环精度指标。
- ipTM / pTM：界面预测 TM-score / 全局预测 TM-score；pLDDT：残基水平预测置信度。
- MSA（multiple sequence alignment）：多序列比对；Evoformer 与 PairFormer 为 AlphaFold2/3 的主干模块，AF3 用扩散模块（diffusion module）替代结构模块。
- EMA（estimation of model accuracy）：模型精度估计（模型选择/排序问题）。
- 孤儿蛋白（orphan protein）：序列库中无可检出同源序列的蛋白；单序列模式（single-sequence mode）：无 MSA 与模板的预测模式。
- 异聚体（heteromer）/同聚体（homomer）：由不同/相同蛋白链组成的复合物。
- CD-HIT、CD-HIT-EST、US-align、BLASTN、HHblits、ClaRNA、OpenStructure、DomainParser、LOMETS3、M-SADA：去冗余、比对、RNA 相互作用分析、结构域划分、难度分类与多构象数据来源工具/数据库。
- CASP（Critical Assessment of protein Structure Prediction）：结构预测盲测竞赛。

---

**导航**

- 模块笔记：[[notes/class-notes/结构生物学/AI结构预测/精读/_index|精读总索引]]
- 上一篇：[[notes/class-notes/结构生物学/AI结构预测/精读/04 Arne Elofsson 2026]]

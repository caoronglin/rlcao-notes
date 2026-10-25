---
title: Josh Abramson 2024｜Accurate structure prediction of biomolecular interactions with AlphaFold 3.
date: 2026-10-08
tags: [课程, 结构生物学, 文献精读, 复合物与多模态]
status: primary
类型: 精读笔记
来源: Josh Abramson et al. *Nature* 2024，DOI [10.1038/s41586-024-07487-w](https://doi.org/10.1038/s41586-024-07487-w)
模块: 复合物与多模态：从蛋白到生物分子相互作用
主键: 38718835
---

# Accurate structure prediction of biomolecular interactions with AlphaFold 3.

**Josh Abramson et al.** · *Nature* · 2024 · DOI [10.1038/s41586-024-07487-w](https://doi.org/10.1038/s41586-024-07487-w)

> 所属模块：[[notes/class-notes/结构生物学/AI结构预测/03-复合物与多模态-从蛋白到生物分子相互作用|复合物与多模态：从蛋白到生物分子相互作用]]
# Accurate structure prediction of biomolecular interactions with AlphaFold 3.（用 AlphaFold 3 精确预测生物分子相互作用结构）

- 期刊：Nature，卷 630，页 493–500，2024 年；DOI: 10.1038/s41586-024-07487-w；PMID: 38718835；PMC: PMC11168924
- 第一作者：Josh Abramson；共同通讯作者含 Demis Hassabis 与 John M Jumper（按作者列表末尾顺序，通讯作者身份在正文提取文本中未逐字注明）
- 摘要要点（原文）：AlphaFold 2 引发了蛋白质及其相互作用结构建模的革命。本文描述 AlphaFold 3 模型——一种大幅更新的、基于扩散（diffusion）的架构，能够预测包含蛋白质、核酸、小分子、离子和修饰残基的复合物的联合结构（joint structure）。相比此前的专用工具：蛋白-配体相互作用精度远超当前最先进的对接工具（docking tools）；蛋白-核酸相互作用精度远高于核酸专用预测器；抗体-抗原预测精度显著高于 AlphaFold-Multimer v.2.3。这些结果说明在单一统一的深度学习框架内实现跨生物分子空间的高精度建模是可能的。

## 一句话结论

AlphaFold 3（AF3）用基于扩散的生成式架构替换了 AlphaFold 2 的 Evoformer + 结构模块（structure module）：以简化的 pairformer 处理对表示（pair representation），以扩散模块直接生成原子坐标，从而在一个统一框架内高精度预测蛋白质、核酸、小分子、离子与修饰残基组成的联合复合物结构，并在除一项之外的所有评测类别上超过相应的专用工具。

## 研究问题

1. 核心问题（原文）：在深度学习框架内，能否准确预测包含配体、离子、核酸和修饰残基等更广范围生物分子的复合物结构？此前针对特定相互作用类型的预测器大量存在（作者列举了引用 16–28），另有一个与本文同期开发的全能型方法（引用 29），但此类深度学习尝试的精度参差不齐、常低于受物理启发的（physics-inspired）方法（引用 30,31），且几乎都高度特化于单一相互作用类型，无法预测含多种实体的通用生物分子复合物。
2. 架构问题：AlphaFold 2（AF2）成功之后，能否把基于 MSA（多序列比对）与结构模块的架构，改造为能容纳任意化学实体（小分子、离子、修饰残基）且减少特殊化处理（special casing）的统一架构。
3. 训练问题：扩散式生成模型易产生幻觉（hallucination）——在无结构区域发明看似合理的结构——如何抑制；以及在扩散训练下（每次只训练一步去噪，而非整条生成链）如何训练与精度相匹配的置信度（confidence）预测。
4. 评测问题：新模型与各类专用基线（对接工具 Vina、Gold、RoseTTAFold All-Atom、RoseTTAFold2NA、CASP15 的 AIchemy_RNA/AIchemy_RNA2、AlphaFold-Multimer v.2.3）相比表现如何。

## 方法与数据

### 架构（Main「Network architecture and training」+ 图 1d、图 2a–c）

- 总体结构与 AF2 呼应：大网络主干（trunk）演化化学复合物的对表示（pairwise representation），随后由结构模块用对表示生成明确的原子坐标；但每个主要组件差异很大。
- MSA 处理大幅弱化：相比 AF2 的 evoformer，MSA 嵌入模块更小更简单，块数减至 4 个；MSA 表示的处理采用开销低的「pair-weighted averaging」；之后只保留对表示参与后续处理。MSA 表示本身不再保留，所有信息经由对表示传递。
- pairformer（图 2a）取代 evoformer 成为主导处理块：只操作对表示与单表示（single representation）；对处理与块数（48 块）基本沿袭 AF2。维度：对表示 (n, n, c)、c = 128；单表示 (n, c)、c = 384；n 为 token 数（聚合物残基 + 原子）；48 个块各自有独立可训练参数。
- 扩散模块（图 2b）取代 AF2 的结构模块：直接作用于原始原子坐标与抽象的 token 表示，无旋转框架（rotational frames）、无等变处理（equivariant processing）。训练时输入「加噪」原子坐标、预测真实坐标；小噪声下去噪任务强调局部立体化学，大噪声下强调体系的大尺度结构；推理时采样随机噪声并反复去噪产生最终结构。这是生成式训练，产出答案的分布——即使网络对位置不确定，局部结构（如侧链键几何）仍是锐利的；因此可以去掉残基的扭角参数化（torsion-based parametrizations）与结构违规损失（violation losses），同时处理完整复杂度的通用配体。与同期一些工作（引用 34）一致，作者发现架构不需要对全局旋转平移的不变性/等变性，遂省略之以简化模型。
- 作者给出的 AF2 侧依据：在 AF2 上观察到「移除结构模块大部分复杂度对预测精度影响不大」，而保留骨架框架与侧链扭角表示为通用分子图增加很多复杂度；AF2 还需要精细调校的立体化学违规惩罚来保证化学合理性。

### 训练（Methods「Training regime」+ 图 2c、图 2d）

- 训练数据截止：所有训练结构数据均不晚于 2021 年 9 月 30 日发布；PoseBusters 评测所用模型进一步过滤掉 2021 年 9 月 30 日之后发布的 PDB 结构（即用 2019 年 9 月 30 日截止的模型）。
- 一个优化器步（optimizer step）使用 256 个输入样本的 mini-batch；初始训练时扩散样本数 256 × 48 = 12,288，微调时降为 256 × 32 = 8,192。
- 三阶段训练：初始训练裁剪尺寸（crop size）384 token；随后两阶段微调，裁剪尺寸 640 与 768 token。
- 图 2c 训练配置：网络主干末端引出两条扩散通路（图中两个扩散模块共享权重）；一条用于常规去噪训练；另一条做「mini-rollout」——以大于正常步长的步长在训练中生成完整结构预测，供置信度头训练使用（distogram 头在图中省略；stop sign 表示截断梯度）。mini-rollout 预测出的结构用于置换对称的 ground-truth 链与配体，并计算性能指标来训练置信度头。置信度头用对表示预测改进版 pLDDT（predicted local distance difference test）与 PAE（predicted aligned error）矩阵（同 AF2），另加 PDE（predicted distance error，预测结构距离矩阵相对真实结构的误差）矩阵。
- 训练动态（图 2d）：初始训练阶段模型很快学会局部结构（所有链内指标快速上升，前 20,000 步内达到最大性能的 97%），而学习全局构型需要长得多的时间（蛋白-蛋白界面 LDDT 到 60,000 步后才越过 97% 线）。开发期间观察到某些能力较早触顶并开始下降（很可能因该能力训练样本有限而过拟合），对策是提高/降低相应训练集的采样概率（Supplementary Methods 2.5.1），并用所有上述指标及若干附加指标的加权平均做早停（early stopping）挑选最佳检查点（Supplementary Table 7）。大裁剪尺寸的微调阶段在所有指标上都有提升，对蛋白-蛋白界面提升尤其大（Extended Data Fig. 2）。
- 防幻觉：采用交叉蒸馏（cross-distillation）——用 AlphaFold-Multimer v.2.3 预测的结构富集训练数据；在这些结构里，无序区通常表现为拉长的环而非紧凑结构，训练 AF3 模仿这种行为，从而大幅降低幻觉（Extended Data Fig. 1，CAID 2 基准上的无序预测结果）。

### 推理（Methods「Inference regime」）

- 推理期模板（templates）或参考配体位置特征（ref_pos）均不晚于 2021 年 9 月 30 日；PoseBusters 用更早的 2019 年 9 月 30 日截止。
- 默认协议：同一训练模型跑 5 个种子（seeds），每种子 5 个扩散样本，共 25 个样本，取置信度最高的样本；抗体-抗原预测除外——两个模型都按 1,000 个模型种子排序（每个 AF3 种子 5 个扩散样本）。
- 排序方式（Supplementary Methods 5.9.3）：全局排序用 pTM 与 ipTM 的混合，另加减少大量冲突（clashes）与提高无序率的项；单链排序用链特异 pTM；界面排序用针对链对的定制 ipTM；修饰残基排序用该残基上的平均 pLDDT。
- 标准结晶助剂（crystallization aids）从预测中排除（Supplementary Table 8）。

### 数据与评测集（Methods）

- 近期 PDB 评测集（recent PDB evaluation set）：8,856 个 PDB 复合物，发布于 2022 年 5 月 1 日至 2023 年 1 月 12 日，几乎包含该时段内所有小于 5,120 个模型 token 的复合物。单链与界面分别打分，再对链与界面做聚类（clustering），先类内聚合、再跨类取平均；分布统计用「类大小的倒数」加权。
- 低同源（low homology）过滤：与训练集序列同源性以模板搜索度量（Supplementary Methods 2.4）；评测复合物中与训练集链的最大序列一致性（sequence identity）大于 40% 的聚合物链被滤除（序列一致性 = 评测链中与训练集链相同残基的百分比）；少于 16 个残基的肽链一律滤除；聚合物-聚合物界面若两条聚合物都与训练集中同一复合物的两条链有大于 40% 一致性则滤除；与肽的界面则看非肽实体是否对训练集任一链有大于 40% 一致性。
- 与 AlphaFold-Multimer v.2.3 比较（蛋白-蛋白界面、蛋白单体、MSA 深度依赖）：限制低同源近期 PDB 集到少于 20 条蛋白链且少于 2,560 token 的复合物，与「未 relax 的」AF-Multimer v.2.3 预测比较。
- 抗体-抗原集：从低同源集筛出至少含一个蛋白-蛋白界面、且其中一条链属于 PDB 两个最大链簇之一（代表抗体）的复合物；再限制最多 2,560 token 且 PDB 中无未知氨基酸，得到 71 个抗体-抗原复合物、166 个抗体-抗原界面、覆盖 65 个界面簇。
- 配体评测排除：标准结晶助剂（Supplementary Table 8）、配体排除列表（Supplementary Table 9）、聚糖（Supplementary Table 10）；键合与非键合配体分开评测；离子仅在特别说明时纳入（Supplementary Table 11）。
- MSA 深度分析（Extended Data Fig. 7a）：计算查询序列每个位置归一化的有效序列数 Neff（number of effective sequences）：统计该位置 MSA 中非空位残基数，按 Neff 方案加权，序列一致性阈值 80%（在任一序列中非空位的区域上度量）。

### 指标（Methods「Metrics」）

- 预测结构与 ground-truth 的对应：多相同实体时通过最大化 LDDT 指派；配体原子局部对称群用 RDKit 给出的前 1,000 个每残基对称做穷举搜索。
- 质量度量：DockQ、LDDT、口袋对齐 r.m.s.d.（pocket-aligned r.m.s.d.）。蛋白-核酸界面用 iLDDT（界面 LDDT，跨链原子间距离计算）；DockQ 与 iLDDT 高度相关（Extended Data Fig. 9），故 DockQ 的标准阈值可换算成等价的 iLDDT 阈值。核酸 LDDT（链内与界面）的包含半径（inclusion radius）用 30 Å（蛋白通常用 15 Å），因为核酸尺度更大。
- 置信度校准用定制指标 LDDT_to_polymer：某实体每个原子到包含半径内任一 Cα 或 C1′ 聚合物原子的距离差异；与 pLDDT 的训练目标密切相关。
- 口袋对齐 r.m.s.d. 定义：口袋 = 配体任一重原子 10 Å 内的所有重原子，限制在被打分配体/修饰残基的「主聚合物链」（primary polymer chain）上；蛋白再进一步只保留骨架原子。主聚合物链的定义：PoseBusters 取配体 10 Å 内原子最多的蛋白链；键合配体取键合的聚合物链；修饰残基取残基所在链（不含该残基）。用口袋对预测结构与 ground-truth 做最小二乘刚性对齐，再在配体全部重原子上算 r.m.s.d.。
- 修饰相关（正文 Results）：共价修饰（键合配体、糖基化、修饰蛋白残基与核酸碱基），修饰可作用于任何聚合物残基（蛋白、RNA 或 DNA）；成功率 = 口袋 r.m.s.d. < 2 Å 的百分比。键合配体与糖基化数据做质量过滤（ranking_model_fit > 0.5，即 RCSB 结构验证报告中模型质量高于中位数）；与 PoseBusters 一样不过滤与训练集的同源性。按结合聚合物链同源过滤（polymer template similarity < 40）后键合配体只剩 5 个簇、糖基化 7 个簇。多残基聚糖被排除（RCSB 验证报告无 ranking_model_fit）。多残基聚糖在全质量数据上的成功率 42.1%（n = 131 簇），略低于单残基聚糖的 46.1%（n = 167）。

### 基线（Methods「Nucleic acid prediction baseline」「PoseBusters」）

- RoseTTAFold2NA（RF2NA）：用与 AF3 相同的 MSA 跑开源 RF2NA；仅比较 < 1,000 总残基/核苷酸的目标（RF2NA 的验证范围），且只限单一核酸类型（RF2NA 未训练同时含 DNA 与 RNA 的体系）。当时没有可公开使用的系统能对 PDB 中任意生物分子组合做基线比较。
- CASP15 RNA 基线：正文称十个公开可得的 CASP15 RNA 靶点；Methods 括号中列出的编号为 R1116/8S95、R1117/8FZA、R1126（自 CASP15 官网下载）、R1128/8BTZ、R1136/7ZJ4、R1138/[7PTK/7PTL]、R1189/7YR7、R1190/7YR6。比较 top-1 排序预测；多个 ground-truth（R1136）时对最近状态打分。对比对象：RF2NA（代表性机器学习系统）、AIchemy_RNA2（人类干预的最佳参赛者）、AIchemy_RNA（最佳机器学习系统）；各参赛者预测均从 CASP 官网下载并内部打分。
- PoseBusters：428 个蛋白-配体结构（2021 年或以后发布到 PDB）；评测用「架构相同、训练安排相似、仅把数据截止提前到 2019 年 9 月 30 日」的独立 AF3 模型。推理在指定 PDB 的非对称单元上进行，小修改：若干 PDB 中与目标配体冲突的链被移除（7O1T、7PUV、7SCW、7WJB、7ZXV、8AIE）；8F4J 全体系超 5,120 token，只保留目标配体 20 Å 内的蛋白链。每靶点 5 种子 × 5 扩散样本 = 25 个预测，按质量与预测精度排序：排序分 = ipTM 聚合（Supplementary Methods 5.9.3 第 3 点），若配体有手性错误或与蛋白冲突则再除以 100。口袋对齐 r.m.s.d. 先对齐到 ground-truth 口袋骨架原子（配体 10 Å 内的 CA、C、N），主蛋白链 = 配体 10 Å 内接触最多的链；用 PoseBusters Python 包 v.0.2.7 打分。基线分两类：只用蛋白序列 + 配体 SMILES 的，和「泄漏已解出的蛋白-配体测试结构信息」的（传统对接方法使用后者这种特权信息，实际使用中不可得）。
- 口袋信息版本（消融/扩展）：微调一个 2019 年 9 月 30 日截止的 AF3 模型，加一个 token 特征标记「口袋-配体对」——对感兴趣的配体实体及配体重原子 6 Å 内的口袋残基置 true（口径同 Uni-Mol 的 6 Å）；训练时随机选一个配体实体，推理时按目标配体的 CCD 代码选（可能选中多个同 CCD 配体链）。结果见 Extended Data Fig. 4。

## 关键图表解读

> 说明：本次 PMC 提取为纯文本，14 幅图与 2 张表（文件头注释：图 14 表 2）的图像本身均未获取；以下为正文与图注文字的描述。主图 Fig. 1–5 的图注已随正文提取，Extended Data 各图的详细内容未提取，仅能依据正文引用描述。

- Fig. 1a（图像未获取）：AF3 预测示例——细菌 CRP/FNR 家族转录调控蛋白结合 DNA 与 cGMP（PDB 7PZB；全复合物 LDDT 82.8、GDT 90.1）。
- Fig. 1b（图像未获取）：人冠状病毒 OC43 刺突蛋白，4,665 残基、重度糖基化并结合中和抗体（PDB 7PNM；全复合物 LDDT 83.0、GDT 83.1）。
- Fig. 1c（图像未获取）：AF3 在三类基准上的表现对比柱状图——PoseBusters（v.1，2023 年 8 月版）配体/共价修饰的「口袋对齐配体 r.m.s.d. < 2 Å 百分比」、近期 PDB 评测集蛋白-核酸复合物的界面 LDDT、核酸与蛋白单体的 LDDT、蛋白-蛋白与蛋白-抗体界面的「DockQ > 0.23 百分比」、CASP15 RNA。除蛋白-抗体（两模型均按 1,000 种子排序）外，所有分数取 5 个模型种子（每种子 5 个扩散样本）中置信度排名第一的样本。配体 n = 靶点数，核酸 n = 结构数，修饰 n = 簇数，蛋白 n = 簇数；柱高为均值；误差棒 PoseBusters 用精确二项分布 95% 置信区间，其余用 10,000 次 bootstrap 重采样；显著性 PoseBusters 用双侧 Fisher 精确检验、其余用双侧 Wilcoxon 符号秩检验。图中从左到右精确 P 值：2.27 × 10⁻¹³、2.57 × 10⁻³、2.78 × 10⁻³、7.28 × 10⁻¹²、1.81 × 10⁻¹⁸、6.54 × 10⁻⁵、1.74 × 10⁻³⁴。
- Fig. 1d（图像未获取）：AF3 推理架构图——矩形为处理模块、箭头为数据流；黄色 = 输入数据、蓝色 = 抽象网络激活、绿色 = 输出数据、彩色小球 = 物理原子坐标。
- Fig. 2a（图像未获取）：pairformer 模块——输入/输出为对表示 (n, n, c) 与单表示 (n, c)；n 为 token 数（聚合物残基与原子）；c 为通道数（对表示 128、单表示 384）；48 个块各具独立可训练参数。
- Fig. 2b（图像未获取）：扩散模块——输入为每 token 表示（绿色：输入；蓝色：对表示；红色：单表示）与每原子表示；彩色小球为物理原子坐标；Cond. = 条件化，rand. rot. trans. = 随机旋转平移，seq. = 序列。
- Fig. 2c（图像未获取）：训练配置图（distogram 头省略）——从网络主干末端接出；黄色箭头 = ground-truth 数据、绿色箭头 = 预测数据、蓝色箭头 = 抽象激活数组；stop 标志 = 梯度截断；两个扩散模块共享权重（其一为常规去噪训练、其一为 mini-rollout 供置信度头）。
- Fig. 2d（图像未获取）：初始训练与微调阶段的训练曲线——评测集 LDDT 随优化器步数的变化；散点为原始数据点，曲线为核宽 9 个数据点的中值滤波平滑；十字标记「平滑性能达到初始训练最大值 97%」的位置。正文解读：链内指标前 20,000 步内达 97% 上限，蛋白-蛋白界面 LDDT 要到 60,000 步后才过 97% 线。
- Fig. 3（图像未获取）：六例预测复合物（蓝色 = 预测蛋白链、绿色 = 预测抗体、橙色 = 预测配体与聚糖、紫色 = 预测 RNA、灰色 = ground truth）：a，人 40S 核糖体小亚基（7,663 残基，含 18S rRNA 与 Met-tRNAiMet）与翻译起始因子 eIF1A、eIF5B 复合物（PDB 7TQL；全复合物 LDDT 87.7、GDT 86.9）；b，EXTL3 同源二聚体的糖基化球状部分（PDB 7AU2；平均口袋对齐 r.m.s.d. 1.10 Å）；c，间皮素（mesothelin）C 端肽结合单抗 15B6（PDB 7U8C；DockQ 0.85）；d，临床阶段抑制剂 LGK974 结合 PORCN–WNT3A 肽复合物（PDB 7URD；配体 r.m.s.d. 1.00 Å）；e，(5S,6S)-O7-sulfo DADH 结合具新颖折叠的 AziU3/U2 复合物（PDB 7WUX；配体 r.m.s.d. 1.92 Å）；f，NIH-12848 类似物结合 PI5P4Kγ 变构位点（PDB 7QIE；配体 r.m.s.d. 0.37 Å）。
- Fig. 4a（图像未获取）：置信度-精度校准图——上行：链对 ipTM 与界面精度（蛋白-蛋白 DockQ、蛋白-核酸界面 LDDT、蛋白-配体成功率，成功 = 低于阈值口袋对齐 r.m.s.d. 的百分比）；下行：蛋白/核苷酸/配体实体的平均 pLDDT 与定制指标 LDDT_to_polymer。箱线图箱体 25–75% 分位、中线中位数、须 5–95%；n 为各区间簇数。
- Fig. 4b–e（图像未获取）：PDB 7T82 单例预测——b 按 pLDDT 着色（橙 0–50、黄 50–70、青 70–90、蓝 90–100）可识别低置信链尾、中等置信界面与高置信二级结构；c 同预测按链着色，并标 DockQ 界面分数；d 为 DockQ 矩阵；e 为 PAE 矩阵（越深越置信），轴侧条为 c 的链着色；粉-灰与蓝-橙残基对 DockQ > 0.7 且 PAE 置信高，粉-橙与粉-蓝对 DockQ ≈ 0 且置信最低。
- Fig. 5a（图像未获取）：抗体预测质量随模型种子数上升——低同源抗体-抗原界面的 top-1 质量（按蛋白-蛋白 ipTM 排序）随排序所用种子数的函数；每点为对 1,200 个种子中随机抽取（有放回）1,000 个做 1,000 次重采样的均值；置信区间为对簇分数 10,000 次 bootstrap 的 95%；n = 65 簇；P = 2.0 × 10⁻⁵（正确率百分比）、P = 0.009（非常高精度百分比）。正文：即使到 1,000 个种子，top-1 预测仍在改善。
- Fig. 5b（图像未获取）：手性错误示例——Thermotoga maritima α-葡萄糖醛酸酶与 beta-d-葡萄糖醛酸（PoseBusters 靶点，PDB 7CTM）；AF3 预测为 alpha-d-葡萄糖醛酸（手性中心以星号标注）；该预测已按配体-蛋白 ipTM 排名并带手性与冲突惩罚。
- Fig. 5c（图像未获取）：构象覆盖受限——cereblon 的 open（apo，PDB 8CVP，左）与 closed（holo，结合 mezigdomide，PDB 8D7U，右）构象；apo 与 holo 的 AF3 预测（apo 叠 10 个样本）都是 closed 构象；虚线标注 N 端 Lon 蛋白酶样结构域与 C 端沙利度胺结合结构域间距离。
- Fig. 5d（图像未获取）：有 1,854 个未解析残基的核孔复合物（PDB 7F60）——左 ground truth、中 AlphaFold-Multimer v.2.3、右 AF3；展示无序区预测差异。
- Fig. 5e（图像未获取）：三核小体（trinucleosome）预测中 DNA（粉）与蛋白（蓝）链重叠（PDB 7PEU）；高亮重叠的蛋白链 B 与 J、自重叠 DNA 链 AA。
- Extended Data Table 1（未获取）：图 1c 的数值来源表，含各基准各方法数值（正文未给出具体数字）。
- Extended Data Fig. 1（未获取）：CAID 2 基准上的无序预测结果——正文：交叉蒸馏大幅降低幻觉。
- Extended Data Fig. 2（未获取）：大裁剪微调对各指标的影响——正文：所有指标提升、蛋白-蛋白界面尤其高。
- Extended Data Fig. 3（未获取）：三个 AF3 预测准确而 Vina 与 Gold 失败的例子。
- Extended Data Fig. 4（未获取）：a 为「口袋信息」微调版 AF3 的结果；b–f 为 PoseBusters v2（从基准中移除晶体接触）的结果与质量指标（对应 Extended Data Table 1）。
- Extended Data Fig. 5（未获取）：a 为 CASP15 RNA 详细对比（AF3 在各自公共子集上平均表现高于 RF2NA 与 AIchemy_RNA，但不及人类辅助的 AIchemy_RNA2）；b 为单独核酸（无蛋白）预测精度分析；c、d 为蛋白-核酸示例的 PAE 分析。
- Extended Data Fig. 6（未获取）：含共价修饰的蛋白、DNA、RNA 结构预测示例，含磷酸化对预测影响的分析。
- Extended Data Fig. 7（未获取）：a 为单链 LDDT 对 MSA 深度的依赖（AF3 与 AF-Multimer v.2.3 非常相似，浅 MSA 精度低）；b 为多种子排序收益在其他分子类别上不明显。
- Extended Data Fig. 8（未获取）：键合配体及其他界面上类似图 4a 的置信度-精度评估。
- Extended Data Fig. 9（未获取）：DockQ 与 iLDDT 高度相关（支撑阈值换算）。

## 主要结果与关键数字

### 各复合物类型的精度（Fig. 1c，Extended Data Table 1）

- 蛋白-配体（PoseBusters v.1，428 个 2021 年后发布的结构）：AF3 不使用任何结构输入仍远胜经典对接工具 Vina（Fisher 精确检验 P = 2.27 × 10⁻¹³），也远胜所有真正盲对接（blind docking）方法如 RoseTTAFold All-Atom（P = 4.45 × 10⁻²⁵）；传统对接工具虽「泄漏」已解结构信息仍落败。
- 蛋白-核酸与 RNA：AF3 比 RoseTTAFold2NA 更准（比较限于 < 1,000 残基的目标）；可预测数千残基的蛋白-核酸结构（例：Fig. 3a 的 40S 亚基复合物）。CASP15 RNA 十个公开靶点：在各自公共子集上平均表现高于 RF2NA 与 AIchemy_RNA（最佳纯 AI 参赛者），但未及最佳的人类专家辅助参赛 AIchemy_RNA2；因数据量小不报显著性检验。
- 共价修饰：键合配体、糖基化、修饰蛋白残基与核酸碱基均被准确预测；多残基聚糖成功率 42.1%（n = 131），单残基聚糖 46.1%（n = 167）（全质量数据口径）。
- 蛋白复合物：相对 AF-Multimer v.2.3，蛋白-蛋白预测成功率（DockQ > 0.23）提升（配对 Wilcoxon 符号秩检验 P = 1.8 × 10⁻¹⁸）；抗体-蛋白界面提升尤其明显（P = 6.5 × 10⁻⁵，注意该组按 1,000 种子而非通常 5 种子排序）；蛋白单体 LDDT 提升显著（P = 1.7 × 10⁻³⁴）。
- 「除一个类别外全部胜出」：唯一未超出的类别是 CASP15 RNA（不及 AIchemy_RNA2，人类干预的参赛）。
- 例证（Fig. 3）：40S 小亚基-起始因子复合物（7,663 残基，LDDT 87.7）、配体 r.m.s.d. 0.37–1.92 Å 的多例蛋白-配体/变构位点预测。

### 置信度校准（Fig. 4）

- ipTM 与界面精度（DockQ / 界面 LDDT / 配体成功率）、平均 pLDDT 与 LDDT_to_polymer 均随阈值单调变化，置信度与精度良好校准；7T82 例中 PAE 对 DockQ > 0.7 的链对置信高、对 DockQ ≈ 0 的链对置信低。

### 限制相关的量化观察

- PoseBusters 中手性违规率 4.4%（尽管排序公式已加手性惩罚）。
- 残余冲突几乎都发生在「核苷酸 > 100 且总残基 > 2,000」的蛋白-核酸复合物上。
- 抗体-抗原：5 种子 vs 1,000 种子排序，正确率百分比 P = 2.0 × 10⁻⁵、非常高精度百分比 P = 0.009；1,000 种子仍有持续改善；每个模型种子只用 1 个扩散样本（而非 5 个）结果无显著变化——说明要靠更多「模型种子」而非更多扩散样本。
- 构象：cereblon apo（8CVP 开放构象）与 holo（8D7U 闭合构象）都被预测为闭合构象；多随机种子不能近似溶液系综（solution ensemble）。

## 对照与消融

> 注意：本次提取的正文未包含独立、成体系的消融实验（如逐一删减模块的对比）；以下为文中的对照设计与「准消融」观察。

1. 与专用工具的多方对照（Fig. 1c / Extended Data Table 1）：蛋白-配体 vs Vina、Gold、RoseTTAFold All-Atom；蛋白-核酸 vs RoseTTAFold2NA；RNA vs RF2NA、AIchemy_RNA、AIchemy_RNA2；蛋白复合物/抗体 vs AlphaFold-Multimer v.2.3。基线口径特意区分「只用序列 + SMILES」与「泄漏测试结构信息」两类。
2. 架构取舍依据（AF2 内部分析的转述）：AF2 中移除结构模块大部分复杂度只对精度有「适度影响」（modest effect）；保留骨架框架 + 侧链扭角表示为通用分子图增加很多复杂度——这是用扩散模块替换结构模块的主要理由。该结论来自 AF2 时期观察，文中未给出 AF3 自身同数据下的 head-to-head 消融。
3. 幻觉对照（交叉蒸馏）：用 AF-Multimer v.2.3 预测结构富集训练数据，在 CAID 2 基准（Extended Data Fig. 1）上显示无序预测改善；正文表述为「大幅降低幻觉」。另加排序项鼓励更高溶剂可及表面积（solvent accessible surface area）以获得 ribbon 状无序表现。
4. 口袋信息版本（Extended Data Fig. 4a）：盲预测 vs 提供 6 Å 口袋 token 特征的微调版（口径对齐 Uni-Mol）。
5. 评测口径敏感性：PoseBusters v.1 vs v.2（v.2 移除晶体接触；Extended Data Fig. 4b–f）；PoseBusters 用 2019 年 9 月 30 日截止的独立模型以防训练污染（其余评测用 2021 年 9 月 30 日截止模型）。
6. 采样与排序：5 种子 × 5 扩散样本（共 25）为默认；抗体扩到 1,000 种子；「每种子 1 个扩散样本 vs 5 个」无显著差异。
7. 训练消融性观察：早停加权指标组合（Supplementary Table 7）与训练集采样概率调节；大裁剪微调对所有指标提升、对蛋白-蛋白界面尤其高（Extended Data Fig. 2）。
8. MSA 深度依赖：AF3 与 AF-Multimer v.2.3 依赖模式非常相似（Extended Data Fig. 7a）。
9. 键合 vs 非键合配体分开评测；离子单独处理（Supplementary Table 11）。

## 作者自述的局限

（Main「Model limitations」）

1. 立体化学两类违规：手性（chirality）——输出并不总是尊重手性，尽管输入特征含正确手性的参考结构；排序公式加手性惩罚后 PoseBusters 上仍观测到 4.4% 手性违规率。冲突（clashes）——偶尔出现重叠原子，极端情况如同源多聚体整链重叠（Fig. 5e）；排序惩罚可减少但无法消除；残余冲突几乎全在「>100 核苷酸且 >2,000 总残基」的蛋白-核酸复合物。
2. 无序区幻觉：由非生成式 AF2 切换到扩散式 AF3 带来「虚假结构有序」的挑战（Fig. 5d）；幻觉区域通常被标为很低置信，但可能缺乏 AF2 在无序区产生的特征 ribbon 外观；对策是 AF2 预测蒸馏 + 鼓励更大溶剂可及表面积的排序项。
3. 动力学缺失：模型预测 PDB 中的静态结构而非溶液动力学；AF3 的多个随机种子（扩散头或整体网络）都不能近似溶液系综。
4. 构象状态可能错误或不全面：如 E3 泛素连接酶天然 apo 开放、配体结合才闭合，但 AF3 对 holo 与 apo 都只预测闭合态（Fig. 5c）；已有许多围绕 MSA 重采样产生多样性的方法（引用 43–45）或许可辅助 AF3 多态预测。
5. 计算成本：某些靶点需生成大量预测并排序才能达到最高精度，代价是额外计算；抗体-抗原是强例（Fig. 5a），此现象在其他分子类别上不明显（Extended Data Fig. 7b）。

## 我的评价

（以下为评述，与论文陈述分开）

1. 关于「用扩散取代结构模块」的取舍：论文给出的核心论据是 AF2 时代「删结构模块复杂度影响不大」的内部观察，以及扩散多尺度去噪可免掉扭角参数化与违规损失。但正文并未在同一数据、同一训练协议下给出「pairformer + 扩散」与「evoformer + 结构模块」的直接消融；同时换掉了主干（evoformer → pairformer）、生成方式（回归 → 扩散）和训练数据（加入 AF-Multimer v.2.3 交叉蒸馏）。因此相对 AF-Multimer v.2.3 的提升是架构、训练协议与数据三者的混合效应，正文没有把这几个因子拆开。这是本论文（主文本层面）最明显的证据缺口。
2. 评测口径问题：抗体组按 1,000 种子排序而其他类别按 5 种子，Fig. 1c 的横向柱状比较口径并不完全一致（论文在方法与图注中已如实注明，但读者比较「柱高」时容易忽略）。类似地，PoseBusters 用 2019 截止模型、近期 PDB 集用 2021 截止模型，蛋白-蛋白比较限制 <2,560 token，核酸比较限制 <1,000 残基——每类基准的「干净度」不同，解读时需要分别对待。
3. 关于无序与「幻觉」的定义：交叉蒸馏让 AF3 模仿 AF-Multimer 的无序区表现（拉长环），等价于把「无序的样子」定义为 AF2 系输出的样子。这能改善观感与 CAID 2 类基准，但意味着 AF3 对无序的「判断」是学来的风格而非独立学习的物理量；其 pLDDT 置信标注是否与真实柔性一致，主文本没有独立验证。
4. 置信度头的设计值得注意：扩散单步训练使 AF2 式「回归误差」方案失效，mini-rollout 是工程上的关键补丁，但 rollout 用大步长、且训练期只对生成结构做有限评估，训练/推理分布的不一致可能仍是隐患——论文未讨论这点。
5. RNA 是明显短板（未及人类辅助的 AIchemy_RNA2），且构象覆盖（cereblon 例）显示模型学到的是「多数构象」而非「条件构象」。对课程教学而言，这是理解「生成模型 ≠ 物理系综采样」的最佳例证之一。
6. 未读到：Extended Data 的实际图表内容与数值（本提取仅含主文本与方法；Extended Data Table 1 与 Fig. 1–9 的图像均未获取），因此上文的 Extended Data 解读只能停留在正文引述层面。

## 可复现要点

- 模型代码/权重下载信息在正文提取文本中未给出（指向 10.1038/s41586-024-07487-w 的数据与代码可用性声明；本次未获取）。正文明确给出：完整算法伪代码在 Supplementary Algorithms 1–31；网络图在 Figs. 1d、2a–c 与 Supplementary Fig. 2；输入特征在 Supplementary Table 5；训练超参数在 Supplementary Tables 3、4、7；Supplementary Information 分 9 部分（1 记号、2 数据管线、3 模型架构、4 辅助头、5 训练与推理、6 评测、7 与 AlphaFold2 / AlphaFold-Multimer 的差异、8 补充结果、9 附录含 CCD 代码与 PDB ID 表）。AF3 在 PoseBusters 上的预测及 PoseBusters 检查输出随文提供。
- 训练：数据截止 2021 年 9 月 30 日（PoseBusters 模型 2019 年 9 月 30 日）；mini-batch 256；初始训练 12,288 扩散样本、微调 8,192；裁剪尺寸 384 → 640 → 768 token；早停用加权指标组合；训练集采样概率可调。
- 推理：默认 5 种子 × 5 扩散样本 = 25 样本取 top-1；抗体用 1,000 种子；排序公式见 Supplementary Methods 5.9.1/5.9.3（全局：pTM+ipTM+冲突/无序项；链/界面/修饰残基各有专项排序）。
- 评测复刻：近期 PDB 集 8,856 复合物（2022-05-01 至 2023-01-12，<5,120 token）；低同源过滤 40% 序列一致性、肽链 <16 残基剔除；蛋白-蛋白对比子集 <20 链且 <2,560 token；抗体集 71 复合物 / 166 界面 / 65 簇；配体排除列表与结晶助剂表（Supplementary Tables 8–11）；口袋对齐 r.m.s.d. 算法（10 Å 口袋、主链定义、蛋白只留骨架原子）；核酸 30 Å 包含半径；DockQ↔iLDDT 阈值换算（Extended Data Fig. 9）；RDKit 局部对称穷举（前 1,000）；LDDT 最大化指派。
- 分析工具版本（原文罗列）：Python 3.11.7、NumPy 1.26.3、SciPy 1.9.3、seaborn 0.12.2、Matplotlib 3.6.1、pandas 2.0.3、statsmodels 0.12.2、RDKit 4.3.0、TM-align v.20190822、PyMOL v.2.55.5（结构可视化）、Colab；PoseBusters Python 包 v.0.2.7。

## 术语

- AF2 / AF3：AlphaFold 2 / AlphaFold 3。
- MSA（multiple sequence alignment，多序列比对）；Neff（number of effective sequences，有效序列数，80% 序列一致性阈值加权）。
- evoformer（AF2 主干模块，处理 MSA 表示与对表示）；pairformer（AF3 主干模块，只处理对表示与单表示，48 块，对通道 128、单通道 384）。
- 结构模块（structure module，AF2 中由对表示生成原子坐标的模块，用残基框架与侧链扭角）；扩散模块（diffusion module，AF3 替代物，直接对原始原子坐标去噪）。
- 扩散模型（diffusion model）：训练时加噪坐标 → 预测真实坐标；推理时随机噪声反复去噪；小噪声学局部立体化学、大噪声学整体结构。
- 交叉蒸馏（cross-distillation）：用 AlphaFold-Multimer v.2.3 预测结构富集训练数据。
- mini-rollout：训练中以较大步长生成完整结构，供置信度头训练。
- pLDDT（predicted LDDT，改进的局部距离差异检验置信度）；PAE（predicted aligned error，预测对齐误差矩阵）；PDE（predicted distance error，预测距离误差矩阵）；ipTM（interface predicted TM-score，链对界面预测 TM 分数）；pTM（predicted TM-score）。
- LDDT（local distance difference test）；iLDDT（界面 LDDT）；DockQ（蛋白-蛋白对接质量分数，0.23 为可接受阈值）；GDT（global distance test）；TM-score / TM-align。
- 口袋对齐 r.m.s.d.（pocket-aligned r.m.s.d.）：先按口袋（配体 10 Å 内骨架/主链原子）对齐再算配体重原子 r.m.s.d.。
- LDDT_to_polymer：实体原子到包含半径内 Cα/C1′ 聚合物原子的距离差异指标。
- PoseBusters（蛋白-配体预测质量基准；v.1 为 2023 年 8 月版，v.2 移除晶体接触）；CAID 2（无序区预测基准）；CASP15（第十五届结构预测关键评估；RNA 类别）。
- ranking_model_fit（RCSB 验证报告的模型质量指标，>0.5 为中位数以上质量）；CCD（Chemical Component Dictionary，化学组分字典）；SMILES（simplified molecular-input line-entry system，简化分子线性输入规范）。
- 等变（equivariance）/不变性（invariance）：模型输出随输入旋转平移变换的性质，AF3 明示不使用。
- 溶剂可及表面积（solvent accessible surface area）：AF3 排序中鼓励无序表现的一项。
- 同源多聚体（homomer）；主聚合物链（primary polymer chain）；包含半径（inclusion radius，蛋白 15 Å、核酸 30 Å）。

---

**导航**

- 模块笔记：[[notes/class-notes/结构生物学/AI结构预测/精读/_index|精读总索引]]

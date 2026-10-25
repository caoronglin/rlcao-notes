---
title: Boitreaud J. 2024｜Chai-1: Decoding the molecular interactions of life
date: 2026-10-08
tags: [课程, 结构生物学, 文献精读, 复合物与多模态]
status: primary
类型: 精读笔记
来源: Boitreaud J. et al. *bioRxiv（预印本，未经同行评审）* 2024，DOI [10.1101/2024.10.10.615955](https://doi.org/10.1101/2024.10.10.615955)
模块: 复合物与多模态：从蛋白到生物分子相互作用
主键: pre:10.1101/2024.10.10.615955
---

# Chai-1: Decoding the molecular interactions of life

**Boitreaud J. et al.** · *bioRxiv（预印本，未经同行评审）* · 2024 · DOI [10.1101/2024.10.10.615955](https://doi.org/10.1101/2024.10.10.615955)

> 所属模块：[[notes/class-notes/结构生物学/AI结构预测/03-复合物与多模态-从蛋白到生物分子相互作用|复合物与多模态：从蛋白到生物分子相互作用]]
## 一句话结论
本文（Chai Discovery 团队：Boitreaud、Dent、McPartlon、Meier、Reis、Rogozhonikov、Wu；bioRxiv，2024 年 10 月 11 日发布，DOI: 10.1101/2024.10.10.615955）提出 Chai-1，一个面向分子结构预测的多模态基础模型（multi-modal foundation model）：架构大体沿用 AlphaFold 3（AF3），但用单个模型（训练数据截止 2021-01-12）覆盖全部评测任务；在 PoseBusters 蛋白-配体预测上与 AF3 持平（77% vs 76%），在低同源蛋白多聚体与抗体界面预测上显著超过 AlphaFold-Multimer 2.3（AF2.3），并支持把湿实验约束（表位作图、交联质谱等）作为提示（prompt）输入，以进一步提升困难复合物的预测精度；模型权重与推理代码以 Python 包开源但仅限非商业使用，网页界面免费开放且可用于商业药物研发。

## 研究问题
1. 能否用单一模型（而非像 AF3 那样按评测分别训练模型）在多类分子结构预测任务上达到最先进（state-of-the-art，SOTA）水平？
2. 能否把来自湿实验的限制条件（如表位作图、交联质谱得到的约束）作为提示输入，提升困难结合复合物的预测精度？
3. 无 MSA 的单序列模式（single-sequence mode）能保留多少性能？能否与使用 MSA 的 AF-Multimer 2.3 竞争甚至胜出？
4. 模型输出的置信度（ipTM）是否与实际预测质量良好校准？

## 方法与数据
- **架构**：主要遵循 Abramson et al.（AF3）的神经架构，重度依赖 pair-bias self-attention（对偏置自注意力）；关键区别是训练单一模型、训练数据日期截止 2021-01-12，而非为不同评测分别训练模型。
- **蛋白质语言模型嵌入（LM embeddings）**：新增一条由 3B 参数蛋白质语言模型（引 Lin et al. 2023，ESM 系列）产生的残基级嵌入作为输入轨道；修饰残基替换为其"母体"标准氨基酸，无母体则用 "X"，非蛋白 token（DNA/RNA/配体）用 mask token。推理时可任意组合 MSA、模板与语言模型嵌入。
- **约束特征（constraint features）**，模拟实验约束、提供链间距离信息（模板只提供链内距离）：
  - 口袋约束（pocket）：残基 i、链 C、距离阈值 θP（训练时随机采样 θP ∈ (6, 20) Å）；
  - 接触约束（contact）：残基对 i、j 及阈值 θD ∈ (6, 30) Å；
  - 对接约束（docking）：token 间成对距离的 4 档 one-hot 分箱 [0–4, 4–8, 8–16, >16] Å。
  - 训练时每个特征以 10% 概率独立提供，施加链级/残基级 dropout；约束数量按几何分布（参数 p = 1/3）随机采样，防止模型过度依赖。
- **训练**：128 张 Nvidia A100 GPU，batch size 128，训练 30 天；数据为 PDB（截止 2021-01-12）+ AlphaFoldDB；除 AFDB 外不用 [11] 中其他蒸馏数据集；模板用同截止日期的 PDB70 生成；数据处理与聚类大体沿用 AF3。
- **MSA 生成**：优先用 OpenProteinSet 预生成 MSA（UniRef90、UniProt、MGnify、UniClust30+BFD）；否则用 jackhmmer v3.4（-N 1 -E 0.0001 --incE 0.0001 --F1 0.0005 --F2 0.00005 --F3 0.0000005），各库 --seq_limit：UniRef90 10000、UniProt 50000、Reduced BFD 5000、MGnify 5000。主分析推理额外用 -N 3（3 轮迭代）；网页界面仅提供 1 轮迭代 MSA。
- **推理**：4 次 recycling（循环精修）、5 个 trunk 样本 × 5 个 diffusion 样本 = 25 个预测结构，用置信度模型排序；单序列模式只给序列 + 蛋白质语言模型嵌入（无 MSA、无模板）；推理上限 2048 token；序列取自 Biological Assembly 1 的 FASTA/SMILES，并去除结晶助剂。
- **基线**：AF-Multimer 2.3 经 ColabFold 1.5.5 运行（MMseqs2 检索 UniRef30 2303 与 colabfold_envdb 202108，不用模板，3 recycles × 5 模型 × 5 种子共 25 个输出取 top-ranked，不做 relaxation）；RoseTTAFold2NA 经 Tamarind Bio 的 API；AF3 的 PoseBusters 数值取自其公开发布的预测，作者未自行运行 AF3。AF3 与 ESM3 因商业使用限制无法直接对比。
- **评测集**：PDB 2022-05-01 至 2023-01-12 时间切分（全部晚于训练截止 2021-01-12），排除 NMR、分辨率 ≥4.5 Å、>2048 token 的条目，按 40% 序列同源过滤单体与界面，并按 40% 序列同一性聚类（≤9 残基蛋白与全部核酸按 100% 聚类）。抗体集定义为两大聚类所在的链（7PKL 链 B、7T2P 链 C）。作者明确说明评测集沿用 AF3 流程但无法完全一致，因此其蛋白-蛋白/抗体/核酸数值与 AF3 论文数值不可直接比较。

## 关键图表解读
- **图 1（架构总览）**：展示 Chai-1 可选输入特征：语言模型嵌入、结构模板、遗传搜索（MSA），以及交联质谱接触、表位作图等湿实验约束。
- **图 2（多任务 SOTA 汇总）**：四个面板分别显示配体（n = 427，PoseBusters）、蛋白-蛋白界面（n = 929 聚类）、抗体-蛋白界面（n = 121 聚类）、蛋白单体（n = 271 聚类）的成功率；指标分别为口袋对齐配体 RMSD < 2 Å、DockQ > 0.23、Cα-LDDT；横条表示统计显著差异。
- **图 3（7Q2B 案例）**：Chai-1 排名第一的预测（配体 RMSD 1.73 Å）把配体放在比真实结构更深的口袋位置；真实结构口袋深处有一个二甲基硫醚（DMS）分子（结晶助剂）可能阻挡了配体；同工作中两个类似芳香配体（7Q2C、7Q2F）在无 DMS 时确实结合更深，提示 Chai-1 预测的替代构象可能真实可行——作者以此强调人工检查模型的重要性。
- **图 4（抗体-抗原约束实验）**：A 面板给出 Blind（无约束）、One Contact（15Å/25Å，随机采样一对距离 <15/25 Å 的抗体-抗原残基对作为接触特征）、One Epitope（8Å）/Four Epitope（8Å，采样 1/4 个与抗体残基 Cα 距离 <8 Å 的抗原残基作为口袋特征）五种设置下 acceptable/medium/high 三档 DockQ 成功率；B 面板为 7SYV 案例（加表位约束后 DockQ 从 0.10 升至 0.81）。
- **图 5（置信度校准）**：链对 ipTM 按分箱与 DockQ（蛋白-蛋白、蛋白-核酸界面）及口袋 RMSD（蛋白-配体）的关系，显示 ipTM 是跨分子类型的有力质量判别器。
- **图 6（lab 服务器示例）**：三个训练截止后发布的治疗相关复合物：寨卡病毒 NS2B-NS3 蛋白酶-小分子抑制剂（7VLH）、SARS-CoV-2 蛋白酶-非结构蛋白片段（7MB4）、PD-1 与单抗检查点抑制剂 cemiplimab 复合物（7WVM）。
- **图 S1**：PoseBusters 化学检查（Chai-1 结构化学上有效，但偶尔违反输入配体的手性——AF3 也有此问题；Chai-1 分子间 clash 率低于 AF3，排序无需 clash 惩罚）与配体 RMSD 累积分布（confidence-ranked vs random vs oracle）。
- **图 S2**：更严格 DockQ 阈值下 Chai-1 仍维持对 AF2.3 的领先。
- **图 S3**：蛋白-核酸复合物（界面 LDDT，n = 18 / n = 26）与 CASP15 RNA（C1'-LDDT，n = 9）上与 RoseTTAFold2NA 性能相当。

## 主要结果与关键数字
- **蛋白-配体（PoseBusters，成功 = 配体 RMSD < 2 Å，按 ipTM 排序并对违反手性者除以 100 惩罚）**：Chai-1 77%（表 1 精确值 77.05%）vs AF3 76%（76.34%，取自 AF3 公开发布预测），RF2AA 42%；提供 apo 结构做 docking 任务时 81%（81.20%）。排除了 PDB 中已废弃的 7D6O（427/428 个结构）。
- **蛋白多聚体（DockQ > 0.23 成功率，低同源集 n = 929 界面簇）**：Chai-1 0.751 vs AF2.3 0.677（双侧 Wilcoxon 检验 p = 6.24 × 10⁻¹⁰）；无模板 0.743（下降不显著）；单序列模式 0.698（与 AF2.3 差异无统计意义）。作者称 Chai-1 是首个无需 MSA 即可高精度折叠多聚体、且使用 MSA 时超越 AF2.3 的模型。
- **抗体-蛋白界面（n = 122 簇）**：Chai-1 0.529 vs AF2.3 0.380（p = 3.25 × 10⁻⁵）；单序列模式 0.479 仍超过带 MSA 的 AF2.3（p = 4.04 × 10⁻⁴）。作者推测可变区序列缺乏共进化信号是 MSA 收益小的原因。
- **抗体-抗原约束实验（图 4）**：单个 15 Å 接触约束使 DockQ acceptable 比例从基线 35% 升到 57%；4 个随机表位残基使各质量档成功率比基线翻倍以上；但 high quality 比例仍低（4–8%），说明高质量抗体-抗原预测仍是难题。
- **蛋白单体（Cα-LDDT，n = 271 簇 / 447 单体）**：Chai-1 0.915 vs AF2.3 0.903（p = 7.21 × 10⁻¹⁰）；单序列模式 0.852，弱于 AF2.3（p = 4.46 × 10⁻¹⁶）。
- **CASP15**：70 个靶排除无法在合理时间内完成推理的 T1169，余 69 靶平均 LDDT Chai-1 0.849 vs AF2.3 0.843；在 AF2.3 困难子集（AF2.3 LDDT < 0.75，n = 14）上 0.643 vs 0.552（p = 3.66 × 10⁻⁴）；ESM3 最大 98B 参数模型在全 70 靶上报告 0.801。
- **核酸**：全部以单序列模式（无 RNA MSA）运行，与 RoseTTAFold2NA 相当（蛋白-核酸界面 LDDT；9 个 CASP15 RNA 靶的 C1'-LDDT）；AF3 报告 8 个 CASP15 RNA 靶 LDDT 0.473。
- **lab 服务器一致性**：服务器（无模板、1 轮 jackhmmer、不查 UniClust30+BFD）与内部管线在 PoseBusters 抽查上 RMSD 差 < 1 Å（µ = 0.345 Å，σ = 0.150 Å）。

## 对照与消融
- **对照**：AF3（仅 PoseBusters，77% vs 76%）；AF2.3（多聚体、抗体、单体三项全对比）；RF2AA（42%）；ESMFold（引言称单序列模式优于 ESMFold）；ESM3（CASP15 0.801，间接数字对比）；RoseTTAFold2NA（核酸）。因商业限制未直接运行 AF3 与 ESM3。
- **消融**：模板 on/off（0.751 → 0.743，不显著）；MSA 有/无（即单序列模式，见上述各任务）；约束提示（Blind 35% → 单接触 57% → 4 表位翻倍；7SYV DockQ 0.10 → 0.81）；服务器管线与内部管线的工程差异抽查（<1 Å）。

## 作者自述的局限
1. 模型有时能正确预测复合物中各个链，但无法把它们摆到正确的相对取向（图 4 第一面板示例）。
2. 对修饰残基高度敏感：删除序列中天然存在的修饰残基、或把修饰氨基酸替换为标准氨基酸类似物，会导致预测结构大幅改变——作者推测是因为模型在含修饰结构上显式训练过，无修饰的相同序列会被当作完全不同的输入。
3. 高质量抗体-抗原预测仍困难（high quality 比例 4–8%）。
4. 核酸预测未使用核酸 MSA 或核酸语言模型嵌入，性能与 RoseTTAFold2NA 相当；未来引入可进一步提升。
5. 因商业使用限制，无法与 AF3、ESM3 直接对比。
6. 评测集与 AF3 不完全一致，蛋白-蛋白/抗体/核酸数值与 AF3 论文不可直接比较；服务器管线与论文管线存在细微差异。

## 我的评价
- 这是一篇未经同行评审的预印本，全文正文仅约 8 页。文中的全部性能数字与 SOTA 宣称均为**作者自述**：如"与 AF3 持平（77% vs 76%）"中的 76.34% 直接取自 AF3 公开发布的 PoseBusters 预测而非独立复现；摘要中"double-digit percentage points"（两位数百分点）的提升来自图 4 的约束实验（35% → 57%，即 +22 个百分点，作者自报）；"首个无需 MSA 高精度多聚体折叠模型"也是作者自己的定位，且其单序列模式在多聚体上（0.698 vs 0.677）的差异作者自己标注为"无统计意义"。
- 与 AF2.3 的对比是其最扎实的部分：AF2.3 由作者用 ColabFold 亲自运行，并报告了与文献（Hayes et al. 0.826/70 靶）大致吻合的复现值（0.842/70 靶），可信度相对较高。
- 由于无法运行 AF3，且评测集与 AF3 论文并不完全一致，"SOTA"的说法只能与 AF2.3 一代的方法比较，说服力打折扣——AF3 在商业可用性上的限制恰恰是 Chai-1 的市场切入点。
- 许可条款必须区分三层，不可混为一谈：① 模型权重与推理代码（github.com/chaidiscovery/chai-lab）**仅限非商业使用**；② 网页界面（lab.chaidiscovery.com）免费开放，**包括可用于商业药物研发**；③ 预印本文本本身以 CC-BY-NC 4.0 发布。换言之"免费商用"只适用于网页界面，不适用于开源权重。
- 值得肯定：开源权重 + 发布 PoseBusters 全量预测结构与化学检查结果，方便社区复现审查；"实验约束作为提示"的方向对结构生物学有实际价值（交联质谱、表位作图数据可直接注入模型）。
- 潜在弱点：抗体评测集定义依赖两个最大聚类（7PKL 链 B、7T2P 链 C），样本量小（122 簇）；置信度模型、训练细节（损失函数、蒸馏策略等）披露有限；7Q2B 案例的解释（DMS 阻挡）是作者的事后解释，未做实验验证。

## 可复现要点
- 代码与权重（非商业）：https://github.com/chaidiscovery/chai-lab；网页界面（可商用）：https://lab.chaidiscovery.com；PoseBusters 预测下载：https://chaiassets.com/chai-1/paper/assets/posebusters_predictions.zip。
- 推理设置：4 recycles，5 trunk × 5 diffusion 样本，置信度模型排序，≤2048 token；配体手性违反时 ipTM 除以 100 惩罚；单序列模式仅输入序列 + 语言模型嵌入。
- MSA 命令：jackhmmer v3.4，-N 1（主分析 -N 3）-E 0.0001 --incE 0.0001 --F1 0.0005 --F2 0.00005 --F3 0.0000005，各库 --seq_limit 见上文；数据库版本与截止日期沿用 Jumper et al. [6]。
- 基线复现：ColabFold 1.5.5 + AF2.3 权重；MMseqs2 检索 UniRef30（version 2303）+ colabfold_envdb（version 202108）；无模板；3 recycles，5 模型 × 5 种子，无 relaxation。
- 指标口径：口袋对齐配体 RMSD（先按真结构界面原子——真结构中距任一配体原子 10 Å 内的 Cα——对齐，再算配体 RMSD）；DockQ（链置换 < 8! 时穷举，否则对齐贪心分配，两者都选使全局平均 DockQ 最优的映射）；LDDT（蛋白 Cα、半径 15 Å；核酸 C1'、半径 30 Å）；界面用 iLDDT。
- 评测集构建：PDB 2022-05-01 至 2023-01-12，非 NMR、分辨率 <4.5 Å、≤2048 token、40% 同源过滤、40% 聚类（≤9 残基与核酸 100%），用 Biological Assembly 1。

## 术语
- foundation model 基础模型；multi-modal 多模态；MSA（multiple sequence alignment）多序列比对；pair-bias self-attention 对偏置自注意力；template 结构模板；protein language model（PLM）蛋白质语言模型；recycling 循环精修；epitope mapping 表位作图；cross-linking mass spectrometry（XL-MS）交联质谱；hydrogen-deuterium exchange MS（HDX-MS）氢氘交换质谱；SMILES 简化分子线性输入规范；ligand RMSD 配体均方根偏差；pocket-aligned ligand RMSD 口袋对齐配体 RMSD；DockQ 蛋白对接质量分数；ipTM（interface predicted TM-score）界面预测 TM 分数；LDDT（local distance difference test）局部距离差异检验；iLDDT 界面 LDDT；CASP15 第 15 届蛋白质结构预测关键评估；apo/holo 脱辅基/全息构象；PoseBusters 配体构象合理性基准；SAbDab 抗体结构数据库；jackhmmer 迭代 HMM 同源搜索工具；UniRef90/UniProt/MGnify/UniClust30+BFD 序列数据库；DMS（dimethyl sulfide）二甲基硫醚（结晶助剂）；ColabFold 社区 AlphaFold 包装工具；Biological Assembly 1 生物学组装体 1。

---

**导航**

- 模块笔记：[[notes/class-notes/结构生物学/AI结构预测/精读/_index|精读总索引]]
- 上一篇：[[notes/class-notes/结构生物学/AI结构预测/精读/06 Passaro S. 2025]]

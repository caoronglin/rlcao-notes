---
title: Kathryn Tunyasuvunakool 2021｜Highly accurate protein structure prediction for the human proteome.
date: 2026-10-08
tags: [课程, 结构生物学, 文献精读, 范式起点]
status: primary
类型: 精读笔记
来源: Kathryn Tunyasuvunakool et al. *Nature* 2021，DOI [10.1038/s41586-021-03828-1](https://doi.org/10.1038/s41586-021-03828-1)
模块: 范式起点：从衍射反演到可微分建模
主键: 34293799
---

# Highly accurate protein structure prediction for the human proteome.

**Kathryn Tunyasuvunakool et al.** · *Nature* · 2021 · DOI [10.1038/s41586-021-03828-1](https://doi.org/10.1038/s41586-021-03828-1)

> 所属模块：[[notes/class-notes/结构生物学/AI结构预测/01-范式起点-从衍射反演到可微分建模|范式起点：从衍射反演到可微分建模]]
# Highly accurate protein structure prediction for the human proteome（人类蛋白质组的高精度蛋白质结构预测）

- 第一作者：Kathryn Tunyasuvunakool；通讯团队：DeepMind（John Jumper、Demis Hassabis 等）与 EMBL-EBI（Alex Bateman 等）
- 期刊/年份：Nature, 2021, 596: 590–596
- DOI: 10.1038/s41586-021-03828-1
- 摘要要点：人类蛋白序列总残基中仅 17% 有实验结构覆盖；本研究用 AlphaFold2 规模化覆盖 98.5% 的人类蛋白，58% 残基获得置信预测（其中 36% 极高置信），并提出基于 AlphaFold 模型的多个解读指标。

## 一句话结论
DeepMind 团队将 AlphaFold2 以接近全蛋白质组的规模应用于人类参考蛋白质组（覆盖 98.5% 的人类蛋白），使 58% 的残基获得置信预测（pLDDT > 70），其中约 36% 达到极高置信（pLDDT > 90），约为实验结构所覆盖残基数的两倍，并配套提出 pLDDT、pTM、experimentally resolved head 等指标用于解读大规模预测。

## 研究问题
- 实验结构解析存在多重瓶颈（蛋白制备、样品条件、数据质量、膜蛋白/无序区/构象变化等），尽管 PDB 已沉积超过 5 万个人类蛋白结构，也仅有 35% 的人类蛋白有 PDB 条目，且很多条目只覆盖序列片段。
- 能否用当时最新方法 AlphaFold2（CASP14 参赛版本）以接近全蛋白质组的规模快速补齐结构覆盖？
- 大规模预测如何给出经过校准的、逐残基的置信度？如何解读低置信区域——是内在无序、只在复合物中折叠，还是模型预测失败？

## 方法与数据
- 预测对象：UniProt 人类参考蛋白质组（每基因一条代表序列，release 2021_02），长度 16–2,700 个氨基酸，剔除含 B、J、O、U、Z、X 残基代码的序列；2,700 上限并非方法极限，仅为控制运行时间。
- 产出：20,614 条 FASTA 中 20,296 条成功产出至少 4 个 relaxed 全长模型，覆盖 98.5% 的蛋白；共 10,537,122 个残基（占全部残基的 92.5%）；超过 2,700 残基的序列占被剔除序列的大多数。
- 推理流程五步（与姊妹论文一致）：MSA 构建、模板搜索、五个模型推理、按 mean pLDDT 排序、约束松弛（constrained relaxation）。蛋白质组级改动的两处：宏基因组数据库 BFD（Big Fantastic Database）替换为 Reduced BFD（每条 BFD a3m 比对取第一条非一致序列）；ensembling 量减少为八分之一。
- 验证集「recent PDB dataset」：PDB 快照（2021-02-15 下载），仅取 2018-04-30 之后发布的链（训练集日期上限），经序列过滤与 PDB 40% 序列聚类去冗余，得 12,494 条链。
- 算力：V100 GPU 推理，总计 930 GPU days（每蛋白生成 5 个模型；若每蛋白只推理一次约需 190 GPU days）；1,401–2,000 残基的序列用 2 GPU、2,001–2,700 用 4 GPU；长度小于 1,400 残基的蛋白生成 5 个模型约 250 GPU days。CPU 侧（MSA 搜索、模板搜索、松弛）按 240 个分层抽样蛋白实测拟合后估计，从头重跑约 510 core days。
- 基准对照：CAMEO 数据（2020-03-21 至 2021-03-13，共 428 个目标，按模板同一性 30–90、bin 宽 10 分组），与 BestSingleStructuralTemplate 基线比 lDDT-Cα。
- 无序评估：CAID 的 Disprot-PDB 数据集（n = 178,124 残基），无序分数取 1 − 0.01×pLDDT 与 1 − 实验可解析概率两种。
- 案例研究操作：DGAT2 抑制剂 PF-06424439 对接（P2Rank 找口袋、AutoDockTools 转 PDBQT、AutoDock Vina：exhaustiveness 32、seed 0、25×25×25 Å³ 搜索盒，配体 CAS 1469284-79-4；负例用 DGAT1 抑制剂 CAS 942999-61-3）；Wolframin 用 TM-align 与全部 PDB 链（2021-02-15 快照）比对。

## 关键图表解读
（PMC 提取版保留了图注文字，图像均未获取。文件头标注全文共 11 图 4 表；正文可见 Fig. 1–4 的图注，Extended Data Fig. 1–7 与 Extended Data Table 1、2 仅在正文被引用。）

- Fig. 1 模型置信度与新增覆盖（正文提及，图像未获取）：a. 逐残基 pLDDT 与 lDDT-Cα 的相关性，基于 held-out 近期 PDB 链（分辨率 <3.5 Å，n = 10,215 链、2,756,569 残基），全数据 Pearson r = 0.73，最小二乘拟合 y = (0.967±0.001)x + (1.9±0.1)；b. 一个 CASP14 目标（PDB 6YJ1）的预测与实验结构对照，按置信度带着色；c. 全部预测残基（n = 10,537,122）的置信度分布，浅色标出有模板（按指定同一性）覆盖的残基；d. 在 >50% 同一性模板之外新增的、按 GO 大项分组的残基级覆盖度。
- Fig. 2 全长链预测（正文提及，图像未获取）：a. AlphaFold 在 held-out 模板过滤长链集（n = 151 链，>800 已解析残基、最优 50% 覆盖模板 <30% 同一性）上的 TM-score 分布，70% 的预测 TM-score > 0.7；b. 同一集合上全长 TM-score 与 pTM 的相关性（Pearson r = 0.84），标注最乐观离群点 PDB 6OFS chain A；c. 人类蛋白质组中预期富集结构新颖多结构域蛋白的子集（n = 1,165 链）的 pTM 分布；d. pTM > 0.8 且按置信残基数排序的四个头部预测，隐藏 pLDDT < 50 区域及裁剪后孤立小片段。
- Fig. 3 代表性预测（正文提及，图像未获取）：a. G6Pase-α、G6Pase-β 与氯过氧化物酶（PDB 1IDQ）活性位点对比，右侧红色为保守且溶剂暴露的谷氨酸；b. DGAT2 结合口袋（P2Rank 预测，红/绿球表示 ligandability 分数 1/0），中间为 DGAT1 的机制示意图，右侧为对接抑制剂与 His163、Thr194 的极性相互作用；c. Wolframin 预测结构：低 pLDDT 区（左）、OB-fold 区（绿/黄）与典型 OB-fold（灰）对比，最相似 PDB 链（品红）缺少预测中的保守半胱氨酸富集区（黄），该区形成特征性 β1 链与延伸的 L12 环，图注称预测含三个二硫键（正文文字称两个预测二硫键）。
- Fig. 4 低置信区域（正文提及，图像未获取）：a. PDB 已解析区（n = 3,440,359 残基）、未解析区（n = 589,079 残基）与人类蛋白质组（n = 10,537,122 残基）的 pLDDT 分布对比；b. pLDDT 与 experimentally resolved head 在 CAID Disprot-PDB 基准上的无序预测性能；c. 一个低置信预测与 PDB 7KPX chain C 的比对：球状域预测良好，伸展界面区低置信且除部分二级结构外基本错误；d. 高异型接触比例与 AlphaFold 精度下降的关系（n = 3,007 链，限 >40% 残基的模板同一性低于 30% 的蛋白；接触定义为 Cβ/Cα 距离 <8 Å 且序列上相隔至少 3 个残基）。

## 主要结果与关键数字
- 覆盖度：98.5% 人类蛋白获得全长预测；58.0% 残基为置信预测（pLDDT > 70）；正文口径为 35.7% 总残基落在最高精度带（占产出预测残基的 38.6%），约为实验结构覆盖残基数的两倍；摘要口径为 36% 极高置信。
- 每蛋白层面：43.8% 的蛋白在至少四分之三序列上有置信预测；1,290 个蛋白含有 >200 残基的 pLDDT ≥ 70 且无好模板（序列同一性 <30%）的区域。
- 置信度校准：pLDDT > 90 时 χ1 旋转异构体 80% 正确（近期 PDB 测试集）；pLDDT > 70 对应大体正确的骨架预测。
- 覆盖增量分布广泛：覆盖酶、膜蛋白等药学相关 GO 类别，膜蛋白这类 PDB 中代表性不足的类别也能获得置信预测。
- CAMEO：AlphaFold 在很宽的模板同一性范围内均较 BestSingleStructuralTemplate 基线有实质性精度提升。
- 全长多结构域：70% 预测 TM-score > 0.7；pTM 与实际 TM-score 相关 r = 0.84；人蛋白组筛选子集（n = 1,165）中 187 个 pTM > 0.8、343 个 pTM > 0.7，提示数据集中约有数百个值得关注的多结构域预测。
- 案例研究：G6Pase-α（P35575）全链中位 pLDDT 95.5，九螺旋拓扑，活性位点带正电残基（中位 pLDDT 96.6）与真菌钒氯过氧化物酶（PDB 1IDQ）比对 r.m.s.d. 0.56 Å（51 个对齐原子中 49 个），预测保守 Glu110（G6Pase-β 中为 Glu105）为最溶剂暴露残基、可能有门控功能；DGAT2（Q96PD7）中位 pLDDT 95.9，鉴定口袋（中位 pLDDT 93.7）并成功对接抑制剂，识别 Glu243/His163 类比 DGAT1 的 His415/Glu416（另提出 Ser244 的酰基-酶中间体替代机制，且 His163 突变实验效应更严重、Glu243/His163 跨物种保守）；Wolframin（O76024）中位 pLDDT 81.7，半胱氨酸富集区中位 pLDDT 86.0，最相似 PDB 链 3F1Z 的 TM-score 0.472 但缺少这些半胱氨酸。
- 无序解读：此前研究估计人类蛋白质组无序残基占 37%–50%；pLDDT 作为无序预测器 AUC 0.897（与当时最优 SPOT-Disorder2 相当），experimentally resolved head AUC 0.921 更优；低置信既可能对应内在无序，也可能对应「仅在复合物中折叠」的区域（例：7KPX chain C）；异型接触比例越高，预测精度越低。当前数据集中 pLDDT < 50 的长区域呈易辨认的带状，应解读为无序预测而非结构。

## 对照与消融
本文没有传统的模块消融，但包含基线对照与指标互证：
- CAMEO 基线对照（Extended Data Fig. 4）：AlphaFold vs BestSingleStructuralTemplate，按模板同一性分 bin 比较 lDDT-Cα 分布（箱线图）。
- 无序预测器内部对照：通用置信度 pLDDT（AUC 0.897）vs 专门训练的 experimentally resolved head（AUC 0.921），说明后者更适合无序判断。
- 置信度自校准：pLDDT 与实测 lDDT-Cα 相关 r = 0.73；pTM 与实测全长 TM-score 相关 r = 0.84。
- 覆盖度对照：实验覆盖 17% 残基 / 35% 蛋白有 PDB 条目 vs 预测 58%（置信）/ 35.7%（最高精度带）残基覆盖。
- 负对照：DGAT2 抑制剂对接结果未能在负例（DGAT1 抑制剂）中重现（Extended Data Fig. 5、Supplementary Methods 2）。
- 消融式流程改动：Reduced BFD 替代 BFD、ensembling 减少 8 倍——作者说明这是为规模化所做的妥协，但未报告该改动对精度的影响量化。

## 作者自述的局限
- 置信预测不等于实验验证：案例研究只是生物学假说，最终需实验确认。
- 多结构域蛋白的域间精度预计低于域内精度；pTM 与 TM-score 相关图中的部分离群点是真实失败，另一些则可能是合理的替代构象（如 6OFS chain A）。
- 低置信区域的解释不完全确定：可能同时涵盖「在分离状态下内在无序」与「仅在复合物中折叠」两类情形；高异型接触比例的界面区域精度明显偏低。
- 仍有一部分蛋白无置信预测：其中一些是「真实失败」（存在固定结构但当前 AlphaFold 预测不出），另一些在分离状态下本就无结构，超出单链结构预测的任务范围；需要能预测复合物结构或预测细胞环境中状态分布的新方法。
- 训练集本身对膜蛋白等类别代表性不足（论文称 AlphaFold 仍能对这类蛋白给出置信预测，但这也是其泛化能力的边界提示）。

## 我的评价
- 本文是 AlphaFold2 方法学论文（Nature 2021;596:590–596）的姊妹篇，价值在于把「方法强」转化为「规模化数据产品 + 解读规则」：pLDDT 分层（>90 / >70）、pTM 加权、experimentally resolved head 这套指标体系至今仍是结构预测领域的通用实践。
- 口径需对齐：摘要称 36% 残基「极高置信」，正文 Fig. 1c 用 35.7%（占总残基）/ 38.6%（占预测残基），同一事实三种表述，阅读和引用时要注意分母不同。
- 论文对「低 pLDDT = 无序」给出双证据（CAID 基准 AUC + PDB 已解析/未解析残基分布对比）与反例（7KPX chain C 界面只在复合物中折叠），并明确区分「模型失败」与「任务范围之外」，这种对失败的界定方式比单纯报覆盖率更有方法论价值。
- 可追问之处：pLDDT 与 pTM 是「模型置信度」而非「结构质量保证」，其校准用 held-out 近期 PDB 集验证，但对全新折叠家族的外推是否仍成立，论文未直接检验。
- 数据可及性（alphafold.ebi.ac.uk 免费开放）是影响力的另一支柱；但方法学细节大量指向姊妹论文的补充信息，仅凭本篇只能复现推理级操作，无法复现模型训练。

## 可复现要点
- 输入数据：UniProt 人类参考蛋白质组 release 2021_02，序列长度 16–2,700 aa，剔除 B/J/O/U/Z/X。
- 推理配置：每序列 5 个模型，ensembling 减至 1/8，mean pLDDT 排序，约束松弛；MSA 用 Reduced BFD（HMMER3 Jackhmmer）。
- 测试集构造：PDB 2021-02-15 快照 + 2018-04-30 发布截止 + PDB 40% 聚类去冗余 → 12,494 链（recent PDB dataset）。
- 评估指标：lDDT-Cα（CASP14/CAMEO）、TM-score 与 pTM（>800 残基长链集）、AUC（CAID Disprot-PDB，模板截止 2018-04-30，>2,000 残基序列切成两段评估）。
- 对接复现：P2Rank 找口袋 + AutoDock Vina（exhaustiveness 32、seed 0、25×25×25 Å³ 搜索盒），DGAT2 抑制剂 CAS 1469284-79-4。
- 数据获取：全部预测免费开放于 https://alphafold.ebi.ac.uk/（EMBL-EBI 托管）。

## 术语
- pLDDT（predicted local distance difference test，预测局部距离差异检验）：0–100 的逐残基置信度，估计预测与实验结构间的 lDDT-Cα 一致程度。
- lDDT-Cα（local distance difference test Cα）：基于局部原子间距离差异的结构相似性度量。
- pTM（predicted TM-score）：按残基「实验可解析概率」加权的预测 TM-score，用于反映结构域打包的置信度。
- TM-score（template modelling score）：反映全局（而非逐域）精度的结构相似性评分。
- experimentally resolved head：姊妹论文中专门预测残基是否会在实验结构中解析的模型输出头。
- MSA（multiple sequence alignment，多序列比对）。
- CASP14（Critical Assessment of protein Structure Prediction，第 14 届蛋白结构预测盲测）。
- CAMEO（Continuous Automated Model Evaluation，连续自动模型评估）；BestSingleStructuralTemplate 为其模板基线。
- CAID（Critical Assessment of protein Intrinsic Disorder prediction，内在无序预测评估）；DisProt 为无序蛋白数据库。
- BFD（Big Fantastic Database，宏基因组序列库）；Reduced BFD 为其压缩版本。
- GO（Gene Ontology，基因本体）。
- OB-fold（oligonucleotide/oligosaccharide-binding fold，寡核苷酸/寡糖结合折叠）。
- heterotypic contacts（异型接触）：跨链（不同蛋白实体）的残基间接触。
- χ1 rotamer：侧链第一个可旋转二面角（χ1）的旋转异构体。
- G6Pase-α/β（glucose-6-phosphatase，葡糖-6-磷酸酶）；DGAT1/2（diacylglycerol O-acyltransferase，二酰甘油 O-酰基转移酶）；Wolframin（WFS1 基因产物，与 Wolfram 综合征 1 相关）。
- P2Rank：配体结合口袋预测工具；AutoDock Vina：分子对接软件。
- Reduced BFD / ensembling / constrained relaxation（约束松弛）：见方法与数据。

---

**导航**

- 模块笔记：[[notes/class-notes/结构生物学/AI结构预测/精读/_index|精读总索引]]
- 上一篇：[[notes/class-notes/结构生物学/AI结构预测/精读/03 Minkyung Baek 2021]]

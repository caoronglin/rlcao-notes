---
title: Arne Elofsson 2026｜AlphaFold3 at CASP16.
date: 2026-10-08
tags: [课程, 结构生物学, 文献精读, 复合物与多模态]
status: primary
类型: 精读笔记
来源: Arne Elofsson et al. *Proteins* 2026，DOI [10.1002/prot.70044](https://doi.org/10.1002/prot.70044)
模块: 复合物与多模态：从蛋白到生物分子相互作用
主键: 40851426
---

# AlphaFold3 at CASP16.

**Arne Elofsson et al.** · *Proteins* · 2026 · DOI [10.1002/prot.70044](https://doi.org/10.1002/prot.70044)

> 所属模块：[[notes/class-notes/结构生物学/AI结构预测/03-复合物与多模态-从蛋白到生物分子相互作用|复合物与多模态：从蛋白到生物分子相互作用]]
# AlphaFold3 at CASP16.

- 作者：Arne Elofsson（单一作者；CASP16 中 Elofsson 组 #241 的提交人）
- 期刊：Proteins，第 94 卷，154–166 页，2026 年
- DOI：10.1002/prot.70044
- 类型：第三方盲测评测（AlphaFold3 在 CASP16 的首次官方盲测）

## 一句话结论

在 CASP16 上，AF3-server 的自动提交在所有类别中都达到与最先进方法相当的水平；它比 AlphaFold2 基线（ColabFold）略好、在简单靶标上优势明显、在困难靶标上无优势，且当对 AlphaFold2 施加大规模采样（MassiveFold）后，与 AF3 的差距即消失；此外 AF3-server 不擅长从五个提交模型中挑出最好的那个，也不能可靠预测多聚体化学计量比（stoichiometry）。

## 研究问题

作者（唯一作者，以组名 Elofsson #241 提交人工预测、以 AF3-server #304 提交服务器预测）系统评估 AlphaFold3（以下简称 AF3）在 CASP16 盲测中的表现，具体问题为：

1. 人工干预（多随机种子生成 + 内部打分筛选 + 人工检查）是否比 AF3-server 默认自动流程更好？
2. AF3 与上一代 AlphaFold2（AF2）相比，在蛋白单域与复合物上到底好多少？采样量（sampling budget）是否解释这一差距？
3. 与官方排名靠前的方法（YangServer、KiharaLab）相比，AF3-server 的首选模型（top-ranked）与五个提交模型中的最优（best-of-five）分别如何？
4. AF3-server 对 RNA / 核酸复合物的预测质量如何？
5. AF3-server 自身的置信度评分（pTM / ipTM）与真实质量的相关性如何？
6. AF3-server 能否预测复合物的化学计量比？
7. 官方 Z-score 排名（困难/中等/容易靶标分层）与上述独立指标分析的结论是否一致？

背景铺垫（Introduction）：接触预测（DCA 等的重新发现）→ 机器学习后处理 → CASP13 上 AlphaFold(v1) 胜出 → CASP14 上 AlphaFold2.0 大幅提升 → AF2 用于复合物（Fold-and-Dock）在 CASP15 得到确认，抗体/纳米抗体–抗原仍是难点 → 2024 年出现预测蛋白–核苷酸/脂质/离子/小分子相互作用的工具，CASP16 是首次完全盲测的机会。提交时 AF3 只有网页服务器：只能用少数标准化蛋白配体，且大于 5000 "tokens" 的复合物无法预测。

## 方法与数据

- 全部预测均通过 AlphaFold3 网页服务器生成（当时无法本地安装）。服务器预测（AF3-server）对每个靶标提交 5 个模型；Elofsson 组额外用不同随机种子多生成模型，用 AF3 内部打分 + 人工检查挑选提交。后文显示人工干预无显著增益，故不作重点讨论。
- 大靶标（如 H1227、H1257，超过服务器上限 5000 残基/核苷酸）：采用 MolPC 的策略——切出重叠片段、叠加共享部分拼接成完整模型；AF3-server 只切一刀并提交前五模型，Elofsson 尝试多种切法；均不做精修。
- 多链 RNA：大量模型存在严重链间重叠，可用 AF3 输出中 "has_clash" 标志与负的 "ranking_score" 检出；生成的 309/420（72%）多聚 RNA 模型有此类冲突而被丢弃；对这类靶标会重复提交直到凑齐 5 个无冲突模型。
- 配体靶标：服务器无该配体时，先按碳原子数找最相似的可用配体跑服务器，再用 novoprolabs.com 的 smiles2pdb 工具生成结构，最后将 CASP 配体叠加（superpose）到 AF3 模型上生成新文件。但配体以 PDB 格式提交且未报错，因此未被预测中心正式评估（事后补交正确格式，推测已太迟）。
- Ensemble 靶标：R1203、T1214、R0283 用标准流程；T1294、T1200/T1300、M1239、T1249、M1228、T2249、R1253 生成大量模型后聚类提交；R1260（溶剂化壳层）用标准流程水合，Elofsson 组另跑了 47 ns 分子动力学（MD）模拟。
- 未知化学计量比：同源多聚体从单体起试到六聚体；因计算限制无法穷举（R1253 是八聚体，未能正确预测）；按 ranking confidence 选前五打分最高者（Elofsson 额外人工检查 PAE 图、选择更多样）。异源多聚体（M、H 靶标）只试有限组合：从每条链各一个拷贝出发，逐条加拷贝直到 ranking confidence 下降。
- 评估指标：单域用 GDT_TS，核酸用 TMscore，复合物用 DockQ；另用预测中心的 Z-score 分析作组间排名。数据全部下载自预测中心，分析脚本公开于 https://gitlab.com/arneelof/CASP16-predictions；预测细节见 https://github.com/ElofssonLab/casp16/blob/master/Targets.MD。
- 数据范围：除化学计量比分析外只分析 Round 1 模型（Round 2 未做改动；Round 0 到 Round 1 仅必要时改化学计量比）；两两比较只包含双方都提交的靶标；H1265 在预测中心网站出现 4 次，只计入 H1265v1（忽略 H1265v2、v3）。

## 关键图表解读

说明：PMC 提取的 markdown 中所有图像均未获取；下方为正文提及的图及其图注内容。提取文件头部元信息显示该文共 9 图 4 表，但正文只提及 Fig.1–Fig.8 与 Table 1–2；第 9 幅图与表 3、表 4 在正文中未出现，内容未获取到。

- Fig.1（正文提及 Fig.1，图像未获取）：大靶标 H1227 的建模示意——左侧红色结构域无法直接由 AF3-server 建模（总复合物超 5000 残基），将其与较大复合物的末端部分分别建模，叠加重叠域后把红色结构域拼回模型再提交。
- Fig.2（正文提及 Fig.2，图像未获取）：AF3-server 与 Elofsson 的对比，共 4 个面板。上行（A、B）为最高排名模型，下行（C、D）为五个提交模型中的最优；左列（A、C）域水平用 GDT_TS，右列（B、D）复合物用 DockQ。差值超过指标最大值 10% 的靶标标注靶标号。
- Fig.3（正文提及 Fig.3，图像未获取）：AF3-server 与 MassiveFold、colabfold_baseline 的对比，共 8 个面板（A–H）。上行（A–D）最高排名模型，下行（E–H）五中取最优；左两列（A、B、E、F）域水平 GDT_TS，右两列（C、D、G、H）复合物 DockQ；A、C、E、G 对 colabfold_baseline，其余对 MassiveFold。差值超过 10% 的靶标标注靶标号。
- Fig.4（正文提及 Fig.4，图像未获取）：AF3-server 与顶级方法的对比——域对 YangServer（A、C），复合物对 KiharaLab（B、D）；上行为首选模型，下行为五中取最优；差异超过 10% 的靶标标注靶标号；紫色曲线为 10 点滚动平均。
- Fig.5（正文提及 Fig.5，图像未获取）：AF3-server 每个靶标的最高排名模型 vs 五个模型中的最优。（A）域用 GDT_TS，（B）复合物用 DockQ；差值超过 10% 的标注靶标号。
- Fig.6（正文提及 Fig.6，图像未获取）：R1250（六聚体 RNA）的"重叠"预测示例——各条链以不同颜色标注，显示所有链相互叠在一起。
- Fig.7（正文提及 Fig.7，图像未获取）：RNA 预测对比，共 4 个面板。（A、B）AF3-server vs Elofsson，（C、D）AF3-server vs 顶级方法 Vfold；（A、C）单链 RNA 用 TMalign，（B、D）复合物用 DockQ；混合型（M）与纯 RNA 靶标以不同颜色标记；差值超 10% 标注靶标号；B、D 中有紫色 10 点滚动平均。
- Fig.8（正文提及 Fig.8，图像未获取）：质量估计的评估。（A）蛋白域与单链 RNA 的 pTM vs TMscore；（B）整个复合物的 ipTM vs DockQ；同源（T）、异源（H）、混合（M）、核酸（R）靶标以不同颜色表示。
- Table 1（正文提及 Table 1，表格内容未获取）：AF3-server 与 Elofsson 对 41 个 stage 0（round zero）靶标的化学计量比预测正确率；分别报告最高排名模型与五个提交模型中的最优。正文给出的关键数字见下节。
- Table 2（正文提及 Table 2，表格内容未获取）：Elofsson（elo）、AF3-server（Af3）与两个基于 AF2 的方法 colabfold_baseline（Co）、MassiveFold（Ma）在预测中心网站的官方排名，采用 Sum of Z-scores > −2.0 指标；粗体为该类别中排名最高的方法。

## 主要结果与关键数字

人工干预 vs 自动：
- Elofsson 的人工干预整体未带来显著改善。域水平平均 GDT_TS 上 AF3-server 略好，但差异来自两个域：T1212-D1 与 T1257-D1；看五中取最优时该差异消失——即 AF3-server 恰好在这些靶标上选错了首选模型。
- 除 4 个域外，几乎所有域 GDT_TS > 80，平均 GDT_TS 约 88（作者称达到与实验结构可比的质量）。
- 复合物上两者无显著差异；平均 DockQ 0.53（注意只分析了平均 DockQ，多界面的复合物可能仍有个别界面质量差）。

AF3-server vs AlphaFold2 系方法：
- 首选模型（域水平）：AF3-server 平均 GDT_TS 87.1，AF2 系方法约 85.5，AF3 略有优势；差异来自少数靶标，且不是同一批靶标。
- 五中取最优时差距缩小；个别域 AF3 更好，另有 1 个域 AF2 更好。
- 复合物：AF3-server 平均 DockQ 0.53 vs colabfold_baseline 0.46（首选）、0.57 vs 0.49（最优）；约 10 个复合物上 AF3-server 优于 colabfold_baseline。但 MassiveFold 质量与 AF3-server 相当——增大采样使 AF2 追平 AF3。AF3 自身再增采样能否更好仍未知（作者此前研究表明抗体–抗原复合物中加大采样确实更好）。

vs 顶级方法（按预测中心默认设置选定：域为 YangServer、复合物为 KiharaLab）：
- 首选模型差异较小；五中取最优时差异更明显。域的差异几乎全部来自 2 个靶标（T12561-D1 与 T1226-D1，原文如此拼写）；KiharaLab 有多个复合物优于 AF3-server，但 T1240、T1298 两个复合物上 AF3-server 反超。
- 解释：顶级方法提交的模型间变异性更大，且各方法也都难以从提交模型中识别最优者。

首选 vs 最优：
- 提交 5 个模型只让 2 个复合物（T1240、T1295）变好，其余靶标无显著改善——再次说明 AF3-server 无法可靠挑出最好的模型。

RNA / 核酸：
- 多链 RNA 模型 72%（309/420）有链间重叠被丢弃（重跑至至少 5 个无明显重叠且 pTM 为正的模型）。
- 与 Elofsson 无差异。单链 RNA 上 Vfold 略优于 AF3-server（五中取最优时更明显）：平均 TMscore 0.51 vs 0.46。复合物（混合多链 RNA + 纯 RNA）上差异极小：平均 DockQ 0.18 vs 0.17；整体可接受模型很少，三个方法都只把同一对复合物（M1293、M1296）预测到 DockQ > 0.6，说明 M 靶标的成功主要来自蛋白–蛋白相互作用的准确预测。

置信度评分（EMA）：
- 按 per-atom Z-score LDDT RMSD 评估，AF3-server 与 Elofsson 分列第二、第三（第一为 PLMfold）。
- 域水平 pTM vs TMscore 相关性不高（Cc = 0.66），因为 pTM 是针对整个复合物而非单链/单域；单链 RNA 的 pTM 与 TM 一致性更好（可能因未分域）。作者建议 AF3-server 提供按链/域的 pTM。
- 复合物 ipTM vs DockQ 相关性可接受（Cc = 0.66）；pTM vs TMscore 相关性更好（Cc = 0.83，平均误差 0.13，数据未展示），部分因几乎所有 RNA 模型都很差且 pTM 也低。

化学计量比：
- 41 个 stage 0 靶标：AF3-server 首选模型预测对 14 个（34%），含全部 5 个模型时 22 个（54%）；Elofsson 分别多对 1 个（首选）和 2 个（全部）。混合型（M）靶标双方都只在 1 个靶标（M1287）的 5 个模型中命中 1 次正确化学计量比；同源（T）优于异源（H）——同源可选组合少得多。

官方 Z-score 排名（Sum of Z-scores > −2.0，默认评估）：
- AF3-server 在所有/容易/中等靶标上稳定位于前 20%（多在前 10%），但困难靶标只在前 30%–40%；除困难靶标外显著优于 colabfold_baseline 与 MassiveFold（即对容易靶标 AF3 确实优于 AF2）。对困难单域与困难多聚体，AF3-server 相对 AF2 无明显改进；对 AF2 施加大规模采样的方法（如 Wallner 组在困难靶标上）反而优于 AF3-server。

结论中的总体表述：对普通用户，AF3-server 默认设置在所有类型靶标上接近最先进水平，但提交多链核酸时应检查链间冲突。

## 对照与消融

本文本质上是一组配对对照，未做算法层面的消融（服务器无法本地部署、无法改权重）：

1. 人工 vs 自动（Elofsson #241 vs AF3-server #304）：唯一差异是多随机种子生成 + 内部打分 + 人工检查（含 PAE 图检查）；结论：无显著增益。
2. 采样预算对照：colabfold_baseline vs MassiveFold vs AF3-server——MassiveFold（大规模采样）追平 AF3，说明"AF3 略好"的差距主要可被 AF2 侧的采样预算抵消。
3. 首选 vs 五中取最优：AF3-server 自身对比，量化"选模型"环节的损失。
4. 官方排名（Z-score）vs 作者自算绝对指标（GDT_TS / TMscore / DockQ）：两种视角互补——Z-score 能放大微小差距，按难度分层后揭示 AF3 优势集中在容易靶标。
5. RNA 侧与专门方法 Vfold 对照。
6. 化学计量比：首选 vs 全部 5 个模型（34% vs 54%），以及同源 vs 异源分层。
7. 配体：因格式问题未获官方评估，实际无对照结果。

## 作者自述的局限

- 只能使用 AF3 网页服务器：仅少数标准化蛋白配体可用；> 5000 tokens 的复合物无法预测；无法评估本地部署与定制权重的影响。
- 配体预测因 PDB 格式提交失误未被官方评估，配体分析基本缺失。
- 对超大靶标只做片段拼接且不精修，切分位置靠人工决定。
- 化学计量比无法穷举（异源组合太多；未探索超过六聚体的同源多聚体，直接导致 R1253 八聚体预测失败）。
- 差异往往由极少数靶标驱动：即使统计显著，对普通用户可能意义有限，作者因此只关注系统性差异、不做逐靶标深究。
- 无法回答"对 AF3 增加采样是否也会提升"（对照组 MassiveFold 已证明 AF2 侧可以）。
- AF3-server 无法从生成模型中识别最优模型（模型选择策略是明确指出的进步空间）。
- 多链 RNA 大量模型重叠需人工重跑；RNA 整体质量低。
- pTM 是整复合物打分，缺少逐链/逐域分辨率。
- 只分析 Round 1 模型、只用一个主指标/类别，作者声明不做与 assessor 相同的深度分析。

## 我的评价

- 选题与定位务实：这篇单人组论文的价值不在新方法，而在于给 AF3 第一次盲测做"克制的基准线"——把 AF3-server 当作所有组共有的基线，控制变量（同一服务器、最小干预）让 AF3 与 AF2 之间的真实增量暴露出来，这是第三方评测少见的干净设计。
- 最有分量的观察是采样预算的混杂："AF3 > AF2"在 MassiveFold 大采样下消失，说明绝对指标上的代际优势一部分是工程采样投入而非模型架构本身；论文诚实地指出"AF3 增采样是否会更好"未答。读结论时应把"AF3 只略好"与"AF2 大力采样可追平"两句话放在一起理解。
- "首选 vs 最优"与 Z-score 分层揭示的元问题（模型选择能力、困难靶标无优势）比绝对分数本身更有价值，也为 CASP 场景外（如药物设计、复合物建模）的实用决策提供了提醒：别只看第一名的模型。
- 方法学瑕疵：配体评估因提交格式事故整体落空，恰好在 AF3 最具新颖性的分子类别上留下空白；化学计量比分析的搜索空间受限，34%/54% 的正确率应视为"受限搜索 + 单一打分"下的下界而非 AF3 能力的上界。两者都削弱了"AF3 所有类别接近最先进"这一总结的外推范围。
- 统计解释上有自觉：作者反复强调少数靶标驱动差异、统计显著≠实用显著，并采用滚动平均与靶标标注呈现，这是相对老实的做法；但"平均 GDT_TS 约 88 与实验质量可比"的表述偏乐观，平均掩盖了尾部困难靶标。
- 单指标化（GDT_TS / TMscore / DockQ 各只用一个）牺牲了信息但换来了可读性；脚本与提交细节全部公开，复现成本低，值得肯定。

## 可复现要点

- 数据源：CASP16 预测中心官网（全部数据）；分析脚本 https://gitlab.com/arneelof/CASP16-predictions；逐靶标预测细节 https://github.com/ElofssonLab/casp16/blob/master/Targets.MD。
- 指标与口径：单域 GDT_TS；核酸 TMscore；复合物 DockQ；官方排名用 Sum of Z-scores > −2.0；两两比较只含双方都提交的靶标；只分析 Round 1；H1265 只计 H1265v1。
- 服务器使用：全部经 AF3 网页服务器；Elofsson 侧靠不同随机种子增样、内部评分与人工检查选模型。
- 关键处理流程（可模仿）：大靶标 MolPC 式重叠片段拼接；RNA 冲突过滤（has_clash / 负 ranking_score / 要求 pTM 为正，重跑至 5 个无冲突）；配体按碳原子数选相似物 + smiles2pdb 建结构 + 叠加回 AF3 模型；化学计量比从单体扫到六聚体、异源按"逐条加拷贝至置信下降"策略。
- 当时 AF3 仅网页服务器可用；现已开源（github.com/google-deepmind/alphafold3，Attribution-NonCommercial-ShareAlike 4.0 International 许可）。

## 术语

- CASP（Critical Assessment of protein Structure Prediction）：蛋白质结构预测的社区盲测竞赛，两年一届。
- GDT_TS（Global Distance Test – Total Score）：全局距离测试总分，衡量模型与天然结构的整体相似度。
- TMscore（Template Modeling score）：模板建模分数，长度无关的结构相似性指标（核酸评估中用于替换 GDT_TS）。
- DockQ：复合物对接质量评分，综合 Fnat、LRMS、iRMS 等，0–1 越接近 1 越好。
- Z-score：相对分数的标准化度量；文中 "Sum of Z-scores > −2.0" 指对各靶标 Z-score 求和（仅计 > −2 者）用于官方排名。
- pTM / ipTM（predicted TM-score / interface pTM）：AlphaFold 输出的整体/界面置信度估计。
- PAE（Predicted Aligned Error）：预测比对误差矩阵，用于人工检查域间相对位置置信度。
- LDDT（Local Distance Difference Test）：局部距离差异检验，Z-score LDDT RMSD 用于 EMA 类别排名。
- EMA（Estimated Model Accuracy）：模型质量估计类别。
- stoichiometry（化学计量比）：复合物中各亚基的拷贝数与组成。
- tokens：AlphaFold3 内部对残基/原子的离散化单元，服务器上限 5000。
- Fold-and-Dock：先折叠单体再对接的复合物预测范式（文中用于追溯 AF2 时代方法）。
- MSA（multiple sequence alignment）：多序列比对；DCA（Direct Coupling Analysis）：直接耦合分析，接触预测的经典方法。
- MassiveFold：对 AlphaFold 进行大规模并行采样的 AF2 实现；colabfold_baseline：ColabFold 的基线提交。
- has_clash / ranking_score：AF3 输出中指示原子冲突与模型排名的字段。
- solvation shell（溶剂化壳层）：R1260 类靶标；MD（molecular dynamics）：分子动力学模拟。
- 靶标编号：T/H/M/R 前缀对应纯蛋白同源/异源多聚、混合（蛋白–核酸）、纯核酸类 CASP 靶标；stage 0（round zero）指化学计量比预测轮次。

---

**导航**

- 模块笔记：[[notes/class-notes/结构生物学/AI结构预测/精读/_index|精读总索引]]
- 上一篇：[[notes/class-notes/结构生物学/AI结构预测/精读/03 Clément Bernard 2025]]

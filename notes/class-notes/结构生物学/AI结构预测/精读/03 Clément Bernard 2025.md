---
title: Clément Bernard 2025｜Has AlphaFold3 achieved success for RNA?
date: 2026-10-08
tags: [课程, 结构生物学, 文献精读, 复合物与多模态]
status: primary
类型: 精读笔记
来源: Clément Bernard et al. *Acta Cryst D* 2025，DOI [10.1107/S2059798325000592](https://doi.org/10.1107/S2059798325000592)
模块: 复合物与多模态：从蛋白到生物分子相互作用
主键: 39868559
---

# Has AlphaFold3 achieved success for RNA?

**Clément Bernard et al.** · *Acta Cryst D* · 2025 · DOI [10.1107/S2059798325000592](https://doi.org/10.1107/S2059798325000592)

> 所属模块：[[notes/class-notes/结构生物学/AI结构预测/03-复合物与多模态-从蛋白到生物分子相互作用|复合物与多模态：从蛋白到生物分子相互作用]]
# Has AlphaFold3 achieved success for RNA?

- 作者：Clément Bernard, Guillaume Postic, Sahar Ghannay, Fariza Tahi（巴黎萨克雷大学 Évry 分校 IBISC 实验室）
- 期刊：Acta Crystallographica Section D（Acta Cryst D），第 81 卷，49–62 页，2025 年
- DOI：10.1107/S2059798325000592
- 数据与结果托管于 EvryRNA 平台：https://evryrna.ibisc.univ-evry.fr/evryrna/alphafold3/

## 一句话结论

在五个独立 RNA 测试集上与十种现有方法（从头算 ab initio、基于模板 template-based、深度学习 deep-learning 三类）的系统对比表明：AlphaFold3 在 RNA 三维结构预测上是"有竞争力但未成功"——它在多数测试集上超过现有方法、扭转角（MCQ 指标）和关键 RNA 相互作用（INF 指标）复现能力为所有方法中最好，但在 CASP-RNA 上仍被人类专家辅助的挑战赛最佳方案超越，且对孤儿（orphan）RNA 结构、非 Watson–Crick 相互作用（non-Watson–Crick interactions）和长序列折叠仍明显不足，尚未复现其在蛋白上的成功。

## 研究问题

AlphaFold3（Abramson et al., 2024）将预测范围扩展到 RNA、DNA、配体等分子，但原始论文只报告了 CASP-RNA 一个 RNA 数据集的结果，其性能范围与局限并不清楚。针对 Schneider et al. (2023) "AlphaFold 用于 RNA 尚未到来、甚至可能几十年内都不会到来"的批判性评论，本文试图给出回应：

1. AlphaFold3 在 RNA 三维结构预测上到底表现如何（性能的完整边界在哪里）？
2. 与十种现有最先进 RNA 方法（从头算、基于模板、深度学习三类）相比处于什么位置？
3. 其局限与失败模式是什么（孤儿结构、非 Watson–Crick 相互作用、长 RNA、上下文依赖）？
4. 为什么 RNA 结构预测远比蛋白困难（RNA 与蛋白的本质差异）？

## 方法与数据

**五个测试集**（前三个沿用作者此前工作 State-of-the-RNArt, Bernard et al. 2024b）：

1. **RNA-Puzzles**：社区基准 RNA-Puzzles 的单链（single-stranded）结构，22 条 RNA，长度 27–188 nt（均值 83 nt）。
2. **CASP-RNA**：CASP 与 RNA-Puzzles 合作产物，12 条 RNA，长度 30–720 nt（均值 209 nt）。
3. **RNASolo**：自建集。从 RNAsolo 下载分辨率 < 4 Å 的代表性结构，去序列同一性 > 80% 者，每结构仅保留唯一 Rfam 家族 ID，得 25 条非冗余 RNA，长度 45–298 nt（均值 100 nt）。作者承认无法保证这些结构未出现在各模型的训练集中。
4. **RNA3DB_0**：来自 RNA3DB 的组分 #0（孤儿结构，无 Rfam 家族归属，含合成 RNA 及大复合物中结晶的小 mRNA）。经 CD-HIT 去序列同一性 ≥ 80%、去除 < 10 nt 后得 224 条结构（10–339 nt，均值 55 nt）。这些结构来自复合物，孤立预测不合理，故取其中 113 条做带完整上下文（context）的预测，记为 RNA3DB_0 (Context)；其余结构因上下文过大而 AlphaFold3 无法预测。
5. **RNA3DB_Long**：RNA3DB 中 2023 年 1 月后释放的长 RNA（避免训练泄漏），长度 800–5000 nt，共 58 条（828–3619 nt，均值 2005 nt），其中 57 条核糖体 RNA 和 1 条 II 型内含子（group II intron）。

除 RNA-Puzzles 与 CASP-RNA 外，其余数据集均保证序列同一性 < 80%，确保非冗余评估。

**对照方法（10 种）**：从头算——SimRNA、IsRNA1、RNAJP（仅 RNAJP 本地运行）；基于模板——MC-Sym、Vfold3D、RNAComposer、3dRNA、Vfold-Pipeline；深度学习——trRosettaRNA、RhoFold。RNA-Puzzles 与 CASP-RNA 还纳入竞赛官方最佳预测（"challenge best"，每条 RNA 可能来自不同方法，且 CASP-RNA 的最佳为人类专家辅助）。全部预测用 RNA-tools 标准化（统一链/残基/原子命名，去除离子与水）。对 RNA3DB_0 因网络服务器限制只与每类最快的方法对比（RhoFold、RNAComposer、RNAJP）；RNA3DB_Long 只有 AlphaFold3 能处理（其余方法无法预测 > 3000 nt 的序列）。均使用网络服务器默认参数以保证可复现。

**评估指标**（用本组开发的 RNAdvisor 计算）：RMSD（root-mean-square deviation，最常用）、ɛRMSD、TM-score、GDT-TS、CAD-score、lDDT、P-value、INF-ALL（含 INF-WC、INF-NWC、INF-STACK 三个子指标）、DI、MCQ（mean of circular quantities，扭转角偏差）、LCS-TA。正文重点讨论 RMSD、INF-ALL、lDDT、TM-score、MCQ 五项，其余见补充材料。显著性检验用 Wilcoxon 符号秩检验（Wilcoxon signed-rank test）。

## 关键图表解读

- **Fig.1（正文提及，图像未获取）**：RNA 碱基相互作用的三种边——Watson–Crick 边、Hoogsteen 边和糖边（sugar edge）；边与糖苷键 cis/trans 取向组合出 12 种相互作用方式、200 余种可能碱基配对。
- **Fig.2（正文提及，图像未获取）**：五种测试集、所有方法、所有指标的归一化累积性能对比（数值经归一化，越接近 1 越好）。显示 AlphaFold3 在 RNA-Puzzles、RNASolo 上累积得分最高，在 CASP-RNA 上被 challenge best 超越。
- **Fig.3（正文提及，图像未获取）**：按方法类型（ab initio / template-based / deep-learning / challenge best / AlphaFold3）随序列长度（25 nt 窗口取均值）变化的各指标曲线。显示挑战赛最佳在多数指标上优于 AlphaFold3，但在 150–250 nt 区间 AlphaFold3 相当；从头算方法无一能在网络服务器上完成 > 200 nt 的预测。
- **Fig.4（正文提及，图像未获取）**：AlphaFold3 在五个测试集上 RMSD、MCQ、TM-score、lDDT、INF-ALL 随序列长度的变化。除 RNA3DB_0 外，0–1000 nt 内 RMSD 随长度变差；> 1000 nt 的 RNA3DB_Long 各项指标均好；> 100 nt（< 1000 nt）时 lDDT、TM-score、INF-ALL（下降较小）呈退化趋势。
- **Fig.5（正文提及，图像未获取）**：AlphaFold3 各数据集的最差两个预测。RNA3DB_Long 最差两条 RMSD > 19 Å：最差者为唯一的非核糖体结构（II 型内含子，TM-score = 0.38，PDB 8fli，天然状态下与成熟酶/逆转录酶结合）；次差者为 15S 线粒体 rRNA（TM-score = 0.74，PDB 8om4，仅有 3 篇文献报道过）。RNA3DB_0 无上下文时最差预测为 81/42/45/58 nt 的小结构，高 RMSD/MCQ、低 TM-score/INF-ALL。
- **Fig.6（正文提及，图像未获取）**：RNA3DB_0 加上下文 vs 不加上下文的分指标差异随序列长度分布。上下文对几乎所有指标有改善：91.1% 结构的 TM-score 提高，MCQ 仅 62.5% 提高；实例：PDB 7wm4 中上下文帮助识别半条双螺旋的正确尺度，PDB 8bvj 中帮助识别不连续（discontinuity）。
- **Fig.7（正文提及，图像未获取）**：INF-NWC 对 INF-WC 散点图，点大小正比于 RMSD。INF-WC 与 INF-NWC 都高时 RMSD 通常低；大量结构 INF-NWC = 0（尤其 RNA3DB 集），说明 AlphaFold3 常完全预测不出非 Watson–Crick 相互作用；另有"骨架/堆积预测尚可但 WC 配对缺失"的情况（如 PDB 8ex9 B 链部分可折叠、部分不能）。
- **Fig.8（正文提及，图像未获取）**：十个模型在 RNA-Puzzles、CASP-RNA、RNASolo 上的平均 INF 指标对比。AlphaFold3 三项 INF 均第一，RNAComposer 第二，trRosettaRNA 尽管总体分高但关键相互作用指标差。
- **Table 1（正文提及，表格数值未获取）**：五个测试集（含 RNA3DB_0 (Context)）中 STACK / WC / nWC 三类相互作用（MC-Annotate 提取、按残基数归一化）的比例。除 RNA3DB_0 约 56% 外，各集 STACK 均约 75%；nWC 仅占 5–10%（这是预测难点）；加上下文后 STACK 与 WC 比例升高而 nWC 不变。
- **Table 2（正文提及，表格数值未获取）**：RNAComposer、RhoFold、trRosettaRNA、RNAJP、AlphaFold3 对 27 nt 与 434 nt RNA 的计算时间。27 nt：RNAComposer/RhoFold/trRosettaRNA < 1 分钟，RNAJP 2 小时，AlphaFold3 约 5 分钟；434 nt：RNAComposer 最快约 3 分钟，RNAJP 15 小时。~3000 nt 时 AlphaFold3 需数小时且有时报错需重跑。

注：PMC 提取文件头标注本文含图 8 张、表 3 张，但正文仅提及 Table 1、Table 2，且所有图/表实体均未随提取文本获得。

## 主要结果与关键数字

- **总体排名**：AlphaFold3 在 RNA-Puzzles（p < 10⁻⁵）与 RNASolo（p < 10⁻⁴）上累积指标和显著高于其他方法；在 CASP-RNA 上被人类辅助的挑战赛最佳超越（p = 0.007，除 LCS-TA@10° 与 MCQ 外的所有指标）；在 RNA3DB_0 上仅略优于 RhoFold（p = 0.015，RhoFold 的 RMSD 更好，但 MCQ、LCS-TA 更差）。
- **扭转角**：AlphaFold3 的 MCQ 在所有方法中最好，返回的构象比从头算方法更"物理合理"；这是其他深度学习方法（trRosettaRNA、RhoFold 等）普遍缺失的能力；在 > 250 nt 区间可与挑战赛最佳持平。但其 RMSD 并非总是最优（CASP-RNA、RNA3DB_0 上被超越）。
- **关键相互作用（INF）**：AlphaFold3 的 INF-WC、INF-NWC、INF-STACK 均优于十种对照方法（第二名为 RNAComposer）；但 INF-NWC 绝对水平仍低于 0.5，且大量结构 INF-NWC = 0。
- **孤儿结构**：无上下文时 RNA3DB_0 表现明显差于其他测试集（Supplementary Table S4 中平均 TM-score < 0.5）；加上下文后显著改善（p < 10⁻¹⁹；91.1% 结构 TM-score 提高，62.5% MCQ 提高）。十种对照方法均无"带上下文预测"能力。
- **长 RNA**：AlphaFold3 是目前唯一能预测 > 1000 nt RNA 的方法。RNA3DB_Long 上除 GDT-TS、CAD-score、LCS-TA@10°（作者怀疑是计算误差）外各项指标均好。但该集 57/58 为核糖体 RNA，作者明确指出该"好成绩"可能来自训练期对 PDB 中核糖体家族结构的记忆，而非全新折叠能力——证据：唯一非核糖体结构（II 型内含子）恰是全场最差预测（TM-score = 0.38）。
- **序列长度**：0–1000 nt 内预测质量随长度下降；> 100 nt 时 lDDT、TM-score、INF-ALL 退化；> 1000 nt 反而回升（核糖体家族效应）。
- **计算时间**：AlphaFold3 推理约 5 分钟（27 nt 与 434 nt 量级接近），远快于 RNAJP（2 h / 15 h），但慢于 RNAComposer（< 1 min / ~3 min）；对 ~3000 nt 需数小时且不稳定。
- **数据背景数字**：截至 2024 年 6 月，PDB 中 RNA 结构仅 7759 个 vs 蛋白 216 212 个；RNA 每核苷酸 7 个扭转角（α, β, γ, δ, ɛ, ξ, χ）加糖环褶皱相（sugar pucker）P，而蛋白主链每残基仅 Φ/Ψ 两个角。

## 对照与消融

论文没有对 AlphaFold3 自身架构做消融（如去掉 MSA、换模块），最接近"消融"的分析是三组对照性实验：

1. **上下文消融（RNA3DB_0 有/无 context）**：这是全文最强的受控对照——同一批 113 条结构、同一模型，唯一变量是是否把同源的蛋白/RNA 链上下文一起输入。结果 p < 10⁻¹⁹，证明孤儿 RNA 的折叠信息大量来自其环境；也反证 AlphaFold3 对孤立孤儿结构缺乏真正的从头折叠能力。
2. **家族归属对照（RNA3DB_Long 内部）**：57 条核糖体 RNA vs 1 条 II 型内含子的鲜明反差（TM-score 整体良好 vs 0.38），把"长 RNA 表现好"归因到训练数据记忆而非长度泛化；次差的 15S 线粒体 rRNA（TM-score = 0.74）作为"进化上远缘、文献极少"的中间案例进一步支持这一归因链条。
3. **方法类型分层对照（Fig.3/Fig.8）**：按 ab initio / template-based / deep-learning / challenge best 分层比较，把 AlphaFold3 的优势与劣势分别定位到"扭转角/关键相互作用（INF、MCQ 领先）"与"全局比对（RMSD 被 challenge best 超越）"两个维度。

对消融类研究而言的空白：论文未改变 AlphaFold3 的种子、深度或输入裁剪来验证鲁棒性，也未对"MSA 仍被使用"这一自述局限做实验验证。

## 作者自述的局限

1. **非 Watson–Crick 相互作用复现不足**：INF-NWC 均值 < 0.5，大量结构为 0，而 nWC 相互作用对三维结构稳定性至关重要。
2. **孤儿结构泛化差**：无已知家族、无上下文的 RNA 几乎无法预测；加上下文改善明显但仍不稳定（平均 TM-score < 0.5）。孤儿结构难以评估——缺少环境信息，且 RNA 本身存在多构象，缺乏评估替代构象的手段。
3. **MSA 依赖未消除**：AlphaFold3 虽削弱了 MSA 的权重，但仍在用，对"无同源序列的未知家族"构成限制。
4. **长 RNA 好成绩的归因存疑**：RNA3DB_Long 几乎全是核糖体 RNA，高冗余可能已被模型在训练中记忆，"好成绩"反映的是对已知家族的泛化，而非从头折叠。
5. **数据短缺是根本瓶颈**：PDB 中 RNA 结构仅约蛋白的 1/28（7759 vs 216 212），且家族分布严重不均，大量长 RNA 家族无已解析结构；社区缺乏标准训练集，阻碍深度学习方法训练。
6. **架构层面的怀疑**：直接预测原子坐标（而非 AF2 式的碱基框架 + 扭转角）虽扩展了分子适用范围，但可能妨碍 RNA 特有相互作用的泛化。
7. **计算可用性**：推理虽快，但受限于网络服务器；源码已公开却需巨大计算资源；超长序列（~3000 nt）需数小时且常报错需重跑。另外计算时间对比存在偏差（各网络服务器配置不同，RNAJP 为本地运行）。

## 我的评价

这篇论文的价值在于它是 AlphaFold3 发布后对 RNA 能力少有的系统、独立、非冗余检验，并把"蛋白成功、RNA 未成功"从印象变成可复现的量化结论。它最扎实的贡献是 RNA3DB_0 有/无上下文的对照（p < 10⁻¹⁹）和 RNA3DB_Long 内部核糖体 vs II 型内含子的自然对照——这两组设计绕过了"无法窥见 AF3 训练集"的困难，用受控比较证明了性能来源是记忆而非泛化。

论文对"为什么 RNA 与蛋白差异如此之大"给出了三个层次的事实依据，恰好可以解释其观测到的结果：
- **自由度**：蛋白主链每残基 2 个扭转角且肽键平面化；RNA 每核苷酸 7 个扭转角加糖环褶皱，且二面角之间存在强耦合（论文引述须用二核苷酸片段才够描述骨架），构象空间指数级放大；
- **训练数据规模**：PDB 中 RNA 结构仅 7759 个 vs 蛋白 216 212 个（截至 2024 年 6 月），且高度集中于少数家族——这与文中"孤儿结构必败、核糖体结构必胜"的观察直接对应；
- **评估指标选择**：论文对指标做了有意识的取舍（正文聚焦 RMSD、INF-ALL、lDDT、TM-score、MCQ，其余入补充），并反复强调"RMSD 好 ≠ 关键相互作用好"——如 trRosettaRNA 总分高但 INF 差、RhoFold RMSD 优于 AF3 但 MCQ 差，提醒读者 RNA 评估不能照搬蛋白的单一 RMSD 叙事。另外 RNA 的崎岖自由能面与多构象本质（核开关、核酶依赖构象切换）使"单一参考结构"这一评估前提本身就值得商榷，论文承认没有评估替代构象的好办法，这其实是整个 RNA 结构预测领域的深层问题，而非 AF3 独有的缺陷。

需要谨慎对待的地方：其一，RNA3DB_Long 的"好成绩"已被作者自己解构为核糖体家族记忆，读者不应把它当成 AF3 具备长 RNA 能力；其二，与 challenge best 的对比并非严格同口径——那是竞赛官方提交（常含人工干预），而 AF3 是黑盒自动运行；其三，论文无法验证 AF3 训练集是否泄漏到 RNASolo（作者明示），对 CASP-RNA 之外的泄漏风险只能靠 RNA3DB_Long 的发布时间约束来部分规避。总体而言，这是一篇结论审慎、与既有文献（Schneider et al. 2023 的悲观预测）形成有效对话的独立评测，其对"孤儿结构与 nWC 相互作用"失败模式的定位，为 RNA 专用深度学习方法的后续设计划出了清晰的攻坚方向。

## 可复现要点

- 全部预测使用各方法网络服务器默认参数（RNAJP 本地，NVIDIA P1000，50 × 10⁶ 步）；数据、结果、指标值公开于 EvryRNA 平台（https://evryrna.ibisc.univ-evry.fr/evryrna/alphafold3/）。
- 预处理管线：RNA-tools 标准化结构（统一命名、去离子与水）；CD-HIT 控制序列同一性 < 80%；RNA3DB_Long 以 2023 年 1 月发布日为泄漏防线。
- 评估管线：本组 RNAdvisor 工具一键计算全部指标；显著性检验用 Wilcoxon 符号秩检验；各指标实值见补充表 S1–S5，其余指标与逐结构详情见补充图 S2–S4、S7 及补充表 S6。
- 关键复现参数：RNA3DB_0 全量 224 条、带上下文子集 113 条；补充材料 DOI：10.1107/S2059798325000592/lie5001sup1.pdf。

## 术语

- RMSD（root-mean-square deviation）：全原子叠加后的均方根偏差，RNA 评估最常用指标。
- ɛRMSD：在 RMSD 中加入 RNA 结构特征的扩展版本。
- TM-score：由蛋白评估移植的全局相似度分数（0–1，越高越好）。
- GDT-TS（global distance test-total score）：基于叠加原子比例的全局距离测试。
- CAD-score（contact area difference）：基于接触面积差的相似度。
- lDDT（local distance difference test）：局部原子间距离差异分数，AlphaFold 系模型的标配指标。
- P-value：评估预测"非随机性"的 RNA 专用指标。
- INF-ALL / INF-WC / INF-NWC / INF-STACK：基于 RNA 关键相互作用（全部 / Watson–Crick 配对 / 非 Watson–Crick 配对 / 堆积 stacking）的相互作用网络保真度分数。
- DI（deformation index）：相互作用变形指数。
- MCQ（mean of circular quantities）：扭转角环形量的均值偏差，衡量扭转角预测质量。
- LCS-TA（longest continuous segments in torsion angle space）：扭转角空间中最长连续正确片段。
- MSA（multiple sequence alignment）：多序列比对，AF 系模型的输入特征之一。
- WC edge / Hoogsteen edge / sugar edge：碱基参与配对的三种边（Westhof & Fritsch, 2000）。
- cis / trans：糖苷键相对取向，与边组合出 12 种配对方式。
- sugar pucker（糖环褶皱）：核糖环的构象相（P），RNA 骨架自由度的一部分。
- 伪扭转角（pseudo-torsions η, θ）：对 RNA 骨架的简化两角描述（Wadley et al., 2007）。
- ab initio（从头算）：基于物理力场 + 粗粒化采样的方法类（如 SimRNA、IsRNA1、RNAJP）。
- template-based（基于模板）：序列—结构片段映射后再组装的方法类（如 RNAComposer、MC-Sym、3dRNA）。
- coarse-grained（粗粒化）：以核苷酸的部分原子替代全原子做低分辨率模拟。
- orphan structures（孤儿结构）：无 Rfam 家族归属、无已知同源的结构。
- Rfam：RNA 家族数据库；CD-HIT：常用序列去冗余工具（序列同一性聚类）。
- group II intron（II 型内含子）：具有复杂折叠的自剪接内含子。
- CASP-RNA / RNA-Puzzles：RNA 结构预测社区盲测竞赛。
- challenge best（挑战赛最佳）：竞赛官方结果中的最佳预测（可含人工专家辅助）。
- Wilcoxon signed-rank test（Wilcoxon 符号秩检验）：配对样本非参数显著性检验。
- MC-Annotate：提取 RNA 碱基相互作用（WC/nWC/STACK）的注释工具。
- RNA-tools / RNAdvisor：本组的结构标准化工具 / 多指标批量评估工具。

---

**导航**

- 模块笔记：[[notes/class-notes/结构生物学/AI结构预测/精读/_index|精读总索引]]
- 上一篇：[[notes/class-notes/结构生物学/AI结构预测/精读/02 Alireza Omidi 2024]]

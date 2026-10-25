---
title: Letícia M F Bertoline 2023｜Before and after AlphaFold2: An overview of protein structure prediction.
date: 2026-10-08
tags: [课程, 结构生物学, 文献精读, 范式起点]
status: primary
类型: 精读笔记
来源: Letícia M F Bertoline et al. *Front Bioinform* 2023，DOI [10.3389/fbinf.2023.1120370](https://doi.org/10.3389/fbinf.2023.1120370)
模块: 范式起点：从衍射反演到可微分建模
主键: 36926275
---

# Before and after AlphaFold2: An overview of protein structure prediction.

**Letícia M F Bertoline et al.** · *Front Bioinform* · 2023 · DOI [10.3389/fbinf.2023.1120370](https://doi.org/10.3389/fbinf.2023.1120370)

> 所属模块：[[notes/class-notes/结构生物学/AI结构预测/01-范式起点-从衍射反演到可微分建模|范式起点：从衍射反演到可微分建模]]
# Before and after AlphaFold2: An overview of protein structure prediction.

**基本信息**：Letícia M F Bertoline, Angélica N Lima, Jose E Krieger, Samantha K Teixeira。《Frontiers in Bioinformatics》(Front Bioinform)，2023 年，卷 3，文章号 1120370。DOI: 10.3389/fbinf.2023.1120370。综述（mini-review）类型，组织方式为按方法类别叙事梳理，正文提及 Fig.1、Fig.2，无表。

## 一句话结论

蛋白质结构预测长期在「基于模板的建模（template-based modeling, TBM）」与「游离建模（free modeling, FM）」两条路线间权衡——前者准但依赖已知模板、无法预测新折叠，后者能探索新折叠但计算昂贵且仅适用于短序列；AlphaFold2 以「多序列比对（MSA）+ 进化、物理、几何约束」训练出的神经网络架构（evoformer + structure module）首次在 CASP14 上全面压倒性胜出（与实验骨架结构 RMSD 0.8 Å，对手 2.8 Å），把该问题带到「部分情形接近实验精度」的新层级，但它仍有固有局限（无序区、环区、单一构象、无配体、点突变效应、无法预测全新结构）；随后出现的基于蛋白质语言模型（protein language model, pLM）的方法（ESMFold、EMBER2/EMBER3D）以牺牲少量精度换取数十倍速度与不依赖 MSA 的能力，部分弥补了 AlphaFold2 的短板。

## 研究问题

综述旨在回答：在 AlphaFold2 出现之前与之后，蛋白质三维结构预测领域经历了怎样的技术路线演进？具体分解为：(1) 传统预测方法如何分类（TBM/FM 二分，以及 ab initio、threading/折叠识别、同源建模三分），各自的原理与局限是什么；(2) AlphaFold（2018）与 AlphaFold2（2020）的算法构成、竞赛表现、数据库建设、应用与局限；(3) AlphaFold2 之后新出现的基于蛋白质语言模型的方法（ESMFold、EMBER2/EMBER3D）在精度、速度、能力边界上与 AlphaFold2 相比处于什么位置，能否弥补其局限。作者明言动机：已知蛋白质序列（UniProtKB 229,580,745 条，2023 年 1 月）与已解析三级结构（PDB 200,988 条）之间存在巨大鸿沟，而实验方法（X 射线晶体学、核磁共振 NMR、冷冻电镜 cryo-EM）复杂、耗时、昂贵且结构常非天然形态。

## 方法与数据

这是一篇叙事性 mini-review，无系统性检索流程或元分析方法；其「方法」是文献综合与按方法类别的归纳，并给出一个时间线分类图。其引用的关键数据来源包括：

- **CASP（Critical Assessment of Structure Prediction，蛋白质结构预测关键评估）** 官方发布的竞赛分数（CASP13、CASP14 的 z-score 汇总，Fig.2 数据注明「Data extracted by CASP official website」）。
- **AlphaFold 蛋白质结构数据库（AlphaFold DB，alphafold.ebi.ac.uk）**：由 DeepMind 与 EMBL-EBI 合作建立，输出 PDB、mmCIF 格式原子坐标与 JSON 格式 PAE（Predicted Aligned Error）。
- **已发表文献的量化结果**：Jumper et al. (2021a/2021b)（AlphaFold2 原始论文）、Senior et al. (2019/2020)（AlphaFold1）、Lin et al. (2022)（ESMFold）、Weissenow et al. (2022a/2022b)（EMBER2/EMBER3D）、Porta-Pardo et al. (2022)（人蛋白质组结构覆盖度统计）等。
- 综述的分类框架：TBM / FM 二分（CASP 官方分类，作者注明「Despite controversial」仍有争议），其下三分——ab initio（FM 类，以热力学最低自由能假说为基础）、threading/折叠识别（TBM 类）、同源建模 homology（TBM 类）；CASP 设有 TBM、FM 及中间类 FM/TBM 三个竞赛类别。

## 关键图表解读

- **Fig.1（正文提及，图像未获取）**：蛋白质结构预测领域主要事件与程序/网络服务器的时间线（timeline），彩色框标注方法或重要事件，并按本综述采用的方法分类（ab initio / threading / homology / 深度学习等）着色。正文说明图意：「Timeline with main events and programs/webserver in the protein structure prediction. Colored boxes indicate the method or important event in the field.」
- **Fig.2（正文提及，图像未获取）**：CASP14 各组别按 sum z-score 排序的前 10 名程序/网络服务器，(A) TBM-easy、(B) TBM-hard、(C) TBM/FM、(D) FM 四个面板。数据取自 CASP 官网。正文以该图佐证「AlphaFold2 在 CASP14 所有类别中的卓越表现」。
- 无表格（提取件头部标注「图 2 表 0」，与正文一致）。

## 主要结果与关键数字

本综述梳理的技术路线分类与判断（均出自原文）：

**传统路线及其局限**
- ab initio（游离建模）：基于「天然结构对应最低自由能」的热力学假说（Anfinsen 原则的表述为原文所引），优点是可得到新的未知折叠；缺点是构象空间巨大、计算昂贵，限制于短序列。代表：QUARK（Xu and Zhang, 2012）——把序列切成 20 个氨基酸的片段、在数据库中搜结构，再用副本交换蒙特卡洛（replica-exchange Monte Carlo）模拟按力场与能量项拼接。
- threading/折叠识别：基于「结构比序列更保守、自然界折叠种类有限」；用打分函数（成对势、二级结构比较、溶剂性质）选最优模板。代表：GenTHREADER（Jones, 1999），用序列谱方法比对后用神经网络给置信度。
- 同源建模：高度相似的序列具有相似结构；流程为比对已知结构序列→建模板骨架→建模环区与侧链→能量最小化→Ramachandran 图评估。通常精度高于其他方法，但依赖模板、无法预测新蛋白。代表：SWISS-MODEL（Guex et al., 2009; Kiefer et al., 2009），首个全自动同源建模网络服务器，基于 PERL 框架，对非生信用户友好，提供 PFAM 结构域注释等。

**AlphaFold 与 AlphaFold2**
- AlphaFold（DeepMind，2018，CASP13）：FM（best-of-five）sum z-score 52.8 对第二名 36.6；FM 与 FM/TBM 合计 68.3 对 48.2；未用模板在 TBM 类也表现良好。算法：卷积神经网络（CNN）由 PDB 结构训练、从 MSA 特征预测残基间距离（distogram），另一输出预测骨架扭转角分布，两部分势能合起来用梯度下降优化出结构。
- AlphaFold2（CASP14，2020 年 5–7 月）：预测结构与实验骨架 RMSD 0.8 Å，对次优方法的 2.8 Å；sum z-score 244.0 对 90.8。核心创新为两个神经网络模块：evoformer（两个 transformer 分别处理 MSA 与「对表示 pair representation」，二者间有通信通道，MSA 注意力机制以对表示作偏置项定位相互作用的残基对；对表示 transformer 还含残基三角形注意力）与 structure module（在约束框架内定位骨架取向与各残基侧链，随后局部精修并梯度下降最小化）。MSA 构建、模板利用并非新意，真正的突破在于网络架构。
- 复合物：AlphaFold2 用柔性连接子/人工缺口预测蛋白-蛋白相互作用，一般能准确预测异源二聚体复合物、超过传统对接方法，但抗原-抗体结合预测受限、跨物种复合物预测受限；2021 年 10 月 DeepMind 推出 AlphaFold-Multimer（用蛋白复合物训练），同聚体界面表现优于异聚体，仍不能预测抗原-抗体结合。两者代码开源（github.com/deepmind/alphafold）。
- AlphaFold DB：最初上线超过 360,000 个预测结构、覆盖 21 个物种蛋白质组；成文时已超过 2 亿条目，覆盖人类及另外 47 个物种蛋白质组。Porta-Pardo et al. (2022)：AlphaFold2 把人蛋白残基的结构覆盖度从 48% 提升到 76%，无任何结构覆盖的人蛋白数从 5027 降到 29；此前 5027 个无结构蛋白中，4459 个（88.7%）获得超过全长 50% 的预测，其中 1408 个（28%）为高精度。数据库排除含非标准氨基酸（如硒代半胱氨酸）的序列及同一基因的多种异构体；输出含 PDB/mmCIF 坐标与 JSON 格式 PAE，并提供「Looks great / Could be improved」反馈按钮。
- 应用实例：Noone et al. (2022) 用 AlphaFold 预测 PTX3 复合物的 N 端区域并经 cryo-EM class averaging 验证，混合结构帮助定位相互作用位点。

**AlphaFold2 的局限（综述归纳为四类）**
1. 无序蛋白/无序区（IDR）与环区：Ruff & Pappu (2021) 显示低精度残基与无序区重叠；Stevens & He (2022) 显示仅 <20 个氨基酸的短环预测精度高，且倾向在环区过度预测二级结构（常为 α 螺旋）。
2. 只预测单一构象（不能区分 apo/holo）：Saldaño et al. (2022) 显示测试集中 67% 的预测类似 holo 形态，apo-holo 构象差异越大越难预测；Azzaz et al. (2022) 显示膜蛋白预测不可靠（跨膜域定位不一致）；另不能预测金属离子、辅因子、配体、DNA/RNA 复合物及翻译后修饰（糖基化、甲基化、磷酸化）。Scardino et al. (2023) 显示 AlphaFold 模型在高通量对接中劣于实验 PDB 结构；Wong et al. (2022) 显示其在反向对接中表现弱。
3. 无法预测点突变导致的折叠缺陷：Buel & Walters (2022) 显示突变型与野生型预测骨架 RMSD <1 Å；Pak et al. (2021) 显示 pLDDT 与突变对稳定性影响（ΔΔG）无相关性、与侧链大小变化亦无相关性。
4. 无法预测全新结构（算法基于 MSA、依赖已知结构库）；且 MSA 构建的计算与存储需求大、随序列长度增长耗时。缓解方案：ColabFold 用 MMseqs2 替换同源搜索（Mirdita et al., 2022）降低计算需求。

**蛋白质语言模型路线**
- 三类语言模型范式：自回归（autoregressive）、双向（bidirectional）、掩码（masked）。氨基酸对应 NLP 中的词/token，蛋白质对应句子。
- ESMFold（Lin et al., 2022）：掩码 transformer pLM，150 亿参数。带 MSA 比较时 TM-score 0.68 对 AlphaFold2 的 0.85（CASP14）；但 AlphaFold2 去掉 MSA、只用序列时仅 0.37，ESMFold 仍为 0.68。对高置信度预测，中位全原子 RMSD 1.91 Å、骨架 RMSD 1.33 Å，接近实验级精度。由此构建 ESM Metagenomic Atlas：从宏基因组数据库预测 617M+ 结构，其中 225M 为高置信度、含全新结构。
- EMBER2（Weissenow et al., 2022a）：用预训练 pLM 的嵌入（embeddings）及其注意力头替代 MSA，预测残基间距离（2D）；嵌入 trRosetta 做 3D 预测时 TM-score 0.5 对 ColabFold 的 0.79，但比 ColabFold 快约 35 倍。作者承认该比较「不公平」（EMBER2 做 2D 预测，AlphaFold 做 3D）。后继方法 EMBER3D（Weissenow et al., 2022b）直接做 3D 预测，仍未超过 AlphaFold，但比 AlphaFold 与 ESMFold 都快；其预测距离图差异与深度突变扫描（deep mutational scanning）的天然/突变 3D 结构相关性好于 ESMFold，并开发了展示每个位点所有可能氨基酸替换所致结构差异的工具。
- 总体判断：pLM 路线以速度与低算力换取精度，可发现新蛋白、新功能与新物种（含病原微生物与病毒、降解污染物与生产用的转基因微生物等），但成文时精度仍未超过 AlphaFold2；作者预期通过引入生物学知识与多任务学习（multi-task learning）可继续提升。

## 对照与消融

综述本身无消融实验，但它报告了领域内多组关键对照（以下均为原文转述，非本综述新增数据）：
- AlphaFold2 vs CASP14 次优：RMSD 0.8 vs 2.8 Å；sum z-score 244.0 vs 90.8。
- AlphaFold vs CASP13 第二名：FM 52.8 vs 36.6；FM+FM/TBM 68.3 vs 48.2。
- ESMFold vs AlphaFold2：有 MSA 0.68 vs 0.85（TM-score）；无 MSA 0.68 vs 0.37——即「MSA 依赖」这一对照揭示了 pLM 路线的相对优势所在。
- EMBER2(+trRosetta) vs ColabFold：TM-score 0.5 vs 0.79，但速度快约 35 倍（注意原文指出该比较不公平：2D vs 3D）。
- EMBER3D vs AlphaFold2：精度不及、速度远超；vs ESMFold：突变距离图相关性更好。
- AlphaFold-Multimer：同聚体界面优于异聚体；不能预测抗原-抗体结合。
- AlphaFold 模型 vs 实验结构：高通量对接（Scardino et al., 2023）与反向对接（Wong et al., 2022）中 AlphaFold 模型均更弱。
- 覆盖度对照：人蛋白残基结构覆盖度 48% → 76%；无覆盖蛋白 5027 → 29。

## 作者自述的局限

作者（综述层面）明确承认的局限主要有：
- 本文为 mini-review，只提供概览，更全面的评述指向 Paiva et al. (2022)、Bongirwar and Mokhade (2022) 等。
- 对 TBM/FM 分类法注明「Despite controversial, this classification corresponds to the categories from CASP」（虽存争议，但与 CASP 分类对应），表明分类框架本身不是无争议的。
- 综述核心判断「pLM 方法目前精度未超 AlphaFold2、但有望随深度学习与多任务学习改进」是展望性陈述，作者以「promise / It is expected」表述，属预期而非既有事实。
- 写作时点（2023 年）决定了其未覆盖 AlphaFold2 之后新格局（该条为数据集编制者标注的 caveat，原文自身未述及 AlphaFold3 等后续工作）。

## 我的评价

- 优点：作为入门级综述，三条线（传统方法→AlphaFold 系列→pLM 方法）梳理清晰，把「TBM 覆盖度 vs FM 构象搜索」的长期权衡讲透了；关键数字（CASP13/14 分数、ESMFold 的 0.37 vs 0.68 对照、覆盖度 48%→76%）选取得当，是理解领域转折点的好抓手。
- 追问：其一，综述反复强调 AlphaFold2「无法预测全新结构」，但这一判断与 ESMFold「能预测全新折叠」的区分度在原文中只由「不依赖 MSA」间接支撑，未给出新折叠的判据或基准（如对训练集外折叠的测试），读者难以判断「novel structure」两种语境下含义是否一致。其二，「AlphaFold 模型在对接中弱于实验结构」引的是 2022–2023 年工作，且原文未区分是全局精度问题还是侧链/配体口袋局部问题，直接用于否定其在药物发现中的用途需要谨慎。其三，综述对 pLDDT 局限（Pak et al., 2021 指出其与 ΔΔG 无相关性）的引用与「数据库反馈按钮」形成有趣张力：普通用户凭单一置信度指标难以评估模型可否用于突变研究。
- 价值：适合作为《结构生物学》课程中「计算结构预测简史」的导读材料；配 Fig.1 时间线可快速建立方法谱系。

## 可复现要点

- 全文开放获取：PMC10011655（DOI: 10.3389/fbinf.2023.1120370）；提取件仅含正文，Fig.1、Fig.2 图像未获取，参考文献表未获取。
- 数据可查：CASP13/14 官方成绩（Fig.2 注明取自 CASP 官网）；AlphaFold DB（https://alphafold.ebi.ac.uk）可验证 2 亿条目及 PDB/mmCIF/PAE 输出；开源代码 https://github.com/deepmind/alphafold（AlphaFold2 与 AlphaFold-Multimer）。
- 关键原始文献锚点（本综述引用的量化来源）：Jumper et al., 2021a/2021b；Senior et al., 2019（CASP13 成绩）；Lin et al., 2022（ESMFold/ESM Atlas）；Weissenow et al., 2022a/2022b（EMBER2/EMBER3D）；Mirdita et al., 2022（ColabFold/MMseqs2）；Porta-Pardo et al., 2022（人蛋白组覆盖度）；Varadi et al., 2022（AlphaFold DB 数据规范与排除标准）。
- 主要可转述数字（须对照原文核验）：PDB 200,988 条 vs UniProtKB 229,580,745 条（2023-01）；CASP14 RMSD 0.8 vs 2.8 Å、z-score 244.0 vs 90.8；ESMFold 15B 参数、TM 0.68、中位全原子 RMSD 1.91 Å、骨架 1.33 Å、617M/225M 结构；EMBER2 0.5 vs 0.79、约 35 倍加速；短环 <20 aa；67% holo；突变 RMSD <1 Å。

## 术语

- TBM（template-based modeling）：基于模板的建模
- FM（free modeling）：游离建模；CASP 另设中间类 FM/TBM
- ab initio：从头建模（本综述特指不依赖模板、以热力学原理为基础的 FM 方法）
- threading/fold recognition：穿线法/折叠识别
- homology modeling：同源建模
- CASP：Critical Assessment of Structure Prediction，蛋白质结构预测关键评估（两年一届）
- MSA（multiple sequence alignment）：多序列比对
- distogram：距离分布图（AlphaFold1 由 CNN 预测残基间距离的表示）
- evoformer / structure module：AlphaFold2 的两个核心网络模块
- pair representation：对表示（由模板构建的初始表示）
- transformer / attention：Transformer 网络与注意力机制
- pLDDT：预测的局部距离差异测试分数（AlphaFold 每残基置信度指标）
- PAE（Predicted Aligned Error）：预测对齐误差
- RMSD（root-mean-square deviation）：均方根偏差；TM-score：模板建模分数
- IDR（intrinsically disordered protein/region）：内在无序蛋白/区域
- cryo-EM：冷冻电子显微镜；NMR：核磁共振
- pLM（protein language model）：蛋白质语言模型；NLP（natural language processing）：自然语言处理
- autoregressive / bidirectional / masked：语言模型三类范式（自回归/双向/掩码）
- embeddings：嵌入（EMBER2 用预训练 pLM 的嵌入替代 MSA）
- replica-exchange Monte Carlo：副本交换蒙特卡洛（QUARK 的片段拼接采样）
- Ramachandran plot：拉氏图（同源建模后评估二面角合理性）
- ΔΔG：突变引起的折叠稳定性自由能变化；deep mutational scanning：深度突变扫描
- mmCIF / PDB：结构坐标文件格式；PFAM：蛋白结构域注释数据库

---

**导航**

- 模块笔记：[[notes/class-notes/结构生物学/AI结构预测/精读/_index|精读总索引]]
- 上一篇：[[notes/class-notes/结构生物学/AI结构预测/精读/04 Kathryn Tunyasuvunakool 2021]]

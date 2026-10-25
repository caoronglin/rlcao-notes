---
title: Mihaly Varadi 2024｜AlphaFold Protein Structure Database in 2024: providing structure coverage for over 214 million protein sequences.
date: 2026-10-08
tags: [课程, 结构生物学, 文献精读, 基础设施]
status: primary
类型: 精读笔记
来源: Mihaly Varadi et al. *Nucleic Acids Res* 2024，DOI [10.1093/nar/gkad1011](https://doi.org/10.1093/nar/gkad1011)
模块: 基础设施：预测结构成为公共数据
主键: 37933859
---

# AlphaFold Protein Structure Database in 2024: providing structure coverage for over 214 million protein sequences.

**Mihaly Varadi et al.** · *Nucleic Acids Res* · 2024 · DOI [10.1093/nar/gkad1011](https://doi.org/10.1093/nar/gkad1011)

> 所属模块：[[notes/class-notes/结构生物学/AI结构预测/02-基础设施-预测结构成为公共数据|基础设施：预测结构成为公共数据]]
> 元数据：Mihaly Varadi 等 23 位作者（EMBL-EBI 与 Google DeepMind 合作项目）。Nucleic Acids Research, 2024; 52(D1): D368–D375。DOI: 10.1093/nar/gkad1011。

## 一句话结论
AlphaFold 蛋白质结构数据库（AlphaFold Protein Structure Database, AlphaFold DB）自 2021 年 7 月首发以来，归档的预测结构从最初约 30 万条增长到截至 2023 年 9 月超过 2.14 亿条，并已被整合进 PDB、UniProt、Ensembl、InterPro、MobiDB 等核心数据资源；本文作为数据库年度通报，系统说明了其数据归档的历次发布、四种数据访问渠道（FTP、Google Cloud、API、网页）以及搜索与可视化界面（BLAST 序列搜索、Foldseek 结构聚类、PAE 查看器、Mol* 定制）的更新内容。

## 研究问题
本文是数据库资源更新通报，不提出新的科学假说。它首先回应一个针对"预测结构数据库"存在必要性的质疑：既然新一代预测软件（AlphaFold、RoseTTAFold、OpenFold）已开源可用，研究者可以直接对自己感兴趣的蛋白运行预测，为什么还需要集中归档预测结构的数据库？作者的论证有四点：（1）不熟悉科学软件的研究者使用本地预测工具存在显著门槛；（2）大规模比较/功能分析需要预测海量蛋白，本地运行计算昂贵且高度冗余，带来可观碳足迹；（3）即使是单条蛋白预测，查表获取预生成结构只需数秒，而本地计算可能需数小时；（4）没有预生成结构，预测结果便无法被整合进 UniProt、InterPro、Ensembl、PDBe-KB 等核心数据资源。在此基础上，论文的主题是汇报 AlphaFold DB 自 2021 年 7 月首发以来在数据覆盖、元数据与置信度指标格式、访问渠道和网站功能四方面的更新，并展望未来方向。

## 方法与数据
- 数据生成：全部预测由 Google DeepMind 完成并存储为 PDB、mmCIF 与 binaryCIF 格式，配套 JSON 元数据；mmCIF 文件遵循 modelCIF 格式。
- 置信度指标：pLDDT 是 AlphaFold 对每残基 lDDT-Cα 分数的预测值（0–100），存于 PDB 文件的 B-factor 字段与 mmCIF 的 '_ma_qa_metric_local' 类别；另产出 PAE（预测对齐误差），描述残基对相对位置的预测误差，原始数据以 JSON 提供。
- 归档时间线：2021 年 7 月首发（超过 360,000 条结构，覆盖 20 个模式生物蛋白质组，序列来自 UniProt release 2021_02 的 "one sequence per gene" 参考蛋白质组）；2021 年 12 月纳入 Swiss-Prot（UniProt release 2021_04）；2022 年 1 月新增全球健康相关蛋白质组（WHO 优先列表）；2022 年 7 月纳入 UniProt release 2021_04 的其余大部分序列并增加含 MANE Select 预测的 TAR 包；2022 年 11 月修复数值 bug。
- 基础设施：EMBL-EBI FTP 存档 TAR 文件；完整数据集存于 Google Cloud Platform（GCP）并通过文件访问 API 提供；元数据用 Apache-Solr 索引驱动搜索 API。
- 搜索与可视化：基于 BLAST 的序列相似性搜索（经 BioSolr 插件的 XJoin 功能集成）；Foldseek Cluster 结构相似性聚类；交互式 PAE 二维热图；Mol* 三维分子查看器。

## 关键图表解读
全文提取头部注明共 7 幅图、0 张正文表；PMC 文本提取未保留图像，以下均为正文提及的图及图注内容，标注"图像未获取"。
- Fig.1（图像未获取）：数据库扩张总览。图注 "The expansion of AlphaFold DB"：数据库经连续发布扩张，截至 2023 年 9 月归档超过 2.14 亿条预测结构；正文对应句为结构数从约 300k 增至超过 214 million。
- Fig.2（图像未获取）：改进后的搜索结果界面。图注 "Improve search results UI"：新增基于序列状态的过滤选项（Swiss-Prot 已审校 / TrEMBL 未审校、是否属于 UniProt 参考蛋白质组），并提供热门物种（Human、Mouse、Escherichia coli 等）快捷列表。
- Fig.3（图像未获取）：序列相似性搜索结果页。图注 "Sequence similarity search results"：列出与用户序列相似且已有预测结构的蛋白，支持排序与过滤。
- Fig.4（图像未获取）：结构相似性聚类成员列表。图注 "Structure similarity cluster members"：利用 AFDB Clusters 数据，在预测条目页展示与目标蛋白属于同一结构相似性聚类的其他预测。
- Fig.5（图像未获取）：改进的 PAE 查看器。图注 "Improved support for highlighting non-consecutive regions"：新版交互式 PAE 查看器更易区分高亮的非连续区域，示例条目为 https://alphafold.ebi.ac.uk/entry/Q7RTU9；在热图非对角区选中区域时，3D 视图会同步高亮对应区域。
- Fig.6（图像未获取）：Mol* 定制功能。图注 "Improved customisation in Mol*"：用户可选定单个原子、残基和整条链，支持测量残基对距离、更改渲染样式等操作。
- 注：提取头部称全文共 7 幅图，但正文仅提及 Fig.1–Fig.6，第 7 幅图在正文中无引用，其内容未获取；另正文提及 Supplementary Table S1（48 个生物的 FTP TAR 文件列表），未随文本提取。

## 主要结果与关键数字
- 2023 年 9 月：归档超过 214 million（2.14 亿）条预测结构；摘要称较 2021 年初版实现约 500 倍规模扩张。
- 2021 年 7 月首发：超过 360,000 条结构、20 个模式生物（Introduction 一节写作 approximately 300k，两处口径不一致）。
- FTP 区域托管 48 个生物的蛋白质组 TAR 文件（含模式生物与 WHO 关注的病原体）。
- Google Cloud 完整数据集约 23 TiB，CC-BY-4.0 许可，桶地址 gs://public-datasets-deepmind-alphafold-v4；1 Gbps 连接下载约需 2.5 天，下载需 Google 账号。
- 2022 年 11 月更新修复 2022 年 7 月版本中的临时数值 bug，约 4% 的预测受影响（低准确度、低 pLDDT）；受影响结构坐标被更新，旧坐标文件保留为 v3 文件。
- 覆盖排除条件（作者声明"仍在讨论中"）：长度 <16 个氨基酸；Swiss-Prot/蛋白质组序列 >2700 或其余 UniProt 序列 >1280；含非标准氨基酸；不在 UniProt "one sequence per gene" FASTA 文件中；病毒蛋白。
- 结构聚类流水线：MMseqs2 先对 AlphaFold DB 的 214 million 条 UniProtKB 序列聚类得到 52 million 个序列簇（每簇以 pLDDT 峰值蛋白为代表），Foldseek 再做结构聚类得到 18.8 million 个结构簇，剔除片段后最终保留 2.30 million 个稳健簇（每簇至少含一对结构）；提供 AFDB/Foldseek 与 AFDB50/MMseqs 两类聚类结果，均可经公共 API 访问。
- 预测流程差异：UniProt 序列为单模型运行输出；Swiss-Prot/蛋白质组条目为 5 个不同随机种子模型中最自信（最高置信）的预测。
- PAE JSON 于 2022 年改为更紧凑格式：以 'predicted_aligned_error' 字段取代旧的一维 'distances' 字段，并新增 'max_predicted_aligned_error' 字段。

## 对照与消融
本文为数据库资源通报，不含实验对照或消融研究。文内可视为"版本对照/口径对比"的内容仅有三处：（1）pLDDT 四档判读标准（>90 高准确度，可用于结合位点刻画等；70–90 骨架可靠；50–70 低置信需谨慎使用；<50 常呈"意大利面"状外观、提示可能为无序区）；（2）两类条目的预测流程对比——Swiss-Prot/蛋白质组用 5 模型随机种子取最优 vs. 其余 UniProt 序列单模型输出；（3）PAE JSON 新旧格式对比（'distances' 一维字段 → 'predicted_aligned_error' + 'max_predicted_aligned_error'）。另可视为"纠错对照"的是 2022 年 11 月对 2022 年 7 月版本数值 bug 的修复（约 4% 结构受影响，旧文件以 v3 版本号保留）。

## 作者自述的局限
- AlphaFold DB 数据发布频率低于 UniProt，部分序列可能较 UniProt 过时。
- 五类序列未覆盖（<16 aa、超长、非标准氨基酸、不在 "one sequence per gene"、病毒蛋白），作者明确表示这些限制"仍在讨论中"。
- 数据访问的缺口：EMBL-EBI 公共 FTP 不提供 PAE 数据（PAE 仅能从完整数据集的渠道获取）。
- 数据表示与功能仍存在"可辨识的差距"：异构体（isoforms）结构、多聚体预测的目标数据集尚未提供；结构域注释、AlphaFill 小分子整合、交联数据引用、片段专属页面均列为未来工作。
- 使用门槛：数百万预测结构对不熟悉大分子结构数据的研究者构成障碍，且用户可能不了解预测结构的优势与固有局限，因此作者计划建设培训平台。
- 完整数据集下载需 Google 账号，且 23 TiB 全量下载对普通用户不现实（作者建议只下载所需子集）。

## 我的评价
- 定位：这是 NAR 数据库年更通报的典型样本，科学新意有限，但对《结构生物学》课程的价值在于完整展示 AlphaFold 生态的"数据基础设施层"——预测 → 归档 → 分发 → 集成进 PDB/UniProt/Ensembl/InterPro，是理解"AI 模型如何变成公共资源"的最佳教材案例。
- 可追问的内部一致性问题：初版结构数在 Introduction 写 approximately 300k、在 Data archiving 写 over 360 000，摘要称"500 倍扩张"，但 214M/360k≈594 倍，三种口径互不对齐，说明此类通报论文对数字口径的管理较松，读者引用时需谨慎。
- 值得注意的政策选择：病毒蛋白被整体排除在覆盖之外，而病毒蛋白恰是实验结构稀缺、功能研究需求大的类别，作者未给原因，仅说"在讨论中"；这提示数据库的覆盖边界同时受技术（长度、非标准氨基酸）与策略（是否纳入某类序列）两种因素决定。
- 信息缺口：全文无任何使用量、下载量或引用统计，无法评估该资源被利用的实际规模；对"预测模型放大自身系统性偏差"这一风险（见数据集编目中的 caveat）正文仅间接涉及（提示用户谨慎解读 pLDDT），未做量化讨论。
- 作为资源论文，本文无统计检验与方法学对照，"对照与消融"一节只能从版本更迭角度近似处理，评估标准应区别于研究型论文。

## 可复现要点
- FTP：http://ftp.ebi.ac.uk/pub/databases/alphafold/，最新版在 /latest/ 子目录；含 README.txt、全量 FASTA 序列、UniProt 登录号 CSV 与 CHANGELOG；注意该渠道不含 PAE 数据。
- 全量数据：gs://public-datasets-deepmind-alphafold-v4（约 23 TiB，CC-BY-4.0），需 Google 账号。
- API：所有端点以 UniProt 登录号为键，交互式文档 https://www.alphafold.ebi.ac.uk/api-docs。
- 版本记录：https://ftp.ebi.ac.uk/pub/databases/alphafold/CHANGELOG.txt。
- 示例条目：https://alphafold.ebi.ac.uk/entry/Q7RTU9；用户反馈邮箱 afdbhelp@ebi.ac.uk。
- 数据格式要点：mmCIF 遵循 modelCIF；pLDDT 位于 PDB 文件 B-factor 字段、mmCIF '_ma_qa_metric_local' 类别；PAE JSON 含 predicted_aligned_error 与 max_predicted_aligned_error 两个字段。

## 术语
- AlphaFold DB（AlphaFold 蛋白质结构数据库）；PDB（Protein Data Bank，蛋白质数据库）；UniProt（通用蛋白质资源库）。
- pLDDT（per-residue confidence score，0–100，AlphaFold 对 lDDT-Cα 指标的预测分数）；lDDT-Cα（局部距离差异检验，基于 Cα 的结构相似度度量）；PAE（Predicted Aligned Error，预测对齐误差，衡量残基对相对位置的置信度，用于判断结构域相对取向）。
- mmCIF / binaryCIF（大分子晶体学信息文件及其二进制形式）；modelCIF（预测模型的 CIF 扩展格式）。
- Swiss-Prot（人工审校序列）与 TrEMBL（自动注释未审校序列）；reference proteome（参考蛋白质组）；one sequence per gene（每基因一条序列）；MANE Select（NCBI 与 EBI 联合的匹配注释转录本选集）。
- BLAST（基础局部比对搜索工具）；BioSolr / XJoin（基于 Solr 的生物检索插件及其连接功能）；Foldseek（快速结构比对工具）；MMseqs2（快速序列聚类工具）；Mol*（分子三维查看器）；PDBe-KB（PDBe 知识库）；AlphaFill（将小分子移植到预测结构的工具）；CC-BY-4.0（知识共享署名许可）。

---

**导航**

- 模块笔记：[[notes/class-notes/结构生物学/AI结构预测/精读/_index|精读总索引]]
- 上一篇：[[notes/class-notes/结构生物学/AI结构预测/精读/02 Michel van Kempen 2024]]

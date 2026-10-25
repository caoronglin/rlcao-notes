---
title: Mihaly Varadi 2022｜AlphaFold Protein Structure Database: massively expanding the structural coverage of protein-sequence space with high-accuracy models.
date: 2026-10-08
tags: [课程, 结构生物学, 文献精读, 基础设施]
status: primary
类型: 精读笔记
来源: Mihaly Varadi et al. *Nucleic Acids Res* 2022，DOI [10.1093/nar/gkab1061](https://doi.org/10.1093/nar/gkab1061)
模块: 基础设施：预测结构成为公共数据
主键: 34791371
---

# AlphaFold Protein Structure Database: massively expanding the structural coverage of protein-sequence space with high-accuracy models.

**Mihaly Varadi et al.** · *Nucleic Acids Res* · 2022 · DOI [10.1093/nar/gkab1061](https://doi.org/10.1093/nar/gkab1061)

> 所属模块：[[notes/class-notes/结构生物学/AI结构预测/02-基础设施-预测结构成为公共数据|基础设施：预测结构成为公共数据]]
# AlphaFold Protein Structure Database: massively expanding the structural coverage of protein-sequence space with high-accuracy models

- 作者：Mihaly Varadi 等（DeepMind 与 EMBL-EBI 合作团队，含 John Jumper、Demis Hassabis、Sameer Velankar 等）
- 期刊：Nucleic Acids Research，2022 年，第 50 卷，D439–D444
- DOI：10.1093/nar/gkab1061

## 一句话结论
DeepMind 与 EMBL-EBI 合作建成开放的 AlphaFold 蛋白质结构数据库（AlphaFold DB，https://alphafold.ebi.ac.uk）：首版收录 21 个模式生物蛋白质组、超过 360,000 个由 AlphaFold v2.0 预测的结构，并为每个模型提供原子坐标、逐残基置信度 pLDDT 与预测对齐误差 PAE，通过 FTP 批量下载、公开 API 和网页交互可视化三种途径开放访问；作者计划数月内将规模扩大到超过 100 万个结构，2022 年再覆盖 UniRef90 的大部分代表序列（引言口径为超过 1.3 亿条代表序列，结论口径为超过 1 亿个结构）。

## 研究问题
- 结构覆盖缺口：UniProt 归档了近 2.2 亿条（almost 220 million）唯一蛋白质序列，而 PDB 仅有 18 万多个（just over 180 000）3D 结构，覆盖 5.5 万多种（over 55 000）不同蛋白质，序列空间的结构覆盖严重不足。
- 实验测结构的瓶颈：获得高分辨率实验结构极其费力，常需大量试错；冷冻电镜与混合/整合方法（I/HM）虽加快了测定节奏，但序列与实验结构之间的缺口仍在持续扩大。
- 本文的解法：用 AI 从氨基酸序列直接大规模预测蛋白质结构来弥合缺口，并把预测结果做成对科研界免费开放、可大规模访问的数据库资源。

## 方法与数据
- 预测引擎：AlphaFold（DeepMind 开发的 AI 系统），2020 年 CASP14 竞赛组织者认定其"解决了蛋白质结构预测问题"。
- 数据范围：首版覆盖人类蛋白质组及 20 个其他模式生物（合计 21 个蛋白质组，见 Table 1），提供超过 360,000 个预测结构；覆盖 UniProt 参考蛋白质组中 16–2700 氨基酸长度的绝大多数序列；排除含非标准氨基酸的序列；暂不提供多同源异构体（isoforms）；对更长的人类蛋白另预测 1400 残基片段。
- 每个预测包含：原子坐标（PDB 与 mmCIF 两种格式）、逐残基置信度 pLDDT（0–100 分，存于 mmCIF/PDB 文件的 B-factor 字段）、PAE（JSON 格式）、元数据（JSON 格式）。
- 归档：元数据用开源搜索平台 Apache Solr 建索引以支撑网页搜索；数据文件版本化，历史快照可经 FTP 获取，网页始终展示最新版。
- 三种访问机制：(i) FTP 批量下载——ftp://ftp.ebi.ac.uk/pub/databases/alphafold，按参考蛋白质组提供压缩 PDB/mmCIF 文件（.gz）打包成的 .tar 归档，并附带一个描述物种学名/俗名、参考蛋白质组标识符、预测结构数与归档大小的 JSON 元文件（下载页 https://alphafold.ebi.ac.uk/download）；(ii) 公开 API——以 UniProt accession 为键，如 https://alphafold.ebi.ac.uk/api/prediction/Q92793 返回人类 CREB 结合蛋白的全部元信息与数据文件 URL；UniProt、Pfam、InterPro 与 PDBe-KB 均调用该 API 展示 AlphaFold 模型；(iii) 蛋白质专属网页——以 UniProt accession 为键，支持按基因名、蛋白名、UniProt accession 或物种名搜索，结果可过滤（如只看人类蛋白）。
- 3D 可视化：集成 3D 分子查看器 Mol*，残基按 pLDDT 置信度分档着色。

## 关键图表解读
- Table 1（表格内容未随 PMC 提取获得）：正文提及，列出首版覆盖的人类及 20 个其他模式生物蛋白质组。
- Fig. 1（图像未获取）：AlphaFold DB 搜索页示意——可按基因/蛋白名、UniProt accession 或物种名检索，结果可过滤，点击蛋白名进入蛋白专属页。
- Fig. 2（图像未获取）：蛋白质专属结构页示意——展示来自 UniProt 与 PDBe 的基础信息（已知生物学功能、交叉引用等），可下载 PDB/mmCIF 模型；Mol* 3D 查看器按 pLDDT 逐残基着色。正文强调：模型置信度沿链可能差异很大，解读结构特征前必须先分析置信度指标；低置信度区段与骨架柔性及内在无序有良好相关。
- Fig. 3（图像未获取）：PAE 二维交互图示意（示例条目 Q93074）——图按逐对 PAE 值着色，深绿色代表高置信。该例中 AlphaFold 对残基 1–500（绿）与 1200–1700（蓝）两个结构域的相互位置置信度高，但与 500–1200 区间（橙）及 C 端的相对位置不可靠；在图内框选区域会同步在 3D 查看器中高亮对应序列片段。
- Table 2：提取文本中未提及（未获取到）。

## 主要结果与关键数字
- 序列—结构缺口：UniProt 约 220,000,000 条唯一蛋白序列 vs PDB 约 180,000 个 3D 结构（覆盖 55,000 余种不同蛋白）。
- 首版 AlphaFold DB：>360,000 个预测结构、21 个模式生物蛋白质组；序列长度范围 16–2700 氨基酸。
- pLDDT 置信度分档：≥90 很高（very high）；70–90 可信（confident）；50–70 低（low）；<50 很低（very low）；很低的 pLDDT 与内在无序（intrinsic disorder）高倾向相关。
- PAE 以 Å 为单位，截断上限 31.75 Å；PAE 不对称，即 PAE(x,y) 与 PAE(y,x) 可以不同。
- 扩展路线：未来数月纳入被忽视疾病相关蛋白质组与 SwissProt 高注释蛋白，总量超过 1,000,000 个结构；随后 2022 年更新覆盖 UniRef90 大部分代表序列（>100,000,000 个结构；引言口径为超过 1.3 亿条簇代表序列）。
- 历史背景：自 20 世纪 50 年代中期以来，实验方法积累的蛋白、核酸与复合物结构超过 180,000 个，统一归档于 wwPDB 管理的 PDB。

## 对照与消融
本文是数据库/资源类论文，没有受控对照实验或消融实验。最接近"对照/验证"的表述有三处：
- 外部基准：CASP14（2020）竞赛以真实实验数据检验预测准确性，组织者据此认定 AlphaFold 解决了蛋白质结构预测问题（正文引用文献 12）。
- 指标对标：pLDDT 采用预测结构领域既有指标 lDDT-Cα；正文解释 lDDT 的设计动机是评估"局部准确性"——多结构域预测中单个结构域可能很准而整体对齐不佳，lDDT 对预测良好的区域仍给高分；pLDDT 继承该性质，应主要用于评估单个结构域内的置信度，并提到其他若干结构预测资源也使用基于 lDDT 的指标（引用 15、16）。
- 相关性陈述：很低的 pLDDT 分值与高内在无序倾向相关（引用 17）；低置信度区段与骨架柔性及内在无序相关（引用 13）。

## 作者自述的局限
提取文本中没有独立的"局限"小节，以下为散布在正文中的自述性提醒：
- 置信度不等于实验验证：模型置信度沿链可能差异很大，解释结构特征前必须先分析 pLDDT/PAE。
- pLDDT 是局部置信度指标，适合评估单个结构域内部；多结构域预测中单个结构域可能基本准确而相对位置不准。
- PAE 高意味着两个结构域的相对位置与取向不可靠，"用户不应赋予其生物学或结构学意义"；PAE 本身不对称（如取向高度不确定的 loop 区）。
- 覆盖限制：排除含非标准氨基酸的序列；长度限于 16–2700；更长的蛋白仅以 1400 残基片段覆盖；暂不提供多同源异构体。
- 版本策略：网页始终显示最新版，历史版本仅经 FTP 获取，网页端不提供旧版浏览。

## 我的评价
- 这是一篇典型的"数据基础设施"论文：贡献不在新算法，而在于把 AlphaFold v2.0 的预测规模化（36 万级→规划 1 亿级）、标准化（坐标+置信度+元数据成套归档）并开放（FTP/API/网页三通道）。用"2.2 亿序列 vs 18 万结构"的缺口作为动机，是全文最有力的一段论证。
- 设计上把置信度指标（pLDDT/PAE）与坐标同等对待、并反复强调"先看置信度再解释结构"，体现出对预测数据被误用的预防意识；pLDDT 四档分界（50/70/90）与 PAE 截断 31.75 Å 是可直接执行的操作约定，后续被社区广泛沿用。
- 可追问之处（仅基于论文文本）：① 正文没有给出这 36 万预测在数据库层面的精度统计，验证只指向 CASP14 与人类蛋白质组分析文献；② "网页永远最新、快照走 FTP"的策略对需要可追溯版本引用的研究是否友好，未展开讨论；③ 提取文本范围内未提及数据许可/再分发条款；④ 1400 残基片段与全长蛋白之间的对应关系、片段边界如何标注未说明。

## 可复现要点
- 入口：https://alphafold.ebi.ac.uk（搜索）；批量下载 ftp://ftp.ebi.ac.uk/pub/databases/alphafold；下载页 https://alphafold.ebi.ac.uk/download。
- API 模板：https://alphafold.ebi.ac.uk/api/prediction/{UniProt accession}；正文示例 Q92793（人类 CREB 结合蛋白）与 Q93074（Fig. 3 PAE 示例）。
- 文件格式：坐标为 PDB 与 mmCIF（.gz 压缩、按参考蛋白质组打包为 .tar）；PAE 与元数据为 JSON；pLDDT 存于 mmCIF/PDB 文件的 B-factor 字段。
- 检索字段：基因名、蛋白名、UniProt accession、物种名；结果可按需过滤。
- 复现 Fig. 3 交互：在 PAE 二维图上框选区域，Mol* 3D 查看器同步高亮对应区段。
- 可直接引用的判别阈值：pLDDT ≥90 / 70–90 / 50–70 / <50 四档；PAE 上限 31.75 Å；低置信区段可视为潜在无序/柔性区。

## 术语
- UniProt（Universal Protein Resource）：通用蛋白质资源库，序列主存档。
- PDB（Protein Data Bank）：实验大分子结构的全球单一存档库。
- wwPDB（worldwide PDB）：管理 PDB 的国际联盟。
- CASP（Critical Assessment of Structure Prediction）：结构预测关键评估，两年一届的竞赛。
- pLDDT（predicted local Distance Difference Test）：预测的逐残基置信度（0–100），对应 lDDT-Cα 的预测分值。
- lDDT（local Distance Difference Test）：评估结构预测局部准确性的既有指标。
- PAE（Predicted Aligned Error）：预测对齐误差，以 Å 计、截断 31.75 Å，不对称。
- UniRef90：UniProt 按 90% 序列同一性聚类的代表序列集。
- SwissProt：UniProt 中经人工注释的高质量蛋白质序列库。
- EMBL-EBI：欧洲分子生物学实验室-欧洲生物信息学研究所。
- mmCIF（macromolecular Crystallographic Information File）：大分子结构文件格式。
- Mol*：集成于网页的 3D 分子查看器。
- Apache Solr：用于元数据索引的开源搜索平台。
- PDBe-KB：PDBe 知识库。
- I/HM（integrative/hybrid methods）：结构测定中的整合/混合方法。
- API（Application Programming Interface）：应用程序接口。

---

**导航**

- 模块笔记：[[notes/class-notes/结构生物学/AI结构预测/精读/_index|精读总索引]]

---
title: Alireza Omidi 2024｜AlphaFold-Multimer accurately captures interactions and dynamics of intrinsically disordered protein regions.
date: 2026-10-08
tags: [课程, 结构生物学, 文献精读, 复合物与多模态]
status: primary
类型: 精读笔记
来源: Alireza Omidi et al. *Proc Natl Acad Sci USA* 2024，DOI [10.1073/pnas.2406407121](https://doi.org/10.1073/pnas.2406407121)
模块: 复合物与多模态：从蛋白到生物分子相互作用
主键: 39446390
---

# AlphaFold-Multimer accurately captures interactions and dynamics of intrinsically disordered protein regions.

**Alireza Omidi et al.** · *Proc Natl Acad Sci USA* · 2024 · DOI [10.1073/pnas.2406407121](https://doi.org/10.1073/pnas.2406407121)

> 所属模块：[[notes/class-notes/结构生物学/AI结构预测/03-复合物与多模态-从蛋白到生物分子相互作用|复合物与多模态：从蛋白到生物分子相互作用]]
# AlphaFold-Multimer accurately captures interactions and dynamics of intrinsically disordered protein regions

- 作者：Alireza Omidi, Mads Harder Møller, Nawar Malhis, Jennifer M Bui, Jörg Gsponer
- 期刊 / 年份：Proc Natl Acad Sci USA（PNAS），2024，卷 121，文章号 e2406407121
- DOI：10.1073/pnas.2406407121
- 摘要要点（取自项目 dataset.json）：文章探讨 AlphaFold-Multimer 能在多大程度上再现内在无序蛋白区（intrinsically disordered protein regions，IDRs）介导的相互作用及其动力学。作者收集覆盖 IDR 多种结合模式的数据集，发现 AlphaFold-Multimer 不仅能以高成功率预测各类 IDR 结合态结构，还可借助其内在打分区分真实/诱饵相互作用、区分可靠/不可靠预测；预测质量在更异质的"模糊"（fuzzy）相互作用类型上下降，可能与界面疏水性较低、无规卷曲（coil）含量较高有关；PAE 与 residue-ipTM 等打分与结合态 IDR 的结构异质性高度相关；全蛋白长度预测也可成功但不如用同源 IDR 片段准确；作者建立 minD 指标以在全长蛋白中定位潜在相互作用位点。
- 说明：PMC 提取的全文仅含 Results、Discussion、Materials and Methods 三部分（正文约 5.1 万字），未见独立的 Introduction 小节；摘要文字取自项目数据集元数据，非 PMC 全文文件内容。

## 一句话结论

AlphaFold-Multimer 能以 ≥76% 的成功率正确预测 IDR 与受体蛋白的复合物结构，其内在打分（Combined score、ipTM、IDR pLDDT、PAE、ripTM）可有效区分真假相互作用、可靠与不可靠预测，并能"感知"模糊复合物中的动态区段；但预测质量随界面疏水性降低与 IDR 无规卷曲含量升高而下降，且对模糊（fuzzy）结合模式的异质性幅度复现不足。

## 研究问题

论文考察 AlphaFold-Multimer v2.2 在内在无序区（IDR）介导的蛋白相互作用上的四个层面的能力：

1. **结构预测**：能否正确预测 IDR 与结构化球状受体（receptor chain）形成的二聚复合物结构？不同 IDR 结合模式（同质结合、多位点结合、模糊动态结合）下成功率与质量如何？
2. **真假判别**：AlphaFold-Multimer 的内在打分（pLDDT、PAE、pTM、ipTM、Combined score）能否将真实相互作用与诱饵（decoy）复合物、低质量与高质量预测区分开？
3. **动力学/异质性感知**：对 NMR 测定的模糊复合物，AlphaFold-Multimer 的多模型输出能否复现结合态 IDR 的结构异质性？其打分是否与 IDR 的动态程度相关？
4. **全长蛋白中的结合区定位**：给全长蛋白（而非 PDB 中的 IDR 片段）配对受体时，预测质量如何？能否用其输出指标（min-iPAE、minD）在全长序列中定位真正起结合作用的 IDR 区段？

论文明确指出的动机背景：此前 AlphaFold-Multimer 在 IDR 相互作用上只被用于"有限的一类"相互作用，即短线性基序（short linear motifs）介导的蛋白–肽相互作用；本文试图把评估扩展到 IDR 结合模式的全谱（从同质结合到模糊复合物的动态相互作用）。

## 方法与数据

**数据集（全部为 IDR 链 + 球状受体链的二聚复合物）**

- **IDRBind（高置信集）**：73 个复合物，来自作者先前精细整理的集合（原文引 ref 32），有实验证据表明一方的相互作用伙伴在孤立状态下无序、结合后折叠（folding upon binding）。该集所有复合物均早于 2018-04-30，即 AlphaFold-Multimer 训练集截止日期，因此其中部分复合物可能已被用于训练，作者由此另建"盲测"（nonseen/blind）数据集。
- **Rg 集（盲测集）**：210 个复合物。构建流程（改造自 ref 33）：利用 IDR 在复合物中常呈伸展构象（相对其序列长度有较大回旋半径 Rg）这一特征。向 RCSB PDB API 请求 2018-04-30 之后发布、分辨率 ≤3.5 Å（或为 NMR 结构）、至少含 2 条链的结构，剔除含 DNA/RNA 的结构及所有链均短于 20 残基的结构，得 43,725 个 PDB ID。随后过滤：IDR 链须满足 Rg/N≥0.26 且长度 >20 残基；球状链须 Rg/N<0.26 且长度 >70 残基；两链须有任意重原子距离在 5 Å 内；IDR 链只允许有一个受体、受体只接触一条 IDR 链；含 2 个及以上二硫键的结构剔除。此时剩 1,329 个相互作用。再用 MMSeqs2 与 2018-04-30 及以前发布的 PDB SEQRES 序列比对（30% 序列相似性、80% 覆盖度），剔除与训练集重叠者，剩 440 个。最后分别对 IDR 序列与受体序列聚类（同样 30%/80% 阈值），每簇取分辨率最好的样本（无分辨率记录则取最新发布者），最终得 210 个复合物。分类器 Rg/N 的标定：作者测试不同标度因子 v，v=1 时 AUC 最高，Rg/N<0.26 给出最高的 Matthew's 相关系数。
- **Rg+ID 集**：取 Rg 集中预测无序度最高的一半，105 个复合物，用于减少假阳性。
- **Fuzzy 集**：37 个复合物，取自 FuzDB（模糊复合物数据库），均为 NMR 测定结构，"模糊性"由 IDR 而非受体的结构可变性定义。筛选条件：结构至少含 2 个模型；IDR 与受体链长度分别 ≥15 和 ≥60 残基；受体各模型相对第一个模型的平均 RMSD 超过 3.5 Å 的相互作用被剔除（FuzDB 共 296 个结构，经过滤得 37 个相互作用）。
- **Bret et al. 集**：42 个蛋白–肽二聚复合物，取自 Bret 等人近期研究（ref 31）的补充数据；原文作者每实验设置生成 25 个预测、用 5 个随机种子，本文只提取第一个种子（iteration = 1）的结果以保证可比性。
- **诱饵集（Decoys）**：73 个。用 UniProt 取 Rg 集中同源 IDR 所在全长序列，以无序预测器划分无序区，用与同源结合 IDR 等长的滑窗切割，凡不含原数据集片段的窗口即作为诱饵片段，与 Rg 集的受体配对投喂 AlphaFold-Multimer。
- **无序度表征**：RIDAO（整合六种无序预测器）与 IUPred3 两种序列预测器用于各数据集片段打分。
- **数据集间特征差异**（正文描述）：Rg 集 IDR 的界面显著大于 Bret et al. 集（无序水平相似）；IDRBind 的预测无序度高于 Rg 与 Bret et al. 集；Fuzzy 集 IDR 界面大小与 IDRBind 相近，但预测无序度显著低于 IDRBind，而由 RMSF 推断的结构异质性显著更高。

**预测流程**

- 使用 ColabFold 的 AlphaFold-Multimer 实现（ColabFold v1.5.2，model_type 设为 alphafold_multimer_v2，即 AlphaFold-Multimer v2.2 权重），其余配置默认：num_recycles=3、num_seeds=1。分数取自 ColabFold 输出的 JSON 文件。
- 片段折叠：从 PDB 提取 SEQRES 记录中受体与 IDR 的序列段进行预测；若有多个实验结构，与最先沉积的模型比较。
- 全长折叠：将 IDR 片段映射回 UniProt 母蛋白，取全长序列与受体（仅受体结构域序列）配对折叠。

**评估指标**

- DockQ：界面质量指标，为 Fnat（正确天然界面接触比例）与两个经反平方标度函数 f(r,d)=1/(1+(r/d)^2)（d1=8.5 Å、d2=1.5 Å）换算的 RMSD 项的平均；计算时先将预测与真值对齐，仅在对齐片段上计算。
- CAPRI 分级：DockQ≥0.8 高质量、≥0.49 中等、≥0.23 可接受、<0.23 错误。
- 内在打分：pLDDT（残基级局部置信度）、PAE（预测对齐误差，PAEi,j 为真值与预测结构对齐于残基 i 时残基 j 的期望距离误差，非对称）、pTM、ipTM（预测除对齐链外其余链的 TM score）、Combined score = 0.8·ipTM + 0.2·pTM（文中另一处写作 0.2·pTM+0.8·ipTM，含义一致），ripTM 为逐残基 ipTM（满足 ipTM = max_j ripTM(j)）。
- min-iPAE：全长蛋白某残基 j 与受体所有残基的 PAE 最小值。
- minD：Distogram head 输出导出的逐残基指标。Distogram head 将对称化的 pair representation 线性投影为 2–22 Å 的 64 个等宽距离箱（真值距离为 Cβ–Cβ，甘氨酸为 Cα）；每对残基期望距离 E[Dij]=Σ p·c（softmax 概率 × 箱中心）；minD(j) 为链 A 残基 j 与所有其他链残基期望距离的最小值。
- NOE 约束违例：取 PDB 的 NMR 约束文件，用 PdbStat 分析；对 AlphaFold-Multimer 结构先用 "hydride" 库加氢（因模型不输出氢原子）。
- 动力学指标：RMSF（两种叠加策略——全结构对齐第一个 NMR 模型，或仅受体对齐第一个模型再算 IDR 的 RMSF）与距离变异 DV（各模型中 Cα–Cα 距离的标准差，单位 Å）。
- 疏水性：Kyte–Doolittle 标度，界面疏水性为界面区氨基酸疏水性平均值。
- 峰分析：minD 归一化 minDnorm(j)=1−(minD(j)−2)/20，用 scipy.signal.find_peaks 找峰（prominence=0.02、distance=30，即 30 残基窗口内至多一个峰）。
- 统计检验：双侧 Mann–Whitney U 检验（statannotations 实现）。
- 软件：BioPython、NumPy、SciPy、pandas、Matplotlib、seaborn、PyMOL；minD 计算代码公开于 https://github.com/alirezaomidi/AFM-IDR（原文标为 ref 65）。
- 数据与预测结果提供于 Dataset S1（Rg）、S2（IDRBind）、S3（Fuzzy）。

## 关键图表解读

正文共 4 张主图（Figure 1–4），均给出图注但图像未随 PMC 提取（正文提及 Fig.N，图像未获取）；另有 11 张 SI Appendix 图（Fig. S1–S11）被正文引用。

- **Fig. 1（AlphaFold-Multimer performance in predicting IDR binding modes and structures；图像未获取）**：
  - (A) 各数据集按 CAPRI 分级着色的成功率比较柱状图（颜色越深质量越高）：每数据集正确结构比例 >76%，与 Bret et al. 集相当；但 Rg/Rg+ID 集约 25% 为高质量，Fuzzy 集仅约 3%。
  - (B) 各数据集 top-1 预测 DockQ 分布箱线图：Rg/Rg+ID 中位 DockQ 接近 0.65；IDRBind 与 Fuzzy 显著更低（P=2.6×10⁻²、1.8×10⁻⁴）。
  - (C) 各数据集 Combined score 分布箱线图，灰色为诱饵集；0.5 阈值（水平虚线）最能区分诱饵与真实 IDR 复合物——大多数真实复合物 Combined score 高于 0.5，诱饵低于。
  - (D) 内在打分的二分类能力汇总（颜色编码的 AUROC 表 + 括号内给出 TPR−FPR 差最大的阈值）：诱饵 vs 真实相互作用、诱饵 vs Fuzzy 复合物、Fuzzy vs Rg 三类任务。第一列中 IDR pLDDT 表现最佳（AUROC=0.91，阈值 42.9）；第二列同样 IDR pLDDT 最佳（AUROC=0.91，阈值 42.4）；第三列 pTM 可区分模糊与同质结合（AUROC=0.71，阈值 0.8）。
- **Fig. 2（AlphaFold-Multimer's accuracy in predicting structural ensembles；图像未获取）**：
  - (A)(B) 一个模糊复合物实例（FuzDB: FC00165，PDB: 2LQI）：NMR 模型青色、模糊部分黄色高亮、受体以表面显示；按 ripTM 着色 IDR 链（红低蓝高），被注释为 fuzzy 的螺旋与 coil 区含大量低 ripTM 残基。图注强调：结构可变性不一定反映动力学，也可能是不确定性。
  - (C) NOE 距离违例分析：上图为违例数目（沉积 NMR 模型中位违例数略低于 AlphaFold-Multimer 预测）；下图为 RMS 违例（Å）：AlphaFold-Multimer 预测在两个数据集的中位 NOE RMS 违例约 1.5 Å，而 NMR 模型在 Fuzzy 与 IDRBind 集分别为 0.2 Å 和 0.3 Å；两数据集中均有若干复合物的违例水平二者相当。
  - (D) 预测结构与 NMR 模型结构异质性的相关性：上图，IDR 链内距离变异（DV）与 AF 预测 DV（AFDV）及 PAE 的 Spearman 相关系数——IDR 链内 DV 相关性高达 0.84，链间 DV 相关性低得多；下图，NMR 模型 RMSF 与 AF 预测 RMSF、pLDDT、ripTM 的相关性——IDR RMSF 相关性低，而 ripTM 与 PAE 与 RMSF/DV 高度相关（即高 RMSF/DV 的 IDR 区段被赋予低 ripTM、高 PAE）。
  - (E) 各数据集在 pTM–ipTM 空间中的投影（中位数与第一、三分位数）：模糊复合物 pTM 低于其他数据集；ipTM 维度上诱饵远低于真实相互作用。
- **Fig. 3（Determinants of AlphaFold-Multimer's accuracy；图像未获取）**：
  - (A–C) 按界面埋藏面积、界面疏水性、结合后 IDR 无规卷曲含量分箱（全部样本均分为 3 个等量箱）的 DockQ 箱线图：
    - (A) 小界面 DockQ 显著更低（P=9.6×10⁻⁸）；
    - (B) 高/中疏水性界面预测质量高于低疏水性（P=8.5×10⁻¹⁵、3.6×10⁻⁸）；
    - (C) 低 coil 含量 IDR 显著优于中/高 coil 含量（P=4.9×10⁻⁹、7.3×10⁻⁴³）。
  - (D–F) 各数据集在同样三个特征上的分布箱线图：界面大小分布上 Fuzzy、IDRBind、Bret 集相似（故界面大小不是数据集间质量差异的主因）；疏水性大致沿 Fuzzy→Bret 方向递增；Fuzzy 与 IDRBind 的 IDR coil 含量为所有数据集最高。
  - 显著性标注约定：**** P≤0.0001，*** P≤0.001，** P≤0.01，* P≤0.05。
- **Fig. 4（AlphaFold-Multimer's ability to identify interacting IDRs within a full-length protein；图像未获取）**：
  - (A) 片段 vs 全长条件下的 DockQ 分布箱线图（Rg、Rg+ID、Bret et al. 三集）：用全长时 DockQ 明显下降，Bret et al. 集下降尤为显著。
  - (B) 片段 vs 全长的 CAPRI 成功率比较。
  - (C)(D) 全长蛋白中结合 IDR 识别的 ROC 与 precision–recall（PR）曲线：minD、min-iPAE、pLDDT 分别实线、虚线、点线。Rg 集上 min-iPAE 的 AUROC=0.91、AP=0.5；minD 的 AUROC=0.94 与 0.92，AP=0.61 与 0.59（对应两个 Rg 类数据集）。
  - (E) 归一化 minD 峰分析：x 轴为按高度排序的峰排名（第 1 至第 N 峰），y 轴为前 N 峰中任一峰落在真实结合 IDR 上的样本累计比例——Rg、Rg+ID、Bret et al. 三个数据集中分别有 95%、93%、84% 的样本其前 5 峰之一落在真实结合区；Rg 集顶峰值定位正确结合区的比例达 77%，而同一集上只有 65.3% 的样本同时生成了正确结构。
- **SI Appendix 图（正文引用）**：Fig. S1A（IDRBind 早于训练截止日期的问题与盲测集构建示意）、S1B（界面大小比较）、S1C（预测无序度比较）、S1D（Fuzzy 集 RMSF 异质性）；S2（与所有 NMR 模型互比后成功率无剧烈变化）；S3（Combined score 与 DockQ 的相关性，Fuzzy 集相关较弱）；S4（各内在打分的 AUROC）；S5（不准确 vs 准确预测的分类，Combined score 最佳，AUROC=0.81、阈值 0.62）；S6；S7（AF 预测波动幅度小于 PDB 模型）；S8（模糊注释区段 ripTM 显著低于 IDRBind 的 IDR）；S9（高极性/带电界面、α 螺旋含量与预测质量的关系）；S10（minD 多峰实例，约 1,400 氨基酸全长蛋白中正确定位结合区但复合物结构错误，DockQ=0.009）；S11（非结合蛋白负集对照，性能仅小幅下降，真/假结合者 minD 峰数相近但真结合者顶峰值显著更高）。

## 主要结果与关键数字

**预测成功率与质量**

- 每个数据集 >76% 的样本得到正确（CAPRI 可接受及以上）复合物结构；成功率与 Bret et al. 肽集相当。
- 高质量（DockQ≥0.8）比例：Rg/Rg+ID 集约 25%，Fuzzy 集约 3%。
- 中位 DockQ：Rg/Rg+ID 接近 0.65；IDRBind 与 Fuzzy 显著更低（P=2.6×10⁻² 与 1.8×10⁻⁴）。
- Combined score 与 DockQ 在各数据集内高度相关，但 Fuzzy 集相关较弱。

**打分系统的判别能力**

- 真实复合物大多 Combined score >0.5，诱饵大多 <0.5；0.5 为诱饵/真实的最佳判别阈值（正文在 Discussion 中表述该阈值的 AUROC 超过 0.8）。
- 诱饵 vs 真实：IDR pLDDT 最佳（AUROC=0.91，阈值 42.9）；诱饵 vs Fuzzy 集同样 IDR pLDDT 最佳（AUROC=0.91，阈值 42.4）。
- 不准确 vs 准确（CAPRI 分级）：Combined score 最佳（AUROC=0.81，阈值 0.62）——Combined score >0.62 的预测不仅大概率真实而且准确。
- pTM 可区分模糊与同质结合模式（AUROC=0.71，阈值 0.8）。

**NOE 约束与动力学**

- AlphaFold-Multimer 预测的中位 NOE RMS 违例约 1.5 Å（Fuzzy 与 IDRBind 两集相同），NMR 模型为 0.2 Å（Fuzzy）与 0.3 Å（IDRBind）；但违例数目上二者接近，且存在若干复合物违例水平相当。
- 将 AF 多个预测当同一复合物的不同构象提取动力学指标：IDR 链内 DV 的 Spearman 相关为 0.84（高）；链间 DV 与 IDR RMSF 的相关低；AF 预测的波动幅度普遍小于 PDB 沉积模型（更同质、拓扑差异更小）。
- ripTM 与 PAE 与 NMR 模型的 RMSF/DV 高度相关：结构高变异区段被赋予低 ripTM、高 PAE。模糊注释（有功能证据的动态）区段 ripTM 显著低于 IDRBind 的 IDR。

**预测质量的决定因素**

- 小界面 → DockQ 显著更低（P=9.6×10⁻⁸）；但界面大小不能解释数据集间差异（Fuzzy、IDRBind、Bret 分布相似）。
- 界面疏水性：高/中等 > 低（P=8.5×10⁻¹⁵、3.6×10⁻⁸）；高极性/带电界面质量低（SI Fig. S9）。疏水性大致随 Fuzzy→Bret 预测质量升高而升高。
- IDR 结合后 coil 含量：低 > 中/高（P=4.9×10⁻⁹、7.3×10⁻⁴³）；结合诱导高 α 螺旋含量的预测更准；Fuzzy 与 IDRBind 的 IDR coil 含量最高。

**全长蛋白情景与 minD**

- 用全长序列替代 IDR 片段后 DockQ 明显下降，Bret et al. 集下降最显著；但 Rg/Rg+ID 大多数样本仍得到正确结构，超过 60% 的预测仍被归类为准确（Discussion 表述）。
- min-iPAE（Rg 集）：AUROC=0.91、AP=0.5。
- minD：AUROC=0.94 与 0.92、AP=0.61 与 0.59（两个 Rg 类数据集）；在 Bret et al. 集上精度较低但仍有表现。
- minD 峰分析：前 5 峰命中真实结合区的样本比例——Rg 95%、Rg+ID 93%、Bret et al. 84%；Rg 集顶峰命中率 77%，而正确结构率仅 65.3%。
- 负集对照：加入随机配对的全长非结合蛋白后，识别性能仅小幅下降；真/假结合者 minD 峰数量相似，但真结合者顶峰值显著更高。
- 实例：约 1,400 氨基酸的全长蛋白中 minD 准确定位结合区，而复合物结构预测看似错误（DockQ=0.009）。

## 对照与消融

- **诱饵对照（decoy control）**：将同源蛋白的其它无序片段（非真实结合片段，滑窗生成）与受体配对构造 73 个诱饵复合物，作为"假相互作用"阴性对照，用于标定 Combined score 阈值（0.5）与各打分的 AUROC。
- **非结合蛋白负集**：受体随机配对数据集内全长非结合蛋白，用于检验 minD/min-iPAE 是否会误报相互作用位点；结果为性能仅小幅下降、顶峰值显著低于真结合者。
- **数据集内部层次**：Rg（210）→ Rg+ID（105，无序度最高一半）的对比，用于检验无序度过滤对假阳性的影响；两集成功率与 DockQ 分布相近（中位约 0.65）。
- **片段 vs 全长（边界敏感性消融）**：同一受体分别搭配 PDB SEQRES 中的 IDR 片段与 UniProt 全长蛋白，DockQ 与 CAPRI 成功率对比，量化输入序列边界对预测的影响。
- **与已有基准的对照**：与 Bret et al. 的 42 个肽–蛋白复合物结果直接比较（取同一种子）；两数据集界面大小/无序度分布对照说明 Rg 集在"大界面 IDR"上的互补性。
- **评分指标间的横向比较（各指标即"消融"）**：同一分类任务下比较 Combined score、ipTM、pTM、pLDDT（IDR）、PAE、ripTM、minD、min-iPAE 的 AUROC 与最佳阈值，选出各任务最优指标。
- **NMR 多模型敏感度检验**：将 AF 所有预测与所有 NMR 模型两两比较，取两种最大值指标（每个预测的最大 DockQ、每个 NMR 模型的最大 DockQ）——成功率与质量均无剧烈变化，说明 DockQ/CAPRI 的局限并非由选错 NMR 模型所致。
- **RMSF 两种叠加策略对照**：全结构对齐 vs 仅受体对齐后计算 IDR 的 RMSF，两种口径的 RMSF 相关性均被报告。
- **替代验证手段（NOE 约束）**：针对 DockQ/CAPRI 以单一构象为真值、不适于动态结合模式的缺陷，改用 NOE 距离约束违例作为独立的质量衡量。

## 作者自述的局限

1. **IDRBind 集非盲测**：全部早于 2018-04-30 训练截止日期，部分复合物可能进入训练集，故另建 Rg 盲测集弥补。
2. **模糊注释的异质性来源存疑**：模糊复合物中 IDR 某些区段异质性高可能是约束缺失/不明确所致，而非固有的功能相关动态；为此作者专门分析了带"fuzzy"注释（有动态行为与功能相关性的实验证据）的区段，发现其 ripTM 仍显著更低。
3. **异质性幅度复现不足**：AF 预测模型不如 PDB 沉积模型多样（波动幅度普遍更小），NOE RMS 违例整体更大；这与近期研究（ref 41–44）指出的"AlphaFold2 与单体 NMR 数据符合良好、但预测异质构象系综困难"一致。作者提出 PDB 中同质、高亲和相互作用占主导，可能使训练集对 AlphaFold2/Multimer 产生偏倚；并指出 NOE 违例在异质性明显更低的 IDRBind 集上同样偏高，是否用能产生更多样构象的替代方法（ref 40、45、46）可改善尚待检验。
4. **静电驱动假说未证实**：界面低疏水性与低质量相关，可能意味着 AlphaFold-Multimer 对以静电相互作用为主的相互作用更吃力，但"需要更多研究来进一步证实"。
5. **打分引导的识别策略有条件限制**：用低 ripTM 识别动态区段只应在整体预测可信（Combined score >0.62）时应用；此时可用 pTM=0.8 阈值区分模糊与同质结合。
6. **minD 的假阳性风险未排除**：不能排除整个蛋白质组中存在某些本不该结合给定受体结构域的序列、minD 却给出许多假相互作用位点；需要更大负集估计其丰度。minD 是否真能降低 FDR、能否与 ipTM 等组合降 FDR，仍需研究。
7. **引用性局限**：此前基于片段扫描的 AFM 相互作用鉴定有约 20% 的 FDR（引自 ref 30）；基于本文结果，异质复合物的 FDR 预计略高于同质复合物，大规模片段筛选中假阳性仍多。
8. **单种子采样**：ColabFold 默认 num_seeds=1，Bret et al. 结果也只取第一个种子；未系统考察多随机种子的影响。

## 我的评价

**论文说了什么（总结）**：这是一篇以数据集构建为核心的基准（benchmark）研究，方法论贡献在于——(1) 用 Rg/N≥0.26 的几何判据从 43,725 个 PDB 条目中无监督地筛出 210 个训练截止日期之后的"盲测" IDR 复合物；(2) 用 FuzDB 构造 37 个模糊复合物专门考察动态结合；(3) 用同蛋白无序区滑窗片段构造诱饵对照；(4) 提出 minD（Distogram head 导出）与 min-iPAE 在全长蛋白中定位结合区，避免了逐片段暴力扫描的计算开销；(5) 用 NOE 约束违例作为 DockQ 之外、适用于动态系综的验证手段。

**值得肯定的点**：
- 数据集盲测化处理严谨（训练截止日期对齐、MMSeqs2 去冗余 30%/80%、按分辨率聚类），为"AlphaFold 是否只是记住了训练集"的常见质疑提供了针对性设计。
- 诱饵对照是用"同蛋白其他无序片段"而非随机序列，阴性对照比随机肽更严格、更贴近真实误报场景。
- 结论分层清晰：区分了"能否识别真实相互作用"（判别）与"能否准确建模"（质量）两个层次，并给出可直接操作的两个阈值（Combined 0.5 / 0.62、pTM 0.8、pLDDT 42.9/42.4）。
- 明确承认"AF 能感知模糊区但不能复现其异质性幅度"，没有过度宣称。

**可追问之处（基于论文内部信息提出的问题，非新事实）**：
- Fuzzy 集只有 37 个复合物且全部为 NMR 结构，Fuzzy vs IDRBind 的质量差异里，"NMR 结构本身沉积偏差"与"真实模糊性"各贡献多少，论文只讨论了 NOE 违例但未完全分离这两个因素。
- minD 的 AUROC/AP 是在"已知二者相互作用"的配对前提下计算的（论文明确说明"we tested here the ability to pinpoint the binding region when we pair sequences of proteins that are known to interact somewhere"），因此它回答的是"定位"而非"发现新伙伴"；论文对这一点是坦白的，但读者容易被 0.94 的 AUROC 数字误导为交互发现能力。
- 77% 的 minD 顶峰命中率与 65.3% 的正确结构率之间的缺口很有信息量（定位对≠结构对），但论文没有进一步分析缺口样本的共因。
- 全程仅用一个随机种子、num_recycles=3 的默认设置，与讨论中引用的"改进管线可提升质量"形成对照，本文未量化这些管线的增益。
- 界面疏水性与 coil 含量两个"决定因素"其实是相关特征（coil 界面自然更亲水），图 3 未报告二者独立贡献的分解。
- "NOE RMS 违例约 1.5 Å"这个数字在 IDRBind（异质性低）与 Fuzzy（异质性高）上相同，而论文未解释为何二者无差异，这一点对"AF 更适应同质结合"的叙事略有张力，作者自己也点到而未展开。

## 可复现要点

- **工具与版本**：ColabFold v1.5.2，model_type=alphafold_multimer_v2（即 AlphaFold-Multimer v2.2 权重）；num_recycles=3，num_seeds=1，其余默认。
- **输入序列**：片段场景用 PDB SEQRES 记录的 IDR 与受体序列；全长场景用 UniProt 全长序列 + 受体结构域序列。
- **数据来源**：IDRBind 的 PDB ID 取自 ref 32 补充材料（84 个中 73 个为 IDR 只接触一个受体链者）；Fuzzy 集来自 FuzDB（296 个结构过滤后 37 个）；Bret et al. 取自 ref 31 补充数据（只用 iteration=1 的种子）；诱饵集按"同蛋白无序区 + 同源结合片段等长滑窗、不含原片段"生成。
- **Rg 集筛选阈值（按顺序）**：PDB 发布日期 >2018-04-30；分辨率 ≤3.5 Å 或 NMR；≥2 链；剔除核酸链；IDR 链 Rg/N≥0.26 且 >20 残基；受体链 Rg/N<0.26 且 >70 残基；链间重原子 <5 Å 接触；IDR 与受体一一对应；≥2 个二硫键剔除 → 1,329 → MMSeqs2（30% 相似性、80% 覆盖）对照 2018-04-30 前 SEQRES → 440 → 分链聚类取最优 → 210；Rg+ID 为无序度最高一半（105）。
- **评估定义**：DockQ 公式 f(r,d)=1/(1+(r/d)²)，d1=8.5 Å、d2=1.5 Å；CAPRI 分级 0.8/0.49/0.23；Combined score=0.8·ipTM+0.2·pTM；ripTM 满足 ipTM=max_j ripTM(j)；min-iPAE(j)=min_{i∈B} PAE(i,j)；minD(j)=min_{i∉A} E[Dij]，E[Dij]=Σ_{b=1..64} p_b·c_b（箱 2–22 Å）。
- **峰分析**：minDnorm=1−(minD−2)/20；scipy.signal.find_peaks(prominence=0.02, distance=30)。
- **NOE 分析**：PdbStat + hydride 加氢；RMSF 两种叠加口径；DV 为 Cα–Cα 距离的 SD；疏水性用 Kyte–Doolittle 标度。
- **统计**：双侧 Mann–Whitney U 检验；AUROC 与最佳阈值取 TPR−FPR 最大处；AP 为 PR 曲线下面积。
- **代码**：https://github.com/alirezaomidi/AFM-IDR；数据与预测结果在 Dataset S1/S2/S3。

## 术语

- **内在无序蛋白/无序区（IDP / IDR, intrinsically disordered protein / region）**：在孤立状态下缺乏稳定三级结构的蛋白或区段。
- **结合诱导折叠（folding upon binding）**：无序区在与伙伴结合时形成有序结构。
- **模糊复合物（fuzzy complex）**：结合态中部分区段仍保持高度动态/结构异质的复合物；FuzDB 为其手工注释数据库。
- **MoRF**：分子识别特征区（molecular recognition feature），无序蛋白中的结合区段。
- **Rg（radius of gyration）**：回旋半径；本文用 Rg/N≥0.26 判据（Flory 标度律 Rg=R0·N^v，IDR 的 v≈0.5、球状结构域 v≈0.33 的思想，实际取 v=1 时分类 AUC 最高）识别复合物中的伸展无序链。
- **CAPRI**：相互作用预测的关键评估（Critical Assessment of PRediction of Interactions），本文借用其 DockQ 分级体系。
- **DockQ**：对接质量综合分，组合 Fnat（正确天然界面接触比例）、LRMS（配体 RMSD）、iRMS（界面 RMSD）。
- **pLDDT**：预测的局部距离差异检验分数，残基级置信度。
- **PAE（Predicted Aligned Error，预测对齐误差）**：预测结构中残基间相对位置的期望误差矩阵。
- **pTM / ipTM / ripTM**：预测 TM score；界面 TM score（衡量链间相对位置）；逐残基 ipTM。
- **Combined score**：ipTM 与 pTM 的加权和（0.8·ipTM+0.2·pTM），用于给预测排序。
- **Distogram head（距离图输出头）**：AlphaFold-Multimer 中把 pair representation 投影为 64 个 2–22 Å 距离箱概率的模块。
- **minD / min-iPAE**：本文提出的逐残基指标，分别取残基与所有其他链残基的期望距离最小值 / PAE 最小值，用于全长蛋白中定位结合区。
- **NOE（Nuclear Overhauser Effect，核欧沃豪斯效应）**：NMR 中提供质子间距离约束的效应；本文用其约束违例衡量预测结构质量。
- **RMSF / DV**：均方根涨落（per-residue fluctuations）；距离变异（pair-wise 距离的标准差）。
- **AUROC / AP / PR 曲线**：ROC 曲线下面积；平均精度；精确率–召回率曲线。
- **FDR（false discovery rate，错误发现率）**：被判定为阳性结果中假阳性的比例。
- **MMSeqs2**：快速序列搜索/聚类工具，本文用于训练集去重与聚类（30% 相似性、80% 覆盖）。
- **RIDAO / IUPred3**：两种无序预测工具。
- **PdbStat / hydride**：NMR 约束违例分析工具；给蛋白模型加氢的 Python 库。
- **Kyte–Doolittle scale**：氨基酸疏水性标度。

---

**导航**

- 模块笔记：[[notes/class-notes/结构生物学/AI结构预测/精读/_index|精读总索引]]
- 上一篇：[[notes/class-notes/结构生物学/AI结构预测/精读/01 Josh Abramson 2024]]

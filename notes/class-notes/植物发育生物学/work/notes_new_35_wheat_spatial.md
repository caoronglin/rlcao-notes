## [新-35] Long KA, Lister A, Jones MRW, Adamski NM, Ellis RE, Chedid C, Carpenter SJ, Liu X, Backhaus AE, Goldson A, Knitlhoffer V, Pei Y, Vickers M, Steuernagel B, Kaithakottil GG, Xiao J, Haerty W, Macaulay IC, Uauy C. Spatial transcriptomics reveals expression gradients in developing wheat inflorescences at cellular resolution. *The Plant Cell*, 2026, 38(1): koaf282. Advance access 13 December 2025. DOI: 10.1093/plcell/koaf282（Crossref 核对：卷 38、期 1、文章号 koaf282、在线 2025-12-13 / 印刷 2026-01-02、98 篇参考文献、CC-BY）

> 备注：任务书写作 "2025"，Crossref 实证为 **在线 2025-12-13、期刊卷期 2026 年 38 卷 1 期**。引用时建议写 "Plant Cell (2026) 38:koaf282; published online Dec 13, 2025"。Breakthrough Report 类型。

**实验材料与系统**
- 六倍体普通小麦 *Triticum aestivum* cv. **Paragon** 背景的两条 BC6 近等基因系（材料来源 Adamski et al. 2021，PDF p11 "Materials and methods"）：
  - **P1WT** = 野生型 VRT-A2a 等位基因
  - **P1POL** = 来自 *T. turgidum* ssp. *polonicum* 的 VRT-A2b 顺式调控等位（提高 VRT2 表达）
- 4 个发育时期（Waddington 分期）：**W2.5（late double ridge, LDR）、W3.25（lemma primordium, LP）、W4（terminal spikelet, TS）、W5（carpel extension, CE）**；麦穗长约 1.2–4 mm（PDF p4）
- 另做 5 个时期（W2、W2.5、W3.25、W4、W5）基部 vs 中部显微切割 bulk RNA-seq（仅 P1WT），每个样本平均检出 49,387 个高可信基因，全样本并集 55,346 个
- 取材：10 µm OCT 包埋冷冻切片，每块 5–36 个穗；共 4 次 MERSCOPE 运行，单次原始影像 **460 GB – 1.52 TB**（PDF p3）

**技术平台与分辨率**
- **MERFISH（Multiplexed Error Robust Fluorescence In Situ Hybridization）成像型空间转录组**，Vizgen **MERSCOPE** 平台，商业探针集 300 基因（本文报告其中 **200 个穗发育相关基因** + 9 个 housekeeping + 另 100 个籽粒项目基因，后者不在本文讨论范围）
- **达到真正的单细胞分辨率**：Cellpose2 cyto2 模型（DAPI 核 + PolyT 胞质）分割，Vizgen Post-Processing Tools v1.2.2 指派转录本；实测平均每细胞 77.9–152.4 个转录本、29.6–42.1 个基因（PDF p4）；可见单层表皮内局部化的转录本信号
- 论文**明确把 200 基因面板的"广度不足"列为局限**："the restricted size of a 200-gene panel constrained transcriptomic coverage… MERFISH has not yet achieved the breadth of coverage possible from snRNA-seq approaches"（PDF p8）
- 六倍体特异性警告：用 B 基因组探针检测到平均 **0.20 转录本/细胞**（空白条码 0.24–0.34%）——探针**不具同源基因组特异性**，捕获 A/D 同源拷贝（PDF p4, Fig. S6）。这点引用时必须说明。
- 交叉验证：in silico 模拟显微切割 vs bulk RNA-seq，8 样本 × 4 时期 Spearman ρ = 0.66（0.62–0.73）；与已发表单基因 ISH 及跨禾本科比较一致（PDF p4, Fig. S7–S8）
- 分析栈：Scanpy 1.10.0、Squidpy 1.4.1、Scanorama 1.7.4、Leiden（resolution 1.0）、scikit-learn PCA

**核心论点**（PDF 物理页）
1. **把 MERFISH 首次优化到小麦花序**，实现 4 时期、2 基因型、8 样本共 **50,731 个细胞**的单细胞分辨率空间转录组图谱，构建 **18 个表达域（EDs）** 及其富集基因标记（Fig. 1, PDF p3；Fig. 2, PDF p5）
2. MERFISH 的独特价值不在定量丰度（bulk RNA-seq 也能做），而在**解析共表达网络的空间域**：在 VRT-A2b 突变体中定量 VRT2 与 SEP1-4 的异位共表达程度及其空间分布，"MERFISH uniquely revealed both the extent of their ectopic co-expression and their spatial distribution"（Fig. 4, PDF p8、p10）
3. **W2.5（早于任何可见小穗形态）时，腋生分生组织（AM）与其下位叶脊（LR）已沿顶-基轴出现分化的转录状态**：把 AM/LR 各 13 个自基部（1）到顶端（13）排序做 PCA，**PC1 与顶-基位置强相关（AM ρ=0.68, P=0.01；LR ρ=0.97, P=2.62e−08）**（Fig. 5, PDF p7–p8）
4. 基部 AM 在 W2.5 已表现出**发育延迟的分子前提**：基部 AM 缺少明确的 ED0 分生组织区、KNOX5 在基部 AM 的分生组织体（meristem corpus）中不表达（Fig. 5A–B, PDF p9 及其 PDF p8 正文）
5. TSH1（抑苞基因）限定在 LR，提示从营养期"抑制 AM"到生殖期"抑制 LR"的关键重编程事件（PDF p10）；据此提出**基部 AM+LR 构成一个整合的发育模块**（PDF p11）

**关键表达梯度**（具体到基因/通路 + 空间方向 + 边界）

1. **VRT2 ↔ SEP1-4 反向梯度（W4，30 个横切 bin）**：VRT2 在基部 bin 1–10 的每细胞平均计数是 bin 11–30（中央/顶端）的 **3.46 倍**；**VRT2 主要表达于正在发育的穗轴 ED3（32.2% 细胞阳性），在颖/外稃 ED2 仅 3.3%；SEP1-4 在穗轴 ED3 仅 1.4%，在 ED2 达 31.1%**；整个 P1WT 穗仅 0.7% 细胞共表达（Fig. 4A/C, PDF p7–p8）
2. **VRT2 / SEP1-4 在 VRT-A2b 突变体中的空间去抑制**：P1POL 全穗 8.2% 细胞共表达（WT 0.7%），在表型最强的颖/外稃（ED2）中 **26.3%**（WT 1.1%）（Fig. 4B/D, PDF p7–p8）
3. **AM 沿顶-基轴的 PC1 载荷基因梯度**（W2.5，Fig. 5D/E，PDF p7、p9）
   - 中央/顶端 AM 高（PC1 低载荷）：**AIL6 (−0.177)、KNOX5 (−0.175)、HB1 (−0.170)、ILI3 (−0.167)**——分生组织身份/不确定→确定转换与 FM 身份标志
   - 基部 AM 高（PC1 高载荷）：**RIL1 (0.186)、SPL14 (0.180)**——稻中分枝/小穗分生组织身份基因
4. **LR 沿顶-基轴的 PC1 载荷基因梯度**（Fig. 5H/I/J，PDF p8–p9）
   - 基部 LR 高：**LEC1 (0.179)、AP2-5 (0.179)、SPL17 (0.171)、RIL1 (0.159)**
   - 中央/顶端 LR 高：**AGL14 (−0.171)**
5. **沿轴"分带式"（banded）而非单调表达的例子**：**SP3 正交同源基因**（短穗基因）在 AM 与 LR 的中央/顶端区域呈**离散条带**；**RIL1 则在基部同时标记 AM 与 LR**；**SPL17 只在基部 LR 表达**（顶端位置 8–13 的 LR 中缺失）——"SPL17 showed LR-specific expression in a position-dependent manner, expressed only in basal LRs (Fig. 5L)"（PDF p8、p11）
6. **LEC1 的边界转换**：在基部 AM1–3 与 LR1–3 中表达，但**从位置 4 起仅限 AM**（LR→AM 的命运界面）（Fig. S11, PDF p8）
7. **组织域边界上的陡峭变化**
   - **ED11 = 沿 AM 远轴（adaxial）边界的一层细胞**；所有 AM 一致表达 L1（ED4）与 ED11 模式，**而基部 AM 缺少明确的 ED0 分生组织区**（Fig. 5A/B，PDF p7）
   - **CUC3 标记 SM 的远轴边界**；TSH1 标记被抑制的 LR（Fig. 5A/B, PDF p9）
   - **KNOX5 被排除在 tunicate/L1 层之外**，与玉米 knotted1 一致（PDF p7）
   - **MND1** 只标记被抑制的 AM（营养期叶腋），把营养期 AM 与生殖期 SR 在空间上分开（Fig. 3L/P, PDF p6）
8. **花器官身份的 MADS 空间域**（W5，Fig. 3，PDF p6）：ED1+2=颖/外稃（非花性苞片状）、ED15=内稃、ED17=浆片、ED14+10=雄蕊、ED16=心皮；**W3.25 中央小穗中仅 3 个 ED15 细胞位于 LP 正上方，全部表达 AGL6**——作者判定为小麦内稃身份最早出现的细胞（PDF p4、p10）
9. **发育梯度的时间维表现**：LR（ED12）在 W2.5/W3.25 遍布整个花序，到 W4/W5 **收缩到基部区域**；TSH1 表达在后期仍持续于基部 ED12；中央小穗在 W4 已有 ED10/14/16（雄蕊、心皮）并富集 AG1/SEP3-1/SEP3-2，**基部小穗在 W3.25 与 W4 都完全缺失这些花域**（PDF p10）
10. **TCP24/COM1（HvCOM1 正交同源）在 ED11 细胞中特异表达于 AM7、9、10**——大麦中 HvCOM1 被用作真正的 TSM 身份标记（PDF p8、p10）
11. **规模差异**：基部 LR 平均 **32.5 ± 15.8 细胞/切片**，中央 LR 仅 **12.5 ± 1.5 细胞/切片**（W2.5 P1WT，PDF p7）——这是形态学梯度，但作者未做力学量化

**是否含力学或生长数据交叉分析**（如实回答）
- **完全没有。** 对全文 17 页检索 mechanic / stiffness / turgor / force / biomechan / growth rate / elongation zone / cell wall ——**命中数为 0**。既无 AFM/细胞壁力学测定、无微柱压陷、无膨胀压或壁张力测量，也无生长速率曲线与表达域边界的对照分析。
- **也无激素/形态素梯度数据**（auxin / cytokinin / PIN / WUS / WOX 在正文中命中 0；仅在讨论中作为外部知识提及 auxin-independent）。
- 唯一与"生长"沾边的间接内容：(a) 形态学梯度的量化（基部 vs 中央 LR 细胞数 32.5 vs 12.5，PDF p7）；(b) 时间维上 ED 组成的变化被解释为"作为披针形穗形出现的痕迹"（PDF p11）。
- **对本论文的意义**：这篇可以作为 §5.1 的"空间转录组侧"证据，但**不能用作"联用"证据**；论文若要论证"力学—空间组学联用"，仍属该领域的公开空白，必须靠 CSLD5 那类力学论文 + 本文的梯度证据**并列**而非"已联用"。

**可引用句**（英文原句照抄 + PDF 物理页码）

1. "Here, we optimize Multiplexed Error Robust Fluorescence In Situ Hybridization, a spatial transcriptomics technique, in wheat inflorescence tissue, enabling transcript localization for 200 genes to cellular resolution across 4 stages of development." —— PDF p1（摘要）
2. "As these ridge pairs are initiated acropetally, a developmental gradient is established along the nascent inflorescence, with basal phytomers being the oldest (Bonnett 1966; Waddington et al. 1983). However, the timing of each AM's meristem identity transitions (AM > SM > FM) does not follow this age gradient." —— PDF p2
3. "Gene expression patterns obtained with MERFISH to be reproducible between independent tissue sections, and consistent with expression patterns observed with single gene in situ hybridization. However, preserving RNA integrity during sampling and sectioning proved particularly challenging, limiting the number of sections available for onward analysis." —— PDF p8（原文句首为 "We observed gene expression patterns obtained with..."）
4. "PC analyses revealed a strong positive correlation (ρ = 0.68, P = 0.01) between PC1 and location along the apical-basal axis, with lower PC1 scores associated with basal AMs." —— PDF p7
5. "Together, these results provide strong evidence that apical-basal patterning in the developing spike is established before W3 through distinct, tissue-specific gene expression gradients that differentiate AM and LR primordia, and highlight key regulators—such as RIL1, LEC1, and SPL17—that contribute to early axial patterning across multiple cell types." —— PDF p8
6. "These results indicate that the genetic program regulating bract suppression and meristem determinacy shifts along the apical-basal axis of the wheat spike. We propose that basal AMs and LRs function as an integrated developmental module, distinct from the central and apical regions, reinforcing the idea of their coordinated role in spike development." —— PDF p11
7. "MERFISH uniquely revealed both the extent of their ectopic co-expression and their spatial distribution, providing mechanistic insight into how P1POL alters spikelet architecture." —— PDF p10

**证据强度**：**中—强**
- 强在：技术层面确实做到了单细胞分辨率 + 原生三维形态共存（成像型、非测序型），18 个表达域的划分与 MADS ABCDE 空间域的自洽性（内稃 AGL6⁺ / 浆片 B 类⁺ / 雄蕊 C 类 AG1/AG2⁺ / 心皮 STK1⁺）互相印证，是"分生组织—器官界面存在分子域"的硬证据。
- 弱在：(1) 200 基因面板是**先验选定的**，不能声称无偏；(2) 六倍体下探针**不区分同源基因组**；(3) 每细胞平均转录本 78–152，覆盖浅，低丰度转录本可能漏检；(4) **梯度结论来自每样本 2 张切片 × 4 时期 × 2 基因型的 8 个样本**，横轴 PC 分析是分组平均后的伪时序，**不是连续空间坐标上的严格梯度**；(5) 顶端-基部轴被离散为 13 个"植物体"分组，RIL1/SPL17/LEC1 等关键梯度的定量曲线只在 Fig. S11 中以单基因散点呈现。
- 论文自己给出的最强证据是 VRT2↔SEP1-4 的互斥空间限制（32.2% vs 3.3%；1.4% vs 31.1%），这是可直接引用的定量边界。

**局限**
1. 目标基因面板 200 个（有偏设计），广度不及同一组织的 snRNA-seq（作者自陈，PDF p8）
2. 同源基因组间交叉杂交严重（B 基因组探针 0.20 转录本/细胞），任何"等位基因特异"结论都不可靠
3. RNA 保存/切片极难，可用于分析的切片数少；不同样本每细胞转录本数变异大，**跨样本表达量直接比较受限**（作者自陈，PDF p8）
4. 2D 冷冻切片，非完整三维重建；无时间序列同一组织的连续追踪
5. 梯度结论多为相关而非因果；KNOX5/AIL6/HB1/RIL1/SPL17 在小麦中的功能尚未表征，"BM 身份"是从稻/玉米外推，在不分支的小麦穗中难直接解释（作者明确说 "BM identity is not directly translatable to the unbranched wheat inflorescence"，PDF p10）
6. 拟南芥式的"单细胞位置信息"未被直接检验：本文测的是 13 组分生组织的**组间平均表达**，不是单细胞内的位置依赖性（如 BELL1 类介导的响应阈值）

**对我论文的作用**
- **可直接替换/加强 §5.1 的"平台已成熟"论断**：把"仅拟南芥一例"扩展为"**单细胞分辨率空间转录组已从拟南芥走到禾本科花序**"，并给出可量化的梯度实例。若 §5.1 现有句子形如"空间组学目前仅在拟南芥花分生组织有单核测序 + 三维重建（Neumann et al. 2022）"，可改为："空间转录组已在禾本科花序中达到**原位单细胞分辨率**——Long et al. 用 MERFISH/MERSCOPE 在小麦花序 4 个时期、5 万余细胞中划分出 18 个表达域，并测得 VRT2 与 SEP1-4 沿顶-基轴互为反向梯度、在发育中的穗轴（ED3, 32.2%）与颖/外稃（ED2, 3.3%）之间陡峭切换（Plant Cell 2026, 38:koaf282, Fig. 4）"。
- **为"位置信息"提供具体分子**：把"位置信息"从抽象概念落到 **RIL1 / LEC1 / SPL17 / TSH1 / MND1 / AIL6 / KNOX5 / HB1 / TCP24-COM1** 这一组轴向与界面上分化的调控因子上；尤其 TSH1（抑苞，限 LR）与 MND1（抑 AM，限营养期叶腋 AM）构成"抑制功能的顶-基轴交接"，可用于讨论"边界上抑制功能的切换就是形态边界"。
- **为"长形状"提供直接机制**：作者把 VRT2 在基部的剂量升高与"颖/外稃伸长 + 小穗发育延迟"联系起来，并在 VRT-A2b 中显示异位共表达，本文可以据此说"**轴向剂量梯度直接塑造器官尺寸与成熟时间**"。
- **诚实标注空白（反而是加分项）**：本文可作为 §5.1 中"**目前空间组学与力学/生长测量尚未真正联用**"的证据——本文有细密的表达域与梯度，但 0 力学数据、0 激素梯度、0 生长速率曲线。这样 §5.1 的"联用"主张就成为**明确的研究空白与本论文的立论依据**，而不是需要回避的弱点。

**数据可得性**
- **代码**：全部实现脚本 GitHub 公开 —— https://github.com/katielong3768/Wheat-Inflorescence-Spatial-Transcriptomics （PDF p14 "Data availability"）
- **原始与处理数据**：Zenodo，按样本分文件夹 —— https://zenodo.org/records/15720855 ；分析归档含 "RNAseq.tar.gz"、"QC.tar.gz"、"SampleIntegration_Clustering.tar.gz"、"GeneEnrichmentAnalysis.tar.gz"（PDF p11–p13）
- **RNA-seq 原始数据**：NCBI BioProject **PRJNA1201104**（PDF p14）
- **交互式查看器**：**www.wheat-spatial.com**（WebAtlas，可视化各细胞转录本计数；P1WT 样本）（PDF p1、p14）
- **样本制备 protocol**：doi.org/10.17504/protocols.io.rm7vzqwb4vx1/v1（PDF p2、p12）——对复现其他物种的植物组织 MERFISH 很有用
- 结论：**原始数据、代码、在线图谱三件套齐全，可复现、可引用**
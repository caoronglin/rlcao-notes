## [新-31] Lan M, Zhu Y, Peaucelle A, et al. CSLD5-mediated cell wall remodelling regulates tissue mechanics and shoot meristem growth. *Nature Communications*, 2025, 16: 7229. DOI:10.1038/s41467-025-62651-8

<!-- 元数据已用 Crossref 实证核对（curl https://api.crossref.org/works/10.1038/s41467-025-62651-8，2026-10-06 查询）：
   volume=16, issue=1, article-number=7229, type=journal-article, published-online 2025-08-06, 90 refs, is-referenced-by-count=14,
   license CC BY-NC-ND 4.0, first authors Miao Lan / Yimin Zhu / Alexis Peaucelle / Xianmiao Zhu（4 位共同一作）。
   ⚠ 更正：more-papers.md 第 46 行把卷号记作 "14"，实为 **16**；文章号 7229。
   ⚠ PDF 物理页 = 期刊页（页脚 "Nature Communications | (2025)16:7229 N"），本文所有页码为 PDF 物理页。全文 17 页，已读完 1–17（含 Methods 与 References）。 -->

**实验材料与系统**（物种、组织、部位、发育时期、突变体/转基因株系）

- **物种 1：拟南芥（*Arabidopsis thaliana*）**，生态型 Col-0 为野生型。**组织：茎端分生组织（SAM）本体，切取的是抽薹期（bolting stage）植株的 inflorescence meristem**（Methods「Plant materials」p.9；「SAM sample preparation」p.10：切取约 1 cm 茎尖，解剖暴露 SAM，0.1% PI 染色显细胞壁）。**这是货真价实的 SAM 本体实验，不是侧根/根创伤/果蝇系统**。
- **突变体**：`csld5`（核心）、`csld2`、`csld2 csld5`（杂交获得）、`myb3r1 myb3r4`、`ixr1-2`；另有 29 个在 SAM 表达的糖基转移酶（GT）T-DNA 单突变体筛选（p.1–2，Fig. 1）。
- **转基因株系**（SAM 内表达）：
  - `pCSLD5::GFP-CSLD5` / `pCSLD5::mCherry-CSLD5`（自身启动子，分裂细胞特异）
  - `pRPS5A::GFP-CSLD5`（全株启动子，**部分**救援）
  - **`pATML1::GFP-CSLD5`（表皮 L1 特异，关键实验）**
  - `pCSLD5::GFP-CESA1` / `-CESA3` / `-CESA6`（功能互换测试）
  - `pUBQ10::myr-YFP`（质膜标记，用于活体分裂追踪）
- **物种 2：水稻（*Oryza sativa*）** 中花 11（ZH11）野生型背景，`pROC1::GFP-OsCSLD4`（ROC1 = 表皮特异启动子），**组织为生殖期—生殖期转换（约萌发后 60 天）的茎尖/花序分生组织**，读出为分蘖数、穗一级/二级分枝数、穗粒数、单粒重（p.8、Fig. 8 on p.12）。
- **发育时期**：拟南芥抽薹期花序分生组织为主；长期活体成像为同一 SAM 每 12 h 一次共 24–72 h（p.4、p.11）。
- **辅助系统**：*Nicotiana benthamiana* 叶片瞬时表达用于 Co-IP 与共定位（p.9 Methods、p.13 Methods）；拟南芥根细胞用于 CSLD5–CESA 共定位（Fig. 6d–f）。

**核心论点**（3-5 条，每条标注支持它的图号与 PDF 物理页）

1. **在 SAM 分生组织内部做 29 个 GT 基因的遗传筛选，CSLD5 是唯一表型最严重者**：除木质葡聚糖/果胶相关基因外，果胶（GAUT、GALS）与 CSLD5 也参与分生组织生长。`csld5` SAM 最小；同时 `xxt2, gaut9, gaut10, gals2, gals3` SAM 也偏小。〔Fig. 1，p.3；正文 p.1–2〕
2. **CSLD5 的作用是在分裂细胞中做「新生细胞壁」合成，其丧失使细胞周期阻滞在有丝分裂早期**：`csld5` 中 24 h 内形成新壁的细胞比例由 20% 降到 12%；`HIS4`（G1–S）下调而 `CYCB1;2`（早前期）上调；细胞变大是因为分裂变慢而非长得快。〔Fig. 2，p.4；Fig. 4l–o，p.6；正文 p.2、p.4、p.6〕
3. **（力学核心）CSLD5 缺失直接降低 SAM 壁的力学性质，并改变触觉响应转录组**：SAM 离体 AFM 显示 `csld5` 的**垂周壁（anticlinal wall）表观杨氏模量 EA 显著降低**；0.4 M 山梨醇处理下 `csld5` 细胞收缩更多（壁更软）；SAM 形状更尖（Gaussian curvature 增大）。转录组中 **117/622（18.8%）下调基因与 touch core transcriptome 重叠**，其中 22 个属于最被触觉诱导的 51 个基因（含 TCH2/3/4、Ca²⁺ 信号、乙烯、缺氧反应基因）。〔Fig. 3，p.5；正文 p.3〕
4. **MYB3R1/MYB3R4 直接转录激活 CSLD5，形成「细胞周期 → CSLD5 → 新壁 → 反馈回细胞周期」的闭环**：CSLD5 启动子含 5 个 MSA 元件；ChIP-seq/ChIP-qPCR/EMSA/双荧光素酶四重验证；`myb3r1 myb3r4` 中 CSLD5 表达显著下降。CSLD5 蛋白自前期开始翻译并在胞质板/新横隔壁积累，非胞质板部分呈环状包围 VHA1-RFP 标记的 TGN。〔Fig. 4，p.6；正文 p.4〕
5. **（最关键）CSLD5 与初生壁 CESA1/3/6 物理互作、功能上 CESA3 可替代 CSLD5；把 CSLD5 限制在 L1 表皮即可完全救援内层（L2）生长——即 SAM 存在跨层「非细胞自主」壁-生长协调**：`pCSLD5::GFP-CESA3` 大幅救援 `csld5`，`GFP-CESA1` 几乎无效，`GFP-CESA6` 反而加剧矮化；CBM4 免疫标记显示 `csld5` SAM 无定形纤维素大幅减少。`pATML1::GFP-CSLD5`（L1 限制表达）**完全**恢复 SAM 大小、L1 **与 L2** 细胞大小、L1 与 L2 细胞数（甚至超过 WT，属过补偿）、117 个 CSLD5/触觉相关基因中 **79.5%（93/117）** 的表达、以及 AFM 刚度；相反全株启动子 `pRPS5A` 只**部分**救援。〔Fig. 5 p.7；Fig. 6 p.9；Fig. 7 p.11；正文 p.6–7〕

**力学方法**（具体做了什么力学测量/建模？用什么仪器或技术？测的量是什么？）

- **AFM 纳米压痕测表观杨氏模量（apparent Young's modulus, EA）**——主力学读出。技术细节（Methods，p.11–12 与 p.13）：
  - 离体解剖的 SAM 用室温琼脂糖固定在玻片上，浸于 **0.55 M 山梨醇**去除膨压（排除膨压对壁刚度的贡献）。
  - 球形探针（Nano World **TL-NCH-20**，弹簧常数标称 10⁻¹³⁰ N/m，标定值 **1.5 N/m**，球尖半径 **900–1100 nm**），在 **100 × 100 μm** 方形区域内压入，**64 × 64 = 4096 个力-压入点**；每个点用 **Hertz 接触模型**外推表观杨氏模量，每个像素 = 一个压入点的 EA；同一曲线的接触点高度重建地形图（Matlab 投影）。
  - 样品量：**17 个 WT、14 个 csld5、7 个 csld5;pATML1::GFP-CSLD5 SAM**，跨 3 个实验批次。**重要诚实说明（p.13）**：因悬臂易污染/损坏，批次 A（对主参考悬臂标定）与批次 B（对自制定标悬臂标定）分别标定后用经验公式互相归一化，作者明说「this normalization does not mitigate the effects of inter-experimental variability, it preserves genotype-specific trends」——**跨批次定量只保趋势不保绝对值**。
- **渗透收缩法（osmotic shrinkage）独立验证壁柔软度**：离体 SAM 先成像，**0.4 M 山梨醇处理 20 min** 后再成像，比较细胞收缩幅度；`csld5` 收缩更多（Fig. 3b，p.5；方法学引 ref. 56 Sapala & Smith 2020）。
- **SAM 表面几何曲率**：高斯曲率（Gaussian curvature）分布图 + 沿纵轴拟合抛物线定量（Fig. 3c，p.5）；`csld5` SAM 更尖，提示内层应力向表层传递。
- **MorphoGraphX 3D 分割 + 生长/增殖热图**：表面网格提取 → 细胞分割 → 12 h 细胞相对增大率热图（Fig. 2d，p.4）；「Heat Map Proliferation」工具统计 24 h 内分裂细胞比例（Fig. 2b，p.4）。L1 与 L2 分别定量（Fig. 7c–f，p.11）。
- **壁组分化学读出**：CBM4（*Cellulomonas fimi* CenC CBD4N1）免疫荧光检测**无定形纤维素**（Fig. 6j，p.9；⚠ 正文 p.6 误写作 "CBM468"，Methods p.14 明确为 CBM4）；乙酰溴法测总木质素（无显著差异）。
- **注意：本文没有做任何微管取向/应力量化、没有任何数值力学模型（FEM）拟合、没有任何 mechanochemical channel（如 Ca²⁺/TPC1、MSL、PI3K、FER）的定点遗传扰动。** 力学测量的对象是**离体、外源膨压已去除的 SAM 组织壁**，不是活体原位应力场。

**关键因果证据**（遗传扰动 + 力学读出 + 救援实验是否齐备？因果链是否闭合？）

- **齐备且漂亮的部分（壁→生长这一段）**：遗传扰动（`csld5` 单突变）→ 力学读出（AFM EA↓、渗透收缩↑、曲率变尖）→ 生长读出（SAM 变小、细胞变大、分裂率↓）→ **救援**（`pATML1::GFP-CSLD5` L1 限制表达同时恢复刚度、细胞大小、细胞数、转录组；`pCSLD5::GFP-CESA3` 恢复生长）。这一段因果链是闭合的，且是**「远端/跨层」救援**——在 `csld5` 全株缺失背景下只给 L1 补一个基因就让 L2 恢复正常，这是很强的「层间信息传递存在」的证据。
- **未闭合的部分（力学→转录这一段）**：`csld5` 同时改变了壁刚度**和**细胞周期（早前期阻滞），触觉响应基因的改变既可能来自「壁软→机械信号改变」，也可能仅仅是「细胞周期阻滞的下游副产物」。作者**没有**做任何能把这两者解耦的实验——没有在不改细胞周期的前提下单独改变壁刚度（如仅用 pectin 处理 Peaucelle 2011 式的壁软化、缺血素衍生物 isoxaben 急性处理、or 药理性细胞周期阻断对照），也没有做机械刺激（拉伸/压缩/消融）后检测这 117 个基因。**所以「壁刚度作为输入信号改变基因表达」在本篇中只是相关性 + 共同被救援，不是被证明的因果。**
- **救援的特异性控制做得不错**：`pRPS5A`（全株）只部分救援 vs `pATML1`（L1）完全救援，两者在 `csld5` 背景下对比，构成一个有意义的「层特异性」对照（Supplementary Fig. 6 vs Fig. 7）。作者也诚实引用了 Bemis & Torii 2007 作为**反例对照**（表皮过表达 CDK 抑制子 KRP1/ICK1/KRP4 只让表皮细胞变大变少，不影响内层细胞数），用以强调本工作的不同。

**可引用句**（英文原句照抄 + PDF 物理页码）

1. （摘要，p.1）"Disruption of CSLD5 results in reduced wall stiffness and altered expression of touch-responsive genes. Confining CSLD5 to L1 layer cells restores the mechanical properties and growth defects of csld5 SAMs, indicating molecular and cellular compensation across shoot meristem layers."
2. （p.3）"We observed that the apparent Young's modulus (EA) of the anticlinal walls in csld5 SAMs was greatly reduced compared to the wild type (Fig. 3a), indicating that the cell walls of csld5 were less stiff."
3. （p.9，Discussion）"We show that, in the actively proliferating shoot meristem, CSLD5 protein participates alongside CESA proteins within the CSCs to drive cellulose-based new wall synthesis."
4. （p.9，Discussion）"As the cortical microtubules align in the direction of maximal tensile stress, mechanical stresses thus guides cell wall assembly, and the wall properties in turn feed back to tissue mechanics."（这句是作者对**双向**耦合的立场声明——可用来支持 §3.2「壁既是力的承受者也是力的传递者」，但注意是引言/讨论中的**综述性陈述**，非本文实验结果。）
5. （p.9，Discussion）"In contrast, we found that expression of CSLD5 in the L1 fully restored the growth defects of the csld5 SAMs, and the complementation occurs not only in L1 but also in L2 cells, suggesting that CSLD5-mediated cell wall synthesis regulates cell development across layers of the SAM."
6. （p.7）"Together, these results suggest that CSLD5-mediated cell wall synthesis can act in a non-cell autonomous manner to regulate cellular activity in the inner layer cells and promote SAM growth."
7. （p.13，Methods，AFM 数据处理诚实声明）"While this normalization does not mitigate the effects of inter-experimental variability, it preserves genotype-specific trends."（若在论文中引用其 AFM 绝对值，最好不要引用绝对数值。）
8. （p.1，引言）"cortical microtubules in the SAM cells align along the direction of maximal tensile stress and reorient in response to altered stress patterns induced by ablation or compression"（这是引言对 Hamant 2008 的复述，引用时应引 Hamant 2008 原文献而非本文。）

**证据强度**（强/中/弱 + 理由）

- **强**：① SAM 本体 + AFM + 渗透法 + 形态曲率 + 基因组学四路读出相互印证「壁刚度↓ → 分裂↓ → SAM 变小」；② L1 限制表达在 `csld5` 全缺背景下完全救援 L2，是干净的跨层救援实验；③ MYB3R→CSLD5 的转录激活有 ChIP-seq + ChIP-qPCR + EMSA + 双荧光素酶四重证据；④ CSLD5–CESA 有 split-ubiquitin Y2H + Co-IP + 共定位（PCC 给出）三路互作证据，且有功能互换（`pCSLD5::GFP-CESA3` 救援、`CESA6` 显负效应）作功能佐证。
- **中**：① 触觉响应基因与壁刚度的关联——117/622 重叠 + 79.5% 被 L1 救援共同恢复，但这只是「共变」，未解耦细胞周期（见上）；② AFM 绝对值的跨批次可比性被作者自己打了折扣；③ 水稻部分只有两个独立株系、n 较小（每穗 33–57 粒），且只有种子数增加、单粒重不变，是产量组分转移而非总产量提升。
- **弱**：CSLD5 的**酶学底物仍未确证**——作者只到「与 CESA3 功能等价 + CBM4 标记的无定形纤维素减少 + 引文献称 CSLD3 有 β-1,4 葡聚糖合酶活性」，无法排除 CSLD5 也合成木聚糖/同型半乳糖醛酸（正文 p.6 明说 "cannot be excluded"）。

**局限**（作者自述的 + 你判断的）

- **作者自述**：
  - CSLD5 的产物不明："Although the specific products of CSLDs in plant cells remain to be determined"（p.1）；"the activities of CSLD5 in the biosynthesis of xylan and pectin cannot be excluded"（p.6）。
  - CESA1/CESA6 不能替代 CSLD5 的**分子基础未知**："Additional experiments, such as domain-swapping between CSLD5 and CesAs, will help to clarify these possibilities."（p.9）
  - AFM 跨批次变异未被消除（p.13）。
  - `csld5` 生长率的变异性高于 WT 但未达统计显著，归因于 SAM 个体间差异（p.2，Supplementary Fig. 3）。
- **我判断的（对你论文尤其重要）**：
  1. **「力学 → 转录」的因果腿是断的**。触觉基因改变与细胞周期阻滞未解耦；严格说本文证明的是「壁合成缺陷 → 壁软 + 分裂减」的联合后果，而非「壁软 → 机械信号 → 转录重编程」。
  2. **「跨层传递」的方向仍是从 L1 出发**。全文没有任何独立操作内层（L2/L3）壁性质的实验；L2 只是被测量的响应方。这恰恰**加强而非削弱**你 §3.2 的现有论断：可用的因果证据仍然集中在表皮，力学信号在分生组织内层的**探测机制**（受体/离子通道/细胞骨架力传感器）仍然空白。
  3. **无原位应力场测量**。AFM 在离体、去膨压条件下测的是壁的被动弹性，与「活体组织中该壁所承受的实际应力」不是一回事，二者之间需要一个本篇完全没有做的原位力学模型。
  4. **无微管取向数据**。引言复述了 Hamant 2008 的「微管沿最大张力对齐」，但本文既未复现也未检验，只是背景引用。

**对我论文的作用**（具体说明能补 3.2 节 / 4.3 节的哪句话）

- **§3.2（"分生组织内部组织如何探测并整合机械信号仍不清楚"）——能部分收紧，但要小心措辞。**
  - 可以**新增**一条直接证据：在**拟南芥 SAM 内部**，L1 特异性表达 CSLD5 即完全恢复 L2 的细胞大小与细胞数（Fig. 7c–f, p.11；正文 p.7、p.9）。这说明 SAM 内层（L2）确实能响应外层壁性质的改变，**"内层会整合机械状态"这半句现在有拟南芥 SAM 的直接数据**，不必再只靠果蝇/侧根旁证。
  - **但不要**用本文去论证"内层如何探测"——因为本文的操纵变量（CSLD5）在因果上游，探测机制在因果下游，本文的读出（细胞大小/细胞数）本身也可以用"内层生长被扰动后自适应补偿"来解释，不必然经过机械感知通道。**建议在 §3.2 保留缺口原句，但把后半句从"不清楚"细化为"已有 SAM 内 L2 响应 L1 壁状态改变的证据（Lan et al. 2025），但从壁张力到内层转录/形态发生之间是否存在可识别的机械感知—信号转导通路，仍无遗传证据"。** 这样缺口陈述更精确、也更难被审稿人反驳。
- **§4.3（"关键因果证据多来自侧根起始、根创伤愈合、叶表皮铺砌细胞及果蝇翅芽"）——可加一个拟南芥 SAM 本体条目，但必须标明它补的是哪一环。**
  - 建议在证据表中把它归入「**细胞壁合成酶 → 壁刚度 → 分生组织生长**」这一支，注明：救援实验是**层特异异位救援**（L1 限制表达 → L2 全恢复），强于此前只能做全株过表达的工作（对比 Savaldi-Goldstein 2007 的 BRI1/CPD 表皮救援，以及 Bemis & Torii 2007 的阴性对照）。同时诚实注明：**它没有提供机械感受器层面的因果证据**（无 Ca²⁺/离子通道/细胞骨架力传感器突变），所以不能用来支持"机械信号通路在分生组织内被鉴定"这一命题。
  - 另可作为"组织间力学协调在作物改良中有实用价值"的支撑：水稻 `pROC1::GFP-OsCSLD4` 增加分蘖与穗粒数（Fig. 8, p.12），可用于论文结尾的展望句。
- **可直接引用的两句英文**（见"可引用句"1 与 5），第 1 句尤其适合放在 §3.2 或 §4.3 的引文位置，因为它一句话同时含"壁刚度下降"和"跨层补偿"两层意思。
- **需要修正的著录**：`more-papers.md` 第 46 行卷号 "14" 应改为 **16**（文章号 7229，2025-08-06 在线发表）。

**版本说明**

- **出版版（Version of Record）**，非接收稿。依据：(a) PDF 元数据 Creator=Springer、Title 带 "Nature Communications, doi:10.1038/s41467-025-62651-8"；(b) 首页含完整的 "Received: 17 July 2024 / Accepted: 22 July 2025" 与版权页 "© The Author(s) 2025"、References 完整（90 条）、Author contributions、Competing interests；(c) Crossref 显示 `content-version: vor` 的 CC BY-NC-ND 4.0 许可，Springer Nature 2025-08-06 正式出版；(d) 含 Nature Portfolio Reporting Summary 引用。
- 全文 17 页已读完（p.1–17）。Supplementary Fig. 1–9、Supplementary Table 1/2、Supplementary Movies 1–3 **不在此 PDF 内**（在线补充材料，GEO 登录号 GSE272708），本笔记中凡涉及 Sup Fig 的结论均只依据正文对该图的文字描述。

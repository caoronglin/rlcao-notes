## [新-34] Demesa-Arevalo E, Dӧrpholz H, Vardanega I, Maika JE, Pineda-Valentino I, Eggels S, Lautwein T, Kӧhrer K, Schnurbusch T, von Korff M, Usadel B, Simon R. Imputation integrates single-cell and spatial gene expression data to resolve transcriptional networks in barley shoot meristem development. *Nature Plants*, 2026, 12(1): 107–124. Published online 7 January 2026. DOI: 10.1038/s41477-025-02176-6（Crossref 核对：Nature Plants 第 12 卷第 1 期，页码 107–124，Springer，92 篇参考文献，CC-BY）

> 备注：任务书写作 "2026"，Crossref 实证一致（online 2026-01-07）。注意本文正文引用自己的前作时写作 "Demesa-Arevalo et al. 2025"，为 preprint/bioRxiv 版本（ref. 24 引的是 Long et al. 2024.12.19.629411 preprint），正式版才是 2026。

**实验材料与系统**
- 大麦 *Hordeum vulgare*，参考品种 **Golden Promise（GP，两行型）**；营养期 vSAM（W0.5）与生殖期花序（W3.5）；Waddington 分期 + **质体时（plastochron, P1–P31）** 双重坐标
- 突变体：**com1a;com2g**（COMPOSITUM1/2 双突变，分枝型花序，5,196 个细胞）；scRNA-seq 主数据为 W3.5（16,528 细胞）+ WT vSAM（919 细胞），3 次独立实验
- 每样本 25 个生物学重复的 vSAM/花序混样；约 20,000 细胞/重复上机

**技术平台与分辨率**
- **两层数据**：(a) **Molecular Cartography（MC）平台多重单分子 RNA-FISH（smRNA-FISH）**，在组织切片上**单细胞分辨率精确定位 100 个设计基因、成功检出 86 个**，空间分辨率 **<140 nm**；(b) **BD Rhapsody Express 微孔板 scRNA-seq**（Illumina NextSeq2000，目标 50,000 reads/cell）
- smRNA-FISH 结果：22,082 个分割细胞、单基因每细胞动态范围最高 536 个转录本、每细胞最多 627 个、均值 **95.35**
- 锚定与插补（imputation）：86 个 MC 基因中 **81 个**用作锚基因；每个 MC 细胞取 scRNA-seq 中余弦相似度（CS）最高的 25 个细胞做加权平均，把表达值投射回组织切片。**插补出 48,904 个基因（花序切片）与 27,656 个基因（vSAM）的单细胞矩阵**
- **验证**：CS 均值 **0.84 ± 0.11**（花序切片）、**0.78 ± 0.11**（vSAM）；用 81 个锚基因自身做模拟验证 0.84 ± 0.10，全部 48,904 基因验证 0.73 ± 0.10
- 关键方法学发现：**10,000 个 scRNA-seq 细胞 + 20 个锚基因即足以可靠插补**（精度随参考细胞数线性提升，约 2,500 细胞后平台化）；**PERSIST 选出的代表性基因组合优于人工/随机选择**，20 个基因即可可靠判定细胞相似性
- 平台：**BARVISTA**（barley virtual in situ transcriptome atlas），D3.js 前端，支持"虚拟显微切割"+ 重新聚类
- 校准：smRNA-FISH 斑点数 vs RNA-seq reads，Pearson **0.73**（宽表达量程基因）

**核心论点**（PDF 物理页）
1. 用 86 基因的 MC 单分子 FISH 作为空间**锚**，把深 scRNA-seq（4,527 基因/细胞）的表达**插补到切片上的每一个细胞**，得到单细胞 × 48,904 基因的空间矩阵（Fig. 2–3, PDF p2–p5）
2. **HvKN1 mRNA 的缺失 + HvCRC/HvHD-zip 的出现是原基发生的最早标志**：在 vSAM 的叶起始细胞（LFo）与 IM 的小穗起始细胞（Fo）中 HvKN1 被清除，且在原基一旦组织化后**恢复**——这是把"位置信息"落到具体 TF 组合上的核心证据（Fig. 3a–c, PDF p5–p6）
3. **Fo 细胞的极性预图式（pre-patterning）**：HvCRC 在**远轴侧**标记被抑制苞片将形成的细胞，而 **YABBY（HvTOB1/HvTOB2）在近轴侧**表达；从 Fo3–Fo4 起近轴侧出现 **VRS4 + HvLOG1 + HvCOM1**，提示 TSM 身份的指定（Fig. 3f–h, PDF p6–p7）
4. **把转录组切成三个发育阶段**：P1–P9 由转录重编程定义小穗身份；**P11–P15 "快速生长但几乎无转录变化"**；P17–P19 花器官分化（Fig. 6a, PDF p7）
5. **用 PERSIST 条形码在单细胞层面表型化分枝突变体**：WT 分生组织尖与确定型小穗的条形码截然不同，而 com1a;com2g 的花序尖与分枝条形码**不可区分**且介于 WT 两端之间（Fig. 7, PDF p9–p12）

**关键表达梯度**（具体到基因/通路 + 空间方向 + 边界）
1. **HvKN1 的空间缺口 = 原基起始边界**：L1/tunica 层基本无 HvKN1，但在**原基尖端 tunica 中 HvKN1 与细胞分裂素合成基因 HvLOG1、HvWOX9C.1/.2 共表达**——全穗 3,023 个 tunica 细胞中 **268 个（≈9%）** 表达 HvKN1；vSAM 中仅 17/138（≈12%）且表达量低（Fig. 3c,d,e, PDF p5）。作者提出 KN1→LOG→CK→WOX9C 的**正反馈构成从最外层（L1）维持分生组织的局部组织者**（Fig. 8a,b, PDF p12、p13）
2. **Fo 起始细胞的三向极性图式**（IM，Fig. 3b,f,g,h, PDF p5–p6）：**HvKN1⁻** 为 Fo 标志；**HvCRC 偏在远轴侧**（被抑制苞片）；**YABBY 在近轴侧**；**Fo3–Fo4 起 VRS4 + LOG1 在近轴侧**，Fo3 起 HvCRC 在近轴侧也表达
3. **原基一旦形成，HvKN1 表达恢复并延伸进 tunica**——这是"未决定 → 命运已定"的分子开关（PDF p6, PDF p13）
4. **HvLOG1 在 SAM、IM、TSM、FM 的尖端表达**，可形成 CK 源；**HvPPDK（ZmPPDK 同源）在 IM 富集**，与 ZmCLE7 共表达，指示 IM 身份（PDF p13）
5. **拟时序上的六个基因调控峰值**，正对应器官发生转换点（PDF p7）：**IM→TSM pT0.5、TSM→SM pT5、SM→FM pT9、FM→外稃/内稃原基 pT14、FM→雄蕊/心皮/浆片原基 pT18（两组，早晚不同但都晚期达峰）**
6. **两个方向相反的发育轴**："one from the apex to the base of the spike, and another from the base to the tip in the FM developing floret organs"（Fig. 4f, PDF p7）——顶-基轴与 FM 内的基-尖轴
7. **顶-基轴上的原基梯度与 DEG 分布**：637 个原基特异 marker；DEG 峰值 **303 个出现在 P5**（TSM→CSM/LSM 转换）；**P11–P15 检出 0 个 DEG**；P17（5 个）到 P19（150 个）重新上升（Fig. 6a, PDF p7）
8. **FM 内部的近轴-远轴-中央三域梯度**（P11，Fig. 6c, PDF p7/p9/p12）：**FMab（远轴，外稃发生侧）** 特异标记 **HvCRC**（= OsDL/DL2/AtCRC）与 **HvTOB1**；**FMad（近轴，穗轴发生侧）** 顶部候选 **HvWOX3**（= OsWOX3/AtPRESSED FLOWER）与 **HvMONOCULM1**（= ZmGRAS43/OsM1/AtLAS，腋生分生组织形成与分枝）；**FMc（中央）** 顶部候选 **HvMADS50**（= OsMADS6/ZmBE1/AtAGL6），另有 **HvLEAFY** 与 59 个转座子相关基因
9. **MADS-box 的 ABCDE 空间归属**（由拟时序推断，Fig. 5c,d / Fig. 8c, PDF p9、p12）：**A 类** HvMADS11/22/32/41；**B 类** HvMADS40（MADS8）/68（MADS7）/24（MADS2）/7（AtPI）；**C 类** HvMADS81/5/20/45/76（MADS16）/52；**E 类** HvMADS33（MADS1）/64（MADS5）/12/50（MADS6）。时序上：HvMADS42（MADS34）在 IM→TSM 转换期最早；HvMADS64 与 HvMADS33 在 CSM；HvMADS50 限定于 FM 中央区；**P5 这一转换点富集 HvNF-YB10、HvERF61、HvMADS33、HvMADS42**（PDF p7）
10. **营养期 vs 生殖期的"抑制功能"切换**：营养期 Fo（LFo）以 **HvCRC** 为最早标志且 HvKN1 不恢复；生殖期 TSM Fo 用 **HvLOG1 + VRS4 + COM1**；**TSM 突起后 HvKN1 与 HvHD-zip 重新表达**，**HvCOM1 表达则标志穗轴（rachilla）形成**（Fig. 8a vs b, PDF p12）

**是否含力学或生长数据交叉分析**（如实回答）
- **完全没有力学数据。** 检索 mechanic / stiffness / turgor / force / biomechan / cell wall —— 命中全部为技术性描述（原生质体壁酶解、"differences in cell wall composition"、"CUC3 标记远轴边界"）；**无 AFM、无细胞壁刚度、无膨胀压、无壁张力**。
- **无形态素/激素浓度梯度测定**（未做 auxin 报告基因或浓度梯度实验；仅在引言中提及 "Local auxin accumulation and absence of KN1 expression mark organ initiation"，PDF p2）。
- **有"生长"但不含量化**：文中唯一与生长直接挂钩的是**发育阶段划分**——"second, rapid growth occurs during P11–P15 without significant changes in gene expression"（PDF p7）以及 "Between P11 and P17–P19, we observed organ growth, but no specific marker genes were detected until floret organs started to differentiate (P17–P19)"（PDF p9）。这是**转录静默窗口**的定性描述，没有生长速率、细胞分裂速率或体积测量的定量对应。
- **唯一可视为"几何/界面"量化的是切面几何本身**（"cell shape, cell size and cell neighbourhoods will be considered" 明确被列为**未来工作**，PDF p13）。
- **对本论文的意义**：与新-35 相同，这篇**不能当"联用"证据**，但 **"P11–P15 快速生长伴随转录静默"** 是一个极好的**待检验接口假设**——可以据此提出"形态发生速率的高峰期与转录重编程窗口错位，提示形态速率可能主要由非转录机制（壁性质/膨压）驱动"，从而自然引出对力学数据的需求。这比直接说"该文无力学数据"要有建设性得多。

**可引用句**（英文原句照抄 + PDF 物理页码）

1. "We could precisely localize and quantify transcripts of 86 genes on tissue sections at cellular resolution using the Molecular Cartography (MC) platform for multiplexed single-molecule RNA fluorescence in situ hybridization (smRNA-FISH). We integrated the scRNA-seq and smRNA-FISH data to generate imputed transcriptome-wide single-cell expression matrices." —— PDF p2
2. "We detected transcripts from 86 genes tested, with a spatial resolution of <140 nm." —— PDF p3
3. "The spatial resolution of quantitative spatial gene expression analysis is limited... we used the spatially resolved quantitative data as anchors and mapped each cell in the scRNA-seq dataset to its nearest neighbour in the MC dataset." —— PDF p5（原文 "Current technologies for quantitative spatial gene expression analysis are limited by probe number, sensitivity in molecularly crowded environments and retention or transferability of RNA to capture devices"，PDF p5 首句）
4. "In the IM, HvKN1 is absent in founder cells (Fo) of the TSM primordium, providing an early marker for Fo cell specification." —— PDF p5
5. "This allowed us to subdivide spikelet development into three phases: first, SM identity is defined by transcriptional reprogramming in cells of the early spikelet primordia...; second, rapid growth occurs during P11–P15 without significant changes in gene expression; and third, the FM undergoes differentiation, with changes in the gene expression marking the differentiation of the floret organs (GyP and StPs)." —— PDF p7
6. "Barley spikelet primordia develop in a distichous arrangement, with a developmental gradient along the apical–basal axis." —— PDF p7
7. "HvKN1-positive tunica cells are located at the tips of IMs and SMs, whereas tunica cells in leaf primordia tips of the vSAM lacked HvKN1 expression. Expressions of HvKN1 and HvLOG1 correlate and might generate a cytokinin source in meristem tip tunica cells (but not those in the tips of leaf primordia). Hypothetically, such a local cytokinin peak could establish the WUS/WOX expression domains in the IM and newly formed SMs to provide a feedback signal that maintains HvKN1 expression, thereby acting as a local organizer that promotes meristem maintenance from the outermost cell layer." —— PDF p13
8. "For a dataset as complex as the barley inflorescence, scRNA-seq data from 10,000 cells and 20 anchor genes were sufficient for gene expression imputation." —— PDF p12
9. "BARVISTA currently offers only a snapshot of barley development, with expression data for specific developmental time points limited to two dimensions." —— PDF p13

**证据强度**：**中—强**
- 强在：(1) 插补方法**做了严格的自验证与模拟验证**（CS 0.73–0.84，并用 hold-out 设计排除锚基因循环论证）；(2) 定位精度 <140 nm、单分子级，与 scRNA-seq 的 marker 互相印证；(3) 找到了此前不可见的 **tunica 内 KN1⁺ 亚群**（9%），这是一个真正新的"细胞类型/微环境"发现，且与 KN1 蛋白可经胞间连丝进入 L1 的经典文献形成机制闭环；(4) KN1 缺失 + CRC/YABBY/VRS4 极性组合在两个物种（玉米/水稻已有文献 + 大麦实验数据）之间互相印证。
- 弱在：(1) **插补的 48,904 基因中只有 86 个是真实空间测量值**，其余全靠最近邻加权平均，属于**推断而非观测**，引用时必须区分；(2) 空间数据只有 2D 切片 + 2 个时期（W0.5、W3.5），时间维靠拟时序补；(3) 原生质体化引入 3,684 个差异基因，作者虽做了校正，但这类偏差在禾本科组织中系统存在；(4) ABCDE 类别是**由拟时序推断的假说**，非遗传学验证；(5) 分支突变体分析用的是表达条形码相似性，不是直接的细胞命运谱系追踪。

**局限**
1. 插补矩阵的绝大部分基因无独立空间验证；作者自己在 Discussion 里讨论了锚基因选择的局限（PDF p12）
2. 只到二维；"three- and four-dimensional reconstruction" 与"cell shape, cell size and cell neighbourhoods" 均为**明确的未来工作**（PDF p13）
3. 依赖强玻管壁消化，组织完整性未在切片上同时保留（scRNA-seq 与 smRNA-seq 来自不同样品，位置对应靠统计推断而非同一组织）
4. 表达锚 + 插补对"细胞类型比例异常"或"细胞位置被机械位移"的场景敏感
5. 无遗传学验证：所有 MADS 类别、KN1–LOG–WOX 反馈模型均为相关性推断
6. 单品种单基因型（Golden Promise），未涵盖发育梯度变体

**对我论文的作用**
- **作为 §5.1 的"技术/方法学"支撑**：可与新-35 配对，形成"**成像型（小麦，观测）+ 测序型插补（大麦，推断）两条互补路线**"的论述，说明单细胞分辨率空间转录组已可覆盖禾本科花序的"定位置"问题。
- **提供最强的"位置信息 = 分子缺口"的实例**：HvKN1 在 Fo 中的**成片缺失**（不是低表达，而是明确的负域）是"位置信息"最干净的可引用分子证据。若 §5.1 需要一句"位置信息如何被读取"，"In the IM, HvKN1 is absent in founder cells (Fo) of the TSM primordium, providing an early marker for Fo cell specification"（PDF p5）几乎可以直接用。
- **提供"边界极性"的机制版本**：CRC 远轴 / YABBY 近轴 / VRS4+LOG1 近轴顶端——把"分生组织—器官界面"从描述性的 ED 变成**极性化的分子方框**，可直接用于讨论"形态边界如何由互斥的边界因子划定"。
- **最有价值的建设性接口**：**"P11–P15 快速生长而转录静默"**。这一句（PDF p7）可以作为 §5.1 的**收尾钩子**——明确指出现有空间组学能定位"何时开始分化"，却**无法解释"何时长得最快"**，因为形态发生速率的度量（生长速率、细胞体积、壁性质、膨压）完全不在这些数据集里。这样力学数据（CSLD5 那类）就成为**逻辑上必需的补充**，而不是可选的修饰。
- **不可用作**："空间组学 + 力学已联用"的任何表述。

**数据可得性**
- **元数据**：https://doi.org/10.60534/zfdth-2g147 （NRW research data repository，"Metadata associated with this investigation can be accessed at"，PDF p12）
- **交互式图谱 BARVISTA**：https://www.plabipd.de/projects/hannah_demo/Barvista.html （支持虚拟显微切割、UMAP、任意细胞子集的表达查询；PDF p12）
- **代码**：**"The code is available upon request to the authors."**（PDF p12）——**这是相对新-35 的明显短板**，无公开 GitHub
- 论文引用的相关工具为公开：PERSIST（github.com/iancovert/persist）、Resolve Biosciences 分割流程、ImageJ 1.8.0_322
- scRNA-seq 数据：**正文中未见明确的 GEO/SRA/ENA 登录号**，PRJNA/E-MTAB 号未在可提取文本中出现；引用数据前建议直接查 https://doi.org/10.60534/zfdth-2g147 确认
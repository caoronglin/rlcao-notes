# 第 2-3 节事实核查报告

## 核查范围与方法

正文 `paper/paper.md` 第 36–92 行（## 2 背景知识 / ## 3 研究综述），涉及引用 [1]–[17]。

**编号映射说明**：`refs/manifest.json` 的文件名前缀顺序与正文参考文献编号顺序**不一致**。正文参考文献编号 → 本地 PDF 文件对应关系如下（核查即按此映射）：

| 正文编号 | PDF 文件 | 说明 |
|---|---|---|
| [1] | `04_s41467-024-48361-7_DA1_WUS_SAM_size.pdf` | DA1 / WUS |
| [2] | `10_science_ade8055_mechanics_of_plant_morphogenesis.pdf` | Coen & Cosgrove |
| [3] | `09_s41580-023-00691-y_cell_wall_structure_growth.pdf` | Cosgrove |
| [4] | `01_dev200787_CLV3_CLE16_CLE17.pdf` | CLE16/17 |
| [5] | `02_s41477-023-01485-y_CLAVATA_receptors.pdf` | CLAVATA 受体网络 |
| [6] | `05_koae312_KNUCKLES_floral_meristem.pdf` | KNUCKLES |
| [7] | `16_annurev_cellbio_020823_011522_morphogens.pdf` | Kicheva & Briscoe |
| [8] | `03_dev202014_local_auxin_shoot_patterning.pdf` | TAA1/TAR2 |
| [9] | `06_s41477-022-01111-3_leaf_dorsiventrality.pdf` | Burian |
| [10] | `08_s41467-024-51099-x_water_fluxes_meristem.pdf` | Alonso-Serra |
| [11] | `18_kiac370_ARF3_meristem_proliferation.pdf` | ARF3 |
| [12] | `07_pnas2321877121_CUC1_auxin_module.pdf` | CUC1 |
| [13] | `14_s41477-022-01218-7_cellulose_synthase_microtubule.pdf` | Schneider |
| [14] | `11_sciadv_abm4974_microtubule_mechanical_conflicts.pdf` | Stöckle |
| [15] | `13_devcel_2024_mechanical_forces_division.pdf` | Hoermayer |
| [16] | `12_s41467-023-36739-y_ECM_growth_anisotropy.pdf` | Harmansa |
| [17] | `15_annurev_cellbio_120420_095337_mechanochemical.pdf` | Bailles |

18 篇 PDF 本地全部存在（含 manifest 中标 `status: fail` 的 6 篇，均为手动补齐）。全部使用 `pdftotext` 逐页定位，页码为 PDF 物理页。

## 汇总

核查表述数：**46**　发现不一致：**4**　强度过强：**3**　未核实：**0**

---

## 逐条结果

### [1] §2.1 WUS 特异表达于组织中心（OC），WUS 功能缺失导致干细胞特性丧失、分生组织早衰

- **判定**：✅ 与原文一致
- **原文依据**：`04_...DA1_WUS_SAM_size.pdf` PDF 物理页 1–2："WUS is specifically expressed in the OC, and the null mutations in WUS result in loss of stem cell properties and premature termination of the shoot apical meristem"

### [1] §2.1 相反，在 CZ 诱导 WUS 表达可使分生组织增大

- **判定**：✅ 与原文一致
- **原文依据**：`04_...pdf` PDF 物理页 1："Conversely, induction of WUS in the central zone leads to increased apical meristem size"
- **备注**：原文为"increased apical meristem size"，正文"使分生组织增大"忠实。

### [1] §2.1 CLV3 与其受体 CLV1、CLV2 构成的信号级联则把 WUS 限制在 OC 内，该级联失活同样造成分生组织变大

- **判定**：✅ 与原文一致
- **原文依据**：`04_...pdf` PDF 物理页 1–2："WUS expression is inhibited by a signaling cascade involving the diffusible peptide CLAVATA3 (CLV3) that binds to the transmembrane receptor kinase CLV1 and receptor-like protein CLV2… Loss of function of this cascade leads to larger meristems due to WUS over-expression"
- **备注**：受体名称与分工（CLV1 为受体激酶、CLV2 为受体样蛋白）正文概括为"受体 CLV1、CLV2"，可接受。

### [1] §2.1 WUS 还以 HAM 转录因子形成异二聚体，共同把 CLV3 的表达限制在顶层细胞

- **判定**：✅ 与原文一致
- **原文依据**：`04_...pdf` PDF 物理页 2："WUS functions as a heterodimer with HAIRY MERISTEM (HAM) transcription factors… WUS-HAM heterodimers confine CLV3 expression to the outer apical meristem layer"
- **备注**：原文用词为 "outer apical meristem layer"（最外层 / L1 层）。正文译作"顶层细胞"，语义方向一致但表述略含糊，建议改为"最外层（L1）"。

### [4] §2.1 CLE16 与 CLE17 两个 CLV3 相关小肽在 clv3 缺失时部分代偿其功能

- **判定**：✅ 与原文一致
- **原文依据**：`01_dev200787_...pdf` PDF 物理页 1 摘要："CLE16 and CLE17 function in a mechanism that partially compensates for CLV3"；正文段（PDF 物理页 2）："CLE16 and CLE17 partially compensate for CLV3 activity in stem cell maintenance"

### [4] §2.1 通过受体激酶 BAM 亚群作用于 WUS 上游

- **判定**：✅ 与原文一致
- **原文依据**：`01_...pdf` PDF 物理页 1 摘要："CLE16 and CLE17 signal through a subset of CLV3 receptors, the BARELY ANY MERISTEM (BAM) receptor kinases, and act upstream of WUS"
- **备注**：基因/蛋白名写法（BAM、BARELY ANY MERISTEM、CLE16、CLE17）与原文全大写斜体小写形式一致。

### [4] §2.1 独立贡献于 SAM 维持与器官发生

- **判定**：✅ 与原文一致
- **原文依据**：`01_...pdf` PDF 物理页 1 摘要："CLE16 and CLE17 contribute independently to SAM maintenance and organ production in clv3 plants"

### [5] §2.1 CLAVATA 信号……不只负调控中央区增殖，还是生长素依赖的花原基发生所必需

- **判定**：✅ 与原文一致
- **原文依据**：`02_...CLAVATA_receptors.pdf` PDF 物理页 1 摘要："central zone stem cell proliferation in inflorescence meristems is negatively regulated by the CLAVATA3 (CLV3) peptide signaling pathway. In contrast, floral primordia formation on meristem flanks requires the hormone auxin. Here we show that CLV3 signaling is also necessary for auxin-dependent floral primordia generation"
- **备注**：正文称"CLAVATA 信号"，原文此处特指 CLV3 信号通路（属 CLAVATA 系统），可接受。

### [5] §2.1 且这一功能可被花序簇生与热诱导的生长素合成所掩盖

- **判定**：✅ 与原文一致
- **原文依据**：`02_...pdf` PDF 物理页 1 摘要："this function is partially masked by both inflorescence fasciation and heat-induced auxin biosynthesis"
- **备注**：正文漏掉"部分（partially）"这一限定语，但"可被…掩盖"本身也未断言完全掩盖，属可接受；若求严谨可补"部分"。

### [5] §2.1 受体之一 CLAVATA1 在较冷环境下另参与生长素依赖的分生组织维持

- **判定**：✅ 与原文一致
- **原文依据**：`02_...pdf` PDF 物理页 1 摘要："we uncover a novel role for the CLV3 receptor CLAVATA1 in auxin-dependent meristem maintenance in cooler environments"
- **备注**：原文用 "novel role"，正文"另参与"措辞恰当，未夸大为首次发现。

### [6] §2.1 花分生组织阶段 6，C2H2 型锌指蛋白 KNUCKLES（KNU）直接抑制 WUS 与 CLV3，废除维持 FM 所需的 WUS–CLV3 反馈环

- **判定**：✅ 与原文一致
- **原文依据**：`05_koae312_...pdf` PDF 物理页 1 摘要："KNUCKLES (KNU), a C2H2-type zinc finger protein, crucially regulates FM termination by directly repressing the expression of both the stem cell identity gene WUSCHEL (WUS) and the stem cell marker gene CLAVATA3 (CLV3) to abolish the WUS-CLV3 feedback loop required for FM maintenance"
- **备注**：基因名拼写 KNUCKLES（蛋白）/ KNU（基因）、WUSCHEL（WUS）、CLAVATA3（CLV3）均与原文一致。

### [6] §2.1 KNU 还直接抑制生长素转运蛋白基因 PIN1 与细胞分裂素合成基因 IPT7，经 H3K27me3 沉积改变两者活性

- **判定**：✅ 与原文一致
- **原文依据**：`05_...pdf` PDF 物理页 1 摘要："KNU directly represses the auxin transporter gene PIN-FORMED1 (PIN1) and the cytokinin biosynthesis gene ISOPENTENYLTRANSFERASE7 (IPT7) via mediating H3K27me3 deposition on these 2 loci to regulate auxin and cytokinin activities"；正文结果部分（PDF 物理页 8 前后）另给出 ChIP + 双荧光素酶 + ChIP-qPCR 的直接结合证据（"KNU directly binds to the P2-3 fragment of PIN1"、"KNU directly repress IPT7"）
- **备注**："直接"这一强断言在原文中有 ChIP、EMSA、双荧光素酶三重证据支撑，成立。

### [6] §2.1 保证 FM 按时终止

- **判定**：✅ 与原文一致
- **原文依据**：`05_...pdf` PDF 物理页 1 摘要："thus securing the timed FM termination"

### [7] §2.2 形态发生素梯度是位置信息的经典范式：长程作用的信号分子在组织中形成浓度分布，为细胞提供位置坐标

- **判定**：⚠️ 强度过强（轻微）
- **原文依据**：`16_annurev_...morphogens.pdf` PDF 物理页 2："morphogens are molecules that spread from localized sources to form concentration gradients and control cell fate in a concentration-dependent manner"（这是该文所称的**早期观点**）；紧接："Subsequent advances in our understanding of tissue development suggest a more versatile picture… morphogen gradients can form from distributed sources, be interpreted in a concentration-independent manner"；"we adopt a broad view of morphogens as molecules that act at a long range to control cell properties and provide spatial information"
- **问题**：原文明确把"形成浓度分布并以浓度依赖方式决定命运"表述为**已被修正的初始图景**，并采用更宽泛的定义（长程作用、提供空间信息、不必依赖浓度梯度）。正文只保留了"经典范式"一半，砍掉了"浓度分布"的限定，且未提浓度非依赖性。
- **建议**：改为"形态发生素是长程作用、为发育组织提供位置信息的信号分子（morphogen）；经典的'局部源—浓度梯度—命运'模型是其最初表述，而后续研究表明梯度可来自分布式源、也可被非浓度依赖性地读取（Kicheva & Briscoe）"。

### [8] §2.2 TAA1 与 TAR2 两个色氨酸氨基转移酶家族基因介导的局部生长素合成，与运输协同调控 SAM 模式化

- **判定**：✅ 与原文一致
- **原文依据**：`03_dev202014_...pdf` PDF 物理页 1 摘要："meristem patterning and floral organ primordia formation, besides auxin transport, are regulated by auxin biosynthesis mediated by two closely related genes of the TRYPTOPHAN AMINOTRANSFERASE family… TAA1 and TAR2"；"local auxin biosynthesis, in concert with transport, controls the patterning of the SAM"
- **备注**：基因名 TAA1、TAR2 拼写与原文一致。

### [8] §2.2 当合成与运输同时缺失，CZ、PZ、RM 的标志基因表达图式被扰乱

- **判定**：✅ 与原文一致
- **原文依据**：`03_...pdf` PDF 物理页 1 摘要："In the absence of auxin biosynthesis and transport, the expression pattern of the marker genes linked to the patterning of the SAM is perturbed. Our results prove that local auxin biosynthesis, in concert with transport, controls the patterning of the SAM into the CZ, PZ and RM"
- **备注**：分区缩写 CZ、PZ、RM 与原文一致。

### [9] §2.2 叶原基近轴—远轴极性的建立长期有争议

- **判定**：✅ 与原文一致
- **原文依据**：`06_...leaf_dorsiventrality.pdf` PDF 物理页 1 摘要："Despite its central importance, the mechanism by which leaf primordia acquire adaxial versus abaxial cell fates to establish dorsiventrality remains a topic of much debate"

### [9] §2.2 Burian 等用延时共聚焦成像、细胞谱系追踪与遗传分析证明

- **判定**：✅ 与原文一致
- **原文依据**：`06_...pdf` PDF 物理页 1 摘要："by combining time-lapse confocal imaging, cell lineage tracing and molecular genetic analyses"

### [9] §2.2 在原基出现前数个叶间隔期，AS2–KAN1 组成的"分生组织预模式"上出现高生长素积累

- **判定**：✅ 与原文一致
- **原文依据**：`06_...pdf` PDF 物理页 1 摘要："a stable boundary between adaxial and abaxial cell fates is specified several plastochrons before primordium emergence when high auxin levels accumulate on a meristem prepattern formed by the AS2 and KAN1 transcription factors"
- **备注**：基因名 AS2、KAN1 与原文一致（原文全大写 AS2/KAN1）；正文用"数个叶间隔期"对应 "several plastochrons"，忠实。

### [9] §2.2 触发 ARF3 的瞬时诱导与生长素转录响应，从而区分近轴与远轴身份

- **判定**：✅ 与原文一致
- **原文依据**：`06_...pdf` PDF 物理页 1 摘要："This occurrence triggers a transient induction of ARF3 and an auxin transcriptional response in AS2-marked progenitors that distinguishes adaxial from abaxial identity"
- **备注**：ARF3 拼写一致。

### [9] §2.2 输入到该区域的生长素是均匀的，空间信息来自预模式本身

- **判定**：✅ 与原文一致
- **原文依据**：`06_...pdf` PDF 物理页 1 摘要（标题即为 "prepatterned binary readout of a uniform auxin input"）："spatial information from an AS2–KAN1 meristem prepattern governs the conversion of a uniform auxin input into an ARF-dependent binary auxin response output"；"Auxin thus serves as a single morphogenic signal"

### [10] §2.2 Alonso-Serra 等绘制了拟南芥茎尖的细胞体积生长图，发现器官-分生组织边界处有一亚群细胞收缩

- **判定**：✅ 与原文一致
- **原文依据**：`08_...water_fluxes_meristem.pdf` PDF 物理页 1 摘要："we mapped cell volumetric growth across the shoot apex in Arabidopsis thaliana. We found that, as organs grow, a subpopulation of cells at the organ-meristem boundary shrinks"
- **备注**：物种正确（Arabidopsis thaliana），部位正确（shoot apex，非根/叶）。

### [10] §2.2 整合水力学与力学的模拟预测了边界细胞的水分亏缺

- **判定**：✅ 与原文一致
- **原文依据**：`08_...pdf` PDF 物理页 1 摘要："Growth simulations using a model that integrates hydraulics and mechanics revealed water fluxes and predicted a water deficit for boundary cells"

### [10] §2.2 体内水溶性染料优先分配至快速生长组织而无法进入边界域

- **判定**：✅ 与原文一致
- **原文依据**：`08_...pdf` PDF 物理页 1 摘要："In planta, a water-soluble dye preferentially allocated to fast-growing tissues and failed to enter the boundary domain"

### [10] §2.2 且该收缩在不同生长条件与不同拓扑下均稳健

- **判定**：✅ 与原文一致
- **原文依据**：`08_...pdf` PDF 物理页 1 摘要："Cell shrinkage next to fast-growing domains was also robust to different growth conditions and different topographies"

### [10] §2.2 边界的分子印记亦支持水分亏缺

- **判定**：✅ 与原文一致
- **原文依据**：`08_...pdf` PDF 物理页 1 摘要："a molecular signature of water deficit at the boundary confirmed our conclusion"

### [10] §2.2 作者据此提出：新生器官的汇强度差异规定了水力图式，从而划定茎尖的边界域

- **判定**：✅ 与原文一致
- **原文依据**：`08_...pdf` PDF 物理页 1 摘要："we propose that the differential sink strength of emerging organs prescribes the hydraulic patterns that define boundary domains at the shoot apex"
- **备注**：措辞"汇强度"（sink strength）准确。

### [11] §2.3 ARF3……在 SAM 外周由生长素激活，以细胞自主方式调控分生组织—器官边界基因 CUC1-3、BOP1-2、TEC3，决定器官的规则排列即叶序

- **判定**：✅ 与原文一致
- **原文依据**：`18_kiac370_...pdf` PDF 物理页 1 摘要："ARF3 expression in Arabidopsis is mainly activated at the periphery of the SAM by auxin where ARF3 cell autonomously regulates the expression of meristem–organ boundary-specific genes, such as CUP-SHAPED COTYLEDON1-3 (CUC1-3), BLADE ON PETIOLE1-2 (BOP1-2), and TARGETS UNDER ETTIN CONTROL3 (TEC3) to regulate the arrangement of organs in regular pattern, a phenomenon referred to as phyllotaxis"
- **备注**：基因名连字符范围式写法 CUC1-3、BOP1-2、TEC3 与原文一致（原文亦为 CUC1-3 / BOP1-2 形式，正文斜体化即可）。

### [11] §2.3 同时 ARF3 蛋白被转运进入组织中心，以非细胞自主方式抑制细胞分裂素活性与 WUS 表达

- **判定**：✅ 与原文一致
- **原文依据**：`18_...pdf` PDF 物理页 1 摘要："ARF3 is translocated into the organizing center where it represses cytokinin activity and WUSCHEL expression to regulate meristem activity noncell-autonomously"
- **备注**：组织中心（OC）对应正确。

### [11] §2.3 同一个分子在两个尺度上作用，使生长素与细胞分裂素信号得以协调，平衡"维持分生组织"与"产生器官"

- **判定**：✅ 与原文一致
- **原文依据**：`18_...pdf` PDF 物理页 1 摘要："ARF3 acts as a molecular link that mediates the interaction of auxin and cytokinin signaling in the SAM while coordinating the balance between meristem maintenance and organogenesis"

### [12] §2.3 拟南芥与碎米荠的单叶—复叶差异关键在 ChCUC1 的图式化表达

- **判定**：✅ 与原文一致
- **原文依据**：`07_pnas2321877121_...pdf` PDF 物理页 1："between leaf shape differences between Arabidopsis thaliana, which has simple leaves, and its relative Cardamine hirsuta that has complex leaves divided into leaflets. We show that patterned expression of the transcription factor CUP-SHAPED COTYLEDON1 in C. hirsuta (ChCUC1) is a key determinant of leaf shape differences between the two species"
- **备注**：物种对应正确（Arabidopsis = 单叶、Cardamine hirsuta = 复叶）；基因名 ChCUC1 与原文一致。

### [12] §2.3 ChCUC1 经转录激活 WAG 激酶（调控 PIN 极性）向叶缘生长素图式提供指令性输入

- **判定**：✅ 与原文一致
- **原文依据**：`07_...pdf` PDF 物理页 1 Significance 段："ChCUC1 provides instructive input into auxin-based leaf margin patterning. This input arises via transcriptional regulation of multiple auxin homeostasis components, including direct activation of WAG kinases that are known to regulate the polarity of PIN-FORMED auxin transporters"
- **备注**：基因名 WAG、PIN-FORMED（PIN）与原文一致。

### [3] §3.1 细胞生长的物理定义是细胞大小的不可逆增加，这要求细胞壁表面不可逆扩大

- **判定**：✅ 与原文一致
- **原文依据**：`09_...cell_wall_structure_growth.pdf` PDF 物理页 2："as an irreversible increase in cell size, requiring an irreversible surface expansion"

### [3] §3.1 Cosgrove 的综述把这一过程表述为一个闭环：壁松弛导致应力松弛与膨压轻微下降，触发水分流入，膨压恢复并使细胞扩大；其中壁的不可逆屈服(creep)居于核心位置

- **判定**：✅ 与原文一致
- **原文依据**：`09_...pdf` PDF 物理页 2："Wall loosening and consequential stress relaxation create the impetus for cellular water absorption by reducing turgor pressure… This reduces turgor pressure slightly, initiating cellular water influx, which restores turgor and enlarges the cell… wall yielding (shown here as sliding) lies at the heart of cell wall growth"
- **备注**："居于核心位置"对应 "lies at the heart"，准确。

### [3] §3.1 膨压虽各向等同，但因细胞形状与壁厚差异，壁内拉应力分布并不均一

- **判定**：✅ 与原文一致
- **原文依据**：`09_...pdf` PDF 物理页 2："Although turgor force is isotropic (the same in all directions), the resultant wall stresses differ spatially in magnitude and direction as a consequence of cell shape and variations in wall thickness"

### [3] §3.1 主要承力的是纤维素网络，通过纤维素微纤维间的直接接触传递张力

- **判定**：✅ 与原文一致
- **原文依据**：`09_...pdf` PDF 物理页 2 与 10："It is commonly recognized that cellulose microfibrils bear most of the tensile load in the wall"（PDF 物理页 10）；PDF 物理页 2："the cell wall itself can form a strong yet extensible fibrous network through lateral binding between cellulose microfibrils… a bit like an extension ladder"；PDF 物理页 9："When aligned in the same direction, cellulose microfibrils spontaneously bind together to form bundles and a strong, coherent network"

### [3] §3.1 木葡聚糖与果胶虽占据壁的大部分截面积，却因力学较弱而承载很小张力

- **判定**：❌ **不一致——截面积的归属说反了**
- **原文依据**：`09_...pdf` **PDF 物理页 10**："tensile stresses in the wall are borne primarily by the cellulose network, **which constitutes only a small fraction of wall cross-sectional area**. Consequently, stresses within the cellulose network are calculated to be much larger than nominal wall stress"
- **问题**：原文说**纤维素**只占壁截面积的**一小部分**（因而承担了绝大部分拉应力、其内部应力远高于名义壁应力）。正文写成"木葡聚糖与果胶占据壁的大部分截面积"，方向恰好相反。虽然"基质多糖占据大部分截面积"这一推论在逻辑上并非绝对错误（由"纤维素只占小部分"可推出），但把它作为原文断言来陈述，且与前一句"主要承力的是纤维素网络"并置时，会让读者误以为原文是在讲基质多糖的截面积优势作为其承载小的原因——而原文强调的恰恰是"截面积小却承载大"这一反直觉点。这是最容易误导读者的一处。
- **建议**：改为"主要承力的是纤维素网络，它通过微纤维间的直接接触传递张力；值得注意的是纤维素网络只占壁截面积的**一小部分**，因此其内部应力被算出远高于名义壁应力。木葡聚糖与果胶的杨氏模量分别约 4 GPa 与 2 GPa，远低于结晶纤维素的约 100 GPa，因而几乎不直接承载张力"。

### [3] §3.1 木葡聚糖与果胶……它们可能通过影响纤维素如何组装成承力网络而间接调节壁的力学

- **判定**：✅ 与原文一致
- **原文依据**：`09_...pdf` PDF 物理页 13："Changes in pectin structure may modify wall assembly, mechanics and growth **indirectly**, for example, by affecting (1) cellulose bundling and network formation… (2) the mobility of wall-loosening proteins such as expansins and their access to load-bearing cellulose junctions… and (3) wall hydration"
- **备注**："间接"这一限定在原文中明确出现，正文正确保留为"间接调节"。模量数值（100 GPa / 4 GPa / 2 GPa）见 PDF 物理页 9，若要补入可直接引用。

### [3] §3.1 这一结论修正了"木葡聚糖系绳是主要承力环节"的传统图景

- **判定**：✅ 与原文一致
- **原文依据**：`09_...pdf` PDF 物理页 2："This has revised traditional notions of matrix polysaccharides (hemicelluloses and pectins, **previously thought to be key load-bearing links** between cellulose microfibrils) and the basis of wall extensibility"

### [3] §3.1 生长素经核内外信号快速促进壁酸化，低 pH 激活 α-扩张蛋白（expansin）以实现壁松弛

- **判定**：✅ 与原文一致
- **原文依据**：`09_...pdf` PDF 物理页 2："auxin rapidly stimulates wall acidification through nuclear and extranuclear signalling pathways, and the low wall pH promotes wall loosening by activating expansin proteins"
- **备注**："核内外信号"对应 "nuclear and extranuclear signalling pathways"，准确。

### [3] §3.1 RALF 小肽结合 FERONIA 则抑制质子泵、升高壁 pH、抑制生长

- **判定**：✅ 与原文一致
- **原文依据**：`09_...pdf` PDF 物理页 2："the binding of rapid alkalinization factor (RALF) peptides to the extracellular domain of FERONIA, a plasma membrane receptor kinase, inhibits the proton pump, raising wall pH, decreasing expansin action and inhibiting wall growth"
- **备注**：基因/蛋白名 RALF、FERONIA 与原文一致。

### [3] §3.1 遗传或化学手段干扰纤维素合成会激活 THESEUS1 等壁传感器

- **判定**：✅ 与原文一致
- **原文依据**：`09_...pdf` PDF 物理页 13："genetic or chemical impairment of cellulose synthesis activates THESEUS1, a RLK that spans the plasma membrane and interacts with the wall through an extracellular carbohydrate-binding domain"
- **备注**：基因名原文为 "THESEUS1"（连写大写），正文一致。

### [3] §3.1 近期一项统计列出拟南芥 13 个候选壁传感器基因

- **判定**：✅ 与原文一致
- **原文依据**：`09_...pdf` PDF 物理页 13："A recent review listed 13 A. thaliana genes implicated as wall sensors, and more will probably be added in the coming years"
- **备注**：原文为"另一篇近期综述列出"，正文用"近期一项统计"暗示本文之外的统计，尚可；更准确可写"另一篇近期综述列出"。

### [3] §3.1 它们连接到脱落酸、水杨酸、茉莉酸与油菜素内酯等多条信号通路

- **判定**：✅ 与原文一致
- **原文依据**：`09_...pdf` PDF 物理页 13："signalling pathways involving multiple wall sensors that detect cell wall status and initiate signalling by abscisic acid, salicylic acid, jasmonic acid and brassinosteroids"
- **备注**：四种激素名称与顺序均与原文一致。

### [3] §3.2 生长方向性由纤维素排列方向控制：随机排列对应均匀膨胀，高度定向排列对应定向伸长

- **判定**：✅ 与原文一致
- **原文依据**：`09_...pdf` PDF 物理页 4（Fig. 1 说明）："Growth directionality is partly controlled by cellulose direction, which may be random (isotropic) or highly directional (anisotropic)"
- **备注**：原文用 "partly controlled"（部分由……控制），正文写"由纤维素排列方向控制"省略了"部分"。因"方向性"在原文中明确是不完全归因于纤维素，此处属轻微收紧，建议补"部分"。

### [3] §3.2 纤维素方向由皮层微管引导的纤维素合酶复合体（CSC）决定

- **判定**：✅ 与原文一致
- **原文依据**：`09_...pdf` PDF 物理页 9（Fig. 3 说明）："Linker proteins connect CSCs with cortical microtubules, which guide the direction of CSC movement"
- **备注**：缩写 CSC 与原文一致。

### [13] §3.2 Schneider 等发现，子叶表皮发育早期，CSC 的数量与运动方向密切镜像微管组织

- **判定**：✅ 与原文一致
- **原文依据**：`14_...cellulose_synthase_microtubule.pdf` PDF 物理页 1 摘要："the number and movement directions of cellulose synthase complexes (CSCs) at the plasma membrane vary during initial stages of development in the **cotyledon epidermis** of Arabidopsis, closely mirroring the microtubule organization"
- **备注**：部位正确（子叶表皮），未误说成叶表皮成体细胞。

### [13] §3.2 解耦两者后，由细胞形状或组织尺度物理扰动驱动的微管共对齐反而增强

- **判定**：✅ 与原文一致
- **原文依据**：`14_...pdf` PDF 物理页 1 摘要："Uncoupling microtubules and CSCs resulted in **enhanced** microtubule co-alignment as caused by mechanical stimuli driven either by cell shape or by tissue-scale physical perturbations"
- **备注**：方向性（解耦后**增强**）正确，未写反。

### [13] §3.2 且微机械扰动导致 CSC 从质膜流失

- **判定**：✅ 与原文一致
- **原文依据**：`14_...pdf` PDF 物理页 1 摘要："micromechanical perturbation resulted in depletion of CSCs from the plasma membrane"
- **备注**：正文"导致"为确定式表述，原文用 "suggesting a possible link"（提示可能机制），但对"扰动导致 CSC 从质膜流失"这一现象本身，原文是直接陈述（resulted in），正文在现象层面准确。

### [13] §3.2 作者据此提出，CSC 与皮层微管的互作构成细胞壁—质膜—细胞骨架的物理连续体

- **判定**：✅ 与原文一致
- **原文依据**：`14_...pdf` PDF 物理页 1 摘要："our results **suggest** that the interaction of cellulose synthase with cortical microtubules forms a physical continuum between the cell wall, plasma membrane and the cytoskeleton that modulates the mechano-response of the cytoskeleton"
- **备注**：正文用"作者据此提出"承接了原文的 "suggest"，强度恰当。

### [14] §3.2 微管沿最大应力方向对齐是长期观察，但该结论主要来自对 SAM 表皮（细胞受强张力、未完全分化）的分析

- **判定**：✅ 与原文一致
- **原文依据**：`11_sciadv_abm4974_...pdf` PDF 物理页 1 Introduction："Cortical microtubules align with maximal tensile stress in plant tissues… **These conclusions were drawn from the analysis of the epidermal surface of the shoot apical meristem, where cells are under strong tension and not fully differentiated.**"
- **备注**：原文确为 SAM **表皮**，正文"对 SAM 表皮（细胞受强张力、未完全分化）的分析"逐词对应。

### [14] §3.2 在组织内部从头发生形态建成的过程中，细胞如何探测并整合机械信号仍不清楚

- **判定**：✅ 与原文一致
- **原文依据**：`11_...pdf` PDF 物理页 1："However, it remains poorly understood how plant cells detect and integrate mechanical signals during **de novo morphogenesis within a tissue**"

### [14] §3.2 Stöckle 等在侧根起始系统中给出了部分答案：面向侧根起始细胞的内皮层微管阵列有序度高于同一细胞的相反一侧

- **判定**：✅ 与原文一致
- **原文依据**：`11_...pdf` PDF 物理页 1 摘要："microtubule arrays facing lateral root founder cells display a higher order compared to arrays on the opposite side of the same cell"
- **备注**：系统正确（侧根起始 / lateral root initiation），方向正确（面向起始细胞的一侧有序度更高）。

### [14] §3.2 这种不对称为内皮层重塑与侧根起始所必需，而 MAP70-5 是建立该空间限定微管组织的必要因子

- **判定**：✅ 与原文一致
- **原文依据**：`11_...pdf` PDF 物理页 1 摘要："this asymmetry is **required for** endodermal remodeling and lateral root initiation. We identify that MICROTUBULE ASSOCIATED PROTEIN 70-5 (MAP70-5) is **necessary for** the establishment of this spatially defined microtubule organization and endodermis remodeling and thus contributes to lateral root morphogenesis"
- **备注**：MAP70-5 拼写与原文一致；"必要因子"对应 "necessary for"，强度恰当；"所必需"对应 "required for"。

### [15] §3.3 Hoermayer 等以激光辅助创伤后的根组织为系统

- **判定**：✅ 与原文一致
- **原文依据**：`13_devcel_2024_...pdf` PDF 物理页 2："we studied tissue healing after laser-assisted wounding in **roots** of Arabidopsis thaliana"
- **备注**：物种与部位正确（拟南芥**根**，非 SAM）。这是全文唯一一处把结论定位在根而非 SAM 的地方，物种/部位标注准确，未越界推广到 SAM。

### [15] §3.3 创伤造成的组织变形使周围细胞扩张方向瞬时改变、微管阵列重定向，并最终预测分裂方向

- **判定**：✅ 与原文一致
- **原文依据**：`13_...pdf` PDF 物理页 2："This deformation causes instant redirection of expansion in the surrounding cells and reorientation of microtubule arrays, ultimately **predicting** cell division orientation"
- **备注**：正文用"预测"忠实于原文的 "predicting"，未写成"决定"。

### [15] §3.3 其机制在于微管在受压时不稳定、在被拉伸时稳定，被拉伸部位更高的微管丰度导致阵列重定向

- **判定**：⚠️ 强度过强（轻微）
- **原文依据**：`13_...pdf` PDF 物理页 2："Microtubules are destabilized **under low tension**, whereas stretching of cells, either through wounding or external aspiration, immediately induces their polymerization. The higher microtubule abundance in the stretched cell parts leads to the reorientation of microtubule arrays"
- **问题**：两处措辞与原文有偏差：(a) 原文是"**低张力**（low tension）"下不稳定，正文写作"**受压**时不稳定"——"受压/低张力"方向大体一致但并非同一术语，且原文同段的因果框架里还包括"组织可延展性径向梯度"这一上游因素；(b) 原文说拉伸诱导的是微管的**聚合（polymerization）**并伴随**丰度升高**，正文"稳定"在微管文献中通常对应 dynamics 意义上的稳定，与"聚合/丰度升高"不完全等价。
- **建议**：改为"微管在低张力下失稳，而细胞被拉伸时（创伤或外吸所致）微管立即发生聚合；被拉伸部位更高的微管丰度进而导致微管阵列重定向"。

### [15] §3.3 这为"机械力灵活重排细胞分裂"提供了长期寻求的机制

- **判定**：✅ 与原文一致
- **原文依据**：`13_...pdf` PDF 物理页 2："This provides a **long-sought mechanism** for flexible re-arrangement of cell divisions by mechanical forces"

### [2] §3.4 Coen 与 Cosgrove 把上述过程整理为 fiber→wall→cell→tissue 的多层级框架，并提醒：每上一级，组件被抽象为连续介质，机械应力在各级存在但数值通常并不相同

- **判定**：✅ 与原文一致
- **原文依据**：`10_science_ade8055_...pdf` PDF 物理页 9："We have reviewed the mechanics of plant morphogenesis at different inter-related levels, from fiber… wall… cell… to tissue. **In moving up levels, a population of components is typically abstracted to a continuum at the next level**… Mechanical stresses operate at each level, **but values are typically not the same from one level to the next**"
- **备注**："数值通常并不相同"对应 "values are typically not the same"，准确。

### [2] §3.4 该框架区分两类生长：指定生长（组织块孤立时的生长）与合成生长（组织与周围机械连接时的实际生长）

- **判定**：✅ 与原文一致
- **原文依据**：`10_...pdf` PDF 物理页 8："**Specified growth** is how a small region of tissue would grow in isolation and therefore free from tissue stresses. **Resultant growth** is the way a small region grows when mechanically connected to the rest of the tissue"
- **备注**：两个术语的释义逐字对应。

### [2] §3.4 后者可由前者的速率与方向图式通过模型计算，而组织形变又会改变这些图式，形成反馈环

- **判定**：✅ 与原文一致
- **原文依据**：`10_...pdf` PDF 物理页 8："Computational models allow resultant growth, and thus tissue deformation, to be calculated from an input pattern of specified growth rates and orientations. As tissue deforms, so do the regional patterns that determine the rates and orientations of specified growth, creating a feedback loop"

### [2] §3.4 模型还解释了为何应力反馈不足以产生新形状：若仅在最大应力方向增强，反而阻碍该方向生长、破坏整体形变

- **判定**：✅ 与原文一致
- **原文依据**：`10_...pdf` PDF 物理页 8："Use of tissue stresses to orient growth is problematic: if regions are reinforced in the direction of maximal stress, **growth will be retarded in that direction, thwarting coherent changes in tissue shape**"

### [2] §3.4 因此应力感知更适合维持已有形状（如叶的扁平化），而新形状的产生需要化学极性场来定向各向异性生长

- **判定**：✅ 与原文一致
- **原文依据**：`10_...pdf` PDF 物理页 8："**Tissue-stress sensing may reinforce a shape, such as leaf flatness**, but generating a new tissue shape is more difficult. To circumvent this problem… **The stress-feedback problem does not apply when polarity controlled by chemical cues is used to orient specified growth**"

### [2] §3.4 叶片形成可用两个正交极性场建模：一个先生成原基突起，另一个再塑造扁平或弯曲片层

- **判定**：✅ 与原文一致
- **原文依据**：`10_...pdf` PDF 物理页 9："Formation of flattened structures, like leaves, can be modelled with **two orthogonal polarity fields**… Orienting growth in this manner generates an **initial primordial bulge followed by development of an extended flat or curved sheet**. Growth and shaping of the sheet is oriented by a **second (planar) polarity field**"
- **备注**：两个场分别对应正文所述"先生成原基突起"与"再塑造扁平/弯曲片层"，对应关系准确。

### [2] §3.4 叶缘锯齿则来自平面极性与生长速率的局部调制

- **判定**：✅ 与原文一致
- **原文依据**：`10_...pdf` PDF 物理页 9："Modulation of planar polarity and growth rates at the leaf margins can generate serrated forms"

### [16] §3.4 果蝇翅芽盘的三维形态源于上皮细胞层与其包被细胞外基质（ECM）之间生长各向异性的差异：组织层平面内生长，底部 ECM 三维生长且幅度较小，造成几何挫败与组织弯曲

- **判定**：✅ 与原文一致
- **原文依据**：`12_...ECM_growth_anisotropy.pdf` PDF 物理页 2 摘要："3D morphology results from elastic deformation due to differential growth anisotropy between the epithelial cell layer and its enveloping extracellular matrix (ECM). **While the tissue layer grows in plane, growth of the bottom ECM occurs in 3D and is reduced in magnitude, thereby causing geometric frustration and tissue bending**"
- **备注**：物种正确（果蝇 *Drosophila* 翅芽盘），未误植入植物语境；"包被"对应 enveloping，正确。

### [16] §3.4 一个双层力学模型即可完整捕捉该过程，而 ECM 的各向异性由 MMP2 的差异表达控制

- **判定**：✅ 与原文一致
- **原文依据**：`12_...pdf` PDF 物理页 2 摘要："The elasticity, growth anisotropy and morphogenesis of the organ are **fully captured by a mechanical bilayer model**. Moreover, differential expression of the Matrix metalloproteinase **MMP2** controls growth anisotropy of the ECM envelope"
- **备注**：基因/蛋白名 MMP2（基质金属蛋白酶 2）与原文一致；"完整捕捉"对应 "fully captured"。

### [16] §3.4 其结论是：ECM 是可被调控的力学约束，其内在生长各向异性直接定向组织形态发生

- **判定**：✅ 与原文一致
- **原文依据**：`12_...pdf` PDF 物理页 2 摘要："the ECM is a **controllable mechanical constraint** whose intrinsic growth anisotropy **directs** tissue morphogenesis in a developing organ"

### [17] §3.4 更一般地，力化学过程的图式形成已有统一数学框架可供借用，Turing 型自组织与振荡、兴奋性等概念被用于跨系统比较

- **判定**：✅ 与原文一致
- **原文依据**：`15_annurev_cellbio_120420_095337_...pdf` PDF 物理页 1 关键词与摘要："Keywords: patterns, morphogenesis, **Turing pattern, oscillations, excitability**, mechanochemical processes"；正文 PDF 物理页 1–3 综述 Turing 框架、自组织（空间图案 / 时间振荡 / 行波）与兴奋性，并贯穿细胞与组织跨系统比较
- **备注**：正文明确说明这是"跨系统借用"而非植物 SAM 的证据，定位准确，未把动物系统结论说成植物结论。

---

## 重点风险项

### 1. 【最严重】§3.1 壁截面积归属说反（❌ 事实性错误）

- **正文原句**：「木葡聚糖与果胶虽占据壁的大部分截面积，却因力学较弱而承载很小张力」
- **原文实际说法**（`09_...cell_wall_structure_growth.pdf` PDF 物理页 10）：「tensile stresses in the wall are borne primarily by the cellulose network, **which constitutes only a small fraction of wall cross-sectional area**. Consequently, stresses within the cellulose network are calculated to be much larger than nominal wall stress」
- **问题**：原文的反直觉要点是「纤维素只占壁截面积的**一小部分**，却承担了绝大部分拉应力」。正文把"占大部分截面积"安到了木葡聚糖与果胶头上。虽然这是可以从原文逻辑推出的推论，但把它写成原文断言、并紧接在"主要承力的是纤维素网络"之后，会让读者对这个"截面积 vs 承载力"的核心反差产生完全相反的印象。
- **建议改写**：「主要承力的是纤维素网络，通过纤维素微纤维间的直接接触传递张力；值得注意的是纤维素网络只占壁截面积的**一小部分**，因而其内部应力被算出远高于名义壁应力。木葡聚糖与果胶的杨氏模量（约 4 GPa 与 2 GPa）远低于结晶纤维素（约 100 GPa），几乎不直接承载张力，它们可能通过影响纤维素如何组装成承力网络而间接调节壁的力学。」

### 2. 【重要】§2.2 形态发生素梯度的表述丢失了原文的"修正"意味（⚠️ 强度问题）

- **正文原句**：「形态发生素梯度是位置信息的经典范式：长程作用的信号分子在组织中形成浓度分布，为细胞提供位置坐标[7]」
- **原文实际说法**（`16_...morphogens.pdf` PDF 物理页 2）：把"从局部源扩散形成浓度梯度并以浓度依赖方式决定命运"明确标注为**早期观点**，随后说「Subsequent advances… suggest a more versatile picture… morphogen gradients can form from distributed sources, be interpreted in a **concentration-independent** manner」，并声明采用更宽泛的定义「morphogens as molecules that act at a long range to control cell properties and provide spatial information」。
- **问题**：正文把被原文当作"已被修正的初始图景"的内容当作正面陈述引用。这与本节后续论点（"位置信息至少有三种不同来源"，即非梯度来源也成立）形成自相矛盾——若梯度范式如正文所述那样完满，就不需要强调"三种来源"。另外原文关键词是 "concentration-independent"，正文完全没提。
- **建议**：改为「形态发生素是长程作用、为发育组织提供位置信息的信号分子；经典的"局部源—浓度梯度—命运"图景是其最初的表述，而后续研究表明梯度亦可来自分布式源，并可被非浓度依赖性地读取[7]」。

### 3. 【中等】§3.3 "受压时不稳定 / 被拉伸时稳定"与原文用词有偏差（⚠️ 强度问题）

- **正文原句**：「微管在受压时不稳定、在被拉伸时稳定，被拉伸部位更高的微管丰度导致阵列重定向」
- **原文实际说法**（`13_devcel_2024_...pdf` PDF 物理页 2）：「Microtubules are destabilized **under low tension**, whereas stretching of cells, either through wounding or external aspiration, immediately **induces their polymerization**. The higher microtubule abundance in the stretched cell parts leads to the reorientation of microtubule arrays」
- **问题**：(a) "受压"（compression）与"低张力"（low tension）不是同一术语；(b) 原文说的是**聚合（polymerization）+ 丰度升高**，正文写作"稳定"——微管生物学里 stability 与 dynamics/polymerization 是不同量纲，用"稳定"替换"聚合"会让后续"更高的微管丰度"这一因果链显得断裂（既已"稳定"，何以还有"丰度"差异？）。
- **建议**：改为「微管在低张力下失稳，而细胞被拉伸时（创伤或外源吸力所致）微管立即发生聚合；被拉伸部位更高的微管丰度进而导致微管阵列重定向」。

### 4. 【轻微】§2.1 WUS–HAM 把 CLV3 限制在"顶层细胞"

- **正文原句**：「WUS 还以 HAM 转录因子形成异二聚体，共同把 CLV3 的表达限制在顶层细胞[1]」
- **原文实际说法**（`04_...DA1_WUS_SAM_size.pdf` PDF 物理页 2）：「WUS-HAM heterodimers confine CLV3 expression to the **outer apical meristem layer**」
- **问题**：SAM 是三维结构，"outer apical meristem layer"指**最外层（L1 / 表皮层）**，这是有明确解剖学含义的定位；"顶层细胞"容易被读成"顶端的一层"，甚至被误读为"顶端分生组织"。术语含义有漂移。
- **建议**：改为"共同把 CLV3 的表达限制在最外层（L1 层）"。

### 5. 【轻微】§3.2 纤维素方向"决定"扩张方向性

- **正文原句**：「生长方向性由纤维素排列方向控制：随机排列对应均匀膨胀，高度定向排列对应定向伸长[3]」
- **原文实际说法**（`09_...pdf` PDF 物理页 4）：「Growth directionality is **partly** controlled by cellulose direction」
- **问题**：原文明确是"部分由"控制（因为同页还提到「Tensile stresses in the cellulose microfibril network also factor into growth rate and directionality」）。正文省略"部分"，把一个多因素（纤维素方向 + 张力）共同决定的量写成单一决定关系。
- **建议**：在"控制"前加"部分"：「生长方向性**部分**由纤维素排列方向控制……」

---

## 附：正面核查结论

除上述 4 处不一致与 3 处强度过强外，其余 39 条均与原文一致，**未发现以下典型错误**：

- **基因名拼写**：WUS/WUSCHEL、CLV3/CLAVATA3、CLV1、CLV2、CLE16、CLE17、BAM/BARELY ANY MERISTEM、KNUCKLES/KNU、PIN1/PIN-FORMED1、IPT7/ISOPENTENYLTRANSFERASE7、AS2、KAN1、ARF3、TAA1、TAR2、ChCUC1、WAG、CUC1-3、BOP1-2、TEC3、FERONIA、THESEUS1、MAP70-5、MMP2、HAM/HAIRY MERISTEM、RALF — **全部与原文拼写、大小写、连字符形式一致**，无一处拼写错误。
- **物种与部位归属**：无越界推广。SAM 结论归于 [1][4][5][8][11]，侧根归于 [14]，**根组织创伤归于 [15]**，子叶表皮归于 [13]，果蝇翅芽盘归于 [16]（且正文明确标注为跨系统），叶极性归于 [9][12]，拟南芥茎尖归于 [10]。未发现把侧根、根、子叶或果蝇系统的结论说成 Arabidopsis SAM 结论的情况。
- **方向性断言**：全部正确。CLE16/17 作用于 WUS **上游**（[4]）、KNU **直接**抑制 WUS/CLV3/PIN1/IPT7（[6]，有 ChIP+EMSA+双荧光素酶支撑）、基质多糖**间接**调节壁力学（[3]）、Schneider 解耦后微管共对齐**增强**（[13]）、Hoermayer 的组织变形**预测**（而非决定）分裂方向（[15]）。
- **强断言**：未发现无据的"唯一""首次""完全"。原文自带的强词（"fully captured"、"long-sought mechanism"、"required for"、"necessary for"）正文均如实对应。
- **数字与结论方向**：3.1 的模量数值（未写入正文）、3.4 的两级极性场与"最大应力方向增强反而阻滞生长"的负向结论、叶缘锯齿来源，均与原文方向一致。
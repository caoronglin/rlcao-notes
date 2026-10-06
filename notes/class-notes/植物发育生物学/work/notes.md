# 精读笔记（P4）

逐篇抽取「论点—证据—方法—可引用句（含页码）—对我论文的作用」。
页码为 PDF 物理页（pdftotext 提取）。

> 元数据已于 2026-10-06 用 Crossref API 逐条实证核对并修正（原 8 处卷页/作者有误）。

## ⚠️ 两套编号对照（本文件编号 ≠ 正文引用序号）

本文件的 `[NN]` 对应 `refs/NN_*.pdf` 文件编号；`paper/paper.md` 的引用序号按**正文出现顺序**重排，两套**完全错位**。查证时务必用下表：

| 本文件/文件编号 | refs 文件 | 第一作者 | paper.md 引用序号 |
|---|---|---|---|
| [01] Dao TQ 2022 | 01_dev200787 | Dao (CLE16/17) | **[4]** |
| [02] John A 2023 | 02_s41477-023-01485-y | John (CLAVATA 受体网络) | **[5]** |
| [03] Yadav S 2023 | 03_dev202014 | Yadav (局部生长素合成) | **[8]** |
| [04] Cui G 2024 | 04_s41467-024-48361-7 | Cui (DA1–WUS) | **[1]** |
| [05] Wang G 2025 | 05_koae312 | Wang (KNU) | **[6]** |
| [06] Burian A 2022 | 06_s41477-022-01111-3 | Burian (叶背腹性) | **[9]** |
| [07] Hu ZL 2024 | 07_pnas2321877121 | Hu (CUC1/生长素) | **[12]** |
| [08] Alonso-Serra J 2024 | 08_s41467-024-51099-x | Alonso-Serra (水通量) | **[10]** |
| [09] Cosgrove DJ 2024 | 09_s41580-023-00691-y | Cosgrove (细胞壁) | **[3]** |
| [10] Coen E 2023 | 10_science_ade8055 | Coen & Cosgrove (形态发生力学) | **[2]** |
| [11] Stöckle D 2022 | 11_sciadv_abm4974 | Stöckle (微管感知机械冲突) | **[14]** |
| [12] Harmansa S 2023 | 12_s41467-023-36739-y | Harmansa (ECM 各向异性) | **[16]** |
| [13] Hoermayer L 2024 | 13_devcel_2024 | Hoermayer (力定向分裂) | **[15]** |
| [14] Schneider R 2022 | 14_s41477-022-01218-7 | Schneider (CSC–微管) | **[13]** |
| [15] Bailles A 2022 | 15_annurev_120420 | Bailles (力化学图式) | **[17]** |
| [16] Kicheva A 2023 | 16_annurev_020823 | Kicheva & Briscoe (形态发生素) | **[7]** |
| [17] Neumann M 2022 | 17_s41467-022-30177-y | Neumann (花分生组织 3D 图谱) | **[18]** |
| [18] Zhang K 2022 | 18_kiac370 | Zhang (ARF3) | **[11]** |

## 副本版本核查（2026-10-06）

`refs/` 18 篇中 **17 篇为出版版**；**仅 `02_s41477-023-01485-y_CLAVATA_receptors.pdf` 为 NIHMS 接收稿**（33 页，首页标 "HHS Public Access Author Manuscript"）。该篇即正文引用 [5] John et al. 2023 *Nature Plants*，其**接收稿页码与正式版 9(8):1306–1317 不对应**，引用页码一律以 Crossref 正式版元数据为准，正文未标具体页码故不受影响。

## 新补文献（2026-10-06，来自 `../../pdfs/08`–`42`）

精读笔记卡独立成文件，编号 `新-NN` 对应 `pdfs/NN_*`：

| 编号 | 著录（Crossref 实证，2026-10-06） | 笔记卡 |
|---|---|---|
| 新-31 | Lan M, et al. CSLD5-mediated cell wall remodelling regulates tissue mechanics and shoot meristem growth. *Nature Communications*, 2025, 16(1): 7229. DOI: 10.1038/s41467-025-62651-8 | `notes_new_31_CSLD5.md` |
| 新-42 | Uzair M, et al. An updated model of shoot apical meristem regulation by ERECTA family and CLAVATA3 signaling pathways in Arabidopsis. *Development*, 2024, 151(12): dev202870. DOI: 10.1242/dev.202870 | `notes_new_42_ERECTA.md` |
| 新-29 | Vardanega I, et al. CLAVATA signalling shapes barley inflorescence by controlling activity and determinacy of shoot meristem and rachilla. *Nature Communications*, 2025, 16(1): 3937. DOI: 10.1038/s41467-025-59330-z | `notes_new_29_CLAVATA_barley.md` |
| 新-35 | Long KA, et al. Spatial transcriptomics reveals expression gradients in developing wheat inflorescences at cellular resolution. *The Plant Cell*, 2026, 38(1): koaf282（online 2025-12-13，卷 38 对应 2026 年） | `notes_new_35_wheat_spatial.md` |
| 新-34 | Demesa-Arevalo E, et al. Imputation integrates single-cell and spatial gene expression data to resolve transcriptional networks in barley shoot meristem development. *Nature Plants*, 2026, 12(1): 107–124. DOI: 10.1038/s41477-025-02176-6 | `notes_new_34_barley_scRNA.md` |

> 注意：`../../more-papers.md` 表格第 6 列是**被引数**而非卷号（曾被误读为卷号并误判为错误）。这三篇的卷号一律以上表 Crossref 实证为准。

---

## [09] Cosgrove DJ. Structure and growth of plant cell walls. *Nature Reviews Molecular Cell Biology*, 2024, 25(5): 340–358. DOI:10.1038/s41580-023-00691-y

**核心论点**
- 细胞壁生长 = 壁聚合物在膨压驱动下的不可逆屈服（creep）；"壁松弛—膨压下降—水分流入—恢复膨压—细胞扩大"是一个物理闭环（p.2）。
- 承力的是纤维素网络（纤维素—纤维素直接接触），木葡聚糖与果胶"力学上较弱"，主要间接影响纤维素的组装，而非主要承力（p.4）。这一结论推翻了"木葡聚糖是主要承力系绳"的传统图景。
- 生长方向性由纤维素排列方向决定：各向同性（随机）→ 均匀膨胀；各向异性 → 定向伸长（p.5）。
- 激素通过改变壁 pH 调控扩张蛋白（expansin）活性：生长素快速酸化壁 → 激活 α-expansin → 壁松弛；RALF–FERONIA 则抑制质子泵、升高 pH、抑制生长（p.3）。

**关键证据/方法**
- 恒力延伸仪测壁 creep；应力松弛实验测屈服。
- 分子动力学 + 计算模型（ref 4）复现纤维素/木葡聚糖/果胶自组装网络，预测被实验验证。
- 壁传感器三类：THESEUS1（BR 信号）、LRR-RLK（FEI1）、WAKs（结合果胶）；近期综述列出拟南芥 13 个候选壁传感器基因（p.352）。

**可引用句**
- "Wall yielding … lies at the heart of cell wall growth."（p.2）
- "tensile forces were transmitted directly within the cellulose network through regions of direct cellulose–cellulose contacts"（p.4）
- "Growth directionality is partly controlled by cellulose direction"（p.5）
- "The wall is loaded with sensors that detect features of cellulose and pectin and connect to numerous intracellular and extracellular signalling pathways."（p.19, Perspective）
- "How cells might sense the direction of wall stress is uncertain"（p.352）

**对我论文的作用**：第 3 节（形态发生）的物理骨架；"基因→力学"这一侧的核心引文；同时提供"未解决问题"的原文表述（应力方向感知机制不明）。

---

## [10] Coen E, Cosgrove DJ. The mechanics of plant morphogenesis. *Science*, 2023, 379: 846–850. DOI:10.1126/science.ade8055

**核心论点**
- 植物形态发生 = 细胞壁按时空差异的速率/方向屈服；膨压是原动力。细胞不迁移、不重排，使力学分析比动物简单（p.1）。
- **多层级框架**：纤维（fiber）→ 壁（wall）→ 细胞（cell）→ 组织（tissue）；每层有自己的应力值，上层组件被抽象为连续介质（p.9 Conclusion）。
- **"指定生长 vs 合成生长"**：specified growth = 组织块孤立时的生长；resultant growth = 与周围组织机械连接时的实际生长。后者可从前者的速率/方向图式通过模型计算；组织形变又会改变图式 → 反馈环（p.8）。
- **应力反馈难题**：若把增强放在最大应力方向，会阻碍该方向生长、破坏整体形变；因此"应力感知"更适合维持已有形状（如叶扁平化），而**新形状的产生需要化学极性场**（近轴/平面极性场）来定向各向异性生长（p.8）。

**关键证据/方法**
- 计算建模 + 发育遗传学 + 活体成像 + 生长分析的整合。
- 叶片形成可用两个正交极性场建模：orthoplanar 场（从表面指向近轴边界）先生成原基 bulge，planar 极性场再塑造扁平/弯曲片层；叶缘锯齿来自平面极性与生长速率的局部调制（p.8）。

**可引用句**
- "Interactions between fibers in plant cell walls can lead to the generation of complex tissue shapes."（摘要）
- "confusion and controversies remain over how these findings relate to the mechanics of development"（p.1）
- "how global and local stresses might be discriminated by cells remains unclear"（p.8）
- "growth rates depend on turgor, wall extensibility and yield thresholds, rather than introduction of new walls, which act mechanically to restrain rather than promote growth"（p.9）
- "The dynamic cellulose network provides elastic resistance to deformation while allowing growth through fiber sliding"（摘要）

**对我论文的作用**：全文论证主线的直接来源——" patterned gene activity → mechanical deformation → form "（摘要原句）正是我题目的表述。多层级框架可直接作为图 1 的骨架；"应力反馈难题"是第 4 节问题分析的核心论据。

---

## [04] Cui G, et al. The peptidase DA1 cleaves and destabilizes WUSCHEL to control shoot apical meristem size. *Nature Communications*, 2024, 15(1): 4627. DOI:10.1038/s41467-024-48361-7

**核心论点**
- WUS 是茎端分生组织（SAM）干细胞维持的核心同源域转录因子，表达于组织中心（OC）；WUS 缺失 → 干细胞特性丧失、SAM 早衰；WUS 在 CZ 异位诱导 → 分生组织增大（p.2）。
- 本文发现：肽酶 DA1 与 WUS 物理互作并切割 WUS 蛋白，导致其去稳定；细胞分裂素信号抑制 SAM 中 DA1 蛋白水平 → WUS 积累 → 分生组织增大（摘要）。
- 由此，细胞分裂素通过"转录激活 + 翻译后稳定"双途径促进 WUS 积累；DA1 是长期未解的"WUS 蛋白稳定性直接调控因子"（p.2–3）。
- 分生组织大小由干细胞数量决定，进而影响器官大小与产量潜力（p.1）——与作物育种的连接点。

**关键证据/方法**
- DA1–WUS 物理互作与切割实验、da1 突变体 SAM 表型（更大、干细胞更多）、细胞分裂素诱导 SAM 增大的遗传依赖。

**可引用句**
- "loss of DA1 function results in larger shoot apical meristems with an increased stem cell population"（摘要）
- "the factors that directly modulate WUS protein stability have been a long-standing question"（p.2）
- "meristem size is determined by the number of stem cells, and these influence the size of organs derived from the meristem"（p.1）

**对我论文的作用**：第 2 节"分生组织大小如何被决定"的最新机制；同时是"分生组织大小—器官大小—产量"这条作物关联线的关键引文（支撑第 5 节展望）。

---

## [13] Hoermayer L, et al. Mechanical forces in plant tissue matrix orient cell divisions via microtubule stabilization. *Developmental Cell*, 2024, 59(10): 1333–1344. DOI:10.1016/j.devcel.2024.03.009

**核心论点**
- 植物细胞不迁移，形态发生依赖定向的细胞扩张与分裂，但"分裂面方向如何决定"长期未解（p.1）。
- 机制：激光切割根尖造成组织变形 → 周围细胞扩张方向瞬时改变 → 微管阵列重定向 → 决定分裂面。微管在"被拉伸的部位"丰度更高，因为微管在压缩下不稳定、被拉伸时稳定（Graphical abstract + p.1）。
- 根组织作为"相互连接的细胞基质"，其径向延展性梯度决定了创伤后可预测的组织变形（p.1）。

**关键证据/方法**
- 激光辅助创伤后的恢复性分裂（restorative divisions）作为可重复实验系统；微管稳定性与张力的因果操控。

**可引用句**
- "Microtubules are destabilized under [compression]" / "The higher microtubule abundance in the stretched cell parts leads to the reorientation of microtubule arrays and, ultimately, informs cell division planes."（p.1）
- "the mechanism(s) determining division plane orientation remain elusive"（p.1）
- "This provides a long-sought mechanism for flexible re-arrangement of cell divisions by mechanical forces"（p.1）

**对我论文的作用**：**"力学 → 细胞命运/几何"这条接口的直接实验证据**，是图 1 右侧"力学通路"回连到细胞行为的关键一环，也是第 4 节"机械信号如何编码为发育输出"的核心例证。注意：本文做的是根（创伤愈合），需在文中明确外推到 SAM 的限度。

---

## 待读清单（14 篇）

| # | 文献 | 拟抽取重点 |
|---|---|---|
| 01 | dev.200787 CLV3/CLE16/CLE17 | CLE 小肽受体互作如何维持干细胞稳态 |
| 02 | s41477-023 CLAVATA receptors | 受体网络缓冲生长素依赖的维持 |
| 03 | dev.202014 局部生长素合成 | 生长素合成位置 vs 运输 |
| 05 | koae312 KNUCKLES | 花分生组织终止（决定 vs 无限） |
| 06 | s41477-022 叶背腹极性 | 均匀生长素输入的预模式化读出 |
| 07 | PNAS CUC1/auxin | 细胞极性 → 模式化组织生长 |
| 08 | s41467 水通量 | 水分/渗透作为模式化信号 |
| 11 | sciadv 微管机械冲突 | 微管感知机械冲突 |
| 12 | s41467 ECM 各向异性 | 基质各向异性塑造器官 |
| 14 | s41477 CSC–微管锚定 | 基因→力学的分子连接 |
| 15 | annurev 力化学原理 | 跨系统的一般原理（类比动物） |
| 16 | annurev 形态发生素 | 形态发生素梯度作为位置信息 |
| 17 | s41467 花分生组织 3D 图谱 | 空间组学方法在 SAM/花分生组织 |
| 18 | kiac370 ARF3 | 转录因子控制增殖与叶序 |

---

## [01] Dao TQ, Weksler N, Liu HMH, Leiboff S, Fletcher JC. Interactive CLV3, CLE16 and CLE17 signaling mediates stem cell homeostasis in the Arabidopsis shoot apical meristem. *Development*, 2022, 149: dev200787. DOI:10.1242/dev.200787

**核心论点**
- CLV3 通过受体激酶通路抑制 WUS 表达以维持 SAM；本文证明 CLV3 相关的两个小肽 **CLE16/CLE17 在 clv3 缺失时部分代偿**，独立贡献于 SAM 维持与器官发生（摘要）。
- CLE16/CLE17 只作用于 **CLV3 受体的一部分（BAM 受体激酶）**，位于 WUS 上游。
- 意义：解释了 clv3 突变体仍有残留干细胞活性的原因，构成"受体—配体冗余"的稳健性网络；并指出这是作物增产的潜在靶点。

**可引用句**
- "CLE16 and CLE17 function in a mechanism that partially compensates for CLV3 to maintain stem cell homeostasis and plant resiliency"（摘要）
- "expands the potential targets for enhancing yield traits in crop species"（摘要）

**作用**：第 2 节"CLV3–WUS 不是单线通路而是受体网络"的关键证据；也是"信号冗余 → 稳健性"这一论点的引文。

---

## [02] John A, et al. A network of CLAVATA receptors buffers auxin-dependent meristem maintenance. *Nature Plants*, 2023, 9(8): 1306–1317. DOI:10.1038/s41477-023-01485-y

**核心论点**
- 传统观点：CLV3 负调控中央区干细胞增殖；花/花序原基发生依赖生长素。本文证明 **CLV3 信号同样是生长素依赖的原基发生所必需**，且该功能被"花序簇生（fasciation）与热诱导生长素合成"部分掩盖。
- 干细胞调控与原基形成在功能上可分离，但都对温度与生长素水平敏感。
- 新发现：CLV3 的受体之一 **CLAVATA1 在较冷环境下参与生长素依赖的分生组织维持**。

**可引用句**
- "How these inputs intersect to promote growth and development remains poorly understood."（摘要）
- "Stem cell regulation by CLAVATA signaling is separable from primordia formation but is also sensitized to temperature and auxin levels."（摘要）

**作用**：第 2 节 + 第 4 节——激素（生长素）与干细胞信号不是两条独立线，而是互相依赖；这是"耦合"在信号层面的第一个例证。

---

## [03] Yadav S, Kumar H, Mahajan M, et al. Local auxin biosynthesis promotes shoot patterning and stem cell differentiation. *Development*, 2023, 150: dev202014. DOI:10.1242/dev.202014

**核心论点**
- SAM 分 CZ/PZ/RM；本文用 TAA1/TAR2（色氨酸氨基转移酶家族）证明**除生长素运输外，局部生长素合成同样调控 SAM 模式化**与花器官原基形成。
- 在缺失生长素合成与运输时，SAM 模式化标志基因的表达图式被扰乱 → 局部合成与运输协同决定 CZ/PZ/RM 分区。

**可引用句**
- "local auxin biosynthesis, in concert with transport, controls the patterning of the SAM into the CZ, PZ and RM"（摘要）
- "To unravel the mechanism of meristem development, it is essential to know how stem cells adopt distinct cell fates in the SAM."（摘要）

**作用**：第 2 节"位置信息从哪来"——不是单一运输梯度，而是合成+运输共同塑造；提供 SAM 分区（CZ/PZ/RM）的基础概念。

---

## [05] Wang G, Wu Z, Sun B. KNUCKLES regulates floral meristem termination by controlling auxin distribution and cytokinin activity. *The Plant Cell*, 2025, 37(1): koae312. DOI:10.1093/plcell/koae312

**核心论点**
- 花分生组织（FM）必须适时终止才能正常形成生殖器官；KNU（C2H2 锌指蛋白）通过直接抑制 **WUS 与 CLV3** 废除 WUS-CLV3 反馈环，终止 FM。
- 新发现：KNU 还直接抑制 **PIN1（生长素转运蛋白）与 IPT7（细胞分裂素合成基因）**，通过 **H3K27me3 沉积**实现，从而改变 FM 中生长素分布与细胞分裂素活性，促成第 6 阶段的 FM 终止。

**可引用句**
- "KNU directly represses the auxin transporter gene PIN-FORMED1 (PIN1) and the cytokinin biosynthesis gene ISOPENTENYLTRANSFERASE7 (IPT7) via mediating H3K27me3 deposition"（摘要）
- "a molecular regulatory network that elucidates how the transcriptional repressor KNU integrates and modulates the activities of auxin and cytokinin, thus securing the timed FM termination"（摘要）

**作用**：第 2 节"分生组织的决定与终止"；同时是**"转录因子 → 激素分布 → 组织命运"**的清晰范例，连接信号与形态。

---

## [06] Burian A, et al. Specification of leaf dorsiventrality via a prepatterned binary readout of a uniform auxin input. *Nature Plants*, 2022, 8(3): 269–280. DOI:10.1038/s41477-022-01111-3

**核心论点**
- 叶原基如何获得近轴/远轴身份长期有争议。本文用延时共聚焦成像 + 细胞谱系追踪 + 遗传分析证明：**在原基出现前数个叶间隔期**，AS2–KAN1 组成的"分生组织预模式"上高生长素积累，触发 ARF3 瞬时诱导与生长素转录响应，从而区分近轴/远轴。
- 关键洞见：**生长素输入本身是均匀的，是组织的预模式（AS2–KAN1）把均匀信号转换为 ARF 依赖的二元响应输出**。

**可引用句**
- "spatial information from an AS2–KAN1 meristem prepattern governs the conversion of a uniform auxin input into an ARF-dependent binary auxin response output to specify adaxial–abaxial polarity"（摘要）
- "Auxin thus serves as a single morphogenic signal that orchestrates distinct, spatially separated responses to coordinate the positioning and emergence of a new organ with its patterning."（摘要）

**作用**：第 2 节最漂亮的论据——**"位置信息不一定来自浓度梯度，也可以来自组织的预模式 + 均匀信号的差异化读出"**，直接支撑我"模式形成不只看信号梯度"的论点。

---

## [07] Hua Z-L, et al. A CUC1/auxin genetic module links cell polarity to patterned tissue growth and leaf shape diversity in crucifer plants. *PNAS*, 2024, 121: e2321877121. DOI:10.1073/pnas.2321877121

**核心论点**
- 拟南芥（单叶）与碎米荠（复叶）的叶形差异由 **ChCUC1 的图式化表达**决定。
- 机制：ChCUC1 通过转录激活 **WAG 激酶**（调控 PIN 极性）向生长素叶缘图式提供"指令性输入"，从而把**组织尺度的基因表达场 → 细胞极性 → 生长图式**串起来，塑造不同物种的叶形。
- 方法：诱导型遗传扰动 + 生长延时成像 + 计算建模。

**可引用句**
- "a mechanism that bridges biological scales by linking spatially distributed and species-specific transcription factor expression to cell-level polarity and growth, to shape diverse leaf forms"（摘要）
- "How tissue-level information encoded by fields of regulatory gene activity is translated into the patterns of cell polarity and growth … remains poorly understood"（摘要）

**作用**：**第 4 节"尺度跨越"的核心引文**——组织级图式如何下传到细胞级极性/生长，这是耦合问题的标准表述，且给出了实证答案。

---

## [08] Alonso-Serra J, et al. Water fluxes pattern growth and identity in shoot meristems. *Nature Communications*, 2024, 15(1): 6944. DOI:10.1038/s41467-024-51099-x

**核心论点**
- 组织生长产生新的"水汇"，改变局部水力格局；水通量常被视为被动的副产物。本文绘制了拟南芥茎尖的细胞体积生长图，发现**器官—分生组织边界处有一亚群细胞收缩**。
- 水力—力学耦合模拟预测边界细胞水分亏缺；体内水溶性染料优先分配至快速生长组织而**无法进入边界域**；不同生长条件与不同拓扑下边界细胞收缩均稳健；边界的分子印记（水分亏缺响应）证实结论。
- 结论：**新生器官的汇强度差异规定了水力图式，从而划定茎尖的边界域**。

**可引用句**
- "the differential sink strength of emerging organs prescribes the hydraulic patterns that define boundary domains at the shoot apex"（摘要）
- "Although water fluxes are often considered passive by-products of development, their contribution to morphogenesis remains largely unexplored"（摘要）

**作用**：第 4 节的"反直觉"论据——**一个纯物理量（水通量/渗透压）成为位置信息与身份的决定因素**，说明"信号"可以是物理的。这是全文最有新意的支点之一。

---

## [11] Stöckle D, et al. Microtubule-based perception of mechanical conflicts controls plant organ morphogenesis. *Science Advances*, 2022, 8(6): eabm4974. DOI:10.1126/sciadv.abm4974

**核心论点**
- 侧根发生过程中，内皮层被主动重塑以允许新器官外突。
- 发现：面向侧根起始细胞的内皮层微管阵列**有序度高于同一细胞的相反一侧**，这种不对称是内皮层重塑与侧根起始所必需。
- **MAP70-5** 是建立这种空间限定微管组织与内皮层重塑的必要因子；作者提出 MAP70-5 与皮层微管整合侧根外突产生的机械信号，"疏导"器官发生。

**可引用句**
- "MAP70-5 and cortical microtubule arrays in the endodermis integrate the mechanical signals generated by lateral root outgrowth, facilitating the channeling of organogenesis"（摘要）
- "The mechanical tensions caused by cells pulling or pushing on their neighbors are increasingly recognized as instructive signals during development and as an important element of the feedback mechanism coupling tissue geometry to gene expression"（引言）
- "These conclusions were drawn from the analysis of the epidermal surface of the shoot apical meristem, where cells are under strong tension and not fully differentiated. However, it remains poorly understood how plant cells detect and integrate mechanical signals during de novo morphogenesis within a tissue."（引言）

**作用**：第 3、4 节。注意其引言明确指出"微管沿最大应力对齐"的经典结论主要来自 **SAM 表皮** 分析——我的主题正好落在这里；而本文的贡献是说明**机械冲突如何在组织内部被感知**。可作为"力学→细胞骨架→形态"的直接证据。⚠️ 本文做的是侧根/内皮层，外推到 SAM 需说明限度。

---

## [12] Harmansa S, et al. Growth anisotropy of the extracellular matrix shapes a developing organ. *Nature Communications*, 2023, 14(1): 1220. DOI:10.1038/s41467-023-36739-y

**核心论点**
- 果蝇翅芽盘的 3D 形态来自上皮细胞层与包被 ECM 之间**生长各向异性差异**造成的弹性变形：组织层平面内生长，底部 ECM 三维生长且幅度较小 → 几何挫败 → 组织弯曲。
- 双层力学模型完整捕捉了弹性、生长各向异性与形态发生；ECM 的生长各向异性由 **MMP2** 差异表达控制。
- 结论：**ECM 是可被调控的力学约束，其内在生长各向异性定向组织形态发生**。

**可引用句**
- "the ECM is a controllable mechanical constraint whose intrinsic growth anisotropy directs tissue morphogenesis in a developing organ"（摘要）
- "Complex morphologies can also arise from differences in growth rate between tissues."（摘要）

**作用**：第 3、4 节的**跨系统对照**（动物）。⚠️ 严格说是果蝇，不是植物；用于说明"基质各向异性塑造器官"是跨物种的一般原理，必须明确标注为动物证据，不能混作植物证据。这正好支撑第 4 节"植物特有细胞壁 vs 动物 ECM"的差异讨论。

---

## [14] Schneider R, et al. Tethering of cellulose synthase to microtubules dampens mechano-induced cytoskeletal organization in Arabidopsis pavement cells. *Nature Plants*, 2022, 8(9): 1064–1073. DOI:10.1038/s41477-022-01218-7

**核心论点**
- 动物中整合素等"膜—ECM—细胞骨架"组装负责感知与传递机械信号；植物中对应机制与遗传基础知之甚少。
- 发现：子叶表皮发育早期，**纤维素合酶复合体（CSC）的数量与运动方向密切镜像微管组织**。
- 解耦微管与 CSC 后，由细胞形状或组织尺度物理扰动驱动的**微管共对齐增强**；微机械扰动导致 CSC 从质膜流失 → 提示 CSC 从质膜移除与微管的机械响应相关。
- 结论：CSC 与皮层微管的互作构成"细胞壁—质膜—细胞骨架"的物理连续体，调节细胞骨架的机械响应。

**可引用句**
- "the interaction of cellulose synthase with cortical microtubules forms a physical continuum between the cell wall, plasma membrane and the cytoskeleton that modulates the mechano-response of the cytoskeleton"（摘要）
- "Uncoupling microtubules and CSCs resulted in enhanced microtubule co-alignment as caused by mechanical stimuli"（摘要）

**作用**：**"基因→力学"与"力学→基因"双向接口的分子实体**，是图 1 中"力学通路"如何与细胞骨架/壁合成相连的关键一环。

---

## [15] Bailles A, Gehrels EW, Lecuit T. Mechanochemical Principles of Spatial and Temporal Patterns in Cells and Tissues. *Annual Review of Cell and Developmental Biology*, 2022, 38: 321–347. DOI:10.1146/annurev-cellbio-120420-095337

**核心论点**
- 图式（pattern）遍布生命系统，是细胞/组织/胚胎动态组织的基础；最著名的自组织数学框架是 **Turing 框架**。图式可在空间、时间上定义（如振荡、兴奋性）。
- 关键词：pattern, morphogenesis, Turing pattern, oscillations, excitability, **mechanochemical processes**。
- 主旨：把"力"与"化学"纳入同一套图式形成原理。

**可引用句**
- "Patterns are ubiquitous in living systems and underlie the dynamic organization of cells, tissues, and embryos."（摘要）
- "Mathematical frameworks have been devised to account for the self-organization of biological patterns, most famously the Turing framework."（摘要）

**作用**：第 4 节"模型与原理"的一般性框架来源。⚠️ 动物/通用系统综述，用作**方法论与概念框架**，不作为植物证据。

---

## [16] Kicheva A, Briscoe J. Control of Tissue Development by Morphogens. *Annual Review of Cell and Developmental Biology*, 2023, 39: 91–121. DOI:10.1146/annurev-cellbio-020823-011522

**核心论点**
- 形态发生素（morphogen）是长程作用的胞间信号分子，提供空间信息并控制组织发育属性。
- 关键词：morphogen, gene regulatory network, tissue development, diffusion, embryo。

**可引用句**
- "Intercellular signaling molecules, known as morphogens, act at a long range in developing tissues to provide spatial information and control properties"（摘要）

**作用**：第 2 节"位置信息的经典范式（形态发生素梯度）"的权威定义来源，用作与 #06/#08（预模式读出、水通量）对比的**基准范式**。⚠️ 动物为主，作概念框架。

---

## [17] Neumann M, et al. A 3D gene expression atlas of the floral meristem based on spatial reconstruction of single nucleus RNA sequencing data. *Nature Communications*, 2022, 13(1): 2838. DOI:10.1038/s41467-022-30177-y

**核心论点**
- 单细胞转录组学以前所未有分辨率刻画基因表达异质性，但**丢失了细胞的原始物理位置**。
- 方法：单核 RNA-seq + 基于显微镜的 3D 空间重建，重建花分生组织中单个细胞的基因组范围表达图式；据此判定不同分生组织域的基因表达差异。
- 概念验证：追踪花分生组织中**维管身份的起始**。图谱公开可访问。

**可引用句**
- "the original physical location of the cell is lost during this methodology"（摘要）
- "gene expression differences among meristematic domains giving rise to different tissue and organ types can be determined"（摘要）
- "the power of spatially reconstructed single cell transcriptome atlases to understand plant morphogenesis"（摘要）

**作用**：第 5 节展望——**"空间 + 单细胞"是解耦模式与形态的关键技术**，也是在花分生组织这个我主题核心器官上的直接应用。

---

## [18] Zhang K, et al. Cell- and noncell-autonomous AUXIN RESPONSE FACTOR3 controls meristem proliferation and phyllotactic patterns. *Plant Physiology*, 2022, 190(4): 2335–2349. DOI:10.1093/plphys/kiac370

**核心论点**
- ARF3 此前已知在花分生组织维持与决定中起作用；其蛋白积累图式与编码基因表达域在 SAM 中不一致。
- 本文：ARF3 表达主要在 SAM **外周由生长素激活**，在**细胞自主**层面调控分生组织—器官边界基因（CUC1-3、BOP1-2、TEC3），从而调控**叶序（phyllotaxis）**。
- ARF3 还被**转运进组织中心**，在**非细胞自主**层面抑制细胞分裂素活性与 WUS 表达，调控分生组织活性。
- 结论：ARF3 是连接生长素与细胞分裂素信号、协调"分生组织维持 vs 器官发生"平衡的分子纽带。

**可引用句**
- "ARF3 acts as a molecular link that mediates the interaction of auxin and cytokinin signaling in the SAM while coordinating the balance between meristem maintenance and organogenesis"（摘要）
- "ARF3 is translocated into the organizing center where it represses cytokinin activity and WUSCHEL expression to regulate meristem activity noncell-autonomously"（摘要）

**作用**：第 2 节"位置信息→边界基因→器官排列（叶序）"的核心机制；同时提供"同一分子在细胞自主/非细胞自主两个尺度上作用"的范例，呼应多层级框架。

---

## 贯穿性观察（写作时要用）

1. **"信号梯度"不是唯一的位置信息来源**：#06 的均匀生长素 + 预模式二元读出；#08 的水通量图式。这是第 2 节最有新意的角度。
2. **多层级是组织框架而非修辞**：#10 明确给出 fiber→wall→cell→tissue 四级与"应力值逐级不同"的警告——写作时必须避免跨层级套用应力的常见错误。
3. **应力反馈难题是第 4 节最好的"未解决问题"**：#10 原文"how global and local stresses might be discriminated by cells remains unclear"。
4. **接口有分子实体**：#14（CSC–微管）、#13（微管稳定→分裂面）、#11（MAP70-5）说明耦合不是黑箱。
5. **注意证据的地域性**：#11/#12/#13 分别是侧根/果蝇/根创伤，不是 SAM；写作时必须显式标注外推的限度，否则属于"结论强度超过证据强度"。

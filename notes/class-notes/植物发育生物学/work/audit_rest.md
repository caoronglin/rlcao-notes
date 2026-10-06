# 第 1/4/5 节 + 摘要 + 参考文献 事实核查报告

核查范围：正文 §1（引言）、§4（问题分析）、§5（展望）、摘要、关键词，以及"## 参考文献"全部 18 条。
核对基准：`refs/*.pdf` 原文（18 篇全部可提取文本，无扫描件）。
页码均为 **PDF 物理页**。

> **重要前置说明（编号陷阱）**：`refs/manifest.json` 里**没有编号字段**，且**文件名序号 ≠ 正文引用序号**。
> 例如 `04_s41467-024-48361-7_...pdf` 是正文 [1]（Cui, DA1–WUS），`01_dev200787_...pdf` 是正文 [4]（Dao, CLE16/17）。
> 本报告一律按 DOI 建立映射：
> [1]=04、[2]=10、[3]=09、[4]=01、[5]=02、[6]=05、[7]=16、[8]=03、[9]=06、[10]=08、
> [11]=18、[12]=07、[13]=14、[14]=11、[15]=13、[16]=12、[17]=15、[18]=17。
> 另外 manifest 中 6 条标为 `"status": "fail"`（01/03/06/09/10/15），但这些 PDF 文件**实际存在且可读**——是 manifest 未更新的历史残留，不是"读不到"。真正无法从 PDF 核实的只有少数卷期号（见下）。

---

## 汇总

核查表述数：**38**　发现不一致：**6**　⚠️ 强度/措辞需调整：**9**　未核实：**2**

- 严重（事实性错误）：**2 条** —— [12] 作者姓氏错误、§3.3 微管"受压"应为"低张力"
- 中等（引用支撑不足/转述失真）：**4 条**
- 轻微（措辞/卷期等）：**9 条**

**最严重的一条**：[12] 的第一作者写作 `Hu ZL`，PDF 原文为 **Zi-Liang Hua**（姓 Hua，非 Hu）——这是硬性著录错误，且正文 §2.3 全段建立在该文上。

---

## 孤儿引用检查

正文出现的全部引用序号：**1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18**

参考文献中的序号：**1–18**（连续，无跳号、无重号）

**仅正文有（缺条目）：无**
**仅文献有（未引用）：无**

各文献被引次数（正文上标 `[n]` 计数，含 §2/§3 部分）：

| 编号 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 次数 | 7 | 9 | 8 | 2 | 1 | 1 | 1 | 1 | 2 | 2 | 2 | 2 | 2 | 3 | 2 | 2 | 2 | 1 |

✅ 无孤儿引用，编号体系自洽。

---

## 参考文献格式问题

### A. 作者著录错误（1 条）

**[12] 作者姓氏拼写错误 —— 硬性事实错误**
- 论文写：`12. Hu ZL, Wilson-Sánchez D, Bhatia N, 等.`
- PDF 原文（`07_pnas2321877121_CUC1_auxin_module.pdf`，物理页 1）：`Zi-Liang Hua, David Wilson-Sánchez, Neha Bhatia, ...`
- 该作者是 Zi-Liang **Hua**（与 Miltos Tsiantis 合作，ChCUC1 工作），姓 **Hua**，不是 Hu。
- 建议：改为 `Hua ZL, Wilson-Sánchez D, Bhatia N, 等.`（后续作者不受影响，Tsiantis 为末位作者）
- 其余 17 条作者顺序**均与 PDF 首页完全一致**（逐条比对，见下表）。

### B. 卷(期)标注问题

Annual Review 系列**不设期号**，论文却给 [7]、[17] 加了 `(1)`，属杜撰：

| 编号 | 论文著录 | PDF 实际 |
|---|---|---|
| [7] | `39(1): 91–121` | `Annu. Rev. Cell Dev. Biol. 2023.39:91-121`（无期号）|
| [17] | `38(1): 321–347` | `Annu. Rev. Cell Dev. Biol. 2022. 38:321–47`（无期号）|

- 建议：去掉 `(1)`，写作 `39: 91–121` 与 `38: 321–347`。

**期号在 PDF 中未出现、无法从原文核实**（但格式本身合理、也与出版事实一致，不算错）：
[2] 379(6631)、[3] 25(5)、[4] 149(19)、[6] 37(1)、[8] 150(23)、[11] 190(4)、[14] 8(6)。
其中 [3] 的 25(5) 与页脚 `Volume 25 | May 2024 | 340–358`（5 月刊＝第 5 期）自洽。

### C. 期刊名一致性

- **期刊名格式本身统一**：18 条全部用英文全称、全部加斜体、全部不用中文刊名。**不存在中英文混用**。
- **正文从未出现任何期刊名**（已全文 grep 确认），所以正文里的 "*The Plant Cell*" vs "Plant Cell" 混用问题**不存在**。
- [6] 写作 *The Plant Cell*（2024 年更名后的官方刊名，PDF 页眉即 `The Plant Cell, 2025, 37, koae312`）——**正确，不建议改**。
- 轻微不统一一处：[12] 用缩写 `PNAS`，其余 17 条用全称。若追求统一可改为 `Proceedings of the National Academy of Sciences`。建议改为全称或在全文统一缩写。

### D. DOI

✅ **18 条全部有 DOI，无一缺失**，格式统一为 `DOI: 10.xxxx/xxxxx`（无句点结尾，符合 GB/T 7714）。
逐条与 PDF 首页 DOI 全部核对一致：
`10.1038/s41467-024-48361-7` / `10.1126/science.ade8055` / `10.1038/s41580-023-00691-y` / `10.1242/dev.200787` / `10.1038/s41477-023-01485-y` / `10.1093/plcell/koae312` / `10.1146/annurev-cellbio-020823-011522` / `10.1242/dev.202014` / `10.1038/s41477-022-01111-3` / `10.1038/s41467-024-51099-x` / `10.1093/plphys/kiac370` / `10.1073/pnas.2321877121` / `10.1038/s41477-022-01218-7` / `10.1126/sciadv.abm4974` / `10.1016/j.devcel.2024.03.009` / `10.1038/s41467-023-36739-y` / `10.1146/annurev-cellbio-120420-095337` / `10.1038/s41467-022-30177-y`

### E. "等"的使用

✅ **统一且符合 GB/T 7714-2015**（西文文献最多著录 3 位作者后加"等"）。
- 3 位及以下者全部列全：[2] Coen E, Cosgrove DJ / [3] Cosgrove DJ / [6] Wang G, Wu Z, Sun B / [7] Kicheva A, Briscoe J / [17] Bailles A, Gehrels EW, Lecuit T
- 4 位及以上者用"等"：[1][4][5][8][9][10][11][12][13][14][15][16][18]
- 无"漏加"或"多加"的情况。

### F. 页码/文章号逐条核对（全部 ✅）

| 编号 | 论文 | PDF 页脚/页眉实况 | 判定 |
|---|---|---|---|
| [1] | 15: 4627 | `Nature Communications \| (2024)15:4627` | ✅ |
| [3] | 25(5): 340–358 | `Volume 25 \| May 2024 \| 340–358` | ✅ |
| [5] | 9(8): 1306–1317 | `Nat Plants. 2023 August; 9(8): 1306–1317` | ✅ |
| [9] | 8(3): 269–280 | `Nature Plants \| VOL 8 \| March 2022 \| 269–280` | ✅ |
| [10] | 15: 6944 | `Nature Communications \| (2024)15:6944` | ✅ |
| [11] | 190(4): 2335–2349 | `PLANT PHYSIOLOGY 2022: 190: 2335–2349` | ✅ |
| [12] | 121(26): e2321877121 | `PNAS 2024 Vol. 121 No. 26 e2321877121` | ✅ |
| [13] | 8(9): 1064–1073 | `Nature Plants \| VOL 8 \| September 2022 \| 1064–1073` | ✅ |
| [15] | 59(10): 1333–1344 | `Developmental Cell 59, 1333–1344, May 20, 2024` | ✅ |
| [16] | 14: 1220 | `Nature Communications \| (2023)14:1220` | ✅ |
| [18] | 13: 2838 | `NATURE COMMUNICATIONS \| (2022)13:2838` | ✅ |
| [4] | 149(19): dev200787 | `Development (2022) 149, dev200787` | ✅（期号未印）|
| [8] | 150(23): dev202014 | `Development (2023) 150, dev202014` | ✅（期号未印）|
| [14] | 8(6): eabm4974 | `Sci. Adv. 8, eabm4974 (2022)` | ✅（期号未印）|
| [6] | 37(1): koae312 | `The Plant Cell, 2025, 37, koae312` | ✅（期号未印）|
| [7] | 39(1): 91–121 | `Annu. Rev. Cell Dev. Biol. 2023.39:91-121` | ❌ 期号杜撰 |
| [17] | 38(1): 321–347 | `Annu. Rev. Cell Dev. Biol. 2022. 38:321–47` | ❌ 期号杜撰 |
| [2] | 379(6631): eade8055 | PDF 为 accepted manuscript，**未印卷期** | ❓未核实 |

---

## 逐条事实结果

### 摘要

#### [12] 摘要 全段
> "位置信息还可来自生长素的局部合成、组织预模式对均匀信号的差异化读出，以及水通量图式；……微管与纤维素合酶的互作构成壁—膜—骨架的物理连续体，机械力又能反向稳定微管、定向细胞分裂。"

- **判定**：✅（但见下方 §3.3 对"受压"用词的提醒）
- **原文依据**：
  - [8]（`03_...pdf`，物理页 1，Abstract）：`TAA1 and TAR2 played a role in maintaining auxin responses and the identity of PZ cell types.`
  - [9]（`06_...pdf`，物理页 1，Abstract）：`spatial information from an AS2–KAN1 meristem prepattern governs the conversion of a uniform auxin input into an ARF-dependent binary auxin response output`
  - [10]（`08_...pdf`，物理页 1，Abstract）：`we propose that the differential sink strength of emerging organs prescribes the hydraulic patterns that define boundary domains at the shoot apex`
  - [13]（`14_...pdf`，物理页 1，Abstract）：`the interaction of cellulose synthase with cortical microtubules forms a physical continuum between the cell wall, plasma membrane and the cytoskeleton`
  - [15]（`13_...pdf`，物理页 1，Highlights）：`High cellular tension in plant cells, e.g., via stretching, stabilizes microtubules` / `Higher microtubule abundance in stretched cell parts leads to division reorientation`
- **建议**：摘要本身无越界论断，五项论断全部有原文支撑。唯一可改进处见 §3.3（摘要此处用"稳定微管"，比正文 §3.3 的"受压"更准确，建议正文向摘要看齐）。

---

### §1 引言

#### [1] §1.1 第一句
> "SAM 按细胞学特征分为中央区（CZ）、周边区（PZ）与肋状分生组织（RM）……"

- **判定**：⚠️ **引用支撑不足**（RM 在 [1] 中不存在）
- **原文依据**：`04_s41467-024-48361-7_...pdf`，物理页 1：`The Arabidopsis SAM contains three distinct layers of cells (L1-L3)... The SAM can be divided into different functional domains according to its functions and cytological features. The region containing pluripotent stem cells is called the Central Zone (CZ), in which cells divide slowly and form Peripheral Zones (PZ). The Organizing Center (OC) is a group of cells beneath the CZ...`
  → [1] 全文（物理页 1–11）**grep "rib"/"RM" 无任何肋状分生组织表述**；它给的是 **L1–L3 层** + CZ/PZ/OC。
  → 三分区 CZ/PZ/RM 的表述实际出自 **[8]**（`03_...pdf`，物理页 1）：`The shoot apical meristem (SAM) of higher plants comprises distinct functional zones... peripheral zone (PZ)... Stem cell daughters that are pushed underneath the CZ form rib meristem (RM).`
- **建议**：`……分为中央区（CZ）、周边区（PZ）与肋状分生组织（RM）[1][8]`（补引 [8]），或改引 [8] 单独支撑三分区说法。
  附带提示：若想同时保留层次信息，可加"（另有 L1–L3 层次划分[1]）"，因为 [1] 恰好支持的是后者。

#### [1] §1.1 "分生组织的大小由干细胞数量决定，并进一步影响由它衍生出的器官大小"
- **判定**：✅
- **原文依据**：同文件物理页 1：`Meristem size is determined by the number of stem cells, and these influence the size of organs derived from the meristem.`
- **建议**：无需改。

#### [1] §1.1 / §2.1 "在 CZ 诱导 WUS 表达可使分生组织增大"；"该级联失活同样造成分生组织变大"
- **判定**：✅
- **原文依据**：物理页 1：`Conversely, induction of WUS in the central zone leads to increased apical meristem size.`；`Loss of function of this cascade leads to larger meristems due to WUS over-expression.`
- **建议**：无需改。

#### [1] §2.1 "WUS 还以 HAM 转录因子形成异二聚体，共同把 CLV3 的表达限制在顶层细胞"
- **判定**：⚠️ 措辞小偏差
- **原文依据**：物理页 1：`WUS-HAM heterodimers confine CLV3 expression to the outer apical meristem layer.`
- **建议**：`顶层细胞` → `茎尖分生组织最外层细胞`（原文是"最外层/outermost"，非"最顶层/topmost"）。同段 WUS 特异表达于 OC、WUS 功能缺失表型均 ✅。

#### [2] §1.2 Coen & Cosgrove 引语
> "'把图式化的基因活动转化为细胞与组织的机械变形'是发育生物学的核心挑战，而植物细胞不迁移、不重排的特性，使这一转化比在动物中更易于分析"

- **判定**：✅ **完全准确，是原文直引**
- **原文依据**：`10_science_ade8055_...pdf`，物理页 1，Abstract：`Understanding the mechanism by which patterned gene activity leads to mechanical deformation of cells and tissues to create complex forms is a major challenge for developmental biology. Plants offer advantages for addressing this problem because their cells do not migrate or rearrange during morphogenesis, simplifying analysis.`
- **建议**：无需改。这是全文引用最规范的一处。

#### [3] §1.2 "细胞壁研究也从'成分清单'转向'承力网络的物理行为'"
- **判定**：✅（合理转述，非引语）
- **原文依据**：`09_s41580-023-00691-y_...pdf`，物理页 1：`This has revised traditional notions of matrix polysaccharides (hemicelluloses and pectins), previously thought to be key load-bearing links between cellulose microfibrils`；并有 `Recent findings have led to a paradigm shift as new evidence shows that cellulose itself can form a strong yet extensible fibrous network...`
- **建议**：无需改。

#### §1.3 "所引文献以 2022 年以后的原创研究与综述为主"
- **判定**：✅
- **原文依据**：18 条文献年份 2022–2025，全部晚于 2022。
- **建议**：无需改。

---

### §4 问题分析

#### [3] §4.2 Cosgrove 引语
> "Cosgrove 明确指出'细胞如何感知壁应力方向仍不确定'[3]"

- **判定**：✅ **准确，是原文直引**
- **原文依据**：`09_...pdf`，物理页 13（印刷页 352）Cell wall sensors 节末：`Wall sensors of an altogether different kind have been discussed in the context of mechanobiology, in which microtubule orientation is frequently (though not always) observed to align with the direction of maximal cell wall stress... How cells might sense the direction of wall stress is uncertain.`
- **建议**：无需改。

#### [2] §4.2 Coen & Cosgrove 引语
> "Coen 与 Cosgrove 则提出更细的困难——细胞如何区分全球性应力与局部应力，仍不清楚[2]"

- **判定**：✅ **准确，是原文直引**
- **原文依据**：`10_...pdf`，物理页 8（印刷页 356）：`To circumvent this problem, it has been proposed that global stresses across the developing organ may be sensed (85), though how global and local stresses might be discriminated by cells remains unclear.`
- **建议**：无需改。**你特别要求核查的两句都是原文表述，无转述失真。**

#### [2] §4.2 "现有假说包括跨膜受体的双域结构、膜蛋白的不对称定位等，均缺乏决定性证据[2]"
- **判定**：⚠️ 强度偏弱 / 措辞失真
- **原文依据**：`10_...pdf`，物理页 5：`One hypothesis is that membrane-spanning receptors have two domains... However, enzymatic treatments or mutants that modify mechanical properties of walls by interfering with cellulose content have no discernible effect on microtubule patterning (50, 51), which argues against this mechanism.` / 物理页 5–6：`Another microtubule-orienting hypothesis is based on asymmetric localisation of molecules across a cell...`
- **建议**：原文对"双域受体"假说是**给出了反证**（"argues against this mechanism"），不只是"缺乏证据"；对"不对称定位"假说才是尚无定论。建议改为：
  `……现有假说包括跨膜受体的双域结构（原文指出干预壁力学性质并不影响微管图式，倾向于否定该机制）与膜蛋白的不对称定位等，后者仍缺乏决定性证据[2]`

#### [2][9] §4.1 "四类方法：遗传学……活体成像……力学测量……计算建模"
- **判定**：⚠️ **引用支撑不足**（[9] 不含力学测量，也不含计算建模）
- **原文依据**：
  - [2] 物理页 8：`Computational modelling, informed by developmental genetics, live imaging and growth analysis, has been used to determine whether such principles could account for tissue morphogenesis.` → **三类**（发育遗传学、活体成像、生长分析），**无"力学测量"作为并列的第四类**（力学测量在 [2] 中是散见于正文的手段，如 micro-indentation，不是被列举的方法学支柱）。
  - [9]（`06_...pdf`，物理页 1，Abstract）：`by combining time-lapse confocal imaging, cell lineage tracing and molecular genetic analyses` → **完全无力学测量、无计算建模**（物理页 1 全文确认）。
- **建议**：若要保留"四类方法"这一归纳，[9] 应换成同时含力学与建模的文献，或把 [9] 改为只支撑"活体成像+遗传学"。更稳的写法：
  `过去数年的进展依赖几类方法的合流：遗传学提供因果扰动，活体成像提供时空分辨的生长数据，力学测量提供物理量，计算建模将其纳入同一框架并提出可检验预测[2][10][12]。`
  （[10] 水通量研究与 [12] CUC1 研究都同时含建模/定量与测量，可替代 [9]；[12] Abstract 明写 `computational modeling`。）

#### [10] §4.1 "水通量研究即为范例：模拟先预测边界细胞水分亏缺，再由染料分配、条件稳健性与分子印记交叉验证"
- **判定**：✅ **四处细节全部命中**
- **原文依据**：`08_...pdf`，物理页 1，Abstract：`Growth simulations using a model that integrates hydraulics and mechanics revealed water fluxes and predicted a water deficit for boundary cells. In planta, a water-soluble dye preferentially allocated to fast-growing tissues and failed to enter the boundary domain. Cell shrinkage next to fast-growing domains was also robust to different growth conditions and different topographies. Finally, a molecular signature of water deficit at the boundary confirmed our conclusion.`
- **建议**：无需改。示例选得很准。

#### [2] §4.3 "当力学环境既由基因表达决定、又反过来影响基因表达时，因果方向难以单方面判定，需要可操控的力学扰动配合可读出基因响应的实验设计[2]"
- **判定**：⚠️ 属论文自己的方法学推论，**[2] 无对应原句**
- **原文依据**：`10_...pdf` 物理页 1 摘要/第 9 节结论均**未提出**"需可操控力学扰动 + 可读出基因响应的实验设计"这一要求；[2] 结论段（物理页 9）只说：`Controversies remain over the role of pectins in controlling wall mechanics, and over the role of mechanosensing or chemical signalling in controlling orientations of growth.` 以及 `many of the underlying molecular mechanisms are unresolved.`
- **建议**：这是合理的作者论断，但不宜挂在 [2] 名下。可改为综述性表述并弱化引号/归属，例如：
  `……因果方向难以单方面判定，因而需要可操控的力学扰动配合可读出基因响应的实验设计（作者观点，[2] 仅指出相关机制"many of the underlying molecular mechanisms are unresolved"）`
  或直接去掉 `[2]` 标记，改为无引文的作者论述。

#### [11][15][14][13][16] §4.3 四个实验系统的逐一核对
> "关键因果证据多来自侧根起始[14]、根创伤愈合[15]与叶表皮细胞[13]及果蝇翅芽[16]"

- **判定**：✅ **四个系统全部准确，无一处张冠李戴**（这是你要求重点核对的一项）
- **原文依据**：
  - [14] `11_sciadv_abm4974_...pdf` 物理页 1 Abstract：`During lateral root formation in Arabidopsis thaliana, the endodermis is actively remodeled...` → 侧根起始 ✅
  - [15] `13_devcel_2024_...pdf` 物理页 2 SUMMARY：`we studied tissue healing after laser-assisted wounding in roots of Arabidopsis thaliana` → 根创伤愈合 ✅
  - [13] `14_s41477-022-01218-7_...pdf` 物理页 1 Abstract：`the number and movement directions of cellulose synthase complexes (CSCs) at the plasma membrane vary during initial stages of development in the cotyledon epidermis of Arabidopsis` → 叶表皮细胞 ✅
  - [16] `12_s41467-023-36739-y_...pdf` 物理页 1 Abstract：`the growing Drosophila wing imaginal disc` → 果蝇翅芽盘 ✅
- **建议**：无需改。"器官与物种差异"的提醒与这四条的分布（两个地下器官、一个叶、一个动物翅芽）也自洽。

#### [12][11][2][17] §4.4 "多层级框架提供了概念工具，却尚未配备跨层级的定量预测方法[2][17]"
- **判定**：⚠️ 部分过度引申
- **原文依据**：
  - [2] 物理页 9 Conclusion：`although tissue-level models have been proposed to account for morphogenetic changes (e.g. Fig. 6E), many of the underlying components remain hypothetical.` → **支持"组件仍是假想"**，但没说"缺少定量预测方法"。
  - [17]（`15_annurev_...pdf`）：全 27 页讨论 mechanochemical patterns，**从不涉及植物多层级框架的跨层定量预测**，无法支撑该引文标记。
- **建议**：把 [17] 的标记去掉，只留 [2]，并把措辞对齐原文：
  `多层级框架提供了概念工具，但作者亦指出其"许多底层组件仍是假想"[2]。`

---

### §5 展望

#### [18] §5.1 全段
> "Neumann 等把单核 RNA-seq 与显微镜三维空间重建结合，重建了花分生组织单个细胞的基因组范围表达图式，并追踪了维管身份的起始[18]"

- **判定**：✅ **四个要素全部准确**（这是你要求重点核对的一项）
- **原文依据**：`17_s41467-022-30177-y_...pdf`，物理页 1，Abstract：`we propose a method to reconstruct genome-wide gene expression patterns of individual cells in a 3D flower meristem by combining single-nuclei RNA-seq with microcopy-based 3D spatial reconstruction.` + `As a proof of principle, the method is used to trace the initiation of vascular identity within the floral meristem.`
  同页 Introduction 另支持前句：`the original physical location of the cell is lost during the experimental process`（对应"单细胞转录组丢失了细胞的原始物理位置"）✅
- **建议**：无需改。作者为 `Manuel Neumann, Xiaocai Xu, Cezary Smaczniak, ...`（`Neumann et al.` ✅），参考文献 [18] 作者顺序亦 ✅。

#### [1] §5.2 "分生组织大小由干细胞数量决定，并影响器官大小[1]"
- **判定**：✅
- **原文依据**：物理页 1 `Meristem size is determined by the number of stem cells, and these influence the size of organs derived from the meristem.`
- **建议**：无需改。

#### [4] §5.2 "冗余配体—受体网络已被明确提出可作为增产靶点[4]"
- **判定**：✅
- **原文依据**：`01_dev200787_...pdf`，物理页 1 Abstract：`...and expands the potential targets for enhancing yield traits in crop species.`；物理页 5 讨论段：`them could lead to agronomic improvements. By identifying two ... targets for crop yield enhancement.`
- **建议**：无需改。

#### [1] §5.2 "DA1–WUS 通路表明细胞分裂素可通过稳定 WUS 扩大分生组织[1]"
- **判定**：✅
- **原文依据**：物理页 1 Abstract：`cytokinin signaling represses the level of DA1 protein in the shoot apical meristem, thereby increasing the accumulation of WUS protein... repression of DA1 by cytokinin signaling stabilizes WUS, resulting in the enlarged shoot apical meristems with the increased stem cell number`
- **建议**：无需改。

---

## 跨节连带发现（正文 §2/§3 部分，因与摘要/§4/§5 论断直接咬合而一并核实）

#### [3] §3.1 "木葡聚糖与果胶虽占据壁的大部分截面积"
- **判定**：⚠️ 措辞取自 [2] 却挂在 [3] 名下
- **原文依据**：
  - [2]（`10_...pdf`，物理页 2）：`Microfibrils are embedded in a hydrophilic matrix of pectins and hemicelluloses that comprise most of the cross-sectional area of the growing cell wall, yet bear little tensile stress` → **"截面积"是 [2] 的措辞**
  - [3]（`09_...pdf`，物理页 3）：`Cellulose, hemicelluloses and pectins comprise most of the dry mass of primary cell walls in a ratio of approximately 1:1:2` → [3] 说的是**干物质比例 1:1:2**，非"截面积"
- **建议**：`……却因力学较弱而承载很小张力` 前半句补引 [2]：`木葡聚糖与果胶虽占壁的大部分干物质（约 1:1:2 的比例中占三分之二）[3]`，或直接改为 `占据壁的大部分干物质[3]`。

#### [3] §3.1 "近期一项统计列出拟南芥 13 个候选壁传感器基因"
- **判定**：⚠️ "统计"应为"综述"
- **原文依据**：`09_...pdf`，物理页 13：`A recent review listed 13 A. thaliana genes implicated as wall sensors, and more will probably be added in the coming years.`
- **建议**：`近期一项统计` → `近期一篇综述`。同段其余部分（THESEUS1 / ABA·SA·JA·BR 通路）✅ 全部准确，见物理页 13：`genetic or chemical impairment of cellulose synthesis activates THESEUS1` / `initiate signalling by abscisic acid, salicylic acid, jasmonic acid and brassinosteroids`。

#### [13] §3.2 "细胞壁—质膜—细胞骨架的物理连续体"
- **判定**：✅
- **原文依据**：`14_s41477-022-01218-7_...pdf` 物理页 1 Abstract：`the interaction of cellulose synthase with cortical microtubules forms a physical continuum between the cell wall, plasma membrane and the cytoskeleton that modulates the mechano-response of the cytoskeleton.`
  同段"子叶表皮发育早期 CSC 数量与运动方向镜像微管组织""解耦后共对齐反而增强""微机械扰动导致 CSC 从质膜流失" ✅ 三项全部命中 Abstract。
- **建议**：无需改。

#### [14] §3.2 两句
- **判定**：✅ **逐字级别准确**
- **原文依据**：`11_sciadv_abm4974_...pdf`，物理页 1 Introduction：`These conclusions were drawn from the analysis of the epidermal surface of the shoot apical meristem, where cells are under strong tension and not fully differentiated. However, it remains poorly understood how plant cells detect and integrate mechanical signals during de novo morphogenesis within a tissue.`
  物理页 1 Abstract：`microtubule arrays facing lateral root founder cells display a higher order compared to arrays on the opposite side of the same cell, and this asymmetry is required for endodermal remodeling and lateral root initiation. We identify that MICROTUBULE ASSOCIATED PROTEIN 70-5 (MAP70-5) is necessary for the establishment of this spatially defined microtubule organization`
- **建议**：无需改。

#### [15] §3.3 "**微管在受压时不稳定**、在被拉伸时稳定"
- **判定**：❌ **转述失真（中等严重）**
- **原文依据**：`13_devcel_2024_...pdf`，物理页 2 SUMMARY：`Microtubules are destabilized under **low tension**, whereas stretching of cells, either through wounding or external aspiration, immediately induces their polymerization.`；物理页 1 Highlights：`High cellular tension in plant cells, e.g., via stretching, stabilizes microtubules` / `Inner root cell matrix is more extendible and stretchable than outer cells`
- **问题**：原文说的是 **"低张力下失稳"**（low tension），不是 **"受压"**（compression）。受压 ≠ 低张力——两者是不同物理状态（受压=正应力，低张力=张力不足）。同篇物理页 3 还专门描述了创伤造成的**压力下降**（`Wounding causes a local pressure drop that deforms the surrounding cells`）从而**引发拉伸**，进一步说明该机制发生在"解压→拉伸"轴上，用"受压"会读成相反方向。
- **建议**：改为 `其机制在于微管在低张力下不稳定、在细胞被拉伸时稳定`。（摘要中已写"机械力反向稳定微管"，与原文一致，正文应向摘要对齐。）

#### [15] §3.3 其余部分
> "以激光辅助创伤后的根组织为系统，发现创伤造成的组织变形使周围细胞扩张方向瞬时改变、微管阵列重定向，并最终预测分裂方向……被拉伸部位更高的微管丰度导致阵列重定向"

- **判定**：✅
- **原文依据**：物理页 2 SUMMARY：`This deformation causes instant redirection of expansion in the surrounding cells and reorientation of microtubule arrays, ultimately predicting cell division orientation.` + `The higher microtubule abundance in the stretched cell parts leads to the reorientation of microtubule arrays and, ultimately, informs cell division planes.` + `This provides a long-sought mechanism for flexible re-arrangement of cell divisions by mechanical forces`
- **建议**：仅需按上条修正"受压"用词。

#### [2] §3.4 多层级框架
> "Coen 与 Cosgrove 把上述过程整理为 fiber→wall→cell→tissue 的多层级框架，并提醒：每上一级，组件被抽象为连续介质，机械应力在各级存在但数值通常并不相同[2]"

- **判定**：✅ **近乎逐字对应**
- **原文依据**：`10_...pdf`，物理页 9 Conclusion：`We have reviewed the mechanics of plant morphogenesis at different inter-related levels, from fiber ... wall ... cell to tissue ... In moving up levels, a population of components is typically abstracted to a continuum at the next level (e.g. fibers to wall, walls to cell, cells to tissue)... Mechanical stresses operate at each level, but values are typically not the same from one level to the next.`
- **建议**：无需改。

#### [2] §3.4 指定/合成生长 + 叶片双极性场 + 锯齿
- **判定**：✅ **全部准确**
- **原文依据**：`10_...pdf`，物理页 8：`Specified growth is how a small region of tissue would grow in isolation... Resultant growth is the way a small region grows when mechanically connected to the rest of the tissue... As tissue deforms, so do the regional patterns that determine the rates and orientations of specified growth, creating a feedback loop.`；`if regions are reinforced in the direction of maximal stress, growth will be retarded in that direction, thwarting coherent changes in tissue shape. Tissue-stress sensing may reinforce a shape, such as leaf flatness (86), but generating a new tissue shape is more difficult.`；`Formation of flattened structures, like leaves, can be modelled with two orthogonal polarity fields... generates an initial primordial bulge followed by development of an extended flat or curved sheet. Growth and shaping of the sheet is oriented by a second (planar) polarity field`；`Modulation of planar polarity and growth rates at the leaf margins can generate serrated forms`
- **建议**：无需改。（唯一可精化处：原文第二个场是 "planar polarity field"、第一个是 "orthoplanar field"，论文统称"两个正交极性场"后接"另一个"，可加括号标明 planar/orthoplanar 以更贴原文。）

#### [16] §3.4 果蝇翅芽盘
- **判定**：✅ **五个要素全部命中**
- **原文依据**：`12_s41467-023-36739-y_...pdf`，物理页 1，Abstract：`we ... address here how differential growth guides the morphogenesis of the growing Drosophila wing imaginal disc. We report that 3D morphology results from elastic deformation due to differential growth anisotropy between the epithelial cell layer and its enveloping extracellular matrix (ECM). While the tissue layer grows in plane, growth of the bottom ECM occurs in 3D and is reduced in magnitude, thereby causing geometric frustration and tissue bending. The elasticity, growth anisotropy and morphogenesis of the organ are fully captured by a mechanical bilayer model. Moreover, differential expression of the Matrix metalloproteinase MMP2 controls growth anisotropy of the ECM envelope. This study shows that the ECM is a controllable mechanical constraint whose intrinsic growth anisotropy directs tissue morphogenesis.`
- **建议**：无需改。

#### [17] §3.4 力化学图式的统一数学框架
> "力化学过程的图式形成已有统一数学框架可供借用，Turing 型自组织与振荡、兴奋性等概念被用于跨系统比较[17]"

- **判定**：✅
- **原文依据**：`15_annurev_...pdf`，物理页 1，Abstract/Keywords：`Mathematical frameworks have been devised to account for the self-organization of biological patterns, most famously the Turing framework. Patterns can be defined in space... or in time, for example, to form oscillations... we emphasize the unitary principles associated with these patterns, across scales in space and time, within a general mechanochemical framework.`；Keywords 含 `Turing pattern, oscillations, excitability`
- **建议**：无需改。

#### [11] §2.3 ARF3 双尺度
- **判定**：✅ **基因名与机制全部准确**
- **原文依据**：`18_kiac370_...pdf` 物理页 1 Abstract：`ARF3 expression in Arabidopsis is mainly activated at the periphery of the SAM by auxin where ARF3 cell autonomously regulates the expression of meristem–organ boundary-specific genes, such as CUP-SHAPED COTYLEDON1-3 (CUC1-3), BLADE ON PETIOLE1-2 (BOP1-2), and TARGETS UNDER ETTIN CONTROL3 (TEC3) to regulate the arrangement of organs in regular pattern... We also show that ARF3 is translocated into the organizing center where it represses cytokinin activity and WUSCHEL expression to regulate meristem activity noncell-autonomously.`
- **建议**：无需改。基因名拼写 `ARF3` / `CUC1-3` / `BOP1-2` / `TEC3` / `WUS` ✅。

#### [12] §2.3 / §4.4 ChCUC1
> "拟南芥与碎米荠的单叶—复叶差异关键在 *ChCUC1* 的图式化表达，ChCUC1 经转录激活 WAG 激酶（调控 PIN 极性）向叶缘生长素图式提供指令性输入"

- **判定**：✅（正文内容准确；但支撑它的文献著录有错，见格式问题 A）
- **原文依据**：`07_pnas2321877121_...pdf` 物理页 1 Abstract：`patterned expression of the transcription factor CUP-SHAPED COTYLEDON1 in C. hirsuta (ChCUC1) is a key determinant of leaf shape differences between the two species... ChCUC1 provides instructive input into auxin-based leaf margin patterning. This input arises via transcriptional regulation of multiple auxin homeostasis components, including direct activation of WAG kinases that are known to regulate the polarity of PIN-FORMED auxin transporters.`
- **建议**：正文无需改；**必须**改参考文献 [12] 的第一作者 `Hu ZL` → `Hua ZL`。

#### [8] §2.2 其一 TAA1/TAR2
- **判定**：✅（细节略强于摘要，可接受）
- **原文依据**：`03_...pdf` 物理页 1 Abstract：`TAA1 and TAR2 played a role in maintaining auxin responses and the identity of PZ cell types. In the absence of auxin biosynthesis and transport, the expression pattern of the marker genes linked to the patterning of the SAM is perturbed.`
  同页 Introduction 给出 CZ/PZ/RM 三分区表述。
- **建议**：正文写"CZ、PZ、RM 的标志基因表达图式被扰乱[8]"——原文摘要只说 "marker genes linked to the patterning of the SAM"，未逐一列出三个分区。**若要为 §1.1 补引 [8]，这正好是理由**；此处可弱化为 `分生组织各标志基因的表达图式被扰乱[8]` 以更贴原文。

#### [9] §2.2 其二 Burian
- **判定**：✅ **六个要素全部准确**
- **原文依据**：`06_...pdf` 物理页 1 Abstract：`by combining time-lapse confocal imaging, cell lineage tracing and molecular genetic analyses, we demonstrate that a stable boundary between adaxial and abaxial cell fates is specified **several plastochrons before primordium emergence** when high auxin levels accumulate on a meristem prepattern formed by the **AS2 and KAN1** transcription factors. This occurrence triggers a **transient induction of ARF3** and an auxin transcriptional response... spatial information from an AS2–KAN1 meristem prepattern governs the conversion of a **uniform auxin input** into an ARF-dependent **binary** auxin response output`
- **建议**：无需改。"原基出现前数个叶间隔期""预模式""均匀输入""二元读出"四处措辞与原文高度对应。

#### [10] §2.2 其三 Alonso-Serra
> "……发现器官-分生组织边界处有一亚群细胞收缩……在不同生长条件与不同拓扑下均稳健，边界的分子印记亦支持水分亏缺[10]。作者据此提出：新生器官的汇强度差异规定了水力图式，从而划定茎尖的边界域。"

- **判定**：✅ **五个要素全部准确**
- **原文依据**：`08_...pdf` 物理页 1 Abstract：`we mapped cell volumetric growth across the shoot apex... a subpopulation of cells at the **organ-meristem boundary** shrinks` / `predicted a water deficit for boundary cells` / `robust to different growth conditions and different **topographies**` / `a molecular signature of water deficit at the boundary` / `the **differential sink strength** of emerging organs prescribes the hydraulic patterns that define boundary domains at the shoot apex`
- **建议**：无需改。

#### [3] §3.1 承力网络结论
> "主要承力的是纤维素网络，通过纤维素微纤维间的直接接触传递张力……它们可能通过影响纤维素如何组装成承力网络而间接调节壁的力学"

- **判定**：✅
- **原文依据**：`09_...pdf` 物理页 3：`because they were mechanically weaker than the cellulose–cellulose network they carried little tensile stress; instead, tensile forces were transmitted **directly within the cellulose network through regions of direct cellulose–cellulose contacts**, which can be very strong. Xyloglucan and pectins may modulate wall mechanics indirectly by influencing how cellulose assembles to form a load-bearing nanoscale network.`
  同页并有对"tethered network model"（木葡聚糖系绳）的明确否定，与论文"修正了木葡聚糖系绳是主要承力环节的传统图景"呼应 ✅
- **建议**：除前述"截面积/干物质"措辞问题外，无需改。

#### [3] §3.1 生长闭环 + 各向同性膨压 + 激素调控壁
- **判定**：✅ **全部准确**
- **原文依据**：`09_...pdf` 物理页 1：`Wall loosening and consequential stress relaxation create the impetus for cellular water absorption by reducing turgor pressure... This reduces turgor pressure slightly, initiating cellular water influx, which restores turgor and enlarges the cell.`；`Although turgor force is isotropic (the same in all directions), the resultant wall stresses differ spatially in magnitude and direction as a consequence of cell shape and variations in wall thickness.`；`auxin rapidly stimulates wall acidification through nuclear and extranuclear signalling pathways, and the low wall pH promotes wall loosening by activating expansin proteins`；`the binding of rapid alkalinization factor (RALF) peptides to the extracellular domain of FERONIA... inhibits the proton pump, raising wall pH, decreasing expansin action and inhibiting wall growth`
- **建议**：无需改。

#### [3] §3.2 "随机排列对应均匀膨胀，高度定向排列对应定向伸长"
- **判定**：✅
- **原文依据**：`09_...pdf` 物理页 2：`...partly controlled by cellulose direction, which may be random (isotropic) or highly directional (anisotropic)`
- **建议**：无需改。

---

## 重点风险项

按严重程度排序，供优先修改：

### 🔴 风险 1（硬性事实错误，必须改）：参考文献 [12] 第一作者姓氏错误
- 现状：`Hu ZL, Wilson-Sánchez D, Bhatia N, 等.`
- 原文（`07_pnas2321877121_CUC1_auxin_module.pdf` 物理页 1）：**`Zi-Liang Hua`**
- 影响面大：正文 §2.3、§4.4 两处共 2 个引用号都指向该文，且这是全篇唯一的物种比较（拟南芥 vs 碎米荠）证据。
- 改法：`Hua ZL, ...`

### 🔴 风险 2（转述方向失真）：§3.3 "微管在受压时不稳定"
- 现状：`其机制在于微管在受压时不稳定、在被拉伸时稳定`
- 原文（`13_devcel_2024_...pdf` 物理页 2）：`Microtubules are destabilized under **low tension**, whereas stretching of cells ... immediately induces their polymerization.`
- "受压"（compression）与"低张力"（low tension）是相反方向的力学状态；该文创伤实验恰恰是"局部压力下降→周围细胞被拉伸"，读作"受压"会把机制方向讲反。
- 改法：`微管在低张力下不稳定、在细胞被拉伸时稳定`

### 🟠 风险 3（引用错配）：§1.1 的 CZ/PZ/RM 三分区挂在 [1] 上，但 RM 不在 [1] 原文
- 现状：`SAM 按细胞学特征分为中央区（CZ）、周边区（PZ）与肋状分生组织（RM）……[1]`
- [1] 给的是 **L1–L3 层 + CZ/PZ/OC**，全文无 "rib meristem"；CZ/PZ/RM 的三分法出自 **[8]**（物理页 1）。
- 改法：补引 `[1][8]`，或改由 [8] 单独支撑。

### 🟠 风险 4（Annual Review 卷期杜撰）：[7]、[17] 的 `(1)` 期号
- Annual Review of Cell and Developmental Biology **不设期号**，PDF 首页明确为 `2023.39:91-121` 与 `2022. 38:321–47`。
- 改法：去掉 `(1)`。

### 🟠 风险 5（引文归属失当）：§4.3 "需要可操控的力学扰动配合可读出基因响应的实验设计[2]"
- [2] 无此原句，仅在结论提到 `many of the underlying molecular mechanisms are unresolved`。
- 改法：改为作者观点表述，或去掉 `[2]` 归属。

### 🟠 风险 6（引文过载）：§4.1 "四类方法……力学测量" 挂在 [9] 上
- [9]（Burian）只有活体成像 + 谱系追踪 + 遗传分析，**无力学测量、无计算建模**；[2] 该句只列三类。
- 改法：把 [9] 换成同时含建模与测量的 [10]/[12]，或拆分引用。

---

### 核查方法留痕
- 页码依据：`pdftotext -layout` 输出中的 PDF 物理页计数；§3.1/§4.2 引用的印刷页 352 对应物理页 13；§3.2 印刷页 356 对应物理页 8；§3.4/§4.4 印刷页 9 对应物理页 9。
- 无法从 PDF 核实项（已在文中标注）：[2] Science 卷期（本地 PDF 为 accepted manuscript，未印卷期）；[3][4][6][8][11][14] 的期号（PDF 未印期号，但格式与出版事实一致）。
- `refs/manifest.json` 与实际文件状态不一致（6 条 `status: fail` 但文件存在可读；文件序号≠引用序号）。建议更新 manifest，加入 `citation_number` 字段以免后续核查再次踩坑。
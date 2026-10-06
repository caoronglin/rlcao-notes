## [新-42] Uzair M, Urquidi Camacho RA, Liu Z, Overholt AM, DeGennaro D, Zhang L, Herron BS, Hong T, Shpak ED. An updated model of shoot apical meristem regulation by ERECTA family and CLAVATA3 signaling pathways in *Arabidopsis*. *Development*, 2024, **151**(12): dev202870. DOI: [10.1242/dev.202870](https://doi.org/10.1242/dev.202870)

> 元数据经 Crossref API (`api.crossref.org/works/10.1242/dev.202870`) 核对：title、9 位作者顺序、journal = Development、volume 151、issue 12、published 2024-06-15 全部一致。PDF 页眉自述 "Development (2024) 151, dev202870"。**共 15 页（PDF 物理页 1–15）**，p.13–15 为参考文献表。
> 数据/代码：GEO **GSE243494**；模型代码 https://github.com/ZiyiiiLiu/SAM-model-3D（p.13）。基金 NSF IOS-2016756、2243562；NIH R35GM149531。

**实验材料与系统**

拟南芥 Columbia 背景，**3 天萌发幼苗（3DPG）营养生长 SAM**（+ 诱导表达体系的 3DPG 液体培养）。

- **受体（ERF 家族，共 3 个）**：`ERECTA (ER)`、`ERECTA-LIKE1 (ERL1)`、`ERL2`，三者功能冗余调控营养 SAM 宽度并促进叶起始（p.1 导言，引 Chen et al. 2013 / Uchida et al. 2013）。三点三突变体为 `er-105 erl1-2 erl2-1`（p.11）。
  - **注意：本文的 "ERF 家族" 不含 BAM。** BAM1–3 属于更远的 LRR-RLK 支系（对比文献 B 中大麦 HvBAM1–5 与 HvCLV1 同支）。若 §2.1 要在同一段落里同时讲 BAM 受体亚群，必须显式说明二者在拟南芥属不同支系，否则会造成"同一受体家族"的错误印象。
- **配体（4 个，本文的主要新意之一）**：`EPFL1`、`EPFL2`、`EPFL4`、`EPFL6`。更大的 EPF/EPFL 家族在拟南芥有 **11 个基因、4 个支系**（p.9）；其中 2 个支系调控气孔，另 2 个（EPFL4/5/6 与 EPFL1/2/3）作用于 SAM（p.9）。本文证明 **EPFL1、EPFL2 也能像 EPFL4/6 一样抑制 WUS 与 CLV3**——此前只有 EPFL4/6 被验证（p.1、p.10）。
- **遗传材料**：`epfl1,2`、`epfl4,6`、`epfl1/+,2,4,6`、`epfl1,2,4,6`、`clv3-9`、`clv3 epfl1,2,4,6`、`er erl1 erl2`、`clv3 er erl1 erl2`（p.11）。
- **报告基因**：WUSp:H2B-GFP:35St (pESH746)、CLV3p:H2B-GFP:CLV3t (pESH747)（Zhang et al. 2021 构建），本文新构建 DRNp:H2B-eGFP:DRNterm (pAMO102b, 4.86 kb 上游 + 1.38 kb 下游)、DRNLp:H2B-eGFP:35sT (pAMP109, 4.3 kb 上游)、DEX 诱导型 EPFL2 (pAMO113，pOp/LhGR 系统，p.11)。
- **技术**：共聚焦 z-stack（Leica SP8，H2B-GFP + SR2200）、IMARIS 核计数、RT-qPCR、RNA-seq（>50 M reads/样本，3 生物学重复）、cycloheximide (CHX) 阻断翻译实验。
- **模型**：3D 反应–扩散模型，**SAM 用半穹顶内 326 个离散点**（1 length unit ≈ 0.025 μm，邻细胞距离 100 units ≈ 10 μm；细胞数估计自 Chen et al. 2013），每个点跑一组**非线性常微分方程**，Hill 函数描述非线性调控，无通量边界条件，Tellurium 数值求解，取 t = 98 的稳态解，浓度用任意单位 (a.u.)（p.8、p.12）。

**核心论点**

1. **CLV3 调控 WUS 的"每细胞量"，而不是"表达域位置"**。3D z-stack 显示：所有基因型中 WUS 恒定表达在**距表面第 3–4 层**，clv3 中从未观察到向顶端（apical）位移；clv3 里 WUS 只是向下扩展到第 5 层、层数从 2 层变成 3–4 层（p.5 Fig. 5D–G、p.6；讨论 p.10）。作者明确说这**与教科书图示相矛盾**——旧模型（Chickarmane 2012、Hohm 2010、Liu 2020）都假设 WUS 与 CLV3 呈"最小重叠的反向平行梯度"，而 3D 数据表明二者**高度重叠**（p.7 Fig. 5A–F、Fig. 6；p.8 讨论首段）。作者归因于原位杂交切片常为斜切，会把 WUS 误判为"更深"（p.5、p.10）。

2. **分工明确：ERF 管"空间宽度"，CLV3 管"浓度大小"**。定量（Table 1, p.8）：WT 中 WUS+ 细胞 43.5 个；clv3 中 265.8 个且**每细胞 WUS 升 ~22 倍**；er erl1 erl2 中 208.8 个但**每细胞 WUS 仅 1.1 倍（无显著变化）**。反过来 CLV3 每细胞水平在 er erl1 erl2 中升 **5.1 倍**、在 clv3 中仅 2.1 倍。作者结论句（p.6）："the function of CLV3 is to regulate the levels of WUS in cells of the central zone. On the other hand, ERfs restrict the WUS expression domain in the SAM periphery but do not control the cellular levels of WUS in the central zone." 并且 CLV3 与 ERF 调控的都是**径向（radial）轴**而非顶–基轴（p.6："Thus, CLV3 and ERf signaling mainly regulate WUS expression along the radial axis of the SAM and not the apical-basal axis."）。

3. **CLV3 对 WUS 的作用主要是自分泌（autocrine）**。所有表达 WUS 的细胞同时也表达 CLV3（p.6、Fig. 6），即 WUS 细胞自己分泌 CLV3、自己感受。作者保留 L1/L2→L3 的旁分泌作为次要贡献，并推测上层扩散只提供很小一部分配体（p.6）。**这是此前文献中没有被整合进负反馈骨架图景的关系。**

4. **ERF 对 CLV3 的调控独立于 WUS**。er erl1 erl2 中心区中 CLV3 每细胞升 5.1 倍而 WUS 每细胞不变（Table 1, p.8）；且 wus 背景敲除 ERF 反而促进 CLV3 表达（引 Kimura et al. 2018, p.8）。作者进一步推测被子植物中 CLV3 可能还有 WUS 以外的靶标，ERF 抑制 CLV3 可能与这些功能有关（p.8 末）。

5. **ERF 的功能是"叶原基膨大"，不是"原基细胞指定"**。epfl1,2,4,6 突变体中尽管几乎不形成叶原基，**DRNL 却在原基起始细胞带中高效表达**（WT 宽 2–3 细胞 → 突变体 4–7 细胞，并扩展到中心区 L1）；DRN 也更宽（p.5 Fig. 4A–C）。结论（p.5）："cells designated to become leaf primordia are specified, but some other requirements for leaf primordia outgrowth still must be met"（p.11 同义表述）。作者明确承认原假设（ERF 通过诱导 DRN/DRNL 促叶起始）**被自己的数据证伪**（p.5）。

**关键证据与方法**

- **定量拆解（Table 1, p.8）**：把 RT-qPCR 的整体倍数变化**除以**报告基因阳性细胞核数的倍数变化，从而分离"表达域扩大"与"每细胞浓度升高"两个成分。这是本文方法学上最值得借用的一招。

  | 基因型 | WUS+ 细胞数 | WUS 表达/细胞 | CLV3+ 细胞数 | CLV3 表达/细胞 | CLV3+/WUS+ 比 |
  |---|---|---|---|---|---|
  | WT | 43.5 ± 8.0 | 1× | 81.7 ± 23.9 | 1× | 1.9× |
  | clv3 | 265.8 ± 151.3 | **22×** | 791.7 ± 258.3 | 2.1× | 3.0× |
  | er erl1 erl2 | 208.8 ± 97.0 | 1.1× | 286.4 ± 73.7 | **5.1×** | **1.4×** |

- **ERF 配体冗余性（Fig. 1, p.2）**：单/双/三/四突变体的 H2B-GFP 成像 + RT-qPCR。发现**配体间有偏倚分工**：EPFL1/2 对 CLV3 更重要，EPFL4/6 对 WUS 更重要（p.2，Fig. 1F）。**epfl1,2,4,6 与 er erl1 erl2 表型不完全相同**（前者 CLV3 水平更低、域更窄、SAM 稍窄），作者据此提出**可能存在配体非依赖的 ERF 活性，或还有别的 EPFL 配体**（p.3、p.10）。
- **直接 vs 间接靶标的判别（Fig. 2, p.3；p.3–4）**：10 µM EPFL6 处理 3 h，± 10 µM CHX。**CHX 存在时仍被下调 = 直接靶标**；仅在无 CHX 时变化 = 间接。
  - **直接下调**：CLV3、WUS（各约 −50%）、**MEI2 家族 MCT1、MCT2、TEL2**、ERL1、ERL2（受体负反馈下调，呼应 Pillitteri et al. 2007）、AT1G80580（DRN/DRNL 近旁系同源）。
  - **间接**：DRN、DRNL（无 CHX 时上调，有 CHX 时**反而下调**）→ 作者据此提出"ERF 直接抑制该基因家族，同时间接促进 DRN/DRNL 表达"的假说（p.4）；UFO 的调控方式"复杂"（无 CHX 上调、有 CHX 下调，p.4）。
  - **无变化**：AtFEA3（3 个玉米 FEA3 同源之一）→ 不是显著靶标（p.3、p.4）。
- **DEX 诱导 EPFL2 的原位验证（Fig. 3, p.4）**：在 epfl1,2,4,6 背景中于 EPFL2 自身启动子域（SAM 边界区）诱导 7 h，CLV3、MCT1、MCT2 下降，**验证 MCT1/MCT2 确为 EPFL 的内源靶标**；TEL2 可能是 EPFL4/6 特异靶标。构建有低水平泄漏表达（p.4、Fig. 3B/C）。
- **模型结构与验证（Fig. 7, p.8–9；Methods p.12）**：
  - 6 个状态变量：WUS mRNA (Wr)、WUS 蛋白 (Wp)、CLV3 mRNA (Cr)、CLV3 蛋白 (Cp)、EPFL (L)、HAM (H)；Hill 协同性 n_WC、n_WL、n_WW、n_CL1、n_CW2、n_CW3、n_CH1。
  - 网络包含 5 条边：① WUS–CLV3 经典负反馈；② EPFL 抑制 WUS；③ EPFL 抑制 CLV3；④ 来自 rib zone 的 **HAM 抑制 CLV3**；⑤ **高浓度 WUS 反过来抑制 CLV3**（双相调控，Perales et al. 2016 / Shimotohno & Scheres 2019）。另在 Methods 中显式写入 **WUS–细胞分裂素–ARR 构成的正反馈**（p.12）。
  - 空间约束：WUS 限于 L3 及以下；HAM 限于自表皮起第 6 层及以下（p.8 Fig. 7B）。
  - **实验验证方式**：WT、erf 突变体（把 EPFL 产生率置 0）、clv3 突变体（把 CLV3 蛋白产生率置 0）三种情形下，模型能**同时**再现 (i) CLV3 域完全包住 WUS 域、(ii) 去除 EPFL 只扩域不升每细胞浓度、(iii) 去除 CLV3 既扩域又升每细胞浓度（p.8 Fig. 7C–E，p.9 讨论句"reproduced both key single-cell expression changes upon perturbations and distributions of gene expressions that were not captured by previous models simultaneously"）。
  - **反事实扰动（Fig. 7F–H, p.8）**：去掉"高 WUS 抑制 CLV3"→ CLV3 既扩域又升浓度；去掉"EPFL 抑制 CLV3"→ CLV3 单细胞上调 + 扩域；去掉"EPFL 抑制 WUS"→ CLV3 与 WUS 域同时扩大（WUS 略降是 CLV3 上调的间接结果）。作者由此称这两条 EPFL 调控**都是 SAM 正确图式所必需**。

**可引用句**（英文原句照抄，页码为 PDF 物理页）

1. "Thus, CLV3 and ERf signaling mainly regulate WUS expression along the radial axis of the SAM and not the apical-basal axis." — p.6
2. "This result indicates that the function of CLV3 is to regulate the levels of WUS in cells of the central zone. On the other hand, ERfs restrict the WUS expression domain in the SAM periphery but do not control the cellular levels of WUS in the central zone." — p.6
3. "This means that CLV3 should inhibit WUS expression primarily through autocrine signaling, with WUS-expressing cells secreting CLV3 and the same cells sensing it." — p.6
4. "Previous mathematical models for apical-basal patterning of gene expression in the SAM have either assumed or produced antiparallel gradients of WUS and CLV3 expression with minimal overlap (Chickarmane et al., 2012; Hohm et al., 2010; Liu et al., 2020), which contradicts our 3D high-resolution imaging data (Fig. 5A-F; Movies 1-3)." — p.8
5. "We speculate that in angiosperms, CLV3 signaling might have other targets besides WUS, and suppression of CLV3 by ERfs might be related to these other functions." — p.8
6. "We speculate that ERfs do not specify the primordia founder cells but promote the outgrowth of demarcated leaf primordia." — p.5
7. "We neglected the subcellular geometry of the cells, their contact areas and the influence of mechanics in this study (the effective contact area for WUS transport cannot be directly inferred from total contact area of plasma membrane)." — p.12

**证据强度**

**中—强（分工/自分泌的结论偏强；模型本身的定量预测力偏弱）。**

- 强：CLV3 调"每细胞 WUS 量"、ERF 调"WUS 域宽度"、CLV3 自分泌这三条结论，由 3D z-stack + IMARIS 核计数 + RT-qPCR 折算 + 多突变体（clv3 / ererl1erl2 / clv3 ererl1erl2）交叉支持，且与原位杂交文献的独立记载一致（p.10 逐一核对 Schoof 2000、Brand 2000、Luo 2018 等的原始图）。Table 1 的定量折算方法干净、n=12–26，可信。
- 中：四个 EPFL 冗余的结论。成像层面证据充分，但冗余度主要靠 RT-qPCR 的 n=3 和成像的定性判断；且作者自承 epfl1,2,4,6 与 er erl1 erl2 不等价（p.3、p.10），留了一个未解决的"配体非依赖活性/未知配体"缺口。
- 弱（模型层面）：模型**不是定量预测模型**。原文自述参数用"biologically plausible"值**手工拟合**（"Because only qualitative information is available from the experimental data, we performed the fitting manually"，p.12），浓度全部是任意单位，边界条件为 no-flux，扰动用"把阈值设成 1000"这种人工开关（p.12）。**没有任何一项模型独有预测被后续实验验证**——作者只写"suggests new mutant phenotypes that can be tested in future experiments"（p.7）。所以它是一个**解释性/整合性模型**，不是可证伪的预测模型；引用时不应写成"模型定量预测并验证了……"。

**局限**

1. **作者明确排除了力学**：p.12 明言忽略细胞亚细胞几何、接触面积与力学影响。因此本文**不能**用作信号–力学耦合的支持证据，恰恰相反，它是"纯信号网络"侧的最好基线参照。
2. **受体分辨率不足**：模型把 ERF 受体设为"在每个细胞中恒定表达"的单一变量（L），**没有区分 ER / ERL1 / ERL2，也没有处理受体异二聚体/组合问题**（p.8、p.12）。所以"受体如何组合"这个问题，本文**没有**回答——若 §2.1 想写受体组合，缺口仍在。
3. **只测营养期 SAM**（3DPG），未做花序/花分生组织，与作物的可迁移性有限。
4. **单基因组的单物种研究**；MEI2 家族（MCT1/MCT2/TEL2）在拟南芥中的分生组织功能"unknown"，作者明说需要先做功能分析才能下结论（p.10）——这是一个明确的、作者自己标注的开放问题。
5. DRN/DRNL 表达变宽无法区分"ERF 直接抑制"与"SAM 内生长素积累升高"两种解释（p.4）——这是未解决的混杂。
6. H2B-GFP 报告基因强度是代理读数，跨基因型定量比较本身有局限（作者用 RT-qPCR 做了交叉验证，但仍非绝对定量）。

**对我论文的作用**

**§2.1（CLV3–WUS 负反馈骨架 + 冗余配体 + BAM 受体亚群）——可补三处，且其中一处是纠错性质的：**

- **补"骨架图景的分辨率"**：现在 §2.1 讲负反馈时基本沿用"WUS 上调 CLV3 → CLV3 下调 WUS"的双节点回路。可以升级为**分工回路**：把 Table 1（p.8）作为定量锚点写进去——"CLV3 与 ERECTA 家族并非在同一条轴上做同一件事：CLV3 设定每个中心区细胞的 WUS 浓度（clv3 中升约 22 倍，而阳性细胞数仅升约 6 倍），ERF 则限制 WUS 表达域沿径向的宽度（er erl1 erl2 中阳性细胞数升约 4.8 倍而每细胞浓度几乎不变）"（数据来自 Table 1, p.8）。这一句直接把"负反馈骨架"从示意图升级为可量化的机制分解。
- **补一条此前未被整合的关系：自分泌**。p.6 的观察（所有 WUS+ 细胞同时表达 CLV3）意味着中心区是"自己抑制自己"的结构，而不是"L1/L2 向下游 L3 传递"的经典梯状模型。这可以直接用来说明**信号的空间归属（谁产生、谁感受）在经典示意图中被简化了**——正是"定位置"这一小节最需要的那种细节。同时可以引 p.12 那句"忽略了接触面积"，顺势过渡到本文的力学耦合论点。
- **补"径向 vs 顶–基轴"的辨析**：p.6 与 p.8 明确指出 CLV3/ERF 调控 WUS 是沿**径向**而非**顶–基**轴。如果 §2.1 现在依赖"WUS 在深层、CLV3 在表层"这一空间描述（多数综述图），需要显式声明本文对该图式的挑战及其依据（3D z-stack 排除斜切伪影）。这既是风险也是机会：正好呼应"位置如何被设定"这一核心问题。
- **修正 BAM 的位置**：本文的 ERF = ER/ERL1/ERL2（3 个），**不含 BAM1–3**。若 §2.1 把 ERF 与 BAM 并列为"受体亚群"，需改写为"CLV 支系（BAM1–3，CLV3 之外由 CLE40 等配体激活）与 ERECTA 支系（ER/ERL1/ERL2，由 EPFL 配体激活）在物种间是**可分离、可平行冗余**的两套受体"——这个说法反而更强，因为对比文献 B 里大麦正是把 HvCLV1 与 HvBAM1–5 放在同一支系并观察到 HvBAM5 的代偿性上调（文献 B, p.10）。
- **"定量模型"这个说法要改口**：本文常被转述为"ERECTA 家族的定量模型"，但原文自述**手工拟合定性数据、浓度用任意单位、预测未被验证**（p.12、p.7）。建议表述为"3D 反应–扩散的**机制整合模型**（semi-quantitative, manually fitted）"。若确实需要一个"模型确实预测了新表型"的例子，本文不合格，需要另找（如 Zhou et al. 2018、Liu et al. 2020 或后续工作）。

**对"信号—力学耦合"主线的额外用法**：把 p.12 那句"我们忽略了……力学影响"作为**靶子句**引用——说明领域内最精细的三维信号模型至今仍把力学排除在方程之外，从而正当化本文把力学场显式纳入模型的做法。这比空泛地说"力学很重要"要有力得多。

**版本说明**

- 精读基于 PDF 全文 15 页（`pdftotext -layout` 分批 1–5 / 6–10 / 11–15），非仅摘要。
- 著录经 Crossref 核对（title / 9 位作者 / journal / vol 151 / issue 12 / 2024-06-15）。Crossref 的 `page` 字段为空，本刊以文章号 `dev202870` 代替页码；PDF 页眉亦如此标示。
- 页码一律为 **PDF 物理页**（1–15）。p.13 之后为参考文献，未逐条精读但已核对与正文的引用一致性。
- 期刊页码与 PDF 物理页一一对应（每页页脚印有 DEVELOPMENT + 期刊页码 1–12），故本卡中物理页 1–12 = 期刊页 1–12；物理页 13–15 为参考文献。
- 补充材料（Fig. S1–S4、Table S1 RNAseq 完整结果、Table S2 引物、Table S3 模型全部参数值）**未随本 PDF 提供，未核查**。若要引用具体参数值或 RNAseq 全表，需另取 supplementary。

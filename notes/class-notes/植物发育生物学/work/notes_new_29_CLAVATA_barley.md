## [新-29] Vardanega I, Maika JE, Demesa-Arévalo E, Lan T, Kirschner GK, Imani J, Acosta IF, Makowska K, Hensel G, Ranaweera T, Shiu S-H, Schnurbusch T, von Korff M, Simon R. CLAVATA signalling shapes barley inflorescence by controlling activity and determinacy of shoot meristem and rachilla. *Nature Communications*, 2025, **16**(1): 3937. DOI: [10.1038/s41467-025-59330-z](https://doi.org/10.1038/s41467-025-59330-z)

> 元数据经 Crossref API (`api.crossref.org/works/10.1038/s41467-025-59330-z`) 核对：title、14 位作者顺序、journal = Nature Communications、volume 16、issue 1、published 2025-04-26 全部一致。PDF 页脚自述 "Nature Communications | (2025)16:3937"（文章号 3937）。**共 14 页（PDF 物理页 1–14）**，物理页 1–12 为正文 + Methods，物理页 12–14 为参考文献。
> 收稿 2024-08-14，接受 2025-04-15，online 2025-04-26。
> 数据：显微图像 BioImage Archive **S-BIAD1800**；RNA-seq SRA **BioProject PRJNA1245663**；作图源代码随文提供（p.12）；系统发生树构建脚本 https://github.com/Thilanka-lt/Pfam_domain_tree_construction（p.12）。

**实验材料与系统**

大麦（*Hordeum vulgare* L.）**品种 Golden Promise Fast**（ELGN 遗传背景），长日照 16 h 光/20 °C、8 h 暗/16 °C；4 世代；显微材料种于 QuickPot 96 T 盆于气候室，表型在温室大盆（直径 16.5 cm）中描述（p.10）。发育分期用 **Waddington scale（W）**（p.2）。

- **受体**：`HvCLV1`（*HORVU.MOREX.r3.7HG0747230*），AtCLV1 近正 ortholog，**LRR-RLK，1015 aa，20 个胞外 LRR**（AtCLV1 为 21 个），与 ZmTD1、OsFON1 同支（p.2 Fig. 1a）。同一 AtCLV1 支系中**另 5 个大麦基因被命名为 HvBAM1–HvBAM5**，更接近 AtBAM1–3（p.2）。
- **配体**：`HvFCP1`（FON2-LIKE CLE PROTEIN1，*HORVU.MOREX.r3.2HG0174890*），CLE 家族分泌肽；大麦共鉴定 **28 条 CLE 肽**，含 CLV3 ortholog `HvCLV3` 与进化保守的 FCP1-like 肽（p.6）。人工合成肽序列 REVPTGPDPIHH（p.11）。
- **报告基因**：`pHvCLV1:HvCLV1-mVenus`（C 端融合 mVenus 于胞质激酶域，**能在 Hvclv1 突变体中功能互补**，p.2）；`pHvFCP1:mVenus-H2B`（转录报告，p.6）。
- **编辑系（全部 CRISPR-Cas9 胚转化）**：`Hvclv1-1`、`-2`、`-3`（三个独立等位）；`Hvfcp1-1`、`-2`（两个独立等位，分子分析确认为功能丧失）；`Hvclv1;Hvfcp1` 双突变（p.2、p.6、p.10–11）。
- **数据手段**：SEM（负印 + 环氧树脂翻模 + 喷金）、共聚焦（Zeiss LSM780/LSM880）、**单分子 RNA 原位荧光杂交 smRNA-FISH**（Molecular Cartography™，Resolve Biosciences，10 μm 切片）、RNA-seq（W3.5 花序，3 生物学重复，≥6 G clean reads/样本，Morex v360 参考）、**细胞分割 + MorphoGraphX 2.0 三维重建**、振动切片（Leica VT1000S，50 μm）、HvCLV1 受体内化定量。

**核心论点**

1. **"activity"（活性/增殖力）与"determinacy"（决定性）是两个可被 CLV 通路分别调控的独立属性。** 论文标题与摘要即以此为框架（p.1）。具体到两个作用对象：
   - **花序分生组织 IM 的 activity** = 体积增大、细胞持续增殖、终止被推迟（p.5 Fig. 2k、p.6 Fig. 4h–j）。
   - **小穗轴原基 RP 的 activity** = RP 持续横向加宽、长时间不停止、顶端保持"分生组织状结构"（meristem-shaped structure at their tip, p.5 Supplementary Fig. 3c）。
   - **determinacy（决定性）** = 分生组织在产出其正常"配额"后是否终止。WT 大麦：IM 保持不确定（indeterminate），到 pre-anthesis tip degeneration 才衰老死亡（p.1）；RP 在起始**一个**小花后即 arrest（p.5）。Hvclv1 中 RP 不再 arrest，改为形成更大或额外的小花，甚至形成**二级 RP**（p.5 Fig. 3g–j）。作者原话（p.5）："We concluded that HvCLV1 is required to restrict RP activities to the formation of a single floret." 对照物：小麦 rachilla 保持不确定可产生多达 12 朵小花（p.1）——所以**大麦 RP 的"单花即止"是受 CLV 主动设定的决定性性状，而非默认状态**。

2. **HvCLV1 对 IM 呈"两阶段"调控：先限制生长，后促进小穗起始**（p.5、Fig. 2i,k）。IM 在 W1.5 变大、基底膨大 → 后期出现额外一排小穗（crowned spike）；W2.5–W4.5 快速小穗起始期突变体 IM 反而被"消耗"而变小；W4 以后长度不再显著差异。作者结论（p.5）："HvCLV1 first acts to restrict meristem growth and developmental progression of spikelet primordia, and promotes spikelet initiation at later stages."

3. **同一受体+配体轴对不同分生组织的作用强度不同，FM 相对不受影响**。RP 面积在两个突变体中各阶段都增大（p.6 Fig. 5a,b；p.8 Fig. 5b），IM 在 W5 后增大更快（p.6 Fig. 4h–j），而 **"FMs were less affected"**（p.6、Fig. 5c）。这说明 CLV 信号并非"全局性抑制分生组织活性"，而是**组织特异的作用域**。

4. **Hvfcp1 是 Hvclv1 的上位不完全互作者：双突变不比单突变更强 → 存在配体冗余**。Hvfcp1 表型整体更温和（无 crowned spike），且 Hvclv1;Hvfcp1 双突变的额外花小穗/crowned spike 比例**未超过** Hvclv1（p.6、p.8 Fig. 5d）；Hvfcp1 背景下 RP 中 HvCLV1 蛋白内化**仍可检测到**（p.6、Fig. 5g,h）。作者解释为"其他尚未鉴定的 CLE 肽与 HvCLV1 相互作用并部分救援 Hvfcp1 表型"（p.9）。**但配体表达本身受正反馈调控**：HvCLV1 表达在 Hvfcp1 背景不变，**HvFCP1 表达在 Hvclv1 背景中下降**（p.6、Fig. 5i–l）。

5. **机制落点不是 WUS，而是 T6P（海藻糖-6-磷酸）代谢**。两个突变体中共同变化的转录组（Hvclv1 上调 1208/下调 1197；Hvfcp1 上调 521/下调 258；**55.2% 的上调基因与 39.9% 的下调基因在两突变体中共有**，p.6）指向三条通路：细胞分裂（HvBG1/RBG1 ortholog、HvCYCP4-1、HvTTM3–HvCDC26）、生长素信号（HvIAA13、HvIAA31）、**T6P 代谢**（`HvSRA` 即玉米 RA3 的 T6P 磷酸酶正 paralog 下调、`HvTPS1` 上调 → T6P 积累；下游 `HvSWEET11b` 与 `HvFT2` 上调 → 蔗糖重分配 + 提早开花）（p.6、p.9–10 Fig. 6a）。这与 Arabidopsis/拟南芥中 CLAV 调控 auxin/cytokinin 的通路是**平行的另一条**（p.9 引 Fouracre & Harrison 2022；文献 A 也提到这一点）。

**关键证据与方法**

- **系统发生定位（Fig. 1a, p.2）**：对 2 个双子叶（*A. thaliana*、*S. lycopersicum*）+ 4 个禾本科（*Z. mays*、*O. sativa* japonica、*T. turgidum*、*H. vulgare*）全部蛋白激酶域做 HMMscan（Pfam PF00069，E < 1e−10）→ HMMalign → FastTree（NJ，JTT+CAT）→ 在 CLV1 支系内用 RAxML 重建（1000 次 bootstrap）。方法细节见 p.10。

- **表达定位——smRNA-FISH 单分子分辨（Fig. 1b–m, p.2）**：HvCLV1 mRNA 与蛋白在营养期（W1）与生殖期（W3.5）主要位于顶端分生组织的**最外三层**，并沿小穗发育出现在 RP、FM、LEP 及花器官中（p.2）。**关键细节**：纵切显示 **RP 细胞的胞质结构中 HvCLV1 蛋白内化增强，而相邻 FM 主要定位在质膜上**（Fig. 1j,k，定量见 p.3 Fig. 1k，n=8 小穗/2 次独立实验，Wilcoxon，**p < 0.01**）。作者提出这可能反映 RP 中 HvCLV1 合成与胞内转运增强，**或配体结合后的受体周转**（p.2，引 Roeder et al. 2016 的内化即周转证据）。这是"RP 是 HvCLV1 的主要作用位点"的**分子层面证据**。

- **人工肽的功能验证（Fig. 4a, p.7）**：30 µM 合成 HvFCP1 处理 WT 离体胚 30 天 → **vSAM 高度下降、宽度不变**；**Hvclv1-1 对 HvFCP1 处理完全无反应** → 证明 HvFCP1 经 HvCLV1 起作用（遗传上位关系）。n = 57/53/33/46，3 次独立实验。

- **配体表达域（Fig. 4b–e, p.7）**：`pHvFCP1:mVenus-H2B` 在营养期 vSAM 活跃但**不在叶起始位点**；生殖期从 IM 起、TSM 之后活跃；**在发育中的中央小穗近轴面极性化**，在完全形成的 RP 中亦然；FM 中主要在中央域与心皮原基。**HvFCP1 报告在 RP 中比 HvCLV1 更显著**（p.6、Supplementary Fig. 6）。

- **三维形态定量（Fig. 4h–j, p.7）**：confocal 成像 + 细胞分割 + MorphoGraphX 2.0 对 W4.5–W6.5 的 IM 做三维重建，**分别报告 IM volume 与 IM cell number**（n=5/基因型/时期 × 3 次独立实验）。结果（p.6）：W5 小穗起始终止之后，Hvclv1 与 Hvfcp1 的 IM 增大快于 WT，作者归因于 "enhanced cell proliferation"。**RP 面积**另用 SEM 匹配切面 + 振动切片定量（Fig. 5a–c, p.8；p.6 描述）。

- **SEM 表型谱（Fig. 2, Fig. 3, p.3–5）**：
  - `Hvclv1` 三个等位一致表型：半矮化、茎与穗短、节间少（-1/-2 分蘖减少，-3 不显著）、穗与粒更少更小；**crowned spike**（额外非二列排的小穗）；**多花小穗**（2–3 朵小花、2–3 个独立胚与胚乳、外稃部分融合）。
  - 定量比例（p.5 Fig. 3 图注）：crowned spike 见于 **6/38** 个 Hvclv1-1 花序（W5.5–W6.5，4 次独立实验）；多花小穗见于 **27/38**（Hvclv1-1，垂直排列 24/38、水平排列 10/38）与 **12/35**（Hvfcp1-1，4 次独立实验）。德国 2023 年 3–7 月半田间条件下重现，WT 无（p.3、Supplementary Fig. 3a,b）。
  - 发育进程（Fig. 2h–j, p.4）：Hvclv1-1 营养期与 WT 同步（7–10 DAS），**生殖期加速**，小穗原基数减少并提前终止小穗形成（Fig. 2h,i），**三个等位都早于 WT 抽穗**（Fig. 2j）。

- **RNA-seq 交叉验证（p.6 + p.9–10）**：`HvIAA31` 与 `HvMND6`（CYP450）在 Hvclv1 花序中于**主花轴与 RP** 内上调（smRNA-FISH 空间验证，Supplementary Fig. 10a,b），提供"并非全株均匀上调、而是空间受限的改变"的证据。`HvMADS1`、`HvMADS3` 在突变体中下调，但 smRNA-FISH 显示其**在自身表达组织内并无明显减少**，作者判定该下调很可能**继发于小穗/小花原基数减少**（p.6）——一个难得的、作者主动做出的因果甄别。`COM2` 下调提示 HvCLV1 位于分枝抑制转录因子上游（p.6）。`HvBAM5` 在 Hvclv1 中上调，可能是代偿（p.6、p.10）。

**可引用句**（英文原句照抄，页码为 PDF 物理页）

1. "HvFCP1 and HvCLV1 interact to promote spikelet formation, but restrict inflorescence meristem and rachilla proliferation. Hvfcp1 or Hvclv1 mutants generate additional rows of spikelets and supernumerary florets from extended rachilla activity." — p.1（摘要）
2. "We concluded that HvCLV1 is required to restrict RP activities to the formation of a single floret." — p.5
3. "HvCLV1 first acts to restrict meristem growth and developmental progression of spikelet primordia, and promotes spikelet initiation at later stages." — p.5
4. "Mutation of the HvFCP1/HvCLV1 signalling pathway resulted in enhanced proliferation of the IM and RP compared to WT, which ultimately repressed spikelet formation and promoted inflorescence branching." — p.6
5. "Sizes of the RP were also increased at all stages in Hvclv1-1 and Hvfcp1-1, compared to WT (Fig. 5a, b), while FMs were less affected (Fig. 5c)." — p.6
6. "The increased size of the IM in Hvclv1 and Hvfcp1 caused a reduced formation of spikelet and grains, corroborating the negative correlation between IM size and grain yield previously observed in barley FASCIATED EAR (HvFEA) mutants40." — p.9
7. "Our findings extend the roles for CLV signalling, from feedback signalling in stem cell homoeostasis to coordination of meristem shape, organ formation and determinacy in cereal inflorescences." — p.2（导言末）

**证据强度**

**强。** 理由：

- **多等位、遗传学、药理学、形态学、分子成像、转录组六层证据互相独立且全部收敛**。三个独立的 Hvclv1 等位表型一致（p.2）；两个 Hvfcp1 等位表型不可区分（p.6）；HvFCP1 肽的效应在 Hvclv1 中被消除（p.7 Fig. 4a）建立了明确的配体–受体依赖；RP 受体内化的空间差异（p.2 Fig. 1j,k）把分子事件定位到了正确的组织；smRNA-FISH 对 RNA-seq 的空间验证（p.6）。
- **关键结论有内部对照**。作者不是只说"更大"，而是把 volume 与 cell number 分开报告（Fig. 4i,j）、把 RP 与 FM 分开比较（Fig. 5b vs 5c）、把突变体与 `HvFEA`（已知 IM 增大–产量降低的独立突变体）做交叉印证（p.9）。
- **作者对混杂做了显式排除**：HvMADS1/3 的"全局下调"被自己用 smRNA-FISH 判定为继发于原基数减少（p.6）；DESeq/edgeR 阈值、FDR 与所用统计检验全部在 Methods 中写明（p.11）。
- **可重复性与数据公开程度高**：Source data 逐图提供，n 与独立实验次数在每个图注中给出（p.4、p.7、p.8），图像与 RNA-seq 已存入公共库（p.12）。

**局限**

1. **没有任何力学数据**。全文无细胞壁力学、微管排列、膜张力、细胞大小分布或激光消融/机械扰动实验。因此它**不能**为"信号–力学耦合"提供力学一侧的证据。
2. **没有真正的单细胞转录组**。用的是 smRNA-FISH（Molecular Cartography 单分子空间转录定位），**不是 scRNA-seq / snRNA-seq**；且 W3.5 采样的 RNA-seq 是 40 个花序混样（bulk），无法给出单细胞分辨率的调控网络。
3. **WUS 侧几乎没有正面数据**。全文只在导言中引用拟南芥的 WUS–CLV3 负反馈作为背景，**未检测大麦 WUS/HvWUS 的表达或功能**。因此"CLV 通路在大麦中如何作用于 WUS"仍是空白——这既是局限，也正好是本文可以在讨论里点出的下一步。
4. **表型与产量的关系仍是间接的**。IM 增大→小穗/粒减少的因果链由 IM 体积 + 小穗计数支持，但**没有田间产量试验**，也没有直接测量穗粒数与株产。作者自己在 p.10 说这"corroborates"，即印证既有相关性而非建立新因果。
5. **crowned spike 频率低且只在特定条件下**：6/38（Hvclv1-1）、德国 2023 半田间条件下出现（p.5、p.3）。这一表型作为育种靶点的稳定性需进一步验证。
6. **Hvfcp1 的功能冗余未解决**：作者承认"other, not yet identified CLE peptides"存在（p.9），HvCLV1 的五个 BAM paralog 中只有 HvBAM5 有转录水平证据（p.10），未做遗传学验证。
7. **3D 重建只做到 IM**。RP 是用 SEM 匹配切面 + 振动切片的二维面积来量的（p.8 Fig. 5b），**没有做 RP 的三维体积/细胞数重建**——与 IM 的处理方式不对称。

**对我论文的作用**

**§5.2「从拟南芥到作物」——直接补上单薄处，且能撑起一整段而不只是加一句引用：**

- **把"作物"这一节从"举例"升级为"机制对照"**。现在 §5.2 只有一篇拟南芥 DA1–WUS 论文，读者会问"CLV 通路在真正可推广的作物里到底做什么"。本文的回答是：**在大麦里 CLV 通路的主轴不是 WUS，而是通过 T6P / 蔗糖分配把分生组织的增殖与开花时间耦合起来**（p.6、p.9–10）。可以写一句概括：拟南芥里 CLV 的经典输出是"中心区 WUS 浓度"，大麦花序里 CLV 的主要输出是"分生组织的增殖量–决定性–开花时序"三元组，并经由 T6P 这一**代谢信号**而非转录因子因子执行。这一句正好把"模式形成"和"形态发生"两条线索在作物尺度上接起来。
- **明确写出 "activity" 与 "determinacy" 的定义**（这是任务要求的重点）：activity = 分生组织是否持续增殖（IM 体积/细胞数、RP 是否持续加宽、顶端是否保持分生组织状结构）；determinacy = 是否在产出正常配额后终止（WT 的 RP 起始一朵花即 arrest，小麦的 rachilla 则可产生多达 12 朵花）。**"大麦 RP 的单花即止是 CLV 主动设定的性状"**（p.5）这一句，是全文最锋利、也最适合放进"定形状"论证里的证据——同一器官（小穗轴）在禾本科内部可以被设定成截然不同的输出配额。
- **补"决定性"（determinacy）作为模式形成的一个独立维度**。现在论文的骨架似乎是"定位置、长形状"，本文提供了**第三个可测维度：什么时候停**。可以引 p.1 导言里大麦（不确定、tip degeneration 衰老）与小麦（IM 决定性、rachilla 不决定性）的对比，说明"分生组织的持续时间"本身就是被调控的形态发生参数。这句话能把本文从"补充案例"提升为"扩充维度"。
- **补组织特异性这一论点**。p.6 的 "FMs were less affected" 是一条很干净的证据：**同一受体轴对邻近的不同分生组织施加不同强度的约束**。这可以直接用来支撑论文关于"位置/身份依赖于细胞所处微环境与局部配体梯度"的核心主张——配体 HvFCP1 在 RP 中比 HvCLV1 更强表达（p.6、Supplementary Fig. 6）、HvCLV1 在 RP 中内化更强（p.2 Fig. 1j,k），两条独立的空间证据都指向"作用强度由局部配体/受体配比决定"。
- **补"分生组织大小与产量负相关"这一作物层面的定量后果**。p.9 的 IM 增大→小穗/粒减少，并引 HvFEA 突变体作为独立印证。这让"形态发生参数"有了育种学意义的落点，是纯拟南芥文献给不了的。
- **与文献 A 联用，可写出一个漂亮的跨物种对位**：文献 A（p.8）明确说 CLAV 在早期陆生植物中**独立于 WOX** 调控 auxin/cytokinin（引 Marchantia 的 Hirakawa 2020），并推测"被子植物中 CLV3 可能还有 WUS 以外的靶标"（文献 A, p.8）。本文在大麦中的 T6P 通路正好是一个**具体的、非 WUS 的 CLV 输出实例**。两句并置可以构成一段有张力的论述：拟南芥的 CLV 是"干细胞的稳态回路"，作物的 CLV 是"分生组织活动的代谢与时序调节器"。建议在 §5.2 明确写出这个对位。
- **务必避免的误用**：不要引用本文来支持任何力学论断。它没有力学数据。

**版本说明**

- 精读基于 PDF 全文 14 页（`pdftotext -layout` 分批 1–6 / 7–14），非仅摘要。物理页 1–11 为正文 + Methods，12–14 为参考文献表。
- 著录经 Crossref 核对（title / 14 位作者 / journal / vol 16 / issue 1 / 2025-04-26）。Crossref `page` 字段为空；文章号 3937 取自 PDF 页脚 "Nature Communications | (2025)16:3937"，各物理页页脚一致。
- 页码一律为 **PDF 物理页**。注意物理页与期刊页一一对应（页脚编号 1–12），故物理页 1–12 = 期刊页 1–12。
- **Supplementary 未随本 PDF 提供，未核查**：包括 Fig. S1（系统发生细节 + 内化定量）、S2–S3（Hvclv1 等位表征、田间表型、RP 顶端结构）、S4（pHvCLV1:HvCLV1-mVenus 互补验证）、S5（CLE 家族）、S6（配体 vs 受体表达对比）、S7（Hvfcp1 表型）、S8（3D 重建补充）、S9（RNA-seq 火山图/热图）、S10（smRNA-FISH 空间验证），以及 Supplementary Data 1/2、Supplementary Notes 1/2、Supplementary Tables 1。本卡中"详见 Supplementary Fig. X"处均为**依据正文引述**，未独立核对图件内容。
- Fig. 4i,j 中 IM volume 与 IM cell number 的逐时期间显著性标记在 layout 提取中错位较多；本卡只采用正文明确陈述的结论（"due to enhanced cell proliferation"，p.6），**未**据此断言"体积增大而细胞数不变"。若 §5.2 需要引用体积/细胞数的分离结果，应先核对原始 Fig. 4i,j。
- 大麦材料为 Golden Promise Fast 单品种；HvCLV1 互补性仅在报告基因构建中验证（Supplementary Fig. 4），本卡未核查该图。

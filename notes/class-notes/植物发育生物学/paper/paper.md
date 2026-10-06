# 茎端分生组织如何"定位置、长形状"：模式形成与形态发生的信号—力学耦合

**作者**：曹荣麟
**单位**：西北农林科技大学生命科学学院，生技 2402
**课程**：植物发育生物学（魏永胜）
**日期**：2026 年 9 月

---

## 摘要

茎端分生组织是植物胚后所有地上结构的来源，其发育包含两个相互缠绕的过程：细胞获得位置信息与命运的模式形成，以及组织获得三维形状的形态发生。本文以拟南芥为主要对象梳理这两条线索。模式形成一侧，CLV3 与 ERECTA 家族受体分工设定 WUS 的浓度与作用范围，位置信息还可来自生长素的局部合成、预模式对均匀信号的差异化读出以及水通量图式。形态发生一侧，细胞壁作为承力网络，其纤维素排列方向决定生长方向，微管与纤维素合酶的互作构成壁—膜—骨架的物理连续体，机械力又能反向富集微管、定向细胞分裂。两者接口已有分子实体，分生组织本体上也已可直接测得壁刚度。应力方向如何被感知、壁状态如何转写为内层转录，仍未解决。空间转录组能定位分化何时启动，却无法解释器官何时长得最快，要闭合这一落差需要引入力学测量。

**关键词**：茎端分生组织；模式形成；形态发生；细胞壁力学；各向异性生长；CLV3–WUS

---

## 1 引言

### 1.1 分生组织是胚后发育的源头

植物的地上部分几乎全部产生于茎端分生组织（shoot apical meristem, SAM）。SAM 分为中央区（CZ）、周边区（PZ）与肋状分生组织（RM）：CZ 含有多能干细胞，其子细胞被推向 PZ 后参与侧生器官形成，被推向下方者则形成 RM[1][2]。分生组织大小由干细胞数量决定，并进一步影响由它衍生出的器官大小[1]。

### 1.2 从信号决定论到信号—力学耦合

传统叙述中，分生组织发育被处理为一套信号通路问题：小肽配体、受体激酶、同源域转录因子与植物激素构成调控网络，决定谁保持干细胞身份、谁退出并形成器官。这一框架解释了大量突变体表型，却回答不了一个更基本的问题，即基因表达的图式如何变成组织和器官的三维形状。

近年的工作把力学重新放回中心位置。Coen 与 Cosgrove 明确提出，"把图式化的基因活动转化为细胞与组织的机械变形"是发育生物学的核心挑战，而植物细胞不迁移、不重排的特性使这一转化比在动物中更易于分析[3]。细胞壁研究也随之从成分清单转向承力网络的物理行为[4]。本文在这一背景下考察两条线索如何耦合。

### 1.3 本文范围与逻辑

本文第 2 节梳理位置信息来源，重点是 CLV3 与 ERECTA 家族受体如何分工；第 3 节综述形态发生的物理实现；第 4 节讨论两者的接口及其未解决问题；第 5 节给出展望。全文论证框架见图 1，应力在多层级链条中的传递与断点见图 2，位置信息的三种来源见表 1，力学证据的外推限度见表 2。

<!--FIG1-->

## 2 背景知识：模式形成如何建立位置信息

### 2.1 干细胞微环境的反馈回路与受体网络冗余

CLV3–WUS 负反馈是分生组织稳态的经典骨架。WUS 特异表达于组织中心（OC），功能缺失导致干细胞特性丧失、分生组织早衰；在 CZ 诱导其表达则使分生组织增大。CLV3 与其受体 CLV1、CLV2 构成的级联把 WUS 限制在 OC 内，该级联失活同样造成分生组织变大。WUS 还与 HAM 转录因子形成异二聚体，共同把 CLV3 的表达限制在最外层分生组织层[1]。

这一回路并未止于一条线。CLE16 与 CLE17 两个 CLV3 相关小肽在 *clv3* 缺失时部分代偿其功能，通过受体激酶 BAM 亚群作用于 WUS 上游[5]。CLAVATA 信号的功能也比既往认识更宽：它除了负调控中央区增殖，还是生长素依赖的花原基发生所必需，且该功能可被花序簇生与热诱导的生长素合成部分掩盖[6]。

两个受体支系在回路内分工有别。Uzair 等以三维反应–扩散模型整合了 ERECTA 家族（受 EPFL 类小肽激活）与 CLV 支系（含 BAM，受 CLE 类小肽激活）的证据，发现二者作用于 WUS 的维度并不相同。CLV3 主要设定中央区 WUS 的浓度，*clv3* 中每细胞 WUS 升高约 22 倍；ERECTA 家族主要限定 WUS 表达域的径向宽度，三受体缺失背景下阳性细胞增加约 4.8 倍，而每细胞仅升约 1.1 倍。全部 WUS 阳性细胞同时表达 CLV3，提示 CLV3 对 WUS 以自分泌方式起作用，而非经典的"外层→中心"旁分泌梯状模型[7]。该模型为手工拟合的定性整合模型，其独有预测尚未经实验验证。

分生组织还需被适时终止。花分生组织阶段 6，锌指蛋白 KNUCKLES（KNU）直接抑制 *WUS* 与 *CLV3*，废除维持所需的反馈环，并直接抑制生长素转运蛋白基因 *PIN1* 与细胞分裂素合成基因 *IPT7*，经 H3K27me3 沉积改变两者活性[8]。

### 2.2 位置信息的三种来源

形态发生素梯度的经典图景是：长程作用的信号分子在组织中形成浓度分布，为细胞提供位置坐标。Kicheva 与 Briscoe 明确把这一图景称为早期观点，并指出梯度可来自分布式源，也可被与浓度无关的方式读取[9]。分生组织中的证据显示，位置信息至少有三种来源。

**其一，生长素的合成与运输共同塑造分区。** TAA1 与 TAR2 介导的局部生长素合成与运输协同调控 SAM 模式化；当合成与运输同时缺失，CZ、PZ、RM 的标志基因表达图式被扰乱[2]。分区由合成与运输叠加而成，无法单靠运输梯度读出。

**其二，预模式对均匀信号的差异化读出。** Burian 等用延时共聚焦成像、细胞谱系追踪与遗传分析证明：在叶原基出现前数个叶间隔期，AS2–KAN1 组成的"分生组织预模式"上出现高生长素积累，触发 ARF3 的瞬时诱导与生长素转录响应，从而区分近轴与远轴身份[10]。输入该区域的生长素是均匀的，空间信息来自预模式。

**其三，物理量本身可以充当位置信息。** Alonso-Serra 等绘制了拟南芥茎尖的细胞体积生长图，发现器官—分生组织边界处有一亚群细胞收缩。整合水力学与力学的模拟预测了边界细胞的水分亏缺，体内水溶性染料优先分配至快速生长组织而无法进入边界域，且该收缩在不同条件与拓扑下均稳健[11]。作者据此提出，新生器官的汇强度差异规定了水力图式，从而划定茎尖的边界域。所谓"信号"在这里可以是渗透压与水通量这样的物理量。

<!--TAB1-->

### 2.3 从位置信息到器官排列

位置信息需被翻译为器官的空间排列。ARF3 提供了贯通两个尺度的例子：它在 SAM 外周由生长素激活，以细胞自主方式调控分生组织—器官边界基因 *CUC1-3*、*BOP1-2*、*TEC3*，决定器官的规则排列即叶序；同时 ARF3 蛋白被转运进入组织中心，以非细胞自主方式抑制细胞分裂素活性与 *WUS* 表达[12]。同一分子在两个尺度上作用，生长素与细胞分裂素信号由此得以协调。类似的尺度跨越也见于叶形多样性：拟南芥与碎米荠的单叶—复叶差异关键在 *ChCUC1* 经转录激活调控 PIN 极性的 WAG 激酶，向叶缘生长素图式提供输入[13]。

## 3 研究综述：形态发生的物理实现

### 3.1 细胞壁：兼具强度与可塑性的承力网络

细胞生长的物理定义是细胞大小的不可逆增加。Cosgrove 把这一过程表述为一个闭环：壁松弛导致应力松弛与膨压轻微下降，触发水分流入，膨压恢复并使细胞扩大，其中壁的不可逆屈服（creep）居于核心。膨压虽各向等同，但因形状与壁厚差异，壁内拉应力分布并不均一[4]。

承力结构上有一处反直觉之处。壁的拉应力主要由纤维素网络承担，而纤维素只占壁截面积的一小部分，却经纤维—纤维直接接触传递绝大部分张力，其内部实际应力因此远高于名义壁应力。木葡聚糖与果胶则可能通过影响纤维素如何组装成承力网络而间接调节壁的力学，这修正了"基质多糖是主要承力环节"的传统图景[4]。激素调控路径同样明确：生长素快速酸化壁，低 pH 激活 α-扩张蛋白实现松弛；RALF 小肽结合 FERONIA 则抑制质子泵、升高壁 pH、抑制生长。干扰纤维素合成会激活 THESEUS1 等壁传感器，一篇近期综述列出拟南芥 13 个候选壁传感器基因[4]。

### 3.2 各向异性生长如何实现

生长方向性部分由纤维素排列方向控制：随机排列对应均匀膨胀，高度定向排列对应定向伸长[4]；纤维素的排列方向则由皮层微管引导的纤维素合酶复合体（CSC）决定。Schneider 等发现，子叶表皮发育早期，CSC 的数量与运动方向密切镜像微管组织；解耦两者后，由细胞形状或组织尺度物理扰动驱动的微管共对齐反而增强，且微机械扰动导致 CSC 从质膜流失[14]。作者据此提出，CSC 与皮层微管的互作构成细胞壁—质膜—细胞骨架的物理连续体。基因与力学之间的接口就在这一连续体上。

微管沿最大应力方向对齐是长期观察，但该结论主要来自对 SAM 表皮的分析；在组织内部从头发生形态建成的过程中，细胞如何探测并整合机械信号仍不清楚。Stöckle 等在侧根起始系统中给出了部分答案：面向起始细胞一侧的内皮层微管阵列有序度高于相反侧，该不对称为内皮层重塑与侧根起始所必需，MAP70-5 是建立该空间限定阵列的必要因子[15]。

Lan 等用原子力显微镜微压痕在拟南芥茎端分生组织本体上直接测得了壁的力学状态。*csld5* 突变体的垂周壁表观杨氏模量降低、渗透收缩量增大、分生组织尖端更尖，其转录组中下调基因有相当比例属于触觉核心响应基因；表皮特异的异位表达可完全恢复内层生长与相关基因表达[16]。该结果支持壁状态影响分生组织生长，但壁软化与该突变体同时造成的细胞周期阻滞未被解耦，跨层方向也全部自最外层出发，尚不足以读作"壁张力被内层转录读取"。

### 3.3 机械力如何反向决定细胞命运与分裂

植物形态发生依赖定向的细胞扩张与分裂，但分裂面方向如何决定长期未解。Hoermayer 等以激光辅助创伤后的根组织为系统，发现创伤造成的组织变形使周围细胞扩张方向瞬时改变、微管阵列重定向，并最终预测分裂方向；机制在于微管在低张力下不稳定、在细胞被拉伸时迅速引发聚合，被拉伸部位更高的微管丰度导致阵列重定向[17]。

3.2 与 3.3 合起来构成一条回路：基因决定 CSC 与微管行为，纤维素排列决定壁的各向异性，各向异性决定扩张方向与应力分布，应力反过来富集微管并影响分裂面，新的几何又产生新的应力分布。

### 3.4 多层级框架与计算建模

Coen 与 Cosgrove 把上述过程整理为 fiber→wall→cell→tissue 的多层级框架，并提醒：每上一级，组件被抽象为连续介质，机械应力在各级存在但数值通常并不相同[3]。这一警告有实际意义。把细胞尺度的应力直接套用到组织尺度，是文献中常见错误的来源。

该框架区分指定生长（组织块孤立时的生长）与合成生长（与周围机械连接时的实际生长）：后者可由前者的速率与方向图式经模型算出，而组织形变又改变这些图式，形成反馈环。模型还解释了应力反馈为何不足以产生新形状。若仅在最大应力方向增强，反而会阻碍该方向生长。应力感知更适合维持已有形状，新形状的产生仍需化学极性场来定向各向异性生长[3]。果蝇翅芽盘的发育说明了这套思路在其他系统中的适用性：其三维形态源于上皮层与其包被的细胞外基质之间生长各向异性的差异，一个双层力学模型即可完整捕捉，而该各向异性由 MMP2 的差异表达控制[18]。力化学过程的图式形成另有统一的数学框架可供借用[19]。这条链条的断点落在哪一层，见图 2。

<!--FIG2-->

## 4 问题分析：耦合的缺口

### 4.1 已解决的问题与方法学基础

过去数年的进展依赖四类方法的合流：遗传学提供因果扰动，活体成像提供时空分辨的生长数据，力学测量提供物理量，计算建模将其纳入同一框架[3]。水通量研究即为范例：模拟先预测边界细胞水分亏缺，再由染料分配、条件稳健性与分子印记交叉验证[11]。

### 4.2 应力方向如何被感知仍无定论

微管沿最大应力对齐的现象已确证，但其感受机制不明。Cosgrove 明确指出"细胞如何感知壁应力方向仍不确定"[4]；Coen 与 Cosgrove 则提出更细的困难，细胞如何区分全球性应力与局部应力仍不清楚[3]。在现有假说中，跨膜受体的双域结构不仅缺乏决定性证据，已有分析对其提出了反驳[4]。

### 4.3 因果方向与证据外推的限度

上述回路也带来方法学困难：当力学环境既由基因表达决定、又反过来影响基因表达时，因果方向难以单方面判定。更需留意证据的来源系统。侧根起始、根创伤愈合、叶表皮铺砌细胞与果蝇翅芽盘构成了目前因果链最完整的一组实验系统，但它们分属不同器官、不同发育事件乃至不同类群，其结论向茎端分生组织的转移只能作为提示[15][17][14][18]。在本文所引文献中，Lan 等的工作是直接取自茎端分生组织的少数条目之一，它也随之暴露新的困难：壁状态与内层转录之间的因果链尚缺可解耦的实验设计，且各系统的力学读出彼此不可直接比较[16]。表 2 逐条列出这些限度。

<!--TAB2-->

### 4.4 尺度鸿沟

第 2 节与第 3 节分别成熟，两者的接合仍不完整。CUC1 的例子展示了组织级基因表达场如何下传到细胞极性[13]，ARF3 则展示了单一分子如何在两个尺度上发挥作用[12]。"局部力学差异如何被转换为可遗传的基因表达状态"仍缺少通用答案，多层级框架提供了概念工具，却尚未配备跨层级的定量预测方法[19]。一个对照值得记录：当前最精细的三维信号模型在构建时主动排除了力学，原文明言其忽略了细胞的亚细胞几何、接触面积以及力学的影响[7]。要在这样的模型中纳入力学场，就得同时放弃其中若干已被回避的近似。

## 5 展望

### 5.1 空间组学能定位分化何时启动，解释不了器官何时长得最快

单细胞转录组丢失了细胞的原始物理位置，而重建位置恰恰是连接基因活动与形态发生的关键。Neumann 等把单核 RNA-seq 与三维空间重建结合，重建了花分生组织单个细胞的基因组范围表达图式[20]。这一方法已推进到禾本科花序。Long 等以成像型单分子 FISH 在小麦花序中达到单细胞分辨率，量化出多个发育轴上的表达边界，顶端分生组织区标记在发育中穗轴的阳性细胞占 32.2%，同一基因在颖与外稃中仅 3.3%[21]。位置信息由此从概念落到了具体转录因子及其陡峭边界上。

空间图谱本身并未回答形态发生的问题。Demesa-Arevalo 等在大麦茎尖分生组织中整合单分子空间定位与单细胞转录组，得到全基因组范围的单细胞空间表达矩阵，其中快速生长发生在拟时序 P11–P15 阶段，而该窗口内基因表达几乎没有变化[22]。生长最快的窗口恰是转录静默的窗口。把生长速率成像与膨压测量叠加到这类图谱上，才能解释分化启动之后器官如何继续长下去。

### 5.2 从拟南芥到作物

分生组织大小由干细胞数量决定并影响器官大小[1]，冗余配体—受体网络已被提出可作为增产靶点[5]，DA1–WUS 通路则表明细胞分裂素可通过稳定 WUS 扩大分生组织[1]。作物尺度上还出现了新的调控维度。Vardanega 等在大麦中发现，CLAVATA 信号同时调控花序分生组织的增殖量与其决定性。野生型大麦的小穗轴原基起始一朵小花后即停止，而小麦的穗轴可产生多达 12 朵；*Hvclv1* 突变体中小穗轴不再停止，形成额外小花乃至二级小穗轴[23]。单花即止由受体信号主动设定，并非默认状态。该通路在大麦中的执行方式也不同，下游经由海藻糖-6-磷酸积累、蔗糖重分配与早花，而非经由 WUS[23]。

### 5.3 可切入的研究问题

其一，在 SAM 上施加可操控的力学扰动，检验微管重定向是否先于命运变化，以判定因果方向。其二，用空间转录组比较分生组织内力学条件不同区域的基因表达，筛选"力学响应—命运决定"的候选枢纽基因。

---

## 参考文献

> 元数据经 Crossref API 逐条实证核对（2026-10-06）；Annual Review 系列不设期号；
> 姓氏以论文 PDF 首页为准（e2321877121 的 Crossref family 字段有误，PDF 首页作 "Zi-Liang Hua"）。

1. Cui G, Li Y, Zheng L, 等. The peptidase DA1 cleaves and destabilizes WUSCHEL to control shoot apical meristem size[J]. *Nature Communications*, 2024, 15(1): 4627. DOI: 10.1038/s41467-024-48361-7
2. Yadav S, Kumar H, Mahajan M, 等. Local auxin biosynthesis promotes shoot patterning and stem cell differentiation in Arabidopsis shoot apex[J]. *Development*, 2023, 150(23): dev202014. DOI: 10.1242/dev202014
3. Coen E, Cosgrove DJ. The mechanics of plant morphogenesis[J]. *Science*, 2023, 379(6631): eade8055. DOI: 10.1126/science.ade8055
4. Cosgrove DJ. Structure and growth of plant cell walls[J]. *Nature Reviews Molecular Cell Biology*, 2024, 25(5): 340–358. DOI: 10.1038/s41580-023-00691-y
5. Dao TQ, Weksler N, Liu HMH, 等. Interactive CLV3, CLE16 and CLE17 signaling mediates stem cell homeostasis in the Arabidopsis shoot apical meristem[J]. *Development*, 2022, 149(19): dev200787. DOI: 10.1242/dev.200787
6. John A, Smith ES, Jones DS, 等. A network of CLAVATA receptors buffers auxin-dependent meristem maintenance[J]. *Nature Plants*, 2023, 9(8): 1306–1317. DOI: 10.1038/s41477-023-01485-y
7. Uzair M, Urquidi Camacho RA, Liu Z, 等. An updated model of shoot apical meristem regulation by ERECTA family and CLAVATA3 signaling pathways in Arabidopsis[J]. *Development*, 2024, 151(12): dev202870. DOI: 10.1242/dev.202870
8. Wang G, Wu Z, Sun B. KNUCKLES regulates floral meristem termination by controlling auxin distribution and cytokinin activity[J]. *The Plant Cell*, 2025, 37(1): koae312. DOI: 10.1093/plcell/koae312
9. Kicheva A, Briscoe J. Control of tissue development by morphogens[J]. *Annual Review of Cell and Developmental Biology*, 2023, 39: 91–121. DOI: 10.1146/annurev-cellbio-020823-011522
10. Burian A, Paszkiewicz G, Nguyen KT, 等. Specification of leaf dorsiventrality via a prepatterned binary readout of a uniform auxin input[J]. *Nature Plants*, 2022, 8(3): 269–280. DOI: 10.1038/s41477-022-01111-3
11. Alonso-Serra J, Cerutti G, Godin C, 等. Water fluxes pattern growth and identity in shoot meristems[J]. *Nature Communications*, 2024, 15(1): 6944. DOI: 10.1038/s41467-024-51099-x
12. Zhang K, Zhang H, Pan Y, 等. Cell- and noncell-autonomous AUXIN RESPONSE FACTOR3 controls meristem proliferation and phyllotactic patterns[J]. *Plant Physiology*, 2022, 190(4): 2335–2349. DOI: 10.1093/plphys/kiac370
13. Hua ZL, Wilson-Sánchez D, Bhatia N, 等. A CUC1/auxin genetic module links cell polarity to patterned tissue growth and leaf shape diversity in crucifer plants[J]. *Proceedings of the National Academy of Sciences*, 2024, 121(26): e2321877121. DOI: 10.1073/pnas.2321877121
14. Schneider R, Ehrhardt DW, Meyerowitz EM, 等. Tethering of cellulose synthase to microtubules dampens mechano-induced cytoskeletal organization in Arabidopsis pavement cells[J]. *Nature Plants*, 2022, 8(9): 1064–1073. DOI: 10.1038/s41477-022-01218-7
15. Stöckle D, Reyes-Hernández BJ, Vilches Barro A, 等. Microtubule-based perception of mechanical conflicts controls plant organ morphogenesis[J]. *Science Advances*, 2022, 8(6): eabm4974. DOI: 10.1126/sciadv.abm4974
16. Lan M, Zhu Y, Peaucelle A, 等. CSLD5-mediated cell wall remodelling regulates tissue mechanics and shoot meristem growth[J]. *Nature Communications*, 2025, 16(1): 7229. DOI: 10.1038/s41467-025-62651-8
17. Hoermayer L, Montesinos JC, Trozzi N, 等. Mechanical forces in plant tissue matrix orient cell divisions via microtubule stabilization[J]. *Developmental Cell*, 2024, 59(10): 1333–1344. DOI: 10.1016/j.devcel.2024.03.009
18. Harmansa S, Erlich A, Eloy C, 等. Growth anisotropy of the extracellular matrix shapes a developing organ[J]. *Nature Communications*, 2023, 14(1): 1220. DOI: 10.1038/s41467-023-36739-y
19. Bailles A, Gehrels EW, Lecuit T. Mechanochemical principles of spatial and temporal patterns in cells and tissues[J]. *Annual Review of Cell and Developmental Biology*, 2022, 38: 321–347. DOI: 10.1146/annurev-cellbio-120420-095337
20. Neumann M, Xu X, Smaczniak C, 等. A 3D gene expression atlas of the floral meristem based on spatial reconstruction of single nucleus RNA sequencing data[J]. *Nature Communications*, 2022, 13(1): 2838. DOI: 10.1038/s41467-022-30177-y
21. Long KA, Lister A, Jones MRW, 等. Spatial transcriptomics reveals expression gradients in developing wheat inflorescences at cellular resolution[J]. *The Plant Cell*, 2026, 38(1): koaf282. DOI: 10.1093/plcell/koaf282
22. Demesa-Arevalo E, Dörpholz H, Vardanega I, 等. Imputation integrates single-cell and spatial gene expression data to resolve transcriptional networks in barley shoot meristem development[J]. *Nature Plants*, 2026, 12(1): 107–124. DOI: 10.1038/s41477-025-02176-6
23. Vardanega I, Maika JE, Demesa-Arevalo E, 等. CLAVATA signalling shapes barley inflorescence by controlling activity and determinacy of shoot meristem and rachilla[J]. *Nature Communications*, 2025, 16(1): 3937. DOI: 10.1038/s41467-025-59330-z

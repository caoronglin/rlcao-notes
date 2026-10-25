---
title: Minkyung Baek 2021｜Accurate prediction of protein structures and interactions using a three-track neural network.
date: 2026-10-08
tags: [课程, 结构生物学, 文献精读, 范式起点]
status: primary
类型: 精读笔记
来源: Minkyung Baek et al. *Science* 2021，DOI [10.1126/science.abj8754](https://doi.org/10.1126/science.abj8754)
模块: 范式起点：从衍射反演到可微分建模
主键: 34282049
---

# Accurate prediction of protein structures and interactions using a three-track neural network.

**Minkyung Baek et al.** · *Science* · 2021 · DOI [10.1126/science.abj8754](https://doi.org/10.1126/science.abj8754)

> 所属模块：[[notes/class-notes/结构生物学/AI结构预测/01-范式起点-从衍射反演到可微分建模|范式起点：从衍射反演到可微分建模]]
**元信息**:作者(按原文顺序):Minkyung Baek, Frank DiMaio, Ivan Anishchenko, Justas Dauparas, Sergey Ovchinnikov, Gyu Rie Lee, Jue Wang, Qian Cong, Lisa N. Kinch, R. Dustin Schaeffer, Claudia Millán, Hahnbeom Park, Carson Adams, Caleb R. Glassman, Andy DeGiovanni, Jose H. Pereira, Andria V. Rodrigues, Alberdina A. van Dijk, Ana C. Ebrecht, Diederik J. Opperman, Theo Sagmeister, Christoph Buhlheller, Tea Pavkov-Keller, Manoj K. Rathinaswamy, Udit Dalwadi, Calvin K. Yip, John E. Burke, K. Christopher Garcia, Nick V. Grishin, Paul D. Adams, Randy J. Read, David Baker。第一作者为 Minkyung Baek,末位作者 David Baker。发表于 Science,2021 年,373 卷,871–876 页。DOI:10.1126/science.abj8754。PMID:34282049。

说明:PMC 提取文本自「Network architecture development」一节开始,引言、Methods、参考文献与全部图像未包含在本提取文件中;下图注以「正文提及 Fig.N(图像未获取)」标注。原文首句提到「这五种性质(these five properties)」,但其列举位于未提取的引言中,故五种性质的具体内容在本材料中未获取到。

## 一句话结论

RoseTTAFold 用「1D 序列—2D 距离图—3D 坐标」三轨(track)注意力网络同时处理序列、残基间距离/取向与三维坐标信息,在 CASP14 靶点上精度接近 AlphaFold2(但仍未超过),计算成本极低,可直接从序列生成蛋白-蛋白复合物模型,并成功用于 X 射线分子置换与冷冻电镜(cryo-EM)建模等实际结构生物学问题。

## 研究问题

1. 架构问题:受 CASP14 上 DeepMind(AlphaFold2)结果的启发,能否设计一种让 1D 序列比对信息、2D 距离矩阵信息与 3D 坐标信息「同时来回流动」的网络架构,从而比只推理 MSA(multiple sequence alignment,多序列比对)与距离图的两轨架构更有效地提取序列-结构关系?
2. 应用问题:高精度预测模型能否直接用于实验结构解析——解决此前无法用分子置换(molecular replacement, MR)解出的 X 射线晶体学难题,以及在缺乏同源结构时搭建 cryo-EM 原子模型?
3. 功能问题:结构模型能否为未知结构的蛋白提供功能与人类疾病机制的洞见?
4. 复合物问题:网络既然能处理「链间断点(chain break)」,能否从序列信息直接生成蛋白-蛋白复合物结构,绕过「分别建模单体 + 刚性对接(docking)」的传统流程?

## 方法与数据

- 架构:在两轨(1D 序列轨 + 2D 距离矩阵轨)模型基础上增加第三条并行轨,作用于 3D 主链坐标;三条轨之间的注意力(attention)信息双向流动,使网络能同时推理序列内部、距离内部、坐标内部及三者之间的关系。相比之下,论文指出 AlphaFold2 的两轨架构是在 1D/2D 信息处理完成之后才推理 3D 原子坐标(尽管端到端训练在一定程度上联动了参数)。架构变体的大量尝试总结于 Methods 与 table S1。
- 训练裁剪:因 GPU 显存限制无法直接在全长大蛋白上训练,输入改为不连续裁剪(discontinuous crops)——由两段不连续序列片段组成、共 260 个残基;推理时合并并平均各裁剪产生的 1D 特征与 2D 距离/取向预测。
- 双路线生成最终结构:(a) pyRosetta 路线——把预测的距离/取向分布输入 pyRosetta 生成全原子模型;(b) 端到端路线——平均后的 1D/2D 特征送入最终 SE(3)-等变层(SE(3)-equivariant layer),经从序列到坐标的端到端训练后直接输出主链坐标。网络同时输出逐残基精度预测。两条路线统称 RoseTTAFold。
- 序列信息:当前 RoseTTAFold 因显存限制只使用 MSA 前 1000 条序列;作者尝试 Perceiver 架构,用交叉注意力以种子 MSA(最多 100 条)吸收数千条额外序列,以便利用全部可用序列(常超过 10,000 条),初步结果有前景(fig. S4C–D)。
- 评估数据:CASP14 靶点;CAMEO 连续自动盲测(2021-05-15 起,截至 2021-06-19 共 69 个 medium/hard 靶点);4 个此前 MR 失败的晶体学数据集(总结于 table S2);GPCR 已知结构基准;693 个人类疾病相关蛋白结构域;已知结构复合物的配对序列比对基准(table S4)。

## 关键图表解读

- Fig. 1(正文提及,图像未获取):(A) 三轨架构示意——1D、2D、3D 三条注意力轨及轨间多重连接。(B) CASP14 靶点平均 TM-score 对比:Zhang-server 与 BAKER-ROSETTASERVER 是 CASP14 前二服务器组,AlphaFold2 与 BAKER 是前二人工组;BAKER 系预测基于 trRosetta;两轨模型与 RoseTTAFold(端到端版与 pyRosetta 版)全自动。正文描述 3-track 优于两个顶级服务器组、BAKER 人工组(总排名第二)与自己的 2-track 模型,但**图内各方法的具体平均 TM-score 数值未在正文给出**(图像未获取)。(C) CAMEO medium/hard 靶点盲测,TM-score 取自 cameo3d.org,显示 RoseTTAFold 优于所有其他参评服务器(具体数值未在正文给出)。
- Fig. 2(正文提及,图像未获取):(A) SLP(细菌表面层蛋白)分子置换成功案例:上为 C 端结构域(无已知同源结构)精修结构与 RoseTTAFold 模型对比;下为 N 端结构域,模型按估计 RMS 误差着色(蓝 0.67 Å 到红 ≥2 Å)。RoseTTAFold 模型 95 个 Cα 原子可与最终结构 3 Å 内叠合,Cα-RMSD 0.98 Å;最接近模板 4l3a 仅 54 个 Cα 可叠合,RMSD 1.69 Å。(B) Lrbp(真菌 Phanerochaete chrysosporium 分泌蛋白)精修结构与最近 RoseTTAFold 模型叠合,估计 RMS 误差大于 1.3 Å 的残基被省略。(C) 异二聚 PI3Kγ 复合物中 p101 的 Gβγ 结合域(GBD)的 cryo-EM 建模:彩虹着色模型呈全 β 拓扑并与密度图清晰对应;预测结构与最终精修结构在 β 片上的实际 Cα-RMSD 为 3.0 Å。图用 ChimeraX 绘制。
- Fig. 3(正文提及,图像未获取):(A) TANGO2 模型呈 N 端亲核水解酶(Ntn)折叠,致病突变位点以品红色球显示;(B) 预测活性位点按直系同源保守性着色;(C) ADAM33 前结构域(prodomain)呈 lipocalin 样 β 桶;(D) ADAM33 保守表面斑块;(E) CERS1 跨膜结构预测,TMH2 中致病突变邻近中央腔;(F) CERS1 活性位点放大(催化残基 H182、D213,保守残基 W298)。
- Fig. 4(正文提及,图像未获取):(A)(B) 从序列信息直接预测大肠杆菌(E. coli)两链/三链复合物,左为实验结构、右为 RoseTTAFold 模型,TM-score 标注于下方;(C) 四链人 IL-12R/IL-12 复合物模型与已发表 cryo-EM 密度(EMD-21645)吻合。
- 主表:提取文本中无编号主表(提取文件标注「表 0」);补充材料提及 table S1(架构变体)、table S2(四个晶体学数据集及分辨率)、table S3(TANGO2 同源模型比对错位)、table S4(复合物基准细节)。

## 主要结果与关键数字

- CASP14:3-track 模型(1D/2D/3D 三个层级都带注意力、信息三向流动)是所有测试架构中最好的(Fig. 1B),优于 Zhang-server、BAKER-ROSETTASERVER(基于 trRosetta)、BAKER 人工组与 2-track 模型;但仍不如 AlphaFold2。与 AlphaFold2 一样,RoseTTAFold 的精度与 MSA 深度的相关性低于 trRosetta(fig. S2)。
- 推理速度:序列与模板搜索约 1.5 小时后,端到端版在单张 RTX2080 上约 10 分钟生成 <400 残基蛋白的主链坐标;pyRosetta 版网络计算 5 分钟,再用 15 个 CPU 核心约 1 小时生成全原子结构。pyRosetta 版推理显存更低(>400 残基蛋白 8GB 而非 24GB GPU)。对比:DeepMind 报告单个预测需数张 GPU 算数天。
- CAMEO 盲测:2021-05-15 至 06-19 的 69 个 medium/hard 靶点上,超过所有参评服务器,包括 Robetta、IntFold6-TS、BestSingleTemplate、SWISS-MODEL(Fig. 1C)。
- 分子置换:牛(Bos taurus)甘氨酸 N-酰基转移酶 GLYAT、一个细菌氧化还原酶、细菌表面层蛋白 SLP、真菌分泌蛋白 Lrbp 共 4 个此前用 PDB 模型 MR 失败的晶体学数据集,全部用 RoseTTAFold 模型成功解出;trRosetta 模型则全部失败。成功原因包括用 DeepAccNet 逐残基误差估计对较准确部分加权。SLP 案例:PDB 中仅有覆盖 N 端 38% 序列的远缘模板,95 个 Cα 以 0.98 Å RMSD 叠合(vs 模板 4l3a 的 54 个 Cα、1.69 Å);Lrbp 用 HHsearch 检不出任何同源结构。
- cryo-EM:p101 GBD 的最佳 HHsearch 命中 E 值为 40(不显著)且只覆盖 167 个残基中的 14 个,但预测结构可在低局部分辨率下装入密度图;trRosetta 用相同 MSA 输入未能预测正确折叠(fig. S6)。预测与精修结构在 β 片上 Cα-RMSD 3.0 Å。
- GPCR:对已知结构的 GPCR 基准显示,即便无近缘同源结构,激活态与失活态模型都相当准确,且优于现有 GPCR 模型数据库(fig. S7);为所有未知结构的人类 GPCR 提供了开放/闭合态模型及精度预测。
- 疾病蛋白:为 693 个人类蛋白结构域建模,超过三分之一预测 lDDT > 0.8,对应 CASP14 靶点上平均 Cα-RMSD 2.6 Å(fig. S8)。三个案例:TANGO2 预测为 Ntn 折叠,致病突变 R26K/R32Q/L50P 邻近活性位点(阻碍催化)、G154R 在疏水核产生位阻;基于 <15% 序列一致性的同源模型有多处比对错位。ADAM33 前结构域预测为 lipocalin 样 β 桶,支持「半胱氨酸开关(cysteine switch)」抑制机制。CERS1(残基 98–304,Pfam TLC 结构域)预测为 6 根上下穿越的跨膜螺旋,中央裂隙排布活性必需残基 His182/Asp213、保守残基 W298 及致病突变 H183Q(进行性肌阵挛癫痫与痴呆,降低神经酰胺水平),活性位组成(His182、Asp213、可能还有邻近 Ser212)提示可检验的反应机制。
- 复合物:端到端网络接受两条或多条链的序列输入,直接输出多链主链坐标,约 30 分钟(24G TITAN RTX GPU)完成;在已知结构复合物的配对序列比对基准上(两链 Fig. 4A、三链 Fig. 4B),很多案例 TM-score > 0.8;配对序列间的共进化(co-evolution)信号越强(序列越多)刚性排布越准(fig. S10)。四链人 IL-12R/IL-12 复合物模型与 cryo-EM 密度吻合,识别出 IL-12p35 的 Y189 与 IL-12Rβ2 的 G115 间的相互作用(类比 IL-23p19 W156 与 IL-23R G116),并提示 IL-12Rβ2 N 端肽(残基 24–31,其中 D26 可能与 IL-12p35 的 K190/K194 互作)参与 IL-12 结合。

## 对照与消融

- 3-track vs 2-track:训练集相同、1D/2D 轨注意力架构相似、推理模式相似,3-track 在 CASP14 上更优(Fig. 1B)——作者据此论证「同时在三类表征上推理」优于只推理 MSA 与距离图。
- 端到端版 vs pyRosetta 版:pyRosetta 版更准(Fig. 1B),作者归因于端到端版受显存限制优化不充分、且未利用侧链信息(pyRosetta 路线在全原子弛豫阶段引入侧链);因 SE(3) 等变层已用于网络主体,末端再加 SE(3) 层的增益比 AlphaFold2 情形小。
- vs AlphaFold2:CASP14 上仍落后(Fig. 1B),作者列举三种可能原因:硬件限制了可探索的模型规模、替代架构/损失函数、更充分的推理使用。
- vs trRosetta:CASP14 上显著更优;4 个 MR 案例与 p101 cryo-EM 案例中 trRosetta 均失败。
- CAMEO 盲测:优于 Robetta、IntFold6-TS、BestSingleTemplate、SWISS-MODEL 等全部服务器。
- 采样策略消融:多裁剪合并优于整蛋白一次预测(fig. S4A),假说为各区域挑选最相关序列(fig. S4B);迭代回喂模板 + MSA 随机子采样可产生含更高精度成员的系综,但精度预测器无法稳定挑出更好的模型(fig. S3)。
- Perceiver 扩展:初步结果有前景,但需更多训练才能严格比较(fig. S4D)。
- 复合物:网络只以单体训练,单体结构可能存在训练集偏倚,但复合物无此偏倚;序列数越多复合物排布越准(fig. S10)。

## 作者自述的局限

- 3-track 模型在 CASP14 上仍不如 AlphaFold2,可能与硬件限制(模型规模)、架构/损失函数选择、推理强度(DM 用数张 GPU 算数天)有关。
- 端到端版本精度低于 pyRosetta 版本,系显存限制导致优化不完整、且未纳入侧链信息;作者预期克服硬件限制并纳入侧链后端到端路线至少同样准确。
- 迭代采样产生的高精度模型无法被精度预测器稳定识别。
- 当前只使用 MSA 前 1000 条序列(显存所限);Perceiver 方案尚需更多训练。
- 网络仅以单体训练,单体结构预测可能存在训练集偏倚。
- 多蛋白组装体建模有待在蛋白-蛋白复合物数据集上进一步训练。

## 我的评价

- 论文的自我定位清醒:不宣称在 CASP14 上击败 AlphaFold2,而是主打「接近其精度 + 单次前向极低算力 + 开源可及 + 真实应用落地」的组合,并用 MR/cryo-EM/疾病蛋白/复合物四类案例支撑「模型有什么用」。
- 方法学叙事连贯:两轨 → 三轨的递进、裁剪输入与链间断点的复用(从「显存妥协」变成「复合物预测能力」),是把工程约束转化为方法优势的典型例子。
- 证据层级需注意:CASP14/CAMEO 的具体分数只在图内(图像未获取),提取正文无法定量复述;三轨优于两轨的结论建立在「一组架构变体」之上,变体细节在 table S1 与 Methods(未提取),正文可见的消融控制并不完整。
- 复合物部分最值得审视:模型未用复合物训练,验证依赖已知结构基准与已有 cryo-EM 密度(如 EMD-21645),IL-12 案例属于「与已有密度吻合 + 提出假设」,其中的新互作(Y189–G115、D26–K190/K194)仍属待实验检验的预测。
- 追问(基于论文内部逻辑,非外部事实):若精度预测器在迭代系综中失准是普遍问题,「快速单次前向」路线与「迭代采样」路线在未来版本中应如何取舍?作者对此未给出定量判据。

## 可复现要点

- 三轨架构:1D 序列轨、2D 距离矩阵轨、3D 主链坐标轨,轨内注意力 + 轨间信息双向流动;SE(3)-等变层用于网络主体。
- 输入:不连续双段裁剪,共 260 残基;推理时合并平均多裁剪的 1D/2D 预测;MSA 取前 1000 条(Perceiver 变体:种子 ≤100 条 + 交叉注意力吸收数千条)。
- 双路线:pyaRosetta 全原子路线(网络 5 分钟/RTX2080 + 全原子 1 小时/15 CPU 核,>400 残基用 8GB GPU)与端到端路线(<400 残基约 10 分钟/RTX2080);序列与模板搜索约 1.5 小时。
- 评估工具:CASP14 靶点 TM-score、CAMEO 盲测(cameo3d.org)、DeepAccNet 逐残基误差估计(用于 MR 加权与着色)、lDDT 与 Cα-RMSD 的对应(lDDT > 0.8 ≈ CASP14 平均 2.6 Å)。
- 复合物预测:输入两条以上链的序列(可带模板),输出多链主链坐标,约 30 分钟/24G TITAN RTX;以 TM-score(>0.8 为「很接近」)评估,并考察配对序列数与排布精度的关系。
- 方法对科学共同体开放(公开服务器),以加速生物学研究。

## 术语

- RoseTTAFold:本文提出的三轨蛋白结构预测网络,名称源于架构设计,逐残基输出精度预测。
- three-track network(三轨网络):并行处理 1D 序列、2D 距离图、3D 坐标并在轨间交换信息的网络。
- MSA(multiple sequence alignment,多序列比对):同源序列比对;其深度与精度相关,但 RoseTTAFold 相关性弱于 trRosetta。
- trRosetta:此前最佳的开源方法(CASP14 中 AlphaFold2 之后的次优),BAKER 系服务器与人工组预测所用。
- CASP(Critical Assessment of Structure Prediction,蛋白质结构预测关键评估);CASP14 为第 14 届,DeepMind(AlphaFold2)表现突出。
- CAMEO(Continuous Automated Model Evaluation):对服务器做盲测的连续自动评估实验。
- TM-score:结构相似度指标(0–1,>0.8 视为很接近);lDDT(local Distance Difference Test)与 Cα-RMSD:模型精度指标。
- SE(3)-equivariant layer(SE(3)-等变层):对三维刚体变换等变的神经网络层,用于坐标生成。
- pyRosetta:Rosetta 结构建模套件的 Python 接口,用于从距离/取向分布生成全原子模型。
- molecular replacement(MR,分子置换):用已有模型解 X 射线晶体结构的相位方法。
- cryo-EM(cryo-electron microscopy,冷冻电镜);cryo-EM density map(冷冻电镜密度图)。
- DeepAccNet:逐残基误差/质量预测网络,本文用于模型筛选、加权与着色。
- GPCR(G protein-coupled receptor,G 蛋白偶联受体)。
- Ntn hydrolase(N-terminal nucleophile aminohydrolase,N 端亲核水解酶)折叠;lipocalin 样 β 桶:配体结合折叠类型。
- MPI(metalloprotease inhibitor,金属蛋白酶抑制剂)超家族;cysteine switch(半胱氨酸开关):前结构域抑制机制。
- CERS1(ceramide synthase 1,神经酰胺合酶 1);Pfam TLC domain:CERS1 残基 98–304 所属的结构域;TMH(transmembrane helix,跨膜螺旋)。
- chain break(链间断点):序列输入中允许的不连续处,是复合物直预测的关键;docking(对接):刚性体对接,被本文方法「短路」的传统复合物建模流程。
- HHsearch:灵敏的远缘同源搜索工具;E-value(E 值):命中显著性的统计量。
- co-evolution(共进化):配对序列间残基共变信号,提供复合物链间接触信息。
- Perceiver:以交叉注意力吸收大量额外序列的架构(实验性扩展)。
- GBD(Gβγ binding domain,Gβγ 结合域);PI3Kγ:异二聚磷脂酰肌醇 3-激酶 γ。

---

**导航**

- 模块笔记：[[notes/class-notes/结构生物学/AI结构预测/精读/_index|精读总索引]]
- 上一篇：[[notes/class-notes/结构生物学/AI结构预测/精读/02 John Jumper 2021]]

---
title: Michel van Kempen 2024｜Fast and accurate protein structure search with Foldseek.
date: 2026-10-08
tags: [课程, 结构生物学, 文献精读, 基础设施]
status: primary
类型: 精读笔记
来源: Michel van Kempen et al. *Nat Biotechnol* 2024，DOI [10.1038/s41587-023-01773-0](https://doi.org/10.1038/s41587-023-01773-0)
模块: 基础设施：预测结构成为公共数据
主键: 37156916
---

# Fast and accurate protein structure search with Foldseek.

**Michel van Kempen et al.** · *Nat Biotechnol* · 2024 · DOI [10.1038/s41587-023-01773-0](https://doi.org/10.1038/s41587-023-01773-0)

> 所属模块：[[notes/class-notes/结构生物学/AI结构预测/02-基础设施-预测结构成为公共数据|基础设施：预测结构成为公共数据]]
- 作者：Michel van Kempen, Stephanie S. Kim, Charlotte Tumescheit, Milot Mirdita, Jeongjae Lee, Cameron L. M. Gilchrist, Johannes Söding, Martin Steinegger
- 期刊：Nature Biotechnology，2024，42: 243–246
- DOI：10.1038/s41587-023-01773-0
- 摘要要点：Foldseek 把蛋白质内的三级氨基酸相互作用描述为「结构字母表」（structural alphabet）上的序列，再将结构比对转化为序列比对；计算时间降低 4–5 个数量级，灵敏度分别达到 Dali 的 86%、TM-align 的 88%、CE 的 133%。

## 一句话结论

Foldseek 把蛋白质结构编码成 20 态「3Di」结构字母表序列，从而把结构检索降维为成熟的序列搜索（MMseqs2 框架），在灵敏度接近甚至部分超过传统结构比对工具（Dali、TM-align、CE）的同时，把搜索提速 4–5 个数量级，使在数亿规模的预测结构库（AlphaFoldDB、ESM Atlas）上做检索成为可能。

## 研究问题

结构预测（AlphaFold2、ESMFold）正在批量生产结构数据：欧洲生物信息学研究所（EBI）已持有超过 2.14 亿个 AlphaFold2 预测结构，ESM Atlas 含有超过 6.17 亿个 ESMFold 宏基因组预测结构。但传统结构比对工具太慢：用 TM-align 在 1 亿个结构的库中检索单个 query 在单核上要花一个月，全对全（all-versus-all）比对在 1000 核集群上要 1 万年；而序列搜索快 4–5 个数量级（MMseqs2 对 1 亿条序列做全对全只需约一周，同一集群）。结构比对慢的原因有两点：一是缺少类似序列搜索的高灵敏度预筛（prefilter），二是结构相似性分数是非局部的（局部对齐的改变影响全局分数），主流工具（TM-align、Dali、CE）靠迭代或随机优化求解。论文要解决的问题就是：如何让结构搜索达到序列搜索的速度，同时不损失太多灵敏度。

## 方法与数据

核心思路是把「主链骨架」换成「三级相互作用」来编码结构：

1. **3Di（3D interaction）字母表**：对每个残基 i，用其与空间最近邻残基 j 的几何构象描述三级接触，离散化为 20 个状态。相比传统的骨架结构字母表（如 CLE、3D-BLAST、Protein Blocks，通常离散化 3–5 个 Cα 原子的短片段），3Di 有三个优势：字母间依赖性弱、状态频率分布更均匀（两者都提高信息密度、降低假阳性）、信息密度最高的地方在保守核心而最低在非保守 loop 区（骨架字母表正相反）。
2. **3Di 字母表的学习**：用改良的 VQ-VAE（vector quantized variational autoencoder，向量量化变分自编码器）把 10 维描述子离散为 20 个状态，目标是学出「进化上最保守」的状态。10 维描述子来自残基 i、j 两侧各三个 Cα 原子构成的两段骨架片段：7 个方向向量夹角的余弦、欧氏 Cα 距离、2 个序列距离特征 sign(i−j)·min(|i−j|,4) 与 sign(i−j)·log(|i−j|+1)。近邻由「虚拟中心」（virtual center）选择：位置由 θ（V–Cα–Cβ 夹角）、τ（V–Cα–Cβ–N 二面角）、l（|V−Cα| 长度）定义，网格搜索后取 θ=270°、τ=0°、l=2（即 3.06 Å）；它优先选长程三级接触，仅当附近无其他残基时才退回到 i±1（此时只编码主链构象）。训练在 SCOPe40 上按 fold 80%/20% 划分，只保留 TM-align 比对 TM-score≥0.6 且残基对 Cα 距离≤5 Å 的对齐残基对；PyTorch 1.9.0、Adam、batch size 512、学习率 10⁻³、4 个 epoch；跑 100 个不同初值取验证集上（3Di AUC / TM-align AUC 在 family/superfamily/fold 三层的比值之和）最优者。用 Kerasify 把编码器集成进 Foldseek。
3. **搜索管线（Fig. 1a）**：(1) query 结构离散化为 3Di 序列，用预训练的 3Di 替换矩阵（BLOSUM 式，S(x,y)=2·log₂[p(x,y)/(p(x)p(y))]），借助 MMseqs2 的「双对角线 k-mer 预筛 + 无缺口比对预筛」在目标库 3Di 序列中找候选（k-mer 长度 k=6 或 7，随库大小动态设置；无缺口打分≥15 bits 才进入下一阶段，可选分类学过滤）；(2) 高分候选用 SIMD 加速的 Smith–Waterman 做局部比对（默认），3Di 与氨基酸替换分数权重分别为 2.1 与 1.4（两者权重与 gap 罚分比在约 1% 的比对——即 SCOPe40 随机 10% 域的全对全——上优化），或用 1.7 倍加速的 TM-align 实现做全局比对（Foldseek-TM 模式，--alignment-type 1）。
4. **假阳性抑制与打分**：对每个命中把反向 query 序列再比对一次并从正向前向分数中减去反向分数；在 40 残基窗口内做组成偏差校正；E 值用 Gumbel 极值分布估计，参数 μ、λ 由一个神经网络从 query 氨基酸组成与长度预测（22 个输入节点、两个 32 节点 ReLU 隐层、两个线性输出；在 AlphaFoldDB v1 随机 10 万个结构上训练，Adam 学习率 0.001；因实测 FP 数与 E 值在对数坐标下斜率 0.32 而非 1，E 值再取 0.32 次幂校正）；命中排序按「bit 分数 × 对齐 TM-score 与 LDDT 的几何平均」的结构 bit 分数；另在 SCOPe 上拟合 TP/FP 分数分布（双 gamma 混合模型，mixtools 包 gammamixEM）给出每个命中为同源的概率（如分数 51 时 TP 概率约 50%）。
5. **工程实现**：数据库模块（createdb）支持 PDB/mmCIF/Foldcomp（FCZ）格式，每条链单独入库，Cα-only 结构用 PULCHRA 重建主链，甘氨酸缺 Cβ 时按正四面体补；Cα 坐标无损压缩（前三个 4 字节浮点 + 后续 2 字节有符号整数差分，超界则回退全 4 字节）。LDDT 计算用 15 Å 网格空间哈希加速。依赖 SIMDe 库，可在 x86_64、arm64、ppc64le 架构及 Linux、macOS 上运行。
6. **基准数据**：SCOPe 2.01 按 40% 序列同一性聚类得 11,211 条非冗余单域结构（SCOPe40，平均长度 174 残基）；参考无关（reference-free）多域基准：AlphaFoldDB v1（365,198 个模型）用 BLAST（E<10⁻³）+ SPICi 聚类成 34,270 簇，取每簇最长蛋白为代表，随机选 100 个代表做 query；HOMSTRAD 基准：1,032 个家族首末成员两两比对（中位长度 182 残基）。对照工具：TM-align、Dali（DaliLite.v5）、CE（BioJava 5.4.0，maxGapSize -1）、CLE-SW、3D-BLAST、Geometricus（免比对）、MMseqs2（序列搜索）。速度测试机：AMD EPYC 7702P 64 核 CPU、1,024 GB 内存；多线程工具用 64 线程，无多线程工具把 query 集切 64 块并行。

## 关键图表解读

- **Fig. 1（正文提及，图像未获取；图注完整见于正文）**：Foldseek 工作流与 3Di 字母表学习。a：整体搜索管线——结构离散化为 3Di 序列→MMseqs2 的 k-mer/无缺口预筛→向量化 Smith–Waterman 局部比对（3Di+氨基酸分数），或改用 1.7 倍加速的 TM-align 全局比对；b：3Di 字母表学习——最近邻选择（虚拟中心，黄色）、从两段骨架片段提取 7 角度+1 距离+2 序列距离共 10 特征，用改造的 VQ-VAE 学习 20 个进化上保守的状态。
- **Fig. 2（正文提及，图像未获取；图注完整见于正文）**：六个面板的基准结果。a：SCOPe40 上同源检测灵敏度的累积分布（TP=同一超家族，FP=不同 fold，灵敏度=到第一个 FP 为止的 AUROC）；Foldseek 灵敏度低于 Dali 和 TM-align、高于 CE、远高于 3D-BLAST 和 CLE-SW。b：SCOPe40 超家族层面的 precision–recall 曲线，Foldseek-TM 与 Foldseek 分别居第一、第三（三个层面均是）。c：三个层面（family/superfamily/fold）平均灵敏度对全对全总运行时间；SCOPe40 上 Foldseek 比 TM-align 和 Dali 快 4,000 倍以上、比 CE 快 21,000 倍以上。d：多域全长 AlphaFold2 模型上的检索灵敏度（每残基覆盖率分布）；Foldseek 与 Dali、CE、TM-align 灵敏度相当，远高于 CLE-SW 和 MMseqs2。e：比对质量（上：AlphaFoldDB 模型、每 query 前五命中的灵敏度/精度；下：HOMSTRAD 参考比对基准）；Foldseek 比对比 MMseqs2、CLE-SW、TM-align 更准更全，与 Dali 相当，比 CE 精度低 13% 但灵敏度高 15%；HOMSTRAD 上略低于 CE、Dali、TM-align。f：HOMSTRAD 各家族 Foldseek 与 Dali 比对质量对比（F1 分数）。
- 补充材料：Supplementary Tables 1–4（3Di 状态频率与假阳性、替换矩阵、多段结构假阳性示例、RdRp top 10 命中）、Supplementary Figs. 1–14（虚拟中心、VQ-VAE 训练、ROC/PR 分层面、二级结构类别表现、LDDT 阈值选择、E 值校正、TM-align 加速等，正文提及，图像未获取）。

## 主要结果与关键数字

- **核心速度**：SCOPe40 全对全（11,211 个结构）Foldseek 比 TM-align 和 Dali 快 4,000 倍以上、比 CE 快 21,000 倍以上（Fig. 2c）；在接近全速的 AlphaFoldDB（v1）上比 Dali 快约 184,600 倍、比 TM-align 快约 23,000 倍。
- **实例**：以 SARS-CoV-2 RdRp（PDB: 6M71 链 A，942 残基）搜索 AlphaFoldDB v1：Dali 需 10 天，TM-align 需 33 小时，Foldseek 只需 6 秒（论文称快 180,000 倍与 23,000 倍）；top 10 命中全部是已知 RdRp 同源物。
- **灵敏度（摘要口径）**：达到 Dali 的 86%、TM-align 的 88%、CE 的 133%。
- **SCOPe40 单域基准**：灵敏度低于 Dali 与 TM-align、高于 CE、远高于结构字母表工具 3D-BLAST 和 CLE-SW；precision–recall 上 Foldseek-TM 第一、Foldseek 第三（三个层面一致）；Foldseek-TM 比原版 TM-align 更好，因为预筛抑制了高分假阳性。按 query 与 target 长度归一化的平均 TM-score 排序时基准表现最佳。六个二级结构类别上表现一致。
- **多域参考无关基准（AlphaFoldDB v1，100 个随机 query）**：检索灵敏度与 Dali、CE、TM-align 相当，远高于 CLE-SW 与 MMseqs2；比对质量（前五命中）优于 MMseqs2、CLE-SW、TM-align，与 Dali 相当，比 CE 精度低 13% 但灵敏度高 15%。HOMSTRAD 参考基准上 Foldseek 略低于 CE、Dali、TM-align。
- **假阳性剖析**：对 AlphaFoldDB v1 中未碎片化且平均 pLDDT≥80 的模型做全对全自检索，人工检查 133,813 个高分假阳性中的 1,675 个（每对齐列分数≥1.0 且 TM-score<0.5），发现是「多个结构域折叠正确但相对取向错误」的模型——折叠片段本身被 Foldseek 正确对齐；说明 Foldseek（与 2D 比对器 Dali 一样）不依赖域间相对取向，擅长发现不可全局叠加的同源多域结构，而 3D 比对器（如 TM-align）可能漏检。
- **产品化**：webserver（https://search.foldseek.com）支持多库检索：AlphaFoldDB v4（Proteomes、Swiss-Prot）、AlphaFoldDB v4+CATH 50% 聚类、ESM Atlas-HQ、PDB；提供预建可下载数据库：AlphaFoldDB v4 UniProt（2.14 亿结构）、UniProt50（50% 序列同一性+90% 双向覆盖聚类，5,400 万结构）、Proteome（56.4 万）、Swiss-Prot（54.2 万）、PDB 100% 聚类（托管于 Cloudflare R2）。webserver 用 vmtouch 把库常驻内存（如 UniProt50 需 191 GB、ESM Atlas High-Quality Clu30 需 110 GB、PDB100 需 2.0 GB、CATH50 1.4 GB、Proteome 3.8 GB、Swiss-Prot 3.4 GB）；浏览器内用 WebAssembly 跑 PULCHRA 与 TM-align（pulchra-wasm、tmalign-wasm）；支持对 ≤400 残基的用户序列调用 ESM Atlas API 先预测结构再搜索。
- **结论论断**：结构分析将很快在很大程度上取代序列分析，而「结构比对慢 4 个数量级」这一主要限制已被 Foldseek 移除。

## 对照与消融

论文未设单独的消融实验章节，但包含多处对照性设计：

- **字母表类型对照**：3Di（三级相互作用）对传统骨架字母表（CLE、3D-BLAST、Protein Blocks）——3Di 的三个优势（字母间依赖弱、频率均匀、保守核心信息密度高）对应更低的假阳性与更高灵敏度；Fig. 2a 显示 Foldseek 灵敏度远高于 3D-BLAST 与 CLE-SW。
- **工具横向对照**：与六种结构比对工具（TM-align、Dali、CE、CLE-SW、3D-BLAST）、一种免比对工具（Geometricus）和序列搜索工具（MMseqs2）在 SCOPe40、AlphaFoldDB 多域、HOMSTRAD 三个基准上全面对比。
- **模式对照**：Foldseek 默认 3Di/AA 局部比对 vs Foldseek-TM（预筛后接 TM-align 全局比对）——Foldseek-TM 精度-召回最高，说明「预筛抑制高分假阳性」的贡献。
- **组件设计**：E 值网络在含无序/建模不良区域的 10 万个 AlphaFoldDB 结构上训练，并实测发现 FP 数与 E 值对数斜率 0.32 而做幂次校正（对 MMseqs2、3D-BLAST 的 E 值也做了同类检验）；虚拟中心在 θ、τ、l 网格上搜索优化；Smith–Waterman 的 AA/3Di 权重 1.4/2.1 与 gap 罚分在约 1% 比对数据上优化；字母表大小 A=20 是「信息量 vs k-mer 预筛代价（随 A^k 增长）」的折中；3Di 字母表做四折交叉验证（按 fold 分组），未见对 492 个参数（282 神经网络参数+210 替换矩阵项）的过拟合。
- **排序指标选择**：对 TM-align 报告的两个 TM-score（query/target 归一化）测试了最小/最大/平均等排序方式，发现平均 TM-score 在单域基准上最佳。

## 作者自述的局限

「Limitations of benchmarks」小节列出三点：(1) SCOPe 基准只用单域蛋白做 query 与 target，无法评估工具发现局部相似性的能力（例如两个多域蛋白共享同一个同源域的情形）；(2) HOMSTRAD 比对基准有同样局限——绝大多数蛋白是单域（中位长度 182 残基）；(3) 参考无关多域基准的一个缺点是必须人为设定 TP/FP 的 LDDT 阈值（TP≥0.6、FP<0.25，其余区间忽略）。此外正文透露出的事实性边界包括：单域基准上灵敏度仍低于 Dali 与 TM-align；HOMSTRAD 参考比对质量略低于 CE、Dali、TM-align。

## 我的评价

- 论文的贡献不在新算法原理，而在「编码方式的切换 + 工程化」：把结构比对还原为序列比对，就能直接继承 MMseqs2 积累多年的预筛、SIMD 向量化、并行与数据库工程。这是范式层面的简化，解释力强，落地快。
- 一个值得注意的设计哲学：3Di 字母表是「为进化保守性定制」的（VQ-VAE 训练目标改为预测对齐残基的描述子分布），说明作者把「结构搜索服务于同源推断」放在了首位，而把纯几何重建精度（如 HOMSTRAD 上的小劣势、相对 CE 低 13% 精度）作为可接受的代价。这种取舍在文中是自洽的，但读者应意识到：若下游任务是精细结构叠加（如建模用途），Foldseek 输出仍需 TM-align 复核（论文也提供了 Foldseek-TM 模式）。
- 数字一致性疑问（仅基于论文自身数字）：实例部分称「10 d vs 6 s 为 180,000 倍、33 h vs 6 s 为 23,000 倍」，但按秒换算 10 天/6 秒≈144,000 倍、33 小时/6 秒≈19,800 倍，与正文声称的倍数不完全吻合；Fig. 2c 与摘要的倍数体系（4,000×、21,000×、184,600×、23,000×）来自不同数据集与测法，引用时需注意口径。另，摘要中「133% of the sensitivities of CE」意味着 Foldseek 灵敏度超过 CE 本身，而正文 Fig. 2a 描述 Foldseek 灵敏度「higher than CE」、比对精度比 CE 低 13%，两者口径（检索灵敏度 vs 比对精度）不同，不矛盾但容易误读。
- 对我作为课程读者的意义：这是一篇把「结构生物学数据基础设施」问题讲得最清楚的论文——它直接回答了「AFDB 2 亿模型怎么用」：先靠 Foldseek 快速找到相似结构，再按需用慢而准的工具复核。与 AlphaFold2 论文形成上下游关系，也解释了本项目 M2 模块「基础设施」的定位。

## 可复现要点

- 代码与数据：Foldseek 开源（https://foldseek.com/，commit aeb5e）；webserver https://search.foldseek.com；SCOPe40 结构集可从 https://wwwuser.gwdg.de/~compbiol/foldseek/scop40pdb.tar.gz 下载；多域基准前五比对列表、HOMSTRAD 全部比对（homstrad_alignments.txt）均在该站点公开。
- 关键运行参数：Foldseek --threads 64 -s 9.5 -e 10 --max-seqs 2000；Foldseek-TM：先 --threads 64 -s 9.5 -e 10 --max-seqs 4000 --alignment-mode 1，再 tmalign --tmalign-fast 1 --tmscore-threshold 0.0 -a；MMseqs2 --threads 64 -s 7.5 -e 10000 --max-seqs 2000；TM-align 默认参数+-fast，取 query 与 target 归一化 TM-score 平均值排序；Dali DaliLite.v5 按 z-score 排序（SCOPe40 中 11,211 结构有 11,137 转成 DAT 格式有效，SPICi 34,270 簇中 34,252 有效）；CE 用 BioJava 5.4.0 改造版、maxGapSize -1、按 z-score 排序（多域基准排除一个跑了 16 天以上的 query）；CLE-SW 用 SSW，gap open 100、extend 10、CLE 矩阵；3D-BLAST 用 blastp + 3DBLAST 矩阵（-v/-b 12000、-e 1000、-F F、-G 8、-E 2）；Geometricus 经 Caretta-shape 计算 Bray–Curtis 相似度、单核运行。
- 基准定义：TP/FP——SCOPe 上同 family/superfamily/fold 为 TP，不同 fold 为 FP，灵敏度=到第一个 FP（ROC1）为止的 TP 比例，只统计至少有一个同层成员的成员；多域基准 TP 为比对 LDDT≥0.6、FP<0.25（中间分数忽略），LDDT 分母改为 15 Å 邻域总残基数（修正非致密模型）；E 值检验中排除 b.66–b.70 β-螺旋桨与 c.2–c.5/c.27/c.28/c.30/c.31 Rossmann-like fold 间的跨 fold 命中。
- 算法细节：3Di 为 20 态；VQ-VAE 编码器 242 参数、质心 40、解码器 352，commitment loss 0.25；虚拟中心 θ=270°、τ=0°、l=2；E 值网络 22→32→32→2、Adam lr 0.001、E 值幂次校正 0.32；LDDT 打分 s=0.25×[(d<0.5)+(d<1)+(d<2)+(d<4)]，15 Å 半径；预筛 k-mer k=6/7、无缺口打分阈值 15 bits；反向序列分数相减；40 残基窗口组成偏差校正。

## 术语

- 3Di（3D interaction alphabet）：三级相互作用字母表，20 态，编码残基与其空间最近邻的几何构象
- VQ-VAE（vector quantized variational autoencoder）：向量量化变分自编码器，用于学习离散 3Di 状态
- structural alphabet：结构字母表，把结构离散化为字母序列表示
- prefilter：预筛，快速筛除不可能命中的候选
- k-mer：长度为 k 的短片段（词）
- Smith–Waterman：局部序列比对算法（SW）
- SIMD（single instruction, multiple data）：单指令多数据流向量化
- TM-score：模板建模分数，结构叠加相似度度量（取值 0–1）
- LDDT（local distance difference test）：局部距离差异检验，AlphaFold2 采用的局部结构一致性分数
- pLDDT（predicted LDDT）：AlphaFold2 的每残基预测置信度
- ROC1：到第一个假阳性为止的灵敏度（AUROC up to first FP）
- AUROC / AUPRC：受试者工作特征曲线下面积 / 精确率-召回率曲线下面积
- E value：期望值，随机匹配命中的期望数目
- Gumbel distribution：极值分布，用于比对分数显著性
- SCOPe（Structural Classification of Proteins — extended）：人工分类的单域蛋白结构数据库
- HOMSTRAD：人工校验的同源结构比对数据库
- SPICi：基于序列的快速聚类算法
- PULCHRA：由 Cα 坐标重建全原子主链的工具
- Foldcomp（FCZ）：结构坐标有损压缩格式
- mmCIF（macromolecular Crystallographic Information File）：大分子晶体学信息文件
- Foldseek-TM：Foldseek 预筛后接 TM-align 全局比对的模式
- Geometricus：基于形状矩不变量的免比对结构比较工具
- CLE、3D-BLAST、Protein Blocks：三种传统骨架结构字母表方法
- compositional bias correction：组成偏差校正
- virtual center：虚拟中心，用于最近邻选择的抽象位点
- WebAssembly：浏览器端运行原生代码的字节码格式

---

**导航**

- 模块笔记：[[notes/class-notes/结构生物学/AI结构预测/精读/_index|精读总索引]]
- 上一篇：[[notes/class-notes/结构生物学/AI结构预测/精读/01 Mihaly Varadi 2022]]

## 实验一： NCBI 浏览与序列文件解读



实验掌握情况: 基本没有太大问题

## 前情提要：
经过前期的生物信息学理论课的学习，我们掌握了一部分数据库的使用方法和介绍，这节课程展开实践

## 实验目的：

1. 了解 NCBI 上提供的数据库资源

2. 熟悉 GenBank 序列文件

3. 掌握 PubMed搜索文献的方法

## 实验任务一 ： 确定要研究的生物分子

实验材料：Zm00001eb318740


实验方法：

打开[NCBI Gene](https://www.ncbi.nlm.nih.gov/gene) 输入基因ID: Zm00001eb318740

实验结果：玉米Bzip家族，[登录号：XM_008654730.4](https://www.ncbi.nlm.nih.gov/gene/?term=Zm00001eb318740)
核心功能

• 调控玉米胚乳中的醇溶蛋白（Zein）合成：该基因主要在玉米胚乳中发挥转录调控作用。它能够特异性地结合并激活 27-kD γ-zein（γ-醇溶蛋白）基因的转录。

• 调控籽粒品质：利用 CRISPR/Cas9 技术敲除该基因后，玉米籽粒中的 27-kD γ-醇溶蛋白转录水平会降低至约 70%。由于醇溶蛋白在玉米籽粒中缺乏人体必需的赖氨酸和色氨酸，通过降低此类蛋白的含量，可在一定程度上改善玉米籽粒的蛋白质营养质量。

## 实验任务二 ： 浏览NCBI网站，了解可用的数据库资源

实验材料：https://www.ncbi.nlm.nih.gov 

实验方法：
打开[NCBI HOME][https://www.ncbi.nlm.nih.gov] ，选择不同的数据库进行体验整理总结

实验结果：
1. **Gene（基因）**：[NCBI Gene](https://www.ncbi.nlm.nih.gov/gene/)
   提供不同物种基因的名称、基因组位置、功能注释和相关文献等信息，也能链接到序列、变异和蛋白质结构域记录。适合从基因名称或编号出发，查找该基因的基本资料及相关研究。
    ![alt text](image-5.png)
2. **Genome（基因组）**：[NCBI Genome](https://www.ncbi.nlm.nih.gov/datasets/genome/)
   汇集基因组序列、组装版本和注释等信息，可按物种查找可用的基因组数据，并查看基因在基因组中的位置。比较不同组装或下载特定物种的基因组文件时，可以从这里开始。
    ![alt text](image-6.png)
3. **Taxonomy（分类）**：[NCBI Taxonomy](https://www.ncbi.nlm.nih.gov/taxonomy)
   按分类层级整理生物名称，并将分类单元与 NCBI 的序列及其他资源连接起来。查找物种名称、分类位置或对应的 TaxID 时很有用；遇到分类学争议，还应结合专业文献核对。
    ![alt text](image-9.png)
4. **SRA（序列读取档案）**：[NCBI SRA](https://www.ncbi.nlm.nih.gov/sra)
   保存高通量测序产生的原始 reads，以及实验、样本和测序平台等信息。研究者可以按项目或样本寻找公开数据，下载后重新分析，用于复核研究结果或开展新的分析。 
    ![alt text](image-8.png)
5. **CDD（保守结构域数据库）**：[NCBI CDD](https://www.ncbi.nlm.nih.gov/Structure/cdd/)
   收录蛋白质保守结构域和蛋白家族模型，可用来识别一条蛋白序列中可能存在的结构域及其位置。这些匹配结果能帮助推测蛋白的组成和潜在功能，但仍需结合其他证据判断。
    ![alt text](image-10.png)
6. **PubMed（生物医学文献）**：[PubMed](https://pubmed.ncbi.nlm.nih.gov/)
   提供生物医学和生命科学文献的题录与摘要，可按主题、作者或期刊等条件检索。记录有时会链接到 PubMed Central 或出版商的全文页面，但 PubMed 本身主要用于查找文献，并不保证每篇文章都能免费获取全文。
    ![alt text](image-11.png)
7. **GEO（基因表达综合数据库）**：[NCBI GEO](https://www.ncbi.nlm.nih.gov/geo/)
   收录基因表达和其他功能基因组学研究的数据与实验信息，包括芯片和高通量测序等数据。研究者可以查找相关样本和研究设计，获取公开数据用于比较分析或重新分析。
    ![alt text](image-12.png)
8. **ClinVar（临床变异）**：[NCBI ClinVar](https://www.ncbi.nlm.nih.gov/clinvar/)
   汇总人类基因组变异与疾病、癌症或药物反应相关的解释，并展示提交来源及支持证据。不同提交者的结论可能不一致，因此适合用来查阅和比较现有解释，不能单凭一条记录作出个人诊断。
    ![alt text](image-13.png)
## 实验任务三 ： 序列文件信息解读 
实验材料：https://www.ncbi.nlm.nih.gov ，XM_008654730.4
## 实验方法：
1. 访问 [NCBI Gene](https://www.ncbi.nlm.nih.gov/gene/) ，搜索[Gene ID：103633044](https://www.ncbi.nlm.nih.gov/gene/103633044)，获取该序列登录号
2. 访问 [NCBI IGV browser](https://www.ncbi.nlm.nih.gov/gdv/browser/gene/?id=103633044) ，查看该序列真实位置（参考 玉米V5标准基因组）
3. 访问 [NCBI Nucleotide],搜索[登录号：XM_008654730.4](https://www.ncbi.nlm.nih.gov/nuccore/XM_008654730.4)，获取剩余信息
4. 访问[NCBI NEW GENE](https://www.ncbi.nlm.nih.gov/datasets/gene/103633044/#gene-ontology)获取转录本信息
## 实验结果：
1. 该序列的登录号：XM_008654730.4。
2. 此记录中报告的核苷酸总数： 2,036 个核苷酸。
3. 该核苷酸序列在染色体上的确切位置：玉米 B73 第 7 号染色体，NC_050102.1: 146,668,308–146,671,817，位于负链。
4. 该序列更新的次数：使用玉米 Zm-B73-REFERENCE-NAM-5.0 参考基因组，更新3次版本，当前为.4版本
5. 编码蛋白序列的起始密码子在序列中的确切位置：mRNA 第 175–177 位，序列为 ATG
6. 编码蛋白序列的起始密码子在序列中的确切位置和序列：mRNA 第 1645–1647 位，序列为 TAA。
7. 该 mRNA 编码的氨基酸总数：490 个；蛋白质登录号为 XP_008652952.1。
8. CDS 区域的确切位置：mRNA 第 175–1647 位。对应染色体上的 CDS 分段为：
    complement(join(146,668,482..146,669,503, 146,669,588..146,669,720, 146,669,810..146,669,894, 146,671,196..146,671,428))
9. 该序列的外显子数量和内含子数量： 4 个外显子、3 个内含子。染色体上的外显子区间为：
    complement(join(146,668,308..146,669,503, 146,669,588..146,669,720, 146,669,810..146,669,894, 146,671,196..146,671,817))
10. 你的序列是否有其他转录变异体或者异构体？如果有，请提供其他也编码全长蛋白质的变异体的登录号和名称，这些转录本在那些方面有所不同：此基因ID没有其他转录本
11. 如果存在的话，该 mRNA 序列的潜在多聚A信号的位置和序列：mRNA 第 1902–1907 位有 AATAAA 基序。它是潜在的 polyA 信号序列
![alt text](image-18.png)![alt text](image-19.png)![alt text](image-20.png)![alt text](image-21.png)

## 实验任务四 ： 利用 PubMed 搜索文献 
实验材料：https://pubmed.ncbi.nlm.nih.gov/ XM_008654730.4（Zm00001eb318740）
## 实验方法：

1. 打开 [NCBI HOME](https://www.ncbi.nlm.nih.gov/) ,选择右侧导航栏的[PubMed](https://pubmed.ncbi.nlm.nih.gov/)进行文献检索，本实验报告以玉米ZmBzip进行检索

2. 进行初步检索，搜索框中输入[登录号： Zm00001eb318740]()，按照课程要求的模板进行搜索。


## 实验结果：
1: Wei X, Long Y, Yi C, Pu A, Hou Q, Liu C, Jiang Y, Wu S, Wan X. Bibliometric
Analysis of Functional Crops and Nutritional Quality: Identification of Gene
Resources to Improve Crop Nutritional Quality through Gene Editing Technology.
Nutrients. 2023 Jan 11;15(2):373. doi: 10.3390/nu15020373. PMID: 36678244;
PMCID: PMC9865409.


## 讨论

感想：PSI-Blast是在普通 BLAST 的基础上发展起来的新程序，是将双序列比对和多序列比对结合在一起的数据库搜索方法，可通过多次迭代搜索出蛋白质家族或超家族中序列相似度较低的成员，弥补了普通 BLAST 难以找到进化距离较远的同源序列的不足。PSI-Blast 程序的主要思想是通过多次迭代找出最佳结果。第一次 blast搜索后，选择结果中最相似的一些序列进行多序列比对，构建位点特异性打分矩阵(PSSM)，然后再使用该矩阵进行第二轮 blast搜索，再选择相似度高的序列进行多序列比对，调整矩阵，搜索，如此迭代，直到找出最佳搜索结果。最终高度保守的区域就会得到比较高的分值，而不保守的区域则分数降低。这样可以提高 blast搜索的灵敏度，从而有利于发现进化距离较为遥远的同源序列。根据 PSI-Blast 的原理可以知道，每次迭代新搜索出的序列都与原来的序列是同源的。

[NCBI]: https://www.ncbi.nlm

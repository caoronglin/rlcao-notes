---
title: "BLAST 数据库搜索与参数选择：本地 BLAST+ 建库、算法对比与灵敏度权衡"
date: 2026-11-06
tags: [生信, bio/pipeline]
status: ongoing
notebook: bio
---

# BLAST 数据库搜索与参数选择：本地 BLAST+ 建库、算法对比与灵敏度权衡

> 2026-11-06 说明：本文的示例数字仍来自 EGF 版；课程实验已改用 `ZmFIE1`（核酸库 652,197 条、蛋白库 576,022 条），最新结果见 [[notes/生信实验/03/生物信息学实验报告_3_曹荣麟-2024014209|实验三报告]]与 [[vault/实验记录/2026-11-06-120000-生信实验三 BLAST数据库搜索|实验三记录]]。

> 整理范围：库内 [[notes/生信实验/03/生物信息学实验报告_3_曹荣麟-2024014209|生信实验三]] 实操沉淀。
> 适用场景：拿到一条 query（mRNA / 蛋白 / 短片段）要在**可控、可复现**的库里搜同源序列，并需要判断"这次到底改对了参数没有"。
> 上游流程见 [[vault/方法/生信分析/04_序列检索与双序列比对|序列检索与双序列比对]]、[[vault/方法/生信分析/05_基因记录与序列文件解读|基因记录与序列文件解读]]。

---

## 目标

1. 不依赖网页版 BLAST 也能拿到可复现的搜索结果（本地 BLAST+ + 自建库）。
2. 分清**算法（任务）**、**参数**、**阈值**三者各自改变的是什么，避免"改了没用"或"改错方向"。
3. 对短 query、迭代型搜索（PSI-BLAST / DELTA-BLAST）的失效模式有预判，不盲目相信命中条数。

## 输入数据

| 项 | 本次取值 | 说明 |
|---|---|---|
| Query 主序列 | `NM_001963.6`（6388 nt）/ `NP_001954.2`（1207 aa） | 人 EGF，UniProt `P01133` |
| Query 片段 | `NP_001954.2` 966–992（27 aa） | 成熟 EGF 域，用于测短 query 极限 |
| 核酸库 | 11 物种 Ensembl release-115 cDNA + RefSeq EGF 家族 mRNA | **890,742 条** |
| 蛋白库 | Swiss-Prot + Ensembl cDNA 翻译 | **581,499 条** |
| CDD 库 | `cdd_delta` | DELTA-BLAST 必需，不随 BLAST+ 发行版提供 |

## 步骤

### 1. 本地 BLAST+：解包即用，不用编译

Debian 的 `ncbi-blast+` 包自带动态库，直接解压到工作目录即可，无需 root：

```bash
# 下载 Debian 包后解压（版本 2.16.0）
dpkg-deb -x ncbi-blast+_2.16.0+*.deb tools/deb/
export LD_LIBRARY_PATH="$PWD/tools/deb/usr/lib/ncbi-blast+:$PWD/tools/deb/usr/lib/x86_64-linux-gnu"
tools/deb/usr/bin/blastn -version
```

⚠️ **必须设 `LD_LIBRARY_PATH`**，否则 `error while loading shared libraries: libncbi-blast.so...`。

### 2. 建库：物种标签要写进序列头

```bash
# 每条序列前加物种前缀，便于统计命中物种数
gunzip -c xxx.cdna.fa.gz | sed 's/^>/>homo_sapiens|/' >> combined.fa
makeblastdb -in combined.fa -dbtype nucl -parse_seqids -out combined
```

`-parse_seqids` 是后面用 `blastdbcmd` 抽序列的前提；库建完删掉中间 FASTA，只留 `.n*`/`.p*` 索引。

**`-max_target_seqs` 必须显式放大。** 默认值各任务不同（blastn 500、blastp 500、tblastx 500……），只影响"保留几条命中"，不影响"找到几条"，但会让报告的命中数被截断。本次统一 `-max_target_seqs 1000000`。

### 3. 读默认参数，别背

```bash
blastn -task blastn -query q.fa -db nt -outfmt 0 -max_target_seqs 5   # 完整报告头部
```

BLAST+ 2.16 实测默认值：

| 参数 | blastn | dc-megablast | megablast | blastp | blastp-short |
|---|---|---|---|---|---|
| word size | 11 | 11 | 28 | 3 | 2 |
| 打分 | reward 2 / penalty −3 | 2 / −3 | 1 / −2 | BLOSUM62 | PAM30 |
| gap open / extend | 5 / 2 | 5 / 2 | 0 / 2.5 | 11 / 1 | 9 / 1 |
| 邻词阈值 / 多命中窗口 | 11 / 40 | 11 / 40 | 11 / 40 | 11 / 40 | 16 / 15 |
| E-value | 10 | 10 | 10 | 10 | 10 |

用**显式指定默认值再跑一遍**交叉验证（`-word_size 11 -evalue 10` 应与默认逐条相同），确认报告里写的默认值就是程序实际用的值。

### 4. 一次只改一个变量

| 组 | 变量 | 取值 |
|---|---|---|
| 算法 | task | blastn / dc-megablast / megablast |
| 词长 | word_size | 7 / 11 / 15 |
| 阈值 | evalue | 1e-50 / 1e-5 / 10 / 1000 |
| 蛋白矩阵 | matrix | BLOSUM45 / 62 / 90 |
| 短 query | task | blastp vs blastp-short |
| 迭代 | — | PSI-BLAST 12 轮；DELTA-BLAST |

每次记录：**命中序列数（去重）、HSP 数、物种数、E<0.005 条数、最高 bitscore、耗时、前 10 条构成**。缺任何一项都无法解释结果。

### 5. PSI-BLAST 逐轮怎么取

BLAST+ 2.16 的 `psiblast` **不接受** `-save_psiblast_after_each_round`，`-num_iterations 1` 也不写出 PSSM 检查点。可行做法：**从第 1 轮重跑到第 N 轮**，取第 N 轮的输出作为该轮结果（前 N−1 轮必须完全一致才能保证可比）。

```bash
for i in $(seq 1 12); do
  psiblast -query q.fa -db db/protein/combined -num_iterations "$i" \
    -out_ascii_pssm results/psi_p"$i".pssm -outfmt 6 ... -out results/psi_round"$i".tsv
done
```

## 关键参数

| 参数 | 作用 | 什么时候动它 |
|---|---|---|
| `-task` | 改变**算法假设**，不只是数值 | 预期同源距离变了才换 |
| `-word_size` | 种子长度 → 召回量/速度 | 远缘同源召回不足时**减小**；噪声太大时增大 |
| `-matrix` | 打分的"宽容度" | 远缘（PAM30/BLOSUM45）或近缘（BLOSUM90） |
| `-evalue` | 随机命中的期望数，**阈值** | 严格度，不是灵敏度刻度 |
| `-max_target_seqs` | 保留多少条命中 | 统计命中总数时必须放到 ≥ 库容量 |
| `-inclusion_ethresh` | PSI-BLAST 纳入 PSSM 的门槛 | 迭代漂移时收紧 |
| `-entrez_query` / `-taxids` | 限制物种范围 | 消除谱系特异性漂移 |

## 结果

blastn 三个任务是三种不同的算法假设，不只是参数差别（query 为人 EGF mRNA，库 890,742 条）：

| task | 命中序列 | 物种数 | 耗时 | E<0.005 |
|---|---|---|---|---|
| blastn | 60,632 | 764 | 31.2 s | 56,329 |
| dc-megablast | 29,064 | 765 | 18.6 s | 28,733 |
| megablast | 2,720 | 241 | 1.6 s | 2,720 |

- megablast 的 28 nt 长词要求连续 28 个碱基一致，跨物种保守区被 UTR 切碎 → 只召回 blastn 的 1/22。
- 前 10 条几乎不随算法变：blastn 与 dc-megablast 逐条相同，megablast 前 6 条也相同，从第 7 条起才分叉（人转录本变体 3 提前、黑猩猩 `XM_517395.8` 补到第 10 位）。差别在 bitscore（11,797 对 11,521）与召回总量。头部由"有多像"决定，长尾由"算法多敏感"决定。
- 另跑 `blastn -word_size 28` 与 megablast 命中集合**完全相同**（均 2,720 条）→ 差别来自词长，不是打分。
- word size 7 只多 7% 命中，耗时 6.5 倍（201.6 s）；15 少 25%。
- E 值是阈值，不是灵敏度刻度：收紧到 1e-50 只剩 1,536 条（灵长类为主），放宽到 1000 只多 14%。

**blastp 参数敏感性（query 1207 aa，命中 6,171 基线）**：BLOSUM45 +131、BLOSUM90 −125（但最高分 2,509→2,643）、E=1000 +663、word 2 −8、word 6 −1,019。**真正改变结果的是矩阵与 E 值，不是 word size。**

27 aa 短片段：`blastp-short`（PAM30 + word 2 + gap 9/1 + 阈值 16 + 窗口 15）命中 8,763 条，是默认 `blastp`（1,797）的 4.9 倍，但 E<0.005 反而少 44 条，最高 bitscore 略低（61.3 对 61.6），top1 完全相同。短 query 检索空间只有 27×库长，E 值最高只能到 ~1e-12。

PSI-BLAST 12 轮未收敛：新增从 830 条（第 2 轮）降到 27 条（第 12 轮），累计 7,999 条。第 3 轮起进来的全是蛇毒金属蛋白酶/ADAM 家族，identity 仅 11–19%、E≈1e-5，比对区却横跨 query 742–1017 位，是半胱氨酸骨架的组成偏好被 PSSM 放大的漂移信号。跑到 12 轮仍不归零，这本身就是结论。

DELTA-BLAST：17.5 s，7,146 条序列、15,865 个 HSP；一致性双峰，≥70% 仅 640 条，40–70% 1,715 条，40% 以下 4,791 条（67%）。最低档里 LRP1（小鼠 `Q91ZX7`）29.1% identity 但对齐 660 aa、E=2.6e-103，是 EGF 样重复的结构域级同源；既不是假阳性，也不算 EGF 直系同源。

翻译搜索：BLASTX 前 10 条 9/10 与 blastp 相同（慢一倍）；TBLASTX 在家族小库翻出 5,667 条而 BLASTN 只 754 条，同一批序列，核酸只认近亲，蛋白能认整个家族；TBLASTX 在人 cDNA 库产生 51.9 万个 HSP 才 44,068 条命中，代价最高。

## 踩坑记录

1. **DELTA-BLAST 报 `Database memory map file error`，真因是缺 CDD 库**。报错指向内存映射文件，第一反应会去查蛋白库是否损坏；实际是 CDD 位置特异性打分校验不到。先 `blastdbcmd -db <库> -info` 验证目标库，再考虑报错字面意思。
2. **`-max_target_seqs` 会静默截断命中数**：不设大时 blastn 默认 500，报告的"命中数"只是保留数。统计口径必须统一。
3. **PSI-BLAST 拿不到逐轮快照**：`-save_psiblast_after_each_round` 在 2.16 被拒；用"重跑到第 N 轮"绕开，但要保证前 N−1 轮参数逐字节相同。
4. **蛋白库用 Ensembl cDNA 翻译 ≠ RefSeq 蛋白**：`XP_` 条目会随注释版本漂移，做多序列比对前应换回 `NP_`。
5. **命中条数 ≠ 同源关系**：blastp-short 4.9 倍命中但 E<0.005 更少、top1 相同；PSI-BLAST 第 12 轮的 7,999 条不比第 1 轮的 6,171 条更同源。
6. 先翻译再比对，与蛋白搜索结论等价，代价是耗时翻倍；要用它是因为 query 是核酸（EST / contig / 无注释转录本）。
7. 一致性低不等于假阳性：LRP1 29% identity 而 E=2.6e-103，靠的是 660 aa 的长对齐。判据要看对齐长度与 E 值的组合，不是 identity 单指标。
8. **SciPy/pandas 版本坑**（同实验一）：`pivot_table` 在长表上返回列表值单元格，画矩阵图会报 `could not convert string to float`；改用 `pd.crosstab`。

## 参考资料

- [[notes/生信实验/03/生物信息学实验报告_3_曹荣麟-2024014209|生信实验三报告]]
- `notes/生信实验/03/`：`db/`（建库脚本 `scripts/combine_dbs.sh`）、`queries/`、`results/`（24 次搜索 + PSI-BLAST 12 轮）、`data/`（数据表）、`sequences/`（49 条保存序列 + manifest CSV）、`scripts/`（检索→统计→序列整理→作图全链）
- [[vault/实验记录/2026-11-06-120000-生信实验三 BLAST数据库搜索|实验记录：生信实验三]]
- [[vault/方法/生信分析/04_序列检索与双序列比对|序列检索与双序列比对]]
- [[vault/方法/生信分析/05_基因记录与序列文件解读|基因记录与序列文件解读]]
- BLAST+ 命令行手册：`blastn -help` / NCBI BLAST Help（<https://blast.ncbi.nlm.nih.gov/doc/blast-help/>）

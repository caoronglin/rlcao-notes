---
title: 第三章、输入数据与上游 GATK4 流程
collection:
  profile: wiki
  id: bsa-seq
active_menu: bsa-seq
tags: [GATK4, BWA, 数据格式, AD, 上游流程]
---

# 第三章、输入数据与上游 GATK4 流程

## 3.1 上游流程总览

PyBSASeq **不碰原始测序数据**，它只吃 GATK4 输出的变异注释表。论文 Methods 里给出的

完整上游链路如下：

```
SRA (SRR834927 / SRR834931)
   │  fasterq-dump        https://github.com/ncbi/sra-tools
   ▼
FASTQ
   │  fastp（默认参数：质控 + adapter 修剪 + 质量过滤 + per-read 修剪）
   ▼
Clean FASTQ
   │  BWA（比对到参考基因组，如 Nipponbare Release 41）
   ▼
BAM
   │  GATK4 Best Practices（MarkDuplicates → HaplotypeCaller → …）
   ▼
VCF（同时含两个混池的基因型）
   │  提取列：CHROM, POS, REF, ALT, fb.AD, fb.GQ, sb.AD, sb.GQ
   ▼
TSV / CSV  ──────────►  PyBSASeq.py
```

论文对这一步的说明很直白：

>The GATK4-generated .vcf file usually contains the information for two bulks,
>which are termed the first bulk (fb) and the second bulk (sb), respectively.
>Using the GATK4 tool, a .tsv file is generated using the relevant columns
>(CHROM, POS, REF, ALT, fb.AD, fb.GQ, sb.AD, sb.GQ) of this .vcf file.

实际操作中通常用 `gatk VariantsToTable` 或 `bcftools query` 把 VCF 拍平成表格。

## 3.2 文件格式

### 3.2.1 论文中的示例（Table 2）

| CHROM | POS | REF | ALT | 834927.AD | 834927.GQ | 834931.AD | 834931.GQ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 29,759 | C | G | 0,2 | 6 | 0,2 | 6 |
| 1 | 31,071 | A | G | 25,39 | 99 | 33,29 | 99 |
| 1 | 31,478 | C | T | 27,38 | 99 | 48,32 | 99 |
| 1 | 33,667 | A | G | 21,46 | 99 | 39,32 | 99 |
| 1 | 34,057 | C | T | 29,37 | 99 | 32,31 | 99 |

### 3.2.2 本仓库实际测试文件的列

水稻 parents.csv 表头：

```
CHROM,POS,REF,ALT,QUAL,2696318.GT,2696318.AD,2696318.GQ,2696319.GT,2696319.AD,2696319.GQ
```

水稻 bulks.csv 表头：

```
CHROM,POS,REF,ALT,QUAL,2696321.GT,2696321.AD,2696321.GQ,2696322.GT,2696322.AD,2696322.GQ
```

比论文表格多了 `QUAL` 和 `.GT` 两列 —— 因为后续版本的程序需要基因型（GT）来做过滤和

"亲本 vs 混池"一致性检查。

### 3.2.3 列命名规则（程序硬编码，必须遵守）

程序用**列名后缀**自动识别混池，源码 `bulk_names()`：

```python
for ftr_name in header:
    if ftr_name.endswith('.AD') or ftr_name.endswith('_AD'):
        bulks.append(ftr_name.split('.')[0])
```

- 池 ID = `.AD`（或 `_AD`）列名去掉后缀的部分，例如 `2696321.AD` → `2696321`
- 第一个被扫到的 AD 列是 **fb（第一池）**，第二个是 **sb（第二池）** —— 列顺序决定 fb/sb
- 于是程序自动拼出 `{id}.GT`、`{id}.GQ`、`{id}.AD` 等列名

### 3.2.4 必需字段

源码 `required_fields` 检查：

```
CHROM, POS, REF, ALT, fb.GT, sb.GT, fb.AD, fb.GQ, sb.AD, sb.GQ
```

缺任何一个都会打印缺哪个字段并 `sys.exit()`。

| 字段 | 说明 |
| --- | --- |
| `CHROM` | 染色体 ID。读到 DataFrame 时强制 `dtype={'CHROM': str}`；纯数字染色体按数值排序，字母 ID 排在后面按字典序 |
| `POS` | 变异在染色体上的位置 |
| `REF` / `ALT` | 参考碱基 / 替代碱基。ALT 可以含多个（逗号分隔），程序会特殊处理（见下） |
| `fb.GT` / `sb.GT` | 基因型，形如 `G/A`、`A|G`、`G/G`、`A/A` |
| `fb.AD` / `sb.AD` | 等位深度，形如 `"25,39"`（REF,ALT） |
| `fb.GQ` / `sb.GQ` | 基因型质量分，用于过滤（默认阈值 20） |

### 3.2.5 文件路径与格式约束

源码主流程：

```python
path = os.getcwd()
in_file = os.path.join(path, file)          # 相对路径按 CWD 解析；绝对路径原样使用
if   in_file.endswith('.tsv'): separator = '\t'
elif in_file.endswith('.csv'): separator = ','
else:
    print('The input file should be in either the csv or the tsv format ...')
    sys.exit()
```

- **扩展名必须是 `.tsv` 或 `.csv`**，不认识 `.txt`、`.xls`。
- README 说"脚本与输入文件应在同一目录"，实际上给**绝对路径**也可以
  （`os.path.join` 遇到绝对路径会直接采用后者）。
- 输出目录 `Results/` 会自动创建在**当前工作目录**下，而不是脚本所在目录。
  所以在 A 目录运行、脚本在 B 目录，结果落在 A。

## 3.3 两种运行模式：要不要亲本数据

`-i` 接受**逗号分隔**的文件名列表，长度决定走哪条分支（源码 `num_ipfiles = len(input_files)`）：

### 模式 A：`-i parents.csv,bulks.csv`（两文件，有亲本）

```python
if num_ipfiles == 2:
    # 第一个文件（parents）里筛出"双亲纯合且互为异等位"的 SV
    homo_svs = sv_df[((sv_df[fb_ad_ref]==0) & (sv_df[sb_ad_alt]==0)) |
                     ((sv_df[fb_ad_alt]==0) & (sv_df[sb_ad_ref]==0))]
```

流程：

1. 从亲本文件里挑出**亲本多态且双亲各自纯合**的位点（parent1 = REF/REF & parent2 = ALT/ALT，
   或反过来）。这些才是能区分两条亲本单倍型的有效标记。
2. 用 `ID = CHROM_POS` 与混池文件取交集，得到 `bulk_df`。
3. 把亲本基因型挂上去（`p_REF` / `p_ALT`），并做**方向校正**：
   若 parent1 的基因型与 REF 碱基不一致，就把混池的 AD 和 GT **互换**，让 "REF"
   始终代表 parent1 的等位基因；同时记录 `ad_Swap = ±1`。

```python
bulk_df[fb_ad] = np.where(bulk_df.p_REF==bulk_df.REF, bulk_df[fb_ad],
                          bulk_df[fb_ad_alt].astype(str) + ',' + bulk_df[fb_ad_ref].astype(str))
```

**有这个校正，Δ(AF) 的正负号才有生物学含义**：Δ > 0 表示第二个池里亲本 2 的等位基因富集。

### 模式 B：`-i bulks.csv`（单文件，只测混池）

适用于"手头只有混池数据"或"没有高质量亲本基因组组装"的场景，

对应第二篇论文（G3 2021）：

>Here, we modified the original script to effectively detect the genomic region–trait
>associations using only bulk genome sequences.

此时程序对全量 SV 直接用 **|Δ(AF)|（绝对值）**，因为不知道哪个方向对应哪个亲本：

```python
if num_ipfiles == 1 and parent1 != 'ref':
    df['Delta_AF'] = df['Delta_AF'].abs()
```

阈值也相应换成绝对值的分位点 `DAF_abs_Thrshld`，判显著时只与单侧阈值比较。

### 模式 C：`-i bulks.csv --parent ref`（单文件，但亲本基因组用作参考）

如果变异检测时是以**亲本基因组为参考**做的，那 REF 就等价于亲本等位基因，

有方向信息可用 —— 只要加上 `--parent ref`，程序就按模式 A 的口径处理（双侧 CI、带符号 Δ）：

```python
elif num_ipfiles == 2 or parent1 == 'ref':
    axs[3].plot(x, sg_y8, c=sv_threshold_color)   # DAF_CI_LB
    axs[3].plot(x, sg_y9, c=sv_threshold_color)   # DAF_CI_UB
```

>这也解释了论文中"用亲本的基因组序列作参考"这一设定的价值：不是为了比对精度，
>而是为了给 Δ(AF) **定向**。

## 3.4 输入数据的质量建议

| 建议 | 理由 |
| --- | --- |
| 两个混池的测序深度尽量接近 | 深度差异会同时抬高阈值和缩小 CI，降低灵敏度 |
| 保留 InDel 与多等位位点 | 程序会专门处理它们（2-ALT 位点可救回），不要提前砍掉 |
| 不要提前按 GQ/DP 过滤 | 程序内置 GQ≥20、LD≥3、LD≤mean+3σ 等过滤；提前过滤会让 `sv_filtering` 的中间产物统计失真 |
| 亲本文件只需"亲本纯合多态"的位点，但不必自己筛 | 程序会自动筛（`homo_svs`） |
| 染色体 ID 用纯数字最省事 | `-e/--region` 选项对非数字染色体 ID 支持有限（用 1000–1005 代表 X/Y/Z/W/U/V） |

→ 下一章：[第四章、核心算法：显著 SV 方法与阈值模拟](ch04-algorithm.md)

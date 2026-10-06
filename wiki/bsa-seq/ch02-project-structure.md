---
title: 第二章、项目结构与运行环境
collection:
  profile: wiki
  id: bsa-seq
active_menu: bsa-seq
tags: [PyBSASeq, 环境配置, conda, 依赖]
---

# 第二章、项目结构与运行环境

## 2.1 目录结构

```
/mnt/smb/t25ronglin/code/bsa-seq/
├── PyBSASeq.py              100,691 B   2,089 行   主程序（唯一脚本）
├── README.md                  8,487 B             使用说明 + 引用信息
├── LICENSE                   35,149 B             GNU GPL v3
├── docs/
│   └── refernces/                                  参考文献 PDF（目录名拼写如此）
│       ├── s12859-020-3435-8.pdf   2,005,575 B     BMC Bioinformatics 2020（PyBSASeq）
│       └── jkae035.pdf               791,927 B     G3 2024（k-mer BSA，见第十一章）
├── .gitignore                                      忽略 Results/、FilteredSVs/、Data/
└── Data/
    ├── Rice/                                       水稻测试数据（Yang 等）
    │   ├── parents.csv    22,499,171 B   428,126 行
    │   └── bulks.csv      21,650,755 B   409,212 行
    └── Maize/                                      玉米测试数据（Zheng et al. 2020）
        ├── parents.csv    32,984,810 B   626,966 行
        └── bulks.csv      35,234,505 B   626,966 行
```

>`docs/refernces/` 的目录名拼写是 `refernces`（缺一个 e），按原样记录。
>第三篇论文（G3 2021，无亲本基因组的 BSA-Seq）本仓库没有 PDF，
>需要通过 doi:10.1093/g3journal/jkab400 自行获取。

要点：

- **只有一个源文件**。整个工具是单文件脚本，没有包结构、没有 `setup.py`、没有测试目录。
- **不是 git 仓库**。该目录是从上游 `https://github.com/dblhlx/PyBSASeq` 拷贝/下载的
  工作副本（`git log` 报"不是 Git 仓库"），因此无法用 `git diff` 追溯本地改动。
- `.gitignore` 把 `Data/`、`Results/`、`FilteredSVs/` 都排除了，所以测试数据和运行结果
  都属本地文件，不进版本库。
- `PyBSASeq.py` 开头标 `version 3.1415`（π，作者的幽默），创建于 2018-10-05。
  当前文件对应的是**远新于 2020 年论文的版本**（多了 `--seg_step`、`--parent`、
  savgol 平滑、Durbin-Watson 等论文中未描述的功能），所以读代码不能完全照搬论文。

## 2.2 运行环境

### 2.2.1 硬性要求

| 项目 | 要求 |
| --- | --- |
| Python | 3.6 或更高（论文 Availability 段） |
| 操作系统 | 论文声明在 Linux 与 macOS 上测试通过 |
| 许可证 | 仓库 `LICENSE` 是 **GNU GPL v3**；论文里写的是 "MIT license"，两者不一致，以仓库文件为准 |

### 2.2.2 Python 依赖

| 库 | 用途 | 缺失后果 |
| --- | --- | --- |
| `numpy` | 全部数值计算、`np.random.binomial` 模拟 | 无法运行 |
| `pandas` | 读入 tsv/csv，全流程 DataFrame 操作 | 无法运行 |
| `matplotlib` | 输出 `PyBSASeq.pdf/eps/svg/png` | 无法绘图 |
| `scipy` | `ttest_rel`（配对 t 检验）、`savgol_filter`（曲线平滑）、`fisher_exact`（兜底） | `savgol_filter` 为必需 |
| `statsmodels` | `sm.OLS` + `durbin_watson`，用于推断 SV 独立性 | 无法运行 |
| **`fisher`** | `pvalue_npy`，向量化 Fisher 精确检验 | **可降级**：回落到 `scipy.stats.fisher_exact`，但慢很多 |

>README 第一句就是这个意思：*It is strongly recommended to have
>[fisher](https://github.com/brentp/fishers_exact_test) installed on your system.
>It is fast in dealing with large datasets.*

`fisher` 必需的原因是它支持一次传入四个 numpy 数组（向量化），

而 `scipy.stats.fisher_exact` 一次只能算一个 2×2 表，几十万 SV 会慢到不可接受。

### 2.2.3 本机环境配置

conda 安装在 `/media/rlcao/Data/software`（即 base 环境）。本机实测可用的完整安装命令：

```bash
source /media/rlcao/Data/software/etc/profile.d/conda.sh
conda activate base
pip install pandas matplotlib scipy statsmodels fisher
```

实测通过的版本组合：

```
Python       3.14.6
numpy        2.5.3
pandas       3.0.6
scipy        1.18.1
statsmodels  (最新)
fisher       已安装
```

>注意：`conda activate base` 后直接敲 `python` 在部分 shell 里仍会落到
>`/usr/bin/python`（系统 Python，只有 numpy）。执行前务必确认
>`which python` 指向 `/media/rlcao/Data/software/bin/python`。

## 2.3 ⚠️ 当前源码存在一处语法错误（必读）

本副本 `PyBSASeq.py` 第 17 行有一个多出来的斜杠：

```python
from scipy.signal import savgol_filter/     # ← 行尾多了一个 '/'
```

后果是**脚本完全无法执行**，`python -m py_compile PyBSASeq.py` 直接报错：

```
  File "PyBSASeq.py", line 17
    from scipy.signal import savgol_filter/
                                          ^
SyntaxError: invalid syntax
```

修复方式（删掉行尾的 `/`）：

```python
from scipy.signal import savgol_filter
```

这是明显的编辑事故而非故意设计。本笔记后续章节的所有实测结果，都是在这一行修好之后得到的。

（本次解读**未修改**原始文件，仅在 `/tmp` 的副本上验证。）

## 2.4 测试数据集

仓库自带两套可直接跑的 GATK4 输出：

| 数据集 | 群体 / 材料 | 混池列名 | 染色体 | 论文来源 |
| --- | --- | --- | --- | --- |
| `Data/Rice/` | 水稻 F3 群体，Nipponbare 为参考 | `2696318.*`、`2696319.*`（parents）；`2696321.*`、`2696322.*`（bulks） | 9、11 | Yang et al. 2013（NCBI SRA: SRR834927 / SRR834931） |
| `Data/Maize/` | 玉米 | `F1.*`、`S1.*` | 1、2 | Zheng et al. 2020, *G3* |

水稻数据的染色体分布（仅两条染色体有变异）：

```
chr     SV 数     最大坐标
 9     165,812    22,940,221
11     243,399    29,018,426
```

>注意 parents 与 bulks 两个文件的样本 ID **不同**（2696318/2696319 vs 2696321/2696322），
>程序靠 `CHROM_POS` 拼接两侧信息，这是正常的设计，见[第三章](ch03-input-data.md)。

## 2.5 冒烟测试（Smoke Test）

拿水稻 chr9 前 3 Mb 做一个 30 秒级别的最小验证：

```bash
# 1. 修复第 17 行的语法错误
sed -i '17s|savgol_filter/|savgol_filter|' PyBSASeq.py

# 2. 构造小数据（chr9, POS ≤ 3,000,000）
awk -F, 'NR==1 || ($1==9 && $2<=3000000)' Data/Rice/parents.csv > p_sub.csv
awk -F, 'NR==1 || ($1==9 && $2<=3000000)' Data/Rice/bulks.csv   > b_sub.csv

# 3. 跑流程（把重复次数降到 100 以加速；正式分析用默认 10000）
python PyBSASeq.py -i p_sub.csv,b_sub.csv -b 430,385 -p F2 -r 100 \
                   -s 1000000,10000 -o BSASeq.csv
```

在我本机的实际输出（节选）：

```
The chromosomes below are greater than 1510000 bp and are suitable for BSA-Seq analysis:
['9']

Perform SV filtering - p_sub.csv
Perform SV filtering - b_sub.csv
Perform Fisher's exact test on each SV.
Calculate the Δ(allele frequency) and G-statistic thresholds of each SV.
150                                      ← find_seg_size() 推断出的独立性距离
Estimate the genome-wide thresholds of the sSV/totalSV, G-statistic, and Δ(allele frequency).
Prepare SV data for plotting via the sliding window algorithm
Plotting completed, time elapsed: 0.0868 minutes.
Verify potential significant peaks/valleys.
```

产物：`Results/sv_fagz.csv`、`Results/sliding_windows.csv`、`Results/sv_region.csv`、

`Results/threshold.txt`，以及带时间戳目录 `Results/2026…/BSASeq.csv` + `PyBSASeq.{pdf,eps,svg,png}`。

→ 下一章：[第三章、输入数据与上游 GATK4 流程](ch03-input-data.md)

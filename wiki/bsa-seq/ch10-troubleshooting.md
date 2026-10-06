---
title: 第十章、排错、性能与已知问题
collection:
  profile: wiki
  id: bsa-seq
active_menu: bsa-seq
tags: [排错, 性能, 已知问题, bug, FAQ]
---

# 第十章、排错、性能与已知问题

## 10.1 已知问题清单

以下问题都是**在本机实测中确认过的**，不是猜测。

### ⚠️ #1 第 17 行语法错误，脚本完全无法运行（严重）

```python
from scipy.signal import savgol_filter/
```

```
SyntaxError: invalid syntax
```

**修复**：删掉行尾 `/`。这是最优先要处理的问题。

### ⚠️ #2 `-a True` / 复用模式会误删短染色体（严重，易被忽略）

`bsaseq_plot()` 和 `bsaseq_plot_sw()` 都用了硬编码的 `min_sv = 500`，

但**判断对象不同**：

| 函数 | 判断对象 | 实际要求 |
| --- | --- | --- |
| `bsaseq_plot()` | 染色体上的 **SV 条数** | ≥ 500 个 SV（容易满足） |
| `bsaseq_plot_sw()` | 染色体上的**滑窗条数** | ≥ 500 个滑窗 |

在默认滑窗设置（2 Mb / 10 kb）下，"≥500 个滑窗"等价于：

```
染色体长度 > 500 × 10,000 + 2,000,000 ≈ 7,000,000 bp
```

**实测复现**：对 chr9 的 1–3 Mb 区域跑成功后，再执行 `-a True` 重绘，得到

```
Plotting via the sliding window algorithm
Your dataset contains too few SVs. No analysis is performed
```

（该区域只有 200 个滑窗。）整个 chr9（22.9 Mb，2,094 个滑窗）则正常重绘。

**影响范围**：任何"短于 7 Mb 的染色体"或"用 `-e` 切出来的小块区域"，

在 `-a True` 或"复用已有结果"模式下都会**静默退出**，而第一次运行是成功的。

**规避**：需要重绘短区域时，把 `min_sv` 临时改小（源码 1769 行），

或者不带 `-a True` 重跑（会走 `bsaseq_plot()` 的正常路径）。

### ⚠️ #3 `-t` / `-a` 的 `type=bool` 陷阱

```python
bool('False')  → True      # 任何非空字符串都是 True
bool('')       → False
```

实测：

```
-a False  → adjust_gap=True      ← 想关掉反而打开了
-a 0      → adjust_gap=True
-t False  → smooth=True          ← 想关平滑根本没关
-t ''     → smooth=False         ← 只有这样才能关
```

**规避**：关闭平滑写 `-t ''`；关闭 `-a` 只能靠"不带这个参数"。

### ⚠️ #4 静默复用旧结果（非常容易踩）

只要 `Results/sv_fagz.csv`（或 `sv_fagz_di.csv`）存在，程序就**跳过全部过滤和统计**，

直接读取缓存。这意味着改动下面这些参数**完全不会生效**：

```
-b  -p  -v   --parent   -c（GQ 阈值部分）   --seg_step
```

同理 `Results/threshold.txt` 和 `Results/sliding_windows.csv` 被复用时，

`-s`（滑窗大小）的改动也不会生效。README 对此只有一句提醒：

>The `threshold.txt` file needs to be deleted if starting over is desired
>(e.g, if the size of the sliding window is changed).

**强制重算的标准操作**：

```bash
rm -rf Results
# 或者只删缓存，保留中间产物目录
rm -f Results/sv_fagz.csv Results/sv_fagz_di.csv \
      Results/threshold.txt Results/sliding_windows.csv Results/sv_region.csv
```

### ⚠️ #5 同一个滑窗在两处文件里的比值不同（不是 bug，但会困惑人）

| 文件 | 统计基础 | chr9 峰（POS 1,960,001）的 `sSV/totalSV` |
| --- | --- | --- |
| `sliding_windows.csv` / `sv_region.csv` | 全部过滤后 SV | **0.0715** |
| `BSASeq.csv` | `bulk_df_di`（DI==1 独立子集） | **0.0821** |

原因：`accurate_threshold_sw()` 是用 **`bulk_df_di`** 重算的（见源码 2077 行

`peak_verification(peaklst, bulk_df_di)`），而绘图用的是全量 `bulk_df`。

两个值都正确，但**不要跨文件比较**，也不要以为"程序算错了"。

### ⚠️ #6 默认值在论文 / README / 代码之间不一致

| 参数 | 论文正文 | README | 代码默认 |
| --- | --- | --- | --- |
| 模拟判定 sSV 的 p 值（`sm_alpha`） | **0.10** | 0.01 | **0.05** |
| 判定 sSV 的 p 值（`alpha`） | 0.01 | 0.01 | 0.01 |
| 重复次数 | 10,000 | — | 10,000 |
| 滑窗 | 2 Mb / 10 kb | 2 Mb / 10 kb | 2 Mb / 10 kb |

**复现论文结果请显式传参**：`-v 0.01,0.10`。

### ⚠️ #7 列名拼写不一致

README 写 `Significance_SSV`，代码实际输出 **`Significance_sSV`**（小写 s）。

如果你写了自动化脚本按 README 取列，会 `KeyError`。

### ⚠️ #8 许可证不一致

仓库 `LICENSE` 是 **GNU GPL v3**（674 行全文）；

论文 "Availability and requirements" 段写的是 **MIT license**。

以仓库文件为准。若用于商业闭源产品，需要先澄清这一点。

### #9 `-c` 的 Help 文本与实现不符

help 说有 4 个值（`…, extremely high read, and mirror index…`），

代码只解析 3 个（`gq_value, min_SVs, mirror_index`）。

"extremely high read" 的功能已经移到 `read_filter()` 的 `mean + 3σ` 判据中，

不再可调。传第 4 个值会被静默忽略。

### #10 BC 群体固定假设"回交到 REF 亲本"

`sm_allelefreq()` 里 BC 的 `prob = [0.5, 0.5, 0.0]` 恒给出 H0 频率 **0.25**。

若实验是回交到 ALT 亲本（H0 应为 0.75），需要先交换 REF/ALT，

或者用 `--parent ref` 让程序做方向校正。

### #11 非数字染色体 ID 的 `-e` 支持有限

README 明确说明：

>this option will not work if the chromosome IDs in the reference genome sequences
>are not digits, with the exception of sex chromosomes; we can use 1000 - 1005 to
>respectively represent sex chromosomes X, Y, Z, W, U, and V

即 `chr1`、`Chr01`、`scaffold_123` 这类 ID 无法用 `-e` 指定区域。

### #12 无法 Import

没有 `main()` 保护，任何 `import PyBSASeq` 都会执行整个流程。

二次开发只能复制函数。另外 `calculate_statistics()` 在 scipy 兜底路径里会往

**当前工作目录**写一个固定名 `output.csv`（`df.to_csv('output.csv', …)`），

多任务并行时可能互相覆盖。

### #13 `g_statistic_array` 的参数顺序具有误导性

签名是 `(o1, o3, o2, o4)`，调用写法却是 `(fb_ref, fb_alt, sb_ref, sb_alt)`。

由于 G 统计量在矩阵转置下不变，**数值结果正确**，但重构时极易改错。

## 10.2 报错信息 → 原因 → 处理

| 报错 / 提示 | 原因 | 处理 |
| --- | --- | --- |
| `SyntaxError: invalid syntax`（第 17 行） | 行尾多余的 `/` | 删掉它（见 #1） |
| `Either the module 'Fisher' … or 'fisher_exact' from 'scipy.stat' is needed` | `fisher` 与 `scipy.stats.fisher_exact` 都不可用 | `pip install fisher`（或降级 scipy） |
| `The following required field(s) is/are missing: […]` | 输入表缺 `CHROM/POS/REF/ALT/*.GT/*.AD/*.GQ` | 补齐列，注意 `.AD` 后缀必须存在 |
| `The input file should be in either the csv or the tsv format` | 扩展名不是 `.csv` / `.tsv` | 改名 |
| `No valid chromosomal names were entered.` | `-e` 里的染色体名不在数据里 | 检查 `CHROM` 的实际取值 |
| `The size of the interested region on chromosome X should be greater than {2510000} bp.` | 区域短于 `min_frag_size` | 放大区域或调小 `-s` |
| `Your dataset contains too few SVs. No analysis is performed` | 见 #2：滑窗数 < 500 | 去掉 `-a True`，或调小 `min_sv` |
| `You need to run the script without the --gap-adjust option …` | `-a True` 但 `threshold.txt` / `sliding_windows.csv` 不存在 | 先正常跑一次 |
| `The ID sets of bulk_df and ref_svs are not the same.` | 亲本与混池文件的位点集合对不上（`CHROM_POS`） | 检查两文件是否来自同一次变异检测/同一参考基因组 |
| `This sliding window does not contain any SV` | 候选峰滑窗内没有 SV（`ZeroDivisionError` 被捕获） | 通常无害；查看 `wrnLog.csv` |
| `KeyError: 'FE_P'` | 分组统计时列被 drop 后未整列重建（源码 1680 行有注释说明） | 已修复，若自行改动 `seg_statistics()` 需注意 |
| 图形无法显示中文 / 字体缺失 | 全局 `plt.rc('font', family='Arial')` | 装 Arial，或改 1710 行的字体设置 |

## 10.3 性能

### 10.3.1 时间构成

以本机（Python 3.14.6 / pandas 3.0.6 / scipy 1.18.1 / `fisher`，Intel x86_64）跑水稻

**chr9 全染色体**（169,701 → 59,049 个 SV）为例。

**`-r 10000`（默认参数）**：

| 阶段 | 累计耗时（分钟） | 本阶段耗时 | 占比 |
| --- | --- | --- | --- |
| SV 过滤（两个文件） | 0.056 | 0.056 | 2.5% |
| 向量化 Fisher（真实 + 模拟） | 0.095 | 0.039 | 1.7% |
| **逐位点阈值模拟 `sv_ci`** | **1.562** | **1.466** | **65.2%** |
| 全局阈值 + 逐位点阈值均值 | 1.984 | 0.422 | 18.8% |
| 滑窗 + 绘图 + 峰检测 | 2.121 | 0.137 | 6.1% |
| 峰验证（滑窗特异阈值） | 2.247 | 0.127 | 5.7% |
| **合计（wall clock）** | **2:17** | **2.25 min** | 100% |

**内存峰值：851 MB**（`Maximum resident set size`）。

**结论**：`sv_ci`（逐位点模拟）是绝对瓶颈，占总时间的 2/3。它是

`df.apply(sv_ci, axis=1)` 的**逐行 Python 循环**，耗时与 `SV 数 × rep` 成正比，

无法向量化（每个位点的深度不同）。

>同样这份数据用 `-r 100` 跑，内部累计 0.39 分钟（其中 `sv_ci` 占 0.16 分钟）——
>`rep` 放大 100 倍，总时间只放大 **5.8 倍**。原因是 `sv_ci` 内部的
>`np.random.binomial(…, rep)` 在小数组下调用开销占主导，并不严格线性。
>即便如此，**全基因组规模（60 万 SV）仍需数十分钟量级**；而按论文的 34,919 个滑窗
>逐个做滑窗特异模拟需要一个月。

### 10.3.2 三条加速路径

| 手段 | 效果 | 代价 |
| --- | --- | --- |
| **装 `fisher`** | 相对 scipy 逐行 `fisher_exact` 快数十倍以上，且启用向量化阈值模拟 | 需要编译环境（本机 `pip install fisher` 一次成功） |
| **复用已有结果** | `sv_fagz.csv` 存在时跳过过滤 + Fisher + 逐位点模拟；`-a True` 直接秒级重绘 | 参数改动不生效（见 #4） |
| **降低 `-r`** | 线性加速 | 阈值不稳定，只适合调试 |

### 10.3.3 内存

全流程主要开销在 `sv_fagz.csv` 的 DataFrame（30 列 × SV 数）和几次

`df.apply(…, axis=1)` 的中间对象。经验值：

| 数据规模 | 内存占用 |
| --- | --- |
| 水稻 chr9（6 万 SV） | < 1 GB |
| 全基因组 60 万 SV（玉米测试数据量级） | 数 GB |

数据大时建议：`--seg_step` 用小值配合 `average_seg_statistics()` 降维，

或先用 `-e` 分染色体跑。

### 10.3.4 一次完整的默认参数实测

```bash
/usr/bin/time -v python PyBSASeq.py -i p9.csv,b9.csv -b 430,385 -p F2
# 全部默认：-r 10000, -s 2000000,10000, -v 0.01,0.05
```

| 指标 | 实测值 |
| --- | --- |
| Wall clock | **2 分 17 秒** |
| 内部累计耗时 | 2.247 min |
| **内存峰值 (Max RSS)** | **851 MB** |
| 退出码 | 0 |
| 输入 SV | 169,701（亲本）+ 165,812（混池） |
| 过滤后 SV | 59,049 |
| 独立性距离 `seg_size` | 150 |
| 每滑窗平均 SV 数 | 1,912 |
| 全局比值阈值 | 0.03295 |
| 检出峰 | chr9:1,960,001（比值 0.0821，四列显著性全为 1） |
| 显著区域 | chr9: 1 – 3,630,001（364 个滑窗，89 个局部峰） |

>`-r 100` 与 `-r 10000` 的全局阈值只差 4%（0.03165 vs 0.03295），峰位置完全一致 ——
>说明结论对 `rep` 不敏感。正式分析仍建议用 10,000 以保证阈值稳定。

当出现 `MemoryError` 或机器卡死时，优先怀疑：

1. `-r` 没降下来 + 数据量很大
2. 没装 `fisher`，`df.apply(sv_ci_scipy, axis=1)` 在 Python 层逐行建 DataFrame 切片

## 10.4 质量控制清单（出结果前逐项核对）

### 跑之前

- [ ] `PyBSASeq.py` 第 17 行已修复（`savgol_filter` 后面没有 `/`）
- [ ] `fisher` 已安装（`python -c "from fisher import pvalue_npy"` 无报错）
- [ ] `which python` 指向预期环境
- [ ] 输入文件是同一次变异检测、同一参考基因组产物
- [ ] `-b` 填的是**实际混池个体数**（不是株数或 read 数）
- [ ] `-p` 与实际群体结构一致（特别是 BC）
- [ ] `Results/` 里没有需要重算的旧缓存（改了统计参数就必须删）

### 跑之后

- [ ] `misc_info.csv` 的 `Bulk ID` 是两个**不同**的池
- [ ] `Average locus depth` 与实验设计相符（BSA-Seq 通常 20×–100×；本仓库测试数据只有 ~7.5×）
- [ ] `Average SVs per sliding window` 在数百–数千量级
- [ ] `wrnLog.csv` 里的空滑窗数量不多（空滑窗段落的曲线不可信）
- [ ] `CHROM` 列表与预期染色体一致（有没有漏掉短染色体？）
- [ ] 显著峰位置与 `sv_region.csv`、`sliding_windows.csv` 自洽
- [ ] `BSASeq.csv` 的 `Significance_sSV` 与 `AvgLD` 一起看：平均深度过低的峰要打折
- [ ] 有条件的做**独立方法交叉验证**（SNP index 法 / G 统计量法），三个面板峰位一致才下结论

## 10.5 结果可信度自检

| 现象 | 可能原因 | 怎么办 |
| --- | --- | --- |
| 所有染色体整条都超阈值 | 真实的强选择 + 低重组区（如着丝粒附近），也可能是阈值过低 | 检查 `sm_alpha` 是否太小；结合着丝粒位置判断 |
| 峰特别多、特别窄 | SV 总数少 / 滑窗太小 / 平滑窗口太小 | 加大 `-s` 滑窗、加大 `-m` 平滑窗口 |
| `sliding_windows.csv` 里大量 'empty' 或常量段 | SV 太稀疏或某染色体被过滤 | 查 `wrnLog.csv`；考虑调小 `-s` |
| 有亲本时 ΔAF 全部为正（或全为负） | REF/ALT 方向约定问题 | 检查亲本 GT/REF 是否一致；必要时用 `-c` 的镜像项 |
| 结果与论文差异巨大 | 覆盖度、群体、参考基因组、`sm_alpha` 任一不同都会影响 | 逐项对齐后再比较（见[第八章](ch08-case-study-rice.md) 的对比表） |

→ 返回：[目录](index.md)

---
title: 第六章、命令行参数全解
collection:
  profile: wiki
  id: bsa-seq
active_menu: bsa-seq
tags: [命令行, argparse, 参数, 用法]
---

# 第六章、命令行参数全解

## 6.1 基本调用形式

```bash
python PyBSASeq.py -i <输入文件(逗号分隔)> [选项...]
```

>README 里的老式写法：`python PyBSASeq.py -i input -o output -p popstrct -b fbsize,sbsize`
>—— 与当前代码一致，但 README 没有覆盖 2020 年论文之后新增的 8 个参数。

## 6.2 参数总表

| 短参 | 长参 | 默认值 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| `-i` | `--input` | `parents.tsv,bulks.tsv` | `list[str]` | 输入文件名，逗号分隔。1 个 = 只有混池；2 个 = 亲本,混池 |
| `-o` | `--output` | `BSASeq.csv` | `str` | 最终峰验证结果的文件名（写在时间戳目录内） |
| `-b` | `--bulksizes` | `430,385` | `list[int]` | 第一池、第二池的**个体数** |
| `-p` | `--popstruct` | `F2` | `{F2,RIL,BC}` | 群体结构，决定 H0 下的等位频率 |
| `-v` | `--pvalues` | `0.01,0.05` | `list[float]` | `alpha`（真数据判定 sSV）、`sm_alpha`（模拟数据判定 sSV） |
| `-r` | `--replication` | `10000` | `int` | 阈值模拟的重复次数 |
| `-s` | `--slidingwindow` | `2000000,10000` | `list[int]` | 滑窗大小, 步长（bp） |
| `-g` | `--gaps` | `0.028,0.056,0.0264,0.054,0.076,0.002,0.002` | `list[float]` | 排版：水平间隙, 垂直间隙, 上, 下, 左, 右边距, 标题 y 位置 |
| `-m` | `--smoothing` | `51,3` | `list[int]` | savgol 平滑：窗口长度, 多项式阶数 |
| `-t` | `--smooth` | `True` | `bool`（陷阱，见 6.4） | 是否对曲线做 savgol 平滑 |
| — | `--chromosome_order` | `False` | `list[str]` | 手动指定染色体顺序 |
| `-l` | `--read_length` | `100` | `int` | DI 抽稀距离的**起点**（也是 DW 迭代的步长基数） |
| `-e` | `--region` | `-1` | `list[int]` | 只分析指定区域：`chrm,start,end` 三元组可重复 |
| `-c` | `--misc` | `20,1,1` | `list[int]` | GQ 阈值, 滑窗最少 SV 数, ΔAF 镜像索引 |
| `-a` | `--adjust_gap` | `False` | `bool`（陷阱） | 只重绘图（复用已有结果） |
| — | `--parent` | `none` | `str` | 填 `ref` 表示"以亲本基因组为参考做变异检测" |
| — | `--seg_step` | `0` | `int` | 分段平均的步长；> 0 时启用 `average_seg_statistics()` |

### 关于 Argparse 的一个冷知识

`default='-1'`、`default='430,385'` 这类**字符串默认值**会被 argparse **自动应用 `type`

转换**（这是 argparse 的官方行为：*If the default value is a string, the parser parses

the value as if it were a command-line argument*）。所以不传 `-e` 时

`region` 实际是 `[-1]`（列表），`select_chrms()` 里的 `rgn[0] == -1` 才能成立。

## 6.3 逐参数详解

### `-i / --input`（最重要）

```bash
-i bulks.csv                    # 模式 B：只有混池，ΔAF 取绝对值
-i parents.csv,bulks.csv        # 模式 A：有亲本，ΔAF 带符号 + 双侧 CI
-i bulks.csv --parent ref       # 模式 C：亲本基因组做参考，等同模式 A 的统计口径
```

- 文件扩展名必须是 `.tsv` 或 `.csv`
- 相对路径按**当前工作目录**解析，绝对路径也可以
- 列顺序决定 fb/sb：第一个 `.AD` 列是 fb，第二个是 sb

### `-b / --bulksizes`

```bash
-b 430,385        # 论文默认值，来自 Yang et al. 的水稻实验（ES 池 430 株，ET 池 385 株）
```

决定 `sm_allelefreq()` 里每次模拟抽多少个个体。对 F2/RIL 影响很小（期望恒为 0.5），

**但对 BC 影响明显**（期望恒为 0.25，个体数只影响抽样噪声）。

填错主要影响阈值模拟的精度，影响 ± 方向很小。

### `-p / --popstruct`

| 取值 | AA:Aa:aa | H0 下 ALT 频率 | 适用 |
| --- | --- | --- | --- |
| `F2` | 0.25:0.50:0.25 | 0.50 | F2 及任何自交分离群体 |
| `RIL` | 0.50:0.00:0.50 | 0.50 | 重组自交系（纯合，无杂合型） |
| `BC` | 0.50:0.50:0.00 | **0.25** | 回交群体（隐含"回交到 REF 亲本"） |

选错 `-p` 会直接算错阈值。**F2 与 RIL 在 H0 频率上等价**（都是 0.5），

差别只在"是否允许杂合个体"影响抽样噪声，实际影响很小；BC 则完全不同。

### `-v / --pvalues`

```bash
-v 0.01,0.05      # 代码默认
-v 0.01,0.10      # 论文正文所用的口径
```

- 第一个数 `alpha` 用于**真实数据**判 sSV，默认 0.01
- 第二个数 `sm_alpha` 用于**模拟数据**判 sSV。调大 → 阈值更高 → 假阳性更少但更保守
- 这两个值还决定分位数：

```
percentile_ci = [alpha*100/2, 100 - alpha*100/2]   # alpha=0.01 → [0.5, 99.5]
percentile_th = 100 - alpha*100/2                  # → 99.5
```

即 **`alpha` 一变，整个阈值体系的分位数也跟着变**。论文写的是 99% CI（对应 0.01）

和 99.5 百分位（对应 0.01），两者是自洽的。

### `-r / --replication`

默认 10000（论文口径）。实测水稻 chr9 全染色体在 `-r 100` 下 24 秒跑完全流程；

`-r 10000` 主要贵在 `sv_ci()` 的**逐位点**模拟上，时间大致线性放大。

科研分析请用默认值；调试/教学可以降到 100–1000。

### `-s / --slidingwindow`

```bash
-s 2000000,10000      # 默认：2 Mb 窗口，10 kb 步长（论文口径）
```

同时决定最小可用染色体长度：

```
min_frag_size = sw_size + smth_wl * incremental_step
              = 2,000,000 + 51 × 10,000 = 2,510,000 bp
```

**改 `-s` 之后必须删除 `Results/threshold.txt` 和 `Results/sliding_windows.csv`**，

否则会复用旧阈值。

### `-g / --gaps`

7 个数，顺序固定（容易记混）：

```
-g  水平间隙, 垂直间隙, 上边距, 下边距, 左边距, 右边距, 标题y
    0.028,    0.056,    0.0264, 0.054,  0.076,  0.002,  0.002
```

源码里的换算（注意后两个是 `1 - x`）：

```python
h_gap, v_gap, t_margin, b_margin, l_margin, r_margin, g_pos = (
    args.gaps[0], args.gaps[1], 1-args.gaps[2], args.gaps[3],
    args.gaps[4], 1-args.gaps[5], args.gaps[6])
```

README 的表述是"a = 水平间隙, b = 垂直间隙, c~f = 上/下/左/右边距"，与代码一致。

**调排版时配合 `-a True` 使用，秒级生效**：

```bash
python PyBSASeq.py -i p9.csv,b9.csv -a True -g '0.028,0.009,0.0264,0.054,0.076,0.002,0.002'
```

### `-m / --smoothing`

savgol 滤波器参数，默认窗口 51、3 阶多项式。约束：

**窗口必须是奇数且大于多项式阶数**，且不能超过该染色体的滑窗个数

（`min_frag_size` 的设计已经保证了这点）。

### `-t / --smooth` ⚠️

`type=bool` 的经典陷阱 —— **任何非空字符串都是 True**：

```python
bool('True') → True
bool('False') → True     # ← 想关掉平滑，这样写没用！
bool('0')    → True
bool('')     → False     # ← 只有空字符串才是 False
```

要关闭平滑，只能写：

```bash
python PyBSASeq.py -i ... -t ''      # 或 -t ""
```

### `--chromosome_order`

```bash
--chromosome_order 1,2,3,4,5,9,11
```

不填时按"数字染色体数值升序 + 非数字染色体字典序"排（`sort_chrm()`）。

填了但包含无效名/太短的 scaffold，程序会打印提示并自动剔除。

画图的 `width_ratios` 用染色体长度，所以顺序会影响布局宽度。

### `-l / --read_length`

默认 100，含义有两层：

1. `find_seg_size()` 里 DI 抽稀距离的**起始值**
2. 每一次 DW 检验失败后，距离增加 `0.5 × read_length`（默认 +50）

上限硬编码 `max_seg_size = 1000`。所以这个参数实际控制"独立性距离搜索的粒度"，

一般不用改（默认值对应 Illumina 100–150 bp 读长，有物理意义）。

### `-e / --region`

```bash
# 单区域
-e 9,1,5000000

# 多区域（三元组重复）
-e 1,1000001,4000000,1,6000001,9000000,10,20000001,40000000
```

- 三元组 = `染色体ID, 起点, 终点`，可以写多组
- 起止点会被自动裁剪到合法范围（`< 1` 置 1，超过染色体长则截断）
- 区域长度必须 > `min_frag_size`，否则被忽略
- **非数字染色体 ID**：用 `1000–1005` 分别代表 `X, Y, Z, W, U, V`
  （README 明确说明这是当前版本的局限）

**典型用途**：`sv_region.csv` 报出的显著区域很宽（因为灵敏度高），

把它切小后重跑，就能看清区域内部还有几个峰：

>If two or more peaks/valleys and all the values in between are beyond the
>confidence intervals/thresholds, only the highest peak or the lowerest valley
>will be identified … The positions of the other peaks/valleys can be identified
>and their significance can be verified by rerunning the script using the region option.

### `-c / --misc` ⚠️

```bash
-c 20,1,1
```

| 下标 | 变量 | 含义 |
| --- | --- | --- |
| 0 | `gq_value` | GQ 过滤阈值（默认 20） |
| 1 | `min_SVs` | **滑窗内最少 SV 数**，少于该值的滑窗填前值 |
| 2 | `mirror_index` | `-1` 时把 ΔAF 和 CI **取反**（镜像曲线，便于叠图比较） |

**help 文本说有 4 个值**（"…, extremely high read, and mirror index of Δ…"），

但代码只解析 3 个 —— "extremely high read" 的功能已经移到 `read_filter()`

里的 `mean + 3σ` 判据，不再由命令行控制。传第 4 个值会被静默忽略。

### `-a / --adjust_gap`

```bash
python PyBSASeq.py -i p9.csv,b9.csv -a True -g '...'
```

只重绘图，**不重算任何统计量**。前置条件是这些文件已存在：

```
Results/threshold.txt
Results/sliding_windows.csv
```

（`-a True` 分支只检查这两个文件；缺了会提示

`You need to run the script without the --gap-adjust option to generate the required files first`。）

同样有 `type=bool` 陷阱：`-a False` **不会**关闭这个模式，只会打开它。

### `--parent`

```bash
--parent ref
```

语义不是"指定亲本文件名"，而是**声明"变异检测时用的是亲本基因组作参考"**。

一旦声明，程序按"有亲本方向信息"处理 ΔAF（带符号 + 双侧 CI）。

适用于"没给亲本文件，但 REF 确实来自亲本"的场景。

### `--seg_step`

```bash
--seg_step 100
```

- `0`（默认）：不做分段平均
- `> 0`：当 `find_seg_size()` 返回的 `seg_size > 1` 且装了 `fisher` 时，
  启用 `average_seg_statistics()`：用重叠分段（段长 `seg_size`、偏移 `seg_step`）
  对 SV 的统计量做多偏移平均，结果写入 `Results/sv_fagz_di.csv`

这是一个**降噪增强项**，会让曲线更平滑、阈值更稳，代价是需要重算 Fisher 检验。

## 6.4 参数陷阱速查

| 陷阱 | 表现 | 规避 |
| --- | --- | --- |
| `-t`/`-a` 的 `type=bool` | `-t False`、`-a False` 都等于 True | 用 `-t ''` 关闭；`-a` 只能靠不带该参数来关闭 |
| 字符串默认值被自动类型转换 | 以为 `region` 是 `'-1'`，实际是 `[-1]` | 记住 argparse 的这个行为 |
| `-s` 改了但 `threshold.txt` 没删 | 用旧阈值判新滑窗，结果错 | 改统计参数后删 `Results/sv_fagz.csv`、`threshold.txt`、`sliding_windows.csv` |
| 改了 `-b/-p/-v` 不重算 | 静默复用 `sv_fagz.csv` | 同上 |
| `-c` 传 4 个值 | 第 4 个被忽略 | 只传 3 个 |
| `-r` 调太小 | 阈值不稳、结果不可信 | 正式分析保持 10000 |
| `-i` 用 `.txt` | 直接 `sys.exit()` | 改成 `.csv` 或 `.tsv` |

## 6.5 常用命令模板

```bash
# ① 标准分析（有亲本，F2 群体，默认 2 Mb / 10 kb 滑窗）
python PyBSASeq.py -i parents.csv,bulks.csv -b 430,385 -p F2 -o BSASeq.csv

# ② 无亲本数据（仅混池）
python PyBSASeq.py -i bulks.csv -b 430,385 -p F2

# ③ 亲本基因组做参考（无亲本文件但有方向信息）
python PyBSASeq.py -i bulks.csv --parent ref -b 430,385 -p F2

# ④ 快速调试（重复次数降到 100，滑窗缩到 1 Mb）
python PyBSASeq.py -i parents.csv,bulks.csv -r 100 -s 1000000,10000

# ⑤ 只重绘图、调排版（秒级）
python PyBSASeq.py -i parents.csv,bulks.csv -a True -g '0.028,0.009,0.0264,0.054,0.076,0.002,0.002'

# ⑥ 聚焦某个显著区域，找区域内部的次级峰
python PyBSASeq.py -i parents.csv,bulks.csv -e 9,1,5000000

# ⑦ 关闭曲线平滑
python PyBSASeq.py -i parents.csv,bulks.csv -t ''

# ⑧ 指定染色体顺序 + 更宽松的模拟 p 值（论文口径）
python PyBSASeq.py -i parents.csv,bulks.csv --chromosome_order 1,2,3,4,5 -v 0.01,0.10
```

→ 下一章：[第七章、输出文件与结果解读](ch07-outputs.md)

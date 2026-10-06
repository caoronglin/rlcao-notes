---
title: 第四章、核心算法：显著 SV 方法与阈值模拟
collection:
  profile: wiki
  id: bsa-seq
active_menu: bsa-seq
tags: [算法, Fisher精确检验, 模拟, 阈值, 滑窗, G统计量]
---

# 第四章、核心算法：显著 SV 方法与阈值模拟

本章按"数据流顺序"拆解 PyBSASeq 的算法。读懂这一章，代码就只剩下搬运工作了。

## 4.1 第一步：结构变异（SV）过滤

原始 GATK4 输出里有大量噪声位点，直接用会把假阳性灌进统计。程序分三个函数依次清洗，

**每一类被剔除的位点都会单独存成 CSV**（在 `Results/FilteredSVs/{样本名}/` 下），

便于事后审计 —— 这是这个工具做得比较贴心的地方。

### 4.1.1 `sv_filtering()`：结构层面的清洗

| 顺序 | 规则 | 落盘文件 | 是否剔除 |
| --- | --- | --- | --- |
| 1 | CHROM 不在选定的染色体列表里（未定位 scaffold 等） | `ignored.csv` | 剔除 |
| 2 | 任意列为 NA | `na.csv` | 剔除 |
| 3a | ALT 含 ≥2 个逗号（3 个以上等位基因） | `3alts.csv` | 剔除 |
| 3b | ALT 含 1 个逗号且**两池 REF 读段都为 0**（`"0,x,y"`） | `real_2alts_{before,after}.csv` | **保留**（改写） |
| 3c | ALT 含 1 个逗号且两池 REF 读段不为 0 | `2alts_het.csv` | 剔除 |
| 4a | 单 ALT 且两池 REF 读段都为 0（`"0,x"`） | `fake_1alt.csv` | 剔除 |
| 4b | 单 ALT 且至少一池有 REF 读段 | `real_1alt.csv` | 保留 |
| 5 | REF 或 ALT 含 `*`，或长度 >1（InDel） | `indel.csv` | **仅记录，保留** |
| 6 | 任一池的位点深度 LD = ADREF + ADALT 为 0 | `0ld.csv` | 剔除 |
| 7 | 两池 GT 都是纯合、且两池纯合基因型相同 | `gt_ad.csv` | 剔除 |
| 8 | GT 里的碱基既不是 REF 也不是 ALT | `gt.csv` | 剔除 |

几个值得单独说的设计：

**① 2-ALT 位点的"挽救"**（3b）**

`REF/ALT = A/G,T`（REF 读段为 0）这种情况，本质上就是一个**二态位点**，

只是 GATK 把第二个等位基因写成 ALT 的第二项。程序把它降维成普通位点：

```python
df_2_alts_real[fb_ad] = df_2_alts_real[fb_ad].str.slice(start=2)      # 去掉开头的 "0,"
df_2_alts_real[['REF', 'ALT']] = df_2_alts_real.ALT.str.split(',', expand=True)
```

而被剔掉的 `2alts_het.csv` 是 REF 读段非零的情况，更可能是杂合、重复序列或测序错误。

**② InDel 被保留而不是剔除**（第 5 步）

```python
indel_1 = df[(df.REF.str.contains(r'\*')) | (df.ALT.str.contains(r'\*'))]
indel_2 = df[(df.REF.str.len()>1) | (df.ALT.str.len()>1)]
df_indel = pd.concat([indel_1, indel_2])
df_indel.to_csv(...)      # 只落盘
# df = df.drop(index=indel_2.index)     ← 被注释掉了，说明作者试过剔除
```

这也是为什么代码里到处用 **SV（structural variant）** 而不是 **SNP** 作为术语：

2020 年论文里分析的是 SNP 和小 InDel，但脚本刻意做得更通用。论文里也提到：

>it has only been tested for analysis of the SNP and small InDel calling data,
>it should be able to handle the GATK4-generated copy number variant and
>structural variant data as well.

**③ GT/AD 一致性检查**（第 7、8 步）

- 第 7 步剔除的是"两池都是同种纯合"的位点 —— 这类位点在两个池之间不可能有频率差异，
  留着只会稀释 sSV/totalSV 比值。
- 第 8 步剔除 GT 里出现第三种碱基的位点 —— 那是多等位或比对错误的信号。

### 4.1.2 `sv_filtering_final()` + `read_filter()`：测序质量层面的清洗

| 顺序 | 规则 | 落盘文件 | 是否剔除 |
| --- | --- | --- | --- |
| 1 | 任一池 GQ < `gq_value`（`-c` 第一个值，默认 20） | `svs_lowq.csv` | 剔除 |
| 2 | 两池都满足 ALT/REF > 2 | `highratio.csv` | 剔除 |
| 3 | 两池都满足 ALT/REF < 0.5 | `lowratio.csv` | 剔除 |
| 4 | 任一池 LD > mean + 3×std | `repetitive_seq.csv` | 剔除 |
| 5 | 任一池 LD < 3 | `lowread.csv` | 剔除 |
| 6 | 两池 GT 不同 | `gt_nm.csv` | 仅记录 |
| 7 | 一池 ALT/REF>2、另一池 <0.5（强反向富集） | `highly_ed.csv` | 仅记录 |
| 8 | 一池 REF=0、另一池 ALT=0（两池互补纯合） | `bulk_homo_svs.csv` | 仅记录 |

设计意图：

- 规则 2、3 是"两端都同向"的位点 —— 不是两池之间的差异，而是共同的偏倚（例如都偏向 ALT），
  大概率是参考基因组差异或重复序列。
- 规则 4 是**重复序列过滤**：高深度异常通常是重复元件造成的假比对。
  使用 `mean + 3σ` 的**单侧**离群判据。
- 规则 7 的 `highly_ed.csv` 和规则 8 的 `bulk_homo_svs.csv` **不剔除**，
  它们是"最像真信号"的位点，作者特意留档供人工核查。

## 4.2 第二步：显著 SV（sSV）的判定

对每个过滤后的 SV，构建 2×2 列联表：

```
              REF        ALT
第一池 sb    ADREF1     ADALT1
第二池 fb    ADREF2     ADALT2
```

用 **Fisher 精确检验**（不是卡方，也不是 G 检验）计算 p 值：

```
p < alpha（默认 0.01）  →  该 SV 记为 sSV（显著 SV）
```

### 为什么用 Fisher 而不用 G 检验/卡方

论文的论证是：

>For the same set of 2×2 contingency table, the p-value calculated via either G-test
>or chi-square test is less than that calculated via Fisher's exact test, even for
>sample sizes in the hundreds. To decrease the chance of false positives, Fisher's
>exact test was used to identify the likely trait-associated SNPs here.

也就是说 G 检验和卡方在小样本下都会**偏乐观**（p 值偏小），而测序深度的分布天然高度不均，

相当一部分位点的 AD 计数很小（例如 `"1,2"`）。Fisher 精确检验不依赖大样本近似，更保守也更准。

### 向量化实现

```python
from fisher import pvalue_npy
__, __, df['FE_P'] = pvalue_npy(fb_ad_alt_arr, fb_ad_ref_arr, sb_ad_alt_arr, sb_ad_ref_arr)
```

`fisher` 模块一次吃四个 numpy 数组，几十万位点秒级完成。

若没装 `fisher`，程序回落到逐行 `scipy.stats.fisher_exact`（源码 `sv_ci_scipy()`），

结果相同但**慢好几个数量级**。

## 4.3 第三步：另外两条曲线的统计量

### Δ(AF)：等位基因频率差

```
fb_af = ADALT1 / LD1                    # LD = ADREF + ADALT
sb_af = ADALT2 / LD2
Delta_AF = sb_af - fb_af
```

- 有亲本信息（两文件，或 `--parent ref`）：保留**符号**
- 无亲本信息（单文件）：取**绝对值** `|Delta_AF|`
- `-c …,-1`（`mirror_index = -1`）可以把整条曲线**镜像翻转**，用于和另一条曲线叠图比较

### G 统计量

```python
def g_statistic_array(o1, o3, o2, o4):
    e1 = np.where(o1+o2+o3+o4!=0, (o1+o2)*(o1+o3)/(o1+o2+o3+o4), 0)
    e2 = np.where(o1+o2+o3+o4!=0, (o1+o2)*(o2+o4)/(o1+o2+o3+o4), 0)
    e3 = np.where(o1+o2+o3+o4!=0, (o3+o4)*(o1+o3)/(o1+o2+o3+o4), 0)
    e4 = np.where(o1+o2+o3+o4!=0, (o3+o4)*(o2+o4)/(o1+o2+o3+o4), 0)
    llr = 2*O*ln(O/E)   # 逐格，O/E>0 才计算，否则记 0
    return llr1+llr2+llr3+llr4
```

>**读代码的坑**：函数签名是 `(o1, o3, o2, o4)`，而调用处写的是
>`g_statistic_array(fb_ref, fb_alt, sb_ref, sb_alt)`。实际映射是
>`o1=fb_ref, o2=sb_ref, o3=fb_alt, o4=sb_alt` —— 即表格的行是"等位基因"、
>列是"混池"，和直觉相反。好在 G 统计量在矩阵转置下不变，**数值结果正确**，
>但重构这段代码时务必注意。

## 4.4 第四步：无效假设模拟（算法的心脏）

所有阈值都靠**模拟**得到，而模拟的关键是：在没有真实关联（H0）时，

一个 SV 在两个混池里的 ALT 频率应该是多少？

### 4.4.1 `sm_allelefreq()`：从群体结构推出 H0 的等位频率

```python
pop  = [0.0, 0.5, 1.0]                  # AA, Aa, aa 个体携带的 ALT 比例
if pop_struc == 'F2':  prob = [0.25, 0.5, 0.25]
elif pop_struc == 'RIL': prob = [0.5, 0.0, 0.5]
elif pop_struc == 'BC':  prob = [0.5, 0.5, 0.0]

for __ in range(rep):
    alt_freq = np.random.choice(pop, bulk_size, p=prob).mean()
    freq_list.append(alt_freq)
return sum(freq_list)/len(freq_list)
```

思路：从分离群体里抽 `bulk_size` 个个体，每个个体的 ALT 携带比例由基因型决定

（AA=0、Aa=0.5、aa=1），按孟德尔比例采样后取均值 —— 这就是 H0 下混池的期望 ALT 频率。

| 群体类型 | AA : Aa : aa | H0 下 ALT 频率 |
| --- | --- | --- |
| F2 | 0.25 : 0.50 : 0.25 | **0.50** |
| RIL（重组自交系） | 0.50 : 0.00 : 0.50 | **0.50** |
| BC（回交） | 0.50 : 0.50 : 0.00 | **0.25** |

>**BC 的隐含假设**：`prob=[0.5,0.5,0]` 固定给出 0.25，即假定"回交到 REF 亲本"。
>若实验是回交到 ALT 亲本（H0 频率应为 0.75），需要用 `--parent ref` 模式
>或先交换 REF/ALT。论文里写的 "0.75/0.25" 也印证了这个二义性。

程序对 fb 和 sb 分别算一次（`fb_freq` / `sb_freq`），因为两个池的个体数不同。

### 4.4.2 二项抽样：模拟 AD 值

```python
df['sm_fb_ad_alt'] = np.random.binomial(df[fb_ld], fb_freq)   # 用真实深度 + H0 频率
df['sm_fb_ad_ref'] = df[fb_ld] - df['sm_fb_ad_alt']
df['sm_sb_ad_alt'] = np.random.binomial(df[sb_ld], sb_freq)
df['sm_sb_ad_ref'] = df[sb_ld] - df['sm_sb_ad_alt']
```

即：**保留每个位点的真实测序深度，只把等位频率换成 H0 频率**。

论文里的公式：

```
smADALT = Binomial(DP, alleleFreq)
smADREF = DP − smADALT
```

用模拟出来的 AD 再做一次 Fisher 检验，得到 `sm_FE_P`。

如果 H0 下某个 SV 都能算得"显著"，说明这个位点天然容易假阳性 —— 阈值必须把这点扣除。

## 4.5 第五步：三层阈值体系

这是最容易混淆的部分。程序一共算**三层**阈值：

```
┌─ 全局层（基因/染色体级别）
│   resampling: 从全量 SV 里有放回抽样 sv_per_sw 个 SV
│   重复 rep 次，取分位数
│   → thrshld_fe (sSV/totalSV 比值阈值, 99.5 百分位)
│   → thrshld_gs (G 统计量阈值, 99.5 百分位)
│   → thrshld_af (Δ(AF) 两侧 CI, [0.5, 99.5] 百分位)
│   → thrshld_af_abs (|Δ(AF)| 阈值, 99.5 百分位)
│
├─ SV 层（每个位点各自的阈值，用于画品红色参考线）
│   sv_ci(): 对每个 SV 单独做 rep 次模拟 → 该位点的 CI / 分位点
│   sv_ci_gw(): 对上面这些"逐位点阈值"取均值 → 一条水平参考线
│
└─ 滑窗层（最终判决用的阈值）
    thresholds_sw(): 只对某个候选峰所在滑窗内的 SV 做 rep 次模拟
    → Threshold_sSV / Threshold_GS / Threshold_DAF
```

### 5.1 为什么要"重抽样"求全局阈值

论文给了非常实际的理由：

>It takes around two minutes to calculate the threshold of a single sliding window
>via simulation … and calculating a threshold for every sliding window of the SNP
>dataset via simulation would take a very long time.

作者的数据集有 **34,919 个滑窗**，每个 2 分钟 → 需要一个月以上。

所以先用**重抽样**得到一个"全局阈值"粗筛出候选峰，再只对候选峰做**滑窗特异阈值**精筛。

两步走把计算量降了几个数量级。

### 5.2 全局阈值的样本量：`sv_per_sw`

```python
sv_per_sw = int(len(bulk_df_di.index) * sw_size / sum(chrmSzL))
```

即"平均每个 2 Mb 滑窗里有多少个（独立的）SV"：

（独立 SV 总数）×（滑窗大小）/（全基因组总长）。论文实测平均 6984 个。

论文还提到一个反直觉的现象：

>we tried different sample sizes for the genome-wide threshold calculation,
>and the results demonstrated that increasing the sample size decreased the threshold.

样本量越大，比值的抽样方差越小，99.5 百分位就越低 —— 所以用平均样本量是合理折中。

### 5.3 模拟时用更宽松的 P 值（`sm_alpha`）

注意 `-v alpha,smalpha` 是两个不同的数：

| 参数 | 默认值 | 作用 |
| --- | --- | --- |
| `alpha` | 0.01 | 真实数据上判定 sSV 的 p 值阈值 |
| `sm_alpha` | **0.05**（代码默认；README 写 0.01，论文正文写 0.10） | **模拟数据**上判定 sSV 的 p 值阈值 |

论文解释了为什么要故意放宽：

>A higher cut-off p-value (0.01 is used in the real SNP dataset) is used here,
>resulting in the identification of more significant SNPs from the simulated
>SNP sub-dataset, hence a higher threshold and less false positives.

逻辑闭环：模拟时更容易判为 sSV → 算出的比值阈值**更高** → 真数据判显著更严格 → 假阳性更少。

>⚠️ 论文的默认值与代码不一致（论文正文 0.10、README 0.01、代码 0.05）。
>复现时请显式指定 `-v 0.01,0.10` 或 `-v 0.01,0.05`，不要依赖默认。

### 5.4 `threshold.txt` 的 9 个数字

```
#1 thrshld_fe      sSV/totalSV 比值阈值（全局）
#2 thrshld_gs      G 统计量阈值（全局）
#3 thrshld_af_n    Δ(AF) 的 CI 下界
#4 thrshld_af_p    Δ(AF) 的 CI 上界
#5 thrshld_af_abs  |Δ(AF)| 阈值（无亲本信息时使用）
#6 sv_ci_af_lb     SV 层 Δ(AF) CI 下界（画线用）
#7 sv_ci_af_ub     SV 层 Δ(AF) CI 上界（画线用）
#8 sv_ci_gs        SV 层 G 统计量阈值（画线用）
#9 sv_ci_af_abs    SV 层 |Δ(AF)| 阈值（画线用）
```

实测样例（水稻 chr9 前 3 Mb，`-r 100`）：

```
0.03783356258596973 1.3288686178847384 -0.022200169128212457 0.019951754801823558
0.2288475862457121 -0.6104082537609875 0.604376395068709 7.852325248123475 0.6650200949802907
```

这个文件是 `-a True`（只重绘图）模式的**唯一输入依赖**之一。

## 4.6 第六步：SV 独立性（DI）与 Durbin-Watson

### 问题：物理上相邻的 SV 不是独立观测

BSA-Seq 的 SVs 沿染色体排列，相邻位点落在同一单倍型块里，**高度相关**。

直接拿几十万个 SV 去算 Fisher 检验会严重高估自由度、低估方差，阈值算不准。

### 解法一：DI（Distance Independence）

```python
def di(df, frag_size):
    # DSTNC = 当前 SV 与上一个 SV 的物理距离
    # 距离 ≥ frag_size  → DI = 1（独立代表位点）
    # 否则累积距离，直到累计 ≥ frag_size 才再标记一个 DI = 1
```

即按物理距离**抽稀**：每 `frag_size` bp 里只保留一个代表位点。

`bulk_df_di = bulk_df[bulk_df.DI==1]` 之后的数据才是"近似独立"的样本。

### 解法二：用 Durbin-Watson 自动定 `frag_size`

```python
def dw(df):
    # 对每条染色体做 OLS: LD ~ POS，检验残差的 Durbin-Watson 统计量
    if dw_fb < 1.5 or dw_sb < 1.5:
        return True          # 残差存在自相关 → 位点不独立 → 需要继续加大 frag_size

def find_seg_size(df):
    if dw(df) == False: return 1                  # 已经独立，无需抽稀
    i_seg_size = sr_length                        # 从 -l 起（默认 100）
    while dw(df[DI==1]) == True:
        i_seg_size += int(0.5 * sr_length)        # 每次 +50
        if i_seg_size >= max_seg_size:            # 上限 1000（源码硬编码）
            return max_seg_size
    return i_seg_size
```

**逻辑**：测序深度沿染色体若存在系统性起伏（GC 偏倚、重复序列、拷贝数变异等），

残差就会有自相关，说明位点不能当作独立样本。DW 统计量的经验阈值取 1.5。

这个循环每次迭代都会打印最终的 `seg_size`（实测水稻小数据里打印的是 `150`）。

### 解法三：分段平均（`--seg_step`）

当 `seg_size > 1` 且 `--seg_step > 0` 且装了 `fisher` 时，程序走

`average_seg_statistics()`：

```python
steps = int(seg_size / ncrmntl_stp)
for i in range(steps):
    df['Seg'] = (df.POS + ncrmntl_stp*i) // seg_size     # 不同偏移量切段
    df = seg_statistics(df)                              # 段内平均 AD 后重算统计量
df['Delta_AF'] = np.mean(daf_arr, axis=0)                # 多个偏移的结果再平均
df['G_S']      = np.mean(gs_arr, axis=0)
df['FE_P']     = np.mean(fep_arr, axis=0)
```

即对 SV 做**重叠分段**（段长 `seg_size`，偏移步长 `seg_step`），

每段内先把 AD 求平均得到"段级 AD"，再算 Fisher/G/Δ —— 相当于进一步降噪。

结果存到 `Results/sv_fagz_di.csv`，后续所有统计都改用它。

## 4.7 第七步：峰的识别与显著性验证

### 7.1 峰的识别（`bsaseq_plot()` 内部）

滑窗遍历时同步做**峰检测**状态机：

- 若某滑窗的 `sSV/totalSV ≥ thrshld_fe` 且高于左右邻居 → 记为一个候选峰（`zigzag`）
- 连续超阈值的滑窗合并成一段"显著区域"（`sv_region`），记录起止坐标、峰列表、滑窗个数
- 一段超阈值区域内若有多个峰，**只保留最高的那个**作为该区域的代表峰
- 结果写入 `Results/sv_region.csv`（列：`CHROM, Start, End, Peaks, NumOfSWs`）

>这正是程序结尾那段提示的含义：*If two or more peaks/valleys and all the values in
>between are beyond the confidence intervals/thresholds, only the highest peak or the
>lowerest valley will be identified as the peak/valley of this region.*
>想看同区域内的其他峰，要用 `-e/--region` 把区域切小后重跑。

### 7.2 候选峰筛选（`pk_list()`）

```python
if sub_l[3] != [] and sub_l[4] > 10:      # 区域内滑窗数 > 10 才做验证
    tempL = peak(sub_l[3])                # 取 sSV/totalSV 最高的滑窗
```

`> 10` 是为了避免只有一两个滑窗的"孤立尖刺"进入验证。

### 7.3 滑窗特异阈值验证（`accurate_threshold_sw()`）

对每个候选峰所在的滑窗：

1. 用**该窗口内**的 SV 重新模拟 `rep` 次 → `thresholds_sw()` 得到该窗口专属阈值
2. 重算该窗口的 `sSV/totalSV`、`GS`、`DAF`
3. 对窗口内每个 SV 的 `fb_af` 与 `sb_af` 做**配对 t 检验**：

```python
__, pvalue_tt = ttest_rel(peak_sw[fb_af], peak_sw[sb_af])
```

1. 输出四个显著性判据（0/1）：

```python
peak_df['Significance_sSV'] = np.where(peak_df['sSV/totalSV'] > peak_df['Threshold_sSV'], 1, 0)
peak_df['Significance_GS']  = np.where(peak_df.GS > peak_df.Threshold_GS, 1, 0)
peak_df['Significance_AF']  = np.where((peak_df.DAF > DAF_CI_UB) | (peak_df.DAF < DAF_CI_LB), 1, 0)
peak_df['Significance_TT']  = np.where(peak_df['pvalue_tt'] < alpha, 1, 0)
```

（无亲本信息时第 3 条退化为 `DAF > Threshold_DAF`，单侧绝对值比较。）

最终写入 `Results/{时间戳}/BSASeq.csv`。

## 4.8 一个容易被忽略的细节：滑窗特异性阈值解决的是"假阳性"

论文用真实数据给了一个漂亮的例子：

- 第 3 号染色体上的第一个候选峰，`sSV/totalSV = 0.0929`，
  略高于全局阈值 `0.087` —— 按全局阈值看是"显著"的；
- 但该滑窗只有 **2,260 个 SNP**，不到平均水平（6,984）的 1/3；
- 用**滑窗特异阈值**一算，这个峰立刻被判为**假阳性**。

反过来，SNP 数特别多的滑窗阈值会**低于**全局阈值，

所以"比值低于全局阈值但 SNP 数极多"的区域可能是**假阴性** —— 不过论文认为

这类区域比值本身就低，说明表型效应很小，漏掉可以接受：

>these genomic regions should have very small phenotypic effects judged by their low
>sSNP/totalSNP ratios.

→ 下一章：[第五章、主流程源码走读](ch05-pipeline.md)

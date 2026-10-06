---
title: 第七章、输出文件与结果解读
collection:
  profile: wiki
  id: bsa-seq
active_menu: bsa-seq
tags: [输出, BSASeq.csv, 结果解读, sliding_windows]
---

# 第七章、输出文件与结果解读

## 7.1 输出目录布局

程序在**当前工作目录**下建 `Results/`，分两层：

```
Results/
├── sv_fagz.csv              ← 每位点全量统计表（后续所有计算的“缓存”）
├── sv_fagz_di.csv           ← 分段平均后的统计表（仅 --seg_step > 0 时生成）
├── ssv.csv                  ← 仅显著 SV（sSV）
├── sliding_windows.csv      ← 滑窗层面全量数据（重绘图依赖）
├── sv_region.csv            ← 显著区域与峰的位置
├── threshold.txt            ← 9 个阈值（重绘图依赖）
├── bulk_homo_svs.csv        ← 两池互补纯合的位点（人工核查用）
├── FilteredSVs/
│   ├── parents/             ← 亲本文件的每步过滤产物 + homo_svs/hetero_svs
│   └── bulks/               ← 混池文件的每步过滤产物 + bulk_df_after/bulk_svs
└── 20260918_202101/         ← 每次运行一个时间戳目录
    ├── BSASeq.csv           ← ★ 最终结果（-o 可改名）
    ├── PyBSASeq.pdf         ← ★ 主图（4 面板 × N 染色体）
    ├── PyBSASeq.eps / .svg / .png（600 dpi）
    ├── misc_info.csv        ← 运行台账（排查第一站）
    ├── num_sv_on_chr_file.csv
    ├── wrnLog.csv           ← 空滑窗警告日志
    ├── highly_ed.csv        ← 强反向富集位点
    └── temp/                ← DI 计算中间文件
        └── 9_40676.csv      ← 命名为 {CHROM}_{首个SV位置}.csv
```

>时间戳格式 `%Y%m%d_%H%M%S`，每次运行新建一个目录，**不覆盖**旧结果。

## 7.2 主图 `PyBSASeq.pdf` 的四个面板

图是 `4 行 × N 列`（N = 参与分析的染色体数），所有列共享 x 轴（基因组位置），

每行共享 y 轴。程序在左侧手工打了 `a/b/c/d` 四个面板字母。

| 面板 | y 轴 | 黑线 | 蓝线 | 彩色参考线 |
| --- | --- | --- | --- | --- |
| **a** | Number of SVs | sSV 个数 | total SV 个数 | — |
| **b** | sSV/totalSV | 滑窗比值（savgol 平滑） | — | **红**：全局比值阈值 `thrshld_fe` |
| **c** | *G*-statistic | 滑窗平均 G | — | 品红：逐位点 G 阈值均值 `sv_ci_gs`；红：全局 G 阈值 |
| **d** | Δ*AF* | 滑窗平均 ΔAF | — | 品红：ΔAF 的 CI 上下界；红：全局 ΔAF 阈值 |

要点：

- **面板 a 只能用来"看 SNP 密度"，不要用它定位 QTL。** SNP 分布极不均匀，
  绝对个数会误导（论文 Fig.1a vs 1b 的核心论点）。
- **面板 b 是主要判据**（显著 SV 方法）。
- 面板 c、d 是同一批数据的另外两种统计口径，用于交叉验证：
  若 b、c、d 三个面板的峰位置一致，结论就很可靠。
- 图中**没有直接画出峰的位置标注** —— 峰坐标要去 `sv_region.csv` / `BSASeq.csv` 里看。

>x 轴单位由 `xticks_property()` 自动选：Gb / ×100 Mb / ×10 Mb / Mb / ×100 kb。

## 7.3 `BSASeq.csv`：最终结论表

每一行 = 一个通过验证的候选峰。列的含义（`fb_id`/`sb_id` 是自动识别的池 ID）：

| 列名 | 含义 |
| --- | --- |
| `CHROM` | 染色体 |
| `POS` | 该峰所在滑窗的**起点**（不是峰顶坐标） |
| `{fb_id}.AvgLD` | 第一池该滑窗内的平均位点深度 |
| `{sb_id}.AvgLD` | 第二池该滑窗内的平均位点深度 |
| `sSV` | 滑窗内显著 SV 个数 |
| `totalSV` | 滑窗内 SV 总数 |
| `sSV/totalSV` | 显著 SV 占比（**主判据**） |
| `Threshold_sSV` | 该滑窗的**滑窗特异**比值阈值（模拟 10000 次得到） |
| `GS` | 滑窗平均 G 统计量 |
| `Threshold_GS` | 滑窗特异 G 阈值 |
| `DAF` | 滑窗平均 Δ(AF) |
| `DAF_CI_LB` / `DAF_CI_UB` | 该滑窗 Δ(AF) 置信区间下/上界 |
| `Threshold_DAF` | 无亲本信息时的 `|Δ(AF)|` 阈值 |
| `pvalue_tt` | 滑窗内各 SV 的 `fb_af` vs `sb_af` **配对 t 检验** p 值 |
| `Significance_sSV` | 显著 SV 法判定（1 = 显著） |
| `Significance_GS` | G 统计量法判定 |
| `Significance_AF` | 等位频率法判定 |
| `Significance_TT` | 配对 t 检验判定 |

>⚠️ README 写的是 `Significance_SSV`（大写 S），代码实际输出 `Significance_sSV`（小写 s）。

**怎么判读**：

- 论文的判读标准是 **`Significance_sSV == 1` 即为显著**，其余三列是旁证
- 四列全为 1 → 最可靠
- 只有 `Significance_sSV == 1` → 典型的"显著 SV 方法独有发现"，
  可能是微效 QTL（论文的核心卖点），也可能是假阳性，需要生物学验证
- `AvgLD` 一起看：若某池平均深度异常低（比如 < 5），该峰可信度打折

## 7.4 `sv_region.csv`：显著区域

| 列 | 含义 |
| --- | --- |
| `CHROM` | 染色体 |
| `Start` / `End` | 超阈值区域的起点 / 终点（滑窗起点） |
| `Peaks` | 该区域内所有峰的**原始数据列表**（Python 列表字面量，需 `ast.literal_eval` 解析） |
| `NumOfSWs` | 区域覆盖的滑窗个数 |

`Peaks` 里每个元素的字段顺序（源码 `row_contents`）：

```
[滑窗起点, fb平均深度, sb平均深度, sSV数, totalSV数, sSV/totalSV, GS,
 GS阈值, Delta_AF, DAF_CI_LB, DAF_CI_UB]
```

>注意：`peaks` 列表里**没有染色体字段**（被 `sw_dict[i][0][1:]` 切掉了），
>染色体看外层的 `CHROM`。
>
>峰的选择由 `peak()` 完成：取列表中**下标 5（即 sSV/totalSV）最大**的那个元素，
>返回其滑窗起点。

实测示例（水稻 chr9，`-r 100`）：

```
CHROM,Start,End,Peaks,NumOfSWs
9,1,3640001,"[[1, 7.5103, 7.6059, 239, 3776, 0.06329, 3.36897, 7.88549, ...] , ...]",365
```

解析出来的含义（实测）：

```
Start=1, End=3640001, NumOfSWs=365      # 365 = (3640001-1)/10000 + 1，完全吻合
len(Peaks) = 89                          # 区域内共 89 个局部峰
最高的峰:  起点 1960001, sSV/totalSV = 0.07152
```

即：chr9 上 **1 – 3,640,001 bp** 连续 365 个滑窗全部超阈值，

其中 89 个局部峰，最高峰在 1,960,001，与 `BSASeq.csv` 中验证的峰位置一致。

>**注意 `Peaks` 里的比值与 `BSASeq.csv` 里的比值可能不同**。
>`sliding_windows.csv` / `sv_region.csv` 统计的是**全部**过滤后 SV，
>而 `accurate_threshold_sw()` 是拿 **`bulk_df_di`（DI==1 的独立子集）**重新算的：
>本例中同一滑窗的比值分别是 **0.0715（全体）** 和 **0.0821（独立子集）**。
>两者都合法，但口径不同，比较时不要混用。

## 7.5 `sliding_windows.csv`：滑窗全量表

列名：

```
CHROM, POS, {fb}.AvgLD, {sb}.AvgLD, sSV, totalSV, sSV/totalSV, GS, GS_Thrshld,
Delta_AF, DAF_CI_LB, DAF_CI_UB, smthedGSThrshld, smthedDAFNCI, smthedDAFPCI,
smthedRatio, smthedGS, smthedDAF
```

- 前段（到 `DAF_CI_UB`）是**未平滑**的原始值
- `smthed*` 是 savgol 平滑后的值：

| 平滑列 | 对应 |
| --- | --- |
| `smthedRatio` | `sSV/totalSV` |
| `smthedGS` | `GS` |
| `smthedDAF` | `Delta_AF` |
| `smthedGSThrshld` | `GS_Thrshld` |
| `smthedDAFNCI` | `DAF_CI_LB`（negative CI） |
| `smthedDAFPCI` | `DAF_CI_UB`（positive CI） |

用途：

1. `-a True` 用这个文件**只重绘图**
2. 想用 R / Python 自己复现论文风格的图时，直接读这个文件即可，不需要重跑流程
3. 想导出让合作者看，可以用 `awk` 挑列：

```bash
awk -F, 'NR==1 || $1=="9"' Results/sliding_windows.csv > chr9_sw.csv
```

## 7.6 `misc_info.csv`：排查第一站

这是全流程的"运行台账"，**遇到任何异常先看它**：

```
Bulk ID - p9,['2696318', '2696319']
Number of SVs in the entire dataframe - p9,169701
Number of SVs after NA drop - p9,164788
""
Bulk ID - b9,['2696321', '2696322']
Number of SVs in the entire dataframe - b9,165812
Number of SVs after NA drop - b9,163064
""
Header,[...完整表头...]
Chromosome ID,['9']
Chromosome sizes,[22940221]
Number of SVs after drop of SVs with calculation-generated NA value,59049
Dataframe filtered with genotype quality scores,59049
Average SVs per sliding window,1912
Average locus depth in bulk 2696321,7.502176158783383
Average locus depth in bulk 2696322,7.609934122508426
Genome-wide sSV/totalSV ratio threshold,0.03165010460251046
Genome-wide G-statistic threshold,1.2635124669491233
Genome-wide Delta(AF) ratio threshold,[-0.01288555  0.01363868]
Genome-wide absolute Delta(AF) ratio threshold,0.22425317488909277
List of the peaks of the chromosomes,[0.07151626764886433]
Running time,[0.39019527832667034]
```

**健康检查清单**：

| 检查项 | 期望 | 异常含义 |
| --- | --- | --- |
| `Bulk ID` | 两个不同的池 ID | 两个 ID 相同 → 同一池算了两遍 |
| `Number of SVs after drop of … NA value` | 与过滤前同量级 | 掉太多 → 深度太低/参考基因组不匹配 |
| `Average locus depth` | 与实验设计相符（本例只有 7.5×，是原始数据本来就浅） | 极低 → 无法分析 |
| `Average SVs per sliding window` | 数百 – 数千 | < 100 → 滑窗太大，阈值会失稳 |
| `Chromosome sizes` | 与实际染色体长度一致 | 明显偏小 → 参考基因组或 POS 字段有问题 |
| `Running time` | 分钟量级（默认参数 + 全基因组） | 数小时 → 没装 `fisher`，在用 scipy 兜底 |

## 7.7 过滤中间产物（`FilteredSVs/`）

`Results/FilteredSVs/{样本名}/` 下的文件是按过滤顺序产生的快照，**每一类噪声都单独留档**：

| 文件 | 内容 | 处置 |
| --- | --- | --- |
| `ignored.csv` | 未选中染色体上的 SV | 剔除 |
| `na.csv` | 含 NA 的行 | 剔除 |
| `3alts.csv` | ≥3 个等位基因 | 剔除 |
| `2alts_het.csv` | 2 个 ALT 且 REF 非零 | 剔除 |
| `real_2alts_before/after.csv` | 2 个 ALT 且 REF 为零（被降维救回） | **保留** |
| `fake_1alt.csv` | 单 ALT 但两池 REF 都为 0 | 剔除 |
| `real_1alt.csv` | 单 ALT 的正常位点 | 保留 |
| `indel.csv` | InDel 与 `*` 位点 | **保留** |
| `0ld.csv` | 某池深度为 0 | 剔除 |
| `gt_ad.csv` | 两池同种纯合 | 剔除 |
| `gt.csv` | GT 与 REF/ALT 不符 | 剔除 |
| `svs_lowq.csv` | GQ < 20 | 剔除 |
| `highratio.csv` | 两池 ALT/REF > 2 | 剔除 |
| `lowratio.csv` | 两池 ALT/REF < 0.5 | 剔除 |
| `repetitive_seq.csv` | 深度 > mean + 3σ | 剔除 |
| `lowread.csv` | 深度 < 3 | 剔除 |
| `gt_nm.csv` | 两池 GT 不同 | 仅记录 |
| `bulk_df_before/after.csv` | 混池数据（after 含亲本方向校正后的结果） | — |
| `bulk_svs.csv` | 最终进入统计的 SV | — |
| `homo_svs.csv` / `hetero_svs.csv` | 亲本文件里的纯合多态 / 其他 | — |
| `ref_svs.csv` | 与混池成功对接的亲本位点 | — |
| `np_svs.csv` | 混池里但不在亲本纯合多态集里的位点 | — |

调参时（例如觉得 GQ 阈值太严），可以**只看这些文件统计各类噪声的比例**，

再决定要不要改 `-c`。

## 7.8 `num_sv_on_chr_file.csv` 与 `wrnLog.csv`

```
# num_sv_on_chr_file.csv
Chromosome, Num of sSVs, Num of totalSVs, sSV/totalSV
```

**逐条染色体的 sSV 汇总** —— 和论文 Table 1 完全对应，写论文时直接引用。

```
# wrnLog.csv
Type, Chr, Position, Warning Message
No SV in the sliding window, 1, 12340001
```

记录所有**空滑窗**的位置。空滑窗多说明该染色体 SV 太稀疏，

程序会用前一个非空值填充，但曲线在这一段是**不可信**的。

## 7.9 `highly_ed.csv` 与 `bulk_homo_svs.csv`：人工核查名单

这两个文件**不是噪声，而是"最像真信号"的位点**：

| 文件 | 筛选条件 | 生物学解释 |
| --- | --- | --- |
| `highly_ed.csv` | 一池 ALT/REF > 2 且另一池 < 0.5（强反向富集） | 典型的"性状关联位点"，值得单独看 |
| `bulk_homo_svs.csv` | 一池 REF=0、另一池 ALT=0（两池互补纯合） | 极端富集，极可能紧邻因果基因 |

如果 `BSASeq.csv` 里的峰落在 `bulk_homo_svs.csv` 的位点密集区，

这个峰的置信度会大幅提高。

## 7.10 `temp/` 目录：DI 计算的中间产物

`Results/{时间戳}/temp/{CHROM}_{首个SV位置}.csv`：

```
POS, POS1, DSTNC, DI
```

- `POS1`：前一个 SV 的位置（移一位错位构造）
- `DSTNC`：与前一 SV 的距离
- `DI`：1 = 独立代表位点，0 = 从属位点

**用途**：检查 DI 抽稀是否合理。`DI==1` 的比例太低（比如 < 10%）说明

`seg_size` 选得太大，独立样本太少，阈值模拟会不稳。

→ 下一章：[第八章、论文案例：水稻冷害 QTL 与降采样验证](ch08-case-study-rice.md)

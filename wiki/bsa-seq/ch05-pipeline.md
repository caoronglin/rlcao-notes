---
title: 第五章、主流程源码走读
collection:
  profile: wiki
  id: bsa-seq
active_menu: bsa-seq
tags: [源码, 流程, 代码走读, PyBSASeq.py]
---

# 第五章、主流程源码走读

## 5.1 文件骨架

`PyBSASeq.py` 是"函数定义 + 顶层脚本"的混合写法，没有 `main()` 函数，也没有

`if __name__ == '__main__':`：

| 行号区间 | 内容 |
| --- | --- |
| 1–28 | 文档字符串、import、`fisher`/`scipy` 兜底导入 |
| 30–1706 | **全部函数定义**（含 2 个约 350 行的绘图函数） |
| 1707 | `t0 = time.time()` 计时起点 |
| 1709–1717 | matplotlib 全局字体设置（Arial 22pt） |
| 1719–1737 | `argparse` 命令行定义 |
| 1738–1773 | 参数解包 + 常量定义 + `fb_freq`/`sb_freq` |
| 1774–1809 | 路径设置 + `-a True` 重绘图分支 |
| 1810–2083 | 两种主分支：**复用已有结果** / **从头计算** |
| 2085–2089 | 结尾提示信息 |

>⚠️ 因为**没有 `main()` 保护**，任何对脚本的 `import` 或 `exec` 都会立刻执行整个流程：
>解析 `sys.argv`、读文件、跑模拟、画图。想复用其中的函数（比如 `g_statistic_array`）时，
>只能把这部分代码复制出来，不能直接 `import PyBSASeq`。

## 5.2 顶层流程图

```
                        ┌─────────────────────────────────────┐
                        │ argparse 解析 17 个命令行参数        │
                        └────────────────┬────────────────────┘
                                         ▼
                ┌───────────────────────────────────────────────┐
                │ sm_allelefreq(pop_struct, bulk_size, rep)      │
                │  → fb_freq, sb_freq（H0 下的期望 ALT 频率）     │
                └────────────────┬──────────────────────────────┘
                                 ▼
        ┌────────────────────────┴────────────────────────┐
        │  -a True ？                                      │
        └───────┬──────────────────────────────┬──────────┘
           是   │                               │  否
                ▼                               ▼
  ┌──────────────────────────┐   ┌──────────────────────────────────────────┐
  │ 只重绘图（秒级）           │   │ Results/sv_fagz_di.csv 或 sv_fagz.csv     │
  │ 读 threshold.txt          │   │ 已存在？                                  │
  │ 读 sliding_windows.csv    │   └────┬─────────────────────────┬───────────┘
  │ → bsaseq_plot_sw()        │     是  │                         │ 否
  │ 可反复调 -g 调排版         │        ▼                         ▼
  └──────────────────────────┘   ┌──────────────────┐  ┌──────────────────────────────┐
                                 │ 跳过过滤与检验     │  │ 【完整流程】                  │
                                 │ 重算 DI/find_seg  │  │ for file in input_files:      │
                                 │ threshold.txt 与  │  │   sv_filtering()              │
                                 │ sliding_windows   │  │   （两文件时做亲本对接）        │
                                 │ 都在？            │  │ sv_filtering_final()          │
                                 └───┬──────────┬────┘  │ calculate_statistics()        │
                                 是  │          │ 否   │ find_seg_size() → DI          │
                                     ▼          ▼       │ gw_thresholds()               │
                          bsaseq_plot_sw()  bsaseq_plot()│ sv_ci_gw()                    │
                                                        │ bsaseq_plot()                 │
                                                        └──────────────────────────────┘
                                 ▼
                        pk_list(sv_region) → peak_verification()
                                 ▼
                        BSASeq.csv + misc_info.csv
```

**核心洞察：程序有三种"入口档位"**，靠文件是否存在自动选择（源码 1799–1880 行）。

这既是优点（重跑便宜）也是坑（改了参数但旧文件还在，会被静默复用）。

## 5.3 完整流程分支（`else` 大分支，1812–2083 行）

### 5.3.1 读入与参数准备（1848–1930 行）

```python
m = 0
for file in input_files:                    # 1 或 2 个文件
    in_file = os.path.join(path, file)
    sample = file.split('/')[-1]
    sample_name = sample.split('.')[0].lower()
    filtering_path = os.path.join(path, 'Results', 'FilteredSVs', sample_name)

    raw_sv_df = pd.read_csv(in_file, delimiter=separator, encoding='utf-8',
                            dtype={'CHROM': str})

    if selected_chrms == None:              # 只在第一个文件时建染色体列表
        temp = select_chrms(raw_sv_df, region)
        selected_chrms, chrmSzD, chrmSzL = temp

    chrm_dict = {chrm: i+1 for i, chrm in enumerate(selected_chrms)}
    raw_sv_df['ChrmSortID'] = raw_sv_df['CHROM'].map(chrm_dict)
```

`ChrmSortID` 是染色体到整数的映射，用途是让 `df.sort_values(['ChrmSortID','POS'])`

能按**数值**而不是字典序排染色体（否则 chr10 会排在 chr2 前面）。

`select_chrms()` 是这段的关键：

```python
chrm_size = df[df.CHROM==chrm]['POS'].max().item()
if chrm_size <= min_frag_size:      # min_frag_size = sw_size + smth_wl * incremental_step
    small_chrm_ids.append(chrm)     # 太短，画不出一个滑窗，丢弃
```

`min_frag_size` 由滑窗大小和平滑窗口共同决定，默认 `2,000,000 + 51 × 10,000 = 2,510,000 bp`。

也就是说默认配置下**短于 2.51 Mb 的 scaffold 直接出局**。

### 5.3.2 两文件模式的亲本对接（1968–2013 行）

```python
if num_ipfiles == 2:
    if m == 0:                                   # 处理第一个文件（亲本）
        homo_svs = sv_df[((sv_df[fb_ad_ref]==0) & (sv_df[sb_ad_alt]==0)) |
                         ((sv_df[fb_ad_alt]==0) & (sv_df[sb_ad_ref]==0))]
        hetero_svs = sv_df.drop(index=homo_svs.index)
        p_fb_gt, p_sb_gt = fb_gt, sb_gt
        p_fb_id, p_sb_id = fb_id, sb_id
        p_filtering_path = filtering_path
    else:                                        # 处理第二个文件（混池）
        bulk_df = sv_df[sv_df.ID.isin(homo_svs.ID)]
        ref_svs = homo_svs[homo_svs.ID.isin(bulk_df.ID)]
        ...
        bulk_df['p_REF'] = ref_svs[p_fb_gt].str.split('/|\\|', expand=True)[0].tolist()
        bulk_df['p_ALT'] = ref_svs[p_sb_gt].str.split('/|\\|', expand=True)[0].tolist()

        # 方向校正：让 REF 始终代表 parent1 的等位基因
        bulk_df[fb_gt] = np.where(bulk_df.p_REF==bulk_df.REF, bulk_df[fb_gt],
                                  bulk_df[fb_gt_alt] + '/' + bulk_df[fb_gt_ref])
        bulk_df[fb_ad] = np.where(bulk_df.p_REF==bulk_df.REF, bulk_df[fb_ad],
                                  bulk_df[fb_ad_alt].astype(str) + ',' + bulk_df[fb_ad_ref].astype(str))
        bulk_df['ad_Swap'] = np.where(bulk_df.p_REF==bulk_df.REF, 1, -1)
```

这段是**整个脚本里最容易读错的地方**，值得逐点解释：

1. `homo_svs` 的布尔条件看起来是"亲本一方 REF=0、另一方 ALT=0"，
   展开其实是**双亲互为异等位纯合**：
   - `fb_ad_ref==0 & sb_ad_alt==0` → parent1 是 ALT/ALT，parent2 是 REF/REF
   - `fb_ad_alt==0 & sb_ad_ref==0` → parent1 是 REF/REF，parent2 是 ALT/ALT
2. GT 取 `str.split('/|\\|')[0]` —— 只取第一个等位基因，因为已保证纯合。
3. **方向校正**是关键一步：如果 parent1 带的是 ALT 而不是 REF，就把混池的 AD 字符串
   **前后对调**（`"ALT,REF"` → `"REF,ALT"`），GT 同样对调。
   这样后续所有统计量里 "REF" 恒等于 parent1 的等位基因，
   `Delta_AF > 0` 就有了明确含义：**parent2 的等位基因在第二个池里富集**。
4. `ad_Swap` 记录这一行有没有被对调，方便事后排查。
5. 文件名相同但 ID 不同的两份数据能对接，完全依赖 `ID = CHROM_POS`。

中间产物：

`FilteredSVs/{parents}/homo_svs.csv`、`hetero_svs.csv`、`ref_svs.csv`，

`FilteredSVs/{bulks}/bulk_df_before.csv`、`bulk_df_after.csv`、`np_svs.csv`。

### 5.3.3 统计与阈值（2013–2073 行）

```python
bulk_df = sv_filtering_final(bulk_df)             # 质量层过滤
bulk_df.to_csv(os.path.join(filtering_path, 'bulk_svs.csv'), index=False)

bulk_df = calculate_statistics(bulk_df)           # Fisher + G + ΔAF + 逐位点阈值
                                                  # → Results/sv_fagz.csv

dw_dataframe = bulk_df[['CHROM','POS',fb_ld,sb_ld]].copy()
seg_size = find_seg_size(dw_dataframe)            # Durbin-Watson 定独立性距离
print(seg_size)

bulk_df['DI'] = di(bulk_df, seg_size)
bulk_df_di = bulk_df[bulk_df.DI==1]               # 近似独立子集

if   di_df == True:                               # 源码里硬编码 False，死代码
    bulk_df = bulk_df_di.copy()
elif seg_size > 1 and ncrmntl_stp > 0 and 'fisher' in sys.modules:
    bulk_df = average_seg_statistics(bulk_df)     # 分段平均降噪
    bulk_df.to_csv(oi_file_di, index=None)        # → Results/sv_fagz_di.csv

bulk_df['sSV'] = np.where(bulk_df['FE_P'] < alpha, 1, 0)
ssv = bulk_df[bulk_df['FE_P'] < alpha]
ssv.to_csv(ssv_file, columns=essential_fields, index=None)      # → Results/ssv.csv

sv_per_sw = int(len(bulk_df_di.index) * sw_size / sum(chrmSzL))

thrshlds = gw_thresholds(bulk_df_di)              # 全局阈值（4 个）
sv_cis   = sv_ci_gw(bulk_df_di)                   # 逐位点阈值的均值（画线用）
with open(thrshld_file, 'w') as xie:              # → Results/threshold.txt
    xie.write(' '.join([str(x) for x in [...9 个数...]]))

bsaseq_plot(bulk_df)                              # 滑窗 + 绘图 + sv_region/sliding_windows
```

### 5.3.4 收尾（2075–2083 行）

```python
peaklst = pk_list(sv_region)                      # 每条显著区域取最高峰
peak_verification(peaklst, bulk_df_di)             # 滑窗特异阈值 + 配对 t 检验
                                                  # → Results/{时间戳}/BSASeq.csv

with open(os.path.join(results, 'misc_info.csv'), 'w', newline='') as outf:
    xie = csv.writer(outf)
    xie.writerows(misc)                            # 全流程的“运行台账”
```

`misc` 列表是一个"边跑边记"的全局台账，记录了每个文件过滤前后有多少 SV、

染色体列表、平均深度、各阈值、运行时间等 —— `misc_info.csv` 是**判断一次运行是否正常

最该先看的文件**。

## 5.4 复用分支（1813–1880 行）

```python
if os.path.isfile(selected_oi_file):              # selected_oi_file = sv_fagz_di.csv 或 sv_fagz.csv
    bulk_df = pd.read_csv(selected_oi_file, dtype={'CHROM':str})
    ...按列名重建 fb_id/sb_id/各派生列名...
    seg_size = find_seg_size(dw_dataframe)
    bulk_df['DI'] = di(bulk_df, seg_size)
    bulk_df_di = bulk_df[bulk_df.DI==1]

    if os.path.isfile(thrshld_file) and os.path.isfile(sw_file) and os.path.isfile(sv_region_file):
        sw_dataframe = pd.read_csv(sw_file, dtype={'CHROM':str})
        bsaseq_plot_sw(sw_dataframe)              # 秒级重绘
        sr_df = pd.read_csv(sv_region_file, dtype={'CHROM':str})
        sr_df['Peaks'] = sr_df['Peaks'].apply(ast.literal_eval)
        sv_region = sr_df.values.tolist()
    else:
        ...重算阈值 → bsaseq_plot(bulk_df)
```

设计意图：`sv_filtering` + `calculate_statistics` 是最慢的部分（尤其逐位点模拟），

把它固化在 `sv_fagz.csv` 里，之后调滑窗大小、调平滑参数、重新画图都不用重跑。

### ⚠️ 两个必须知道的副作用

1. **静默复用**：只要 `Results/sv_fagz.csv` 还在，改了 `-b`、`-p`、`-v`、`--parent`
   这些**影响统计量**的参数也不会生效 —— 因为整段计算被跳过了。
   要重算必须手动删掉 `Results/sv_fagz.csv`（和 `sv_fagz_di.csv`）。
2. **`threshold.txt` 是"缓存"**：README 里说得很明确：
   *The `threshold.txt` file needs to be deleted if starting over is desired
   (e.g, if the size of the sliding window is changed).*
   换了 `-s` 滑窗大小却不删 `threshold.txt`，程序会拿旧阈值去判新滑窗。

## 5.5 绘图函数为什么这么长

`bsaseq_plot()`（677–1119 行，约 440 行）和 `bsaseq_plot_sw()`（1121–1334 行，约 210 行）

加起来占了脚本的 1/3。它们长成这样是有原因的：

- 4 个面板 × N 条染色体，`axs[row, col]` 的索引在"单染色体"和"多染色体"两种情况下不同，
  所以每个绘图调用都写了两遍（`if len(selected_chrms) == 1:` 分支）
- 有亲本 / 无亲本两种模式下 ΔAF 面板画的东西不同（一条 vs 两条 CI 线）
- 平滑 / 不平滑又要各写一遍

输出格式一次写四种：

```python
fig.savefig(os.path.join(results, 'PyBSASeq.pdf'))
fig.savefig(os.path.join(results, 'PyBSASeq.eps'))
fig.savefig(os.path.join(results, 'PyBSASeq.svg'))
fig.savefig(os.path.join(results, 'PyBSASeq.png'), dpi=600)
```

排版控制参数（全部来自 `-g`）：

```python
fig.subplots_adjust(top=t_margin, bottom=b_margin, left=l_margin, right=r_margin,
                    hspace=h_gap, wspace=v_gap)
fig.suptitle(f'Genomic position ({xt_pro[2]})', y=g_pos, ha='center', va='bottom')
fig.text(0.001, 0.995, 'a', weight='bold', ...)     # 手动标注面板字母 a/b/c/d
```

`xticks_property()` 会根据最长的染色体自动选择坐标轴单位（Gb / ×100 Mb / ×10 Mb / Mb / ×100 kb），

按 3–7 个刻度的"好看"区间来定 `div_unit`。

## 5.6 代码结构上的优点与局限

**优点**

- 每一步过滤的中间产物都落盘，可审计、可回溯
- 三种入口档位让"调图"不需要重算，交互体验好
- `misc_info.csv` 台账完整，方便写方法和排查
- 向量化 Fisher（`fisher` 模块）让几十万位点的检验变成秒级

**局限**

- 单文件、无 `main()` 保护，函数无法复用
- 大量一行的全局变量（`fb_ad_ref`、`sg_y_ratio_list` …）靠"执行顺序"保证定义，
  函数之间是隐式耦合
- 大量注释掉的死代码（`impute_di()` 整个函数、`di_df` 分支、旧的阈值行）
- 绘图代码 4 个面板写 4 遍，改一个样式要改多处
- `-c` 的 help 文本说有 4 个值，实际只解析 3 个（见[第六章](ch06-cli-reference.md)）
- 论文描述的算法与当前代码有代差（savgol 平滑、DI、`--seg_step`、`--parent` 都是论文之后加的）

→ 下一章：[第六章、命令行参数全解](ch06-cli-reference.md)

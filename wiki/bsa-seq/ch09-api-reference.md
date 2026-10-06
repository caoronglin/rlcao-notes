---
title: 第九章、函数速查表
collection:
  profile: wiki
  id: bsa-seq
active_menu: bsa-seq
tags: [API, 函数, 参考, 源码]
---

# 第九章、函数速查表

`PyBSASeq.py` 共 **32 个函数**，全部定义在第 30–1706 行。本章按功能分组速查，

便于二次开发时定位。

>⚠️ **无法 `import`**：脚本没有 `if __name__ == '__main__':` 保护，
>`import PyBSASeq` 会立即执行全流程（解析 argv、读文件、跑模拟、画图）。
>要复用函数，只能把代码段单独拷出来。

## 9.1 工具函数

| 行号 | 函数 | 作用 |
| --- | --- | --- |
| 56 | `sort_chrm(l)` | 染色体排序：纯数字按 int 升序排在前，其余按字典序排在后 |
| 71 | `chrm_filtering(df, chromosome_list)` | 按 `min_frag_size` 把染色体/ scaffold 分成"可用"与"太小"两组；同时算出每条染色体的 `[起点, 终点]` |
| 86 | `select_chrms(df, rgn)` | 建立最终分析用的染色体列表。**两种模式**：`rgn[0] == -1` 用全部染色体；否则解析 `chrm,start,end` 三元组。副作用：写入全局 `chrm_prnt_dict`（染色体 → 绘图编号） |
| 205 | `bulk_names(df)` | 从表头里按 `.AD` / `_AD` 后缀识别混池 ID，同时写入全局 `header` |
| 223 | `xticks_property(l)` | 按最长染色体自动选择 x 轴刻度单位，返回 `[div_unit, rmzero, length_unit]`（Gb / ×100 Mb / ×10 Mb / Mb / ×100 kb） |

## 9.2 过滤链

| 行号 | 函数 | 作用 |
| --- | --- | --- |
| 257 | `sv_filtering(df)` | **结构层过滤**：非选定染色体 → NA → 多 ALT（3+ 丢弃 / 2-ALT 且 REF=0 降维保留）→ 单 ALT REF=0 丢弃 → InDel 记录（**保留**）→ LD=0 丢弃 → GT/AD 不一致丢弃 → 按 `ChrmSortID, POS` 排序 |
| 359 | `read_filter(df)` | **深度层过滤**：剔除 LD > mean+3σ（重复序列）和 LD < 3（低覆盖）的位点 |
| 372 | `sv_filtering_final(df)` | **质量层过滤**：GQ < `gq_value` → 两池 ALT/REF>2 → 两池 ALT/REF<0.5 → 调 `read_filter()`；另外落盘 `gt_nm.csv`、`highly_ed.csv`、`bulk_homo_svs.csv`（**不剔除**） |
| 1406 | `impute_di(df)` | 用"最近邻前值填充"处理 DI==0 的位点。**当前是死代码**（`di_df = False` 硬编码），函数体大量被注释 |

## 9.3 统计核心

| 行号 | 函数 | 作用 |
| --- | --- | --- |
| 403 | `g_statistic_array(o1, o3, o2, o4)` | **向量化 G 统计量**。参数顺序是陷阱：实际映射为 `o1,o2` 一行、`o3,o4` 一行（见 4.3）。用法：`np.seterr(all='ignore')` + `np.where` 处理除零与 log(0) |
| 1480 | `calculate_statistics(df)` | **主统计函数**：模拟空假设 AD → 算 AF / ΔAF → 算 G → 向量化 Fisher（真实 + 模拟）→ 逐位点阈值 `sv_ci` → 处理 `mirror_index` → dropna → 按固定列序写出 `sv_fagz.csv` |
| 1671 | `seg_statistics(df)` | 按 `['CHROM','Seg']` 分组求 AD 均值，再在段级重算 ΔAF / G / Fisher p |
| 1687 | `average_seg_statistics(df)` | 用 `range(int(seg_size/seg_step))` 个**不同偏移**重复分段，把多组结果取平均（降噪） |

## 9.4 模拟与阈值

| 行号 | 函数 | 作用 |
| --- | --- | --- |
| 30 | `sm_allelefreq(pop_struc, bulk_size, rep)` | 按群体结构模拟 H0 下的期望 ALT 频率（F2/RIL→0.5，BC→0.25） |
| 426 | `sv_ci(row)` | **逐位点**模拟：二项抽样 → ΔAF 数组、\|ΔAF\| 数组、G 数组 → 返回 `[ΔAF 的 CI, G 的 99.5 分位, \|ΔAF\| 的 99.5 分位]`。**仅在装了 `fisher` 时使用**（依赖向量化的 `g_statistic_array`） |
| 460 | `sv_ci_scipy(row)` | `fisher` 缺失时的兜底：逐行 `scipy.stats.fisher_exact`（真实 + 模拟）再调 `sv_ci` |
| 487 | `sv_ci_gw(df)` | 对重抽样样本的"逐位点阈值"取均值 → 图中品红色水平线用 |
| 505 | `thresholds_gw_approximate(df)` | `fisher` 缺失时的全局阈值：循环 `rep` 次，每次 `df.sample(sv_per_sw, replace=True)` 后逐位点模拟 |
| 527 | `thresholds_gw(df)` | **全局阈值（推荐路径）**：循环 `rep` 次重抽样 → 二项模拟 → 向量化 Fisher → 得到比值 / G / ΔAF / \|ΔAF\| 四个阈值 |
| 565 | `thresholds_sw(df)` | **滑窗特异阈值**：逻辑同 `thresholds_gw`，但样本是该滑窗内的全部 SV |
| 1603 | `gw_thresholds(df)` | 分发器：有 `fisher` 用 `thresholds_gw`，否则用 `thresholds_gw_approximate` |

## 9.5 独立性（DI）与 Durbin-Watson

| 行号 | 函数 | 作用 |
| --- | --- | --- |
| 624 | `di(df, frag_size)` | **抽稀**：按物理距离 `frag_size` 把 SV 分块，标 `DI=1`（块内代表位点）/ `DI=0`（从属）。同时把逐染色体的 `POS, POS1, DSTNC, DI` 写到 `temp/` |
| 1622 | `dw(df)` | 对每条染色体做 `OLS(LD ~ POS)`，检验残差的 Durbin-Watson 统计量；任一池 `DW < 1.5` 返回 `True`（存在自相关） |
| 1647 | `find_seg_size(df)` | 自动搜独立性距离：从 `read_length`（默认 100）起，每次 +50，直到 `dw(DI==1 子集)` 通过；上限硬编码 `max_seg_size = 1000`；若初始 `dw(df)` 已通过则返回 1 |

## 9.6 峰与验证

| 行号 | 函数 | 作用 |
| --- | --- | --- |
| 604 | `zeroSV(li)` | 空滑窗处理：列表非空则复制最后一个值，否则填 `'empty'` |
| 612 | `replace_zero(li)` | 把列表开头的 `'empty'` 占位符替换为最近的非空值 |
| 1336 | `peak(l)` | 在一个区域的峰列表里取 **sSV/totalSV 最大**（列表下标 5）的那个 |
| 1346 | `pk_list(l)` | 遍历 `sv_region`，选出代表峰；过滤条件：区域峰列表非空 **且** 滑窗数 > 10 |
| 1360 | `accurate_threshold_sw(l, df)` | **最终验证**：对每个候选峰用滑窗特异阈值 + 配对 t 检验，输出 4 个 `Significance_*` 列到 `BSASeq.csv` |
| 1390 | `accurate_threshold_gw(l, df)` | `fisher` 缺失时的简化验证：只用全局阈值比一次，不输出显著性列 |
| 1612 | `peak_verification(l, df)` | 分发器 + 打印进度 |

## 9.7 绘图

| 行号 | 函数 | 作用 |
| --- | --- | --- |
| 677 | `bsaseq_plot(df)` | **主绘图 + 滑窗计算 + 峰检测**：滑窗遍历 → 4 面板绘图 → 输出 `sliding_windows.csv`、`sv_region.csv`、`wrnLog.csv`、`num_sv_on_chr_file.csv`、`PyBSASeq.{pdf,eps,svg,png}` |
| 1121 | `bsaseq_plot_sw(df)` | **只重绘图**：读 `threshold.txt` + `sliding_windows.csv`，秒级完成。`-a True` 模式走这条路 |

两个绘图函数都会做一次 `min_sv = 500` 的过滤，但判断对象不同（见[第十章](ch10-troubleshooting.md) 的已知问题 #2）。

## 9.8 关键全局变量

因为全脚本共用一个命名空间，理解这些全局变量就理解了数据流。

### 路径类（1776–1789 行）

| 变量 | 值 |
| --- | --- |
| `path` | `os.getcwd()`，所有输出的根 |
| `results` | `Results/{YYYYmmdd_HHMMSS}/` |
| `filtering_path` | `Results/FilteredSVs/{样本名}/` |
| `oi_file` | `Results/sv_fagz.csv` |
| `oi_file_di` | `Results/sv_fagz_di.csv` |
| `ssv_file` | `Results/ssv.csv` |
| `sw_file` | `Results/sliding_windows.csv` |
| `sv_region_file` | `Results/sv_region.csv` |
| `thrshld_file` | `Results/threshold.txt` |
| `bulk_homo_svs_file` | `Results/bulk_homo_svs.csv` |
| `dgns_path` | `Results/{时间戳}/temp/` |
| `ed_file` | `Results/{时间戳}/highly_ed.csv` |

### 参数类（1739–1769 行）

| 变量 | 来源 | 默认 |
| --- | --- | --- |
| `num_ipfiles` | `len(input_files)` | 2 |
| `fb_size`, `sb_size` | `-b` | 430, 385 |
| `alpha`, `sm_alpha` | `-v` | 0.01, 0.05 |
| `rep` | `-r` | 10000 |
| `sw_size`, `incremental_step` | `-s` | 2000000, 10000 |
| `sr_length` | `-l` | 100 |
| `gq_value`, `min_SVs`, `mirror_index` | `-c` | 20, 1, 1 |
| `ncrmntl_stp` | `--seg_step` | 0 |
| `parent1` | `--parent` | `'none'` |
| `region` | `-e` | `[-1]` |
| `pop_struct` | `-p` | `'F2'` |
| `min_frag_size` | 派生 | `sw_size + smth_wl × incremental_step` = 2,510,000 |
| `percentile_ci` | 派生 | `[alpha×100/2, 100−alpha×100/2]` = [0.5, 99.5] |
| `percentile_th` | 派生 | 99.5 |
| `fb_freq`, `sb_freq` | `sm_allelefreq()` | ≈ 0.5（F2） |

### 硬编码常量

| 变量 | 值 | 说明 |
| --- | --- | --- |
| `min_sv` | **500** | 染色体 SV 数下限（plot） |
| `max_seg_size` | **1000** | DI 距离搜索上限 |
| `test` | **True** | 是否计算逐位点阈值（影响是否生成 `GS_Thrshld` 等列） |
| `di_df` | **False** | 是否用 DI 子集替代全量（死代码） |
| `height_ratio` | `[1, 0.8, 0.8, 0.8]` | 4 个面板的高度比 |
| `curve_color` / `sv_threshold_color` / `sw_threshold_color` | `'k'` / `'magenta'` / `'r'` | 黑线 = 数据、品红 = 位点阈值、红 = 滑窗阈值 |
| `ttl_sv_color` / `bg_color` | `'b'` / `'gray'` | 总 SV 蓝线 / 背景灰点 |

### 动态数据类

| 变量 | 产生位置 | 内容 |
| --- | --- | --- |
| `selected_chrms`, `chrmSzD`, `chrmSzL` | `select_chrms()` | 选中染色体、`[[起点,终点],…]`、长度列表 |
| `chrm_prnt_dict` | `select_chrms()` | 染色体 → 绘图编号（scaffold 的标题用它） |
| `header` | `bulk_names()` | 表头列表 |
| `fb_id`, `sb_id` | 主流程 | 两个混池的 ID 字符串 |
| `fb_ad`, `fb_gt`, `fb_gq`, `fb_ld`, `fb_af` … | 主流程 | 由 ID 拼出的列名 |
| `fb_ad_ref`, `fb_ad_alt`, `fb_lt_ref`… | `sv_filtering()` | 拆分 AD 后的派生列 |
| `sm_fb_ad_alt`, `sm_sb_ad_alt` … | `calculate_statistics()` | 模拟得到的空假设 AD |
| `misc` | 全程追加 | 运行台账，最终写 `misc_info.csv` |
| `sv_region` | `bsaseq_plot()` | 显著区域列表，最终写 `sv_region.csv` |
| `sw_data_frame` | `bsaseq_plot()` | 滑窗 DataFrame，最终写 `sliding_windows.csv` |
| `seg_size` | `find_seg_size()` | 独立性距离（控制 DI 抽稀） |
| `num_cols` | 主流程 | `[fb_ad_ref, fb_ad_alt, fb_ld, sb_ad_ref, sb_ad_alt, sb_ld]`，分组平均用 |

## 9.9 想改代码时改哪里

| 需求 | 改动位置 |
| --- | --- |
| 加/改过滤规则 | `sv_filtering()`（结构层）、`sv_filtering_final()`（质量层）、`read_filter()`（深度层） |
| 改统计量 | `g_statistic_array()`（G）、`calculate_statistics()`（ΔAF/Fisher/列序） |
| 改阈值口径 | `thresholds_gw()` / `thresholds_sw()` / `sv_ci()` |
| 改群体结构假设 | `sm_allelefreq()`（如要支持"回交到 ALT 亲本"，加一个 `prob=[0,0.5,0.5]`） |
| 改独立性判据 | `dw()`（模型）、`di()`（抽稀算法）、`find_seg_size()`（搜索步长/上限） |
| 改图 | `bsaseq_plot()` / `bsaseq_plot_sw()`，注意 4 个分支都要改 |
| 加命令行参数 | 1719–1737 行 `argparse` 段 + 1739–1769 行解包段 |
| 去掉"静默复用"行为 | 1813 行的 `if os.path.isfile(selected_oi_file):` 判断 |

→ 下一章：[第十章、排错、性能与已知问题](ch10-troubleshooting.md)

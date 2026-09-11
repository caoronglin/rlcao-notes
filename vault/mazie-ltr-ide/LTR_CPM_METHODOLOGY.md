# LTR 表达矩阵 — CPM 方法学文档 (v2.0)

> **项目**: 玉米 (Zea mays) 转座子 LTR 单细胞表达谱分析  
> **方法**: CPM (Counts Per Million) 归一化，从原始 UMI 计数直接计算  
> **参考基因组**: Zm-B73-REFERENCE-NAM-5.0  
> **生成时间**: 2026-04-30  
> **旧版 (log1p)**: 已归档至 `log1p/` 目录

---

## 为何不用 log1p / TPM

| 方案 | 问题 | 采用 CPM 的原因 |
|------|------|---------------|
| **log1p** | 非线性压缩、负值难解、零/负值语义模糊 | ❌ 先归档 |
| **TPM** | 需要基因长度（不可得），且 UMI 已是转录本级别计数，不需要长度归一化 | ❌ 理论上不适合 scRNA-seq |
| **CPM** | UMI ÷ 总 UMI × 10⁶，值直接可解释为"每百万转录本中的拷贝数" | ✅ 10x Genomics / Seurat / Scanpy 标准推荐 |

来源: Nature Communications 2025, scuttle 文档, 10x Genomics 官方指南

---

## 数据流

```
h5ad (.raw.X: 原始 UMI 计数, per cell, sparse CSC)
        ↓
筛选 LTR 基因 (var_names 包含 "LTR")
        ↓
CPM = UMI_count / total_UMI_in_cell × 1,000,000
        ↓
mean CPM across all cells → 每个 LTR 每个样本一个值
        ↓
构建 22,322 × 40 矩阵 (行 = LTR, 列 = 样本)
        ↓
计算: per-sample mean → per-tissue mean → total mean
        ↓
按 total_expression (mean CPM across 40 samples) 排序
```

### 与旧版 log1p 的关键差异

| 维度 | 旧版 (log1p) | 新版 (CPM) |
|------|-------------|-----------|
| **数据源** | SRR*_expression_simple.csv (cluster 聚合) | h5ad .raw.X (per-cell UMI) |
| **归一化** | log1p + center (0 均值) | CPM (library size) |
| **聚合** | cluster 求和 | 全细胞均值 |
| **值域** | [-3, +3] | [0, ~800] |
| **负值** | 大量 (13.7%) | 无 (CPM ≥ 0) |
| **可解释性** | 抽象 (需解释"负值=抑制") | 直观 (CPM = 每百万拷贝数) |
| **Top 1** | Gypsy_LTR_25303 (21.8 log-space) | Copia_LTR_25150 (249.6 CPM) |

---

## 样本概况

| 指标 | 数值 |
|------|------|
| 总样本数 | 40 |
| 总细胞数 | 504,500 |
| 唯一 LTR 条目 | 22,322 |
| 表达 LTR (mean CPM > 0) | 22,322 (100%) |
| 组织类型 | 6 |

---

## 输出文件清单

| 文件 | 内容 | 维度 |
|------|------|------|
| `ltr_expression_matrix_cpm.csv` | **总表**: 所有 LTR，含 total/tissue/sample 均值 | 22,322 × 49 |
| `ltr_expression_matrix_cpm_top800.csv` | Top 800 矩阵 | 800 × 49 |
| `ltr_expression_matrix_cpm_top150.csv` | Top 150 矩阵 | 150 × 49 |
| `ltr_cpm_top800_names.txt` | Top 800 LTR 名称列表 | 800 行 |
| `ltr_cpm_tissue_summary.csv` | 各组织 LTR 表达汇总 | 22,322 × 7 |

### 总表列定义 (49 列)

| 列 | 含义 |
|----|------|
| `total_expression` | mean CPM across all 40 samples |
| `max_expression` | max mean CPM in any single sample |
| `expressing_samples` | 非零样本数 |
| `tissue_*_mean` | 该组织内所有样本的 mean CPM |
| `SRR*` | 该样本中该 LTR 的 mean CPM (全细胞平均) |

---

## Top 10 LTR (按 CPM 排序)

| # | LTR | Total (mean CPM) | Max (单样本) | 表达样本数 |
|---|-----|-----------------|-------------|----------|
| 1 | Copia_LTR_retrotransposon_25150_T001 | 249.6 | 797.5 | 40/40 |
| 2 | Gypsy_LTR_retrotransposon_40247_T001 | 205.6 | 723.1 | 36/40 |
| 3 | Gypsy_LTR_retrotransposon_9765_T001 | 190.9 | 727.0 | 30/40 |
| 4 | LTR_retrotransposon_32182_T001 | 185.1 | 550.3 | 40/40 |
| 5 | LTR_retrotransposon_47797_T001 | 169.8 | 626.4 | 37/40 |
| 6 | Copia_LTR_retrotransposon_6978_T001 | 154.5 | 728.2 | 36/40 |
| 7 | LTR_retrotransposon_33071_T001 | 150.1 | 443.3 | 40/40 |
| 8 | LTR_retrotransposon_32772_T001 | 138.3 | 490.1 | 40/40 |
| 9 | LTR_retrotransposon_39882_T001 | 131.4 | 606.3 | 37/40 |
| 10 | Gypsy_LTR_retrotransposon_43249_T001 | 130.2 | 327.6 | 36/40 |

---

## CPM 值解读

- **CPM = 250**: 在 ~4,000 总 UMIs 的细胞中，该 LTR 平均贡献约 1 个 UMI
- **CPM = 1**: 稀疏表达，每 1,000 个细胞中可能仅个别细胞有 1 个 UMI
- **与 log1p 的核心区别**: CPM 是线性尺度——值翻倍意味着表达量翻倍。log1p 是对数尺度，值从 1→2 和 10→11 压缩率完全不同。

---

## 复现

```python
import scanpy as sc
import numpy as np
import json

with open("log1p/sample_statistics.json") as f:
    stats = json.load(f)

adata = sc.read_h5ad("<SRR>_processed.h5ad")
raw = adata.raw.X  # sparse CSC
ltr_mask = adata.raw.var_names.str.contains("LTR", case=False)
ltr_sub = raw[:, ltr_mask].toarray()
total_umi = np.array(raw.sum(axis=1)).flatten()
cpm = ltr_sub / total_umi[:, None] * 1e6
mean_cpm = cpm.mean(axis=0)
```

---

*生成的脚本: `build_ltr_cpm_matrix.py`（已在 `output/` 目录）*

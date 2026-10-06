---
title: "SoyBase 大豆基因搜索流程"
date: 2026-09-18
updated: 2026-09-18
collection:
  profile: notebook
  id: bio
---
# SoyBase 大豆基因搜索流程

>以 `Glyma.08G293900` 为例，含生物胁迫表达分析

---

## 流程总览

```
SoyBase 首页 → 基因搜索 → 基本信息(功能/位置/GO)
     ↓
CoNekT → 表达谱(组织+条件) → 下载表达矩阵
     ↓
共表达网络 → 功能推断 → 胁迫关联分析
     ↓
外部搜索(Exa) → 验证/补充文献证据
```

---

## Stage 1：基因基本信息

### 1.1 搜索入口

| 路径 | URL | 说明 |
|:---|:---|:---|
| 首页基因搜索 | `https://www.soybase.org/` | 首页中部 "Gene identifier search" 输入框 |
| 专用搜索页 | `https://www.soybase.org/tools/search/gene.html` | 支持多条件筛选（Genus/Species/Strain/Identifier/Description/Gene Family） |

### 1.2 输入格式

```
Glyma.08G293900    ← 简化格式（推荐，新版 SoyBase 识别良好）
glyma.Wm82.gnm2.ann1.Glyma.08G293900  ← 完整带前缀格式（CoNekT/GlycineMine 需要）
```

### 1.3 获取信息

| 字段 | 获取内容 |
|:---|:---|
| **基因名** | Glyma.08G293900 |
| **完整 ID** | glyma.Wm82.gnm2.ann1.Glyma.08G293900 |
| **蛋白功能** | phospholipid-transporting ATPase-like protein |
| **基因家族** | legfed_v1_0.L_90LDTK |
| **PanGene Set** | Glycine.pan4.pan39201 |
| **染色体位置** | Gm08: 40.8-40.9 Mb（gnm2，负链） |
| **InterPro 结构域** | IPR001757（P-type ATPase）、IPR023214（HAD-like domain） |
| **GO 注释** | GO:0004012（磷脂转位ATP酶活性）等 9 项 |

### 1.4 跨版本位置对比

| 注释版本 | 位置 | 链 |
|:---|:---|:---:|
| Wm82.gnm2.ann1 | Gm08:40,887,462–40,910,754 | (-) |
| Wm82.gnm4.ann1 | Gm08:40,305,378–40,328,753 | (-) |
| Wm82.gnm6.ann1 | Gm08:43,324,898–43,348,323 | (-) |

>**注意**：不同基因组版本坐标不一致，需根据所用注释版本选择。

---

## Stage 2：表达谱数据

### 2.1 CoNekT 表达平台

| 操作 | URL 模板 |
|:---|:---|
| 基因直达 | `https://conekt.legumeinfo.org/sequence/find_forLIS/{完整基因ID}` |
| 详细表达页 | `https://conekt.legumeinfo.org/profile/view/{内部ID}` |
| 下载表达数据 | `https://conekt.legumeinfo.org/profile/download/plot/{内部ID}` |

实际操作步骤：

1. 用完整 ID 访问 CoNekT → 获得 `内部ID`（如 49431）
2. 访问 `/profile/view/{内部ID}` → 获取组织特异性指标（SPM/entropy/tau）
3. 访问 `/profile/download/plot/{内部ID}` → 下载 TSV 格式表达矩阵

### 2.2 获取的数据

| 条件 | TPM |
|:---|---:|
| 12HA1_IN_RH（侵染12h根毛） | 1.64 |
| 12HA1_UN_RH（未侵染12h根毛） | 1.43 |
| 24HA1_IN_RH | 1.39 |
| 24HA1_UN_RH | 1.45 |
| 48HA1_IN_RH | 1.62 |
| 48HA1_UN_RH | 2.51 |
| 48HA1_Scrip_Root | 0.98 |
| Stacey_Flower | 3.36 |
| Stacey_Root_Tip | 2.67 |
| Stacey_Apical_Meristem | 2.42 |
| Stacey_Leaves | 1.98 |
| Stacey_Root | 1.61 |
| Stacey_Nodule | 1.34 |
| Stacey_Green_Pods | 1.06 |

**关键指标**：SPM=0.62（花偏好），tau=0.4，基因标记为 **低丰度**

### 2.3 CoNekT 局限性

- 大豆数据集主要基于 **组织图谱**（Stacey 2010 等），不包含大规模生物胁迫专项实验
- "HA1" 根毛侵染实验可能是当前唯一的侵染相关表达数据
- 对于胁迫特异性查询，CoNekT 不如专门的胁迫表达数据库

---

## Stage 3：共表达网络

### 3.1 下载链接

```
https://conekt.legumeinfo.org/network/download/neighbors/{network_id}
```

>`network_id` 从 CoNekT 基因页面的 "Co-expression Networks" 区域获取（如 69944）。

### 3.2 数据格式

TSV 文件，列含义：

| 列 | 说明 |
|:---|:---|
| Sequence | 共表达基因 ID |
| Description | 功能描述 |
| Alias | 别名 |
| PCC | Pearson 相关系数 |
| hrr | 排名（Highest Reciprocal Rank） |

### 3.3 Top 共表达基因解读策略

1. 按 PCC 降序排列，取 Top 10-20
2. 查看功能描述中是否包含：defense, resistance, stress, kinase, TF, DNA repair 等
3. 重点关注 **hrr ≤ 30** 的基因（双向共表达验证）

---

## Stage 4：拓宽搜索

### 4.1 其他 SoyBase 表达资源

| 资源 | URL | 适用场景 |
|:---|:---|:---|
| Expression Resources 汇总 | `https://www.soybase.org/tools/expression/` | 查看全部可用表达工具 |
| BAR eFP 浏览器 | `https://bar.utoronto.ca/efpsoybean/` | 可视化组织表达（发育阶段） |
| GlycineMine 表达 | `https://mines.legumeinfo.org/glycinemine/` | 表达柱状图 + 多基因比较 |
| JBrowse 表达轨迹 | `https://www.soybase.org/assets/js/jbrowse/` | 基因组浏览器查看表达 track |
| Legacy 表达实验 | `https://legacy.soybase.org/experiments/` | 旧版实验数据集 |
| **Soybean Expression Atlas v2** | `https://soyatlas.venanciogroup.uenf.br/` | **5,481 样本，最全面** |
| DivBrowse | `https://divbrowse.soybase.org/` | 变异+表达联合浏览 |

### 4.2 外部文献搜索

用 `Exa web_search` 搜索 `"Glyma.08G293900" expression soybean`：

- 若直接命中 → 提取文献中该基因的胁迫表达数据
- 若无直接命中 → 搜索相关胁迫类型 + soybean RNA-seq，间接推断
- 查看 meta-analysis 文献（如 2025 Mol Genet Genomics 的生物/非生物胁迫交叉分析）

### 4.3 SoyBase Datastore 原始表达数据

```
https://data.soybase.org/Glycine/max/expression/
```

包含按实验分组的表达矩阵（如 Pelaez-Vico 2023 的多因子胁迫实验：GSE237798）。

---

## Stage 5：综合推断

### 5.1 当直接胁迫数据不足时的分析框架

```
基因功能注释 → 已知的同源基因功能
     +
组织表达偏好 → 最可能发挥功能的组织/条件
     +
共表达网络 → 功能关联基因的胁迫响应特征
     +
侵染表达趋势 → 上调/下调的生物学解释
     ↓
综合推断胁迫角色（需标注不确定性）
```

### 5.2 本例关键推断链条

1. **功能**：flippase（磷脂翻转酶）→ 维持膜不对称 → 非经典防御基因
2. **表达**：花中最高 → 生殖器官膜动态是主功能
3. **侵染趋势**：48h 被下调（-35%）→ 持续侵染抑制膜维护
4. **共表达**：与 Piezo 机械通道强共表达（PCC=0.954）→ 膜稳态协同模块
5. **文献**：未被任何已发表胁迫 DEG 列表收录 → 低丰度+间接作用

---

## 可复用工具链速查

| 步骤 | 工具 | 输入 | 输出 |
|:---|:---|:---|:---|
| 基因搜索 | SoyBase `/tools/search/gene.html` | Glyma.XXGXXXXXX | 功能/位置/GO/家族 |
| 表达谱 | CoNekT `/sequence/find_forLIS/{id}` | 完整带前缀 ID | TPM 矩阵 + 组织特异性 |
| 共表达 | CoNekT `/network/download/neighbors/{id}` | network_id | PCC 排序共表达列表 |
| 胁迫数据 | SoyAtlas `/` 或 Exa web_search | 基因 ID | 多实验表达矩阵 |
| 文献验证 | Exa `"{gene_id}" stress soybean` | 基因 ID | 相关论文 |

---

## 踩坑记录

1. **新版 SoyBase 首页搜索框**使用 UIkit 框架，简单的 `input.value = xxx` + `click()` 不一定触发搜索事件 → 改用专用搜索页 `/tools/search/gene.html`
2. **CoNekT 表达图表是 JS 渲染**，无法通过 fetch 获取 → 直接下载 TSV 数据文件 `/profile/download/plot/{id}`
3. **Soybean Expression Atlas v2** 可能返回 Bad Gateway（2026-06 测试）→ 备选方案：直接访问 SoyBase Datastore 原始文件
4. **基因名称前缀问题**：SoyBase 新站接受 `Glyma.08G293900` 简化格式；CoNekT/GlycineMine 需要 `glyma.Wm82.gnm2.ann1.Glyma.08G293900` 完整格式
5. **不同基因组版本位置不同**：gnm2/gnm4/gnm6 的坐标差异可达 2-3 Mb，需注意版本一致性

---

*整理日期：2026-06-23*

*数据来源：SoyBase (soybase.org) + CoNekT (conekt.legumeinfo.org)*

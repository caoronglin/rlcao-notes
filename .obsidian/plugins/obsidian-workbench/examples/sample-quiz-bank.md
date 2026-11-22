---
title: 生信与基因组学核心自测
desc: 放入 Vault 后可在「知识自测」视图直接开始，支持单选、多选、判断与 SM-2 错题复习
---

## GEO 数据库中，一个 GSE 编号通常对应什么？
- [ ] A. 单个样本的测序数据
- [x] B. 一组样本的完整实验（Series）
- [ ] C. 一个基因的表达量
- [ ] D. 一个物种的基因组
> 解析：GSE = GEO Series，是一组相关样本构成的完整实验单元；单个样本用 GSM，平台用 GPL。
> 标签：GEO, 生信基础

## 以下哪些属于 scRNA-seq 上游比对与定量工具？（多选）
- [x] A. STARsolo
- [x] B. Cell Ranger
- [ ] C. Scanpy
- [x] D. Kallisto | bustools
> 解析：STARsolo、Cell Ranger 与 Kallisto | bustools 均负责 reads 比对与表达矩阵定量；Scanpy 是 Python 下游分析库。
> 标签：scRNA-seq, 工具链

## GWAS 曼哈顿图的纵轴通常是 −log10(p)，用来放大极小 p 值的显著性差异。
- [x] A. 正确
- [ ] B. 错误
> 解析：纵轴取 −log10(p) 可把极小的 p 值放大为显著峰值，便于观察突破全基因组阈值的位点。
> 标签：GWAS, 可视化

---
title: PyBSASeq 项目解读目录
collection:
  profile: wiki
  id: bsa-seq
active_menu: bsa-seq
tags: [BSA-Seq, QTL, 生信, Python, PyBSASeq]
---

# PyBSASeq 项目解读

本笔记解读 BSA-Seq 分析工具 **PyBSASeq**（显著结构变异方法 / significant SV method）的源码、算法与实战用法。

- 代码位置：`/mnt/smb/t25ronglin/code/bsa-seq/`
- 核心脚本：`PyBSASeq.py`（2089 行，version 3.1415）
- 参考论文（本地 PDF 在 `docs/refernces/`）：
  1. Zhang J, Panthee DR. **PyBSASeq: a simple and effective algorithm for bulked segregant analysis with whole-genome sequencing data.** *BMC Bioinformatics* 21, 99 (2020). doi:10.1186/s12859-020-3435-8
  2. Zhang J, Panthee DR. **Next-generation sequencing-based bulked segregant analysis without sequencing the parental genomes.** *G3* (2021). doi:10.1093/g3journal/jkab400
  3. Sonsungsan P, *et al.* **A k-mer-based bulked segregant analysis approach to map seed traits in unphased heterozygous potato genomes.** *G3* 14(4), jkae035 (2024). doi:10.1093/g3journal/jkae035（相关方法，见第十一章）

## 笔记目录

### 入门篇

- [第一章、BSA-Seq 与三种分析方法的原理](ch01-background.md)
- [第二章、项目结构与运行环境](ch02-project-structure.md)
- [第三章、输入数据与上游 GATK4 流程](ch03-input-data.md)

### 原理篇

- [第四章、核心算法：显著 SV 方法与阈值模拟](ch04-algorithm.md)
- [第五章、主流程源码走读](ch05-pipeline.md)

### 使用篇

- [第六章、命令行参数全解](ch06-cli-reference.md)
- [第七章、输出文件与结果解读](ch07-outputs.md)
- [第八章、论文案例：水稻冷害 QTL 与降采样验证](ch08-case-study-rice.md)

### 参考篇

- [第九章、函数速查表](ch09-api-reference.md)
- [第十章、排错、性能与已知问题](ch10-troubleshooting.md)
- [第十一章、相关方法：无参考基因组的 k-mer BSA](ch11-related-methods-kmer.md)

## 一句话总结

PyBSASeq 把 BSA-Seq 的检测单元从「单个 SNP」升级为「染色体区间内的显著 SV 富集比例」，

用 Fisher 精确检验筛出与性状关联的显著 SV（sSV），再用滑窗统计 sSV/totalSV 比值、

Δ(AF)、G 统计量三条曲线定位 QTL —— 在较低测序深度下仍能保持高检出率。

---
title: "trim-glore"
origin: yuque
book: "学习笔记"
yuque_id: 226512652
yuque_slug: oadhfxzp88ep4vvz
updated: 2025-07-03T14:14:00
url: https://www.yuque.com/docs-crl/note/oadhfxzp88ep4vvz
catalog: "大学/生信学习/软件介绍"
tags: [yuque]
---

# trim-glore

# Trim-Galore 使用指南

Trim-Galore 是一个功能强大的工具，用于对高通量测序数据（如 Illumina 测序数据）进行质量控制和预处理。它结合了 FastQC（用于质量评估）和 Cutadapt（用于 adapter trimming），能够自动完成从质量评估到 adapter 剪切的整个流程。

---

## 一、功能说明

Trim-Galore 的主要功能包括：

1. **Adapter Trimming**：去除测序中的 adapter 序列。
2. **Quality Trimming**：根据质量分数修剪低质量碱基。
3. **Read Filtering**：移除短片段或低质量的 reads。
4. **Quality Assessment**：生成 FastQC 质量报告。  
   Trim-Galore 支持多种测序数据类型，包括单端（SE）和双端（PE）数据。

---

## 二、使用方法

### 1. 安装

Trim-Galore 依赖于 Python 和 Perl 环境。以下是安装步骤：

```bash
# 安装依赖工具
conda install -c bioconda trim-galore
conda install -c bioconda fastqc
conda install -c bioconda cutadapt
```

### 2. 基本运行流程

运行 Trim-Galore 的一般流程如下：

```bash
trim_galore [options] <input_file>
```

---

## 三、常用参数详解

| 参数 | 说明 |
| --- | --- |
| `-a` 或 `--adapter` | 指定 adapter 序列。例如：`-a "AGATCGGAAGAGCGGTTC"` |
| `--fastqc` | 启用 FastQC 质量评估。 |
| `--quality 20` | 设置质量修剪阈值（默认为 20）。 |
| `--length 50` | 设置保留 reads 的最小长度（默认为 50）。 |
| `--output_dir` | 指定输出目录。 |
| `--paired` | 处理双端数据。 |
| `--gzip` | 输出压缩文件（.gz）。 |
| `--phred64` | 指定测序数据的质量编码格式（如 Illumina 1.8+ 格式）。 |
| `-o` 或 `--output` | 指定输出文件名。 |

### 示例

#### 单端数据处理：

```bash
trim_galore --fastqc --quality 20 --length 50 --output_dir ./trimmed_data input.fastq
```

#### 双端数据处理：

```bash
trim_galore --fastqc --paired --quality 20 --length 50 --output_dir ./trimmed_data input_1.fastq input_2.fastq
```

---

## 四、结果解读

Trim-Galore 处理完成后，会生成以下类型的文件：

### 1. 处理后的 FASTQ 文件

- 修剪后的 reads 存储在 FASTQ 文件中，文件名通常以 `trimmed` 或 `_trimmed` 后缀命名。
- 如果启用了 `--gzip`，文件会以 `.gz` 压缩格式输出。

### 2. FastQC 报告

- 每个输入文件都会生成一个 HTML 格式的 FastQC 报告。
- 报告中包含碱基质量分布、GC 含量、adapter 检测等信息。

### 3. 日志文件

- 包含处理过程中的详细信息，如处理时间、reads 数量统计等。

---

## 五、常见问题解答

### 1. **内存不足**

- **原因**：处理大规模数据时，内存不足可能导致程序崩溃。
- **解决方法**：

### 2. **Adapter 未正确识别**

- **原因**：默认 adapter 序列可能与实际使用的不符。
- **解决方法**：使用 `-a` 参数指定正确的 adapter 序列。

### 3. **输出文件为空**

- **原因**：输入文件中所有 reads 都被过滤掉（如质量过低或长度过短）。
- **解决方法**：降低质量阈值或增加保留 reads 的最小长度。

### 4. **双端数据处理失败**

- **原因**：输入文件配对不正确。
- **解决方法**：确保输入文件正确配对，并使用 `--paired` 参数。

---

## 六、总结

Trim-Galore 是一个高效且灵活的工具，能够快速完成测序数据的预处理和质量控制。通过合理设置参数，用户可以实现高质量的 reads 修剪和过滤，从而为后续分析奠定良好的基础。

## 七、参考文档

📎 [Trim Galore工具介绍与使用指南.pdf](https://www.yuque.com/attachments/yuque/0/2025/pdf/25845402/1751552028074-9b0c540b-8466-46f9-921d-9c010631be64.pdf)

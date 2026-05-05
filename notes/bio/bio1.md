---
abbrlink: ''
banner: ''
categories:
- - 启航计划
date: '2025-08-01T17:49:24.513485+08:00'
excerpt: 任务1:从Ensembl数据库下载最新的人类参考基因组序列（fasta格式）以及对应的注释文件（GFF格式） 任务2:下载人类GM2878的转录组测序数据（GEO:GSE88583） https://www.encodeproject.org/experiments/ENCSR843RJV/ 并进行质量检测（FastQC）和过滤（TrimGalore） 一、准备 （1） 所需软件  📎MobaX...
menu_id: notes
notebook: bio
sticky: ''
tags:
- 生信
title: 任务一
topic: ''
updated: '2025-08-02T10:21:23.162+08:00'
wiki: ''
---
**任务1:从Ensembl数据库下载最新的人类参考基因组序列（fasta格式）以及对应的注释文件（GFF格式）**

**任务2:下载人类GM2878的转录组测序数据（GEO:GSE88583）**

[https://www.encodeproject.org/experiments/ENCSR843RJV/](https://www.encodeproject.org/experiments/ENCSR843RJV/)

**并进行质量检测（FastQC）和过滤（TrimGalore）**

# 一、准备

## （1） 所需软件

1. [📎MobaXterm\_Installer\_v25.2.zip](https://www.yuque.com/attachments/yuque/0/2025/zip/25845402/1751449247498-d0046950-d04f-4523-b2ba-9a9bda437a12.zip)连接服务器使用
2. [fastqc](https://www.bioinformatics.babraham.ac.uk/projects/fastqc/)进行质量分析
3. [trim\_galore](https://www.bioinformatics.babraham.ac.uk/projects/trim_galore/)进行过滤

**（2）所需资源**

### 1）人类基因组

1. [Homo\_sapiens.GRCh38.114.gtf](https://pan.quark.cn/s/0d6fc4ee0c96)（gtf 解释文件）
2. [Homo\_sapiens.GRCh38.dna.primary\_assembly.fa](https://pan.quark.cn/s/39ccc1dfb713)（人类基因组）

### 2）GM12828 基因

1. [ENCLB518OAU](https://www.encodeproject.org/files/ENCFF824LLV/@@download/ENCFF824LLV.fastq.gz)
2. [ENCLB919DEB](https://www.encodeproject.org/files/ENCFF974EKR/@@download/ENCFF974EKR.fastq.gz)

## （2）安装 miniconda

### 1）安装

```bash
[[安装miniconda]]
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
[[配置环境变量]]
echo 'export PATH="～/miniconda3/bin: $ PATH"' >> ～/.bashrc
source ～/.bashrc
[[验证安装]]
conda --version
[[创建虚拟环境]]
conda create -n myenv
conda activate myenv [[激活环境，配置软件包]]
```

### 2）换源

```bash
echo 'channels:
  - defaults
show_channel_urls: true
default_channels:
  - https://mirror.lzu.edu.cn/anaconda/pkgs/main
  - https://mirror.lzu.edu.cn/anaconda/pkgs/r
  - https://mirror.lzu.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirror.lzu.edu.cn/anaconda/cloud
  pytorch: https://mirror.lzu.edu.cn/anaconda/cloud
' | tee ~/.condarc
conda config --set custom_channels.bioconda https://mirror.lzu.edu.cn/anaconda/cloud/
[[bioconda是常用源，非常重要，大部分软件需要从这里下载]]
```

### 3）利用 conda 安装软件

```bash
conda create -n myenv python=3.6#创建环境，一定要指定python版本
conda activate myenv [[激活环境]]
conda install -c bioconda fastqc trim-galore snakemake
```

# 二、 编写 snakemake

**使用 snakemake 工作流，可以简便工作流程，此处不过多解释 Snakemake 的编写规则**

## （1） 创建 Snakefile 文件（utf-8 编码）

```python
# 定义输入输出路径
SAMPLES = ["ENCFF824LLV", "ENCFF974EKR"]
INPUT_DIR = "data"
FASTQC_OUTPUT_DIR = "results/fastqc"
TRIMMED_OUTPUT_DIR = "results/trimmed"
configfile: "config/config.yaml"

rule all:
    input:
        expand(f"{FASTQC_OUTPUT_DIR}/{{sample}}_fastqc.html", sample=SAMPLES),
        expand(f"{TRIMMED_OUTPUT_DIR}/{{sample}}_trimmed.fq.gz", sample=SAMPLES),
        expand(f"{TRIMMED_OUTPUT_DIR}/{{sample}}_trimming_report.txt", sample=SAMPLES)

rule fastqc_original:
    input:
        f"{INPUT_DIR}/{{sample}}.fastq.gz"
    output:
        html=f"{FASTQC_OUTPUT_DIR}/{{sample}}_fastqc.html",
        zip=f"{FASTQC_OUTPUT_DIR}/{{sample}}_fastqc.zip"
    shell:
        """
        mkdir -p {FASTQC_OUTPUT_DIR}
        fastqc --outdir {FASTQC_OUTPUT_DIR} {input}
        """

rule trim_galore:
    input:
        f"{INPUT_DIR}/{{sample}}.fastq.gz"
    output:
        trimmed=f"{TRIMMED_OUTPUT_DIR}/{{sample}}_trimmed.fq.gz",
        report=f"{TRIMMED_OUTPUT_DIR}/{{sample}}_trimming_report.txt"
    params:
        adapter="CTGTCTCTTATACACATCT"  # 根据日志自动检测到的Nextera接头
    threads: 4
    shell:
        """
        mkdir -p {TRIMMED_OUTPUT_DIR}
        trim_galore \
            --gzip \
            --adapter {params.adapter} \
            --length 20 \
            --output_dir {TRIMMED_OUTPUT_DIR} \
            --cores {threads} \
            {input}
        """
```

**Snakefile 一定要按照格式书写**

## （2）配置文件

```yaml
trim_galore:
  cores: 8  # 根据硬件调整核心数
name: rnaseq-pipeline
channels:
  - bioconda
  - conda-forge
  - defaults
dependencies:
  - python=3.10
  - fastqc=0.12.1
  - trim-galore=0.6.9
  - snakemake=8.16.0
```

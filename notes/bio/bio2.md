---
abbrlink: 34fab8c5
banner: ''
categories:
  - - 启航计划
date: '2025-08-01T17:54:48.482502+08:00'
excerpt: "使用STAR（https://github.com/alexdobin/STAR?tab=readme-ov-file）将RNA-seq的reads比对到参考基因组上，比对对象是已经经过过滤后的文件\_一、准备\_（1）安装软件\_1）二进制安装\_STAR_2.7.11b.zip\_环境变量处理\_2）conda\_安装\_conda\_create\_-n\_myenv\_conda\_activate\_myenv\_c..."
menu_id: ''
notebook: bio
sticky: ''
tags: [生信]
title: 任务二
topic: ''
updated: '2025-08-01T17:55:37.694+08:00'
wiki: ''
---

**使用STAR（**[https://github.com/alexdobin/STAR?tab=readme-ov-file](https://github.com/alexdobin/STAR?tab=readme-ov-file)）将RNA-seq的reads比对到参考基因组上，比对对象是已经经过过滤后的文件

# 一、准备

## （1）安装软件

### 1）二进制安装

[STAR\_2.7.11b.zip](https://www.yuque.com/attachments/yuque/0/2025/zip/25845402/1751449410659-67b5262f-4e82-4b79-af95-b17a1bc14196.zip)

### 环境变量处理

**2）conda 安装**

```bash
conda create -n myenv
conda activate myenv
conda install -c bioconda star
```

# 过程

## （1）生成索引文件（耗时巨大）

```bash
STAR \
--runThreadN 12 \
--genomeDir /data1/caoronglin/data/human \
--readFilesIn /data1/caoronglin/data/human/data/GM12878/results/trimmed/ENCFF481BWJ_trimmed.fq.gz \
--outFileNamePrefix /data1/caoronglin/data/human/output/ENCFF481BWJ_ \
--outSAMtype BAM SortedByCoordinate \
--outFilterType BySJout \
--outFilterMultimapNmax 20 \
--alignSJoverhangMin 8 \
--alignSJDBoverhangMin 1 \
--outSAMattrRGline "ID:GM12878 SM:GM12878 LB:library1 PU:unit1 PL:ILLUMINA" \
--outSAMmapqUnique 60 \
--limitBAMsortRAM 20000000000 \
--readFilesCommand "zcat" \
--outReadsUnmapped Fastx \        
--quantMode GeneCounts \          
--sjdbOverhang 99
```

**（2）开始比对**

```bash
STAR \
    --runThreadN 12 \
    --genomeDir /data1/caoronglin/data/human \
    --readFilesIn /data1/caoronglin/data/human/data/GM12878/results/trimmed/ENCFF974EKR_trimmed.fq.gz \
    --outFileNamePrefix /data1/caoronglin/data/human/output/ENCFF974EKR_ \
    --outSAMtype BAM SortedByCoordinate \
    --outFilterType BySJout \
    --outFilterMultimapNmax 20 \
    --alignSJoverhangMin 8 \
    --alignSJDBoverhangMin 1 \
    --outSAMattrRGline ID:GM12878 SM:GM12878 LB:library1 PU:unit1 PL:ILLUMINA \
    --outSAMmapqUnique 60 \
    --limitBAMsortRAM 20000000000 \
    --readFilesCommand zcat \
    --outReadsUnmapped Fastx \
    --quantMode GeneCounts \
    --sjdbOverhang 99 \
```

## （3） 比对结果

[ENCFF974EKR\_Log.final.out.txt](https://www.yuque.com/attachments/yuque/0/2025/txt/25845402/1751549960203-676ab933-2e6f-452a-9dc4-4427d1e4a9e7.txt)

[ENCFF824LLV\_Log.final.out.txt](https://www.yuque.com/attachments/yuque/0/2025/txt/25845402/1751549960238-80fa27a5-ad9d-431a-8f76-415ef5863e2b.txt)

# 创建环境

	以下列出相关环境安装（采用mamba）

## 配置进化树安装

```shell
# 建树与比对（一次性装齐）
mamba install -c bioconda iqtree mafft trimal tesorter seqkit
```

如果还未安装`mamba`

```shell
# 方法一 如果已安装conda，使用conda安装mamba 
conda install -n base -c conda-forge mamba
# 方法二 从头安装mamba
curl -L -O "https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-$(uname)-$(uname -m).sh"
```

## 安装EDTA

	EDTA可以通过基因组'探寻' LTR

```shell
# 因为edta环境过于复杂，建议重新配置环境
mamba create -n edta -c bioconda edta
mamba activate edta
```

# 使用EDTA探寻LTR基因

	此方法可以获得最新的LTR

## 使用已有LTR文件

```shell
wget https://raw.githubusercontent.com/GallVp/EDTA/master/database/maizeTE11122019
```

以下是该文件的部分内容（该文件过于老旧）

```markdown
>Hip5_12#DNA/Helitron
TCTGTACTACTCTATTAAGAACCTAATGTGGGCACCGGTGCTACCATAGCTTCACCCTTTCCACATCCAGCGCCCGCAAAAAATAGTGTCGAACGAGCAATCGAACCCACACCCCTTTGCTCCACAAATTTGGGGCTAACCACTAGACAACACATAACTTAGTGTTTAGAAATAAACAATAATTATATTTGTAGCCTAGACGTCGCTCCTCACGCTCCCTCGCCTCGTGGCAACGCATGAGCACATACCTAG
>Hip6_5#DNA/Helitron
TCTATACTAATCTCTTAAGAACCTACACACCGCGCAAAAAATAGTGCAGAGGGAGCACTCAAACACATGCCCCCGTTTCAGAAATTTAGGGTTAACCACTAGACCATGTGTATCTTAGTGTTTAAAATAAATAATAGTTATATTTGAGTATATAACAACCGTAGTAAAACACATGCAACTGGCTAA
```

## 从头构建LTR

使用EDTA，标准命令

```shell
EDTA.pl \
  --genome Zea_mays.fa \
  --cds Zmays_cds.fa \               # 有就用，没有可先不加
  --species others \                 # “Maize”不在预设物种列表里，选others
  --sensitive 1 \                    # 启用更灵敏的 LTR 检测
  --anno 1 \                         # 执行完整结构注释
  --threads 40
```

### 参数说明

| 参数              | 含义                                                                                   |
| --------------- | ------------------------------------------------------------------------------------ |
| `--genome`      | 输入的基因组 FASTA                                                                         |
| `--cds`         | 基因编码区序列，用于排除基因序列干扰，提高 TE 注释纯度                                                        |
| `--species`     | 预设物种（Rice、Maize 等），若无匹配选 `others`                                                    |
| `--sensitive 1` | `1` 用 RepeatModeler2 进行从头 TE 家族发现，**会显著提高新 TE 的发现率，但计算量翻倍**。玉米基因组大（2.3 Gb），建议先确认计算资源 |
| `--anno 1`      | 执行结构注释，即提炼出完整的、有末端重复的 LTR 元件                                                         |
| `--threads`     | 线程数                                                                                  |
|                 |                                                                                      |
|                 |                                                                                      |

```embed
title: "Index of /Genomes/B73/Zm-B73-REFERENCE-NAM-5.0"
image: "https://download.maizegdb.org/icons/blank.gif"
description: ""
url: "https://download.maizegdb.org/Genomes/B73/Zm-B73-REFERENCE-NAM-5.0/"
favicon: ""
aspectRatio: "110.00000000000001"
```

玉米的基因组和注释文件

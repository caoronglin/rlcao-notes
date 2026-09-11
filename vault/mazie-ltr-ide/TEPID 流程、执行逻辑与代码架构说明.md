# TEPID 流程、执行逻辑与代码架构说明

本文档整理当前代码库中的主要运行流程、样本数据分析方法、代码结构、算法原理和运维注意事项。内容基于当前仓库实现而写，最后整理日期为 2026-05-23。
  mamba run -n tepid-py314 snakemake ltr_then_tepid_all \
    --configfile config.snakemake.yaml \
    --cores 32 \
    --keep-going \
    --rerun-incomplete \
    --rerun-triggers mtime
## 1. 项目定位

TEPID 用于从 Illumina 测序 reads 中识别转座子多态性，核心目标是得到样本或群体层面的 TE presence/absence 信息。

代码库目前包含两条主要工作流：

1. 标准 TEPID 流程：FASTQ 到双映射 BAM，再进行 TE 插入、参考 TE 缺失发现，最后做群体合并、精炼和基因分型。

2. LTR 插入 Snakemake 流程：从 SRA/ENA 样本号下载 reads，先比对到 LTR/TE 序列，再重比对到基因组，按固定窗口统计 LTR 插入信号并生成矩阵。

```mermaid

flowchart LR

    A[FASTQ 或 SRA accession] --> B{运行路径}

    B --> C[标准 TEPID]

    B --> D[LTR Snakemake]

  

    C --> C1[tepid-map / tepid-map-se]

    C1 --> C2[tepid-discover]

    C2 --> C3[merge / tepid-refine / genotype]

    C3 --> C4[群体 TE presence/absence]

  

    D --> D1[kingfisher 下载]

    D1 --> D2[bowtie2 到 LTR/TE 索引]

    D2 --> D3[提取特定 flag reads]

    D3 --> D4[BWA 到基因组]

    D4 --> D5[唯一插入位点与 bin coverage]

    D5 --> D6["final_LTR_<bins_size>bp_matrix.tsv"]

```

## 2. 快速入口

常用命令入口来自 `pyproject.toml` 的 `[project.scripts]`：

| 命令                   | Python 入口                       | 作用                       |
| -------------------- | ------------------------------- | ------------------------ |
| `tepid-map`          | `tepid.mapping:paired_end_main` | paired-end FASTQ 双映射     |
| `tepi-map-se`        | `tepid.mapping:single_end_main` | single-end FASTQ 双映射     |
| `tepid-discover`     | `tepid.cli:discover_main`       | 单样本 TE 插入/缺失发现           |
| `tepid-refine`       | `tepid.cli:refine_main`         | 群体坐标二次检索和精炼              |
| `tepid-ltr-pipeline` | `tepid.ltr_pipeline:main`       | LTR Snakemake helper 子命令 |
`Scripts/tepid-map`、`Scripts/tepid-map-se`、`Scripts/tepid-discover`、`Scripts/tepid-refine` 和 `Scripts/tepid-ltr-pipeline` 是源码树内的兼容包装脚本。当前项目使用 Hatch/`pyproject.toml` 构建，不再依赖 `setup.py`。

## 3. 环境与依赖

当前支持 Python `>=3.14`，CI 目标为 Python 3.14。推荐环境文件是 `environment.yml`，环境名为 `tepid-py314`。

Python 运行依赖：

| 依赖           | 用途                                  |
| ------------ | ----------------------------------- |
| `numpy`      | 覆盖度、插入片段统计                          |
| `pybedtools` | BED/BAM 转换、intersect、merge、coverage |
| `pysam`      | BAM/SAM 读取、排序、索引、pileup             |

外部工具：

| 工具           | 用途                                           |
| ------------ | -------------------------------------------- |
| `bowtie2`    | 标准流程基因组比对；LTR 流程 LTR/TE 初筛比对                 |
| `yaha`       | split-read 映射                                |
| `samblaster` | paired-end 流程提取 unmapped/split/discordant 读段 |
| `samtools`   | BAM/SAM 转换、排序、索引、flagstat                    |
| `bedtools`   | makewindows、coverage、intersect、merge         |
| `bwa`        | LTR 流程中 LTR reads 到基因组的重比对                   |
| `kingfisher` | SRA/ENA reads 下载                             |
| `snakemake`  | 批处理 DAG 调度                                   |
| `pigz`       | LTR 下载规则中压缩 FASTQ；运行前需确认在 `PATH` 中           |

推荐安装与验证：

```bash

mamba env create -f environment.yml

mamba run -n tepid-py314 python -m pip install -e '.[dev]' -c constraints/py314.txt

mamba run -n tepid-py314 python -m compileall tepid Scripts tests

mamba run -n tepid-py314 python -m pytest tests -q

```

## 4. 输入数据

### 4.1 标准 TEPID 输入

| 输入               | 说明                                      |
| ---------------- | --------------------------------------- |
| paired-end FASTQ | `tepid-map -1 R1 -2 R2`                 |
| single-end FASTQ | `tepid-map-se -q reads.fq`              |
| Bowtie2 基因组索引    | `-x` 参数                                 |
| Yaha 基因组索引       | `-y` 参数                                 |
| TE 注释 BED        | `tepid-discover -t` 和 `tepid-refine -t` |
| 样本名              | `-n`；决定输出文件名                            |

TE 注释建议使用 7 列 TEPID BED 格式：

```text

chrom    start    stop    strand    TE_name    TE_family    TE_superfamily

```

当前仓库提供的注释目录：

| 路径 | 内容 |

| --- | --- |

| `Annotation/Arabidopsis/TAIR9_TE.bed.gz` | Arabidopsis TE 注释 |

| `Annotation/Brachypodium/Brachy_TE_v2.2.bed.gz` | Brachypodium TE 注释 |

| `Annotation/Human/hg19.bed.gz` | Human hg19 TE 注释 |

### 4.2 LTR Snakemake 输入

主要配置来自 `config.snakemake.example.yaml`：

| 配置项 | 说明 |

| --- | --- |

| `samples_file` | 每行一个 SRA/ENA accession，默认 `sv3.txt` |

| `dir` | 输出目录，默认 `output` |

| `te_fasta` | TE/LTR 共识序列 FASTA，用于构建 LTR Bowtie2 索引 |

| `genome_fasta` | 参考基因组 FASTA |

| `bt2_index` | 标准 TEPID genome Bowtie2 索引 |

| `yaha_index` | 标准 TEPID Yaha 索引 |

| `ltr_bt2_index` | LTR/TE Bowtie2 索引 |

| `bwa_reference` | BWA genome 索引前缀 |

| `genome_fai` | `samtools faidx` 生成的 `.fai` |

| `te_bed` | TE 注释 BED，preflight 默认检查 7 列 |

| `bins_size` | 固定窗口大小，影响最终矩阵文件名 |

| `bins_bed` | bedtools makewindows 产生的窗口 BED |

| `min_ltr_bin_count` | LTR bin 过滤阈值，默认 2 |

当前工作区的 `sv3.txt` 示例只有一个样本：

```text

SRR11301974

```

当前工作区还存在一个 `sv3.single.txt` 示例：

```text

SRR11301984

```

Snakemake 会读取 `samples_file`，去掉空行，并要求样本名只包含字母、数字、下划线、点和短横线：`[A-Za-z0-9_.-]+`。

## 5. 标准 TEPID 流程

### 5.1 标准流程图

```mermaid

flowchart TD

    A[Raw FASTQ] --> B{tepid-map / tepid-map-se}

    B --> C[bowtie2 genome alignment]

    B --> D[unmapped/clipped reads]

    D --> E[yaha split-read alignment]

    C --> F[sample.bam + sample.bam.bai]

    E --> G[sample.split.bam]

    F --> H{tepid-discover}

    G --> H

    I[TE annotation BED] --> H

    H --> J["insertions_<sample>.bed"]

    H --> K["deletions_<sample>.bed"]

    H --> L[read evidence txt + discover log]

    J --> M[merge_insertions.py]

    K --> N[merge_deletions.py]

    M --> O{tepid-refine}

    N --> O

    F --> O

    G --> O

    O --> P[second_pass + ambiguous calls]

    P --> Q[genotype.py]

    Q --> R[population genotype TSV]

```

### 5.2 映射阶段

paired-end 入口：

```bash

tepid-map -x indices/bt2/genome_idx -y indices/yaha/genome_idx \

    -p 16 -s 500 -n S1 -1 S1_1.fastq.gz -2 S1_2.fastq.gz

```

执行逻辑在 `tepid/mapping.py`：

1. `bowtie2 --local --dovetail` 将 reads 比对到基因组。

2. paired-end 结果通过 `samblaster -e -u <sample>.umap.fastq` 提取 unmapped reads。

3. `samtools view` 写出未排序 BAM。

4. `yaha` 将 unmapped reads 做 split-read 映射。

5. `samblaster -s <sample>.split.sam` 提取 split alignment。

6. `samtools view` 生成 `<sample>.split.bam`。

7. `samtools sort` 和 `samtools index` 生成 `<sample>.bam` 与 `<sample>.bam.bai`。

8. `-z` 只压缩生成的 `<sample>.umap.fastq`，不会压缩原始 FASTQ。

single-end 入口：

```bash

tepid-map-se -x indices/bt2/genome_idx -y indices/yaha/genome_idx \

    -p 16 -n S1 -q S1.fastq.gz

```

single-end 流程不能利用 paired-end discordant 信息，因此它从 Bowtie2 BAM 中提取 soft/hard clipped reads 和 unmapped reads，再送入 Yaha。

输出文件：

| 文件 | 说明 |

| --- | --- |

| `<sample>.bam` | Bowtie2 主 BAM，坐标排序 |

| `<sample>.bam.bai` | 主 BAM 索引 |

| `<sample>.split.bam` | Yaha split-read BAM |

| `<sample>.umap.fastq` | 中间 reads；`-z` 时为 `.fastq.gz` |

### 5.3 TE 变异发现

典型命令：

```bash

tepid-discover -n S1 -c S1.bam -s S1.split.bam \

    -t Annotation/Arabidopsis/TAIR9_TE.bed.gz --strict -p 16

```

核心逻辑在 `tepid/tepid.py`：

1. 检查并准备 BAM：`check_bam()` 会把主 BAM 坐标排序并索引；`check_name_sorted()` 会把 split BAM 按 read name 排序。

2. 估算数据特征：paired-end 模式用 `calc_mean()` 估算插入片段均值、标准差和 read length，用 `calc_cov()` 估算覆盖度。

3. 处理 split reads：将 split BAM 转为 BED/BEDPE，按 mapping quality 和 `--mask` 过滤。

4. 处理 discordant reads：paired-end 默认从主 BAM 中提取异常 insert size 或跨染色体 read pairs；也可用 `-D/--discordant` 提供外部 BAM。

5. 插入发现：找一端接近 TE 注释、另一端定位到基因组非参考位置的 split/discordant read clusters。

6. 缺失发现：找跨越参考 TE 的 gap-spanning split/discordant reads，并结合 TE 区域覆盖度下降证据。

7. 写出 BED、read evidence 和日志。

输出文件名是稳定契约：

| 文件 | 说明 |

| --- | --- |

| `insertions_<sample>.bed` | 样本中的新 TE 插入 |

| `deletions_<sample>.bed` | 样本中缺失的参考 TE |

| `insertion_reads_<sample>.txt` | 支持插入的 read names |

| `deletion_reads_<sample>.txt` | 支持缺失的 read names |

| `tepid_discover_log_<sample>.txt` | 样本、覆盖度、参数和完成状态 |

插入 BED 当前格式：

```text

ins_chr    ins_start    ins_stop    ref_chr    ref_start    ref_stop    TE_name    id

```

缺失 BED 当前格式：

```text

ref_chr    ref_start    ref_stop    strand    TE_name    id

```

read evidence 文件格式：

```text

>id    readA,readB,readC

```

### 5.4 阈值与过滤

`--strict` 会提高 read count 和 mapping quality 阈值。

paired-end 默认模式：

| 参数 | 计算方式 |

| --- | --- |

| deletion read 阈值 | `max(int(cov / 5), 4)` |

| insertion low 阈值 | `max(int(cov / 10), 2)` |

| insertion high 阈值 | `max(int(cov / 5), 2)` |

| insertion mapping quality | `>= 5` |

| deletion mapping quality | `>= 0` |

paired-end strict 模式：

| 参数 | 计算方式 |

| --- | --- |

| deletion read 阈值 | `max(int(cov / 5), 10)` |

| insertion low 阈值 | `max(int(cov / 5), 10)` |

| insertion high 阈值 | `max(int(cov / 2), 10)` |

| insertion/deletion mapping quality | `>= 10` |

single-end 默认模式的 deletion read 阈值是 `max(int(cov / 10), 4)`；strict 模式与 paired-end strict 使用同一组高置信阈值。

### 5.5 统计覆盖度模式

默认模式沿用传统规则：

1. 缺失：TE 区域平均覆盖度与上下游 2 kb 背景覆盖度的比值 `<= 0.1` 时支持缺失。

2. ambiguous：目标区域加减 200 bp 的平均覆盖度低于固定阈值时记为 ambiguous。

加 `--statistical` 后使用 `tepid/statistics.py` 中的 Poisson lower-tail 模型：

```bash

tepid-discover ... --statistical --stats-alpha 0.01

tepid-refine ... --statistical --stats-alpha 0.01

```

统计模式中，缺失覆盖度期望来自 TE 两侧 flank depth；ambiguous 判断使用样本全局覆盖度作为期望。`--stats-alpha` 必须在 `(0, 1)` 之间。

### 5.6 群体合并、精炼和分型

群体流程用于减少 false negatives：一个位点只要在任一样本中被发现，就在其他样本相同坐标处二次检索更弱证据。

主要步骤：

1. `merge_insertions.py -f insertions` 合并各样本插入位点。

2. `merge_deletions.py -f deletions` 合并各样本缺失位点。

3. `flip_deletions.py` 把"缺失该 TE 的样本列表"翻转成"含有该 TE 的样本列表"，让插入和缺失共享 presence/absence 语义。

4. `tepid-refine` 对每个样本检查 cohort master coordinates，输出 second-pass 和 ambiguous 文件。

5. `genotype.py` 合并 refined 和 ambiguous 信息，生成最终 TSV。

`merge_insertions.py` 和 `merge_deletions.py` 会扫描当前工作目录下的样本子目录，因此运行前应把每个样本的 `insertions_<sample>.bed` 或 `deletions_<sample>.bed` 放在对应样本目录中；Snakemake cohort 规则会自动创建这种临时工作目录。

`tepid-refine` 关键输出：

| 文件 | 说明 |

| --- | --- |

| `second_pass_insertion_<sample>.bed` | 二次检索补救到的插入 |

| `second_pass_deletion_<sample>.bed` | 二次检索补救到的缺失 |

| `second_pass_reads_insertion_<sample>.txt` | 插入二次证据 |

| `second_pass_reads_deletion_<sample>.txt` | 缺失二次证据 |

| `ambiguous_insertion_<sample>.bed` | 覆盖度不足或证据不够的插入位点 |

| `ambiguous_deletion_<sample>.bed` | 覆盖度不足或证据不够的缺失位点 |

`genotype.py` 输出每个变异位点的两类 accession 列表：含有该事件的样本，以及明确不含该事件的样本。ambiguous 样本会从"明确不含"列表中移除。

## 6. LTR Snakemake 流程

### 6.1 运行方式

构建索引：

```bash

snakemake indices_all --configfile config.snakemake.example.yaml --cores 8

```

生成 bins：

```bash

samtools faidx data/my_genome.fa

snakemake make_bins --configfile config.snakemake.example.yaml \

    --config genome_fai=data/my_genome.fa.fai \

             bins_size=1000 bins_bed=bins/genome_1000bp.bed \

    --cores 2

```

完整 LTR 流程：

```bash

snakemake ltr_pipeline_all --configfile config.snakemake.example.yaml --cores 32

```

分阶段断点续跑：

```bash

snakemake checkpoint_download --configfile config.snakemake.example.yaml --cores 16

snakemake checkpoint_mapping  --configfile config.snakemake.example.yaml --cores 16

snakemake checkpoint_remap    --configfile config.snakemake.example.yaml --cores 16

snakemake ltr_pipeline_all    --configfile config.snakemake.example.yaml --cores 16

```

`rule all` 默认目标是最终 LTR bin 矩阵。标准 TEPID cohort 规则需要显式指定目标，例如 `cohort_outputs` 或 `cohort_genotypes`。

### 6.2 LTR DAG

```mermaid

flowchart TD

    A[samples_file: sv3.txt] --> P[preflight]

    B[bins_bed] --> P

    C[te_bed] --> P

    A --> D[ltr_sra_to_fastq]

    D --> E[ltr_map_to_ltr: bowtie2 到 LTR]

    E --> F[ltr_extract_flagged_fastq]

    F --> G[ltr_bwa_remap: BWA 到 genome]

    G --> H[ltr_unique_insertions]

    H --> I[ltr_coverage_10bins]

    I --> J[ltr_bin_counts]

    I --> K[ltr_paste_sort]

    E --> L[ltr_library_stats]

    G --> M[ltr_archive_bam]

    J --> N[merge_matrix]

    N --> O["final_LTR_<bins_size>bp_matrix.tsv"]

    P --> O

    H --> O

    K --> O

    L --> O

    M --> O

    R[provenance_report] --> O

```

### 6.3 LTR 各规则执行逻辑

| Snakemake rule | 输入 | 输出 | 逻辑 |

| --- | --- | --- | --- |

| `preflight` | samples、bins、TE BED | `.preflight.ok` | 检查样本文件非空、bins 存在、TE BED 列数 |

| `ltr_sra_to_fastq` | sample accession | `temp/<sample>/ltr_fastq/*.fastq.gz` | `kingfisher get` 下载，`pigz` 压缩并测试 gzip |

| `ltr_map_to_ltr` | FASTQ | `temp/<sample>/ltr/<sample>-vs-LTR.bam` | `bowtie2 --end-to-end -k 1 --very-fast` 到 LTR/TE 索引 |

| `ltr_extract_flagged_fastq` | LTR BAM | `<sample>-vs-LTR.fq` | 提取 flag 在 `{69,101,117,133,165,181}` 的 reads |

| `ltr_bwa_remap` | flagged FASTQ | `<sample>.sam` | `bwa mem` 到全基因组 |

| `ltr_unique_insertions` | SAM | `02_LTR-bed/*unique.bed`、`03_unique-sum/*_unique-sum.txt` | 只保留一个 primary mapped alignment 的 query name |

| `ltr_coverage_10bins` | bins BED + unique BED | coverage raw/filtered BED | `bedtools coverage -counts`，按 `min_ltr_bin_count` 过滤 |

| `ltr_bin_counts` | filtered BED | `temp/<sample>/bam/<sample>_bin_counts.txt` | 归档每个样本的 bin count |

| `ltr_paste_sort` | filtered BED | `04_LTR-paste/*for_paste.txt` | 按自然染色体顺序排序 |

| `ltr_library_stats` | LTR BAM | `03_unique-sum/*library_change.txt` | `samtools flagstat` 汇总 total/mapped |

| `ltr_archive_bam` | BWA SAM | `01_LTR-bam/<sample>.bam` | 转 BAM 并排序归档 |

| `merge_matrix` | 所有样本 bin counts | `final/final_LTR_<bins_size>bp_matrix.tsv` | 合并为样本矩阵，缺失 bin 记 0 |

| `provenance_report` | 无 | `output/report/*.tsv` | 写出版本和输出清单 |

### 6.4 LTR 输出目录

若 `dir: output`，主要输出如下：

```text

output/

  .preflight.ok

  .checkpoints/

    download.done

    mapping.done

    remap.done

  temp/

    <sample>/

      ltr_fastq/

      ltr/

      bam/

  01_LTR-bam/

    <sample>.bam

  02_LTR-bed/

    <sample>-vs-LTRinsertion_unique.bed

  03_unique-sum/

    <sample>_unique-sum.txt

    <sample>-library_change.txt

  04_LTR-paste/

    <sample>-vs-LTR_per<bins_size>bp-for_paste.txt

  final/

    final_LTR_<bins_size>bp_matrix.tsv

  output/report/

    versions.tsv

    output_manifest.tsv

```

注意：`provenance_report` 当前路径是 `{dir}/output/report/`，所以默认 `dir: output` 时会出现 `output/output/report/`。

### 6.5 LTR 矩阵格式

`tepid/workflow_io.py` 生成最终矩阵。每个样本的 bin count 文件格式是：

```text

chrom    start    end    count

```

最终矩阵格式：

```text

Bin_ID          sampleA    sampleB

chr1:0-1000    2          5

chr1:1000-2000 0          0

chr2:0-1000    0          1

```

矩阵文件名随 `bins_size` 变化：

| `bins_size` | 输出文件 |

| --- | --- |

| `100` | `final_LTR_100bp_matrix.tsv` |

| `1000` | `final_LTR_1000bp_matrix.tsv` |

## 7. 样本数据分析方法

### 7.1 样本清单检查

LTR 批处理以 `samples_file` 为样本真值来源。建议运行前检查：

```bash

sed -n '1,20p' sv3.txt

wc -l sv3.txt

```

每行必须是一个 accession 或样本名，不能包含空格、斜杠、冒号等字符。Snakemake 中样本名会进入路径和 wildcard，因此必须保持稳定、唯一、可作为文件名。

### 7.2 当前测试数据代表的结果

仓库测试夹具提供了一个最小 Arabidopsis 例子，用于回归验证 `tepid-discover` 的输出。

插入测试结果：

```text

chr5    7608484    7608542    chr4    12269420    12269612    AT4TE57000    0

```

含义：

| 列 | 含义 |

| --- | --- |

| `chr5 7608484 7608542` | 推断的新插入位点 |

| `chr4 12269420 12269612` | 支持 reads 命中的参考 TE 坐标 |

| `AT4TE57000` | TE 名称 |

| `0` | 该样本内事件 ID |

缺失测试结果：

```text

chr3    9808122    9809189    +    AT3TE40820    0

```

含义：

| 列 | 含义 |

| --- | --- |

| `chr3 9808122 9809189` | 参考 TE 坐标 |

| `+` | strand |

| `AT3TE40820` | TE 名称 |

| `0` | 该样本内事件 ID |

支持 reads 文件用 `>事件ID` 映射到 read name 列表，可用于 IGV 或二次核查。

### 7.3 单样本结果检查

标准 TEPID 完成后，可先检查：

```bash

ls -lh insertions_S1.bed deletions_S1.bed \

    insertion_reads_S1.txt deletion_reads_S1.txt \

    tepid_discover_log_S1.txt

sed -n '1,20p' tepid_discover_log_S1.txt

```

建议关注：

| 指标 | 为什么重要 |

| --- | --- |

| coverage | 低于 10x 时日志会告警；推荐分析数据通常应高于 20x |

| mean insert size / std | paired-end discordant 判断依赖这些统计值 |

| read length | 太短的 reads 降低 split-read 定位能力 |

| 空 BED | 可能是真实无变异，也可能是覆盖度、注释、索引或 mask 问题 |

| reads evidence 数量 | 过少时需要谨慎解释 |

### 7.4 LTR 结果检查

LTR 流程完成后建议先看：

```bash

head output/02_LTR-bed/SRR11301974-vs-LTRinsertion_unique.bed

head output/03_unique-sum/SRR11301974_unique-sum.txt

head output/03_unique-sum/SRR11301974-library_change.txt

head output/final/final_LTR_100bp_matrix.tsv

```

解释：

| 文件 | 看什么 |

| --- | --- |

| `*insertion_unique.bed` | 每条唯一 BWA primary alignment 的基因组坐标 |

| `*_unique-sum.txt` | 唯一插入 reads 数量 |

| `*library_change.txt` | LTR BAM total/mapped reads 摘要 |

| `final_LTR_*bp_matrix.tsv` | 每个 bin 在每个样本中的 LTR 插入计数 |

如果最终矩阵大量为 0，优先检查：

1. `ltr_bt2_index` 是否对应 TE/LTR 序列。

2. `bwa_reference` 是否对应同一个基因组版本。

3. `bins_bed` 染色体命名是否与 BWA reference 一致。

4. `min_ltr_bin_count` 是否过高。

5. `pigz`、`kingfisher`、`bowtie2`、`bwa` 是否在实际 Snakemake 环境中可执行。

## 8. 代码架构

```mermaid

flowchart TB

    CLI[pyproject scripts / Scripts wrappers] --> mapping[tepid/mapping.py]

    CLI --> cli[tepid/cli.py]

    CLI --> ltr[tepid/ltr_pipeline.py]

  

    cli --> core[tepid/tepid.py]

    core --> stats[tepid/statistics.py]

    core --> bedops[tepid/bedops.py]

    core --> bam[tepid/bam.py]

  

    ltr --> validation[tepid/validation.py]

    ltr --> workflow[tepid/workflow_io.py]

  

    cohort[tepid/cohort/*.py] --> scripts[Scripts/*.py]

    snake[Snakefile] --> CLI

    tests[tests/*] --> CLI

    tests --> core

    tests --> ltr

```

| 路径 | 职责 |

| --- | --- |

| `Snakefile` | 批处理 DAG，包含索引构建、标准 TEPID 规则、LTR 规则、cohort 规则 |

| `config.snakemake.example.yaml` | Snakemake 参数、索引路径、线程和 bins 配置模板 |

| `tepid/mapping.py` | `tepid-map` 和 `tepid-map-se` 的实际实现 |

| `tepid/cli.py` | `tepid-discover`、`tepid-refine` 参数解析和模式分发 |

| `tepid/tepid.py` | 传统 TEPID 核心算法：discover、refine、BAM 准备、BED 操作 |

| `tepid/ltr_pipeline.py` | LTR helper 子命令：flag extraction、unique insertion、coverage filter、preflight |

| `tepid/workflow_io.py` | LTR 矩阵命名、自然排序、bin count 合并 |

| `tepid/statistics.py` | Poisson 覆盖度 depletion/ambiguous 判断 |

| `tepid/validation.py` | 文件、工具、TE BED、BAM quickcheck 校验 |

| `tepid/cohort/*.py` | 群体合并、缺失翻转和 genotype 逻辑 |

| `tepid/bam.py` | 对 legacy BAM helper 的 re-export |

| `tepid/bedops.py` | 对 legacy BED helper 的 re-export |

| `tepid/discover/outputs.py` | discover 输出文件名 dataclass |

| `tepid/refine/outputs.py` | refine 输出文件名 dataclass |

| `Scripts/*.py` | cohort 脚本包装或源码树兼容入口 |

| `tests/*` | 行为契约、回归夹具、Snakemake dry-run 和 packaging 检查 |

## 9. 重要运行契约

| 契约 | 说明 |

| --- | --- |

| BAM 会被原地改写 | `check_bam()` 可能把输入 BAM 排序并覆盖原路径；`check_name_sorted()` 可能把 split BAM 改为 queryname 排序 |

| 输出文件名稳定 | smoke tests 和 Snakemake 依赖 `insertions_<sample>.bed`、`deletions_<sample>.bed`、`second_pass_*` 等名字 |

| 样本名必须文件安全 | Snakemake 会拒绝含空格、斜杠等字符的 sample |

| TE BED 列数要一致 | LTR preflight 当前按 7 列检查；标准 discover 也按 TEPID 7 列语义使用 |

| `--mask` 可接受文件 | `tepid.cli` 会把 mask 文件内逗号和换行展开为逗号列表 |

| `--keep` 控制 temp 清理 | discover/refine 默认会清理随机 prefix 的 `.temp` 文件 |

| LTR 输出 `temp()` 可被 Snakemake 清理 | 需要长期保留的结果应看 `01_LTR-bam`、`02_LTR-bed`、`03_unique-sum`、`04_LTR-paste`、`final` |

| 路径带空格 | Python 映射入口已有测试覆盖递归模式中的空格路径；Snakemake 样本名仍不能含空格 |

## 10. 验证与回归测试

完整 Python 验证：

```bash

python -m compileall tepid Scripts tests

python -m pytest tests -q

```

聚焦测试：

```bash

python -m pytest tests/mapping_test.py -q

python -m pytest tests/tepid_test.py tests/discover_se_test.py -q

python -m pytest tests/refine_test.py tests/scripts_test.py -q

python -m pytest tests/ltr_pipeline_test.py tests/workflow_io_test.py -q

python -m pytest tests/snakemake_ltr_contract_test.py -q

```

Snakemake dry-run：

```bash

snakemake -n --configfile config.snakemake.yaml ltr_pipeline_all --cores 1

```

安装后 smoke：

```bash

bash .github/scripts/smoke-discover-refine.sh \

    --check-cli-help \

    --artifact-dir .artifacts/smoke-local

```

## 11. 常见问题定位

| 现象 | 优先检查 |

| --- | --- |

| `kingfisher: command not found` | 是否在 `tepid-py314` 环境中；或 `use_mamba_run: true` 是否配置正确 |

| `pigz: command not found` | LTR 下载规则需要 `pigz`；安装后重跑同一 Snakemake 命令 |

| `Chromosome names do not match TE annotation` | BAM reference、TE BED、bins BED 的染色体命名是否一致 |

| discover 结果为空 | 覆盖度、TE 注释版本、mask、split BAM 排序、mapping quality 阈值 |

| LTR 矩阵为空或全 0 | LTR index、BWA reference、bins 坐标、`min_ltr_bin_count` |

| Snakemake 中断 | 直接重跑同一目标；必要时加 `--rerun-incomplete` |

| cohort genotype 少样本 | ambiguous 文件会把样本从明确 absence 列表中剔除 |

## 12. 推荐分析顺序

小规模单样本标准 TEPID：

```bash

tepid-map -x indices/bt2/genome_idx -y indices/yaha/genome_idx \

    -p 16 -s 500 -n S1 -1 S1_1.fastq.gz -2 S1_2.fastq.gz

tepid-discover -n S1 -c S1.bam -s S1.split.bam \

    -t data/te_annotation.bed --strict -p 16

```

群体标准 TEPID：

```bash

# 每个样本先独立 tepid-map + tepid-discover

python Scripts/merge_insertions.py -f insertions

python Scripts/merge_deletions.py -f deletions

python Scripts/flip_deletions.py -s all_samples.txt -d deletions.bed \

    -r B73 -o flipped_deletions.bed

  

# 对每个样本运行 tepid-refine，然后再 merge refined / ambiguous 并 genotype

tepid-refine -n S1 -c S1.bam -s S1.split.bam -t data/te_annotation.bed \

    -a all_samples.txt -i insertions.bed -d deletions.bed -p 16

```

LTR 批处理：

```bash

cp config.snakemake.example.yaml config.snakemake.yaml

# 修改 samples_file、索引、te_bed、bins_bed、dir 等配置

snakemake indices_all --configfile config.snakemake.yaml --cores 8

snakemake make_bins --configfile config.snakemake.yaml --cores 2

snakemake ltr_pipeline_all --configfile config.snakemake.yaml --cores 32

```

## 13. 当前实现的边界

1. LTR 流程的 `preflight` 主要检查文件存在和 TE BED 列数，不检查索引前缀是否完整，也不检查所有外部工具是否存在。

2. `provenance_report` 目前写固定的 `python=3.14` 和 `tepid=0.8.0`，不是动态读取运行环境。

3. LTR helper 的 unique insertion 判断是 query name 只有一个 primary mapped BWA alignment，不等同于全基因组唯一 mappability 的复杂统计模型。

4. 标准 TEPID 核心算法集中在 `tepid/tepid.py`，函数较多且保留 legacy 文件名约定，改动时应优先运行现有回归测试。

5. Snakemake 默认目标是 LTR 矩阵；标准 TEPID cohort 规则存在，但不会被 `rule all` 自动触发。

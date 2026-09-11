
---

## 目录

1. [Python基础语法](#一python基础语法)
   - [数据类型](#11-数据类型)
   - [控制流（循环与条件）](#12-控制流循环与条件)
   - [函数](#13-函数)
   - [文件操作](#14-文件操作)
   - [异常处理](#15-异常处理)
   - [数据结构](#16-数据结构)
   - [类与面向对象](#17-类与面向对象)
   - [模块与包](#18-模块与包)

2. [生信常用第三方库](#二生信常用第三方库)
   - [NumPy - 数值计算](#21-numpy---数值计算)
   - [Pandas - 数据处理](#22-pandas---数据处理)
   - [Matplotlib - 数据可视化](#23-matplotlib---数据可视化)
   - [Biopython - 生物信息学](#24-biopython---生物信息学)

3. [生信核心算法与实战](#三生信核心算法与实战)
   - [序列比对算法](#31-序列比对算法)
   - [k-mer分析](#32-k-mer分析)
   - [GC含量分析](#33-gc含量分析)
   - [层次聚类](#34-层次聚类)
   - [PCA降维分析](#35-pca降维分析)
   - [Motif发现](#36-motif发现)

---

## 一、Python基础语法

### 1.1 数据类型

Python是动态类型语言，常用数据类型包括：

```python
# 数字
integer = 42          # 整数
floating = 3.14159    # 浮点数
complex_num = 3 + 4j  # 复数

# 字符串（生信中用于DNA/RNA/蛋白质序列）
dna_sequence = "ATCGATCGATCG"
protein = "MKTLLILTLG"

# 字符串操作
print(len(dna_sequence))        # 长度: 12
print(dna_sequence[0:3])        # 切片: "ATC"
print(dna_sequence.count('A'))  # 计数: 3
print(dna_sequence.replace('T', 'U'))  # RNA: "AUCGAUCGAUCG"

# 布尔值与空值
flag = True  # 或 False
nothing = None

# 类型转换
num_str = "42"
num = int(num_str)      # 字符串转整数
back_to_str = str(num)  # 整数转字符串
```

**生信案例**：计算DNA序列的反向互补序列

```python
def reverse_complement(seq):
    """计算DNA序列的反向互补序列"""
    complement = {'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C', 
                  'N': 'N', 'a': 't', 't': 'a', 'c': 'g', 'g': 'c'}
    return "".join(complement.get(base, base) for base in reversed(seq))

# 测试
dna = "ATCGATCGATCG"
print(f"原始序列: {dna}")
print(f"反向互补: {reverse_complement(dna)}")  # CGATCGATCGAT
```

---

### 1.2 控制流（循环与条件）

#### 条件语句

```python
gc_content = 55

if gc_content > 60:
    print("高GC含量")
elif gc_content > 40:
    print("中等GC含量")
else:
    print("低GC含量")
```

#### 循环

```python
# for循环遍历序列
sequence = "ATCG"
for base in sequence:
    print(base)

# while循环
count = 0
while count < 5:
    print(count)
    count += 1

# range函数
for i in range(0, 10, 2):  # 0, 2, 4, 6, 8
    print(i)

# 列表推导式（Pythonic写法）
# 提取所有A的位置
seq = "ATCGATCG"
a_positions = [i for i, base in enumerate(seq) if base == 'A']
print(a_positions)  # [0, 4]
```

**生信案例**：计算密码子翻译

```python
genetic_code = {
    'ATG': 'M', 'TAA': '*', 'TAG': '*', 'TGA': '*',
    'TTT': 'F', 'TTC': 'F', 'TTA': 'L', 'TTG': 'L',
    # ... 更多密码子
}

def translate_dna(dna_seq):
    """将DNA序列翻译为蛋白质序列"""
    protein = ""
    for i in range(0, len(dna_seq) - 2, 3):
        codon = dna_seq[i:i+3]
        amino_acid = genetic_code.get(codon, '?')
        protein += amino_acid
    return protein

# 测试
dna = "ATGTTTTCATGA"
print(f"DNA: {dna}")
print(f"蛋白质: {translate_dna(dna)}")  # MF*
```

---

### 1.3 函数

函数是可重用的代码块，使用`def`定义。

```python
# 基本函数
def greet(name):
    """函数的文档字符串（docstring）"""
    return f"Hello, {name}!"

# 带默认参数的函数
def calculate_gc_content(seq, decimal_places=2):
    """计算GC含量"""
    gc_count = seq.count('G') + seq.count('C')
    gc_percent = (gc_count / len(seq)) * 100
    return round(gc_percent, decimal_places)

# 可变参数
def sum_all(*numbers):
    """接受任意数量的参数"""
    return sum(numbers)

# 关键字参数
def analyze_sequence(seq, **kwargs):
    """接受任意关键字参数"""
    results = {'length': len(seq)}
    if kwargs.get('gc', False):
        results['gc_content'] = calculate_gc_content(seq)
    if kwargs.get('reverse', False):
        results['reverse'] = seq[::-1]
    return results

# Lambda表达式（匿名函数）
square = lambda x: x ** 2

# 测试
seq = "ATCGATCG"
print(calculate_gc_content(seq))  # 50.0
print(analyze_sequence(seq, gc=True, reverse=True))
```

---

### 1.4 文件操作

生信中经常需要处理FASTA、FASTQ、VCF等格式的文件。

```python
# 读取文件（推荐：使用with语句自动关闭）
with open('sequence.fasta', 'r') as file:
    content = file.read()  # 读取全部
    # 或逐行读取
    for line in file:
        print(line.strip())

# 写入文件
with open('output.txt', 'w') as file:
    file.write("Hello, Bioinformatics!\n")
    file.writelines(["Line 1\n", "Line 2\n"])

# 追加模式
with open('log.txt', 'a') as file:
    file.write("New log entry\n")
```

**生信案例**：解析FASTA文件

```python
def parse_fasta(filename):
    """解析FASTA文件，返回字典 {id: sequence}"""
    sequences = {}
    current_id = None
    current_seq = []
    
    with open(filename, 'r') as f:
        for line in f:
            line = line.strip()
            if line.startswith('>'):
                if current_id:
                    sequences[current_id] = ''.join(current_seq)
                current_id = line[1:].split()[0]  # 提取ID
                current_seq = []
            else:
                current_seq.append(line)
        
        # 保存最后一个序列
        if current_id:
            sequences[current_id] = ''.join(current_seq)
    
    return sequences

# 使用示例
# seqs = parse_fasta('example.fasta')
# for seq_id, sequence in seqs.items():
#     print(f"{seq_id}: {len(sequence)} bp")
```

---

### 1.5 异常处理

处理文件不存在、格式错误等异常情况。

```python
def safe_read_fasta(filename):
    """安全地读取FASTA文件"""
    try:
        sequences = parse_fasta(filename)
        return sequences
    except FileNotFoundError:
        print(f"错误：文件 '{filename}' 不存在")
        return {}
    except PermissionError:
        print(f"错误：没有权限读取 '{filename}'")
        return {}
    except Exception as e:
        print(f"未知错误：{e}")
        return {}
    finally:
        print("读取操作完成")  # 无论是否出错都会执行

# 自定义异常
class InvalidSequenceError(Exception):
    """序列包含无效字符"""
    pass

def validate_sequence(seq, alphabet='ATCG'):
    """验证序列是否只包含指定字符"""
    invalid = set(seq.upper()) - set(alphabet)
    if invalid:
        raise InvalidSequenceError(f"无效字符: {invalid}")
    return True

# 测试
try:
    validate_sequence("ATCGXYZ")
except InvalidSequenceError as e:
    print(e)  # 无效字符: {'X', 'Y', 'Z'}
```

---

### 1.6 数据结构

#### 列表（List）- 有序可变序列

```python
# 创建列表
bases = ['A', 'T', 'C', 'G']
numbers = [1, 2, 3, 4, 5]
mixed = [1, 'ATCG', 3.14, True]

# 列表操作
bases.append('N')        # 添加元素
bases.insert(0, 'X')     # 插入元素
bases.remove('X')        # 删除元素
last = bases.pop()       # 弹出最后一个
bases.sort()             # 排序
bases.reverse()          # 反转

# 切片
print(bases[1:3])   # ['C', 'G']
print(bases[:2])    # 前两个
print(bases[-2:])   # 后两个
```

#### 字典（Dict）- 键值对

```python
# 创建字典
gene_info = {
    'gene_id': 'BRCA1',
    'chromosome': '17',
    'start': 43044295,
    'end': 43125364,
    'strand': '-'
}

# 访问和修改
print(gene_info['gene_id'])      # BRCA1
gene_info['function'] = 'DNA repair'
gene_info.get('expression', 0)   # 安全获取，默认0

# 遍历
for key, value in gene_info.items():
    print(f"{key}: {value}")

# 字典推导式
seq = "ATCGATCG"
base_count = {base: seq.count(base) for base in set(seq)}
print(base_count)  # {'A': 2, 'T': 2, 'C': 2, 'G': 2}
```

#### 元组（Tuple）- 不可变序列

```python
# 元组用于不可变数据
coordinates = (43044295, 43125364)  # 基因组坐标
# coordinates[0] = 1  # 错误！元组不可修改

# 解包
start, end = coordinates
print(start, end)
```

#### 集合（Set）- 无序不重复元素

```python
# 创建集合
unique_bases = {'A', 'T', 'C', 'G'}

# 集合操作
set1 = {'A', 'T', 'C'}
set2 = {'C', 'G', 'T'}
print(set1 & set2)  # 交集: {'T', 'C'}
print(set1 | set2)  # 并集: {'A', 'T', 'C', 'G'}
print(set1 - set2)  # 差集: {'A'}

# 去重
seq_with_dup = "AATTCCGG"
unique = ''.join(sorted(set(seq_with_dup)))
print(unique)  # ACGT
```

---

### 1.7 类与面向对象

类用于封装数据和方法，适合表示生物实体。

```python
class Sequence:
    """生物序列类"""
    
    # 类属性
    valid_bases = {'A', 'T', 'C', 'G', 'N'}
    
    def __init__(self, seq_id, sequence, seq_type='DNA'):
        """构造函数"""
        self.seq_id = seq_id
        self.sequence = sequence.upper()
        self.seq_type = seq_type
        self.length = len(sequence)
    
    def gc_content(self):
        """计算GC含量"""
        gc = self.sequence.count('G') + self.sequence.count('C')
        return (gc / self.length) * 100
    
    def reverse_complement(self):
        """返回反向互补序列"""
        comp = {'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C', 'N': 'N'}
        return ''.join(comp.get(b, b) for b in reversed(self.sequence))
    
    def __str__(self):
        """字符串表示"""
        return f">{self.seq_id}\n{self.sequence}"
    
    def __len__(self):
        """长度"""
        return self.length
    
    def __add__(self, other):
        """拼接两个序列"""
        new_seq = self.sequence + other.sequence
        return Sequence(f"{self.seq_id}_{other.seq_id}", new_seq)

# 使用示例
seq1 = Sequence("gene1", "ATCGATCG")
seq2 = Sequence("gene2", "GGGCCC")

print(seq1)
print(f"GC含量: {seq1.gc_content():.2f}%")
print(f"反向互补: {seq1.reverse_complement()}")
print(f"拼接: {seq1 + seq2}")
```

**继承示例**：创建特定类型的序列类

```python
class DNASequence(Sequence):
    """DNA序列子类"""
    
    def __init__(self, seq_id, sequence):
        super().__init__(seq_id, sequence, 'DNA')
    
    def transcribe(self):
        """转录为RNA"""
        return RNASequence(self.seq_id, self.sequence.replace('T', 'U'))
    
    def find_orfs(self):
        """寻找开放阅读框"""
        start_codon = 'ATG'
        stop_codons = {'TAA', 'TAG', 'TGA'}
        orfs = []
        
        for frame in range(3):
            for i in range(frame, len(self.sequence) - 2, 3):
                codon = self.sequence[i:i+3]
                if codon == start_codon:
                    for j in range(i + 3, len(self.sequence) - 2, 3):
                        stop = self.sequence[j:j+3]
                        if stop in stop_codons:
                            orfs.append((i, j + 3, self.sequence[i:j+3]))
                            break
        return orfs

class RNASequence(Sequence):
    """RNA序列子类"""
    
    def __init__(self, seq_id, sequence):
        super().__init__(seq_id, sequence.replace('T', 'U'), 'RNA')
    
    def reverse_transcribe(self):
        """逆转录为DNA"""
        return DNASequence(self.seq_id, self.sequence.replace('U', 'T'))

# 使用
dna = DNASequence("test", "ATGAAATAA")
print(dna.find_orfs())
rna = dna.transcribe()
print(rna)
```

---

### 1.8 模块与包

模块是包含Python代码的文件，包是模块的集合。

```python
# 导入模块
import math
import random as rd  # 别名
from datetime import datetime  # 导入特定函数/类
from collections import Counter, defaultdict

# 常用标准库
import os          # 操作系统接口
import sys         # 系统相关
import json        # JSON处理
import re          # 正则表达式
import itertools   # 迭代器工具
import functools   # 高阶函数工具

# 示例：使用Counter统计碱基
from collections import Counter
seq = "ATCGATCGATCG"
counts = Counter(seq)
print(counts)  # Counter({'A': 3, 'T': 3, 'C': 3, 'G': 3})
print(counts.most_common(2))  # [('A', 3), ('T', 3)]
```

**创建自己的模块**：

```python
# 保存为 bio_utils.py
def parse_fasta(filename):
    """解析FASTA文件"""
    # ... 实现代码
    pass

def calculate_gc_content(sequence):
    """计算GC含量"""
    # ... 实现代码
    pass

# 在其他文件中使用
# from bio_utils import parse_fasta, calculate_gc_content
# 或
# import bio_utils
# bio_utils.parse_fasta('file.fasta')
```

---

## 二、生信常用第三方库

### 2.1 NumPy - 数值计算

NumPy是Python科学计算的基础，提供高效的多维数组操作。

```python
import numpy as np

# 创建数组
arr1 = np.array([1, 2, 3, 4, 5])
arr2 = np.zeros((3, 3))           # 3x3零矩阵
arr3 = np.ones((2, 4))            # 2x4全1矩阵
arr4 = np.arange(0, 10, 2)        # [0, 2, 4, 6, 8]
arr5 = np.linspace(0, 1, 5)       # [0, 0.25, 0.5, 0.75, 1]

# 数组操作
arr = np.array([[1, 2, 3], [4, 5, 6]])
print(arr.shape)      # (2, 3)
print(arr.ndim)       # 2
print(arr.size)       # 6
print(arr.dtype)      # int64

# 索引和切片
print(arr[0, 1])      # 2
print(arr[:, 1])      # [2, 5] (第二列)
print(arr[0, :])      # [1, 2, 3] (第一行)

# 数学运算
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
print(a + b)          # [5, 7, 9]
print(a * b)          # [4, 10, 18] (逐元素乘法)
print(np.dot(a, b))   # 32 (点积)
print(a ** 2)         # [1, 4, 9]

# 统计函数
data = np.array([23, 45, 67, 89, 12])
print(np.mean(data))  # 平均值
print(np.median(data))# 中位数
print(np.std(data))   # 标准差
print(np.max(data))   # 最大值
print(np.min(data))   # 最小值
```

**生信案例**：处理基因表达矩阵

```python
import numpy as np

# 模拟基因表达矩阵（基因 x 样本）
# 100个基因，5个样本
expression = np.random.lognormal(mean=3, sigma=1, size=(100, 5))

# 计算每个基因在所有样本中的平均表达量
gene_means = np.mean(expression, axis=1)
print(f"平均表达量范围: {gene_means.min():.2f} - {gene_means.max():.2f}")

# 计算每个样本的基因表达总和
sample_totals = np.sum(expression, axis=0)
print(f"样本总表达量: {sample_totals}")

# 标准化（Z-score）
zscore = (expression - np.mean(expression, axis=0)) / np.std(expression, axis=0)

# 找出高表达基因（平均表达量 > 50）
high_expr_mask = gene_means > 50
high_expr_genes = expression[high_expr_mask]
print(f"高表达基因数量: {len(high_expr_genes)}")
```

---

### 2.2 Pandas - 数据处理

Pandas提供DataFrame和Series数据结构，是生信数据分析的利器。

```python
import pandas as pd

# 创建Series（一维数据）
s = pd.Series([1, 3, 5, 7, 9], index=['a', 'b', 'c', 'd', 'e'])
print(s['c'])  # 5

# 创建DataFrame（二维数据）
data = {
    'gene_id': ['gene1', 'gene2', 'gene3', 'gene4'],
    'chr': ['chr1', 'chr2', 'chr1', 'chr3'],
    'start': [1000, 2000, 3500, 4000],
    'end': [1500, 2800, 4200, 4600],
    'expression': [23.5, 45.2, 12.1, 89.3]
}
df = pd.DataFrame(data)
print(df)

# 数据查看
print(df.head(2))       # 前2行
print(df.tail(2))       # 后2行
print(df.info())        # 数据信息
print(df.describe())    # 统计描述
print(df.shape)         # (4, 5)

# 选择数据
print(df['gene_id'])                    # 选择列
print(df[['gene_id', 'expression']])    # 选择多列
print(df[df['expression'] > 30])        # 条件筛选
print(df.loc[0, 'gene_id'])             # 按标签选择
print(df.iloc[0, 0])                    # 按位置选择

# 数据操作
df['length'] = df['end'] - df['start']  # 新增列
df = df.drop('length', axis=1)          # 删除列
df_sorted = df.sort_values('expression', ascending=False)  # 排序

# 分组统计
chr_stats = df.groupby('chr')['expression'].mean()
print(chr_stats)

# 处理缺失值
df_with_na = df.copy()
df_with_na.loc[0, 'expression'] = None
print(df_with_na.fillna(0))             # 填充0
print(df_with_na.dropna())              # 删除缺失值
```

**生信案例**：处理GTF基因注释文件

```python
import pandas as pd

# 读取GTF文件（简化版）
# gtf = pd.read_csv('genes.gtf', sep='\t', comment='#', 
#                   names=['chr', 'source', 'feature', 'start', 'end', 
#                          'score', 'strand', 'frame', 'attributes'])

# 模拟GTF数据
gtf_data = {
    'chr': ['chr1', 'chr1', 'chr2', 'chr2'],
    'feature': ['gene', 'exon', 'gene', 'exon'],
    'start': [1000, 1100, 5000, 5100],
    'end': [5000, 1200, 8000, 5300],
    'strand': ['+', '+', '-', '-'],
    'gene_name': ['BRCA1', 'BRCA1', 'TP53', 'TP53']
}
gtf = pd.DataFrame(gtf_data)

# 统计每染色体的基因数
gene_counts = gtf[gtf['feature'] == 'gene'].groupby('chr').size()
print("每染色体基因数:")
print(gene_counts)

# 计算外显子平均长度
exons = gtf[gtf['feature'] == 'exon'].copy()
exons['length'] = exons['end'] - exons['start']
avg_exon_length = exons['length'].mean()
print(f"平均外显子长度: {avg_exon_length:.1f} bp")

# 筛选正义链基因
plus_genes = gtf[(gtf['feature'] == 'gene') & (gtf['strand'] == '+')]
print("正义链基因:")
print(plus_genes[['chr', 'start', 'end', 'gene_name']])
```

---

### 2.3 Matplotlib - 数据可视化

Matplotlib是Python最基础的绘图库。

```python
import matplotlib.pyplot as plt
import numpy as np

# 基础折线图
x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(8, 4))
plt.plot(x, y, 'b-', linewidth=2, label='sin(x)')
plt.xlabel('X轴')
plt.ylabel('Y轴')
plt.title('正弦函数')
plt.legend()
plt.grid(True, alpha=0.3)
plt.savefig('sine_wave.png', dpi=150)
plt.show()

# 散点图
np.random.seed(42)
x = np.random.randn(100)
y = np.random.randn(100)
colors = np.random.rand(100)

plt.figure(figsize=(6, 6))
plt.scatter(x, y, c=colors, cmap='viridis', s=50, alpha=0.7)
plt.colorbar(label='颜色值')
plt.title('散点图')
plt.show()

# 柱状图
categories = ['A', 'T', 'C', 'G']
counts = [250, 230, 270, 250]

plt.figure(figsize=(6, 4))
plt.bar(categories, counts, color=['red', 'green', 'blue', 'orange'])
plt.ylabel('Count')
plt.title('Base Composition')
for i, v in enumerate(counts):
    plt.text(i, v + 5, str(v), ha='center')
plt.show()

# 子图
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

axes[0].plot(x, np.sin(x), 'b-', label='sin')
axes[0].set_title('Sine')
axes[0].legend()

axes[1].plot(x, np.cos(x), 'r-', label='cos')
axes[1].set_title('Cosine')
axes[1].legend()

plt.tight_layout()
plt.show()
```

---

### 2.4 Biopython - 生物信息学

Biopython是生信领域最重要的Python库。

```python
from Bio import SeqIO
from Bio.Seq import Seq
from Bio.SeqUtils import GC
from Bio import AlignIO
from Bio.Align import PairwiseAligner

# 创建序列对象
dna_seq = Seq("ATCGATCGATCG")
print(f"序列: {dna_seq}")
print(f"长度: {len(dna_seq)}")
print(f"反向互补: {dna_seq.reverse_complement()}")
print(f"转录: {dna_seq.transcribe()}")
print(f"翻译: {dna_seq.translate()}")

# GC含量
print(f"GC含量: {GC(dna_seq):.2f}%")

# 序列记录
from Bio.SeqRecord import SeqRecord
record = SeqRecord(
    dna_seq,
    id="gene001",
    description="Example gene sequence",
    annotations={"organism": "Homo sapiens"}
)
print(record.format("fasta"))

# 读取FASTA文件
# for record in SeqIO.parse("sequences.fasta", "fasta"):
#     print(f"ID: {record.id}")
#     print(f"Length: {len(record.seq)}")

# 序列比对
aligner = PairwiseAligner()
aligner.match_score = 1
aligner.mismatch_score = -1
aligner.gap_score = -2

seq1 = Seq("GATTACA")
seq2 = Seq("GCATGCU")
alignments = aligner.align(seq1, seq2)
print(alignments[0])
```

---

## 三、生信核心算法与实战

### 3.1 序列比对算法

序列比对是生信最基础的算法，用于比较两个或多个序列的相似性。

#### 全局比对：Needleman-Wunsch算法

```python
import numpy as np

def needleman_wunsch(seq1, seq2, match=1, mismatch=-1, gap=-2):
    """
    Needleman-Wunsch全局比对算法
    
    参数:
        seq1, seq2: 要比对的序列
        match: 匹配得分
        mismatch: 不匹配罚分
        gap: 空位罚分
    
    返回:
        比对得分和比对后的序列
    """
    m, n = len(seq1), len(seq2)
    
    # 初始化得分矩阵
    score_matrix = np.zeros((m + 1, n + 1))
    
    # 初始化边界（空位罚分）
    for i in range(1, m + 1):
        score_matrix[i, 0] = gap * i
    for j in range(1, n + 1):
        score_matrix[0, j] = gap * j
    
    # 填充矩阵
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            match_score = match if seq1[i-1] == seq2[j-1] else mismatch
            
            diagonal = score_matrix[i-1, j-1] + match_score
            up = score_matrix[i-1, j] + gap
            left = score_matrix[i, j-1] + gap
            
            score_matrix[i, j] = max(diagonal, up, left)
    
    # 回溯
    align1, align2 = "", ""
    i, j = m, n
    
    while i > 0 or j > 0:
        if i > 0 and j > 0:
            match_score = match if seq1[i-1] == seq2[j-1] else mismatch
            if score_matrix[i, j] == score_matrix[i-1, j-1] + match_score:
                align1 = seq1[i-1] + align1
                align2 = seq2[j-1] + align2
                i -= 1
                j -= 1
                continue
        
        if i > 0 and score_matrix[i, j] == score_matrix[i-1, j] + gap:
            align1 = seq1[i-1] + align1
            align2 = "-" + align2
            i -= 1
        else:
            align1 = "-" + align1
            align2 = seq2[j-1] + align2
            j -= 1
    
    return score_matrix[m, n], align1, align2, score_matrix

# 测试
seq1 = "GATTACA"
seq2 = "GCATGCU"
score, align1, align2, matrix = needleman_wunsch(seq1, seq2)

print(f"比对得分: {score}")
print(f"序列1: {align1}")
print(f"序列2: {align2}")

# 可视化比对结果
print("\n比对可视化:")
for i in range(len(align1)):
    if align1[i] == align2[i]:
        print("|", end="")
    elif align1[i] == "-" or align2[i] == "-":
        print(" ", end="")
    else:
        print(".", end="")
print()
```

**动态规划矩阵可视化**：

![动态规划矩阵](dp_matrix.png)

上图展示了Needleman-Wunsch算法的动态规划矩阵：
- **颜色深浅**表示得分高低（深色=高分）
- **蓝色箭头**表示回溯路径，从右下角到左上角
- 对角线移动表示匹配/不匹配
- 向上/向左移动表示插入空位

#### 局部比对：Smith-Waterman算法

```python
def smith_waterman(seq1, seq2, match=2, mismatch=-1, gap=-1):
    """
    Smith-Waterman局部比对算法
    
    与全局比对的主要区别：
    1. 得分可以为0（不允许负分）
    2. 从矩阵最大值开始回溯
    3. 回溯到0时停止
    """
    m, n = len(seq1), len(seq2)
    score_matrix = np.zeros((m + 1, n + 1))
    
    # 填充矩阵
    max_score = 0
    max_pos = (0, 0)
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            match_score = match if seq1[i-1] == seq2[j-1] else mismatch
            
            diagonal = score_matrix[i-1, j-1] + match_score
            up = score_matrix[i-1, j] + gap
            left = score_matrix[i, j-1] + gap
            
            score_matrix[i, j] = max(0, diagonal, up, left)
            
            if score_matrix[i, j] > max_score:
                max_score = score_matrix[i, j]
                max_pos = (i, j)
    
    # 回溯（从最大值到0）
    align1, align2 = "", ""
    i, j = max_pos
    
    while score_matrix[i, j] > 0:
        if i > 0 and j > 0:
            match_score = match if seq1[i-1] == seq2[j-1] else mismatch
            if score_matrix[i, j] == score_matrix[i-1, j-1] + match_score:
                align1 = seq1[i-1] + align1
                align2 = seq2[j-1] + align2
                i -= 1
                j -= 1
                continue
        
        if i > 0 and score_matrix[i, j] == score_matrix[i-1, j] + gap:
            align1 = seq1[i-1] + align1
            align2 = "-" + align2
            i -= 1
        else:
            align1 = "-" + align1
            align2 = seq2[j-1] + align2
            j -= 1
    
    return max_score, align1, align2

# 测试
seq1 = "ACACACTA"
seq2 = "AGCACACA"
score, align1, align2 = smith_waterman(seq1, seq2)
print(f"局部比对得分: {score}")
print(f"序列1: {align1}")
print(f"序列2: {align2}")
```

**序列比对可视化**：

![序列比对](sequence_alignment.png)

上图展示了序列比对的可视化结果：
- **绿色块**：匹配的碱基
- **红色块**：不匹配的碱基
- **实线**：匹配连接
- **虚线**：不匹配连接

---

### 3.2 k-mer分析

k-mer是指序列中长度为k的所有子串，广泛用于序列组装、比对和分类。

```python
from collections import Counter
import matplotlib.pyplot as plt

def extract_kmers(sequence, k):
    """
    提取序列中的所有k-mer
    
    参数:
        sequence: DNA序列
        k: k-mer长度
    
    返回:
        k-mer列表
    """
    kmers = []
    for i in range(len(sequence) - k + 1):
        kmer = sequence[i:i+k]
        kmers.append(kmer)
    return kmers

def kmer_frequency(sequence, k):
    """
    计算k-mer频率
    
    返回:
        {k-mer: 频率}字典
    """
    kmers = extract_kmers(sequence, k)
    return Counter(kmers)

def jaccard_similarity(seq1, seq2, k=3):
    """
    使用k-mer计算两条序列的Jaccard相似度
    
    Jaccard = |A ∩ B| / |A ∪ B|
    """
    kmers1 = set(extract_kmers(seq1, k))
    kmers2 = set(extract_kmers(seq2, k))
    
    intersection = len(kmers1 & kmers2)
    union = len(kmers1 | kmers2)
    
    return intersection / union if union > 0 else 0

# 测试
dna = "ATCGATCGATCG"
k = 2
kmers = extract_kmers(dna, k)
freq = kmer_frequency(dna, k)

print(f"序列: {dna}")
print(f"所有{k}-mer: {kmers}")
print(f"频率统计:")
for kmer, count in freq.most_common():
    print(f"  {kmer}: {count}")

# 比较两条序列
seq1 = "ATCGATCG"
seq2 = "ATCGATGG"
similarity = jaccard_similarity(seq1, seq2, k=2)
print(f"\n序列相似度 (k=2): {similarity:.2f}")
```

**k-mer频率可视化**：

![k-mer频率](kmer_frequency.png)

上图展示了2-mer和3-mer的频率分布：
- 左图：所有16种2-mer的频率
- 右图：最常见的8种3-mer
- 可用于识别序列特征和模式

**k-mer在生信中的应用**：

```python
def estimate_genome_size(kmer_counts):
    """
    使用k-mer频谱估计基因组大小
    
    原理: 基因组大小 ≈ 总k-mer数 / 峰值覆盖度
    """
    total_kmers = sum(kmer_counts.values())
    
    # 找到峰值（排除低频错误）
    coverage_counts = Counter(kmer_counts.values())
    peak_coverage = max(coverage_counts.keys(), 
                       key=lambda x: coverage_counts[x] if x > 5 else 0)
    
    genome_size = total_kmers / peak_coverage
    return genome_size, peak_coverage

# 模拟k-mer频谱数据（来自测序数据）
kmer_depth = [1]*100 + [5]*500 + [10]*2000 + [20]*3500 + [30]*2500 + [40]*1000 + [50]*400
kmer_counts = Counter()
for depth in kmer_depth:
    kmer_counts[f"kmer_{len(kmer_counts)}"] = depth

size, peak = estimate_genome_size(kmer_counts)
print(f"估计基因组大小: {size:,.0f} bp")
print(f"峰值覆盖度: {peak}x")
```

---

### 3.3 GC含量分析

GC含量是基因组研究中的重要指标，影响DNA稳定性和基因表达。

```python
import numpy as np
import matplotlib.pyplot as plt

def gc_content_sliding_window(sequence, window_size=100, step=50):
    """
    滑动窗口计算GC含量
    
    参数:
        sequence: DNA序列
        window_size: 窗口大小
        step: 步长
    
    返回:
        位置列表和GC含量列表
    """
    positions = []
    gc_contents = []
    
    for i in range(0, len(sequence) - window_size + 1, step):
        window = sequence[i:i+window_size]
        gc = (window.count('G') + window.count('C')) / window_size * 100
        positions.append(i + window_size // 2)
        gc_contents.append(gc)
    
    return positions, gc_contents

def gc_skew(sequence, window_size=1000):
    """
    计算GC skew: (G - C) / (G + C)
    
    用于识别复制起点（oriC）和终止点（ter）
    """
    positions = []
    skews = []
    
    for i in range(0, len(sequence) - window_size + 1, window_size):
        window = sequence[i:i+window_size]
        g = window.count('G')
        c = window.count('C')
        if g + c > 0:
            skew = (g - c) / (g + c)
        else:
            skew = 0
        positions.append(i)
        skews.append(skew)
    
    return positions, skews

# 生成模拟基因组序列
np.random.seed(42)
genome_length = 50000

# 创建具有GC含量变化的序列
genome = []
for i in range(genome_length):
    if 10000 <= i < 20000:  # 高GC区域
        base = np.random.choice(['G', 'C', 'A', 'T'], p=[0.35, 0.35, 0.15, 0.15])
    elif 30000 <= i < 40000:  # 低GC区域
        base = np.random.choice(['G', 'C', 'A', 'T'], p=[0.15, 0.15, 0.35, 0.35])
    else:  # 正常区域
        base = np.random.choice(['G', 'C', 'A', 'T'], p=[0.2, 0.2, 0.3, 0.3])
    genome.append(base)

genome = ''.join(genome)

# 计算GC含量
positions, gc_values = gc_content_sliding_window(genome, window_size=500, step=250)

print(f"基因组长度: {len(genome)} bp")
print(f"全局GC含量: {(genome.count('G') + genome.count('C'))/len(genome)*100:.2f}%")
print(f"GC含量范围: {min(gc_values):.1f}% - {max(gc_values):.1f}%")
```

**GC含量滑动窗口可视化**：

![GC含量分析](gc_content.png)

上图展示了基因组GC含量的滑动窗口分析：
- **青色区域**：GC含量曲线
- **红色虚线**：平均GC含量
- **橙色区域**：基因区域（通常GC含量较高）
- 可用于识别基因岛和异染色质区域

---

### 3.4 层次聚类

层次聚类用于根据基因表达模式对样本或基因进行分组。

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy.cluster.hierarchy import dendrogram, linkage, fcluster
from scipy.spatial.distance import pdist

def hierarchical_clustering(expression_matrix, labels=None, method='ward'):
    """
    对基因表达数据进行层次聚类
    
    参数:
        expression_matrix: 基因表达矩阵 (样本 x 基因)
        labels: 样本标签
        method: 连接方法 ('single', 'complete', 'average', 'ward')
    
    返回:
        链接矩阵
    """
    # 计算距离矩阵
    distances = pdist(expression_matrix, metric='euclidean')
    
    # 层次聚类
    linked = linkage(distances, method=method)
    
    return linked

def plot_dendrogram(linked, labels=None, max_d=None):
    """绘制聚类树状图"""
    plt.figure(figsize=(12, 5))
    
    dendrogram(linked,
               labels=labels,
               orientation='top',
               distance_sort='descending',
               show_leaf_counts=True,
               leaf_rotation=45,
               leaf_font_size=10,
               color_threshold=max_d if max_d else 0.7 * max(linked[:, 2]))
    
    if max_d:
        plt.axhline(y=max_d, c='r', linestyle='--', label=f'Cut at {max_d}')
    
    plt.title('Hierarchical Clustering Dendrogram')
    plt.xlabel('Samples')
    plt.ylabel('Distance')
    plt.legend()
    plt.tight_layout()
    plt.show()

# 生成模拟基因表达数据
np.random.seed(42)

# 3组样本，每组有不同的表达模式
n_genes = 100
n_samples_per_group = 5

# 组1: 高表达前50个基因
group1 = np.random.randn(n_samples_per_group, n_genes) + np.concatenate([
    np.ones(50) * 2, np.zeros(50)
])

# 组2: 高表达后50个基因
group2 = np.random.randn(n_samples_per_group, n_genes) + np.concatenate([
    np.zeros(50), np.ones(50) * 2
])

# 组3: 中等表达所有基因
group3 = np.random.randn(n_samples_per_group, n_genes) + np.ones(n_genes) * 1

# 合并数据
expression_data = np.vstack([group1, group2, group3])
sample_labels = ([f'G1_{i+1}' for i in range(n_samples_per_group)] +
                 [f'G2_{i+1}' for i in range(n_samples_per_group)] +
                 [f'G3_{i+1}' for i in range(n_samples_per_group)])

# 执行聚类
linked = hierarchical_clustering(expression_data, sample_labels, method='ward')

# 获取聚类标签
n_clusters = 3
cluster_labels = fcluster(linked, n_clusters, criterion='maxclust')

print("样本聚类结果:")
for label, cluster in zip(sample_labels, cluster_labels):
    print(f"  {label}: Cluster {cluster}")
```

**层次聚类树状图**：

![聚类树状图](dendrogram.png)

上图展示了层次聚类的结果：
- **Y轴**：距离（不相似度）
- **X轴**：样本
- **树状结构**：显示样本间的层次关系
- 可以切割树来得到指定数量的聚类

---

### 3.5 PCA降维分析

主成分分析（PCA）用于降维和可视化高维基因表达数据。

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

def pca_analysis(expression_matrix, n_components=2, scale=True):
    """
    对基因表达数据进行PCA分析
    
    参数:
        expression_matrix: 表达矩阵 (样本 x 基因)
        n_components: 保留的主成分数
        scale: 是否标准化
    
    返回:
        PCA结果、转换后的数据、方差解释比例
    """
    # 标准化（均值为0，方差为1）
    if scale:
        scaler = StandardScaler()
        data_scaled = scaler.fit_transform(expression_matrix)
    else:
        data_scaled = expression_matrix
    
    # PCA
    pca = PCA(n_components=n_components)
    pca_result = pca.fit_transform(data_scaled)
    
    return pca, pca_result, pca.explained_variance_ratio_

def plot_pca(pca_result, labels=None, groups=None, title="PCA"):
    """绘制PCA散点图"""
    plt.figure(figsize=(8, 6))
    
    if groups is not None:
        unique_groups = np.unique(groups)
        colors = plt.cm.Set3(np.linspace(0, 1, len(unique_groups)))
        
        for i, group in enumerate(unique_groups):
            mask = groups == group
            plt.scatter(pca_result[mask, 0], pca_result[mask, 1],
                       c=[colors[i]], label=group, s=100, alpha=0.7, edgecolors='white')
        plt.legend()
    else:
        plt.scatter(pca_result[:, 0], pca_result[:, 1], s=100, alpha=0.7)
    
    plt.xlabel(f'PC1', fontsize=12)
    plt.ylabel(f'PC2', fontsize=12)
    plt.title(title, fontsize=14, fontweight='bold')
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.show()

# 使用之前的模拟数据
groups = np.array(['Group1'] * 5 + ['Group2'] * 5 + ['Group3'] * 5)

# 执行PCA
pca, pca_result, variance_ratio = pca_analysis(expression_data, n_components=2)

print(f"PC1解释方差: {variance_ratio[0]*100:.2f}%")
print(f"PC2解释方差: {variance_ratio[1]*100:.2f}%")
print(f"累计解释方差: {sum(variance_ratio)*100:.2f}%")

# 绘制PCA图
plot_pca(pca_result, sample_labels, groups, "PCA of Gene Expression")

# 获取载荷（基因对主成分的贡献）
loadings = pca.components_.T
print(f"\n载荷矩阵形状: {loadings.shape}")

# 找出对PC1贡献最大的基因
top_genes_pc1 = np.argsort(np.abs(loadings[:, 0]))[-5:]
print(f"对PC1贡献最大的5个基因索引: {top_genes_pc1}")
```

**PCA分析可视化**：

![PCA分析](pca_analysis.png)

上图展示了PCA分析结果：
- **左图**：PCA散点图，不同颜色代表不同组别
- **右图**：各主成分解释的方差比例
- PC1和PC2通常能解释大部分变异

---

### 3.6 Motif发现

Motif是DNA或蛋白质序列中的保守模式，通常具有生物学功能。

```python
import numpy as np
import matplotlib.pyplot as plt
from collections import defaultdict

def build_pwm(sequences):
    """
    从一组序列构建位置权重矩阵（PWM）
    
    参数:
        sequences: 等长的序列列表
    
    返回:
        PWM矩阵 (4 x 序列长度)
    """
    seq_length = len(sequences[0])
    n_seqs = len(sequences)
    
    # 初始化计数矩阵
    counts = defaultdict(lambda: [0] * seq_length)
    
    # 计数
    for seq in sequences:
        for i, base in enumerate(seq):
            counts[base][i] += 1
    
    # 转换为频率（PWM）
    pwm = np.zeros((4, seq_length))
    bases = ['A', 'C', 'G', 'T']
    
    for i, base in enumerate(bases):
        pwm[i, :] = np.array(counts[base]) / n_seqs
    
    return pwm, bases

def calculate_information_content(pwm, background_freq=0.25):
    """
    计算信息含量（用于序列Logo）
    
    IC = sum(p * log2(p / background)) for each position
    """
    # 添加伪计数避免log(0)
    pwm = pwm + 1e-10
    
    ic = np.zeros(pwm.shape[1])
    for i in range(pwm.shape[1]):
        for j in range(4):
            if pwm[j, i] > 0:
                ic[i] += pwm[j, i] * np.log2(pwm[j, i] / background_freq)
    
    return ic

def scan_sequence(sequence, pwm, threshold=0.8):
    """
    用PWM扫描序列，寻找motif匹配
    
    返回匹配位置和得分
    """
    motif_length = pwm.shape[1]
    matches = []
    
    for i in range(len(sequence) - motif_length + 1):
        window = sequence[i:i+motif_length]
        score = 0
        for j, base in enumerate(window):
            base_idx = {'A': 0, 'C': 1, 'G': 2, 'T': 3}.get(base, -1)
            if base_idx >= 0:
                score += pwm[base_idx, j]
        
        max_possible = np.sum(np.max(pwm, axis=0))
        normalized_score = score / max_possible
        
        if normalized_score >= threshold:
            matches.append((i, normalized_score, window))
    
    return matches

# 测试数据（模拟TATA box序列）
tata_sequences = [
    "TATAAA",
    "TATAAT",
    "TATATA",
    "TATAAG",
    "TATAAA",
    "TATAAC",
    "TATAAA",
    "TATAAT"
]

# 构建PWM
pwm, bases = build_pwm(tata_sequences)

print("位置权重矩阵 (PWM):")
print("    ", "  ".join([f"P{i+1}" for i in range(pwm.shape[1])]))
for i, base in enumerate(bases):
    print(f"{base}: ", " ".join([f"{pwm[i,j]:.2f}" for j in range(pwm.shape[1])]))

# 计算信息含量
ic = calculate_information_content(pwm)
print(f"\n各位置信息含量: {[f'{x:.2f}' for x in ic]}")

# 扫描序列
test_seq = "ATCGTATAAAGCTATATATCG"
matches = scan_sequence(test_seq, pwm, threshold=0.85)
print(f"\n在序列中找到 {len(matches)} 个匹配:")
for pos, score, match in matches:
    print(f"  位置 {pos}: {match} (得分: {score:.3f})")
```

**序列Motif可视化**：

![序列Motif](sequence_motif.png)

上图展示了序列Motif的位置权重矩阵（PWM）：
- **堆叠高度**：该位置的信息含量
- **字母大小**：该碱基在该位置的出现频率
- **颜色**：A=红, C=蓝, G=橙, T=绿
- 可以清晰看到保守位置（如P1主要是T）

---

## 四、综合实战：RNA-seq数据分析流程

下面是一个完整的RNA-seq数据分析流程，整合前面所学的所有知识：

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from scipy import stats

class RNASeqAnalysis:
    """RNA-seq数据分析类"""
    
    def __init__(self, count_matrix, sample_info):
        """
        初始化
        
        参数:
            count_matrix: DataFrame (基因 x 样本)
            sample_info: DataFrame (样本信息)
        """
        self.counts = count_matrix
        self.sample_info = sample_info
        self.normalized_counts = None
        self.de_genes = None
    
    def filter_low_expression(self, min_count=10, min_samples=3):
        """过滤低表达基因"""
        keep = (self.counts >= min_count).sum(axis=1) >= min_samples
        self.counts = self.counts[keep]
        print(f"过滤后基因数: {len(self.counts)}")
    
    def normalize_cpm(self):
        """CPM标准化 (Counts Per Million)"""
        library_sizes = self.counts.sum(axis=0)
        self.normalized_counts = (self.counts / library_sizes) * 1e6
        print("CPM标准化完成")
    
    def normalize_log2(self, pseudocount=1):
        """log2转换"""
        if self.normalized_counts is None:
            self.normalize_cpm()
        self.log_counts = np.log2(self.normalized_counts + pseudocount)
        print("Log2转换完成")
    
    def pca_analysis(self, n_components=2):
        """PCA分析"""
        if not hasattr(self, 'log_counts'):
            self.normalize_log2()
        
        # 转置：样本 x 基因
        data = self.log_counts.T
        
        # 标准化
        scaler = StandardScaler()
        data_scaled = scaler.fit_transform(data)
        
        # PCA
        pca = PCA(n_components=n_components)
        pca_result = pca.fit_transform(data_scaled)
        
        # 可视化
        plt.figure(figsize=(8, 6))
        groups = self.sample_info['group']
        for group in groups.unique():
            mask = groups == group
            plt.scatter(pca_result[mask, 0], pca_result[mask, 1], 
                       label=group, s=100, alpha=0.7)
        
        plt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]*100:.1f}%)')
        plt.ylabel(f'PC2 ({pca.explained_variance_ratio_[1]*100:.1f}%)')
        plt.title('PCA of RNA-seq Samples')
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.show()
        
        return pca, pca_result
    
    def differential_expression(self, group_col='group', 
                                group1='control', group2='treatment'):
        """
        简单差异表达分析（t-test）
        
        注意：实际应使用DESeq2或edgeR等专业工具
        """
        if not hasattr(self, 'log_counts'):
            self.normalize_log2()
        
        # 获取样本
        samples1 = self.sample_info[self.sample_info[group_col] == group1].index
        samples2 = self.sample_info[self.sample_info[group_col] == group2].index
        
        results = []
        for gene in self.log_counts.index:
            expr1 = self.log_counts.loc[gene, samples1]
            expr2 = self.log_counts.loc[gene, samples2]
            
            # t-test
            t_stat, pvalue = stats.ttest_ind(expr1, expr2)
            
            # 计算log2 fold change
            log2fc = expr2.mean() - expr1.mean()
            
            results.append({
                'gene': gene,
                'log2FoldChange': log2fc,
                'pvalue': pvalue,
                'baseMean': (expr1.mean() + expr2.mean()) / 2
            })
        
        self.de_genes = pd.DataFrame(results)
        self.de_genes['padj'] = self.de_genes['pvalue'] * len(results)  # 简单Bonferroni校正
        
        return self.de_genes
    
    def volcano_plot(self, log2fc_threshold=1, padj_threshold=0.05):
        """绘制火山图"""
        if self.de_genes is None:
            raise ValueError("请先运行differential_expression()")
        
        df = self.de_genes.copy()
        df['-log10(padj)'] = -np.log10(df['padj'].replace(0, 1e-300))
        
        # 分类
        df['significance'] = 'Not significant'
        df.loc[(df['log2FoldChange'].abs() > log2fc_threshold) & 
               (df['padj'] < padj_threshold), 'significance'] = 'Significant'
        df.loc[(df['log2FoldChange'] > log2fc_threshold) & 
               (df['padj'] < padj_threshold), 'significance'] = 'Up-regulated'
        df.loc[(df['log2FoldChange'] < -log2fc_threshold) & 
               (df['padj'] < padj_threshold), 'significance'] = 'Down-regulated'
        
        # 绘图
        plt.figure(figsize=(10, 8))
        colors = {'Not significant': 'gray', 'Significant': 'blue',
                 'Up-regulated': 'red', 'Down-regulated': 'green'}
        
        for sig in df['significance'].unique():
            subset = df[df['significance'] == sig]
            plt.scatter(subset['log2FoldChange'], subset['-log10(padj)'],
                       c=colors[sig], label=sig, alpha=0.6, s=30)
        
        plt.axhline(-np.log10(padj_threshold), color='black', linestyle='--', alpha=0.5)
        plt.axvline(-log2fc_threshold, color='black', linestyle='--', alpha=0.5)
        plt.axvline(log2fc_threshold, color='black', linestyle='--', alpha=0.5)
        
        plt.xlabel('log2 Fold Change')
        plt.ylabel('-log10(adjusted p-value)')
        plt.title('Volcano Plot')
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.show()

# 使用示例（模拟数据）
np.random.seed(42)

# 创建模拟计数矩阵
n_genes = 1000
n_samples = 6
genes = [f"gene_{i}" for i in range(n_genes)]
samples = [f"sample_{i}" for i in range(n_samples)]

# 对照组和处理组
counts = np.random.negative_binomial(10, 0.5, size=(n_genes, n_samples))

# 添加差异表达基因
# 前100个基因在处理组中高表达
counts[:100, 3:] = counts[:100, 3:] * 3

# 创建DataFrame
count_df = pd.DataFrame(counts, index=genes, columns=samples)

# 样本信息
sample_info = pd.DataFrame({
    'sample': samples,
    'group': ['control'] * 3 + ['treatment'] * 3
}).set_index('sample')

# 运行分析
analysis = RNASeqAnalysis(count_df, sample_info)
analysis.filter_low_expression()
analysis.normalize_log2()

# PCA
pca, pca_result = analysis.pca_analysis()

# 差异表达
de_results = analysis.differential_expression()
significant = de_results[de_results['padj'] < 0.05]
print(f"差异表达基因数: {len(significant)}")

# 火山图
analysis.volcano_plot()
```

---

## 五、学习资源与建议

### 推荐学习路径

1. **Python基础**（1-2周）
   - 数据类型、控制流、函数
   - 文件操作、异常处理
   - 类与面向对象编程

2. **科学计算库**（1-2周）
   - NumPy数组操作
   - Pandas数据处理
   - Matplotlib可视化

3. **生信专项**（2-4周）
   - Biopython使用
   - 序列分析算法
   - 高通量数据处理

### 推荐资源

**在线教程**：
- [Biopython官方教程](https://biopython.org/wiki/Documentation)
- [Rosalind](http://rosalind.info/) - 生信编程练习平台
- [Python for Biologists](https://pythonforbiologists.com/)

**书籍**：
- 《Python生物信息学数据管理》
- 《Bioinformatics with Python Cookbook》

**实践项目**：
- 编写FASTA/FASTQ解析器
- 实现简单的序列比对工具
- 分析真实的RNA-seq数据

---

## 附录：常用代码片段

```python
# 1. 快速读取FASTA
def read_fasta(filename):
    from Bio import SeqIO
    return {record.id: str(record.seq) for record in SeqIO.parse(filename, "fasta")}

# 2. 计算所有序列的GC含量
def batch_gc_content(sequences):
    return {name: GC(seq) for name, seq in sequences.items()}

# 3. 序列长度过滤
def filter_by_length(sequences, min_len=100, max_len=10000):
    return {name: seq for name, seq in sequences.items() 
            if min_len <= len(seq) <= max_len}

# 4. 批量翻译
def batch_translate(dna_sequences):
    return {name: str(Seq(seq).translate()) for name, seq in dna_sequences.items()}

# 5. 查找motif
def find_motif(sequences, motif):
    results = {}
    for name, seq in sequences.items():
        positions = [i for i in range(len(seq)) if seq.startswith(motif, i)]
        if positions:
            results[name] = positions
    return results
```

---

> **结语**：Python是生物信息学领域最重要的编程语言之一。掌握Python基础语法和常用库后，你可以处理从序列分析到高通量测序数据的各种任务。建议多动手实践，通过实际项目加深理解。

---


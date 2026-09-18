---
jupyter:
  jupytext:
    cell_metadata_filter: -all
    formats: ipynb,md
    text_representation:
      extension: .md
      format_name: markdown
      format_version: '1.3'
      jupytext_version: 1.19.5
  kernelspec:
    display_name: Python 3
    language: python
    name: python3
---

# 基础概念与基础掌握

`AnnData`是专门为[[#类矩阵数据]]所设计的。这意味着我们有 𝑛 个观测值，每个观测值都可以表示为 𝑑 维向量，其中每个维度对应一个变量或特征。这个 𝑛 ×𝑑 矩阵的行和列都很特殊，因为它们都带有索引。

>[!tips]
>观测值我们可以看作是唯一的一个细胞即一个细胞即为一个观测值。在一个单细胞数据中我们的一个细胞即为一个观测值而每一个细胞的变量数就是我们的特征维度变量数可以看作为基因数。

## 单细胞数据（`scRNA-seq`）举例

在scRNA-seq数据中，每一行对应一个带有条形码的细胞，每一列对应一个带有基因ID的基因。此外，对于每个细胞和每个基因，我们可能还有额外的元数据，

1. 每个细胞的供体信息
2. 每个基因的替代基因符号。
最后，我们可能还有其他非结构化元数据，比如用于绘图的调色板。

# 优点

1. Handles sparsity  处理稀疏性
2. Handles unstructured data  
	处理非结构化数据
3. Handles observationand feature-level metadata  
	处理观测级和特征级元数据
4. s user-friendly  用户友好
   以下代码为一段引入$AnnData$依赖

   ```python

import numpy as np

import pandas as pd

import anndata as ad

from scipy.sparse import csr_matrix

from importlib.metadata import version

print(version("anndata"))

   ```
## 初始化$AnnData$
1. 首先构建一个包含一些稀疏计数信息的基本对象这些对象可能代表基因表达计数。
我们通过坡松分布创建了有100个细胞每一个细胞含有两千基因
```python
counts = csr_matrix(np.random.poisson(1,size=(100,2000)),dtype=np.float32)
adata = ad.AnnData(counts)
adata
print(adata)
```

1. 然后我们可以通过传入的初始数据来进行访问

```python
adata.X
```

1. 现在使用`.obs_names`为`obs`和`var`轴提供索引

```python
adata.obs_names = [f"Cell_{i:d}" for i in range(adata.n_obs)]
adata.var_names = [f"Gene_{i:d}" for i in range(adata.n_vars)]
print(adata.obs_names[:10])
```

## 对$AnnData$进行子集化

对1号细胞和10号细胞分别索引5号基因和第1900号基因

这些索引值可用于对AnnData进行子集化，从而提供AnnData对象的[[#视图]]。我们可以想象，这对于将AnnData子集化为感兴趣的特定细胞类型或基因模块非常有用。

```python
adata[["Cell_1", "Cell_10"], ["Gene_5", "Gene_1900"]]
```

# 添加[[##元数据]]

## 观测/变量级别

现在我们有了对象的核心部分，接下来我们想要在观测和变量级别添加元数据。使用 anndata 实现这一点非常简单，adata.obs 和 adata.var 都是 Pandas DataFrame。

```python
ct = np.random.choice(["B", "T", "Monocyte"], size=(adata.n_obs,))
adata.obs["cell_type"] = pd.Categorical(ct)
print(adata.obs)
```

## 非结构化元数据

AnnData 拥有 .uns，它允许存储任何非结构化元数据。这可以是任何内容，例如一个列表或字典，其中包含一些在分析我们的数据时很有用的通用信息。·

```python
adata.uns["random"] = [1, 2, 3]
print(adata.uns)
```

### 层

我们可能会有原始核心数据的不同形式，例如一个是经过标准化的，另一个则没有。这些可以存储在 AnnData 的不同层中。例如，让我们对原始数据进行对数变换，并将其存储在一个层中：

```python
adata.layers["log_transformed"] = np.log1p(adata.X)
print(adata)
```

# 通过 Annbatch 将 PyTorch 模型与 AnnData 对象集合对接

## 引用包

>[!WARNNING]
>`pip install pyro`并不能安装这个包，请使用以下安装方式`pip install pyro-ppl`

```python
import torch
import torch.nn as nn
import pyro
import pyro.distributions as dist
import numpy as np
import scanpy as sc
import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from annbatch import Loader
import anndata as ad
import pooch
pyro.clear_param_store()
class MLP(nn.Module):
    def __init__(self, input_dim, hidden_dims, out_dim):
        super().__init__()
        
        modules = []
        for in_size, out_size in zip([input_dim]+hidden_dims, hidden_dims):
            modules.append(nn.Linear(in_size, out_size))
            modules.append(nn.LayerNorm(out_size))
            modules.append(nn.ReLU())
            modules.append(nn.Dropout(p=0.05))
        modules.append(nn.Linear(hidden_dims[-1], out_dim))
        self.fc = nn.Sequential(*modules)
    
    def forward(self, *inputs):
        shape = dist.util.broadcast_shape(*[s.shape[:-1] for s in inputs]) + (-1,)
        inputs = [s.expand(shape) for s in inputs]
        
        input_cat = torch.cat(inputs, dim=-1)
        return self.fc(input_cat)
class CVAE(nn.Module):
    def __init__(self, input_dim, n_conds, n_classes, hidden_dims, latent_dim, classifier_dims=[128]):
        super().__init__()
        
        self.encoder = MLP(input_dim+n_conds, hidden_dims, 2*latent_dim) # output - mean and logvar of z
        
        self.decoder = MLP(latent_dim+n_conds+n_classes, hidden_dims[::-1], input_dim)
        self.theta = nn.Linear(n_conds, input_dim, bias=False)
        
        self.classifier = MLP(latent_dim, classifier_dims, n_classes)
        
        self.latent_dim = latent_dim
    
    def model(self, x, batches, classes, size_factors, supervised):
        pyro.module("cvae", self)
        
        batch_size = x.shape[0]
        
        with pyro.plate("data", batch_size):
            z_loc = x.new_zeros((batch_size, self.latent_dim))
            z_scale = x.new_ones((batch_size, self.latent_dim))
            z = pyro.sample("Z", dist.Normal(z_loc, z_scale).to_event(1))
            
            classes_probs = self.classifier(z).softmax(dim=-1)
            if supervised:
                obs = classes
            else:
                obs = None
            classes = pyro.sample("Class", dist.OneHotCategorical(probs=classes_probs), obs=obs)
            
            dec_mu = self.decoder(z, batches, classes).softmax(dim=-1) * size_factors[:, None]
            dec_theta = torch.exp(self.theta(batches))
            
            logits = (dec_mu + 1e-6).log() - (dec_theta + 1e-6).log()
            
            pyro.sample("X", dist.NegativeBinomial(total_count=dec_theta, logits=logits).to_event(1), obs=x.int())
        
    def guide(self, x, batches, classes, size_factors, supervised):
        batch_size = x.shape[0]
        
        with pyro.plate("data", batch_size):
            z_loc_scale = self.encoder(x, batches)
            
            z_mu = z_loc_scale[:, :self.latent_dim]
            z_var = torch.sqrt(torch.exp(z_loc_scale[:, self.latent_dim:]) + 1e-4)
            
            z = pyro.sample("Z", dist.Normal(z_mu, z_var).to_event(1))
            
            if not supervised:
                classes_probs = self.classifier(z).softmax(dim=-1)
                pyro.sample("Class", dist.OneHotCategorical(probs=classes_probs))
```

## 从两个$AnnData$对象拼接一个出来

```python
def download(url, fname, sha_hash):
    pooch.retrieve(
        url=url,
        known_hash=sha_hash,
        fname=fname,
        path=".",
        downloader=pooch.HTTPDownloader(
            progressbar=True,
            chunk_size=1024,
            timeout=120,
            headers={"User-Agent": "an/ndata/1.0.0 (https://github.com/scverse/anndata)"},
        ),
    )
download("https://scverse-exampledata.s3.eu-west-1.amazonaws.com/anndata/cite_covid_full.h5ad", "covid_cite.h5ad", "cb9745b2d642459926194961f34110a17c16ef6b11777304a3478e12bd682657")
download("https://scverse-exampledata.s3.eu-west-1.amazonaws.com/anndata/pbmc_seurat_v4.h5ad", "pbmc_seurat_v4.h5ad", "c3b0100a6ce27beb64eff53692e09f98da2a58cfdfea08d15ff204f834b41396")
```

# 专业术语

## 元数据

原数据METDATA就是对原有数据的一个补充和注释有了原数据数据才具备了可追溯可理解的背景。

### 元数据包含

1. 数据的来源与下载记录
   - 必须记录项目目录中所有数据的来源
   - 还需要记录数据下载的时间因为数据库的数据是会更新的
2. 样本与实验信息
3. 软件与运行环境信息

### 元数据的存储

1. 观测级与特征级元数据
2. 多维元数据
3. 非结构化元数据

### 元数据的意义

- 数据可追溯性
- 正确解释数据
- 确保可重复性

## 视图

试图就是给原始数据加了一个放大镜或者望远镜当我们透过这个镜子看数据时只可以看到数据的一部分呃但你看到的依然是原版数据本身而不是复印出来的副本因为是直接看原版数据所以随着你的镜子修改了看到的内容原本书写会跟着改变反之别人直接修改了原版数据你镜子里看到也会改变。

### 原理

仕途之所以不是不能复制原始数据是因为它仅仅改变了不长属性来重新映射索引到内存的偏移量

## 类矩阵数据

### 基础定义

- 数组：将具有相同类型的若干变量按有序形式组织起来的同类数据元素**集合**。所以我们的数组本质就是一个集合
- 矩阵：矩阵是一种变换或映射运算符的体现它的运算具有严格的数学规则。矩阵存储有规则的数据

>[!note]
>矩阵以数组的形式存在，一维数相当于向量，二维数组相当于矩阵，可将矩阵视为数组的子集

### 编程中的`类数组对象`

在编程语言中我们的类矩阵数据常常体现为类数组数据我们可以使用python列表等创建数组来数组作为矩阵

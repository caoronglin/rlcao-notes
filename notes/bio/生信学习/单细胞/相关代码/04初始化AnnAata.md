---
collection:
  profile: notebook
  id: bio
title: 04初始化AnnAata
date: 2026-10-06
---
# 04初始化AnnAata

```Python
import anndata as ad
import lamindb as ln
import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix

counts=csr_matrix(
	np.random.default_rng().poisson(1,size=(100,2000)),dtype=np.float32)
adata=ad.AnnData(counts)
print(adata.X)
```

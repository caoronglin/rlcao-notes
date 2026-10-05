---
collection:
  profile: notebook
  id: 数据分析
title: numpy数值计算
date: '2026-05-29 20:38:56'
---
# 数组对象
Numpy提供了高性能数组与矩阵运算处理能力
- 快速高效的多维数组对象$ndarray$
- 线性代数运算，舒立叶变换
## 数组创建
- 通过$array()$创建数组
```python
import numpy as np
a_arr=np.array([1,2,3,4,5,6])
print(a_arr)
```
>字符串一般不作为array的参数
- 创建等差数组
```python
#np.arrage([star],end,[step],dtype=None)
import numpy as np
a=np.arrage(5)
```
- 创建一个全零数组
```python
#np.zeros(shape)
```
- $ones()$ 创建全是一的数组
## 数组属性
---
# 数组的基本操作
# 数组的索引和切片

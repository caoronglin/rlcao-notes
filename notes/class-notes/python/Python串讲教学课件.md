---
title: "🐍 Python 程序设计串讲教学课件"
date: 2026-09-18
updated: 2026-09-18
collection:
  profile: notebook
  id: class-notes
---
# 🐍 Python 程序设计串讲教学课件

>**适用场景**：Python 期末/期中串讲复习课  
>**知识来源**：Python 知识库（西北农林科技大学《大学程序设计 Python》课程体系）  

---

## 第1章 Python 语言基础

### 1.1 核心知识点

| 知识点 | 说明 |
|--------|------|
| Python 简介 | 解释型、面向对象的高级编程语言 |
| 编程环境 | IDLE、PyCharm、VS Code 等 |
| 基本输入输出 | `input()` 接收字符串输入；`print()` 输出 |
| `eval()` 函数 | 将字符串作为 Python 表达式求值 |
| 变量与数据类型 | `int`、`float`、`str`、`bool` 等 |
| `math` 模块 | `math.pi`、`math.sqrt()`、`math.gcd()` 等 |
| 格式化输出 | `format()`、`f-string`、`%.2f` |

>⚠️ **易错提醒**：`input()` 始终返回字符串类型，数值计算前必须用 `int()`、`float()` 或 `eval()` 转换！
>
>⚠️ **安全警示**：`eval()` 可执行任意 Python 代码（如 `eval(input())` 时输入 `__import__('os').system('ls')` 会执行系统命令），**生产环境禁用**。教学示例中使用 `eval()` 仅为简化多值输入（如 `r, h = eval(input(…))`），**课堂上务必强调其安全风险**。推荐安全替代方案：

> ```python
> # 方法一：逐值输入（推荐）
> r = float(input("请输入半径 r: "))
> h = float(input("请输入高 h: "))
> 
> # 方法二：逗号分隔 + map 转换
> r, h = map(float, input("请输入半径 r, h (逗号分隔): ").split(','))
> 
> # 方法三：安全字面量解析（仅支持常量）
> import ast
> r, h = ast.literal_eval(input("..."))
> ```

---

### 1.2 典型例题

#### 例题 1：圆柱体表面积和体积

>输入半径 `r` 和高 `h`，计算圆柱体的表面积和体积（保留两位小数）。

```python
import math

r = float(input("请输入半径 r: "))
h = float(input("请输入高 h: "))

# 表面积 S = 2πr² + 2πrh
S = 2 * math.pi * r ** 2 + 2 * math.pi * r * h
# 体积 V = πr²h
V = math.pi * r ** 2 * h

print("表面积={:.2f}, 体积={:.2f}".format(S, V))
```

**样例输入**：`2, 1`  
**样例输出**：`表面积=37.70, 体积=12.57`

---

#### 例题 2：三个数的最大公约数

```python
import math

a, b, c = map(int, input("请输入三个整数（用空格分隔）: ").split())
result = math.gcd(a, b, c)   # Python 3.9+ 支持多个参数
print("最大公约数为", result)
```

**样例输入**：`12, 24, 36`  
**样例输出**：`最大公约数为 12`

---

#### 例题 3：判断闰年

>闰年规则：能被 4 整除但不能被 100 整除，**或**能被 400 整除。

```python
year = int(input("请输入年份: "))
if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):
    print("Yes")
else:
    print("No")
```

---

## 第2章 Python 代码基础

### 2.1 核心知识点

| 知识点 | 说明 |
|--------|------|
| 标识符命名规则 | 字母/下划线开头，不能使用关键字，区分大小写 |
| 运算符优先级 | `**` > `* / // %` > `+ -` > 比较 > `not` > `and` > `or` |
| 字符串操作 | 索引、切片 `[start:end:step]`、`len()`、`split()` |
| 转义字符 | `\n`（换行）、`\t`（制表符）、`\\`（反斜杠） |
| 类型转换 | `int()`、`float()`、`str()`、`bool()` |
| 注释 | 单行 `#`（唯一标准注释）；`"""…"""` 为**多行字符串/文档字符串**，常作多行注释的替代写法但非标准注释 |

---

### 2.2 典型例题

#### 例题 4：统计字符类型

>输入一行字符，分别统计英文字母、空格、数字和其他字符的个数。

```python
s = input("请输入一行字符: ")
letters = spaces = digits = others = 0

for c in s:
    if c.isalpha():       # 判断是否为字母
        letters += 1
    elif c.isspace():     # 判断是否为空格
        spaces += 1
    elif c.isdigit():     # 判断是否为数字
        digits += 1
    else:
        others += 1

print("字母: {}, 空格: {}, 数字: {}, 其他: {}".format(letters, spaces, digits, others))
```

---

#### 例题 5：统计字母 T 的个数（不区分大小写）

```python
s = input("请输入一段英文: ")
s_lower = s.lower()       # 统一转小写
count = s_lower.count('t')
print("字母 t 出现了", count, "次")
```

---

## 第3章 基本控制结构 ⭐

### 3.1 知识框架

```
控制结构
├── 顺序结构：按书写顺序从上到下执行
├── 选择结构（分支）
│   ├── 单分支：if
│   ├── 双分支：if...else
│   ├── 多分支：if...elif...else
│   ├── 三元表达式：x if 条件 else y
│   └── 嵌套：if 中再嵌套 if
└── 循环结构
    ├── for 循环：次数已知（遍历字符串、range()、列表）
    ├── while 循环：条件驱动
    ├── 循环嵌套
    ├── break：结束整个循环
    ├── continue：跳过本次迭代
    ├── pass：占位符（什么都不做）
    └── for/while...else：正常退出时执行 else
```

---

### 3.2 选择结构

#### 知识点

| 结构 | 语法 | 要点 |
|------|------|------|
| 单分支 | `if 条件:` | 条件为 True 才执行 |
| 双分支 | `if…else` | 必执行其中一个 |
| 多分支 | `if…elif…else` | 从上到下，**只执行第一个满足条件的分支** |
| 三元表达式 | `A if 条件 else B` | 单行简化写法 |

**条件表达式常用模板**：

| 场景 | 表达式 |
|------|--------|
| x 为偶数 | `x % 2 == 0` |
| x 是 3 的倍数且个位是 5 | `x % 3 == 0 and x % 10 == 5` |
| 三边能构成三角形 | `(a+b>c) and (b+c>a) and (a+c>b)` |
| year 为闰年 | `(year%4==0 and year%100!=0) or (year%400==0)` |

---

#### 例题 6：BMI 指数判断（多分支经典）

```python
height = float(input("请输入您的身高(米): "))
weight = float(input("请输入您的体重(千克): "))
BMI = weight / height / height
print("您的BMI指数是: {:.1f}".format(BMI))

if BMI < 18.5:
    print("您的体型偏瘦，要多吃多运动哦！")
elif BMI < 24:        # 利用 elif 互斥性，不需要写 18.5 <= BMI < 24
    print("您的体型正常，继续保持哟！")
elif BMI < 28:
    print("您的体型偏胖，有发福迹象！")
elif BMI < 32:
    print("不要悲伤，您是个迷人的胖子！")
else:
    print("什么也不说了，您照照镜子就知道了......")
```

>💡 **技巧**：利用 `elif` 从上到下匹配的**互斥特性**，后面分支只需写上限，不必重复写下限！

---

#### 例题 7：成绩等级判断（百分制 → 五分制）

```python
mark = float(input("请输入学生的考试成绩(0-100)："))
if mark >= 90:
    print(mark, "分，优秀")
elif mark >= 80:
    print(mark, "分，良好")
elif mark >= 60:
    print(mark, "分，及格")
else:
    print(mark, "分，不及格")
```

---

#### 例题 8：地铁票价计算（多分支 Vs 嵌套对比）

>规则：1-4 站 3 元/人，5-9 站 4 元/人，9 站以上 5 元/人。

```python
person = int(input("请输入乘车人数："))
n = int(input("请输入乘坐站数："))

# 方法一：多分支
if n > 9:
    pay = person * 5
elif 5 <= n <= 9:
    pay = person * 4
else:
    pay = person * 3

# 方法二：嵌套
# if n <= 9:
#     if n < 5:
#         pay = person * 3
#     else:
#         pay = person * 4
# else:
#     pay = person * 5

print("应付款为：", pay)
```

---

#### 例题 9：商场促销折扣计算

>会员：消费 ≥200 打 8 折，≥100 打 9 折，<100 不打折  
>非会员：消费 ≥200 打 9.5 折，<200 不打折

```python
is_member = input("是否会员？(y/n): ")
amount = float(input("消费金额: "))

if is_member == 'y':
    if amount >= 200:
        pay = amount * 0.8
    elif amount >= 100:
        pay = amount * 0.9
    else:
        pay = amount
else:
    if amount >= 200:
        pay = amount * 0.95
    else:
        pay = amount

print("应付款为:", pay)
```

---

### 3.3 循环结构

#### 知识点

| 结构 | 适用场景 | 语法 |
|------|----------|------|
| `for` | **循环次数固定且已知** | `for 变量 in 迭代器:` |
| `while` | **循环次数不明确**，有清晰终止条件 | `while 条件:` |

**range() 函数**：

| 写法 | 含义 |
|------|------|
| `range(n)` | 0, 1, 2, …, n-1 |
| `range(m, n)` | m, m+1, …, n-1 |
| `range(m, n, d)` | 以步长 d 从 m 到 n-1 |

**循环三要素**：① 循环变量初始化 → ② 循环体 → ③ 循环终止条件变化（必须放在循环体内）

>⚠️ **核心区分**：
> - `break`：**结束整个循环**，彻底退出
> - `continue`：**跳过本次**循环剩余语句，进入下一次迭代
> - `pass`：**什么都不做**，仅占位
> - `for/while…else`：循环**正常退出**（非 break）时执行 else 块

---

#### 例题 10：统计英文句子中各类字符数（for 遍历字符串）

```python
s = input("请输入一句英文: ")
count_upper = count_lower = count_digit = 0

for ch in s:
    if ch.isupper():
        count_upper += 1
    if ch.islower():
        count_lower += 1
    if ch.isdigit():
        count_digit += 1

print("大写: {}, 小写: {}, 数字: {}".format(count_upper, count_lower, count_digit))
```

---

#### 例题 11：求序列最值（while + 哨兵值）

>输入非负整数序列（-1 终止），求最小值、最大值和平均值。

```python
count = total = 0
print("请输入非负整数，以 -1 作为输入结束！")
num = int(input("输入数据: "))
min_num = max_num = num

while num != -1:
    count += 1
    total += num
    if num < min_num:
        min_num = num
    if num > max_num:
        max_num = num
    num = int(input("输入数据: "))

if count > 0:
    print("最小: {}, 最大: {}, 均值: {:.2f}".format(min_num, max_num, total/count))
else:
    print("输入为空")
```

---

#### 例题 12：素数判定（for…else 经典用法）

```python
n = int(input("输入一个正整数: "))

for i in range(2, n):
    if n % i == 0:
        print(n, "不是素数")
        break
else:
    print(n, "是素数")
```

>💡 **关键**：`for…else` 中，若循环被 `break` 中断，**不执行** else 块。

---

#### 例题 13：水仙花数（三位数各位立方和 = 自身）

```python
for i in range(100, 1000):
    a = i // 100          # 百位
    b = i // 10 % 10      # 十位
    c = i % 10            # 个位
    if a**3 + b**3 + c**3 == i:
        print(i, end=" ")

# 输出: 153 370 371 407
```

---

#### 例题 14：四位数玫瑰花数

>每位数字的 4 次幂之和等于本身。

```python
for i in range(1000, 10000):
    a = i // 1000
    b = i // 100 % 10
    c = i // 10 % 10
    d = i % 10
    if a**4 + b**4 + c**4 + d**4 == i:
        print(i, end=" ")

# 输出: 1634 8208 9474
```

---

#### 例题 15：求 1! + 2! + 3! + 4! + 5!（循环嵌套）

```python
s = 0
for n in range(1, 6):
    T = 1              # ⚠️ 外循环每次必须重置 T = 1！
    for i in range(1, n + 1):
        T = T * i
    s = s + T
print(s)  # 153
```

>⚠️ **经典易错**：外层循环中累乘变量 `T` 必须重置为 1，否则会累积前面的结果！

---

#### 例题 16：斐波那契数列前 20 项

```python
x1, x2 = 1, 1
count = 2
print("{:>8}{:>8}".format(x1, x2), end='')

for i in range(3, 21):
    x3 = x1 + x2
    print("{:>8}".format(x3), end='')
    count += 1
    if count % 4 == 0:
        print()        # 每行输出 4 个
    x1, x2 = x2, x3

# 输出: 1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987 1597 2584 4181 6765
```

---

#### 例题 17：π 的级数逼近

>π/4 = 1 - 1/3 + 1/5 - 1/7 + …（直到某项绝对值 < 10⁻⁴）

```python
import math

PI = 0
i = 1
sign = 1

while abs(1 / (2*i - 1)) >= 1e-4:
    PI += sign * (1 / (2*i - 1))
    sign = -sign       # 交替正负号
    i += 1

print("π ≈", PI * 4)
print("误差:", abs(math.pi - PI * 4))
```

---

#### 例题 18：输出星号图形（循环嵌套）

```
*
**
***
****
*****
******
*****
****
***
**
*
```

```python
# 上半部分
for i in range(1, 7):
    print('*' * i)

# 下半部分
for i in range(5, 0, -1):
    print('*' * i)
```

---

### 3.4 Random 库速查

| 函数 | 功能 | 示例 |
|------|------|------|
| `random()` | [0.0, 1.0) 随机浮点数 | `random.random()` |
| `randint(m, n)` | [m, n] 随机整数 | `random.randint(1, 100)` |
| `randrange(m, n, d)` | range(m, n, d) 中随机取 | `random.randrange(0, 101, 2)` |
| `choice(seq)` | 从序列中随机选一个 | `random.choice(['A','B','C'])` |
| `uniform(m, n)` | [m, n] 随机浮点数 | `random.uniform(1.5, 3.5)` |
| `sample(pop, k)` | 随机抽取 k 个不重复元素 | `random.sample(range(100), 10)` |
| `shuffle(seq)` | 原地打乱序列 | `random.shuffle(ls)` |
| `seed(n)` | 设置随机种子（保证可复现） | `random.seed(42)` |

---

## 第4章 复合数据类型 ⭐

### 4.1 四种类型总览

| 类型 | 可变性 | 有序性 | 元素是否可重复 | 符号 | 典型用途 |
|------|--------|--------|:---:|------|----------|
| **列表 (list)** | ✅ 可变 | ✅ 有序 | ✅ 可重复 | `[]` | 有序数据集合 |
| **元组 (tuple)** | ❌ 不可变 | ✅ 有序 | ✅ 可重复 | `()` | 固定数据、函数多返回值 |
| **字典 (dict)** | ✅ 可变 | ❌ 无序 | 键不可重复 | `{}` | 键值对映射 |
| **集合 (set)** | ✅ 可变 | ❌ 无序 | ❌ 元素不可重复 | `{ }` 或 `set()` | 去重、集合运算 |

---

### 4.2 列表（List）

#### 知识点

**创建方式**：

```python
ls1 = [1, 2, 3, 4, 5]                    # 直接创建
ls2 = list(range(1, 6))                  # list() 转换
ls3 = list(map(int, input().split()))     # 空格分隔输入列表
ls4 = [i**2 for i in range(1, 11)]       # 列表生成式（推导式）
ls5 = [[0]*4 for _ in range(3)]          # 二维列表（3行4列）
```

**索引与切片**：

```python
scores = [98, 96, 95, 94, 92]
scores[2]    # 95（正向索引，从 0 开始）
scores[-3]   # 95（反向索引，从 -1 开始）
scores[1:4]  # [96, 95, 94]（切片，左闭右开）
scores[::-1] # [92, 94, 95, 96, 98]（反转）
```

**常用方法速查**：

| 操作 | 语法 | 说明 |
|------|------|------|
| 尾部添加 | `ls.append(x)` | 在末尾追加一个元素 |
| 指定位置插入 | `ls.insert(i, x)` | 在索引 i 处插入 x |
| 按索引删除 | `del ls[i]` | 删除索引 i 的元素 |
| 弹出 | `ls.pop(i)` | 删除并返回索引 i 的元素（默认最后一个） |
| 按值删除 | `ls.remove(x)` | 删除第一个值为 x 的元素 |
| 原地排序 | `ls.sort(reverse=False)` | 升序；`reverse=True` 降序 |
| 生成新排序列表 | `sorted(ls)` | **不改变原列表** |
| 查找索引 | `ls.index(x)` | 返回 x 首次出现的索引 |
| 统计 | `ls.count(x)` | 统计 x 出现次数 |
| 扩展 | `ls.extend(other)` | 将 other 的元素追加到 ls |
| 连接 | `ls1 + ls2` | 生成新列表 |
| 统计函数 | `min(ls)`, `max(ls)`, `sum(ls)` | 数值列表专用 |

>⚠️ **深浅拷贝**：
> - `ls2 = ls1` → 引用赋值（共享空间，改一个影响另一个）
> - `ls2 = ls1.copy()` → **浅拷贝**（仅顶层独立；若列表中还有可变对象，嵌套层仍共享引用）
> - `ls3 = copy.deepcopy(ls1)` → **深拷贝**（完全独立，需 `import copy`）
>
>💡 **验证**：`ls1 = [[1,2],[3,4]]; ls2 = ls1.copy(); ls2[0][0]=99` → `ls1[0][0]` 也会变为 99！

---

#### 例题 19：学生信息管理（列表综合操作）

```python
student = [['001', '李梅', 19], ['002', '韩磊磊', 21], ['003', '张亮', 18]]

# (1) 添加学生
student.append(['004', '王大锤', 20])
student.append(['006', '刘大刀', 23])

# (2) 在指定位置插入
student.insert(3, ['005', '赵小刀', 22])

# (3) 按学号查找
target = '002'
for s in student:
    if s[0] == target:
        print("找到:", s)

# (4) 输出所有姓名
names = [s[1] for s in student]
print(names)

# (5) 输出年龄 > 19 的学生
older = [s for s in student if s[2] > 19]
print(older)

# (6) 计算平均年龄
avg_age = sum(s[2] for s in student) / len(student)
print("平均年龄: {:.1f}".format(avg_age))
```

---

#### 例题 20：选手得分计算（去最高最低求均值）

```python
n = int(input("评委人数: "))

if n < 3:
    print("评委人数不足3人，无法计算！")
else:
    scores = []
    for i in range(n):
        scores.append(float(input("第{}位评委打分: ".format(i+1))))

    scores.sort()
    # 去掉一个最高分和一个最低分
    final_score = sum(scores[1:-1]) / (len(scores) - 2)
    print("选手最终得分: {:.1f}".format(final_score))
```

---

#### 例题 21：列表生成式应用（百钱买百鸡）

>鸡翁一值钱五，鸡母一值钱三，鸡雏三值钱一。百钱买百鸡。

```python
# 列表生成式一行搞定
result = [(x, y, z) 
          for x in range(0, 21) 
          for y in range(0, 34) 
          for z in range(0, 101) 
          if x + y + z == 100 and z % 3 == 0 and 5*x + 3*y + z//3 == 100]

for r in result:
    print("鸡翁: {}, 鸡母: {}, 鸡雏: {}".format(*r))
```

---

#### 例题 22：列表元素变换（偶数 → 0）

```python
lst = list(map(int, input("请输入列表元素: ").split()))
new_lst = [0 if x % 2 == 0 else x for x in lst]
print(*new_lst)
```

**样例输入**：`1 2 3 4 5 6`  
**样例输出**：`1 0 3 0 5 0`

---

#### 例题 23：杨辉三角（二维列表）

```python
n = 6
triangle = []
for i in range(n):
    row = [1] * (i + 1)
    for j in range(1, i):
        row[j] = triangle[i-1][j-1] + triangle[i-1][j]
    triangle.append(row)

for row in triangle:
    print(row)

# 输出:
# [1]
# [1, 1]
# [1, 2, 1]
# [1, 3, 3, 1]
# [1, 4, 6, 4, 1]
# [1, 5, 10, 10, 5, 1]
```

---

### 4.3 元组（Tuple）

#### 知识点

- **不可变序列**：创建后不能修改（不能增删改元素）
- **创建**：`t = (1, 2, 3)` 或 `t = 1, 2, 3`（逗号是关键）
- **单元素元组**：必须加逗号 `t = (1,)`
- **支持的操作**：索引访问、切片、`len()`、`in`、`count()`、`index()`
- **不支持的操作**：`append()`、`insert()`、`remove()`、`pop()`、`sort()`（原地）
- `sorted(t)` 返回的是**列表**，不是元组
- **典型用途**：函数多返回值、作为字典的键、存储固定配置

---

#### 例题 24：元组与列表转换

```python
# 列表 → 元组
ls = [98, 96, 95, 94, 92]
t = tuple(ls)
print(t, type(t))   # (98, 96, 95, 94, 92) <class 'tuple'>

# 元组 → 列表
t2 = (1, 2, 3, 4, 5)
ls2 = list(t2)
print(ls2, type(ls2))  # [1, 2, 3, 4, 5] <class 'list'>

# 字符串 → 列表（按分隔符）
s = "张三丰, 萧峰, 杨过"
ls3 = s.split(', ')    # ['张三丰', '萧峰', '杨过']
```

---

### 4.4 字典（Dictionary）

#### 知识点

- **键值对**存储，键必须**唯一**且**不可变**（字符串、数字、元组）
- **访问**：`dict[key]`（键不存在报错）或 `dict.get(key, default)`（安全）
- **增/改**：`dict[key] = value`（键不存在则添加，存在则修改）

| 方法 | 说明 |
|------|------|
| `keys()` | 返回所有键 |
| `values()` | 返回所有值 |
| `items()` | 返回所有键值对 |
| `get(key, default)` | 安全取值 |
| `pop(key)` | 删除并返回值 |
| `update(d2)` | 合并字典（相同键会覆盖） |
| `in` | 判断键是否存在 |

**遍历字典**：

```python
for k, v in d.items():   # 推荐：同时取键和值
    print(k, v)
```

---

#### 例题 25：统计字符出现次数

```python
sentence = "Life is short, we need Python."
sentence = sentence.lower()
counts = {}

for c in sentence:
    counts[c] = counts.get(c, 0) + 1   # 巧用 get() 初始化

for c, n in sorted(counts.items()):
    print("'{}': {}".format(c, n))
```

---

#### 例题 26：字典按值排序

```python
dic = {'俄罗斯': 1707.5, '加拿大': 997.1, '中国': 960.1, '美国': 936.4}

# 按值（面积）排序
sorted_items = sorted(dic.items(), key=lambda x: x[1], reverse=True)
for country, area in sorted_items:
    print("{}的面积是{}万平方公里".format(country, area))
```

---

### 4.5 集合（Set）

#### 知识点

- **三大特性**：无序、互异（自动去重）、元素不可变
- **创建**：`s = {1, 2, 3}` 或 `s = set([1, 2, 3])`
- ⚠️ **空集合**：必须用 `set()`，`{}` 创建的是空字典！

| 操作 | 运算符 | 方法 |
|------|:---:|------|
| 并集 | `A \| B` | `A.union(B)` |
| 交集 | `A & B` | `A.intersection(B)` |
| 差集 | `A - B` | `A.difference(B)` |
| 对称差集 | `A ^ B` | `A.symmetric_difference(B)` |
| 添加 | — | `add(item)`、`update(items)` |
| 删除 | — | `remove(item)`（不存在报错）、`discard(item)`（不存在不报错） |

---

#### 例题 27：列表去重

```python
nums = [int(i) for i in input("请输入整数: ").split()]
unique_count = len(set(nums))
print("不同元素的个数:", unique_count)
```

**样例输入**：`1 2 3 2 1 4 5 4`  
**样例输出**：`不同元素的个数: 5`

---

#### 例题 28：集合运算（编程语言排行榜）

```python
setA = {'Python', 'C++', 'C', 'Java', 'C#'}
setB = {'Java', 'C', 'Python', 'C++', 'VB.NET'}

print("所有上榜语言:", setA | setB)         # 并集
print("同时进前五的语言:", setA & setB)      # 交集
print("只在A榜的语言:", setA - setB)         # 差集
print("只在一个榜的语言:", setA ^ setB)      # 对称差集
```

---

## 第5章 程序设计方法与算法 ⭐

### 5.1 核心概念

>**核心公式**：**数据结构 + 算法 = 程序**

**程序设计五步法**：分析问题 → 建立数学模型 → 设计算法 → 编写程序 → 调试运行

**本节五大算法**：

| 算法 | 核心思想 | 典型问题 |
|------|----------|----------|
| **递推法** | 从前项推出后项（顺推）或从后项推出前项（逆推） | 斐波那契、猴子吃桃 |
| **迭代法** | 同一变量不断用新值替代旧值 | 牛顿迭代法求根 |
| **穷举法** | 列出所有可能，逐一验证 | 百钱买百鸡、水仙花数 |
| **查找算法** | 顺序查找（O(n)）、二分查找（O(log n)） | 数据检索 |
| **排序算法** | 冒泡、选择、插入排序 | 数据排序 |

---

### 5.2 递推法

#### 例题 29：斐波那契数列（顺推法）

```python
fib = [1, 1]                        # 初始化前两项
for i in range(2, 20):
    fib.append(fib[i-1] + fib[i-2]) # 递推关系

for i in range(0, 20):
    print(fib[i], end=' ')
```

---

#### 例题 30：猴子吃桃（逆推法）

>第 10 天早上只剩 1 个。每天吃前一天剩下的一半多一个。问第一天摘了多少？

```python
peach = [0] * 11
peach[10] = 1                      # 第 10 天剩 1 个

for i in range(9, 0, -1):
    peach[i] = 2 * (peach[i+1] + 1)  # 逆推公式

print("第一天共摘了", peach[1], "个桃子")  # 1534
```

---

### 5.3 迭代法

#### 例题 31：斐波那契数列（迭代法）

```python
a = b = 1
print(a, b, end=" ")
for i in range(3, 21):
    c = a + b
    a, b = b, c          # 变量滚动更新
    print(c, end=" ")
```

>💡 迭代 vs 递推：迭代法用**同一个变量不断更新**，不需要列表存储全部结果。

---

#### 例题 32：牛顿迭代法求方程根

>求 f(x) = x³ - 2x² + 4x + 1 = 0 在 x=0 附近的根。  
>迭代公式：xₙ = xₙ₋₁ − f(xₙ₋₁) / f'(xₙ₋₁)

```python
x0 = x1 = 0
e = 0.000001
n = 0

while n == 0 or abs(x0 - x1) > e:
    x0 = x1
    f = x0**3 - 2*x0**2 + 4*x0 + 1
    f1 = 3*x0**2 - 4*x0 + 4
    x1 = x0 - f / f1
    n += 1
    print("第{}次迭代: x = {}".format(n, x1))

print("近似根:", x1)
```

---

### 5.4 穷举法

#### 例题 33：百钱买百鸡（穷举 + 优化）

```python
# 优化后：缩小范围 + 减少循环层数
for x in range(0, 21):          # 公鸡最多 20 只
    for y in range(0, 34):      # 母鸡最多 33 只
        z = 100 - x - y         # 减少一重循环
        if z % 3 == 0 and 5*x + 3*y + z//3 == 100:
            print("鸡翁: {}, 鸡母: {}, 鸡雏: {}".format(x, y, z))
```

**优化技巧**：① 缩小搜索范围 → ② 减少循环变量 → ③ 利用等式约束消元

---

### 5.5 查找算法

#### 例题 34：顺序查找

```python
lst = [15, 8, 4, 13, 6, 10, 17, 1]
x = int(input('请输入要查找的数: '))

for i in range(len(lst)):
    if lst[i] == x:
        print("找到 {}, 位置为 {}".format(x, i))
        break
else:
    print("未找到", x)
```

---

#### 例题 35：二分查找（要求有序）

```python
lst = [10, 30, 50, 70, 90, 110, 130, 150, 170]  # 必须有序
x = int(input('请输入要查找的数: '))

low, high = 0, len(lst) - 1
while low <= high:
    mid = (low + high) // 2
    if lst[mid] == x:
        print("找到 {}, 位置为 {}".format(x, mid))
        break
    elif lst[mid] > x:
        high = mid - 1       # 在左半区查找
    else:
        low = mid + 1        # 在右半区查找
else:
    print("未找到", x)
```

---

### 5.6 排序算法

#### 知识点对比

| 算法 | 基本思想 | 时间复杂度 | 核心特点 |
|------|----------|:---:|------|
| **冒泡排序** | 相邻比较，逆序交换，大数"沉底" | O(n²) | 每轮可能多次交换 |
| **选择排序** | 每轮找最小/最大，与首位置交换 | O(n²) | 每轮只交换一次 |
| **插入排序** | 取待排元素，插入有序序列 | O(n²) | 适合基本有序的数据 |

---

#### 例题 36：冒泡排序

```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):              # n-1 趟
        for j in range(0, n - i - 1):   # 每趟 n-i 次比较
            if arr[j] > arr[j + 1]:     # 前 > 后则交换
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

lst = [9, 8, 5, 4, 2, 0]
print(bubble_sort(lst))   # [0, 2, 4, 5, 8, 9]
```

---

#### 例题 37：选择排序

```python
def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]   # 每轮只交换一次
    return arr

lst = [88, 84, 83, 87, 61]
print(selection_sort(lst))  # [61, 83, 84, 87, 88]
```

---

#### 例题 38：插入排序

```python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]   # 后移腾位置
            j -= 1
        arr[j + 1] = key          # 插入正确位置
    return arr

lst = [11.4, 11.19, 10.81, 11.3, 10.88, 10.94]
print(insertion_sort(lst))
```

---

#### 例题 39：数值积分——矩形法求定积分

>用矩形法求 ∫₀¹ 1/(1+x²) dx（n 等分）

```python
def f(x):
    return 1 / (1 + x**2)

a, b = 0, 1
n = 1000
h = (b - a) / n

area = 0
for i in range(n):
    area += f(a + i * h) * h

print("定积分近似值:", area)  # 约 π/4 ≈ 0.785
```

---

## 第6章 函数与模块化程序设计 ⭐

### 6.1 知识框架

```
函数
├── 定义：def func_name(params):
├── 四要素：函数名、形参（输入）、函数体（处理）、返回值（输出）
├── 参数传递
│   ├── 位置参数：按顺序一一对应
│   ├── 关键字参数：func(a=1, b=2)（不按顺序）
│   ├── 默认参数：def func(n, m=1)（有默认值的必须放最后）
│   └── 可变参数：*args（元组）、**kwargs（字典）
├── 返回值：return（多值返回为元组）
├── 递归函数：函数调用自身（基例 + 递归链条）
├── 变量作用域
│   ├── 局部变量：函数内部定义
│   ├── 全局变量：函数外部定义
│   └── global 关键字：函数内声明使用全局变量
└── lambda 表达式：匿名函数，单行表达式
```

---

### 6.2 函数定义与参数

#### 例题 40：三角形面积函数（海伦公式）

```python
import math

def area(a, b, c):
    """计算三角形面积（海伦公式）"""
    p = (a + b + c) / 2
    s = math.sqrt(p * (p - a) * (p - b) * (p - c))
    return s

# 调用
print("面积:", area(9.8, 9.3, 6.4))  # 28.705...
```

---

#### 例题 41：参数传递方式对比

```python
# 位置参数
def power(x, n):
    return x ** n

print(power(2, 3))     # 8 → 2→x, 3→n

# 关键字参数（不按顺序）
print(power(n=3, x=2)) # 8

# 默认参数（有默认值的放最后）
def power(x, n=2):
    return x ** n

print(power(5))        # 25 → n 使用默认值 2
print(power(5, 3))     # 125 → n 被覆盖为 3
```

---

#### 例题 42：可变参数 *args

```python
def multiply(n, *args):
    """计算 n 与所有可变参数的乘积"""
    result = n
    for item in args:
        result *= item
    return result

print(multiply(10, 3))           # 30
print(multiply(10, 3, 5, 8))     # 1200
```

---

### 6.3 递归函数

#### 例题 43：阶乘（递归实现）

```python
def factorial(n):
    if n == 0 or n == 1:   # 基例
        return 1
    else:                   # 递归链条
        return n * factorial(n - 1)

print(factorial(5))   # 120
```

**递归执行过程**：

```
factorial(5) = 5 × factorial(4)
            = 5 × 4 × factorial(3)
            = 5 × 4 × 3 × factorial(2)
            = 5 × 4 × 3 × 2 × factorial(1)
            = 5 × 4 × 3 × 2 × 1 = 120
```

---

#### 例题 44：斐波那契数列（递归实现）

```python
def fib(n):
    if n == 1 or n == 2:       # 基例
        return 1
    else:                       # 递归链条
        return fib(n - 1) + fib(n - 2)

for i in range(1, 21):
    print(fib(i), end=' ')
```

>⚠️ 递归 vs 迭代效率：递归 O(1.6ⁿ) vs 迭代 O(n)，递归代码简洁但效率低。

---

#### 例题 45：汉诺塔问题

```python
def hanoi(n, a, b, c):
    """
    n: 盘子数
    a: 源柱子  b: 辅助柱子  c: 目标柱子
    """
    if n == 1:
        print(a, '-->', c)
    else:
        hanoi(n - 1, a, c, b)   # 将 n-1 个从 A 移到 B
        print(a, '-->', c)      # 将最大的从 A 移到 C
        hanoi(n - 1, b, a, c)   # 将 n-1 个从 B 移到 C

hanoi(3, 'A', 'B', 'C')
```

**输出**：

```
A --> C
A --> B
C --> B
A --> C
B --> A
B --> C
A --> C
```

---

### 6.4 变量作用域

#### 例题 46：局部变量与全局变量

```python
x = 10    # 全局变量

def f():
    x = 5  # 局部变量（与全局 x 不同）
    print("函数内部: x =", x)
    return x

print("f() =", f())       # 函数内部: x = 5, f() = 5
print("函数外部: x =", x)  # 函数外部: x = 10（全局未变）
```

---

#### 例题 47：用 Global 修改全局变量

```python
x = 10

def f():
    global x      # 声明 x 是全局变量
    x = 5
    print("函数内部: x =", x)
    return x * x

print("f() =", f())       # 函数内部: x = 5, f() = 25
print("函数外部: x =", x)  # 函数外部: x = 5（全局被修改！）
```

---

#### 例题 48：组合数据类型的特殊规则

```python
ls = ["F", "f"]           # 全局列表

def func(a):
    ls.append(a)          # ls 未在函数内真实创建 → 等同全局变量
    return

func("C")
print(ls)                 # ['F', 'f', 'C'] → 全局列表被修改！
```

---

### 6.5 Lambda 表达式

#### 例题 49：lambda 基础用法

```python
# 匿名函数：求两数和
add = lambda x, y: x + y
print(add(10, 20))   # 30

# 作为 sort 的 key
students = [
    {"name": "张三", "age": 18},
    {"name": "李四", "age": 19},
    {"name": "王五", "age": 17}
]
students.sort(key=lambda s: s['age'])    # 按年龄排序
print(students)

students.sort(key=lambda s: s['name'])   # 按姓名排序
print(students)
```

---

### 6.6 综合编程题

#### 例题 50：判断素数 + 求区间素数和（函数嵌套调用）

```python
def is_prime(n):
    """判断 n 是否为素数"""
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

def prime_sum(m, n):
    """求 [m, n] 区间内所有素数的和"""
    total = 0
    for i in range(m, n + 1):
        if is_prime(i):
            total += i
    return total

print(prime_sum(1, 100))   # 1060
```

---

#### 例题 51：求 a 到 B 之间的回文素数

```python
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

def is_palindrome(n):
    """判断是否为回文数"""
    return str(n) == str(n)[::-1]

def palindrome_primes(a, b):
    result = []
    for i in range(a, b + 1):
        if is_prime(i) and is_palindrome(i):
            result.append(i)
    return result

print(palindrome_primes(2, 200))  # [2, 3, 5, 7, 11, 101, 131, 151, 181, 191]
```

---

## 第7章 文件操作

### 7.1 知识框架

```
文件操作
├── 文件三步骤：打开 → 读写 → 关闭
├── open(file, mode)
│   ├── 'r'：只读（文件必须存在）
│   ├── 'w'：只写（覆盖/新建）
│   ├── 'a'：追加写（不覆盖）
│   ├── 'r+'/'w+'/'a+'：读写模式
│   └── 'b'：二进制模式
├── 读操作
│   ├── f.read()：读取全部
│   ├── f.read(n)：读取 n 个字符
│   ├── f.readline()：读取一行
│   └── f.readlines()：读取全部行（返回列表）
├── 写操作
│   ├── f.write(str)：写入字符串
│   └── f.writelines(seq)：写入字符串序列
├── with 语句：自动关闭文件（推荐）
└── 文件路径：绝对路径 vs 相对路径
```

---

### 7.2 读写模式速查

| 模式 | 读 | 写 | 文件不存在 | 说明 |
|:---:|:---:|:---:|:---:|:---|
| `'r'` | ✅ | ❌ | 报错 | 只读模式（默认） |
| `'r+'` | ✅ | ✅ | 报错 | **可读可写，不清空文件**，写入从指针位置覆写 |
| `'w'` | ❌ | ✅ | 新建 | **清空重建**，覆盖全部原有内容 |
| `'w+'` | ✅ | ✅ | 新建 | **清空重建**，可读写 |
| `'a'` | ❌ | ✅ | 新建 | 追加写，不覆盖原有内容 |
| `'a+'` | ✅ | ✅ | 新建 | 追加并读写，不覆盖原有内容 |

---

### 7.3 典型例题

#### 例题 52：基本文件读写

```python
# 写文件
f = open('test.txt', 'w', encoding='utf-8')
f.write("Hello, Python!\n")
f.write("这是第二行。\n")
f.close()

# 读文件
f = open('test.txt', 'r', encoding='utf-8')
content = f.read()
print(content)
f.close()
```

---

#### 例题 53：使用 with 语句（推荐写法）

```python
# with 语句自动关闭文件，无需手动 f.close()
with open('scores.txt', 'w', encoding='utf-8') as f:
    f.write("张三 90\n")
    f.write("李四 85\n")
    f.write("王五 92\n")

# 读取并处理
with open('scores.txt', 'r', encoding='utf-8') as f:
    for line in f.readlines():
        name, score = line.strip().split()
        print("{}的成绩是{}分".format(name, score))
```

---

#### 例题 54：追加写入

```python
# 第一次写入
with open('log.txt', 'w', encoding='utf-8') as f:
    f.write("第1条日志\n")

# 追加写入（不覆盖原有内容）
with open('log.txt', 'a', encoding='utf-8') as f:
    f.write("第2条日志\n")
    f.write("第3条日志\n")

# 查看文件
with open('log.txt', 'r', encoding='utf-8') as f:
    print(f.read())
```

**输出**：

```
第1条日志
第2条日志
第3条日志
```

---

#### 例题 55：统计文件中的字符数、单词数、行数

```python
def file_stats(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    chars = len(content)
    words = len(content.split())
    lines = content.count('\n') + (0 if content.endswith('\n') else 1)  # ⚠️ 处理末尾无换行符的情况
    if not content:
        lines = 0                                                       # ⚠️ 处理空文件

    print("字符数: {}, 单词数: {}, 行数: {}".format(chars, words, lines))

# 示例调用
file_stats('test.txt')
```

---

## 第9章 软件开发基础

### 9.1 核心知识点

| 知识点 | 说明                                                |
| ------ | ------------------------------------------------- |
| 软件工程概念 | 系统化、规范化、可量化的软件开发方法                                |
| 软件生命周期 | 需求分析 → 设计 → 编码 → 测试 → 维护                          |
| 模块化设计 | **高内聚、低耦合**；自顶向下设计，自底向上实现                         |
| 代码规范 | PEP 8 编码风格、命名规范、注释规范                              |
| 调试方法 | print 调试、断点调试[[Python串讲教学课件]]、异常处理 `try…except` |
| 测试方法 | 单元测试、集成测试、黑盒/白盒测试                                 |

---

### 9.2 典型例题

#### 例题 56：异常处理

```python
try:
    num = int(input("请输入一个整数: "))
    result = 100 / num
    print("100 / {} = {}".format(num, result))
except ValueError:
    print("输入错误：请输入整数！")
except ZeroDivisionError:
    print("错误：除数不能为零！")
except Exception as e:
    print("未知错误:", e)
else:
    print("计算成功！")
finally:
    print("程序结束。")
```

---

#### 例题 57：模块化设计示例

>设计一个学生成绩管理系统，体现"高内聚、低耦合"的设计思想。

```python
# ========== 数据模块 ==========
students = [
    {'id': '001', 'name': '张三', 'score': 90},
    {'id': '002', 'name': '李四', 'score': 85},
    {'id': '003', 'name': '王五', 'score': 92},
]

# ========== 业务逻辑模块 ==========
def find_student(sid):
    """按学号查找学生"""
    for s in students:
        if s['id'] == sid:
            return s
    return None

def add_student(sid, name, score):
    """添加学生"""
    students.append({'id': sid, 'name': name, 'score': score})

def average_score():
    """计算平均分"""
    return sum(s['score'] for s in students) / len(students)

def grade_level(score):
    """根据分数返回等级"""
    if score >= 90:
        return "优秀"
    elif score >= 80:
        return "良好"
    elif score >= 60:
        return "及格"
    else:
        return "不及格"

# ========== 调用示例 ==========
print("平均分: {:.1f}".format(average_score()))
for s in students:
    print("{}的成绩等级: {}".format(s['name'], grade_level(s['score'])))
```

---

## 📋 附录：常见易错点汇总

### 一、语法易错

| 序号  | 易错点                | 说明                                            |
| :-: | ------------------ | --------------------------------------------- |
|  1  | `input()` 返回字符串    | 数值计算前必须用 `int()`/`float()`/`eval()` 转换        |
|  2  | `=` vs `==`        | `=` 是赋值，`==` 是判断相等                            |
|  3  | `else` 后不能跟条件      | `else a<b:` ❌ → `else:` ✅                     |
|  4  | 冒号不能忘              | `if`/`elif`/`else`/`for`/`while`/`def` 后必须有冒号 |
|  5  | 缩进一致               | Python 用缩进表示代码块，必须统一（4 空格）                    |
|  6  | `range(m, n)` 不含 n | `range(1, 5)` → 1, 2, 3, 4（不含 5）              |

### 二、逻辑易错

| 序号 | 易错点 | 说明 |
|:---:|------|------|
| 1 | 累加变量初始化为 0，累乘初始化为 1 | 累乘初始化为 0 结果永远是 0 |
| 2 | 外循环中必须重置内循环累积变量 | 如阶乘和的 `T = 1` 必须放在外循环内 |
| 3 | `break` vs `continue` | break = 退出整个循环；continue = 跳过本次 |
| 4 | `for…else` 中 break 不执行 else | 正常遍历完才执行 else |
| 5 | 浅拷贝 vs 深拷贝 | `ls2 = ls1` 共享空间；`ls2 = ls1.copy()` 浅拷贝（嵌套层仍共享）；`copy.deepcopy()` 才是完全独立 |
| 6 | 默认参数必须放最后 | `def f(a, b=1)` ✅；`def f(a=1, b)` ❌ |

### 三、数据类型易错

| 序号 | 易错点 | 说明 |
|:---:|------|------|
| 1 | 单元素元组必须加逗号 | `(1)` 是 int；`(1,)` 才是 tuple |
| 2 | 空集合用 `set()` | `{}` 创建的是空字典，不是空集合 |
| 3 | 字典键必须是不可变类型 | 列表不能作为字典的键 |
| 4 | 列表的 `remove()` 返回 None | 按值删除，`pop()` 才返回被删元素 |
| 5 | `sorted()` 不改变原列表 | 返回新列表；`sort()` 原地排序 |

---

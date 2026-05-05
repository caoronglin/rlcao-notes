---
title: C语言面试常见题
wiki: c
abbrlink: 4645c949
date: 2026-02-01 13:00:55
updated: 2026-02-01 13:00:55
---
# C语言面试常见题

⭐
面试必备 基础题+算法题+编程题全覆盖

## 题目分类

* [一、基础概念题](#basics)
* [二、指针与内存](#pointers)
* [三、数组与字符串](#arrays)
* [四、函数与递归](#functions)
* [五、位运算](#bitwise)
* [六、算法实现](#algorithms)

## 一、基础概念题

### Q1: strlen() 和 sizeof() 的区别？

##### 答案：

```
char str[] = "Hello";

sizeof(str)   // 返回 6（包含'\0'）
strlen(str)   // 返回 5（不包含'\0'）

char* p = "Hello";
sizeof(p)     // 返回指针大小（4或8字节）
strlen(p)     // 返回 5
```

**关键区别：**

* `sizeof`是运算符，编译时确定，计算变量/类型占用的字节数
* `strlen`是函数，运行时计算，统计字符串长度（不包含'\0'）

### Q2: ++i 和 i++ 的区别？

##### 答案：

```
int i = 5;

// 前置++：先加1，再使用
int a = ++i;  // a=6, i=6

// 后置++：先使用，再加1
int b = i++;  // b=6, i=7
```

**效率：**前置++效率更高，因为不需要保存临时值

### Q3: static 关键字的作用？

##### 答案：

**1. 修饰局部变量：**

```
void func() {
    static int count = 0;  // 只初始化一次
    count++;
    printf("%d ", count);
}

int main() {
    func();  // 输出: 1
    func();  // 输出: 2
    func();  // 输出: 3
}
```

**2. 修饰全局变量：**

```
static int g_var = 10;  // 只在本文件内可见
```

**3. 修饰函数：**

```
static void helper() {  // 只在本文件内可见
    // ...
}
```

### Q4: const 关键字的作用？

##### 答案：

```
// 1. 常量
const int MAX = 100;

// 2. 指向常量的指针（内容不能改）
const int* p;
*p = 10;  // ❌ 错误
p++;      // ✅ 可以

// 3. 常量指针（指向不能改）
int* const p = &a
*p = 10;  // ✅ 可以
p++;      // ❌ 错误

// 4. 指向常量的常量指针
const int* const p = &a
*p = 10;  // ❌ 错误
p++;      // ❌ 错误
```

## 二、指针与内存

### Q5: 指针和引用的区别？

##### 答案：

C语言没有引用，这是C++概念。但在面试中常问：

| 特性 | 指针 | 引用(C++) |
| --- | --- | --- |
| 本质 | 变量 | 别名 |
| 是否占用内存 | 是 | 否 |
| 能否为空 | 可以(NULL) | 不可以 |
| 初始化 | 可以不初始化 | 必须初始化 |
| 改变指向 | 可以 | 不可以 |

### Q6: 野指针是什么？如何避免？

##### 答案：

**野指针：**指向不确定内存地址的指针

```
// 野指针的几种情况：

// 1. 未初始化
int* p;      // 野指针！指向随机地址
*p = 10;     // 危险！

// 2. 释放后未置空
int* p = (int*)malloc(sizeof(int));
free(p);
*p = 10;     // 野指针！p指向已释放的内存

// 3. 指针超越变量作用域
int* func() {
    int a = 10;
    return &a  // 返回局部变量地址！
}
```

**避免方法：**

```
// 1. 初始化为NULL
int* p = NULL;

// 2. free后置NULL
free(p);
p = NULL;

// 3. 使用前检查
if (p != NULL) {
    *p = 10;
}
```

### Q7: malloc 和 calloc 的区别？

##### 答案：

| 特性 | malloc | calloc |
| --- | --- | --- |
| 参数 | malloc(字节数) | calloc(元素个数, 每个元素大小) |
| 初始化 | 不初始化，内容随机 | 初始化为0 |
| 效率 | 稍快 | 稍慢 |

```
// malloc
int* p1 = (int*)malloc(5 * sizeof(int));
// 内容不确定

// calloc
int* p2 = (int*)calloc(5, sizeof(int));
// 内容全为0
```

## 三、数组与字符串

### Q8: 数组名和指针的区别？

##### 答案：

```
int arr[5] = {1, 2, 3, 4, 5};
int* p = arr;

// 相同点
arr[i]    等价于  p[i]
*(arr+i)  等价于  *(p+i)

// 不同点
sizeof(arr)  // 20 (整个数组大小)
sizeof(p)    // 4或8 (指针大小)

arr++  // ❌ 错误！数组名是常量
p++    // ✅ 正确
```

**关键：**数组名在某些情况下会退化为指针，但它们不是同一类型

### Q9: 如何实现字符串反转？

##### 答案：

```
[[include]] 

void reverse(char* str) {
    if (str == NULL) return;

    int len = strlen(str);
    for (int i = 0; i < len / 2; i++) {
        // 交换首尾字符
        char temp = str[i];
        str[i] = str[len - 1 - i];
        str[len - 1 - i] = temp;
    }
}

int main() {
    char str[] = "Hello";
    reverse(str);
    printf("%s\n", str);  // 输出: olleH
}
```

### Q10: 如何判断一个字符串是否是回文？

##### 答案：

```
[[include]] 
[[include]] 

bool isPalindrome(char* str) {
    if (str == NULL) return false;

    int len = strlen(str);
    int left = 0;
    int right = len - 1;

    while (left < right) {
        if (str[left] != str[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

int main() {
    printf("%d\n", isPalindrome("aba"));    // 1 (true)
    printf("%d\n", isPalindrome("abc"));    // 0 (false)
}
```

## 四、函数与递归

### Q11: 值传递和地址传递的区别？

##### 答案：

```
// 值传递
void swap1(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}  // 不影响实参

// 地址传递
void swap2(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}  // 修改实参

int x = 10, y = 20;
swap1(x, y);    // x,y不变
swap2(&x, &y);  // x,y被交换
```

### Q12: 递归的三个要素是什么？

##### 答案：

1. **递归终止条件**：必须有一个明确的结束条件
2. **递归表达式**：问题规模缩小的规律
3. **向终止条件收敛**：每次递归都要接近终止条件

```
// 示例：阶乘
int factorial(int n) {
    // 1. 终止条件
    if (n <= 1) {
        return 1;
    }
    // 2. 递归表达式 + 3. 收敛
    return n * factorial(n - 1);
}
```

## 五、位运算

### Q13: 如何判断一个数是否是2的幂？

##### 答案：

```
bool isPowerOfTwo(int n) {
    // 2的幂：二进制只有一个1
    // 1: 0001
    // 2: 0010
    // 4: 0100
    // 8: 1000

    // n & (n-1) 可以去掉最低位的1
    return (n > 0) && ((n & (n - 1)) == 0);
}

int main() {
    printf("%d\n", isPowerOfTwo(1));   // 1
    printf("%d\n", isPowerOfTwo(2));   // 1
    printf("%d\n", isPowerOfTwo(3));   // 0
    printf("%d\n", isPowerOfTwo(4));   // 1
    printf("%d\n", isPowerOfTwo(5));   // 0
}
```

**原理：**2的幂的二进制表示只有一个1，n&(n-1)会将这个1变为0

### Q14: 如何交换两个变量的值（不使用第三个变量）？

##### 方法1：加减法

```
int a = 10, b = 20;

a = a + b;  // a=30, b=20
b = a - b;  // a=30, b=10
a = a - b;  // a=20, b=10
```

**缺点：**可能溢出

##### 方法2：异或法（推荐）

```
int a = 10, b = 20;

a = a ^ b;
b = a ^ b;  // b = (a^b)^b = a
a = a ^ b;  // a = (a^b)^a = b
```

**优点：**不会溢出，效率高

## 六、算法实现

### Q15: 实现二分查找

##### 答案：

```
int binarySearch(int arr[], int n, int target) {
    int left = 0;
    int right = n - 1;

    while (left <= right) {
        // 防止溢出
        int mid = left + (right - left) / 2;

        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;  // 未找到
}
```

**时间复杂度：**O(log n)

### Q16: 实现斐波那契数列

##### 方法1：递归（低效）

```
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
```

**时间复杂度：**O(2ⁿ) - 有大量重复计算

##### 方法2：迭代（推荐）

```
int fib(int n) {
    if (n <= 1) return n;

    int a = 0, b = 1, c;
    for (int i = 2; i <= n; i++) {
        c = a + b;
        a = b;
        b = c;
    }
    return b;
}
```

**时间复杂度：**O(n)

### Q17: 判断一个数是否是素数

##### 答案：

```
[[include]] 
[[include]] 

bool isPrime(int n) {
    if (n <= 1) return false;
    if (n == 2) return true;
    if (n % 2 == 0) return false;

    // 只需检查到√n
    for (int i = 3; i <= sqrt(n); i += 2) {
        if (n % i == 0) {
            return false;
        }
    }
    return true;
}
```

**优化：**只检查到√n，跳过偶数

## 面试技巧

#### 💡 回答问题的技巧

* 先说结论，再解释原因
* 用代码示例佐证观点
* 分析不同方案的优缺点
* 考虑边界情况和错误处理

#### 💡 编程题技巧

* 先明确需求，再动手编码
* 先写框架，再填细节
* 注意变量命名和代码风格
* 主动测试边界情况

#### 💡 常见追问

* "这个算法的时间复杂度是多少？"
* "有没有更优的解决方案？"
* "如果数据量很大怎么办？"
* "如何处理并发/线程安全问题？"

## 相关资源

* [期末考试易错点](/wiki/c/exam-tips/) - 巩固基础知识
* [经典案例与解析](/wiki/c/cases/) - 实战项目经验
* [第5章 指针](/wiki/c/chapter5/) - 指针专题
* [第4章 数组](/wiki/c/chapter4/) - 数组与字符串

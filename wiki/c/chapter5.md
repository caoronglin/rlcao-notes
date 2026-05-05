---
title: 第5章 指针
wiki: c
abbrlink: 22a8d10
date: 2026-02-01 13:00:55
updated: 2026-02-01 13:00:55
---
# 第5章 指针

⭐
核心章节 重点掌握 指针是C语言最强大也是最难掌握的特性

## 本章概述

**指针**是C语言最强大的特性之一，也是C语言的灵魂。掌握指针是成为优秀C程序员的必经之路。

本章主要内容：

* 指针的基本概念
* 指针的运算
* 指针与数组
* 指针与函数
* 指针数组与多级指针
* 动态内存分配

## 什么是指针？

### 基本概念

**指针**是一个变量，其值为另一个变量的地址。通过指针，我们可以间接访问和操作内存中的数据。

```
int a = 10;      // 整型变量
int *p;         // 指针变量
p = &a         // p指向a的地址
```

#### 💡 关键符号

* `&`：取地址运算符，获取变量的地址
* `*`：指针运算符，访问指针指向的变量

### 指针的定义和使用

```
[[include]] 

int main() {
    int a = 10;
    int *p;          // 定义指针变量

    p = &a          // p指向a

    printf("a的值：%d\n", a);           // 输出：10
    printf("a的地址：%p\n", &a);        // 输出：a的地址
    printf("p的值：%p\n", p);           // 输出：a的地址
    printf("*p的值：%d\n", *p);         // 输出：10

    *p = 20;         // 通过指针修改a的值
    printf("修改后a的值：%d\n", a);     // 输出：20

    return 0;
}
```

## 指针的运算

### 指针的算术运算

```
[[include]] 

int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    int *p = arr;    // 指向数组首元素

    printf("%d\n", *p);       // 输出：10
    printf("%d\n", *(p + 1)); // 输出：20
    printf("%d\n", *(p + 2)); // 输出：30

    p++;                      // 指针后移
    printf("%d\n", *p);       // 输出：20

    return 0;
}
```

### 指针的关系运算

```
int arr[5];
int *p1 = &arr[0];
int *p2 = &arr[4];

if (p1 < p2) {
    printf("p1在p2前面\n");
}
```

#### ⚠️ 注意

* 指针运算只在数组中有意义
* 不要对未初始化的指针进行运算
* 注意指针越界问题

## 指针与数组

### 数组名与指针

数组名在很多情况下会退化为指向首元素的指针：

```
[[include]] 

int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    int *p = arr;    // 等价于 int *p = &arr[0];

    // 使用指针遍历数组
    for (int i = 0; i < 5; i++) {
        printf("%d ", *(p + i));    // 等价于 arr[i]
    }

    // 数组名是指针常量，不能修改
    // arr++;  // 错误！
    p++;          // 正确

    return 0;
}
```

### 指针遍历数组

```
// 方法1：使用数组下标
for (int i = 0; i < 5; i++) {
    printf("%d ", arr[i]);
}

// 方法2：使用指针算术
for (int *p = arr; p < arr + 5; p++) {
    printf("%d ", *p);
}
```

## 指针与函数

### 指针作为函数参数

指针参数可以实现"传引用"的效果：

```
[[include]] 

// 值传递：不会改变原变量
void swapByValue(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}

// 指针传递：会改变原变量
void swapByPointer(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 10, y = 20;

    swapByValue(x, y);
    printf("值传递后：x=%d, y=%d\n", x, y);  // 输出：x=10, y=20

    swapByPointer(&x, &y);
    printf("指针传递后：x=%d, y=%d\n", x, y); // 输出：x=20, y=10

    return 0;
}
```

### 函数返回指针

```
[[include]] 

int* max(int *a, int *b) {
    return (*a > *b) ? a : b;
}

int main() {
    int x = 10, y = 20;
    int *p = max(&x, &y);

    printf("最大值：%d\n", *p);  // 输出：20

    return 0;
}
```

#### ⚠️ 注意

不要返回指向局部变量的指针，因为函数返回后局部变量会被销毁。

## 指针数组与数组指针

### 指针数组

指针数组是数组的每个元素都是指针：

```
int *arr[5];    // 5个int指针的数组
```

### 数组指针

数组指针是指向整个数组的指针：

```
int (*p)[5];    // 指向包含5个int的数组的指针
```

```
[[include]] 

int main() {
    int arr[3][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };
    int (*p)[4] = arr;  // 数组指针

    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 4; j++) {
            printf("%d ", *(*(p + i) + j));
        }
        printf("\n");
    }

    return 0;
}
```

## 多级指针

指向指针的指针称为二级指针：

```
[[include]] 

int main() {
    int a = 10;
    int *p = &a        // 一级指针
    int **pp = &p      // 二级指针

    printf("a的值：%d\n", a);        // 输出：10
    printf("*p的值：%d\n", *p);      // 输出：10
    printf("**pp的值：%d\n", **pp);  // 输出：10

    **pp = 20;
    printf("修改后a的值：%d\n", a);  // 输出：20

    return 0;
}
```

#### 💡 应用场景

多级指针常用于修改指针变量的值，或在函数中返回指针。

## 动态内存分配

### malloc和free

```
[[include]] 
[[include]] 

int main() {
    // 动态分配内存
    int *p = (int*)malloc(5 * sizeof(int));

    if (p == NULL) {
        printf("内存分配失败\n");
        return 1;
    }

    // 使用内存
    for (int i = 0; i < 5; i++) {
        p[i] = i + 1;
    }

    for (int i = 0; i < 5; i++) {
        printf("%d ", p[i]);
    }

    // 释放内存
    free(p);
    p = NULL;  // 防止悬空指针

    return 0;
}
```

### calloc和realloc

```
[[include]] 

// calloc：分配并初始化为0
int *p1 = (int*)calloc(5, sizeof(int));

// realloc：重新分配内存大小
int *p2 = (int*)realloc(p, 10 * sizeof(int));
```

### 内存分配函数对比

| 函数 | 说明 |
| --- | --- |
| `malloc(size)` | 分配size字节内存 |
| `calloc(n, size)` | 分配n个size字节，并初始化为0 |
| `realloc(ptr, size)` | 重新分配内存大小 |
| `free(ptr)` | 释放动态分配的内存 |

#### ⚠️ 内存管理原则

* 谁分配，谁释放
* 释放后置NULL，防止悬空指针
* 避免内存泄漏

## 常见指针错误

### 未初始化的指针

```
int *p;      // 危险！p指向未知位置
*p = 10;    // 可能导致程序崩溃
```

### 野指针

```
int *p = (int*)malloc(sizeof(int));
free(p);
*p = 10;    // 错误！p指向已释放的内存
```

### 指针越界

```
int arr[5];
int *p = arr;
for (int i = 0; i <= 5; i++) {
    *(p + i) = i;  // 错误！i=5时越界
}
```

#### 💡 安全使用指针

* 初始化指针为NULL
* 使用前检查指针是否为NULL
* 释放后置NULL
* 使用const保护不应修改的数据

## 综合示例：链表

```
[[include]] 
[[include]] 

struct Node {
    int data;
    struct Node *next;
};

// 创建节点
struct Node* createNode(int data) {
    struct Node *newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = data;
    newNode->next = NULL;
    return newNode;
}

// 插入节点
void insertNode(struct Node **head, int data) {
    struct Node *newNode = createNode(data);
    newNode->next = *head;
    *head = newNode;
}

// 打印链表
void printList(struct Node *head) {
    while (head != NULL) {
        printf("%d -> ", head->data);
        head = head->next;
    }
    printf("NULL\n");
}

int main() {
    struct Node *head = NULL;

    insertNode(&head, 10);
    insertNode(&head, 20);
    insertNode(&head, 30);

    printList(head);

    return 0;
}
```

## 本章小结

* ✓ 理解了指针的基本概念
* ✓ 掌握了指针的运算
* ✓ 学会了指针与数组、函数的结合使用
* ✓ 了解了动态内存分配
* ✓ 认识了指针使用的常见错误

## 下一步学习

* [第6章 函数](/wiki/c/chapter6/) - 深入学习函数
* [第7章 结构体与共用体](/wiki/c/chapter7/) - 学习自定义数据类型

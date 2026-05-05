---
title: 第4章 数组
wiki: c
abbrlink: 84c699f1
date: 2026-02-01 13:00:55
updated: 2026-02-01 13:00:55
---
# 第4章 数组

⭐
进阶章节 重点掌握 数组是处理批量数据的重要工具

## 本章概述

**数组**是一组相同类型数据的集合，这些数据在内存中连续存放。数组是C语言中最基本的数据结构。

本章主要内容：

* 一维数组的定义和使用
* 二维数组的定义和使用
* 字符数组与字符串
* 数组作为函数参数
* 常见算法：排序、查找

## 一维数组

### 定义和初始化

```
// 定义方式
类型 数组名[大小];

// 示例
int arr[5];              // 定义一个包含5个整数的数组
float scores[10];        // 定义一个包含10个浮点数的数组

// 初始化
int arr1[5] = {1, 2, 3, 4, 5};           // 完全初始化
int arr2[5] = {1, 2, 3};                  // 部分初始化，其余为0
int arr3[] = {1, 2, 3, 4, 5};             // 自动确定大小
int arr4[5] = {0};                        // 全部初始化为0
```

### 访问数组元素

```
[[include]] 

int main() {
    int arr[5] = {10, 20, 30, 40, 50};

    // 访问单个元素
    printf("第一个元素：%d\n", arr[0]);   // 输出：10
    printf("第三个元素：%d\n", arr[2]);   // 输出：30

    // 遍历数组
    for (int i = 0; i < 5; i++) {
        printf("arr[%d] = %d\n", i, arr[i]);
    }

    return 0;
}
```

#### ⚠️ 注意事项

* 数组下标从**0**开始
* 访问数组时不要越界
* 数组名是常量，不能修改

## 二维数组

### 定义和初始化

```
// 定义方式
类型 数组名[行数][列数];

// 示例
int matrix[3][4];        // 3行4列的二维数组

// 初始化
int mat1[2][3] = {
    {1, 2, 3},
    {4, 5, 6}
};

int mat2[2][3] = {1, 2, 3, 4, 5, 6};     // 自动分行
int mat3[][3] = {1, 2, 3, 4, 5, 6};      // 省略行数
```

### 访问二维数组

```
[[include]] 

int main() {
    int matrix[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };

    // 访问元素
    printf("matrix[0][0] = %d\n", matrix[0][0]);  // 输出：1
    printf("matrix[1][2] = %d\n", matrix[1][2]);  // 输出：6

    // 遍历二维数组
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 3; j++) {
            printf("%d ", matrix[i][j]);
        }
        printf("\n");
    }

    return 0;
}
```

#### 💡 二维数组的应用

二维数组常用于表示矩阵、表格、游戏地图等二维数据结构。

## 字符数组与字符串

### 字符数组

```
char str1[5] = {'H', 'e', 'l', 'l', 'o'};  // 字符数组
char str2[] = "Hello";                        // 字符串
```

### 字符串

字符串是以`'\0'`（空字符）结尾的字符数组：

```
[[include]] 
[[include]] 

int main() {
    char str[] = "Hello";

    // 字符串长度（不包括'\0'）
    printf("长度：%lu\n", strlen(str));  // 输出：5

    // 输出字符串
    printf("字符串：%s\n", str);

    // 字符串拷贝
    char str2[20];
    strcpy(str2, str);
    printf("拷贝：%s\n", str2);

    // 字符串连接
    strcat(str2, " World");
    printf("连接：%s\n", str2);

    // 字符串比较
    if (strcmp(str, "Hello") == 0) {
        printf("相等\n");
    }

    return 0;
}
```

### 常用字符串函数

| 函数 | 说明 |
| --- | --- |
| `strlen(s)` | 返回字符串s的长度 |
| `strcpy(dest, src)` | 将src复制到dest |
| `strcat(dest, src)` | 将src连接到dest后面 |
| `strcmp(s1, s2)` | 比较两个字符串 |
| `strstr(s1, s2)` | 在s1中查找s2首次出现的位置 |

## 数组作为函数参数

```
[[include]] 

// 函数声明
void printArray(int arr[], int size);
int sumArray(int arr[], int size);
void reverseArray(int arr[], int size);

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int size = sizeof(arr) / sizeof(arr[0]);

    printf("原始数组：");
    printArray(arr, size);

    printf("数组之和：%d\n", sumArray(arr, size));

    reverseArray(arr, size);
    printf("反转后：");
    printArray(arr, size);

    return 0;
}

// 打印数组
void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

// 计算数组元素之和
int sumArray(int arr[], int size) {
    int sum = 0;
    for (int i = 0; i < size; i++) {
        sum += arr[i];
    }
    return sum;
}

// 反转数组
void reverseArray(int arr[], int size) {
    for (int i = 0; i < size / 2; i++) {
        int temp = arr[i];
        arr[i] = arr[size - 1 - i];
        arr[size - 1 - i] = temp;
    }
}
```

#### 💡 注意

数组作为函数参数时会退化为指针，`sizeof(arr)`返回的是指针大小，需要在调用时传递数组大小。

## 常见算法

### 冒泡排序

```
[[include]] 

void bubbleSort(int arr[], int size) {
    for (int i = 0; i < size - 1; i++) {
        for (int j = 0; j < size - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                // 交换
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int size = sizeof(arr) / sizeof(arr[0]);

    bubbleSort(arr, size);

    printf("排序后：");
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }

    return 0;
}
```

### 二分查找

```
[[include]] 

int binarySearch(int arr[], int size, int target) {
    int left = 0, right = size - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target) {
            return mid;
        }

        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;  // 未找到
}

int main() {
    int arr[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int size = sizeof(arr) / sizeof(arr[0]);
    int target = 23;

    int result = binarySearch(arr, size, target);

    if (result != -1) {
        printf("找到元素，位置：%d\n", result);
    } else {
        printf("未找到元素\n");
    }

    return 0;
}
```

## 综合示例：学生成绩管理

```
[[include]] 

[[define]] MAX_STUDENTS 100
[[define]] MAX_NAME 50

struct Student {
    char name[MAX_NAME];
    int score;
};

int main() {
    struct Student students[MAX_STUDENTS];
    int count = 0;
    int choice;

    while (1) {
        printf("\n1. 添加学生\n");
        printf("2. 显示所有学生\n");
        printf("3. 计算平均分\n");
        printf("4. 退出\n");
        printf("请选择：");
        scanf("%d", &choice);

        if (choice == 1) {
            printf("姓名：");
            scanf("%s", students[count].name);
            printf("成绩：");
            scanf("%d", &students[count].score);
            count++;
        } else if (choice == 2) {
            for (int i = 0; i < count; i++) {
                printf("%s: %d\n", students[i].name, students[i].score);
            }
        } else if (choice == 3) {
            int sum = 0;
            for (int i = 0; i < count; i++) {
                sum += students[i].score;
            }
            printf("平均分：%.2f\n", (float)sum / count);
        } else if (choice == 4) {
            break;
        }
    }

    return 0;
}
```

## 本章小结

* ✓ 掌握了一维数组和二维数组的使用
* ✓ 理解了字符数组与字符串的关系
* ✓ 学会了数组作为函数参数
* ✓ 掌握了基本的排序和查找算法

## 下一步学习

* [第5章 指针](/wiki/c/chapter5/) - 学习C语言的核心特性
* [第3章 程序设计基本结构](/wiki/c/chapter3/) - 复习控制结构

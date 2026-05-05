---
title: 第6章 函数
wiki: c
abbrlink: 9905d90f
date: 2026-02-01 13:00:55
updated: 2026-02-01 13:00:55
---
# 第6章 函数

⭐
核心章节 重点掌握 函数是模块化程序设计的基础

## 本章概述

**函数**是执行特定任务的独立代码块，是C语言模块化程序设计的核心。通过函数，我们可以将复杂问题分解为若干小问题，使程序结构清晰、易于维护。

本章主要内容：

* 函数的定义和声明
* 函数的调用
* 参数传递机制
* 递归函数
* 变量的作用域和存储类别
* 预处理命令

## 函数的定义和声明

### 函数定义

```
返回类型 函数名(参数列表) {
    // 函数体
    return 返回值;
}
```

```
// 示例1：无参无返回值
void printHello() {
    printf("Hello, World!\n");
}

// 示例2：有参无返回值
void printNumber(int num) {
    printf("数字：%d\n", num);
}

// 示例3：有参有返回值
int add(int a, int b) {
    return a + b;
}

// 示例4：返回指针
int* max(int *a, int *b) {
    return (*a > *b) ? a : b;
}
```

### 函数声明

函数声明告诉编译器函数的名称、返回类型和参数。通常在头文件或文件开头进行声明：

```
// 函数声明
int add(int a, int b);
void printHello();

int main() {
    int result = add(10, 20);
    printf("结果：%d\n", result);
    printHello();
    return 0;
}

// 函数定义
int add(int a, int b) {
    return a + b;
}

void printHello() {
    printf("Hello, World!\n");
}
```

#### 💡 为什么需要函数声明？

如果函数定义在main函数之后，必须在调用前声明函数，否则编译器会报错。

## 函数的调用

### 基本调用

```
[[include]] 

int square(int num);

int main() {
    int x = 5;
    int result = square(x);  // 函数调用
    printf("%d的平方是%d\n", x, result);
    return 0;
}

int square(int num) {
    return num * num;
}
```

### 嵌套调用

```
[[include]] 

int add(int a, int b) {
    return a + b;
}

int multiply(int a, int b) {
    return a * b;
}

int calculate(int a, int b, int c) {
    // 嵌套调用
    return multiply(add(a, b), c);
}

int main() {
    int result = calculate(2, 3, 4);  // (2 + 3) * 4 = 20
    printf("结果：%d\n", result);
    return 0;
}
```

### 递归调用

```
[[include]] 

// 计算阶乘
long factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);  // 递归调用
}

// 斐波那契数列
int fibonacci(int n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    printf("5的阶乘：%ld\n", factorial(5));
    printf("斐波那契第10项：%d\n", fibonacci(10));
    return 0;
}
```

## 参数传递机制

### 值传递

C语言默认使用值传递，将实参的值复制给形参：

```
[[include]] 

void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
    printf("函数内：a=%d, b=%d\n", a, b);
}

int main() {
    int x = 10, y = 20;
    printf("调用前：x=%d, y=%d\n", x, y);
    swap(x, y);
    printf("调用后：x=%d, y=%d\n", x, y);  // x和y的值没有改变
    return 0;
}
```

### 地址传递

通过传递指针实现地址传递，可以修改原变量的值：

```
[[include]] 

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 10, y = 20;
    printf("调用前：x=%d, y=%d\n", x, y);
    swap(&x, &y);
    printf("调用后：x=%d, y=%d\n", x, y);  // x和y的值已交换
    return 0;
}
```

### 数组作为参数

```
[[include]] 

// 数组作为参数会退化为指针
void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

void modifyArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        arr[i] *= 2;
    }
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int size = sizeof(arr) / sizeof(arr[0]);

    printf("原数组：");
    printArray(arr, size);

    modifyArray(arr, size);

    printf("修改后：");
    printArray(arr, size);

    return 0;
}
```

## 变量的作用域和存储类别

### 局部变量

```
void func() {
    int x = 10;  // 局部变量，只在函数内有效
    printf("%d\n", x);
}
```

### 全局变量

```
[[include]] 

int global = 100;  // 全局变量，整个文件都可以访问

void func1() {
    printf("func1: %d\n", global);
}

void func2() {
    printf("func2: %d\n", global);
}

int main() {
    func1();
    func2();
    printf("main: %d\n", global);
    return 0;
}
```

### static变量

```
[[include]] 

void count() {
    static int count = 0;  // 静态局部变量，只初始化一次
    count++;
    printf("调用次数：%d\n", count);
}

int main() {
    count();  // 输出：调用次数：1
    count();  // 输出：调用次数：2
    count();  // 输出：调用次数：3
    return 0;
}
```

### 作用域对比

| 变量类型 | 作用域 | 生命周期 |
| --- | --- | --- |
| 局部变量 | 函数内部 | 函数调用期间 |
| 全局变量 | 整个程序 | 整个程序运行期间 |
| 静态局部变量 | 函数内部 | 整个程序运行期间 |
| 静态全局变量 | 当前文件 | 整个程序运行期间 |

## 预处理命令

### [[define]] 宏定义

```
[[define]] PI 3.14159           // 常量宏
[[define]] MAX(a, b) ((a) > (b) ? (a) : (b))  // 函数宏

int main() {
    printf("PI = %f\n", PI);
    int max = MAX(10, 20);
    printf("最大值 = %d\n", max);
    return 0;
}
```

### [[include]] 文件包含

```
[[include]]        // 系统头文件
[[include]] "myheader.h"     // 自定义头文件
```

### 条件编译

```
[[define]] DEBUG 1

int main() {
    [[ifdef]] DEBUG
        printf("调试模式\n");
    [[endif]]

    [[if]] DEBUG == 1
        printf("调试级别1\n");
    [[elif]] DEBUG == 2
        printf("调试级别2\n");
    [[else]]
        printf("发布模式\n");
    [[endif]]

    return 0;
}
```

#### 💡 预处理命令的使用

* `#define`用于定义常量和宏
* `#include`用于包含头文件
* 条件编译用于跨平台代码和调试

## 常用库函数

### 数学函数 math.h

```
[[include]] 
[[include]] 

int main() {
    printf("sqrt(16) = %f\n", sqrt(16));
    printf("pow(2, 3) = %f\n", pow(2, 3));
    printf("abs(-5) = %d\n", abs(-5));
    printf("sin(PI/2) = %f\n", sin(3.14159/2));
    return 0;
}
```

### 字符串函数 string.h

```
[[include]] 
[[include]] 

int main() {
    char s1[] = "Hello";
    char s2[] = "World";

    printf("长度：%lu\n", strlen(s1));
    strcat(s1, s2);
    printf("连接：%s\n", s1);
    printf("比较：%d\n", strcmp("abc", "abd"));

    return 0;
}
```

### 内存操作函数

```
[[include]] 
[[include]] 

int main() {
    int arr[5] = {1, 2, 3, 4, 5};

    memset(arr, 0, sizeof(arr));
    memcpy(arr, arr + 2, 2 * sizeof(int));

    return 0;
}
```

## 综合示例：学生成绩管理系统

```
[[include]] 
[[include]] 

[[define]] MAX_STUDENTS 100

struct Student {
    char name[50];
    int id;
    float score;
};

int studentCount = 0;
struct Student students[MAX_STUDENTS];

// 添加学生
void addStudent() {
    if (studentCount >= MAX_STUDENTS) {
        printf("学生人数已满！\n");
        return;
    }

    printf("姓名：");
    scanf("%s", students[studentCount].name);
    printf("学号：");
    scanf("%d", &students[studentCount].id);
    printf("成绩：");
    scanf("%f", &students[studentCount].score);

    studentCount++;
    printf("添加成功！\n");
}

// 显示所有学生
void displayStudents() {
    if (studentCount == 0) {
        printf("暂无学生信息！\n");
        return;
    }

    printf("\n%-20s %-10s %s\n", "姓名", "学号", "成绩");
    printf("--------------------------------\n");
    for (int i = 0; i < studentCount; i++) {
        printf("%-20s %-10d %.2f\n",
               students[i].name,
               students[i].id,
               students[i].score);
    }
}

// 计算平均分
float calculateAverage() {
    if (studentCount == 0) return 0;

    float sum = 0;
    for (int i = 0; i < studentCount; i++) {
        sum += students[i].score;
    }
    return sum / studentCount;
}

// 查找最高分学生
void findTopStudent() {
    if (studentCount == 0) {
        printf("暂无学生信息！\n");
        return;
    }

    int topIndex = 0;
    for (int i = 1; i < studentCount; i++) {
        if (students[i].score > students[topIndex].score) {
            topIndex = i;
        }
    }

    printf("\n最高分学生：\n");
    printf("姓名：%s\n", students[topIndex].name);
    printf("成绩：%.2f\n", students[topIndex].score);
}

int main() {
    int choice;

    while (1) {
        printf("\n1. 添加学生\n");
        printf("2. 显示所有学生\n");
        printf("3. 计算平均分\n");
        printf("4. 查找最高分\n");
        printf("5. 退出\n");
        printf("请选择：");
        scanf("%d", &choice);

        switch (choice) {
            case 1: addStudent(); break;
            case 2: displayStudents(); break;
            case 3:
                printf("平均分：%.2f\n", calculateAverage());
                break;
            case 4: findTopStudent(); break;
            case 5: return 0;
            default: printf("无效选择！\n");
        }
    }

    return 0;
}
```

## 本章小结

* ✓ 掌握了函数的定义和声明
* ✓ 理解了参数传递机制
* ✓ 学会了递归函数的使用
* ✓ 了解了变量的作用域和存储类别
* ✓ 掌握了预处理命令

## 下一步学习

* [第7章 结构体与共用体](/wiki/c/chapter7/) - 学习自定义数据类型
* [第8章 文件操作](/wiki/c/chapter8/) - 学习数据持久化

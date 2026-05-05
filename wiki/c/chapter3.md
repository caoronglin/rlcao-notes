---
title: 第3章 程序设计基本结构
wiki: c
abbrlink: f0f06f97
date: 2026-02-01 13:00:55
updated: 2026-02-01 13:00:55
---
# 第3章 程序设计基本结构

⭐
核心章节 必须掌握 三种基本控制结构是程序设计的基石

## 本章概述

C语言有三种基本的程序结构：

* **顺序结构**：按顺序执行语句
* **选择结构**：根据条件选择执行不同语句
* **循环结构**：重复执行某些语句

任何复杂的程序都可以由这三种基本结构组合而成。

## 顺序结构

顺序结构是最简单的结构，程序按照语句的书写顺序依次执行：

```
[[include]] 

int main() {
    int a, b, sum;

    printf("请输入两个整数：");
    scanf("%d %d", &a, &b);

    sum = a + b;

    printf("两数之和为：%d\n", sum);

    return 0;
}
```

顺序结构的执行流程：输入 → 处理 → 输出

## 选择结构

### if语句

#### 单分支if语句

```
if (条件表达式) {
    // 条件为真时执行的语句
}
```

```
[[include]] 

int main() {
    int score;

    printf("请输入成绩：");
    scanf("%d", &score);

    if (score >= 60) {
        printf("恭喜及格！\n");
    }

    return 0;
}
```

#### 双分支if-else语句

```
if (条件表达式) {
    // 条件为真时执行
} else {
    // 条件为假时执行
}
```

```
[[include]] 

int main() {
    int score;

    printf("请输入成绩：");
    scanf("%d", &score);

    if (score >= 60) {
        printf("恭喜及格！\n");
    } else {
        printf("需要继续努力！\n");
    }

    return 0;
}
```

#### 多分支if-else if语句

```
if (条件1) {
    // 条件1为真时执行
} else if (条件2) {
    // 条件2为真时执行
} else {
    // 所有条件都不为真时执行
}
```

```
[[include]] 

int main() {
    int score;

    printf("请输入成绩：");
    scanf("%d", &score);

    if (score >= 90) {
        printf("优秀\n");
    } else if (score >= 80) {
        printf("良好\n");
    } else if (score >= 70) {
        printf("中等\n");
    } else if (score >= 60) {
        printf("及格\n");
    } else {
        printf("不及格\n");
    }

    return 0;
}
```

### switch语句

switch语句用于多分支选择，特别适合处理等值判断：

```
switch (表达式) {
    case 常量1:
        // 语句1
        break;
    case 常量2:
        // 语句2
        break;
    ...
    default:
        // 默认语句
}
```

```
[[include]] 

int main() {
    int day;

    printf("请输入星期几（1-7）：");
    scanf("%d", &day);

    switch (day) {
        case 1:
            printf("星期一\n");
            break;
        case 2:
            printf("星期二\n");
            break;
        case 3:
            printf("星期三\n");
            break;
        case 4:
            printf("星期四\n");
            break;
        case 5:
            printf("星期五\n");
            break;
        case 6:
            printf("星期六\n");
            break;
        case 7:
            printf("星期日\n");
            break;
        default:
            printf("输入错误\n");
    }

    return 0;
}
```

#### 💡 注意事项

* `break`语句用于跳出switch，如果没有break，会继续执行后面的case
* case后面的常量必须是整数或字符
* 各个case的常量值不能相同
* default可以省略

## 循环结构

### while循环

先判断条件，再执行循环体：

```
while (条件表达式) {
    // 循环体
}
```

```
[[include]] 

int main() {
    int i = 1;
    int sum = 0;

    while (i <= 100) {
        sum += i;
        i++;
    }

    printf("1到100的和为：%d\n", sum);

    return 0;
}
```

### do-while循环

先执行循环体，再判断条件，至少执行一次：

```
do {
    // 循环体
} while (条件表达式);
```

```
[[include]] 

int main() {
    int number;

    do {
        printf("请输入一个正数：");
        scanf("%d", &number);
    } while (number <= 0);

    printf("输入的正数是：%d\n", number);

    return 0;
}
```

### for循环

最灵活的循环语句：

```
for (初始化表达式; 条件表达式; 更新表达式) {
    // 循环体
}
```

```
[[include]] 

int main() {
    int sum = 0;

    // 计算1到100的和
    for (int i = 1; i <= 100; i++) {
        sum += i;
    }

    printf("1到100的和为：%d\n", sum);

    // 九九乘法表
    for (int i = 1; i <= 9; i++) {
        for (int j = 1; j <= i; j++) {
            printf("%d×%d=%-2d ", i, j, i * j);
        }
        printf("\n");
    }

    return 0;
}
```

#### 💡 三种循环的选择

* **while**：不确定循环次数时使用
* **do-while**：至少需要执行一次时使用
* **for**：知道循环次数时使用

## 循环控制语句

### break语句

立即跳出当前循环：

```
[[include]] 

int main() {
    for (int i = 1; i <= 10; i++) {
        if (i == 5) {
            break;  // 跳出循环
        }
        printf("%d ", i);
    }
    // 输出：1 2 3 4

    return 0;
}
```

### continue语句

跳过本次循环，继续下一次循环：

```
[[include]] 

int main() {
    for (int i = 1; i <= 10; i++) {
        if (i % 2 == 0) {
            continue;  // 跳过偶数
        }
        printf("%d ", i);
    }
    // 输出：1 3 5 7 9

    return 0;
}
```

## 嵌套结构

循环和选择结构可以互相嵌套：

```
[[include]] 

int main() {
    // 打印1-100之间的所有质数
    for (int i = 2; i <= 100; i++) {
        int isPrime = 1;

        for (int j = 2; j * j <= i; j++) {
            if (i % j == 0) {
                isPrime = 0;
                break;
            }
        }

        if (isPrime) {
            printf("%d ", i);
        }
    }

    return 0;
}
```

## 综合示例

```
[[include]] 

int main() {
    int choice;
    float num1, num2, result;

    printf("简单计算器\n");
    printf("1. 加法\n");
    printf("2. 减法\n");
    printf("3. 乘法\n");
    printf("4. 除法\n");
    printf("请选择操作（1-4）：");
    scanf("%d", &choice);

    if (choice < 1 || choice > 4) {
        printf("无效的选择！\n");
        return 1;
    }

    printf("请输入两个数：");
    scanf("%f %f", &num1, &num2);

    switch (choice) {
        case 1:
            result = num1 + num2;
            printf("%.2f + %.2f = %.2f\n", num1, num2, result);
            break;
        case 2:
            result = num1 - num2;
            printf("%.2f - %.2f = %.2f\n", num1, num2, result);
            break;
        case 3:
            result = num1 * num2;
            printf("%.2f × %.2f = %.2f\n", num1, num2, result);
            break;
        case 4:
            if (num2 == 0) {
                printf("错误：除数不能为0\n");
            } else {
                result = num1 / num2;
                printf("%.2f ÷ %.2f = %.2f\n", num1, num2, result);
            }
            break;
    }

    return 0;
}
```

## 本章小结

* ✓ 掌握了顺序结构、选择结构、循环结构
* ✓ 学会了if语句和switch语句的使用
* ✓ 掌握了while、do-while、for三种循环
* ✓ 理解了break和continue的作用

## 下一步学习

* [第4章 数组](/wiki/c/chapter4/) - 学习批量数据的处理
* [第2章 C语言基础](/wiki/c/chapter2/) - 复习基础知识

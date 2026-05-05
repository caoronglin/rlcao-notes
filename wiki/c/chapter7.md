---
title: 第7章 结构体与共用体
wiki: c
abbrlink: 576f8ca7
date: 2026-02-01 13:00:55
updated: 2026-02-01 13:00:55
---
# 第7章 结构体与共用体

⭐
高级章节 重点掌握 结构体是组织复杂数据的重要工具

## 本章概述

前几章我们学习了基本数据类型（整型、浮点型、字符型等），但这些类型只能表示单一的数据。实际应用中，我们经常需要处理由多个不同类型数据组成的复合数据。

本章主要内容：

* 结构体的定义和使用
* 结构体数组
* 结构体指针
* 共用体
* 枚举类型
* typedef类型定义

## 结构体

### 什么是结构体？

**结构体**（struct）是一种用户自定义的数据类型，它可以将不同类型的数据组合在一起，形成一个整体。

#### 💡 结构体的特点

* 由不同类型的数据成员组成
* 所有成员共享同一块内存，各自占用不同的空间
* 可以嵌套定义
* 大小是所有成员大小之和（可能存在填充）

### 定义结构体

```
// 方式1：先定义类型，再定义变量
struct Student {
    char name[50];
    int age;
    float score;
};

struct Student stu1, stu2;

// 方式2：定义类型的同时定义变量
struct Student {
    char name[50];
    int age;
    float score;
} stu1, stu2;

// 方式3：使用typedef简化类型名
typedef struct {
    char name[50];
    int age;
    float score;
} Student;

Student stu1, stu2;  // 不需要再写struct
```

### 初始化结构体

```
struct Student {
    char name[50];
    int age;
    float score;
};

// 初始化方式1：按顺序初始化
struct Student stu1 = {"张三", 20, 85.5};

// 初始化方式2：指定成员初始化
struct Student stu2 = {.name = "李四", .age = 21, .score = 90.0};

// 初始化方式3：先定义后赋值
struct Student stu3;
strcpy(stu3.name, "王五");
stu3.age = 22;
stu3.score = 88.5;
```

### 访问结构体成员

```
[[include]] 
[[include]] 

struct Student {
    char name[50];
    int age;
    float score;
};

int main() {
    struct Student stu;

    // 访问成员
    strcpy(stu.name, "张三");
    stu.age = 20;
    stu.score = 85.5;

    // 输出成员
    printf("姓名：%s\n", stu.name);
    printf("年龄：%d\n", stu.age);
    printf("成绩：%.2f\n", stu.score);

    return 0;
}
```

## 结构体数组

结构体数组的每个元素都是一个结构体：

```
[[include]] 

struct Student {
    char name[50];
    int age;
    float score;
};

int main() {
    // 定义结构体数组
    struct Student students[3] = {
        {"张三", 20, 85.5},
        {"李四", 21, 90.0},
        {"王五", 22, 88.5}
    };

    // 遍历结构体数组
    for (int i = 0; i < 3; i++) {
        printf("学生%d：%s, %d岁, %.2f分\n",
               i + 1,
               students[i].name,
               students[i].age,
               students[i].score);
    }

    return 0;
}
```

## 结构体指针

### 指向结构体的指针

```
[[include]] 

struct Student {
    char name[50];
    int age;
    float score;
};

int main() {
    struct Student stu = {"张三", 20, 85.5};
    struct Student *p = &stu

    // 方式1：使用解引用和点运算符
    printf("姓名：%s\n", (*p).name);

    // 方式2：使用箭头运算符（推荐）
    printf("年龄：%d\n", p->age);
    printf("成绩：%.2f\n", p->score);

    return 0;
}
```

### 结构体指针作为函数参数

```
[[include]] 

struct Student {
    char name[50];
    int age;
    float score;
};

// 使用结构体指针作为参数，避免拷贝整个结构体
void printStudent(struct Student *p) {
    printf("姓名：%s\n", p->name);
    printf("年龄：%d\n", p->age);
    printf("成绩：%.2f\n", p->score);
}

void updateScore(struct Student *p, float newScore) {
    p->score = newScore;
}

int main() {
    struct Student stu = {"张三", 20, 85.5};

    printStudent(&stu);

    updateScore(&stu, 90.0);
    printf("更新后成绩：%.2f\n", stu.score);

    return 0;
}
```

## 结构体嵌套

结构体可以包含另一个结构体作为成员：

```
[[include]] 

struct Date {
    int year;
    int month;
    int day;
};

struct Student {
    char name[50];
    struct Date birthday;  // 嵌套结构体
    float score;
};

int main() {
    struct Student stu = {
        "张三",
        {2000, 5, 15},
        85.5
    };

    printf("姓名：%s\n", stu.name);
    printf("生日：%d年%d月%d日\n",
           stu.birthday.year,
           stu.birthday.month,
           stu.birthday.day);
    printf("成绩：%.2f\n", stu.score);

    return 0;
}
```

## 共用体

### 什么是共用体？

**共用体**（union）是一种特殊的数据类型，它允许在相同的内存位置存储不同的数据类型。所有成员共享同一块内存，同时只能有一个成员有效。

```
[[include]] 

union Data {
    int i;
    float f;
    char str[20];
};

int main() {
    union Data data;

    data.i = 10;
    printf("data.i: %d\n", data.i);  // 输出：10

    data.f = 220.5;
    printf("data.f: %.2f\n", data.f);  // 输出：220.50

    strcpy(data.str, "C Programming");
    printf("data.str: %s\n", data.str);  // 输出：C Programming

    // 注意：现在data.i和data.f的值已经失效
    printf("data.i: %d\n", data.i);  // 输出不确定的值

    return 0;
}
```

### 结构体与共用体的区别

| 特性 | 结构体 | 共用体 |
| --- | --- | --- |
| 内存占用 | 所有成员大小之和 | 最大成员的大小 |
| 成员同时有效 | 是 | 否，同时只有一个成员有效 |
| 用途 | 组合不同类型的数据 | 节省内存或实现多态 |

#### 💡 共用体的应用

共用体常用于节省内存或实现数据的多种解释方式，如在嵌入式系统中。

## 枚举类型

### 定义枚举

**枚举**（enum）是一组命名的整数常量：

```
// 定义枚举类型
enum Weekday {
    SUNDAY,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY
};

// 使用枚举
enum Weekday today = WEDNESDAY;
```

### 枚举的使用

```
[[include]] 

enum Weekday {
    SUNDAY = 0,    // 可以指定值
    MONDAY,        // 自动为1
    TUESDAY,       // 自动为2
    WEDNESDAY,     // 自动为3
    THURSDAY,      // 自动为4
    FRIDAY,        // 自动为5
    SATURDAY       // 自动为6
};

int main() {
    enum Weekday today = WEDNESDAY;

    if (today == WEDNESDAY) {
        printf("今天是星期%d\n", today);  // 输出：今天是星期3
    }

    // 枚举可以用在switch中
    switch (today) {
        case MONDAY:
            printf("星期一\n");
            break;
        case WEDNESDAY:
            printf("星期三\n");
            break;
        default:
            printf("其他\n");
    }

    return 0;
}
```

## typedef类型定义

`typedef`用于为已有类型定义新的名称：

```
[[include]] 

// 为基本类型定义别名
typedef int INTEGER;
typedef float REAL;

// 为结构体定义别名
typedef struct {
    char name[50];
    int age;
} Person;

// 为指针定义别名
typedef int* IntPtr;

int main() {
    INTEGER x = 10;
    REAL y = 3.14;

    Person p = {"张三", 20};
    IntPtr ptr = &x

    printf("x = %d\n", *ptr);

    return 0;
}
```

#### 💡 typedef的优点

* 提高代码可读性
* 简化复杂的类型声明
* 便于跨平台移植

## 综合示例：学生信息管理系统

```
[[include]] 
[[include]] 

[[define]] MAX_STUDENTS 100

// 定义日期结构体
typedef struct {
    int year;
    int month;
    int day;
} Date;

// 定义性别枚举
typedef enum {
    MALE,
    FEMALE
} Gender;

// 定义学生结构体
typedef struct {
    int id;             // 学号
    char name[50];      // 姓名
    Gender gender;      // 性别
    Date birthday;      // 生日
    float score;        // 成绩
} Student;

int studentCount = 0;
Student students[MAX_STUDENTS];

// 添加学生
void addStudent() {
    if (studentCount >= MAX_STUDENTS) {
        printf("学生人数已满！\n");
        return;
    }

    Student s;
    printf("学号：");
    scanf("%d", &s.id);
    printf("姓名：");
    scanf("%s", s.name);

    int g;
    printf("性别（0-男，1-女）：");
    scanf("%d", &g);
    s.gender = (Gender)g;

    printf("生日（年 月 日）：");
    scanf("%d %d %d", &s.birthday.year, &s.birthday.month, &s.birthday.day);

    printf("成绩：");
    scanf("%f", &s.score);

    students[studentCount++] = s;
    printf("添加成功！\n");
}

// 显示所有学生
void displayStudents() {
    if (studentCount == 0) {
        printf("暂无学生信息！\n");
        return;
    }

    printf("\n%-10s %-20s %-10s %-15s %s\n",
           "学号", "姓名", "性别", "生日", "成绩");
    printf("--------------------------------------------------------\n");

    for (int i = 0; i < studentCount; i++) {
        printf("%-10d %-20s %-10s %04d-%02d-%02d     %.2f\n",
               students[i].id,
               students[i].name,
               students[i].gender == MALE ? "男" : "女",
               students[i].birthday.year,
               students[i].birthday.month,
               students[i].birthday.day,
               students[i].score);
    }
}

// 按学号查找学生
void searchStudent() {
    int id;
    printf("请输入学号：");
    scanf("%d", &id);

    for (int i = 0; i < studentCount; i++) {
        if (students[i].id == id) {
            printf("\n找到学生：\n");
            printf("学号：%d\n", students[i].id);
            printf("姓名：%s\n", students[i].name);
            printf("性别：%s\n", students[i].gender == MALE ? "男" : "女");
            printf("生日：%04d-%02d-%02d\n",
                   students[i].birthday.year,
                   students[i].birthday.month,
                   students[i].birthday.day);
            printf("成绩：%.2f\n", students[i].score);
            return;
        }
    }

    printf("未找到该学生！\n");
}

int main() {
    int choice;

    while (1) {
        printf("\n===== 学生信息管理系统 =====\n");
        printf("1. 添加学生\n");
        printf("2. 显示所有学生\n");
        printf("3. 查找学生\n");
        printf("4. 退出\n");
        printf("请选择：");
        scanf("%d", &choice);

        switch (choice) {
            case 1: addStudent(); break;
            case 2: displayStudents(); break;
            case 3: searchStudent(); break;
            case 4: return 0;
            default: printf("无效选择！\n");
        }
    }

    return 0;
}
```

## 本章小结

* ✓ 掌握了结构体的定义和使用
* ✓ 学会了结构体数组和指针
* ✓ 理解了共用体与结构体的区别
* ✓ 掌握了枚举类型的使用
* ✓ 学会了typedef定义类型别名

## 下一步学习

* [第8章 文件操作](/wiki/c/chapter8/) - 学习数据持久化
* [第6章 函数](/wiki/c/chapter6/) - 复习函数相关知识

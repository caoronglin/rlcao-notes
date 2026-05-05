---
title: 第8章 文件操作
wiki: c
abbrlink: c9158f08
date: 2026-02-01 13:00:55
updated: 2026-02-01 13:00:55
---
# 第8章 文件操作

⭐
实用章节 重点掌握 文件操作实现数据的持久化存储

## 本章概述

前面学习的程序中，数据都存储在内存中，程序结束后数据就会丢失。**文件操作**允许我们将数据存储到磁盘上，实现数据的持久化。

本章主要内容：

* 文件的基本概念
* 文件的打开与关闭
* 文本文件的读写
* 二进制文件的读写
* 文件的随机读写
* 文件检测函数

## 文件的基本概念

### 什么是文件？

**文件**是存储在外部介质（如硬盘、U盘）上的数据的集合。从程序的角度看，文件是数据源或数据目的地。

### 文件的分类

| 分类方式 | 类型 | 说明 |
| --- | --- | --- |
| 按数据组织 | 文本文件 | 以ASCII码存储，可读性好 |
| 按数据组织 | 二进制文件 | 以二进制存储，效率高 |
| 按存取方式 | 顺序文件 | 只能顺序读写 |
| 按存取方式 | 随机文件 | 可以随机读写任意位置 |

### 文件指针

C语言使用`FILE`结构体来表示文件，通过文件指针来操作文件：

```
FILE *fp;  // 文件指针
```

## 文件的打开与关闭

### 打开文件 fopen

```
FILE *fopen(const char *filename, const char *mode);
```

**常用模式：**

| 模式 | 说明 |
| --- | --- |
| `"r"` | 以只读方式打开文本文件 |
| `"w"` | 以写入方式打开文本文件（会覆盖原有内容） |
| `"a"` | 以追加方式打开文本文件 |
| `"rb"` | 以只读方式打开二进制文件 |
| `"wb"` | 以写入方式打开二进制文件 |
| `"r+"` | 以读写方式打开文件 |
| `"w+"` | 以读写方式打开文件（会覆盖） |

### 关闭文件 fclose

```
int fclose(FILE *stream);
```

```
[[include]] 

int main() {
    FILE *fp;

    // 打开文件
    fp = fopen("test.txt", "r");

    if (fp == NULL) {
        printf("文件打开失败！\n");
        return 1;
    }

    printf("文件打开成功！\n");

    // 关闭文件
    fclose(fp);

    return 0;
}
```

#### ⚠️ 注意事项

* 打开文件后必须检查是否成功
* 使用完文件后必须关闭
* 关闭后文件指针会被释放，不应再使用

## 文本文件的读写

### 字符读写 fgetc/fputc

```
[[include]] 

int main() {
    FILE *fp;
    char ch;

    // 写入文件
    fp = fopen("output.txt", "w");
    if (fp == NULL) return 1;

    fputc('H', fp);
    fputc('e', fp);
    fputc('l', fp);
    fputc('l', fp);
    fputc('o', fp);

    fclose(fp);

    // 读取文件
    fp = fopen("output.txt", "r");
    if (fp == NULL) return 1;

    while ((ch = fgetc(fp)) != EOF) {
        putchar(ch);
    }

    fclose(fp);

    return 0;
}
```

### 字符串读写 fgets/fputs

```
[[include]] 

int main() {
    FILE *fp;
    char str[100];

    // 写入字符串
    fp = fopen("output.txt", "w");
    fputs("Hello, World!\n", fp);
    fputs("This is a test.\n", fp);
    fclose(fp);

    // 读取字符串
    fp = fopen("output.txt", "r");
    while (fgets(str, sizeof(str), fp) != NULL) {
        printf("%s", str);
    }
    fclose(fp);

    return 0;
}
```

### 格式化读写 fprintf/fscanf

```
[[include]] 

struct Student {
    char name[50];
    int age;
    float score;
};

int main() {
    FILE *fp;
    struct Student stu = {"张三", 20, 85.5};
    struct Student s;

    // 写入文件
    fp = fopen("student.txt", "w");
    if (fp == NULL) return 1;

    fprintf(fp, "%s %d %.2f\n", stu.name, stu.age, stu.score);
    fclose(fp);

    // 读取文件
    fp = fopen("student.txt", "r");
    if (fp == NULL) return 1;

    fscanf(fp, "%s %d %f", s.name, &s.age, &s.score);
    printf("姓名：%s\n", s.name);
    printf("年龄：%d\n", s.age);
    printf("成绩：%.2f\n", s.score);

    fclose(fp);

    return 0;
}
```

## 二进制文件的读写

### 数据块读写 fread/fwrite

```
size_t fread(void *ptr, size_t size, size_t count, FILE *stream);
size_t fwrite(const void *ptr, size_t size, size_t count, FILE *stream);
```

```
[[include]] 

struct Student {
    char name[50];
    int age;
    float score;
};

int main() {
    FILE *fp;
    struct Student students[3] = {
        {"张三", 20, 85.5},
        {"李四", 21, 90.0},
        {"王五", 22, 88.5}
    };
    struct Student s[3];

    // 写入二进制文件
    fp = fopen("students.dat", "wb");
    if (fp == NULL) return 1;

    fwrite(students, sizeof(struct Student), 3, fp);
    fclose(fp);

    // 读取二进制文件
    fp = fopen("students.dat", "rb");
    if (fp == NULL) return 1;

    fread(s, sizeof(struct Student), 3, fp);
    fclose(fp);

    // 显示数据
    for (int i = 0; i < 3; i++) {
        printf("%s %d %.2f\n", s[i].name, s[i].age, s[i].score);
    }

    return 0;
}
```

#### 💡 二进制文件 vs 文本文件

* **二进制文件**：存储效率高，读写速度快，但不可读
* **文本文件**：可读性好，便于调试，但效率较低

## 文件的随机读写

### 文件定位函数

| 函数 | 说明 |
| --- | --- |
| `rewind(fp)` | 将文件位置指针移到文件开头 |
| `fseek(fp, offset, origin)` | 将文件位置指针移到指定位置 |
| `ftell(fp)` | 获取当前文件位置 |

### fseek的使用

```
[[include]] 

int main() {
    FILE *fp;

    fp = fopen("test.txt", "w+");
    if (fp == NULL) return 1;

    // 写入数据
    fputs("ABCDEFGHIJKLMNOPQRSTUVWXYZ", fp);

    // 定位到第10个字符
    fseek(fp, 10, SEEK_SET);
    printf("当前位置：%ld\n", ftell(fp));

    // 定位到文件末尾前5个字符
    fseek(fp, -5, SEEK_END);
    printf("当前位置：%ld\n", ftell(fp));

    // 回到文件开头
    rewind(fp);
    printf("当前位置：%ld\n", ftell(fp));

    fclose(fp);

    return 0;
}
```

**fseek的origin参数：**

* `SEEK_SET`：文件开头
* `SEEK_CUR`：当前位置
* `SEEK_END`：文件末尾

## 文件检测函数

| 函数 | 说明 |
| --- | --- |
| `feof(fp)` | 检测是否到达文件末尾 |
| `ferror(fp)` | 检测是否发生错误 |
| `clearerr(fp)` | 清除文件错误标志 |

```
[[include]] 

int main() {
    FILE *fp;
    char ch;

    fp = fopen("test.txt", "r");
    if (fp == NULL) return 1;

    // 检测文件结束
    while (!feof(fp)) {
        ch = fgetc(fp);
        if (!feof(fp)) {
            putchar(ch);
        }
    }

    // 检测错误
    if (ferror(fp)) {
        printf("读取文件时发生错误！\n");
        clearerr(fp);
    }

    fclose(fp);

    return 0;
}
```

## 标准文件流

C语言定义了三个标准文件流：

| 文件流 | 说明 | 默认设备 |
| --- | --- | --- |
| `stdin` | 标准输入 | 键盘 |
| `stdout` | 标准输出 | 屏幕 |
| `stderr` | 标准错误 | 屏幕 |

```
[[include]] 

int main() {
    // 从标准输入读取
    fprintf(stdout, "请输入内容：");
    char str[100];
    fscanf(stdin, "%s", str);

    // 输出到标准输出
    fprintf(stdout, "你输入了：%s\n", str);

    // 输出到标准错误
    fprintf(stderr, "这是错误信息\n");

    return 0;
}
```

## 综合示例：学生成绩管理系统

```
[[include]] 
[[include]] 
[[include]] 

[[define]] FILENAME "students.dat"

struct Student {
    int id;
    char name[50];
    float score;
};

// 添加学生
void addStudent() {
    FILE *fp = fopen(FILENAME, "ab");
    if (fp == NULL) {
        printf("无法打开文件！\n");
        return;
    }

    struct Student s;
    printf("学号：");
    scanf("%d", &s.id);
    printf("姓名：");
    scanf("%s", s.name);
    printf("成绩：");
    scanf("%f", &s.score);

    fwrite(&s, sizeof(struct Student), 1, fp);
    fclose(fp);

    printf("添加成功！\n");
}

// 显示所有学生
void displayStudents() {
    FILE *fp = fopen(FILENAME, "rb");
    if (fp == NULL) {
        printf("暂无学生信息！\n");
        return;
    }

    struct Student s;
    printf("\n%-10s %-20s %s\n", "学号", "姓名", "成绩");
    printf("--------------------------------\n");

    while (fread(&s, sizeof(struct Student), 1, fp) == 1) {
        printf("%-10d %-20s %.2f\n", s.id, s.name, s.score);
    }

    fclose(fp);
}

// 查找学生
void searchStudent() {
    int id;
    printf("请输入学号：");
    scanf("%d", &id);

    FILE *fp = fopen(FILENAME, "rb");
    if (fp == NULL) {
        printf("文件不存在！\n");
        return;
    }

    struct Student s;
    int found = 0;

    while (fread(&s, sizeof(struct Student), 1, fp) == 1) {
        if (s.id == id) {
            printf("\n找到学生：\n");
            printf("学号：%d\n", s.id);
            printf("姓名：%s\n", s.name);
            printf("成绩：%.2f\n", s.score);
            found = 1;
            break;
        }
    }

    if (!found) {
        printf("未找到该学生！\n");
    }

    fclose(fp);
}

// 修改学生成绩
void updateScore() {
    int id;
    printf("请输入学号：");
    scanf("%d", &id);

    FILE *fp = fopen(FILENAME, "rb+");
    if (fp == NULL) {
        printf("文件不存在！\n");
        return;
    }

    struct Student s;
    int found = 0;

    while (fread(&s, sizeof(struct Student), 1, fp) == 1) {
        if (s.id == id) {
            printf("当前成绩：%.2f\n", s.score);
            printf("新成绩：");
            scanf("%f", &s.score);

            // 移动回该记录的起始位置
            fseek(fp, -sizeof(struct Student), SEEK_CUR);
            fwrite(&s, sizeof(struct Student), 1, fp);

            printf("修改成功！\n");
            found = 1;
            break;
        }
    }

    if (!found) {
        printf("未找到该学生！\n");
    }

    fclose(fp);
}

int main() {
    int choice;

    while (1) {
        printf("\n===== 学生成绩管理系统 =====\n");
        printf("1. 添加学生\n");
        printf("2. 显示所有学生\n");
        printf("3. 查找学生\n");
        printf("4. 修改成绩\n");
        printf("5. 退出\n");
        printf("请选择：");
        scanf("%d", &choice);

        switch (choice) {
            case 1: addStudent(); break;
            case 2: displayStudents(); break;
            case 3: searchStudent(); break;
            case 4: updateScore(); break;
            case 5: return 0;
            default: printf("无效选择！\n");
        }
    }

    return 0;
}
```

## 本章小结

* ✓ 理解了文件的基本概念
* ✓ 掌握了文件的打开和关闭
* ✓ 学会了文本文件和二进制文件的读写
* ✓ 掌握了文件的随机读写
* ✓ 了解了文件检测函数

## 学习完成

恭喜！你已经完成了C语言程序设计的全部学习内容。

建议继续学习：

* 数据结构与算法
* 操作系统原理
* 计算机网络
* 数据库系统

#### 💡 持续学习建议

* 多编写实际项目巩固知识
* 阅读优秀开源代码
* 学习调试技巧
* 关注编程规范和最佳实践

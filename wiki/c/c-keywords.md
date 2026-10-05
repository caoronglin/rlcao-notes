---
collection:
  profile: wiki
  id: c
title: C语言32个关键字
abbrlink: 930820e
date: 2026-02-01 13:00:55
updated: 2026-02-01 13:00:55
---

# C语言32个关键字

> ⭐ 高优先级：必须掌握，所有 C 语言程序都由这些关键字组合而成

## 什么是关键字？

**关键字**（Keywords）是 C 语言中预保留且具有特殊含义的单词，不能用作变量名、函数名或其他用户定义的标识符。C 语言共有 **32 个关键字**，掌握它们就等于掌握了 C 语言的核心。

关键字按功能大致分为：

- **数据类型关键字**：定义变量和数据的类型
- **控制语句关键字**：控制程序的执行流程
- **存储类型关键字**：指定变量的存储方式和作用域
- **其他关键字**：用于特定功能的特殊关键字

## 数据类型关键字

### 基本数据类型

| 关键字 | 说明 | 示例 |
| --- | --- | --- |
| `void` | 声明函数无返回值或无参数，声明无类型指针，显式丢弃运算结果 | `void func(void);` |
| `char` | 字符型数据，属于整型数据的一种，通常占 1 字节 | `char c = 'A';` |
| `int` | 整型数据，通常为编译器指定的机器字长 | `int age = 25;` |
| `float` | 单精度浮点型数据，小数点后保存 6 位有效数字 | `float pi = 3.14f;` |
| `double` | 双精度浮点型数据，小数点后保存 15-16 位有效数字 | `double e = 2.71828;` |

### 类型修饰符

| 关键字 | 说明 | 示例 |
| --- | --- | --- |
| `short` | 修饰 int，短整型数据，可省略被修饰的 int | `short s = 100;` |
| `long` | 修饰 int，长整型数据，可省略被修饰的 int | `long l = 100000L;` |
| `signed` | 修饰整型数据，有符号数据类型（默认） | `signed int i = -10;` |
| `unsigned` | 修饰整型数据，无符号数据类型，只能表示正数 | `unsigned int u = 10;` |

### 构造类型

| 关键字 | 说明 | 示例 |
| --- | --- | --- |
| `struct` | 结构体声明，将不同类型的数据组合在一起 | `struct Student { int age; char name[20]; };` |
| `union` | 共用体声明，不同类型数据共享同一内存空间 | `union Data { int i; float f; };` |
| `enum` | 枚举声明，定义一组命名的整数常量 | `enum Color { RED, GREEN, BLUE };` |

## 存储类型关键字

| 关键字 | 说明 | 作用域 | 生命周期 |
| --- | --- | --- | --- |
| `auto` | 自动变量，由编译器自动分配及释放，通常在栈上分配 | 局部 | 临时 |
| `static` | 静态变量，分配在静态变量区；修饰函数时限定作用域为文件内部 | 局部/全局 | 永久 |
| `register` | 寄存器变量，建议编译器将变量存储到寄存器中以提高访问速度 | 局部 | 临时 |
| `extern` | 外部变量，声明变量或函数在其他文件中定义 | 全局 | 永久 |
| `typedef` | 类型别名，为已有类型定义新的名称 | - | - |

**提示**

- `auto` 是局部变量的默认存储类型，很少显式使用。
- `static` 用于限制变量作用域或延长生命周期。
- `register` 只是建议，编译器可能忽略。
- `extern` 用于跨文件共享变量和函数。
- `typedef` 不创建新类型，只是为现有类型创建别名。

## 控制语句关键字

### 选择语句

| 关键字 | 说明 | 示例 |
| --- | --- | --- |
| `if` | 条件判断语句 | `if (x > 0) { ... }` |
| `else` | 与 if 配合使用，条件不满足时执行 | `else { ... }` |
| `switch` | 多分支选择语句 | `switch (day) { ... }` |
| `case` | `switch` 中的分支标签 | `case 1: ...;` |
| `default` | `switch` 中的默认分支 | `default: ...;` |

### 循环语句

| 关键字 | 说明 | 示例 |
| --- | --- | --- |
| `for` | `for` 循环语句 | `for (int i = 0; i < 10; i++) { ... }` |
| `while` | `while` 循环语句 | `while (condition) { ... }` |
| `do` | `do-while` 循环语句，先执行后判断 | `do { ... } while (condition);` |

### 跳转语句

| 关键字 | 说明 | 示例 |
| --- | --- | --- |
| `break` | 跳出当前循环或 `switch` 语句 | `break;` |
| `continue` | 结束本次循环，开始下一次循环 | `continue;` |
| `goto` | 无条件跳转语句（不推荐） | `goto label;` |
| `return` | 从函数返回，可带回返回值 | `return 0;` |

## 运算符关键字

| 关键字 | 说明 | 示例 |
| --- | --- | --- |
| `sizeof` | 计算特定类型或变量的大小（字节） | `int size = sizeof(int);` |

## 完整关键字列表

C 语言 32 个关键字按字母顺序排列：

```
auto      break    case     char     const     continue
default   do       double   else     enum      extern
float     for      goto     if       int       long
register  return   short    signed   sizeof    static
struct    switch   typedef  union    unsigned  void
volatile  while
```

> 💡 C99 新增 `_Bool`、`_Complex`、`_Imaginary`；C11 新增 `_Alignas`、`_Generic` 等。传统的 32 个关键字仍是最核心、最常用的一组。

## 学习建议

- **分类记忆**：按功能分类记忆，理解用途与场景。
- **多写代码**：在实际代码中多次使用关键字，加深理解。
- **对比学习**：对比相似关键字，如 `struct` vs `union`、`while` vs `do-while` 等。

## 下一步学习

- [main 函数详解](/wiki/c/main-function/)：理解程序入口点。
- [第 2 章 C 语言基础](/wiki/c/chapter2/)：数据类型和表达式。
- [第 3 章 程序设计基本结构](/wiki/c/chapter3/)：掌握控制流程。

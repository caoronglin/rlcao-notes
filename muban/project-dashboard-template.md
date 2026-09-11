---
title: "<% tp.file.title %>"
created: <% tp.date.now("YYYY-MM-DD") %>
finished: false
tags: ["project/<% tp.file.title %>"]
alias:
---

# <% tp.file.title %>

> [!INFO] 项目状态
> **状态**: 进行中 | **启动**: <% tp.date.now("YYYY-MM-DD") %>

## 项目规划

![[<% tp.file.title %>-plan.canvas]]

## 项目笔记

```dataview
table 创建日期, 标签
from [[project/]]<% tp.file.title %>
sort 创建日期 desc
```

## 待办任务

```dataview
task from "项目/<% tp.file.title %>" or "panel/周志"
where !completed
sort created desc
```

## 近期任务

```tasks
not done
path includes <% tp.file.title %>
sort by priority
```

## 项目日志

> 日志记录在 `项目/周志/` 中，按周归类

```dataview
list
from "项目/周志"
where contains(file.tags, "#project/<% tp.file.title %>")
sort file.name desc
```

## 参考资料

-

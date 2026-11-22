---
collection:
  profile: notebook
  id: bio
title: _index
date: 2026-10-06
---
# 🧬 生物信息学笔记

>从启航计划到单细胞、工具链的系统性笔记

## 📊 总览

```dataview
TABLE WITHOUT ID
  length(rows) AS "📄 笔记数",
  length(filter(rows, (x) => x.status = "completed")) AS "✅ 已完成",
  length(filter(rows, (x) => x.status = "ongoing")) AS "📖 进行中"
WHERE notebook = "bio"
```

## 📁 目录

| 目录 | 说明 |
|------|------|
| [[_guides/]] | Obsidian + Zotero 配置指南 |
| [[启航计划/]] | 生信入门训练营任务笔记 |
| [[单细胞/]] | 单细胞转录组分析笔记 |
| [[_annotations/]] | Zotero 论文批注（自动同步） |

## 📋 全部笔记

```dataview
table 
  date as "日期",
  status as "状态",
  tags as "标签"
from "notes/bio"
where file.name != "_index"
sort date desc
```

## 🔬 按标签筛选

```dataview
table length(rows) as "笔记数"
from "notes/bio"
where notebook = "bio"
group by tags
sort length(rows) desc
```

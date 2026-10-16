---
type: daily
date: "{{date:YYYY-MM-DD}}"
created: "{{date:YYYY-MM-DD}}"
tags: [periodic/daily]
---
# {{date:YYYY-MM-DD}} 每日记录与总结

## 今日三件事
- [ ]
- [ ]
- [ ]

## 过程记录

## 实验与项目进展
```dataview
LIST FROM "vault/实验记录"
WHERE date = date("{{date:YYYY-MM-DD}}")
SORT file.name ASC
```

## 每日总结
### 今天完成了什么

### 结果、收获与问题

### 明日计划
- [ ]

## 待整理的输入

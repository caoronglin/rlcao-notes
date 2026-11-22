---
collection:
  profile: notebook
  id: bio
title: README
date: 2026-10-06
---
# Hermes WSD509 RDS 方案生成评测包

>用途：把 WSD509 多用户 RDS 服务器搭建/排障任务脱敏后，交给 Hermes 或其他模型生成完整运维方案，用于测试模型在 Windows Server / AD DS / RDS / PowerShell / GPO 领域的能力。

## 文件结构

```text
hermes-wsd509-rds-eval/
├─ prompt.md                         # 主任务提示词：让模型输出完整方案
├─ scoring-rubric.md                 # 评分标准
└─ skills/
   ├─ required-skills.md             # 必需能力清单
   ├─ recommended-skills.md          # 推荐能力清单
   └─ high-risk-skills.md            # 不建议模型自动执行的高风险能力
```

## 使用方式

1. 将 `prompt.md` 内容作为 Hermes 的主输入。
2. 将 `skills/required-skills.md` 和 `skills/recommended-skills.md` 作为可用能力说明。
3. 将 `skills/high-risk-skills.md` 作为安全约束。
4. 用 `scoring-rubric.md` 对 Hermes 输出进行评测。

## 脱敏规则

| 原始类型 | 脱敏后 |
|---|---|
| 服务器名 | `SRV-RDS01` |
| 域名 | `example.local` |
| NetBIOS | `EXAMPLE` |
| 用户名 | `U25alpha`, `U25beta`, `U26gamma`, `U25test` |
| Obsidian 路径 | `D:\Vault\Private\…` |
| 用户数据目录 | `E:\Users\<user>` |
| 个人软件目录 | `D:\PerUser\<user>\Apps` |
| 公共目录 | `D:\Public` |
| 缓存目录 | `F:\code\cache` |
| 备份目录 | `F:\Backup` |

硬件 `Tesla P100` 和 `Chelsio T520` 保留，因为它们是排障任务的关键技术条件。

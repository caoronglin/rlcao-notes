# 2026-11-22 脏数据清理

## 归档的零信息文件（不含可复用内容）

| 文件 | 原位置 | 判定依据 |
|---|---|---|
| 日记-未命名-0字节.md | vault/日记/ | 0 字节，无任何内容 |
| notes-bio-未命名-测试乱敲.md | notes/bio/ | 正文为「Cesh9 / cesh / ceih / cd」测试键盘输入 |
| 单细胞相关代码-未命名-空壳.md | notes/bio/生信学习/单细胞/相关代码/ | 仅 `# 未命名` 标题 |
| wiki-未命名-空壳.md | wiki/生信学笔记/生信入门课程/ | 仅 `# 未命名` 标题 |
| 独立工作表.自动备份.2026-10-16T03-22-28-036Z.duowei | vault/工作台/ | duowei-table 自动备份，正本 `独立工作表.duowei` 在位且被两篇笔记引用 |

## 改名归位（有真实内容，不是垃圾）

| 原位置 | 新位置 | 理由 |
|---|---|---|
| notes/class-notes/evolution/未命名.md | vault/系统与工具/电脑管理/Windows Server 虚拟机远程访问方案.md | 598 行，正文为 Hyper-V / RDP / 端口转发 / 桥接，与「进化生物学」无关 |
| notes/class-notes/cell/未命名.md | notes/class-notes/cell/细胞生物学重点知识体系.md | 144 行细胞生物学思维导图 |

## 删除

- `notes/生信实验/04/msa_compute_20261107/muscle_mrna.fasta`：0 字节，可由 muscle 重跑生成
- 空目录 `notes/生信实验/02/shots`、`notes/生信实验/03/shots`
- 插件 `homepage`：已被 workbench 工作台取代且长期禁用

## 保留（可追溯占位，非垃圾）

- `notes/学习笔记/无标题文档.md`、`notes/Python学习/第八章 类和对象/无标题文档.md`：语雀白板导出占位，含原文链接 `yuque.com/docs-crl/...`，删了就断溯源
- `无标题数据表.md` ×3（个人知识库 / blog / _posts）：三份内容互不相同，均为语雀数据表导出

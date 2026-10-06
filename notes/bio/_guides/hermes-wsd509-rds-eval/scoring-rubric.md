---
collection:
  profile: notebook
  id: bio
title: scoring-rubric
date: 2026-10-06
---
# Hermes 输出评分标准

总分：100 分。

---

## 1. Windows Server / AD / RDS 架构理解（15 分）

优秀输出应能：

- 正确理解单机域控 + RDSH + DNS + DHCP 场景。
- 区分域用户、域组、本地/内置组。
- 给出 AD 用户创建和加组流程。
- 说明 RDS 登录权限与 `Remote Desktop Users` 的关系。

扣分点：

- 把域控当普通工作组服务器处理。
- 忽略用户必须加入 RDS 相关组。
- 给出不适合域控/RDSH 的建议。

---

## 2. PowerShell 脚本质量（15 分）

优秀输出应包含：

- 交互式菜单。
- 非交互参数。
- CSV 批量创建。
- DryRun。
- RepairFolders。
- 初始密码导出并锁权限。
- 避免 `$Sam: $_` 解析错误。
- 明确 UTF-8 with BOM 要求。

扣分点：

- 只给零散命令，不给脚本结构。
- 没有错误处理。
- 明文密码日志未锁权限。
- 出现 PowerShell 语法错误。

---

## 3. ACL / NTFS 权限安全（15 分）

优秀输出应做到：

- 使用 `takeown` + `icacls`。
- 禁用继承。
- 用户私有目录只给用户本人、Administrators、SYSTEM。
- `D:\Public` 给 `RDS_Users` Modify，不给 Everyone:F。
- 修改前提供 ACL 备份。
- 提供验证命令。

扣分点：

- 建议 Everyone:F。
- 直接开放 Users:F。
- 没有备份/回滚。
- ACL 命令不完整。

---

## 4. GPO / RDS GPU / 60 FPS（15 分）

优秀输出应包含：

- 使用 `Set-GPRegistryValue` 配置策略。
- 正确列出 RDS GPU 策略键值。
- 正确说明 `DWMFRAMEINTERVAL=15` 对应 60 FPS。
- 明确 RDP 通常不能真正 120 FPS。
- 给出 `nvidia-smi` 监控命令。
- 给出 Remmina/FreeRDP 排查命令。
- 警惕 GPT.INI 损坏风险。

扣分点：

- 承诺 120 FPS。
- 只建议直接改 HKLM，不提 GPO。
- 手写 GPO 文件无备份。
- 不知道 NVENC 如何验证。

---

## 5. DHCP / DNS 处理（10 分）

优秀输出应包含：

- 解释域内 DHCP 需要 AD 授权。
- 使用 `Get-DhcpServerInDC` / `Add-DhcpServerInDC`。
- 提供 lease、scope、option 验证命令。
- 解释 L2 broadcast 与 DHCP Relay。

扣分点：

- 把问题只归咎于防火墙。
- 忽略 AD 授权。
- 不给验证命令。

---

## 6. 缓存迁移与 C:\Users 膨胀分析（10 分）

优秀输出应包含：

- 解释 Shell Folder 重定向不能阻止 AppData 膨胀。
- 给出 pip/uv/npm/pnpm/R 缓存迁移命令。
- 给出 R `Renviron.site` 备用方案。
- 给出验证命令。
- 说明注销重登/重开 RStudio 的必要性。

扣分点：

- 说当前方案不会膨胀。
- 忽略 AppData。
- R temp/downloaded_packages 仍留在 C 盘。

---

## 7. FSLogix 架构建议（10 分）

优秀输出应包含：

- 说明 FSLogix Profile Container 的价值。
- 区分 Profile、AppData、大文件数据目录。
- 推荐灰度测试而不是全员切换。
- 给出目标目录结构。
- 提醒 VHDX 锁定和容器膨胀风险。

扣分点：

- 建议立即全员启用。
- 不提备份和灰度。
- 把大数据建议放进 Profile。

---

## 8. 文档化与表达（10 分）

优秀输出应包含：

- 清晰 Markdown 结构。
- 章节完整。
- 命令可复制。
- 标明风险和需要现场验证项。
- 不伪造来源。

扣分点：

- 结构混乱。
- 缺少关键命令。
- 无风险提示。
- 伪造文档或参数。

---

## 总评建议

| 分数 | 评价 |
|---|---|
| 90-100 | 可作为高质量运维方案初稿 |
| 75-89 | 大体可用，但需人工补强关键细节 |
| 60-74 | 有明显缺漏，只能作参考 |
| <60 | 不适合直接用于 Windows Server/RDS 运维 |

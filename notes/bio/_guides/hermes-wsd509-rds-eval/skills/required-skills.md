---
collection:
  profile: notebook
  id: bio
title: required-skills
date: 2026-10-06
---
# 必需 Skills

>这些能力是 Hermes 完成 `prompt.md` 中方案生成任务所必需的。这里的 skills 是"能力说明"，不是让模型直接执行危险操作。

---

## 1. Windows Server / Active Directory 管理

需要能力：

- 理解 Windows Server 2025 基础角色。
- 理解 AD DS、DNS、DHCP、RDSH 同机部署的约束。
- 能设计 AD 用户创建流程。
- 能管理 OU、AD Group、本地/内置组。
- 能区分：
  - 域用户：`EXAMPLE\<user>`
  - 域组：`EXAMPLE\RDS_Users`
  - 内置组：`Remote Desktop Users`
- 能给出 `New-ADUser`、`Add-ADGroupMember`、`Get-ADUser`、`Get-ADGroupMember` 等 PowerShell 命令。

---

## 2. PowerShell 脚本生成与调试

需要能力：

- 编写交互式 PowerShell 菜单。
- 编写支持参数的脚本：
  - `-NonInteractive`
  - `-SamAccountName`
  - `-DisplayName`
  - `-CsvPath`
  - `-DryRun`
  - `-RepairFolders`
- 使用 `Import-Csv` 批量创建用户。
- 使用 `try/catch`、`ErrorAction Stop`、`Write-Host` 状态输出。
- 正确处理 PowerShell 字符串插值坑：

```powershell
# 错误
"Cannot create shortcuts for $Sam: $_"

# 正确
("Cannot create shortcuts for {0}: {1}" -f $Sam, $_)
"${Sam}: ..."
```

- 能解释并处理 Windows PowerShell 5.1 下 UTF-8 无 BOM 中文脚本乱码问题。

---

## 3. Windows ACL / NTFS 权限管理

需要能力：

- 使用 `takeown` 接管目录所有权。
- 使用 `icacls` 重置、禁用继承、授权。
- 使用 `icacls /save` 和 `icacls /restore` 备份/恢复 ACL。
- 理解 `(OI)(CI)F`、`(OI)(CI)M` 的含义。
- 能设计私有用户目录权限：
  - 用户 FullControl
  - Administrators FullControl
  - SYSTEM FullControl
- 能设计公共目录权限：
  - RDS_Users Modify
  - 不给 `Everyone:F`

---

## 4. Group Policy / GPO 管理

需要能力：

- 理解 GPO 链接、OU、SYSVOL、GPT.INI、Registry.pol。
- 使用 `Set-GPRegistryValue` 写策略注册表。
- 使用 `Get-GPRegistryValue` 验证策略。
- 使用 `gpupdate`、`gpresult` 排查策略应用。
- 避免手写 GPP Registry XML 作为首选方案。
- 理解 GPT.INI 基本格式：

```ini
[General]
Version=<number>
displayName=<GPOName>
```

---

## 5. Windows RDS / Remote Desktop Services

需要能力：

- 理解 RD Session Host、RD Licensing、Remote Desktop Users。
- 理解 RDP 登录权限与域控登录限制。
- 能解释多用户 RDS 环境中的用户 Profile、Shell Folder、AppData 区别。
- 能给出 RDS 图形策略配置建议。

---

## 6. NVIDIA GPU / RDP 编码排查

需要能力：

- 理解 RDP H.264 / AVC444 / NVENC 的关系。
- 能解释 `DWMFRAMEINTERVAL=15` 对应 60 FPS。
- 能指出 RDP 通常无法真正达到 120 FPS。
- 能使用 `nvidia-smi` 监控：
  - encoder sessionCount
  - averageFps
  - utilization.gpu
- 能给出 Remmina/FreeRDP 客户端排查命令。

---

## 7. DHCP / DNS 基础运维

需要能力：

- 理解 Windows DHCP 在域环境中需要 AD 授权。
- 使用：
  - `Get-DhcpServerInDC`
  - `Add-DhcpServerInDC`
  - `Get-DhcpServerv4Scope`
  - `Get-DhcpServerv4Lease`
  - `Get-DhcpServerv4OptionValue`
- 能解释 DHCP 广播只在同 L2 网段传播，跨网段需要 DHCP Relay/IP Helper。
- 能说明 DNS Server option 和 DNS Domain option 的设置。

---

## 8. Markdown 文档整理

需要能力：

- 生成 Obsidian 友好的 Markdown。
- 使用清晰的标题层级、目录、表格、代码块。
- 将运维方案整理成可长期维护的手册。
- 输出速查命令表。

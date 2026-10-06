---
collection:
  profile: notebook
  id: bio
title: prompt
date: 2026-10-06
---
# Hermes 测试提示词：Windows Server 2025 RDS 多用户环境方案生成

你是一个高级 Windows Server / RDS / PowerShell / AD DS 运维专家。请基于下面的上下文，给出严谨、可执行、低风险的排障与配置方案。所有回答使用简体中文；命令、路径、技术标识符保持英文。不要伪造文档来源，不确定时明确说明。

---

## 背景

我在搭建一台 Windows Server 2025 多用户远程桌面服务器，脱敏信息如下：

- 服务器名：`SRV-RDS01`
- 域名：`example.local`
- NetBIOS：`EXAMPLE`
- 服务器角色：
  - AD DS
  - DNS
  - DHCP
  - RD Session Host
  - RD Licensing
- GPU：NVIDIA Tesla P100
- 网卡：Chelsio T520
- 目标：单机域控 + 多用户 RDS 办公环境

## 安全要求

1. Windows Server/RDS/GPO 配置优先使用 gpedit/GPMC/GPO/`Set-GPRegistryValue`，不要随意直接改注册表。
2. 目录权限使用 `icacls` / `takeown`，避免复杂 .NET ACL API。
3. 删除、覆盖、清空目录等操作前必须明确风险。
4. 不要给 `Everyone:F`。
5. 不能伪造文献、官方来源或不存在的功能。
6. 不确定处标注"需要现场验证"。

---

## 一、用户管理

需要一个创建 RDS 用户的 PowerShell 脚本，支持：

### 1. 交互式菜单

- 创建单个用户
- 从 CSV 批量创建用户
- 修复已存在用户的目录和 ACL
- 退出

### 2. 非交互参数

- `-NonInteractive`
- `-SamAccountName`
- `-DisplayName`
- `-GivenName`
- `-Surname`
- `-InitialPassword`
- `-CsvPath`
- `-DryRun`
- `-RepairFolders`
- `-SkipFolderInit`

### 3. 创建用户时自动完成

- 创建 AD 用户到 `OU=RDS_Users,DC=example,DC=local`
- 加入 `EXAMPLE\RDS_Users`
- 加入本地/内置 `Remote Desktop Users`
- 创建：
  - `D:\PerUser\<user>\Apps`
  - `E:\Users\<user>\Desktop`
  - `E:\Users\<user>\Documents`
  - `E:\Users\<user>\Downloads`
  - `E:\Users\<user>\Pictures`
  - `E:\Users\<user>\Music`
  - `E:\Users\<user>\Videos`
  - `E:\Users\<user>\.logs`
- 设置私有 ACL：
  - `EXAMPLE\<user>` FullControl
  - `BUILTIN\Administrators` FullControl
  - `NT AUTHORITY\SYSTEM` FullControl
- 在桌面创建两个快捷方式：
  - `Personal Apps.lnk` -> `D:\PerUser\<user>\Apps`
  - `Personal Data.lnk` -> `E:\Users\<user>`
- 初始密码导出到 `F:\Backup\NewUsers_yyyyMMdd_HHmmss.csv`
- 密码 CSV 锁 ACL，仅 Administrators + SYSTEM 可读

### 4. 已遇到的 PowerShell 解析错误

错误写法：

```powershell
"Cannot create shortcuts for $Sam: $_"
```

会报：

```text
变量引用无效。':' 后面的变量名称字符无效。
```

正确写法应使用：

```powershell
("Cannot create shortcuts for {0}: {1}" -f $Sam, $_)
```

或：

```powershell
"${Sam}: ..."
```

请在方案中避免这类错误。

---

## 二、用户目录和 ACL

目标目录：

- `D:\PerUser\<user>\Apps`
- `E:\Users\<user>\Desktop`
- `E:\Users\<user>\Documents`
- `E:\Users\<user>\Downloads`
- `E:\Users\<user>\Pictures`
- `E:\Users\<user>\Music`
- `E:\Users\<user>\Videos`
- `E:\Users\<user>\.logs`

ACL 标准：

### 用户私有目录

- `EXAMPLE\<user>:(OI)(CI)F`
- `BUILTIN\Administrators:(OI)(CI)F`
- `NT AUTHORITY\SYSTEM:(OI)(CI)F`
- 禁用继承

### 公共目录 `D:\Public`

- `BUILTIN\Administrators:(OI)(CI)F`
- `NT AUTHORITY\SYSTEM:(OI)(CI)F`
- `EXAMPLE\RDS_Users:(OI)(CI)M`
- 不给 `Everyone:F`

需要提供：

- 修复单个用户 ACL 的命令
- 修复 `D:\Public` 权限的命令
- ACL 备份到 `F:\Backup\ACL` 的方案
- ACL 验证命令

---

## 三、登录初始化脚本

有一个用户登录脚本：

```text
\\example.local\SYSVOL\example.local\scripts\RDS\UserLoginInit.ps1
```

通过 GPO：

```text
RDS-UserInit -> OU=RDS_Users,DC=example,DC=local
```

登录脚本做：

1. 跳过 Administrator/SYSTEM/Guest 等内置账号
2. 创建 `D:\PerUser\<user>\Apps`
3. 创建 `E:\Users\<user>` 下的 Desktop/Documents/Downloads/Pictures/Music/Videos/.logs
4. 设置 ACL
5. 将 `D:\PerUser\<user>\Apps` 加入用户 PATH
6. 重定向 HKCU Shell Folders：
   - Desktop
   - Personal
   - Downloads `{374DE290-123F-4565-9164-39C4925E467B}`
   - My Pictures
   - My Music
   - My Video
7. 日志应写到 `E:\Users\<user>\.logs`，而不是 `E:\Logs`

需要提供：

- 登录脚本设计建议
- Shell Folders 验证命令
- 日志权限问题诊断
- 为什么 Windows PowerShell 5.1 下中文脚本容易乱码

---

## 四、编码问题

已遇到乱码：

```text
个人软件目录 -> 涓汉杞欢鐩綍
```

原因：Windows PowerShell 5.1 对 UTF-8 无 BOM 中文脚本可能按 GBK/ANSI 读取。

需要提供：

1. 建议脚本保存为 UTF-8 with BOM。
2. 中文提示可以有，但注释/日志/快捷方式名最好英文。
3. 设置开发环境默认 UTF-8：
   - `PYTHONUTF8=1`
   - `PYTHONIOENCODING=utf-8`
   - `LANG=zh_CN.UTF-8`
   - `LC_ALL=zh_CN.UTF-8`
   - PowerShell Profile 设置 `chcp 65001`
   - `$OutputEncoding`
   - `[Console]::InputEncoding`
   - `[Console]::OutputEncoding`
4. 不建议贸然开启 Windows 全局 UTF-8 Beta。

---

## 五、RDS GPU / 60 FPS

服务器有 Tesla P100。

目标：

- 启用 RDS 硬件图形加速
- RDP 达到 60 FPS
- 确认 NVENC 使用情况

GPO：

- 名称：`RDS-GPU`
- 链接到：`OU=RDS_Computers,DC=example,DC=local`

需要配置：

注册表策略路径：

```text
HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services
```

值：

- `fEnableWddmDriver=1`
- `bEnumerateHWBeforeSW=1`
- `AVCHardwareEncodePreferred=1`
- `AVC444ModePreferred=1`
- `DWMFRAMEINTERVAL=15`

注意：

- `DWMFRAMEINTERVAL=15` 表示 60 FPS 上限。
- RDP 通常无法真正 120 FPS。
- GPP Registry XML 方式曾经不生效。
- 推荐使用 `Set-GPRegistryValue`。
- 曾经误写 GPT.INI 导致 GPO 损坏，修复时必须保持：
  - `[General]`
  - `Version=<number>`
  - `displayName=<GPOName>`

需要提供：

- 推荐的 GPO 配置命令
- 验证命令
- `nvidia-smi` NVENC 监控命令
- Remmina/FreeRDP 客户端排查命令：
  - `xfreerdp /buildconfig`
  - `/gfx:AVC444`
  - `testufo.com/framerates`

---

## 六、DHCP

DHCP 服务在域控上运行，但曾经不发地址。

根因：

- Windows DHCP 在域环境需要 AD 授权。
- `Get-DhcpServerInDC` 返回空表示未授权。

需要提供：

- 查看授权命令
- 授权命令：
  - `Add-DhcpServerInDC -DnsName 'SRV-RDS01.example.local' -IPAddress 192.168.1.10`
- 重启 DHCP
- 查看 scope、lease、options 的命令
- DNS Server option 应指向 `192.168.1.10`
- DNS Domain 应为 `example.local`
- 解释 DHCP 广播只在同 L2 网段传播，跨网段需要 DHCP Relay/IP Helper

---

## 七、开发工具缓存迁移

目标：减少 `C:\Users\<user>\AppData` 膨胀。

将缓存迁到：

```text
F:\code\cache
```

需要迁移：

### Python

- pip:
  - `PIP_CACHE_DIR=F:\code\cache\pip`
- uv:
  - `UV_CACHE_DIR=F:\code\cache\uv`

### Node

- npm/npx:
  - `NPM_CONFIG_CACHE=F:\code\cache\npm`
- pnpm/pnpx:
  - `npm_config_store_dir=F:\code\cache\pnpm-store`
- yarn:
  - `YARN_CACHE_FOLDER=F:\code\cache\yarn`
- node-gyp:
  - `npm_config_devdir=F:\code\cache\node-gyp`

### R

- shared library:
  - `R_LIBS_SITE=F:\code\cache\R\site-library`
- user cache:
  - `R_USER_CACHE_DIR=F:\code\cache\R\user-cache`
- renv:
  - `RENV_PATHS_CACHE=F:\code\cache\R\renv-cache`
- pak:
  - `PAK_CACHE_DIR=F:\code\cache\R\pak-cache`
- R temp/downloaded_packages:
  - `TMPDIR=F:\code\cache\R\temp`
  - `TEMP=F:\code\cache\R\temp`
  - `TMP=F:\code\cache\R\temp`

需要提供：

- 创建目录命令
- 设置 ACL 命令：
  - Administrators/SYSTEM FullControl
  - `EXAMPLE\RDS_Users` Modify
- 设置 Machine 级环境变量命令
- 验证命令：
  - `pip cache dir`
  - `uv cache dir`
  - `npm config get cache`
  - `pnpm store path`
  - R 中 `.libPaths()`、`Sys.getenv()`、`tempdir()`
- 如果 R 仍然使用 C 盘 Temp，写 `Renviron.site` 的方案

---

## 八、C:\Users 膨胀评估

当前方案已经重定向：

- Desktop
- Documents
- Downloads
- Pictures
- Music
- Videos

但仍然会膨胀：

- `C:\Users\<user>\AppData`
- `C:\Users\<user>\NTUSER.DAT`
- 浏览器缓存
- 微信/QQ/Office/VS Code/Python/R/Conda 缓存
- Temp

需要解释：

- 当前方案能减缓 C 盘膨胀，但不能消除。
- FSLogix 可以把完整 Profile 放入 VHDX 容器。
- 不建议立即全员切 FSLogix，应该灰度测试。

---

## 九、FSLogix 架构建议

需要说明 FSLogix Profile Container 的好处：

- 完整 Profile 容器化
- AppData 不散落在 C 盘
- 用户配置持久化
- 多 RDSH 扩展容易
- 比传统 Roaming Profile 更稳
- 对 Office/Teams/Edge/Chrome/VS Code 等更友好

推荐目标架构：

- `C:\`：系统
- `D:\PerUser\<user>\Apps`：个人软件目录
- `D:\Public`：公共目录
- `D:\Scripts`：管理脚本
- `E:\FSLogixProfiles\<user>\Profile_<user>.vhdx`：用户 Profile 容器
- `E:\Data\<user>`：大文件/项目数据
- `F:\Backup`：备份
- `F:\code\cache`：开发工具缓存

迁移建议：

1. 创建 `FSLogix_Users` 安全组。
2. 只让测试用户进入。
3. 先验证 VHDX 创建、挂载、卸载、再次登录。
4. 再逐步迁移正式用户。

---

## 十、Chelsio T520 网卡

需要给出诊断路线：

- Vendor ID: `VEN_1425`
- 检查设备管理器状态
- 检查驱动签名
- 检查是否被 HVCI/Memory Integrity 阻止
- 使用 Chelsio Unified Wire 驱动
- 给出 PowerShell 查询设备、驱动、DeviceGuard 状态的命令

---

## 十一、Obsidian 文档整理

需要把全部流程整理成 Markdown 文档，建议存放：

```text
D:\Vault\Private\_guides\rds-server-setup.md
```

文档应包含：

- 服务器概述
- AD 用户管理
- 用户目录与 ACL
- 登录初始化脚本
- RDS GPU 策略与帧率优化
- 开发工具缓存迁移
- 默认 UTF-8 编码
- DHCP 服务配置
- 目录权限管理
- RDP/Remmina 排查
- FSLogix 架构参考
- Chelsio T520 诊断
- 常见错误与修复
- 速查命令表

---

## 输出要求

请根据以上上下文，输出一个完整、结构化、可执行的运维方案。要求：

1. 不要只讲概念，要给具体 PowerShell 命令。
2. 破坏性操作前要标明风险。
3. GPO 优先，不要随便直接改注册表；但允许使用 `Set-GPRegistryValue`。
4. 目录 ACL 用 `icacls` / `takeown`。
5. 不给 `Everyone:F`。
6. 注意 Windows PowerShell 5.1 中文编码问题。
7. 对可能不确定的地方明确标注"需要现场验证"。
8. 最后给出一份 Markdown 文档目录结构和关键命令摘要。

---
collection:
  profile: notebook
  id: bio
title: wsd509-rds-setup
date: 2026-10-06
---
# WSD509 远程桌面服务器运维手册

>Windows Server 2025 | 单机域 `wsad.local` | RDS 多用户办公环境 | Tesla P100 GPU

---

## 目录

1. [服务器概述](#1-服务器概述)
2. [AD 用户管理](#2-ad-用户管理)
3. [用户目录结构与 ACL](#3-用户目录结构与-acl)
4. [登录初始化脚本](#4-登录初始化脚本)
5. [RDS GPU 策略 & 帧率优化](#5-rds-gpu-策略--帧率优化)
6. [开发工具缓存迁移](#6-开发工具缓存迁移)
7. [默认 UTF-8 编码](#7-默认-utf-8-编码)
8. [DHCP 服务配置](#8-dhcp-服务配置)
9. [目录权限管理](#9-目录权限管理)
10. [RDP/Remmina 帧率排查](#10-rdpremmina-帧率排查)
11. [FSLogix 架构参考](#11-fslogix-架构参考)
12. [Chelsio T520 网卡诊断](#12-chelsio-t520-网卡诊断)
13. [常见错误与修复](#13-常见错误与修复)
14. [速查命令表](#14-速查命令表)

---

## 1. 服务器概述

### 基本信息

| 属性 | 值 |
|------|------|
| 主机名 | WSD509 |
| OS | Windows Server 2025 |
| 域 | `wsad.local` |
| NetBIOS | `WSAD` |
| 域控 | 单机域控（AD DS + DNS + RDSH 同机部署） |
| GPU | NVIDIA Tesla P100（WDDM 模式） |
| 网卡 | Chelsio T520 |
| 用途 | 多用户远程桌面办公环境 |

### 角色

- AD DS（Active Directory 域服务）
- DNS 服务器
- RD Session Host（远程桌面会话主机）
- RD Licensing（远程桌面授权）
- DHCP 服务器

### 磁盘布局

| 盘符 | 用途 |
|------|------|
| C: | 系统 + Windows Server 2025 |
| D: | PerUser 目录、Public 共享、Scripts |
| E: | 用户数据目录、FSLogix Profiles |
| F: | 备份、开发工具缓存 |

#### 目标目录结构

```
C:\Windows\SYSVOL\sysvol\wsad.local\scripts\WSD509\
  └─ UserLoginInit.ps1               登录初始化脚本

D:\
  ├─ D:\PerUser\<user>\Apps          个人软件目录
  ├─ D:\Public                       公共共享目录
  └─ D:\Scripts\                     管理脚本
       ├─ New-WSD509RDSUser.ps1      创建用户脚本
       ├─ UserLoginInit.ps1          本地旧脚本（已废弃）
       └─ Register-UserLoginInitTask.ps1  旧计划任务脚本（已废弃）

E:\
  ├─ E:\Users\<user>\                用户数据目录
  │    ├─ Desktop\
  │    ├─ Documents\
  │    ├─ Downloads\
  │    ├─ Pictures\
  │    ├─ Music\
  │    ├─ Videos\
  │    └─ .logs\                     登录脚本日志
  ├─ E:\Logs\                        系统级日志（普通用户无权限）
  └─ E:\FSLogixProfiles\<user>\      FSLogix Profile 容器

F:\
  ├─ F:\Backup\                      备份
  │    ├─ ACL\                       ACL 备份
  │    └─ NewUsers_*.csv             新建用户密码日志
  └─ F:\code\cache\                  开发工具缓存
       ├─ pip\
       ├─ uv\
       ├─ npm\
       ├─ pnpm-store\
       ├─ yarn\
       ├─ node-gyp\
       └─ R\
            ├─ site-library\
            ├─ user-cache\
            ├─ renv-cache\
            ├─ pak-cache\
            └─ temp\
```

---

## 2. AD 用户管理

### 脚本文件

- **路径**：`D:\Scripts\New-WSD509RDSUser.ps1`
- **功能**：交互式创建/修复 RDS 用户
- **运行方式**：

```powershell
powershell.exe -ExecutionPolicy Bypass -File D:\Scripts\New-WSD509RDSUser.ps1
```

### 交互菜单

```
1. 创建单个 RDS 用户
2. 从 CSV 批量创建用户
3. 修复已存在用户的目录和权限
4. 退出
```

### 脚本参数

| 参数 | 说明 | 示例 |
|------|------|------|
| `-NonInteractive` | 非交互模式 | `-NonInteractive` |
| `-SamAccountName` | 登录名 | `-SamAccountName M25qisheng` |
| `-DisplayName` | 显示名 | `-DisplayName "M25qisheng"` |
| `-GivenName` | 名 | `-GivenName "Qisheng"` |
| `-Surname` | 姓 | `-Surname "Meng"` |
| `-InitialPassword` | 初始密码 | `-InitialPassword 'Init#2026!Strong'` |
| `-CsvPath` | CSV 批量文件路径 | `-CsvPath D:\Scripts\users.csv` |
| `-DryRun` | 预演模式 | `-DryRun` |
| `-RepairFolders` | 修复已存在用户目录和 ACL | `-RepairFolders` |
| `-SkipFolderInit` | 跳过目录初始化 | `-SkipFolderInit` |

### 使用示例

```powershell
# 创建单个用户（交互菜单选 1）
powershell.exe -ExecutionPolicy Bypass -File D:\Scripts\New-WSD509RDSUser.ps1

# 命令行创建单个用户
D:\Scripts\New-WSD509RDSUser.ps1 -NonInteractive -SamAccountName M25qisheng -DisplayName "M25qisheng"

# 批量创建
D:\Scripts\New-WSD509RDSUser.ps1 -CsvPath D:\Scripts\users.csv

# 修复已存在用户
D:\Scripts\New-WSD509RDSUser.ps1 -NonInteractive -SamAccountName T25ronglin -RepairFolders

# 预演
D:\Scripts\New-WSD509RDSUser.ps1 -NonInteractive -SamAccountName T25test -DryRun
```

### CSV 模板

```csv
SamAccountName,DisplayName,GivenName,Surname,InitialPassword
M25qisheng,M25qisheng,Qisheng,Meng,
S25zhining,S25zhining,Zhining,Song,
S26luyu,S26luyu,Yu,Lu,Init#2026!Strong
```

>`InitialPassword` 留空则自动生成密码。密码日志写入 `F:\Backup\NewUsers_*.csv`，自动锁 ACL。

### 创建用户自动完成

1. 创建 AD 账号到 `OU=RDS_Users,DC=wsad,DC=local`
2. 加入 `WSAD\RDS_Users`
3. 加入 `BUILTIN\Remote Desktop Users`
4. 创建 `D:\PerUser\<用户>\Apps`
5. 创建 `E:\Users\<用户>\Desktop/Documents/Downloads/Pictures/Music/Videos/.logs`
6. 设置私有 ACL（takeown + icacls）
7. 桌面快捷方式：`Personal Apps.lnk` → `D:\PerUser\<用户>\Apps`
8. 桌面快捷方式：`Personal Data.lnk` → `E:\Users\<用户>`
9. 导出初始密码到 `F:\Backup\NewUsers_*.csv`

---

## 3. 用户目录结构与 ACL

### 权限模型

每个用户有两个私有目录：

```
D:\PerUser\<用户>\Apps     个人软件目录
E:\Users\<用户>\           数据目录
```

ACL 标准配置：

```
WSAD\<用户>                 (OI)(CI) 完全控制
BUILTIN\Administrators       (OI)(CI) 完全控制
NT AUTHORITY\SYSTEM          (OI)(CI) 完全控制
```

没有 Everyone、没有 Users、没有继承。

### ACL 修复命令

```powershell
$u = "用户名"
$dom = "WSAD"
$nt = "$dom\$u"

takeown /F "D:\PerUser\$u" /R /A /D Y
icacls "D:\PerUser\$u" /reset /T /C
icacls "D:\PerUser\$u" /inheritance:r
icacls "D:\PerUser\$u" /grant:r "$($nt):(OI)(CI)F" "BUILTIN\Administrators:(OI)(CI)F" "NT AUTHORITY\SYSTEM:(OI)(CI)F" /T /C

takeown /F "E:\Users\$u" /R /A /D Y
icacls "E:\Users\$u" /reset /T /C
icacls "E:\Users\$u" /inheritance:r
icacls "E:\Users\$u" /grant:r "$($nt):(OI)(CI)F" "BUILTIN\Administrators:(OI)(CI)F" "NT AUTHORITY\SYSTEM:(OI)(CI)F" /T /C
```

---

## 4. 登录初始化脚本

### 脚本文件

- **路径**：`\\wsad.local\SYSVOL\wsad.local\scripts\WSD509\UserLoginInit.ps1`
- **GPO 链接**：`WSD509-RDS-UserInit` → `OU=RDS_Users,DC=wsad,DC=local`

### 脚本逻辑（每次用户登录时运行）

1. 白名单守卫：跳过内置管理员/SYSTEM 等账号
2. 创建目录：`D:\PerUser\<用户>\Apps` + `E:\Users\<用户>\Desktop/Documents/Downloads/Pictures/Music/Videos`
3. 设置私有 ACL（icacls）
4. 添加 `D:\PerUser\<用户>\Apps` 到用户 PATH
5. 重定向 Shell Folders（注册表 HKCU User Shell Folders）
6. 记录日志

### 日志权限修复

将 `$logDir = 'E:\Logs'` 改为 `$logDir = "E:\Users\$u\.logs"`

### 验证 Shell Folders

```powershell
$key = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders'
Get-ItemProperty $key | Select-Object Desktop, Personal, '{374DE290-123F-4565-9164-39C4925E467B}', 'My Pictures', 'My Music', 'My Video'
```

---

## 5. RDS GPU 策略 & 帧率优化

### GPO 信息

| 属性 | 值 |
|------|------|
| GPO 名称 | `WSD509-RDS-GPU` |
| GPO ID | `{4CAE18E4-637D-4083-B7B8-BFD0674C3C99}` |
| 链接 OU | `OU=RDS_Computers,DC=wsad,DC=local` |

### GPU 策略注册表

路径：`HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services`

| 值名称 | 值 | 说明 |
|--------|-----|------|
| `fEnableWddmDriver` | 1 | 启用 WDDM GPU 驱动 |
| `bEnumerateHWBeforeSW` | 1 | 硬件优先 |
| `AVCHardwareEncodePreferred` | 1 | 优先硬件 H.264 编码 |
| `AVC444ModePreferred` | 1 | 高色彩质量 |
| `DWMFRAMEINTERVAL` | 15 | 60 FPS 上限 |

### 设置命令

```powershell
Set-GPRegistryValue -Name 'WSD509-RDS-GPU' `
    -Key 'HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services' `
    -ValueName 'DWMFRAMEINTERVAL' `
    -Type DWord -Value 15
```

### NVENC 监控

```powershell
nvidia-smi --query-gpu=encoder.stats.sessionCount,encoder.stats.averageFps,utilization.gpu --format=csv -l 1
```

>RDP 协议上限约 60 FPS。`DWMFRAMEINTERVAL=15` 即上限 60 FPS。

---

## 6. 开发工具缓存迁移

### 缓存根目录

```
F:\code\cache\
```

### 环境变量映射

| 工具 | 环境变量 | 目标路径 |
|------|---------|----------|
| pip | `PIP_CACHE_DIR` | `F:\code\cache\pip` |
| uv | `UV_CACHE_DIR` | `F:\code\cache\uv` |
| npm/npx | `NPM_CONFIG_CACHE` | `F:\code\cache\npm` |
| pnpm/pnpx | `npm_config_store_dir` | `F:\code\cache\pnpm-store` |
| yarn | `YARN_CACHE_FOLDER` | `F:\code\cache\yarn` |
| node-gyp | `npm_config_devdir` | `F:\code\cache\node-gyp` |
| R 包库 | `R_LIBS_SITE` | `F:\code\cache\R\site-library` |
| R 缓存 | `R_USER_CACHE_DIR` | `F:\code\cache\R\user-cache` |
| renv | `RENV_PATHS_CACHE` | `F:\code\cache\R\renv-cache` |
| pak | `PAK_CACHE_DIR` | `F:\code\cache\R\pak-cache` |
| R 临时 | `TMPDIR` / `TEMP` / `TMP` | `F:\code\cache\R\temp` |

### 批量设置

```powershell
$cacheRoot = 'F:\code\cache'

$dirs = @(
    "$cacheRoot\pip", "$cacheRoot\uv", "$cacheRoot\npm",
    "$cacheRoot\pnpm-store", "$cacheRoot\yarn", "$cacheRoot\node-gyp",
    "$cacheRoot\R\site-library", "$cacheRoot\R\user-cache",
    "$cacheRoot\R\renv-cache", "$cacheRoot\R\pak-cache", "$cacheRoot\R\temp",
    "$cacheRoot\temp"
)
foreach ($dir in $dirs) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }

icacls $cacheRoot /inheritance:r
icacls $cacheRoot /grant:r `
    'BUILTIN\Administrators:(OI)(CI)F' `
    'NT AUTHORITY\SYSTEM:(OI)(CI)F' `
    'WSAD\RDS_Users:(OI)(CI)M' /T /C

# Python
[Environment]::SetEnvironmentVariable('PIP_CACHE_DIR',      "$cacheRoot\pip",         'Machine')
[Environment]::SetEnvironmentVariable('UV_CACHE_DIR',       "$cacheRoot\uv",          'Machine')
# Node
[Environment]::SetEnvironmentVariable('NPM_CONFIG_CACHE',   "$cacheRoot\npm",         'Machine')
[Environment]::SetEnvironmentVariable('npm_config_store_dir',"$cacheRoot\pnpm-store",  'Machine')
[Environment]::SetEnvironmentVariable('YARN_CACHE_FOLDER',  "$cacheRoot\yarn",        'Machine')
[Environment]::SetEnvironmentVariable('npm_config_devdir',  "$cacheRoot\node-gyp",    'Machine')
# R
[Environment]::SetEnvironmentVariable('R_LIBS_SITE',        "$cacheRoot\R\site-library", 'Machine')
[Environment]::SetEnvironmentVariable('R_USER_CACHE_DIR',   "$cacheRoot\R\user-cache",   'Machine')
[Environment]::SetEnvironmentVariable('RENV_PATHS_CACHE',   "$cacheRoot\R\renv-cache",   'Machine')
[Environment]::SetEnvironmentVariable('PAK_CACHE_DIR',      "$cacheRoot\R\pak-cache",    'Machine')
[Environment]::SetEnvironmentVariable('TMPDIR',             "$cacheRoot\R\temp",         'Machine')
[Environment]::SetEnvironmentVariable('TEMP',               "$cacheRoot\R\temp",         'Machine')
[Environment]::SetEnvironmentVariable('TMP',                "$cacheRoot\R\temp",         'Machine')
```

### R 环境变量备用（Renviron.site）

```powershell
$rHome = & R RHOME
$renvironSite = Join-Path $rHome 'etc\Renviron.site'

$lines = @(
    '',
    '# WSD509 R cache settings',
    'TMPDIR=F:/code/cache/R/temp',
    'TEMP=F:/code/cache/R/temp',
    'TMP=F:/code/cache/R/temp',
    'R_LIBS_SITE=F:/code/cache/R/site-library',
    'R_USER_CACHE_DIR=F:/code/cache/R/user-cache',
    'RENV_PATHS_CACHE=F:/code/cache/R/renv-cache',
    'PAK_CACHE_DIR=F:/code/cache/R/pak-cache'
)
Add-Content -Path $renvironSite -Value $lines -Encoding UTF8
```

---

## 7. 默认 UTF-8 编码

### 关键规则

- UTF-8 无 BOM 的 `.ps1` 在中文 Server 上被按 GBK 解码
- 乱码示例：`个人软件目录` → `涓汉杞欢鐩綍`
- 方案：保存脚本为 UTF-8 with BOM，注释/日志用英文

### 设置命令

```powershell
[Environment]::SetEnvironmentVariable('PYTHONUTF8', '1', 'Machine')
[Environment]::SetEnvironmentVariable('PYTHONIOENCODING', 'utf-8', 'Machine')
[Environment]::SetEnvironmentVariable('LANG', 'zh_CN.UTF-8', 'Machine')
[Environment]::SetEnvironmentVariable('LC_ALL', 'zh_CN.UTF-8', 'Machine')

# 写入所有用户 PowerShell Profile
$profileContent = @'
chcp 65001 | Out-Null
$OutputEncoding = [System.Text.UTF8Encoding]::new()
[Console]==InputEncoding  = [System.Text.UTF8Encoding]==new()
[Console]==OutputEncoding = [System.Text.UTF8Encoding]==new()
$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'
$PSDefaultParameterValues['Set-Content:Encoding'] = 'utf8'
$PSDefaultParameterValues['Add-Content:Encoding'] = 'utf8'
$PSDefaultParameterValues['Export-Csv:Encoding'] = 'utf8'
'@

$utf8Bom = New-Object System.Text.UTF8Encoding($true)
[System.IO.File]::WriteAllText($PROFILE.AllUsersAllHosts, $profileContent, $utf8Bom)
```

### 脚本转 UTF-8 with BOM

```powershell
$path = 'D:\Scripts\SomeScript.ps1'
$text = Get-Content $path -Raw
$utf8Bom = New-Object System.Text.UTF8Encoding($true)
[System.IO.File]::WriteAllText($path, $text, $utf8Bom)
```

>不建议开启 Windows 全局 UTF-8 Beta，有兼容风险。

---

## 8. DHCP 服务配置

```powershell
# 授权 DHCP
Add-DhcpServerInDC -DnsName 'WSD509.wsad.local' -IPAddress 192.168.1.10

# 重启
Restart-Service DHCPServer

# 查看租约
Get-DhcpServerv4Scope | Get-DhcpServerv4Lease |
    Format-Table IPAddress, ClientId, HostName, AddressState, LeaseExpiryTime -AutoSize

# 查看 Options
Get-DhcpServerv4OptionValue -ScopeId 192.168.1.0 |
    Format-Table OptionId, Name, Value -AutoSize
```

DNS Server option 设为 `192.168.1.10`，DNS Domain 设为 `wsad.local`。

---

## 9. 目录权限管理

### D:\Public 公共目录

```powershell
$path = 'D:\Public'
takeown /F $path /R /A /D Y
icacls $path /reset /T /C
icacls $path /inheritance:r
icacls $path /grant:r `
    'BUILTIN\Administrators:(OI)(CI)F' `
    'NT AUTHORITY\SYSTEM:(OI)(CI)F' `
    'WSAD\RDS_Users:(OI)(CI)M' /T /C
```

不建议给 Everyone:F。RDS_Users 拥有 Modify 权限即可。

### 常用审计命令

```powershell
icacls D:\PerUser\<用户>
icacls E:\Users\<用户>
icacls D:\Public
whoami
whoami /groups
net user <用户> /domain
net localgroup "Remote Desktop Users"
```

---

## 10. RDP/Remmina 帧率排查

### 服务器侧确认

```powershell
nvidia-smi --query-gpu=encoder.stats.sessionCount,encoder.stats.averageFps,utilization.gpu --format=csv -l 1

Get-ItemProperty 'HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services' |
    Select-Object fEnableWddmDriver, bEnumerateHWBeforeSW, AVCHardwareEncodePreferred, DWMFRAMEINTERVAL
```

### Linux 客户端侧排查

```bash
# 检查 FreeRDP 编译选项
xfreerdp /buildconfig 2>&1 | grep -iE 'h264|avc|ffmpeg|openh264|with_'

# 查看发行版
cat /etc/os-release

# 命令行强制 AVC444 测试
xfreerdp /v:wsd509.wsad.local /u:T25ronglin /d:WSAD \
    /size:1920x1080 \
    /gfx:AVC444 \
    /cert:ignore \
    /network:lan \
    +menu-anims +window-drag

# 测帧率
# https://www.testufo.com/framerates
```

Linux 上没有 mstsc.exe。Remmina 无 H.264 开关一般是 FreeRDP 版本旧或编译未启 FFmpeg/OpenH264。

---

## 11. FSLogix 架构参考

### 当前 Vs FSLogix

| 方面 | 当前方案 | FSLogix |
|------|---------|---------|
| 用户配置文件 | 散落 C:\Users | VHDX 容器 |
| AppData 管理 | 无 | 自动管理 |
| 多 RDSH 扩展 | 手动同步 | 共享存储即可 |
| C 盘压力 | 持续膨胀 | 容器在 E 盘 |
| 引入成本 | 0 | 需部署 FSLogix |

### 推荐迁移路径

1. 创建测试用户，加入 `FSLogix_Users` 安全组
2. 配置 FSLogix Profile Container → `E:\FSLogixProfiles\<用户>\`
3. 通过安全组灰度测试
4. 分步切换，不一次性全量

### 目标架构

```
C:\  系统
D:\  D:\PerUser\<用户>\Apps + D:\Public + D:\Scripts
E:\  E:\FSLogixProfiles + E:\Data\<用户>
F:\  F:\Backup + F:\code\cache
```

---

## 12. Chelsio T520 网卡诊断

```powershell
# 查看网卡
Get-PnpDevice | Where-Object { $_.FriendlyName -like '*Chelsio*' } | Format-List

# 查看驱动信息
Get-PnpDeviceProperty -InstanceId 'PCI\VEN_1425...' -KeyName '{a8b865dd-2e3d-4094-ad97-e593a70c75d6},6'

# 查看 HVCI 状态
Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\Microsoft\Windows\DeviceGuard |
    Select-Object VirtualizationBasedSecurityStatus
```

| 属性 | 值 |
|------|------|
| Vendor | Chelsio |
| 型号 | T520 / T5 |
| Vendor ID | `VEN_1425` |
| 驱动 | Chelsio Unified Wire |

---

## 13. 常见错误与修复

### 13.1 用户 ACL 锁定

**症状**：UnauthorizedAccessException

**修复**：takeown + icacls 重置，见第 3 节。

### 13.2 脚本未签名

**症状**：PSSecurityException

**修复**：`powershell.exe -ExecutionPolicy Bypass -NoProfile -File "脚本路径"`

### 13.3 中文乱码（涓汉…）

**症状**：快捷方式名称乱码

**根因**：UTF-8 无 BOM → GBK 解码

**修复**：保存脚本为 UTF-8 with BOM

```powershell
Get-ChildItem 'E:\Users\<用户>\Desktop' -Filter '*涓*' -Force | Remove-Item -Force
```

### 13.4 GPT.INI 损坏

**症状**：组策略失败

**根因**：`Version=` 前缀丢失

**修复**：

```powershell
$gpoName = 'WSD509-RDS-GPU'
$gptIni = "C:\Windows\SYSVOL\sysvol\wsad.local\Policies\$((Get-GPO -Name $gpoName).Id)\GPT.INI"
$adGpo = Get-ADObject -Identity (Get-GPO -Name $gpoName).Path -Properties versionNumber, displayName
$content = "[General]`r`nVersion=$($adGpo.versionNumber)`r`ndisplayName=$($adGpo.displayName)`r`n"
[System.IO.File]==WriteAllText($gptIni, $content, [System.Text.Encoding]==ASCII)
```

### 13.5 双屏（OrayIddDriver）

```powershell
Get-PnpDevice -FriendlyName "*OrayIddDriver*" | Disable-PnpDevice -Confirm:$false
```

### 13.6 GPP Registry 不生效

放弃 GPP，改用 `Set-GPRegistryValue`。

### 13.7 旧脚本清理

```powershell
Unregister-ScheduledTask -TaskName 'WSD509-UserLoginInit' -Confirm:$false
Move-Item 'D:\Scripts\UserLoginInit.ps1' 'F:\Backup\OldScripts\' -Force
Move-Item 'D:\Scripts\Register-UserLoginInitTask.ps1' 'F:\Backup\OldScripts\' -Force
```

---

## 14. 速查命令表

### AD 用户

```powershell
Get-ADUser -Filter * -SearchBase 'OU=RDS_Users,DC=wsad,DC=local' | Select SamAccountName, Enabled
Get-ADUser -Identity <用户> -Properties MemberOf
Get-ADGroupMember -Identity 'RDS_Users'
Add-ADGroupMember -Identity 'Remote Desktop Users' -Members <用户>
Add-ADGroupMember -Identity 'RDS_Users' -Members <用户>
```

### 磁盘与目录

```powershell
Get-PSDrive C, D, E, F | Select Name, Used, Free
Get-ChildItem 'C:\Users' -Directory -Force | ForEach-Object {
    $size = (Get-ChildItem $_.FullName -Recurse -Force -ea 0 | Measure Length -Sum).Sum
    [PSCustomObject]@{ User = $_.Name; SizeGB = [math]::Round($size / 1GB, 2) }
} | Sort SizeGB -Desc | Format-Table -Auto
```

### GPU & RDP

```powershell
nvidia-smi --query-gpu=encoder.stats.sessionCount,encoder.stats.averageFps,utilization.gpu --format=csv -l 1
Get-ItemProperty 'HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services' | Select fEnableWddmDriver, bEnumerateHWBeforeSW, AVCHardwareEncodePreferred, DWMFRAMEINTERVAL
Get-PnpDevice -Class Display | Select FriendlyName, Status
```

### GPO

```powershell
Get-GPO -Name 'WSD509-RDS-GPU'
Get-GPRegistryValue -Name 'WSD509-RDS-GPU' -Key 'HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services'
gpupdate /force /target:computer
gpresult /h F:\Backup\gpresult.html /f
```

---

## 附录：关键文件清单

| 文件 | 路径 |
|------|------|
| 创建用户脚本 | `D:\Scripts\New-WSD509RDSUser.ps1` |
| 登录初始化脚本 | `\\wsad.local\SYSVOL\wsad.local\scripts\WSD509\UserLoginInit.ps1` |
| GPU 策略 GPO | `WSD509-RDS-GPU` |
| 用户初始化 GPO | `WSD509-RDS-UserInit` |
| OpenAI API Key | `F:\code\openai-key` |

---

>**最后更新**：2026-06-14
>
>本手册对应 WSD509 服务器配置，请保持更新。

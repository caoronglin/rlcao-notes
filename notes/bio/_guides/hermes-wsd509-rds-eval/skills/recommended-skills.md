---
collection:
  profile: notebook
  id: bio
title: recommended-skills
date: 2026-10-06
---
# 推荐 Skills

>这些能力不是完成方案的最低要求，但会显著提高 Hermes 输出质量。

---

## 1. Windows 性能与磁盘容量治理

推荐能力：

- 分析 `C:\Users` 膨胀来源。
- 区分：
  - Shell Folder 重定向
  - AppData
  - Windows Profile
  - 用户级安装目录
  - Temp / cache
- 给出用户目录大小统计命令。
- 设计缓存目录迁移方案。
- 设计定期巡检策略。

关键判断：

- 只重定向 Desktop/Documents/Downloads 不能阻止 `C:\Users\<user>\AppData` 膨胀。
- 迁移 pip/npm/R 缓存可以减缓 C 盘增长，但不能替代 FSLogix。

---

## 2. Python / Node / R 开发环境运维

推荐能力：

- pip cache：`PIP_CACHE_DIR`
- uv cache：`UV_CACHE_DIR`
- npm/npx cache：`NPM_CONFIG_CACHE`
- pnpm/pnpx store：`npm_config_store_dir`
- yarn cache：`YARN_CACHE_FOLDER`
- node-gyp：`npm_config_devdir`
- R package library：`R_LIBS_SITE`
- R cache：`R_USER_CACHE_DIR`
- renv cache：`RENV_PATHS_CACHE`
- pak cache：`PAK_CACHE_DIR`
- R temp：`TMPDIR` / `TEMP` / `TMP`
- R 全局环境文件：`Renviron.site`

推荐能给出验证命令：

```powershell
pip cache dir
uv cache dir
npm config get cache
pnpm store path
```

```r
.libPaths()
Sys.getenv(c("R_LIBS_SITE", "R_USER_CACHE_DIR", "RENV_PATHS_CACHE", "PAK_CACHE_DIR"))
tempdir()
```

---

## 3. FSLogix Profile Container 架构设计

推荐能力：

- 理解 FSLogix Profile Container。
- 理解 VHD/VHDX 用户 Profile 容器机制。
- 能比较：
  - 当前 Shell Folder 重定向方案
  - Roaming Profile
  - FSLogix Profile Container
- 能设计灰度迁移：
  - 创建 `FSLogix_Users` 安全组
  - 先测试一个用户
  - 验证 VHDX 创建/挂载/卸载
  - 再逐步迁移正式用户
- 能说明风险：
  - VHDX 锁定
  - 容器膨胀
  - 异常断开后的清理
  - 不应把大数据放进 Profile

---

## 4. Linux RDP 客户端排查

推荐能力：

- Remmina 基础配置理解。
- FreeRDP 编译选项检查。
- H.264 / AVC444 支持排查。
- 能解释 Linux 上没有 Windows `mstsc.exe`。
- 能给出命令：

```bash
xfreerdp /buildconfig 2>&1 | grep -iE 'h264|avc|ffmpeg|openh264|with_'
cat /etc/os-release
xfreerdp /v:srv-rds01.example.local /u:U25test /d:EXAMPLE \
    /size:1920x1080 \
    /gfx:AVC444 \
    /cert:ignore \
    /network:lan \
    +menu-anims +window-drag
```

---

## 5. Windows 驱动排查

推荐能力：

- 使用 `Get-PnpDevice` 查询设备状态。
- 使用 `Get-PnpDeviceProperty` 查询硬件 ID/驱动属性。
- 理解 HVCI / Memory Integrity / DeviceGuard 对老驱动的影响。
- 能排查 Chelsio T520 / T5 驱动。
- 能提示使用官方 Chelsio Unified Wire 驱动。

示例命令：

```powershell
Get-PnpDevice | Where-Object { $_.FriendlyName -like '*Chelsio*' } | Format-List
Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\Microsoft\Windows\DeviceGuard |
    Select-Object VirtualizationBasedSecurityStatus
```

---

## 6. 安全文档化与变更管理

推荐能力：

- 在执行前标注风险。
- 对 ACL/GPO 修改提供备份方案。
- 输出回滚命令或恢复思路。
- 将运维流程写成可复用 Markdown Runbook。
- 将"需要现场验证"的项明确列出。

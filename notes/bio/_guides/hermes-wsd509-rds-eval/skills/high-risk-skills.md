---
collection:
  profile: notebook
  id: bio
title: high-risk-skills
date: 2026-10-06
---
# 高风险 Skills / 禁止自动执行项

>这些能力或操作不应让模型自动执行。模型可以解释、设计、提示风险，但不能在没有明确人工确认和备份的情况下直接执行。

---

## 1. 禁止直接批量删除用户目录

高风险路径示例：

```text
C:\Users
D:\PerUser
E:\Users
E:\FSLogixProfiles
F:\Backup
```

模型不能直接建议：

```powershell
Remove-Item C:\Users\* -Recurse -Force
Remove-Item E:\Users\* -Recurse -Force
```

除非：

1. 用户明确指定具体目录；
2. 已确认不是原始数据/用户 Profile；
3. 已备份；
4. 已给出 dry-run 或清单；
5. 用户二次确认。

---

## 2. 禁止清空 C:\Users

`C:\Users` 包含：

- 用户 Profile
- `NTUSER.DAT`
- AppData
- 用户注册表配置
- 软件配置

不能为了释放空间直接清空。

正确做法：

- 先统计大小。
- 识别 AppData/Temp/Cache。
- 清理临时目录前确认用户已注销。
- 长期方案考虑 FSLogix。

---

## 3. 禁止直接给 Everyone:F

不要建议：

```powershell
icacls D:\Public /grant Everyone:F /T /C
```

正确公共目录模型：

```powershell
BUILTIN\Administrators:(OI)(CI)F
NT AUTHORITY\SYSTEM:(OI)(CI)F
EXAMPLE\RDS_Users:(OI)(CI)M
```

---

## 4. 禁止随意直接修改核心注册表替代 GPO

Windows Server/RDS 策略应优先：

- GPMC
- gpedit
- GPO
- `Set-GPRegistryValue`

不要把核心配置全部改成：

```powershell
Set-ItemProperty HKLM:\... 
```

例外：

- 仅用于读取验证；
- 临时急救且用户明确知道风险；
- 恢复后仍应同步到 GPO。

---

## 5. 禁止未备份时手写 SYSVOL GPO 文件

高风险文件：

```text
GPT.INI
Registry.pol
Machine\Preferences\Registry\Registry.xml
```

已知事故：GPT.INI 被错误脚本写成：

```ini
[General]
26
displayName=???????
```

导致 GPO 应用失败。

正确格式必须是：

```ini
[General]
Version=26
displayName=RDS-GPU
```

如果必须修复：

1. 先备份原文件；
2. 从 AD 读取 `versionNumber` 和 `displayName`；
3. 用 ASCII/正确编码写回；
4. `gpupdate` 验证。

---

## 6. 禁止跳过驱动签名/关闭安全策略作为首选方案

Chelsio T520 或其他驱动安装失败时，不应直接建议：

- 关闭驱动签名强制
- 禁用所有安全策略
- 关闭 HVCI/Memory Integrity 后不恢复

正确路线：

1. 查设备 ID；
2. 查设备管理器错误码；
3. 使用官方签名驱动；
4. 检查 HVCI/DeviceGuard 是否阻止；
5. 如需关闭安全功能，必须说明风险并由用户确认。

---

## 7. 禁止未确认用户会话状态时删除 Temp / Cache

以下目录可能有正在运行的程序使用：

```text
C:\Users\<user>\AppData\Local\Temp
F:\code\cache\R\temp
F:\code\cache\npm
F:\code\cache\pnpm-store
```

清理前应：

1. 查看当前登录用户；
2. 避免清理活跃用户目录；
3. 优先清理过期文件；
4. 提供 dry-run 清单。

---

## 8. 禁止伪造官方来源或不存在的功能

模型不能：

- 编造 Microsoft 官方参数；
- 编造不存在的 GPO 名称；
- 编造不存在的 FreeRDP 参数；
- 编造不存在的 NVIDIA 指标；
- 伪造文档链接或 DOI。

不确定时应写：

```text
该项需要现场验证。
```

---

## 9. 禁止承诺 RDP 120 FPS

应明确：

- RDP/Windows 实现通常上限约 60 FPS；
- `DWMFRAMEINTERVAL=15` 用于 60 FPS；
- 120 FPS 不能作为可靠目标；
- 客户端 Remmina/FreeRDP 还可能进一步限制帧率。

---

## 10. 禁止把 FSLogix 一次性全员启用

FSLogix 迁移应灰度：

1. 新建 `FSLogix_Users` 安全组；
2. 加入测试用户；
3. 验证 VHDX 创建、挂载、卸载；
4. 观察 Profile 容器增长；
5. 再逐步迁移正式用户。

不能直接建议全员切换，尤其不能在未备份现有 Profile 的情况下迁移。

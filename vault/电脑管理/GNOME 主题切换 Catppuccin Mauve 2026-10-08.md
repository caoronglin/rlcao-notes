---
tags: [gnome, 主题, 配色, ubuntu]
---

# GNOME 主题切换到 Catppuccin Mauve 玫紫 2026-10-08

## Goal

把桌面从红色系统一换成玫紫色系（用户不喜欢蓝色），并更换应用程序（GTK）配色。

## Findings

### 色相匹配实测（关键）

对 Catppuccin Mauve 主色 `#c6a0f6` 做 HSL 换算得 **H = 266.5°**，
与 Marble 已有的 `purple` 变体（H = 275°）**仅差 8.5°**，人眼几乎不可辨。

因此**不需要用 `install.py --hue` 生成新 Marble 主题**，直接用现成的
`Marble-purple-dark` 即可，省去生成步骤并避免引入未知问题。

### Marble shell 主题的色系是 hue 参数化的

官方仓库 `imarkoff/Marble-shell-theme`（GPL-3，支持 GNOME 49/50）的
`colors.json` 中，每个色系只用 `h`（色相）定义：

```
red h=0   yellow h=40   green h=135
blue h=210   purple h=275   gray h=0,s=0
```

ACCENT 色值用 HSL 的 s=42 l=26（dark 模式）套在色相上生成。
`install.py` 支持 `--hue 0-360 --name <名字>` 生成任意色相 [cite:9a9a8eb6-1]。

### Catppuccin 官方 accent 列表里没有 magenta

可用 accent：`blue flamingo green lavender maroon mauve peach pink red
rosewater sapphire sky teal yellow`（**无 magenta**）。
发布资产命名规范：`catppuccin-<flavour>-<accent>-<size>+<variant>`，
预发布只提供 `standard` size + `default` variant。

故玫紫方案选用 **`mauve`**（Catppuccin Mauve 本身即紫粉调，且与现有
macchiato-red 同 flavour，基底一致）。

### 用户已装的 mauve 主题来源

原 `Fausto-Korpsvart/Catppuccin-GTK-Theme` 仓库已于 2026-10-03 归档只读，
改用官方 `catppuccin/gtk`。该仓库是**源码工程**（需 Python + catppuccin 库构建），
release 资产才是预编译包。

## Changes

下载并安装 Catppuccin macchiato mauve（274KB，3 个 dpi 变体）到
`~/.local/share/themes/`。

主题栈逐项切换（每步 sleep 2 验证）：

| 项 | 变更前 | 变更后 |
|---|---|---|
| Shell | Marble-red-dark | **Marble-purple-dark** |
| GTK | catppuccin-macchiato-red-standard+default | **catppuccin-macchiato-mauve-standard+default** |
| 窗口 | 同 GTK（red） | **同 GTK（mauve）** |
| 图标 | Yaru-red-dark | **Yaru-magenta-dark** |
| 游标 | Yaru | Yaru（不变） |
| 强调色 | red | **purple** |
| 配色 | prefer-dark | prefer-dark（不变） |

## Reproduction

```bash
# 下载 Catppuccin mauve（官方 release 预编译包）
curl -sL -o cp.zip \
  "https://github.com/catppuccin/gtk/releases/latest/download/catppuccin-macchiato-mauve-standard+default.zip"
unzip -q cp.zip -d ~/.local/share/themes/

# 逐项切换（每步 sleep 2，禁止批量写 —— 见 [[GNOME 桌面主题与扩展整理 2026-10-06]]）
gsettings set org.gnome.desktop.interface gtk-theme     'catppuccin-macchiato-mauve-standard+default'
sleep 2
gsettings set org.gnome.desktop.wm.preferences theme    'catppuccin-macchiato-mauve-standard+default'
sleep 2
gsettings set org.gnome.desktop.interface icon-theme    'Yaru-magenta-dark'
sleep 2
gsettings set org.gnome.desktop.interface accent-color  'purple'
sleep 2
gsettings set org.gnome.shell.extensions.user-theme name 'Marble-purple-dark'
```

若要生成 Marble 全新色相（官方 hue 参数）：

```bash
git clone --depth 1 https://github.com/imarkoff/Marble-shell-theme.git
cd Marble-shell-theme
python install.py --hue 300 --name rose --mode dark
```

## Problems

无。本次切换未触发任何错误，无需注销重登。

**上次事故的规避**：逐项 gsettings 写入，每步 sleep 2 并验证，未重蹈
「两次批量写 enabled-extensions/disabled-extensions 导致 9 个扩展卡死」的覆辙。

## Verification

- Shell 主题**实际加载**（非仅 gsettings 值）：日志确认
  `loading user theme: ~/.themes/Marble-purple-dark/gnome-shell/gnome-shell.css`
- 切换期间新增错误数：**0**
- gnome-shell 存活，PID 未变（无需重启会话）
- 扩展健康：16 个 ACTIVE，**ERROR 总数 0**
  （`lockscreen-extension` 为 INITIALIZED 属预期 —— 它声明
  `session-modes: ['unlock-dialog']`，仅锁屏时激活）

## Result

桌面已统一为 Catppuccin Mauve 玫紫体系，Shell / GTK / 窗口 / 图标 / 强调色
五层全部对齐，无错误，无需重启会话。

## Files

- 变更前快照：`/media/rlcao/Data/data/agent/projects/20261008_theme_magenta/work/before.txt`
- 新增主题：`~/.local/share/themes/catppuccin-macchiato-mauve-standard+default{,-hdpi,-xhdpi}`
- 红色主题**保留未删**，可随时回滚（见下）

## Follow-up

- 回滚到红色系：读取 `work/before.txt` 中 7 项值逐条 `gsettings set` 即可
  （gtk-theme / icon-theme / accent-color / shell-theme / wm-theme）
- 若觉得 `Yaru-magenta-dark` 的粉调过艳，可换 `Yaru-purple-dark`（更收敛）
- 若想微调 Shell 色相而不动 GTK，可单独用 Marble `--hue` 生成一版再比对

## 参考

- [Catppuccin GTK accent 列表与变体说明](https://github.com/Fausto-Korpsvart/Catppuccin-GTK-Theme)
- [catppuccin/gtk release 命名规范](https://github.com/catppuccin/gtk/releases)
- [imarkoff/Marble-shell-theme](https://github.com/imarkoff/Marble-shell-theme)
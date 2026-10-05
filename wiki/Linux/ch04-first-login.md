---
collection:
  profile: wiki
  id: Linux
title: 第四章、首次登陆与线上求助
date: 2024-01-01
updated: 2024-01-01
tags:
  - Linux
  - 基础命令
  - 帮助系统
---

# 第四章、首次登陆与线上求助

## 4.1 首次登陆系统

### 开机与登陆

1. **开机**：按下电源键，系统开始引导
2. **登陆界面**：图形界面或命令行界面
3. **输入账号密码**：
   - 账号：安装时创建的用户名
   - 密码：输入时不会显示任何字符（安全机制）

### 命令行界面 (CLI)

如果进入的是图形界面，可以打开**终端 (Terminal)** 来使用命令行。

**打开终端的方法：**
- 桌面右键 → 打开终端
- 应用程序菜单 → 系统工具 → 终端
- 快捷键：`Ctrl + Alt + T`（Ubuntu）

### 基础操作指令

#### 1. 显示日期：`date`

```bash
date                          # 显示当前日期时间
date +%Y/%m/%d               # 格式化输出：2024/01/01
date +%H:%M:%S               # 格式化输出：14:30:00
```

#### 2. 显示日历：`cal`

```bash
cal                          # 显示当月日历
cal 2024                     # 显示整年日历
cal 1 2024                   # 显示指定月份（2024年1月）
cal -3                       # 显示前中后三个月
```

#### 3. 简单计算器：`bc`

```bash
bc                           # 进入交互式计算器
scale=3                      # 设置小数位数为3
1/3                          # 输出：0.333
10+20*2                      # 输出：50
quit                         # 退出bc
```

**使用管道直接计算：**
```bash
echo "1+2+3" | bc              # 输出：6
echo "scale=2; 10/3" | bc      # 输出：3.33
```

#### 4. 重要的热键

| 热键 | 功能 |
|------|------|
| `Tab` | 命令/文件名自动补全（按两下显示所有选项） |
| `Ctrl + C` | 终止当前运行的程序 |
| `Ctrl + D` | 退出当前终端（输入EOF） |
| `Ctrl + L` | 清屏（等同于 `clear` 命令） |
| `Ctrl + A` | 光标移动到行首 |
| `Ctrl + E` | 光标移动到行尾 |
| `Ctrl + U` | 删除光标前所有内容 |
| `Ctrl + K` | 删除光标后所有内容 |
| `Ctrl + R` | 搜索历史命令 |
| `↑` / `↓` | 浏览历史命令 |

#### 5. 错误查看

当命令输入错误时，系统会显示错误信息：

```bash
# 命令不存在
$ cmdnotfound
bash: cmdnotfound: command not found

# 权限不足
$ /etc/shadow
bash: /etc/shadow: Permission denied

# 文件不存在
$ cat /notexist
cat: /notexist: No such file or directory
```

## 4.2 文字模式下指令的下达

### 指令的基本格式

```bash
command [-options] [arguments]
```

- **command**：指令名称（如 `ls`, `cp`, `mv`）
- **-options**：选项，通常以 `-` 或 `--` 开头
- **arguments**：参数，指令操作的对象

### 基础指令详解

#### 1. 列出文件和目录：`ls`

```bash
ls                           # 列出当前目录内容
ls -l                        # 详细列表格式
ls -a                        # 显示所有文件（包括隐藏文件）
ls -la                       # 组合选项：详细+所有文件
ls -lh                       # 人类可读的文件大小（K, M, G）
ls -ltr                      # 按时间倒序排列
ls /etc                      # 列出指定目录内容
ls *.txt                     # 列出所有txt文件（通配符）
```

**输出示例：**
```
-rw-r--r-- 1 user group 1234 Jan  1 10:00 file.txt
drwxr-xr-x 2 user group 4096 Jan  1 09:00 directory/
```

#### 2. 切换目录：`cd`

```bash
cd /home/user                # 切换到指定目录
cd ~                         # 切换到用户主目录
cd                           # 同上（默认回到主目录）
cd ..                        # 切换到上级目录
cd ../..                     # 切换到上上级目录
cd -                         # 切换到上一次所在的目录
cd /                         # 切换到根目录
cd ~/Documents               # 切换到主目录下的Documents
```

#### 3. 显示当前目录：`pwd`

```bash
pwd                          # 显示当前完整路径
pwd -P                       # 显示物理路径（解析所有符号链接）
```

#### 4. 创建目录：`mkdir`

```bash
mkdir dirname                # 创建一个目录
mkdir dir1 dir2 dir3         # 同时创建多个目录
mkdir -p parent/child        # 递归创建多级目录
mkdir -m 755 mydir           # 创建时指定权限
```

#### 5. 删除文件或目录：`rm`

```bash
rm file.txt                  # 删除文件
rm file1 file2               # 删除多个文件
rm -i file.txt               # 交互模式（删除前询问）
rm -f file.txt               # 强制删除（不提示，忽略不存在文件）
rm -r directory              # 递归删除目录及其内容
rm -rf directory             # 强制递归删除（危险命令！）
rm *.log                     # 删除所有log文件
```

⚠️ **警告：** `rm -rf /` 会删除整个系统！使用时要特别小心。

#### 6. 复制文件或目录：`cp`

```bash
cp source.txt dest.txt       # 复制文件
cp file.txt /path/to/        # 复制到目录
cp file1 file2 /dest/        # 复制多个文件到目录
cp -i file.txt dest.txt      # 覆盖前询问
cp -f file.txt dest.txt      # 强制覆盖
cp -r dir1 dir2              # 递归复制目录
cp -a dir1 dir2              # 归档模式（保留权限、时间戳等）
cp -v source dest            # 显示详细信息
```

#### 7. 移动或重命名文件：`mv`

```bash
mv oldname newname           # 重命名文件
mv file.txt /path/to/        # 移动文件
mv file1 file2 /dest/        # 移动多个文件
mv dir1 /path/to/            # 移动目录
mv -i source dest            # 覆盖前询问
mv -f source dest            # 强制覆盖
mv -v source dest            # 显示详细信息
```

#### 8. 查看文件内容

**`cat` - 显示整个文件内容**
```bash
cat file.txt                 # 显示文件内容
cat -n file.txt              # 显示行号
cat -A file.txt              # 显示特殊字符
cat file1 file2 > file3      # 合并文件
cat > file.txt               # 创建文件并输入内容
```

**`less` - 分页浏览（推荐）**
```bash
less file.txt                # 分页查看
# 在 less 中的操作：
# 空格 / PageDown - 下一页
# b / PageUp - 上一页
# /pattern - 搜索
# n - 下一个匹配
# q - 退出
```

**`head` - 显示文件开头**
```bash
head file.txt                # 显示前10行
head -n 20 file.txt          # 显示前20行
head -20 file.txt            # 同上
head -c 100 file.txt         # 显示前100字节
```

**`tail` - 显示文件结尾**
```bash
tail file.txt                # 显示后10行
tail -n 20 file.txt          # 显示后20行
tail -f file.txt             # 实时跟踪文件更新（常用）
tail -f /var/log/syslog      # 实时查看系统日志
```

**`wc` - 统计文件**
```bash
wc file.txt                  # 输出行数、词数、字节数
wc -l file.txt               # 只显示行数
wc -w file.txt               # 只显示词数
wc -c file.txt               # 只显示字节数
```

**`sort` - 排序**
```bash
sort file.txt                # 按字母顺序排序
sort -r file.txt             # 逆序排序
sort -n file.txt             # 按数字排序
sort -u file.txt             # 去重并排序
sort -t: -k3 -n /etc/passwd  # 按第3字段（UID）数字排序
```

**`uniq` - 去重**
```bash
uniq file.txt                # 删除相邻的重复行
uniq -c file.txt             # 统计每行出现的次数
uniq -d file.txt             # 只显示重复的行
uniq -u file.txt             # 只显示不重复的行
```

### 搜索与查找

**`find` - 查找文件（强大但较慢）**
```bash
find /path -name "file.txt"          # 按名称查找
find /path -name "*.txt"             # 查找所有txt文件
find /path -type d -name "dir"       # 查找目录
find /path -type f -size +100M       # 查找大于100M的文件
find /path -mtime -7                 # 查找7天内修改过的文件
find /path -user username            # 查找属于某用户的文件
find /path -perm 644                 # 查找特定权限的文件
find /path -name "*.log" -delete     # 查找并删除
find /path -type f -exec ls -l {} \; # 对找到的文件执行命令
```

**`locate` - 快速查找（基于数据库）**
```bash
locate filename              # 快速查找文件
locate -i filename           # 忽略大小写
locate '*.txt'               # 支持通配符
sudo updatedb                # 更新locate数据库
```

**`grep` - 文本搜索（常用）**
```bash
grep "pattern" file.txt              # 在文件中搜索
grep -i "pattern" file.txt           # 忽略大小写
grep -v "pattern" file.txt           # 显示不匹配的行
grep -n "pattern" file.txt           # 显示行号
grep -r "pattern" /path/             # 递归搜索目录
grep -l "pattern" *.txt              # 只显示包含匹配的文件名
grep -E "pattern1|pattern2" file.txt # 扩展正则表达式（或）
grep -c "pattern" file.txt           # 统计匹配行数
grep "^start" file.txt               # 以start开头
grep "end$" file.txt                 # 以end结尾
ps aux | grep "nginx"                # 管道结合使用
```

**`which` / `whereis` - 查找命令位置**
```bash
which ls                     # 查找命令的可执行文件位置
which -a python              # 查找所有匹配的路径
whereis ls                   # 查找命令的二进制、源码和man手册位置
whereis -b ls                # 只找二进制文件
```

### 系统信息

**`uname` - 系统信息**
```bash
uname -a                     # 显示所有系统信息
uname -r                     # 显示内核版本
uname -m                     # 显示机器硬件名称
uname -n                     # 显示主机名
```

**`hostname` - 主机名**
```bash
hostname                     # 显示主机名
hostname -i                  # 显示IP地址
hostnamectl                  # 显示和修改主机名信息
```

**`whoami` / `who` / `w` - 用户信息**
```bash
whoami                       # 显示当前用户名
who                          # 显示已登录用户
who am i                     # 显示当前终端信息
w                            # 显示登录用户及其正在执行的操作
users                        # 显示用户名列表
last                         # 显示最近登录记录
lastlog                      # 显示所有用户的最后登录时间
```

**`df` - 磁盘空间**
```bash
df                           # 显示文件系统磁盘使用情况
df -h                        # 人类可读格式（推荐）
df -T                        # 显示文件系统类型
df -i                        # 显示inode使用情况
df -h /home                  # 查看特定目录所在分区的空间
```

**`du` - 目录大小**
```bash
du                           # 显示目录大小
du -h                        # 人类可读格式
du -sh /path                 # 查看目录总大小（推荐）
du -h --max-depth=1 /path    # 只显示一层子目录大小
du -ah /path | sort -rh | head -20  # 找出最大的20个文件/目录
```

**`free` - 内存使用**
```bash
free                         # 显示内存使用情况
free -h                      # 人类可读格式（推荐）
free -m                      # 以MB为单位显示
free -g                      # 以GB为单位显示
free -s 5                    # 每5秒刷新一次
```

**`top` / `htop` - 系统进程**
```bash
top                          # 实时显示系统进程（按q退出）
top -u username              # 只显示某用户的进程
top -p PID                   # 只显示指定PID的进程
top -d 5                     # 每5秒刷新
```

在 top 中可用的操作：
- `P` - 按CPU使用率排序
- `M` - 按内存使用率排序
- `T` - 按运行时间排序
- `k` - 杀死进程
- `q` - 退出

**`ps` - 进程状态**
```bash
ps                           # 显示当前终端的进程
ps aux                       # 显示所有进程的详细信息（推荐）
ps -ef                       # 全格式显示所有进程
ps aux | grep nginx          # 查找特定进程
ps aux --sort=-%cpu          # 按CPU使用率排序
ps aux --sort=-%mem          # 按内存使用率排序
ps -u username               # 查看某用户的进程
ps -p PID -o pid,ppid,cmd,%cpu,%mem  # 显示指定PID的特定信息
```

**`lscpu` / `cat /proc/cpuinfo` - CPU信息**
```bash
lscpu                        # 显示CPU架构信息
cat /proc/cpuinfo            # 详细的CPU信息
cat /proc/cpuinfo | grep "model name"  # 查看CPU型号
cat /proc/cpuinfo | grep -c "processor"  # 查看CPU核心数
nproc                        # 显示可用CPU核心数
```

**`lsblk` / `fdisk` - 磁盘信息**
```bash
lsblk                        # 列出所有块设备
df -h                        # 查看磁盘使用情况
lsblk -f                     # 显示文件系统类型
fdisk -l                     # 查看磁盘分区表（需要root权限）
cat /proc/partitions         # 查看分区信息
blkid                        # 查看块设备的UUID
```

**`ifconfig` / `ip` / `ss` - 网络信息**
```bash
ifconfig                     # 显示网络接口信息
ip addr                      # 显示IP地址（现代命令）
ip link                      # 显示网络接口状态
ip route                     # 显示路由表
ss -tuln                     # 显示监听端口
netstat -tuln                # 显示网络连接
ping google.com              # 测试网络连通性
curl ifconfig.me             # 查看公网IP
hostname -I                  # 查看本机IP地址
```

**`env` / `printenv` - 环境变量**
```bash
env                          # 显示所有环境变量
printenv                     # 显示所有环境变量
printenv PATH                # 显示特定环境变量
echo $PATH                   # 显示PATH变量
echo $HOME                   # 显示家目录
echo $USER                   # 显示当前用户
export VAR=value             # 设置环境变量
```

**`history` - 命令历史**
```bash
history                      # 显示命令历史
history | less               # 分页显示
history | grep "apt"         # 搜索历史命令
!100                         # 执行历史第100条命令
!!                           # 执行上一条命令
!apt                         # 执行最近以apt开头的命令
history -c                   # 清除历史记录
history -w                   # 将历史写入文件
```

### 关机与重启

**`shutdown` - 安全关机**
```bash
shutdown now                 # 立即关机
shutdown +5                  # 5分钟后关机
shutdown 14:00               # 指定时间关机
shutdown -r now              # 立即重启
shutdown -r +5               # 5分钟后重启
shutdown -c                  # 取消关机计划
shutdown -h now              # 立即关机并停止电源
```

**`reboot` / `poweroff` / `halt`**
```bash
reboot                       # 重启
poweroff                     # 关机并断电
halt                         # 停止系统（不断电）
init 0                       # 关机
init 6                       # 重启
systemctl reboot             # 使用systemctl重启
systemctl poweroff           # 使用systemctl关机
```

**`sync` - 同步数据到磁盘**
```bash
sync                         # 将内存中的数据写入磁盘
```

⚠️ **重要提示**：关机或重启前，建议先执行 `sync` 命令，确保数据已写入磁盘。

## 4.3 Linux系统的线上求助man page与info page

### man page 手册页

Linux 系统内置了详细的帮助文档，称为 **manual pages（手册页）**，简称 man page。

#### 基本用法

```bash
man command                  # 查看命令的手册页
man ls                       # 查看ls命令的帮助
man -f command               # 查看命令的简短描述（等同于 whatis）
man -k keyword               # 搜索包含关键词的手册页（等同于 apropos）
```

#### 手册页的分类（Sections）

手册页分为不同的章节：

| 章节 | 内容 |
|------|------|
| 1 | 用户命令（普通用户可执行的命令） |
| 2 | 系统调用（内核提供的函数） |
| 3 | 库函数（程序库中的函数） |
| 4 | 特殊文件（通常在 /dev 中的设备） |
| 5 | 文件格式和规范（如 /etc/passwd） |
| 6 | 游戏和屏保 |
| 7 | 杂项（包括宏包和约定） |
| 8 | 系统管理命令（通常需要 root 权限） |
| 9 | 内核例程 |

**指定章节查看：**
```bash
man 1 ls                     # 查看第1章节的ls命令
man 5 passwd                 # 查看第5章节的passwd文件格式
```

#### 手册页中的导航

进入 man page 后，可以使用以下按键导航：

| 按键 | 功能 |
|------|------|
| `空格` / `Page Down` | 向下翻页 |
| `Page Up` / `b` | 向上翻页 |
| `↓` / `Enter` | 向下滚动一行 |
| `↑` | 向上滚动一行 |
| `g` | 跳转到开头 |
| `G` | 跳转到结尾 |
| `/keyword` | 向下搜索关键词 |
| `?keyword` | 向上搜索关键词 |
| `n` | 跳转到下一个匹配 |
| `N` | 跳转到上一个匹配 |
| `h` | 显示帮助 |
| `q` | 退出 man page |

#### 手册页的结构

一个典型的 man page 包含以下部分：

```
NAME                        # 命令名称和简要描述
SYNOPSIS                    # 语法格式
DESCRIPTION                 # 详细描述
OPTIONS                     # 选项说明
EXAMPLES                    # 示例
EXIT STATUS                 # 退出状态码
SEE ALSO                    # 相关参考
BUGS                        # 已知问题
AUTHOR                      # 作者信息
```

### info page 信息页

GNU 项目开发的另一种帮助系统，比 man page 更详细，支持超链接导航。

#### 基本用法

```bash
info command                 # 查看命令的info文档
info ls                      # 查看ls的info文档
info                         # 进入info主菜单
info coreutils               # 查看核心工具集的info文档
```

#### 导航按键

| 按键 | 功能 |
|------|------|
| `Enter` | 跟随光标下的超链接 |
| `Tab` | 跳转到下一个链接 |
| `n` | 下一节 |
| `p` | 上一节 |
| `u` | 上一级 |
| `l` | 返回上一页 |
| `空格` | 向下翻页 |
| `Del` / `Page Up` | 向上翻页 |
| `s` | 搜索 |
| `q` | 退出 |
| `?` / `h` | 显示帮助 |

#### info page 的优点

1. **超链接导航**：可以像浏览网页一样跳转
2. **层级结构**：清晰的章节组织
3. **更详细的说明**：通常比 man page 更详尽
4. **示例丰富**：提供更多使用示例

### 其他求助方式

#### 1. --help 选项

大多数命令都支持 `--help` 选项，显示简要帮助：

```bash
ls --help
cp --help
systemctl --help
```

优点：
- 快速查看，无需进入 man page
- 显示常用选项
- 适合快速参考

#### 2. whatis 命令

显示命令的简要描述：

```bash
whatis ls                    # ls (1)              - list directory contents
whatis cp                    # cp (1)              - copy files and directories
whatis man                   # man (1)             - an interface to the on-line reference manuals
```

#### 3. apropos 命令

通过关键词搜索相关的命令：

```bash
apropos editor               # 搜索与编辑器相关的命令
apropos copy                 # 搜索与复制相关的命令
apropos "list directory"     # 支持多词搜索
```

#### 4. 在线资源

- **官方文档**：各发行版的官方 Wiki 和文档
- **Stack Overflow**：技术问答社区
- **GitHub**：开源项目托管平台
- **Linux 中国**：中文 Linux 社区
- **鸟哥的 Linux 私房菜**：经典教程网站

#### 5. /usr/share/doc 目录

许多软件包会在此目录下安装额外的文档：

```bash
ls /usr/share/doc/           # 查看已安装的文档
ls /usr/share/doc/bash/      # 查看 bash 的额外文档
```

### 帮助系统的选择建议

| 场景 | 推荐方式 |
|------|----------|
| 快速查看命令用法 | `command --help` |
| 查看详细文档 | `man command` |
| 查看GNU工具的详细说明 | `info command` |
| 不知道命令名字 | `apropos keyword` |
| 快速了解命令功能 | `whatis command` |
| 搜索具体问题的解决方案 | 在线搜索 |

### 实践练习

1. 使用 `man` 查看 `ls` 命令的手册页，找出如何按时间排序的选项
2. 使用 `info` 查看 `coreutils` 的文档
3. 使用 `apropos` 搜索与 "delete" 相关的命令
4. 使用 `whatis` 查看常用命令（cat, grep, find, chmod）的功能描述
5. 比较 `man ls` 和 `ls --help` 的输出差异

## 4.4 超简单文书编辑器：nano

### nano 简介

**nano** 是一个简单易用的文本编辑器，适合初学者。它比 vi/vim 更容易上手。

### 启动 nano

```bash
nano                         # 打开新文件
nano filename.txt            # 打开或创建文件
nano +10 filename.txt        # 打开文件并跳到第10行
```

### 基本操作

#### 界面说明

```
GNU nano 2.9.3               filename.txt

[文件内容显示区域]

^G 帮助    ^O 保存    ^W 搜索    ^K 剪切    ^J 对齐
^X 退出    ^R 读取    ^Y 上一页   ^C 位置    ^T 拼写
```

- `^` 表示 `Ctrl` 键
- `^G` = `Ctrl + G`

#### 常用快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + G` | 显示帮助 |
| `Ctrl + O` | 保存文件 |
| `Ctrl + X` | 退出 nano |
| `Ctrl + R` | 插入其他文件 |
| `Ctrl + W` | 搜索 |
| `Ctrl + V` / `Page Down` | 下一页 |
| `Ctrl + Y` / `Page Up` | 上一页 |
| `Ctrl + K` | 剪切当前行 |
| `Ctrl + U` | 粘贴 |
| `Ctrl + J` | 对齐当前段落 |
| `Ctrl + C` | 显示光标位置 |
| `Ctrl + T` | 拼写检查 |
| `Ctrl + _` / `Ctrl + /` | 跳到指定行 |
| `Alt + U` | 撤销 |
| `Alt + E` | 重做 |

#### 编辑操作

1. **移动光标**：使用方向键
2. **输入文本**：直接打字
3. **删除**：使用 `Backspace` 或 `Delete`
4. **保存**：`Ctrl + O`，然后按 `Enter` 确认
5. **退出**：`Ctrl + X`，如有修改会提示保存

#### 搜索和替换

**搜索：**
1. 按 `Ctrl + W`
2. 输入要搜索的文本
3. 按 `Enter`
4. 按 `Alt + W` 查找下一个

**替换：**
1. 按 `Ctrl + \`
2. 输入要搜索的文本，按 `Enter`
3. 输入替换文本，按 `Enter`
4. 按 `Y` 确认替换，`N` 跳过，`A` 全部替换

### nano 配置

#### 配置文件位置

- 系统级配置：`/etc/nanorc`
- 用户级配置：`~/.nanorc`

#### 常用配置选项

```bash
# 显示行号
set linenumbers

# 自动缩进
set autoindent

# 使用空格代替Tab
set tabstospaces
set tabsize 4

# 语法高亮（nano 2.1.5+）
include "/usr/share/nano/*.nanorc"

# 平滑滚动
set smooth

# 显示光标位置
set constantshow

# 启用鼠标
set mouse

# 自动换行
set wordwrap

# 制表符宽度
set tabsize 4
```

### nano 与 vi/vim 的选择

| 编辑器 | 优点 | 缺点 | 适用场景 |
|--------|------|------|----------|
| **nano** | 简单易学，界面直观 | 功能相对简单 | 新手入门，简单编辑 |
| **vi/vim** | 功能强大，效率高 | 学习曲线陡峭 | 专业用户，频繁编辑 |

**建议：**
- 初学者先用 nano 入门
- 熟练后学习 vim，提高工作效率
- 服务器环境通常都有 vi，nano 可能需要额外安装

### 实践练习

1. 使用 nano 创建一个文本文件，输入一些内容，保存并退出
2. 使用 nano 打开系统配置文件（如 `/etc/hosts`），观察界面
3. 在 nano 中使用搜索功能查找特定文本
4. 配置 nano 的行号显示和语法高亮
5. 比较 nano 和 vim 的使用体验

## 4.5 正确的关机方法

### 为什么需要正确关机

Linux 是多用户、多任务系统，后台可能有许多进程在运行。直接断电可能导致：

- **数据丢失**：未写入磁盘的数据会丢失
- **文件系统损坏**：正在写入的文件可能损坏
- **系统不稳定**：下次启动可能出现错误

### 查看系统状态

在关机前，可以先查看系统状态：

```bash
who                          # 查看当前登录的用户
w                            # 查看用户及其活动
ps aux                       # 查看运行的进程
top                          # 实时查看系统状态
```

### 关机命令

#### shutdown（推荐）

功能最强大的关机命令，可以定时关机、重启，并发送通知给所有用户。

```bash
# 立即关机
shutdown now

# 定时关机（10分钟后）
shutdown +10

# 指定时间关机
shutdown 14:00

# 立即重启
shutdown -r now
shutdown -r +5 "System will reboot in 5 minutes"

# 关机并停止电源（需要硬件支持）
shutdown -h now

# 取消关机计划
shutdown -c
```

**发送消息给所有用户：**
```bash
shutdown +10 "System will shutdown for maintenance in 10 minutes. Please save your work."
```

#### poweroff

直接关闭系统并切断电源。

```bash
poweroff                     # 关机并断电
poweroff -f                  # 强制关机
poweroff -p                  # 关机并断电（默认）
```

#### halt

停止系统运行，但不一定断电。

```bash
halt                         # 停止系统
halt -p                      # 停止系统并断电
halt -f                      # 强制停止
```

#### reboot

重启系统。

```bash
reboot                       # 重启
reboot now                   # 立即重启
reboot -f                    # 强制重启
```

#### init

通过改变运行级别来关机或重启。

```bash
init 0                       # 关机（运行级别0）
init 6                       # 重启（运行级别6）
```

### 运行级别（Runlevel）

Linux 系统有不同的运行级别，对应不同的系统状态：

| 运行级别 | 说明 |
|----------|------|
| 0 | 关机 |
| 1 | 单用户模式（救援模式） |
| 2 | 多用户模式（无网络） |
| 3 | 完全多用户模式（命令行） |
| 4 | 保留，未使用 |
| 5 | 图形界面模式 |
| 6 | 重启 |

**查看当前运行级别：**
```bash
runlevel                     # 显示之前的和当前的运行级别
who -r                       # 显示当前运行级别
systemctl get-default        # 查看默认启动目标
```

**切换运行级别：**
```bash
init 3                       # 切换到命令行模式
init 5                       # 切换到图形界面
systemctl isolate multi-user.target  # 切换到多用户目标
systemctl isolate graphical.target   # 切换到图形目标
```

### 使用 systemd 管理电源

现代 Linux 发行版（如 CentOS 7+、Ubuntu 15+）使用 systemd 作为初始化系统。

**关机：**
```bash
systemctl poweroff           # 关机
systemctl halt               # 停止系统
```

**重启：**
```bash
systemctl reboot             # 重启
```

**挂起和休眠：**
```bash
systemctl suspend            # 挂起（保存到内存）
systemctl hibernate          # 休眠（保存到硬盘）
systemctl hybrid-sleep       # 混合睡眠
```

### 注意事项

1. **保存工作**：关机前确保所有重要数据已保存
2. **通知用户**：多用户系统应提前通知其他用户
3. **关闭程序**：尽量正常关闭应用程序
4. **避免强制关机**：除非系统无响应，否则不要使用强制关机
5. **定期重启**：长期运行的系统建议定期重启以清理内存

### 实践练习

1. 查看当前系统的运行级别
2. 使用 `shutdown` 命令设置 10 分钟后关机，然后取消
3. 查看 `reboot` 命令的手册页
4. 使用 `systemctl` 查看系统的电源管理命令
5. 了解你的系统的默认运行级别（目标）

## 4.6 重点回顾

- Linux 系统有图形界面和命令行界面两种操作方式
- 基础命令：`date`, `cal`, `bc`, `ls`, `cd`, `pwd`, `mkdir`, `rm`, `cp`, `mv`, `cat`, `less`, `head`, `tail`
- 重要热键：`Tab`（补全），`Ctrl+C`（中断），`Ctrl+D`（退出）
- 使用 `man`, `info`, `--help` 获取帮助
- 文本编辑器 nano：简单易学，适合初学者
- 正确关机很重要，使用 `shutdown`, `reboot`, `poweroff` 等命令

## 4.7 本章习题

1. 如何查看当前日期和时间？如何显示2024年的日历？
2. 列出当前目录下所有文件（包括隐藏文件）的详细信息。
3. 如何在后台运行一个程序？如何终止它？
4. 使用 man 查看 `cp` 命令的手册页，找出如何保留文件属性的选项。
5. 使用 nano 创建一个文件，输入一些内容，保存并退出。
6. 系统将在10分钟后关机，如何取消这个关机计划？
7. 解释 `df`, `du`, `free` 命令的区别。
8. 如何查看系统的内存使用情况？如何查看磁盘使用情况？

## 4.8 参考资料与延伸阅读

- `man man` - 查看 man 命令的手册页
- `man intro` - Linux 简介
- [Linux 命令大全](https://man.linuxde.net/)
- [Linux 命令行大全](https://linuxcommand.org/)

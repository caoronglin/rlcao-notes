---
collection:
  profile: wiki
  id: Linux
title: 第十章、认识与学习BASH
date: 2024-01-01
updated: 2024-01-01
tags:
  - Linux
  - Shell
  - Bash
  - 命令行
---

# 第十章、认识与学习BASH

## 10.1 认识 BASH 这个 Shell

### 什么是 Shell

**Shell** 是一个命令行解释器，它是用户与操作系统内核之间的接口。

**主要功能：**
1. **命令执行**：解释用户输入的命令并执行
2. **程序启动**：启动和管理程序
3. **输入输出重定向**：控制数据流向
4. **管道**：将一个命令的输出作为另一个命令的输入
5. **变量和环境**：管理环境变量
6. **脚本编程**：支持流程控制和函数

### Shell 的种类

Linux 系统中有多种 Shell，常见的有：

| Shell | 说明 | 特点 |
|-------|------|------|
| **Bash** | Bourne-Again SHell | Linux 默认 Shell，功能强大，兼容 sh |
| **sh** | Bourne Shell | 最经典的 Unix Shell，简洁快速 |
| **csh** | C Shell | 语法类似 C 语言 |
| **tcsh** | Turbo C Shell | csh 的增强版 |
| **ksh** | Korn Shell | 商业 Unix 常用，功能强大 |
| **zsh** | Z Shell | 功能最丰富，可定制性强，推荐 |
| **fish** | Friendly Interactive SHell | 用户友好，有自动补全和语法高亮 |

### 查看和切换 Shell

**查看当前使用的 Shell：**
```bash
echo $SHELL                  # 显示当前用户的默认Shell
echo $0                      # 显示当前Shell
ps -p $$                     # 显示当前进程信息
```

**查看系统安装的所有 Shell：**
```bash
cat /etc/shells              # 列出系统可用的Shell
```

**临时切换 Shell：**
```bash
/bin/sh                      # 切换到sh
/bin/bash                    # 切换到bash
/bin/zsh                     # 切换到zsh
exit                         # 退出当前Shell，返回上一层
```

**永久修改默认 Shell：**
```bash
chsh                         # 交互式修改
chsh -s /bin/zsh             # 直接指定Shell
chsh -s $(which zsh)         # 使用which获取路径
```

⚠️ **注意：** 修改后需要重新登录才能生效。

### Bash 的特性

**Bash (Bourne-Again SHell)** 是 Linux 系统默认的 Shell，具有以下特性：

#### 1. 命令历史（History）

```bash
history                      # 显示命令历史
history | tail -20           # 显示最近的20条
history -c                   # 清除历史
!n                           # 执行第n条命令
!!                           # 执行上一条命令
!-n                          # 执行倒数第n条命令
!string                      # 执行最近以string开头的命令
!?string                     # 执行最近包含string的命令
^old^new                     # 替换后执行上一条命令
```

#### 2. 命令补全（Tab Completion）

- **按一次 Tab**：自动补全命令或文件名
- **按两次 Tab**：显示所有可能的补全选项
- **Alt+?**：显示所有可能的补全
- **Alt+***：插入所有可能的补全

#### 3. 命令别名（Alias）

```bash
alias                        # 显示所有别名
alias ll                     # 显示特定别名
alias ll='ls -alF'           # 创建别名
alias rm='rm -i'             # 创建别名（安全）
unalias ll                   # 删除别名
```

#### 4. 输入输出重定向

```bash
# 输出重定向
> file                       # 覆盖输出到文件
>> file                      # 追加输出到文件
2> file                      # 错误输出到文件
2>> file                     # 错误追加到文件
&> file                      # 所有输出到文件（标准+错误）
> file 2>&1                  # 同上（旧语法）
> /dev/null                  # 丢弃输出

# 输入重定向
< file                       # 从文件输入
command << EOF               # Here Document
command <<< string            # Here String
```

#### 5. 管道（Pipe）

```bash
command1 | command2           # command1的输出作为command2的输入
command1 | command2 | command3 # 多级管道
cat file | grep pattern | sort | uniq | wc -l
```

#### 6. 变量和环境变量

```bash
# 定义变量
var=value                    # 定义局部变量
export var=value             # 定义环境变量
export var                   # 将局部变量导出为环境变量

# 使用变量
echo $var                    # 输出变量值
echo ${var}                  # 使用花括号明确变量边界
echo ${var:-default}          # 变量不存在时使用默认值
echo ${var:=default}          # 变量不存在时设置默认值

# 特殊变量
$0                           # 脚本名
$1, $2, ...                  # 位置参数
$#                           # 参数个数
$@                           # 所有参数（数组形式）
$*                           # 所有参数（字符串形式）
$?                           # 上条命令的退出状态
$$                           # 当前进程ID
$!                           # 最近后台进程的ID
$_                           # 上条命令的最后一个参数
```

#### 7. 引号的使用

```bash
# 双引号 - 弱引用，允许变量扩展和命令替换
echo "Hello $USER"
echo "Today is $(date +%Y-%m-%d)"

# 单引号 - 强引用，原样输出
echo 'Hello $USER'             # 输出: Hello $USER
echo 'Today is $(date)'        # 输出: Today is $(date)

# 反引号 - 命令替换（旧语法，推荐用 $()）
echo "Today is `date +%Y-%m-%d`"

# 转义字符
\$                           # 转义美元符号
\\                           # 转义反斜杠
\"                           # 转义双引号（在双引号内）
\n                           # 换行
\t                           # 制表符
```

#### 8. 通配符（Globbing）

```bash
# * - 匹配任意数量的任意字符
ls *.txt                     # 所有txt文件
ls file*                     # 以file开头的文件
ls *backup*                  # 包含backup的文件

# ? - 匹配单个任意字符
ls file?.txt                 # file0.txt, fileA.txt 等
ls ???.txt                   # 三个字符的txt文件

# [] - 匹配括号内的任意一个字符
ls file[0-9].txt             # file0.txt 到 file9.txt
ls file[abc].txt             # filea.txt, fileb.txt, filec.txt
ls [A-Z]*                    # 以大写字母开头的文件
ls file[!0-9].txt            # 不以数字结尾的file

# {} - 花括号扩展（不是通配符，是Shell扩展）
cp file{,.bak}               # cp file file.bak
mkdir -p project/{src,test,docs}
touch file{1..10}.txt        # file1.txt 到 file10.txt
echo {a,b,c}{1,2}            # a1 a2 b1 b2 c1 c2

# 特殊通配符（需要启用）
shopt -s extglob             # 启用扩展通配符
ls !(*.txt)                  # 非txt文件
ls @(file1|file2).txt        # file1.txt 或 file2.txt
ls +(file).txt               # 一个或多个file.txt
ls ?(file).txt               # 零个或一个file.txt
ls *(file).txt               # 零个或多个file.txt

shopt -s globstar            # 启用 ** 递归匹配
ls **/*.txt                  # 递归查找所有txt文件
```

#### 9. 进程控制

```bash
# 前台运行
command

# 后台运行
command &

# 暂停（挂起）当前进程
Ctrl+Z

# 查看作业
jobs
jobs -l                      # 显示进程ID

# 将作业放到后台运行
bg %1                        # 作业号1放到后台
bg                           # 最近挂起的作业放到后台

# 将作业放到前台运行
fg %1                        # 作业号1放到前台
fg                           # 最近的作业放到前台

# 等待进程结束
wait PID                     # 等待指定进程
wait                         # 等待所有子进程

# 杀掉进程
kill PID                     # 终止进程
kill -9 PID                  # 强制终止
kill %1                      # 终止作业
killall process_name         # 按名称终止
pkill pattern                # 按模式终止

# 脱离终端运行
nohup command &              # 不受终端关闭影响
disown %1                    # 从当前shell移除作业
```

#### 10. 命令组合与控制

```bash
# 顺序执行
command1; command2; command3

# 逻辑与（前一个成功才执行后一个）
command1 && command2
mkdir test && cd test && touch file.txt

# 逻辑或（前一个失败才执行后一个）
command1 || command2
test -f file.txt || echo "File not found"

# 组合使用
command1 && command2 || command3
# 成功执行2，失败执行3

# 管道组合
cat file | grep pattern | sort | uniq | wc -l

# 子shell
(cd /tmp; ls)                # 在子shell中执行，不影响当前目录
(command1; command2)

# 命令分组
{ command1; command2; }       # 在当前shell中执行
{ cd /tmp; ls; }              # 会影响当前目录

# 区别
# (cmd) - 子shell，变量修改不影响父shell
# { cmd; } - 当前shell，变量修改会影响

# 后台执行
command &
(command1; command2) &
{ command1; command2; } &
```

### Bash 配置文件

#### 配置文件加载顺序

**登录 Shell 的加载顺序：**
```
登录
  │
  ├─ /etc/profile
  │    │
  │    ├─ /etc/profile.d/*.sh
  │    │
  │    └─ (~/.bash_profile | ~/.bash_login | ~/.profile) 按顺序第一个存在的
  │              │
  │              └─ ~/.bashrc
  │                    │
  │                    └─ /etc/bash.bashrc (某些系统)
  │
  └─ 登录完成
```

**非登录交互式 Shell：**
```
~/.bashrc
  │
  └─ /etc/bash.bashrc (某些系统)
```

**非交互式 Shell（执行脚本）：**
```
$BASH_ENV 指定的文件（如果存在）
```

#### 主要配置文件说明

**`/etc/profile`**
- 系统全局配置文件，对所有用户生效
- 只在登录时加载一次
- 设置全局环境变量和启动程序
- 通常包含对 `/etc/profile.d/` 的引用

**`~/.bash_profile`, `~/.bash_login`, `~/.profile`**
- 用户个人配置文件，按顺序加载第一个存在的
- 只在登录时加载
- 设置用户特定的环境变量
- 通常调用 `~/.bashrc`

**`~/.bashrc`**
- 每次打开新的交互式 shell 时加载
- 设置命令别名、函数、提示符等
- 设置用户特定的环境变量

**`/etc/bash.bashrc` 或 `/etc/bashrc`**
- 系统级的 bashrc，对所有用户生效
- 在某些发行版中存在

**`/etc/profile.d/`**
- 目录，包含多个脚本文件
- 被 `/etc/profile` 调用
- 方便软件包添加自己的环境设置

#### 配置文件示例

**`/etc/profile` 示例：**
```bash
# /etc/profile

# 系统范围的环境变量
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
export EDITOR=vim
export PAGER=less

# 设置 umask
umask 022

# 加载 /etc/profile.d/ 下的所有脚本
if [ -d /etc/profile.d ]; then
  for i in /etc/profile.d/*.sh; do
    if [ -r $i ]; then
      . $i
    fi
  done
  unset i
fi

# 显示系统信息
if [ -x /usr/bin/figlet ]; then
  figlet "Welcome"
fi
```

**`~/.bash_profile` 示例：**
```bash
# ~/.bash_profile

# 获取 .bashrc 中的设置
if [ -f ~/.bashrc ]; then
  source ~/.bashrc
fi

# 用户特定的环境变量
export PATH=$PATH:$HOME/bin:$HOME/.local/bin
export EDITOR=vim
export VISUAL=vim
export PAGER=less

# 语言设置
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# 启动 SSH agent
if [ -z "$SSH_AUTH_SOCK" ]; then
  eval $(ssh-agent -s)
  ssh-add ~/.ssh/id_rsa
fi
```

**`~/.bashrc` 示例：**
```bash
# ~/.bashrc

# 如果不是交互式shell，则不继续
[ -z "$PS1" ] && return

# ===== 历史记录设置 =====
export HISTSIZE=10000           # 内存中保存的命令数
export HISTFILESIZE=20000         # 历史文件中保存的命令数
export HISTCONTROL=ignoreboth:erasedups  # 忽略空格开头和重复的命令
export HISTTIMEFORMAT="%Y-%m-%d %H:%M:%S  "  # 显示时间戳
shopt -s histappend               # 追加而不是覆盖历史文件
shopt -s cmdhist                  # 多行命令作为一条记录

# ===== 别名 =====
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
alias mkdir='mkdir -pv'
alias df='df -h'
alias du='du -h'
alias free='free -h'
alias ps='ps auxf'
alias top='htop'
alias vim='nvim'
alias upgrade='sudo apt update && sudo apt upgrade -y'

# ===== 函数 =====

# 解压任意压缩文件
extract() {
  if [ -f "$1" ]; then
    case "$1" in
      *.tar.bz2)   tar xjf "$1" ;;
      *.tar.gz)    tar xzf "$1" ;;
      *.tar.xz)    tar xJf "$1" ;;
      *.bz2)       bunzip2 "$1" ;;
      *.rar)       unrar x "$1" ;;
      *.gz)        gunzip "$1" ;;
      *.tar)       tar xf "$1" ;;
      *.tbz2)      tar xjf "$1" ;;
      *.tgz)       tar xzf "$1" ;;
      *.zip)       unzip "$1" ;;
      *.Z)         uncompress "$1" ;;
      *.7z)        7z x "$1" ;;
      *)           echo "Unknown format: '$1'" ;;
    esac
  else
    echo "'\$1' is not a valid file"
  fi
}

# 创建目录并进入
mkcd() {
  mkdir -p "$1" && cd "$1"
}

# 返回上级目录并列出内容
up() {
  cd .. && ls
}

# ===== 提示符设置 =====

# 设置彩色提示符
if [ -x /usr/bin/tput ] && tput setaf 1 &>/dev/null; then
  # 支持颜色
  PS1='\[\e[01;32m\]\u@\h\[\e[00m\]:\[\e[01;34m\]\w\[\e[00m\]\$ '
else
  PS1='\u@\h:\w\$ '
fi

# ===== 其他设置 =====

# 启用扩展通配符
shopt -s extglob
shopt -s globstar

# 自动修正cd拼写错误
shopt -s cdspell

# 检查窗口大小变化
shopt -s checkwinsize

# 启用**递归匹配
shopt -s globstar 2>/dev/null

# 加载本地配置（如果存在）
if [ -f ~/.bash_local ]; then
  source ~/.bash_local
fi

# ===== 欢迎信息 =====

echo "Welcome, $USER!"
echo "Today is $(date '+%A, %B %d, %Y')"
echo "System: $(uname -sr)"
echo "Uptime: $(uptime -p 2>/dev/null || uptime)"
```

### 配置文件的加载顺序总结

```
登录 Shell:
  /etc/profile
    └── /etc/profile.d/*.sh
  ~/.bash_profile | ~/.bash_login | ~/.profile (第一个存在的)
    └── ~/.bashrc
          └── /etc/bash.bashrc (某些系统)

非登录交互式 Shell:
  ~/.bashrc
    └── /etc/bash.bashrc (某些系统)

非交互式 Shell (执行脚本):
  $BASH_ENV 指定的文件
```

**最佳实践：**
1. 系统级环境变量 → `/etc/profile`
2. 用户环境变量 → `~/.bash_profile` 或 `~/.profile`
3. 交互式设置（别名、函数、提示符） → `~/.bashrc`
4. 在 `~/.bash_profile` 中调用 `~/.bashrc` 确保登录时也加载交互式设置

## 10.2 Shell 的变量功能

### 什么是变量

**变量**是用于存储数据的命名内存空间。在 Shell 中，变量可以存储字符串、数字、命令输出等。

### 变量的分类

| 类型 | 说明 | 示例 |
|------|------|------|
| **局部变量** | 只在当前 Shell 中有效 | `var=value` |
| **环境变量** | 子进程也能访问 | `export var=value` |
| **位置参数** | 命令行参数 | `$1`, `$2`, `$@` |
| **特殊变量** | Shell 内置的特殊变量 | `$?`, `$$`, `$#` |
| **只读变量** | 不能被修改 | `readonly var=value` |

### 变量的定义和使用

**定义变量：**
```bash
# 基本语法：变量名=值（等号两边不能有空格！）
name="John Doe"
age=25
pi=3.14159

# 错误的定义方式
name = "John"        # 错误：等号两边有空格
$name="John"        # 错误：变量名不能用$开头
```

**使用变量：**
```bash
# 使用$符号引用变量
echo $name
echo $age
echo $pi

# 使用花括号明确变量边界（推荐）
echo "My name is ${name}"
echo "PI = ${pi}"

# 花括号的必要性
test_var="Hello"
echo "$test_varworld"      # 错误：找不到变量test_varworld
echo "${test_var}world"    # 正确：输出 Helloworld
```

### 环境变量

**查看环境变量：**
```bash
env                          # 显示所有环境变量
printenv                     # 同上
printenv PATH                # 显示特定环境变量
echo $PATH                   # 同上
```

**设置环境变量：**
```bash
# 临时设置（当前Shell）
export PATH=$PATH:/new/path
export MY_VAR="my value"

# 永久设置（添加到配置文件）
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc             # 立即生效
```

**常用环境变量：**

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `PATH` | 可执行文件的搜索路径 | `/usr/bin:/bin:/usr/sbin` |
| `HOME` | 当前用户的主目录 | `/home/username` |
| `USER` | 当前用户名 | `john` |
| `SHELL` | 当前使用的 Shell | `/bin/bash` |
| `LANG` | 系统语言设置 | `en_US.UTF-8` |
| `PWD` | 当前工作目录 | `/home/user/documents` |
| `OLDPWD` | 上一次所在的目录 | `/home/user` |
| `PS1` | 命令提示符 | `\u@\h:\w\$` |
| `PS2` | 续行提示符 | `>` |
| `EDITOR` | 默认编辑器 | `vim` |
| `PAGER` | 默认分页器 | `less` |
| `TERM` | 终端类型 | `xterm-256color` |
| `DISPLAY` | X11 显示 | `:0` |
| `SSH_CLIENT` | SSH 客户端信息 | `192.168.1.100 12345 22` |
| `SSH_TTY` | SSH 分配的 TTY | `/dev/pts/0` |

### 特殊变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `$0` | 脚本名称或 Shell 名称 | `myscript.sh` |
| `$1` - `$9` | 第1到第9个位置参数 | `arg1`, `arg2` |
| `${10}` - `${n}` | 第10个及以后的位置参数 | `${10}`, `${100}` |
| `$*` | 所有位置参数（作为单个字符串） | `"$1 $2 $3"` |
| `$@` | 所有位置参数（作为多个字符串） | `"$1" "$2" "$3"` |
| `$#` | 位置参数的数量 | `3` |
| `$?` | 上一个命令的退出状态码 | `0` 表示成功 |
| `$$` | 当前 Shell 的进程ID | `12345` |
| `$!` | 最近一个后台进程的PID | `12346` |
| `$_` | 上一个命令的最后一个参数 | 或上一条命令本身 |
| `$-` | 当前 Shell 的标志位 | `himBH` |

**位置参数示例：**
```bash
#!/bin/bash
# test_args.sh

echo "Script name: $0"
echo "First argument: $1"
echo "Second argument: $2"
echo "Tenth argument: ${10}"
echo "All arguments (\$*): $*"
echo "All arguments (\$@): $@"
echo "Number of arguments: $#"
```

运行：
```bash
./test_args.sh arg1 arg2 arg3 arg4 arg5 arg6 arg7 arg8 arg9 arg10
```

**`$*` 和 `$@` 的区别：**
```bash
#!/bin/bash
# difference.sh

echo 'Using $*:'
for arg in "$*"; do
  echo "  [$arg]"
done

echo 'Using $@:'
for arg in "$@"; do
  echo "  [$arg]"
done
```

运行：
```bash
./difference.sh "hello world" foo bar
# 输出：
# Using $*:
#   [hello world foo bar]
# Using $@:
#   [hello world]
#   [foo]
#   [bar]
```

### 变量的操作

**删除变量：**
```bash
unset var                    # 删除变量
unset -v var                 # 同上（明确指定变量）
unset -f function_name       # 删除函数
```

**只读变量：**
```bash
readonly var=value           # 定义只读变量
readonly var                 # 将已有变量设为只读
readonly -p                  # 显示所有只读变量
# 只读变量不能修改和删除
```

**本地变量：**
```bash
local var=value              # 在函数中定义局部变量
local var                    # 声明局部变量，不赋值
```

**默认值：**
```bash
${var:-default}              # 如果var未定义或为空，返回default，var不变
${var:=default}              # 如果var未定义或为空，将var设为default并返回
${var:?message}              # 如果var未定义或为空，显示错误信息并退出
${var:+replacement}          # 如果var已定义且非空，返回replacement，否则返回空
```

**示例：**
```bash
#!/bin/bash

# :- 提供默认值
name=${1:-"World"}
echo "Hello, $name!"
# 运行: ./script.sh Alice  # 输出: Hello, Alice!
# 运行: ./script.sh        # 输出: Hello, World!

# := 设置默认值
config_file=${CONFIG_FILE:="/etc/default.conf"}
echo "Config: $config_file"
# 如果CONFIG_FILE未设置，将其设为默认值

# :? 错误检查
target_dir=${TARGET_DIR:?"Error: TARGET_DIR is not set"}
# 如果TARGET_DIR未设置，显示错误并退出

# :+ 条件值
debug_mode=${DEBUG:+"--debug"}
# 如果DEBUG已设置且非空，debug_mode="--debug"，否则为空
```

**字符串操作：**
```bash
# 获取字符串长度
${#var}

# 提取子串（从0开始计数）
${var:position}              # 从position到末尾
${var:position:length}       # 从position开始，取length个字符

# 删除匹配（最短匹配）
${var#pattern}               # 删除开头匹配的pattern（最短）
${var%pattern}               # 删除结尾匹配的pattern（最短）

# 删除匹配（最长匹配）
${var##pattern}              # 删除开头匹配的pattern（最长）
${var%%pattern}             # 删除结尾匹配的pattern（最长）

# 替换
${var/pattern/replacement}   # 替换第一个匹配
${var//pattern/replacement}  # 替换所有匹配
${var/#pattern/replacement}  # 替换开头的匹配
${var/%pattern/replacement}  # 替换结尾的匹配

# 大小写转换（Bash 4.0+）
${var^^}                     # 转大写
${var,,}                     # 转小写
${var^}                      # 首字母大写
${var,}                      # 首字母小写
${var^^pattern}              # 匹配pattern的字符转大写
${var,,pattern}              # 匹配pattern的字符转小写
```

**示例：**
```bash
#!/bin/bash

path="/home/user/documents/file.txt"

# 获取长度
echo "Length: ${#path}"        # 输出: 32

# 提取子串
echo "${path:5}"               # 输出: user/documents/file.txt
echo "${path:5:4}"             # 输出: user
echo "${path: -8}"             # 输出: file.txt (从右边数8个)

# 删除匹配（获取目录名和文件名）
echo "${path%/*}"              # 输出: /home/user/documents (删除最后/及之后)
echo "${path##*/}"             # 输出: file.txt (删除最后/及之前)

# 替换
echo "${path/file/document}"   # 输出: /home/user/documents/document.txt
echo "${path//n/N}"            # 输出: /home/user/documeNts/file.txt (所有n替换为N)

# 大小写转换
str="Hello World"
echo "${str^^}"                # 输出: HELLO WORLD
echo "${str,,}"                # 输出: hello world
echo "${str^}"                 # 输出: Hello world (只有首字母大写)
```

### 数组

**定义数组：**
```bash
# 方式1：空格分隔的值
arr=(value1 value2 value3)

# 方式2：使用索引
arr[0]=value1
arr[1]=value2
arr[2]=value3

# 方式3：混合方式
arr=(value1 [3]=value4 value5)

# 方式4：命令输出作为数组
arr=($(ls *.txt))
arr=($(cat file.txt))

# 方式5：read命令
read -a arr <<< "a b c"
```

**访问数组元素：**
```bash
arr=(apple banana cherry date)

echo "${arr[0]}"               # 第一个元素: apple
echo "${arr[1]}"               # 第二个元素: banana
echo "${arr[-1]}"              # 最后一个元素: date
echo "${arr[-2]}"              # 倒数第二个: cherry

echo "${arr[@]}"               # 所有元素（数组形式）
echo "${arr[*]}"               # 所有元素（字符串形式）
echo "${#arr[@]}"              # 数组长度
```

**数组操作：**
```bash
arr=(a b c d e)

# 切片（获取子数组）
echo "${arr[@]:1}"             # 从索引1开始到末尾: b c d e
echo "${arr[@]:1:3}"           # 从索引1开始，取3个: b c d
echo "${arr[@]: -2}"           # 最后2个: d e

# 添加元素
arr+=(f g)                   # 追加到末尾
arr=(x "${arr[@]}")          # 插入到开头
arr=("${arr[@]:0:2}" new "${arr[@]:2}")  # 插入到中间

# 删除元素
unset arr[1]                 # 删除索引1的元素
arr=("${arr[@]/b/}")         # 删除值为b的元素（重新创建数组）

# 替换元素
arr=("${arr[@]/old/new}")    # 将所有old替换为new

# 遍历数组
for item in "${arr[@]}"; do
  echo "$item"
done

# 带索引的遍历
for i in "${!arr[@]}"; do
  echo "$i: ${arr[$i]}"
done

# while遍历
i=0
while [ $i -lt ${#arr[@]} ]; do
  echo "${arr[$i]}"
  ((i++))
done
```

**关联数组（Bash 4.0+）：**
```bash
# 声明关联数组
declare -A assoc

# 赋值
assoc[name]="John"
assoc[age]=30
assoc[city]="New York"

# 访问
echo "${assoc[name]}"          # John
echo "${assoc[age]}"           # 30

# 获取所有键
echo "${!assoc[@]}"            # name age city

# 获取所有值
echo "${assoc[@]}"             # John 30 New York

# 长度
echo "${#assoc[@]}"             # 3

# 遍历
for key in "${!assoc[@]}"; do
  echo "$key: ${assoc[$key]}"
done

# 检查键是否存在
if [ -v assoc[name] ]; then
  echo "Key exists"
fi

# 删除元素
unset assoc[age]
```

## 10.3 数据流重定向

### 什么是数据流重定向

在 Linux 中，程序运行时会产生三种数据流：

| 数据流 | 文件描述符 | 默认指向 | 说明 |
|--------|------------|----------|------|
| **标准输入 (stdin)** | 0 | 键盘 | 程序读取输入的地方 |
| **标准输出 (stdout)** | 1 | 屏幕 | 程序正常输出的地方 |
| **标准错误 (stderr)** | 2 | 屏幕 | 程序报错的地方 |

**数据流重定向**就是改变这些数据的默认流向。

### 输出重定向

**覆盖输出到文件：**
```bash
command > file               # 标准输出重定向到文件（覆盖）
command 1> file              # 同上（显式指定文件描述符1）
command >> file              # 标准输出追加到文件
command 1>> file             # 同上
```

**错误输出重定向：**
```bash
command 2> file              # 标准错误重定向到文件（覆盖）
command 2>> file             # 标准错误追加到文件
```

**同时重定向标准输出和标准错误：**
```bash
# 方法1：分别重定向
command > stdout.log 2> stderr.log

# 方法2：合并输出到同一个文件（旧语法）
command > file 2>&1

# 方法3：合并输出到同一个文件（新语法，推荐）
command > file 2>&1
command &> file              # Bash 4.0+
command &>> file             # 追加模式

# 方法4：丢弃输出
command > /dev/null          # 丢弃标准输出
command 2> /dev/null         # 丢弃错误输出
command > /dev/null 2>&1    # 丢弃所有输出
command &> /dev/null         # Bash 4.0+
```

### 输入重定向

**从文件输入：**
```bash
command < file               # 从文件读取输入
cat < file.txt               # 从文件读取并显示
sort < input.txt             # 从文件读取并排序
```

**Here Document（多行输入）：**
```bash
command << EOF
line 1
line 2
line 3
EOF

# 示例
cat << END
This is a multi-line text.
It will be displayed as is.
Variables like $HOME will be expanded.
END

# 忽略变量扩展（用引号包围标记）
cat << 'EOF'
$HOME will NOT be expanded.
It is displayed literally: $HOME
EOF

# 去除前导制表符（用-）
cat <<- EOF
	This line has a tab.
	This line also has a tab.
	The tabs will be removed.
EOF
```

**Here String（单行输入）：**
```bash
command <<< "string"

# 示例
bc <<< "1 + 2"              # 计算 1 + 2
grep pattern <<< "text to search"
awk '{print $1}' <<< "one two three"
```

### 管道

管道 `|` 将一个命令的标准输出连接到另一个命令的标准输入。

**基本用法：**
```bash
command1 | command2          # command1的输出作为command2的输入
command1 | command2 | command3  # 多级管道
```

**常用组合：**
```bash
# 查找并排序
ls -la | sort

# 查找并计数
ls | wc -l

# 过滤日志
cat /var/log/syslog | grep error
cat /var/log/syslog | grep error | head -20

# 查找进程
ps aux | grep nginx

# 去重并计数
cat file.txt | sort | uniq
cat file.txt | sort | uniq -c | sort -nr

# 复杂查询
ps aux | grep "[n]ginx" | awk '{print $2}' | xargs kill -9
```

**管道与重定向结合：**
```bash
# 将管道的输出保存到文件
ls -la | sort > sorted.txt

# 将错误也通过管道
command 2>&1 | next_command

# 同时输出到文件和屏幕（使用tee）
command | tee output.txt     # 覆盖文件
command | tee -a output.txt  # 追加到文件
command | tee file1.txt file2.txt  # 输出到多个文件

# tee与管道结合
cat input.txt | tee /dev/tty | wc -l
```

### 高级重定向

**进程替换：**
```bash
# 将命令的输出作为文件
command <(list)

# 示例：比较两个命令的输出
diff <(ls dir1) <(ls dir2)

# 将多个命令的输出合并
cat <(echo "Header") <(main_content.txt) <(echo "Footer")

# 进程替换写入
comm -12 <(sort file1) <(sort file2)
```

**文件描述符操作：**
```bash
# 打开文件描述符
exec 3> output.txt           # 打开文件描述符3用于写入
exec 4< input.txt            # 打开文件描述符4用于读取
exec 5>> log.txt             # 打开文件描述符5用于追加

# 使用文件描述符
echo "Hello" >&3
read line <&4
echo "Log entry" >&5

# 关闭文件描述符
exec 3>&-
exec 4<&-

# 复制文件描述符
exec 3>&1                   # 将stdout复制到3
exec 1> output.txt           # 重定向stdout
# 恢复stdout
exec 1>&3
exec 3>&-

# 复杂重定向示例
# 同时记录stdout和stderr到不同文件，同时显示在屏幕
exec 3>&1 4>&2                   # 备份stdout和stderr
exec 1> >(stdbuf -oL tee stdout.log) # 重定向stdout到tee
exec 2> >(stdbuf -eL tee stderr.log)  # 重定向stderr到tee

# 恢复
exec 1>&3 2>&4
exec 3>&- 4>&-
```

### 本章重点总结

1. **Shell** 是用户与内核的接口，Bash 是 Linux 默认 Shell
2. **变量**分为局部变量、环境变量、位置参数、特殊变量
3. **环境变量** PATH 决定命令搜索路径
4. **数据流**：stdin(0)、stdout(1)、stderr(2)
5. **重定向**：`>` 覆盖、`>>` 追加、`2>` 错误重定向、`2>&1` 合并
6. **管道** `|` 连接多个命令
7. **Here Document** `<<` 用于多行输入
8. **配置文件**：`/etc/profile`、`~/.bash_profile`、`~/.bashrc`
9. **特殊变量**：`$?` 退出状态、`$$` 进程ID、`$#` 参数个数
10. **引号**：双引号允许变量扩展，单引号原样输出

## 10.4 命令执行的判断依据

### 顺序执行与逻辑控制

在 Shell 中，多个命令可以通过特定符号组合执行，实现流程控制。

#### 分号 `;` - 顺序执行

```bash
command1; command2; command3
```

**特点：**
- 无论前一个命令是否成功，都执行后一个命令
- 命令按顺序依次执行
- 退出状态是最后一个命令的退出状态

**示例：**
```bash
# 顺序执行多个命令
echo "Step 1"; echo "Step 2"; echo "Step 3"

# 编译并安装软件
./configure; make; sudo make install

# 备份操作
cd /data; tar -czf backup.tar.gz important_files; mv backup.tar.gz /backup/

# 无论成功与否都执行清理
process_data; cleanup_temp_files
```

#### `&&` - 逻辑与

```bash
command1 && command2 && command3
```

**特点：**
- 前一个命令**成功**（退出状态为0）时，才执行后一个命令
- 如果某个命令失败，后续的命令不会执行
- 常用于条件判断

**示例：**
```bash
# 确保目录存在后才进入
mkdir -p /tmp/test && cd /tmp/test

# 先测试连接再传输
ping -c 1 server.com && scp file.txt server.com:/backup/

# 编译链
./configure && make && sudo make install

# 检查文件存在才处理
[ -f data.txt ] && process_data.sh

# 多条命令的条件执行
command1 && {
  echo "Command 1 succeeded"
  command2
  command3
}

# 实际应用：安全删除
check_important "file.txt" && rm "file.txt"

# 数据库操作
connect_db && run_migrations && restart_server
```

#### `||` - 逻辑或

```bash
command1 || command2 || command3
```

**特点：**
- 前一个命令**失败**（退出状态非0）时，才执行后一个命令
- 如果某个命令成功，后续的命令不会执行
- 常用于提供备选方案或错误处理

**示例：**
```bash
# 如果目录不存在则创建
[ -d /tmp/test ] || mkdir /tmp/test

# 如果本地没有则从网络获取
[ -f package.tar.gz ] || wget http://example.com/package.tar.gz

# 尝试多个镜像
download_from_mirror1 || download_from_mirror2 || download_from_mirror3

# 错误处理
process_data || {
  echo "Error: Failed to process data" >&2
  exit 1
}

# 默认值
username=${1:-$(whoami)} || username="anonymous"

# 检查命令是否存在
which git || echo "Please install git"

# 实际应用：智能启动
start_service || restart_service || notify_admin

# 多级回退
# 优先使用本地配置
load_local_config || load_global_config || load_default_config

# 错误处理和日志
backup_database || {
  logger -t backup "Database backup failed"
  send_alert_email
  exit 1
}
```

#### 组合使用

```bash
# 常见模式：如果成功则A，否则B
command && success_action || failure_action

# 注意：这种模式有陷阱！
# 如果 success_action 失败，会执行 failure_action！
# 应该使用 if 语句或分组

# 安全的写法
if command; then
  success_action
else
  failure_action
fi

# 或使用分组
code
command && { success_action; true; } || { failure_action; }

# 复杂条件
# 多个条件同时满足
command1 && command2 && command3 && final_action

# 任一条件满足
command1 || command2 || command3 || final_action

# 混合条件
(command1 && command2) || (command3 && command4) || fallback

# 实际应用

# 智能编译
[ -f Makefile ] && make || [ -f CMakeLists.txt ] && cmake .

# 多级配置加载
load_config_from ~/.app/config \
  || load_config_from /etc/app/config \
  || load_default_config

# 条件部署
run_tests && build_package && deploy_to_staging \
  || notify_deployment_failure

# 安全删除
[ -w "$file" ] && [ ! -d "$file" ] && rm "$file" \
  || echo "Cannot remove $file" >&2

# 智能服务管理
pgrep mysqld && mysqladmin ping || systemctl restart mysql
```

#### 退出状态码

每个命令执行后都会返回一个**退出状态码**（exit status），可以用 `$?` 获取：

| 状态码 | 含义 |
|--------|------|
| `0` | 成功 |
| `1` | 通用错误 |
| `2` | 误用命令（Bash内置命令） |
| `126` | 命令不可执行 |
| `127` | 命令未找到 |
| `128` | 无效退出参数 |
| `128+N` | 致命信号 N（如 130 = Ctrl+C） |
| `130` | 脚本被Ctrl+C终止 |
| `255` | 退出状态码超出范围 |

**查看退出状态：**
```bash
ls /existing/dir
echo $?                      # 输出: 0

ls /nonexistent
echo $?                      # 输出: 2

command_not_found
echo $?                      # 输出: 127
```

**在脚本中使用退出状态：**
```bash
#!/bin/bash

# 检查命令是否成功
if ping -c 1 google.com > /dev/null 2>&1; then
  echo "Network is up"
  exit 0
else
  echo "Network is down"
  exit 1
fi
```

**自定义退出状态：**
```bash
#!/bin/bash

# 定义退出码
readonly SUCCESS=0
readonly ERROR_GENERAL=1
readonly ERROR_INVALID_ARGS=2
readonly ERROR_FILE_NOT_FOUND=3
readonly ERROR_PERMISSION=4

# 检查参数
if [ $# -eq 0 ]; then
  echo "Usage: $0 <file>" >&2
  exit $ERROR_INVALID_ARGS
fi

# 检查文件
if [ ! -f "$1" ]; then
  echo "Error: File '$1' not found" >&2
  exit $ERROR_FILE_NOT_FOUND
fi

# 检查权限
if [ ! -r "$1" ]; then
  echo "Error: Cannot read '$1'" >&2
  exit $ERROR_PERMISSION
fi

# 处理文件
process_file "$1"
exit $SUCCESS
```

### 本章总结

1. **Shell 是命令解释器**，Bash 是 Linux 默认 Shell
2. **变量**：局部变量、环境变量、位置参数、特殊变量
3. **引号**：双引号允许变量扩展，单引号原样输出，反引号执行命令
4. **重定向**：`>` 覆盖、`>>` 追加、`2>` 错误、`2>&1` 合并
5. **管道** `|` 连接多个命令，实现数据流传递
6. **命令分隔符**：`;` 顺序执行、`&&` 逻辑与、`||` 逻辑或
7. **退出状态码**：`0` 表示成功，非 `0` 表示失败，存储在 `$?` 中
8. **数组**：支持索引数组和关联数组（Bash 4.0+）
9. **配置文件**：`/etc/profile`、`~/.bash_profile`、`~/.bashrc` 等的加载顺序
10. **字符串操作**：提取子串、删除匹配、替换、大小写转换等

## 10.5 管道命令

管道命令`|` 是 Linux Shell 中非常强大的功能，它允许将一个命令的输出直接作为另一个命令的输入，实现数据的流水线处理。

### 管道的工作原理

```
命令1 | 命令2 | 命令3 | ... | 命令N
   ↓       ↓       ↓           ↓
 输出1   输入2   输出2        最终输出
        输入3
```

**关键点：**
- 管道连接的是**标准输出**到**标准输入**
- 管道中的每个命令在**子shell**中执行
- 管道可以包含任意数量的命令

### 常用管道命令

#### 1. cut - 切割提取

从每行中提取指定部分：

```bash
# 按字符位置
cut -c 1-5 file.txt          # 提取第1-5个字符
cut -c 1,3,5 file.txt        # 提取第1、3、5个字符
cut -c 5- file.txt           # 从第5个字符到末尾

# 按字段（默认制表符分隔）
cut -f 1 file.txt            # 提取第1个字段
cut -f 1,3 file.txt          # 提取第1和第3个字段
cut -f 2-4 file.txt          # 提取第2-4个字段

# 指定分隔符
cut -d ':' -f 1 /etc/passwd  # 使用:作为分隔符
cut -d ',' -f 2 data.csv     # 使用,作为分隔符

# 排除字段
cut --complement -f 1 file.txt  # 提取除第1字段外的所有字段
```

**管道示例：**
```bash
# 提取用户名
grep "bin/bash" /etc/passwd | cut -d ':' -f 1

# 提取IP地址
ifconfig eth0 | grep "inet " | cut -d ' ' -f 10

# 提取进程PID
ps aux | grep nginx | grep -v grep | cut -c 10-15

# 提取CSV的特定列
cat data.csv | cut -d ',' -f 1,3,5 | sort
```

#### 2. grep - 文本过滤

使用正则表达式搜索文本：

```bash
# 基本用法
grep pattern file.txt        # 在文件中搜索
grep pattern dir/*.txt     # 在多个文件中搜索
cat file.txt | grep pattern  # 管道使用

# 选项
-i                           # 忽略大小写
-v                           # 反向匹配（显示不匹配的行）
-n                           # 显示行号
-c                           # 统计匹配行数
-l                           # 只显示包含匹配的文件名
-L                           # 只显示不包含匹配的文件名
-r                           # 递归搜索目录
-w                           # 匹配整个单词
-x                           # 匹配整行
-A 3                         # 显示匹配行及后3行
-B 3                         # 显示匹配行及前3行
-C 3                         # 显示匹配行及前后3行
-E                           # 使用扩展正则表达式
-F                           # 按字面意思搜索（不使用正则）
-o                           # 只显示匹配的部分
-q                           # 静默模式（不输出，用于判断）
--color=auto                # 高亮显示匹配

# 正则表达式示例
grep "^start" file           # 以start开头
grep "end$" file             # 以end结尾
grep "a.b" file              # a和b之间有任意一个字符
grep "a*b" file              # 0个或多个a后跟b
grep "a\+b" file             # 1个或多个a后跟b（需要-E）
grep "a\?b" file             # 0或1个a后跟b（需要-E）
grep "[abc]" file            # a或b或c
grep "[^abc]" file           # 不是a、b、c的字符
grep "\{3\}" file            # 正好3个（需要转义）
grep -E "a{2,4}" file        # 2到4个a
```

**管道示例：**
```bash
# 查找并过滤
ps aux | grep nginx | grep -v grep

# 统计进程数
ps aux | grep "[h]ttpd" | wc -l

# 查找错误日志
cat /var/log/syslog | grep -i error | tail -20

# 复杂过滤
ps aux | awk '{print $2, $11}' | grep chrome | grep -v grep | awk '{print $1}'

# 查找大文件
du -ah /home | grep -E "^[0-9]+M|^[0-9]+G" | sort -hr | head -10

# 查找IP地址
ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}'

# 统计单词频率
cat file.txt | tr ' ' '\n' | sort | uniq -c | sort -nr | head -20
```

#### 3. sort - 文本排序

对文本行进行排序：

```bash
# 基本用法
sort file.txt                # 按字母顺序排序
cat file.txt | sort          # 管道使用

# 常用选项
-r                           # 逆序（降序）
-n                           # 按数字排序
-k 2                         # 按第2列排序
-k 2,3                       # 按第2到3列排序
-t ':'                       # 指定分隔符
-f                           # 忽略大小写
-u                           # 去重（相当于sort | uniq）
-c                           # 检查是否已排序
-C                           # 检查是否已排序（静默）
-m                           # 合并已排序的文件
-s                           # 稳定排序
-b                           # 忽略前导空白
-h                           # 人类可读大小排序（如2K,1M）
--version-sort               # 版本号排序

# 数字排序示例
echo -e "10\n2\n1\n20" | sort -n
# 输出：1, 2, 10, 20

# 按特定列排序
cat data.txt | sort -k 3 -n  # 按第3列数字排序

# 复杂排序
ps aux | sort -k 3 -nr | head -5  # 按CPU使用率排序
```

**管道示例：**
```bash
# 排序并去重
cat file.txt | sort -u

# 按大小排序
du -sh /home/* | sort -h

# 按内存使用排序
ps aux | sort -k 4 -nr | head -10

# 复杂查询
ps aux | grep -E "(nginx|php)" | sort -k 3 -nr | awk '{print $2, $11}'
```

#### 4. uniq - 去重

过滤或报告重复的行（需要先排序）：

```bash
# 基本用法（需要去重前的行是排序的）
sort file.txt | uniq         # 去重

# 常用选项
-c                           # 统计每行出现的次数
-d                           # 只显示重复的行
-u                           # 只显示不重复的行（唯一）
-i                           # 忽略大小写
-f N                         # 跳过前N个字段
-s N                         # 跳过前N个字符
-w N                         # 只比较前N个字符
--all-repeated=METHOD       # 显示所有重复行（prepend/separate/both）

# 统计出现次数
sort file.txt | uniq -c | sort -nr  # 按频率排序

# 找出重复项
sort file.txt | uniq -d

# 找出唯一项
sort file.txt | uniq -u
```

**管道示例：**
```bash
# 统计IP访问频率
awk '{print $1}' access.log | sort | uniq -c | sort -nr | head -20

# 统计单词频率
cat file.txt | tr ' ' '\n' | sort | uniq -c | sort -nr | head -20

# 找出重复的文件（按MD5）
find /path -type f -exec md5sum {} \; | sort | uniq -d -w32

# 统计进程名
ps aux | awk '{print $11}' | sort | uniq -c | sort -nr
```

#### 5. wc - 统计

统计行数、单词数、字节数：

```bash
wc file.txt                  # 显示行数、单词数、字节数
wc -l file.txt               # 只显示行数
wc -w file.txt               # 只显示单词数
wc -c file.txt               # 只显示字节数
wc -m file.txt               # 只显示字符数
wc -L file.txt               # 显示最长行的长度

# 统计多个文件
wc file1.txt file2.txt

# 管道使用
ls | wc -l                   # 统计文件数
grep pattern file | wc -l    # 统计匹配行数
```

**管道示例：**
```bash
# 统计代码行数
find . -name "*.py" | xargs wc -l

# 统计进程数
ps aux | wc -l

# 统计用户登录数
who | wc -l

# 统计唯一IP数
awk '{print $1}' access.log | sort | uniq | wc -l
```

#### 6. tee - 双向输出

同时将输出显示在屏幕并保存到文件：

```bash
command | tee file.txt       # 覆盖文件
command | tee -a file.txt    # 追加到文件
command | tee -i file.txt    # 忽略中断信号

# 输出到多个文件
command | tee file1.txt file2.txt file3.txt

# 与sudo结合使用（将权限提升应用于重定向）
echo "content" | sudo tee /etc/config.conf

# 既显示又保存，同时传递给下一个命令
cat file.txt | tee /dev/tty | wc -l
```

#### 7. tr - 字符转换

转换或删除字符：

```bash
# 基本转换
echo "hello" | tr 'a-z' 'A-Z'  # 转大写
echo "HELLO" | tr 'A-Z' 'a-z'  # 转小写

# 删除字符
tr -d 'a' < file.txt         # 删除所有a
tr -d '0-9' < file.txt       # 删除所有数字

# 压缩重复字符
tr -s ' ' < file.txt         # 将多个空格压缩为单个

# 替换特定字符
echo "hello world" | tr ' ' '_'

# 删除非字母字符
tr -cd 'a-zA-Z' < file.txt

# 转换换行为空格
cat file.txt | tr '\n' ' '

# ROT13编码/解码
echo "hello" | tr 'A-Za-z' 'N-ZA-Mn-za-m'
echo "uryyb" | tr 'A-Za-z' 'N-ZA-Mn-za-m'
```

#### 8. split - 文件分割

将大文件分割成多个小文件：

```bash
# 按行数分割
split -l 1000 large.txt part_  # 每1000行一个文件，前缀为part_

# 按大小分割
split -b 10M large.bin part_   # 每个文件10MB
split -b 1G large.iso part_    # 每个文件1GB

# 指定输出文件名
split -l 100 large.txt output_

# 使用数字后缀（默认）
split -l 100 -d large.txt part_

# 指定后缀长度
split -l 100 -d -a 4 large.txt part_

# 合并分割的文件
cat part_* > original_file

# 使用tar分割打包文件
tar czf - large_dir | split -b 100M - large_dir.tar.gz.part_

# 合并并解压
cat large_dir.tar.gz.part_* | tar xzf -
```

### 管道命令总结

| 命令 | 功能 | 常用选项 |
|------|------|----------|
| `cut` | 按列提取 | `-d`, `-f`, `-c` |
| `grep` | 文本过滤 | `-i`, `-v`, `-n`, `-r` |
| `sort` | 文本排序 | `-n`, `-r`, `-k`, `-t` |
| `uniq` | 去重 | `-c`, `-d`, `-u` |
| `wc` | 统计 | `-l`, `-w`, `-c` |
| `tee` | 双向输出 | `-a`, `-i` |
| `tr` | 字符转换 | `-d`, `-s` |
| `split` | 文件分割 | `-l`, `-b` |

### 管道实战示例

```bash
# 1. 分析网站访问日志，找出访问最多的IP
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10

# 2. 查找大文件并排序
du -ah /home | grep -E "^[0-9]+(\.[0-9]+)?G" | sort -hr | head -10

# 3. 统计代码行数
find . -name "*.py" -o -name "*.js" -o -name "*.java" | xargs wc -l | tail -1

# 4. 批量重命名（去除特定后缀）
ls *.bak | while read f; do mv "$f" "${f%.bak}"; done

# 5. 查找并杀死进程
ps aux | grep "[n]ginx" | awk '{print $2}' | xargs kill -9

# 6. 日志分析：统计每小时的错误数
awk '{print $4}' error.log | cut -d: -f1 | sort | uniq -c

# 7. 合并多个文件并去重
cat file1.txt file2.txt file3.txt | sort | uniq > merged.txt

# 8. 提取邮件地址
grep -oE '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' file.txt | sort -u

# 9. 比较两个文件的不同
comm <(sort file1.txt) <(sort file2.txt)
diff file1.txt file2.txt

# 10. 实时监控日志
tail -f access.log | grep --line-buffered "500" | tee errors.txt
```

## 10.6 重点回顾

1. **Shell** 是命令解释器，Bash 是 Linux 默认 Shell
2. **变量**：定义 `var=value`，使用 `$var` 或 `${var}`
3. **环境变量**：`export var=value`，子进程可继承
4. **特殊变量**：`$?` 退出状态、`$$` 进程ID、`$#` 参数个数、`$@` 所有参数
5. **数据流**：stdin(0)、stdout(1)、stderr(2)
6. **重定向**：`>` 覆盖、`>>` 追加、`2>` 错误重定向、`2>&1` 合并到stdout
7. **管道** `|` 将一个命令的输出作为另一个命令的输入
8. **命令组合**：`;` 顺序执行、`&&` 逻辑与、`||` 逻辑或
9. **引号**：双引号允许变量扩展，单引号原样输出
10. **配置文件加载顺序**：`/etc/profile` → `~/.bash_profile` → `~/.bashrc`
11. **常用管道命令**：`cut`、`grep`、`sort`、`uniq`、`wc`、`tee`、`tr`
12. **数组**：索引数组 `arr=(a b c)`，关联数组 `declare -A assoc`
13. **字符串操作**：长度 `${#var}`、提取 `${var:pos:len}`、替换 `${var/old/new}`

## 10.7 本章习题

1. 什么是 Shell？Shell 和 Bash 有什么关系？
2. 定义一个变量 `myvar="Hello"`，然后输出它的值。请用三种不同的方式引用这个变量。
3. 解释 `$?`、`$$`、`$#`、`$@`、`$*` 的含义和区别。
4. 编写一个脚本，接受两个参数，输出它们的和。如果没有提供参数，使用默认值 0。
5. 解释以下命令的区别：
   - `echo $HOME`
   - `echo "$HOME"`
   - `echo '$HOME'`
   - `echo \$HOME`
6. 如何将一个命令的输出保存到文件？如何追加到文件？如何将错误信息也保存到文件？
7. 解释 `command1 && command2 || command3` 的执行逻辑。这种写法有什么潜在问题？
8. 使用管道组合命令，找出当前目录下占用空间最大的5个文件。
9. 编写一个脚本，从 `/etc/passwd` 中提取用户名、UID 和 Shell，按 UID 排序后显示。
10. 解释以下配置文件的作用和加载顺序：`/etc/profile`、`~/.bash_profile`、`~/.bashrc`、`/etc/bash.bashrc`。

## 10.8 参考资料与延伸阅读

- `man bash`
- `man 1 read`
- `man 1 test`
- [Bash Reference Manual](https://www.gnu.org/software/bash/manual/bash.html)
- [Advanced Bash-Scripting Guide](https://tldp.org/LDP/abs/html/)
- [Bash Hackers Wiki](https://wiki.bash-hackers.org/)
- [ShellCheck](https://www.shellcheck.net/) - Shell 脚本静态分析工具

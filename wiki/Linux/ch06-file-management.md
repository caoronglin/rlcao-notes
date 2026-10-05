---
collection:
  profile: wiki
  id: Linux
title: 第六章、Linux 文件与目录管理
date: 2024-01-01
updated: 2024-01-01
tags:
  - Linux
  - 文件管理
  - 目录操作
---

# 第六章、Linux 文件与目录管理

## 6.1 目录与路径

### 目录的相关操作

#### 特殊目录符号

| 符号 | 含义 |
|------|------|
| `.` | 当前目录 |
| `..` | 上级目录 |
| `-` | 上一次所在的目录 |
| `~` | 当前用户的主目录 |
| `~username` | 指定用户的主目录 |

#### 常见目录操作命令

**`cd` - 切换目录**
```bash
cd /etc                      # 切换到绝对路径
cd ../..                     # 切换到上上级目录
cd ~                         # 切换到主目录
cd -                         # 切换到上次所在目录
cd /var/log && pwd           # 组合使用
```

**`pwd` - 显示当前路径**
```bash
pwd                          # 显示逻辑路径（可能包含符号链接）
pwd -P                       # 显示物理路径（解析符号链接）
```

**`mkdir` - 创建目录**
```bash
mkdir dirname                # 创建单个目录
mkdir -p a/b/c/d             # 递归创建多级目录
mkdir -m 700 private         # 创建时指定权限
mkdir dir{1,2,3}             # 创建多个目录（花括号展开）
mkdir -v newdir              # 显示创建过程
```

**`rmdir` - 删除空目录**
```bash
rmdir emptydir               # 删除空目录
rmdir -p a/b/c               # 递归删除空目录
```

**`rm` - 删除文件或目录**
```bash
rm file.txt                  # 删除文件
rm -r directory              # 递归删除目录
rm -rf directory             # 强制递归删除（谨慎使用！）
rm -i file.txt               # 删除前询问
rm -f *.log                  # 强制删除所有log文件
```

### PATH 环境变量

#### 什么是 PATH

**PATH** 是一个环境变量，指定了系统查找可执行程序的目录列表。当你在命令行输入一个命令时，系统会在 PATH 指定的目录中查找对应的程序。

#### 查看 PATH

```bash
echo $PATH                   # 显示PATH值
printenv PATH                # 同上
env | grep PATH              # 在环境变量中查找PATH
```

**PATH 输出示例：**
```
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
```

#### PATH 的搜索顺序

系统按照 PATH 中目录的顺序从左到右搜索命令：

```
/usr/local/sbin → /usr/local/bin → /usr/sbin → /usr/bin → /sbin → /bin → ...
```

**第一个匹配的命令将被执行。**

#### 修改 PATH

**临时修改（当前终端会话）：**
```bash
# 追加目录到PATH
export PATH=$PATH:/new/directory

# 在PATH开头添加目录（优先搜索）
export PATH=/new/directory:$PATH

# 设置全新的PATH
export PATH=/bin:/usr/bin:/usr/local/bin
```

**永久修改（对所有用户）：**
编辑 `/etc/profile` 或 `/etc/environment`：
```bash
sudo nano /etc/profile

# 添加：
export PATH=$PATH:/opt/myapp/bin
```

**永久修改（仅对当前用户）：**
编辑 `~/.bashrc` 或 `~/.profile`：
```bash
nano ~/.bashrc

# 添加：
export PATH=$PATH:$HOME/bin
export PATH=$PATH:$HOME/.local/bin

# 使修改生效
source ~/.bashrc
```

#### 查看命令位置

```bash
which command                # 查找命令的可执行文件路径
which -a command             # 查找所有匹配的路径
whereis command              # 查找命令的二进制、源码和手册位置
whereis -b command           # 只找二进制文件
whatis command               # 显示命令的简短描述
type command                 # 显示命令类型（别名、函数、内置、外部）
type -a command              # 显示所有匹配
```

#### PATH 相关技巧

```bash
# 检查目录是否在PATH中
echo $PATH | grep -q "/my/dir" && echo "存在" || echo "不存在"

# 删除PATH中的某个目录
export PATH=$(echo $PATH | sed 's|/unwanted/dir:||')

# 美化显示PATH（每行一个目录）
echo $PATH | tr ':' '\n'

# 统计PATH中有多少个目录
echo $PATH | tr ':' '\n' | wc -l
```

## 6.2 Linux 文件与目录管理

### 文件与目录的检视：ls

#### ls 命令详解

`ls` (list) 命令用于列出目录内容，是使用最频繁的命令之一。

**基本用法：**
```bash
ls                           # 列出当前目录内容
ls /path/to/directory        # 列出指定目录内容
ls file.txt                  # 显示单个文件信息
ls file1 file2 dir1/         # 列出多个文件/目录
```

#### 常用选项

| 选项 | 全称 | 说明 |
|------|------|------|
| `-l` | long | 使用长列表格式（详细信息） |
| `-a` | all | 显示所有文件，包括隐藏文件（以.开头） |
| `-A` | almost-all | 显示所有文件，但不包括 `.` 和 `..` |
| `-h` | human-readable | 以人类可读的方式显示文件大小（K, M, G） |
| `-d` | directory | 显示目录本身，而不是其内容 |
| `-t` | time | 按修改时间排序（最新的在前） |
| `-r` | reverse | 反向排序 |
| `-S` | size | 按文件大小排序（最大的在前） |
| `-i` | inode | 显示文件的 inode 号 |
| `-R` | recursive | 递归列出子目录内容 |
| `-F` | classify | 在文件名后添加类型指示符（*/=@\|） |
| `--color` |  | 使用颜色区分文件类型 |

#### 组合使用示例

```bash
ls -la                       # 显示所有文件（包括隐藏）的详细信息
ls -lh                       # 以人类可读的方式显示详细信息
ls -ltr                      # 按时间倒序排列（最老的在前）
ls -lS                       # 按文件大小排序（最大的在前）
ls -ld /etc                  # 显示 /etc 目录本身的信息
ls -R /path                  # 递归列出所有子目录
ls -la --color=auto          # 使用颜色显示（通常为默认设置）
ls -i                        # 显示 inode 号
```

#### 输出解析

**`ls -l` 输出格式：**
```
-rwxr-xr-x 1 user group 12345 Jan  1 10:00 filename
│└┬┘└┬┘└┬┘ │  │    │     │    │   │    │
│ │  │  │  │  │    │     │    │   │    └─ 文件名
│ │  │  │  │  │    │     │    │   └────── 时间
│ │  │  │  │  │    │     │    └────────── 日期
│ │  │  │  │  │    │     └─────────────── 文件大小（字节）
│ │  │  │  │  │    └───────────────────── 所属群组
│ │  │  │  │  └────────────────────────── 所有者
│ │  │  │  └───────────────────────────── 硬链接数
│ │  │  └───────────────────────────────── 其他用户权限
│ │  └─────────────────────────────────── 群组权限
│ └────────────────────────────────────── 所有者权限
└──────────────────────────────────────── 文件类型
```

**文件类型标识：**
- `-` 普通文件
- `d` 目录
- `l` 符号链接
- `b` 块设备
- `c` 字符设备
- `s` 套接字
- `p` 管道

#### 实用技巧

**1. 列出最近修改的文件：**
```bash
ls -lt | head -10            # 最近修改的10个文件
ls -ltr | tail -10           # 最早修改的10个文件
```

**2. 按大小排序：**
```bash
ls -lS | head -10            # 最大的10个文件
ls -lSr | head -10           # 最小的10个文件
```

**3. 查找大文件：**
```bash
ls -lhS | grep -E "^-.+[MG]"  # 显示大于1MB的文件
```

**4. 统计文件数量：**
```bash
ls | wc -l                   # 当前目录文件数
ls -a | wc -l                # 包括隐藏文件
ls -l | grep "^-" | wc -l     # 只统计普通文件
ls -l | grep "^d" | wc -l     # 只统计目录
```

**5. 显示文件大小总和：**
```bash
ls -l | awk '{sum+=$5} END {print sum}'           # 字节数
ls -l | awk '{sum+=$5} END {printf "%.2f MB\n", sum/1024/1024}'
```

**6. 查找空文件或空目录：**
```bash
ls -l | grep "^-\s*1\s.*\s0\s"  # 空文件（硬链接数为1，大小为0）
find . -type f -empty              # 更准确的空文件查找
find . -type d -empty              # 空目录
```

**7. 使用通配符列出特定文件：**
```bash
ls *.txt                     # 所有txt文件
ls file?.txt                 # file0.txt, file1.txt 等（单个字符）
ls file[0-9].txt             # file0.txt 到 file9.txt
ls file[!0-9].txt            # 不匹配数字的文件
ls {a,b,c}*.txt              # 以a、b或c开头的txt文件
ls **/*.txt                  # 递归查找所有txt文件（需要启用globstar）
```

**8. 结合其他命令使用：**
```bash
# 查找并删除旧文件
ls -t /path/*.log | tail -n +8 | xargs rm -f

# 打包最近修改的文件
ls -t | head -20 | tar -czf recent.tar.gz -T -

# 复制特定文件到另一目录
ls -d *.txt | xargs -I {} cp {} /backup/
```

### 复制、删除与移动：cp, rm, mv

#### cp (复制)

**基本语法：**
```bash
cp [选项] 源文件 目标文件
cp [选项] 源文件... 目标目录
```

**常用选项：**

| 选项 | 说明 |
|------|------|
| `-a` | 归档模式，保留所有属性（相当于 -dpR） |
| `-d` | 复制符号链接本身，而非指向的文件 |
| `-f` | 强制覆盖 |
| `-i` | 覆盖前询问确认 |
| `-l` | 创建硬链接而非复制 |
| `-p` | 保留文件属性（时间戳、权限、所有者等） |
| `-r` / `-R` | 递归复制目录 |
| `-s` | 创建符号链接 |
| `-u` | 只在源文件比目标文件新或目标不存在时复制 |
| `-v` | 显示详细过程 |

**示例：**
```bash
# 基本复制
cp file.txt /backup/
cp file.txt /backup/newname.txt

# 保留属性
cp -p file.txt /backup/       # 保留时间戳等属性
cp -a dir1/ dir2/             # 归档模式复制整个目录

# 递归复制目录
cp -r /source/dir /destination/
cp -rv /source/dir /destination/  # 显示详细过程

# 覆盖确认
cp -i file.txt /existing/path/  # 覆盖前询问
cp -f file.txt /existing/path/  # 强制覆盖

# 条件复制
cp -u /source/file /destination/  # 只复制更新的文件

# 复制多个文件
cp file1 file2 file3 /destination/
cp *.txt /backup/

# 复制时显示进度（使用 pv 命令）
pv source.iso | cp /dev/stdin /dest/backup.iso
```

#### rm (删除)

**基本语法：**
```bash
rm [选项] 文件...
```

**常用选项：**

| 选项 | 说明 |
|------|------|
| `-f` | 强制删除，不提示 |
| `-i` | 删除前询问确认 |
| `-r` / `-R` | 递归删除目录及其内容 |
| `-v` | 显示详细过程 |
| `--preserve-root` | 不允许删除根目录（默认） |
| `--no-preserve-root` | 允许删除根目录（极度危险！） |

**示例：**
```bash
# 删除文件
rm file.txt
rm file1 file2 file3

# 删除前确认
rm -i file.txt

# 强制删除（不提示）
rm -f file.txt

# 删除目录
rm -r directory/
rm -rf directory/            # 强制递归删除（谨慎使用！）

# 显示删除过程
rm -rv directory/

# 删除特定类型的文件
rm *.log
rm -rf /tmp/*.tmp

# 安全删除（覆盖后删除）
shred -u file.txt            # 覆盖后删除（更安全）

# 删除空目录
find /path -type d -empty -delete

# 删除 N 天前的文件
find /path -name "*.log" -mtime +30 -delete
```

⚠️ **极度危险命令（永远不要执行）：**
```bash
rm -rf /                     # 删除整个系统！
rm -rf /*                    # 同上
rm -rf ~                     # 删除主目录
rm -rf .                     # 删除当前目录
rm -rf .*                    # 删除所有隐藏文件和上级目录
```

#### mv (移动/重命名)

**基本语法：**
```bash
mv [选项] 源文件 目标文件    # 重命名或移动单个文件
mv [选项] 源文件... 目标目录  # 移动多个文件到目录
```

**常用选项：**

| 选项 | 说明 |
|------|------|
| `-f` | 强制覆盖，不提示 |
| `-i` | 覆盖前询问确认 |
| `-n` | 不覆盖已存在的文件 |
| `-u` | 只在源文件比目标文件新或目标不存在时移动 |
| `-v` | 显示详细过程 |
| `--backup` | 覆盖前创建备份 |
| `--suffix` | 指定备份文件的后缀 |

**示例：**
```bash
# 重命名文件
mv oldname.txt newname.txt

# 移动文件
mv file.txt /destination/
mv file.txt /destination/newname.txt

# 移动多个文件
mv file1 file2 file3 /destination/
mv *.txt /backup/

# 移动目录
mv old_dir/ /new/location/
mv old_dir/ /new/location/new_name/

# 覆盖确认
mv -i file.txt /existing/
mv -f file.txt /existing/    # 强制覆盖

# 条件移动（只移动更新的文件）
mv -u /source/file /destination/

# 显示详细过程
mv -v file.txt /destination/

# 安全移动（备份已存在的文件）
mv --backup=numbered file.txt /existing/
mv --suffix=.bak file.txt /existing/

# 交互式移动（不覆盖）
mv -n file.txt /existing/
```

### 文件内容查阅

#### 直接检视文件内容

**`cat` (concatenate)**

将文件内容输出到标准输出（屏幕）。

```bash
cat file.txt                 # 显示文件内容
cat -n file.txt              # 显示行号
cat -A file.txt              # 显示特殊字符（$行尾，^I制表符）
cat -b file.txt              # 对非空行编号
cat -E file.txt              # 在行尾显示$
cat -T file.txt              # 将制表符显示为^I
cat file1 file2              # 连接多个文件
cat file1 file2 > file3      # 合并文件到新文件
cat > file.txt               # 创建文件并输入内容（Ctrl+D结束）
cat >> file.txt              # 追加内容到文件
```

⚠️ **注意**：`cat` 适合查看小文件，大文件应该使用 `less` 或 `more`。

**`tac`**

反向输出文件内容（从最后一行开始）。

```bash
tac file.txt                 # 反向显示文件内容（最后一行在前）
tac file.txt > reversed.txt  # 保存反向内容到新文件
```

**`nl` (number lines)**

添加行号显示文件内容，比 `cat -n` 更灵活。

```bash
nl file.txt                  # 显示文件并添加行号（非空行）
nl -b a file.txt             # 所有行都编号（包括空行）
nl -b t file.txt             # 只对非空行编号（默认）
nl -b pBRE file.txt          # 对匹配正则表达式的行编号
nl -n ln file.txt            # 行号左对齐（默认）
nl -n rn file.txt            # 行号右对齐
nl -n rz file.txt            # 行号右对齐并补零
nl -w 5 file.txt             # 设置行号宽度为5位
nl -s ". " file.txt           # 设置分隔符为". "
nl -v 10 file.txt            # 行号从10开始
nl -i 2 file.txt             # 行号每次增加2
```

**`more`**

分页显示文件内容，适合查看大文件。

```bash
more file.txt                # 分页显示文件
more +10 file.txt            # 从第10行开始显示
more -10 file.txt            # 每屏显示10行
ls -la | more                # 管道结合使用
cat file.txt | more          # 分页显示
```

**在 more 中的操作：**
- `空格` - 下一页
- `Enter` - 下一行
- `b` - 上一页
- `/pattern` - 搜索
- `q` - 退出
- `=` - 显示当前行号

⚠️ **注意**：`more` 不能向前翻页（只能用 `b`），现在一般使用 `less`。

**`less`** (推荐)

更强大的分页显示工具，比 `more` 功能更丰富。

```bash
less file.txt                # 分页显示文件
less +10 file.txt            # 从第10行开始
less -N file.txt             # 显示行号
less -S file.txt             # 不换行，可左右滚动
less -i file.txt             # 搜索时忽略大小写
less +F file.txt             # 实时监控文件变化（类似tail -f）
ls -la | less                # 管道结合使用
```

**在 less 中的操作：**

| 按键 | 功能 |
|------|------|
| `↓` / `Enter` / `e` / `j` | 向下滚动一行 |
| `↑` / `y` / `k` | 向上滚动一行 |
| `空格` / `Page Down` / `f` | 向下翻页 |
| `b` / `Page Up` | 向上翻页 |
| `d` | 向下翻半页 |
| `u` | 向上翻半页 |
| `→` / `←` | 水平滚动（当使用 -S 时） |
| `g` / `<` / `Home` | 跳转到文件开头 |
| `G` / `>` / `End` | 跳转到文件结尾 |
| `= / Ctrl+G` | 显示当前位置信息 |
| `/pattern` | 向下搜索 |
| `?pattern` | 向上搜索 |
| `n` | 跳到下一个匹配 |
| `N` | 跳到上一个匹配 |
| `&pattern` | 只显示匹配的行 |
| `:` | 进入命令模式 |
| `-N` | 切换行号显示 |
| `q` | 退出 |
| `Q` | 退出，不保存标记 |
| `h` | 显示帮助 |

**less 的高级用法：**
```bash
# 同时查看多个文件
less file1.txt file2.txt file3.txt
# 在less中：
# :n - 下一个文件
# :p - 上一个文件
# :e file.txt - 打开新文件

# 标记位置
# m + 字母（如 ma）- 标记当前位置
# ' + 字母（如 'a）- 跳转到标记

# 过滤内容
# &pattern - 只显示匹配的行
# & - 取消过滤

# 编辑文件
# v - 用默认编辑器编辑文件
```

#### head 和 tail

**`head`** - 显示文件开头部分

```bash
head file.txt                # 显示前10行（默认）
head -n 20 file.txt          # 显示前20行
head -20 file.txt            # 同上（简写）
head -c 100 file.txt         # 显示前100字节
head -n -5 file.txt          # 显示除了最后5行的所有行
```

**`tail`** - 显示文件结尾部分

```bash
tail file.txt                # 显示后10行（默认）
tail -n 20 file.txt          # 显示后20行
tail -20 file.txt            # 同上（简写）
tail -c 100 file.txt         # 显示后100字节
tail -n +5 file.txt          # 从第5行开始显示到末尾
tail -f file.txt             # 实时追踪文件更新（常用！）
tail -F file.txt             # 追踪文件，即使文件被重命名或删除也会重试
```

**`tail -f` 的典型用法：**
```bash
# 实时监控日志文件
tail -f /var/log/syslog
tail -f /var/log/nginx/access.log
tail -f /var/log/apache2/error.log

# 监控多个日志文件
tail -f /var/log/syslog /var/log/auth.log

# 结合grep过滤
tail -f /var/log/nginx/access.log | grep "500"

# 后台运行
nohup tail -f /var/log/app.log &
```

**head 和 tail 的组合使用：**
```bash
# 显示第10行
head -10 file.txt | tail -1

# 显示第10到20行
head -20 file.txt | tail -11

# 显示中间某部分（使用sed更方便）
sed -n '10,20p' file.txt
```

### 文件查找：find

`find` 命令是在目录层次结构中搜索文件的强大工具。

#### 基本语法

```bash
find [搜索路径] [表达式]
```

**默认行为：**
- 如果不指定路径，使用当前目录 `.`
- 递归搜索所有子目录

#### 按名称查找

```bash
# 按精确名称查找
find /path -name "file.txt"

# 忽略大小写
find /path -iname "File.txt"  # 匹配 file.txt, FILE.TXT, File.txt 等

# 使用通配符（需要引号）
find /path -name "*.txt"       # 所有txt文件
find /path -name "file?.txt"  # file0.txt, file1.txt 等
find /path -name "[ab]*"      # 以a或b开头的文件

# 排除特定名称
find /path ! -name "*.tmp"     # 排除.tmp文件
find /path -not -name "*.log"  # 排除.log文件

# 正则表达式
find /path -regex ".*/file[0-9]+\.txt"
find /path -iregex ".*\.jpg"  # 忽略大小写
```

#### 按类型查找

```bash
# 文件类型
find /path -type f             # 普通文件
find /path -type d             # 目录
find /path -type l             # 符号链接
find /path -type b             # 块设备
find /path -type c             # 字符设备
find /path -type s             # 套接字
find /path -type p             # 管道

# 组合条件
find /path -type f -name "*.log"  # 所有log文件
find /path -type d -name "test*"  # 以test开头的目录
```

#### 按大小查找

```bash
# 按文件大小
find /path -size 10c           # 正好10字节
find /path -size 10k           # 正好10KB
find /path -size 10M           # 正好10MB
find /path -size 10G           # 正好10GB

# 大小范围
find /path -size +10M          # 大于10MB
find /path -size -10M          # 小于10MB
find /path -size +1M -size -10M  # 1MB到10MB之间

# 组合
find /path -type f -size +100M  # 大于100MB的文件
find /path -type f -size +1G -exec ls -lh {} \;  # 显示大于1GB的文件
```

#### 按时间查找

```bash
# 访问时间（access）
find /path -atime 7            # 正好7天前访问过
find /path -atime +7           # 超过7天前访问过（7天前以上）
find /path -atime -7           # 最近7天内访问过
find /path -amin +60           # 超过60分钟前访问过

# 修改时间（modify）
find /path -mtime 7            # 正好7天前修改过
find /path -mtime +7           # 超过7天前修改过
find /path -mtime -7           # 最近7天内修改过
find /path -mmin -30           # 最近30分钟内修改过

# 状态改变时间（change）
find /path -ctime 7            # 正好7天前状态改变
find /path -ctime +7           # 超过7天前状态改变
find /path -ctime -7           # 最近7天内状态改变

# 空文件或目录
find /path -empty              # 空文件或空目录
find /path -type f -empty      # 空文件
find /path -type d -empty      # 空目录

# 组合使用
find /path -type f -mtime +30 -size +100M  # 30天前修改且大于100MB
find /path -type f -atime +365  # 1年以上未访问的文件
```

#### 按用户和群组查找

```bash
# 按所有者
find /path -user username      # 属于指定用户的文件
find /path -uid 1000           # 属于指定UID的文件
find /path ! -user root        # 不属于root的文件

# 按群组
find /path -group groupname    # 属于指定群组的文件
find /path -gid 1000           # 属于指定GID的文件

# 无用户或无群组
find /path -nouser             # 没有用户的文件（删除用户后遗留）
find /path -nogroup            # 没有群组的文件

# 组合
find /path -user alice -group developers  # 特定用户和群组
```

#### 按权限查找

```bash
# 精确权限匹配
find /path -perm 644           # 权限正好是644的文件
find /path -perm /u=s          # 有SUID位的文件
find /path -perm /g=s          # 有SGID位的文件
find /path -perm /o=t          # 有粘滞位的文件

# 任意权限位（/）
find /path -perm /222          # 任何人有写权限（2=写）
find /path -perm /111          # 任何人有执行权限

# 所有权限位必须匹配（-）
find /path -perm -444          # 所有人至少有读权限
find /path -perm -755          # 至少755权限

# SUID/SGID/SBIT
find /path -perm -4000         # 有SUID位的文件
find /path -perm -2000         # 有SGID位的文件
find /path -perm -1000         # 有粘滞位的目录
find /path -perm /6000         # 有SUID或SGID位的文件

# 查找所有特殊权限文件
find / -perm /6000 -type f 2>/dev/null
```

#### 对找到的文件执行操作

**`-exec` 选项：**

```bash
# 基本语法
find /path -name "*.log" -exec rm {} \;
# {} 代表找到的文件
# \; 表示命令结束

# 示例：删除30天前的日志
find /var/log -name "*.log" -mtime +30 -exec rm {} \;

# 示例：修改权限
find /path -type f -exec chmod 644 {} \;
find /path -type d -exec chmod 755 {} \;

# 示例：复制文件
find /source -name "*.txt" -exec cp {} /backup/ \;

# 示例：移动文件
find /source -name "*.tmp" -exec mv {} /tmp/ \;

# 示例：重命名（使用-exec限制较多，通常使用管道+xargs或-find的-printf+sh）
find /path -name "*.txt" -exec mv {} {}.bak \;
```

**`-exec ... +` 选项（更高效）：**

```bash
# 将多个文件作为参数一次性传递给命令（类似xargs）
find /path -name "*.txt" -exec rm {} +
# 等效于: rm file1.txt file2.txt file3.txt...

# 示例：统计多个文件的总行数
find . -name "*.py" -exec wc -l {} +

# 示例：计算总大小
find /path -type f -exec du -ch {} + | grep total
```

**`-ok` 选项（交互式）：**

```bash
# 对每个文件执行命令前询问确认
find /path -name "*.log" -ok rm {} \;
# 会提示: "rm ...?"  输入y确认，n跳过

# 适用于危险操作前的确认
find /path -type f -ok chmod 600 {} \;
```

#### 结合管道和 xargs

对于复杂的操作，可以将 find 的结果通过管道传递给 xargs 或其他命令：

```bash
# 基本用法
find /path -name "*.log" | xargs rm

# 处理文件名中有空格的情况
find /path -name "*.log" -print0 | xargs -0 rm

# 限制每次处理的参数数量
find /path -name "*.txt" | xargs -n 10 -I {} cp {} /backup/

# 结合其他命令
find /path -name "*.py" | xargs grep "import"
find /path -type f | xargs du -h | sort -h

# 使用 -exec 和管道的组合
find /path -name "*.log" -exec ls -lh {} \; | awk '{print $5, $9}'
```

#### find 的优化技巧

```bash
# 1. 限制搜索深度
find /path -maxdepth 2 -name "*.txt"
find /path -mindepth 2 -name "*.txt"

# 2. 排除某些目录
find /path -name "/path/to/exclude" -prune -o -name "*.txt" -print

# 3. 使用 -xdev 不跨越文件系统
find / -xdev -name "*.txt"    # 只在当前文件系统搜索

# 4. 先搜索文件名再执行操作（效率更高）
find /path -name "*.log" -mtime +30 -delete

# 5. 使用 -ls 代替 -exec ls（更快）
find /path -name "*.txt" -ls

# 6. 并行处理（使用 GNU parallel）
find /path -name "*.txt" | parallel -j 4 gzip
```

#### 实用 find 命令合集

```bash
# ===== 文件清理 =====

# 删除空文件
find /path -type f -empty -delete

# 删除空目录
find /path -type d -empty -delete

# 删除N天前的文件
find /path -mtime +30 -type f -delete

# 删除大文件（超过1GB）
find /path -size +1G -type f -delete

# ===== 权限修复 =====

# 批量修改文件权限
find /path -type f -exec chmod 644 {} \;
find /path -type d -exec chmod 755 {} \;

# 修复用户/群组
find /path -user olduser -exec chown newuser {} \;
find /path -group oldgroup -exec chgrp newgroup {} \;

# ===== 查找特定文件 =====

# 查找最近修改的文件
find /path -mtime -1 -type f

# 查找最大的文件
find /path -type f -exec ls -lh {} \; | sort -k5 -rh | head

# 查找重复文件（按MD5）
find /path -type f -exec md5sum {} \; | sort | uniq -d -w32

# ===== 批量操作 =====

# 批量重命名（删除特定后缀）
find /path -name "*.bak" -exec rename 's/\.bak$//' {} \;

# 批量压缩
find /path -name "*.log" -exec gzip {} \;

# 批量转换编码
find /path -name "*.txt" -exec iconv -f GBK -t UTF-8 -o {}.utf8 {} \;

# 批量图片处理
find /path -name "*.jpg" -exec convert {} -resize 800x600 {}.small.jpg \;
```

### 本章重点总结

1. **目录操作**：cd, pwd, mkdir, rmdir, rm
2. **文件操作**：cp, mv, rm
3. **内容查看**：cat, tac, nl, more, less, head, tail
4. **文件查找**：find（按名称、类型、大小、时间、权限、用户等）
5. **执行操作**：-exec, -ok, xargs
6. **PATH 环境变量**：系统查找命令的路径列表

### 练习题

1. 如何在目录树中快速切换？写出5种cd的用法。
2. 如何创建多级目录结构？如何同时创建多个目录？
3. 解释 `rm -rf` 的危险性。如何安全地删除文件？
4. 大文件应该用什么命令查看？如何实时监控日志文件？
5. 编写 find 命令：
   - 查找 /var/log 中7天前的日志文件
   - 查找当前目录下大于100MB的文件
   - 查找 /home 中不属于任何用户的文件
   - 查找所有设置了SUID位的文件
6. 如何为自定义脚本添加执行权限并添加到PATH？
7. 使用 `find` 和 `tar` 组合备份最近修改的文件。

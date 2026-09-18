# HPC使用指南(部分)

## $ssh$欢迎banner

>登录$ssh$的提示  

---

```shell
Welcome to Ubuntu 26.04 LTS (GNU/Linux 7.0.0-15-generic x86_64)
================================================================================
  Welcome, T25ronglin! Time: 2026-06-04 17:48:04 CST

  System     : Uptime  7d 19h 0m              | Sessions 0
  Network    : Local   10.133.20.92           | Remote   100.77.182.76
  Load       : Usage   18.9%                  | Queue    18.17 / 15.47 / 14.08
  Resources  : Memory  27.7G/1003.1G (2%)     | Disk     256.5G/500.0G (51%)
  CGroup     : CPU     Max                    | Memory   Max
  Traffic    : Down    6.1T                   | Up       194.5G
  Processes  : Running 1/96                   | Peak     bwa(1581.0%)
  Alerts     : All core metrics are within thresholds
================================================================================
Last login: Thu Jun  4 17:40:50 2026 from 10.115.125.62
```

---

## 终端选择

### 介绍

|**特性**|**Bash (Bourne Again Shell)**|**Zsh (Z Shell)**|**Fish (Friendly Interactive Shell)**|
|---|---|---|---|
|**普及度**|极高，绝大多数 Linux 发行版的默认 Shell。|高，macOS 默认，Linux 下极受欢迎的替代品。|中等，以追求极致开箱即用体验的用户为主。|
|**POSIX 兼容性**|完全兼容。|极高，基本兼容绝大多数 Bash 脚本。|**不兼容**。采用自有语法，无法直接运行标准 Bash 脚本。|
|**开箱即用体验**|极简，无自动补全或语法高亮，需手动配置。|较差，原生状态与 Bash 类似，但可通过框架（如 Oh My Zsh）实现极强定制。|**极佳**，自带强大的语法高亮、基于历史记录的自动建议。|
|**扩展性**|弱，脚本配置繁琐。|极强，拥有庞大的插件生态。|中等，插件系统较为封闭，但自带功能已满足多数需求。|

### 安装

#### $zsh$

---

```shell
chsh -s $(which zsh)
```

---

#### $fish$

---

```shell
chsh -s $(which fish)
```

---

## 安装conda/mamba

>mamba是用C重写的conda，比conda更好用，推荐使用mamba进行环境管理

## 安装

### $conda$

---

```shell
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
source ~/.bashrc conda --version
```

---

## $mamba$

---

```shell
# 第一步：下载安装脚本
wget "https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh"

# 第二步：运行安装脚本
# -b 表示静默安装（batch），不需要你手动一路按回车同意
# -p 表示安装路径（prefix），这里指定安装到你的用户主目录下
bash Miniforge3-Linux-x86_64.sh -b -p $HOME/.miniforge3

# 第三步：初始化 conda，使其与你的 bash/zsh 终端集成
$HOME/miniforge3/bin/mamba shell init

# 第四步：让环境变量生效（或者你也可以关闭当前终端并重新打开）
source ~/.bashrc
```

---

## 推荐配置

---

```shell
channels:
  - conda-forge
  - bioconda
  - defaults
channel_priority: strict
show_channel_urls: true
default_channels:
  - https://mirrors.ustc.edu.cn/anaconda/pkgs/main
  - https://mirrors.ustc.edu.cn/anaconda/pkgs/r
  - https://mirrors.ustc.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirrors.ustc.edu.cn/anaconda/cloud
  pytorch: https://mirrors.ustc.edu.cn/anaconda/cloud
  bioconda: https://mirrors.ustc.edu.cn/anaconda/cloud/bioconda
```

### 基础命令

#### 创建环境

```shell
mamba create -n 环境名
```

#### 删除环境

```shell
mamba env remove -n 环境名
```

##### 更新环境

```shell
mamba update --all
```

---

## 垃圾清理

>在数据分析的时候难免产生过多垃圾，可使用清理

---

```shell
ncdu
# 按q退出
```

----

![[Pasted image 20260604174927.png]]

>详细参数

---

```shell
ncdu <options> <directory>

Mode selection:
  -h, --help                 This help message
  -v, -V, --version          Print version
  -f FILE                    Import scanned directory from FILE
  -o FILE                    Export scanned directory to FILE in JSON format
  -e, --extended             Enable extended information
  --ignore-config            Don't load config files

Scan options:
  -x, --one-file-system      Stay on the same filesystem
  --exclude PATTERN          Exclude files that match PATTERN
  -X, --exclude-from FILE    Exclude files that match any pattern in FILE
  --exclude-caches           Exclude directories containing CACHEDIR.TAG
  -L, --follow-symlinks      Follow symbolic links (excluding directories)
  --exclude-kernfs           Exclude Linux pseudo filesystems (procfs,sysfs,cgroup,...)

Interface options:
  -0, -1, -2                 UI to use when scanning (0=none,2=full ncurses)
  -q, --slow-ui-updates      "Quiet" mode, refresh interval 2 seconds
  --enable-shell             Enable/disable shell spawning feature
  --enable-delete            Enable/disable file deletion feature
  --enable-refresh           Enable/disable directory refresh feature
  -r                         Read only (--disable-delete)
  -rr                        Read only++ (--disable-delete & --disable-shell)
  --si                       Use base 10 (SI) prefixes instead of base 2
  --apparent-size            Show apparent size instead of disk usage by default
  --hide-hidden              Hide "hidden" or excluded files by default
  --show-itemcount           Show item count column by default
  --show-mtime               Show mtime column by default (requires `-e`)
  --show-graph               Show graph column by default
  --show-percent             Show percent column by default
  --graph-style STYLE        hash / half-block / eighth-block
  --sort COLUMN-(asc/desc)   disk-usage / name / apparent-size / itemcount / mtime
  --enable-natsort           Use natural order when sorting by name
  --group-directories-first  Sort directories before files
  --confirm-quit             Ask confirmation before quitting ncdu
  --no-confirm-delete        Don't ask confirmation before deletion
  --color SCHEME             off / dark / dark-bg
```

---

## 文件查看

### $cat$

>一次性将文件全部内容输出到屏幕上。适合查看**短小文件**

#### 常见用法

---

```shell
cat filename
cat -n filename [[输出行号]]
```

---

### $less$

>一页一页查看文件内容，支持上下翻页和搜索关键字。**最推荐用于长文件**。

#### 常见用法

----

```shell
less filename
# 进入后
# /关键字 -线下搜索
# 空格键  -向下翻页
# PageUp -向上翻页
# q      -退出
```

----

### $more$

>与 `less` 类似，但功能较受限，**只能向下翻页**（不支持向上）。分页查看，只能向后翻页

#### 常见用法

---

```shell
more filename           # 分页查看
#   空格键   - 向下翻页
#   q        - 退出
#   /关键字  - 搜索
```

---

### $head$

>查看文件开头部分，默认显示文件**开头10行**，可通过 `-n` 参数自定义行数。

#### 常见用法

---

```shell
head filename            # 显示前10行
head -n 20 filename      # 显示前20行
```

---

### $tail$

>查看文件结尾部分，默认显示文件**最后10行**。特别适合查看日志文件的最新记录。

#### 常见用法

---

```shell
tail filename            # 显示最后10行
tail -n 5 filename       # 显示最后5行
tail -f filename         # 实时追踪文件新增内容（常用于监控日志）
```

---

### $grep$

>按模式搜索文件内容，**不是查看全文**，而是根据关键字或正则表达式打印匹配的行。是生信中最常用的文件内容搜索命令。

#### 常见用法

```shell
grep "pattern" filename     # 搜索包含 pattern 的行
grep -i "pattern" filename  # 忽略大小写
grep -v "pattern" filename  # 显示不包含 pattern 的行
grep -c "pattern" filename  # 统计匹配行数
```

---

### 对比

| 命令     | 适用场景      | 特点            |
| ------ | --------- | ------------- |
| `cat`  | 极短文件      | 全部输出，无法暂停     |
| `less` | 长文件（推荐）   | 双向翻页、搜索、高效    |
| `more` | 长文件（基础）   | 仅向下翻页         |
| `head` | 只看开头      | 默认10行         |
| `tail` | 只看结尾/实时监控 | 默认10行，支持 `-f` |
| `grep` | 搜索关键字行    | 按模式匹配，支持正则    |

## 后台运行命令

### $nohup$

>忽略挂断信号执行命令

| 特性       | 说明                                                                     |
| -------- | ---------------------------------------------------------------------- |
| **工作原理** | 在终端关闭或网络断开时，系统会向进程发送 `SIGHUP`（挂断信号）。`nohup` 的作用是**捕获并忽略**这个信号，使进程继续运行。 |
| **基本语法** | `$ nohup program1 > output.txt &`                                      |
| **日志管理** | 默认会将标准输出保存在当前目录的 `nohup.out` 文件中；如果重定向了输出则保存在指定文件。                     |
| **进程控制** | 命令执行后会返回 PID，用户只能通过 PID 来**监控或终止**该进程。                                 |
| **使用场景** | 适合**单个简单命令**需要长时间运行且不关心交互的情况。                                          |

### $screen$

>终端多路复用器（经典工具）

| 特性      | 说明                                                 |
| ------- | -------------------------------------------------- |
| **本质**  | 终端复用器（Terminal Multiplexer），能创建**多个虚拟终端会话**。       |
| **持久化** | 会**话内的窗口和进程**与物理终端分离，即使断开连接，进程在后台持续运行，下次可**重新连接**。 |
| **多窗口** | 单个会话内可创建多个窗口，每个窗口独立运行命令。                           |

### $tmux$

>现代终端多路复用器

|特性|说明|
|---|---|
|**本质**|与 screen 一样是终端复用器，但**更现代、更活跃开发**，拥有更多功能。|
|**持久化**|会话在后台持久存在，**即使 SSH 断开或关闭终端，都可通过重新连接恢复**，所有窗口及其进程保持不变。|
|**多窗口 - 多面板**|不仅支持多个窗口（windows），还支持在窗口内**垂直/水平分割面板（panes）**。|
|**配置增强**|可通过 `~/.tmux.conf` 文件自定义行为（例如将默认前缀键由 `Ctrl-b` 改为 `Ctrl-a`）。|

>**注意**：每一个TMUX都是一个新的线程，建议少用

#### 基本命令

```shell
tmux new-session -s my_project   # 创建一个名为 my_project 的会话
tmux list-sessions               # 列出所有会话，如：my_project: 1 windows
tmux attach -t my_project        # 重新连接到 my_project 会话
tmux attach -d -t my_project     # 强制分离其他连接并重新连接
```

#### 基本快捷键

|快捷键|功能|
|---|---|
|`Ctrl-a d`|分离当前会话|
|`Ctrl-a c`|创建新窗口|
|`Ctrl-a n / p`|切换到下/上一个窗口|
|`Ctrl-a ?`|列出所有快捷键|

### 对比

|维度|nohup|screen|tmux|
|---|---|---|---|
|**主要目的**|防止命令被终端关闭中断|保持会话持久化 + 多窗口|保持会话持久化 + 多窗口 + 面板|
|**工作原理**|捕获忽略 `SIGHUP` 信号|创建守护进程管理虚拟终端|创建守护进程管理虚拟终端|
|**交互性**|非交互（运行后只能被终止）|交互（可分离、重连、操作）|交互（可分离、重连、操作）|
|**窗口管理**|无|多窗口，窗口内单面板|多窗口，每个窗口可**分割多个面板**|
|**配置灵活性**|无|有限|丰富的配置和插件支持|
|**参考资料推荐度**|简单任务|推荐（与 tmux 并列）|**重点推荐**（资料大篇幅覆盖）|
|**适用场景**|一个命令在后台跑完即可|需要多个工作环境并持久化|复杂项目开发、多维分析流程管理|

## 公共数据下载

### 使用$NGDC$

>国内镜像，速度快，SRA推荐使用

```bash
#!/bin/bash
# 下载 NGDC (BIG 镜像) 的 SRA 数据，并转换为适合入库的格式
# SRR 号列表文件
list_file="srr_list.txt"
# 并行任务数
parallel=2
[[最大重试次数]]
max_retries=3
# 错误日志
error_log="download_errors.log"
# 清空旧日志
> "$error_log"
download_one() {
    srr="$1"    url="ftp://download2.big.ac.cn/INSDC5/SRA/${srr:3:5}/${srr:0:7}/${srr}/${srr}.sra"
    echo "开始下载: $srr -> $url"a
    for ((i=1; i<=max_retries; i++)); do
        if aria2c -s 16 -x 2 "$url"; then
            echo "下载成功: $srr"
            return 0
        else
            echo "第 $i 次失败: $srr"
            sleep 5
        fi
    done
    echo "最终失败: $srr" >> "$error_log"
    return 1
}
export -f download_one
export max_retries error_log 
# 使用 xargs 并行执行（跳过空行）
grep -v '^$' "$list_file" | xargs -n 1 -P "$parallel" -I {} bash -c 'download_one "$@"' _ {}
```

### 使用$AWS$

```bash
#!/bin/bash
# SRR号列表文件
list_file="srr_list.txt"
# 并行任务数
parallel=4
# 最大重试次数
max_retries=3
# 错误日志
error_log="download_errors.log"
# 清空旧日志
> "$error_log"
download_one() {
    srr="$1"
    url="https://sra-pub-run-odp.s3.amazonaws.com/sra/$srr/$srr"
    echo "开始下载: $srr -> $url"
    for ((i=1; i<=max_retries; i++)); do
        if wget -c -t 0 "$url"; then
            echo "下载成功: $srr"
            return 0
        else
            echo "第 $i 次失败: $srr"
            sleep 5
        fi
    done
    echo "最终失败: $srr" >> "$error_log"
    return 1
}
export -f download_one
export max_retries error_log
# 使用 xargs 并行执行

cat "$list_file" | grep -v '^$' | xargs -n 1 -P "$parallel" -I {} bash -c 'download_one "$@"' _ {}
```

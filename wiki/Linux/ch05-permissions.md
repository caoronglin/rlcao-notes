---
collection:
  profile: wiki
  id: Linux
title: 第五章、Linux 的文件权限与目录配置
date: 2024-01-01
updated: 2024-01-01
tags:
  - Linux
  - 文件权限
  - 用户管理
---

# 第五章、Linux 的文件权限与目录配置

## 5.1 使用者与群组

### Linux 的多用户多任务

Linux 是一个**多用户、多任务**的操作系统：
- **多用户**：多个用户可以同时使用系统
- **多任务**：系统可以同时运行多个程序

### 三种身份

Linux 系统中的每个文件都有三种身份：

| 身份 | 说明 |
|------|------|
| **user (u)** | 文件所有者（owner） |
| **group (g)** | 文件所属群组 |
| **others (o)** | 其他人（非所有者且非群组成员） |

**特殊身份：**
- **root**：超级管理员，拥有系统最高权限，不受权限限制

### 使用者与群组的关系

```
系统使用者
├── root (超级管理员)
├── user1 (属于 groups: users, developers)
├── user2 (属于 groups: users, designers)
└── user3 (属于 groups: users)
```

**一个用户可以属于多个群组**，但只有一个**主要群组**（primary group）。

### 查看用户信息

```bash
whoami                       # 显示当前用户名
id                           # 显示当前用户的UID、GID和所属群组
id username                  # 显示指定用户的信息
who                          # 显示当前登录的用户
w                            # 显示登录用户及其活动
users                        # 显示用户名列表
last                         # 显示最近登录记录
lastlog                      # 显示所有用户的最后登录时间
finger username              # 显示用户信息（需安装finger包）
```

**id 命令输出示例：**
```bash
$ id
uid=1000(username) gid=1000(username) groups=1000(username),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),120(lpadmin),131(lxd),132(sambashare)
```

**输出说明：**
- **uid**：用户ID
- **gid**：主要群组ID
- **groups**：所属的所有群组

## 5.2 Linux 文件权限概念

### 查看文件权限

使用 `ls -l` 命令查看文件权限：

```bash
ls -l filename
ls -la                       # 查看所有文件（包括隐藏文件）
ls -ld directory             # 查看目录本身的信息（而非内容）
```

**输出示例：**
```bash
$ ls -l
-rw-r--r-- 1 user group 1234 Jan  1 10:00 file.txt
drwxr-xr-x 2 user group 4096 Jan  1 09:00 directory/
lrwxrwxrwx 1 user group   11 Jan  1 08:00 link -> /path/to/target
```

### 权限字符串解析

权限字符串共 10 个字符：

```
-rwxr-xr-x
│└┬┘└┬┘└┬┘
│ │  │  │
│ │  │  └── 其他人(others)的权限
│ │  └───── 群组(group)的权限
│ └──────── 所有者(user)的权限
└────────── 文件类型
```

#### 第1位：文件类型

| 符号 | 类型 |
|------|------|
| `-` | 普通文件 |
| `d` | 目录 |
| `l` | 符号链接（软链接） |
| `b` | 块设备文件（如硬盘） |
| `c` | 字符设备文件（如键盘） |
| `s` | 套接字文件 |
| `p` | 管道文件 |

#### 第2-10位：权限

每组3个字符，共3组：

| 位置 | 含义 | 字符 |
|------|------|------|
| r | 读权限 | 可读（文件内容/目录列表） |
| w | 写权限 | 可写（修改文件/创建删除目录内容） |
| x | 执行权限 | 可执行（运行程序/进入目录） |
| - | 无权限 | 该权限未授予 |

### 权限的具体含义

#### 文件权限

| 权限 | 对文件的作用 |
|------|--------------|
| **r (读)** | 可以读取文件内容（cat, less, 打开） |
| **w (写)** | 可以修改文件内容（编辑、覆盖、追加） |
| **x (执行)** | 可以将文件作为程序运行（./script.sh） |

#### 目录权限

| 权限 | 对目录的作用 |
|------|--------------|
| **r (读)** | 可以列出目录内容（ls） |
| **w (写)** | 可以在目录中创建、删除、重命名文件 |
| **x (执行)** | 可以进入目录（cd），访问目录中的文件 |

⚠️ **重要说明：**
- 对目录有 **w** 权限，就可以删除目录中的任何文件，即使对该文件没有权限！
- 要访问目录中的文件，需要对目录有 **x** 权限

### 修改文件权限：chmod

`chmod` 命令用于修改文件或目录的权限。

#### 符号模式

```bash
chmod [ugoa][+-=][rwx] file

# 用户类别
u = user (所有者)
g = group (群组)
o = others (其他人)
a = all (所有人，相当于 ugo)

# 操作
+ = 添加权限
- = 移除权限
= = 设置权限（覆盖）

# 权限
r = read (读)
w = write (写)
x = execute (执行)
```

**示例：**
```bash
chmod u+x script.sh          # 给所有者添加执行权限
chmod go-w file.txt          # 移除群组和其他人的写权限
chmod u=rwx,go=rx directory  # 所有者全权限，群组和其他人读+执行
chmod a+r file.txt           # 给所有人添加读权限
chmod a-x script.sh          # 移除所有人的执行权限
chmod u+s program            # 设置 SUID 位
chmod g+s directory          # 设置 SGID 位
chmod +t directory           # 设置粘滞位
```

#### 数字模式（八进制）

权限可以用数字表示：

| 权限 | 数值 | 二进制 |
|------|------|--------|
| r (读) | 4 | 100 |
| w (写) | 2 | 010 |
| x (执行) | 1 | 001 |
| - (无) | 0 | 000 |

**组合值：**

| 数字 | 权限 | 说明 |
|------|------|------|
| 7 | rwx | 读+写+执行 |
| 6 | rw- | 读+写 |
| 5 | r-x | 读+执行 |
| 4 | r-- | 只读 |
| 3 | -wx | 写+执行 |
| 2 | -w- | 只写 |
| 1 | --x | 只执行 |
| 0 | --- | 无权限 |

**语法：**
```bash
chmod XYZ file
# X = 所有者权限
# Y = 群组权限
# Z = 其他人权限
```

**示例：**
```bash
chmod 755 script.sh          # -rwxr-xr-x (所有者全权限，其他读+执行)
chmod 644 file.txt           # -rw-r--r-- (所有者读写，其他只读)
chmod 700 private.key        # -rwx------ (只有所有者可访问)
chmod 777 shared_dir/        # drwxrwxrwx (所有人全权限)
chmod 600 ~/.ssh/id_rsa      # 私钥文件的标准权限
chmod 644 ~/.ssh/id_rsa.pub  # 公钥文件的标准权限
```

**常见文件权限组合：**

| 文件类型 | 权限 | 说明 |
|----------|------|------|
| 普通文件 | 644 (-rw-r--r--) | 普通文档 |
| 可执行脚本 | 755 (-rwxr-xr-x) | 脚本程序 |
| 配置文件 | 600 (-rw-------) | 敏感配置 |
| 日志文件 | 640 (-rw-r-----) | 日志（组可读） |
| 目录 | 755 (drwxr-xr-x) | 普通目录 |
| 共享目录 | 2775 (drwxrwsr-x) | 组共享（SGID） |
| 临时目录 | 1777 (drwxrwxrwt) | 公共可写（粘滞位） |

#### 递归修改权限

对目录及其所有内容修改权限：

```bash
chmod -R 755 directory/      # 递归修改目录及其内容的权限
chmod -R u+w directory/      # 递归添加写权限
chmod -R go-w directory/     # 递归移除组和其他人的写权限
```

⚠️ **警告：** 谨慎使用 `-R` 选项，特别是在系统目录上！

### 修改文件所有者和群组：chown

`chown` 命令用于修改文件或目录的所有者和/或群组。

#### 基本语法

```bash
chown [选项] [所有者][:[群组]] 文件...

# 只改所有者
chown user file

# 只改群组
chown :group file
# 或
chgrp group file

# 同时改所有者和群组
chown user:group file
chown user.group file
```

#### 示例

```bash
chown alice file.txt         # 将文件所有者改为 alice
chown :developers file.txt   # 将文件群组改为 developers
chown alice:developers file.txt  # 同时修改所有者和群组
chown -R alice:alice /home/alice  # 递归修改用户主目录的所有者
chown root:root /etc/passwd  # 恢复系统文件的标准所有者
chown $USER:$USER script.sh   # 使用环境变量设置所有者
```

#### 常用选项

```bash
chown -R user:group dir/      # 递归修改目录及其内容
chown --reference=file1 file2 # 将file2的所有者改为与file1相同
chown -c user file            # 只在发生更改时显示信息
chown -v user file            # 显示详细的处理信息
```

### 只修改群组：chgrp

`chgrp` 专门用于修改文件的群组，功能与 `chown :group` 相同。

```bash
chgrp group file             # 修改文件群组
chgrp -R group directory/    # 递归修改目录群组
chgrp --reference=file1 file2  # 参照file1修改file2的群组
```

### 特殊权限位

除了基本的 rwx 权限，Linux 还有三种特殊权限位：

#### 1. SUID (Set User ID)

- **符号**：`s`（在所有者的 x 位置）
- **数值**：`4000`
- **作用**：执行该文件时，以文件所有者的身份运行

```bash
# 设置SUID
chmod u+s file
chmod 4755 file

# 示例：/usr/bin/passwd 命令
ls -l /usr/bin/passwd
# -rwsr-xr-x 1 root root ... /usr/bin/passwd
```

**注意：** SUID 对脚本文件无效，只对二进制可执行文件有效。

#### 2. SGID (Set Group ID)

- **符号**：`s`（在群组的 x 位置）
- **数值**：`2000`
- **作用**：
  - 对文件：执行时以文件群组的身份运行
  - 对目录：在该目录下创建的文件继承目录的群组

```bash
# 设置SGID
chmod g+s file_or_dir
chmod 2755 dir/

# 示例：共享目录
mkdir /shared
chown :developers /shared
chmod 2775 /shared
# 现在任何人在这个目录创建的文件都属于 developers 群组
```

#### 3. Sticky Bit (粘滞位)

- **符号**：`t`（在其他的 x 位置）
- **数值**：`1000`
- **作用**：只有文件所有者、目录所有者或 root 才能删除该目录下的文件

```bash
# 设置粘滞位
chmod +t directory
chmod 1777 directory

# 示例：/tmp 目录
ls -ld /tmp
# drwxrwxrwt 10 root root ... /tmp
```

**典型应用：** /tmp 目录允许所有人读写，但只能删除自己的文件。

#### 特殊权限总结表

| 权限 | 符号 | 数值 | 作用 |
|------|------|------|------|
| SUID | s (u+s) | 4000 | 以文件所有者身份执行 |
| SGID | s (g+s) | 2000 | 以文件群组身份执行 / 继承目录群组 |
| Sticky | t (+t) | 1000 | 限制删除权限 |

#### 设置特殊权限

```bash
# 符号模式
chmod u+s file               # 设置SUID
chmod g+s dir                # 设置SGID
chmod +t dir                 # 设置粘滞位
chmod u-s file               # 移除SUID
chmod g-s dir                # 移除SGID
chmod -t dir                 # 移除粘滞位

# 数字模式（在普通权限前加一位）
chmod 4755 file              # -rwsr-xr-x (SUID)
chmod 2755 dir               # drwxr-sr-x (SGID)
chmod 1755 dir               # drwxr-xr-t (Sticky)
chmod 6755 file              # -rwsr-sr-x (SUID+SGID)
chmod 7777 dir               # drwsrwsrwt (所有特殊权限)
```

#### 查看特殊权限

```bash
ls -l /usr/bin/passwd        # 查看SUID
ls -ld /tmp                  # 查看Sticky bit
ls -ld /var/cache/man        # 查看SGID
find / -perm -4000 2>/dev/null  # 查找所有SUID文件
find / -perm -2000 2>/dev/null  # 查找所有SGID文件
find / -perm -1000 2>/dev/null  # 查找所有Sticky目录
```

### 文件隐藏属性

Linux 文件系统还支持隐藏属性，使用 `chattr` 命令设置，`lsattr` 命令查看。

```bash
lsattr file                  # 查看文件隐藏属性
chattr +i file               # 设置不可变属性（连root都不能修改删除）
chattr -i file               # 移除不可变属性
chattr +a file               # 设置只能追加属性（只能添加内容，不能修改删除）
chattr -a file               # 移除追加属性
```

**常用属性：**

| 属性 | 说明 |
|------|------|
| `i` | 不可变（immutable），不能修改、删除、重命名、创建链接 |
| `a` | 只能追加（append-only），只能添加内容 |
| `A` | 不更新访问时间（atime） |
| `S` | 同步更新（synchronous），立即写入磁盘 |
| `d` |  dump 命令忽略 |
| `e` | 使用extents格式（ext4） |

### 文件访问控制列表 (ACL)

ACL (Access Control List) 提供了比传统权限更细粒度的访问控制。

```bash
# 查看ACL
getfacl file

# 设置ACL
setfacl -m u:username:rwx file      # 给用户添加权限
setfacl -m g:groupname:rx file       # 给群组添加权限
setfacl -m o::r file                 # 修改其他人权限
setfacl -m m::rwx file               # 修改mask
setfacl -x u:username file           # 移除用户的ACL
setfacl -b file                      # 移除所有ACL
setfacl -R -m u:username:rx dir/     # 递归设置
```

**示例：**
```bash
# 允许特定用户读写文件
setfacl -m u:alice:rw file.txt

# 允许特定群组只读
setfacl -m u:developers:r file.txt

# 查看ACL
getfacl file.txt
# file: file.txt
# owner: bob
# group: users
# user::rw-
# user:alice:rw-
# group::r--
# mask::rw-
# other::r--
```

## 5.3 Linux目录配置

### Linux 目录结构标准 (FHS)

FHS (Filesystem Hierarchy Standard) 定义了 Linux 系统中目录的用途和组织方式。

### 根目录结构

```
/
├── bin/          # 基本命令（所有用户可用）
├── boot/         # 启动相关文件
├── dev/          # 设备文件
├── etc/          # 系统配置文件
├── home/         # 用户主目录
├── lib/          # 共享库文件
├── lib64/        # 64位共享库
├── media/        # 可移动媒体挂载点
├── mnt/          # 临时挂载点
├── opt/          # 可选软件包
├── proc/         # 进程信息虚拟文件系统
├── root/         # root用户主目录
├── run/          # 运行时变量数据
├── sbin/         # 系统管理命令
├── srv/          # 服务数据
├── sys/          # 系统信息虚拟文件系统
├── tmp/          # 临时文件
├── usr/          # 用户程序和数据
└── var/          # 可变数据
```

### 重要目录详解

#### /bin (Binary)

- **用途**：存放所有用户都可以使用的基本命令
- **内容**：ls, cp, mv, rm, cat, echo, mkdir 等
- **特点**：单用户模式下也可用

#### /sbin (System Binary)

- **用途**：存放系统管理命令
- **内容**：fdisk, fsck, reboot, shutdown, ifconfig 等
- **特点**：通常需要 root 权限

#### /usr/bin 和 /usr/sbin

- **用途**：存放应用程序的命令
- **关系**：现代 Linux 中，/bin 和 /sbin 通常是到 /usr/bin 和 /usr/sbin 的符号链接

#### /boot

- **用途**：存放启动加载器相关文件
- **内容**：
  - 内核文件（vmlinuz-*）
  - 初始化内存盘（initrd.img-* 或 initramfs-*）
  - GRUB 配置文件
- **注意事项**：不要删除此目录中的文件

#### /dev (Device)

- **用途**：存放设备文件
- **类型**：
  - **块设备**（b）：如硬盘（/dev/sda）、光驱
  - **字符设备**（c）：如终端（/dev/tty）、键盘
  - **伪设备**：如 /dev/null（黑洞）、/dev/zero（零字节）、/dev/random（随机数）、/dev/urandom

**常用设备文件：**
```bash
/dev/sda          # 第一块SCSI/SATA硬盘
/dev/sda1         # 第一块硬盘的第一个分区
/dev/nvme0n1      # 第一块NVMe硬盘
/dev/cdrom        # 光驱（符号链接）
/dev/tty1         # 第一个虚拟终端
/dev/console      # 系统控制台
/dev/null         # 黑洞（写入的数据消失）
/dev/zero         # 提供无限零字节
/dev/random       # 真随机数（阻塞式）
/dev/urandom      # 伪随机数（非阻塞）
```

#### /etc (Editable Text Configuration)

- **用途**：存放系统配置文件
- **特点**：纯文本格式，可编辑
- **重要配置文件：**

```bash
/etc/passwd           # 用户账户信息
/etc/shadow           # 用户密码（加密）
/etc/group            # 群组信息
/etc/gshadow          # 群组密码
/etc/hosts            # 主机名到IP的映射
/etc/resolv.conf      # DNS配置
/etc/fstab            # 文件系统挂载表
/etc/hosts.allow      # 允许访问的服务
/etc/hosts.deny       # 拒绝访问的服务
/etc/ssh/sshd_config  # SSH服务器配置
/etc/crontab          # 系统定时任务
/etc/profile          # 系统环境变量
/etc/bash.bashrc      # 系统bash配置
/etc/apt/sources.list # 软件源（Debian/Ubuntu）
/etc/yum.repos.d/     # 软件源（RHEL/CentOS）
/etc/selinux/config   # SELinux配置
```

#### /home

- **用途**：普通用户的主目录
- **结构**：
  ```
  /home/
  ├── alice/          # 用户alice的主目录
  ├── bob/            # 用户bob的主目录
  └── charlie/        # 用户charlie的主目录
  ```
- **环境变量**：`$HOME` 或 `~` 指向当前用户的主目录
- **注意**：root 用户的主目录是 `/root`，不在 `/home` 下

**用户主目录中的常见文件：**
```bash
~/.bashrc             # bash配置
~/.bash_profile       # 登录bash配置
~/.profile            # 通用shell配置
~/.bash_history       # 命令历史
~/.bash_logout        # 退出bash时执行
~/.ssh/               # SSH配置目录
~/.vimrc              # vim配置
~/.gitconfig          # git配置
~/.config/            # 现代应用的配置目录
~/.local/             # 用户本地数据
~/.cache/             # 缓存数据
```

#### /lib, /lib64, /lib32

- **用途**：存放共享库文件（Shared Libraries）
- **内容**：
  - 动态链接库（.so 文件，如 libc.so.6）
  - 内核模块
  - 启动所需的库
- **目录说明：**
  - `/lib`：32位和通用的库
  - `/lib64`：64位库（在64位系统上）
  - `/lib32`：32位库（在32位系统上）

**常见库文件：**
```bash
/lib/x86_64-linux-gnu/libc.so.6     # C标准库
/lib/x86_64-linux-gnu/libm.so.6     # 数学库
/lib/x86_64-linux-gnu/libdl.so.2    # 动态链接库
/lib/x86_64-linux-gnu/libpthread.so.0  # 线程库
/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2  # 动态链接器
/lib/modules/                       # 内核模块
```

**查看程序依赖的库：**
```bash
ldd /bin/ls                  # 查看ls命令依赖的库
ldd /usr/bin/python3         # 查看python3依赖的库
```

#### /media 和 /mnt

- **用途**：挂载点（Mount Points）
- **区别：**
  - `/media`：系统自动挂载的可移动设备（U盘、光盘、移动硬盘）
  - `/mnt`：手动挂载临时文件系统的传统挂载点
- **现代趋势**：`/media` 越来越常用，`/mnt` 更多用于临时手动挂载

**查看挂载的文件系统：**
```bash
mount                        # 显示所有挂载点
df -h                        # 查看磁盘使用情况
lsblk                        # 列出块设备
blkid                        # 查看块设备UUID
```

#### /opt

- **用途**：存放可选的应用程序包
- **内容**：通常是第三方商业软件或大型独立软件
- **特点**：
  - 每个软件有自己的子目录
  - 不依赖于系统包管理器
  - 可以方便地安装和卸载

**典型结构：**
```
/opt/
├── google/
│   └── chrome/           # Google Chrome
├── vscode/               # Visual Studio Code
├── node-v14.x.x/         # Node.js
└── some-app/
    ├── bin/
    ├── lib/
    └── conf/
```

#### /proc

- **用途**：虚拟文件系统，提供进程和内核信息
- **特点**：
  - 不占用磁盘空间，存在于内存中
  - 实时反映系统状态
  - 许多文件是只读的
- **重要文件和目录：**

```bash
/proc/cpuinfo             # CPU信息
cat /proc/cpuinfo | grep "model name" | head -1

/proc/meminfo             # 内存信息
/proc/loadavg             # 系统负载
/proc/uptime              # 系统运行时间
/proc/version             # 内核版本
/proc/cmdline             # 内核启动参数
/proc/filesystems         # 支持的文件系统
/proc/partitions          # 分区信息
/proc/swaps               # 交换分区信息
/proc/net/                # 网络信息
/proc/sys/                # 内核参数（可调整）
/proc/PID/                # 进程信息（PID为进程ID）
```

**查看进程信息：**
```bash
ls /proc/$$                  # 查看当前shell的信息
ls /proc/1/                  # 查看init/systemd进程

# 进程目录中的文件
/proc/PID/cmdline           # 启动命令
/proc/PID/cwd               # 当前工作目录（符号链接）
/proc/PID/environ           # 环境变量
/proc/PID/exe               # 可执行文件（符号链接）
/proc/PID/fd/               # 打开的文件描述符
/proc/PID/maps              # 内存映射
/proc/PID/status            # 进程状态
/proc/PID/task/             # 线程信息
```

**通过 /proc 调整内核参数：**
```bash
# 查看当前值
cat /proc/sys/net/ipv4/ip_forward

# 临时修改（重启失效）
echo 1 > /proc/sys/net/ipv4/ip_forward

# 永久修改（写入配置文件）
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
sysctl -p                    # 重新加载配置
```

#### /root

- **用途**：root 用户的主目录
- **为什么单独**：
  - root 是超级管理员，拥有最高权限
  - 为了安全，与其他用户主目录分开
  - 系统故障时，其他分区可能无法挂载，但 /root 在根分区上始终可用
- **路径**：`/root`（不是 `/home/root`）
- **权限**：通常是 `700` (drwx------)，只有 root 能访问

#### /run

- **用途**：存放运行时变量数据
- **内容**：
  - 进程 PID 文件（/run/nginx.pid）
  - 服务状态信息
  - 运行时生成的临时数据
- **特点**：
  - tmpfs 文件系统（内存中）
  - 重启后清空
  - 早期在 /var/run，现在迁移到 /run
- **相关路径**：
  - `/run` = `/var/run`（符号链接）
  - `/run/lock` = `/var/lock`

#### /sbin

- **用途**：存放系统管理命令
- **与 /bin 的区别**：
  - `/bin`：基本命令，所有用户都需要
  - `/sbin`：系统管理命令，通常需要 root 权限
- **内容**：
  - `fdisk`、`mkfs`：磁盘分区格式化
  - `ifconfig`、`ip`：网络配置
  - `reboot`、`shutdown`、`poweroff`：关机重启
  - `iptables`：防火墙配置

#### /srv

- **用途**：存放服务提供的数据
- **内容**：
  - Web 服务器的数据（/srv/www）
  - FTP 服务器的数据（/srv/ftp）
  - Git 仓库（/srv/git）
- **与 /var 的区别**：
  - `/srv`：服务的数据文件
  - `/var`：运行时产生的可变数据（日志、缓存等）

#### /sys

- **用途**：虚拟文件系统，提供内核参数和设备信息
- **与 /proc 的区别**：
  - `/proc`：进程信息和运行时内核数据
  - `/sys`：设备和内核对象的统一视图（sysfs）
- **内容**：

```bash
/sys/class/               # 按类别组织的设备（块设备、网络接口等）
/sys/devices/             # 设备树
/sys/block/               # 块设备
/sys/bus/                 # 总线信息（PCI、USB等）
/sys/kernel/              # 内核配置和状态
/sys/module/              # 已加载的内核模块
/sys/power/               # 电源管理
/sys/fs/                  # 文件系统信息
```

**常用操作：**
```bash
# 查看CPU信息
ls /sys/devices/system/cpu/
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor

# 查看内存信息
cat /sys/devices/system/memory/memory0/state

# 查看块设备
ls /sys/block/
cat /sys/block/sda/size      # 块数（乘以512得字节数）

# 控制LED（如果有的话）
echo 1 > /sys/class/leds/input0::capslock/brightness
```

**通过 /sys 调整内核参数：**
```bash
# 开启/关闭IP转发（临时，重启失效）
echo 1 > /proc/sys/net/ipv4/ip_forward
# 或
sysctl -w net.ipv4.ip_forward=1

# 修改swappiness
sysctl -w vm.swappiness=10
```

#### /tmp

- **用途**：存放临时文件
- **特点**：
  - 所有用户都有读写权限（通常是 777 + sticky bit = 1777）
  - 定期清理（通常每天或重启时）
  - 可能使用 tmpfs（内存文件系统）
- **使用场景**：
  - 程序运行时的临时数据
  - 下载和解压文件
  - 编译过程中的临时文件

#### /usr (Unix System Resources)

- **用途**：存放用户程序和文件
- **含义**：历史上是 "user" 的缩写，现在是 "Unix System Resources"
- **结构**：

```
/usr/
├── bin/              # 用户命令（非基本命令）
├── include/          # C/C++ 头文件
├── lib/              # 库文件
├── lib64/            # 64位库文件
├── libexec/          # 其他程序运行的程序
├── local/            # 本地安装的软件
│   ├── bin/
│   ├── etc/
│   ├── include/
│   ├── lib/
│   ├── sbin/
│   └── share/
├── sbin/             # 非基本的系统管理命令
├── share/            # 架构无关的数据文件
│   ├── doc/          # 文档
│   ├── man/          # 手册页
│   ├── info/         # info文档
│   └── ...
└── src/              # 源代码（可选）
```

**重要子目录：**

- `/usr/bin`：用户命令，比 `/bin` 更丰富（如 gcc, python, vim）
- `/usr/sbin`：系统管理命令，比 `/sbin` 更丰富（如 apachectl, mysqld）
- `/usr/lib`：程序的库文件
- `/usr/share`：与架构无关的共享数据（文档、图标、字体等）
- `/usr/local`：本地安装的软件，与系统包管理器分开

#### /var (Variable)

- **用途**：存放运行时产生的可变数据
- **特点**：数据会随时间增长或变化
- **内容**：

```
/var/
├── cache/            # 缓存数据
│   ├── apt/          # apt缓存
│   └── ...
├── lib/              # 可变状态数据
│   ├── dpkg/         # dpkg状态
│   ├── mysql/        # MySQL数据
│   ├── docker/       # Docker数据
│   └── ...
├── log/              # 日志文件（重要！）
│   ├── syslog        # 系统日志
│   ├── auth.log      # 认证日志
│   ├── kern.log      # 内核日志
│   ├── nginx/        # Nginx日志
│   └── ...
├── mail/             # 用户邮件
├── run/              # 运行时数据（PID文件等）
├── spool/            # 队列数据
│   ├── cron/         # cron任务
│   ├── mail/         # 邮件队列
│   └── ...
└── tmp/              # 临时文件（重启保留）
```

**重要子目录：**

- `/var/log`：日志文件，排查问题的重要依据
- `/var/lib`：程序的运行时数据（如数据库文件）
- `/var/cache`：缓存数据，可清理以释放空间
- `/var/spool`：队列数据（如邮件队列、打印队列）

### 路径与目录操作

#### 绝对路径与相对路径

**绝对路径 (Absolute Path)**：
- 从根目录 `/` 开始的完整路径
- 不管当前在什么位置，都能准确找到
- 示例：`/home/user/documents/file.txt`

**相对路径 (Relative Path)**：
- 相对于当前目录的路径
- 不从 `/` 开始
- 依赖当前所在位置

| 符号 | 含义 |
|------|------|
| `.` | 当前目录 |
| `..` | 上级目录 |
| `~` | 当前用户的主目录 |
| `~username` | 指定用户的主目录 |
| `-` | 上一次所在的目录 |

**相对路径示例：**
```bash
# 当前目录：/home/user
./file.txt                   # 当前目录下的 file.txt → /home/user/file.txt
../etc/passwd                # 上级目录的 etc/passwd → /home/etc/passwd （错误）
../../etc/passwd             # 上两级目录的 etc/passwd → /etc/passwd
~/documents                  # 主目录下的 documents → /home/user/documents
~alice/public                # alice 主目录下的 public
```

#### 路径切换命令

**`cd` - 切换目录**
```bash
cd /path/to/directory        # 切换到绝对路径
cd relative/path             # 切换到相对路径
cd ~                         # 切换到主目录
cd                           # 同上
cd ~username                 # 切换到指定用户的主目录
cd ..                        # 切换到上级目录
cd ../..                     # 切换到上上级目录
cd -                         # 切换到上次所在的目录
pwd                          # 显示当前路径
```

**`pwd` - 显示当前路径**
```bash
pwd                          # 显示逻辑路径（可能包含符号链接）
pwd -P                       # 显示物理路径（解析所有符号链接）
```

#### 目录操作命令

**`mkdir` - 创建目录**
```bash
mkdir dirname                # 创建单个目录
mkdir dir1 dir2 dir3         # 创建多个目录
mkdir -p parent/child/grandchild  # 递归创建多级目录
mkdir -m 755 mydir           # 创建时指定权限
mkdir -v dirname             # 显示创建过程
```

**`rmdir` - 删除空目录**
```bash
rmdir dirname                # 删除空目录
rmdir -p parent/child        # 递归删除空目录
rmdir dir1 dir2              # 删除多个空目录
```

⚠️ **注意：** `rmdir` 只能删除**空目录**。要删除非空目录，使用 `rm -r`。

**`rm` - 删除文件或目录**
```bash
rm file.txt                  # 删除文件
rm -r directory              # 递归删除目录及其内容
rm -rf directory             # 强制递归删除（危险！）
rm -i file.txt               # 删除前询问
rm -f file.txt               # 强制删除（忽略不存在文件）
rm *.log                     # 删除所有log文件
rm -r *                      # 删除当前目录下所有内容（危险！）
```

⚠️ **危险命令警告：**
```bash
rm -rf /                     # 删除整个系统！永远不要执行！
rm -rf /*                    # 同上
rm -rf ~                     # 删除主目录
rm -rf .                     # 删除当前目录
rm -rf .*                    # 删除所有隐藏文件和上级目录！
```

### 文件与目录的默认权限

#### umask

**umask**（user file-creation mode mask）决定了新创建文件和目录的**默认权限**。

**查看 umask：**
```bash
umask                        # 显示umask值（四位八进制数）
umask -S                     # 以符号模式显示
```

**默认权限计算：**
- **文件**：`666 - umask`
- **目录**：`777 - umask`

**常见 umask 值：**

| umask | 文件权限 | 目录权限 | 说明 |
|-------|----------|----------|------|
| 002 | 664 (rw-rw-r--) | 775 (rwxrwxr-x) | 用户和组可写 |
| 022 | 644 (rw-r--r--) | 755 (rwxr-xr-x) | 仅用户可写（常见） |
| 077 | 600 (rw-------) | 700 (rwx------) | 仅用户可访问（安全） |

**设置 umask：**
```bash
umask 022                    # 设置umask为022
umask 027                    # 更严格：组可读，其他人无权限
```

**永久设置 umask：**
编辑 `~/.bashrc` 或 `~/.profile`：
```bash
echo "umask 022" >> ~/.bashrc
```

### 特殊权限的实践应用

#### 1. SUID 应用：passwd 命令

```bash
ls -l /usr/bin/passwd
# -rwsr-xr-x 1 root root ... /usr/bin/passwd
```

**为什么需要 SUID？**
- 普通用户需要修改自己的密码
- 密码存储在 `/etc/shadow`，只有 root 可写
- 通过 SUID，passwd 以 root 身份运行，可以修改 shadow 文件

#### 2. SGID 应用：共享目录

```bash
# 创建共享目录
sudo mkdir /shared
sudo chown :developers /shared
sudo chmod 2775 /shared

ls -ld /shared
# drwxrwsr-x 2 root developers ... /shared
```

**效果：**
- 任何人在此目录创建的文件，群组都是 `developers`
- 实现组内文件共享

#### 3. 粘滞位应用：/tmp 目录

```bash
ls -ld /tmp
# drwxrwxrwt 10 root root ... /tmp
```

**效果：**
- 所有人都可以在 /tmp 读写文件
- 但只能删除自己创建的文件
- 保护了用户的临时文件不被他人删除

### 权限管理最佳实践

#### 1. 最小权限原则

- 只授予必要的权限
- 不要滥用 root 权限
- 使用 sudo 而不是直接登录 root

#### 2. 敏感文件权限

```bash
# 密码文件
chmod 600 /etc/shadow
chmod 644 /etc/passwd

# SSH 密钥
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
chmod 644 ~/.ssh/authorized_keys
chmod 644 ~/.ssh/known_hosts

# 配置文件
chmod 644 /etc/hosts
chmod 755 /etc/init.d/*
```

#### 3. 目录权限设置

```bash
# Web 目录
chmod 755 /var/www/html
chmod 644 /var/www/html/*.html

# 日志目录
chmod 755 /var/log
chmod 640 /var/log/*.log

# 共享目录（SGID）
chmod 2770 /shared
```

#### 4. 使用 ACL 进行细粒度控制

```bash
# 允许特定用户访问
setfacl -m u:alice:r-x /restricted

# 允许特定组读写
setfacl -m g:developers:rw- shared_file

# 设置默认ACL（新文件继承）
setfacl -d -m u:bob:rwx /shared_dir
```

#### 5. 定期审计权限

```bash
# 查找SUID/SGID文件
find / -perm -4000 -o -perm -2000 2>/dev/null

# 查找所有人可写的文件
find / -type f -perm -002 2>/dev/null

# 查找没有所有者的文件
find / -nouser -o -nogroup 2>/dev/null

# 检查SSH密钥权限
find /home -name "id_rsa" ! -perm 600 2>/dev/null
```

### 本章命令总结

| 命令 | 功能 |
|------|------|
| `ls -l` | 查看文件权限 |
| `chmod` | 修改权限 |
| `chown` | 修改所有者 |
| `chgrp` | 修改群组 |
| `umask` | 设置默认权限 |
| `id` | 查看用户信息 |
| `whoami` | 显示当前用户 |
| `groups` | 查看所属群组 |
| `getfacl` / `setfacl` | 管理ACL |
| `lsattr` / `chattr` | 管理隐藏属性 |
| `find` | 查找文件（支持按权限查找） |

## 5.4 重点回顾

1. **三种身份**：user（所有者）、group（群组）、others（其他人）
2. **三种权限**：r（读，4）、w（写，2）、x（执行，1）
3. **权限查看**：`ls -l` 显示10位权限字符串
4. **修改权限**：`chmod`（符号模式或数字模式）
5. **修改所有者**：`chown`（可同时改群组）
6. **修改群组**：`chgrp`（或 `chown :group`）
7. **默认权限**：`umask` 决定新文件的默认权限
8. **特殊权限**：SUID(4)、SGID(2)、粘滞位(1)
9. **隐藏属性**：`chattr`、`lsattr`
10. **ACL**：`setfacl`、`getfacl` 提供更细粒度的权限控制
11. **FHS标准**：Linux 目录结构遵循 FHS 标准
12. **重要目录**：/etc（配置）、/var（可变数据）、/home（用户主目录）

## 5.5 本章练习

1. 解释 `-rwxr-xr-- 1 alice developers 1234 Jan 1 10:00 script.sh` 中各字段的含义。

2. 如何给文件添加执行权限？如何移除写权限？分别使用符号模式和数字模式。

3. 创建一个目录，使得组内成员可以读写，其他人只能进入但不能列出内容。

4. 解释 SUID、SGID 和粘滞位的作用，并各举一个应用场景。

5. 设置 umask 使得新建文件的权限为 640，新建目录的权限为 750。

6. 使用 ACL 允许特定用户访问你主目录下的某个文件，但不改变文件的基本权限。

7. 解释以下目录的用途：/etc、/var、/usr、/opt、/proc。

8. 查找系统中所有设置了 SUID 位的文件。

9. 创建一个共享目录，要求：
   - 任何人都可以创建文件
   - 只能删除自己的文件
   - 新文件的群组自动继承目录的群组

10. 检查你主目录下文件的权限，找出可能存在安全隐患的文件（如所有人可写）。

## 5.6 参考资料与延伸阅读

- `man 1 chmod`
- `man 1 chown`
- `man 1 ls`
- `man 2 umask`
- `man 1 getfacl`
- [Filesystem Hierarchy Standard](https://refspecs.linuxfoundation.org/fhs.shtml)
- [Linux 文件权限详解](https://linux.vbird.org/linux_basic/centos7/0210filepermission.php)
- [鸟哥的 Linux 私房菜 - 文件权限与目录配置](https://linux.vbird.org/linux_basic/centos7/0210filepermission.php)

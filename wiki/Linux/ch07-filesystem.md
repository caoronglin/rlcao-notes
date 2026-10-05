---
collection:
  profile: wiki
  id: Linux
title: 第七章、Linux 磁盘与文件系统管理
date: 2024-01-01
updated: 2024-01-01
tags:
  - Linux
  - 文件系统
  - 磁盘管理
---

# 第七章、Linux 磁盘与文件系统管理

## 7.1 认识 Linux 文件系统

### 文件系统的特性

**什么是文件系统**

文件系统是操作系统用于管理磁盘上的文件的方法和数据结构。它定义了文件的存储方式、命名规则、访问权限等。

**Linux 支持的文件系统类型：**

| 文件系统 | 特点 | 适用场景 |
|----------|------|----------|
| **ext2** | 传统 Linux 文件系统，无日志 | 简单嵌入式系统 |
| **ext3** | ext2 + 日志功能 | 过渡使用 |
| **ext4** | 现代标准，高性能，大容量支持 | 通用场景，推荐 |
| **xfs** | 高性能，大文件支持，并行 I/O | 大数据，数据库 |
| **btrfs** | 现代特性：快照、压缩、多设备 | 高级用户 |
| **swap** | 交换分区/文件 | 虚拟内存 |
| **vfat/fat32** | Windows 兼容 | UEFI、移动设备 |
| **ntfs** | Windows 文件系统 | 双系统数据共享 |
| **nfs** | 网络文件系统 | 文件共享 |
| **cifs/smb** | Windows 网络共享 | Samba 共享 |

### ext4 文件系统详解

**ext4 的主要特性：**

1. **更大的文件系统和文件**
   - 最大文件系统：1EB (Exabyte)
   - 最大文件大小：16TB

2. **Extents 存储方式**
   - 代替传统的块映射，提高大文件性能
   - 减少碎片

3. **日志校验和 (Journal Checksums)**
   - 提高日志可靠性

4. **向后兼容**
   - 可以挂载为 ext2/ext3

5. **延迟分配 (Delayed Allocation)**
   - 提高性能，减少碎片

**ext4 关键参数：**

```bash
# 查看 ext4 文件系统信息
dumpe2fs /dev/sda1

# 调整文件系统参数
tune2fs -l /dev/sda1

# 启用/禁用日志
# ext4 默认启用日志

# 调整预留块数（默认5%）
tune2fs -m 1 /dev/sda1  # 预留1%给 root
```

### XFS 文件系统详解

**XFS 的主要特性：**

1. **高性能**
   - 优化的并行 I/O
   - 适合大文件和高吞吐量

2. **可扩展性**
   - 在线扩展（无需卸载）
   - 最大支持 8EB 文件系统

3. **日志结构**
   - 元数据日志
   - 快速恢复

4. **分配组 (Allocation Groups)**
   - 提高并行性
   - 独立管理空间

**XFS 管理命令：**

```bash
# 创建 XFS 文件系统
mkfs.xfs /dev/sdb1

# 创建带标签的 XFS
mkfs.xfs -L "Data" /dev/sdb1

# 查看 XFS 信息
xfs_info /dev/sdb1

# 扩展 XFS 文件系统（在线）
xfs_growfs /mnt/data

# 修复 XFS
xfs_repair /dev/sdb1
xfs_repair -n /dev/sdb1  # 只检查不修复
```

**XFS vs ext4 选择建议：**

| 场景 | 推荐文件系统 |
|------|-------------|
| 通用桌面系统 | ext4 |
| 小型服务器 | ext4 |
| 大型数据库 | XFS |
| 大数据处理 | XFS |
| 视频/多媒体存储 | XFS |
| 虚拟化存储 | XFS |
| 容器镜像存储 | XFS |

## 7.2 文件系统的简单操作

### 磁盘与目录的容量

**df 命令 - 查看文件系统磁盘空间：**

```bash
# 基本用法
df                           # 显示所有文件系统
df -h                        # 人类可读格式（推荐）
df -H                        # 使用1000而非1024为基底
df -T                        # 显示文件系统类型
df -i                        # 显示inode使用情况
df -l                        # 仅显示本地文件系统
df -x tmpfs                  # 排除特定类型
df /home                     # 查看特定目录所在分区

# 常用组合
df -hT                       # 人类可读 + 文件系统类型
df -h | grep -E '(Filesystem|/dev/)'  # 过滤显示
```

**du 命令 - 查看目录/文件大小：**

```bash
# 基本用法
du                           # 显示目录及子目录大小
du -h                        # 人类可读格式
du -s                        # 仅显示总计（不显示子目录）
du -sh /path                 # 查看目录总大小（最常用）
du -a                        # 显示文件和目录
du --max-depth=1 /path       # 只显示一层子目录
du --max-depth=2 /path       # 只显示两层子目录

# 常用组合
du -sh /* 2>/dev/null | sort -h              # 查看根目录下各文件夹大小
du -sh /home/* 2>/dev/null | sort -hr | head -10  # 查看home下最大的10个用户
du -ah /path | sort -hr | head -20           # 找出最大的20个文件/目录
du -h --max-depth=1 /var | sort -h           # 查看/var下各子目录大小

# 排除特定目录
du -sh --exclude='*.log' /var/log
du -sh --exclude='node_modules' /project
```

**ln 命令 - 创建链接文件：**

```bash
# 硬链接（Hard Link）
ln original.txt hardlink.txt     # 同一文件系统的硬链接
ln /path/to/file /another/path/link

# 软链接/符号链接（Symbolic Link）
ln -s original.txt symlink.txt   # 最常用的链接
ln -s /path/to/file /path/to/link
ln -s /path/to/directory /path/to/linkname

# 选项
-f                              # 强制，如果目标存在则覆盖
-i                              # 交互，覆盖前询问
-v                              # 详细模式，显示操作过程
-n                              # 将符号链接视为普通文件
-s                              # 创建符号链接

# 常用示例
ln -s /usr/local/bin/myapp /usr/bin/myapp      # 添加到PATH
ln -s /mnt/data/docs ~/Documents               # 链接到数据盘
ln -s ~/dotfiles/.bashrc ~/.bashrc             # 管理配置文件
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime  # 设置时区

# 查看链接
ls -l                          # 显示链接指向
readlink symlink.txt          # 读取符号链接的目标
readlink -f symlink.txt       # 递归解析到最终目标
```

**硬链接 vs 软链接：**

| 特性 | 硬链接 | 软链接（符号链接） |
|------|--------|-------------------|
| **本质** | 同一文件的不同名字 | 指向另一个文件/目录的快捷方式 |
| **inode** | 相同 | 不同 |
| **跨文件系统** | 不支持 | 支持 |
| **链接目录** | 不支持 | 支持 |
| **原文件删除** | 数据仍然存在 | 链接失效（悬空链接） |
| **大小** | 与源文件相同 | 很小（路径长度） |
| **用途** | 文件备份、防止误删 | 快捷方式、版本管理、系统配置 |

## 7.3 磁盘的分区、格式化、检验与挂载

### 分区操作

**lsblk - 列出块设备：**

```bash
lsblk                          # 基本列出
lsblk -a                       # 显示空设备
lsblk -f                       # 显示文件系统
lsblk -m                       # 显示权限和所有者
lsblk -o NAME,SIZE,FSTYPE,MOUNTPOINT,MODEL
lsblk -p                       # 显示完整路径
lsblk -t                       # 显示拓扑
lsblk -b                       # 以字节为单位
lsblk --tree                   # 树形显示
lsblk -d                       # 不显示从设备

# 常用组合
lsblk -fpm                    # 完整路径 + 文件系统 + 权限
watch -n 1 lsblk              # 实时监控
```

**blkid - 查看块设备属性：**

```bash
blkid                          # 显示所有块设备
blkid /dev/sda1               # 查看特定设备
blkid -U UUID                 # 根据UUID查找设备
blkid -L LABEL                # 根据标签查找设备
blkid -t TYPE=ext4            # 根据类型查找
blkid -o device -t UUID=xxx   # 只输出设备名
blkid -o export /dev/sda1     # 导出为环境变量格式

# 常用示例
blkid | grep ext4             # 查找ext4文件系统
blkid -o export | grep UUID # 列出所有UUID
```

### 格式化（创建文件系统）

**mkfs 系列命令：**

```bash
# 通用格式
mkfs -t type device
mkfs.type device        # 等效命令

# ext4 文件系统
mkfs.ext4 /dev/sdb1
mkfs -t ext4 /dev/sdb1
mke2fs -t ext4 /dev/sdb1

# 常用选项
mkfs.ext4 -L "Data" /dev/sdb1           # 设置卷标
mkfs.ext4 -N 1000000 /dev/sdb1          # 指定inode数量
mkfs.ext4 -m 1 /dev/sdb1                # 保留1%空间给root
mkfs.ext4 -E stride=128 /dev/sdb1       # RAID优化
mkfs.ext4 -O ^metadata_csum /dev/sdb1   # 禁用元数据校验

# xfs 文件系统
mkfs.xfs /dev/sdb1
mkfs -t xfs /dev/sdb1

# 常用选项
mkfs.xfs -L "Data" /dev/sdb1            # 设置卷标
mkfs.xfs -f /dev/sdb1                   # 强制格式化（覆盖）
mkfs.xfs -d agcount=4 /dev/sdb1         # 分配组数量
mkfs.xfs -l size=128m /dev/sdb1         # 日志大小
mkfs.xfs -n size=64k /dev/sdb1          # 命名空间大小

# vfat/fat32（用于 UEFI 启动分区）
mkfs.vfat -F 32 /dev/sda1
mkfs.fat -F 32 -n "EFI" /dev/sda1

# 其他文件系统
mkfs.btrfs /dev/sdb1
mkfs.jfs /dev/sdb1
mkfs.reiserfs /dev/sdb1

# 创建交换分区
mkswap /dev/sda3
mkswap -L "Swap" /dev/sda3
swapon /dev/sda3           # 启用交换
swapoff /dev/sda3          # 关闭交换
```

### 检验文件系统

**fsck - 文件系统检查：**

```bash
# 基本用法（危险：检查前必须先卸载！）
# 检查并修复ext4
fsck.ext4 /dev/sda1
# 或
e2fsck /dev/sda1

# 检查xfs（注意：xfs使用xfs_repair）
xfs_repair /dev/sdb1

# 常用选项
fsck -t ext4 /dev/sda1      # 指定类型
fsck -A                     # 检查/etc/fstab中的所有
fsck -a                     # 自动修复（不询问）
fsck -r                     # 交互式修复
fsck -n                     # 只检查不修复（模拟运行）
fsck -f                     # 强制检查（即使看起来干净）
fsck -v                     # 详细模式
fsck -y                     # 对所有问题回答"是"（危险！）

# 实际操作示例（必须卸载后检查）
# 对于根分区，需要进入救援模式或使用Live CD
umount /dev/sda1
fsck -f /dev/sda1
# 如果检查根分区，使用：
shutdown -rF now           # 重启并强制检查

# 创建包含坏块的列表
e2fsck -c /dev/sda1         # 只读扫描
e2fsck -cc /dev/sda1        # 非破坏性读写测试（慢）

# 检查并修复xfs
xfs_repair /dev/sdb1                   # 必须卸载
xfs_repair -n /dev/sdb1                # 只检查
xfs_repair -L /dev/sdb1               # 强制修复（可能丢失数据）
xfs_repair -o force_geometry /dev/sdb1

# 检查日志
xfs_logprint /dev/sdb1
```

**坏块检测与处理：**

```bash
# 检测坏块
badblocks -s -v /dev/sda1              # 只读检测
badblocks -s -w -v /dev/sda1           # 破坏性读写检测（会擦除数据！）

# 保存坏块列表
badblocks -s -v -o badblocks.list /dev/sda1

# 使用坏块列表创建文件系统
mkfs.ext4 -l badblocks.list /dev/sda1

# 或使用 e2fsck 标记坏块
e2fsck -l badblocks.list /dev/sda1
```

### 挂载文件系统

**基本挂载：**

```bash
# 基本挂载
mount /dev/sdb1 /mnt/data

# 指定文件系统类型
mount -t ext4 /dev/sdb1 /mnt/data
mount -t ntfs /dev/sdb2 /mnt/windows
mount -t vfat /dev/sdc1 /mnt/usb

# 常用选项
-o ro                        # 只读挂载
-o rw                        # 读写挂载
-o noatime                   # 不更新访问时间
-o nodiratime                # 不更新目录访问时间
-o sync                      # 同步写入
-o async                     # 异步写入
-o auto                      # 可被 auto 挂载
-o noauto                    # 不可被 auto 挂载
-o user                      # 允许普通用户挂载
-o nouser                    # 只允许 root 挂载
-o exec                      # 允许执行文件
-o noexec                    # 禁止执行文件
-o suid                      # 允许 SUID/SGID
-o nosuid                    # 禁止 SUID/SGID
-o remount                   # 重新挂载
-o bind                      # 绑定挂载

# 示例
mount -o ro,remount /         # 以只读方式重新挂载根分区
mount -o noatime /dev/sdb1 /mnt/data
mount -o uid=1000,gid=1000 /dev/sdc1 /mnt/usb

# 绑定挂载（将一个目录挂载到另一个位置）
mount --bind /var/log /mnt/logs
mount --rbind /home /chroot/home  # 递归绑定

# 移动挂载点
mount --move /mnt/old /mnt/new
```

**卸载文件系统：**

```bash
# 基本卸载
umount /mnt/data
umount /dev/sdb1

# 卸载时检查是否在使用中
umount -f /mnt/data           # 强制卸载（危险）
umount -l /mnt/data           # 懒卸载（立即生效，实际稍后执行）
umount -r /mnt/data           # 无法卸载时以只读重新挂载
umount -a                     # 卸载 /etc/fstab 中所有文件系统
umount -a -t ext4             # 卸载所有 ext4 文件系统

# 处理 "device is busy" 错误
# 1. 查找使用进程
lsof /mnt/data
fuser -mv /mnt/data

# 2. 杀死进程（小心使用）
fuser -km /mnt/data

# 3. 然后重新卸载
umount /mnt/data
```

**自动挂载配置（/etc/fstab）：**

```bash
# fstab 格式说明
# <设备> <挂载点> <文件系统> <选项> <dump> <fsck>

# 设备可以是：
# - 设备路径：/dev/sda1
# - UUID：UUID=xxxxx
# - 标签：LABEL=Data
# - 网络：//server/share

# 常用选项：
# defaults = rw, suid, dev, exec, auto, nouser, async
# noatime - 不更新访问时间
# nodiratime - 不更新目录访问时间
# ro - 只读
# rw - 读写
# auto - 可以被自动挂载
# noauto - 不会被自动挂载（可以用mount -a挂载）
# user - 允许普通用户挂载
# nouser - 只允许root挂载
# exec - 允许执行文件
# noexec - 不允许执行文件
# sync - 同步写入
# async - 异步写入

# dump 字段：
# 0 - 不备份
# 1 - 每天备份

# fsck 字段：
# 0 - 不检查
# 1 - 首先检查（根分区）
# 2 - 随后检查（其他分区）

# 示例配置

# 根分区
UUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx / ext4 defaults,noatime 0 1

# 启动分区
UUID=yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy /boot ext4 defaults,noatime 0 2

# 家目录
UUID=zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz /home ext4 defaults,noatime 0 2

# 数据分区
UUID=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa /data ext4 defaults,noatime,noexec 0 2

# 交换分区
UUID=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb none swap sw 0 0

# 临时文件系统（内存中）
tmpfs /tmp tmpfs defaults,nosuid,nodev,noexec 0 0

# 绑定挂载
/home/user/data /var/www/data none bind 0 0

# NFS 网络文件系统
server:/export/share /mnt/share nfs defaults,_netdev 0 0

# CIFS/SMB Windows 共享
//windows/share /mnt/winshare cifs credentials=/root/.smbcred,iocharset=utf8 0 0
```

**获取 UUID 和标签：**

```bash
# 查看所有设备的 UUID
blkid

# 查看特定设备
blkid /dev/sda1

# 查找 UUID 对应的设备
blkid -U xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# 查找标签对应的设备
blkid -L Data

# 为设备设置标签
# ext2/3/4
e2label /dev/sda1 "System"
tune2fs -L "System" /dev/sda1

# xfs
xfs_admin -L "Data" /dev/sdb1

# vfat/fat32
fatlabel /dev/sdc1 "USB_DRIVE"

# 查看标签
e2label /dev/sda1
xfs_admin -l /dev/sdb1
```

**fstab 管理工具：**

```bash
# 测试 fstab 配置（不实际挂载）
mount -fav

# 查看 fstab 是否有错误
findmnt --verify

# 挂载 /etc/fstab 中的所有文件系统
mount -a

# 挂载特定类型的文件系统
mount -a -t ext4
mount -a -t nfs

# 排除特定类型
mount -a -t noext4

# 显示当前挂载
mount | column -t
findmnt
findmnt -D  # 显示目录树
findmnt -f  # 显示 fstab 配置

# 显示挂载点信息
findmnt /mnt/data
findmnt /dev/sdb1
```

## 7.4 设置开机挂载

### 使用 /etc/fstab

如前所述，`/etc/fstab` 是 Linux 系统中最常用的开机挂载配置方式。

### 使用 systemd mount 单元

对于使用 systemd 的系统，可以使用 mount 单元来管理挂载：

```bash
# 创建挂载单元文件
sudo nano /etc/systemd/system/mnt-data.mount

# 内容示例：
[Unit]
Description=Data partition
After=local-fs.target

[Mount]
What=/dev/disk/by-uuid/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Where=/mnt/data
Type=ext4
Options=defaults,noatime

[Install]
WantedBy=multi-user.target

# 创建自动挂载单元（可选）
sudo nano /etc/systemd/system/mnt-data.automount

[Unit]
Description=Automount Data partition

[Automount]
Where=/mnt/data

[Install]
WantedBy=multi-user.target

# 启用并启动
sudo systemctl daemon-reload
sudo systemctl enable mnt-data.mount
sudo systemctl start mnt-data.mount

# 查看状态
sudo systemctl status mnt-data.mount

# 自动挂载
sudo systemctl enable mnt-data.automount
sudo systemctl start mnt-data.automount
```

## 7.5 内存交换空间（swap）的管理

### 什么是 swap

Swap（交换空间）是当物理内存不足时，系统用来临时存放数据的空间。可以是：
- **交换分区**：专用的磁盘分区
- **交换文件**：普通文件作为交换空间

### 查看 swap 状态

```bash
# 查看 swap 使用情况
free -h
free -m

# 详细查看
swapon -s
swapon --show
swapon --show=NAME,TYPE,SIZE,USED,PRIO

cat /proc/swaps

# 查看内存和 swap 实时使用
vmstat 1 10
watch -n 1 free -h
```

### 创建交换分区

```bash
# 1. 创建分区（使用 fdisk 或 parted）
sudo fdisk /dev/sdb
# n -> p -> 回车 -> 回车 -> +8G -> t -> 82 -> w

# 2. 格式化 swap
sudo mkswap /dev/sdb1
sudo mkswap -L "Swap" /dev/sdb1    # 带标签

# 3. 启用 swap
sudo swapon /dev/sdb1

# 4. 添加到 fstab 开机启用
# 获取 UUID
sudo blkid /dev/sdb1
# 添加到 /etc/fstab
UUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx none swap sw 0 0
# 或
/dev/sdb1 none swap sw 0 0

# 5. 测试 fstab 配置
sudo swapon -a

# 6. 设置 swap 优先级（多个 swap 时）
sudo swapon -p 10 /dev/sdb1    # 优先级 10（越高越优先）
# 在 fstab 中：
UUID=xxx none swap sw,pri=10 0 0
```

### 创建交换文件

```bash
# 方法 1：使用 dd（较慢）
sudo dd if=/dev/zero of=/swapfile bs=1M count=8192 status=progress

# 方法 2：使用 fallocate（更快）
sudo fallocate -l 8G /swapfile

# 设置权限（重要！）
sudo chmod 600 /swapfile

# 格式化为 swap
sudo mkswap /swapfile

# 启用
sudo swapon /swapfile

# 验证
sudo swapon --show
free -h

# 添加到 fstab
sudo nano /etc/fstab
# 添加：
/swapfile none swap sw 0 0

# 测试
sudo swapoff -a
sudo swapon -a
```

### 调整 swappiness

`vm.swappiness` 参数控制系统使用 swap 的倾向：

```bash
# 查看当前值
cat /proc/sys/vm/swappiness
sysctl vm.swappiness

# 临时修改
sudo sysctl vm.swappiness=10

# 永久修改
sudo nano /etc/sysctl.conf
# 添加：
vm.swappiness=10

# 重新加载配置
sudo sysctl -p

# 推荐值：
# 0-20：服务器，尽可能避免使用 swap
# 30-60：桌面系统，平衡使用
# 60-100：对响应时间要求不高的系统
```

### 删除 swap

```bash
# 交换分区
sudo swapoff /dev/sdb1
# 从 /etc/fstab 删除对应行
sudo fdisk /dev/sdb  # 删除分区

# 交换文件
sudo swapoff /swapfile
sudo rm /swapfile
# 从 /etc/fstab 删除对应行
```

## 7.6 文件系统的特殊查看与操作

### 磁盘配额（Quota）

用于限制用户或组对磁盘空间的使用。

```bash
# 安装 quota 工具
sudo yum install quota

# 1. 启用配额（编辑 /etc/fstab）
# 添加 usrquota 和/或 grpquota
UUID=xxx /home ext4 defaults,usrquota,grpquota 0 0

# 2. 重新挂载
sudo mount -o remount /home

# 3. 创建配额数据库
sudo quotacheck -cug /home
# -c = 创建
# -u = 用户配额
# -g = 组配额
# -m = 不尝试重新挂载为只读

# 4. 启用配额
sudo quotaon /home

# 5. 查看配额状态
quota -v username
repquota /home
repquota -a

# 6. 设置用户配额
sudo edquota username
# 或者使用命令行
setquota -u username 0 0 0 0 /home

# 7. 关闭配额
sudo quotaoff /home

# 常用检查命令
quotacheck -avugm             # 检查并修复配额
repquota -aug                 # 报告所有用户和组的配额
warnquota                     # 向超过配额的用户发送邮件
```

### 磁盘阵列（RAID）

使用 mdadm 创建软件 RAID：

```bash
# 安装 mdadm
sudo yum install mdadm

# 查看现有 RAID
cat /proc/mdstat
mdadm --detail /dev/md0

# 创建 RAID 0（条带，性能最高，无冗余）
mdadm --create /dev/md0 --level=0 --raid-devices=2 /dev/sdb1 /dev/sdc1

# 创建 RAID 1（镜像，冗余，容量减半）
mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb1 /dev/sdc1

# 创建 RAID 5（分布式奇偶校验，容错1块盘）
mdadm --create /dev/md0 --level=5 --raid-devices=3 /dev/sdb1 /dev/sdc1 /dev/sdd1

# 创建 RAID 6（双分布式奇偶校验，容错2块盘）
mdadm --create /dev/md0 --level=6 --raid-devices=4 /dev/sdb1 /dev/sdc1 /dev/sdd1 /dev/sde1

# 创建 RAID 10（镜像+条带）
mdadm --create /dev/md0 --level=10 --raid-devices=4 /dev/sdb1 /dev/sdc1 /dev/sdd1 /dev/sde1

# 创建后格式化
mkfs.ext4 /dev/md0

# 创建挂载点并挂载
mkdir /mnt/raid
mount /dev/md0 /mnt/raid

# 添加到 fstab
echo '/dev/md0 /mnt/raid ext4 defaults 0 0' >> /etc/fstab

# 保存 RAID 配置
mdadm --detail --scan >> /etc/mdadm.conf
# 或
mdadm --detail --scan | sudo tee -a /etc/mdadm.conf

# RAID 管理命令
mdadm --detail /dev/md0                 # 查看详情
mdadm --stop /dev/md0                   # 停止 RAID
cat /proc/mdstat                        # 查看状态
mdadm --manage /dev/md0 --add /dev/sde1 # 添加热备盘
mdadm --manage /dev/md0 --remove /dev/sdb1 --fail /dev/sdb1  # 标记故障并移除
```

### 逻辑卷管理（LVM）

LVM 提供灵活的磁盘空间管理：

```bash
# 安装 LVM
sudo yum install lvm2

# 查看 LVM 信息
pvs                         # 查看物理卷
vgs                         # 查看卷组
lvs                         # 查看逻辑卷
pvdisplay
vgdisplay
lvdisplay

# 创建物理卷（PV）
pvcreate /dev/sdb1
pvcreate /dev/sdc1

# 创建卷组（VG）
vgcreate vg_data /dev/sdb1 /dev/sdc1

# 扩展卷组
vgextend vg_data /dev/sdd1

# 创建逻辑卷（LV）
lvcreate -L 50G -n lv_www vg_data          # 指定大小
lvcreate -l 100%FREE -n lv_backup vg_data  # 使用所有剩余空间
lvcreate -l 50%VG -n lv_data vg_data       # 使用卷组50%空间
lvcreate -s -n lv_snap -L 10G /dev/vg_data/lv_www  # 创建快照

# 格式化逻辑卷
mkfs.ext4 /dev/vg_data/lv_www

# 挂载
mkdir -p /var/www
mount /dev/vg_data/lv_www /var/www

# 添加到 fstab
echo '/dev/mapper/vg_data-lv_www /var/www ext4 defaults,noatime 0 0' >> /etc/fstab

# 扩展逻辑卷（在线，无需卸载）
lvextend -L +50G /dev/vg_data/lv_www       # 增加50G
lvextend -L 100G /dev/vg_data/lv_www       # 扩展到100G
lvextend -l +100%FREE /dev/vg_data/lv_www # 使用所有剩余空间

# 扩展文件系统
resize2fs /dev/vg_data/lv_www             # ext2/3/4
xfs_growfs /var/www                       # xfs（挂载点）

# 缩小逻辑卷（ext4，必须先卸载）
umount /var/www
e2fsck -f /dev/vg_data/lv_www
resize2fs /dev/vg_data/lv_www 50G
lvreduce -L 50G /dev/vg_data/lv_www
mount /dev/vg_data/lv_www /var/www

# 删除逻辑卷（先卸载，数据会丢失！）
umount /var/www
lvremove /dev/vg_data/lv_www

# 删除卷组（先删除所有逻辑卷）
vgchange -an vg_data       # 停用卷组
vgremove vg_data

# 删除物理卷
pvremove /dev/sdb1
pvremove /dev/sdc1

# LVM 快照（备份数据）
# 创建快照
lvcreate -s -n lv_snap -L 50G /dev/vg_data/lv_www

# 挂载快照
mkdir /mnt/snap
mount /dev/vg_data/lv_snap /mnt/snap

# 备份数据
tar czf backup.tar.gz -C /mnt/snap .

# 卸载并删除快照
umount /mnt/snap
lvremove /dev/vg_data/lv_snap

# 恢复快照（如果原逻辑卷损坏）
# 注意：恢复后快照会被删除
# umount /var/www
# lvconvert --merge /dev/vg_data/lv_snap
# mount /dev/vg_data/lv_www /var/www
```

## 7.7 重点回顾

1. **文件系统**：ext4（通用）、xfs（大容量）、swap（交换分区）
2. **分区工具**：fdisk（MBR）、gdisk（GPT）、parted（两者）
3. **格式化**：mkfs.ext4、mkfs.xfs、mkswap
4. **文件系统检查**：fsck、e2fsck、xfs_repair
5. **挂载**：mount、umount、/etc/fstab
6. **磁盘配额**：quota 限制用户/组的磁盘使用
7. **RAID**：mdadm 创建软件磁盘阵列
8. **LVM**：灵活的磁盘空间管理，支持在线扩容
9. **swap**：交换分区或交换文件，用于虚拟内存
10. **性能优化**：noatime、日志模式、RAID、LVM 等

## 7.8 本章习题

1. 解释 ext4 和 xfs 文件系统的主要特点，什么情况下应该选择 xfs？

2. 如何查看当前系统的磁盘分区和使用情况？

3. 新添加了一块硬盘 /dev/sdb，请描述创建分区、格式化、挂载和配置开机自动挂载的完整步骤。

4. 什么是 LVM？使用 LVM 有什么好处？

5. 创建 RAID 1 阵列并配置为自动挂载的详细步骤是什么？

6. 如何检查和修复 ext4 文件系统的错误？

7. 系统内存不足，如何添加 swap 空间？描述创建 swap 文件的方法。

8. 解释磁盘配额的作用，如何为用户设置磁盘配额限制？

## 7.9 参考资料与延伸阅读

- `man mkfs`
- `man fsck`
- `man mount`
- `man lvm`
- `man mdadm`
- `man quota`
- [鸟哥的 Linux 私房菜 - 磁盘与文件系统管理](https://linux.vbird.org/linux_basic/centos7/0230filesystem.php)
- [LVM 指南](https://www.tldp.org/HOWTO/LVM-HOWTO/)
- [RAID 技术详解](https://raid.wiki.kernel.org/)

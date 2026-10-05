---
collection:
  profile: wiki
  id: Linux
title: 第二章、主机规划与磁盘分区
date: 2024-01-01
updated: 2024-01-01
tags:
  - Linux
  - 磁盘分区
  - 硬件
---

# 第二章、主机规划与磁盘分区

## 2.1 Linux与硬件的搭配

### 认识计算机硬件

在开始学习Linux之前，我们需要了解计算机的基本硬件组成。

**主要硬件组件：**

| 组件 | 功能 | Linux中的设备名 |
|------|------|-----------------|
| **CPU** | 中央处理器，执行指令 | /proc/cpuinfo |
| **内存 (RAM)** | 临时存储运行中的程序和数据 | /proc/meminfo |
| **硬盘** | 永久存储数据 | /dev/sda, /dev/nvme0n1 |
| **主板** | 连接所有组件 | - |
| **显卡** | 图形处理 | /dev/fb0 |
| **网卡** | 网络连接 | /dev/eth0, /dev/wlan0 |
| **电源** | 供电 | - |

### 查看硬件信息

```bash
# 查看CPU信息
cat /proc/cpuinfo
lscpu

# 查看内存信息
cat /proc/meminfo
free -h
lsmem

# 查看硬盘信息
lsblk
fdisk -l
parted -l
ls -l /dev/sd* /dev/nvme*

# 查看PCI设备
lspci
lspci | grep -i vga  # 显卡
lspci | grep -i net  # 网卡

# 查看USB设备
lsusb

# 查看硬件详细信息
dmidecode
dmidecode -t memory  # 内存
dmidecode -t processor  # CPU

# 查看系统信息
uname -a
hostnamectl
```

## 2.2 磁盘分区

### 为什么要分区

**磁盘分区的主要目的：**

1. **安全性**：系统和个人数据分开，重装系统不影响数据
2. **便利性**：不同类型数据分类存放
3. **效率**：按需分配空间，避免浪费
4. **性能**：将频繁访问的数据放在磁盘快速区域

### 分区表类型

#### MBR (Master Boot Record)

| 特性 | 说明 |
|------|------|
| **最大磁盘容量** | 2TB |
| **最大主分区数** | 4个 |
| **扩展分区** | 1个（占用主分区名额） |
| **逻辑分区** | 扩展分区内可创建多个 |
| **分区信息存储** | 主引导扇区（512字节） |

#### GPT (GUID Partition Table)

| 特性 | 说明 |
|------|------|
| **最大磁盘容量** | 18EB（实际受限于操作系统） |
| **最大分区数** | 128个（Windows默认） |
| **主分区/扩展分区** | 没有这种限制，都是主分区 |
| **分区信息存储** | 磁盘头部和尾部（备份） |
| **兼容性** | UEFI启动模式 |

### Linux分区命名规则

| 设备类型 | 命名规则 | 示例 |
|----------|----------|------|
| **SATA/SCSI硬盘** | /dev/sd[a-z] | /dev/sda, /dev/sdb |
| **NVMe SSD** | /dev/nvme[0-9]n[1-9] | /dev/nvme0n1 |
| **虚拟设备** | /dev/vd[a-z] | /dev/vda (虚拟机) |
| **分区** | 设备名+数字 | /dev/sda1, /dev/nvme0n1p1 |
| **光驱** | /dev/sr0 或 /dev/cdrom | /dev/sr0 |

### 常用分区工具

#### fdisk (MBR分区)

```bash
# 查看分区表
fdisk -l
fdisk -l /dev/sda

# 编辑分区表
fdisk /dev/sda

# fdisk交互命令：
# m - 显示帮助
# p - 显示分区表
# n - 新建分区
# d - 删除分区
# t - 修改分区类型
# a - 设置可启动标志
# w - 写入并退出
# q - 不保存退出
```

#### gdisk / cgdisk (GPT分区)

```bash
# GPT分区工具
gdisk /dev/sda

gdisk交互命令（类似fdisk）：
# ? - 帮助
# p - 显示分区表
# n - 新建分区
# d - 删除分区
# t - 修改分区类型
# c - 修改分区名
# x - 专家命令
# w - 写入并退出
# q - 退出
```

#### parted (MBR和GPT都支持)

```bash
# 查看分区表
parted -l
parted /dev/sda print

# 交互式编辑
parted /dev/sda

# 非交互式命令
parted /dev/sda mklabel gpt          # 创建GPT分区表
parted /dev/sda mkpart primary ext4 1MiB 100GiB
parted /dev/sda mkpart primary linux-swap 100GiB 104GiB
parted /dev/sda resizepart 1 200GiB
parted /dev/sda rm 2
parted /dev/sda set 1 boot on
```

#### lsblk / blkid

```bash
# 查看块设备信息
lsblk
lsblk -f   # 显示文件系统
lsblk -o NAME,SIZE,TYPE,MOUNTPOINT,MODEL

# 查看UUID和文件系统类型
blkid
blkid /dev/sda1
```

### 文件系统类型

| 文件系统 | 特点 | 适用场景 |
|----------|------|----------|
| **ext4** | 稳定、性能好、广泛使用 | Linux系统分区、数据分区 |
| **xfs** | 高性能、大容量、扩展性好 | 大数据、日志系统 |
| **btrfs** | 现代、快照、压缩、多设备 | 桌面、开发环境 |
| **swap** | 交换分区 | 内存扩展 |
| **vfat/fat32** | 兼容性好 | UEFI启动分区、可移动设备 |
| **ntfs** | Windows兼容 | 双系统数据共享 |

### 创建文件系统

```bash
# 创建ext4文件系统
mkfs.ext4 /dev/sda1
mkfs.ext4 -L "Data" /dev/sda2     # 带标签

# 创建xfs文件系统
mkfs.xfs /dev/sdb1

# 创建vfat（FAT32）文件系统
mkfs.vfat -F 32 /dev/sdc1

# 创建swap
mkswap /dev/sda3
swapon /dev/sda3      # 启用swap
swapoff /dev/sda3     # 关闭swap

# 查看文件系统信息
dumpe2fs /dev/sda1    # ext2/3/4
tune2fs -l /dev/sda1  # 查看/修改参数
xfs_info /dev/sdb1    # xfs
```

### 挂载文件系统

```bash
# 手动挂载
mount /dev/sda1 /mnt/data
mount -t ext4 /dev/sda1 /mnt/data
mount -o rw,noatime /dev/sda1 /mnt/data

# 常用挂载选项
-o ro          # 只读
-o rw          # 读写
-o noatime     # 不更新访问时间
-o nodiratime  # 不更新目录访问时间
-o sync        # 同步写入
-o async       # 异步写入
-o remount     # 重新挂载
-o bind        # 绑定挂载

# 查看挂载
mount
cat /proc/mounts
df -h
df -hT    # 显示文件系统类型
lsblk -f

# 卸载
umount /mnt/data
umount /dev/sda1
umount -l /mnt/data    # 强制卸载（懒卸载）

# 开机自动挂载 - 编辑 /etc/fstab
cat /etc/fstab

# 格式：<设备> <挂载点> <文件系统> <选项> <dump> <pass>
# 示例：
# UUID=xxx  /home  ext4  defaults,noatime  0  2
# /dev/sda1 /mnt/data ext4 defaults 0 0

# 测试fstab配置（不实际挂载）
mount -a --dry-run

# 检查fstab是否有错误
findmnt --verify
```

## 2.3 安装Linux前的规划

### 分区方案建议

#### 基础方案（新手推荐）

| 分区 | 大小 | 文件系统 | 说明 |
|------|------|----------|------|
| /boot | 1GB | ext4 | 启动分区，UEFI需要EFI分区 |
| / | 50GB+ | ext4 | 根分区，系统和软件 |
| /home | 剩余空间 | ext4 | 用户数据 |
| swap | 4-8GB | swap | 交换分区，或使用swap文件 |

#### 高级方案

| 分区 | 大小 | 文件系统 | 说明 |
|------|------|----------|------|
| /boot/efi | 512MB | vfat | UEFI启动分区 |
| /boot | 1GB | ext4 | 传统启动文件 |
| / | 30GB | ext4/xfs | 根分区 |
| /var | 20GB+ | ext4/xfs | 日志和缓存 |
| /var/log | 10GB+ | ext4 | 日志文件 |
| /home | 剩余空间 | ext4/xfs | 用户数据 |
| /opt | 视需要 | ext4 | 第三方软件 |
| /tmp | 10GB+ | ext4 | 临时文件，或使用tmpfs |
| swap | 4-16GB | swap | 根据内存大小决定 |

#### swap大小建议

| 内存大小 | 推荐swap大小 | 说明 |
|----------|--------------|------|
| < 4GB | 2-4GB | 内存小，需要较大swap |
| 4-8GB | 2-4GB | 正常使用 |
| 8-16GB | 2-4GB | 或根据需要调整 |
| 16-32GB | 4-8GB | 或使用swap文件 |
| > 32GB | 4GB或禁用 | 根据使用情况决定 |

**swap文件替代分区：**
```bash
# 创建swap文件
sudo dd if=/dev/zero of=/swapfile bs=1M count=4096
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 添加到fstab
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 系统要求

#### CentOS 7 最低要求

| 项目 | 要求 |
|------|------|
| **CPU** | 1 GHz 或更高 |
| **内存** | 1 GB (建议 2 GB+) |
| **硬盘** | 20 GB 可用空间 |
| **网络** | 以太网或无线网卡 |

#### CentOS 7 推荐配置

| 项目 | 推荐 |
|------|------|
| **CPU** | 2核或以上 |
| **内存** | 4 GB 或更多 |
| **硬盘** | 50 GB SSD 或更大 |
| **网络** | 千兆以太网 |

## 2.4 重点回顾

1. **硬件认知**：了解CPU、内存、硬盘等关键硬件及其Linux设备名
2. **分区必要性**：安全性、便利性、效率、性能
3. **分区表类型**：
   - MBR：最大2TB，4个主分区
   - GPT：最大18EB，128个分区，需要UEFI
4. **分区命名**：/dev/sda1（SATA）、/dev/nvme0n1p1（NVMe）
5. **分区工具**：fdisk（MBR）、gdisk（GPT）、parted（两者）
6. **文件系统**：ext4（通用）、xfs（大容量）、swap（交换）
7. **分区方案**：建议至少/、/home、swap三个分区
8. **swap大小**：根据内存大小，一般2-4GB或更大
9. **挂载点**：分区必须挂载到目录树才能使用
10. **fstab**：/etc/fstab配置开机自动挂载

## 2.5 本章习题

1. 解释MBR和GPT分区表的主要区别。你的电脑使用哪种分区表？

2. Linux中SATA硬盘和NVMe SSD的设备名分别是什么格式？

3. 为什么要进行磁盘分区？至少列出3个理由。

4. 使用fdisk或parted查看你当前系统的分区表，并解释每个分区的作用。

5. 为一个8GB内存、500GB硬盘的服务器设计分区方案，要求有/、/home、/var、swap分区。

6. 解释swap分区的作用。如果系统有16GB内存，你建议swap设置多大？

7. 如何在Linux中查看硬盘UUID？UUID在fstab中有什么作用？

8. 实践：使用fdisk或gdisk创建一个测试分区，然后格式化为ext4并挂载到/mnt/test。

## 2.6 参考资料与延伸阅读

- `man fdisk`
- `man gdisk`
- `man parted`
- `man mkfs.ext4`
- `man mount`
- `man fstab`
- [鸟哥的Linux私房菜 - 主机规划与磁盘分区](https://linux.vbird.org/linux_basic/centos7/0130design.php)

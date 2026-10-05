---
collection:
  profile: wiki
  id: Linux
title: 第三章、安装 CentOS 7.x
date: 2024-01-01
updated: 2024-01-01
tags:
  - Linux
  - CentOS
  - 安装
---

# 第三章、安装 CentOS 7.x

## 3.1 本练习机的规划--尤其是分区参数

### 安装前的准备工作

在开始安装 CentOS 7 之前，需要规划好以下内容：

**硬件要求检查：**
- CPU：64位处理器
- 内存：至少 1GB（推荐 2GB 以上）
- 硬盘：至少 20GB 可用空间
- 网络：以太网或无线网卡

**下载 CentOS 7：**
```bash
# 官方下载地址
https://www.centos.org/download/

# 常用镜像站
https://mirrors.aliyun.com/centos/7/isos/x86_64/
https://mirrors.tuna.tsinghua.edu.cn/centos/7/isos/x86_64/

# 推荐的 ISO 文件
CentOS-7-x86_64-DVD-2009.iso    # 完整版（约 4GB）
CentOS-7-x86_64-Minimal-2009.iso # 最小化安装（约 900MB）
```

### 分区规划示例

**方案一：基础分区（推荐新手）**

| 分区 | 大小 | 文件系统 | 说明 |
|------|------|----------|------|
| /boot | 1GB | ext4 | 启动分区 |
| / | 50GB | ext4 | 根分区 |
| /home | 剩余空间 | ext4 | 用户数据 |
| swap | 4GB | swap | 交换分区 |

**方案二：高级分区（服务器推荐）**

| 分区 | 大小 | 文件系统 | 说明 |
|------|------|----------|------|
| /boot | 1GB | ext4 | 启动分区 |
| /boot/efi | 512MB | vfat | UEFI 分区 |
| / | 30GB | ext4 | 根分区 |
| /var | 20GB | ext4 | 日志和缓存 |
| /var/log | 10GB | ext4 | 日志文件 |
| /home | 剩余空间 | ext4 | 用户数据 |
| /tmp | 10GB | ext4 | 临时文件 |
| swap | 8GB | swap | 交换分区 |

## 3.2 开始安装 CentOS 7

### 制作启动介质

**使用 Rufus（Windows）：**
1. 下载 Rufus：https://rufus.ie/
2. 插入 U 盘（至少 8GB）
3. 选择 ISO 文件
4. 分区类型：GPT 或 MBR（根据电脑支持）
5. 点击开始

**使用 dd（Linux/Mac）：**
```bash
# 查看 U 盘设备名
lsblk

# 卸载 U 盘分区
sudo umount /dev/sdX*

# 写入 ISO（注意：sdX 是整个设备，不是分区）
sudo dd if=CentOS-7-x86_64-DVD-2009.iso of=/dev/sdX bs=4M status=progress

# 同步缓冲区
sync
```

### 安装步骤

**1. 启动安装程序**
- 插入启动 U 盘
- 开机按 F12/F2/Del 进入 BIOS/UEFI
- 选择从 U 盘启动
- 选择 "Install CentOS 7"

**2. 选择语言**
- 安装过程语言：中文 → 简体中文
- 键盘布局：汉语

**3. 安装摘要**

配置以下项目：

**日期和时间**
- 选择时区：亚洲/上海
- 开启网络时间同步

**键盘**
- 添加布局：汉语

**语言支持**
- 添加中文支持

**安装源**
- 自动检测到的安装介质

**软件选择**
- 最小安装（服务器推荐）
- 带 GUI 的服务器（需要图形界面）
- GNOME 桌面（桌面使用）
- 开发工具（可选）

**安装位置（关键）**

**自动分区：**
- 选择 "自动配置分区"

**手动分区（推荐）：**
1. 选择 "我要配置分区"
2. 选择分区方案：标准分区
3. 点击 "+" 添加分区：

| 挂载点 | 期望容量 | 文件系统 |
|--------|----------|----------|
| /boot | 1GB | ext4 |
| / | 50GB | ext4 |
| /home | 剩余 | ext4 |
| swap | 4GB | swap |

4. 接受更改

**网络和主机名**
- 配置网络连接
- 设置主机名（如：centos7-server）

**4. 开始安装**
- 点击 "开始安装"
- 设置 ROOT 密码
- 创建用户（可选但推荐）

**5. 完成安装**
- 安装完成后点击 "重启"
- 移除安装介质

### 安装后的基本配置

**1. 更新系统**
```bash
sudo yum update -y
```

**2. 配置网络**
```bash
# 查看IP地址
ip addr

# 配置静态IP（编辑网络配置文件）
sudo vi /etc/sysconfig/network-scripts/ifcfg-eth0

# 示例配置：
TYPE=Ethernet
BOOTPROTO=static
IPADDR=192.168.1.100
NETMASK=255.255.255.0
GATEWAY=192.168.1.1
DNS1=8.8.8.8
DNS2=114.114.114.114
ONBOOT=yes

# 重启网络服务
sudo systemctl restart network
```

**3. 配置防火墙**
```bash
# 查看防火墙状态
sudo systemctl status firewalld

# 开放端口
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload

# 或者关闭防火墙（测试环境）
sudo systemctl stop firewalld
sudo systemctl disable firewalld
```

**4. 安装常用工具**
```bash
# 安装基本工具
sudo yum install -y vim wget curl net-tools telnet tree htop

# 安装开发工具
sudo yum groupinstall -y "Development Tools"

# 安装EPEL源
sudo yum install -y epel-release
```

## 3.3 多重开机安装流程与管理（Option）

### Windows + Linux 双系统

**安装顺序：**
1. 先安装 Windows（如果还没有）
2. 为 Linux 预留空间（压缩卷）
3. 安装 Linux 到预留空间

**注意事项：**
- 关闭 Windows 的快速启动
- 关闭 Secure Boot（或配置 Linux 支持）
- 使用相同的启动模式（UEFI 或 Legacy）

### 使用 GRUB 管理多重开机

```bash
# 查看 GRUB 配置
cat /boot/grub2/grub.cfg

# 更新 GRUB 配置
sudo grub2-mkconfig -o /boot/grub2/grub.cfg

# 设置默认启动项
sudo grub2-set-default 0  # 第一个菜单项

# 查看默认启动项
sudo grub2-editenv list
```

## 3.4 重点回顾

1. **安装前准备**：检查硬件要求，下载 CentOS 7 ISO
2. **分区规划**：建议至少 /boot、/、/home、swap 四个分区
3. **启动介质**：使用 Rufus（Windows）或 dd（Linux）制作启动U盘
4. **安装过程**：语言选择 → 分区配置 → 软件选择 → 设置密码 → 开始安装
5. **安装后配置**：网络配置、防火墙、系统更新、常用工具安装
6. **双系统**：先安装 Windows，再安装 Linux，使用 GRUB 管理启动

## 3.5 本章习题

1. CentOS 7 的最小硬件要求是什么？推荐配置呢？

2. 列举三种制作 Linux 启动U盘的工具或方法。

3. 为以下场景设计分区方案：
   - 场景A：个人桌面，500GB硬盘，8GB内存
   - 场景B：服务器，2TB硬盘，32GB内存

4. 描述 CentOS 7 的安装步骤，从启动U盘到完成安装。

5. 安装完成后，应该进行哪些基本配置？

6. 如果你要安装 Windows 和 CentOS 双系统，正确的安装顺序是什么？需要注意什么？

7. 如何查看和修改 GRUB 的默认启动项？

8. 实践：在虚拟机中安装 CentOS 7，并完成基本配置。

## 3.6 参考资料与延伸阅读

- [CentOS 官方文档](https://docs.centos.org/)
- [CentOS 下载页面](https://www.centos.org/download/)
- [Rufus 启动盘制作工具](https://rufus.ie/)
- [鸟哥的Linux私房菜 - 安装CentOS 7.x](https://linux.vbird.org/linux_basic/centos7/0150installcentos.php)
- [GRUB 2 手册](https://www.gnu.org/software/grub/manual/grub.html)

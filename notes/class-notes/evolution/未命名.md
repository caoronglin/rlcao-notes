---
collection:
  profile: notebook
  id: class-notes
title: 未命名
date: 2026-10-06
---
明白：**不用 Tailscale，直接让外部访问这台 Windows Server 虚拟机**。你已经创建好了 VM，AMD CPU，所以现在主要做三件事：

```text
1. 给已创建的 winserver 加 AMD 适用的 Hyper-V 优化
2. 选择一种“暴露方式”：推荐端口转发，或者桥接 br0
3. Windows 内开启 RDP、防火墙、用户权限
```

下面按你现在的情况来。

---

# 方案选择

## 方案 A：宿主机端口转发到虚拟机，推荐先用这个

外部访问方式：

```text
公网IP:53389  ->  Ubuntu宿主机  ->  Windows虚拟机:3389
```

优点：

```text
不需要改 br0
不容易把宿主机网络搞断
适合你已经用 default NAT 创建好的虚拟机
```

缺点：

```text
只暴露指定端口，比如 RDP 3389
虚拟机不会直接获得公网/局域网独立 IP
```

## 方案 B：br0 桥接

外部访问方式：

```text
Windows虚拟机自己拿一个局域网/公网 IP
外部直接访问 Windows虚拟机IP:3389
```

优点：

```text
虚拟机像一台真实物理机
```

缺点：

```text
要改宿主机网络
SSH 远程配置时有断网风险
```

你现在说"直接本机暴露"，我建议先用 **方案 A：端口转发**。

---

# 一、确认虚拟机当前网络

宿主机执行：

```bash
virsh --connect qemu:///system domiflist winserver
```

如果看到类似：

```text
Source: default
Model: virtio
```

说明虚拟机在 libvirt NAT 网络后面，适合做端口转发。

再看 default 网络：

```bash
sudo virsh net-list --all
ip addr show virbr0
```

正常应该有：

```text
default active
virbr0 192.168.122.1/24
```

---

# 二、获取 Windows 虚拟机 IP

如果你已经安装了 `virtio-win-guest-tools.exe`，执行：

```bash
virsh --connect qemu:///system domifaddr winserver --source agent
```

如果没装 Guest Agent，可以用 DHCP 租约看：

```bash
virsh --connect qemu:///system net-dhcp-leases default
```

你要找到类似：

```text
192.168.122.123
```

下面假设 Windows 虚拟机 IP 是：

```text
192.168.122.123
```

你实际操作时要替换成自己的。

---

# 三、宿主机开启 IP 转发

临时开启：

```bash
sudo sysctl -w net.ipv4.ip_forward=1
```

永久开启：

```bash
echo 'net.ipv4.ip_forward=1' | sudo tee /etc/sysctl.d/99-kvm-forward.conf
sudo sysctl --system
```

确认：

```bash
sysctl net.ipv4.ip_forward
```

应该输出：

```text
net.ipv4.ip_forward = 1
```

---

# 四、把宿主机端口转发到 Windows RDP

我建议不要直接暴露宿主机 `3389`，而是用一个外部端口，比如：

```text
宿主机公网IP:53389  ->  Windows虚拟机:3389
```

这样做：

```bash
sudo nft add table ip kvm_nat 2>/dev/null

sudo nft 'add chain ip kvm_nat prerouting { type nat hook prerouting priority -100; policy accept; }' 2>/dev/null
sudo nft 'add chain ip kvm_nat postrouting { type nat hook postrouting priority 100; policy accept; }' 2>/dev/null
sudo nft 'add chain ip kvm_nat forward { type filter hook forward priority 0; policy accept; }' 2>/dev/null

sudo nft add rule ip kvm_nat prerouting tcp dport 53389 dnat to 192.168.122.123:3389
sudo nft add rule ip kvm_nat postrouting ip daddr 192.168.122.123 tcp dport 3389 masquerade
```

查看规则：

```bash
sudo nft list ruleset
```

然后外部电脑连接：

```text
宿主机公网IP:53389
```

Windows 远程桌面里填写：

```text
x.x.x.x:53389
```

---

# 五、让 Nftables 规则持久化

安装 nftables：

```bash
sudo apt install -y nftables
sudo systemctl enable --now nftables
```

保存当前规则：

```bash
sudo nft list ruleset | sudo tee /etc/nftables.conf
```

检查：

```bash
sudo systemctl restart nftables
sudo nft list ruleset
```

---

# 六、如果你用了 UFW

如果 UFW 是开启的：

```bash
sudo ufw status
```

放行外部 RDP 转发端口：

```bash
sudo ufw allow 53389/tcp
```

如果只允许某个固定公网 IP 访问，比如你的办公电脑公网 IP 是 `1.2.3.4`，更安全：

```bash
sudo ufw allow from 1.2.3.4 to any port 53389 proto tcp
```

不建议直接全网开放 3389 或 53389。RDP 暴露公网很容易被扫描和爆破。

---

# 七、Windows 内开启 RDP

在 Windows Server 管理员 PowerShell 执行：

```powershell
Set-ItemProperty `
  -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server" `
  -Name "fDenyTSConnections" `
  -Value 0

Set-Service TermService -StartupType Automatic
Start-Service TermService
```

中文系统里 `Remote Desktop` 规则组可能不存在，所以直接新建防火墙规则：

```powershell
New-NetFirewallRule `
  -DisplayName "Allow RDP TCP 3389" `
  -Direction Inbound `
  -Protocol TCP `
  -LocalPort 3389 `
  -Action Allow

New-NetFirewallRule `
  -DisplayName "Allow RDP UDP 3389" `
  -Direction Inbound `
  -Protocol UDP `
  -LocalPort 3389 `
  -Action Allow
```

检查 3389 是否监听：

```powershell
netstat -ano | findstr ":3389"
```

看到：

```text
0.0.0.0:3389 LISTENING
```

说明 RDP 已经起来。

---

# 八、创建远程登录用户

管理员 PowerShell：

```powershell
New-LocalUser "rdp01" -Password (Read-Host -AsSecureString "Password") -FullName "RDP User 01"
Add-LocalGroupMember -SID "S-1-5-32-555" -Member "rdp01"
```

`S-1-5-32-555` 是 Remote Desktop Users 组，中文系统也能用。

如果你要给管理员权限：

```powershell
Add-LocalGroupMember -Group "Administrators" -Member "rdp01"
```

不建议日常直接用 Administrator 暴露公网登录。

---

# 九、外部连接测试

在外部 Windows 电脑上：

```powershell
Test-NetConnection 宿主机公网IP -Port 53389
```

如果成功：

```text
TcpTestSucceeded : True
```

然后打开远程桌面：

```text
Win + R
mstsc
```

填写：

```text
宿主机公网IP:53389
```

---

# 十、AMD CPU 的 Hyper-V 优化，给已创建 VM 加

你是 AMD CPU，不要加 Intel 专属的 `evmcs`。

先关闭虚拟机：

```bash
virsh --connect qemu:///system shutdown winserver
```

如果关不掉：

```bash
virsh --connect qemu:///system destroy winserver
```

备份 XML：

```bash
mkdir -p /mnt/data01/winserver/backup

virsh --connect qemu:///system dumpxml winserver \
  > /mnt/data01/winserver/backup/winserver-before-amd-hyperv.xml
```

编辑：

```bash
virsh --connect qemu:///system edit winserver
```

找到 `<features>` 段，改成这个 AMD 版：

```xml
<features>
  <acpi/>
  <apic/>
  <hyperv mode='custom'>
    <relaxed state='on'/>
    <vapic state='on'/>
    <spinlocks state='on' retries='8191'/>
    <vendor_id state='on' value='KVM Hv'/>
    <vpindex state='on'/>
    <runtime state='on'/>
    <synic state='on'/>
    <stimer state='on'>
      <direct state='on'/>
    </stimer>
    <frequencies state='on'/>
    <reset state='on'/>
    <tlbflush state='on'/>
    <reenlightenment state='on'/>
    <ipi state='on'/>
  </hyperv>
</features>
```

再找到 `<clock>` 段，建议改成：

```xml
<clock offset='localtime'>
  <timer name='rtc' tickpolicy='catchup'/>
  <timer name='pit' tickpolicy='delay'/>
  <timer name='hpet' present='no'/>
  <timer name='hypervclock' present='yes'/>
</clock>
```

保存后启动：

```bash
virsh --connect qemu:///system start winserver
```

验证：

```bash
virsh --connect qemu:///system dumpxml winserver | grep -A30 "<hyperv"
virsh --connect qemu:///system dumpxml winserver | grep -A10 "<clock"
```

如果保存 XML 时提示某个特性不支持，就删掉这两个：

```xml
<reenlightenment state='on'/>
<ipi state='on'/>
```

保留最稳定版：

```xml
<features>
  <acpi/>
  <apic/>
  <hyperv mode='custom'>
    <relaxed state='on'/>
    <vapic state='on'/>
    <spinlocks state='on' retries='8191'/>
    <vendor_id state='on' value='KVM Hv'/>
    <vpindex state='on'/>
    <runtime state='on'/>
    <synic state='on'/>
    <stimer state='on'>
      <direct state='on'/>
    </stimer>
    <frequencies state='on'/>
    <reset state='on'/>
    <tlbflush state='on'/>
  </hyperv>
</features>
```

---

# 十一、如果你想改成 Br0 桥接暴露

如果你想让 Windows VM 直接拿到和宿主机同网段 IP，再做这个。你的物理网卡之前是：

```text
eno8303
```

创建 `/etc/netplan/01-br0.yaml`：

```yaml
network:
  version: 2
  renderer: NetworkManager

  ethernets:
    eno8303:
      match:
        name: "eno8303"
      dhcp4: no
      dhcp6: no

  bridges:
    br0:
      interfaces:
        - eno8303
      dhcp4: yes
      dhcp6: no
      parameters:
        stp: false
        forward-delay: 0
```

测试：

```bash
sudo netplan try
```

确认没断网后：

```bash
sudo netplan apply
```

然后关机修改 VM 网卡：

```bash
virsh --connect qemu:///system shutdown winserver
virsh --connect qemu:///system edit winserver
```

把：

```xml
<interface type='network'>
  <source network='default'/>
  <model type='virtio'/>
</interface>
```

改成：

```xml
<interface type='bridge'>
  <source bridge='br0'/>
  <model type='virtio'/>
</interface>
```

启动：

```bash
virsh --connect qemu:///system start winserver
```

Windows 里执行：

```powershell
ipconfig
```

如果拿到你局域网/公网网段的 IP，就可以直接访问：

```text
Windows虚拟机IP:3389
```

---

# 我建议你现在用的最终方案

```text
Ubuntu 宿主机：
  公网暴露 53389/tcp

libvirt：
  default NAT 网络

Windows VM：
  192.168.122.x:3389

访问：
  外部电脑 mstsc 连接 宿主机公网IP:53389
```

最关键的几条命令是：

```bash
# 查 Windows VM IP
virsh --connect qemu:///system net-dhcp-leases default

# 开宿主机转发
sudo sysctl -w net.ipv4.ip_forward=1
echo 'net.ipv4.ip_forward=1' | sudo tee /etc/sysctl.d/99-kvm-forward.conf
sudo sysctl --system

# 假设 Windows VM IP 是 192.168.122.123
sudo nft add table ip kvm_nat 2>/dev/null
sudo nft 'add chain ip kvm_nat prerouting { type nat hook prerouting priority -100; policy accept; }' 2>/dev/null
sudo nft 'add chain ip kvm_nat postrouting { type nat hook postrouting priority 100; policy accept; }' 2>/dev/null
sudo nft add rule ip kvm_nat prerouting tcp dport 53389 dnat to 192.168.122.123:3389
sudo nft add rule ip kvm_nat postrouting ip daddr 192.168.122.123 tcp dport 3389 masquerade

# 持久化
sudo apt install -y nftables
sudo systemctl enable --now nftables
sudo nft list ruleset | sudo tee /etc/nftables.conf
```

然后外部远程桌面连接：

```text
宿主机公网IP:53389
```

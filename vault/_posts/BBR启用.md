BBR（Bottleneck Bandwidth and Round-trip propagation time）是 Google 开发的 TCP 拥塞控制算法，能显著提升高延迟、高丢包场景下的网络吞吐量和稳定性（特别适合 VPS/服务器回国线路、科学上网节点、文件传输等）。

目前（2026 年）主流 Linux 发行版内核基本都内置了 BBR，大部分情况下**不需要编译内核或安装额外模块**，只需几行命令就能开启。

### 先检查你的内核版本和当前情况（强烈推荐先跑这些命令）

用 SSH 登录你的 VPS/服务器，执行：

```bash
uname -r                  # 查看内核版本（需 ≥4.9 才有 BBR，≥5.4 推荐，≥6.1+ 有 BBR v2/v3 改进）
```

```bash
sysctl net.ipv4.tcp_available_congestion_control
# 正常输出类似：net.ipv4.tcp_available_congestion_control = reno cubic bbr（有 bbr 就说明内核支持）
```

```bash
sysctl net.ipv4.tcp_congestion_control
# 当前默认算法，通常是 cubic
```

```bash
lsmod | grep bbr
# 如果没输出，说明模块还没加载
```

如果看到 `bbr` 在可用列表里，直接走**方法一**（最简单，99% 用户用这个就够）。

### 方法一：最推荐 - 直接开启内置 BBR（无需换内核）

适用于 Ubuntu 20.04+ / Debian 11+ / CentOS 8+ / Rocky 8+ / AlmaLinux 等现代系统（内核 ≥4.19 基本都有）。

```bash
# 1. 编辑 sysctl 配置（推荐用这个方式，永久生效）
sudo tee -a /etc/sysctl.conf <<EOF
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr
EOF

# 2. 立即应用（或重启也行）
sudo sysctl -p

# 3. 加载模块（如果没自动加载）
sudo modprobe tcp_bbr

# 4. 验证是否成功
sysctl net.ipv4.tcp_congestion_control     # 应该输出 = bbr
lsmod | grep bbr                           # 应该看到 tcp_bbr
```

重启服务器后再次检查（推荐），确认还是 bbr 即可。

**额外优化**（可选，但强烈建议加，尤其是高并发场景）：

```bash
sudo tee -a /etc/sysctl.conf <<EOF
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
net.ipv4.tcp_window_scaling = 1
net.ipv4.tcp_fastopen = 3
EOF

sudo sysctl -p
```

### 方法二：如果内核太老（<4.9）或想用最新 BBR v3 / BBRPlus / 魔改版

- **BBR v3**（2025 年仍在 upstream 过程中，很多内核还没合并完整）：需要手动编译或用一键脚本换内核。
- **BBRPlus / 暴力魔改 / BBR2**：社区魔改版，更激进，适合回国线路，但可能不稳定或不公平。

**推荐一键脚本**（2025-2026 年还在维护的几个，选一个跑）：

1. **teddysun 的经典加速脚本**（支持 BBR / BBRPlus / Lotserver 等，不换内核的版本也很多）：

   ```bash
   wget -N --no-check-certificate https://github.com/teddysun/across/raw/master/bbr.sh && chmod +x bbr.sh && ./bbr.sh
   ```

   或更全的：

   ```bash
   wget -N --no-check-certificate "https://raw.githubusercontent.com/chiakge/Linux-NetSpeed/master/tcp.sh" && chmod +x tcp.sh && ./tcp.sh
   ```

   运行后选 1（BBR 原版）或 2（BBRPlus）等，按提示操作，重启。

2. **byJoey 的 BBR v3 专用脚本**（如果想最新 v3）：

   ```bash
   bash <(curl -Ls https://raw.githubusercontent.com/byJoey/Actions-bbr-v3/main/install.sh)
   ```

   界面友好，支持切换 BBR v3 + fq / cake 等。

**注意**：
- OpenVZ 虚拟化基本不支持换内核/BBRPlus，只能用原版 BBR（方法一）。
- KVM / VMware / Hyper-V / 物理机 都支持。
- 安装后建议用 `iperf3` 或实际测速（speedtest / 文件下载）对比开启前后。
- 如果你是服务端（Xray/V2Ray），开启 BBR 后客户端下载/上传速度通常有明显提升，尤其高延迟线路。

跑完命令后，贴一下 `sysctl net.ipv4.tcp_congestion_control` 的输出 + 你的内核版本（uname -r），我帮你确认是否成功，或者给你进一步优化建议！
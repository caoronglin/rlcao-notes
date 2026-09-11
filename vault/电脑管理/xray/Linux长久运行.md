想让 Xray 在 Ubuntu 服务器上长期稳定运行，最推荐、也最专业的方法是使用 **systemd 服务**。

### ⚙️ 推荐方案：配置 systemd 服务

使用 systemd 来管理 Xray，能实现**开机自启、后台静默运行、崩溃自动重启**、统一日志管理和权限控制等功能。以下教程假设你已通过官方脚本或手动方式将 Xray 安装到了系统默认路径（如 `/usr/local/bin/xray`）。

#### 1. 创建服务配置文件
使用文本编辑器（如 `nano`）为 Xray 创建一个新的 systemd 服务文件：
```bash
sudo nano /etc/systemd/system/xray.service
```

#### 2. 编写服务配置
将以下内容复制到文件中。请根据你的实际情况修改 `ExecStart` 这一行，确保配置文件的路径正确。

```ini
[Unit]
Description=Xray Service
Documentation=https://xtls.github.io/
After=network.target nss-lookup.target

[Service]
# 以 root 用户运行，确保有权限绑定低端口
User=root
# 防止权限提升
NoNewPrivileges=true
# 启动命令，请务必检查配置文件路径（单文件配置例子）
ExecStart=/usr/local/bin/xray run -config /usr/local/etc/xray/config.json

# (多文件配置例子) 如需使用多文件配置，请替换上面一行，并指定配置文件夹路径:
# ExecStart=/usr/local/bin/xray run -confdir /usr/local/etc/xray/conf

# 崩溃后自动重启
Restart=on-failure
RestartPreventExitStatus=23

# 资源限制，适应高并发代理场景
LimitNPROC=10000
LimitNOFILE=1000000

# 增强安全性 (可选)
PrivateTmp=true
ProtectSystem=full

[Install]
# 在系统进入多用户模式时启动
WantedBy=multi-user.target
```
**参数说明：**
*   **`ExecStart`**: 最关键的一项，指定了启动 Xray 核心程序的命令和配置文件的位置。
*   **`Restart=on-failure`**: 设定服务在非正常退出时自动重启。
*   **`ProtectSystem=full`** 和 **`PrivateTmp=true`**: 这两项能够有效增强服务的安全性，限制其对系统文件的访问并提供一个隔离的临时目录。

#### 3. 启动并验证服务
执行以下命令来启动服务，并设置开机自启：
```bash
# 重载 systemd 配置
sudo systemctl daemon-reload
# 设置开机自启
sudo systemctl enable xray
# 启动 Xray 服务
sudo systemctl start xray
# 检查服务运行状态
sudo systemctl status xray
```
如果命令输出中看到 `Active: active (running)`，就表明 Xray 服务已成功启动。

#### 4. 常用管理命令
*   `sudo systemctl stop xray`：停止服务。
*   `sudo systemctl restart xray`：重启服务。
*   `journalctl -u xray -f`：实时查看 Xray 的运行日志。
*   `systemctl is-active --quiet xray`：在脚本中用于静默检查服务是否处于活动状态。

### 🧰 备选方案：用于临时调试

如果你只是想临时后台运行 Xray 进行测试，可以使用 `nohup` 或 `screen` 这样的工具，但需要注意，这些方法不适合长期部署。

*   **nohup**：最简单的后台运行方式，终端关闭后程序不中断。对日志和进程的管理没有 systemd 方便。
    ```bash
    # 运行命令后，即使关闭终端，Xray也会在后台运行，日志输出到nohup.out
    nohup /usr/local/bin/xray run -config /usr/local/etc/xray/config.json &
    ```

*   **tmux/screen**：终端复用器工具，能创建一个“虚拟窗口”。你可以随时重新接入查看程序输出。任务执行完后，这个“窗口”（会话）可以关闭。**但在系统重启后，你需要手动重新创建并启动 Xray**。
    ```bash
    # 使用tmux创建一个名为xray-session的会话窗口
    tmux new -s xray-session
    # 在tmux窗口中启动xray (直接运行)
    /usr/local/bin/xray run -config /usr/local/etc/xray/config.json
    # 按组合键 Ctrl+B, 然后按 D 即可安全脱离会话
    ```

### 🔧 附加配置建议

为了进一步增强长期运行的稳定性，可以参考以下建议：

*   **Bash 监控脚本**：创建一个简单的脚本，通过 `crontab` 定时执行，自动检查并重启挂掉的服务。
    ```bash
    #!/bin/bash
    # 检查xray服务是否正在运行
    if ! systemctl is-active --quiet xray; then
        # 如果不是，则尝试重启
        systemctl restart xray
        echo "$(date): Xray服务重启" >> /var/log/xray_monitor.log
    fi
    ```
    将此脚本添加到 `crontab`：
    ```bash
    # 编辑crontab
    crontab -e
    # 添加一行，每分钟执行一次检查
    * * * * * /path/to/your/script.sh
    ```
    这可以在 systemd 自带的 `Restart=on-failure` 之外，再添一层保障。

*   **配置自动备份**：一个已备份且正确的配置文件是恢复服务的关键。
    ```bash
    #!/bin/bash
    BACKUP_DIR="/backup/xray"
    CONFIG_FILE="/usr/local/etc/xray/config.json"
    DATE=$(date +%Y%m%d_%H%M%S)
    mkdir -p $BACKUP_DIR
    cp $CONFIG_FILE "${BACKUP_DIR}/config_${DATE}.json"
    # 删除7天前的旧备份
    find $BACKUP_DIR -name "config_*.json" -mtime +7 -delete
    ```
    同样地，可以将这个备份脚本也添加到 `crontab` 中每天执行。

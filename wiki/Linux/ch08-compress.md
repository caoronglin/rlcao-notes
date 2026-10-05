---
collection:
  profile: wiki
  id: Linux
title: 第八章、文件与文件系统的压缩、打包与备份
date: 2024-01-01
updated: 2024-01-01
tags: [Linux, 压缩, 打包, 备份]
---

# 第八章、文件与文件系统的压缩、打包与备份

## 8.1 压缩文件的用途与技术

### 为什么需要压缩

1. **节省存储空间**：压缩后的文件占用更少的磁盘空间
2. **提高传输效率**：网络传输时减少时间和带宽消耗
3. **归档备份**：将多个文件打包成单一文件便于管理

### 压缩的原理

压缩通过消除数据中的冗余信息来减小文件大小：
- **无损压缩**：可以完全恢复原始数据（gzip、bzip2、xz）
- **有损压缩**：牺牲部分质量换取更高压缩率（jpeg、mp3）

## 8.2 Linux 系统常见的压缩指令

### 常见压缩工具对比

| 工具 | 扩展名 | 压缩率 | 速度 | 特点 |
|------|--------|--------|------|------|
| **gzip** | .gz | 中等 | 快 | 最常用，兼容性好 |
| **bzip2** | .bz2 | 高 | 慢 | 压缩率优于 gzip |
| **xz** | .xz | 最高 | 最慢 | 现代压缩标准 |
| **zip** | .zip | 中等 | 快 | Windows 兼容 |
| **compress** | .Z | 低 | 快 | 已过时，很少使用 |

### gzip 和 zcat

**gzip - 最流行的压缩工具：**

```bash
# 压缩文件（原始文件会被删除）
gzip filename              # 生成 filename.gz

# 压缩时保留原始文件
gzip -c filename > filename.gz    # 使用管道保留原文件
gzip -k filename           # 某些版本支持 -k (keep)

# 解压缩
gunzip filename.gz         # 或 gzip -d filename.gz

# 常用选项
-1 ... -9                  # 压缩级别，1最快/压缩率最低，9最慢/压缩率最高（默认6）
-c                         # 输出到标准输出，不删除原文件
-d                         # 解压缩
-f                         # 强制，覆盖现有文件
-h                         # 帮助
-k                         # 保留原文件（非所有版本支持）
-l                         # 列出压缩文件信息
-L                         # 显示许可证
-n                         # 不保存/恢复原始文件名和时间戳
-N                         # 保存/恢复原始文件名和时间戳（默认）
-q                         # 安静模式
-r                         # 递归处理目录（压缩目录下所有文件）
-t                         # 测试压缩文件的完整性
-v                         # 详细模式
-V                         # 显示版本

# 示例
gzip -9 -k largefile.txt          # 最高压缩级别，保留原文件
gzip -r /path/to/directory/       # 递归压缩目录下所有文件
gzip -l file.gz                   # 查看压缩信息
gzip -t file.gz                   # 测试文件完整性
```

**zcat/zmore/zless - 不解压查看压缩文件：**

```bash
# 查看压缩文件内容（不解压）
zcat file.gz                # 等同于 cat，直接输出到屏幕
zmore file.gz               # 等同于 more，分页显示
zless file.gz               # 等同于 less，更好的分页
zgrep "pattern" file.gz     # 在压缩文件中搜索

# zcat 也可以查看 .Z 文件（compress 格式）

# 将 zcat 输出重定向
gzcat file.gz > output.txt  # 解压到文件
zcat file.gz | grep pattern  # 管道处理
```

### bzip2 和 bzcat

**bzip2 - 更高压缩率：**

```bash
# 压缩（默认删除原文件）
bzip2 filename             # 生成 filename.bz2

# 保留原文件
bzip2 -k filename
bzip2 -c filename > filename.bz2

# 解压缩
bunzip2 filename.bz2       # 或 bzip2 -d filename.bz2

# 常用选项
-1 ... -9                   # 压缩级别（默认9，压缩率最高但最慢）
-c                          # 输出到标准输出
-d                          # 解压缩
-f                          # 强制
-k                          # 保留原文件
-s                          # 减少内存使用（较慢）
-t                          # 测试完整性
-v                          # 详细模式
-z                          # 压缩（默认）

# 示例
bzip2 -9 -k largefile.txt   # 最高压缩级别，保留原文件
bzip2 -t file.bz2          # 测试文件完整性
```

**bzcat/bzmore/bzless/bzgrep：**

```bash
# 不解压查看
bzcat file.bz2              # 直接输出
bzmore file.bz2             # 分页
bzless file.bz2             # 更好的分页

# 搜索
bzgrep "pattern" file.bz2
bzgrep "pattern" *.bz2      # 搜索多个文件
```

### xz 和 xzcat

**xz - 最高压缩率（现代标准）：**

```bash
# 压缩（默认删除原文件）
xz filename                # 生成 filename.xz

# 保留原文件
xz -k filename
xz -c filename > filename.xz

# 解压缩
unxz filename.xz           # 或 xz -d filename.xz

# 常用选项
-0 ... -9                   # 压缩级别（默认6，9是最佳但最慢）
-e                          # 极致压缩（比-9更慢更好）
-c                          # 输出到标准输出
-d                          # 解压缩
-f                          # 强制
-k                          # 保留原文件
-l                          # 列出压缩文件信息
-t                          # 测试完整性
-v                          # 详细模式
-T NUM                      # 使用NUM个线程（多核加速）

# 示例
xz -9 -k largefile.txt       # 最高压缩级别，保留原文件
xz -T4 largefile.txt         # 使用4个线程加速
xz -e file.txt               # 极致压缩
xz -l file.xz              # 查看压缩信息
```

**xzcat/xzmore/xzless/xzgrep：**

```bash
# 不解压查看
xzcat file.xz               # 直接输出
xzmore file.xz              # 分页
xzless file.xz              # 更好的分页

# 搜索
xzgrep "pattern" file.xz
xzgrep "pattern" *.xz
```

### 压缩工具对比示例

```bash
# 创建测试文件
dd if=/dev/zero of=test.file bs=1M count=100

# 对比不同工具的压缩率和速度
time gzip -k test.file
time bzip2 -k test.file
time xz -k test.file

# 查看结果
ls -lh test.file*

# 压缩率对比（示例结果）：
# 原始文件：    100M
# gzip (.gz)：   ~70M（最快）
# bzip2 (.bz2)：~65M（较慢）
# xz (.xz)：     ~60M（最慢但压缩率最高）
```

## 8.3 打包指令：tar

### tar 命令概述

tar（Tape Archive）是 Linux/Unix 系统中最常用的归档工具，将多个文件或目录打包成单一文件（称为 tar 归档或 tarball），常与压缩工具结合使用。

**tar 的特点：**
- 保留文件的权限、所有者、时间戳等信息
- 支持多种压缩格式
- 可以增量备份
- 支持远程备份

### tar 基本语法

```bash
tar [选项] [归档文件] [文件或目录...]
```

### 常用选项

**操作模式（必须选其一）：**

| 选项 | 功能 |
|------|------|
| `-c` | 创建新的归档文件 (create) |
| `-x` | 从归档中提取文件 (extract) |
| `-t` | 列出归档内容 (list) |
| `-r` | 追加文件到归档末尾 (append) |
| `-u` | 仅追加比归档中更新的文件 (update) |
| `-A` | 将另一个 tar 归档追加到当前归档 |
| `-d` | 比较归档和文件系统的差异 (diff) |
| `--delete` | 从归档中删除文件 |

**常用通用选项：**

| 选项 | 功能 |
|------|------|
| `-v` | 详细模式，显示处理过程 (verbose) |
| `-f` | 指定归档文件名，必须后跟文件名 |
| `-p` | 保留原始文件权限和属性 (preserve) |
| `-P` | 使用绝对路径（小心使用） |
| `-C` | 切换到指定目录再执行操作 |
| `-z` | 使用 gzip 压缩/解压缩 (.gz) |
| `-j` | 使用 bzip2 压缩/解压缩 (.bz2) |
| `-J` | 使用 xz 压缩/解压缩 (.xz) |
| `--exclude` | 排除特定文件或目录 |
| `--exclude-from` | 从文件中读取排除列表 |
| `--files-from` | 从文件中读取要处理的文件列表 |
| `-h` | 显示帮助信息 |
| `--version` | 显示版本信息 |

### tar 实战示例

**1. 创建归档：**

```bash
# 创建 tar 归档（不压缩）
tar -cvf archive.tar /path/to/directory

# 创建 tar.gz 归档（gzip 压缩，最常用）
tar -czvf archive.tar.gz /path/to/directory
tar -czvf backup-$(date +%Y%m%d).tar.gz ~/Documents

# 创建 tar.bz2 归档（bzip2 压缩，压缩率更高）
tar -cjvf archive.tar.bz2 /path/to/directory

# 创建 tar.xz 归档（xz 压缩，压缩率最高）
tar -cJvf archive.tar.xz /path/to/directory

# 创建归档并排除特定文件或目录
tar -czvf backup.tar.gz /home/user --exclude='*.log' --exclude='*.tmp' --exclude='cache'

# 从文件中读取排除列表
tar -czvf backup.tar.gz /home/user --exclude-from=exclude.list

# 只包含特定文件类型
tar -czvf scripts.tar.gz /home/user --include='*.sh' --include='*.py'

# 压缩多个目录或文件
tar -czvf backup.tar.gz /etc/nginx /var/www /home/user/config

# 保留权限和属性创建归档
tar -czvpf backup.tar.gz --same-owner /important/data

# 创建带时间戳的备份
tar -czvf backup-$(date +%Y%m%d_%H%M%S).tar.gz /data

# 只备份比某个时间更新的文件
tar -czN "2024-01-01" -f recent.tar.gz /data

# 创建压缩归档到远程服务器（使用管道和 SSH）
tar -czf - /local/data | ssh user@remote "cat > /backup/data.tar.gz"
```

**2. 查看归档内容：**

```bash
# 列出 tar 归档内容
tar -tvf archive.tar

# 列出 tar.gz 归档内容
tar -tzvf archive.tar.gz

# 列出 tar.bz2 归档内容
tar -tjvf archive.tar.bz2

# 搜索归档中的特定文件
tar -tzf archive.tar.gz | grep "pattern"

# 查看归档中特定文件的详细信息
tar -tvf archive.tar path/to/file

# 递归列出目录内容
tar -tvf archive.tar --wildcards "*.txt"
```

**3. 解压归档：**

```bash
# 解压 tar 归档到当前目录
tar -xvf archive.tar

# 解压 tar.gz 归档到当前目录（最常用）
tar -xzvf archive.tar.gz
tar -xzf archive.tar.gz          # 不显示详细过程

# 解压 tar.bz2 归档
tar -xjvf archive.tar.bz2

# 解压 tar.xz 归档
tar -xJvf archive.tar.xz

# 解压到指定目录
tar -xzvf archive.tar.gz -C /path/to/destination

# 解压特定文件
tar -xzvf archive.tar.gz path/to/specific/file

# 解压特定类型的文件
tar -xzvf archive.tar.gz --wildcards "*.txt"

# 解压并保留权限
tar -xzvpf archive.tar.gz

# 解压并恢复原始所有者（需要 root）
sudo tar -xzvpf archive.tar.gz --same-owner

# 解压时显示进度条
tar -xvf archive.tar --checkpoint=1000 --checkpoint-action=echo="Extracted %u files"

# 解压到远程服务器
cat archive.tar.gz | ssh user@remote "tar -xzvf - -C /destination"
```

**4. 追加和更新归档：**

```bash
# 追加文件到现有 tar 归档（仅适用于未压缩的 tar）
tar -rvf archive.tar newfile.txt
tar -rvf archive.tar /path/to/new/directory/

# 更新归档中已存在的文件（只添加更新的文件）
tar -uvf archive.tar updatedfile.txt

# 追加归档到另一个归档（合并归档）
tar -Af archive1.tar archive2.tar

# 注意：不能直接追加到压缩归档（.gz/.bz2/.xz）
# 需要先解压，追加，再压缩
# 或使用管道（复杂，不推荐）

# 示例：安全地追加到压缩归档
gunzip archive.tar.gz      # 解压
tar -rvf archive.tar newfile  # 追加
gzip archive.tar           # 重新压缩
```

**5. 删除归档中的文件：**

```bash
# 从 tar 归档中删除文件（仅适用于未压缩的 tar）
tar --delete -f archive.tar file_to_delete.txt
tar --delete -f archive.tar "*.log"

# 删除多个文件
tar --delete -f archive.tar file1 file2 file3

# 注意：不能直接删除压缩归档中的文件
# 需要先解压，删除，再压缩

# 示例：从压缩归档中删除文件
tar -xzvf archive.tar.gz            # 解压到当前目录
rm file_to_delete.txt               # 删除文件
tar -czvf new_archive.tar.gz *      # 重新打包压缩
```

**6. 从归档中提取特定文件：**

```bash
# 提取单个文件
tar -xzvf archive.tar.gz path/to/file.txt

# 提取多个文件
tar -xzvf archive.tar.gz file1.txt file2.txt

# 使用通配符提取
tar -xzvf archive.tar.gz --wildcards "*.txt"
tar -xzvf archive.tar.gz --wildcards "data/*.csv"

# 提取到特定目录
tar -xzvf archive.tar.gz -C /destination/directory file.txt
```

**7. 特殊用法：**

```bash
# 通过管道使用 tar
# 备份到远程服务器
# 方式1：tar + ssh
tar -czf - /local/dir | ssh user@remote "cat > /backup/backup.tar.gz"

# 方式2：使用 rsync（更推荐）
rsync -avz /local/dir/ user@remote:/backup/

# 从远程服务器恢复
cat backup.tar.gz | ssh user@remote "cat > -" | tar -xzf -

# 使用 tar 进行增量备份
# 创建快照文件
tar -czf backup-full.tar.gz --listed-incremental=snapshot.file /data

# 创建增量备份（只备份变化的文件）
tar -czf backup-incr.tar.gz --listed-incremental=snapshot.file /data

# 合并多个归档
cat archive1.tar archive2.tar > combined.tar

# 分割大归档
tar -czvf - /large/directory | split -b 1G - backup.tar.gz.
# 会产生 backup.tar.gz.aa, backup.tar.gz.ab, ...

# 合并分割的归档
cat backup.tar.gz.* | tar -xzvf -

# 创建带有绝对路径的归档（小心使用）
tar -czPvf backup.tar.gz /etc /var/log

# 排除特定文件或目录
tar -czvf backup.tar.gz /home --exclude='*.mp4' --exclude='cache' --exclude-vcs
```

### 压缩工具详解

#### gzip 详解

```bash
# 压缩级别测试
# 准备测试文件
dd if=/dev/urandom of=testfile bs=1M count=100

# 不同压缩级别
for level in 1 6 9; do
  time gzip -${level} -c testfile > testfile.gz.${level}
  ls -lh testfile.gz.${level}
done

# 查看压缩文件信息
gzip -l testfile.gz
# 输出：
# compressed        uncompressed  ratio uncompressed_name
#     102400            1048576  90.2% testfile

# 递归压缩目录中的所有文件（保留目录结构，但不打包）
find /path/to/dir -type f -exec gzip {} \;
# 或者
find /path/to/dir -type f | xargs gzip
```

#### bzip2 详解

```bash
# bzip2 通常比 gzip 压缩率更高但速度更慢

# 对比测试
for tool in gzip bzip2; do
  echo "Testing $tool..."
  time $tool -k testfile
  ls -lh testfile.*
  $tool -d testfile.*
done

# bzip2 的恢复功能（用于损坏的文件）
bzip2recover corrupted.bz2

# bzip2 使用块压缩，可以并行处理（使用 pbzip2）
pbzip2 -p4 file    # 使用4个线程
```

#### xz 详解

```bash
# xz 提供最高的压缩率，但速度最慢

# 压缩级别对比（0-9，默认6）
for level in 0 6 9; do
  echo "Testing xz -$level..."
  time xz -${level} -k -c testfile > testfile.xz.${level}
  ls -lh testfile.xz.${level}
done

# xz 多线程压缩（更快）
xz -T4 file            # 使用4个线程
pxz -9 file            # 使用全部核心

# xz 格式信息
xz -l file.xz          # 列出压缩信息
xz -t file.xz          # 测试完整性

# 不同的压缩预设
xz --lzma2=preset=9,dict=64MiB file   # 使用大字典获得更好压缩率
```

### 现代压缩工具

#### zstd - 快速压缩

```bash
# 安装
sudo yum install zstd    # CentOS/RHEL
sudo apt install zstd    # Debian/Ubuntu

# zstd 提供极快的压缩和解压速度

# 不同压缩级别（1-19，默认3，超高质量22）
zstd -1 file             # 快速压缩
zstd -9 file             # 高质量压缩
zstd -19 file            # 极致压缩
zstd --ultra -22 file    # 超高质量

# 多线程
zstd -T4 file            # 4线程
zstd -T0 file            # 自动使用所有核心

# 解压
zstd -d file.zst
unzstd file.zst

# 其他工具
zstdcat file.zst         # 不解压查看
zstdgrep pattern file.zst
zstdless file.zst

# 对比测试
for level in 1 3 9; do
  time zstd -${level} -k -c testfile > testfile.zst.${level}
  ls -lh testfile.zst.${level}
done
```

#### pigz - 并行 gzip

```bash
# 安装
sudo yum install pigz

# pigz 是 gzip 的并行实现，使用多核加速压缩

pigz file                  # 压缩（使用所有核心）
pigz -p 4 file            # 使用4个进程
unpigz file.gz            # 解压

# 保持与 gzip 兼容的选项
```

#### pbzip2 - 并行 bzip2

```bash
# 安装
sudo yum install pbzip2

# pbzip2 是 bzip2 的并行实现

pbzip2 file               # 压缩（使用所有核心）
pbzip2 -p4 file          # 使用4个进程
pbzip2 -d file.bz2       # 解压
```

### 压缩性能对比测试脚本

```bash
#!/bin/bash
# compression_benchmark.sh

TEST_FILE="benchmark_test_file"
FILE_SIZE="100M"

# 创建测试文件
echo "Creating test file (${FILE_SIZE})..."
dd if=/dev/urandom of=${TEST_FILE} bs=1M count=100 status=progress

echo ""
echo "=========================================="
echo "Compression Benchmark"
echo "=========================================="
echo "Original file size: $(ls -lh ${TEST_FILE} | awk '{print $5}')"
echo ""

# 测试 gzip（级别 1, 6, 9）
echo "--- gzip ---"
for level in 1 6 9; do
    echo -n "Level ${level}: "
    time (gzip -${level} -k -c ${TEST_FILE} > ${TEST_FILE}.gz.${level})
    ls -lh ${TEST_FILE}.gz.${level} | awk '{print "Size:", $5}'
    rm -f ${TEST_FILE}.gz.${level}
done
echo ""

# 测试 pigz（并行 gzip）
if command -v pigz &> /dev/null; then
    echo "--- pigz (parallel gzip) ---"
    echo -n "Default (all cores): "
    time (pigz -k -c ${TEST_FILE} > ${TEST_FILE}.pigz)
    ls -lh ${TEST_FILE}.pigz | awk '{print "Size:", $5}'
    rm -f ${TEST_FILE}.pigz
    echo ""
fi

# 测试 bzip2
if command -v bzip2 &> /dev/null; then
    echo "--- bzip2 ---"
    echo -n "Default: "
    time (bzip2 -k -c ${TEST_FILE} > ${TEST_FILE}.bz2)
    ls -lh ${TEST_FILE}.bz2 | awk '{print "Size:", $5}'
    rm -f ${TEST_FILE}.bz2
    echo ""
fi

# 测试 pbzip2（并行 bzip2）
if command -v pbzip2 &> /dev/null; then
    echo "--- pbzip2 (parallel bzip2) ---"
    echo -n "Default: "
    time (pbzip2 -k -c ${TEST_FILE} > ${TEST_FILE}.pbz2)
    ls -lh ${TEST_FILE}.pbz2 | awk '{print "Size:", $5}'
    rm -f ${TEST_FILE}.pbz2
    echo ""
fi

# 测试 xz
if command -v xz &> /dev/null; then
    echo "--- xz ---"
    for level in 0 6 9; do
        echo -n "Level ${level}: "
        time (xz -${level} -k -c ${TEST_FILE} > ${TEST_FILE}.xz.${level})
        ls -lh ${TEST_FILE}.xz.${level} | awk '{print "Size:", $5}'
        rm -f ${TEST_FILE}.xz.${level}
    done
    echo ""
fi

# 测试 zstd
if command -v zstd &> /dev/null; then
    echo "--- zstd ---"
    for level in 1 3 9 19; do
        echo -n "Level ${level}: "
        time (zstd -${level} -k -c ${TEST_FILE} > ${TEST_FILE}.zst.${level})
        ls -lh ${TEST_FILE}.zst.${level} | awk '{print "Size:", $5}'
        rm -f ${TEST_FILE}.zst.${level}
    done
    echo ""
fi

# 清理
echo "=========================================="
echo "Cleaning up..."
rm -f ${TEST_FILE} ${TEST_FILE}.*
echo "Done!"
```

### 使用 tar 进行完整系统备份

```bash
#!/bin/bash
# full_system_backup.sh

# 设置变量
BACKUP_DIR="/backup"
DATE=$(date +%Y%m%d_%H%M%S)
HOSTNAME=$(hostname)
BACKUP_FILE="${BACKUP_DIR}/${HOSTNAME}_full_backup_${DATE}.tar.gz"

# 排除列表（不备份的内容）
EXCLUDE_LIST=(
    "${BACKUP_DIR}"          # 不备份备份目录本身
    "/proc"                  # 虚拟文件系统
    "/sys"                   # 虚拟文件系统
    "/dev"                   # 设备文件（udev 会自动创建）
    "/run"                   # 运行时文件
    "/mnt"                   # 挂载点
    "/media"                 # 挂载点
    "/tmp"                   # 临时文件
    "/var/tmp"              # 临时文件
    "/var/cache"            # 缓存
    "/var/log"              # 日志（可选，建议单独备份）
    "*.swap"                # swap 文件
    "*/lost+found"          # 文件系统恢复目录
)

# 构建排除参数
EXCLUDE_ARGS=""
for item in "${EXCLUDE_LIST[@]}"; do
    EXCLUDE_ARGS+="--exclude=${item} "
done

# 确保备份目录存在
mkdir -p "${BACKUP_DIR}"

# 开始备份
echo "========================================"
echo "Starting Full System Backup"
echo "Backup file: ${BACKUP_FILE}"
echo "Started at: $(date)"
echo "========================================"

# 执行备份
tar -czvpf "${BACKUP_FILE}" \
    ${EXCLUDE_ARGS} \
    --one-file-system \
    / 2>"${BACKUP_FILE}.log"

# 检查备份结果
if [ $? -eq 0 ]; then
    echo "========================================"
    echo "Backup completed successfully!"
    echo "Backup file: ${BACKUP_FILE}"
    echo "Backup size: $(du -h "${BACKUP_FILE}" | cut -f1)"
    echo "Completed at: $(date)"
    echo "========================================"

    # 可选：删除旧备份（保留最近5个）
    cd "${BACKUP_DIR}" || exit
    ls -t "${HOSTNAME}_full_backup_"*.tar.gz | tail -n +6 | xargs -r rm -f

    # 可选：将备份同步到远程服务器
    # rsync -avz --progress "${BACKUP_FILE}" user@remote:/backups/

    exit 0
else
    echo "========================================"
    echo "Backup failed!"
    echo "Check log file: ${BACKUP_FILE}.log"
    echo "Failed at: $(date)"
    echo "========================================"
    exit 1
fi
```

### 使用 tar 进行增量备份

```bash
#!/bin/bash
# incremental_backup.sh

SOURCE_DIR="/data"
BACKUP_DIR="/backup/incremental"
DATE=$(date +%Y%m%d_%H%M%S)
SNAPSHOT_FILE="${BACKUP_DIR}/.snapshot"

# 确保备份目录存在
mkdir -p "${BACKUP_DIR}"

# 执行增量备份
tar -czvpf "${BACKUP_DIR}/incr_${DATE}.tar.gz" \
    --listed-incremental="${SNAPSHOT_FILE}" \
    "${SOURCE_DIR}"

# 清理旧备份（保留最近7天）
find "${BACKUP_DIR}" -name "incr_*.tar.gz" -mtime +7 -delete

echo "Incremental backup completed: ${BACKUP_DIR}/incr_${DATE}.tar.gz"
```

### 恢复备份

```bash
# 完整恢复
tar -xzvpf backup.tar.gz -C /

# 恢复到指定目录（不覆盖根目录）
tar -xzvpf backup.tar.gz -C /restore

# 只恢复特定文件或目录
tar -xzvpf backup.tar.gz path/to/specific/file
tar -xzvpf backup.tar.gz --wildcards "etc/nginx/*"

# 恢复时保留权限（需要 root）
sudo tar -xzvpf backup.tar.gz -C / --same-owner

# 恢复增量备份
# 先恢复完整备份
tar -xzvpf full_backup.tar.gz -C /
# 然后按顺序恢复增量备份
for backup in incr_*.tar.gz; do
  tar -xzvpf "$backup" -C /
done

# 恢复后检查文件系统完整性
checksum_file="checksum.list"
if [ -f "$checksum_file" ]; then
  md5sum -c "$checksum_file"
fi
```

## 8.4 重点回顾

1. **压缩工具**：
   - gzip：速度快，兼容性好，压缩率中等
   - bzip2：压缩率更高，速度较慢
   - xz：压缩率最高，速度最慢
   - zstd：速度极快，现代压缩标准

2. **tar 命令**：
   - `-c` 创建，`-x` 解压，`-t` 查看，`-v` 详细，`-f` 指定文件
   - `-z` gzip，`-j` bzip2，`-J` xz 压缩
   - `--exclude` 排除文件，`--wildcards` 通配符

3. **备份策略**：
   - 完整备份：备份所有数据
   - 增量备份：只备份变化的文件
   - 差异备份：备份自上次完整备份后变化的文件

4. **实用技巧**：
   - 管道和 SSH 实现远程备份
   - 使用 find 和 tar 实现精细控制
   - 定期清理旧备份
   - 定期测试备份的可恢复性

## 8.5 本章习题

1. 对比 gzip、bzip2、xz 三种压缩工具的压缩率和速度。

2. 如何使用 tar 命令创建一个包含 /etc 目录的压缩归档，排除所有 .log 文件？

3. 如何不解压查看 tar.gz 文件的内容？

4. 编写一个脚本，每天自动备份 /home 目录，保留最近7天的备份。

5. 如何使用 tar 和 ssh 将本地目录备份到远程服务器？

6. 解释 tar 的增量备份功能，如何创建和恢复增量备份？

7. 比较 zip 和 tar.gz 的异同，什么时候应该使用 zip？

8. 有一个损坏的 tar.gz 文件，如何尝试恢复其中的数据？

## 8.6 参考资料与延伸阅读

- `man tar`
- `man gzip`
- `man bzip2`
- `man xz`
- `man zstd`
- [GNU Tar Manual](https://www.gnu.org/software/tar/manual/)
- [鸟哥的 Linux 私房菜 - 文件压缩与打包](https://linux.vbird.org/linux_basic/centos7/0240tarcompress.php)
- [Linux Backup and Recovery](https://www.tldp.org/LDP/sag/html/backup.html)

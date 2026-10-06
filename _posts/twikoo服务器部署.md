---
title: twikoo服务器部署
date: '2022-08-27T11:34:30+00:00'
updated: '2022-08-27T12:40:42'
categories: []
tags:
  - 笔记
cover: 'https://twikoo.js.org/assets/logo.5707582f.png'
active_menu: post
article:
  style: story
footer:
  license: true
abbrlink: 5e2be96e
---

{% toc %}

> 一个简洁、安全、免费的静态网站评论系统。
>
> A simple, safe, free comment system.

{% ghcard imaegoo/twikoo, theme=great-gatsby %}

# 部署

## 手动部署

### 下载模块

```bash
npm install tkserver -g
```

这样,`twikoo`的模块就会出现在你系统中`node.js`中的`node_modules`

## 文件配置

### 环境变量法

创建一个`环境变量`在运行时传入变量即可

| 名称 | 描述 | 默认值 |
| --- | --- | --- |
| TWIKOO_DATA | 数据库存储路径 | ./data |
| TWIKOO_PORT | 端口号 | 8080 |
| TWIKOO_THROTTLE | IP 请求限流，当同一 IP 短时间内请求次数超过阈值将对该 IP 返回错误 | 250 |

### 修改配置文件

打开`server.js`文件

#### 修改端口

大约在第`41行`

```javascript
const port = parseInt(process.env.TWIKOO_PORT) || 9000 //后面为端口号
```

#### 修改数据存储路径

大约在第`7行`

```javascript
const dataDir = path.resolve(process.cwd(), process.env.TWIKOO_DATA || './data') //将data修改为你需要的值
```

## 运行

### 命令行部署

1. 选择一个存放数据的`主文件夹`(tkserver会在此文件下创建`./data/`子文件夹)
2. 打开终端输入`tkserver`

### 后台运行

#### screen

```bash
sudo screen tkserver
```

如果你的系统没有`screen`请先下载

```javascript
sudo apt-get install screen //debian,ubuntu
sudo yum install screen //centos
```

最后按下`Ctrl+a+d`即可以在后端运行(~~CTRL+C~~)

#### 官方

```bash
nohup tkserver >> tkserver.log 2>&1 &
```

## 宝塔部署

### 安装插件

{% image ../../assets/yuque/blog/cdca7c987f96ae60.png image.png %}

### 选择`node.js`版本

{% image ../../assets/yuque/blog/a23bca09b09c843b.png image.png %}

最好选择大于`14`的稳定版

### 配置node项目

{% image ../../assets/yuque/blog/c1e4a100a24fcccb.png image.png %}

1. 选择添加`NODE项目`
2. 选择`文件`所在目录
3. 在`启动选项`处填入`node server.js`
4. 在端口出选择上文所定义的`端口`
5. 添加域名(自选,最好加上)

### pm2管理器

需要在`文件目录`运行

```bash
pm2 start node server.js
```

## docker部署

```bash
docker run --name twikoo -e TWIKOO_THROTTLE=1000 -p 8080:8080 -v ${PWD}/data:/app/data -d imaegoo/twikoo
```

其中`${PWD}`是你反代地址(服务器真实地址)

# 更新

## 私有部署

1. 修改`package.json`
2. 运行`npm update`或者`ncu -u`

## docker更新

```bash
1.停止容器 docker stop twikoo

2.删除容器 docker rm twikoo

3.检查镜像更新情况，更新镜像  docker pull imaegoo/twikoo

4.docker run --name twikoo -e TWIKOO_THROTTLE=1000 -p 8080:8080 -v ${PWD}/data:/app/data -d imaegoo/twikoo
```

# 结尾

`前端配置`和`其他选项`请前往官网查看,[@传送门](https://twikoo.js.org)

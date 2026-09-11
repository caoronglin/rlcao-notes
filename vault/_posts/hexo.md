---
abbrlink: 697f76e7
banner: https://s2.loli.net/2022/07/21/yvOSZWJj5LzheT4.png
categories:
- - 建站
date: '2024-07-22T23:25:49.343254+08:00'
excerpt: 前言 有很多开源的动态博客框架，我们为什么要用静态博客框架呢？让我们先看看什么是Hexo Hexo 是一个快速、简洁且高效的博客框架。Hexo 使用 Markdown（或其他渲染引擎）解析文章，在几秒内，即可利用靓丽的主题生成静态网页。 众所周知，白嫖让我们快乐，利用Hexo搭建的博客可以解锁更多的白嫖技巧（后续文章更新） 初始化博客 安装node.js windows安装  前往node.js官...
menu_id: ''
notebook: ''
sticky: ''
tags:
- hexo
title: 利用Hexo框架搭建静态博客
topic: ''
updated: '2024-08-02T20:55:48.984+08:00'
wiki: ''
---
# 前言

**有很多开源的动态博客框架，我们为什么要用静态博客框架呢？让我们先看看什么是Hexo**

Hexo 是一个快速、简洁且高效的博客框架。Hexo 使用 [Markdown](http://daringfireball.net/projects/markdown/)（或其他渲染引擎）解析文章，在几秒内，即可利用靓丽的主题生成静态网页。

**众所周知，白嫖让我们快乐，利用Hexo搭建的博客可以解锁更多的白嫖技巧（后续文章更新）**

# 初始化博客

## 安装node.js

### windows安装

1. **前往node.js**[官网](https://nodejs.org/zh-cn/)下载（推荐下载LTS版本）
2. **按照安装提示进行安装（一定要选“添加到环境变量/ADD TO PATH”，这样会给后期减少很多麻烦）**
3. **安装Git**

### Linux安装

#### 安装源里面的node版本（简便方法）

1. **debian/ununtu(需要管理员权限)**

```bash
apt install nodejs
apt install npm
apt-get install git-core
npm config set registry http://registry.npm.taobao.org/（这一步将NPM源切换为国内淘宝源，可以不做）
```

2. **centos**

```bash
yum install nodejs
yun install npm
yum install git-core
npm config set registry http://registry.npm.taobao.org/
```

3. **利用**[宝塔面板安装](https://www.bt.cn)

**安装node管理器**

![](https://img.cnortles.top/blog/25/8/8d7503de3f534988304ddf8020acad1d.jpg)

**选择任意一个版本（建议选一个长期支持版本，宝塔面板安装不好处理），可以使用**`<span class="ne-text">npx hexo使用</span>`这样的安装方式需要自己添加环境变量

#### 增加环境变量（需要管理员权限—Linux）

```bash
echo 'PATH="$PATH:./node_modules/.bin"' >> ~/.profile
```

### docker安装

**期待后续更新**

## 安装hexo（推荐使用淘宝源）

```bash
npm install -g hexo-cli
```

**这样，前期环境搭建就完成了**

## 初始化博客根目录

```bash
//选定一个你要存放博客的目录，在你选定的目录打开终端（windows用户请复制相对路径，在cmd里cd+进入目录）
hexo init <博客目录名> //hexo init myblog
cd <博客目录名> //cd myblog
npm install / cnpm install
hexo s //（在线预览博客，需要放行4000端口）or hexo s -p+端口号
```

**好了，就这样一个静态博客就初始化好了（可以通过http://localhost:4000/127.0.0.1:4000访问）**

![](https://img.cnortles.top/blog/25/8/c175f68ec3ad6f1e0ee00d9b9d5251ec.png)

**这是成功后的目录结构，期中\_config.yml是前期用的比较多的**

**对于动态博客看起来会比较麻烦，但后期的备份，白嫖。迁移都有很大的优势。**

## 选择主题

**爱美之心人皆有之，谁不会想要一个好看的博客主题呢？本文推荐使用博主同款主题**[butterfly](https://butterflt.js.org)

### 什么是主题butterfly

![](https://img.cnortles.top/blog/25/8/354d953ea1943a930fa502ac35a7ff5f.jpg)

### 获取主题（以下均在刚刚创建的博客根目录进行（/myblog））

#### 通过git获取（需要提前配置好git）

```bash
git clone -b master https://github.com/jerryc127/hexo-theme-butterfly.git themes/butterfly
```

**对于没有梯子的，可以采用本站提供的镜像github（任选一个使用）**

```bash
git clone -b master https://git.ypmsk.tk/jerryc127/hexo-theme-butterfly.git themes/butterfly
git clone -b master https://git.ypmsk.top/jerryc127/hexo-theme-butterfly.git themes/butterfly
```

#### 通过npm获取

```bash
npm i hexo-theme-butterfly
```

**需要手动将node\_modules下的hexo-theme-butterfly复制到themes目录下**

### 修改博客主配置,让主题生效

```yaml
# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: butterfly
```

### 为博客添加身份（修改基础信息）

```yaml
# Hexo Configuration
## Docs: https://hexo.io/docs/configuration.html
## Source: https://github.com/hexojs/hexo/

# Site
title: stars'blog //博客题目
subtitle: '博客副标题'
description: ''
keywords: 分享，技术，教程 //自己博客的关键字
author: 作者
language: zh-CN
timezone: '' //时区，默认不管它就行

# URL
## Set your site url here. For example, if you use GitHub Page, set url as 'https://username.github.io/project'
url: https://www.cnortles.top //博客地址（和版权信息，以及分享有关）
permalink: posts/:abbrlink/ //（此处配置为安装了插件）
abbrlink:
  alg: crc32
  rep: hex
permalink_defaults:
pretty_urls:
  trailing_index: true # Set to false to remove trailing 'index.html' from permalinks
  trailing_html: true # Set to false to remove trailing '.html' from permalinks
```

**基础信息配置完以后，让我们一键三连**

```bash
hexo clean // npx hexo clean
hexo g // npx hexo g
hexo s //npx hexo s
```

**通过localhost:4000预览博客（关于端口修改上文已提及）**

### 主题更新方法

**为了方便主题更新，请将主题目录下的\_config.yml（原文件不要删除！！！）复制到博客根目录下并改为\_config.butterfly.yml**

**在hexo5.0以上，会自动合并两个配置，默认读取“\_config.butterfly.yml”后续关于主题的魔改也会在这里修改**


# 番外

## 番外1：利用语雀写文章

**本站已有小白版教程（非自动版）**

# 结尾

* [X]  介绍安装Nodejs
* [X]  安装hexo
* [X]  docker安装
* [X]  选择主题
* [X]  一键三连
* [X]  简化后续主题更新
* [X]  如何写作
* [X]  主题魔改
* [X]  白嫖进行时
* [X]  安装插件
* [X]  番外1：利用语雀写文章（非自动版）
* [X]  番外2：利用qexo写文章

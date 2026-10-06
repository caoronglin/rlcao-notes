---
title: "hexo与语雀搭配使用（小白版）"
origin: yuque
book: "blog"
yuque_id: 64461589
yuque_slug: cslrua
updated: 2022-07-21T06:29:50
url: https://www.yuque.com/docs-crl/blogs/cslrua
categories: [笔记]
cover: https://s2.loli.net/2022/07/21/Rluc5qjZTxkzGsy.png
tags: [yuque, hexo]
---

# hexo与语雀搭配使用（小白版）

# 简介

hexo是一个很好用的博客框架，但却少好用的编辑器。笔者用过很多的博客框架，最喜欢WordPress的编辑器。有一次笔者在网上冲浪时，发现了[小冰大佬的文章](https://zfe.space/post/554e.html)，用语雀搭配hexo使用，奈何笔者是一个小白，在笔者的尝试之下，找到了一个简单的方法。

## 什么是语雀？

> 「语雀」是一个「专业的云端知识库」，孵化自 蚂蚁金服 ，是 体验科技 理念下的一款创新产品，已是 10 万阿里员工进行文档编写、知识沉淀的标配。

### 用语雀对我们有什么好处？

我们可以在语雀上进行书写，后部署到自己的博客，在这过程中我们可以使用语雀的cdn（白嫖），同时也可以体会用富文本编辑器编辑的快感。

# 部署

## 准备

### 在本地搭配好hexo环境（本文以CentOS为例子）

1. 安装node.js

```bash
yum install nodejs+主板本号
```

2. 安装hexo

```bash
npm install hexo-cli -g
```

4.初始化根目录（详情参见[hexo主题官方目录](https://www.hexo.io)）

```bash
hexo init myblog
cd myblog
npm install
```

5.前往[语雀官网](https://www.yuque.com)注册账号

## 开始部署语雀与hexo

### 语雀仓库相关配置·

1. 登录语雀官网，点击知识库→创建知识库（互联网可见）![32313fe168cc0285905d35fc3d96cab2.png](../../assets/yuque/blog/2ce064db40bf3c0d.png)
2. 导入服务器上根目录下_posts下内容（如果未新配置站点可跳过此步骤），如果文章过多，可以将整个_posts目录压缩上传至语雀仓库（后续同步语雀仓库会删除本地_posts下内容）![Screenshot_20220109_181029.jpg](../../assets/yuque/blog/8764d1bca3108d24.jpeg)
3. 创建模板（方便后面编写文章）点击右上角新建→新建模板（文档）![Screenshot_20220109_181450.jpg](../../assets/yuque/blog/44db33d3bbeb42f8.jpeg)

在模板中，放置以下内容

```markdown
---
title: 测试功能
tags:
  - Github
  - CF
  - 教程
  - 测试
  - 试验室
abbrlink: 6a7d
categories:
  - 建站
  - 教程
author: stars
date: 2021-12-30 18:05:00
---
```

abbrlink需要安装插件支持

如果提示是否进行格式转换，请勿装换！！！

## 配置本地环境

### 安装插件

```bash
npm i -g yuque-hexo
```

### 修改站点根目录下package.json文件

```bash
{

 ...
 
  "scripts": {
    "start": "yuque-hexo clean && yuque-hexo sync && hexo clean && hexo generate && hexo d",
    "build": "hexo generate",
    "clean": "hexo clean",
    "deploy": "hexo deploy",
    "server": "hexo server"
  },
  
 ...
 
  "yuqueConfig": {
    "postPath": "source/_posts/yuque",
    "cachePath": "yuque.json",
    "mdNameFormat": "slug",
    "adapter": "markdown",
    "concurrency": 5,
    "baseUrl": "https://www.yuque.com/api/v2",
    "login": "个人路径",
    "repo": "仓库名",
    "token": "***********************",
    "onlyPublished": true,
    "onlyPublic": true,
    "lastGeneratePath": "lastGeneratePath.log"
  }
```

token可以点击头像获取

一段链接https://www.yuque.com/XXXXX/aaaaaa个人路径就为XXXXX，仓库名就为aaaaaaaaa

### 创建自动化任务 （以宝塔举例）

1. 进入宝塔控制台，选择计划任务→创建Shell脚本→前面输入打开自己博客所在目录→最后加入

```bash
npm run start //刚才已配置在json里面，可直接完成语雀仓库同步，渲染，部署
```

![Screenshot_20220109_182709.jpg](../../assets/yuque/blog/5cc648d0184c05d9.jpeg)

# 总结

本方法较为简单，但如果更换服务器，还需再次部署，较为麻烦，推荐采用小冰大佬的[方法](https://zfe.space/post/554e.html)

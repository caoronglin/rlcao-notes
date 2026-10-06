---
title: 公益项目
date: '2022-08-04T09:38:32+00:00'
updated: '2022-08-26T06:14:06'
abbrlink: welfare
categories: []
tags:
  - 公益
cover: 'https://api.cnortles.top/img/?type=wallpaper'
active_menu: post
article:
  style: tech
---

{% toc %}

{% note orange  以下项目都为公益项目,持续时间未知,请不要对其`攻击` %}

# 前言

本站提供的服务,大多都是可以在`免费平台`自建的开源项目,如有能力可以尝试建立一个自己的服务

# 加速服务

## jsdelivr国内方案

{% folding open:true  %}
状态:可用

域名: //cdn.cnortles.top
{% endfolding %}

### 介绍

#### 描述

这是本站对jsdelivr镜像,依托于`腾讯云`提供服务,由COS+CDN一起构成,具有白名单(如果你在本站友联,则不需要白名单)

#### 概况

一个月30-45G流量,每秒限制请求300次,一小时瞬时额度封顶为1G,达到封顶后,将会重定向至`cdn.jsdelivr.net`

#### 周期

大部分文件内周期15天,少部分文件周期3天

#### 镜像文件查看

{% link 落星盘, http://pan.cnortles.top/资源/前端资源库/,https://source.cnortles.top/img/%E9%93%BE%E6%8E%A5.png  %}

#### 速度

{% note blue  测速由 [boce](https://www.boce.com/http/2979e24cff6c40d908337065d59d05f5.html?k=iEj3ZJD5jq)提供 %}

{% image ../../assets/yuque/blog/299c3d8c0c613dda.bmp capture_20220804173725031.bmp %}

### 使用方法

{% note orange  因白名单机制,请您将你需要介入的`域名`留言在评论区,添加成功后将会以邮件回复 %}

{% tabs 1 %}

<!-- tab npm -->

```html
https://cdn.cnortles.top/npm/package@version/file
https://cdn.cnortles.top/npm/jquery@3.2.1/dist/jquery.min.js
https://cdn.cnortles.top/npm/jquery/dist/jquery.min.js
https://cdn.cnortles.top/npm/jquery/
```

​

<!-- endtab -->

​

<!-- tab gh -->

```html
https://cdn.cnortles.top/gh/user/repo@version/file
```

<!-- endtab -->

{% endtabs %}

### 使用数据

{% folding green 情况统计 %}
{% timeline 2022,green %}

<!-- timeline 08 -->

暂时无记录

<!-- endtimeline -->

{% endtimeline %}
{% endfolding %}

### 私有化

{% link jsdelivr加速, https://www.cnortles.top/,https://source.cnortles.top/img/%E9%93%BE%E6%8E%A5.png  %}

---

## unpkg方案

{% folding open:true  %}
状态:正常

域名: //unpkg.cnortles.top
{% endfolding %}

### 介绍

#### 概述

本服务由`上海腾讯云`提供,月流量`1000G`,带宽`6m`对小文件加速听快,无白名单,一秒限制请求450次,其余无限

#### 周期

与上源同步

#### 速度

{% note blue  测速由 [boce](https://www.boce.com/http/2979e24cff6c40d908337065d59d05f5.html?k=iEj3ZJD5jq)提供 %}

{% image ../../assets/yuque/blog/c083998d49898924.png image.png %}

#### 文件列表

{% link 落星盘, http://pan.cnortles.top/资源/前端资源库/,https://source.cnortles.top/img/%E9%93%BE%E6%8E%A5.png  %}

### 使用方法

```html
unpkg.cnortles.top/react@16.7.0/umd/react.production.min.js
unpkg.cnortles.top/react/umd/react.production.min.js
unpkg.cnortles.top/jquery
```

### 使用数据

{% folding green 情况统计 %}
{% timeline 2022,green %}

<!-- timeline 08 -->

暂时无记录

<!-- endtimeline -->

{% endtimeline %}
{% endfolding %}

### 私有化

#### 自建unpkg服务

{% link unpkg服务搭建, http://www.cnortles.top/posts/welcomess.html/,https://source.cnortles.top/img/%E9%93%BE%E6%8E%A5.png  %}

#### 添加源站

```yaml
http://1.117.99.118:8099
```

---

## jsdelivr加速方案-2

### 使用

```html
https://project.cnortles.top/proxy/jsdelivr/
```

用法与`jsdelivr`一样,采用`NGINX`进行反代,周期2天

### 自制

在你的`NGINX`配置中添加以下代码

```yaml

#PROXY-START/proxy/jsdelivr/

location ^~ /proxy/jsdelivr/
{
    proxy_pass https://cdn.jsdelivr.net/;
    proxy_set_header Host cdn.jsdelivr.net;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header REMOTE-HOST $remote_addr;

    add_header X-Cache $upstream_cache_status;

    #Set Nginx Cache
    
    
    if ( $uri ~* "\.(gif|png|jpg|css|js|woff|woff2)$" )
    {
    }
    proxy_ignore_headers Set-Cookie Cache-Control expires;
    proxy_cache cache_one;
    proxy_cache_key $host$uri$is_args$args;
    proxy_cache_valid 200 304 301 302 259200m;
}

#PROXY-END/proxy/jsdelivr
```

然后重启服务

---

## github加速计划

{% folding open:true  %}
状态:可用

域名: https://git.cnortles.tk/
{% endfolding %}

### 概述

GitHub的镜像,由`cloud flare`提供服务,有次数限制,推荐私有部署

#### 测速

待更新......

### 使用方法

```html
#1 直接输入网址访问
#2 在克隆时,将 gitHub.com 替换为git.cnortles.tk/
```

### 私有部署

{% link 国内加速GitHub, https://www.cnortles.top/posts/6dc3b8fe.html,https://source.cnortles.top/img/%E9%93%BE%E6%8E%A5.png  %}

### 使用数据

{% folding green 情况统计 %}
{% timeline 2022,green %}

<!-- timeline 08 -->

暂时无记录

<!-- endtimeline -->

{% endtimeline %}
{% endfolding %}

# 工具类

待更新......

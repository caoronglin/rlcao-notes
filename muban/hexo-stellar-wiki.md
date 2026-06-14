---
# ========== Hexo 内置核心字段 ==========
title: "<% tp.file.title %>"
date: <% tp.date.now("YYYY-MM-DD HH:mm:ss") %>
updated: <% tp.file.last_modified_date("YYYY-MM-DD HH:mm:ss") %>
layout: wiki                          # wiki 页面
tags: []
categories: []
permalink:                           # 覆盖永久链接
excerpt:
description:

# ========== Wiki 专属字段 ==========
wiki:                                # 所属 wiki 项目 ID（必需！用于识别 wiki）
menu_id:                             # 高亮菜单按钮 id
sidebar:                             # 侧边栏（v1.0.0~1.26.8）
leftbar:                             # 左侧栏（v1.27.0+，wiki 常用）
rightbar:                            # 右侧栏（v1.27.0+）

# ========== 文章封面 ==========
cover:                               # 列表封面
banner:                              # 横幅
banner_info:                         # 横幅信息
  avatar:                            # 头像
  title:                             # 标题
  subtitle:                          # 副标题
poster:                              # 海报封面
  topic:
  headline:
  caption:
  color:

# ========== 布局与导航 ==========
type: tech                           # tech | story
h1:
indent: false
breadcrumb: true
comment_title:

# ========== 元信息 ==========
author:
references:
  - ''
indexing: true
comments: true

# ========== 第三方插件 ==========
mathjax: false
katex: false
mermaid: false
---

# {{title}}

> <small>本文档属于 **{{wiki}}** 项目</small>

<!-- more -->

## 概述

## 正文

> 参考：[Stellar Wiki 文档系统](https://xaoxuu.com/wiki/stellar/wiki-settings/)

---
# ========== Hexo 内置核心字段 ==========
title: "<% tp.file.title %>"          # 标题，自动使用文件名
date: <% tp.date.now("YYYY-MM-DD HH:mm:ss") %>
updated: <% tp.file.last_modified_date("YYYY-MM-DD HH:mm:ss") %>
layout: post                          # 布局 (post/page/draft)
tags: []
categories: []
abbrlink:                            # 固定链接（推荐 hexo-abbrlink 插件自动生成）
permalink:                           # 覆盖永久链接（以 / 或 .html 结尾）
excerpt:                             # 纯文本摘要，留空则自动截取
description:                         # SEO 描述
sticky:                              # 置顶，数字越大越靠前
comments: true                       # 开启评论
published: true                      # 是否发布

# ========== 文章封面 ==========
cover:                               # 列表页封面图 URL
banner:                              # 文章页顶部横幅图 URL
poster:                              # 海报封面（可选，全图封面卡片）
  topic:                             # 标题上方小字
  headline:                          # 大标题（必选）
  caption:                           # 标题下方小字
  color:                             # 标题颜色（如 white/red…）

# ========== 布局与导航 ==========
type: tech                           # 文章类型: tech | story
h1:                                  # 页内一级标题，留空用 title，设 '' 隐藏
indent: false                        # 段落首行缩进
menu_id:                             # 高亮菜单按钮 id
sidebar:                             # 侧边栏（v1.0.0~1.26.8）
leftbar:                             # 左侧栏（v1.27.0+）
rightbar:                            # 右侧栏（v1.27.0+）
breadcrumb: true                     # 面包屑导航
comment_title:                       # 评论区自定义标题

# ========== 专题与归类 ==========
topic:                               # 所属话题/专栏 id（v1.25.0+）
wiki:                                # 所属 wiki 项目 ID
notebook:                            # 所属笔记本
references:                          # 参考资料列表
  - ''

# ========== 元信息 ==========
author:                              # 文章作者（v1.23.0+）
lang:                                # 语言，覆盖自动检测
indexing: true                       # 允许搜索引擎收录

# ========== 第三方插件（按需开启） ==========
mathjax: false                       # MathJax 公式
katex: false                         # KaTeX 公式（一般二选一）
mermaid: false                       # Mermaid 图表
---

# 未命名 1

<!-- more -->

## 正文

<!--
╔══════════════════════════════════════════════════╗
║         Stellar 常用标签组件速查                  ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║ 📝 文本修饰                                      ║
║   {% mark 红 color:red %}                        ║
║   {% mark 绿 color:green %}                      ║
║   {% mark 蓝 color:blue %}                       ║
║   {% mark 亮 color:light %}                      ║
║   {% mark 警告 color:warning %}                  ║
║   {% mark 错误 color:error %}                    ║
║                                                  ║
║ 🔗 链接卡片                                      ║
║   {% link 标题 https://example.com 描述 %}       ║
║                                                  ║
║ 🖼️ 图片                                          ║
║   {% image URL 描述 download:bool ratio:W/H %}   ║
║                                                  ║
║ 💬 引用块                                        ║
║   {% quot 引用文字 icon:hashtag %}                ║
║   {% quot 热门话题 icon:default %}                ║
║                                                  ║
║ 🏷️ 标签链接                                      ║
║   {% hashtag Stellar https://xaoxuu.com %}       ║
║   {% hashtag Hexo https://hexo.io/ %}            ║
║                                                  ║
║ 📦 折叠容器                                      ║
║   {% folding 标题 %}                              ║
║   内容…                                          ║
║   {% endfolding %}                               ║
║                                                  ║
║ 📑 分栏容器                                      ║
║   {% tabs %}                                     ║
║   <!-- tab 标签1 -->内容1<!-- endtab -->         ║
║   <!-- tab 标签2 -->内容2<!-- endtab -->         ║
║   {% endtabs %}                                  ║
║                                                  ║
║ 📊 时间线                                        ║
║   {% timeline %}                                 ║
║   <!-- node 2024 年 -->内容…                      ║
║   {% endtimeline %}                              ║
║                                                  ║
║ 🎯 OKR 目标管理                                   ║
║   {% okr %}                                      ║
║   KR1: 关键结果                                  ║
║   {% endokr %}                                   ║
║                                                  ║
║ ℹ️ 注记块                                        ║
║   {% note 标题 color:blue %}                     ║
║   内容…                                          ║
║   {% endnote %}                                  ║
║                                                  ║
║ 📄 引用文献行                                    ║
║   {% copy "这里面是引用" %}                       ║
║                                                  ║
╚══════════════════════════════════════════════════╝
-->

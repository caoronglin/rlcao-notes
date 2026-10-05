---
title: "<% tp.file.title %>"
date: <% tp.date.now("YYYY-MM-DD HH:mm:ss") %>
updated: <% tp.file.last_modified_date("YYYY-MM-DD HH:mm:ss") %>
layout: post
tags: []
categories: []
published: true
description: ''
excerpt: ''
cover: ''
permalink: ''

# Stellar v2 主题特有字段
# v1 的 menu_id 已改为 active_menu，值须与 _config.stellar.yml 的 leftbar.menu 中某个 id 对应
active_menu: post

# 卡片封面 / 内容横幅：根级 cover 同时用于两者
# banner 控制横幅上的文字与开关
banner:
  enabled: true
  headline: ''
  tagline: ''

# 排版与作者
#   article.style: tech | story
#   article.paragraph_indent: auto | always | never（v1 的 indent: true/false）
#   article.author 指向 source/_data/authors.yml 中的作者 id
article:
  style: tech
  paragraph_indent: auto
  author: null
  ai_label: manual

# 列表与置顶（仅 Post / Topic / Notebook 支持）
listing:
  priority: 0

# 内容页脚（v1 的 license / references / share 已并入 footer）
footer:
  references: []
  license: true
  share: true

# 可见性：控制是否进入列表与站内搜索
visibility:
  listed: true
  searchable: true

# 评论（页面级覆盖全站 comments 配置）
comments:
  enabled: true
  provider: null
  title: null
  id: null

# 区域覆盖：leftbar / rightbar 为 Region 对象，widgets 数组整体替换，[] 表示清空
#   topbar / leftbar / rightbar 都支持 enabled 与 widgets
leftbar:
  enabled: true
  widgets: []
rightbar:
  enabled: true
  widgets: []

# 公式与图表（v1 的 katex / mathjax / mermaid 已并入 render）
render:
  math: false
  diagrams: false

# 归属 Wiki / Topic / Notebook（三选一）
#   笔记本成员的源文件必须放在 notes/<notebook>/ 下（rlcao-notes 仓库）
#   Topic 成员属于 posts，Wiki 与 Notebook 属于 pages
collection:
  profile: notebook
  id: bio

# 原样注入本页面的可信 HTML（字符串，不做转义）
#   head_begin / head_end / body_begin / body_end
#   站点级配置写 _config.stellar.yml，本页配置会追加在其后
inject:
  head_begin: ''
  head_end: ''
  body_begin: ''
  body_end: ''
---

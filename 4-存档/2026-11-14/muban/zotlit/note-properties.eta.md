---
raw: true
title: "<%= it.title %>"
作者:: "<%= it.authorsShort %>"
日期:: "<%= it.date %>"
出处:: "<%= it.publicationTitle %>"
期刊:: "<%= it.publicationTitle %>"
DOI:: "<%= it.DOI %>"
citekey:: "<%= it.citekey %>"
url:: "<%= it.url %>"
标签:: <%= JSON.stringify(it.tags) %>
收藏夹:: <%= JSON.stringify(it.collections) %>
阅读状态:: [[status/to_read]]
备注::
zotero:: [Zotero](<%= it.uri %>)
pdf:: [PDF](<%= it.fileLink %>)
---

## Abstract

<%= it.abstractNote != null ? it.abstractNote.first().replace(/[\r\n]+/g, " ") : "" %>

## 关键方法

## 主要结果

## 我的思考

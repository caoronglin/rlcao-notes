---
type: literature
citekey: "{{citekey}}"
status: to-read
zotero: "{{desktopURI}}"
doi: "{{DOI}}"
---

# {{title}}

> [在 Zotero 中打开]({{desktopURI}}) · {{date | format("YYYY")}}
{% if DOI %}> DOI: https://doi.org/{{DOI}}{% endif %}

## 文献信息
- 作者：{% for creator in creators %}{{creator.firstName}} {{creator.lastName}}{% if not loop.last %}; {% endif %}{% endfor %}
- 年份：{{date | format("YYYY")}}
{% if publicationTitle %}- 期刊：{{publicationTitle}}{% endif %}
{% if url %}- 原文：[出版页面]({{url}}){% endif %}
{% if bibliography %}
{{bibliography}}{% endif %}

## 摘要
{{abstractNote}}

## 我的笔记
{% persist "personal-notes" %}{% if isFirstImport %}
### 核心问题

### 方法与证据

### 主要结论

### 我的思考与可用之处

{% endif %}{% endpersist %}

## 标注与批注
{% for annotation in annotations %}
{% if annotation.annotatedText %}> {{annotation.annotatedText | replace("\n", "\n> ")}}
{% endif %}
{% if annotation.comment %}**批注：** {{annotation.comment}}
{% endif %}
{% if annotation.imageRelativePath %}![[{{annotation.imageRelativePath}}]]
{% endif %}
{% if annotation.desktopURI %}[返回原文 · {{annotation.pageLabel or annotation.page}}]({{annotation.desktopURI}})
{% endif %}
{% endfor %}

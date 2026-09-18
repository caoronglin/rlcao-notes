---
creation_date: {{date}}
citekey: {{citekey}}
source: "{{uri}}"
---

# 注释：{{title}}

>**来源文献**: {{title}}
>**Zotero 链接**: {{uri}}

{% for annotation in annotations -%}

{% if annotation.annotatedText -%}

## {{annotation.type | capitalize}} {{"📗" If annotation.color == "#2ea8e5" Else "📕" if annotation.color == "#ff6666" Else "📙" if annotation.color == "#ffd400" Else "📗" if annotation.color == "#a28ae5" Else "📘" if annotation.color == "#5fb236" Else "📓"}}

>{{annotation.annotatedText}}
{% if annotation.comment %}
> - **批注**: {{annotation.comment}}
{% endif %}

{% if annotation.tags %} > - **标签**: {% for tag in annotation.tags %}#{{tag.tag}}{% if not loop.last %}, {% endif %}{% endfor %}

{% endif %}

>---
>
>页码: p{{annotation.page}}
>颜色: `{{annotation.color}}`
{% endif %}

{% if annotation.image %}

>![]({{annotation.image}})
{% if annotation.comment %}
> - **批注**: {{annotation.comment}}
{% endif %}
{% endif %}

{% endfor %}

<% for (const annotation of it) { %>
---
> <% if (annotation.image) { %>![批注图片](<%= annotation.image %>)<% } %>
> <%= annotation.annotatedText %>
> - **批注**: <%= annotation.comment %>
> - **颜色**: <%= annotation.colorName %> | **页码**: p<%= annotation.page %>
<% } %>

<% if (it.image) { %>![批注图片](<%= it.image %>)<% } %>
> <%= it.annotatedText %>
<% if (it.comment) { %>> - **批注**: <%= it.comment %><% } %>
> - **颜色**: <%= it.colorName %> | **页码**: p<%= it.page %>

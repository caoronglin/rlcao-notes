```dataviewjs
const posts = dv.pages('"_posts"')
  .where(p => p.title && p.date)
  .sort(p => p.date, 'desc')
  .limit(8);

dv.table(
  ["标题", "发布日期", "标签"],
  posts.map(p => [
    p.file.link,                         // 点击标题可跳转原文
    moment(p.date).format("YYYY-MM-DD"),
    p.tags ? p.tags.join(", ") : ""
  ])
);
```

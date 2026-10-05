# Hero

```dataviewjs
const now = moment();
const h = now.hour();
const greet = h < 5 ? "夜深了" : h < 11 ? "早上好" : h < 14 ? "中午好" : h < 18 ? "下午好" : "晚上好";
const week = ["日", "一", "二", "三", "四", "五", "六"];
const today = now.format("YYYY年M月D日");
const diaryPath = `vault/日记/${now.format("YYYY-MM-DD")}`;

const hasDiary = !!dv.page(diaryPath);

dv.span(`
<div class="kh-hero">
  <img class="kh-hero-bg" src="assets/workbench-hero.png" alt="">
  <div class="kh-hero-veil"></div>
  <div class="kh-hero-body">
    <div class="kh-eyebrow">PERSONAL WORKBENCH</div>
    <h1 class="kh-hero-title">${greet}，今天是 ${today}</h1>
    <p class="kh-hero-sub">星期${week[now.day()]} · 第 ${now.isoWeek()} 周 —— 把每日行动、输入输出和知识洞察放在同一张清爽的桌面上。</p>
    <div class="kh-hero-actions">
      <a class="kh-btn kh-btn-primary internal-link" data-href="${diaryPath}">${hasDiary ? "打开今日日记" : "写下今日日记"}</a>
      <a class="kh-btn internal-link" data-href="panel/洞察镜">看看洞察</a>
    </div>
  </div>
</div>
`);
```

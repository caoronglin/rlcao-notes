```dataviewjs
// 顶部条 + 统计 + 最近 7 天节奏；只读渲染，不改任何笔记状态
const now = window.moment();
const hour = now.hour();
const greet = hour < 5 ? "夜还没完" : hour < 9 ? "早上好" : hour < 12 ? "上午好" : hour < 14 ? "中午好" : hour < 18 ? "下午好" : "晚上好";

const root = dv.container.createDiv({ cls: "wf-root" });
const top = root.createDiv({ cls: "wf-top" });
const left = top.createDiv({ cls: "wf-top-main" });
left.createEl("p", { text: now.format("YYYY 年 M 月 D 日 dddd"), cls: "wf-eyebrow" });
left.createEl("h2", { text: `${greet}，麟`, cls: "wf-greeting" });
left.createEl("p", {
  text: "今天只做三件事：清空今日计划 → 推进一个项目 → 留下一条实验或文献记录。",
  cls: "wf-sub"
});

// ---- 主操作：全部走已有命令与 QuickAdd，不新增依赖 ----
const actions = top.createDiv({ cls: "wf-actions" });
const msg = root.createDiv({ cls: "wf-message", attr: { role: "status", "aria-live": "polite" } });
const dailyPath = () => `vault/日记/${window.moment().format("YYYY-MM-DD")}.md`;

async function openDaily(anchor = "") {
  const path = dailyPath();
  if (!app.vault.getAbstractFileByPath(path)) {
    if (!app.commands.executeCommandById("daily-notes")) throw new Error("每日笔记命令不可用");
    const deadline = Date.now() + 5000;
    while (!app.vault.getAbstractFileByPath(path) && Date.now() < deadline) {
      await new Promise(r => setTimeout(r, 100));
    }
    if (!app.vault.getAbstractFileByPath(path)) throw new Error("今日日记尚未创建，请重试");
  }
  await app.workspace.openLinkText(path + anchor, "Home.md", false);
}

async function quick(name) {
  const api = app.plugins.plugins.quickadd?.api;
  if (!api) throw new Error("QuickAdd 尚未加载");
  await api.executeChoice(name);
}

function button(label, fn, primary = false) {
  const b = actions.createEl("button", { text: label, cls: "wf-btn" + (primary ? " primary" : "") });
  b.onclick = async () => {
    b.disabled = true;
    msg.empty();
    try { await fn(); }
    catch (e) { console.error(e); msg.setText(`没打开：${e.message}`); }
    finally { b.disabled = false; }
  };
}

button("今日日记", () => openDaily(), true);
button("每日总结", () => openDaily("#每日总结"));
button("收集闪念", () => quick("💡 闪念"));
button("新建实验", () => quick("新建实验记录"));
button("新建项目", () => quick("新建项目"));
button("新建大纲", () => quick("新建大纲笔记"));

// ---- 统计卡：一卡一主色，不做彩虹 ----
const pages = dv.pages('"vault"');
const stats = [
  ["进行中的项目", pages.where(p => p.type === "project" && p.status === "进行中").length, "vault/工作台/项目管理.md", "var(--ant-primary)"],
  ["实验记录", pages.where(p => p.type === "experiment").length, "vault/工作台/实验管理.md", "var(--ant-success)"],
  ["文献笔记", dv.pages('"vault/文献笔记"').length, "vault/工作台/文献管理.md", "var(--ant-warning)"],
  ["大纲笔记", pages.where(p => p.type === "outline").length, "vault/大纲笔记/大纲笔记使用指南.md", "var(--ant-purple)"],
];
const row = root.createDiv({ cls: "wf-stats" });
for (const [label, value, path, color] of stats) {
  const card = row.createEl("a", { cls: "wf-stat internal-link", href: path });
  card.setAttr("data-href", path);
  card.style.setProperty("--wf-accent", color);
  card.createDiv({ cls: "wf-stat-value", text: String(value) });
  card.createDiv({ cls: "wf-stat-label", text: label });
}

// ---- 最近 7 天：有记录的日记点亮 ----
const card = root.createDiv({ cls: "wf-card" });
card.style.setProperty("--wf-accent", "var(--ant-primary)");
const title = card.createDiv({ cls: "wf-section-title", text: "最近 7 天" });
const days = [];
for (let i = 6; i >= 0; i--) {
  const d = window.moment().subtract(i, "day");
  const f = app.vault.getAbstractFileByPath(`vault/日记/${d.format("YYYY-MM-DD")}.md`);
  days.push({ d, has: !!f && (f.stat?.size || 0) > 120 });
}
const week = card.createDiv({ cls: "wf-week" });
for (const { d, has } of days) {
  const cell = week.createDiv({ cls: "wf-week-day" + (has ? " has-note" : "") + (d.isSame(now, "day") ? " is-today" : "") });
  cell.createDiv({ cls: "wf-week-dot" });
  cell.createSpan({ text: d.format("dd") });
}
let streak = 0;
for (let i = days.length - 1; i >= 0; i--) {
  if (days[i].has) streak++; else break;
}
title.createSpan({ cls: "wf-badge", text: `${days.filter(x => x.has).length}/7 天 · 连续 ${streak} 天` });
if (!days.some(x => x.has)) {
  card.createEl("p", { cls: "wf-empty", text: "最近一周还没有日记。点上方「今日日记」写三条今天的计划即可点亮。" });
}
```

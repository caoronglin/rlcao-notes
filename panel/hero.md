```dataviewjs
const root = dv.el("div", "", {cls:"wf-header"});
const welcome = root.createDiv({cls:"wf-welcome"});
welcome.createEl("p", {text:new Intl.DateTimeFormat("zh-CN", {dateStyle:"full"}).format(new Date()), cls:"wf-date"});
welcome.createEl("h2", {text:"先推进一件事，再留下一点积累。"});
welcome.createEl("p", {text:"从今天的计划开始，把实验、项目和阅读接起来。", cls:"wf-subtitle"});
const actions = dv.el("div", "", {cls:"wf-actions"});
const message = dv.el("div", "", {cls:"wf-action-message", attr:{role:"status", "aria-live":"polite"}});
const dailyPath = () => `vault/日记/${window.moment().format("YYYY-MM-DD")}.md`;
const daily = async (summary=false) => {
  const path=dailyPath();
  if(!app.vault.getAbstractFileByPath(path)) {
    if(!app.commands.executeCommandById("daily-notes")) throw new Error("每日笔记命令不可用");
    const deadline=Date.now()+5000;
    while(!app.vault.getAbstractFileByPath(path) && Date.now()<deadline) await new Promise(resolve=>setTimeout(resolve,100));
    if(!app.vault.getAbstractFileByPath(path)) throw new Error("今日日记尚未创建，请重试");
  }
  await app.workspace.openLinkText(path+(summary?"#每日总结":""), "Home.md", false);
};
const quick = async name => {
  const api=app.plugins.plugins.quickadd?.api;
  if(!api) throw new Error("QuickAdd 尚未加载");
  await api.executeChoice(name);
};
const button = (label,fn,primary=false) => {
  const b=actions.createEl("button", {text:label,cls:primary?"wf-primary":""});
  b.onclick=async()=>{b.disabled=true;message.empty();try{await fn();}catch(e){console.error(e);message.setText(`未能打开：${e.message}`);}finally{b.disabled=false;}};
};
button("今日日记",()=>daily(),true);
button("每日总结",()=>daily(true));
button("收集闪念",()=>quick("💡 闪念"));
button("新建实验",()=>quick("新建实验记录"));
button("新建项目",()=>quick("新建项目"));
button("新建大纲",()=>quick("新建大纲笔记"));
button("添加云文档",()=>quick("添加云文档"));
const pages=dv.pages('"vault"');
const counts=[
  ["进行中的项目",pages.where(p=>p.type==="project" && p.status==="进行中").length,"vault/工作台/项目管理.md"],
  ["实验记录",pages.where(p=>p.type==="experiment").length,"vault/工作台/实验管理.md"],
  ["文献笔记",dv.pages('"vault/文献笔记"').length,"vault/工作台/文献管理.md"],
  ["大纲笔记",pages.where(p=>p.type==="outline").length,"vault/大纲笔记/大纲笔记使用指南.md"]
];
const stats=dv.el("div","",{cls:"wf-stats"});
for(const [label,value,path] of counts){
  const card=stats.createEl("a",{cls:"wf-stat internal-link",href:path});
  card.setAttr("data-href",path);
  card.createEl("strong",{text:String(value)});card.createEl("span",{text:label});
}
```

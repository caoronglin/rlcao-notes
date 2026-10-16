```dataviewjs
// 工作台入口只调用已配置的本地命令，不创建虚构的项目或实验。
const root = dv.el("div", "", {cls:"wf-header"});
const title = root.createDiv({cls:"wf-welcome"});
title.createEl("p", {text: new Intl.DateTimeFormat("zh-CN", {dateStyle:"full"}).format(new Date()), cls:"wf-date"});
title.createEl("h2", {text:"记录、推进、回顾"});
title.createEl("p", {text:"让实验、项目和每天的积累连在一起。", cls:"wf-subtitle"});
const hero = app.vault.getAbstractFileByPath("assets/workbench-hero.png");
if(hero) root.createEl("img", {attr:{src:app.vault.adapter.getResourcePath(hero.path),alt:""},cls:"wf-header-image"});
const actions = dv.el("div", "", {cls:"wf-actions"});
const message = dv.el("div", "", {cls:"wf-action-message",attr:{role:"status"}});
const run = async(fn,button) => {button.disabled=true;try{await fn();}catch(e){console.error(e);message.setText("未能打开，请从命令面板重试。");}finally{button.disabled=false;}};
const quick = name => app.plugins.plugins.quickadd.api.executeChoice(name);
const button = (label,fn,primary=false) => {const b=actions.createEl("button",{text:label,cls:primary?"wf-primary":""});b.onclick=()=>run(fn,b);};
button("新建大纲",()=>quick("新建大纲笔记"));
button("新建实验",()=>quick("新建实验记录"),true);
button("新建项目",()=>quick("新建项目"));
button("今日日记",()=>app.commands.executeCommandById("daily-notes"));
button("每日总结",()=>{app.commands.executeCommandById("daily-notes");setTimeout(()=>{const d=window.moment().format("YYYY-MM-DD");const p=`vault/日记/${d}.md`;if(app.vault.getAbstractFileByPath(p))app.workspace.openLinkText(p+"#每日总结","",false);},400);});
button("添加云文档",()=>quick("添加云文档"));
const pages=dv.pages('"vault"');
const counts=[["大纲笔记",pages.where(p=>p.type==="outline").length],["实验记录",pages.where(p=>p.type==="experiment").length],["项目",pages.where(p=>p.type==="project").length]];
const stats=dv.el("div","",{cls:"wf-stats"});
for(const [label,value] of counts){const card=stats.createDiv({cls:"wf-stat"});card.createEl("strong",{text:String(value)});card.createEl("span",{text:label});}
```

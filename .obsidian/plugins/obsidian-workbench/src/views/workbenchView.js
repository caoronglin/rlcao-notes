"use strict";

const { ItemView, Notice, normalizePath } = require("obsidian");
const { VIEW_TYPE_WORKBENCH } = require("../constants");
const { formatDate, getGreeting } = require("../utils");
const { collectWorkbenchData, toggleTaskInFile } = require("../services/vaultStats");

/**
 * 个人知识工作台主视图（v3.0）：按模块开关动态装配按钮与番茄钟专注卡片。
 */
class WorkbenchView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() {
    return VIEW_TYPE_WORKBENCH;
  }

  getDisplayText() {
    return "知识工作台";
  }

  getIcon() {
    return "layout-dashboard";
  }

  async onOpen() {
    await this.render();
  }

  async onClose() {
    this.contentEl.empty();
  }

  async openOrCreateDailyNote() {
    const { dailyFolder, dailyDateFormat } = this.plugin.settings;
    const todayName = formatDate(new Date(), dailyDateFormat || "YYYY-MM-DD");
    const folder = (dailyFolder || "").replace(/^\/+|\/+$/g, "");
    const targetPath = normalizePath(folder ? `${folder}/${todayName}.md` : `${todayName}.md`);

    let file = this.app.vault.getAbstractFileByPath(targetPath);
    if (!file) {
      if (folder && !this.app.vault.getAbstractFileByPath(folder)) {
        await this.app.vault.createFolder(folder);
      }
      const initial = `---\ntags: [periodic/daily]\ncreated: ${todayName}\n---\n\n# ${todayName}\n\n## 🎯 今日重点\n- [ ] \n\n## 📝 记录\n`;
      file = await this.app.vault.create(targetPath, initial);
    }
    await this.app.workspace.getLeaf(false).openFile(file);
  }

  async render() {
    const root = this.contentEl;
    root.empty();
    root.addClass("owb-workbench-view");

    if (!this.plugin.isFeatureEnabled("workbench")) {
      root.createDiv({ cls: "owb-empty", text: "个人知识工作台已在插件设置中关闭。" });
      return;
    }

    const data = await collectWorkbenchData(this.app, this.plugin.settings);
    const todayStr = formatDate(new Date(), "YYYY-MM-DD");

    // 1. 首屏 Hero
    const hero = root.createDiv({ cls: "owb-hero" });
    hero.createEl("h2", { text: getGreeting() });
    hero.createDiv({
      cls: "owb-hero-sub",
      text: `${todayStr} · 知识库共 ${data.totalNotes} 篇笔记 · 今日新增 ${data.createdToday.length} · 今日更新 ${data.modifiedToday.length}`
    });

    const heroActions = hero.createDiv({ cls: "owb-hero-actions" });
    const mkBtn = (label, primary, handler) => {
      const b = heroActions.createEl("button", { cls: primary ? "mod-cta" : "", text: label });
      b.addEventListener("click", handler);
    };
    mkBtn("📅 今日日记", true, () => this.openOrCreateDailyNote());
    if (this.plugin.isFeatureEnabled("quickCapture")) {
      mkBtn("💡 快速闪念", false, () => this.plugin.openQuickCapture());
    }
    if (this.plugin.isFeatureEnabled("gitPanel")) {
      mkBtn("🌿 Git 面板", false, () => this.plugin.activateGitView());
    }
    if (this.plugin.isFeatureEnabled("quizEngine")) {
      mkBtn("🧪 知识自测", false, () => this.plugin.activateQuizView());
    }
    if (this.plugin.isFeatureEnabled("vaultDoctor")) {
      mkBtn("🩺 健康体检", false, () => this.plugin.openDoctorModal());
    }

    // 1.5 番茄钟专注卡片（受 pomodoro 开关控制）
    if (this.plugin.isFeatureEnabled("pomodoro") && this.plugin.pomodoro) {
      const pomo = this.plugin.pomodoro;
      const stats = pomo.getTodayStats();
      const pomoBar = root.createDiv({ cls: "owb-pomo-bar" });
      const left = pomoBar.createDiv({ cls: "owb-pomo-info" });
      const phaseLabel =
        pomo.phase === "work" ? "专注中" : pomo.phase === "break" ? "休息中" : "准备专注";
      left.createSpan({ cls: "owb-pomo-clock", text: `🍅 ${pomo.formatRemaining()}` });
      left.createSpan({
        cls: "owb-muted",
        text: `${phaseLabel} · 今日已完成 ${stats.sessions} 个番茄（${stats.minutes} 分钟）`
      });

      const right = pomoBar.createDiv({ cls: "owb-pomo-actions" });
      const workBtn = right.createEl("button", {
        cls: pomo.phase === "work" && pomo.running ? "" : "mod-cta",
        text: pomo.phase === "idle" ? "开始专注" : pomo.running ? "暂停" : "继续"
      });
      workBtn.addEventListener("click", () => {
        pomo.togglePause();
        this.plugin.updatePomodoroStatusBar();
        this.render();
      });

      const breakBtn = right.createEl("button", { text: "短休" });
      breakBtn.addEventListener("click", () => {
        pomo.startBreak();
        this.plugin.updatePomodoroStatusBar();
        this.render();
      });

      const resetBtn = right.createEl("button", { text: "重置" });
      resetBtn.addEventListener("click", () => {
        pomo.reset();
        this.plugin.updatePomodoroStatusBar();
        this.render();
      });
    }

    // 2. 三列操作台
    const opsGrid = root.createDiv({ cls: "owb-grid-3" });

    const taskCard = opsGrid.createDiv({ cls: "owb-card" });
    taskCard.createDiv({ cls: "owb-card-title", text: `🎯 今日行动 (${data.pendingTasks.length})` });
    if (!data.pendingTasks.length) {
      taskCard.createDiv({ cls: "owb-muted", text: "暂无待办任务" });
    } else {
      const list = taskCard.createDiv({ cls: "owb-task-list" });
      for (const t of data.pendingTasks) {
        const row = list.createDiv({ cls: "owb-task-row" });
        const cb = row.createEl("input", { attr: { type: "checkbox" } });
        cb.addEventListener("change", async () => {
          try {
            await toggleTaskInFile(this.app, t.file, t.line);
            new Notice("任务状态已更新");
            await this.render();
          } catch (err) {
            new Notice(`更新失败：${err.message}`);
          }
        });
        const link = row.createEl("a", { cls: "owb-link", text: t.text.slice(0, 56) });
        link.addEventListener("click", () => this.app.workspace.getLeaf(false).openFile(t.file));
      }
    }

    this.renderFileCard(opsGrid, `📥 今日输入 (${data.createdToday.length})`, data.createdToday, "今日暂无新建笔记");
    this.renderFileCard(opsGrid, `✍️ 今日输出 (${data.modifiedToday.length})`, data.modifiedToday, "今日暂无更新记录");

    // 3. 洞察镜
    const insightGrid = root.createDiv({ cls: "owb-grid-2" });

    const forgotCard = insightGrid.createDiv({ cls: "owb-card" });
    forgotCard.createDiv({
      cls: "owb-card-title",
      text: `🕸️ 沉睡笔记 (${this.plugin.settings.forgottenDays || 30}天+未更新)`
    });
    if (!data.forgotten.length) {
      forgotCard.createDiv({ cls: "owb-muted", text: "近期维护良好，暂无沉睡笔记" });
    } else {
      const ul = forgotCard.createEl("ul", { cls: "owb-list" });
      for (const item of data.forgotten) {
        const li = ul.createEl("li");
        const a = li.createEl("a", { cls: "owb-link", text: item.file.basename });
        a.addEventListener("click", () => this.app.workspace.getLeaf(false).openFile(item.file));
        li.createSpan({ cls: "owb-muted", text: ` · ${item.daysAgo} 天前` });
      }
    }

    const focusCard = insightGrid.createDiv({ cls: "owb-card" });
    focusCard.createDiv({ cls: "owb-card-title", text: "🔥 近 7 天注意力分布" });
    if (!data.focusDistribution.length) {
      focusCard.createDiv({ cls: "owb-muted", text: "近 7 天暂无更新统计" });
    } else {
      const maxVal = Math.max(...data.focusDistribution.map((x) => x.count), 1);
      const bars = focusCard.createDiv({ cls: "owb-bars" });
      for (const row of data.focusDistribution) {
        const item = bars.createDiv({ cls: "owb-bar-item" });
        const head = item.createDiv({ cls: "owb-bar-head" });
        head.createSpan({ text: row.folder });
        head.createSpan({ cls: "owb-muted", text: `${row.count} 篇` });
        const track = item.createDiv({ cls: "owb-bar-track" });
        const fill = track.createDiv({ cls: "owb-bar-fill" });
        fill.style.width = `${Math.round((row.count / maxVal) * 100)}%`;
      }
    }

    // 4. 快捷入口
    const links = this.plugin.settings.quickLinks || [];
    if (links.length) {
      const strip = root.createDiv({ cls: "owb-quick-links" });
      for (const item of links) {
        const chip = strip.createEl("button", { cls: "owb-chip", text: item.label });
        chip.addEventListener("click", async () => {
          const target = this.app.vault.getAbstractFileByPath(normalizePath(item.target));
          if (target) await this.app.workspace.getLeaf(false).openFile(target);
          else new Notice(`未找到目标文件：${item.target}`);
        });
      }
    }
  }

  renderFileCard(container, title, list, emptyText) {
    const card = container.createDiv({ cls: "owb-card" });
    card.createDiv({ cls: "owb-card-title", text: title });
    if (!list.length) {
      card.createDiv({ cls: "owb-muted", text: emptyText });
      return;
    }
    const ul = card.createEl("ul", { cls: "owb-list" });
    for (const item of list) {
      const li = ul.createEl("li");
      const a = li.createEl("a", { cls: "owb-link", text: item.file.basename });
      a.addEventListener("click", () => this.app.workspace.getLeaf(false).openFile(item.file));
    }
  }
}

module.exports = { WorkbenchView };

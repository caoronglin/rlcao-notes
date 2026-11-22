"use strict";

const { ItemView, Notice, normalizePath } = require("obsidian");
const { VIEW_TYPE_WORKBENCH } = require("../constants");
const { formatDate, getGreeting } = require("../utils");
const { collectWorkbenchData, toggleTaskInFile } = require("../services/vaultStats");
const { listDailies, computeStreak, openDaily } = require("../services/dailyService");
const { listProjects } = require("../services/projectService");
const { buildHeatmap } = require("../services/heatmapService");
const { wallpaperUrl } = require("../services/wallpaperService");

/**
 * 个人知识工作台（v3.3 重排版）：
 *
 *  ┌──────────────────────────────────────────────┐
 *  │ 壁纸层（每日一图，毛玻璃卡片浮于其上）              │
 *  │  ┌── Hero ────────────────────────────────┐  │
 *  │  │ 问候 · 日期 · 四格统计（笔记/活跃/连击/番茄）│  │
 *  │  └────────────────────────────────────────┘  │
 *  │  ┌── 热力日历（26 周 × 7 天）────────────────┐  │
 *  │  └────────────────────────────────────────┘  │
 *  │  ┌ 番茄条 ─┐┌ 今日行动 ┐┌ 项目 ┐┌ 日记 ┐        │
 *  │  └─────────┘└──────────┘└──────┘└──────┘      │
 *  │  ┌ 今日输入 ┐┌ 今日输出 ┐┌ 沉睡笔记 ┐            │
 *  └──────────────────────────────────────────────┘
 */
class WorkbenchView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this._wallpaperUrl = "";
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
    await openDaily(this.app, this.plugin.settings, 0);
  }

  /** 壁纸层与毛玻璃开关 */
  applyChrome(root) {
    const s = this.plugin.settings;
    const glass = s.glassEffect !== false;
    root.classList.toggle("owb-glass", glass);
    root.classList.toggle("owb-wallpaper-on", s.wallpaperEnabled !== false);

    if (s.wallpaperEnabled === false) {
      this._wallpaperUrl = "";
      return;
    }
    const url = wallpaperUrl(s);
    const todayKey = formatDate(new Date(), "YYYY-MM-DD");
    // 每日一图：同一天复用同 URL，避免每次 render 都重新下载
    if (!this._wallpaperUrl || this._wallpaperDayKey !== todayKey) {
      this._wallpaperUrl = url;
      this._wallpaperDayKey = todayKey;
    }
    root.style.setProperty("--owb-wallpaper", `url("${this._wallpaperUrl}")`);
    const dim = typeof s.wallpaperDim === "number" ? s.wallpaperDim : 0.42;
    root.style.setProperty("--owb-wallpaper-dim", `rgba(0,0,0,${dim})`);
    const blur = typeof s.glassBlur === "number" ? s.glassBlur : 18;
    root.style.setProperty("--owb-glass-blur", `${blur}px`);
  }

  /** 四格统计条 */
  renderStats(container, data, heat, daily) {
    const strip = container.createDiv({ cls: "owb-stat-strip" });
    const pomo = this.plugin.pomodoro ? this.plugin.pomodoro.getTodayStats() : { sessions: 0, minutes: 0 };
    const items = [
      { label: "知识库", value: String(data.totalNotes), unit: "篇" },
      { label: `${heat.weeks} 周活跃`, value: String(heat.activeDays), unit: "天" },
      { label: "连续更新", value: String(heat.streak), unit: "天" },
      { label: "今日番茄", value: String(pomo.sessions), unit: "个" }
    ];
    for (const it of items) {
      const cell = strip.createDiv({ cls: "owb-stat" });
      cell.createDiv({ cls: "owb-stat-value", text: it.value });
      cell.createDiv({ cls: "owb-stat-label", text: `${it.label} · ${it.unit}` });
    }
  }

  /** 热力日历 */
  renderHeatmap(container, heat) {
    const card = container.createDiv({ cls: "owb-card owb-heat-card" });
    const head = card.createDiv({ cls: "owb-card-title-row" });
    head.createDiv({ cls: "owb-card-title", text: "🔥 更新热力" });
    head.createDiv({
      cls: "owb-muted owb-heat-summary",
      text: `${heat.weeks} 周 · ${heat.activeDays} 天有产出 · 累计 ${heat.total} 次 · 单日峰值 ${heat.max}`
    });

    const body = card.createDiv({ cls: "owb-heat-body" });

    // 月份刻度：绝对定位在列偏移处；相邻标签不小于 34px，避免互相压字
    const months = body.createDiv({ cls: "owb-heat-months" });
    const COL = 16; // 13px 格子 + 3px 间距
    let lastMonth = -1;
    let lastLeft = -999;
    heat.grid.forEach((week, w) => {
      const firstReal = week.find((d) => !d.inFuture) || week[0];
      const m = firstReal.date.getMonth();
      if (m === lastMonth) return;
      const left = w * COL;
      lastMonth = m;
      if (left - lastLeft < 34) return;
      lastLeft = left;
      const label = months.createSpan({ cls: "owb-heat-month", text: `${m + 1}月` });
      label.style.left = `${left}px`;
    });

    const wrap = body.createDiv({ cls: "owb-heat-wrap" });
    const grid = wrap.createDiv({ cls: "owb-heat-grid" });

    const weekdayLabels = ["一", "", "三", "", "五", "", "日"];
    const labels = wrap.createDiv({ cls: "owb-heat-weekdays" });
    for (const w of weekdayLabels) labels.createDiv({ cls: "owb-heat-wd", text: w });

    for (const week of heat.grid) {
      const col = grid.createDiv({ cls: "owb-heat-col" });
      for (const day of week) {
        const cell = col.createDiv({
          cls: `owb-heat-cell owb-heat-l${day.level}${day.inFuture ? " owb-heat-future" : ""}`
        });
        const label = `${day.key} · ${day.count} 次`;
        cell.setAttribute("aria-label", label);
        cell.setAttribute("title", label);
        cell.addEventListener("click", async () => {
          const target = this.app.vault.getAbstractFileByPath(
            normalizePath(`${this.plugin.settings.dailyFolder}/${day.key}.md`)
          );
          if (target) await this.app.workspace.getLeaf(false).openFile(target);
          else new Notice(`${day.key}：${day.count} 次更新（无当日日记）`);
        });
      }
    }

    const legend = card.createDiv({ cls: "owb-heat-legend" });
    legend.createSpan({ cls: "owb-muted", text: "少" });
    for (let l = 0; l <= 4; l++) legend.createDiv({ cls: `owb-heat-cell owb-heat-l${l}` });
    legend.createSpan({ cls: "owb-muted", text: "多" });
  }

  async render() {
    const root = this.contentEl;
    root.empty();
    root.addClass("owb-workbench-view");
    this.applyChrome(root);

    if (!this.plugin.isFeatureEnabled("workbench")) {
      root.createDiv({ cls: "owb-empty", text: "个人知识工作台已在插件设置中关闭。" });
      return;
    }

    const [data, dailies] = await Promise.all([
      collectWorkbenchData(this.app, this.plugin.settings),
      listDailies(this.app, this.plugin.settings)
    ]);
    const heat = buildHeatmap(this.app, { weeks: this.plugin.settings.heatmapWeeks || 26 });
    const daily = computeStreak(dailies, new Date());
    const todayStr = formatDate(new Date(), "YYYY-MM-DD");

    // ── Hero ──
    const hero = root.createDiv({ cls: "owb-hero owb-glass-panel" });
    const heroTop = hero.createDiv({ cls: "owb-hero-top" });
    heroTop.createDiv({ cls: "owb-eyebrow", text: `${todayStr} · ${getGreeting()}` });
    heroTop.createEl("h2", { cls: "owb-greeting", text: "麟，今天推进哪一件？" });

    this.renderStats(hero, data, heat, daily);

    const heroActions = hero.createDiv({ cls: "owb-hero-actions" });
    const mkBtn = (label, primary, handler) => {
      const b = heroActions.createEl("button", { cls: primary ? "mod-cta" : "", text: label });
      b.addEventListener("click", handler);
    };
    mkBtn("📅 今日日记", true, () => this.openOrCreateDailyNote());
    if (this.plugin.isFeatureEnabled("tasks")) mkBtn("📋 任务", false, () => this.plugin.openTaskCenter());
    if (this.plugin.isFeatureEnabled("quickCapture")) mkBtn("💡 闪念", false, () => this.plugin.openQuickCapture());
    if (this.plugin.isFeatureEnabled("ragSearch")) mkBtn("🪄 AI 搜索", false, () => this.plugin.activateRagView());
    if (this.plugin.isFeatureEnabled("decision")) mkBtn("⚖️ Jev", false, () => this.plugin.openJevModal());
    if (this.plugin.isFeatureEnabled("attachments")) mkBtn("📎 附件", false, () => this.plugin.openAttachmentModal());
    if (this.plugin.isFeatureEnabled("imageTools")) mkBtn("🖼️ 图片", false, () => this.plugin.openImageToolsModal());
    if (this.plugin.isFeatureEnabled("gitPanel")) mkBtn("🌿 Git", false, () => this.plugin.activateGitView());
    if (this.plugin.isFeatureEnabled("quizEngine")) mkBtn("🧪 自测", false, () => this.plugin.activateQuizView());
    if (this.plugin.isFeatureEnabled("vaultDoctor")) mkBtn("🩺 体检", false, () => this.plugin.openDoctorModal());

    // ── 热力日历 ──
    this.renderHeatmap(root, heat);

    // ── 番茄条 ──
    if (this.plugin.isFeatureEnabled("pomodoro") && this.plugin.pomodoro) {
      const pomo = this.plugin.pomodoro;
      const stats = pomo.getTodayStats();
      const bar = root.createDiv({ cls: "owb-pomo-bar owb-glass-panel" });
      const left = bar.createDiv({ cls: "owb-pomo-info" });
      const phaseLabel = pomo.phase === "work" ? "专注中" : pomo.phase === "break" ? "休息中" : "准备专注";
      left.createSpan({ cls: "owb-pomo-clock", text: `🍅 ${pomo.formatRemaining()}` });
      left.createSpan({ cls: "owb-muted", text: `${phaseLabel} · 今日 ${stats.sessions} 个（${stats.minutes} 分钟）` });
      const right = bar.createDiv({ cls: "owb-pomo-actions" });
      right.createEl("button", {
        cls: pomo.phase === "work" && pomo.running ? "" : "mod-cta",
        text: pomo.phase === "idle" ? "开始专注" : pomo.running ? "暂停" : "继续"
      }).addEventListener("click", () => {
        pomo.togglePause();
        this.plugin.updatePomodoroStatusBar();
        this.render();
      });
      right.createEl("button", { text: "短休" }).addEventListener("click", () => {
        pomo.startBreak();
        this.plugin.updatePomodoroStatusBar();
        this.render();
      });
      right.createEl("button", { text: "重置" }).addEventListener("click", () => {
        pomo.reset();
        this.plugin.updatePomodoroStatusBar();
        this.render();
      });
    }

    // ── 主区：今日行动（宽）+ 项目（窄） ──
    const mainGrid = root.createDiv({ cls: "owb-layout-main" });

    const leftCol = mainGrid.createDiv({ cls: "owb-layout-left" });

    const taskCard = leftCol.createDiv({ cls: "owb-card owb-glass-panel" });
    const taskHead = taskCard.createDiv({ cls: "owb-card-title-row" });
    taskHead.createDiv({ cls: "owb-card-title", text: `🎯 今日行动 · ${data.pendingTasks.length}` });
    const moreBtn = taskHead.createEl("button", { cls: "owb-mini-btn", text: "全部" });
    moreBtn.addEventListener("click", () => this.plugin.openTaskCenter());

    if (!data.pendingTasks.length) {
      taskCard.createDiv({ cls: "owb-muted", text: "没有待办。享受这份安静。" });
    } else {
      const list = taskCard.createDiv({ cls: "owb-task-list" });
      for (const t of data.pendingTasks.slice(0, 10)) {
        const row = list.createDiv({ cls: "owb-task-row" });
        row.createEl("input", { attr: { type: "checkbox" } }).addEventListener("change", async () => {
          try {
            await toggleTaskInFile(this.app, t.file, t.line);
            new Notice("任务状态已更新");
            await this.render();
          } catch (err) {
            new Notice(`更新失败：${err.message}`);
          }
        });
        row.createEl("a", { cls: "owb-link", text: t.text.slice(0, 72) }).addEventListener("click", () =>
          this.app.workspace.getLeaf(false).openFile(t.file)
        );
      }
    }

    const sideCol = mainGrid.createDiv({ cls: "owb-layout-side" });

    if (this.plugin.isFeatureEnabled("projects")) {
      const projCard = sideCol.createDiv({ cls: "owb-card owb-glass-panel" });
      const ph = projCard.createDiv({ cls: "owb-card-title-row" });
      ph.createDiv({ cls: "owb-card-title", text: "🗂️ 项目" });
      const addBtn = ph.createEl("button", { cls: "owb-mini-btn", text: "+ 新建" });
      addBtn.addEventListener("click", () => this.plugin.createProjectInteractive());

      const projects = await listProjects(this.app, this.plugin.settings);
      if (!projects.length) {
        projCard.createDiv({ cls: "owb-muted", text: "项目目录为空" });
      } else {
        const ul = projCard.createEl("ul", { cls: "owb-list" });
        for (const item of projects.slice(0, 7)) {
          const li = ul.createEl("li");
          const a = li.createEl("a", { cls: "owb-link", text: item.name + (item.kind === "dir" ? "/" : "") });
          if (item.file) a.addEventListener("click", () => this.app.workspace.getLeaf(false).openFile(item.file));
          const bits = [item.status, item.priority && "P:" + item.priority, item.due && "截止 " + item.due].filter(Boolean);
          if (bits.length) li.createSpan({ cls: "owb-muted", text: " · " + bits.join(" · ") });
        }
      }
    }

    if (this.plugin.isFeatureEnabled("dailyJournal")) {
      const dailyCard = sideCol.createDiv({ cls: "owb-card owb-glass-panel" });
      const dh = dailyCard.createDiv({ cls: "owb-card-title-row" });
      dh.createDiv({
        cls: "owb-card-title",
        text: `📅 日记 · 连续 ${daily.streak} 天${daily.includesToday ? " ✓" : ""}`
      });
      const acts = dh.createDiv({ cls: "owb-pomo-actions" });
      acts.createEl("button", { cls: "owb-mini-btn", text: "今日" }).addEventListener("click", () => this.plugin.openDailyNote(0));
      acts.createEl("button", { cls: "owb-mini-btn", text: "昨日" }).addEventListener("click", () => this.plugin.openDailyNote(-1));
      if (!dailies.length) {
        dailyCard.createDiv({ cls: "owb-muted", text: "还没有日记" });
      } else {
        const ul = dailyCard.createEl("ul", { cls: "owb-list" });
        for (const d of dailies.slice(0, 5)) {
          const li = ul.createEl("li");
          li.createEl("a", { cls: "owb-link", text: d.key }).addEventListener("click", () =>
            this.app.workspace.getLeaf(false).openFile(d.file)
          );
        }
      }
    }

    // ── 次区：今日输入 / 输出 / 沉睡笔记 ──
    const subGrid = root.createDiv({ cls: "owb-layout-sub" });
    this.renderFileCard(subGrid, `📥 今日输入 · ${data.createdToday.length}`, data.createdToday, "今日暂无新建笔记");
    this.renderFileCard(subGrid, `✍️ 今日输出 · ${data.modifiedToday.length}`, data.modifiedToday, "今日暂无更新");

    // 必须挂进左列容器：直接挂 mainGrid 会成为 grid 第 3 个子项，掉到第二行并让右列留空
    const forgotCard = leftCol.createDiv({ cls: "owb-card owb-glass-panel owb-forgot-card" });
    forgotCard.createDiv({
      cls: "owb-card-title",
      text: `🕸️ 沉睡 ${this.plugin.settings.forgottenDays || 30} 天+ · ${data.forgotten.length}`
    });
    if (!data.forgotten.length) {
      forgotCard.createDiv({ cls: "owb-muted", text: "维护良好" });
    } else {
      const ul = forgotCard.createEl("ul", { cls: "owb-list" });
      for (const item of data.forgotten.slice(0, 6)) {
        const li = ul.createEl("li");
        li.createEl("a", { cls: "owb-link", text: item.file.basename }).addEventListener("click", () =>
          this.app.workspace.getLeaf(false).openFile(item.file)
        );
        li.createSpan({ cls: "owb-muted", text: ` · ${item.daysAgo} 天` });
      }
    }

    // ── 快捷入口 ──
    const links = this.plugin.settings.quickLinks || [];
    if (links.length) {
      const strip = root.createDiv({ cls: "owb-quick-links" });
      for (const item of links) {
        strip.createEl("button", { cls: "owb-chip", text: item.label }).addEventListener("click", async () => {
          const target = this.app.vault.getAbstractFileByPath(normalizePath(item.target));
          if (target) await this.app.workspace.getLeaf(false).openFile(target);
          else new Notice(`未找到：${item.target}`);
        });
      }
    }
  }

  renderFileCard(container, title, list, emptyText) {
    const card = container.createDiv({ cls: "owb-card owb-glass-panel" });
    card.createDiv({ cls: "owb-card-title", text: title });
    if (!list.length) {
      card.createDiv({ cls: "owb-muted", text: emptyText });
      return;
    }
    const ul = card.createEl("ul", { cls: "owb-list" });
    for (const item of list.slice(0, 6)) {
      const li = ul.createEl("li");
      li.createEl("a", { cls: "owb-link", text: item.file.basename }).addEventListener("click", () =>
        this.app.workspace.getLeaf(false).openFile(item.file)
      );
    }
  }
}

module.exports = { WorkbenchView };

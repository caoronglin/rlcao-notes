"use strict";

const { ItemView, Notice, normalizePath, setIcon } = require("obsidian");
const { VIEW_TYPE_WORKBENCH } = require("../constants");
const { formatDate, getGreeting } = require("../utils");
const { collectWorkbenchData, toggleTaskInFile } = require("../services/vaultStats");
const { listDailies, computeStreak, openDaily } = require("../services/dailyService");
const { listProjects } = require("../services/projectService");
const { buildHeatmap } = require("../services/heatmapService");
const { wallpaperUrl } = require("../services/wallpaperService");
const { listBases, createBase } = require("../services/baseService");
const { tagStats, attachmentStats } = require("../services/statsService");
const { AttachmentPreviewModal } = require("../modals/attachmentPreviewModal");
const { ATTACHMENT_EXTS, planOrganize, applyOrganize } = require("../services/attachmentService");
const { getQuote } = require("../services/quoteService");
const { getWeather } = require("../services/weatherService");

/**
 * 个人知识工作台（v3.4）：视觉重做 + 性能缓存 + 调试面板。
 *
 * 性能约定：
 *   - 热力日历按「日期 + 笔记数」缓存，60s 内重复 render 直接复用
 *   - 项目/日记/多维表在 render 内并行读取
 *   - 调试开关打开时，底部输出各阶段耗时（排查卡顿用）
 */
class WorkbenchView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this._wallpaperUrl = "";
    this._heatCache = null; // { key, data, at }
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
    this._entered = false;
    await this.render();
  }

  async onClose() {
    if (this._pomoTimer) {
      window.clearInterval(this._pomoTimer);
      this._pomoTimer = null;
    }
    this.contentEl.empty();
  }

  async openOrCreateDailyNote() {
    await openDaily(this.app, this.plugin.settings, 0);
  }

  applyChrome(root) {
    const s = this.plugin.settings;
    root.classList.toggle("owb-glass", s.glassEffect !== false);
    root.classList.toggle("owb-wallpaper-on", s.wallpaperEnabled !== false);

    if (s.wallpaperEnabled === false) {
      this._wallpaperUrl = "";
      return;
    }
    const todayKey = formatDate(new Date(), "YYYY-MM-DD");
    if (!this._wallpaperUrl || this._wallpaperDayKey !== todayKey) {
      this._wallpaperUrl = wallpaperUrl(s);
      this._wallpaperDayKey = todayKey;
    }
    root.style.setProperty("--owb-wallpaper", `url("${this._wallpaperUrl}")`);
    const blur = typeof s.glassBlur === "number" ? s.glassBlur : 22;
    root.style.setProperty("--owb-glass-blur", `${blur}px`);
  }

  /** 热力日历：按天+规模缓存，避免每次 render 全量遍历 550+ 文件 */
  getHeat(perfOut) {
    const weeks = this.plugin.settings.heatmapWeeks || 26;
    const todayKey = formatDate(new Date(), "YYYY-MM-DD");
    let count = 0;
    try {
      count = this.app.vault.getMarkdownFiles().length;
    } catch (e) {
      count = 0;
    }
    const key = `${todayKey}|${weeks}|${count}`;
    const now = Date.now();
    if (this._heatCache && this._heatCache.key === key && now - this._heatCache.at < 60000) {
      if (perfOut) perfOut.heatCache = "hit";
      return this._heatCache.data;
    }
    const t = Date.now();
    const data = buildHeatmap(this.app, { weeks });
    if (perfOut) {
      perfOut.heatCache = this._heatCache ? "miss" : "cold";
      perfOut.heatMs = Date.now() - t;
    }
    this._heatCache = { key, data, at: now };
    return data;
  }

  invalidateHeat() {
    this._heatCache = null;
  }

  renderStats(container, data, heat) {
    const strip = container.createDiv({ cls: "owb-stat-strip" });
    strip.setAttribute("aria-live", "polite");
    const pomo = this.plugin.pomodoro ? this.plugin.pomodoro.getTodayStats() : { sessions: 0, minutes: 0 };
    const items = [
      { label: "知识库笔记", value: String(data.totalNotes) },
      { label: `${heat.weeks} 周内有产出`, value: String(heat.activeDays) + " 天" },
      { label: "当前连续更新", value: String(heat.streak) + " 天" },
      { label: "今日番茄", value: String(pomo.sessions) }
    ];
    this._statPrev = this._statPrev || {};
    for (const it of items) {
      const cell = strip.createDiv({ cls: "owb-stat" });
      const vEl = cell.createDiv({ cls: "owb-stat-value", text: it.value });
      // 数值变化时轻弹一下（transform 动画，不触发重排）
      const prev = this._statPrev[it.label];
      if (prev !== undefined && prev !== it.value) {
        vEl.addClass("pop");
      }
      this._statPrev[it.label] = it.value;
      cell.createDiv({ cls: "owb-stat-label", text: it.label });
    }
  }

  renderHeatmap(container, heat) {
    const card = container.createDiv({ cls: "owb-card owb-heat-card" });
    const head = card.createDiv({ cls: "owb-card-title-row" });
    head.createDiv({ cls: "owb-card-title", text: "更新热力" });
    head.createDiv({
      cls: "owb-muted owb-heat-summary",
      text: `${heat.activeDays}/${heat.weeks * 7} 天有产出 · 累计 ${heat.total} 次 · 峰值 ${heat.max}`
    });

    const cols = card.createDiv({ cls: "owb-heat-cols" });
    const body = cols.createDiv({ cls: "owb-heat-body" });

    const months = body.createDiv({ cls: "owb-heat-months" });
    const weeks = heat.grid.length;
    let lastMonth = -1;
    let lastPct = -999;
    heat.grid.forEach((week, w) => {
      const firstReal = week.find((d) => !d.inFuture) || week[0];
      const m = firstReal.date.getMonth();
      if (m === lastMonth) return;
      const pct = (w / weeks) * 100;
      lastMonth = m;
      if (pct - lastPct < 4.5) return;   // 百分比间距，缩放后仍不重叠
      lastPct = pct;
      const label = months.createSpan({ cls: "owb-heat-month", text: `${m + 1}月` });
      label.style.left = `${pct}%`;
    });

    const wrap = body.createDiv({ cls: "owb-heat-wrap" });
    const labels = wrap.createDiv({ cls: "owb-heat-weekdays" });
    for (const w of ["一", "", "三", "", "五", "", "日"]) labels.createDiv({ cls: "owb-heat-wd", text: w });

    const grid = wrap.createDiv({ cls: "owb-heat-grid" });
    for (const week of heat.grid) {
      const col = grid.createDiv({ cls: "owb-heat-col" });
      for (const day of week) {
        const cell = col.createDiv({
          cls: `owb-heat-cell owb-heat-l${day.level}${day.inFuture ? " owb-heat-future" : ""}`
        });
        const label = `${day.key} · ${day.count} 次更新`;
        cell.setAttribute("aria-label", label);
        cell.setAttribute("title", label);
        cell.addEventListener("click", async () => {
          const target = this.app.vault.getAbstractFileByPath(
            normalizePath(`${this.plugin.settings.dailyFolder}/${day.key}.md`)
          );
          if (target) await this.app.workspace.getLeaf(false).openFile(target);
          else new Notice(`${day.key} · ${day.count} 次更新（当天没有日记）`);
        });
      }
    }

    // TAG 统计（放在热力卡右侧，一块空间两用）
    const tags = tagStats(this.app, { limit: 8 });
    const tagPanel = cols.createDiv({ cls: "owb-tag-panel" });
    const tagHead = tagPanel.createDiv({ cls: "owb-tag-head" });
    tagHead.createDiv({ cls: "owb-card-title", text: "标签统计" });
    tagHead.createDiv({ cls: "owb-muted", text: `${tags.distinct} 个标签 · ${tags.total} 次引用` });
    if (!tags.list.length) {
      this.emptySlot(tagPanel, "库里还没有标签");
    } else {
      const max = tags.list[0].count || 1;
      const list = tagPanel.createDiv({ cls: "owb-tag-list" });
      for (const t of tags.list) {
        const row = list.createDiv({ cls: "owb-tag-row" });
        const name = row.createSpan({ cls: "owb-tag-name", text: "#" + t.tag });
        name.setAttribute("title", `#${t.tag} · ${t.count} 次`);
        name.addEventListener("click", () => {
          this.app.workspace.openLinkText("#" + t.tag, "", false);
        });
        const track = row.createDiv({ cls: "owb-tag-track" });
        const fill = track.createDiv({ cls: "owb-tag-fill" });
        fill.style.width = Math.max(6, Math.round((t.count / max) * 100)) + "%";
        row.createSpan({ cls: "owb-muted owb-tag-count", text: String(t.count) });
      }
    }

    const legend = card.createDiv({ cls: "owb-heat-legend" });
    legend.createSpan({ cls: "owb-muted", text: "少" });
    for (let l = 0; l <= 4; l++) legend.createDiv({ cls: `owb-heat-cell owb-heat-l${l}` });
    legend.createSpan({ cls: "owb-muted", text: "多" });
  }

  emptySlot(container, text) {
    const slot = container.createDiv({ cls: "owb-empty-slot" });
    slot.createSpan({ text: text });
    return slot;
  }

  async render() {
    const perf = { start: Date.now() };
    if (this._pomoTimer) {
      window.clearInterval(this._pomoTimer);
      this._pomoTimer = null;
    }
    const root = this.contentEl;
    root.empty();
    root.addClass("owb-workbench-view");
    // 首次打开播放入场动画，之后 render 不重复播放（避免每次状态刷新都闪）
    if (!this._entered) {
      root.addClass("owb-enter");
      this._entered = true;
    } else {
      root.removeClass("owb-enter");
    }
    this.applyChrome(root);

    if (!this.plugin.isFeatureEnabled("workbench")) {
      this.emptySlot(root, "个人知识工作台已在插件设置中关闭");
      return;
    }

    // 并行读取三路数据
    const tData = Date.now();
    const [data, dailies, projects, bases] = await Promise.all([
      collectWorkbenchData(this.app, this.plugin.settings),
      listDailies(this.app, this.plugin.settings),
      this.plugin.isFeatureEnabled("projects") ? listProjects(this.app, this.plugin.settings) : Promise.resolve([]),
      this.plugin.isFeatureEnabled("bases") ? listBases(this.app) : Promise.resolve([])
    ]);
    perf.dataMs = Date.now() - tData;

    const heat = this.getHeat(perf);
    const daily = computeStreak(dailies, new Date());
    const todayStr = formatDate(new Date(), "YYYY-MM-DD");

    // ── Hero ──
    const hero = root.createDiv({ cls: "owb-hero" });
    hero.createDiv({ cls: "owb-eyebrow", text: `${todayStr} · ${getGreeting()}` });
    const dayMsgs = [
      "麟，今天先攻哪一题？",
      "麟，今天推进哪一件？",
      "麟，从哪件小事开始？",
      "麟，给今天留一条记录。",
      "麟，把最重要的事放在最前面。"
    ];
    const h = new Date().getHours();
    const dayIdx = Math.floor(h / 5) % dayMsgs.length;
    const dayMsg = h < 6 ? "夜深了，记完今天最后一笔就收工" : dayMsgs[dayIdx];
    hero.createEl("h2", { cls: "owb-greeting", text: dayMsg });

    // 诗词 + 天气（各自失败互不影响）
    const ambient = hero.createDiv({ cls: "owb-ambient" });
    if (this.plugin.settings.showQuote !== false) {
      const q = await getQuote();
      if (q && q.content) {
        const line = ambient.createDiv({ cls: "owb-quote" });
        line.createSpan({ cls: "owb-quote-text", text: q.content });
        if (q.author || q.origin) {
          line.createSpan({ cls: "owb-muted", text: `　· ${q.author}${q.origin ? "《" + q.origin + "》" : ""}` });
        }
      }
    }
    if (this.plugin.settings.showWeather !== false) {
      const w = await getWeather(this.plugin.settings);
      if (w && !w.missing) {
        const chip = ambient.createDiv({ cls: "owb-weather" });
        if (w.error) {
          chip.createSpan({ cls: "owb-muted", text: "天气获取失败" });
        } else {
          chip.createSpan({ cls: "owb-weather-emoji", text: w.emoji });
          chip.createSpan({ cls: "owb-weather-temp", text: w.temp + "°C" });
          chip.createSpan({ cls: "owb-muted", text: `${w.desc} · ${w.city} · 湿度 ${w.humidity}%` });
        }
      }
    }

    this.renderStats(hero, data, heat);

    const heroActions = hero.createDiv({ cls: "owb-hero-actions" });
    const mkBtn = (label, icon, primary, handler) => {
      const b = heroActions.createEl("button", { cls: primary ? "mod-cta owb-btn-icon" : "owb-btn-icon" });
      if (icon) setIcon(b, icon);
      b.createSpan({ text: label });
      b.addEventListener("click", handler);
    };
    mkBtn("今日日记", "calendar-days", true, () => this.openOrCreateDailyNote());
    if (this.plugin.isFeatureEnabled("tasks")) mkBtn("任务", "list-checks", false, () => this.plugin.openTaskCenter());
    if (this.plugin.isFeatureEnabled("quickCapture")) mkBtn("闪念", "zap", false, () => this.plugin.openQuickCapture());
    if (this.plugin.isFeatureEnabled("attachments")) mkBtn("附件", "paperclip", false, () => this.plugin.openAttachmentModal());
    if (this.plugin.isFeatureEnabled("imageTools")) mkBtn("图片", "image", false, () => this.plugin.openImageToolsModal());
    if (this.plugin.isFeatureEnabled("pomodoro")) mkBtn("全屏专注", "timer", false, () => this.plugin.openPomodoroFullscreen());
    if (this.plugin.isFeatureEnabled("gitPanel")) mkBtn("Git", "git-branch", false, () => this.plugin.activateGitView());
    if (this.plugin.isFeatureEnabled("vaultDoctor")) mkBtn("体检", "stethoscope", false, () => this.plugin.openDoctorModal());

    // ── 热力 ──
    this.renderHeatmap(root, heat);

    // ── 番茄条（视图内每秒刷新：状态栏刷新不到这里，此前一直是静止的 25:00）──
    if (this.plugin.isFeatureEnabled("pomodoro") && this.plugin.pomodoro) {
      const pomo = this.plugin.pomodoro;
      const stats = pomo.getTodayStats();
      const bar = root.createDiv({ cls: "owb-pomo-bar" });
      const left = bar.createDiv({ cls: "owb-pomo-info" });
      const phaseLabel = pomo.phase === "work" ? "专注中" : pomo.phase === "break" ? "休息中" : "准备专注";
      const clockEl = left.createSpan({ cls: "owb-pomo-clock", text: pomo.formatRemaining() });
      const metaEl = left.createSpan({ cls: "owb-muted", text: `${phaseLabel} · 今日 ${stats.sessions} 个 · ${stats.minutes} 分钟` });
      const progress = left.createDiv({ cls: "owb-pomo-progress" });
      const fill = progress.createDiv({ cls: "owb-pomo-progress-fill" });

      const totalSecs = () => {
        const mins = pomo.phase === "break"
          ? Number(this.plugin.settings.pomodoroBreakMinutes) || 5
          : Number(this.plugin.settings.pomodoroWorkMinutes) || 25;
        return Math.max(1, mins * 60);
      };
      const paint = () => {
        clockEl.setText(pomo.formatRemaining());
        const pct = pomo.phase === "idle" ? 0 : Math.round((1 - pomo.remainingSeconds / totalSecs()) * 100);
        fill.style.width = Math.max(0, Math.min(100, pct)) + "%";
        fill.classList.toggle("owb-pomo-progress-idle", pomo.phase === "idle");
      };
      paint();
      this._pomoTimer = window.setInterval(paint, 1000);
      const right = bar.createDiv({ cls: "owb-pomo-actions" });
      right.createEl("button", {
        cls: pomo.phase === "work" && pomo.running ? "" : "mod-cta",
        text: pomo.phase === "idle" ? "开始专注" : pomo.running ? "暂停" : "继续"
      }).addEventListener("click", () => {
        const wasIdle = pomo.phase === "idle";
        pomo.togglePause();
        this.plugin.updatePomodoroStatusBar();
        this.render();
        // 从静止开始的一次点击，直接进全屏沉浸倒计时
        if (wasIdle) this.plugin.openPomodoroFullscreen();
      });
      right.createEl("button", { text: "全屏" }).addEventListener("click", () =>
        this.plugin.openPomodoroFullscreen()
      );
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

    // ── 主区 ──
    const mainGrid = root.createDiv({ cls: "owb-layout-main" });
    const leftCol = mainGrid.createDiv({ cls: "owb-layout-left" });

    const taskCard = leftCol.createDiv({ cls: "owb-card" });
    const taskHead = taskCard.createDiv({ cls: "owb-card-title-row" });
    taskHead.createDiv({ cls: "owb-card-title", text: `今日行动 · ${data.pendingTasks.length}` });
    if (this.plugin.isFeatureEnabled("tasks")) {
      taskHead.createEl("button", { cls: "owb-mini-btn", text: "全部" }).addEventListener("click", () =>
        this.plugin.openTaskCenter()
      );
    }
    if (!data.pendingTasks.length) {
      this.emptySlot(taskCard, "没有待办。享受这份安静。");
    } else {
      const list = taskCard.createDiv({ cls: "owb-task-list" });
      for (const t of data.pendingTasks.slice(0, 12)) {
        const row = list.createDiv({ cls: "owb-task-row" });
        row.createEl("input", { attr: { type: "checkbox" } }).addEventListener("change", async () => {
          row.addClass("done");   // 先划掉+绿色闪一下，再写盘
          try {
            await toggleTaskInFile(this.app, t.file, t.line);
            this.invalidateHeat();
            new Notice("已完成");
            await new Promise((r) => setTimeout(r, 360)); // 等动画播完再重排
            await this.render();
          } catch (err) {
            row.removeClass("done");
            new Notice(`更新失败：${err.message}`);
          }
        });
        const a = row.createEl("a", { cls: "owb-link", text: t.text });
        a.setAttribute("title", `${t.text}\n${t.file.path}`);
        a.addEventListener("click", () => this.app.workspace.getLeaf(false).openFile(t.file));
        // 任务↔项目联动：任务位于 vault/项目/<项目>/ 下时显示项目标签，点击跳项目主文件
        const projRoot = (this.plugin.settings.projectFolder || "").replace(/^\/+|\/+$/g, "");
        if (projRoot && t.file.path.startsWith(projRoot + "/")) {
          const seg = t.file.path.slice(projRoot.length + 1).split("/");
          if (seg.length > 1) {
            const chip = row.createSpan({ cls: "owb-task-proj", text: seg[0] });
            chip.addEventListener("click", async (ev) => {
              ev.stopPropagation();
              const hit = (await listProjects(this.app, this.plugin.settings)).find((p) => p.name === seg[0]);
              if (hit && hit.file) this.app.workspace.getLeaf(false).openFile(hit.file);
            });
          }
        }
      }
    }

    // 沉睡笔记
    const forgotCard = leftCol.createDiv({ cls: "owb-card" });
    forgotCard.createDiv({
      cls: "owb-card-title",
      text: `沉睡 ${this.plugin.settings.forgottenDays || 30} 天以上 · ${data.forgotten.length}`
    });
    if (!data.forgotten.length) {
      this.emptySlot(forgotCard, "全部笔记都在活跃维护");
    } else {
      const ul = forgotCard.createEl("ul", { cls: "owb-list" });
      for (const item of data.forgotten.slice(0, 5)) {
        const li = ul.createEl("li");
        li.createEl("a", { cls: "owb-link", text: item.file.basename }).addEventListener("click", () =>
          this.app.workspace.getLeaf(false).openFile(item.file)
        );
        li.createSpan({ cls: "owb-muted", text: ` · ${item.daysAgo} 天` });
      }
    }

    // ── 右列 ──
    const sideCol = mainGrid.createDiv({ cls: "owb-layout-side" });

    if (this.plugin.isFeatureEnabled("projects")) {
      const projCard = sideCol.createDiv({ cls: "owb-card" });
      const ph = projCard.createDiv({ cls: "owb-card-title-row" });
      ph.createDiv({ cls: "owb-card-title", text: `项目 · ${projects.length}` });
      ph.createEl("button", { cls: "owb-mini-btn", text: "新建" }).addEventListener("click", () =>
        this.plugin.createProjectInteractive()
      );
      if (!projects.length) {
        this.emptySlot(projCard, `项目目录为空：${this.plugin.settings.projectFolder}`);
      } else {
        const ul = projCard.createEl("ul", { cls: "owb-list" });
        for (const item of projects.slice(0, 6)) {
          const li = ul.createEl("li");
          const a = li.createEl("a", { cls: "owb-link", text: item.name + (item.kind === "dir" ? "/" : "") });
          if (item.file) a.addEventListener("click", () => this.app.workspace.getLeaf(false).openFile(item.file));
          const bits = [item.status, item.due && "截止 " + item.due].filter(Boolean);
          if (bits.length) li.createSpan({ cls: "owb-muted", text: " · " + bits.join(" · ") });
        }
      }
    }

    if (this.plugin.isFeatureEnabled("dailyJournal")) {
      const dailyCard = sideCol.createDiv({ cls: "owb-card" });
      const dh = dailyCard.createDiv({ cls: "owb-card-title-row" });
      dh.createDiv({
        cls: "owb-card-title",
        text: `日记 · 连续 ${daily.streak} 天${daily.includesToday ? "（今日已写）" : ""}`
      });
      const acts = dh.createDiv({ cls: "owb-pomo-actions" });
      acts.createEl("button", { cls: "owb-mini-btn", text: "今日" }).addEventListener("click", () =>
        this.plugin.openDailyNote(0)
      );
      acts.createEl("button", { cls: "owb-mini-btn", text: "昨日" }).addEventListener("click", () =>
        this.plugin.openDailyNote(-1)
      );
      if (!dailies.length) {
        this.emptySlot(dailyCard, `还没有日记：${this.plugin.settings.dailyFolder}`);
      } else {
        const ul = dailyCard.createEl("ul", { cls: "owb-list" });
        for (const d of dailies.slice(0, 5)) {
          ul.createEl("li").createEl("a", { cls: "owb-link", text: d.key }).addEventListener("click", () =>
            this.app.workspace.getLeaf(false).openFile(d.file)
          );
        }
      }
    }

    // 多维表格
    if (this.plugin.isFeatureEnabled("bases")) {
      const baseCard = leftCol.createDiv({ cls: "owb-card" });
      const bh = baseCard.createDiv({ cls: "owb-card-title-row" });
      bh.createDiv({ cls: "owb-card-title", text: `多维表格 · ${bases.length}` });
      bh.createEl("button", { cls: "owb-mini-btn", text: "新建" }).addEventListener("click", async () => {
        try {
          await createBase(this.app, "新建工作表");
          this.render();
        } catch (e) {
          new Notice("创建失败：" + e.message);
        }
      });
      if (!bases.length) {
        this.emptySlot(baseCard, "没有 .duowei / .base 文件");
      } else {
        for (const b of bases.slice(0, 6)) {
          const row = baseCard.createDiv({ cls: "owb-base-row" });
          const a = row.createEl("a", { cls: "owb-link", text: b.file.basename });
          a.addEventListener("click", () => this.app.workspace.getLeaf(false).openFile(b.file));
          row.createSpan({ cls: "owb-base-kind", text: b.kind });
        }
      }
    }

    // 附件统计卡
    if (this.plugin.isFeatureEnabled("attachments")) {
      const att = attachmentStats(this.app, ATTACHMENT_EXTS);
      const card = sideCol.createDiv({ cls: "owb-card" });
      const h = card.createDiv({ cls: "owb-card-title-row" });
      h.createDiv({ cls: "owb-card-title", text: `附件 · ${att.count}` });
      const mb = att.totalBytes / 1024 / 1024;
      h.createDiv({ cls: "owb-muted", text: mb >= 1 ? mb.toFixed(1) + " MB" : Math.round(att.totalBytes / 1024) + " KB" });
      const top = att.byExt.slice(0, 4);
      if (!top.length) {
        this.emptySlot(card, "还没有附件");
      } else {
        const ul = card.createEl("ul", { cls: "owb-list" });
        for (const e of top) {
          const li = ul.createEl("li");
          li.createSpan({ text: "." + e.ext });
          li.createSpan({
            cls: "owb-muted",
            text: ` · ${e.count} 个 · ${(e.bytes / 1024 / 1024).toFixed(1)} MB`
          });
        }
      }
      const acts = card.createDiv({ cls: "owb-pomo-actions" });
      acts.createEl("button", { cls: "owb-mini-btn", text: "整理到 assets" }).addEventListener("click", () =>
        this.plugin.organizeAttachments()
      );
      acts.createEl("button", { cls: "owb-mini-btn", text: "上传附件" }).addEventListener("click", () =>
        this.plugin.addAttachmentInteractive()
      );
    }

    // ── RAG 卡片（原独立视图收进工作台）──
    if (this.plugin.isFeatureEnabled("ragSearch")) {
      await this.renderRagCard(sideCol);
    }

    // ── 次区 ──
    const subGrid = root.createDiv({ cls: "owb-layout-sub" });
    this.renderFileCard(subGrid, `今日输入 · ${data.createdToday.length}`, data.createdToday, "今天还没有新建笔记");
    this.renderFileCard(subGrid, `今日输出 · ${data.modifiedToday.length}`, data.modifiedToday, "今天还没有更新笔记");

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

    // ── 调试面板（设置里打开 debugPerf 才显示）──
    if (this.plugin.settings.debugPerf) {
      perf.totalMs = Date.now() - perf.start;
      const bar = root.createDiv({ cls: "owb-debug-bar" });
      bar.createSpan({ text: `render ${perf.totalMs}ms` });
      bar.createSpan({ text: `data ${perf.dataMs}ms` });
      bar.createSpan({ text: `heat ${perf.heatCache}${perf.heatMs != null ? " " + perf.heatMs + "ms" : ""}` });
      bar.createSpan({ text: `notes ${data.totalNotes}` });
      bar.createSpan({ text: `tasks ${data.pendingTasks.length}` });
      bar.createSpan({ text: `bases ${bases.length}` });
      if (this.plugin._migrationApplied) bar.createSpan({ text: "migrated settings" });
      bar.createEl("button", { cls: "owb-mini-btn", text: "清缓存重渲染" }).addEventListener("click", () => {
        this.invalidateHeat();
        this.render();
      });
    }
  }

  /** RAG 卡片：索引状态 + 内联语义检索 + 知识图谱生成 */
  async renderRagCard(container) {
    const card = container.createDiv({ cls: "owb-card owb-rag-card" });
    const head = card.createDiv({ cls: "owb-card-title-row" });
    head.createDiv({ cls: "owb-card-title", text: "语义检索" });

    let stat = { built: false, chunks: 0 };
    try {
      stat = this.plugin.rag.indexStat();
    } catch (e) {
      stat = { built: false, chunks: 0 };
    }
    head.createDiv({
      cls: "owb-muted",
      text: stat.built ? `${stat.files} 篇 / ${stat.chunks} 块` : "索引未构建"
    });

    const bar = card.createDiv({ cls: "owb-rag-inline" });
    const input = bar.createEl("input", {
      attr: { type: "text", placeholder: "问点什么，例如：BSA-seq 关联区间怎么筛" }
    });
    const go = async () => {
      const q = input.value.trim();
      if (!q) return;
      this._ragQuery = q;
      this._ragBusy = true;
      this._ragResults = null;
      this._ragError = "";
      await this.render();
      try {
        this._ragResults = await this.plugin.rag.search(q, { topK: 30, topN: 5 });
      } catch (err) {
        this._ragError = err.message;
      }
      this._ragBusy = false;
      await this.render();
    };
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") go();
    });
    bar.createEl("button", { cls: "mod-cta", text: "搜索" }).addEventListener("click", go);

    const acts = card.createDiv({ cls: "owb-pomo-actions" });
    acts.createEl("button", { cls: "owb-mini-btn", text: "构建索引" }).addEventListener("click", async () => {
      this._ragBusy = true;
      await this.render();
      try {
        await this.plugin.buildRagIndex();
      } finally {
        this._ragBusy = false;
        await this.render();
      }
    });
    acts.createEl("button", { cls: "owb-mini-btn", text: "生成知识图谱" }).addEventListener("click", async () => {
      await this.plugin.buildGraphNote();
      this.invalidateHeat();
    });

    if (this._ragBusy) {
      const slot = card.createDiv({ cls: "owb-empty-slot" });
      slot.createSpan({ cls: "owb-spinner" });
      slot.createSpan({ text: "处理中…（构建索引会分批调用 embeddings）" });
      return;
    }
    if (this._ragError) {
      this.emptySlot(card, this._ragError);
      return;
    }
    if (!this._ragResults) {
      if (stat.built) this.emptySlot(card, "输入问题回车，或先生成知识图谱看全库结构");
      else this.emptySlot(card, "先在设置里填 SiliconFlow Key，然后点「构建索引」");
      return;
    }
    if (!this._ragResults.length) {
      this.emptySlot(card, "没有匹配内容");
      return;
    }
    for (const r of this._ragResults) {
      const hit = card.createDiv({ cls: "owb-rag-hit" });
      const top = hit.createDiv({ cls: "owb-rag-hit-head" });
      top.createEl("a", {
        cls: "owb-link",
        text: r.chunk.path.split("/").pop().replace(/\.md$/, "")
      }).addEventListener("click", () => {
        const f = this.app.vault.getAbstractFileByPath(r.chunk.path);
        if (f) this.app.workspace.getLeaf(false).openFile(f);
      });
      top.createSpan({
        cls: "owb-muted",
        text: (r.chunk.heading ? " " + r.chunk.heading + " · " : " ") + Math.round(r.score * 100) + "%"
      });
      hit.createDiv({ cls: "owb-rag-snippet", text: r.chunk.text.slice(0, 160) + (r.chunk.text.length > 160 ? "…" : "") });
    }
  }

  renderFileCard(container, title, list, emptyText) {
    const card = container.createDiv({ cls: "owb-card" });
    card.createDiv({ cls: "owb-card-title", text: title });
    // 去掉 README 与重复项：它们只说明"文件被同步过"，不代表今天做了什么
    const seen = new Set();
    const items = [];
    for (const item of list) {
      const name = item.file.basename;
      if (/^readme$/i.test(name) || /^index$/i.test(name)) continue;
      if (seen.has(name)) continue;
      seen.add(name);
      items.push(item);
    }
    if (!items.length) {
      this.emptySlot(card, emptyText);
      return;
    }
    const ul = card.createEl("ul", { cls: "owb-list" });
    for (const item of items.slice(0, 5)) {
      ul.createEl("li").createEl("a", { cls: "owb-link", text: item.file.basename }).addEventListener("click", () =>
        this.app.workspace.getLeaf(false).openFile(item.file)
      );
    }
  }
}

module.exports = { WorkbenchView };

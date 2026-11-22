"use strict";

const { Modal, Notice, setIcon } = require("obsidian");

/**
 * 全屏番茄钟：点击「开始专注」后进入沉浸倒计时。
 * - 大号环形进度（SVG stroke-dashoffset）
 * - 入场动画（缩放 + 淡入），阶段切换时脉冲
 * - 空格暂停/继续，Esc 退出
 *
 * 它只是 pomodoroService 的一个视图：状态都从 service 读，关闭不影响计时。
 */
class PomodoroFullscreen extends Modal {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this._raf = null;
    this._lastPhase = "";
  }

  onOpen() {
    const { contentEl, modalEl, containerEl } = this;
    contentEl.empty();
    contentEl.addClass("owb-fs-pomo");
    modalEl.addClass("owb-fs-modal");
    if (containerEl) containerEl.addClass("owb-fs-container");

    const wrap = contentEl.createDiv({ cls: "owb-fs-wrap" });

    // 环形进度
    const ring = wrap.createDiv({ cls: "owb-fs-ring" });
    const SVG = 320;
    const r = 142;
    const c = 2 * Math.PI * r;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${SVG} ${SVG}`);
    svg.setAttribute("class", "owb-fs-svg");
    const track = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    track.setAttribute("cx", String(SVG / 2));
    track.setAttribute("cy", String(SVG / 2));
    track.setAttribute("r", String(r));
    track.setAttribute("class", "owb-fs-track");
    const fill = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    fill.setAttribute("cx", String(SVG / 2));
    fill.setAttribute("cy", String(SVG / 2));
    fill.setAttribute("r", String(r));
    fill.setAttribute("class", "owb-fs-fill");
    fill.style.strokeDasharray = String(c);
    fill.style.strokeDashoffset = "0";
    svg.appendChild(track);
    svg.appendChild(fill);
    ring.appendChild(svg);

    const center = ring.createDiv({ cls: "owb-fs-center" });
    this.clockEl = center.createDiv({ cls: "owb-fs-clock", text: "25:00" });
    this.phaseEl = center.createDiv({ cls: "owb-fs-phase", text: "准备专注" });

    this.metaEl = wrap.createDiv({ cls: "owb-fs-meta" });

    const actions = wrap.createDiv({ cls: "owb-fs-actions" });
    this.mainBtn = actions.createEl("button", { cls: "mod-cta owb-fs-btn" });
    setIcon(this.mainBtn, "play");
    this.mainBtn.createSpan({ text: "开始专注" });
    this.mainBtn.addEventListener("click", () => {
      const pomo = this.plugin.pomodoro;
      pomo.togglePause();
      this.plugin.updatePomodoroStatusBar();
      this.plugin.refreshWorkbenchViews();
      this._pulse();
    });

    const breakBtn = actions.createEl("button", { cls: "owb-fs-btn" });
    setIcon(breakBtn, "coffee");
    breakBtn.createSpan({ text: "短休" });
    breakBtn.addEventListener("click", () => {
      this.plugin.pomodoro.startBreak();
      this.plugin.updatePomodoroStatusBar();
      this._pulse();
    });

    const resetBtn = actions.createEl("button", { cls: "owb-fs-btn" });
    setIcon(resetBtn, "rotate-ccw");
    resetBtn.createSpan({ text: "重置" });
    resetBtn.addEventListener("click", () => {
      this.plugin.pomodoro.reset();
      this.plugin.updatePomodoroStatusBar();
      this._pulse();
    });

    const closeBtn = actions.createEl("button", { cls: "owb-fs-btn owb-fs-quiet" });
    setIcon(closeBtn, "minimize-2");
    closeBtn.createSpan({ text: "退出全屏" });
    closeBtn.addEventListener("click", () => this.close());

    // 空格暂停
    this._keydown = (ev) => {
      if (ev.key === " " || ev.code === "Space") {
        ev.preventDefault();
        this.plugin.pomodoro.togglePause();
        this._pulse();
      }
    };
    document.addEventListener("keydown", this._keydown);

    wrap.classList.add("owb-fs-enter");
    this._paint(c, r);
    this._raf = window.setInterval(() => this._paint(c, r), 500);
  }

  _pulse() {
    const el = this.contentEl.querySelector(".owb-fs-ring");
    if (!el) return;
    el.classList.remove("owb-fs-pulse");
    // 强制重排以重启动画
    void el.offsetWidth;
    el.classList.add("owb-fs-pulse");
  }

  _paint(circumference, r) {
    const pomo = this.plugin.pomodoro;
    if (!pomo) return;
    const mins =
      pomo.phase === "break"
        ? Number(this.plugin.settings.pomodoroBreakMinutes) || 5
        : Number(this.plugin.settings.pomodoroWorkMinutes) || 25;
    const total = Math.max(1, mins * 60);
    const left = Math.max(0, pomo.remainingSeconds);
    const progress = 1 - left / total;

    this.clockEl.setText(pomo.formatRemaining());
    const label =
      pomo.phase === "idle" ? "准备专注" : pomo.phase === "work" ? (pomo.running ? "专注中" : "已暂停") : (pomo.running ? "休息中" : "休息暂停");
    this.phaseEl.setText(label);

    const fill = this.contentEl.querySelector(".owb-fs-fill");
    if (fill) {
      fill.style.strokeDasharray = String(circumference);
      fill.style.strokeDashoffset = String(circumference * (1 - progress));
    }

    const today = pomo.getTodayStats();
    this.metaEl.setText(`今日 ${today.sessions} 个番茄 · ${today.minutes} 分钟 · 空格暂停 / Esc 退出`);

    const btnLabel = pomo.phase === "idle" ? "开始专注" : pomo.running ? "暂停" : "继续";
    const span = this.mainBtn.querySelector("span");
    if (span && span.textContent !== btnLabel) span.textContent = btnLabel;

    if (this._lastPhase && this._lastPhase !== pomo.phase) this._pulse();
    this._lastPhase = pomo.phase;
  }

  onClose() {
    if (this._raf) {
      window.clearInterval(this._raf);
      this._raf = null;
    }
    if (this._keydown) {
      document.removeEventListener("keydown", this._keydown);
      this._keydown = null;
    }
    this.contentEl.empty();
  }
}

module.exports = { PomodoroFullscreen };

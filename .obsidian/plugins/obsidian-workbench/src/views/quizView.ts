// @ts-nocheck -- 批3机械迁移: 类型化排入队列
"use strict";

import { ItemView, Notice, normalizePath } from "obsidian";
import { VIEW_TYPE_QUIZ } from "../constants";
import { formatDate, formatDuration, shuffleArray } from "../utils";
import { parseMarkdownQuiz, updateMasterySM2, getDueOrWrongQuestions, formatWrongCalloutMarkdown } from "../services/quizEngine";

/**
 * 原生 SM-2 互动自测视图：直接读取 Vault 内的 Markdown 题库，成绩与掌握度持久化在插件 data.json。
 */
class QuizView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.selectedFilePath = "";
    this.parsed = null;
    this.selectedTag = "全部";
    this.session = null;
    this._onKeyDown = this._handleKeyDown.bind(this);
  }

  getViewType() {
    return VIEW_TYPE_QUIZ;
  }

  getDisplayText() {
    return "知识自测";
  }

  getIcon() {
    return "graduation-cap";
  }

  async onOpen() {
    this.registerDomEvent(document, "keydown", this._onKeyDown);
    await this.render();
  }

  async onClose() {
    this.contentEl.empty();
  }

  listQuizCandidateFiles() {
    const folder = (this.plugin.settings.quizFolder || "").replace(/^\/+|\/+$/g, "");
    const files = this.app.vault.getMarkdownFiles();
    const scoped = folder ? files.filter((f) => f.path.startsWith(folder + "/")) : files;
    return scoped.length ? scoped : files;
  }

  async loadSelectedBank(filePath) {
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (!file) {
      this.parsed = null;
      return;
    }
    const text = await this.app.vault.cachedRead(file);
    this.parsed = parseMarkdownQuiz(text, file.basename);
  }

  async render() {
    const root = this.contentEl;
    root.empty();
    root.addClass("owb-quiz-view");

    const candidates = this.listQuizCandidateFiles();
    if (!this.selectedFilePath && candidates.length) {
      const preferred = candidates.find((f) => /quiz|自测|题库/i.test(f.path)) || candidates[0];
      this.selectedFilePath = preferred.path;
    }

    // 顶部题库选择栏
    const head = root.createDiv({ cls: "owb-quiz-head" });
    head.createEl("h2", { text: "🧪 知识自测与 SM-2 错题复习" });

    const pickerRow = head.createDiv({ cls: "owb-quiz-picker" });
    const select = pickerRow.createEl("select", { cls: "owb-select" });
    for (const f of candidates) {
      const opt = select.createEl("option", { value: f.path, text: f.path });
      if (f.path === this.selectedFilePath) opt.selected = true;
    }
    select.addEventListener("change", async () => {
      this.selectedFilePath = select.value;
      this.session = null;
      this.selectedTag = "全部";
      await this.loadSelectedBank(this.selectedFilePath);
      this.renderStage(root);
    });

    const reloadBtn = pickerRow.createEl("button", { text: "重载题库" });
    reloadBtn.addEventListener("click", async () => {
      this.session = null;
      await this.loadSelectedBank(this.selectedFilePath);
      this.renderStage(root);
      new Notice("题库已重新加载");
    });

    if (this.selectedFilePath && !this.parsed) {
      await this.loadSelectedBank(this.selectedFilePath);
    }

    // 统计卡
    const store = this.plugin.settings.quizStore;
    const questions = (this.parsed && this.parsed.questions) || [];
    const dueCount = getDueOrWrongQuestions(questions, store).length;

    const statRow = root.createDiv({ cls: "owb-stat-row" });
    const addStat = (label, val) => {
      const s = statRow.createDiv({ cls: "owb-stat" });
      s.createDiv({ cls: "owb-stat-label", text: label });
      s.createDiv({ cls: "owb-stat-val", text: val });
    };
    addStat("累计答题", `${store.times} 次`);
    addStat("总正确率", store.totalQuestions ? `${Math.round((store.totalCorrect / store.totalQuestions) * 100)}%` : "-");
    addStat("待复习错题", `${dueCount} 题`);
    addStat("历史最高", store.best === null ? "-" : `${store.best} 分`);

    root.createDiv({ cls: "owb-quiz-stage" });
    this.renderStage(root);
  }

  renderStage(root) {
    const stage = root.querySelector(".owb-quiz-stage");
    if (!stage) return;
    stage.empty();

    if (!this.parsed || !this.parsed.questions.length) {
      stage.createDiv({
        cls: "owb-empty",
        text: "当前笔记未解析到题目。请使用 `## 题干` 与 `- [x] A. 正确选项` 格式编写 Markdown 题库。"
      });
      return;
    }

    if (!this.session) {
      this.renderIntro(stage);
    } else if (this.session.finished) {
      this.renderResult(stage);
    } else {
      this.renderQuestion(stage);
    }
  }

  renderIntro(stage) {
    const questions = this.parsed.questions;
    const store = this.plugin.settings.quizStore;
    const allTags = ["全部", ...new Set(questions.flatMap((q) => q.tags))];
    const filtered = this.selectedTag === "全部" ? questions : questions.filter((q) => q.tags.includes(this.selectedTag));
    const dueList = getDueOrWrongQuestions(filtered, store);

    const card = stage.createDiv({ cls: "owb-card owb-quiz-center" });
    card.createEl("h3", { text: this.parsed.meta.title });
    card.createEl("p", { cls: "owb-muted", text: this.parsed.meta.desc });

    if (allTags.length > 1) {
      const tagBar = card.createDiv({ cls: "owb-tag-row" });
      for (const tag of allTags) {
        const chip = tagBar.createEl("button", {
          cls: `owb-chip ${this.selectedTag === tag ? "is-active" : ""}`,
          text: tag
        });
        chip.addEventListener("click", () => {
          this.selectedTag = tag;
          this.renderStage(this.contentEl);
        });
      }
    }

    const optsRow = card.createDiv({ cls: "owb-quiz-opts-row" });
    const mkToggle = (label, checked, onChange) => {
      const lbl = optsRow.createEl("label", { cls: "owb-check-label" });
      const cb = lbl.createEl("input", { attr: { type: "checkbox" } });
      cb.checked = checked;
      cb.addEventListener("change", () => onChange(cb.checked));
      lbl.createSpan({ text: label });
    };
    mkToggle("题目乱序", this.plugin.settings.quizShuffleQuestions, async (v) => {
      this.plugin.settings.quizShuffleQuestions = v;
      await this.plugin.saveSettings();
    });
    mkToggle("选项乱序", this.plugin.settings.quizShuffleOptions, async (v) => {
      this.plugin.settings.quizShuffleOptions = v;
      await this.plugin.saveSettings();
    });

    const btns = card.createDiv({ cls: "owb-quiz-btn-row" });
    const startAll = btns.createEl("button", { cls: "mod-cta", text: `开始全部自测 (${filtered.length} 题)` });
    startAll.disabled = !filtered.length;
    startAll.addEventListener("click", () => this.startSession(filtered, "all"));

    const startDue = btns.createEl("button", { text: `仅练错题 / 到期复习 (${dueList.length} 题)` });
    startDue.disabled = !dueList.length;
    startDue.addEventListener("click", () => this.startSession(dueList, "wrong"));

    if (dueList.length) {
      const exportWrong = btns.createEl("button", { text: "导出错题复盘笔记" });
      exportWrong.addEventListener("click", () => this.exportWrongNote(dueList));
    }
  }

  startSession(list, mode) {
    const queue = this.plugin.settings.quizShuffleQuestions ? shuffleArray(list) : list.slice();
    this.session = {
      mode,
      queue,
      idx: 0,
      correct: 0,
      locked: false,
      finished: false,
      selected: new Set(),
      wrongItems: [],
      optOrder: [],
      startedAt: Date.now()
    };
    this.renderStage(this.contentEl);
  }

  renderQuestion(stage) {
    const q = this.session.queue[this.session.idx];
    const total = this.session.queue.length;
    const keys = Object.keys(q.options);
    if (!this.session.optOrder.length) {
      this.session.optOrder =
        this.plugin.settings.quizShuffleOptions && q.type !== "boolean" ? shuffleArray(keys) : keys;
    }

    const card = stage.createDiv({ cls: "owb-card" });
    const top = card.createDiv({ cls: "owb-quiz-qhead" });
    top.createSpan({ text: `第 ${this.session.idx + 1} / ${total} 题` });
    const typeText = q.type === "multi" ? "多选" : q.type === "boolean" ? "判断" : "单选";
    top.createSpan({ cls: "owb-badge", text: typeText });

    const barTrack = card.createDiv({ cls: "owb-bar-track owb-quiz-progress" });
    const barFill = barTrack.createDiv({ cls: "owb-bar-fill" });
    barFill.style.width = `${Math.round(((this.session.idx + (this.session.locked ? 1 : 0)) / total) * 100)}%`;

    card.createEl("p", { cls: "owb-quiz-stem", text: q.stem });

    const optList = card.createDiv({ cls: "owb-quiz-options" });
    const dispMap = {};
    this.session.optOrder.forEach((orig, i) => {
      const disp = String.fromCharCode(65 + i);
      dispMap[orig] = disp;
      const btn = optList.createEl("button", { cls: "owb-quiz-opt" });
      btn.createSpan({ cls: "owb-opt-key", text: disp });
      btn.createSpan({ text: q.options[orig] });

      if (this.session.locked) {
        btn.addClass("is-locked");
        if (q.ansList.includes(orig)) btn.addClass("is-correct");
        else if (this.session.selected.has(orig)) btn.addClass("is-wrong");
      } else if (this.session.selected.has(orig)) {
        btn.addClass("is-selected");
      }

      btn.addEventListener("click", () => this.selectOption(orig));
    });

    if (q.type === "multi" && !this.session.locked) {
      const submitRow = card.createDiv({ cls: "owb-modal-actions" });
      const submitBtn = submitRow.createEl("button", { cls: "mod-cta", text: "提交多选答案 (Enter)" });
      submitBtn.disabled = this.session.selected.size === 0;
      submitBtn.addEventListener("click", () => this.finalizeCurrentQuestion());
    }

    if (this.session.locked) {
      const right = this.session.lastRight;
      const ansText = q.ansList.map((k) => dispMap[k] || k.toUpperCase()).join("、");
      const alert = card.createDiv({ cls: `owb-alert ${right ? "is-ok" : "is-err"}` });
      alert.createEl("strong", { text: right ? "✓ 回答正确" : `✕ 正确答案：${ansText}` });
      if (q.explain) {
        alert.createDiv({ text: q.explain });
      }
      const nextRow = card.createDiv({ cls: "owb-modal-actions" });
      const isLast = this.session.idx === total - 1;
      const nextBtn = nextRow.createEl("button", {
        cls: "mod-cta",
        text: isLast ? "查看成绩 (Enter)" : "下一题 (Enter)"
      });
      nextBtn.addEventListener("click", () => this.nextQuestion());
    }
  }

  selectOption(origKey) {
    if (!this.session || this.session.locked || this.session.finished) return;
    const q = this.session.queue[this.session.idx];
    if (q.type === "multi") {
      if (this.session.selected.has(origKey)) this.session.selected.delete(origKey);
      else this.session.selected.add(origKey);
      this.renderStage(this.contentEl);
      return;
    }
    this.session.selected = new Set([origKey]);
    this.finalizeCurrentQuestion();
  }

  async finalizeCurrentQuestion() {
    if (!this.session || this.session.locked) return;
    const q = this.session.queue[this.session.idx];
    const picked = [...this.session.selected].sort();
    const right = picked.length === q.ansList.length && picked.every((v, i) => v === q.ansList[i]);
    this.session.locked = true;
    this.session.lastRight = right;
    if (right) this.session.correct += 1;
    else this.session.wrongItems.push(q);

    updateMasterySM2(this.plugin.settings.quizStore, q.id, right);
    await this.plugin.saveSettings();
    this.renderStage(this.contentEl);
  }

  async nextQuestion() {
    if (!this.session) return;
    if (this.session.idx < this.session.queue.length - 1) {
      this.session.idx += 1;
      this.session.locked = false;
      this.session.selected = new Set();
      this.session.optOrder = [];
      this.renderStage(this.contentEl);
      return;
    }

    const total = this.session.queue.length;
    const seconds = Math.max(1, Math.round((Date.now() - this.session.startedAt) / 1000));
    const store = this.plugin.settings.quizStore;
    store.times += 1;
    store.totalScore += this.session.correct;
    store.totalCorrect += this.session.correct;
    store.totalQuestions += total;
    store.best = store.best === null ? this.session.correct : Math.max(store.best, this.session.correct);
    store.history.unshift({
      at: Date.now(),
      score: this.session.correct,
      total,
      seconds,
      mode: this.session.mode
    });
    store.history = store.history.slice(0, 30);
    await this.plugin.saveSettings();

    this.session.finished = true;
    this.session.seconds = seconds;
    await this.render();
  }

  renderResult(stage) {
    const total = this.session.queue.length;
    const pct = Math.round((this.session.correct / total) * 100);
    const card = stage.createDiv({ cls: "owb-card owb-quiz-center" });
    card.createDiv({ cls: "owb-quiz-score", text: `${this.session.correct} / ${total}` });
    card.createEl("p", {
      cls: "owb-muted",
      text: `正确率 ${pct}% · 用时 ${formatDuration(this.session.seconds)}`
    });

    const btns = card.createDiv({ cls: "owb-quiz-btn-row" });
    const again = btns.createEl("button", { cls: "mod-cta", text: "再答一次" });
    again.addEventListener("click", () => this.startSession(this.session.queue, this.session.mode));

    if (this.session.wrongItems.length) {
      const retryW = btns.createEl("button", { text: `重练本次 ${this.session.wrongItems.length} 道错题` });
      retryW.addEventListener("click", () => this.startSession(this.session.wrongItems, "wrong"));

      const exportW = btns.createEl("button", { text: "写入错题复盘笔记" });
      exportW.addEventListener("click", () => this.exportWrongNote(this.session.wrongItems));
    }

    const back = btns.createEl("button", { text: "返回题库首页" });
    back.addEventListener("click", () => {
      this.session = null;
      this.render();
    });
  }

  async exportWrongNote(wrongQuestions) {
    const targetPath = normalizePath(this.plugin.settings.quizWrongExportPath || "notes/错题复盘.md");
    const callout = formatWrongCalloutMarkdown(
      this.parsed.meta.title,
      wrongQuestions,
      formatDate(new Date(), "YYYY-MM-DD")
    );
    const existing = this.app.vault.getAbstractFileByPath(targetPath);
    if (!existing) {
      const dir = targetPath.includes("/") ? targetPath.slice(0, targetPath.lastIndexOf("/")) : "";
      if (dir && !this.app.vault.getAbstractFileByPath(dir)) {
        await this.app.vault.createFolder(dir);
      }
      await this.app.vault.create(targetPath, `---\ntags: [quiz/review]\n---\n\n${callout}`);
    } else {
      await this.app.vault.process(existing, (c) => `${c.trimEnd()}\n\n${callout}`);
    }
    new Notice(`已写入 ${wrongQuestions.length} 道错题到 ${targetPath}`);
  }

  _handleKeyDown(evt) {
    if (!this.containerEl.isShown() || !this.session || this.session.finished) return;
    if (evt.target && ["INPUT", "TEXTAREA", "SELECT"].includes(evt.target.tagName)) return;
    const q = this.session.queue[this.session.idx];
    if (!this.session.locked) {
      let idx = -1;
      if (evt.key >= "1" && evt.key <= "9") idx = Number(evt.key) - 1;
      else if (/^[a-z]$/i.test(evt.key)) idx = evt.key.toLowerCase().charCodeAt(0) - 97;
      if (idx >= 0 && idx < this.session.optOrder.length) {
        evt.preventDefault();
        this.selectOption(this.session.optOrder[idx]);
      } else if (evt.key === "Enter" && q.type === "multi" && this.session.selected.size > 0) {
        evt.preventDefault();
        this.finalizeCurrentQuestion();
      }
    } else if (evt.key === "Enter") {
      evt.preventDefault();
      this.nextQuestion();
    }
  }
}

export {
  QuizView
};

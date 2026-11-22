"use strict";

const { ItemView, Notice } = require("obsidian");
const { VIEW_TYPE_RAG } = require("../constants");

/**
 * AI RAG 搜索视图：输入框 + 索引管理 + 结果列表。
 */
class RagView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.results = null;
    this.progressText = "";
  }

  getViewType() {
    return VIEW_TYPE_RAG;
  }

  getDisplayText() {
    return "AI RAG 搜索";
  }

  getIcon() {
    return "sparkles";
  }

  async onOpen() {
    await this.render();
  }

  async onClose() {
    this.contentEl.empty();
  }

  async render() {
    const root = this.contentEl;
    root.empty();
    root.addClass("owb-rag-view");

    const head = root.createDiv({ cls: "owb-rag-head" });
    head.createDiv({ cls: "owb-rag-title", text: "🪄 AI RAG 搜索" });

    const stat = this.plugin.rag.indexStat();
    const statText = stat.built
      ? `索引：${stat.files} 篇笔记 / ${stat.chunks} 块 · ${stat.model || ""}${stat.stale ? " · 模型已变，建议重建" : ""}`
      : "索引未构建";
    head.createDiv({ cls: "owb-muted", text: statText });

    const bar = root.createDiv({ cls: "owb-rag-bar" });
    const input = bar.createEl("input", {
      cls: "owb-rag-input",
      attr: { type: "text", placeholder: "用自然语言搜索全库笔记…" }
    });
    input.addEventListener("keydown", async (ev) => {
      if (ev.key === "Enter") await this.doSearch(input.value);
    });
    const searchBtn = bar.createEl("button", { cls: "mod-cta", text: "搜索" });
    searchBtn.addEventListener("click", () => this.doSearch(input.value));

    const manage = root.createDiv({ cls: "owb-rag-manage" });
    const buildBtn = manage.createEl("button", { text: "构建/更新索引" });
    buildBtn.addEventListener("click", () => this.buildIndex());
    const clearBtn = manage.createEl("button", { text: "清空索引" });
    clearBtn.addEventListener("click", async () => {
      await this.plugin.rag.clearIndex();
      this.results = null;
      new Notice("RAG 索引已清空");
      this.render();
    });

    if (this.progressText) {
      root.createDiv({ cls: "owb-muted owb-rag-progress", text: this.progressText });
    }

    const out = root.createDiv({ cls: "owb-rag-results" });
    if (!this.results) {
      out.createDiv({
        cls: "owb-muted",
        text: "输入问题回车搜索。首次使用请先构建索引（需要 SiliconFlow API Key）。"
      });
      return;
    }
    if (!this.results.length) {
      out.createDiv({ cls: "owb-muted", text: "没有找到相关内容。" });
      return;
    }
    for (const r of this.results) {
      const card = out.createDiv({ cls: "owb-card owb-rag-hit" });
      const top = card.createDiv({ cls: "owb-rag-hit-head" });
      const a = top.createEl("a", { cls: "owb-link", text: r.chunk.path.split("/").pop() });
      a.addEventListener("click", () => {
        const f = this.app.vault.getAbstractFileByPath(r.chunk.path);
        if (f) this.app.workspace.getLeaf(false).openFile(f);
      });
      top.createSpan({
        cls: "owb-muted",
        text: (r.chunk.heading ? " § " + r.chunk.heading : "") +
          ` · 相关度 ${(r.score * 100).toFixed(0)}% · 向量 ${(r.cosine * 100).toFixed(0)}%`
      });
      const body = card.createDiv({ cls: "owb-rag-hit-body" });
      body.setText(r.chunk.text.slice(0, 320) + (r.chunk.text.length > 320 ? "…" : ""));
    }
  }

  async doSearch(q) {
    const query = (q || "").trim();
    if (!query) return;
    const out = this.contentEl.querySelector(".owb-rag-results");
    if (out) out.setText("搜索中…");
    try {
      this.results = await this.plugin.rag.search(query);
    } catch (err) {
      this.results = null;
      new Notice(err.message, 6000);
    }
    this.render();
  }

  async buildIndex() {
    const btnState = (t) => {
      this.progressText = t;
      this.render();
    };
    try {
      const stat = await this.plugin.rag.buildIndex(this.app, (done, total, msg) => {
        this.progressText = msg || `${done}/${total}`;
        const el = this.contentEl.querySelector(".owb-rag-progress");
        if (el) el.setText(this.progressText);
      });
      this.progressText = "";
      new Notice(`RAG 索引完成：${stat.files} 篇 / ${stat.chunks} 块`, 6000);
      btnState("");
    } catch (err) {
      this.progressText = "";
      new Notice("索引构建失败：" + err.message, 8000);
      this.render();
    }
  }
}

module.exports = { RagView };

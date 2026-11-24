"use strict";

import { Modal, Notice, type App, type Plugin } from "obsidian";
import { searchItems, toCitation, exportBibTeX, isConfigured, type ZoteroItem } from "../services/zoteroService";

/**
 * Zotero 搜索弹窗：
 *   Enter → 搜索 → 列表（citation · title · journal）
 *   点条目 → 插入引用到当前笔记光标
 *   「导入笔记」→ 生成文献笔记 md
 *   「BibTeX」→ 复制到剪贴板
 */
export class ZoteroSearchModal extends Modal {
  plugin: Plugin & { settings: Record<string, any>; decide(s: Record<string, unknown>, q: Record<string, unknown>): Promise<{ answers: Record<string, { value: unknown; confidence: number | null }> }> };
  results: ZoteroItem[] | null;
  selected: ZoteroItem | null;
  busy: boolean;

  constructor(app: App, plugin: ZoteroSearchModal["plugin"]) {
    super(app);
    this.plugin = plugin;
    this.results = null;
    this.selected = null;
    this.busy = false;
  }

  async onOpen(): Promise<void> {
    this.render();
    setTimeout(() => {
      const input = this.contentEl.querySelector("input");
      if (input) input.focus();
    }, 30);
  }

  onClose(): void {
    this.contentEl.empty();
  }

  render(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("owb-zot-modal");

    if (!isConfigured(this.plugin.settings)) {
      contentEl.createEl("h2", { text: "Zotero 搜索" });
      const box = contentEl.createDiv({ cls: "owb-empty-slot" });
      box.createSpan({ text: "未配置 API Key 或用户 ID" });
      contentEl.createDiv({
        cls: "owb-muted",
        text: "到 zotero.org/settings/keys 创建一个只读 key（勾选 Allow library read），然后在「设置 → Zotero」里填入 key 与用户 ID（zotero.org/settings/keys 页面可见数字 ID）。"
      });
      return;
    }

    const bar = contentEl.createDiv({ cls: "owb-rag-inline" });
    const input = bar.createEl("input", {
      attr: { type: "text", placeholder: "标题 / 作者 / 关键词，回车搜索你的 Zotero 库…" }
    });
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") this.doSearch((input as HTMLInputElement).value);
    });
    bar.createEl("button", { cls: "mod-cta", text: "搜索" }).addEventListener("click", () =>
      this.doSearch((input as HTMLInputElement).value)
    );

    if (this.busy) {
      const sk = contentEl.createDiv({ cls: "owb-skeleton-box" });
      for (let i = 0; i < 4; i++) sk.createDiv({ cls: "owb-skeleton-line", attr: { style: `width:${[96, 84, 90, 76][i]}%` } });
      return;
    }

    if (!this.results) return;

    if (!this.results.length) {
      this.slot(contentEl, "没有匹配的条目");
      return;
    }

    const list = contentEl.createDiv({ cls: "owb-att-body" });
    for (const item of this.results) {
      const row = list.createDiv({ cls: "owb-base-row" });
      const cite = row.createSpan({ cls: "owb-link owb-zot-cite", text: toCitation(item) });
      cite.addEventListener("click", () => {
        this.selected = item;
        this.insertCitation(item);
      });
      const t = row.createSpan({ cls: "owb-zot-title", text: (item.title || "").slice(0, 60) });
      t.addEventListener("click", () => {
        this.selected = item;
        this.render();
      });
      if (item.publicationTitle) {
        row.createSpan({ cls: "owb-muted", text: " · " + item.publicationTitle.slice(0, 24) });
      }
    }

    // 选中条目操作区
    if (this.selected) {
      const acts = contentEl.createDiv({ cls: "owb-att-foot" });
      acts.createEl("button", { cls: "mod-cta", text: "插入引用" }).addEventListener("click", () =>
        this.insertCitation(this.selected!)
      );
      acts.createEl("button", { text: "导入文献笔记" }).addEventListener("click", async () => {
        try {
          const { importItemAsNote } = await import("../services/zoteroService");
          const folder = String(this.plugin.settings.zoteroImportFolder || "vault/文献笔记");
          const res = await importItemAsNote(this.app, this.selected!, folder);
          this.app.workspace.getLeaf(false).openFile(res.file);
          this.close();
        } catch (e) {
          new Notice("导入失败：" + (e as Error)?.message, 7000);
        }
      });
      acts.createEl("button", { text: "复制 BibTeX" }).addEventListener("click", async () => {
        try {
          const bib = await exportBibTeX([this.selected!.key], this.plugin.settings);
          await navigator.clipboard.writeText(bib);
          new Notice("BibTeX 已复制到剪贴板");
        } catch (e) {
          new Notice("BibTeX 失败：" + (e as Error)?.message, 7000);
        }
      });
      if (this.selected.abstractNote) {
        const ab = contentEl.createDiv({ cls: "owb-zot-abstract" });
        ab.setText(this.selected.abstractNote.slice(0, 400) + (this.selected.abstractNote.length > 400 ? "…" : ""));
      }
    }
  }

  slot(container: HTMLElement, text: string): void {
    container.createDiv({ cls: "owb-empty-slot" }).createSpan({ text });
  }

  insertCitation(item: ZoteroItem): void {
    const leaf = this.app.workspace.getMostRecentLeaf();
    const ed = leaf && leaf.view
      ? (leaf.view as unknown as { editor?: { replaceSelection(t: string): void } }).editor
      : null;
    if (!ed) {
      new Notice("先打开一篇笔记再插入引用");
      return;
    }
    ed.replaceSelection(`${toCitation(item)}`);
    new Notice(`已插入：${toCitation(item)}`);
    this.close();
  }

  async doSearch(query: string): Promise<void> {
    const q = String(query || "").trim();
    if (!q) return;
    this.busy = true;
    this.render();
    try {
      const res = await searchItems(q, this.plugin.settings);
      this.results = res.items;
      this.selected = null;
    } catch (e) {
      new Notice("搜索失败：" + (e as Error)?.message, 8000);
      this.results = [];
    }
    this.busy = false;
    this.render();
  }
}

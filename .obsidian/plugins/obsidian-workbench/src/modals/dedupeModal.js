"use strict";

import { Modal, Notice, setIcon } from "obsidian";
import { scanDuplicates } from "../services/hashService";
import { ATTACHMENT_EXTS, applyDedupe } from "../services/attachmentService";

function fmtSize(bytes) {
  const n = Number(bytes) || 0;
  if (n < 1024) return n + " B";
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
  return (n / 1024 / 1024).toFixed(1) + " MB";
}

/**
 * 哈希去重向导：扫描 → 分组报告 → 一键去重（引用改写 + 副本归档）。
 * 先 dry-run 呈现全部重复组，确认后才动文件。
 */
class DedupeModal extends Modal {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.busy = false;
    this.result = null;
  }

  async onOpen() {
    this.render();
  }

  onClose() {
    this.contentEl.empty();
  }

  render() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("owb-att-modal");

    contentEl.createEl("h2", { text: "附件去重（SHA-256 内容寻址）" });

    if (this.busy) {
      const box = contentEl.createDiv({ cls: "owb-empty-slot" });
      box.createSpan({ cls: "owb-spinner" });
      box.createSpan({ text: this._busyText || "计算哈希中…" });
      return;
    }

    if (!this.result) {
      contentEl.createDiv({
        cls: "owb-muted",
        text: "对全库附件逐个计算 SHA-256，内容完全相同的文件分组列出。确认后：正本保留，副本引用改写指向正本，副本归档到 4-存档（不删除）。"
      });
      const row = contentEl.createDiv({ cls: "owb-att-foot" });
      row.createEl("button", { cls: "mod-cta", text: "开始扫描" }).addEventListener("click", () => this.scan());
      return;
    }

    const { groups, scanned, wasted } = this.result;
    const head = contentEl.createDiv({ cls: "owb-att-head" });
    head.createDiv({
      cls: "owb-muted",
      text: scanned
        ? `扫描 ${scanned} 个附件：重复组 ${groups.length}，可释放 ${fmtSize(wasted)}`
        : "没有可扫描的附件"
    });
    contentEl.createDiv({
      cls: "owb-muted",
      text: "新上传的附件已按 assets/<YY>/<MM>/<哈希>.<ext> 存放，内容相同自动复用，不再产生重复。"
    });

    const body = contentEl.createDiv({ cls: "owb-att-body" });
    if (!groups.length) {
      this.slot(body, "🎉 没有重复附件");
      return;
    }

    for (const g of groups.slice(0, 60)) {
      const card = body.createDiv({ cls: "owb-card owb-dup-group" });
      const h = card.createDiv({ cls: "owb-card-title-row" });
      h.createDiv({ cls: "owb-card-title", text: `${g.dups.length + 1} 份相同 · ${fmtSize(g.size)} · 可省 ${fmtSize(g.wasted)}` });
      const open = h.createEl("button", { cls: "owb-mini-btn", text: "查看正本" });
      open.addEventListener("click", () => this.app.workspace.getLeaf(false).openFile(g.keep.file));

      const keepRow = card.createDiv({ cls: "owb-base-row" });
      keepRow.createSpan({ cls: "owb-dup-keep", text: "保留" });
      keepRow.createEl("a", { cls: "owb-link", text: g.keep.file.path }).addEventListener("click", () =>
        this.app.workspace.getLeaf(false).openFile(g.keep.file)
      );

      for (const d of g.dups) {
        const row = card.createDiv({ cls: "owb-base-row owb-dup-dup" });
        row.createSpan({ cls: "owb-dup-keep", text: "副本" });
        row.createEl("a", { cls: "owb-link", text: d.file.path }).addEventListener("click", () =>
          this.app.workspace.getLeaf(false).openFile(d.file)
        );
        row.createSpan({ cls: "owb-muted", text: `引用 ${d.refs}` });
      }
    }

    const foot = contentEl.createDiv({ cls: "owb-att-foot" });
    const all = foot.createEl("button", { cls: "mod-warning", text: `归档全部重复副本 (${groups.reduce((s, g) => s + g.dups.length, 0)})` });
    all.addEventListener("click", () => this.apply());
    foot.createEl("button", { text: "重新扫描" }).addEventListener("click", () => this.scan());
  }

  slot(container, text) {
    const s = container.createDiv({ cls: "owb-empty-slot" });
    s.createSpan({ text });
  }

  async scan() {
    const EXTS = ATTACHMENT_EXTS;
    this.busy = true;
    this._busyText = "读取并计算附件哈希…（大文件逐个处理）";
    this.render();

    // 引用计数：同名 wikilink 无法区分副本，按 basename 粗计（决定正本的启发式）
    const refByName = new Map();
    let mds = [];
    try {
      mds = this.app.vault.getMarkdownFiles();
    } catch (e) {
      mds = [];
    }
    for (const md of mds) {
      let text = "";
      try {
        text = await this.app.vault.read(md);
      } catch (e) {
        continue;
      }
      for (const m of text.matchAll(/\[\[([^\]]+)\]\]|\]\(([^)]+)\)/g)) {
        const target = (m[1] || m[2] || "").split("|")[0].split("#")[0].trim();
        if (!target) continue;
        const base = target.split("/").pop();
        if (base) refByName.set(base, (refByName.get(base) || 0) + 1);
      }
    }

    const files = this.app.vault
      .getFiles()
      .filter((f) => EXTS.has(String(f.extension || "").toLowerCase()))
      .filter((f) => !f.path.startsWith("4-存档/"));

    const items = files.map((f) => ({
      file: f,
      bytes: async () => {
        const buf = await this.app.vault.readBinary(f);
        return new Uint8Array(buf);
      }
    }));

    const result = await scanDuplicates(items, (f) => refByName.get(f.name) || 0);
    this.result = result;
    this.busy = false;
    this.render();
  }

  async apply() {
    if (!this.result || !this.result.groups.length) return;
    this.busy = true;
    this._busyText = "改写引用并归档副本…";
    this.render();
    try {
      const res = await applyDedupe(this.app, this.result.groups);
      new Notice(
        `去重完成：归档 ${res.moved.length} 个副本，改写 ${res.touched} 篇笔记${res.failed.length ? `，失败 ${res.failed.length}` : ""}`,
        8000
      );
    } catch (e) {
      new Notice("去重失败：" + e.message, 8000);
    }
    this.result = null;
    this.busy = false;
    this.render();
  }
}

export { DedupeModal, fmtSize };

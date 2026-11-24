// @ts-nocheck -- 批2机械迁移: 类型化排入队列
"use strict";

import { Modal, Notice } from "obsidian";
import { auditVault, archiveOrphans } from "../services/attachmentService";
import { AttachmentPreviewModal } from "./attachmentPreviewModal";

function fmtSize(bytes) {
  const n = Number(bytes) || 0;
  if (n < 1024) return n + " B";
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
  if (n < 1024 * 1024 * 1024) return (n / 1024 / 1024).toFixed(1) + " MB";
  return (n / 1024 / 1024 / 1024).toFixed(2) + " GB";
}

/**
 * 附件管理器：孤儿附件 / 坏引用 / 体积榜，支持勾选批量归档。
 */
class AttachmentModal extends Modal {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.report = null;
    this.selected = new Set();
    this.tab = "orphans"; // orphans | missing | size
  }

  async onOpen() {
    await this.render();
    await this.audit();
  }

  async audit() {
    const { contentEl } = this;
    const status = contentEl.querySelector(".owb-att-status");
    if (status) status.setText("扫描中…");
    try {
      this.report = await auditVault(this.app);
      this.selected.clear();
    } catch (e) {
      new Notice("附件扫描失败：" + e.message, 8000);
      this.report = null;
    }
    this.render();
  }

  render() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("owb-att-modal");

    contentEl.createEl("h2", { text: "📎 附件管理器" });

    const r = this.report;
    const head = contentEl.createDiv({ cls: "owb-att-head" });
    if (!r) {
      head.createDiv({ cls: "owb-muted owb-att-status", text: "尚未扫描" });
      head.createEl("button", { text: "重新扫描" }).addEventListener("click", () => this.audit());
      return;
    }
    head.createDiv({
      cls: "owb-muted owb-att-status",
      text:
        `附件 ${r.attachments.length} 个（${fmtSize(r.totalBytes)}） · 被 ${r.mdCount} 篇笔记引用 · ` +
        `孤儿 ${r.orphans.length}（${fmtSize(r.orphanBytes)}） · 坏引用 ${r.missingRefs.length}`
    });

    const toolbar = contentEl.createDiv({ cls: "owb-att-toolbar" });
    const mkTab = (key, label) => {
      const b = toolbar.createEl("button", { cls: this.tab === key ? "mod-cta" : "", text: label });
      b.addEventListener("click", () => {
        this.tab = key;
        this.render();
      });
    };
    mkTab("orphans", `孤儿 (${r.orphans.length})`);
    mkTab("missing", `坏引用 (${r.missingRefs.length})`);
    mkTab("size", "体积榜");
    toolbar.createEl("button", { text: "重新扫描" }).addEventListener("click", () => this.audit());

    const body = contentEl.createDiv({ cls: "owb-att-body" });

    if (this.tab === "orphans") {
      if (!r.orphans.length) {
        body.createDiv({ cls: "owb-muted", text: "🎉 没有孤儿附件，全部被引用。" });
        return;
      }
      body.createDiv({
        cls: "owb-muted",
        text: "未被任何笔记引用的附件。勾选后归档到 4-存档/<日期>_孤儿附件/（不删除）。"
      });
      const list = body.createDiv({ cls: "owb-att-list" });
      for (const f of r.orphans) {
        const row = list.createDiv({ cls: "owb-att-row" });
        const cb = row.createEl("input", { attr: { type: "checkbox" } });
        cb.checked = this.selected.has(f.path);
        cb.addEventListener("change", () => {
          if (cb.checked) this.selected.add(f.path);
          else this.selected.delete(f.path);
          this.updateArchiveBtn();
        });
        const a = row.createEl("a", { cls: "owb-link", text: f.name });
        a.addEventListener("click", () => new AttachmentPreviewModal(this.app, this.plugin, f).open());
        row.createSpan({ cls: "owb-muted", text: ` · ${f.parent ? f.parent.path : "/"} · ${fmtSize(f.stat && f.stat.size)}` });
      }

      const foot = body.createDiv({ cls: "owb-att-foot" });
      const allBtn = foot.createEl("button", { text: "全选" });
      allBtn.addEventListener("click", () => {
        for (const f of r.orphans) this.selected.add(f.path);
        this.render();
      });
      this.archiveBtn = foot.createEl("button", { cls: "mod-warning", text: `归档所选 (0)` });
      this.archiveBtn.addEventListener("click", () => this.doArchive());
      this.updateArchiveBtn();
      return;
    }

    if (this.tab === "missing") {
      if (!r.missingRefs.length) {
        body.createDiv({ cls: "owb-muted", text: "🎉 没有坏引用。" });
        return;
      }
      body.createDiv({ cls: "owb-muted", text: "笔记里引用了但磁盘上找不到的附件（改名/删除/同步缺失）。" });
      const list = body.createDiv({ cls: "owb-att-list" });
      for (const m of r.missingRefs.slice(0, 200)) {
        const row = list.createDiv({ cls: "owb-att-row" });
        const a = row.createEl("a", { cls: "owb-link", text: m.target });
        a.addEventListener("click", () => this.app.workspace.getLeaf(false).openFile(m.file));
        row.createSpan({ cls: "owb-muted", text: ` ← ${m.file.path}` });
      }
      return;
    }

    // 体积榜
    body.createDiv({ cls: "owb-muted", text: "体积最大的 15 个附件。" });
    const list = body.createDiv({ cls: "owb-att-list" });
    for (const s of r.sizeTop) {
      const row = list.createDiv({ cls: "owb-att-row" });
      const a = row.createEl("a", { cls: "owb-link", text: s.file.name });
      a.addEventListener("click", () => new AttachmentPreviewModal(this.app, this.plugin, s.file).open());
      row.createSpan({ cls: "owb-muted", text: ` · ${fmtSize(s.size)} · ${s.file.path}` });
    }
  }

  updateArchiveBtn() {
    if (!this.archiveBtn) return;
    this.archiveBtn.setText(`归档所选 (${this.selected.size})`);
    this.archiveBtn.disabled = this.selected.size === 0;
  }

  async doArchive() {
    const r = this.report;
    if (!r) return;
    const files = r.orphans.filter((f) => this.selected.has(f.path));
    if (!files.length) return;
    try {
      const res = await archiveOrphans(this.app, files, "附件管理器");
      new Notice(`已归档 ${res.moved.length} 个附件 → ${res.destDir}${res.failed.length ? `，失败 ${res.failed.length}` : ""}`, 7000);
      await this.audit();
    } catch (e) {
      new Notice("归档失败：" + e.message, 8000);
    }
  }
}

export {
  AttachmentModal,
  fmtSize
};

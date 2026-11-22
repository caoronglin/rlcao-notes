"use strict";

const { Modal, Notice, normalizePath } = require("obsidian");
const { formatDate, insertCaptureLine } = require("../utils");

/**
 * 快速闪念弹窗：保留 YAML frontmatter，支持快捷标签与 Ctrl/Cmd+Enter 提交。
 */
class QuickCaptureModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this.selectedTags = new Set();
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("owb-modal");

    contentEl.createEl("h3", { text: "💡 快速闪念" });
    contentEl.createEl("p", {
      cls: "owb-muted",
      text: `写入目标：${this.plugin.settings.inboxPath}（${this.plugin.settings.captureInsertMode === "top" ? "插在 Frontmatter 之后" : "追加到文末"}）`
    });

    const textarea = contentEl.createEl("textarea", {
      cls: "owb-textarea",
      attr: { rows: "4", placeholder: "输入灵感、待办或摘录...（Ctrl/Cmd + Enter 立即保存）" }
    });

    const tagRow = contentEl.createDiv({ cls: "owb-tag-row" });
    for (const tag of ["#闪念", "#待整理", "#重要", "#灵感"]) {
      const chip = tagRow.createEl("button", { cls: "owb-chip", text: tag, attr: { type: "button" } });
      chip.addEventListener("click", () => {
        if (this.selectedTags.has(tag)) {
          this.selectedTags.delete(tag);
          chip.removeClass("is-active");
        } else {
          this.selectedTags.add(tag);
          chip.addClass("is-active");
        }
      });
    }

    const actions = contentEl.createDiv({ cls: "owb-modal-actions" });
    const cancelBtn = actions.createEl("button", { text: "取消" });
    cancelBtn.addEventListener("click", () => this.close());

    const submitBtn = actions.createEl("button", { cls: "mod-cta", text: "保存到收件箱" });
    const submit = async () => {
      const raw = textarea.value.trim();
      if (!raw) {
        new Notice("请输入闪念内容");
        return;
      }
      submitBtn.disabled = true;
      try {
        await this.saveCapture(raw);
        new Notice("已保存到闪念收件箱");
        this.close();
      } catch (err) {
        new Notice(`保存失败：${err.message}`);
        submitBtn.disabled = false;
      }
    };

    submitBtn.addEventListener("click", submit);
    textarea.addEventListener("keydown", (evt) => {
      if ((evt.ctrlKey || evt.metaKey) && evt.key === "Enter") {
        evt.preventDefault();
        submit();
      }
    });

    setTimeout(() => textarea.focus(), 20);
  }

  async saveCapture(text) {
    const { inboxPath, captureInsertMode, captureTimeFormat } = this.plugin.settings;
    const normPath = normalizePath(inboxPath || "inbox.md");
    const stamp = formatDate(new Date(), captureTimeFormat || "HH:mm");
    const suffix = this.selectedTags.size ? ` ${[...this.selectedTags].join(" ")}` : "";
    const line = `- ${stamp} - ${text}${suffix}`;

    const existing = this.app.vault.getAbstractFileByPath(normPath);
    if (!existing) {
      const parentDir = normPath.includes("/") ? normPath.slice(0, normPath.lastIndexOf("/")) : "";
      if (parentDir && !this.app.vault.getAbstractFileByPath(parentDir)) {
        await this.app.vault.createFolder(parentDir);
      }
      const initial = `---\ntags: [inbox]\n---\n\n${line}\n`;
      await this.app.vault.create(normPath, initial);
    } else {
      await this.app.vault.process(existing, (content) =>
        insertCaptureLine(content, line, captureInsertMode)
      );
    }
    this.plugin.refreshWorkbenchViews();
  }

  onClose() {
    this.contentEl.empty();
  }
}

module.exports = { QuickCaptureModal };

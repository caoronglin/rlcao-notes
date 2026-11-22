"use strict";

const { Modal, Notice, normalizePath } = require("obsidian");
const { generateQuizMarkdownFromNote } = require("../services/aiService");

/**
 * AI 从当前打开的笔记自动生成 Markdown 自测题库弹窗。
 */
class AIQuizModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("owb-modal");
    contentEl.createEl("h3", { text: "✨ AI 从笔记自动出题" });

    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      contentEl.createEl("p", { cls: "owb-muted", text: "请先打开一篇 Markdown 笔记，再运行自动出题。" });
      return;
    }

    contentEl.createEl("p", {
      cls: "owb-muted",
      text: `源笔记：${activeFile.path} · 模型：${this.plugin.settings.aiModel}`
    });

    const folder = (this.plugin.settings.quizFolder || "notes").replace(/^\/+|\/+$/g, "");
    const defaultOut = normalizePath(`${folder}/${activeFile.basename}-自测题库.md`);

    contentEl.createEl("label", { cls: "owb-muted", text: "输出题库路径" });
    const pathInput = contentEl.createEl("input", {
      cls: "owb-input",
      attr: { type: "text", value: defaultOut }
    });

    contentEl.createEl("label", { cls: "owb-muted", text: "生成题目数量（1–20）", attr: { style: "display:block;margin-top:10px" } });
    const countInput = contentEl.createEl("input", {
      cls: "owb-input",
      attr: { type: "number", min: "1", max: "20", value: String(this.plugin.settings.aiQuizCount || 5) }
    });

    const actions = contentEl.createDiv({ cls: "owb-modal-actions" });
    const cancelBtn = actions.createEl("button", { text: "取消" });
    cancelBtn.addEventListener("click", () => this.close());

    const genBtn = actions.createEl("button", { cls: "mod-cta", text: "开始生成题库" });
    genBtn.addEventListener("click", async () => {
      const outPath = normalizePath(pathInput.value.trim() || defaultOut);
      const count = Math.max(1, Math.min(20, Number.parseInt(countInput.value, 10) || 5));
      genBtn.disabled = true;
      genBtn.setText("正在生成...");
      try {
        const noteText = await this.app.vault.cachedRead(activeFile);
        const md = await generateQuizMarkdownFromNote(
          activeFile.basename,
          noteText,
          count,
          this.plugin.settings
        );

        const dir = outPath.includes("/") ? outPath.slice(0, outPath.lastIndexOf("/")) : "";
        if (dir && !this.app.vault.getAbstractFileByPath(dir)) {
          await this.app.vault.createFolder(dir);
        }
        const existing = this.app.vault.getAbstractFileByPath(outPath);
        if (existing) {
          await this.app.vault.modify(existing, md);
        } else {
          await this.app.vault.create(outPath, md);
        }

        new Notice(`已生成自测题库：${outPath}`);
        this.close();
        if (this.plugin.isFeatureEnabled("quizEngine")) {
          await this.plugin.activateQuizView(outPath);
        }
      } catch (err) {
        new Notice(`AI 出题失败：${err.message}`, 7000);
        genBtn.disabled = false;
        genBtn.setText("开始生成题库");
      }
    });
  }

  onClose() {
    this.contentEl.empty();
  }
}

module.exports = { AIQuizModal };

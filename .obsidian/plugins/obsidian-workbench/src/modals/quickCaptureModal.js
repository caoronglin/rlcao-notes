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

    // 决策接口（内部）：判断这条闪念该归入哪个区，只做提示、不自动移动
    if (this.plugin.settings.decisionAutoClassify !== false && this.plugin.isFeatureEnabled("decision")) {
      this.classifyInBackground(text);
    }
  }

  /** 后台调用决策模型，失败静默（不能因为模型挂了影响记笔记） */
  async classifyInBackground(text) {
    try {
      const floor = this.plugin.settings.decisionConfidenceFloor == null
        ? 0.6
        : this.plugin.settings.decisionConfidenceFloor;
      const { answers } = await this.plugin.decide(
        { message: text },
        {
          area: {
            type: "choice",
            instructions: "这条闪念最该归入哪个知识区？",
            criteria: {
              study: "课程与学习笔记",
              project: "某个项目或实验的一部分",
              reference: "文献与参考资料",
              life: "生活事务，与知识库无关",
              inbox: "还没想清楚，先留在收件箱"
            }
          }
        }
      );
      const a = answers && answers.area;
      if (!a || a.confidence == null || a.confidence < floor) return;
      new Notice(`决策建议：归入「${a.value}」（置信度 ${(a.confidence * 100).toFixed(0)}%）`, 6000);
    } catch (e) {
      // 静默：决策接口不可用不影响采集
      console.debug("[workbench] 决策归类跳过:", e && e.message);
    }
  }

  onClose() {
    this.contentEl.empty();
  }
}

module.exports = { QuickCaptureModal };

// @ts-nocheck -- 批2机械迁移: 类型化排入队列
"use strict";

import { Modal, Notice } from "obsidian";

class BranchModal extends Modal {
  constructor(app, onCreate) {
    super(app);
    this.onCreate = onCreate;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("owb-modal");

    contentEl.createEl("h3", { text: "新建 Git 分支" });
    const input = contentEl.createEl("input", {
      cls: "owb-input",
      attr: { type: "text", placeholder: "例如：feat/notes-refactor" }
    });

    const actions = contentEl.createDiv({ cls: "owb-modal-actions" });
    const cancelBtn = actions.createEl("button", { text: "取消" });
    cancelBtn.addEventListener("click", () => this.close());

    const okBtn = actions.createEl("button", { cls: "mod-cta", text: "创建并切换" });
    const submit = async () => {
      const name = input.value.trim();
      if (!name) {
        new Notice("请输入分支名称");
        return;
      }
      okBtn.disabled = true;
      try {
        await this.onCreate(name);
        this.close();
      } catch (err) {
        new Notice(err.message);
        okBtn.disabled = false;
      }
    };

    okBtn.addEventListener("click", submit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") submit();
    });
    setTimeout(() => input.focus(), 20);
  }

  onClose() {
    this.contentEl.empty();
  }
}

export {
  BranchModal
};

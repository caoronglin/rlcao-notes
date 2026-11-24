// @ts-nocheck -- 批2机械迁移: 类型化排入队列
"use strict";

import { Modal } from "obsidian";

/**
 * Git Diff 语法高亮查看弹窗（按行安全渲染，零 innerHTML）。
 */
class DiffModal extends Modal {
  constructor(app, title, diffText) {
    super(app);
    this.diffTitle = title;
    this.diffText = diffText || "";
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("owb-diff-modal");

    contentEl.createEl("h3", { text: this.diffTitle });
    const pre = contentEl.createDiv({ cls: "owb-diff-container" });

    for (const line of this.diffText.split(/\r?\n/)) {
      let cls = "owb-diff-line";
      if (line.startsWith("+") && !line.startsWith("+++")) cls += " is-add";
      else if (line.startsWith("-") && !line.startsWith("---")) cls += " is-del";
      else if (line.startsWith("@@") || line.startsWith("diff --git")) cls += " is-hunk";
      pre.createDiv({ cls, text: line || " " });
    }
  }

  onClose() {
    this.contentEl.empty();
  }
}

export {
  DiffModal
};

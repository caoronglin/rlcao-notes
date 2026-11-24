// @ts-nocheck -- 批2机械迁移: 类型化排入队列
"use strict";

import { Modal, Notice } from "obsidian";
import { diagnoseVault, ensureSafeGitignore } from "../services/doctorService";

class DoctorModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
  }

  async onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("owb-modal");
    contentEl.createEl("h3", { text: "🩺 Vault 健康体检报告" });

    const basePath = this.plugin.getVaultBasePath();
    if (!basePath) {
      contentEl.createEl("p", { text: "无法获取本地 Vault 路径，跳过体检。" });
      return;
    }

    const listEl = contentEl.createDiv({ cls: "owb-doctor-list" });
    listEl.createEl("p", { cls: "owb-muted", text: "正在扫描配置与 Git 安全规则..." });

    const issues = await diagnoseVault(basePath, this.plugin.gitService);
    listEl.empty();

    if (!issues.length) {
      listEl.createDiv({
        cls: "owb-doctor-ok",
        text: "✅ 全部检查通过：无悬空 CSS、无错误快捷键格式、Git 敏感凭证已受保护。"
      });
      return;
    }

    for (const iss of issues) {
      const row = listEl.createDiv({ cls: `owb-doctor-item is-${iss.severity}` });
      row.createSpan({ cls: "owb-badge", text: iss.severity.toUpperCase() });
      row.createSpan({ cls: "owb-doctor-msg", text: iss.message });

      if (iss.code === "GITIGNORE_INCOMPLETE") {
        const fixBtn = row.createEl("button", { cls: "owb-btn-sm", text: "一键补全 .gitignore" });
        fixBtn.addEventListener("click", () => {
          const added = ensureSafeGitignore(basePath);
          new Notice(added ? "已写入推荐 .gitignore 保护规则" : "规则已存在");
          this.onOpen();
        });
      }
    }
  }

  onClose() {
    this.contentEl.empty();
  }
}

export {
  DoctorModal
};

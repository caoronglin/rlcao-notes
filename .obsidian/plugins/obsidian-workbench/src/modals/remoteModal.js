"use strict";

const { Modal, Notice } = require("obsidian");

/**
 * Git 远程仓库配置向导弹窗（查看/添加/修改/删除远程 URL + 绑定上游推送）。
 */
class RemoteModal extends Modal {
  constructor(app, gitService, currentBranch, onUpdated) {
    super(app);
    this.gitService = gitService;
    this.currentBranch = currentBranch || "main";
    this.onUpdated = onUpdated;
  }

  async onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("owb-modal");
    contentEl.createEl("h3", { text: "🌐 Git 远程仓库配置" });

    const remotes = await this.gitService.listRemotes();
    const listWrap = contentEl.createDiv({ cls: "owb-remote-list" });
    if (!remotes.length) {
      listWrap.createDiv({ cls: "owb-muted", text: "暂未配置远程仓库（可在下方添加 origin）。" });
    } else {
      for (const r of remotes) {
        const row = listWrap.createDiv({ cls: "owb-remote-row" });
        row.createSpan({ cls: "owb-badge", text: r.name });
        row.createSpan({ cls: "owb-remote-url", text: r.url });
        const pushBtn = row.createEl("button", { cls: "owb-btn-sm", text: "绑定上游并推送" });
        pushBtn.addEventListener("click", async () => {
          pushBtn.disabled = true;
          try {
            await this.gitService.pushSetUpstream(r.name, this.currentBranch);
            new Notice(`已推送并绑定上游 ${r.name}/${this.currentBranch}`);
            if (this.onUpdated) await this.onUpdated();
          } catch (err) {
            new Notice(err.message, 6000);
          } finally {
            pushBtn.disabled = false;
          }
        });
        const delBtn = row.createEl("button", { cls: "owb-btn-sm", text: "移除" });
        delBtn.addEventListener("click", async () => {
          try {
            await this.gitService.removeRemote(r.name);
            new Notice(`已移除远程 ${r.name}`);
            if (this.onUpdated) await this.onUpdated();
            await this.onOpen();
          } catch (err) {
            new Notice(err.message);
          }
        });
      }
    }

    contentEl.createEl("h4", { text: "添加或更新远程仓库" });
    const nameInput = contentEl.createEl("input", {
      cls: "owb-input",
      attr: { type: "text", value: "origin", placeholder: "远程名（默认 origin）" }
    });
    const urlInput = contentEl.createEl("input", {
      cls: "owb-input",
      attr: {
        type: "text",
        style: "margin-top:8px",
        placeholder: "例如：git@github.com:user/vault.git 或 https://github.com/user/vault.git"
      }
    });

    const actions = contentEl.createDiv({ cls: "owb-modal-actions" });
    const closeBtn = actions.createEl("button", { text: "关闭" });
    closeBtn.addEventListener("click", () => this.close());

    const saveBtn = actions.createEl("button", { cls: "mod-cta", text: "保存远程配置" });
    saveBtn.addEventListener("click", async () => {
      const name = nameInput.value.trim() || "origin";
      const url = urlInput.value.trim();
      if (!url) {
        new Notice("请输入远程仓库 URL");
        return;
      }
      saveBtn.disabled = true;
      try {
        await this.gitService.setRemote(name, url);
        new Notice(`已保存远程 ${name}`);
        if (this.onUpdated) await this.onUpdated();
        await this.onOpen();
      } catch (err) {
        new Notice(err.message);
      } finally {
        saveBtn.disabled = false;
      }
    });
  }

  onClose() {
    this.contentEl.empty();
  }
}

module.exports = { RemoteModal };

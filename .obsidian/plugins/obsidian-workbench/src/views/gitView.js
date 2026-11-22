"use strict";

const { ItemView, Notice, setIcon } = require("obsidian");
const { VIEW_TYPE_GIT } = require("../constants");
const { formatDate } = require("../utils");
const { DiffModal } = require("../modals/diffModal");
const { BranchModal } = require("../modals/branchModal");
const { RemoteModal } = require("../modals/remoteModal");
const { generateCommitMessage } = require("../services/aiService");

/**
 * 右侧边栏 Git 管理面板（v3.0）：
 * 支持分支切换/新建、远程配置向导、合并冲突一键解决、Stash 暂存栈、AI 提交信息生成与提交历史。
 */
class GitPanelView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.commitDraft = "";
    this.busy = false;
  }

  getViewType() {
    return VIEW_TYPE_GIT;
  }

  getDisplayText() {
    return "Git 工作台";
  }

  getIcon() {
    return "git-branch";
  }

  async onOpen() {
    await this.render();
  }

  async onClose() {
    this.contentEl.empty();
  }

  async runAction(label, fn) {
    if (this.busy) return;
    this.busy = true;
    try {
      await fn();
      await this.render();
      await this.plugin.updateGitStatusBar();
    } catch (err) {
      new Notice(`${label}失败：${err.message}`, 6000);
    } finally {
      this.busy = false;
    }
  }

  async render() {
    const root = this.contentEl;
    root.empty();
    root.addClass("owb-git-view");

    if (!this.plugin.isFeatureEnabled("gitPanel")) {
      root.createDiv({ cls: "owb-empty", text: "Git 管理面板已在插件设置中关闭。" });
      return;
    }

    const git = this.plugin.gitService;
    if (!git) {
      root.createDiv({ cls: "owb-empty", text: "当前环境不支持本地 Git 管理（仅桌面端可用）。" });
      return;
    }

    let status;
    try {
      status = await git.getStatus();
    } catch (err) {
      root.createDiv({ cls: "owb-empty", text: `Git 检测失败：${err.message}` });
      return;
    }

    if (!status.isRepo) {
      const box = root.createDiv({ cls: "owb-empty" });
      box.createEl("p", { text: "当前 Vault 尚未初始化 Git 仓库。" });
      const initBtn = box.createEl("button", { cls: "mod-cta", text: "初始化 Git 仓库 (git init)" });
      initBtn.addEventListener("click", () =>
        this.runAction("初始化仓库", async () => {
          await git.initRepo();
          new Notice("已初始化 Git 仓库");
        })
      );
      return;
    }

    const advEnabled = this.plugin.isFeatureEnabled("gitAdvanced");
    const aiEnabled = this.plugin.isFeatureEnabled("aiAssist");

    // 1. 顶部操作栏
    const topBar = root.createDiv({ cls: "owb-git-toolbar" });
    const titleGroup = topBar.createDiv({ cls: "owb-git-branch-wrap" });

    const branches = await git.listBranches().catch(() => []);
    const select = titleGroup.createEl("select", { cls: "owb-select" });
    for (const br of branches) {
      const opt = select.createEl("option", { value: br.name, text: br.name });
      if (br.current) opt.selected = true;
    }
    if (!branches.length) {
      select.createEl("option", { value: status.branch, text: status.branch || "main" });
    }
    select.addEventListener("change", () => {
      const target = select.value;
      if (target && target !== status.branch) {
        this.runAction("切换分支", async () => {
          await git.checkoutBranch(target);
          new Notice(`已切换至分支 ${target}`);
        });
      }
    });

    const newBrBtn = titleGroup.createEl("button", {
      cls: "clickable-icon",
      attr: { "aria-label": "新建分支" }
    });
    setIcon(newBrBtn, "plus");
    newBrBtn.addEventListener("click", () => {
      new BranchModal(this.app, async (name) => {
        await git.createBranch(name);
        new Notice(`已创建并切换至 ${name}`);
        await this.render();
      }).open();
    });

    const btnGroup = topBar.createDiv({ cls: "owb-git-actions" });
    const addIconBtn = (iconName, label, handler) => {
      const b = btnGroup.createEl("button", { cls: "clickable-icon", attr: { "aria-label": label } });
      setIcon(b, iconName);
      b.addEventListener("click", handler);
      return b;
    };

    if (advEnabled) {
      addIconBtn("globe", "远程仓库配置", () => {
        new RemoteModal(this.app, git, status.branch, () => this.render()).open();
      });
    }
    addIconBtn("refresh-cw", "刷新状态", () => this.render());
    addIconBtn("arrow-down-to-line", "拉取 (Pull)", () =>
      this.runAction("Pull", async () => {
        await git.pull();
        new Notice("拉取完成");
      })
    );
    addIconBtn("arrow-up-from-line", "推送 (Push)", () =>
      this.runAction("Push", async () => {
        await git.push();
        new Notice("推送完成");
      })
    );

    const metaBar = root.createDiv({ cls: "owb-git-meta" });
    const totalDirty = status.conflicts.length + status.staged.length + status.unstaged.length;
    metaBar.createSpan({ text: `变更 ${totalDirty} 项` });
    metaBar.createSpan({ text: status.upstream ? `↑${status.ahead} ↓${status.behind}` : "未绑定远程上游" });

    // 2. 合并冲突高优提醒区（开启 gitAdvanced 且存在冲突时显示）
    if (advEnabled && status.conflicts.length) {
      const cSec = root.createDiv({ cls: "owb-git-conflict-box" });
      cSec.createDiv({
        cls: "owb-git-sec-head",
        text: `⚠️ 合并冲突 (${status.conflicts.length})`
      });
      for (const item of status.conflicts) {
        const row = cSec.createDiv({ cls: "owb-git-conflict-row" });
        row.createDiv({ cls: "owb-git-filepath", text: item.path, attr: { title: item.path } });
        const ops = row.createDiv({ cls: "owb-git-conflict-ops" });
        const oursBtn = ops.createEl("button", { cls: "owb-btn-sm", text: "保留本地" });
        oursBtn.addEventListener("click", () =>
          this.runAction("保留本地版本", async () => {
            await git.resolveConflict(item.path, "ours");
            new Notice(`已采用本地版本：${item.path}`);
          })
        );
        const theirsBtn = ops.createEl("button", { cls: "owb-btn-sm", text: "采用远程" });
        theirsBtn.addEventListener("click", () =>
          this.runAction("采用远程版本", async () => {
            await git.resolveConflict(item.path, "theirs");
            new Notice(`已采用远程版本：${item.path}`);
          })
        );
      }
    }

    // 3. 提交信息与操作区
    const commitBox = root.createDiv({ cls: "owb-git-commit-box" });
    const msgInput = commitBox.createEl("textarea", {
      cls: "owb-textarea owb-git-msg",
      attr: { rows: "2", placeholder: "输入提交信息（留空将自动使用模板）" }
    });
    msgInput.value = this.commitDraft;
    msgInput.addEventListener("input", () => {
      this.commitDraft = msgInput.value;
    });

    const commitBtns = commitBox.createDiv({ cls: "owb-git-commit-btns" });
    const commitBtn = commitBtns.createEl("button", { cls: "mod-cta", text: "提交" });
    const syncBtn = commitBtns.createEl("button", { text: "一键同步" });

    if (aiEnabled) {
      const aiBtn = commitBtns.createEl("button", { text: "✨ AI 摘要" });
      aiBtn.addEventListener("click", async () => {
        aiBtn.disabled = true;
        aiBtn.setText("生成中...");
        try {
          const diff = await git.getDiffForAI();
          const msg = await generateCommitMessage(diff, this.plugin.settings);
          this.commitDraft = msg;
          msgInput.value = msg;
          new Notice("已生成 AI 提交信息");
        } catch (err) {
          new Notice(`AI 生成失败：${err.message}`, 6000);
        } finally {
          aiBtn.disabled = false;
          aiBtn.setText("✨ AI 摘要");
        }
      });
    }

    const resolveMessage = () => {
      const v = this.commitDraft.trim();
      if (v) return v;
      const tpl = this.plugin.settings.gitCommitTemplate || "vault backup: {{date}}";
      return tpl.replace("{{date}}", formatDate(new Date(), "YYYY-MM-DD HH:mm"));
    };

    commitBtn.addEventListener("click", () =>
      this.runAction("提交", async () => {
        if (!status.staged.length) await git.stageAll();
        await git.commit(resolveMessage());
        this.commitDraft = "";
        new Notice("Git 提交成功");
      })
    );

    syncBtn.addEventListener("click", () =>
      this.runAction("一键同步", async () => {
        const msg = resolveMessage();
        const st = await git.getStatus();
        if (st.staged.length || st.unstaged.length) {
          await git.stageAll();
          await git.commit(msg);
          this.commitDraft = "";
        }
        if (st.upstream) {
          await git.pull();
          await git.push();
          new Notice("已完成提交、拉取与推送");
        } else {
          new Notice("已完成本地提交（未配置远程分支，跳过推送）");
        }
      })
    );

    // 4. 已暂存 / 未暂存列表
    this.renderChangeSection(root, "已暂存更改", status.staged, true);
    this.renderChangeSection(root, "未暂存更改", status.unstaged, false);

    // 5. Stash 暂存栈区（受 gitAdvanced 开关控制）
    if (advEnabled) {
      const stashes = await git.listStashes();
      const sSec = root.createDiv({ cls: "owb-git-section" });
      const sHead = sSec.createDiv({ cls: "owb-git-sec-head" });
      sHead.createSpan({ text: `Stash 暂存栈 (${stashes.length})` });
      const pushStashBtn = sHead.createEl("button", { cls: "owb-btn-sm", text: "暂存当前更改" });
      pushStashBtn.addEventListener("click", () =>
        this.runAction("Stash 暂存", async () => {
          await git.stashPush(`owb-stash ${formatDate(new Date(), "MM-DD HH:mm")}`);
          new Notice("已将当前工作区存入 Stash");
        })
      );

      if (!stashes.length) {
        sSec.createDiv({ cls: "owb-muted", text: "暂无暂存记录" });
      } else {
        for (const st of stashes) {
          const row = sSec.createDiv({ cls: "owb-git-file-row" });
          row.createSpan({ cls: "owb-git-hash", text: st.ref });
          row.createSpan({ cls: "owb-git-filepath", text: st.message, attr: { title: st.message } });
          const ops = row.createDiv({ cls: "owb-git-file-ops" });
          const popBtn = ops.createEl("button", { cls: "owb-btn-sm", text: "弹出" });
          popBtn.addEventListener("click", () =>
            this.runAction("弹出 Stash", async () => {
              await git.stashPop(st.ref);
              new Notice(`已弹出 ${st.ref}`);
            })
          );
          const dropBtn = ops.createEl("button", { cls: "owb-btn-sm", text: "删" });
          dropBtn.addEventListener("click", () =>
            this.runAction("删除 Stash", async () => {
              await git.stashDrop(st.ref);
              new Notice(`已删除 ${st.ref}`);
            })
          );
        }
      }
    }

    // 6. 最近提交历史
    const logSec = root.createDiv({ cls: "owb-git-section" });
    logSec.createDiv({ cls: "owb-git-sec-head", text: "最近提交历史" });
    const logs = await git.getLog(12);
    if (!logs.length) {
      logSec.createDiv({ cls: "owb-muted", text: "暂无提交记录" });
    } else {
      const ul = logSec.createDiv({ cls: "owb-git-log-list" });
      for (const entry of logs) {
        const row = ul.createDiv({ cls: "owb-git-log-row" });
        row.createSpan({ cls: "owb-git-hash", text: entry.hash });
        row.createSpan({ cls: "owb-git-subject", text: entry.subject });
        row.createSpan({ cls: "owb-git-time", text: entry.relativeTime });
        row.addEventListener("click", async () => {
          try {
            const diff = await git.getCommitDiff(entry.hash);
            new DiffModal(this.app, `Commit ${entry.hash} · ${entry.subject}`, diff).open();
          } catch (err) {
            new Notice(err.message);
          }
        });
      }
    }
  }

  renderChangeSection(root, title, items, isStaged) {
    const git = this.plugin.gitService;
    const sec = root.createDiv({ cls: "owb-git-section" });
    const head = sec.createDiv({ cls: "owb-git-sec-head" });
    head.createSpan({ text: `${title} (${items.length})` });

    if (items.length) {
      const bulkBtn = head.createEl("button", {
        cls: "owb-btn-sm",
        text: isStaged ? "全部取消暂存" : "全部暂存"
      });
      bulkBtn.addEventListener("click", () =>
        this.runAction(isStaged ? "取消暂存" : "全部暂存", () =>
          isStaged ? git.unstageAll() : git.stageAll()
        )
      );
    }

    if (!items.length) {
      sec.createDiv({ cls: "owb-muted", text: "无变更" });
      return;
    }

    const list = sec.createDiv({ cls: "owb-git-file-list" });
    for (const item of items) {
      const row = list.createDiv({ cls: "owb-git-file-row" });
      row.createSpan({
        cls: `owb-git-status st-${item.status.replace(/\?/g, "u").toLowerCase()}`,
        text: item.status
      });

      const nameEl = row.createSpan({ cls: "owb-git-filepath", text: item.path, attr: { title: item.path } });
      nameEl.addEventListener("click", async () => {
        const file = this.app.vault.getAbstractFileByPath(item.path);
        if (file) {
          await this.app.workspace.getLeaf(false).openFile(file);
        } else {
          const diff = await git.getDiff(item.path, isStaged).catch((e) => e.message);
          new DiffModal(this.app, `Diff · ${item.path}`, diff).open();
        }
      });

      const ops = row.createDiv({ cls: "owb-git-file-ops" });

      const diffBtn = ops.createEl("button", { cls: "clickable-icon", attr: { "aria-label": "查看 Diff" } });
      setIcon(diffBtn, "file-diff");
      diffBtn.addEventListener("click", async () => {
        const diff = await git.getDiff(item.path, isStaged).catch((e) => e.message);
        new DiffModal(this.app, `${isStaged ? "Staged " : ""}Diff · ${item.path}`, diff).open();
      });

      const toggleBtn = ops.createEl("button", {
        cls: "clickable-icon",
        attr: { "aria-label": isStaged ? "取消暂存" : "暂存文件" }
      });
      setIcon(toggleBtn, isStaged ? "minus" : "plus");
      toggleBtn.addEventListener("click", () =>
        this.runAction(isStaged ? "取消暂存" : "暂存", () =>
          isStaged ? git.unstageFile(item.path) : git.stageFile(item.path)
        )
      );

      if (!isStaged) {
        const discardBtn = ops.createEl("button", { cls: "clickable-icon", attr: { "aria-label": "丢弃更改" } });
        setIcon(discardBtn, "undo-2");
        discardBtn.addEventListener("click", () =>
          this.runAction("丢弃更改", () => git.discardFile(item.path, item.status === "??"))
        );
      }
    }
  }
}

module.exports = { GitPanelView };

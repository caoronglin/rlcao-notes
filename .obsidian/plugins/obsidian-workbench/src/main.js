"use strict";

const { Plugin, Notice } = require("obsidian");
const {
  VIEW_TYPE_WORKBENCH,
  VIEW_TYPE_GIT,
  VIEW_TYPE_QUIZ,
  DEFAULT_SETTINGS
} = require("./constants");
const { deepMergeDefaults, formatDate } = require("./utils");
const { GitService } = require("./services/gitService");
const { PomodoroService } = require("./services/pomodoroService");
const { WorkbenchView } = require("./views/workbenchView");
const { GitPanelView } = require("./views/gitView");
const { QuizView } = require("./views/quizView");
const { QuickCaptureModal } = require("./modals/quickCaptureModal");
const { DoctorModal } = require("./modals/doctorModal");
const { AIQuizModal } = require("./modals/aiQuizModal");
const { WorkbenchSettingTab } = require("./settings");

class ObsidianWorkbenchPlugin extends Plugin {
  async onload() {
    await this.loadSettings();

    const basePath = this.getVaultBasePath();
    this.gitService = basePath
      ? new GitService(basePath, {
          gitBinary: this.settings.gitBinary,
          timeoutMs: this.settings.gitTimeoutMs
        })
      : null;

    this.pomodoro = new PomodoroService(
      () => this.settings,
      async (finishedPhase) => {
        await this.saveSettings();
        new Notice(
          finishedPhase === "work"
            ? "🍅 专注番茄完成！休息一下吧"
            : "☕ 休息结束，准备开启下一轮专注",
          6000
        );
        this.updatePomodoroStatusBar();
        this.refreshWorkbenchViews();
      }
    );
    this.pomodoro.reset();

    // 注册视图
    this.registerView(VIEW_TYPE_WORKBENCH, (leaf) => new WorkbenchView(leaf, this));
    this.registerView(VIEW_TYPE_GIT, (leaf) => new GitPanelView(leaf, this));
    this.registerView(VIEW_TYPE_QUIZ, (leaf) => new QuizView(leaf, this));

    // Ribbon 图标（按模块开关动态显隐）
    this.ribbonEls = {
      workbench: this.addRibbonIcon("layout-dashboard", "打开知识工作台", () => this.activateWorkbenchView()),
      gitPanel: this.addRibbonIcon("git-branch", "打开 Git 管理面板", () => this.activateGitView()),
      quickCapture: this.addRibbonIcon("zap", "快速闪念", () => this.openQuickCapture())
    };

    // 命令面板（所有命令均检查对应功能开关）
    this.addCommand({
      id: "open-workbench",
      name: "打开个人知识工作台",
      checkCallback: (checking) => this._guardCommand("workbench", checking, () => this.activateWorkbenchView())
    });
    this.addCommand({
      id: "open-git-panel",
      name: "打开 Git 管理面板",
      checkCallback: (checking) => this._guardCommand("gitPanel", checking, () => this.activateGitView())
    });
    this.addCommand({
      id: "git-quick-sync",
      name: "Git 一键提交并同步",
      checkCallback: (checking) => this._guardCommand("gitPanel", checking, () => this.runGitQuickSync())
    });
    this.addCommand({
      id: "open-quiz-view",
      name: "打开 SM-2 知识自测",
      checkCallback: (checking) => this._guardCommand("quizEngine", checking, () => this.activateQuizView())
    });
    this.addCommand({
      id: "quick-capture",
      name: "快速闪念到收件箱",
      checkCallback: (checking) => this._guardCommand("quickCapture", checking, () => this.openQuickCapture())
    });
    this.addCommand({
      id: "pomodoro-toggle",
      name: "番茄钟：开始 / 暂停专注",
      checkCallback: (checking) =>
        this._guardCommand("pomodoro", checking, () => {
          this.pomodoro.togglePause();
          this.updatePomodoroStatusBar();
          this.refreshWorkbenchViews();
        })
    });
    this.addCommand({
      id: "vault-doctor",
      name: "运行 Vault 健康体检",
      checkCallback: (checking) => this._guardCommand("vaultDoctor", checking, () => this.openDoctorModal())
    });
    this.addCommand({
      id: "ai-generate-quiz",
      name: "AI：从当前笔记自动生成自测题库",
      checkCallback: (checking) => this._guardCommand("aiAssist", checking, () => this.openAIQuizModal())
    });

    // 状态栏项
    this.gitStatusEl = this.addStatusBarItem();
    this.gitStatusEl.addClass("owb-status-bar");
    this.gitStatusEl.addEventListener("click", () => this.activateGitView());

    this.pomoStatusEl = this.addStatusBarItem();
    this.pomoStatusEl.addClass("owb-status-bar");
    this.pomoStatusEl.addEventListener("click", () => {
      if (!this.isFeatureEnabled("pomodoro")) return;
      this.pomodoro.togglePause();
      this.updatePomodoroStatusBar();
      this.refreshWorkbenchViews();
    });

    // 番茄钟每秒驱动（仅在运行中更新状态栏，零空转开销）
    this.registerInterval(
      window.setInterval(() => {
        if (!this.isFeatureEnabled("pomodoro") || !this.pomodoro.running) return;
        this.pomodoro.tick();
        this.updatePomodoroStatusBar();
      }, 1000)
    );

    this.addSettingTab(new WorkbenchSettingTab(this.app, this));

    // 文件变化防抖刷新
    this._refreshTimer = null;
    const scheduleRefresh = () => {
      if (!this.isFeatureEnabled("gitPanel")) return;
      if (this._refreshTimer) clearTimeout(this._refreshTimer);
      this._refreshTimer = setTimeout(() => this.updateGitStatusBar(), 400);
    };
    this.registerEvent(this.app.vault.on("modify", scheduleRefresh));
    this.registerEvent(this.app.vault.on("create", scheduleRefresh));
    this.registerEvent(this.app.vault.on("delete", scheduleRefresh));
    this.registerEvent(this.app.vault.on("rename", scheduleRefresh));

    this.app.workspace.onLayoutReady(async () => {
      await this.applyFeatureState();
      if (this.isFeatureEnabled("workbench") && this.settings.openWorkbenchOnStart) {
        await this.activateWorkbenchView();
      }
      if (this.isFeatureEnabled("gitPanel") && this.settings.gitAutoPullOnStart && this.gitService) {
        try {
          if (await this.gitService.isGitRepo()) {
            await this.gitService.pull();
            await this.updateGitStatusBar();
          }
        } catch (err) {
          new Notice(`启动自动拉取失败：${err.message}`, 5000);
        }
      }
    });
  }

  onunload() {
    if (this._refreshTimer) {
      clearTimeout(this._refreshTimer);
      this._refreshTimer = null;
    }
    if (this._autoSyncId) {
      window.clearInterval(this._autoSyncId);
      this._autoSyncId = null;
    }
  }

  isFeatureEnabled(key) {
    return Boolean(this.settings && this.settings.features && this.settings.features[key]);
  }

  _guardCommand(featureKey, checking, fn) {
    if (!this.isFeatureEnabled(featureKey)) return false;
    if (!checking) fn();
    return true;
  }

  /**
   * 实时应用所有模块开关状态（无需重启 Obsidian）。
   */
  async applyFeatureState() {
    if (this.ribbonEls) {
      for (const [key, el] of Object.entries(this.ribbonEls)) {
        if (el) el.style.display = this.isFeatureEnabled(key) ? "" : "none";
      }
    }
    if (!this.isFeatureEnabled("pomodoro") && this.pomodoro) {
      this.pomodoro.reset();
    }
    this.updatePomodoroStatusBar();
    await this.updateGitStatusBar();
    this.resetAutoSyncTimer();
    this.refreshWorkbenchViews();
    this.refreshGitViews();
  }

  getVaultBasePath() {
    const adapter = this.app && this.app.vault && this.app.vault.adapter;
    return adapter && typeof adapter.basePath === "string" ? adapter.basePath : null;
  }

  async loadSettings() {
    const saved = await this.loadData();
    this.settings = deepMergeDefaults(DEFAULT_SETTINGS, saved);
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  resetAutoSyncTimer() {
    if (this._autoSyncId) {
      window.clearInterval(this._autoSyncId);
      this._autoSyncId = null;
    }
    const mins = Number(this.settings.gitAutoSyncMinutes) || 0;
    if (this.isFeatureEnabled("gitPanel") && mins > 0 && this.gitService) {
      this._autoSyncId = this.registerInterval(
        window.setInterval(() => this.runGitQuickSync(true), mins * 60 * 1000)
      );
    }
  }

  updatePomodoroStatusBar() {
    if (!this.pomoStatusEl) return;
    if (!this.isFeatureEnabled("pomodoro") || !this.pomodoro) {
      this.pomoStatusEl.setText("");
      return;
    }
    this.pomoStatusEl.setText(this.pomodoro.getStatusBarText());
  }

  async updateGitStatusBar() {
    if (!this.gitStatusEl) return;
    if (!this.isFeatureEnabled("gitPanel") || !this.gitService) {
      this.gitStatusEl.setText("");
      return;
    }
    try {
      const st = await this.gitService.getStatus();
      if (!st.isRepo) {
        this.gitStatusEl.setText("Git: 未初始化");
        return;
      }
      const dirty = st.conflicts.length + st.staged.length + st.unstaged.length;
      const syncPart = st.upstream ? ` ↑${st.ahead}↓${st.behind}` : "";
      const conflictFlag = st.conflicts.length ? ` !${st.conflicts.length}` : "";
      this.gitStatusEl.setText(`⎇ ${st.branch}${dirty ? ` *${dirty}` : ""}${conflictFlag}${syncPart}`);
    } catch {
      this.gitStatusEl.setText("Git: 不可用");
    }
  }

  async runGitQuickSync(silent = false) {
    if (!this.isFeatureEnabled("gitPanel") || !this.gitService) {
      if (!silent) new Notice("Git 模块未启用或当前环境不支持");
      return;
    }
    try {
      const st = await this.gitService.getStatus();
      if (!st.isRepo) {
        if (!silent) new Notice("当前 Vault 尚未初始化 Git 仓库");
        return;
      }
      if (st.conflicts.length) {
        new Notice("存在未解决的合并冲突，请先在 Git 面板处理", 6000);
        return;
      }
      if (st.staged.length || st.unstaged.length) {
        await this.gitService.stageAll();
        const tpl = this.settings.gitCommitTemplate || "vault backup: {{date}}";
        const msg = tpl.replace("{{date}}", formatDate(new Date(), "YYYY-MM-DD HH:mm"));
        await this.gitService.commit(msg);
      }
      if (st.upstream) {
        await this.gitService.pull();
        await this.gitService.push();
      }
      await this.updateGitStatusBar();
      this.refreshGitViews();
      if (!silent) new Notice("Git 同步完成");
    } catch (err) {
      new Notice(`Git 同步失败：${err.message}`, 6000);
    }
  }

  async activateWorkbenchView() {
    if (!this.isFeatureEnabled("workbench")) return;
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_WORKBENCH);
    const leaf = existing.length ? existing[0] : this.app.workspace.getLeaf("tab");
    await leaf.setViewState({ type: VIEW_TYPE_WORKBENCH, active: true });
    this.app.workspace.revealLeaf(leaf);
  }

  async activateGitView() {
    if (!this.isFeatureEnabled("gitPanel")) return;
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_GIT);
    const leaf = existing.length ? existing[0] : this.app.workspace.getRightLeaf(false);
    await leaf.setViewState({ type: VIEW_TYPE_GIT, active: true });
    this.app.workspace.revealLeaf(leaf);
  }

  async activateQuizView(initialFilePath = "") {
    if (!this.isFeatureEnabled("quizEngine")) return;
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_QUIZ);
    const leaf = existing.length ? existing[0] : this.app.workspace.getLeaf("tab");
    await leaf.setViewState({ type: VIEW_TYPE_QUIZ, active: true });
    this.app.workspace.revealLeaf(leaf);
    if (initialFilePath && leaf.view && typeof leaf.view.loadSelectedBank === "function") {
      leaf.view.selectedFilePath = initialFilePath;
      leaf.view.session = null;
      await leaf.view.loadSelectedBank(initialFilePath);
      await leaf.view.render();
    }
  }

  openQuickCapture() {
    if (!this.isFeatureEnabled("quickCapture")) return;
    new QuickCaptureModal(this.app, this).open();
  }

  openDoctorModal() {
    if (!this.isFeatureEnabled("vaultDoctor")) return;
    new DoctorModal(this.app, this).open();
  }

  openAIQuizModal() {
    if (!this.isFeatureEnabled("aiAssist")) return;
    new AIQuizModal(this.app, this).open();
  }

  refreshWorkbenchViews() {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE_WORKBENCH)) {
      if (leaf.view && typeof leaf.view.render === "function") leaf.view.render();
    }
  }

  refreshGitViews() {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE_GIT)) {
      if (leaf.view && typeof leaf.view.render === "function") leaf.view.render();
    }
  }
}

module.exports = ObsidianWorkbenchPlugin;

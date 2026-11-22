"use strict";

const { Plugin, Notice } = require("obsidian");
const {
  VIEW_TYPE_WORKBENCH,
  VIEW_TYPE_GIT,
  VIEW_TYPE_QUIZ,
  VIEW_TYPE_RAG,
  DEFAULT_SETTINGS
} = require("./constants");
const { deepMergeDefaults, formatDate } = require("./utils");
const { GitService } = require("./services/gitService");
const { PomodoroService } = require("./services/pomodoroService");
const { RagService } = require("./services/ragService");
const { openDaily } = require("./services/dailyService");
const { listProjects, createProject } = require("./services/projectService");
const privacyService = require("./services/privacyService");
const { WorkbenchView } = require("./views/workbenchView");
const { GitPanelView } = require("./views/gitView");
const { QuizView } = require("./views/quizView");
const { RagView } = require("./views/ragView");
const { QuickCaptureModal } = require("./modals/quickCaptureModal");
const { JevModal } = require("./modals/jevModal");
const { TaskCenterModal } = require("./modals/taskModal");
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
    this.registerView(VIEW_TYPE_RAG, (leaf) => new RagView(leaf, this));

    // RAG 服务
    this.rag = new RagService(() => this.settings, this.app.vault.adapter);

    // Ribbon 图标（按模块开关动态显隐）
    this.ribbonEls = {
      workbench: this.addRibbonIcon("layout-dashboard", "打开知识工作台", () => this.activateWorkbenchView()),
      gitPanel: this.addRibbonIcon("git-branch", "打开 Git 管理面板", () => this.activateGitView()),
      quickCapture: this.addRibbonIcon("zap", "快速闪念", () => this.openQuickCapture()),
      ragSearch: this.addRibbonIcon("sparkles", "AI RAG 搜索", () => this.activateRagView())
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

    // ── v3.1 新模块命令 ──
    this.addCommand({
      id: "daily-today",
      name: "日记：打开今日日记",
      checkCallback: (checking) => this._guardCommand("dailyJournal", checking, () => this.openDailyNote(0))
    });
    this.addCommand({
      id: "daily-yesterday",
      name: "日记：打开昨日日记",
      checkCallback: (checking) => this._guardCommand("dailyJournal", checking, () => this.openDailyNote(-1))
    });
    this.addCommand({
      id: "open-task-center",
      name: "任务中心：查看全库待办",
      checkCallback: (checking) => this._guardCommand("tasks", checking, () => this.openTaskCenter())
    });
    this.addCommand({
      id: "create-project",
      name: "项目：新建项目（模板化）",
      checkCallback: (checking) => this._guardCommand("projects", checking, () => this.createProjectInteractive())
    });
    this.addCommand({
      id: "privacy-lock",
      name: "隐私区：锁定（搜索与链接全隐身 + Git 排除）",
      checkCallback: (checking) => this._guardCommand("privacy", checking, () => this.setPrivacy(true))
    });
    this.addCommand({
      id: "privacy-unlock",
      name: "隐私区：解锁（恢复索引与收录）",
      checkCallback: (checking) => this._guardCommand("privacy", checking, () => this.setPrivacy(false))
    });
    this.addCommand({
      id: "privacy-status",
      name: "隐私区：查看当前状态",
      checkCallback: (checking) => this._guardCommand("privacy", checking, () => this.showPrivacyStatus())
    });
    this.addCommand({
      id: "open-rag-search",
      name: "AI RAG 搜索：语义检索全库",
      checkCallback: (checking) => this._guardCommand("ragSearch", checking, () => this.activateRagView())
    });
    this.addCommand({
      id: "rag-build-index",
      name: "AI RAG 搜索：构建/更新索引",
      checkCallback: (checking) => this._guardCommand("ragSearch", checking, () => this.buildRagIndex())
    });
    this.addCommand({
      id: "jev-decide",
      name: "Jev/Clef 决策：闪念归类 / 笔记评分 / 自定义",
      checkCallback: (checking) => this._guardCommand("decision", checking, () => this.openJevModal())
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

  // ── v3.1 新模块方法 ──
  openDailyNote(offsetDays) {
    if (!this.isFeatureEnabled("dailyJournal")) return;
    openDaily(this.app, this.settings, offsetDays).catch((err) =>
      new Notice("日记打开失败：" + err.message, 5000)
    );
  }

  openTaskCenter() {
    if (!this.isFeatureEnabled("tasks")) return;
    new TaskCenterModal(this.app, this).open();
  }

  openJevModal() {
    if (!this.isFeatureEnabled("decision")) return;
    new JevModal(this.app, this).open();
  }

  createProjectInteractive() {
    if (!this.isFeatureEnabled("projects")) return;
    const name = window.prompt("项目名称（将在项目目录下创建 <名称>.md）：", "");
    if (!name || !name.trim()) return;
    createProject(this.app, this.settings, name).catch((err) =>
      new Notice("项目创建失败：" + err.message, 6000)
    );
  }

  async setPrivacy(hidden) {
    if (!this.isFeatureEnabled("privacy")) return;
    try {
      if (hidden) await privacyService.ensureFolder(this.app, this.settings);
      await privacyService.setHidden(this.app, this.settings, hidden);
    } catch (err) {
      new Notice("隐私区切换失败：" + err.message, 6000);
    }
  }

  async showPrivacyStatus() {
    if (!this.isFeatureEnabled("privacy")) return;
    try {
      const st = await privacyService.status(this.app, this.settings);
      new Notice(
        "隐私区 " + st.folder + "：" + (st.hidden ? "🔒 已锁定（搜索/链接不索引，Git 排除）" : "🔓 未锁定") +
          " · " + st.fileCount + " 个文件 · Git 排除：" + (st.gitExcluded ? "是" : "否"),
        8000
      );
    } catch (err) {
      new Notice("状态读取失败：" + err.message, 6000);
    }
  }

  async activateRagView() {
    if (!this.isFeatureEnabled("ragSearch")) return;
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_RAG);
    const leaf = existing.length ? existing[0] : this.app.workspace.getLeaf("tab");
    await leaf.setViewState({ type: VIEW_TYPE_RAG, active: true });
    this.app.workspace.revealLeaf(leaf);
  }

  async buildRagIndex() {
    if (!this.isFeatureEnabled("ragSearch")) return;
    try {
      const stat = await this.rag.buildIndex(this.app, null);
      new Notice("RAG 索引完成：" + stat.files + " 篇 / " + stat.chunks + " 块", 6000);
    } catch (err) {
      new Notice("索引构建失败：" + err.message, 8000);
    }
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

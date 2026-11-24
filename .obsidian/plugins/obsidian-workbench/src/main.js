"use strict";

const { Plugin, Notice } = require("obsidian");
const {
  VIEW_TYPE_WORKBENCH,
  VIEW_TYPE_GIT,
  VIEW_TYPE_QUIZ,
  VIEW_TYPE_RAG,
  DEFAULT_SETTINGS
} = require("./constants");
const { deepMergeDefaults, formatDate, migrateSettings } = require("./utils");
const { GitService } = require("./services/gitService");
const { PomodoroService } = require("./services/pomodoroService");
const { RagService } = require("./services/ragService");
const { openDaily } = require("./services/dailyService");
const { listProjects, createProject } = require("./services/projectService");
const privacyService = require("./services/privacyService");
const { setPluginDir } = require("./services/imageService");
const decisionService = require("./services/decisionService");
const graphService = require("./services/graphService");
const { renderRunnableBlock, renderHtmlPreview } = require("./services/codeRunner");
const { AttachmentPreviewModal } = require("./modals/attachmentPreviewModal");
const { DedupeModal } = require("./modals/dedupeModal");
const { saveAttachment, planOrganize, applyOrganize, cleanupConvertPairs } = require("./services/attachmentService");
const { BASE_STYLE_CSS } = require("./styles/basesStyle");
const { PomodoroFullscreen } = require("./modals/pomodoroFullscreen");
const goalService = require("./services/goalService");
const { formatNote } = require("./services/autoFormatService");
const { chatCompletion } = require("./services/aiService");

/** LLM 桥：OpenAI 兼容接口，无配置时抛明确错误 */
async function aiBridgeChat(messages, settings) {
  const baseUrl = String((settings && settings.aiBaseUrl) || "").replace(/\/+$/, "");
  const model = String((settings && settings.aiModel) || "").trim();
  if (!baseUrl || !model) {
    throw new Error("请先在设置中配置 AI Base URL 与模型（OpenAI/DeepSeek/Ollama 均可）");
  }
  return chatCompletion(messages, settings);
}
const { WorkbenchView } = require("./views/workbenchView");
const { GitPanelView } = require("./views/gitView");
const { QuizView } = require("./views/quizView");
const { QuickCaptureModal } = require("./modals/quickCaptureModal");
const { TaskCenterModal } = require("./modals/taskModal");
const { AttachmentModal } = require("./modals/attachmentModal");
const { ImageToolsModal } = require("./modals/imageToolsModal");
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
        if (finishedPhase === "work") await this.logPomodoroToDaily();
        this.updatePomodoroStatusBar();
        this.refreshWorkbenchViews();
      }
    );
    this.pomodoro.reset();

    // 注册视图
    this.registerView(VIEW_TYPE_WORKBENCH, (leaf) => new WorkbenchView(leaf, this));
    this.registerView(VIEW_TYPE_GIT, (leaf) => new GitPanelView(leaf, this));
    this.registerView(VIEW_TYPE_QUIZ, (leaf) => new QuizView(leaf, this));

    // RAG 服务
    this.rag = new RagService(() => this.settings, this.app.vault.adapter);

    // 图片工具：把插件「绝对」目录交给 sharp 加载器。
    // 注意：manifest.dir 是相对路径（.obsidian/plugins/obsidian-workbench），
    // 直接传给 require 会被打包器当作相对模块去解析，报
    // "OWB bundle: cannot resolve module .../node_modules/sharp from ./services"。
    if (this.manifest && this.manifest.dir) {
      const dir = this.manifest.dir;
      const base = this.app && this.app.vault && this.app.vault.adapter ? this.app.vault.adapter.basePath : "";
      const abs = dir.startsWith("/") ? dir : base ? `${base}/${dir}` : "";
      if (abs) {
        setPluginDir(abs);
        try {
          require("./modals/attachmentPreviewModal").setPluginDir(abs);
        } catch (e) {
          /* 忽略 */
        }
      }
    }

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
      id: "pomodoro-fullscreen",
      name: "番茄钟：全屏沉浸倒计时",
      checkCallback: (checking) => this._guardCommand("pomodoro", checking, () => this.openPomodoroFullscreen())
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
      id: "rag-build-index",
      name: "RAG：构建/更新语义索引",
      checkCallback: (checking) => this._guardCommand("ragSearch", checking, () => this.buildRagIndex())
    });
    this.addCommand({
      id: "build-knowledge-graph",
      name: "知识图谱：生成全库链接图谱笔记",
      checkCallback: (checking) => this._guardCommand("ragSearch", checking, () => this.buildGraphNote())
    });
    this.addCommand({
      id: "organize-attachments",
      name: "附件：整理散落附件到 assets/（先预览）",
      checkCallback: (checking) => this._guardCommand("attachments", checking, () => this.organizeAttachments())
    });
    this.addCommand({
      id: "cleanup-convert-pairs",
      name: "附件：清理转码残留（引用改到 AVIF/WebP，旧原件归档）",
      checkCallback: (checking) => this._guardCommand("attachments", checking, () => this.cleanupConvertPairsNow())
    });
    this.addCommand({
      id: "dedupe-attachments",
      name: "附件：SHA-256 去重（扫描重复内容并归档副本）",
      checkCallback: (checking) => this._guardCommand("attachments", checking, () => this.openDedupeModal())
    });
    this.addCommand({
      id: "add-attachment",
      name: "附件：上传并自动归档",
      checkCallback: (checking) => this._guardCommand("attachments", checking, () => this.addAttachmentInteractive())
    });
    this.addCommand({
      id: "bases-style",
      name: "多维表格：应用统一样式",
      checkCallback: (checking) => this._guardCommand("bases", checking, () => this.applyBasesStyle())
    });
    this.addCommand({
      id: "open-year-goals",
      name: "目标：打开年度目标（年=月=周=日）",
      checkCallback: (checking) => this._guardCommand("goals", checking, () => this.openYearGoals())
    });
    this.addCommand({
      id: "goal-ai-breakdown",
      name: "目标：AI 拆解当前目标到月/周/日",
      checkCallback: (checking) => this._guardCommand("goals", checking, () => this.goalAiBreakdown())
    });
    this.addCommand({
      id: "format-note",
      name: "格式化：规范当前笔记（frontmatter + 决策模型打标签）",
      checkCallback: (checking) => this._guardCommand("autoFormat", checking, () => this.formatCurrentNote())
    });
    this.addCommand({
      id: "tidy-explorer",
      name: "文件浏览器：生成整理样式（隐藏目录 + 分隔线）",
      checkCallback: (checking) => this._guardCommand("workbench", checking, () => this.applyExplorerStyle())
    });
    this.addCommand({
      id: "open-attachment-manager",
      name: "附件管理：孤儿 / 坏引用 / 体积榜",
      checkCallback: (checking) => this._guardCommand("attachments", checking, () => this.openAttachmentModal())
    });
    this.addCommand({
      id: "open-image-tools",
      name: "图片工具：上传存档 / 格式转换 / 压缩",
      checkCallback: (checking) => this._guardCommand("imageTools", checking, () => this.openImageToolsModal())
    });

    // ── 代码块：执行与预览（精简版 execute-code）──
    for (const lang of ["run-js", "run-python", "run-sh"]) {
      this.registerMarkdownCodeBlockProcessor(lang, (source, el, ctx) => {
        renderRunnableBlock(lang, source, el, { app: this.app, plugin: this });
      });
    }
    this.registerMarkdownCodeBlockProcessor("preview-html", (source, el) => {
      renderHtmlPreview(source, el);
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
    this.settings = migrateSettings(deepMergeDefaults(DEFAULT_SETTINGS, saved));
    const log = this.settings._migrationLog || [];
    delete this.settings._migrationLog;
    if (log.length) {
      // 迁移结果立即落盘，避免每次启动重复判断
      await this.saveData(this.settings);
      this._migrationApplied = log;
      console.info("[workbench] 设置迁移:", log.join("; "));
    }
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

  /** 番茄完成后把这次专注写进当天日记，形成可回溯的专注流水 */
  async logPomodoroToDaily() {
    if (!this.isFeatureEnabled("dailyJournal")) return;
    try {
      const mins = Number(this.settings.pomodoroWorkMinutes) || 25;
      const file = await openDaily(this.app, this.settings, 0);
      if (!file) return;
      const stamp = formatDate(new Date(), "HH:mm");
      const line = `- 🍅 ${stamp} 专注 ${mins} 分钟`;
      await this.app.vault.process(file, (content) => {
        if (content.includes(line)) return content;
        // 优先追加到「## 📝 记录」小节，没有就追加到文末
        const idx = content.indexOf("## 📝 记录");
        if (idx >= 0) {
          const insertAt = idx + "## 📝 记录".length;
          return content.slice(0, insertAt) + "\n" + line + content.slice(insertAt);
        }
        return content.replace(/\s*$/, "") + "\n\n" + line + "\n";
      });
    } catch (e) {
      console.debug("[workbench] 番茄记录写入日记失败:", e && e.message);
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

  // ── 目标模式 ──
  async openYearGoals() {
    const year = new Date().getFullYear();
    const file = await goalService.ensureGoalFile(this.app, year);
    await this.app.workspace.getLeaf(false).openFile(file);
    this.refreshWorkbenchViews();
  }

  /**
   * AI 拆解：取当前笔记中的未勾目标行（或用户选中文本），决策模型判定领域/优先级，
   * LLM 生成层级草案 → 追加进目标文件的 AI 草稿小节（不静默改正文）。
   */
  async goalAiBreakdown() {
    try {
      const leaf = this.app.workspace.getMostRecentLeaf();
      const view = leaf && leaf.view;
      if (!view || !view.file) {
        new Notice("先打开目标文件（或包含目标行的笔记）");
        return;
      }
      let goalText = "";
      const editor = view.editor;
      if (editor && editor.somethingSelected && editor.somethingSelected()) {
        goalText = editor.getSelection().trim();
      }
      if (!goalText) {
        const content = await this.app.vault.read(view.file);
        const open = content.match(/^\s*[-*]\s*\[ \]\s*(.+)$/m);
        goalText = open ? open[1].replace(/（?关联\s*→\s*[A-Z]\d+）?/, "").trim() : "";
      }
      if (!goalText) {
        new Notice("没有可拆解的目标行（需要一条未勾选的任务行或选中文本）");
        return;
      }

      const year = new Date().getFullYear();
      const tree = await goalService.loadGoalTree(this.app, year);
      if (!tree) {
        new Notice(`目标文件不存在，将先创建 ${year} 年目标`);
        await this.openYearGoals();
        return;
      }

      new Notice("拆解中：决策模型判定领域 → LLM 生成草案…", 6000);
      const res = await goalService.aiBreakdown(
        (state, questions) => this.decide(state, questions),
        (messages) => aiBridgeChat(messages, this.settings),
        goalText,
        "month"
      );
      await goalService.appendDraft(this.app, tree, res.lines);
      new Notice(
        `已生成 ${res.lines.length} 条草案 → vault/目标/${year}.md 的「AI 草稿」小节（领域 ${res.domain} · ${res.priority}）`,
        8000
      );
      await this.app.workspace.getLeaf(false).openFile(tree.file);
    } catch (err) {
      new Notice("AI 拆解失败：" + err.message, 8000);
    }
  }

  async formatCurrentNote() {
    const leaf = this.app.workspace.getMostRecentLeaf();
    const view = leaf && leaf.view;
    if (!view || !view.file || view.file.extension !== "md") {
      new Notice("先打开一篇笔记");
      return;
    }
    try {
      const res = await formatNote(this.app, view.file, {
        decide: (state, questions) => this.decide(state, questions)
      });
      if (!res.changed) {
        new Notice("frontmatter 已完备，无需改动");
        return;
      }
      new Notice(
        `已规范化：\n${res.additions.join("\n")}`,
        8000
      );
    } catch (err) {
      new Notice("格式化失败：" + err.message, 8000);
    }
  }

  openPomodoroFullscreen() {
    if (!this.isFeatureEnabled("pomodoro")) return;
    new PomodoroFullscreen(this.app, this).open();
  }

  openTaskCenter() {
    if (!this.isFeatureEnabled("tasks")) return;
    new TaskCenterModal(this.app, this).open();
  }

  /**
   * 决策模型接口（内部）：不提供独立入口，供闪念归类等功能调用。
   * 返回 { answers: { key: { type, value, confidence } } }
   */
  async decide(state, questions) {
    if (!this.isFeatureEnabled("decision")) throw new Error("决策接口未启用");
    const types = {};
    for (const k of Object.keys(questions || {})) types[k] = questions[k].type || "choice";
    return decisionService.ask(state, questions, this.settings, { questionTypes: types });
  }

  /** 附件预览（open-file-viewer 优先，原生回退） */
  async cleanupConvertPairsNow() {
    if (!this.isFeatureEnabled("attachments")) return;
    try {
      const res = await cleanupConvertPairs(this.app);
      new Notice(
        res.pairs.length
          ? `转码清理：${res.pairs.length} 对，已归档 ${res.moved.length} 个旧原件，改写 ${res.touched} 篇笔记引用`
          : "没有转码残留（未发现同名的旧格式/新格式成对文件）",
        8000
      );
      this.refreshWorkbenchViews();
    } catch (err) {
      new Notice("转码清理失败：" + err.message, 8000);
    }
  }

  openDedupeModal() {
    if (!this.isFeatureEnabled("attachments")) return;
    new DedupeModal(this.app, this).open();
  }

  previewAttachment(file) {
    if (!file) return;
    new AttachmentPreviewModal(this.app, this, file).open();
  }

  /** 上传附件：自动归档到 assets/<年-月>/ 并插入链接 */
  addAttachmentInteractive() {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.addEventListener("change", async () => {
      const files = Array.from(input.files || []);
      if (!files.length) return;
      try {
        for (const f of files) {
          const res = await saveAttachment(this.app, f, { name: f.name });
          const leaf = this.app.workspace.getMostRecentLeaf();
          if (leaf && leaf.view && leaf.view.editor) {
            leaf.view.editor.replaceSelection(`![[${res.path}]]\n`);
          }
        }
        new Notice(`已归档 ${files.length} 个附件到 assets/`);
        this.refreshWorkbenchViews();
      } catch (e) {
        new Notice("上传失败：" + e.message, 7000);
      }
    });
    input.click();
  }

  /** 整理附件：先 dry-run 预览，确认后移动并改写带路径引用 */
  async organizeAttachments() {
    const plan = planOrganize(this.app);
    if (!plan.items.length) {
      new Notice("没有需要整理的附件，全部已在 assets/ 或归档区");
      return;
    }
    const { Modal } = require("obsidian");
    const modal = new Modal(this.app);
    modal.titleEl.setText("整理附件（预览，未改动任何文件）");
    const body = modal.contentEl;
    body.createEl("p", {
      text: `将把 ${plan.items.length} 个附件（合计 ${(plan.bytes / 1024 / 1024).toFixed(1)} MB）收进 assets/<年-月>/，并改写带路径的引用。`
    });
    const list = body.createEl("div", { cls: "owb-att-list" });
    for (const it of plan.items.slice(0, 40)) {
      const row = list.createDiv({ cls: "owb-att-row" });
      row.createSpan({ text: it.file.path });
      row.createSpan({ cls: "owb-muted", text: " → " + it.dest });
    }
    if (plan.items.length > 40) {
      list.createDiv({ cls: "owb-muted", text: `…还有 ${plan.items.length - 40} 个` });
    }
    const foot = body.createDiv({ cls: "owb-run-confirm" });
    foot.createEl("button", { cls: "mod-warning", text: "确认整理" }).addEventListener("click", async () => {
      modal.close();
      const res = await applyOrganize(this.app, plan);
      new Notice(
        `整理完成：移动 ${res.moved.length} 个，改写 ${res.touched} 篇笔记${res.failed.length ? `，失败 ${res.failed.length}` : ""}`,
        8000
      );
      this.refreshWorkbenchViews();
    });
    foot.createEl("button", { text: "取消" }).addEventListener("click", () => modal.close());
    modal.open();
  }

  /** 生成多维表格样式片段（.mt-* 组件统一外观） */
  async applyBasesStyle() {
    const css = BASE_STYLE_CSS;
    try {
      await this.app.vault.adapter.write(".obsidian/snippets/workbench-bases.css", css);
      const p = ".obsidian/appearance.json";
      let appJson = {};
      try {
        appJson = JSON.parse(await this.app.vault.adapter.read(p));
      } catch (e) {
        appJson = {};
      }
      const list = Array.isArray(appJson.enabledCssSnippets) ? appJson.enabledCssSnippets : [];
      if (!list.includes("workbench-bases")) list.push("workbench-bases");
      appJson.enabledCssSnippets = list;
      await this.app.vault.adapter.write(p, JSON.stringify(appJson, null, 2));
      new Notice("多维表格样式已生成并启用：workbench-bases.css", 6000);
    } catch (e) {
      new Notice("生成失败：" + e.message, 7000);
    }
  }

  async buildGraphNote() {
    try {
      await graphService.writeGraphNote(this.app, { dir: "vault/系统与工具" });
    } catch (err) {
      new Notice("知识图谱生成失败：" + err.message, 8000);
    }
  }

  /**
   * 文件浏览器整理：按论坛方案（forum-zh/topic/44108）生成 CSS 片段——
   * 用 .nav-folder:has([data-path=…]) 隐藏目录，用 ::after 画分隔线。
   */
  async applyExplorerStyle() {
    const s = this.settings;
    const hide = String(s.explorerHideList || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    const seps = String(s.explorerSeparatorAfter || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    const lines = [
      "/* 由 Obsidian Workbench 生成：文件浏览器整理",
      "   隐藏规则依据 data-path，分隔线用 ::after",
      "   修改后重新生成即可覆盖本文件 */",
      "",
      ":root {",
      "  --replete-custom-separators-vertical-padding: 6px;",
      "  --replete-custom-separators-left-margin: -12px;",
      "}",
      ""
    ];
    if (hide.length) {
      lines.push("/* 隐藏目录 */");
      const sel = hide.map((h) => `.nav-folder:has([data-path="${h}"])`).join(", ");
      lines.push(sel + " { display: none; }", "");
    }
    if (seps.length) {
      lines.push("/* 分隔线 */");
      const sel = seps
        .map(
          (x) =>
            `.nav-folder:has([data-path="${x}"])::after`
        )
        .join(", ");
      lines.push(
        sel + " {",
        "  content: '';",
        "  display: block;",
        "  margin: var(--replete-custom-separators-vertical-padding) 0 var(--replete-custom-separators-vertical-padding) var(--replete-custom-separators-left-margin);",
        "  border-bottom: 1px solid var(--background-modifier-border);",
        "  pointer-events: none;",
        "}",
        ""
      );
    }
    const path = ".obsidian/snippets/workbench-explorer.css";
    try {
      await this.app.vault.adapter.write(path, lines.join("\n"));
      const appJsonPath = ".obsidian/appearance.json";
      let appJson = {};
      try {
        appJson = JSON.parse(await this.app.vault.adapter.read(appJsonPath));
      } catch (e) {
        appJson = {};
      }
      const list = Array.isArray(appJson.enabledCssSnippets) ? appJson.enabledCssSnippets : [];
      if (!list.includes("workbench-explorer")) list.push("workbench-explorer");
      appJson.enabledCssSnippets = list;
      await this.app.vault.adapter.write(appJsonPath, JSON.stringify(appJson, null, 2));
      new Notice("文件浏览器样式已生成并启用：.obsidian/snippets/workbench-explorer.css", 7000);
    } catch (err) {
      new Notice("生成失败：" + err.message, 8000);
    }
  }

  openAttachmentModal() {
    if (!this.isFeatureEnabled("attachments")) return;
    new AttachmentModal(this.app, this).open();
  }

  openImageToolsModal() {
    if (!this.isFeatureEnabled("imageTools")) return;
    new ImageToolsModal(this.app, this).open();
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

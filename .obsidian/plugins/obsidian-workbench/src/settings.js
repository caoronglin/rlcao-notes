"use strict";

const { PluginSettingTab, Setting, Notice } = require("obsidian");

const FEATURE_META = [
  { key: "workbench", name: "个人知识工作台", desc: "首屏问候、今日行动勾选、今日输入/输出与沉睡笔记洞察" },
  { key: "gitPanel", name: "Git 管理面板与状态栏", desc: "右侧边栏分支切换、暂存/撤销/Diff、提交同步与历史记录" },
  { key: "gitAdvanced", name: "Git 高级功能（Stash / 远程 / 冲突）", desc: "启用 Stash 暂存栈、远程仓库配置向导与合并冲突一键保留本地/远程" },
  { key: "quickCapture", name: "快速闪念弹窗 (Quick Capture)", desc: "保留 YAML frontmatter 快速记入收件箱并支持快捷标签" },
  { key: "quizEngine", name: "SM-2 互动自测引擎", desc: "直接读取 Markdown 题库进行单选/多选/判断与间隔重复错题复习" },
  { key: "pomodoro", name: "番茄钟与每日专注统计", desc: "在状态栏与工作台显示番茄钟倒计时并统计每日完成番茄数" },
  { key: "vaultDoctor", name: "Vault 健康体检", desc: "巡检悬空 CSS、旧版错误快捷键与 Git 敏感凭证追踪风险" },
  { key: "aiAssist", name: "AI 辅助（提交摘要与自动出题）", desc: "调用 OpenAI 兼容接口（OpenAI / DeepSeek / Ollama）生成 Commit Message 与自测题库" }
];

class WorkbenchSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Obsidian Workbench v3.0 设置" });

    // ── 一、全模块功能开关 ──
    containerEl.createEl("h3", { text: "功能模块开关" });
    for (const item of FEATURE_META) {
      new Setting(containerEl)
        .setName(item.name)
        .setDesc(item.desc)
        .addToggle((t) =>
          t.setValue(this.plugin.isFeatureEnabled(item.key)).onChange(async (val) => {
            this.plugin.settings.features[item.key] = val;
            await this.plugin.saveSettings();
            await this.plugin.applyFeatureState();
            this.display(); // 实时展开/收起对应模块的详细设置项
          })
        );
    }

    // ── 二、工作台仪表盘 ──
    if (this.plugin.isFeatureEnabled("workbench")) {
      containerEl.createEl("h3", { text: "个人知识工作台配置" });
      new Setting(containerEl)
        .setName("启动时自动打开工作台")
        .addToggle((t) =>
          t.setValue(this.plugin.settings.openWorkbenchOnStart).onChange(async (v) => {
            this.plugin.settings.openWorkbenchOnStart = v;
            await this.plugin.saveSettings();
          })
        );
      new Setting(containerEl)
        .setName("日记存放目录")
        .addText((t) =>
          t.setPlaceholder("diary").setValue(this.plugin.settings.dailyFolder).onChange(async (v) => {
            this.plugin.settings.dailyFolder = v.trim();
            await this.plugin.saveSettings();
          })
        );
      new Setting(containerEl)
        .setName("项目任务扫描目录")
        .setDesc("留空扫描全库；填子目录（如 vault/项目）仅扫描该项目目录")
        .addText((t) =>
          t.setPlaceholder("vault/项目").setValue(this.plugin.settings.projectFolder).onChange(async (v) => {
            this.plugin.settings.projectFolder = v.trim();
            await this.plugin.saveSettings();
          })
        );
      new Setting(containerEl)
        .setName("仅显示今日到期任务")
        .addToggle((t) =>
          t.setValue(this.plugin.settings.onlyDueTasks).onChange(async (v) => {
            this.plugin.settings.onlyDueTasks = v;
            await this.plugin.saveSettings();
          })
        );
    }

    // ── 三、快速闪念 ──
    if (this.plugin.isFeatureEnabled("quickCapture")) {
      containerEl.createEl("h3", { text: "快速闪念配置" });
      new Setting(containerEl)
        .setName("闪念收件箱路径")
        .addText((t) =>
          t.setPlaceholder("inbox.md").setValue(this.plugin.settings.inboxPath).onChange(async (v) => {
            this.plugin.settings.inboxPath = v.trim() || "inbox.md";
            await this.plugin.saveSettings();
          })
        );
      new Setting(containerEl)
        .setName("写入位置")
        .addDropdown((d) =>
          d
            .addOption("top", "顶部（YAML Frontmatter 之后）")
            .addOption("bottom", "文末追加")
            .setValue(this.plugin.settings.captureInsertMode)
            .onChange(async (v) => {
              this.plugin.settings.captureInsertMode = v;
              await this.plugin.saveSettings();
            })
        );
    }

    // ── 四、Git 管理面板 ──
    if (this.plugin.isFeatureEnabled("gitPanel")) {
      containerEl.createEl("h3", { text: "Git 面板与同步配置" });
      new Setting(containerEl)
        .setName("默认提交信息模板")
        .setDesc("留空提交时自动套用，支持 {{date}}")
        .addText((t) =>
          t
            .setPlaceholder("vault backup: {{date}}")
            .setValue(this.plugin.settings.gitCommitTemplate)
            .onChange(async (v) => {
              this.plugin.settings.gitCommitTemplate = v.trim() || "vault backup: {{date}}";
              await this.plugin.saveSettings();
            })
        );
      new Setting(containerEl)
        .setName("定时自动提交同步（分钟）")
        .setDesc("填 0 表示关闭")
        .addText((t) =>
          t.setValue(String(this.plugin.settings.gitAutoSyncMinutes)).onChange(async (v) => {
            this.plugin.settings.gitAutoSyncMinutes = Math.max(0, Number.parseInt(v, 10) || 0);
            await this.plugin.saveSettings();
            this.plugin.resetAutoSyncTimer();
          })
        );
      new Setting(containerEl)
        .setName("启动时自动 Pull")
        .addToggle((t) =>
          t.setValue(this.plugin.settings.gitAutoPullOnStart).onChange(async (v) => {
            this.plugin.settings.gitAutoPullOnStart = v;
            await this.plugin.saveSettings();
          })
        );
    }

    // ── 五、番茄钟 ──
    if (this.plugin.isFeatureEnabled("pomodoro")) {
      containerEl.createEl("h3", { text: "番茄钟配置" });
      new Setting(containerEl)
        .setName("专注时长（分钟）")
        .addText((t) =>
          t.setValue(String(this.plugin.settings.pomodoroWorkMinutes)).onChange(async (v) => {
            this.plugin.settings.pomodoroWorkMinutes = Math.max(1, Number.parseInt(v, 10) || 25);
            await this.plugin.saveSettings();
            if (this.plugin.pomodoro && this.plugin.pomodoro.phase === "idle") {
              this.plugin.pomodoro.reset();
              this.plugin.updatePomodoroStatusBar();
            }
          })
        );
      new Setting(containerEl)
        .setName("短休时长（分钟）")
        .addText((t) =>
          t.setValue(String(this.plugin.settings.pomodoroBreakMinutes)).onChange(async (v) => {
            this.plugin.settings.pomodoroBreakMinutes = Math.max(1, Number.parseInt(v, 10) || 5);
            await this.plugin.saveSettings();
          })
        );
    }

    // ── 六、AI 辅助 ──
    if (this.plugin.isFeatureEnabled("aiAssist")) {
      containerEl.createEl("h3", { text: "AI 辅助接口配置（OpenAI 兼容）" });
      new Setting(containerEl)
        .setName("API Base URL")
        .setDesc("支持 OpenAI、DeepSeek、SiliconFlow 或本地 Ollama（如 http://localhost:11434/v1）")
        .addText((t) =>
          t
            .setPlaceholder("https://api.openai.com/v1")
            .setValue(this.plugin.settings.aiBaseUrl)
            .onChange(async (v) => {
              this.plugin.settings.aiBaseUrl = v.trim();
              await this.plugin.saveSettings();
            })
        );
      new Setting(containerEl)
        .setName("API Key")
        .setDesc("本地 Ollama 可留空；密钥仅保存在本地插件 data.json")
        .addText((t) => {
          t.inputEl.type = "password";
          t.setPlaceholder("sk-...").setValue(this.plugin.settings.aiApiKey).onChange(async (v) => {
            this.plugin.settings.aiApiKey = v.trim();
            await this.plugin.saveSettings();
          });
        });
      new Setting(containerEl)
        .setName("模型名称")
        .addText((t) =>
          t.setPlaceholder("gpt-4o-mini").setValue(this.plugin.settings.aiModel).onChange(async (v) => {
            this.plugin.settings.aiModel = v.trim();
            await this.plugin.saveSettings();
          })
        );
      new Setting(containerEl)
        .setName("自动出题默认题数")
        .addText((t) =>
          t.setValue(String(this.plugin.settings.aiQuizCount)).onChange(async (v) => {
            this.plugin.settings.aiQuizCount = Math.max(1, Math.min(20, Number.parseInt(v, 10) || 5));
            await this.plugin.saveSettings();
          })
        );
    }

    // ── 七、互动自测 ──
    if (this.plugin.isFeatureEnabled("quizEngine")) {
      containerEl.createEl("h3", { text: "SM-2 知识自测配置" });
      new Setting(containerEl)
        .setName("题库笔记目录")
        .addText((t) =>
          t.setPlaceholder("notes").setValue(this.plugin.settings.quizFolder).onChange(async (v) => {
            this.plugin.settings.quizFolder = v.trim();
            await this.plugin.saveSettings();
          })
        );
      new Setting(containerEl)
        .setName("错题复盘导出路径")
        .addText((t) =>
          t
            .setPlaceholder("notes/错题复盘.md")
            .setValue(this.plugin.settings.quizWrongExportPath)
            .onChange(async (v) => {
              this.plugin.settings.quizWrongExportPath = v.trim() || "notes/错题复盘.md";
              await this.plugin.saveSettings();
            })
        );
      new Setting(containerEl)
        .setName("重置答题记录")
        .addButton((b) =>
          b
            .setWarning()
            .setButtonText("清空记录")
            .onClick(async () => {
              this.plugin.settings.quizStore = {
                version: 2,
                times: 0,
                best: null,
                totalScore: 0,
                totalCorrect: 0,
                totalQuestions: 0,
                history: [],
                mastery: {}
              };
              await this.plugin.saveSettings();
              new Notice("答题记录已清空");
            })
        );
    }

    if (this.plugin.isFeatureEnabled("vaultDoctor")) {
      containerEl.createEl("h3", { text: "Vault 健康体检" });
      new Setting(containerEl)
        .setName("立即运行健康体检")
        .addButton((b) => b.setButtonText("运行体检").onClick(() => this.plugin.openDoctorModal()));
    }
  }
}

module.exports = { WorkbenchSettingTab };

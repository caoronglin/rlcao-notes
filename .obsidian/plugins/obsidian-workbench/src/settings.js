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
  { key: "aiAssist", name: "AI 辅助（提交摘要与自动出题）", desc: "调用 OpenAI 兼容接口（OpenAI / DeepSeek / Ollama）生成 Commit Message 与自测题库" },
  { key: "dailyJournal", name: "日记中心", desc: "今日/昨日日记快捷打开、连续天数统计与历史列表" },
  { key: "tasks", name: "任务中心", desc: "全库待办聚合、一键新建与勾选完成" },
  { key: "projects", name: "项目管理", desc: "工作台项目面板与模板化新建项目" },
  { key: "privacy", name: "隐私区（锁定后搜索/链接全隐身）", desc: "锁定：userIgnoreFilters 不索引 + Git 排除；解锁恢复。切换后需重载 Obsidian" },
  { key: "ragSearch", name: "AI RAG 搜索", desc: "SiliconFlow embeddings + rerank 全库语义检索（需 API Key）" },
  { key: "decision", name: "决策模型接口（内部，无独立入口）", desc: "闪念归类等功能内部调用本机 magpie 网关 /v1/systemone，不提供单独弹窗" },
  { key: "bases", name: "多维表格", desc: "工作台卡片列出 .duowei / .base，支持一键新建工作表" },
  { key: "attachments", name: "附件管理", desc: "孤儿附件、坏引用、体积榜，勾选批量归档到 4-存档" },
  { key: "imageTools", name: "图片工具", desc: "上传存档到 assets/<年-月>/，批量转 WebP/AVIF/JPEG 与压缩（sharp 优先，Canvas 兜底）" }
];

class WorkbenchSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Obsidian Workbench v3.1 设置" });

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
      // ── 外观：壁纸 / 毛玻璃 / 热力 ──
      containerEl.createEl("h4", { text: "外观：每日壁纸与毛玻璃" });

      new Setting(containerEl)
        .setName("启用每日壁纸")
        .setDesc("来源 https://bing.cnortles.top/api/daily（每日一图）")
        .addToggle((t) =>
          t.setValue(this.plugin.settings.wallpaperEnabled !== false).onChange(async (v) => {
            this.plugin.settings.wallpaperEnabled = v;
            await this.plugin.saveSettings();
            this.plugin.refreshWorkbenchViews();
            this.display();
          })
        );

      if (this.plugin.settings.wallpaperEnabled !== false) {
        new Setting(containerEl)
          .setName("壁纸取图模式")
          .addDropdown((d) => {
            d.addOption("daily", "每日一图（/api/daily）");
            d.addOption("random", "随机图（/api/random）");
            d.setValue(this.plugin.settings.wallpaperMode || "daily");
            d.onChange(async (v) => {
              this.plugin.settings.wallpaperMode = v;
              await this.plugin.saveSettings();
              this.plugin.refreshWorkbenchViews();
            });
          });

        new Setting(containerEl)
          .setName("壁纸格式")
          .setDesc("daily 模式支持 webp / jpeg / original（原始 JPEG 体积大）")
          .addDropdown((d) => {
            for (const f of ["webp", "jpeg", "original"]) d.addOption(f, f);
            d.setValue(this.plugin.settings.wallpaperFormat || "webp");
            d.onChange(async (v) => {
              this.plugin.settings.wallpaperFormat = v;
              await this.plugin.saveSettings();
              this.plugin.refreshWorkbenchViews();
            });
          });

        new Setting(containerEl)
          .setName("自定义壁纸 URL")
          .setDesc("留空使用 bing.cnortles.top；填任意图片直链可覆盖")
          .addText((t) =>
            t.setPlaceholder("https://…/image.webp").setValue(this.plugin.settings.wallpaperCustomUrl || "").onChange(async (v) => {
              this.plugin.settings.wallpaperCustomUrl = v.trim();
              await this.plugin.saveSettings();
              this.plugin.refreshWorkbenchViews();
            })
          );

        new Setting(containerEl)
          .setName("壁纸压暗程度")
          .setDesc("0 = 原图，1 = 全黑。默认 0.42，保证毛玻璃上的文字可读")
          .addSlider((sl) =>
            sl.setLimits(0, 0.9, 0.02)
              .setValue(this.plugin.settings.wallpaperDim == null ? 0.42 : this.plugin.settings.wallpaperDim)
              .setDynamicTooltip()
              .onChange(async (v) => {
                this.plugin.settings.wallpaperDim = v;
                await this.plugin.saveSettings();
                this.plugin.refreshWorkbenchViews();
              })
          );
      }

      new Setting(containerEl)
        .setName("毛玻璃效果")
        .setDesc("卡片使用 backdrop-filter 模糊背景")
        .addToggle((t) =>
          t.setValue(this.plugin.settings.glassEffect !== false).onChange(async (v) => {
            this.plugin.settings.glassEffect = v;
            await this.plugin.saveSettings();
            this.plugin.refreshWorkbenchViews();
          })
        );

      if (this.plugin.settings.glassEffect !== false) {
        new Setting(containerEl)
          .setName("模糊半径")
          .addSlider((sl) =>
            sl.setLimits(4, 40, 2)
              .setValue(this.plugin.settings.glassBlur || 18)
              .setDynamicTooltip()
              .onChange(async (v) => {
                this.plugin.settings.glassBlur = v;
                await this.plugin.saveSettings();
                this.plugin.refreshWorkbenchViews();
              })
          );
      }

      new Setting(containerEl)
        .setName("热力日历跨度")
        .addDropdown((d) => {
          for (const w of [13, 26, 52]) d.addOption(String(w), w + " 周");
          d.setValue(String(this.plugin.settings.heatmapWeeks || 26));
          d.onChange(async (v) => {
            this.plugin.settings.heatmapWeeks = Number(v);
            await this.plugin.saveSettings();
            this.plugin.refreshWorkbenchViews();
          });
        });

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

    // ── 八、日记中心 ──
    if (this.plugin.isFeatureEnabled("dailyJournal")) {
      containerEl.createEl("h3", { text: "日记中心" });
      new Setting(containerEl)
        .setName("日期格式")
        .addText((t) =>
          t.setPlaceholder("YYYY-MM-DD").setValue(this.plugin.settings.dailyDateFormat).onChange(async (v) => {
            this.plugin.settings.dailyDateFormat = v.trim() || "YYYY-MM-DD";
            await this.plugin.saveSettings();
          })
        );
      new Setting(containerEl)
        .setName("立即打开")
        .addButton((b) => b.setButtonText("今日日记").onClick(() => this.plugin.openDailyNote(0)));
    }

    // ── 九、任务中心 ──
    if (this.plugin.isFeatureEnabled("tasks")) {
      containerEl.createEl("h3", { text: "任务中心" });
      new Setting(containerEl)
        .setName("新任务落盘文件")
        .addText((t) =>
          t.setPlaceholder("vault/任务.md").setValue(this.plugin.settings.tasksPath).onChange(async (v) => {
            this.plugin.settings.tasksPath = v.trim() || "vault/任务.md";
            await this.plugin.saveSettings();
          })
        );
      new Setting(containerEl)
        .setName("打开任务中心")
        .addButton((b) => b.setButtonText("查看全库待办").onClick(() => this.plugin.openTaskCenter()));
    }

    // ── 十、项目管理 ──
    if (this.plugin.isFeatureEnabled("projects")) {
      containerEl.createEl("h3", { text: "项目管理" });
      new Setting(containerEl)
        .setName("新建项目")
        .addButton((b) => b.setButtonText("模板化创建").onClick(() => this.plugin.createProjectInteractive()));
    }

    // ── 十一、隐私区 ──
    if (this.plugin.isFeatureEnabled("privacy")) {
      containerEl.createEl("h3", { text: "隐私区" });
      new Setting(containerEl)
        .setName("隐私区目录")
        .setDesc("锁定后该目录不进搜索/反向链接/图谱，且被 Git 排除；需重载 Obsidian 生效")
        .addText((t) =>
          t.setPlaceholder("vault/隐私").setValue(this.plugin.settings.privacyFolder).onChange(async (v) => {
            this.plugin.settings.privacyFolder = v.trim();
            await this.plugin.saveSettings();
          })
        );
      new Setting(containerEl)
        .setName("一键切换")
        .addButton((b) => b.setButtonText("🔒 锁定").onClick(() => this.plugin.setPrivacy(true)))
        .addButton((b) => b.setButtonText("🔓 解锁").onClick(() => this.plugin.setPrivacy(false)));
    }

    // ── 十二、AI RAG 搜索 ──
    if (this.plugin.isFeatureEnabled("ragSearch")) {
      containerEl.createEl("h3", { text: "AI RAG 搜索（SiliconFlow）" });
      new Setting(containerEl)
        .setName("API Key")
        .setDesc("https://siliconflow.cn 控制台获取")
        .addText((t) =>
          t.setPlaceholder("sk-…").setValue(this.plugin.settings.ragApiKey).onChange(async (v) => {
            this.plugin.settings.ragApiKey = v.trim();
            await this.plugin.saveSettings();
          })
        );
      new Setting(containerEl)
        .setName("嵌入模型 / 重排模型")
        .addText((t) =>
          t.setPlaceholder("BAAI/bge-m3").setValue(this.plugin.settings.ragEmbedModel).onChange(async (v) => {
            this.plugin.settings.ragEmbedModel = v.trim() || "BAAI/bge-m3";
            await this.plugin.saveSettings();
          })
        )
        .addText((t) =>
          t.setPlaceholder("BAAI/bge-reranker-v2-m3").setValue(this.plugin.settings.ragRerankModel).onChange(async (v) => {
            this.plugin.settings.ragRerankModel = v.trim() || "BAAI/bge-reranker-v2-m3";
            await this.plugin.saveSettings();
          })
        );
      new Setting(containerEl)
        .setName("扫描范围（逗号分隔）")
        .setDesc("留空扫全库（自动排除 .obsidian/.trash/4-存档/隐私区）")
        .addText((t) =>
          t.setPlaceholder("notes,vault,wiki,_posts").setValue(this.plugin.settings.ragFolders).onChange(async (v) => {
            this.plugin.settings.ragFolders = v.trim();
            await this.plugin.saveSettings();
          })
        );
      new Setting(containerEl)
        .setName("索引管理")
        .addButton((b) => b.setButtonText("构建/更新索引").onClick(() => this.plugin.buildRagIndex()))
        .addButton((b) => b.setButtonText("打开工作台卡片").onClick(() => this.plugin.activateWorkbenchView()))
        .addButton((b) => b.setButtonText("生成知识图谱").onClick(() => this.plugin.buildGraphNote()));
    }

    // ── 十三、Jev/Clef 决策 ──
    if (this.plugin.isFeatureEnabled("decision")) {
      containerEl.createEl("h3", { text: "Jev / Clef TypeSafe 决策" });
      new Setting(containerEl)
        .setName("网关端点")
        .addText((t) =>
          t.setPlaceholder("http://127.0.0.1:3425/v1/systemone").setValue(this.plugin.settings.decisionEndpoint).onChange(async (v) => {
            this.plugin.settings.decisionEndpoint = v.trim();
            await this.plugin.saveSettings();
          })
        );
      new Setting(containerEl)
        .setName("模型")
        .setDesc("Jev：vercel-jev/typesafe-ai/jev · Clef（可读图）：vercel-jev/typesafe-ai/clef")
        .addText((t) =>
          t.setValue(this.plugin.settings.decisionModel).onChange(async (v) => {
            this.plugin.settings.decisionModel = v.trim() || "vercel-jev/typesafe-ai/jev";
            await this.plugin.saveSettings();
          })
        );
      new Setting(containerEl)
        .setName("令牌")
        .setDesc("网关信任本机回环，可保留默认")
        .addText((t) =>
          t.setValue(this.plugin.settings.decisionToken).onChange(async (v) => {
            this.plugin.settings.decisionToken = v.trim() || "magpie";
            await this.plugin.saveSettings();
          })
        );
      new Setting(containerEl)
        .setName("闪念自动归类")
        .setDesc("快速闪念写入后，内部调用决策接口判断应归入哪个区，结果只做提示不自动移动")
        .addToggle((t) =>
          t.setValue(this.plugin.settings.decisionAutoClassify !== false).onChange(async (v) => {
            this.plugin.settings.decisionAutoClassify = v;
            await this.plugin.saveSettings();
          })
        );
      new Setting(containerEl)
        .setName("归类置信度下限")
        .setDesc("低于该值不提示（0-1）")
        .addSlider((sl) =>
          sl.setLimits(0, 1, 0.05)
            .setValue(this.plugin.settings.decisionConfidenceFloor == null ? 0.6 : this.plugin.settings.decisionConfidenceFloor)
            .setDynamicTooltip()
            .onChange(async (v) => {
              this.plugin.settings.decisionConfidenceFloor = v;
              await this.plugin.saveSettings();
            })
        );
    }

    // ── 十四、附件管理 ──
    if (this.plugin.isFeatureEnabled("attachments")) {
      containerEl.createEl("h3", { text: "附件管理" });
      new Setting(containerEl)
        .setName("扫描全库附件")
        .setDesc("检测孤儿附件、坏引用与体积榜；归档是移动不是删除")
        .addButton((b) => b.setButtonText("打开附件管理器").onClick(() => this.plugin.openAttachmentModal()));
    }

    // ── 十四点五、文件浏览器整理（分栏/隐藏/分隔线）──
    containerEl.createEl("h3", { text: "文件浏览器整理" });
    containerEl.createDiv({
      cls: "setting-item-description",
      text: "生成 CSS 片段隐藏指定目录并在指定目录后画分隔线，自动启用。原理见论坛 topic/44108：.nav-folder:has([data-path=…])"
    });
    new Setting(containerEl)
      .setName("隐藏这些目录")
      .setDesc("逗号分隔，例如 assets,scripts,panel")
      .addText((t) =>
        t.setValue(this.plugin.settings.explorerHideList || "").onChange(async (v) => {
          this.plugin.settings.explorerHideList = v;
          await this.plugin.saveSettings();
        })
      );
    new Setting(containerEl)
      .setName("在这些目录后加分隔线")
      .setDesc("逗号分隔，例如 vault,notes,wiki")
      .addText((t) =>
        t.setValue(this.plugin.settings.explorerSeparatorAfter || "").onChange(async (v) => {
          this.plugin.settings.explorerSeparatorAfter = v;
          await this.plugin.saveSettings();
        })
      );
    new Setting(containerEl)
      .setName("应用到文件浏览器")
      .addButton((b) => b.setButtonText("生成并启用样式").onClick(() => this.plugin.applyExplorerStyle()));

    // ── 十四点六、多维表格 ──
    if (this.plugin.isFeatureEnabled("bases")) {
      containerEl.createEl("h3", { text: "多维表格" });
      new Setting(containerEl)
        .setName("新建工作表目录")
        .addText((t) =>
          t.setValue(this.plugin.settings.basesFolder || "vault/工作台").onChange(async (v) => {
            this.plugin.settings.basesFolder = v.trim() || "vault/工作台";
            await this.plugin.saveSettings();
          })
        );
    }

    // ── 十四点七、调试与性能 ──
    containerEl.createEl("h3", { text: "调试与性能" });
    new Setting(containerEl)
      .setName("显示渲染耗时面板")
      .setDesc("工作台底部输出 render/data/heat 各阶段耗时与缓存命中情况")
      .addToggle((t) =>
        t.setValue(Boolean(this.plugin.settings.debugPerf)).onChange(async (v) => {
          this.plugin.settings.debugPerf = v;
          await this.plugin.saveSettings();
          this.plugin.refreshWorkbenchViews();
        })
      );
    new Setting(containerEl)
      .setName("允许代码块执行")
      .setDesc("run-js / run-python / run-sh 代码块的运行按钮。每次执行都会二次确认；默认关闭")
      .addToggle((t) =>
        t.setValue(Boolean(this.plugin.settings.codeExecEnabled)).onChange(async (v) => {
          this.plugin.settings.codeExecEnabled = v;
          await this.plugin.saveSettings();
          this.display();
        })
      );
    if (this.plugin.settings.codeExecEnabled) {
      new Setting(containerEl)
        .setName("执行超时（秒）")
        .addSlider((sl) =>
          sl.setLimits(5, 120, 5)
            .setValue(this.plugin.settings.codeExecTimeoutSec || 20)
            .setDynamicTooltip()
            .onChange(async (v) => {
              this.plugin.settings.codeExecTimeoutSec = v;
              await this.plugin.saveSettings();
            })
        );
      new Setting(containerEl)
        .setName("Python 解释器")
        .setDesc("留空默认 python3")
        .addText((t) =>
          t.setValue(this.plugin.settings.pythonPath || "python3").onChange(async (v) => {
            this.plugin.settings.pythonPath = v.trim() || "python3";
            await this.plugin.saveSettings();
          })
        );
    }
    new Setting(containerEl)
      .setName("清空热力缓存并重渲染")
      .addButton((b) =>
        b.setButtonText("立即重算").onClick(() => {
          for (const leaf of this.app.workspace.getLeavesOfType("owb-workbench-view")) {
            if (leaf.view && leaf.view.invalidateHeat) leaf.view.invalidateHeat();
          }
          this.plugin.refreshWorkbenchViews();
          new Notice("缓存已清空");
        })
      );

    // ── 十五、图片工具 ──
    if (this.plugin.isFeatureEnabled("imageTools")) {
      containerEl.createEl("h3", { text: "图片工具" });
      const info = require("./services/imageService").engineInfo();
      new Setting(containerEl)
        .setName("转换引擎")
        .setDesc(
          info.engine === "sharp"
            ? "sharp（libvips " + (info.libvips || "?") + "）· 支持 AVIF 与高质量重采样"
            : "Canvas 兜底（webp/jpeg/png）。要启用 AVIF 与更快转换：在插件目录执行 npm i sharp 后重启 Obsidian" +
              (info.error ? " · 原因：" + String(info.error).slice(0, 100) : "")
        )
        .addButton((b) => b.setButtonText("打开图片工具").onClick(() => this.plugin.openImageToolsModal()));
    }
  }
}

module.exports = { WorkbenchSettingTab };

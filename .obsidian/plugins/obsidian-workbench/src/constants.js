"use strict";

const VIEW_TYPE_WORKBENCH = "owb-workbench-view";
const VIEW_TYPE_GIT = "owb-git-view";
const VIEW_TYPE_QUIZ = "owb-quiz-view";
const VIEW_TYPE_RAG = "owb-rag-view";

const DEFAULT_SETTINGS = {
  // ── 全模块功能开关（可按需随时启停，实时生效） ──
  features: {
    workbench: true,      // 个人知识工作台主视图
    gitPanel: true,       // Git 管理侧边栏与状态栏
    gitAdvanced: true,    // Git 高级区：Stash 暂存栈、远程仓库配置、冲突一键解决
    quickCapture: true,   // 快速闪念弹窗
    quizEngine: true,     // SM-2 互动自测视图
    pomodoro: true,       // 番茄钟计时器与每日专注统计
    vaultDoctor: true,    // Vault 健康体检
    aiAssist: false,      // AI 辅助（生成 Commit Message / 从笔记自动出题，配好接口后开启）
    dailyJournal: true,   // 日记中心：今日/昨日快捷、连续天数与历史列表
    tasks: true,          // 任务中心：全库任务聚合、新建与勾选
    projects: true,       // 项目管理：活跃项目面板与模板化新建
    privacy: false,       // 隐私区：搜索/链接全隐身 + Git 排除一键切换
    ragSearch: true,      // AI RAG 搜索：SiliconFlow embeddings + rerank
    decision: true,       // Jev/Clef TypeSafe 决策（choice / noul / score + 置信度）
    attachments: true,    // 附件管理：孤儿/坏引用/体积榜 + 批量归档
    imageTools: true      // 图片工具：上传存档 + sharp/Canvas 格式转换与压缩
  },

  // 工作台仪表盘
  openWorkbenchOnStart: false,
  dailyFolder: "vault/日记",
  dailyDateFormat: "YYYY-MM-DD",
  projectFolder: "vault/项目",
  onlyDueTasks: false,
  forgottenDays: 30,
  quickLinks: [
    { label: "闪念收件箱", target: "inbox.md" },
    { label: "生信自测题库", target: "notes/bio/生信学习/生信自测题库.md" }
  ],

  // 任务中心
  tasksPath: "vault/任务.md",
  tasksScanLimit: 200,

  // 隐私区
  privacyFolder: "vault/隐私",

  // AI RAG 搜索（SiliconFlow）
  ragApiKey: "",
  ragBaseUrl: "https://api.siliconflow.cn",
  ragEmbedModel: "BAAI/bge-m3",
  ragRerankModel: "BAAI/bge-reranker-v2-m3",
  ragFolders: "notes,vault,wiki,_posts",
  ragChunkChars: 600,

  // Jev / Clef TypeSafe 决策（magpie 本机网关）
  decisionEndpoint: "http://127.0.0.1:3425/v1/systemone",
  decisionToken: "magpie",
  decisionModel: "vercel-jev/typesafe-ai/jev",

  // 快速闪念
  inboxPath: "inbox.md",
  captureInsertMode: "top",
  captureTimeFormat: "HH:mm",

  // Git 面板与同步
  gitBinary: "git",
  gitCommitTemplate: "vault backup: {{date}}",
  gitAutoSyncMinutes: 0,
  gitAutoPullOnStart: false,
  gitTimeoutMs: 30000,

  // 番茄钟与专注统计
  pomodoroWorkMinutes: 25,
  pomodoroBreakMinutes: 5,
  pomodoroStats: {}, // { "YYYY-MM-DD": { sessions: 0, minutes: 0 } }

  // AI 辅助（兼容 OpenAI / DeepSeek / Ollama 等所有 /chat/completions 接口）
  aiBaseUrl: "https://api.openai.com/v1",
  aiApiKey: "",
  aiModel: "gpt-4o-mini",
  aiQuizCount: 5,

  // SM-2 互动答题引擎
  quizFolder: "notes",
  quizShuffleQuestions: false,
  quizShuffleOptions: false,
  quizWrongExportPath: "notes/bio/生信学习/错题复盘.md",
  quizStore: {
    version: 2,
    times: 0,
    best: null,
    totalScore: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    history: [],
    mastery: {}
  }
};

module.exports = {
  VIEW_TYPE_WORKBENCH,
  VIEW_TYPE_GIT,
  VIEW_TYPE_QUIZ,
  VIEW_TYPE_RAG,
  DEFAULT_SETTINGS
};

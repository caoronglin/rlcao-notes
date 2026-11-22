"use strict";

const VIEW_TYPE_WORKBENCH = "owb-workbench-view";
const VIEW_TYPE_GIT = "owb-git-view";
const VIEW_TYPE_QUIZ = "owb-quiz-view";

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
    aiAssist: false       // AI 辅助（生成 Commit Message / 从笔记自动出题，配好接口后开启）
  },

  // 工作台仪表盘
  openWorkbenchOnStart: false,
  dailyFolder: "diary",
  dailyDateFormat: "YYYY-MM-DD",
  projectFolder: "",
  onlyDueTasks: false,
  forgottenDays: 30,
  quickLinks: [
    { label: "闪念收件箱", target: "inbox.md" },
    { label: "示例题库", target: "notes/sample-quiz-bank.md" }
  ],

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
  quizWrongExportPath: "notes/错题复盘.md",
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
  DEFAULT_SETTINGS
};

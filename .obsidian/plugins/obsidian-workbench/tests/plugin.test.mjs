import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import Module from "node:module";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const { GitService } = require(path.join(rootDir, "src/services/gitService.js"));
const {
  parseMarkdownQuiz,
  updateMasterySM2,
  getDueOrWrongQuestions,
  formatWrongCalloutMarkdown
} = require(path.join(rootDir, "src/services/quizEngine.js"));
const { diagnoseVault, ensureSafeGitignore } = require(path.join(rootDir, "src/services/doctorService.js"));
const { PomodoroService } = require(path.join(rootDir, "src/services/pomodoroService.js"));
const { generateCommitMessage, generateQuizMarkdownFromNote } = require(path.join(rootDir, "src/services/aiService.js"));
const { insertCaptureLine } = require(path.join(rootDir, "src/utils.js"));

test("GitService end-to-end: Unicode paths, stash, remote config & conflict resolution", async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "owb-git-v3-"));
  try {
    const git = new GitService(tmp);
    await git.initRepo();
    await git.exec(["config", "user.name", "Test User"]);
    await git.exec(["config", "user.email", "test@example.com"]);

    fs.mkdirSync(path.join(tmp, "notes"), { recursive: true });
    const noteRel = "notes/基因 组笔记.md";
    fs.writeFileSync(path.join(tmp, noteRel), "line1\n", "utf8");

    let st = await git.getStatus();
    assert.equal(st.unstaged[0].path, noteRel);

    await git.stageAll();
    await git.commit("init");

    // 测试 Stash 暂存与弹出
    fs.writeFileSync(path.join(tmp, noteRel), "wip change\n", "utf8");
    await git.stashPush("temp wip");
    let stashes = await git.listStashes();
    assert.equal(stashes.length, 1);
    assert.match(stashes[0].message, /temp wip/);
    await git.stashPop(stashes[0].ref);
    assert.equal(fs.readFileSync(path.join(tmp, noteRel), "utf8"), "wip change\n");
    await git.discardFile(noteRel, false);

    // 测试 Remote 增改删
    await git.setRemote("origin", "https://example.com/vault.git");
    let remotes = await git.listRemotes();
    assert.equal(remotes.length, 1);
    assert.equal(remotes[0].url, "https://example.com/vault.git");
    await git.setRemote("origin", "https://example.com/vault-new.git");
    remotes = await git.listRemotes();
    assert.equal(remotes[0].url, "https://example.com/vault-new.git");
    await git.removeRemote("origin");
    assert.equal((await git.listRemotes()).length, 0);

    // 测试真实合并冲突检测与 resolveConflict("theirs")
    const mainBranch = (await git.getStatus()).branch;
    await git.createBranch("side");
    fs.writeFileSync(path.join(tmp, noteRel), "side version\n", "utf8");
    await git.stageAll();
    await git.commit("side edit");

    await git.checkoutBranch(mainBranch);
    fs.writeFileSync(path.join(tmp, noteRel), "main version\n", "utf8");
    await git.stageAll();
    await git.commit("main edit");

    await assert.rejects(() => git.exec(["merge", "side"]));
    st = await git.getStatus();
    assert.equal(st.conflicts.length, 1);
    assert.equal(st.conflicts[0].path, noteRel);

    await git.resolveConflict(noteRel, "theirs");
    assert.equal(fs.readFileSync(path.join(tmp, noteRel), "utf8"), "side version\n");
    st = await git.getStatus();
    assert.equal(st.conflicts.length, 0);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("PomodoroService countdown records daily focus stats accurately", () => {
  const settings = { pomodoroWorkMinutes: 1, pomodoroBreakMinutes: 1, pomodoroStats: {} };
  let completedPhase = null;
  const pomo = new PomodoroService(
    () => settings,
    (phase) => { completedPhase = phase; }
  );
  pomo.startWork();
  assert.equal(pomo.phase, "work");
  assert.equal(pomo.formatRemaining(), "01:00");

  const fixedDay = new Date(2026, 10, 20, 10, 0, 0);
  for (let i = 0; i < 60; i++) pomo.tick(fixedDay);

  assert.equal(completedPhase, "work");
  assert.equal(pomo.phase, "idle");
  const today = pomo.getTodayStats(fixedDay);
  assert.equal(today.sessions, 1);
  assert.equal(today.minutes, 1);
});

test("AIService formats commit message and generates valid Markdown quiz bank", async () => {
  const mockCommitClient = async () => ({
    choices: [{ message: { content: "`docs(notes): 更新玉米基因组笔记`" } }]
  });
  const msg = await generateCommitMessage(
    "diff --git a/a.md b/a.md\n+Zm00001d",
    { aiBaseUrl: "http://localhost:11434/v1", aiModel: "qwen2.5", aiApiKey: "" },
    mockCommitClient
  );
  assert.equal(msg, "docs(notes): 更新玉米基因组笔记");

  const mockQuizClient = async () => ({
    choices: [{
      message: {
        content: [
          "```markdown",
          "---",
          "title: 测试题库",
          "---",
          "## RNA-seq 中 padj 控制什么？",
          "- [ ] A. 均值",
          "- [x] B. FDR 错误发现率",
          "> 解析：多重检验校正。",
          "> 标签：RNA-seq",
          "```"
        ].join("\n")
      }
    }]
  });
  const md = await generateQuizMarkdownFromNote(
    "RNA-seq",
    "padj 控制 FDR",
    1,
    { aiBaseUrl: "http://localhost:11434/v1", aiModel: "qwen2.5", aiApiKey: "" },
    mockQuizClient
  );
  const parsed = parseMarkdownQuiz(md);
  assert.equal(parsed.questions.length, 1);
  assert.deepEqual(parsed.questions[0].ansList, ["b"]);
});

test("QuizEngine parses single/multi/boolean and updates SM-2 mastery", () => {
  const sample = fs.readFileSync(path.join(rootDir, "examples/sample-quiz-bank.md"), "utf8");
  const { meta, questions } = parseMarkdownQuiz(sample);
  assert.equal(questions.length, 3);
  const store = { mastery: {} };
  const now = 1_700_000_000_000;
  updateMasterySM2(store, questions[0].id, false, now);
  updateMasterySM2(store, questions[1].id, true, now);
  const due = getDueOrWrongQuestions(questions, store, now);
  assert.equal(due.length, 1);
  const callout = formatWrongCalloutMarkdown(meta.title, due, "2026-11-20");
  assert.match(callout, /> \[!warning\]/);
});

test("insertCaptureLine preserves YAML frontmatter & Doctor detects issues", async () => {
  const doc = "---\ntags: [inbox]\n---\n\n- 09:00 - old\n";
  assert.equal(
    insertCaptureLine(doc, "- 10:30 - new", "top"),
    "---\ntags: [inbox]\n---\n\n- 10:30 - new\n- 09:00 - old\n"
  );

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "owb-doc-v3-"));
  try {
    const obs = path.join(tmp, ".obsidian");
    fs.mkdirSync(path.join(obs, "plugins", "unused"), { recursive: true });
    fs.writeFileSync(path.join(obs, "community-plugins.json"), "[]", "utf8");
    const git = new GitService(tmp);
    await git.initRepo();
    const issues = await diagnoseVault(tmp, git);
    assert.ok(issues.some((i) => i.code === "GITIGNORE_INCOMPLETE"));
    assert.equal(ensureSafeGitignore(tmp), true);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("Bundled v3.0 main.js loads cleanly and exposes feature toggle APIs", () => {
  const origLoad = Module._load;
  Module._load = function (request) {
    if (request === "obsidian") {
      return {
        Plugin: class {},
        ItemView: class {},
        Modal: class {},
        PluginSettingTab: class {},
        Setting: class {},
        Notice: class {},
        normalizePath: (p) => p,
        setIcon: () => {},
        requestUrl: async () => ({ status: 200, json: {} })
      };
    }
    return origLoad.apply(this, arguments);
  };
  try {
    const bundlePath = path.join(rootDir, "main.js");
    delete require.cache[bundlePath];
    const PluginClass = require(bundlePath);
    assert.equal(typeof PluginClass.prototype.isFeatureEnabled, "function");
    assert.equal(typeof PluginClass.prototype.applyFeatureState, "function");
    assert.equal(typeof PluginClass.prototype.openAIQuizModal, "function");
  } finally {
    Module._load = origLoad;
  }
});

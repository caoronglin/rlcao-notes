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

// Obsidian runtime absent under Node: route require("obsidian") to a stub.
Module.registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "obsidian") {
      return {
        url: "file://" + path.join(rootDir, "tests/stubs/obsidian.js"),
        shortCircuit: true,
        format: "commonjs"
      };
    }
    return nextResolve(specifier, context);
  }
});

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

test("v3.1 modules: export contract + cosine/streak sanity", () => {
  const { RagService, cosine } = require(path.join(rootDir, "src/services/ragService.js"));
  const decision = require(path.join(rootDir, "src/services/decisionService.js"));
  const daily = require(path.join(rootDir, "src/services/dailyService.js"));
  const { listProjects, createProject, parseFrontmatter } = require(path.join(rootDir, "src/services/projectService.js"));
  const privacy = require(path.join(rootDir, "src/services/privacyService.js"));

  assert.equal(typeof RagService, "function");
  assert.equal(typeof cosine, "function");
  assert.equal(typeof decision.ask, "function");
  assert.equal(typeof decision.noteToState, "function");
  assert.equal(typeof daily.computeStreak, "function");
  assert.equal(typeof daily.openDaily, "function");
  assert.equal(typeof listProjects, "function");
  assert.equal(typeof createProject, "function");
  assert.equal(typeof privacy.setHidden, "function");
  assert.equal(typeof privacy.ensureFolder, "function");

  // cosine: 平行=1, 正交=0
  assert.ok(Math.abs(cosine([1, 0], [2, 0]) - 1) < 1e-9);
  assert.ok(Math.abs(cosine([1, 0], [0, 1])) < 1e-9);

  // normalizeAnswers: choice / score / noul 三形态归一
  const norm = decision.normalizeAnswers(
    { answers: { team: { choice: "billing", confidence: 0.9 }, q: { score: 7, confidence: 0.8 }, n: { noul: true, confidence: 0.7 } } },
    { team: "choice", q: "score", n: "noul" }
  );
  assert.equal(norm.answers.team.value, "billing");
  assert.equal(norm.answers.q.value, 7);
  assert.equal(norm.answers.n.value, true);
  assert.equal(norm.answers.team.confidence, 0.9);

  // streak: 昨日+今日=2, 今日缺失不打破昨日连击
  const now = new Date(2026, 10, 22);
  const s1 = daily.computeStreak([{ key: "2026-11-22" }, { key: "2026-11-21" }], now);
  assert.equal(s1.streak, 2);
  assert.equal(s1.includesToday, true);
  const s2 = daily.computeStreak([{ key: "2026-11-21" }], now);
  assert.equal(s2.streak, 1);
  assert.equal(s2.includesToday, false);

  // parseFrontmatter 容错
  const fm = parseFrontmatter('---\ntype: project\nstatus: "进行中"\ndue: 2026-12-01\n---\n# t');
  assert.equal(fm.type, "project");
  assert.equal(fm.status, "进行中");
  assert.equal(fm.due, "2026-12-01");

  // RagService: chunkText 切块含标题语境、围栏代码不切块标题
  const svc = new RagService(() => ({ ragBaseUrl: "https://api.siliconflow.cn" }), null);
  const sample = "# A\n\n" + "x".repeat(700) + "\n\n## B\n\n```md\n# fake\n```\n\ntail text here";
  const chunks = svc.chunkText(sample, 600);
  assert.ok(chunks.length >= 2);
  assert.equal(chunks[0].heading, "A");
  assert.ok(!chunks.some((c) => c.heading === "fake"));
});

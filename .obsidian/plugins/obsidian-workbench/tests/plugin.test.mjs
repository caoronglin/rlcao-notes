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

test("v3.2 attachments: ref extraction + orphan/坏引用 detection", async () => {
  const { extractAttachmentRefs, auditVault } = require(path.join(rootDir, "src/services/attachmentService.js"));

  // 四种引用形式
  const text = [
    "![[pic.png]]",
    "![[assets/2026-11/photo.webp|300]]",
    "![](../assets/old.jpg)",
    '<img src="assets/x.svg" width="40">',
    "![[notes/a.md]]",            // 非附件，忽略
    "![ext](https://e.com/a.png)", // 外链，忽略
    "```md",
    "![[inside-fence.png]]",       // 围栏内，忽略
    "```",
    "行内 `![[inline-code.png]]` 不算"
  ].join("\n");
  const refs = extractAttachmentRefs(text);
  const targets = refs.map((r) => r.target).sort();
  assert.deepEqual(targets, ["old.jpg", "photo.webp", "pic.png", "x.svg"]);

  // 全库审计：构造假 vault
  const files = [
    { path: "notes/a.md", extension: "md", name: "a.md", stat: { size: 10 } },
    { path: "assets/used.png", extension: "png", name: "used.png", stat: { size: 100 } },
    { path: "assets/orphan.png", extension: "png", name: "orphan.png", stat: { size: 900 } }
  ];
  const app = {
    vault: {
      getFiles: () => files,
      cachedRead: async (f) => (f.path === "notes/a.md" ? "![[used.png]]\n![[gone.png]]" : "")
    }
  };
  const report = await auditVault(app);
  assert.equal(report.attachments.length, 2);
  assert.equal(report.orphans.length, 1);
  assert.equal(report.orphans[0].name, "orphan.png");
  assert.equal(report.missingRefs.length, 1);
  assert.equal(report.missingRefs[0].target, "gone.png");
  assert.equal(report.orphanBytes, 900);
});

test("v3.2 images: engine detect + canvas fallback contract", async () => {
  const img = require(path.join(rootDir, "src/services/imageService.js"));
  const info = img.engineInfo();
  assert.ok(["sharp", "canvas"].includes(info.engine));
  assert.equal(typeof img.saveImage, "function");
  assert.equal(typeof img.convertBuffer, "function");
  assert.equal(typeof img.assetDirFor, "function");

  // assets/<YYYY-MM> 命名
  const d = img.assetDirFor(new Date(2026, 10, 22));
  assert.equal(d, "assets/2026-11");

  // 无 sharp、无 document → 明确报错而不是静默失败
  if (info.engine === "canvas") {
    await assert.rejects(
      () => img.convertBuffer(new Uint8Array([1, 2, 3]), "png", { format: "webp" }),
      /Canvas|sharp/
    );
    // AVIF 在 canvas 下必须明确拒绝
    await assert.rejects(
      () => img.convertBuffer(new Uint8Array([1]), "png", { format: "avif" }),
      /AVIF|sharp|Canvas/
    );
  }
  // 不支持的目标格式一律拒绝
  await assert.rejects(
    () => img.convertBuffer(new Uint8Array([1]), "png", { format: "tiff" }),
    /不支持的目标格式/
  );
});

test("v3.3 heatmap: 日期网格对齐 / 分级 / streak / 排除规则", () => {
  const { buildHeatmap } = require(path.join(rootDir, "src/services/heatmapService.js"));
  const now = new Date();
  const dayMs = 86400000;
  const files = [
    // 今天改过
    { path: "notes/a.md", name: "a.md", stat: { ctime: now.getTime() - 30 * dayMs, mtime: now.getTime() } },
    // 昨天新建
    { path: "notes/b.md", name: "b.md", stat: { ctime: now.getTime() - dayMs, mtime: now.getTime() - dayMs } },
    // 应被排除
    { path: "4-存档/2026-01-01/x.md", name: "x.md", stat: { ctime: now.getTime(), mtime: now.getTime() } },
    { path: ".obsidian/plugins/p/README.md", name: "README.md", stat: { ctime: now.getTime(), mtime: now.getTime() } }
  ];
  const app = { vault: { getMarkdownFiles: () => files } };
  const heat = buildHeatmap(app, { weeks: 13 });

  assert.equal(heat.weeks, 13);
  assert.equal(heat.grid.length, 13);
  assert.ok(heat.grid.every((col) => col.length === 7), "每列必须 7 天");
  assert.equal(heat.days.length, 91);

  // 口径：新建(ctime) 与 更新(mtime 且不同天) 各计 1
  // a.md = 30 天前创建(1) + 今天更新(1)，b.md = 昨天创建(1) => 3
  // 排除生效：4-存档/ 与 .obsidian/README.md 不计入
  assert.equal(heat.total, 3);
  assert.ok(heat.max >= 1);
  assert.ok(heat.streak >= 1);

  // 网格最后一天应是「本周周日」或之后，且未来日标记正确
  const lastDay = heat.grid[12][6];
  assert.ok(lastDay.date.getTime() >= now.getTime() - 8 * dayMs);
  const futureCells = heat.days.filter((d) => d.inFuture);
  assert.ok(futureCells.every((d) => d.date.getTime() > now.getTime()));

  // 分级不超过 4
  assert.ok(heat.days.every((d) => d.level >= 0 && d.level <= 4));
});

test("v3.3 wallpaper: bing.cnortles.top URL 构造与自定义覆盖", () => {
  const wp = require(path.join(rootDir, "src/services/wallpaperService.js"));
  assert.equal(wp.wallpaperUrl({}), "https://bing.cnortles.top/api/daily");
  assert.equal(
    wp.wallpaperUrl({ wallpaperMode: "random" }),
    "https://bing.cnortles.top/api/random"
  );
  assert.equal(
    wp.wallpaperUrl({ wallpaperMode: "daily", wallpaperFormat: "jpeg" }),
    "https://bing.cnortles.top/api/daily?format=jpeg"
  );
  // 自定义直链完全覆盖
  assert.equal(
    wp.wallpaperUrl({ wallpaperCustomUrl: "https://e.com/a.avif" }),
    "https://e.com/a.avif"
  );
  // bust 附加时间戳
  assert.match(wp.wallpaperUrl({}, { bust: true }), /^https:\/\/bing\.cnortles\.top\/api\/daily\?t=\d+$/);
  assert.equal(wp.shouldRefresh("2026-11-21", "2026-11-22"), true);
  assert.equal(wp.shouldRefresh("2026-11-22", "2026-11-22"), false);
});

test("v3.3 image: AVIF 为默认输出格式", async () => {
  const img = require(path.join(rootDir, "src/services/imageService.js"));
  assert.equal(img.DEFAULT_FORMAT, "avif");
  assert.equal(img.SUPPORTED_OUT[0], "avif");
});

test("v3.4 attachment: 裸 % 文件名不再抛 URI malformed", () => {
  const { extractAttachmentRefs } = require(path.join(rootDir, "src/services/attachmentService.js"));
  // 真实踩坑：文件名含裸 % 时 decodeURIComponent 抛 URI malformed，整个扫描崩溃
  const text = [
    "![](assets/100%完成.png)",
    "![](assets/50%25done.png)",
    "![](assets/a%20b.jpg)",
    "![[裸%号.png]]"
  ].join("\n");
  const refs = extractAttachmentRefs(text);   // 不应抛异常
  const targets = refs.map((r) => r.target).sort();
  assert.deepEqual(targets, ["100%完成.png", "50%done.png", "a b.jpg", "裸%号.png"]);
});

test("v3.4 graph: 建图 / 社区检测 / Markdown 渲染", () => {
  const { buildGraph, renderGraphMarkdown, detectCommunities, shortName } = require(path.join(rootDir, "src/services/graphService.js"));
  const mk = (p) => ({ path: p, basename: p.split("/").pop().replace(/\.md$/, "") });
  const files = [mk("a.md"), mk("b.md"), mk("c.md"), mk("d.md"), mk("isolated.md")];
  const resolved = {
    "a.md": { "b.md": 1, "c.md": 1 },
    "b.md": { "a.md": 1, "c.md": 1 },
    "c.md": { "a.md": 1, "b.md": 1, "d.md": 1 },
    "d.md": { "c.md": 1 }
  };
  const app = {
    vault: { getMarkdownFiles: () => files },
    metadataCache: { resolvedLinks: resolved }
  };
  const g = buildGraph(app, {});
  assert.equal(g.edgeCount, 4);            // a-b, a-c, b-c, c-d
  assert.equal(g.orphans.length, 1);
  assert.equal(g.orphans[0], "isolated.md");
  assert.equal(g.nodes[0], "c.md");        // 度最高
  assert.equal(g.degree.get("c.md"), 3);

  // 社区：a/b/c 应聚成一簇（d 挂在 c 上）
  const comms = detectCommunities(["a.md", "b.md", "c.md"], new Map([
    ["a.md", new Set(["b.md", "c.md"])],
    ["b.md", new Set(["a.md", "c.md"])],
    ["c.md", new Set(["a.md", "b.md"])]
  ]));
  assert.equal(comms.length, 1);
  assert.equal(comms[0].length, 3);

  const md = renderGraphMarkdown(app, g, { mermaidMax: 10 });
  assert.match(md, /```mermaid/);
  assert.match(md, /graph LR/);
  assert.match(md, /枢纽笔记/);
  assert.match(md, /孤立笔记/);
  assert.match(md, /isolated/);
});

test("v3.4 bases: 扫描 .duowei/.base 与模板合法性", () => {
  const base = require(path.join(rootDir, "src/services/baseService.js"));
  const f = (p, ext) => ({ path: p, extension: ext, basename: p.split("/").pop().replace(/\.[^.]+$/, "") });
  const app = {
    vault: {
      getFiles: () => [
        f("vault/工作台/a.duowei", "duowei"),
        f("vault/工作台/b.base", "base"),
        f("4-存档/old.duowei", "duowei"),
        f("notes/x.md", "md")
      ]
    }
  };
  const list = base.listBases(app);
  assert.equal(list.length, 2);            // 归档被排除、md 不算
  assert.deepEqual(list.map((x) => x.kind).sort(), ["Bases", "Duowei"]);
  const tpl = JSON.parse(base.duoweiTemplate("测试"));
  assert.equal(tpl.name, "测试");
  assert.ok(Array.isArray(tpl.fields) && tpl.fields.length >= 2);
  assert.deepEqual(tpl.rows, []);
});

test("v3.4 sharp: 相对 manifest.dir 必须拼成绝对路径再 require", () => {
  const img = require(path.join(rootDir, "src/services/imageService.js"));
  // 直接给相对目录：不应尝试 require（否则打包器会当相对模块解析并抛错）
  img.setPluginDir(".obsidian/plugins/obsidian-workbench");
  const info = img.engineInfo();
  assert.ok(["sharp", "canvas"].includes(info.engine));
  // 绝对目录：本地已装 sharp 时应能加载
  img.setPluginDir(rootDir);
  const info2 = img.engineInfo();
  if (info2.engine === "sharp") {
    assert.ok(info2.libvips);
  }
  assert.equal(typeof img.engineInfo().error, "string");
});

test("v3.4 codeRunner: JS 沙箱执行与错误捕获", () => {
  const { runJs } = require(path.join(rootDir, "src/services/codeRunner.js"));
  const ok = runJs("console.log('hello'); return 1 + 1;");
  assert.equal(ok.ok, true);
  assert.match(ok.output, /hello/);
  assert.match(ok.output, /2/);

  const bad = runJs("throw new Error('boom')");
  assert.equal(bad.ok, false);
  assert.match(bad.output, /boom/);

  // 不暴露 require/fetch
  const noReq = runJs("return typeof require");
  assert.match(noReq.output, /undefined/);
});

test("v3.5 pomodoro: tick 递减与完成回调", () => {
  const { PomodoroService } = require(path.join(rootDir, "src/services/pomodoroService.js"));
  const settings = { pomodoroWorkMinutes: 1, pomodoroBreakMinutes: 1, pomodoroStats: {} };
  let completed = null;
  const svc = new PomodoroService(() => settings, (p) => (completed = p));
  svc.startWork();
  assert.equal(svc.remainingSeconds, 60);
  assert.equal(svc.running, true);
  assert.equal(svc.formatRemaining(), "01:00");
  for (let i = 0; i < 59; i++) svc.tick();
  assert.equal(svc.formatRemaining(), "00:01");
  svc.tick();
  assert.equal(completed, "work");
  assert.equal(svc.running, false);
  const today = svc.getTodayStats();
  assert.equal(today.sessions, 1);
  assert.equal(today.minutes, 1);
});

test("v3.5 stats: 标签统计与附件聚合", () => {
  const { tagStats, attachmentStats, attachmentLocations } = require(path.join(rootDir, "src/services/statsService.js"));
  const app = {
    metadataCache: { getTags: () => ({ "#project": 5, "#笔记/生信": 3, "#project": 5 }) },
    vault: {
      getFiles: () => [
        { path: "a.png", extension: "png", stat: { size: 100 } },
        { path: "assets/b.pdf", extension: "pdf", stat: { size: 300 } },
        { path: "x.md", extension: "md", stat: { size: 10 } }
      ]
    }
  };
  const t = tagStats(app, { limit: 5 });
  assert.equal(t.list[0].tag, "project");
  assert.equal(t.list[0].count, 5);
  assert.ok(t.distinct >= 2);

  const exts = new Set(["png", "pdf"]);
  const a = attachmentStats(app, exts);
  assert.equal(a.count, 2);
  assert.equal(a.totalBytes, 400);
  const loc = attachmentLocations(app, exts);
  assert.equal(loc.inAssets.length, 1);
  assert.equal(loc.loose.length, 1);
});

test("v3.5 bases style: 片段包含关键选择器", () => {
  const { BASE_STYLE_CSS } = require(path.join(rootDir, "src/styles/basesStyle.js"));
  assert.match(BASE_STYLE_CSS, /\.mt-command-bar/);
  assert.match(BASE_STYLE_CSS, /\.mt-gallery-card/);
  assert.ok(BASE_STYLE_CSS.length > 300);
});

test("v3.5 preview: 扩展名分类与原生/OFV 选择", () => {
  const m = require(path.join(rootDir, "src/modals/attachmentPreviewModal.js"));
  assert.equal(m.kindOf("png"), "image");
  assert.equal(m.kindOf("pdf"), "pdf");
  assert.equal(m.kindOf("docx"), "office");
  assert.equal(m.kindOf("py"), "code");
  assert.equal(m.kindOf("weird"), "other");
  // 未安装 open-file-viewer 时不应抛错
  m.setPluginDir(rootDir);
  const ofv = m.loadOpenFileViewer();
  assert.ok(ofv === null || typeof ofv === "object");
});

test("v3.7 UI polish: 文案零 em-dash/en-dash + 动效 class 契约", () => {
  const fs2 = fs;
  const css = fs2.readFileSync(path.join(rootDir, "styles.css"), "utf8");
  const scan = (dir) => {
    let bad = [];
    const walk = (d) => {
      for (const e of fs2.readdirSync(d, { withFileTypes: true })) {
        const f = path.join(d, e.name);
        if (e.isDirectory()) walk(f);
        else if (e.name.endsWith(".js")) {
          const t = fs2.readFileSync(f, "utf8");
          // 只查字符串字面量行里的 em/en dash（排除注释与正则）
          for (const line of t.split("\n")) {
            const l = line.trim();
            if (l.startsWith("//") || l.startsWith("*") || l.startsWith("/*")) continue;
            if (l.includes("\u2014") || l.includes("\u2013")) bad.push(f.replace(rootDir, "") + ": " + l.slice(0, 60));
          }
        }
      }
    };
    walk(dir);
    return bad;
  };
  const bad = scan(path.join(rootDir, "src"));
  assert.deepEqual(bad, [], "UI 文案不应含 em-dash/en-dash");

  // 动效与无障碍规则存在
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /focus-visible/);
  assert.match(css, /@keyframes owb-rise/);
  assert.match(css, /\.owb-task-row\.done/);
  assert.match(css, /cursor: pointer/);
});

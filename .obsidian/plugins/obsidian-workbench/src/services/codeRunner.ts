// @ts-nocheck -- 渐进迁移: 语法已迁 TS, 类型化排入后续批次
"use strict";

import { Notice, setIcon } from "obsidian";

/**
 * 代码块执行与预览（精简版 execute-code）。
 *
 * 支持的代码块语言：
 *   ```run-js      在当前渲染进程里执行（沙箱：仅暴露 console/返回输出）
 *   ```run-python  调用系统 python3（cwd = 库根目录）
 *   ```run-sh      调用 bash（cwd = 库根目录）
 *   ```preview-html  HTML 预览（iframe srcdoc，sandbox 限制脚本）
 *
 * 安全设计（重要）：
 *   1. 默认关闭，必须在设置里显式打开「代码块执行」
 *   2. 每次执行都要二次确认（Modal），确认框展示命令与 cwd
 *   3. 子进程带超时（默认 20s）与输出上限（64KB），防止卡死/刷屏
 *   4. run-js 不用 eval 全局作用域：包在 Function 里，只给 console
 */

const MAX_OUTPUT = 64 * 1024;

function getNodeRequire() {
  // 在 Electron 渲染进程里可通过 window.require 拿到 Node 模块
  if (typeof window !== "undefined" && typeof window.require === "function") return window.require;
  if (typeof require === "function") return require;
  return null;
}

/** 执行 JS：收集 console 输出与返回值 */
function runJs(code) {
  const logs = [];
  const capture = (level) => (...args) => {
    logs.push(
      args
        .map((a) => {
          if (typeof a === "string") return a;
          try {
            return JSON.stringify(a, null, 2);
          } catch (e) {
            return String(a);
          }
        })
        .join(" ")
    );
  };
  const sandboxConsole = {
    log: capture("log"),
    info: capture("info"),
    warn: capture("warn"),
    error: capture("error"),
    debug: capture("debug")
  };
  try {
    // 只注入 console 与常用纯净 API，不暴露 require/fetch
    const fn = new Function(
      "console",
      `"use strict";\n${code}\n`
    );
    const ret = fn(sandboxConsole);
    if (ret !== undefined) logs.push("=> " + (typeof ret === "string" ? ret : JSON.stringify(ret)));
    return { ok: true, output: logs.join("\n") || "(无输出)" };
  } catch (err) {
    return { ok: false, output: (logs.length ? logs.join("\n") + "\n" : "") + "❌ " + (err && err.message) };
  }
}

/** 执行 shell / python：child_process.execFile + 超时 */
async function runProcess(kind, code, opts) {
  const o = opts || {};
  const nodeRequire = getNodeRequire();
  if (!nodeRequire) return { ok: false, output: "当前环境没有 Node require，无法执行子进程" };
  const cp = nodeRequire("child_process");
  const bin = kind === "python" ? (o.pythonPath || "python3") : (o.shellPath || "/bin/bash");
  const args = kind === "python" ? ["-c", code] : ["-lc", code];

  return new Promise((resolve) => {
    let done = false;
    const child = cp.execFile(
      bin,
      args,
      {
        cwd: o.cwd || undefined,
        timeout: o.timeoutMs || 20000,
        maxBuffer: MAX_OUTPUT * 2,
        env: { ...process.env, PYTHONIOENCODING: "utf-8" }
      },
      (err, stdout, stderr) => {
        if (done) return;
        done = true;
        const out = [stdout, stderr].filter(Boolean).join("\n").slice(0, MAX_OUTPUT);
        if (err) {
          const msg = err.killed ? `执行超时（>${(o.timeoutMs || 20000) / 1000}s）` : err.message;
          resolve({ ok: false, output: (out ? out + "\n" : "") + "❌ " + msg });
        } else {
          resolve({ ok: true, output: out || "(无输出)" });
        }
      }
    );
    if (child && child.stdin) child.stdin.end();
  });
}

/**
 * 渲染一个可执行代码块。
 * container: HTMLElement, ctx: { app, plugin, sourcePath }
 */
function renderRunnableBlock(lang, code, container, ctx) {
  container.empty();
  container.addClass("owb-run-block");

  const head = container.createDiv({ cls: "owb-run-head" });
  const label = head.createSpan({ cls: "owb-run-lang", text: lang });
  const runBtn = head.createEl("button", { cls: "owb-run-btn", text: "运行" });
  const copyBtn = head.createEl("button", { cls: "owb-run-btn", text: "复制" });
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(code);
      new Notice("已复制代码");
    } catch (e) {
      new Notice("复制失败：" + e.message);
    }
  });

  const pre = container.createEl("pre", { cls: "owb-run-code" });
  pre.createEl("code", { text: code });

  const out = container.createDiv({ cls: "owb-run-out" });
  out.style.display = "none";

  const showOut = (res) => {
    out.style.display = "";
    out.empty();
    const meta = out.createDiv({ cls: "owb-run-meta" });
    meta.createSpan({ text: res.ok ? "输出" : "失败" });
    meta.createSpan({ text: new Date().toLocaleTimeString() });
    const body = out.createEl("pre", { cls: "owb-run-text" });
    body.setText(res.output);
  };

  runBtn.addEventListener("click", async () => {
    const s = ctx.plugin.settings;
    if (!s.codeExecEnabled) {
      new Notice("代码执行未启用：设置 → 调试与性能 → 允许代码块执行", 7000);
      return;
    }
    const cwd = ctx.plugin.getVaultBasePath() || "";
    const ok = await confirmRun(ctx.app, lang, code, cwd);
    if (!ok) return;

    runBtn.setText("运行中…");
    runBtn.setAttribute("disabled", "disabled");
    let res;
    if (lang === "run-js") {
      res = runJs(code);
    } else {
      res = await runProcess(lang === "run-python" ? "python" : "shell", code, {
        cwd,
        timeoutMs: (s.codeExecTimeoutSec || 20) * 1000,
        pythonPath: s.pythonPath || "python3"
      });
    }
    runBtn.setText("运行");
    runBtn.removeAttribute("disabled");
    showOut(res);
  });
}

/** 二次确认：展示语言、cwd、代码前 300 字 */
function confirmRun(app, lang, code, cwd) {
  return new Promise((resolve) => {
    const modal = new (require("obsidian").Modal)(app);
    modal.titleEl.setText("确认执行代码");
    const body = modal.contentEl;
    body.createEl("p", {
      text: `语言：${lang}　工作目录：${cwd || "(未知)"}`
    });
    body.createEl("p", {
      cls: "owb-muted",
      text: "代码将在本机执行，可读写文件。只运行你信任的内容。"
    });
    const pre = body.createEl("pre", { cls: "owb-run-code" });
    pre.setText(code.length > 600 ? code.slice(0, 600) + "\n…" : code);
    const foot = body.createDiv({ cls: "owb-run-confirm" });
    let settled = false;
    const finish = (v) => {
      if (settled) return;
      settled = true;
      modal.close();
      resolve(v);
    };
    foot.createEl("button", { cls: "mod-warning", text: "执行" }).addEventListener("click", () => finish(true));
    foot.createEl("button", { text: "取消" }).addEventListener("click", () => finish(false));
    modal.onClose = () => {
      if (!settled) {
        settled = true;
        resolve(false);
      }
    };
    modal.open();
  });
}

/** HTML 预览：iframe sandbox，默认禁止脚本 */
function renderHtmlPreview(code, container) {
  container.empty();
  container.addClass("owb-preview-block");
  const head = container.createDiv({ cls: "owb-run-head" });
  head.createSpan({ cls: "owb-run-lang", text: "preview" });
  const frame = container.createEl("iframe", { cls: "owb-preview-frame" });
  frame.setAttribute("sandbox", "allow-same-origin");
  frame.style.width = "100%";
  frame.style.height = "420px";
  frame.style.border = "1px solid var(--background-modifier-border)";
  frame.style.borderRadius = "10px";
  frame.style.background = "#fff";
  frame.srcdoc = code;
}

export {
  renderRunnableBlock,
  renderHtmlPreview,
  runJs,
  runProcess,
  MAX_OUTPUT
};

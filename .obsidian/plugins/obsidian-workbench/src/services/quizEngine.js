"use strict";

const crypto = require("crypto");

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const QUESTION_SPLIT_RE = /^##\s+/m;
const OPTION_RE = /^-\s*\[([ xX])\]\s*([A-Za-z])[\.\)、\s]+(.+)$/;
const META_LINE_RE = /^>\s*(解析|标签|题型|Explain|Tags|Type)\s*[：:]\s*(.+)$/i;

function stableQuestionId(stem, options) {
  const sig = `${stem}|${Object.keys(options).sort().map((k) => `${k}:${options[k]}`).join("|")}`;
  return crypto.createHash("sha1").update(sig, "utf8").digest("hex").slice(0, 10);
}

/**
 * 解析 Obsidian Markdown 题库笔记，返回 { meta, questions }。
 */
function parseMarkdownQuiz(mdText, fallbackTitle = "知识自测") {
  const meta = {
    title: fallbackTitle,
    desc: "原生 SM-2 间隔重复自测引擎"
  };

  let body = mdText || "";
  const fm = body.match(FRONTMATTER_RE);
  if (fm) {
    for (const rawLine of fm[1].split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#") || !line.includes(":")) continue;
      const idx = line.indexOf(":");
      const k = line.slice(0, idx).trim();
      const v = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
      if (k === "title" && v) meta.title = v;
      if ((k === "desc" || k === "description") && v) meta.desc = v;
    }
    body = body.slice(fm[0].length);
  }

  const blocks = body.split(QUESTION_SPLIT_RE);
  const questions = [];

  for (let i = 1; i < blocks.length; i++) {
    const lines = blocks[i].trim().split(/\r?\n/);
    if (!lines.length) continue;
    const stem = lines[0].trim();
    const options = {};
    const answers = [];
    const explainParts = [];
    const tags = [];
    let explicitType = null;

    for (let j = 1; j < lines.length; j++) {
      const s = lines[j].trim();
      if (!s) continue;
      const om = s.match(OPTION_RE);
      if (om) {
        const key = om[2].toLowerCase();
        options[key] = om[3].trim();
        if (om[1].toLowerCase() === "x") answers.push(key);
        continue;
      }
      const mm = s.match(META_LINE_RE);
      if (mm) {
        const field = mm[1].toLowerCase();
        const val = mm[2].trim();
        if (field === "解析" || field === "explain") {
          explainParts.push(val);
        } else if (field === "标签" || field === "tags") {
          for (const t of val.split(/[,，\s]+/)) {
            if (t.trim()) tags.push(t.trim());
          }
        } else if (field === "题型" || field === "type") {
          explicitType = val.toLowerCase();
        }
      }
    }

    const optKeys = Object.keys(options);
    if (!optKeys.length || !answers.length) continue;

    let type = "single";
    if (explicitType === "single" || explicitType === "multi" || explicitType === "boolean") {
      type = explicitType;
    } else if (answers.length > 1) {
      type = "multi";
    } else if (optKeys.length === 2 && optKeys.includes("a") && optKeys.includes("b")) {
      type = "boolean";
    }

    questions.push({
      id: stableQuestionId(stem, options),
      type,
      stem,
      options,
      ansList: answers.slice().sort(),
      explain: explainParts.join(" "),
      tags
    });
  }

  return { meta, questions };
}

/**
 * SM-2 间隔重复状态更新（纯函数，便于测试与跨端持久化）。
 */
function updateMasterySM2(store, questionId, isCorrect, nowMs = Date.now()) {
  if (!store.mastery) store.mastery = {};
  const prev = store.mastery[questionId] || {
    seen: 0,
    wrong: 0,
    streak: 0,
    ease: 2.5,
    intervalDays: 0,
    dueAt: 0
  };
  const next = { ...prev, seen: prev.seen + 1 };
  if (isCorrect) {
    next.streak += 1;
    if (next.streak === 1) next.intervalDays = 1;
    else if (next.streak === 2) next.intervalDays = 3;
    else next.intervalDays = Math.max(1, Math.round(next.intervalDays * next.ease));
    next.ease = Math.min(3.0, Number((next.ease + 0.1).toFixed(2)));
    next.dueAt = nowMs + next.intervalDays * 86400000;
  } else {
    next.wrong += 1;
    next.streak = 0;
    next.intervalDays = 0;
    next.ease = Math.max(1.3, Number((next.ease - 0.2).toFixed(2)));
    next.dueAt = nowMs;
  }
  store.mastery[questionId] = next;
  return next;
}

function getDueOrWrongQuestions(questions, store, nowMs = Date.now()) {
  const mastery = (store && store.mastery) || {};
  return questions
    .filter((q) => {
      const m = mastery[q.id];
      return m && (m.streak === 0 || m.dueAt <= nowMs);
    })
    .sort((a, b) => {
      const ma = mastery[a.id] || { wrong: 0, dueAt: 0 };
      const mb = mastery[b.id] || { wrong: 0, dueAt: 0 };
      return mb.wrong - ma.wrong || ma.dueAt - mb.dueAt;
    });
}

function formatWrongCalloutMarkdown(title, wrongQuestions, dateStr) {
  const lines = [`> [!warning] ${title} · 错题复盘（${dateStr}）`];
  wrongQuestions.forEach((q, idx) => {
    const ansText = q.ansList.map((k) => `${k.toUpperCase()}. ${q.options[k] || ""}`).join("；");
    lines.push(`> ${idx + 1}. **${q.stem}**`);
    lines.push(`>    - 正确答案：${ansText}`);
    if (q.explain) lines.push(`>    - 解析：${q.explain}`);
  });
  return lines.join("\n") + "\n";
}

module.exports = {
  parseMarkdownQuiz,
  updateMasterySM2,
  getDueOrWrongQuestions,
  formatWrongCalloutMarkdown
};

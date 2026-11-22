"use strict";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatDate(date, pattern = "YYYY-MM-DD") {
  const d = date instanceof Date ? date : new Date(date);
  return pattern
    .replace("YYYY", String(d.getFullYear()))
    .replace("MM", pad2(d.getMonth() + 1))
    .replace("DD", pad2(d.getDate()))
    .replace("HH", pad2(d.getHours()))
    .replace("mm", pad2(d.getMinutes()))
    .replace("ss", pad2(d.getSeconds()));
}

function startOfTodayMs() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

function getGreeting(date = new Date()) {
  const h = date.getHours();
  if (h < 6) return "夜深了，注意休息";
  if (h < 12) return "早上好，开启专注的一天";
  if (h < 18) return "下午好，保持节奏";
  return "晚上好，适合复盘与沉淀";
}

function formatDuration(seconds) {
  const s = Math.max(1, Math.round(seconds));
  if (s < 60) return `${s} 秒`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return rem ? `${m} 分 ${rem} 秒` : `${m} 分`;
}

/**
 * 设置迁移：修掉历史 data.json 里与当前默认值冲突的旧字段。
 * 背景（2026-11-22 实测）：v3.0 的 dailyFolder 默认是 "diary"，写进了 data.json；
 * v3.1 把默认改成 "vault/日记"，但 deepMerge 让已保存的 "diary" 永远赢，
 * 于是「日记 · 连续 0 天 / 还没有日记」和「项目目录为空」——功能看着坏掉。
 *
 * 原则：只修正「能明确判定为旧默认值」的字段，用户手工改成别的值一律不动。
 */
function migrateSettings(settings) {
  const s = settings || {};
  const log = [];

  // 旧默认 "diary" → 真实日记目录
  if (s.dailyFolder === "diary" || s.dailyFolder === "") {
    s.dailyFolder = "vault/日记";
    log.push('dailyFolder: "diary" → "vault/日记"');
  }
  // 旧空值 → 真实项目目录
  if (!s.projectFolder) {
    s.projectFolder = "vault/项目";
    log.push('projectFolder: "" → "vault/项目"');
  }
  // 任务落盘路径
  if (!s.tasksPath) {
    s.tasksPath = "vault/任务.md";
    log.push('tasksPath → "vault/任务.md"');
  }
  // 隐私区
  if (!s.privacyFolder) {
    s.privacyFolder = "vault/隐私";
    log.push('privacyFolder → "vault/隐私"');
  }
  // 题库错题导出（旧默认落在 notes/ 根，会在根目录生成游离文件）
  if (s.quizWrongExportPath === "notes/错题复盘.md") {
    s.quizWrongExportPath = "notes/bio/生信学习/错题复盘.md";
    log.push("quizWrongExportPath → notes/bio/生信学习/");
  }
  s._migrationLog = log;
  return s;
}

function deepMergeDefaults(defaults, saved) {
  if (!saved || typeof saved !== "object") {
    return JSON.parse(JSON.stringify(defaults));
  }
  const out = Array.isArray(defaults) ? defaults.slice() : { ...defaults };
  for (const key of Object.keys(saved)) {
    const sv = saved[key];
    const dv = defaults[key];
    if (
      dv &&
      typeof dv === "object" &&
      !Array.isArray(dv) &&
      sv &&
      typeof sv === "object" &&
      !Array.isArray(sv)
    ) {
      out[key] = deepMergeDefaults(dv, sv);
    } else if (sv !== undefined) {
      out[key] = sv;
    }
  }
  return out;
}

/**
 * 将闪念内容插入 Markdown 文本：
 * - mode === "top" 时自动跳过顶部 YAML frontmatter，插在其下方（避免压扁 frontmatter 或顶走标题）
 * - mode === "bottom" 时追加到文末
 */
function insertCaptureLine(existingContent, line, mode = "top") {
  const cleanLine = String(line).replace(/\r?\n/g, " ").trim();
  if (!cleanLine) return existingContent;
  const content = existingContent || "";

  if (mode === "bottom") {
    const sep = content.endsWith("\n") || content.length === 0 ? "" : "\n";
    return `${content}${sep}${cleanLine}\n`;
  }

  const fmMatch = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  if (fmMatch) {
    const head = fmMatch[0];
    const rest = content.slice(head.length).replace(/^\r?\n+/, "");
    return `${head}\n${cleanLine}\n${rest}`;
  }
  return `${cleanLine}\n${content}`;
}

function shuffleArray(list) {
  const arr = list.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

module.exports = {
  migrateSettings,
  pad2,
  formatDate,
  startOfTodayMs,
  getGreeting,
  formatDuration,
  deepMergeDefaults,
  insertCaptureLine,
  shuffleArray
};

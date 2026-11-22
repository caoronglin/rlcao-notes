"use strict";

const { startOfTodayMs } = require("../utils");

const TASK_RE = /^(\s*[-*]\s*)\[([ xX])\]\s+(.+)$/;
const DUE_RE = /(?:📅|due::)\s*(\d{4}-\d{2}-\d{2})/;

/**
 * 原生 Vault 统计与聚合服务（完全不依赖 Dataview，直接读取 Obsidian MetadataCache 与 File Stat）。
 */
async function collectWorkbenchData(app, settings) {
  const files = app.vault.getMarkdownFiles();
  const todayMs = startOfTodayMs();
  const nowMs = Date.now();
  const dayMs = 86400000;
  const forgottenThresholdMs = nowMs - (settings.forgottenDays || 30) * dayMs;
  const sevenDaysAgoMs = nowMs - 7 * dayMs;

  const createdToday = [];
  const modifiedToday = [];
  const forgotten = [];
  const folderFocus = new Map();
  const pendingTasks = [];

  const projectPrefix = (settings.projectFolder || "").replace(/^\/+|\/+$/g, "");
  const todayIso = new Date().toISOString().slice(0, 10);

  for (const file of files) {
    const ctime = file.stat ? file.stat.ctime : 0;
    const mtime = file.stat ? file.stat.mtime : 0;
    const size = file.stat ? file.stat.size : 0;

    if (ctime >= todayMs) {
      createdToday.push({ file, time: ctime });
    }
    if (mtime >= todayMs) {
      modifiedToday.push({ file, time: mtime });
    }
    if (mtime > 0 && mtime <= forgottenThresholdMs && size >= 300) {
      const daysAgo = Math.floor((nowMs - mtime) / dayMs);
      forgotten.push({ file, daysAgo, mtime });
    }
    if (mtime >= sevenDaysAgoMs) {
      const topFolder = file.path.includes("/") ? file.path.split("/")[0] : "根目录";
      folderFocus.set(topFolder, (folderFocus.get(topFolder) || 0) + 1);
    }

    // 任务扫描：限定在 projectFolder（如为空则扫描全库，最多收集前 30 条保持流畅）
    if (pendingTasks.length < 30 && (!projectPrefix || file.path.startsWith(projectPrefix + "/"))) {
      const cache = app.metadataCache.getFileCache(file);
      const listItems = (cache && cache.listItems) || [];
      const hasOpenTask = listItems.some((item) => item.task === " ");
      if (hasOpenTask) {
        const content = await app.vault.cachedRead(file);
        const lines = content.split(/\r?\n/);
        for (const item of listItems) {
          if (item.task !== " ") continue;
          const lineIdx = item.position.start.line;
          const rawLine = lines[lineIdx] || "";
          const m = rawLine.match(TASK_RE);
          if (!m) continue;
          const text = m[3].trim();
          const dueMatch = text.match(DUE_RE);
          const dueDate = dueMatch ? dueMatch[1] : null;
          if (settings.onlyDueTasks && (!dueDate || dueDate > todayIso)) {
            continue;
          }
          pendingTasks.push({
            file,
            line: lineIdx,
            text,
            dueDate
          });
          if (pendingTasks.length >= 30) break;
        }
      }
    }
  }

  createdToday.sort((a, b) => b.time - a.time);
  modifiedToday.sort((a, b) => b.time - a.time);
  forgotten.sort((a, b) => a.mtime - b.mtime);

  const focusDistribution = [...folderFocus.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([folder, count]) => ({ folder, count }));

  return {
    totalNotes: files.length,
    createdToday: createdToday.slice(0, 10),
    modifiedToday: modifiedToday.slice(0, 10),
    forgotten: forgotten.slice(0, 8),
    focusDistribution,
    pendingTasks: pendingTasks.slice(0, 12)
  };
}

/**
 * 在工作台直接勾选完成某条任务（精准按行号替换 `- [ ]` -> `- [x]`）。
 */
async function toggleTaskInFile(app, file, lineIndex) {
  await app.vault.process(file, (content) => {
    const lines = content.split(/\r?\n/);
    if (lineIndex < 0 || lineIndex >= lines.length) return content;
    const m = lines[lineIndex].match(TASK_RE);
    if (!m) return content;
    const nextMark = m[2] === " " ? "x" : " ";
    lines[lineIndex] = `${m[1]}[${nextMark}] ${m[3]}`;
    return lines.join("\n");
  });
}

module.exports = {
  collectWorkbenchData,
  toggleTaskInFile
};

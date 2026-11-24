"use strict";

import type { App, TFile } from "obsidian";
import { startOfTodayMs } from "../utils";

const TASK_RE = /^(\s*[-*]\s*)\[([ xX])\]\s*(.+)$/;
const DUE_RE = /(?:📅|due::)\s*(\d{4}-\d{2}-\d{2})/;

export interface TaskEntry {
  file: TFile;
  line: number;
  text: string;
  dueDate: string | null;
}

export interface FileEntry {
  file: TFile;
  time: number;
}

export interface WorkbenchData {
  totalNotes: number;
  createdToday: FileEntry[];
  modifiedToday: FileEntry[];
  forgotten: Array<{ file: TFile; daysAgo: number; mtime: number }>;
  focusDistribution: Array<{ folder: string; count: number }>;
  pendingTasks: TaskEntry[];
}

export interface StatsSettings {
  projectFolder?: string;
  tasksPath?: string;
  dailyFolder?: string;
  forgottenDays?: number;
  onlyDueTasks?: boolean;
}

/**
 * 原生 Vault 统计与聚合服务（不依赖 Dataview，读 MetadataCache 与 File stat）。
 *
 * 2026-11-24 修复「今日行动」缺任务：扫描范围原来是「仅 projectFolder」，
 * 设置迁移后 projectFolder 从空变为 vault/项目，日记/任务清单里的待办全部消失。
 * 现在的范围 = projectFolder + tasksPath + 当日日记 + 归档区排除，
 * 排序 = 逾期优先 → 今日到期 → 最近编辑的文件优先。
 */
export async function collectWorkbenchData(app: App, settings: StatsSettings): Promise<WorkbenchData> {
  const files = app.vault.getMarkdownFiles();
  const todayMs = startOfTodayMs();
  const nowMs = Date.now();
  const dayMs = 86400000;
  const forgottenThresholdMs = nowMs - (settings.forgottenDays || 30) * dayMs;
  const sevenDaysAgoMs = nowMs - 7 * dayMs;

  const createdToday: FileEntry[] = [];
  const modifiedToday: FileEntry[] = [];
  const forgotten: Array<{ file: TFile; daysAgo: number; mtime: number }> = [];
  const folderFocus = new Map<string, number>();
  const pendingTasks: TaskEntry[] = [];

  const projectPrefix = (settings.projectFolder || "").replace(/^\/+|\/+$/g, "");
  const tasksPath = (settings.tasksPath || "").replace(/^\/+|\/+$/g, "");
  const todayIso = new Date().toISOString().slice(0, 10);
  const pad = (n: number) => String(n).padStart(2, "0");
  const d = new Date();
  const todayDaily = ((settings.dailyFolder || "").replace(/^\/+|\/+$/g, "")) +
    "/" + `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.md`;

  /** 任务来源：项目目录 / 任务清单 / 当日日记（三路都算，其他目录不扫保持流畅） */
  const isTaskSource = (path: string): boolean => {
    if (path.startsWith("4-存档/")) return false;
    if (projectPrefix && path.startsWith(projectPrefix + "/")) return true;
    if (tasksPath && path === tasksPath) return true;
    if (todayDaily && path === todayDaily) return true;
    if (path.startsWith("vault/目标/")) return true; // 目标模式的日任务并入今日行动
    if (!projectPrefix) return true; // 未配置项目目录时退回全库
    return false;
  };

  for (const file of files) {
    const ctime = file.stat ? file.stat.ctime : 0;
    const mtime = file.stat ? file.stat.mtime : 0;
    const size = file.stat ? file.stat.size : 0;

    if (ctime >= todayMs) createdToday.push({ file, time: ctime });
    if (mtime >= todayMs) modifiedToday.push({ file, time: mtime });
    if (mtime > 0 && mtime <= forgottenThresholdMs && size >= 300) {
      forgotten.push({ file, daysAgo: Math.floor((nowMs - mtime) / dayMs), mtime });
    }
    if (mtime >= sevenDaysAgoMs) {
      const topFolder = file.path.includes("/") ? file.path.split("/")[0] : "根目录";
      folderFocus.set(topFolder, (folderFocus.get(topFolder) || 0) + 1);
    }

    if (pendingTasks.length < 60 && isTaskSource(file.path)) {
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
          if (!text) continue;
          const dueMatch = text.match(DUE_RE);
          const dueDate = dueMatch ? dueMatch[1] : null;
          if (settings.onlyDueTasks && (!dueDate || dueDate > todayIso)) continue;
          pendingTasks.push({ file, line: lineIdx, text, dueDate });
          if (pendingTasks.length >= 60) break;
        }
      }
    }
  }

  // 排序：逾期 → 今日到期 → 无日期；同组内最近编辑的文件优先
  pendingTasks.sort((a, b) => {
    const rank = (t: TaskEntry): number => {
      if (t.dueDate && t.dueDate < todayIso) return 0;
      if (t.dueDate === todayIso) return 1;
      return 2;
    };
    const ra = rank(a);
    const rb = rank(b);
    if (ra !== rb) return ra - rb;
    const am = a.file.stat ? a.file.stat.mtime : 0;
    const bm = b.file.stat ? b.file.stat.mtime : 0;
    return bm - am;
  });

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
    pendingTasks: pendingTasks.slice(0, 14)
  };
}

/** 勾选/取消一行任务（原地改行，保持缩进）。 */
export async function toggleTaskInFile(app: App, file: TFile, line: number): Promise<void> {
  const content = await app.vault.read(file);
  const lines = content.split(/\r?\n/);
  const raw = lines[line];
  if (raw == null) throw new Error(`行 ${line + 1} 不存在（文件可能已被修改，请刷新）`);
  const m = raw.match(/^(\s*[-*]\s*)\[([ xX])\]/);
  if (!m) throw new Error("该行不是任务");
  const done = m[2] !== " ";
  lines[line] = raw.replace(/^(\s*[-*]\s*)\[([ xX])\]/, `$1[${done ? " " : "x"}]`);
  await app.vault.modify(file, lines.join("\n"));
}

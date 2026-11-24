"use strict";

import { formatDate } from "../utils";

/**
 * 热力日历数据服务：按天聚合笔记活动量。
 * 口径：新建(ctime 当天)计 1，更新(mtime 当天且与 ctime 不同天)计 1。
 * 排除：.obsidian/、.trash/、.trash-1000/、4-存档/（归档不算生产）、README.md。
 */

export interface HeatDay {
  key: string;
  date: Date;
  count: number;
  level: number;
  weekday: number;
  inFuture: boolean;
}

export interface HeatmapData {
  weeks: number;
  days: HeatDay[];
  grid: HeatDay[][];
  max: number;
  total: number;
  activeDays: number;
  streak: number;
  counts: Map<string, number>;
}

interface FileWithStat {
  path: string;
  name: string;
  stat?: { ctime?: number; mtime?: number } | null;
}

interface VaultFilesSource {
  getMarkdownFiles(): FileWithStat[];
}

export const EXCLUDE_PREFIXES: string[] = [".obsidian/", ".trash/", ".trash-1000/", "4-存档/"];
const EXCLUDE_NAMES = new Set<string>(["README.md"]);

export function dayKey(d: Date): string {
  return formatDate(d, "YYYY-MM-DD");
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d.getTime());
  x.setDate(x.getDate() + n);
  return x;
}

export function buildHeatmap(app: { vault: VaultFilesSource }, opts?: { weeks?: number }): HeatmapData {
  const o = opts || {};
  const weeks = o.weeks || 26;
  const counts = new Map<string, number>();

  let files: FileWithStat[] = [];
  try {
    files = app.vault.getMarkdownFiles();
  } catch (e) {
    files = [];
  }

  for (const f of files) {
    const p = f.path;
    if (EXCLUDE_PREFIXES.some((x) => p.startsWith(x))) continue;
    if (EXCLUDE_NAMES.has(f.name)) continue;
    const st = f.stat;
    if (!st) continue;
    const c = st.ctime ? dayKey(new Date(st.ctime)) : null;
    const m = st.mtime ? dayKey(new Date(st.mtime)) : null;
    if (c) counts.set(c, (counts.get(c) || 0) + 1);
    if (m && m !== c) counts.set(m, (counts.get(m) || 0) + 1);
  }

  const today = startOfDay(new Date());
  const todayWeekday = (today.getDay() + 6) % 7;
  const endOfWeek = addDays(today, 6 - todayWeekday);
  const start = addDays(endOfWeek, -(weeks * 7 - 1));

  const days: HeatDay[] = [];
  let max = 0;
  for (let i = 0; i < weeks * 7; i++) {
    const date = addDays(start, i);
    const key = dayKey(date);
    const count = counts.get(key) || 0;
    if (count > max) max = count;
    days.push({
      key,
      date,
      count,
      weekday: (date.getDay() + 6) % 7,
      inFuture: date.getTime() > today.getTime(),
      level: 0
    });
  }

  const step = Math.max(1, Math.ceil(max / 4));
  for (const d of days) {
    d.level = d.count === 0 ? 0 : Math.min(4, Math.ceil(d.count / step));
  }

  const grid: HeatDay[][] = [];
  for (let w = 0; w < weeks; w++) {
    grid.push(days.slice(w * 7, w * 7 + 7));
  }

  let streak = 0;
  let cursor = new Date(today.getTime());
  const todayCount = counts.get(dayKey(cursor)) || 0;
  if (todayCount === 0) cursor = addDays(cursor, -1);
  while ((counts.get(dayKey(cursor)) || 0) > 0) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  const total = days.reduce((s, d) => s + d.count, 0);
  const activeDays = days.filter((d) => d.count > 0).length;

  return { weeks, days, grid, max, total, activeDays, streak, counts };
}

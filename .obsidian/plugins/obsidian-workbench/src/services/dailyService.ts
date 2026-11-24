"use strict";

import { normalizePath, type App, type TFile, type TFolder } from "obsidian";
import { formatDate } from "../utils";

export interface DailySettings {
  dailyFolder?: string;
  dailyDateFormat?: string;
}

export interface DailyEntry {
  file: TFile;
  date: Date;
  key: string;
}

/**
 * 日记中心服务：按 dailyFolder + dailyDateFormat 定位日记文件，
 * 提供连续写作天数（streak）与历史列表。
 */

function dailyPathFor(settings: DailySettings, date: Date): string {
  const folder = (settings.dailyFolder || "").replace(/^\/+|\/+$/g, "");
  const name = formatDate(date, settings.dailyDateFormat || "YYYY-MM-DD");
  return normalizePath(folder ? `${folder}/${name}.md` : `${name}.md`);
}

/**
 * 列出日记文件（按文件名日期降序）。
 * 只匹配能被 dailyDateFormat 模板生成的 YYYY-MM-DD 风格文件名。
 */
async function listDailies(app: App, settings: DailySettings): Promise<DailyEntry[]> {
  const folder = (settings.dailyFolder || "").replace(/^\/+|\/+$/g, "");
  if (!folder) return [];
  const abs = app.vault.getAbstractFileByPath(normalizePath(folder));
  if (!abs || !(abs as TFolder).children) return [];
  const out: DailyEntry[] = [];
  for (const child of (abs as TFolder).children) {
    const f = child as TFile;
    if (f.extension !== "md") continue;
    const m = f.basename.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) continue;
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    if (Number.isNaN(d.getTime())) continue;
    out.push({ file: f, date: d, key: f.basename });
  }
  out.sort((a: DailyEntry, b: DailyEntry) => (a.key < b.key ? 1 : -1));
  return out;
}

/**
 * 连续写作天数：从今天往回数；今天还没写则从昨天起算（显示 "昨天止 N 天"）。
 */
function computeStreak(dailies: DailyEntry[], now: Date): { streak: number; includesToday: boolean } {
  const keys = new Set(dailies.map((d) => d.key));
  const fmt = (d: Date) => formatDate(d, "YYYY-MM-DD");
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayKey = fmt(cursor);
  if (!keys.has(todayKey)) cursor.setDate(cursor.getDate() - 1); // 今天未写不打破连击
  let streak = 0;
  while (keys.has(fmt(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { streak, includesToday: keys.has(todayKey) };
}

async function openDaily(app: App, settings: DailySettings, offsetDays: number): Promise<TFile> {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offsetDays);
  const targetPath = dailyPathFor(settings, target);
  const folder = (settings.dailyFolder || "").replace(/^\/+|\/+$/g, "");
  const existingAbs = app.vault.getAbstractFileByPath(targetPath);
  let file: TFile | null = existingAbs && (existingAbs as TFile).extension === "md" ? (existingAbs as TFile) : null;
  if (!file) {
    if (folder && !app.vault.getAbstractFileByPath(normalizePath(folder))) {
      await app.vault.createFolder(normalizePath(folder));
    }
    const label = formatDate(target, "YYYY-MM-DD");
    const initial =
      "---\ntags: [periodic/daily]\ncreated: " +
      label +
      "\n---\n\n# " +
      label +
      "\n\n## 🎯 今日重点\n- [ ] \n\n## 📝 记录\n";
    file = await app.vault.create(targetPath, initial);
  }
  await app.workspace.getLeaf(false).openFile(file);
  return file;
}

export {
  dailyPathFor,
  listDailies,
  computeStreak,
  openDaily
};

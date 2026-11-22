"use strict";

const { formatDate } = require("../utils");

/**
 * 热力日历数据服务：按天聚合笔记活动量。
 *
 * 数据源：vault.getMarkdownFiles() 的 stat.ctime / stat.mtime。
 * 口径（写清楚，避免"看起来热闹但没意义"）：
 *   - 新建（ctime 落在当天）计 1
 *   - 更新（mtime 落在当天且与 ctime 不同天）计 1
 *   同一天既建又改只计 1（避免自己刷自己）
 * 排除：.obsidian/、.trash/、4-存档/（归档不算生产）、模板目录
 */

const EXCLUDE_PREFIXES = [".obsidian/", ".trash/", "4-存档/"];
const EXCLUDE_NAMES = new Set(["README.md"]);

function dayKey(d) {
  return formatDate(d, "YYYY-MM-DD");
}

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d, n) {
  const x = new Date(d.getTime());
  x.setDate(x.getDate() + n);
  return x;
}

/**
 * 构建最近 weeks 周（含本周）的贡献图数据。
 * 返回 {
 *   weeks: 13|26|52,
 *   days: [{ key, date, count, level, weekday, inFuture }],
 *   grid: [[cell|null × 7] × weeks],   // 按列（周）× 行（周几）
 *   max, total, activeDays, streak
 * }
 */
function buildHeatmap(app, opts) {
  const o = opts || {};
  const weeks = o.weeks || 26;
  const counts = new Map();

  let files = [];
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

  // 网格对齐：最后一列是本周（周一起）
  const today = startOfDay(new Date());
  const todayWeekday = (today.getDay() + 6) % 7; // 周一=0
  const endOfWeek = addDays(today, 6 - todayWeekday);
  const start = addDays(endOfWeek, -(weeks * 7 - 1));

  const days = [];
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
      inFuture: date.getTime() > today.getTime()
    });
  }

  // 分级：0 无活动，1-4 四级（按 max 的 25% 分档，至少 1）
  const step = Math.max(1, Math.ceil(max / 4));
  for (const d of days) {
    d.level = d.count === 0 ? 0 : Math.min(4, Math.ceil(d.count / step));
  }

  const grid = [];
  for (let w = 0; w < weeks; w++) {
    grid.push(days.slice(w * 7, w * 7 + 7));
  }

  // 当前连续活跃天数（今天没活动则从昨天起算，与日记 streak 口径一致）
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

module.exports = { buildHeatmap, dayKey, EXCLUDE_PREFIXES };

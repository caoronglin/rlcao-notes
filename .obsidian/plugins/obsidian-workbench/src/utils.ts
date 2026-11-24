"use strict";

/** 日期格式化：支持 YYYY / MM / DD / HH / mm / ss 的极简实现（不引外部库）。 */
export function formatDate(date: Date, fmt: string): string {
  const pad = (n: number, width = 2): string => String(n).padStart(width, "0");
  return fmt
    .replace(/YYYY/g, String(date.getFullYear()))
    .replace(/MM/g, pad(date.getMonth() + 1))
    .replace(/DD/g, pad(date.getDate()))
    .replace(/HH/g, pad(date.getHours()))
    .replace(/mm/g, pad(date.getMinutes()))
    .replace(/ss/g, pad(date.getSeconds()));
}

export function pad2(n: number): string {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}

/** 按时段问候（供工作台 Hero 与状态栏共用）。 */
export function getGreeting(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 6) return "夜深了，注意休息";
  if (h < 12) return "早上好，开启专注的一天";
  if (h < 18) return "下午好，保持节奏";
  return "晚上好，适合复盘与沉淀";
}

/** 当天零点的时间戳（毫秒），供 vaultStats 判断「今日」。 */
export function startOfTodayMs(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

/** Fisher-Yates 洗牌，返回新数组（不改变入参）。 */
export function shuffleArray<T>(list: readonly T[]): T[] {
  const arr = list.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function formatDuration(seconds: number): string {
  const s = Math.max(1, Math.round(seconds));
  if (s < 60) return `${s} 秒`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return rem ? `${m} 分 ${rem} 秒` : `${m} 分`;
}

/** 设置迁移：修掉历史 data.json 里与当前默认值冲突的旧字段。 */
export interface MigrationLoggable {
  dailyFolder?: string;
  projectFolder?: string;
  tasksPath?: string;
  privacyFolder?: string;
  quizWrongExportPath?: string;
  [key: string]: unknown;
}

export function migrateSettings(settings: MigrationLoggable): MigrationLoggable {
  const s = settings || ({} as MigrationLoggable);
  const log: string[] = [];

  if (s.dailyFolder === "diary" || s.dailyFolder === "") {
    s.dailyFolder = "vault/日记";
    log.push('dailyFolder: "diary" → "vault/日记"');
  }
  if (!s.projectFolder) {
    s.projectFolder = "vault/项目";
    log.push('projectFolder: "" → "vault/项目"');
  }
  if (!s.tasksPath) {
    s.tasksPath = "vault/任务.md";
    log.push('tasksPath → "vault/任务.md"');
  }
  if (!s.privacyFolder) {
    s.privacyFolder = "vault/隐私";
    log.push('privacyFolder → "vault/隐私"');
  }
  if (s.quizWrongExportPath === "notes/错题复盘.md") {
    s.quizWrongExportPath = "notes/bio/生信学习/错题复盘.md";
    log.push("quizWrongExportPath → notes/bio/生信学习/");
  }
  (s as Record<string, unknown>)._migrationLog = log;
  return s;
}

type UnknownRecord = Record<string, unknown>;

/**
 * 深合并默认值：嵌套对象递归合并，标量与数组以 saved 优先。
 * 与 migrateSettings 配合：先合并默认，再迁移历史值。
 */
export function deepMergeDefaults(defaults: UnknownRecord, saved: UnknownRecord | null | undefined): UnknownRecord {
  if (!saved || typeof saved !== "object") {
    return JSON.parse(JSON.stringify(defaults)) as UnknownRecord;
  }
  const out: UnknownRecord = Array.isArray(defaults) ? (defaults.slice() as unknown as UnknownRecord) : { ...defaults };
  for (const key of Object.keys(saved)) {
    const sv = (saved as UnknownRecord)[key];
    const dv = (defaults as UnknownRecord)[key];
    if (
      dv && typeof dv === "object" && !Array.isArray(dv) &&
      sv && typeof sv === "object" && !Array.isArray(sv)
    ) {
      out[key] = deepMergeDefaults(dv as UnknownRecord, sv as UnknownRecord);
    } else if (sv !== undefined) {
      out[key] = sv;
    }
  }
  return out;
}

/**
 * 快速闪念插入（逐字节复刻 v3.0 行为，勿凭记忆改写）：
 * - 清洗换行、trim
 * - bottom：文末追加（保证一个换行结尾）
 * - top：frontmatter 后插空行 + 新行，原有正文保留
 */
export function insertCaptureLine(existingContent: string, line: string, mode: string = "top"): string {
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

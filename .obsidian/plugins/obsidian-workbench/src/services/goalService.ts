"use strict";

import type { App, TFile } from "obsidian";
import { normalizePath, Notice } from "obsidian";
import { formatDate } from "../utils";

/**
 * 目标模式服务：年目标 = 月目标 = 周目标 = 日任务，单文件层级存储。
 *
 * 文件：vault/目标/<YYYY>.md
 * 结构（原生 md + checkbox，与今日行动/任务中心同源）：
 *   ## 🎯 年度目标      (- [ ] G1 …)
 *   ### 📆 月度拆解
 *   #### <YYYY-MM>     (- [ ] M1 … → G1)
 *   ##### 周任务
 *   ###### W<iso周> (… → M1)
 *   ###### 📅 日任务   (- [ ] … → W1)
 *
 * 拆解引擎：
 *   - 决策模型（Jev choice）判定领域与优先级 —— 有明确选项的判定
 *   - LLM（aiService，OpenAI 兼容）生成拆解文本 —— 生成性任务
 *   两者产出先落入「AI 草稿」小节，用户确认后合入，不静默改正文。
 */

export interface GoalTask {
  line: number;
  text: string;
  ref: string | null; // → G1 / → M1 链
  done: boolean;
}

export interface MonthBlock {
  key: string; // 2026-12
  tasks: GoalTask[];
}

export interface WeekBlock {
  key: string; // W48 (11-24 ~ 11-30)
  tasks: GoalTask[];
}

export interface GoalTree {
  file: TFile;
  year: number;
  yearGoals: GoalTask[];
  months: MonthBlock[];
  weeks: WeekBlock[];
  dayTasks: GoalTask[];
  draft: string[]; // AI 草稿行
}

export function goalFilePath(year: number): string {
  return normalizePath(`vault/目标/${year}.md`);
}

export function goalTemplate(year: number): string {
  const now = new Date();
  const jan1 = new Date(year, 0, 1);
  const dec31 = new Date(year, 11, 31);
  const iso = (d: Date) => formatDate(d, "YYYY-MM-DD");
  return [
    "---",
    "type: goal",
    `title: ${year} 年目标`,
    "tags: [goal/year]",
    `created: ${formatDate(now, "YYYY-MM-DD")}`,
    "---",
    "",
    `# ${year} 年目标`,
    "",
    "## 🎯 年度目标",
    "- [ ] G1 ",
    "- [ ] G2 ",
    "",
    "### 📆 月度拆解",
    `#### ${year}-${String(now.getMonth() + 1).padStart(2, "0")}`,
    "- [ ] M1 （关联 → G1）",
    "",
    "##### 周任务",
    "###### W" + isoWeek(now) + " (" + formatDate(monday(now), "MM-DD") + " ~ " + formatDate(sunday(now), "MM-DD") + ")",
    "- [ ] W1 （关联 → M1）",
    "",
    "###### 📅 日任务",
    `- [ ] ${formatDate(now, "YYYY-MM-DD")}：`,
    "- [ ] （关联 → W1）",
    "",
    "---",
    "",
    "## 🤖 AI 草稿（由决策模型+LLM 生成，确认后手动合入对应层级）",
    ""
  ].join("\n");
}

export function isoWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function monday(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}

export function sunday(d: Date): Date {
  const x = monday(d);
  x.setDate(x.getDate() + 6);
  return x;
}

/** 打开或创建某年目标文件。 */
export async function ensureGoalFile(app: App, year: number): Promise<TFile> {
  const path = goalFilePath(year);
  let f = app.vault.getAbstractFileByPath(path);
  if (f && (f as TFile).extension === "md") return f as TFile;
  const folder = path.slice(0, path.lastIndexOf("/"));
  if (!app.vault.getAbstractFileByPath(normalizePath(folder))) {
    await app.vault.createFolder(normalizePath(folder));
  }
  const file = await app.vault.create(path, goalTemplate(year));
  new Notice(`已创建 ${year} 年目标文件`);
  return file;
}

const TASK_LINE = /^(\s*[-*]\s*)\[([ xX])\]\s*(.+)$/;

/** 解析目标文件为四层树。 */
export function parseGoalContent(content: string): Omit<GoalTree, "file" | "year"> {
  const lines = content.split(/\r?\n/);
  const yearGoals: GoalTask[] = [];
  const months: MonthBlock[] = [];
  const weeks: WeekBlock[] = [];
  const dayTasks: GoalTask[] = [];
  const draft: string[] = [];

  let section: "year" | "month" | "week" | "day" | "draft" | "none" = "none";
  let inDraft = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const text = h[2].trim();
      if (text.includes("年度目标")) { section = "year"; inDraft = false; continue; }
      if (text.includes("月度拆解")) { section = "month"; inDraft = false; continue; }
      if (/周任务/.test(text) && !/年度|月度/.test(text)) { section = "week"; inDraft = false; continue; }
      if (/日任务/.test(text) && !/年度|月度|周/.test(text)) { section = "day"; inDraft = false; continue; }
      if (text.includes("AI 草稿")) { inDraft = true; section = "draft"; continue; }
      if (inDraft) { section = "draft"; continue; }
      // 月小节 #### 2026-12 或 周小节 ###### W48 (…)
      if (/^\d{4}-\d{2}$/.test(text)) { section = "month"; months.push({ key: text, tasks: [] }); continue; }
      if (/^W\d+/.test(text) && section === "week") { weeks.push({ key: text, tasks: [] }); continue; }
      continue;
    }
    const m = line.match(TASK_LINE);
    if (!m) continue;
    const task: GoalTask = {
      line: i,
      text: m[3].replace(/（?关联\s*→\s*([A-Z]\d+)）?/, "").trim(),
      ref: (m[3].match(/→\s*([A-Z]\d+)/) || [null, null])[1],
      done: m[2] !== " "
    };
    if (inDraft) { draft.push(line); continue; }
    if (section === "year") yearGoals.push(task);
    else if (section === "month" && months.length) months[months.length - 1].tasks.push(task);
    else if (section === "week" && weeks.length) weeks[weeks.length - 1].tasks.push(task);
    else if (section === "day") dayTasks.push(task);
  }

  return { yearGoals, months, weeks, dayTasks, draft };
}

export async function loadGoalTree(app: App, year: number): Promise<GoalTree | null> {
  const f = app.vault.getAbstractFileByPath(goalFilePath(year));
  if (!f || (f as TFile).extension !== "md") return null;
  const content = await app.vault.read(f as TFile);
  return { file: f as TFile, year, ...parseGoalContent(content) };
}

export function goalProgress(tree: GoalTree): {
  yearDone: number; yearTotal: number;
  monthDone: number; monthTotal: number;
  weekDone: number; weekTotal: number;
  dayDone: number; dayTotal: number;
} {
  const count = (list: GoalTask[]) => ({ done: list.filter((t) => t.done).length, total: list.length });
  const y = count(tree.yearGoals);
  const allMonths = tree.months.flatMap((m) => m.tasks);
  const mo = count(allMonths);
  const wk = count(tree.weeks.flatMap((w) => w.tasks));
  const dy = count(tree.dayTasks);
  return {
    yearDone: y.done, yearTotal: y.total,
    monthDone: mo.done, monthTotal: mo.total,
    weekDone: wk.done, weekTotal: wk.total,
    dayDone: dy.done, dayTotal: dy.total
  };
}

/**
 * 决策模型 + LLM 拆解：把一段目标文本拆成 level 层级的草案。
 * 返回写入「AI 草稿」小节的文本行；不静默改正文。
 */
export async function aiBreakdown(
  decide: (state: Record<string, unknown>, questions: Record<string, unknown>) => Promise<{ answers: Record<string, { value: unknown; confidence: number | null }> }>,
  chat: (messages: Array<{ role: string; content: string }>) => Promise<string>,
  goalText: string,
  level: "month" | "week" | "day"
): Promise<{ lines: string[]; domain: string; priority: string; confidence: number | null }> {
  // 1) 决策模型：领域 + 优先级（有明确选项的判定交给 Jev）
  let domain = "project";
  let priority = "P1";
  let confidence: number | null = null;
  try {
    const res = await decide(
      { message: goalText },
      {
        domain: {
          type: "choice",
          instructions: "这个目标属于哪个领域？",
          criteria: { study: "课程与学习", project: "项目与实验交付", research: "文献与科研探索", life: "生活与健康" }
        },
        priority: {
          type: "choice",
          instructions: "按截止临近与影响面判断优先级",
          criteria: { P0: "有外部截止或阻塞他人", P1: "重要但不紧急", P2: "可延后" }
        }
      }
    );
    const d = res.answers.domain;
    const p = res.answers.priority;
    if (d && typeof d.value === "string") domain = d.value;
    if (p && typeof p.value === "string") priority = p.value;
    confidence = d ? d.confidence : null;
  } catch (e) {
    // 决策模型不可用（未绑卡/离线）→ 默认值继续，不阻塞 LLM 拆解
  }

  // 2) LLM 生成拆解草案
  const n = level === "month" ? 3 : level === "week" ? 4 : 5;
  const prompt = [
    `目标：${goalText}`,
    `请把它拆解成 ${n} 条${level === "month" ? "月度目标" : level === "week" ? "本周可执行任务" : "今天可完成的日任务"}。`,
    "要求：每条一行、动词开头、可勾选完成；不要编号；直接输出列表本身，不要前后说明。",
    level === "day" ? "每条 30 分钟内可完成。" : level === "week" ? "每条 1-3 小时规模。" : "每条是一个月内可验收的里程碑。"
  ].join("\n");
  let raw = "";
  try {
    raw = await chat([{ role: "user", content: prompt }]);
  } catch (e) {
    throw new Error("LLM 拆解失败：" + String((e as Error)?.message || e));
  }

  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.replace(/^[-*\d.\s]+/, "").trim())
    .filter((l) => l.length >= 4)
    .slice(0, n)
    .map((l) => `- [ ] ${l}（${level === "month" ? "月" : level === "week" ? "周" : "日"} · ${domain}/${priority}）`);

  if (!lines.length) throw new Error("LLM 未返回可用的任务行");
  return { lines, domain, priority, confidence };
}

/** 把草案追加进 AI 草稿小节。 */
export async function appendDraft(app: App, tree: GoalTree, lines: string[]): Promise<void> {
  const content = await app.vault.read(tree.file);
  const stamp = formatDate(new Date(), "YYYY-MM-DD HH:mm");
  const block = ["", `### ${stamp} 拆解草案（确认后合入对应层级，或直接在草稿区勾选执行）`, ...lines].join("\n");
  const marker = "## 🤖 AI 草稿";
  if (content.includes(marker)) {
    await app.vault.modify(tree.file, content + block + "\n");
  } else {
    await app.vault.modify(tree.file, content + "\n---\n\n" + marker + "（由决策模型+LLM 生成，确认后手动合入对应层级）\n" + block + "\n");
  }
}

"use strict";

import type { App, TFile } from "obsidian";
import { Notice } from "obsidian";
import { formatDate } from "../utils";

/**
 * 自动格式化服务：frontmatter 规范化 + 决策模型打标签。
 *
 * 只做加法不做减法（保留用户已有字段），改动逐条 Notice 呈现：
 *   1. title 缺失 → 取 H1 或文件名
 *   2. created 缺失 → 文件 ctime
 *   3. updated → 每次格式化刷新
 *   4. tags 缺失且笔记有正文 → 决策模型判定领域，补 `领域/<domain>`
 *
 * 不自动改正文排版（标题跳级、空行规整只报告不修改，避免破坏用户手写格式）。
 */

export interface FormatResult {
  changed: boolean;
  additions: string[];
  domain: string | null;
  confidence: number | null;
}

interface FrontmatterPatch {
  title?: string;
  created?: string;
  updated?: string;
  tags?: string[];
}

function splitFrontmatter(content: string): { fm: string | null; body: string } {
  if (!content.startsWith("---")) return { fm: null, body: content };
  const end = content.indexOf("\n---", 3);
  if (end < 0) return { fm: null, body: content };
  return { fm: content.slice(4, end), body: content.slice(end + 4) };
}

function parseFmKeys(fm: string): Set<string> {
  const keys = new Set<string>();
  for (const line of fm.split("\n")) {
    const m = line.match(/^([A-Za-z_][\w-]*):/);
    if (m) keys.add(m[1]);
  }
  return keys;
}

function renderFmLine(key: string, value: string | string[]): string {
  if (Array.isArray(value)) return `${key}: [${value.join(", ")}]`;
  const needsQuote = /[:#\[\]{}&*!|>%@`,"']/.test(value) || value.startsWith(" ") || value.endsWith(" ");
  return `${key}: ${needsQuote ? JSON.stringify(value) : value}`;
}

/**
 * 决策模型打标签：把笔记正文摘要交给 decide()，判定领域标签。
 */
async function classifyDomain(
  decide: (state: Record<string, unknown>, questions: Record<string, unknown>) => Promise<{ answers: Record<string, { value: unknown; confidence: number | null }> }>,
  text: string
): Promise<{ domain: string | null; confidence: number | null }> {
  try {
    const res = await decide(
      { message: text.slice(0, 3000) },
      {
        domain: {
          type: "choice",
          instructions: "这篇笔记属于哪个知识领域？只依据内容判断，犹豫时选 inbox。",
          criteria: {
            study: "课程学习与知识整理",
            project: "某个具体项目或实验的一部分",
            research: "文献阅读与科研探索",
            tooling: "环境配置与工具链",
            life: "生活事务",
            inbox: "信息混杂或内容过短"
          }
        }
      }
    );
    const a = res.answers.domain;
    if (!a || typeof a.value !== "string") return { domain: null, confidence: null };
    return { domain: a.value, confidence: a.confidence ?? null };
  } catch (e) {
    return { domain: null, confidence: null };
  }
}

export async function formatNote(
  app: App,
  file: TFile,
  opts: {
    decide?: (state: Record<string, unknown>, questions: Record<string, unknown>) => Promise<{ answers: Record<string, { value: unknown; confidence: number | null }> }>;
    updateTimestamp?: boolean;
  }
): Promise<FormatResult> {
  const content = await app.vault.read(file);
  const { fm, body } = splitFrontmatter(content);
  const patch: FormatResult = { changed: false, additions: [], domain: null, confidence: null };
  const today = formatDate(new Date(), "YYYY-MM-DD");
  const keys = fm ? parseFmKeys(fm) : new Set<string>();

  const h1 = (body.match(/^#\s+(.+)$/m) || [null, null])[1];
  const titleVal = (h1 || file.basename).trim();
  const ctime = file.stat && file.stat.ctime ? formatDate(new Date(file.stat.ctime), "YYYY-MM-DD") : today;

  const addLines: string[] = [];

  if (!keys.has("title")) {
    addLines.push(renderFmLine("title", titleVal));
    patch.additions.push(`title: ${titleVal}`);
  }
  if (!keys.has("created")) {
    addLines.push(renderFmLine("created", ctime));
    patch.additions.push(`created: ${ctime}`);
  }
  if (opts.updateTimestamp !== false) {
    addLines.push(renderFmLine("updated", today));
    if (keys.has("updated")) patch.additions.push(`updated → ${today}`);
  }

  // tags：缺失且有正文时走决策模型
  let tagsLine: string | null = null;
  if (!keys.has("tags") && body.trim().length >= 40 && opts.decide) {
    const cls = await classifyDomain(opts.decide, body);
    patch.domain = cls.domain;
    patch.confidence = cls.confidence;
    if (cls.domain && cls.domain !== "inbox") {
      tagsLine = renderFmLine("tags", [`领域/${cls.domain}`]);
      patch.additions.push(`tags: [领域/${cls.domain}]（决策模型置信度 ${cls.confidence !== null ? Math.round((cls.confidence || 0) * 100) + "%" : "n/a"}）`);
    }
  }

  if (!addLines.length && !tagsLine) return patch;

  // 组装
  let next: string;
  if (fm === null) {
    const fmBlock = ["---", ...addLines, tagsLine, "---"].filter(Boolean).join("\n");
    next = fmBlock + "\n\n" + content;
  } else {
    const lines = fm.split("\n");
    let inserted = 0;
    if (keys.has("updated")) {
      const out: string[] = [];
      for (const line of lines) {
        if (line.match(/^updated:/)) out.push(renderFmLine("updated", today));
        else out.push(line);
      }
      lines.splice(0, lines.length, ...out);
    } else {
      lines.push(renderFmLine("updated", today));
      inserted++;
    }
    for (const l of addLines) {
      if (l.startsWith("updated:")) continue;
      lines.push(l);
    }
    if (tagsLine) lines.push(tagsLine);
    next = "---\n" + lines.join("\n") + "\n---" + body;
  }

  await app.vault.modify(file, next);
  patch.changed = true;
  return patch;
}

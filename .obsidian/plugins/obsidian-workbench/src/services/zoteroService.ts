"use strict";

import { requestUrl, type App, type TFile } from "obsidian";
import { normalizePath, Notice } from "obsidian";
import { formatDate } from "../utils";

/**
 * Zotero 官方 Web API v3（https://www.zotero.org/support/dev/web_api/v3/basics）
 *
 * 认证：Header `Zotero-API-Key`（在 zotero.org/settings/keys 创建只读 key）
 * 端点：https://api.zotero.org/{users|groups}/<id>/items
 * 分页：?start=&limit=（limit ≤ 100），Total-Results 响应头给总数
 * 格式：format=json（Zotero JSON），export 端点支持 format=bibtex
 *
 * 与 obsidian-zotero-desktop-connector 并存：那个走桌面客户端 connector，
 * 本服务走云 API，桌面没开也能用。
 */

export interface ZoteroSettings {
  zoteroApiKey?: string;
  zoteroUserId?: string;
  zoteroLibraryType?: string; // "user" | "group"
}

export interface ZoteroCreator {
  creatorType?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

export interface ZoteroItem {
  key: string;
  version?: number;
  itemType?: string;
  title?: string;
  creators?: ZoteroCreator[];
  date?: string;
  abstractNote?: string;
  publicationTitle?: string;
  DOI?: string;
  url?: string;
  tags?: Array<{ tag?: string }>;
  raw?: Record<string, unknown>;
}

export interface ZoteroSearchResult {
  items: ZoteroItem[];
  total: number;
}

const API_BASE = "https://api.zotero.org";
const PAGE = 50;

/** 库前缀：/users/12345 或 /groups/12345 */
export function libraryPrefix(settings: ZoteroSettings): string {
  const type = settings.zoteroLibraryType === "group" ? "groups" : "users";
  const id = String(settings.zoteroUserId || "").trim();
  return `/${type}/${id}`;
}

export function isConfigured(settings: ZoteroSettings): boolean {
  return Boolean(String(settings.zoteroApiKey || "").trim() && String(settings.zoteroUserId || "").trim());
}

export type ZoteroFetcher = (
  path: string,
  params: Record<string, string | number>,
  settings: ZoteroSettings
) => Promise<{ status: number; text: string; headers: Record<string, string> }>;

/** 默认实现：Obsidian requestUrl（绕 CORS），带 Zotero-API-Key。 */
export function defaultFetcher(): ZoteroFetcher {
  return async (path, params, settings) => {
    const qs = Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join("&");
    const url = `${API_BASE}${path}${qs ? "?" + qs : ""}`;
    const res = await requestUrl({
      url,
      method: "GET",
      headers: {
        "Zotero-API-Key": String(settings.zoteroApiKey || ""),
        "Content-Type": "application/json"
      }
    });
    return {
      status: res.status,
      text: res.text,
      headers: (res.headers as Record<string, string>) || {}
    };
  };
}

/** 单页条目解析：Zotero JSON → 精简 ZoteroItem */
export function parseItems(jsonText: string): ZoteroItem[] {
  const raw = JSON.parse(jsonText) as Array<Record<string, any>>;
  return (Array.isArray(raw) ? raw : []).map((r) => {
    const d = r.data || {};
    return {
      key: String(r.key || ""),
      version: r.version,
      itemType: d.itemType,
      title: d.title || d.name || "",
      creators: d.creators || [],
      date: d.date || "",
      abstractNote: d.abstractNote || "",
      publicationTitle: d.publicationTitle || "",
      DOI: d.DOI || "",
      url: d.url || "",
      tags: d.tags || [],
      raw: r
    };
  });
}

/** 搜索条目：qmode=everything 全字段；attachment/note 类型默认排除。 */
export async function searchItems(
  query: string,
  settings: ZoteroSettings,
  opts?: { itemType?: string; limit?: number; fetcher?: ZoteroFetcher }
): Promise<ZoteroSearchResult> {
  if (!isConfigured(settings)) {
    throw new Error("未配置：请到插件设置填写 Zotero API Key 与用户 ID（zotero.org/settings/keys 创建只读 key）");
  }
  const doFetch = opts && opts.fetcher ? opts.fetcher : defaultFetcher();
  const params: Record<string, string | number> = {
    q: query,
    qmode: "everything",
    format: "json",
    v: 3,
    limit: Math.min(opts && opts.limit ? opts.limit : PAGE, 100),
    itemType: (opts && opts.itemType) || "-attachment ||note"
  };
  const res = await doFetch(`${libraryPrefix(settings)}/items`, params, settings);
  if (res.status !== 200) throw new Error(`Zotero API ${res.status}`);
  const items = parseItems(res.text);
  const total = parseInt(res.headers["Total-Results"] || res.headers["total-results"] || "0", 10);
  return { items, total: Number.isFinite(total) ? total : items.length };
}

/** 取 BibTeX 导出（选中条目 keys）。 */
export async function exportBibTeX(
  keys: string[],
  settings: ZoteroSettings,
  opts?: { fetcher?: ZoteroFetcher }
): Promise<string> {
  if (!isConfigured(settings)) throw new Error("Zotero 未配置");
  if (!keys.length) throw new Error("没有条目");
  const doFetch = opts && opts.fetcher ? opts.fetcher : defaultFetcher();
  const res = await doFetch(
    `${libraryPrefix(settings)}/items`,
    { itemKey: keys.join(","), format: "bibtex", v: 3 },
    settings
  );
  if (res.status !== 200) throw new Error(`Zotero export ${res.status}`);
  return res.text;
}

/** 年份提取：Zotero date 可能是 "2026-05" / "May 2026" / "2026" 等。 */
export function extractYear(date: string | undefined): string {
  const m = String(date || "").match(/(\d{4})/);
  return m ? m[1] : "";
}

/** 作者串：首个作者的姓 + et al.（多作者时）。 */
export function firstAuthor(creators: ZoteroCreator[] | undefined): string {
  if (!creators || !creators.length) return "佚名";
  const c = creators[0];
  const name = c.lastName || c.name || `${c.firstName || ""}`.trim() || "佚名";
  return creators.length > 1 ? `${name} et al.` : String(name);
}

/** 行内引用（默认 author-year）：Author et al. (2026) */
export function toCitation(item: ZoteroItem): string {
  const y = extractYear(item.date);
  return `${firstAuthor(item.creators)}${y ? ` (${y})` : ""}`;
}

/** 生成文献笔记的 Markdown（frontmatter + 摘要 + 标签 + 链接）。 */
export function toNoteMarkdown(item: ZoteroItem): string {
  const y = extractYear(item.date);
  const authors = (item.creators || [])
    .map((c) => c.name || [c.lastName, c.firstName].filter(Boolean).join(", "))
    .filter(Boolean)
    .join(" and ");
  const tags = (item.tags || []).map((t) => (t.tag || "").replace(/\s+/g, "-")).filter(Boolean);
  const lines = [
    "---",
    "type: literature",
    `title: "${(item.title || "无标题").replace(/"/g, "'")}"`,
    `zotero-key: ${item.key}`,
    `authors: "${(authors || "佚名").replace(/"/g, "'")}"`,
    `year: ${y}`,
    ...(item.DOI ? [`doi: ${item.DOI}`] : []),
    ...(item.publicationTitle ? [`journal: "${item.publicationTitle.replace(/"/g, "'")}"`] : []),
    ...(tags.length ? [`tags: [${tags.map((t) => "lit/" + t).join(", ")}]`] : []),
    `created: ${formatDate(new Date(), "YYYY-MM-DD")}`,
    "---",
    "",
    `# ${item.title || "无标题"}`,
    "",
    `> ${toCitation(item)}${item.publicationTitle ? ` · *${item.publicationTitle}*` : ""}`,
    "",
    "## 摘录",
    "",
    (item.abstractNote || "（无摘要）") + "",
    "",
    "## 链接",
    "",
    ...(item.url ? [`- [在线原文](${item.url})`] : []),
    ...(item.DOI ? [`- DOI: [${item.DOI}](https://doi.org/${item.DOI})`] : []),
    `- [Zotero 条目](https://www.zotero.org/groups/-/library/items/${item.key})`,
    "",
    "## 笔记",
    ""
  ];
  return lines.join("\n");
}

/** 导入为文献笔记：vault/文献笔记/<key>.md（key 唯一，天然幂等防重）。 */
export async function importItemAsNote(
  app: App,
  item: ZoteroItem,
  folder: string
): Promise<{ file: TFile; created: boolean }> {
  const dir = normalizePath(folder || "vault/文献笔记");
  if (!app.vault.getAbstractFileByPath(normalizePath(dir))) {
    await app.vault.createFolder(normalizePath(dir));
  }
  const path = normalizePath(`${dir}/${item.key}.md`);
  const existing = app.vault.getAbstractFileByPath(path);
  const md = toNoteMarkdown(item);
  if (existing && (existing as TFile).extension === "md") {
    await app.vault.modify(existing as TFile, md);
    new Notice(`文献笔记已更新：${(item.title || "无标题").slice(0, 40)}`);
    return { file: existing as TFile, created: false };
  }
  const file = await app.vault.create(path, md);
  new Notice(`文献笔记已创建：${(item.title || "无标题").slice(0, 40)}`);
  return { file, created: true };
}

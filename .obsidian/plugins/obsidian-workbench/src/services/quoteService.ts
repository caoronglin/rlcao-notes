"use strict";

import { requestUrl } from "obsidian";

/**
 * 今日诗词：https://www.jinrishici.com/doc/
 *   GET https://v1.jinrishici.com/all.json → { content, origin, author, category }
 * 走 Obsidian 的 requestUrl（绕过渲染进程 CORS），按天缓存 + localStorage 快照。
 */

export interface QuoteData {
  content: string;
  author: string;
  origin: string;
  category: string;
  error?: string;
}

interface QuoteRaw {
  content?: string;
  origin?: string;
  author?: string;
  category?: string;
}

interface StorageLike {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}

interface CacheShape {
  key: string;
  data: QuoteData | null;
}

let cache: CacheShape = { key: "", data: null };

export const STORAGE_KEY = "owb-quote-cache";

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function defaultStorage(): StorageLike | null {
  return typeof localStorage !== "undefined" ? localStorage : null;
}

/** 同步快照（stale-while-revalidate 的 stale 半边）：无缓存/损坏返回 null。 */
export function getCachedSnapshot(storage?: StorageLike | null): QuoteData | null {
  const st = storage || defaultStorage();
  if (!st) return null;
  try {
    const raw = st.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { data?: QuoteData } | null;
    return parsed && parsed.data && parsed.data.content ? parsed.data : null;
  } catch (e) {
    return null;
  }
}

/** 只在拿到有效数据时回写；null（失败路径）不动旧缓存。 */
export function saveSnapshot(storage: StorageLike | null, data: QuoteData | null): void {
  if (!data || !data.content) return;
  const st = storage || defaultStorage();
  if (!st) return;
  try {
    st.setItem(STORAGE_KEY, JSON.stringify({ key: todayKey(), at: Date.now(), data }));
  } catch (e) {
    /* 存储满/隐私模式：忽略 */
  }
}

type QuoteFetcher = () => Promise<QuoteRaw>;

/** 默认走 Obsidian requestUrl；测试或非 Obsidian 环境可注入 fetcher。 */
function defaultFetcher(): QuoteFetcher {
  return async () => {
    const res = await requestUrl({
      url: "https://v1.jinrishici.com/all.json",
      method: "GET",
      headers: { Accept: "application/json" }
    });
    return (res.json || JSON.parse(res.text)) as QuoteRaw;
  };
}

export async function getQuote(force?: boolean, storage?: StorageLike | null, fetcher?: QuoteFetcher): Promise<QuoteData> {
  const key = todayKey();
  if (!force && cache.data && cache.key === key) return cache.data;
  try {
    const doFetch = fetcher || defaultFetcher();
    const j = await doFetch();
    const data: QuoteData = {
      content: String(j.content || "").trim(),
      author: String(j.author || "").trim(),
      origin: String(j.origin || "").trim(),
      category: String(j.category || "").trim()
    };
    if (!data.content) throw new Error("空内容");
    cache = { key, data };
    saveSnapshot(storage || null, data);
    return data;
  } catch (e) {
    return { error: String((e as Error)?.message || e), content: "", author: "", origin: "", category: "" };
  }
}

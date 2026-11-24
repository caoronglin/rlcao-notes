"use strict";

const { requestUrl } = require("obsidian");

/**
 * 今日诗词：https://www.jinrishici.com/doc/
 *   GET https://v1.jinrishici.com/all.json → { content, origin, author, category }
 * 走 Obsidian 的 requestUrl（绕过渲染进程 CORS），按天缓存。
 */

let cache = { key: "", data: null };

const STORAGE_KEY = "owb-quote-cache";

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function defaultStorage() {
  return typeof localStorage !== "undefined" ? localStorage : null;
}

/**
 * 同步快照（stale-while-revalidate 的 stale 半边）：
 * render 立即用上次成功结果填 UI，不等待网络。
 * 无缓存/损坏返回 null。
 */
function getCachedSnapshot(storage) {
  const st = storage || defaultStorage();
  if (!st) return null;
  try {
    const raw = st.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.data && parsed.data.content ? parsed.data : null;
  } catch (e) {
    return null;
  }
}

/** 只在拿到有效数据时回写；null（失败路径）不动旧缓存 */
function saveSnapshot(storage, data) {
  if (!data || !data.content) return;
  const st = storage || defaultStorage();
  if (!st) return;
  try {
    st.setItem(STORAGE_KEY, JSON.stringify({ key: todayKey(), at: Date.now(), data }));
  } catch (e) {
    /* 存储满/隐私模式：忽略 */
  }
}

/** 默认走 Obsidian requestUrl；测试或非 Obsidian 环境可注入 fetcher */
function defaultFetcher() {
  return async () => {
    const res = await requestUrl({
      url: "https://v1.jinrishici.com/all.json",
      method: "GET",
      headers: { Accept: "application/json" }
    });
    return res.json || JSON.parse(res.text);
  };
}

async function getQuote(force, storage, fetcher) {
  const key = todayKey();
  if (!force && cache.data && cache.key === key) return cache.data;
  try {
    const doFetch = fetcher || defaultFetcher();
    const j = await doFetch();
    const data = {
      content: String(j.content || "").trim(),
      author: String(j.author || "").trim(),
      origin: String(j.origin || "").trim(),
      category: String(j.category || "").trim()
    };
    if (!data.content) throw new Error("空内容");
    cache = { key, data };
    saveSnapshot(storage, data);
    return data;
  } catch (e) {
    return { error: String((e && e.message) || e), content: "", author: "", origin: "" };
  }
}

module.exports = { getQuote, getCachedSnapshot, saveSnapshot, STORAGE_KEY };

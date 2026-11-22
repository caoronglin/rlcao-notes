"use strict";

const { requestUrl } = require("obsidian");

/**
 * 今日诗词：https://www.jinrishici.com/doc/
 *   GET https://v1.jinrishici.com/all.json → { content, origin, author, category }
 * 走 Obsidian 的 requestUrl（绕过渲染进程 CORS），按天缓存。
 */

let cache = { key: "", data: null };

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

async function getQuote(force) {
  const key = todayKey();
  if (!force && cache.data && cache.key === key) return cache.data;
  try {
    const res = await requestUrl({
      url: "https://v1.jinrishici.com/all.json",
      method: "GET",
      headers: { Accept: "application/json" }
    });
    const j = res.json || JSON.parse(res.text);
    const data = {
      content: String(j.content || "").trim(),
      author: String(j.author || "").trim(),
      origin: String(j.origin || "").trim(),
      category: String(j.category || "").trim()
    };
    if (!data.content) throw new Error("空内容");
    cache = { key, data };
    return data;
  } catch (e) {
    return { error: String((e && e.message) || e), content: "", author: "", origin: "" };
  }
}

module.exports = { getQuote };

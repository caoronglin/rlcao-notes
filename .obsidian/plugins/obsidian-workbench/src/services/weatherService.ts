// @ts-nocheck -- 渐进迁移: 语法已迁 TS, 类型化排入批1后续
"use strict";

import { requestUrl } from "obsidian";

/**
 * 天气：OpenWeather（https://openweathermap.org/api）
 *   GET /data/2.5/weather?q={city}&appid={key}&units=metric&lang=zh_cn
 *   → { main: { temp, feels_like, humidity }, weather: [{ description, icon }], name }
 *
 * 无 key 时不做请求（避免无谓报错），卡片提示去填。
 * 缓存 30 分钟，避免频繁 render 触发限流。
 */

let cache = { at: 0, key: "", data: null };
const TTL = 30 * 60 * 1000;
const STORAGE_KEY = "owb-weather-cache";

function defaultStorage() {
  return typeof localStorage !== "undefined" ? localStorage : null;
}

/** 同步快照：上次成功结果，离线也先有内容 */
function getCachedSnapshot(storage) {
  const st = storage || defaultStorage();
  if (!st) return null;
  try {
    const raw = st.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.data && typeof parsed.data.temp === "number" ? parsed.data : null;
  } catch (e) {
    return null;
  }
}

function saveSnapshot(storage, data) {
  if (!data || typeof data.temp !== "number") return;
  const st = storage || defaultStorage();
  if (!st) return;
  try {
    st.setItem(STORAGE_KEY, JSON.stringify({ at: Date.now(), key: "", data }));
  } catch (e) {
    /* ignore */
  }
}

function iconEmoji(code) {
  const c = String(code || "");
  if (c.startsWith("01")) return "☀️";
  if (c.startsWith("02")) return "🌤️";
  if (c.startsWith("03") || c.startsWith("04")) return "☁️";
  if (c.startsWith("09") || c.startsWith("10")) return "🌧️";
  if (c.startsWith("11")) return "⛈️";
  if (c.startsWith("13")) return "❄️";
  if (c.startsWith("50")) return "🌫️";
  return "🌡️";
}

async function getWeather(settings, force) {
  const key = String((settings && settings.weatherApiKey) || "").trim();
  const city = String((settings && settings.weatherCity) || "").trim();
  if (!key || !city) return { missing: true };
  const cacheKey = key.slice(0, 6) + "|" + city;
  if (!force && cache.data && cache.key === cacheKey && Date.now() - cache.at < TTL) return cache.data;

  try {
    const url =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      encodeURIComponent(city) +
      "&appid=" + encodeURIComponent(key) +
      "&units=metric&lang=zh_cn";
    const res = await requestUrl({ url, method: "GET" });
    const j = res.json || JSON.parse(res.text);
    if (!j || !j.main) throw new Error((j && j.message) || "返回结构异常");
    const w = (j.weather && j.weather[0]) || {};
    const data = {
      city: j.name || city,
      temp: Math.round(j.main.temp),
      feels: Math.round(j.main.feels_like),
      humidity: j.main.humidity,
      desc: w.description || "",
      emoji: iconEmoji(w.icon),
      code: w.icon || ""
    };
    cache = { at: Date.now(), key: cacheKey, data };
    saveSnapshot(null, data);
    return data;
  } catch (e) {
    return { error: String((e && e.message) || e) };
  }
}

export {
  getWeather,
  iconEmoji,
  getCachedSnapshot,
  saveSnapshot,
  STORAGE_KEY
};

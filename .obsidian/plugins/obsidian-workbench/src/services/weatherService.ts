"use strict";

import { requestUrl } from "obsidian";

/**
 * 天气：OpenWeather（https://openweathermap.org/api）
 *   GET /data/2.5/weather?q={city}&appid={key}&units=metric&lang=zh_cn
 * 无 key 时不请求，缓存 30 分钟，localStorage 快照兜底。
 */

export interface WeatherData {
  city: string;
  temp: number;
  feels: number;
  humidity: number;
  desc: string;
  emoji: string;
  code: string;
  missing?: boolean;
  error?: string;
}

interface WeatherSettings {
  weatherApiKey?: string;
  weatherCity?: string;
}

interface StorageLike {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}

let cache: { at: number; key: string; data: WeatherData | null } = { at: 0, key: "", data: null };
const TTL = 30 * 60 * 1000;

export const STORAGE_KEY = "owb-weather-cache";

function defaultStorage(): StorageLike | null {
  return typeof localStorage !== "undefined" ? localStorage : null;
}

export function iconEmoji(code: string): string {
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

export function getCachedSnapshot(storage?: StorageLike | null): WeatherData | null {
  const st = storage || defaultStorage();
  if (!st) return null;
  try {
    const raw = st.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { data?: WeatherData } | null;
    return parsed && parsed.data && typeof parsed.data.temp === "number" ? parsed.data : null;
  } catch (e) {
    return null;
  }
}

export function saveSnapshot(storage: StorageLike | null, data: WeatherData | null): void {
  if (!data || typeof data.temp !== "number") return;
  const st = storage || defaultStorage();
  if (!st) return;
  try {
    st.setItem(STORAGE_KEY, JSON.stringify({ at: Date.now(), key: "", data }));
  } catch (e) {
    /* ignore */
  }
}

export async function getWeather(settings: WeatherSettings, force?: boolean): Promise<WeatherData> {
  const key = String((settings && settings.weatherApiKey) || "").trim();
  const city = String((settings && settings.weatherCity) || "").trim();
  if (!key || !city) return { missing: true, city: "", temp: 0, feels: 0, humidity: 0, desc: "", emoji: "", code: "" };
  const cacheKey = key.slice(0, 6) + "|" + city;
  if (!force && cache.data && cache.key === cacheKey && Date.now() - cache.at < TTL) return cache.data;

  try {
    const url =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      encodeURIComponent(city) +
      "&appid=" + encodeURIComponent(key) +
      "&units=metric&lang=zh_cn";
    const res = await requestUrl({ url, method: "GET" });
    const j = (res.json || JSON.parse(res.text)) as {
      name?: string;
      message?: string;
      main?: { temp?: number; feels_like?: number; humidity?: number };
      weather?: Array<{ description?: string; icon?: string }>;
    };
    if (!j || !j.main) throw new Error((j && j.message) || "返回结构异常");
    const w = (j.weather && j.weather[0]) || {};
    const data: WeatherData = {
      city: j.name || city,
      temp: Math.round(j.main.temp ?? 0),
      feels: Math.round(j.main.feels_like ?? 0),
      humidity: j.main.humidity ?? 0,
      desc: w.description || "",
      emoji: iconEmoji(w.icon || ""),
      code: w.icon || ""
    };
    cache = { at: Date.now(), key: cacheKey, data };
    saveSnapshot(null, data);
    return data;
  } catch (e) {
    return { error: String((e as Error)?.message || e), city, temp: 0, feels: 0, humidity: 0, desc: "", emoji: "", code: "" };
  }
}

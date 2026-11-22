"use strict";

/**
 * 每日壁纸服务：https://bing.cnortles.top
 *
 * 接口（文档 https://bing.cnortles.top/api ，实测 2026-11-22）：
 *   GET /api/daily                     今日图像，默认 WebP
 *   GET /api/daily?format=jpeg         压缩 JPEG
 *   GET /api/daily?format=original     原始 JPEG
 *   GET /api/random                    随机图像
 * CORS: Access-Control-Allow-Origin: *，可直接作为 CSS background-image 加载。
 *
 * 无元数据 JSON 端点（无标题/版权字段），因此 UI 只呈现图像本身。
 */

const BASE = "https://bing.cnortles.top";

/**
 * 由设置生成壁纸 URL。mode: "daily" | "random"
 * bust=true 时附加时间戳强制换图（daily 换不了日期，但可绕过缓存）。
 */
function wallpaperUrl(settings, opts) {
  const s = settings || {};
  const custom = String(s.wallpaperCustomUrl || "").trim();
  if (custom) return custom;
  const mode = s.wallpaperMode === "random" ? "random" : "daily";
  const fmt = s.wallpaperFormat || "webp";
  const params = [];
  if (mode === "daily" && fmt && fmt !== "webp") params.push("format=" + encodeURIComponent(fmt));
  if (opts && opts.bust) params.push("t=" + Date.now());
  const qs = params.length ? "?" + params.join("&") : "";
  return `${BASE}/api/${mode}${qs}`;
}

/**
 * 计算今天是否该换图（用于「每天自动更新」开关的节流判断）。
 */
function shouldRefresh(lastRefreshKey, todayKey) {
  return lastRefreshKey !== todayKey;
}

/** 生成 CSS 背景层声明。 */
function backgroundCss(url, dim) {
  const overlay = typeof dim === "number" ? dim : 0.45;
  return `linear-gradient(rgba(0,0,0,${overlay}), rgba(0,0,0,${overlay})), url("${url}")`;
}

module.exports = { BASE, wallpaperUrl, shouldRefresh, backgroundCss };

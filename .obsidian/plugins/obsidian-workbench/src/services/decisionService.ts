// @ts-nocheck -- 渐进迁移: 语法已迁 TS, 类型化排入后续批次
"use strict";

/**
 * Jev / Clef TypeSafe 决策服务（magpie 本机网关）。
 *
 * 协议（2026-11-22 实测校验通过）：
 *   POST {endpoint}
 *   Authorization: Bearer {token}   （网关信任本机回环，可填任意值）
 *   { model, state: {...任意 JSON...}, questions: { <key>: {type,instructions,criteria} } }
 *
 *   questions.<key>.type:
 *     - "choice": criteria 是对象 { 选项: "描述" }     → answers.<key>.choice + confidence
 *     - "score":  criteria 是数组 [{value,description}] → answers.<key>.score + confidence
 *     - "noul":  无 criteria                            → answers.<key> 布尔/自由判定 + confidence
 *
 *   model: "vercel-jev/typesafe-ai/jev"（决策）；"vercel-jev/typesafe-ai/clef"（可读图，
 *          state 内放 "images": ["data:image/png;base64,..."]）
 */

async function ask(state, questions, settings, opts) {
  const endpoint = String((settings && settings.decisionEndpoint) || "http://127.0.0.1:3425/v1/systemone");
  const token = String((settings && settings.decisionToken) || "magpie");
  const model = String((settings && settings.decisionModel) || "vercel-jev/typesafe-ai/jev");
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    body: JSON.stringify({ model, state, questions })
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new Error("网关返回非 JSON：" + text.slice(0, 200));
  }
  if (!res.ok) {
    const msg =
      (json && ((json.error && json.error.message) || json.message)) ||
      "HTTP " + res.status;
    throw new Error(msg);
  }
  return normalizeAnswers(json, opts && opts.questionTypes ? opts.questionTypes : {});
}

/**
 * 归一化响应：{ answers: { team: { choice, confidence } }, ... } →
 * { key: { type, value, confidence, raw } }，三种类型统一为 value 字段。
 */
function normalizeAnswers(json, questionTypes) {
  const answers = (json && json.answers) || {};
  const out = {};
  for (const key of Object.keys(answers)) {
    const a = answers[key] || {};
    const type = questionTypes[key] || "choice";
    let value = null;
    if (type === "score") value = typeof a.score === "number" ? a.score : null;
    else if (type === "noul") value = "noul" in a ? a.noul : a.value !== undefined ? a.value : null;
    else value = a.choice !== undefined ? a.choice : a.value !== undefined ? a.value : null;
    out[key] = {
      type,
      value,
      confidence: typeof a.confidence === "number" ? a.confidence : null,
      raw: a
    };
  }
  return { answers: out, raw: json };
}

/** 读取当前笔记正文作为 state 主体（截断到 maxChars）。 */
function noteToState(file, content, maxChars) {
  const limit = maxChars || 4000;
  const trimmed = content.length > limit ? content.slice(0, limit) + "\n…(截断)" : content;
  const state = { path: file ? file.path : "", content: trimmed };
  return state;
}

export {
  ask,
  normalizeAnswers,
  noteToState
};

"use strict";

/**
 * AI 辅助服务（兼容 OpenAI / DeepSeek / Ollama 等所有 /chat/completions 接口）。
 * 在 Obsidian 中优先使用 requestUrl 绕过 CORS，测试环境自动回退到全局 fetch。
 */

function getHttpClient() {
  try {
    const obs = require("obsidian");
    if (obs && typeof obs.requestUrl === "function") {
      return async (url, headers, bodyObj) => {
        const res = await obs.requestUrl({
          url,
          method: "POST",
          headers,
          body: JSON.stringify(bodyObj),
          throw: false
        });
        if (res.status < 200 || res.status >= 300) {
          throw new Error(`HTTP ${res.status}: ${String(res.text || "").slice(0, 200)}`);
        }
        return res.json;
      };
    }
  } catch {
    // 非 Obsidian 运行时（如 Node 单元测试）回退到 fetch
  }

  return async (url, headers, bodyObj) => {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(bodyObj)
    });
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
    }
    return JSON.parse(text);
  };
}

async function chatCompletion(messages, config, customClient) {
  const baseUrl = String(config.aiBaseUrl || "").replace(/\/+$/, "");
  const model = String(config.aiModel || "").trim();
  const apiKey = String(config.aiApiKey || "").trim();
  if (!baseUrl || !model) {
    throw new Error("请先在设置中填写 AI Base URL 与模型名称");
  }

  const endpoint = baseUrl.endsWith("/chat/completions") ? baseUrl : `${baseUrl}/chat/completions`;
  const headers = { "Content-Type": "application/json" };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  const client = customClient || getHttpClient();
  const data = await client(endpoint, headers, {
    model,
    temperature: 0.3,
    messages
  });

  const content =
    data &&
    data.choices &&
    data.choices[0] &&
    data.choices[0].message &&
    data.choices[0].message.content;
  if (!content) {
    throw new Error("AI 接口返回内容为空");
  }
  return String(content).trim();
}

async function generateCommitMessage(diffText, config, customClient) {
  if (!diffText || !diffText.trim()) {
    throw new Error("当前没有可供分析的 Git 变更内容");
  }
  const prompt = [
    "根据以下 Git 变更摘要生成一条简洁、规范的中文 Conventional Commit 信息。",
    "要求：仅输出单行提交信息（如 `docs(notes): 更新 RNA-seq 实验记录`），不要加引号、不要解释、不超过 60 字。",
    "",
    diffText.slice(0, 5000)
  ].join("\n");

  const raw = await chatCompletion(
    [
      { role: "system", content: "你是严谨的软件工程与知识库版本管理助手。" },
      { role: "user", content: prompt }
    ],
    config,
    customClient
  );
  return raw.split(/\r?\n/)[0].replace(/^[`"']+|[`"']+$/g, "").trim();
}

async function generateQuizMarkdownFromNote(noteTitle, noteContent, count, config, customClient) {
  const n = Math.max(1, Math.min(20, Number(count) || 5));
  const prompt = [
    `请根据下面这篇笔记《${noteTitle}》生成 ${n} 道高质量自测题（包含单选、多选与判断题）。`,
    "必须严格输出如下 Markdown 格式（不要加额外说明或代码块围栏）：",
    "",
    "---",
    `title: ${noteTitle} · 自测题库`,
    "desc: 由 AI 基于笔记内容自动生成",
    "---",
    "",
    "## 题干内容",
    "- [ ] A. 选项一",
    "- [x] B. 正确选项",
    "- [ ] C. 选项三",
    "- [ ] D. 选项四",
    "> 解析：简洁解释正确答案原因。",
    "> 标签：关键词1, 关键词2",
    "",
    "以下是笔记原文：",
    noteContent.slice(0, 8000)
  ].join("\n");

  const raw = await chatCompletion(
    [
      { role: "system", content: "你是精通认知科学与间隔重复出题的教学专家。" },
      { role: "user", content: prompt }
    ],
    config,
    customClient
  );
  return raw.replace(/^```(?:markdown|md)?\r?\n?/i, "").replace(/\r?\n?```$/i, "").trim() + "\n";
}

module.exports = {
  chatCompletion,
  generateCommitMessage,
  generateQuizMarkdownFromNote
};

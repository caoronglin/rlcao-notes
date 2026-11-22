"use strict";

/**
 * AI RAG 搜索服务（SiliconFlow）：
 *   - embeddings: POST {base}/v1/embeddings  { model, input: [text...] }
 *     文档: https://api-docs.siliconflow.cn/docs/api/embeddings-post
 *   - rerank:     POST {base}/v1/rerank       { model, query, documents: [text...] }
 *     文档: https://api-docs.siliconflow.cn/docs/api/rerank-post
 *
 * 索引保存在插件目录 .rag-index.json（.gitignore 已排除，不入库）：
 *   { version: 1, model, dim, builtAt, chunks: [{ path, heading, text, vec }] }
 */

const INDEX_FILE = ".rag-index.json";
const SKIP_DIR_NAMES = new Set([
  ".obsidian", ".trash", ".trash-1000", "node_modules", "__pycache__",
  "4-存档", "muban", "panel"
]);

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

class RagService {
  constructor(getSettings, adapter) {
    this.getSettings = getSettings; // () => plugin.settings
    this.adapter = adapter;         // app.vault.adapter
    this.index = null;
  }

  base() {
    const s = this.getSettings();
    return String(s.ragBaseUrl || "https://api.siliconflow.cn").replace(/\/+$/, "");
  }

  authHeaders() {
    const key = String(this.getSettings().ragApiKey || "").trim();
    if (!key) throw new Error("请先在插件设置中填写 SiliconFlow API Key");
    return { Authorization: "Bearer " + key, "Content-Type": "application/json" };
  }

  async embed(texts) {
    const s = this.getSettings();
    const res = await fetch(this.base() + "/v1/embeddings", {
      method: "POST",
      headers: this.authHeaders(),
      body: JSON.stringify({ model: s.ragEmbedModel || "BAAI/bge-m3", input: texts })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error("embeddings 失败：" + ((data && (data.message || data.error)) || res.status));
    }
    const rows = (data.data || []).slice().sort((a, b) => a.index - b.index);
    return rows.map((r) => r.embedding);
  }

  async rerank(query, documents) {
    const s = this.getSettings();
    const res = await fetch(this.base() + "/v1/rerank", {
      method: "POST",
      headers: this.authHeaders(),
      body: JSON.stringify({
        model: s.ragRerankModel || "BAAI/bge-reranker-v2-m3",
        query,
        documents,
        top_n: documents.length,
        return_documents: false
      })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error("rerank 失败：" + ((data && (data.message || data.error)) || res.status));
    }
    // results: [{ index, relevance_score }]
    return (data.results || []).map((r) => ({ index: r.index, score: r.relevance_score }));
  }

  /**
   * 把一篇笔记切成带标题语境的块。
   */
  chunkText(text, maxChars) {
    const limit = maxChars || 600;
    const lines = text.split("\n");
    const chunks = [];
    let heading = "";
    let buf = [];

    const flush = () => {
      const joined = buf.join("\n").trim();
      if (joined.length >= 12) chunks.push({ heading, text: joined });
      buf = [];
    };

    let inFence = false;
    for (const line of lines) {
      if (line.trim().startsWith("```")) inFence = !inFence;
      const stripped = line.trim();
      if (!inFence && /^#{1,4}\s+/.test(line)) {
        flush();
        heading = stripped.replace(/^#{1,4}\s+/, "");
        buf.push(line);
        continue;
      }
      buf.push(line);
      if (buf.join("\n").length >= limit) flush();
    }
    flush();
    return chunks;
  }

  scanRoots(app, settings) {
    const raw = String(settings.ragFolders || "notes,vault,wiki,_posts");
    return raw.split(",").map((x) => x.trim()).filter(Boolean);
  }

  shouldIndex(path, roots, privacyFolder) {
    if (privacyFolder && (path + "/").startsWith(privacyFolder + "/")) return false;
    if (path.startsWith(".obsidian/") || path.startsWith(".trash/")) return false;
    for (const d of SKIP_DIR_NAMES) {
      if (path === d || path.startsWith(d + "/")) return false;
    }
    if (!roots.length) return true;
    return roots.some((r) => path === r || path.startsWith(r + "/"));
  }

  async loadIndex() {
    if (this.index) return this.index;
    try {
      const raw = await this.adapter.read(".obsidian/plugins/obsidian-workbench/" + INDEX_FILE);
      this.index = JSON.parse(raw);
    } catch (e) {
      this.index = null;
    }
    return this.index;
  }

  indexStat() {
    const s = this.getSettings();
    if (!this.index) return { built: false, chunks: 0 };
    return {
      built: true,
      chunks: this.index.chunks.length,
      model: this.index.model,
      files: new Set(this.index.chunks.map((c) => c.path)).size,
      stale: this.index.model !== (s.ragEmbedModel || "BAAI/bge-m3")
    };
  }

  /**
   * 构建全库索引。onProgress(done, total, message?) 用于 UI 回显。
   */
  async buildIndex(app, onProgress) {
    const s = this.getSettings();
    if (!String(s.ragApiKey || "").trim()) throw new Error("请先在插件设置中填写 SiliconFlow API Key");
    const roots = this.scanRoots(app, s);
    const privacyFolder = (s.privacyFolder || "").replace(/^\/+|\/+$/g, "");
    const files = app.vault.getMarkdownFiles().filter((f) => this.shouldIndex(f.path, roots, privacyFolder));

    const report = (done, total, msg) => {
      if (onProgress) onProgress(done, total, msg);
    };
    report(0, files.length, "扫描到 " + files.length + " 篇笔记");

    const chunks = [];
    let processed = 0;
    const BATCH = 16;
    for (const file of files) {
      let content = "";
      try {
        content = await app.vault.cachedRead(file);
      } catch (e) {
        processed += 1;
        continue;
      }
      for (const c of this.chunkText(content, s.ragChunkChars || 600)) {
        chunks.push({ path: file.path, heading: c.heading, text: c.text });
      }
      processed += 1;
      if (processed % 40 === 0) report(processed, files.length, "已读取 " + processed + "/" + files.length);
    }
    report(files.length, files.length, "开始向量化（共 " + chunks.length + " 块）…");

    const vectors = [];
    for (let i = 0; i < chunks.length; i += BATCH) {
      const part = chunks.slice(i, i + BATCH);
      const vecs = await this.embed(part.map((c) => (c.heading ? "【" + c.heading + "】\n" : "") + c.text));
      for (let j = 0; j < part.length; j++) {
        vectors.push({ path: part[j].path, heading: part[j].heading, text: part[j].text, vec: vecs[j] });
      }
      report(i + part.length, chunks.length, "向量化 " + Math.min(i + part.length, chunks.length) + "/" + chunks.length);
    }

    this.index = {
      version: 1,
      model: s.ragEmbedModel || "BAAI/bge-m3",
      dim: vectors.length ? vectors[0].vec.length : 0,
      builtAt: new Date().toISOString(),
      chunks: vectors
    };
    await this.adapter.write(
      ".obsidian/plugins/obsidian-workbench/" + INDEX_FILE,
      JSON.stringify(this.index)
    );
    return this.indexStat();
  }

  /**
   * 查询：embed 问题 → cosine Top-K → rerank 精排 → Top-N。
   */
  async search(query, opts) {
    const s = this.getSettings();
    const index = await this.loadIndex();
    if (!index || !index.chunks.length) throw new Error("索引为空，请先构建 RAG 索引");
    if (index.model !== (s.ragEmbedModel || "BAAI/bge-m3")) {
      throw new Error("索引与当前嵌入模型不一致，请重建索引");
    }
    const topK = (opts && opts.topK) || 30;
    const topN = (opts && opts.topN) || 8;
    const qvec = (await this.embed([query]))[0];

    const scored = index.chunks.map((c) => ({ c, score: cosine(qvec, c.vec) }));
    scored.sort((a, b) => b.score - a.score);
    const candidates = scored.slice(0, topK);

    // 无 rerank key 时退化为纯向量序
    if (!String(s.ragApiKey || "").trim()) throw new Error("请先在插件设置中填写 SiliconFlow API Key");
    let order;
    try {
      const rr = await this.rerank(query, candidates.map((x) => (x.c.heading ? "【" + x.c.heading + "】" : "") + x.c.text.slice(0, 1000)));
      order = rr.map((r) => ({ chunk: candidates[r.index].c, score: r.score, cosine: candidates[r.index].score }));
    } catch (e) {
      order = candidates.slice(0, topN).map((x) => ({ chunk: x.c, score: x.score, cosine: x.score }));
    }
    return order.slice(0, topN);
  }

  async clearIndex() {
    this.index = null;
    try {
      await this.adapter.remove(".obsidian/plugins/obsidian-workbench/" + INDEX_FILE);
    } catch (e) {
      /* absent is fine */
    }
    return true;
  }
}

module.exports = { RagService, cosine };

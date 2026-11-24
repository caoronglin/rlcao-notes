// @ts-nocheck -- 渐进迁移: 语法已迁 TS, 类型化排入后续批次
"use strict";

import { normalizePath, Notice } from "obsidian";
import { formatDate } from "../utils";

/**
 * 知识图谱生成：从 Obsidian 的链接解析缓存（metadataCache.resolvedLinks）
 * 构建笔记级图，产出：
 *   - 枢纽笔记（度最高）与孤立笔记
 *   - 社区聚类（标签传播，轻量、确定性）
 *   - 一份可直接阅读的 Markdown（含 Mermaid 图）
 *
 * 只读 metadataCache，不重新解析文件，代价很低。
 */

function resolveLinks(app) {
  const mc = app.metadataCache;
  if (!mc || typeof mc.resolvedLinks !== "object") return null;
  return mc.resolvedLinks; // { sourcePath: { targetPath: count } }
}

/**
 * 标签传播聚类：每点初始独立社区，迭代把邻居最多的标签收为己用。
 * 5 轮足够收敛，确定性（按路径排序）保证多次生成结果一致。
 */
function detectCommunities(nodes, adj, rounds) {
  const label = new Map();
  nodes.forEach((n, i) => label.set(n, i));
  const order = nodes.slice().sort();
  for (let r = 0; r < (rounds || 5); r++) {
    let changed = false;
    for (const n of order) {
      const counts = new Map();
      for (const m of adj.get(n) || []) {
        const l = label.get(m);
        counts.set(l, (counts.get(l) || 0) + 1);
      }
      if (!counts.size) continue;
      let best = label.get(n);
      let bestCount = -1;
      for (const [l, c] of counts) {
        if (c > bestCount || (c === bestCount && String(l) < String(best))) {
          best = l;
          bestCount = c;
        }
      }
      // 平票时保持原标签，避免震荡
      const ownCount = counts.get(label.get(n)) || 0;
      if (best !== label.get(n) && bestCount > ownCount) {
        label.set(n, best);
        changed = true;
      }
    }
    if (!changed) break;
  }
  const groups = new Map();
  for (const n of nodes) {
    const l = label.get(n);
    if (!groups.has(l)) groups.set(l, []);
    groups.get(l).push(n);
  }
  return [...groups.values()].sort((a, b) => b.length - a.length);
}

/**
 * 构建图谱统计。opts: { limit: 节点上限（默认 600）, minDegree }
 */
function buildGraph(app, opts) {
  const o = opts || {};
  const resolved = resolveLinks(app);
  const notes = app.vault.getMarkdownFiles().filter((f) => !f.path.startsWith("4-存档/"));

  const byPath = new Map(notes.map((f) => [f.path, f]));
  const adj = new Map();
  const degree = new Map();
  let edgeCount = 0;

  const addEdge = (a, b) => {
    if (a === b) return;
    if (!adj.has(a)) adj.set(a, new Set());
    if (!adj.has(b)) adj.set(b, new Set());
    if (adj.get(a).has(b)) return;
    adj.get(a).add(b);
    adj.get(b).add(a);
    degree.set(a, (degree.get(a) || 0) + 1);
    degree.set(b, (degree.get(b) || 0) + 1);
    edgeCount += 1;
  };

  if (resolved) {
    for (const [src, targets] of Object.entries(resolved)) {
      if (!byPath.has(src)) continue;
      for (const tgt of Object.keys(targets || {})) {
        if (!byPath.has(tgt)) continue; // 只统计库内笔记
        addEdge(src, tgt);
      }
    }
  }

  // 按度排序取活跃子图
  const all = [...byPath.keys()];
  const ranked = all.slice().sort((a, b) => (degree.get(b) || 0) - (degree.get(a) || 0));
  const limit = o.limit || 600;
  const nodes = ranked.slice(0, limit).filter((p) => (degree.get(p) || 0) >= (o.minDegree || 0));
  const nodeSet = new Set(nodes);

  // 只保留两端都在节点集里的边
  const subAdj = new Map();
  for (const n of nodes) {
    const keep = new Set();
    for (const m of adj.get(n) || []) if (nodeSet.has(m)) keep.add(m);
    subAdj.set(n, keep);
  }

  const communities = detectCommunities(nodes, subAdj);
  const orphans = all.filter((p) => !degree.get(p));

  return {
    nodes,
    nodeSet,
    adj: subAdj,
    degree,
    edgeCount,
    communities,
    orphans,
    totalNotes: all.length
  };
}

/** 取节点短名（同名文件加父目录消歧） */
function shortName(path, allPaths) {
  const base = path.split("/").pop().replace(/\.md$/, "");
  const same = allPaths.filter((p) => p.split("/").pop().replace(/\.md$/, "") === base);
  if (same.length <= 1) return base;
  const parent = path.split("/").slice(-2, -1)[0] || "";
  return `${base}(${parent})`;
}

function mermaidId(i) {
  return "n" + i;
}

/**
 * 生成 Markdown 报告文本（不写盘，便于测试）。
 * opts: { mermaidMax: 40, communityTop: 5, communitySize: 8 }
 */
function renderGraphMarkdown(app, graph, opts) {
  const o = opts || {};
  const date = formatDate(new Date(), "YYYY-MM-DD HH:mm");
  const allPaths = graph.nodes;
  const lines = [];

  lines.push("---");
  lines.push("tags: [knowledge-graph, generated]");
  lines.push(`generated: ${date}`);
  lines.push("---");
  lines.push("");
  lines.push(`# 知识图谱 · ${formatDate(new Date(), "YYYY-MM-DD")}`);
  lines.push("");
  lines.push(
    `> 由 Workbench RAG 卡片生成。笔记 ${graph.totalNotes} 篇，连边 ${graph.edgeCount} 条，` +
      `活跃节点 ${graph.nodes.length} 个，孤立笔记 ${graph.orphans.length} 篇。`
  );
  lines.push("");

  // Mermaid 图：取度最高的 N 个，边只画子集内
  const topN = graph.nodes.slice(0, o.mermaidMax || 40);
  const topSet = new Set(topN);
  const idOf = new Map(topN.map((p, i) => [p, mermaidId(i)]));
  lines.push("## 结构图（度最高的 " + topN.length + " 个节点）");
  lines.push("");
  lines.push("```mermaid");
  lines.push("graph LR");
  topN.forEach((p) => {
    const name = shortName(p, allPaths).replace(/"/g, "'");
    const deg = graph.degree.get(p) || 0;
    lines.push(`  ${idOf.get(p)}["${name}<br/>${deg}"]`);
  });
  const drawn = new Set();
  for (const a of topN) {
    for (const b of graph.adj.get(a) || []) {
      if (!topSet.has(b)) continue;
      const key = a < b ? a + "|" + b : b + "|" + a;
      if (drawn.has(key)) continue;
      drawn.add(key);
      lines.push(`  ${idOf.get(a)} --- ${idOf.get(b)}`);
    }
  }
  lines.push("```");
  lines.push("");

  // 枢纽
  lines.push("## 枢纽笔记（连接数最多）");
  lines.push("");
  lines.push("| 笔记 | 连接数 |");
  lines.push("|---|---|");
  for (const p of graph.nodes.slice(0, 15)) {
    const name = shortName(p, allPaths);
    lines.push(`| [[${p.replace(/\.md$/, "")}\\|${name}]] | ${graph.degree.get(p) || 0} |`);
  }
  lines.push("");

  // 社区
  lines.push("## 主题聚类（标签传播）");
  lines.push("");
  const commCount = o.communityTop || 5;
  const perComm = o.communitySize || 8;
  graph.communities.slice(0, commCount).forEach((group, i) => {
    const names = group
      .slice(0, perComm)
      .map((p) => shortName(p, allPaths))
      .join("、");
    lines.push(`- **簇 ${i + 1}**（${group.length} 篇）：${names}${group.length > perComm ? " 等" : ""}`);
  });
  lines.push("");

  // 孤立
  lines.push("## 孤立笔记（没有任何链接）");
  lines.push("");
  if (!graph.orphans.length) {
    lines.push("无。所有笔记都在链接网络里。");
  } else {
    lines.push(`共 ${graph.orphans.length} 篇，前 20：`);
    lines.push("");
    for (const p of graph.orphans.slice(0, 20)) lines.push(`- [[${p.replace(/\.md$/, "")}]]`);
  }
  lines.push("");
  return lines.join("\n");
}

/** 生成并写入库内（默认 vault/系统与工具/），返回文件 */
async function writeGraphNote(app, opts) {
  const o = opts || {};
  const graph = buildGraph(app, o);
  const md = renderGraphMarkdown(app, graph, o);
  const dir = normalizePath(o.dir || "vault/系统与工具");
  if (!app.vault.getAbstractFileByPath(dir)) {
    try {
      await app.vault.createFolder(dir);
    } catch (e) {
      /* 已存在 */
    }
  }
  const path = normalizePath(`${dir}/知识图谱-${formatDate(new Date(), "YYYY-MM-DD")}.md`);
  const existing = app.vault.getAbstractFileByPath(path);
  let file;
  if (existing) {
    await app.vault.modify(existing, md);
    file = existing;
  } else {
    file = await app.vault.create(path, md);
  }
  new Notice(
    `知识图谱已生成：${graph.nodes.length} 活跃节点 / ${graph.edgeCount} 条连边 / ${graph.orphans.length} 篇孤立`,
    7000
  );
  await app.workspace.getLeaf(false).openFile(file);
  return { file, graph };
}

export {
  buildGraph,
  renderGraphMarkdown,
  writeGraphNote,
  detectCommunities,
  shortName
};

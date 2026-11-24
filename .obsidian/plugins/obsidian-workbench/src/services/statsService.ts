"use strict";

/**
 * 标签与附件统计（工作台卡片用）。
 * 全部基于内存缓存（metadataCache + vault.getFiles），不读文件内容。
 */

/** 标签统计：返回 [{ tag, count }] 降序 */
export interface VaultFileLite {
  path: string;
  extension: string;
  stat?: { size?: number } | null;
}

export interface TagStat { tag: string; count: number }
export interface TagStatsResult {
  list: TagStat[];
  all: TagStat[];
  distinct: number;
  total: number;
  nested: number;
}

function tagStats(app: any, opts?: { limit?: number }): TagStatsResult {
  const o = opts || {};
  const counts = new Map();
  let mc = null;
  try {
    mc = app.metadataCache && app.metadataCache.getTags ? app.metadataCache.getTags() : null;
  } catch (e) {
    mc = null;
  }
  if (mc && typeof mc === "object") {
    for (const [tag, n] of Object.entries(mc)) {
      const t = String(tag).replace(/^#/, "");
      if (!t) continue;
      counts.set(t, (counts.get(t) || 0) + Number(n || 0));
    }
  }
  let list: TagStat[] = [...counts.entries()].map(([tag, count]) => ({ tag, count }));
  list.sort((a, b) => b.count - a.count || (a.tag < b.tag ? -1 : 1));

  const total = list.reduce((s, x) => s + x.count, 0);
  const nested = list.filter((x) => x.tag.includes("/")).length;
  return {
    list: list.slice(0, o.limit || 12),
    all: list,
    distinct: list.length,
    total,
    nested
  };
}

/** 附件统计：按扩展名聚合体积与数量 */
function attachmentStats(app: { vault: { getFiles(): Array<{ path: string; extension: string; stat?: { size?: number } | null }> } }, attachmentExts: Set<string>): { count: number; totalBytes: number; byExt: Array<{ ext: string; count: number; bytes: number }> } {
  let files: VaultFileLite[] = [];
  try {
    files = app.vault.getFiles();
  } catch (e) {
    files = [];
  }
  const byExt = new Map<string, { ext: string; count: number; bytes: number }>();
  let totalBytes = 0;
  let count = 0;
  for (const f of files) {
    const ext = String(f.extension || "").toLowerCase();
    if (!attachmentExts.has(ext)) continue;
    const size = f.stat ? (f.stat.size ?? 0) : 0;
    const cur = byExt.get(ext) || { ext, count: 0, bytes: 0 };
    cur.count += 1;
    cur.bytes += size;
    byExt.set(ext, cur);
    totalBytes += size;
    count += 1;
  }
  const byExtList = [...byExt.values()].sort((a, b) => b.bytes - a.bytes);
  return { count, totalBytes, byExt: byExtList };
}

/**
 * 附件位置分布：有多少附件已经规整到 assets/，多少散落在别处。
 * 用于「整理附件」前的体检。
 */
function attachmentLocations(app: { vault: { getFiles(): Array<{ path: string; extension: string }> } }, attachmentExts: Set<string>): { inAssets: Array<{ path: string; extension: string }>; loose: Array<{ path: string; extension: string }> } {
  let files: VaultFileLite[] = [];
  try {
    files = app.vault.getFiles();
  } catch (e) {
    files = [];
  }
  const inAssets = [];
  const loose = [];
  for (const f of files) {
    if (!attachmentExts.has(String(f.extension || "").toLowerCase())) continue;
    if (f.path.startsWith("assets/") || f.path.startsWith("4-存档/")) inAssets.push(f);
    else loose.push(f);
  }
  return { inAssets, loose };
}

export {
  tagStats,
  attachmentStats,
  attachmentLocations
};

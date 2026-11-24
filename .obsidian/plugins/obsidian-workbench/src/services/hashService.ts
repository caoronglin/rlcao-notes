"use strict";

import type { App, TFile } from "obsidian";
import { normalizePath } from "obsidian";

/**
 * 附件哈希服务：SHA-256 内容寻址存储。
 *
 * 路径规约：assets/<YY>/<MM>/<sha256 前 16 位>.<ext>
 *   - YY 两位年、MM 两位月（按文件 mtime 或当前时间）
 *   - 去重必须比对「全量 64 位哈希」，文件名只取前 16 位（碰撞概率在万级附件下可忽略）
 *
 * 索引：全量哈希 → 路径，存插件目录 attachments-index.json（.gitignore 排除，可重建）。
 */

export const INDEX_FILE = ".obsidian/plugins/obsidian-workbench/attachments-index.json";
const HASH_FILENAME_LEN = 16;

export interface HashIndexEntry {
  hash: string; // 全量 sha256 hex(64)
  path: string;
  size: number;
  at: number;
}

export interface HashIndex {
  version: 1;
  entries: Record<string, HashIndexEntry>; // key = 全量哈希
}

export function emptyIndex(): HashIndex {
  return { version: 1, entries: {} };
}

/** Web Crypto 计算 SHA-256（Chromium/Electron 原生可用）。 */
export async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** 由哈希 + 扩展名 + 日期生成规约路径：assets/<YY>/<MM>/<hash16>.<ext> */
export function hashPathFor(fullHash: string, ext: string, date?: Date, root?: string): string {
  const d = date || new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  const mm = pad(d.getMonth() + 1);
  const base = String(fullHash).slice(0, HASH_FILENAME_LEN);
  const e = String(ext || "bin").replace(/^\./, "").toLowerCase();
  const prefix = (root || "assets").replace(/^\/+|\/+$/g, "");
  return normalizePath(`${prefix}/${yy}/${mm}/${base}.${e}`);
}

/**
 * 存入附件（内容寻址）：
 *   - 已存在同哈希 → 返回已有文件（true = 复用，不写盘）
 *   - 索引未命中但磁盘上已存在目标路径 → 直接复用该文件并补索引
 */
export async function storeByHash(
  app: App,
  bytes: Uint8Array,
  opts: { ext: string; date?: Date; root?: string; index?: HashIndex }
): Promise<{ file: TFile; reused: boolean; hash: string; path: string }> {
  const full = await sha256Hex(bytes);
  const path = hashPathFor(full, opts.ext, opts.date, opts.root);

  // 1) 索引命中：哈希相同的文件已入库
  const idx = opts.index;
  if (idx && idx.entries[full]) {
    const hit = app.vault.getAbstractFileByPath(idx.entries[full].path);
    if (hit && (hit as TFile).extension) {
      return { file: hit as TFile, reused: true, hash: full, path: idx.entries[full].path };
    }
  }

  // 2) 磁盘已存在同名（同一次会话或跨会话重复）→ 复用
  const existing = app.vault.getAbstractFileByPath(path);
  if (existing && (existing as TFile).extension) {
    if (idx) {
      idx.entries[full] = { hash: full, path, size: bytes.length, at: Date.now() };
    }
    return { file: existing as TFile, reused: true, hash: full, path };
  }

  // 3) 写入新文件（必要时建目录）
  const folder = path.slice(0, path.lastIndexOf("/"));
  if (folder && !app.vault.getAbstractFileByPath(normalizePath(folder))) {
    await app.vault.createFolder(normalizePath(folder));
  }
  const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  const file = await app.vault.createBinary(path, buf);
  if (idx) {
    idx.entries[full] = { hash: full, path, size: bytes.length, at: Date.now() };
  }
  return { file, reused: false, hash: full, path };
}

/**
 * 全库扫描重复附件：按 sha256 分组，返回「重复组」（成员 > 1）。
 * 保留策略：每组的正本 = 引用次数最多的成员（并列取最早 mtime）。
 */
export interface VaultFileInfo {
  file: TFile;
  hash: string;
  size: number;
  refs: number; // 被引用的 md 次数（由调用方传入解析器）
}

export interface DupGroup {
  hash: string;
  size: number;
  keep: VaultFileInfo;
  dups: VaultFileInfo[];
  wasted: number;
}

export async function scanDuplicates(
  files: Array<{ file: TFile; bytes: () => Promise<Uint8Array | null> }>,
  refCountOf: (f: TFile) => number
): Promise<{ groups: DupGroup[]; scanned: number; wasted: number }> {
  const byHash = new Map<string, VaultFileInfo[]>();
  let scanned = 0;

  for (const item of files) {
    let bytes: Uint8Array | null = null;
    try {
      bytes = await item.bytes();
    } catch (e) {
      continue;
    }
    if (!bytes) continue;
    scanned += 1;
    const hash = await sha256Hex(bytes);
    const info: VaultFileInfo = {
      file: item.file,
      hash,
      size: bytes.length,
      refs: refCountOf(item.file)
    };
    if (!byHash.has(hash)) byHash.set(hash, []);
    byHash.get(hash)!.push(info);
  }

  const groups: DupGroup[] = [];
  let wasted = 0;
  for (const [hash, list] of byHash) {
    if (list.length < 2) continue;
    // 正本：引用最多；并列取最早 mtime
    const sorted = list.slice().sort((a, b) => {
      if (b.refs !== a.refs) return b.refs - a.refs;
      const am = a.file.stat ? a.file.stat.mtime : 0;
      const bm = b.file.stat ? b.file.stat.mtime : 0;
      return am - bm;
    });
    const keep = sorted[0];
    const dups = sorted.slice(1);
    const groupWasted = dups.length * keep.size;
    wasted += groupWasted;
    groups.push({ hash, size: keep.size, keep, dups, wasted: groupWasted });
  }
  groups.sort((a, b) => b.wasted - a.wasted);
  return { groups, scanned, wasted };
}

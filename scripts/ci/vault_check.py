#!/usr/bin/env python3
"""Vault 结构与链接自检。CI（.cnb.yml）与本地都用这一份，避免两套逻辑漂移。

检查项
  1. 悬空 wikilink（含别名 / 标题锚点 / 路径尾部匹配）
  2. frontmatter 可解析（YAML 顶层键值，含 tabs 误用）
  3. JSON 配置可解析（.obsidian 白名单文件）
  4. 单文件体积阈值

用法
  python3 scripts/ci/vault_check.py            # 全量
  python3 scripts/ci/vault_check.py --strict   # 悬空链接按白名单外零容忍（CI 默认开启）
"""
import argparse
import io
import json
import os
import re
import subprocess
import sys
from collections import Counter

SKIP_DIRS = {".git", ".obsidian", ".trash", ".trash-1000", "node_modules", "__pycache__", ".vscode"}
# muban 里 3 条模板占位链接是模板语法本身，另有 1 条 Templater 变量，故意保留（AGENTS.md §9.2）
LINK_ALLOWLIST = {
    "[[status/to_read]]",
    "[[{{annotation.imageRelativePath}}]]",
}
MAX_MD_BYTES = 5 * 1024 * 1024
MAX_OTHER_BYTES = 20 * 1024 * 1024
# 体积只看入库文件：.gitignore 已经挡掉的大数据留在本地，不该让自检失败
CONFIG_JSON = [
    ".obsidian/app.json", ".obsidian/appearance.json", ".obsidian/community-plugins.json",
    ".obsidian/core-plugins.json", ".obsidian/daily-notes.json", ".obsidian/hotkeys.json",
    ".obsidian/templates.json", ".obsidian/types.json",
]


def tracked_files(root):
    """返回 git 已跟踪文件（相对路径）；非 git 环境返回 None"""
    try:
        out = subprocess.run(
            ["git", "-C", root, "ls-files", "-z"],
            capture_output=True, check=True, timeout=120,
        ).stdout
        return {p for p in out.decode("utf-8", "ignore").split("\0") if p}
    except (OSError, subprocess.SubprocessError):
        return None


def strip_code(text: str) -> str:
    """去掉围栏代码块与行内代码：Obsidian 不解析其中的链接。逐行开关，不用正则跨块替换。"""
    out, in_fence = [], False
    for line in text.split("\n"):
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
            out.append("")
            continue
        out.append("" if in_fence else line)
    return re.sub(r"`[^`\n]*`", "", "\n".join(out))


def collect(root: str):
    mds, all_paths = [], []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            p = os.path.normpath(os.path.join(dirpath, name))
            all_paths.append(os.path.relpath(p, root))
            if name.endswith(".md"):
                mds.append(os.path.relpath(p, root))
    return mds, all_paths


def build_index(root: str, all_paths):
    stems = {os.path.basename(p)[:-3] for p in all_paths if p.endswith(".md")}
    paths = set(all_paths)
    paths_nomd = {p[:-3] for p in all_paths if p.endswith(".md")}
    dirs = set()
    for dirpath, dirnames, _ in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for d in dirnames:
            dirs.add(os.path.relpath(os.path.join(dirpath, d), root))
    return stems, paths, paths_nomd, dirs


def link_ok(base: str, source_dir: str, stems, paths, paths_nomd, dirs) -> bool:
    base = base.strip()
    if not base:
        return True
    if base.endswith("/"):
        t = base.strip("/")
        return any(d == t or d.endswith("/" + t) for d in dirs)
    if base in stems or base in paths or base in paths_nomd:
        return True
    nb = os.path.normpath(os.path.join(source_dir, base)) if source_dir else base
    nb = nb.replace(os.sep, "/")
    if nb in paths or nb in paths_nomd:
        return True
    return any(p == base or p.endswith("/" + base) for p in paths)


def check_links(root, mds, stems, paths, paths_nomd, dirs):
    bad = []
    for rel in mds:
        try:
            text = io.open(os.path.join(root, rel), encoding="utf-8", errors="ignore").read()
        except OSError as e:
            bad.append((rel, f"<读取失败 {e}>"))
            continue
        body = strip_code(text)
        src_dir = os.path.dirname(rel)
        for raw in re.findall(r"\[\[([^\]]+)\]\]", body):
            base = split_alias(raw).partition("#")[0].strip()
            if not base or base.startswith("<%") or base.startswith("http"):
                continue
            if f"[[{bare(raw)}]]" in LINK_ALLOWLIST:
                continue
            if not link_ok(base, src_dir, stems, paths, paths_nomd, dirs):
                bad.append((rel, f"[[{base}]]"))
    return bad


def split_alias(raw: str) -> str:
    """取 [[目标|别名]] 的目标部分。
    表格里的别名管道必须写成 \\| 才不会截断表格，所以先把 \\| 还原再切分。"""
    return raw.replace("\\|", "|").split("|")[0]


def bare(raw: str) -> str:
    return split_alias(raw).partition("#")[0].strip()


def check_frontmatter(root, mds):
    problems = []
    for rel in mds:
        text = io.open(os.path.join(root, rel), encoding="utf-8", errors="ignore").read()
        if not text.startswith("---"):
            continue
        end = text.find("\n---", 3)
        if end == -1:
            problems.append((rel, "frontmatter 未闭合"))
            continue
        block = text[3:end]
        if "\t" in block:
            problems.append((rel, "frontmatter 含 Tab（YAML 会解析失败）"))
        for line in block.split("\n"):
            s = line.strip()
            if not s or s.startswith("#") or s.startswith("-"):
                continue
            if ":" not in s:
                problems.append((rel, f"无法解析的行：{s[:40]}"))
    return problems


def check_json(root, all_paths):
    problems = []
    targets = [p for p in CONFIG_JSON if os.path.exists(os.path.join(root, p))]
    targets += [p for p in all_paths
                if p.endswith(".json") and p.startswith(".obsidian/") and p not in targets]
    for rel in targets:
        try:
            json.load(io.open(os.path.join(root, rel), encoding="utf-8"))
        except Exception as e:  # noqa: BLE001 - 只要报出坏文件即可
            problems.append((rel, str(e)[:80]))
    return problems, targets


def check_sizes(root, all_paths):
    problems = []
    tracked = tracked_files(root)
    scope = [p for p in all_paths if p in tracked] if tracked is not None else all_paths
    for rel in scope:
        full = os.path.join(root, rel)
        try:
            size = os.path.getsize(full)
        except OSError:
            continue
        limit = MAX_MD_BYTES if rel.endswith(".md") else MAX_OTHER_BYTES
        if size > limit:
            problems.append((rel, f"{size / 1024 / 1024:.1f} MB > {limit // 1024 // 1024} MB"))
    return problems


def check_tracking(root):
    """防「静默失效」：配置文件在磁盘上但没进 git，obsidian-git 照常提交也白搭（AGENTS.md §4.1）。"""
    tracked = tracked_files(root)
    if tracked is None:
        return []
    problems = []
    must = CONFIG_JSON + [
        ".obsidian/snippets/antd-workbench.css",
        ".obsidian/plugins/xl-toolbox/manifest.json",
        ".obsidian/plugins/xl-toolbox/main.js",
        ".cnb.yml",
        ".gitattributes",
    ]
    for rel in must:
        if os.path.exists(os.path.join(root, rel)) and rel not in tracked:
            problems.append((rel, "存在但未被 git 跟踪（检查 .gitignore 白名单）"))
    return problems


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("root", nargs="?", default=".")
    ap.add_argument("--strict", action="store_true", help="存在悬空链接即失败（CI 默认）")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()
    root = os.path.abspath(args.root)

    mds, all_paths = collect(root)
    stems, paths, paths_nomd, dirs = build_index(root, all_paths)

    bad_links = check_links(root, mds, stems, paths, paths_nomd, dirs)
    fm = check_frontmatter(root, mds)
    js, json_targets = check_json(root, all_paths)
    sizes = check_sizes(root, all_paths)
    tracking = check_tracking(root)

    def report(title, items, limit=25):
        if not items:
            print(f"  ✓ {title}")
            return
        print(f"  ✗ {title}：{len(items)} 处")
        for a, b in items[:limit]:
            print(f"      {a}  →  {b}")
        if len(items) > limit:
            print(f"      …… 另有 {len(items) - limit} 处")

    print(f"vault 自检 @ {root}")
    print(f"  文件 {len(all_paths)} 个（md {len(mds)} 个）")
    for title, items in [
        ("悬空链接", bad_links),
        ("frontmatter", fm),
        (f"JSON 配置（{len(json_targets)} 个）", js),
        ("入库文件体积", sizes),
        ("配置已纳入版本控制", tracking),
    ]:
        report(title, items)

    if bad_links:
        for (rel, target), n in Counter(bad_links).most_common(5):
            if n > 1:
                print(f"      （重复 {n} 次）{target} ← {rel}")

    failed = bool(fm or js or sizes or tracking) or (args.strict and bad_links)
    print("结果：" + ("FAIL" if failed else "PASS"))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())

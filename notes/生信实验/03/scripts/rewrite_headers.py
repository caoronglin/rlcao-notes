#!/usr/bin/env python3
"""把 Entrez 导出的 FASTA 头改写成 BLAST 可解析的 gi|ref|acc| 形式，并保留物种信息。

输入：<prefix>_all.fa + <prefix>_meta.tsv（uid / accession_version / title）
输出：同目录 <prefix>_blast.fa
"""
import pathlib
import sys


def read_fasta(path):
    """按记录切分 FASTA，返回 [(header, seq)]。"""
    recs = []
    name = None
    chunks = []
    try:
        src = pathlib.Path(path)
    except (OSError, UnicodeDecodeError) as exc:
        raise RuntimeError(f"路径无效: {path}: {exc}") from exc
    try:
        text = src.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError) as exc:
        raise RuntimeError(f"读取失败: {path}: {exc}") from exc
    lines = text.splitlines()
    for line in lines:
        if line.startswith(">"):
            if name is not None:
                recs.append((name, "".join(chunks)))
            name = line[1:].strip()
            chunks = []
        else:
            chunks.append(line.strip())
    if name is not None:
        recs.append((name, "".join(chunks)))
    return recs


def build(fa_path, meta_path, out_path):
    """按元数据重写头并写出新 FASTA。"""
    meta = {}
    try:
        msrc = pathlib.Path(meta_path)
    except (OSError, UnicodeDecodeError) as exc:
        raise RuntimeError(f"路径无效: {meta_path}: {exc}") from exc
    try:
        mtext = msrc.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError) as exc:
        raise RuntimeError(f"读取失败: {meta_path}: {exc}") from exc
    meta_lines = mtext.splitlines()
    if meta_lines:
        header = meta_lines[0].split("\t")
        for line in meta_lines[1:]:
            parts = line.split("\t")
            row = dict(zip(header, parts, strict=False))
            if row.get("accession_version"):
                meta[row["accession_version"]] = row
    out = []
    n_ok = n_skip = 0
    for head, seq in read_fasta(fa_path):
        acc = head.split(None, 1)[0]
        row = meta.get(acc)
        if row is None:
            n_skip += 1
            continue
        title = row.get("title", "").replace("|", "/")
        out.append(f">gi|{row['uid']}|ref|{acc}| {title}\n{seq}\n")
        n_ok += 1
    try:
        pathlib.Path(out_path).write_text("".join(out), encoding="utf-8")
    except (OSError, UnicodeDecodeError) as exc:
        raise RuntimeError(f"写入失败: {out_path}: {exc}") from exc
    print(f"{out_path}: 写出 {n_ok} 条，跳过无元数据 {n_skip} 条")


if __name__ == "__main__":
    build(sys.argv[1], sys.argv[2], sys.argv[3])

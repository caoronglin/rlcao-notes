#!/usr/bin/env python3
"""实验三：按任务要求整理并保存同源序列（FASTA + 清单 CSV）。

三个文件：
  1. orthologs_EGF_protein_12.fa   12 条跨物种 EGF 直系同源蛋白（含 query 本身）
  2. paralogs_EGF_family_protein_10.fa  10 条人源 EGF 家族并系同源蛋白
  3. homologs_deltablast_27.fa     DELTA-BLAST 命中里按相似度分层抽取的 27 条同源蛋白

序列用 blastdbcmd 从本地 BLAST 库（db/protein/combined）按登录号取出，
不重新联网，保证与报告中的比对结果完全一致。
"""
from __future__ import annotations

import csv
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
BIN = ROOT / "tools/deb/usr/bin/blastdbcmd"
DB = ROOT / "db/protein/combined"
RES = ROOT / "results"
OUT = ROOT / "sequences"

COLS = ["qseqid", "sseqid", "pident", "length", "mismatch", "gapopen", "qstart", "qend",
        "sstart", "send", "evalue", "bitscore", "sscinames", "stitle"]

# 直系同源：物种 → (登录号, 说明)。登录号取自 t2a_blastp_default / t3b_deltablast 实测命中。
ORTHOLOGS = [
    ("Homo sapiens",        "sp|P01133|EGF_HUMAN",      "query 本身，UniProt Reviewed"),
    ("Pan troglodytes",     "XP_054539259.1", "黑猩猩"),
    ("Macaca fascicularis", "XP_005555736.3", "食蟹猴"),
    ("Mus musculus",        "sp|P01132|EGF_MOUSE",      "小鼠"),
    ("Rattus norvegicus",   "sp|P07522|EGF_RAT",        "大鼠"),
    ("Canis lupus familiaris", "sp|Q9BEA0|EGF_CANLF",   "犬"),
    ("Sus scrofa",          "NP_999185.1", "猪"),
    ("Gallus gallus",       "NP_001001292.2", "鸡"),
    ("Xenopus tropicalis",  "NP_001106478.1", "热带爪蟾"),
    ("Salmo salar",         "XP_014067426.1", "大西洋鲑"),
    ("Danio rerio",         "XP_087136465.1", "斑马鱼"),
    ("Oncorhynchus mykiss", "XP_021439780.2", "虹鳟"),
]

# 并系同源：人源 EGF 家族 10 个成员（同一基因组内由基因复制产生）
PARALOGS = [
    ("EGF",   "NP_001954.2",                   "epidermal growth factor"),
    ("TGFA",  "NP_003227.1",                   "transforming growth factor alpha"),
    ("AREG",  "NP_001648.1",                   "amphiregulin"),
    ("EREG",  "NP_001423.1",                   "epiregulin"),
    ("HBEGF", "NP_001936.1",                   "heparin-binding EGF-like growth factor"),
    ("BTC",   "sp|P35070|BTC_HUMAN",           "betacellulin"),
    ("NRG1",  "sp|Q02297|NRG1_HUMAN",          "neuregulin-1"),
    ("NRG2",  "sp|O14511|NRG2_HUMAN",          "neuregulin-2"),
    ("NRG3",  "sp|P56975|NRG3_HUMAN",          "neuregulin-3"),
    ("NRG4",  "sp|Q8WWG1|NRG4_HUMAN",          "neuregulin-4"),
]

# DELTA-BLAST 分层抽取的相似度区间（对 query 的 identity）
TIERS = [
    (">=95", 95.0, 100.1, 3),
    ("90-95", 90.0, 95.0, 3),
    ("80-90", 80.0, 90.0, 3),
    ("70-80", 70.0, 80.0, 3),
    ("60-70", 60.0, 70.0, 3),
    ("50-60", 50.0, 60.0, 3),
    ("40-50", 40.0, 50.0, 3),
    ("30-40", 30.0, 40.0, 3),
    ("<30", 0.0, 30.0, 3),
]


def load(name: str) -> list[dict]:
    """读一个 TSV，按 sseqid 去重（取 bitscore 最大的一条）。"""
    best: dict[str, dict] = {}
    with (RES / f"{name}.tsv").open(encoding="utf-8") as fh:
        for row in csv.reader(fh, delimiter="\t"):
            if len(row) < 14:
                continue
            rec = dict(zip(COLS, row))
            rec["evalue"] = float(rec["evalue"])
            rec["bitscore"] = float(rec["bitscore"])
            rec["pident"] = float(rec["pident"])
            rec["length"] = int(rec["length"])
            cur = best.get(rec["sseqid"])
            if cur is None or rec["bitscore"] > cur["bitscore"]:
                best[rec["sseqid"]] = rec
    return list(best.values())


def fetch(acc: str) -> str:
    """用 blastdbcmd 取一条序列的 FASTA（含表头）。acc 接受 sp|P01133|X 或 gi|..|ref|NP_..| 形式。"""
    acc = acc_of(acc)
    env = {"LD_LIBRARY_PATH": f"{ROOT/'tools/deb/usr/lib/ncbi-blast+'}:{ROOT/'tools/deb/usr/lib/x86_64-linux-gnu'}",
           "PATH": "/usr/bin:/bin"}
    p = subprocess.run([str(BIN), "-db", str(DB), "-entry", acc, "-outfmt", "%f"],
                       capture_output=True, text=True, env=env)
    if p.returncode != 0 or not p.stdout.startswith(">"):
        raise RuntimeError(f"blastdbcmd 取序列失败 {acc}: {p.stderr.strip()[:200]}")
    return p.stdout.strip()


def wrap(seq: str, width: int = 60) -> str:
    return "\n".join(seq[i:i + width] for i in range(0, len(seq), width))


def acc_of(sseqid: str) -> str:
    """从 BLAST 的 sseqid 里取出纯登录号（NP_003227.1 / P01133）。"""
    for tok in sseqid.split("|"):
        tok = tok.strip()
        if re.match(r"^[A-Z]{2}_[\d.]+$", tok):
            return tok
        if re.match(r"^[A-Z][A-Z0-9]{5}$", tok):  # UniProt accession，如 P01133
            return tok
    return sseqid


def species_of(title: str) -> str:
    """从 subject 标题推断物种名。"""
    m = re.search(r"\[([A-Z][a-z]+ [a-z]+)", title)
    if m:
        return m.group(1)
    m = re.search(r"OS=([A-Z][a-z]+ [a-z]+?)(?: OX=| GN=| PE=|$)", title)
    if m:
        return m.group(1)
    return "unknown"


def write_fasta(path: pathlib.Path, items: list[tuple[str, str]]) -> int:
    lines = []
    for header, seq in items:
        lines.append(f">{header}")
        lines.append(wrap(seq))
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return len(items)


def main() -> int:
    OUT.mkdir(exist_ok=True)
    t2a = {acc_of(r["sseqid"]): r for r in load("t2a_blastp_default")}
    t3b = {acc_of(r["sseqid"]): r for r in load("t3b_deltablast")}
    manifest: list[dict] = []

    # 1) 直系同源
    items = []
    for species, acc, note in ORTHOLOGS:
        key = acc_of(acc)
        rec = t2a.get(key) or t3b.get(key)
        pid = f"{rec['pident']:.1f}" if rec else ""
        ev = f"{rec['evalue']:.1e}" if rec else ""
        bits = f"{rec['bitscore']:.0f}" if rec else ""
        src = "blastp 默认" if key in t2a else ("DELTA-BLAST" if key in t3b else "")
        gene = acc_of(acc)
        header = f"{gene}|{species}|EGF_ortholog|pid_to_human={pid}%|E={ev}|bits={bits}"
        items.append((header, fetch(acc).split("\n", 1)[1].replace("\n", "")))
        manifest.append({"file": "orthologs_EGF_protein_12.fa", "type": "直系同源",
                         "gene": "EGF", "accession": acc, "species": species,
                         "pident_to_query": pid, "evalue": ev, "bitscore": bits,
                         "source_run": src, "note": note})
    n1 = write_fasta(OUT / "orthologs_EGF_protein_12.fa", items)

    # 2) 并系同源
    items = []
    for gene, acc, name in PARALOGS:
        key = acc_of(acc)
        rec = t2a.get(key) or t3b.get(key)
        pid = f"{rec['pident']:.1f}" if rec else ""
        ev = f"{rec['evalue']:.1e}" if rec else ""
        bits = f"{rec['bitscore']:.0f}" if rec else ""
        aln = f"{rec['length']}" if rec else ""
        header = f"{gene}|Homo sapiens|EGF_family_paralog|pid_to_EGF={pid}%|aln_len={aln}|E={ev}|bits={bits}"
        items.append((header, fetch(acc).split("\n", 1)[1].replace("\n", "")))
        manifest.append({"file": "paralogs_EGF_family_protein_10.fa", "type": "并系同源",
                         "gene": gene, "accession": acc, "species": "Homo sapiens",
                         "pident_to_query": pid, "evalue": ev, "bitscore": bits,
                         "source_run": "blastp 默认", "note": name})
    n2 = write_fasta(OUT / "paralogs_EGF_family_protein_10.fa", items)

    # 3) DELTA-BLAST 分层抽样
    items, seen = [], set()
    for label, lo, hi, want in TIERS:
        pool = [r for r in t3b.values()
                if lo <= r["pident"] < hi and r["length"] >= 50 and r["sseqid"] not in seen]
        pool.sort(key=lambda r: -r["bitscore"])
        picked, species = [], set()
        for r in pool:  # 每层优先取不同物种
            sp = species_of(r["stitle"])
            if sp in species:
                continue
            species.add(sp)
            picked.append((r, sp))
            if len(picked) >= want:
                break
        for r, sp in picked:
            seen.add(r["sseqid"])
            acc = acc_of(r["sseqid"])
            gene = acc
            header = (f"{gene}|{sp}|DELTA-BLAST 命中|tier={label}|pid={r['pident']:.1f}%"
                      f"|aln={r['length']}|E={r['evalue']:.1e}|bits={r['bitscore']:.0f}")
            items.append((header, fetch(acc).split("\n", 1)[1].replace("\n", "")))
            manifest.append({"file": "homologs_deltablast_27.fa", "type": f"DELTA-BLAST {label}",
                             "gene": acc, "accession": r["sseqid"], "species": sp,
                             "pident_to_query": f"{r['pident']:.1f}", "evalue": f"{r['evalue']:.1e}",
                             "bitscore": f"{r['bitscore']:.0f}", "source_run": "DELTA-BLAST",
                             "note": r["stitle"][:80]})
    n3 = write_fasta(OUT / "homologs_deltablast_27.fa", items)

    with (OUT / "homologs_manifest.csv").open("w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(manifest[0].keys()))
        w.writeheader()
        w.writerows(manifest)

    print(f"直系同源 {n1} 条 → orthologs_EGF_protein_12.fa")
    print(f"并系同源 {n2} 条 → paralogs_EGF_family_protein_10.fa")
    print(f"DELTA-BLAST 分层 {n3} 条 → homologs_deltablast_27.fa")
    print(f"清单 → homologs_manifest.csv（{len(manifest)} 行）")
    return 0


if __name__ == "__main__":
    sys.exit(main())

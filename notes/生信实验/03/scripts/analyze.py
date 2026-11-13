#!/usr/bin/env python3
"""实验三 BLAST 结果的汇总统计。

输入：results/*.tsv（BLAST+ tabular 格式，14 列）
输出：data/*.csv（报告用的数据表，可复现）

统计口径：
  - 命中数按「去重后的受检序列（subject）」计，不按 HSP 计；
  - 每个 subject 取 bitscore 最大的一条 HSP 作为代表；
  - 物种从 subject 标题解析：UniProt `OS=xxx` / RefSeq `[Genus species]` / Ensembl `species|前缀`。
"""
from __future__ import annotations

import csv
import pathlib
import re
import sys
from collections import Counter, defaultdict

ROOT = pathlib.Path(__file__).resolve().parent.parent
RES = ROOT / "results"
DATA = ROOT / "data"

COLS = [
    "qseqid", "sseqid", "pident", "length", "mismatch", "gapopen",
    "qstart", "qend", "sstart", "send", "evalue", "bitscore", "sscinames", "stitle",
]

ENSEMBL_RE = re.compile(r"^([a-z]+_[a-z]+)\|")
UNIPROT_OS_RE = re.compile(r"OS=([^ ]+?)(?: OX=|$)")
REFSEQ_SPE_RE = re.compile(r"\[([A-Z][a-z]+ [a-z]+)\]\s*$")
REFSEQ_TITLE_RE = re.compile(r"^(\S.*?)\s*\[[A-Z][a-z]+ [a-z]+\]$")


PREDICTED_SPE_RE = re.compile(r"(?:PREDICTED:|LOW QUALITY PROTEIN:)\s*([A-Z][a-z]+ [a-z]+)")


def _taxon(name: str) -> str:
    """把 ensembl 的 homo_sapiens 归一成 Homo sapiens。"""
    parts = name.split()
    return " ".join([parts[0].capitalize()] + [w.lower() for w in parts[1:]])


def species_of(sseqid: str, title: str) -> str:
    """从 subject ID 与标题推断物种名。"""
    m = ENSEMBL_RE.match(sseqid)
    if m:
        return _taxon(m.group(1).replace("_", " "))
    m = UNIPROT_OS_RE.search(title)
    if m:
        return m.group(1)
    m = REFSEQ_SPE_RE.search(title)
    if m:
        return m.group(1)
    m = PREDICTED_SPE_RE.search(title)
    if m:
        return m.group(1)
    m = REFSEQ_TITLE_RE.search(title)
    if m:
        return m.group(1).split(" ")[0]
    return "unknown"


def load(name: str) -> list[dict]:
    """读一个 TSV，返回按 sseqid 去重后的代表命中列表。"""
    path = RES / f"{name}.tsv"
    best: dict[str, dict] = {}
    with path.open(encoding="utf-8") as fh:
        reader = csv.reader(fh, delimiter="\t")
        for row in reader:
            if len(row) < 14:
                continue
            rec = dict(zip(COLS, row))
            rec["evalue"] = float(rec["evalue"])
            rec["bitscore"] = float(rec["bitscore"])
            rec["pident"] = float(rec["pident"])
            rec["length"] = int(rec["length"])
            rec["mismatch"] = int(rec["mismatch"])
            rec["gapopen"] = int(rec["gapopen"])
            rec["species"] = species_of(rec["sseqid"], rec["stitle"])
            cur = best.get(rec["sseqid"])
            if cur is None or (rec["bitscore"], -rec["evalue"]) > (cur["bitscore"], -cur["evalue"]):
                best[rec["sseqid"]] = rec
    return list(best.values())


def n_hsp(name: str) -> int:
    with (RES / f"{name}.tsv").open(encoding="utf-8") as fh:
        return sum(1 for _ in fh)


def elapsed(name: str) -> float:
    p = RES / f"{name}.time"
    return float(p.read_text().strip()) if p.exists() else float("nan")


def summarize(name: str, label: str, group: str, note: str = "") -> dict:
    """给一次搜索算一组汇总指标。"""
    hits = load(name)
    ev = [h["evalue"] for h in hits]
    return {
        "group": group,
        "run": name,
        "label": label,
        "note": note,
        "hsp": n_hsp(name),
        "subjects": len(hits),
        "species": len({h["species"] for h in hits}),
        "e005": sum(1 for e in ev if e < 0.005),
        "e1": sum(1 for e in ev if e < 1),
        "best_evalue": min(ev) if ev else float("nan"),
        "best_bitscore": max((h["bitscore"] for h in hits), default=float("nan")),
        "top_pident": max((h["pident"] for h in hits), default=float("nan")),
        "seconds": elapsed(name),
    }


def write_csv(path: pathlib.Path, rows: list[dict], header: list[str] | None = None) -> None:
    if not rows:
        return
    header = header or list(rows[0].keys())
    with path.open("w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=header)
        w.writeheader()
        w.writerows(rows)


def top_table(name: str, label: str, group: str, n: int = 10) -> list[dict]:
    """取前 n 条命中，按 sseqid 去重（同一序列的多个 HSP 只留最高分那个）。

    不去重时，前 10 条会被同一个序列的重复 HSP 占满（blastn 默认搜索里
    NM_001963.6 自己就有 3 个 HSP 进前 10），算法对比就失去意义。
    """
    hits = sorted(load(name), key=lambda h: (-h["bitscore"], h["evalue"]))
    rows, seen = [], set()
    for h in hits:
        if h["sseqid"] in seen:
            continue
        seen.add(h["sseqid"])
        rows.append(h)
        if len(rows) >= n:
            break
    out = []
    for i, h in enumerate(rows, 1):
        out.append({
            "group": group, "run": name, "label": label, "rank": i,
            "species": h["species"], "sseqid": h["sseqid"],
            "pident": h["pident"], "length": h["length"],
            "evalue": h["evalue"], "bitscore": h["bitscore"],
            "title": h["stitle"][:110],
        })
    return out


def main() -> None:
    DATA.mkdir(exist_ok=True)
    t1 = [
        ("t1a_blastn_default", "blastn（默认）", "算法对比"),
        ("t1b_megablast", "megablast", "算法对比"),
        ("t1c_dcmegablast", "discontiguous megablast", "算法对比"),
        ("t1d_blastn_w7", "blastn word_size 7", "word size"),
        ("t1e_blastn_w11", "blastn word_size 11", "word size"),
        ("t1f_blastn_w15", "blastn word_size 15", "word size"),
        ("t1g_blastn_e1e50", "blastn E=1e-50", "E 值"),
        ("t1h_blastn_e1e5", "blastn E=1e-5", "E 值"),
        ("t1i_blastn_e1000", "blastn E=1000", "E 值"),
    ]
    t2 = [
        ("t2a_blastp_default", "blastp（默认）", "全长蛋白"),
        ("t2b_blastp_w2", "blastp word_size 2", "word size"),
        ("t2c_blastp_w6", "blastp word_size 6", "word size"),
        ("t2d_blastp_blosum45", "blastp BLOSUM45", "替换矩阵"),
        ("t2e_blastp_blosum90", "blastp BLOSUM90", "替换矩阵"),
        ("t2f_blastp_e1e3", "blastp E=1e-3", "E 值"),
        ("t2g_blastp_e1000", "blastp E=1000", "E 值"),
        ("t2h_blastp_short_def", "27 aa 短片段（默认）", "短序列"),
        ("t2i_blastp_short_w2", "27 aa 短片段 word_size 2", "短序列"),
        ("t2j_blastp_short_w3", "27 aa 短片段 word_size 3", "短序列"),
    ]
    t4 = [
        ("t4a_blastx", "BLASTX（mRNA 查蛋白库）", "翻译搜索"),
        ("t4b_tblastx_small", "TBLASTX（mRNA 查家族 mRNA 库）", "翻译搜索"),
        ("t4c_blastn_small", "BLASTN（mRNA 查家族 mRNA 库）", "翻译搜索"),
        ("t4d_tblastx_human", "TBLASTX（mRNA 查人 cDNA 库）", "翻译搜索"),
    ]

    summ, tops = [], []
    for group, items in (("任务一 BLASTN", t1), ("任务二 BLASTP", t2), ("任务四 翻译搜索", t4)):
        for name, label, sub in items:
            summ.append(summarize(name, label, f"{group}·{sub}"))
            tops.extend(top_table(name, label, f"{group}·{sub}"))
    write_csv(DATA / "t1_t2_t4_summary.csv", summ)
    write_csv(DATA / "t1_t2_t4_top10.csv", tops)

    # PSI-BLAST 逐轮
    psi_rows = []
    prev: set[str] = set()
    for k in range(1, 13):
        name = f"psi_round{k}"
        if not (RES / f"{name}.tsv").exists():
            break
        hits = load(name)
        cur = {h["sseqid"] for h in hits}
        new = cur - prev
        new_hits = [h for h in hits if h["sseqid"] in new]
        new_hits.sort(key=lambda h: (-h["bitscore"], h["evalue"]))
        best = hits[0] if hits else None
        best_new = new_hits[0] if new_hits else None
        psi_rows.append({
            "round": k,
            "subjects": len(cur),
            "e005": sum(1 for h in hits if h["evalue"] < 0.005),
            "new_vs_prev": len(new),
            "species": len({h["species"] for h in hits}),
            "new_species": len({h["species"] for h in new_hits}),
            "top_bitscore": best["bitscore"] if best else "",
            "top_evalue": best["evalue"] if best else "",
            "top_species": best["species"] if best else "",
            "new_best_bitscore": best_new["bitscore"] if best_new else "",
            "new_best_evalue": best_new["evalue"] if best_new else "",
            "new_best_species": best_new["species"] if best_new else "",
            "new_best_title": (best_new["stitle"][:100] if best_new else ""),
            "seconds": elapsed(name),
        })
        prev = cur
    write_csv(DATA / "psi_rounds.csv", psi_rows)

    # DELTA-BLAST（若已跑完）
    if (RES / "t3b_deltablast.tsv").exists() and (RES / "t3b_deltablast.tsv").stat().st_size > 0:
        d = summarize("t3b_deltablast", "DELTA-BLAST", "任务三·DELTA-BLAST")
        write_csv(DATA / "delta_summary.csv", [d])
        write_csv(DATA / "delta_top10.csv", top_table("t3b_deltablast", "DELTA-BLAST", "任务三·DELTA-BLAST"))

    # 物种组成：任务一三种算法、任务二默认
    comp = []
    for name, label in (("t1a_blastn_default", "blastn 默认"),
                        ("t1b_megablast", "megablast"),
                        ("t1c_dcmegablast", "discontiguous megablast"),
                        ("t2a_blastp_default", "blastp 默认"),
                        ("t1d_blastn_w7", "blastn word_size 7"),
                        ("t1f_blastn_w15", "blastn word_size 15")):
        c = Counter(h["species"] for h in load(name))
        for sp, n in c.most_common():
            comp.append({"run": name, "label": label, "species": sp, "subjects": n})
    write_csv(DATA / "species_composition.csv", comp)

    print("汇总完成：")
    for row in summ:
        print(f"  {row['label']:<32} HSP={row['hsp']:>7} 序列={row['subjects']:>6} "
              f"物种={row['species']:>3} E<0.005={row['e005']:>6} {row['seconds']:.1f}s")
    for row in psi_rows:
        print(f"  PSI 轮 {row['round']}: 序列 {row['subjects']} 新增 {row['new_vs_prev']} "
              f"E<0.005 {row['e005']} {row['seconds']:.1f}s")


if __name__ == "__main__":
    sys.exit(main())

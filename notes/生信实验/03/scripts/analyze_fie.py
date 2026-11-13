#!/usr/bin/env python3
"""Summarise the ZmFIE1 BLAST runs for the experiment-3 report."""
import csv
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
RES = ROOT / "results"
DATA = ROOT / "data"
DATA.mkdir(exist_ok=True)

COLS = [
    "qseqid", "sseqid", "pident", "length", "mismatch", "gapopen",
    "qstart", "qend", "sstart", "send", "evalue", "bitscore", "sscinames", "stitle",
]
ENSEMBL_RE = re.compile(r"^([a-z]+_[a-z]+)\|")
UNIPROT_OS_RE = re.compile(r"OS=(.+?) OX=")
REFSEQ_SPE_RE = re.compile(r"\[([A-Z][a-z]+ [a-z]+)\]\s*$")
PREDICTED_RE = re.compile(r"PREDICTED:\s*([A-Z][a-z]+ [a-z]+)")
BINOMIAL_RE = re.compile(r"^(?:[A-Z]{2}_\d+\.\d+\s+)?([A-Z][a-z]+ [a-z]+)\b")


def species_of(sseqid, title):
    m = ENSEMBL_RE.match(sseqid)
    if m:
        parts = m.group(1).split("_")
        return parts[0].capitalize() + " " + parts[1]
    m = UNIPROT_OS_RE.search(title)
    if m:
        return m.group(1)
    m = REFSEQ_SPE_RE.search(title)
    if m:
        return m.group(1)
    m = PREDICTED_RE.search(title)
    if m:
        return m.group(1)
    m = BINOMIAL_RE.match(title)
    if m:
        return m.group(1)
    return "unknown"


def load(name):
    best = {}
    with (RES / f"{name}.tsv").open(encoding="utf-8") as fh:
        for row in csv.reader(fh, delimiter="\t"):
            if len(row) < 14:
                continue
            rec = dict(zip(COLS, row))
            rec["evalue"] = float(rec["evalue"])
            rec["bitscore"] = float(rec["bitscore"])
            rec["pident"] = float(rec["pident"])
            rec["length"] = int(rec["length"])
            rec["species"] = species_of(rec["sseqid"], rec["stitle"])
            old = best.get(rec["sseqid"])
            if old is None or rec["bitscore"] > old["bitscore"]:
                best[rec["sseqid"]] = rec
    return list(best.values())


def n_hsp(name):
    with (RES / f"{name}.tsv").open(encoding="utf-8") as fh:
        return sum(1 for _ in fh)


def elapsed(name):
    p = RES / f"{name}.time"
    return float(p.read_text().strip()) if p.exists() else float("nan")


def summarise(name, label, group):
    hits = load(name)
    ev = [h["evalue"] for h in hits]
    return {
        "group": group,
        "run": name,
        "label": label,
        "hsp": n_hsp(name),
        "subjects": len(hits),
        "species": len({h["species"] for h in hits}),
        "e005": sum(1 for e in ev if e < 0.005),
        "best_bitscore": max((h["bitscore"] for h in hits), default=0),
        "best_pident": max((h["pident"] for h in hits), default=0),
        "seconds": elapsed(name),
    }


def top(name, label, group, n=10):
    hits = sorted(load(name), key=lambda h: (-h["bitscore"], h["evalue"]))
    out = []
    for i, h in enumerate(hits[:n], 1):
        out.append({
            "group": group, "run": name, "label": label, "rank": i,
            "species": h["species"], "sseqid": h["sseqid"],
            "pident": h["pident"], "length": h["length"],
            "evalue": h["evalue"], "bitscore": h["bitscore"],
            "title": h["stitle"][:130],
        })
    return out


def write(path, rows):
    if not rows:
        return
    with path.open("w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0]))
        w.writeheader()
        w.writerows(rows)


t1 = [
    ("fie_t1a_blastn_default", "blastn（默认）", "算法"),
    ("fie_t1b_megablast", "megablast", "算法"),
    ("fie_t1c_dcmegablast", "discontiguous megablast", "算法"),
    ("fie_t1d_blastn_w7", "blastn word_size 7", "word size"),
    ("fie_t1e_blastn_w11", "blastn word_size 11", "word size"),
    ("fie_t1f_blastn_w15", "blastn word_size 15", "word size"),
    ("fie_t1g_blastn_e1e50", "blastn E=1e-50", "E 值"),
    ("fie_t1h_blastn_e1e5", "blastn E=1e-5", "E 值"),
    ("fie_t1i_blastn_e1000", "blastn E=1000", "E 值"),
]
t2 = [
    ("fie_t2a_blastp_default", "blastp（默认）", "全长"),
    ("fie_t2b_blastp_w2", "blastp word_size 2", "word size"),
    ("fie_t2c_blastp_w6", "blastp word_size 6", "word size"),
    ("fie_t2d_blastp_blosum45", "blastp BLOSUM45", "矩阵"),
    ("fie_t2e_blastp_blosum90", "blastp BLOSUM90", "矩阵"),
    ("fie_t2f_blastp_e1e3", "blastp E=1e-3", "E 值"),
    ("fie_t2g_blastp_e1000", "blastp E=1000", "E 值"),
    ("fie_t2h_short_default", "27 aa 片段（blastp-short，word 2）", "短序列"),
    ("fie_t2j_short_w3", "27 aa 片段 word_size 3", "短序列"),
]
# 任务四：三个搜索统一到 plant_combined 尺度（蛋白库 576,022 / 核酸库 652,197），
# 并配同库的直接搜索 BLASTP / BLASTN 作对照；家族小库（280 条）单独作库规模对照。
t4 = [
    ("fie_t4a_blastx_plant", "BLASTX：mRNA → 蛋白库", "翻译搜索"),
    ("fie_t4d_blastp_e1e5", "BLASTP：蛋白 → 蛋白库（同库对照）", "翻译搜索"),
    ("fie_t4b_tblastx_plant", "TBLASTX：mRNA → 核酸库", "翻译搜索"),
    ("fie_t4c_blastn_plant", "BLASTN：mRNA → 核酸库（同库对照）", "翻译搜索"),
    ("fie_t4b_tblastx_fam", "TBLASTX：mRNA → 家族小库 280 条", "库规模对照"),
    ("fie_t4c_blastn_fam", "BLASTN：mRNA → 家族小库 280 条", "库规模对照"),
]

summary, tops = [], []
for group, items in (("BLASTN", t1), ("BLASTP", t2), ("翻译搜索", t4)):
    for name, label, sub in items:
        summary.append(summarise(name, label, f"{group}·{sub}"))
        tops.extend(top(name, label, f"{group}·{sub}"))

delta = summarise("fie_t3_deltablast", "DELTA-BLAST", "DELTA-BLAST")
summary.append(delta)
tops.extend(top("fie_t3_deltablast", "DELTA-BLAST", "DELTA-BLAST"))

write(DATA / "fie_summary.csv", summary)
write(DATA / "fie_top10.csv", tops)

psi = []
prev = set()
for k in range(1, 13):
    name = f"fie_psi_round{k}"
    if not (RES / f"{name}.tsv").exists():
        break
    hits = load(name)
    cur = {h["sseqid"] for h in hits}
    new = cur - prev
    new_hits = sorted((h for h in hits if h["sseqid"] in new), key=lambda h: -h["bitscore"])
    best = max(hits, key=lambda h: h["bitscore"]) if hits else None
    best_new = new_hits[0] if new_hits else None
    psi.append({
        "round": k,
        "subjects": len(cur),
        "e005": sum(1 for h in hits if h["evalue"] < 0.005),
        "new": len(new),
        "species": len({h["species"] for h in hits}),
        "top_bitscore": best["bitscore"] if best else "",
        "top_evalue": best["evalue"] if best else "",
        "top_species": best["species"] if best else "",
        "new_best_bitscore": best_new["bitscore"] if best_new else "",
        "new_best_evalue": best_new["evalue"] if best_new else "",
        "new_best_species": best_new["species"] if best_new else "",
        "new_best_title": best_new["stitle"][:110] if best_new else "",
        "seconds": elapsed(name),
    })
    prev = cur
write(DATA / "fie_psi_rounds.csv", psi)

comp = []
for name, label in [
    ("fie_t1a_blastn_default", "blastn 默认"),
    ("fie_t1b_megablast", "megablast"),
    ("fie_t1c_dcmegablast", "discontiguous megablast"),
    ("fie_t2a_blastp_default", "blastp 默认"),
    ("fie_t3_deltablast", "DELTA-BLAST"),
]:
    counts = {}
    for h in load(name):
        counts[h["species"]] = counts.get(h["species"], 0) + 1
    for sp, n in sorted(counts.items(), key=lambda x: -x[1]):
        comp.append({"run": name, "label": label, "species": sp, "subjects": n})
write(DATA / "fie_species.csv", comp)

for row in summary:
    print(f"{row['label']:<34} HSP={row['hsp']:>7} 序列={row['subjects']:>6} "
          f"物种={row['species']:>3} E<0.005={row['e005']:>6} {row['seconds']:.2f}s")
for row in psi:
    print(f"PSI {row['round']:>2}: 序列={row['subjects']:>5} 新增={row['new']:>5} "
          f"E<0.005={row['e005']:>5} 新增最佳={row['new_best_bitscore']} {row['new_best_species']}")

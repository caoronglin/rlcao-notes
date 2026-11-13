#!/usr/bin/env python3
"""实验三任务四：Translated BLAST 与直接搜索的同一库对照分析。

比较对象（全部 query = ZmFIE1 mRNA NM_001111711.1，E<=1e-5）：
  BLASTX    mRNA -> 蛋白库 plant_combined (576,022)
  BLASTP   蛋白  -> 蛋白库 plant_combined (576,022)   [直接搜索对照]
  TBLASTX  mRNA -> 核酸库 plant_combined (652,197)
  BLASTN   mRNA -> 核酸库 plant_combined (652,197)   [直接搜索对照]
另外保留家族小库（280 条 FIE mRNA）作为"库规模决定命中上限"的对照。

物种名从 stitle 末尾的 [Species] 解析（本地库无 taxdb，sscinames 为 N/A）。
"""
import csv
import pathlib
import re

RES = pathlib.Path(__file__).resolve().parent.parent / "results"
DATA = pathlib.Path(__file__).resolve().parent.parent / "data"

RUNS = [
    ("BLASTX",  "fie_t4a_blastx_plant",  "mRNA → 蛋白库", "plant_combined 蛋白库 576,022"),
    ("BLASTP",  "fie_t4d_blastp_e1e5",   "蛋白 → 蛋白库", "plant_combined 蛋白库 576,022"),
    ("TBLASTX", "fie_t4b_tblastx_plant", "mRNA → 核酸库", "plant_combined 核酸库 652,197"),
    ("BLASTN",  "fie_t4c_blastn_plant",  "mRNA → 核酸库", "plant_combined 核酸库 652,197"),
    ("TBLASTX*", "fie_t4b_tblastx_fam",  "mRNA → 家族小库", "FIE 家族 mRNA 280 条"),
    ("BLASTN*", "fie_t4c_blastn_fam",    "mRNA → 家族小库", "FIE 家族 mRNA 280 条"),
]

SPECIES_RE = re.compile(r"\[([^\[\]]+)\]\s*$")


def species_of(sseqid, sci, title):
    """RefSeq 的 stitle 以 [Species] 结尾；Ensembl Plants 用 species|transcript 前缀。"""
    m = SPECIES_RE.search(title)
    if m:
        return m.group(1)
    if "|" in sseqid:
        head = sseqid.split("|", 1)[0].replace("_", " ")
        if head and not head.startswith(("ref", "sp", "gi", "emb", "dbj")):
            return head
    if sci not in ("N/A", "", "unknown"):
        return sci
    return "unknown"


def load(name):
    rows = []
    with open(RES / f"{name}.tsv", newline="", encoding="utf-8") as f:
        for line in f:
            parts = line.rstrip("\n").split("\t")
            if len(parts) < 14:
                continue
            q, s, pident, alen, mm, go, qs, qe, ss, se, ev, bits, sci, title = parts[:14]
            sp = species_of(s, sci, title)
            try:
                rows.append(dict(subject=s, pident=float(pident), alen=int(alen),
                                 evalue=float(ev), bits=float(bits),
                                 species=sp, title=title))
            except ValueError:
                continue
    return rows


def best_per_subject(rows):
    """同一 subject 的多个 HSP 只留最高分，得到去重后的命中序。"""
    best = {}
    for r in rows:
        k = r["subject"]
        if k not in best or r["bits"] > best[k]["bits"]:
            best[k] = r
    return list(best.values())


def seconds(name):
    p = RES / f"{name}.time"
    return float(p.read_text().strip()) if p.exists() else float("nan")


summary, tops = [], {}
for label, run, arrow, dblabel in RUNS:
    rows = load(run)
    uniq = best_per_subject(rows)
    uniq.sort(key=lambda r: -r["bits"])
    species = {r["species"] for r in uniq}
    species.discard("unknown")
    summary.append(dict(
        search=label, run=run, query_db=arrow, database=dblabel,
        hsp=len(rows), subjects=len(uniq), species=len(species),
        e005=sum(1 for r in uniq if r["evalue"] < 0.005),
        best_bits=round(uniq[0]["bits"], 1) if uniq else 0,
        top_pident=round(uniq[0]["pident"], 1) if uniq else 0,
        seconds=round(seconds(run), 2),
    ))
    tops[label] = uniq

with open(DATA / "t4_translated_summary.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=list(summary[0]))
    w.writeheader()
    w.writerows(summary)

# 前 10 名重合度
def top10_overlap(a, b):
    A = [r["subject"] for r in tops[a][:10]]
    B = [r["subject"] for r in tops[b][:10]]
    return len(set(A) & set(B)), A, B


paired = [("BLASTX", "BLASTP"), ("TBLASTX", "BLASTN")]
lines = []
for a, b in paired:
    n, A, B = top10_overlap(a, b)
    lines.append(f"{a} vs {b}: 前 10 重合 {n}/10")
    for i, (x, y) in enumerate(zip(A, B), 1):
        flag = "" if x == y else "  <-- 不同"
        lines.append(f"  {i:2d} {x:<24} {y:<24}{flag}")

# 集合差：翻译搜索独有 vs 直接搜索独有
def diff(a, b):
    A = {r["subject"]: r for r in tops[a]}
    B = {r["subject"] for r in tops[b]}
    only = sorted((A[s] for s in A if s not in B), key=lambda r: -r["bits"])
    return only

for a, b in paired:
    only = diff(a, b)
    lines.append(f"\n{a} 独有的 subject（{b} 未检出）：{len(only)} 条")
    for r in only[:12]:
        lines.append(f"  {r['subject']:<26} {r['pident']:5.1f}%  len={r['alen']:<5} "
                     f"E={r['evalue']:.2e} bits={r['bits']:.0f}  {r['species']}")

# 家族小库 vs 大库：命中上限
lines.append("\n库规模对照（同一 query、同一程序）：")
for big, small in [("TBLASTX", "TBLASTX*"), ("BLASTN", "BLASTN*")]:
    lines.append(f"  {big}: {summary[[s['search'] for s in summary].index(big)]['subjects']} 条 subject  →  "
                 f"{small}（280 条小库）: {summary[[s['search'] for s in summary].index(small)]['subjects']} 条 subject")

report = "\n".join(lines)
(DATA / "t4_translated_compare.txt").write_text(report + "\n", encoding="utf-8")
print("\n".join(f"{s['search']:<10} {s['database']:<28} HSP={s['hsp']:<6} subject={s['subjects']:<5} "
                f"species={s['species']:<4} E<0.005={s['e005']:<5} best={s['best_bits']:<7} {s['seconds']}s"
                for s in summary))
print()
print(report)

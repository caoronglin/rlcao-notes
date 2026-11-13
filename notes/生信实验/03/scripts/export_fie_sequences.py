import csv
import pathlib
import re
import urllib.parse
import urllib.request

BASE = pathlib.Path(__file__).resolve().parent.parent
SEQ = BASE / "sequences"
SEQ.mkdir(exist_ok=True)
TWO = BASE.parent / "02" / "sequences"
TWO.mkdir(exist_ok=True)
E = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
EMAIL = "caoronglin@users.noreply.github.com"

orthologs = [
    "NP_001105181.1", "XP_002443823.1", "XP_006659098.1", "XP_066168940.1",
    "XP_047073679.1", "XP_044431131.1", "XP_044958711.1", "XP_010906361.1",
    "XP_065007749.1", "NP_188710.1",
]
paralogs = [
    "NP_001105182.1", "XP_002443822.1", "XP_004972907.1", "XP_039852764.1",
    "XP_025820977.1", "XP_066326110.1", "XP_062196520.1", "XP_003573353.1",
    "XP_022935834.1", "XP_007211457.1",
]
core_protein = {
    "ZmFIE1": "NP_001105181.1",
    "OsFIE1": "NP_001409834.1",
    "SbFIE1": "XP_002443823.1",
    "TaFIE1": "XP_044422620.1",
    "HvFIE1": "XP_044958711.1",
    "ZmFIE2": "NP_001105182.1",
    "OsFIE2": "XP_015649120.1",
    "SbFIE2": "XP_002443822.1",
    "TaFIE2": "XP_044444471.1",
    "BdFIE2": "XP_003571503.1",
}
core_mrna = {
    "ZmFIE1": "NM_001111711.1",
    "OsFIE1": "NM_001422905.1",
    "SbFIE1": "XM_002443778.2",
    "TaFIE1": "XM_044566685.1",
    "HvFIE1": "XM_045102776.1",
    "ZmFIE2": "NM_001111712.1",
    "OsFIE2": "XM_015793634.2",
    "SbFIE2": "XM_002443777.2",
    "TaFIE2": "XM_044588536.1",
    "BdFIE2": "XM_003571455.4",
}


def fetch(db, acc):
    params = urllib.parse.urlencode(
        {"db": db, "id": acc, "rettype": "fasta", "retmode": "text", "email": EMAIL}
    )
    return urllib.request.urlopen(E + "efetch.fcgi?" + params, timeout=90).read().decode()


def fetch_many(db, accessions, out, prefix=""):
    records = []
    for acc in accessions:
        text = fetch(db, acc)
        records.append(text)
    out.write_text("".join(records))
    print(out, len(records), "records")


fetch_many("protein", orthologs, SEQ / "fie_orthologs_12.fasta")
fetch_many("protein", paralogs, SEQ / "fie_paralogs_10.fasta")

lines = []
for name, acc in core_protein.items():
    text = fetch("protein", acc)
    first, rest = text.split("\n", 1)
    lines.append(f">{name}|{first[1:]}\n{rest}")
(SEQ / "fie_core_proteins.fasta").write_text("".join(lines))
lines = []
for name, acc in core_mrna.items():
    text = fetch("nuccore", acc)
    first, rest = text.split("\n", 1)
    lines.append(f">{name}|{first[1:]}\n{rest}")
(TWO / "FIE_family_mRNA.fasta").write_text("".join(lines))
print("core protein/mRNA written")

rows = []
for line in csv.reader(open(BASE / "results" / "fie_t3_deltablast.tsv"), delimiter="\t"):
    if len(line) < 14:
        continue
    acc = line[1].split("|")[1] if line[1].startswith("ref|") else line[1]
    pid = float(line[2])
    title = line[13]
    m = re.search(r"\[([^\]]+)\]$", title)
    sp = m.group(1) if m else ""
    if not sp or "FIE" not in title and "fertilization" not in title.lower():
        continue
    rows.append((acc, pid, sp, title))

# one record per accession, keep the best identity
best = {}
for acc, pid, sp, title in rows:
    if acc not in best or pid > best[acc][1]:
        best[acc] = (acc, pid, sp, title)


def pick(lo, hi, n):
    out = []
    for acc, pid, sp, title in sorted(best.values(), key=lambda x: -x[1]):
        if lo <= pid < hi and all(sp != x[2] for x in out):
            out.append((acc, pid, sp, title))
        if len(out) >= n:
            break
    return out


layers = []
layers += pick(95, 101, 1)
layers += pick(90, 95, 1)
layers += pick(80, 90, 1)
layers += pick(70, 80, 7)
layers += pick(60, 70, 7)
layers += pick(50, 60, 3)
layers += pick(40, 50, 1)
layers += pick(30, 40, 1)

with (SEQ / "fie_delta_layers.tsv").open("w", newline="") as fh:
    w = csv.writer(fh, delimiter="\t")
    w.writerow(["accession", "pident", "species", "title", "bin"])
    for acc, pid, sp, title in layers:
        w.writerow([acc, pid, sp, title, "layered"])

texts = []
for acc, pid, sp, title in layers:
    text = fetch("protein", acc)
    first, rest = text.split("\n", 1)
    texts.append(f">pident_{pid:.1f}|{first[1:]}\n{rest}")
(SEQ / "fie_delta_layers.fasta").write_text("".join(texts))
print("delta layers", len(layers))

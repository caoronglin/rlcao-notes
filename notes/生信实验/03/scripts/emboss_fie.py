import pathlib
import time
import urllib.parse
import urllib.request

BASE = pathlib.Path(__file__).resolve().parent.parent
SEQ = BASE / "queries" / "fie"
OUT = BASE.parent / "02" / "emboss_results_fie"
OUT.mkdir(parents=True, exist_ok=True)
EMAIL = "bioinfo.course@outlook.com"
API = "https://www.ebi.ac.uk/Tools/services/rest"


def read(name):
    return (SEQ / name).read_text()


def run(program, a, b, matrix, stype, tag):
    data = urllib.parse.urlencode({
        "email": EMAIL,
        "asequence": read(a),
        "bsequence": read(b),
        "stype": stype,
        "matrix": matrix,
        "gapopen": "10.0",
        "gapextend": "0.5",
    }).encode()
    req = urllib.request.Request(f"{API}/emboss_{program}/run", data=data)
    job = urllib.request.urlopen(req, timeout=120).read().decode().strip()
    for _ in range(60):
        status = urllib.request.urlopen(
            f"{API}/emboss_{program}/status/{job}", timeout=60).read().decode().strip()
        if status == "FINISHED":
            break
        if status in {"ERROR", "FAILURE", "NOT_FOUND"}:
            raise RuntimeError(f"{tag}: {status}")
        time.sleep(2)
    text = urllib.request.urlopen(
        f"{API}/emboss_{program}/result/{job}/out", timeout=120).read().decode()
    path = OUT / f"{tag}.txt"
    path.write_text(text)
    print(f"{tag}\t{job}\t{path.stat().st_size}")


jobs = [
    ("needle", "ZmFIE1_mRNA.fa", "OsFIE1_mRNA.fa", "EDNAFULL", "dna", "NA_needle_DNAfull"),
    ("needle", "ZmFIE1_mRNA.fa", "OsFIE1_mRNA.fa", "EDNAMAT", "dna", "NA_needle_DNAmat"),
    ("water", "ZmFIE1_mRNA.fa", "OsFIE1_mRNA.fa", "EDNAFULL", "dna", "NA_water_DNAfull"),
    ("water", "ZmFIE1_mRNA.fa", "OsFIE1_mRNA.fa", "EDNAMAT", "dna", "NA_water_DNAmat"),
    ("needle", "ZmFIE1_protein.fa", "OsFIE1_protein.fa", "EBLOSUM62", "protein", "PROT_needle_ortholog"),
    ("water", "ZmFIE1_protein.fa", "OsFIE1_protein.fa", "EBLOSUM62", "protein", "PROT_water_ortholog"),
    ("needle", "ZmFIE1_protein.fa", "ZmFIE2_protein.fa", "EBLOSUM62", "protein", "PROT_needle_paralog"),
    ("water", "ZmFIE1_protein.fa", "ZmFIE2_protein.fa", "EBLOSUM62", "protein", "PROT_water_paralog"),
    ("needle", "ZmFIE1_protein.fa", "OsFIE1_protein.fa", "EBLOSUM45", "protein", "PROT_needle_B45"),
    ("needle", "ZmFIE1_protein.fa", "OsFIE1_protein.fa", "EBLOSUM80", "protein", "PROT_needle_B80"),
]

for job in jobs:
    try:
        run(*job)
    except Exception as exc:
        print("FAILED", job[-1], exc)
    time.sleep(1)

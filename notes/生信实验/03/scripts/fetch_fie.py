#!/usr/bin/env python3
"""Download RefSeq FIE1/FIE2 mRNA and protein records used in experiments 2-3."""
import pathlib
import time
import urllib.parse
import urllib.request

EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
EMAIL = "caoronglin@users.noreply.github.com"
OUT = pathlib.Path(__file__).resolve().parent.parent / "queries" / "fie"
OUT.mkdir(parents=True, exist_ok=True)

ITEMS = [
    ("nuccore", "NM_001111711.1", "ZmFIE1_mRNA.fa"),
    ("protein", "NP_001105181.1", "ZmFIE1_protein.fa"),
    ("nuccore", "NM_001111712.1", "ZmFIE2_mRNA.fa"),
    ("protein", "NP_001105182.1", "ZmFIE2_protein.fa"),
    ("nuccore", "NM_112965.1", "AtFIE_mRNA.fa"),
    ("protein", "NP_188710.1", "AtFIE_protein.fa"),
    ("nuccore", "NM_001422905.1", "OsFIE1_mRNA.fa"),
    ("protein", "NP_001409834.1", "OsFIE1_protein.fa"),
    ("nuccore", "XM_015793634.2", "OsFIE2_mRNA.fa"),
    ("protein", "XP_015649120.1", "OsFIE2_protein.fa"),
    ("nuccore", "XM_002443778.2", "SbFIE1_mRNA.fa"),
    ("protein", "XP_002443823.1", "SbFIE1_protein.fa"),
    ("nuccore", "XM_002443777.2", "SbFIE2_mRNA.fa"),
    ("protein", "XP_002443822.1", "SbFIE2_protein.fa"),
    ("nuccore", "XM_044566685.1", "TaFIE1_mRNA.fa"),
    ("protein", "XP_044422620.1", "TaFIE1_protein.fa"),
    ("nuccore", "XM_045102776.1", "HvFIE1_mRNA.fa"),
    ("protein", "XP_044958711.1", "HvFIE1_protein.fa"),
    ("nuccore", "XM_003571455.4", "BdFIE2_mRNA.fa"),
    ("protein", "XP_003571503.1", "BdFIE2_protein.fa"),
    ("nuccore", "NM_001247555.2", "SlFIE_mRNA.fa"),
    ("protein", "NP_001234484.2", "SlFIE_protein.fa"),
    ("nuccore", "NM_001237614.1", "GmFIE1_mRNA.fa"),
    ("protein", "NP_001237614.1", "GmFIE1_protein.fa"),
]


def fetch(db, acc):
    query = urllib.parse.urlencode(
        {"db": db, "id": acc, "rettype": "fasta", "retmode": "text", "email": EMAIL}
    )
    url = EUTILS + "efetch.fcgi?" + query
    return urllib.request.urlopen(url, timeout=90).read().decode()


for db, acc, name in ITEMS:
    for attempt in range(4):
        try:
            text = fetch(db, acc)
            if not text.startswith(">"):
                raise RuntimeError("not a FASTA record")
            (OUT / name).write_text(text)
            seq_len = sum(len(line.strip()) for line in text.splitlines() if not line.startswith(">"))
            print(f"{name}\t{seq_len}\t{text.splitlines()[0]}")
            break
        except Exception as exc:
            print(f"retry {name} {attempt}: {exc}")
            time.sleep(3)
    else:
        print(f"FAILED {name}")
    time.sleep(0.35)

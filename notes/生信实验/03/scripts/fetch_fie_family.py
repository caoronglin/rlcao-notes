import json
import pathlib
import time
import urllib.parse
import urllib.request

E = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
EMAIL = "caoronglin@users.noreply.github.com"
BASE = pathlib.Path(__file__).resolve().parent.parent
OUT = BASE / "db" / "fie_family"
OUT.mkdir(parents=True, exist_ok=True)

TERM = (
    '("polycomb group protein FIE"[Title] OR "fertilization independent endosperm"[Title] '
    'OR FIE1[Title] OR FIE2[Title] OR FIE[Gene Name]) '
    "AND Viridiplantae[Organism] AND refseq[filter]"
)


def get(url):
    return urllib.request.urlopen(url, timeout=120).read().decode()


def esearch(db, term, retmax=2000):
    params = {
        "db": db,
        "term": term,
        "retmax": str(retmax),
        "retmode": "json",
        "email": EMAIL,
    }
    data = get(E + "esearch.fcgi?" + urllib.parse.urlencode(params))
    return json.loads(data)["esearchresult"]["idlist"]


def efetch(db, ids, path):
    text = ""
    for i in range(0, len(ids), 200):
        params = {
            "db": db,
            "id": ",".join(ids[i:i + 200]),
            "rettype": "fasta",
            "retmode": "text",
            "email": EMAIL,
        }
        text += get(E + "efetch.fcgi?" + urllib.parse.urlencode(params))
        time.sleep(0.4)
    path.write_text(text)
    print(path, text.count(">"), "sequences")


ids = esearch("protein", TERM)
efetch("protein", ids, OUT / "fie_protein.fa")
time.sleep(1)
nuc_term = TERM + " AND biomol_mrna[prop]"
ids = esearch("nuccore", nuc_term)
efetch("nuccore", ids, OUT / "fie_mRNA.fa")

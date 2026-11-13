import json
import time
import urllib.parse
import urllib.request

E = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
EMAIL = "caoronglin@users.noreply.github.com"


def get(url):
    return urllib.request.urlopen(url, timeout=90).read().decode()


gene_ids = [
    "123147438",
    "123170765",
    "123167651",
    "123156985",
    "123152038",
    "123152022",
    "123082994",
]

for gene_id in gene_ids:
    params = {
        "dbfrom": "gene",
        "db": "protein",
        "id": gene_id,
        "linkname": "gene_protein_refseq",
        "retmode": "json",
        "email": EMAIL,
    }
    data = json.loads(get(E + "elink.fcgi?" + urllib.parse.urlencode(params)))
    links = []
    for linkset in data.get("linksets", []):
        for db in linkset.get("linksetdbs", []):
            links.extend(db.get("links", []))
    if links:
        time.sleep(0.35)
        params = {
            "db": "protein",
            "id": ",".join(str(x) for x in links),
            "retmode": "json",
            "email": EMAIL,
        }
        result = json.loads(get(E + "esummary.fcgi?" + urllib.parse.urlencode(params)))["result"]
        for uid in result.get("uids", []):
            row = result[uid]
            print(gene_id, row.get("accessionversion"), row.get("slen"), "|", row.get("title"))
    time.sleep(0.4)

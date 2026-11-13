import pathlib
import urllib.parse
import urllib.request

BASE = pathlib.Path(__file__).resolve().parent.parent
SEQ = BASE / "queries" / "fie"
E = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
EMAIL = "caoronglin@users.noreply.github.com"

extra = {
    "TaFIE2_protein.fa": "XP_044444471.1",
    "TaFIE1b_protein.fa": "XP_044441419.1",
    "TaFIE1c_protein.fa": "XP_044427583.1",
    "TaFIE1d_protein.fa": "XP_044427566.1",
}

for name, acc in extra.items():
    params = urllib.parse.urlencode(
        {"db": "protein", "id": acc, "rettype": "fasta", "retmode": "text", "email": EMAIL}
    )
    text = urllib.request.urlopen(E + "efetch.fcgi?" + params, timeout=90).read().decode()
    (SEQ / name).write_text(text)
    print(name, text.splitlines()[0])

all_fa = BASE / "queries" / "fie_all_proteins.fa"
with all_fa.open("w") as out:
    for path in sorted(SEQ.glob("*protein.fa")):
        for line in path.read_text().splitlines():
            if line.startswith(">"):
                out.write(">" + path.stem + "|" + line[1:] + "\n")
            else:
                out.write(line + "\n")
print(all_fa)

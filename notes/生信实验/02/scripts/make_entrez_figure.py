#!/usr/bin/env python3
"""Render the Entrez retrieval chain for ZmFIE1 as an SVG figure.

The panel reproduces the literal E-utilities calls used for task 1.3 of
experiment 2 (retrieval date 2026-11-06).  Run it again after any change to
the query; the numbers come from the live API, not from this file.
"""
import pathlib

BASE = pathlib.Path(__file__).resolve().parent.parent
OUT = BASE / "fig_entrez_search.svg"

W = 860
PAD = 16
FS = 12.5
LH = 17.5
Y0 = 34

# (indent, text, style)  style: cmd | out | key | note
LINES = [
    (0, "esearch   db=nuccore", "cmd"),
    (10, 'term = Zea mays[Organism] AND "fertilization independent', "cmd2"),
    (10, 'endosperm"[Title] AND refseq[filter]', "cmd2"),
    (10, "Count = 3      IdList = 162462771  162462641  1897973403", "out"),
    (0, "", ""),
    (0, "elink     dbfrom=gene  db=nuccore  linkname=gene_nuccore_refseqrna", "cmd"),
    (10, "id=542075 (fie1)  ->  162462641  1897973403", "out"),
    (10, "id=542076 (fie2)  ->  162462771", "out"),
    (0, "", ""),
    (0, "esummary  db=nuccore  id = 162462771,162462641,1897973403", "cmd"),
    (10, "NM_001111711.1  1787 nt   Zea mays fertilization independent", "out"),
    (10, "                            endosperm 1 (LOC542075), mRNA", "out"),
    (10, "NM_001111712.1  1711 nt   Zea mays fertilization independent", "out"),
    (10, "                            endosperm 2 (LOC542076), mRNA", "out"),
    (10, "XM_023302232.2  1738 nt   PREDICTED: Zea mays fertilization", "out"),
    (10, "                            independent endosperm 1, variant X1", "out"),
]

H = Y0 + len(LINES) * LH + PAD

parts = [
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H:.0f}" '
    f'viewBox="0 0 {W} {H:.0f}">',
    f'<rect x="0" y="0" width="{W}" height="{H:.0f}" fill="#fbfbfb" '
    f'stroke="#c9c9c9" stroke-width="1"/>',
    f'<rect x="0" y="0" width="{W}" height="24" fill="#eef2f6"/>',
    f'<line x1="0" y1="24" x2="{W}" y2="24" stroke="#c9c9c9" stroke-width="1"/>',
    '<text x="12" y="16.5" font-family="DejaVu Sans Mono, Noto Sans Mono CJK SC, monospace" '
    'font-size="11.5" fill="#20507a">NCBI Entrez &#183; E-utilities &#183; 2026-11-06</text>',
]
for i, (ind, text, style) in enumerate(LINES):
    y = Y0 + i * LH
    if not text:
        continue
    fill = {"cmd": "#1a1a1a", "cmd2": "#1a1a1a", "out": "#333333",
            "key": "#20507a", "note": "#666666"}[style]
    weight = ' font-weight="700"' if style == "cmd" else ""
    fam = 'font-family="DejaVu Sans Mono, Noto Sans Mono CJK SC, monospace"'
    parts.append(
        f'<text x="{PAD + ind}" y="{y:.1f}" {fam} font-size="{FS}" fill="{fill}"{weight}>'
        f"{text}</text>"
    )
parts.append("</svg>")
OUT.write_text("\n".join(parts), encoding="utf-8")
print(OUT, f"{W}x{H:.0f}")

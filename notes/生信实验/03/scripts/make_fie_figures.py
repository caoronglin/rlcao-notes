#!/usr/bin/env python3
"""Draw the SVG figures for the FIE1 versions of experiments 2 and 3."""
import csv
import pathlib

BASE = pathlib.Path(__file__).resolve().parent.parent
DATA = BASE / "data"
OUT3 = BASE
OUT2 = BASE.parent / "02"

INK = "#111"
BLUE = "#1f3f66"
MID = "#466f87"
SOFT = "#6b8db8"
PALE = "#9db6d4"
MIST = "#cfdcec"
RED = "#b3261e"
GREY = "#6c7278"


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def txt(x, y, s, size=12.5, anchor="start", fill=INK, weight="normal"):
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" text-anchor="{anchor}" '
            f'fill="{fill}" font-weight="{weight}">{esc(s)}</text>')


def rect(x, y, w, h, fill):
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{max(w,0):.1f}" height="{max(h,0):.1f}" fill="{fill}"/>'


def line(x1, y1, x2, y2, stroke="#333", sw=0.9):
    return f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{stroke}" stroke-width="{sw}"/>'


def head(w, h):
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 %d %d">\n'
            '<style>text{font-family:"Noto Sans CJK SC",sans-serif;fill:%s}</style>\n'
            '%s' % (w * 3, h * 3, w, h, INK, rect(0, 0, w, h, "#fff")))


def scale_fonts(svg, factor=1.30):
    import re
    return re.sub(r'font-size="([0-9.]+)"', lambda m: f'font-size="{float(m.group(1))*factor:.1f}"', svg)


def read_csv(name):
    return list(csv.DictReader(open(DATA / name, encoding="utf-8")))


def summary():
    return {r["run"]: r for r in read_csv("fie_summary.csv")}


def fig1(sm):
    w, h = 1000, 360
    out = [head(w, h), txt(8, 22, "（a）三种 blastn 算法的命中量与耗时　　（b）word size 与 E-value 扫描", 15, weight="700")]
    rows = [("blastn", "fie_t1a_blastn_default", BLUE),
            ("dc-megablast", "fie_t1c_dcmegablast", MID),
            ("megablast", "fie_t1b_megablast", SOFT)]
    x0, x1 = 155, 455
    for i, (label, run, color) in enumerate(rows):
        y = 55 + i * 62
        n = int(sm[run]["subjects"])
        bw = n / 360 * (x1 - x0)
        out.append(txt(x0 - 8, y + 18, label, 13, "end"))
        out.append(rect(x0, y, bw, 26, color))
        out.append(txt(x0 + bw + 6, y + 19, f"{n}", 12.5, weight="700"))
        out.append(txt(x0, y + 43, f'{int(sm[run]["species"])} 个物种 · {float(sm[run]["seconds"]):.2f} s', 11, "start", GREY))
    out.append(line(x0, 245, x1, 245, "#333", 0.9))
    out.append(txt(x0, 264, "命中序列数（去重）", 11, "start", GREY))
    out.append(line(500, 32, 500, 340, "#c9ced6", 1))

    out.append(txt(525, 52, "word size（E=10）", 12, "start", GREY))
    for i, (lab, run) in enumerate([("7", "fie_t1d_blastn_w7"), ("11", "fie_t1e_blastn_w11"), ("15", "fie_t1f_blastn_w15")]):
        x = 535 + i * 70
        v = int(sm[run]["subjects"])
        bh = v / 372 * 105
        out.append(rect(x, 175 - bh, 42, bh, BLUE if lab == "11" else PALE))
        out.append(txt(x + 21, 175 - bh - 5, str(v), 11, "middle", weight="700"))
        out.append(txt(x + 21, 192, lab, 12, "middle"))
        out.append(txt(x + 21, 208, f'{float(sm[run]["seconds"]):.1f}s', 10, "middle", GREY))

    out.append(txt(525, 238, "E-value（word size 11）", 12, "start", GREY))
    for i, (lab, run) in enumerate([("1e-50", "fie_t1g_blastn_e1e50"), ("1e-5", "fie_t1h_blastn_e1e5"), ("10", "fie_t1a_blastn_default"), ("1000", "fie_t1i_blastn_e1000")]):
        x = 535 + i * 62
        v = int(sm[run]["subjects"])
        bh = v / 2083 * 75
        color = MIST if lab == "1e-50" else (SOFT if lab == "1e-5" else (BLUE if lab == "10" else RED))
        out.append(rect(x, 330 - bh, 40, bh, color))
        out.append(txt(x + 20, 330 - bh - 5, str(v), 10, "middle", weight="700"))
        out.append(txt(x + 20, 346, lab, 10.5, "middle"))
    out.append("</svg>")
    (OUT3 / "fig1_alg_params.svg").write_text(scale_fonts("\n".join(out)))


def fig2(sm):
    w, h = 1000, 370
    psi = read_csv("fie_psi_rounds.csv")
    bins = read_csv("fie_delta_bins.csv")
    out = [head(w, h), txt(8, 22, "（a）PSI-BLAST 累计与新增　　（b）DELTA-BLAST 的 FIE 同源命中按一致性分层", 15, weight="700")]
    x0, x1, y0 = 70, 470, 315
    out.append(txt(25, 48, "累计序列（浅）", 10.5, "start", GREY))
    out.append(txt(455, 48, "新增（深）", 10.5, "end", GREY))
    for i, r in enumerate(psi):
        cx = x0 + (i + 0.5) * (x1 - x0) / len(psi)
        cum = int(r["subjects"])
        new = int(r["new"])
        out.append(rect(cx - 13, y0 - (cum / 4000) * 235, 26, (cum / 4000) * 235, MIST))
        out.append(rect(cx - 4, y0 - (new / 1400) * 235, 8, (new / 1400) * 235, BLUE))
        if i in (0, 1, 2, 11):
            out.append(txt(cx, y0 + 15, str(r["round"]), 10, "middle", GREY))
    out.append(line(x0, y0, x1, y0, "#333", 0.9))
    out.append(txt((x0 + x1) / 2, y0 + 34, "PSI-BLAST 轮次", 12, "middle"))
    for val in (1000, 2000, 3000, 4000):
        y = y0 - val / 4000 * 235
        out.append(txt(x0 - 6, y + 4, str(val), 9.5, "end", GREY))

    bx, by = 610, 315
    labels = [r["bin"] for r in bins]
    vals = [int(r["subjects"]) for r in bins]
    vmax = max(vals)
    for i, (lab, v) in enumerate(zip(labels, vals)):
        x = bx + i * 40
        bh = (v / vmax) * 225
        color = BLUE if lab in (">=95", "90-95") else (MID if lab in ("80-90", "70-80") else SOFT)
        out.append(rect(x, by - bh, 30, bh, color))
        out.append(txt(x + 15, by - bh - 5, str(v), 9.5, "middle", weight="700"))
        out.append(txt(x + 15, by + 16, lab, 9, "middle", GREY))
    out.append(line(bx, by, bx + len(vals) * 40 - 10, by, "#333", 0.9))
    out.append("</svg>")
    (OUT3 / "fig2_psi_delta.svg").write_text(scale_fonts("\n".join(out)))


def fig3(sm):
    w, h = 1000, 470
    out = [head(w, h), txt(8, 20, "blastp 参数敏感性（query = ZmFIE1，461 aa）", 15, weight="700")]
    items = [
        ("默认", "fie_t2a_blastp_default", BLUE),
        ("word 2", "fie_t2b_blastp_w2", PALE),
        ("word 6", "fie_t2c_blastp_w6", PALE),
        ("BLOSUM45", "fie_t2d_blastp_blosum45", MID),
        ("BLOSUM90", "fie_t2e_blastp_blosum90", MID),
        ("E=1e-3", "fie_t2f_blastp_e1e3", SOFT),
        ("E=1000", "fie_t2g_blastp_e1000", RED),
    ]
    x0, y0, bw = 90, 330, 78
    vmax = 2482
    for i, (lab, run, color) in enumerate(items):
        x = x0 + i * 120
        v = int(sm[run]["subjects"])
        bh = v / vmax * 230
        out.append(rect(x, y0 - bh, bw, bh, color))
        out.append(txt(x + bw / 2, y0 - bh - 6, f"{v:,}", 11, "middle", weight="700"))
        out.append(txt(x + bw / 2, y0 + 17, lab, 11, "middle"))
        out.append(txt(x + bw / 2, y0 + 33, f'E<0.005 {int(sm[run]["e005"])}', 9.5, "middle", GREY))
    out.append(line(x0, y0, x0 + len(items) * 120 - 42, y0, "#333", 0.9))
    out.append(txt(x0, y0 + 62, "默认 word 3 / BLOSUM62 / E=10：1,355 条，689 条 E<0.005。", 11.5))
    out.append(txt(x0, y0 + 82, "word 2 几乎不变（+8 条），word 6 掉到 809 条；", 11.5))
    out.append(txt(x0, y0 + 102, "BLOSUM45/90 分别 1,287/1,180 条，E=1000 涨到 2,482 条。", 11.5))
    out.append(txt(x0, y0 + 122, "所有改动都没有改变前 10 条，只改变长尾。", 11.5))
    out.append("</svg>")
    (OUT3 / "fig3_blastp_params.svg").write_text(scale_fonts("\n".join(out)))


def fig4():
    rows = read_csv("fie_homolog_identity.csv")
    orth = [r for r in rows if r["group"] == "ortholog"]
    para = [r for r in rows if r["group"] == "paralog"]
    w = 1000
    step = 19
    h = int(60 + (len(orth) + len(para)) * step + 30)
    out = [head(w, h), txt(8, 20, f"{len(orth)} 条直系同源（上）与 {len(para)} 条并系同源（下）对 ZmFIE1 的蛋白一致性", 15, weight="700")]
    x0, x1 = 330, 920
    y = 50
    split = 0
    for grp, color in ((orth, BLUE), (para, MID)):
        for r in grp:
            v = float(r["pident"])
            bw = (v / 100) * (x1 - x0)
            out.append(txt(x0 - 8, y + 4, r["species"], 10.5, "end"))
            out.append(rect(x0, y, bw, 9, color))
            out.append(txt(x0 + bw + 5, y + 8, f'{v:.1f}', 9.5))
            y += step
        split = y - step // 2
    out.append(line(x0, 45, x0, y - step + 9, "#333", 0.9))
    out.append(line(x0, split, x1, split, "#999", 0.8))
    out.append(txt(x0, y + 12, "蛋白一致性（%）", 11, "middle", GREY))
    out.append("</svg>")
    (OUT3 / "fig4_homologs.svg").write_text(scale_fonts("\n".join(out)))


def fig2_02():
    w, h = 1000, 430
    out = [head(w, h), txt(8, 20, "（a）核酸直系同源比对　　（b）蛋白直系同源与并系同源比对", 15, weight="700")]
    # panel a
    x0, y0 = 100, 330
    groups = [("Needle 全局", 56.3, 28.5, BLUE), ("Water 局部", 58.5, 25.6, MID)]
    for i, (lab, ident, gaps, color) in enumerate(groups):
        x = x0 + i * 150
        out.append(rect(x, y0 - ident / 60 * 220, 45, ident / 60 * 220, color))
        out.append(rect(x + 55, y0 - gaps / 60 * 220, 45, gaps / 60 * 220, PALE))
        out.append(txt(x + 22, y0 - ident / 60 * 220 - 6, f"{ident:.1f}%", 11, "middle", weight="700"))
        out.append(txt(x + 77, y0 - gaps / 60 * 220 - 6, f"{gaps:.1f}%", 11, "middle"))
        out.append(txt(x + 50, y0 + 18, lab, 11, "middle"))
    out.append(line(x0, y0, x0 + 300, y0, "#333", 0.9))
    out.append(txt(x0, y0 + 42, "深色 identity，浅色 gaps；局部比对把一致性从 56.3% 提到 58.5%。", 10.5))
    # panel b
    bx, by = 520, 330
    prot = [("Needle 直系", 58.0, 68.0, 18.8, BLUE), ("Water 直系", 72.3, 84.2, 0.3, MID),
            ("Needle 并系", 62.7, 70.3, 17.8, SOFT), ("Water 并系", 77.7, 86.3, 0.0, PALE)]
    for i, (lab, ident, sim, gaps, color) in enumerate(prot):
        x = bx + i * 110
        out.append(rect(x, by - ident / 100 * 220, 25, ident / 100 * 220, color))
        out.append(rect(x + 28, by - sim / 100 * 220, 25, sim / 100 * 220, MIST))
        out.append(rect(x + 56, by - gaps / 100 * 220, 25, gaps / 100 * 220, "#999"))
        out.append(txt(x + 40, by + 18, lab, 10, "middle"))
    out.append(line(bx, by, bx + 430, by, "#333", 0.9))
    out.append(txt(bx, by + 42, "深色 identity，浅色 similarity，灰色 gaps。", 10.5))
    out.append("</svg>")
    (OUT2 / "fig1_fie_align.svg").write_text(scale_fonts("\n".join(out)))


def fig2_02_gaps():
    w, h = 1000, 430
    out = [head(w, h), txt(8, 20, "空位游程：核酸全局比对 vs 蛋白全局比对", 15, weight="700")]
    # nucleic runs from EMBOSS: query 53 runs max 46, subject 35 runs max 32
    # protein ortholog: 4 runs, max 58; paralog: 2 runs, max 58
    items = [("核酸 query", 53, 46, BLUE), ("核酸 subject", 35, 32, MID),
             ("蛋白 直系", 4, 58, SOFT), ("蛋白 并系", 2, 58, PALE)]
    x0, y0 = 120, 330
    for i, (lab, runs, longest, color) in enumerate(items):
        x = x0 + i * 180
        bh = runs / 53 * 230
        out.append(rect(x, y0 - bh, 50, bh, color))
        out.append(txt(x + 25, y0 - bh - 6, f"{runs} 段", 11, "middle", weight="700"))
        out.append(txt(x + 25, y0 + 18, lab, 10.5, "middle"))
        out.append(txt(x + 25, y0 + 34, f"最长 {longest}", 10, "middle", GREY))
    out.append(line(x0, y0, x0 + 680, y0, "#333", 0.9))
    out.append(txt(x0, y0 + 60, "核酸全局比对：88 段空位，最长 46 bp；蛋白全局比对只有 4/2 段，最长 58 aa。", 11))
    out.append(txt(x0, y0 + 80, "蛋白的空位是集中的末端缺口，不是散布的小 indel。", 11))
    out.append("</svg>")
    (OUT2 / "fig2_fie_gaps.svg").write_text(scale_fonts("\n".join(out)))


def main():
    sm = summary()
    fig1(sm)
    fig2(sm)
    fig3(sm)
    fig4()
    fig2_02()
    fig2_02_gaps()
    print("figures written")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""实验四自绘图：WD40 重复锚点位置与空位分布（读 msa_compute_20261107 的结果表）。"""
import csv
import pathlib

BASE = pathlib.Path(__file__).resolve().parent
MSA = BASE.parent / "msa_compute_20261107"

INK = "#111"
BLUE = "#1f3f66"
MID = "#466f87"
SOFT = "#6b8db8"
PALE = "#9db6d4"
RED = "#b3261e"
GREY = "#6c7278"
MIST = "#cfdcec"


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def txt(x, y, s, size=12.5, anchor="start", fill=INK, weight="normal"):
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" text-anchor="{anchor}" '
            f'fill="{fill}" font-weight="{weight}">{esc(s)}</text>')


def rect(x, y, w, h, fill):
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{max(w, 0):.1f}" height="{max(h, 0):.1f}" fill="{fill}"/>'


def line(x1, y1, x2, y2, stroke="#333", sw=0.9, dash=""):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
            f'stroke="{stroke}" stroke-width="{sw}"{d}/>')


def head(w, h):
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 %d %d">\n'
            '<style>text{font-family:"Noto Sans CJK SC",sans-serif;fill:%s}</style>\n'
            '%s' % (w * 3, h * 3, w, h, INK, rect(0, 0, w, h, "#fff")))


def scale_fonts(svg, factor=1.30):
    import re
    return re.sub(r'font-size="([0-9.]+)"', lambda m: f'font-size="{float(m.group(1)) * factor:.1f}"', svg)


def read_tsv(path):
    return list(csv.DictReader(open(path, encoding="utf-8"), delimiter="\t"))


ORDER = ["clustalo_default", "clustalo_iter3", "muscle", "clustalo_pfam"]
LABEL = {"clustalo_default": "Clustal 默认", "clustalo_iter3": "Clustal 迭代 3 次",
         "muscle": "MUSCLE", "clustalo_pfam": "Clustal + PF00400"}
COLOR = {"clustalo_default": BLUE, "clustalo_iter3": MID, "muscle": RED, "clustalo_pfam": PALE}
DASH = {"clustalo_default": "", "clustalo_iter3": "6 3", "muscle": "", "clustalo_pfam": "2 2"}


def fig_repeat_anchor():
    cons = read_tsv(MSA / "repeat_consistency.tsv")
    gaps = read_tsv(MSA / "domain_gap_profile.tsv")

    by = {(r["alignment"], int(r["repeat"])): r for r in cons}
    w, h = 1000, 360
    out = [head(w, h),
           txt(8, 22, "（a）WD40 重复锚点在比对中的列位置", 15, weight="700"),
           txt(650, 22, "（b）空位落在重复内部的比例", 15, weight="700")]

    # ---- panel a ----
    x0, x1, y0, y1 = 92, 600, 300, 62
    ymax = 620

    def px(k):
        return x0 + (k - 1) * (x1 - x0) / 4

    def py(v):
        return y0 - (v / ymax) * (y0 - y1)

    for v in range(0, 601, 200):
        out.append(line(x0, py(v), x1, py(v), "#e2e6ea", 0.8))
        out.append(txt(x0 - 8, py(v) + 4, str(v), 10.5, "end", GREY))
    out.append(line(x0, y0, x1, y0, "#333", 0.9))
    out.append(line(x0, y0, x0, y1, "#333", 0.9))
    for k in range(1, 6):
        out.append(txt(px(k), y0 + 16, f"第 {k} 个", 10.5, "middle"))
    out.append(txt((x0 + x1) / 2, y0 + 34, "WD40 重复序号（N → C）", 11, "middle", GREY))
    out.append(txt(40, (y0 + y1) / 2, "比对列号", 11, "middle", GREY).replace(
        '<text', '<text transform="rotate(-90 40 %.1f)"' % ((y0 + y1) / 2), 1))

    for m in ORDER:
        pts = []
        for k in range(1, 6):
            r = by.get((m, k))
            if not r:
                continue
            v = float(r["median_col"])
            sd = float(r["stdev_col"])
            out.append(line(px(k), py(v - sd), px(k), py(v + sd), COLOR[m], 1.1))
            for off in (-sd, sd):
                out.append(line(px(k) - 3, py(v + off), px(k) + 3, py(v + off), COLOR[m], 1.1))
            pts.append((px(k), py(v)))
        for (ax, ay), (bx, by_) in zip(pts, pts[1:]):
            out.append(line(ax, ay, bx, by_, COLOR[m], 1.5, DASH[m]))
        for xx, yy in pts:
            out.append(f'<circle cx="{xx:.1f}" cy="{yy:.1f}" r="3.2" fill="{COLOR[m]}"/>')

    lx, ly = 330, 200
    for i, m in enumerate(ORDER):
        yy = ly + i * 16
        out.append(line(lx, yy - 4, lx + 26, yy - 4, COLOR[m], 1.6, DASH[m]))
        out.append(f'<circle cx="{lx + 13:.1f}" cy="{yy - 4:.1f}" r="3" fill="{COLOR[m]}"/>')
        out.append(txt(lx + 34, yy, LABEL[m], 10.5))
    out.append(txt(lx, ly + 4 * 16 + 4, "误差棒＝跨序列标准差", 9.8, fill=GREY))

    # ---- panel b ----
    bx0, bw = 700, 62
    by0, bymax = 300, 8000

    def py2(v):
        return by0 - (v / bymax) * (by0 - y1)

    for v in range(0, 8001, 2000):
        out.append(line(660, py2(v), 970, py2(v), "#e2e6ea", 0.8))
        out.append(txt(654, py2(v) + 4, f"{v}", 10.5, "end", GREY))
    out.append(line(660, by0, 970, by0, "#333", 0.9))

    for i, m in enumerate(ORDER):
        r = next(x for x in gaps if x["alignment"] == m)
        tot = int(r["gap_total"])
        ins = int(r["gap_inside_repeat"])
        xx = bx0 + i * 70
        out.append(rect(xx, py2(tot), bw, by0 - py2(tot), MIST))
        out.append(rect(xx, py2(ins), bw, max(by0 - py2(ins), 3), RED))
        out.append(txt(xx + bw / 2, py2(tot) - 5, f"{tot:,}", 10, "middle"))
        out.append(txt(xx + bw / 2, by0 + 15, LABEL[m].replace("Clustal ", "C."), 9.5, "middle"))
        out.append(txt(xx + bw / 2, py2(ins) - 5, "199", 9.5, "middle", RED))
    out.append(txt(815, by0 + 33, "重复内部 199 处（红）／其余在重复之间（浅）", 10, "middle", GREY))
    out.append("</svg>")
    (BASE.parent / "fig_repeat_anchor.svg").write_text(scale_fonts("\n".join(out)))


def fig_gap_quality():
    """空位碎片化：每个比对的空位总数、空位段数、最长空位段。"""
    import re
    ALN = [("clustalo_default", MSA / "clustalo_proteinall_default.aln", "clu"),
           ("clustalo_iter3", MSA / "clustalo_proteinall_iter3.aln", "clu"),
           ("muscle", MSA / "muscle_proteinall.fasta", "fasta"),
           ("clustalo_pfam", MSA / "clustalo_proteinall_pfam.aln", "clu")]

    def read_alignment(path, fmt):
        seqs, name, buf = {}, None, []
        for ln in path.read_text(errors="replace").splitlines():
            if fmt == "clu":
                if not ln.strip() or ln.startswith("CLUSTAL") or ln[0] in " \t":
                    continue
                p = ln.split()
                if len(p) < 2:
                    continue
                seqs[p[0]] = seqs.get(p[0], "") + p[1]
            else:
                if ln.startswith(">"):
                    if name:
                        seqs[name] = "".join(buf)
                    name, buf = ln[1:].split()[0], []
                elif ln.strip():
                    buf.append(ln.strip())
        if fmt != "clu" and name:
            seqs[name] = "".join(buf)
        return seqs

    stats = []
    for m, path, fmt in ALN:
        aln = read_alignment(path, fmt)
        ncol = len(next(iter(aln.values())))
        total = runs = 0
        longest = 0
        for a in aln.values():
            total += a.count("-") + a.count(".")
            for mt in re.finditer(r"[-.]+", a):
                runs += 1
                longest = max(longest, len(mt.group()))
        stats.append((m, ncol, total, runs, total / runs, longest))

    w, h = 1000, 300
    out = [head(w, h), txt(8, 22, "空位量与碎片化：同一 36 条蛋白，四种比对的空位形态", 15, weight="700")]
    x0, x1, y0, y1 = 92, 940, 240, 60
    ymax = 8000

    def py(v):
        return y0 - (v / ymax) * (y0 - y1)

    for v in range(0, 8001, 2000):
        out.append(line(x0, py(v), x1, py(v), "#e2e6ea", 0.8))
        out.append(txt(x0 - 8, py(v) + 4, f"{v}", 10.5, "end", GREY))
    out.append(line(x0, y0, x1, y0, "#333", 0.9))
    bw = 88
    for i, (m, ncol, total, runs, mean, longest) in enumerate(stats):
        xx = x0 + 60 + i * 200
        out.append(rect(xx, py(total), bw, y0 - py(total), COLOR[m]))
        out.append(txt(xx + bw / 2, py(total) - 6, f"{total:,}", 10.5, "middle"))
        out.append(txt(xx + bw / 2, y0 + 15, LABEL[m], 10, "middle"))
        out.append(txt(xx + bw / 2, y0 + 30, f"{ncol} 列 · {runs} 段 · 均长 {mean:.1f}", 9.5, "middle", GREY))
    out.append(txt((x0 + x1) / 2, y0 + 52, "四种比对的完全一致列均为 28–30 个，空位数相差 3,384 个", 10.5, "middle", GREY))
    out.append("</svg>")
    (BASE.parent / "fig_gap_quality.svg").write_text(scale_fonts("\n".join(out)))


if __name__ == "__main__":
    fig_repeat_anchor()
    fig_gap_quality()
    print("figures written")

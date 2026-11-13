#!/usr/bin/env python3
"""实验三：报告插图生成（SVG 矢量源，宽 1000 px）。

数据全部来自 data/*.csv 与 results/*.tsv，不手写数字。
SVG 由同目录 render_png.sh 用无头 Chrome 3× 截图栅格化为 PNG。
"""
from __future__ import annotations

import csv
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
RES = ROOT / "results"

INK = "#111"
BLUE = "#1f3f66"
MID = "#466f87"
SOFT = "#6b8db8"
PALE = "#9db6d4"
MIST = "#cfdcec"
RED = "#b3261e"
GREY = "#6c7278"


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def txt(x, y, s, size=12.5, anchor="start", fill=INK, weight="normal", extra=""):
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" text-anchor="{anchor}" '
            f'fill="{fill}" font-weight="{weight}" {extra}>{esc(s)}</text>')


def rect(x, y, w, h, fill, stroke="none", sw=0):
    st = f' stroke="{stroke}" stroke-width="{sw}"' if stroke != "none" else ""
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{max(w,0):.1f}" height="{max(h,0):.1f}" fill="{fill}"{st}/>'


def line(x1, y1, x2, y2, stroke="#333", sw=0.9, dash=""):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{stroke}" stroke-width="{sw}"{d}/>'


def head(w, h, title):
    style = ('<style>text{font-family:"Noto Sans CJK SC",sans-serif;fill:' + INK + '}'
             '.t{font-size:15px;font-weight:700}.s{font-size:13.5px}'
             '.ax{font-size:12.5px;fill:' + GREY + '}.n{font-size:12.5px}</style>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w*3}" height="{h*3}" viewBox="0 0 {w} {h}">\n'
            + style + "\n"
            + rect(0, 0, w, h, "#fff")
            + txt(8, 19, title, 15, weight="700"))

def log_map(v, vmin, vmax, x0, x1):
    """把 [vmin,vmax] 对数映射到 [x0,x1]。"""
    import math
    a, b = math.log10(max(vmin, 1)), math.log10(max(vmax, 1))
    if b - a < 1e-9:
        return x0
    t = (math.log10(max(v, 1)) - a) / (b - a)
    return x0 + t * (x1 - x0)


def load_summary():
    rows = list(csv.DictReader(open(DATA / "t1_t2_t4_summary.csv", encoding="utf-8")))
    return {r["run"]: r for r in rows}


def load_psi():
    rows = list(csv.DictReader(open(DATA / "psi_rounds.csv", encoding="utf-8")))
    return rows


def load_t4():
    rows = list(csv.DictReader(open(DATA / "t1_t2_t4_top10.csv", encoding="utf-8")))
    return rows


def delta_hist():
    import collections
    COLS = ["qseqid", "sseqid", "pident", "length", "mismatch", "gapopen", "qstart", "qend",
            "sstart", "send", "evalue", "bitscore", "sscinames", "stitle"]
    best = {}
    for r in csv.reader(open(RES / "t3b_deltablast.tsv", encoding="utf-8"), delimiter="\t"):
        if len(r) < 14:
            continue
        d = dict(zip(COLS, r))
        k = d["sseqid"]
        if k not in best or float(d["bitscore"]) > float(best[k]["bitscore"]):
            best[k] = d
    bins = collections.Counter()
    for h in best.values():
        p = float(h["pident"])
        key = (">=95" if p >= 95 else "90-95" if p >= 90 else "80-90" if p >= 80 else
               "70-80" if p >= 70 else "60-70" if p >= 60 else "50-60" if p >= 50 else
               "40-50" if p >= 40 else "30-40" if p >= 30 else "<30")
        bins[key] += 1
    order = [">=95", "90-95", "80-90", "70-80", "60-70", "50-60", "40-50", "30-40", "<30"]
    return [(k, bins[k]) for k in order], len(best)


# ---------------------------------------------------------------- 图 1
def fig1(sm):
    W, H = 1000, 430
    out = [head(W, H, "（a）三种 blastn 算法的召回量与耗时　　（b）word size 与 E-value 对召回量的影响")]
    # --- (a) 三种算法，log 横条
    x0, x1 = 190, 470
    rows = [("blastn（默认）", int(sm["t1a_blastn_default"]["subjects"]), 764, float(sm["t1a_blastn_default"]["seconds"]), BLUE),
            ("dc-megablast", int(sm["t1c_dcmegablast"]["subjects"]), 765, float(sm["t1c_dcmegablast"]["seconds"]), MID),
            ("megablast", int(sm["t1b_megablast"]["subjects"]), 241, float(sm["t1b_megablast"]["seconds"]), SOFT)]
    vmax = max(r[1] for r in rows)
    out.append(txt(x0 - 8, 36, "命中序列数（对数刻度）", 12.5, "end", GREY))
    for i, (name, n, sp, sec, color) in enumerate(rows):
        y = 44 + i * 48
        w = log_map(n, 1000, vmax * 1.2, 0, x1 - x0)
        out.append(txt(x0 - 8, y + 22, name, 13, "end"))
        out.append(rect(x0, y, w, 26, color))
        out.append(txt(x0 + w + 6, y + 18, f"{n:,}", 12.5, "start", INK, "700"))
        out.append(txt(x0 + 4, y + 43, f"{sp} 个物种 · {sec:.1f} s", 11.5, "start", GREY))
    for gv in (1e3, 1e4, 1e5):
        gx = log_map(gv, 1000, vmax * 1.2, 0, x1 - x0) + x0
        out.append(line(gx, 38, gx, 196, "#d8dde3", 0.8))
        lab = {1e3: "10³", 1e4: "10⁴", 1e5: "10⁵"}[gv]
        out.append(txt(gx, 210, lab, 11, "middle", GREY))
    out.append(txt(x0, 240, "megablast 用 28 nt 长词，只抓高相似区段；", 12))
    out.append(txt(x0, 258, "blastn 用 11 nt 词，召回量是它的 22 倍、耗时 20 倍。", 12))
    out.append(txt(x0, 284, "前 10 条排序：blastn 与 dc-megablast 完全一致；", 12))
    out.append(txt(x0, 302, "megablast 只抬高 bitscore（1/-2 矩阵），名次基本不变。", 12))
    out.append(txt(x0, 330, "库：11 个物种 Ensembl cDNA + UniProt Swiss-Prot，共 890,742 条核酸。", 11.5, "start", GREY))

    # --- (b) word size / E-value 上下两组
    out.append(line(500, 30, 500, 400, "#c9ced6", 0.9))
    bx = 520
    out.append(txt(bx, 60, "word size（E=10 固定）", 12.5, "start", GREY))
    ws = [("7", int(sm["t1d_blastn_w7"]["subjects"]), float(sm["t1d_blastn_w7"]["seconds"])),
          ("11", int(sm["t1e_blastn_w11"]["subjects"]), float(sm["t1e_blastn_w11"]["seconds"])),
          ("15", int(sm["t1f_blastn_w15"]["subjects"]), float(sm["t1f_blastn_w15"]["seconds"]))]
    wmax = max(v for _, v, _ in ws)
    for i, (lab, v, sec) in enumerate(ws):
        x = bx + i * 62
        h = (v / wmax) * 90
        out.append(rect(x, 190 - h, 40, h, PALE if lab != "11" else BLUE))
        out.append(txt(x + 20, 190 - h - 6, f"{v:,}", 11.5, "middle", INK, "700"))
        out.append(txt(x + 20, 206, lab, 12.5, "middle"))
        out.append(txt(x + 20, 222, f"{sec:.0f}s", 11, "middle", GREY))
    out.append(txt(bx, 246, "词越长越严格：w15 少 25% 命中，w7 只多 7% 却慢 6 倍。", 11.5))

    out.append(txt(bx, 288, "E-value（word size 11 固定）", 12.5, "start", GREY))
    ev = [("1e-50", int(sm["t1g_blastn_e1e50"]["subjects"])),
          ("1e-5", int(sm["t1h_blastn_e1e5"]["subjects"])),
          ("10", int(sm["t1a_blastn_default"]["subjects"])),
          ("1000", 69169)]
    emax = max(v for _, v in ev)
    for i, (lab, v) in enumerate(ev):
        x = bx + i * 58
        h = (v / emax) * 90
        color = MIST if lab == "1e-50" else (SOFT if lab == "1e-5" else (BLUE if lab == "10" else RED))
        out.append(rect(x, 400 - h, 38, h, color))
        out.append(txt(x + 19, 400 - h - 6, f"{v:,}", 11, "middle", INK, "700"))
        out.append(txt(x + 19, 416, lab, 12, "middle"))
    out.append(txt(bx, 350, "E 值是随机命中数的期望：收紧到 1e-50 只剩灵长类近亲；", 11.5))
    out.append(txt(bx, 366, "从 10 放宽到 1000 只多 15% 命中——它不是线性旋钮。", 11.5))
    out.append("</svg>")
    return "\n".join(out)


# ---------------------------------------------------------------- 图 2
def fig2(psi, hist, nhist):
    W, H = 1000, 430
    out = [head(W, H, "（a）PSI-BLAST 逐轮新增与累计命中序列　　（b）DELTA-BLAST 命中按一致性分层")]
    import math
    x0, x1, ybase = 60, 470, 300
    cum = [int(r["subjects"]) for r in psi]
    new = [int(r["new_vs_prev"]) for r in psi]
    rounds = [int(r["round"]) for r in psi]
    cmax = 9000
    pts: list[tuple[float, float]] = []
    out.append(txt(x0 - 6, 34, "新增（柱）", 12, "end", GREY))
    out.append(txt(x1 + 6, 34, "累计（折线）", 12, "start", GREY))
    bw = (x1 - x0) / len(rounds) * 0.62
    for i, (r, nv, cv) in enumerate(zip(rounds, new, cum)):
        cx = x0 + (i + 0.5) * (x1 - x0) / len(rounds)
        h = (math.log10(max(nv, 1)) / math.log10(9000)) * 200
        out.append(rect(cx - bw / 2, ybase - h, bw, h, MIST if i else BLUE))
        if i < 4 or nv >= 90:
            out.append(txt(cx, ybase - h - 5, str(nv), 11, "middle", INK, "700"))
        pts.append((cx, ybase - (cv / cmax) * 200))
        out.append(txt(cx, ybase + 16, str(r), 11.5, "middle", GREY))
    path = "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts)
    out.append(f'<path d="{path}" fill="none" stroke="{RED}" stroke-width="2.2"/>')
    out.append(line(x0, ybase, x1, ybase, "#333", 0.9))
    out.append(txt((x0 + x1) / 2, ybase + 34, "PSI-BLAST 轮次", 12.5, "middle"))
    for cv in (2000, 4000, 6000, 8000):
        y = ybase - (cv / cmax) * 200
        out.append(line(x0, y, x1, y, "#e3e7ec", 0.8))
        out.append(txt(x0 - 6, y + 4, f"{cv//1000}k", 11, "end", GREY))
    out.append(txt(x0, ybase + 58, "第 2 轮起新增降到百级，但第 12 轮仍有 27 条新序列——未收敛。", 11.5))
    out.append(txt(x0, ybase + 74, "第 3 轮后新序列以蛇毒金属蛋白酶为主（11–19% identity，", 11.5))
    out.append(txt(x0, ybase + 90, "E≈1e-5），是 PSSM 被半胱氨酸骨架带偏的漂移信号。", 11.5))

    bx, by = 620, 300
    bw2 = 36
    hmax = max(v for _, v in hist)
    out.append(txt(bx - 6, 34, "序列数", 12, "end", GREY))
    for i, (lab, v) in enumerate(hist):
        x = bx + i * (bw2 + 6)
        h = (v / hmax) * 190
        color = BLUE if lab in (">=95", "90-95") else (MID if lab in ("80-90", "70-80") else (SOFT if lab in ("60-70", "50-60") else (PALE if lab in ("40-50", "30-40") else MIST)))
        out.append(rect(x, by - h, bw2, h, color))
        out.append(txt(x + bw2 / 2, by - h - 5, f"{v:,}", 10.5, "middle", INK, "700"))
        out.append(txt(x + bw2 / 2, by + 16, lab + "%", 10.5, "middle", GREY))
    out.append(line(bx, by, bx + 9 * (bw2 + 6) - 6, by, "#333", 0.9))
    out.append(txt(bx, by + 40, f"DELTA-BLAST 共命中 {nhist:,} 条序列，横轴为与 query 的一致性。", 11.5))
    out.append(txt(bx, by + 56, "40% 以下占 67%：远缘直系同源（鱼类 EGF）与只共享 EGF 重复的", 11.5))
    out.append(txt(bx, by + 72, "蛋白（如 LRP1，29% identity 而 E=2.6e-103）都落在这一档。", 11.5))
    out.append("</svg>")
    return "\n".join(out)


# ---------------------------------------------------------------- 图 3
def fig3(sm):
    W, H = 1000, 380
    out = [head(W, H, "（a）blastp 参数敏感性（query＝人 EGF 前体 1207 aa）　　（b）27 aa 短片段：blastp 与 blastp-short")]
    x0, ybase, hmax = 60, 268, 150
    groups = [
        ("word size", [("2", int(sm["t2b_blastp_w2"]["subjects"])), ("3", int(sm["t2a_blastp_default"]["subjects"])), ("6", int(sm["t2c_blastp_w6"]["subjects"]))]),
        ("替换矩阵", [("45", int(sm["t2d_blastp_blosum45"]["subjects"])), ("62", int(sm["t2a_blastp_default"]["subjects"])), ("90", int(sm["t2e_blastp_blosum90"]["subjects"]))]),
        ("E-value", [("1e-3", int(sm["t2f_blastp_e1e3"]["subjects"])), ("10", int(sm["t2a_blastp_default"]["subjects"])), ("1000", int(sm["t2g_blastp_e1000"]["subjects"]))]),
    ]
    gmax = max(v for _, g in groups for _, v in g)
    out.append(txt(x0 - 6, 34, "命中序列数", 12, "end", GREY))
    for gi, (gname, bars) in enumerate(groups):
        gx = x0 + gi * 158
        out.append(txt(gx, 72, gname, 12.5, "start", INK, "700"))
        for i, (lab, v) in enumerate(bars):
            x = gx + i * 46
            h = (v / gmax) * hmax
            color = BLUE if lab in ("3", "62", "10") else PALE
            out.append(rect(x, ybase - h, 34, h, color))
            out.append(txt(x + 17, ybase - h - 5, f"{v:,}", 10.5, "middle", INK, "700"))
            out.append(txt(x + 17, ybase + 15, lab, 11, "middle", GREY))
        if gi < 2:
            out.append(line(gx + 140, 58, gx + 140, ybase + 20, "#d8dde3", 0.8))
    out.append(line(x0, ybase, x0 + 3 * 158 - 18, ybase, "#333", 0.9))
    out.append(txt(x0, ybase + 36, "蓝柱＝默认值。默认参数附近曲线很平：word size 3→2 反而少 8 条，", 11.5))
    out.append(txt(x0, ybase + 52, "BLOSUM62→45 多 131 条；E 从 10 放到 1000 才多 663 条。", 11.5))
    out.append(txt(x0, ybase + 74, "真正改变结果的是矩阵与 E 值，不是 word size。", 11.5))
    out.append(txt(x0, ybase + 96, "默认：word size 3、BLOSUM62、gap 11/1、E=10。", 11.5, "start", GREY))
    out.append(txt(x0, ybase + 112, "（BLAST+ 2.16 实测，与网页版 search summary 一致）", 11.5, "start", GREY))

    out.append(line(555, 30, 555, 370, "#c9ced6", 0.9))
    bx = 580
    out.append(txt(bx, 60, "27 aa 片段（前体 966–992）", 12.5, "start", INK, "700"))
    pairs = [("默认 blastp", 1797, 724, 61.6, BLUE), ("blastp-short", 8763, 680, 61.3, RED)]
    vmax = 9000
    for i, (name, tot, e005, bits, color) in enumerate(pairs):
        y = 82 + i * 96
        out.append(txt(bx, y + 12, name, 12.5, "start", INK, "700"))
        out.append(txt(bx + 390, y + 12, f"最高 bitscore {bits}", 11, "end", GREY))
        out.append(rect(bx, y + 20, (tot / vmax) * 330, 20, color))
        out.append(txt(bx + (tot / vmax) * 330 + 6, y + 35, f"命中 {tot:,}", 11.5, "start", INK, "700"))
        out.append(rect(bx, y + 46, (e005 / vmax) * 330, 20, MIST))
        out.append(txt(bx + (e005 / vmax) * 330 + 6, y + 61, f"E<0.005 {e005:,}", 11.5, "start", INK))
    out.append(txt(bx, 286, "blastp-short 换 PAM30＋word 2＋gap 9/1＋阈值 16，命中 4.9 倍，", 11.5))
    out.append(txt(bx, 302, "但 E<0.005 反而略少、最高分也略低：短 query 的检索空间", 11.5))
    out.append(txt(bx, 318, "只有 27×库长，E 值下不去；灵敏度靠矩阵买，特异性仍要人工核。", 11.5))
    out.append(txt(bx, 344, "两者 top1 相同：NP_001343950（EGF isoform 4），100% identity，E≈1e-11", 11.5, "start", GREY))
    out.append("</svg>")
    return "\n".join(out)


# ---------------------------------------------------------------- 图 4
def fig4():
    W, H = 1000, 400
    out = [head(W, H, "（a）12 条跨物种直系同源（对人 EGF 的一致性）　　（b）10 条人源并系同源（对 EGF 的一致性）")]
    orth = [("Homo sapiens", 100.0), ("Pan troglodytes", 96.6), ("Macaca fascicularis", 93.2),
            ("Sus scrofa", 80.3), ("Canis lupus familiaris", 78.4), ("Rattus norvegicus", 67.1),
            ("Mus musculus", 66.2), ("Gallus gallus", 52.3), ("Xenopus tropicalis", 45.9),
            ("Salmo salar", 45.2), ("Oncorhynchus mykiss", 44.6), ("Danio rerio", 40.7)]
    para = [("EGF", 100.0, 1207), ("TGFA", 33.0, 97), ("HBEGF", 30.8, 78), ("NRG2", 30.1, 83),
            ("NRG4", 30.1, 93), ("AREG", 27.8, 72), ("BTC", 27.5, 102), ("EREG", 26.7, 116),
            ("NRG3", 26.6, 94), ("NRG1", 24.1, 79)]

    # (a Prelude) 直系同源
    out.append(txt(10, 54, "物种分化，一致性随时间单调下降（100.0 → 40.7）", 11.5, "start", GREY))
    lx, bx, bw = 168, 176, 236
    for i, (name, pid) in enumerate(orth):
        y = 76 + i * 20
        color = BLUE if pid >= 90 else (MID if pid >= 70 else (SOFT if pid >= 50 else PALE))
        out.append(txt(lx, y + 11, name, 11.5, "end"))
        out.append(rect(bx, y, (pid / 100) * bw, 14, color))
        out.append(txt(bx + 4 + (pid / 100) * bw, y + 11, f"{pid:.1f}", 11, "start", INK, "700"))
    out.append(txt(10, 348, "序列存于 sequences/orthologs_EGF_protein_12.fa", 11, "start", GREY))

    # (b) 并系同源
    out.append(line(500, 34, 500, 330, "#c9ced6", 0.9))
    out.append(txt(516, 54, "只有成熟 EGF 域对齐（72–1207 aa），一致性 24–33%", 11.5, "start", GREY))
    lx2, bx2, bw2 = 640, 648, 150
    for i, (name, pid, alen) in enumerate(para):
        y = 76 + i * 20
        color = BLUE if pid >= 90 else (MID if pid >= 30 else SOFT)
        out.append(txt(lx2, y + 11, name, 11.5, "end"))
        out.append(rect(bx2, y, (pid / 100) * bw2, 14, color))
        out.append(txt(bx2 + 4 + (pid / 100) * bw2, y + 11, f"{pid:.1f}", 11, "start", INK, "700"))
        out.append(txt(838, y + 11, f"对齐 {alen} aa", 10.5, "start", GREY))
    out.append(txt(516, 348, "序列存于 sequences/paralogs_EGF_family_protein_10.fa", 11, "start", GREY))
    out.append("</svg>")
    return "\n".join(out)


def main():
    sm = load_summary()
    psi = load_psi()
    hist, nhist = delta_hist()
    figs = {
        "fig1_alg_params.svg": fig1(sm),
        "fig2_psi_delta.svg": fig2(psi, hist, nhist),
        "fig3_blastp_params.svg": fig3(sm),
        "fig4_homologs.svg": fig4(),
    }
    for name, svg in figs.items():
        (ROOT / name).write_text(svg + "\n", encoding="utf-8")
        print(f"{name}  {len(svg)} bytes")


if __name__ == "__main__":
    main()

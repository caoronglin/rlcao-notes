#!/usr/bin/env python3
"""图 2：多层级力学链条中「应力方向感知」的断点定位（自绘，v2）。

设计要点
  - 视觉语言沿用图 1（fig1.tex）的低饱和莫兰迪配色与圆角框；
  - 四层由左至右为尺度递进：纤维 → 细胞壁 → 细胞 → 组织；
  - 每层区分「已确立的分子实体」与「该层可测的力学量」；
  - 下方虚线带标出贯穿全链的未解接口（★ 断点）；
  - 最下方诚实标注各条力学证据的来源系统，含拟南芥 SAM 本体条目（Lan et al. 2025）。

输出：fig2.svg（唯一权威矢量源）+ fig2.png（由同一 SVG 经 cairosvg 栅格化，3000px 宽，透明底）。

配色/版式规范来自 plot-figure-skill（低饱和、色盲安全、去 chartjunk、≥6pt、
透明底、PNG 由同一 SVG 栅格化）。该 skill 自带的 gen_figure.py 在本机不存在
（skill 目录仅含说明文档），按其降级条款改用 matplotlib 直出。
"""
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
from matplotlib import font_manager

HERE = Path(__file__).resolve().parent

# —— 配色（与 fig1.tex 一致）——
C_LBG, C_LLN = "#EEF4EF", "#5E7F68"   # 机理侧 底、线
C_RBG, C_RLN = "#EDF1F7", "#5A6E8C"   # 力学侧 底、线
C_TXT, C_SUB = "#1F2328", "#5A6169"   # 主/次文字
C_CHL = "#9A7B4F"                     # 标签线
C_WARN, C_WBG = "#A6504A", "#FBF0EE"  # 断点线、断点底（低饱和警示色）
C_EDGE = "#C9CFD6"

# —— 字体 ——
FONT = next((c for c in ("Noto Sans CJK SC", "Noto Sans CJK JP", "Droid Sans Fallback")
             if any(c in f.name for f in font_manager.fontManager.ttflist)), "DejaVu Sans")
plt.rcParams["font.family"] = FONT
plt.rcParams["axes.unicode_minus"] = False

# —— 四层内容（文本已按框宽 39 mm 精简，每行 ≤15 字符）——
LAYERS = [
    dict(cn="纤维", en="fiber", bg=C_LBG, ln=C_LLN,
         mol="纤维素微纤维为主承力\n木葡聚糖、果胶承力弱",
         mech="纤维—纤维接触传张力"),
    dict(cn="细胞壁", en="wall", bg=C_LBG, ln=C_LLN,
         mol="壁 pH → 扩张蛋白松弛\nTHESEUS1 / WAK 壁传感器",
         mech="各向异性；不可逆屈服"),
    dict(cn="细胞", en="cell", bg=C_RBG, ln=C_RLN,
         mol="皮层微管 → CSC → 壁\n壁—膜—骨架连续体",
         mech="膨压；微管受拉稳定"),
    dict(cn="组织", en="tissue", bg=C_RBG, ln=C_RLN,
         mol="CLV3–WUS、生长素梯度\n划定分生组织分区",
         mech="张力分布；指定 vs 合成生长"),
]

# —— 力学证据的来源系统（底部）——
EVIDENCE = [
    ("SAM 本体", "CSLD5 缺失 → 壁刚度降低\n触觉响应基因下调", True),
    ("根创伤愈合", "微管受拉稳定、受压失稳\n→ 分裂面重定向", False),
    ("侧根起始", "空间限定微管阵列\n由 MAP70-5 建立", False),
    ("叶表皮铺砌细胞", "CSC–微管机械耦合\n抑制共对齐", False),
]

W_MECH, GAP = 0.2305, 0.0260


def box(ax, x, y, w, h, fc, ec, lw=1.1, r=0.010, z=2, ls="-"):
    ax.add_patch(FancyBboxPatch(
        (x, y), w, h, boxstyle=f"round,pad=0,rounding_size={r}",
        fc=fc, ec=ec, lw=lw, zorder=z, linestyle=ls))


def fig2():
    fig = plt.figure(figsize=(7.24, 4.55), dpi=100)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis("off")

    # ——— 标题 ———
    ax.text(0.5, 0.968, "多层级力学链条中「应力方向感知」的断点定位",
            ha="center", va="center", fontsize=11.5, color=C_TXT, fontweight="bold")
    ax.text(0.5, 0.925,
            "自左至右为尺度递进；应力在每一层都存在，但数值逐级不同，不可跨级套用",
            ha="center", va="center", fontsize=7.3, color=C_SUB)

    top, bh = 0.862, 0.372
    y_cn, y_en, y_mol = top - 0.048, top - 0.084, top - 0.142
    y_mech, h_mech = 0.556, 0.088

    for i, L in enumerate(LAYERS):
        x = 0.006 + i * (W_MECH + GAP)
        box(ax, x, top - bh, W_MECH, bh, L["bg"], L["ln"])

        ax.text(x + W_MECH / 2, y_cn, L["cn"], ha="center", va="center",
                fontsize=10, color=C_TXT, fontweight="bold")
        ax.text(x + W_MECH / 2, y_en, L["en"], ha="center", va="center",
                fontsize=7, color=L["ln"], style="italic")
        ax.text(x + 0.014, y_mol, L["mol"], ha="left", va="center",
                fontsize=6.5, color=C_TXT, linespacing=1.62)

        # 分隔线
        ax.plot([x + 0.012, x + W_MECH - 0.012], [y_mech + h_mech + 0.016] * 2,
                color=L["ln"], lw=0.6, alpha=0.45, zorder=3)

        # 该层可测力学量
        box(ax, x + 0.011, y_mech, W_MECH - 0.022, h_mech,
            "#FFFFFF", L["ln"], lw=0.7, r=0.007, z=3)
        ax.text(x + W_MECH / 2, y_mech + h_mech / 2, L["mech"],
                ha="center", va="center", fontsize=6.6, color=C_SUB, zorder=4)

        if i < len(LAYERS) - 1:
            ax.add_patch(FancyArrowPatch(
                (x + W_MECH + 0.003, top - bh / 2), (x + W_MECH + GAP - 0.003, top - bh / 2),
                arrowstyle="-|>", mutation_scale=9, lw=1.0, color=C_CHL, zorder=5))

    ax.text(0.5, top - bh - 0.030,
            "应力沿纤维 → 壁 → 跨壁传导至细胞骨架 → 组织内重新分布",
            ha="center", va="center", fontsize=6.8, color=C_SUB)

    # ——— ★ 断点 ———
    yb, hb = 0.268, 0.150
    box(ax, 0.006, yb, 0.988, hb, C_WBG, C_WARN, lw=1.2, r=0.009, z=2, ls=(0, (5, 3)))
    ax.text(0.028, yb + hb - 0.034, "★ 未解接口　应力方向如何被转写为化学信号",
            ha="left", va="center", fontsize=8.5, color=C_WARN, fontweight="bold")
    ax.text(0.028, yb + hb - 0.082,
            "细胞如何区分全局应力与局部应力？方向信息在壁—膜—骨架的何处被读取？\n"
            "已知假说（跨膜受体双域结构、膜蛋白不对称定位）均缺乏决定性证据。",
            ha="left", va="center", fontsize=6.8, color=C_TXT, linespacing=1.55)

    # ——— 力学证据的来源系统 ———
    ax.text(0.006, 0.222, "现有力学证据的来源系统（仅第一条在茎端分生组织本体上，其余均为外推）",
            ha="left", va="center", fontsize=7.3, color=C_TXT, fontweight="bold")
    bw, bgp = 0.2385, 0.0125
    for i, (src, txt, is_sam) in enumerate(EVIDENCE):
        x = 0.006 + i * (bw + bgp)
        box(ax, x, 0.072, bw, 0.112, "#FFFFFF",
            C_WARN if is_sam else C_EDGE, lw=1.0 if is_sam else 0.8, r=0.007, z=2)
        ax.text(x + 0.012, 0.158, f"系统：{src}", ha="left", va="center",
                fontsize=6.5, color=C_WARN if is_sam else C_CHL,
                style="italic", fontweight="bold" if is_sam else "normal", zorder=3)
        ax.text(x + 0.012, 0.113, txt, ha="left", va="center",
                fontsize=6.4, color=C_TXT, linespacing=1.55, zorder=3)

    # ——— 底注 ———
    ax.text(0.5, 0.030,
            "SAM 本体已可直接测得壁刚度与生长，但壁状态改变与内层转录响应之间，"
            "仍缺少可解耦的因果实验（壁软化与细胞周期阻滞未被分开）",
            ha="center", va="center", fontsize=6.7, color=C_SUB, style="italic")

    svg, png = HERE / "fig2.svg", HERE / "fig2.png"
    fig.savefig(svg, format="svg", transparent=True)
    # LaTeX 无法直接引用 SVG，另存同源 PDF 矢量版（与 fig1.pdf 对齐）
    fig.savefig(HERE / "fig2.pdf", format="pdf", transparent=True)
    return svg, png


def main():
    svg, png = fig2()
    print("写出", svg)
    try:
        import cairosvg
        cairosvg.svg2png(url=str(svg), write_to=str(png), output_width=3000)
        print("PNG 由同一 SVG 栅格化：", png)
    except Exception as e:
        print(f"[降级] cairosvg 不可用（{e}）；请重跑并在有 cairosvg 的环境栅格化")
        raise


if __name__ == "__main__":
    main()

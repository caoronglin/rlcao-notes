#!/usr/bin/env python3
"""正文符号引用键 → 按出现顺序重编号 + 生成 GB/T 7714 参考文献表。

输入  work/paper_body_draft.md（形如 [Cui][Cosgrove]）
输出  paper/paper.md

元数据全部经 Crossref API 实证核对（2026-10-06）；Annual Review 系列不设期号；
PNAS 用全称；姓氏以论文 PDF 首页为准（Crossref 对 e2321877121 的 family 字段有误，
PDF 首页作 "Zi-Liang Hua"，故按 Hua 著录）。
"""
import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "work" / "paper_body_draft.md"
DST = ROOT / "paper" / "paper.md"

# key -> (作者串, 题目, 期刊, 年, 卷(期), 页/文章号, DOI)
REFS = {
 "Cui":      ("Cui G, Li Y, Zheng L, 等", "The peptidase DA1 cleaves and destabilizes WUSCHEL to control shoot apical meristem size", "Nature Communications", 2024, "15(1)", "4627", "10.1038/s41467-024-48361-7"),
 "Coen":     ("Coen E, Cosgrove DJ", "The mechanics of plant morphogenesis", "Science", 2023, "379(6631)", "eade8055", "10.1126/science.ade8055"),
 "Cosgrove": ("Cosgrove DJ", "Structure and growth of plant cell walls", "Nature Reviews Molecular Cell Biology", 2024, "25(5)", "340–358", "10.1038/s41580-023-00691-y"),
 "Dao":      ("Dao TQ, Weksler N, Liu HMH, 等", "Interactive CLV3, CLE16 and CLE17 signaling mediates stem cell homeostasis in the Arabidopsis shoot apical meristem", "Development", 2022, "149(19)", "dev200787", "10.1242/dev.200787"),
 "John":     ("John A, Smith ES, Jones DS, 等", "A network of CLAVATA receptors buffers auxin-dependent meristem maintenance", "Nature Plants", 2023, "9(8)", "1306–1317", "10.1038/s41477-023-01485-y"),
 "Uzair":    ("Uzair M, Urquidi Camacho RA, Liu Z, 等", "An updated model of shoot apical meristem regulation by ERECTA family and CLAVATA3 signaling pathways in Arabidopsis", "Development", 2024, "151(12)", "dev202870", "10.1242/dev.202870"),
 "Wang":     ("Wang G, Wu Z, Sun B", "KNUCKLES regulates floral meristem termination by controlling auxin distribution and cytokinin activity", "The Plant Cell", 2025, "37(1)", "koae312", "10.1093/plcell/koae312"),
 "Kicheva":  ("Kicheva A, Briscoe J", "Control of tissue development by morphogens", "Annual Review of Cell and Developmental Biology", 2023, "39", "91–121", "10.1146/annurev-cellbio-020823-011522"),
 "Yadav":    ("Yadav S, Kumar H, Mahajan M, 等", "Local auxin biosynthesis promotes shoot patterning and stem cell differentiation in Arabidopsis shoot apex", "Development", 2023, "150(23)", "dev202014", "10.1242/dev202014"),
 "Burian":   ("Burian A, Paszkiewicz G, Nguyen KT, 等", "Specification of leaf dorsiventrality via a prepatterned binary readout of a uniform auxin input", "Nature Plants", 2022, "8(3)", "269–280", "10.1038/s41477-022-01111-3"),
 "Alonso":   ("Alonso-Serra J, Cerutti G, Godin C, 等", "Water fluxes pattern growth and identity in shoot meristems", "Nature Communications", 2024, "15(1)", "6944", "10.1038/s41467-024-51099-x"),
 "Zhang":    ("Zhang K, Zhang H, Pan Y, 等", "Cell- and noncell-autonomous AUXIN RESPONSE FACTOR3 controls meristem proliferation and phyllotactic patterns", "Plant Physiology", 2022, "190(4)", "2335–2349", "10.1093/plphys/kiac370"),
 "Hua":      ("Hua ZL, Wilson-Sánchez D, Bhatia N, 等", "A CUC1/auxin genetic module links cell polarity to patterned tissue growth and leaf shape diversity in crucifer plants", "Proceedings of the National Academy of Sciences", 2024, "121(26)", "e2321877121", "10.1073/pnas.2321877121"),
 "Schneider":("Schneider R, Ehrhardt DW, Meyerowitz EM, 等", "Tethering of cellulose synthase to microtubules dampens mechano-induced cytoskeletal organization in Arabidopsis pavement cells", "Nature Plants", 2022, "8(9)", "1064–1073", "10.1038/s41477-022-01218-7"),
 "Stöckle":  ("Stöckle D, Reyes-Hernández BJ, Vilches Barro A, 等", "Microtubule-based perception of mechanical conflicts controls plant organ morphogenesis", "Science Advances", 2022, "8(6)", "eabm4974", "10.1126/sciadv.abm4974"),
 "Lan":      ("Lan M, Zhu Y, Peaucelle A, 等", "CSLD5-mediated cell wall remodelling regulates tissue mechanics and shoot meristem growth", "Nature Communications", 2025, "16(1)", "7229", "10.1038/s41467-025-62651-8"),
 "Hoermayer":("Hoermayer L, Montesinos JC, Trozzi N, 等", "Mechanical forces in plant tissue matrix orient cell divisions via microtubule stabilization", "Developmental Cell", 2024, "59(10)", "1333–1344", "10.1016/j.devcel.2024.03.009"),
 "Harman":   ("Harmansa S, Erlich A, Eloy C, 等", "Growth anisotropy of the extracellular matrix shapes a developing organ", "Nature Communications", 2023, "14(1)", "1220", "10.1038/s41467-023-36739-y"),
 "Bailles":  ("Bailles A, Gehrels EW, Lecuit T", "Mechanochemical principles of spatial and temporal patterns in cells and tissues", "Annual Review of Cell and Developmental Biology", 2022, "38", "321–347", "10.1146/annurev-cellbio-120420-095337"),
 "Neumann":  ("Neumann M, Xu X, Smaczniak C, 等", "A 3D gene expression atlas of the floral meristem based on spatial reconstruction of single nucleus RNA sequencing data", "Nature Communications", 2022, "13(1)", "2838", "10.1038/s41467-022-30177-y"),
 "Long":     ("Long KA, Lister A, Jones MRW, 等", "Spatial transcriptomics reveals expression gradients in developing wheat inflorescences at cellular resolution", "The Plant Cell", 2026, "38(1)", "koaf282", "10.1093/plcell/koaf282"),
 "Demesa":   ("Demesa-Arevalo E, Dörpholz H, Vardanega I, 等", "Imputation integrates single-cell and spatial gene expression data to resolve transcriptional networks in barley shoot meristem development", "Nature Plants", 2026, "12(1)", "107–124", "10.1038/s41477-025-02176-6"),
 "Vardanega":("Vardanega I, Maika JE, Demesa-Arevalo E, 等", "CLAVATA signalling shapes barley inflorescence by controlling activity and determinacy of shoot meristem and rachilla", "Nature Communications", 2025, "16(1)", "3937", "10.1038/s41467-025-59330-z"),
}

KEY_RE = re.compile(r"\[([A-Za-zöäüé]+)\]")


def main():
    txt = SRC.read_text(encoding="utf-8")

    # 1) 按首次出现顺序分配编号
    order, seen = [], set()
    for k in KEY_RE.findall(txt):
        if k not in REFS:
            raise SystemExit(f"未知引用键 [{k}]，请在 REFS 中补元数据")
        if k not in seen:
            seen.add(k); order.append(k)
    num = {k: i + 1 for i, k in enumerate(order)}

    # 2) 替换为数字；同时压缩同号连续引用 [3][3] -> [3]
    out = KEY_RE.sub(lambda m: f'[{num[m.group(1)]}]', txt)
    out = re.sub(r"\[(\d+)\](?:\[\1\])+", lambda m: f'[{m.group(1)}]', out)

    # 3) 生成参考文献
    lines = [
        "",
        "---",
        "",
        "## 参考文献",
        "",
        "> 元数据经 Crossref API 逐条实证核对（2026-10-06）；Annual Review 系列不设期号；",
        "> 姓氏以论文 PDF 首页为准（e2321877121 的 Crossref family 字段有误，PDF 首页作 \"Zi-Liang Hua\"）。",
        "",
    ]
    for i, k in enumerate(order, 1):
        a, t, j, y, v, p, d = REFS[k]
        lines.append(f"{i}. {a}. {t}[J]. *{j}*, {y}, {v}: {p}. DOI: {d}")
    lines.append("")

    DST.write_text(out.rstrip() + "\n" + "\n".join(lines), encoding="utf-8")

    # 4) 自检
    body = DST.read_text(encoding="utf-8").split("## 参考文献")[0]
    han = len(re.findall(r"[一-鿿]", body))
    cited = sorted({int(x) for x in re.findall(r"\[(\d+)\]", body)})
    refsec = DST.read_text(encoding="utf-8").split("## 参考文献")[1]
    listed = [int(x) for x in re.findall(r"^(\d+)\. ", refsec, re.M)]
    print(f"引用键 {len(order)} 个 → 编号 1..{len(order)}")
    print(f"正文引用序号：{cited}")
    print(f"参考文献条目：{len(listed)} 条")
    print(f"孤儿（正文有/文献无）：{sorted(set(cited)-set(listed)) or '无'}")
    print(f"未引用条目：{sorted(set(listed)-set(cited)) or '无'}")
    print(f"正文汉字数：{han}（要求 3000–5000）{'✓' if 3000<=han<=5000 else '✗ 超范围'}")


if __name__ == "__main__":
    main()
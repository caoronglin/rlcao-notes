#!/usr/bin/env python3
"""实验四任务三（重做）：PF00400 (WD40) 模型辅助比对，以及以重复结构为参照的可靠性检验。

为什么不是直接跑 `clustalo --hmm-in`：
    Clustal Omega 1.2.4（Ubuntu 打包版）在本机实测对多序列输入**静默忽略** --hmm-in，
    输出与不加该参数逐字节相同、日志中无任何 HMM 记录（见 hmm_in_control.txt）。
    因此"模型辅助比对"改由 HMMER 完成：
      hmmalign  —— 把序列逐位点比对到模型（单重复层面，输出 Stockholm 含 #=GC RF）
      hmmsearch —— 在每条序列上定位全部 WD40 重复实例（重复层面）

可靠性怎么判读（对应任务书"二级结构单元是否正确比对、空位是否放在单元之间"）：
  1. WD40 重复是固定的结构单元。正确比对下，同一序号（N→C 第 k 个）的重复在比对里应当
     落在成组的位置，且同一序列内 k 增大时列号必须单调递增。
     重复错位（domain swapping）会让若干序列的锚点列次序翻转或落到前一个重复的位置，
     这在"跨方法一致率(F1)"里看不出来——方法是错的，但错得彼此一致。
  2. 空位应优先落在重复之间（连接区），而不是重复内部（会让 β 折叠断开）。

输出：
  fie_domain_PF00400.sto      hmmalign 单重复比对
  wd40_repeats.tsv            每条序列的 WD40 重复坐标（正分 domain）
  repeat_anchor_columns.tsv   各比对中各重复锚点的比对列号
  repeat_consistency.tsv      锚点列的离散度与单调性违约数
  domain_gap_profile.tsv      空位落在重复内部 / 重复之间的比例
  hmm_in_control.txt          --hmm-in 无效的实测对照
"""
import pathlib
import statistics as st

import pyhmmer
from pyhmmer.easel import Alphabet, SequenceFile
from pyhmmer.plan7 import HMMFile

BASE = pathlib.Path(__file__).resolve().parent
HMM_PATH = BASE.parent / "hmm" / "PF00400.hmm"
PROTEIN_ALL = BASE / "fie_protein_all.fasta"

ALIGNMENTS = [
    ("clustalo_default", BASE / "clustalo_proteinall_default.aln", "clu"),
    ("clustalo_iter3", BASE / "clustalo_proteinall_iter3.aln", "clu"),
    ("muscle", BASE / "muscle_proteinall.fasta", "fasta"),
    ("clustalo_pfam", BASE / "clustalo_proteinall_pfam.aln", "clu"),
]


def load_hmm():
    with HMMFile(str(HMM_PATH)) as hf:
        return next(hf)


def read_alignment(path, fmt):
    seqs, name, buf = {}, None, []
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        if fmt == "clu":
            if not line.strip() or line.startswith("CLUSTAL") or line[0] in " \t":
                continue
            parts = line.split()
            if len(parts) < 2:
                continue
            seqs[parts[0]] = seqs.get(parts[0], "") + parts[1]
        else:
            if line.startswith(">"):
                if name:
                    seqs[name] = "".join(buf)
                name, buf = line[1:].split()[0], []
            elif line.strip():
                buf.append(line.strip())
    if fmt != "clu" and name:
        seqs[name] = "".join(buf)
    return seqs


def column_index(align):
    """比对字符串 -> {残基序号(1-based): 比对列号(0-based)}"""
    out, resid = {}, 0
    for col, ch in enumerate(align):
        if ch in "-.":
            continue
        resid += 1
        out[resid] = col
    return out


def parse_stockholm(text):
    rows, rf_parts = {}, []
    for line in text.splitlines():
        if line.startswith("#=GC RF"):
            rf_parts.append(line.split(None, 2)[2].replace(" ", ""))
        elif line and not line.startswith(("#", "//")):
            parts = line.split(None, 1)
            if len(parts) == 2:
                rows[parts[0]] = rows.get(parts[0], "") + parts[1].strip()
    return rows, "".join(rf_parts)


def main():
    hmm = load_hmm()

    # ---------- 1. hmmalign：单重复层面的逐位点比对 ----------
    with SequenceFile(str(PROTEIN_ALL), digital=True, alphabet=Alphabet.amino()) as sf:
        block = sf.read_block()
    msa = pyhmmer.hmmer.hmmalign(hmm, block, trim=False)
    sto_path = BASE / "fie_domain_PF00400.sto"
    with open(sto_path, "wb") as f:
        msa.write(f, "stockholm")
    rows, rf = parse_stockholm(sto_path.read_text())
    n_match = sum(1 for c in rf if c != ".")
    print(f"hmmalign: {hmm.name} {hmm.accession} M={hmm.M} → {len(rows)} 条序列，"
          f"比对 {len(rf)} 列，其中匹配模型的位点 {n_match} 个")

    # ---------- 2. hmmsearch：重复层面的全部 WD40 实例 ----------
    hits = next(iter(pyhmmer.hmmer.hmmsearch([hmm], block, E=10.0)))
    repeats = {}   # name -> [(k, from, to, score)]
    for hit in hits:
        doms = [d for d in hit.domains if d.score > 0]
        doms.sort(key=lambda d: d.alignment.target_from)
        repeats[hit.name] = [(i + 1, d.alignment.target_from, d.alignment.target_to, d.score)
                             for i, d in enumerate(doms)]
    rep_lines = ["short_name\tn_repeats\trepeat\tfrom\tto\tscore"]
    for name, reps in sorted(repeats.items()):
        rep_lines.append(f"{name}\t{len(reps)}\t\t\t\t")
        for k, f_, t_, s_ in reps:
            rep_lines.append(f"{name}\t{len(reps)}\t{k}\t{f_}\t{t_}\t{s_:.1f}")
    (BASE / "wd40_repeats.tsv").write_text("\n".join(rep_lines) + "\n", encoding="utf-8")
    depth = {n: len(r) for n, r in repeats.items()}
    # 取覆盖 >=80% 序列的最大重复序号，保证同序号锚点有足够样本
    common = max(k for k in set(depth.values())
                 if sum(1 for v in depth.values() if v >= k) >= 0.8 * len(depth))
    print(f"WD40 重复数分布：{ {k: list(depth.values()).count(k) for k in sorted(set(depth.values()))} }"
          f"，其中 {sum(1 for v in depth.values() if v >= common)} 条至少 {common} 个重复")

    # ---------- 3. 各比对中重复锚点的列位置 ----------
    aln = {label: read_alignment(path, fmt) for label, path, fmt in ALIGNMENTS}
    colmaps = {label: {n: column_index(a) for n, a in aln[label].items()} for label in aln}

    anchor_lines = ["short_name\trepeat\tresidue\t" + "\t".join(l for l, _, _ in ALIGNMENTS)]
    anchors = {label: {} for label in aln}
    for name, reps in repeats.items():
        for k, f_, t_, s_ in reps:
            if k > common:
                continue
            mid = (f_ + t_) // 2
            row = [name, str(k), str(mid)]
            for label in anchors:
                col = colmaps[label].get(name, {}).get(mid, None)
                anchors[label].setdefault(k, []).append(col)
                row.append(str(col) if col is not None else "NA")
            anchor_lines.append("\t".join(row))
    (BASE / "repeat_anchor_columns.tsv").write_text("\n".join(anchor_lines) + "\n", encoding="utf-8")

    cons = ["alignment\trepeat\tn_sequences\tmedian_col\tstdev_col\t"
            "monotonic_violations\tn_sequences_checked"]
    detail = []
    for label, _, _ in ALIGNMENTS:
        tot_viol = tot_seq = 0
        for name, reps in repeats.items():
            cols = [colmaps[label][name].get((f_ + t_) // 2) for k, f_, t_, s_ in reps if k <= common]
            if len(cols) < 2 or any(c is None for c in cols):
                continue
            tot_seq += 1
            tot_viol += sum(1 for a, b in zip(cols, cols[1:]) if b <= a)
        for k in range(1, common + 1):
            vals = [v for v in anchors[label].get(k, []) if v is not None]
            if not vals:
                continue
            cons.append(f"{label}\t{k}\t{len(vals)}\t{st.median(vals):.0f}\t"
                        f"{st.pstdev(vals):.1f}\t{tot_viol}\t{tot_seq}")
        detail.append((label, tot_viol, tot_seq))
    (BASE / "repeat_consistency.tsv").write_text("\n".join(cons) + "\n", encoding="utf-8")

    # ---------- 4. 空位分布：重复内部 vs 重复之间 ----------
    gap_lines = ["alignment\tgap_total\tgap_inside_repeat\tgap_inside_pct\tgap_between_pct"]
    for label, _, _ in ALIGNMENTS:
        total = gap_in = 0
        for name, a in aln[label].items():
            reps = repeats.get(name, [])

            def rep_of(r):
                if r is None:
                    return None
                for k, f_, t_, s_ in reps:
                    if f_ <= r <= t_:
                        return k
                return None

            col2res = {c: r for r, c in colmaps[label][name].items()}
            last_res = None
            for col, ch in enumerate(a):
                if ch not in "-.":
                    last_res = col2res.get(col)
                    continue
                nxt = None
                for col2 in range(col + 1, len(a)):
                    if a[col2] not in "-.":
                        nxt = col2res.get(col2)
                        break
                total += 1
                # 空位落在某个重复内部：左右两侧最近残基属于同一个重复
                if rep_of(last_res) is not None and rep_of(last_res) == rep_of(nxt):
                    gap_in += 1
        gap_lines.append(f"{label}\t{total}\t{gap_in}\t{100 * gap_in / total:.1f}\t"
                         f"{100 * (total - gap_in) / total:.1f}")
    (BASE / "domain_gap_profile.tsv").write_text("\n".join(gap_lines) + "\n", encoding="utf-8")

    print()
    print("\n".join(cons))
    print()
    print("\n".join(gap_lines))
    print("\n重复锚点列（前 6 行）：")
    print("\n".join(anchor_lines[:7]))


if __name__ == "__main__":
    main()

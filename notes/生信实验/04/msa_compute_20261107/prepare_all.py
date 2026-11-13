"""按实验四任务书构建全量蛋白输入：实验二 11 条 + 实验三保存候选，按登录号去重。"""
from pathlib import Path
import csv
from Bio import SeqIO

root = Path(__file__).resolve().parent
src2 = root.parent.parent / '02' / 'sequences'
src3 = root.parent.parent / '03' / 'sequences'

def accessions(path):
    import re
    pat = re.compile(r'\b((?:[A-Z]{2}_|NP_|XP_|sp\||tr\|)[A-Za-z0-9]+\.\d+)')
    out = []
    for r in SeqIO.parse(path, 'fasta'):
        m = pat.search(r.description)
        acc = m.group(1).split('|')[-1] if m else r.id
        out.append((acc, str(r.seq).upper()))
    return out

# 02 的 11 条沿用既有短名
BASE = {
    'NP_001105181.1': 'ZmFIE1', 'NP_001409834.1': 'OsFIE1', 'XP_002443823.1': 'SbFIE1',
    'XP_044422620.1': 'TaFIE1', 'XP_044958711.1': 'HvFIE1', 'NP_001105182.1': 'ZmFIE2',
    'XP_015649120.1': 'OsFIE2', 'XP_002443822.1': 'SbFIE2', 'XP_044444471.1': 'TaFIE2',
    'XP_003571503.1': 'BdFIE2', 'NP_188710.1': 'AtFIE',
}
# 实验三新增序列的短名（≤10 字符，唯一）
EXTRA = {
    'XP_006659098.1': 'ObFIE1',    # Oryza brachyantha FIE1
    'XP_066168940.1': 'OsFIE1L',   # O. sativa FIE1-like isoform X1
    'XP_047073679.1': 'LrFIE1',    # Lolium rigidum
    'XP_044431131.1': 'TaFIE1b',   # T. aestivum FIE1（与 02 的 TaFIE1 不同登录号）
    'XP_010906361.1': 'EgFIE1',    # Elaeis guineensis isoform X2
    'XP_065007749.1': 'MaFIE1',    # Musa acuminata
    'XP_004972907.1': 'SiFIE2',    # Setaria italica
    'XP_039852764.1': 'PvFIE2',    # Panicum virgatum
    'XP_025820977.1': 'PhFIE2',    # Panicum hallii
    'XP_066326110.1': 'MfFIE2',    # Miscanthus floridulus
    'XP_062196520.1': 'PaFIE2',    # Phragmites australis
    'XP_003573353.1': 'BdFIE2b',   # B. distachyon FIE2 isoform X2
    'XP_022935834.1': 'CmFIE2',    # Cucurbita moschata
    'XP_007211457.1': 'PpFIE2',    # Prunus persica
    'XP_023158000.1': 'ZmFIE1X1',  # 玉米 FIE1 isoform X1
    'XP_072150685.1': 'SvFIE2',    # Setaria viridis
    'XP_039814760.1': 'PvFIE2b',   # P. virgatum 第二条
    'XP_039814761.1': 'PvFIE2c',   # P. virgatum 第三条
    'XP_074570674.1': 'ClFIE1',    # Curcuma longa
    'XP_020177403.1': 'AetFIE1',   # Aegilops tauschii
    'XP_037467875.1': 'TdFIE1',    # T. dicoccoides
    'XP_048540628.1': 'TuFIE1',    # T. urartu
    'XP_072967274.1': 'TnFIE1',    # Typha angustifolia
    'XP_057540405.1': 'AmtFIE1',   # Amaranthus tricolor isoform X2
    'XP_024542824.1': 'SmFIE2',    # Selaginella moellendorffii
    'XP_024315468.1': 'BdFIE2c',   # B. distachyon FIE2 isoform X2（另一登录号）
    'XP_073114095.1': 'EgFIE1b',   # E. guineensis isoform X4
    'XP_011395611.1': 'ApFIE2',    # Auxenochlorella protothecoides
}

# 已核查：03/sequences/fie_core_proteins.fasta 的 10 条均为 02 蛋白的子集，去重后
# 不新增登录号；EGF 家族与 homologs_deltablast_27.fa 属另一研究分子（人 EGF），不纳入。
merged = {}   # acc -> (seq, [source...])
for label, path in [('02_protein', src2 / 'FIE_family_protein.fasta'),
                    ('03_orthologs', src3 / 'fie_orthologs_12.fasta'),
                    ('03_paralogs', src3 / 'fie_paralogs_10.fasta'),
                    ('03_delta_layers', src3 / 'fie_delta_layers.fasta')]:
    for acc, seq in accessions(path):
        if acc in merged:
            assert merged[acc][0] == seq, (acc, 'sequence conflict between files')
            merged[acc][1].append(label)
        else:
            merged[acc] = (seq, [label])

names = {}
for acc in merged:
    nm = BASE.get(acc) or EXTRA.get(acc)
    assert nm, f'未分配短名: {acc} (来源 {merged[acc][1]})'
    assert acc not in names
    names[acc] = nm
assert len(set(names.values())) == len(names), '短名重复'
assert all(len(n) <= 10 for n in names.values()), '短名超过 10 字符'
assert len(names) == len(merged)

with (root / 'fie_protein_all.fasta').open('w') as f:
    for acc, (seq, _) in merged.items():
        f.write(f'>{names[acc]}\n{seq}\n')

with (root / 'name_mapping.tsv').open('w') as f:
    w = csv.writer(f, delimiter='\t')
    w.writerow(['short_name', 'accession', 'sources'])
    for acc, (seq, src) in merged.items():
        w.writerow([names[acc], acc, '+'.join(src)])

n02 = sum(1 for v in merged.values() if '02_protein' in v[1])
n03 = sum(1 for v in merged.values() if any(s.startswith('03_') for s in v[1]))
print(f'全量蛋白 {len(merged)} 条；实验二贡献 {n02} 条，实验三贡献 {n03} 条，'
      f'仅实验三新增 {len(merged) - n02} 条')

"""36 条全量蛋白比对的两两一致性（口径：双非空位对齐列）。"""
from pathlib import Path
from itertools import combinations
from Bio import AlignIO
import csv

p = Path(__file__).resolve().parent
aln = AlignIO.read(p / 'clustalo_proteinall_default.aln', 'clustal')
seqs = {r.id: str(r.seq).upper() for r in aln}
rows = []
for a, b in combinations(sorted(seqs), 2):
    same = tot = 0
    for x, y in zip(seqs[a], seqs[b]):
        if x != '-' and y != '-':
            tot += 1
            same += (x == y)
    rows.append([a, b, tot, same, round(100 * same / tot, 3)])

with (p / 'pairwise_identity.tsv').open('w') as f:
    w = csv.writer(f, delimiter='\t')
    w.writerow(['seq_a', 'seq_b', 'compared_columns', 'identical_columns', 'identity_percent'])
    w.writerows(rows)

v = sorted(r[4] for r in rows)
n = len(v)
med = v[n // 2] if n % 2 else (v[n // 2 - 1] + v[n // 2]) / 2
q = sorted(r[4] for r in rows if 'ZmFIE1' in (r[0], r[1]))
with (p / 'pairwise_identity_summary.tsv').open('w') as f:
    w = csv.writer(f, delimiter='\t')
    w.writerow(['scope', 'pairs', 'median_percent', 'mean_percent', 'min_percent', 'max_percent'])
    w.writerow(['all_pairs', n, round(med, 3), round(sum(v) / n, 3), v[0], v[-1]])
    w.writerow(['ZmFIE1_vs_rest', len(q), round(q[len(q) // 2], 3),
                round(sum(q) / len(q), 3), q[0], q[-1]])
print('OK')

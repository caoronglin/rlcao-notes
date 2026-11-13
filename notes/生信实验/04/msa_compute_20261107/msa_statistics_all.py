"""全量蛋白比对的统计与跨算法一致性（口径与 statistics.py 相同）。"""
from pathlib import Path
from Bio import AlignIO, SeqIO
from itertools import combinations
import csv

p = Path(__file__).resolve().parent
originals = {r.id: str(r.seq).upper() for r in SeqIO.parse(p / 'fie_protein_all.fasta', 'fasta')}
rows = []
pairs = {}
for method, fn, fmt in [('clustalo_default', 'clustalo_proteinall_default.aln', 'clustal'),
                        ('clustalo_iter3', 'clustalo_proteinall_iter3.aln', 'clustal'),
                        ('muscle', 'muscle_proteinall.fasta', 'fasta'),
                        ('clustalo_pfam', 'clustalo_proteinall_pfam.aln', 'clustal')]:
    aln = AlignIO.read(p / fn, fmt)
    seqs = {r.id: str(r.seq).upper() for r in aln}
    assert set(seqs) == set(originals)
    assert all(s.replace('-', '') == originals[k] for k, s in seqs.items()), method
    cols = list(zip(*seqs.values()))
    allsame = sum(len(set(c)) == 1 and c[0] != '-' for c in cols)
    nogap = sum('-' not in c for c in cols)
    gapchars = sum(s.count('-') for s in seqs.values())
    ids = sorted(seqs)
    pairs[method] = {}
    for x, y in combinations(ids, 2):
        ix = iy = 0
        pp = set()
        for a, b in zip(seqs[x], seqs[y]):
            if a != '-': ix += 1
            if b != '-': iy += 1
            if a != '-' and b != '-': pp.add((ix, iy))
        pairs[method][(x, y)] = pp
    rows.append([method, len(seqs), len(cols), allsame, nogap, gapchars,
                 len(cols) * len(seqs), round(100 * gapchars / (len(cols) * len(seqs)), 3)])

with (p / 'alignment_all_protein_statistics.tsv').open('w') as f:
    w = csv.writer(f, delimiter='\t')
    w.writerow(['method', 'n', 'columns', 'identical_all_sequences', 'gap_free_columns',
                'gap_characters', 'matrix_cells', 'gap_percent'])
    w.writerows(rows)

with (p / 'alignment_all_protein_agreement.tsv').open('w') as f:
    w = csv.writer(f, delimiter='\t')
    w.writerow(['method_a', 'method_b', 'pairs_a', 'pairs_b', 'shared', 'f1'])
    for a, b in combinations(pairs, 2):
        x, y = pairs[a], pairs[b]
        n = sum(map(len, x.values())); m = sum(map(len, y.values()))
        shared = sum(len(x[k] & y[k]) for k in x)
        w.writerow([a, b, n, m, shared, round(2 * shared / (n + m), 6)])
print('OK')

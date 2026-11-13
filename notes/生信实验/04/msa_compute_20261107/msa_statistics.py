from pathlib import Path
from Bio import AlignIO,SeqIO
from itertools import combinations
import csv
p=Path(__file__).resolve().parent
rows=[]; pairs={}
for typ in ('mrna','protein'):
 originals={r.id:str(r.seq).upper() for r in SeqIO.parse(p/f'fie_{typ}.fasta','fasta')}
 for method,filename,fmt in [('clustalo_default',f'clustalo_{typ}_default.aln','clustal'),('clustalo_iter3',f'clustalo_{typ}_iter3.aln','clustal'),('muscle',f'muscle_{typ}.fasta','fasta')]:
  aln=AlignIO.read(p/filename,fmt); seqs={r.id:str(r.seq).upper() for r in aln}; assert set(seqs)==set(originals)
  assert all(s.replace('-','')==originals[k] for k,s in seqs.items())
  cols=list(zip(*seqs.values())); allsame=sum(len(set(c))==1 and c[0]!='-' for c in cols); nogap=sum('-' not in c for c in cols); gapchars=sum(s.count('-') for s in seqs.values())
  identifiers=sorted(seqs); pairs[(typ,method)]={};
  for x,y in combinations(identifiers,2):
   ix=iy=0; pp=set()
   for a,b in zip(seqs[x],seqs[y]):
    if a!='-': ix+=1
    if b!='-': iy+=1
    if a!='-' and b!='-': pp.add((ix,iy))
   pairs[(typ,method)][(x,y)]=pp
  rows.append([typ,method,len(seqs),len(cols),allsame,nogap,gapchars,len(cols)*len(seqs),round(100*gapchars/(len(cols)*len(seqs)),3)])
with (p/'alignment_statistics.tsv').open('w') as f:
 w=csv.writer(f,delimiter='\t');w.writerow(['molecule','method','n','columns','identical_all_sequences','gap_free_columns','gap_characters','matrix_cells','gap_percent']);w.writerows(rows)
with (p/'alignment_pair_agreement.tsv').open('w') as f:
 w=csv.writer(f,delimiter='\t');w.writerow(['molecule','method_a','method_b','aligned_residue_pairs_a','aligned_residue_pairs_b','shared_pairs','shared_fraction_a','shared_fraction_b','symmetric_f1'])
 for typ in ('mrna','protein'):
  for a,b in combinations(('clustalo_default','clustalo_iter3','muscle'),2):
   x=pairs[typ,a];y=pairs[typ,b]; n=sum(map(len,x.values()));m=sum(map(len,y.values())); shared=sum(len(x[k]&y[k]) for k in x)
   w.writerow([typ,a,b,n,m,shared,round(shared/n,6),round(shared/m,6),round(2*shared/(n+m),6)])

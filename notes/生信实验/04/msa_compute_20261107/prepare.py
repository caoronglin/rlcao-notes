from pathlib import Path
from Bio import SeqIO
from Bio.Seq import Seq
import csv
root=Path(__file__).resolve().parent
src=root.parent.parent/'02'/'sequences'
nts=list(SeqIO.parse(src/'FIE_family_mRNA.fasta','fasta'))
aas=list(SeqIO.parse(src/'FIE_family_protein.fasta','fasta'))
assert len(nts)==len(aas)==11
names=['ZmFIE1','OsFIE1','SbFIE1','TaFIE1','HvFIE1','ZmFIE2','OsFIE2','SbFIE2','TaFIE2','BdFIE2','AtFIE']
assert all(n.id.split('|')[0]==a.id.split('|')[0]==name for n,a,name in zip(nts[:10],aas[:10],names[:10]))
assert nts[-1].id=='NM_112965.1' and aas[-1].id=='NP_188710.1'
rows=[]
for name,n,a in zip(names,nts,aas):
 seq=str(n.seq).upper(); protein=str(a.seq).upper().rstrip('*'); matches=[]
 for frame in range(3):
  aa=str(Seq(seq[frame:len(seq)-(len(seq)-frame)%3]).translate())
  pos=aa.find(protein)
  if pos>=0: matches.append((frame+3*pos+1,frame+3*(pos+len(protein)),aa[pos+len(protein):pos+len(protein)+1]))
 rows.append([name,n.id.split('|')[-1],a.id.split('|')[-1],len(seq),len(protein),str(matches)])
 assert matches, (name,'no exact protein translation')
 n.id=a.id=name; n.description=a.description=''
SeqIO.write(nts,root/'fie_mrna.fasta','fasta'); SeqIO.write(aas,root/'fie_protein.fasta','fasta')
with (root/'pairing_translation.tsv').open('w') as f:
 w=csv.writer(f,delimiter='\t');w.writerow(['name','mrna_accession','protein_accession','mrna_nt','protein_aa','exact_translation_start_end_next_aa_1based']);w.writerows(rows)

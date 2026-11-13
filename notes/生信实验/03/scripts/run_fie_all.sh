#!/usr/bin/env bash
# Run the BLAST suite for ZmFIE1 (experiment 3).
set -u
cd "/media/rlcao/Data/data/05-个人项目/rlcao/notes/生信实验/03" || exit 1
R="scripts/run_blast.sh"
export LD_LIBRARY_PATH="$PWD/tools/deb/usr/lib/ncbi-blast+:$PWD/tools/deb/usr/lib/x86_64-linux-gnu"
NT=db/nucleotide/plant_combined
PROT=db/protein/plant_combined
QF=queries/fie/ZmFIE1_mRNA.fa
PF=queries/fie/ZmFIE1_protein.fa
SF=queries/fie/ZmFIE1_27aa.fa
FAM=db/fie_family/fie_mRNA

printf '>NP_001105181.1 residues 143-169 (27 aa, first WD40 repeat)\nDKDESFYTLSWTIDQVDSSPLLVAAGS\n' > "$SF"

echo "### task 1: BLASTN"
bash $R fie_t1a_blastn_default blastn "$QF" "$NT" -task blastn -max_target_seqs 1000000
bash $R fie_t1b_megablast blastn "$QF" "$NT" -task megablast -max_target_seqs 1000000
bash $R fie_t1c_dcmegablast blastn "$QF" "$NT" -task dc-megablast -max_target_seqs 1000000
bash $R fie_t1d_blastn_w7 blastn "$QF" "$NT" -task blastn -word_size 7 -max_target_seqs 1000000
bash $R fie_t1e_blastn_w11 blastn "$QF" "$NT" -task blastn -word_size 11 -max_target_seqs 1000000
bash $R fie_t1f_blastn_w15 blastn "$QF" "$NT" -task blastn -word_size 15 -max_target_seqs 1000000
bash $R fie_t1g_blastn_e1e50 blastn "$QF" "$NT" -task blastn -evalue 1e-50 -max_target_seqs 1000000
bash $R fie_t1h_blastn_e1e5 blastn "$QF" "$NT" -task blastn -evalue 1e-5 -max_target_seqs 1000000
bash $R fie_t1i_blastn_e1000 blastn "$QF" "$NT" -task blastn -evalue 1000 -max_target_seqs 1000000

echo "### task 2: BLASTP"
bash $R fie_t2a_blastp_default blastp "$PF" "$PROT" -task blastp -max_target_seqs 20000
bash $R fie_t2b_blastp_w2 blastp "$PF" "$PROT" -task blastp -word_size 2 -max_target_seqs 20000
bash $R fie_t2c_blastp_w6 blastp "$PF" "$PROT" -task blastp -word_size 6 -max_target_seqs 20000
bash $R fie_t2d_blastp_blosum45 blastp "$PF" "$PROT" -task blastp -matrix BLOSUM45 -max_target_seqs 20000
bash $R fie_t2e_blastp_blosum90 blastp "$PF" "$PROT" -task blastp -matrix BLOSUM90 -max_target_seqs 20000
bash $R fie_t2f_blastp_e1e3 blastp "$PF" "$PROT" -task blastp -evalue 1e-3 -max_target_seqs 20000
bash $R fie_t2g_blastp_e1000 blastp "$PF" "$PROT" -task blastp -evalue 1000 -max_target_seqs 20000
bash $R fie_t2h_short_default blastp "$SF" "$PROT" -task blastp-short -max_target_seqs 20000
bash $R fie_t2i_short_w2 blastp "$SF" "$PROT" -task blastp-short -word_size 2 -max_target_seqs 20000
bash $R fie_t2j_short_w3 blastp "$SF" "$PROT" -task blastp-short -word_size 3 -max_target_seqs 20000

echo "### task 3: PSI-BLAST"
for k in $(seq 1 12); do
  out="results/fie_psi_round${k}.tsv"
  log="results/fie_psi_round${k}.log"
  if [ -s "$out" ]; then echo "ROUND${k} skip"; continue; fi
  t0=$(date +%s.%N)
  "$PWD/tools/deb/usr/bin/psiblast" -query "$PF" -db "$PROT" \
    -outfmt '6 qseqid sseqid pident length mismatch gapopen qstart qend sstart send evalue bitscore sscinames stitle' \
    -out "$out" -num_iterations "$k" -max_target_seqs 50000 \
    -out_pssm "results/fie_psi_p${k}.pssm" > "$log" 2>&1
  rc=$?
  t1=$(date +%s.%N)
  awk -v a="$t0" -v b="$t1" 'BEGIN{printf "%.2f", b-a}' > "results/fie_psi_round${k}.time"
  if [ $rc -ne 0 ]; then echo "ROUND${k} FAILED"; tail -3 "$log"; exit 1; fi
  echo "ROUND${k} $(cat results/fie_psi_round${k}.time)s $(cut -f2 "$out" | sort -u | wc -l) subjects"
done

echo "### task 3.2: DELTA-BLAST"
bash $R fie_t3_deltablast deltablast "$PF" "$PROT" -rpsdb db/cdd/cdd_delta -max_target_seqs 50000

echo "### task 4: translated searches"
"$PWD/tools/deb/usr/bin/makeblastdb" -in db/fie_family/fie_mRNA.fa -dbtype nucl -out "$FAM" > /dev/null 2>&1
bash $R fie_t4a_blastx blastx "$QF" "$PROT" -max_target_seqs 20000
bash $R fie_t4b_tblastx tblastx "$QF" "$FAM" -max_target_seqs 20000
bash $R fie_t4c_blastn blastn "$QF" "$FAM" -max_target_seqs 20000

echo "FIE_ALL_DONE"

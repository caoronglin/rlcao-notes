#!/usr/bin/env bash
# 实验任务一：BLASTN —— 三种算法默认值对比 + word size + E-value
set -u
cd "/media/rlcao/Data/data/05-个人项目/rlcao/notes/生信实验/03" || exit 1
R="scripts/run_blast.sh"
NTDB=db/nucleotide/combined
Q=queries/human_EGF_mRNA.fa

echo "### 三种算法（默认参数）"
bash $R t1a_blastn_default      blastn "$Q" "$NTDB" -task blastn -max_target_seqs 1000000
bash $R t1b_megablast           blastn "$Q" "$NTDB" -task megablast -max_target_seqs 1000000
bash $R t1c_dcmegablast         blastn "$Q" "$NTDB" -task dc-megablast -max_target_seqs 1000000

echo "### word size（blastn，默认 E 值）"
bash $R t1d_blastn_w7           blastn "$Q" "$NTDB" -task blastn -word_size 7 -max_target_seqs 1000000
bash $R t1e_blastn_w11          blastn "$Q" "$NTDB" -task blastn -word_size 11 -max_target_seqs 1000000
bash $R t1f_blastn_w15          blastn "$Q" "$NTDB" -task blastn -word_size 15 -max_target_seqs 1000000

echo "### E-value（blastn，word size 11）"
bash $R t1g_blastn_e1e50        blastn "$Q" "$NTDB" -task blastn -word_size 11 -evalue 1e-50 -max_target_seqs 1000000
bash $R t1h_blastn_e1e5         blastn "$Q" "$NTDB" -task blastn -word_size 11 -evalue 1e-5 -max_target_seqs 1000000
bash $R t1i_blastn_e1000        blastn "$Q" "$NTDB" -task blastn -word_size 11 -evalue 1000 -max_target_seqs 1000000

echo "TASK1_DONE"

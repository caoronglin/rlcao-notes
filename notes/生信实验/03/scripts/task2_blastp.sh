#!/usr/bin/env bash
# 实验任务二：BLASTP —— 全长蛋白、<30 aa 短片段、word size、矩阵、E 值
set -u
cd "/media/rlcao/Data/data/05-个人项目/rlcao/notes/生信实验/03" || exit 1
R="scripts/run_blast.sh"
PROT=db/protein/combined
QF=queries/human_EGF_protein.fa
QS=queries/short_egf_27aa.fa

echo "### 全长蛋白（默认参数）"
bash $R t2a_blastp_default      blastp "$QF" "$PROT" -task blastp -max_target_seqs 20000

echo "### word size"
bash $R t2b_blastp_w2           blastp "$QF" "$PROT" -task blastp -word_size 2 -max_target_seqs 20000
bash $R t2c_blastp_w6           blastp "$QF" "$PROT" -task blastp -word_size 6 -max_target_seqs 20000

echo "### 替换矩阵"
bash $R t2d_blastp_blosum45     blastp "$QF" "$PROT" -task blastp -matrix BLOSUM45 -max_target_seqs 20000
bash $R t2e_blastp_blosum90     blastp "$QF" "$PROT" -task blastp -matrix BLOSUM90 -max_target_seqs 20000

echo "### E 值"
bash $R t2f_blastp_e1e3         blastp "$QF" "$PROT" -task blastp -evalue 1e-3 -max_target_seqs 20000
bash $R t2g_blastp_e1000        blastp "$QF" "$PROT" -task blastp -evalue 1000 -max_target_seqs 20000

echo "### 短片段（27 aa）"
bash $R t2h_blastp_short_def    blastp "$QS" "$PROT" -task blastp -max_target_seqs 20000
bash $R t2i_blastp_short_w2     blastp "$QS" "$PROT" -task blastp -word_size 2 -max_target_seqs 20000
bash $R t2j_blastp_short_w3     blastp "$QS" "$PROT" -task blastp -word_size 3 -max_target_seqs 20000

echo "TASK2_DONE"

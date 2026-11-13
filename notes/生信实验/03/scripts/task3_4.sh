#!/usr/bin/env bash
# 实验任务三、四：PSI-BLAST 与 Translated BLAST（BLASTX / TBLASTX / BLASTN 对照）
set -u
cd "/media/rlcao/Data/data/05-个人项目/rlcao/notes/生信实验/03" || exit 1
R="scripts/run_blast.sh"
PROT=db/protein/combined
NT=db/nucleotide/combined
NTsmall=db/nucleotide/egf_family_mRNA
QF=queries/human_EGF_protein.fa
QM=queries/human_EGF_mRNA.fa

echo "### PSI-BLAST（多轮）"
# PSI-BLAST 逐轮由 task3_psiblast.sh 完成（BLAST+ 2.16 的 psiblast 不接受
# -save_psiblast_after_each_round，改用「每次从第 1 轮重跑到第 N 轮」取第 N 轮结果）。
bash scripts/task3_psiblast.sh 12

echo "### Translated BLAST"
bash $R t4a_blastx               blastx "$QM" "$PROT" -max_target_seqs 1000000
bash $R t4b_tblastx_small        tblastx "$QM" "$NTsmall" -max_target_seqs 1000000
bash $R t4c_blastn_small         blastn "$QM" "$NTsmall" -max_target_seqs 1000000
bash $R t4d_tblastx_human        tblastx "$QM" db/nucleotide/homo_sapiens.cdna.fa -max_target_seqs 1000000

echo "TASK34_DONE"

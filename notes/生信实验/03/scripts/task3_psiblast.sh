#!/usr/bin/env bash
# 实验任务三（3.1）PSI-BLAST：逐轮迭代，记录每轮的命中序列与新增序列
#
# 说明（踩坑记录）：
#   BLAST+ 2.16.0 的 psiblast 不接受 -save_psiblast_after_each_round（报 Unknown argument）；
#   且 -num_iterations 1 时不会写出 -out_pssm 检查点（文件为空，-in_pssm 续跑报 "not accessible"）。
#   因此改用「每次从第 1 轮重跑到第 N 轮，取最后一轮的结果」的方式复算逐轮结果：
#   -num_iterations N 输出的即是第 N 轮的命中，同时 -out_pssm 给出第 N 轮之后的 PSSM。
set -u
cd "/media/rlcao/Data/data/05-个人项目/rlcao/notes/生信实验/03" || exit 1
BIN="$PWD/tools/deb/usr/bin"
export LD_LIBRARY_PATH="$PWD/tools/deb/usr/lib/ncbi-blast+:$PWD/tools/deb/usr/lib/x86_64-linux-gnu"

Q=queries/human_EGF_protein.fa
DB=db/protein/combined
FMT='6 qseqid sseqid pident length mismatch gapopen qstart qend sstart send evalue bitscore sscinames stitle'
MAXR="${1:-8}"

for k in $(seq 1 "$MAXR"); do
  out="results/psi_round${k}.tsv"
  log="results/psi_round${k}.log"
  if [ -s "$out" ]; then
    echo "ROUND${k}  已有结果，跳过"
    continue
  fi
  t0=$(date +%s.%N)
  "$BIN/psiblast" -query "$Q" -db "$DB" -outfmt "$FMT" -out "$out" \
      -num_iterations "$k" -max_target_seqs 50000 \
      -out_pssm "results/psi_p${k}.pssm" > "$log" 2>&1
  rc=$?
  t1=$(date +%s.%N)
  awk -v a="$t0" -v b="$t1" 'BEGIN{printf "%.2f", b-a}' > "results/psi_round${k}.time"
  if [ $rc -ne 0 ]; then
    echo "ROUND${k}_FAILED rc=$rc" >&2
    tail -3 "$log" >&2
    exit 1
  fi
  nseq=$(cut -f2 "$out" | sort -u | wc -l)
  n005=$(awk -F'\t' '$11 < 0.005' "$out" | cut -f2 | sort -u | wc -l)
  echo "ROUND${k}  用时 $(cat results/psi_round${k}.time)s  去重序列=${nseq}  E<0.005=${n005}"
done

echo "PSIBLAST_DONE"

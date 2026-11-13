#!/usr/bin/env bash
# 实验任务三（3.2）DELTA-BLAST：比 blastp / psiblast 更敏感，用于远缘同源
set -u
cd "/media/rlcao/Data/data/05-个人项目/rlcao/notes/生信实验/03" || exit 1
BIN="$PWD/tools/deb/usr/bin"
export LD_LIBRARY_PATH="$PWD/tools/deb/usr/lib/ncbi-blast+:$PWD/tools/deb/usr/lib/x86_64-linux-gnu"

Q=queries/human_EGF_protein.fa
DB="${1:-db/protein/combined}"
OUT="${2:-results/t3b_deltablast.tsv}"
shift 2 2>/dev/null || true
FMT='6 qseqid sseqid pident length mismatch gapopen qstart qend sstart send evalue bitscore sscinames stitle'

t0=$(date +%s.%N)
"$BIN/deltablast" -query "$Q" -db "$DB" -outfmt "$FMT" -out "$OUT" \
    -max_target_seqs 1000000 "$@" > "${OUT%.tsv}.log" 2>&1
RC=$?
t1=$(date +%s.%N)
awk -v a="$t0" -v b="$t1" 'BEGIN{printf "%.2f", b-a}' > "${OUT%.tsv}.time"
if [ $RC -ne 0 ]; then
  echo "DELTABLAST_FAILED rc=$RC" >&2
  tail -5 "${OUT%.tsv}.log" >&2
  exit $RC
fi
echo "DELTABLAST_OK  用时 $(cat "${OUT%.tsv}.time")s  HSP=$(wc -l < "$OUT")  去重序列=$(cut -f2 "$OUT" | sort -u | wc -l)"

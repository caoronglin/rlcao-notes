#!/usr/bin/env bash
# 统一运行器：跑一次 BLAST，保存 tabular 结果、参数日志与耗时
# 用法: run_blast.sh <name> <program> <query> <db1,db2,...> [额外参数...]
set -u
cd "/media/rlcao/Data/data/05-个人项目/rlcao/notes/生信实验/03" || exit 1
BIN="$PWD/tools/deb/usr/bin"
export LD_LIBRARY_PATH="$PWD/tools/deb/usr/lib/ncbi-blast+:$PWD/tools/deb/usr/lib/x86_64-linux-gnu"

NAME="$1"; PROG="$2"; QUERY="$3"; DBS="$4"; shift 4
mkdir -p results
OUT="results/${NAME}.tsv"
LOG="results/${NAME}.log"
FMT='6 qseqid sseqid pident length mismatch gapopen qstart qend sstart send evalue bitscore sscinames stitle'

START=$(date +%s.%N)
"$BIN/$PROG" -query "$QUERY" -db "$DBS" -outfmt "$FMT" -out "$OUT" "$@" > "$LOG" 2>&1
RC=$?
END=$(date +%s.%N)
ELAPSED=$(awk -v a="$START" -v b="$END" 'BEGIN{printf "%.2f", b-a}')
echo "$ELAPSED" > "results/${NAME}.time"
if [ $RC -ne 0 ]; then
  echo "FAILED rc=$RC  $NAME  (见 $LOG)" >&2
  tail -5 "$LOG" >&2
  exit $RC
fi
NHSP=$(wc -l < "$OUT")
NSEQ=$(cut -f2 "$OUT" | sort -u | wc -l)
echo "OK  $NAME  用时 ${ELAPSED}s  HSP=${NHSP}  去重序列=${NSEQ}"

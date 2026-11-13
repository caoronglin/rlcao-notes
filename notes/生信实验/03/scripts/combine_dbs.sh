#!/usr/bin/env bash
# 合并建库：核苷酸（11 物种 Ensembl cDNA + EGF 家族 RefSeq mRNA）与蛋白（Swiss-Prot + RefSeq 家族蛋白）
set -u
cd "/media/rlcao/Data/data/05-个人项目/rlcao/notes/生信实验/03" || exit 1
export LD_LIBRARY_PATH="$PWD/tools/deb/usr/lib/ncbi-blast+:$PWD/tools/deb/usr/lib/x86_64-linux-gnu"
BIN="$PWD/tools/deb/usr/bin"
log() { echo "[$(date +%H:%M:%S)] $*"; }

NFA=db/nucleotide/combined.fa
: > "$NFA"
for gz in downloads/ensembl/*.cdna.fa.gz; do
  sp=$(basename "$gz" .cdna.fa.gz)
  log "合并 $sp"
  gunzip -c "$gz" | sed "s/^>/>${sp}|/" >> "$NFA"
done
cat db/egf_family/mRNA_blast.fa >> "$NFA"
log "makeblastdb 核苷酸库"
"$BIN/makeblastdb" -in "$NFA" -dbtype nucl -parse_seqids -out db/nucleotide/combined 2>&1 | tail -2
rm -f "$NFA"

PFA=db/protein/combined.fa
: > "$PFA"
gunzip -c db/protein/uniprot_sprot.fasta.gz >> "$PFA"
cat db/egf_family/protein_blast.fa >> "$PFA"
log "makeblastdb 蛋白库"
"$BIN/makeblastdb" -in "$PFA" -dbtype prot -parse_seqids -out db/protein/combined 2>&1 | tail -2
rm -f "$PFA"

log "核苷酸库：$("$BIN/blastdbcmd" -db db/nucleotide/combined -info 2>/dev/null | grep -o -E '[0-9,]+ sequences' | head -1)"
log "蛋白库：$("$BIN/blastdbcmd" -db db/protein/combined -info 2>/dev/null | grep -o -E '[0-9,]+ sequences' | head -1)"
echo "COMBINE_DONE"

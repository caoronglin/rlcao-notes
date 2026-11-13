#!/usr/bin/env bash
# Build plant nucleotide and protein BLAST databases for the FIE1 experiments.
set -u
cd "/media/rlcao/Data/data/05-个人项目/rlcao/notes/生信实验/03" || exit 1
export LD_LIBRARY_PATH="$PWD/tools/deb/usr/lib/ncbi-blast+:$PWD/tools/deb/usr/lib/x86_64-linux-gnu"
BIN="$PWD/tools/deb/usr/bin"
mkdir -p db/nucleotide db/protein

NFA="db/nucleotide/plant_combined.fa"
: > "$NFA"
for gz in downloads/ensembl_plants/*.cdna.all.fa.gz; do
  sp=$(basename "$gz" | cut -d. -f1 | tr '[:upper:]' '[:lower:]')
  echo "add $sp"
  gunzip -c "$gz" | sed "s/^>/>${sp}|/" >> "$NFA"
done
cat db/fie_family/fie_mRNA.fa >> "$NFA"
"$BIN/makeblastdb" -in "$NFA" -dbtype nucl -parse_seqids -out db/nucleotide/plant_combined > /dev/null
rm -f "$NFA"

PFA="db/protein/plant_combined.fa"
gunzip -c db/protein/uniprot_sprot.fasta.gz > "$PFA"
cat db/fie_family/fie_protein.fa >> "$PFA"
"$BIN/makeblastdb" -in "$PFA" -dbtype prot -parse_seqids -out db/protein/plant_combined > /dev/null
rm -f "$PFA"

"$BIN/blastdbcmd" -db db/nucleotide/plant_combined -info | grep sequences
"$BIN/blastdbcmd" -db db/protein/plant_combined -info | grep sequences

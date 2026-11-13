#!/usr/bin/env bash
# 下载实验三数据库快照：Ensembl cdna（选定物种）+ UniProt Swiss-Prot，并建立 BLAST 索引
set -u
cd "/media/rlcao/Data/data/05-个人项目/rlcao/notes/生信实验/03" || exit 1
mkdir -p downloads db/nucleotide db/protein
log() { echo "[$(date +%H:%M:%S)] $*"; }
BIN="$PWD/tools/deb/usr/bin"
export LD_LIBRARY_PATH="$PWD/tools/deb/usr/lib/ncbi-blast+:$PWD/tools/deb/usr/lib/x86_64-linux-gnu"

BASE="https://ftp.ensembl.org/pub/release-115/fasta"
SPECIES="homo_sapiens mus_musculus rattus_norvegicus canis_lupus_familiaris gallus_gallus bos_taurus monodelphis_domestica macaca_fascicularis pan_troglodytes danio_rerio xenopus_tropicalis salmo_salmo"
for sp in $SPECIES; do
  out="db/nucleotide/${sp}.cdna.fa.gz"
  [ -s "$out" ] && continue
  file=$(curl -s -m 60 "$BASE/$sp/cdna/" | grep -o -E 'href="[^"]+cdna\.all\.fa\.gz"' | head -1 | sed 's/href="//; s/"//')
  if [ -z "$file" ]; then log "SKIP $sp"; continue; fi
  log "下载 $sp"
  curl -sSL --retry 5 --retry-all-errors --connect-timeout 20 --speed-time 60 --speed-limit 1000 \
       -o "$out" "$BASE/$sp/cdna/$file" || { rm -f "$out"; log "FAIL $sp"; }
done

if [ ! -s db/protein/uniprot_sprot.fasta.gz ]; then
  log "下载 Swiss-Prot"
  curl -sSL --retry 5 --retry-all-errors --connect-timeout 20 --speed-time 60 --speed-limit 1000 \
    -o db/protein/uniprot_sprot.fasta.gz \
    "https://ftp.ebi.ac.uk/pub/databases/uniprot/current_release/knowledgebase/complete/uniprot_sprot.fasta.gz" \
    || { echo "FAIL sprot"; }
fi

log "建立索引"
for f in db/nucleotide/*.cdna.fa.gz; do
  [ -s "$f" ] || continue
  gunzip -kf "$f" 2>/dev/null
  base="${f%.gz}"
  if "$BIN/makeblastdb" -in "$base" -dbtype nucl -parse_seqids -out "db/nucleotide/$(basename "$base")" >/dev/null 2>&1; then
    rm -f "$base"
  else
    log "FAIL db $base"
  fi
done
if [ -s db/protein/uniprot_sprot.fasta.gz ]; then
  gunzip -kf db/protein/uniprot_sprot.fasta.gz
  "$BIN/makeblastdb" -in db/protein/uniprot_sprot.fasta -dbtype prot -parse_seqids -out db/protein/sprot >/dev/null 2>&1 \
    && rm -f db/protein/uniprot_sprot.fasta || log "FAIL sprot db"
fi

log "核苷酸库物种数：$(ls db/nucleotide/*.nin 2>/dev/null | wc -l)；蛋白库索引：$(ls db/protein/sprot.p* 2>/dev/null | wc -l)"
du -sh db/nucleotide db/protein
echo "ALL_DOWNLOADS_OK"

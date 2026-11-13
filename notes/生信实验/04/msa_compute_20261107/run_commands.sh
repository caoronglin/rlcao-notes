#!/usr/bin/env bash
set -euo pipefail
D="$(cd "$(dirname "$0")" && pwd)"
TOOLS="${TOOLS:-$D/../tools}"   # 含 usr/bin 的隔离软件目录；可用环境变量覆盖
export LD_LIBRARY_PATH="$TOOLS/usr/lib/x86_64-linux-gnu${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
CLUSTALO="$TOOLS/usr/bin/clustalo"
MUSCLE="$TOOLS/usr/bin/muscle"
HMM="$D/../hmm/PF00400.hmm"

uv run --with biopython python "$D/prepare.py"
uv run --with biopython python "$D/prepare_all.py"

# 11 对成对子集：mRNA 与蛋白
for t in mrna protein; do
  for mode in default iter3; do
    args=()
    if [ "$mode" = iter3 ]; then args=(--iter=3); fi
    "$CLUSTALO" -i "$D/fie_${t}.fasta" -o "$D/clustalo_${t}_${mode}.aln" \
      --outfmt=clu --threads=1 -v --force "${args[@]}" > "$D/clustalo_${t}_${mode}.log" 2>&1
  done
  "$MUSCLE" -align "$D/fie_${t}.fasta" -output "$D/muscle_${t}.fasta" \
    -threads 1 > "$D/muscle_${t}.log" 2>&1
done
"$CLUSTALO" -i "$D/fie_protein.fasta" --hmm-in="$HMM" \
  -o "$D/clustalo_protein_pfam.aln" --outfmt=clu --threads=1 -v --force \
  > "$D/clustalo_protein_pfam.log" 2>&1

# 全量蛋白：实验二 11 条 + 实验三候选，按登录号去重共 36 条
for mode in default iter3; do
  args=()
  if [ "$mode" = iter3 ]; then args=(--iter=3); fi
  "$CLUSTALO" -i "$D/fie_protein_all.fasta" -o "$D/clustalo_proteinall_${mode}.aln" \
    --outfmt=clu --threads=1 -v --force "${args[@]}" > "$D/clustalo_proteinall_${mode}.log" 2>&1
done
"$MUSCLE" -align "$D/fie_protein_all.fasta" -output "$D/muscle_proteinall.fasta" \
  -threads 1 > "$D/muscle_proteinall.log" 2>&1
"$CLUSTALO" -i "$D/fie_protein_all.fasta" --hmm-in="$HMM" \
  -o "$D/clustalo_proteinall_pfam.aln" --outfmt=clu --threads=1 -v --force \
  > "$D/clustalo_proteinall_pfam.log" 2>&1

uv run --with biopython python "$D/msa_statistics.py"
uv run --with biopython python "$D/msa_statistics_all.py"

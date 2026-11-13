#!/usr/bin/env bash
# Download Ensembl Plants cDNA for the 11 species used in experiment 3.
set -u
cd "/media/rlcao/Data/data/05-个人项目/rlcao/notes/生信实验/03" || exit 1
BASE="https://ftp.ensemblgenomes.ebi.ac.uk/pub/plants/release-62/fasta"
mkdir -p downloads/ensembl_plants
declare -A FILES=(
  [zea_mays]="Zea_mays.Zm-B73-REFERENCE-NAM-5.0.cdna.all.fa.gz"
  [oryza_sativa]="Oryza_sativa.IRGSP-1.0.cdna.all.fa.gz"
  [arabidopsis_thaliana]="Arabidopsis_thaliana.TAIR10.cdna.all.fa.gz"
  [sorghum_bicolor]="Sorghum_bicolor.Sorghum_bicolor_NCBIv3.cdna.all.fa.gz"
  [triticum_aestivum]="Triticum_aestivum.IWGSC.cdna.all.fa.gz"
  [hordeum_vulgare]="Hordeum_vulgare.MorexV3_pseudomolecules_assembly.cdna.all.fa.gz"
  [solanum_lycopersicum]="Solanum_lycopersicum.SL3.0.cdna.all.fa.gz"
  [glycine_max]="Glycine_max.Glycine_max_v2.1.cdna.all.fa.gz"
  [brachypodium_distachyon]="Brachypodium_distachyon.Brachypodium_distachyon_v3.0.cdna.all.fa.gz"
  [vitis_vinifera]="Vitis_vinifera.ASM3070453v1.cdna.all.fa.gz"
  [populus_trichocarpa]="Populus_trichocarpa.Pop_tri_v4.cdna.all.fa.gz"
)
for sp in "${!FILES[@]}"; do
  f="${FILES[$sp]}"
  if [ -s "downloads/ensembl_plants/$f" ]; then
    echo "skip $f"
  else
    echo "get $f"
    curl -fL --retry 4 --retry-delay 5 -o "downloads/ensembl_plants/$f" "$BASE/$sp/cdna/$f" || exit 1
  fi
done

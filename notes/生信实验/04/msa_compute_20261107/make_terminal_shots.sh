#!/usr/bin/env bash
# 生成两份报告所用的命令行运行截图。
# 在隔离的 Xvfb 显示上启动 xterm，真正执行比对、BLAST、统计脚本与结果表查询命令，
# 再截取窗口；不是把日志文字排成图片。输出 PNG 落在 03/ 与 04/ 课次目录。
# 为适应 5 页版式，公共参数用 shell 变量复用，每条会话只保留命令与关键输出行；
# shot 的第三个参数控制 xterm 行数，用于放进正文页末空隙的矮图。
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"   # notes/生信实验
export ROOT
TMP="$(mktemp -d)"
XPID=""
cleanup() {
  [ -n "$XPID" ] && kill "$XPID" 2>/dev/null || true
  rm -rf "$TMP"
}
trap cleanup EXIT

cd "$TMP"
apt-get download xvfb x11-apps xterm xfonts-base libutempter0 >/dev/null 2>&1
for f in *.deb; do dpkg-deb -x "$f" root; done
BIN="$TMP/root/usr/bin"
export LD_LIBRARY_PATH="$TMP/root/usr/lib/x86_64-linux-gnu${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
export DISPLAY=:99

"$BIN/Xvfb" :99 -screen 0 1000x300x24 -ac >/dev/null 2>&1 &
XPID=$!
python3 -c 'import time; time.sleep(1.5)'

shot() {
  local out="$1" sess="$2" rows="${3:-12}"
  local flag="$TMP/done_$(basename "$out" .png)"
  rm -f "$flag"
  SHOT_FLAG="$flag" "$BIN/xterm" -display :99 -geometry "82x${rows}+0+0" \
    -fa 'DejaVu Sans Mono' -fs 15 -bg '#0c1016' -fg '#e8edf2' \
    -hold -T 'bioinfo' -e bash -c 'bash "$1"; : > "$SHOT_FLAG"' _ "$sess" \
    >/dev/null 2>&1 &
  local tpid=$!
  python3 - "$flag" <<'PY'
import os, sys, time
p = sys.argv[1]
for _ in range(900):
    if os.path.exists(p):
        break
    time.sleep(0.1)
time.sleep(0.8)
PY
  python3 - "$out" <<'PY'
from PIL import Image, ImageGrab, ImageChops
import sys
im = ImageGrab.grab(xdisplay=':99').convert('RGB')
bg = im.getpixel((0, 0))
mask = ImageChops.difference(im, Image.new('RGB', im.size, bg)).point(
    lambda v: 255 if v > 18 else 0)
box = mask.getbbox()
if box:
    pad = 6
    im = im.crop((max(0, box[0] - pad), max(0, box[1] - pad),
                  min(im.width, box[2] + pad), min(im.height, box[3] + pad)))
im.save(sys.argv[1])
print(sys.argv[1], im.size)
PY
  kill "$tpid" 2>/dev/null || true
  python3 -c 'import time; time.sleep(0.3)'
}

cat > "$TMP/s1.sh" <<'EOS'
cd "$ROOT/04/msa_compute_20261107"
export PATH="$PWD/../tools/usr/bin:$PATH"
export LD_LIBRARY_PATH="$PWD/../tools/usr/lib/x86_64-linux-gnu"
printf '$ %s\n' "C='clustalo -i fie_protein_all.fasta --outfmt=clu --threads=1 -v --force'"
C='clustalo -i fie_protein_all.fasta --outfmt=clu --threads=1 -v --force'
printf '$ %s\n' '$C -o clustalo_proteinall_default.aln'
$C -o clustalo_proteinall_default.aln 2>&1 | tr '\r' '\n' | grep -E 'Read 36|Alignment written' | cut -c1-96
printf '$ %s\n' '$C -o clustalo_proteinall_iter3.aln --iter=3'
$C -o clustalo_proteinall_iter3.aln --iter=3 2>&1 | tr '\r' '\n' | grep 'Read 36' | cut -c1-96
printf '$ %s\n' '$C -o clustalo_proteinall_pfam.aln --hmm-in=../hmm/PF00400.hmm'
$C -o clustalo_proteinall_pfam.aln --hmm-in=../hmm/PF00400.hmm 2>&1 | tr '\r' '\n' | grep 'Read 36' | cut -c1-96
printf '$ %s\n' 'diff -q clustalo_proteinall_default.aln clustalo_proteinall_pfam.aln && echo SAME'
diff -q clustalo_proteinall_default.aln clustalo_proteinall_pfam.aln && echo 'SAME -> --hmm-in 未参与计算'
printf '$ %s\n' 'grep -c hmm clustalo_proteinall_pfam.log'
grep -ci hmm clustalo_proteinall_pfam.log
EOS

cat > "$TMP/s2.sh" <<'EOS'
cd "$ROOT/04/msa_compute_20261107"
export PATH="$PWD/../tools/usr/bin:$PATH"
export LD_LIBRARY_PATH="$PWD/../tools/usr/lib/x86_64-linux-gnu"
printf '$ %s\n' "M='muscle -align fie_protein_all.fasta -threads 1'"
M='muscle -align fie_protein_all.fasta -threads 1'
printf '$ %s\n' '$M -output muscle_proteinall.fasta'
$M -output muscle_proteinall.fasta 2>&1 | tr '\r' '\n' | grep -E '^muscle 5|Input:' | cut -c1-96
printf '$ %s\n' "C2='clustalo -i fie_mrna.fasta --outfmt=clu -v --force'"
C2='clustalo -i fie_mrna.fasta --outfmt=clu -v --force'
printf '$ %s\n' '$C2 -o clustalo_mrna_default.aln'
$C2 -o clustalo_mrna_default.aln 2>&1 | tr '\r' '\n' | grep -E 'Read 11 sequences \(type: DNA\)|Alignment written' | cut -c1-96
printf '$ %s\n' 'muscle -align fie_mrna.fasta -output muscle_mrna.fasta -threads 1'
muscle -align fie_mrna.fasta -output muscle_mrna.fasta -threads 1 2>&1 | tr '\r' '\n' | grep 'Input:' | cut -c1-96
EOS

cat > "$TMP/s3.sh" <<'EOS'
cd "$ROOT/03"
export PATH="$PWD/tools/deb/usr/bin:$PATH"
export LD_LIBRARY_PATH="$PWD/tools/deb/usr/lib/ncbi-blast+:$PWD/tools/deb/usr/lib/x86_64-linux-gnu"
printf '$ %s\n' 'blastn -version | head -1'
blastn -version 2>&1 | head -1
printf '$ %s\n' 'Q=queries/fie/ZmFIE1_mRNA.fa; D=db/nucleotide/plant_combined'
Q=queries/fie/ZmFIE1_mRNA.fa; D=db/nucleotide/plant_combined
printf '$ %s\n' 'B="blastn -query $Q -db $D -max_target_seqs 1000000 -outfmt 6"'
B="blastn -query $Q -db $D -max_target_seqs 1000000 -outfmt 6"
printf '$ %s\n' '$B -task blastn -out /tmp/h1'
$B -task blastn -out /tmp/h1 2>/dev/null
printf '$ %s\n' 'cut -f2 /tmp/h1 | sort -u | wc -l'
cut -f2 /tmp/h1 | sort -u | wc -l
printf '$ %s\n' '$B -task megablast -out /tmp/h2'
$B -task megablast -out /tmp/h2 2>/dev/null
printf '$ %s\n' 'cut -f2 /tmp/h2 | sort -u | wc -l'
cut -f2 /tmp/h2 | sort -u | wc -l
EOS

cat > "$TMP/s4.sh" <<'EOS'
cd "$ROOT/03"
export PATH="$PWD/tools/deb/usr/bin:$PATH"
export LD_LIBRARY_PATH="$PWD/tools/deb/usr/lib/ncbi-blast+:$PWD/tools/deb/usr/lib/x86_64-linux-gnu"
printf '$ %s\n' 'psiblast -version | head -1'
psiblast -version 2>&1 | head -1
printf '$ %s\n' 'head -3 data/fie_psi_rounds.csv | cut -d, -f1-4'
head -3 data/fie_psi_rounds.csv | cut -d, -f1-4
printf '$ %s\n' 'grep "^DELTA" data/fie_summary.csv | cut -d, -f4,5,6,8'
grep '^DELTA' data/fie_summary.csv | cut -d, -f4,5,6,8
printf '$ %s\n' 'grep -m1 "^DELTA-BLAST" data/fie_top10.csv | cut -d, -f1,6,7,9,10'
grep -m1 '^DELTA-BLAST' data/fie_top10.csv | cut -d, -f1,6,7,9,10
EOS

cat > "$TMP/s5.sh" <<'EOS'
cd "$ROOT/04/msa_compute_20261107"
export PATH="$PWD/../tools/usr/bin:$PATH"
export LD_LIBRARY_PATH="$PWD/../tools/usr/lib/x86_64-linux-gnu"
printf '$ %s\n' 'grep -c ">" fie_mrna.fasta fie_protein_all.fasta'
grep -c '>' fie_mrna.fasta fie_protein_all.fasta
printf '$ %s\n' 'uv run --quiet --with biopython python msa_statistics_all.py'
uv run --quiet --with biopython python msa_statistics_all.py
printf '$ %s\n' 'cut -f1,2,3,4,8 alignment_all_protein_statistics.tsv'
cut -f1,2,3,4,8 alignment_all_protein_statistics.tsv
EOS

cat > "$TMP/s6.sh" <<'EOS'
cd "$ROOT/04/msa_compute_20261107"
printf '$ %s\n' 'cut -f1,2,6 alignment_all_protein_agreement.tsv'
cut -f1,2,6 alignment_all_protein_agreement.tsv
EOS

cat > "$TMP/s7.sh" <<'EOS'
cd "$ROOT/03"
printf '$ %s\n' 'head -5 data/fie_summary.csv | tr -d "\r" | cut -d, -f2,4,5,10'
head -5 data/fie_summary.csv | tr -d "\r" | cut -d, -f2,4,5,10
EOS

cat > "$TMP/s8.sh" <<'EOS'
cd "$ROOT/04/msa_compute_20261107"
printf '$ %s\n' 'uv run --with pyhmmer python hmm_align.py'
uv run --quiet --with pyhmmer python hmm_align.py 2>&1 | head -9 | cut -c1-100
printf '$ %s\n' 'cut -f1-5 domain_gap_profile.tsv'
cut -f1-5 domain_gap_profile.tsv | expand -t 22
EOS

cat > "$TMP/s9.sh" <<'EOS'
cd "$ROOT/03"
export PATH="$PWD/tools/deb/usr/bin:$PATH"
export LD_LIBRARY_PATH="$PWD/tools/deb/usr/lib/ncbi-blast+:$PWD/tools/deb/usr/lib/x86_64-linux-gnu"
printf '$ %s\n' 'Q=queries/fie/ZmFIE1_mRNA.fa; F="-outfmt 6 -evalue 1e-5 -max_target_seqs 20000"'
Q=queries/fie/ZmFIE1_mRNA.fa; F='-outfmt 6 -evalue 1e-5 -max_target_seqs 20000'
printf '$ %s\n' 'blastx  -query $Q -db db/protein/plant_combined   $F -out /tmp/x1'
blastx -query $Q -db db/protein/plant_combined $F -out /tmp/x1 2>/dev/null
blastp -query queries/fie/ZmFIE1_protein.fa -db db/protein/plant_combined $F -out /tmp/x2 2>/dev/null
tblastx -query $Q -db db/nucleotide/plant_combined $F -out /tmp/x3 2>/dev/null
blastn -query $Q -db db/nucleotide/plant_combined $F -out /tmp/x4 2>/dev/null
tblastx -query $Q -db db/fie_family/fie_mRNA $F -out /tmp/x5 2>/dev/null
for f in /tmp/x1 /tmp/x2 /tmp/x3 /tmp/x4 /tmp/x5; do
  printf '%-8s %6s HSP %6s subject\n' "$(basename $f)" "$(wc -l < $f)" "$(cut -f2 $f | sort -u | wc -l)"
done
EOS

shot "$ROOT/04/shot_terminal_protein36.png" "$TMP/s1.sh"
shot "$ROOT/04/shot_terminal_muscle_mrna.png" "$TMP/s2.sh"
shot "$ROOT/03/shot_terminal_blastn.png" "$TMP/s3.sh"
shot "$ROOT/03/shot_terminal_psi_delta.png" "$TMP/s4.sh"
shot "$ROOT/04/shot_terminal_stats.png" "$TMP/s5.sh" 12
shot "$ROOT/04/shot_terminal_agreement.png" "$TMP/s6.sh" 10
shot "$ROOT/03/shot_terminal_seqcheck.png" "$TMP/s7.sh" 7
shot "$ROOT/04/shot_terminal_hmmalign.png" "$TMP/s8.sh" 13
shot "$ROOT/03/shot_terminal_t4lib.png" "$TMP/s9.sh" 11

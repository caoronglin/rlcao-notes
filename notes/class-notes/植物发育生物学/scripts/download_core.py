#!/usr/bin/env python3
"""下载核心 18 篇 PDF：多源回退 + PMC PoW + 落盘校验。

用法:
    python3 scripts/download_core.py            # 已存在且 >200KB 则跳过
    python3 scripts/download_core.py --force    # 全部重下
"""
import hashlib
import json
import os
import re
import subprocess
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REFS = os.path.join(ROOT, "refs")
UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36")

# (序号文件名 slug, 候选 URL 列表，按优先级)
SLUGS = [
    ("01_dev200787_CLV3_CLE16_CLE17", [
        "https://journals.biologists.com/dev/article-pdf/149/19/dev200787/2172474/dev200787.pdf"]),
    ("02_s41477-023-01485-y_CLAVATA_receptors", [
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC11070199/pdf/nihms-1987721.pdf",
        "https://www.nature.com/articles/s41477-023-01485-y.pdf"]),
    ("03_dev202014_local_auxin_shoot_patterning", [
        "https://journals.biologists.com/dev/article-pdf/150/23/dev202014/3267209/dev202014.pdf"]),
    ("04_s41467-024-48361-7_DA1_WUS_SAM_size", [
        "https://www.nature.com/articles/s41467-024-48361-7.pdf"]),
    ("05_koae312_KNUCKLES_floral_meristem", [
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC11663560/pdf/koae312.pdf",
        "https://academic.oup.com/plcell/article-pdf/65/12/4344/54455131/koae312.pdf"]),
    ("06_s41477-022-01111-3_leaf_dorsiventrality", [
        "https://www.nature.com/articles/s41477-022-01111-3.pdf"]),
    ("07_pnas2321877121_CUC1_auxin_module", [
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC11214078/pdf/pnas.202321877.pdf",
        "https://www.pnas.org/doi/pdf/10.1073/pnas.2321877121"]),
    ("08_s41467-024-51099-x_water_fluxes_meristem", [
        "https://www.nature.com/articles/s41467-024-51099-x.pdf",
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC11322635/pdf/41467_2024_Article_51099.pdf"]),
    ("09_s41580-023-00691-y_cell_wall_structure_growth", [
        "https://www.osti.gov/servlets/purl/2352283",
        "https://www.nature.com/articles/s41580-023-00691-y.pdf"]),
    ("10_science_ade8055_mechanics_of_plant_morphogenesis", [
        "https://www.osti.gov/servlets/purl/2212482",
        "https://scholarsphere.psu.edu/resources/e976fcf1-d507-43a0-9af5-4f74a8081fc1/downloads/31484",
        "https://www.science.org/doi/pdf/10.1126/science.ade8055"]),
    ("11_sciadv_abm4974_microtubule_mechanical_conflicts", [
        "https://www.science.org/doi/pdf/10.1126/sciadv.abm4974?download=true",
        "https://iris.unil.ch/bitstreams/b00275e5-c514-4d56-adfd-bb56eb4c4523/download"]),
    ("12_s41467-023-36739-y_ECM_growth_anisotropy", [
        "https://www.nature.com/articles/s41467-023-36739-y.pdf",
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC9984492/pdf/41467_2023_Article_36739.pdf"]),
    ("13_devcel_2024_mechanical_forces_division", [
        "https://serval.unil.ch/resource/serval:BIB_0F9F11EAAA0C.P001/REF.pdf",
        "https://iris.unil.ch/bitstreams/f635441c-7356-42ee-bfd7-1b6a98bbbd96/download"]),
    ("14_s41477-022-01218-7_cellulose_synthase_microtubule", [
        "https://www.nature.com/articles/s41477-022-01218-7.pdf"]),
    ("15_annurev_cellbio_120420_095337_mechanochemical", [
        "https://www.annualreviews.org/doi/pdf/10.1146/annurev-cellbio-120420-095337"]),
    ("16_annurev_cellbio_020823_011522_morphogens", [
        "https://research-explorer.ista.ac.at/download/14484/14491/2023_AnnualReviews_Kicheva.pdf",
        "https://www.annualreviews.org/doi/pdf/10.1146/annurev-cellbio-020823-011522"]),
    ("17_s41467-022-30177-y_floral_meristem_3D_atlas", [
        "https://www.nature.com/articles/s41467-022-30177-y.pdf"]),
    ("18_kiac370_ARF3_meristem_proliferation", [
        "https://academic.oup.com/plphys/article-pdf/190/4/2335/47382438/kiac370.pdf",
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC9480985/pdf/kiac370.pdf"]),
]


def http_get(url, referer=None, cookie=None, timeout=180):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    if referer:
        req.add_header("Referer", referer)
    if cookie:
        req.add_header("Cookie", cookie)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def solve_pow(challenge, difficulty):
    """sha256(challenge+nonce) 前缀 difficulty 个 0。"""
    target = "0" * difficulty
    n = 0
    while True:
        if hashlib.sha256((challenge + str(n)).encode()).hexdigest().startswith(target):
            return n
        n += 1


def fetch(url, referer=None):
    """返回 (pdf_bytes, method)；自动处理 PMC PoW。"""
    body = http_get(url, referer=referer)
    if body[:5] == b"%PDF-":
        return body, "direct"
    html = body.decode("utf-8", "replace")
    ch = re.search(r'POW_CHALLENGE\s*=\s*"([^"]+)"', html)
    diff = re.search(r'POW_DIFFICULTY\s*=\s*"(\d+)"', html)
    name = re.search(r'POW_COOKIE_NAME\s*=\s*"([^"]+)"', html)
    if not (ch and diff and name):
        raise RuntimeError(f"非 PDF 且无 PoW 标记（{len(body)} B, {html[:100]!r}）")
    nonce = solve_pow(ch.group(1), int(diff.group(1)))
    cookie = f"{name.group(1)}={ch.group(1)},{nonce}"
    body = http_get(url, referer=referer, cookie=cookie)
    if body[:5] != b"%PDF-":
        raise RuntimeError("PoW 后仍非 PDF")
    return body, "pmc-pow"


def pdfinfo(path):
    out = subprocess.run(["pdfinfo", path], capture_output=True, text=True).stdout
    m = re.search(r"Pages:\s+(\d+)", out)
    return int(m.group(1)) if m else None


def first_page(path):
    txt = subprocess.run(["pdftotext", "-f", "1", "-l", "1", path, "-"],
                         capture_output=True, text=True).stdout
    lines = [l.strip() for l in txt.splitlines() if l.strip()]
    return " ".join(lines[:3])[:140]


def main():
    force = "--force" in sys.argv
    os.makedirs(REFS, exist_ok=True)
    manifest = []
    for i, (slug, urls) in enumerate(SLUGS, 1):
        name = f"{i:02d}_{slug}.pdf"
        path = os.path.join(REFS, name)
        if os.path.exists(path) and os.path.getsize(path) > 200_000 and not force:
            print(f"skip  {name}  ({os.path.getsize(path)} B)")
            manifest.append({"file": name, "status": "cached"})
            continue
        ok = False
        for u in urls:
            try:
                data, method = fetch(u)
                if len(data) < 100_000:
                    raise RuntimeError(f"文件过小 {len(data)} B")
                with open(path, "wb") as fh:
                    fh.write(data)
                pages = pdfinfo(path)
                head = first_page(path)
                print(f"ok    {name}  {len(data)/1e6:.2f} MB  pages={pages}  via={method}")
                print(f"      {head}")
                manifest.append({"file": name, "status": "ok", "source": u, "bytes": len(data),
                                 "sha256": hashlib.sha256(data).hexdigest()[:16],
                                 "pages": pages, "first_page": head})
                ok = True
                break
            except Exception as e:
                print(f"      try fail {u[:75]} :: {str(e)[:90]}")
        if not ok:
            print(f"FAIL  {name}")
            manifest.append({"file": name, "status": "fail", "tried": urls})
    json.dump(manifest, open(os.path.join(REFS, "manifest.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    ok = sum(1 for m in manifest if m["status"] in ("ok", "cached"))
    print(f"\n{ok}/{len(manifest)} 篇就绪")


if __name__ == "__main__":
    main()

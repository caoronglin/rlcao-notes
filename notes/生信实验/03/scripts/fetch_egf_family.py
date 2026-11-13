#!/usr/bin/env python3
"""按基因名检索跨物种 EGF 家族（EGF/TGFA/AREG/EREG/HBEGF）RefSeq mRNA 与蛋白。

输出：
  EGF_family_refseq_mRNA_all.fa / EGF_family_refseq_protein_all.fa  序列
  EGF_family_refseq_mRNA_meta.tsv / ..._protein_meta.tsv            元数据（登录号+版本、物种、标题、长度）
"""
import json
import pathlib
import sys
import time
import urllib.parse

import requests

EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
ALLOWED_SCHEMES = ("https",)
HEADERS = {"User-Agent": "bioinfo-course-report/1.0"}
GENES = ["EGF", "TGFA", "AREG", "EREG", "HBEGF"]


def _fetch_text(url, tries=5):
    """只允许 https，取回文本内容；失败时重试。"""
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme not in ALLOWED_SCHEMES or not parsed.netloc:
        raise ValueError(f"仅允许 https URL: {url}")
    last = None
    for i in range(tries):
        try:
            resp = requests.get(url, headers=HEADERS, timeout=120)
            resp.raise_for_status()
            return resp.text
        except Exception as exc:  # 网络抖动重试
            last = exc
            print("retry", i, exc, flush=True)
            time.sleep(6)
    raise RuntimeError(f"failed: {url} ({last})")


def get_json(url):
    """解析 JSON，失败时报明确错误。"""
    try:
        raw = _fetch_text(url)
    except (ValueError, RuntimeError) as exc:
        raise RuntimeError(f"取回失败: {url}: {exc}") from exc
    try:
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"JSON 解析失败: {url}: {exc}") from exc


def esearch(db, term, retmax=20000):
    """ESearch 取 UID 列表。"""
    u = EUTILS + "esearch.fcgi?" + urllib.parse.urlencode(
        {"db": db, "term": term, "retmax": retmax, "retmode": "json"})
    try:
        d = get_json(u)["esearchresult"]
        return d["idlist"], int(d["count"])
    except (KeyError, ValueError, RuntimeError) as exc:
        raise RuntimeError(f"esearch 失败: {db} {term}: {exc}") from exc


def efetch_text(db, ids, rettype="fasta"):
    """EFetch 取序列文本。"""
    u = EUTILS + "efetch.fcgi?" + urllib.parse.urlencode(
        {"db": db, "id": ",".join(ids), "rettype": rettype, "retmode": "text"})
    try:
        return _fetch_text(u)
    except (ValueError, RuntimeError) as exc:
        raise RuntimeError(f"efetch 失败: {db}: {exc}") from exc


def esummary(db, ids):
    out = {}
    for i in range(0, len(ids), 300):
        chunk = ids[i:i + 300]
        u = EUTILS + "esummary.fcgi?" + urllib.parse.urlencode(
            {"db": db, "id": ",".join(chunk), "retmode": "json"})
        res = get_json(u)["result"]
        for uid in res.get("uids", []):
            out[uid] = res[uid]
    return out


def write_text(path, text):
    """写文本文件，失败时抛明确错误。"""
    try:
        pathlib.Path(path).write_text(text, encoding="utf-8")
    except OSError as exc:
        raise RuntimeError(f"写入失败: {path}: {exc}") from exc


def ensure_dir(path):
    """确保目录存在。"""
    try:
        pathlib.Path(path).mkdir(parents=True, exist_ok=True)
    except OSError as exc:
        raise RuntimeError(f"建目录失败: {path}: {exc}") from exc


def run(db, prop, tag, outdir):
    term = "(" + " OR ".join(f"{g}[Gene Name]" for g in GENES) + ")" + prop + " AND refseq[filter]"
    ids, count = esearch(db, term)
    print(f"[{tag}] Entrez 命中 {count}，取回 {len(ids)}", flush=True)
    if not ids:
        return
    chunks = [efetch_text(db, ids[i:i + 300]) for i in range(0, len(ids), 300)]
    write_text(f"{outdir}/EGF_family_refseq_{tag}_all.fa", "".join(chunks))
    meta = esummary(db, ids)
    lines = ["uid\taccession_version\ttitle\torganism\tlength\tslen\tgene\tmoltype"]
    for uid in ids:
        r = meta.get(uid, {})
        acc = r.get("accessionversion", "")
        lines.append("\t".join([
            uid, acc, r.get("title", "").replace("\t", " "),
            r.get("organism", ""), str(r.get("length", "")), str(r.get("slen", "")),
            r.get("name", ""), r.get("moltype", "")]))
    write_text(f"{outdir}/EGF_family_refseq_{tag}_meta.tsv", "\n".join(lines) + "\n")


if __name__ == "__main__":
    outdir = sys.argv[1] if len(sys.argv) > 1 else "."
    ensure_dir(outdir)
    run("nuccore", " AND biomol_mrna[prop]", "mRNA", outdir)
    run("protein", "", "protein", outdir)
    print("SAVED")

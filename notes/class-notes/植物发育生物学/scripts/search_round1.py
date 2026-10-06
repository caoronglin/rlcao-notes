#!/usr/bin/env python3
"""Round-1 多平台检索：茎端分生组织模式形成 × 形态发生/力学。

源：OpenAlex / Crossref / Europe PMC / bioRxiv / PubMed。
输出：work/candidates.json + work/candidates.tsv（去重、按相关度与年份排序）。
"""
import json, os, re, sys, time, urllib.parse, urllib.request
from collections import defaultdict

MAIL = "caoronglin@nwafu.edu.cn"
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/152.0.0.0 Safari/537.36"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORK = os.path.join(ROOT, "work")

QUERIES = [
    ("A1", "shoot apical meristem stem cell niche WUS CLV3 patterning"),
    ("A2", "auxin phyllotaxis leaf primordium initiation meristem"),
    ("A3", "cytokinin auxin meristem size stem cell homeostasis"),
    ("A4", "shoot apical meristem live imaging morphogenesis"),
    ("A5", "flower meristem determinacy inflorescence architecture"),
    ("B1", "cell wall mechanics anisotropic growth plant morphogenesis"),
    ("B2", "microtubule cellulose synthase cortical array growth anisotropy"),
    ("B3", "mechanical feedback tissue tension organ shape plant"),
    ("B4", "turgor pressure cell growth mechanics plant"),
    ("B5", "computational model morphogenesis plant tissue growth"),
    ("C1", "single-cell transcriptomics shoot apical meristem cell identity"),
    ("C2", "AP2 WUS floral transition meristem identity"),
]

def get(url, timeout=60):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.load(r)

def openalex(q, per=25):
    url = ("https://api.openalex.org/works?"
           + urllib.parse.urlencode({
               "search": q, "filter": "from_publication_date:2022-01-01",
               "per-page": per, "sort": "relevance_score:desc", "mailto": MAIL}))
    out = []
    try:
        for w in get(url)["results"]:
            src = ((w.get("primary_location") or {}).get("source") or {}).get("display_name")
            out.append({
                "title": w.get("title"), "year": w.get("publication_year"),
                "journal": src, "doi": (w.get("doi") or "").replace("https://doi.org/", ""),
                "cites": w.get("cited_by_count"),
                "oa": (w.get("open_access") or {}).get("is_oa"),
                "pmid": (w.get("ids") or {}).get("pmid", "").replace("https://pubmed.ncbi.nlm.nih.gov/", "").rstrip("/"),
                "authors": [a["author"]["display_name"] for a in (w.get("authorships") or [])[:4]],
                "platform": "openalex"})
    except Exception as e:
        print("openalex fail", q[:30], e, file=sys.stderr)
    return out

def crossref(q, per=20):
    url = "https://api.crossref.org/works?" + urllib.parse.urlencode({
        "query.bibliographic": q, "rows": per,
        "filter": "from-pub-date:2022-01-01,type:journal-article", "mailto": MAIL})
    out = []
    try:
        for w in get(url)["message"]["items"]:
            out.append({
                "title": (w.get("title") or [""])[0], "year": (w.get("issued", {}).get("date-parts") or [[None]])[0][0],
                "journal": (w.get("container-title") or [""])[0], "doi": w.get("DOI"),
                "cites": w.get("is-referenced-by-count"), "oa": None, "pmid": "",
                "authors": [f"{a.get('family','')} {a.get('given','')}".strip() for a in (w.get("author") or [])[:4]],
                "platform": "crossref"})
    except Exception as e:
        print("crossref fail", q[:30], e, file=sys.stderr)
    return out

def epmc(q, per=20):
    url = "https://www.ebi.ac.uk/europepmc/webservices/rest/search?" + urllib.parse.urlencode({
        "query": f'({q}) AND (FIRST_PDATE:[2022-01-01 TO 2026-12-31])',
        "format": "json", "resultType": "core", "pageSize": per, "sort": "CITED desc"})
    out = []
    try:
        for w in get(url)["resultList"]["result"]:
            out.append({
                "title": w.get("title"), "year": int(w.get("pubYear") or 0) or None,
                "journal": w.get("journalTitle"), "doi": w.get("doi"),
                "cites": w.get("citedByCount"), "oa": w.get("isOpenAccess") == "Y",
                "pmid": w.get("pmid", ""), "pmcid": w.get("pmcid", ""),
                "authors": [a.get("fullName", "") for a in (w.get("authorList") or {}).get("author", [])[:4]],
                "platform": "europepmc"})
    except Exception as e:
        print("epmc fail", q[:30], e, file=sys.stderr)
    return out

def normalize(recs):
    """按 DOI / 标题去重，合并平台与引用数。"""
    seen = {}
    for r in recs:
        if not r.get("title"):
            continue
        key = (r.get("doi") or "").lower() or re.sub(r"\W+", "", r["title"].lower())[:80]
        cur = seen.get(key)
        if cur is None:
            r["found_by"] = {r["platform"]}
            seen[key] = r
        else:
            cur["found_by"].add(r["platform"])
            if (r.get("cites") or 0) > (cur.get("cites") or 0):
                cur["cites"] = r["cites"]
            for k in ("oa", "pmid", "pmcid"):
                if not cur.get(k) and r.get(k):
                    cur[k] = r[k]
    return list(seen.values())

def score(r):
    """相关度启发式：标题关键词 + 引用数 + 期刊。"""
    t = (r.get("title") or "").lower()
    hip = ["meristem", "morphogenesis", "mechanical", "cell wall", "anisotrop", "phyllotax",
           "auxin", "wus", "clv3", "stem cell", "tissue tension", "microtubule", "cellulose",
           "organ shape", "pattern", "growth"]
    s = sum(2 for h in hip if h in t)
    s += min((r.get("cites") or 0) / 20.0, 8)
    j = (r.get("journal") or "").lower()
    for good, add in [("nature reviews", 3), ("annual review", 3), ("cell", 2.5), ("science", 2.5),
                      ("nature", 2), ("development", 1.5), ("plant cell", 1.5),
                      ("current biology", 1.5), ("plant physiology", 1), ("new phytologist", 1),
                      ("pnas", 1), ("elife", 1), ("molecular plant", 1)]:
        if good in j:
            s += add
            break
    return s

def main():
    os.makedirs(WORK, exist_ok=True)
    all_recs = []
    for tag, q in QUERIES:
        got = openalex(q) + crossref(q) + epmc(q)
        for r in got:
            r["tag"] = tag
        all_recs += got
        print(f"{tag}: {len(got)} raw", file=sys.stderr)
        time.sleep(0.6)
    uniq = normalize(all_recs)
    uniq.sort(key=score, reverse=True)
    for r in uniq:
        r["found_by"] = sorted(r.get("found_by") or [])
    with open(os.path.join(WORK, "candidates.json"), "w", encoding="utf-8") as f:
        json.dump(uniq, f, ensure_ascii=False, indent=1)
    with open(os.path.join(WORK, "candidates.tsv"), "w", encoding="utf-8") as f:
        f.write("rank\tscore\tyear\tcites\toa\ttag\tjournal\ttitle\tdoi\tpmid\n")
        for i, r in enumerate(uniq, 1):
            f.write("\t".join(str(x).replace("\t", " ") for x in [
                i, round(score(r), 1), r.get("year"), r.get("cites"), r.get("oa"), r.get("tag"),
                r.get("journal"), r.get("title"), r.get("doi"), r.get("pmid")]) + "\n")
    print(f"\ntotal raw={len(all_recs)} unique={len(uniq)}")

if __name__ == "__main__":
    main()

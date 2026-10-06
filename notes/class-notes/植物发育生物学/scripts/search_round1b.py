#!/usr/bin/env python3
"""Round-1 补充检索：把主题收窄到「茎端/花序分生组织 × 模式形成 ↔ 形态发生耦合」。"""
import json, os, sys, time, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from search_round1 import openalex, crossref, epmc, normalize, score, WORK

QUERIES = [
    ("A6", "shoot apical meristem mechanical forces growth"),
    ("A7", "inflorescence meristem size determinacy crop yield"),
    ("A8", "floral meristem termination determinacy WUS"),
    ("A9", "WUSCHEL signalling shoot stem cell homeodomain"),
    ("B6", "tissue growth anisotropy shoot apex organ geometry"),
    ("B7", "mechanical stress cell division orientation plant"),
    ("B8", "computational model shoot apical meristem growth"),
    ("C3", "spatial transcriptomics shoot apex meristem"),
    ("C4", "single cell atlas shoot apical meristem Arabidopsis"),
    ("D1", "cell wall pectin stiffness growth organ shape"),
]

def main():
    recs = []
    for tag, q in QUERIES:
        got = openalex(q) + crossref(q) + epmc(q)
        for r in got:
            r["tag"] = tag
        recs += got
        print(f"{tag}: {len(got)}", file=sys.stderr)
        time.sleep(0.6)
    uniq = normalize(recs)
    uniq.sort(key=score, reverse=True)
    for r in uniq:
        r["found_by"] = sorted(r.get("found_by") or [])
    p = os.path.join(WORK, "candidates_b.json")
    json.dump(uniq, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"unique={len(uniq)}")

if __name__ == "__main__":
    main()

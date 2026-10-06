#!/usr/bin/env python3
"""从两轮检索结果中人工收敛出候选清单（按主题分块）。"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORK = os.path.join(ROOT, "work")

BLOCKS = {
 "1 模式形成·分生组织干细胞与命运指定": [
   "Interactive CLV3, CLE16, and CLE17 signaling",
   "A network of CLAVATA receptors buffers auxin-dependent meristem maintenance",
   "De novo stem cell establishment in meristems requires repression of organ boundary",
   "Local auxin biosynthesis promotes shoot patterning and stem cell differentiation",
   "The peptidase DA1 cleaves and destabilizes WUSCHEL",
   "KNUCKLES regulates floral meristem termination",
   "Meristem Initiation and de novo Stem Cell Formation",
   "How meristems shape plant architecture in cereals",
 ],
 "2 模式形成·位置信息与器官起始": [
   "AUXIN RESPONSE FACTOR3 controls meristem proliferation and phyllotax",
   "Specification of leaf dorsiventrality via a prepatterned binary readout",
   "CUC1", "Water fluxes pattern growth and identity in shoot meristems",
   "Hormonal control of cell identity and growth in the shoot apical meristem",
 ],
 "3 形态发生·细胞壁力学与各向异性生长": [
   "Structure and growth of plant cell walls",
   "The mechanics of plant morphogenesis",
   "Microtubule-based perception of mechanical conflicts",
   "Growth anisotropy of the extracellular matrix shapes a developing organ",
   "Spatial consistency of cell growth direction during organ morphogenesis",
   "Mechanical forces in plant tissue matrix orient cell divisions",
   "Anisotropic cell growth at the leaf base",
   "Revisiting the relationship between turgor pressure",
   "Tethering of cellulose synthase to microtubules",
   "Cellulose synthesis in land plants",
   "Mechanical forces instruct division plane orientation of cambium stem cells",
   "The plant cell wall", "Hormone-regulated expansins",
 ],
 "4 耦合机制·模型与新兴技术": [
   "Mechanochemical Principles of Spatial and Temporal Patterns",
   "Control of Tissue Development by Morphogens",
   "Macromolecular crowding limits growth under pressure",
   "bistable activator", 
   "A 3D gene expression atlas of the floral meristem",
   "Single-cell and spatial multi-omics in the plant sciences",
 ],
}

def load():
    recs = []
    for f in ("candidates.json", "candidates_b.json"):
        p = os.path.join(WORK, f)
        if os.path.exists(p):
            recs += json.load(open(p, encoding="utf-8"))
    return recs

def main():
    recs = load()
    chosen, seen_doi = [], set()
    for block, frags in BLOCKS.items():
        block_hits = []
        for frag in frags:
            best = None
            for r in recs:
                t = r.get("title") or ""
                if frag.lower() in t.lower():
                    if best is None or (r.get("cites") or 0) > (best.get("cites") or 0):
                        best = r
            if best is None:
                print(f"  [未命中] {block}: {frag}", file=sys.stderr)
                continue
            doi = (best.get("doi") or "").lower()
            if doi and doi in seen_doi:
                continue
            seen_doi.add(doi)
            best = dict(best); best["block"] = block
            block_hits.append(best)
        chosen += block_hits

    out = os.path.join(WORK, "shortlist.json")
    json.dump(chosen, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    md = ["# Round-1 候选清单（供挑选）", ""]
    for i, r in enumerate(chosen, 1):
        md.append(f"{i}. **{r.get('title')}** — {', '.join(r.get('authors') or [])}"
                  f". *{r.get('journal')}*, {r.get('year')}. DOI: {r.get('doi') or 'n/a'}"
                  f"{' PMID: '+r['pmid'] if r.get('pmid') else ''}"
                  f" | 引用 {r.get('cites')} | OA={r.get('oa')} | 块 {r['block']}")
    open(os.path.join(WORK, "shortlist.md"), "w", encoding="utf-8").write("\n".join(md) + "\n")

    print(f"候选 {len(chosen)} 篇 → work/shortlist.md")
    for r in chosen:
        print(f"  [{r['block'][:2]}] {r.get('year')} c={r.get('cites')} {r.get('journal')[:28] if r.get('journal') else '?':28} | {(r.get('title') or '')[:78]}")

if __name__ == "__main__":
    main()

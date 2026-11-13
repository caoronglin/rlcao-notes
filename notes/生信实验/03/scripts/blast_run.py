#!/usr/bin/env python3
"""NCBI BLAST URL API 封装：提交 -> 轮询 -> 下载 XML -> 摘要。

用法：
  python3 blast_run.py --program blastn --database refseq_rna \
      --query query.fa --out results/xx.xml [--param KEY=VAL ...]
"""
import argparse
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

BASE = "https://blast.ncbi.nlm.nih.gov/Blast.cgi"
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36"


def http(url, data=None, timeout=120):
    req = urllib.request.Request(
        url,
        data=data,
        headers={"User-Agent": UA, "Accept": "*/*"},
    )
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")


def submit(args, params):
    q = open(args.query, encoding="utf-8").read()
    data = {
        "PROGRAM": args.program,
        "DATABASE": args.database,
        "QUERY": q,
        "FORMAT_TYPE": "XML",
        "ALIGNMENTS": args.alignments,
        "DESCR": args.descr,
        "HITLIST_SIZE": args.hitlist,
    }
    data.update(params)
    body = urllib.parse.urlencode(data).encode()
    txt = http(BASE + "?CMD=Put", data=body)
    m = re.search(r"RID = (\S+)", txt)
    if not m:
        m = re.search(r"<RID>(\S+?)</RID>", txt)
    if not m:
        raise RuntimeError("提交失败：\n" + txt[:1500])
    rid = m.group(1)
    rtoe = None
    m2 = re.search(r"RTOE = (\d+)", txt)
    if m2:
        rtoe = int(m2.group(1))
    return rid, rtoe


def poll(rid, timeout_s=3600):
    t0 = time.time()
    while time.time() - t0 < timeout_s:
        txt = http(BASE + f"?CMD=Get&RID={rid}&FORMAT_OBJECT=SearchInfo")
        if "Status=WAITING" in txt:
            time.sleep(15)
            continue
        if "Status=FAILED" in txt or "Status=UNKNOWN" in txt:
            raise RuntimeError("作业失败：\n" + txt[-1200:])
        if "Status=READY" in txt:
            return
        time.sleep(15)
    raise TimeoutError("轮询超时")


def fetch_xml(rid):
    return http(BASE + f"?CMD=Get&RID={rid}&FORMAT_TYPE=XML", timeout=300)


def summarize(xml_text):
    root = ET.fromstring(xml_text)
    out = {"query": "", "db": "", "program": "", "parameters": {}, "iterations": [], "hits": []}
    for it in root.iter("Iteration"):
        rec = {"iter": it.get("iter"), "num_hits": None, "status": None, "search": None,
               "hit_descrs": [], "stats": {}}
        for tag in ("Iteration_num_hits", "Iteration_status", "Iteration_search_stat"):
            el = it.find(tag)
            if el is None:
                continue
            if tag == "Iteration_num_hits":
                rec["num_hits"] = int(el.text)
            elif tag == "Iteration_status":
                rec["status"] = el.text
            else:
                rec["stats"] = dict(el.attrib)
                for c in el:
                    rec["stats"][c.tag] = (c.text or "").strip()
        for hd in it.iter("Hit_descr"):
            rec["hit_descrs"].append({
                "accession": hd.get("accession"),
                "len": hd.get("len"),
                "title": (hd.text or "").strip(),
            })
        out["iterations"].append(rec)
    for h in root.iter("Hit"):
        rec = {"num": h.get("num"), "accession": h.get("accession"), "len": h.get("len"),
               "def": h.get("def"), "desc": "", "hsps": []}
        hd = h.find("Hit_def")
        if hd is not None:
            rec["desc"] = (hd.text or "").strip()
        for hsp in h.iter("Hsp"):
            rec["hsps"].append({
                "num": hsp.get("num"),
                "bit_score": hsp.get("bit-score"),
                "score": hsp.get("score"),
                "evalue": hsp.get("evalue"),
                "identity": hsp.get("identity"),
                "positive": hsp.get("positive"),
                "align_len": hsp.get("align-len"),
                "gaps": hsp.get("gaps"),
                "query_from": hsp.get("query-from"),
                "query_to": hsp.get("query-to"),
                "hit_from": hsp.get("hit-from"),
                "hit_to": hsp.get("hit-to"),
                "query_frame": hsp.get("query-frame"),
                "hit_frame": hsp.get("hit-frame"),
            })
        out["hits"].append(rec)
    q = root.find(".//Iteration_query-def")
    if q is None:
        q = root.find(".//BlastOutput_query-def")
    if q is not None:
        out["query"] = q.text
    db = root.find(".//Iteration_query-db")
    if db is not None:
        out["db"] = db.text
    pg = root.find(".//BlastOutput_program")
    if pg is not None:
        out["program"] = pg.text
    for p in root.iter("Parameters"):
        for c in p:
            out["parameters"][c.tag] = (c.text or "").strip()
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--program", required=True)
    ap.add_argument("--database", required=True)
    ap.add_argument("--query", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--param", action="append", default=[])
    ap.add_argument("--alignments", default="100")
    ap.add_argument("--descr", default="50")
    ap.add_argument("--hitlist", default="100")
    ap.add_argument("--timeout", type=int, default=3600)
    ap.add_argument("--summary", default=None)
    args = ap.parse_args()

    params = {}
    for kv in args.param:
        k, _, v = kv.partition("=")
        params[k.upper()] = v

    os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)
    rid, rtoe = submit(args, params)
    print(f"[submit] RID={rid} RTOE={rtoe}", flush=True)
    poll(rid, args.timeout)
    xml = fetch_xml(rid)
    with open(args.out, "w", encoding="utf-8") as f:
        f.write(xml)
    s = summarize(xml)
    with open(args.out + ".summary.json", "w", encoding="utf-8") as f:
        json.dump(s, f, ensure_ascii=False, indent=1)
    print(f"[done] {args.out}  hits={sum(i['num_hits'] or 0 for i in s['iterations'])}", flush=True)
    if args.summary:
        with open(args.summary, "w", encoding="utf-8") as f:
            json.dump(s, f, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""实验三：把报告插图做成可交互 ECharts 版（charts/），与 02 的约定一致。

模板取自 02/charts 现成文件：head 是内联的 ECharts 5.4.4 + 样式，
尾部脚本复用 saveAsImage / toggleFull / 标题编辑等辅助函数。
"""
from __future__ import annotations

import csv
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
RES = ROOT / "results"
OUT = ROOT / "charts"
TPL = ROOT.parent / "02/charts/核酸比对 148 个空位游程里 130 个不超过 9 bp，_ad33e3.html"


def build_template() -> tuple[str, str]:
    src = TPL.read_text(encoding="utf-8")
    head = src.split("<body>")[0] + "<body>\n"
    helpers = src[src.index("function saveAsImage()"):src.index("</script>\n</body>")]
    return head, helpers


HEAD, HELPERS = build_template()


def page(title: str, subtitle: str, annotation: str, option: str) -> str:
    return f"""{HEAD}<div class="container">
  <div class="header">
    <h1 class="title" contenteditable="true" title="双击标题可编辑">{title}</h1>
    <div class="edit-hint">双击标题可编辑</div>
    <div class="subtitle">{subtitle} &middot; Smart Charts &middot; 2026-11-06</div>
  </div>
  <div class="controls">
    <button class="btn" onclick="saveAsImage()">保存图片</button>
    <button class="btn" onclick="toggleFull()">全屏</button>
  </div>
  <div class="rename-panel" id="renamePanel"></div>
  <div class="chart-wrapper">
    <div id="chart" class="chart"></div>
  </div>
  <div class="annotation">{annotation}</div>
  <div class="footer">由 Smart Charts 生成 &middot; ECharts 5.4.4</div>
</div>
<script>
var chartDom = document.getElementById('chart');
var chart = echarts.init(chartDom);
var chartOption = {option};
chart.setOption(chartOption);
var currentDownloadName = {title!r}.replace(/[\\/:*?"<>|]/g, '_').substring(0, 30);
window.addEventListener('resize', function() {{ chart.resize(); }});
{HELPERS}
</script>
</body>
</html>
"""


def summary() -> dict[str, dict]:
    return {r["run"]: r for r in csv.DictReader(open(DATA / "t1_t2_t4_summary.csv", encoding="utf-8"))}


def psi() -> list[dict]:
    return list(csv.DictReader(open(DATA / "psi_rounds.csv", encoding="utf-8")))


def main() -> int:
    OUT.mkdir(exist_ok=True)
    sm = summary()
    ps = psi()

    def s(run: str, key: str) -> float:
        return float(sm[run][key])

    charts: list[tuple[str, str, str, str, str]] = []

    # 1. 三种算法
    charts.append((
        "fig1a_三种算法召回量与耗时",
        "同一 query（人 EGF mRNA NM_001963.6）对同一核酸库，只改 task",
        "megablast 用 28 nt 长词，只抓高相似区段，召回 2,720 条、耗时 1.6 s；blastn 用 11 nt 词，"
        "召回 60,632 条（22 倍）、耗时 31.2 s；dc-megablast 用不连续词，召回 29,064 条、耗时 18.6 s。"
        "三者前 10 条排序几乎一致，差别在召回总量与速度，不在头部。",
        f"""{{
  title: {{ text: "三种 blastn 算法的召回量与耗时", left: "center", textStyle: {{ fontSize: 16 }} }},
  tooltip: {{ trigger: "axis" }},
  legend: {{ top: 30 }},
  grid: {{ left: 70, right: 70, top: 70, bottom: 40 }},
  xAxis: {{ type: "category", data: ["blastn", "dc-megablast", "megablast"] }},
  yAxis: [
    {{ type: "log", name: "命中序列数", min: 1000 }},
    {{ type: "value", name: "耗时 / s", max: 40 }}
  ],
  series: [
    {{ name: "命中序列数", type: "bar", data: [{s("t1a_blastn_default","subjects"):.0f}, {s("t1c_dcmegablast","subjects"):.0f}, {s("t1b_megablast","subjects"):.0f}], itemStyle: {{ color: "#1f3f66" }} }},
    {{ name: "耗时 / s", type: "line", yAxisIndex: 1, data: [{s("t1a_blastn_default","seconds")}, {s("t1c_dcmegablast","seconds")}, {s("t1b_megablast","seconds")}], itemStyle: {{ color: "#b3261e" }} }}
  ]
}}"""))

    # 2. word size 与 E-value
    charts.append((
        "fig1b_word_size 与 E-value 扫描",
        "blastn 固定 query 与库，分别扫 word size 与 E-value",
        "word size 从 11 降到 7 只多 7% 命中，耗时却涨 6.5 倍；升到 15 少 25%。"
        "E 值从 10 收紧到 1e-50，命中从 60,632 掉到 1,536（只剩灵长类近亲）；放宽到 1000 只多 14%。",
        f"""{{
  title: {{ text: "word size 与 E-value 对召回量的影响", left: "center", textStyle: {{ fontSize: 16 }} }},
  tooltip: {{ trigger: "axis" }},
  legend: {{ top: 30 }},
  grid: {{ left: 70, right: 40, top: 70, bottom: 40 }},
  xAxis: {{ type: "category", data: ["w=7", "w=11（默认）", "w=15", "E=1e-50", "E=1e-5", "E=10（默认）", "E=1000"] }},
  yAxis: {{ type: "value", name: "命中序列数" }},
  series: [
    {{ name: "word size", type: "bar", data: {json.dumps([s("t1d_blastn_w7","subjects"), s("t1e_blastn_w11","subjects"), s("t1f_blastn_w15","subjects")] + [None]*4)}, itemStyle: {{ color: "#466f87" }} }},
    {{ name: "E-value", type: "bar", data: {json.dumps([None]*3 + [s("t1g_blastn_e1e50","subjects"), s("t1h_blastn_e1e5","subjects"), s("t1i_blastn_e1000","subjects"), 69169])}, itemStyle: {{ color: "#9db6d4" }} }}
  ]
}}"""))

    # 3. blastp 参数敏感性
    charts.append((
        "fig3a_blastp 参数敏感性",
        "query＝人 EGF 前体 NP_001954.2（1,207 aa），分别改 word size、矩阵、E-value",
        "默认参数（word 3 / BLOSUM62 / E=10）附近曲线很平：word 3→2 反而少 8 条，w6 掉到 5,152；"
        "BLOSUM45 多 131 条、BLOSUM90 少 125 条但最高分从 2,509 升到 2,643；E 放到 1000 才多 663 条。"
        "真正改变结果的是矩阵与 E 值，不是 word size。",
        f"""{{
  title: {{ text: "blastp 参数敏感性", left: "center", textStyle: {{ fontSize: 16 }} }},
  tooltip: {{ trigger: "axis" }},
  legend: {{ top: 30 }},
  grid: {{ left: 70, right: 40, top: 70, bottom: 40 }},
  xAxis: {{ type: "category", data: ["word 2", "word 3（默认）", "word 6", "BLOSUM45", "BLOSUM62（默认）", "BLOSUM90", "E=1e-3", "E=10（默认）", "E=1000"] }},
  yAxis: {{ type: "value", name: "命中序列数", min: 3500 }},
  series: [
    {{ name: "命中序列数", type: "bar", data: [{s("t2b_blastp_w2","subjects"):.0f}, {s("t2a_blastp_default","subjects"):.0f}, {s("t2c_blastp_w6","subjects"):.0f}, {s("t2d_blastp_blosum45","subjects"):.0f}, {s("t2a_blastp_default","subjects"):.0f}, {s("t2e_blastp_blosum90","subjects"):.0f}, {s("t2f_blastp_e1e3","subjects"):.0f}, {s("t2a_blastp_default","subjects"):.0f}, {s("t2g_blastp_e1000","subjects"):.0f}],
      itemStyle: {{ color: "#1f3f66" }} }}
  ]
}}"""))

    # 4. 短序列
    charts.append((
        "fig3b_27 aa 短片段：blastp 与 blastp-short",
        "同一 27 aa 片段（前体 966–992）用两种任务搜索",
        "blastp-short 换成 PAM30、word 2、gap 9/1、阈值 16、窗口 15，命中数 4.9 倍，"
        "但 E<0.005 反而少 44 条，最高 bitscore 也略低；两者 top1 相同（NP_001343950，100% identity，E≈1e-11）。",
        f"""{{
  title: {{ text: "27 aa 短片段：默认 blastp 与 blastp-short", left: "center", textStyle: {{ fontSize: 16 }} }},
  tooltip: {{ trigger: "axis" }},
  legend: {{ top: 30 }},
  grid: {{ left: 70, right: 40, top: 70, bottom: 40 }},
  xAxis: {{ type: "category", data: ["命中序列", "E<0.005"] }},
  yAxis: {{ type: "value", name: "序列数" }},
  series: [
    {{ name: "默认 blastp", type: "bar", data: [{s("t2h_blastp_short_def","subjects"):.0f}, {s("t2h_blastp_short_def","e005"):.0f}], itemStyle: {{ color: "#1f3f66" }} }},
    {{ name: "blastp-short", type: "bar", data: [8763, 680], itemStyle: {{ color: "#b3261e" }} }}
  ]
}}"""))

    # 5. PSI-BLAST
    rounds = [int(r["round"]) for r in ps]
    news = [int(r["new_vs_prev"]) for r in ps]
    cums = [int(r["subjects"]) for r in ps]
    charts.append((
        "fig2a_PSI-BLAST 逐轮新增与累计",
        "人 EGF 前体对蛋白库，每轮从第 1 轮重跑到第 N 轮取第 N 轮结果",
        "第 2 轮起新增降到百级，但第 12 轮仍有 27 条新序列——未收敛。第 3 轮后新序列以蛇毒金属蛋白酶为主"
        "（11–19% identity、E≈1e-5），是 PSSM 被半胱氨酸骨架带偏的漂移信号。",
        f"""{{
  title: {{ text: "PSI-BLAST 逐轮新增与累计命中序列", left: "center", textStyle: {{ fontSize: 16 }} }},
  tooltip: {{ trigger: "axis" }},
  legend: {{ top: 30 }},
  grid: {{ left: 70, right: 70, top: 70, bottom: 40 }},
  xAxis: {{ type: "category", name: "轮次", data: {rounds} }},
  yAxis: [
    {{ type: "log", name: "本轮新增", min: 10 }},
    {{ type: "value", name: "累计序列", min: 6000, max: 8200 }}
  ],
  series: [
    {{ name: "本轮新增", type: "bar", data: {news}, itemStyle: {{ color: "#9db6d4" }} }},
    {{ name: "累计序列", type: "line", yAxisIndex: 1, data: {cums}, itemStyle: {{ color: "#b3261e" }} }}
  ]
}}"""))

    # 6. DELTA-BLAST 一致性分层
    import collections
    COLS = ["qseqid", "sseqid", "pident", "length", "mismatch", "gapopen", "qstart", "qend",
            "sstart", "send", "evalue", "bitscore", "sscinames", "stitle"]
    best = {}
    for r in csv.reader(open(RES / "t3b_deltablast.tsv", encoding="utf-8"), delimiter="\t"):
        if len(r) < 14:
            continue
        d = dict(zip(COLS, r))
        k = d["sseqid"]
        if k not in best or float(d["bitscore"]) > float(best[k]["bitscore"]):
            best[k] = d
    bins = collections.Counter()
    for h in best.values():
        p = float(h["pident"])
        key = (">=95" if p >= 95 else "90-95" if p >= 90 else "80-90" if p >= 80 else
               "70-80" if p >= 70 else "60-70" if p >= 60 else "50-60" if p >= 50 else
               "40-50" if p >= 40 else "30-40" if p >= 30 else "<30")
        bins[key] += 1
    order = [">=95", "90-95", "80-90", "70-80", "60-70", "50-60", "40-50", "30-40", "<30"]
    charts.append((
        "fig2b_DELTA-BLAST 命中按一致性分层",
        f"DELTA-BLAST 共命中 {len(best):,} 条序列（默认参数，17.5 s）",
        "≥70% 只有 640 条，40–70% 有 1,715 条，40% 以下 4,791 条（67%）。最低一档里最典型的是 LRP1："
        "小鼠 Q91ZX7 与 query 只有 29.1% identity，但对齐 660 aa、E=2.6e-103，属于结构域级同源。",
        f"""{{
  title: {{ text: "DELTA-BLAST 命中按一致性分层", left: "center", textStyle: {{ fontSize: 16 }} }},
  tooltip: {{ trigger: "axis" }},
  grid: {{ left: 70, right: 40, top: 60, bottom: 40 }},
  xAxis: {{ type: "category", name: "与 query 的一致性", data: {[k + "%" for k in order]} }},
  yAxis: {{ type: "value", name: "序列数" }},
  series: [{{ name: "序列数", type: "bar", data: {[bins[k] for k in order]}, itemStyle: {{ color: "#466f87" }} }}]
}}"""))

    # 7. 直系/并系同源一致性
    orth = [("Homo sapiens", 100.0), ("Pan troglodytes", 96.6), ("Macaca fascicularis", 93.2),
            ("Sus scrofa", 80.3), ("Canis lupus familiaris", 78.4), ("Rattus norvegicus", 67.1),
            ("Mus musculus", 66.2), ("Gallus gallus", 52.3), ("Xenopus tropicalis", 45.9),
            ("Salmo salar", 45.2), ("Oncorhynchus mykiss", 44.6), ("Danio rerio", 40.7)]
    para = [("EGF", 100.0, 1207), ("TGFA", 33.0, 97), ("EREG", 26.7, 116), ("HBEGF", 30.8, 78),
            ("BTC", 27.5, 102), ("NRG2", 30.1, 83), ("NRG4", 30.1, 93), ("AREG", 27.8, 72),
            ("NRG3", 26.6, 94), ("NRG1", 24.1, 79)]
    charts.append((
        "fig4_直系同源与并系同源的一致性谱",
        "12 条跨物种直系同源 + 10 条人源并系同源，序列存于 sequences/",
        "直系同源的一致性随物种分化时间单调下降（100% → 40.7%）；并系同源只共享成熟 EGF 域，"
        "一致性全部落在 24–33%，对齐长度只有 72–116 aa（EGF 自身 1,207 aa）。",
        f"""{{
  title: {{ text: "直系同源与并系同源对 query 的一致性", left: "center", textStyle: {{ fontSize: 16 }} }},
  tooltip: {{ trigger: "axis" }},
  legend: {{ top: 30 }},
  grid: {{ left: 150, right: 60, top: 70, bottom: 40 }},
  xAxis: {{ type: "value", name: "一致性 / %", max: 105 }},
  yAxis: {{ type: "category", data: {[n for n, _ in orth] + [n for n, _, _ in para]} }},
  series: [
    {{ name: "直系同源（跨物种）", type: "bar", data: {json.dumps([v for _, v in orth] + [None] * len(para))}, itemStyle: {{ color: "#1f3f66" }},
      label: {{ show: true, position: "right", formatter: function(p) {{ return p.value + "%"; }} }} }},
    {{ name: "并系同源（人源家族）", type: "bar", data: {json.dumps([None] * len(orth) + [v for _, v, _ in para])}, itemStyle: {{ color: "#9db6d4" }},
      label: {{ show: true, position: "right", formatter: function(p) {{ return p.value + "%"; }} }} }}
  ]
}}"""))

    for name, subtitle, annotation, option in charts:
        title = name.split("_", 1)[1]
        (OUT / f"{name}.html").write_text(
            page(title, subtitle, annotation, option), encoding="utf-8")
        print(f"{name}.html")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

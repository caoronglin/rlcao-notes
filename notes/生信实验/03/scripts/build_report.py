#!/usr/bin/env python3
"""Convert a course-report Markdown file into print HTML and PDF."""
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CSS = """
@page {
  size: A4;
  margin: 15mm 15mm 15mm 15mm;
  @bottom-center { content: counter(page) " / " counter(pages); font-size: 8.5pt; color: #000; }
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: "Times New Roman", "Noto Serif CJK SC", "Songti SC", serif;
  font-size: 10pt; line-height: 1.6; color: #000;
}
h1 {
  font-family: "Noto Sans CJK SC", "Microsoft YaHei", sans-serif;
  font-size: 17pt; font-weight: 700; margin: 0 0 2.5mm 0;
}
h2 {
  font-family: "Noto Sans CJK SC", "Microsoft YaHei", sans-serif;
  font-size: 11pt; font-weight: 700; margin: 2.4mm 0 1.0mm 0;
  break-after: avoid;
}
h3 {
  font-family: "Noto Sans CJK SC", "Microsoft YaHei", sans-serif;
  font-size: 10.4pt; font-weight: 700; margin: 2.6mm 0 1mm 0;
  break-after: avoid;
}
p { margin: 0 0 0.85mm 0; text-align: justify; text-indent: 2em; }
p.info { text-indent: 0; font-size: 10pt; line-height: 1.5; margin-bottom: 1.2mm; }
p.info span { margin-right: 8mm; }
code {
  font-family: "Times New Roman", "Noto Sans Mono CJK SC", monospace;
  font-size: 8.8pt;
}
a { color: #000; text-decoration: none; }
ul, ol { margin: 0 0 1.1mm 0; padding-left: 5.2mm; }
li { margin-bottom: 0.35mm; text-align: justify; text-indent: 0; }
table {
  width: 100%; border-collapse: collapse; table-layout: fixed;
  font-size: 8.0pt; line-height: 1.30; margin: 0.6mm 0 1.5mm 0;
}
thead th {
  border-top: 1.2pt solid #000; border-bottom: 0.6pt solid #000;
  padding: 0.8mm 1.1mm; font-family: "Noto Sans CJK SC", sans-serif;
  font-size: 8pt; font-weight: 700; text-align: left; vertical-align: bottom;
}
tbody tr { break-inside: avoid; }
tbody td { padding: 0.55mm 1.1mm; vertical-align: top; }
tbody tr:last-child td { border-bottom: 1.2pt solid #000; }
.tcap {
  font-family: "Noto Sans CJK SC", sans-serif; font-size: 9pt; font-weight: 700;
  margin: 1.3mm 0 0.5mm 0; text-indent: 0; break-after: avoid;
}
figure { margin: 1.0mm 0 1.3mm 0; break-inside: avoid; text-align: center; }
figure img { width: __FIGW__; height: auto; }
figure img[src^="shot_terminal_"] { width: __SHOTW__; }
figure img[src="shot-ncbi-blastn-list.png"] { width: 85%; }
figure img[src="fig4_homologs.png"] { width: 70%; }
figure img[src="shot-ncbi-blast-results.png"] { width: 78%; }
figure img[src="shot_alignment.png"] { width: 80%; }
figcaption { font-size: 8.5pt; text-align: center; margin-top: 0.6mm; text-indent: 0; line-height: 1.4; }
"""


def fragment(md_path):
    out = subprocess.check_output(
        ["pandoc", str(md_path), "-f", "markdown", "-t", "html5", "--wrap=none"],
        text=True,
    )
    # First two paragraphs after H1 are the name/class and mastery lines.
    out = out.replace("<p>姓名：", '<p class="info">姓名：', 1)
    out = out.replace("<p>实验掌握情况：", '<p class="info">实验掌握情况：', 1)
    # Table captions: a paragraph immediately before <table>.
    out = re.sub(r'<p>(表\s*\d+[^<]*)</p>\s*(<table[^>]*>)', r'<div class="tcap">\1</div>\n\2', out)
    # Figure: replace pandoc's alt caption and the following italic caption with one caption.
    pattern = re.compile(
        r'<figure>\s*(<img[^>]+>)\s*<figcaption[^>]*>.*?</figcaption>\s*</figure>\s*'
        r'<p><em>(图\s*\d+[^<]*)</em></p>', re.S)
    out = pattern.sub(r'<figure>\1<figcaption>\2</figcaption></figure>', out)
    # Any remaining italic figure caption becomes a plain caption paragraph.
    out = re.sub(r'<p><em>(图\s*\d+[^<]*)</em></p>', r'<p class="figcap">\1</p>', out)
    # Obsidian wikilinks: keep the display text only.
    out = re.sub(r'\[\[[^\]|]+\|([^\]]+)\]\]', r'\1', out)
    out = re.sub(r'\[\[([^\]]+)\]\]', r'\1', out)
    return out


def build(md_path, html_path, pdf_path):
    body = fragment(md_path)
    FIGW = "100%" if "实验报告_4" in md_path.name else "80%"
    SHOTW = "92%"
    html = f"""<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8">
<title>{md_path.stem}</title>
<style>{CSS.replace("__FIGW__", FIGW).replace("__SHOTW__", SHOTW)}</style></head><body>
{body}
</body></html>"""
    html_path.write_text(html)
    subprocess.run(["uvx", "--from", "weasyprint", "weasyprint", str(html_path), str(pdf_path)], check=True)


if __name__ == "__main__":
    md = pathlib.Path(sys.argv[1]).resolve()
    html = md.with_suffix(".html")
    pdf = md.with_suffix(".pdf")
    build(md, html, pdf)
    print(pdf)

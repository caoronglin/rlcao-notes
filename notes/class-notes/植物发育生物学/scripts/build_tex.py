#!/usr/bin/env python3
"""paper.md → paper.tex（ctexart），并插入图 1 / 表 1。
包含：markdown 轻量转换、引用 [n] → \\cite、参考文献 thebibliography、字符转义。
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "paper", "paper.md")
DST = os.path.join(ROOT, "paper", "paper.tex")

FIG_BLOCK = r"""
\begin{figure}[htbp]
  \centering
  \includegraphics[width=\linewidth]{../figures/fig1.pdf}
  \caption{模式形成与形态发生的信号—力学耦合。左侧为建立位置信息的三条通路，
  右侧为把位置信息落实为三维形状的力学过程，中间为已被识别的三个耦合接口。
  下方为多层级标尺：应力在各层级均存在，但数值逐级不同。}
  \label{fig:framework}
\end{figure}
"""

FIG2_BLOCK = r"""
\begin{figure}[htbp]
  \centering
  \includegraphics[width=\linewidth]{../figures/fig2.pdf}
  \caption{多层级力学链条中「应力方向感知」的断点定位。自左至右为纤维、壁、细胞、组织四级，
  每级区分已确立的分子实体与该层可测的力学量；虚线带为贯穿全链的未解接口。
  下方列出当前力学证据的来源系统——仅第一条取自茎端分生组织本体，其余均为外推。}
  \label{fig:breakpoint}
\end{figure}
"""

TAB2_BLOCK = r"""
\begin{table}[htbp]
  \centering
  \caption{力学因果证据的来源系统与外推限度}
  \label{tab:extrapolation}
  \footnotesize
  \renewcommand{\arraystretch}{1.3}
  \setlength{\tabcolsep}{4pt}
  \begin{tabularx}{\linewidth}{@{}>{\raggedright\arraybackslash}p{0.155\linewidth}
                                        >{\raggedright\arraybackslash}p{0.20\linewidth}
                                        >{\raggedright\arraybackslash}X
                                        >{\raggedright\arraybackslash}p{0.155\linewidth}@{}}
    \toprule
    \textbf{来源系统} & \textbf{物种与组织} & \textbf{关键结论} & \textbf{因果链闭合度} \\
    \midrule
    茎端分生组织本体\textsuperscript{\cite{ref@Lan@}}
      & 拟南芥，抽薹期花序分生组织（离体）
      & \textit{csld5} 垂周壁表观杨氏模量降低、尖端更尖；触觉核心响应基因下调；表皮特异异位表达可恢复内层生长
      & 强，但因果腿未解耦 \\
    侧根起始\textsuperscript{\cite{ref@Stöckle@}}
      & 拟南芥，内皮层/起始细胞
      & 面向起始细胞一侧的微管阵列有序度更高；该不对称性与 MAP70-5 为内皮层重塑所必需
      & 强 \\
    根创伤愈合\textsuperscript{\cite{ref@Hoermayer@}}
      & 拟南芥，激光创伤后的根
      & 创伤变形使扩张方向改变、微管重定向并预测分裂面；微管低张力下不稳定、受拉伸即聚合
      & 中—强 \\
    叶表皮铺砌细胞\textsuperscript{\cite{ref@Schneider@}}
      & 拟南芥，子叶表皮
      & CSC 与微管解耦后，物理扰动驱动的共对齐增强且 CSC 自质膜流失
      & 强 \\
    果蝇翅芽盘\textsuperscript{\cite{ref@Harman@}}
      & 双翅目，上皮层与其包被的 ECM
      & 上皮层与 ECM 生长各向异性的差异造成组织弯曲，该各向异性由 MMP2 控制
      & 强（跨物种） \\
    \bottomrule
  \end{tabularx}
  \begin{minipage}{\linewidth}\vspace{2pt}\footnotesize
  仅第一条在茎端分生组织本体上；其余分属不同器官、不同发育事件乃至不同类群，
  其结论向茎端分生组织的转移只能作为提示。各行力学读出彼此不可直接比较。
  \end{minipage}
\end{table}
"""


TAB_BLOCK = r"""
\begin{table}[htbp]
  \centering
  \caption{分生组织中位置信息的三种来源及其证据}
  \label{tab:positional}
  \small
  \renewcommand{\arraystretch}{1.5}
  \setlength{\tabcolsep}{5pt}
  \begin{tabularx}{\linewidth}{@{}>{\raggedright\arraybackslash}p{0.185\linewidth}
                                        >{\raggedright\arraybackslash}p{0.175\linewidth}
                                        >{\raggedright\arraybackslash}p{0.215\linewidth}
                                        >{\raggedright\arraybackslash}X@{}}
    \toprule
    \textbf{来源} & \textbf{信号/介质} & \textbf{空间图式类型} & \textbf{证据与实验系统} \\
    \midrule
    生长素的局部合成与运输 & 植物激素 & 浓度与响应梯度，划定 CZ/PZ/RM 分区
      & 同时缺失合成与运输时分区标志基因图式被扰乱\textsuperscript{\cite{ref@Yadav@}} \\
    预模式对均匀信号的读出 & 均匀生长素 + AS2--KAN1 预模式 & 二元响应（近轴/远轴身份）
      & 原基出现前数个叶间隔期即可指定极性\textsuperscript{\cite{ref@Burian@}} \\
    水通量图式 & 水通量与渗透压（物理量） & 汇强度差异造成的水分亏缺域
      & 模拟预测后经染料分配、条件稳健性与分子印记交叉验证\textsuperscript{\cite{ref@Alonso@}} \\
    \bottomrule
  \end{tabularx}
\end{table}
"""


PREAMBLE = r"""\documentclass[11pt,a4paper]{ctexart}
\usepackage[margin=2.3cm,top=2.4cm,bottom=2.4cm]{geometry}
\usepackage{graphicx}
\usepackage{booktabs}
\usepackage{tabularx}
\usepackage{amsmath}
\usepackage{setspace}
\usepackage{indentfirst}
\usepackage[super,comma,square,sort&compress]{natbib}
\usepackage{caption}
\usepackage[most]{tcolorbox}
\usepackage[hidelinks]{hyperref}

% —— 字体：中文 Noto Serif/Sans CJK SC，西文 TeX Gyre ——
\setCJKmainfont{Noto Serif CJK SC}[BoldFont=Noto Serif CJK SC Bold]
\setCJKsansfont{Noto Sans CJK SC}[BoldFont=Noto Sans CJK SC Bold]
\setmainfont{texgyretermes-regular.otf}[Path=/media/rlcao/Data/latex/2026/texmf-dist/fonts/opentype/public/tex-gyre/,BoldFont=texgyretermes-bold.otf,ItalicFont=texgyretermes-italic.otf,BoldItalicFont=texgyretermes-bolditalic.otf]
\setsansfont{texgyreheros-regular.otf}[Path=/media/rlcao/Data/latex/2026/texmf-dist/fonts/opentype/public/tex-gyre/,BoldFont=texgyreheros-bold.otf,ItalicFont=texgyreheros-italic.otf,BoldItalicFont=texgyreheros-bolditalic.otf]

\linespread{1.28}
\setlength{\parskip}{3pt}
\setlength{\parindent}{2em}
\captionsetup{labelsep=quad, font=small, skip=5pt}

\ctexset{
  section     = {format=\sffamily\bfseries\large,  beforeskip=12pt, afterskip=6pt},
  subsection  = {format=\sffamily\bfseries\normalsize, beforeskip=9pt, afterskip=4pt},
}

% —— 自定义标题区 ——
\newcommand{\papertitle}{%
  \begin{center}
    {\sffamily\bfseries\Large 茎端分生组织如何“定位置、长形状”：\par}
    \vspace{2pt}
    {\sffamily\bfseries\Large 模式形成与形态发生的信号—力学耦合\par}
    \vspace{11pt}
    {\large 曹荣麟\par}
    \vspace{4pt}
    {\small 西北农林科技大学生命科学学院，生技 2402\par}
    \vspace{6pt}
    {\small\color{gray} 植物发育生物学（魏永胜）\quad 2026 年 9 月\par}
    \vspace{9pt}
    \rule{\linewidth}{0.6pt}
  \end{center}
  \vspace{5pt}
}
\newtcolorbox{abstractbox}{colback=black!3, colframe=black!3, boxrule=0pt,
  left=9pt, right=9pt, top=8pt, bottom=8pt, arc=1.5pt, before skip=9pt}

\begin{document}
\papertitle
"""


def esc(t: str) -> str:
    """LaTeX 转义（在 markdown 转换之前调用，避免破坏命令）。"""
    rep = {
        "\\": r"\textbackslash{}",
        "&": r"\&", "%": r"\%", "$": r"\$", "#": r"\#",
        "_": r"\_", "{": r"\{", "}": r"\}", "~": r"\textasciitilde{}",
    }
    # 先占位已存在的 latex 片段（如 \textsuperscript）
    t = t.replace("→", "@ARROW@").replace("×", "@TIMES@")
    t = t.replace("α", "@ALPHA@")
    t = t.replace("℃", "@DEGC@")
    for k, v in rep.items():
        t = t.replace(k, v)
    t = (t.replace("@ARROW@", r"$\rightarrow$").replace("@TIMES@", r"$\times$")
          .replace("@DEGC@", r"$^\circ$C").replace("@ALPHA@", r"$\alpha$"))
    # 直双引号 → 中文引号（逐行交替配对）
    if '"' in t:
        parts = t.split('"')
        t = parts[0] + "".join(("\u201c" if i % 2 == 0 else "\u201d") + x
                               for i, x in enumerate(parts[1:]))
    return t


def inline(t: str) -> str:
    """行内标记：粗体、引用。"""
    t = re.sub(r"\*\*(.+?)\*\*", r"\\textbf{\1}", t)
    t = re.sub(r"(?<!\*)\*([^*\n]+)\*(?!\*)", r"\\textit{\1}", t)
    # 连续引用 [1][2] / [1-3] → \cite{ref1,ref2}
    def cit(m):
        nums = []
        for part in m.group(0).split("]["):
            part = part.strip("[]")
            if "-" in part:
                a, b = part.split("-")
                nums += list(range(int(a), int(b) + 1))
            else:
                nums.append(int(part))
        return r"\textsuperscript{\cite{" + ",".join(f"ref{n}" for n in nums) + "}}"
    t = re.sub(r"(?:\[\d+(?:-\d+)?\])+", cit, t)
    t = t.replace("@ARROW@", r"$\rightarrow$")
    return t


def main():
    raw = open(SRC, encoding="utf-8").read()
    head, refsec = raw.split("## 参考文献")

    # —— 提取元数据 / 摘要 / 关键词 ——
    body = head
    body = re.sub(r"^\*\*作者\*\*.*$\n?|^\*\*单位\*\*.*$\n?|^\*\*课程\*\*.*$\n?|^\*\*日期\*\*.*$\n?", "", body, flags=re.M)
    body = body.replace("## 摘要", "@@ABSTRACT@@").replace("**关键词**", "@@KEYWORDS@@")
    body = body.split("@@ABSTRACT@@")[1]
    abstract, rest = body.split("@@KEYWORDS@@")
    keywords, rest = rest.split("\n## ", 1)
    rest = "## " + rest

    # —— 由参考文献列表反查「第一作者姓氏 → 编号」，供表格块中的 @Key@ 占位符使用 ——
    # 这样表格引用不会因正文重编号而失效。
    author2num = {}
    for line in refsec.splitlines():
        # 姓氏可能带连字符（Alonso-Serra），只取首段
        m = re.match(r"^(\d+)\.\s+([A-ZÀ-Þ][\wÀ-ÿ]+)", line.strip())
        if m:
            author2num.setdefault(m.group(2), m.group(1))

    def lookup(key):
        """按姓氏前缀匹配，允许 Harman → Harmansa 这类简写键。"""
        if key in author2num:
            return author2num[key]
        for sur, num in author2num.items():
            if sur.startswith(key):
                return num
        return None

    for key in ("Yadav", "Burian", "Alonso", "Lan", "Stöckle", "Hoermayer",
                "Schneider", "Harman"):
        if lookup(key) is None:
            raise SystemExit(f"表格引用键 [{key}] 在参考文献列表中找不到，已中止以免生成错误 \\cite")

    def resolve(block):
        """把表格块里的 @Key@ 换成真实的 refN，避免重编号后失效。"""
        return re.sub(r"@([A-Za-zöäüé]+)@",
                      lambda m: lookup(m.group(1)) or f"@{m.group(1)}@",
                      block)

    BLK = {"FIG1": resolve(FIG_BLOCK), "FIG2": resolve(FIG2_BLOCK),
           "TAB1": resolve(TAB_BLOCK), "TAB2": resolve(TAB2_BLOCK)}
    leftover = re.search(r"@[A-Za-zöäüé]+@", BLK["TAB1"] + BLK["TAB2"])
    if leftover:
        raise SystemExit(f"表格块存在未解析的引用占位符：{leftover.group(0)}")

    # —— 正文转换 ——
    out = []
    for line in rest.splitlines():
        s = line.rstrip()
        if s.startswith("<!--FIG1-->"):
            out.append(BLK["FIG1"].strip())
        elif s.startswith("<!--FIG2-->"):
            out.append(BLK["FIG2"].strip())
        elif s.startswith("<!--TAB1-->"):
            out.append(BLK["TAB1"].strip())
        elif s.startswith("<!--TAB2-->"):
            out.append(BLK["TAB2"].strip())
        elif s.startswith("### "):
            out.append(r"\subsection{" + inline(esc(re.sub(r"^\d+(\.\d+)*\s+", "", s[4:].strip()))) + "}")
        elif s.startswith("## "):
            title = s[3:].strip()
            if title.startswith("摘要"):
                continue
            out.append(r"\section{" + inline(esc(re.sub(r"^\d+\s+", "", title))) + "}")
        elif s == "---":
            continue
        elif not s.strip():
            out.append("")
        else:
            out.append(inline(esc(s)))
    text = "\n".join(out)
    text = re.sub(r"\n{3,}", "\n\n", text)

    # —— 参考文献 ——
    items = []
    for line in refsec.splitlines():
        m = re.match(r"^(\d+)\.\s+(.*)$", line.strip())
        if m:
            items.append((int(m.group(1)), m.group(2)))
    assert len(items) >= 10, f"参考文献仅 {len(items)} 条"
    bib = []
    for n, entry in items:
        e = esc(entry)
        # 注意：re.sub 的替换串会把 \t 当制表符，故用 \\\\textit
        e = re.sub(r"\*([^*]+)\*", r"\\textit{\1}", e)
        e = re.sub(r"DOI:\s*(\S+)", r"DOI: \1", e)
        # 在期刊名（\textit{...}）前确保有且仅有一个 [J] 标识。
        # renumber_refs.py 产出的条目已自带 [J]，此处只在缺失时补，
        # 不再做"插入后折叠"——那样会把 `size[J]. [J]. ` 错并成 `size[J][J]. `。
        if "[J]" not in e.split("\\textit{")[0]:
            e = e.replace("\\textit{", "[J]. \\textit{", 1)
        e = e.replace("\\textbackslash\\textbackslash", "\\\\")
        bib.append(f"\\bibitem{{ref{n}}} {e}")
    bibtex = "\\begin{thebibliography}{99}\n\\small\n" + "\n".join(bib) + "\n\\end{thebibliography}"

    abstract_esc = inline(esc(abstract.strip()))
    kw_esc = inline(esc(keywords.strip().lstrip("：:")))
    abstract_esc = re.sub(r"\n*---+\s*$", "", abstract_esc)
    kw_esc = re.sub(r"\n*---+\s*$", "", kw_esc)

    doc = (PREAMBLE
           + "\n\\begin{abstractbox}\n"
           + "\\noindent{\\sffamily\\bfseries 摘要}\\par\\vspace{2pt}\n\n"
           + abstract_esc
           + "\n\\vspace{6pt}\n"
           + "\\noindent{\\sffamily\\bfseries 关键词}\\par\\vspace{2pt}\n\n" + kw_esc
           + "\n\\end{abstractbox}\n\n" + text
           + "\n\n" + bibtex
           + "\n\n\\end{document}\n")
    open(DST, "w", encoding="utf-8").write(doc)
    print(f"写出 {DST}  ({len(doc)} 字节, 参考文献 {len(items)} 条)")


if __name__ == "__main__":
    main()

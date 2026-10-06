#!/usr/bin/env python3
"""把 build_tex.py 的 LaTeX 模板换成 Noto 字体 + 自定义标题区 + 改进表格。"""
import io
import re

P = "scripts/build_tex.py"
s = open(P, encoding="utf-8").read()

NEW_PREAMBLE = r'''PREAMBLE = r"""\documentclass[11pt,a4paper]{ctexart}
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
\setmainfont{TeX Gyre Termes}
\setsansfont{TeX Gyre Heros}

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
"""'''

NEW_TAB = r'''TAB_BLOCK = r"""
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
      & 同时缺失合成与运输时分区标志基因图式被扰乱\textsuperscript{\cite{ref8}} \\
    预模式对均匀信号的读出 & 均匀生长素 + AS2--KAN1 预模式 & 二元响应（近轴/远轴身份）
      & 原基出现前数个叶间隔期即可指定极性\textsuperscript{\cite{ref9}} \\
    水通量图式 & 水通量与渗透压（物理量） & 汇强度差异造成的水分亏缺域
      & 模拟预测后经染料分配、条件稳健性与分子印记交叉验证\textsuperscript{\cite{ref10}} \\
    \bottomrule
  \end{tabularx}
\end{table}
"""'''


def replace_region(src, start_marker, end_marker, new_text):
    i = src.index(start_marker)
    j = src.index(end_marker, i)
    return src[:i] + new_text + src[j + len(end_marker):]


# 1) 替换 PREAMBLE 常量
s = replace_region(s, 'PREAMBLE = r"""', '"""\n\n\ndef esc', NEW_PREAMBLE + '"')

# 2) 替换 TAB_BLOCK 常量
s = replace_region(s, 'TAB_BLOCK = r"""', '"""\n\nPREAMBLE', NEW_TAB + '"')

# 3) 摘要/关键词包进浅灰底框
old_asm = (
    '           + "\\n\\\\noindent\\\\textbf{摘要}\\n\\n" + abstract_esc\n'
    '           + "\\n\\n\\\\noindent\\\\textbf{关键词}\\n\\n" + kw_esc\n'
    '           + "\\n\\n\\\\vspace{6pt}\\n\\n" + text\n'
)
new_asm = (
    '           + "\\n\\\\begin{abstractbox}\\n"\n'
    '           + "\\\\noindent{\\\\sffamily\\\\bfseries 摘要}\\par\\\\vspace{2pt}\\n\\n"\n'
    '           + abstract_esc\n'
    '           + "\\n\\\\vspace{6pt}\\n"\n'
    '           + "\\\\noindent{\\\\sffamily\\\\bfseries 关键词}\\par\\\\vspace{2pt}\\n\\n" + kw_esc\n'
    '           + "\\n\\\\end{abstractbox}\\n\\n" + text\n'
)
assert old_asm in s, "摘要组装段未匹配"
s = s.replace(old_asm, new_asm)

open(P, "w", encoding="utf-8").write(s)
print("build_tex.py 模板已重写")

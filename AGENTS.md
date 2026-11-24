# AGENTS.md

> 约束在本库（`/mnt/data/rlcao`）中工作的 agent 与脚本。
> 这里写的是**当前实测状态**，不是设计意图。与实测冲突时以实测为准，并顺手把本文改对。
> 最近核对：2026-11-14（main 分支）。

---

## 0. 任务路由

先按要做的事找到对应章节，再动手；跳过这一步最容易踩链接和备份的坑。

| 要做的事 | 先读 | 关键动作 |
|---|---|---|
| 改、移动、重命名笔记 | §3 | 先审计链接，再 `git mv` |
| 归档旧版本 | §2.2 | `git mv` + 当日 `README.md` |
| 判断备份是否正常 | §4.1 | `git check-ignore -v`，不能只看 `git status` |
| 写或改课程实验报告 | §7 | 模板字段 + 5 页版式 + 逐页验收 |
| 动 `.obsidian/` 配置 | §6 | 先确认连锁影响 |
| 新建笔记、项目、实验 | §2、§6 | 不预建空目录 |
| 改 `_posts/` | §5 | 它只是暂存副本，不是 Hexo 源 |
| 改工作台 / 首页样式 | §10 | Ant Design 令牌 + `antd-workbench` 片段 |
| 改大纲→导图插件 | §10 | 纯逻辑有单测，改完必须跑 |
| 改 `.gitignore` / 备份规则 | §11 | 跑 `vault_check.py` 验证白名单 |

---

## 1. 库的性质

| 项 | 值 |
|---|---|
| 类型 | Obsidian vault（个人知识库），**不是** Hexo 源目录 |
| 主远程 | `origin` → `cnb.cool/crl-code/obsidian-notes` |
| 副远程 | `github` → `github.com/caoronglin/rlcao-notes.git` |
| 分支 | `main`；另有回滚点分支 `backup/pre-pdf-cleanup-main` |
| 自动备份 | obsidian-git，提交信息固定为 `vault backup: <时间戳>` |

组织方法为 PARA（Projects / Areas / Resources / Archives），2026-10-05 起执行。
方法论来源：<https://forum-zh.obsidian.md/t/topic/48042>

---

## 2. 目录与归档

```
inbox.md          PARA 的「收件箱」，是文件不是目录
notes/            课程与考试素材：讲义扫描、教材 OCR、文献、课程实验原始输出
wiki/             自撰知识库，章节化，每册带 index.md
_posts/           Hexo 博客文章暂存副本
vault/            项目、实验记录、方法、文献笔记、大纲笔记、系统与工具、日记
muban/            模板（Templater / QuickAdd / Zotero 导入）
panel/            首页组件（hero、操作台、洞察镜、快捷入口）
assets/           全部附件落盘位置（gitignore）
4-存档/YYYY-MM-DD/ 被取代的版本，按日期归档
```

### 2.1 `notes` / `wiki` / `_posts` 是三个独立项目

这三个目录各自独立，**不合并、不互相搬运、不共享目录结构变更**。

| 项目 | 性质 | 硬约束 |
|---|---|---|
| notes | 课程与考试素材库 | 归档课表属他人成果，保持扫描原貌 |
| wiki | 自撰知识库 | 已发布结构，链接与 `index.md` 导航是一等公民 |
| _posts | Hexo 文章暂存 | 见 §5 |

共同点只有一套命名与 frontmatter 规范（PARA §3.2）。

`wiki/` 与 `notes/` 下存在大量同名 md，这是有意为之：

```
notes/class-notes/分子生物学/第0N章 *.md                    ← 主教材（高教社，第 6 版）
notes/class-notes/分子生物学/笔记和课后习题详解/第0N章 *.md  ← 教辅（中国石化，第 5 版）
```

两本书章节序不同（「疾病与人类健康」在教辅是第 9 章、主教材是第 11 章），**不要合并**。

### 2.2 归档纪律

- 归档是**移动**，不是删除：一律 `git mv` 进 `4-存档/<日期>/`；PDF 被 gitignore 时用普通 `mv`。
- 每次归档写 `README.md`，逐条记录：原位置、被谁取代、取代理由。
- **有实内容的目录不因体量小而归档**。判据是「是否沉淀物」，不是大小。
- 现有索引：`4-存档/2026-10-05/README.md`、`4-存档/2026-10-27/README.md`。

### 2.3 不预建空目录

PARA §3.3：永远不要在为内容找到用途之前创建空文件夹。预想出来的「领域 / 资源」目录会让后来者反复扑空。

---

## 3. 链接规则

### 3.1 Obsidian 的链接语义

- Obsidian 按**文件名（basename）**解析 `[[链接]]`，不是按路径。
- `app.json` 中 `newLinkFormat = "absolute"`，本库约定**写相对库根的全路径**：

```
✅ [[notes/class-notes/分子生物学/第01章 绪论|第01章 绪论]]
❌ [[第01章 绪论]]        ← 全库有同名文件，指向不确定
```

- 同文件夹内的短链接合法且无歧义，Obsidian 同目录优先级最高。

### 3.2 同名文件必须显式消歧

移动或新建文件后，若库内已有同名文件，把指向它的链接改成全路径限定，否则链接指向哪一本不确定。
2026-10-05 已完成两处消歧：`notes/class-notes/分子生物学/_index.md`（11 条）、同目录下 `笔记和课后习题详解/_index.md`（11 条）。

### 3.3 改名前必须审计链接

审计脚本要同时处理五种情况，否则误报率很高（2026-10-05 实测：朴素写法误报超过 60%）：

1. 围栏代码块 —— 逐行开关，不能用 `re.sub(r'```.*?```')`，围栏不配对时会整体错位
2. 行内代码 `` `...` `` —— Obsidian 不解析其中的链接
3. `[[目标|别名]]` —— 只匹配裸形式会漏
4. 路径后缀解析 —— `[[答题/01_宏观认知.html]]` 靠路径尾部匹配
5. 标题锚点 —— 先剥 `#` 再判存在；剥空说明是 `[[#本章小节]]`（指向本文件标题），必须跳过

```bash
python3 - <<'PY'
import re,io,os
from collections import Counter
mds=[];allp=[]
for r,d,f in os.walk('.'):
    if any(x in r for x in ['.git','.obsidian','.trash']): continue
    for n in f:
        p=os.path.normpath(os.path.join(r,n)); allp.append(p)
        if n.endswith('.md'): mds.append(p)
STEM={os.path.basename(p)[:-3] for p in allp if p.endswith('.md')}
PATH=set(allp); PATH_NOMD={p[:-3] for p in allp if p.endswith('.md')}
DIRS={os.path.normpath(os.path.join(r,n)) for r,d,f in os.walk('.')
      if not any(x in r for x in ['.git','.obsidian','.trash']) for n in d}
def strip_code(s):
    out=[];inf=False
    for ln in s.split('\n'):
        if ln.lstrip().startswith('```'): inf=not inf; out.append(''); continue
        out.append('' if inf else ln)
    return re.sub(r'`[^`\n]*`','','\n'.join(out))
def ok(b,d):
    b=b.strip(); nb=os.path.normpath(os.path.join(d,b)) if b else b
    if b.endswith('/'):
        t=b.strip('/'); return any(x==t or x.endswith('/'+t) for x in DIRS)
    if b in STEM or b in PATH or b in PATH_NOMD: return True
    if nb in PATH or nb in PATH_NOMD: return True
    return any(p==b or p.endswith('/'+b) for p in PATH)
bad=[]
for p in mds:
    s=strip_code(io.open(p,encoding='utf-8',errors='ignore').read()); d=os.path.dirname(p)
    for raw in re.findall(r'\[\[([^\]]+)\]\]',s):
        base = raw.split('|')[0].partition('#')[0].strip()
        if not base: continue
        if base.startswith('<%') or base.startswith('http'): continue
        if not ok(base,d): bad.append((p,base))
print('md %d ｜ 悬空 %d'%(len(mds),len(bad)))
for (p,b),n in Counter(bad).items(): print('  [[%s]] ×%d  <- %s'%(b,n,p))
PY
```

### 3.4 移动文件用 `git mv`

保留历史。`git mv` 不会自动创建目标父目录，先 `mkdir -p`。

---

## 4. 版本控制与备份

### 4.1 静默失效是头号风险

2026-10-05 之前，`.gitignore` 排除了 `assets/`、`日记/`、`panel/`、`项目/`，而 obsidian-git 每天照常提交 `vault backup:`。备份看起来正常，这些内容却从未进过仓库：

- `vault/日记/`、`vault/项目/` 历史上 0 次提交
- `panel/`、`assets/` 曾被跟踪，在 `609a19f`「目录扁平化」时被顺带排除
- `Home.md` 依赖 `panel/hero.md`，hero 又引用 `assets/workbench-hero.avif`，换机重克隆必现坏链

**只看 `git status` 干净不能说明备份正常**，必须显式检查：

```bash
git check-ignore -v <path>                                # 该跟踪的是否真被跟踪
git check-ignore -v notes/bio/生信学习/单细胞/笔记/my_data/covid_cite.h5ad
```

### 4.2 应当排除的内容（勿放行）

`.obsidian/plugins/*/data.json` 等插件设置（可能含绝对路径与密钥）、`.obsidian/workspace*.json`（本机窗口状态）、`*.pdf`、`*.h5ad`、`*.zip`、`*.docx`、`*.fa`、`__pycache__/`、`.lamindb/`。

**2026-11-14 改**：`.obsidian/` 不再是整目录排除，而是白名单——只放行「没它笔记就跑不起来」的 8 个 json、`snippets/` 与自研插件 `plugins/xl-toolbox/`。此前整目录排除的后果是：换机重克隆后主题、快捷键、片段、模板设置全部丢失，而 `vault backup:` 提交看起来一切正常。校验入口：`python3 scripts/ci/vault_check.py`（「配置已纳入版本控制」一项）。

### 4.3 破坏性操作前留回滚点

```bash
git tag pre-<动作>-$(date +%F)
find . -type f -not -path './.git/*' > /tmp/files-before.txt
```

已知回滚点：`pre-PARA-2026-10-05` → `b85d50a`。

---

## 5. Hexo 约束（`_posts/`）

- 本库不是 Hexo 源目录：库根没有 `_config.yml`、没有 `package.json`。`_posts/` 只是博客文章的暂存副本，Hexo 工程在库外。
- 因此改 `_posts/` 的 `date` 不影响线上 permalink。
- 文章 schema 参照 `hexo.md` / `R2img.md`：`title` / `date`（带时区 ISO）/ `categories`（二级列表）/ `tags` / 可选 `abbrlink` `banner` `excerpt`。
- 不要臆造 `excerpt` 正文，那是内容，会变成编造。

---

## 6. Obsidian 配置契约

`.obsidian/` 只部分入库（见 §4.2 白名单），下列设置是承重结构，改动会连锁：

| 配置项 | 值 | 影响面 |
|---|---|---|
| `templates.json` → `folder` | `muban` | 所有 Templater / 模板路径 |
| `daily-notes.json` → `folder` | `vault/日记` | 每日笔记落盘位置 |
| `daily-notes.json` → `template` | `muban/daily-note-template.md` | 日记模板 |
| `app.json` → `attachmentFolderPath` | `assets` | 全部附件落盘 |
| `app.json` → `newLinkFormat` | `absolute` | 见 §3.1 |
| `Home.md` → `cssclasses` | `knowledge-home` | `.obsidian/snippets/antd-workbench.css`，仅首页生效 |
| `appearance.json` → `accentColor` | `#1677ff` | Ant Design 主色，全库强调色 |
| `appearance.json` → `baseFontSize` | `17` | 界面与正文基准字号 |
| `hotkeys.json` | `Ctrl+Alt+M` 导图 / `Ctrl+Alt+S` 导出 SVG | 绑定自研插件 `xl-toolbox` |
| `hotkeys.json` | `Ctrl+Alt+Z` 导入文献 / `Ctrl+Alt+C` 插入引用 | 绑定 Zotero Integration |
| `panel/hero.md` | 顶栏 + 统计卡 + 近 7 天节奏 | 依赖每日笔记命令、QuickAdd、Dataview |

`Home.md` 只做 4 个嵌入，没有标题层级：`![[panel/hero]]`、`![[panel/操作台]]`、`![[panel/洞察镜]]`、`![[panel/快捷入口]]`，全部是 `dataviewjs`，依赖 dataview 插件与 `moment`。待办按今日日记、状态为 `进行中` 的项目/实验、历史清单分组；日记中的“明日计划”不提前计入今天。历史清单只在首页折叠，不修改原笔记或项目状态。

视觉规范见 §10。启动行为由 Homepage 插件负责（打开 `Home.md`、阅读视图、固定标签），因此 `app.json` 里**不要**再设 `openBehavior`，否则两个入口会各开一个标签。

---

## 7. 课程实验报告（`notes/生信实验/`）

课程实验的原始输出留在 `notes/生信实验/<课次>/`，知识沉淀进 `vault/`，两边不互相搬文件。

### 7.1 目录与产物

```
notes/生信实验/NN/
├── 生物信息学实验报告_N_姓名_学号.md     正文（入库）
├── 同名 .html                            固定页数版式源（入库）
├── 同名 .pdf                             提交件（gitignore，见 §4.2）
├── fig_*.png / fig_*.svg                 报告插图与矢量源
├── image-*.png                           数据库截图等原始证据
├── data/                                 数据表 + 作图配置
├── charts/                               可交互图（ECharts HTML）
└── records/                              GenBank / gene_table / UniProt / PubMed 原始记录
```

报告文件名格式固定：`生物信息学实验报告_N_姓名_学号.pdf`。

### 7.2 报告结构与模板

课程模板（WPS 排版）的字段要照抄，不要省：

- 标题：`实验N： <题目>`
- 抬头三行：`姓名／班级／学号`、`实验掌握情况：…`、`你的疑问（最多 3 条）：见讨论区`
- 正文顺序：`前情提要：`（研究分子 + 目前结果）→ `实验目的：` → `实验任务一： …`（每任务下 `实验材料／实验方法／实验结果`）→ `现有知识总结` → `讨论`
- 文末把 3 条疑问单列成 `你的疑问（最多 3 条）`

### 7.3 版式契约

- **5 页 A4 以内**，不得靠缩字号凑页数。正文 10 pt，行距 1.6，页边距 15 mm。
- 字体：正文宋体（本机用 Noto Serif CJK SC），西文与数字 Times New Roman，标题用雅黑粗体（Noto Sans CJK SC Bold）。
- **全文黑色**，取消蓝色强调、彩色链接、灰色页眉页脚；页码居中。
- 表格一律**三线表**：顶线 1.2 pt、表头下线 0.6 pt、底线 1.2 pt，无竖线。
- 图注写「图 N　…」，表注写「表 N　…」；图内不要再放大标题，避免与图注重复、也避免标注互相压字。
- 插图用 SVG（宽 1000 px）画好后无头 Chrome 3× 截图；`.svg` 源与 `.png` 一起留在课次目录，便于改字而非重画。

### 7.4 生成与验收

```bash
google-chrome --headless=new --no-sandbox --disable-gpu \
  --no-pdf-header-footer --print-to-pdf="报告.pdf" \
  --virtual-time-budget=5000 "file://$PWD/报告.html"

pdfinfo 报告.pdf | grep Pages          # 必须 5
pdftoppm -png -r 90 报告.pdf /tmp/p    # 逐页看图
pdftotext -f N -l N -layout 报告.pdf - | tail -c 100   # 每页末句是否完整
```

`.page` 容器固定 210×297 mm 并设了 `overflow: hidden`，溢出会被**静默裁掉**，所以必须逐页核对末句；页脚用绝对定位，内容区底部至少留 12 mm。

### 7.5 内容准确性清单

- 坐标：`esummary.genomicinfo` 是 **0-based**；Gene Viewer、`gene_table`、Datasets API 是 **1-based**。混用会整体差 1 bp。
- 长度：`NM_001111711.1` 的 1,787 nt = 14 个外显子 1,766 nt + 3′ 端 21 nt；但序列末端的连续 A 实为 **23 nt（1,765–1,787）**，尾巴边界取决于外显子注释，不能写成「正好 21 个 A」。
- 多聚腺苷酸化信号：典型 `AATAAA` 距切割位点 10–30 nt。若候选位点距 poly(A) 尾 474 nt 且在 CDS 内，应判为「很可能不是功能信号」，不要直接当答案。
- 复合体组成：FIE 就是植物中的 EED 同源物，**不能**再与 EED 并列为两个亚基；植物 PRC2 写作 E(z)、FIE、MSI1 + SUZ12 类蛋白（FIS2/VRN2）。
- 登录号会回收复用，必须同时记 version 与 title（如 `NP_005623` → calpain-15、`NM_003001` → SDHC）。
- 数据库结论要带检索日期；检索命中数不等于「这个基因有 N 篇文献」。
- 图注只描述图能支持的内容；矩阵类图要写清实心/空心含义，并说明它表示「是否涉及」而非证据强弱。

### 7.6 其他产物契约

| 产物 | 位置 | 契约 |
|---|---|---|
| 实验记录 | `vault/实验记录/<日期-时间>-<标题>.md` | QuickAdd `experiment-record-template.md`；`type: experiment`、`status`、`project` 填完整笔记链接 |
| 项目概览 | `vault/项目/<项目名>/<项目名>-项目概览.md` | `project-dashboard-template.md`；`type: project` |
| 方法沉淀 | `vault/方法/生信分析/NN_<主题>.md` | `bio-note-template.md`；`tags: [生信, bio/pipeline]` |
| 大纲 | `vault/大纲笔记/<主题>.md` | `outline-note-template.md`；标题 + 缩进列表，Ctrl+Alt+M 出导图 |
| 文献 | `vault/文献笔记/<作者 年份 主题>.md` | `zotero-literature-template.md`；手写条目 `zotero:` 留空并声明非导入产物 |
| 独立数据表 | `vault/工作台/*.duowei` | Duowei 插件 JSON；`records[].values` 按 `field.id`，`singleSelect` 存 `option.id` |

---

## 8. 反例黑名单

1. 不 `ls` 就按记忆或历史结论动手 —— 目录变更过多次（`609a19f` 把 `notes/` `muban/` `panel/` 从 `vault/` 移回库根）
2. 只看 `git status` 干净就判定备份正常
3. 把 `notes/class-notes/分子生物学/` 两层当重复内容合并 —— 那是两本不同的书
4. 用短链接指向同名文件
5. 用 `rm -rf` 代替 `git mv` 做归档
6. 预建空的领域 / 资源目录
7. 因目录「体量小」就归档
8. 移动 `covid_cite.h5ad` —— 它是 `AnnData.ipynb` 的活数据，且已被 gitignore
9. 在 Obsidian 运行时编辑 `.obsidian/` 下的 leveldb（会被覆盖）
10. 瘦身前不做物理备份、不用 `git mv` 逐文件恢复
11. 为凑页数把报告字号调到 9 pt 以下或把插图压到看不清
12. 手改导出的 PNG 而不改 `.svg` 源
13. 在 Obsidian 运行时大改 `.obsidian/*.json` 就宣布完成 —— 不重启会被内存状态覆盖
14. 把插件二进制包提交进仓库 —— 下架插件备份到 `/mnt/data/_backup/`，仓库只留文本
15. 直接 `rm -rf` 插件目录 —— 先整包备份，再改 `community-plugins.json`
16. 在 `app.json` 里同时设 `openBehavior` 与 Homepage 插件 —— 启动会开两个标签

---

## 9. 维护、遗留与变更

### 9.1 每周维护（约 5 分钟）

1. 给 `inbox.md` 里的新条目起可检索的名字
2. 归入正确的项目 / 领域 / 资源
3. 更新活跃项目；完成或搁置的项目移入 `4-存档/`

### 9.2 已知遗留

| # | 事项 | 说明 |
|---|---|---|
| 1 | `muban/` 内 4 条模板占位链接**故意保留** | `[[status/to_read]]` ×3、`[[{{annotation.imageRelativePath}}]]` ×1（Templater 变量）。链接语法本身是模板目的。除此之外全库悬空链接为 0 |
| 2 | lamindb 实例已失效 | `notes/bio/生信学习/单细胞/笔记/my_data/.lamindb/` 记录的是 Windows 路径 `D:/data/rlcao/...`，当前为 Linux |
| 3 | Zotero 工作流已接通（2026-10-16，2026-11-14 复验） | Zotero Integration 3.2.1 + Better BibTeX 9.0.77；本地 API `localhost:23119/api` 与 BBT JSON-RPC 均已实测可用，批注解析器已装到 `~/.local/share/obsidian-tools/pdfannots2json-linux-x64`。模板 `muban/zotero-literature-template.md`，笔记在 `vault/文献笔记` |
| 4 | `notes/class-notes/遗传学/` 命名不当 | 530 个文件中 526 个是 jpg、仅 2 个 md，实为扫描档案；第 2、4 章未转录 |
| 5 | `wiki/c/chapter6.md` 有 20 处 C 宏被误转成 wikilink | 均在代码块内，渲染无害；标题行 2 处已修为行内代码 |
| 6 | `_posts` 4 篇的 date 取自 git 首次提交日 | 未经作者确认真实发表日期 |
| 7 | `vault/文献笔记/Hermon 2007 maize Fie1 基因印记.md` 的 `zotero:` 为空 | 手工整理条目，非 Zotero 导入；需要批注时用 Ctrl+Alt+Z 重新导入回填，不要手编假 key |
| 8 | 课程实验报告的 PDF 不入库 | `.gitignore` 排除 `*.pdf`；换机重克隆后需从 `notes/生信实验/*/` 重新导出，md 与 html 已入库 |

### 9.3 变更记录

- **2026-11-14** 工作台、插件、配置、备份链路一次性收口：
  - 工作台按 Ant Design 规范重写（`panel/` 四个组件 + `antd-workbench.css`），主色统一 `#1677ff`，基准字号 22 → 17。
  - 社区插件 17 → 11：下架 Better Export PDF、Various Complements、Calendar、Advanced Tables、Image Toolkit、HTML Studio、Mindmap NextGen，整包备份到 `/mnt/data/_backup/obsidian-plugins-archive-2026-11-14/`；Duowei 因 `独立工作表.duowei` 里是真实实验记录而保留。
  - 自研插件 `xl-toolbox` 落地，替代 Mindmap NextGen：标题/缩进列表 → 导图，节点跳原文、折叠、缩放、导出 SVG/PNG；纯逻辑 11 条单测（`node .obsidian/plugins/xl-toolbox/test/core.test.cjs`）。
  - `.gitignore` 的 `.obsidian/` 由整目录排除改为白名单，配置与自研插件入库 —— 此前换机重克隆必然丢主题、快捷键、片段、模板。
  - 新增 `scripts/ci/vault_check.py` 与 `.cnb.yml`：推送/PR 时跑链接、frontmatter、JSON、体积、配置入库五项检查；顺带修掉表格内 `[[目标\|别名]]` 被误判悬空的解析 bug（31 处误报 → 0）。
  - Zotero 复验：本地 API 与 BBT JSON-RPC 可用，补装 `pdfannots2json-linux-x64`（批注转图依赖，此前目录不存在）。
  - 新增 `.gitattributes` 钉死换行；git 本地配置补齐 `quotepath` / `push.default` / `rerere` / `remote.pushDefault`。

- **2026-11-06（晚）** 实验二、三补入 NCBI 检索证据图：实验二新增 `fig_entrez_search.svg/.png`（E-utilities 的 esearch/elink/esummary 原始输出，由 `02/scripts/make_entrez_figure.py` 生成）；实验三新增 `03/shot-ncbi-blastn.avif`（NCBI BLAST 网页版结果页截图，RID `EVDGFU20016`，blastn/megablast、`core_nt` 限 `Viridiplantae[Organism]`，52 条命中，前 5 条含 `AY195850.2`（标题含 type 2，不能仅凭此认定为 FIE2））。两份报告仍为 5 页；为此收紧段距（p 1.0→0.85 mm、表 1.8→1.5 mm、图 1.6→1.3 mm）并压缩若干段落。
  **踩坑**：本机无头 Chrome 访问 `www.ncbi.nlm.nih.gov/{nuccore,gene,assembly,books}` 一律返回 reCAPTCHA 挑战页（等待 45 s 后升级为图片验证码），拿不到 Entrez 网页截图；`blast.ncbi.nlm.nih.gov` 与 `www.ncbi.nlm.nih.gov/` 首页不受影响。该现象仅针对当时无头 Chrome；同日可见浏览器成功获取 Nucleotide 搜索页面截图。E-utilities 渲染图应标明是 API 记录，不能冒充网页截图。
- **2026-11-06** 实验二、三的研究分子统一到玉米 `ZmFIE1`：实验二 1.3 改为 5 条 FIE1 直系 + 5 条 FIE2 并系（跨禾本科补齐），10 组 EMBOSS 比对；实验三重跑 BLASTN/BLASTP/PSI/DELTA/翻译搜索，核酸库改为 11 个植物物种 Ensembl Plants cDNA + FIE 家族（652,197 条），蛋白库 576,022 条；报告改为 WeasyPrint 排版，02、03 均为 5 页。
- **2026-10-30** 实验一报告按课程模板重排：宋体 + Times + 雅黑、全文黑、5 页、三线表；重绘转录本结构图与文献证据矩阵；修正 FIE/EED 亚基表述、poly(A) 信号判读、文献计数口径。
- **2026-10-27** 生信实验入库方式定稿；记录 0-based/1-based、1787=1766+21、登录号复用三条事实。
- **2026-10-16** `vault/` 下确立项目、实验记录、方法、文献、大纲、系统与工具的落盘位置。
- **2026-10-05** 完成 PARA 整理、链接消歧与 `.gitignore` 修复。

---

## 10. 个人工作台与自研插件

### 10.1 视觉规范（Ant Design）

取值全部来自 ant.design 的 spec 页，改样式时照抄，不要自创：

| 令牌 | 值 | 说明 |
|---|---|---|
| 主色 | `#1677ff` | 全库强调色（`appearance.json` 的 `accentColor`） |
| 辅色 | `#52c41a` / `#fa8c16` / `#722ed1` | 分别用于实验、文献、大纲三张统计卡 |
| 文字 | `--text-normal` / `--text-muted` / `--text-faint` | 一级 / 二级 / 三级，不在浅底上用 -6 字阶写小字 |
| 圆角 | 8px（卡片）/ 6px（按钮、输入） | |
| 间距 | 8 的倍数：8 / 16 / 24 | 卡片内边距 24，卡片间距 16–24 |
| 字号 | 12 / 13 / 14 / 20 / 24 | 正文 13–14，卡片标题 14，问候语 24 |
| 阴影 | `0 1px 2px rgba(0,0,0,.03), 0 2px 8px rgba(0,0,0,.04)` | 只在 hover 时加 |

实现文件：`.obsidian/snippets/antd-workbench.css`（唯一首页样式，其余旧片段已归档到 `4-存档/2026-11-14/`）。

### 10.2 首页结构

```
Home.md (cssclasses: knowledge-home)
├── ![[panel/hero]]      顶栏（问候 + 6 个主操作）+ 4 张统计卡 + 最近 7 天节奏条
├── ![[panel/操作台]]    今日计划（带完成度）/ 进行中项目与实验 / 历史折叠
├── ![[panel/洞察镜]]    正在推进 / 最近实验 / 接着上次的记录 / 待确认状态折叠
└── ![[panel/快捷入口]]  学习 · 科研 · 管理 三栏入口
```

约束：

- **组件样式只挂 `.wf-root`，不要挂 `cssclasses: knowledge-home`**。`knowledge-home` 在阅读视图才有；实时预览里外层没有这个 class，规则全部失效，工作台会退化成竖排纯文本（2026-11-16 踩过，需要用户截图才发现）。`.wf-root` 由 panel 的 dataviewjs 自己创建，三种场景都在。
- 页面级规则（宽度、去嵌入外壳）用 `.markdown-embed:has(.wf-root)`、`.cm-embed-block:has(.wf-root)` 这类 `:has()` 选择器，不依赖视图模式。
- 每个 panel 只有一个 `dataviewjs` 代码块，输出统一用 `wf-*` 类名；不要写内联 `style` 颜色，走 `--wf-accent` 变量。
- 首页**不写 H1/H2**，卡片标题由 panel 自己渲染（`wf-section-title`），这样嵌入块不会多出一层标题。
- 首页必须**阅读视图**打开（Homepage 插件负责）；`knowledge-home` 下的 embed 外壳在 CSS 里被完全去壳，改 CSS 时别把 `.markdown-embed` 的 padding 加回来。
- 勾选任务会写回原笔记（Dataview 的 taskList），首页只读不改项目状态。**不要**在 panel 里自动把项目标成完成。

### 10.3 自研插件 `xl-toolbox`

用途：把大纲/标题笔记渲染成思维导图，替代已下架的 Mindmap NextGen。

```
.obsidian/plugins/xl-toolbox/
├── manifest.json      id: xl-toolbox
├── main.js            单文件 CJS，无构建步骤（Obsidian 直接 require）
├── styles.css         视图样式，颜色取 --text-* 与 Ant Design 色板
└── test/core.test.cjs 纯逻辑单测
```

代码分层：`main.js` 里 `pure-core-start` 与 `pure-core-end` 两个注释之间是**不依赖 Obsidian API** 的纯函数（解析、换行、布局、SVG 生成），单测用正则把这整段抠出来在 node 里跑。改逻辑时保持这条边界，否则单测失效。

```bash
node .obsidian/plugins/xl-toolbox/test/core.test.cjs   # 必须 11 passed
```

关键约束：

- **布局与导出必须同一套字号**。`xlLayout` 把 `fontSize / lineH / padX / padY` 记进 `state.meta`，`xlBuildSvg` 从 meta 取；两边不一致会导致导出 SVG 文字溢出卡片（踩过一次）。
- 文本宽度用 canvas `measureText` 实测，换行按字符贪心切分，最多 6 行，超出以 `…` 结尾。
- 文首 H1 与根节点合并，避免「文件名 → 同名 H1」重复一层。
- 列表缩进必须**先回退到正确父级再挂载**；顺序反了会把同级条目挂成上一条的子节点（踩过一次）。
- 表格里的 wikilink 别名写成 `[[目标\|别名]]`，解析时要先把 `\|` 还原再切分。
- 导图只读 Markdown，不回写笔记；节点点击只做 `editor.setCursor` + `scrollIntoView`。

功能对照（相对 NextGen）：保留标题+列表解析、折叠、缩放、导出；新增节点跳原文、折到 N 层、导出 PNG；**不提供** 拖拽编辑导图（要自由布局用 Canvas）。

### 10.4 调试

桌面端 `Ctrl+Shift+I` 打开 DevTools。插件报错看 Console；改了 `main.js` 需要在「设置 → 第三方插件」里关掉再打开，或 `Ctrl+R` 重载界面。

---

## 11. CNB 仓库与自检

### 11.1 远程与凭据

| 远程 | 地址 | 角色 |
|---|---|---|
| `origin` | `https://cnb.cool/crl-code/obsidian-notes` | 主远程，推送目标 |
| `github` | `https://github.com/caoronglin/rlcao-notes.git` | 镜像，手动推 |

- CNB 凭据在 `~/.config/git/credentials-cnb`（`credential.https://cnb.cool.helper = store --file=...`），凭据文件不进仓库。
- 本地 git 配置：`core.quotepath=false`（中文文件名可读）、`core.autocrlf=input`、`push.default=current`、`fetch.prune=true`、`rerere.enabled=true`、`merge.conflictstyle=zdiff3`、`remote.pushDefault=origin`。
- 换行由 `.gitattributes` 钉死（`* text=auto eol=lf`，二进制显式 `binary`），避免 Linux/Windows 之间整库 diff 抖动。

### 11.2 库结构自检

```bash
python3 scripts/ci/vault_check.py           # 本地全量
python3 scripts/ci/vault_check.py --strict  # 悬空链接零容忍（CI 用）
```

检查四项 + 一项守卫：

1. 悬空 wikilink（处理围栏代码块、行内代码、别名、标题锚点、路径尾部匹配、表格内 `\|` 转义）
2. frontmatter 可解析（未闭合、Tab 缩进、无法解析的行）
3. `.obsidian` 白名单里的 JSON 可解析
4. **入库文件**体积阈值（md 5 MB / 其他 20 MB）——只看 `git ls-files`，被 gitignore 的大数据不算
5. 守卫：白名单里的配置文件「在磁盘上但没进 git」直接判失败，专治 §4.1 的静默失效

`.cnb.yml` 在 `push` 与 `pull_request` 上各跑一次，容器 `python:3.12`（带 git），与本地同一份脚本。

### 11.3 已知坑

- 无头 Chrome / Linux 端**看不到** Obsidian 进程，但文件确实在被它改：本库通过共享盘在 Windows 上的 Obsidian 里打开，obsidian-git 每 15 分钟自动提交一次 `vault backup:`。在 Linux 改 `.obsidian/*.json` 后，Obsidian 若不重启，其内存里的旧配置可能覆盖磁盘；**改完配置要重启 Obsidian 再验证**。
- 插件包（`main.js` 动辄几 MB）不进仓库；下架插件时备份到库外 `/mnt/data/_backup/`。

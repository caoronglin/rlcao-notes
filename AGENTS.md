# AGENTS.md

> 本文件是 `/media/rlcao/Data/data/05-个人项目/rlcao` 这个 **Obsidian 个人知识库**对自动化代理（agent / 脚本）的行为约束。
> 文中每条事实均经实测核实。**若与本文描述不符，以实测为准，并同步更新本文。**

---

## 0. 库的性质

| 项 | 值 |
|---|---|
| 类型 | Obsidian vault（个人知识库），**不是** Hexo 源目录 |
| 库根 | `/media/rlcao/Data/data/05-个人项目/rlcao` |
| 主远程 | `origin` → `cnb.cool/crl-code/obsidian-notes` |
| 副远程 | `github` → `github.com/caoronglin/rlcao-notes.git` |
| 分支 | `main`（活跃）、`backup/pre-pdf-cleanup-main` |
| 自动备份 | obsidian-git，提交信息固定为 `vault backup: <时间戳>` |

组织方法为 **PARA**（Projects / Areas / Resources / Archives），2026-10-05 起按此整理。
方法论来源：<https://forum-zh.obsidian.md/t/topic/48042>

---

## 1. 最高约束：`notes` / `wiki` / `_posts` 是三个独立项目

**这三个目录各自是独立项目，彼此不合并、不互相搬运文件、不共享目录结构变更。**

| 项目 | 目录 | 性质 | 硬约束 |
|---|---|---|---|
| notes | `notes/` | 课程与考试素材库（讲义扫描、教材 OCR、文献） | 归档课表属**他人成果**，保持扫描原貌 |
| wiki | `wiki/` | 自撰知识库（章节化，每册带 `index.md`） | 已发布结构，**链接与 `index.md` 导航是一等公民** |
| post | `_posts/` | Hexo 博客文章暂存副本 | 见 §5 Hexo 约束 |

三者的共同点仅限**遵循同一套命名与 frontmatter 规范**（PARA §3.2「跨平台复制相同结构」）。

### 1.1 已知的、必须保持的同名文件

`wiki/` 与 `notes/` 下**存在大量同名 md，这是有意为之，不是冗余**：

```
notes/class-notes/分子生物学/第0N章 *.md          ← 《现代分子生物学》第 6 版主教材（高教社 2025）
notes/class-notes/分子生物学/笔记和课后习题详解/第0N章 *.md  ← 第 5 版配套教辅（中国石化 2019）
```

两本书**章节序不同**（教辅把「疾病与人类健康」置于第 9 章，主教材置于第 11 章）。
**绝对不要"合并"它们** —— 详见 §3.2。

---

## 2. PARA 目录约定

```
0-收件箱   → inbox.md（文件，非目录；未建目录，因 PARA §3.3 禁止预建空目录）
1-项目     → vault/项目/  +  notes/、wiki/、_posts/ 各自内部的项目
2-领域     → 不预建，等有内容时再建
3-资源     → 不预建，等有内容时再建
4-存档     → 4-存档/YYYY-MM-DD/，每次整理建一个日期子目录并写 README.md
```

**PARA §3.3：永远不要在需要存放内容前创建空文件夹。**
被预想出来的领域/资源文件夹会让后来者反复扑空，收益为负。

### 2.1 归档纪律

- 归档 = **移动**，不是删除。被取代的版本一律 `git mv` 进 `4-存档/<日期>/`。
- 每次归档必须写 `README.md`，逐条记录：原位置、被谁取代、取代理由。
- **有实内容的目录不因体量小而归档**。判据是"是否沉淀物"，不是"是否够大"。
- 现有归档索引：`4-存档/2026-10-05/README.md`

---

## 3. 链接规则（最容易踩坑的一节）

### 3.1 Obsidian 的链接语义

- Obsidian 按**文件名（basename）**解析 `[[链接]]`，**不是**按路径。
- `app.json` 中 `newLinkFormat = "absolute"` → 本库约定**使用相对库根的全路径**：
  ```
  ✅ [[notes/class-notes/分子生物学/第01章 绪论|第01章 绪论]]
  ❌ [[第01章 绪论]]          ← 全库有同名文件，指向不确定
  ```
- 同文件夹内的短链接（`[[第1课-2026-06-17]]`）合法且无歧义，Obsidian 同目录优先级最高。

### 3.2 同名文件的歧义必须显式消解

移动或新建文件后，**若库内已存在同名文件，必须把指向它的链接改成全路径限定**，否则链接指向哪本是不确定的。

2026-10-05 已对以下两处完成消歧：
- `notes/class-notes/分子生物学/_index.md`（11 条）
- `notes/class-notes/分子生物学/笔记和课后习题详解/_index.md`（11 条）

### 3.3 改名前必须审计链接

审计脚本必须同时处理**五种情况**，否则会大量误报（2026-10-05 实测：朴素写法误报率超过 60%）：

1. 围栏代码块 —— 用逐行开关，不能用 `re.sub(r'```.*?```')`（围栏不配对时会整体错位）
2. 行内代码 `` `...` `` —— Obsidian 不解析其中的链接
3. `[[目标|别名]]` 的别名式写法 —— 只匹配裸形式会漏
4. 路径后缀解析 —— `[[答题/01_宏观认知.html]]` 由 Obsidian 按路径尾部匹配到 `notes/考证/.../答题/01_宏观认知.html`
5. **标题锚点必须先剥掉再判存在性，且剥空要跳过** —— `[[notes/.../01-范式.md#精读 1 · X 2020]]` 的目标是文件，`#` 之后只是滚动位置；不剥锚点会把整条当悬空（2026-10-23 实测：`结构生物学/AI结构预测/` 的 32 条锚点链接全部被误报）。但 `[[#本章小节]]` 指向**当前文件内的标题**，Obsidian 合法，剥锚点后 base 为空串必须 `continue`，否则反被误报（同日实测踩到）。剥完锚点确认文件存在后，可再比对目标文件的 `^#+ ` 标题行验证锚点本身是否有效

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
        base = raw.split('|')[0].partition('#')[0].strip()  # 第 5 种情况：剥标题锚点
        if not base: continue                 # [[#标题]] 是本文件锚点，Obsidian 合法，跳过
        if base.startswith('<%') or base.startswith('http'): continue
        if not ok(base,d): bad.append((p,base))
print('md %d ｜ 悬空 %d'%(len(mds),len(bad)))
for (p,b),n in Counter(bad).items(): print('  [[%s]] ×%d  <- %s'%(b,n,p))
PY
```

### 3.4 移动文件一律用 `git mv`

保留历史。注意 `git mv` **不会自动创建目标父目录**，必须先 `mkdir -p`。

---

## 4. 版本控制与备份（血的教训）

### 4.1 静默失效是本库头号风险

2026-10-05 之前，`.gitignore` 排除了 `assets/` `日记/` `panel/` `项目/`，而 obsidian-git 每天照常提交 `vault backup:` —— **看起来备份正常，实际这些内容从未进过仓库**：

- `vault/日记/`、`vault/项目/` 历史上 **0 次提交**
- `panel/`、`assets/` 曾被跟踪（7 / 19 次提交），在 `609a19f`「目录扁平化」那次提交里被**顺带排除**，属误伤
- `Home.md` 依赖 `panel/hero.md`，hero 又引用 `assets/workbench-hero.png` → 换机重克隆首页必现坏链

> 🛑 **禁止只看 `git status` 干净就判定备份正常。** 必须显式 `git check-ignore -v <path>`。

### 4.2 双向校验清单

```bash
git check-ignore -v <path>     # 该被跟踪的是否真被跟踪
git check-ignore -v notes/bio/生信学习/covid_cite.h5ad   # 该被排除的是否真被排除
```

### 4.3 正确排除的（勿放行）

`.obsidian/`（含插件设置，避免密钥泄露）、`*.pdf`、`*.h5ad`、`*.zip`、`*.docx`、`*.fa`、`__pycache__/`、`.lamindb/`

### 4.4 破坏性操作前

```bash
git tag pre-<动作>-$(date +%F)          # 轻量回滚点
find . -type f -not -path './.git/*' > /tmp/files-before.txt
```

2026-10-05 的回滚点：`pre-PARA-2026-10-05` → `b85d50a`

---

## 5. Hexo 约束（`_posts/`）

- **本库不是 Hexo 源目录**：库根无 `_config.yml`、无 `package.json`。
  `_posts/` 只是博客文章的**暂存副本**，实际 Hexo 工程在本库之外。
- 推论：**改 `_posts/` 的 `date` 不会影响线上 permalink**，可以放心整理。
- 文章 schema 参照 `hexo.md` / `R2img.md`（Hexo-Next 风格）：
  `title` / `date`（带时区 ISO）/ `categories`（二级列表）/ `tags` / 可选 `abbrlink` `banner` `excerpt`
- 不要臆造 `excerpt` 摘要正文 —— 那是内容，会变成编造。

---

## 6. Obsidian 配置契约（改动即连锁）

`.obsidian/` 虽被 gitignore，但**这些设置是本库的承重结构**，改前先想清楚连锁范围：

| 配置项 | 值 | 影响面 |
|---|---|---|
| `templates.json` → `folder` | `muban` | 所有 Templater/模板路径 |
| `daily-notes.json` → `folder` | `vault/日记` | 每日笔记落盘位置 |
| `daily-notes.json` → `template` | `muban/daily-note-template.md` | 日记模板 |
| `app.json` → `attachmentFolderPath` | `assets` | 全部附件落盘 |
| `app.json` → `newLinkFormat` | `absolute` | 见 §3.1 链接风格 |
| `Home.md` → `cssclasses` | `knowledge-home` | 样式表在 `muban/dashboard.css` |
| `panel/hero.md` | 引用 `assets/workbench-hero.png` | 两者任一缺失 → 首页坏链 |

`Home.md` embed 了 4 个 panel：`hero` / `操作台` / `洞察镜` / `快捷入口`。全部用 `dataviewjs`，依赖 dataview 插件与 `moment`。

---

## 7. 反例黑名单

1. ❌ 不 `ls` 就按记忆或历史结论中的结构动手 —— 目录已变更过多次（`609a19f` 就把 `notes/` `muban/` `panel/` 从 `vault/` 移回了库根）
2. ❌ 只看 `git status` 干净就判定备份正常
3. ❌ 把 `notes/class-notes/分子生物学/` 两层当重复内容合并 —— **那是两本不同的书**
4. ❌ 用短链接指向同名文件
5. ❌ 用 `rm -rf` 代替 `git mv` 做归档
6. ❌ 预建空的领域/资源目录（违反 PARA §3.3）
7. ❌ 因目录"体量小"就归档 —— 判据是是否沉淀物
8. ❌ 移动 `covid_cite.h5ad` —— 它是 `AnnData.ipynb` 的活数据，且已被 gitignore
9. ❌ 在 Obsidian 运行时编辑 `.obsidian/` 下的 leveldb（会被覆盖）
10. ❌ 瘦身前不做物理备份 + 不用 `git mv` 逐文件恢复

---

## 8. 已知遗留（未处理，供后续参考）

| # | 事项 | 说明 |
|---|---|---|
| 1 | `muban/` 内 4 条模板占位链接**故意保留** | `[[status/to_read]]` ×3、`[[{{annotation.imageRelativePath}}]]` ×1（后者是 Zotero 模板的 Templater 变量，不是真链接）。链接语法本身是模板的目的，不是缺陷。除这 4 条外，全库悬空链接为 0（2026-10-23 复核：466 个 md） |
| 2 | lamindb 实例已失效 | `notes/bio/生信学习/单细胞/笔记/my_data/.lamindb/` 记录的是 **Windows 路径** `D:/data/rlcao/...`，当前平台为 Linux |
| 3 | Zotero 工作流已接通（2026-10-16） | 使用 Zotero Integration + Better BibTeX，模板 `muban/zotero-literature-template.md`；笔记位于 `vault/文献笔记` |
| 4 | `notes/class-notes/遗传学/` 命名不当 | 530 个文件中 526 个是 jpg、仅 2 个 md，实为扫描档案；第 2、4 章尚未转录 |
| 5 | `wiki/c/chapter6.md` 有 20 处 C 宏被误转成 wikilink | 均在代码块内，Obsidian 渲染无害，保留原样；标题行 2 处已修为行内代码 |
| 6 | `_posts` 4 篇的 date 取自 git 首次提交日 | 未经作者确认真实发表日期，核实后可改 |

### 8.1 2026-10-05 链接清理记录

初判 48 条悬空链接，复核后**真实悬空仅 32 条**，其余为误报。处置如下：

| 类别 | 条数 | 处置 |
|---|---|---|
| 指向已改名文件 | 4 | 重定向到现名；同步去掉已失效的「（待创建）」标注 |
| 标签被误写成 wikilink | 1 行 | 还原为真正的 Obsidian 标签 `#课堂笔记` 等 |
| C 宏误转（标题行） | 2 | 改为行内代码 `` `define` `` |
| 概念前瞻链接（笔记未写就绪） | 15 | 转为纯文本，**不伪造目标文件** |
| 目录从未创建 | 1 | 删除 `notes/bio/_index.md` 的导航行，而非预建空目录（PARA §3.3） |
| 模板占位符 | 4 | **保留** |

⚠️ 概念前瞻链接转为纯文本后，「想写但还没写」的信号随之消失。如需保留该信号，改用 `TODO` 前缀或 `[^1]` 脚注，不要用空悬空链接。

---

## 9. 每周维护（PARA §5，约 5 分钟）

1. 重命名 `inbox.md` 中的新条目（给它一个能检索的名字）
2. 把新内容归入正确的项目 / 领域 / 资源
3. 更新活跃项目；把完成或搁置的项目移入 `4-存档/`
## 10. 2026-10-16 工作流配置

- `vault/项目`统一存放项目资料；原 BSA-seq、mazie-ltr-ide 已移动为项目下的 BSA-seq、maize-ltr-ide。
- `vault/方法`存放实验方法、生信分析、甲基化；`vault/系统与工具`存放电脑与服务器资料。
- 新实验记录位于 `vault/实验记录`，大纲位于 `vault/大纲笔记`，总览和使用说明位于 `vault/工作台`。
- 每日笔记和 Zotero 笔记的路径契约不变。
- `Home.md`仍嵌入 panel 的四个组件，使用 Dataview；QuickAdd 的原生模板创建流程负责新建记录。
- 新项目和实验通过 `type`、`status`、`date`、`project` 等属性进入 Bases 总览；模板目录须从实验数据视图中排除。
- Mindmap NextGen 替换无法在当前 Obsidian 正常渲染的旧 Mind Map；大纲仍以 Markdown 为唯一内容源。

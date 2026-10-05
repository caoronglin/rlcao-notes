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

```bash
# 排除围栏代码块（否则 [[include]] 之类的伪链接会刷屏）
python3 - <<'EOF'
import re,io,os
files=[os.path.join(r,n) for r,d,f in os.walk('.')
       if not any(x in r for x in ['.git','.obsidian','.trash'])
       for n in f if n.endswith('.md')]
names={os.path.basename(p)[:-3] for p in files}
for p in files:
    s=re.sub(r'```.*?```','',io.open(p,encoding='utf-8',errors='ignore').read(),flags=re.S)
    for m in re.findall(r'\[\[([^\]\|]+)(?:\|[^\]]*)?\]\]',s):
        b=m.strip()
        if b.startswith('<%') or b.startswith('http') or '/' in b: continue
        if b not in names: print('❌ %s -> [[%s]]'%(p,b))
EOF
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
| 1 | 约 48 条悬空短链接 | 主要是 `[[白银御行]]` `[[酶工程课程大纲]]` `[[课堂笔记]]` 等未落地的占位链接，以及 `[[难点图解.html]]` ×4。`notes/class-notes/遗传学/` 530 个文件中 526 个是 jpg、仅 2 个 md，实为扫描档案 |
| 2 | lamindb 实例已失效 | `notes/bio/生信学习/单细胞/笔记/my_data/.lamindb/` 记录的是 **Windows 路径** `D:/data/rlcao/...`，当前平台为 Linux |
| 3 | Zotero 工作流未接通 | `muban/zotero-annotation-template.md` 存在，但 `assets/zotero-annotations/` 为空（已归档），`assets/zotlit-img/` 同 |
| 4 | `notes/class-notes/遗传学/` 命名不当 | 526 张 jpg 的扫描档案放在「课堂笔记」下 |
| 5 | `_posts/高中常见激素.md` 等 4 篇的 date 取自 git 首次提交日 | 未经作者确认真实发表日期，核实后可改 |

---

## 9. 每周维护（PARA §5，约 5 分钟）

1. 重命名 `inbox.md` 中的新条目（给它一个能检索的名字）
2. 把新内容归入正确的项目 / 领域 / 资源
3. 更新活跃项目；把完成或搁置的项目移入 `4-存档/`
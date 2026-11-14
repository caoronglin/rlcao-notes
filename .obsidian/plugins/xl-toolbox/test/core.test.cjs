/**
 * xl-toolbox 纯逻辑单测：从 main.js 里抽出 pure-core 段，在 node 中直接跑。
 * 用法：node .obsidian/plugins/xl-toolbox/test/core.test.cjs
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const mainPath = path.join(__dirname, '..', 'main.js');
const src = fs.readFileSync(mainPath, 'utf8');
const m = src.match(/\/\* =+ pure-core-start =+ \*\/([\s\S]*?)\/\* =+ pure-core-end =+ \*\//);
if (!m) { console.error('找不到 pure-core 段'); process.exit(1); }

// measure：CJK 按 1em，ASCII 按 0.55em，用于替代 canvas 测量
const measure = s => Array.from(String(s)).reduce((a, c) => a + (c.charCodeAt(0) > 255 ? 13 : 7.2), 0);
const core = new Function('measure', `${m[1]}; return { xlStripInline, xlParseOutline, xlWrap, xlLayout, xlBuildSvg, xlEscapeXml };`)(measure);
const { xlStripInline, xlParseOutline, xlWrap, xlLayout, xlBuildSvg } = core;

let pass = 0;
const t = (name, fn) => { try { fn(); pass++; console.log('  ok  ' + name); } catch (e) { console.log('  FAIL ' + name + ' -> ' + e.message); process.exitCode = 1; } };

console.log('xl-toolbox core tests');

t('行内标记清洗', () => {
  assert.strictEqual(xlStripInline('用 `BLASTN` 跑 **megablast**'), '用 BLASTN 跑 megablast');
  assert.strictEqual(xlStripInline('见 [[notes/第01章 绪论|绪论]] 一节'), '见 绪论 一节');
  assert.strictEqual(xlStripInline('见 [[vault/方法/04_序列检索.md]]'), '见 04_序列检索.md');
  assert.strictEqual(xlStripInline('~~删掉~~ ==高亮== $x=1$'), '删掉 高亮 x=1');
  assert.strictEqual(xlStripInline('![[assets/a.png]] 图注'), '图注');
  assert.strictEqual(xlStripInline('<span class="x">文字</span>'), '文字');
});

t('标题 + 缩进列表成树', () => {
  const md = [
    '---', 'type: outline', '---', '',
    '# 根',
    '## 核心问题',
    '- 问题一',
    '  - 证据 A',
    '    - 细节 a1',
    '  - 证据 B',
    '- 问题二',
    '## 思路',
    '- 主线',
  ].join('\n');
  const root = xlParseOutline(md, '根');
  assert.strictEqual(root.text, '根');
  assert.strictEqual(root.children.length, 2);
  const q = root.children[0];
  assert.strictEqual(q.text, '核心问题');
  assert.strictEqual(q.kind, 'heading');
  assert.strictEqual(q.children.length, 2);
  assert.strictEqual(q.children[0].text, '问题一');
  assert.strictEqual(q.children.length, 2);                       // 问题一 / 问题二 同级
  assert.deepStrictEqual(q.children[0].children.map(n => n.text), ['证据 A', '证据 B']);
  assert.strictEqual(q.children[0].children[0].children[0].text, '细节 a1');
  assert.strictEqual(q.children[1].text, '问题二');
  assert.strictEqual(q.children[0].line, 6);
});

t('任务复选框与空条目', () => {
  const root = xlParseOutline('# T\n- [ ] 未做\n- [x] 已做\n- [ ]\n', 'T');
  const items = root.children;
  assert.deepStrictEqual(items.map(i => i.text), ['未做', '已做']);
});

t('代码围栏与注释不进入节点', () => {
  const md = '# T\n```bash\ngit status\n```\n- 真条目\n%% 隐藏 %%\n- 另一条\n';
  const root = xlParseOutline(md, 'T');
  const items = root.children;
  assert.deepStrictEqual(items.map(i => i.text), ['真条目', '另一条']);
});

t('行号可回溯原文', () => {
  const md = '# T\n\n- 甲\n- 乙\n';
  const root = xlParseOutline(md, 'T');
  const items = root.children;
  assert.strictEqual(items[0].line, 2);
  assert.strictEqual(items[1].line, 3);
});

t('换行不超出给定宽度', () => {
  const lines = xlWrap('这是一段足够长的中文文本，用来测试自动换行是否严格受宽度限制。', 120, measure);
  assert.ok(lines.length > 1);
  for (const l of lines) assert.ok(measure(l) <= 120, '超宽：' + l + ' / ' + measure(l));
});

t('超长文本截断为 6 行', () => {
  const lines = xlWrap('字'.repeat(400), 60, measure);
  assert.strictEqual(lines.length, 6);
  assert.ok(lines[5].endsWith('…'));
});

t('布局：节点不重叠、连线数 = 可见父子对数', () => {
  const md = '# T\n' + Array.from({ length: 8 }, (_, i) => `- 节点${i}\n  - 子${i}\n`).join('');
  const root = xlParseOutline(md, 'T');
  const st = xlLayout(root, { measure, nodeMaxW: 240 });
  assert.strictEqual(st.nodes.length, 17); // 1 根（吸收 H1）+ 8 + 8
  assert.strictEqual(st.edges.length, 16);
  // 同列相邻节点纵向不重叠
  const byDepth = new Map();
  for (const n of st.nodes) {
    if (!byDepth.has(n.depth)) byDepth.set(n.depth, []);
    byDepth.get(n.depth).push(n);
  }
  for (const [d, arr] of byDepth) {
    arr.sort((a, b) => a.y - b.y);
    for (let i = 1; i < arr.length; i++) {
      assert.ok(arr[i].y >= arr[i - 1].y + arr[i - 1].h - 0.01, `深度 ${d} 第 ${i} 个节点重叠`);
    }
  }
  // 列 x 单调递增
  const xs = [...byDepth.keys()].sort((a, b) => a - b).map(d => byDepth.get(d)[0].x);
  for (let i = 1; i < xs.length; i++) assert.ok(xs[i] > xs[i - 1]);
  assert.ok(st.width > 0 && st.height > 0);
});

t('折叠后子节点消失', () => {
  const root = xlParseOutline('# T\n- A\n  - A1\n  - A2\n- B\n', 'T');
  const full = xlLayout(root, { measure });
  const aNode = full.nodes.find(n => n.text === 'A');
  aNode.collapsed = true;
  const folded = xlLayout(root, { measure });
  assert.strictEqual(folded.nodes.length, full.nodes.length - 2);
});

t('SVG 导出结构完整且转义正确', () => {
  const root = xlParseOutline('# A & B\n- x < y\n', 'A & B');
  const st = xlLayout(root, { measure });
  const { svg, width, height } = xlBuildSvg(st, {});
  assert.ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'));
  assert.ok(svg.endsWith('</svg>'));
  assert.ok(svg.includes('A &amp; B'));
  assert.ok(svg.includes('x &lt; y'));
  assert.ok(width > st.width && height > st.height);
  assert.strictEqual((svg.match(/<rect/g) || []).length, st.nodes.length + 1);
});

t('真实笔记可解析', () => {
  const f = '/mnt/data/rlcao/vault/大纲笔记/生信实验课程知识结构.md';
  if (!fs.existsSync(f)) { console.log('      (跳过：真实笔记不存在)'); return; }
  const text = fs.readFileSync(f, 'utf8');
  const root = xlParseOutline(text, '生信实验课程知识结构');
  assert.ok(root.children.length >= 3, '应至少有 3 个标题分支');
  const all = [];
  (function walk(n) { all.push(n); (n.children || []).forEach(walk); })(root);
  assert.ok(all.length > 20, '节点数过少：' + all.length);
  assert.ok(all.every(n => !/^\s*$/.test(n.text)), '存在空节点');
  const st = xlLayout(root, { measure });
  assert.ok(st.width > 400 && st.height > 400);
  console.log(`      真实笔记：${all.length} 节点，画布 ${Math.round(st.width)}×${Math.round(st.height)}`);
});

console.log(`\n${pass} passed${process.exitCode ? '，存在失败' : ''}`);

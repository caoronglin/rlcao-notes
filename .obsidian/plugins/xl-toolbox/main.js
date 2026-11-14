'use strict';
/*
 * XL Toolbox — 自研大纲思维导图
 * 纯逻辑段（pure-core）与 Obsidian API 段分离，前者可脱离 Obsidian 单测。
 */
const { Plugin, ItemView, Notice, MarkdownView, TFile } = require('obsidian');

const VIEW_TYPE = 'xl-mindmap';

/* ======================= pure-core-start ======================= */
const PALETTE = ['#1677ff', '#722ed1', '#13c2c2', '#fa8c16', '#52c41a', '#eb2f96'];

function xlStripInline(raw) {
  let s = String(raw == null ? '' : raw);
  s = s.replace(/!\[\[[^\]]*\]\]/g, '');                                   // 嵌入先丢掉
  s = s.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2');                     // [[路径|别名]] -> 别名
  s = s.replace(/\[\[([^\]]+)\]\]/g, (m, p) => String(p).split('#')[0].split('/').pop());
  s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, '');                              // md 图片
  s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');                           // md 链接
  s = s.replace(/`+([^`]*)`+/g, '$1');
  s = s.replace(/(\*\*|__)(.+?)\1/g, '$2');
  s = s.replace(/(^|[^\w*])\*([^*\n]+)\*(?!\w)/g, '$1$2');
  s = s.replace(/~~(.+?)~~/g, '$1');
  s = s.replace(/==(.+?)==/g, '$1');
  s = s.replace(/\$([^$\n]+)\$/g, '$1');
  s = s.replace(/<[^>]+>/g, '');                                           // 行内 HTML
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

/**
 * 解析 Markdown 大纲：标题层级 + 缩进列表 -> 树
 * 支持：YAML frontmatter、代码围栏、%% 注释、任务复选框、Tab 缩进
 */
function xlParseOutline(text, rootTitle) {
  const root = { id: 'root', text: rootTitle || '未命名', kind: 'root', depth: 0, line: 0, collapsed: false, children: [] };
  const lines = String(text == null ? '' : text).split(/\r?\n/);
  let inFence = false, fenceMark = '', inComment = false, inFrontmatter = false, seenContent = false;
  const headings = [];          // [{level, node}]
  let listStack = [];           // [{indent, node}]
  let seq = 0;

  const push = (parent, text2, meta) => {
    const node = Object.assign({ id: 'n' + (++seq), text: text2, collapsed: false, children: [] }, meta);
    parent.children.push(node);
    return node;
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.replace(/\t/g, '    ');

    if (i === 0 && /^---\s*$/.test(line)) { inFrontmatter = true; continue; }
    if (inFrontmatter) { if (/^(---|\.\.\.)\s*$/.test(line)) inFrontmatter = false; continue; }

    const fence = line.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      if (!inFence) { inFence = true; fenceMark = fence[1][0]; }
      else if (fence[1][0] === fenceMark) { inFence = false; }
      continue;
    }
    if (inFence) continue;

    if (line.includes('%%')) {
      const parts = line.split('%%');
      if (inComment) { inComment = false; if (!parts[parts.length - 1].trim()) continue; }
      else if (parts.length % 2 === 0) { inComment = true; continue; }
    }
    if (inComment) continue;

    const h = line.match(/^(#{1,6})\s+(.*\S)\s*$/);
    if (h) {
      const level = h[1].length;
      const txt = xlStripInline(h[2]);
      if (!txt) { listStack = []; continue; }
      if (level === 1 && !headings.length && !root.children.length) {
        // 文首 H1 就是笔记标题：合并到根，避免「文件名 → 同名 H1」重复一层
        root.text = txt;
        root.line = i;
        headings.push({ level, node: root });
        listStack = [];
        seenContent = true;
        continue;
      }
      while (headings.length && headings[headings.length - 1].level >= level) headings.pop();
      const parent = headings.length ? headings[headings.length - 1].node : root;
      const node = push(parent, txt, { kind: 'heading', level, line: i, depth: 1 + headings.length });
      headings.push({ level, node });
      listStack = [];
      seenContent = true;
      continue;
    }

    const li = line.match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/);
    if (li) {
      const indent = li[1].length;
      let body = li[3];
      body = body.replace(/^\[[ xX\/>\-]\](?:\s+|$)/, '');               // 任务复选框
      body = xlStripInline(body);
      // 先按缩进回退到正确父级，再决定挂载点；顺序反了会把同级条目挂成上一条的子节点
      while (listStack.length && listStack[listStack.length - 1].indent >= indent) listStack.pop();
      if (!body) continue;                                               // 空条目：只维护缩进栈，不建节点
      const parent = listStack.length
        ? listStack[listStack.length - 1].node
        : (headings.length ? headings[headings.length - 1].node : root);
      const node = push(parent, body, { kind: 'item', line: i, depth: 2 });
      listStack.push({ indent, node });
      seenContent = true;
      continue;
    }
    if (!line.trim()) { /* 空行不打断缩进栈 */ }
    else if (!/^>/.test(line)) { listStack = []; }                        // 普通段落/引用结束列表
  }

  if (!seenContent && !root.children.length) {
    root.children.push({ id: 'n-empty', text: '（这篇笔记还没有标题或列表内容）', kind: 'item', line: 0, depth: 1, collapsed: false, children: [] });
  }
  return root;
}

function xlWrap(text, maxWidth, measure) {
  const src = String(text == null ? '' : text).replace(/\s+/g, ' ').trim();
  if (!src) return [''];
  const out = [];
  let cur = '';
  for (const ch of Array.from(src)) {
    const next = cur + ch;
    if (cur && measure(next) > maxWidth) {
      out.push(cur.replace(/\s+$/, ''));
      cur = ch === ' ' ? '' : ch;
    } else {
      cur = next;
    }
  }
  if (cur.trim()) out.push(cur.replace(/\s+$/, ''));
  const MAX_LINES = 6;
  if (out.length > MAX_LINES) {
    out.length = MAX_LINES;
    const last = out[MAX_LINES - 1];
    out[MAX_LINES - 1] = last.length > 1 ? last.slice(0, -1) + '…' : last + '…';
  }
  return out.length ? out : [''];
}

const xlRound = v => Math.round(v * 100) / 100;

/**
 * 横向 tidy tree 布局。返回 {nodes, edges, width, height}
 * opts: {nodeMaxW, padX, padY, lineH, vGap, hGap, measure}
 */
function xlLayout(root, opts) {
  const o = Object.assign({
    nodeMaxW: 260, padX: 12, padY: 8, lineH: 20, vGap: 10, hGap: 56, fontSize: 13,
    measure: s => String(s).length * 8,
  }, opts || {});

  const nodes = [];
  const innerW = o.nodeMaxW - o.padX * 2 - 4;   // 留 4px 余量，抵消 canvas 与 SVG 渲染的字宽差

  (function prep(n, depth) {
    n.depth = depth;
    n.lines = xlWrap(n.text, innerW, o.measure);
    const widest = n.lines.reduce((m, l) => Math.max(m, o.measure(l)), 0);
    n.w = Math.min(o.nodeMaxW, Math.max(56, Math.ceil(widest) + o.padX * 2));
    n.h = n.lines.length * o.lineH + o.padY * 2;
    nodes.push(n);
    if (!n.collapsed && n.children && n.children.length) for (const c of n.children) prep(c, depth + 1);
  })(root, 0);

  const colW = [];
  for (const n of nodes) colW[n.depth] = Math.max(colW[n.depth] || 0, n.w);
  const xAt = [];
  let acc = 0;
  for (let d = 0; d < colW.length; d++) { xAt[d] = acc; acc += (colW[d] || 0) + o.hGap; }

  const subH = new Map();
  const calcH = n => {
    let h = subH.get(n);
    if (h != null) return h;
    h = n.h;
    if (!n.collapsed && n.children && n.children.length) {
      let s = 0;
      for (const c of n.children) s += calcH(c) + o.vGap;
      s -= o.vGap;
      h = Math.max(h, s);
    }
    subH.set(n, h);
    return h;
  };

  const place = (n, top) => {
    const h = calcH(n);
    n.x = xAt[n.depth];
    n.y = top + (h - n.h) / 2;
    if (!n.collapsed && n.children && n.children.length) {
      const blockH = n.children.reduce((a, c) => a + calcH(c), 0) + o.vGap * (n.children.length - 1);
      let cy = top + (h - blockH) / 2;
      for (const c of n.children) { place(c, cy); cy += calcH(c) + o.vGap; }
    }
    return h;
  };
  const totalH = place(root, 0);

  const edges = [];
  for (const n of nodes) {
    if (n.collapsed || !n.children || !n.children.length) continue;
    for (const c of n.children) {
      const x1 = xlRound(n.x + n.w), y1 = xlRound(n.y + n.h / 2);
      const x2 = xlRound(c.x), y2 = xlRound(c.y + c.h / 2);
      const dx = Math.max(14, Math.round((x2 - x1) / 2));
      edges.push({
        from: n.id, to: c.id, depth: c.depth,
        d: `M ${x1} ${y1} C ${xlRound(x1 + dx)} ${y1}, ${xlRound(x2 - dx)} ${y2}, ${x2} ${y2}`,
      });
    }
  }

  const width = colW.length ? xAt[colW.length - 1] + (colW[colW.length - 1] || 0) : 0;
  // 把排版参数回传给导出器，避免 SVG 用别的字号导致文字溢出卡片
  const meta = { padX: o.padX, padY: o.padY, lineH: o.lineH, fontSize: o.fontSize, depth: colW.length };
  return { nodes, edges, width, height: totalH, meta };
}

function xlEscapeXml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

/** 用布局结果生成独立 SVG（导出用，颜色固定，便于论文/汇报引用） */
function xlBuildSvg(state, opts) {
  const meta = state.meta || { padX: 12, padY: 8, lineH: 20, fontSize: 13 };
  const o = Object.assign({
    pad: 24,
    font: meta.fontSize,
    fontFamily: 'Noto Sans CJK SC, Source Han Sans SC, PingFang SC, Microsoft YaHei, sans-serif',
    dark: false,
  }, opts || {});
  const W = Math.ceil(state.width + o.pad * 2);
  const H = Math.ceil(state.height + o.pad * 2);
  const bg = o.dark ? '#141414' : '#ffffff';
  const edge = o.dark ? '#3a3a3a' : '#d9d9d9';
  const textMain = o.dark ? '#f0f0f0' : '#1f1f1f';
  const parts = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${xlEscapeXml(o.fontFamily)}">`);
  parts.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${bg}"/>`);
  for (const e of state.edges) {
    parts.push(`<path d="${e.d}" fill="none" stroke="${edge}" stroke-width="1.5" transform="translate(${o.pad},${o.pad})"/>`);
  }
  for (const n of state.nodes) {
    const color = PALETTE[n.depth % PALETTE.length];
    const fill = o.dark ? '#1f1f1f' : (n.kind === 'root' ? '#e6f4ff' : '#fafafa');
    const x = xlRound(n.x + o.pad), y = xlRound(n.y + o.pad);
    parts.push(`<g><rect x="${x}" y="${y}" width="${xlRound(n.w)}" height="${xlRound(n.h)}" rx="8" ry="8" fill="${fill}" stroke="${color}" stroke-width="${n.kind === 'root' ? 2 : 1.2}"/>`);
    n.lines.forEach((ln, i) => {
      const ty = xlRound(y + meta.padY + (i + 1) * meta.lineH - 6);
      parts.push(`<text x="${xlRound(x + meta.padX)}" y="${ty}" font-size="${o.font}" fill="${textMain}"${n.kind === 'root' ? ' font-weight="600"' : ''}>${xlEscapeXml(ln)}</text>`);
    });
    parts.push('</g>');
  }
  parts.push('</svg>');
  return { svg: parts.join('\n'), width: W, height: H };
}

/* ======================== pure-core-end ======================== */

class XLMindMapView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.file = null;
    this.collapsed = new Set();
    this.zoom = 1;
    this.state = null;
    this.renderTimer = null;
  }

  getViewType() { return VIEW_TYPE; }
  getDisplayText() { return this.file ? `导图 · ${this.file.basename}` : '大纲导图'; }
  getIcon() { return 'git-fork'; }

  async onOpen() {
    const root = this.contentEl;
    root.empty();
    root.addClass('xl-mm-view');

    const bar = root.createDiv({ cls: 'xl-mm-toolbar' });
    this.btn(bar, '重新生成', () => this.render(true), '刷新');
    this.btn(bar, '全部展开', () => { this.collapsed.clear(); this.render(); });
    this.btn(bar, '折到 2 层', () => this.collapseTo(2));
    this.btn(bar, '适应窗口', () => this.fit());
    this.btn(bar, '−', () => this.setZoom(this.zoom / 1.15));
    this.btn(bar, '+', () => this.setZoom(this.zoom * 1.15));
    this.btn(bar, '导出 SVG', () => this.exportSvg());
    this.btn(bar, '导出 PNG', () => this.exportPng());
    this.meta = bar.createSpan({ cls: 'xl-mm-meta' });

    this.scrollEl = root.createDiv({ cls: 'xl-mm-scroll' });

    this.registerEvent(this.app.vault.on('modify', f => {
      if (this.file && f.path === this.file.path) this.scheduleRender();
    }));
    this.registerEvent(this.app.workspace.on('active-leaf-change', () => {
      if (!this.file) this.useActiveFile();
    }));

    if (!this.file) this.useActiveFile();
    await this.render();
  }

  async onClose() { this.contentEl.empty(); }

  btn(parent, label, fn, title) {
    const b = parent.createEl('button', { text: label, cls: 'xl-mm-btn' });
    if (title) b.setAttr('title', title);
    b.onclick = () => { try { fn(); } catch (e) { console.error(e); new Notice('操作失败：' + e.message); } };
    return b;
  }

  useActiveFile() {
    const f = this.app.workspace.getActiveFile();
    if (f && f.extension === 'md') this.file = f;
  }

  async setFile(file) {
    if (!file) return;
    this.file = file;
    this.collapsed.clear();
    // setViewState 内部会回调 setState，由它触发重绘，这里不再重复渲染
    await this.leaf.setViewState({ type: VIEW_TYPE, state: { file: file.path }, active: true });
  }

  async setState(state, result) {
    if (state && state.file) {
      const f = this.app.vault.getAbstractFileByPath(state.file);
      if (f instanceof TFile) this.file = f;
    }
    await super.setState(state, result);
    if (this.scrollEl) await this.render();
  }

  getState() { return { file: this.file ? this.file.path : null }; }

  scheduleRender() {
    if (this.renderTimer) window.clearTimeout(this.renderTimer);
    this.renderTimer = window.setTimeout(() => { this.renderTimer = null; this.render(); }, 400);
  }

  collapseTo(level) {
    this.collapsed.clear();
    if (!this.state) return;
    for (const n of this.state.nodes) {
      if (n.depth >= level && n.children && n.children.length) this.collapsed.add(n.id);
    }
    this.render();
  }

  setZoom(z) {
    this.zoom = Math.max(0.25, Math.min(2.5, z));
    this.applyZoom();
  }

  applyZoom() {
    if (!this.state) return;
    this.canvasEl.style.transform = `scale(${this.zoom})`;
    this.canvasEl.style.transformOrigin = '0 0';
    this.canvasEl.style.width = this.state.width + 'px';
    this.canvasEl.style.height = this.state.height + 'px';
    if (this.stageEl) {
      this.stageEl.style.width = Math.ceil(this.state.width * this.zoom) + 'px';
      this.stageEl.style.height = Math.ceil(this.state.height * this.zoom) + 'px';
    }
  }

  fit() {
    if (!this.state) return;
    const avail = Math.max(240, this.scrollEl.clientWidth - 32);
    this.zoom = Math.max(0.25, Math.min(1, avail / Math.max(1, this.state.width)));
    this.applyZoom();
  }

  measureFactory() {
    const probe = this.contentEl.createDiv({ cls: 'xl-mm-probe', text: '中文Ag中' });
    const cs = window.getComputedStyle(probe);
    const fontSize = parseFloat(cs.fontSize) || 14;
    probe.remove();
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `${fontSize}px ${cs.fontFamily || 'sans-serif'}`;
    return s => ctx.measureText(String(s)).width;
  }

  async render(force) {
    if (!this.scrollEl) return;
    this.scrollEl.empty();
    this.stageEl = this.scrollEl.createDiv({ cls: 'xl-mm-stage' });
    this.canvasEl = this.stageEl.createDiv({ cls: 'xl-mm-canvas' });
    if (!this.file) {
      this.stageEl.createEl('p', { text: '先打开一篇笔记，再运行「XL Toolbox: 打开大纲思维导图」。', cls: 'xl-mm-empty' });
      return;
    }
    const text = await this.app.vault.cachedRead(this.file);
    const tree = xlParseOutline(text, this.file.basename);
    this.applyCollapsed(tree);
    const probe = this.contentEl.createDiv({ cls: 'xl-mm-probe', text: '中文Ag中' });
    const probeStyle = window.getComputedStyle(probe);
    const fontSize = parseFloat(probeStyle.fontSize) || 13;
    const lineH = Math.round(fontSize * 1.55);
    probe.remove();
    const state = xlLayout(tree, { measure: this.measureFactory(), fontSize, lineH });
    this.state = state;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'xl-mm-edges');
    svg.setAttribute('width', String(state.width));
    svg.setAttribute('height', String(Math.max(1, state.height)));
    for (const e of state.edges) {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', e.d);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', PALETTE[(e.depth || 1) % PALETTE.length]);
      p.setAttribute('stroke-width', '1.5');
      p.setAttribute('opacity', '0.55');
      svg.appendChild(p);
    }
    this.canvasEl.appendChild(svg);

    for (const n of state.nodes) {
      const color = PALETTE[n.depth % PALETTE.length];
      const el = this.canvasEl.createDiv({ cls: 'xl-mm-node' });
      el.style.left = n.x + 'px';
      el.style.top = n.y + 'px';
      el.style.width = n.w + 'px';
      el.style.borderColor = color;
      el.style.setProperty('--xl-mm-accent', color);
      if (n.kind === 'root') el.addClass('is-root');
      if (n.kind === 'heading') el.addClass('is-heading');

      const body = el.createDiv({ cls: 'xl-mm-text' });
      for (const ln of n.lines) body.createDiv({ cls: 'xl-mm-line', text: ln });
      if (n.kind === 'heading') body.style.fontWeight = '600';

      el.setAttr('title', n.text.replace(/\n/g, ' ') + '（第 ' + (n.line + 1) + ' 行）');
      el.onclick = ev => {
        ev.stopPropagation();
        this.jumpTo(n.line);
      };

      const hasKids = n.children && n.children.length;
      if (hasKids) {
        const flag = el.createDiv({ cls: 'xl-mm-toggle' });
        const open = !n.collapsed;
        flag.setText(open ? '−' : '+' + n.children.length);
        flag.onclick = ev => {
          ev.stopPropagation();
          if (n.collapsed) this.collapsed.delete(n.id); else this.collapsed.add(n.id);
          this.render();
        };
      }
    }

    this.applyZoom();
    if (force) new Notice('导图已重新生成');
    if (this.meta) {
      this.meta.setText(`${state.nodes.length} 个节点 · 深度 ${Math.max(...state.nodes.map(n => n.depth)) + 1} · 缩放 ${Math.round(this.zoom * 100)}%`);
    }
  }

  applyCollapsed(tree) {
    const walk = n => {
      if (this.collapsed.has(n.id)) n.collapsed = true;
      for (const c of n.children || []) walk(c);
    };
    walk(tree);
  }

  async jumpTo(line) {
    const target = this.file;
    if (!target) return;
    const openView = this.app.workspace.getLeavesOfType('markdown')
      .map(l => l.view).find(v => v && v.file && v.file.path === target.path);
    if (openView) {
      this.app.workspace.setActiveLeaf(openView.leaf, { focus: true });
    } else {
      await this.app.workspace.openLinkText(target.path, '', false);
    }
    const md = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!md) return;
    const pos = { line, ch: 0 };
    md.editor.setCursor(pos);
    md.editor.scrollIntoView({ from: pos, to: pos }, true);
    md.editor.focus();
  }

  async exportSvg() {
    if (!this.state || !this.file) return;
    const { svg } = xlBuildSvg(this.state, { dark: false });
    const path = await this.uniquePath(`${this.file.basename} 思维导图`, 'svg');
    await this.app.vault.create(path, svg);
    new Notice('已导出：' + path);
  }

  async exportPng() {
    if (!this.state || !this.file) return;
    const { svg, width, height } = xlBuildSvg(this.state, { dark: false });
    const scale = 2;
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('SVG 光栅化失败')); img.src = url; });
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const cx = canvas.getContext('2d');
    cx.fillStyle = '#ffffff';
    cx.fillRect(0, 0, canvas.width, canvas.height);
    cx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
    if (!blob) throw new Error('PNG 生成失败');
    const buf = await blob.arrayBuffer();
    const path = await this.uniquePath(`${this.file.basename} 思维导图`, 'png');
    await this.app.vault.adapter.writeBinary(path, buf);
    new Notice('已导出：' + path);
  }

  async uniquePath(base, ext) {
    const folder = this.file.parent ? this.file.parent.path : '';
    let path = (folder ? folder + '/' : '') + `${base}.${ext}`;
    let i = 2;
    while (this.app.vault.getAbstractFileByPath(path)) {
      path = (folder ? folder + '/' : '') + `${base} ${i}.${ext}`;
      i++;
    }
    return path;
  }
}

class XLToolboxPlugin extends Plugin {
  async onload() {
    this.registerView(VIEW_TYPE, leaf => new XLMindMapView(leaf, this));

    this.addRibbonIcon('git-fork', 'XL：打开大纲思维导图', () => this.openMindmap());
    this.addCommand({ id: 'open-mindmap', name: '打开大纲思维导图', callback: () => this.openMindmap() });
    this.addCommand({ id: 'export-mindmap-svg', name: '导出当前笔记思维导图（SVG）', callback: () => this.exportCurrent() });
  }

  onunload() {
    // 视图随插件卸载一并关闭，避免残留空白面板
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);
  }

  async openMindmap() {
    const file = this.app.workspace.getActiveFile();
    if (!file || file.extension !== 'md') { new Notice('请先打开一篇 Markdown 笔记'); return; }
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (existing && existing.view instanceof XLMindMapView) {
      this.app.workspace.revealLeaf(existing);
      await existing.view.setFile(file);
      return;
    }
    const leaf = this.app.workspace.getRightLeaf(false) || this.app.workspace.getLeaf(true);
    await leaf.setViewState({ type: VIEW_TYPE, state: { file: file.path }, active: true });
    this.app.workspace.revealLeaf(leaf);
  }

  async exportCurrent() {
    const leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (leaf && leaf.view instanceof XLMindMapView) { await leaf.view.exportSvg(); return; }
    await this.openMindmap();
    const after = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (after && after.view instanceof XLMindMapView) await after.view.exportSvg();
  }
}

module.exports = XLToolboxPlugin;

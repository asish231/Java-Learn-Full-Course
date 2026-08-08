import { h } from './util.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

function svg(name, attrs = {}, ...children) {
  const el = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, String(value));
  for (const child of children.flat()) {
    if (child == null) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}

function valueText(value) {
  if (value == null) return 'null';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function arraysView(state) {
  const pointers = new Map();
  for (const pointer of state.pointers || []) {
    if (!pointers.has(pointer.index)) pointers.set(pointer.index, []);
    pointers.get(pointer.index).push(pointer);
  }
  const active = new Set(state.active || []);
  return h('div', { class: 'viz-array', role: 'img', 'aria-label': 'Array and pointer state' },
    ...(state.values || []).map((value, index) => h('div', { class: `viz-array-col${active.has(index) ? ' active' : ''}` },
      h('div', { class: 'viz-pointers' }, ...(pointers.get(index) || []).map((pointer) => {
        const key = String(pointer.label || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
        return h('span', { class: `viz-pointer ${key}` }, `${pointer.label || '•'} ↓`);
      })),
      h('div', { class: 'viz-cell' }, valueText(value)),
      h('div', { class: 'viz-index' }, index))));
}

function stackQueueView(state) {
  const items = state.items || [];
  return h('div', {
    class: `viz-collection ${state.structure === 'queue' ? 'queue' : 'stack'}`,
    role: 'img',
    'aria-label': `${state.structure || 'stack'} state: ${items.map(valueText).join(', ')}`
  },
  h('div', { class: 'viz-action' }, state.action || (state.structure === 'queue' ? 'front → rear' : 'top')),
  h('div', { class: 'viz-items' }, ...items.map((item, index) =>
    h('div', { class: `viz-item${index === state.activeIndex ? ' active' : ''}` }, valueText(item)))));
}

function matrixView(state) {
  const active = state.activeCell || [];
  if (!(state.matrix || []).length) return graphView(state, 'Recursion tree');
  return h('div', { class: 'viz-matrix', role: 'grid', 'aria-label': 'Dynamic programming matrix' },
    ...(state.matrix || []).map((row, rowIndex) => h('div', { class: 'viz-matrix-row', role: 'row' },
      ...row.map((value, columnIndex) => h('div', {
        class: `viz-cell${active[0] === rowIndex && active[1] === columnIndex ? ' active' : ''}`,
        role: 'gridcell',
        'aria-label': `row ${rowIndex}, column ${columnIndex}: ${valueText(value)}`
      }, valueText(value))))));
}

function graphView(state, label = 'Node diagram') {
  const nodes = state.nodes || [];
  const active = new Set((state.active || []).map((x) => String(x)));
  const visited = new Set((state.visited || []).map((x) => String(x)));
  const width = Math.max(320, Math.min(720, nodes.length * 92));
  const columns = Math.max(1, Math.ceil(Math.sqrt(nodes.length)));
  const positions = new Map();

  nodes.forEach((node, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const xStep = columns > 1 ? (width - 110) / (columns - 1) : 0;
    const pos = {
      x: columns > 1 ? 55 + col * xStep : width / 2,
      y: 48 + row * 92
    };
    positions.set(String(node.id), pos);
    if (node.id != null) positions.set(node.id, pos);
  });

  const height = Math.max(150, 100 + Math.ceil(nodes.length / columns) * 92);
  const marker = svg('marker', { id: `viz-arrow-${Math.random().toString(36).slice(2)}`, markerWidth: 8, markerHeight: 8, refX: 7, refY: 4, orient: 'auto' },
    svg('path', { d: 'M0,0 L8,4 L0,8 z', class: 'viz-arrow-head' }));
  const markerId = marker.id;
  const canvas = svg('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': label, class: 'viz-svg' }, svg('defs', {}, marker));
  
  for (const edge of state.edges || []) {
    const from = positions.get(String(edge.from)) || positions.get(edge.from);
    const to = positions.get(String(edge.to)) || positions.get(edge.to);
    if (!from || !to) continue;
    canvas.append(svg('line', { x1: from.x, y1: from.y, x2: to.x, y2: to.y, class: `viz-edge ${edge.status || ''}`, 'marker-end': `url(#${markerId})` }));
  }

  for (const node of nodes) {
    const position = positions.get(String(node.id)) || positions.get(node.id);
    if (!position) continue;
    const nodeIdStr = String(node.id);
    const isAct = active.has(nodeIdStr) || (node.status && node.status.includes('active'));
    const isVis = visited.has(nodeIdStr) || (node.status && node.status.includes('visited'));
    const group = svg('g', { class: `viz-node${isAct ? ' active' : ''}${isVis ? ' visited' : ''}` },
      svg('circle', { cx: position.x, cy: position.y, r: 25 }),
      svg('text', { x: position.x, y: position.y + 4, 'text-anchor': 'middle' }, valueText(node.value)),
      node.label ? svg('text', { x: position.x, y: position.y + 42, 'text-anchor': 'middle', class: 'viz-node-label' }, node.label) : null);
    canvas.append(group);
  }
  return canvas;
}

function linkedListView(state) {
  return graphView(state, 'Linked list node and pointer diagram');
}

function renderState(category, state) {
  if (category === 'arrays') return arraysView(state);
  if (category === 'linked-list') return linkedListView(state);
  if (category === 'tree-graph') return graphView(state, 'Tree or graph traversal diagram');
  if (category === 'stack-queue') return stackQueueView(state);
  return matrixView(state);
}

export class AlgorithmVisualizer {
  constructor({ visualization, onStep } = {}) {
    this.visualization = visualization;
    this.steps = visualization.steps || [];
    this.onStep = onStep;
    this.index = 0;
    this.delay = 1000;
    this.playing = false;

    this.titleEl = h('strong', {}, visualization.title || 'Algorithm trace');
    this.countEl = h('span', { class: 'dim' });
    this.stage = h('div', { class: 'viz-stage' });
    this.description = h('div', { class: 'viz-description', 'aria-live': 'polite' });
    this.playButton = h('button', { class: 'btn btn-sm', 'aria-label': 'Play visualization', onClick: () => this.toggle() }, '▶ Play');
    this.previousButton = h('button', { class: 'btn btn-sm', 'aria-label': 'Previous step', onClick: () => this.previous() }, '← Previous');
    this.nextButton = h('button', { class: 'btn btn-sm', 'aria-label': 'Next step', onClick: () => this.next() }, 'Next →');
    this.speed = h('input', {
      type: 'range', min: '250', max: '2000', step: '250', value: '1000',
      'aria-label': 'Playback speed',
      onInput: (event) => { this.delay = 2250 - Number(event.target.value); if (this.playing) this.restartTimer(); }
    });
    this.el = h('section', {
      class: `algorithm-viz viz-${visualization.category}`,
      role: 'region',
      'aria-label': `${visualization.title || 'Algorithm trace'} visualization`
    },
    h('div', { class: 'viz-head' }, this.titleEl, this.countEl),
    this.stage,
    this.description,
    h('div', { class: 'viz-controls' }, this.previousButton, this.playButton, this.nextButton,
      h('label', { class: 'viz-speed' }, h('span', {}, 'Speed'), this.speed)));
    this.render();
  }

  render() {
    const step = this.steps[this.index];
    if (!step) return;
    this.stage.replaceChildren(renderState(this.visualization.category, step.state || {}));
    this.description.textContent = step.description || `Step ${this.index + 1}`;
    this.countEl.textContent = `${this.index + 1} / ${this.steps.length}`;
    this.previousButton.disabled = this.index === 0;
    this.nextButton.disabled = this.index >= this.steps.length - 1;
    if (this.onStep) this.onStep(step, this.index);
  }

  previous() { this.pause(); this.index = Math.max(0, this.index - 1); this.render(); }
  next({ keepPlaying = false } = {}) {
    if (!keepPlaying) this.pause();
    if (this.index >= this.steps.length - 1) { this.pause(); return; }
    this.index++;
    this.render();
    if (this.index >= this.steps.length - 1) this.pause();
  }

  toggle() { this.playing ? this.pause() : this.play(); }
  play() {
    if (this.index >= this.steps.length - 1) this.index = 0;
    this.playing = true;
    this.playButton.textContent = 'Ⅱ Pause';
    this.playButton.setAttribute('aria-label', 'Pause visualization');
    this.render();
    this.restartTimer();
  }
  pause() {
    this.playing = false;
    clearInterval(this.timer);
    this.playButton.textContent = '▶ Play';
    this.playButton.setAttribute('aria-label', 'Play visualization');
  }
  restartTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(() => this.next({ keepPlaying: true }), this.delay);
  }
  destroy() { this.pause(); }
}

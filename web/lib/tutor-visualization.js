/** Validate and extract the non-executable visualization contract emitted by Mercury. */
const CATEGORIES = new Set(['arrays', 'linked-list', 'tree-graph', 'stack-queue', 'dp-recursion']);
const MAX_STEPS = 80;
const MAX_ITEMS = 100;

function text(value, fallback = '', limit = 240) {
  return typeof value === 'string' ? value.slice(0, limit) : fallback;
}

function scalar(value) {
  if (value == null || typeof value === 'boolean' || typeof value === 'number') return value;
  return text(value, '', 80);
}

function list(value, map = scalar) {
  return Array.isArray(value) ? value.slice(0, MAX_ITEMS).map(map) : [];
}

function node(value, index) {
  const row = value && typeof value === 'object' ? value : {};
  return {
    id: text(row.id, `node-${index}`, 60),
    value: scalar(row.value),
    label: text(row.label, '', 80),
    status: text(row.status, '', 30)
  };
}

function edge(value) {
  const row = value && typeof value === 'object' ? value : {};
  return {
    from: text(row.from, '', 60),
    to: text(row.to, '', 60),
    label: text(row.label, '', 40),
    status: text(row.status, '', 30)
  };
}

function stateFor(category, value) {
  const state = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  if (category === 'arrays') {
    return {
      values: list(state.values),
      pointers: list(state.pointers, (pointer) => ({
        label: text(pointer && pointer.label, '', 20),
        index: Number.isInteger(pointer && pointer.index) ? pointer.index : -1,
        status: text(pointer && pointer.status, '', 30)
      })),
      active: list(state.active, (item) => Number(item)).filter(Number.isFinite)
    };
  }
  if (category === 'linked-list' || category === 'tree-graph') {
    return {
      nodes: list(state.nodes, node),
      edges: list(state.edges, edge),
      active: list(state.active, (item) => text(item, '', 60)),
      visited: list(state.visited, (item) => text(item, '', 60))
    };
  }
  if (category === 'stack-queue') {
    return {
      items: list(state.items),
      structure: state.structure === 'queue' ? 'queue' : 'stack',
      action: text(state.action, '', 40),
      activeIndex: Number.isInteger(state.activeIndex) ? state.activeIndex : null
    };
  }
  return {
    matrix: list(state.matrix, (row) => list(row)),
    activeCell: list(state.activeCell, (item) => Number(item)).slice(0, 2),
    nodes: list(state.nodes, node),
    edges: list(state.edges, edge),
    active: list(state.active, (item) => text(item, '', 60))
  };
}

function validateVisualization(value, { lineCount = 0 } = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Visualization must be an object.');
  if (!CATEGORIES.has(value.category)) throw new Error('Unsupported visualization category.');
  if (!Array.isArray(value.steps) || !value.steps.length) throw new Error('Visualization steps are required.');

  const steps = value.steps.slice(0, MAX_STEPS).map((step, index) => {
    if (!step || typeof step !== 'object') throw new Error(`Invalid visualization step ${index + 1}.`);
    const line = step.line == null ? null : Number(step.line);
    if (line != null && (!Number.isInteger(line) || line < 1 || (lineCount > 0 && line > lineCount))) {
      throw new Error(`Invalid source line in visualization step ${index + 1}.`);
    }
    return {
      description: text(step.description, `Step ${index + 1}`),
      line,
      state: stateFor(value.category, step.state)
    };
  });

  return {
    version: 1,
    category: value.category,
    title: text(value.title, 'Algorithm trace', 100),
    steps
  };
}

function parseTutorVisualization(raw, options = {}) {
  const source = String(raw || '');
  const block = /```dsa-visualization\s*\n([\s\S]*?)```/i.exec(source);
  const reply = source.replace(/```dsa-visualization(?:\s*\n[\s\S]*?(?:```|$))?/gi, '').trim().replace(/\n{3,}/g, '\n\n');
  if (!block) return { reply, visualization: null };
  try {
    return { reply, visualization: validateVisualization(JSON.parse(block[1]), options) };
  } catch (_) {
    return { reply, visualization: null };
  }
}

module.exports = { CATEGORIES, validateVisualization, parseTutorVisualization };

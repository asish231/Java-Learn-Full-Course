/** Validate and extract the non-executable visualization contract emitted by Mercury. */
const CATEGORIES = new Set(['arrays', 'linked-list', 'tree-graph', 'stack-queue', 'dp-recursion']);
const MAX_STEPS = 80;
const MAX_ITEMS = 100;

function normalizeCategory(raw) {
  const cat = String(raw || '').toLowerCase().trim().replace(/_/g, '-');
  if (cat === 'array' || cat === 'arrays') return 'arrays';
  if (cat === 'linked-list' || cat === 'linkedlist' || cat === 'list') return 'linked-list';
  if (cat === 'tree-graph' || cat === 'tree' || cat === 'graph' || cat === 'trees' || cat === 'graphs') return 'tree-graph';
  if (cat === 'stack-queue' || cat === 'stack' || cat === 'queue') return 'stack-queue';
  if (cat === 'dp-recursion' || cat === 'dp' || cat === 'recursion' || cat === 'matrix' || cat === 'grid') return 'dp-recursion';
  return null;
}

function text(value, fallback = '', limit = 240) {
  if (value == null || value === '') return fallback;
  return String(value).slice(0, limit);
}

function scalar(value) {
  if (value == null || typeof value === 'boolean' || typeof value === 'number') return value;
  return text(value, '', 80);
}

function list(value, map = scalar) {
  return Array.isArray(value) ? value.slice(0, MAX_ITEMS).map(map) : [];
}

function node(value, index) {
  if (value == null) return { id: `node-${index}`, value: 'null', label: '', status: '' };
  if (typeof value !== 'object') {
    return { id: `node-${index}`, value: scalar(value), label: '', status: '' };
  }
  return {
    id: text(value.id || value.name || value.key, `node-${index}`, 60),
    value: scalar(value.value != null ? value.value : (value.val != null ? value.val : value.data)),
    label: text(value.label || value.pointer || value.ptr, '', 80),
    status: text(value.status || value.state, '', 30)
  };
}

function edge(value, index) {
  const row = value && typeof value === 'object' ? value : {};
  return {
    from: text(row.from || row.source || row.u, `node-${index}`, 60),
    to: text(row.to || row.target || row.v, `node-${index + 1}`, 60),
    label: text(row.label || row.weight, '', 40),
    status: text(row.status, '', 30)
  };
}

function normalizePointers(pointersVal, stateVal) {
  const result = [];
  if (Array.isArray(pointersVal)) {
    for (let i = 0; i < pointersVal.length; i++) {
      const p = pointersVal[i];
      if (p && typeof p === 'object') {
        const label = text(p.label || p.name || p.pointer || p.id, `p${i + 1}`, 20);
        const idx = Number.isInteger(p.index) ? p.index : (Number.isInteger(p.pos) ? p.pos : -1);
        result.push({ label, index: idx, status: text(p.status, '', 30) });
      } else if (Number.isInteger(p)) {
        result.push({ label: `p${i + 1}`, index: p, status: '' });
      }
    }
  } else if (pointersVal && typeof pointersVal === 'object') {
    for (const [key, val] of Object.entries(pointersVal)) {
      if (Number.isInteger(val)) {
        result.push({ label: key, index: val, status: '' });
      } else if (val && typeof val === 'object' && Number.isInteger(val.index)) {
        result.push({ label: key, index: val.index, status: text(val.status, '', 30) });
      }
    }
  }

  // Also check top-level state for single letter pointers like state.i = 0, state.k = 1
  if (stateVal && typeof stateVal === 'object') {
    for (const [key, val] of Object.entries(stateVal)) {
      if (['i', 'j', 'k', 'left', 'right', 'low', 'high', 'p', 'p1', 'p2', 'slow', 'fast', 'head', 'tail'].includes(key)) {
        if (Number.isInteger(val) && !result.some((p) => p.label === key)) {
          result.push({ label: key, index: val, status: '' });
        }
      }
    }
  }
  return result;
}

function stateFor(category, value) {
  const state = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const cat = normalizeCategory(category);

  if (cat === 'arrays') {
    const rawValues = state.values || state.array || state.arr || state.items || state.data || state.nums;
    const values = list(rawValues);
    const pointers = normalizePointers(state.pointers || state.pointer, state);
    const active = list(state.active || state.activeIndices || state.highlight, (item) => Number(item)).filter(Number.isFinite);
    return { values, pointers, active };
  }

  if (cat === 'linked-list' || cat === 'tree-graph') {
    const rawNodes = state.nodes || state.list || state.elements || state.tree;
    let nodes = list(rawNodes, node);
    let edges = list(state.edges || state.links, edge);

    // Auto generate linear edges for linked lists if omitted
    if (cat === 'linked-list' && nodes.length > 1 && !edges.length) {
      edges = nodes.slice(0, -1).map((n, idx) => ({
        from: n.id,
        to: nodes[idx + 1].id,
        label: 'next',
        status: ''
      }));
    }

    return {
      nodes,
      edges,
      active: list(state.active, (item) => text(item, '', 60)),
      visited: list(state.visited, (item) => text(item, '', 60))
    };
  }

  if (cat === 'stack-queue') {
    const rawItems = state.items || state.stack || state.queue || state.elements || state.values;
    return {
      items: list(rawItems),
      structure: (state.structure === 'queue' || cat === 'queue') ? 'queue' : 'stack',
      action: text(state.action || state.op || state.operation, '', 40),
      activeIndex: Number.isInteger(state.activeIndex) ? state.activeIndex : (Number.isInteger(state.top) ? state.top : null)
    };
  }

  // dp-recursion
  const rawMatrix = state.matrix || state.dp || state.grid || state.table;
  return {
    matrix: list(rawMatrix, (row) => list(row)),
    activeCell: list(state.activeCell || state.cell, (item) => Number(item)).slice(0, 2),
    nodes: list(state.nodes, node),
    edges: list(state.edges, edge),
    active: list(state.active, (item) => text(item, '', 60))
  };
}

function validateVisualization(value, { lineCount = 0 } = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Visualization must be an object.');
  const category = normalizeCategory(value.category);
  if (!category) throw new Error('Unsupported visualization category.');
  const rawSteps = value.steps || value.trace || value.frames || [];
  if (!Array.isArray(rawSteps) || !rawSteps.length) throw new Error('Visualization steps are required.');

  const steps = rawSteps.slice(0, MAX_STEPS).map((step, index) => {
    if (!step || typeof step !== 'object') throw new Error(`Invalid visualization step ${index + 1}.`);
    const line = step.line == null ? null : Number(step.line);
    if (line != null && (!Number.isInteger(line) || line < 1 || (lineCount > 0 && line > lineCount))) {
      throw new Error(`Invalid source line in visualization step ${index + 1}.`);
    }
    return {
      description: text(step.description || step.msg || step.title || step.note, `Step ${index + 1}`),
      line,
      state: stateFor(category, step.state || step)
    };
  });

  return {
    version: 1,
    category,
    title: text(value.title || value.name, 'Algorithm trace', 100),
    steps
  };
}

function parseTutorVisualization(raw, options = {}) {
  const source = String(raw || '');

  // 1. Explicit dsa-visualization block (strip block from reply regardless of JSON validity)
  const dsaMatch = /```dsa-visualization(?:\s*\n([\s\S]*?))?```/i.exec(source);
  if (dsaMatch) {
    const reply = source.replace(/```dsa-visualization(?:\s*\n[\s\S]*?(?:```|$))?/gi, '').trim().replace(/\n{3,}/g, '\n\n');
    let visualization = null;
    if (dsaMatch[1]) {
      try {
        visualization = validateVisualization(JSON.parse(dsaMatch[1].trim()), options);
      } catch (_) {}
    }
    return { reply, visualization };
  }

  // 2. Generic json / visualization or unfenced JSON payload matching
  let jsonString = null;
  let reply = source;

  const codeBlockRegex = /```(?:json|visualization)?\s*\n?([\s\S]*?)```/gi;
  let match;
  while ((match = codeBlockRegex.exec(source)) !== null) {
    const candidate = match[1].trim();
    if (candidate.startsWith('{') && (candidate.includes('"category"') || candidate.includes('"steps"') || candidate.includes('"version"') || candidate.includes('"trace"'))) {
      jsonString = candidate;
      reply = (source.slice(0, match.index) + source.slice(match.index + match[0].length)).trim();
      break;
    }
  }

  if (!jsonString) {
    const unfencedMatch = /(\{\s*"(?:version|category|title|steps)"[\s\S]*?\})\s*$/i.exec(source);
    if (unfencedMatch) {
      jsonString = unfencedMatch[1].trim();
      reply = source.slice(0, unfencedMatch.index).trim();
    }
  }

  if (!jsonString) return { reply, visualization: null };

  try {
    const parsed = JSON.parse(jsonString);
    const visualization = validateVisualization(parsed, options);
    return { reply, visualization };
  } catch (_) {
    return { reply, visualization: null };
  }
}

module.exports = { CATEGORIES, validateVisualization, parseTutorVisualization };

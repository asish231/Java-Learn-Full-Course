#!/usr/bin/env node
const assert = require('assert');
const {
  parseTutorVisualization,
  validateVisualization
} = require('../lib/tutor-visualization');

let checks = 0;

function check(name, fn) {
  fn();
  checks++;
  console.log(`  ✓ ${name}`);
}

const categories = [
  ['arrays', { values: [2, 7, 11], pointers: [{ label: 'L', index: 0 }, { label: 'R', index: 2 }] }],
  ['linked-list', { nodes: [{ id: 'a', value: 2 }, { id: 'b', value: 7 }], edges: [{ from: 'a', to: 'b' }] }],
  ['tree-graph', { nodes: [{ id: 'root', value: 2 }], edges: [], active: ['root'] }],
  ['stack-queue', { items: [2, 7], structure: 'stack', action: 'push' }],
  ['dp-recursion', { matrix: [[0, 1], [1, 2]], activeCell: [1, 1] }]
];

console.log('\nTutor visualization payloads');

for (const [category, state] of categories) {
  check(`accepts ${category}`, () => {
    const trace = validateVisualization({
      version: 1,
      category,
      title: `${category} trace`,
      steps: [{ description: 'Initial state', line: 2, state }]
    }, { lineCount: 4 });
    assert.equal(trace.category, category);
    assert.equal(trace.steps[0].line, 2);
  });
}

check('extracts a fenced payload and keeps prose separate', () => {
  const raw = 'Move both pointers inward.\n```dsa-visualization\n' + JSON.stringify({
    version: 1,
    category: 'arrays',
    title: 'Two pointers',
    steps: [{ description: 'Compare ends', line: 3, state: { values: [1, 4], pointers: [{ label: 'L', index: 0 }] } }]
  }) + '\n```\nContinue until they meet.';
  const parsed = parseTutorVisualization(raw, { lineCount: 5 });
  assert.equal(parsed.reply, 'Move both pointers inward.\n\nContinue until they meet.');
  assert.equal(parsed.visualization.steps.length, 1);
});

check('rejects unknown categories and invalid source lines', () => {
  assert.throws(() => validateVisualization({ version: 1, category: 'html', steps: [] }), /category/i);
  assert.throws(() => validateVisualization({
    version: 1,
    category: 'arrays',
    steps: [{ description: 'Bad line', line: 99, state: { values: [] } }]
  }, { lineCount: 3 }), /line/i);
});

check('ignores malformed model blocks without losing the explanation', () => {
  const parsed = parseTutorVisualization('Useful explanation.\n```dsa-visualization\n{"broken":\n```');
  assert.equal(parsed.reply, 'Useful explanation.');
  assert.equal(parsed.visualization, null);
});

check('caps oversized traces and state collections', () => {
  const steps = Array.from({ length: 100 }, (_, index) => ({
    description: `Step ${index}`,
    line: 1,
    state: { values: Array.from({ length: 200 }, (_, value) => value) }
  }));
  const trace = validateVisualization({ version: 1, category: 'arrays', steps });
  assert.equal(trace.steps.length, 80);
  assert.equal(trace.steps[0].state.values.length, 100);
});

console.log(`\n${checks}/${checks} visualization checks passed.`);

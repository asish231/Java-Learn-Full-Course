#!/usr/bin/env node
/**
 * Regenerates each src module README with relative links and a study order.
 * Step files are the real teaching path. Level files are recaps.
 * Other files are extra drills of the same patterns.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'src');

const META = {
  module01_foundations: {
    title: 'Foundations & Big-O',
    why: 'Interviewers ask for complexity, not just a passing test. Learn to derive time and space before writing code.',
    start: 'Step01_ConstantAndLinearTime.java'
  },
  module02_arrays_and_strings: {
    title: 'Arrays & Strings',
    why: 'The highest-frequency interview chapter: two pointers, sliding windows, Kadane, intervals, bits, and matrices.',
    start: 'Step01_BasicArrayOperations.java'
  },
  module03_linked_lists: {
    title: 'Linked Lists',
    why: 'Reversal, fast/slow pointers, cycle detection, and LRU cache are the list questions companies actually ask.',
    start: 'Step01_SinglyLinkedListBasics.java'
  },
  module04_stacks_and_queues: {
    title: 'Stacks & Queues',
    why: 'Matching parentheses, monotonic stacks, histograms, and rain water all share one LIFO/FIFO idea.',
    start: 'Step01_ArrayStackImplementation.java'
  },
  module05_hashing: {
    title: 'Hashing',
    why: 'O(1) lookup is how Two Sum, anagrams, consecutive sequence, and prefix-sum problems become linear.',
    start: 'Step01_HashFunctionsAndDirectAddressing.java'
  },
  module06_trees_and_bst: {
    title: 'Trees & BST',
    why: 'Traversals, BST invariants, LCA, and serialization cover almost every binary-tree interview.',
    start: 'Step01_TreeNodeStructure.java'
  },
  module07_heaps_and_priority_queues: {
    title: 'Heaps & Priority Queues',
    why: 'Top-K, heap sort, and the running-median pattern show up in both coding rounds and system design.',
    start: 'Step01_PriorityQueueBasics.java'
  },
  module08_disjoint_set_and_trie: {
    title: 'Union-Find, Tries & Strings',
    why: 'Connected components, prefix search, Word Search II, and KMP are the string/graph glue topics.',
    start: 'Step01_DisjointSetUnionNaive.java'
  },
  module09_sorting_and_searching: {
    title: 'Sorting & Searching',
    why: 'Know the trade-offs, then master the binary-search template including search-on-answer.',
    start: 'Step01_LinearVsBinarySearch.java'
  },
  module10_recursion_and_backtracking: {
    title: 'Recursion & Backtracking',
    why: 'One choose / explore / un-choose skeleton unlocks subsets, permutations, N-Queens, and Sudoku.',
    start: 'Step01_RecursionBasics.java'
  },
  module11_greedy_algorithms: {
    title: 'Greedy Algorithms',
    why: 'Interval scheduling, jump game, gas station, and candy: prove the local choice is safe, or switch to DP.',
    start: 'Step01_AssignCookiesBasics.java'
  },
  module12_dynamic_programming: {
    title: 'Dynamic Programming',
    why: 'Memo → table → space cut. 1D, knapsack, LCS, edit distance, and grid DP.',
    start: 'Step01_ClimbingStairsMemoAndTab.java'
  },
  module13_graph_algorithms: {
    title: 'Graph Algorithms',
    why: 'BFS/DFS, islands, topological sort, Dijkstra, Bellman-Ford, and MST.',
    start: 'Step01_GraphRepresentations.java'
  },
  backend_engineering: {
    title: 'Backend Engineering',
    why: 'HTTP, routing, JWT, SQL, cache, sockets, path params, and an in-process message queue — miniature versions of production pieces.',
    start: 'HTTPClientServer.java'
  },
  quickstart: {
    title: 'Java Warm-up',
    why: 'ArrayList, HashMap, ArrayDeque, and PriorityQueue — the four collections every interview answer uses.',
    start: 'ArrayAndListQuickstart.java'
  },
  micro: {
    title: 'Micro Drills',
    why: 'Sixty-second from-scratch builds so syntax stops being the bottleneck.',
    start: 'CreateArray.java'
  },
  interview_prep: {
    title: 'Interview Prep Beyond DSA',
    why: 'STAR stories, system-design walkthroughs, resume bullets, and a live-interview playbook.',
    start: 'BehavioralSTAR.java'
  }
};

function kindOf(name) {
  if (name.startsWith('Step')) return 'step';
  if (name.startsWith('Level')) return 'level';
  return 'extra';
}

function link(file) {
  return `- [\`${file}\`](./${file})`;
}

for (const dir of fs.readdirSync(ROOT).sort()) {
  const abs = path.join(ROOT, dir);
  if (!fs.statSync(abs).isDirectory()) continue;
  const files = fs.readdirSync(abs).filter((f) => f.endsWith('.java')).sort();
  if (!files.length) continue;
  const meta = META[dir] || { title: dir, why: 'Runnable Java lessons for this chapter.', start: files[0] };
  const steps = files.filter((f) => kindOf(f) === 'step');
  const levels = files.filter((f) => kindOf(f) === 'level');
  const extras = files.filter((f) => kindOf(f) === 'extra');

  const lines = [
    `# ${meta.title}`,
    '',
    meta.why,
    '',
    '## How to study this folder',
    '',
    '1. Open the **Step** files in order. Those are the real lessons (traces, diagrams, multiple cases).',
    '2. Use **Level 1 / 2 / 3** as recaps, not as a second copy of the same topic.',
    '3. Extra files are drills of the same patterns — skip them if the Step file already clicked.',
    '',
    `Start here: [\`${meta.start}\`](./${meta.start})`,
    ''
  ];
  if (steps.length) {
    lines.push('## Step path (read these)', '', ...steps.map(link), '');
  }
  if (levels.length) {
    lines.push('## Recap tiers', '', ...levels.map(link), '');
  }
  if (extras.length) {
    lines.push('## Extra drills', '', ...extras.map(link), '');
  }
  fs.writeFileSync(path.join(abs, 'README.md'), lines.join('\n'));
  console.log('wrote', dir, files.length, 'files');
}

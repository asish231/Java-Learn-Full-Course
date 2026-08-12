/**
 * curriculum.js — the learning model of the studio.
 *
 * A chapter maps 1:1 to a folder in `src/`. Each chapter declares what it
 * teaches (topics), why it matters and which lessons it contains; lessons are
 * discovered from the filesystem and enriched with the metadata below.
 *
 * Topics are the glue between learning and practice: every curated problem
 * declares topics, so the studio can answer "what should I learn before I try
 * this question?" and "which questions practise what I just read?".
 */

const TOPICS = {
  'big-o': { label: 'Complexity Analysis', chapter: 'module01_foundations' },
  'recursion': { label: 'Recursion', chapter: 'module10_recursion_and_backtracking' },
  'array': { label: 'Arrays', chapter: 'module02_arrays_and_strings' },
  'string': { label: 'Strings', chapter: 'module02_arrays_and_strings' },
  'two-pointers': { label: 'Two Pointers', chapter: 'module02_arrays_and_strings' },
  'sliding-window': { label: 'Sliding Window', chapter: 'module02_arrays_and_strings' },
  'prefix-sum': { label: 'Prefix Sums', chapter: 'module05_hashing' },
  'matrix': { label: 'Matrices', chapter: 'module02_arrays_and_strings' },
  'linked-list': { label: 'Linked Lists', chapter: 'module03_linked_lists' },
  'stack': { label: 'Stacks', chapter: 'module04_stacks_and_queues' },
  'queue': { label: 'Queues', chapter: 'module04_stacks_and_queues' },
  'hash-table': { label: 'Hash Tables', chapter: 'module05_hashing' },
  'tree': { label: 'Binary Trees', chapter: 'module06_trees_and_bst' },
  'bst': { label: 'Binary Search Trees', chapter: 'module06_trees_and_bst' },
  'heap': { label: 'Heaps & Priority Queues', chapter: 'module07_heaps_and_priority_queues' },
  'trie': { label: 'Tries', chapter: 'module08_disjoint_set_and_trie' },
  'union-find': { label: 'Union Find', chapter: 'module08_disjoint_set_and_trie' },
  'sorting': { label: 'Sorting', chapter: 'module09_sorting_and_searching' },
  'binary-search': { label: 'Binary Search', chapter: 'module09_sorting_and_searching' },
  'backtracking': { label: 'Backtracking', chapter: 'module10_recursion_and_backtracking' },
  'greedy': { label: 'Greedy', chapter: 'module11_greedy_algorithms' },
  'intervals': { label: 'Intervals', chapter: 'module11_greedy_algorithms' },
  'dp': { label: 'Dynamic Programming', chapter: 'module12_dynamic_programming' },
  'graph': { label: 'Graphs', chapter: 'module13_graph_algorithms' },
  'bfs': { label: 'Breadth-First Search', chapter: 'module13_graph_algorithms' },
  'dfs': { label: 'Depth-First Search', chapter: 'module13_graph_algorithms' },
  'bit-manipulation': { label: 'Bit Manipulation', chapter: 'module01_foundations' },
  'math': { label: 'Math & Number Theory', chapter: 'module01_foundations' },
  'design': { label: 'Data Structure Design', chapter: 'module03_linked_lists' },
  'system-design': { label: 'System Design', chapter: 'interview_prep' },
  'behavioral': { label: 'Behavioral Interviews', chapter: 'interview_prep' }
};

const LEVEL_META = {
  1: { name: 'Warm-up', difficulty: 'Easy', minutes: 15 },
  2: { name: 'Core patterns', difficulty: 'Medium', minutes: 30 },
  3: { name: 'Interview grade', difficulty: 'Hard', minutes: 45 }
};

/**
 * Chapters, in curriculum order. `dir` is the folder under `src/`.
 */
const CHAPTERS = [
  {
    id: 'quickstart',
    dir: 'quickstart',
    order: 0,
    icon: '🌱',
    title: 'Java Warm-up: Collections You Actually Use',
    track: 'foundations',
    minutes: 60,
    summary: 'Get fluent with ArrayList, HashMap, ArrayDeque and PriorityQueue before touching a single algorithm.',
    why: 'Almost every interview answer is built out of four collections. Knowing their methods by heart removes the friction that makes DSA feel hard.',
    topics: ['array', 'hash-table', 'stack', 'queue', 'heap'],
    objectives: [
      'Create, grow and iterate lists without fighting the API',
      'Use HashMap/HashSet for O(1) membership and counting',
      'Pick ArrayDeque for both stack and queue behaviour',
      'Order elements on the fly with PriorityQueue and comparators'
    ],
    prerequisites: []
  },
  {
    id: 'micro',
    dir: 'micro',
    order: 1,
    icon: '🧩',
    title: 'Micro Drills',
    track: 'foundations',
    minutes: 30,
    summary: 'Sixty-second exercises: build each core structure from scratch, one file at a time.',
    why: 'Muscle memory. Type them, run them, break them — this is the cheapest way to make syntax automatic.',
    topics: ['array', 'hash-table', 'linked-list', 'stack', 'heap'],
    objectives: [
      'Write each structure from a blank file without looking things up',
      'Recognise the default capacity/growth behaviour of each structure'
    ],
    prerequisites: ['quickstart']
  },
  {
    id: 'module01_foundations',
    dir: 'module01_foundations',
    order: 2,
    icon: '📐',
    title: 'Foundations & Big-O',
    track: 'dsa',
    minutes: 90,
    summary: 'Time and space complexity, amortised analysis and how recursion consumes the call stack.',
    why: 'Interviewers do not ask "is it correct?" — they ask "what is the complexity?". Everything after this chapter is judged in Big-O.',
    topics: ['big-o', 'math', 'bit-manipulation'],
    objectives: [
      'Derive the complexity of loops, nested loops and recursive calls',
      'Explain why ArrayList.add() is O(1) amortised',
      'Reason about stack depth and memory used by recursion'
    ],
    prerequisites: ['quickstart']
  },
  {
    id: 'module02_arrays_and_strings',
    dir: 'module02_arrays_and_strings',
    order: 3,
    icon: '🔤',
    title: 'Arrays & Strings',
    track: 'dsa',
    minutes: 150,
    summary: 'In-place manipulation, the two-pointer family and sliding windows — the highest ROI patterns in interviews.',
    why: 'Roughly one third of all interview questions are an array or string in disguise. These three patterns solve most of them.',
    topics: ['array', 'string', 'two-pointers', 'sliding-window', 'matrix'],
    objectives: [
      'Manipulate arrays in place with O(1) extra space',
      'Choose between opposite-end and same-direction pointers',
      'Grow and shrink a window to satisfy a constraint',
      'Handle the classic off-by-one and empty-input edge cases'
    ],
    prerequisites: ['module01_foundations']
  },
  {
    id: 'module03_linked_lists',
    dir: 'module03_linked_lists',
    order: 4,
    icon: '🔗',
    title: 'Linked Lists',
    track: 'dsa',
    minutes: 120,
    summary: 'Pointer surgery: reversal, fast/slow pointers, dummy heads, and a doubly linked list powering an LRU cache.',
    why: 'Linked list questions test whether you can keep several references straight in your head — and they are a favourite for on-site whiteboards.',
    topics: ['linked-list', 'two-pointers', 'design'],
    objectives: [
      'Reverse a list iteratively and recursively',
      'Detect a cycle and find its entry point with Floyd’s algorithm',
      'Use a dummy head to remove all edge-case branching',
      'Combine a hash map with a doubly linked list for O(1) cache operations'
    ],
    prerequisites: ['module02_arrays_and_strings']
  },
  {
    id: 'module04_stacks_and_queues',
    dir: 'module04_stacks_and_queues',
    order: 5,
    icon: '🥞',
    title: 'Stacks & Queues',
    track: 'dsa',
    minutes: 120,
    summary: 'LIFO/FIFO fundamentals, circular buffers and the monotonic stack that turns O(n²) scans into O(n).',
    why: '"Next greater element", histograms and rain water all collapse to one idea: a stack that stays sorted.',
    topics: ['stack', 'queue'],
    objectives: [
      'Implement a stack and a circular queue over an array',
      'Recognise when a problem is really "next greater / next smaller"',
      'Apply a monotonic stack to histogram and rain-water problems'
    ],
    prerequisites: ['module03_linked_lists']
  },
  {
    id: 'module05_hashing',
    dir: 'module05_hashing',
    order: 6,
    icon: '🗝️',
    title: 'Hashing & Hash Maps',
    track: 'dsa',
    minutes: 120,
    summary: 'How hash maps really work (chaining vs linear probing), plus frequency counting and prefix-sum tricks.',
    why: 'A hash map is the single most common way to trade memory for time. Knowing its internals lets you defend your O(1) claim.',
    topics: ['hash-table', 'prefix-sum'],
    objectives: [
      'Explain collisions, load factor and resizing',
      'Count frequencies and group by key idiomatically',
      'Use prefix sums + a map to count subarrays in one pass'
    ],
    prerequisites: ['module02_arrays_and_strings']
  },
  {
    id: 'module06_trees_and_bst',
    dir: 'module06_trees_and_bst',
    order: 7,
    icon: '🌳',
    title: 'Trees & Binary Search Trees',
    track: 'dsa',
    minutes: 150,
    summary: 'Traversals (all four), recursive tree reasoning, BST invariants and level-order processing.',
    why: 'Trees are where recursion becomes natural. Every graph question you meet later is a tree question with cycles.',
    topics: ['tree', 'bst', 'bfs', 'dfs', 'recursion'],
    objectives: [
      'Write pre/in/post-order traversals iteratively and recursively',
      'Solve tree problems by asking "what do I need from my children?"',
      'Validate a BST with bounds instead of local comparisons',
      'Use a queue for level-order / BFS on trees'
    ],
    prerequisites: ['module03_linked_lists', 'module04_stacks_and_queues']
  },
  {
    id: 'module07_heaps_and_priority_queues',
    dir: 'module07_heaps_and_priority_queues',
    order: 8,
    icon: '⛰️',
    title: 'Heaps & Priority Queues',
    track: 'dsa',
    minutes: 120,
    summary: 'Binary heap mechanics, heap sort, top-K selection and the two-heap running median.',
    why: '"Top K" and "median of a stream" appear constantly, and both are one-liners once heaps click.',
    topics: ['heap', 'sorting'],
    objectives: [
      'Implement sift-up / sift-down and understand O(log n) updates',
      'Solve top-K with a bounded heap instead of a full sort',
      'Maintain a running median with a max-heap plus a min-heap'
    ],
    prerequisites: ['module06_trees_and_bst']
  },
  {
    id: 'module08_disjoint_set_and_trie',
    dir: 'module08_disjoint_set_and_trie',
    order: 9,
    icon: '🌲',
    title: 'Tries & Disjoint Sets',
    track: 'dsa',
    minutes: 120,
    summary: 'Prefix trees for word problems and union-find with path compression for connectivity.',
    why: 'Two specialist structures that make otherwise impossible questions (Word Search II, connected components) tractable.',
    topics: ['trie', 'union-find', 'string'],
    objectives: [
      'Insert and search words in a trie in O(length)',
      'Prune a DFS grid search with a trie',
      'Union by rank + path compression, and why it is near O(1)'
    ],
    prerequisites: ['module06_trees_and_bst']
  },
  {
    id: 'module09_sorting_and_searching',
    dir: 'module09_sorting_and_searching',
    order: 10,
    icon: '🔍',
    title: 'Sorting & Searching',
    track: 'dsa',
    minutes: 150,
    summary: 'Elementary and advanced sorts, then the binary search template that survives rotations and answer spaces.',
    why: 'Binary search is the most frequently botched pattern in interviews. One template fixes that forever.',
    topics: ['sorting', 'binary-search'],
    objectives: [
      'Compare merge sort, quick sort and their stability/space trade-offs',
      'Write a binary search with no off-by-one bugs',
      'Binary search on the answer, not just on an array'
    ],
    prerequisites: ['module01_foundations']
  },
  {
    id: 'module10_recursion_and_backtracking',
    dir: 'module10_recursion_and_backtracking',
    order: 11,
    icon: '🪆',
    title: 'Recursion & Backtracking',
    track: 'dsa',
    minutes: 150,
    summary: 'Recursion mechanics, the choose/explore/un-choose template, and heavyweight searches like N-Queens and Sudoku.',
    why: 'Backtracking is one template. Learn it once and subsets, permutations, combinations and word search all fall out.',
    topics: ['recursion', 'backtracking'],
    objectives: [
      'Identify the base case and the shrinking parameter',
      'Apply the choose / explore / un-choose skeleton',
      'Prune search trees to keep exponential problems feasible'
    ],
    prerequisites: ['module02_arrays_and_strings']
  },
  {
    id: 'module11_greedy_algorithms',
    dir: 'module11_greedy_algorithms',
    order: 12,
    icon: '🎯',
    title: 'Greedy Algorithms',
    track: 'dsa',
    minutes: 90,
    summary: 'Exchange arguments, activity selection, fractional knapsack and interval scheduling.',
    why: 'Greedy is fast to write but easy to get wrong — the skill is proving (or disproving) that the local choice is safe.',
    topics: ['greedy', 'intervals', 'sorting'],
    objectives: [
      'State the greedy choice and argue why it is optimal',
      'Sort by the right key for interval problems',
      'Recognise when greedy fails and DP is required'
    ],
    prerequisites: ['module09_sorting_and_searching']
  },
  {
    id: 'module12_dynamic_programming',
    dir: 'module12_dynamic_programming',
    order: 13,
    icon: '🧠',
    title: 'Dynamic Programming',
    track: 'dsa',
    minutes: 210,
    summary: 'From memoised recursion to bottom-up tables: 1D, 2D, knapsack, edit distance and space optimisation.',
    why: 'The chapter people skip and then fail on. Done in the right order — recursion → memo → table — it is mechanical.',
    topics: ['dp', 'recursion'],
    objectives: [
      'Define a state and write the recurrence before any code',
      'Convert top-down memoisation into a bottom-up table',
      'Reduce a 2D table to O(n) rows when only the last row is needed'
    ],
    prerequisites: ['module10_recursion_and_backtracking']
  },
  {
    id: 'module13_graph_algorithms',
    dir: 'module13_graph_algorithms',
    order: 14,
    icon: '🕸️',
    title: 'Graph Algorithms',
    track: 'dsa',
    minutes: 180,
    summary: 'Representations, BFS/DFS, topological sort, and Dijkstra for weighted shortest paths.',
    why: 'Grids, dependencies, networks and course schedules are all graphs. BFS/DFS alone covers most interview graph questions.',
    topics: ['graph', 'bfs', 'dfs'],
    objectives: [
      'Choose adjacency list vs matrix and justify it',
      'Traverse grids as implicit graphs',
      'Detect cycles and produce a topological order',
      'Run Dijkstra with a priority queue'
    ],
    prerequisites: ['module06_trees_and_bst', 'module07_heaps_and_priority_queues']
  },
  {
    id: 'backend_engineering',
    dir: 'backend_engineering',
    order: 15,
    icon: '🏗️',
    title: 'Backend Engineering Mastery',
    track: 'backend',
    minutes: 240,
    summary: 'Hand-built HTTP server, REST router, JWT auth, an in-memory cache and a tiny SQL engine — in plain Java.',
    why: 'Systems questions reward people who have actually built the pieces. Each file here is a miniature of a real production component.',
    topics: ['hash-table', 'design'],
    objectives: [
      'Explain the request lifecycle from socket to handler',
      'Route and parse a REST request by hand',
      'Sign and verify a JWT, and store passwords safely',
      'Reason about cache eviction and TTLs'
    ],
    prerequisites: ['module05_hashing']
  },
  {
    id: 'interview_prep',
    dir: 'interview_prep',
    order: 16,
    icon: '🎯',
    title: 'Interview Prep Beyond DSA',
    track: 'career',
    minutes: 120,
    summary: 'STAR stories, system-design walkthroughs, resume bullets, and a live-coding playbook — the rounds that are not a LeetCode submit.',
    why: 'Offers fail when the coding round is the only thing you practised. Interviewers also grade how you design, how you talk, and whether your projects survive a hiring-manager skim.',
    topics: ['system-design', 'behavioral', 'design'],
    objectives: [
      'Tell five STAR stories in 90 seconds each without reading notes',
      'Walk a URL shortener and a rate limiter from requirements to trade-offs',
      'Rewrite resume bullets as verb + constraint + measured result',
      'Narrate a live coding round: restate, brute force, tests, then code'
    ],
    prerequisites: ['module02_arrays_and_strings']
  }
];

/**
 * Learning paths — the "what do you want to learn?" choice on the home screen.
 */
const PATHS = [
  {
    id: 'zero-to-hero',
    title: 'Zero to Hero',
    icon: '🎓',
    tagline: 'The complete journey, in order',
    description: 'Start from Java collections and finish on graphs and dynamic programming. Nothing skipped, nothing out of order.',
    weeks: 12,
    chapters: CHAPTERS.map((c) => c.id)
  },
  {
    id: 'interview-sprint',
    title: 'Interview Sprint',
    icon: '⚡',
    tagline: 'Four weeks to an on-site',
    description: 'The highest-frequency patterns only: arrays, hashing, two pointers, trees, graphs, DP — each paired with the questions companies actually ask.',
    weeks: 4,
    chapters: [
      'module02_arrays_and_strings', 'module05_hashing', 'module04_stacks_and_queues',
      'module06_trees_and_bst', 'module09_sorting_and_searching',
      'module13_graph_algorithms', 'module12_dynamic_programming', 'interview_prep'
    ]
  },
  {
    id: 'absolute-beginner',
    title: 'Absolute Beginner',
    icon: '🌱',
    tagline: 'Never written Java? Start here',
    description: 'Collections, syntax drills and Big-O first. Gentle slope, lots of running code, no interview pressure.',
    weeks: 6,
    chapters: [
      'quickstart', 'micro', 'module01_foundations', 'module02_arrays_and_strings',
      'module03_linked_lists', 'module04_stacks_and_queues', 'module05_hashing'
    ]
  },
  {
    id: 'backend-builder',
    title: 'Backend Builder',
    icon: '🏗️',
    tagline: 'Systems, not just puzzles',
    description: 'Data structures that back real services, then build an HTTP server, REST router, JWT auth and a cache from scratch.',
    weeks: 6,
    chapters: ['quickstart', 'module05_hashing', 'module03_linked_lists', 'backend_engineering', 'interview_prep']
  }
];

function getChapter(id) {
  return CHAPTERS.find((c) => c.id === id) || null;
}

function getPath(id) {
  return PATHS.find((p) => p.id === id) || null;
}

/** Chapters that teach the given topic slugs, in curriculum order. */
function chaptersForTopics(topics = []) {
  const wanted = new Set(topics.map((t) => (TOPICS[t] ? TOPICS[t].chapter : null)).filter(Boolean));
  return CHAPTERS.filter((c) => wanted.has(c.id)).sort((a, b) => a.order - b.order);
}

function topicLabel(slug) {
  return TOPICS[slug] ? TOPICS[slug].label : slug;
}

module.exports = { TOPICS, LEVEL_META, CHAPTERS, PATHS, getChapter, getPath, chaptersForTopics, topicLabel };

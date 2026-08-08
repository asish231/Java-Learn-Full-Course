# ☕ Java DSA Studio

A local learning studio for Java data structures, algorithms and interview prep:
a structured curriculum you can **run**, interview questions that are actually **graded**
against real test cases, an editor built for learning, and an **AI tutor** that can see
your code, your failing test case and your history.

```bash
cd web
npm install
cp .env.example .env        # add your Mercury (Inception Labs) key for the AI tutor
npm start                   # → http://localhost:3000
```

Requires **Node 18+** and a **JDK** on your `PATH` (`javac` / `java` are used to compile and run submissions).

---

## What is inside

| | |
|---|---|
| **16 chapters / 178 runnable lessons** | The `src/` curriculum: every `.java` file is a lesson you can read, edit and execute in the browser |
| **Guided problem bank** | Interview problems with a full statement, worked examples, constraints, three staged hints, an editorial and machine-checked test cases |
| **654 companies / 17,641 questions** | The `leetcode_companywise/` lists, filterable by recency and difficulty |
| **AI tutor (Mercury 2)** | Streams answers, remembers you between sessions, and reads the problem + your editor + your last run |
| **Progress tracker** | Streak, activity heatmap, per-chapter completion, strong/weak topics, saved drafts |

---

## How the learning loop works

1. **Onboard** — pick a goal, a starting level and a daily budget. That selects a learning path
   (*Zero to Hero*, *Interview Sprint*, *Absolute Beginner*, *Backend Builder*).
2. **Learn** — open a chapter, read a lesson and run it. Every lesson is real Java that prints real output.
3. **Practise** — open a question. Before writing code you can hit **Learn first**: the studio
   assembles the chapters, lessons and easier questions you should do first, from your own library.
4. **Submit** — *Run samples* checks the visible cases, *Submit* runs every case and returns
   a per-case verdict with expected vs. your output. Compile errors are reported at *your* line numbers.
5. **Debrief** — after solving, read the editorial or ask the tutor what to take away and what to try next.

---

## The AI tutor

Set `MERCURY_API_KEY` in `web/.env` (git-ignored; `web/.env.example` is the template). Without a key the
app works fine and the tutor panel is simply disabled.

The tutor has six modes, all available from the panel next to the editor:

| Mode | What it does |
|---|---|
| **Explain** | Restates the problem in plain language without revealing the algorithm |
| **Learn first** | Builds an ordered study plan from the curriculum + easier bank questions |
| **Hint** | One smallest-next-step nudge, based on how far your code already got |
| **Review my code** | Points at the first real bug in *your* code, with the fix and the complexity |
| **Visualize** | Builds a validated step trace for arrays, linked lists, trees/graphs, stacks/queues, or DP/recursion, with Play/Pause/Previous/Next controls and speed selection |
| **Debrief** | After a solve: the pattern, the optimal complexity, and what to do next |

Visualization steps highlight their matching Java source line in the editor. Mercury emits a bounded JSON state block; the server validates and sanitizes it before the UI renders text and SVG, so model-generated HTML or executable code is never trusted.

It also keeps **long-term memory**: durable notes about your goals, misconceptions and mastered topics,
plus automatically tracked strong/weak topics. Everything it remembers is visible — and deletable — on the
**Progress** page.

---

## Learning OS (analytics, assessments, career)

The studio tracks **your real behaviour** only — no seeded mastery, fake streaks, demo readiness %, or claimed hiring probabilities.

| Piece | What it does |
|---|---|
| **Events** | Lesson/problem opens, focus buckets with **active vs idle typing time**, sample runs, submits, tutor messages → `state.json` event log. Topics are resolved server-side, so a signal always lands on the right map node |
| **Feature engine** | Explainable mastery and company-topic readiness from accuracy, recency, tutor dependence, measured active-coding ratio (`web/lib/analytics.js`) — works **offline**, every score ships with evidence and limitations |
| **Knowledge map + SRS** | Topic nodes fade over time; overdue items hit the revise queue. Insights draws the map (node size/colour = real mastery, edges = topics you practise together) |
| **Daily goals** | Checklist from your path + weak/due topics, tickable on Home **and** Insights |
| **Timed mocks** | Real guided bank + Java judge. The clock is enforced **on the server**: a late answer is refused and the session auto-submits; answering the last item scores it immediately |
| **Placement assessment v1** | Deterministic topic diagnostics, balanced difficulty blueprints, server-only generated cases, honest confidence labels, and an evidence-backed seven-day revision plan. Readiness measures topic preparation, **not hiring probability** |
| **Active-learning lessons** | Prerequisite status, retrieval checkpoints, misconception callouts, and post-lesson reflections are attached to the 178 runnable lessons. Retrieval evidence is stored separately and never counted as a solved coding problem |
| **Secure local judge** | Each submission runs in a private temporary directory with JVM memory/CPU/time limits. On macOS, Seatbelt also blocks user-profile reads, external writes, network access, and subprocesses; security probes run in `npm run check` |
| **Durable data** | State writes use fsync + atomic rename, rotate three valid backups, and recover from corruption. Progress offers checksummed export/import; modified exports are rejected |
| **Complete placement prep** | `#/placement` adds CS fundamentals, system design, behavioral communication, resume/projects, applications, and transparent interview rubrics. All progress comes from recorded evidence; outcomes never become a claimed hiring probability |
| **Session notes** | On session end, Mercury writes the note (badged **AI** in the feed); without a key a local template is stored instead |
| **Career days** | Default Wed/Sun counselling view grounded on the same real feature vector, with its own persisted thread |
| **Personal records** | You vs past weeks — best streak, best mock, weekly XP |

UI routes: `#/insights`, `#/mock`, `#/career`, `#/placement`. Assessment APIs: `/api/diagnostics`, `/api/revision-plan`, `/api/revise?days=7`; backup APIs: `/api/data/export`, `/api/data/import`, `/api/data/health`; placement APIs live under `/api/placement`; other Learning OS APIs remain under `/api/events`, `/api/insights`, `/api/graph`, `/api/goals/today`, `/api/mocks`, `/api/notes`, `/api/counsel/*`, and `/api/records`.

**Practice never lies to the analytics:** *Run samples* is logged as practice only — accuracy, attempts-to-solve and mastery move on **Submit** alone.

### Checking it yourself

```bash
cd web
npm test                    # fixture tests: mastery, SRS, mock rules, records (offline, no judge)
npm run smoke               # boots the server and exercises every route
npm run check               # test + smoke + problem-bank verifier
```

Both suites run against a **scratch state file**, so they never touch your real progress.

| Variable | Use |
|---|---|
| `DSA_STORE_FILE` | Point the store at another JSON file (used by the tests) |
| `MERCURY_DISABLED=1` | Force the offline path — scores, goals and mocks must still work with the tutor down |

---

## The editor

Built for learning rather than for looking fancy:

- smart auto-indentation (block-aware Enter, `{|}` expansion)
- auto-closing brackets and quotes, type-over, paired backspace
- `Tab` / `Shift-Tab` indent for the line or the whole selection
- `⌘/Ctrl + /` comment toggle, `Alt + ↑/↓` move line, `⌘/Ctrl + D` duplicate line
- `⌘/Ctrl + Shift + F` re-indent the file, `⌘/Ctrl + Enter` run, `⌘/Ctrl + S` save draft
- live Java syntax colouring, line numbers, tutor-synchronized execution-line highlighting, cursor position, adjustable font size
- drafts autosave per problem, so you can leave and come back

Global: `⌘/Ctrl + K` opens a command palette over every chapter, lesson, problem and company.

---

## Adding a problem to the guided bank

Guided problems live in `web/data/bank/*.js`. Copy the shape from
[`bank-00-reference.js`](web/data/bank/bank-00-reference.js) and run the quality gate:

```bash
cd web
node tools/verify-bank.js                          # verify everything
node tools/verify-bank.js --file bank-01-arrays-strings.js
node tools/verify-bank.js 1 121 704                # verify selected ids
```

The verifier refuses a problem unless the required fields are present, **its own reference solution
passes every one of its test cases**, and the starter code compiles. That is why the bank can be trusted.

A test case is a Java expression evaluated against your `Solution` instance:

```js
{ name: 'Example 1', input: 'nums = [2,7,11,15], target = 9',
  expr: 'Arrays.toString(sol.twoSum(new int[]{2,7,11,15}, 9))', expected: '[0, 1]' }
```

Optional per-test `setup` (statements to run first) and `unordered: true` (order-insensitive compare),
plus a per-problem `testHelpers` string for builders like `buildTree(...)` / `listToString(...)`.

---

## Project layout

```
src/                        the Java curriculum — one folder per chapter
leetcode_companywise/       company question lists (CSV)
web/
  server.js                 HTTP API + static hosting
  data/curriculum.js        chapters, topics, learning paths
  data/bank/*.js            curated problems (statement + tests + editorial)
  lib/judge.js              compiles and grades Java submissions
  lib/catalog.js            merges lessons + company lists into one catalog
  lib/store.js              profile, progress, streaks, events, topics, mocks (JSON on disk)
  lib/analytics.js          feature engine: mastery, company readiness, graph, patterns
  lib/assessment.js         diagnostics, private cases, seven-day revision plans
  lib/placement.js          non-DSA tracks, interview rubrics, applications/outcomes
  lib/srs.js                spaced repetition: decay, review dates, revise queue
  lib/mock.js               timed test builder + server-side exam clock
  lib/jobs.js               session notes, daily goals, counselling schedule
  lib/tutor.js              Mercury 2 tutor: context, modes, memory, narration
  tools/verify-bank.js      quality gate for the problem bank
  tools/test-analytics.js   fixture tests for the Learning OS logic
  tools/smoke.js            end-to-end route check
  public/                   the single-page front end (vanilla ES modules)
```

Learner state is written to `web/data/store/state.json` (git-ignored). Delete it, or use
**Reset progress** on the Progress page, to start over.

---

## Running the Java curriculum directly

The lessons are ordinary Java files, so you can also run them without the studio:

```bash
javac src/module*/*.java
java -cp src module02_arrays_and_strings.Level1_BasicArrayOps
```

Each module folder follows the same 3-tier progression:

1. 🟢 **Level 1 — Warm-up**: fundamentals, syntax, step-by-step traces
2. 🟡 **Level 2 — Core patterns**: the medium-difficulty interview patterns
3. 🔴 **Level 3 — Interview grade**: hard problems (LRU cache, sliding-window max, Dijkstra, edit distance, …)

| # | Module | Focus |
|---|---|---|
| 01 | `module01_foundations` | Big-O, amortised analysis, recursion cost |
| 02 | `module02_arrays_and_strings` | In-place ops, two pointers, sliding window |
| 03 | `module03_linked_lists` | Reversal, fast/slow pointers, LRU cache |
| 04 | `module04_stacks_and_queues` | LIFO/FIFO, monotonic stack, histogram & rain water |
| 05 | `module05_hashing` | Hash map internals, frequency counting, prefix sums |
| 06 | `module06_trees_and_bst` | Traversals, recursive tree reasoning, BST invariants |
| 07 | `module07_heaps_and_priority_queues` | Heap mechanics, top-K, running median |
| 08 | `module08_disjoint_set_and_trie` | Tries, union-find with path compression |
| 09 | `module09_sorting_and_searching` | Sorting trade-offs, the binary search template |
| 10 | `module10_recursion_and_backtracking` | choose / explore / un-choose, N-Queens, Sudoku |
| 11 | `module11_greedy_algorithms` | Exchange arguments, interval scheduling |
| 12 | `module12_dynamic_programming` | Memo → table, knapsack, edit distance |
| 13 | `module13_graph_algorithms` | BFS/DFS, topological sort, Dijkstra |
| — | `backend_engineering` | HTTP server, REST router, JWT, cache, mini SQL engine |
| — | `quickstart`, `micro` | Java collections warm-up and 60-second drills |

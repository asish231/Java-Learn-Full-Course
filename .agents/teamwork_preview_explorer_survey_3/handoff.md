# Handoff Report: Java DSA Curriculum Restructuring - Modules 10 to 13 Survey

## 1. Observation

A full survey of `src/module10_recursion_and_backtracking`, `src/module11_greedy_algorithms`, `src/module12_dynamic_programming`, and `src/module13_graph_algorithms` was conducted. Below is the exact inventory of directory structures, existing `.java` files, inner/outer classes, methods, and topic coverages.

---

### 📦 Module 10: Recursion & Backtracking (`src/module10_recursion_and_backtracking/`)
- **Directory Path**: `/Users/asishsharma/IdeaProjects/scannerxplaoit/src/module10_recursion_and_backtracking`
- **File Inventory**:
  1. `Level1_BasicRecursion.java` (Lines 1–24, 673 bytes)
     - **Class**: `Level1_BasicRecursion`
     - **Methods**: `factorial(int n)`, `fibonacci(int n)`, `main(String[] args)`
     - **Coverage**: Single & double recursive call stack execution, base cases.
  2. `Level2_IntermediateBacktracking.java` (Lines 1–41, 1499 bytes)
     - **Class**: `Level2_IntermediateBacktracking`
     - **Methods**: `combinationSum(int[] candidates, int target)`, `backtrack(int start, int[] candidates, int remain, List<Integer> current, List<List<Integer>> res)`, `main(String[] args)`
     - **Coverage**: Combination Sum (LeetCode 39), decision tree search, pruning when `candidates[i] > remain`.
  3. `Level3_AdvancedSudokuNQueens.java` (Lines 1–55, 1988 bytes)
     - **Class**: `Level3_AdvancedSudokuNQueens`
     - **Methods**: `solveSudoku(char[][] board)`, `isValid(char[][] board, int row, int col, char ch)`, `main(String[] args)`
     - **Coverage**: 9x9 Sudoku Solver (LeetCode 37 - Hard) with row, column, and 3x3 box constraint checking.
  4. `BacktrackingProblems.java` (Lines 1–73, 2737 bytes)
     - **Class**: `BacktrackingProblems`
     - **Methods**: `subsets(int[] nums)`, `backtrackSubsets(int start, int[] nums, List<Integer> current, List<List<Integer>> result)`, `permutations(int[] nums)`, `backtrackPermutations(int[] nums, boolean[] used, List<Integer> current, List<List<Integer>> result)`, `main(String[] args)`
     - **Coverage**: Power Set / Subsets generation ($O(2^N)$) vs Permutations generation with `used[]` array ($O(N!)$).
  5. `NQueensSolver.java` (Lines 1–80, 2646 bytes)
     - **Class**: `NQueensSolver`
     - **Methods**: `solveNQueens(int n)`, `backtrack(int row, int n, char[][] board, boolean[] cols, boolean[] diag1, boolean[] diag2, List<List<String>> solutions)`, `constructBoard(char[][] board)`, `main(String[] args)`
     - **Coverage**: N-Queens problem on NxN chessboard using column and diagonal array hashing (`row + col`, `row - col + n`).

---

### 📦 Module 11: Greedy Algorithms (`src/module11_greedy_algorithms/`)
- **Directory Path**: `/Users/asishsharma/IdeaProjects/scannerxplaoit/src/module11_greedy_algorithms`
- **File Inventory**:
  1. `Level1_BasicGreedy.java` (Lines 1–31, 931 bytes)
     - **Class**: `Level1_BasicGreedy`
     - **Methods**: `findContentChildren(int[] g, int[] s)`, `main(String[] args)`
     - **Coverage**: Assign Cookies (LeetCode 455 - Easy), greedy choice sorting matching.
  2. `Level2_IntermediateGreedy.java` (Lines 1–42, 1420 bytes)
     - **Class**: `Level2_IntermediateGreedy`
     - **Methods**: `canCompleteCircuit(int[] gas, int[] cost)`, `canJump(int[] nums)`, `main(String[] args)`
     - **Coverage**: Gas Station (LeetCode 134) $O(N)$ sweep & Jump Game (LeetCode 55) max reach window tracking.
  3. `Level3_AdvancedCandyHard.java` (Lines 1–41, 1386 bytes)
     - **Class**: `Level3_AdvancedCandyHard`
     - **Methods**: `candy(int[] ratings)`, `main(String[] args)`
     - **Coverage**: Candy Distribution (LeetCode 135 - Hard) two-pass optimal allocation ($O(N)$ time, $O(N)$ space).
  4. `ActivitySelection.java` (Lines 1–80, 2513 bytes)
     - **Classes**: `ActivitySelection`, `ActivitySelection.Activity`
     - **Methods**: `selectMaxActivities(Activity[] activities)`, `main(String[] args)`
     - **Coverage**: Non-overlapping activity selection by sorting finish times ($O(N \log N)$).
  5. `FractionalKnapsack.java` (Lines 1–65, 2077 bytes)
     - **Classes**: `FractionalKnapsack`, `FractionalKnapsack.Item`
     - **Methods**: `getMaxValue(Item[] items, int capacity)`, `main(String[] args)`
     - **Coverage**: Fractional Knapsack problem using value/weight density ratio sorting.

---

### 📦 Module 12: Dynamic Programming (`src/module12_dynamic_programming/`)
- **Directory Path**: `/Users/asishsharma/IdeaProjects/scannerxplaoit/src/module12_dynamic_programming`
- **File Inventory**:
  1. `Level1_BasicDP.java` (Lines 1–38, 1105 bytes)
     - **Class**: `Level1_BasicDP`
     - **Methods**: `climbStairs(int n)`, `rob(int[] nums)`, `main(String[] args)`
     - **Coverage**: Climbing Stairs (LeetCode 70) and House Robber (LeetCode 198) 1D state transition space optimization.
  2. `Level2_IntermediateDP.java` (Lines 1–54, 1693 bytes)
     - **Class**: `Level2_IntermediateDP`
     - **Methods**: `coinChange(int[] coins, int amount)`, `lengthOfLIS(int[] nums)`, `main(String[] args)`
     - **Coverage**: Coin Change (LeetCode 322) unbounded tabulation & Longest Increasing Subsequence ($O(N^2)$).
  3. `Level3_AdvancedDPHard.java` (Lines 1–36, 1317 bytes)
     - **Class**: `Level3_AdvancedDPHard`
     - **Methods**: `minDistance(String word1, String word2)`, `main(String[] args)`
     - **Coverage**: Edit Distance / Levenshtein Distance (LeetCode 72 - Hard) 2D state transitions.
  4. `Knapsack01.java` (Lines 1–77, 2733 bytes)
     - **Class**: `Knapsack01`
     - **Methods**: `knapsackTabulation(int[] weights, int[] values, int W)`, `knapsackMemoization(int[] weights, int[] values, int W)`, `solveMemo(...)`, `main(String[] args)`
     - **Coverage**: 0/1 Knapsack top-down memoization vs bottom-up 2D tabulation comparison.
  5. `OneDimensionalDP.java` (Lines 1–85, 2631 bytes)
     - **Class**: `OneDimensionalDP`
     - **Methods**: `climbStairs(int n)`, `rob(int[] nums)`, `coinChange(int[] coins, int amount)`, `main(String[] args)`
     - **Coverage**: Composite 1D DP problems (Climbing Stairs, House Robber, Coin Change).
  6. `TwoDimensionalDP.java` (Lines 1–73, 2541 bytes)
     - **Class**: `TwoDimensionalDP`
     - **Methods**: `longestCommonSubsequence(String text1, String text2)`, `minDistanceEditDistance(String word1, String word2)`, `main(String[] args)`
     - **Coverage**: Composite 2D DP problems (Longest Common Subsequence & Edit Distance).

---

### 📦 Module 13: Graph Algorithms (`src/module13_graph_algorithms/`)
- **Directory Path**: `/Users/asishsharma/IdeaProjects/scannerxplaoit/src/module13_graph_algorithms`
- **File Inventory**:
  1. `Level1_BasicGraph.java` (Lines 1–44, 1229 bytes)
     - **Class**: `Level1_BasicGraph`
     - **Methods**: `bfs(int start, List<List<Integer>> adj, int V)`, `main(String[] args)`
     - **Coverage**: Basic Queue-based Breadth-First Search (BFS) graph traversal.
  2. `Level2_IntermediateGraph.java` (Lines 1–78, 2490 bytes)
     - **Class**: `Level2_IntermediateGraph`
     - **Methods**: `canFinish(int numCourses, int[][] prerequisites)`, `numIslands(char[][] grid)`, `dfs(char[][] grid, int r, int c)`, `main(String[] args)`
     - **Coverage**: Course Schedule cycle detection (LeetCode 207) & Number of Islands 2D Grid DFS (LeetCode 200).
  3. `Level3_AdvancedGraphHard.java` (Lines 1–57, 1834 bytes)
     - **Classes**: `Level3_AdvancedGraphHard`, `Level3_AdvancedGraphHard.Edge`
     - **Methods**: `dijkstra(int start, List<List<Edge>> adj, int V)`, `main(String[] args)`
     - **Coverage**: Single-source shortest path using PriorityQueue Dijkstra ($O((V+E)\log V)$).
  4. `GraphRepresentation.java` (Lines 1–57, 1697 bytes)
     - **Classes**: `GraphRepresentation`, `GraphRepresentation.GraphAdjList`
     - **Methods**: `addEdge(int src, int dest, boolean isDirected)`, `printGraph()`, `main(String[] args)`
     - **Coverage**: Adjacency List graph structure creation and printing.
  5. `GraphTraversals.java` (Lines 1–77, 2586 bytes)
     - **Class**: `GraphTraversals`
     - **Methods**: `bfs(int startNode, List<List<Integer>> adjList, int numVertices)`, `dfs(int startNode, List<List<Integer>> adjList, int numVertices)`, `dfsRecursive(...)`, `main(String[] args)`
     - **Coverage**: Side-by-side comparison of BFS (Queue) and DFS (Recursion).
  6. `ShortestPathAlgorithms.java` (Lines 1–117, 3923 bytes)
     - **Classes**: `ShortestPathAlgorithms`, `ShortestPathAlgorithms.Edge`, `ShortestPathAlgorithms.EdgeTuple`
     - **Methods**: `dijkstra(...)`, `bellmanFord(int start, List<EdgeTuple> edges, int V)`, `main(String[] args)`
     - **Coverage**: PriorityQueue Dijkstra vs Bellman-Ford negative weight cycle detection ($O(V \cdot E)$).
  7. `TopologicalSort.java` (Lines 1–73, 2260 bytes)
     - **Class**: `TopologicalSort`
     - **Methods**: `kahnTopologicalSort(int V, List<List<Integer>> adjList)`, `main(String[] args)`
     - **Coverage**: Topological sorting for Directed Acyclic Graphs (DAG) using Kahn's algorithm.

---

## 2. Logic Chain

1. **Current Codebase Structure Analysis**:
   - Existing files combine multiple algorithms and concepts into monolithic tier files (`Level1_...`, `Level2_...`, `Level3_...`) or multi-problem collection files (`BacktrackingProblems.java`, `OneDimensionalDP.java`, `TwoDimensionalDP.java`, `ShortestPathAlgorithms.java`).
   - For example:
     - `BacktrackingProblems.java` mixes Subsets ($O(2^N)$ decision tree) with Permutations ($O(N!)$ array swapping with `used[]`).
     - `Level2_IntermediateGreedy.java` mixes Gas Station (circular gas accumulator) with Jump Game (max reach index heuristic).
     - `OneDimensionalDP.java` mixes 3 distinct problems (Climbing Stairs, House Robber, Coin Change).
     - `ShortestPathAlgorithms.java` mixes Dijkstra's algorithm with Bellman-Ford edge relaxation and negative cycle throwing.

2. **Necessity of Micro-Step Restructuring**:
   - Requirement **R1** demands breaking down dense/complex files into progressive micro-step lesson files (`Step01_...`, `Step02_...`).
   - Beginners need step-by-step isolation of concepts (e.g., understanding 1D array state transition before 2D table state transition; understanding basic BFS graph traversal before shortest path PriorityQueue relaxation).
   - Splitting each module into 6–8 granular `StepXX_*.java` files allows each file to focus on a single core algorithm, single responsibility, clean `main` execution, and targeted ASCII visual diagram.

3. **ASCII Diagram Specifications**:
   - Requirement **R2** specifies adding clear inline ASCII diagrams for call stack trees, dynamic programming tables, bitwise/state layouts, and graph structures.
   - Dynamic Programming modules require DP state grids (`dp[i][j]` tables) showing state transition arrows.
   - Graph modules require visual node-edge topology diagrams, BFS Queue/visited array states, in-degree arrays for topological sort, and distance array relaxation tables for Dijkstra/Bellman-Ford.
   - Backtracking modules require decision call trees showing branch choice and backtrack unwinding.

---

## 3. Recommended Micro-Step Breakdown & ASCII Diagrams

### Module 10: Recursion & Backtracking
- `Step01_RecursionBasics.java`: Single call stack recursion (Factorial).
  - *ASCII Diagram*: Call stack frame push/pop trace for `factorial(3)`.
- `Step02_RecursionTreeFibonacci.java`: Double call stack tree recursion (Fibonacci).
  - *ASCII Diagram*: Recursion binary call tree for `fibonacci(4)` highlighting redundant calculations.
- `Step03_SubsetsGeneration.java`: Power set generation via backtracking.
  - *ASCII Diagram*: Include/exclude binary decision tree for `subsets([1, 2])`.
- `Step04_PermutationsBacktracking.java`: Order-dependent permutations with `used[]` boolean array.
  - *ASCII Diagram*: Permutation search tree for `[1, 2, 3]` showing `used[]` state updates and backtrack resets.
- `Step05_CombinationSumPruning.java`: Combination Sum search space pruning.
  - *ASCII Diagram*: Decision search tree for target `7` showing pruned subtrees where `remain < 0`.
- `Step06_NQueensConstraintSolver.java`: N-Queens placement on $N \times N$ board.
  - *ASCII Diagram*: $4 \times 4$ chessboard with conflict vectors along columns, main diagonals (`row+col`), and anti-diagonals (`row-col+n`).
- `Step07_SudokuSolverHard.java`: 9x9 matrix constraint satisfaction solver.
  - *ASCII Diagram*: 9x9 Sudoku grid layout mapping sub-grid index formula `3*(r/3) + i/3`.

### Module 11: Greedy Algorithms
- `Step01_AssignCookiesBasics.java`: Greedy choice matching (Cookies).
  - *ASCII Diagram*: Two-pointer matching diagram between sorted `g[]` (greed) and `s[]` (cookie size).
- `Step02_ActivitySelectionIntervals.java`: Non-overlapping interval scheduling.
  - *ASCII Diagram*: Time-line chart of overlapping activity intervals showing greedy selection by finish time.
- `Step03_FractionalKnapsackRatio.java`: Value/weight density ratio sorting.
  - *ASCII Diagram*: Item ratio ranking table and knapsack capacity filling timeline.
- `Step04_JumpGameReachability.java`: Greedy maximum reach tracking.
  - *ASCII Diagram*: 1D array jump index span showing expanding `maxReach` frontier.
- `Step05_GasStationCircuit.java`: Circular gas balance accumulation.
  - *ASCII Diagram*: Circular station route showing gas deficit point and start-node reset trigger.
- `Step06_CandyTwoPassGreedy.java`: Two-pass allocation (Left-to-Right & Right-to-Left).
  - *ASCII Diagram*: Rating array vs Candy array two-pass adjustment table (`Pass 1 L->R`, `Pass 2 R->L`, `Final Max`).

### Module 12: Dynamic Programming
- `Step01_ClimbingStairsMemoAndTab.java`: DP basics: Memoization vs Tabulation vs Space Optimization.
  - *ASCII Diagram*: Fibonacci call tree vs 1D DP table conversion.
- `Step02_HouseRobberStateChoice.java`: 1D DP choice state transition.
  - *ASCII Diagram*: House array decision pointers: `rob1` vs `rob2` decision boundary.
- `Step03_CoinChangeUnboundedDP.java`: Unbounded min-coin DP accumulation.
  - *ASCII Diagram*: 1D DP Array table for amount 0..11 showing coin relaxation updates.
- `Step04_LongestIncreasingSubsequence.java`: 1D nested-loop LIS state transition.
  - *ASCII Diagram*: LIS element back-pointer arrows (e.g. `2 -> 3 -> 7 -> 101`).
- `Step05_Knapsack01TopDownMemo.java`: 0/1 Knapsack top-down decision tree and `memo[][]` grid.
  - *ASCII Diagram*: Top-down recursion state tree `solveMemo(idx, remainingW)`.
- `Step06_Knapsack01BottomUpTabulation.java`: 0/1 Knapsack bottom-up 2D tabulation grid.
  - *ASCII Diagram*: 2D DP Table `dp[item][capacity]` showing cell inclusion dependency arrows (`dp[i-1][j]` vs `v + dp[i-1][j-w]`).
- `Step07_LongestCommonSubsequence.java`: 2D Grid character alignment DP.
  - *ASCII Diagram*: 2D LCS Matrix for `"abcde"` vs `"ace"` showing match diagonal arrows (`\ +1`) vs mismatch max arrows (`<-`, `^`).
- `Step08_EditDistanceHard.java`: 2D Matrix Edit Distance DP.
  - *ASCII Diagram*: 2D Edit Distance Matrix for `"horse"` -> `"ros"` highlighting Insert (`<-`), Delete (`^`), and Replace (`\`) operations.

### Module 13: Graph Algorithms
- `Step01_GraphRepresentations.java`: Adjacency Matrix vs Adjacency List.
  - *ASCII Diagram*: 4-vertex graph alongside its 2D Matrix `int[4][4]` and `List<List<Integer>>` adjacency list.
- `Step02_BreadthFirstSearchBFS.java`: Queue-based level-order BFS traversal.
  - *ASCII Diagram*: Graph topology diagram alongside Queue state step-by-step trace and `visited[]` array.
- `Step03_DepthFirstSearchDFS.java`: Call-stack recursive DFS path traversal.
  - *ASCII Diagram*: Graph topology diagram showing call stack depth and backtracking path trace.
- `Step04_GridDFSNumberOfIslands.java`: 2D Grid Graph 4-directional flooding DFS.
  - *ASCII Diagram*: $4 \times 4$ island map ('1' vs '0') showing 4-directional DFS spreading and land sinking.
- `Step05_TopologicalSortKahnsAlgo.java`: DAG dependency scheduling via Kahn's algorithm.
  - *ASCII Diagram*: Directed Acyclic Graph with `inDegree[]` table and queue processing sequence.
- `Step06_CourseScheduleCycleDetection.java`: Directed graph cycle detection via Kahn's count check.
  - *ASCII Diagram*: Cyclic graph `(0 -> 1 -> 2 -> 0)` illustrating queue exhaustion before processing all vertices (`count < V`).
- `Step07_DijkstraShortestPath.java`: PriorityQueue Dijkstra for non-negative weighted graphs.
  - *ASCII Diagram*: Weighted graph topology and PriorityQueue distance relaxation table `dist[]`.
- `Step08_BellmanFordNegativeCycles.java`: Bellman-Ford $V-1$ edge relaxation and negative cycle detection.
  - *ASCII Diagram*: Weighted graph with negative cycle, edge relaxation iteration table (Pass 1 to $V-1$), and $V$-th pass cycle detection failure.

---

## 4. Caveats

- **Scope Boundary**: Investigation was confined to Modules 10, 11, 12, and 13 under `src/`. Modules 01 through 09, `src/micro`, `src/quickstart`, and `src/backend_engineering` were not surveyed as part of this assignment (handled by parallel survey explorers).
- **Execution State**: All existing `.java` files in `src/module10_*` through `src/module13_*` compile cleanly with `javac` and execute without errors in their current form.
- **Refactoring Strategy**: The proposed micro-step files will replace/expand the existing `Level1_...`, `Level2_...`, `Level3_...` and multi-problem files to provide an optimal learning sequence for students.

---

## 5. Conclusion

Modules 10 through 13 provide solid coverage of core intermediate/advanced algorithms (Recursion/Backtracking, Greedy, Dynamic Programming, Graphs), but current file layouts bundle disparate topics together. Breaking these 23 source files down into 29 focused `Step01_...` through `Step08_...` micro-step lesson files complete with rich ASCII visual diagrams will make the curriculum smoother, highly accessible, and fully compliant with project requirements **R1**, **R2**, and **R3**.

---

## 6. Verification Method

To independently verify the inventory and build state of Modules 10 to 13:

1. **Clean Compilation Check**:
   ```bash
   javac src/module10_recursion_and_backtracking/*.java
   javac src/module11_greedy_algorithms/*.java
   javac src/module12_dynamic_programming/*.java
   javac src/module13_graph_algorithms/*.java
   ```
2. **Sample Execution Verification**:
   ```bash
   java -cp src module10_recursion_and_backtracking.Level1_BasicRecursion
   java -cp src module11_greedy_algorithms.Level1_BasicGreedy
   java -cp src module12_dynamic_programming.Level1_BasicDP
   java -cp src module13_graph_algorithms.Level1_BasicGraph
   ```
3. **File Path & Line Verification**:
   Verify file locations and class contents using `view_file` on any file listed under Section 1.

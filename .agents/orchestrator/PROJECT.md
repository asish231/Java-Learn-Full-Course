# Project: Java DSA Curriculum Restructuring

## Architecture
- Modules: `module01_foundations` through `module13_graph_algorithms` under `src/`.
- Package structure: `package moduleXX_name;` for each module.
- Independence: Each `StepXX_*.java` file is self-contained with its own static inner node/helper classes and `public static void main(String[] args)` method.
- Visuals: Inline ASCII memory diagrams (stack/heap, pointers, matrices, trees, graph edges).

## Feature Inventory
| # | Module | Proposed Step File | Description / Core Topic | Milestone |
|---|--------|--------------------|--------------------------|-----------|
| 1 | module01 | Step01_ConstantAndLinearTime.java | O(1) memory access & O(N) linear iteration | M1 |
| 2 | module01 | Step02_LogarithmicAndQuadraticTime.java | O(log N) binary loops & O(N^2) nested loops | M1 |
| 3 | module01 | Step03_AmortizedAnalysis.java | Dynamic array capacity expansion math | M1 |
| 4 | module01 | Step04_RecursionAndStackFrames.java | JVM call stack growth & tail recursion | M1 |
| 5 | module01 | Step05_ComprehensiveComplexitySuite.java | Benchmarking suite across O(1) to O(2^N) | M1 |
| 6 | module02 | Step01_BasicArrayOperations.java | In-place reversal, min/max, element removal | M1 |
| 7 | module02 | Step02_CustomDynamicArray.java | Complete CustomDynamicArray implementation | M1 |
| 8 | module02 | Step03_TwoPointerTechniques.java | Two Sum sorted & Container With Most Water | M1 |
| 9 | module02 | Step04_MultiPointer3Sum.java | 3Sum problem with duplicate handling | M1 |
| 10 | module02 | Step05_FixedAndVariableSlidingWindow.java | Max subarray sum K & longest unique substring | M1 |
| 11 | module02 | Step06_AdvancedMonotonicDequeWindow.java | Sliding Window Maximum using Monotonic Deque | M1 |
| 12 | module03 | Step01_SinglyLinkedListBasics.java | Singly Linked List CRUD & traversal | M1 |
| 13 | module03 | Step02_DoublyLinkedListBasics.java | Doubly Linked List bidirectional pointers | M1 |
| 14 | module03 | Step03_PointerReversalAndMiddle.java | In-place LL reversal & Fast/Slow middle finder | M1 |
| 15 | module03 | Step04_FloydsCycleDetection.java | Floyd's cycle detection & cycle start node | M1 |
| 16 | module03 | Step05_AdvancedLRUCache.java | LRU Cache combining HashMap + Doubly LL | M1 |
| 17 | module03 | Step06_LinkedListAlgorithmSuite.java | Comprehensive LL benchmarks & edge cases | M1 |
| 18 | module04 | Step01_ArrayStackImplementation.java | Generic ArrayStack LIFO implementation | M1 |
| 19 | module04 | Step02_CircularQueueImplementation.java | Array-backed Circular Queue FIFO with modulo | M1 |
| 20 | module04 | Step03_StackApplicationsMatching.java | Valid Parentheses matching algorithm | M1 |
| 21 | module04 | Step04_MonotonicStackNextGreater.java | Next Greater Element & Daily Temperatures | M1 |
| 22 | module04 | Step05_HistogramAndRainWater.java | Largest Rectangle Histogram & Rain Water | M1 |
| 23 | module04 | Step06_StackQueueBenchmarkSuite.java | Benchmark runner for stacks & queues | M1 |
| 24 | module05 | Step01_HashFunctionsAndDirectAddressing.java | Hash functions, modulus, direct address tables | M2 |
| 25 | module05 | Step02_BasicHashSetMap.java | HashSet/HashMap usage & frequency array | M2 |
| 26 | module05 | Step03_TwoSumPattern.java | Two Sum using HashMap complement lookup | M2 |
| 27 | module05 | Step04_GroupAnagramsPattern.java | Group Anagrams with key encoding | M2 |
| 28 | module05 | Step05_LongestConsecutiveSequence.java | Longest Consecutive Sequence using HashSet | M2 |
| 29 | module05 | Step06_SubarraySumEqualsK.java | Subarray Sum Equals K using Prefix Sum + Map | M2 |
| 30 | module05 | Step07_CustomHashMapSeparateChaining.java | Custom HashMap with LinkedList buckets & rehash | M2 |
| 31 | module05 | Step08_CustomHashMapLinearProbing.java | Custom HashMap with Open Addressing & Linear Probing | M2 |
| 32 | module06 | Step01_TreeNodeStructure.java | TreeNode definition & tree assembly | M2 |
| 33 | module06 | Step02_TreeTraversalsDFS.java | Pre-order, In-order, Post-order DFS traversals | M2 |
| 34 | module06 | Step03_TreeTraversalBFS.java | Level-order BFS traversal using Queue | M2 |
| 35 | module06 | Step04_BasicTreeProperties.java | Max Depth & Same Tree | M2 |
| 36 | module06 | Step05_BSTInsertAndSearch.java | BST insertion & search ordering property | M2 |
| 37 | module06 | Step06_BSTDeletion.java | BST deletion handling 3 cases | M2 |
| 38 | module06 | Step07_ValidateBST.java | Validate BST using min/max range boundaries | M2 |
| 39 | module06 | Step08_LowestCommonAncestor.java | Lowest Common Ancestor of Binary Tree | M2 |
| 40 | module06 | Step09_SerializeDeserializeTree.java | Tree Serialization & Deserialization | M2 |
| 41 | module07 | Step01_PriorityQueueBasics.java | Java PriorityQueue Min-Heap & Max-Heap | M3 |
| 42 | module07 | Step02_HeapArrayRepresentation.java | Binary Heap array storage & index formulas | M3 |
| 43 | module07 | Step03_CustomMinHeapImplementation.java | Custom Min-Heap scratch implementation | M3 |
| 44 | module07 | Step04_HeapSortAlgorithm.java | In-place HeapSort algorithm | M3 |
| 45 | module07 | Step05_KthLargestElement.java | Kth Largest Element using K-sized Min-Heap | M3 |
| 46 | module07 | Step06_TopKFrequentElements.java | Top K Frequent Elements with Frequency Map + Heap | M3 |
| 47 | module07 | Step07_FindMedianDataStream.java | Continuous Median Stream with Dual Heaps | M3 |
| 48 | module08 | Step01_DisjointSetUnionNaive.java | Basic DSU array structure, naive find/union | M3 |
| 49 | module08 | Step02_DisjointSetUnionOptimized.java | Advanced DSU with Path Compression & Union by Rank | M3 |
| 50 | module08 | Step03_DSUConnectedComponents.java | Connected components & cycle detection | M3 |
| 51 | module08 | Step04_TrieNodeStructure.java | TrieNode representation with children[26] | M3 |
| 52 | module08 | Step05_TrieOperations.java | Trie insert, search, and startsWith | M3 |
| 53 | module08 | Step06_ReplaceWordsTrie.java | Replace Words in sentence with Trie root prefix | M3 |
| 54 | module08 | Step07_WordSearchII.java | Word Search II with 2D Grid DFS + Trie | M3 |
| 55 | module09 | Step01_LinearVsBinarySearch.java | Linear Search vs Binary Search | M3 |
| 56 | module09 | Step02_BubbleSort.java | Bubble Sort with early exit flag | M3 |
| 57 | module09 | Step03_SelectionSort.java | Selection Sort scanning minimum element | M3 |
| 58 | module09 | Step04_InsertionSort.java | Insertion Sort inserting into sorted prefix | M3 |
| 59 | module09 | Step05_MergeSort.java | Merge Sort divide-and-conquer & merging | M3 |
| 60 | module09 | Step06_QuickSort.java | Quick Sort Lomuto partition scheme | M3 |
| 61 | module09 | Step07_BinarySearchBoundaries.java | Lower Bound & Upper Bound duplicate search | M3 |
| 62 | module09 | Step08_SearchInRotatedArray.java | Search in Rotated Sorted Array | M3 |
| 63 | module09 | Step09_BinarySearchOnAnswer.java | Binary Search on Answer (Ship Capacity) | M3 |
| 64 | module09 | Step10_MedianOfTwoSortedArrays.java | Median of Two Sorted Arrays | M3 |
| 65 | module10 | Step01_RecursionBasics.java | Single call stack recursion (Factorial) | M4 |
| 66 | module10 | Step02_RecursionTreeFibonacci.java | Double call stack tree recursion (Fibonacci) | M4 |
| 67 | module10 | Step03_SubsetsGeneration.java | Power set generation via backtracking | M4 |
| 68 | module10 | Step04_PermutationsBacktracking.java | Order-dependent permutations with used[] array | M4 |
| 69 | module10 | Step05_CombinationSumPruning.java | Combination Sum search space pruning | M4 |
| 70 | module10 | Step06_NQueensConstraintSolver.java | N-Queens placement on NxN board | M4 |
| 71 | module10 | Step07_SudokuSolverHard.java | 9x9 matrix constraint satisfaction solver | M4 |
| 72 | module11 | Step01_AssignCookiesBasics.java | Greedy choice matching (Cookies) | M4 |
| 73 | module11 | Step02_ActivitySelectionIntervals.java | Non-overlapping interval scheduling | M4 |
| 74 | module11 | Step03_FractionalKnapsackRatio.java | Value/weight density ratio sorting | M4 |
| 75 | module11 | Step04_JumpGameReachability.java | Greedy maximum reach tracking | M4 |
| 76 | module11 | Step05_GasStationCircuit.java | Circular gas balance accumulation | M4 |
| 77 | module11 | Step06_CandyTwoPassGreedy.java | Two-pass allocation (Candy) | M4 |
| 78 | module12 | Step01_ClimbingStairsMemoAndTab.java | Memoization vs Tabulation vs Space Optimization | M4 |
| 79 | module12 | Step02_HouseRobberStateChoice.java | 1D DP choice state transition | M4 |
| 80 | module12 | Step03_CoinChangeUnboundedDP.java | Unbounded min-coin DP accumulation | M4 |
| 81 | module12 | Step04_LongestIncreasingSubsequence.java | 1D nested-loop LIS state transition | M4 |
| 82 | module12 | Step05_Knapsack01TopDownMemo.java | 0/1 Knapsack top-down decision tree & memo | M4 |
| 83 | module12 | Step06_Knapsack01BottomUpTabulation.java | 0/1 Knapsack bottom-up 2D tabulation grid | M4 |
| 84 | module12 | Step07_LongestCommonSubsequence.java | 2D Grid character alignment DP | M4 |
| 85 | module12 | Step08_EditDistanceHard.java | 2D Matrix Edit Distance DP | M4 |
| 86 | module13 | Step01_GraphRepresentations.java | Adjacency Matrix vs Adjacency List | M5 |
| 87 | module13 | Step02_BreadthFirstSearchBFS.java | Queue-based level-order BFS traversal | M5 |
| 88 | module13 | Step03_DepthFirstSearchDFS.java | Call-stack recursive DFS path traversal | M5 |
| 89 | module13 | Step04_GridDFSNumberOfIslands.java | 2D Grid Graph 4-directional flooding DFS | M5 |
| 90 | module13 | Step05_TopologicalSortKahnsAlgo.java | DAG dependency scheduling via Kahn's algo | M5 |
| 91 | module13 | Step06_CourseScheduleCycleDetection.java | Directed graph cycle detection | M5 |
| 92 | module13 | Step07_DijkstraShortestPath.java | PriorityQueue Dijkstra shortest path | M5 |
| 93 | module13 | Step08_BellmanFordNegativeCycles.java | Bellman-Ford V-1 edge relaxation & negative cycle | M5 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1: Foundations, Arrays & Linear Structures | Modules 01-04 (23 step files) | None | DONE |
| 2 | M2: Hashing, Trees & BST | Modules 05-06 (17 step files) | M1 | IN_PROGRESS |
| 3 | M3: Heaps, DSU, Trie, Sorting & Searching | Modules 07-09 (24 step files) | M2 | IN_PROGRESS |
| 4 | M4: Recursion, Backtracking, Greedy & DP | Modules 10-12 (21 step files) | M3 | DONE |
| 5 | M5: Graph Algorithms | Module 13 (8 step files) | M4 | DONE |
| 6 | E2E: Automated Verification & Test Infra | Test harness for compilation & execution | Parallel | DONE |




## Interface Contracts
### Step File Standard Contract
- Package: `package moduleXX_name;`
- Standalone: Each file compiles independently (`javac src/moduleXX_name/StepYY_Name.java`).
- Inner classes: Static inner helper classes (e.g. `static class Node`, `static class TreeNode`).
- Main Method: `public static void main(String[] args)` with clean, educational log outputs.
- ASCII Diagrams: Comprehensive block comments at top of file and above key methods illustrating memory states, stack frames, pointers, or matrix/tree/graph structures.

## Code Layout
- Root directory: `/Users/asishsharma/IdeaProjects/scannerxplaoit`
- Source code: `src/module01_foundations` through `src/module13_graph_algorithms`

# Implementation Specification Report: Module 01 & Module 02

**Author**: Explorer 1 (Milestone 1)  
**Target Modules**: Module 01 (Foundations & Big-O), Module 02 (Arrays & Strings)  
**Total Target Files**: 11 Java Micro-Step Files  
**Working Directory**: `/Users/asishsharma/IdeaProjects/scannerxplaoit/.agents/explorer_m1_1`  

---

## Executive Summary & Design Principles

This specification details the architecture, micro-step structure, memory state ASCII diagrams, method signatures, and runtime output demonstrations for all 11 Java lesson files across **Module 01: Foundations & Big-O** and **Module 02: Arrays & Strings**.

### Core Architecture Standards:
1. **Directory Structure**:
   - Module 01: `src/module01_foundations/`
   - Module 02: `src/module02_arrays_and_strings/`
2. **Package Declarations**:
   - `package module01_foundations;`
   - `package module02_arrays_and_strings;`
3. **Self-Contained Executables**: Each file is independently compilable via `javac` and contains a `public static void main(String[] args)` method demonstrating execution output.
4. **Static Inner Classes**: Any helper data structures (e.g. iterators or custom node pairs) must be static inner classes within the step file.
5. **Rich Inline Visuals**: Every file must start with a comprehensive ASCII block comment explaining the key concepts, memory stack/heap layouts, pointer movements, or time complexity curves.

---

## Part 1: Module 01 — Foundations & Big-O (5 Files)

---

### File 1.1: `Step01_ConstantAndLinearTime.java`

* **Target File Path**: `src/module01_foundations/Step01_ConstantAndLinearTime.java`
* **Package Declaration**: `package module01_foundations;`

#### Core Concepts & Micro-Steps:
1. **Micro-Step 1: O(1) Constant Time Operations** — Explains why array index access, arithmetic operations, and variable assignments take $O(1)$ time regardless of input size $N$. Direct memory address calculation formula: $\text{Address} = \text{Base} + (\text{index} \times \text{element\_size})$.
2. **Micro-Step 2: O(N) Linear Time Iteration** — Explains single-pass loops over arrays (summation, linear search). Demonstrates how execution time scales directly proportional to input size $N$.
3. **Micro-Step 3: Operation Counting & Nano-second Benchmarking** — Tracks exact loop iteration counts and elapsed nanoseconds for $N = 10$, $N = 10,000$, and $N = 1,000,000$.

#### ASCII Memory Diagrams:
```
O(1) CONSTANT TIME MEMORY ACCESS:
Array Base Address: 0x1000, Element Size: 4 Bytes (int)
Index 3 Address = 0x1000 + (3 * 4) = 0x100C  [Single CPU Instruction!]

+---------+---------+---------+---------+---------+
|  arr[0] |  arr[1] |  arr[2] |  arr[3] |  arr[4] |
|   10    |   20    |   30    |   40    |   50    |
+---------+---------+---------+---------+---------+
0x1000    0x1004    0x1008    0x100C    0x1010
                                ^
                        Direct Access O(1)

O(N) LINEAR TIME ARRAY ITERATION:
Step 0: [10] -> Step 1: [20] -> Step 2: [30] ... -> Step N-1: [50]
  i=0        i=1        i=2                 i=N-1
[Pointer moves sequentially across all N elements -> N operations]
```

#### Method Logic & Main Demonstration:
* `public static int constantTimeAccess(int[] arr, int index)`:
  - Validates boundary `0 <= index < arr.length`.
  - Performs direct indexing lookup `return arr[index]`.
* `public static long calculateLinearSum(int[] arr)`:
  - Initializes `long sum = 0`.
  - Iterates through `arr` in a single `for` loop, adding each element. Returns `sum`.
* `public static int linearSearch(int[] arr, int target)`:
  - Scans array from `i = 0` to `N-1`. Returns index if `arr[i] == target`, else `-1`. Counts comparisons.
* `public static void main(String[] args)`:
  - Prints visual section headers.
  - Creates test arrays of sizes $N=10$, $N=100,000$, and $N=10,000,000$.
  - Executes `constantTimeAccess` and `calculateLinearSum`, printing operation counts and nanosecond timing.

---

### File 1.2: `Step02_LogarithmicAndQuadraticTime.java`

* **Target File Path**: `src/module01_foundations/Step02_LogarithmicAndQuadraticTime.java`
* **Package Declaration**: `package module01_foundations;`

#### Core Concepts & Micro-Steps:
1. **Micro-Step 1: O(log N) Logarithmic Time Complexity** — Explains problem space reduction by half at each step (e.g. binary division loop, binary search). $\log_2(1,000,000) \approx 20$ steps.
2. **Micro-Step 2: O(N^2) Quadratic Time Complexity** — Explains nested loops over $N$ items (e.g. matrix iteration, all pairs comparisons). $N = 10,000 \implies N^2 = 100,000,000$ operations.
3. **Micro-Step 3: Growth Rate Contrast Analysis** — Contrasts execution scaling between $O(\log N)$ and $O(N^2)$ as $N$ grows exponentially ($10 \to 100 \to 1000 \to 10000$).

#### ASCII Memory Diagrams:
```
O(log N) INTERVAL HALVING (Binary Division):
N = 16  [--------------------------------] (16 elements)
Step 1: [----------------]                 (8 elements left)
Step 2: [--------]                         (4 elements left)
Step 3: [----]                             (2 elements left)
Step 4: [--]                               (1 element left) -> Log2(16) = 4 steps!

O(N^2) NESTED LOOP MATRIX GRID:
  i \ j   0   1   2   3   ... N-1
  0     (0,0)(0,1)(0,2)(0,3)...(0,N-1)  -> N ops
  1     (1,0)(1,1)(1,2)(1,3)...(1,N-1)  -> N ops
  ...
  N-1   (N-1,0).............(N-1,N-1)  -> N ops
 Total Operations = N * N = N^2
```

#### Method Logic & Main Demonstration:
* `public static int countHalvingSteps(long n)`:
  - Loop condition `while (n > 1)` performing `n = n / 2`, incrementing `steps`. Returns `steps`.
* `public static int binarySearch(int[] sortedArr, int target)`:
  - Two pointers `left = 0`, `right = sortedArr.length - 1`.
  - While `left <= right`, compute `mid = left + (right - left) / 2`.
  - Check `sortedArr[mid] == target`, adjust `left` or `right` accordingly. Returns target index and logs step count.
* `public static long countQuadraticPairs(int[] arr)`:
  - Outer loop `i` from $0$ to $N-1$, inner loop `j` from $0$ to $N-1$. Increments counter. Returns total operations `pairCount`.
* `public static void main(String[] args)`:
  - Compares iteration counts for $N = 10, 100, 1000, 10000$.
  - Displays formatted comparison table showing $O(\log N)$ taking tens of operations while $O(N^2)$ reaches tens of millions.

---

### File 1.3: `Step03_AmortizedAnalysis.java`

* **Target File Path**: `src/module01_foundations/Step03_AmortizedAnalysis.java`
* **Package Declaration**: `package module01_foundations;`

#### Core Concepts & Micro-Steps:
1. **Micro-Step 1: The Dynamic Array Resize Problem** — Fixed array limitations vs dynamic array capacity expansion.
2. **Micro-Step 2: Aggregate Method Analysis** — Proves that inserting $N$ elements into a dynamic array with $2\times$ capacity expansion takes $O(N)$ total copy operations, giving an amortized cost of $O(1)$ per append operation: $\frac{N + (1 + 2 + 4 + \dots + 2^k)}{N} < \frac{3N}{N} = 3 = O(1)$.
3. **Micro-Step 3: Incremental (+K) Resizing Pitfall** — Shows that resizing by fixed increments $+K$ (e.g. $+1$ or $+10$) causes $O(N^2)$ cumulative operations, destroying performance.
4. **Micro-Step 4: Accounting / Potential Method Overview** — Concept of charging \$3 per push (\$1 for placement, \$2 saved as credit for future copying).

#### ASCII Memory Diagrams:
```
GEOMETRIC DOUBLING (2x Expansion):
Cap=1: [A]
Cap=2: [A|B]                        (Resize 1 copy)
Cap=4: [A|B|C|D]                    (Resize 2 copies)
Cap=8: [A|B|C|D|E|F|G|H]            (Resize 4 copies)

Total Copy Operations for N elements = 1 + 2 + 4 + ... + N/2 = N - 1 < N
Amortized Cost per Operation = (N appends + (N - 1) copies) / N ≈ 2 ops = O(1)

AMORTIZED COST SPICE COST CHART:
Cost |
O(N) |       |                           |
     |       |                           | (Resize spikes)
O(1) | | | | | | | | | | | | | | | | | | | | | | (Cheap appends)
-----+--------------------------------------------> N insertions
```

#### Method Logic & Main Demonstration:
* `public static void simulateGeometricExpansion(int elementsToAdd)`:
  - Tracks `capacity`, `totalCopies`, `resizeCount`.
  - When `i > capacity`, doubles `capacity *= 2` and adds `(i - 1)` to `totalCopies`.
  - Calculates `amortizedCost = (double)(elementsToAdd + totalCopies) / elementsToAdd`.
* `public static void simulateLinearExpansion(int elementsToAdd, int increment)`:
  - Tracks `totalCopies` when capacity grows by `+increment`. Demonstrates quadratic growth.
* `public static void main(String[] args)`:
  - Runs simulations for $N = 1,000$, $N = 10,000$, and $N = 100,000$.
  - Prints side-by-side comparative table showing $2\times$ doubling maintaining $\approx 2.00$ operations/append versus $+10$ linear expansion needing thousands of copy operations per append.

---

### File 1.4: `Step04_RecursionAndStackFrames.java`

* **Target File Path**: `src/module01_foundations/Step04_RecursionAndStackFrames.java`
* **Package Declaration**: `package module01_foundations;`

#### Core Concepts & Micro-Steps:
1. **Micro-Step 1: JVM Call Stack Architecture** — Mechanics of call stack frames: return addresses, parameters, local variables.
2. **Micro-Step 2: Linear Recursion & Stack Memory Depth** — Non-tail recursive factorial accumulating $N$ stack frames on the JVM call stack ($O(N)$ auxiliary space).
3. **Micro-Step 3: Tail Recursion & Accumulator Pattern** — Tail call structure passing partial results in parameter accumulators. Explains compiler tail-call elimination optimization (TCE).
4. **Micro-Step 4: StackOverflowError Mechanics** — Demonstrates call stack limit boundaries when recursion depth exceeds JVM stack size.

#### ASCII Memory Diagrams:
```
JVM CALL STACK FOR NON-TAIL FACTORIAL fact(4):

   CALL PHASE (Push Frames)              RETURN PHASE (Pop & Unwind)
+--------------------------+          +--------------------------+
| fact(1): n=1 -> returns 1| [Top]    | fact(1) returns 1        |
+--------------------------+          +--------------------------+
| fact(2): n=2 * fact(1)   |          | fact(2) returns 2 * 1=2  |
+--------------------------+          +--------------------------+
| fact(3): n=3 * fact(2)   |          | fact(3) returns 3 * 2=6  |
+--------------------------+          +--------------------------+
| fact(4): n=4 * fact(3)   | [Base]   | fact(4) returns 4 * 6=24 |
+--------------------------+          +--------------------------+
 Peak Stack Depth = 4 frames (O(N) Auxiliary Space)

TAIL RECURSION (Accumulator Pattern):
tailFact(4, 1) -> tailFact(3, 4) -> tailFact(2, 12) -> tailFact(1, 24) = 24
[Frame can be reused in-place if compiler supports TCE]
```

#### Method Logic & Main Demonstration:
* `public static long nonTailFactorial(int n, int depth)`:
  - Logs frame entry `PUSH frame n`.
  - Base case `n <= 1 -> return 1`.
  - Recursive call `n * nonTailFactorial(n - 1, depth + 1)`.
  - Logs frame exit `POP frame n`.
* `public static long tailFactorial(int n, long acc)`:
  - Base case `n <= 1 -> return acc`.
  - Tail recursive call `tailFactorial(n - 1, n * acc)`.
* `public static void demonstrateStackOverflow(int currentDepth)`:
  - Increments `currentDepth` recursively inside `try-catch (StackOverflowError e)` block to measure max stack depth before crashing.
* `public static void main(String[] args)`:
  - Traces call stack frame pushes/pops for `nonTailFactorial(5)`.
  - Demonstrates `tailFactorial(5, 1)`.
  - Executes safely bounded `demonstrateStackOverflow` and reports maximum frame depth achieved (typically ~10,000 frames).

---

### File 1.5: `Step05_ComprehensiveComplexitySuite.java`

* **Target File Path**: `src/module01_foundations/Step05_ComprehensiveComplexitySuite.java`
* **Package Declaration**: `package module01_foundations;`

#### Core Concepts & Micro-Steps:
1. **Micro-Step 1: Full Complexity Spectrum Benchmarking** — Implements tests across $O(1)$, $O(\log N)$, $O(N)$, $O(N \log N)$, $O(N^2)$, and $O(2^N)$.
2. **Micro-Step 2: JVM Warm-up & Nanosecond Precision** — Uses `System.nanoTime()` and preliminary JVM execution loops to eliminate JIT compilation variance.
3. **Micro-Step 3: Space Complexity Taxonomy** — Explains Auxiliary Space vs Input Space with memory profiling heuristics.
4. **Micro-Step 4: Unified Complexity Report Generation** — Outputs formatted benchmark comparison matrix.

#### ASCII Memory Diagrams:
```
BIG-O TIME COMPLEXITY GROWTH CURVES:
Ops
 ^
 |                                         / O(2^N) [Exponential]
 |                                 _.-'   / O(N^2) [Quadratic]
 |                            _.-'       /
 |                       _.-'           / O(N log N) [Linearithmic]
 |                  _.-'               /
 |             _.-'                   / O(N) [Linear]
 |        _.-'                       /
 |   _.-'                           / O(log N) [Logarithmic]
 |---------------------------------/-----------------> O(1) [Constant]
 0---------------------------------------------------> Input Size N
```

#### Method Logic & Main Demonstration:
* Implement standard benchmark methods:
  - `benchO1(int[] arr)`: Index lookup.
  - `benchOlogN(int[] arr, int target)`: Binary search.
  - `benchON(int[] arr)`: Array sum.
  - `benchONlogN(int[] arr)`: Dual-pivot Quicksort (`Arrays.sort`).
  - `benchON2(int[] arr)`: All-pairs iteration.
  - `benchO2N(int n)`: Recursive Fibonacci $F(n) = F(n-1) + F(n-2)$.
* `public static void main(String[] args)`:
  - Executes JVM warm-up loop.
  - Runs full benchmark suite across varying $N$ sizes ($N=10, 100, 1000, 5000$).
  - Prints ASCII benchmark table detailing: Complexity Class, $N$, Operations Count, Time (ns/ms), Auxiliary Space.

---

## Part 2: Module 02 — Arrays & Strings (6 Files)

---

### File 2.1: `Step01_BasicArrayOperations.java`

* **Target File Path**: `src/module02_arrays_and_strings/Step01_BasicArrayOperations.java`
* **Package Declaration**: `package module02_arrays_and_strings;`

#### Core Concepts & Micro-Steps:
1. **Micro-Step 1: Contiguous Array Memory Structure** — Access characteristics and physical contiguous byte layout in Java heap.
2. **Micro-Step 2: In-place Array Reversal** — Two-pointer swap algorithm. Time: $O(N)$, Space: $O(1)$.
3. **Micro-Step 3: Single-Pass Extrema Search** — Finding min and max elements in a single traversal. Time: $O(N)$, Space: $O(1)$.
4. **Micro-Step 4: In-place Element Removal (LeetCode 27)** — Reader/Writer double-pointer pattern. Time: $O(N)$, Space: $O(1)$.

#### ASCII Memory Diagrams:
```
IN-PLACE REVERSAL (Two Pointers):
Initial:  [ 10 | 20 | 30 | 40 | 50 ]
           ^                 ^
          left             right
Step 1: Swap(left, right) -> [ 50 | 20 | 30 | 40 | 10 ], left++, right--
                 ^       ^
               left    right
Step 2: Swap(left, right) -> [ 50 | 40 | 30 | 20 | 10 ], left++, right--
                       ^  ^
                  (left >= right: Loop Terminates!)

IN-PLACE ELEMENT REMOVAL (Remove val = 3):
Initial:  [ 3 | 2 | 2 | 3 | 4 | 5 ]
           ^
          writer / reader
i=0 (num=3): skip writer
i=1 (num=2): nums[writer++] = 2 -> [ 2 | 2 | 2 | 3 | 4 | 5 ]
i=2 (num=2): nums[writer++] = 2 -> [ 2 | 2 | 2 | 3 | 4 | 5 ]
i=3 (num=3): skip writer
i=4 (num=4): nums[writer++] = 4 -> [ 2 | 2 | 4 | 3 | 4 | 5 ]
i=5 (num=5): nums[writer++] = 5 -> [ 2 | 2 | 4 | 5 | 4 | 5 ]
New Effective Length = 4 -> [ 2, 2, 4, 5 ]
```

#### Method Logic & Main Demonstration:
* `public static void reverseInPlace(int[] nums)`:
  - `int left = 0, right = nums.length - 1`.
  - `while (left < right)` swap `nums[left]` and `nums[right]`, `left++`, `right--`.
* `public static int[] findMinMax(int[] nums)`:
  - Check empty array. Initialize `min = nums[0], max = nums[0]`.
  - Loop `num` in `nums`: update `min` if `num < min`, `max` if `num > max`. Return `new int[]{min, max}`.
* `public static int removeElement(int[] nums, int val)`:
  - `int k = 0`.
  - Loop `i` from $0$ to `nums.length - 1`: if `nums[i] != val`, `nums[k++] = nums[i]`. Return `k`.
* `public static void main(String[] args)`:
  - Tests array reversal, min/max finding, and element removal.
  - Prints original arrays, pointer transformations, and resulting truncated arrays.

---

### File 2.2: `Step02_CustomDynamicArray.java`

* **Target File Path**: `src/module02_arrays_and_strings/Step02_CustomDynamicArray.java`
* **Package Declaration**: `package module02_arrays_and_strings;`

#### Core Concepts & Micro-Steps:
1. **Micro-Step 1: Dynamic Array Anatomy** — Internal `Object[] data` buffer, `size` (element count), `capacity` (buffer length).
2. **Micro-Step 2: Automatic Geometric Expansion** — Reallocates $2\times$ capacity when `size == capacity`.
3. **Micro-Step 3: Automatic Dynamic Shrinking** — Reallocates $\frac{1}{2}\times$ capacity when `size <= capacity / 4` (prevents memory leaks & hysteresis thrashing).
4. **Micro-Step 4: Index Insertion & Removal Shifting** — $O(N)$ array copying using `System.arraycopy`. Nullifying dangling references for Garbage Collection (GC).
5. **Micro-Step 5: Custom Iterator Support** — Implementing `Iterable<T>` and custom `Iterator<T>` for for-each loop integration.

#### ASCII Memory Diagrams:
```
DYNAMIC ARRAY INTERNAL MEMORY STRUCTURE:
Heap Object
+-------------------------------------------------------+
| data -> [ 10 | 20 | 30 | 40 | null | null | ... null ]|
| size = 4                                              |
| capacity = 10                                         |
+-------------------------------------------------------+
  0      1      2      3      4      5          9

INSERTION AT INDEX 1 (Shift Right):
Before: [ 10 | 20 | 30 | 40 | null ]  Insert(index=1, val=15)
Shift:       \    \    \
After:  [ 10 | 15 | 20 | 30 | 40   ]

REMOVAL AT INDEX 1 (Shift Left & Null Clear):
Before: [ 10 | 15 | 20 | 30 | 40 ]    Remove(index=1)
Shift:          /    /    /
After:  [ 10 | 20 | 30 | 40 | null ]  (data[size-1] set to null for GC!)
```

#### Method Logic & Main Demonstration:
* Class Header: `public class Step02_CustomDynamicArray<T> implements Iterable<T>`
* Constructors: `Step02_CustomDynamicArray()` (default 10) and `Step02_CustomDynamicArray(int initialCapacity)`.
* `public void add(T element)`: Check resize, assign `data[size++] = element`. Amortized $O(1)$.
* `public void insert(int index, T element)`: Bounds check `0 <= index <= size`. Check resize. `System.arraycopy(data, index, data, index + 1, size - index)`. Assign `data[index] = element`, `size++`.
* `public T remove(int index)`: Bounds check `0 <= index < size`. Extract `removed = data[index]`. `System.arraycopy(data, index + 1, data, index, size - index - 1)`. `data[--size] = null`. Check shrink `size <= capacity / 4`. Return `removed`.
* `private void resize(int newCapacity)`: Allocates `new Object[newCapacity]`, copies data, updates `capacity`. Logs resize event.
* `public Iterator<T> iterator()`: Anonymous or static inner `Iterator<T>` class implementation.
* `public static void main(String[] args)`:
  - Instantiates `Step02_CustomDynamicArray<Integer>(4)`.
  - Adds elements triggering capacity expansion ($4 \to 8 \to 16$).
  - Inserts and removes elements, verifying dynamic shrink ($16 \to 8$).
  - Demonstrates element traversal using a for-each loop.

---

### File 2.3: `Step03_TwoPointerTechniques.java`

* **Target File Path**: `src/module02_arrays_and_strings/Step03_TwoPointerTechniques.java`
* **Package Declaration**: `package module02_arrays_and_strings;`

#### Core Concepts & Micro-Steps:
1. **Micro-Step 1: Two-Pointer Paradigm Categorization** — Opposite direction pointers (converging) vs Same direction pointers (fast/slow).
2. **Micro-Step 2: Two Sum II on Sorted Array (LeetCode 167)** — Exploits array sorted property. $O(N)$ Time, $O(1)$ Space.
3. **Micro-Step 3: Container With Most Water (LeetCode 11)** — Greedy container width/height maximization. $O(N)$ Time, $O(1)$ Space.
4. **Micro-Step 4: Valid Palindrome String Traversal** — Converging two-pointer string validation with non-alphanumeric filtering.

#### ASCII Memory Diagrams:
```
TWO SUM II (SORTED ARRAY, Target = 18):
Array:  [ 2 | 7 | 11 | 15 | 18 | 22 ]
          ^                       ^
         left (0)               right (5)  Sum = 2+22 = 24 > 18 -> right--

Array:  [ 2 | 7 | 11 | 15 | 18 | 22 ]
          ^                  ^
         left (0)          right (4)       Sum = 2+18 = 20 > 18 -> right--

Array:  [ 2 | 7 | 11 | 15 | 18 | 22 ]
          ^             ^
         left (0)     right (3)            Sum = 2+15 = 17 < 18 -> left++

Array:  [ 2 | 7 | 11 | 15 | 18 | 22 ]
              ^         ^
             left (1) right (3)            Sum = 7+15 = 22 > 18 -> right--

Array:  [ 2 | 7 | 11 | 15 | 18 | 22 ]
              ^    ^
             left  right                   Sum = 7+11 = 18 == Target! FOUND!

CONTAINER WITH MOST WATER:
Height: [ 1 | 8 | 6 | 2 | 5 | 4 | 8 | 3 | 7 ]
          L                                 R
Width = R - L = 8, Height = min(1, 7) = 1 -> Area = 8 * 1 = 8
Since height[L] < height[R], move L -> (Shrink shorter line greedily)
```

#### Method Logic & Main Demonstration:
* `public static int[] twoSumSorted(int[] numbers, int target)`:
  - `left = 0, right = numbers.length - 1`.
  - While `left < right`: `sum = numbers[left] + numbers[right]`. If `sum == target` return 1-based index `{left + 1, right + 1}`. If `sum < target` `left++`, else `right--`. Return `{-1, -1}`.
* `public static int maxArea(int[] height)`:
  - `left = 0, right = height.length - 1, maxW = 0`.
  - While `left < right`: `h = Math.min(height[left], height[right])`, `maxW = Math.max(maxW, h * (right - left))`. If `height[left] < height[right]` `left++`, else `right--`. Return `maxW`.
* `public static boolean isPalindrome(String s)`:
  - Converging pointer scan skipping non-alphanumeric characters, comparing `Character.toLowerCase`.
* `public static void main(String[] args)`:
  - Executes all 3 algorithms with step-by-step logging of pointer positions and decisions.

---

### File 2.4: `Step04_MultiPointer3Sum.java`

* **Target File Path**: `src/module02_arrays_and_strings/Step04_MultiPointer3Sum.java`
* **Package Declaration**: `package module02_arrays_and_strings;`

#### Core Concepts & Micro-Steps:
1. **Micro-Step 1: Triplet Reduction Mechanics** — Reducing $O(N^3)$ brute force to $O(N^2)$ by sorting + outer loop + inner converging two-pointer scan.
2. **Micro-Step 2: Strict Duplicate Triplet Avoidance** — Deduplication logic for outer index $i$ and inner pointers $left$, $right$.
3. **Micro-Step 3: Search Space Pruning Optimizations** — Early break when fixed element `nums[i] > 0` (since array is sorted, positive numbers cannot sum to 0).
4. **Micro-Step 4: 3Sum Closest Variant** — Adapting multi-pointer logic to target distance minimization.

#### ASCII Memory Diagrams:
```
3SUM MULTI-POINTER LAYOUT:
Sorted Array: [ -4 | -1 | -1 |  0 |  1 |  2 ]
                 ^     ^                  ^
                 i    left              right
               fixed

Step 1: Fix i=0 (val=-4). left=1 (-1), right=5 (2). Sum = -4 + -1 + 2 = -3 < 0 -> left++
Step 2: Fix i=1 (val=-1). left=2 (-1), right=5 (2). Sum = -1 + -1 + 2 = 0 -> MATCH FOUND!
        Add [-1, -1, 2].
        Skip duplicate left (-1 == -1) -> left++
        Skip duplicate right (2) -> right--

DUPLICATE SKIPPING FLOW CHART:
[Fixed i] -> Check: (i > 0 && nums[i] == nums[i-1]) ? YES -> continue (skip)
[Match Found] -> Check: (left < right && nums[left] == nums[left+1]) ? YES -> left++
```

#### Method Logic & Main Demonstration:
* `public static List<List<Integer>> threeSum(int[] nums)`:
  - `Arrays.sort(nums)`.
  - `List<List<Integer>> res = new ArrayList<>()`.
  - Loop `i` from $0$ to `nums.length - 3`:
    - If `nums[i] > 0` break.
    - If `i > 0 && nums[i] == nums[i - 1]` continue (skip duplicate fixed element).
    - `left = i + 1, right = nums.length - 1`.
    - While `left < right`:
      - `sum = nums[i] + nums[left] + nums[right]`.
      - If `sum == 0`: add `Arrays.asList(nums[i], nums[left], nums[right])`.
        - While `left < right && nums[left] == nums[left + 1]` `left++`.
        - While `left < right && nums[right] == nums[right - 1]` `right--`.
        - `left++`, `right--`.
      - Else if `sum < 0` `left++`, else `right--`.
  - Return `res`.
* `public static int threeSumClosest(int[] nums, int target)`:
  - Tracks minimal `Math.abs(target - sum)`.
* `public static void main(String[] args)`:
  - Runs `threeSum` on input `{-1, 0, 1, 2, -1, -4}`.
  - Logs step-by-step pointer positions, duplicate skips, and final triplet output.

---

### File 2.5: `Step05_FixedAndVariableSlidingWindow.java`

* **Target File Path**: `src/module02_arrays_and_strings/Step05_FixedAndVariableSlidingWindow.java`
* **Package Declaration**: `package module02_arrays_and_strings;`

#### Core Concepts & Micro-Steps:
1. **Micro-Step 1: Sliding Window Mental Model** — Overlapping sub-problem reuse instead of nested recalculation.
2. **Micro-Step 2: Fixed Window Technique** — Maximum Sum Subarray of size $K$. Sliding state equation: $\text{windowSum} \leftarrow \text{windowSum} + \text{arr}[\text{right}] - \text{arr}[\text{right} - K]$. $O(N)$ Time, $O(1)$ Space.
3. **Micro-Step 3: Variable Window Technique (Expand/Shrink)** — Longest Substring Without Repeating Characters (LeetCode 3). Expanding `right`, shrinking `left` on hash map conflict. $O(N)$ Time, $O(1)$ auxiliary character space.
4. **Micro-Step 4: Minimum Size Subarray Sum (LeetCode 209)** — Shrinking window condition based on running target sum requirement.

#### ASCII Memory Diagrams:
```
FIXED SLIDING WINDOW (Window Size K = 3):
Array: [ 2 | 1 | 5 | 1 | 3 | 2 ]
       [=======]                  Initial Window Sum = 2+1+5 = 8
           [=======]              Slide Right: Add 1, Subtract 2 -> Sum = 8+1-2 = 7
               [=======]          Slide Right: Add 3, Subtract 1 -> Sum = 7+3-1 = 9 (MAX!)

VARIABLE SLIDING WINDOW (Longest Substring Without Repeating Chars):
String: "a b c a b c b b"
        L     R                   Window "abc", HashMap={a:0, b:1, c:2}, MaxLen=3
        L       R                 'a' duplicate seen at idx 0!
          L     R                 Shift L to max(L, map.get('a')+1) = 1 -> Window "bca", MaxLen=3
```

#### Method Logic & Main Demonstration:
* `public static int maxSubarraySumFixed(int[] arr, int k)`:
  - Validate `arr.length >= k`.
  - Compute initial sum for `i = 0` to `k - 1`. Set `maxSum = currentSum`.
  - Loop `i` from `k` to `arr.length - 1`: `currentSum += arr[i] - arr[i - k]`, `maxSum = Math.max(maxSum, currentSum)`. Return `maxSum`.
* `public static int lengthOfLongestSubstringVariable(String s)`:
  - `Map<Character, Integer> lastSeen = new HashMap<>()`, `left = 0, maxLen = 0`.
  - Loop `right` from $0$ to `s.length() - 1`:
    - `char c = s.charAt(right)`.
    - If `lastSeen.containsKey(c)` `left = Math.max(left, lastSeen.get(c) + 1)`.
    - `lastSeen.put(c, right)`, `maxLen = Math.max(maxLen, right - left + 1)`.
  - Return `maxLen`.
* `public static int minSubArrayLen(int target, int[] nums)`:
  - `left = 0, sum = 0, minLen = Integer.MAX_VALUE`.
  - Loop `right` from $0$ to `nums.length - 1`: `sum += nums[right]`.
  - While `sum >= target`: `minLen = Math.min(minLen, right - left + 1)`, `sum -= nums[left++]`.
  - Return `minLen == Integer.MAX_VALUE ? 0 : minLen`.
* `public static void main(String[] args)`:
  - Demonstrates Fixed Window maximum sum, Variable Window unique string, and Minimum Window target sum with step-by-step window bounds output `[left...right]`.

---

### File 2.6: `Step06_AdvancedMonotonicDequeWindow.java`

* **Target File Path**: `src/module02_arrays_and_strings/Step06_AdvancedMonotonicDequeWindow.java`
* **Package Declaration**: `package module02_arrays_and_strings;`

#### Core Concepts & Micro-Steps:
1. **Micro-Step 1: Monotonic Deque Invariants** — Double-ended queue storing array indices maintaining strictly decreasing values: `nums[deque.peekFirst()] > ... > nums[deque.peekLast()]`.
2. **Micro-Step 2: Sliding Window Maximum (LeetCode 239 - Hard)** — Achieving $O(N)$ time complexity for $N-K+1$ window maximum queries.
3. **Micro-Step 3: Two-Ended Eviction Mechanics**:
   - **Front Eviction**: Remove indices out of current window range (`index < right - K + 1`).
   - **Back Eviction**: Remove indices whose values are $\le$ incoming element `nums[right]` (since the smaller older elements can never be the maximum again).
4. **Micro-Step 4: Amortized Proof of O(N) Complexity** — Every index is added to the deque exactly once and removed at most once. Total push/pop operations across $N$ iterations $\le 2N = O(N)$.

#### ASCII Memory Diagrams:
```
MONOTONIC DECREASING DEQUE INVARIANT:
Window Elements: [ 5, 3, 2 ]
Deque Content (Indices): [ Head: idx of 5 | idx of 3 | Tail: idx of 2 ]
                               ^ Max Element always at Head!

SLIDING WINDOW STEP TRACE (arr = [1, 3, -1, -3, 5, 3, 6, 7], K = 3):
i=0 (val=1):  Deque=[0 (val 1)]
i=1 (val=3):  3 > 1 -> Pop back 0! Deque=[1 (val 3)]
i=2 (val=-1): -1 < 3 -> Deque=[1 (val 3), 2 (val -1)] -> Window 0 Max = arr[Deque.head] = 3
i=3 (val=-3): -3 < -1 -> Deque=[1 (val 3), 2 (val -1), 3 (val -3)] -> Window 1 Max = 3
i=4 (val=5):  Evict expired head idx 1 (out of range [2..4])!
              5 > -3, 5 > -1, 5 > 3 -> Pop back 3, 2, 1! Deque=[4 (val 5)] -> Window 2 Max = 5
...
Final Result Array: [3, 3, 5, 5, 6, 7]
```

#### Method Logic & Main Demonstration:
* `public static int[] maxSlidingWindow(int[] nums, int k)`:
  - Check null or `k <= 0` or `nums.length == 0`.
  - `int n = nums.length; int[] res = new int[n - k + 1]; int resIdx = 0;`
  - `Deque<Integer> deque = new ArrayDeque<>();`
  - Loop `i` from $0$ to `n - 1`:
    - **Evict expired head**: `while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) deque.pollFirst();`
    - **Evict dominated tail elements**: `while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]) deque.pollLast();`
    - `deque.offerLast(i);`
    - If `i >= k - 1`, `res[resIdx++] = nums[deque.peekFirst()];`
  - Return `res`.
* `public static void main(String[] args)`:
  - Executes `maxSlidingWindow` on `nums = {1, 3, -1, -3, 5, 3, 6, 7}` with `k = 3`.
  - Prints visual table of index `i`, current incoming element, deque contents (values & indices), evicted elements, and window max result.

---

## Verification Plan for Implementer

### Build Verification Command:
```bash
find src/module01_foundations src/module02_arrays_and_strings -name "*.java" | xargs javac -d bin
```
*Must complete with **zero** syntax or type errors.*

### Execution Verification Command:
```bash
java -cp bin module01_foundations.Step01_ConstantAndLinearTime
java -cp bin module01_foundations.Step02_LogarithmicAndQuadraticTime
java -cp bin module01_foundations.Step03_AmortizedAnalysis
java -cp bin module01_foundations.Step04_RecursionAndStackFrames
java -cp bin module01_foundations.Step05_ComprehensiveComplexitySuite
java -cp bin module02_arrays_and_strings.Step01_BasicArrayOperations
java -cp bin module02_arrays_and_strings.Step02_CustomDynamicArray
java -cp bin module02_arrays_and_strings.Step03_TwoPointerTechniques
java -cp bin module02_arrays_and_strings.Step04_MultiPointer3Sum
java -cp bin module02_arrays_and_strings.Step05_FixedAndVariableSlidingWindow
java -cp bin module02_arrays_and_strings.Step06_AdvancedMonotonicDequeWindow
```

---

## Summary Matrix

| Module | Step File | Package | Primary Class | Algorithm / Concept |
|---|---|---|---|---|
| Module 01 | `Step01_ConstantAndLinearTime.java` | `module01_foundations` | `Step01_ConstantAndLinearTime` | $O(1)$ lookup, $O(N)$ sum & search |
| Module 01 | `Step02_LogarithmicAndQuadraticTime.java` | `module01_foundations` | `Step02_LogarithmicAndQuadraticTime` | $O(\log N)$ binary halving, $O(N^2)$ nested loops |
| Module 01 | `Step03_AmortizedAnalysis.java` | `module01_foundations` | `Step03_AmortizedAnalysis` | Aggregate method dynamic array 2x expansion |
| Module 01 | `Step04_RecursionAndStackFrames.java` | `module01_foundations` | `Step04_RecursionAndStackFrames` | JVM call stack frames & recursion limits |
| Module 01 | `Step05_ComprehensiveComplexitySuite.java` | `module01_foundations` | `Step05_ComprehensiveComplexitySuite` | Benchmarking suite across Big-O spectrum |
| Module 02 | `Step01_BasicArrayOperations.java` | `module02_arrays_and_strings` | `Step01_BasicArrayOperations` | In-place reversal, min/max, element removal |
| Module 02 | `Step02_CustomDynamicArray.java` | `module02_arrays_and_strings` | `Step02_CustomDynamicArray` | Custom dynamic array with resize & shrink |
| Module 02 | `Step03_TwoPointerTechniques.java` | `module02_arrays_and_strings` | `Step03_TwoPointerTechniques` | Two Sum II sorted & Container With Most Water |
| Module 02 | `Step04_MultiPointer3Sum.java` | `module02_arrays_and_strings` | `Step04_MultiPointer3Sum` | 3Sum problem with duplicate pruning |
| Module 02 | `Step05_FixedAndVariableSlidingWindow.java` | `module02_arrays_and_strings` | `Step05_FixedAndVariableSlidingWindow` | Fixed K subarray sum & Variable unique substring |
| Module 02 | `Step06_AdvancedMonotonicDequeWindow.java` | `module02_arrays_and_strings` | `Step06_AdvancedMonotonicDequeWindow` | Sliding window max using Monotonic Deque |


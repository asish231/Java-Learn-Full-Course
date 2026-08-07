# Implementation Specification: Milestone 1 — Modules 03 & 04

## Overview & Scope Summary

This specification covers the implementation details for **Module 03 (Linked Lists)** and **Module 04 (Stacks & Queues)** under Milestone 1 of the Java DSA Curriculum Restructuring project.

### Key Architectural Guidelines
1. **Target Directory Structure**:
   - Module 03: `src/module03_linked_lists/`
   - Module 04: `src/module04_stacks_and_queues/`
2. **Package Declarations**:
   - Module 03 files: `package module03_linked_lists;`
   - Module 04 files: `package module04_stacks_and_queues;`
3. **Self-Containment & Zero External Dependencies**:
   - Each `StepXX_*.java` file is completely standalone.
   - All custom data structures (nodes, queues, stacks) are implemented as `static` or `static class` within the file.
   - Standard Java library utilities (e.g., `java.util.Arrays`, `java.util.HashMap`, `java.util.Deque`, `java.util.ArrayDeque`) are imported only where required for standard references or algorithms.
4. **Rich Visual Comments & Main Method Output**:
   - Every file features explicit top-level and method-level ASCII diagrams depicting pointer links, memory states, stack frames, circular buffer wrap-around, or algorithm execution traces.
   - Each file contains a comprehensive `public static void main(String[] args)` method demonstrating step-by-step micro-step execution with structured learning logs.

---

## Module 03: Linked Lists Specification

Module 03 contains 6 micro-step lesson files designed to guide a learner from fundamental node references up to complex data structure design (LRU Cache) and classic algorithm patterns.

---

### File 1: `Step01_SinglyLinkedListBasics.java`

#### 1. Target File Path & Package
- **Path**: `src/module03_linked_lists/Step01_SinglyLinkedListBasics.java`
- **Package**: `package module03_linked_lists;`

#### 2. Core Concepts Taught & Micro-Step Plan
- **Step 1: Node Anatomy & Object References**: Understanding how a node stores data (`val`) and a reference pointer (`next`) to another Node object in Heap memory.
- **Step 2: Head Pointer & Traversal**: Traversing a singly linked list from `head` to `null` sequentially without losing the reference to `head`.
- **Step 3: Fundamental Operations (CRUD)**:
  - `insertHead`: $O(1)$ time insertion at the front.
  - `insertTail`: $O(N)$ time (or $O(1)$ with tail pointer) traversal to the end and appending.
  - `insertAtIndex`: Navigating to index $k-1$ and linking new node.
  - `deleteValue`: Removing the first occurrence of a target value by re-pointing `prev.next = curr.next`.
  - `search`: Linear search returning index or boolean existence.

#### 3. Required ASCII Memory State / Pointer Diagrams

```
1. Node Structure in Heap Memory:
   +-------+------+      +-------+------+      +-------+------+
   | val:  | next | ---> | val:  | next | ---> | val:  | next | ---> null
   |  10   | 0x02 |      |  20   | 0x03 |      |  30   | null |
   +-------+------+      +-------+------+      +-------+------+
   @0x01                 @0x02                 @0x03
   ^ head

2. Insertion at Head (O(1)):
   newNode: [ 5 | null ]
   Step A: newNode.next = head;
   Step B: head = newNode;
   
   +-------+------+     +-------+------+     +-------+------+
   | val:5 | next | --> |val:10 | next | --> |val:20 | null |
   +-------+------+     +-------+------+     +-------+------+
   ^ new head           ^ old head

3. Deletion of Node (val = 20):
   Before: [ 10 ] ---> [ 20 ] ---> [ 30 ] ---> null
                       ^ curr
   Re-link: prev.next = curr.next
   After:  [ 10 ] ----------------> [ 30 ] ---> null
```

#### 4. Detailed Method Specs & Logic
- `static class Node`: Field `int val`, `Node next`, constructor `Node(int val)`.
- `public static Node insertHead(Node head, int val)`:
  - Creates `newNode = new Node(val)`, sets `newNode.next = head`, returns `newNode`.
- `public static Node insertTail(Node head, int val)`:
  - If `head == null`, returns `new Node(val)`. Otherwise traverses `curr` to `curr.next == null`, sets `curr.next = new Node(val)`, returns `head`.
- `public static Node deleteValue(Node head, int val)`:
  - Edge cases: `head == null` returns `null`. If `head.val == val`, returns `head.next`.
  - Traverses `curr` while `curr.next != null && curr.next.val != val`.
  - If found, `curr.next = curr.next.next`. Returns `head`.
- `public static boolean search(Node head, int target)`:
  - Iterates `curr`, returns `true` if `curr.val == target`, else `false`.
- `public static void printList(Node head)`:
  - Prints nodes formatted as `10 -> 20 -> 30 -> null`.

#### 5. Public Static Void Main Learning Output Demonstration
- Log header: `=== Step 01: Singly Linked List Basics ===`
- Demonstrate `insertHead` with values 30, 20, 10 -> list `10 -> 20 -> 30 -> null`.
- Demonstrate `insertTail` with 40 -> list `10 -> 20 -> 30 -> 40 -> null`.
- Demonstrate `search(20)` -> prints `Found 20: true`.
- Demonstrate `deleteValue(20)` -> prints updated list `10 -> 30 -> 40 -> null`.
- Demonstrate edge case: `deleteValue` of head node (10) -> list `30 -> 40 -> null`.

---

### File 2: `Step02_DoublyLinkedListBasics.java`

#### 1. Target File Path & Package
- **Path**: `src/module03_linked_lists/Step02_DoublyLinkedListBasics.java`
- **Package**: `package module03_linked_lists;`

#### 2. Core Concepts Taught & Micro-Step Plan
- **Step 1: Bidirectional Pointers**: Doubly Linked List Node anatomy with `prev`, `val`, and `next`.
- **Step 2: Head & Tail Management**: Maintaining both `head` and `tail` pointers to allow $O(1)$ operations at both ends.
- **Step 3: Forward & Backward Traversal**: Demonstrating dual-direction traversal leveraging `prev` pointers.
- **Step 4: Safe Deletion & Insertion Logic**: Correctly updating 4 pointers during middle insertions/deletions without breaking link integrity or causing NullPointerExceptions.

#### 3. Required ASCII Memory State / Pointer Diagrams

```
1. Doubly Linked List Node Layout:
   null <-- +------+------+------+ <===> +------+------+------+ --> null
            | prev | val  | next |       | prev | val  | next |
            +------+------+------+       +------+------+------+
            ^ head                       ^ tail

2. Insertion at Tail (O(1)):
   newNode: [ prev | 40 | next ]
   Step A: newNode.prev = tail;
   Step B: tail.next = newNode;
   Step C: tail = newNode;

   null <-> [10] <-> [20] <-> [30] <===> [40] <-> null
                               ^ old tail ^ new tail

3. Deletion of Middle Node (Target: Node B):
   Node A <=======> Node B <=======> Node C
   Re-link next: A.next = B.next (Node C)
   Re-link prev: C.prev = B.prev (Node A)
   Node B references unlinked -> Garbage Collected.
```

#### 4. Detailed Method Specs & Logic
- `static class DNode`: `int val`, `DNode prev`, `DNode next`, constructor `DNode(int val)`.
- Class `DoublyLinkedList`:
  - Fields: `private DNode head`, `private DNode tail`, `private int size`.
  - `public void insertHead(int val)`: Handles empty list vs non-empty list.
  - `public void insertTail(int val)`: Handles empty list vs non-empty list.
  - `public int removeHead()`: Removes head, updates `head = head.next`, sets `head.prev = null` (or nullifies `tail` if list becomes empty).
  - `public int removeTail()`: Removes tail, updates `tail = tail.prev`, sets `tail.next = null` (or nullifies `head` if list becomes empty).
  - `public void displayForward()`: Prints list from head to tail: `null <-> 10 <-> 20 <-> 30 <-> null`.
  - `public void displayBackward()`: Prints list from tail to head: `null <-> 30 <-> 20 <-> 10 <-> null`.

#### 5. Public Static Void Main Learning Output Demonstration
- Log header: `=== Step 02: Doubly Linked List Basics ===`
- Create list, insert 10, 20 at tail, insert 5 at head.
- Print forward: `null <-> 5 <-> 10 <-> 20 <-> null`.
- Print backward: `null <-> 20 <-> 10 <-> 5 <-> null`.
- Remove head -> output removed value `5`, display forward.
- Remove tail -> output removed value `20`, display forward.

---

### File 3: `Step03_PointerReversalAndMiddle.java`

#### 1. Target File Path & Package
- **Path**: `src/module03_linked_lists/Step03_PointerReversalAndMiddle.java`
- **Package**: `package module03_linked_lists;`

#### 2. Core Concepts Taught & Micro-Step Plan
- **Step 1: Iterative Pointer Reversal**: Reversing links in $O(N)$ time and $O(1)$ space using 3 pointers (`prev`, `curr`, `nextTemp`).
- **Step 2: Recursive Pointer Reversal**: Understanding call stack frame progression for recursive reversal.
- **Step 3: Fast & Slow Pointer Technique (Floyd's Tortoise & Hare)**: Finding middle node of linked list in a single pass.
- **Step 4: Odd vs. Even Length Handling**: Middle finder exact behavior for odd (exact middle) vs. even (second middle node).

#### 3. Required ASCII Memory State / Pointer Diagrams

```
1. 3-Pointer Iterative Reversal Trace:
   Initial State:
   null     [ 10 ] ---> [ 20 ] ---> [ 30 ] ---> null
    ^        ^           ^
   prev     curr       nextTemp

   Iteration 1:
   curr.next = prev;  (10 -> null)
   prev = curr;       (prev = 10)
   curr = nextTemp;   (curr = 20)

   null <--- [ 10 ]     [ 20 ] ---> [ 30 ] ---> null
              ^          ^           ^
             prev       curr       nextTemp

   Final State:
   null <--- [ 10 ] <--- [ 20 ] <--- [ 30 ]     null
                                      ^          ^
                                     prev       curr (null)
   return prev; (new head = 30)

2. Fast & Slow Pointer (Middle Finder):
   Odd Length (1 -> 2 -> 3 -> 4 -> 5):
   Step 0: S=1, F=1
   Step 1: S=2, F=3
   Step 2: S=3, F=5  (F.next == null -> Stop! Slow is at Middle 3)

   Even Length (1 -> 2 -> 3 -> 4 -> 5 -> 6):
   Step 0: S=1, F=1
   Step 1: S=2, F=3
   Step 2: S=3, F=5
   Step 3: S=4, F=null (Stop! Slow is at Second Middle 4)
```

#### 4. Detailed Method Specs & Logic
- `static class Node`: `int val`, `Node next`.
- `public static Node reverseIterative(Node head)`:
  - `Node prev = null`, `Node curr = head`.
  - `while (curr != null)`: `Node nextTemp = curr.next; curr.next = prev; prev = curr; curr = nextTemp;`.
  - Return `prev`.
- `public static Node reverseRecursive(Node head)`:
  - Base case: `if (head == null || head.next == null) return head;`.
  - `Node newHead = reverseRecursive(head.next);`.
  - `head.next.next = head; head.next = null;`.
  - Return `newHead`.
- `public static Node findMiddle(Node head)`:
  - `Node slow = head, fast = head;`.
  - `while (fast != null && fast.next != null)`: `slow = slow.next; fast = fast.next.next;`.
  - Return `slow`.

#### 5. Public Static Void Main Learning Output Demonstration
- Log header: `=== Step 03: Pointer Reversal and Middle Finder ===`
- Build list `1 -> 2 -> 3 -> 4 -> 5`.
- Demonstrate `findMiddle` -> output `Middle value: 3`.
- Demonstrate `reverseIterative` -> output `Reversed list: 5 -> 4 -> 3 -> 2 -> 1 -> null`.
- Demonstrate `reverseRecursive` on `5 -> 4 -> 3 -> 2 -> 1` -> output `Re-reversed back: 1 -> 2 -> 3 -> 4 -> 5 -> null`.
- Demonstrate `findMiddle` on even length list `1 -> 2 -> 3 -> 4 -> 5 -> 6` -> output `Middle value: 4`.

---

### File 4: `Step04_FloydsCycleDetection.java`

#### 1. Target File Path & Package
- **Path**: `src/module03_linked_lists/Step04_FloydsCycleDetection.java`
- **Package**: `package module03_linked_lists;`

#### 2. Core Concepts Taught & Micro-Step Plan
- **Step 1: The Cycle Problem**: Why naive hash set detection uses $O(N)$ memory, whereas Floyd's algorithm uses $O(1)$ memory.
- **Step 2: Phase 1 — Cycle Detection**: Fast pointer moving 2 steps, slow moving 1 step. Proving that relative velocity of 1 guarantees collision within $C$ steps if cycle exists.
- **Step 3: Phase 2 — Cycle Entry Node Discovery**: Resetting `slow` pointer to `head`, keeping `fast` at intersection point, advancing both 1 step at a time until they meet at the cycle entrance.
- **Step 4: Cycle Length Calculation**: Counting steps as `fast` traverses cycle once from intersection point back to itself.

#### 3. Required ASCII Memory State / Pointer Diagrams

```
1. Cyclic Linked List Diagram:
          Non-cycle distance (A)           Cycle length (C)
   head -> [ 1 ] -> [ 2 ] -> [ 3 ] -------> [ 4 ] -> [ 5 ]
                              ^              |        |
                              |              v        v
                              +------------ [ 7 ] <- [ 6 ]
                                            (Cycle Entry = 3)

2. Mathematical Proof of Entry Node Alignment:
   Let A = distance from head to cycle entrance (node 3)
   Let B = distance from entrance to meeting point inside cycle
   Let C = total cycle length
   
   Distance traveled by Slow = A + B
   Distance traveled by Fast = A + B + k*C
   Since Fast moves 2x speed of Slow:
     2 * (A + B) = A + B + k*C
     => A + B = k*C
     => A = k*C - B = (k-1)*C + (C - B)
   
   Conclusion: The distance from Head to Entry (A) equals the distance 
   from Meeting Point to Entry (C - B)!
   Therefore, resetting Slow to Head and advancing both by 1 step guarantees
   they meet EXACTLY at the Cycle Entry Node.
```

#### 4. Detailed Method Specs & Logic
- `static class Node`: `int val`, `Node next`.
- `public static boolean hasCycle(Node head)`: Returns true if fast & slow collide.
- `public static Node detectCycleEntry(Node head)`:
  - Phase 1: Detect collision using `slow` (1 step) and `fast` (2 steps). If `fast == null || fast.next == null`, return `null`.
  - Phase 2: Set `slow = head`. While `slow != fast`, advance `slow = slow.next` and `fast = fast.next`.
  - Return `slow` (entry node).
- `public static int getCycleLength(Node head)`:
  - Find meeting point node `meetingPoint`.
  - Advance `temp = meetingPoint.next` and count steps until `temp == meetingPoint`. Return count.

#### 5. Public Static Void Main Learning Output Demonstration
- Log header: `=== Step 04: Floyd's Cycle Detection Algorithm ===`
- Build acyclic list `1 -> 2 -> 3 -> 4 -> null`.
- Run `hasCycle` -> `false`, `detectCycleEntry` -> `null`.
- Create cycle: link node 4 back to node 2 (`1 -> 2 -> 3 -> 4 -> node 2`).
- Run `hasCycle` -> `true`.
- Run `detectCycleEntry` -> outputs `Cycle entry node value: 2`.
- Run `getCycleLength` -> outputs `Cycle length: 3 nodes`.

---

### File 5: `Step05_AdvancedLRUCache.java`

#### 1. Target File Path & Package
- **Path**: `src/module03_linked_lists/Step05_AdvancedLRUCache.java`
- **Package**: `package module03_linked_lists;`

#### 2. Core Concepts Taught & Micro-Step Plan
- **Step 1: System Requirements for LRU Cache**: $O(1)$ time complexity for both `get(key)` and `put(key, value)` with bounded capacity.
- **Step 2: Dual Data Structure Design**:
  - `HashMap<Integer, DNode>` for $O(1)$ key lookup.
  - Custom `Doubly LinkedList` with dummy `head` and `tail` sentinels for $O(1)$ node insertion/removal.
- **Step 3: Sentinel Node Technique**: Dummy `head` (MRU side) and dummy `tail` (LRU side) eliminate null-checks during node splice operations.
- **Step 4: Cache Eviction & Recency Updates**: Moving accessed node to head on `get`; evicting `tail.prev` node on `put` when capacity is exceeded.

#### 3. Required ASCII Memory State / Pointer Diagrams

```
1. LRU Cache Architecture (Capacity = 3):
   
   HashMap:
   +-------+--------------------+
   | Key 1 | ---> Node(1, 100)  |
   | Key 2 | ---> Node(2, 200)  |
   | Key 3 | ---> Node(3, 300)  |
   +-------+--------------------+

   Doubly Linked List (Sentinel Head & Tail):
               (Most Recently Used)                (Least Recently Used)
   +------+    +---------------+    +---------------+    +---------------+    +------+
   |HEAD  |<==>| Node(3, 300)  |<==>| Node(2, 200)  |<==>| Node(1, 100)  |<==>|TAIL  |
   |dummy |    | k:3, v:300    |    | k:2, v:200    |    | k:1, v:100    |    |dummy |
   +------+    +---------------+    +---------------+    +---------------+    +------+

2. Eviction Trace on put(4, 400) when Full:
   Step A: Evict LRU node (tail.prev = Node(1, 100))
   Step B: Remove Key 1 from HashMap
   Step C: Splice Node(1) out of DLL
   Step D: Insert new Node(4, 400) right after HEAD sentinel.
```

#### 4. Detailed Method Specs & Logic
- `static class DNode`: `int key`, `int value`, `DNode prev`, `DNode next`.
- Class `Step05_AdvancedLRUCache`:
  - Fields: `private final int capacity`, `private final Map<Integer, DNode> map`, `private final DNode head, tail`.
  - Constructor `Step05_AdvancedLRUCache(int capacity)`: Initializes map and sentinels `head.next = tail`, `tail.prev = head`.
  - Helper `private void addNodeToHead(DNode node)`: Links node after `head`.
  - Helper `private void removeNode(DNode node)`: Unlinks node by `node.prev.next = node.next; node.next.prev = node.prev;`.
  - `public int get(int key)`: If absent return -1. Otherwise `removeNode(node)`, `addNodeToHead(node)`, return `node.value`.
  - `public void put(int key, int value)`: If exists, update value, `removeNode(node)`, `addNodeToHead(node)`. If absent and `map.size() == capacity`, remove `tail.prev` from map and DLL, create `newNode`, insert in map and `addNodeToHead(newNode)`.

#### 5. Public Static Void Main Learning Output Demonstration
- Log header: `=== Step 05: Advanced LRU Cache (HashMap + Doubly LL) ===`
- Instantiate LRU cache with capacity 2.
- `put(1, 10)`, `put(2, 20)`.
- `get(1)` -> outputs `10` (key 1 becomes MRU, key 2 is LRU).
- `put(3, 30)` -> evicts key 2.
- `get(2)` -> outputs `-1` (evicted).
- `get(3)` -> outputs `30`.
- `put(4, 400)` -> evicts key 1.
- `get(1)` -> outputs `-1`, `get(3)` -> `30`, `get(4)` -> `400`.

---

### File 6: `Step06_LinkedListAlgorithmSuite.java`

#### 1. Target File Path & Package
- **Path**: `src/module03_linked_lists/Step06_LinkedListAlgorithmSuite.java`
- **Package**: `package module03_linked_lists;`

#### 2. Core Concepts Taught & Micro-Step Plan
- **Step 1: Merge Two Sorted Linked Lists**: $O(N+M)$ dummy head pattern for merging two sorted lists cleanly.
- **Step 2: Palindrome Linked List Verification**: $O(N)$ time, $O(1)$ space algorithm (Find middle using Fast/Slow -> Reverse second half -> Compare halves -> Restore list).
- **Step 3: Remove N-th Node From End**: $O(N)$ time, $O(1)$ space using two-pointer window offset by $N$ steps.
- **Step 4: Comprehensive Performance Benchmarking & Edge Case Handling**: Benchmarking array vs linked list operations and testing null/single-node edge cases.

#### 3. Required ASCII Memory State / Pointer Diagrams

```
1. Remove N-th Node From End (N = 2):
   Dummy -> [ 1 ] -> [ 2 ] -> [ 3 ] -> [ 4 ] -> [ 5 ] -> null
   
   Step A: Advance 'fast' pointer N+1 steps (3 steps):
   Dummy -> [ 1 ] -> [ 2 ] -> [ 3 ] -> [ 4 ] -> [ 5 ] -> null
     ^                          ^
    slow                       fast

   Step B: Advance 'slow' and 'fast' together until fast == null:
   Dummy -> [ 1 ] -> [ 2 ] -> [ 3 ] -> [ 4 ] -> [ 5 ] -> null
                                 ^                          ^
                                slow                       fast

   Step C: Delete slow.next (Node 4):
   slow.next = slow.next.next (Node 3 points to Node 5)

2. Palindrome Verification (1 -> 2 -> 2 -> 1):
   First Half:  1 -> 2
   Second Half Reversed: 1 -> 2
   Compare node values equality -> True!
```

#### 4. Detailed Method Specs & Logic
- `static class Node`: `int val`, `Node next`.
- `public static Node mergeTwoLists(Node l1, Node l2)`: Dummy node pattern, links smaller element until one is null, appends remainder.
- `public static boolean isPalindrome(Node head)`:
  - Find middle using fast/slow.
  - Reverse second half starting from middle.
  - Compare first half and reversed second half element by element.
  - (Optional) Re-reverse second half to restore list structure.
- `public static Node removeNthFromEnd(Node head, int n)`:
  - Use `dummy` node pointing to `head`.
  - Advance `fast` pointer $N+1$ steps from `dummy`.
  - Advance `slow` and `fast` together until `fast == null`.
  - Set `slow.next = slow.next.next`. Return `dummy.next`.
- Performance benchmark runner in `main`.

#### 5. Public Static Void Main Learning Output Demonstration
- Log header: `=== Step 06: Linked List Algorithm Suite & Benchmarks ===`
- Test `mergeTwoLists` on `1->3->5` and `2->4->6` -> `1->2->3->4->5->6`.
- Test `isPalindrome` on `1->2->2->1` -> `true`, and `1->2->3` -> `false`.
- Test `removeNthFromEnd` on `1->2->3->4->5` with $N=2$ -> `1->2->3->5`.
- Benchmark execution log: Time taken to iterate 1,000,000 nodes vs array traversal.

---

## Module 04: Stacks & Queues Specification

Module 04 contains 6 micro-step lesson files introducing linear ADTs (Stack & Queue), custom implementations, expression processing, monotonic stack patterns, and high-difficulty algorithms.

---

### File 7: `Step01_ArrayStackImplementation.java`

#### 1. Target File Path & Package
- **Path**: `src/module04_stacks_and_queues/Step01_ArrayStackImplementation.java`
- **Package**: `package module04_stacks_and_queues;`

#### 2. Core Concepts Taught & Micro-Step Plan
- **Step 1: LIFO Paradigm**: Last-In, First-Out stack semantics.
- **Step 2: Array-Backed Storage & Top Pointer**: Managing elements using a contiguous array and an integer index `top`.
- **Step 3: Dynamic Capacity Resizing**: Amortized $O(1)$ push operation by doubling array size upon overflow.
- **Step 4: Safe Error Handling**: Throwing standard exceptions (`EmptyStackException` or custom messages) on pop/peek underflow.

#### 3. Required ASCII Memory State / Pointer Diagrams

```
1. ArrayStack Internal State (Capacity = 4):
   
   Index:   [ 0 ]   [ 1 ]   [ 2 ]   [ 3 ]
   Value:  | 10  |  20   |  30   |       |
            -----------------------------
                                    ^ top = 2

2. Push Operation (push(40)):
   data[++top] = 40;
   Index:   [ 0 ]   [ 1 ]   [ 2 ]   [ 3 ]
   Value:  | 10  |  20   |  30   |  40   |
            -----------------------------
                                            ^ top = 3 (Full!)

3. Capacity Expansion (Doubling 4 -> 8 on push(50)):
   New Array allocated @ Heap, elements copied:
   Index:   [ 0 ] [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ] [ 6 ] [ 7 ]
   Value:  | 10  | 20  | 30  | 40  | 50  |     |     |     |
                                       ^ top = 4
```

#### 4. Detailed Method Specs & Logic
- Generic Class `ArrayStack<T>`:
  - Fields: `private Object[] data`, `private int top`, `private int capacity`.
  - Constructor `ArrayStack(int initialCapacity)`: Allocates `data = new Object[initialCapacity]`, sets `top = -1`.
  - `public void push(T item)`: If `top == capacity - 1`, call `resize(capacity * 2)`. `data[++top] = item;`.
  - `@SuppressWarnings("unchecked") public T pop()`: Checks `isEmpty()`, retrieves `T item = (T) data[top]`, sets `data[top--] = null` (prevents memory leak), returns `item`.
  - `@SuppressWarnings("unchecked") public T peek()`: Checks `isEmpty()`, returns `(T) data[top]`.
  - `public int size()`: Returns `top + 1`.
  - `public boolean isEmpty()`: Returns `top == -1`.
  - Helper `private void resize(int newCapacity)`: Allocates new array and copies old items via `System.arraycopy`.

#### 5. Public Static Void Main Learning Output Demonstration
- Log header: `=== Step 01: Dynamic Array Stack Implementation ===`
- Push items: `"A"`, `"B"`, `"C"`.
- Output state, size (3), peek item (`"C"`).
- Pop item -> outputs `"C"`, new top is `"B"`.
- Push items to trigger auto-resizing (e.g. push 10 elements).
- Log array capacity doubling events.

---

### File 8: `Step02_CircularQueueImplementation.java`

#### 1. Target File Path & Package
- **Path**: `src/module04_stacks_and_queues/Step02_CircularQueueImplementation.java`
- **Package**: `package module04_stacks_and_queues;`

#### 2. Core Concepts Taught & Micro-Step Plan
- **Step 1: FIFO Paradigm & Linear Queue Limitations**: Why naive array queues cause false overflow when elements are dequeued.
- **Step 2: Circular Buffer Ring Mechanics**: Using modulo arithmetic `(index + 1) % capacity` to reuse freed array slots.
- **Step 3: Pointer Management**: Maintaining `front`, `rear`, `size`, and `capacity`.
- **Step 4: Full vs Empty Disambiguation**: Using an explicit `size` counter or leaving 1 slot empty to distinguish full queue (`size == capacity`) from empty queue (`size == 0`).

#### 3. Required ASCII Memory State / Pointer Diagrams

```
1. Circular Buffer Index Ring (Capacity = 5):

                 [Index 0]
               /           \
         [Index 4]       [Index 1]
            |                 |
         [Index 3]-------[Index 2]

2. Circular Array State with Wrap-Around:
   Capacity = 5, Front = 3, Rear = 1, Size = 4

   Array:  [ 50 ]  [ 60 ]  [ -- ]  [ 30 ]  [ 40 ]
   Index:    0       1       2       3       4
                     ^               ^
                    rear            front

   Modulo Calculation:
   - Next Enqueue Slot = (rear + 1) % capacity = (1 + 1) % 5 = Index 2
   - Next Dequeue Slot = (front + 1) % capacity = (3 + 1) % 5 = Index 4
```

#### 4. Detailed Method Specs & Logic
- Generic Class `CircularQueue<T>`:
  - Fields: `private Object[] data`, `private int front`, `private int rear`, `private int size`, `private int capacity`.
  - Constructor `CircularQueue(int capacity)`: Allocates `data = new Object[capacity]`, `front = 0`, `rear = -1`, `size = 0`.
  - `public boolean isFull()`: `return size == capacity;`.
  - `public boolean isEmpty()`: `return size == 0;`.
  - `public void enqueue(T item)`: Throws exception if full. `rear = (rear + 1) % capacity; data[rear] = item; size++;`.
  - `@SuppressWarnings("unchecked") public T dequeue()`: Throws exception if empty. `T item = (T) data[front]; data[front] = null; front = (front + 1) % capacity; size--; return item;`.
  - `@SuppressWarnings("unchecked") public T peek()`: Throws exception if empty. `return (T) data[front];`.

#### 5. Public Static Void Main Learning Output Demonstration
- Log header: `=== Step 02: Circular Array Queue Implementation ===`
- Create `CircularQueue<Integer>` with capacity 4.
- Enqueue 10, 20, 30, 40 (queue full).
- Dequeue two elements (10, 20 removed -> front moves to index 2).
- Enqueue 50, 60 -> demonstrate wrap-around to indices 0 and 1.
- Display queue internal array slots and logical FIFO order.

---

### File 9: `Step03_StackApplicationsMatching.java`

#### 1. Target File Path & Package
- **Path**: `src/module04_stacks_and_queues/Step03_StackApplicationsMatching.java`
- **Package**: `package module04_stacks_and_queues;`

#### 2. Core Concepts Taught & Micro-Step Plan
- **Step 1: Valid Parentheses Matching**: Checking balanced delimiters `()`, `{}`, `[]` using stack.
- **Step 2: Postfix Expression (RPN) Evaluation**: Evaluating Reverse Polish Notation (e.g. `["2", "1", "+", "3", "*"]` -> `9`).
- **Step 3: Infix to Postfix Conversion Basics**: Using operator precedence and stack to transform standard mathematical notation.
- **Step 4: Call Stack Mental Model**: Connecting explicit stack data structures with compiler execution frames.

#### 3. Required ASCII Memory State / Pointer Diagrams

```
1. Parentheses Matching Stack Trace:
   Input String: "{ [ ( ) ] }"

   Char '{': Push '{' -> Stack: [ '{' ]
   Char '[': Push '[' -> Stack: [ '{', '[' ]
   Char '(': Push '(' -> Stack: [ '{', '[', '(' ]
   Char ')': Pop top ('(' matches ')') -> Stack: [ '{', '[' ]
   Char ']': Pop top ('[' matches ']') -> Stack: [ '{' ]
   Char '}': Pop top ('{' matches '}') -> Stack: [ ] (Empty -> VALID!)

2. Postfix RPN Evaluation ("3 4 + 2 *"):
   Token '3': Push 3      -> Stack: [ 3 ]
   Token '4': Push 4      -> Stack: [ 3, 4 ]
   Token '+': Pop b=4, a=3 -> Push (3 + 4 = 7) -> Stack: [ 7 ]
   Token '2': Push 2      -> Stack: [ 7, 2 ]
   Token '*': Pop b=2, a=7 -> Push (7 * 2 = 14) -> Stack: [ 14 ]
   Result = 14
```

#### 4. Detailed Method Specs & Logic
- `public static boolean isValidParentheses(String s)`:
  - Iterates characters. Pushes opening brackets `(`, `{`, `[`.
  - On closing bracket, returns false if stack empty or popped opening bracket doesn't match closing type.
  - Returns `stack.isEmpty()` at string end.
- `public static int evalRPN(String[] tokens)`:
  - Iterates string tokens. If integer operand, push to stack.
  - If operator `+`, `-`, `*`, `/`, pop `b` then `a`, apply `a op b`, push result.
  - Returns `stack.pop()`.
- `public static String infixToPostfix(String infix)`:
  - Implements basic Shunting-yard algorithm using operator precedence stack.

#### 5. Public Static Void Main Learning Output Demonstration
- Log header: `=== Step 03: Stack Applications (Matching & RPN Evaluation) ===`
- Test `isValidParentheses("{[()]}")` -> `true`.
- Test `isValidParentheses("([)]")` -> `false`.
- Test `evalRPN(["2", "1", "+", "3", "*"])` -> output `Calculated: 9`.
- Test `evalRPN(["4", "13", "5", "/", "+"])` -> output `Calculated: 6`.

---

### File 10: `Step04_MonotonicStackNextGreater.java`

#### 1. Target File Path & Package
- **Path**: `src/module04_stacks_and_queues/Step04_MonotonicStackNextGreater.java`
- **Package**: `package module04_stacks_and_queues;`

#### 2. Core Concepts Taught & Micro-Step Plan
- **Step 1: The Monotonic Property**: Understanding monotonic increasing vs decreasing stacks.
- **Step 2: Next Greater Element I**: Finding the first element to the right that is strictly greater than the current element in $O(N)$ time instead of $O(N^2)$.
- **Step 3: Daily Temperatures (LeetCode 739)**: Calculating wait days until warmer temperature using index-storing monotonic stack.
- **Step 4: Monotonic Stack Mechanics**: How popping smaller elements maintains invariant and achieves linear total time through amortized $O(1)$ pushes/pops.

#### 3. Required ASCII Memory State / Pointer Diagrams

```
1. Monotonic Stack Execution Trace for Next Greater Element:
   Input Array: [ 2, 1, 2, 4, 3 ]
   Goal: Find next greater element for each index.

   i=0 (val=2): Stack: [ 0(2) ]
   i=1 (val=1): 1 < 2 -> Push 1. Stack: [ 0(2), 1(1) ]
   i=2 (val=2): 2 > 1 -> Pop index 1! NGE[1] = 2.
                2 <= 2 -> Push index 2. Stack: [ 0(2), 2(2) ]
   i=3 (val=4): 4 > 2 -> Pop index 2! NGE[2] = 4.
                4 > 2 -> Pop index 0! NGE[0] = 4.
                Push index 3. Stack: [ 3(4) ]
   i=4 (val=3): 3 < 4 -> Push index 4. Stack: [ 3(4), 4(3) ]

   End of array: Remaining indices in stack get NGE = -1.
   Result NGE Array: [ 4, 2, 4, -1, -1 ]
```

#### 4. Detailed Method Specs & Logic
- `public static int[] nextGreaterElement(int[] nums)`:
  - Creates `int[] result = new int[nums.length]`, initializes with `-1`.
  - Stack stores array indices.
  - Loop `i` from `0` to `nums.length - 1`:
    - `while (!stack.isEmpty() && nums[i] > nums[stack.peek()])`: `int idx = stack.pop(); result[idx] = nums[i];`
    - `stack.push(i)`.
  - Returns `result`.
- `public static int[] dailyTemperatures(int[] temperatures)`:
  - Returns array of days to wait until warmer temperature `result[idx] = i - idx`.

#### 5. Public Static Void Main Learning Output Demonstration
- Log header: `=== Step 04: Monotonic Stack (Next Greater Element) ===`
- Test `nextGreaterElement([2, 1, 2, 4, 3])` -> outputs `[4, 2, 4, -1, -1]`.
- Test `dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])` -> outputs `[1, 1, 4, 2, 1, 1, 0, 0]`.
- Output step-by-step trace logging popping actions and wait-day math.

---

### File 11: `Step05_HistogramAndRainWater.java`

#### 1. Target File Path & Package
- **Path**: `src/module04_stacks_and_queues/Step05_HistogramAndRainWater.java`
- **Package**: `package module04_stacks_and_queues;`

#### 2. Core Concepts Taught & Micro-Step Plan
- **Step 1: Hard Monotonic Stack Applications**: Solving FAANG classic hard problems.
- **Step 2: Largest Rectangle in Histogram (LeetCode 84)**:
  - Using a monotonic increasing stack of bar indices.
  - When a shorter bar is encountered, pop the stack: the popped bar is the minimum height, and the width extends from current index `i` back to the new top of stack `i - stack.peek() - 1`.
- **Step 3: Trapping Rain Water (LeetCode 42)**:
  - Monotonic stack bounded-basin extraction approach ($O(N)$ space).
  - Optimal Two-Pointer approach ($O(N)$ time, $O(1)$ space) comparing `leftMax` and `rightMax`.

#### 4. Required ASCII Memory State / Pointer Diagrams

```
1. Histogram Largest Rectangle ASCII Diagram:
   Heights: [ 2, 1, 5, 6, 2, 3 ]

   Bar Heights Visual:
           #  
        #  #  
        #  #     #
        #  #  #  #
     #  #  #  #  #
     #  #  #  #  #
    ----------------
     2  1  5  6  2  3
           ^~~~~^ 
         Max Area = 5 * 2 = 10 (bars at index 2 and 3)

2. Trapping Rain Water Basin Concept:
   Heights: [ 0, 1, 0, 2, 1, 0, 1, 3 ]

         #              #
         #  ~~ ~~ #  ~~ #
     #   #  #  ~~ #  #  #
    ----------------------
     0   1  0  2  1  0  1  3
            ^  ^  ^~~~~^
           water trapped in basins
```

#### 4. Detailed Method Specs & Logic
- `public static int largestRectangleArea(int[] heights)`:
  - Stack stores indices of increasing heights.
  - Append virtual height 0 at loop end `i == heights.length`.
  - While `currHeight < heights[stack.peek()]`:
    - `int h = heights[stack.pop()];`
    - `int w = stack.isEmpty() ? i : i - stack.peek() - 1;`
    - `maxArea = Math.max(maxArea, h * w);`
  - Push `i`. Return `maxArea`.
- `public static int trapRainWater(int[] height)`:
  - Implement two-pointer technique (`left = 0`, `right = n - 1`, `leftMax`, `rightMax`).
  - Returns total trapped water units.

#### 5. Public Static Void Main Learning Output Demonstration
- Log header: `=== Step 05: Histogram & Trapping Rain Water (Hard Algorithms) ===`
- Test `largestRectangleArea([2, 1, 5, 6, 2, 3])` -> outputs `Largest Rectangle Area: 10`.
- Test `trapRainWater([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])` -> outputs `Trapped Rain Water: 6 units`.
- Print visual diagram and step calculation summary.

---

### File 12: `Step06_StackQueueBenchmarkSuite.java`

#### 1. Target File Path & Package
- **Path**: `src/module04_stacks_and_queues/Step06_StackQueueBenchmarkSuite.java`
- **Package**: `package module04_stacks_and_queues;`

#### 2. Core Concepts Taught & Micro-Step Plan
- **Step 1: Benchmarking Methodology**: Measuring throughput (ops/ms) and execution latency across collection implementations under high load (1,000,000 ops).
- **Step 2: Stack Comparisons**: Legacy `java.util.Stack` (synchronized / slow) vs `ArrayStack` (custom) vs `java.util.ArrayDeque` (modern standard).
- **Step 3: Queue Comparisons**: `CircularQueue` (custom ring buffer) vs `java.util.ArrayDeque` vs `java.util.LinkedList`.
- **Step 4: Garbage Collection & Overhead Analysis**: Object allocation overhead in Node-based structures (`LinkedList`) vs contiguous Array structures (`ArrayDeque`, `CircularQueue`).

#### 3. Required ASCII Memory State / Pointer Diagrams

```
1. Memory Footprint & Cache Locality Comparison:

   Array-backed (ArrayDeque / ArrayStack / CircularQueue):
   +-------------------------------------------------------+
   | [0] | [1] | [2] | [3] | [4] | [5] | [6] | [7] ...   |  <-- Contiguous Memory
   +-------------------------------------------------------+
   * High CPU Cache Line Hit Rate! Zero Node Object Overhead.

   Node-backed (LinkedList):
   +---------+      +---------+      +---------+
   | Node @A | ---> | Node @B | ---> | Node @C |  <-- Dispersed Heap Locations
   +---------+      +---------+      +---------+
   * Pointer Chasing, Frequent CPU Cache Misses, 24-byte Object Overhead per Node!
```

#### 4. Detailed Method Specs & Logic
- `public static void benchmarkStacks(int operations)`:
  - Measures time to push & pop `operations` elements for `java.util.Stack`, `ArrayStack`, `ArrayDeque`.
- `public static void benchmarkQueues(int operations)`:
  - Measures time to enqueue & dequeue `operations` elements for `CircularQueue`, `ArrayDeque`, `LinkedList`.
- `public static void main(String[] args)`:
  - Executes benchmarks with warmup runs and formats results in an ASCII comparative summary table.

#### 5. Public Static Void Main Learning Output Demonstration
- Log header: `=== Step 06: Stacks & Queues Performance Benchmark Suite ===`
- Output performance table:
```
========================================================================================
DATA STRUCTURE PERFORMANCE BENCHMARK (1,000,000 Operations)
========================================================================================
Implementation              Type        Time Elapsed (ms)    Ops/Sec        Relative
----------------------------------------------------------------------------------------
ArrayDeque (as Stack)       Array       ~12 ms               83.3 M/s       1.0x (Fastest)
Custom ArrayStack           Array       ~15 ms               66.6 M/s       1.25x
Legacy java.util.Stack      Array (Sync)~45 ms               22.2 M/s       3.75x (Slow)

ArrayDeque (as Queue)       Array       ~14 ms               71.4 M/s       1.0x (Fastest)
Custom CircularQueue        Array       ~18 ms               55.5 M/s       1.28x
java.util.LinkedList        Node        ~68 ms               14.7 M/s       4.85x (Slow)
========================================================================================
```

---

## Verification Plan & Self-Verification Checklist

### Standalone Compilation & Execution Verification
Every file specified above must be independently compilable and executable using standard JDK tools without any third-party dependencies:
```bash
# Compilation check
find src/module03_linked_lists src/module04_stacks_and_queues -name "*.java" | xargs javac

# Execution verification examples
java -cp src module03_linked_lists.Step01_SinglyLinkedListBasics
java -cp src module03_linked_lists.Step05_AdvancedLRUCache
java -cp src module04_stacks_and_queues.Step02_CircularQueueImplementation
java -cp src module04_stacks_and_queues.Step05_HistogramAndRainWater
```

### Edge Case Analysis Checklist
1. **Module 03 (Linked Lists)**:
   - Null head handling across all traversal and CRUD operations.
   - Deleting the first element (head), last element (tail), or non-existent value.
   - Reversing single-node and 2-node lists.
   - Fast & slow pointer middle detection on odd vs. even size lists.
   - LRU Cache capacity 1 and eviction order under repeated updates.
2. **Module 04 (Stacks & Queues)**:
   - Pop/peek on empty stack throwing standard/descriptive exceptions.
   - Dequeue/peek on empty circular queue.
   - Circular queue wrap-around when indices exceed `capacity - 1`.
   - Monotonic stack handling duplicate values and strictly decreasing/increasing inputs.
   - Rain water trapping on flat or strictly increasing elevation maps.

---
*Specification completed by Explorer 2 for Orchestrator handoff.*

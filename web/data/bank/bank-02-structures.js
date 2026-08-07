/**
 * bank-02-structures.js — curated data-structure problems (linked lists, stacks,
 * trees, tries, heaps and graphs).
 *
 * Shape mirrors ./bank-00-reference.js. Verify any change with:
 *   node web/tools/verify-bank.js --file bank-02-structures.js
 */

// Helper node types are re-declared verbatim inside every starterCode /
// solutionCode string, exactly as LeetCode presents them.
const LIST_NODE = `class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}`;

const TREE_NODE = `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }
}`;

const LIST_HELPERS = `    private static ListNode buildList(int... vals) {
        ListNode dummy = new ListNode(0);
        ListNode cur = dummy;
        for (int v : vals) {
            cur.next = new ListNode(v);
            cur = cur.next;
        }
        return dummy.next;
    }

    private static String listToString(ListNode head) {
        StringBuilder sb = new StringBuilder("[");
        while (head != null) {
            sb.append(head.val);
            if (head.next != null) sb.append(", ");
            head = head.next;
        }
        return sb.append("]").toString();
    }`;

const TREE_HELPERS = `    private static TreeNode buildTree(Integer... vals) {
        if (vals.length == 0 || vals[0] == null) return null;
        TreeNode root = new TreeNode(vals[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        int i = 1;
        while (!queue.isEmpty() && i < vals.length) {
            TreeNode node = queue.poll();
            if (i < vals.length) {
                Integer v = vals[i++];
                if (v != null) { node.left = new TreeNode(v); queue.add(node.left); }
            }
            if (i < vals.length) {
                Integer v = vals[i++];
                if (v != null) { node.right = new TreeNode(v); queue.add(node.right); }
            }
        }
        return root;
    }

    private static String treeToLevelOrderString(TreeNode root) {
        List<String> out = new ArrayList<>();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            if (node == null) { out.add("null"); continue; }
            out.add(String.valueOf(node.val));
            queue.add(node.left);
            queue.add(node.right);
        }
        while (!out.isEmpty() && out.get(out.size() - 1).equals("null")) out.remove(out.size() - 1);
        return "[" + String.join(", ", out) + "]";
    }

    private static TreeNode findNode(TreeNode root, int val) {
        if (root == null) return null;
        if (root.val == val) return root;
        TreeNode left = findNode(root.left, val);
        return left != null ? left : findNode(root.right, val);
    }`;

// Serialises a list of lists (level-order output, grouped words, …) as
// `[[1, 2], [3]]` so a test can compare it against a plain string.
const NESTED_HELPERS = `    private static String nestedToString(List<List<Integer>> lists) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < lists.size(); i++) {
            if (i > 0) sb.append(", ");
            sb.append(lists.get(i).toString());
        }
        return sb.append("]").toString();
    }`;

module.exports = [
  {
    id: 206,
    slug: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    topics: ['linked-list'],
    companies: ['amazon', 'microsoft', 'apple', 'google', 'adobe'],
    statement: `You are given the \`head\` of a singly linked list. Flip the direction of every link so the list runs backwards, then return the head of the rewired list.

Nothing may be copied into an array and rebuilt — the intent of the exercise is to move the existing nodes' \`next\` pointers.`,
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]',
        explanation: 'Every arrow now points at the previous node, so the old tail 5 becomes the new head.'
      },
      {
        input: 'head = [1,2]',
        output: '[2,1]',
        explanation: 'The two nodes simply swap roles: 2 becomes the head and 1 the tail.'
      },
      {
        input: 'head = []',
        output: '[]',
        explanation: 'An empty list has nothing to reverse, so the answer is the same empty list.'
      }
    ],
    constraints: [
      'The number of nodes is in the range [0, 5000]',
      '-5000 <= Node.val <= 5000'
    ],
    hints: [
      'While walking the list you need three things at any moment: the node behind you, the node you are on, and the node ahead of you.',
      'Save the next pointer *before* you overwrite it, otherwise the rest of the list becomes unreachable.',
      'When the current pointer falls off the end, the "node behind you" is exactly the new head.'
    ],
    approach: `**Iterative pointer rewiring.** Keep \`prev\` (initially \`null\`) and \`curr\` (initially \`head\`). At each step stash \`curr.next\`, point \`curr.next\` back at \`prev\`, then slide both pointers forward. The loop ends when \`curr\` becomes \`null\`, at which point \`prev\` holds the reversed list — one pass, no extra storage.`,
    complexity: { time: 'O(n)', space: 'O(1)' },
    testHelpers: LIST_HELPERS,
    starterCode: `class Solution {
    public ListNode reverseList(ListNode head) {
        // Write your solution here
        return head;
    }
}

${LIST_NODE}`,
    solutionCode: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
}

${LIST_NODE}`,
    tests: [
      {
        name: 'Example 1',
        input: 'head = [1,2,3,4,5]',
        expr: 'listToString(sol.reverseList(buildList(1,2,3,4,5)))',
        expected: '[5, 4, 3, 2, 1]'
      },
      {
        name: 'Example 2',
        input: 'head = [1,2]',
        expr: 'listToString(sol.reverseList(buildList(1,2)))',
        expected: '[2, 1]'
      },
      {
        name: 'Empty list',
        input: 'head = []',
        expr: 'listToString(sol.reverseList(buildList()))',
        expected: '[]'
      },
      {
        name: 'Single node',
        input: 'head = [7]',
        expr: 'listToString(sol.reverseList(buildList(7)))',
        expected: '[7]'
      },
      {
        name: 'Negative values',
        input: 'head = [-1,-2,-3]',
        expr: 'listToString(sol.reverseList(buildList(-1,-2,-3)))',
        expected: '[-3, -2, -1]'
      }
    ]
  },

  {
    id: 21,
    slug: 'merge-two-sorted-lists',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    topics: ['linked-list', 'two-pointers'],
    companies: ['amazon', 'microsoft', 'apple', 'meta', 'adobe'],
    statement: `Two singly linked lists, \`list1\` and \`list2\`, are each already sorted in non-decreasing order. Splice their nodes together into one sorted list and return its head.

Reuse the existing nodes rather than allocating new ones.`,
    examples: [
      {
        input: 'list1 = [1,2,4], list2 = [1,3,4]',
        output: '[1,1,2,3,4,4]',
        explanation: 'Repeatedly take the smaller of the two front nodes.'
      },
      {
        input: 'list1 = [], list2 = []',
        output: '[]',
        explanation: 'Merging two empty lists yields an empty list.'
      },
      {
        input: 'list1 = [], list2 = [0]',
        output: '[0]',
        explanation: 'When one list is empty the answer is simply the other list.'
      }
    ],
    constraints: [
      'The number of nodes in each list is in the range [0, 50]',
      '-100 <= Node.val <= 100',
      'Both list1 and list2 are sorted in non-decreasing order'
    ],
    hints: [
      'Because both inputs are sorted, the next node of the answer is always one of the two current front nodes.',
      'A dummy (sentinel) head removes the awkward special case of choosing the very first node.',
      'When one list runs out, the remaining suffix of the other is already sorted — attach it in one move instead of looping.'
    ],
    approach: `**Two pointers with a sentinel node.** Walk both lists at once, always appending the smaller front node to a tail pointer that starts at a dummy node. Once either list is exhausted the other one is a sorted suffix, so link it wholesale. Returning \`dummy.next\` gives the merged head after a single linear pass with constant extra space.`,
    complexity: { time: 'O(n + m)', space: 'O(1)' },
    testHelpers: LIST_HELPERS,
    starterCode: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Write your solution here
        return null;
    }
}

${LIST_NODE}`,
    solutionCode: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                tail.next = list1;
                list1 = list1.next;
            } else {
                tail.next = list2;
                list2 = list2.next;
            }
            tail = tail.next;
        }
        tail.next = (list1 != null) ? list1 : list2;
        return dummy.next;
    }
}

${LIST_NODE}`,
    tests: [
      {
        name: 'Example 1',
        input: 'list1 = [1,2,4], list2 = [1,3,4]',
        expr: 'listToString(sol.mergeTwoLists(buildList(1,2,4), buildList(1,3,4)))',
        expected: '[1, 1, 2, 3, 4, 4]'
      },
      {
        name: 'Both empty',
        input: 'list1 = [], list2 = []',
        expr: 'listToString(sol.mergeTwoLists(buildList(), buildList()))',
        expected: '[]'
      },
      {
        name: 'One empty',
        input: 'list1 = [], list2 = [0]',
        expr: 'listToString(sol.mergeTwoLists(buildList(), buildList(0)))',
        expected: '[0]'
      },
      {
        name: 'Disjoint ranges',
        input: 'list1 = [1,2,3], list2 = [10,11]',
        expr: 'listToString(sol.mergeTwoLists(buildList(1,2,3), buildList(10,11)))',
        expected: '[1, 2, 3, 10, 11]'
      },
      {
        name: 'Negatives and duplicates',
        input: 'list1 = [-5,-1,0], list2 = [-5,2]',
        expr: 'listToString(sol.mergeTwoLists(buildList(-5,-1,0), buildList(-5,2)))',
        expected: '[-5, -5, -1, 0, 2]'
      }
    ]
  },

  {
    id: 141,
    slug: 'linked-list-cycle',
    title: 'Linked List Cycle',
    difficulty: 'Easy',
    topics: ['linked-list', 'two-pointers', 'hash-table'],
    companies: ['amazon', 'microsoft', 'bloomberg', 'meta'],
    statement: `Given the \`head\` of a linked list, decide whether following \`next\` pointers ever revisits a node. Return \`true\` if such a loop exists and \`false\` otherwise.

A cycle exists when some node's \`next\` points back to a node that was already visited.`,
    examples: [
      {
        input: 'head = [3,2,0,-4], tail connects to index 1',
        output: 'true',
        explanation: 'The last node links back to the node holding 2, so traversal never terminates.'
      },
      {
        input: 'head = [1,2], tail connects to index 0',
        output: 'true',
        explanation: 'The second node points back to the first.'
      },
      {
        input: 'head = [1], no cycle',
        output: 'false',
        explanation: 'A single node whose next is null ends normally.'
      }
    ],
    constraints: [
      'The number of nodes is in the range [0, 10^4]',
      '-10^5 <= Node.val <= 10^5',
      'The position the tail connects to is either -1 (no cycle) or a valid index'
    ],
    hints: [
      'One option is remembering every node you have visited — but can you do it without extra memory?',
      'Imagine two runners on a circular track moving at different speeds: the faster one eventually laps the slower one.',
      'Advance one pointer by one node and another by two. If they ever hold the same node there is a cycle; if the fast one reaches null there is not.'
    ],
    approach: `**Floyd's tortoise and hare.** Move a slow pointer one step and a fast pointer two steps per iteration. If the list ends, \`fast\` (or \`fast.next\`) hits \`null\` and the answer is \`false\`; inside a loop the gap between the two shrinks by one each round, so they must eventually coincide. This detects the cycle in linear time using only two pointers.`,
    complexity: { time: 'O(n)', space: 'O(1)' },
    testHelpers: `${LIST_HELPERS}

    private static ListNode buildCycleList(int[] vals, int pos) {
        ListNode dummy = new ListNode(0);
        ListNode cur = dummy;
        ListNode entry = null;
        for (int i = 0; i < vals.length; i++) {
            cur.next = new ListNode(vals[i]);
            cur = cur.next;
            if (i == pos) entry = cur;
        }
        if (entry != null) cur.next = entry;
        return dummy.next;
    }`,
    starterCode: `class Solution {
    public boolean hasCycle(ListNode head) {
        // Write your solution here
        return false;
    }
}

${LIST_NODE}`,
    solutionCode: `class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}

${LIST_NODE}`,
    tests: [
      {
        name: 'Cycle in the middle',
        input: 'head = [3,2,0,-4], pos = 1',
        expr: 'sol.hasCycle(buildCycleList(new int[]{3,2,0,-4}, 1))',
        expected: 'true'
      },
      {
        name: 'Two node cycle',
        input: 'head = [1,2], pos = 0',
        expr: 'sol.hasCycle(buildCycleList(new int[]{1,2}, 0))',
        expected: 'true'
      },
      {
        name: 'Single node, no cycle',
        input: 'head = [1], pos = -1',
        expr: 'sol.hasCycle(buildCycleList(new int[]{1}, -1))',
        expected: 'false'
      },
      {
        name: 'Self loop',
        input: 'head = [1], pos = 0',
        expr: 'sol.hasCycle(buildCycleList(new int[]{1}, 0))',
        expected: 'true'
      },
      {
        name: 'Empty list',
        input: 'head = []',
        expr: 'sol.hasCycle(buildList())',
        expected: 'false'
      }
    ]
  },

  {
    id: 19,
    slug: 'remove-nth-node-from-end-of-list',
    title: 'Remove Nth Node From End of List',
    difficulty: 'Medium',
    topics: ['linked-list', 'two-pointers'],
    companies: ['amazon', 'microsoft', 'meta', 'google'],
    statement: `Given the \`head\` of a linked list and an integer \`n\`, delete the node that sits \`n\` positions from the end of the list and return the head of the resulting list.

Aim for a solution that touches the list only once.`,
    examples: [
      {
        input: 'head = [1,2,3,4,5], n = 2',
        output: '[1,2,3,5]',
        explanation: 'The second node from the end holds 4, so it is unlinked.'
      },
      {
        input: 'head = [1], n = 1',
        output: '[]',
        explanation: 'Removing the only node leaves an empty list.'
      },
      {
        input: 'head = [1,2], n = 1',
        output: '[1]',
        explanation: 'The last node is dropped.'
      }
    ],
    constraints: [
      'The number of nodes is sz',
      '1 <= sz <= 30',
      '0 <= Node.val <= 100',
      '1 <= n <= sz'
    ],
    hints: [
      'You cannot walk backwards, but you can keep two pointers a fixed distance apart.',
      'Give one pointer a head start of exactly n nodes, then move both together until the leader falls off the end.',
      'Deleting the head is the tricky case — a dummy node in front of the list makes it behave like any other node.'
    ],
    approach: `**Two pointers with a fixed gap.** Put a sentinel before the head and advance a \`fast\` pointer \`n\` nodes ahead of \`slow\`. Move both in lockstep until \`fast\` reaches the last node; \`slow\` then sits just before the target, so \`slow.next = slow.next.next\` removes it. One pass, constant space, and the sentinel handles removal of the original head.`,
    complexity: { time: 'O(n)', space: 'O(1)' },
    testHelpers: LIST_HELPERS,
    starterCode: `class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        // Write your solution here
        return head;
    }
}

${LIST_NODE}`,
    solutionCode: `class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head);
        ListNode fast = dummy;
        ListNode slow = dummy;
        for (int i = 0; i < n; i++) {
            fast = fast.next;
        }
        while (fast.next != null) {
            fast = fast.next;
            slow = slow.next;
        }
        slow.next = slow.next.next;
        return dummy.next;
    }
}

${LIST_NODE}`,
    tests: [
      {
        name: 'Example 1',
        input: 'head = [1,2,3,4,5], n = 2',
        expr: 'listToString(sol.removeNthFromEnd(buildList(1,2,3,4,5), 2))',
        expected: '[1, 2, 3, 5]'
      },
      {
        name: 'Only node',
        input: 'head = [1], n = 1',
        expr: 'listToString(sol.removeNthFromEnd(buildList(1), 1))',
        expected: '[]'
      },
      {
        name: 'Remove tail',
        input: 'head = [1,2], n = 1',
        expr: 'listToString(sol.removeNthFromEnd(buildList(1,2), 1))',
        expected: '[1]'
      },
      {
        name: 'Remove head',
        input: 'head = [1,2,3], n = 3',
        expr: 'listToString(sol.removeNthFromEnd(buildList(1,2,3), 3))',
        expected: '[2, 3]'
      },
      {
        name: 'Remove middle of longer list',
        input: 'head = [10,20,30,40], n = 3',
        expr: 'listToString(sol.removeNthFromEnd(buildList(10,20,30,40), 3))',
        expected: '[10, 30, 40]'
      }
    ]
  },

  {
    id: 104,
    slug: 'maximum-depth-of-binary-tree',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    topics: ['tree', 'dfs', 'bfs'],
    companies: ['amazon', 'google', 'linkedin'],
    statement: `Given the \`root\` of a binary tree, return its maximum depth — the number of nodes along the longest path from the root down to a leaf.`,
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '3', explanation: 'The longest path is 3 → 20 → 15 (or 3 → 20 → 7).' },
      { input: 'root = [1,null,2]', output: '2', explanation: 'Only one branch exists.' }
    ],
    constraints: ['0 <= number of nodes <= 10^4', '-100 <= Node.val <= 100'],
    hints: [
      'Ask the classic tree question: what do I need from my children to answer for myself?',
      'The depth at a node is 1 + the deeper of its two subtrees.',
      'An empty subtree has depth 0 — that is your base case.'
    ],
    approach: '**Recursive post-order.** `depth(node) = 1 + max(depth(left), depth(right))`, with `depth(null) = 0`. A BFS that counts levels gives the same answer iteratively.',
    complexity: { time: 'O(n)', space: 'O(h) recursion' },
    testHelpers: TREE_HELPERS,
    starterCode: `${TREE_NODE}

class Solution {
    public int maxDepth(TreeNode root) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `${TREE_NODE}

class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}`,
    tests: [
      { name: 'Example 1', input: 'root = [3,9,20,null,null,15,7]', expr: 'sol.maxDepth(buildTree(3,9,20,null,null,15,7))', expected: '3' },
      { name: 'Right-leaning', input: 'root = [1,null,2]', expr: 'sol.maxDepth(buildTree(1,null,2))', expected: '2' },
      { name: 'Empty tree', input: 'root = []', expr: 'sol.maxDepth(buildTree())', expected: '0' },
      { name: 'Single node', input: 'root = [7]', expr: 'sol.maxDepth(buildTree(7))', expected: '1' }
    ]
  },

  {
    id: 226,
    slug: 'invert-binary-tree',
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    topics: ['tree', 'dfs', 'bfs'],
    companies: ['google', 'amazon', 'meta'],
    statement: `Given the \`root\` of a binary tree, mirror it: every node's left and right children swap places, all the way down. Return the root of the inverted tree.`,
    examples: [
      { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]', explanation: 'Each level is reversed.' },
      { input: 'root = [2,1,3]', output: '[2,3,1]', explanation: 'The two children swap.' }
    ],
    constraints: ['0 <= number of nodes <= 100', '-100 <= Node.val <= 100'],
    hints: [
      'Inverting a tree means inverting both subtrees and then swapping them.',
      'The base case is an empty node — return it unchanged.',
      'You can also do it iteratively: push nodes onto a stack or queue and swap children as you pop.'
    ],
    approach: '**Recursive swap.** Invert the left subtree, invert the right subtree, then exchange the two references. Every node is touched exactly once.',
    complexity: { time: 'O(n)', space: 'O(h) recursion' },
    testHelpers: TREE_HELPERS,
    starterCode: `${TREE_NODE}

class Solution {
    public TreeNode invertTree(TreeNode root) {
        // Write your solution here
        return root;
    }
}`,
    solutionCode: `${TREE_NODE}

class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode left = invertTree(root.left);
        TreeNode right = invertTree(root.right);
        root.left = right;
        root.right = left;
        return root;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'root = [4,2,7,1,3,6,9]', expr: 'treeToLevelOrderString(sol.invertTree(buildTree(4,2,7,1,3,6,9)))', expected: '[4, 7, 2, 9, 6, 3, 1]' },
      { name: 'Three nodes', input: 'root = [2,1,3]', expr: 'treeToLevelOrderString(sol.invertTree(buildTree(2,1,3)))', expected: '[2, 3, 1]' },
      { name: 'Empty tree', input: 'root = []', expr: 'treeToLevelOrderString(sol.invertTree(buildTree()))', expected: '[]' },
      { name: 'Left-only branch', input: 'root = [1,2]', expr: 'treeToLevelOrderString(sol.invertTree(buildTree(1,2)))', expected: '[1, null, 2]' }
    ]
  },

  {
    id: 102,
    slug: 'binary-tree-level-order-traversal',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    topics: ['tree', 'bfs', 'queue'],
    companies: ['amazon', 'microsoft', 'meta', 'bloomberg'],
    statement: `Given the \`root\` of a binary tree, return its node values grouped level by level, from the root downwards and left to right within each level.`,
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]', explanation: 'Three levels, read top to bottom.' },
      { input: 'root = [1]', output: '[[1]]', explanation: 'A single level.' }
    ],
    constraints: ['0 <= number of nodes <= 2000', '-1000 <= Node.val <= 1000'],
    hints: [
      'Depth-first traversal visits branches, not levels — you need breadth-first.',
      'Use a queue, and before draining it record how many nodes are currently in it.',
      'Those `size` nodes are exactly one level, so pop that many and collect them into one list.'
    ],
    approach: '**BFS with a level-sized batch.** Push the root, then repeatedly snapshot the queue size, pop exactly that many nodes into a list (enqueueing their children), and emit the list as one level.',
    complexity: { time: 'O(n)', space: 'O(n)' },
    testHelpers: `${TREE_HELPERS}

${NESTED_HELPERS}`,
    starterCode: `${TREE_NODE}

class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        // Write your solution here
        return new ArrayList<>();
    }
}`,
    solutionCode: `${TREE_NODE}

class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> levels = new ArrayList<>();
        if (root == null) return levels;

        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            int size = queue.size();                 // exactly one level
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);
                if (node.left != null) queue.add(node.left);
                if (node.right != null) queue.add(node.right);
            }
            levels.add(level);
        }
        return levels;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'root = [3,9,20,null,null,15,7]', expr: 'nestedToString(sol.levelOrder(buildTree(3,9,20,null,null,15,7)))', expected: '[[3], [9, 20], [15, 7]]' },
      { name: 'Single node', input: 'root = [1]', expr: 'nestedToString(sol.levelOrder(buildTree(1)))', expected: '[[1]]' },
      { name: 'Empty tree', input: 'root = []', expr: 'nestedToString(sol.levelOrder(buildTree()))', expected: '[]' },
      { name: 'Skewed tree', input: 'root = [1,2,null,3]', expr: 'nestedToString(sol.levelOrder(buildTree(1,2,null,3)))', expected: '[[1], [2], [3]]' }
    ]
  },

  {
    id: 98,
    slug: 'validate-binary-search-tree',
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    topics: ['tree', 'bst', 'dfs'],
    companies: ['amazon', 'meta', 'microsoft', 'bloomberg'],
    statement: `Given the \`root\` of a binary tree, decide whether it is a valid binary search tree.

Valid means: every value in a node's left subtree is strictly smaller than the node, every value in its right subtree is strictly larger, and both subtrees are themselves valid BSTs.`,
    examples: [
      { input: 'root = [2,1,3]', output: 'true', explanation: '1 < 2 < 3.' },
      { input: 'root = [5,1,4,null,null,3,6]', output: 'false', explanation: '3 sits in the right subtree of 5 but is smaller than 5.' }
    ],
    constraints: ['1 <= number of nodes <= 10^4', '-2^31 <= Node.val <= 2^31 - 1'],
    hints: [
      'Comparing a node only against its two children is not enough — the counter-example above passes that check.',
      'Every node is constrained by an entire range inherited from its ancestors.',
      'Pass (low, high) bounds down the recursion, or do an in-order traversal and verify it is strictly increasing.'
    ],
    approach: '**Bounded recursion.** Each node must lie strictly inside an inherited `(low, high)` interval; going left tightens the upper bound, going right tightens the lower one. Use `Long` bounds (or the in-order variant) so `Integer.MIN_VALUE`/`MAX_VALUE` nodes do not break it.',
    complexity: { time: 'O(n)', space: 'O(h) recursion' },
    testHelpers: TREE_HELPERS,
    starterCode: `${TREE_NODE}

class Solution {
    public boolean isValidBST(TreeNode root) {
        // Write your solution here
        return false;
    }
}`,
    solutionCode: `${TREE_NODE}

class Solution {
    public boolean isValidBST(TreeNode root) {
        return validate(root, null, null);
    }

    private boolean validate(TreeNode node, Integer low, Integer high) {
        if (node == null) return true;
        if (low != null && node.val <= low) return false;
        if (high != null && node.val >= high) return false;
        return validate(node.left, low, node.val) && validate(node.right, node.val, high);
    }
}`,
    tests: [
      { name: 'Valid BST', input: 'root = [2,1,3]', expr: 'sol.isValidBST(buildTree(2,1,3))', expected: 'true' },
      { name: 'Violates an ancestor bound', input: 'root = [5,1,4,null,null,3,6]', expr: 'sol.isValidBST(buildTree(5,1,4,null,null,3,6))', expected: 'false' },
      { name: 'Single node', input: 'root = [1]', expr: 'sol.isValidBST(buildTree(1))', expected: 'true' },
      { name: 'Equal values are not allowed', input: 'root = [2,2,2]', expr: 'sol.isValidBST(buildTree(2,2,2))', expected: 'false' },
      { name: 'Extreme values', input: 'root = [2147483647]', expr: 'sol.isValidBST(buildTree(2147483647))', expected: 'true' }
    ]
  },

  {
    id: 739,
    slug: 'daily-temperatures',
    title: 'Daily Temperatures',
    difficulty: 'Medium',
    topics: ['stack', 'array'],
    companies: ['amazon', 'google', 'bloomberg'],
    statement: `Given an array \`temperatures\`, return an array \`answer\` where \`answer[i]\` is how many days you have to wait after day \`i\` for a warmer temperature. If no warmer day ever comes, put \`0\`.`,
    examples: [
      { input: 'temperatures = [73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]', explanation: 'Day 0 warms up the next day; day 2 waits four days for 76.' },
      { input: 'temperatures = [30,40,50,60]', output: '[1,1,1,0]', explanation: 'Every day is warmer than the one before.' }
    ],
    constraints: ['1 <= temperatures.length <= 10^5', '30 <= temperatures[i] <= 100'],
    hints: [
      'The brute force scans forward from every day — O(n²). What information does that rescan repeat?',
      'This is a "next greater element" problem: keep the indices still waiting for a warmer day.',
      'A stack of indices with decreasing temperatures does it: when today is warmer, pop and resolve those days.'
    ],
    approach: '**Monotonic decreasing stack.** Push indices whose answer is still unknown; when the current temperature exceeds the top of the stack, pop and record the index distance. Each index is pushed and popped once, so it is O(n).',
    complexity: { time: 'O(n)', space: 'O(n)' },
    starterCode: `class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        // Write your solution here
        return new int[temperatures.length];
    }
}`,
    solutionCode: `class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int[] answer = new int[temperatures.length];
        Deque<Integer> waiting = new ArrayDeque<>();     // indices, temperatures decreasing

        for (int day = 0; day < temperatures.length; day++) {
            while (!waiting.isEmpty() && temperatures[day] > temperatures[waiting.peek()]) {
                int earlier = waiting.pop();
                answer[earlier] = day - earlier;
            }
            waiting.push(day);
        }
        return answer;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'temperatures = [73,74,75,71,69,72,76,73]', expr: 'Arrays.toString(sol.dailyTemperatures(new int[]{73,74,75,71,69,72,76,73}))', expected: '[1, 1, 4, 2, 1, 1, 0, 0]' },
      { name: 'Always warmer', input: 'temperatures = [30,40,50,60]', expr: 'Arrays.toString(sol.dailyTemperatures(new int[]{30,40,50,60}))', expected: '[1, 1, 1, 0]' },
      { name: 'Never warmer', input: 'temperatures = [60,50,40]', expr: 'Arrays.toString(sol.dailyTemperatures(new int[]{60,50,40}))', expected: '[0, 0, 0]' },
      { name: 'Single day', input: 'temperatures = [50]', expr: 'Arrays.toString(sol.dailyTemperatures(new int[]{50}))', expected: '[0]' },
      { name: 'Plateau then rise', input: 'temperatures = [40,40,41]', expr: 'Arrays.toString(sol.dailyTemperatures(new int[]{40,40,41}))', expected: '[2, 1, 0]' }
    ]
  },

  {
    id: 215,
    slug: 'kth-largest-element-in-an-array',
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    topics: ['heap', 'sorting', 'array'],
    companies: ['meta', 'amazon', 'linkedin', 'apple'],
    statement: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\`-th largest element.

This is the k-th largest by **position in sorted order**, not the k-th distinct value.`,
    examples: [
      { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5', explanation: 'Sorted descending: 6, 5, … so the 2nd largest is 5.' },
      { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4', explanation: 'Duplicates still occupy positions.' }
    ],
    constraints: ['1 <= k <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    hints: [
      'Sorting is O(n log n) and answers instantly — but you only need k of the values.',
      'Keep a min-heap of size k: its smallest element is the k-th largest seen so far.',
      'Push every value, and pop whenever the heap grows past k. The root is the answer.'
    ],
    approach: '**Bounded min-heap.** Maintain a min-heap holding the k largest values seen; each new value costs O(log k) and the root ends up being the k-th largest. Quickselect gives O(n) on average if you want to go further.',
    complexity: { time: 'O(n log k)', space: 'O(k)' },
    starterCode: `class Solution {
    public int findKthLargest(int[] nums, int k) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> smallestOfTheBest = new PriorityQueue<>();   // min-heap
        for (int num : nums) {
            smallestOfTheBest.offer(num);
            if (smallestOfTheBest.size() > k) smallestOfTheBest.poll();
        }
        return smallestOfTheBest.peek();
    }
}`,
    tests: [
      { name: 'Example 1', input: 'nums = [3,2,1,5,6,4], k = 2', expr: 'sol.findKthLargest(new int[]{3,2,1,5,6,4}, 2)', expected: '5' },
      { name: 'With duplicates', input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', expr: 'sol.findKthLargest(new int[]{3,2,3,1,2,4,5,5,6}, 4)', expected: '4' },
      { name: 'k = 1 (maximum)', input: 'nums = [7,1,9], k = 1', expr: 'sol.findKthLargest(new int[]{7,1,9}, 1)', expected: '9' },
      { name: 'k = n (minimum)', input: 'nums = [7,1,9], k = 3', expr: 'sol.findKthLargest(new int[]{7,1,9}, 3)', expected: '1' }
    ]
  },

  {
    id: 200,
    slug: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'Medium',
    topics: ['graph', 'dfs', 'bfs', 'matrix'],
    companies: ['amazon', 'meta', 'google', 'microsoft', 'bloomberg'],
    statement: `You are given an \`m x n\` grid of \`'1'\` (land) and \`'0'\` (water) characters. An island is a group of land cells connected horizontally or vertically, surrounded by water or the grid edge.

Return how many islands the grid contains.`,
    examples: [
      {
        input: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]',
        output: '2',
        explanation: 'The connected land in the top-left is one island; the single cell in the bottom-right is another.'
      },
      {
        input: 'grid = [["1","1"],["1","1"]]',
        output: '1',
        explanation: 'All four cells are connected.'
      }
    ],
    constraints: ['1 <= m, n <= 300', "grid[i][j] is '0' or '1'"],
    hints: [
      'The grid is a graph in disguise: each land cell is a vertex, adjacency is up/down/left/right.',
      'Scan every cell; when you meet unvisited land, you have found a new island — then flood it.',
      'Flood-fill with DFS or BFS and mark visited cells (overwriting them with `0` is the cheapest way).'
    ],
    approach: '**Flood fill over an implicit graph.** Sweep the grid; each unvisited land cell starts a new island, and a DFS/BFS sinks the whole connected component so it is never counted again. Each cell is visited once.',
    complexity: { time: 'O(m · n)', space: 'O(m · n) worst-case recursion' },
    starterCode: `class Solution {
    public int numIslands(char[][] grid) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int numIslands(char[][] grid) {
        int islands = 0;
        for (int row = 0; row < grid.length; row++) {
            for (int col = 0; col < grid[0].length; col++) {
                if (grid[row][col] == '1') {
                    islands++;
                    sink(grid, row, col);
                }
            }
        }
        return islands;
    }

    private void sink(char[][] grid, int row, int col) {
        if (row < 0 || col < 0 || row >= grid.length || col >= grid[0].length || grid[row][col] != '1') return;
        grid[row][col] = '0';                 // mark as visited
        sink(grid, row + 1, col);
        sink(grid, row - 1, col);
        sink(grid, row, col + 1);
        sink(grid, row, col - 1);
    }
}`,
    tests: [
      {
        name: 'Two islands',
        input: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]',
        expr: "sol.numIslands(new char[][]{{'1','1','0'},{'1','0','0'},{'0','0','1'}})",
        expected: '2'
      },
      {
        name: 'One solid island',
        input: 'grid = [["1","1"],["1","1"]]',
        expr: "sol.numIslands(new char[][]{{'1','1'},{'1','1'}})",
        expected: '1'
      },
      {
        name: 'All water',
        input: 'grid = [["0","0"],["0","0"]]',
        expr: "sol.numIslands(new char[][]{{'0','0'},{'0','0'}})",
        expected: '0'
      },
      {
        name: 'Diagonals are not connected',
        input: 'grid = [["1","0"],["0","1"]]',
        expr: "sol.numIslands(new char[][]{{'1','0'},{'0','1'}})",
        expected: '2'
      }
    ]
  },

  {
    id: 2,
    slug: 'add-two-numbers',
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    topics: ['linked-list', 'math', 'two-pointers'],
    companies: ['amazon', 'microsoft', 'bloomberg', 'adobe', 'apple'],
    statement: `You are given two non-empty linked lists \`l1\` and \`l2\` representing two non-negative integers. Digits are stored in **reverse** order, and each node holds a single digit.

Add the two numbers and return the sum as a linked list, also in reverse order. The inputs do not contain leading zeros except the number 0 itself.`,
    examples: [
      {
        input: 'l1 = [2,4,3], l2 = [5,6,4]',
        output: '[7,0,8]',
        explanation: '342 + 465 = 807.'
      },
      {
        input: 'l1 = [0], l2 = [0]',
        output: '[0]',
        explanation: 'Zero plus zero is zero.'
      },
      {
        input: 'l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]',
        output: '[8,9,9,9,0,0,0,1]',
        explanation: 'Carry propagates past the longer list and creates a new high digit.'
      }
    ],
    constraints: [
      'The number of nodes in each linked list is in the range [1, 100]',
      '0 <= Node.val <= 9',
      'It is guaranteed that the list represents a number that does not have leading zeros'
    ],
    hints: [
      'Walk both lists together the same way you add on paper — digit by digit from the least significant end.',
      'Keep a running carry (0 or 1). The digit written is (sum % 10) and the next carry is (sum / 10).',
      'Continue while either list still has nodes or a leftover carry remains.'
    ],
    approach: `**Simultaneous walk with carry.** Use a dummy head and a tail pointer. At each step sum the available digits plus carry, append \`sum % 10\`, and set carry to \`sum / 10\`. Advance whichever lists still have nodes. After both lists end, emit one more node if carry is still 1. Reuses no input nodes but only allocates the output, which is unavoidable.`,
    complexity: { time: 'O(max(m, n))', space: 'O(max(m, n)) for the result' },
    testHelpers: LIST_HELPERS,
    starterCode: `class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        // Write your solution here
        return null;
    }
}

${LIST_NODE}`,
    solutionCode: `class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        int carry = 0;
        while (l1 != null || l2 != null || carry != 0) {
            int sum = carry;
            if (l1 != null) { sum += l1.val; l1 = l1.next; }
            if (l2 != null) { sum += l2.val; l2 = l2.next; }
            tail.next = new ListNode(sum % 10);
            tail = tail.next;
            carry = sum / 10;
        }
        return dummy.next;
    }
}

${LIST_NODE}`,
    tests: [
      {
        name: 'Example 1',
        input: 'l1 = [2,4,3], l2 = [5,6,4]',
        expr: 'listToString(sol.addTwoNumbers(buildList(2,4,3), buildList(5,6,4)))',
        expected: '[7, 0, 8]'
      },
      {
        name: 'Zeros',
        input: 'l1 = [0], l2 = [0]',
        expr: 'listToString(sol.addTwoNumbers(buildList(0), buildList(0)))',
        expected: '[0]'
      },
      {
        name: 'Carry creates extra digit',
        input: 'l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]',
        expr: 'listToString(sol.addTwoNumbers(buildList(9,9,9,9,9,9,9), buildList(9,9,9,9)))',
        expected: '[8, 9, 9, 9, 0, 0, 0, 1]'
      },
      {
        name: 'Different lengths',
        input: 'l1 = [1], l2 = [9,9]',
        expr: 'listToString(sol.addTwoNumbers(buildList(1), buildList(9,9)))',
        expected: '[0, 0, 1]'
      },
      {
        name: 'Single digits with carry',
        input: 'l1 = [5], l2 = [5]',
        expr: 'listToString(sol.addTwoNumbers(buildList(5), buildList(5)))',
        expected: '[0, 1]'
      }
    ]
  },

  {
    id: 155,
    slug: 'min-stack',
    title: 'Min Stack',
    difficulty: 'Medium',
    topics: ['stack', 'design'],
    companies: ['amazon', 'bloomberg', 'google', 'microsoft', 'apple'],
    statement: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

Implement the \`Solution\` class (acting as MinStack):
- \`Solution()\` initializes the stack object.
- \`void push(int val)\` pushes \`val\` onto the stack.
- \`void pop()\` removes the element on the top of the stack.
- \`int top()\` gets the top element of the stack.
- \`int getMin()\` retrieves the minimum element in the stack.

All operations must run in O(1) average time.`,
    examples: [
      {
        input: 'push(-2); push(0); push(-3); getMin(); pop(); top(); getMin()',
        output: '[-3, 0, -2]',
        explanation: 'After pushing -2, 0, -3 the min is -3; after pop the top is 0 and the min is -2.'
      },
      {
        input: 'push(1); push(2); top(); getMin(); pop(); getMin()',
        output: '[2, 1, 1]',
        explanation: 'Min tracks the sole remaining value after the larger top is popped.'
      }
    ],
    constraints: [
      '-2^31 <= val <= 2^31 - 1',
      'Methods pop, top and getMin will always be called on non-empty stacks',
      'At most 3 * 10^4 calls will be made to push, pop, top, and getMin'
    ],
    hints: [
      'A plain stack gives O(1) push/pop/top, but scanning for the minimum is O(n).',
      'Store the current minimum alongside each pushed value so getMin is a peek.',
      'Two stacks (values + mins) or pairs on one stack both work; push a new min only when val <= current min.'
    ],
    approach: `**Parallel min stack.** Keep the main value stack and a second stack of minima. On push, also push \`min(val, currentMin)\` onto the min stack. Pop both stacks together. \`getMin\` and \`top\` are peeks. Every operation stays O(1) time and O(n) space.`,
    complexity: { time: 'O(1) per operation', space: 'O(n)' },
    starterCode: `class Solution {
    public Solution() {
        // Write your solution here
    }

    public void push(int val) {
    }

    public void pop() {
    }

    public int top() {
        return 0;
    }

    public int getMin() {
        return 0;
    }
}`,
    solutionCode: `class Solution {
    private final Deque<Integer> values = new ArrayDeque<>();
    private final Deque<Integer> mins = new ArrayDeque<>();

    public Solution() {
    }

    public void push(int val) {
        values.push(val);
        if (mins.isEmpty() || val <= mins.peek()) mins.push(val);
        else mins.push(mins.peek());
    }

    public void pop() {
        values.pop();
        mins.pop();
    }

    public int top() {
        return values.peek();
    }

    public int getMin() {
        return mins.peek();
    }
}`,
    tests: [
      {
        name: 'Example 1',
        input: 'push(-2), push(0), push(-3), getMin, pop, top, getMin',
        setup: 'sol.push(-2); sol.push(0); sol.push(-3); List<Integer> out = new ArrayList<>(); out.add(sol.getMin()); sol.pop(); out.add(sol.top()); out.add(sol.getMin());',
        expr: 'out.toString()',
        expected: '[-3, 0, -2]'
      },
      {
        name: 'Increasing then pop',
        input: 'push(1), push(2), top, getMin, pop, getMin',
        setup: 'sol.push(1); sol.push(2); List<Integer> out = new ArrayList<>(); out.add(sol.top()); out.add(sol.getMin()); sol.pop(); out.add(sol.getMin());',
        expr: 'out.toString()',
        expected: '[2, 1, 1]'
      },
      {
        name: 'All equal values',
        input: 'push(5), push(5), getMin, pop, getMin',
        setup: 'sol.push(5); sol.push(5); List<Integer> out = new ArrayList<>(); out.add(sol.getMin()); sol.pop(); out.add(sol.getMin());',
        expr: 'out.toString()',
        expected: '[5, 5]'
      },
      {
        name: 'Descending mins',
        input: 'push(3), push(2), push(1), getMin, pop, getMin',
        setup: 'sol.push(3); sol.push(2); sol.push(1); List<Integer> out = new ArrayList<>(); out.add(sol.getMin()); sol.pop(); out.add(sol.getMin());',
        expr: 'out.toString()',
        expected: '[1, 2]'
      },
      {
        name: 'Single element',
        input: 'push(42), top, getMin',
        setup: 'sol.push(42); List<Integer> out = new ArrayList<>(); out.add(sol.top()); out.add(sol.getMin());',
        expr: 'out.toString()',
        expected: '[42, 42]'
      }
    ]
  },

  {
    id: 146,
    slug: 'lru-cache',
    title: 'LRU Cache',
    difficulty: 'Medium',
    topics: ['hash-table', 'linked-list', 'design'],
    companies: ['amazon', 'bloomberg', 'meta', 'google', 'microsoft'],
    statement: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement \`Solution\` (acting as LRUCache):
- \`Solution(int capacity)\` initialize the LRU cache with positive size \`capacity\`.
- \`int get(int key)\` return the value of the \`key\` if it exists, otherwise return \`-1\`.
- \`void put(int key, int value)\` update the value of the \`key\` if present, otherwise insert. When the cache exceeds capacity, evict the least recently used key before inserting.

\`get\` and \`put\` must each run in O(1) average time.`,
    examples: [
      {
        input: 'capacity = 2; put(1,1); put(2,2); get(1); put(3,3); get(2); put(4,4); get(1); get(3); get(4)',
        output: '[1, -1, -1, 3, 4]',
        explanation: 'Key 2 is evicted when 3 is inserted; key 1 is evicted when 4 is inserted.'
      },
      {
        input: 'capacity = 1; put(2,1); get(2); put(3,2); get(2); get(3)',
        output: '[1, -1, 2]',
        explanation: 'Only one slot; putting 3 evicts 2.'
      }
    ],
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls to get and put'
    ],
    hints: [
      'O(1) lookup needs a hash map; O(1) eviction of the oldest entry needs an ordered structure.',
      'A doubly linked list plus a map from key → node lets you move any node to the front in O(1).',
      'On get/put of an existing key, refresh recency by moving that node to the most-recent end.'
    ],
    approach: `**Hash map + doubly linked list.** Map keys to nodes. Sentinel head/tail bracket the list ordered from most to least recent. \`get\` moves a hit to the front; \`put\` updates or inserts at the front and, if over capacity, drops the node before the tail. All pointer rewires are O(1).`,
    complexity: { time: 'O(1) per get/put', space: 'O(capacity)' },
    starterCode: `class Solution {
    public Solution() {
        // harness default; real capacity comes from Solution(int)
    }

    public Solution(int capacity) {
        // Write your solution here
    }

    public int get(int key) {
        return -1;
    }

    public void put(int key, int value) {
    }
}`,
    solutionCode: `class Solution {
    private static class Node {
        int key, val;
        Node prev, next;
        Node(int key, int val) { this.key = key; this.val = val; }
    }

    private int capacity;
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0);
    private final Node tail = new Node(0, 0);

    public Solution() {
        this(1);
    }

    public Solution(int capacity) {
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        Node node = map.get(key);
        if (node == null) return -1;
        moveToFront(node);
        return node.val;
    }

    public void put(int key, int value) {
        Node node = map.get(key);
        if (node != null) {
            node.val = value;
            moveToFront(node);
            return;
        }
        if (map.size() == capacity) {
            Node lru = tail.prev;
            remove(lru);
            map.remove(lru.key);
        }
        Node fresh = new Node(key, value);
        map.put(key, fresh);
        insertAfterHead(fresh);
    }

    private void moveToFront(Node node) {
        remove(node);
        insertAfterHead(node);
    }

    private void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void insertAfterHead(Node node) {
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
    }
}`,
    tests: [
      {
        name: 'Classic example',
        input: 'capacity = 2, ops as in statement',
        setup: `Solution cache = new Solution(2);
        List<Integer> out = new ArrayList<>();
        cache.put(1, 1);
        cache.put(2, 2);
        out.add(cache.get(1));
        cache.put(3, 3);
        out.add(cache.get(2));
        cache.put(4, 4);
        out.add(cache.get(1));
        out.add(cache.get(3));
        out.add(cache.get(4));`,
        expr: 'out.toString()',
        expected: '[1, -1, -1, 3, 4]'
      },
      {
        name: 'Capacity one',
        input: 'capacity = 1',
        setup: `Solution cache = new Solution(1);
        List<Integer> out = new ArrayList<>();
        cache.put(2, 1);
        out.add(cache.get(2));
        cache.put(3, 2);
        out.add(cache.get(2));
        out.add(cache.get(3));`,
        expr: 'out.toString()',
        expected: '[1, -1, 2]'
      },
      {
        name: 'Update existing key refreshes order',
        input: 'capacity = 2; put 1; put 2; put 1 again; put 3; get 2',
        setup: `Solution cache = new Solution(2);
        List<Integer> out = new ArrayList<>();
        cache.put(1, 1);
        cache.put(2, 2);
        cache.put(1, 10);
        cache.put(3, 3);
        out.add(cache.get(2));
        out.add(cache.get(1));
        out.add(cache.get(3));`,
        expr: 'out.toString()',
        expected: '[-1, 10, 3]'
      },
      {
        name: 'Get misses',
        input: 'capacity = 2; get missing keys',
        setup: `Solution cache = new Solution(2);
        List<Integer> out = new ArrayList<>();
        out.add(cache.get(1));
        cache.put(1, 1);
        out.add(cache.get(2));
        out.add(cache.get(1));`,
        expr: 'out.toString()',
        expected: '[-1, -1, 1]'
      },
      {
        name: 'Repeated gets keep key hot',
        input: 'capacity = 2; put 1,2; get 1 twice; put 3; get 1 and 2',
        setup: `Solution cache = new Solution(2);
        List<Integer> out = new ArrayList<>();
        cache.put(1, 1);
        cache.put(2, 2);
        out.add(cache.get(1));
        out.add(cache.get(1));
        cache.put(3, 3);
        out.add(cache.get(1));
        out.add(cache.get(2));
        out.add(cache.get(3));`,
        expr: 'out.toString()',
        expected: '[1, 1, 1, -1, 3]'
      }
    ]
  },

  {
    id: 208,
    slug: 'implement-trie-prefix-tree',
    title: 'Implement Trie (Prefix Tree)',
    difficulty: 'Medium',
    topics: ['trie', 'design', 'string', 'hash-table'],
    companies: ['amazon', 'google', 'microsoft', 'meta'],
    statement: `A trie (pronounced "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.

Implement the \`Solution\` class (acting as Trie):
- \`Solution()\` initializes the trie.
- \`void insert(String word)\` inserts \`word\` into the trie.
- \`boolean search(String word)\` returns true if \`word\` is in the trie (exact match).
- \`boolean startsWith(String prefix)\` returns true if there is a previously inserted string that has the prefix \`prefix\`.`,
    examples: [
      {
        input: 'insert("apple"); search("apple"); search("app"); startsWith("app"); insert("app"); search("app")',
        output: '[true, false, true, true]',
        explanation: '"app" is only a prefix until it is inserted as a full word.'
      },
      {
        input: 'insert("hello"); startsWith("hell"); startsWith("help"); search("hello")',
        output: '[true, false, true]',
        explanation: 'Prefix checks do not require an end-of-word mark.'
      }
    ],
    constraints: [
      '1 <= word.length, prefix.length <= 2000',
      'word and prefix consist only of lowercase English letters',
      'At most 3 * 10^4 calls in total to insert, search, and startsWith'
    ],
    hints: [
      'Each node branches on the next character — typically a map or a size-26 array of children.',
      'Mark nodes that complete a full inserted word so search differs from startsWith.',
      'Walk character by character; if a needed child is missing, the answer is false.'
    ],
    approach: `**Character-branching tree.** Root children represent the first letter. \`insert\` creates missing nodes and flags the final node as a word end. \`search\` requires every letter and the end flag; \`startsWith\` only requires the path. Each operation is O(length).`,
    complexity: { time: 'O(L) per op', space: 'O(total characters inserted)' },
    starterCode: `class Solution {
    public Solution() {
        // Write your solution here
    }

    public void insert(String word) {
    }

    public boolean search(String word) {
        return false;
    }

    public boolean startsWith(String prefix) {
        return false;
    }
}`,
    solutionCode: `class Solution {
    private static class Node {
        Node[] next = new Node[26];
        boolean end;
    }

    private final Node root = new Node();

    public Solution() {
    }

    public void insert(String word) {
        Node cur = root;
        for (int i = 0; i < word.length(); i++) {
            int idx = word.charAt(i) - 'a';
            if (cur.next[idx] == null) cur.next[idx] = new Node();
            cur = cur.next[idx];
        }
        cur.end = true;
    }

    public boolean search(String word) {
        Node node = walk(word);
        return node != null && node.end;
    }

    public boolean startsWith(String prefix) {
        return walk(prefix) != null;
    }

    private Node walk(String s) {
        Node cur = root;
        for (int i = 0; i < s.length(); i++) {
            int idx = s.charAt(i) - 'a';
            if (cur.next[idx] == null) return null;
            cur = cur.next[idx];
        }
        return cur;
    }
}`,
    tests: [
      {
        name: 'Example 1',
        input: 'insert apple / search / startsWith / insert app',
        setup: `List<Boolean> out = new ArrayList<>();
        sol.insert("apple");
        out.add(sol.search("apple"));
        out.add(sol.search("app"));
        out.add(sol.startsWith("app"));
        sol.insert("app");
        out.add(sol.search("app"));`,
        expr: 'out.toString()',
        expected: '[true, false, true, true]'
      },
      {
        name: 'Prefix only',
        input: 'insert hello',
        setup: `List<Boolean> out = new ArrayList<>();
        sol.insert("hello");
        out.add(sol.startsWith("hell"));
        out.add(sol.startsWith("help"));
        out.add(sol.search("hello"));`,
        expr: 'out.toString()',
        expected: '[true, false, true]'
      },
      {
        name: 'Empty-ish misses',
        input: 'no inserts',
        setup: `List<Boolean> out = new ArrayList<>();
        out.add(sol.search("a"));
        out.add(sol.startsWith("a"));`,
        expr: 'out.toString()',
        expected: '[false, false]'
      },
      {
        name: 'Shared prefixes',
        input: 'insert app, apple, apply',
        setup: `List<Boolean> out = new ArrayList<>();
        sol.insert("app");
        sol.insert("apple");
        sol.insert("apply");
        out.add(sol.search("app"));
        out.add(sol.search("appl"));
        out.add(sol.startsWith("appl"));
        out.add(sol.search("apply"));`,
        expr: 'out.toString()',
        expected: '[true, false, true, true]'
      },
      {
        name: 'Single letter words',
        input: 'insert a; search a/b; startsWith a',
        setup: `List<Boolean> out = new ArrayList<>();
        sol.insert("a");
        out.add(sol.search("a"));
        out.add(sol.search("b"));
        out.add(sol.startsWith("a"));`,
        expr: 'out.toString()',
        expected: '[true, false, true]'
      }
    ]
  },

  {
    id: 235,
    slug: 'lowest-common-ancestor-of-a-binary-search-tree',
    title: 'Lowest Common Ancestor of a BST',
    difficulty: 'Medium',
    topics: ['tree', 'bst', 'dfs'],
    companies: ['amazon', 'meta', 'microsoft', 'google', 'linkedin'],
    statement: `Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes \`p\` and \`q\`.

The lowest common ancestor is defined between two nodes \`p\` and \`q\` as the lowest node in \`T\` that has both \`p\` and \`q\` as descendants (a node can be a descendant of itself).`,
    examples: [
      {
        input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8',
        output: '6',
        explanation: 'Nodes 2 and 8 sit in opposite subtrees of 6.'
      },
      {
        input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4',
        output: '2',
        explanation: '2 is an ancestor of 4, so 2 is the LCA.'
      }
    ],
    constraints: [
      'The number of nodes in the tree is in the range [2, 10^5]',
      '-10^9 <= Node.val <= 10^9',
      'All Node.val are unique',
      'p != q',
      'p and q will exist in the BST'
    ],
    hints: [
      'In a BST, left values are smaller and right values are larger than the node.',
      'If both p and q are smaller than the current node, the LCA lies in the left subtree.',
      'If they split across the node (or one equals the node), the current node is the LCA.'
    ],
    approach: `**Walk using BST order.** From the root, while both targets lie strictly left or strictly right, step that way. The first node that is not strictly on one side is the split point — the LCA. Iterative form uses O(1) extra space.`,
    complexity: { time: 'O(h)', space: 'O(1) iterative' },
    testHelpers: TREE_HELPERS,
    starterCode: `${TREE_NODE}

class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Write your solution here
        return null;
    }
}`,
    solutionCode: `${TREE_NODE}

class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        TreeNode cur = root;
        while (cur != null) {
            if (p.val < cur.val && q.val < cur.val) cur = cur.left;
            else if (p.val > cur.val && q.val > cur.val) cur = cur.right;
            else return cur;
        }
        return null;
    }
}`,
    tests: [
      {
        name: 'Split at root',
        input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8',
        setup: 'TreeNode root = buildTree(6,2,8,0,4,7,9,null,null,3,5); TreeNode p = findNode(root, 2); TreeNode q = findNode(root, 8);',
        expr: 'sol.lowestCommonAncestor(root, p, q).val',
        expected: '6'
      },
      {
        name: 'Ancestor is p',
        input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4',
        setup: 'TreeNode root = buildTree(6,2,8,0,4,7,9,null,null,3,5); TreeNode p = findNode(root, 2); TreeNode q = findNode(root, 4);',
        expr: 'sol.lowestCommonAncestor(root, p, q).val',
        expected: '2'
      },
      {
        name: 'Deep left split',
        input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 3, q = 5',
        setup: 'TreeNode root = buildTree(6,2,8,0,4,7,9,null,null,3,5); TreeNode p = findNode(root, 3); TreeNode q = findNode(root, 5);',
        expr: 'sol.lowestCommonAncestor(root, p, q).val',
        expected: '4'
      },
      {
        name: 'Two-node tree',
        input: 'root = [2,1], p = 2, q = 1',
        setup: 'TreeNode root = buildTree(2,1); TreeNode p = findNode(root, 2); TreeNode q = findNode(root, 1);',
        expr: 'sol.lowestCommonAncestor(root, p, q).val',
        expected: '2'
      },
      {
        name: 'Right subtree pair',
        input: 'root = [6,2,8,0,4,7,9], p = 7, q = 9',
        setup: 'TreeNode root = buildTree(6,2,8,0,4,7,9); TreeNode p = findNode(root, 7); TreeNode q = findNode(root, 9);',
        expr: 'sol.lowestCommonAncestor(root, p, q).val',
        expected: '8'
      }
    ]
  },

  {
    id: 347,
    slug: 'top-k-frequent-elements',
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    topics: ['array', 'hash-table', 'heap', 'bucket-sort'],
    companies: ['amazon', 'meta', 'google', 'microsoft', 'bloomberg'],
    statement: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements. You may return the answer in any order.`,
    examples: [
      {
        input: 'nums = [1,1,1,2,2,3], k = 2',
        output: '[1,2]',
        explanation: '1 appears three times, 2 twice — those are the top two.'
      },
      {
        input: 'nums = [1], k = 1',
        output: '[1]',
        explanation: 'Only one distinct value.'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      'k is in the range [1, the number of unique elements in the array]',
      'It is guaranteed that the answer is unique'
    ],
    hints: [
      'Count frequencies with a hash map first.',
      'A min-heap of size k keyed by frequency keeps only the current top-k keys.',
      'Bucket sort by frequency (array of lists indexed by count) is O(n) after the count pass.'
    ],
    approach: `**Count, then bounded heap.** Build a frequency map, then maintain a min-heap of size k ordered by frequency. Each distinct key is offered once; when the heap exceeds k, drop the least frequent. The remaining keys are the answer. Bucket sort is an O(n) alternative.`,
    complexity: { time: 'O(n log k)', space: 'O(n)' },
    starterCode: `class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // Write your solution here
        return new int[0];
    }
}`,
    solutionCode: `class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) freq.put(num, freq.getOrDefault(num, 0) + 1);

        PriorityQueue<Integer> heap = new PriorityQueue<>(
            (a, b) -> freq.get(a) - freq.get(b)
        );
        for (int key : freq.keySet()) {
            heap.offer(key);
            if (heap.size() > k) heap.poll();
        }

        int[] ans = new int[k];
        for (int i = k - 1; i >= 0; i--) ans[i] = heap.poll();
        return ans;
    }
}`,
    tests: [
      {
        name: 'Example 1',
        input: 'nums = [1,1,1,2,2,3], k = 2',
        expr: 'Arrays.toString(sol.topKFrequent(new int[]{1,1,1,2,2,3}, 2))',
        expected: '[1, 2]',
        unordered: true
      },
      {
        name: 'Single element',
        input: 'nums = [1], k = 1',
        expr: 'Arrays.toString(sol.topKFrequent(new int[]{1}, 1))',
        expected: '[1]',
        unordered: true
      },
      {
        name: 'All unique k equals n',
        input: 'nums = [4,5,6], k = 3',
        expr: 'Arrays.toString(sol.topKFrequent(new int[]{4,5,6}, 3))',
        expected: '[4, 5, 6]',
        unordered: true
      },
      {
        name: 'Negatives',
        input: 'nums = [-1,-1,2,2,2,3], k = 2',
        expr: 'Arrays.toString(sol.topKFrequent(new int[]{-1,-1,2,2,2,3}, 2))',
        expected: '[2, -1]',
        unordered: true
      },
      {
        name: 'k = 1',
        input: 'nums = [5,5,5,1,1,2], k = 1',
        expr: 'Arrays.toString(sol.topKFrequent(new int[]{5,5,5,1,1,2}, 1))',
        expected: '[5]',
        unordered: true
      }
    ]
  },

  {
    id: 207,
    slug: 'course-schedule',
    title: 'Course Schedule',
    difficulty: 'Medium',
    topics: ['graph', 'dfs', 'bfs', 'topological-sort'],
    companies: ['amazon', 'google', 'microsoft', 'meta', 'tiktok'],
    statement: `There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [ai, bi]\` indicates that you must take course \`bi\` first if you want to take course \`ai\`.

Return \`true\` if you can finish all courses. Otherwise, return \`false\`.`,
    examples: [
      {
        input: 'numCourses = 2, prerequisites = [[1,0]]',
        output: 'true',
        explanation: 'Take course 0 then course 1.'
      },
      {
        input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]',
        output: 'false',
        explanation: 'A cycle of mutual prerequisites makes both courses impossible.'
      }
    ],
    constraints: [
      '1 <= numCourses <= 2000',
      '0 <= prerequisites.length <= 5000',
      'prerequisites[i].length == 2',
      '0 <= ai, bi < numCourses',
      'All pairs prerequisites[i] are unique'
    ],
    hints: [
      'Model courses as nodes and prerequisites as directed edges bi → ai.',
      'Finishing every course is possible iff the graph is a DAG (no cycles).',
      'Kahn\'s algorithm (BFS on indegrees) or three-color DFS both detect cycles.'
    ],
    approach: `**Cycle detection via topological sort.** Build adjacency lists and indegrees. Queue every zero-indegree course, then repeatedly dequeue and reduce neighbors' indegrees. If you process all \`numCourses\` nodes, the graph is acyclic and the schedule is possible; otherwise a cycle remains.`,
    complexity: { time: 'O(V + E)', space: 'O(V + E)' },
    starterCode: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        // Write your solution here
        return false;
    }
}`,
    solutionCode: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>();
        int[] indegree = new int[numCourses];
        for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
        for (int[] edge : prerequisites) {
            graph.get(edge[1]).add(edge[0]);
            indegree[edge[0]]++;
        }

        Deque<Integer> queue = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) queue.add(i);
        }

        int seen = 0;
        while (!queue.isEmpty()) {
            int course = queue.poll();
            seen++;
            for (int next : graph.get(course)) {
                if (--indegree[next] == 0) queue.add(next);
            }
        }
        return seen == numCourses;
    }
}`,
    tests: [
      {
        name: 'Simple chain',
        input: 'numCourses = 2, prerequisites = [[1,0]]',
        expr: 'sol.canFinish(2, new int[][]{{1,0}})',
        expected: 'true'
      },
      {
        name: 'Two-cycle',
        input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]',
        expr: 'sol.canFinish(2, new int[][]{{1,0},{0,1}})',
        expected: 'false'
      },
      {
        name: 'No prerequisites',
        input: 'numCourses = 3, prerequisites = []',
        expr: 'sol.canFinish(3, new int[][]{})',
        expected: 'true'
      },
      {
        name: 'Longer DAG',
        input: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]',
        expr: 'sol.canFinish(4, new int[][]{{1,0},{2,0},{3,1},{3,2}})',
        expected: 'true'
      },
      {
        name: 'Cycle among three',
        input: 'numCourses = 3, prerequisites = [[0,1],[1,2],[2,0]]',
        expr: 'sol.canFinish(3, new int[][]{{0,1},{1,2},{2,0}})',
        expected: 'false'
      }
    ]
  }
];

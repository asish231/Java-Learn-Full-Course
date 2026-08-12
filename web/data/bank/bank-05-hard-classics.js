/**
 * bank-05-hard-classics.js — remaining high-frequency interview problems.
 *
 * Shape mirrors ./bank-00-reference.js. Verify with:
 *   node web/tools/verify-bank.js --file bank-05-hard-classics.js
 */

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

    private static TreeNode findNode(TreeNode root, int val) {
        if (root == null) return null;
        if (root.val == val) return root;
        TreeNode left = findNode(root.left, val);
        return left != null ? left : findNode(root.right, val);
    }`;

module.exports = [
  {
    id: 76,
    slug: 'minimum-window-substring',
    title: 'Minimum Window Substring',
    difficulty: 'Hard',
    topics: ['string', 'sliding-window', 'hash-table'],
    companies: ['amazon', 'google', 'meta', 'microsoft'],
    statement: `Given two strings \`s\` and \`t\` of lengths \`m\` and \`n\` respectively, return the minimum window substring of \`s\` such that every character in \`t\` (including duplicates) is included in the window. If there is no such substring, return the empty string \`""\`.

The testcases will be generated such that the answer is unique.`,
    examples: [
      { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"', explanation: 'The shortest window covering A, B, and C.' },
      { input: 's = "a", t = "a"', output: '"a"', explanation: 'The whole string is the window.' },
      { input: 's = "a", t = "aa"', output: '""', explanation: 'Need two as; s has one.' }
    ],
    constraints: ['m == s.length', 'n == t.length', '1 <= m, n <= 10^5', 's and t consist of uppercase and lowercase English letters'],
    hints: [
      'Grow a window until it covers every required character, then shrink from the left.',
      'Keep a need-count for t and a have-count of how many unique required chars are currently satisfied.',
      'When have == need, record the window if it is shorter, then advance the left pointer.'
    ],
    approach: '**Cover-then-shrink sliding window.** Count characters in `t`. Expand `right` over `s`, decrementing the remaining need. When every required char is satisfied, walk `left` forward while the window stays valid, tracking the shortest slice.',
    complexity: { time: 'O(m + n)', space: 'O(1) alphabet' },
    starterCode: `class Solution {
    public String minWindow(String s, String t) {
        // Write your solution here
        return "";
    }
}`,
    solutionCode: `class Solution {
    public String minWindow(String s, String t) {
        int[] need = new int[128];
        int required = 0;
        for (int i = 0; i < t.length(); i++) {
            if (need[t.charAt(i)]++ == 0) required++;
        }
        int have = 0, left = 0, bestL = 0, bestLen = Integer.MAX_VALUE;
        int[] window = new int[128];
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (++window[c] == need[c] && need[c] > 0) have++;
            while (have == required) {
                if (right - left + 1 < bestLen) {
                    bestLen = right - left + 1;
                    bestL = left;
                }
                char d = s.charAt(left++);
                if (need[d] > 0 && window[d]-- == need[d]) have--;
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestL, bestL + bestLen);
    }
}`,
    tests: [
      { name: 'Example 1', input: 's = "ADOBECODEBANC", t = "ABC"', expr: 'sol.minWindow("ADOBECODEBANC", "ABC")', expected: 'BANC' },
      { name: 'Whole string', input: 's = "a", t = "a"', expr: 'sol.minWindow("a", "a")', expected: 'a' },
      { name: 'Impossible', input: 's = "a", t = "aa"', expr: 'sol.minWindow("a", "aa")', expected: '' },
      { name: 'Duplicates in t', input: 's = "aaflslflsldkalskaaa", t = "aaa"', expr: 'sol.minWindow("aaflslflsldkalskaaa", "aaa")', expected: 'aaa' }
    ]
  },

  {
    id: 239,
    slug: 'sliding-window-maximum',
    title: 'Sliding Window Maximum',
    difficulty: 'Hard',
    topics: ['array', 'sliding-window', 'queue', 'heap'],
    companies: ['amazon', 'google', 'microsoft'],
    statement: `You are given an array of integers \`nums\`, there is a sliding window of size \`k\` which is moving from the very left of the array to the very right. You can only see the \`k\` numbers in the window. Each time the sliding window moves right by one position.

Return the max sliding window.`,
    examples: [
      { input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '[3,3,5,5,6,7]', explanation: 'Max of each window of size 3.' },
      { input: 'nums = [1], k = 1', output: '[1]', explanation: 'A single-element window.' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', '1 <= k <= nums.length'],
    hints: [
      'A heap of the window works but is O(n log k). Interviews want O(n).',
      'Keep indices in a deque, front = current max, values decreasing toward the back.',
      'Drop indices that left the window, and drop from the back anything smaller than the incoming value.'
    ],
    approach: '**Monotonic deque.** Store indices with decreasing values. The front is the max of the current window. Pop expired fronts and smaller backs before pushing `i`. Record `nums[deque.front]` once `i >= k-1`.',
    complexity: { time: 'O(n)', space: 'O(k)' },
    starterCode: `class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        // Write your solution here
        return new int[0];
    }
}`,
    solutionCode: `class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] ans = new int[n - k + 1];
        Deque<Integer> dq = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();
            while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();
            dq.addLast(i);
            if (i >= k - 1) ans[i - k + 1] = nums[dq.peekFirst()];
        }
        return ans;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', expr: 'Arrays.toString(sol.maxSlidingWindow(new int[]{1,3,-1,-3,5,3,6,7}, 3))', expected: '[3, 3, 5, 5, 6, 7]' },
      { name: 'Single', input: 'nums = [1], k = 1', expr: 'Arrays.toString(sol.maxSlidingWindow(new int[]{1}, 1))', expected: '[1]' },
      { name: 'Decreasing', input: 'nums = [9,8,7,6], k = 2', expr: 'Arrays.toString(sol.maxSlidingWindow(new int[]{9,8,7,6}, 2))', expected: '[9, 8, 7]' },
      { name: 'Window is whole array', input: 'nums = [2,1,3], k = 3', expr: 'Arrays.toString(sol.maxSlidingWindow(new int[]{2,1,3}, 3))', expected: '[3]' }
    ]
  },

  {
    id: 42,
    slug: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    topics: ['array', 'two-pointers', 'stack'],
    companies: ['amazon', 'google', 'meta', 'apple'],
    statement: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'Six units sit in the valleys.' },
      { input: 'height = [4,2,0,3,2,5]', output: '9', explanation: 'Water is bounded by 4 on the left and 5 on the right.' }
    ],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    hints: [
      'Water at i is min(maxLeft, maxRight) - height[i], if positive.',
      'Two pointers: the side with the smaller running max is the bottleneck, so you can settle that index now.',
      'A monotonic stack of indices also works — pop when a taller bar closes a valley.'
    ],
    approach: '**Two pointers.** `left`/`right` walk inward. Track `leftMax` and `rightMax`. The smaller max is the lid for that side: add `max - height` and step that pointer. Each index is settled once.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    starterCode: `class Solution {
    public int trap(int[] height) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int trap(int[] height) {
        int l = 0, r = height.length - 1, leftMax = 0, rightMax = 0, water = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                if (height[l] >= leftMax) leftMax = height[l];
                else water += leftMax - height[l];
                l++;
            } else {
                if (height[r] >= rightMax) rightMax = height[r];
                else water += rightMax - height[r];
                r--;
            }
        }
        return water;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', expr: 'sol.trap(new int[]{0,1,0,2,1,0,1,3,2,1,2,1})', expected: '6' },
      { name: 'Example 2', input: 'height = [4,2,0,3,2,5]', expr: 'sol.trap(new int[]{4,2,0,3,2,5})', expected: '9' },
      { name: 'No valley', input: 'height = [1,2,3]', expr: 'sol.trap(new int[]{1,2,3})', expected: '0' },
      { name: 'Flat', input: 'height = [2,2,2]', expr: 'sol.trap(new int[]{2,2,2})', expected: '0' }
    ]
  },

  {
    id: 84,
    slug: 'largest-rectangle-in-histogram',
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    topics: ['array', 'stack'],
    companies: ['amazon', 'google', 'microsoft'],
    statement: `Given an array of integers \`heights\` representing the histogram's bar height where the width of each bar is \`1\`, return the area of the largest rectangle in the histogram.`,
    examples: [
      { input: 'heights = [2,1,5,6,2,3]', output: '10', explanation: 'The 5×2 rectangle of bars 5 and 6.' },
      { input: 'heights = [2,4]', output: '4', explanation: 'The 2×2 rectangle, or the single bar of height 4.' }
    ],
    constraints: ['1 <= heights.length <= 10^5', '0 <= heights[i] <= 10^4'],
    hints: [
      'For each bar, the largest rectangle with that bar as the shortest is bounded by the nearest shorter bars on both sides.',
      'A monotonic increasing stack of indices finds those bounds in one pass.',
      'Push a sentinel 0 at the end so every bar gets popped and measured.'
    ],
    approach: '**Monotonic stack.** Walk left to right, popping when the current bar is shorter than the stack top. The popped bar width is i minus previousIndex minus 1. Area = height times width. A trailing 0 flushes the stack.',
    complexity: { time: 'O(n)', space: 'O(n)' },
    starterCode: `class Solution {
    public int largestRectangleArea(int[] heights) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int largestRectangleArea(int[] heights) {
        int n = heights.length, best = 0;
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i <= n; i++) {
            int h = i == n ? 0 : heights[i];
            while (!st.isEmpty() && heights[st.peek()] > h) {
                int height = heights[st.pop()];
                int left = st.isEmpty() ? -1 : st.peek();
                best = Math.max(best, height * (i - left - 1));
            }
            st.push(i);
        }
        return best;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'heights = [2,1,5,6,2,3]', expr: 'sol.largestRectangleArea(new int[]{2,1,5,6,2,3})', expected: '10' },
      { name: 'Example 2', input: 'heights = [2,4]', expr: 'sol.largestRectangleArea(new int[]{2,4})', expected: '4' },
      { name: 'Single', input: 'heights = [1]', expr: 'sol.largestRectangleArea(new int[]{1})', expected: '1' },
      { name: 'Increasing', input: 'heights = [1,2,3,4]', expr: 'sol.largestRectangleArea(new int[]{1,2,3,4})', expected: '6' }
    ]
  },

  {
    id: 23,
    slug: 'merge-k-sorted-lists',
    title: 'Merge k Sorted Lists',
    difficulty: 'Hard',
    topics: ['linked-list', 'heap'],
    companies: ['amazon', 'google', 'meta', 'microsoft'],
    statement: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.`,
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]', explanation: 'All three lists merged.' },
      { input: 'lists = []', output: '[]', explanation: 'Nothing to merge.' }
    ],
    constraints: ['k == lists.length', '0 <= k <= 10^4', '0 <= lists[i].length <= 500', '-10^4 <= lists[i][j] <= 10^4', 'lists[i] is sorted in ascending order', 'The sum of lists[i].length will not exceed 10^4'],
    hints: [
      'Merging two lists at a time is correct but slow if you always scan from the start.',
      'A min-heap of the current head of each list always gives the next smallest node.',
      'Push the successor of a popped node so every node is inserted once.'
    ],
    approach: '**Min-heap of list heads.** Put every non-null head into a priority queue ordered by `val`. Repeatedly pop the smallest, append it, and push `node.next` if it exists. Dummy head keeps the wiring simple.',
    complexity: { time: 'O(N log k)', space: 'O(k)' },
    testHelpers: LIST_HELPERS,
    starterCode: `${LIST_NODE}

class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        // Write your solution here
        return null;
    }
}`,
    solutionCode: `${LIST_NODE}

class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));
        if (lists != null) {
            for (ListNode node : lists) if (node != null) pq.add(node);
        }
        ListNode dummy = new ListNode(0), cur = dummy;
        while (!pq.isEmpty()) {
            ListNode node = pq.poll();
            cur.next = node;
            cur = cur.next;
            if (node.next != null) pq.add(node.next);
        }
        return dummy.next;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'lists = [[1,4,5],[1,3,4],[2,6]]', expr: 'listToString(sol.mergeKLists(new ListNode[]{buildList(1,4,5), buildList(1,3,4), buildList(2,6)}))', expected: '[1, 1, 2, 3, 4, 4, 5, 6]' },
      { name: 'Empty input', input: 'lists = []', expr: 'listToString(sol.mergeKLists(new ListNode[]{}))', expected: '[]' },
      { name: 'One empty list', input: 'lists = [[]]', expr: 'listToString(sol.mergeKLists(new ListNode[]{null}))', expected: '[]' },
      { name: 'Two lists', input: 'lists = [[1,2],[1,3]]', expr: 'listToString(sol.mergeKLists(new ListNode[]{buildList(1,2), buildList(1,3)}))', expected: '[1, 1, 2, 3]' }
    ]
  },

  {
    id: 54,
    slug: 'spiral-matrix',
    title: 'Spiral Matrix',
    difficulty: 'Medium',
    topics: ['array', 'matrix'],
    companies: ['amazon', 'microsoft', 'apple'],
    statement: `Given an \`m x n\` \`matrix\`, return all elements of the matrix in spiral order.`,
    examples: [
      { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]', explanation: 'Clockwise from the top-left.' },
      { input: 'matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]', output: '[1,2,3,4,8,12,11,10,9,5,6,7]', explanation: 'A 3×4 spiral.' }
    ],
    constraints: ['m == matrix.length', 'n == matrix[i].length', '1 <= m, n <= 10', '-100 <= matrix[i][j] <= 100'],
    hints: [
      'Keep four bounds: top, bottom, left, right. Walk the rim, then shrink.',
      'After the top row, increment top. After the right column, decrement right. Same for bottom and left.',
      'Stop when top > bottom or left > right so you do not reprint a single remaining row twice.'
    ],
    approach: '**Layer by layer.** Walk right, down, left, up on the current rectangle, then inset the four bounds. Guard after each side so a single remaining row or column is not traversed twice.',
    complexity: { time: 'O(m · n)', space: 'O(1) extra' },
    starterCode: `class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        // Write your solution here
        return new ArrayList<>();
    }
}`,
    solutionCode: `class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> ans = new ArrayList<>();
        int top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
        while (top <= bottom && left <= right) {
            for (int c = left; c <= right; c++) ans.add(matrix[top][c]);
            top++;
            for (int r = top; r <= bottom; r++) ans.add(matrix[r][right]);
            right--;
            if (top <= bottom) {
                for (int c = right; c >= left; c--) ans.add(matrix[bottom][c]);
                bottom--;
            }
            if (left <= right) {
                for (int r = bottom; r >= top; r--) ans.add(matrix[r][left]);
                left++;
            }
        }
        return ans;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', expr: 'sol.spiralOrder(new int[][]{{1,2,3},{4,5,6},{7,8,9}}).toString()', expected: '[1, 2, 3, 6, 9, 8, 7, 4, 5]' },
      { name: 'Example 2', input: 'matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]', expr: 'sol.spiralOrder(new int[][]{{1,2,3,4},{5,6,7,8},{9,10,11,12}}).toString()', expected: '[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]' },
      { name: 'Single cell', input: 'matrix = [[7]]', expr: 'sol.spiralOrder(new int[][]{{7}}).toString()', expected: '[7]' },
      { name: 'Single row', input: 'matrix = [[1,2,3]]', expr: 'sol.spiralOrder(new int[][]{{1,2,3}}).toString()', expected: '[1, 2, 3]' }
    ]
  },

  {
    id: 57,
    slug: 'insert-interval',
    title: 'Insert Interval',
    difficulty: 'Medium',
    topics: ['array', 'intervals'],
    companies: ['amazon', 'google', 'linkedin'],
    statement: `You are given an array of non-overlapping intervals \`intervals\` where \`intervals[i] = [start_i, end_i]\` represent the start and the end of the \`i\`th interval and \`intervals\` is sorted in ascending order by \`start_i\`. You are also given an interval \`newInterval = [start, end]\` that represents the start and end of another interval.

Insert \`newInterval\` into \`intervals\` such that \`intervals\` is still sorted in ascending order by \`start_i\` and \`intervals\` still does not have any overlapping intervals (merge overlapping intervals if necessary).

Return \`intervals\` after the insertion.`,
    examples: [
      { input: 'intervals = [[1,3],[6,9]], newInterval = [2,5]', output: '[[1,5],[6,9]]', explanation: '[1,3] merges with [2,5].' },
      { input: 'intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]', output: '[[1,2],[3,10],[12,16]]', explanation: '[3,5],[6,7],[8,10] merge with [4,8].' }
    ],
    constraints: ['0 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start_i <= end_i <= 10^5', 'intervals is sorted by start_i', 'newInterval.length == 2', '0 <= start <= end <= 10^5'],
    hints: [
      'Copy every interval that ends before the new one starts.',
      'Merge every interval that overlaps the new one by expanding start/end.',
      'Append the rest. The input is already sorted, so you never need to sort.'
    ],
    approach: '**Three-way sweep.** Append intervals strictly left of `newInterval`, merge all that overlap it, then append the strictly right remainder. One pass because the input is sorted and disjoint.',
    complexity: { time: 'O(n)', space: 'O(n)' },
    starterCode: `class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        // Write your solution here
        return intervals;
    }
}`,
    solutionCode: `class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> out = new ArrayList<>();
        int i = 0, n = intervals.length;
        while (i < n && intervals[i][1] < newInterval[0]) out.add(intervals[i++]);
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
            i++;
        }
        out.add(newInterval);
        while (i < n) out.add(intervals[i++]);
        return out.toArray(new int[0][]);
    }
}`,
    tests: [
      { name: 'Example 1', input: 'intervals = [[1,3],[6,9]], newInterval = [2,5]', expr: 'Arrays.deepToString(sol.insert(new int[][]{{1,3},{6,9}}, new int[]{2,5}))', expected: '[[1, 5], [6, 9]]' },
      { name: 'Example 2', input: 'intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]', expr: 'Arrays.deepToString(sol.insert(new int[][]{{1,2},{3,5},{6,7},{8,10},{12,16}}, new int[]{4,8}))', expected: '[[1, 2], [3, 10], [12, 16]]' },
      { name: 'Empty list', input: 'intervals = [], newInterval = [5,7]', expr: 'Arrays.deepToString(sol.insert(new int[][]{}, new int[]{5,7}))', expected: '[[5, 7]]' },
      { name: 'Insert at end', input: 'intervals = [[1,2]], newInterval = [3,4]', expr: 'Arrays.deepToString(sol.insert(new int[][]{{1,2}}, new int[]{3,4}))', expected: '[[1, 2], [3, 4]]' }
    ]
  },

  {
    id: 236,
    slug: 'lowest-common-ancestor-of-a-binary-tree',
    title: 'Lowest Common Ancestor of a Binary Tree',
    difficulty: 'Medium',
    topics: ['tree', 'dfs'],
    companies: ['amazon', 'meta', 'microsoft', 'linkedin'],
    statement: `Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.

The lowest common ancestor is defined between two nodes \`p\` and \`q\` as the lowest node in \`T\` that has both \`p\` and \`q\` as descendants (where we allow a node to be a descendant of itself).`,
    examples: [
      { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', output: '3', explanation: '3 is the first node that has both 5 and 1 under it.' },
      { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4', output: '5', explanation: 'A node can be an ancestor of itself.' }
    ],
    constraints: ['The number of nodes is in the range [2, 10^5]', '-10^9 <= Node.val <= 10^9', 'All Node.val are unique', 'p != q', 'p and q will exist in the tree'],
    hints: [
      'If the current node is p or q, it is a candidate ancestor.',
      'Search left and right. If both sides return a node, the current node is the LCA.',
      'If only one side returns a node, bubble that node up.'
    ],
    approach: '**Post-order DFS.** Return the node if it is `p`, `q`, or null. If both children return non-null, this node is the split — the LCA. Otherwise return the non-null child.',
    complexity: { time: 'O(n)', space: 'O(h) recursion' },
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
        if (root == null || root == p || root == q) return root;
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root;
        return left != null ? left : right;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', setup: 'TreeNode root = buildTree(3,5,1,6,2,0,8,null,null,7,4);', expr: 'sol.lowestCommonAncestor(root, findNode(root, 5), findNode(root, 1)).val', expected: '3' },
      { name: 'Node is ancestor of itself', input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4', setup: 'TreeNode root = buildTree(3,5,1,6,2,0,8,null,null,7,4);', expr: 'sol.lowestCommonAncestor(root, findNode(root, 5), findNode(root, 4)).val', expected: '5' },
      { name: 'Two-node tree', input: 'root = [1,2], p = 1, q = 2', setup: 'TreeNode root = buildTree(1,2);', expr: 'sol.lowestCommonAncestor(root, findNode(root, 1), findNode(root, 2)).val', expected: '1' },
      { name: 'Right subtree pair', input: 'root = [3,5,1,6,2,0,8], p = 0, q = 8', setup: 'TreeNode root = buildTree(3,5,1,6,2,0,8);', expr: 'sol.lowestCommonAncestor(root, findNode(root, 0), findNode(root, 8)).val', expected: '1' }
    ]
  },

  {
    id: 994,
    slug: 'rotting-oranges',
    title: 'Rotting Oranges',
    difficulty: 'Medium',
    topics: ['graph', 'bfs', 'matrix'],
    companies: ['amazon', 'google', 'microsoft'],
    statement: `You are given an \`m x n\` grid where each cell can have one of three values:

- \`0\` representing an empty cell,
- \`1\` representing a fresh orange, or
- \`2\` representing a rotten orange.

Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten.

Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return \`-1\`.`,
    examples: [
      { input: 'grid = [[2,1,1],[1,1,0],[0,1,1]]', output: '4', explanation: 'The last fresh orange rots at minute 4.' },
      { input: 'grid = [[2,1,1],[0,1,1],[1,0,1]]', output: '-1', explanation: 'The bottom-left orange is unreachable.' },
      { input: 'grid = [[0,2]]', output: '0', explanation: 'No fresh oranges.' }
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 10', 'grid[i][j] is 0, 1, or 2'],
    hints: [
      'This is multi-source BFS: every initially rotten orange is a source at time 0.',
      'Count fresh oranges. Each time you rot one, decrement. Minutes = last depth.',
      'If any fresh orange remains when the queue is empty, return -1.'
    ],
    approach: '**Multi-source BFS.** Enqueue every rotten cell. While the queue is not empty, rot 4-neighbors and record the minute. If a fresh count remains at the end, return -1; else the last minute (or 0 if none were fresh).',
    complexity: { time: 'O(m · n)', space: 'O(m · n)' },
    starterCode: `class Solution {
    public int orangesRotting(int[][] grid) {
        // Write your solution here
        return -1;
    }
}`,
    solutionCode: `class Solution {
    public int orangesRotting(int[][] grid) {
        int m = grid.length, n = grid[0].length, fresh = 0, minutes = 0;
        Queue<int[]> q = new ArrayDeque<>();
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == 2) q.add(new int[]{r, c});
                else if (grid[r][c] == 1) fresh++;
            }
        }
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.isEmpty() && fresh > 0) {
            int sz = q.size();
            minutes++;
            for (int i = 0; i < sz; i++) {
                int[] cell = q.poll();
                for (int[] d : dirs) {
                    int nr = cell[0] + d[0], nc = cell[1] + d[1];
                    if (nr < 0 || nc < 0 || nr >= m || nc >= n || grid[nr][nc] != 1) continue;
                    grid[nr][nc] = 2;
                    fresh--;
                    q.add(new int[]{nr, nc});
                }
            }
        }
        return fresh == 0 ? minutes : -1;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'grid = [[2,1,1],[1,1,0],[0,1,1]]', expr: 'sol.orangesRotting(new int[][]{{2,1,1},{1,1,0},{0,1,1}})', expected: '4' },
      { name: 'Unreachable', input: 'grid = [[2,1,1],[0,1,1],[1,0,1]]', expr: 'sol.orangesRotting(new int[][]{{2,1,1},{0,1,1},{1,0,1}})', expected: '-1' },
      { name: 'Already done', input: 'grid = [[0,2]]', expr: 'sol.orangesRotting(new int[][]{{0,2}})', expected: '0' },
      { name: 'All fresh isolated', input: 'grid = [[1]]', expr: 'sol.orangesRotting(new int[][]{{1}})', expected: '-1' }
    ]
  }
];

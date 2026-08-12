/**
 * bank-04-interview-classics.js — high-frequency interview problems that were
 * missing from the guided bank (arrays, matrix, DP, trees, graphs).
 *
 * Shape mirrors ./bank-00-reference.js. Verify with:
 *   node web/tools/verify-bank.js --file bank-04-interview-classics.js
 */

const TREE_NODE = `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }
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
    }`;

module.exports = [
  {
    id: 75,
    slug: 'sort-colors',
    title: 'Sort Colors',
    difficulty: 'Medium',
    topics: ['array', 'two-pointers', 'sorting'],
    companies: ['amazon', 'microsoft', 'meta'],
    statement: `Given an array \`nums\` with \`n\` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.

We will use the integers \`0\`, \`1\`, and \`2\` to represent the color red, white, and blue, respectively.

You must solve this problem without using the library's sort function.`,
    examples: [
      { input: 'nums = [2,0,2,1,1,0]', output: '[0,0,1,1,2,2]', explanation: 'Dutch-national-flag partition.' },
      { input: 'nums = [2,0,1]', output: '[0,1,2]', explanation: 'One of each color.' }
    ],
    constraints: ['n == nums.length', '1 <= n <= 300', 'nums[i] is 0, 1, or 2'],
    hints: [
      'Counting sort works in two passes. The interview follow-up is one pass.',
      'Keep three pointers: next 0, current scan, next 2 from the right.',
      'When you swap a 2 to the end, do not advance the scan — the swapped-in value is unprocessed.'
    ],
    approach: '**Dutch national flag.** `lo` is the write index for 0s, `hi` for 2s, `i` scans. `0` swaps with `lo++` and `i++`; `2` swaps with `hi--` without incrementing `i`; `1` just `i++`. One pass, constant extra space.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    starterCode: `class Solution {
    public void sortColors(int[] nums) {
        // Write your solution here
    }
}`,
    solutionCode: `class Solution {
    public void sortColors(int[] nums) {
        int lo = 0, i = 0, hi = nums.length - 1;
        while (i <= hi) {
            if (nums[i] == 0) {
                int t = nums[lo]; nums[lo] = nums[i]; nums[i] = t;
                lo++; i++;
            } else if (nums[i] == 2) {
                int t = nums[hi]; nums[hi] = nums[i]; nums[i] = t;
                hi--;
            } else {
                i++;
            }
        }
    }
}`,
    tests: [
      { name: 'Example 1', input: 'nums = [2,0,2,1,1,0]', setup: 'int[] a = new int[]{2,0,2,1,1,0}; sol.sortColors(a);', expr: 'Arrays.toString(a)', expected: '[0, 0, 1, 1, 2, 2]' },
      { name: 'Example 2', input: 'nums = [2,0,1]', setup: 'int[] a = new int[]{2,0,1}; sol.sortColors(a);', expr: 'Arrays.toString(a)', expected: '[0, 1, 2]' },
      { name: 'Already sorted', input: 'nums = [0,1,2]', setup: 'int[] a = new int[]{0,1,2}; sol.sortColors(a);', expr: 'Arrays.toString(a)', expected: '[0, 1, 2]' },
      { name: 'All same', input: 'nums = [1,1,1]', setup: 'int[] a = new int[]{1,1,1}; sol.sortColors(a);', expr: 'Arrays.toString(a)', expected: '[1, 1, 1]' },
      { name: 'Two colors', input: 'nums = [2,2,0,0]', setup: 'int[] a = new int[]{2,2,0,0}; sol.sortColors(a);', expr: 'Arrays.toString(a)', expected: '[0, 0, 2, 2]' }
    ]
  },

  {
    id: 283,
    slug: 'move-zeroes',
    title: 'Move Zeroes',
    difficulty: 'Easy',
    topics: ['array', 'two-pointers'],
    companies: ['meta', 'apple', 'amazon'],
    statement: `Given an integer array \`nums\`, move all \`0\`s to the end of it while maintaining the relative order of the non-zero elements.

Note that you must do this in-place without making a copy of the array.`,
    examples: [
      { input: 'nums = [0,1,0,3,12]', output: '[1,3,12,0,0]', explanation: 'Non-zeros keep order; zeros slide right.' },
      { input: 'nums = [0]', output: '[0]', explanation: 'Single zero stays.' }
    ],
    constraints: ['1 <= nums.length <= 10^4', '-2^31 <= nums[i] <= 2^31 - 1'],
    hints: [
      'The write index is the next slot a non-zero should occupy.',
      'Scan once: when you see a non-zero, write it at the write index and advance.',
      'Fill the tail with zeros after the scan.'
    ],
    approach: '**Stable partition.** `write` starts at 0. For each non-zero, copy it to `nums[write++]`. Then fill `write..n-1` with 0. Relative order of non-zeros is preserved.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    starterCode: `class Solution {
    public void moveZeroes(int[] nums) {
        // Write your solution here
    }
}`,
    solutionCode: `class Solution {
    public void moveZeroes(int[] nums) {
        int write = 0;
        for (int x : nums) if (x != 0) nums[write++] = x;
        while (write < nums.length) nums[write++] = 0;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'nums = [0,1,0,3,12]', setup: 'int[] a = new int[]{0,1,0,3,12}; sol.moveZeroes(a);', expr: 'Arrays.toString(a)', expected: '[1, 3, 12, 0, 0]' },
      { name: 'Single zero', input: 'nums = [0]', setup: 'int[] a = new int[]{0}; sol.moveZeroes(a);', expr: 'Arrays.toString(a)', expected: '[0]' },
      { name: 'No zeros', input: 'nums = [1,2,3]', setup: 'int[] a = new int[]{1,2,3}; sol.moveZeroes(a);', expr: 'Arrays.toString(a)', expected: '[1, 2, 3]' },
      { name: 'All zeros', input: 'nums = [0,0,0]', setup: 'int[] a = new int[]{0,0,0}; sol.moveZeroes(a);', expr: 'Arrays.toString(a)', expected: '[0, 0, 0]' }
    ]
  },

  {
    id: 169,
    slug: 'majority-element',
    title: 'Majority Element',
    difficulty: 'Easy',
    topics: ['array', 'hash-table', 'sorting'],
    companies: ['amazon', 'google', 'microsoft'],
    statement: `Given an array \`nums\` of size \`n\`, return the majority element.

The majority element is the element that appears more than \`⌊n / 2⌋\` times. You may assume that the majority element always exists in the array.`,
    examples: [
      { input: 'nums = [3,2,3]', output: '3', explanation: '3 appears twice in three elements.' },
      { input: 'nums = [2,2,1,1,1,2,2]', output: '2', explanation: '2 appears four times.' }
    ],
    constraints: ['n == nums.length', '1 <= n <= 5 * 10^4', '-10^9 <= nums[i] <= 10^9', 'The majority element always exists'],
    hints: [
      'A hash map of counts is O(n) time and O(n) space.',
      'Boyer-Moore: keep a candidate and a vote. Matching values increment the vote; others decrement. When the vote hits 0, pick a new candidate.',
      'Because a majority exists, the candidate that survives is the answer — no second pass needed under that guarantee.'
    ],
    approach: '**Boyer-Moore voting.** Walk once with `candidate` and `count`. Equal values add a vote; others spend a vote. A true majority cannot be cancelled, so the final candidate is the answer.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    starterCode: `class Solution {
    public int majorityElement(int[] nums) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int majorityElement(int[] nums) {
        int candidate = 0, count = 0;
        for (int x : nums) {
            if (count == 0) candidate = x;
            count += x == candidate ? 1 : -1;
        }
        return candidate;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'nums = [3,2,3]', expr: 'sol.majorityElement(new int[]{3,2,3})', expected: '3' },
      { name: 'Example 2', input: 'nums = [2,2,1,1,1,2,2]', expr: 'sol.majorityElement(new int[]{2,2,1,1,1,2,2})', expected: '2' },
      { name: 'Single', input: 'nums = [1]', expr: 'sol.majorityElement(new int[]{1})', expected: '1' },
      { name: 'All same', input: 'nums = [7,7,7,7]', expr: 'sol.majorityElement(new int[]{7,7,7,7})', expected: '7' }
    ]
  },

  {
    id: 88,
    slug: 'merge-sorted-array',
    title: 'Merge Sorted Array',
    difficulty: 'Easy',
    topics: ['array', 'two-pointers', 'sorting'],
    companies: ['meta', 'amazon', 'microsoft'],
    statement: `You are given two integer arrays \`nums1\` and \`nums2\`, sorted in non-decreasing order, and two integers \`m\` and \`n\`, representing the number of elements in \`nums1\` and \`nums2\` respectively.

Merge \`nums1\` and \`nums2\` into a single array sorted in non-decreasing order.

The final sorted array should not be returned by the function, but instead be stored inside the array \`nums1\`. To accommodate this, \`nums1\` has a length of \`m + n\`, where the first \`m\` elements denote the elements that should be merged, and the last \`n\` elements are set to \`0\` and should be ignored. \`nums2\` has a length of \`n\`.`,
    examples: [
      { input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', output: '[1,2,2,3,5,6]', explanation: 'Merged in place into nums1.' },
      { input: 'nums1 = [1], m = 1, nums2 = [], n = 0', output: '[1]', explanation: 'Nothing to merge.' }
    ],
    constraints: ['nums1.length == m + n', 'nums2.length == n', '0 <= m, n <= 200', '1 <= m + n <= 200', '-10^9 <= nums1[i], nums2[j] <= 10^9'],
    hints: [
      'If you fill from the left you overwrite values you still need.',
      'Write from the back: the largest remaining of nums1[m-1] and nums2[n-1] goes to the end.',
      'If nums2 still has leftovers after nums1 is exhausted, copy them into the front.'
    ],
    approach: '**Two pointers from the right.** `i = m-1`, `j = n-1`, `k = m+n-1`. Place the larger of `nums1[i]` and `nums2[j]` at `k` and walk backwards. Remaining `nums2` values copy into the head of `nums1`.',
    complexity: { time: 'O(m + n)', space: 'O(1)' },
    starterCode: `class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        // Write your solution here
    }
}`,
    solutionCode: `class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1, j = n - 1, k = m + n - 1;
        while (j >= 0) {
            if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
            else nums1[k--] = nums2[j--];
        }
    }
}`,
    tests: [
      { name: 'Example 1', input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', setup: 'int[] a = new int[]{1,2,3,0,0,0}; sol.merge(a, 3, new int[]{2,5,6}, 3);', expr: 'Arrays.toString(a)', expected: '[1, 2, 2, 3, 5, 6]' },
      { name: 'Only nums1', input: 'nums1 = [1], m = 1, nums2 = [], n = 0', setup: 'int[] a = new int[]{1}; sol.merge(a, 1, new int[]{}, 0);', expr: 'Arrays.toString(a)', expected: '[1]' },
      { name: 'Only nums2', input: 'nums1 = [0], m = 0, nums2 = [1], n = 1', setup: 'int[] a = new int[]{0}; sol.merge(a, 0, new int[]{1}, 1);', expr: 'Arrays.toString(a)', expected: '[1]' },
      { name: 'Interleaved', input: 'nums1 = [2,0], m = 1, nums2 = [1], n = 1', setup: 'int[] a = new int[]{2,0}; sol.merge(a, 1, new int[]{1}, 1);', expr: 'Arrays.toString(a)', expected: '[1, 2]' }
    ]
  },

  {
    id: 31,
    slug: 'next-permutation',
    title: 'Next Permutation',
    difficulty: 'Medium',
    topics: ['array', 'two-pointers'],
    companies: ['google', 'amazon', 'meta'],
    statement: `A permutation of an array of integers is an arrangement of its members into a sequence or linear order.

The next permutation of an array of integers is the next lexicographically greater permutation of its integer. More formally, if all the permutations of the array are sorted in one container according to their lexicographical order, then the next permutation of that array is the permutation that follows it in the sorted container. If such arrangement is not possible, the array must be rearranged as the lowest possible order (i.e., sorted in ascending order).

The replacement must be in-place and use only constant extra memory.`,
    examples: [
      { input: 'nums = [1,2,3]', output: '[1,3,2]', explanation: 'The next permutation after 1,2,3.' },
      { input: 'nums = [3,2,1]', output: '[1,2,3]', explanation: 'Last permutation wraps to the first.' },
      { input: 'nums = [1,1,5]', output: '[1,5,1]', explanation: 'Swap the last ascent.' }
    ],
    constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 100'],
    hints: [
      'Find the rightmost ascent: the last i where nums[i] < nums[i+1].',
      'If there is no ascent, the array is reverse-sorted — reverse it to the first permutation.',
      'Otherwise swap nums[i] with the rightmost successor greater than it, then reverse the suffix after i.'
    ],
    approach: '**Pivot + reverse suffix.** Scan from the right for the first `i` with `nums[i] < nums[i+1]`. Find the rightmost `j > i` with `nums[j] > nums[i]`, swap, then reverse `i+1..end` so the suffix is the smallest possible tail.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    starterCode: `class Solution {
    public void nextPermutation(int[] nums) {
        // Write your solution here
    }
}`,
    solutionCode: `class Solution {
    public void nextPermutation(int[] nums) {
        int i = nums.length - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;
        if (i >= 0) {
            int j = nums.length - 1;
            while (nums[j] <= nums[i]) j--;
            int t = nums[i]; nums[i] = nums[j]; nums[j] = t;
        }
        reverse(nums, i + 1, nums.length - 1);
    }
    private void reverse(int[] a, int l, int r) {
        while (l < r) {
            int t = a[l]; a[l] = a[r]; a[r] = t;
            l++; r--;
        }
    }
}`,
    tests: [
      { name: 'Example 1', input: 'nums = [1,2,3]', setup: 'int[] a = new int[]{1,2,3}; sol.nextPermutation(a);', expr: 'Arrays.toString(a)', expected: '[1, 3, 2]' },
      { name: 'Wrap around', input: 'nums = [3,2,1]', setup: 'int[] a = new int[]{3,2,1}; sol.nextPermutation(a);', expr: 'Arrays.toString(a)', expected: '[1, 2, 3]' },
      { name: 'Duplicates', input: 'nums = [1,1,5]', setup: 'int[] a = new int[]{1,1,5}; sol.nextPermutation(a);', expr: 'Arrays.toString(a)', expected: '[1, 5, 1]' },
      { name: 'Single', input: 'nums = [1]', setup: 'int[] a = new int[]{1}; sol.nextPermutation(a);', expr: 'Arrays.toString(a)', expected: '[1]' }
    ]
  },

  {
    id: 5,
    slug: 'longest-palindromic-substring',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    topics: ['string', 'dp'],
    companies: ['amazon', 'microsoft', 'google'],
    statement: `Given a string \`s\`, return the longest palindromic substring in \`s\`.`,
    examples: [
      { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also valid; expand-around-center from the left returns "bab".' },
      { input: 's = "cbbd"', output: '"bb"', explanation: 'Even-length palindrome.' }
    ],
    constraints: ['1 <= s.length <= 1000', 's consists of only digits and English letters'],
    hints: [
      'A palindrome mirrors around a center. There are 2n-1 centers (each char, and each gap).',
      'Expand while the two pointers stay in bounds and the characters match.',
      'Track the longest window you have seen; ties keep the earlier one.'
    ],
    approach: '**Expand around center.** For every index, expand an odd palindrome `(i,i)` and an even palindrome `(i,i+1)`. Keep the longest window. O(n²) time, O(1) extra space — enough at n ≤ 1000.',
    complexity: { time: 'O(n²)', space: 'O(1)' },
    starterCode: `class Solution {
    public String longestPalindrome(String s) {
        // Write your solution here
        return "";
    }
}`,
    solutionCode: `class Solution {
    public String longestPalindrome(String s) {
        int start = 0, best = 1;
        for (int i = 0; i < s.length(); i++) {
            int len = Math.max(expand(s, i, i), expand(s, i, i + 1));
            if (len > best) {
                best = len;
                start = i - (len - 1) / 2;
            }
        }
        return s.substring(start, start + best);
    }
    private int expand(String s, int l, int r) {
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
        return r - l - 1;
    }
}`,
    tests: [
      { name: 'Example 1', input: 's = "babad"', expr: 'sol.longestPalindrome("babad")', expected: 'bab' },
      { name: 'Example 2', input: 's = "cbbd"', expr: 'sol.longestPalindrome("cbbd")', expected: 'bb' },
      { name: 'Single', input: 's = "a"', expr: 'sol.longestPalindrome("a")', expected: 'a' },
      { name: 'Whole string', input: 's = "aba"', expr: 'sol.longestPalindrome("aba")', expected: 'aba' },
      { name: 'No longer palindrome', input: 's = "ac"', expr: 'sol.longestPalindrome("ac")', expected: 'a' }
    ]
  },

  {
    id: 48,
    slug: 'rotate-image',
    title: 'Rotate Image',
    difficulty: 'Medium',
    topics: ['array', 'matrix'],
    companies: ['amazon', 'apple', 'microsoft'],
    statement: `You are given an \`n x n\` 2D \`matrix\` representing an image, rotate the image by 90 degrees (clockwise).

You have to rotate the image in-place, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix and do the rotation.`,
    examples: [
      { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]', explanation: 'Transpose, then reverse each row.' },
      { input: 'matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]', output: '[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]', explanation: '4×4 clockwise rotation.' }
    ],
    constraints: ['n == matrix.length == matrix[i].length', '1 <= n <= 20', '-1000 <= matrix[i][j] <= 1000'],
    hints: [
      'Transpose (swap matrix[i][j] with matrix[j][i] for j > i).',
      'Then reverse every row.',
      'That pair of in-place passes is a 90° clockwise rotation.'
    ],
    approach: '**Transpose then reverse rows.** After transpose, row `i` is the old column `i`. Reversing each row sends the old bottom to the new right — clockwise 90° without a second matrix.',
    complexity: { time: 'O(n²)', space: 'O(1)' },
    starterCode: `class Solution {
    public void rotate(int[][] matrix) {
        // Write your solution here
    }
}`,
    solutionCode: `class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int t = matrix[i][j]; matrix[i][j] = matrix[j][i]; matrix[j][i] = t;
            }
        }
        for (int i = 0; i < n; i++) {
            int l = 0, r = n - 1;
            while (l < r) {
                int t = matrix[i][l]; matrix[i][l] = matrix[i][r]; matrix[i][r] = t;
                l++; r--;
            }
        }
    }
}`,
    tests: [
      { name: 'Example 1', input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', setup: 'int[][] m = new int[][]{{1,2,3},{4,5,6},{7,8,9}}; sol.rotate(m);', expr: 'Arrays.deepToString(m)', expected: '[[7, 4, 1], [8, 5, 2], [9, 6, 3]]' },
      { name: '1x1', input: 'matrix = [[1]]', setup: 'int[][] m = new int[][]{{1}}; sol.rotate(m);', expr: 'Arrays.deepToString(m)', expected: '[[1]]' },
      { name: '2x2', input: 'matrix = [[1,2],[3,4]]', setup: 'int[][] m = new int[][]{{1,2},{3,4}}; sol.rotate(m);', expr: 'Arrays.deepToString(m)', expected: '[[3, 1], [4, 2]]' }
    ]
  },

  {
    id: 73,
    slug: 'set-matrix-zeroes',
    title: 'Set Matrix Zeroes',
    difficulty: 'Medium',
    topics: ['array', 'matrix', 'hash-table'],
    companies: ['amazon', 'microsoft', 'apple'],
    statement: `Given an \`m x n\` integer matrix \`matrix\`, if an element is \`0\`, set its entire row and column to \`0\`s.

You must do it in place.`,
    examples: [
      { input: 'matrix = [[1,1,1],[1,0,1],[1,1,1]]', output: '[ [1,0,1], [0,0,0], [1,0,1] ]', explanation: 'The middle 0 clears row 1 and column 1.' },
      { input: 'matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]', output: '[[0,0,0,0],[0,4,5,0],[0,3,1,0]]', explanation: 'Two zeros in the first row clear that row and columns 0 and 3.' }
    ],
    constraints: ['m == matrix.length', 'n == matrix[0].length', '1 <= m, n <= 200', '-2^31 <= matrix[i][j] <= 2^31 - 1'],
    hints: [
      'A first pass that writes zeros immediately destroys information you still need.',
      'Mark rows and columns that must be cleared. Extra O(m+n) arrays are the easy version.',
      'The O(1) version stores those marks in the first row and first column, with one extra flag for the first row itself.'
    ],
    approach: '**First row/column as markers.** Scan for zeros; if `matrix[i][j]==0`, set `matrix[i][0]` and `matrix[0][j]` to 0. Use a boolean for whether row 0 originally had a zero. Then fill inner cells from those marks, then the first column, then the first row.',
    complexity: { time: 'O(m · n)', space: 'O(1)' },
    starterCode: `class Solution {
    public void setZeroes(int[][] matrix) {
        // Write your solution here
    }
}`,
    solutionCode: `class Solution {
    public void setZeroes(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        boolean firstRow = false;
        for (int j = 0; j < n; j++) if (matrix[0][j] == 0) firstRow = true;
        for (int i = 1; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == 0) {
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
            }
        }
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;
            }
        }
        if (matrix[0][0] == 0) {
            for (int i = 0; i < m; i++) matrix[i][0] = 0;
        }
        if (firstRow) {
            for (int j = 0; j < n; j++) matrix[0][j] = 0;
        }
    }
}`,
    tests: [
      { name: 'Example 1', input: 'matrix = [[1,1,1],[1,0,1],[1,1,1]]', setup: 'int[][] m = new int[][]{{1,1,1},{1,0,1},{1,1,1}}; sol.setZeroes(m);', expr: 'Arrays.deepToString(m)', expected: '[[1, 0, 1], [0, 0, 0], [1, 0, 1]]' },
      { name: 'Example 2', input: 'matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]', setup: 'int[][] m = new int[][]{{0,1,2,0},{3,4,5,2},{1,3,1,5}}; sol.setZeroes(m);', expr: 'Arrays.deepToString(m)', expected: '[[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]' },
      { name: 'No zeros', input: 'matrix = [[1,2],[3,4]]', setup: 'int[][] m = new int[][]{{1,2},{3,4}}; sol.setZeroes(m);', expr: 'Arrays.deepToString(m)', expected: '[[1, 2], [3, 4]]' },
      { name: 'Single zero cell', input: 'matrix = [[0]]', setup: 'int[][] m = new int[][]{{0}}; sol.setZeroes(m);', expr: 'Arrays.deepToString(m)', expected: '[[0]]' }
    ]
  },

  {
    id: 64,
    slug: 'minimum-path-sum',
    title: 'Minimum Path Sum',
    difficulty: 'Medium',
    topics: ['array', 'dp', 'matrix'],
    companies: ['amazon', 'google', 'apple'],
    statement: `Given a \`m x n\` \`grid\` filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path.

You can only move either down or right at any point in time.`,
    examples: [
      { input: 'grid = [[1,3,1],[1,5,1],[4,2,1]]', output: '7', explanation: '1 → 3 → 1 → 1 → 1.' },
      { input: 'grid = [[1,2,3],[4,5,6]]', output: '12', explanation: '1 → 2 → 3 → 6.' }
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 200', '0 <= grid[i][j] <= 200'],
    hints: [
      'The cheapest way to a cell is the cell plus the cheaper of the cell above or the cell to the left.',
      'Fill the first row and first column as prefix sums — only one way to walk an edge.',
      'You can overwrite the grid itself and finish in O(1) extra space.'
    ],
    approach: '**Grid DP in place.** `grid[r][c] += min(grid[r-1][c], grid[r][c-1])` after seeding the first row/column as running sums. The bottom-right cell is the answer.',
    complexity: { time: 'O(m · n)', space: 'O(1) extra' },
    starterCode: `class Solution {
    public int minPathSum(int[][] grid) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int minPathSum(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (r == 0 && c == 0) continue;
                else if (r == 0) grid[r][c] += grid[r][c - 1];
                else if (c == 0) grid[r][c] += grid[r - 1][c];
                else grid[r][c] += Math.min(grid[r - 1][c], grid[r][c - 1]);
            }
        }
        return grid[m - 1][n - 1];
    }
}`,
    tests: [
      { name: 'Example 1', input: 'grid = [[1,3,1],[1,5,1],[4,2,1]]', expr: 'sol.minPathSum(new int[][]{{1,3,1},{1,5,1},{4,2,1}})', expected: '7' },
      { name: 'Example 2', input: 'grid = [[1,2,3],[4,5,6]]', expr: 'sol.minPathSum(new int[][]{{1,2,3},{4,5,6}})', expected: '12' },
      { name: '1x1', input: 'grid = [[5]]', expr: 'sol.minPathSum(new int[][]{{5}})', expected: '5' },
      { name: 'Single row', input: 'grid = [[1,2,3]]', expr: 'sol.minPathSum(new int[][]{{1,2,3}})', expected: '6' }
    ]
  },

  {
    id: 543,
    slug: 'diameter-of-binary-tree',
    title: 'Diameter of Binary Tree',
    difficulty: 'Easy',
    topics: ['tree', 'dfs'],
    companies: ['meta', 'amazon', 'google'],
    statement: `Given the \`root\` of a binary tree, return the length of the diameter of the tree.

The diameter of a binary tree is the length of the longest path between any two nodes. This path may or may not pass through the root.

The length of a path between two nodes is represented by the number of edges between them.`,
    examples: [
      { input: 'root = [1,2,3,4,5]', output: '3', explanation: 'The path is 4 → 2 → 1 → 3 or 5 → 2 → 1 → 3 (3 edges).' },
      { input: 'root = [1,2]', output: '1', explanation: 'A single edge.' }
    ],
    constraints: ['The number of nodes is in the range [1, 10^4]', '-100 <= Node.val <= 100'],
    hints: [
      'The longest path through a node is height(left) + height(right).',
      'The diameter is the maximum of that value over every node.',
      'Compute height in a post-order DFS and update a running best as you return.'
    ],
    approach: '**Post-order height.** `height(node) = 1 + max(height(left), height(right))`. While computing it, `best = max(best, left + right)` in edges. Return `best`.',
    complexity: { time: 'O(n)', space: 'O(h) recursion' },
    testHelpers: TREE_HELPERS,
    starterCode: `${TREE_NODE}

class Solution {
    public int diameterOfBinaryTree(TreeNode root) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `${TREE_NODE}

class Solution {
    public int diameterOfBinaryTree(TreeNode root) {
        int[] best = new int[1];
        height(root, best);
        return best[0];
    }
    private int height(TreeNode node, int[] best) {
        if (node == null) return 0;
        int left = height(node.left, best);
        int right = height(node.right, best);
        best[0] = Math.max(best[0], left + right);
        return 1 + Math.max(left, right);
    }
}`,
    tests: [
      { name: 'Example 1', input: 'root = [1,2,3,4,5]', expr: 'sol.diameterOfBinaryTree(buildTree(1,2,3,4,5))', expected: '3' },
      { name: 'Example 2', input: 'root = [1,2]', expr: 'sol.diameterOfBinaryTree(buildTree(1,2))', expected: '1' },
      { name: 'Single node', input: 'root = [1]', expr: 'sol.diameterOfBinaryTree(buildTree(1))', expected: '0' },
      { name: 'Left spine', input: 'root = [1,2,null,3]', expr: 'sol.diameterOfBinaryTree(buildTree(1,2,null,3))', expected: '2' }
    ]
  },

  {
    id: 199,
    slug: 'binary-tree-right-side-view',
    title: 'Binary Tree Right Side View',
    difficulty: 'Medium',
    topics: ['tree', 'bfs', 'dfs'],
    companies: ['amazon', 'meta', 'microsoft'],
    statement: `Given the \`root\` of a binary tree, imagine yourself standing on the right side of it. Return the values of the nodes you can see ordered from top to bottom.`,
    examples: [
      { input: 'root = [1,2,3,null,5,null,4]', output: '[1,3,4]', explanation: 'Rightmost node of each level.' },
      { input: 'root = [1,null,3]', output: '[1,3]', explanation: 'A right spine.' }
    ],
    constraints: ['The number of nodes is in the range [0, 100]', '-100 <= Node.val <= 100'],
    hints: [
      'Level-order BFS: the last node you pop in a level is the one visible from the right.',
      'A right-first DFS that records the first visit at each depth also works.',
      'Empty tree → empty list.'
    ],
    approach: '**BFS by level.** For each level, enqueue left then right. The last node in that level is the right-side view. Append it and continue.',
    complexity: { time: 'O(n)', space: 'O(w) queue width' },
    testHelpers: TREE_HELPERS,
    starterCode: `${TREE_NODE}

class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        // Write your solution here
        return new ArrayList<>();
    }
}`,
    solutionCode: `${TREE_NODE}

class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> ans = new ArrayList<>();
        if (root == null) return ans;
        Queue<TreeNode> q = new ArrayDeque<>();
        q.add(root);
        while (!q.isEmpty()) {
            int sz = q.size();
            for (int i = 0; i < sz; i++) {
                TreeNode node = q.poll();
                if (i == sz - 1) ans.add(node.val);
                if (node.left != null) q.add(node.left);
                if (node.right != null) q.add(node.right);
            }
        }
        return ans;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'root = [1,2,3,null,5,null,4]', expr: 'sol.rightSideView(buildTree(1,2,3,null,5,null,4)).toString()', expected: '[1, 3, 4]' },
      { name: 'Right child only', input: 'root = [1,null,3]', expr: 'sol.rightSideView(buildTree(1,null,3)).toString()', expected: '[1, 3]' },
      { name: 'Empty', input: 'root = []', expr: 'sol.rightSideView(buildTree()).toString()', expected: '[]' },
      { name: 'Left bump visible', input: 'root = [1,2]', expr: 'sol.rightSideView(buildTree(1,2)).toString()', expected: '[1, 2]' }
    ]
  },

  {
    id: 416,
    slug: 'partition-equal-subset-sum',
    title: 'Partition Equal Subset Sum',
    difficulty: 'Medium',
    topics: ['array', 'dp'],
    companies: ['amazon', 'meta', 'google'],
    statement: `Given an integer array \`nums\`, return \`true\` if you can partition the array into two subsets such that the sum of the elements in both subsets is equal, or \`false\` otherwise.`,
    examples: [
      { input: 'nums = [1,5,11,5]', output: 'true', explanation: '[1,5,5] and [11].' },
      { input: 'nums = [1,2,3,5]', output: 'false', explanation: 'No equal split exists.' }
    ],
    constraints: ['1 <= nums.length <= 200', '1 <= nums[i] <= 100'],
    hints: [
      'If the total sum is odd, it is impossible.',
      'The question is the 0/1 knapsack: can a subset sum to total/2?',
      'A boolean array `dp[t]` is true if some subset sums to t. Fill it backwards so each number is used once.'
    ],
    approach: '**0/1 knapsack subset-sum.** Target = total/2. `dp[0] = true`. For each number `x`, walk `t` from target down to `x` and set `dp[t] |= dp[t-x]`. Answer is `dp[target]`.',
    complexity: { time: 'O(n · target)', space: 'O(target)' },
    starterCode: `class Solution {
    public boolean canPartition(int[] nums) {
        // Write your solution here
        return false;
    }
}`,
    solutionCode: `class Solution {
    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int x : nums) sum += x;
        if (sum % 2 != 0) return false;
        int target = sum / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        for (int x : nums) {
            for (int t = target; t >= x; t--) dp[t] = dp[t] || dp[t - x];
        }
        return dp[target];
    }
}`,
    tests: [
      { name: 'Example 1', input: 'nums = [1,5,11,5]', expr: 'sol.canPartition(new int[]{1,5,11,5})', expected: 'true' },
      { name: 'Example 2', input: 'nums = [1,2,3,5]', expr: 'sol.canPartition(new int[]{1,2,3,5})', expected: 'false' },
      { name: 'Two equals', input: 'nums = [1,1]', expr: 'sol.canPartition(new int[]{1,1})', expected: 'true' },
      { name: 'Odd sum', input: 'nums = [1,2,5]', expr: 'sol.canPartition(new int[]{1,2,5})', expected: 'false' }
    ]
  },

  {
    id: 139,
    slug: 'word-break',
    title: 'Word Break',
    difficulty: 'Medium',
    topics: ['string', 'dp', 'hash-table'],
    companies: ['amazon', 'google', 'apple'],
    statement: `Given a string \`s\` and a dictionary of strings \`wordDict\`, return \`true\` if \`s\` can be segmented into a space-separated sequence of one or more dictionary words.

Note that the same word in the dictionary may be reused multiple times in the segmentation.`,
    examples: [
      { input: 's = "leetcode", wordDict = ["leet","code"]', output: 'true', explanation: '"leet code".' },
      { input: 's = "applepenapple", wordDict = ["apple","pen"]', output: 'true', explanation: 'Words may be reused.' },
      { input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', output: 'false', explanation: 'Leftover "og".' }
    ],
    constraints: ['1 <= s.length <= 300', '1 <= wordDict.length <= 1000', '1 <= wordDict[i].length <= 20', 's and wordDict[i] consist of lowercase English letters', 'All the strings of wordDict are unique'],
    hints: [
      '`dp[i]` means the prefix `s[0..i)` can be segmented.',
      '`dp[0] = true`. For each i, try every dictionary word that ends at i.',
      'A HashSet of words makes the membership check O(1).'
    ],
    approach: '**Prefix DP.** `dp[i]` is true if some `dp[j]` is true and `s[j..i)` is in the dictionary. Try every word (or every split) for each end index. Return `dp[n]`.',
    complexity: { time: 'O(n · m · L) for m words of length L', space: 'O(n)' },
    starterCode: `class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        // Write your solution here
        return false;
    }
}`,
    solutionCode: `class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> words = new HashSet<>(wordDict);
        int n = s.length();
        boolean[] dp = new boolean[n + 1];
        dp[0] = true;
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && words.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[n];
    }
}`,
    tests: [
      { name: 'Example 1', input: 's = "leetcode", wordDict = ["leet","code"]', expr: 'sol.wordBreak("leetcode", Arrays.asList("leet","code"))', expected: 'true' },
      { name: 'Reuse allowed', input: 's = "applepenapple", wordDict = ["apple","pen"]', expr: 'sol.wordBreak("applepenapple", Arrays.asList("apple","pen"))', expected: 'true' },
      { name: 'Impossible leftover', input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', expr: 'sol.wordBreak("catsandog", Arrays.asList("cats","dog","sand","and","cat"))', expected: 'false' },
      { name: 'Whole word', input: 's = "a", wordDict = ["a"]', expr: 'sol.wordBreak("a", Arrays.asList("a"))', expected: 'true' }
    ]
  },

  {
    id: 210,
    slug: 'course-schedule-ii',
    title: 'Course Schedule II',
    difficulty: 'Medium',
    topics: ['graph', 'bfs', 'dfs'],
    companies: ['amazon', 'google', 'tiktok'],
    statement: `There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [ai, bi]\` indicates that you must take course \`bi\` first if you want to take course \`ai\`.

Return the ordering of courses you should take to finish all courses. If there are many valid answers, return any of them. If it is impossible to finish all courses, return an empty array.`,
    examples: [
      { input: 'numCourses = 2, prerequisites = [[1,0]]', output: '[0,1]', explanation: 'Take 0 then 1.' },
      { input: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]', output: '[0,1,2,3]', explanation: 'Kahn BFS with adjacency in input order yields this unique-enough sequence.' }
    ],
    constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= numCourses * (numCourses - 1)', 'prerequisites[i].length == 2', '0 <= ai, bi < numCourses', 'ai != bi', 'All the pairs [ai, bi] are unique'],
    hints: [
      'This is topological sort on a directed graph: edge b → a means "b before a".',
      'Kahn\'s algorithm: start with indegree-0 nodes, peel them, reduce neighbors.',
      'If you cannot peel every node, there is a cycle — return an empty array.'
    ],
    approach: '**Kahn BFS.** Build adjacency `b → a` and indegrees. Queue every course with indegree 0. Pop, append to the order, decrement neighbors. If the order length is `numCourses`, return it; else return `[]`.',
    complexity: { time: 'O(V + E)', space: 'O(V + E)' },
    starterCode: `class Solution {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        // Write your solution here
        return new int[0];
    }
}`,
    solutionCode: `class Solution {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        int[] indeg = new int[numCourses];
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        for (int[] e : prerequisites) {
            adj.get(e[1]).add(e[0]);
            indeg[e[0]]++;
        }
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) if (indeg[i] == 0) q.add(i);
        int[] order = new int[numCourses];
        int k = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            order[k++] = u;
            for (int v : adj.get(u)) if (--indeg[v] == 0) q.add(v);
        }
        return k == numCourses ? order : new int[0];
    }
}`,
    tests: [
      { name: 'Example 1', input: 'numCourses = 2, prerequisites = [[1,0]]', expr: 'Arrays.toString(sol.findOrder(2, new int[][]{{1,0}}))', expected: '[0, 1]' },
      { name: 'Example 2', input: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]', expr: 'Arrays.toString(sol.findOrder(4, new int[][]{{1,0},{2,0},{3,1},{3,2}}))', expected: '[0, 1, 2, 3]' },
      { name: 'No prereqs', input: 'numCourses = 3, prerequisites = []', expr: 'Arrays.toString(sol.findOrder(3, new int[][]{}))', expected: '[0, 1, 2]' },
      { name: 'Cycle', input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', expr: 'Arrays.toString(sol.findOrder(2, new int[][]{{1,0},{0,1}}))', expected: '[]' }
    ]
  }
];

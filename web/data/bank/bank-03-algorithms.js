/**
 * bank-03-algorithms.js — binary search, backtracking, DP, greedy and bits.
 *
 * Shape is documented in bank-00-reference.js.
 * Verify with:  node tools/verify-bank.js --file bank-03-algorithms.js
 */
module.exports = [
  {
    id: 704,
    slug: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    topics: ['array', 'binary-search'],
    companies: ['amazon', 'google', 'microsoft'],
    statement: `Given a sorted array of distinct integers \`nums\` and an integer \`target\`, return the index of \`target\` in \`nums\`, or \`-1\` if it is not present.

Your algorithm must run in O(log n) time.`,
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 sits at index 4.' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 is not in the array.' }
    ],
    constraints: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4', 'All values are unique and sorted ascending'],
    hints: [
      'Halve the search space every step: compare the target with the middle element.',
      'Use `low + (high - low) / 2` for the midpoint so large indices cannot overflow.',
      'Be consistent: with `high = n - 1` the loop condition must be `low <= high`, and the losing half must be excluded by ±1.'
    ],
    approach: '**Classic binary search.** Maintain an inclusive `[low, high]` window, compare against the midpoint and discard the half that cannot contain the target. The invariant "answer is inside [low, high]" is what keeps the ±1 updates correct.',
    complexity: { time: 'O(log n)', space: 'O(1)' },
    starterCode: `class Solution {
    public int search(int[] nums, int target) {
        // Write your solution here
        return -1;
    }
}`,
    solutionCode: `class Solution {
    public int search(int[] nums, int target) {
        int low = 0;
        int high = nums.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
}`,
    tests: [
      { name: 'Found', input: 'nums = [-1,0,3,5,9,12], target = 9', expr: 'sol.search(new int[]{-1,0,3,5,9,12}, 9)', expected: '4' },
      { name: 'Missing', input: 'nums = [-1,0,3,5,9,12], target = 2', expr: 'sol.search(new int[]{-1,0,3,5,9,12}, 2)', expected: '-1' },
      { name: 'Single element hit', input: 'nums = [5], target = 5', expr: 'sol.search(new int[]{5}, 5)', expected: '0' },
      { name: 'First element', input: 'nums = [2,5], target = 2', expr: 'sol.search(new int[]{2,5}, 2)', expected: '0' },
      { name: 'Last element', input: 'nums = [2,5], target = 5', expr: 'sol.search(new int[]{2,5}, 5)', expected: '1' }
    ]
  },

  {
    id: 136,
    slug: 'single-number',
    title: 'Single Number',
    difficulty: 'Easy',
    topics: ['array', 'bit-manipulation'],
    companies: ['amazon', 'apple', 'palantir'],
    statement: `Every element in the non-empty array \`nums\` appears exactly twice, except for one element which appears once. Find that element.

Solve it in linear time using only constant extra space.`,
    examples: [
      { input: 'nums = [2,2,1]', output: '1', explanation: '1 is the only value without a partner.' },
      { input: 'nums = [4,1,2,1,2]', output: '4', explanation: '4 appears once.' }
    ],
    constraints: ['1 <= nums.length <= 3 * 10^4', '-3 * 10^4 <= nums[i] <= 3 * 10^4', 'Exactly one element appears once'],
    hints: [
      'A hash map solves it, but that costs O(n) memory — the constraint is pushing you elsewhere.',
      'Which operation cancels a value with itself? `x ^ x == 0`.',
      'XOR is commutative and associative, so XOR-ing everything leaves only the unpaired value.'
    ],
    approach: '**XOR fold.** Since `x ^ x = 0` and `x ^ 0 = x`, XOR-ing every element cancels the pairs regardless of their order and leaves the lonely element.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    starterCode: `class Solution {
    public int singleNumber(int[] nums) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int singleNumber(int[] nums) {
        int result = 0;
        for (int num : nums) result ^= num;
        return result;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'nums = [2,2,1]', expr: 'sol.singleNumber(new int[]{2,2,1})', expected: '1' },
      { name: 'Example 2', input: 'nums = [4,1,2,1,2]', expr: 'sol.singleNumber(new int[]{4,1,2,1,2})', expected: '4' },
      { name: 'Single element', input: 'nums = [1]', expr: 'sol.singleNumber(new int[]{1})', expected: '1' },
      { name: 'Negative values', input: 'nums = [-1,-1,-3]', expr: 'sol.singleNumber(new int[]{-1,-1,-3})', expected: '-3' }
    ]
  },

  {
    id: 70,
    slug: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    topics: ['dp', 'math'],
    companies: ['amazon', 'adobe', 'apple'],
    statement: `You are climbing a staircase with \`n\` steps. Each move you may climb either 1 or 2 steps.

In how many distinct ways can you reach the top?`,
    examples: [
      { input: 'n = 2', output: '2', explanation: '1+1 or 2.' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1.' }
    ],
    constraints: ['1 <= n <= 45'],
    hints: [
      'To land on step n your last move came from step n-1 or step n-2.',
      'So ways(n) = ways(n-1) + ways(n-2) — the Fibonacci recurrence.',
      'Plain recursion recomputes the same states exponentially; keep only the last two values instead.'
    ],
    approach: '**Bottom-up Fibonacci.** `ways(n) = ways(n-1) + ways(n-2)` with `ways(1)=1, ways(2)=2`. Since only the previous two states matter, two variables replace the whole DP table.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    starterCode: `class Solution {
    public int climbStairs(int n) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int twoBack = 1;
        int oneBack = 2;
        for (int step = 3; step <= n; step++) {
            int current = oneBack + twoBack;
            twoBack = oneBack;
            oneBack = current;
        }
        return oneBack;
    }
}`,
    tests: [
      { name: 'n = 2', input: 'n = 2', expr: 'sol.climbStairs(2)', expected: '2' },
      { name: 'n = 3', input: 'n = 3', expr: 'sol.climbStairs(3)', expected: '3' },
      { name: 'n = 1', input: 'n = 1', expr: 'sol.climbStairs(1)', expected: '1' },
      { name: 'n = 10', input: 'n = 10', expr: 'sol.climbStairs(10)', expected: '89' },
      { name: 'n = 45 (upper bound)', input: 'n = 45', expr: 'sol.climbStairs(45)', expected: '1836311903' }
    ]
  },

  {
    id: 33,
    slug: 'search-in-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    topics: ['array', 'binary-search'],
    companies: ['amazon', 'meta', 'microsoft', 'bloomberg'],
    statement: `An ascending array of distinct integers was rotated at some unknown pivot — for example \`[0,1,2,4,5,6,7]\` may become \`[4,5,6,7,0,1,2]\`.

Given the rotated array \`nums\` and a \`target\`, return its index or \`-1\`. Your algorithm must run in O(log n).`,
    examples: [
      { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4', explanation: '0 sits at index 4.' },
      { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1', explanation: '3 is absent.' },
      { input: 'nums = [1], target = 0', output: '-1', explanation: 'Single element, no match.' }
    ],
    constraints: ['1 <= nums.length <= 5000', '-10^4 <= nums[i] <= 10^4', 'All values are distinct'],
    hints: [
      'Cut the array in half: at least one half is still perfectly sorted.',
      'Compare `nums[low]` with `nums[mid]` to find out which half that is.',
      'If the target lies inside the sorted half\'s range, search there; otherwise search the other half.'
    ],
    approach: '**Binary search with a sorted half.** After each split, one side is guaranteed to be in order; check whether the target falls inside that side\'s value range and discard the other half. Still O(log n).',
    complexity: { time: 'O(log n)', space: 'O(1)' },
    starterCode: `class Solution {
    public int search(int[] nums, int target) {
        // Write your solution here
        return -1;
    }
}`,
    solutionCode: `class Solution {
    public int search(int[] nums, int target) {
        int low = 0;
        int high = nums.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) return mid;

            if (nums[low] <= nums[mid]) {                 // left half is sorted
                if (target >= nums[low] && target < nums[mid]) high = mid - 1;
                else low = mid + 1;
            } else {                                      // right half is sorted
                if (target > nums[mid] && target <= nums[high]) low = mid + 1;
                else high = mid - 1;
            }
        }
        return -1;
    }
}`,
    tests: [
      { name: 'Target in rotated tail', input: 'nums = [4,5,6,7,0,1,2], target = 0', expr: 'sol.search(new int[]{4,5,6,7,0,1,2}, 0)', expected: '4' },
      { name: 'Missing target', input: 'nums = [4,5,6,7,0,1,2], target = 3', expr: 'sol.search(new int[]{4,5,6,7,0,1,2}, 3)', expected: '-1' },
      { name: 'Single element', input: 'nums = [1], target = 0', expr: 'sol.search(new int[]{1}, 0)', expected: '-1' },
      { name: 'Not rotated', input: 'nums = [1,2,3,4,5], target = 5', expr: 'sol.search(new int[]{1,2,3,4,5}, 5)', expected: '4' },
      { name: 'Pivot itself', input: 'nums = [5,1,2,3,4], target = 5', expr: 'sol.search(new int[]{5,1,2,3,4}, 5)', expected: '0' }
    ]
  },

  {
    id: 198,
    slug: 'house-robber',
    title: 'House Robber',
    difficulty: 'Medium',
    topics: ['array', 'dp'],
    companies: ['amazon', 'linkedin', 'google'],
    statement: `Each house on a street holds some amount of money, given by \`nums\`. Robbing two **adjacent** houses triggers the alarm.

Return the maximum amount you can rob tonight without alerting the police.`,
    examples: [
      { input: 'nums = [1,2,3,1]', output: '4', explanation: 'Rob house 1 and house 3: 1 + 3 = 4.' },
      { input: 'nums = [2,7,9,3,1]', output: '12', explanation: 'Rob houses 1, 3 and 5: 2 + 9 + 1 = 12.' }
    ],
    constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 400'],
    hints: [
      'At each house you make a binary choice: take it (and skip the neighbour) or skip it.',
      'best[i] = max(best[i-1], best[i-2] + nums[i]).',
      'Only the previous two answers matter, so two variables replace the array.'
    ],
    approach: '**Linear DP with two rolling states.** At house `i` you either skip it (keeping `best[i-1]`) or rob it (adding to `best[i-2]`). Track those two values as you sweep the street.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    starterCode: `class Solution {
    public int rob(int[] nums) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int rob(int[] nums) {
        int skip = 0;   // best up to the previous house, not robbing it
        int take = 0;   // best up to and including the previous house
        for (int money : nums) {
            int robHere = skip + money;
            skip = Math.max(skip, take);
            take = robHere;
        }
        return Math.max(skip, take);
    }
}`,
    tests: [
      { name: 'Example 1', input: 'nums = [1,2,3,1]', expr: 'sol.rob(new int[]{1,2,3,1})', expected: '4' },
      { name: 'Example 2', input: 'nums = [2,7,9,3,1]', expr: 'sol.rob(new int[]{2,7,9,3,1})', expected: '12' },
      { name: 'One house', input: 'nums = [5]', expr: 'sol.rob(new int[]{5})', expected: '5' },
      { name: 'Two houses', input: 'nums = [2,1]', expr: 'sol.rob(new int[]{2,1})', expected: '2' },
      { name: 'All zeros', input: 'nums = [0,0,0]', expr: 'sol.rob(new int[]{0,0,0})', expected: '0' }
    ]
  },

  {
    id: 322,
    slug: 'coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    topics: ['array', 'dp'],
    companies: ['amazon', 'google', 'uber', 'bloomberg'],
    statement: `Given coin denominations \`coins\` and a total \`amount\`, return the fewest number of coins that add up to \`amount\`, or \`-1\` if it cannot be made.

You have an unlimited supply of every denomination.`,
    examples: [
      { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1.' },
      { input: 'coins = [2], amount = 3', output: '-1', explanation: '3 cannot be built from 2s.' },
      { input: 'coins = [1], amount = 0', output: '0', explanation: 'Zero coins make zero.' }
    ],
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    hints: [
      'Greedy (always take the biggest coin) fails — try coins = [1,3,4] and amount = 6.',
      'Define best[x] = fewest coins to make x, and build it upwards from 0.',
      'best[x] = 1 + min(best[x - coin]) over all coins that fit. Use a sentinel like amount+1 for "impossible".'
    ],
    approach: '**Unbounded knapsack, bottom-up.** `best[x] = 1 + min(best[x - coin])` for every coin that fits, with `best[0] = 0`. Fill the table from 1 to `amount`; anything still at the sentinel is unreachable.',
    complexity: { time: 'O(amount · coins)', space: 'O(amount)' },
    starterCode: `class Solution {
    public int coinChange(int[] coins, int amount) {
        // Write your solution here
        return -1;
    }
}`,
    solutionCode: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int impossible = amount + 1;
        int[] best = new int[amount + 1];
        Arrays.fill(best, impossible);
        best[0] = 0;

        for (int value = 1; value <= amount; value++) {
            for (int coin : coins) {
                if (coin <= value && best[value - coin] + 1 < best[value]) {
                    best[value] = best[value - coin] + 1;
                }
            }
        }
        return best[amount] == impossible ? -1 : best[amount];
    }
}`,
    tests: [
      { name: 'Example 1', input: 'coins = [1,2,5], amount = 11', expr: 'sol.coinChange(new int[]{1,2,5}, 11)', expected: '3' },
      { name: 'Impossible', input: 'coins = [2], amount = 3', expr: 'sol.coinChange(new int[]{2}, 3)', expected: '-1' },
      { name: 'Zero amount', input: 'coins = [1], amount = 0', expr: 'sol.coinChange(new int[]{1}, 0)', expected: '0' },
      { name: 'Greedy would fail', input: 'coins = [1,3,4], amount = 6', expr: 'sol.coinChange(new int[]{1,3,4}, 6)', expected: '2' }
    ]
  },

  {
    id: 300,
    slug: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    topics: ['array', 'dp', 'binary-search'],
    companies: ['microsoft', 'amazon', 'google'],
    statement: `Given an integer array \`nums\`, return the length of its longest **strictly increasing subsequence**.

A subsequence keeps the original order but may skip elements.`,
    examples: [
      { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4', explanation: 'One longest subsequence is [2,3,7,101].' },
      { input: 'nums = [0,1,0,3,2,3]', output: '4', explanation: '[0,1,2,3].' },
      { input: 'nums = [7,7,7,7]', output: '1', explanation: 'Strictly increasing, so equal values do not extend the run.' }
    ],
    constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
    hints: [
      'The O(n²) DP: length[i] = 1 + max(length[j]) over all j < i with nums[j] < nums[i].',
      'For O(n log n), keep a list `tails` where tails[k] is the smallest possible tail of an increasing subsequence of length k+1.',
      'For each value, binary search the first tail that is >= it and overwrite it; the answer is the size of `tails`.'
    ],
    approach: '**Patience sorting / tails array.** Maintain the smallest possible tail for every achievable length; each value either extends the list or replaces the first tail that is not smaller than it (found by binary search). The list length is the answer.',
    complexity: { time: 'O(n log n)', space: 'O(n)' },
    starterCode: `class Solution {
    public int lengthOfLIS(int[] nums) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] tails = new int[nums.length];
        int size = 0;

        for (int num : nums) {
            int low = 0;
            int high = size;
            while (low < high) {                 // first tail >= num
                int mid = (low + high) / 2;
                if (tails[mid] < num) low = mid + 1;
                else high = mid;
            }
            tails[low] = num;
            if (low == size) size++;
        }
        return size;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'nums = [10,9,2,5,3,7,101,18]', expr: 'sol.lengthOfLIS(new int[]{10,9,2,5,3,7,101,18})', expected: '4' },
      { name: 'Example 2', input: 'nums = [0,1,0,3,2,3]', expr: 'sol.lengthOfLIS(new int[]{0,1,0,3,2,3})', expected: '4' },
      { name: 'All equal', input: 'nums = [7,7,7,7]', expr: 'sol.lengthOfLIS(new int[]{7,7,7,7})', expected: '1' },
      { name: 'Strictly decreasing', input: 'nums = [5,4,3,2,1]', expr: 'sol.lengthOfLIS(new int[]{5,4,3,2,1})', expected: '1' }
    ]
  },

  {
    id: 56,
    slug: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    topics: ['array', 'intervals', 'sorting'],
    companies: ['amazon', 'meta', 'google', 'bloomberg'],
    statement: `Given an array of intervals \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals and return the non-overlapping intervals that cover the same ranges.

Intervals that merely touch, such as \`[1,4]\` and \`[4,5]\`, are considered overlapping.`,
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: '[1,3] and [2,6] overlap and merge into [1,6].' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: 'They touch at 4, so they merge.' }
    ],
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start_i <= end_i <= 10^4'],
    hints: [
      'Unsorted intervals make overlap hard to reason about. What ordering helps?',
      'Sort by start. Then any interval can only overlap the one you just emitted.',
      'If the current start is <= the last end, extend that last end with max(); otherwise append a new interval.'
    ],
    approach: '**Sort by start, then sweep.** After sorting, walk the list keeping the last merged interval: extend its end when the next start falls inside it, otherwise start a new interval. Sorting dominates the cost.',
    complexity: { time: 'O(n log n)', space: 'O(n)' },
    starterCode: `class Solution {
    public int[][] merge(int[][] intervals) {
        // Write your solution here
        return intervals;
    }
}`,
    solutionCode: `class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

        List<int[]> merged = new ArrayList<>();
        for (int[] interval : intervals) {
            if (!merged.isEmpty() && interval[0] <= merged.get(merged.size() - 1)[1]) {
                int[] last = merged.get(merged.size() - 1);
                last[1] = Math.max(last[1], interval[1]);
            } else {
                merged.add(new int[]{interval[0], interval[1]});
            }
        }
        return merged.toArray(new int[0][]);
    }
}`,
    tests: [
      {
        name: 'Example 1',
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        expr: 'Arrays.deepToString(sol.merge(new int[][]{{1,3},{2,6},{8,10},{15,18}}))',
        expected: '[[1, 6], [8, 10], [15, 18]]'
      },
      { name: 'Touching intervals', input: 'intervals = [[1,4],[4,5]]', expr: 'Arrays.deepToString(sol.merge(new int[][]{{1,4},{4,5}}))', expected: '[[1, 5]]' },
      { name: 'Unsorted input', input: 'intervals = [[5,6],[1,3],[2,4]]', expr: 'Arrays.deepToString(sol.merge(new int[][]{{5,6},{1,3},{2,4}}))', expected: '[[1, 4], [5, 6]]' },
      { name: 'Fully contained', input: 'intervals = [[1,10],[2,3]]', expr: 'Arrays.deepToString(sol.merge(new int[][]{{1,10},{2,3}}))', expected: '[[1, 10]]' }
    ]
  },

  {
    id: 78,
    slug: 'subsets',
    title: 'Subsets',
    difficulty: 'Medium',
    topics: ['array', 'backtracking', 'bit-manipulation'],
    companies: ['amazon', 'meta', 'bloomberg'],
    statement: `Given an array \`nums\` of **unique** integers, return all possible subsets (the power set).

The solution must not contain duplicate subsets; the order of the subsets does not matter.`,
    examples: [
      { input: 'nums = [1,2,3]', output: '[[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]', explanation: 'All 2³ = 8 subsets.' },
      { input: 'nums = [0]', output: '[[],[0]]', explanation: 'The empty subset and the whole array.' }
    ],
    constraints: ['1 <= nums.length <= 10', '-10 <= nums[i] <= 10', 'All values are unique'],
    hints: [
      'Every element is either in a subset or out of it — that is 2^n combinations.',
      'Use the backtracking skeleton: choose, explore, un-choose.',
      'Record the current partial subset at *every* node of the recursion, not only at the leaves.'
    ],
    approach: '**Backtracking (choose / explore / un-choose).** Recurse over the starting index, snapshotting the running list at every entry, adding each candidate, recursing, then removing it. Equivalent to enumerating the n-bit masks.',
    complexity: { time: 'O(n · 2^n)', space: 'O(n) recursion' },
    testHelpers: `    private static String canonicalSubsets(List<List<Integer>> subsets) {
        List<String> rows = new ArrayList<>();
        for (List<Integer> subset : subsets) {
            List<Integer> copy = new ArrayList<>(subset);
            Collections.sort(copy);
            rows.add(copy.toString());
        }
        Collections.sort(rows);
        return rows.toString();
    }`,
    starterCode: `class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        // Write your solution here
        return new ArrayList<>();
    }
}`,
    solutionCode: `class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] nums, int start, List<Integer> current, List<List<Integer>> result) {
        result.add(new ArrayList<>(current));          // every node is a valid subset
        for (int i = start; i < nums.length; i++) {
            current.add(nums[i]);                      // choose
            backtrack(nums, i + 1, current, result);   // explore
            current.remove(current.size() - 1);        // un-choose
        }
    }
}`,
    tests: [
      { name: 'Three elements', input: 'nums = [1,2,3]', expr: 'canonicalSubsets(sol.subsets(new int[]{1,2,3}))', expected: '[[1, 2, 3], [1, 2], [1, 3], [1], [2, 3], [2], [3], []]' },
      { name: 'Single element', input: 'nums = [0]', expr: 'canonicalSubsets(sol.subsets(new int[]{0}))', expected: '[[0], []]' },
      { name: 'Count is 2^n', input: 'nums = [1,2,3,4]', expr: 'sol.subsets(new int[]{1,2,3,4}).size()', expected: '16' },
      { name: 'Negative values', input: 'nums = [-1,2]', expr: 'canonicalSubsets(sol.subsets(new int[]{-1,2}))', expected: '[[-1, 2], [-1], [2], []]' }
    ]
  },

  {
    id: 46,
    slug: 'permutations',
    title: 'Permutations',
    difficulty: 'Medium',
    topics: ['array', 'backtracking'],
    companies: ['amazon', 'microsoft', 'linkedin'],
    statement: `Given an array \`nums\` of distinct integers, return all possible permutations of its elements. The permutations may be returned in any order.`,
    examples: [
      { input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]', explanation: 'All 3! = 6 orderings.' },
      { input: 'nums = [0,1]', output: '[[0,1],[1,0]]', explanation: 'Two orderings.' }
    ],
    constraints: ['1 <= nums.length <= 6', '-10 <= nums[i] <= 10', 'All values are distinct'],
    hints: [
      'At each depth you pick one of the values you have not used yet.',
      'Track used positions with a boolean array (or swap elements in place).',
      'When the current list reaches full length, snapshot it — that is a leaf of the recursion tree.'
    ],
    approach: '**Backtracking over unused elements.** At every depth, try each element that is not yet in the current permutation, recurse, then undo the choice. Leaves of the recursion tree — where the list is full — are the answers.',
    complexity: { time: 'O(n · n!)', space: 'O(n) recursion' },
    testHelpers: `    private static String canonicalPerms(List<List<Integer>> perms) {
        List<String> rows = new ArrayList<>();
        for (List<Integer> perm : perms) rows.add(perm.toString());
        Collections.sort(rows);
        return rows.toString();
    }`,
    starterCode: `class Solution {
    public List<List<Integer>> permute(int[] nums) {
        // Write your solution here
        return new ArrayList<>();
    }
}`,
    solutionCode: `class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, new boolean[nums.length], new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] nums, boolean[] used, List<Integer> current, List<List<Integer>> result) {
        if (current.size() == nums.length) {
            result.add(new ArrayList<>(current));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            current.add(nums[i]);
            backtrack(nums, used, current, result);
            current.remove(current.size() - 1);
            used[i] = false;
        }
    }
}`,
    tests: [
      {
        name: 'Three elements',
        input: 'nums = [1,2,3]',
        expr: 'canonicalPerms(sol.permute(new int[]{1,2,3}))',
        expected: '[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]'
      },
      { name: 'Two elements', input: 'nums = [0,1]', expr: 'canonicalPerms(sol.permute(new int[]{0,1}))', expected: '[[0, 1], [1, 0]]' },
      { name: 'Single element', input: 'nums = [1]', expr: 'canonicalPerms(sol.permute(new int[]{1}))', expected: '[[1]]' },
      { name: 'Count is n!', input: 'nums = [1,2,3,4]', expr: 'sol.permute(new int[]{1,2,3,4}).size()', expected: '24' }
    ]
  },

  {
    id: 22,
    slug: 'generate-parentheses',
    title: 'Generate Parentheses',
    difficulty: 'Medium',
    topics: ['string', 'backtracking'],
    companies: ['amazon', 'google', 'uber'],
    statement: `Given \`n\` pairs of parentheses, generate every combination of well-formed parentheses.`,
    examples: [
      { input: 'n = 3', output: '["((()))","(()())","(())()","()(())","()()()"]', explanation: 'The five valid arrangements of three pairs.' },
      { input: 'n = 1', output: '["()"]', explanation: 'Only one arrangement.' }
    ],
    constraints: ['1 <= n <= 8'],
    hints: [
      'Generating all 2^(2n) strings and filtering is wasteful — prune while building.',
      'You may add "(" while you have opens left, and ")" only while closes used < opens used.',
      'That invariant guarantees every string you produce is already balanced.'
    ],
    approach: '**Backtracking with a validity invariant.** Build the string character by character, allowed to open while `open < n` and to close while `close < open`. Pruning invalid prefixes means every leaf is a valid answer (a Catalan number of them).',
    complexity: { time: 'O(4^n / √n)', space: 'O(n) recursion' },
    testHelpers: `    private static String canonicalStrings(List<String> values) {
        List<String> copy = new ArrayList<>(values);
        Collections.sort(copy);
        return copy.toString();
    }`,
    starterCode: `class Solution {
    public List<String> generateParenthesis(int n) {
        // Write your solution here
        return new ArrayList<>();
    }
}`,
    solutionCode: `class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> result = new ArrayList<>();
        backtrack(new StringBuilder(), 0, 0, n, result);
        return result;
    }

    private void backtrack(StringBuilder current, int open, int close, int n, List<String> result) {
        if (current.length() == n * 2) {
            result.add(current.toString());
            return;
        }
        if (open < n) {
            current.append('(');
            backtrack(current, open + 1, close, n, result);
            current.deleteCharAt(current.length() - 1);
        }
        if (close < open) {
            current.append(')');
            backtrack(current, open, close + 1, n, result);
            current.deleteCharAt(current.length() - 1);
        }
    }
}`,
    tests: [
      { name: 'n = 3', input: 'n = 3', expr: 'canonicalStrings(sol.generateParenthesis(3))', expected: '[((())), (()()), (())(), ()(()), ()()()]' },
      { name: 'n = 1', input: 'n = 1', expr: 'canonicalStrings(sol.generateParenthesis(1))', expected: '[()]' },
      { name: 'n = 2', input: 'n = 2', expr: 'canonicalStrings(sol.generateParenthesis(2))', expected: '[(()), ()()]' },
      { name: 'Catalan count for n = 5', input: 'n = 5', expr: 'sol.generateParenthesis(5).size()', expected: '42' }
    ]
  },

  {
    id: 191,
    slug: 'number-of-1-bits',
    title: 'Number of 1 Bits',
    difficulty: 'Easy',
    topics: ['bit-manipulation'],
    companies: ['apple', 'amazon', 'microsoft'],
    statement: `Write a function that takes an integer and returns how many bits are set to \`1\` in its binary representation (its Hamming weight).`,
    examples: [
      { input: 'n = 11 (binary 1011)', output: '3', explanation: 'Three bits are set.' },
      { input: 'n = 128 (binary 10000000)', output: '1', explanation: 'One bit is set.' }
    ],
    constraints: ['The input is a 32-bit integer'],
    hints: [
      'You can test the lowest bit with `n & 1` and shift right — but watch out for the sign bit with negatives.',
      'Use the unsigned shift `>>>` so negative numbers terminate.',
      'A neat trick: `n & (n - 1)` clears the lowest set bit, so the loop runs once per set bit.'
    ],
    approach: '**Brian Kernighan\'s trick.** `n & (n - 1)` removes the lowest set bit, so counting how many times you can do that before reaching zero gives the number of set bits — one iteration per 1, not per bit.',
    complexity: { time: 'O(number of set bits)', space: 'O(1)' },
    starterCode: `class Solution {
    public int hammingWeight(int n) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int hammingWeight(int n) {
        int count = 0;
        while (n != 0) {
            n &= (n - 1);      // clear the lowest set bit
            count++;
        }
        return count;
    }
}`,
    tests: [
      { name: 'Binary 1011', input: 'n = 11', expr: 'sol.hammingWeight(11)', expected: '3' },
      { name: 'Single high bit', input: 'n = 128', expr: 'sol.hammingWeight(128)', expected: '1' },
      { name: 'Zero', input: 'n = 0', expr: 'sol.hammingWeight(0)', expected: '0' },
      { name: 'All bits set', input: 'n = -1 (0xFFFFFFFF)', expr: 'sol.hammingWeight(-1)', expected: '32' }
    ]
  },

  {
    id: 153,
    slug: 'find-minimum-in-rotated-sorted-array',
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'Medium',
    topics: ['array', 'binary-search'],
    companies: ['amazon', 'microsoft', 'facebook'],
    statement: `Suppose an array of length \`n\` sorted in ascending order is rotated between 1 and \`n\` times. For example, the sorted array \`[0,1,2,4,5,6,7]\` might become \`[4,5,6,7,0,1,2]\` after rotation.

Given the rotated sorted array \`nums\` of **unique** elements, return the minimum element.

You must write an algorithm that runs in O(log n) time.`,
    examples: [
      { input: 'nums = [3,4,5,1,2]', output: '1', explanation: 'The original array was [1,2,3,4,5] rotated 3 times.' },
      { input: 'nums = [4,5,6,7,0,1,2]', output: '0', explanation: 'The original array was [0,1,2,4,5,6,7] rotated 4 times.' },
      { input: 'nums = [11,13,15,17]', output: '11', explanation: 'The array was rotated 0 or n times and is still sorted.' }
    ],
    constraints: ['n == nums.length', '1 <= n <= 5000', '-5000 <= nums[i] <= 5000', 'All values are unique', 'nums is a rotated sorted array'],
    hints: [
      'If the array is not rotated, nums[0] is the answer.',
      'Compare the middle value with the right endpoint to decide which half still contains the pivot.',
      'When nums[mid] > nums[high], the minimum is strictly to the right of mid; otherwise it is at mid or to the left.'
    ],
    approach: '**Binary search on the rotation pivot.** While the window has more than one element, compare `nums[mid]` with `nums[high]`. A mid larger than high means the break is on the right (`low = mid + 1`); otherwise the minimum is in the left half including mid (`high = mid`). The loop ends on the unique minimum.',
    complexity: { time: 'O(log n)', space: 'O(1)' },
    starterCode: `class Solution {
    public int findMin(int[] nums) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int findMin(int[] nums) {
        int low = 0;
        int high = nums.length - 1;
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] > nums[high]) low = mid + 1;
            else high = mid;
        }
        return nums[low];
    }
}`,
    tests: [
      { name: 'Example 1', input: 'nums = [3,4,5,1,2]', expr: 'sol.findMin(new int[]{3,4,5,1,2})', expected: '1' },
      { name: 'Example 2', input: 'nums = [4,5,6,7,0,1,2]', expr: 'sol.findMin(new int[]{4,5,6,7,0,1,2})', expected: '0' },
      { name: 'Not rotated', input: 'nums = [11,13,15,17]', expr: 'sol.findMin(new int[]{11,13,15,17})', expected: '11' },
      { name: 'Single element', input: 'nums = [1]', expr: 'sol.findMin(new int[]{1})', expected: '1' },
      { name: 'Two elements rotated', input: 'nums = [2,1]', expr: 'sol.findMin(new int[]{2,1})', expected: '1' }
    ]
  },

  {
    id: 74,
    slug: 'search-a-2d-matrix',
    title: 'Search a 2D Matrix',
    difficulty: 'Medium',
    topics: ['array', 'binary-search', 'matrix'],
    companies: ['amazon', 'microsoft', 'apple'],
    statement: `You are given an \`m x n\` integer matrix \`matrix\` with the following two properties:

- Each row is sorted in non-decreasing order.
- The first integer of each row is greater than the last integer of the previous row.

Given an integer \`target\`, return \`true\` if \`target\` is in \`matrix\` or \`false\` otherwise.

You must write a solution in O(log(m * n)) time complexity.`,
    examples: [
      { input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3', output: 'true', explanation: '3 is present in the first row.' },
      { input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13', output: 'false', explanation: '13 is not in the matrix.' }
    ],
    constraints: ['m == matrix.length', 'n == matrix[i].length', '1 <= m, n <= 100', '-10^4 <= matrix[i][j], target <= 10^4'],
    hints: [
      'Because rows are sorted and row starts increase, the whole matrix is one sorted sequence of length m*n.',
      'Binary search on the flattened index, mapping mid → (mid / n, mid % n).',
      'Compare matrix[r][c] with target and shrink the window exactly like 1-D binary search.'
    ],
    approach: '**Treat the matrix as a sorted 1-D array.** Binary search indices in `[0, m*n)`. Map index `mid` to row `mid / n` and column `mid % n`, then move left or right based on the comparison with `target`.',
    complexity: { time: 'O(log(m · n))', space: 'O(1)' },
    starterCode: `class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        // Write your solution here
        return false;
    }
}`,
    solutionCode: `class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int m = matrix.length;
        int n = matrix[0].length;
        int low = 0;
        int high = m * n - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            int value = matrix[mid / n][mid % n];
            if (value == target) return true;
            if (value < target) low = mid + 1;
            else high = mid - 1;
        }
        return false;
    }
}`,
    tests: [
      { name: 'Found', input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3', expr: 'sol.searchMatrix(new int[][]{{1,3,5,7},{10,11,16,20},{23,30,34,60}}, 3)', expected: 'true' },
      { name: 'Missing', input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13', expr: 'sol.searchMatrix(new int[][]{{1,3,5,7},{10,11,16,20},{23,30,34,60}}, 13)', expected: 'false' },
      { name: 'Single cell hit', input: 'matrix = [[1]], target = 1', expr: 'sol.searchMatrix(new int[][]{{1}}, 1)', expected: 'true' },
      { name: 'First element', input: 'matrix = [[1,3],[5,7]], target = 1', expr: 'sol.searchMatrix(new int[][]{{1,3},{5,7}}, 1)', expected: 'true' },
      { name: 'Last element', input: 'matrix = [[1,3],[5,7]], target = 7', expr: 'sol.searchMatrix(new int[][]{{1,3},{5,7}}, 7)', expected: 'true' }
    ]
  },

  {
    id: 875,
    slug: 'koko-eating-bananas',
    title: 'Koko Eating Bananas',
    difficulty: 'Medium',
    topics: ['array', 'binary-search'],
    companies: ['google', 'amazon', 'facebook'],
    statement: `Koko loves to eat bananas. There are \`n\` piles of bananas; the \`i\`-th pile has \`piles[i]\` bananas. The guards return in \`h\` hours.

Koko can decide her bananas-per-hour eating speed \`k\`. Each hour she chooses some pile and eats \`min(piles[i], k)\` bananas from it. If the pile has fewer than \`k\` bananas she still uses the full hour and does not start another pile that hour.

Return the **minimum** integer \`k\` such that she can eat all the bananas within \`h\` hours.`,
    examples: [
      { input: 'piles = [3,6,7,11], h = 8', output: '4', explanation: 'Speed 4 finishes every pile within 8 hours.' },
      { input: 'piles = [30,11,23,4,20], h = 5', output: '30', explanation: 'She needs one hour per pile at least, so k must cover the largest pile.' },
      { input: 'piles = [30,11,23,4,20], h = 6', output: '23', explanation: 'A slightly slower speed still fits in 6 hours.' }
    ],
    constraints: ['1 <= piles.length <= 10^4', 'piles.length <= h <= 10^9', '1 <= piles[i] <= 10^9'],
    hints: [
      'Feasibility is monotonic: if speed k works, every speed > k also works.',
      'Binary search k between 1 and max(piles).',
      'Hours needed for a pile is ceil(pile / k); sum them and compare with h.'
    ],
    approach: '**Binary search the eating speed.** Low = 1, high = max pile. For a candidate `k`, sum `ceil(pile / k)` over all piles; if the total hours is ≤ `h`, try slower speeds, else try faster. The leftmost feasible `k` is the answer.',
    complexity: { time: 'O(n · log M) where M = max(piles)', space: 'O(1)' },
    starterCode: `class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int low = 1;
        int high = 0;
        for (int pile : piles) high = Math.max(high, pile);
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (canFinish(piles, h, mid)) high = mid;
            else low = mid + 1;
        }
        return low;
    }

    private boolean canFinish(int[] piles, int h, int k) {
        long hours = 0;
        for (int pile : piles) {
            hours += (pile + (long) k - 1) / k;
            if (hours > h) return false;
        }
        return hours <= h;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'piles = [3,6,7,11], h = 8', expr: 'sol.minEatingSpeed(new int[]{3,6,7,11}, 8)', expected: '4' },
      { name: 'Example 2', input: 'piles = [30,11,23,4,20], h = 5', expr: 'sol.minEatingSpeed(new int[]{30,11,23,4,20}, 5)', expected: '30' },
      { name: 'Example 3', input: 'piles = [30,11,23,4,20], h = 6', expr: 'sol.minEatingSpeed(new int[]{30,11,23,4,20}, 6)', expected: '23' },
      { name: 'Single pile', input: 'piles = [100], h = 2', expr: 'sol.minEatingSpeed(new int[]{100}, 2)', expected: '50' },
      { name: 'Exact hours = piles', input: 'piles = [1,1,1,999999999], h = 10', expr: 'sol.minEatingSpeed(new int[]{1,1,1,999999999}, 10)', expected: '142857143' }
    ]
  },

  {
    id: 39,
    slug: 'combination-sum',
    title: 'Combination Sum',
    difficulty: 'Medium',
    topics: ['array', 'backtracking'],
    companies: ['amazon', 'airbnb', 'microsoft'],
    statement: `Given an array of **distinct** integers \`candidates\` and a target integer \`target\`, return a list of all **unique combinations** of \`candidates\` where the chosen numbers sum to \`target\`.

You may use the same number from \`candidates\` an **unlimited** number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.

The combinations may be returned in any order.`,
    examples: [
      { input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3],[7]]', explanation: '2+2+3 and 7 both sum to 7.' },
      { input: 'candidates = [2,3,5], target = 8', output: '[[2,2,2,2],[2,3,3],[3,5]]', explanation: 'Three distinct multisets sum to 8.' },
      { input: 'candidates = [2], target = 1', output: '[]', explanation: 'Nothing sums to 1.' }
    ],
    constraints: ['1 <= candidates.length <= 30', '2 <= candidates[i] <= 40', 'All elements of candidates are distinct', '1 <= target <= 40'],
    hints: [
      'Sort first so you can prune when the remaining target is smaller than the next candidate.',
      'When you pick candidates[i], recurse with the same i (reuse allowed) and reduced target.',
      'Advance the start index when you skip a candidate so combinations stay non-decreasing and unique.'
    ],
    approach: '**Backtracking with reuse.** Sort the array, then DFS from a start index: add a candidate, recurse with the same index (unlimited reuse) and `target - candidate`, then pop. Moving the start index forward when skipping keeps combinations sorted and duplicate-free.',
    complexity: { time: 'O(n^{T/m}) roughly, T = target, m = min candidate', space: 'O(T/m) recursion' },
    testHelpers: `    private static String canonicalCombos(List<List<Integer>> combos) {
        List<String> rows = new ArrayList<>();
        for (List<Integer> combo : combos) {
            List<Integer> copy = new ArrayList<>(combo);
            Collections.sort(copy);
            rows.add(copy.toString());
        }
        Collections.sort(rows);
        return rows.toString();
    }`,
    starterCode: `class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        // Write your solution here
        return new ArrayList<>();
    }
}`,
    solutionCode: `class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<List<Integer>> result = new ArrayList<>();
        backtrack(candidates, target, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] candidates, int remain, int start, List<Integer> path, List<List<Integer>> result) {
        if (remain == 0) {
            result.add(new ArrayList<>(path));
            return;
        }
        for (int i = start; i < candidates.length; i++) {
            if (candidates[i] > remain) break;
            path.add(candidates[i]);
            backtrack(candidates, remain - candidates[i], i, path, result);
            path.remove(path.size() - 1);
        }
    }
}`,
    tests: [
      { name: 'Example 1', input: 'candidates = [2,3,6,7], target = 7', expr: 'canonicalCombos(sol.combinationSum(new int[]{2,3,6,7}, 7))', expected: '[[2, 2, 3], [7]]' },
      { name: 'Example 2', input: 'candidates = [2,3,5], target = 8', expr: 'canonicalCombos(sol.combinationSum(new int[]{2,3,5}, 8))', expected: '[[2, 2, 2, 2], [2, 3, 3], [3, 5]]' },
      { name: 'Impossible', input: 'candidates = [2], target = 1', expr: 'canonicalCombos(sol.combinationSum(new int[]{2}, 1))', expected: '[]' },
      { name: 'Single combination', input: 'candidates = [3,5], target = 3', expr: 'canonicalCombos(sol.combinationSum(new int[]{3,5}, 3))', expected: '[[3]]' },
      { name: 'Only repeats', input: 'candidates = [2,4], target = 6', expr: 'canonicalCombos(sol.combinationSum(new int[]{2,4}, 6))', expected: '[[2, 2, 2], [2, 4]]' }
    ]
  },

  {
    id: 79,
    slug: 'word-search',
    title: 'Word Search',
    difficulty: 'Medium',
    topics: ['array', 'backtracking', 'matrix'],
    companies: ['amazon', 'microsoft', 'bloomberg'],
    statement: `Given an \`m x n\` grid of characters \`board\` and a string \`word\`, return \`true\` if \`word\` exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.`,
    examples: [
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true', explanation: 'A path spells ABCCED.' },
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"', output: 'true', explanation: 'S-E-E exists.' },
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"', output: 'false', explanation: 'Reusing B is not allowed.' }
    ],
    constraints: ['m == board.length', 'n == board[i].length', '1 <= m, n <= 6', '1 <= word.length <= 15', 'board and word consist of only lowercase and uppercase English letters'],
    hints: [
      'Try DFS from every cell that matches word[0].',
      'Mark a cell as visited while exploring its neighbors, then unmark on backtrack.',
      'Stop early once the full word is matched.'
    ],
    approach: '**DFS / backtracking on the grid.** From every starting cell matching the first letter, explore the four neighbors for the next character. Temporarily mark cells visited (e.g. overwrite the char) and restore them after the recursive call so other paths can reuse the cell.',
    complexity: { time: 'O(m · n · 4^L) where L = word length', space: 'O(L) recursion' },
    starterCode: `class Solution {
    public boolean exist(char[][] board, String word) {
        // Write your solution here
        return false;
    }
}`,
    solutionCode: `class Solution {
    public boolean exist(char[][] board, String word) {
        int m = board.length;
        int n = board[0].length;
        char[] letters = word.toCharArray();
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (dfs(board, letters, 0, r, c)) return true;
            }
        }
        return false;
    }

    private boolean dfs(char[][] board, char[] word, int index, int r, int c) {
        if (index == word.length) return true;
        if (r < 0 || c < 0 || r >= board.length || c >= board[0].length) return false;
        if (board[r][c] != word[index]) return false;

        char saved = board[r][c];
        board[r][c] = '#';
        boolean found = dfs(board, word, index + 1, r + 1, c)
                || dfs(board, word, index + 1, r - 1, c)
                || dfs(board, word, index + 1, r, c + 1)
                || dfs(board, word, index + 1, r, c - 1);
        board[r][c] = saved;
        return found;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'board = ABCE/SFCS/ADEE, word = ABCCED', expr: 'sol.exist(new char[][]{{\'A\',\'B\',\'C\',\'E\'},{\'S\',\'F\',\'C\',\'S\'},{\'A\',\'D\',\'E\',\'E\'}}, "ABCCED")', expected: 'true' },
      { name: 'Example 2', input: 'board = ABCE/SFCS/ADEE, word = SEE', expr: 'sol.exist(new char[][]{{\'A\',\'B\',\'C\',\'E\'},{\'S\',\'F\',\'C\',\'S\'},{\'A\',\'D\',\'E\',\'E\'}}, "SEE")', expected: 'true' },
      { name: 'Example 3', input: 'board = ABCE/SFCS/ADEE, word = ABCB', expr: 'sol.exist(new char[][]{{\'A\',\'B\',\'C\',\'E\'},{\'S\',\'F\',\'C\',\'S\'},{\'A\',\'D\',\'E\',\'E\'}}, "ABCB")', expected: 'false' },
      { name: 'Single cell', input: 'board = [[A]], word = A', expr: 'sol.exist(new char[][]{{\'A\'}}, "A")', expected: 'true' },
      { name: 'Diagonal not allowed', input: 'board = [[A,B],[C,D]], word = ABCD', expr: 'sol.exist(new char[][]{{\'A\',\'B\'},{\'C\',\'D\'}}, "ABCD")', expected: 'false' }
    ]
  },

  {
    id: 213,
    slug: 'house-robber-ii',
    title: 'House Robber II',
    difficulty: 'Medium',
    topics: ['array', 'dp'],
    companies: ['amazon', 'google', 'microsoft'],
    statement: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money. All houses are arranged in a **circle**, so the first house is the neighbor of the last one. Adjacent houses have a security system connected, and it will automatically contact the police if two adjacent houses are broken into on the same night.

Given an integer array \`nums\` representing the amount of money in each house, return the maximum amount of money you can rob tonight without alerting the police.`,
    examples: [
      { input: 'nums = [2,3,2]', output: '3', explanation: 'You cannot rob house 1 (money = 2) and then house 3 (money = 2) because they are adjacent in the circle.' },
      { input: 'nums = [1,2,3,1]', output: '4', explanation: 'Rob house 1 (1) and then house 3 (3).' },
      { input: 'nums = [1,2,3]', output: '3', explanation: 'Rob the last house alone.' }
    ],
    constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 1000'],
    hints: [
      'Because of the circle, house 0 and house n-1 cannot both be robbed.',
      'Solve the linear House Robber problem twice: once on [0..n-2] and once on [1..n-1].',
      'Take the max of those two answers (and handle n = 1 separately).'
    ],
    approach: '**Reduce to two linear House Robber runs.** The circular constraint means you either skip the first house or skip the last. Run the classic rolling DP on range `[0, n-2]` and on `[1, n-1]`, then return the larger result.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    starterCode: `class Solution {
    public int rob(int[] nums) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int rob(int[] nums) {
        int n = nums.length;
        if (n == 1) return nums[0];
        return Math.max(robLinear(nums, 0, n - 2), robLinear(nums, 1, n - 1));
    }

    private int robLinear(int[] nums, int start, int end) {
        int skip = 0;
        int take = 0;
        for (int i = start; i <= end; i++) {
            int robHere = skip + nums[i];
            skip = Math.max(skip, take);
            take = robHere;
        }
        return Math.max(skip, take);
    }
}`,
    tests: [
      { name: 'Example 1', input: 'nums = [2,3,2]', expr: 'sol.rob(new int[]{2,3,2})', expected: '3' },
      { name: 'Example 2', input: 'nums = [1,2,3,1]', expr: 'sol.rob(new int[]{1,2,3,1})', expected: '4' },
      { name: 'Example 3', input: 'nums = [1,2,3]', expr: 'sol.rob(new int[]{1,2,3})', expected: '3' },
      { name: 'Single house', input: 'nums = [5]', expr: 'sol.rob(new int[]{5})', expected: '5' },
      { name: 'Two houses', input: 'nums = [1,2]', expr: 'sol.rob(new int[]{1,2})', expected: '2' }
    ]
  },

  {
    id: 1143,
    slug: 'longest-common-subsequence',
    title: 'Longest Common Subsequence',
    difficulty: 'Medium',
    topics: ['string', 'dp'],
    companies: ['amazon', 'google', 'microsoft'],
    statement: `Given two strings \`text1\` and \`text2\`, return the length of their longest **common subsequence**. If there is no common subsequence, return 0.

A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.

A common subsequence of two strings is a subsequence that is common to both strings.`,
    examples: [
      { input: 'text1 = "abcde", text2 = "ace"', output: '3', explanation: 'The LCS is "ace".' },
      { input: 'text1 = "abc", text2 = "abc"', output: '3', explanation: 'The entire string is common.' },
      { input: 'text1 = "abc", text2 = "def"', output: '0', explanation: 'No letters in common.' }
    ],
    constraints: ['1 <= text1.length, text2.length <= 1000', 'text1 and text2 consist of only lowercase English characters'],
    hints: [
      'Define dp[i][j] as the LCS length of the prefixes text1[0..i) and text2[0..j).',
      'If the ending characters match, dp[i][j] = dp[i-1][j-1] + 1; otherwise take the max of skipping either side.',
      'You can keep only the previous row if you want O(min(m,n)) space.'
    ],
    approach: '**Classic 2-D DP.** `dp[i][j]` is the LCS of the first `i` chars of `text1` and first `j` of `text2`. Equal characters extend the diagonal; unequal characters take `max` of left or up. Answer is `dp[m][n]`.',
    complexity: { time: 'O(m · n)', space: 'O(m · n)' },
    starterCode: `class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length();
        int n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[m][n];
    }
}`,
    tests: [
      { name: 'Example 1', input: 'text1 = "abcde", text2 = "ace"', expr: 'sol.longestCommonSubsequence("abcde", "ace")', expected: '3' },
      { name: 'Identical', input: 'text1 = "abc", text2 = "abc"', expr: 'sol.longestCommonSubsequence("abc", "abc")', expected: '3' },
      { name: 'No overlap', input: 'text1 = "abc", text2 = "def"', expr: 'sol.longestCommonSubsequence("abc", "def")', expected: '0' },
      { name: 'Single char', input: 'text1 = "a", text2 = "a"', expr: 'sol.longestCommonSubsequence("a", "a")', expected: '1' },
      { name: 'Interleaved', input: 'text1 = "bsbininm", text2 = "jmjkbkjkv"', expr: 'sol.longestCommonSubsequence("bsbininm", "jmjkbkjkv")', expected: '1' }
    ]
  },

  {
    id: 62,
    slug: 'unique-paths',
    title: 'Unique Paths',
    difficulty: 'Medium',
    topics: ['math', 'dp', 'combinatorics'],
    companies: ['amazon', 'google', 'bloomberg'],
    statement: `There is a robot on an \`m x n\` grid. The robot starts at the top-left corner \`(0, 0)\` and wants to reach the bottom-right corner \`(m - 1, n - 1)\`. The robot can only move either down or right at any point in time.

Given the two integers \`m\` and \`n\`, return the number of possible unique paths that the robot can take to reach the bottom-right corner.`,
    examples: [
      { input: 'm = 3, n = 7', output: '28', explanation: 'There are 28 distinct down/right sequences.' },
      { input: 'm = 3, n = 2', output: '3', explanation: 'Right-Down-Down, Down-Right-Down, Down-Down-Right.' }
    ],
    constraints: ['1 <= m, n <= 100', 'The answer is guaranteed to fit in a 32-bit integer'],
    hints: [
      'paths[r][c] = paths[r-1][c] + paths[r][c-1].',
      'The first row and first column are all 1s — only one way to walk along an edge.',
      'A 1-D rolling array of width n is enough.'
    ],
    approach: '**Grid DP.** Every cell is reachable only from above or from the left, so `dp[r][c] = dp[r-1][c] + dp[r][c-1]` with the top row and left column initialized to 1. The bottom-right cell holds the answer.',
    complexity: { time: 'O(m · n)', space: 'O(n)' },
    starterCode: `class Solution {
    public int uniquePaths(int m, int n) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int uniquePaths(int m, int n) {
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        for (int r = 1; r < m; r++) {
            for (int c = 1; c < n; c++) {
                dp[c] += dp[c - 1];
            }
        }
        return dp[n - 1];
    }
}`,
    tests: [
      { name: 'Example 1', input: 'm = 3, n = 7', expr: 'sol.uniquePaths(3, 7)', expected: '28' },
      { name: 'Example 2', input: 'm = 3, n = 2', expr: 'sol.uniquePaths(3, 2)', expected: '3' },
      { name: '1x1', input: 'm = 1, n = 1', expr: 'sol.uniquePaths(1, 1)', expected: '1' },
      { name: 'Single row', input: 'm = 1, n = 10', expr: 'sol.uniquePaths(1, 10)', expected: '1' },
      { name: 'Square', input: 'm = 3, n = 3', expr: 'sol.uniquePaths(3, 3)', expected: '6' }
    ]
  },

  {
    id: 55,
    slug: 'jump-game',
    title: 'Jump Game',
    difficulty: 'Medium',
    topics: ['array', 'greedy', 'dp'],
    companies: ['amazon', 'google', 'microsoft'],
    statement: `You are given an integer array \`nums\`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.

Return \`true\` if you can reach the last index, or \`false\` otherwise.`,
    examples: [
      { input: 'nums = [2,3,1,1,4]', output: 'true', explanation: 'Jump 1 step from index 0 to 1, then 3 steps to the last index.' },
      { input: 'nums = [3,2,1,0,4]', output: 'false', explanation: 'You will always land at index 3, which is a 0, and cannot go further.' }
    ],
    constraints: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 10^5'],
    hints: [
      'Track the farthest index reachable so far while scanning left to right.',
      'If the current index is beyond that farthest reach, you are stuck.',
      'Success means the farthest reach is at least the last index.'
    ],
    approach: '**Greedy farthest reach.** Sweep left to right, maintaining `farthest = max(farthest, i + nums[i])`. If you ever stand past `farthest`, return false. If `farthest` covers the end, return true.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    starterCode: `class Solution {
    public boolean canJump(int[] nums) {
        // Write your solution here
        return false;
    }
}`,
    solutionCode: `class Solution {
    public boolean canJump(int[] nums) {
        int farthest = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > farthest) return false;
            farthest = Math.max(farthest, i + nums[i]);
            if (farthest >= nums.length - 1) return true;
        }
        return true;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'nums = [2,3,1,1,4]', expr: 'sol.canJump(new int[]{2,3,1,1,4})', expected: 'true' },
      { name: 'Example 2', input: 'nums = [3,2,1,0,4]', expr: 'sol.canJump(new int[]{3,2,1,0,4})', expected: 'false' },
      { name: 'Single element', input: 'nums = [0]', expr: 'sol.canJump(new int[]{0})', expected: 'true' },
      { name: 'All zeros except start', input: 'nums = [1,0,0]', expr: 'sol.canJump(new int[]{1,0,0})', expected: 'false' },
      { name: 'Long jumps', input: 'nums = [2,0,0]', expr: 'sol.canJump(new int[]{2,0,0})', expected: 'true' }
    ]
  },

  {
    id: 45,
    slug: 'jump-game-ii',
    title: 'Jump Game II',
    difficulty: 'Medium',
    topics: ['array', 'greedy', 'dp'],
    companies: ['amazon', 'google', 'microsoft'],
    statement: `You are given a 0-indexed array of integers \`nums\` of length \`n\`. You are initially positioned at \`nums[0]\`.

Each element \`nums[i]\` represents the maximum length of a forward jump from index \`i\`. In other words, if you are at \`nums[i]\`, you can jump to any \`nums[i + j]\` where \`0 <= j <= nums[i]\` and \`i + j < n\`.

Return the minimum number of jumps to reach \`nums[n - 1]\`. The test cases are generated such that you can reach \`nums[n - 1]\`.`,
    examples: [
      { input: 'nums = [2,3,1,1,4]', output: '2', explanation: 'The minimum jumps is jump to index 1, then to the last index.' },
      { input: 'nums = [2,3,0,1,4]', output: '2', explanation: 'Same two-jump path works.' }
    ],
    constraints: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 1000', 'It is guaranteed you can reach nums[n - 1]'],
    hints: [
      'Think in BFS layers: the positions reachable with exactly k jumps form a contiguous window.',
      'While scanning the current window, track the farthest index the next jump can reach.',
      'When the window ends, increment the jump count and open the next window up to that farthest index.'
    ],
    approach: '**Greedy BFS on the array.** Maintain the end of the current jump range and the farthest index reachable in the next jump. When the scan hits the current end, take one jump and extend the end to that farthest. Count jumps until the end of the array.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    starterCode: `class Solution {
    public int jump(int[] nums) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int jump(int[] nums) {
        int jumps = 0;
        int end = 0;
        int farthest = 0;
        for (int i = 0; i < nums.length - 1; i++) {
            farthest = Math.max(farthest, i + nums[i]);
            if (i == end) {
                jumps++;
                end = farthest;
            }
        }
        return jumps;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'nums = [2,3,1,1,4]', expr: 'sol.jump(new int[]{2,3,1,1,4})', expected: '2' },
      { name: 'Example 2', input: 'nums = [2,3,0,1,4]', expr: 'sol.jump(new int[]{2,3,0,1,4})', expected: '2' },
      { name: 'Already there', input: 'nums = [0]', expr: 'sol.jump(new int[]{0})', expected: '0' },
      { name: 'One jump', input: 'nums = [3,1,1,1]', expr: 'sol.jump(new int[]{3,1,1,1})', expected: '1' },
      { name: 'Many small jumps', input: 'nums = [1,1,1,1]', expr: 'sol.jump(new int[]{1,1,1,1})', expected: '3' }
    ]
  },

  {
    id: 435,
    slug: 'non-overlapping-intervals',
    title: 'Non-overlapping Intervals',
    difficulty: 'Medium',
    topics: ['array', 'greedy', 'sorting'],
    companies: ['amazon', 'facebook', 'microsoft'],
    statement: `Given an array of intervals \`intervals\` where \`intervals[i] = [starti, endi]\`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.

Two intervals are considered overlapping if they share any point — intervals that only touch at an endpoint are **not** overlapping.`,
    examples: [
      { input: 'intervals = [[1,2],[2,3],[3,4],[1,3]]', output: '1', explanation: 'Remove [1,3] so the rest do not overlap.' },
      { input: 'intervals = [[1,2],[1,2],[1,2]]', output: '2', explanation: 'Keep one copy and remove the other two.' },
      { input: 'intervals = [[1,2],[2,3]]', output: '0', explanation: 'They only touch at 2.' }
    ],
    constraints: ['1 <= intervals.length <= 10^5', 'intervals[i].length == 2', '-5 * 10^4 <= starti < endi <= 5 * 10^4'],
    hints: [
      'Sort by end time — earlier-finishing intervals leave more room for the rest.',
      'Greedily keep an interval if it starts at or after the last kept end; otherwise remove it.',
      'The answer is the count of removals, not the kept intervals.'
    ],
    approach: '**Sort by end, then greedy keep.** Sort intervals by ascending end time. Walk left to right, keeping an interval when `start >= lastEnd` and updating `lastEnd`; otherwise count a removal. Finishing earlier maximizes room for later intervals.',
    complexity: { time: 'O(n log n)', space: 'O(1) aside from sort' },
    starterCode: `class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
        int removals = 0;
        int lastEnd = intervals[0][1];
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] < lastEnd) {
                removals++;
            } else {
                lastEnd = intervals[i][1];
            }
        }
        return removals;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'intervals = [[1,2],[2,3],[3,4],[1,3]]', expr: 'sol.eraseOverlapIntervals(new int[][]{{1,2},{2,3},{3,4},{1,3}})', expected: '1' },
      { name: 'Example 2', input: 'intervals = [[1,2],[1,2],[1,2]]', expr: 'sol.eraseOverlapIntervals(new int[][]{{1,2},{1,2},{1,2}})', expected: '2' },
      { name: 'Touching only', input: 'intervals = [[1,2],[2,3]]', expr: 'sol.eraseOverlapIntervals(new int[][]{{1,2},{2,3}})', expected: '0' },
      { name: 'Single interval', input: 'intervals = [[1,2]]', expr: 'sol.eraseOverlapIntervals(new int[][]{{1,2}})', expected: '0' },
      { name: 'Nested', input: 'intervals = [[1,100],[11,22],[1,11],[2,12]]', expr: 'sol.eraseOverlapIntervals(new int[][]{{1,100},{11,22},{1,11},{2,12}})', expected: '2' }
    ]
  },

  {
    id: 338,
    slug: 'counting-bits',
    title: 'Counting Bits',
    difficulty: 'Easy',
    topics: ['dynamic-programming', 'bit-manipulation'],
    companies: ['amazon', 'apple', 'microsoft'],
    statement: `Given an integer \`n\`, return an array \`ans\` of length \`n + 1\` such that for each \`i\` (\`0 <= i <= n\`), \`ans[i]\` is the number of \`1\`s in the binary representation of \`i\`.`,
    examples: [
      { input: 'n = 2', output: '[0,1,1]', explanation: '0 has zero 1-bits, 1 has one, 2 (10) has one.' },
      { input: 'n = 5', output: '[0,1,1,2,1,2]', explanation: 'Counts for 0 through 5.' }
    ],
    constraints: ['0 <= n <= 10^5'],
    hints: [
      'ans[i] = ans[i >> 1] + (i & 1): drop the lowest bit and add whether it was set.',
      'Equivalently ans[i] = ans[i & (i - 1)] + 1 for i > 0.',
      'Either recurrence fills the array in linear time without counting bits from scratch each time.'
    ],
    approach: '**DP on bit shifts.** `ans[i] = ans[i >> 1] + (i & 1)` reuses the answer for `i` without its lowest bit and adds 0/1 for that bit. Fill from 0 to `n` in one pass.',
    complexity: { time: 'O(n)', space: 'O(n)' },
    starterCode: `class Solution {
    public int[] countBits(int n) {
        // Write your solution here
        return new int[0];
    }
}`,
    solutionCode: `class Solution {
    public int[] countBits(int n) {
        int[] ans = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            ans[i] = ans[i >> 1] + (i & 1);
        }
        return ans;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'n = 2', expr: 'Arrays.toString(sol.countBits(2))', expected: '[0, 1, 1]' },
      { name: 'Example 2', input: 'n = 5', expr: 'Arrays.toString(sol.countBits(5))', expected: '[0, 1, 1, 2, 1, 2]' },
      { name: 'Zero', input: 'n = 0', expr: 'Arrays.toString(sol.countBits(0))', expected: '[0]' },
      { name: 'n = 1', input: 'n = 1', expr: 'Arrays.toString(sol.countBits(1))', expected: '[0, 1]' },
      { name: 'n = 8', input: 'n = 8', expr: 'Arrays.toString(sol.countBits(8))', expected: '[0, 1, 1, 2, 1, 2, 2, 3, 1]' }
    ]
  },

  {
    id: 268,
    slug: 'missing-number',
    title: 'Missing Number',
    difficulty: 'Easy',
    topics: ['array', 'hash-table', 'math', 'bit-manipulation'],
    companies: ['amazon', 'microsoft', 'apple'],
    statement: `Given an array \`nums\` containing \`n\` distinct numbers in the range \`[0, n]\`, return the only number in the range that is missing from the array.`,
    examples: [
      { input: 'nums = [3,0,1]', output: '2', explanation: 'n = 3 so the range is [0,3]; 2 is missing.' },
      { input: 'nums = [0,1]', output: '2', explanation: 'n = 2 so the range is [0,2]; 2 is missing.' },
      { input: 'nums = [9,6,4,2,3,5,7,0,1]', output: '8', explanation: '8 is the only missing value in [0,9].' }
    ],
    constraints: ['n == nums.length', '1 <= n <= 10^4', '0 <= nums[i] <= n', 'All numbers of nums are unique'],
    hints: [
      'The sum of 0..n is n*(n+1)/2; subtract the array sum.',
      'XOR of all indices and values also cancels pairs and leaves the missing number.',
      'Either approach is O(n) time and O(1) extra space.'
    ],
    approach: '**XOR cancellation.** XOR every index `0..n` with every `nums[i]`. Paired values cancel (`x ^ x = 0`), so the result is the missing number. Equivalent to comparing the closed-form sum `n(n+1)/2` against the array sum.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    starterCode: `class Solution {
    public int missingNumber(int[] nums) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int missingNumber(int[] nums) {
        int missing = nums.length;
        for (int i = 0; i < nums.length; i++) {
            missing ^= i ^ nums[i];
        }
        return missing;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'nums = [3,0,1]', expr: 'sol.missingNumber(new int[]{3,0,1})', expected: '2' },
      { name: 'Example 2', input: 'nums = [0,1]', expr: 'sol.missingNumber(new int[]{0,1})', expected: '2' },
      { name: 'Example 3', input: 'nums = [9,6,4,2,3,5,7,0,1]', expr: 'sol.missingNumber(new int[]{9,6,4,2,3,5,7,0,1})', expected: '8' },
      { name: 'Missing zero', input: 'nums = [1]', expr: 'sol.missingNumber(new int[]{1})', expected: '0' },
      { name: 'Missing last', input: 'nums = [0]', expr: 'sol.missingNumber(new int[]{0})', expected: '1' }
    ]
  }
];

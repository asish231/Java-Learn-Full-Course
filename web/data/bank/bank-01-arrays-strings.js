/**
 * bank-01-arrays-strings.js — the array / string / hashing core.
 *
 * Shape is documented in bank-00-reference.js.
 * Verify with:  node tools/verify-bank.js --file bank-01-arrays-strings.js
 */
module.exports = [
  {
    id: 121,
    slug: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    topics: ['array', 'dp'],
    companies: ['amazon', 'bloomberg', 'meta', 'microsoft'],
    statement: `You are given an array \`prices\` where \`prices[i]\` is the price of a stock on day \`i\`.

You may choose a single day to buy and a **later** day to sell. Return the maximum profit you can make. If no profit is possible, return \`0\`.`,
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price 1) and sell on day 5 (price 6): profit 6 - 1 = 5.' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'Prices only fall, so no transaction is profitable.' }
    ],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    hints: [
      'You never need to look back: while scanning, what is the only thing about the past that matters?',
      'Track the cheapest price seen so far.',
      'At every day, the best profit ending today is `price - cheapestSoFar`. Keep the maximum of those.'
    ],
    approach: '**One pass, running minimum.** Keep the lowest price seen so far; at each day the best sale today is `price - min`. Update both in a single scan — no need for nested loops or a DP table.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    starterCode: `class Solution {
    public int maxProfit(int[] prices) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int maxProfit(int[] prices) {
        int cheapest = Integer.MAX_VALUE;
        int best = 0;
        for (int price : prices) {
            if (price < cheapest) cheapest = price;
            else best = Math.max(best, price - cheapest);
        }
        return best;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'prices = [7,1,5,3,6,4]', expr: 'sol.maxProfit(new int[]{7,1,5,3,6,4})', expected: '5' },
      { name: 'Falling prices', input: 'prices = [7,6,4,3,1]', expr: 'sol.maxProfit(new int[]{7,6,4,3,1})', expected: '0' },
      { name: 'Single day', input: 'prices = [3]', expr: 'sol.maxProfit(new int[]{3})', expected: '0' },
      { name: 'Best trade is last', input: 'prices = [2,4,1,7]', expr: 'sol.maxProfit(new int[]{2,4,1,7})', expected: '6' }
    ]
  },

  {
    id: 217,
    slug: 'contains-duplicate',
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    topics: ['array', 'hash-table', 'sorting'],
    companies: ['amazon', 'apple', 'google'],
    statement: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice**, and \`false\` if every element is distinct.`,
    examples: [
      { input: 'nums = [1,2,3,1]', output: 'true', explanation: 'The value 1 appears twice.' },
      { input: 'nums = [1,2,3,4]', output: 'false', explanation: 'All values are distinct.' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    hints: [
      'Comparing every pair is O(n²). What structure answers "have I seen this before?" in O(1)?',
      'A HashSet. Insert as you scan.',
      '`set.add(x)` returns false when x was already present — you can return immediately.'
    ],
    approach: '**Hash set membership.** Scan once, inserting into a `HashSet`; the first failed insert means a duplicate. Sorting first also works in O(n log n) if you must keep O(1) extra space.',
    complexity: { time: 'O(n)', space: 'O(n)' },
    starterCode: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        // Write your solution here
        return false;
    }
}`,
    solutionCode: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int num : nums) {
            if (!seen.add(num)) return true;
        }
        return false;
    }
}`,
    tests: [
      { name: 'Has duplicate', input: 'nums = [1,2,3,1]', expr: 'sol.containsDuplicate(new int[]{1,2,3,1})', expected: 'true' },
      { name: 'All distinct', input: 'nums = [1,2,3,4]', expr: 'sol.containsDuplicate(new int[]{1,2,3,4})', expected: 'false' },
      { name: 'Single element', input: 'nums = [5]', expr: 'sol.containsDuplicate(new int[]{5})', expected: 'false' },
      { name: 'Duplicate at the end', input: 'nums = [1,1,1,3,3,4,3,2,4,2]', expr: 'sol.containsDuplicate(new int[]{1,1,1,3,3,4,3,2,4,2})', expected: 'true' }
    ]
  },

  {
    id: 242,
    slug: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'Easy',
    topics: ['string', 'hash-table', 'sorting'],
    companies: ['amazon', 'bloomberg', 'uber'],
    statement: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\` — that is, if it uses exactly the same letters with the same counts.`,
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true', explanation: 'Both strings contain 3 a, 1 n, 1 g, 1 r, 1 m.' },
      { input: 's = "rat", t = "car"', output: 'false', explanation: 'The letters differ.' }
    ],
    constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters'],
    hints: [
      'Anagram means "same multiset of characters". What is the cheapest way to compare two multisets?',
      'Count characters. With only 26 lowercase letters, an int[26] is enough.',
      'Add for s, subtract for t — if any counter is non-zero at the end the strings differ. Check the lengths first.'
    ],
    approach: '**Frequency counting.** Different lengths are an instant no. Otherwise increment a 26-slot array for `s`, decrement for `t`, and verify every slot is zero. Sorting both strings is the O(n log n) alternative.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    starterCode: `class Solution {
    public boolean isAnagram(String s, String t) {
        // Write your solution here
        return false;
    }
}`,
    solutionCode: `class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] counts = new int[26];
        for (int i = 0; i < s.length(); i++) {
            counts[s.charAt(i) - 'a']++;
            counts[t.charAt(i) - 'a']--;
        }
        for (int count : counts) {
            if (count != 0) return false;
        }
        return true;
    }
}`,
    tests: [
      { name: 'Anagram', input: 's = "anagram", t = "nagaram"', expr: 'sol.isAnagram("anagram", "nagaram")', expected: 'true' },
      { name: 'Not an anagram', input: 's = "rat", t = "car"', expr: 'sol.isAnagram("rat", "car")', expected: 'false' },
      { name: 'Different lengths', input: 's = "a", t = "ab"', expr: 'sol.isAnagram("a", "ab")', expected: 'false' },
      { name: 'Same letters, different counts', input: 's = "aacc", t = "ccac"', expr: 'sol.isAnagram("aacc", "ccac")', expected: 'false' }
    ]
  },

  {
    id: 125,
    slug: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    topics: ['string', 'two-pointers'],
    companies: ['meta', 'microsoft', 'amazon'],
    statement: `A phrase is a palindrome if, after converting all uppercase letters to lowercase and removing every character that is not a letter or digit, it reads the same forwards and backwards.

Given a string \`s\`, return \`true\` if it is a palindrome.`,
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: 'Cleaned up it becomes "amanaplanacanalpanama".' },
      { input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' },
      { input: 's = " "', output: 'true', explanation: 'After cleaning, the string is empty — and an empty string reads the same both ways.' }
    ],
    constraints: ['1 <= s.length <= 2 * 10^5', 's consists of printable ASCII characters'],
    hints: [
      'You can build a cleaned copy first — but can you avoid the extra string?',
      'Use two pointers, one at each end, moving towards each other.',
      'Skip non-alphanumeric characters with `Character.isLetterOrDigit`, and compare lowercased characters.'
    ],
    approach: '**Opposite-end two pointers.** Walk `left` forward and `right` backward, skipping anything that is not a letter or digit, and compare the lowercased characters. O(1) extra space — no cleaned copy needed.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    starterCode: `class Solution {
    public boolean isPalindrome(String s) {
        // Write your solution here
        return false;
    }
}`,
    solutionCode: `class Solution {
    public boolean isPalindrome(String s) {
        int left = 0;
        int right = s.length() - 1;
        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
}`,
    tests: [
      { name: 'Punctuation and case', input: 's = "A man, a plan, a canal: Panama"', expr: 'sol.isPalindrome("A man, a plan, a canal: Panama")', expected: 'true' },
      { name: 'Not a palindrome', input: 's = "race a car"', expr: 'sol.isPalindrome("race a car")', expected: 'false' },
      { name: 'Only spaces', input: 's = " "', expr: 'sol.isPalindrome(" ")', expected: 'true' },
      { name: 'Digits count', input: 's = "0P"', expr: 'sol.isPalindrome("0P")', expected: 'false' }
    ]
  },

  {
    id: 53,
    slug: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    topics: ['array', 'dp'],
    companies: ['amazon', 'microsoft', 'linkedin', 'bloomberg'],
    statement: `Given an integer array \`nums\`, find the contiguous subarray with the largest sum and return that sum. The subarray must contain at least one element.`,
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] sums to 6.' },
      { input: 'nums = [1]', output: '1', explanation: 'A single element is a valid subarray.' },
      { input: 'nums = [5,4,-1,7,8]', output: '23', explanation: 'The whole array is best.' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    hints: [
      'Ask a local question: what is the best subarray that *ends* at index i?',
      'Either you extend the best subarray ending at i-1, or you start fresh at i.',
      'best[i] = max(nums[i], best[i-1] + nums[i]). You only need the previous value, so one variable is enough.'
    ],
    approach: '**Kadane\'s algorithm.** Track the best sum ending at the current index: extend the previous run, or restart from the current element — whichever is larger. The answer is the maximum of those running values.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    starterCode: `class Solution {
    public int maxSubArray(int[] nums) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int maxSubArray(int[] nums) {
        int best = nums[0];
        int endingHere = nums[0];
        for (int i = 1; i < nums.length; i++) {
            endingHere = Math.max(nums[i], endingHere + nums[i]);
            best = Math.max(best, endingHere);
        }
        return best;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', expr: 'sol.maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4})', expected: '6' },
      { name: 'Single element', input: 'nums = [1]', expr: 'sol.maxSubArray(new int[]{1})', expected: '1' },
      { name: 'All positive', input: 'nums = [5,4,-1,7,8]', expr: 'sol.maxSubArray(new int[]{5,4,-1,7,8})', expected: '23' },
      { name: 'All negative', input: 'nums = [-3,-2,-5]', expr: 'sol.maxSubArray(new int[]{-3,-2,-5})', expected: '-2' }
    ]
  },

  {
    id: 238,
    slug: 'product-of-array-except-self',
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    topics: ['array', 'prefix-sum'],
    companies: ['amazon', 'meta', 'apple', 'microsoft'],
    statement: `Given an integer array \`nums\`, return an array \`answer\` where \`answer[i]\` is the product of every element of \`nums\` **except** \`nums[i]\`.

Solve it without using division and in O(n) time.`,
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]', explanation: 'answer[0] = 2*3*4 = 24, answer[1] = 1*3*4 = 12, and so on.' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]', explanation: 'Any position other than the zero gets a product containing the zero.' }
    ],
    constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30', 'The answer fits in a 32-bit integer'],
    hints: [
      'The answer at i is (product of everything left of i) × (product of everything right of i).',
      'Compute all left products in one forward pass.',
      'Then sweep backwards with a running right product, multiplying it into the array you already built — that keeps extra space at O(1) beyond the output.'
    ],
    approach: '**Prefix and suffix products.** Fill the output with prefix products in a left-to-right pass, then walk right-to-left multiplying by a running suffix product. Two passes, no division, no extra arrays.',
    complexity: { time: 'O(n)', space: 'O(1) extra (output excluded)' },
    starterCode: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        // Write your solution here
        return new int[nums.length];
    }
}`,
    solutionCode: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] answer = new int[n];

        answer[0] = 1;
        for (int i = 1; i < n; i++) {
            answer[i] = answer[i - 1] * nums[i - 1];   // product of everything to the left
        }

        int right = 1;
        for (int i = n - 1; i >= 0; i--) {
            answer[i] *= right;
            right *= nums[i];
        }
        return answer;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'nums = [1,2,3,4]', expr: 'Arrays.toString(sol.productExceptSelf(new int[]{1,2,3,4}))', expected: '[24, 12, 8, 6]' },
      { name: 'Contains a zero', input: 'nums = [-1,1,0,-3,3]', expr: 'Arrays.toString(sol.productExceptSelf(new int[]{-1,1,0,-3,3}))', expected: '[0, 0, 9, 0, 0]' },
      { name: 'Two elements', input: 'nums = [2,3]', expr: 'Arrays.toString(sol.productExceptSelf(new int[]{2,3}))', expected: '[3, 2]' },
      { name: 'Two zeros', input: 'nums = [0,0,4]', expr: 'Arrays.toString(sol.productExceptSelf(new int[]{0,0,4}))', expected: '[0, 0, 0]' }
    ]
  },

  {
    id: 3,
    slug: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topics: ['string', 'sliding-window', 'hash-table'],
    companies: ['amazon', 'bloomberg', 'adobe', 'meta'],
    statement: `Given a string \`s\`, return the length of the longest substring that contains no repeated characters.

A substring is a contiguous run of characters — \`"pwke"\` is a subsequence of \`"pwwkew"\`, not a substring.`,
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with length 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b".' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke".' }
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces'],
    hints: [
      'Think of a window over the string that always holds distinct characters.',
      'Extend the right edge one character at a time. When the new character is already inside the window, the left edge must move.',
      'Store each character\'s last index in a map so the left edge can jump directly past the previous occurrence instead of crawling.'
    ],
    approach: '**Sliding window with last-seen indices.** Grow the window to the right; when a repeat appears inside the window, jump the left edge to one past its previous position. Each character is visited once.',
    complexity: { time: 'O(n)', space: 'O(min(n, alphabet))' },
    starterCode: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> lastSeen = new HashMap<>();
        int best = 0;
        int left = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            Integer previous = lastSeen.get(c);
            if (previous != null && previous >= left) {
                left = previous + 1;               // shrink past the earlier copy
            }
            lastSeen.put(c, right);
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}`,
    tests: [
      { name: 'Example 1', input: 's = "abcabcbb"', expr: 'sol.lengthOfLongestSubstring("abcabcbb")', expected: '3' },
      { name: 'All same', input: 's = "bbbbb"', expr: 'sol.lengthOfLongestSubstring("bbbbb")', expected: '1' },
      { name: 'Repeat inside', input: 's = "pwwkew"', expr: 'sol.lengthOfLongestSubstring("pwwkew")', expected: '3' },
      { name: 'Empty string', input: 's = ""', expr: 'sol.lengthOfLongestSubstring("")', expected: '0' },
      { name: 'Repeat far behind the window', input: 's = "abba"', expr: 'sol.lengthOfLongestSubstring("abba")', expected: '2' }
    ]
  },

  {
    id: 11,
    slug: 'container-with-most-water',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    topics: ['array', 'two-pointers', 'greedy'],
    companies: ['amazon', 'bloomberg', 'google'],
    statement: `You are given an integer array \`height\` of length \`n\`, where \`height[i]\` is the height of a vertical line at position \`i\`.

Pick two lines so that the container they form with the x-axis holds the most water, and return that amount. The container cannot be tilted — its water level is limited by the shorter line.`,
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'Lines at index 1 and 8: width 7, height min(8,7) = 7, area 49.' },
      { input: 'height = [1,1]', output: '1', explanation: 'Width 1, height 1.' }
    ],
    constraints: ['2 <= height.length <= 10^5', '0 <= height[i] <= 10^4'],
    hints: [
      'Area = width × min(left height, right height). Start with the widest possible container.',
      'Moving the taller line inward can never help — the shorter line still caps the height and the width shrinks.',
      'So always move the pointer at the shorter line inward.'
    ],
    approach: '**Greedy two pointers.** Start at both ends and repeatedly move the shorter side inward: it is the only move that can ever increase the limiting height, so no better container is skipped.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    starterCode: `class Solution {
    public int maxArea(int[] height) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int maxArea(int[] height) {
        int left = 0;
        int right = height.length - 1;
        int best = 0;
        while (left < right) {
            int area = (right - left) * Math.min(height[left], height[right]);
            best = Math.max(best, area);
            if (height[left] < height[right]) left++;
            else right--;
        }
        return best;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'height = [1,8,6,2,5,4,8,3,7]', expr: 'sol.maxArea(new int[]{1,8,6,2,5,4,8,3,7})', expected: '49' },
      { name: 'Two lines', input: 'height = [1,1]', expr: 'sol.maxArea(new int[]{1,1})', expected: '1' },
      { name: 'Increasing', input: 'height = [1,2,3,4,5]', expr: 'sol.maxArea(new int[]{1,2,3,4,5})', expected: '6' },
      { name: 'Zeros in the middle', input: 'height = [4,0,0,0,4]', expr: 'sol.maxArea(new int[]{4,0,0,0,4})', expected: '16' }
    ]
  },

  {
    id: 15,
    slug: '3sum',
    title: '3Sum',
    difficulty: 'Medium',
    topics: ['array', 'two-pointers', 'sorting'],
    companies: ['amazon', 'meta', 'adobe', 'microsoft'],
    statement: `Given an integer array \`nums\`, return all **unique** triplets \`[nums[i], nums[j], nums[k]]\` with distinct indices that sum to zero.

The order of the triplets and of the values inside them does not matter, but no triplet may be repeated.`,
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explanation: 'Both triplets sum to 0; the duplicate [-1,0,1] found twice is reported once.' },
      { input: 'nums = [0,1,1]', output: '[]', explanation: 'No triplet sums to zero.' },
      { input: 'nums = [0,0,0]', output: '[[0,0,0]]', explanation: 'The only triplet.' }
    ],
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    hints: [
      'Sorting makes duplicates adjacent and enables the two-pointer trick.',
      'Fix the first element, then solve a 2Sum on the remaining sorted suffix with two pointers.',
      'Skip over equal values for both the fixed element and the pointers, otherwise the same triplet is emitted again.'
    ],
    approach: '**Sort, then fix one + two pointers.** For each index `i` (skipping repeats), search the sorted suffix with `left`/`right` pointers for a pair summing to `-nums[i]`, advancing past duplicates whenever a triplet is recorded. O(n²) overall.',
    complexity: { time: 'O(n²)', space: 'O(1) besides the output' },
    testHelpers: `    private static String canonical(List<List<Integer>> triplets) {
        List<String> rows = new ArrayList<>();
        for (List<Integer> triplet : triplets) {
            List<Integer> copy = new ArrayList<>(triplet);
            Collections.sort(copy);
            rows.add(copy.toString());
        }
        Collections.sort(rows);
        return rows.toString();
    }`,
    starterCode: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Write your solution here
        return new ArrayList<>();
    }
}`,
    solutionCode: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();

        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;      // skip duplicate anchors
            int left = i + 1;
            int right = nums.length - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum < 0) {
                    left++;
                } else if (sum > 0) {
                    right--;
                } else {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                }
            }
        }
        return result;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'nums = [-1,0,1,2,-1,-4]', expr: 'canonical(sol.threeSum(new int[]{-1,0,1,2,-1,-4}))', expected: '[[-1, -1, 2], [-1, 0, 1]]' },
      { name: 'No triplet', input: 'nums = [0,1,1]', expr: 'canonical(sol.threeSum(new int[]{0,1,1}))', expected: '[]' },
      { name: 'All zeros', input: 'nums = [0,0,0]', expr: 'canonical(sol.threeSum(new int[]{0,0,0}))', expected: '[[0, 0, 0]]' },
      { name: 'Many duplicates', input: 'nums = [-2,0,1,1,2]', expr: 'canonical(sol.threeSum(new int[]{-2,0,1,1,2}))', expected: '[[-2, 0, 2], [-2, 1, 1]]' }
    ]
  },

  {
    id: 49,
    slug: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'Medium',
    topics: ['string', 'hash-table', 'sorting'],
    companies: ['amazon', 'uber', 'meta', 'bloomberg'],
    statement: `Given an array of strings \`strs\`, group the anagrams together. Return the groups in any order, and the strings inside each group in any order.`,
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["eat","tea","ate"],["tan","nat"],["bat"]]', explanation: 'Words sharing the same letters land in the same group.' },
      { input: 'strs = [""]', output: '[[""]]', explanation: 'The empty string forms its own group.' }
    ],
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters'],
    hints: [
      'Anagrams need a shared signature — something identical for "eat" and "tea".',
      'Sorting the characters gives one such key ("aet"); a 26-length count string gives another.',
      'Use a HashMap from that key to the list of words.'
    ],
    approach: '**Group by canonical key.** Map each word to a signature — its sorted characters, or a `#`-joined 26-letter count — and collect words per signature in a `HashMap<String, List<String>>`. The count key avoids the per-word sort.',
    complexity: { time: 'O(n · k)', space: 'O(n · k)' },
    testHelpers: `    private static String canonicalGroups(List<List<String>> groups) {
        List<String> rows = new ArrayList<>();
        for (List<String> group : groups) {
            List<String> copy = new ArrayList<>(group);
            Collections.sort(copy);
            rows.add(copy.toString());
        }
        Collections.sort(rows);
        return rows.toString();
    }`,
    starterCode: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        // Write your solution here
        return new ArrayList<>();
    }
}`,
    solutionCode: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String word : strs) {
            int[] counts = new int[26];
            for (char c : word.toCharArray()) counts[c - 'a']++;

            StringBuilder key = new StringBuilder();
            for (int count : counts) key.append(count).append('#');

            groups.computeIfAbsent(key.toString(), k -> new ArrayList<>()).add(word);
        }
        return new ArrayList<>(groups.values());
    }
}`,
    tests: [
      {
        name: 'Example 1',
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        expr: 'canonicalGroups(sol.groupAnagrams(new String[]{"eat","tea","tan","ate","nat","bat"}))',
        expected: '[[ate, eat, tea], [bat], [nat, tan]]'
      },
      { name: 'Empty string', input: 'strs = [""]', expr: 'canonicalGroups(sol.groupAnagrams(new String[]{""}))', expected: '[[]]' },
      { name: 'Single word', input: 'strs = ["a"]', expr: 'canonicalGroups(sol.groupAnagrams(new String[]{"a"}))', expected: '[[a]]' },
      { name: 'No anagrams', input: 'strs = ["abc","def"]', expr: 'canonicalGroups(sol.groupAnagrams(new String[]{"abc","def"}))', expected: '[[abc], [def]]' }
    ]
  },

  {
    id: 128,
    slug: 'longest-consecutive-sequence',
    title: 'Longest Consecutive Sequence',
    difficulty: 'Medium',
    topics: ['array', 'hash-table'],
    companies: ['google', 'amazon', 'meta'],
    statement: `Given an unsorted array \`nums\`, return the length of the longest run of consecutive integers it contains.

The numbers do not have to be adjacent in the array. Your algorithm must run in O(n) time.`,
    examples: [
      { input: 'nums = [100,4,200,1,3,2]', output: '4', explanation: 'The run 1, 2, 3, 4 has length 4.' },
      { input: 'nums = [0,3,7,2,5,8,4,6,0,1]', output: '9', explanation: '0 through 8 is a run of length 9.' }
    ],
    constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    hints: [
      'Sorting gives O(n log n) — the O(n) requirement is a hint towards a hash set.',
      'Put everything in a set, then only start counting from a number that *begins* a run.',
      'x begins a run when x - 1 is not in the set. That makes the total work linear.'
    ],
    approach: '**Hash set with run starts.** Load all values into a `HashSet`, then for each value that has no predecessor in the set, walk upward counting. Every element is walked at most once, so it is O(n) despite the inner loop.',
    complexity: { time: 'O(n)', space: 'O(n)' },
    starterCode: `class Solution {
    public int longestConsecutive(int[] nums) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> values = new HashSet<>();
        for (int num : nums) values.add(num);

        int best = 0;
        for (int num : values) {
            if (values.contains(num - 1)) continue;   // not the start of a run
            int length = 1;
            while (values.contains(num + length)) length++;
            best = Math.max(best, length);
        }
        return best;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'nums = [100,4,200,1,3,2]', expr: 'sol.longestConsecutive(new int[]{100,4,200,1,3,2})', expected: '4' },
      { name: 'With duplicates', input: 'nums = [0,3,7,2,5,8,4,6,0,1]', expr: 'sol.longestConsecutive(new int[]{0,3,7,2,5,8,4,6,0,1})', expected: '9' },
      { name: 'Empty array', input: 'nums = []', expr: 'sol.longestConsecutive(new int[]{})', expected: '0' },
      { name: 'Negatives', input: 'nums = [-3,-2,-1,5]', expr: 'sol.longestConsecutive(new int[]{-3,-2,-1,5})', expected: '3' }
    ]
  },

  {
    id: 560,
    slug: 'subarray-sum-equals-k',
    title: 'Subarray Sum Equals K',
    difficulty: 'Medium',
    topics: ['array', 'hash-table', 'prefix-sum'],
    companies: ['meta', 'amazon', 'google'],
    statement: `Given an integer array \`nums\` and an integer \`k\`, return the number of contiguous subarrays whose elements sum to \`k\`.

Note that \`nums\` may contain negative numbers, so a sliding window does **not** work here.`,
    examples: [
      { input: 'nums = [1,1,1], k = 2', output: '2', explanation: 'The subarrays [1,1] starting at index 0 and at index 1.' },
      { input: 'nums = [1,2,3], k = 3', output: '2', explanation: '[1,2] and [3].' }
    ],
    constraints: ['1 <= nums.length <= 2 * 10^4', '-1000 <= nums[i] <= 1000', '-10^7 <= k <= 10^7'],
    hints: [
      'The sum of nums[i..j] equals prefix[j] - prefix[i-1].',
      'So for each j you are counting how many earlier prefixes equal prefix[j] - k.',
      'Keep a map from prefix value to how many times it has occurred, seeded with {0: 1} for subarrays that start at index 0.'
    ],
    approach: '**Prefix sums + hash map.** Walk once maintaining the running sum; the number of subarrays ending here equals how often `sum - k` has been seen before. Seed the map with `0 → 1` so prefixes that are themselves equal to `k` are counted.',
    complexity: { time: 'O(n)', space: 'O(n)' },
    starterCode: `class Solution {
    public int subarraySum(int[] nums, int k) {
        // Write your solution here
        return 0;
    }
}`,
    solutionCode: `class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> seen = new HashMap<>();
        seen.put(0, 1);                    // the empty prefix

        int sum = 0;
        int count = 0;
        for (int num : nums) {
            sum += num;
            count += seen.getOrDefault(sum - k, 0);
            seen.merge(sum, 1, Integer::sum);
        }
        return count;
    }
}`,
    tests: [
      { name: 'Example 1', input: 'nums = [1,1,1], k = 2', expr: 'sol.subarraySum(new int[]{1,1,1}, 2)', expected: '2' },
      { name: 'Example 2', input: 'nums = [1,2,3], k = 3', expr: 'sol.subarraySum(new int[]{1,2,3}, 3)', expected: '2' },
      { name: 'Negative numbers', input: 'nums = [1,-1,0], k = 0', expr: 'sol.subarraySum(new int[]{1,-1,0}, 0)', expected: '3' },
      { name: 'No match', input: 'nums = [1,2,3], k = 7', expr: 'sol.subarraySum(new int[]{1,2,3}, 7)', expected: '0' }
    ]
  }
];

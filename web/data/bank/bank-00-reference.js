/**
 * bank-00-reference.js — reference entries.
 *
 * This file documents the exact shape every curated problem must follow.
 * Verify any change with:  node web/tools/verify-bank.js
 */
module.exports = [
  {
    id: 1,
    slug: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    topics: ['array', 'hash-table'],
    companies: ['amazon', 'google', 'apple', 'microsoft', 'meta'],
    statement: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'nums[1] + nums[2] == 6.'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
        explanation: 'The same value may be used twice as long as the indices differ.'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    hints: [
      'The brute force is two nested loops — O(n²). Ask yourself what the inner loop is really searching for.',
      'For each number x you need target - x. Looking a value up quickly is what a HashMap is for.',
      'Store value → index as you scan. Check for the complement *before* inserting the current number so you never reuse the same index.'
    ],
    approach: `**One-pass hash map.** Walk the array once keeping a map of value → index for everything seen so far. At each element \`x\`, the partner you need is \`target - x\`; if it is already in the map you have your pair. Checking before inserting guarantees you never pair an element with itself.`,
    complexity: { time: 'O(n)', space: 'O(n)' },
    starterCode: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{-1, -1};
    }
}`,
    solutionCode: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                return new int[]{seen.get(complement), i};
            }
            seen.put(nums[i], i);
        }
        return new int[]{-1, -1};
    }
}`,
    tests: [
      {
        name: 'Example 1',
        input: 'nums = [2,7,11,15], target = 9',
        expr: 'Arrays.toString(sol.twoSum(new int[]{2,7,11,15}, 9))',
        expected: '[0, 1]'
      },
      {
        name: 'Example 2',
        input: 'nums = [3,2,4], target = 6',
        expr: 'Arrays.toString(sol.twoSum(new int[]{3,2,4}, 6))',
        expected: '[1, 2]'
      },
      {
        name: 'Duplicate values',
        input: 'nums = [3,3], target = 6',
        expr: 'Arrays.toString(sol.twoSum(new int[]{3,3}, 6))',
        expected: '[0, 1]'
      },
      {
        name: 'Negative numbers',
        input: 'nums = [-3,4,3,90], target = 0',
        expr: 'Arrays.toString(sol.twoSum(new int[]{-3,4,3,90}, 0))',
        expected: '[0, 2]'
      }
    ]
  },

  {
    id: 20,
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    topics: ['string', 'stack'],
    companies: ['amazon', 'google', 'microsoft', 'bloomberg'],
    statement: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

A string is valid if open brackets are closed by the same type of bracket, open brackets are closed in the correct order, and every closing bracket has a matching opening bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true', explanation: 'A single matched pair.' },
      { input: 's = "()[]{}"', output: 'true', explanation: 'Three independent matched pairs.' },
      { input: 's = "(]"', output: 'false', explanation: 'The closing bracket does not match the open one.' }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      "s consists of parentheses only: '()[]{}'"
    ],
    hints: [
      'Whenever you see a closing bracket, it must match the *most recent* unmatched opening bracket.',
      '"Most recent first" is exactly last-in-first-out — use a stack.',
      "Don't forget the ending check: the stack must be empty when the scan finishes."
    ],
    approach: `**Stack matching.** Push every opening bracket. On a closing bracket, pop and compare — a mismatch or an empty stack means the string is invalid. After the loop the stack must be empty, otherwise some brackets were never closed.`,
    complexity: { time: 'O(n)', space: 'O(n)' },
    starterCode: `class Solution {
    public boolean isValid(String s) {
        // Write your solution here
        return false;
    }
}`,
    solutionCode: `class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char open = stack.pop();
                if ((c == ')' && open != '(') || (c == ']' && open != '[') || (c == '}' && open != '{')) {
                    return false;
                }
            }
        }
        return stack.isEmpty();
    }
}`,
    tests: [
      { name: 'Single pair', input: 's = "()"', expr: 'sol.isValid("()")', expected: 'true' },
      { name: 'All bracket types', input: 's = "()[]{}"', expr: 'sol.isValid("()[]{}")', expected: 'true' },
      { name: 'Mismatched types', input: 's = "(]"', expr: 'sol.isValid("(]")', expected: 'false' },
      { name: 'Unclosed bracket', input: 's = "["', expr: 'sol.isValid("[")', expected: 'false' },
      { name: 'Nested', input: 's = "{[()]}"', expr: 'sol.isValid("{[()]}")', expected: 'true' }
    ]
  }
];

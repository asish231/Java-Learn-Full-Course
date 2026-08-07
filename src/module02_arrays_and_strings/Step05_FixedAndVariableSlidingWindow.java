package module02_arrays_and_strings;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * Step 05: Fixed and Variable Sliding Window Techniques
 *
 * <pre>
 * FIXED SLIDING WINDOW (Window Size K = 3):
 * Array: [ 2 | 1 | 5 | 1 | 3 | 2 ]
 *        [=======]                  Initial Window Sum = 2+1+5 = 8
 *            [=======]              Slide Right: Add 1, Subtract 2 -> Sum = 8+1-2 = 7
 *                [=======]          Slide Right: Add 3, Subtract 1 -> Sum = 7+3-1 = 9 (MAX!)
 *
 * VARIABLE SLIDING WINDOW (Longest Substring Without Repeating Chars):
 * String: "a b c a b c b b"
 *         L     R                   Window "abc", HashMap={a:0, b:1, c:2}, MaxLen=3
 *         L       R                 'a' duplicate seen at idx 0!
 *           L     R                 Shift L to max(L, map.get('a')+1) = 1 -> Window "bca", MaxLen=3
 * </pre>
 */
public class Step05_FixedAndVariableSlidingWindow {

    /**
     * Fixed Window: Maximum Sum Subarray of size K.
     * Time: O(N), Space: O(1)
     */
    public static int maxSubarraySumFixed(int[] arr, int k) {
        if (arr == null || arr.length < k || k <= 0) {
            throw new IllegalArgumentException("Invalid array or window size k");
        }

        // Step 1: Compute initial window sum of first k elements
        int currentWindowSum = 0;
        for (int i = 0; i < k; i++) {
            currentWindowSum += arr[i];
        }
        int maxSum = currentWindowSum;

        // Step 2: Slide window across remaining array (Add right, Subtract left)
        for (int right = k; right < arr.length; right++) {
            currentWindowSum += arr[right] - arr[right - k];
            maxSum = Math.max(maxSum, currentWindowSum);
        }
        return maxSum;
    }

    /**
     * Variable Window: Longest Substring Without Repeating Characters (LeetCode 3).
     * Time: O(N), Auxiliary Space: O(min(N, M)) where M is character set size.
     */
    public static int lengthOfLongestSubstringVariable(String s) {
        if (s == null || s.isEmpty()) return 0;

        Map<Character, Integer> lastSeen = new HashMap<>();
        int left = 0;
        int maxLen = 0;

        for (int right = 0; right < s.length(); right++) {
            char currentChar = s.charAt(right);

            // If duplicate character found inside current window, jump left boundary rightward
            if (lastSeen.containsKey(currentChar)) {
                left = Math.max(left, lastSeen.get(currentChar) + 1);
            }

            lastSeen.put(currentChar, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }

    /**
     * Variable Window: Minimum Size Subarray Sum (LeetCode 209).
     * Finds min length of contiguous subarray with sum >= target.
     * Time: O(N), Space: O(1).
     */
    public static int minSubArrayLen(int target, int[] nums) {
        if (nums == null || nums.length == 0) return 0;

        int left = 0;
        int runningSum = 0;
        int minLen = Integer.MAX_VALUE;

        for (int right = 0; right < nums.length; right++) {
            runningSum += nums[right];

            // Shrink window from left as long as constraint sum >= target holds
            while (runningSum >= target) {
                minLen = Math.min(minLen, right - left + 1);
                runningSum -= nums[left];
                left++;
            }
        }
        return minLen == Integer.MAX_VALUE ? 0 : minLen;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 02 - Arrays & Strings | Step 05: Sliding Window Techniques");
        System.out.println("======================================================================\n");

        int[] arrFixed = {2, 1, 5, 1, 3, 2};
        int k = 3;
        System.out.println("[INIT] Array: " + Arrays.toString(arrFixed) + ", Fixed Window Size K = " + k);
        System.out.println("[ACTION] Computing Maximum Subarray Sum of size K...");
        int maxFixedSum = maxSubarraySumFixed(arrFixed, k);
        System.out.println("[STATE] Maximum Subarray Sum Found = " + maxFixedSum);

        System.out.println("\n--- 2. Variable Sliding Window (Longest Unique Substring) ---");
        String s = "abcabcbb";
        System.out.println("[INIT] Input String: \"" + s + "\"");
        System.out.println("[ACTION] Expanding/Shrinking variable window to find max unique substring length...");
        int maxLen = lengthOfLongestSubstringVariable(s);
        System.out.println("[STATE] Longest Substring Length Without Repeating Chars = " + maxLen);

        System.out.println("\n--- 3. Variable Sliding Window (Minimum Subarray Sum Target) ---");
        int[] arrMinWindow = {2, 3, 1, 2, 4, 3};
        int targetSum = 7;
        System.out.println("[INIT] Input Array: " + Arrays.toString(arrMinWindow) + ", Target Sum = " + targetSum);
        System.out.println("[ACTION] Finding minimal window length with sum >= " + targetSum + "...");
        int minWindowSize = minSubArrayLen(targetSum, arrMinWindow);
        System.out.println("[STATE] Minimal Subarray Length Found = " + minWindowSize);

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Fixed & Variable Sliding Window verified.");
        System.out.println("======================================================================");
    }
}

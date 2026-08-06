package module02_arrays_and_strings;

import java.util.HashMap;
import java.util.Map;

/**
 * Sliding Window Algorithms:
 * 1. Fixed Window: Maximum Sum Subarray of size K - O(N)
 * 2. Variable Window: Longest Substring Without Repeating Characters - O(N)
 */
public class SlidingWindowTechniques {

    /**
     * Fixed Sliding Window: Maximum sum of contiguous subarray of size k.
     */
    public static int maxSumSubarrayFixedWindow(int[] arr, int k) {
        if (arr.length < k) throw new IllegalArgumentException("Array length must be >= k");

        int currentWindowSum = 0;
        for (int i = 0; i < k; i++) {
            currentWindowSum += arr[i];
        }

        int maxSum = currentWindowSum;

        for (int i = k; i < arr.length; i++) {
            currentWindowSum += arr[i] - arr[i - k]; // Slide window right
            maxSum = Math.max(maxSum, currentWindowSum);
        }

        return maxSum;
    }

    /**
     * Variable Sliding Window: Length of longest substring without duplicate characters.
     */
    public static int lengthOfLongestSubstringVariableWindow(String s) {
        Map<Character, Integer> charMap = new HashMap<>();
        int maxLength = 0;
        int left = 0;

        for (int right = 0; right < s.length(); right++) {
            char rightChar = s.charAt(right);

            if (charMap.containsKey(rightChar)) {
                // Move left pointer to right of previous duplicate
                left = Math.max(left, charMap.get(rightChar) + 1);
            }

            charMap.put(rightChar, right);
            maxLength = Math.max(maxLength, right - left + 1);
        }

        return maxLength;
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 🪟 SLIDING WINDOW TECHNIQUES DEMONSTRATION");
        System.out.println("==================================================\n");

        int[] arr = {2, 1, 5, 1, 3, 2};
        int k = 3;
        int maxSubarraySum = maxSumSubarrayFixedWindow(arr, k);
        System.out.printf("1. Max sum of subarray of size k=%d: %d%n", k, maxSubarraySum);

        String sampleString = "abcabcbb";
        int longestLen = lengthOfLongestSubstringVariableWindow(sampleString);
        System.out.printf("2. Longest unique substring length in \"%s\": %d (e.g. \"abc\")%n", sampleString, longestLen);

        String sampleString2 = "pwwkew";
        int longestLen2 = lengthOfLongestSubstringVariableWindow(sampleString2);
        System.out.printf("3. Longest unique substring length in \"%s\": %d (e.g. \"wke\")%n", sampleString2, longestLen2);

        System.out.println("\n✅ Sliding Window techniques executed successfully!");
    }
}

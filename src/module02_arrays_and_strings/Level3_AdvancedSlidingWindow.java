package module02_arrays_and_strings;

import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;
import java.util.HashMap;
import java.util.Map;

/**
 * LEVEL 3 (ADVANCED / FAANG): Hard Sliding Window & Deque Problems
 * 1. Sliding Window Maximum (LeetCode 239 - Hard) - O(N) Time using Monotonic Deque
 * 2. Minimum Window Substring (LeetCode 76 - Hard) - O(N) Time
 */
public class Level3_AdvancedSlidingWindow {

    // 1. Sliding Window Maximum using Monotonic Decreasing Deque
    public static int[] maxSlidingWindow(int[] nums, int k) {
        if (nums == null || k <= 0 || k > nums.length) return new int[0];
        int n = nums.length;
        int[] result = new int[n - k + 1];
        int ri = 0;

        Deque<Integer> deque = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) deque.pollFirst();
            while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) deque.pollLast();
            deque.offerLast(i);
            if (i >= k - 1) result[ri++] = nums[deque.peekFirst()];
        }
        return result;
    }

    // 2. Minimum Window Substring (LeetCode 76)
    public static String minWindow(String s, String t) {
        if (s == null || t == null || s.length() < t.length()) return "";
        Map<Character, Integer> need = new HashMap<>();
        for (char c : t.toCharArray()) need.put(c, need.getOrDefault(c, 0) + 1);

        int have = 0, needSize = need.size();
        Map<Character, Integer> window = new HashMap<>();
        int left = 0, start = 0, minLen = Integer.MAX_VALUE;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            window.put(c, window.getOrDefault(c, 0) + 1);
            if (need.containsKey(c) && window.get(c).equals(need.get(c))) have++;

            while (have == needSize) {
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    start = left;
                }
                char lc = s.charAt(left);
                window.put(lc, window.get(lc) - 1);
                if (need.containsKey(lc) && window.get(lc) < need.get(lc)) have--;
                left++;
            }
        }
        return minLen == Integer.MAX_VALUE ? "" : s.substring(start, start + minLen);
    }

    public static void main(String[] args) {
        System.out.println("--- Module 02: Level 3 (Advanced Sliding Window Hard) ---");
        int[] nums = {1, 3, -1, -3, 5, 3, 6, 7};
        int k = 3;
        System.out.println("Sliding Window Max (K=" + k + "): " + Arrays.toString(maxSlidingWindow(nums, k)));

        String s = "ADOBECODEBANC", t = "ABC";
        System.out.println("Minimum window substring for \"" + t + "\" in \"" + s + "\": \"" + minWindow(s, t) + "\"");
    }
}

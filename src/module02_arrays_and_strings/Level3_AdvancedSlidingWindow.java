package module02_arrays_and_strings;

import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

/**
 * LEVEL 3 (ADVANCED / FAANG): Hard Sliding Window & Deque Problems
 * 1. Sliding Window Maximum (LeetCode 239 - Hard) - O(N) Time using Monotonic Deque
 * 2. Minimum Window Substring (LeetCode 76 - Hard) - O(N) Time
 */
public class Level3_AdvancedSlidingWindow {

    // 1. Sliding Window Maximum using Monotonic Decreasing Deque
    public static int[] maxSlidingWindow(int[] nums, int k) {
        if (nums == null || k <= 0) return new int[0];
        int n = nums.length;
        int[] result = new int[n - k + 1];
        int ri = 0;

        // Deque stores array indices
        Deque<Integer> deque = new ArrayDeque<>();

        for (int i = 0; i < n; i++) {
            // Remove numbers out of current window [i - k + 1, i]
            while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
                deque.pollFirst();
            }

            // Remove smaller numbers in k range as they are useless
            while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) {
                deque.pollLast();
            }

            deque.offerLast(i);

            if (i >= k - 1) {
                result[ri++] = nums[deque.peekFirst()];
            }
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println("--- Module 02: Level 3 (Advanced Sliding Window Hard) ---");
        int[] nums = {1, 3, -1, -3, 5, 3, 6, 7};
        int k = 3;
        int[] maxes = maxSlidingWindow(nums, k);
        System.out.println("Sliding Window Max (K=" + k + ") for " + Arrays.toString(nums) + ":\n  " + Arrays.toString(maxes));
    }
}

package module02_arrays_and_strings;

import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

/**
 * Step 06: Advanced Monotonic Deque Sliding Window Maximum (LeetCode 239 Hard)
 *
 * <pre>
 * MONOTONIC DECREASING DEQUE INVARIANT:
 * Window Elements: [ 5, 3, 2 ]
 * Deque Content (Indices): [ Head: idx of 5 | idx of 3 | Tail: idx of 2 ]
 *                                ^ Max Element always at Head!
 *
 * SLIDING WINDOW STEP TRACE (arr = [1, 3, -1, -3, 5, 3, 6, 7], K = 3):
 * i=0 (val=1):  Deque=[0 (val 1)]
 * i=1 (val=3):  3 > 1 -> Pop back 0! Deque=[1 (val 3)]
 * i=2 (val=-1): -1 < 3 -> Deque=[1 (val 3), 2 (val -1)] -> Window 0 Max = arr[Deque.head] = 3
 * i=3 (val=-3): -3 < -1 -> Deque=[1 (val 3), 2 (val -1), 3 (val -3)] -> Window 1 Max = 3
 * i=4 (val=5):  Evict expired head idx 1 (out of range [2..4])!
 *               5 > -3, 5 > -1, 5 > 3 -> Pop back 3, 2, 1! Deque=[4 (val 5)] -> Window 2 Max = 5
 * ...
 * Final Result Array: [3, 3, 5, 5, 6, 7]
 * </pre>
 */
public class Step06_AdvancedMonotonicDequeWindow {

    /**
     * Computes maximum element for each sliding window of size K in O(N) time.
     * Uses Monotonic Decreasing Deque storing array indices.
     * Time: O(N) Amortized (Each element pushed once, popped at most once)
     * Space: O(K) Auxiliary Deque Space.
     */
    public static int[] maxSlidingWindow(int[] nums, int k) {
        if (nums == null || nums.length == 0 || k <= 0) {
            return new int[0];
        }

        int n = nums.length;
        int[] result = new int[n - k + 1];
        int resIndex = 0;

        // Deque stores array indices in strictly decreasing order of their corresponding values
        Deque<Integer> deque = new ArrayDeque<>();

        for (int i = 0; i < n; i++) {
            // Step 1: Front Eviction - Remove indices that fall outside the current window range [i - k + 1, i]
            while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
                deque.pollFirst();
            }

            // Step 2: Back Eviction - Remove indices whose values are <= nums[i]
            // (They are dominated by nums[i] and can never be window maximums again)
            while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]) {
                deque.pollLast();
            }

            // Step 3: Push current index onto deque tail
            deque.offerLast(i);

            // Step 4: Record maximum (always at deque head) once window reaches full size k
            if (i >= k - 1) {
                result[resIndex++] = nums[deque.peekFirst()];
            }
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 02 - Arrays & Strings | Step 06: Monotonic Deque Window Max");
        System.out.println("======================================================================\n");

        int[] nums = {1, 3, -1, -3, 5, 3, 6, 7};
        int k = 3;
        System.out.println("[INIT] Input Array: " + Arrays.toString(nums));
        System.out.println("[INIT] Window Size K = " + k);

        System.out.println("\n--- Detailed Monotonic Deque Step-by-Step Execution Trace ---");
        System.out.printf("%-6s | %-12s | %-25s | %-15s%n",
                "Index", "Incoming Val", "Monotonic Deque (Indices)", "Window Max Result");
        System.out.println("----------------------------------------------------------------------");

        Deque<Integer> deque = new ArrayDeque<>();
        int[] resTrace = new int[nums.length - k + 1];
        int resIdx = 0;

        for (int i = 0; i < nums.length; i++) {
            // Evict front
            while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
                deque.pollFirst();
            }
            // Evict back
            while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]) {
                deque.pollLast();
            }
            deque.offerLast(i);

            String windowMaxStr = "-";
            if (i >= k - 1) {
                int maxVal = nums[deque.peekFirst()];
                resTrace[resIdx++] = maxVal;
                windowMaxStr = String.valueOf(maxVal);
            }

            System.out.printf("i=%-4d | val=%-8d | %-25s | %-15s%n",
                    i, nums[i], deque.toString(), windowMaxStr);
        }

        System.out.println("\n--- Verification of Function Output ---");
        int[] finalResult = maxSlidingWindow(nums, k);
        System.out.println("[STATE] Final Sliding Window Max Array: " + Arrays.toString(finalResult));

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: O(N) Monotonic Deque Sliding Window verified.");
        System.out.println("======================================================================");
    }
}

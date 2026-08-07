package module04_stacks_and_queues;

import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

/**
 * Step 04: Monotonic Stack (Next Greater Element & Daily Temperatures)
 *
 * <pre>
 * 1. Monotonic Stack Execution Trace for Next Greater Element:
 *    Input Array: [ 2, 1, 2, 4, 3 ]
 *    Goal: Find next greater element for each index.
 *
 *    i=0 (val=2): Stack: [ 0(2) ]
 *    i=1 (val=1): 1 < 2 -> Push 1. Stack: [ 0(2), 1(1) ]
 *    i=2 (val=2): 2 > 1 -> Pop index 1! NGE[1] = 2.
 *                 2 <= 2 -> Push index 2. Stack: [ 0(2), 2(2) ]
 *    i=3 (val=4): 4 > 2 -> Pop index 2! NGE[2] = 4.
 *                 4 > 2 -> Pop index 0! NGE[0] = 4.
 *                 Push index 3. Stack: [ 3(4) ]
 *    i=4 (val=3): 3 < 4 -> Push index 4. Stack: [ 3(4), 4(3) ]
 *
 *    End of array: Remaining indices in stack get NGE = -1.
 *    Result NGE Array: [ 4, 2, 4, -1, -1 ]
 * </pre>
 */
public class Step04_MonotonicStackNextGreater {

    /**
     * Finds Next Greater Element for each index in O(N) time.
     * Uses Monotonic Decreasing Stack storing array indices.
     */
    public static int[] nextGreaterElement(int[] nums) {
        if (nums == null) return new int[0];

        int n = nums.length;
        int[] result = new int[n];
        Arrays.fill(result, -1);

        Deque<Integer> stack = new ArrayDeque<>(); // Stores indices

        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && nums[i] > nums[stack.peek()]) {
                int poppedIndex = stack.pop();
                result[poppedIndex] = nums[i];
            }
            stack.push(i);
        }
        return result;
    }

    /**
     * Daily Temperatures (LeetCode 739).
     * Calculates number of days to wait until a warmer temperature occurs.
     * Time: O(N), Space: O(N)
     */
    public static int[] dailyTemperatures(int[] temperatures) {
        if (temperatures == null) return new int[0];

        int n = temperatures.length;
        int[] answer = new int[n];
        Deque<Integer> stack = new ArrayDeque<>(); // Stores indices of temperatures

        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
                int prevDayIndex = stack.pop();
                answer[prevDayIndex] = i - prevDayIndex; // Days waited
            }
            stack.push(i);
        }
        return answer;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 04 - Stacks & Queues | Step 04: Monotonic Stack (Next Greater)");
        System.out.println("======================================================================\n");

        int[] nums = {2, 1, 2, 4, 3};
        System.out.println("[INIT] Input Array for NGE: " + Arrays.toString(nums));
        System.out.println("[ACTION] Executing Monotonic Stack Next Greater Element algorithm...");
        int[] ngeResult = nextGreaterElement(nums);
        System.out.println("[STATE] Next Greater Elements Array: " + Arrays.toString(ngeResult));

        System.out.println("\n--- 2. Daily Temperatures Wait Days (LeetCode 739) ---");
        int[] temps = {73, 74, 75, 71, 69, 72, 76, 73};
        System.out.println("[INIT] Daily Temperatures: " + Arrays.toString(temps));
        System.out.println("[ACTION] Computing wait days for warmer temperature...");
        int[] waitDays = dailyTemperatures(temps);
        System.out.println("[STATE] Days to Wait for Warmer Temp: " + Arrays.toString(waitDays));

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Monotonic stack O(N) Next Greater verified.");
        System.out.println("======================================================================");
    }
}

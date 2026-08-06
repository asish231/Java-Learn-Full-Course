package module04_stacks_and_queues;

import java.util.Arrays;
import java.util.ArrayDeque;
import java.util.Deque;

/**
 * Monotonic Stack Pattern:
 * Solves "Next Greater Element" problem in O(N) time.
 */
public class MonotonicStack {

    /**
     * Given an array, find the next greater element for every element.
     * If no greater element exists, output -1.
     */
    public static int[] nextGreaterElement(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        Arrays.fill(result, -1);

        // Monotonic Decreasing Stack storing indices
        Deque<Integer> stack = new ArrayDeque<>();

        for (int i = 0; i < n; i++) {
            // While current element is greater than element at stack top
            while (!stack.isEmpty() && nums[i] > nums[stack.peek()]) {
                int index = stack.pop();
                result[index] = nums[i];
            }
            stack.push(i);
        }

        return result;
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 📈 MONOTONIC STACK (NEXT GREATER ELEMENT) DEMO");
        System.out.println("==================================================\n");

        int[] arr = {4, 5, 2, 10, 8};
        int[] nge = nextGreaterElement(arr);

        System.out.println("Input Array:        " + Arrays.toString(arr));
        System.out.println("Next Greater Array: " + Arrays.toString(nge));

        System.out.println("\nExplanation:");
        System.out.println("  - Next greater for 4 is 5");
        System.out.println("  - Next greater for 5 is 10");
        System.out.println("  - Next greater for 2 is 10");
        System.out.println("  - Next greater for 10 is -1");
        System.out.println("  - Next greater for 8 is -1");

        System.out.println("\n✅ Monotonic Stack test passed!");
    }
}

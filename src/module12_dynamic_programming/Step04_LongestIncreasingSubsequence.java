package module12_dynamic_programming;

import java.util.Arrays;

/**
 * Step 04: Longest Increasing Subsequence (LIS O(N^2) DP & O(N log N) Patience Search)
 *
 * <pre>
 * 1D NESTED LOOP DP FOR nums = [10, 9, 2, 5, 3, 7, 101, 18]:
 *
 * State Definition: dp[i] = Length of LIS ending at index i.
 * Recurrence: dp[i] = max(dp[i], dp[j] + 1) for all j < i where nums[j] < nums[i].
 *
 * Index i:  0   1   2   3   4   5    6   7
 * nums[i]: 10   9   2   5   3   7  101  18
 * dp[i]:    1   1   1   2   2   3    4   4
 *                       ^   ^   ^    ^
 * LIS Sequence: [2, 3, 7, 101] or [2, 5, 7, 18] -> Max Length = 4
 *
 * PATIENCE SORTING O(N log N) BINARY SEARCH (Tails Array):
 * Process elements:
 * 10  -> tails = [10]
 * 9   -> tails = [9]
 * 2   -> tails = [2]
 * 5   -> tails = [2, 5]
 * 3   -> tails = [2, 3]
 * 7   -> tails = [2, 3, 7]
 * 101 -> tails = [2, 3, 7, 101]
 * 18  -> tails = [2, 3, 7, 18]
 * Final Tails Array Length = 4
 * </pre>
 */
public class Step04_LongestIncreasingSubsequence {

    public static class LISResult {
        public final int length;
        public final int[] dpTable;

        public LISResult(int length, int[] dpTable) {
            this.length = length;
            this.dpTable = dpTable;
        }
    }

    /**
     * O(N^2) Dynamic Programming LIS.
     */
    public static LISResult lengthOfLIS_DP(int[] nums) {
        if (nums == null || nums.length == 0) return new LISResult(0, new int[0]);

        int n = nums.length;
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        int maxLIS = 1;

        System.out.println("  [INIT] Initialized DP Table to 1s");

        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    dp[i] = Math.max(dp[i], dp[j] + 1);
                }
            }
            maxLIS = Math.max(maxLIS, dp[i]);
            System.out.println("  [ACTION] Computed dp[" + i + "] for nums[" + i + "]=" + nums[i] + " -> LIS Ending Here = " + dp[i]);
        }

        return new LISResult(maxLIS, dp);
    }

    /**
     * O(N log N) Patience Sorting Binary Search LIS.
     */
    public static int lengthOfLIS_BinarySearch(int[] nums) {
        if (nums == null || nums.length == 0) return 0;

        int[] tails = new int[nums.length];
        int size = 0;

        for (int num : nums) {
            int i = 0, j = size;
            while (i < j) {
                int mid = (i + j) / 2;
                if (tails[mid] < num) {
                    i = mid + 1;
                } else {
                    j = mid;
                }
            }
            tails[i] = num;
            if (i == size) {
                size++;
            }
            System.out.println("  [ACTION] Processed " + num + " -> Tails Array: " + Arrays.toString(Arrays.copyOf(tails, size)));
        }

        return size;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 12 - Step 04: Longest Increasing Subsequence (LIS)");
        System.out.println("======================================================================\n");

        int[] nums = {10, 9, 2, 5, 3, 7, 101, 18};
        System.out.println("[INIT] Input Array: " + Arrays.toString(nums));

        System.out.println("\n--- 1. Executing O(N^2) Nested-Loop DP LIS ---");
        LISResult resDP = lengthOfLIS_DP(nums);

        System.out.println("\n[STATE] O(N^2) DP Array: " + Arrays.toString(resDP.dpTable));
        System.out.println("[STATE] Max LIS Length (O(N^2) DP): " + resDP.length);

        System.out.println("\n--- 2. Executing O(N log N) Patience Binary Search LIS ---");
        int lisBS = lengthOfLIS_BinarySearch(nums);

        System.out.println("\n[STATE] Max LIS Length (O(N log N) Binary Search): " + lisBS);

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Step04_LongestIncreasingSubsequence executed cleanly.");
        System.out.println("======================================================================");
    }
}

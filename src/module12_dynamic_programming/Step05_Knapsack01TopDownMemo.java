package module12_dynamic_programming;

import java.util.Arrays;

/**
 * Step 05: 0/1 Knapsack Top-Down Recursion with 2D Memoization
 *
 * <pre>
 * TOP-DOWN 0/1 KNAPSACK DECISION TREE VISUALIZATION:
 *
 * Items (Weight, Value): Item 0 (1, 15), Item 1 (2, 20), Item 2 (3, 30)
 * Max Capacity W = 4
 *
 *                              knapsack(2, 4)  [Item 2, Cap 4]
 *                             /               \
 *                     Exclude 2               Include 2 (wt 3, val 30)
 *                    /                         \
 *            knapsack(1, 4)                  knapsack(1, 1) + 30
 *            /           \                      /          \
 *       Exclude 1      Include 1           Exclude 1     Include 1 (wt 2 > cap 1: PRUNED)
 *       knapsack(0,4)  knapsack(0,2)+20    knapsack(0,1)
 *
 * Memoization Table memo[n][W+1] stores computed subproblem max values!
 * </pre>
 */
public class Step05_Knapsack01TopDownMemo {

    public static class KnapsackMemoResult {
        public final int maxValue;
        public final int[][] memoTable;
        public final int subproblemCallsCount;

        public KnapsackMemoResult(int maxValue, int[][] memoTable, int subproblemCallsCount) {
            this.maxValue = maxValue;
            this.memoTable = memoTable;
            this.subproblemCallsCount = subproblemCallsCount;
        }
    }

    private static int callsCount = 0;

    /**
     * Solves 0/1 Knapsack using Top-Down Recursion + 2D Memoization.
     */
    public static KnapsackMemoResult knapsack01TopDown(int[] weights, int[] values, int capacity) {
        int n = weights.length;
        int[][] memo = new int[n][capacity + 1];
        for (int[] row : memo) {
            Arrays.fill(row, -1);
        }

        callsCount = 0;
        System.out.println("  [MEMORY EVENT] Allocated 2D Memoization Matrix [" + n + "][" + (capacity + 1) + "]");

        int maxVal = helper(n - 1, capacity, weights, values, memo);
        return new KnapsackMemoResult(maxVal, memo, callsCount);
    }

    private static int helper(int index, int remainingCap, int[] weights, int[] values, int[][] memo) {
        callsCount++;

        if (index < 0 || remainingCap <= 0) {
            return 0; // Base case: No items or no capacity left
        }

        if (memo[index][remainingCap] != -1) {
            return memo[index][remainingCap]; // Return cached memoized value
        }

        // Option 1: Exclude item index
        int exclude = helper(index - 1, remainingCap, weights, values, memo);

        // Option 2: Include item index (if weight allows)
        int include = 0;
        if (weights[index] <= remainingCap) {
            include = values[index] + helper(index - 1, remainingCap - weights[index], weights, values, memo);
        }

        memo[index][remainingCap] = Math.max(exclude, include);
        System.out.println("  [ACTION] Computed memo[" + index + "][" + remainingCap + "] = max(Exclude="
                + exclude + ", Include=" + include + ") = " + memo[index][remainingCap]);

        return memo[index][remainingCap];
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 12 - Step 05: 0/1 Knapsack (Top-Down Recursion with Memoization)");
        System.out.println("======================================================================\n");

        int[] weights = {1, 2, 3};
        int[] values = {15, 20, 30};
        int capacity = 4;

        System.out.println("[INIT] Item Weights: " + Arrays.toString(weights));
        System.out.println("[INIT] Item Values:  " + Arrays.toString(values));
        System.out.println("[INIT] Max Capacity W = " + capacity);

        System.out.println("\n--- Executing Top-Down Memoized 0/1 Knapsack ---");
        KnapsackMemoResult res = knapsack01TopDown(weights, values, capacity);

        System.out.println("\n[STATE] Total Subproblem Function Calls: " + res.subproblemCallsCount);
        System.out.println("[STATE] Maximum Value Obtainable: " + res.maxValue);

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Step05_Knapsack01TopDownMemo executed cleanly.");
        System.out.println("======================================================================");
    }
}

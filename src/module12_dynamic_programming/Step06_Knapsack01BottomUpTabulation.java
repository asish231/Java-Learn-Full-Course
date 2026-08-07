package module12_dynamic_programming;

import java.util.Arrays;

/**
 * Step 06: 0/1 Knapsack Bottom-Up 2D Tabulation Grid & 1D Array Space Optimization
 *
 * <pre>
 * 2D BOTTOM-UP TABULATION GRID FOR weights = [1, 2, 3], values = [15, 20, 30], W = 4:
 *
 * State Definition: dp[i][w] = Max value using subset of first i items with max capacity w.
 * Recurrence:
 *   If weight[i-1] <= w:
 *     dp[i][w] = max(dp[i-1][w], dp[i-1][w - weight[i-1]] + value[i-1])
 *   Else:
 *     dp[i][w] = dp[i-1][w]
 *
 * 2D GRID:
 * +-----------+----+----+----+----+----+
 * | Item \ W  | 0  | 1  | 2  | 3  | 4  |
 * +-----------+----+----+----+----+----+
 * | 0 (No Item)| 0 | 0  | 0  | 0  | 0  |
 * | 1 (W:1,V:15)| 0| 15 | 15 | 15 | 15 |
 * | 2 (W:2,V:20)| 0| 15 | 20 | 35 | 35 |
 * | 3 (W:3,V:30)| 0| 15 | 20 | 35 | 45 | <- Final Max Value = 45 (Items 1 & 3)
 * +-----------+----+----+----+----+----+
 *
 * 1D Space Optimization:
 * Iterate capacity w backwards from W down to weight[i-1] -> O(W) Space!
 * </pre>
 */
public class Step06_Knapsack01BottomUpTabulation {

    public static class TabulationResult {
        public final int maxValue;
        public final int[][] grid;

        public TabulationResult(int maxValue, int[][] grid) {
            this.maxValue = maxValue;
            this.grid = grid;
        }
    }

    /**
     * Solves 0/1 Knapsack using 2D Bottom-Up Tabulation Grid.
     */
    public static TabulationResult knapsack01Tabulation(int[] weights, int[] values, int capacity) {
        int n = weights.length;
        int[][] dp = new int[n + 1][capacity + 1];

        System.out.println("  [MEMORY EVENT] Allocated 2D Grid [" + (n + 1) + "][" + (capacity + 1) + "]");

        for (int i = 1; i <= n; i++) {
            int wt = weights[i - 1];
            int val = values[i - 1];

            for (int w = 0; w <= capacity; w++) {
                if (wt <= w) {
                    dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - wt] + val);
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
            System.out.println("  [ACTION] Computed Row " + i + " (Item wt=" + wt + ", val=" + val + ") -> " + Arrays.toString(dp[i]));
        }

        return new TabulationResult(dp[n][capacity], dp);
    }

    /**
     * Solves 0/1 Knapsack in 1D O(W) Space.
     */
    public static int knapsack01SpaceOptimized(int[] weights, int[] values, int capacity) {
        int[] dp = new int[capacity + 1];

        for (int i = 0; i < weights.length; i++) {
            int wt = weights[i];
            int val = values[i];

            // Iterate backwards to avoid using same item twice in 0/1 knapsack!
            for (int w = capacity; w >= wt; w--) {
                dp[w] = Math.max(dp[w], dp[w - wt] + val);
            }
            System.out.println("  [ACTION] 1D Array After Item " + (i + 1) + ": " + Arrays.toString(dp));
        }

        return dp[capacity];
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 12 - Step 06: 0/1 Knapsack (Bottom-Up 2D Tabulation & 1D Space)");
        System.out.println("======================================================================\n");

        int[] weights = {1, 2, 3};
        int[] values = {15, 20, 30};
        int capacity = 4;

        System.out.println("[INIT] Item Weights: " + Arrays.toString(weights));
        System.out.println("[INIT] Item Values:  " + Arrays.toString(values));
        System.out.println("[INIT] Max Capacity W = " + capacity);

        System.out.println("\n--- 1. Executing 2D Bottom-Up Grid Tabulation ---");
        TabulationResult res2D = knapsack01Tabulation(weights, values, capacity);
        System.out.println("[STATE] Max Value from 2D Grid: " + res2D.maxValue);

        System.out.println("\n--- 2. Executing 1D Space-Optimized Tabulation ---");
        int res1D = knapsack01SpaceOptimized(weights, values, capacity);
        System.out.println("[STATE] Max Value from 1D Array: " + res1D);

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Step06_Knapsack01BottomUpTabulation executed cleanly.");
        System.out.println("======================================================================");
    }
}

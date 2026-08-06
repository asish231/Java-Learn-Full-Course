package module12_dynamic_programming;

import java.util.Arrays;

/**
 * 0/1 Knapsack Problem solved via both Memoization (Top-Down) and Tabulation (Bottom-Up).
 * Time Complexity: O(N * W)
 * Space Complexity: O(N * W)
 */
public class Knapsack01 {

    // --- BOTTOM-UP TABULATION ---
    public static int knapsackTabulation(int[] weights, int[] values, int W) {
        int n = weights.length;
        int[][] dp = new int[n + 1][W + 1];

        for (int i = 1; i <= n; i++) {
            int w = weights[i - 1];
            int v = values[i - 1];

            for (int j = 0; j <= W; j++) {
                if (j < w) {
                    dp[i][j] = dp[i - 1][j]; // Cannot include item
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], v + dp[i - 1][j - w]);
                }
            }
        }

        return dp[n][W];
    }

    // --- TOP-DOWN MEMOIZATION ---
    public static int knapsackMemoization(int[] weights, int[] values, int W) {
        int n = weights.length;
        int[][] memo = new int[n][W + 1];
        for (int[] row : memo) Arrays.fill(row, -1);
        return solveMemo(n - 1, W, weights, values, memo);
    }

    private static int solveMemo(int idx, int remainingW, int[] weights, int[] values, int[][] memo) {
        if (idx < 0 || remainingW <= 0) return 0;
        if (memo[idx][remainingW] != -1) return memo[idx][remainingW];

        int exclude = solveMemo(idx - 1, remainingW, weights, values, memo);
        int include = 0;
        if (weights[idx] <= remainingW) {
            include = values[idx] + solveMemo(idx - 1, remainingW - weights[idx], weights, values, memo);
        }

        return memo[idx][remainingW] = Math.max(include, exclude);
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 🎒 0/1 KNAPSACK DYNAMIC PROGRAMMING DEMONSTRATION");
        System.out.println("==================================================\n");

        int[] values = {60, 100, 120};
        int[] weights = {10, 20, 30};
        int W = 50;

        int maxValTab = knapsackTabulation(weights, values, W);
        int maxValMemo = knapsackMemoization(weights, values, W);

        System.out.println("Values:  " + Arrays.toString(values));
        System.out.println("Weights: " + Arrays.toString(weights));
        System.out.println("Capacity W = " + W);

        System.out.println("\n1. Bottom-Up Tabulation Result: " + maxValTab);
        System.out.println("2. Top-Down Memoization Result: " + maxValMemo);

        assert maxValTab == maxValMemo;
        System.out.println("\n✅ 0/1 Knapsack tests completed successfully!");
    }
}

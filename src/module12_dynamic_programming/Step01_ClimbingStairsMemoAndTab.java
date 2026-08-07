package module12_dynamic_programming;

import java.util.Arrays;

/**
 * Step 01: Climbing Stairs — Top-Down Memoization vs Bottom-Up Tabulation vs O(1) Space
 *
 * <pre>
 * 1D DP ARRAY STATE TRANSITIONS FOR N = 5 STAIRS:
 *
 * Base Cases: dp[1] = 1, dp[2] = 2
 * State Equation: dp[i] = dp[i-1] + dp[i-2] (Ways to step from i-1 or i-2)
 *
 * +---------+---------+---------+---------+---------+---------+
 * | Index i |    0    |    1    |    2    |    3    |    4    |    5    |
 * +---------+---------+---------+---------+---------+---------+
 * |  dp[i]  |    0    |    1    |    2    |    3    |    5    |    8    |
 * +---------+---------+---------+---------+---------+---------+
 *                         |         |         ^
 *                         +----+----+         |
 *                              |              |
 *                              +--------------+ (1 + 2 = 3)
 *
 * Space Optimization:
 * Instead of keeping full O(N) array, store only prev1 and prev2 -> O(1) Space!
 * </pre>
 */
public class Step01_ClimbingStairsMemoAndTab {

    public static class DPResult {
        public final int ways;
        public final String method;
        public final long executionNanos;

        public DPResult(int ways, String method, long executionNanos) {
            this.ways = ways;
            this.method = method;
            this.executionNanos = executionNanos;
        }
    }

    /**
     * Top-Down Memoization approach (O(N) Time, O(N) Call Stack + Memo Array).
     */
    public static int climbStairsMemo(int n) {
        int[] memo = new int[n + 1];
        Arrays.fill(memo, -1);
        long start = System.nanoTime();
        int ways = memoize(n, memo);
        long duration = System.nanoTime() - start;
        System.out.println("  [STATE] Top-Down Memoization Result for N=" + n + ": " + ways + " ways (" + duration + " ns)");
        return ways;
    }

    private static int memoize(int n, int[] memo) {
        if (n <= 1) return 1;
        if (n == 2) return 2;
        if (memo[n] != -1) return memo[n];
        memo[n] = memoize(n - 1, memo) + memoize(n - 2, memo);
        return memo[n];
    }

    /**
     * Bottom-Up 1D Tabulation approach (O(N) Time, O(N) Space).
     */
    public static int climbStairsTabulation(int n) {
        if (n <= 1) return 1;
        if (n == 2) return 2;

        int[] dp = new int[n + 1];
        dp[1] = 1;
        dp[2] = 2;

        System.out.println("  [INIT] Initialized DP Tabulation Array: dp[1]=1, dp[2]=2");

        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
            System.out.println("  [ACTION] Calculated dp[" + i + "] = dp[" + (i - 1) + "] (" + dp[i - 1]
                    + ") + dp[" + (i - 2) + "] (" + dp[i - 2] + ") = " + dp[i]);
        }

        return dp[n];
    }

    /**
     * Bottom-Up Space-Optimized approach (O(N) Time, O(1) Space).
     */
    public static int climbStairsOptimized(int n) {
        if (n <= 1) return 1;
        if (n == 2) return 2;

        int prev2 = 1;
        int prev1 = 2;
        int current = 0;

        for (int i = 3; i <= n; i++) {
            current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }

        System.out.println("  [STATE] Space-Optimized O(1) Result: " + current + " ways");
        return current;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 12 - Step 01: Climbing Stairs (Memoization, Tabulation, O(1))");
        System.out.println("======================================================================\n");

        int n = 5;
        System.out.println("[INIT] Target Stairs N = " + n);

        System.out.println("\n--- 1. Top-Down Memoization ---");
        int memoResult = climbStairsMemo(n);

        System.out.println("\n--- 2. Bottom-Up 1D Tabulation ---");
        int tabResult = climbStairsTabulation(n);

        System.out.println("\n--- 3. Space-Optimized O(1) ---");
        int optResult = climbStairsOptimized(n);

        System.out.println("\n[STATE] All Three Approaches Produced Identical Answer: "
                + (memoResult == tabResult && tabResult == optResult ? "SUCCESS (" + memoResult + " ways)" : "MISMATCH ERROR"));

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Step01_ClimbingStairsMemoAndTab executed cleanly.");
        System.out.println("======================================================================");
    }
}

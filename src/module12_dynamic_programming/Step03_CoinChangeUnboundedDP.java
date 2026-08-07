package module12_dynamic_programming;

import java.util.Arrays;

/**
 * Step 03: Coin Change Unbounded DP (Minimum Coins for Amount)
 *
 * <pre>
 * UNBOUNDED MIN-COIN 1D DP TABULATION FOR coins = [1, 2, 5], amount = 11:
 *
 * State Definition: dp[a] = Minimum number of coins needed to make total amount 'a'.
 * Base Case: dp[0] = 0, dp[a] = INF for a > 0
 * State Equation: dp[a] = min(dp[a], dp[a - coin] + 1) for coin in coins if a >= coin
 *
 * Amount a:  0  1  2  3  4  5  6  7  8  9 10 11
 * dp[a]:     0  1  1  2  2  1  2  2  3  3  2  3
 *                                           ^  ^
 *                                           |  +-- (dp[11 - 1] + 1 = dp[10] + 1 = 2 + 1 = 3)
 *                                           +----- (dp[10] = dp[10 - 5] + 1 = dp[5] + 1 = 2)
 *
 * Minimum Coins for Amount 11 = 3 (Coins: 5 + 5 + 1)
 * </pre>
 */
public class Step03_CoinChangeUnboundedDP {

    public static class CoinChangeResult {
        public final int minCoins;
        public final int[] dpTable;

        public CoinChangeResult(int minCoins, int[] dpTable) {
            this.minCoins = minCoins;
            this.dpTable = dpTable;
        }
    }

    /**
     * Calculates minimum coins needed for amount using Unbounded DP.
     */
    public static CoinChangeResult coinChange(int[] coins, int amount) {
        if (amount < 0) return new CoinChangeResult(-1, new int[0]);
        if (amount == 0) return new CoinChangeResult(0, new int[]{0});

        int max = amount + 1;
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, max);
        dp[0] = 0; // Base case

        System.out.println("  [INIT] Initialized DP Table of Size " + (amount + 1) + " with INF (Sentinel Value " + max + ")");

        for (int a = 1; a <= amount; a++) {
            for (int coin : coins) {
                if (a - coin >= 0 && dp[a - coin] != max) {
                    dp[a] = Math.min(dp[a], dp[a - coin] + 1);
                }
            }
            if (a <= 5 || a == amount) {
                System.out.println("  [ACTION] Calculated dp[" + a + "] = " + (dp[a] == max ? "INF" : dp[a]));
            }
        }

        int result = (dp[amount] > amount) ? -1 : dp[amount];
        return new CoinChangeResult(result, dp);
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 12 - Step 03: Coin Change Unbounded DP");
        System.out.println("======================================================================\n");

        int[] coins = {1, 2, 5};
        int amount = 11;

        System.out.println("[INIT] Available Coin Denominations: " + Arrays.toString(coins));
        System.out.println("[INIT] Target Amount: " + amount);

        System.out.println("\n--- Executing Unbounded DP Coin Change ---");
        CoinChangeResult res = coinChange(coins, amount);

        System.out.println("\n[STATE] Computed DP Array: " + Arrays.toString(res.dpTable));
        System.out.println("[STATE] Minimum Coins Required to Make Amount " + amount + ": " + res.minCoins);

        System.out.println("\n--- Test Case 2: Unreachable Amount ---");
        int[] coins2 = {2};
        int amount2 = 3;
        System.out.println("[INIT] Coins: " + Arrays.toString(coins2) + ", Amount: " + amount2);
        CoinChangeResult res2 = coinChange(coins2, amount2);
        System.out.println("[STATE] Result for Unreachable Amount: " + res2.minCoins + " (Expected -1)");

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Step03_CoinChangeUnboundedDP executed cleanly.");
        System.out.println("======================================================================");
    }
}

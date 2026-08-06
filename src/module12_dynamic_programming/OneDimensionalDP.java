package module12_dynamic_programming;

import java.util.Arrays;

/**
 * 1D Dynamic Programming Problems:
 * 1. Climbing Stairs - O(N) Time, O(1) Space
 * 2. House Robber - O(N) Time, O(1) Space
 * 3. Coin Change (Min coins for amount) - O(N * Amount)
 */
public class OneDimensionalDP {

    /**
     * You are climbing a staircase taking 1 or 2 steps. How many distinct ways to reach top?
     * DP Relation: dp[i] = dp[i-1] + dp[i-2]
     */
    public static int climbStairs(int n) {
        if (n <= 2) return n;
        int prev2 = 1;
        int prev1 = 2;

        for (int i = 3; i <= n; i++) {
            int curr = prev1 + prev2;
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }

    /**
     * Rob houses along a street without robbing two adjacent houses.
     * DP Relation: dp[i] = max(dp[i-1], nums[i] + dp[i-2])
     */
    public static int rob(int[] nums) {
        if (nums.length == 0) return 0;
        int robPrev2 = 0;
        int robPrev1 = 0;

        for (int num : nums) {
            int currentRob = Math.max(robPrev1, robPrev2 + num);
            robPrev2 = robPrev1;
            robPrev1 = currentRob;
        }
        return robPrev1;
    }

    /**
     * Fewest number of coins needed to make up amount. Returns -1 if impossible.
     */
    public static int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;

        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i >= coin) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }

        return dp[amount] > amount ? -1 : dp[amount];
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 🪜 1D DYNAMIC PROGRAMMING DEMONSTRATION");
        System.out.println("==================================================\n");

        int stairs = 5;
        System.out.printf("1. Climbing Stairs (N=%d): %d distinct ways%n", stairs, climbStairs(stairs));

        int[] houseValues = {2, 7, 9, 3, 1};
        System.out.printf("2. House Robber for %s: Max loot = $%d%n", Arrays.toString(houseValues), rob(houseValues));

        int[] coins = {1, 2, 5};
        int amount = 11;
        System.out.printf("3. Coin Change for amount=%d with coins %s: Min coins needed = %d%n",
                amount, Arrays.toString(coins), coinChange(coins, amount));

        System.out.println("\n✅ 1D DP test passed!");
    }
}

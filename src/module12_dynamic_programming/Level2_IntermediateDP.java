package module12_dynamic_programming;

import java.util.Arrays;

/**
 * LEVEL 2 (INTERMEDIATE): Coin Change (LeetCode 322) & Longest Increasing Subsequence (LeetCode 300)
 */
public class Level2_IntermediateDP {

    // 1. Coin Change - O(N * Amount) Time
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

    // 2. Longest Increasing Subsequence (LIS) - O(N^2) DP
    public static int lengthOfLIS(int[] nums) {
        if (nums.length == 0) return 0;
        int[] dp = new int[nums.length];
        Arrays.fill(dp, 1);
        int maxLIS = 1;

        for (int i = 1; i < nums.length; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[i] > nums[j]) {
                    dp[i] = Math.max(dp[i], dp[j] + 1);
                }
            }
            maxLIS = Math.max(maxLIS, dp[i]);
        }
        return maxLIS;
    }

    public static void main(String[] args) {
        System.out.println("--- Module 12: Level 2 (Intermediate DP) ---");
        int[] coins = {1, 2, 5};
        int amount = 11;
        System.out.println("Min coins for amount " + amount + ": " + coinChange(coins, amount)); // 3

        int[] nums = {10, 9, 2, 5, 3, 7, 101, 18};
        System.out.println("Longest Increasing Subsequence length: " + lengthOfLIS(nums)); // 4 ([2, 3, 7, 101])
    }
}

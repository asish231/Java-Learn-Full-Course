package module02_arrays_and_strings;

import java.util.Arrays;

/**
 * Kadane's algorithm and the best-time-to-buy-sell-stock family.
 *
 * Topics covered:
 *   - Maximum subarray sum (Kadane's)
 *   - Best time to buy and sell stock (single transaction)
 *   - Best time to buy and sell stock II (unlimited transactions, greedy)
 */
public class KadaneAndStock {

    public static int maxSubArraySum(int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        int maxSoFar = nums[0], maxEndingHere = nums[0];
        for (int i = 1; i < nums.length; i++) {
            maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
            maxSoFar = Math.max(maxSoFar, maxEndingHere);
        }
        return maxSoFar;
    }

    public static int maxProfitSingle(int[] prices) {
        int minPrice = Integer.MAX_VALUE, maxProfit = 0;
        for (int p : prices) {
            minPrice = Math.min(minPrice, p);
            maxProfit = Math.max(maxProfit, p - minPrice);
        }
        return maxProfit;
    }

    public static int maxProfitUnlimited(int[] prices) {
        int profit = 0;
        for (int i = 1; i < prices.length; i++) {
            if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
        }
        return profit;
    }

    public static void main(String[] args) {
        System.out.println("--- Kadane and Stock Problems ---");
        int[] nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
        System.out.println("Maximum subarray sum of " + Arrays.toString(nums) + ": " + maxSubArraySum(nums));

        int[] prices = {7, 1, 5, 3, 6, 4};
        System.out.println("Max profit (single transaction): " + maxProfitSingle(prices));
        System.out.println("Max profit (unlimited transactions): " + maxProfitUnlimited(prices));
    }
}

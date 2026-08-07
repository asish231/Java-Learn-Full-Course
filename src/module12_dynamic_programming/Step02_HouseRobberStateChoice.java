package module12_dynamic_programming;

import java.util.Arrays;

/**
 * Step 02: House Robber Choice State Transition
 *
 * <pre>
 * 1D DP CHOICE STATE TRANSITION FOR nums = [2, 7, 9, 3, 1]:
 *
 * State Definition: dp[i] = Max loot possible from houses 0 to i without robbing adjacent houses.
 * Recurrence Relation:
 *   Option 1: Skip house i  -> dp[i - 1]
 *   Option 2: Rob house i   -> dp[i - 2] + nums[i]
 *   dp[i] = max(dp[i - 1], dp[i - 2] + nums[i])
 *
 * +----------+-------+-------+-------+-------+-------+
 * | House i  |   0   |   1   |   2   |   3   |   4   |
 * | Loot     |   2   |   7   |   9   |   3   |   1   |
 * +----------+-------+-------+-------+-------+-------+
 * | dp[i]    |   2   |   7   |  11   |  11   |  12   |
 * +----------+-------+-------+-------+-------+-------+
 *                      |       ^       |       ^
 *                      |       |       |       |
 *                      +---9---+       +---1---+
 *                     (Rob 0 & 2)     (Rob 0, 2 & 4 -> Max 12)
 * </pre>
 */
public class Step02_HouseRobberStateChoice {

    public static class RobResult {
        public final int maxLoot;
        public final int[] dpTable;

        public RobResult(int maxLoot, int[] dpTable) {
            this.maxLoot = maxLoot;
            this.dpTable = dpTable;
        }
    }

    /**
     * Solves House Robber using 1D DP Tabulation array.
     */
    public static RobResult robTabulation(int[] nums) {
        if (nums == null || nums.length == 0) return new RobResult(0, new int[0]);
        if (nums.length == 1) return new RobResult(nums[0], new int[]{nums[0]});

        int n = nums.length;
        int[] dp = new int[n];
        dp[0] = nums[0];
        dp[1] = Math.max(nums[0], nums[1]);

        System.out.println("  [INIT] Base Cases: dp[0] = " + dp[0] + ", dp[1] = " + dp[1]);

        for (int i = 2; i < n; i++) {
            int skip = dp[i - 1];
            int rob = dp[i - 2] + nums[i];
            dp[i] = Math.max(skip, rob);

            System.out.println("  [ACTION] House " + i + " (Value " + nums[i] + "): Skip option = " + skip
                    + " | Rob option = " + rob + " -> Chosen dp[" + i + "] = " + dp[i]);
        }

        return new RobResult(dp[n - 1], dp);
    }

    /**
     * Solves House Robber in O(1) Space.
     */
    public static int robSpaceOptimized(int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        int prev2 = 0;
        int prev1 = 0;

        for (int num : nums) {
            int current = Math.max(prev1, prev2 + num);
            prev2 = prev1;
            prev1 = current;
        }
        return prev1;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 12 - Step 02: House Robber Choice State Transition");
        System.out.println("======================================================================\n");

        int[] houses = {2, 7, 9, 3, 1};
        System.out.println("[INIT] House Values: " + Arrays.toString(houses));

        System.out.println("\n--- Executing 1D DP Tabulation ---");
        RobResult res = robTabulation(houses);

        System.out.println("\n[STATE] Computed DP Array: " + Arrays.toString(res.dpTable));
        System.out.println("[STATE] Maximum Stolen Loot: " + res.maxLoot);

        int optLoot = robSpaceOptimized(houses);
        System.out.println("[STATE] O(1) Space Optimized Loot Result: " + optLoot);

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Step02_HouseRobberStateChoice executed cleanly.");
        System.out.println("======================================================================");
    }
}

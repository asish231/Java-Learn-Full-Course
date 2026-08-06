package module12_dynamic_programming;

/**
 * LEVEL 1 (BASIC): Climbing Stairs (LeetCode 70) & House Robber (LeetCode 198)
 */
public class Level1_BasicDP {

    // 1. Climbing Stairs - O(N) Time, O(1) Space
    public static int climbStairs(int n) {
        if (n <= 2) return n;
        int prev2 = 1, prev1 = 2;
        for (int i = 3; i <= n; i++) {
            int curr = prev1 + prev2;
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }

    // 2. House Robber - O(N) Time, O(1) Space
    public static int rob(int[] nums) {
        int rob1 = 0, rob2 = 0;
        for (int num : nums) {
            int temp = Math.max(num + rob1, rob2);
            rob1 = rob2;
            rob2 = temp;
        }
        return rob2;
    }

    public static void main(String[] args) {
        System.out.println("--- Module 12: Level 1 (Basic DP) ---");
        System.out.println("Climbing 5 stairs: " + climbStairs(5) + " ways"); // 8
        int[] houseLoot = {2, 7, 9, 3, 1};
        System.out.println("Max House Loot: $" + rob(houseLoot)); // 12 (2 + 9 + 1)
    }
}

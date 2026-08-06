package module11_greedy_algorithms;

/**
 * LEVEL 2 (INTERMEDIATE): Gas Station (LeetCode 134 - Medium) & Jump Game (LeetCode 55)
 */
public class Level2_IntermediateGreedy {

    // 1. Gas Station - O(N) Time, O(1) Space
    public static int canCompleteCircuit(int[] gas, int[] cost) {
        int totalGas = 0, totalCost = 0, tank = 0, start = 0;
        for (int i = 0; i < gas.length; i++) {
            totalGas += gas[i];
            totalCost += cost[i];
            tank += gas[i] - cost[i];
            if (tank < 0) { // Cannot reach next station from 'start'
                start = i + 1;
                tank = 0;
            }
        }
        return totalGas >= totalCost ? start : -1;
    }

    // 2. Jump Game I - O(N) Time
    public static boolean canJump(int[] nums) {
        int maxReach = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > maxReach) return false;
            maxReach = Math.max(maxReach, i + nums[i]);
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println("--- Module 11: Level 2 (Intermediate Greedy) ---");
        int[] gas = {1, 2, 3, 4, 5}, cost = {3, 4, 5, 1, 2};
        System.out.println("Starting Gas Station index: " + canCompleteCircuit(gas, cost)); // 3

        int[] jumps = {2, 3, 1, 1, 4};
        System.out.println("Can reach end of jump game? " + canJump(jumps)); // true
    }
}

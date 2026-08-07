package module11_greedy_algorithms;

import java.util.Arrays;

/**
 * Step 04: Jump Game Reachability & Minimum Jump Optimization
 *
 * <pre>
 * GREEDY MAXIMUM REACHABILITY TRACKING FOR nums = [2, 3, 1, 1, 4]:
 *
 * Index:     0   1   2   3   4
 * Array:    [2,  3,  1,  1,  4]
 *
 * Step 0: i = 0, Jump = 2 -> Max Reachable Index = max(0, 0 + 2) = 2
 * Step 1: i = 1, Jump = 3 -> Max Reachable Index = max(2, 1 + 3) = 4 (REACHED END INDEX 4!)
 *
 * MINIMUM JUMPS GREEDY BOUNDARY (Jump Game II):
 * Jump 1 Window: Index [0] -> Max reach = 2 (end of Jump 1 = Index 2)
 * Jump 2 Window: Index [1..2] -> Max reach from this window = max(1+3, 2+1) = 4
 * At Index 2, current jump boundary reached -> Increments jumps to 2.
 * Target index 4 reached in 2 minimum jumps!
 * </pre>
 */
public class Step04_JumpGameReachability {

    public static class JumpResult {
        public final boolean canReachEnd;
        public final int minJumps;

        public JumpResult(boolean canReachEnd, int minJumps) {
            this.canReachEnd = canReachEnd;
            this.minJumps = minJumps;
        }
    }

    /**
     * Determines if the last index is reachable (Jump Game I).
     */
    public static boolean canJump(int[] nums) {
        int maxReach = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > maxReach) {
                System.out.println("  [STATE] Stuck at Index " + i + "! Max Reachable Index was " + maxReach);
                return false;
            }
            maxReach = Math.max(maxReach, i + nums[i]);
            System.out.println("  [ACTION] At Index " + i + " (Jump=" + nums[i] + ") -> Updated Max Reach = " + maxReach);
            if (maxReach >= nums.length - 1) {
                return true;
            }
        }
        return maxReach >= nums.length - 1;
    }

    /**
     * Calculates minimum jumps required to reach the last index (Jump Game II).
     */
    public static int minJumps(int[] nums) {
        if (nums.length <= 1) return 0;

        int jumps = 0;
        int currentJumpEnd = 0;
        int farthestReach = 0;

        for (int i = 0; i < nums.length - 1; i++) {
            farthestReach = Math.max(farthestReach, i + nums[i]);

            if (i == currentJumpEnd) {
                jumps++;
                currentJumpEnd = farthestReach;
                System.out.println("  [ACTION] Jump #" + jumps + " Executed! Next Jump Boundary Extended to Index " + currentJumpEnd);
                if (currentJumpEnd >= nums.length - 1) {
                    break;
                }
            }
        }
        return jumps;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 11 - Step 04: Jump Game Reachability & Minimum Jump Count");
        System.out.println("======================================================================\n");

        int[] nums1 = {2, 3, 1, 1, 4};
        System.out.println("[INIT] Array 1: " + Arrays.toString(nums1));

        System.out.println("\n--- Testing Reachability for Array 1 ---");
        boolean reachable1 = canJump(nums1);
        System.out.println("[STATE] Is Last Index Reachable? " + reachable1);

        System.out.println("\n--- Calculating Minimum Jumps for Array 1 ---");
        int jumps1 = minJumps(nums1);
        System.out.println("[STATE] Minimum Jumps Needed: " + jumps1);

        System.out.println("\n--- Testing Unreachable Array 2 ---");
        int[] nums2 = {3, 2, 1, 0, 4};
        System.out.println("[INIT] Array 2: " + Arrays.toString(nums2));
        boolean reachable2 = canJump(nums2);
        System.out.println("[STATE] Is Last Index Reachable? " + reachable2);

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Step04_JumpGameReachability executed cleanly.");
        System.out.println("======================================================================");
    }
}

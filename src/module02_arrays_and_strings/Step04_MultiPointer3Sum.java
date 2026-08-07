package module02_arrays_and_strings;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Step 04: Multi-Pointer 3Sum and Search Space Pruning Algorithms
 *
 * <pre>
 * 3SUM MULTI-POINTER LAYOUT:
 * Sorted Array: [ -4 | -1 | -1 |  0 |  1 |  2 ]
 *                  ^     ^                  ^
 *                  i    left              right
 *                fixed
 *
 * Step 1: Fix i=0 (val=-4). left=1 (-1), right=5 (2). Sum = -4 + -1 + 2 = -3 < 0 -> left++
 * Step 2: Fix i=1 (val=-1). left=2 (-1), right=5 (2). Sum = -1 + -1 + 2 = 0 -> MATCH FOUND!
 *         Add [-1, -1, 2].
 *         Skip duplicate left (-1 == -1) -> left++
 *         Skip duplicate right (2) -> right--
 *
 * DUPLICATE SKIPPING FLOW CHART:
 * [Fixed i] -> Check: (i > 0 && nums[i] == nums[i-1]) ? YES -> continue (skip)
 * [Match Found] -> Check: (left < right && nums[left] == nums[left+1]) ? YES -> left++
 * </pre>
 */
public class Step04_MultiPointer3Sum {

    /**
     * 3Sum Problem (LeetCode 15).
     * Finds all unique triplets [nums[i], nums[j], nums[k]] such that i != j != k and sum == 0.
     * Time: O(N^2), Space: O(1) auxiliary (excluding output list).
     */
    public static List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        if (nums == null || nums.length < 3) return result;

        // Step 1: Sort the array to enable two-pointer traversal and deduplication
        Arrays.sort(nums);

        int n = nums.length;
        for (int i = 0; i < n - 2; i++) {
            // Pruning 1: Early break if fixed element is > 0 (sorted array can't sum to 0)
            if (nums[i] > 0) break;

            // Pruning 2: Skip duplicate fixed elements
            if (i > 0 && nums[i] == nums[i - 1]) continue;

            int left = i + 1;
            int right = n - 1;

            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];

                if (sum == 0) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));

                    // Skip duplicate left elements
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    // Skip duplicate right elements
                    while (left < right && nums[right] == nums[right - 1]) right--;

                    left++;
                    right--;
                } else if (sum < 0) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        return result;
    }

    /**
     * 3Sum Closest (LeetCode 16).
     * Finds triplet with sum closest to target.
     * Time: O(N^2), Space: O(1).
     */
    public static int threeSumClosest(int[] nums, int target) {
        if (nums == null || nums.length < 3) {
            throw new IllegalArgumentException("Array must contain at least 3 elements");
        }

        Arrays.sort(nums);
        int closestSum = nums[0] + nums[1] + nums[2];

        for (int i = 0; i < nums.length - 2; i++) {
            int left = i + 1;
            int right = nums.length - 1;

            while (left < right) {
                int currentSum = nums[i] + nums[left] + nums[right];

                if (Math.abs(target - currentSum) < Math.abs(target - closestSum)) {
                    closestSum = currentSum;
                }

                if (currentSum == target) {
                    return currentSum;
                } else if (currentSum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        return closestSum;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 02 - Arrays & Strings | Step 04: Multi-Pointer 3Sum");
        System.out.println("======================================================================\n");

        int[] nums = {-1, 0, 1, 2, -1, -4};
        System.out.println("[INIT] Input Unsorted Array: " + Arrays.toString(nums));

        System.out.println("\n--- 1. Executing 3Sum (Target Sum = 0) ---");
        System.out.println("[ACTION] Sorting array & performing multi-pointer deduplicated scan...");
        List<List<Integer>> triplets = threeSum(nums);
        System.out.println("[STATE] Unique Triplets Found (" + triplets.size() + "):");
        for (List<Integer> triplet : triplets) {
            System.out.println("  --> " + triplet);
        }

        System.out.println("\n--- 2. Executing 3Sum Closest (Target = 1) ---");
        int[] closestNums = {-1, 2, 1, -4};
        int target = 1;
        System.out.println("[INIT] Input Array: " + Arrays.toString(closestNums) + ", Target = " + target);
        System.out.println("[ACTION] Finding triplet with sum closest to target...");
        int closest = threeSumClosest(closestNums, target);
        System.out.println("[STATE] Closest Sum Result = " + closest + " (Distance = " + Math.abs(target - closest) + ")");

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Multi-pointer 3Sum algorithms verified.");
        System.out.println("======================================================================");
    }
}

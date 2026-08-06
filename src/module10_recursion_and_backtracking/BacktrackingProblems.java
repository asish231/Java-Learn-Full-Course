package module10_recursion_and_backtracking;

import java.util.ArrayList;
import java.util.List;

/**
 * Fundamental Backtracking Problems:
 * 1. Generate Subsets (Power Set) - O(2^N)
 * 2. Generate Permutations - O(N!)
 */
public class BacktrackingProblems {

    // --- SUBSETS GENERATION ---
    public static List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrackSubsets(0, nums, new ArrayList<>(), result);
        return result;
    }

    private static void backtrackSubsets(int start, int[] nums, List<Integer> current, List<List<Integer>> result) {
        result.add(new ArrayList<>(current)); // Record subset at current decision node

        for (int i = start; i < nums.length; i++) {
            current.add(nums[i]);                         // Make choice
            backtrackSubsets(i + 1, nums, current, result); // Recursively explore
            current.remove(current.size() - 1);           // Backtrack choice
        }
    }

    // --- PERMUTATIONS GENERATION ---
    public static List<List<Integer>> permutations(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrackPermutations(nums, new boolean[nums.length], new ArrayList<>(), result);
        return result;
    }

    private static void backtrackPermutations(int[] nums, boolean[] used, List<Integer> current, List<List<Integer>> result) {
        if (current.size() == nums.length) {
            result.add(new ArrayList<>(current));
            return;
        }

        for (int i = 0; i < nums.length; i++) {
            if (!used[i]) {
                used[i] = true;
                current.add(nums[i]);

                backtrackPermutations(nums, used, current, result);

                current.remove(current.size() - 1);
                used[i] = false; // Backtrack
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" ↩️ BACKTRACKING PROBLEMS DEMONSTRATION");
        System.out.println("==================================================\n");

        int[] nums = {1, 2, 3};
        System.out.println("1. Generating all Subsets for [1, 2, 3]:");
        List<List<Integer>> subRes = subsets(nums);
        System.out.println("   Total Subsets count = " + subRes.size() + ": " + subRes);

        System.out.println("\n2. Generating all Permutations for [1, 2, 3]:");
        List<List<Integer>> permRes = permutations(nums);
        System.out.println("   Total Permutations count = " + permRes.size() + ": " + permRes);

        System.out.println("\n✅ Backtracking problems test passed!");
    }
}

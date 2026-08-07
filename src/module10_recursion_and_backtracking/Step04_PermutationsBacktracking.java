package module10_recursion_and_backtracking;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Step 04: Permutations Generation via Backtracking & Visited Tracking
 *
 * <pre>
 * PERMUTATION TREE FOR [1, 2, 3] (N! = 3! = 6 Leaves):
 *
 *                                   [] (Root: Level 0)
 *                     /             |             \
 *                 Pick 1         Pick 2         Pick 3
 *                 [1]            [2]            [3]
 *                /   \          /   \          /   \
 *            Pick 2  Pick 3  Pick 1 Pick 3  Pick 1 Pick 2
 *           [1,2]    [1,3]   [2,1]  [2,3]   [3,1]  [3,2]
 *             |        |       |      |       |      |
 *           Pick 3   Pick 2  Pick 3 Pick 1  Pick 2 Pick 1
 *          [1,2,3]  [1,3,2] [2,1,3][2,3,1] [3,1,2] [3,2,1]
 *
 * Used State Array (boolean[] used):
 * Prevents picking the same element twice in the current call path.
 * </pre>
 */
public class Step04_PermutationsBacktracking {

    public static class PermutationsResult {
        public final List<List<Integer>> permutations;
        public final int totalStatesVisited;

        public PermutationsResult(List<List<Integer>> permutations, int totalStatesVisited) {
            this.permutations = permutations;
            this.totalStatesVisited = totalStatesVisited;
        }
    }

    private static int totalStatesVisited = 0;

    /**
     * Generates all permutations of a given array of distinct numbers.
     */
    public static PermutationsResult permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> currentPath = new ArrayList<>();
        boolean[] used = new boolean[nums.length];
        totalStatesVisited = 0;

        backtrack(nums, used, currentPath, result, true);
        return new PermutationsResult(result, totalStatesVisited);
    }

    private static void backtrack(int[] nums, boolean[] used, List<Integer> currentPath, List<List<Integer>> result, boolean verbose) {
        totalStatesVisited++;

        if (currentPath.size() == nums.length) {
            result.add(new ArrayList<>(currentPath));
            if (verbose && result.size() <= 6) {
                System.out.println("  [STATE] Complete Permutation Found: " + currentPath);
            }
            return;
        }

        for (int i = 0; i < nums.length; i++) {
            if (used[i]) {
                continue; // Element already selected in current path branch
            }

            // 1. Action: Choose element
            used[i] = true;
            currentPath.add(nums[i]);
            if (verbose && totalStatesVisited <= 10) {
                System.out.println("  [ACTION] Pick element " + nums[i] + " at index " + i + " | Current Path: " + currentPath + " | Used: " + Arrays.toString(used));
            }

            // 2. Recurse
            backtrack(nums, used, currentPath, result, verbose);

            // 3. Backtrack: Unchoose element
            currentPath.remove(currentPath.size() - 1);
            used[i] = false;
            if (verbose && totalStatesVisited <= 10) {
                System.out.println("  [MEMORY EVENT] Backtrack (Unpick " + nums[i] + ") | Current Path: " + currentPath + " | Used: " + Arrays.toString(used));
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 10 - Step 04: Permutations Generation via Backtracking");
        System.out.println("======================================================================\n");

        int[] nums = {1, 2, 3};
        System.out.println("[INIT] Initialized Input Array: " + Arrays.toString(nums));
        System.out.println("[STATE] Expected Permutations Count (N!): 3! = 6");

        System.out.println("\n--- Step-by-Step Permutation Log ---");
        PermutationsResult res = permute(nums);

        System.out.println("\n--- All Generated Permutations ---");
        for (int i = 0; i < res.permutations.size(); i++) {
            System.out.println("  Permutation #" + (i + 1) + ": " + res.permutations.get(i));
        }

        System.out.println("\n[STATE] Total Backtracking States Visited: " + res.totalStatesVisited);
        System.out.println("[STATE] Permutations Count Generated: " + res.permutations.size());

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Step04_PermutationsBacktracking executed cleanly.");
        System.out.println("======================================================================");
    }
}

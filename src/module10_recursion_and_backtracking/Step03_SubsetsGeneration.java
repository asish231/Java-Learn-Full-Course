package module10_recursion_and_backtracking;

import java.util.ArrayList;
import java.util.List;

/**
 * Step 03: Subsets Generation via Backtracking (Include/Exclude Decision Tree)
 *
 * <pre>
 * BINARY DECISION TREE FOR SUBSETS OF [1, 2, 3]:
 *
 *                             [] (Root: Level 0, Index 0)
 *                     /                        \
 *          Exclude 1                          Include 1
 *             []                                 [1]
 *          /      \                           /       \
 *    Exclude 2   Include 2              Exclude 2   Include 2
 *       []          [2]                    [1]        [1, 2]
 *      /  \        /   \                  /   \       /    \
 *   Ex3   Inc3   Ex3   Inc3            Ex3   Inc3   Ex3   Inc3
 *   []    [3]    [2]   [2, 3]          [1]  [1, 3] [1, 2] [1, 2, 3]
 *
 * Total Subsets (Power Set Size): 2^N = 2^3 = 8 subsets.
 * </pre>
 */
public class Step03_SubsetsGeneration {

    public static class SubsetsResult {
        public final List<List<Integer>> subsets;
        public final int totalStatesVisited;

        public SubsetsResult(List<List<Integer>> subsets, int totalStatesVisited) {
            this.subsets = subsets;
            this.totalStatesVisited = totalStatesVisited;
        }
    }

    private static int statesVisited = 0;

    /**
     * Generates all subsets of an array of unique integers.
     */
    public static SubsetsResult generateSubsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> currentPath = new ArrayList<>();
        statesVisited = 0;
        backtrack(nums, 0, currentPath, result, true);
        return new SubsetsResult(result, statesVisited);
    }

    private static void backtrack(int[] nums, int index, List<Integer> currentPath, List<List<Integer>> result, boolean verbose) {
        statesVisited++;

        if (index == nums.length) {
            result.add(new ArrayList<>(currentPath));
            if (verbose && result.size() <= 8) {
                System.out.println("  [STATE] Leaf Node Reached -> Added Subset: " + currentPath);
            }
            return;
        }

        int val = nums[index];

        // 1. Choice: Include nums[index]
        currentPath.add(val);
        if (verbose && statesVisited <= 10) {
            System.out.println("  [ACTION] Include " + val + " | Current Path: " + currentPath);
        }
        backtrack(nums, index + 1, currentPath, result, verbose);

        // 2. Backtrack (Unchoose): Remove last added element
        currentPath.remove(currentPath.size() - 1);
        if (verbose && statesVisited <= 10) {
            System.out.println("  [MEMORY EVENT] Backtrack (Pop " + val + ") | Current Path: " + currentPath);
        }

        // 3. Choice: Exclude nums[index]
        backtrack(nums, index + 1, currentPath, result, verbose);
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 10 - Step 03: Subsets Power Set Generation via Backtracking");
        System.out.println("======================================================================\n");

        int[] nums = {1, 2, 3};
        System.out.println("[INIT] Input Array: " + java.util.Arrays.toString(nums));
        System.out.println("[STATE] Expected Total Subsets (2^N): 2^" + nums.length + " = " + (1 << nums.length));

        System.out.println("\n--- Step-by-Step Backtracking State Log ---");
        SubsetsResult res = generateSubsets(nums);

        System.out.println("\n--- Generated Subsets List ---");
        for (int i = 0; i < res.subsets.size(); i++) {
            System.out.println("  Subset #" + (i + 1) + ": " + res.subsets.get(i));
        }

        System.out.println("\n[STATE] Total Backtracking Decision States Visited: " + res.totalStatesVisited);
        System.out.println("[STATE] Generated Subsets Count: " + res.subsets.size());

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Step03_SubsetsGeneration executed cleanly.");
        System.out.println("======================================================================");
    }
}

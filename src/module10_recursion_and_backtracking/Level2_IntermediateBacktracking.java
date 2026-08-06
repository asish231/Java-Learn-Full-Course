package module10_recursion_and_backtracking;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * LEVEL 2 (INTERMEDIATE): Combination Sum (LeetCode 39 - Medium)
 * Backtracking template for candidate combination search.
 */
public class Level2_IntermediateBacktracking {

    public static List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(candidates);
        backtrack(0, candidates, target, new ArrayList<>(), res);
        return res;
    }

    private static void backtrack(int start, int[] candidates, int remain, List<Integer> current, List<List<Integer>> res) {
        if (remain == 0) {
            res.add(new ArrayList<>(current));
            return;
        }

        for (int i = start; i < candidates.length; i++) {
            if (candidates[i] > remain) break; // Prune search tree
            current.add(candidates[i]);
            backtrack(i, candidates, remain - candidates[i], current, res); // Reuse same element
            current.remove(current.size() - 1);
        }
    }

    public static void main(String[] args) {
        System.out.println("--- Module 10: Level 2 (Intermediate Backtracking Combination Sum) ---");
        int[] candidates = {2, 3, 6, 7};
        int target = 7;
        System.out.println("Combinations summing to " + target + " for " + Arrays.toString(candidates) + ":\n  " + combinationSum(candidates, target));
    }
}

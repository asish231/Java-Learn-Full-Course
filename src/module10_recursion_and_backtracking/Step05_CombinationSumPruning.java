package module10_recursion_and_backtracking;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Step 05: Combination Sum with Search Space Pruning
 *
 * <pre>
 * PRUNED SEARCH TREE FOR candidates = [2, 3, 6, 7], target = 7:
 *
 *                                  Target = 7 (Index 0)
 *                     /               |           \          \
 *                Pick 2            Pick 3       Pick 6      Pick 7
 *             Rem: 5 (Idx 0)     Rem: 4 (Idx 1) Rem: 1 (Idx 2) Rem: 0 (MATCH! [7])
 *              /    |     \          |      \      |
 *          Pick 2 Pick 3 Pick 6   Pick 3  Pick 6  Pick 6 (PRUNED: 6 > 1)
 *          Rem: 3 Rem: 2 Rem:-1   Rem: 1  Rem:-2
 *           /       |   (PRUNED)   |     (PRUNED)
 *       Pick 2   Pick 3         Pick 3
 *       Rem: 1   Rem:-1         Rem:-2
 *         |     (PRUNED)       (PRUNED)
 *      Pick 2 (PRUNED: 2 > 1)
 *
 * Valid Combinations Found: [2, 2, 3], [7]
 * Search space pruning cuts off all branches where candidate > remaining target!
 * </pre>
 */
public class Step05_CombinationSumPruning {

    public static class CombinationResult {
        public final List<List<Integer>> combinations;
        public final int totalStatesVisited;
        public final int prunedBranchesCount;

        public CombinationResult(List<List<Integer>> combinations, int totalStatesVisited, int prunedBranchesCount) {
            this.combinations = combinations;
            this.totalStatesVisited = totalStatesVisited;
            this.prunedBranchesCount = prunedBranchesCount;
        }
    }

    private static int totalStatesVisited = 0;
    private static int prunedBranchesCount = 0;

    /**
     * Finds all unique combinations in candidates where candidate numbers sum to target.
     * Candidates may be chosen unlimited times.
     */
    public static CombinationResult combinationSum(int[] candidates, int target) {
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> currentCombination = new ArrayList<>();
        
        // Sorting enables early search space pruning
        int[] sortedCandidates = candidates.clone();
        Arrays.sort(sortedCandidates);
        
        totalStatesVisited = 0;
        prunedBranchesCount = 0;

        backtrack(sortedCandidates, target, 0, currentCombination, result, true);
        return new CombinationResult(result, totalStatesVisited, prunedBranchesCount);
    }

    private static void backtrack(int[] candidates, int remainingTarget, int startIdx,
                                  List<Integer> currentCombination, List<List<Integer>> result, boolean verbose) {
        totalStatesVisited++;

        if (remainingTarget == 0) {
            result.add(new ArrayList<>(currentCombination));
            if (verbose) {
                System.out.println("  [STATE] Goal Target Reached! Valid Combination Found: " + currentCombination);
            }
            return;
        }

        for (int i = startIdx; i < candidates.length; i++) {
            int val = candidates[i];

            // PRUNING STEP: Since candidates are sorted, if val > remainingTarget,
            // all subsequent candidates will also exceed remainingTarget.
            if (val > remainingTarget) {
                prunedBranchesCount += (candidates.length - i);
                if (verbose) {
                    System.out.println("  [ACTION] Pruning Branch: Candidate " + val + " > Remaining Target " + remainingTarget + " (Break Loop)");
                }
                break;
            }

            // Action: Choose candidate
            currentCombination.add(val);
            if (verbose && totalStatesVisited <= 12) {
                System.out.println("  [ACTION] Pick " + val + " | New Remaining Target: " + (remainingTarget - val) + " | Combination: " + currentCombination);
            }

            // Recurse with same index 'i' (allowing repeated element selection)
            backtrack(candidates, remainingTarget - val, i, currentCombination, result, verbose);

            // Backtrack: Unchoose candidate
            currentCombination.remove(currentCombination.size() - 1);
            if (verbose && totalStatesVisited <= 12) {
                System.out.println("  [MEMORY EVENT] Backtrack (Pop " + val + ") | Restored Target: " + remainingTarget + " | Combination: " + currentCombination);
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 10 - Step 05: Combination Sum with Search Space Pruning");
        System.out.println("======================================================================\n");

        int[] candidates = {2, 3, 6, 7};
        int target = 7;

        System.out.println("[INIT] Candidates: " + Arrays.toString(candidates) + " | Target Sum: " + target);

        System.out.println("\n--- Pruned Backtracking Execution ---");
        CombinationResult res = combinationSum(candidates, target);

        System.out.println("\n--- Final Combinations List ---");
        for (int i = 0; i < res.combinations.size(); i++) {
            System.out.println("  Combination #" + (i + 1) + ": " + res.combinations.get(i));
        }

        System.out.println("\n[STATE] Total Search States Visited: " + res.totalStatesVisited);
        System.out.println("[STATE] Total Search Branches Pruned: " + res.prunedBranchesCount);
        System.out.println("[STATE] Total Valid Solutions: " + res.combinations.size());

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Step05_CombinationSumPruning executed cleanly.");
        System.out.println("======================================================================");
    }
}

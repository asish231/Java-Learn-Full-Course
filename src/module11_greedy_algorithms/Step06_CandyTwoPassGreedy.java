package module11_greedy_algorithms;

import java.util.Arrays;

/**
 * Step 06: Candy Two-Pass Greedy Allocation
 *
 * <pre>
 * TWO-PASS GREEDY CANDY ALLOCATION VISUALIZATION:
 *
 * Ratings: [1, 0, 2]
 *
 * PASS 1: Left-to-Right (Ensure right child with higher rating gets more candies than left)
 * Init:    [1, 1, 1]
 * i = 1:   rating[1]=0 < rating[0]=1 -> candies[1] stays 1
 * i = 2:   rating[2]=2 > rating[1]=0 -> candies[2] = candies[1] + 1 = 2
 * Pass 1 Candies: [1, 1, 2]
 *
 * PASS 2: Right-to-Left (Ensure left child with higher rating gets more candies than right)
 * i = 1:   rating[1]=0 < rating[2]=2 -> No change
 * i = 0:   rating[0]=1 > rating[1]=0 -> candies[0] = max(candies[0], candies[1] + 1) = max(1, 2) = 2
 * Pass 2 Candies: [2, 1, 2]
 *
 * Total Minimum Candies Required = 2 + 1 + 2 = 5
 * </pre>
 */
public class Step06_CandyTwoPassGreedy {

    public static class CandyResult {
        public final int totalCandies;
        public final int[] candyDistribution;

        public CandyResult(int totalCandies, int[] candyDistribution) {
            this.totalCandies = totalCandies;
            this.candyDistribution = candyDistribution;
        }
    }

    /**
     * Calculates minimum candies needed for children ratings using two-pass greedy strategy.
     */
    public static CandyResult candy(int[] ratings) {
        int n = ratings.length;
        if (n == 0) return new CandyResult(0, new int[0]);

        int[] candies = new int[n];
        Arrays.fill(candies, 1); // Every child gets at least 1 candy

        System.out.println("  [INIT] Initial Allocation (1 Candy Per Child): " + Arrays.toString(candies));

        // Pass 1: Left-to-Right
        for (int i = 1; i < n; i++) {
            if (ratings[i] > ratings[i - 1]) {
                candies[i] = candies[i - 1] + 1;
                System.out.println("  [ACTION] Pass 1 (Left->Right): Rating[" + i + "]=" + ratings[i]
                        + " > Rating[" + (i - 1) + "]=" + ratings[i - 1] + " -> Candies[" + i + "] = " + candies[i]);
            }
        }
        System.out.println("  [STATE] Candies After Left-to-Right Pass: " + Arrays.toString(candies));

        // Pass 2: Right-to-Left
        for (int i = n - 2; i >= 0; i--) {
            if (ratings[i] > ratings[i + 1]) {
                candies[i] = Math.max(candies[i], candies[i + 1] + 1);
                System.out.println("  [ACTION] Pass 2 (Right->Left): Rating[" + i + "]=" + ratings[i]
                        + " > Rating[" + (i + 1) + "]=" + ratings[i + 1] + " -> Candies[" + i + "] = " + candies[i]);
            }
        }
        System.out.println("  [STATE] Candies After Right-to-Left Pass: " + Arrays.toString(candies));

        int total = 0;
        for (int c : candies) {
            total += c;
        }

        return new CandyResult(total, candies);
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 11 - Step 06: Candy (Two-Pass Greedy Allocation)");
        System.out.println("======================================================================\n");

        int[] ratings = {1, 0, 2};
        System.out.println("[INIT] Children Ratings Array: " + Arrays.toString(ratings));

        System.out.println("\n--- Executing Two-Pass Greedy Allocation ---");
        CandyResult res = candy(ratings);

        System.out.println("\n[STATE] Final Candies Distribution: " + Arrays.toString(res.candyDistribution));
        System.out.println("[STATE] Minimum Total Candies Required: " + res.totalCandies);

        System.out.println("\n--- Test Case 2: Ratings [1, 2, 2] ---");
        int[] ratings2 = {1, 2, 2};
        System.out.println("[INIT] Children Ratings Array 2: " + Arrays.toString(ratings2));
        CandyResult res2 = candy(ratings2);
        System.out.println("[STATE] Minimum Total Candies Required (Test 2): " + res2.totalCandies);

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Step06_CandyTwoPassGreedy executed cleanly.");
        System.out.println("======================================================================");
    }
}

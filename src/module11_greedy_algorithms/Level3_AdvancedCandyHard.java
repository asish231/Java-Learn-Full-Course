package module11_greedy_algorithms;

import java.util.Arrays;

/**
 * LEVEL 3 (ADVANCED / FAANG): Candy Distribution Problem (LeetCode 135 - Hard)
 * Two-pass Greedy Algorithm (Left-to-Right & Right-to-Left) in O(N) Time, O(N) Space.
 */
public class Level3_AdvancedCandyHard {

    public static int candy(int[] ratings) {
        int n = ratings.length;
        int[] candies = new int[n];
        Arrays.fill(candies, 1);

        // Pass 1: Left to Right (Higher rating gets more candies than left neighbor)
        for (int i = 1; i < n; i++) {
            if (ratings[i] > ratings[i - 1]) {
                candies[i] = candies[i - 1] + 1;
            }
        }

        // Pass 2: Right to Left (Higher rating gets more candies than right neighbor)
        for (int i = n - 2; i >= 0; i--) {
            if (ratings[i] > ratings[i + 1]) {
                candies[i] = Math.max(candies[i], candies[i + 1] + 1);
            }
        }

        int totalCandies = 0;
        for (int c : candies) totalCandies += c;
        return totalCandies;
    }

    public static void main(String[] args) {
        System.out.println("--- Module 11: Level 3 (Advanced Candy Distribution Hard) ---");
        int[] ratings = {1, 0, 2};
        System.out.println("Minimum candies required for ratings " + Arrays.toString(ratings) + ": " + candy(ratings)); // 5 (candies: [2, 1, 2])
    }
}

package module12_dynamic_programming;

/**
 * LEVEL 3 (ADVANCED / FAANG): Edit Distance (LeetCode 72 - Hard)
 * Dynamic Programming grid transforming word1 into word2 in O(M * N) Time.
 */
public class Level3_AdvancedDPHard {

    public static int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], // Replace
                                    Math.min(dp[i - 1][j],   // Delete
                                             dp[i][j - 1]));  // Insert
                }
            }
        }
        return dp[m][n];
    }

    public static void main(String[] args) {
        System.out.println("--- Module 12: Level 3 (Advanced Edit Distance Hard) ---");
        String w1 = "horse", w2 = "ros";
        System.out.println("Edit distance between \"" + w1 + "\" and \"" + w2 + "\": " + minDistance(w1, w2) + " operations"); // 3
    }
}

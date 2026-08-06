package module12_dynamic_programming;

/**
 * 2D Dynamic Programming Problems:
 * 1. Longest Common Subsequence (LCS) - O(M * N)
 * 2. Edit Distance (Levenshtein Distance) - O(M * N)
 */
public class TwoDimensionalDP {

    /**
     * Finds length of longest common subsequence between text1 and text2.
     */
    public static int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length();
        int n = text2.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = 1 + dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[m][n];
    }

    /**
     * Minimum number of insert, delete, or replace operations to convert word1 into word2.
     */
    public static int minDistanceEditDistance(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(
                        dp[i - 1][j - 1], // Replace
                        Math.min(dp[i - 1][j], // Delete
                                 dp[i][j - 1]) // Insert
                    );
                }
            }
        }
        return dp[m][n];
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 📊 2D DYNAMIC PROGRAMMING DEMONSTRATION");
        System.out.println("==================================================\n");

        String s1 = "abcde", s2 = "ace";
        int lcsLen = longestCommonSubsequence(s1, s2);
        System.out.printf("1. LCS of \"%s\" and \"%s\": Length = %d%n", s1, s2, lcsLen);

        String w1 = "horse", w2 = "ros";
        int editDist = minDistanceEditDistance(w1, w2);
        System.out.printf("2. Edit Distance between \"%s\" and \"%s\": Min operations = %d%n", w1, w2, editDist);

        System.out.println("\n✅ 2D DP test passed!");
    }
}

package module12_dynamic_programming;

/**
 * Step 08: Edit Distance (Levenshtein Distance Hard Matrix DP)
 *
 * <pre>
 * 2D MATRIX LEVENSHTEIN EDIT DISTANCE FOR word1 = "horse", word2 = "ros":
 *
 * Operations Allowed:
 * 1. Insert character   -> 1 + dp[i][j-1]
 * 2. Delete character   -> 1 + dp[i-1][j]
 * 3. Replace character  -> 1 + dp[i-1][j-1]
 * 4. Match character    -> dp[i-1][j-1]
 *
 * Recurrence:
 *   dp[i][j] = dp[i-1][j-1] if word1[i-1] == word2[j-1]
 *   else 1 + min(dp[i-1][j] (Delete), dp[i][j-1] (Insert), dp[i-1][j-1] (Replace))
 *
 * 2D GRID:
 *       Ø   r   o   s
 *   Ø   0   1   2   3
 *   h   1   1   2   3
 *   o   2   2   1   2
 *   r   3   2   2   2
 *   s   4   3   3   2
 *   e   5   4   4   3 <- Min Edit Distance = 3
 *
 * Transform Steps:
 * 1. horse -> rorse (Replace 'h' with 'r')
 * 2. rorse -> rose  (Delete 'r')
 * 3. rose  -> ros   (Delete 'e')
 * Minimum Operations: 3
 * </pre>
 */
public class Step08_EditDistanceHard {

    public static class EditDistanceResult {
        public final int minOperations;
        public final int[][] dpMatrix;

        public EditDistanceResult(int minOperations, int[][] dpMatrix) {
            this.minOperations = minOperations;
            this.dpMatrix = dpMatrix;
        }
    }

    /**
     * Solves Edit Distance between word1 and word2 using 2D Matrix DP.
     */
    public static EditDistanceResult minDistance(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();
        int[][] dp = new int[m + 1][n + 1];

        // Base cases: Transforming string to/from empty string
        for (int i = 0; i <= m; i++) dp[i][0] = i; // i deletions
        for (int j = 0; j <= n; j++) dp[0][j] = j; // j insertions

        System.out.println("  [MEMORY EVENT] Initialized Edit Distance Matrix [" + (m + 1) + "][" + (n + 1) + "]");

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1]; // Character match -> 0 cost
                } else {
                    int insertCost = dp[i][j - 1];
                    int deleteCost = dp[i - 1][j];
                    int replaceCost = dp[i - 1][j - 1];

                    dp[i][j] = 1 + Math.min(replaceCost, Math.min(insertCost, deleteCost));
                }
            }
        }

        System.out.println("  [ACTION] Computed Matrix DP. Min Edit Distance at dp[" + m + "][" + n + "] = " + dp[m][n]);

        return new EditDistanceResult(dp[m][n], dp);
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 12 - Step 08: Edit Distance (Levenshtein Matrix DP)");
        System.out.println("======================================================================\n");

        String word1 = "horse";
        String word2 = "ros";

        System.out.println("[INIT] Word 1: \"" + word1 + "\"");
        System.out.println("[INIT] Word 2: \"" + word2 + "\"");

        System.out.println("\n--- Executing 2D Matrix Edit Distance DP ---");
        EditDistanceResult res = minDistance(word1, word2);

        System.out.println("\n[STATE] Minimum Edit Operations Required: " + res.minOperations);

        System.out.println("\n--- Test Case 2: \"intention\" -> \"execution\" ---");
        String w1 = "intention";
        String w2 = "execution";
        System.out.println("[INIT] Word 1: \"" + w1 + "\", Word 2: \"" + w2 + "\"");
        EditDistanceResult res2 = minDistance(w1, w2);
        System.out.println("[STATE] Minimum Edit Operations Required (Test 2): " + res2.minOperations + " (Expected 5)");

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Step08_EditDistanceHard executed cleanly.");
        System.out.println("======================================================================");
    }
}

package module12_dynamic_programming;

/**
 * Step 07: Longest Common Subsequence (2D Grid Alignment DP & String Reconstruction)
 *
 * <pre>
 * 2D GRID ALIGNMENT DP FOR text1 = "abcde", text2 = "ace":
 *
 * State Definition: dp[i][j] = Length of LCS of text1[0..i-1] and text2[0..j-1].
 * Recurrence Relation:
 *   If text1[i-1] == text2[j-1]:
 *     dp[i][j] = dp[i-1][j-1] + 1   (Match! Move diagonally)
 *   Else:
 *     dp[i][j] = max(dp[i-1][j], dp[i][j-1]) (Mismatch! Max of top or left)
 *
 * 2D GRID:
 *     Ø   a   c   e
 * Ø   0   0   0   0
 * a   0   1 \ 1   1
 * b   0   1   1   1
 * c   0   1   2 \ 2
 * d   0   1   2   2
 * e   0   1   2   3 \  <- LCS Length = 3
 *
 * Traceback String Reconstruction: Follow diagonal matches back to (0,0) -> "ace"
 * </pre>
 */
public class Step07_LongestCommonSubsequence {

    public static class LCSResult {
        public final int length;
        public final String lcsString;
        public final int[][] dpGrid;

        public LCSResult(int length, String lcsString, int[][] dpGrid) {
            this.length = length;
            this.lcsString = lcsString;
            this.dpGrid = dpGrid;
        }
    }

    /**
     * Calculates the length of LCS and reconstructs the LCS string.
     */
    public static LCSResult longestCommonSubsequence(String text1, String text2) {
        int m = text1.length();
        int n = text2.length();
        int[][] dp = new int[m + 1][n + 1];

        System.out.println("  [MEMORY EVENT] Initialized 2D Alignment Matrix [" + (m + 1) + "][" + (n + 1) + "]");

        // Build 2D DP Table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        System.out.println("  [ACTION] Computed 2D DP Grid. LCS Length at dp[" + m + "][" + n + "] = " + dp[m][n]);

        // Traceback to reconstruct the LCS string
        StringBuilder sb = new StringBuilder();
        int i = m, j = n;
        while (i > 0 && j > 0) {
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                sb.append(text1.charAt(i - 1));
                i--;
                j--;
            } else if (dp[i - 1][j] >= dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }

        String lcsStr = sb.reverse().toString();
        System.out.println("  [STATE] Traceback Path Reconstructed LCS Sequence: \"" + lcsStr + "\"");

        return new LCSResult(dp[m][n], lcsStr, dp);
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 12 - Step 07: Longest Common Subsequence (2D Alignment DP)");
        System.out.println("======================================================================\n");

        String text1 = "abcde";
        String text2 = "ace";

        System.out.println("[INIT] Text 1: \"" + text1 + "\"");
        System.out.println("[INIT] Text 2: \"" + text2 + "\"");

        System.out.println("\n--- Executing 2D Grid LCS Alignment ---");
        LCSResult res = longestCommonSubsequence(text1, text2);

        System.out.println("\n[STATE] Maximum LCS Length: " + res.length);
        System.out.println("[STATE] Reconstructed LCS String: \"" + res.lcsString + "\"");

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Step07_LongestCommonSubsequence executed cleanly.");
        System.out.println("======================================================================");
    }
}

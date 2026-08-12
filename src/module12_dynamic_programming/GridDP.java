package module12_dynamic_programming;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * 2D grid dynamic programming.
 *
 * Topics covered:
 *   - Unique paths (robot in a grid) - LeetCode 62
 *   - Minimum path sum - LeetCode 64
 *   - Word break - LeetCode 139
 *   - Partition equal subset sum - LeetCode 416
 */
public class GridDP {

    public static int uniquePaths(int m, int n) {
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) dp[j] += dp[j - 1];
        }
        return dp[n - 1];
    }

    public static int minPathSum(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int[] dp = new int[n];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        for (int i = 0; i < m; i++) {
            dp[0] += grid[i][0];
            for (int j = 1; j < n; j++) dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j];
        }
        return dp[n - 1];
    }

    public static boolean wordBreak(String s, String[] wordDict) {
        Set<String> set = new HashSet<>(Arrays.asList(wordDict));
        boolean[] dp = new boolean[s.length() + 1];
        dp[0] = true;
        for (int i = 1; i <= s.length(); i++) {
            for (int j = 0; j < i && !dp[i]; j++) {
                if (dp[j] && set.contains(s.substring(j, i))) dp[i] = true;
            }
        }
        return dp[s.length()];
    }

    public static boolean canPartition(int[] nums) {
        int sum = 0;
        for (int x : nums) sum += x;
        if (sum % 2 != 0) return false;
        int target = sum / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        for (int num : nums) {
            for (int j = target; j >= num; j--) dp[j] |= dp[j - num];
        }
        return dp[target];
    }

    public static void main(String[] args) {
        System.out.println("--- Grid / 2D DP ---");
        System.out.println("Unique paths in 3x7 grid: " + uniquePaths(3, 7));
        int[][] grid = {{1, 3, 1}, {1, 5, 1}, {4, 2, 1}};
        System.out.println("Min path sum: " + minPathSum(grid));
        System.out.println("Word break \"leetcode\" with [leet, code]: " + wordBreak("leetcode", new String[]{"leet", "code"}));
        System.out.println("Partition [1,5,11,5] equally: " + canPartition(new int[]{1, 5, 11, 5}));
    }
}

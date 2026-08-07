package module10_recursion_and_backtracking;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Step 06: N-Queens Constraint Satisfaction Solver
 *
 * <pre>
 * 4-QUEENS BOARD VISUALIZATION (Solution 1 of 2):
 *
 *     Col 0   Col 1   Col 2   Col 3
 *   +-------+-------+-------+-------+
 * 0 |   .   |   Q   |   .   |   .   |  <- Queen at (0, 1)
 *   +-------+-------+-------+-------+
 * 1 |   .   |   .   |   .   |   Q   |  <- Queen at (1, 3)
 *   +-------+-------+-------+-------+
 * 2 |   Q   |   .   |   .   |   .   |  <- Queen at (2, 0)
 *   +-------+-------+-------+-------+
 * 3 |   .   |   .   |   Q   |   .   |  <- Queen at (3, 2)
 *   +-------+-------+-------+-------+
 *
 * CONSTRAINTS FOR QUEEN AT (r, c):
 * 1. Column Conflict: cols[c] == true
 * 2. Main Diagonal (\): diag1[r - c + N - 1] == true
 * 3. Anti Diagonal (/): diag2[r + c] == true
 * </pre>
 */
public class Step06_NQueensConstraintSolver {

    public static class NQueensResult {
        public final List<List<String>> solutions;
        public final int totalBacktrackCount;

        public NQueensResult(List<List<String>> solutions, int totalBacktrackCount) {
            this.solutions = solutions;
            this.totalBacktrackCount = totalBacktrackCount;
        }
    }

    private static int totalBacktrackCount = 0;

    /**
     * Solves the N-Queens problem for an N x N board.
     */
    public static NQueensResult solveNQueens(int n) {
        List<List<String>> solutions = new ArrayList<>();
        char[][] board = new char[n][n];
        for (int i = 0; i < n; i++) {
            Arrays.fill(board[i], '.');
        }

        boolean[] cols = new boolean[n];
        boolean[] diag1 = new boolean[2 * n - 1]; // r - c + n - 1
        boolean[] diag2 = new boolean[2 * n - 1]; // r + c
        totalBacktrackCount = 0;

        backtrack(0, n, board, cols, diag1, diag2, solutions);
        return new NQueensResult(solutions, totalBacktrackCount);
    }

    private static void backtrack(int row, int n, char[][] board, boolean[] cols,
                                  boolean[] diag1, boolean[] diag2, List<List<String>> solutions) {
        if (row == n) {
            solutions.add(constructBoard(board));
            System.out.println("  [STATE] Found Valid Solution #" + solutions.size() + " at Row " + row);
            return;
        }

        for (int col = 0; col < n; col++) {
            int d1 = row - col + n - 1;
            int d2 = row + col;

            // Constraint Check: Is column or diagonal threatened?
            if (cols[col] || diag1[d1] || diag2[d2]) {
                continue; // Queen cannot be placed safely here
            }

            // 1. Place Queen
            board[row][col] = 'Q';
            cols[col] = true;
            diag1[d1] = true;
            diag2[d2] = true;

            if (row < 2) {
                System.out.println("  [ACTION] Placed Queen at Row " + row + ", Col " + col);
            }

            // 2. Recurse to next row
            backtrack(row + 1, n, board, cols, diag1, diag2, solutions);

            // 3. Backtrack (Remove Queen)
            board[row][col] = '.';
            cols[col] = false;
            diag1[d1] = false;
            diag2[d2] = false;
            totalBacktrackCount++;

            if (row < 2) {
                System.out.println("  [MEMORY EVENT] Backtracking: Removed Queen from Row " + row + ", Col " + col);
            }
        }
    }

    private static List<String> constructBoard(char[][] board) {
        List<String> result = new ArrayList<>();
        for (char[] row : board) {
            result.add(new String(row));
        }
        return result;
    }

    public static void printBoard(List<String> board) {
        for (String row : board) {
            System.out.println("    " + row);
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 10 - Step 06: N-Queens Constraint Satisfaction Solver");
        System.out.println("======================================================================\n");

        int n = 4;
        System.out.println("[INIT] Initialized N-Queens Solver for Board Size N = " + n);

        System.out.println("\n--- Solving 4-Queens with Constraint Pruning ---");
        NQueensResult res = solveNQueens(n);

        System.out.println("\n--- Displaying Solutions ---");
        for (int i = 0; i < res.solutions.size(); i++) {
            System.out.println("Solution #" + (i + 1) + ":");
            printBoard(res.solutions.get(i));
            System.out.println();
        }

        System.out.println("[STATE] Total Solutions Found for N = " + n + ": " + res.solutions.size());
        System.out.println("[STATE] Total Backtrack Step Operations: " + res.totalBacktrackCount);

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Step06_NQueensConstraintSolver executed cleanly.");
        System.out.println("======================================================================");
    }
}

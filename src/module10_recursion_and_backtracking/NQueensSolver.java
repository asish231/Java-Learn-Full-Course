package module10_recursion_and_backtracking;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * N-Queens Problem Solver using Backtracking.
 * Places N Queens on an N x N chessboard such that no two queens attack each other.
 */
public class NQueensSolver {

    public static List<List<String>> solveNQueens(int n) {
        List<List<String>> solutions = new ArrayList<>();
        char[][] board = new char[n][n];
        for (char[] row : board) Arrays.fill(row, '.');

        boolean[] cols = new boolean[n];
        boolean[] diag1 = new boolean[2 * n]; // row + col
        boolean[] diag2 = new boolean[2 * n]; // row - col + n

        backtrack(0, n, board, cols, diag1, diag2, solutions);
        return solutions;
    }

    private static void backtrack(int row, int n, char[][] board, boolean[] cols,
                                  boolean[] diag1, boolean[] diag2, List<List<String>> solutions) {
        if (row == n) {
            solutions.add(constructBoard(board));
            return;
        }

        for (int col = 0; col < n; col++) {
            int d1 = row + col;
            int d2 = row - col + n;

            if (cols[col] || diag1[d1] || diag2[d2]) continue;

            // Place queen
            board[row][col] = 'Q';
            cols[col] = diag1[d1] = diag2[d2] = true;

            // Explore next row
            backtrack(row + 1, n, board, cols, diag1, diag2, solutions);

            // Backtrack
            board[row][col] = '.';
            cols[col] = diag1[d1] = diag2[d2] = false;
        }
    }

    private static List<String> constructBoard(char[][] board) {
        List<String> res = new ArrayList<>();
        for (char[] row : board) {
            res.add(new String(row));
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 👑 N-QUEENS SOLVER DEMONSTRATION");
        System.out.println("==================================================\n");

        int N = 4;
        List<List<String>> solutions = solveNQueens(N);
        System.out.printf("Total solutions found for N=%d: %d%n%n", N, solutions.size());

        for (int i = 0; i < solutions.size(); i++) {
            System.out.println("Solution #" + (i + 1) + ":");
            for (String row : solutions.get(i)) {
                System.out.println("  " + row.replace(".", ". ").replace("Q", "Q "));
            }
            System.out.println();
        }

        System.out.println("✅ N-Queens Solver completed successfully!");
    }
}

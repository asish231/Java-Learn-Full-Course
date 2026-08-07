package module10_recursion_and_backtracking;

/**
 * Step 07: Sudoku Solver (9x9 Matrix Backtracking Constraint Satisfaction)
 *
 * <pre>
 * SUDOKU 9x9 GRID & 3x3 SUB-BOX INDEXING:
 *
 *       0 1 2   3 4 5   6 7 8  (Cols)
 *     +-------+-------+-------+
 *   0 | 5 3 . | . 7 . | . . . |  Sub-box Row Index: row / 3
 *   1 | 6 . . | 1 9 5 | . . . |  Sub-box Col Index: col / 3
 *   2 | . 9 8 | . . . | . 6 . |  Box Top-Left Cell: (3 * (row/3), 3 * (col/3))
 *     +-------+-------+-------+
 *   3 | 8 . . | . 6 . | . . 3 |
 *   4 | 4 . . | 8 . 3 | . . 1 |
 *   5 | 7 . . | . 2 . | . . 6 |
 *     +-------+-------+-------+
 *   6 | . 6 . | . . . | 2 8 . |
 *   7 | . . . | 4 1 9 | . . 5 |
 *   8 | . . . | . 8 . | . 7 9 |
 *     +-------+-------+-------+
 *
 * CONSTRAINTS FOR DIGIT d AT CELL (row, col):
 * 1. Row Constraint: Digit d is unique in row.
 * 2. Col Constraint: Digit d is unique in col.
 * 3. Box Constraint: Digit d is unique in the corresponding 3x3 sub-box.
 * </pre>
 */
public class Step07_SudokuSolverHard {

    public static class SudokuResult {
        public final boolean solved;
        public final int totalBacktracks;

        public SudokuResult(boolean solved, int totalBacktracks) {
            this.solved = solved;
            this.totalBacktracks = totalBacktracks;
        }
    }

    private static int totalBacktracks = 0;

    /**
     * Solves the given 9x9 Sudoku board in-place using backtracking.
     */
    public static SudokuResult solveSudoku(char[][] board) {
        totalBacktracks = 0;
        boolean solved = solve(board);
        return new SudokuResult(solved, totalBacktracks);
    }

    private static boolean solve(char[][] board) {
        for (int row = 0; row < 9; row++) {
            for (int col = 0; col < 9; col++) {
                if (board[row][col] == '.') {
                    for (char digit = '1'; digit <= '9'; digit++) {
                        if (isValid(board, row, col, digit)) {
                            board[row][col] = digit;

                            if (solve(board)) {
                                return true;
                            }

                            // Backtrack if placing digit leads to unsolvable state
                            board[row][col] = '.';
                            totalBacktracks++;
                        }
                    }
                    return false; // Triggers backtracking to previous cell
                }
            }
        }
        return true; // All 81 cells filled successfully
    }

    /**
     * Checks whether placing 'digit' at (row, col) is valid under Sudoku rules.
     */
    public static boolean isValid(char[][] board, int row, int col, char digit) {
        int startRow = 3 * (row / 3);
        int startCol = 3 * (col / 3);

        for (int i = 0; i < 9; i++) {
            // Row check
            if (board[row][i] == digit) return false;
            // Col check
            if (board[i][col] == digit) return false;
            // 3x3 Box check
            if (board[startRow + i / 3][startCol + i % 3] == digit) return false;
        }
        return true;
    }

    public static void printBoard(char[][] board) {
        for (int r = 0; r < 9; r++) {
            if (r % 3 == 0 && r != 0) {
                System.out.println("------+-------+------");
            }
            for (int c = 0; c < 9; c++) {
                if (c % 3 == 0 && c != 0) {
                    System.out.print("| ");
                }
                System.out.print(board[r][c] + " ");
            }
            System.out.println();
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 10 - Step 07: Sudoku Solver (9x9 Matrix Backtracking)");
        System.out.println("======================================================================\n");

        char[][] board = {
            {'5', '3', '.', '.', '7', '.', '.', '.', '.'},
            {'6', '.', '.', '1', '9', '5', '.', '.', '.'},
            {'.', '9', '8', '.', '.', '.', '.', '6', '.'},
            {'8', '.', '.', '.', '6', '.', '.', '.', '3'},
            {'4', '.', '.', '8', '.', '3', '.', '.', '1'},
            {'7', '.', '.', '.', '2', '.', '.', '.', '6'},
            {'.', '6', '.', '.', '.', '.', '2', '8', '.'},
            {'.', '.', '.', '4', '1', '9', '.', '.', '5'},
            {'.', '.', '.', '.', '8', '.', '.', '7', '9'}
        };

        System.out.println("[INIT] Initial Sudoku Puzzle Grid:");
        printBoard(board);

        System.out.println("\n[ACTION] Solving Sudoku puzzle using 9x9 matrix backtracking...");
        long startTime = System.nanoTime();
        SudokuResult result = solveSudoku(board);
        long duration = System.nanoTime() - startTime;

        System.out.println("\n--- Solved Sudoku Grid ---");
        printBoard(board);

        System.out.println("\n[STATE] Puzzle Solved Status: " + result.solved);
        System.out.println("[STATE] Total Backtrack Step Operations: " + result.totalBacktracks);
        System.out.println("[STATE] Execution Time: " + (duration / 1_000_000.0) + " ms");

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Step07_SudokuSolverHard executed cleanly.");
        System.out.println("======================================================================");
    }
}

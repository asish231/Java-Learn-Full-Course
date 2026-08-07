package module13_graph_algorithms;

import java.util.Arrays;

/**
 * ============================================================================
 * Step 04: 2D Grid Graph 4-Directional Flooding DFS (Number of Islands)
 * ============================================================================
 * 
 * ASCII Diagram: 2D Grid Graph & 4-Directional Flood Fill DFS
 * 
 * Initial 2D Binary Grid (4 Rows x 5 Columns):
 * 
 *        c0  c1  c2  c3  c4
 *    r0 [ 1   1   0   0   0 ]
 *    r1 [ 1   1   0   0   1 ]
 *    r2 [ 0   0   1   0   1 ]
 *    r3 [ 0   0   0   1   1 ]
 * 
 * 4-Directional Exploration Vectors (Up, Down, Left, Right):
 *    dr = [-1,  1,  0,  0]   (Row offsets)
 *    dc = [ 0,  0, -1,  1]   (Column offsets)
 * 
 *              (r-1, c)   [UP]
 *                 ^
 *                 |
 *   (r, c-1) <-- (r, c) --> (r, c+1)  [LEFT / RIGHT]
 *   [LEFT]        |
 *                 v
 *              (r+1, c)   [DOWN]
 * 
 * Flooding Process (Transforming '1' -> '0' or marking visited):
 * 
 *  Island #1 Discovery at (0,0):
 *    Floods (0,0), (0,1), (1,0), (1,1) -> Connected component #1 cleared.
 * 
 *  Island #2 Discovery at (1,4):
 *    Floods (1,4), (2,4), (3,4), (3,3) -> Connected component #2 cleared.
 * 
 *  Island #3 Discovery at (2,2):
 *    Floods (2,2) -> Connected component #3 cleared.
 * 
 * Total Islands Discovered = 3
 * ============================================================================
 */
public class Step04_GridDFSNumberOfIslands {

    // 4-Directional exploration offsets: Up, Down, Left, Right
    private static final int[] ROW_OFFSETS = {-1, 1, 0, 0};
    private static final int[] COL_OFFSETS = {0, 0, -1, 1};

    /**
     * In-place Grid Mutating Island Counter (Saves Memory: O(1) extra space except recursion stack).
     */
    public static int countIslandsInPlace(char[][] grid) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }

        int rows = grid.length;
        int cols = grid[0].length;
        int islandCount = 0;

        System.out.println("[INIT] Starting In-Place Grid Flood-Fill DFS...");
        System.out.printf("[MEMORY EVENT] Operating on 2D grid [%d x %d]%n", rows, cols);

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '1') {
                    islandCount++;
                    System.out.printf("%n[ACTION] Discovered Island #%d root at cell (%d, %d)! Initiating DFS Flooding...%n",
                            islandCount, r, c);
                    dfsFloodFill(grid, r, c, rows, cols);
                    System.out.printf("[STATE] Island #%d fully flooded and erased.%n", islandCount);
                }
            }
        }

        return islandCount;
    }

    private static void dfsFloodFill(char[][] grid, int r, int c, int rows, int cols) {
        // Base case: Out of bounds or water ('0')
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != '1') {
            return;
        }

        // Sink the land ('1' -> '0') to mark visited
        grid[r][c] = '0';
        System.out.printf("   Sunk land cell (%d, %d)%n", r, c);

        // Recursively flood 4 neighbors
        for (int i = 0; i < 4; i++) {
            int nextR = r + ROW_OFFSETS[i];
            int nextC = c + COL_OFFSETS[i];
            dfsFloodFill(grid, nextR, nextC, rows, cols);
        }
    }

    /**
     * Non-mutating Island Counter using an auxiliary boolean[][] visited matrix.
     */
    public static int countIslandsWithVisitedMatrix(char[][] grid) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }

        int rows = grid.length;
        int cols = grid[0].length;
        boolean[][] visited = new boolean[rows][cols];
        int islandCount = 0;

        System.out.println("\n[INIT] Starting Non-Mutating Grid DFS (Preserving original grid)...");
        System.out.printf("[MEMORY EVENT] Allocated auxiliary boolean visited[%d][%d] matrix%n", rows, cols);

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '1' && !visited[r][c]) {
                    islandCount++;
                    System.out.printf("%n[ACTION] Discovered Island #%d root at cell (%d, %d)! Traversing...%n",
                            islandCount, r, c);
                    dfsVisited(grid, visited, r, c, rows, cols);
                }
            }
        }

        return islandCount;
    }

    private static void dfsVisited(char[][] grid, boolean[][] visited, int r, int c, int rows, int cols) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != '1' || visited[r][c]) {
            return;
        }

        visited[r][c] = true;
        System.out.printf("   Marked visited[%d][%d] = true%n", r, c);

        for (int i = 0; i < 4; i++) {
            int nextR = r + ROW_OFFSETS[i];
            int nextC = c + COL_OFFSETS[i];
            dfsVisited(grid, visited, nextR, nextC, rows, cols);
        }
    }

    public static void printGrid(char[][] grid, String label) {
        System.out.println("  " + label + ":");
        for (char[] row : grid) {
            System.out.print("    ");
            System.out.println(Arrays.toString(row));
        }
    }

    public static char[][] deepCopy(char[][] original) {
        char[][] copy = new char[original.length][];
        for (int i = 0; i < original.length; i++) {
            copy[i] = original[i].clone();
        }
        return copy;
    }

    public static void main(String[] args) {
        System.out.println("=================================================================");
        System.out.println("   Step 04: 2D Grid Graph Number of Islands (DFS) Demonstration");
        System.out.println("=================================================================");

        char[][] originalGrid = {
            {'1', '1', '0', '0', '0'},
            {'1', '1', '0', '0', '1'},
            {'0', '0', '1', '0', '1'},
            {'0', '0', '0', '1', '1'}
        };

        printGrid(originalGrid, "Initial 2D Grid Setup");

        // 1. Non-Mutating DFS
        char[][] gridCopy1 = deepCopy(originalGrid);
        int islands1 = countIslandsWithVisitedMatrix(gridCopy1);
        System.out.println("\n[STATE] Total Islands (Non-Mutating Method): " + islands1);
        printGrid(gridCopy1, "Grid State after Non-Mutating DFS (Unchanged)");

        // 2. In-Place Flooding DFS
        char[][] gridCopy2 = deepCopy(originalGrid);
        int islands2 = countIslandsInPlace(gridCopy2);
        System.out.println("\n[STATE] Total Islands (In-Place Flooding Method): " + islands2);
        printGrid(gridCopy2, "Grid State after In-Place Flooding DFS (Sunk to '0')");

        System.out.println("=================================================================");
        System.out.println("   Step 04 Completed Successfully!");
        System.out.println("=================================================================");
    }
}

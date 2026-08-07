package module13_graph_algorithms;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * ============================================================================
 * Step 06: Directed Graph Cycle Detection & Course Schedule (DFS 3-Color States)
 * ============================================================================
 * 
 * ASCII Diagram: DFS 3-State Coloring & Back-Edge Cycle Detection
 * 
 * Node Color State Definitions:
 *   - WHITE (0) : Unvisited
 *   - GRAY  (1) : Visiting (Currently in DFS call stack / active recursion path)
 *   - BLACK (2) : Visited (Fully processed, all descendants explored)
 * 
 * Valid DAG (No Cycle):
 *   Course 0 ----> Course 1 ----> Course 2
 *   dfs(0): WHITE -> GRAY
 *     dfs(1): WHITE -> GRAY
 *       dfs(2): WHITE -> GRAY -> BLACK
 *     dfs(1): GRAY -> BLACK
 *   dfs(0): GRAY -> BLACK
 * 
 * Cyclic Prerequisites Graph (Cycle 0 -> 1 -> 2 -> 0):
 * 
 *       (0) ------------> (1)
 *        ^                 |
 *        |                 v
 *       (2) <--------------+
 * 
 *   Call dfs(0): State[0] = GRAY (1)
 *   └── Call dfs(1): State[1] = GRAY (1)
 *       └── Call dfs(2): State[2] = GRAY (1)
 *           └── Explore neighbor 0: State[0] is GRAY (1)!
 *               *** BACK-EDGE DETECTED (0 is in current recursion stack)! ***
 *               ---> CYCLE CONFIRMED! Return false (Cannot finish courses).
 * ============================================================================
 */
public class Step06_CourseScheduleCycleDetection {

    public static final int UNVISITED = 0; // WHITE
    public static final int VISITING = 1;  // GRAY
    public static final int VISITED = 2;   // BLACK

    /**
     * Solves Course Schedule I (LeetCode 207): Can finish all courses?
     */
    public static boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = buildAdjacencyList(numCourses, prerequisites);
        int[] state = new int[numCourses];

        System.out.println("[INIT] Checking Course Schedule feasibility for " + numCourses + " courses...");
        System.out.println("[MEMORY EVENT] Allocated 3-state tracking array state[] of size " + numCourses);

        for (int i = 0; i < numCourses; i++) {
            if (state[i] == UNVISITED) {
                System.out.printf("[ACTION] Initiating DFS cycle detection starting at Course %d...%n", i);
                if (hasCycleDFS(i, adj, state)) {
                    System.out.println("[STATE] CYCLE DETECTED! Cannot complete all courses.");
                    return false;
                }
            }
        }

        System.out.println("[STATE] No cycles found! All courses can be completed.");
        return true;
    }

    private static boolean hasCycleDFS(int u, List<List<Integer>> adj, int[] state) {
        state[u] = VISITING; // Mark GRAY
        System.out.printf("   dfs(%d): State changed to VISITING (GRAY - in recursion stack)%n", u);

        for (int v : adj.get(u)) {
            if (state[v] == VISITING) {
                System.out.printf("   *** BACK-EDGE FOUND: Course %d points to Course %d which is currently VISITING (GRAY)! ***%n", u, v);
                return true; // Cycle detected
            } else if (state[v] == UNVISITED) {
                if (hasCycleDFS(v, adj, state)) {
                    return true;
                }
            } else {
                System.out.printf("   Neighbor Course %d is already VISITED (BLACK). Safe.%n", v);
            }
        }

        state[u] = VISITED; // Mark BLACK
        System.out.printf("   dfs(%d): State changed to VISITED (BLACK - completed)%n", u);
        return false;
    }

    /**
     * Solves Course Schedule II (LeetCode 210): Finds valid course execution order.
     */
    public static int[] findOrder(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = buildAdjacencyList(numCourses, prerequisites);
        int[] state = new int[numCourses];
        List<Integer> orderList = new ArrayList<>();

        System.out.println("\n[INIT] Computing course schedule ordering for " + numCourses + " courses...");

        for (int i = 0; i < numCourses; i++) {
            if (state[i] == UNVISITED) {
                if (findOrderDFS(i, adj, state, orderList)) {
                    System.out.println("[STATE] Cycle detected during order calculation. Returning empty array.");
                    return new int[0];
                }
            }
        }

        // Post-order DFS yields reverse topological order, so reverse it
        Collections.reverse(orderList);
        int[] orderArray = new int[numCourses];
        for (int i = 0; i < numCourses; i++) {
            orderArray[i] = orderList.get(i);
        }

        System.out.println("[STATE] Valid Course Execution Sequence: " + Arrays.toString(orderArray));
        return orderArray;
    }

    private static boolean findOrderDFS(int u, List<List<Integer>> adj, int[] state, List<Integer> orderList) {
        state[u] = VISITING;

        for (int v : adj.get(u)) {
            if (state[v] == VISITING) {
                return true; // Cycle
            } else if (state[v] == UNVISITED) {
                if (findOrderDFS(v, adj, state, orderList)) {
                    return true;
                }
            }
        }

        state[u] = VISITED;
        orderList.add(u);
        return false;
    }

    private static List<List<Integer>> buildAdjacencyList(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>(numCourses);
        for (int i = 0; i < numCourses; i++) {
            adj.add(new ArrayList<>());
        }
        for (int[] req : prerequisites) {
            int course = req[0];
            int prereq = req[1];
            adj.get(prereq).add(course); // Directed edge: prereq -> course
        }
        return adj;
    }

    public static void main(String[] args) {
        System.out.println("=================================================================");
        System.out.println("   Step 06: Course Schedule & Cycle Detection Demonstration");
        System.out.println("=================================================================");

        // Test Case 1: Valid Prerequisites (DAG)
        // 4 courses: [1,0] (0->1), [2,0] (0->2), [3,1] (1->3), [3,2] (2->3)
        int numCourses1 = 4;
        int[][] prereqs1 = {
            {1, 0},
            {2, 0},
            {3, 1},
            {3, 2}
        };

        System.out.println("--- Test Case 1: Valid Course Prerequisites (No Cycle) ---");
        boolean canFinish1 = canFinish(numCourses1, prereqs1);
        System.out.println("Can finish courses: " + canFinish1);
        int[] order1 = findOrder(numCourses1, prereqs1);

        // Test Case 2: Cyclic Prerequisites
        // 3 courses: [1,0] (0->1), [2,1] (1->2), [0,2] (2->0) -> Cycle!
        System.out.println("\n--- Test Case 2: Cyclic Prerequisites ---");
        int numCourses2 = 3;
        int[][] prereqs2 = {
            {1, 0},
            {2, 1},
            {0, 2}
        };

        boolean canFinish2 = canFinish(numCourses2, prereqs2);
        System.out.println("Can finish courses: " + canFinish2);
        int[] order2 = findOrder(numCourses2, prereqs2);
        System.out.println("Returned order size: " + order2.length);

        System.out.println("=================================================================");
        System.out.println("   Step 06 Completed Successfully!");
        System.out.println("=================================================================");
    }
}

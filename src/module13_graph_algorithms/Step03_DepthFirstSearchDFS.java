package module13_graph_algorithms;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Deque;
import java.util.List;

/**
 * ============================================================================
 * Step 03: Depth-First Search (DFS) Traversal (Recursive & Iterative)
 * ============================================================================
 * 
 * ASCII Diagram: Call Stack Growth and Backtracking Traversal
 * 
 * Graph Structure (6 Vertices):
 * 
 *       (0) ---------> (1) ---------> (3)
 *        |              |              |
 *        v              v              v
 *       (2) ---------> (4) ---------> (5)
 * 
 * Recursive Call Stack Execution Trace (Starting from Node 0):
 * 
 *   Call dfs(0)
 *   ├── Mark visited[0] = true
 *   ├── Explore neighbor 1 -> Call dfs(1)
 *   │   ├── Mark visited[1] = true
 *   │   ├── Explore neighbor 3 -> Call dfs(3)
 *   │   │   ├── Mark visited[3] = true
 *   │   │   ├── Explore neighbor 5 -> Call dfs(5)
 *   │   │   │   ├── Mark visited[5] = true
 *   │   │   │   └── No unvisited neighbors -> Backtrack (Return from dfs(5))
 *   │   │   └── Backtrack (Return from dfs(3))
 *   │   ├── Explore neighbor 4 -> Call dfs(4)
 *   │   │   ├── Mark visited[4] = true
 *   │   │   ├── Neighbor 5 already visited -> Skip
 *   │   │   └── Backtrack (Return from dfs(4))
 *   │   └── Backtrack (Return from dfs(1))
 *   ├── Explore neighbor 2 -> Call dfs(2)
 *   │   ├── Mark visited[2] = true
 *   │   ├── Neighbor 4 already visited -> Skip
 *   │   └── Backtrack (Return from dfs(2))
 *   └── Traversal Complete!
 * 
 * Traversal Order: [0 -> 1 -> 3 -> 5 -> 4 -> 2]
 * ============================================================================
 */
public class Step03_DepthFirstSearchDFS {

    /**
     * Static directed graph representation using Adjacency List.
     */
    public static class Graph {
        private final int numVertices;
        private final List<List<Integer>> adjList;

        public Graph(int numVertices) {
            this.numVertices = numVertices;
            this.adjList = new ArrayList<>(numVertices);
            for (int i = 0; i < numVertices; i++) {
                adjList.add(new ArrayList<>());
            }
        }

        public void addDirectedEdge(int u, int v) {
            adjList.get(u).add(v);
        }

        public int getNumVertices() {
            return numVertices;
        }

        public List<Integer> getNeighbors(int u) {
            return adjList.get(u);
        }
    }

    /**
     * Recursive DFS Traversal implementation.
     */
    public static class DFSRecursive {
        private final Graph graph;
        private final boolean[] visited;
        private final List<Integer> traversalOrder;

        public DFSRecursive(Graph graph) {
            this.graph = graph;
            this.visited = new boolean[graph.getNumVertices()];
            this.traversalOrder = new ArrayList<>();
        }

        public List<Integer> execute(int startNode) {
            System.out.println("[INIT] Initializing Recursive DFS starting from Node " + startNode);
            System.out.println("[MEMORY EVENT] Allocated call stack frames & visited[] array of size " + graph.getNumVertices());
            dfsHelper(startNode, 0);
            return traversalOrder;
        }

        private void dfsHelper(int u, int depth) {
            visited[u] = true;
            traversalOrder.add(u);

            String indent = "  ".repeat(depth);
            System.out.printf("%s[ACTION] dfs(%d) depth=%d -> Marked visited[%d]=true. Order: %s%n",
                    indent, u, depth, u, traversalOrder);

            for (int v : graph.getNeighbors(u)) {
                if (!visited[v]) {
                    System.out.printf("%s   Branching into neighbor %d...%n", indent, v);
                    dfsHelper(v, depth + 1);
                    System.out.printf("%s   Backtracked to Node %d from Node %d%n", indent, u, v);
                } else {
                    System.out.printf("%s   Neighbor %d already visited. Skipping.%n", indent, v);
                }
            }
        }
    }

    /**
     * Iterative DFS Traversal implementation using explicit Stack (ArrayDeque).
     */
    public static class DFSIterative {
        public static List<Integer> execute(Graph graph, int startNode) {
            int numVertices = graph.getNumVertices();
            List<Integer> order = new ArrayList<>();
            boolean[] visited = new boolean[numVertices];
            Deque<Integer> stack = new ArrayDeque<>();

            System.out.println("\n[INIT] Initializing Iterative DFS with explicit Stack from Node " + startNode);
            System.out.println("[MEMORY EVENT] Instantiated ArrayDeque<Integer> for explicit LIFO stack");

            stack.push(startNode);

            while (!stack.isEmpty()) {
                int curr = stack.pop();

                if (!visited[curr]) {
                    visited[curr] = true;
                    order.add(curr);
                    System.out.printf("[ACTION] Stack Pop -> Processed Node %d. Order: %s%n", curr, order);

                    // Push neighbors in reverse order so first neighbor is popped first
                    List<Integer> neighbors = graph.getNeighbors(curr);
                    for (int i = neighbors.size() - 1; i >= 0; i--) {
                        int v = neighbors.get(i);
                        if (!visited[v]) {
                            stack.push(v);
                            System.out.printf("   [STATE] Pushed neighbor %d onto Stack (Stack: %s)%n", v, stack);
                        }
                    }
                }
            }

            return order;
        }
    }

    /**
     * Path Finder using Recursive DFS and Backtracking.
     */
    public static class DFSPathFinder {
        public static List<Integer> findPath(Graph graph, int src, int dest) {
            boolean[] visited = new boolean[graph.getNumVertices()];
            List<Integer> path = new ArrayList<>();
            System.out.printf("%n[ACTION] Searching for directed path from %d to %d using DFS...%n", src, dest);
            if (dfsPathHelper(graph, src, dest, visited, path)) {
                return path;
            }
            return Collections.emptyList();
        }

        private static boolean dfsPathHelper(Graph graph, int u, int dest, boolean[] visited, List<Integer> path) {
            visited[u] = true;
            path.add(u);

            if (u == dest) {
                return true;
            }

            for (int v : graph.getNeighbors(u)) {
                if (!visited[v]) {
                    if (dfsPathHelper(graph, v, dest, visited, path)) {
                        return true;
                    }
                }
            }

            // Backtrack
            path.remove(path.size() - 1);
            return false;
        }
    }

    public static void main(String[] args) {
        System.out.println("=================================================================");
        System.out.println("   Step 03: Depth-First Search (DFS) Traversal Demonstration");
        System.out.println("=================================================================");

        int numVertices = 6;
        Graph graph = new Graph(numVertices);

        // Building directed graph matching ASCII diagram:
        // 0->1, 0->2, 1->3, 1->4, 2->4, 3->5, 4->5
        System.out.println("[INIT] Constructing directed graph with 6 vertices...");
        graph.addDirectedEdge(0, 1);
        graph.addDirectedEdge(0, 2);
        graph.addDirectedEdge(1, 3);
        graph.addDirectedEdge(1, 4);
        graph.addDirectedEdge(2, 4);
        graph.addDirectedEdge(3, 5);
        graph.addDirectedEdge(4, 5);

        // 1. Recursive DFS
        DFSRecursive dfsRec = new DFSRecursive(graph);
        List<Integer> recOrder = dfsRec.execute(0);

        // 2. Iterative DFS
        List<Integer> iterOrder = DFSIterative.execute(graph, 0);

        System.out.println("\n=================================================================");
        System.out.println("   DFS Traversal Results:");
        System.out.println("=================================================================");
        System.out.println("[STATE] Recursive DFS Order : " + recOrder);
        System.out.println("[STATE] Iterative DFS Order : " + iterOrder);

        // 3. Path Discovery
        List<Integer> path0to5 = DFSPathFinder.findPath(graph, 0, 5);
        System.out.println("[STATE] Discovered Path (0 -> 5): " + path0to5);

        List<Integer> path5to0 = DFSPathFinder.findPath(graph, 5, 0);
        System.out.println("[STATE] Discovered Path (5 -> 0): " + (path5to0.isEmpty() ? "No Path Exists" : path5to0));

        System.out.println("=================================================================");
        System.out.println("   Step 03 Completed Successfully!");
        System.out.println("=================================================================");
    }
}

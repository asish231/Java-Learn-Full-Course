package module13_graph_algorithms;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * ============================================================================
 * Step 08: Bellman-Ford Shortest Path & Negative Cycle Detection
 * ============================================================================
 * 
 * ASCII Diagram: V-1 Edge Relaxation Passes & V-th Negative Cycle Detection
 * 
 * 1. Normal Graph with Negative Edge Weights (4 Vertices, No Negative Cycles):
 * 
 *          (0) --[4]--> (1) --[-2]--> (2)
 *           |           |             ^
 *          [5]         [3]            |
 *           v           v             |
 *          (3) --[1]--> (1)   (3)----[2]----+
 * 
 *    Edge Relaxations (V - 1 = 3 Passes):
 *      Pass 1: Relaxes edges from Source 0 -> dist[1]=4, dist[3]=5. Then 1->2 (dist[2]=2), 3->1 (dist[1]=min(4, 6)=4), 3->2 (dist[2]=min(2, 7)=2).
 *      Pass 2 & 3: No further improvements -> Stable shortest distances found!
 * 
 * 2. Graph containing a Negative-Weight Cycle:
 * 
 *          (0) --[1]--> (1) --[2]--> (2)
 *                        ^            |
 *                       [-6]          |
 *                        |            v
 *                       (3) <--[1]--- (2)
 * 
 *    Cycle Path: 1 -> 2 -> 3 -> 1
 *    Cycle Weight Sum: 2 + 1 + (-6) = -3 (NEGATIVE CYCLE!)
 * 
 *    V-th Iteration Detection:
 *      Pass V (Pass 4): Edge (3 -> 1) attempts to relax dist[1] = dist[3] + (-6).
 *      Since dist[1] can STILL decrease infinitely:
 *      *** NEGATIVE WEIGHT CYCLE DETECTED! ***
 * ============================================================================
 */
public class Step08_BellmanFordNegativeCycles {

    /**
     * Static helper class representing a weighted directed edge.
     */
    public static class Edge {
        private final int src;
        private final int dest;
        private final int weight;

        public Edge(int src, int dest, int weight) {
            this.src = src;
            this.dest = dest;
            this.weight = weight;
        }

        public int getSrc() {
            return src;
        }

        public int getDest() {
            return dest;
        }

        public int getWeight() {
            return weight;
        }

        @Override
        public String toString() {
            return "(" + src + " -> " + dest + ", w=" + weight + ")";
        }
    }

    /**
     * Container holding Bellman-Ford execution results.
     */
    public static class BellmanFordResult {
        private final int[] dist;
        private final int[] parent;
        private final boolean hasNegativeCycle;

        public BellmanFordResult(int[] dist, int[] parent, boolean hasNegativeCycle) {
            this.dist = dist;
            this.parent = parent;
            this.hasNegativeCycle = hasNegativeCycle;
        }

        public int[] getDistances() {
            return dist;
        }

        public int[] getParents() {
            return parent;
        }

        public boolean hasNegativeCycle() {
            return hasNegativeCycle;
        }
    }

    /**
     * Bellman-Ford Algorithm Implementation.
     */
    public static BellmanFordResult computeBellmanFord(int numVertices, List<Edge> edges, int startNode) {
        int[] dist = new int[numVertices];
        int[] parent = new int[numVertices];

        Arrays.fill(dist, Integer.MAX_VALUE);
        Arrays.fill(parent, -1);
        dist[startNode] = 0;

        System.out.printf("[INIT] Initializing Bellman-Ford Algorithm (%d Vertices, %d Edges, Source: %d)%n",
                numVertices, edges.size(), startNode);
        System.out.println("[MEMORY EVENT] Allocated dist[] array (initialized to INF) and parent[] array");

        // Step 1: Relax all edges (V - 1) times
        System.out.printf("%n[ACTION] --- Phase 1: Relaxing Edges for V-1 (%d) Iterations ---%n", numVertices - 1);

        for (int iter = 1; iter <= numVertices - 1; iter++) {
            boolean updated = false;
            System.out.printf("%n[STATE] --- Iteration %d of %d ---%n", iter, numVertices - 1);

            for (Edge edge : edges) {
                int u = edge.getSrc();
                int v = edge.getDest();
                int weight = edge.getWeight();

                if (dist[u] != Integer.MAX_VALUE && dist[u] + weight < dist[v]) {
                    int oldDist = dist[v];
                    dist[v] = dist[u] + weight;
                    parent[v] = u;
                    updated = true;
                    System.out.printf("   [RELAXATION] Edge %s: Updated dist[%d] from %s to %d%n",
                            edge, v, (oldDist == Integer.MAX_VALUE ? "INF" : oldDist), dist[v]);
                }
            }

            System.out.printf("   Current Distance Array: %s%n", Arrays.toString(dist));
            if (!updated) {
                System.out.printf("   No distances changed during iteration %d -> Early convergence! Breaking.%n", iter);
                break;
            }
        }

        // Step 2: V-th Pass to detect Negative Weight Cycles
        System.out.printf("%n[ACTION] --- Phase 2: V-th Iteration Check for Negative Cycles ---%n");
        boolean hasNegativeCycle = false;

        for (Edge edge : edges) {
            int u = edge.getSrc();
            int v = edge.getDest();
            int weight = edge.getWeight();

            if (dist[u] != Integer.MAX_VALUE && dist[u] + weight < dist[v]) {
                hasNegativeCycle = true;
                System.out.printf("   *** NEGATIVE CYCLE DETECTED via Edge %s! ***%n", edge);
                System.out.printf("   Distance to %d can still be reduced from %d to %d!%n",
                        v, dist[v], (dist[u] + weight));
                break;
            }
        }

        if (!hasNegativeCycle) {
            System.out.println("[STATE] Phase 2 complete. No negative weight cycles detected.");
        }

        return new BellmanFordResult(dist, parent, hasNegativeCycle);
    }

    /**
     * Helper to reconstruct shortest path route.
     */
    public static List<Integer> reconstructPath(int targetNode, int[] parent) {
        List<Integer> path = new ArrayList<>();
        int curr = targetNode;
        while (curr != -1) {
            path.add(curr);
            curr = parent[curr];
        }
        Collections.reverse(path);
        return path;
    }

    public static void main(String[] args) {
        System.out.println("=================================================================");
        System.out.println("   Step 08: Bellman-Ford & Negative Cycle Detection");
        System.out.println("=================================================================");

        // Test Case 1: Graph with negative edges but NO negative cycles
        System.out.println("=== Test Case 1: Negative Edges WITHOUT Negative Cycles ===");
        int numVertices1 = 4;
        List<Edge> edges1 = new ArrayList<>();
        edges1.add(new Edge(0, 1, 4));
        edges1.add(new Edge(0, 3, 5));
        edges1.add(new Edge(1, 2, -2)); // Negative weight edge
        edges1.add(new Edge(3, 1, 1));
        edges1.add(new Edge(3, 2, 2));

        BellmanFordResult result1 = computeBellmanFord(numVertices1, edges1, 0);

        System.out.println("\n[STATE] Test Case 1 Results:");
        System.out.println("   Has Negative Cycle: " + result1.hasNegativeCycle());
        System.out.println("   Shortest Distances: " + Arrays.toString(result1.getDistances()));
        for (int i = 0; i < numVertices1; i++) {
            System.out.printf("   Path 0 -> %d: %s%n", i, reconstructPath(i, result1.getParents()));
        }

        // Test Case 2: Graph WITH Negative Weight Cycle
        System.out.println("\n=== Test Case 2: Graph WITH Negative Weight Cycle ===");
        int numVertices2 = 4;
        List<Edge> edges2 = new ArrayList<>();
        edges2.add(new Edge(0, 1, 1));
        edges2.add(new Edge(1, 2, 2));
        edges2.add(new Edge(2, 3, 1));
        edges2.add(new Edge(3, 1, -6)); // Cycle 1->2->3->1 with sum: 2 + 1 - 6 = -3

        BellmanFordResult result2 = computeBellmanFord(numVertices2, edges2, 0);

        System.out.println("\n[STATE] Test Case 2 Results:");
        System.out.println("   Has Negative Cycle: " + result2.hasNegativeCycle());

        System.out.println("=================================================================");
        System.out.println("   Step 08 Completed Successfully!");
        System.out.println("=================================================================");
    }
}

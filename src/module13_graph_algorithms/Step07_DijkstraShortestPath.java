package module13_graph_algorithms;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.PriorityQueue;

/**
 * ============================================================================
 * Step 07: Single-Source Shortest Path via Dijkstra's Algorithm
 * ============================================================================
 * 
 * ASCII Diagram: PriorityQueue Min-Heap State Updates & Edge Relaxation
 * 
 * Weighted Directed Graph Topology (5 Vertices: 0 to 4):
 * 
 *           [4]           [2]
 *       (0)------->(1)----------->(2)
 *        |          |              ^
 *       [2]        [1]            [5]
 *        v          v              |
 *       (3)------->(4)-------------+
 *           [3]
 * 
 * Edge Relaxations & Min-Heap PQ Step-by-Step (Source Node = 0):
 * 
 *   Initial State:
 *     dist[] = [0, INF, INF, INF, INF]
 *     parent[] = [-1, -1, -1, -1, -1]
 *     PQ: [(node: 0, dist: 0)]
 * 
 *   Step 1: Poll (0, 0)
 *     - Relax edge (0 -> 1, w=4): dist[1] = 0 + 4 = 4. PQ.add(1, 4)
 *     - Relax edge (0 -> 3, w=2): dist[3] = 0 + 2 = 2. PQ.add(3, 2)
 *     PQ: [(3, 2), (1, 4)]
 * 
 *   Step 2: Poll (3, 2) (Min element in PQ)
 *     - Relax edge (3 -> 4, w=3): dist[4] = 2 + 3 = 5. PQ.add(4, 5)
 *     PQ: [(1, 4), (4, 5)]
 * 
 *   Step 3: Poll (1, 4)
 *     - Relax edge (1 -> 2, w=2): dist[2] = 4 + 2 = 6. PQ.add(2, 6)
 *     - Relax edge (1 -> 4, w=1): dist[4] = min(5, 4 + 1) = 5. (Already 5, no improvement)
 *     PQ: [(4, 5), (2, 6)]
 * 
 *   Step 4: Poll (4, 5)
 *     - Relax edge (4 -> 2, w=5): dist[2] = min(6, 5 + 5) = 6. (No improvement)
 *     PQ: [(2, 6)]
 * 
 *   Step 5: Poll (2, 6) -> Done!
 * 
 *   Final Shortest Distances: [0, 4, 6, 2, 5]
 * ============================================================================
 */
public class Step07_DijkstraShortestPath {

    /**
     * Static Edge representation for weighted directed graphs.
     */
    public static class Edge {
        private final int dest;
        private final int weight;

        public Edge(int dest, int weight) {
            this.dest = dest;
            this.weight = weight;
        }

        public int getDest() {
            return dest;
        }

        public int getWeight() {
            return weight;
        }

        @Override
        public String toString() {
            return "-> " + dest + " (w=" + weight + ")";
        }
    }

    /**
     * Helper class representing (node, currentDistance) for PriorityQueue.
     */
    public static class NodeDistance implements Comparable<NodeDistance> {
        private final int node;
        private final int distance;

        public NodeDistance(int node, int distance) {
            this.node = node;
            this.distance = distance;
        }

        public int getNode() {
            return node;
        }

        public int getDistance() {
            return distance;
        }

        @Override
        public int compareTo(NodeDistance other) {
            return Integer.compare(this.distance, other.distance);
        }

        @Override
        public String toString() {
            return "(Node " + node + ", dist=" + distance + ")";
        }
    }

    /**
     * Container holding Dijkstra calculation results.
     */
    public static class DijkstraResult {
        private final int[] dist;
        private final int[] parent;

        public DijkstraResult(int[] dist, int[] parent) {
            this.dist = dist;
            this.parent = parent;
        }

        public int[] getDistances() {
            return dist;
        }

        public int[] getParents() {
            return parent;
        }
    }

    /**
     * Weighted Graph representation.
     */
    public static class WeightedGraph {
        private final int numVertices;
        private final List<List<Edge>> adjList;

        public WeightedGraph(int numVertices) {
            this.numVertices = numVertices;
            this.adjList = new ArrayList<>(numVertices);
            for (int i = 0; i < numVertices; i++) {
                adjList.add(new ArrayList<>());
            }
        }

        public void addEdge(int u, int v, int weight) {
            adjList.get(u).add(new Edge(v, weight));
        }

        public int getNumVertices() {
            return numVertices;
        }

        public List<Edge> getEdgesFrom(int u) {
            return adjList.get(u);
        }
    }

    /**
     * Dijkstra's Algorithm Core Implementation.
     */
    public static DijkstraResult computeDijkstra(WeightedGraph graph, int startNode) {
        int numVertices = graph.getNumVertices();
        int[] dist = new int[numVertices];
        int[] parent = new int[numVertices];

        Arrays.fill(dist, Integer.MAX_VALUE);
        Arrays.fill(parent, -1);

        dist[startNode] = 0;

        PriorityQueue<NodeDistance> pq = new PriorityQueue<>();
        pq.offer(new NodeDistance(startNode, 0));

        System.out.println("[INIT] Initializing Dijkstra's shortest path algorithm from startNode=" + startNode);
        System.out.println("[MEMORY EVENT] Allocated dist[] array (initialized to INF) and Min-Heap PriorityQueue");

        int step = 1;
        while (!pq.isEmpty()) {
            NodeDistance curr = pq.poll();
            if (curr == null) {
                continue;
            }

            int u = curr.getNode();
            int currentDist = curr.getDistance();

            System.out.printf("%n[STATE] Step %d: Polled Min-Element %s from PQ. PQ contents: %s%n",
                    step++, curr, pq);

            // Lazy deletion check: if distance in PQ is stale, skip
            if (currentDist > dist[u]) {
                System.out.printf("   Stale distance (%d > dist[%d]=%d). Skipping.%n", currentDist, u, dist[u]);
                continue;
            }

            System.out.printf("[ACTION] Settled Node %d with final shortest distance: %d%n", u, dist[u]);

            for (Edge edge : graph.getEdgesFrom(u)) {
                int v = edge.getDest();
                int weight = edge.getWeight();

                if (dist[u] != Integer.MAX_VALUE && dist[u] + weight < dist[v]) {
                    int oldDist = dist[v];
                    dist[v] = dist[u] + weight;
                    parent[v] = u;
                    pq.offer(new NodeDistance(v, dist[v]));

                    System.out.printf("   [RELAXATION] Edge (%d -> %d, w=%d): Updated dist[%d] from %s to %d. Enqueued into PQ.%n",
                            u, v, weight, v, (oldDist == Integer.MAX_VALUE ? "INF" : oldDist), dist[v]);
                } else {
                    System.out.printf("   [NO CHANGE] Edge (%d -> %d, w=%d): Existing dist[%d]=%d <= %d%n",
                            u, v, weight, v, dist[v], (dist[u] + weight));
                }
            }
        }

        return new DijkstraResult(dist, parent);
    }

    /**
     * Path Reconstruction Helper.
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
        System.out.println("   Step 07: Dijkstra's Shortest Path Algorithm Demonstration");
        System.out.println("=================================================================");

        int numVertices = 5;
        WeightedGraph graph = new WeightedGraph(numVertices);

        // Building graph matching ASCII diagram:
        // 0->1 (w:4), 0->3 (w:2), 1->2 (w:2), 1->4 (w:1), 3->4 (w:3), 4->2 (w:5)
        System.out.println("[INIT] Constructing weighted directed graph with 5 vertices...");
        graph.addEdge(0, 1, 4);
        graph.addEdge(0, 3, 2);
        graph.addEdge(1, 2, 2);
        graph.addEdge(1, 4, 1);
        graph.addEdge(3, 4, 3);
        graph.addEdge(4, 2, 5);

        int startNode = 0;
        DijkstraResult result = computeDijkstra(graph, startNode);

        System.out.println("\n=================================================================");
        System.out.println("   Dijkstra Execution Summary:");
        System.out.println("=================================================================");
        System.out.println("[STATE] Final Shortest Distances from Node 0:");
        for (int i = 0; i < numVertices; i++) {
            System.out.printf("   Node %d: Shortest Dist = %2d, Path = %s%n",
                    i, result.getDistances()[i], reconstructPath(i, result.getParents()));
        }

        System.out.println("=================================================================");
        System.out.println("   Step 07 Completed Successfully!");
        System.out.println("=================================================================");
    }
}

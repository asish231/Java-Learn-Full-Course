package module13_graph_algorithms;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Queue;
import java.util.List;

/**
 * ============================================================================
 * Step 02: Breadth-First Search (BFS) Traversal & Shortest Path (Unweighted)
 * ============================================================================
 * 
 * ASCII Diagram: Queue Frontier Expansion & BFS Level Traversal
 * 
 * Graph Topology (6 Vertices):
 * 
 *       (0) --------- (1) --------- (3)
 *        |             |             |
 *        |             |             |
 *       (2) --------- (4) --------- (5)
 * 
 * Step-by-Step Level-Order BFS Frontier (Starting from Source 0):
 * 
 *  Level 0: [0]
 *           Queue: [0]
 *           Visited: [0]
 * 
 *  Level 1: Dequeue 0 -> Explore Neighbors 1, 2
 *           Queue: [1, 2]
 *           Visited: [0, 1, 2]
 *           Distances: dist[0]=0, dist[1]=1, dist[2]=1
 * 
 *  Level 2: Dequeue 1 -> Explore Neighbors 3, 4
 *           Dequeue 2 -> Neighbor 4 (already visited via 1)
 *           Queue: [3, 4]
 *           Visited: [0, 1, 2, 3, 4]
 *           Distances: dist[3]=2, dist[4]=2
 * 
 *  Level 3: Dequeue 3 -> Explore Neighbor 5
 *           Dequeue 4 -> Neighbor 5 (already visited via 3)
 *           Queue: [5]
 *           Visited: [0, 1, 2, 3, 4, 5]
 *           Distances: dist[5]=3
 * 
 *  Level 4: Dequeue 5 -> No unvisited neighbors
 *           Queue: [] -> Traversal Complete!
 * ============================================================================
 */
public class Step02_BreadthFirstSearchBFS {

    /**
     * Static graph class using Adjacency List for unweighted graphs.
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

        public void addUndirectedEdge(int u, int v) {
            adjList.get(u).add(v);
            adjList.get(v).add(u);
        }

        public int getNumVertices() {
            return numVertices;
        }

        public List<Integer> getNeighbors(int u) {
            return adjList.get(u);
        }
    }

    /**
     * Container holding BFS execution results (traversal order, distances, parent pointers).
     */
    public static class BFSResult {
        private final List<Integer> traversalOrder;
        private final int[] distances;
        private final int[] parent;

        public BFSResult(List<Integer> traversalOrder, int[] distances, int[] parent) {
            this.traversalOrder = traversalOrder;
            this.distances = distances;
            this.parent = parent;
        }

        public List<Integer> getTraversalOrder() {
            return traversalOrder;
        }

        public int[] getDistances() {
            return distances;
        }

        public int[] getParent() {
            return parent;
        }
    }

    /**
     * Executes Level-Order Breadth-First Search from a source node.
     */
    public static BFSResult performBFS(Graph graph, int startNode) {
        int numVertices = graph.getNumVertices();
        List<Integer> order = new ArrayList<>();
        int[] dist = new int[numVertices];
        int[] parent = new int[numVertices];
        boolean[] visited = new boolean[numVertices];

        Arrays.fill(dist, -1);
        Arrays.fill(parent, -1);

        Queue<Integer> queue = new ArrayDeque<>();

        // Initialize BFS
        visited[startNode] = true;
        dist[startNode] = 0;
        queue.offer(startNode);

        System.out.println("[INIT] BFS initialized at startNode=" + startNode);
        System.out.println("[MEMORY EVENT] Allocated visited[], dist[], parent[] arrays of size " + numVertices);

        int currentLevel = 0;
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            System.out.printf("%n[STATE] --- Processing Level %d (Queue size: %d, Queue contents: %s) ---%n",
                    currentLevel, levelSize, queue);

            for (int i = 0; i < levelSize; i++) {
                Integer curr = queue.poll();
                if (curr == null) {
                    continue;
                }
                order.add(curr);
                System.out.printf("[ACTION] Dequeued Node %d (dist from source: %d)%n", curr, dist[curr]);

                for (int neighbor : graph.getNeighbors(curr)) {
                    if (!visited[neighbor]) {
                        visited[neighbor] = true;
                        dist[neighbor] = dist[curr] + 1;
                        parent[neighbor] = curr;
                        queue.offer(neighbor);
                        System.out.printf("   -> Visited new neighbor %d! Set dist[%d]=%d, parent[%d]=%d, Enqueued %d%n",
                                neighbor, neighbor, dist[neighbor], neighbor, curr, neighbor);
                    } else {
                        System.out.printf("   -> Neighbor %d already visited. Skipping.%n", neighbor);
                    }
                }
            }
            currentLevel++;
        }

        return new BFSResult(order, dist, parent);
    }

    /**
     * Reconstructs the shortest path from startNode to targetNode using parent pointers.
     */
    public static List<Integer> reconstructPath(int targetNode, int[] parent) {
        List<Integer> path = new ArrayList<>();
        if (targetNode < 0 || targetNode >= parent.length) {
            return path;
        }

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
        System.out.println("   Step 02: Breadth-First Search (BFS) Traversal Demonstration");
        System.out.println("=================================================================");

        int numVertices = 6;
        Graph graph = new Graph(numVertices);

        // Building graph matching the ASCII diagram:
        // 0-1, 0-2, 1-3, 1-4, 2-4, 3-5, 4-5
        System.out.println("[INIT] Constructing undirected graph with 6 vertices...");
        graph.addUndirectedEdge(0, 1);
        graph.addUndirectedEdge(0, 2);
        graph.addUndirectedEdge(1, 3);
        graph.addUndirectedEdge(1, 4);
        graph.addUndirectedEdge(2, 4);
        graph.addUndirectedEdge(3, 5);
        graph.addUndirectedEdge(4, 5);

        int startNode = 0;
        System.out.println("[ACTION] Executing BFS starting from Node " + startNode + "...");
        BFSResult result = performBFS(graph, startNode);

        System.out.println("\n=================================================================");
        System.out.println("   BFS Traversal Results:");
        System.out.println("=================================================================");
        System.out.println("[STATE] Final BFS Traversal Order: " + result.getTraversalOrder());
        System.out.println("[STATE] Shortest Distances from Node 0: " + Arrays.toString(result.getDistances()));

        System.out.println("\n[ACTION] Path Reconstructions from Source (Node 0):");
        for (int target = 0; target < numVertices; target++) {
            List<Integer> path = reconstructPath(target, result.getParent());
            System.out.printf("   Path 0 -> %d: %s (Distance: %d)%n",
                    target, path, result.getDistances()[target]);
        }

        System.out.println("=================================================================");
        System.out.println("   Step 02 Completed Successfully!");
        System.out.println("=================================================================");
    }
}

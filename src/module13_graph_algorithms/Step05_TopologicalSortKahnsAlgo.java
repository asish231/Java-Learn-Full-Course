package module13_graph_algorithms;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Queue;
import java.util.List;

/**
 * ============================================================================
 * Step 05: Topological Sort via Kahn's Algorithm (BFS In-Degree Approach)
 * ============================================================================
 * 
 * ASCII Diagram: DAG Dependency Scheduling & In-Degree Queue Processing
 * 
 * University Course Prerequisites DAG (6 Courses: 0 to 5):
 * 
 *       (5) --------> (0) <-------- (4)
 *        |             |             |
 *        v             v             v
 *       (2) --------> (3) --------> (1)
 * 
 * In-Degree Table Progression:
 * 
 *   Initial State:
 *     Node:       [0]  [1]  [2]  [3]  [4]  [5]
 *     In-Degree:   2    1    1    2    0    0
 *     Queue:     [4, 5]  (Nodes with in-degree == 0)
 * 
 *   Step 1: Poll 4 -> Topo: [4]
 *     Decrement in-degrees of neighbors 0, 1:
 *     inDegree[0]: 2 -> 1
 *     inDegree[1]: 1 -> 0 -> Enqueue 1!
 *     Queue: [5, 1]
 * 
 *   Step 2: Poll 5 -> Topo: [4, 5]
 *     Decrement in-degrees of neighbors 0, 2:
 *     inDegree[0]: 1 -> 0 -> Enqueue 0!
 *     inDegree[2]: 1 -> 0 -> Enqueue 2!
 *     Queue: [1, 0, 2]
 * 
 *   Step 3: Poll 1 -> Topo: [4, 5, 1] (No outgoing neighbors)
 * 
 *   Step 4: Poll 0 -> Topo: [4, 5, 1, 0]
 *     Decrement in-degree of neighbor 3:
 *     inDegree[3]: 2 -> 1
 * 
 *   Step 5: Poll 2 -> Topo: [4, 5, 1, 0, 2]
 *     Decrement in-degree of neighbor 3:
 *     inDegree[3]: 1 -> 0 -> Enqueue 3!
 *     Queue: [3]
 * 
 *   Step 6: Poll 3 -> Topo: [4, 5, 1, 0, 2, 3]
 *     Queue: [] -> Done! Valid Topological Ordering Produced.
 * ============================================================================
 */
public class Step05_TopologicalSortKahnsAlgo {

    /**
     * Static Directed Graph representation.
     */
    public static class DirectedGraph {
        private final int numVertices;
        private final List<List<Integer>> adjList;

        public DirectedGraph(int numVertices) {
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
     * Kahn's Algorithm Implementation.
     */
    public static class KahnsTopologicalSort {

        public static List<Integer> computeTopologicalSort(DirectedGraph graph) {
            int numVertices = graph.getNumVertices();
            int[] inDegree = new int[numVertices];

            System.out.println("[INIT] Calculating in-degree (incoming edge counts) for all vertices...");
            System.out.println("[MEMORY EVENT] Allocated inDegree[] array of size " + numVertices);

            // Compute in-degrees
            for (int u = 0; u < numVertices; u++) {
                for (int v : graph.getNeighbors(u)) {
                    inDegree[v]++;
                }
            }

            System.out.println("[STATE] Initial In-Degree Array: " + Arrays.toString(inDegree));

            // Queue for nodes with in-degree == 0
            Queue<Integer> queue = new ArrayDeque<>();
            for (int i = 0; i < numVertices; i++) {
                if (inDegree[i] == 0) {
                    queue.offer(i);
                    System.out.printf("   In-degree of Node %d is 0 -> Enqueued %d%n", i, i);
                }
            }

            System.out.println("[MEMORY EVENT] Initialized Queue<Integer> with zero in-degree nodes: " + queue);

            List<Integer> topoOrder = new ArrayList<>();

            int stepCount = 1;
            while (!queue.isEmpty()) {
                Integer curr = queue.poll();
                if (curr == null) {
                    continue;
                }
                topoOrder.add(curr);

                System.out.printf("%n[ACTION] Step %d: Polled Node %d -> Added to Topo Order. Current Order: %s%n",
                        stepCount++, curr, topoOrder);

                for (int neighbor : graph.getNeighbors(curr)) {
                    inDegree[neighbor]--;
                    System.out.printf("   -> Reduced in-degree of neighbor %d to %d%n", neighbor, inDegree[neighbor]);

                    if (inDegree[neighbor] == 0) {
                        queue.offer(neighbor);
                        System.out.printf("      [STATE] Node %d in-degree reached 0 -> Enqueued into Queue%n", neighbor);
                    }
                }
            }

            if (topoOrder.size() != numVertices) {
                System.out.println("\n[STATE] ERROR: Graph contains a DIRECTED CYCLE! Topological sort impossible.");
                return new ArrayList<>();
            }

            return topoOrder;
        }
    }

    public static void main(String[] args) {
        System.out.println("=================================================================");
        System.out.println("   Step 05: Topological Sort (Kahn's Algorithm) Demonstration");
        System.out.println("=================================================================");

        int numVertices = 6;
        DirectedGraph dag = new DirectedGraph(numVertices);

        // Build DAG corresponding to course prerequisites ASCII diagram:
        // 5->0, 5->2, 4->0, 4->1, 2->3, 3->1
        System.out.println("[INIT] Constructing Directed Acyclic Graph (DAG) with 6 nodes...");
        dag.addDirectedEdge(5, 0);
        dag.addDirectedEdge(5, 2);
        dag.addDirectedEdge(4, 0);
        dag.addDirectedEdge(4, 1);
        dag.addDirectedEdge(2, 3);
        dag.addDirectedEdge(3, 1);

        System.out.println("[ACTION] Running Kahn's Algorithm on DAG...");
        List<Integer> topoResult = KahnsTopologicalSort.computeTopologicalSort(dag);

        System.out.println("\n=================================================================");
        System.out.println("   Kahn's Algorithm Result:");
        System.out.println("=================================================================");
        System.out.println("[STATE] Computed Topological Order: " + topoResult);

        // Demonstrate Cycle Detection on Cyclic Graph
        System.out.println("\n[INIT] Constructing Cyclic Directed Graph (0->1, 1->2, 2->0)...");
        DirectedGraph cyclicGraph = new DirectedGraph(3);
        cyclicGraph.addDirectedEdge(0, 1);
        cyclicGraph.addDirectedEdge(1, 2);
        cyclicGraph.addDirectedEdge(2, 0);

        System.out.println("[ACTION] Running Kahn's Algorithm on Cyclic Graph...");
        List<Integer> cyclicResult = KahnsTopologicalSort.computeTopologicalSort(cyclicGraph);
        System.out.println("[STATE] Result on Cyclic Graph: " + cyclicResult);

        System.out.println("=================================================================");
        System.out.println("   Step 05 Completed Successfully!");
        System.out.println("=================================================================");
    }
}

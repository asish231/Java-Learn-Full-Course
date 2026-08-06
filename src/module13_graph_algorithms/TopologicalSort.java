package module13_graph_algorithms;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

/**
 * Topological Sort for Directed Acyclic Graphs (DAG) using Kahn's Algorithm (BFS based).
 * Time Complexity: O(V + E)
 */
public class TopologicalSort {

    public static List<Integer> kahnTopologicalSort(int V, List<List<Integer>> adjList) {
        int[] inDegree = new int[V];
        for (int u = 0; u < V; u++) {
            for (int v : adjList.get(u)) {
                inDegree[v]++;
            }
        }

        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < V; i++) {
            if (inDegree[i] == 0) {
                queue.add(i);
            }
        }

        List<Integer> topoOrder = new ArrayList<>();
        while (!queue.isEmpty()) {
            int curr = queue.poll();
            topoOrder.add(curr);

            for (int neighbor : adjList.get(curr)) {
                inDegree[neighbor]--;
                if (inDegree[neighbor] == 0) {
                    queue.add(neighbor);
                }
            }
        }

        if (topoOrder.size() != V) {
            throw new IllegalStateException("Graph is not a DAG (contains cycle)!");
        }

        return topoOrder;
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 📊 TOPOLOGICAL SORT (KAHN'S ALGORITHM) DEMO");
        System.out.println("==================================================\n");

        int V = 6;
        List<List<Integer>> adjList = new ArrayList<>();
        for (int i = 0; i < V; i++) adjList.add(new ArrayList<>());

        // DAG dependencies: 5->0, 5->2, 4->0, 4->1, 2->3, 3->1
        adjList.get(5).add(0);
        adjList.get(5).add(2);
        adjList.get(4).add(0);
        adjList.get(4).add(1);
        adjList.get(2).add(3);
        adjList.get(3).add(1);

        List<Integer> order = kahnTopologicalSort(V, adjList);
        System.out.println("Topological Ordering (Valid Task Dependency Schedule):");
        System.out.println("  " + order);

        System.out.println("\n✅ Topological Sort test completed successfully!");
    }
}

package module13_graph_algorithms;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

/**
 * Graph Traversal Algorithms:
 * 1. Breadth-First Search (BFS) - Queue-based, O(V + E)
 * 2. Depth-First Search (DFS) - Recursion-based, O(V + E)
 */
public class GraphTraversals {

    public static void bfs(int startNode, List<List<Integer>> adjList, int numVertices) {
        boolean[] visited = new boolean[numVertices];
        Queue<Integer> queue = new LinkedList<>();

        visited[startNode] = true;
        queue.add(startNode);

        System.out.print("BFS Traversal starting from vertex " + startNode + ": ");
        while (!queue.isEmpty()) {
            int current = queue.poll();
            System.out.print(current + " ");

            for (int neighbor : adjList.get(current)) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.add(neighbor);
                }
            }
        }
        System.out.println();
    }

    public static void dfs(int startNode, List<List<Integer>> adjList, int numVertices) {
        boolean[] visited = new boolean[numVertices];
        System.out.print("DFS Traversal starting from vertex " + startNode + ": ");
        dfsRecursive(startNode, adjList, visited);
        System.out.println();
    }

    private static void dfsRecursive(int node, List<List<Integer>> adjList, boolean[] visited) {
        visited[node] = true;
        System.out.print(node + " ");

        for (int neighbor : adjList.get(node)) {
            if (!visited[neighbor]) {
                dfsRecursive(neighbor, adjList, visited);
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 🗺️ GRAPH TRAVERSALS (BFS & DFS) DEMONSTRATION");
        System.out.println("==================================================\n");

        int V = 5;
        List<List<Integer>> adjList = new ArrayList<>();
        for (int i = 0; i < V; i++) adjList.add(new ArrayList<>());

        // Build Graph
        adjList.get(0).add(1); adjList.get(1).add(0);
        adjList.get(0).add(2); adjList.get(2).add(0);
        adjList.get(1).add(3); adjList.get(3).add(1);
        adjList.get(1).add(4); adjList.get(4).add(1);
        adjList.get(2).add(4); adjList.get(4).add(2);

        bfs(0, adjList, V);
        dfs(0, adjList, V);

        System.out.println("\n✅ Graph Traversals test completed!");
    }
}

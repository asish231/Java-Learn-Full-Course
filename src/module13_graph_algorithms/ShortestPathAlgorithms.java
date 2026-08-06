package module13_graph_algorithms;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

/**
 * Shortest Path Algorithms:
 * 1. Dijkstra's Algorithm (PriorityQueue based, Non-negative edge weights) - O((V + E) log V)
 * 2. Bellman-Ford Algorithm (Handles negative edge weights & detects negative cycles) - O(V * E)
 */
public class ShortestPathAlgorithms {

    public static class Edge {
        public int target;
        public int weight;

        public Edge(int target, int weight) {
            this.target = target;
            this.weight = weight;
        }
    }

    public static class EdgeTuple {
        public int src, dest, weight;
        public EdgeTuple(int src, int dest, int weight) {
            this.src = src;
            this.dest = dest;
            this.weight = weight;
        }
    }

    // --- DIJKSTRA'S ALGORITHM ---
    public static int[] dijkstra(int start, List<List<Edge>> graph, int V) {
        int[] dist = new int[V];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[start] = 0;

        // Min-PriorityQueue sorting by accumulated distance
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
        pq.add(new int[]{start, 0});

        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int u = curr[0];
            int d = curr[1];

            if (d > dist[u]) continue;

            for (Edge edge : graph.get(u)) {
                if (dist[u] + edge.weight < dist[edge.target]) {
                    dist[edge.target] = dist[u] + edge.weight;
                    pq.add(new int[]{edge.target, dist[edge.target]});
                }
            }
        }
        return dist;
    }

    // --- BELLMAN-FORD ALGORITHM ---
    public static int[] bellmanFord(int start, List<EdgeTuple> edges, int V) {
        int[] dist = new int[V];
        Arrays.fill(dist, 1000_000_000); // Infinity approximation
        dist[start] = 0;

        // Relax all edges V - 1 times
        for (int i = 1; i <= V - 1; i++) {
            for (EdgeTuple edge : edges) {
                if (dist[edge.src] != 1000_000_000 && dist[edge.src] + edge.weight < dist[edge.dest]) {
                    dist[edge.dest] = dist[edge.src] + edge.weight;
                }
            }
        }

        // Check for negative weight cycles
        for (EdgeTuple edge : edges) {
            if (dist[edge.src] != 1000_000_000 && dist[edge.src] + edge.weight < dist[edge.dest]) {
                throw new IllegalStateException("Graph contains a negative weight cycle!");
            }
        }

        return dist;
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 🛣️ SHORTEST PATH ALGORITHMS DEMONSTRATION");
        System.out.println("==================================================\n");

        int V = 5;
        List<List<Edge>> graph = new ArrayList<>();
        for (int i = 0; i < V; i++) graph.add(new ArrayList<>());

        graph.get(0).add(new Edge(1, 4));
        graph.get(0).add(new Edge(2, 2));
        graph.get(1).add(new Edge(2, 3));
        graph.get(1).add(new Edge(3, 2));
        graph.get(1).add(new Edge(4, 3));
        graph.get(2).add(new Edge(1, 1));
        graph.get(2).add(new Edge(3, 4));
        graph.get(2).add(new Edge(4, 5));
        graph.get(3).add(new Edge(4, 1));

        int start = 0;
        int[] distances = dijkstra(start, graph, V);

        System.out.println("Dijkstra Shortest Distances from source vertex " + start + ":");
        for (int i = 0; i < V; i++) {
            System.out.println("  Source " + start + " -> Vertex " + i + " = " + distances[i]);
        }

        System.out.println("\n✅ Shortest Path Algorithms test completed successfully!");
    }
}

package module13_graph_algorithms;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

/**
 * LEVEL 3 (ADVANCED / FAANG): Dijkstra's Shortest Path Algorithm (O((V + E) log V))
 */
public class Level3_AdvancedGraphHard {

    static class Edge {
        int target, weight;
        Edge(int target, int weight) { this.target = target; this.weight = weight; }
    }

    public static int[] dijkstra(int start, List<List<Edge>> adj, int V) {
        int[] dist = new int[V];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[start] = 0;

        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
        pq.add(new int[]{start, 0});

        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int u = curr[0], d = curr[1];
            if (d > dist[u]) continue;

            for (Edge edge : adj.get(u)) {
                if (dist[u] + edge.weight < dist[edge.target]) {
                    dist[edge.target] = dist[u] + edge.weight;
                    pq.add(new int[]{edge.target, dist[edge.target]});
                }
            }
        }
        return dist;
    }

    public static void main(String[] args) {
        System.out.println("--- Module 13: Level 3 (Advanced Dijkstra Shortest Path Hard) ---");
        int V = 5;
        List<List<Edge>> adj = new ArrayList<>();
        for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
        adj.get(0).add(new Edge(1, 4));
        adj.get(0).add(new Edge(2, 2));
        adj.get(2).add(new Edge(1, 1));
        adj.get(1).add(new Edge(3, 5));
        adj.get(2).add(new Edge(3, 8));

        int[] dists = dijkstra(0, adj, V);
        System.out.println("Shortest distances from 0: " + Arrays.toString(dists));
    }
}

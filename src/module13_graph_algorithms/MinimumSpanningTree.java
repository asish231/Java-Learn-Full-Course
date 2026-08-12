package module13_graph_algorithms;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * Minimum spanning tree algorithms.
 *
 * Topics covered:
 *   - Kruskal's algorithm with union-find (LeetCode 1584 style)
 *   - Prim's algorithm for dense graphs
 */
public class MinimumSpanningTree {

    static class UnionFind {
        int[] parent, rank;
        UnionFind(int n) {
            parent = new int[n];
            rank = new int[n];
            for (int i = 0; i < n; i++) parent[i] = i;
        }
        int find(int x) { return parent[x] == x ? x : (parent[x] = find(parent[x])); }
        boolean union(int x, int y) {
            int rx = find(x), ry = find(y);
            if (rx == ry) return false;
            if (rank[rx] < rank[ry]) parent[rx] = ry;
            else if (rank[rx] > rank[ry]) parent[ry] = rx;
            else { parent[ry] = rx; rank[rx]++; }
            return true;
        }
    }

    static class Edge {
        int u, v, w;
        Edge(int u, int v, int w) { this.u = u; this.v = v; this.w = w; }
    }

    public static int kruskal(int n, int[][] edges) {
        List<Edge> list = new ArrayList<>();
        for (int[] e : edges) list.add(new Edge(e[0], e[1], e[2]));
        Collections.sort(list, Comparator.comparingInt(e -> e.w));
        UnionFind uf = new UnionFind(n);
        int cost = 0, used = 0;
        for (Edge e : list) {
            if (uf.union(e.u, e.v)) { cost += e.w; used++; }
        }
        return used == n - 1 ? cost : -1;
    }

    public static int prim(int[][] graph) {
        int n = graph.length;
        boolean[] inMst = new boolean[n];
        int[] minEdge = new int[n];
        for (int i = 1; i < n; i++) minEdge[i] = Integer.MAX_VALUE;
        minEdge[0] = 0;
        int cost = 0;
        for (int i = 0; i < n; i++) {
            int u = -1;
            for (int j = 0; j < n; j++) if (!inMst[j] && (u == -1 || minEdge[j] < minEdge[u])) u = j;
            inMst[u] = true;
            cost += minEdge[u];
            for (int v = 0; v < n; v++) {
                if (!inMst[v] && graph[u][v] > 0 && graph[u][v] < minEdge[v]) minEdge[v] = graph[u][v];
            }
        }
        return cost;
    }

    public static void main(String[] args) {
        System.out.println("--- Minimum Spanning Tree ---");
        int[][] edges = {{0, 1, 4}, {0, 7, 8}, {1, 2, 8}, {1, 7, 11}, {2, 3, 7}, {2, 5, 4}, {2, 8, 2}, {3, 4, 9}, {3, 5, 14}, {4, 5, 10}, {5, 6, 2}, {6, 7, 1}, {6, 8, 6}, {7, 8, 7}};
        System.out.println("Kruskal MST cost: " + kruskal(9, edges));
    }
}

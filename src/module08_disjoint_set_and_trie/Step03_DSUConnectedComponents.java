package module08_disjoint_set_and_trie;

import java.util.ArrayList;
import java.util.List;

/**
 * Step 03: Connected Components & Cycle Detection using DSU
 *
 * <pre>
 * GRAPH COMPONENT MERGING & CYCLE DETECTION:
 *
 * Graph Vertices: N = 6 (0 to 5)
 * Edges Stream: (0-1), (1-2), (2-0) [CYCLE!], (3-4)
 *
 *   Components before edge (2-0):
 *   Set A: {0, 1, 2} (Root = 0)
 *   Edge (2, 0) processed: find(2) == 0 and find(0) == 0!
 *   ===> CYCLE DETECTED between 2 and 0!
 *
 * Component Tracking:
 *   Initial Component Count = 6
 *   Add (0-1) -> 5
 *   Add (1-2) -> 4
 *   Add (2-0) -> Cycle! (Count remains 4)
 *   Add (3-4) -> 3
 * </pre>
 */
public class Step03_DSUConnectedComponents {

    /**
     * Helper static DSU class for Graph analysis.
     */
    static class GraphDSU {
        private final int[] parent;
        private final int[] rank;
        private int components;

        public GraphDSU(int n) {
            this.parent = new int[n];
            this.rank = new int[n];
            this.components = n;
            for (int i = 0; i < n; i++) {
                parent[i] = i;
                rank[i] = 0;
            }
        }

        public int find(int i) {
            if (parent[i] != i) {
                parent[i] = find(parent[i]);
            }
            return parent[i];
        }

        public boolean union(int u, int v) {
            int rootU = find(u);
            int rootV = find(v);

            if (rootU == rootV) {
                return false; // Cycle detected: u and v are already connected!
            }

            if (rank[rootU] < rank[rootV]) {
                parent[rootU] = rootV;
            } else if (rank[rootU] > rank[rootV]) {
                parent[rootV] = rootU;
            } else {
                parent[rootV] = rootU;
                rank[rootU]++;
            }
            components--;
            return true;
        }

        public int getComponentCount() {
            return components;
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 08 - Disjoint Set & Trie | Step 03: DSU Connected Components");
        System.out.println("======================================================================\n");

        int n = 6;
        int[][] edges = {
            {0, 1},
            {1, 2},
            {2, 0}, // Redundant edge creating cycle 0-1-2
            {3, 4},
            {4, 5}
        };

        System.out.println("[INIT] Graph initialized with N = " + n + " vertices.");
        GraphDSU dsu = new GraphDSU(n);
        List<String> detectedCycles = new ArrayList<>();

        System.out.println("\n--- Processing Graph Edges ---");
        for (int[] edge : edges) {
            int u = edge[0];
            int v = edge[1];
            System.out.println("\n[ACTION] Inspecting Edge (" + u + " - " + v + ")");

            boolean unionSuccessful = dsu.union(u, v);
            if (unionSuccessful) {
                System.out.println("[STATE] Edge (" + u + " - " + v + ") merged sets. Remaining Components = " + dsu.getComponentCount());
            } else {
                String cycleMsg = "Cycle Edge detected between vertex " + u + " and " + v;
                detectedCycles.add(cycleMsg);
                System.out.println("[MEMORY EVENT] " + cycleMsg + " (Both already share root " + dsu.find(u) + ")");
            }
        }

        System.out.println("\n======================================================================");
        System.out.println("FINAL GRAPH ANALYSIS SUMMARY:");
        System.out.println("  - Total Connected Components: " + dsu.getComponentCount());
        System.out.println("  - Total Redundant Cycle Edges: " + detectedCycles.size());
        for (String cycle : detectedCycles) {
            System.out.println("    * " + cycle);
        }
        System.out.println("======================================================================");
    }
}

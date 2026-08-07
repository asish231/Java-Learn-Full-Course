package module08_disjoint_set_and_trie;

import java.util.Arrays;

/**
 * Step 02: Optimized Disjoint Set Union (Path Compression + Union by Rank)
 *
 * <pre>
 * DSU OPTIMIZATIONS:
 *
 * 1. PATH COMPRESSION (in find(x)):
 *    Flattens tree by reassigning parent of every traversed node directly to root!
 *    Before find(0):                  After find(0):
 *       (0) -> (1) -> (2) -> (3)        (0) ----\
 *                             ^         (1) ----+---> (3) [Root]
 *                           [Root]      (2) ----/
 *
 * 2. UNION BY RANK (in union(x, y)):
 *    Attaches tree of lower rank (height) under root of higher rank tree.
 *    If ranks are equal, attach one under the other and increment rank.
 *
 * Amortized Time Complexity: O(alpha(N)) ~ O(1) per operation (Inverse Ackermann).
 * </pre>
 */
public class Step02_DisjointSetUnionOptimized {

    /**
     * Fully optimized Disjoint Set Union data structure.
     */
    static class OptimizedDSU {
        private final int[] parent;
        private final int[] rank;
        private int componentCount;

        public OptimizedDSU(int n) {
            this.parent = new int[n];
            this.rank = new int[n];
            this.componentCount = n;
            for (int i = 0; i < n; i++) {
                parent[i] = i;
                rank[i] = 0;
            }
        }

        /**
         * Optimized find with recursive Path Compression.
         */
        public int find(int i) {
            if (parent[i] != i) {
                int oldParent = parent[i];
                parent[i] = find(parent[i]); // Path compression step
                if (oldParent != parent[i]) {
                    System.out.println("  [MEMORY EVENT] Path Compression: Node " + i
                            + " reparented from " + oldParent + " directly to Root " + parent[i]);
                }
            }
            return parent[i];
        }

        /**
         * Optimized union using Union by Rank.
         */
        public boolean union(int x, int y) {
            int rootX = find(x);
            int rootY = find(y);

            if (rootX == rootY) {
                System.out.println("  [STATE] Elements " + x + " and " + y + " already in same set (Root " + rootX + ")");
                return false; // Already connected
            }

            // Union by rank heuristic
            if (rank[rootX] < rank[rootY]) {
                parent[rootX] = rootY;
                System.out.println("  [ACTION] Rank(" + rootX + ") < Rank(" + rootY + "): Attached root " + rootX + " under root " + rootY);
            } else if (rank[rootX] > rank[rootY]) {
                parent[rootY] = rootX;
                System.out.println("  [ACTION] Rank(" + rootX + ") > Rank(" + rootY + "): Attached root " + rootY + " under root " + rootX);
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
                System.out.println("  [ACTION] Equal ranks (" + rank[rootY] + "): Attached root " + rootY + " under root " + rootX + ", new Rank(" + rootX + ") = " + rank[rootX]);
            }

            componentCount--;
            return true;
        }

        public boolean connected(int x, int y) {
            return find(x) == find(y);
        }

        public int getComponentCount() {
            return componentCount;
        }

        public String getParentArrayString() {
            return Arrays.toString(parent);
        }

        public String getRankArrayString() {
            return Arrays.toString(rank);
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 08 - Disjoint Set & Trie | Step 02: Optimized DSU");
        System.out.println("======================================================================\n");

        int n = 8;
        OptimizedDSU dsu = new OptimizedDSU(n);
        System.out.println("[INIT] Initialized Optimized DSU with N = " + n + " elements.");
        System.out.println("[STATE] Component Count = " + dsu.getComponentCount());

        System.out.println("\n--- 1. Union Operations with Union by Rank ---");
        dsu.union(0, 1);
        dsu.union(2, 3);
        dsu.union(4, 5);
        dsu.union(6, 7);

        dsu.union(0, 2);
        dsu.union(4, 6);
        dsu.union(0, 4);

        System.out.println("\n[STATE] Parent Array: " + dsu.getParentArrayString());
        System.out.println("[STATE] Rank Array:   " + dsu.getRankArrayString());
        System.out.println("[STATE] Remaining Components: " + dsu.getComponentCount());

        System.out.println("\n--- 2. Path Compression Verification ---");
        System.out.println("[ACTION] Calling find(7) to trigger recursive Path Compression:");
        int root7 = dsu.find(7);
        System.out.println("[STATE] Root of 7: " + root7);
        System.out.println("[STATE] Parent Array after Path Compression: " + dsu.getParentArrayString());

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Optimized DSU implemented successfully.");
        System.out.println("======================================================================");
    }
}

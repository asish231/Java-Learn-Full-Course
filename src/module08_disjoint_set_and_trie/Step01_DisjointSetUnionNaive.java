package module08_disjoint_set_and_trie;

import java.util.Arrays;

/**
 * Step 01: Naive Disjoint Set Union (DSU / Union-Find)
 *
 * <pre>
 * NAIVE DSU REPRESENTATION & DEGENERATION:
 *
 * Initial State (N=5 independent sets):
 *   parent: [0, 1, 2, 3, 4]
 *   Nodes:  (0)  (1)  (2)  (3)  (4)
 *
 * Union Operations without Rank/Compression:
 *   union(0, 1) -> 0 points to 1
 *   union(1, 2) -> 1 points to 2
 *   union(2, 3) -> 2 points to 3
 *   union(3, 4) -> 3 points to 4
 *
 * Degenerate Linked List Chain (Worst-Case Tree Height = O(N)):
 *   (0) ---> (1) ---> (2) ---> (3) ---> (4) [Root]
 *
 * Cost of find(0): Traversals = 4 steps -> O(N) Worst Case!
 * </pre>
 */
public class Step01_DisjointSetUnionNaive {

    /**
     * Naive implementation of Disjoint Set Union without optimizations.
     */
    static class NaiveDSU {
        private final int[] parent;

        public NaiveDSU(int n) {
            this.parent = new int[n];
            for (int i = 0; i < n; i++) {
                parent[i] = i; // Each element is initially its own parent root
            }
        }

        /**
         * Naive find root: follow parent pointers sequentially without path compression.
         */
        public int find(int i) {
            int steps = 0;
            int current = i;
            while (current != parent[current]) {
                steps++;
                current = parent[current];
            }
            System.out.println("  [MEMORY EVENT] Naive find(" + i + ") reached root " + current + " in " + steps + " steps.");
            return current;
        }

        /**
         * Naive union: attach root of x directly under root of y without rank heuristics.
         */
        public void union(int x, int y) {
            int rootX = find(x);
            int rootY = find(y);
            if (rootX != rootY) {
                parent[rootX] = rootY;
                System.out.println("  [ACTION] United sets: parent[" + rootX + "] set to " + rootY);
            } else {
                System.out.println("  [STATE] Elements " + x + " and " + y + " are already in the same set (Root " + rootX + ")");
            }
        }

        public boolean connected(int x, int y) {
            return find(x) == find(y);
        }

        public String getParentArrayString() {
            return Arrays.toString(parent);
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 08 - Disjoint Set & Trie | Step 01: Naive Disjoint Set Union");
        System.out.println("======================================================================\n");

        int n = 5;
        NaiveDSU dsu = new NaiveDSU(n);
        System.out.println("[INIT] Initialized Naive DSU with N = " + n + " elements.");
        System.out.println("[STATE] Initial Parent Array: " + dsu.getParentArrayString());

        System.out.println("\n--- 1. Performing Sequential Unions to Form a Degenerate Chain ---");
        dsu.union(0, 1);
        dsu.union(1, 2);
        dsu.union(2, 3);
        dsu.union(3, 4);

        System.out.println("[STATE] Parent Array after linear unions: " + dsu.getParentArrayString());

        System.out.println("\n--- 2. Measuring Find Complexity on Degenerate Chain ---");
        System.out.println("[ACTION] Finding root of element 0 (Bottom of linear chain):");
        int root0 = dsu.find(0);
        System.out.println("[STATE] Element 0 root: " + root0);

        System.out.println("\n[ACTION] Checking connectivity of 0 and 4:");
        boolean isConnected = dsu.connected(0, 4);
        System.out.println("[STATE] Connected(0, 4): " + isConnected);

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Naive DSU behavior demonstrated.");
        System.out.println("======================================================================");
    }
}

package module08_disjoint_set_and_trie;

/**
 * Disjoint Set Union (DSU / Union-Find) Implementation
 * Uses Path Compression & Union by Rank optimizations.
 */
public class DisjointSetUnion {

    private int[] parent;
    private int[] rank;

    public DisjointSetUnion(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i; // Self-parent initially
            rank[i] = 0;
        }
    }

    /**
     * Find operation with Path Compression - Nearly O(1) amortized
     */
    public int find(int i) {
        if (parent[i] != i) {
            parent[i] = find(parent[i]); // Path compression
        }
        return parent[i];
    }

    /**
     * Union operation with Union by Rank - Nearly O(1) amortized
     */
    public boolean union(int i, int j) {
        int rootI = find(i);
        int rootJ = find(j);

        if (rootI == rootJ) return false; // Already in same set (cycle detection)

        if (rank[rootI] < rank[rootJ]) {
            parent[rootI] = rootJ;
        } else if (rank[rootI] > rank[rootJ]) {
            parent[rootJ] = rootI;
        } else {
            parent[rootJ] = rootI;
            rank[rootI]++;
        }
        return true;
    }

    public boolean isConnected(int i, int j) {
        return find(i) == find(j);
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 🔗 DISJOINT SET UNION (UNION-FIND) DEMONSTRATION");
        System.out.println("==================================================\n");

        DisjointSetUnion dsu = new DisjointSetUnion(5); // Elements 0..4

        System.out.println("Unifying (0, 1)...");
        dsu.union(0, 1);
        System.out.println("Unifying (2, 3)...");
        dsu.union(2, 3);

        System.out.println("Is 0 connected to 1? " + dsu.isConnected(0, 1)); // true
        System.out.println("Is 0 connected to 2? " + dsu.isConnected(0, 2)); // false

        System.out.println("\nUnifying (1, 3)...");
        dsu.union(1, 3);
        System.out.println("Is 0 connected to 2 now? " + dsu.isConnected(0, 2)); // true via 0-1-3-2!

        System.out.println("\n✅ Disjoint Set Union test passed!");
    }
}

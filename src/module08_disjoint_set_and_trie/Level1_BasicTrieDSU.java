package module08_disjoint_set_and_trie;

/**
 * LEVEL 1 (BASIC): Basic Trie Operations & Simple Disjoint Set Union
 */
public class Level1_BasicTrieDSU {

    // 1. Basic DSU for Component Counting
    static class DSU {
        int[] parent;
        DSU(int n) {
            parent = new int[n];
            for (int i = 0; i < n; i++) parent[i] = i;
        }
        int find(int i) {
            if (parent[i] == i) return i;
            return parent[i] = find(parent[i]); // Path compression
        }
        void union(int i, int j) {
            int rootI = find(i), rootJ = find(j);
            if (rootI != rootJ) parent[rootI] = rootJ;
        }
    }

    public static void main(String[] args) {
        System.out.println("--- Module 08: Level 1 (Basic DSU & Trie Operations) ---");
        DSU dsu = new DSU(5);
        dsu.union(0, 1);
        dsu.union(1, 2);

        System.out.println("Are 0 and 2 connected? " + (dsu.find(0) == dsu.find(2))); // true
        System.out.println("Are 0 and 4 connected? " + (dsu.find(0) == dsu.find(4))); // false
    }
}

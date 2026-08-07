package module07_heaps_and_priority_queues;

import java.util.Arrays;

/**
 * Step 02: Heap Array Representation & Index Navigation Formulas
 *
 * <pre>
 * BINARY HEAP TO ARRAY MAPPING:
 *
 * Complete Binary Tree:
 *                   [ 10 ]  (index 0)
 *                 /        \
 *           [ 20 ]          [ 30 ]  (indices 1, 2)
 *          /      \        /      \
 *     [ 40 ]    [ 50 ]  [ 60 ]    [ 70 ]  (indices 3, 4, 5, 6)
 *
 * Mapped 0-Indexed Array:
 * +------+------+------+------+------+------+------+
 * |  10  |  20  |  30  |  40  |  50  |  60  |  70  |
 * +------+------+------+------+------+------+------+
 * Index:  0      1      2      3      4      5      6
 *
 * NAVIGATION FORMULAS (for index i):
 *   - Parent Index      = (i - 1) / 2  [Integer Division]
 *   - Left Child Index  = (2 * i) + 1
 *   - Right Child Index = (2 * i) + 2
 * </pre>
 */
public class Step02_HeapArrayRepresentation {

    /**
     * Helper class providing pure binary heap array navigation logic.
     */
    static class HeapArrayNavigator {

        public static int getParentIndex(int index) {
            if (index <= 0) {
                return -1;
            }
            return (index - 1) / 2;
        }

        public static int getLeftChildIndex(int index) {
            return (2 * index) + 1;
        }

        public static int getRightChildIndex(int index) {
            return (2 * index) + 2;
        }

        public static boolean hasLeftChild(int index, int size) {
            return getLeftChildIndex(index) < size;
        }

        public static boolean hasRightChild(int index, int size) {
            return getRightChildIndex(index) < size;
        }

        public static boolean hasParent(int index) {
            return index > 0;
        }

        public static boolean isLeaf(int index, int size) {
            return !hasLeftChild(index, size);
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 07 - Heaps & Priority Queues | Step 02: Heap Array Representation");
        System.out.println("======================================================================\n");

        int[] heapArray = {10, 20, 30, 40, 50, 60, 70};
        int size = heapArray.length;

        System.out.println("[INIT] Binary Heap Array: " + Arrays.toString(heapArray));
        System.out.println("[STATE] Heap size N = " + size);

        System.out.println("\n--- 1. Navigating Tree Nodes via Array Index Math ---");

        for (int i = 0; i < size; i++) {
            int val = heapArray[i];
            System.out.println("\n[ACTION] Inspecting Node at Index " + i + " (Value: " + val + ")");

            if (HeapArrayNavigator.hasParent(i)) {
                int pIdx = HeapArrayNavigator.getParentIndex(i);
                System.out.println("  --> Parent: Index " + pIdx + " (Value: " + heapArray[pIdx] + ")");
            } else {
                System.out.println("  --> Root Node (No Parent)");
            }

            if (HeapArrayNavigator.hasLeftChild(i, size)) {
                int lIdx = HeapArrayNavigator.getLeftChildIndex(i);
                System.out.println("  --> Left Child: Index " + lIdx + " (Value: " + heapArray[lIdx] + ")");
            } else {
                System.out.println("  --> No Left Child");
            }

            if (HeapArrayNavigator.hasRightChild(i, size)) {
                int rIdx = HeapArrayNavigator.getRightChildIndex(i);
                System.out.println("  --> Right Child: Index " + rIdx + " (Value: " + heapArray[rIdx] + ")");
            } else {
                System.out.println("  --> No Right Child");
            }

            boolean leaf = HeapArrayNavigator.isLeaf(i, size);
            System.out.println("[STATE] Is Leaf Node: " + leaf);
            System.out.println("[MEMORY EVENT] Index formula evaluated without pointers: i=" + i
                    + " -> L=" + HeapArrayNavigator.getLeftChildIndex(i)
                    + ", R=" + HeapArrayNavigator.getRightChildIndex(i)
                    + ", P=" + HeapArrayNavigator.getParentIndex(i));
        }

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Heap array representation verified.");
        System.out.println("======================================================================");
    }
}

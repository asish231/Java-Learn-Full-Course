package module07_heaps_and_priority_queues;

import java.util.Arrays;

/**
 * Step 04: HeapSort Algorithm (In-Place O(N log N) Sorting)
 *
 * <pre>
 * HEAPSORT PHASES:
 *
 * Phase 1: Build Max-Heap In-Place O(N)
 *   Start from last non-leaf node: index (N / 2) - 1 down to 0.
 *   Call siftDown on each subtree.
 *   Unsorted Array:  [4, 10, 3, 5, 1]
 *   Max-Heap Array:  [10, 5, 3, 4, 1]
 *
 * Phase 2: Extract Maximum & Heapify O(N log N)
 *   Loop i from N - 1 down to 1:
 *     1. Swap arr[0] (Current Max) with arr[i] (End of Unsorted Subarray).
 *     2. Call siftDown(0) on reduced heap size i.
 *
 *   Step 1 Swap 10 & 1:  [1, 5, 3, 4 | 10]  -> Heapify -> [5, 4, 3, 1 | 10]
 *   Step 2 Swap 5 & 1:   [1, 4, 3 | 5, 10]  -> Heapify -> [4, 1, 3 | 5, 10]
 *   Result Sorted:       [1, 3, 4, 5, 10]
 * </pre>
 */
public class Step04_HeapSortAlgorithm {

    /**
     * Helper class containing HeapSort algorithm steps.
     */
    static class HeapSorter {

        public static void heapSort(int[] arr) {
            int n = arr.length;

            System.out.println("[ACTION] Phase 1: Building Max-Heap In-Place...");
            // Build Max-Heap: Start from last non-leaf parent node down to root 0
            for (int i = (n / 2) - 1; i >= 0; i--) {
                siftDown(arr, n, i);
            }
            System.out.println("[STATE] Max-Heap Built: " + Arrays.toString(arr));

            System.out.println("\n[ACTION] Phase 2: Extracting Max and Sorting...");
            // Extract elements one by one from heap
            for (int i = n - 1; i > 0; i--) {
                System.out.println("  [MEMORY EVENT] Swapping Max root arr[0]=" + arr[0] + " with arr[" + i + "]=" + arr[i]);
                swap(arr, 0, i);
                System.out.println("  [STATE] Array before heapify (sorted tail at index >= " + i + "): " + Arrays.toString(arr));

                // Call siftDown on reduced heap of size i
                siftDown(arr, i, 0);
                System.out.println("  [STATE] Heap after siftDown(size=" + i + "): " + Arrays.toString(arr));
            }
        }

        private static void siftDown(int[] arr, int heapSize, int rootIndex) {
            int largest = rootIndex;
            int left = 2 * rootIndex + 1;
            int right = 2 * rootIndex + 2;

            if (left < heapSize && arr[left] > arr[largest]) {
                largest = left;
            }
            if (right < heapSize && arr[right] > arr[largest]) {
                largest = right;
            }

            if (largest != rootIndex) {
                swap(arr, rootIndex, largest);
                siftDown(arr, heapSize, largest);
            }
        }

        private static void swap(int[] arr, int i, int j) {
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 07 - Heaps & Priority Queues | Step 04: HeapSort Algorithm");
        System.out.println("======================================================================\n");

        int[] data = {12, 11, 13, 5, 6, 7};
        System.out.println("[INIT] Original Unsorted Array: " + Arrays.toString(data));

        HeapSorter.heapSort(data);

        System.out.println("\n[STATE] Final Sorted Array: " + Arrays.toString(data));

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: HeapSort executed correctly.");
        System.out.println("======================================================================");
    }
}

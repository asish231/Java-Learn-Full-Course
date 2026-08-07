package module09_sorting_and_searching;

import java.util.Arrays;

/**
 * Step 04: Insertion Sort Algorithm
 *
 * <pre>
 * INSERTION SORT SHIFT MECHANISM:
 *
 * Sorted Prefix | Unsorted Key
 *
 * Step 1: [ 12 | 11, 13, 5, 6 ] -> Key = 11
 *         12 > 11 -> Shift 12 right -> [ 12, 12, 13, 5, 6 ] -> Insert 11 -> [ 11, 12 | 13, 5, 6 ]
 *
 * Step 2: [ 11, 12 | 13, 5, 6 ] -> Key = 13
 *         12 < 13 -> No shift needed -> [ 11, 12, 13 | 5, 6 ]
 *
 * Step 3: [ 11, 12, 13 | 5, 6 ] -> Key = 5
 *         Shift 13, 12, 11 right -> Insert 5 at index 0 -> [ 5, 11, 12, 13 | 6 ]
 *
 * Characteristics: Adaptive & Stable. Excellent for small or nearly sorted arrays!
 * </pre>
 */
public class Step04_InsertionSort {

    public static void insertionSort(int[] arr) {
        int n = arr.length;

        System.out.println("[ACTION] Starting Insertion Sort on array of size N = " + n);

        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;

            System.out.println("\n--- Step " + i + ": Inserting Key = " + key + " into sorted prefix [0 .. " + (i - 1) + "] ---");

            while (j >= 0 && arr[j] > key) {
                System.out.println("  [MEMORY EVENT] Shifted arr[" + j + "]=" + arr[j] + " right to index " + (j + 1));
                arr[j + 1] = arr[j];
                j--;
            }

            arr[j + 1] = key;
            System.out.println("  [ACTION] Placed Key = " + key + " into index " + (j + 1));
            System.out.println("  [STATE] Sorted prefix after Step " + i + ": " + Arrays.toString(arr));
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 09 - Sorting & Searching | Step 04: Insertion Sort");
        System.out.println("======================================================================\n");

        int[] arr = {12, 11, 13, 5, 6};
        System.out.println("[INIT] Original Unsorted Array: " + Arrays.toString(arr));

        insertionSort(arr);

        System.out.println("\n======================================================================");
        System.out.println("RESULT: Sorted Array: " + Arrays.toString(arr));
        System.out.println("======================================================================");
    }
}

package module09_sorting_and_searching;

import java.util.Arrays;

/**
 * Step 02: Bubble Sort Algorithm with Early Exit Flag
 *
 * <pre>
 * BUBBLE SORT PAIRWISE SWAP MECHANISM:
 *
 * Pass 1 on [5, 1, 4, 2, 8]:
 *   Compare (5, 1) -> 5 > 1 -> Swap -> [1, 5, 4, 2, 8]
 *   Compare (5, 4) -> 5 > 4 -> Swap -> [1, 4, 5, 2, 8]
 *   Compare (5, 2) -> 5 > 2 -> Swap -> [1, 4, 2, 5, 8]
 *   Compare (5, 8) -> 5 < 8 -> Keep -> [1, 4, 2, 5 | 8] (Largest element 8 bubbled to end!)
 *
 * Early Exit Optimization:
 *   If a complete pass performs ZERO swaps, the array is already sorted -> break early in O(N)!
 * </pre>
 */
public class Step02_BubbleSort {

    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        int totalSwaps = 0;
        int passes = 0;

        System.out.println("[ACTION] Starting Bubble Sort on array of size N = " + n);

        for (int i = 0; i < n - 1; i++) {
            passes++;
            boolean swapped = false;
            System.out.println("\n--- Pass " + passes + " (Sorting prefix [0 .. " + (n - 1 - i) + "]) ---");

            for (int j = 0; j < n - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    System.out.println("  [MEMORY EVENT] Swap required: arr[" + j + "]=" + arr[j]
                            + " > arr[" + (j + 1) + "]=" + arr[j + 1]);
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                    totalSwaps++;
                }
            }

            System.out.println("  [STATE] Pass " + passes + " Complete -> Array: " + Arrays.toString(arr));

            if (!swapped) {
                System.out.println("  [STATE] Early exit triggered! Zero swaps made in Pass " + passes + ". Array is fully sorted.");
                break;
            }
        }

        System.out.println("\n[STATE] Bubble Sort Completed in " + passes + " passes and " + totalSwaps + " total swaps.");
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 09 - Sorting & Searching | Step 02: Bubble Sort");
        System.out.println("======================================================================\n");

        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        System.out.println("[INIT] Original Unsorted Array: " + Arrays.toString(arr));

        bubbleSort(arr);

        System.out.println("\n======================================================================");
        System.out.println("RESULT: Sorted Array: " + Arrays.toString(arr));
        System.out.println("======================================================================");
    }
}

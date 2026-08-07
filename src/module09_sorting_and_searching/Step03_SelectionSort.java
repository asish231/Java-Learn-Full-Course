package module09_sorting_and_searching;

import java.util.Arrays;

/**
 * Step 03: Selection Sort Algorithm
 *
 * <pre>
 * SELECTION SORT MINIMUM ELEMENT SWAP MECHANISM:
 *
 * Divide array into Sorted Prefix | Unsorted Suffix
 *
 * Step 1: [ 64, 25, 12, 22, 11 ] -> Scan suffix for Minimum -> Min = 11 at Index 4
 *         Swap 64 and 11 -> [ 11 | 25, 12, 22, 64 ]
 *
 * Step 2: [ 11 | 25, 12, 22, 64 ] -> Scan suffix for Minimum -> Min = 12 at Index 2
 *         Swap 25 and 12 -> [ 11, 12 | 25, 22, 64 ]
 *
 * Step 3: [ 11, 12 | 25, 22, 64 ] -> Scan suffix for Minimum -> Min = 22 at Index 3
 *         Swap 25 and 22 -> [ 11, 12, 22 | 25, 64 ]
 *
 * Characteristics: Minimizes memory write swaps to exactly O(N) swaps!
 * </pre>
 */
public class Step03_SelectionSort {

    public static void selectionSort(int[] arr) {
        int n = arr.length;
        int totalSwaps = 0;

        System.out.println("[ACTION] Starting Selection Sort on array of size N = " + n);

        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            System.out.println("\n--- Step " + (i + 1) + ": Finding minimum element in unsorted suffix [Index " + i + " .. " + (n - 1) + "] ---");

            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }

            if (minIdx != i) {
                System.out.println("  [MEMORY EVENT] Swapping arr[" + i + "]=" + arr[i]
                        + " with minimum arr[" + minIdx + "]=" + arr[minIdx]);
                int temp = arr[i];
                arr[i] = arr[minIdx];
                arr[minIdx] = temp;
                totalSwaps++;
            } else {
                System.out.println("  [STATE] Element arr[" + i + "]=" + arr[i] + " is already minimum in suffix. No swap needed.");
            }

            System.out.println("  [STATE] Array after Step " + (i + 1) + ": " + Arrays.toString(arr));
        }

        System.out.println("\n[STATE] Selection Sort Completed with " + totalSwaps + " total element swaps.");
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 09 - Sorting & Searching | Step 03: Selection Sort");
        System.out.println("======================================================================\n");

        int[] arr = {64, 25, 12, 22, 11};
        System.out.println("[INIT] Original Unsorted Array: " + Arrays.toString(arr));

        selectionSort(arr);

        System.out.println("\n======================================================================");
        System.out.println("RESULT: Sorted Array: " + Arrays.toString(arr));
        System.out.println("======================================================================");
    }
}

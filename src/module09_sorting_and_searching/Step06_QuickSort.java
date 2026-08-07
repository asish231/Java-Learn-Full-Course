package module09_sorting_and_searching;

import java.util.Arrays;

/**
 * Step 06: Quick Sort Algorithm (Lomuto Partition Scheme)
 *
 * <pre>
 * LOMUTO PARTITION SCHEME VISUALIZATION:
 *
 * Array Sub-range [low .. high], Pivot = arr[high]
 * Example: [10, 80, 30, 90, 40, 50, 70] (Pivot = 70)
 *
 * Boundary Pointers:
 *   i = low - 1  (Tracks end of <= Pivot elements)
 *   j = low      (Scans current element)
 *
 * Scan Step j:
 *   j=0: val=10 <= 70 -> i++=0 -> Swap arr[0], arr[0] -> [10, 80, 30, 90, 40, 50 | 70]
 *   j=1: val=80 > 70  -> Do nothing
 *   j=2: val=30 <= 70 -> i++=1 -> Swap arr[1]=80, arr[2]=30 -> [10, 30, 80, 90, 40, 50 | 70]
 *   j=4: val=40 <= 70 -> i++=2 -> Swap arr[2]=80, arr[4]=40 -> [10, 30, 40, 90, 80, 50 | 70]
 *   j=5: val=50 <= 70 -> i++=3 -> Swap arr[3]=90, arr[5]=50 -> [10, 30, 40, 50, 80, 90 | 70]
 *
 * Final Step: Swap arr[i+1=4]=80 with Pivot arr[high]=70 -> [10, 30, 40, 50 | 70 | 90, 80]
 * Pivot 70 placed at final sorted index 4!
 * </pre>
 */
public class Step06_QuickSort {

    public static void quickSort(int[] arr) {
        if (arr == null || arr.length <= 1) {
            return;
        }
        System.out.println("[ACTION] Starting Quick Sort on array of size N = " + arr.length);
        quickSortHelper(arr, 0, arr.length - 1, 1);
    }

    private static void quickSortHelper(int[] arr, int low, int high, int depth) {
        if (low < high) {
            int pivotIndex = partition(arr, low, high, depth);

            quickSortHelper(arr, low, pivotIndex - 1, depth + 1);
            quickSortHelper(arr, pivotIndex + 1, high, depth + 1);
        }
    }

    private static int partition(int[] arr, int low, int high, int depth) {
        int pivot = arr[high];
        int i = low - 1; // Index of smaller element
        String indent = "  ".repeat(depth);

        System.out.println("\n" + indent + "[ACTION] Partitioning Subarray [" + low + " .. " + high + "] with Pivot = " + pivot);

        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                if (i != j) {
                    System.out.println(indent + "  [MEMORY EVENT] Swap arr[" + i + "]=" + arr[i]
                            + " with arr[" + j + "]=" + arr[j] + " (<= Pivot " + pivot + ")");
                    swap(arr, i, j);
                }
            }
        }

        // Place pivot at its correct sorted position (i + 1)
        int finalPivotIdx = i + 1;
        System.out.println(indent + "  [MEMORY EVENT] Placed Pivot " + pivot + " into final sorted index " + finalPivotIdx);
        swap(arr, finalPivotIdx, high);

        System.out.println(indent + "[STATE] Subarray after Partition: "
                + Arrays.toString(Arrays.copyOfRange(arr, low, high + 1))
                + " | Pivot Index: " + finalPivotIdx);

        return finalPivotIdx;
    }

    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 09 - Sorting & Searching | Step 06: Quick Sort");
        System.out.println("======================================================================\n");

        int[] arr = {10, 80, 30, 90, 40, 50, 70};
        System.out.println("[INIT] Original Unsorted Array: " + Arrays.toString(arr));

        quickSort(arr);

        System.out.println("\n======================================================================");
        System.out.println("RESULT: Sorted Array: " + Arrays.toString(arr));
        System.out.println("======================================================================");
    }
}

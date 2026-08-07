package module09_sorting_and_searching;

import java.util.Arrays;

/**
 * Step 05: Merge Sort Algorithm (Divide & Conquer)
 *
 * <pre>
 * MERGE SORT RECURSIVE DIVIDE & MERGE TREE:
 *
 *                      [ 38, 27, 43, 3, 9, 82, 10 ]
 *                                   /  \
 *                  [ 38, 27, 43, 3 ]    [ 9, 82, 10 ]
 *                      /      \             /     \
 *                [ 38, 27 ]  [ 43, 3 ]   [ 9, 82 ] [ 10 ]
 *                 /    \      /    \      /   \
 *               [38]  [27]  [43]   [3]  [9]  [82]
 *                 \    /      \    /      \   /
 *                [ 27, 38 ]  [ 3, 43 ]   [ 9, 82 ] [ 10 ]
 *                      \      /             \     /
 *                  [ 3, 27, 38, 43 ]    [ 9, 10, 82 ]
 *                                   \  /
 *                      [ 3, 9, 10, 27, 38, 43, 82 ]
 *
 * Time Complexity:  O(N log N) Guaranteed in all cases
 * Space Complexity: O(N) Auxiliary memory for merge array
 * </pre>
 */
public class Step05_MergeSort {

    public static void mergeSort(int[] arr) {
        if (arr == null || arr.length <= 1) {
            return;
        }
        int[] temp = new int[arr.length];
        System.out.println("[ACTION] Starting Merge Sort on array of size N = " + arr.length);
        System.out.println("[MEMORY EVENT] Allocated Auxiliary Array of size " + temp.length);

        sort(arr, temp, 0, arr.length - 1, 1);
    }

    private static void sort(int[] arr, int[] temp, int left, int right, int depth) {
        if (left >= right) {
            return;
        }

        int mid = left + (right - left) / 2;
        String indent = "  ".repeat(depth);

        System.out.println(indent + "[ACTION] Depth " + depth + ": Splitting Range [" + left + " .. " + right
                + "] -> Left [" + left + " .. " + mid + "], Right [" + (mid + 1) + " .. " + right + "]");

        sort(arr, temp, left, mid, depth + 1);
        sort(arr, temp, mid + 1, right, depth + 1);

        merge(arr, temp, left, mid, right, depth);
    }

    private static void merge(int[] arr, int[] temp, int left, int mid, int right, int depth) {
        String indent = "  ".repeat(depth);

        // Copy elements to temp array
        for (int i = left; i <= right; i++) {
            temp[i] = arr[i];
        }

        int i = left;      // Pointer for left sorted sub-array
        int j = mid + 1;   // Pointer for right sorted sub-array
        int k = left;      // Pointer for target merged array

        System.out.println(indent + "[MEMORY EVENT] Merging Left Subarray [" + left + ".." + mid + "] and Right Subarray [" + (mid + 1) + ".." + right + "]");

        while (i <= mid && j <= right) {
            if (temp[i] <= temp[j]) {
                arr[k++] = temp[i++];
            } else {
                arr[k++] = temp[j++];
            }
        }

        while (i <= mid) {
            arr[k++] = temp[i++];
        }
        // Right remainder is already in position

        System.out.println(indent + "[STATE] Merged Result [" + left + " .. " + right + "]: "
                + Arrays.toString(Arrays.copyOfRange(arr, left, right + 1)));
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 09 - Sorting & Searching | Step 05: Merge Sort");
        System.out.println("======================================================================\n");

        int[] arr = {38, 27, 43, 3, 9, 82, 10};
        System.out.println("[INIT] Original Unsorted Array: " + Arrays.toString(arr));

        mergeSort(arr);

        System.out.println("\n======================================================================");
        System.out.println("RESULT: Sorted Array: " + Arrays.toString(arr));
        System.out.println("======================================================================");
    }
}

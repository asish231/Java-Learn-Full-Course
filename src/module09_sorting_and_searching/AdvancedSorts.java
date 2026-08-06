package module09_sorting_and_searching;

import java.util.Arrays;

/**
 * Advanced Divide-and-Conquer Sorting Algorithms:
 * 1. Merge Sort - O(N log N) Stable, O(N) auxiliary space.
 * 2. Quick Sort - O(N log N) average, O(1) auxiliary space.
 */
public class AdvancedSorts {

    // --- MERGE SORT ---
    public static void mergeSort(int[] arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }

    private static void merge(int[] arr, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;

        int[] L = new int[n1];
        int[] R = new int[n2];

        System.arraycopy(arr, left, L, 0, n1);
        System.arraycopy(arr, mid + 1, R, 0, n2);

        int i = 0, j = 0, k = left;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k++] = L[i++];
            } else {
                arr[k++] = R[j++];
            }
        }
        while (i < n1) arr[k++] = L[i++];
        while (j < n2) arr[k++] = R[j++];
    }

    // --- QUICK SORT ---
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pivotIndex = partition(arr, low, high);
            quickSort(arr, low, pivotIndex - 1);
            quickSort(arr, pivotIndex + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high]; // Lomuto partition scheme
        int i = low - 1;

        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                swap(arr, i, j);
            }
        }
        swap(arr, i + 1, high);
        return i + 1;
    }

    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" ⚡ ADVANCED SORTING ALGORITHMS DEMONSTRATION");
        System.out.println("==================================================\n");

        int[] mergeArr = {38, 27, 43, 3, 9, 82, 10};
        System.out.println("1. Original Array: " + Arrays.toString(mergeArr));
        mergeSort(mergeArr, 0, mergeArr.length - 1);
        System.out.println("   Merge Sorted:   " + Arrays.toString(mergeArr));

        int[] quickArr = {10, 7, 8, 9, 1, 5};
        System.out.println("\n2. Original Array: " + Arrays.toString(quickArr));
        quickSort(quickArr, 0, quickArr.length - 1);
        System.out.println("   Quick Sorted:   " + Arrays.toString(quickArr));

        System.out.println("\n✅ Advanced Sorts test passed!");
    }
}

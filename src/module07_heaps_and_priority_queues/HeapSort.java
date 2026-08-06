package module07_heaps_and_priority_queues;

import java.util.Arrays;

/**
 * In-place HeapSort algorithm implementation.
 * Time Complexity: O(N log N) in all cases (Worst, Avg, Best).
 * Auxiliary Space Complexity: O(1)
 */
public class HeapSort {

    public static void sort(int[] arr) {
        int n = arr.length;

        // 1. Build Max Heap in-place - O(N)
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }

        // 2. Extract elements one by one from heap - O(N log N)
        for (int i = n - 1; i > 0; i--) {
            // Move current root (max element) to end
            int temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;

            // Heapify reduced heap
            heapify(arr, i, 0);
        }
    }

    private static void heapify(int[] arr, int n, int i) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;

        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        if (largest != i) {
            int swap = arr[i];
            arr[i] = arr[largest];
            arr[largest] = swap;

            // Recursively heapify affected sub-tree
            heapify(arr, n, largest);
        }
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 📊 HEAPSORT ALGORITHM DEMONSTRATION");
        System.out.println("==================================================\n");

        int[] data = {12, 11, 13, 5, 6, 7};
        System.out.println("Original array: " + Arrays.toString(data));

        sort(data);
        System.out.println("Sorted array:   " + Arrays.toString(data));

        System.out.println("\n✅ HeapSort algorithm executed successfully!");
    }
}

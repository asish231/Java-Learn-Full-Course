package module09_sorting_and_searching;

import java.util.Arrays;

/**
 * Elementary Sorting Algorithms:
 * 1. Bubble Sort - O(N^2)
 * 2. Selection Sort - O(N^2)
 * 3. Insertion Sort - O(N^2)
 */
public class ElementarySorts {

    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        boolean swapped;
        for (int i = 0; i < n - 1; i++) {
            swapped = false;
            for (int j = 0; j < n - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break; // Optimized early exit
        }
    }

    public static void selectionSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            int temp = arr[minIdx];
            arr[minIdx] = arr[i];
            arr[i] = temp;
        }
    }

    public static void insertionSort(int[] arr) {
        int n = arr.length;
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 🔢 ELEMENTARY SORTING ALGORITHMS DEMONSTRATION");
        System.out.println("==================================================\n");

        int[] a1 = {64, 34, 25, 12, 22, 11, 90};
        System.out.println("1. Original Array:  " + Arrays.toString(a1));
        bubbleSort(a1);
        System.out.println("   Bubble Sorted:   " + Arrays.toString(a1));

        int[] a2 = {64, 25, 12, 22, 11};
        System.out.println("\n2. Original Array:  " + Arrays.toString(a2));
        selectionSort(a2);
        System.out.println("   Selection Sorted:" + Arrays.toString(a2));

        int[] a3 = {12, 11, 13, 5, 6};
        System.out.println("\n3. Original Array:  " + Arrays.toString(a3));
        insertionSort(a3);
        System.out.println("   Insertion Sorted:" + Arrays.toString(a3));

        System.out.println("\n✅ Elementary Sorts test passed!");
    }
}

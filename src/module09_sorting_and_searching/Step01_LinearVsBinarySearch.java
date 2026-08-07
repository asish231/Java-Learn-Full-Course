package module09_sorting_and_searching;

import java.util.Arrays;

/**
 * Step 01: Linear Search O(N) vs Binary Search O(log N) Comparison
 *
 * <pre>
 * BINARY SEARCH HALVING SEARCH SPACE:
 *
 * Sorted Array (N=8): [10, 20, 30, 40, 50, 60, 70, 80], Target = 70
 *
 * Step 1: L=0, R=7, Mid=(0+7)/2=3 -> val[3]=40 < 70 -> L = Mid + 1 = 4
 *         [ . ,  . ,  . ,  . | 50, 60, 70, 80 ]
 *                            ^L       ^Mid ^R
 *
 * Step 2: L=4, R=7, Mid=(4+7)/2=5 -> val[5]=60 < 70 -> L = Mid + 1 = 6
 *         [ . ,  . ,  . ,  . ,  . ,  . | 70, 80 ]
 *                                       ^L,Mid ^R
 *
 * Step 3: L=6, R=7, Mid=(6+7)/2=6 -> val[6]=70 == Target -> FOUND at Index 6!
 *
 * Comparisons:
 *   - Linear Search: 7 steps (O(N))
 *   - Binary Search: 3 steps (O(log N))
 * </pre>
 */
public class Step01_LinearVsBinarySearch {

    static class SearchResult {
        final int index;
        final int steps;

        SearchResult(int index, int steps) {
            this.index = index;
            this.steps = steps;
        }
    }

    public static SearchResult linearSearch(int[] arr, int target) {
        int steps = 0;
        for (int i = 0; i < arr.length; i++) {
            steps++;
            if (arr[i] == target) {
                return new SearchResult(i, steps);
            }
        }
        return new SearchResult(-1, steps);
    }

    public static SearchResult binarySearch(int[] arr, int target) {
        int steps = 0;
        int left = 0;
        int right = arr.length - 1;

        while (left <= right) {
            steps++;
            int mid = left + (right - left) / 2;
            int midVal = arr[mid];

            System.out.println("  [MEMORY EVENT] Step " + steps + ": Range [" + left + " .. " + right
                    + "] -> Mid Index = " + mid + " (Value = " + midVal + ")");

            if (midVal == target) {
                System.out.println("  [STATE] Target " + target + " matched at Mid Index " + mid);
                return new SearchResult(mid, steps);
            } else if (midVal < target) {
                System.out.println("  [ACTION] Mid Value " + midVal + " < Target " + target + " -> Move Left to " + (mid + 1));
                left = mid + 1;
            } else {
                System.out.println("  [ACTION] Mid Value " + midVal + " > Target " + target + " -> Move Right to " + (mid - 1));
                right = mid - 1;
            }
        }
        return new SearchResult(-1, steps);
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 09 - Sorting & Searching | Step 01: Linear vs Binary Search");
        System.out.println("======================================================================\n");

        int[] sortedArr = {10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160};
        int target = 130;

        System.out.println("[INIT] Sorted Array (N = " + sortedArr.length + "): " + Arrays.toString(sortedArr));
        System.out.println("[INIT] Target Search Element: " + target);

        System.out.println("\n--- 1. Running Linear Search O(N) ---");
        SearchResult linResult = linearSearch(sortedArr, target);
        System.out.println("[STATE] Linear Search Result: Index = " + linResult.index + " | Steps Taken = " + linResult.steps);

        System.out.println("\n--- 2. Running Binary Search O(log N) ---");
        SearchResult binResult = binarySearch(sortedArr, target);
        System.out.println("[STATE] Binary Search Result: Index = " + binResult.index + " | Steps Taken = " + binResult.steps);

        System.out.println("\n======================================================================");
        System.out.println("COMPARISON SUMMARY:");
        System.out.println("  - Linear Search Steps : " + linResult.steps);
        System.out.println("  - Binary Search Steps : " + binResult.steps + " (Speedup factor: " + (linResult.steps / binResult.steps) + "x)");
        System.out.println("======================================================================");
    }
}

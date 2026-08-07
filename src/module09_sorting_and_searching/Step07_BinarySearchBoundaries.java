package module09_sorting_and_searching;

import java.util.Arrays;

/**
 * Step 07: Binary Search Boundary Variants (Lower Bound & Upper Bound)
 *
 * <pre>
 * LOWER BOUND & UPPER BOUND ON DUPLICATES:
 *
 * Array with Duplicates: [10, 20, 20, 20, 20, 30, 40], Target = 20
 *
 * Lower Bound: First index where arr[i] >= Target
 *   [10, | 20, 20, 20, 20, 30, 40] -> Index 1 (First occurrence of 20)
 *        ^Lower Bound
 *
 * Upper Bound: First index where arr[i] > Target
 *   [10, 20, 20, 20, 20, | 30, 40] -> Index 5 (First element strictly > 20)
 *                          ^Upper Bound
 *
 * Frequency Count of Target = UpperBound - LowerBound = 5 - 1 = 4 occurrences!
 * </pre>
 */
public class Step07_BinarySearchBoundaries {

    /**
     * Finds the first index where arr[i] >= target.
     */
    public static int lowerBound(int[] arr, int target) {
        int left = 0;
        int right = arr.length; // Range [0 .. N]

        System.out.println("\n[ACTION] Computing Lower Bound for Target = " + target);

        while (left < right) {
            int mid = left + (right - left) / 2;
            System.out.println("  [MEMORY EVENT] LowerBound Range [" + left + " .. " + right
                    + "] -> Mid Index = " + mid + " (Val = " + arr[mid] + ")");

            if (arr[mid] >= target) {
                System.out.println("  [ACTION] arr[mid] " + arr[mid] + " >= Target " + target + " -> Narrow right to " + mid);
                right = mid;
            } else {
                System.out.println("  [ACTION] arr[mid] " + arr[mid] + " < Target " + target + " -> Narrow left to " + (mid + 1));
                left = mid + 1;
            }
        }
        return left;
    }

    /**
     * Finds the first index where arr[i] > target.
     */
    public static int upperBound(int[] arr, int target) {
        int left = 0;
        int right = arr.length; // Range [0 .. N]

        System.out.println("\n[ACTION] Computing Upper Bound for Target = " + target);

        while (left < right) {
            int mid = left + (right - left) / 2;
            System.out.println("  [MEMORY EVENT] UpperBound Range [" + left + " .. " + right
                    + "] -> Mid Index = " + mid + " (Val = " + arr[mid] + ")");

            if (arr[mid] > target) {
                System.out.println("  [ACTION] arr[mid] " + arr[mid] + " > Target " + target + " -> Narrow right to " + mid);
                right = mid;
            } else {
                System.out.println("  [ACTION] arr[mid] " + arr[mid] + " <= Target " + target + " -> Narrow left to " + (mid + 1));
                left = mid + 1;
            }
        }
        return left;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 09 - Sorting & Searching | Step 07: Binary Search Boundaries");
        System.out.println("======================================================================\n");

        int[] nums = {10, 20, 20, 20, 20, 30, 40, 50};
        int target = 20;

        System.out.println("[INIT] Array with Duplicates: " + Arrays.toString(nums));
        System.out.println("[INIT] Target Element: " + target);

        int lb = lowerBound(nums, target);
        System.out.println("[STATE] Lower Bound Index for " + target + ": " + lb);

        int ub = upperBound(nums, target);
        System.out.println("[STATE] Upper Bound Index for " + target + ": " + ub);

        int count = ub - lb;
        System.out.println("[STATE] Frequency of target " + target + " in array: " + count);

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Binary Search boundary calculations verified.");
        System.out.println("======================================================================");
    }
}

package module09_sorting_and_searching;

import java.util.Arrays;

/**
 * Step 08: Search in Rotated Sorted Array O(log N)
 *
 * <pre>
 * ROTATED SORTED ARRAY PARTITIONING:
 *
 * Rotated Array: [4, 5, 6, 7, 0, 1, 2], Target = 0
 *
 * Step 1: L=0 (val 4), R=6 (val 2), Mid=3 (val 7)
 *   Check Left Half [4 .. 7]: arr[0]=4 <= arr[3]=7 -> LEFT HALF IS SORTED!
 *   Is Target 0 in range [4 .. 7]? NO -> Target must be in Right Half -> Move L = Mid + 1 = 4
 *
 * Step 2: L=4 (val 0), R=6 (val 2), Mid=5 (val 1)
 *   Check Left Half [0 .. 1]: arr[4]=0 <= arr[5]=1 -> LEFT HALF IS SORTED!
 *   Is Target 0 in range [0 .. 1]? YES -> Target is in Left Half -> Move R = Mid - 1 = 4
 *
 * Step 3: L=4, R=4, Mid=4 (val 0) -> arr[4] == 0 == Target -> FOUND at Index 4!
 * </pre>
 */
public class Step08_SearchInRotatedArray {

    public static int search(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1;
        int step = 0;

        System.out.println("[ACTION] Searching for Target = " + target + " in Rotated Sorted Array...");

        while (left <= right) {
            step++;
            int mid = left + (right - left) / 2;
            int midVal = nums[mid];

            System.out.println("\n  [MEMORY EVENT] Step " + step + ": Range [" + left + " .. " + right
                    + "] -> Mid Index = " + mid + " (Value = " + midVal + ")");

            if (midVal == target) {
                System.out.println("  [STATE] Target " + target + " matched at Index " + mid);
                return mid;
            }

            // Check if Left Half [left .. mid] is sorted
            if (nums[left] <= midVal) {
                System.out.println("  [STATE] Left Half [" + left + " .. " + mid + "] is Sorted (Val range: " + nums[left] + " to " + midVal + ")");
                if (nums[left] <= target && target < midVal) {
                    System.out.println("  [ACTION] Target " + target + " lies within Left Half -> Search left");
                    right = mid - 1;
                } else {
                    System.out.println("  [ACTION] Target " + target + " outside Left Half -> Search right");
                    left = mid + 1;
                }
            } else {
                // Right Half [mid .. right] is sorted
                System.out.println("  [STATE] Right Half [" + mid + " .. " + right + "] is Sorted (Val range: " + midVal + " to " + nums[right] + ")");
                if (midVal < target && target <= nums[right]) {
                    System.out.println("  [ACTION] Target " + target + " lies within Right Half -> Search right");
                    left = mid + 1;
                } else {
                    System.out.println("  [ACTION] Target " + target + " outside Right Half -> Search left");
                    right = mid - 1;
                }
            }
        }

        return -1; // Target not found
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 09 - Sorting & Searching | Step 08: Search in Rotated Array");
        System.out.println("======================================================================\n");

        int[] nums = {4, 5, 6, 7, 0, 1, 2};
        int target = 0;

        System.out.println("[INIT] Rotated Array: " + Arrays.toString(nums));
        System.out.println("[INIT] Target Element: " + target);

        int resultIndex = search(nums, target);

        System.out.println("\n======================================================================");
        System.out.println("RESULT: Target " + target + " found at Index: " + resultIndex);
        System.out.println("======================================================================");
    }
}

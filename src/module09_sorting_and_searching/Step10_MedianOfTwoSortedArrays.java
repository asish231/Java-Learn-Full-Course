package module09_sorting_and_searching;

import java.util.Arrays;

/**
 * Step 10: Median of Two Sorted Arrays (Dual Partition Binary Search O(log(min(N,M))))
 *
 * <pre>
 * DUAL ARRAY PARTITION BOUNDARY VISUALIZATION:
 *
 * nums1 (size N=4): [ 1,  3 | 8,  9 ] -> partitionX = 2 (maxLeftX=3, minRightX=8)
 * nums2 (size M=6): [ 7, 11, 18, 19, 21, 25 ] -> partitionY = 3 (maxLeftY=18, minRightY=19)
 *
 * Left Partition Combine: {1, 3} + {7, 11, 18} = {1, 3, 7, 11, 18} (Size 5)
 * Right Partition Combine: {8, 9} + {19, 21, 25} = {8, 9, 19, 21, 25} (Size 5)
 *
 * Valid Partition Condition:
 *   maxLeftX (3) <= minRightY (19) AND maxLeftY (18) <= minRightX (8)
 *   In this example 18 > 8 -> partitionX is too large -> Move binary search left!
 * </pre>
 */
public class Step10_MedianOfTwoSortedArrays {

    public static double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Ensure nums1 is the smaller array to optimize binary search to O(log(min(N, M)))
        if (nums1.length > nums2.length) {
            System.out.println("[ACTION] Swapping array references so binary search runs on smaller array.");
            return findMedianSortedArrays(nums2, nums1);
        }

        int n = nums1.length;
        int m = nums2.length;
        int low = 0;
        int high = n;
        int step = 0;

        System.out.println("[INIT] Array 1 (Size N = " + n + "): " + Arrays.toString(nums1));
        System.out.println("[INIT] Array 2 (Size M = " + m + "): " + Arrays.toString(nums2));
        System.out.println("[INIT] Total Elements: " + (n + m) + " (" + ((n + m) % 2 == 0 ? "Even" : "Odd") + ")");

        while (low <= high) {
            step++;
            int partitionX = low + (high - low) / 2;
            int partitionY = (n + m + 1) / 2 - partitionX;

            int maxLeftX = (partitionX == 0) ? Integer.MIN_VALUE : nums1[partitionX - 1];
            int minRightX = (partitionX == n) ? Integer.MAX_VALUE : nums1[partitionX];

            int maxLeftY = (partitionY == 0) ? Integer.MIN_VALUE : nums2[partitionY - 1];
            int minRightY = (partitionY == m) ? Integer.MAX_VALUE : nums2[partitionY];

            System.out.println("\n  [MEMORY EVENT] Step " + step + ": Partition Cut X = " + partitionX + ", Y = " + partitionY);
            System.out.println("  [STATE] Left Max: X=" + (maxLeftX == Integer.MIN_VALUE ? "-INF" : maxLeftX)
                    + ", Y=" + (maxLeftY == Integer.MIN_VALUE ? "-INF" : maxLeftY));
            System.out.println("  [STATE] Right Min: X=" + (minRightX == Integer.MAX_VALUE ? "+INF" : minRightX)
                    + ", Y=" + (minRightY == Integer.MAX_VALUE ? "+INF" : minRightY));

            if (maxLeftX <= minRightY && maxLeftY <= minRightX) {
                System.out.println("  [STATE] Valid Dual Partition Found!");
                if ((n + m) % 2 == 1) {
                    double median = Math.max(maxLeftX, maxLeftY);
                    System.out.println("  [ACTION] Odd Total Elements -> Median = Max(maxLeftX, maxLeftY) = " + median);
                    return median;
                } else {
                    double median = (Math.max(maxLeftX, maxLeftY) + Math.min(minRightX, minRightY)) / 2.0;
                    System.out.println("  [ACTION] Even Total Elements -> Median = Avg(MaxLeft, MinRight) = " + median);
                    return median;
                }
            } else if (maxLeftX > minRightY) {
                System.out.println("  [ACTION] maxLeftX > minRightY -> Cut X too far right. Search left (high = " + (partitionX - 1) + ")");
                high = partitionX - 1;
            } else {
                System.out.println("  [ACTION] maxLeftY > minRightX -> Cut X too far left. Search right (low = " + (partitionX + 1) + ")");
                low = partitionX + 1;
            }
        }

        throw new IllegalArgumentException("Input arrays are not sorted.");
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 09 - Sorting & Searching | Step 10: Median of Two Sorted Arrays");
        System.out.println("======================================================================\n");

        int[] nums1 = {1, 3, 8, 9, 15};
        int[] nums2 = {7, 11, 18, 19, 21, 25};

        double median = findMedianSortedArrays(nums1, nums2);

        System.out.println("\n======================================================================");
        System.out.println("RESULT: Combined Median of Both Sorted Arrays: " + median);
        System.out.println("======================================================================");
    }
}

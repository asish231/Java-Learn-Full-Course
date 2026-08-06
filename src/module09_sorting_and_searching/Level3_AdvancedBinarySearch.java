package module09_sorting_and_searching;

import java.util.Arrays;

/**
 * LEVEL 3 (ADVANCED / FAANG): Median of Two Sorted Arrays (LeetCode 4 - Hard)
 * Binary Search on Partition Size - O(log(min(M, N))) Time, O(1) Space.
 */
public class Level3_AdvancedBinarySearch {

    public static double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) {
            return findMedianSortedArrays(nums2, nums1); // Ensure nums1 is smaller array
        }

        int m = nums1.length, n = nums2.length;
        int left = 0, right = m;

        while (left <= right) {
            int partition1 = left + (right - left) / 2;
            int partition2 = (m + n + 1) / 2 - partition1;

            int maxLeft1 = (partition1 == 0) ? Integer.MIN_VALUE : nums1[partition1 - 1];
            int minRight1 = (partition1 == m) ? Integer.MAX_VALUE : nums1[partition1];

            int maxLeft2 = (partition2 == 0) ? Integer.MIN_VALUE : nums2[partition2 - 1];
            int minRight2 = (partition2 == n) ? Integer.MAX_VALUE : nums2[partition2];

            if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
                if ((m + n) % 2 == 0) {
                    return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2.0;
                } else {
                    return Math.max(maxLeft1, maxLeft2);
                }
            } else if (maxLeft1 > minRight2) {
                right = partition1 - 1;
            } else {
                left = partition1 + 1;
            }
        }
        throw new IllegalArgumentException("Input arrays are not sorted");
    }

    public static void main(String[] args) {
        System.out.println("--- Module 09: Level 3 (Advanced Median of Two Sorted Arrays Hard) ---");
        int[] n1 = {1, 3}, n2 = {2};
        System.out.println("Median of " + Arrays.toString(n1) + " and " + Arrays.toString(n2) + ": " + findMedianSortedArrays(n1, n2)); // 2.0
    }
}

package module09_sorting_and_searching;

import java.util.Arrays;

/**
 * LEVEL 2 (INTERMEDIATE): Search in Rotated Sorted Array (LeetCode 33 - Medium) - O(log N) Time
 */
public class Level2_IntermediateSortSearch {

    public static int searchRotated(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;

            // Check if left half is sorted
            if (nums[left] <= nums[mid]) {
                if (nums[left] <= target && target < nums[mid]) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            } else { // Right half is sorted
                if (nums[mid] < target && target <= nums[right]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        System.out.println("--- Module 09: Level 2 (Intermediate Search in Rotated Array) ---");
        int[] rotated = {4, 5, 6, 7, 0, 1, 2};
        int target = 0;
        System.out.println("Search target " + target + " in " + Arrays.toString(rotated) + ": Index = " + searchRotated(rotated, target)); // 4
    }
}

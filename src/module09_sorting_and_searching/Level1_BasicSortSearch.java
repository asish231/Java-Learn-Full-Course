package module09_sorting_and_searching;

/**
 * LEVEL 1 (BASIC): Standard Binary Search (LeetCode 704) - O(log N) Time
 */
public class Level1_BasicSortSearch {

    public static int binarySearch(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        System.out.println("--- Module 09: Level 1 (Basic Binary Search) ---");
        int[] sorted = {-1, 0, 3, 5, 9, 12};
        int target = 9;
        System.out.println("Target 9 found at index: " + binarySearch(sorted, target)); // 4
    }
}

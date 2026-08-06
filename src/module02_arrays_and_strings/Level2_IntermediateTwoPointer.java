package module02_arrays_and_strings;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * LEVEL 2 (INTERMEDIATE): Core Two-Pointer Patterns (Medium LeetCode)
 * 1. 3Sum Problem (LeetCode 15) - O(N^2) Time, O(1) Extra Space
 * 2. Container With Most Water (LeetCode 11) - O(N) Time
 */
public class Level2_IntermediateTwoPointer {

    // 1. 3Sum: Find all unique triplets [a, b, c] such that a + b + c = 0
    public static List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums); // O(N log N)
        List<List<Integer>> res = new ArrayList<>();

        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue; // Skip duplicates for i

            int left = i + 1, right = nums.length - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum == 0) {
                    res.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++; // Skip duplicate left
                    while (left < right && nums[right] == nums[right - 1]) right--; // Skip duplicate right
                    left++;
                    right--;
                } else if (sum < 0) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        return res;
    }

    // 2. Container With Most Water
    public static int maxArea(int[] height) {
        int maxW = 0, left = 0, right = height.length - 1;
        while (left < right) {
            int h = Math.min(height[left], height[right]);
            maxW = Math.max(maxW, h * (right - left));
            if (height[left] < height[right]) left++;
            else right--;
        }
        return maxW;
    }

    public static void main(String[] args) {
        System.out.println("--- Module 02: Level 2 (Intermediate Two-Pointer) ---");
        int[] nums = {-1, 0, 1, 2, -1, -4};
        System.out.println("3Sum Triplets for " + Arrays.toString(nums) + ": " + threeSum(nums));

        int[] heights = {1, 8, 6, 2, 5, 4, 8, 3, 7};
        System.out.println("Container With Most Water: " + maxArea(heights));
    }
}

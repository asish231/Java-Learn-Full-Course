package module02_arrays_and_strings;

import java.util.Arrays;

/**
 * LEVEL 1 (BASIC): Essential Array Manipulations (Easy LeetCode)
 * 1. Reverse Array in place
 * 2. Find Maximum & Minimum elements
 * 3. Remove Element in place
 */
public class Level1_BasicArrayOps {

    // 1. Reverse Array - O(N) Time, O(1) Space
    public static void reverse(int[] nums) {
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int temp = nums[left];
            nums[left] = nums[right];
            nums[right] = temp;
            left++;
            right--;
        }
    }

    // 2. Find Max & Min - O(N) Single Pass
    public static int[] findMinMax(int[] nums) {
        int min = nums[0], max = nums[0];
        for (int num : nums) {
            if (num < min) min = num;
            if (num > max) max = num;
        }
        return new int[]{min, max};
    }

    // 3. Remove Element (LeetCode 27) - O(N) Time, O(1) Space
    public static int removeElement(int[] nums, int val) {
        int k = 0;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != val) {
                nums[k++] = nums[i];
            }
        }
        return k;
    }

    public static void main(String[] args) {
        System.out.println("--- Module 02: Level 1 (Basic Array Operations) ---");
        int[] arr = {1, 2, 3, 4, 5};
        reverse(arr);
        System.out.println("Reversed: " + Arrays.toString(arr));

        int[] minMax = findMinMax(arr);
        System.out.println("Min = " + minMax[0] + ", Max = " + minMax[1]);

        int[] nums = {3, 2, 2, 3};
        int len = removeElement(nums, 3);
        System.out.println("Array after removing '3': " + Arrays.toString(Arrays.copyOf(nums, len)));
    }
}

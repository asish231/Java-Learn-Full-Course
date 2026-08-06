package module02_arrays_and_strings;

import java.util.Arrays;

/**
 * Common Two Pointers algorithms:
 * 1. Two Sum in a Sorted Array - O(N)
 * 2. Reverse Array in Place - O(N)
 * 3. Container With Most Water - O(N)
 */
public class TwoPointerTechniques {

    /**
     * Finds indices (1-indexed) of two numbers in a sorted array that sum to target.
     * Strategy: Left & Right pointers moving toward each other.
     */
    public static int[] twoSumSorted(int[] numbers, int target) {
        int left = 0;
        int right = numbers.length - 1;

        while (left < right) {
            int currentSum = numbers[left] + numbers[right];
            if (currentSum == target) {
                return new int[]{left + 1, right + 1};
            } else if (currentSum < target) {
                left++;
            } else {
                right--;
            }
        }
        return new int[]{-1, -1};
    }

    /**
     * Calculates the max area of water a container can store.
     * Height array represents vertical lines. Area = width * min(height[l], height[r])
     */
    public static int maxArea(int[] height) {
        int maxWater = 0;
        int left = 0;
        int right = height.length - 1;

        while (left < right) {
            int h = Math.min(height[left], height[right]);
            int w = right - left;
            maxWater = Math.max(maxWater, h * w);

            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxWater;
    }

    /**
     * Reverses an array in place using two pointers.
     */
    public static void reverseArray(int[] arr) {
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" ✌️ TWO POINTER TECHNIQUES DEMONSTRATION");
        System.out.println("==================================================\n");

        int[] sortedNumbers = {2, 7, 11, 15, 18, 22};
        int target = 26;
        int[] result = twoSumSorted(sortedNumbers, target);
        System.out.printf("1. Two Sum Sorted for target %d in %s: Found at 1-based indices %s%n",
                target, Arrays.toString(sortedNumbers), Arrays.toString(result));

        int[] heights = {1, 8, 6, 2, 5, 4, 8, 3, 7};
        int maxWater = maxArea(heights);
        System.out.printf("2. Container With Most Water for %s: Max Area = %d%n", Arrays.toString(heights), maxWater);

        int[] toReverse = {1, 2, 3, 4, 5};
        System.out.print("3. Reversing array " + Arrays.toString(toReverse) + " -> ");
        reverseArray(toReverse);
        System.out.println(Arrays.toString(toReverse));

        System.out.println("\n✅ Two Pointers techniques executed successfully!");
    }
}

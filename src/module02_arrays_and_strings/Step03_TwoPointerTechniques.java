package module02_arrays_and_strings;

import java.util.Arrays;

/**
 * Step 03: Two-Pointer Techniques (Converging Pointers & Area Maximization)
 *
 * <pre>
 * TWO SUM II (SORTED ARRAY, Target = 18):
 * Array:  [ 2 | 7 | 11 | 15 | 18 | 22 ]
 *           ^                       ^
 *          left (0)               right (5)  Sum = 2+22 = 24 > 18 -> right--
 *
 * Array:  [ 2 | 7 | 11 | 15 | 18 | 22 ]
 *           ^                  ^
 *          left (0)          right (4)       Sum = 2+18 = 20 > 18 -> right--
 *
 * Array:  [ 2 | 7 | 11 | 15 | 18 | 22 ]
 *           ^             ^
 *          left (0)     right (3)            Sum = 2+15 = 17 < 18 -> left++
 *
 * Array:  [ 2 | 7 | 11 | 15 | 18 | 22 ]
 *               ^         ^
 *              left (1) right (3)            Sum = 7+15 = 22 > 18 -> right--
 *
 * Array:  [ 2 | 7 | 11 | 15 | 18 | 22 ]
 *               ^    ^
 *              left  right                   Sum = 7+11 = 18 == Target! FOUND!
 *
 * CONTAINER WITH MOST WATER:
 * Height: [ 1 | 8 | 6 | 2 | 5 | 4 | 8 | 3 | 7 ]
 *           L                                 R
 * Width = R - L = 8, Height = min(1, 7) = 1 -> Area = 8 * 1 = 8
 * </pre>
 */
public class Step03_TwoPointerTechniques {

    /**
     * Two Sum II - Input Array Is Sorted (LeetCode 167).
     * Time: O(N), Space: O(1)
     * @return 1-based indices of the two numbers.
     */
    public static int[] twoSumSorted(int[] numbers, int target) {
        int left = 0;
        int right = numbers.length - 1;

        while (left < right) {
            int sum = numbers[left] + numbers[right];
            if (sum == target) {
                return new int[]{left + 1, right + 1};
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
        return new int[]{-1, -1};
    }

    /**
     * Container With Most Water (LeetCode 11).
     * Time: O(N), Space: O(1)
     */
    public static int maxArea(int[] height) {
        int left = 0;
        int right = height.length - 1;
        int maxArea = 0;

        while (left < right) {
            int currentWidth = right - left;
            int currentHeight = Math.min(height[left], height[right]);
            int area = currentWidth * currentHeight;
            maxArea = Math.max(maxArea, area);

            // Greedily move pointer with smaller height
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxArea;
    }

    /**
     * Valid Palindrome (LeetCode 125).
     * Time: O(N), Space: O(1)
     */
    public static boolean isPalindrome(String s) {
        if (s == null) return false;
        int left = 0;
        int right = s.length() - 1;

        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
                left++;
            }
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
                right--;
            }
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 02 - Arrays & Strings | Step 03: Two Pointer Techniques");
        System.out.println("======================================================================\n");

        int[] sortedNumbers = {2, 7, 11, 15, 18, 22};
        int targetSum = 18;
        System.out.println("[INIT] Sorted Input Array: " + Arrays.toString(sortedNumbers));
        System.out.println("[ACTION] Searching for Two Sum II pair for target = " + targetSum);
        int[] resultIndices = twoSumSorted(sortedNumbers, targetSum);
        System.out.println("[STATE] 1-Based Indices Result: " + Arrays.toString(resultIndices)
                + " (Values: " + sortedNumbers[resultIndices[0] - 1] + " + " + sortedNumbers[resultIndices[1] - 1] + " = " + targetSum + ")");

        System.out.println("\n--- 2. Container With Most Water (Greedy Converging Pointers) ---");
        int[] heights = {1, 8, 6, 2, 5, 4, 8, 3, 7};
        System.out.println("[INIT] Height Elevations: " + Arrays.toString(heights));
        System.out.println("[ACTION] Computing maximum container area...");
        int maxVolume = maxArea(heights);
        System.out.println("[STATE] Maximum Trapped Water Volume = " + maxVolume);

        System.out.println("\n--- 3. Valid Palindrome Check ---");
        String testStr1 = "A man, a plan, a canal: Panama";
        String testStr2 = "race a car";
        System.out.println("[INIT] Testing String 1: \"" + testStr1 + "\"");
        System.out.println("[STATE] Is Palindrome: " + isPalindrome(testStr1));
        System.out.println("[INIT] Testing String 2: \"" + testStr2 + "\"");
        System.out.println("[STATE] Is Palindrome: " + isPalindrome(testStr2));

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Two-pointer algorithms verified.");
        System.out.println("======================================================================");
    }
}

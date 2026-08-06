package module04_stacks_and_queues;

import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

/**
 * LEVEL 3 (ADVANCED / FAANG): Hard Monotonic Stack Problems
 * 1. Largest Rectangle in Histogram (LeetCode 84 - Hard) - O(N) Time
 * 2. Trapping Rain Water (LeetCode 42 - Hard) - O(N) Time
 */
public class Level3_AdvancedHistogramRainWater {

    // 1. Largest Rectangle in Histogram using Monotonic Increasing Stack
    public static int largestRectangleArea(int[] heights) {
        int n = heights.length;
        Deque<Integer> stack = new ArrayDeque<>();
        int maxArea = 0;

        for (int i = 0; i <= n; i++) {
            int currentHeight = (i == n) ? 0 : heights[i];
            while (!stack.isEmpty() && currentHeight < heights[stack.peek()]) {
                int height = heights[stack.pop()];
                int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, height * width);
            }
            stack.push(i);
        }
        return maxArea;
    }

    // 2. Trapping Rain Water using Two Pointers - O(N) Time, O(1) Space
    public static int trapRainWater(int[] height) {
        int left = 0, right = height.length - 1;
        int maxLeft = 0, maxRight = 0, totalWater = 0;

        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= maxLeft) maxLeft = height[left];
                else totalWater += maxLeft - height[left];
                left++;
            } else {
                if (height[right] >= maxRight) maxRight = height[right];
                else totalWater += maxRight - height[right];
                right--;
            }
        }
        return totalWater;
    }

    public static void main(String[] args) {
        System.out.println("--- Module 04: Level 3 (Advanced Histogram & Trapping Rain Water Hard) ---");
        int[] histogram = {2, 1, 5, 6, 2, 3};
        System.out.println("Max Rectangle Area for " + Arrays.toString(histogram) + ": " + largestRectangleArea(histogram));

        int[] elevationMap = {0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1};
        System.out.println("Trapped Rain Water for " + Arrays.toString(elevationMap) + ": " + trapRainWater(elevationMap) + " units");
    }
}

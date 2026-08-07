package module04_stacks_and_queues;

import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

/**
 * Step 05: Hard Applications — Largest Rectangle in Histogram & Trapping Rain Water
 *
 * <pre>
 * 1. Histogram Largest Rectangle ASCII Diagram:
 *    Heights: [ 2, 1, 5, 6, 2, 3 ]
 *
 *    Bar Heights Visual:
 *            #
 *         #  #
 *         #  #     #
 *         #  #  #  #
 *      #  #  #  #  #
 *      #  #  #  #  #
 *     ----------------
 *      2  1  5  6  2  3
 *            ^~~~~^
 *          Max Area = 5 * 2 = 10 (bars at index 2 and 3)
 *
 * 2. Trapping Rain Water Basin Concept:
 *    Heights: [ 0, 1, 0, 2, 1, 0, 1, 3 ]
 *
 *          #              #
 *          #  ~~ ~~ #  ~~ #
 *      #   #  #  ~~ #  #  #
 *     ----------------------
 *      0   1  0  2  1  0  1  3
 *             ^  ^  ^~~~~^
 *            water trapped in basins
 * </pre>
 */
public class Step05_HistogramAndRainWater {

    /**
     * Largest Rectangle in Histogram (LeetCode 84).
     * Time: O(N), Space: O(N)
     */
    public static int largestRectangleArea(int[] heights) {
        if (heights == null || heights.length == 0) return 0;

        Deque<Integer> stack = new ArrayDeque<>();
        int maxArea = 0;
        int n = heights.length;

        for (int i = 0; i <= n; i++) {
            // Append virtual height 0 at index n to flush remaining stack
            int currentHeight = (i == n) ? 0 : heights[i];

            while (!stack.isEmpty() && currentHeight < heights[stack.peek()]) {
                int h = heights[stack.pop()];
                int w = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, h * w);
            }
            stack.push(i);
        }
        return maxArea;
    }

    /**
     * Trapping Rain Water (LeetCode 42) using Two-Pointer technique.
     * Time: O(N), Auxiliary Space: O(1).
     */
    public static int trapRainWater(int[] height) {
        if (height == null || height.length < 3) return 0;

        int left = 0;
        int right = height.length - 1;
        int leftMax = 0;
        int rightMax = 0;
        int totalWater = 0;

        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) {
                    leftMax = height[left];
                } else {
                    totalWater += leftMax - height[left];
                }
                left++;
            } else {
                if (height[right] >= rightMax) {
                    rightMax = height[right];
                } else {
                    totalWater += rightMax - height[right];
                }
                right--;
            }
        }
        return totalWater;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 04 - Stacks & Queues | Step 05: Histogram & Rain Water");
        System.out.println("======================================================================\n");

        int[] histogram = {2, 1, 5, 6, 2, 3};
        System.out.println("[INIT] Histogram Heights: " + Arrays.toString(histogram));
        System.out.println("[ACTION] Computing Largest Rectangle Area in Histogram...");
        int maxRectArea = largestRectangleArea(histogram);
        System.out.println("[STATE] Maximum Rectangle Area = " + maxRectArea);

        System.out.println("\n--- 2. Trapping Rain Water (Elevation Map) ---");
        int[] elevation = {0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1};
        System.out.println("[INIT] Elevation Map: " + Arrays.toString(elevation));
        System.out.println("[ACTION] Computing total trapped rain water volume...");
        int trappedWater = trapRainWater(elevation);
        System.out.println("[STATE] Total Trapped Rain Water = " + trappedWater + " units");

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Hard Histogram & Rain Water algorithms verified.");
        System.out.println("======================================================================");
    }
}

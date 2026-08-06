package module04_stacks_and_queues;

import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

/**
 * LEVEL 2 (INTERMEDIATE): Daily Temperatures (LeetCode 739 - Medium)
 * Finds how many days until a warmer temperature using Monotonic Decreasing Stack.
 */
public class Level2_IntermediateMonotonicStack {

    public static int[] dailyTemperatures(int[] temps) {
        int n = temps.length;
        int[] result = new int[n];
        Deque<Integer> stack = new ArrayDeque<>(); // Stack stores indices

        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && temps[i] > temps[stack.peek()]) {
                int prevIdx = stack.pop();
                result[prevIdx] = i - prevIdx; // Calculate day difference
            }
            stack.push(i);
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println("--- Module 04: Level 2 (Intermediate Monotonic Stack) ---");
        int[] temps = {73, 74, 75, 71, 69, 72, 76, 73};
        int[] daysToWait = dailyTemperatures(temps);
        System.out.println("Temps: " + Arrays.toString(temps));
        System.out.println("Days to wait for warmer temp: " + Arrays.toString(daysToWait));
    }
}

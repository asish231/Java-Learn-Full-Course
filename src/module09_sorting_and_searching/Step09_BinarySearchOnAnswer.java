package module09_sorting_and_searching;

import java.util.Arrays;

/**
 * Step 09: Binary Search on Answer (Capacity to Ship Packages in D Days)
 *
 * <pre>
 * BINARY SEARCH ON SOLUTION SPACE [MinCapacity .. MaxCapacity]:
 *
 * Package Weights: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], Days = 5
 *
 * Search Space:
 *   Low  = Max(weights) = 10 (Minimum capacity to carry single largest package)
 *   High = Sum(weights) = 55 (Maximum capacity to carry all packages in 1 day)
 *
 * Search Monotonicity:
 *   Capacity 10 -> Days needed = 8 (> 5) -> Too slow! Needs larger capacity.
 *   Capacity 55 -> Days needed = 1 (<= 5) -> Feasible! Try smaller capacity.
 *
 * Binary Search Halving:
 *   Mid = (10 + 55) / 2 = 32 -> Feasible -> High = 32
 *   ...
 *   Final Minimum Feasible Capacity = 15 (Ships in exactly 5 days: [1..5], [6..7], [8], [9], [10])
 * </pre>
 */
public class Step09_BinarySearchOnAnswer {

    /**
     * Helper feasibility check: Can all packages be shipped within 'maxDays' given 'capacity'?
     */
    public static boolean canShipWithCapacity(int[] weights, int capacity, int maxDays) {
        int daysUsed = 1;
        int currentDayWeight = 0;

        for (int w : weights) {
            if (currentDayWeight + w > capacity) {
                daysUsed++;
                currentDayWeight = w;
            } else {
                currentDayWeight += w;
            }
        }
        return daysUsed <= maxDays;
    }

    public static int shipWithinDays(int[] weights, int days) {
        int maxWeight = 0;
        int sumWeight = 0;

        for (int w : weights) {
            maxWeight = Math.max(maxWeight, w);
            sumWeight += w;
        }

        int low = maxWeight;
        int high = sumWeight;
        int resultCapacity = high;
        int step = 0;

        System.out.println("[INIT] Package Weights: " + Arrays.toString(weights));
        System.out.println("[INIT] Target Days Limit: " + days);
        System.out.println("[INIT] Search Space Range: Low = " + low + " (Max Weight), High = " + high + " (Sum Weight)");

        System.out.println("\n--- Binary Search for Minimum Feasible Capacity ---");

        while (low <= high) {
            step++;
            int midCapacity = low + (high - low) / 2;
            boolean feasible = canShipWithCapacity(weights, midCapacity, days);

            System.out.println("\n  [MEMORY EVENT] Step " + step + ": Search Range [" + low + " .. " + high
                    + "] -> Testing Mid Capacity = " + midCapacity);

            if (feasible) {
                resultCapacity = midCapacity;
                System.out.println("  [STATE] Capacity " + midCapacity + " IS FEASIBLE (Fits within " + days + " days). Narrowing high to " + (midCapacity - 1));
                high = midCapacity - 1;
            } else {
                System.out.println("  [STATE] Capacity " + midCapacity + " EXCEEDS day limit. Narrowing low to " + (midCapacity + 1));
                low = midCapacity + 1;
            }
        }

        return resultCapacity;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 09 - Sorting & Searching | Step 09: Binary Search on Answer");
        System.out.println("======================================================================\n");

        int[] weights = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        int days = 5;

        int minCapacity = shipWithinDays(weights, days);

        System.out.println("\n======================================================================");
        System.out.println("RESULT: Minimum Ship Capacity Required: " + minCapacity);
        System.out.println("======================================================================");
    }
}

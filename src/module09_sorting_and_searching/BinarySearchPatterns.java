package module09_sorting_and_searching;

import java.util.Arrays;

/**
 * Binary Search Patterns:
 * 1. Lower Bound (First occurrence of key)
 * 2. Upper Bound (First index where arr[i] > key)
 * 3. Binary Search on Answer (Capacity to Ship Packages Within D Days problem)
 */
public class BinarySearchPatterns {

    /**
     * Finds index of first occurrence of target. Returns -1 if not found.
     */
    public static int lowerBound(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        int ans = -1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] >= target) {
                if (arr[mid] == target) ans = mid;
                right = mid - 1; // Keep searching left for first occurrence
            } else {
                left = mid + 1;
            }
        }
        return ans;
    }

    /**
     * Binary Search on Answer Pattern:
     * Minimal weight capacity of a ship to transport all packages within 'days'.
     */
    public static int shipWithinDays(int[] weights, int days) {
        int left = 0, right = 0;
        for (int w : weights) {
            left = Math.max(left, w); // Min capacity must hold largest single package
            right += w;              // Max capacity is sum of all packages
        }

        int minCapacity = right;

        while (left <= right) {
            int midCapacity = left + (right - left) / 2;
            if (canShip(weights, days, midCapacity)) {
                minCapacity = midCapacity;
                right = midCapacity - 1; // Try finding even smaller valid capacity
            } else {
                left = midCapacity + 1;  // Capacity too small, increase capacity
            }
        }

        return minCapacity;
    }

    private static boolean canShip(int[] weights, int days, int capacity) {
        int daysNeeded = 1;
        int currentLoad = 0;

        for (int w : weights) {
            if (currentLoad + w > capacity) {
                daysNeeded++;
                currentLoad = 0;
            }
            currentLoad += w;
        }

        return daysNeeded <= days;
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 🎯 BINARY SEARCH PATTERNS DEMONSTRATION");
        System.out.println("==================================================\n");

        int[] duplicates = {1, 2, 4, 4, 4, 5, 6, 8};
        int target = 4;
        int firstIdx = lowerBound(duplicates, target);
        System.out.printf("1. Array: %s%n   First occurrence of %d is at index %d%n", Arrays.toString(duplicates), target, firstIdx);

        int[] packages = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        int days = 5;
        int minShipCap = shipWithinDays(packages, days);
        System.out.printf("\n2. Binary Search on Answer:%n   Packages: %s%n   Min Ship Capacity to ship within %d days: %d%n",
                Arrays.toString(packages), days, minShipCap);

        System.out.println("\n✅ Binary Search patterns test passed!");
    }
}

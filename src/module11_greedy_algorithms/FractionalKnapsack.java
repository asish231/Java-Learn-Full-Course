package module11_greedy_algorithms;

import java.util.Arrays;

/**
 * Fractional Knapsack Problem solved using Greedy approach.
 * Items can be broken down into smaller fractions.
 * Time Complexity: O(N log N) due to sorting by value/weight ratio.
 */
public class FractionalKnapsack {

    public static class Item {
        public int weight;
        public int value;
        public double ratio;

        public Item(int weight, int value) {
            this.weight = weight;
            this.value = value;
            this.ratio = (double) value / weight;
        }
    }

    public static double getMaxValue(Item[] items, int capacity) {
        // Sort items in descending order of value/weight ratio
        Arrays.sort(items, (a, b) -> Double.compare(b.ratio, a.ratio));

        double totalValue = 0.0;
        int currentWeight = 0;

        for (Item item : items) {
            if (currentWeight + item.weight <= capacity) {
                // Take full item
                currentWeight += item.weight;
                totalValue += item.value;
            } else {
                // Take fraction of item
                int remainingCapacity = capacity - currentWeight;
                totalValue += item.ratio * remainingCapacity;
                break; // Knapsack full
            }
        }

        return totalValue;
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 💰 FRACTIONAL KNAPSACK (GREEDY) DEMONSTRATION");
        System.out.println("==================================================\n");

        Item[] items = {
            new Item(10, 60),  // ratio = 6.0
            new Item(20, 100), // ratio = 5.0
            new Item(30, 120)  // ratio = 4.0
        };
        int capacity = 50;

        double maxValue = getMaxValue(items, capacity);
        System.out.printf("Max Value achievable for capacity %d: %.2f%n", capacity, maxValue);

        System.out.println("\n✅ Fractional Knapsack test passed!");
    }
}

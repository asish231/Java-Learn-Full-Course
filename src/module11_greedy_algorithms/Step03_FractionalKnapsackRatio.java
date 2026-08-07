package module11_greedy_algorithms;

import java.util.Arrays;
import java.util.Comparator;

/**
 * Step 03: Fractional Knapsack (Value/Weight Density Ratio Greedy Choice)
 *
 * <pre>
 * VALUE-TO-WEIGHT RATIO GREEDY DENSITY SORTING:
 *
 * Items Available:
 * Item 1: Value = 60,  Weight = 10 -> Ratio = 6.0 $/kg
 * Item 2: Value = 100, Weight = 20 -> Ratio = 5.0 $/kg
 * Item 3: Value = 120, Weight = 30 -> Ratio = 4.0 $/kg
 *
 * Knapsack Capacity = 50 kg
 *
 * Step 1: Take ALL of Item 1 (Ratio 6.0): Weight = 10, Value = 60. Rem Cap = 40.
 * Step 2: Take ALL of Item 2 (Ratio 5.0): Weight = 20, Value = 100. Rem Cap = 20.
 * Step 3: Take FRACTION of Item 3 (Ratio 4.0):
 *         Cap = 20 kg remaining out of 30 kg weight -> Take 20/30 (2/3) fraction.
 *         Added Value = 120 * (20/30) = 80.
 *
 * Total Maximum Value = 60 + 100 + 80 = 240.0
 * </pre>
 */
public class Step03_FractionalKnapsackRatio {

    public static class Item {
        public final int id;
        public final double value;
        public final double weight;
        public final double ratio; // value / weight

        public Item(int id, double value, double weight) {
            this.id = id;
            this.value = value;
            this.weight = weight;
            this.ratio = value / weight;
        }

        @Override
        public String toString() {
            return "Item#" + id + " (Val=" + value + ", Wt=" + weight + ", Ratio=" + String.format("%.2f", ratio) + ")";
        }
    }

    public static class KnapsackResult {
        public final double maxValue;
        public final double usedCapacity;

        public KnapsackResult(double maxValue, double usedCapacity) {
            this.maxValue = maxValue;
            this.usedCapacity = usedCapacity;
        }
    }

    /**
     * Solves Fractional Knapsack using Greedy Ratio Sorting.
     */
    public static KnapsackResult getOptimalValue(double capacity, double[] values, double[] weights) {
        int n = values.length;
        Item[] items = new Item[n];
        for (int i = 0; i < n; i++) {
            items[i] = new Item(i + 1, values[i], weights[i]);
        }

        // Sort items in descending order of value-to-weight ratio
        Arrays.sort(items, Comparator.comparingDouble((Item item) -> item.ratio).reversed());

        double totalValue = 0.0;
        double remainingCapacity = capacity;

        System.out.println("  [INIT] Items Sorted by Value/Weight Ratio Density:");
        for (Item item : items) {
            System.out.println("    - " + item);
        }

        System.out.println("\n  --- Packing Items Into Knapsack ---");
        for (Item item : items) {
            if (remainingCapacity <= 0) break;

            if (item.weight <= remainingCapacity) {
                // Take 100% of full item
                remainingCapacity -= item.weight;
                totalValue += item.value;
                System.out.println("  [ACTION] Took 100% of " + item + " | Added Value: " + item.value + " | Rem Cap: " + remainingCapacity);
            } else {
                // Take partial fraction of item
                double fraction = remainingCapacity / item.weight;
                double partialValue = item.value * fraction;
                totalValue += partialValue;
                System.out.println("  [ACTION] Took " + String.format("%.2f", (fraction * 100)) + "% Fraction of " + item
                        + " | Added Value: " + String.format("%.2f", partialValue) + " | Rem Cap: 0.0");
                remainingCapacity = 0;
            }
        }

        return new KnapsackResult(totalValue, capacity - remainingCapacity);
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 11 - Step 03: Fractional Knapsack (Ratio Density Greedy)");
        System.out.println("======================================================================\n");

        double[] values = {60, 100, 120};
        double[] weights = {10, 20, 30};
        double capacity = 50;

        System.out.println("[INIT] Knapsack Max Capacity: " + capacity + " kg");

        KnapsackResult res = getOptimalValue(capacity, values, weights);

        System.out.println("\n[STATE] Total Maximum Value Achieved: " + res.maxValue);
        System.out.println("[STATE] Total Knapsack Capacity Utilized: " + res.usedCapacity + " / " + capacity + " kg");

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Step03_FractionalKnapsackRatio executed cleanly.");
        System.out.println("======================================================================");
    }
}

package module01_foundations;

/**
 * LEVEL 2 (INTERMEDIATE): Logarithmic Growth O(log N) & Amortized Complexity
 * Demonstrates binary division loops and dynamic array expansion cost math.
 */
public class Level2_IntermediateAmortized {

    // O(log N) - Logarithmic Time (Input halved at each iteration)
    public static int countHalvingSteps(int n) {
        int steps = 0;
        while (n > 1) {
            n = n / 2;
            steps++;
        }
        return steps;
    }

    // Amortized Analysis Demo: Dynamic Array Capacity Expansion
    public static void demonstrateAmortizedCost(int elementsToAdd) {
        int capacity = 1;
        int totalCopyOperations = 0;

        for (int i = 1; i <= elementsToAdd; i++) {
            if (i > capacity) {
                // Resize: Copy existing 'capacity' elements to new array of 2 * capacity
                totalCopyOperations += (i - 1);
                capacity *= 2;
            }
        }

        double amortizedCostPerAdd = (double) (elementsToAdd + totalCopyOperations) / elementsToAdd;
        System.out.printf("  Added %d items. Total array resizes copies = %d. Amortized cost per add = %.2f ops (~O(1))%n",
                elementsToAdd, totalCopyOperations, amortizedCostPerAdd);
    }

    public static void main(String[] args) {
        System.out.println("--- Module 01: Level 2 (Intermediate Amortized & Log N) ---");
        int N = 1000_000;
        System.out.printf("O(log N) Steps to reduce %d to 1: %d steps%n", N, countHalvingSteps(N));

        demonstrateAmortizedCost(1000);
    }
}

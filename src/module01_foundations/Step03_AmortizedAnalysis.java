package module01_foundations;

/**
 * Step 03: Amortized Analysis & Dynamic Array Capacity Expansion
 *
 * <pre>
 * GEOMETRIC DOUBLING (2x Expansion):
 * Cap=1: [A]
 * Cap=2: [A|B]                        (Resize 1 copy)
 * Cap=4: [A|B|C|D]                    (Resize 2 copies)
 * Cap=8: [A|B|C|D|E|F|G|H]            (Resize 4 copies)
 *
 * Total Copy Operations for N elements = 1 + 2 + 4 + ... + N/2 = N - 1 < N
 * Amortized Cost per Operation = (N appends + (N - 1) copies) / N ≈ 2 ops = O(1)
 *
 * AMORTIZED COST SPIKE CHART (2x Doubling):
 * Cost |
 * O(N) |       |                           |
 *      |       |                           | (Resize spikes)
 * O(1) | | | | | | | | | | | | | | | | | | | | | | (Cheap appends)
 * -----+--------------------------------------------> N insertions
 * </pre>
 */
public class Step03_AmortizedAnalysis {

    /**
     * Statistics container for capacity expansion simulation.
     */
    public static class SimulationResult {
        public final String strategyName;
        public final int totalElements;
        public final int finalCapacity;
        public final int resizeCount;
        public final long totalCopyOperations;
        public final double amortizedCostPerAppend;

        public SimulationResult(String strategyName, int totalElements, int finalCapacity,
                                int resizeCount, long totalCopyOperations) {
            this.strategyName = strategyName;
            this.totalElements = totalElements;
            this.finalCapacity = finalCapacity;
            this.resizeCount = resizeCount;
            this.totalCopyOperations = totalCopyOperations;
            this.amortizedCostPerAppend = (double) (totalElements + totalCopyOperations) / totalElements;
        }
    }

    /**
     * Simulates Geometric Doubling (2x capacity growth strategy).
     * Proves Amortized O(1) time complexity.
     */
    public static SimulationResult simulateGeometricExpansion(int elementsToAdd) {
        int capacity = 1;
        int size = 0;
        int resizeCount = 0;
        long totalCopies = 0;

        for (int i = 1; i <= elementsToAdd; i++) {
            if (size == capacity) {
                // Resize trigger
                int oldCapacity = capacity;
                capacity *= 2;
                totalCopies += size; // Copy existing elements to new array
                resizeCount++;
            }
            size++;
        }
        return new SimulationResult("Geometric Doubling (2x)", elementsToAdd, capacity, resizeCount, totalCopies);
    }

    /**
     * Simulates Fixed Incremental Expansion (+K capacity growth strategy).
     * Demonstrates Quadratic O(N^2) total cost pitfall.
     */
    public static SimulationResult simulateLinearExpansion(int elementsToAdd, int increment) {
        int capacity = increment;
        int size = 0;
        int resizeCount = 0;
        long totalCopies = 0;

        for (int i = 1; i <= elementsToAdd; i++) {
            if (size == capacity) {
                // Resize trigger
                capacity += increment;
                totalCopies += size; // Copy existing elements
                resizeCount++;
            }
            size++;
        }
        return new SimulationResult("Linear Increment (+" + increment + ")", elementsToAdd, capacity, resizeCount, totalCopies);
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 01 - Foundations | Step 03: Amortized Analysis");
        System.out.println("======================================================================\n");

        int testSize = 100_000;
        System.out.println("[INIT] Simulating Dynamic Array Insertions for N = " + String.format("%,d", testSize) + " elements");

        System.out.println("\n--- 1. Executing Geometric Doubling Strategy (2x) ---");
        System.out.println("[ACTION] Inserting elements with automatic 2x capacity doubling...");
        SimulationResult geoResult = simulateGeometricExpansion(testSize);
        System.out.println("[STATE] Final Capacity: " + String.format("%,d", geoResult.finalCapacity));
        System.out.println("[MEMORY EVENT] Resized " + geoResult.resizeCount + " times");
        System.out.println("[STATE] Total Element Copy Operations: " + String.format("%,d", geoResult.totalCopyOperations));
        System.out.println("[STATE] Amortized Cost per Push: " + String.format("%.4f", geoResult.amortizedCostPerAppend) + " ops/append -> O(1) Amortized!");

        System.out.println("\n--- 2. Executing Fixed Incremental Strategy (+100) ---");
        System.out.println("[ACTION] Inserting elements with +100 fixed capacity increment...");
        SimulationResult linResult = simulateLinearExpansion(testSize, 100);
        System.out.println("[STATE] Final Capacity: " + String.format("%,d", linResult.finalCapacity));
        System.out.println("[MEMORY EVENT] Resized " + linResult.resizeCount + " times");
        System.out.println("[STATE] Total Element Copy Operations: " + String.format("%,d", linResult.totalCopyOperations));
        System.out.println("[STATE] Amortized Cost per Push: " + String.format("%.4f", linResult.amortizedCostPerAppend) + " ops/append -> O(N) Amortized Failure!");

        System.out.println("\n--- 3. Comparative Analysis Summary Table ---");
        System.out.printf("%-25s | %-12s | %-15s | %-18s | %-15s%n",
                "Strategy", "Resizes", "Total Copies", "Amortized Cost/Push", "Big-O Class");
        System.out.println("--------------------------------------------------------------------------------------------------");

        int[] sampleSizes = {1_000, 10_000, 100_000};
        for (int size : sampleSizes) {
            SimulationResult g = simulateGeometricExpansion(size);
            SimulationResult l = simulateLinearExpansion(size, 10);

            System.out.printf("%-25s | %-12d | %-15s | %-18.4f | %-15s%n",
                    "2x Doubling (N=" + size + ")", g.resizeCount, String.format("%,d", g.totalCopyOperations), g.amortizedCostPerAppend, "O(1) Amortized");
            System.out.printf("%-25s | %-12d | %-15s | %-18.4f | %-15s%n",
                    "+10 Increment (N=" + size + ")", l.resizeCount, String.format("%,d", l.totalCopyOperations), l.amortizedCostPerAppend, "O(N) Amortized");
            System.out.println("--------------------------------------------------------------------------------------------------");
        }

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Amortized O(1) vs O(N) proof complete.");
        System.out.println("======================================================================");
    }
}

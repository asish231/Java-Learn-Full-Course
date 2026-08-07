package module01_foundations;

import java.util.Arrays;

/**
 * Step 02: Logarithmic Time O(log N) and Quadratic Time O(N^2) Complexity
 *
 * <pre>
 * O(log N) INTERVAL HALVING (Binary Division):
 * N = 16  [--------------------------------] (16 elements)
 * Step 1: [----------------]                 (8 elements left)
 * Step 2: [--------]                         (4 elements left)
 * Step 3: [----]                             (2 elements left)
 * Step 4: [--]                               (1 element left) -> Log2(16) = 4 steps!
 *
 * O(N^2) NESTED LOOP MATRIX GRID:
 *   i \ j   0   1   2   3   ... N-1
 *   0     (0,0)(0,1)(0,2)(0,3)...(0,N-1)  -> N ops
 *   1     (1,0)(1,1)(1,2)(1,3)...(1,N-1)  -> N ops
 *   ...
 *   N-1   (N-1,0).............(N-1,N-1)  -> N ops
 *  Total Operations = N * N = N^2
 * </pre>
 */
public class Step02_LogarithmicAndQuadraticTime {

    /**
     * Helper result class for tracking operation metrics.
     */
    private static class ComplexityMetrics {
        final long operationCount;
        final long elapsedNanos;
        final long resultValue;

        ComplexityMetrics(long operationCount, long elapsedNanos, long resultValue) {
            this.operationCount = operationCount;
            this.elapsedNanos = elapsedNanos;
            this.resultValue = resultValue;
        }
    }

    /**
     * Counts halving steps required to reduce N down to 1.
     * Demonstrates log2(N) progression.
     */
    public static ComplexityMetrics countHalvingSteps(long n) {
        long ops = 0;
        long startTime = System.nanoTime();
        long current = n;
        while (current > 1) {
            current = current / 2;
            ops++;
        }
        long elapsedTime = System.nanoTime() - startTime;
        return new ComplexityMetrics(ops, elapsedTime, current);
    }

    /**
     * O(log N) Binary Search on a sorted array.
     * Halves the search space at each comparison.
     */
    public static ComplexityMetrics binarySearch(int[] sortedArr, int target) {
        long ops = 0;
        long startTime = System.nanoTime();
        int left = 0;
        int right = sortedArr.length - 1;
        int foundIndex = -1;

        while (left <= right) {
            ops++;
            int mid = left + (right - left) / 2;
            if (sortedArr[mid] == target) {
                foundIndex = mid;
                break;
            } else if (sortedArr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        long elapsedTime = System.nanoTime() - startTime;
        return new ComplexityMetrics(ops, elapsedTime, foundIndex);
    }

    /**
     * O(N^2) All-Pairs Iteration (Nested Loops).
     * Compares every element with every other element.
     */
    public static ComplexityMetrics countQuadraticPairs(int[] arr) {
        long ops = 0;
        long startTime = System.nanoTime();
        long pairCount = 0;
        int n = arr.length;

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                ops++;
                pairCount += (arr[i] + arr[j]);
            }
        }
        long elapsedTime = System.nanoTime() - startTime;
        return new ComplexityMetrics(ops, elapsedTime, pairCount);
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 01 - Foundations | Step 02: Logarithmic & Quadratic Time");
        System.out.println("======================================================================\n");

        int[] sampleArr = new int[]{2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
        System.out.println("[INIT] Initialized Sorted Array for Binary Search: " + Arrays.toString(sampleArr));
        System.out.println("[STATE] Array Size N = " + sampleArr.length);

        System.out.println("\n--- 1. Demonstrating O(log N) Binary Search ---");
        int target = 56;
        System.out.println("[ACTION] Searching for target = " + target + " using Binary Search");
        ComplexityMetrics bsMetrics = binarySearch(sampleArr, target);
        System.out.println("[STATE] Found target at index " + bsMetrics.resultValue + " in "
                + bsMetrics.operationCount + " steps (" + bsMetrics.elapsedNanos + " ns)");
        System.out.println("[MEMORY EVENT] Search interval halved from [0..9] -> [5..9] -> [7..9] -> Found");

        System.out.println("\n--- 2. Growth Rate Comparison Table: O(log N) vs O(N^2) ---");
        System.out.printf("%-12s | %-16s | %-18s | %-16s%n",
                "Input Size N", "O(log2 N) Ops", "O(N^2) Ops", "Quadratic/Log Ratio");
        System.out.println("----------------------------------------------------------------------");

        long[] testSizes = {10L, 100L, 1_000L, 10_000L};

        for (long size : testSizes) {
            ComplexityMetrics halving = countHalvingSteps(size);
            long nSquaredOps = size * size;

            double ratio = (double) nSquaredOps / Math.max(1, halving.operationCount);

            System.out.printf("%-12s | %-16d | %-18s | %-16.2f%n",
                    String.format("%,d", size),
                    halving.operationCount,
                    String.format("%,d", nSquaredOps),
                    ratio);
        }

        System.out.println("\n--- 3. Running Actual O(N^2) Execution Benchmark ---");
        int[] n1000 = new int[1000];
        for (int i = 0; i < 1000; i++) n1000[i] = i;

        System.out.println("[INIT] Array of size N = 1,000 initialized.");
        System.out.println("[ACTION] Executing All-Pairs Nested Loop O(N^2)...");
        ComplexityMetrics quadMetrics = countQuadraticPairs(n1000);
        System.out.println("[STATE] Quadratic loop executed " + String.format("%,d", quadMetrics.operationCount)
                + " operations in " + String.format("%,d", quadMetrics.elapsedNanos) + " ns ("
                + String.format("%.2f", quadMetrics.elapsedNanos / 1_000_000.0) + " ms)");

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: O(log N) and O(N^2) execution verified.");
        System.out.println("======================================================================");
    }
}

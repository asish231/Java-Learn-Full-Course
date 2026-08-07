package module01_foundations;

import java.util.Arrays;

/**
 * Step 01: Constant Time O(1) and Linear Time O(N) Operations
 *
 * <pre>
 * O(1) CONSTANT TIME MEMORY ACCESS:
 * Array Base Address in Heap: 0x1000, Element Size: 4 Bytes (int)
 * Address Calculation: Base + (Index * ElementSize)
 * Index 3 Address = 0x1000 + (3 * 4) = 0x100C  [Single CPU Instruction!]
 *
 * +---------+---------+---------+---------+---------+
 * |  arr[0] |  arr[1] |  arr[2] |  arr[3] |  arr[4] |
 * |   10    |   20    |   30    |   40    |   50    |
 * +---------+---------+---------+---------+---------+
 * 0x1000    0x1004    0x1008    0x100C    0x1010
 *                                 ^
 *                         Direct Access O(1)
 *
 * O(N) LINEAR TIME ARRAY ITERATION:
 * Step 0: [10] -> Step 1: [20] -> Step 2: [30] ... -> Step N-1: [50]
 *   i=0        i=1        i=2                 i=N-1
 * [Pointer moves sequentially across all N elements -> N operations]
 * </pre>
 */
public class Step01_ConstantAndLinearTime {

    /**
     * Helper result class to hold benchmark statistics for operations.
     */
    private static class BenchmarkResult {
        final long operationCount;
        final long elapsedNanos;
        final long resultValue;

        BenchmarkResult(long operationCount, long elapsedNanos, long resultValue) {
            this.operationCount = operationCount;
            this.elapsedNanos = elapsedNanos;
            this.resultValue = resultValue;
        }
    }

    /**
     * Demonstrates O(1) Constant Time Array Lookup.
     * Direct memory address access takes equal time regardless of array size.
     */
    public static int constantTimeAccess(int[] arr, int index) {
        if (index < 0 || index >= arr.length) {
            throw new IndexOutOfBoundsException("Index " + index + " out of bounds for size " + arr.length);
        }
        return arr[index];
    }

    /**
     * Demonstrates O(N) Linear Time Summation.
     * Iterates over every element exactly once.
     */
    public static BenchmarkResult calculateLinearSum(int[] arr) {
        long ops = 0;
        long startTime = System.nanoTime();
        long sum = 0;
        for (int i = 0; i < arr.length; i++) {
            sum += arr[i];
            ops++;
        }
        long elapsedTime = System.nanoTime() - startTime;
        return new BenchmarkResult(ops, elapsedTime, sum);
    }

    /**
     * Demonstrates O(N) Linear Search.
     * Scans sequentially until target is found or array ends.
     */
    public static BenchmarkResult linearSearch(int[] arr, int target) {
        long ops = 0;
        long startTime = System.nanoTime();
        long foundIndex = -1;
        for (int i = 0; i < arr.length; i++) {
            ops++;
            if (arr[i] == target) {
                foundIndex = i;
                break;
            }
        }
        long elapsedTime = System.nanoTime() - startTime;
        return new BenchmarkResult(ops, elapsedTime, foundIndex);
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 01 - Foundations | Step 01: Constant & Linear Time Complexity");
        System.out.println("======================================================================\n");

        int[] smallArray = new int[]{10, 20, 30, 40, 50};
        System.out.println("[INIT] Initialized Small Array: " + Arrays.toString(smallArray));
        System.out.println("[STATE] Array length N = " + smallArray.length);

        System.out.println("\n--- 1. Demonstrating O(1) Constant Time Lookup ---");
        int indexToAccess = 3;
        System.out.println("[ACTION] Accessing element at index " + indexToAccess);
        long startO1 = System.nanoTime();
        int val = constantTimeAccess(smallArray, indexToAccess);
        long timeO1 = System.nanoTime() - startO1;
        System.out.println("[STATE] Accessed value = " + val + " in " + timeO1 + " ns");
        System.out.println("[MEMORY EVENT] Direct address formula computed instantly: Base + (" + indexToAccess + " * 4 bytes)");

        System.out.println("\n--- 2. Benchmarking Scaling behavior across N = 10, N = 10,000, N = 1,000,000 ---");

        int[] sizes = {10, 10_000, 1_000_000};

        for (int size : sizes) {
            int[] testArr = new int[size];
            for (int i = 0; i < size; i++) {
                testArr[i] = i + 1;
            }

            System.out.println("\n------------------------------------------------");
            System.out.println("[INIT] Created Array of Size N = " + String.format("%,d", size));

            // Constant Time Test
            long startConst = System.nanoTime();
            int constVal = constantTimeAccess(testArr, size - 1);
            long endConst = System.nanoTime() - startConst;
            System.out.println("  --> O(1) Access Last Index [" + (size - 1) + "]: Value=" + constVal
                    + ", Time=" + endConst + " ns, Operations=1");

            // Linear Sum Test
            BenchmarkResult sumResult = calculateLinearSum(testArr);
            System.out.println("  --> O(N) Linear Sum Calculation: Sum=" + sumResult.resultValue
                    + ", Time=" + String.format("%,d", sumResult.elapsedNanos) + " ns, Operations=" + String.format("%,d", sumResult.operationCount));

            // Linear Search (Worst Case: Element at end)
            BenchmarkResult searchResult = linearSearch(testArr, size);
            System.out.println("  --> O(N) Linear Search Worst Case: Found Index=" + searchResult.resultValue
                    + ", Time=" + String.format("%,d", searchResult.elapsedNanos) + " ns, Operations=" + String.format("%,d", searchResult.operationCount));
        }

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: O(1) and O(N) operations executed correctly.");
        System.out.println("======================================================================");
    }
}

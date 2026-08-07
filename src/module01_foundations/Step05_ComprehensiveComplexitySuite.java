package module01_foundations;

import java.util.Arrays;

/**
 * Step 05: Comprehensive Complexity Benchmark & Big-O Spectrum Suite
 *
 * <pre>
 * BIG-O TIME COMPLEXITY GROWTH CURVES:
 * Ops
 *  ^
 *  |                                         / O(2^N) [Exponential]
 *  |                                 _.-'   / O(N^2) [Quadratic]
 *  |                            _.-'       /
 *  |                       _.-'           / O(N log N) [Linearithmic]
 *  |                  _.-'               /
 *  |             _.-'                   / O(N) [Linear]
 *  |        _.-'                       /
 *  |   _.-'                           / O(log N) [Logarithmic]
 *  |---------------------------------/-----------------> O(1) [Constant]
 *  0---------------------------------------------------> Input Size N
 * </pre>
 */
public class Step05_ComprehensiveComplexitySuite {

    /**
     * Benchmark result container holding metric counts.
     */
    public static class BenchmarkRecord {
        public final String complexityClass;
        public final int inputN;
        public final long operationCount;
        public final long elapsedNanos;
        public final String auxiliarySpace;

        public BenchmarkRecord(String complexityClass, int inputN, long operationCount,
                               long elapsedNanos, String auxiliarySpace) {
            this.complexityClass = complexityClass;
            this.inputN = inputN;
            this.operationCount = operationCount;
            this.elapsedNanos = elapsedNanos;
            this.auxiliarySpace = auxiliarySpace;
        }
    }

    // --- Benchmark Implementations ---

    // O(1) Constant Time
    public static BenchmarkRecord benchO1(int[] arr, int index) {
        long start = System.nanoTime();
        int val = arr[index];
        long time = System.nanoTime() - start;
        return new BenchmarkRecord("O(1) Constant", arr.length, 1, time, "O(1)");
    }

    // O(log N) Logarithmic Time
    public static BenchmarkRecord benchOlogN(int[] arr, int target) {
        long start = System.nanoTime();
        long ops = 0;
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            ops++;
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) break;
            else if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        long time = System.nanoTime() - start;
        return new BenchmarkRecord("O(log N) Logarithmic", arr.length, ops, time, "O(1)");
    }

    // O(N) Linear Time
    public static BenchmarkRecord benchON(int[] arr) {
        long start = System.nanoTime();
        long ops = 0;
        long sum = 0;
        for (int val : arr) {
            sum += val;
            ops++;
        }
        long time = System.nanoTime() - start;
        return new BenchmarkRecord("O(N) Linear", arr.length, ops, time, "O(1)");
    }

    // O(N log N) Linearithmic Time (Dual-pivot Quicksort)
    public static BenchmarkRecord benchONlogN(int[] arr) {
        int[] copy = Arrays.copyOf(arr, arr.length);
        long start = System.nanoTime();
        Arrays.sort(copy);
        long time = System.nanoTime() - start;
        long estimatedOps = (long) (arr.length * (Math.log(arr.length) / Math.log(2)));
        return new BenchmarkRecord("O(N log N) Linearithmic", arr.length, estimatedOps, time, "O(log N)");
    }

    // O(N^2) Quadratic Time
    public static BenchmarkRecord benchON2(int[] arr) {
        long start = System.nanoTime();
        long ops = 0;
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                ops++;
            }
        }
        long time = System.nanoTime() - start;
        return new BenchmarkRecord("O(N^2) Quadratic", arr.length, ops, time, "O(1)");
    }

    // O(2^N) Exponential Time (Recursive Fibonacci)
    public static long fibRecursiveCounter = 0;

    public static long fibonacci(int n) {
        fibRecursiveCounter++;
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }

    public static BenchmarkRecord benchO2N(int n) {
        fibRecursiveCounter = 0;
        long start = System.nanoTime();
        fibonacci(n);
        long time = System.nanoTime() - start;
        return new BenchmarkRecord("O(2^N) Exponential", n, fibRecursiveCounter, time, "O(N) Stack");
    }

    /**
     * JVM Warm-up method to trigger JIT compilation before benchmarking.
     */
    private static void performJITWarmup() {
        int[] warmup = new int[1000];
        for (int i = 0; i < 1000; i++) warmup[i] = i;
        for (int i = 0; i < 100; i++) {
            benchO1(warmup, 500);
            benchOlogN(warmup, 750);
            benchON(warmup);
            benchONlogN(warmup);
            benchON2(warmup);
            benchO2N(15);
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 01 - Foundations | Step 05: Comprehensive Complexity Suite");
        System.out.println("======================================================================\n");

        System.out.println("[INIT] Performing JVM Warmup runs for accurate nanoTime measurement...");
        performJITWarmup();
        System.out.println("[STATE] JVM JIT Warmup complete.");

        int[] sizes = {10, 100, 1_000, 4_000};

        System.out.println("\n===============================================================================================");
        System.out.printf("%-24s | %-8s | %-16s | %-16s | %-14s%n",
                "Complexity Class", "N", "Est. Operations", "Time Elapsed", "Aux. Space");
        System.out.println("===============================================================================================");

        for (int size : sizes) {
            int[] arr = new int[size];
            for (int i = 0; i < size; i++) arr[i] = i;

            BenchmarkRecord rO1 = benchO1(arr, size / 2);
            BenchmarkRecord rOlogN = benchOlogN(arr, size - 1);
            BenchmarkRecord rON = benchON(arr);
            BenchmarkRecord rONlogN = benchONlogN(arr);
            BenchmarkRecord rON2 = benchON2(arr);

            System.out.printf("%-24s | %-8d | %-16s | %-16s | %-14s%n",
                    rO1.complexityClass, rO1.inputN, String.format("%,d", rO1.operationCount), rO1.elapsedNanos + " ns", rO1.auxiliarySpace);
            System.out.printf("%-24s | %-8d | %-16s | %-16s | %-14s%n",
                    rOlogN.complexityClass, rOlogN.inputN, String.format("%,d", rOlogN.operationCount), rOlogN.elapsedNanos + " ns", rOlogN.auxiliarySpace);
            System.out.printf("%-24s | %-8d | %-16s | %-16s | %-14s%n",
                    rON.complexityClass, rON.inputN, String.format("%,d", rON.operationCount), rON.elapsedNanos + " ns", rON.auxiliarySpace);
            System.out.printf("%-24s | %-8d | %-16s | %-16s | %-14s%n",
                    rONlogN.complexityClass, rONlogN.inputN, String.format("%,d", rONlogN.operationCount), String.format("%,d", rONlogN.elapsedNanos) + " ns", rONlogN.auxiliarySpace);
            System.out.printf("%-24s | %-8d | %-16s | %-16s | %-14s%n",
                    rON2.complexityClass, rON2.inputN, String.format("%,d", rON2.operationCount), String.format("%.2f ms", rON2.elapsedNanos / 1_000_000.0), rON2.auxiliarySpace);

            System.out.println("-----------------------------------------------------------------------------------------------");
        }

        // Exponential benchmark separately with small N (due to explosive growth)
        int expN = 30;
        System.out.println("\n[ACTION] Running O(2^N) Exponential Benchmark for N = " + expN + "...");
        BenchmarkRecord rO2N = benchO2N(expN);
        System.out.printf("%-24s | %-8d | %-16s | %-16s | %-14s%n",
                rO2N.complexityClass, rO2N.inputN, String.format("%,d", rO2N.operationCount), String.format("%.2f ms", rO2N.elapsedNanos / 1_000_000.0), rO2N.auxiliarySpace);

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Full Big-O Benchmark Suite Completed.");
        System.out.println("======================================================================");
    }
}

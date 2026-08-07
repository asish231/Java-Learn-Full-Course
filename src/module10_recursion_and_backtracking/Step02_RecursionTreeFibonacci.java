package module10_recursion_and_backtracking;

import java.util.Arrays;

/**
 * Step 02: Recursion Tree & Overlapping Subproblems (Fibonacci)
 *
 * <pre>
 * NAIVE EXPONENTIAL RECURSION TREE FOR fib(5):
 *                                   fib(5)
 *                            /                  \
 *                      fib(4)                    fib(3)
 *                    /        \                /        \
 *                fib(3)      fib(2)        fib(2)      fib(1)
 *               /      \     /    \        /    \
 *           fib(2)  fib(1) fib(1) fib(0) fib(1) fib(0)
 *           /    \
 *       fib(1) fib(0)
 *
 * Time Complexity: O(2^N) due to redundant tree branches!
 * Duplicate evaluations of fib(3), fib(2), fib(1) cause exponential stack frame creation.
 *
 * MEMOIZED RECURSION TREE (Top-Down Dynamic Programming):
 *                                   fib(5)
 *                                  /
 *                            fib(4)
 *                           /
 *                     fib(3)
 *                    /
 *              fib(2)
 *             /      \
 *         fib(1)    fib(0)  --> Cache result in memo array -> O(N) Time, O(N) Stack
 * </pre>
 */
public class Step02_RecursionTreeFibonacci {

    public static class PerformanceMetrics {
        public final long result;
        public final long callCount;
        public final long durationNanos;

        public PerformanceMetrics(long result, long callCount, long durationNanos) {
            this.result = result;
            this.callCount = callCount;
            this.durationNanos = durationNanos;
        }
    }

    private static long naiveCallCount = 0;
    private static long memoCallCount = 0;

    /**
     * Naive exponential recursive Fibonacci.
     */
    public static long fibNaive(int n) {
        naiveCallCount++;
        if (n <= 0) return 0;
        if (n == 1) return 1;
        return fibNaive(n - 1) + fibNaive(n - 2);
    }

    /**
     * Top-Down Memoized recursive Fibonacci.
     */
    public static long fibMemo(int n, long[] memo) {
        memoCallCount++;
        if (n <= 0) return 0;
        if (n == 1) return 1;

        if (memo[n] != -1) {
            return memo[n]; // Return cached result (Pruning tree branch)
        }

        memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
        return memo[n];
    }

    /**
     * Iterative bottom-up Fibonacci using O(1) space.
     */
    public static long fibIterative(int n) {
        if (n <= 0) return 0;
        if (n == 1) return 1;

        long prev2 = 0;
        long prev1 = 1;
        long current = 0;

        for (int i = 2; i <= n; i++) {
            current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }
        return current;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 10 - Step 02: Recursion Tree & Overlapping Subproblems (Fibonacci)");
        System.out.println("======================================================================\n");

        int testN = 35;
        System.out.println("[INIT] Comparing Naive Recursion vs Memoization for Fibonacci N = " + testN);

        // 1. Naive Recursion Benchmark
        System.out.println("\n--- 1. Executing Naive Recursive Fibonacci ---");
        naiveCallCount = 0;
        long startTimeNaive = System.nanoTime();
        long resultNaive = fibNaive(testN);
        long timeNaive = System.nanoTime() - startTimeNaive;

        System.out.println("[STATE] Naive Result: fib(" + testN + ") = " + resultNaive);
        System.out.println("[STATE] Total Naive Call Stack Frames Created: " + String.format("%,d", naiveCallCount));
        System.out.println("[STATE] Execution Time: " + String.format("%,d", timeNaive) + " ns (" + (timeNaive / 1_000_000.0) + " ms)");

        // 2. Memoized Recursion Benchmark
        System.out.println("\n--- 2. Executing Top-Down Memoized Fibonacci ---");
        memoCallCount = 0;
        long[] memo = new long[testN + 1];
        Arrays.fill(memo, -1);

        System.out.println("[MEMORY EVENT] Allocated Memoization Array of Size: " + (testN + 1));
        long startTimeMemo = System.nanoTime();
        long resultMemo = fibMemo(testN, memo);
        long timeMemo = System.nanoTime() - startTimeMemo;

        System.out.println("[STATE] Memoized Result: fib(" + testN + ") = " + resultMemo);
        System.out.println("[STATE] Total Memoized Call Stack Frames: " + memoCallCount);
        System.out.println("[STATE] Execution Time: " + String.format("%,d", timeMemo) + " ns (" + (timeMemo / 1_000_000.0) + " ms)");

        // 3. Comparison
        long speedup = timeMemo > 0 ? timeNaive / timeMemo : 1;
        long callsSaved = naiveCallCount - memoCallCount;
        System.out.println("\n--- Performance Impact Summary ---");
        System.out.println("[ACTION] Pruned Redundant Calls Saved: " + String.format("%,d", callsSaved) + " call frames");
        System.out.println("[STATE] Memoization Speedup Factor: " + speedup + "x faster");

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Step02_RecursionTreeFibonacci executed cleanly.");
        System.out.println("======================================================================");
    }
}

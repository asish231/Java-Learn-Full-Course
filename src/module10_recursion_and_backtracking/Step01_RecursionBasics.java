package module10_recursion_and_backtracking;

/**
 * Step 01: Recursion Basics — Single Call Stack Memory & Execution
 *
 * <pre>
 * JVM CALL STACK GROWTH & UNWINDING FOR factorial(4):
 *
 * CALL STACK GROWTH (Pushing frames):
 * +----------------------------------+  <- Top of Stack (depth = 4)
 * | factorial(1) -> base case: return 1|
 * +----------------------------------+
 * | factorial(2) -> 2 * factorial(1) |
 * +----------------------------------+
 * | factorial(3) -> 3 * factorial(2) |
 * +----------------------------------+
 * | factorial(4) -> 4 * factorial(3) |
 * +----------------------------------+  <- Bottom of Stack (main)
 *
 * UNWINDING (Popping frames & returning results):
 * Step 1: factorial(1) returns 1
 * Step 2: factorial(2) returns 2 * 1 = 2
 * Step 3: factorial(3) returns 3 * 2 = 6
 * Step 4: factorial(4) returns 4 * 6 = 24
 * </pre>
 */
public class Step01_RecursionBasics {

    /**
     * Helper class to encapsulate stack frame metric details.
     */
    public static class RecursionResult {
        public final long value;
        public final int maxDepth;
        public final int totalCalls;

        public RecursionResult(long value, int maxDepth, int totalCalls) {
            this.value = value;
            this.maxDepth = maxDepth;
            this.totalCalls = totalCalls;
        }
    }

    private static int currentMaxDepth = 0;
    private static int totalCallCount = 0;

    /**
     * Calculates factorial recursively while tracking call stack depth.
     *
     * @param n non-negative integer
     * @return n!
     */
    public static long factorial(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("Factorial is undefined for negative numbers: " + n);
        }
        // Base case: 0! = 1, 1! = 1
        if (n <= 1) {
            return 1;
        }
        // Recursive step: n * (n - 1)!
        return n * factorial(n - 1);
    }

    /**
     * Traced version of factorial displaying stack frame push/pop.
     */
    public static long factorialTraced(int n, int depth) {
        totalCallCount++;
        if (depth > currentMaxDepth) {
            currentMaxDepth = depth;
        }

        String indent = "  ".repeat(depth);
        System.out.println(indent + "[MEMORY EVENT] Push Frame: factorial(" + n + ") [Stack Depth: " + depth + "]");

        if (n <= 1) {
            System.out.println(indent + "[STATE] Base Case Reached! n = " + n + " -> Returning 1");
            System.out.println(indent + "[MEMORY EVENT] Pop Frame: factorial(" + n + ")");
            return 1;
        }

        System.out.println(indent + "[ACTION] Recursive Call: " + n + " * factorial(" + (n - 1) + ")");
        long subResult = factorialTraced(n - 1, depth + 1);
        long result = n * subResult;

        System.out.println(indent + "[STATE] Unwinding Frame: factorial(" + n + ") = " + n + " * " + subResult + " = " + result);
        System.out.println(indent + "[MEMORY EVENT] Pop Frame: factorial(" + n + ")");
        return result;
    }

    /**
     * Calculates sum of first N natural numbers recursively.
     */
    public static long sumNatural(int n) {
        if (n <= 0) {
            return 0;
        }
        return n + sumNatural(n - 1);
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 10 - Step 01: Single Call Stack Recursion (Factorial)");
        System.out.println("======================================================================\n");

        int n = 5;
        System.out.println("[INIT] Initializing factorial recursion test for N = " + n);

        currentMaxDepth = 0;
        totalCallCount = 0;

        System.out.println("\n--- Step-by-Step Call Stack Trace ---");
        long result = factorialTraced(n, 1);

        System.out.println("\n[STATE] Final Result of " + n + "! = " + result);
        System.out.println("[STATE] Total Recursive Function Calls: " + totalCallCount);
        System.out.println("[STATE] Maximum Call Stack Depth Reached: " + currentMaxDepth);

        System.out.println("\n--- Natural Numbers Sum ---");
        int sumN = 10;
        System.out.println("[INIT] Calculating sum of first " + sumN + " natural numbers");
        long sumResult = sumNatural(sumN);
        System.out.println("[STATE] Sum(1.." + sumN + ") = " + sumResult);

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Step01_RecursionBasics executed cleanly.");
        System.out.println("======================================================================");
    }
}

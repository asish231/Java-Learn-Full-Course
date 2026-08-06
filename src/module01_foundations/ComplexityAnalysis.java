package module01_foundations;

/**
 * Module 01: Foundations & Big-O Complexity Analysis
 * Demonstrates runtime behavior of O(1), O(log N), O(N), O(N^2), and recursive stack frames.
 */
public class ComplexityAnalysis {

    /**
     * O(1) - Constant Time Complexity
     * Execution time is independent of input size N.
     */
    public static int constantTimeAccess(int[] arr, int index) {
        if (index < 0 || index >= arr.length) {
            throw new IndexOutOfBoundsException("Index out of bounds");
        }
        return arr[index]; // Single array lookup operation
    }

    /**
     * O(log N) - Logarithmic Time Complexity
     * Input size is divided in half at each step (e.g., Binary Search).
     */
    public static int logarithmicSearch(int[] sortedArr, int target) {
        int left = 0;
        int right = sortedArr.length - 1;
        int steps = 0;

        while (left <= right) {
            steps++;
            int mid = left + (right - left) / 2;
            if (sortedArr[mid] == target) {
                System.out.printf("  [O(log N)] Found target %d in %d steps (N = %d)%n", target, steps, sortedArr.length);
                return mid;
            }
            if (sortedArr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }

    /**
     * O(N) - Linear Time Complexity
     * Iterates over every element once.
     */
    public static long linearSum(int[] arr) {
        long sum = 0;
        for (int val : arr) {
            sum += val;
        }
        return sum;
    }

    /**
     * O(N^2) - Quadratic Time Complexity
     * Nested loops over input of size N.
     */
    public static int quadraticPairsCount(int[] arr) {
        int pairCount = 0;
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < arr.length; j++) {
                pairCount++;
            }
        }
        return pairCount;
    }

    /**
     * O(2^N) - Exponential Time Complexity
     * Naive recursive Fibonacci calculation (computes subproblems repeatedly).
     */
    public static long exponentialFibonacci(int n) {
        if (n <= 1) return n;
        return exponentialFibonacci(n - 1) + exponentialFibonacci(n - 2);
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 📊 MODULE 01: BIG-O COMPLEXITY ANALYSIS DEMO");
        System.out.println("==================================================\n");

        int N = 100_000;
        int[] testArr = new int[N];
        for (int i = 0; i < N; i++) {
            testArr[i] = i * 2;
        }

        // Demonstration 1: O(1)
        long startTime = System.nanoTime();
        int val = constantTimeAccess(testArr, N / 2);
        long endTime = System.nanoTime();
        System.out.printf("1. O(1) Constant Access: Value = %d, Elapsed Time: %d ns%n", val, (endTime - startTime));

        // Demonstration 2: O(log N)
        startTime = System.nanoTime();
        logarithmicSearch(testArr, testArr[N - 2]);
        endTime = System.nanoTime();
        System.out.printf("2. O(log N) Binary Search Elapsed Time: %d ns%n", (endTime - startTime));

        // Demonstration 3: O(N)
        startTime = System.nanoTime();
        long sum = linearSum(testArr);
        endTime = System.nanoTime();
        System.out.printf("3. O(N) Linear Sum: %d, Elapsed Time: %,d ns%n", sum, (endTime - startTime));

        // Demonstration 4: O(N^2) with smaller N = 2000
        int smallN = 2000;
        int[] smallArr = new int[smallN];
        startTime = System.nanoTime();
        int pairs = quadraticPairsCount(smallArr);
        endTime = System.nanoTime();
        System.out.printf("4. O(N^2) Quadratic Count for N=%d: %d operations, Time: %,d ns%n", smallN, pairs, (endTime - startTime));

        // Demonstration 5: O(2^N) with N = 35
        int fibN = 35;
        startTime = System.nanoTime();
        long fibResult = exponentialFibonacci(fibN);
        endTime = System.nanoTime();
        System.out.printf("5. O(2^N) Naive Fib(%d): %d, Elapsed Time: %,d ns (Notice exponential jump!)%n", fibN, fibResult, (endTime - startTime));

        System.out.println("\n✅ Complexity Analysis Demo Completed Successfully!");
    }
}

package module01_foundations;

/**
 * LEVEL 3 (ADVANCED / FAANG): Call Stack Depth & Auxiliary Space Analysis
 * Teaches tail recursion vs non-tail recursion memory frames on JVM stack.
 */
public class Level3_AdvancedRecursionMemory {

    // O(N) Stack Space - Non-Tail Recursive (Accumulates N stack frames)
    public static long nonTailRecursiveFactorial(int n) {
        if (n <= 1) return 1;
        return n * nonTailRecursiveFactorial(n - 1);
    }

    // O(1) Stack Space - Tail-Recursive style (Accumulator pattern)
    public static long tailRecursiveFactorial(int n, long accumulator) {
        if (n <= 1) return accumulator;
        return tailRecursiveFactorial(n - 1, n * accumulator);
    }

    public static void main(String[] args) {
        System.out.println("--- Module 01: Level 3 (Advanced Stack Depth & Memory) ---");
        int n = 20;
        System.out.println("Non-Tail Factorial(" + n + "): " + nonTailRecursiveFactorial(n) + " (Uses " + n + " stack frames)");
        System.out.println("Tail-Recursive Factorial(" + n + "): " + tailRecursiveFactorial(n, 1) + " (Constant frame reusable)");
    }
}

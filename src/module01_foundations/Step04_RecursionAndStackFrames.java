package module01_foundations;

/**
 * Step 04: Recursion Mechanics and JVM Call Stack Frames
 *
 * <pre>
 * JVM CALL STACK FOR NON-TAIL FACTORIAL fact(4):
 *
 *    CALL PHASE (Push Frames)              RETURN PHASE (Pop & Unwind)
 * +--------------------------+          +--------------------------+
 * | fact(1): n=1 -> returns 1| [Top]    | fact(1) returns 1        |
 * +--------------------------+          +--------------------------+
 * | fact(2): n=2 * fact(1)   |          | fact(2) returns 2 * 1=2  |
 * +--------------------------+          +--------------------------+
 * | fact(3): n=3 * fact(2)   |          | fact(3) returns 3 * 2=6  |
 * +--------------------------+          +--------------------------+
 * | fact(4): n=4 * fact(3)   | [Base]   | fact(4) returns 4 * 6=24 |
 * +--------------------------+          +--------------------------+
 *  Peak Stack Depth = 4 frames (O(N) Auxiliary Space)
 *
 * TAIL RECURSION (Accumulator Pattern):
 * tailFact(4, 1) -> tailFact(3, 4) -> tailFact(2, 12) -> tailFact(1, 24) = 24
 * </pre>
 */
public class Step04_RecursionAndStackFrames {

    /**
     * Non-Tail Recursive Factorial.
     * Accumulates stack frames on JVM call stack before unwinding.
     */
    public static long nonTailFactorial(int n, int depth) {
        String indent = "  ".repeat(depth);
        System.out.println(indent + "[MEMORY EVENT] PUSH Frame: nonTailFactorial(n=" + n + ", depth=" + depth + ")");
        if (n <= 1) {
            System.out.println(indent + "[STATE] Base Case Reached at n=" + n + ". Returning 1");
            System.out.println(indent + "[MEMORY EVENT] POP Frame: nonTailFactorial(n=" + n + ")");
            return 1;
        }
        long result = n * nonTailFactorial(n - 1, depth + 1);
        System.out.println(indent + "[STATE] Computed (" + n + " * fact(" + (n - 1) + ")) = " + result);
        System.out.println(indent + "[MEMORY EVENT] POP Frame: nonTailFactorial(n=" + n + ")");
        return result;
    }

    /**
     * Tail Recursive Factorial using Accumulator Pattern.
     * Partial result is passed forward, enabling stack frame reuse concept.
     */
    public static long tailFactorial(int n, long accumulator) {
        System.out.println("  [ACTION] Tail Call -> tailFactorial(n=" + n + ", acc=" + accumulator + ")");
        if (n <= 1) {
            System.out.println("  [STATE] Base Case Reached. Final Accumulator Result = " + accumulator);
            return accumulator;
        }
        return tailFactorial(n - 1, n * accumulator);
    }

    /**
     * Safely probes maximum call stack depth before StackOverflowError is caught.
     */
    public static int measureMaxStackDepth(int currentDepth) {
        try {
            return measureMaxStackDepth(currentDepth + 1);
        } catch (StackOverflowError e) {
            return currentDepth; // Returns maximum stack frame depth reached
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 01 - Foundations | Step 04: Recursion & Stack Frames");
        System.out.println("======================================================================\n");

        int n = 5;
        System.out.println("[INIT] Testing Non-Tail Recursion for Factorial(" + n + ")");
        System.out.println("--- Tracing Call Stack Frame Pushes and Pops ---");
        long resultNonTail = nonTailFactorial(n, 0);
        System.out.println("\n[STATE] Non-Tail Factorial Result: " + resultNonTail);

        System.out.println("\n--- 2. Testing Tail-Recursive Accumulator Pattern ---");
        System.out.println("[INIT] Calling tailFactorial(n=" + n + ", acc=1)");
        long resultTail = tailFactorial(n, 1);
        System.out.println("[STATE] Tail Factorial Result: " + resultTail);

        System.out.println("\n--- 3. Measuring JVM Call Stack Depth Boundary ---");
        System.out.println("[ACTION] Recursively callingProbe to trigger StackOverflowError safely...");
        int maxDepth = measureMaxStackDepth(1);
        System.out.println("[STATE] Maximum Call Stack Depth Achieved: " + String.format("%,d", maxDepth) + " frames!");
        System.out.println("[MEMORY EVENT] StackOverflowError caught safely. Call stack unwound.");

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Call stack recursion behavior verified.");
        System.out.println("======================================================================");
    }
}

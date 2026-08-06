package module10_recursion_and_backtracking;

/**
 * LEVEL 1 (BASIC): Recursion Tree Foundations (Factorial & Fibonacci)
 */
public class Level1_BasicRecursion {

    public static long factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }

    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }

    public static void main(String[] args) {
        System.out.println("--- Module 10: Level 1 (Basic Recursion) ---");
        System.out.println("Factorial(5): " + factorial(5)); // 120
        System.out.println("Fibonacci(7): " + fibonacci(7)); // 13
    }
}

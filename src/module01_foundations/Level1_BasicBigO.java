package module01_foundations;

/**
 * LEVEL 1 (BASIC): Fundamentals of Big-O Time Complexity
 * Teaches how to count primitive operations in single loops and nested loops.
 */
public class Level1_BasicBigO {

    // O(1) - Constant Time: 1 operation regardless of N
    public static int getFirstElement(int[] arr) {
        if (arr.length == 0) return -1;
        return arr[0];
    }

    // O(N) - Linear Time: Loop runs N times
    public static int calculateSum(int[] arr) {
        int sum = 0;
        for (int num : arr) {
            sum += num;
        }
        return sum;
    }

    // O(N^2) - Quadratic Time: Nested loop over N elements
    public static int countAllPairs(int[] arr) {
        int count = 0;
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < arr.length; j++) {
                count++;
            }
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println("--- Module 01: Level 1 (Basic Big-O) ---");
        int[] data = {5, 10, 15, 20, 25};
        System.out.println("O(1) First element: " + getFirstElement(data));
        System.out.println("O(N) Sum: " + calculateSum(data));
        System.out.println("O(N^2) Total Pairs count for N=" + data.length + ": " + countAllPairs(data));
    }
}

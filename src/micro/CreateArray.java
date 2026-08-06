package micro;

import java.util.Arrays;

/**
 * 💡 MICRO TUTORIAL: Java Array Creation & Manipulation
 * 
 * Memory Model: Contiguous block of memory allocated on Heap.
 * Time Complexities:
 * - Access by Index: O(1)
 * - Search by Value: O(N)
 * - Update by Index: O(1)
 */
public class CreateArray {
    public static void main(String[] args) {
        // 1. Declare fixed size array (default values = 0)
        int[] arr = new int[5]; // Memory reserved for 5 ints

        // 2. Direct initialization
        int[] nums = {10, 20, 30, 40, 50};

        // 3. Access & Modify by Index - O(1)
        int first = nums[0]; // 10
        nums[2] = 99;        // {10, 20, 99, 40, 50}

        // 4. 2D Matrix Array (Row x Col)
        int[][] matrix = {
            {1, 2, 3},
            {4, 5, 6}
        }; // 2 rows, 3 columns

        System.out.println("1D Array: " + Arrays.toString(nums));
        System.out.println("2D Array element [1][2]: " + matrix[1][2]); // 6
    }
}

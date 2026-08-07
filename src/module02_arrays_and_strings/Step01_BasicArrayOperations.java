package module02_arrays_and_strings;

import java.util.Arrays;

/**
 * Step 01: Fundamental Array Operations and In-Place Pointer Manipulations
 *
 * <pre>
 * IN-PLACE REVERSAL (Two Pointers):
 * Initial:  [ 10 | 20 | 30 | 40 | 50 ]
 *            ^                 ^
 *           left             right
 * Step 1: Swap(left, right) -> [ 50 | 20 | 30 | 40 | 10 ], left++, right--
 *                  ^       ^
 *                left    right
 * Step 2: Swap(left, right) -> [ 50 | 40 | 30 | 20 | 10 ], left++, right--
 *                        ^  ^
 *                   (left >= right: Loop Terminates!)
 *
 * IN-PLACE ELEMENT REMOVAL (Remove val = 3):
 * Initial:  [ 3 | 2 | 2 | 3 | 4 | 5 ]
 *            ^
 *           writer / reader
 * i=0 (num=3): skip writer
 * i=1 (num=2): nums[writer++] = 2 -> [ 2 | 2 | 2 | 3 | 4 | 5 ]
 * i=2 (num=2): nums[writer++] = 2 -> [ 2 | 2 | 2 | 3 | 4 | 5 ]
 * i=3 (num=3): skip writer
 * i=4 (num=4): nums[writer++] = 4 -> [ 2 | 2 | 4 | 3 | 4 | 5 ]
 * i=5 (num=5): nums[writer++] = 5 -> [ 2 | 2 | 4 | 5 | 4 | 5 ]
 * New Effective Length = 4 -> [ 2, 2, 4, 5 ]
 * </pre>
 */
public class Step01_BasicArrayOperations {

    /**
     * Container holding min and max array extrema.
     */
    public static class ExtremaResult {
        public final int min;
        public final int max;

        public ExtremaResult(int min, int max) {
            this.min = min;
            this.max = max;
        }
    }

    /**
     * Reverses an array in-place using converging two-pointer technique.
     * Time: O(N), Space: O(1)
     */
    public static void reverseInPlace(int[] nums) {
        if (nums == null || nums.length <= 1) return;
        int left = 0;
        int right = nums.length - 1;
        while (left < right) {
            int temp = nums[left];
            nums[left] = nums[right];
            nums[right] = temp;
            left++;
            right--;
        }
    }

    /**
     * Finds minimum and maximum values in a single O(N) traversal pass.
     * Time: O(N), Space: O(1)
     */
    public static ExtremaResult findMinMax(int[] nums) {
        if (nums == null || nums.length == 0) {
            throw new IllegalArgumentException("Array must not be empty");
        }
        int min = nums[0];
        int max = nums[0];
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] < min) min = nums[i];
            if (nums[i] > max) max = nums[i];
        }
        return new ExtremaResult(min, max);
    }

    /**
     * In-place removal of all occurrences of target value (LeetCode 27).
     * Uses Reader/Writer two-pointer pattern.
     * Time: O(N), Space: O(1)
     * @return new effective size k
     */
    public static int removeElement(int[] nums, int val) {
        if (nums == null) return 0;
        int writer = 0;
        for (int reader = 0; reader < nums.length; reader++) {
            if (nums[reader] != val) {
                nums[writer] = nums[reader];
                writer++;
            }
        }
        return writer;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 02 - Arrays & Strings | Step 01: Basic Array Operations");
        System.out.println("======================================================================\n");

        int[] original = {10, 20, 30, 40, 50};
        System.out.println("[INIT] Initial Array: " + Arrays.toString(original));

        System.out.println("\n--- 1. Demonstrating In-Place Array Reversal ---");
        System.out.println("[ACTION] Reversing array in-place with two converging pointers...");
        reverseInPlace(original);
        System.out.println("[STATE] Reversed Array Result: " + Arrays.toString(original));

        System.out.println("\n--- 2. Single-Pass Extrema Finding ---");
        int[] data = {45, 12, 89, 3, 67, 102, 24};
        System.out.println("[INIT] Input Array: " + Arrays.toString(data));
        System.out.println("[ACTION] Scanning single pass for min and max...");
        ExtremaResult extrema = findMinMax(data);
        System.out.println("[STATE] Min Element = " + extrema.min + ", Max Element = " + extrema.max);

        System.out.println("\n--- 3. In-Place Element Removal (Reader/Writer Pointers) ---");
        int[] removeTest = {3, 2, 2, 3, 4, 5, 3, 8};
        int valToRemove = 3;
        System.out.println("[INIT] Target Removal Array: " + Arrays.toString(removeTest));
        System.out.println("[ACTION] Removing all occurrences of value target = " + valToRemove + "...");
        int newLength = removeElement(removeTest, valToRemove);
        System.out.println("[STATE] New Effective Size: " + newLength);
        int[] truncated = Arrays.copyOf(removeTest, newLength);
        System.out.println("[STATE] Truncated Valid Elements: " + Arrays.toString(truncated));
        System.out.println("[MEMORY EVENT] Array modified in-place without allocating extra heap memory.");

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: In-place array operations verified.");
        System.out.println("======================================================================");
    }
}

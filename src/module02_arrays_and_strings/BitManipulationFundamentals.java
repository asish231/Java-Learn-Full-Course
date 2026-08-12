package module02_arrays_and_strings;

import java.util.Arrays;

/**
 * Bit manipulation fundamentals.
 *
 * Topics covered:
 *   - Test, set, clear, and toggle individual bits
 *   - Counting set bits (Brian Kernighan)
 *   - Power of two, single number (XOR), missing number, two single numbers
 */
public class BitManipulationFundamentals {

    public static boolean isBitSet(int n, int i) { return (n & (1 << i)) != 0; }
    public static int setBit(int n, int i) { return n | (1 << i); }
    public static int clearBit(int n, int i) { return n & ~(1 << i); }
    public static int toggleBit(int n, int i) { return n ^ (1 << i); }

    public static int countBits(int n) {
        int count = 0;
        while (n != 0) {
            n &= n - 1; // clears the lowest set bit
            count++;
        }
        return count;
    }

    public static boolean isPowerOfTwo(int n) { return n > 0 && (n & (n - 1)) == 0; }
    public static int singleNumber(int[] nums) {
        int xor = 0;
        for (int x : nums) xor ^= x;
        return xor;
    }
    public static int missingNumber(int[] nums) {
        int xor = 0;
        for (int i = 0; i <= nums.length; i++) xor ^= i;
        for (int x : nums) xor ^= x;
        return xor;
    }
    public static int[] twoSingleNumbers(int[] nums) {
        int xor = 0;
        for (int x : nums) xor ^= x;
        int diff = xor & -xor; // lowest set bit
        int a = 0, b = 0;
        for (int x : nums) {
            if ((x & diff) == 0) a ^= x;
            else b ^= x;
        }
        return new int[]{a, b};
    }

    public static void main(String[] args) {
        System.out.println("--- Bit Manipulation Fundamentals ---");
        int n = 13; // 1101
        System.out.println("n=" + n + " bits: set bit 1? " + isBitSet(n, 1) + ", set bit 2 -> " + setBit(n, 2) + ", clear bit 0 -> " + clearBit(n, 0));
        System.out.println("Set bits in " + n + ": " + countBits(n));
        System.out.println("Power of two? 8=" + isPowerOfTwo(8) + " 7=" + isPowerOfTwo(7));
        int[] single = {4, 1, 2, 1, 2};
        System.out.println("Single number in " + Arrays.toString(single) + ": " + singleNumber(single));
        int[] missing = {3, 0, 1};
        System.out.println("Missing number in " + Arrays.toString(missing) + ": " + missingNumber(missing));
        int[] pair = {1, 2, 1, 3, 2, 5};
        System.out.println("Two single numbers in " + Arrays.toString(pair) + ": " + Arrays.toString(twoSingleNumbers(pair)));
    }
}

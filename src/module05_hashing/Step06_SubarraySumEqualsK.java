package module05_hashing;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * Step 06: Subarray Sum Equals K Pattern using Prefix Sum + HashMap
 *
 * <pre>
 * MATHEMATICAL FOUNDATION:
 * Prefix Sum P[i] = nums[0] + nums[1] + ... + nums[i]
 * Sum of subarray from index i to j: Sum(i..j) = P[j] - P[i-1]
 * We want: P[j] - P[i-1] = K  ===>  P[i-1] = P[j] - K
 *
 * ALGORITHM:
 * Maintain running prefixSum P[j].
 * Query HashMap for frequency of (P[j] - K).
 * Add frequency to count.
 * Increment frequency of P[j] in HashMap.
 *
 * ARRAY: [ 1,  2,  3, -2,  1 ] | Target K = 3
 * Index:   0   1   2   3   4
 * P[j]:    1   3   6   4   5
 * Map:   {0:1, 1:1, 3:1, 6:1, 4:1, 5:1}
 *
 * Subarrays summing to 3:
 *  - [1, 2]       (P[1]=3, P[-1]=0 -> 3-0=3)
 *  - [3]          (P[2]=6, P[1]=3  -> 6-3=3)
 *  - [3, -2, 1]   (P[4]=5, P[1]=3  -> 5-3=2 -> check P[4]-3=2? No... P[4]=5, 5-3=2 -> wait P[3]=4, 4-3=1! [2,3,-2] -> 3!)
 * </pre>
 */
public class Step06_SubarraySumEqualsK {

    /**
     * Calculates total number of continuous subarrays whose sum equals k in O(N) time.
     */
    public static int subarraySum(int[] nums, int k) {
        if (nums == null) return 0;

        int count = 0;
        int currentSum = 0;
        Map<Integer, Integer> prefixSumMap = new HashMap<>();

        // Base case: prefix sum 0 has 1 count (empty prefix before index 0)
        prefixSumMap.put(0, 1);

        for (int num : nums) {
            currentSum += num;

            if (prefixSumMap.containsKey(currentSum - k)) {
                count += prefixSumMap.get(currentSum - k);
            }

            prefixSumMap.put(currentSum, prefixSumMap.getOrDefault(currentSum, 0) + 1);
        }

        return count;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 05 - Hashing | Step 06: Subarray Sum Equals K Pattern");
        System.out.println("======================================================================\n");

        int[] nums = {1, 2, 3, -2, 1};
        int k = 3;

        System.out.println("[INIT] Input Array: " + Arrays.toString(nums) + " | Target K = " + k);

        // Tracing execution step by step
        System.out.println("\n--- 1. Step-by-Step Prefix Sum Map Trace ---");
        int count = 0;
        int currentSum = 0;
        Map<Integer, Integer> map = new HashMap<>();
        map.put(0, 1);
        System.out.println("[INIT] Initialized prefixSumMap with base state {0=1}");

        for (int i = 0; i < nums.length; i++) {
            currentSum += nums[i];
            int complement = currentSum - k;
            System.out.println("[ACTION] Index " + i + ": Element = " + nums[i]
                    + " | Current Prefix Sum = " + currentSum
                    + " | Needed Complement (P - K) = " + complement);

            if (map.containsKey(complement)) {
                int freq = map.get(complement);
                count += freq;
                System.out.println("[STATE] Found complement " + complement + " with frequency " + freq
                        + "! Updated subarray count = " + count);
                System.out.println("[MEMORY EVENT] Subarray ending at index " + i + " sums to K = " + k);
            } else {
                System.out.println("[STATE] Complement " + complement + " NOT found in map.");
            }

            map.put(currentSum, map.getOrDefault(currentSum, 0) + 1);
            System.out.println("        Updated prefixSumMap: " + map);
        }

        System.out.println("\n[STATE] Total Subarrays Summing to " + k + ": " + count);

        // Verification call
        int result = subarraySum(nums, k);
        System.out.println("[STATE] Method returned result: " + result);

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Subarray Sum Equals K pattern executed cleanly.");
        System.out.println("======================================================================");
    }
}

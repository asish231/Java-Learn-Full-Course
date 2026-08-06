package module05_hashing;

import java.util.HashMap;
import java.util.Map;

/**
 * LEVEL 3 (ADVANCED / FAANG): Subarray Sum Equals K (LeetCode 560 - Medium/Hard Pattern)
 * Uses Prefix Sum + HashMap to count contiguous subarrays summing to K in O(N) time.
 */
public class Level3_AdvancedSubarraySumK {

    public static int subarraySum(int[] nums, int k) {
        int count = 0, prefixSum = 0;
        Map<Integer, Integer> prefixMap = new HashMap<>();
        prefixMap.put(0, 1); // Base case: prefix sum 0 occurs once

        for (int num : nums) {
            prefixSum += num;
            if (prefixMap.containsKey(prefixSum - k)) {
                count += prefixMap.get(prefixSum - k);
            }
            prefixMap.put(prefixSum, prefixMap.getOrDefault(prefixSum, 0) + 1);
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println("--- Module 05: Level 3 (Advanced Prefix Sum Hashing) ---");
        int[] nums = {1, 1, 1};
        int k = 2;
        System.out.println("Subarrays summing to " + k + " in [1, 1, 1]: " + subarraySum(nums, k)); // 2 ([1,1] at indices 0-1 and 1-2)
    }
}

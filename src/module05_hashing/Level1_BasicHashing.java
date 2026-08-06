package module05_hashing;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * LEVEL 1 (BASIC): Two Sum (LeetCode 1) & Valid Anagram (LeetCode 242)
 */
public class Level1_BasicHashing {

    // 1. Two Sum - O(N) Time, O(N) Space using HashMap
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{-1, -1};
    }

    // 2. Valid Anagram - O(N) Time using Frequency Array
    public static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] freq = new int[26];
        for (int i = 0; i < s.length(); i++) {
            freq[s.charAt(i) - 'a']++;
            freq[t.charAt(i) - 'a']--;
        }
        for (int count : freq) {
            if (count != 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println("--- Module 05: Level 1 (Basic Hashing) ---");
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        System.out.println("Two Sum for target 9 in " + Arrays.toString(nums) + ": " + Arrays.toString(twoSum(nums, target)));
        System.out.println("Is \"anagram\" & \"nagaram\" valid anagram? " + isAnagram("anagram", "nagaram"));
    }
}

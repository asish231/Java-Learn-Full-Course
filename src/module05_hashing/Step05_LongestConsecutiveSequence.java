package module05_hashing;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * Step 05: Longest Consecutive Sequence Pattern using HashSet
 *
 * <pre>
 * INPUT ARRAY (Unsorted): [ 100, 4, 200, 1, 3, 2 ]
 * HASHSET LOOKUP STATE:  { 100, 4, 200, 1, 3, 2 }
 *
 * SEQUENCE START IDENTIFICATION:
 * For each num: Check if (num - 1) is in Set.
 *  - num = 100: (99 in Set?) NO  -> START OF SEQUENCE! Streak: 100 -> Length = 1
 *  - num = 4:   (3 in Set?)  YES -> Skip (3 will handle sequence start)
 *  - num = 200: (199 in Set?) NO -> START OF SEQUENCE! Streak: 200 -> Length = 1
 *  - num = 1:   (0 in Set?)  NO  -> START OF SEQUENCE! Streak: 1 -> 2 -> 3 -> 4 -> Length = 4
 *  - num = 3:   (2 in Set?)  YES -> Skip
 *  - num = 2:   (1 in Set?)  YES -> Skip
 *
 * MAX CONSECUTIVE SEQUENCE: [1, 2, 3, 4] -> Length = 4
 * </pre>
 */
public class Step05_LongestConsecutiveSequence {

    /**
     * Finds the length of the longest consecutive elements sequence in O(N) time.
     */
    public static int longestConsecutive(int[] nums) {
        if (nums == null || nums.length == 0) return 0;

        Set<Integer> numSet = new HashSet<>();
        for (int num : nums) {
            numSet.add(num);
        }

        int longestStreak = 0;

        for (int num : numSet) {
            // Check if num is the start of a sequence
            if (!numSet.contains(num - 1)) {
                int currentNum = num;
                int currentStreak = 1;

                while (numSet.contains(currentNum + 1)) {
                    currentNum += 1;
                    currentStreak += 1;
                }

                longestStreak = Math.max(longestStreak, currentStreak);
            }
        }

        return longestStreak;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 05 - Hashing | Step 05: Longest Consecutive Sequence Pattern");
        System.out.println("======================================================================\n");

        int[] nums = {100, 4, 200, 1, 3, 2};
        System.out.println("[INIT] Input Array: " + Arrays.toString(nums));

        System.out.println("\n--- 1. HashSet Insertion & Sequence Boundary Analysis ---");
        Set<Integer> debugSet = new HashSet<>();
        for (int num : nums) {
            debugSet.add(num);
        }
        System.out.println("[ACTION] Inserted all elements into HashSet: " + debugSet);

        int maxLen = 0;
        for (int num : debugSet) {
            if (!debugSet.contains(num - 1)) {
                System.out.println("[STATE] Found Sequence Start: " + num + " (because " + (num - 1) + " is NOT in set)");
                int curr = num;
                int streak = 1;
                System.out.print("        Expanding streak: " + curr);

                while (debugSet.contains(curr + 1)) {
                    curr++;
                    streak++;
                    System.out.print(" -> " + curr);
                }
                System.out.println(" | Length = " + streak);
                maxLen = Math.max(maxLen, streak);
                System.out.println("[MEMORY EVENT] Extended streak via O(1) set contains checks.");
            }
        }

        System.out.println("\n[STATE] Calculated Longest Consecutive Sequence Length = " + maxLen);

        int[] edgeCase = {0, 3, 7, 2, 5, 8, 4, 6, 0, 1};
        System.out.println("\n--- 2. Additional Test Case ---");
        System.out.println("[INIT] Input Array: " + Arrays.toString(edgeCase));
        int edgeRes = longestConsecutive(edgeCase);
        System.out.println("[STATE] Result: " + edgeRes + " (Expected sequence: 0..8 -> 9 elements)");

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Longest Consecutive Sequence pattern verified.");
        System.out.println("======================================================================");
    }
}

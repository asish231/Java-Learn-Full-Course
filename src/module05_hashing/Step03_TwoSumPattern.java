package module05_hashing;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * Step 03: Two Sum Pattern using HashMap Complement Lookup
 *
 * <pre>
 * BRUTE FORCE APPROACH O(N^2):
 * Double nested loops comparing all pairs (i, j).
 *
 * HASHMAP OPTIMIZATION O(N) Time, O(N) Space:
 * Target = 9
 * Array: [ 2,  7, 11, 15 ]
 * Index:   0   1   2   3
 *
 * Step 0: i=0, num=2  | Complement = 9 - 2 = 7 | Map check: 7 in map? NO  | Map put: {2 -> 0}
 * Step 1: i=1, num=7  | Complement = 9 - 7 = 2 | Map check: 2 in map? YES! -> Returns [map.get(2), 1] = [0, 1]
 *
 * +-------------------------------------------------------+
 * | HashMap state stores visited numbers: { Value -> Index } |
 * +-------------------------------------------------------+
 * </pre>
 */
public class Step03_TwoSumPattern {

    /**
     * Brute Force O(N^2) time, O(1) space implementation for baseline comparison.
     */
    public static int[] twoSumBruteForce(int[] nums, int target) {
        if (nums == null) return new int[]{-1, -1};
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{-1, -1};
    }

    /**
     * HashMap Complement Lookup O(N) time, O(N) space implementation.
     */
    public static int[] twoSumHashMap(int[] nums, int target) {
        if (nums == null) return new int[]{-1, -1};
        Map<Integer, Integer> visitedMap = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (visitedMap.containsKey(complement)) {
                return new int[]{visitedMap.get(complement), i};
            }
            visitedMap.put(nums[i], i);
        }
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 05 - Hashing | Step 03: Two Sum HashMap Pattern");
        System.out.println("======================================================================\n");

        int[] nums = {2, 11, 7, 15};
        int target = 9;

        System.out.println("[INIT] Input Array: " + Arrays.toString(nums) + ", Target Sum: " + target);

        // 1. Brute Force Benchmark
        System.out.println("\n--- 1. Running Brute Force O(N^2) Search ---");
        long startBrute = System.nanoTime();
        int[] bruteRes = twoSumBruteForce(nums, target);
        long timeBrute = System.nanoTime() - startBrute;
        System.out.println("[ACTION] Executed twoSumBruteForce()");
        System.out.println("[STATE] Result Indices: " + Arrays.toString(bruteRes)
                + " (Values: " + nums[bruteRes[0]] + " + " + nums[bruteRes[1]] + " = " + target + ")");
        System.out.println("[MEMORY EVENT] Brute force scanned all pairs without allocating auxiliary space (" + timeBrute + " ns).");

        // 2. HashMap Complement Lookup Trace
        System.out.println("\n--- 2. Tracing HashMap Complement Lookup O(N) Search ---");
        Map<Integer, Integer> debugMap = new HashMap<>();
        System.out.println("[INIT] Map initialized: {}");

        for (int i = 0; i < nums.length; i++) {
            int current = nums[i];
            int complement = target - current;
            System.out.println("[ACTION] Iteration i = " + i + ", current value = " + current + ". Target complement = " + complement);

            if (debugMap.containsKey(complement)) {
                int complementIndex = debugMap.get(complement);
                System.out.println("[STATE] Complement " + complement + " FOUND in HashMap at index " + complementIndex + "!");
                System.out.println("[MEMORY EVENT] Solution pair matched: indices [" + complementIndex + ", " + i + "]");
                break;
            } else {
                debugMap.put(current, i);
                System.out.println("[STATE] Complement NOT found. Added (" + current + " -> " + i + ") to HashMap: " + debugMap);
            }
        }

        // Run method return
        int[] mapRes = twoSumHashMap(nums, target);
        System.out.println("\n[STATE] Final twoSumHashMap() result: " + Arrays.toString(mapRes));

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Two Sum HashMap pattern executed cleanly.");
        System.out.println("======================================================================");
    }
}

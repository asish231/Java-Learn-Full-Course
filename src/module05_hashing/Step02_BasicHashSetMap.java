package module05_hashing;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Step 02: Basic HashSet, HashMap Usage and Frequency Array Pattern
 *
 * <pre>
 * ARRAY FREQUENCY COUNTING (Fixed Alphabet/Domain):
 * String: "abracadabra"
 * Index:  [ 0 ] [ 1 ] [ 2 ] [ 3 ] ... [ 17 ] ... [ 25 ] (for 'a'..'z')
 * Count:  [ 5 ] [ 2 ] [ 1 ] [ 1 ] ... [  2 ] ... [  0 ]
 *           'a'   'b'   'c'   'd'        'r'
 *
 * HASHMAP FREQUENCY COUNTING (Arbitrary Keys):
 * Map: { "apple" -> 3, "banana" -> 2, "cherry" -> 1 }
 * Key "apple"  ---> Lookup in O(1) avg ---> Increments Count
 *
 * HASHSET UNIQUENESS GUARANTEE:
 * Elements: [10, 20, 10, 30, 20]
 * Set State: {10, 20, 30} (Duplicates filtered out via hashCode + equals check)
 * </pre>
 */
public class Step02_BasicHashSetMap {

    /**
     * Frequency counting using fixed array (O(1) space for 26 lowercase English letters).
     */
    public static int[] countCharFrequencyArray(String input) {
        int[] freq = new int[26];
        if (input == null) return freq;
        for (int i = 0; i < input.length(); i++) {
            char ch = input.charAt(i);
            if (ch >= 'a' && ch <= 'z') {
                freq[ch - 'a']++;
            }
        }
        return freq;
    }

    /**
     * Frequency counting using HashMap for arbitrary string tokens.
     */
    public static Map<String, Integer> countWordFrequencyMap(String[] words) {
        Map<String, Integer> freqMap = new HashMap<>();
        if (words == null) return freqMap;
        for (String word : words) {
            freqMap.put(word, freqMap.getOrDefault(word, 0) + 1);
        }
        return freqMap;
    }

    /**
     * Filters duplicates from an array using HashSet.
     */
    public static int[] findUniqueElements(int[] nums) {
        if (nums == null) return new int[0];
        Set<Integer> uniqueSet = new HashSet<>();
        for (int num : nums) {
            uniqueSet.add(num);
        }
        int[] result = new int[uniqueSet.size()];
        int idx = 0;
        for (int num : uniqueSet) {
            result[idx++] = num;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 05 - Hashing | Step 02: Basic HashSet, HashMap & Frequency Patterns");
        System.out.println("======================================================================\n");

        // 1. Array Frequency Counting Demo
        String text = "abracadabra";
        System.out.println("[INIT] Input String for Array Frequency Counter: \"" + text + "\"");
        System.out.println("[ACTION] Counting frequencies using char array offset (ch - 'a')...");
        int[] charFreq = countCharFrequencyArray(text);

        System.out.println("[STATE] Non-zero character frequencies:");
        for (int i = 0; i < 26; i++) {
            if (charFreq[i] > 0) {
                char ch = (char) ('a' + i);
                System.out.println("        Character '" + ch + "': " + charFreq[i] + " occurrence(s)");
            }
        }
        System.out.println("[MEMORY EVENT] Direct index offset arr[ch - 'a'] calculated in O(1) space & O(N) time.");

        // 2. HashMap Word Frequency Demo
        System.out.println("\n--- 2. HashMap Word Frequency Counter ---");
        String[] words = {"apple", "banana", "apple", "cherry", "banana", "apple"};
        System.out.println("[INIT] Input Words Array: " + Arrays.toString(words));
        System.out.println("[ACTION] Populating HashMap frequency count...");
        Map<String, Integer> wordCounts = countWordFrequencyMap(words);

        System.out.println("[STATE] HashMap contents: " + wordCounts);
        for (Map.Entry<String, Integer> entry : wordCounts.entrySet()) {
            System.out.println("        Key: \"" + entry.getKey() + "\" -> Frequency: " + entry.getValue());
        }

        // 3. HashSet Uniqueness Demo
        System.out.println("\n--- 3. HashSet Uniqueness Filtering ---");
        int[] duplicates = {10, 20, 10, 30, 20, 40, 10, 50};
        System.out.println("[INIT] Array with duplicates: " + Arrays.toString(duplicates));
        System.out.println("[ACTION] Deduplicating array using HashSet...");
        int[] unique = findUniqueElements(duplicates);

        System.out.println("[STATE] Unique elements extracted: " + Arrays.toString(unique));
        System.out.println("[MEMORY EVENT] HashSet prevented duplicates using internal HashMap hash bucket checks.");

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Basic HashSet and HashMap patterns demonstrated.");
        System.out.println("======================================================================");
    }
}

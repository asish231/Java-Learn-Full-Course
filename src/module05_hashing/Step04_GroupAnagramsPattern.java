package module05_hashing;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Step 04: Group Anagrams Pattern using Key Encoding Strategies
 *
 * <pre>
 * ANAGRAM GROUPING MECHANISM:
 * Words: ["eat", "tea", "tan", "ate", "nat", "bat"]
 *
 * STRATEGY 1: SORTED STRING KEY
 *  - "eat" -> sort chars -> "aet" \
 *  - "tea" -> sort chars -> "aet"  |---> HashMap Key: "aet" -> List ["eat", "tea", "ate"]
 *  - "ate" -> sort chars -> "aet" /
 *
 * STRATEGY 2: FREQUENCY ARRAY KEY (26 lowercase count string)
 *  - "eat" -> frequency count -> "1,0,0,0,1,...,1" ---> HashMap Key -> List ["eat", "tea", "ate"]
 *
 * MAP STRUCTURE:
 * Key (Canonical Representative) ---> Value (List of Anagrams)
 * "aet"                          ---> ["eat", "tea", "ate"]
 * "ant"                          ---> ["tan", "nat"]
 * "abt"                          ---> ["bat"]
 * </pre>
 */
public class Step04_GroupAnagramsPattern {

    /**
     * Strategy 1: Group Anagrams using Sorted Character Array as Map Key.
     * Time Complexity: O(N * K log K) where N = number of strings, K = max length of string.
     */
    public static List<List<String>> groupAnagramsSortedKey(String[] strs) {
        if (strs == null || strs.length == 0) return new ArrayList<>();
        Map<String, List<String>> map = new HashMap<>();

        for (String s : strs) {
            char[] charArray = s.toCharArray();
            Arrays.sort(charArray);
            String key = new String(charArray);

            if (!map.containsKey(key)) {
                map.put(key, new ArrayList<>());
            }
            map.get(key).add(s);
        }
        return new ArrayList<>(map.values());
    }

    /**
     * Strategy 2: Group Anagrams using Frequency Encoding as Map Key.
     * Time Complexity: O(N * K) where N = number of strings, K = max length of string.
     */
    public static List<List<String>> groupAnagramsFrequencyKey(String[] strs) {
        if (strs == null || strs.length == 0) return new ArrayList<>();
        Map<String, List<String>> map = new HashMap<>();

        for (String s : strs) {
            int[] count = new int[26];
            for (int i = 0; i < s.length(); i++) {
                count[s.charAt(i) - 'a']++;
            }

            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 26; i++) {
                sb.append('#').append(count[i]);
            }
            String key = sb.toString();

            if (!map.containsKey(key)) {
                map.put(key, new ArrayList<>());
            }
            map.get(key).add(s);
        }
        return new ArrayList<>(map.values());
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 05 - Hashing | Step 04: Group Anagrams Pattern");
        System.out.println("======================================================================\n");

        String[] words = {"eat", "tea", "tan", "ate", "nat", "bat"};
        System.out.println("[INIT] Input Words: " + Arrays.toString(words));

        // 1. Sorted Key Method Demo
        System.out.println("\n--- 1. Strategy 1: Sorted Character Array Key ---");
        System.out.println("[ACTION] Processing strings with groupAnagramsSortedKey()...");
        List<List<String>> groupedSorted = groupAnagramsSortedKey(words);

        System.out.println("[STATE] Grouped Anagrams Result:");
        for (List<String> group : groupedSorted) {
            System.out.println("        " + group);
        }
        System.out.println("[MEMORY EVENT] Character sorting normalized words into canonical keys (e.g., \"eat\" -> \"aet\").");

        // 2. Frequency Key Method Trace
        System.out.println("\n--- 2. Strategy 2: 26-Letter Frequency Key ---");
        System.out.println("[ACTION] Processing strings with groupAnagramsFrequencyKey()...");
        List<List<String>> groupedFreq = groupAnagramsFrequencyKey(words);

        System.out.println("[STATE] Grouped Anagrams Result:");
        for (List<String> group : groupedFreq) {
            System.out.println("        " + group);
        }
        System.out.println("[MEMORY EVENT] Frequency array key avoided sorting for linear time key encoding O(N * K).");

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Group Anagrams pattern executed cleanly.");
        System.out.println("======================================================================");
    }
}

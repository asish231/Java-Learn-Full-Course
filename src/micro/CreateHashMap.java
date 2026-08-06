package micro;

import java.util.HashMap;
import java.util.Map;

/**
 * 💡 MICRO TUTORIAL: Java HashMap (Key-Value Pair Store)
 * 
 * Mechanics: Converts key -> hashCode() -> index in array bucket.
 * Time Complexities:
 * - Insert (put): O(1) average
 * - Lookup (get): O(1) average
 * - Contains (containsKey): O(1) average
 */
public class CreateHashMap {
    public static void main(String[] args) {
        // 1. Create HashMap (Key type String, Value type Integer)
        Map<String, Integer> map = new HashMap<>();

        // 2. Put (Insert or Update) - O(1)
        map.put("Alice", 95);
        map.put("Bob", 88);
        map.put("Alice", 100); // Overwrites 95 with 100

        // 3. Get value & Safe default - O(1)
        int score = map.get("Alice");                  // 100
        int fallback = map.getOrDefault("Unknown", 0);  // 0

        // 4. Frequency Counting Pattern (Crucial for Interviews!)
        String[] words = {"apple", "banana", "apple"};
        Map<String, Integer> freqMap = new HashMap<>();
        for (String w : words) {
            freqMap.put(w, freqMap.getOrDefault(w, 0) + 1);
        }

        System.out.println("Alice Score: " + score);
        System.out.println("Word Frequencies: " + freqMap); // {apple=2, banana=1}
    }
}

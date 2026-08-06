package quickstart;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Minimal example of creating and using HashMap and HashSet in Java.
 */
public class HashMapAndSetQuickstart {
    public static void main(String[] args) {
        // 1. HashMap (Key -> Value Mapping)
        Map<String, Integer> studentScores = new HashMap<>();
        studentScores.put("Alice", 95);
        studentScores.put("Bob", 88);
        studentScores.put("Charlie", 92);

        System.out.println("Alice's score: " + studentScores.get("Alice"));
        System.out.println("Contains key 'Bob'? " + studentScores.containsKey("Bob"));

        // 2. HashSet (Unique Elements Only)
        Set<Integer> uniqueIds = new HashSet<>();
        uniqueIds.add(101);
        uniqueIds.add(102);
        uniqueIds.add(101); // Duplicate ignored

        System.out.println("\nHashSet unique elements count: " + uniqueIds.size());
        System.out.println("Contains 102? " + uniqueIds.contains(102));
    }
}

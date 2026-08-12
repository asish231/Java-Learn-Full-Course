package low_level_design;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * LLD: LRU cache as a design, not only LC 146.
 * Hash map for O(1) lookup + insertion-order map (or a doubly linked list) for recency.
 */
public class LruCacheDesign {

    static class Lru {
        private final int cap;
        private final LinkedHashMap<Integer, Integer> map;

        Lru(int cap) {
            this.cap = cap;
            this.map = new LinkedHashMap<>(cap, 0.75f, true);
        }

        int get(int key) {
            return map.getOrDefault(key, -1);
        }

        void put(int key, int value) {
            map.put(key, value);
            if (map.size() > cap) {
                Integer oldest = map.keySet().iterator().next();
                map.remove(oldest);
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("=== LLD: LRU Cache ===");
        Lru cache = new Lru(2);
        cache.put(1, 1);
        cache.put(2, 2);
        System.out.println("get 1 -> " + cache.get(1));
        cache.put(3, 3);
        System.out.println("get 2 (evicted) -> " + cache.get(2));
        System.out.println("Talk: access-order LinkedHashMap is the JDK shortcut. In an interview, draw HashMap + DLL.");
        System.out.println("Thread safety: wrap with a lock, or use a concurrent map and accept approximate LRU.");
    }
}

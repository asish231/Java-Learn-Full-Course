package backend_engineering;

import java.util.*;

/**
 * 05. Redis In-Memory Cache Engine & Cache-Aside pattern.
 * Demonstrates Key-Value storage, TTL (Time-To-Live) expiration, and LRU (Least Recently Used) eviction policy.
 */
public class RedisCacheEngine {

    public static class CacheItem {
        public String value;
        public long expireTimeMs; // System time when item expires

        public CacheItem(String val, long ttlMs) {
            this.value = val;
            this.expireTimeMs = ttlMs > 0 ? System.currentTimeMillis() + ttlMs : -1;
        }

        public boolean isExpired() {
            return expireTimeMs != -1 && System.currentTimeMillis() > expireTimeMs;
        }
    }

    public static class RedisCache {
        private final int capacity;
        private final Map<String, CacheItem> store = new LinkedHashMap<>(16, 0.75f, true);

        public RedisCache(int capacity) {
            this.capacity = capacity;
        }

        public synchronized String get(String key) {
            CacheItem item = store.get(key);
            if (item == null) {
                System.out.println("⚡ [Redis Cache MISS] Key not found: " + key);
                return null;
            }
            if (item.isExpired()) {
                System.out.println("⏳ [Redis Cache EXPIRED] Key expired: " + key);
                store.remove(key);
                return null;
            }
            System.out.println("🎯 [Redis Cache HIT] Key found: " + key + " -> " + item.value);
            return item.value;
        }

        public synchronized void set(String key, String value, long ttlMs) {
            if (store.size() >= capacity && !store.containsKey(key)) {
                // Evict LRU item (first key in LinkedHashMap access order)
                String lruKey = store.keySet().iterator().next();
                System.out.println("🔥 [Redis LRU Eviction] Evicting least recently used key: " + lruKey);
                store.remove(lruKey);
            }
            store.put(key, new CacheItem(value, ttlMs));
            System.out.println("💾 [Redis SET] Key stored: " + key + " (TTL: " + ttlMs + "ms)");
        }
    }

    public static void main(String[] args) {
        System.out.println("=== 🚀 05. Redis In-Memory Cache Engine & Cache-Aside ===");

        RedisCache cache = new RedisCache(2); // Capacity = 2 items

        // 1. Set key with 2000ms TTL
        cache.set("user:101", "{\"name\":\"Alice\",\"role\":\"Admin\"}", 2000);
        cache.set("user:102", "{\"name\":\"Bob\",\"role\":\"Developer\"}", 5000);

        // 2. Cache Hit
        cache.get("user:101");

        // 3. Trigger LRU Eviction (adding 3rd item when capacity = 2)
        cache.set("user:103", "{\"name\":\"Charlie\",\"role\":\"Tester\"}", 5000); // Evicts user:102 because user:101 was accessed recently!

        // 4. Verification
        System.out.println("\nChecking evicted key user:102:");
        cache.get("user:102"); // MISS

        System.out.println("\nChecking active key user:101:");
        cache.get("user:101"); // HIT
    }
}

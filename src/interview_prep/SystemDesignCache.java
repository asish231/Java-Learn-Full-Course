package interview_prep;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * System design: cache. Cache-aside, TTL, stampede, and what you invalidate.
 */
public class SystemDesignCache {

    static class CacheAside {
        private final Map<String, String> l1 = new LinkedHashMap<>();
        private final Map<String, String> db;

        CacheAside(Map<String, String> db) { this.db = db; }

        String get(String key) {
            if (l1.containsKey(key)) return l1.get(key);
            String v = db.get(key);
            if (v != null) l1.put(key, v);
            return v;
        }

        void put(String key, String value) {
            db.put(key, value);
            l1.remove(key); // invalidate; next read fills
        }
    }

    public static void main(String[] args) {
        System.out.println("=== System Design: Cache ===");
        Map<String, String> db = new LinkedHashMap<>();
        db.put("user:1", "Ada");
        CacheAside cache = new CacheAside(db);
        System.out.println("miss then hit: " + cache.get("user:1") + ", " + cache.get("user:1"));
        cache.put("user:1", "Ada Lovelace");
        System.out.println("after write-invalidate: " + cache.get("user:1"));
        System.out.println("Stampede: when a hot key expires, one locker fills, others wait (or serve stale).");
        System.out.println("TTL vs explicit invalidate: TTL for derived data, invalidate for source-of-truth writes.");
        System.out.println("Say what is cached (session, profile, feed) and what must never be (permissions you just revoked).");
    }
}

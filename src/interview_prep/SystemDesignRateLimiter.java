package interview_prep;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashMap;
import java.util.Map;

/**
 * System design + code: token-bucket rate limiter.
 * Used for API gateways, login, and interview "design a limiter" prompts.
 */
public class SystemDesignRateLimiter {

    public static class TokenBucket {
        private final int capacity;
        private final double refillPerMs;
        private double tokens;
        private long lastMs;

        public TokenBucket(int capacity, double perSecond) {
            this.capacity = capacity;
            this.refillPerMs = perSecond / 1000.0;
            this.tokens = capacity;
            this.lastMs = System.currentTimeMillis();
        }

        public synchronized boolean allow() {
            long now = System.currentTimeMillis();
            tokens = Math.min(capacity, tokens + (now - lastMs) * refillPerMs);
            lastMs = now;
            if (tokens < 1) return false;
            tokens -= 1;
            return true;
        }
    }

    public static class SlidingWindow {
        private final int limit;
        private final long windowMs;
        private final Deque<Long> hits = new ArrayDeque<>();

        public SlidingWindow(int limit, long windowMs) {
            this.limit = limit;
            this.windowMs = windowMs;
        }

        public synchronized boolean allow(long now) {
            while (!hits.isEmpty() && now - hits.peekFirst() >= windowMs) hits.pollFirst();
            if (hits.size() >= limit) return false;
            hits.addLast(now);
            return true;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== System Design: Rate Limiter ===");
        TokenBucket bucket = new TokenBucket(3, 3);
        int allowed = 0;
        for (int i = 0; i < 6; i++) if (bucket.allow()) allowed++;
        System.out.println("Token bucket allowed " + allowed + " of 6 immediate requests (capacity 3).");

        SlidingWindow window = new SlidingWindow(2, 1000);
        System.out.println("Sliding window: " + window.allow(0) + ", " + window.allow(10) + ", " + window.allow(20));
        System.out.println("Interview: put the limiter at the edge (gateway), key by user+route, return 429 + Retry-After.");
        Map<String, String> headers = new HashMap<>();
        headers.put("Retry-After", "1");
        System.out.println("Example 429 headers: " + headers);
    }
}

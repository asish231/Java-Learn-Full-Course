package cs_fundamentals;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Interview concurrency patterns: thread pool, bounded queue, immutability.
 * Do not start a raw Thread per request.
 */
public class ConcurrencyPatterns {

    public static int runPool(int jobs) throws InterruptedException {
        AtomicInteger done = new AtomicInteger();
        BlockingQueue<Integer> q = new ArrayBlockingQueue<>(8);
        ExecutorService pool = Executors.newFixedThreadPool(2);
        pool.submit(() -> {
            try {
                for (int i = 0; i < jobs; i++) q.put(i);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
        for (int w = 0; w < 2; w++) {
            pool.submit(() -> {
                try {
                    while (true) {
                        Integer job = q.poll(50, TimeUnit.MILLISECONDS);
                        if (job == null) return;
                        done.incrementAndGet();
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            });
        }
        pool.shutdown();
        pool.awaitTermination(2, TimeUnit.SECONDS);
        return done.get();
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Concurrency patterns ===");
        System.out.println("Processed " + runPool(20) + " jobs on a 2-thread pool + bounded queue.");
        System.out.println("Prefer: ExecutorService, ConcurrentHashMap, AtomicInteger, immutable messages.");
        System.out.println("Avoid: Thread per request, unsynchronized ArrayList across threads, nested locks.");
        System.out.println("Happens-before: a volatile write / unlock is visible to the next read / lock.");
    }
}

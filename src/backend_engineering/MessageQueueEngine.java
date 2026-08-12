package backend_engineering;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;

/**
 * In-process message queue: producer, bounded buffer, consumer workers.
 *
 * This is the same idea as Kafka/SQS/RabbitMQ at interview level — a queue
 * decouples the request path from slow work — without needing a broker.
 */
public class MessageQueueEngine {

    public static class Job {
        public final String type;
        public final String payload;
        public Job(String type, String payload) { this.type = type; this.payload = payload; }
        @Override public String toString() { return type + ":" + payload; }
    }

    public static class Worker implements Runnable {
        private final BlockingQueue<Job> queue;
        private final List<String> processed;
        public Worker(BlockingQueue<Job> queue, List<String> processed) {
            this.queue = queue;
            this.processed = processed;
        }
        @Override
        public void run() {
            try {
                Job job;
                while ((job = queue.poll(200, TimeUnit.MILLISECONDS)) != null) {
                    processed.add("handled " + job);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Message Queue (in-process) ===");
        BlockingQueue<Job> queue = new ArrayBlockingQueue<>(8);
        List<String> processed = new ArrayList<>();

        queue.put(new Job("email", "welcome@user"));
        queue.put(new Job("index", "doc-42"));
        queue.put(new Job("webhook", "payment.ok"));

        Thread worker = new Thread(new Worker(queue, processed), "worker-1");
        worker.start();
        worker.join();

        System.out.println("Processed " + processed.size() + " jobs:");
        for (String line : processed) System.out.println("  " + line);
        System.out.println("Queue remaining: " + queue.size());
        System.out.println("Interview takeaway: put slow work on a queue so the HTTP handler can return 202 quickly.");
    }
}

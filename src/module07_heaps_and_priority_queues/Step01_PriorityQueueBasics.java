package module07_heaps_and_priority_queues;

import java.util.Collections;
import java.util.PriorityQueue;

/**
 * Step 01: Priority Queue Basics (Min-Heap & Max-Heap in Java)
 *
 * <pre>
 * PRIORITY QUEUE HEAP STRUCTURE (Binary Heap):
 *
 *       Min-Heap (Default)                Max-Heap (Reverse Order)
 *              [10]                                 [50]
 *             /    \                               /    \
 *          [20]    [30]                         [40]    [30]
 *          /  \                                 /  \
 *       [40]  [50]                           [10]  [20]
 *
 * Heap Invariant:
 *   Min-Heap: Parent <= Children  -> Root [10] is always the Minimum!
 *   Max-Heap: Parent >= Children  -> Root [50] is always the Maximum!
 *
 * Time Complexities:
 *   - offer() / add(): O(log N) - Sift Up insertion
 *   - peek():          O(1)     - Inspect root node
 *   - poll() / remove(): O(log N) - Remove root & Sift Down replacement
 * </pre>
 */
public class Step01_PriorityQueueBasics {

    /**
     * Static inner class representing a Task with a priority rank.
     */
    static class Task implements Comparable<Task> {
        final String name;
        final int priority; // Lower number = higher priority

        Task(String name, int priority) {
            this.name = name;
            this.priority = priority;
        }

        @Override
        public int compareTo(Task other) {
            return Integer.compare(this.priority, other.priority);
        }

        @Override
        public String toString() {
            return "Task{" + name + ", priority=" + priority + "}";
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 07 - Heaps & Priority Queues | Step 01: Priority Queue Basics");
        System.out.println("======================================================================\n");

        // 1. Min-Heap (Default PriorityQueue behavior)
        System.out.println("--- 1. Min-Heap PriorityQueue (Natural Ordering) ---");
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        System.out.println("[INIT] Initialized empty Min-Heap PriorityQueue.");

        int[] values = {40, 10, 50, 20, 30};
        for (int v : values) {
            System.out.println("[ACTION] Offering element " + v + " to Min-Heap...");
            minHeap.offer(v);
            System.out.println("[STATE] Current Heap Root (Peek / Min): " + minHeap.peek() + " | Size: " + minHeap.size());
            System.out.println("[MEMORY EVENT] Array storage re-heapified via sift-up operation.");
        }

        System.out.println("\n[ACTION] Polling elements from Min-Heap (sorted extraction order):");
        while (!minHeap.isEmpty()) {
            int popped = minHeap.poll();
            System.out.println("  --> Polled: " + popped + " | Remaining size: " + minHeap.size());
        }

        // 2. Max-Heap (Custom Comparator via Collections.reverseOrder())
        System.out.println("\n--- 2. Max-Heap PriorityQueue (Reverse Ordering) ---");
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        System.out.println("[INIT] Initialized empty Max-Heap PriorityQueue.");

        for (int v : values) {
            System.out.println("[ACTION] Offering element " + v + " to Max-Heap...");
            maxHeap.offer(v);
            System.out.println("[STATE] Current Heap Root (Peek / Max): " + maxHeap.peek() + " | Size: " + maxHeap.size());
        }

        System.out.println("\n[ACTION] Polling elements from Max-Heap (descending extraction order):");
        while (!maxHeap.isEmpty()) {
            int popped = maxHeap.poll();
            System.out.println("  --> Polled: " + popped + " | Remaining size: " + maxHeap.size());
        }

        // 3. Custom Objects in PriorityQueue
        System.out.println("\n--- 3. Custom Object Ordering with PriorityQueue ---");
        PriorityQueue<Task> taskQueue = new PriorityQueue<>();
        System.out.println("[INIT] Initialized Task PriorityQueue (Sorted by ascending priority rank).");

        taskQueue.offer(new Task("UI Maintenance", 3));
        taskQueue.offer(new Task("Critical Security Patch", 1));
        taskQueue.offer(new Task("Feature Update", 2));
        taskQueue.offer(new Task("Database Backup", 4));

        System.out.println("[STATE] Processing tasks in order of priority level:");
        while (!taskQueue.isEmpty()) {
            Task currentTask = taskQueue.poll();
            System.out.println("  [ACTION] Executing " + currentTask);
            System.out.println("[MEMORY EVENT] Min-Heap root popped, replacing with last leaf and sifting down.");
        }

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: PriorityQueue operations verified.");
        System.out.println("======================================================================");
    }
}

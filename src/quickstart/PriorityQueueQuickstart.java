package quickstart;

import java.util.PriorityQueue;

/**
 * Minimal example of creating Min-Heap and Max-Heap using PriorityQueue in Java.
 */
public class PriorityQueueQuickstart {
    public static void main(String[] args) {
        // 1. Min-Heap (Default: Smallest element comes out first)
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        minHeap.offer(50);
        minHeap.offer(10);
        minHeap.offer(30);

        System.out.println("Min-Heap root (smallest): " + minHeap.poll()); // 10

        // 2. Max-Heap (Largest element comes out first)
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> Integer.compare(b, a));
        maxHeap.offer(50);
        maxHeap.offer(10);
        maxHeap.offer(30);

        System.out.println("Max-Heap root (largest): " + maxHeap.poll()); // 50
    }
}

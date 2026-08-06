package micro;

import java.util.PriorityQueue;

/**
 * 💡 MICRO TUTORIAL: PriorityQueue (Min-Heap & Max-Heap)
 * 
 * Heap Invariant: Root element is always min (or max).
 * Time Complexities:
 * - Insert (offer): O(log N)
 * - Extract (poll): O(log N)
 * - Peek root: O(1)
 */
public class CreatePriorityQueue {
    public static void main(String[] args) {
        // 1. Min-Heap (Default: Ascending order extraction)
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        minHeap.offer(40);
        minHeap.offer(10);
        minHeap.offer(25);
        int min = minHeap.poll(); // 10

        // 2. Max-Heap (Descending order extraction)
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> Integer.compare(b, a));
        maxHeap.offer(40);
        maxHeap.offer(10);
        maxHeap.offer(25);
        int max = maxHeap.poll(); // 40

        System.out.println("Extracted Min: " + min);
        System.out.println("Extracted Max: " + max);
    }
}

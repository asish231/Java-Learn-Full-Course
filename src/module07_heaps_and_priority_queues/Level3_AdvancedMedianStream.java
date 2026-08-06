package module07_heaps_and_priority_queues;

import java.util.Collections;
import java.util.PriorityQueue;

/**
 * LEVEL 3 (ADVANCED / FAANG): Find Median from Data Stream (LeetCode 295 - Hard)
 * Dual Heaps Strategy: Max-Heap for lower half, Min-Heap for upper half.
 * Time Complexity: O(log N) insertion, O(1) median query.
 */
public class Level3_AdvancedMedianStream {

    private final PriorityQueue<Integer> maxHeap; // Lower half elements
    private final PriorityQueue<Integer> minHeap; // Upper half elements

    public Level3_AdvancedMedianStream() {
        this.maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        this.minHeap = new PriorityQueue<>();
    }

    public void addNum(int num) {
        if (maxHeap.isEmpty() || num <= maxHeap.peek()) {
            maxHeap.offer(num);
        } else {
            minHeap.offer(num);
        }

        // Rebalance heaps so size difference <= 1
        if (maxHeap.size() > minHeap.size() + 1) {
            minHeap.offer(maxHeap.poll());
        } else if (minHeap.size() > maxHeap.size()) {
            maxHeap.offer(minHeap.poll());
        }
    }

    public double findMedian() {
        if (maxHeap.size() > minHeap.size()) {
            return maxHeap.peek();
        } else {
            return (maxHeap.peek() + minHeap.peek()) / 2.0;
        }
    }

    public static void main(String[] args) {
        System.out.println("--- Module 07: Level 3 (Advanced Dual Heap Median Finder Hard) ---");
        Level3_AdvancedMedianStream finder = new Level3_AdvancedMedianStream();
        finder.addNum(1);
        finder.addNum(2);
        System.out.println("Median after [1, 2]: " + finder.findMedian()); // 1.5

        finder.addNum(3);
        System.out.println("Median after [1, 2, 3]: " + finder.findMedian()); // 2.0
    }
}

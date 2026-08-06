package module07_heaps_and_priority_queues;

import java.util.PriorityQueue;

/**
 * LEVEL 1 (BASIC): Kth Largest Element in an Array (LeetCode 215)
 * Uses Min-Heap of size K to solve in O(N log K) time.
 */
public class Level1_BasicHeap {

    public static int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        for (int num : nums) {
            minHeap.offer(num);
            if (minHeap.size() > k) {
                minHeap.poll(); // Keep heap size at K
            }
        }
        return minHeap.peek();
    }

    public static void main(String[] args) {
        System.out.println("--- Module 07: Level 1 (Basic Heap Operations) ---");
        int[] nums = {3, 2, 1, 5, 6, 4};
        int k = 2;
        System.out.println("Kth (K=" + k + ") Largest element: " + findKthLargest(nums, k)); // 5
    }
}

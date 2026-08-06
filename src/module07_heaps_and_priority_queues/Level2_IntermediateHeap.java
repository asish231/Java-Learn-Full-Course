package module07_heaps_and_priority_queues;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.PriorityQueue;

/**
 * LEVEL 2 (INTERMEDIATE): Top K Frequent Elements (LeetCode 347 - Medium)
 */
public class Level2_IntermediateHeap {

    public static int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> countMap = new HashMap<>();
        for (int num : nums) countMap.put(num, countMap.getOrDefault(num, 0) + 1);

        // Min-Heap sorting entries by frequency ascending
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));

        for (Map.Entry<Integer, Integer> entry : countMap.entrySet()) {
            heap.offer(new int[]{entry.getKey(), entry.getValue()});
            if (heap.size() > k) {
                heap.poll();
            }
        }

        int[] result = new int[k];
        for (int i = 0; i < k; i++) {
            result[i] = heap.poll()[0];
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println("--- Module 07: Level 2 (Intermediate Top K Frequent) ---");
        int[] nums = {1, 1, 1, 2, 2, 3};
        int k = 2;
        System.out.println("Top " + k + " Frequent elements: " + Arrays.toString(topKFrequent(nums, k))); // [2, 1]
    }
}

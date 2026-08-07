package module07_heaps_and_priority_queues;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.PriorityQueue;

/**
 * Step 06: Top K Frequent Elements (Frequency Map + Size-K Min-Heap)
 *
 * <pre>
 * TOP K FREQUENT ELEMENTS PIPELINE:
 *
 * Input: [1, 1, 1, 2, 2, 3, 3, 3, 3, 4], K = 2
 *
 * Phase 1: Frequency Count Map
 *   1 -> 3 times
 *   2 -> 2 times
 *   3 -> 4 times
 *   4 -> 1 time
 *
 * Phase 2: Size-K=2 Min-Heap (Ordered by Frequency)
 *   Process 1 (freq 3): Heap = {(1, freq 3)}
 *   Process 2 (freq 2): Heap = {(2, freq 2), (1, freq 3)}
 *   Process 3 (freq 4): 4 > Min root (freq 2) -> Poll 2, Offer 3 -> Heap = {(1, freq 3), (3, freq 4)}
 *   Process 4 (freq 1): 1 < Min root (freq 3) -> Ignore 4
 *
 * Result Top 2 Frequent Elements: [1, 3]
 * </pre>
 */
public class Step06_TopKFrequentElements {

    /**
     * Helper static inner class to represent an element and its occurrence count.
     */
    static class ElementFrequency implements Comparable<ElementFrequency> {
        final int element;
        final int frequency;

        ElementFrequency(int element, int frequency) {
            this.element = element;
            this.frequency = frequency;
        }

        @Override
        public int compareTo(ElementFrequency other) {
            return Integer.compare(this.frequency, other.frequency);
        }

        @Override
        public String toString() {
            return "(" + element + ": freq=" + frequency + ")";
        }
    }

    public static int[] topKFrequent(int[] nums, int k) {
        // Step 1: Build frequency map
        Map<Integer, Integer> freqMap = new HashMap<>();
        for (int num : nums) {
            freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
        }
        System.out.println("[INIT] Calculated Frequency Map: " + freqMap);

        // Step 2: Min-Heap of size K (ordered by frequency)
        PriorityQueue<ElementFrequency> minHeap = new PriorityQueue<>(k);

        for (Map.Entry<Integer, Integer> entry : freqMap.entrySet()) {
            ElementFrequency ef = new ElementFrequency(entry.getKey(), entry.getValue());
            System.out.println("[ACTION] Processing candidate " + ef);

            if (minHeap.size() < k) {
                minHeap.offer(ef);
                System.out.println("[STATE] Heap size < K. Added -> Heap: " + minHeap);
            } else if (ef.frequency > minHeap.peek().frequency) {
                ElementFrequency evicted = minHeap.poll();
                minHeap.offer(ef);
                System.out.println("[MEMORY EVENT] Frequency " + ef.frequency + " > Min root " + evicted.frequency
                        + ". Evicted " + evicted + ", offered " + ef + " -> Heap: " + minHeap);
            } else {
                System.out.println("[STATE] Candidate frequency " + ef.frequency + " <= Min root. Ignored.");
            }
        }

        // Step 3: Extract top K elements into array
        int[] result = new int[k];
        int index = 0;
        while (!minHeap.isEmpty()) {
            result[index++] = minHeap.poll().element;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 07 - Heaps & Priority Queues | Step 06: Top K Frequent Elements");
        System.out.println("======================================================================\n");

        int[] nums = {1, 1, 1, 2, 2, 3, 3, 3, 3, 4};
        int k = 2;

        System.out.println("[INIT] Input Array: " + Arrays.toString(nums) + " | K = " + k);

        int[] result = topKFrequent(nums, k);

        System.out.println("\n======================================================================");
        System.out.println("RESULT: Top " + k + " Frequent Elements: " + Arrays.toString(result));
        System.out.println("======================================================================");
    }
}

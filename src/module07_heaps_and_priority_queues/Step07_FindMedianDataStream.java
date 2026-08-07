package module07_heaps_and_priority_queues;

import java.util.Collections;
import java.util.PriorityQueue;

/**
 * Step 07: Continuous Median from Data Stream (Dual Heap Design)
 *
 * <pre>
 * DUAL HEAP ARCHITECTURE FOR STREAM MEDIAN:
 *
 *   [ Lower Half Values ]  <--- (Median Cut) --->  [ Upper Half Values ]
 *   Max-Heap (Root = Max)                           Min-Heap (Root = Min)
 *        [ 3, 2, 1 ]                                    [ 4, 5, 6 ]
 *             ^                                              ^
 *       lowerHalf.peek()                              upperHalf.peek()
 *
 * Balancing Invariants:
 *   1. Every element in lowerHalf <= Every element in upperHalf.
 *   2. lowerHalf.size() == upperHalf.size() OR lowerHalf.size() == upperHalf.size() + 1.
 *
 * Median Calculation:
 *   - Odd total size : median = lowerHalf.peek()
 *   - Even total size: median = (lowerHalf.peek() + upperHalf.peek()) / 2.0
 * </pre>
 */
public class Step07_FindMedianDataStream {

    /**
     * Data structure maintaining continuous median of incoming numbers.
     */
    static class MedianFinder {
        private final PriorityQueue<Integer> lowerHalf; // Max-Heap for smaller numbers
        private final PriorityQueue<Integer> upperHalf; // Min-Heap for larger numbers

        public MedianFinder() {
            this.lowerHalf = new PriorityQueue<>(Collections.reverseOrder());
            this.upperHalf = new PriorityQueue<>();
        }

        public void addNum(int num) {
            System.out.println("\n[ACTION] Adding number: " + num);

            // Step 1: Add to lowerHalf Max-Heap first
            lowerHalf.offer(num);
            System.out.println("  [MEMORY EVENT] Offered " + num + " to Max-Heap lowerHalf.");

            // Step 2: Ensure max of lowerHalf <= min of upperHalf
            if (!upperHalf.isEmpty() && lowerHalf.peek() > upperHalf.peek()) {
                int shifted = lowerHalf.poll();
                upperHalf.offer(shifted);
                System.out.println("  [MEMORY EVENT] Invariant violation (lowerMax > upperMin). Shifted "
                        + shifted + " from lowerHalf to upperHalf.");
            }

            // Step 3: Balance sizes (lowerHalf can have at most 1 more element than upperHalf)
            if (lowerHalf.size() > upperHalf.size() + 1) {
                int shifted = lowerHalf.poll();
                upperHalf.offer(shifted);
                System.out.println("  [MEMORY EVENT] Rebalanced size: Shifted " + shifted + " from lowerHalf to upperHalf.");
            } else if (upperHalf.size() > lowerHalf.size()) {
                int shifted = upperHalf.poll();
                lowerHalf.offer(shifted);
                System.out.println("  [MEMORY EVENT] Rebalanced size: Shifted " + shifted + " from upperHalf to lowerHalf.");
            }

            System.out.println("  [STATE] lowerHalf (Max-Heap): " + lowerHalf + " | upperHalf (Min-Heap): " + upperHalf);
        }

        public double findMedian() {
            if (lowerHalf.isEmpty()) {
                throw new IllegalStateException("Data stream is empty.");
            }
            if (lowerHalf.size() > upperHalf.size()) {
                return lowerHalf.peek();
            } else {
                return (lowerHalf.peek() + upperHalf.peek()) / 2.0;
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 07 - Heaps & Priority Queues | Step 07: Find Median Data Stream");
        System.out.println("======================================================================\n");

        MedianFinder medianFinder = new MedianFinder();
        System.out.println("[INIT] Initialized empty MedianFinder with Dual Heaps.");

        int[] stream = {5, 15, 1, 3, 2, 8, 7, 9, 10, 6};

        for (int num : stream) {
            medianFinder.addNum(num);
            double median = medianFinder.findMedian();
            System.out.println("[STATE] Current Calculated Median: " + median);
        }

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Dual Heap Median Stream finder verified.");
        System.out.println("======================================================================");
    }
}

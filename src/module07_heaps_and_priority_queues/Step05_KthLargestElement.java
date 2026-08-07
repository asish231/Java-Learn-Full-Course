package module07_heaps_and_priority_queues;

import java.util.Arrays;
import java.util.PriorityQueue;

/**
 * Step 05: Kth Largest Element using K-Sized Min-Heap
 *
 * <pre>
 * K-SIZED MIN-HEAP ALGORITHM (Finding K=3rd Largest):
 *
 * Array Stream: [3, 2, 1, 5, 6, 4]
 * Min-Heap maintains top K=3 largest elements seen:
 *
 *   1. Process [3, 2, 1]: Heap = {1, 2, 3} (Size reaches K=3)
 *   2. Process [5]: 5 > Heap.peek(1) -> Poll 1, Offer 5 -> Heap = {2, 3, 5}
 *   3. Process [6]: 6 > Heap.peek(2) -> Poll 2, Offer 6 -> Heap = {3, 5, 6}
 *   4. Process [4]: 4 > Heap.peek(3) -> Poll 3, Offer 4 -> Heap = {4, 5, 6}
 *
 * Result: Heap Root = 4 (The 3rd Largest Element overall!)
 * Space Complexity: O(K) instead of sorting full array O(N log N)
 * Time Complexity:  O(N log K)
 * </pre>
 */
public class Step05_KthLargestElement {

    /**
     * Finds the K-th largest element using a size-K Min-Heap.
     */
    public static int findKthLargest(int[] nums, int k) {
        if (nums == null || k <= 0 || k > nums.length) {
            throw new IllegalArgumentException("Invalid input array or K value.");
        }

        PriorityQueue<Integer> minHeap = new PriorityQueue<>(k);
        System.out.println("[INIT] Created Min-Heap for K = " + k);

        for (int num : nums) {
            System.out.println("\n[ACTION] Processing element: " + num);
            if (minHeap.size() < k) {
                minHeap.offer(num);
                System.out.println("[STATE] Heap size < K. Added " + num + " -> Heap: " + minHeap);
            } else if (num > minHeap.peek()) {
                int popped = minHeap.poll();
                minHeap.offer(num);
                System.out.println("[MEMORY EVENT] Element " + num + " > Root " + popped
                        + ". Evicted " + popped + ", offered " + num + " -> Heap: " + minHeap);
            } else {
                System.out.println("[STATE] Element " + num + " <= Root " + minHeap.peek() + ". Ignored.");
            }
        }

        int result = minHeap.peek();
        System.out.println("\n[STATE] Top K Elements in Heap: " + minHeap);
        return result;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 07 - Heaps & Priority Queues | Step 05: Kth Largest Element");
        System.out.println("======================================================================\n");

        int[] nums = {3, 2, 3, 1, 2, 4, 5, 5, 6};
        int k = 4;

        System.out.println("[INIT] Input Array: " + Arrays.toString(nums) + " | K = " + k);

        int kthLargest = findKthLargest(nums, k);

        System.out.println("\n======================================================================");
        System.out.println("RESULT: The " + k + "-th largest element is: " + kthLargest);
        System.out.println("======================================================================");
    }
}

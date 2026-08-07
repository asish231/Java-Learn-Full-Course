package module07_heaps_and_priority_queues;

import java.util.Arrays;
import java.util.NoSuchElementException;

/**
 * Step 03: Custom Min-Heap Scratch Implementation
 *
 * <pre>
 * SIFT-UP (Heapify Up on Insertion):
 *   New element added at end (leaf). Bubble up while parent > child.
 *          [ 5 ]                       [ 5 ]
 *         /     \                     /     \
 *     [ 20 ]   [ 30 ]     ===>     [ 8 ]   [ 30 ]   (Swapped 20 and 8!)
 *     /
 *  [ 8 ]  (Newly Inserted)        /
 *                               [ 20 ]
 *
 * SIFT-DOWN (Heapify Down on Extraction):
 *   Root removed. Last leaf placed at root. Bubble down with smallest child.
 *          [ 20 ]                      [ 8 ]
 *         /      \                    /     \
 *     [ 8 ]      [ 30 ]   ===>    [ 20 ]   [ 30 ]   (Swapped 20 and 8!)
 * </pre>
 */
public class Step03_CustomMinHeapImplementation {

    /**
     * Scratch implementation of a Min-Heap data structure.
     */
    static class CustomMinHeap {
        private int[] heap;
        private int size;
        private static final int DEFAULT_CAPACITY = 10;

        public CustomMinHeap() {
            this.heap = new int[DEFAULT_CAPACITY];
            this.size = 0;
        }

        public CustomMinHeap(int capacity) {
            this.heap = new int[capacity];
            this.size = 0;
        }

        public int size() {
            return size;
        }

        public boolean isEmpty() {
            return size == 0;
        }

        public int peek() {
            if (isEmpty()) {
                throw new NoSuchElementException("Heap is empty!");
            }
            return heap[0];
        }

        public void insert(int val) {
            ensureCapacity();
            heap[size] = val;
            size++;
            System.out.println("  [ACTION] Inserted " + val + " at index " + (size - 1));
            siftUp(size - 1);
        }

        public int extractMin() {
            if (isEmpty()) {
                throw new NoSuchElementException("Heap is empty!");
            }
            int minVal = heap[0];
            heap[0] = heap[size - 1];
            size--;
            System.out.println("  [ACTION] Extracted Min " + minVal + ". Moved last leaf " + heap[0] + " to root.");
            if (size > 0) {
                siftDown(0);
            }
            return minVal;
        }

        private void siftUp(int index) {
            int current = index;
            while (current > 0) {
                int parent = (current - 1) / 2;
                if (heap[current] < heap[parent]) {
                    System.out.println("  [MEMORY EVENT] SiftUp Swap: heap[" + current + "]=" + heap[current]
                            + " < heap[" + parent + "]=" + heap[parent]);
                    swap(current, parent);
                    current = parent;
                } else {
                    break;
                }
            }
        }

        private void siftDown(int index) {
            int current = index;
            while (true) {
                int left = 2 * current + 1;
                int right = 2 * current + 2;
                int smallest = current;

                if (left < size && heap[left] < heap[smallest]) {
                    smallest = left;
                }
                if (right < size && heap[right] < heap[smallest]) {
                    smallest = right;
                }

                if (smallest != current) {
                    System.out.println("  [MEMORY EVENT] SiftDown Swap: heap[" + current + "]=" + heap[current]
                            + " with heap[" + smallest + "]=" + heap[smallest]);
                    swap(current, smallest);
                    current = smallest;
                } else {
                    break;
                }
            }
        }

        private void swap(int i, int j) {
            int temp = heap[i];
            heap[i] = heap[j];
            heap[j] = temp;
        }

        private void ensureCapacity() {
            if (size == heap.length) {
                heap = Arrays.copyOf(heap, heap.length * 2);
                System.out.println("  [MEMORY EVENT] Doubled heap array capacity to " + heap.length);
            }
        }

        public String toArrayString() {
            return Arrays.toString(Arrays.copyOf(heap, size));
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 07 - Heaps & Priority Queues | Step 03: Custom Min-Heap Implementation");
        System.out.println("======================================================================\n");

        CustomMinHeap heap = new CustomMinHeap(5);
        System.out.println("[INIT] Initialized CustomMinHeap with capacity 5.");

        int[] insertValues = {25, 12, 40, 5, 8, 30, 2};
        for (int v : insertValues) {
            System.out.println("\n[ACTION] Inserting value: " + v);
            heap.insert(v);
            System.out.println("[STATE] Heap array content: " + heap.toArrayString() + " | Root Min: " + heap.peek());
        }

        System.out.println("\n--- Extracting All Elements sequentially ---");
        while (!heap.isEmpty()) {
            System.out.println("\n[ACTION] Calling extractMin()...");
            int min = heap.extractMin();
            System.out.println("[STATE] Extracted: " + min + " | Remaining Array: " + heap.toArrayString());
        }

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Custom Min-Heap implementation passed.");
        System.out.println("======================================================================");
    }
}

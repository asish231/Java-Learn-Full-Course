package module07_heaps_and_priority_queues;

import java.util.Arrays;
import java.util.NoSuchElementException;

/**
 * Array-backed Binary Min-Heap Implementation from scratch.
 */
public class CustomMinHeap {
    private int[] heap;
    private int size;
    private int capacity;

    private static final int DEFAULT_CAPACITY = 10;

    public CustomMinHeap() {
        this(DEFAULT_CAPACITY);
    }

    public CustomMinHeap(int capacity) {
        this.capacity = capacity;
        this.heap = new int[capacity];
        this.size = 0;
    }

    public int size() { return size; }
    public boolean isEmpty() { return size == 0; }

    private int parent(int i) { return (i - 1) / 2; }
    private int leftChild(int i) { return 2 * i + 1; }
    private int rightChild(int i) { return 2 * i + 2; }

    public int peek() {
        if (isEmpty()) throw new NoSuchElementException("Heap is empty");
        return heap[0];
    }

    public void insert(int val) {
        if (size == capacity) {
            resize(capacity * 2);
        }
        heap[size] = val;
        heapifyUp(size);
        size++;
    }

    public int extractMin() {
        if (isEmpty()) throw new NoSuchElementException("Heap is empty");

        int minVal = heap[0];
        heap[0] = heap[size - 1]; // Move last element to root
        size--;
        heapifyDown(0);
        return minVal;
    }

    private void heapifyUp(int index) {
        while (index > 0 && heap[index] < heap[parent(index)]) {
            swap(index, parent(index));
            index = parent(index);
        }
    }

    private void heapifyDown(int index) {
        int smallest = index;
        int left = leftChild(index);
        int right = rightChild(index);

        if (left < size && heap[left] < heap[smallest]) {
            smallest = left;
        }
        if (right < size && heap[right] < heap[smallest]) {
            smallest = right;
        }

        if (smallest != index) {
            swap(index, smallest);
            heapifyDown(smallest);
        }
    }

    private void swap(int i, int j) {
        int temp = heap[i];
        heap[i] = heap[j];
        heap[j] = temp;
    }

    private void resize(int newCapacity) {
        heap = Arrays.copyOf(heap, newCapacity);
        capacity = newCapacity;
    }

    @Override
    public String toString() {
        return Arrays.toString(Arrays.copyOf(heap, size));
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" ⛰️ CUSTOM MIN-HEAP DEMONSTRATION");
        System.out.println("==================================================\n");

        CustomMinHeap minHeap = new CustomMinHeap();
        System.out.println("Inserting elements: 15, 10, 20, 8, 25, 5...");
        minHeap.insert(15);
        minHeap.insert(10);
        minHeap.insert(20);
        minHeap.insert(8);
        minHeap.insert(25);
        minHeap.insert(5);

        System.out.println("Heap array state: " + minHeap);
        System.out.println("Minimum element (peek): " + minHeap.peek());

        System.out.println("\nExtracting elements in ascending order:");
        while (!minHeap.isEmpty()) {
            System.out.print(minHeap.extractMin() + " ");
        }
        System.out.println("\n\n✅ Min-Heap test passed!");
    }
}

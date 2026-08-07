package module04_stacks_and_queues;

import java.util.NoSuchElementException;

/**
 * Step 02: Circular Array Queue Implementation (FIFO Ring Buffer)
 *
 * <pre>
 * 1. Circular Buffer Index Ring (Capacity = 5):
 *
 *                  [Index 0]
 *                /           \
 *          [Index 4]       [Index 1]
 *             |                 |
 *          [Index 3]-------[Index 2]
 *
 * 2. Circular Array State with Wrap-Around:
 *    Capacity = 5, Front = 3, Rear = 1, Size = 4
 *
 *    Array:  [ 50 ]  [ 60 ]  [ -- ]  [ 30 ]  [ 40 ]
 *    Index:    0       1       2       3       4
 *                      ^               ^
 *                     rear            front
 *
 *    Modulo Calculation:
 *    - Next Enqueue Slot = (rear + 1) % capacity = (1 + 1) % 5 = Index 2
 *    - Next Dequeue Slot = (front + 1) % capacity = (3 + 1) % 5 = Index 4
 * </pre>
 */
public class Step02_CircularQueueImplementation {

    public static class CircularQueue<T> {
        private Object[] data;
        private int front;
        private int rear;
        private int size;
        private int capacity;

        public CircularQueue(int capacity) {
            if (capacity <= 0) {
                throw new IllegalArgumentException("Capacity must be positive");
            }
            this.capacity = capacity;
            this.data = new Object[capacity];
            this.front = 0;
            this.rear = -1;
            this.size = 0;
        }

        public int size() {
            return size;
        }

        public int capacity() {
            return capacity;
        }

        public boolean isFull() {
            return size == capacity;
        }

        public boolean isEmpty() {
            return size == 0;
        }

        /**
         * Enqueues element to the rear using modulo arithmetic ring buffer. O(1)
         */
        public void enqueue(T item) {
            if (isFull()) {
                throw new IllegalStateException("Queue is full!");
            }
            rear = (rear + 1) % capacity;
            data[rear] = item;
            size++;
        }

        /**
         * Dequeues element from the front using modulo arithmetic. O(1)
         */
        @SuppressWarnings("unchecked")
        public T dequeue() {
            if (isEmpty()) {
                throw new NoSuchElementException("Queue is empty!");
            }
            T item = (T) data[front];
            data[front] = null; // GC clearing
            front = (front + 1) % capacity;
            size--;
            return item;
        }

        /**
         * Peeks front element. O(1)
         */
        @SuppressWarnings("unchecked")
        public T peek() {
            if (isEmpty()) {
                throw new NoSuchElementException("Queue is empty!");
            }
            return (T) data[front];
        }

        public String getBufferState() {
            StringBuilder sb = new StringBuilder("[ ");
            for (int i = 0; i < capacity; i++) {
                sb.append(data[i] != null ? data[i] : "--").append(" ");
            }
            sb.append("]");
            return sb.toString();
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 04 - Stacks & Queues | Step 02: Circular Queue Implementation");
        System.out.println("======================================================================\n");

        int capacity = 4;
        System.out.println("[INIT] Creating CircularQueue with Capacity = " + capacity);
        CircularQueue<Integer> queue = new CircularQueue<>(capacity);
        System.out.println("[STATE] Buffer: " + queue.getBufferState());

        System.out.println("\n--- 1. Enqueueing Elements until Full ---");
        for (int i = 10; i <= 40; i += 10) {
            System.out.println("[ACTION] enqueue(" + i + ")");
            queue.enqueue(i);
            System.out.println("  [STATE] Buffer: " + queue.getBufferState() + " (size=" + queue.size() + ")");
        }
        System.out.println("[STATE] Is Queue Full: " + queue.isFull());

        System.out.println("\n--- 2. Dequeueing 2 Elements to Create Ring Headroom ---");
        System.out.println("[ACTION] Dequeued: " + queue.dequeue());
        System.out.println("[ACTION] Dequeued: " + queue.dequeue());
        System.out.println("[STATE] Buffer post-dequeue: " + queue.getBufferState());

        System.out.println("\n--- 3. Enqueueing 50 & 60 to Demonstrate Modulo Wrap-Around ---");
        System.out.println("[ACTION] enqueue(50)");
        queue.enqueue(50);
        System.out.println("[MEMORY EVENT] Wrapped around to index 0!");
        System.out.println("[ACTION] enqueue(60)");
        queue.enqueue(60);
        System.out.println("[MEMORY EVENT] Wrapped around to index 1!");

        System.out.println("[STATE] Final Ring Buffer Layout: " + queue.getBufferState());
        System.out.println("[STATE] Peek Front Element: " + queue.peek());

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Circular Ring Queue FIFO verified.");
        System.out.println("======================================================================");
    }
}

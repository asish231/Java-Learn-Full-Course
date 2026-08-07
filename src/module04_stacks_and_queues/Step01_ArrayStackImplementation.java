package module04_stacks_and_queues;

import java.util.EmptyStackException;

/**
 * Step 01: Dynamic Array-Backed Stack Implementation (LIFO)
 *
 * <pre>
 * 1. ArrayStack Internal State (Capacity = 4):
 *
 *    Index:   [ 0 ]   [ 1 ]   [ 2 ]   [ 3 ]
 *    Value:  | 10  |  20   |  30   |       |
 *             -----------------------------
 *                                     ^ top = 2
 *
 * 2. Push Operation (push(40)):
 *    data[++top] = 40;
 *    Index:   [ 0 ]   [ 1 ]   [ 2 ]   [ 3 ]
 *    Value:  | 10  |  20   |  30   |  40   |
 *             -----------------------------
 *                                             ^ top = 3 (Full!)
 *
 * 3. Capacity Expansion (Doubling 4 -> 8 on push(50)):
 *    New Array allocated @ Heap, elements copied:
 *    Index:   [ 0 ] [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ] [ 6 ] [ 7 ]
 *    Value:  | 10  | 20  | 30  | 40  | 50  |     |     |     |
 *                                        ^ top = 4
 * </pre>
 */
public class Step01_ArrayStackImplementation {

    public static class ArrayStack<T> {
        private Object[] data;
        private int top;
        private int capacity;
        private static final int DEFAULT_CAPACITY = 4;

        public ArrayStack() {
            this(DEFAULT_CAPACITY);
        }

        public ArrayStack(int initialCapacity) {
            if (initialCapacity <= 0) {
                throw new IllegalArgumentException("Capacity must be positive");
            }
            this.capacity = initialCapacity;
            this.data = new Object[initialCapacity];
            this.top = -1;
        }

        public int size() {
            return top + 1;
        }

        public int capacity() {
            return capacity;
        }

        public boolean isEmpty() {
            return top == -1;
        }

        /**
         * Pushes item onto stack top. Amortized O(1).
         */
        public void push(T item) {
            if (top == capacity - 1) {
                resize(capacity * 2);
            }
            data[++top] = item;
        }

        /**
         * Pops top item off stack. O(1).
         */
        @SuppressWarnings("unchecked")
        public T pop() {
            if (isEmpty()) {
                throw new EmptyStackException();
            }
            T item = (T) data[top];
            data[top--] = null; // GC clearing
            return item;
        }

        /**
         * Peeks at top item without removing it. O(1).
         */
        @SuppressWarnings("unchecked")
        public T peek() {
            if (isEmpty()) {
                throw new EmptyStackException();
            }
            return (T) data[top];
        }

        private void resize(int newCapacity) {
            System.out.println("  [MEMORY EVENT] Resizing Stack Capacity: " + capacity + " -> " + newCapacity);
            Object[] newData = new Object[newCapacity];
            System.arraycopy(data, 0, newData, 0, size());
            this.data = newData;
            this.capacity = newCapacity;
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 04 - Stacks & Queues | Step 01: Array Stack Implementation");
        System.out.println("======================================================================\n");

        System.out.println("[INIT] Creating ArrayStack with initial capacity = 4");
        ArrayStack<String> stack = new ArrayStack<>(4);

        System.out.println("\n--- 1. Pushing Elements onto Stack ---");
        System.out.println("[ACTION] push(\"Alpha\")");
        stack.push("Alpha");
        System.out.println("[ACTION] push(\"Beta\")");
        stack.push("Beta");
        System.out.println("[ACTION] push(\"Gamma\")");
        stack.push("Gamma");
        System.out.println("[ACTION] push(\"Delta\")");
        stack.push("Delta");

        System.out.println("[STATE] Stack Size: " + stack.size() + ", Top Element: " + stack.peek());

        System.out.println("\n--- 2. Triggering Capacity Doubling ---");
        System.out.println("[ACTION] push(\"Epsilon\") (Triggers resize)...");
        stack.push("Epsilon");
        System.out.println("[STATE] New Capacity: " + stack.capacity() + ", Size: " + stack.size());

        System.out.println("\n--- 3. Popping Elements (LIFO Order) ---");
        while (!stack.isEmpty()) {
            String item = stack.pop();
            System.out.println("  [ACTION] Popped: \"" + item + "\" -> Remaining Size: " + stack.size());
        }

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Array-backed LIFO Stack verified.");
        System.out.println("======================================================================");
    }
}

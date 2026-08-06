package module04_stacks_and_queues;

import java.util.EmptyStackException;

/**
 * Array-backed generic LIFO Stack Implementation.
 */
public class ArrayStack<T> {
    private Object[] data;
    private int top;
    private int capacity;

    private static final int DEFAULT_CAPACITY = 10;

    public ArrayStack() {
        this(DEFAULT_CAPACITY);
    }

    public ArrayStack(int initialCapacity) {
        this.capacity = initialCapacity;
        this.data = new Object[capacity];
        this.top = -1;
    }

    public int size() {
        return top + 1;
    }

    public boolean isEmpty() {
        return top == -1;
    }

    /**
     * Pushes item to top of stack - O(1) amortized
     */
    public void push(T item) {
        if (top == capacity - 1) {
            resize(capacity * 2);
        }
        data[++top] = item;
    }

    /**
     * Pops and returns top item - O(1)
     */
    @SuppressWarnings("unchecked")
    public T pop() {
        if (isEmpty()) throw new EmptyStackException();
        T item = (T) data[top];
        data[top--] = null; // Prevent memory leak
        return item;
    }

    /**
     * Returns top item without removing - O(1)
     */
    @SuppressWarnings("unchecked")
    public T peek() {
        if (isEmpty()) throw new EmptyStackException();
        return (T) data[top];
    }

    private void resize(int newCapacity) {
        Object[] newData = new Object[newCapacity];
        System.arraycopy(data, 0, newData, 0, size());
        data = newData;
        capacity = newCapacity;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("Stack [bottom -> ");
        for (int i = 0; i <= top; i++) {
            sb.append(data[i]);
            if (i < top) sb.append(", ");
        }
        sb.append(" <- top]");
        return sb.toString();
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 🥞 ARRAY STACK DEMONSTRATION");
        System.out.println("==================================================\n");

        ArrayStack<Integer> stack = new ArrayStack<>(3);
        stack.push(10);
        stack.push(20);
        stack.push(30);

        System.out.println("Initial " + stack);
        System.out.println("Peek top: " + stack.peek());

        System.out.println("Popped element: " + stack.pop());
        System.out.println("Stack after pop: " + stack);

        stack.push(40);
        stack.push(50); // Triggers resize
        System.out.println("Stack after pushing 40, 50: " + stack);

        System.out.println("\n✅ Array Stack test completed!");
    }
}

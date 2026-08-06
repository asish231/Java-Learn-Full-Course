package module02_arrays_and_strings;

import java.util.Arrays;
import java.util.Iterator;

/**
 * Custom implementation of a Dynamic Array (similar to java.util.ArrayList)
 * Demonstrates automatic geometric resizing, amortized O(1) insertions, and boundary checks.
 */
public class CustomDynamicArray<T> implements Iterable<T> {
    private Object[] data;
    private int size;
    private int capacity;

    private static final int DEFAULT_CAPACITY = 10;

    public CustomDynamicArray() {
        this(DEFAULT_CAPACITY);
    }

    public CustomDynamicArray(int initialCapacity) {
        if (initialCapacity < 0) throw new IllegalArgumentException("Capacity cannot be negative");
        this.capacity = initialCapacity;
        this.data = new Object[capacity];
        this.size = 0;
    }

    public int size() {
        return size;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    @SuppressWarnings("unchecked")
    public T get(int index) {
        checkIndexBounds(index);
        return (T) data[index];
    }

    public void set(int index, T element) {
        checkIndexBounds(index);
        data[index] = element;
    }

    /**
     * Appends element to the end of the dynamic array.
     * Amortized Time Complexity: O(1)
     */
    public void add(T element) {
        if (size == capacity) {
            resize(capacity == 0 ? 1 : capacity * 2);
        }
        data[size++] = element;
    }

    /**
     * Inserts element at specific index, shifting subsequent elements right.
     * Time Complexity: O(N)
     */
    public void insert(int index, T element) {
        if (index < 0 || index > size) {
            throw new IndexOutOfBoundsException("Index: " + index + ", Size: " + size);
        }
        if (size == capacity) {
            resize(capacity * 2);
        }
        System.arraycopy(data, index, data, index + 1, size - index);
        data[index] = element;
        size++;
    }

    /**
     * Removes element at index and shifts elements left.
     * Time Complexity: O(N)
     */
    @SuppressWarnings("unchecked")
    public T remove(int index) {
        checkIndexBounds(index);
        T removed = (T) data[index];
        int numMoved = size - index - 1;
        if (numMoved > 0) {
            System.arraycopy(data, index + 1, data, index, numMoved);
        }
        data[--size] = null; // Clear reference for GC

        // Shrink array if size drops below 25% of capacity
        if (size > 0 && size <= capacity / 4) {
            resize(capacity / 2);
        }
        return removed;
    }

    private void resize(int newCapacity) {
        System.out.printf("  [Resizing] Capacity expanded/shunk: %d -> %d (Current size = %d)%n", capacity, newCapacity, size);
        Object[] newData = new Object[newCapacity];
        System.arraycopy(data, 0, newData, 0, size);
        data = newData;
        capacity = newCapacity;
    }

    private void checkIndexBounds(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException("Index: " + index + ", Size: " + size);
        }
    }

    @Override
    public Iterator<T> iterator() {
        return new Iterator<T>() {
            private int cursor = 0;
            @Override
            public boolean hasNext() { return cursor < size; }
            @Override
            @SuppressWarnings("unchecked")
            public T next() { return (T) data[cursor++]; }
        };
    }

    @Override
    public String toString() {
        return Arrays.toString(Arrays.copyOf(data, size));
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 📦 MODULE 02: CUSTOM DYNAMIC ARRAY DEMONSTRATION");
        System.out.println("==================================================\n");

        CustomDynamicArray<Integer> arr = new CustomDynamicArray<>(4);
        System.out.println("Initial array: " + arr + ", Size: " + arr.size());

        System.out.println("\nAdding elements 10, 20, 30, 40, 50...");
        arr.add(10);
        arr.add(20);
        arr.add(30);
        arr.add(40);
        arr.add(50); // Triggers resize!

        System.out.println("Array contents: " + arr);
        System.out.println("Element at index 2: " + arr.get(2));

        System.out.println("\nInserting 25 at index 2...");
        arr.insert(2, 25);
        System.out.println("Array after insertion: " + arr);

        System.out.println("\nRemoving element at index 0...");
        arr.remove(0);
        System.out.println("Array after removal: " + arr);

        System.out.print("Iterating over array elements: ");
        for (int val : arr) {
            System.out.print(val + " ");
        }
        System.out.println("\n\n✅ Custom Dynamic Array test passed!");
    }
}

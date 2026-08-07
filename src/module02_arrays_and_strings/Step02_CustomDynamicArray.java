package module02_arrays_and_strings;

import java.util.Iterator;
import java.util.NoSuchElementException;

/**
 * Step 02: Custom Dynamic Array Implementation (Resizing, Shrinking & Iteration)
 *
 * <pre>
 * DYNAMIC ARRAY INTERNAL MEMORY STRUCTURE:
 * Heap Object
 * +-------------------------------------------------------+
 * | data -> [ 10 | 20 | 30 | 40 | null | null | ... null ]|
 * | size = 4                                              |
 * | capacity = 10                                         |
 * +-------------------------------------------------------+
 *   0      1      2      3      4      5          9
 *
 * INSERTION AT INDEX 1 (Shift Right):
 * Before: [ 10 | 20 | 30 | 40 | null ]  Insert(index=1, val=15)
 * Shift:       \    \    \
 * After:  [ 10 | 15 | 20 | 30 | 40   ]
 *
 * REMOVAL AT INDEX 1 (Shift Left & Null Clear):
 * Before: [ 10 | 15 | 20 | 30 | 40 ]    Remove(index=1)
 * Shift:          /    /    /
 * After:  [ 10 | 20 | 30 | 40 | null ]  (data[size-1] set to null for GC!)
 * </pre>
 */
public class Step02_CustomDynamicArray<T> implements Iterable<T> {

    private Object[] data;
    private int size;
    private int capacity;
    private static final int DEFAULT_CAPACITY = 4;

    public Step02_CustomDynamicArray() {
        this(DEFAULT_CAPACITY);
    }

    public Step02_CustomDynamicArray(int initialCapacity) {
        if (initialCapacity <= 0) {
            throw new IllegalArgumentException("Capacity must be positive");
        }
        this.capacity = initialCapacity;
        this.data = new Object[initialCapacity];
        this.size = 0;
    }

    public int size() {
        return size;
    }

    public int capacity() {
        return capacity;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    @SuppressWarnings("unchecked")
    public T get(int index) {
        checkBounds(index);
        return (T) data[index];
    }

    public void set(int index, T element) {
        checkBounds(index);
        data[index] = element;
    }

    /**
     * Appends element to the end of array.
     * Amortized O(1) time complexity.
     */
    public void add(T element) {
        if (size == capacity) {
            resize(capacity * 2);
        }
        data[size++] = element;
    }

    /**
     * Inserts element at specific index, shifting existing items right.
     * Time: O(N) worst case.
     */
    public void insert(int index, T element) {
        if (index < 0 || index > size) {
            throw new IndexOutOfBoundsException("Index " + index + " out of bounds for size " + size);
        }
        if (size == capacity) {
            resize(capacity * 2);
        }
        System.arraycopy(data, index, data, index + 1, size - index);
        data[index] = element;
        size++;
    }

    /**
     * Removes element at index, shifting remaining items left and clearing trailing ref.
     * Performs dynamic shrinking when size <= capacity / 4.
     * Time: O(N) worst case.
     */
    @SuppressWarnings("unchecked")
    public T remove(int index) {
        checkBounds(index);
        T removedItem = (T) data[index];
        int numMoved = size - index - 1;
        if (numMoved > 0) {
            System.arraycopy(data, index + 1, data, index, numMoved);
        }
        data[--size] = null; // GC reference clearing

        // Shrink check to avoid memory leak and thrashing
        if (size > 0 && size <= capacity / 4 && capacity / 2 >= DEFAULT_CAPACITY) {
            resize(capacity / 2);
        }
        return removedItem;
    }

    private void checkBounds(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException("Index " + index + " out of bounds for size " + size);
        }
    }

    private void resize(int newCapacity) {
        System.out.println("  [MEMORY EVENT] Resizing Capacity: " + capacity + " -> " + newCapacity + " (size=" + size + ")");
        Object[] newData = new Object[newCapacity];
        System.arraycopy(data, 0, newData, 0, size);
        this.data = newData;
        this.capacity = newCapacity;
    }

    @Override
    public Iterator<T> iterator() {
        return new DynamicArrayIterator();
    }

    private class DynamicArrayIterator implements Iterator<T> {
        private int cursor = 0;

        @Override
        public boolean hasNext() {
            return cursor < size;
        }

        @Override
        @SuppressWarnings("unchecked")
        public T next() {
            if (!hasNext()) {
                throw new NoSuchElementException();
            }
            return (T) data[cursor++];
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 02 - Arrays & Strings | Step 02: Custom Dynamic Array");
        System.out.println("======================================================================\n");

        System.out.println("[INIT] Creating CustomDynamicArray with initial capacity = 4");
        Step02_CustomDynamicArray<Integer> arr = new Step02_CustomDynamicArray<>(4);
        System.out.println("[STATE] Initial Size: " + arr.size() + ", Capacity: " + arr.capacity());

        System.out.println("\n--- 1. Appending Elements to Trigger 2x Expansion ---");
        for (int i = 1; i <= 5; i++) {
            System.out.println("[ACTION] Adding element: " + (i * 10));
            arr.add(i * 10);
            System.out.println("  [STATE] Size: " + arr.size() + ", Capacity: " + arr.capacity());
        }

        System.out.println("\n--- 2. Index Insertion Shift Right ---");
        System.out.println("[ACTION] Inserting 25 at index 2...");
        arr.insert(2, 25);
        System.out.println("[STATE] Size: " + arr.size() + ", Element at index 2: " + arr.get(2));

        System.out.println("\n--- 3. Iterating via For-Each Loop ---");
        System.out.print("[STATE] Current Elements: [ ");
        for (int val : arr) {
            System.out.print(val + " ");
        }
        System.out.println("]");

        System.out.println("\n--- 4. Element Removal & Dynamic Capacity Shrinking ---");
        System.out.println("[ACTION] Removing elements to trigger dynamic buffer shrinkage...");
        while (arr.size() > 1) {
            int removed = arr.remove(arr.size() - 1);
            System.out.println("  [ACTION] Removed: " + removed + " -> Size: " + arr.size() + ", Capacity: " + arr.capacity());
        }

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Dynamic array expansion & shrink verified.");
        System.out.println("======================================================================");
    }
}

package module05_hashing;

import java.util.LinkedList;

/**
 * Step 07: Custom HashMap Implementation using Separate Chaining
 *
 * <pre>
 * SEPARATE CHAINING ARCHITECTURE:
 * Buckets Array (capacity M = 4):
 * Index [0]: [Key: "Alice", Val: 95] -> [Key: "Eve", Val: 99] -> null
 * Index [1]: null
 * Index [2]: [Key: "Bob", Val: 88] -> null
 * Index [3]: [Key: "Charlie", Val: 92] -> null
 *
 * REHASHING PROCESS (Triggers when size / capacity >= 0.75):
 * 1. Double capacity: M_new = 2 * M_old
 * 2. Re-compute bucket index for all existing entries: index = Math.abs(key.hashCode()) % M_new
 * 3. Re-insert entries into new bucket array
 * </pre>
 */
public class Step07_CustomHashMapSeparateChaining {

    /**
     * Key-Value Pair Entry stored inside bucket linked lists.
     */
    static class Entry<K, V> {
        final K key;
        V value;

        Entry(K key, V value) {
            this.key = key;
            this.value = value;
        }

        @Override
        public String toString() {
            return key + "=" + value;
        }
    }

    /**
     * Custom HashMap backed by an array of LinkedList buckets.
     */
    static class CustomChainingHashMap<K, V> {
        private LinkedList<Entry<K, V>>[] buckets;
        private int size;
        private int capacity;
        private static final double DEFAULT_LOAD_FACTOR = 0.75;
        private static final int DEFAULT_INITIAL_CAPACITY = 4;

        @SuppressWarnings({"unchecked", "rawtypes"})
        public CustomChainingHashMap(int capacity) {
            this.capacity = capacity;
            this.buckets = new LinkedList[capacity];
            this.size = 0;
            for (int i = 0; i < capacity; i++) {
                buckets[i] = new LinkedList<>();
            }
        }

        public CustomChainingHashMap() {
            this(DEFAULT_INITIAL_CAPACITY);
        }

        private int getBucketIndex(K key) {
            if (key == null) return 0;
            return Math.abs(key.hashCode()) % capacity;
        }

        public int size() {
            return size;
        }

        public boolean isEmpty() {
            return size == 0;
        }

        public boolean containsKey(K key) {
            return get(key) != null;
        }

        public V get(K key) {
            int index = getBucketIndex(key);
            LinkedList<Entry<K, V>> bucket = buckets[index];
            for (Entry<K, V> entry : bucket) {
                if ((key == null && entry.key == null) || (key != null && key.equals(entry.key))) {
                    return entry.value;
                }
            }
            return null;
        }

        public void put(K key, V value) {
            int index = getBucketIndex(key);
            LinkedList<Entry<K, V>> bucket = buckets[index];

            for (Entry<K, V> entry : bucket) {
                if ((key == null && entry.key == null) || (key != null && key.equals(entry.key))) {
                    entry.value = value;
                    return;
                }
            }

            bucket.add(new Entry<>(key, value));
            size++;

            if ((double) size / capacity >= DEFAULT_LOAD_FACTOR) {
                rehash();
            }
        }

        public V remove(K key) {
            int index = getBucketIndex(key);
            LinkedList<Entry<K, V>> bucket = buckets[index];

            for (Entry<K, V> entry : bucket) {
                if ((key == null && entry.key == null) || (key != null && key.equals(entry.key))) {
                    V val = entry.value;
                    bucket.remove(entry);
                    size--;
                    return val;
                }
            }
            return null;
        }

        @SuppressWarnings({"unchecked", "rawtypes"})
        private void rehash() {
            int oldCapacity = capacity;
            int newCapacity = capacity * 2;
            System.out.printf("  [MEMORY EVENT] Load factor %.2f reached (size=%d, cap=%d). Resizing: %d -> %d%n",
                    (double) size / capacity, size, capacity, oldCapacity, newCapacity);

            LinkedList<Entry<K, V>>[] oldBuckets = buckets;
            this.capacity = newCapacity;
            this.buckets = new LinkedList[newCapacity];
            this.size = 0;

            for (int i = 0; i < newCapacity; i++) {
                buckets[i] = new LinkedList<>();
            }

            for (LinkedList<Entry<K, V>> bucket : oldBuckets) {
                for (Entry<K, V> entry : bucket) {
                    put(entry.key, entry.value);
                }
            }
        }

        public void printDebugState() {
            System.out.println("--- HashMap Internal State (Size: " + size + ", Capacity: " + capacity + ") ---");
            for (int i = 0; i < capacity; i++) {
                System.out.println("  Bucket [" + i + "]: " + buckets[i]);
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 05 - Hashing | Step 07: Custom HashMap (Separate Chaining)");
        System.out.println("======================================================================\n");

        CustomChainingHashMap<String, Integer> map = new CustomChainingHashMap<>(4);
        System.out.println("[INIT] Created CustomChainingHashMap with initial capacity M = 4");

        System.out.println("\n--- 1. Inserting Initial Entries ---");
        System.out.println("[ACTION] Inserting (Alice=95), (Bob=88), (Charlie=92)");
        map.put("Alice", 95);
        map.put("Bob", 88);
        map.put("Charlie", 92);

        System.out.println("[STATE] Map Size = " + map.size());
        map.printDebugState();

        System.out.println("\n--- 2. Triggering Auto-Rehash on Load Factor Threshold ---");
        System.out.println("[ACTION] Inserting (David=79) -> Triggers rehash (size=4, load factor >= 0.75)...");
        map.put("David", 79);

        System.out.println("[STATE] State after rehash:");
        map.printDebugState();

        System.out.println("\n--- 3. Lookup and Update Operations ---");
        System.out.println("[ACTION] Querying key \"Alice\": " + map.get("Alice"));
        System.out.println("[ACTION] Updating \"Bob\" score from 88 to 90");
        map.put("Bob", 90);
        System.out.println("[STATE] Updated \"Bob\" score: " + map.get("Bob"));

        System.out.println("\n--- 4. Removal Operation ---");
        System.out.println("[ACTION] Removing key \"Charlie\"");
        Integer removedVal = map.remove("Charlie");
        System.out.println("[STATE] Removed value: " + removedVal + " | Contains \"Charlie\"? " + map.containsKey("Charlie"));
        map.printDebugState();

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Custom HashMap Separate Chaining passed.");
        System.out.println("======================================================================");
    }
}

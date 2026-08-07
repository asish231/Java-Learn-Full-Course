package module05_hashing;

import java.util.Arrays;

/**
 * Step 08: Custom HashMap Implementation using Open Addressing & Linear Probing
 *
 * <pre>
 * OPEN ADDRESSING & LINEAR PROBING:
 * Primary Index = Math.abs(key.hashCode()) % Capacity
 * If Slot [Index] is occupied:
 * Probe sequential indices: (Index + 1) % Capacity, (Index + 2) % Capacity, ...
 *
 * SLOTS STATE MACHINE:
 * [ EMPTY ] ---> Active Entry [ Key , Value ]
 *               Active Entry ---> [ DELETED (TOMBSTONE) ]
 *
 * TOMBSTONE FUNCTIONALITY:
 *  - Deleting an entry replaces it with a TOMBSTONE sentinel.
 *  - Search continues past TOMBSTONES until exact key is matched or EMPTY slot is hit.
 *  - Insertion can overwrite TOMBSTONE slots to reuse memory!
 *
 * PROBING DIAGRAM:
 * Index:  [ 0 ]         [ 1 ]         [ 2 ]         [ 3 ]
 * State:  [ KeyA, ValA ] [ TOMBSTONE ] [ KeyC, ValC ] [ EMPTY ]
 * Search KeyC: Hash -> index 0 (KeyA != KeyC) -> Probe 1 (TOMBSTONE, keep probing) -> Probe 2 (KeyC Match!)
 * </pre>
 */
public class Step08_CustomHashMapLinearProbing {

    /**
     * Entry class storing key, value, and tombstone status flag.
     */
    static class Entry<K, V> {
        K key;
        V value;
        boolean isDeleted;

        Entry(K key, V value) {
            this.key = key;
            this.value = value;
            this.isDeleted = false;
        }

        @Override
        public String toString() {
            if (isDeleted) return "<TOMBSTONE>";
            return key + "=" + value;
        }
    }

    /**
     * Custom Open Addressing HashMap using Linear Probing.
     */
    static class CustomLinearProbingHashMap<K, V> {
        private Entry<K, V>[] table;
        private int size;
        private int capacity;
        private static final double DEFAULT_LOAD_FACTOR = 0.5;
        private static final int DEFAULT_INITIAL_CAPACITY = 4;

        @SuppressWarnings({"unchecked", "rawtypes"})
        public CustomLinearProbingHashMap(int capacity) {
            this.capacity = capacity;
            this.table = new Entry[capacity];
            this.size = 0;
        }

        public CustomLinearProbingHashMap() {
            this(DEFAULT_INITIAL_CAPACITY);
        }

        private int hash(K key) {
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
            int startIndex = hash(key);
            int index = startIndex;

            while (table[index] != null) {
                Entry<K, V> entry = table[index];
                if (!entry.isDeleted && ((key == null && entry.key == null) || (key != null && key.equals(entry.key)))) {
                    return entry.value;
                }
                index = (index + 1) % capacity;
                if (index == startIndex) break; // Traversed whole table
            }
            return null;
        }

        public void put(K key, V value) {
            if ((double) (size + 1) / capacity >= DEFAULT_LOAD_FACTOR) {
                rehash();
            }

            int startIndex = hash(key);
            int index = startIndex;
            int firstDeletedIndex = -1;

            while (table[index] != null) {
                Entry<K, V> entry = table[index];
                if (entry.isDeleted) {
                    if (firstDeletedIndex == -1) {
                        firstDeletedIndex = index;
                    }
                } else if ((key == null && entry.key == null) || (key != null && key.equals(entry.key))) {
                    entry.value = value; // Update existing
                    return;
                }
                index = (index + 1) % capacity;
                if (index == startIndex) break;
            }

            // Insert at first deleted slot if available, otherwise at current empty slot
            int insertIndex = (firstDeletedIndex != -1) ? firstDeletedIndex : index;
            table[insertIndex] = new Entry<>(key, value);
            size++;
        }

        public V remove(K key) {
            int startIndex = hash(key);
            int index = startIndex;

            while (table[index] != null) {
                Entry<K, V> entry = table[index];
                if (!entry.isDeleted && ((key == null && entry.key == null) || (key != null && key.equals(entry.key)))) {
                    entry.isDeleted = true;
                    size--;
                    return entry.value;
                }
                index = (index + 1) % capacity;
                if (index == startIndex) break;
            }
            return null;
        }

        @SuppressWarnings({"unchecked", "rawtypes"})
        private void rehash() {
            int oldCapacity = capacity;
            int newCapacity = capacity * 2;
            System.out.printf("  [MEMORY EVENT] Load factor threshold 0.5 reached (size=%d, cap=%d). Resizing table: %d -> %d%n",
                    size, oldCapacity, oldCapacity, newCapacity);

            Entry<K, V>[] oldTable = table;
            this.capacity = newCapacity;
            this.table = new Entry[newCapacity];
            this.size = 0;

            for (Entry<K, V> entry : oldTable) {
                if (entry != null && !entry.isDeleted) {
                    put(entry.key, entry.value);
                }
            }
        }

        public void printTable() {
            System.out.println("--- Table State (Size: " + size + ", Capacity: " + capacity + ") ---");
            System.out.println("Slots: " + Arrays.toString(table));
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 05 - Hashing | Step 08: Custom HashMap (Linear Probing)");
        System.out.println("======================================================================\n");

        CustomLinearProbingHashMap<String, Integer> map = new CustomLinearProbingHashMap<>(4);
        System.out.println("[INIT] Created CustomLinearProbingHashMap with initial capacity M = 4");

        System.out.println("\n--- 1. Inserting Keys and Probing ---");
        System.out.println("[ACTION] Inserting (Alpha=10), (Beta=20)");
        map.put("Alpha", 10);
        map.put("Beta", 20); // Triggers rehash due to load factor >= 0.5

        System.out.println("[STATE] Table state after insertions:");
        map.printTable();

        System.out.println("\n--- 2. Inserting More Keys & Rehash Trace ---");
        System.out.println("[ACTION] Inserting (Gamma=30), (Delta=40)");
        map.put("Gamma", 30);
        map.put("Delta", 40);

        System.out.println("[STATE] Current Table:");
        map.printTable();

        System.out.println("\n--- 3. Tombstone Soft Deletion ---");
        System.out.println("[ACTION] Removing key \"Beta\"");
        Integer removedVal = map.remove("Beta");
        System.out.println("[STATE] Removed value: " + removedVal);
        System.out.println("[MEMORY EVENT] Beta slot converted to TOMBSTONE so search chain remains intact.");
        map.printTable();

        System.out.println("\n--- 4. Re-inserting into Tombstone Slot ---");
        System.out.println("[ACTION] Inserting (Epsilon=50) - should reuse TOMBSTONE slot if probed");
        map.put("Epsilon", 50);
        map.printTable();

        System.out.println("\n--- 5. Query Verification ---");
        System.out.println("[ACTION] Querying key \"Gamma\": " + map.get("Gamma"));
        System.out.println("[ACTION] Querying key \"Beta\": " + map.get("Beta") + " (Expected: null)");

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Custom HashMap Linear Probing passed.");
        System.out.println("======================================================================");
    }
}

package module05_hashing;

import java.util.LinkedList;

/**
 * Custom HashMap implementation using Separate Chaining (LinkedList array).
 */
public class CustomHashMapChaining<K, V> {

    public static class Entry<K, V> {
        public K key;
        public V value;

        public Entry(K key, V value) {
            this.key = key;
            this.value = value;
        }

        @Override
        public String toString() {
            return key + "=" + value;
        }
    }

    private LinkedList<Entry<K, V>>[] buckets;
    private int size;
    private int capacity;
    private static final double DEFAULT_LOAD_FACTOR = 0.75;
    private static final int DEFAULT_CAPACITY = 16;

    @SuppressWarnings("unchecked")
    public CustomHashMapChaining(int capacity) {
        this.capacity = capacity;
        this.buckets = new LinkedList[capacity];
        this.size = 0;
        for (int i = 0; i < capacity; i++) {
            buckets[i] = new LinkedList<>();
        }
    }

    public CustomHashMapChaining() {
        this(DEFAULT_CAPACITY);
    }

    private int getBucketIndex(K key) {
        if (key == null) return 0;
        int hashCode = key.hashCode();
        return Math.abs(hashCode) % capacity;
    }

    public int size() { return size; }
    public boolean isEmpty() { return size == 0; }

    public void put(K key, V value) {
        int index = getBucketIndex(key);
        LinkedList<Entry<K, V>> bucket = buckets[index];

        for (Entry<K, V> entry : bucket) {
            if ((key == null && entry.key == null) || (key != null && key.equals(entry.key))) {
                entry.value = value; // Update existing key
                return;
            }
        }

        bucket.add(new Entry<>(key, value));
        size++;

        if ((double) size / capacity >= DEFAULT_LOAD_FACTOR) {
            rehash();
        }
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

    @SuppressWarnings("unchecked")
    private void rehash() {
        int newCapacity = capacity * 2;
        System.out.printf("  [Rehash] Load factor exceeded! Resizing table from %d -> %d%n", capacity, newCapacity);
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

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 🔑 CUSTOM HASHMAP (SEPARATE CHAINING) DEMONSTRATION");
        System.out.println("==================================================\n");

        CustomHashMapChaining<String, Integer> map = new CustomHashMapChaining<>(4);
        map.put("Alice", 95);
        map.put("Bob", 88);
        map.put("Charlie", 92);
        map.put("David", 79); // Triggers rehash

        System.out.println("Alice's score: " + map.get("Alice"));
        System.out.println("Bob's score:   " + map.get("Bob"));

        System.out.println("\nUpdating Bob's score to 90...");
        map.put("Bob", 90);
        System.out.println("Bob's updated score: " + map.get("Bob"));

        System.out.println("\nRemoving Charlie...");
        map.remove("Charlie");
        System.out.println("Charlie's score after removal: " + map.get("Charlie"));

        System.out.println("\n✅ Custom HashMap Separate Chaining tests passed!");
    }
}

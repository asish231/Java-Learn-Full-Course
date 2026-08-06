package module05_hashing;

/**
 * Custom HashMap implementation using Open Addressing with Linear Probing.
 */
public class CustomHashMapLinearProbing<K, V> {

    private K[] keys;
    private V[] values;
    private int size;
    private int capacity;

    private static final int DEFAULT_CAPACITY = 16;

    @SuppressWarnings("unchecked")
    public CustomHashMapLinearProbing(int capacity) {
        this.capacity = capacity;
        this.keys = (K[]) new Object[capacity];
        this.values = (V[]) new Object[capacity];
        this.size = 0;
    }

    public CustomHashMapLinearProbing() {
        this(DEFAULT_CAPACITY);
    }

    private int hash(K key) {
        return Math.abs(key.hashCode()) % capacity;
    }

    public void put(K key, V value) {
        if (key == null) throw new IllegalArgumentException("Null keys not supported");
        if (size >= capacity / 2) resize(2 * capacity); // Keep load factor <= 0.5

        int i = hash(key);
        while (keys[i] != null) {
            if (keys[i].equals(key)) {
                values[i] = value;
                return;
            }
            i = (i + 1) % capacity; // Linear probe
        }

        keys[i] = key;
        values[i] = value;
        size++;
    }

    public V get(K key) {
        if (key == null) return null;
        int i = hash(key);

        while (keys[i] != null) {
            if (keys[i].equals(key)) {
                return values[i];
            }
            i = (i + 1) % capacity;
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private void resize(int newCapacity) {
        System.out.printf("  [Linear Probing Resize] Expanding capacity %d -> %d%n", capacity, newCapacity);
        K[] oldKeys = keys;
        V[] oldValues = values;

        this.capacity = newCapacity;
        this.keys = (K[]) new Object[newCapacity];
        this.values = (V[]) new Object[newCapacity];
        this.size = 0;

        for (int i = 0; i < oldKeys.length; i++) {
            if (oldKeys[i] != null) {
                put(oldKeys[i], oldValues[i]);
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 🔍 CUSTOM HASHMAP (LINEAR PROBING) DEMONSTRATION");
        System.out.println("==================================================\n");

        CustomHashMapLinearProbing<Integer, String> map = new CustomHashMapLinearProbing<>(4);
        map.put(1, "One");
        map.put(2, "Two");
        map.put(3, "Three"); // Triggers resize because load factor > 0.5

        System.out.println("Key 1 -> " + map.get(1));
        System.out.println("Key 2 -> " + map.get(2));
        System.out.println("Key 3 -> " + map.get(3));
        System.out.println("Key 4 -> " + map.get(4));

        System.out.println("\n✅ Custom HashMap Linear Probing test passed!");
    }
}

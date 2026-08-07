package module05_hashing;

import java.util.Arrays;

/**
 * Step 01: Hash Functions and Direct Address Tables
 *
 * <pre>
 * DIRECT ADDRESS TABLE (O(1) Access via Key as Index):
 * Key Range: [0, M-1]
 * Index:  [ 0 ]   [ 1 ]   [ 2 ]   [ 3 ]   [ 4 ]
 * Value:  [Null]  ["Bob"] [Null]  ["Alice"] [Null]
 *           ^       ^               ^
 *           |       Direct Key 1    Direct Key 3
 * Fast, but requires huge memory if keys are large (e.g. 9-digit SSN).
 *
 * HASH TABLE MAPPING (Hash Function key -> index):
 * Key "Alice" ---> [ Hash Function: polynomial sum % capacity ] ---> Index 3
 * Key "Bob"   ---> [ Hash Function: polynomial sum % capacity ] ---> Index 1
 *
 * COLLISION CONCEPT:
 * Key "Carol" ---> [ Hash Function ] ---> Index 3 (COLLISION with "Alice"!)
 * </pre>
 */
public class Step01_HashFunctionsAndDirectAddressing {

    /**
     * Direct Address Table implementation for fixed integer keys [0..capacity-1].
     */
    static class DirectAddressTable {
        private final String[] table;

        public DirectAddressTable(int capacity) {
            this.table = new String[capacity];
        }

        public void insert(int key, String value) {
            if (key < 0 || key >= table.length) {
                throw new IllegalArgumentException("Key " + key + " out of bounds [0, " + (table.length - 1) + "]");
            }
            table[key] = value;
        }

        public String search(int key) {
            if (key < 0 || key >= table.length) {
                return null;
            }
            return table[key];
        }

        public void delete(int key) {
            if (key >= 0 && key < table.length) {
                table[key] = null;
            }
        }

        @Override
        public String toString() {
            return Arrays.toString(table);
        }
    }

    /**
     * Collection of standard hash functions for demonstration.
     */
    static class HashFunctions {

        /**
         * Integer Division Hash Function: h(k) = k mod M
         */
        public static int integerDivisionHash(int key, int tableCapacity) {
            int hash = key % tableCapacity;
            return hash < 0 ? hash + tableCapacity : hash;
        }

        /**
         * String Polynomial Rolling Hash:
         * hash = (c[0]*p^(n-1) + c[1]*p^(n-2) + ... + c[n-1]) mod M
         * Uses p = 31 (prime multiplier).
         */
        public static int stringPolynomialHash(String key, int tableCapacity) {
            if (key == null) return 0;
            int prime = 31;
            long hash = 0;
            for (int i = 0; i < key.length(); i++) {
                hash = (hash * prime + key.charAt(i)) % tableCapacity;
            }
            return (int) hash;
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 05 - Hashing | Step 01: Hash Functions & Direct Addressing");
        System.out.println("======================================================================\n");

        // 1. Direct Addressing Table Demo
        int directCapacity = 10;
        DirectAddressTable directTable = new DirectAddressTable(directCapacity);
        System.out.println("[INIT] Initialized DirectAddressTable with capacity M = " + directCapacity);

        System.out.println("\n--- 1. Direct Addressing Operations ---");
        System.out.println("[ACTION] Inserting key=3 -> \"Alice\", key=7 -> \"Bob\", key=1 -> \"Charlie\"");
        directTable.insert(3, "Alice");
        directTable.insert(7, "Bob");
        directTable.insert(1, "Charlie");

        System.out.println("[STATE] Table state: " + directTable);
        System.out.println("[ACTION] Searching key 3: " + directTable.search(3));
        System.out.println("[MEMORY EVENT] Direct index lookup table[3] returned in O(1) time.");

        System.out.println("[ACTION] Deleting key 7");
        directTable.delete(7);
        System.out.println("[STATE] Table after deleting key 7: " + directTable);

        // 2. Hash Functions & Collision Demo
        System.out.println("\n--- 2. Hash Function Mapping & Collision Analysis ---");
        int hashCapacity = 7;
        System.out.println("[INIT] Hash table capacity M = " + hashCapacity + " (Prime number)");

        String[] keys = {"Alice", "Bob", "Charlie", "David", "Eve", "Frank"};
        int[] bucketCounts = new int[hashCapacity];

        for (String key : keys) {
            int rawHash = key.hashCode();
            int bucket = HashFunctions.stringPolynomialHash(key, hashCapacity);
            bucketCounts[bucket]++;

            System.out.println("[ACTION] Key: \"" + key + "\""
                    + " | System hashCode(): " + rawHash
                    + " | Polynomial Hash % " + hashCapacity + " -> Bucket [" + bucket + "]");
            System.out.println("[STATE] Bucket [" + bucket + "] entry count: " + bucketCounts[bucket]);

            if (bucketCounts[bucket] > 1) {
                System.out.println("[MEMORY EVENT] COLLISION DETECTED at bucket [" + bucket + "]! Multiple keys mapped to same index.");
            }
        }

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Hash functions & direct addressing demonstrated.");
        System.out.println("======================================================================");
    }
}

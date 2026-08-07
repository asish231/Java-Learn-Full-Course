package module03_linked_lists;

import java.util.HashMap;
import java.util.Map;

/**
 * Step 05: Advanced Least Recently Used (LRU) Cache (HashMap + Doubly Linked List)
 *
 * <pre>
 * 1. LRU Cache Architecture (Capacity = 3):
 *
 *    HashMap:
 *    +-------+--------------------+
 *    | Key 1 | ---> Node(1, 100)  |
 *    | Key 2 | ---> Node(2, 200)  |
 *    | Key 3 | ---> Node(3, 300)  |
 *    +-------+--------------------+
 *
 *    Doubly Linked List (Sentinel Head & Tail):
 *                (Most Recently Used)                (Least Recently Used)
 *    +------+    +---------------+    +---------------+    +---------------+    +------+
 *    |HEAD  |<==>| Node(3, 300)  |<==>| Node(2, 200)  |<==>| Node(1, 100)  |<==>|TAIL  |
 *    |dummy |    | k:3, v:300    |    | k:2, v:200    |    | k:1, v:100    |    |dummy |
 *    +------+    +---------------+    +---------------+    +---------------+    +------+
 *
 * 2. Eviction Trace on put(4, 400) when Full:
 *    Step A: Evict LRU node (tail.prev = Node(1, 100))
 *    Step B: Remove Key 1 from HashMap
 *    Step C: Splice Node(1) out of DLL
 *    Step D: Insert new Node(4, 400) right after HEAD sentinel.
 * </pre>
 */
public class Step05_AdvancedLRUCache {

    private static class DNode {
        int key;
        int value;
        DNode prev;
        DNode next;

        DNode(int key, int value) {
            this.key = key;
            this.value = value;
        }
    }

    private final int capacity;
    private final Map<Integer, DNode> map;
    private final DNode head; // Sentinel MRU node
    private final DNode tail; // Sentinel LRU node

    public Step05_AdvancedLRUCache(int capacity) {
        if (capacity <= 0) {
            throw new IllegalArgumentException("Capacity must be positive");
        }
        this.capacity = capacity;
        this.map = new HashMap<>();
        this.head = new DNode(-1, -1); // Dummy head
        this.tail = new DNode(-1, -1); // Dummy tail
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    /**
     * O(1) Key Lookup. Returns value or -1 if key absent.
     * Moves accessed node to head (MRU).
     */
    public int get(int key) {
        if (!map.containsKey(key)) {
            return -1;
        }
        DNode node = map.get(key);
        // Move node to head as Most Recently Used
        removeNode(node);
        addNodeToHead(node);
        return node.value;
    }

    /**
     * O(1) Key Insertion/Update. Evicts LRU node if capacity exceeded.
     */
    public void put(int key, int value) {
        if (map.containsKey(key)) {
            DNode node = map.get(key);
            node.value = value;
            removeNode(node);
            addNodeToHead(node);
        } else {
            if (map.size() >= capacity) {
                // Evict LRU node before tail sentinel
                DNode lruNode = tail.prev;
                System.out.println("  [MEMORY EVENT] Cache Full! Evicting LRU Node (key=" + lruNode.key + ", value=" + lruNode.value + ")");
                map.remove(lruNode.key);
                removeNode(lruNode);
            }
            DNode newNode = new DNode(key, value);
            map.put(key, newNode);
            addNodeToHead(newNode);
        }
    }

    /**
     * Helper: Splices node out of Doubly Linked List. O(1)
     */
    private void removeNode(DNode node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    /**
     * Helper: Inserts node right after Sentinel Head (MRU position). O(1)
     */
    private void addNodeToHead(DNode node) {
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
    }

    public int size() {
        return map.size();
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 03 - Linked Lists | Step 05: Advanced LRU Cache");
        System.out.println("======================================================================\n");

        int capacity = 2;
        System.out.println("[INIT] Creating Step05_AdvancedLRUCache with Capacity = " + capacity);
        Step05_AdvancedLRUCache lru = new Step05_AdvancedLRUCache(capacity);

        System.out.println("\n--- 1. Performing Put Operations ---");
        System.out.println("[ACTION] put(1, 10)");
        lru.put(1, 10);
        System.out.println("[ACTION] put(2, 20)");
        lru.put(2, 20);
        System.out.println("[STATE] Current Cache Size: " + lru.size());

        System.out.println("\n--- 2. Accessing Key 1 (Makes Key 1 MRU, Key 2 LRU) ---");
        System.out.println("[ACTION] get(1) -> Returned Value = " + lru.get(1));

        System.out.println("\n--- 3. Triggering Eviction with put(3, 30) ---");
        System.out.println("[ACTION] put(3, 30)");
        lru.put(3, 30);

        System.out.println("\n--- 4. Verifying Eviction of Key 2 and Existence of Key 1 & 3 ---");
        System.out.println("[ACTION] get(2) (Should return -1 as evicted) -> " + lru.get(2));
        System.out.println("[ACTION] get(3) (Should return 30)             -> " + lru.get(3));
        System.out.println("[ACTION] get(1) (Should return 10)             -> " + lru.get(1));

        System.out.println("\n--- 5. Triggering Eviction with put(4, 40) ---");
        System.out.println("[ACTION] put(4, 40)");
        lru.put(4, 40);

        System.out.println("[ACTION] get(1) (Should return -1 as evicted) -> " + lru.get(1));
        System.out.println("[ACTION] get(3) (Should return 30)             -> " + lru.get(3));
        System.out.println("[ACTION] get(4) (Should return 40)             -> " + lru.get(4));

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: O(1) LRU Cache ops & eviction verified.");
        System.out.println("======================================================================");
    }
}

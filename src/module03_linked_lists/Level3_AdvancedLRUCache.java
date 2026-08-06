package module03_linked_lists;

import java.util.HashMap;
import java.util.Map;

/**
 * LEVEL 3 (ADVANCED / FAANG): LRU Cache (Least Recently Used)
 * LeetCode 146 - Built using Doubly LinkedList + HashMap in O(1) time per operation.
 */
public class Level3_AdvancedLRUCache {

    static class DNode {
        int key, value;
        DNode prev, next;
        DNode(int k, int v) { this.key = k; this.value = v; }
    }

    private final int capacity;
    private final Map<Integer, DNode> map;
    private final DNode head, tail;

    public Level3_AdvancedLRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new HashMap<>();
        this.head = new DNode(0, 0);
        this.tail = new DNode(0, 0);
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        DNode node = map.get(key);
        removeNode(node);
        addNodeToHead(node); // Move to head (Most Recently Used)
        return node.value;
    }

    public void put(int key, int value) {
        if (map.containsKey(key)) {
            DNode node = map.get(key);
            node.value = value;
            removeNode(node);
            addNodeToHead(node);
        } else {
            if (map.size() == capacity) {
                map.remove(tail.prev.key); // Evict LRU item before tail
                removeNode(tail.prev);
            }
            DNode newNode = new DNode(key, value);
            map.put(key, newNode);
            addNodeToHead(newNode);
        }
    }

    private void addNodeToHead(DNode node) {
        node.next = head.next;
        node.next.prev = node;
        node.prev = head;
        head.next = node;
    }

    private void removeNode(DNode node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    public static void main(String[] args) {
        System.out.println("--- Module 03: Level 3 (Advanced LRU Cache Hard) ---");
        Level3_AdvancedLRUCache lru = new Level3_AdvancedLRUCache(2);
        lru.put(1, 10);
        lru.put(2, 20);
        System.out.println("Get(1): " + lru.get(1)); // 10 (Item 1 becomes MRU)

        lru.put(3, 30); // Evicts key 2 (LRU)
        System.out.println("Get(2) after evicting 2: " + lru.get(2)); // -1 (Not found)
        System.out.println("Get(3): " + lru.get(3)); // 30
    }
}

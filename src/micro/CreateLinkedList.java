package micro;

/**
 * 💡 MICRO TUTORIAL: Singly Linked List Node & Traversal
 * 
 * Memory Model: Non-contiguous nodes connected via pointers.
 * Time Complexities:
 * - Insert Head: O(1)
 * - Traverse / Search: O(N)
 */
public class CreateLinkedList {
    static class Node {
        int val;
        Node next;
        Node(int val) { this.val = val; }
    }

    public static void main(String[] args) {
        // 1. Manually connect nodes: 10 -> 20 -> 30 -> null
        Node head = new Node(10);
        head.next = new Node(20);
        head.next.next = new Node(30);

        // 2. Traversal - O(N)
        Node curr = head;
        System.out.print("Linked List: ");
        while (curr != null) {
            System.out.print(curr.val + " -> ");
            curr = curr.next;
        }
        System.out.println("null");
    }
}

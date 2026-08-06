package module03_linked_lists;

import module03_linked_lists.SinglyLinkedList.Node;

/**
 * Key Linked List Algorithms:
 * 1. Floyd's Cycle Detection Algorithm (Detect loop in Linked List)
 * 2. Find Middle Node of Linked List
 */
public class LinkedListAlgorithms {

    /**
     * Floyd's Cycle Detection Algorithm - O(N) Time, O(1) Space
     */
    public static <T> boolean hasCycle(Node<T> head) {
        if (head == null || head.next == null) return false;

        Node<T> slow = head;
        Node<T> fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;

            if (slow == fast) {
                return true; // Cycle detected!
            }
        }
        return false;
    }

    /**
     * Finds middle element of a Singly Linked List using Fast & Slow pointers.
     */
    public static <T> Node<T> findMiddle(Node<T> head) {
        if (head == null) return null;

        Node<T> slow = head;
        Node<T> fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }

        return slow;
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 🐢🐇 LINKED LIST ALGORITHMS DEMONSTRATION");
        System.out.println("==================================================\n");

        // 1. Cycle Detection Demo
        Node<Integer> n1 = new Node<>(1);
        Node<Integer> n2 = new Node<>(2);
        Node<Integer> n3 = new Node<>(3);
        Node<Integer> n4 = new Node<>(4);

        n1.next = n2;
        n2.next = n3;
        n3.next = n4;

        System.out.println("List 1 (1 -> 2 -> 3 -> 4 -> null) Has Cycle? " + hasCycle(n1));

        // Create cycle: n4.next -> n2
        n4.next = n2;
        System.out.println("List 1 (with loop 4 -> 2) Has Cycle? " + hasCycle(n1));

        // 2. Middle Node Demo (Linear list: 10 -> 20 -> 30 -> 40 -> 50)
        Node<Integer> head = new Node<>(10);
        head.next = new Node<>(20);
        head.next.next = new Node<>(30);
        head.next.next.next = new Node<>(40);
        head.next.next.next.next = new Node<>(50);

        Node<Integer> middle = findMiddle(head);
        System.out.println("\nMiddle node of (10 -> 20 -> 30 -> 40 -> 50) is: " + (middle != null ? middle.data : "null"));

        System.out.println("\n✅ Linked List Algorithms tests completed!");
    }
}

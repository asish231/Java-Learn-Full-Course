package module03_linked_lists;

/**
 * LEVEL 1 (BASIC): Singly Linked List CRUD Operations (Easy)
 */
public class Level1_BasicLinkedList {
    static class Node {
        int val;
        Node next;
        Node(int val) { this.val = val; }
    }

    public static Node insertHead(Node head, int val) {
        Node newNode = new Node(val);
        newNode.next = head;
        return newNode;
    }

    public static Node deleteValue(Node head, int val) {
        if (head == null) return null;
        if (head.val == val) return head.next;

        Node curr = head;
        while (curr.next != null && curr.next.val != val) {
            curr = curr.next;
        }
        if (curr.next != null) {
            curr.next = curr.next.next;
        }
        return head;
    }

    public static void printList(Node head) {
        Node curr = head;
        while (curr != null) {
            System.out.print(curr.val + " -> ");
            curr = curr.next;
        }
        System.out.println("null");
    }

    public static void main(String[] args) {
        System.out.println("--- Module 03: Level 1 (Basic Linked List CRUD) ---");
        Node head = null;
        head = insertHead(head, 30);
        head = insertHead(head, 20);
        head = insertHead(head, 10);
        System.out.print("Created list: ");
        printList(head);

        head = deleteValue(head, 20);
        System.out.print("After deleting 20: ");
        printList(head);
    }
}

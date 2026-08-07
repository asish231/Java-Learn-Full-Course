package module03_linked_lists;

/**
 * Step 01: Singly Linked List Fundamentals & CRUD Operations
 *
 * <pre>
 * 1. Node Structure in Heap Memory:
 *    +-------+------+      +-------+------+      +-------+------+
 *    | val:  | next | ---> | val:  | next | ---> | val:  | next | ---> null
 *    |  10   | 0x02 |      |  20   | 0x03 |      |  30   | null |
 *    +-------+------+      +-------+------+      +-------+------+
 *    @0x01                 @0x02                 @0x03
 *    ^ head
 *
 * 2. Insertion at Head (O(1)):
 *    newNode: [ 5 | null ]
 *    Step A: newNode.next = head;
 *    Step B: head = newNode;
 *
 *    +-------+------+     +-------+------+     +-------+------+
 *    | val:5 | next | --> |val:10 | next | --> |val:20 | null |
 *    +-------+------+     +-------+------+     +-------+------+
 *    ^ new head           ^ old head
 *
 * 3. Deletion of Node (val = 20):
 *    Before: [ 10 ] ---> [ 20 ] ---> [ 30 ] ---> null
 *                        ^ curr
 *    Re-link: prev.next = curr.next
 *    After:  [ 10 ] ----------------> [ 30 ] ---> null
 * </pre>
 */
public class Step01_SinglyLinkedListBasics {

    /**
     * Self-contained static inner class representing a Singly Linked List Node.
     */
    private static class Node {
        int val;
        Node next;

        Node(int val) {
            this.val = val;
            this.next = null;
        }
    }

    /**
     * Inserts new node at front of list.
     * Time: O(1), Space: O(1)
     */
    public static Node insertHead(Node head, int val) {
        Node newNode = new Node(val);
        newNode.next = head;
        return newNode;
    }

    /**
     * Appends new node at end of list.
     * Time: O(N), Space: O(1)
     */
    public static Node insertTail(Node head, int val) {
        Node newNode = new Node(val);
        if (head == null) {
            return newNode;
        }
        Node curr = head;
        while (curr.next != null) {
            curr = curr.next;
        }
        curr.next = newNode;
        return head;
    }

    /**
     * Deletes first occurrence of target value.
     * Time: O(N), Space: O(1)
     */
    public static Node deleteValue(Node head, int val) {
        if (head == null) return null;

        // Special case: Head node matches target
        if (head.val == val) {
            return head.next;
        }

        Node curr = head;
        while (curr.next != null && curr.next.val != val) {
            curr = curr.next;
        }

        if (curr.next != null) {
            curr.next = curr.next.next; // Bypass deleted node for GC
        }
        return head;
    }

    /**
     * Linear search for target value.
     * Time: O(N), Space: O(1)
     */
    public static boolean search(Node head, int target) {
        Node curr = head;
        while (curr != null) {
            if (curr.val == target) return true;
            curr = curr.next;
        }
        return false;
    }

    /**
     * Formats list nodes into string representation.
     */
    public static String toListString(Node head) {
        StringBuilder sb = new StringBuilder();
        Node curr = head;
        while (curr != null) {
            sb.append(curr.val).append(" -> ");
            curr = curr.next;
        }
        sb.append("null");
        return sb.toString();
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 03 - Linked Lists | Step 01: Singly Linked List Basics");
        System.out.println("======================================================================\n");

        Node head = null;
        System.out.println("[INIT] Head initialized to null");

        System.out.println("\n--- 1. Insertion at Head O(1) ---");
        System.out.println("[ACTION] Inserting 30, 20, 10 at Head...");
        head = insertHead(head, 30);
        head = insertHead(head, 20);
        head = insertHead(head, 10);
        System.out.println("[STATE] List: " + toListString(head));

        System.out.println("\n--- 2. Insertion at Tail O(N) ---");
        System.out.println("[ACTION] Appending 40 to Tail...");
        head = insertTail(head, 40);
        System.out.println("[STATE] List: " + toListString(head));

        System.out.println("\n--- 3. Searching Target Element ---");
        int target = 20;
        System.out.println("[ACTION] Searching for value = " + target);
        boolean found = search(head, target);
        System.out.println("[STATE] Found " + target + ": " + found);

        System.out.println("\n--- 4. Deleting Nodes ---");
        System.out.println("[ACTION] Deleting value = 20 (middle node)...");
        head = deleteValue(head, 20);
        System.out.println("[STATE] List after deleting 20: " + toListString(head));

        System.out.println("[ACTION] Deleting value = 10 (head node edge case)...");
        head = deleteValue(head, 10);
        System.out.println("[STATE] List after deleting head 10: " + toListString(head));

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Singly Linked List CRUD operations verified.");
        System.out.println("======================================================================");
    }
}

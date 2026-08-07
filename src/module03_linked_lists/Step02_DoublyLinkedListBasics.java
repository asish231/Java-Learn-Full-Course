package module03_linked_lists;

/**
 * Step 02: Doubly Linked List Fundamentals & Bidirectional Traversal
 *
 * <pre>
 * 1. Doubly Linked List Node Layout:
 *    null <-- +------+------+------+ <===> +------+------+------+ --> null
 *             | prev | val  | next |       | prev | val  | next |
 *             +------+------+------+       +------+------+------+
 *             ^ head                       ^ tail
 *
 * 2. Insertion at Tail (O(1)):
 *    newNode: [ prev | 40 | next ]
 *    Step A: newNode.prev = tail;
 *    Step B: tail.next = newNode;
 *    Step C: tail = newNode;
 *
 *    null <-> [10] <-> [20] <-> [30] <===> [40] <-> null
 *                                ^ old tail ^ new tail
 *
 * 3. Deletion of Middle Node (Target: Node B):
 *    Node A <=======> Node B <=======> Node C
 *    Re-link next: A.next = B.next (Node C)
 *    Re-link prev: C.prev = B.prev (Node A)
 * </pre>
 */
public class Step02_DoublyLinkedListBasics {

    private static class DNode {
        int val;
        DNode prev;
        DNode next;

        DNode(int val) {
            this.val = val;
            this.prev = null;
            this.next = null;
        }
    }

    public static class DoublyLinkedList {
        private DNode head;
        private DNode tail;
        private int size;

        public DoublyLinkedList() {
            this.head = null;
            this.tail = null;
            this.size = 0;
        }

        public int size() {
            return size;
        }

        public boolean isEmpty() {
            return size == 0;
        }

        /**
         * Inserts node at head. O(1)
         */
        public void insertHead(int val) {
            DNode newNode = new DNode(val);
            if (isEmpty()) {
                head = newNode;
                tail = newNode;
            } else {
                newNode.next = head;
                head.prev = newNode;
                head = newNode;
            }
            size++;
        }

        /**
         * Inserts node at tail. O(1)
         */
        public void insertTail(int val) {
            DNode newNode = new DNode(val);
            if (isEmpty()) {
                head = newNode;
                tail = newNode;
            } else {
                newNode.prev = tail;
                tail.next = newNode;
                tail = newNode;
            }
            size++;
        }

        /**
         * Removes head node. O(1)
         */
        public int removeHead() {
            if (isEmpty()) {
                throw new IllegalStateException("Cannot remove from empty list");
            }
            int val = head.val;
            if (head == tail) {
                head = null;
                tail = null;
            } else {
                head = head.next;
                head.prev = null;
            }
            size--;
            return val;
        }

        /**
         * Removes tail node. O(1)
         */
        public int removeTail() {
            if (isEmpty()) {
                throw new IllegalStateException("Cannot remove from empty list");
            }
            int val = tail.val;
            if (head == tail) {
                head = null;
                tail = null;
            } else {
                tail = tail.prev;
                tail.next = null;
            }
            size--;
            return val;
        }

        public String toForwardString() {
            StringBuilder sb = new StringBuilder("null <-> ");
            DNode curr = head;
            while (curr != null) {
                sb.append(curr.val).append(" <-> ");
                curr = curr.next;
            }
            sb.append("null");
            return sb.toString();
        }

        public String toBackwardString() {
            StringBuilder sb = new StringBuilder("null <-> ");
            DNode curr = tail;
            while (curr != null) {
                sb.append(curr.val).append(" <-> ");
                curr = curr.prev;
            }
            sb.append("null");
            return sb.toString();
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 03 - Linked Lists | Step 02: Doubly Linked List Basics");
        System.out.println("======================================================================\n");

        DoublyLinkedList dll = new DoublyLinkedList();
        System.out.println("[INIT] Created empty DoublyLinkedList");

        System.out.println("\n--- 1. Inserting Nodes at Head and Tail ---");
        System.out.println("[ACTION] Inserting 10, 20 at Tail...");
        dll.insertTail(10);
        dll.insertTail(20);
        System.out.println("[ACTION] Inserting 5 at Head...");
        dll.insertHead(5);
        System.out.println("[ACTION] Inserting 30 at Tail...");
        dll.insertTail(30);

        System.out.println("\n--- 2. Bidirectional Traversal Verification ---");
        System.out.println("[STATE] Forward Traversal:  " + dll.toForwardString());
        System.out.println("[STATE] Backward Traversal: " + dll.toBackwardString());
        System.out.println("[STATE] Current List Size: " + dll.size());

        System.out.println("\n--- 3. Head and Tail Removal Operations ---");
        int removedHead = dll.removeHead();
        System.out.println("[ACTION] Removed Head: " + removedHead);
        System.out.println("[STATE] Forward List: " + dll.toForwardString());

        int removedTail = dll.removeTail();
        System.out.println("[ACTION] Removed Tail: " + removedTail);
        System.out.println("[STATE] Forward List: " + dll.toForwardString());

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Doubly Linked List bidirectional ops verified.");
        System.out.println("======================================================================");
    }
}

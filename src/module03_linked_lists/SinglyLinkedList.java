package module03_linked_lists;

/**
 * Singly Linked List Implementation with core operations:
 * - insertFirst, insertLast, deleteKey, reverse, display.
 */
public class SinglyLinkedList<T> {

    public static class Node<T> {
        public T data;
        public Node<T> next;

        public Node(T data) {
            this.data = data;
            this.next = null;
        }
    }

    private Node<T> head;
    private int size;

    public SinglyLinkedList() {
        this.head = null;
        this.size = 0;
    }

    public int size() {
        return size;
    }

    public boolean isEmpty() {
        return head == null;
    }

    public Node<T> getHead() {
        return head;
    }

    /**
     * Inserts node at the beginning of the list - O(1)
     */
    public void insertFirst(T data) {
        Node<T> newNode = new Node<>(data);
        newNode.next = head;
        head = newNode;
        size++;
    }

    /**
     * Inserts node at the end of the list - O(N)
     */
    public void insertLast(T data) {
        Node<T> newNode = new Node<>(data);
        if (isEmpty()) {
            head = newNode;
        } else {
            Node<T> current = head;
            while (current.next != null) {
                current = current.next;
            }
            current.next = newNode;
        }
        size++;
    }

    /**
     * Deletes the first node containing specified value - O(N)
     */
    public boolean delete(T key) {
        if (isEmpty()) return false;

        if (head.data.equals(key)) {
            head = head.next;
            size--;
            return true;
        }

        Node<T> current = head;
        while (current.next != null && !current.next.data.equals(key)) {
            current = current.next;
        }

        if (current.next != null) {
            current.next = current.next.next;
            size--;
            return true;
        }
        return false;
    }

    /**
     * Reverses the singly linked list in-place - O(N) Time, O(1) Space
     */
    public void reverse() {
        Node<T> prev = null;
        Node<T> current = head;
        Node<T> next = null;

        while (current != null) {
            next = current.next; // Store next node
            current.next = prev; // Reverse pointer
            prev = current;      // Advance prev
            current = next;      // Advance current
        }
        head = prev;
    }

    public void display() {
        Node<T> temp = head;
        StringBuilder sb = new StringBuilder();
        while (temp != null) {
            sb.append(temp.data).append(" -> ");
            temp = temp.next;
        }
        sb.append("null");
        System.out.println(sb.toString());
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 🔗 SINGLY LINKED LIST DEMONSTRATION");
        System.out.println("==================================================\n");

        SinglyLinkedList<Integer> list = new SinglyLinkedList<>();
        list.insertLast(10);
        list.insertLast(20);
        list.insertLast(30);
        list.insertFirst(5);

        System.out.print("Initial Linked List: ");
        list.display(); // 5 -> 10 -> 20 -> 30 -> null

        System.out.println("\nDeleting value 20...");
        list.delete(20);
        list.display(); // 5 -> 10 -> 30 -> null

        System.out.println("\nReversing the Linked List in-place...");
        list.reverse();
        list.display(); // 30 -> 10 -> 5 -> null

        System.out.println("\n✅ Singly Linked List tests completed successfully!");
    }
}

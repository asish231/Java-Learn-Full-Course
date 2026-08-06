package module03_linked_lists;

/**
 * Doubly Linked List Implementation with Head and Tail pointers.
 */
public class DoublyLinkedList<T> {

    public static class Node<T> {
        public T data;
        public Node<T> next;
        public Node<T> prev;

        public Node(T data) {
            this.data = data;
        }
    }

    private Node<T> head;
    private Node<T> tail;
    private int size;

    public DoublyLinkedList() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    public int size() { return size; }
    public boolean isEmpty() { return size == 0; }

    public void insertFirst(T data) {
        Node<T> newNode = new Node<>(data);
        if (isEmpty()) {
            head = tail = newNode;
        } else {
            newNode.next = head;
            head.prev = newNode;
            head = newNode;
        }
        size++;
    }

    public void insertLast(T data) {
        Node<T> newNode = new Node<>(data);
        if (isEmpty()) {
            head = tail = newNode;
        } else {
            tail.next = newNode;
            newNode.prev = tail;
            tail = newNode;
        }
        size++;
    }

    public T removeFirst() {
        if (isEmpty()) throw new IllegalStateException("List is empty");
        T data = head.data;
        if (head == tail) {
            head = tail = null;
        } else {
            head = head.next;
            head.prev = null;
        }
        size--;
        return data;
    }

    public T removeLast() {
        if (isEmpty()) throw new IllegalStateException("List is empty");
        T data = tail.data;
        if (head == tail) {
            head = tail = null;
        } else {
            tail = tail.prev;
            tail.next = null;
        }
        size--;
        return data;
    }

    public void displayForward() {
        Node<T> curr = head;
        StringBuilder sb = new StringBuilder("Forward: null <-> ");
        while (curr != null) {
            sb.append(curr.data).append(" <-> ");
            curr = curr.next;
        }
        sb.append("null");
        System.out.println(sb.toString());
    }

    public void displayBackward() {
        Node<T> curr = tail;
        StringBuilder sb = new StringBuilder("Backward: null <-> ");
        while (curr != null) {
            sb.append(curr.data).append(" <-> ");
            curr = curr.prev;
        }
        sb.append("null");
        System.out.println(sb.toString());
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 🔀 DOUBLY LINKED LIST DEMONSTRATION");
        System.out.println("==================================================\n");

        DoublyLinkedList<String> dll = new DoublyLinkedList<>();
        dll.insertLast("Apple");
        dll.insertLast("Banana");
        dll.insertFirst("Cherry");

        dll.displayForward();  // Cherry <-> Apple <-> Banana
        dll.displayBackward(); // Banana <-> Apple <-> Cherry

        System.out.println("\nRemoving first element: " + dll.removeFirst());
        dll.displayForward();

        System.out.println("Removing last element: " + dll.removeLast());
        dll.displayForward();

        System.out.println("\n✅ Doubly Linked List tests completed!");
    }
}

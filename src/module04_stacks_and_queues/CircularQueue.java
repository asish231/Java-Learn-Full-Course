package module04_stacks_and_queues;

/**
 * Array-backed Circular FIFO Queue Implementation.
 */
public class CircularQueue<T> {
    private Object[] data;
    private int front;
    private int rear;
    private int size;
    private int capacity;

    public CircularQueue(int capacity) {
        this.capacity = capacity;
        this.data = new Object[capacity];
        this.front = 0;
        this.rear = -1;
        this.size = 0;
    }

    public int size() { return size; }
    public boolean isEmpty() { return size == 0; }
    public boolean isFull() { return size == capacity; }

    public void enqueue(T item) {
        if (isFull()) {
            throw new IllegalStateException("Queue is full!");
        }
        rear = (rear + 1) % capacity;
        data[rear] = item;
        size++;
    }

    @SuppressWarnings("unchecked")
    public T dequeue() {
        if (isEmpty()) {
            throw new IllegalStateException("Queue is empty!");
        }
        T item = (T) data[front];
        data[front] = null;
        front = (front + 1) % capacity;
        size--;
        return item;
    }

    @SuppressWarnings("unchecked")
    public T peek() {
        if (isEmpty()) throw new IllegalStateException("Queue is empty!");
        return (T) data[front];
    }

    @Override
    public String toString() {
        if (isEmpty()) return "Queue []";
        StringBuilder sb = new StringBuilder("Queue [front -> ");
        for (int i = 0; i < size; i++) {
            int idx = (front + i) % capacity;
            sb.append(data[idx]);
            if (i < size - 1) sb.append(", ");
        }
        sb.append(" <- rear]");
        return sb.toString();
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" ⭕ CIRCULAR QUEUE DEMONSTRATION");
        System.out.println("==================================================\n");

        CircularQueue<String> queue = new CircularQueue<>(4);
        queue.enqueue("Task 1");
        queue.enqueue("Task 2");
        queue.enqueue("Task 3");
        queue.enqueue("Task 4");

        System.out.println("Full " + queue);

        System.out.println("Dequeued: " + queue.dequeue());
        System.out.println("Dequeued: " + queue.dequeue());

        System.out.println("Queue after 2 dequeues: " + queue);

        System.out.println("Enqueuing Task 5 and Task 6...");
        queue.enqueue("Task 5");
        queue.enqueue("Task 6"); // Wraps around index space

        System.out.println("Circular Queue state: " + queue);

        System.out.println("\n✅ Circular Queue test completed!");
    }
}

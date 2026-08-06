package quickstart;

import java.util.ArrayDeque;
import java.util.Deque;

/**
 * Minimal example of creating Stack (LIFO) and Queue (FIFO) using ArrayDeque in Java.
 */
public class StackAndQueueQuickstart {
    public static void main(String[] args) {
        // 1. Stack (LIFO: Push & Pop from top)
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(10);
        stack.push(20);
        stack.push(30);

        System.out.println("Stack Top element (peek): " + stack.peek());
        System.out.println("Popped element: " + stack.pop());

        // 2. Queue (FIFO: Offer at rear, Poll from front)
        Deque<String> queue = new ArrayDeque<>();
        queue.offer("First");
        queue.offer("Second");
        queue.offer("Third");

        System.out.println("\nQueue Front element (peek): " + queue.peek());
        System.out.println("Dequeued element: " + queue.poll());
    }
}

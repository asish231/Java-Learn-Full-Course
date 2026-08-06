package micro;

import java.util.ArrayDeque;
import java.util.Deque;

/**
 * 💡 MICRO TUTORIAL: Stack (LIFO) & Queue (FIFO)
 * 
 * Best Practice: Use ArrayDeque for both Stack and Queue in Java.
 * Time Complexity for push/pop/offer/poll: O(1)
 */
public class CreateStackAndQueue {
    public static void main(String[] args) {
        // --- 1. STACK (Last-In, First-Out) ---
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(10); // Push to top
        stack.push(20);
        int top = stack.peek(); // 20 (inspect)
        int popped = stack.pop(); // 20 (remove)

        // --- 2. QUEUE (First-In, First-Out) ---
        Deque<String> queue = new ArrayDeque<>();
        queue.offer("A"); // Enqueue rear
        queue.offer("B");
        String front = queue.peek(); // "A" (inspect)
        String dequeued = queue.poll(); // "A" (remove)

        System.out.println("Stack top was: " + top + ", Popped: " + popped);
        System.out.println("Queue front was: " + front + ", Dequeued: " + dequeued);
    }
}

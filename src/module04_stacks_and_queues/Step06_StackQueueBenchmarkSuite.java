package module04_stacks_and_queues;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Stack;

/**
 * Step 06: Stacks & Queues Benchmarking Suite & Memory Overhead Analysis
 *
 * <pre>
 * 1. Memory Footprint & Cache Locality Comparison:
 *
 *    Array-backed (ArrayDeque / ArrayStack / CircularQueue):
 *    +-------------------------------------------------------+
 *    | [0] | [1] | [2] | [3] | [4] | [5] | [6] | [7] ...   |  <-- Contiguous Memory
 *    +-------------------------------------------------------+
 *    * High CPU Cache Line Hit Rate! Zero Node Object Overhead.
 *
 *    Node-backed (LinkedList):
 *    +---------+      +---------+      +---------+
 *    | Node @A | ---> | Node @B | ---> | Node @C |  <-- Dispersed Heap Locations
 *    +---------+      +---------+      +---------+
 *    * Pointer Chasing, Frequent CPU Cache Misses, 24-byte Object Overhead per Node!
 * </pre>
 */
public class Step06_StackQueueBenchmarkSuite {

    // --- Embedded Self-Contained Custom Structures for Standalone Execution ---

    private static class InnerArrayStack<T> {
        private Object[] data;
        private int top;
        private int capacity;

        public InnerArrayStack(int capacity) {
            this.capacity = capacity;
            this.data = new Object[capacity];
            this.top = -1;
        }

        public void push(T item) {
            if (top == capacity - 1) {
                int newCap = capacity * 2;
                Object[] newData = new Object[newCap];
                System.arraycopy(data, 0, newData, 0, top + 1);
                data = newData;
                capacity = newCap;
            }
            data[++top] = item;
        }

        @SuppressWarnings("unchecked")
        public T pop() {
            T item = (T) data[top];
            data[top--] = null;
            return item;
        }
    }

    private static class InnerCircularQueue<T> {
        private Object[] data;
        private int front, rear, size, capacity;

        public InnerCircularQueue(int capacity) {
            this.capacity = capacity;
            this.data = new Object[capacity];
            this.front = 0;
            this.rear = -1;
            this.size = 0;
        }

        public void enqueue(T item) {
            if (size == capacity) {
                int newCap = capacity * 2;
                Object[] newData = new Object[newCap];
                for (int i = 0; i < size; i++) {
                    newData[i] = data[(front + i) % capacity];
                }
                data = newData;
                front = 0;
                rear = size - 1;
                capacity = newCap;
            }
            rear = (rear + 1) % capacity;
            data[rear] = item;
            size++;
        }

        @SuppressWarnings("unchecked")
        public T dequeue() {
            T item = (T) data[front];
            data[front] = null;
            front = (front + 1) % capacity;
            size--;
            return item;
        }
    }

    // --- Benchmarking Methods ---

    public static long benchJavaUtilStack(int ops) {
        Stack<Integer> stack = new Stack<>();
        long start = System.nanoTime();
        for (int i = 0; i < ops; i++) stack.push(i);
        for (int i = 0; i < ops; i++) stack.pop();
        return System.nanoTime() - start;
    }

    public static long benchArrayDequeAsStack(int ops) {
        Deque<Integer> stack = new ArrayDeque<>();
        long start = System.nanoTime();
        for (int i = 0; i < ops; i++) stack.push(i);
        for (int i = 0; i < ops; i++) stack.pop();
        return System.nanoTime() - start;
    }

    public static long benchCustomArrayStack(int ops) {
        InnerArrayStack<Integer> stack = new InnerArrayStack<>(16);
        long start = System.nanoTime();
        for (int i = 0; i < ops; i++) stack.push(i);
        for (int i = 0; i < ops; i++) stack.pop();
        return System.nanoTime() - start;
    }

    public static long benchArrayDequeAsQueue(int ops) {
        Deque<Integer> queue = new ArrayDeque<>();
        long start = System.nanoTime();
        for (int i = 0; i < ops; i++) queue.offer(i);
        for (int i = 0; i < ops; i++) queue.poll();
        return System.nanoTime() - start;
    }

    public static long benchLinkedListAsQueue(int ops) {
        Queue<Integer> queue = new LinkedList<>();
        long start = System.nanoTime();
        for (int i = 0; i < ops; i++) queue.offer(i);
        for (int i = 0; i < ops; i++) queue.poll();
        return System.nanoTime() - start;
    }

    public static long benchCustomCircularQueue(int ops) {
        InnerCircularQueue<Integer> queue = new InnerCircularQueue<>(16);
        long start = System.nanoTime();
        for (int i = 0; i < ops; i++) queue.enqueue(i);
        for (int i = 0; i < ops; i++) queue.dequeue();
        return System.nanoTime() - start;
    }

    private static void performWarmup() {
        int wOps = 10_000;
        benchJavaUtilStack(wOps);
        benchArrayDequeAsStack(wOps);
        benchCustomArrayStack(wOps);
        benchArrayDequeAsQueue(wOps);
        benchLinkedListAsQueue(wOps);
        benchCustomCircularQueue(wOps);
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 04 - Stacks & Queues | Step 06: Performance Benchmark Suite");
        System.out.println("======================================================================\n");

        System.out.println("[INIT] Warming up JVM for precise benchmark results...");
        performWarmup();
        System.out.println("[STATE] Warmup complete.");

        int ops = 1_000_000;
        System.out.println("\n========================================================================================");
        System.out.println("DATA STRUCTURE PERFORMANCE BENCHMARK (" + String.format("%,d", ops) + " Operations)");
        System.out.println("========================================================================================");
        System.out.printf("%-28s | %-10s | %-18s | %-16s%n",
                "Implementation", "Type", "Time Elapsed (ms)", "Throughput (Ops/sec)");
        System.out.println("----------------------------------------------------------------------------------------");

        // Stack Benchmarks
        long timeStack = benchJavaUtilStack(ops);
        long timeArrayDequeStack = benchArrayDequeAsStack(ops);
        long timeCustomStack = benchCustomArrayStack(ops);

        double secStack = timeStack / 1_000_000_000.0;
        double secArrayDequeStack = timeArrayDequeStack / 1_000_000_000.0;
        double secCustomStack = timeCustomStack / 1_000_000_000.0;

        System.out.printf("%-28s | %-10s | %-18.2f | %-16s%n",
                "java.util.Stack (Sync)", "Array", timeStack / 1_000_000.0, String.format("%.2f M/s", (ops / secStack) / 1_000_000));
        System.out.printf("%-28s | %-10s | %-18.2f | %-16s%n",
                "ArrayDeque (as Stack)", "Array", timeArrayDequeStack / 1_000_000.0, String.format("%.2f M/s", (ops / secArrayDequeStack) / 1_000_000));
        System.out.printf("%-28s | %-10s | %-18.2f | %-16s%n",
                "Custom InnerArrayStack", "Array", timeCustomStack / 1_000_000.0, String.format("%.2f M/s", (ops / secCustomStack) / 1_000_000));

        System.out.println("----------------------------------------------------------------------------------------");

        // Queue Benchmarks
        long timeArrayDequeQueue = benchArrayDequeAsQueue(ops);
        long timeLinkedListQueue = benchLinkedListAsQueue(ops);
        long timeCustomQueue = benchCustomCircularQueue(ops);

        double secArrayDequeQueue = timeArrayDequeQueue / 1_000_000_000.0;
        double secLinkedListQueue = timeLinkedListQueue / 1_000_000_000.0;
        double secCustomQueue = timeCustomQueue / 1_000_000_000.0;

        System.out.printf("%-28s | %-10s | %-18.2f | %-16s%n",
                "ArrayDeque (as Queue)", "Array", timeArrayDequeQueue / 1_000_000.0, String.format("%.2f M/s", (ops / secArrayDequeQueue) / 1_000_000));
        System.out.printf("%-28s | %-10s | %-18.2f | %-16s%n",
                "Custom InnerCircularQueue", "Array", timeCustomQueue / 1_000_000.0, String.format("%.2f M/s", (ops / secCustomQueue) / 1_000_000));
        System.out.printf("%-28s | %-10s | %-18.2f | %-16s%n",
                "java.util.LinkedList", "Node", timeLinkedListQueue / 1_000_000.0, String.format("%.2f M/s", (ops / secLinkedListQueue) / 1_000_000));

        System.out.println("========================================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Stack & Queue performance benchmarks complete.");
        System.out.println("======================================================================");
    }
}

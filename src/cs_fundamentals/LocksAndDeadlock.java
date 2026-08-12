package cs_fundamentals;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Mutexes, races, and deadlock. Draw the wait-for graph: a cycle is deadlock.
 */
public class LocksAndDeadlock {

    static int unsafe;
    static int safe;
    static final Object A = new Object();
    static final Object B = new Object();

    public static void raceDemo() throws InterruptedException {
        unsafe = 0;
        Thread t1 = new Thread(() -> { for (int i = 0; i < 10000; i++) unsafe++; });
        Thread t2 = new Thread(() -> { for (int i = 0; i < 10000; i++) unsafe++; });
        t1.start(); t2.start(); t1.join(); t2.join();
        System.out.println("Racy counter (want 20000, often less): " + unsafe);
    }

    public static void lockedDemo() throws InterruptedException {
        safe = 0;
        Lock lock = new ReentrantLock();
        Runnable add = () -> {
            for (int i = 0; i < 10000; i++) {
                lock.lock();
                try { safe++; } finally { lock.unlock(); }
            }
        };
        Thread t1 = new Thread(add);
        Thread t2 = new Thread(add);
        t1.start(); t2.start(); t1.join(); t2.join();
        System.out.println("Locked counter (always 20000): " + safe);
    }

    public static void deadlockPattern() {
        System.out.println("Deadlock recipe: lock A then B in one thread, B then A in another.");
        System.out.println("Fix: one global lock order, tryLock with timeout, or shrink the critical section.");
        System.out.println("Hold A=" + A + " then B=" + B + " — never the reverse.");
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Locks, Races, Deadlock ===");
        raceDemo();
        lockedDemo();
        deadlockPattern();
    }
}

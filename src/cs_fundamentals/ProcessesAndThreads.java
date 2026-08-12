package cs_fundamentals;

/**
 * Processes vs threads — the OS question that opens almost every CS round.
 *
 * A process is an isolated address space. A thread shares that space with its
 * siblings, so it is cheaper to create and cheaper to switch, and also how you
 * get races.
 */
public class ProcessesAndThreads {

    public static String choose(String need) {
        if ("crash-isolation".equals(need) || "separate-memory".equals(need)) return "process";
        if ("shared-memory".equals(need) || "cheap-switch".equals(need)) return "thread";
        return "depends";
    }

    public static void main(String[] args) {
        System.out.println("=== Processes vs Threads ===");
        System.out.println("Process: own PID, own heap/stack, own file table copy. Crash stays inside.");
        System.out.println("Thread: shares heap and open files. One wild write can corrupt a sibling.");
        System.out.println("Context switch: process > thread (TLB flush, address-space switch).");
        System.out.println("Need crash isolation? " + choose("crash-isolation"));
        System.out.println("Need shared memory for a pool? " + choose("shared-memory"));
        System.out.println("Interview: Chrome uses processes for tabs (isolation) and threads inside a renderer (work).");
    }
}

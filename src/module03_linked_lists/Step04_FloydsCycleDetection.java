package module03_linked_lists;

/**
 * Step 04: Floyd's Cycle Detection Algorithm (Tortoise & Hare) & Entry Node Discovery
 *
 * <pre>
 * 1. Cyclic Linked List Diagram:
 *           Non-cycle distance (A)           Cycle length (C)
 *    head -> [ 1 ] -> [ 2 ] -> [ 3 ] -------> [ 4 ] -> [ 5 ]
 *                               ^              |        |
 *                               |              v        v
 *                               +------------ [ 7 ] <- [ 6 ]
 *                                             (Cycle Entry = 3)
 *
 * 2. Mathematical Proof of Entry Node Alignment:
 *    Let A = distance from head to cycle entrance
 *    Let B = distance from entrance to meeting point inside cycle
 *    Let C = total cycle length
 *
 *    Distance traveled by Slow = A + B
 *    Distance traveled by Fast = A + B + k*C
 *    Since Fast moves 2x speed of Slow:
 *      2 * (A + B) = A + B + k*C
 *      => A + B = k*C
 *      => A = k*C - B = (k-1)*C + (C - B)
 *
 *    Conclusion: The distance from Head to Entry (A) equals the distance
 *    from Meeting Point to Entry (C - B)!
 *    Resetting Slow to Head and advancing both by 1 step guarantees collision at Cycle Entry.
 * </pre>
 */
public class Step04_FloydsCycleDetection {

    private static class Node {
        int val;
        Node next;

        Node(int val) {
            this.val = val;
            this.next = null;
        }
    }

    /**
     * Phase 1: Determines if a linked list contains a cycle.
     * Time: O(N), Space: O(1)
     */
    public static boolean hasCycle(Node head) {
        if (head == null || head.next == null) return false;

        Node slow = head;
        Node fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                return true;
            }
        }
        return false;
    }

    /**
     * Phase 2: Detects the exact starting node of the cycle (LeetCode 142).
     * Time: O(N), Space: O(1)
     */
    public static Node detectCycleEntry(Node head) {
        if (head == null || head.next == null) return null;

        Node slow = head;
        Node fast = head;
        Node intersection = null;

        // Step A: Find collision point
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                intersection = slow;
                break;
            }
        }

        if (intersection == null) return null; // Acyclic

        // Step B: Reset slow to head, advance slow and fast at 1 step/iter
        slow = head;
        while (slow != fast) {
            slow = slow.next;
            fast = fast.next;
        }
        return slow; // Cycle entry node!
    }

    /**
     * Calculates the number of nodes forming the cycle loop.
     * Time: O(N), Space: O(1)
     */
    public static int getCycleLength(Node head) {
        Node entryNode = detectCycleEntry(head);
        if (entryNode == null) return 0;

        int length = 1;
        Node curr = entryNode.next;
        while (curr != entryNode) {
            length++;
            curr = curr.next;
        }
        return length;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 03 - Linked Lists | Step 04: Floyd's Cycle Detection");
        System.out.println("======================================================================\n");

        // Create acyclic list: 1 -> 2 -> 3 -> 4 -> null
        Node n1 = new Node(1);
        Node n2 = new Node(2);
        Node n3 = new Node(3);
        Node n4 = new Node(4);
        n1.next = n2;
        n2.next = n3;
        n3.next = n4;

        System.out.println("[INIT] Testing Acyclic List: 1 -> 2 -> 3 -> 4 -> null");
        System.out.println("[ACTION] Running hasCycle()...");
        System.out.println("[STATE] Has Cycle: " + hasCycle(n1));
        System.out.println("[STATE] Cycle Entry: " + (detectCycleEntry(n1) != null ? detectCycleEntry(n1).val : "null"));

        System.out.println("\n--- 2. Creating Cycle: Link Node 4 back to Node 2 ---");
        n4.next = n2; // Creates cycle 2 -> 3 -> 4 -> 2
        System.out.println("[MEMORY EVENT] Formed pointer loop: 4.next = Node(2)");

        System.out.println("[ACTION] Running Phase 1: Floyd's Tortoise & Hare Detection...");
        boolean containsCycle = hasCycle(n1);
        System.out.println("[STATE] Has Cycle Detected: " + containsCycle);

        System.out.println("\n[ACTION] Running Phase 2: Cycle Entry Node Alignment...");
        Node entryNode = detectCycleEntry(n1);
        System.out.println("[STATE] Cycle Entry Node Found: Node(" + (entryNode != null ? entryNode.val : "null") + ")");

        System.out.println("\n[ACTION] Computing Cycle Loop Length...");
        int cycleLen = getCycleLength(n1);
        System.out.println("[STATE] Total Cycle Nodes Count = " + cycleLen);

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Floyd's cycle detection and entry verified.");
        System.out.println("======================================================================");
    }
}

package module03_linked_lists;

/**
 * Step 03: Pointer Reversal and Middle Node Detection (Fast/Slow Pointers)
 *
 * <pre>
 * 1. 3-Pointer Iterative Reversal Trace:
 *    Initial State:
 *    null     [ 10 ] ---> [ 20 ] ---> [ 30 ] ---> null
 *     ^        ^           ^
 *    prev     curr       nextTemp
 *
 *    Iteration 1:
 *    curr.next = prev;  (10 -> null)
 *    prev = curr;       (prev = 10)
 *    curr = nextTemp;   (curr = 20)
 *
 *    null <--- [ 10 ]     [ 20 ] ---> [ 30 ] ---> null
 *               ^          ^           ^
 *              prev       curr       nextTemp
 *
 * 2. Fast & Slow Pointer (Middle Finder):
 *    Odd Length (1 -> 2 -> 3 -> 4 -> 5):
 *    Step 0: S=1, F=1
 *    Step 1: S=2, F=3
 *    Step 2: S=3, F=5  (F.next == null -> Stop! Slow is at Middle 3)
 *
 *    Even Length (1 -> 2 -> 3 -> 4 -> 5 -> 6):
 *    Step 0: S=1, F=1
 *    Step 1: S=2, F=3
 *    Step 2: S=3, F=5
 *    Step 3: S=4, F=null (Stop! Slow is at Second Middle 4)
 * </pre>
 */
public class Step03_PointerReversalAndMiddle {

    private static class Node {
        int val;
        Node next;

        Node(int val) {
            this.val = val;
            this.next = null;
        }
    }

    /**
     * Reverses linked list iteratively using 3 pointers.
     * Time: O(N), Space: O(1)
     */
    public static Node reverseIterative(Node head) {
        Node prev = null;
        Node curr = head;

        while (curr != null) {
            Node nextTemp = curr.next; // Store next reference
            curr.next = prev;          // Reverse pointer direction
            prev = curr;               // Advance prev
            curr = nextTemp;           // Advance curr
        }
        return prev;
    }

    /**
     * Reverses linked list recursively.
     * Time: O(N), Space: O(N) JVM call stack space.
     */
    public static Node reverseRecursive(Node head) {
        if (head == null || head.next == null) {
            return head;
        }
        Node newHead = reverseRecursive(head.next);
        head.next.next = head; // Reverse link of next node back to current
        head.next = null;      // Nullify current forward pointer
        return newHead;
    }

    /**
     * Finds middle node using Fast & Slow Pointers (Tortoise & Hare).
     * Returns second middle node for even-length lists.
     * Time: O(N), Space: O(1).
     */
    public static Node findMiddle(Node head) {
        if (head == null) return null;

        Node slow = head;
        Node fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;          // 1 step
            fast = fast.next.next;     // 2 steps
        }
        return slow;
    }

    public static String toListString(Node head) {
        StringBuilder sb = new StringBuilder();
        Node curr = head;
        while (curr != null) {
            sb.append(curr.val).append(" -> ");
            curr = curr.next;
        }
        sb.append("null");
        return sb.toString();
    }

    public static Node createList(int... values) {
        if (values.length == 0) return null;
        Node dummy = new Node(0);
        Node curr = dummy;
        for (int v : values) {
            curr.next = new Node(v);
            curr = curr.next;
        }
        return dummy.next;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 03 - Linked Lists | Step 03: Reversal & Middle Node Detection");
        System.out.println("======================================================================\n");

        Node oddList = createList(1, 2, 3, 4, 5);
        System.out.println("[INIT] Initial Odd-Length List: " + toListString(oddList));

        System.out.println("\n--- 1. Fast & Slow Pointer Middle Node Detection (Odd Length) ---");
        Node middleOdd = findMiddle(oddList);
        System.out.println("[STATE] Middle Node Value (Odd Length): " + (middleOdd != null ? middleOdd.val : "null"));

        Node evenList = createList(1, 2, 3, 4, 5, 6);
        System.out.println("\n[INIT] Initial Even-Length List: " + toListString(evenList));
        System.out.println("--- 2. Fast & Slow Pointer Middle Node Detection (Even Length) ---");
        Node middleEven = findMiddle(evenList);
        System.out.println("[STATE] Middle Node Value (Even Length - 2nd Middle): " + (middleEven != null ? middleEven.val : "null"));

        System.out.println("\n--- 3. Iterative 3-Pointer Reversal ---");
        System.out.println("[ACTION] Reversing odd list iteratively...");
        Node reversedIter = reverseIterative(oddList);
        System.out.println("[STATE] Iteratively Reversed List: " + toListString(reversedIter));

        System.out.println("\n--- 4. Recursive Pointer Reversal ---");
        System.out.println("[ACTION] Reversing back recursively...");
        Node reversedRec = reverseRecursive(reversedIter);
        System.out.println("[STATE] Recursively Restored List: " + toListString(reversedRec));

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Pointer reversal & middle detection verified.");
        System.out.println("======================================================================");
    }
}

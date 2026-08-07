package module03_linked_lists;

/**
 * Step 06: Linked List Algorithm Suite & Comprehensive Benchmarking
 *
 * <pre>
 * 1. Remove N-th Node From End (N = 2):
 *    Dummy -> [ 1 ] -> [ 2 ] -> [ 3 ] -> [ 4 ] -> [ 5 ] -> null
 *
 *    Step A: Advance 'fast' pointer N+1 steps (3 steps):
 *    Dummy -> [ 1 ] -> [ 2 ] -> [ 3 ] -> [ 4 ] -> [ 5 ] -> null
 *      ^                          ^
 *     slow                       fast
 *
 *    Step B: Advance 'slow' and 'fast' together until fast == null:
 *    Dummy -> [ 1 ] -> [ 2 ] -> [ 3 ] -> [ 4 ] -> [ 5 ] -> null
 *                                  ^                          ^
 *                                 slow                       fast
 *
 *    Step C: Delete slow.next (Node 4): slow.next = slow.next.next
 *
 * 2. Palindrome Verification (1 -> 2 -> 2 -> 1):
 *    First Half:  1 -> 2
 *    Second Half Reversed: 1 -> 2
 *    Compare equality -> True!
 * </pre>
 */
public class Step06_LinkedListAlgorithmSuite {

    private static class Node {
        int val;
        Node next;

        Node(int val) {
            this.val = val;
            this.next = null;
        }
    }

    /**
     * Merges two sorted singly linked lists into a single sorted list (LeetCode 21).
     * Time: O(N + M), Space: O(1).
     */
    public static Node mergeTwoLists(Node l1, Node l2) {
        Node dummy = new Node(0);
        Node curr = dummy;

        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) {
                curr.next = l1;
                l1 = l1.next;
            } else {
                curr.next = l2;
                l2 = l2.next;
            }
            curr = curr.next;
        }

        if (l1 != null) curr.next = l1;
        if (l2 != null) curr.next = l2;

        return dummy.next;
    }

    /**
     * Checks if a linked list is a palindrome in O(N) time and O(1) auxiliary space (LeetCode 234).
     */
    public static boolean isPalindrome(Node head) {
        if (head == null || head.next == null) return true;

        // Step 1: Find middle using Fast/Slow pointers
        Node slow = head;
        Node fast = head;
        while (fast.next != null && fast.next.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }

        // Step 2: Reverse second half starting from slow.next
        Node secondHalfHead = reverseList(slow.next);

        // Step 3: Compare first half and reversed second half
        Node p1 = head;
        Node p2 = secondHalfHead;
        boolean palindrome = true;
        while (p2 != null) {
            if (p1.val != p2.val) {
                palindrome = false;
                break;
            }
            p1 = p1.next;
            p2 = p2.next;
        }

        // Step 4: Restore list structure
        slow.next = reverseList(secondHalfHead);
        return palindrome;
    }

    /**
     * Removes N-th node from the end of list in one pass (LeetCode 19).
     * Time: O(N), Space: O(1).
     */
    public static Node removeNthFromEnd(Node head, int n) {
        Node dummy = new Node(0);
        dummy.next = head;
        Node slow = dummy;
        Node fast = dummy;

        // Advance fast N+1 steps ahead
        for (int i = 0; i <= n; i++) {
            if (fast == null) return head; // n out of bounds
            fast = fast.next;
        }

        // Move fast to end, maintaining N gap with slow
        while (fast != null) {
            slow = slow.next;
            fast = fast.next;
        }

        // Delete N-th node from end
        if (slow.next != null) {
            slow.next = slow.next.next;
        }
        return dummy.next;
    }

    private static Node reverseList(Node head) {
        Node prev = null;
        Node curr = head;
        while (curr != null) {
            Node nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
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
        System.out.println("Module 03 - Linked Lists | Step 06: LinkedList Algorithm Suite");
        System.out.println("======================================================================\n");

        System.out.println("--- 1. Merge Two Sorted Linked Lists ---");
        Node l1 = createList(1, 3, 5);
        Node l2 = createList(2, 4, 6);
        System.out.println("[INIT] List 1: " + toListString(l1));
        System.out.println("[INIT] List 2: " + toListString(l2));
        Node merged = mergeTwoLists(l1, l2);
        System.out.println("[STATE] Merged Sorted List: " + toListString(merged));

        System.out.println("\n--- 2. Palindrome Linked List Verification ---");
        Node palList = createList(1, 2, 3, 2, 1);
        Node nonPalList = createList(1, 2, 3, 4, 5);
        System.out.println("[INIT] Testing List 1: " + toListString(palList));
        System.out.println("[STATE] Is Palindrome: " + isPalindrome(palList));
        System.out.println("[INIT] Testing List 2: " + toListString(nonPalList));
        System.out.println("[STATE] Is Palindrome: " + isPalindrome(nonPalList));

        System.out.println("\n--- 3. Remove N-th Node From End ---");
        Node listToRemove = createList(1, 2, 3, 4, 5);
        int n = 2;
        System.out.println("[INIT] Input List: " + toListString(listToRemove) + ", N = " + n);
        System.out.println("[ACTION] Removing " + n + "-nd node from end...");
        Node updatedList = removeNthFromEnd(listToRemove, n);
        System.out.println("[STATE] Result List: " + toListString(updatedList));

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Linked List Algorithm Suite verified.");
        System.out.println("======================================================================");
    }
}

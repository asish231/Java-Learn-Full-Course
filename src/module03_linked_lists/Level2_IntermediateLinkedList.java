package module03_linked_lists;

/**
 * LEVEL 2 (INTERMEDIATE): In-Place Reversal & Linked List Cycle II (Medium LeetCode)
 */
public class Level2_IntermediateLinkedList {
    static class Node {
        int val;
        Node next;
        Node(int val) { this.val = val; }
    }

    // 1. In-Place Reverse Linked List - O(N) Time, O(1) Space
    public static Node reverseList(Node head) {
        Node prev = null, curr = head;
        while (curr != null) {
            Node nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }

    // 2. Linked List Cycle II (Find Start Node of Cycle) - O(N) Time, O(1) Space
    public static Node detectCycleEntry(Node head) {
        if (head == null || head.next == null) return null;

        Node slow = head, fast = head;
        boolean hasCycle = false;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                hasCycle = true;
                break;
            }
        }

        if (!hasCycle) return null;

        // Reset slow to head to locate cycle entry point
        slow = head;
        while (slow != fast) {
            slow = slow.next;
            fast = fast.next;
        }
        return slow; // Intersection point is cycle start!
    }

    public static void main(String[] args) {
        System.out.println("--- Module 03: Level 2 (Intermediate Reversal & Cycle II) ---");
        Node n1 = new Node(1), n2 = new Node(2), n3 = new Node(3), n4 = new Node(4);
        n1.next = n2; n2.next = n3; n3.next = n4; n4.next = n2; // Loop: 4 -> 2

        Node cycleEntry = detectCycleEntry(n1);
        System.out.println("Cycle entry node value: " + (cycleEntry != null ? cycleEntry.val : "None"));
    }
}

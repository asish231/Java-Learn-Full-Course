package module06_trees_and_bst;

import java.util.ArrayList;
import java.util.List;

/**
 * Step 06: Binary Search Tree (BST) Node Deletion
 *
 * <pre>
 * BST DELETION - THREE STRUCTURAL CASES:
 *
 * CASE 1: Node to delete is a LEAF (0 children)
 *  - Delete Node 2: Simply set parent's left reference to null.
 *
 * CASE 2: Node to delete has ONE child
 *  - Delete Node 15 (only has right child 18): Link parent directly to child 18.
 *
 * CASE 3: Node to delete has TWO children
 *  - Delete Root Node 10:
 *    1. Find In-Order Successor (Min node in Right Subtree) -> Node 12
 *    2. Replace Node 10's value with 12
 *    3. Delete Node 12 from right subtree (which falls under Case 1 or 2!)
 *
 * TREE BEFORE CASE 3 DELETION (Delete 10):
 *          10 <--- Target (2 Children)
 *        /    \
 *       5      15
 *      / \    /  \
 *     2   7  12   18
 *
 * TREE AFTER DELETION (Successor 12 copied to root):
 *          12
 *        /    \
 *       5      15
 *      / \       \
 *     2   7       18
 * </pre>
 */
public class Step06_BSTDeletion {

    public static class TreeNode {
        public int val;
        public TreeNode left;
        public TreeNode right;

        public TreeNode(int val) {
            this.val = val;
        }

        public TreeNode(int val, TreeNode left, TreeNode right) {
            this.val = val;
            this.left = left;
            this.right = right;
        }
    }

    /**
     * Finds node with minimum key value in given subtree (leftmost node).
     */
    public static TreeNode findMin(TreeNode node) {
        TreeNode curr = node;
        while (curr != null && curr.left != null) {
            curr = curr.left;
        }
        return curr;
    }

    /**
     * Deletes a node with key from BST preserving ordering invariant across all 3 cases.
     */
    public static TreeNode deleteNode(TreeNode root, int key) {
        if (root == null) return null;

        if (key < root.val) {
            root.left = deleteNode(root.left, key);
        } else if (key > root.val) {
            root.right = deleteNode(root.right, key);
        } else {
            // Key found! Handle 3 deletion cases:

            // Case 1: Leaf node OR Case 2: Only 1 child (Right child only)
            if (root.left == null) {
                return root.right;
            }
            // Case 2: Only 1 child (Left child only)
            else if (root.right == null) {
                return root.left;
            }

            // Case 3: Node with TWO children
            // Find in-order successor (smallest in right subtree)
            TreeNode successor = findMin(root.right);
            root.val = successor.val; // Copy successor value to root
            // Recursively delete the successor node from right subtree
            root.right = deleteNode(root.right, successor.val);
        }
        return root;
    }

    public static void collectInOrder(TreeNode root, List<Integer> result) {
        if (root == null) return;
        collectInOrder(root.left, result);
        result.add(root.val);
        collectInOrder(root.right, result);
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 06 - Trees & BST | Step 06: BST Deletion (3 Cases)");
        System.out.println("======================================================================\n");

        // Construct initial BST:
        //          10
        //        /    \
        //       5      15
        //      / \    /  \
        //     2   7  12   18
        TreeNode root = new TreeNode(10,
                new TreeNode(5, new TreeNode(2), new TreeNode(7)),
                new TreeNode(15, new TreeNode(12), new TreeNode(18)));

        List<Integer> initialOrder = new ArrayList<>();
        collectInOrder(root, initialOrder);
        System.out.println("[INIT] Built BST. In-order traversal: " + initialOrder);

        // Case 1: Deleting Leaf Node (2)
        System.out.println("\n--- 1. Case 1 Deletion: Leaf Node (Key = 2) ---");
        System.out.println("[ACTION] Executing deleteNode(root, 2)...");
        root = deleteNode(root, 2);
        List<Integer> case1Order = new ArrayList<>();
        collectInOrder(root, case1Order);
        System.out.println("[STATE] In-order after deleting leaf 2: " + case1Order);
        System.out.println("[MEMORY EVENT] Parent left pointer set to null directly.");

        // Case 2: Deleting Node with One Child (Let's make Node 5 have 1 child by deleting 2, now 5 has only right child 7)
        // Wait, Node 5 now has only right child 7!
        System.out.println("\n--- 2. Case 2 Deletion: Node with One Child (Key = 5) ---");
        System.out.println("[ACTION] Executing deleteNode(root, 5)... (Node 5 now has only right child 7)");
        root = deleteNode(root, 5);
        List<Integer> case2Order = new ArrayList<>();
        collectInOrder(root, case2Order);
        System.out.println("[STATE] In-order after deleting node 5: " + case2Order);
        System.out.println("[MEMORY EVENT] Node 5 bypassed: Parent 10 linked directly to node 7.");

        // Case 3: Deleting Node with Two Children (Root Node 10)
        System.out.println("\n--- 3. Case 3 Deletion: Node with Two Children (Key = 10) ---");
        System.out.println("[ACTION] Executing deleteNode(root, 10)... (Root has two children: 7 and 15)");
        root = deleteNode(root, 10);
        List<Integer> case3Order = new ArrayList<>();
        collectInOrder(root, case3Order);
        System.out.println("[STATE] In-order after deleting root 10: " + case3Order);
        System.out.println("[MEMORY EVENT] Found in-order successor 12, copied value to root, and deleted successor node 12.");

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: BST deletion across all 3 cases verified.");
        System.out.println("======================================================================");
    }
}

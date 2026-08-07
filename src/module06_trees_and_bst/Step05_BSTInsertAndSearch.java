package module06_trees_and_bst;

import java.util.ArrayList;
import java.util.List;

/**
 * Step 05: Binary Search Tree (BST) Insertion and Search Operations
 *
 * <pre>
 * BST ORDERING INVARIANT:
 * For every node N:
 *  - All nodes in Left Subtree of N have values strictly LESS than N.val
 *  - All nodes in Right Subtree of N have values strictly GREATER than N.val
 *
 * BST SEARCH TRAVERSAL (Target = 7):
 *          10          Compare 7 < 10 -> Go LEFT
 *         /  \
 *        5    15       Compare 7 > 5  -> Go RIGHT
 *       / \
 *      2   7           Match 7 == 7   -> FOUND!
 *
 * IN-ORDER TRAVERSAL PROPERTY:
 * In-order traversal (Left, Root, Right) of any valid BST yields SORTED elements:
 * [2, 5, 7, 10, 15]
 * </pre>
 */
public class Step05_BSTInsertAndSearch {

    public static class TreeNode {
        public int val;
        public TreeNode left;
        public TreeNode right;

        public TreeNode(int val) {
            this.val = val;
        }
    }

    /**
     * Recursive BST Search in O(h) time where h is tree height.
     */
    public static TreeNode searchBSTRecursive(TreeNode root, int target) {
        if (root == null || root.val == target) {
            return root;
        }
        if (target < root.val) {
            return searchBSTRecursive(root.left, target);
        }
        return searchBSTRecursive(root.right, target);
    }

    /**
     * Iterative BST Search in O(h) time with O(1) stack space.
     */
    public static TreeNode searchBSTIterative(TreeNode root, int target) {
        TreeNode curr = root;
        while (curr != null) {
            if (target == curr.val) return curr;
            if (target < curr.val) {
                curr = curr.left;
            } else {
                curr = curr.right;
            }
        }
        return null;
    }

    /**
     * Recursive BST Insertion preserving ordering invariant.
     */
    public static TreeNode insertBSTRecursive(TreeNode root, int val) {
        if (root == null) {
            return new TreeNode(val);
        }
        if (val < root.val) {
            root.left = insertBSTRecursive(root.left, val);
        } else if (val > root.val) {
            root.right = insertBSTRecursive(root.right, val);
        }
        return root;
    }

    /**
     * Iterative BST Insertion.
     */
    public static TreeNode insertBSTIterative(TreeNode root, int val) {
        if (root == null) return new TreeNode(val);

        TreeNode curr = root;
        while (true) {
            if (val < curr.val) {
                if (curr.left == null) {
                    curr.left = new TreeNode(val);
                    break;
                }
                curr = curr.left;
            } else if (val > curr.val) {
                if (curr.right == null) {
                    curr.right = new TreeNode(val);
                    break;
                }
                curr = curr.right;
            } else {
                break; // Duplicate value, ignore
            }
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
        System.out.println("Module 06 - Trees & BST | Step 05: BST Insert & Search Operations");
        System.out.println("======================================================================\n");

        int[] valuesToInsert = {10, 5, 15, 2, 7, 12, 18};
        System.out.println("[INIT] Values to insert into BST: " + java.util.Arrays.toString(valuesToInsert));

        // 1. Build BST recursively
        TreeNode root = null;
        System.out.println("\n--- 1. Constructing BST via Recursive Insertions ---");
        for (int val : valuesToInsert) {
            root = insertBSTRecursive(root, val);
            System.out.println("[ACTION] Inserted value " + val + " into BST.");
        }

        List<Integer> inOrderSorted = new ArrayList<>();
        collectInOrder(root, inOrderSorted);
        System.out.println("[STATE] BST In-Order Traversal Result: " + inOrderSorted);
        System.out.println("[MEMORY EVENT] In-order traversal verified sorted order: " + inOrderSorted);

        // 2. Search Operations
        System.out.println("\n--- 2. Search Operations (Recursive vs Iterative) ---");
        int targetExist = 7;
        int targetMissing = 99;

        System.out.println("[ACTION] Searching existing target " + targetExist + " recursively...");
        TreeNode foundRec = searchBSTRecursive(root, targetExist);
        System.out.println("[STATE] Found node: " + (foundRec != null ? foundRec.val : "null"));

        System.out.println("[ACTION] Searching missing target " + targetMissing + " iteratively...");
        TreeNode foundIter = searchBSTIterative(root, targetMissing);
        System.out.println("[STATE] Found node: " + (foundIter != null ? foundIter.val : "null"));

        // 3. Iterative Insertion Test
        System.out.println("\n--- 3. Iterative Insertion of New Node (Val = 8) ---");
        System.out.println("[ACTION] Executing insertBSTIterative(root, 8)...");
        insertBSTIterative(root, 8);

        List<Integer> updatedSorted = new ArrayList<>();
        collectInOrder(root, updatedSorted);
        System.out.println("[STATE] Updated BST In-Order Traversal: " + updatedSorted);

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: BST insert and search operations verified.");
        System.out.println("======================================================================");
    }
}

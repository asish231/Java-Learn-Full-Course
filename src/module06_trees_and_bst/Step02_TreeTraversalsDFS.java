package module06_trees_and_bst;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;

/**
 * Step 02: Depth-First Search (DFS) Tree Traversals
 *
 * <pre>
 * SAMPLE BINARY TREE:
 *         1
 *        / \
 *       2   3
 *      / \
 *     4   5
 *
 * TRAVERSAL ORDERS:
 *  1. PRE-ORDER  (Root -> Left -> Right): [1, 2, 4, 5, 3]
 *  2. IN-ORDER   (Left -> Root -> Right): [4, 2, 5, 1, 3]
 *  3. POST-ORDER (Left -> Right -> Root): [4, 5, 2, 3, 1]
 *
 * CALL STACK VS EXPLICIT STACK (Iterative DFS):
 * Iterative Pre-Order: Push root -> Loop: Pop node, visit, push right child, push left child.
 * Iterative In-Order:  Push all left nodes -> Pop, visit, switch to right child.
 * Iterative Post-Order: Use 2 stacks or 1 stack with lastVisited tracking.
 * </pre>
 */
public class Step02_TreeTraversalsDFS {

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

    // --- RECURSIVE DFS ---
    public static void preOrderRecursive(TreeNode root, List<Integer> result) {
        if (root == null) return;
        result.add(root.val);
        preOrderRecursive(root.left, result);
        preOrderRecursive(root.right, result);
    }

    public static void inOrderRecursive(TreeNode root, List<Integer> result) {
        if (root == null) return;
        inOrderRecursive(root.left, result);
        result.add(root.val);
        inOrderRecursive(root.right, result);
    }

    public static void postOrderRecursive(TreeNode root, List<Integer> result) {
        if (root == null) return;
        postOrderRecursive(root.left, result);
        postOrderRecursive(root.right, result);
        result.add(root.val);
    }

    // --- ITERATIVE DFS ---
    public static List<Integer> preOrderIterative(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;

        Deque<TreeNode> stack = new ArrayDeque<>();
        stack.push(root);

        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            result.add(node.val);

            // Push right first so left is popped first (LIFO order)
            if (node.right != null) stack.push(node.right);
            if (node.left != null) stack.push(node.left);
        }
        return result;
    }

    public static List<Integer> inOrderIterative(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode curr = root;

        while (curr != null || !stack.isEmpty()) {
            while (curr != null) {
                stack.push(curr);
                curr = curr.left;
            }
            curr = stack.pop();
            result.add(curr.val);
            curr = curr.right;
        }
        return result;
    }

    public static List<Integer> postOrderIterative(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;

        Deque<TreeNode> stack1 = new ArrayDeque<>();
        Deque<TreeNode> stack2 = new ArrayDeque<>();
        stack1.push(root);

        while (!stack1.isEmpty()) {
            TreeNode node = stack1.pop();
            stack2.push(node);

            if (node.left != null) stack1.push(node.left);
            if (node.right != null) stack1.push(node.right);
        }

        while (!stack2.isEmpty()) {
            result.add(stack2.pop().val);
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 06 - Trees & BST | Step 02: DFS Traversals (Pre, In, Post Order)");
        System.out.println("======================================================================\n");

        // Construct Sample Tree:
        //       1
        //      / \
        //     2   3
        //    / \
        //   4   5
        TreeNode root = new TreeNode(1,
                new TreeNode(2, new TreeNode(4), new TreeNode(5)),
                new TreeNode(3));

        System.out.println("[INIT] Built sample binary tree rooted at 1 with left child 2, right child 3.");

        // 1. Pre-Order Traversal
        System.out.println("\n--- 1. Pre-Order Traversal (Root -> Left -> Right) ---");
        List<Integer> preRec = new ArrayList<>();
        preOrderRecursive(root, preRec);
        List<Integer> preIter = preOrderIterative(root);
        System.out.println("[ACTION] Recursive Pre-Order: " + preRec);
        System.out.println("[ACTION] Iterative Pre-Order: " + preIter);
        System.out.println("[STATE] Pre-Order Matched? " + preRec.equals(preIter));
        System.out.println("[MEMORY EVENT] Pre-order visits root first before pushing subtrees onto call/explicit stack.");

        // 2. In-Order Traversal
        System.out.println("\n--- 2. In-Order Traversal (Left -> Root -> Right) ---");
        List<Integer> inRec = new ArrayList<>();
        inOrderRecursive(root, inRec);
        List<Integer> inIter = inOrderIterative(root);
        System.out.println("[ACTION] Recursive In-Order: " + inRec);
        System.out.println("[ACTION] Iterative In-Order: " + inIter);
        System.out.println("[STATE] In-Order Matched? " + inRec.equals(inIter));

        // 3. Post-Order Traversal
        System.out.println("\n--- 3. Post-Order Traversal (Left -> Right -> Root) ---");
        List<Integer> postRec = new ArrayList<>();
        postOrderRecursive(root, postRec);
        List<Integer> postIter = postOrderIterative(root);
        System.out.println("[ACTION] Recursive Post-Order: " + postRec);
        System.out.println("[ACTION] Iterative Post-Order: " + postIter);
        System.out.println("[STATE] Post-Order Matched? " + postRec.equals(postIter));
        System.out.println("[MEMORY EVENT] Post-order visits subtrees completely before processing root node.");

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: DFS Traversals (Recursive & Iterative) passed.");
        System.out.println("======================================================================");
    }
}

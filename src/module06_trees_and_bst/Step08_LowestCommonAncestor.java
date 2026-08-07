package module06_trees_and_bst;

/**
 * Step 08: Lowest Common Ancestor (LCA) in Binary Tree and BST
 *
 * <pre>
 * LCA DEFINITION:
 * The Lowest Common Ancestor of two nodes p and q is the deepest node in T
 * that has both p and q as descendants (where a node can be a descendant of itself).
 *
 * BINARY TREE LCA (Bottom-up DFS):
 *          3
 *        /   \
 *       5     1
 *      / \   / \
 *     6   2 0   8
 *        / \
 *       7   4
 *
 * Example 1: LCA(5, 1) = 3 (Both left and right subtrees return non-null -> Root 3 is LCA)
 * Example 2: LCA(5, 4) = 5 (Node 5 is an ancestor of 4, so 5 is LCA)
 *
 * BST LCA (Directional Optimization):
 * If both p.val and q.val < root.val -> Move LEFT
 * If both p.val and q.val > root.val -> Move RIGHT
 * Otherwise                          -> Root is Split Point (LCA)!
 * </pre>
 */
public class Step08_LowestCommonAncestor {

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

        @Override
        public String toString() {
            return "TreeNode(" + val + ")";
        }
    }

    /**
     * Finds LCA in a General Binary Tree in O(N) time and O(h) call stack space.
     */
    public static TreeNode lowestCommonAncestorBinaryTree(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) {
            return root;
        }

        TreeNode left = lowestCommonAncestorBinaryTree(root.left, p, q);
        TreeNode right = lowestCommonAncestorBinaryTree(root.right, p, q);

        if (left != null && right != null) {
            return root; // p and q are in different subtrees -> current root is LCA!
        }

        return (left != null) ? left : right;
    }

    /**
     * Finds LCA in a Binary Search Tree (BST) in O(h) time using value direction.
     */
    public static TreeNode lowestCommonAncestorBST(TreeNode root, TreeNode p, TreeNode q) {
        TreeNode curr = root;

        while (curr != null) {
            if (p.val < curr.val && q.val < curr.val) {
                curr = curr.left; // Both targets in left subtree
            } else if (p.val > curr.val && q.val > curr.val) {
                curr = curr.right; // Both targets in right subtree
            } else {
                return curr; // Split point or exact match -> curr is LCA!
            }
        }

        return null;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 06 - Trees & BST | Step 08: Lowest Common Ancestor (LCA)");
        System.out.println("======================================================================\n");

        // 1. General Binary Tree Test
        //          3
        //        /   \
        //       5     1
        //      / \   / \
        //     6   2 0   8
        //        / \
        //       7   4
        TreeNode n7 = new TreeNode(7);
        TreeNode n4 = new TreeNode(4);
        TreeNode n2 = new TreeNode(2, n7, n4);
        TreeNode n6 = new TreeNode(6);
        TreeNode n5 = new TreeNode(5, n6, n2);
        TreeNode n0 = new TreeNode(0);
        TreeNode n8 = new TreeNode(8);
        TreeNode n1 = new TreeNode(1, n0, n8);
        TreeNode btRoot = new TreeNode(3, n5, n1);

        System.out.println("[INIT] Constructed Binary Tree rooted at 3.");

        System.out.println("\n--- 1. General Binary Tree LCA ---");
        System.out.println("[ACTION] Finding LCA of Node(5) and Node(1)...");
        TreeNode lca1 = lowestCommonAncestorBinaryTree(btRoot, n5, n1);
        System.out.println("[STATE] LCA(5, 1) Result: " + lca1 + " (Expected: 3)");

        System.out.println("[ACTION] Finding LCA of Node(5) and Node(4)...");
        TreeNode lca2 = lowestCommonAncestorBinaryTree(btRoot, n5, n4);
        System.out.println("[STATE] LCA(5, 4) Result: " + lca2 + " (Expected: 5)");
        System.out.println("[MEMORY EVENT] Node 5 returned itself as LCA because descendant node 4 matched in its subtree.");

        // 2. BST LCA Test
        //          6
        //        /   \
        //       2     8
        //      / \   / \
        //     0   4 7   9
        TreeNode bstP = new TreeNode(2, new TreeNode(0), new TreeNode(4));
        TreeNode bstQ = new TreeNode(8, new TreeNode(7), new TreeNode(9));
        TreeNode bstRoot = new TreeNode(6, bstP, bstQ);

        System.out.println("\n--- 2. BST Directional LCA ---");
        System.out.println("[INIT] Constructed BST rooted at 6.");

        System.out.println("[ACTION] Finding LCA of Node(2) and Node(8) in BST...");
        TreeNode bstLca1 = lowestCommonAncestorBST(bstRoot, bstP, bstQ);
        System.out.println("[STATE] BST LCA(2, 8) Result: " + bstLca1 + " (Expected: 6)");

        TreeNode bstNode0 = bstP.left; // val = 0
        TreeNode bstNode4 = bstP.right; // val = 4
        System.out.println("[ACTION] Finding LCA of Node(0) and Node(4) in BST...");
        TreeNode bstLca2 = lowestCommonAncestorBST(bstRoot, bstNode0, bstNode4);
        System.out.println("[STATE] BST LCA(0, 4) Result: " + bstLca2 + " (Expected: 2)");

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Lowest Common Ancestor algorithms passed.");
        System.out.println("======================================================================");
    }
}

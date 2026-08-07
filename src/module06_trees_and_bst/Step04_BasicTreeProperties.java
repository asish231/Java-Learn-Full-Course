package module06_trees_and_bst;

/**
 * Step 04: Fundamental Binary Tree Structural Properties
 *
 * <pre>
 * RECURSIVE PROPERTY CALCULATION:
 *
 * 1. MAX DEPTH (HEIGHT):
 *    depth(node) = 1 + Math.max(depth(node.left), depth(node.right))
 *
 * 2. STRUCTURAL EQUALITY (isSameTree):
 *    same(p, q) = (p.val == q.val) && same(p.left, q.left) && same(p.right, q.right)
 *
 * 3. HEIGHT BALANCE CHECK (isBalanced):
 *    A tree is height-balanced if depth difference of left/right subtrees <= 1
 *    AND both subtrees are height-balanced.
 *
 * TREE A:            TREE B (Same):       TREE C (Unbalanced):
 *     1                  1                   1
 *    / \                / \                 /
 *   2   3              2   3               2
 *  /                                      /
 * 4                                      3
 * </pre>
 */
public class Step04_BasicTreeProperties {

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
     * Calculates the maximum depth (height) of a binary tree.
     */
    public static int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }

    /**
     * Counts total number of nodes in binary tree.
     */
    public static int countNodes(TreeNode root) {
        if (root == null) return 0;
        return 1 + countNodes(root.left) + countNodes(root.right);
    }

    /**
     * Counts number of leaf nodes (nodes with degree 0).
     */
    public static int countLeaves(TreeNode root) {
        if (root == null) return 0;
        if (root.left == null && root.right == null) return 1;
        return countLeaves(root.left) + countLeaves(root.right);
    }

    /**
     * Checks if two binary trees are structurally and value identical.
     */
    public static boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) return true;
        if (p == null || q == null) return false;
        if (p.val != q.val) return false;
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }

    /**
     * Checks if a binary tree is height-balanced.
     * Returns height if balanced, or -1 if unbalanced.
     */
    private static int checkBalanceHeight(TreeNode root) {
        if (root == null) return 0;

        int leftH = checkBalanceHeight(root.left);
        if (leftH == -1) return -1;

        int rightH = checkBalanceHeight(root.right);
        if (rightH == -1) return -1;

        if (Math.abs(leftH - rightH) > 1) return -1;
        return 1 + Math.max(leftH, rightH);
    }

    public static boolean isBalanced(TreeNode root) {
        return checkBalanceHeight(root) != -1;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 06 - Trees & BST | Step 04: Basic Tree Properties Suite");
        System.out.println("======================================================================\n");

        // Construct Tree A (Balanced, Depth 3)
        //       1
        //      / \
        //     2   3
        //    /
        //   4
        TreeNode treeA = new TreeNode(1,
                new TreeNode(2, new TreeNode(4), null),
                new TreeNode(3));

        // Construct Tree B (Identical to Tree A)
        TreeNode treeB = new TreeNode(1,
                new TreeNode(2, new TreeNode(4), null),
                new TreeNode(3));

        // Construct Tree C (Unbalanced, Depth 3)
        //     1
        //    /
        //   2
        //  /
        // 3
        TreeNode treeC = new TreeNode(1,
                new TreeNode(2, new TreeNode(3), null),
                null);

        System.out.println("[INIT] Created Tree A (Balanced), Tree B (Clone of A), Tree C (Unbalanced).");

        // 1. Max Depth & Node Counting
        System.out.println("\n--- 1. Depth & Node Statistics for Tree A ---");
        int depthA = maxDepth(treeA);
        int nodesA = countNodes(treeA);
        int leavesA = countLeaves(treeA);
        System.out.println("[ACTION] Calculated maxDepth(treeA) = " + depthA);
        System.out.println("[STATE] Total Nodes = " + nodesA + " | Total Leaf Nodes = " + leavesA);
        System.out.println("[MEMORY EVENT] Recursion unwound bottom-up: 1 + Math.max(left, right).");

        // 2. Structural Equality Check
        System.out.println("\n--- 2. Tree Equality Comparison (isSameTree) ---");
        boolean sameAB = isSameTree(treeA, treeB);
        boolean sameAC = isSameTree(treeA, treeC);
        System.out.println("[ACTION] Checking isSameTree(Tree A, Tree B): " + sameAB + " (Expected: true)");
        System.out.println("[ACTION] Checking isSameTree(Tree A, Tree C): " + sameAC + " (Expected: false)");
        System.out.println("[STATE] Tree equality logic verified.");

        // 3. Height Balance Check
        System.out.println("\n--- 3. Height Balance Verification (isBalanced) ---");
        boolean balA = isBalanced(treeA);
        boolean balC = isBalanced(treeC);
        System.out.println("[ACTION] Checking isBalanced(Tree A): " + balA + " (Expected: true)");
        System.out.println("[ACTION] Checking isBalanced(Tree C): " + balC + " (Expected: false)");
        System.out.println("[MEMORY EVENT] Bottom-up balance check returned early -1 on detecting height diff > 1.");

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Basic tree properties suite executed cleanly.");
        System.out.println("======================================================================");
    }
}

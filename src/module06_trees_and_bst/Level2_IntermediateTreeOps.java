package module06_trees_and_bst;

/**
 * LEVEL 2 (INTERMEDIATE): Validate BST (LeetCode 98) & Lowest Common Ancestor (LeetCode 236)
 */
public class Level2_IntermediateTreeOps {

    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // 1. Validate BST - O(N) Time using Min/Max Range Boundaries
    public static boolean isValidBST(TreeNode root) {
        return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    private static boolean validate(TreeNode node, long min, long max) {
        if (node == null) return true;
        if (node.val <= min || node.val >= max) return false;
        return validate(node.left, min, node.val) && validate(node.right, node.val, max);
    }

    // 2. Lowest Common Ancestor (LCA) of Binary Tree - O(N) Time
    public static TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;

        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);

        if (left != null && right != null) return root; // p and q are in different subtrees
        return left != null ? left : right;
    }

    public static void main(String[] args) {
        System.out.println("--- Module 06: Level 2 (Intermediate Tree Operations) ---");
        TreeNode bst = new TreeNode(5);
        bst.left = new TreeNode(3);
        bst.right = new TreeNode(7);

        System.out.println("Is Valid BST? " + isValidBST(bst)); // true

        TreeNode lca = lowestCommonAncestor(bst, bst.left, bst.right);
        System.out.println("LCA of 3 and 7: " + (lca != null ? lca.val : "null")); // 5
    }
}

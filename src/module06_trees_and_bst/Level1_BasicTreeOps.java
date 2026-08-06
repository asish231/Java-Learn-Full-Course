package module06_trees_and_bst;

/**
 * LEVEL 1 (BASIC): Maximum Depth of Binary Tree (LeetCode 104) & Same Tree (LeetCode 100)
 */
public class Level1_BasicTreeOps {

    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // 1. Max Depth of Binary Tree - O(N) Time
    public static int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }

    // 2. Same Tree - O(N) Time
    public static boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) return true;
        if (p == null || q == null || p.val != q.val) return false;
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }

    public static void main(String[] args) {
        System.out.println("--- Module 06: Level 1 (Basic Tree Operations) ---");
        TreeNode root = new TreeNode(3);
        root.left = new TreeNode(9);
        root.right = new TreeNode(20);
        root.right.left = new TreeNode(15);
        root.right.right = new TreeNode(7);

        System.out.println("Max depth of tree: " + maxDepth(root)); // 3
    }
}

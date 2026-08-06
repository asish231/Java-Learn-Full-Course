package module06_trees_and_bst;

import module06_trees_and_bst.BinarySearchTree.TreeNode;
import java.util.LinkedList;
import java.util.Queue;

/**
 * Tree Traversals:
 * 1. Pre-order DFS (Root -> Left -> Right)
 * 2. In-order DFS  (Left -> Root -> Right)
 * 3. Post-order DFS (Left -> Right -> Root)
 * 4. Level-order BFS (Queue-based)
 */
public class TreeTraversals {

    public static void preOrder(TreeNode root) {
        if (root == null) return;
        System.out.print(root.val + " ");
        preOrder(root.left);
        preOrder(root.right);
    }

    public static void inOrder(TreeNode root) {
        if (root == null) return;
        inOrder(root.left);
        System.out.print(root.val + " ");
        inOrder(root.right);
    }

    public static void postOrder(TreeNode root) {
        if (root == null) return;
        postOrder(root.left);
        postOrder(root.right);
        System.out.print(root.val + " ");
    }

    public static void levelOrderBFS(TreeNode root) {
        if (root == null) return;

        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);

        while (!queue.isEmpty()) {
            TreeNode current = queue.poll();
            System.out.print(current.val + " ");

            if (current.left != null) queue.add(current.left);
            if (current.right != null) queue.add(current.right);
        }
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 🌿 TREE TRAVERSALS DEMONSTRATION");
        System.out.println("==================================================\n");

        /*
                 1
                / \
               2   3
              / \
             4   5
         */
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        root.left.left = new TreeNode(4);
        root.left.right = new TreeNode(5);

        System.out.print("1. Pre-Order Traversal (Root, L, R):  ");
        preOrder(root);
        System.out.println();

        System.out.print("2. In-Order Traversal (L, Root, R):   ");
        inOrder(root);
        System.out.println();

        System.out.print("3. Post-Order Traversal (L, R, Root): ");
        postOrder(root);
        System.out.println();

        System.out.print("4. Level-Order BFS Traversal:         ");
        levelOrderBFS(root);
        System.out.println();

        System.out.println("\n✅ Tree Traversals test completed!");
    }
}

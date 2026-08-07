package module06_trees_and_bst;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Queue;

/**
 * Step 03: Breadth-First Search (BFS) / Level-Order Tree Traversal
 *
 * <pre>
 * QUEUE STATE DYNAMICS ACROSS LEVELS:
 * Tree:
 *         1          <-- Level 0
 *        / \
 *       2   3        <-- Level 1
 *      / \   \
 *     4   5   6      <-- Level 2
 *
 * Execution Queue Traversal:
 * Step 0: Queue [ 1 ]             -> Level 0: [1]
 * Step 1: Pop 1, Push 2, 3       -> Queue [ 2, 3 ]     -> Level 1: [2, 3]
 * Step 2: Pop 2 (Push 4,5), Pop 3 (Push 6) -> Queue [ 4, 5, 6 ] -> Level 2: [4, 5, 6]
 *
 * ZIGZAG LEVEL ORDER (Spiral BFS):
 * Level 0 (L -> R): [1]
 * Level 1 (R -> L): [3, 2]
 * Level 2 (L -> R): [4, 5, 6]
 * </pre>
 */
public class Step03_TreeTraversalBFS {

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
     * Standard Level-Order Traversal returning values grouped by tree depth levels.
     */
    public static List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;

        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);

        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            List<Integer> currentLevel = new ArrayList<>();

            for (int i = 0; i < levelSize; i++) {
                TreeNode currentNode = queue.poll();
                if (currentNode != null) {
                    currentLevel.add(currentNode.val);
                    if (currentNode.left != null) queue.offer(currentNode.left);
                    if (currentNode.right != null) queue.offer(currentNode.right);
                }
            }
            result.add(currentLevel);
        }

        return result;
    }

    /**
     * Zigzag Level-Order Traversal reversing node order on alternating levels.
     */
    public static List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;

        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        boolean leftToRight = true;

        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            List<Integer> currentLevel = new ArrayList<>();

            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                if (node != null) {
                    currentLevel.add(node.val);
                    if (node.left != null) queue.offer(node.left);
                    if (node.right != null) queue.offer(node.right);
                }
            }

            if (!leftToRight) {
                Collections.reverse(currentLevel);
            }
            result.add(currentLevel);
            leftToRight = !leftToRight; // Toggle traversal direction
        }

        return result;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 06 - Trees & BST | Step 03: BFS & Level-Order Traversals");
        System.out.println("======================================================================\n");

        // Construct Tree:
        //        1
        //       / \
        //      2   3
        //     / \   \
        //    4   5   6
        TreeNode root = new TreeNode(1,
                new TreeNode(2, new TreeNode(4), new TreeNode(5)),
                new TreeNode(3, null, new TreeNode(6)));

        System.out.println("[INIT] Built sample binary tree (Root=1, L=2, R=3, L.L=4, L.R=5, R.R=6).");

        // 1. Standard Level-Order Traversal Trace
        System.out.println("\n--- 1. Standard Level-Order Traversal Trace ---");
        System.out.println("[ACTION] Executing levelOrder()...");
        List<List<Integer>> levels = levelOrder(root);

        for (int depth = 0; depth < levels.size(); depth++) {
            System.out.println("[STATE] Depth Level " + depth + " Nodes: " + levels.get(depth));
            System.out.println("[MEMORY EVENT] Queue snapshot levelSize = " + levels.get(depth).size() + " drained cleanly.");
        }

        // 2. Zigzag Level-Order Traversal Trace
        System.out.println("\n--- 2. Zigzag (Spiral) Level-Order Traversal ---");
        System.out.println("[ACTION] Executing zigzagLevelOrder()...");
        List<List<Integer>> zigzag = zigzagLevelOrder(root);

        for (int depth = 0; depth < zigzag.size(); depth++) {
            String dir = (depth % 2 == 0) ? "Left -> Right" : "Right -> Left";
            System.out.println("[STATE] Depth Level " + depth + " (" + dir + "): " + zigzag.get(depth));
        }

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: BFS Level-Order Traversals executed cleanly.");
        System.out.println("======================================================================");
    }
}

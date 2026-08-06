package module06_trees_and_bst;

import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

/**
 * LEVEL 3 (ADVANCED / FAANG): Serialize and Deserialize Binary Tree (LeetCode 297 - Hard)
 * Pre-order DFS serialization and reconstruction using string parsing.
 */
public class Level3_AdvancedTreeOps {

    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // Encodes a tree to a single string: "1,2,#,#,3,4,#,#,5,#,#"
    public static String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        buildString(root, sb);
        return sb.toString();
    }

    private static void buildString(TreeNode node, StringBuilder sb) {
        if (node == null) {
            sb.append("#," );
        } else {
            sb.append(node.val).append(",");
            buildString(node.left, sb);
            buildString(node.right, sb);
        }
    }

    // Decodes string back to Binary Tree
    public static TreeNode deserialize(String data) {
        Deque<String> nodes = new ArrayDeque<>(Arrays.asList(data.split(",")));
        return buildTree(nodes);
    }

    private static TreeNode buildTree(Deque<String> nodes) {
        String val = nodes.poll();
        if (val.equals("#")) return null;
        TreeNode node = new TreeNode(Integer.parseInt(val));
        node.left = buildTree(nodes);
        node.right = buildTree(nodes);
        return node;
    }

    public static void main(String[] args) {
        System.out.println("--- Module 06: Level 3 (Advanced Tree Serialization Hard) ---");
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        root.right.left = new TreeNode(4);
        root.right.right = new TreeNode(5);

        String serialized = serialize(root);
        System.out.println("Serialized String: " + serialized);

        TreeNode reconstructed = deserialize(serialized);
        System.out.println("Reconstructed Root val: " + reconstructed.val);
        System.out.println("Reconstructed Right-Right val: " + reconstructed.right.right.val); // 5
    }
}

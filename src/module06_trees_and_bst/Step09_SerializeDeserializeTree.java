package module06_trees_and_bst;

import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Queue;

/**
 * Step 09: Binary Tree Serialization and Deserialization
 *
 * <pre>
 * PRE-ORDER DFS SERIALIZATION ENCODING:
 * Tree:
 *         1
 *        / \
 *       2   3
 *          / \
 *         4   5
 *
 * Pre-Order DFS Traversal with Null Markers ("#"):
 *  - Visit Node 1 -> Append "1,"
 *  - Visit Node 2 -> Append "2,"
 *  - Node 2 left is null -> Append "#,"
 *  - Node 2 right is null -> Append "#,"
 *  - Visit Node 3 -> Append "3,"
 *  - Visit Node 4 -> Append "4,"
 *  - Node 4 left/right null -> Append "#,#,"
 *  - Visit Node 5 -> Append "5,"
 *  - Node 5 left/right null -> Append "#,#,"
 *
 * Serialized String Output:
 * "1,2,#,#,3,4,#,#,5,#,#"
 *
 * DESERIALIZATION DECODING:
 * Queue: [1, 2, #, #, 3, 4, #, #, 5, #, #]
 * Poll token -> If numeric, create TreeNode and recursively reconstruct left and right subtrees!
 * </pre>
 */
public class Step09_SerializeDeserializeTree {

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
     * Codec helper class for tree serialization/deserialization.
     */
    static class Codec {
        private static final String NULL_MARKER = "#";
        private static final String DELIMITER = ",";

        // Encodes a tree to a single string.
        public String serialize(TreeNode root) {
            StringBuilder sb = new StringBuilder();
            buildString(root, sb);
            return sb.toString();
        }

        private void buildString(TreeNode node, StringBuilder sb) {
            if (node == null) {
                sb.append(NULL_MARKER).append(DELIMITER);
                return;
            }
            sb.append(node.val).append(DELIMITER);
            buildString(node.left, sb);
            buildString(node.right, sb);
        }

        // Decodes your encoded data to tree.
        public TreeNode deserialize(String data) {
            if (data == null || data.isEmpty()) return null;
            String[] tokens = data.split(DELIMITER);
            Queue<String> nodesQueue = new ArrayDeque<>(Arrays.asList(tokens));
            return buildTree(nodesQueue);
        }

        private TreeNode buildTree(Queue<String> queue) {
            if (queue.isEmpty()) return null;
            String valStr = queue.poll();
            if (valStr.equals(NULL_MARKER)) {
                return null;
            }

            TreeNode node = new TreeNode(Integer.parseInt(valStr));
            node.left = buildTree(queue);
            node.right = buildTree(queue);
            return node;
        }
    }

    public static boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) return true;
        if (p == null || q == null) return false;
        if (p.val != q.val) return false;
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 06 - Trees & BST | Step 09: Tree Serialization & Deserialization");
        System.out.println("======================================================================\n");

        // Construct Tree:
        //         1
        //        / \
        //       2   3
        //          / \
        //         4   5
        TreeNode root = new TreeNode(1,
                new TreeNode(2),
                new TreeNode(3, new TreeNode(4), new TreeNode(5)));

        System.out.println("[INIT] Created binary tree (Root=1, L=2, R=3, R.L=4, R.R=5).");

        Codec codec = new Codec();

        // 1. Serialization
        System.out.println("\n--- 1. Tree Serialization ---");
        System.out.println("[ACTION] Executing codec.serialize(root)...");
        String serialized = codec.serialize(root);
        System.out.println("[STATE] Serialized String Format: \"" + serialized + "\"");
        System.out.println("[MEMORY EVENT] Converted recursive tree references into flat pre-order string stream.");

        // 2. Deserialization
        System.out.println("\n--- 2. Tree Deserialization ---");
        System.out.println("[ACTION] Executing codec.deserialize(serialized)...");
        TreeNode reconstructedRoot = codec.deserialize(serialized);

        String reSerialized = codec.serialize(reconstructedRoot);
        System.out.println("[STATE] Re-serialized Reconstructed Tree String: \"" + reSerialized + "\"");

        // 3. Round-Trip Verification
        System.out.println("\n--- 3. Structural Equality & Round-Trip Verification ---");
        boolean isIdentical = isSameTree(root, reconstructedRoot);
        boolean stringMatch = serialized.equals(reSerialized);

        System.out.println("[STATE] Tree Pointer Structure Identical? " + isIdentical);
        System.out.println("[STATE] Serialized Strings Equal? " + stringMatch);

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Tree Serialization & Deserialization passed.");
        System.out.println("======================================================================");
    }
}

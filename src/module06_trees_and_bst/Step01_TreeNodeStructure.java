package module06_trees_and_bst;

/**
 * Step 01: Binary Tree Node Structure and Manual Assembly
 *
 * <pre>
 * TREENODE HEAP MEMORY LAYOUT:
 * TreeNode Object at 0x1000:
 *  +-----------------------+
 *  | val   : 1             |
 *  | left  : ref -> 0x2000 |  (Node 2)
 *  | right : ref -> 0x3000 |  (Node 3)
 *  +-----------------------+
 *            /           \
 *  TreeNode (0x2000)    TreeNode (0x3000)
 *  +---------------+    +---------------+
 *  | val   : 2     |    | val   : 3     |
 *  | left  : null  |    | left  : null  |
 *  | right : null  |    | right : null  |
 *  +---------------+    +---------------+
 *
 * TREE STRUCTURE DIAGRAM:
 *         1  (Root)
 *        / \
 *       2   3  (Leaves)
 * </pre>
 */
public class Step01_TreeNodeStructure {

    /**
     * Standard Binary Tree Node class.
     */
    public static class TreeNode {
        public int val;
        public TreeNode left;
        public TreeNode right;

        public TreeNode(int val) {
            this.val = val;
            this.left = null;
            this.right = null;
        }

        public TreeNode(int val, TreeNode left, TreeNode right) {
            this.val = val;
            this.left = left;
            this.right = right;
        }

        public boolean isLeaf() {
            return left == null && right == null;
        }

        public int getDegree() {
            int degree = 0;
            if (left != null) degree++;
            if (right != null) degree++;
            return degree;
        }

        @Override
        public String toString() {
            return "TreeNode(" + val + ")";
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 06 - Trees & BST | Step 01: TreeNode Structure & Manual Assembly");
        System.out.println("======================================================================\n");

        // 1. Instantiate Root Node
        System.out.println("[INIT] Creating Root Node with val = 1");
        TreeNode root = new TreeNode(1);
        System.out.println("[STATE] Root: " + root + " | isLeaf? " + root.isLeaf() + " | Degree: " + root.getDegree());
        System.out.println("[MEMORY EVENT] Allocated TreeNode object on Heap with left=null, right=null references.");

        // 2. Attach Left and Right Children
        System.out.println("\n--- 1. Manual Pointer Assembly ---");
        System.out.println("[ACTION] Linking root.left = new TreeNode(2)");
        root.left = new TreeNode(2);

        System.out.println("[ACTION] Linking root.right = new TreeNode(3)");
        root.right = new TreeNode(3);

        System.out.println("[STATE] Root Degree after linking children: " + root.getDegree());
        System.out.println("[STATE] root.left: " + root.left + " | isLeaf? " + root.left.isLeaf());
        System.out.println("[STATE] root.right: " + root.right + " | isLeaf? " + root.right.isLeaf());

        // 3. Attach Subtree under Node 2
        System.out.println("\n--- 2. Building Subtree at Level 2 ---");
        System.out.println("[ACTION] Linking root.left.left = new TreeNode(4)");
        root.left.left = new TreeNode(4);

        System.out.println("[ACTION] Linking root.left.right = new TreeNode(5)");
        root.left.right = new TreeNode(5);

        System.out.println("[STATE] Node(2) is no longer a leaf! Node(2) Degree: " + root.left.getDegree());
        System.out.println("[STATE] Node(4) isLeaf? " + root.left.left.isLeaf() + " | Node(5) isLeaf? " + root.left.right.isLeaf());

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: TreeNode structure created and linked cleanly.");
        System.out.println("======================================================================");
    }
}

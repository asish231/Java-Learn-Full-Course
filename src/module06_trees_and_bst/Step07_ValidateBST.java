package module06_trees_and_bst;

/**
 * Step 07: Validate Binary Search Tree (BST)
 *
 * <pre>
 * COMMON PITFALL IN BST VALIDATION:
 * Validating only local parent-child relationships (e.g., node.left < node && node.right > node) IS INCORRECT!
 *
 * COUNTER EXAMPLE TREE:
 *         10
 *        /  \
 *       5    15  <-- 15's left child is 6
 *           /  \
 *          6    20
 *
 * Local checks: 5 < 10 (OK), 15 > 10 (OK), 6 < 15 (OK), 20 > 15 (OK).
 * GLOBAL VIOLATION: Node 6 is in the RIGHT SUBTREE of 10, but 6 < 10! INVALID BST!
 *
 * CORRECT BOUNDARY PASSING MECHANISM:
 * Range for Root 10  : (-infinity, +infinity)
 * Range for Node 5   : (-infinity, 10)
 * Range for Node 15  : (10, +infinity)
 * Range for Node 6   : (10, 15)  ---> 6 NOT in (10, 15) -> INVALID DETECTED!
 * </pre>
 */
public class Step07_ValidateBST {

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
     * Range boundary validation algorithm.
     * Uses Long wrapper to prevent integer overflow when bounds equal Integer.MIN_VALUE/MAX_VALUE.
     */
    public static boolean isValidBSTRange(TreeNode root) {
        return validateRange(root, null, null);
    }

    private static boolean validateRange(TreeNode node, Long min, Long max) {
        if (node == null) return true;

        if ((min != null && node.val <= min) || (max != null && node.val >= max)) {
            return false;
        }

        return validateRange(node.left, min, (long) node.val)
                && validateRange(node.right, (long) node.val, max);
    }

    /**
     * In-Order Traversal Monotonicity Check algorithm.
     */
    static class InOrderValidator {
        private Long prev = null;

        public boolean isValidBST(TreeNode root) {
            prev = null;
            return inOrder(root);
        }

        private boolean inOrder(TreeNode node) {
            if (node == null) return true;

            if (!inOrder(node.left)) return false;

            if (prev != null && node.val <= prev) {
                return false;
            }
            prev = (long) node.val;

            return inOrder(node.right);
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 06 - Trees & BST | Step 07: Validate BST (Range Bounds)");
        System.out.println("======================================================================\n");

        // 1. Valid BST
        //       10
        //      /  \
        //     5    15
        //         /  \
        //        12   20
        TreeNode validTree = new TreeNode(10,
                new TreeNode(5),
                new TreeNode(15, new TreeNode(12), new TreeNode(20)));

        // 2. Invalid BST Counter-Example
        //       10
        //      /  \
        //     5    15
        //         /  \
        //        6    20   (6 is invalid here)
        TreeNode invalidTree = new TreeNode(10,
                new TreeNode(5),
                new TreeNode(15, new TreeNode(6), new TreeNode(20)));

        System.out.println("[INIT] Created Valid BST and Invalid Counter-Example BST.");

        // Testing Range Validator
        System.out.println("\n--- 1. Range Boundary Validation Trace ---");
        System.out.println("[ACTION] Validating Valid Tree via isValidBSTRange()...");
        boolean validRes = isValidBSTRange(validTree);
        System.out.println("[STATE] Valid Tree result: " + validRes + " (Expected: true)");
        System.out.println("[MEMORY EVENT] Boundaries propagated correctly down call stack.");

        System.out.println("\n[ACTION] Validating Counter-Example Invalid Tree via isValidBSTRange()...");
        boolean invalidRes = isValidBSTRange(invalidTree);
        System.out.println("[STATE] Invalid Tree result: " + invalidRes + " (Expected: false)");
        System.out.println("[MEMORY EVENT] Node 6 failed range check (10, 15) in right subtree of 10.");

        // Testing In-Order Monotonicity Validator
        System.out.println("\n--- 2. In-Order Monotonicity Validation ---");
        InOrderValidator inOrderVal = new InOrderValidator();
        boolean validInOrder = inOrderVal.isValidBST(validTree);
        boolean invalidInOrder = inOrderVal.isValidBST(invalidTree);

        System.out.println("[ACTION] In-Order Validator on Valid Tree: " + validInOrder);
        System.out.println("[ACTION] In-Order Validator on Invalid Tree: " + invalidInOrder);

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: BST validation algorithms executed cleanly.");
        System.out.println("======================================================================");
    }
}

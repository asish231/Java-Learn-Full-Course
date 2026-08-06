package module06_trees_and_bst;

/**
 * Binary Search Tree (BST) Implementation:
 * - Insert, Search, Delete (0, 1, 2 children), Inorder Traversal.
 */
public class BinarySearchTree {

    public static class TreeNode {
        public int val;
        public TreeNode left;
        public TreeNode right;

        public TreeNode(int val) {
            this.val = val;
        }
    }

    private TreeNode root;

    public TreeNode getRoot() { return root; }

    /**
     * Inserts value into BST - Avg O(log N), Worst O(N)
     */
    public void insert(int val) {
        root = insertRecursive(root, val);
    }

    private TreeNode insertRecursive(TreeNode current, int val) {
        if (current == null) {
            return new TreeNode(val);
        }
        if (val < current.val) {
            current.left = insertRecursive(current.left, val);
        } else if (val > current.val) {
            current.right = insertRecursive(current.right, val);
        }
        return current;
    }

    /**
     * Searches for value in BST - Avg O(log N)
     */
    public boolean search(int val) {
        return searchRecursive(root, val);
    }

    private boolean searchRecursive(TreeNode current, int val) {
        if (current == null) return false;
        if (current.val == val) return true;
        return val < current.val ? searchRecursive(current.left, val) : searchRecursive(current.right, val);
    }

    /**
     * Deletes a value from BST handling 3 cases:
     * 1. Leaf node
     * 2. Node with 1 child
     * 3. Node with 2 children (Replaced by Inorder Successor - min value in right subtree)
     */
    public void delete(int val) {
        root = deleteRecursive(root, val);
    }

    private TreeNode deleteRecursive(TreeNode current, int val) {
        if (current == null) return null;

        if (val < current.val) {
            current.left = deleteRecursive(current.left, val);
        } else if (val > current.val) {
            current.right = deleteRecursive(current.right, val);
        } else {
            // Found node to delete

            // Case 1 & 2: 0 or 1 child
            if (current.left == null) return current.right;
            if (current.right == null) return current.left;

            // Case 3: 2 children - Find inorder successor (min in right subtree)
            current.val = findMin(current.right);
            current.right = deleteRecursive(current.right, current.val);
        }
        return current;
    }

    private int findMin(TreeNode node) {
        int min = node.val;
        while (node.left != null) {
            min = node.left.val;
            node = node.left;
        }
        return min;
    }

    public void inorderPrint() {
        System.out.print("Inorder (Sorted): ");
        inorderRecursive(root);
        System.out.println();
    }

    private void inorderRecursive(TreeNode node) {
        if (node != null) {
            inorderRecursive(node.left);
            System.out.print(node.val + " ");
            inorderRecursive(node.right);
        }
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 🌲 BINARY SEARCH TREE (BST) DEMONSTRATION");
        System.out.println("==================================================\n");

        BinarySearchTree bst = new BinarySearchTree();
        System.out.println("Inserting: 50, 30, 20, 40, 70, 60, 80...");
        bst.insert(50);
        bst.insert(30);
        bst.insert(20);
        bst.insert(40);
        bst.insert(70);
        bst.insert(60);
        bst.insert(80);

        bst.inorderPrint(); // 20 30 40 50 60 70 80

        System.out.println("\nSearch 40: " + bst.search(40));
        System.out.println("Search 90: " + bst.search(90));

        System.out.println("\nDeleting leaf node (20)...");
        bst.delete(20);
        bst.inorderPrint();

        System.out.println("\nDeleting node with 2 children (50 - Root)...");
        bst.delete(50);
        bst.inorderPrint();

        System.out.println("\n✅ BST test completed!");
    }
}

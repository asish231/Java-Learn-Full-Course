package module08_disjoint_set_and_trie;

import java.util.ArrayList;
import java.util.List;

/**
 * Step 04: TrieNode Core Structure & Memory Layout
 *
 * <pre>
 * TRIE (PREFIX TREE) NODE ARCHITECTURE:
 *
 * Each TrieNode contains an array of 26 child references:
 * children[0]  -> 'a'
 * children[1]  -> 'b'
 * ...
 * children[25] -> 'z'
 *
 * Root Node (Empty char)
 *    |
 *    +-- ['c' at index 2]
 *         |
 *         +-- ['a' at index 0]
 *              |
 *              +-- ['t' at index 19] (isEndOfWord = true)  "cat"
 *                   |
 *                   +-- ['s' at index 18] (isEndOfWord = true) "cats"
 *
 * Memory overhead per node: Fixed array of 26 references (mostly null in sparse tries).
 * Index calculation: `int index = charVal - 'a';`
 * </pre>
 */
public class Step04_TrieNodeStructure {

    /**
     * Static inner class representing a single node in a Trie (Prefix Tree).
     */
    static class TrieNode {
        final TrieNode[] children;
        boolean isEndOfWord;

        public TrieNode() {
            this.children = new TrieNode[26]; // 26 letters 'a' through 'z'
            this.isEndOfWord = false;
        }

        public boolean hasChild(char ch) {
            return children[ch - 'a'] != null;
        }

        public TrieNode getChild(char ch) {
            return children[ch - 'a'];
        }

        public TrieNode putChildIfAbsent(char ch) {
            int idx = ch - 'a';
            if (children[idx] == null) {
                children[idx] = new TrieNode();
            }
            return children[idx];
        }

        public List<Character> getActiveChildrenChars() {
            List<Character> list = new ArrayList<>();
            for (int i = 0; i < 26; i++) {
                if (children[i] != null) {
                    list.add((char) ('a' + i));
                }
            }
            return list;
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 08 - Disjoint Set & Trie | Step 04: TrieNode Structure");
        System.out.println("======================================================================\n");

        TrieNode root = new TrieNode();
        System.out.println("[INIT] Initialized Root TrieNode with 26 null child slots.");
        System.out.println("[STATE] Active children at root: " + root.getActiveChildrenChars());

        System.out.println("\n--- 1. Manually Linking Nodes for word 'cat' ---");

        System.out.println("[ACTION] Inserting 'c' under root...");
        TrieNode nodeC = root.putChildIfAbsent('c');
        System.out.println("[MEMORY EVENT] Allocated TrieNode at root.children['c'-'a' = 2]");

        System.out.println("[ACTION] Inserting 'a' under 'c'...");
        TrieNode nodeA = nodeC.putChildIfAbsent('a');
        System.out.println("[MEMORY EVENT] Allocated TrieNode at nodeC.children['a'-'a' = 0]");

        System.out.println("[ACTION] Inserting 't' under 'a'...");
        TrieNode nodeT = nodeA.putChildIfAbsent('t');
        nodeT.isEndOfWord = true;
        System.out.println("[MEMORY EVENT] Allocated TrieNode at nodeA.children['t'-'a' = 19] | Set isEndOfWord = true");

        System.out.println("\n--- 2. Inspecting Trie Traversal for 'cat' ---");
        TrieNode curr = root;
        String searchWord = "cat";
        boolean valid = true;

        for (int i = 0; i < searchWord.length(); i++) {
            char ch = searchWord.charAt(i);
            if (curr.hasChild(ch)) {
                curr = curr.getChild(ch);
                System.out.println("[STATE] Step " + (i + 1) + ": Found '" + ch + "' -> Active sub-branches: "
                        + curr.getActiveChildrenChars() + " | isEndOfWord: " + curr.isEndOfWord);
            } else {
                valid = false;
                break;
            }
        }

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Word 'cat' path exists: " + valid + " and ends at terminal node.");
        System.out.println("======================================================================");
    }
}

package module08_disjoint_set_and_trie;

/**
 * Trie (Prefix Tree) Implementation supporting lowercase English letters 'a'-'z'.
 */
public class Trie {

    public static class TrieNode {
        public TrieNode[] children;
        public boolean isEndOfWord;

        public TrieNode() {
            children = new TrieNode[26];
            isEndOfWord = false;
        }
    }

    private final TrieNode root;

    public Trie() {
        root = new TrieNode();
    }

    /**
     * Inserts word into the Trie - O(L) where L = word length
     */
    public void insert(String word) {
        TrieNode curr = root;
        for (char ch : word.toLowerCase().toCharArray()) {
            int idx = ch - 'a';
            if (curr.children[idx] == null) {
                curr.children[idx] = new TrieNode();
            }
            curr = curr.children[idx];
        }
        curr.isEndOfWord = true;
    }

    /**
     * Searches for exact word match - O(L)
     */
    public boolean search(String word) {
        TrieNode node = searchNode(word);
        return node != null && node.isEndOfWord;
    }

    /**
     * Checks if any word in Trie starts with prefix - O(L)
     */
    public boolean startsWith(String prefix) {
        return searchNode(prefix) != null;
    }

    private TrieNode searchNode(String str) {
        TrieNode curr = root;
        for (char ch : str.toLowerCase().toCharArray()) {
            int idx = ch - 'a';
            if (curr.children[idx] == null) {
                return null;
            }
            curr = curr.children[idx];
        }
        return curr;
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 🔤 TRIE (PREFIX TREE) DEMONSTRATION");
        System.out.println("==================================================\n");

        Trie trie = new Trie();
        System.out.println("Inserting words: \"apple\", \"app\", \"apricot\", \"algo\", \"algorithm\"...");
        trie.insert("apple");
        trie.insert("app");
        trie.insert("apricot");
        trie.insert("algo");
        trie.insert("algorithm");

        System.out.println("\nSearch exact \"app\":        " + trie.search("app"));       // true
        System.out.println("Search exact \"apple\":      " + trie.search("apple"));     // true
        System.out.println("Search exact \"appl\":       " + trie.search("appl"));      // false

        System.out.println("\nStarts with prefix \"ap\":   " + trie.startsWith("ap"));   // true
        System.out.println("Starts with prefix \"alg\":  " + trie.startsWith("alg"));  // true
        System.out.println("Starts with prefix \"bat\":  " + trie.startsWith("bat"));  // false

        System.out.println("\n✅ Trie test completed!");
    }
}

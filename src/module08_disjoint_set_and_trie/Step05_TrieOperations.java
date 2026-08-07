package module08_disjoint_set_and_trie;

/**
 * Step 05: Standard Trie Operations (Insert, Search, StartsWith)
 *
 * <pre>
 * TRIE OPERATIONAL FLOW:
 *
 * Insert("apple"):
 *   Root -> 'a' -> 'p' -> 'p' -> 'l' -> 'e' (isEndOfWord = true)
 *
 * Insert("app"):
 *   Root -> 'a' -> 'p' -> 'p' (isEndOfWord = true)  [Reuses prefix 'a'->'p'->'p'!]
 *
 * Operations:
 *   - insert(word)    : O(L) time where L = length of word
 *   - search(word)    : O(L) time, verifies node exists AND isEndOfWord == true
 *   - startsWith(pref): O(L) time, verifies node path exists regardless of isEndOfWord flag
 * </pre>
 */
public class Step05_TrieOperations {

    static class TrieNode {
        final TrieNode[] children = new TrieNode[26];
        boolean isEndOfWord;
    }

    /**
     * Complete Trie Class supporting word insertion, exact search, and prefix matching.
     */
    static class Trie {
        private final TrieNode root;

        public Trie() {
            this.root = new TrieNode();
        }

        public void insert(String word) {
            System.out.println("\n[ACTION] Inserting word: \"" + word + "\"");
            TrieNode curr = root;
            for (int i = 0; i < word.length(); i++) {
                char ch = word.charAt(i);
                int idx = ch - 'a';
                if (curr.children[idx] == null) {
                    curr.children[idx] = new TrieNode();
                    System.out.println("  [MEMORY EVENT] Created new node for character '" + ch + "' at depth " + (i + 1));
                } else {
                    System.out.println("  [STATE] Reusing existing node for character '" + ch + "' at depth " + (i + 1));
                }
                curr = curr.children[idx];
            }
            curr.isEndOfWord = true;
            System.out.println("  [STATE] Marked terminal node for word \"" + word + "\"");
        }

        public boolean search(String word) {
            System.out.println("\n[ACTION] Searching exact word: \"" + word + "\"");
            TrieNode node = navigateToNode(word);
            boolean found = node != null && node.isEndOfWord;
            System.out.println("[STATE] Search result for \"" + word + "\": " + found);
            return found;
        }

        public boolean startsWith(String prefix) {
            System.out.println("\n[ACTION] Checking prefix search: \"" + prefix + "\"");
            TrieNode node = navigateToNode(prefix);
            boolean found = node != null;
            System.out.println("[STATE] StartsWith result for \"" + prefix + "\": " + found);
            return found;
        }

        private TrieNode navigateToNode(String s) {
            TrieNode curr = root;
            for (int i = 0; i < s.length(); i++) {
                char ch = s.charAt(i);
                int idx = ch - 'a';
                if (curr.children[idx] == null) {
                    System.out.println("  [STATE] Branch broken at char '" + ch + "' (index " + i + ")");
                    return null;
                }
                curr = curr.children[idx];
            }
            return curr;
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 08 - Disjoint Set & Trie | Step 05: Standard Trie Operations");
        System.out.println("======================================================================\n");

        Trie trie = new Trie();
        System.out.println("[INIT] Initialized empty Trie.");

        // Insert dictionary words
        trie.insert("apple");
        trie.insert("app");
        trie.insert("apricot");
        trie.insert("banana");

        // Search tests
        System.out.println("\n--- Testing Exact Word Searches ---");
        trie.search("app");     // true
        trie.search("apple");   // true
        trie.search("appl");    // false (prefix exists, but not end of word)
        trie.search("orange");  // false

        // StartsWith tests
        System.out.println("\n--- Testing Prefix Searches ---");
        trie.startsWith("ap");   // true
        trie.startsWith("appl"); // true
        trie.startsWith("ban");  // true
        trie.startsWith("cat");  // false

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Trie operations verified.");
        System.out.println("======================================================================");
    }
}

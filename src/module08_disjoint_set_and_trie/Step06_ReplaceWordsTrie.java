package module08_disjoint_set_and_trie;

import java.util.Arrays;
import java.util.List;

/**
 * Step 06: Replace Words in Sentence using Trie Prefix Matching
 *
 * <pre>
 * REPLACE WORDS ALGORITHM:
 *
 * Dictionary Roots: ["cat", "bat", "rat"]
 * Sentence: "the cattle was rattled by the battery"
 *
 * Build Trie of Roots:
 *   Root -> 'c' -> 'a' -> 't' (isEndOfWord = true)
 *   Root -> 'b' -> 'a' -> 't' (isEndOfWord = true)
 *   Root -> 'r' -> 'a' -> 't' (isEndOfWord = true)
 *
 * Word Replacement Stream:
 *   "the"     -> Prefix matching fails -> Keep "the"
 *   "cattle"  -> Prefix matches 'c'->'a'->'t' (Root found!) -> Replace with "cat"
 *   "rattled" -> Prefix matches 'r'->'a'->'t' (Root found!) -> Replace with "rat"
 *   "battery" -> Prefix matches 'b'->'a'->'t' (Root found!) -> Replace with "bat"
 *
 * Output Sentence: "the cat was rat by the bat"
 * </pre>
 */
public class Step06_ReplaceWordsTrie {

    static class TrieNode {
        final TrieNode[] children = new TrieNode[26];
        String rootWord = null; // Store complete root word at terminal node
    }

    /**
     * Trie engine dedicated to finding shortest root replacements for words.
     */
    static class PrefixReplacerTrie {
        private final TrieNode root;

        public PrefixReplacerTrie() {
            this.root = new TrieNode();
        }

        public void insertRoot(String word) {
            TrieNode curr = root;
            for (int i = 0; i < word.length(); i++) {
                char ch = word.charAt(i);
                int idx = ch - 'a';
                if (curr.children[idx] == null) {
                    curr.children[idx] = new TrieNode();
                }
                curr = curr.children[idx];
            }
            curr.rootWord = word;
            System.out.println("  [MEMORY EVENT] Stored root word \"" + word + "\" in Trie node.");
        }

        /**
         * Returns shortest matching root for word, or original word if no root match.
         */
        public String findShortestRoot(String word) {
            TrieNode curr = root;
            for (int i = 0; i < word.length(); i++) {
                char ch = word.charAt(i);
                int idx = ch - 'a';
                if (curr.children[idx] == null) {
                    return word; // No matching root prefix
                }
                curr = curr.children[idx];
                if (curr.rootWord != null) {
                    System.out.println("  [ACTION] Matched root prefix \"" + curr.rootWord + "\" for word \"" + word + "\"");
                    return curr.rootWord; // Return shortest matching root!
                }
            }
            return word;
        }
    }

    public static String replaceWords(List<String> dictionary, String sentence) {
        PrefixReplacerTrie trie = new PrefixReplacerTrie();

        System.out.println("[INIT] Building Root Trie from Dictionary: " + dictionary);
        for (String root : dictionary) {
            trie.insertRoot(root);
        }

        String[] words = sentence.split("\\s+");
        StringBuilder sb = new StringBuilder();

        System.out.println("\n--- Processing Sentence Words ---");
        for (int i = 0; i < words.length; i++) {
            String originalWord = words[i];
            String replacement = trie.findShortestRoot(originalWord);

            if (!replacement.equals(originalWord)) {
                System.out.println("[STATE] Word " + (i + 1) + ": \"" + originalWord + "\" ===> Replaced with \"" + replacement + "\"");
            } else {
                System.out.println("[STATE] Word " + (i + 1) + ": \"" + originalWord + "\" ===> Kept unchanged");
            }

            sb.append(replacement);
            if (i < words.length - 1) {
                sb.append(" ");
            }
        }

        return sb.toString();
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 08 - Disjoint Set & Trie | Step 06: Replace Words via Trie");
        System.out.println("======================================================================\n");

        List<String> dictionary = Arrays.asList("cat", "bat", "rat");
        String sentence = "the cattle was rattled by the battery";

        System.out.println("[INIT] Input Sentence: \"" + sentence + "\"");

        String result = replaceWords(dictionary, sentence);

        System.out.println("\n======================================================================");
        System.out.println("RESULT: Replaced Sentence: \"" + result + "\"");
        System.out.println("======================================================================");
    }
}

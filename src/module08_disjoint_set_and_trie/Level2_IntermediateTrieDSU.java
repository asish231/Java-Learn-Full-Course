package module08_disjoint_set_and_trie;

import java.util.Arrays;
import java.util.List;

/**
 * LEVEL 2 (INTERMEDIATE): Replace Words using Trie (LeetCode 648 - Medium)
 */
public class Level2_IntermediateTrieDSU {

    static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        String word = null;
    }

    public static String replaceWords(List<String> dictionary, String sentence) {
        TrieNode root = new TrieNode();

        // Build Trie from dictionary roots
        for (String rootWord : dictionary) {
            TrieNode curr = root;
            for (char c : rootWord.toCharArray()) {
                int idx = c - 'a';
                if (curr.children[idx] == null) curr.children[idx] = new TrieNode();
                curr = curr.children[idx];
            }
            curr.word = rootWord;
        }

        StringBuilder res = new StringBuilder();
        String[] words = sentence.split(" ");

        for (int i = 0; i < words.length; i++) {
            if (i > 0) res.append(" ");
            String word = words[i];
            TrieNode curr = root;

            for (char c : word.toCharArray()) {
                int idx = c - 'a';
                if (curr.children[idx] == null || curr.word != null) break;
                curr = curr.children[idx];
            }
            res.append(curr.word != null ? curr.word : word);
        }

        return res.toString();
    }

    public static void main(String[] args) {
        System.out.println("--- Module 08: Level 2 (Intermediate Replace Words using Trie) ---");
        List<String> dict = Arrays.asList("cat", "bat", "rat");
        String sentence = "the cattle was rattled by the battery";
        System.out.println("Original Sentence:  " + sentence);
        System.out.println("Replaced Sentence:  " + replaceWords(dict, sentence));
    }
}

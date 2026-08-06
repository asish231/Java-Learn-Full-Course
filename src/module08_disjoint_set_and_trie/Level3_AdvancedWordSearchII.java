package module08_disjoint_set_and_trie;

import java.util.ArrayList;
import java.util.List;

/**
 * LEVEL 3 (ADVANCED / FAANG): Word Search II (LeetCode 212 - Hard / Boggle Board)
 * Combines 2D Grid DFS Backtracking + Trie Prefix Tree to search dictionary words in O(M*N * 4^L).
 */
public class Level3_AdvancedWordSearchII {

    static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        String word;
    }

    public static List<String> findWords(char[][] board, String[] words) {
        List<String> res = new ArrayList<>();
        TrieNode root = buildTrie(words);

        for (int r = 0; r < board.length; r++) {
            for (int c = 0; c < board[0].length; c++) {
                dfs(board, r, c, root, res);
            }
        }
        return res;
    }

    private static void dfs(char[][] board, int r, int c, TrieNode node, List<String> res) {
        char ch = board[r][c];
        if (ch == '#' || node.children[ch - 'a'] == null) return;

        node = node.children[ch - 'a'];
        if (node.word != null) {
            res.add(node.word);
            node.word = null; // Avoid duplicate matches
        }

        board[r][c] = '#'; // Mark visited
        int[] dr = {-1, 1, 0, 0}, dc = {0, 0, -1, 1};
        for (int i = 0; i < 4; i++) {
            int nr = r + dr[i], nc = c + dc[i];
            if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length) {
                dfs(board, nr, nc, node, res);
            }
        }
        board[r][c] = ch; // Backtrack
    }

    private static TrieNode buildTrie(String[] words) {
        TrieNode root = new TrieNode();
        for (String w : words) {
            TrieNode curr = root;
            for (char c : w.toCharArray()) {
                int idx = c - 'a';
                if (curr.children[idx] == null) curr.children[idx] = new TrieNode();
                curr = curr.children[idx];
            }
            curr.word = w;
        }
        return root;
    }

    public static void main(String[] args) {
        System.out.println("--- Module 08: Level 3 (Advanced Word Search II Hard) ---");
        char[][] board = {
            {'o','a','a','n'},
            {'e','t','a','e'},
            {'i','h','k','r'},
            {'i','f','l','v'}
        };
        String[] words = {"oath","pea","eat","rain"};
        System.out.println("Words found on grid: " + findWords(board, words)); // [oath, eat]
    }
}

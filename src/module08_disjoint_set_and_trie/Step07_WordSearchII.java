package module08_disjoint_set_and_trie;

import java.util.ArrayList;
import java.util.List;

/**
 * Step 07: Word Search II (2D Grid Backtracking DFS + Trie Pruning)
 *
 * <pre>
 * WORD SEARCH II GRID DFS + TRIE PRUNING:
 *
 * Grid Board (4x4):
 *   [ 'o', 'a', 'a', 'n' ]
 *   [ 'e', 't', 'a', 'e' ]
 *   [ 'i', 'h', 'k', 'r' ]
 *   [ 'i', 'f', 'l', 'v' ]
 *
 * Dictionary Words: ["oath", "pea", "eat", "rain"]
 *
 * Trie Search & Pruning:
 *   1. Build Trie containing dictionary words.
 *   2. For each grid cell (r, c), start DFS(r, c, root).
 *   3. If next char in grid is NOT a child in current TrieNode -> PRUNE DFS IMMEDIATELY!
 *   4. Mark visited cells: board[r][c] = '#' (restore on backtrack).
 * </pre>
 */
public class Step07_WordSearchII {

    static class TrieNode {
        final TrieNode[] children = new TrieNode[26];
        String word = null; // Stores target word when full path is matched
    }

    static class WordSearchSolver {
        private final TrieNode root;

        public WordSearchSolver(String[] words) {
            this.root = new TrieNode();
            for (String w : words) {
                insertWord(w);
            }
        }

        private void insertWord(String word) {
            TrieNode curr = root;
            for (int i = 0; i < word.length(); i++) {
                char ch = word.charAt(i);
                int idx = ch - 'a';
                if (curr.children[idx] == null) {
                    curr.children[idx] = new TrieNode();
                }
                curr = curr.children[idx];
            }
            curr.word = word;
        }

        public List<String> findWords(char[][] board) {
            List<String> result = new ArrayList<>();
            int rows = board.length;
            int cols = board[0].length;

            System.out.println("[ACTION] Starting 2D Grid Search across " + rows + "x" + cols + " cells...");

            for (int r = 0; r < rows; r++) {
                for (int c = 0; c < cols; c++) {
                    char ch = board[r][c];
                    if (root.children[ch - 'a'] != null) {
                        dfs(board, r, c, root, result);
                    }
                }
            }
            return result;
        }

        private void dfs(char[][] board, int r, int c, TrieNode parent, List<String> result) {
            char ch = board[r][c];
            int idx = ch - 'a';

            TrieNode currNode = parent.children[idx];
            if (currNode == null) {
                return; // Trie prefix pruning!
            }

            // Word match found!
            if (currNode.word != null) {
                System.out.println("  [STATE] Found Word: \"" + currNode.word + "\" ending at Cell (" + r + ", " + c + ")");
                result.add(currNode.word);
                currNode.word = null; // Clear to prevent duplicate results
            }

            // Mark cell as visited
            board[r][c] = '#';
            System.out.println("  [MEMORY EVENT] Visited Cell (" + r + ", " + c + ") -> Char '" + ch + "' (Temporarily marked '#')");

            // 4-Directional Grid Exploration (Up, Down, Left, Right)
            int[] rowDirs = {-1, 1, 0, 0};
            int[] colDirs = {0, 0, -1, 1};

            for (int d = 0; d < 4; d++) {
                int nextR = r + rowDirs[d];
                int nextC = c + colDirs[d];

                if (nextR >= 0 && nextR < board.length && nextC >= 0 && nextC < board[0].length) {
                    char nextChar = board[nextR][nextC];
                    if (nextChar != '#' && currNode.children[nextChar - 'a'] != null) {
                        dfs(board, nextR, nextC, currNode, result);
                    }
                }
            }

            // Backtrack: Restore cell character
            board[r][c] = ch;
        }
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 08 - Disjoint Set & Trie | Step 07: Word Search II (Trie + DFS)");
        System.out.println("======================================================================\n");

        char[][] board = {
            {'o', 'a', 'a', 'n'},
            {'e', 't', 'a', 'e'},
            {'i', 'h', 'k', 'r'},
            {'i', 'f', 'l', 'v'}
        };
        String[] words = {"oath", "pea", "eat", "rain"};

        System.out.println("[INIT] Grid Board Initialized.");
        System.out.println("[INIT] Target Search Words: " + String.join(", ", words));

        WordSearchSolver solver = new WordSearchSolver(words);
        List<String> foundWords = solver.findWords(board);

        System.out.println("\n======================================================================");
        System.out.println("RESULT: Words Found in Grid: " + foundWords);
        System.out.println("======================================================================");
    }
}

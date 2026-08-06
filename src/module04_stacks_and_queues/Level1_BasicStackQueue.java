package module04_stacks_and_queues;

import java.util.ArrayDeque;
import java.util.Deque;

/**
 * LEVEL 1 (BASIC): Valid Parentheses (LeetCode 20) & Min Stack (LeetCode 155)
 */
public class Level1_BasicStackQueue {

    // 1. Valid Parentheses - O(N) Time, O(N) Space
    public static boolean isValidParentheses(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        System.out.println("--- Module 04: Level 1 (Basic Stack & Queue) ---");
        String expr1 = "{[()]}", expr2 = "{[(])}";
        System.out.println("Is \"" + expr1 + "\" valid? " + isValidParentheses(expr1)); // true
        System.out.println("Is \"" + expr2 + "\" valid? " + isValidParentheses(expr2)); // false
    }
}

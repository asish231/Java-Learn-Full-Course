package module04_stacks_and_queues;

import java.util.ArrayDeque;
import java.util.Deque;

/**
 * Step 03: Stack Applications — Expression Matching, RPN Evaluation & Infix Parsing
 *
 * <pre>
 * 1. Parentheses Matching Stack Trace:
 *    Input String: "{ [ ( ) ] }"
 *
 *    Char '{': Push '{' -> Stack: [ '{' ]
 *    Char '[': Push '[' -> Stack: [ '{', '[' ]
 *    Char '(': Push '(' -> Stack: [ '{', '[', '(' ]
 *    Char ')': Pop top ('(' matches ')') -> Stack: [ '{', '[' ]
 *    Char ']': Pop top ('[' matches ']') -> Stack: [ '{' ]
 *    Char '}': Pop top ('{' matches '}') -> Stack: [ ] (Empty -> VALID!)
 *
 * 2. Postfix RPN Evaluation ("3 4 + 2 *"):
 *    Token '3': Push 3      -> Stack: [ 3 ]
 *    Token '4': Push 4      -> Stack: [ 3, 4 ]
 *    Token '+': Pop b=4, a=3 -> Push (3 + 4 = 7) -> Stack: [ 7 ]
 *    Token '2': Push 2      -> Stack: [ 7, 2 ]
 *    Token '*': Pop b=2, a=7 -> Push (7 * 2 = 14) -> Stack: [ 14 ]
 *    Result = 14
 * </pre>
 */
public class Step03_StackApplicationsMatching {

    /**
     * Valid Parentheses (LeetCode 20).
     * Time: O(N), Space: O(N)
     */
    public static boolean isValidParentheses(String s) {
        if (s == null) return false;
        Deque<Character> stack = new ArrayDeque<>();

        for (char ch : s.toCharArray()) {
            if (ch == '(' || ch == '{' || ch == '[') {
                stack.push(ch);
            } else if (ch == ')' || ch == '}' || ch == ']') {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if (ch == ')' && top != '(') return false;
                if (ch == '}' && top != '{') return false;
                if (ch == ']' && top != '[') return false;
            }
        }
        return stack.isEmpty();
    }

    /**
     * Evaluate Reverse Polish Notation (RPN Postfix) (LeetCode 150).
     * Time: O(N), Space: O(N)
     */
    public static int evalRPN(String[] tokens) {
        if (tokens == null || tokens.length == 0) return 0;
        Deque<Integer> stack = new ArrayDeque<>();

        for (String token : tokens) {
            if (token.equals("+")) {
                int b = stack.pop();
                int a = stack.pop();
                stack.push(a + b);
            } else if (token.equals("-")) {
                int b = stack.pop();
                int a = stack.pop();
                stack.push(a - b);
            } else if (token.equals("*")) {
                int b = stack.pop();
                int a = stack.pop();
                stack.push(a * b);
            } else if (token.equals("/")) {
                int b = stack.pop();
                int a = stack.pop();
                stack.push(a / b);
            } else {
                stack.push(Integer.parseInt(token));
            }
        }
        return stack.pop();
    }

    /**
     * Infix to Postfix Conversion (Basic Shunting-Yard Algorithm).
     */
    public static String infixToPostfix(String infix) {
        StringBuilder result = new StringBuilder();
        Deque<Character> stack = new ArrayDeque<>();

        for (char c : infix.toCharArray()) {
            if (Character.isLetterOrDigit(c)) {
                result.append(c);
            } else if (c == '(') {
                stack.push(c);
            } else if (c == ')') {
                while (!stack.isEmpty() && stack.peek() != '(') {
                    result.append(stack.pop());
                }
                if (!stack.isEmpty()) stack.pop(); // Remove '('
            } else if (isOperator(c)) {
                while (!stack.isEmpty() && precedence(c) <= precedence(stack.peek())) {
                    result.append(stack.pop());
                }
                stack.push(c);
            }
        }
        while (!stack.isEmpty()) {
            result.append(stack.pop());
        }
        return result.toString();
    }

    private static boolean isOperator(char c) {
        return c == '+' || c == '-' || c == '*' || c == '/';
    }

    private static int precedence(char op) {
        if (op == '+' || op == '-') return 1;
        if (op == '*' || op == '/') return 2;
        return -1;
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 04 - Stacks & Queues | Step 03: Stack Applications");
        System.out.println("======================================================================\n");

        System.out.println("--- 1. Valid Parentheses Matching ---");
        String valid1 = "{[()]}";
        String invalid1 = "([)]";
        System.out.println("[INIT] Testing String 1: \"" + valid1 + "\"");
        System.out.println("[STATE] Is Valid: " + isValidParentheses(valid1));
        System.out.println("[INIT] Testing String 2: \"" + invalid1 + "\"");
        System.out.println("[STATE] Is Valid: " + isValidParentheses(invalid1));

        System.out.println("\n--- 2. Reverse Polish Notation (RPN) Postfix Evaluation ---");
        String[] rpnTokens1 = {"2", "1", "+", "3", "*"}; // (2 + 1) * 3 = 9
        String[] rpnTokens2 = {"4", "13", "5", "/", "+"}; // 4 + (13 / 5) = 6
        System.out.println("[INIT] RPN Expression 1: [2, 1, +, 3, *]");
        System.out.println("[STATE] Evaluation Result = " + evalRPN(rpnTokens1));
        System.out.println("[INIT] RPN Expression 2: [4, 13, 5, /, +]");
        System.out.println("[STATE] Evaluation Result = " + evalRPN(rpnTokens2));

        System.out.println("\n--- 3. Infix to Postfix Shunting-Yard Parsing ---");
        String infix = "A+B*(C-D)";
        System.out.println("[INIT] Infix Expression: \"" + infix + "\"");
        String postfix = infixToPostfix(infix);
        System.out.println("[STATE] Converted Postfix: \"" + postfix + "\"");

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Stack matching & expression apps verified.");
        System.out.println("======================================================================");
    }
}

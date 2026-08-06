package module11_greedy_algorithms;

import java.util.Arrays;

/**
 * LEVEL 1 (BASIC): Assign Cookies (LeetCode 455 - Easy)
 * Greedy sorting matching minimum cookie size to child greed factor.
 */
public class Level1_BasicGreedy {

    public static int findContentChildren(int[] g, int[] s) {
        Arrays.sort(g);
        Arrays.sort(s);
        int child = 0, cookie = 0;
        while (child < g.length && cookie < s.length) {
            if (s[cookie] >= g[child]) {
                child++; // Content child satisfied
            }
            cookie++;
        }
        return child;
    }

    public static void main(String[] args) {
        System.out.println("--- Module 11: Level 1 (Basic Greedy Assign Cookies) ---");
        int[] childrenGreed = {1, 2, 3};
        int[] cookieSizes = {1, 1};
        System.out.println("Content children count: " + findContentChildren(childrenGreed, cookieSizes)); // 1
    }
}

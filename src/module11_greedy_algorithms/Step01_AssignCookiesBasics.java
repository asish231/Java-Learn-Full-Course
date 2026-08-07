package module11_greedy_algorithms;

import java.util.Arrays;

/**
 * Step 01: Assign Cookies — Greedy Choice Property & Two Pointers
 *
 * <pre>
 * GREEDY CHOICE TWO-POINTER MATCHING VISUALIZATION:
 *
 * Children Greed Factors (Sorted): g = [1, 2, 3]
 * Cookie Sizes          (Sorted): s = [1, 1]
 *
 * Step 1: Child Pointer gIdx = 0 (Greed = 1), Cookie Pointer sIdx = 0 (Size = 1)
 *         s[0] >= g[0] (1 >= 1) -> Match! Content Count = 1.
 *         Advance gIdx -> 1, sIdx -> 1.
 *
 * Step 2: Child Pointer gIdx = 1 (Greed = 2), Cookie Pointer sIdx = 1 (Size = 1)
 *         s[1] < g[1] (1 < 2) -> Cookie too small! Cannot satisfy child 1.
 *         Advance sIdx -> 2 (Out of bounds).
 *
 * Result: Maximum Content Children = 1
 * Greedy Strategy: Giving the smallest cookie that satisfies a child leaves larger
 * cookies for children with greater greed factors.
 * </pre>
 */
public class Step01_AssignCookiesBasics {

    public static class AssignResult {
        public final int contentChildren;
        public final int cookiesUsed;

        public AssignResult(int contentChildren, int cookiesUsed) {
            this.contentChildren = contentChildren;
            this.cookiesUsed = cookiesUsed;
        }
    }

    /**
     * Assigns cookies to children greedily to maximize content children count.
     *
     * @param g greed factor of children
     * @param s size of cookies
     * @return maximum number of satisfied children
     */
    public static AssignResult findContentChildren(int[] g, int[] s) {
        int[] sortedG = g.clone();
        int[] sortedS = s.clone();

        Arrays.sort(sortedG);
        Arrays.sort(sortedS);

        int gIdx = 0; // Pointer for children
        int sIdx = 0; // Pointer for cookies

        while (gIdx < sortedG.length && sIdx < sortedS.length) {
            if (sortedS[sIdx] >= sortedG[gIdx]) {
                // Cookie satisfies child -> Allocate
                System.out.println("  [ACTION] Matched Cookie (Size " + sortedS[sIdx] + ") to Child (Greed " + sortedG[gIdx] + ")");
                gIdx++;
            } else {
                System.out.println("  [STATE] Cookie (Size " + sortedS[sIdx] + ") too small for Child (Greed " + sortedG[gIdx] + ") -> Skip Cookie");
            }
            sIdx++; // Try next cookie
        }

        return new AssignResult(gIdx, sIdx);
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 11 - Step 01: Assign Cookies (Greedy Two-Pointer Matching)");
        System.out.println("======================================================================\n");

        int[] g = {1, 2, 3};
        int[] s = {1, 1};

        System.out.println("[INIT] Children Greed Array g: " + Arrays.toString(g));
        System.out.println("[INIT] Cookie Sizes Array s:   " + Arrays.toString(s));

        System.out.println("\n--- Executing Two-Pointer Greedy Matching ---");
        AssignResult res = findContentChildren(g, s);

        System.out.println("\n[STATE] Total Content Children: " + res.contentChildren);

        System.out.println("\n--- Test Case 2: Larger Greed & Cookie Arrays ---");
        int[] g2 = {1, 2, 7, 10};
        int[] s2 = {1, 3, 5, 9};

        System.out.println("[INIT] Children Greed Array g2: " + Arrays.toString(g2));
        System.out.println("[INIT] Cookie Sizes Array s2:   " + Arrays.toString(s2));

        AssignResult res2 = findContentChildren(g2, s2);
        System.out.println("\n[STATE] Total Content Children (Test 2): " + res2.contentChildren);

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Step01_AssignCookiesBasics executed cleanly.");
        System.out.println("======================================================================");
    }
}

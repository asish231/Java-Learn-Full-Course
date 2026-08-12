package module02_arrays_and_strings;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

/**
 * Merge intervals and related interval problems.
 *
 * Topics covered:
 *   - Merge overlapping intervals (LeetCode 56)
 *   - Insert interval (LeetCode 57)
 *   - Non-overlapping intervals (LeetCode 435)
 */
public class MergeIntervals {

    public static int[][] merge(int[][] intervals) {
        if (intervals == null || intervals.length == 0) return new int[0][2];
        Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
        List<int[]> merged = new ArrayList<>();
        for (int[] iv : intervals) {
            if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < iv[0]) {
                merged.add(iv);
            } else {
                merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], iv[1]);
            }
        }
        return merged.toArray(new int[0][]);
    }

    public static int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> res = new ArrayList<>();
        int i = 0, n = intervals.length;
        while (i < n && intervals[i][1] < newInterval[0]) res.add(intervals[i++]);
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
            i++;
        }
        res.add(newInterval);
        while (i < n) res.add(intervals[i++]);
        return res.toArray(new int[0][]);
    }

    public static int eraseOverlapIntervals(int[][] intervals) {
        if (intervals == null || intervals.length == 0) return 0;
        Arrays.sort(intervals, Comparator.comparingInt(a -> a[1]));
        int end = intervals[0][1], removed = 0;
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] < end) removed++;
            else end = intervals[i][1];
        }
        return removed;
    }

    public static void main(String[] args) {
        System.out.println("--- Merge Intervals ---");
        int[][] intervals = {{1, 3}, {2, 6}, {8, 10}, {15, 18}};
        System.out.println("Merged: " + Arrays.deepToString(merge(intervals)));
        int[][] withInsert = {{1, 2}, {3, 5}, {6, 7}, {8, 10}, {12, 16}};
        System.out.println("After insert [4,8]: " + Arrays.deepToString(insert(withInsert, new int[]{4, 8})));
        int[][] overlapping = {{1, 2}, {2, 3}, {3, 4}, {1, 3}};
        System.out.println("Minimum removals: " + eraseOverlapIntervals(overlapping));
    }
}

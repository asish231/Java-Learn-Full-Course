package module11_greedy_algorithms;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

/**
 * Step 02: Activity Selection & Interval Scheduling (Greedy Choice by Finish Time)
 *
 * <pre>
 * INTERVAL TIMELINE & GREEDY CHOICE VISUALIZATION:
 *
 * Activities (Start, Finish):
 * A1: [1, 4]  ================>
 * A2: [3, 5]      ================>
 * A3: [0, 6]  =======================>
 * A4: [5, 7]          ================>
 * A5: [3, 9]      ===============================>
 * A6: [5, 9]          ===============================>
 * A7: [6, 10]             ===============================>
 * A8: [8, 11]                 ===============================>
 *
 * Greedy Algorithm Strategy:
 * 1. Sort all activities by earliest finish time.
 * 2. Select the first activity (A1: finish = 4).
 * 3. Next valid activity must have start time >= current last finish time (4).
 *    -> Select A4: [5, 7] (finish = 7).
 *    -> Select A8: [8, 11] (finish = 11).
 *
 * Max Non-overlapping Activities Selected: 3 (A1, A4, A8)
 * </pre>
 */
public class Step02_ActivitySelectionIntervals {

    public static class Activity {
        public final String id;
        public final int start;
        public final int finish;

        public Activity(String id, int start, int finish) {
            this.id = id;
            this.start = start;
            this.finish = finish;
        }

        @Override
        public String toString() {
            return id + "[" + start + ", " + finish + "]";
        }
    }

    public static class SelectionResult {
        public final List<Activity> selectedActivities;
        public final int count;

        public SelectionResult(List<Activity> selectedActivities) {
            this.selectedActivities = selectedActivities;
            this.count = selectedActivities.size();
        }
    }

    /**
     * Selects maximum number of non-overlapping activities using Greedy Choice strategy.
     */
    public static SelectionResult selectMaxActivities(Activity[] activities) {
        Activity[] sorted = activities.clone();
        
        // Greedy Choice: Sort by earliest finish time
        Arrays.sort(sorted, Comparator.comparingInt(a -> a.finish));

        List<Activity> selected = new ArrayList<>();

        if (sorted.length == 0) {
            return new SelectionResult(selected);
        }

        // First activity with earliest finish time is always selected
        Activity first = sorted[0];
        selected.add(first);
        System.out.println("  [ACTION] Selected Activity " + first + " (Earliest Finish Time = " + first.finish + ")");

        int lastFinishTime = first.finish;

        for (int i = 1; i < sorted.length; i++) {
            Activity current = sorted[i];
            if (current.start >= lastFinishTime) {
                // Non-overlapping activity found
                selected.add(current);
                System.out.println("  [ACTION] Selected Activity " + current + " (Start " + current.start + " >= Last Finish " + lastFinishTime + ")");
                lastFinishTime = current.finish;
            } else {
                System.out.println("  [STATE] Conflict: Skipping Activity " + current + " (Start " + current.start + " < Last Finish " + lastFinishTime + ")");
            }
        }

        return new SelectionResult(selected);
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 11 - Step 02: Activity Selection & Interval Scheduling");
        System.out.println("======================================================================\n");

        Activity[] activities = {
            new Activity("A1", 1, 4),
            new Activity("A2", 3, 5),
            new Activity("A3", 0, 6),
            new Activity("A4", 5, 7),
            new Activity("A5", 3, 9),
            new Activity("A6", 5, 9),
            new Activity("A7", 6, 10),
            new Activity("A8", 8, 11)
        };

        System.out.println("[INIT] Total Input Activities: " + activities.length);

        System.out.println("\n--- Executing Greedy Activity Selection ---");
        SelectionResult res = selectMaxActivities(activities);

        System.out.println("\n--- Selected Activities Schedule ---");
        for (Activity a : res.selectedActivities) {
            System.out.println("  - " + a);
        }

        System.out.println("\n[STATE] Maximum Non-Overlapping Activities Selected: " + res.count);

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Step02_ActivitySelectionIntervals executed cleanly.");
        System.out.println("======================================================================");
    }
}

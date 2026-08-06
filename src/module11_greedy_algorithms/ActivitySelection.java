package module11_greedy_algorithms;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Activity Selection Problem:
 * Select the maximum number of non-overlapping activities.
 * Strategy: Always select the next activity with the earliest finish time.
 * Time Complexity: O(N log N)
 */
public class ActivitySelection {

    public static class Activity {
        public int id;
        public int start;
        public int finish;

        public Activity(int id, int start, int finish) {
            this.id = id;
            this.start = start;
            this.finish = finish;
        }

        @Override
        public String toString() {
            return String.format("A%d[%d..%d]", id, start, finish);
        }
    }

    public static List<Activity> selectMaxActivities(Activity[] activities) {
        // Sort activities based on finish time ascending
        Arrays.sort(activities, (a, b) -> Integer.compare(a.finish, b.finish));

        List<Activity> selected = new ArrayList<>();

        if (activities.length == 0) return selected;

        // First activity always gets selected
        selected.add(activities[0]);
        int lastFinishTime = activities[0].finish;

        for (int i = 1; i < activities.length; i++) {
            if (activities[i].start >= lastFinishTime) {
                selected.add(activities[i]);
                lastFinishTime = activities[i].finish;
            }
        }

        return selected;
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 📅 ACTIVITY SELECTION (GREEDY) DEMONSTRATION");
        System.out.println("==================================================\n");

        Activity[] activities = {
            new Activity(1, 1, 4),
            new Activity(2, 3, 5),
            new Activity(3, 0, 6),
            new Activity(4, 5, 7),
            new Activity(5, 3, 9),
            new Activity(6, 5, 9),
            new Activity(7, 6, 10),
            new Activity(8, 8, 11),
            new Activity(9, 8, 12),
            new Activity(10, 2, 14),
            new Activity(11, 12, 14)
        };

        List<Activity> selected = selectMaxActivities(activities);
        System.out.println("Max Non-overlapping Activities Selected (" + selected.size() + "):");
        System.out.println("  " + selected);

        System.out.println("\n✅ Activity Selection test completed!");
    }
}

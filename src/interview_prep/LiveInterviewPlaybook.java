package interview_prep;

/**
 * What to do in a live coding round. This is the skill the studio cannot fake:
 * talking while you type.
 */
public class LiveInterviewPlaybook {

    public static void main(String[] args) {
        System.out.println("=== Live Interview Playbook ===");
        System.out.println("0:00-2:00  Restate the problem. Ask about duplicates, negatives, empty input, mutability.");
        System.out.println("2:00-5:00  Brute force out loud, then the intended complexity. Wait for a nod.");
        System.out.println("5:00-8:00  Write the function signature and 2 examples as tests.");
        System.out.println("8:00-20:00 Implement. Narrate invariants, not keystrokes.");
        System.out.println("20:00-25:00 Dry-run the failing example. Fix. State time/space.");
        System.out.println();
        System.out.println("If stuck: name the bottleneck, try a hash map / two pointers / sort, then ask for a hint.");
        System.out.println("Never silent-code. Never claim O(n) if you nested a scan.");
        System.out.println("After the round: write a 5-line debrief — what pattern, what miss, what to drill tomorrow.");
    }
}

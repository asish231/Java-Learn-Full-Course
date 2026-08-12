package interview_prep;

/**
 * Behavioral interviews use STAR: Situation, Task, Action, Result.
 * Write five stories before the loop starts. Speak them out loud in 90 seconds.
 */
public class BehavioralSTAR {

    public static void printTemplate(String prompt, String situation, String task, String action, String result) {
        System.out.println("Prompt: " + prompt);
        System.out.println("  S  " + situation);
        System.out.println("  T  " + task);
        System.out.println("  A  " + action);
        System.out.println("  R  " + result);
        System.out.println();
    }

    public static void main(String[] args) {
        System.out.println("=== Behavioral STAR Playbook ===");
        System.out.println("Keep Action as 60% of the story. Name YOUR decisions, not the team's.");
        System.out.println();
        printTemplate(
                "Tell me about a time you owned a hard problem.",
                "Production latency spiked after a release.",
                "Restore p95 under 200ms without a full rollback.",
                "I bisected the deploy, found an N+1 query, added a batch endpoint, and shipped a feature flag.",
                "p95 dropped from 1.4s to 160ms. We kept the release and added a query budget test."
        );
        printTemplate(
                "Tell me about a conflict.",
                "A teammate wanted to rewrite a working module.",
                "Ship the feature this sprint without a rewrite.",
                "I listed risks, proposed extracting one interface, and time-boxed a spike to 4 hours.",
                "We shipped on time. The rewrite became a next-quarter RFC with data."
        );
        printTemplate(
                "Tell me about a failure.",
                "I shipped a cache key that mixed user ids.",
                "Stop leaking data and prevent a repeat.",
                "I disabled the cache, wrote a failing test, rotated keys, and added a key-schema review.",
                "No further incidents. The test is now in CI."
        );
        System.out.println("Homework: replace these with YOUR stories. Record yourself. Cut filler.");
    }
}

package interview_prep;

/**
 * Resume and project bullets that survive a hiring-manager skim.
 * Formula: verb + what you built + constraint + measurable result.
 */
public class ResumeAndProjects {

    public static String bullet(String verb, String what, String constraint, String result) {
        return verb + " " + what + " (" + constraint + ") → " + result;
    }

    public static void main(String[] args) {
        System.out.println("=== Resume & Projects ===");
        System.out.println("Bad:  Worked on backend and improved performance.");
        System.out.println("Good: " + bullet(
                "Cut",
                "p95 checkout latency",
                "N+1 query on 2M daily orders",
                "1.4s to 160ms"
        ));
        System.out.println();
        System.out.println("Project depth checklist:");
        System.out.println("  1. What problem, for whom?");
        System.out.println("  2. What did YOU design (API, schema, cache, auth)?");
        System.out.println("  3. What broke, and how did you measure the fix?");
        System.out.println("  4. What would you change at 10x traffic?");
        System.out.println();
        System.out.println("Keep 3 projects. One DSA studio / judge, one CRUD+auth service, one that has a real user.");
    }
}

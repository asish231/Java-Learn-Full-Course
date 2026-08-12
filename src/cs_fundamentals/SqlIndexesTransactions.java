package cs_fundamentals;

import java.util.ArrayList;
import java.util.List;

/**
 * Indexes, isolation, and why SELECT FOR UPDATE exists.
 * A B-tree index turns a table scan into a tree walk — until you wrap the
 * column in a function and the planner cannot use it.
 */
public class SqlIndexesTransactions {

    static class Row {
        final int id;
        final String email;
        Row(int id, String email) { this.id = id; this.email = email; }
    }

    /** Pretend planner: equality on an indexed column is a seek, not a scan. */
    public static String plan(String sql, boolean emailIndexed) {
        String s = sql.toLowerCase();
        if (s.contains("where email =") && emailIndexed) return "INDEX SEEK on email";
        if (s.contains("where lower(email)") && emailIndexed) return "SEQ SCAN — function hides the index";
        if (s.contains("where email like '%x%'")) return "SEQ SCAN — leading wildcard";
        return "SEQ SCAN";
    }

    public static void main(String[] args) {
        List<Row> users = new ArrayList<>();
        users.add(new Row(1, "a@x.com"));
        users.add(new Row(2, "b@x.com"));
        System.out.println("=== SQL indexes & transactions ===");
        System.out.println("Rows: " + users.size());
        System.out.println(plan("SELECT * FROM users WHERE email = 'a@x.com'", true));
        System.out.println(plan("SELECT * FROM users WHERE LOWER(email) = 'a@x.com'", true));
        System.out.println("READ UNCOMMITTED: dirty reads. READ COMMITTED: no dirty, still non-repeatable.");
        System.out.println("REPEATABLE READ: same snapshot. SERIALIZABLE: as if one-at-a-time.");
        System.out.println("SELECT FOR UPDATE: lock the row you are about to change so two checkouts cannot sell the last seat.");
        System.out.println("Interview: an index is not free — every write updates it. Index the WHERE/JOIN columns you actually use.");
    }
}

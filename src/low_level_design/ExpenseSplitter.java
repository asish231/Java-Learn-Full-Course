package low_level_design;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * LLD: Splitwise-style expense splitter.
 * Store net balances, not every pairwise IOU, then greedy-settle.
 */
public class ExpenseSplitter {

    static class Group {
        final Map<String, Integer> net = new HashMap<>(); // cents owed to the group (negative = owed)

        void expense(String payer, int cents, List<String> among) {
            int share = cents / among.size();
            net.merge(payer, cents, Integer::sum);
            for (String p : among) net.merge(p, -share, Integer::sum);
        }

        List<String> settle() {
            List<String> debtors = new ArrayList<>();
            List<String> creditors = new ArrayList<>();
            for (Map.Entry<String, Integer> e : net.entrySet()) {
                if (e.getValue() < 0) debtors.add(e.getKey());
                if (e.getValue() > 0) creditors.add(e.getKey());
            }
            List<String> out = new ArrayList<>();
            int i = 0, j = 0;
            while (i < debtors.size() && j < creditors.size()) {
                String d = debtors.get(i), c = creditors.get(j);
                int owe = -net.get(d), due = net.get(c);
                int pay = Math.min(owe, due);
                out.add(d + " pays " + c + " " + pay);
                net.put(d, net.get(d) + pay);
                net.put(c, net.get(c) - pay);
                if (net.get(d) == 0) i++;
                if (net.get(c) == 0) j++;
            }
            return out;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== LLD: Expense splitter ===");
        Group g = new Group();
        List<String> all = List.of("A", "B", "C");
        g.expense("A", 3000, all);
        g.expense("B", 1500, all);
        System.out.println("Net cents: " + g.net);
        System.out.println("Settle: " + g.settle());
        System.out.println("Talk: one net per person, then match largest debtor to largest creditor. Avoid O(n^2) IOUs.");
    }
}

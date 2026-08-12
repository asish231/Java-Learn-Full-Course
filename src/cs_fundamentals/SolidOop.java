package cs_fundamentals;

/**
 * SOLID as decisions, not a poster. One example each, then when to stop.
 */
public class SolidOop {

    interface Notifier { void send(String to, String body); }

    static class EmailNotifier implements Notifier {
        public void send(String to, String body) {
            System.out.println("email -> " + to + ": " + body);
        }
    }

    static class OrderService {
        private final Notifier notifier;
        OrderService(Notifier notifier) { this.notifier = notifier; }
        void place(String user, int cents) {
            System.out.println("charged " + cents + " cents");
            notifier.send(user, "order confirmed");
        }
    }

    public static void main(String[] args) {
        System.out.println("=== SOLID (with a brake pedal) ===");
        System.out.println("S: OrderService charges; EmailNotifier sends. Two reasons to change → two types.");
        System.out.println("O: add SlackNotifier without editing OrderService.");
        System.out.println("L: any Notifier must actually send; a no-op fake is for tests, not production.");
        System.out.println("I: Notifier has one method. Do not force SMS + push + fax on every implementor.");
        System.out.println("D: OrderService depends on the interface, not EmailNotifier.");
        new OrderService(new EmailNotifier()).place("dev@local", 499);
        System.out.println("Stop: do not split a 40-line class into eight files to look senior.");
    }
}

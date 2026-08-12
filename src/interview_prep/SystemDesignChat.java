package interview_prep;

/**
 * System design: 1:1 and group chat.
 * Delivery, ordering, unread, and what "online" actually means.
 */
public class SystemDesignChat {

    public static String storeMessage(boolean group) {
        return group
                ? "messages(conversation_id, seq, sender, body, ts) — seq is per conversation"
                : "messages(thread_id, seq, sender, body, ts) plus a user_inbox pointer";
    }

    public static void main(String[] args) {
        System.out.println("=== System Design: Chat ===");
        System.out.println("1. API: WS /gateway for live; REST for history. ACK every event.");
        System.out.println("2. 1:1 store: " + storeMessage(false));
        System.out.println("3. Group store: " + storeMessage(true));
        System.out.println("4. Online: presence in Redis with a heartbeat TTL. Do not treat TCP as truth.");
        System.out.println("5. Order: per-conversation monotonic seq. Client retries with an idempotency key.");
        System.out.println("6. Unread: last_read_seq per user per conversation, not a row per message.");
        System.out.println("Fan-out group messages through a queue so one slow device does not stall the room.");
    }
}

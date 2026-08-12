package interview_prep;

/**
 * System design: news feed (Twitter / Instagram home).
 * Fan-out on write vs fan-out on read is the decision they want.
 */
public class SystemDesignNewsFeed {

    public static String fanout(int followers) {
        if (followers > 1_000_000) return "fan-out on read for celebrities; write would melt the graph";
        return "fan-out on write: push the post id onto each follower's timeline cache";
    }

    public static void main(String[] args) {
        System.out.println("=== System Design: News Feed ===");
        System.out.println("1. API: POST /posts; GET /feed?cursor=  (cursor, not offset).");
        System.out.println("2. Data: posts(id, author, text, ts); follows(follower, followee); timeline cache per user.");
        System.out.println("3. Normal user: " + fanout(200));
        System.out.println("4. Celebrity: " + fanout(5_000_000));
        System.out.println("5. Rank: recency + graph + a lightweight scorer. Keep ranking out of the write path.");
        System.out.println("6. Scale: shard timelines by user id; CDN media; async fan-out workers.");
        System.out.println("Say the bottleneck: the follow graph, not the tweet text.");
    }
}

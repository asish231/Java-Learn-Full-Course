package interview_prep;

/**
 * System design walkthrough: URL shortener.
 * Interview shape: requirements → API → data model → scale → trade-offs.
 */
public class SystemDesignUrlShortener {

    public static String encodeBase62(long id) {
        final String alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (id == 0) return "0";
        StringBuilder sb = new StringBuilder();
        while (id > 0) {
            sb.append(alphabet.charAt((int) (id % 62)));
            id /= 62;
        }
        return sb.reverse().toString();
    }

    public static void main(String[] args) {
        System.out.println("=== System Design: URL Shortener ===");
        System.out.println("1. Requirements: create short URL, redirect, optional expiry, 100M writes/day.");
        System.out.println("2. API: POST /v1/links {longUrl} -> {code}; GET /{code} -> 302 Location.");
        System.out.println("3. Data: links(code PK, long_url, created_at, expires_at). Cache hot codes in Redis.");
        System.out.println("4. ID: Snowflake or DB sequence, then base62. Example 125 -> " + encodeBase62(125));
        System.out.println("5. Scale: hash the code to shards; CDN for redirects; 301 vs 302 trade-off.");
        System.out.println("6. Risks: collisions, abuse/spam, deleted destinations, analytics lag.");
        System.out.println("Say the bottleneck out loud: redirects are read-heavy, so cache before you shard.");
    }
}

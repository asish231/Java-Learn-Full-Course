package cs_fundamentals;

/**
 * DNS → TCP handshake → TLS → HTTP. Status codes you must say out loud.
 */
public class TcpHttpDns {

    public static String statusMeaning(int code) {
        if (code == 200) return "OK";
        if (code == 301) return "permanent redirect — cache it, change the bookmark";
        if (code == 302) return "temporary redirect — do not cache as the new URL";
        if (code == 304) return "not modified — use the cached body";
        if (code == 400) return "client sent a bad request";
        if (code == 401) return "unauthenticated";
        if (code == 403) return "authenticated but not allowed";
        if (code == 404) return "no such resource";
        if (code == 429) return "rate limited — honor Retry-After";
        if (code == 500) return "server bug";
        if (code == 502) return "bad gateway — upstream died";
        if (code == 503) return "overloaded or down for maintenance";
        return "look it up, then say what the client should do";
    }

    public static void main(String[] args) {
        System.out.println("=== TCP / HTTP / DNS ===");
        System.out.println("1. DNS: hostname -> IP (UDP 53, then TCP if truncated).");
        System.out.println("2. TCP: SYN, SYN-ACK, ACK. Then TLS 1.2/1.3 handshake.");
        System.out.println("3. HTTP: method + path + headers + optional body.");
        System.out.println("4. Timeouts live at every hop: client, load balancer, app, DB.");
        System.out.println("301: " + statusMeaning(301));
        System.out.println("302: " + statusMeaning(302));
        System.out.println("429: " + statusMeaning(429));
        System.out.println("HTTP/2 multiplexes streams on one TCP connection so one slow response does not block others.");
    }
}

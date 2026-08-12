package backend_engineering;

import java.util.*;

/**
 * 02. RESTful API Router & Controller pipeline.
 * Demonstrates HTTP route dispatching, URL path parameters (/users/:id),
 * and a middleware pipeline (Logging -> Auth -> Handler).
 */
public class RESTAPIRouter {

    @FunctionalInterface
    public interface Handler {
        String handle(Map<String, String> params, String body);
    }

    @FunctionalInterface
    public interface Middleware {
        boolean process(String method, String path, Map<String, String> headers);
    }

    public static class Router {
        private final Map<String, Handler> routes = new HashMap<>();
        private final List<Middleware> middlewares = new ArrayList<>();

        public void use(Middleware mw) {
            middlewares.add(mw);
        }

        public void get(String path, Handler handler) {
            routes.put("GET:" + path, handler);
        }

        public void post(String path, Handler handler) {
            routes.put("POST:" + path, handler);
        }

        public String dispatch(String method, String path, Map<String, String> headers, String body) {
            System.out.println("\n------------------------------------------------");
            System.out.println("[Request Pipeline] Executing " + method + " " + path);

            for (int i = 0; i < middlewares.size(); i++) {
                boolean passed = middlewares.get(i).process(method, path, headers);
                if (!passed) {
                    return "HTTP 401 Unauthorized: Middleware rejected request at step " + (i + 1);
                }
            }

            Match match = findRoute(method, path);
            if (match == null) {
                return "HTTP 404 Not Found: No route matching " + method + " " + path;
            }
            return "HTTP 200 OK: " + match.handler.handle(match.params, body);
        }

        private Match findRoute(String method, String path) {
            String prefix = method + ":";
            for (Map.Entry<String, Handler> entry : routes.entrySet()) {
                if (!entry.getKey().startsWith(prefix)) continue;
                String pattern = entry.getKey().substring(prefix.length());
                Map<String, String> params = matchPath(pattern, path);
                if (params != null) return new Match(entry.getValue(), params);
            }
            return null;
        }

        static Map<String, String> matchPath(String pattern, String path) {
            String[] pSeg = pattern.split("/");
            String[] aSeg = path.split("/");
            if (pSeg.length != aSeg.length) return null;
            Map<String, String> params = new HashMap<>();
            for (int i = 0; i < pSeg.length; i++) {
                if (pSeg[i].startsWith(":") && pSeg[i].length() > 1) {
                    params.put(pSeg[i].substring(1), aSeg[i]);
                } else if (!pSeg[i].equals(aSeg[i])) {
                    return null;
                }
            }
            return params;
        }

        private static class Match {
            final Handler handler;
            final Map<String, String> params;
            Match(Handler handler, Map<String, String> params) {
                this.handler = handler;
                this.params = params;
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("=== 🛣️ 02. RESTful API Router & Middleware Pipeline ===");

        Router app = new Router();

        // Register Middleware 1: Logger
        app.use((method, path, headers) -> {
            System.out.println("  [MW Logger] " + method + " " + path + " | IP: 127.0.0.1");
            return true;
        });

        // Register Middleware 2: Authorization Header Verification
        app.use((method, path, headers) -> {
            String token = headers.get("Authorization");
            if (path.startsWith("/api/public")) return true; // Public route
            boolean authorized = token != null && token.equals("Bearer secret_jwt_token");
            System.out.println("  [MW Auth] Token present: " + (token != null) + " | Authorized: " + authorized);
            return authorized;
        });

        // Register Controller Routes
        app.get("/api/public/status", (params, body) -> "{\"status\":\"healthy\",\"uptime\":3600}");
        app.get("/api/v1/users", (params, body) -> "[{\"id\":1,\"name\":\"Alice\"},{\"id\":2,\"name\":\"Bob\"}]");
        app.get("/api/v1/users/:id", (params, body) -> "{\"id\":" + params.get("id") + ",\"name\":\"Alice\"}");
        app.post("/api/v1/users", (params, body) -> "{\"id\":3,\"message\":\"User created from payload: " + body + "\"}");

        // Test 1: Public route access
        Map<String, String> noAuthHeaders = new HashMap<>();
        String r1 = app.dispatch("GET", "/api/public/status", noAuthHeaders, "");
        System.out.println("Response: " + r1);

        // Test 2: Protected route without Auth token (Should fail with 401)
        String r2 = app.dispatch("GET", "/api/v1/users", noAuthHeaders, "");
        System.out.println("Response: " + r2);

        // Test 3: Protected route WITH valid Auth token
        Map<String, String> authHeaders = new HashMap<>();
        authHeaders.put("Authorization", "Bearer secret_jwt_token");
        String r3 = app.dispatch("GET", "/api/v1/users", authHeaders, "");
        System.out.println("Response: " + r3);

        String r4 = app.dispatch("GET", "/api/v1/users/42", authHeaders, "");
        System.out.println("Path-param response: " + r4);
    }
}

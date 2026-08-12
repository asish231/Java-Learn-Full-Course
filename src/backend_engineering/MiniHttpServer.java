package backend_engineering;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

/**
 * A tiny HTTP server using ServerSocket.
 *
 * In the studio sandbox, binding a port is blocked — the same handler still
 * runs against in-process requests so the lesson is runnable either way.
 */
public class MiniHttpServer {

    public static String handle(String method, String path) {
        if ("GET".equals(method) && "/health".equals(path)) {
            return json(200, "OK", "{\"status\":\"ok\"}");
        }
        if ("GET".equals(method) && path.startsWith("/echo/")) {
            String msg = path.substring("/echo/".length());
            return json(200, "OK", "{\"echo\":\"" + msg + "\"}");
        }
        return json(404, "Not Found", "{\"error\":\"not found\"}");
    }

    private static String json(int code, String text, String body) {
        return "HTTP/1.1 " + code + " " + text + "\r\n"
                + "Content-Type: application/json\r\n"
                + "Content-Length: " + body.getBytes(StandardCharsets.UTF_8).length + "\r\n"
                + "Connection: close\r\n\r\n"
                + body;
    }

    private static String readRequestLine(Socket socket) throws Exception {
        BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
        return in.readLine();
    }

    public static void serveOnce(int port) throws Exception {
        try (ServerSocket server = new ServerSocket(port, 1, InetAddress.getByName("127.0.0.1"))) {
            server.setSoTimeout(2000);
            try (Socket client = server.accept()) {
                String line = readRequestLine(client);
                String method = "GET", path = "/";
                if (line != null) {
                    String[] parts = line.split(" ");
                    if (parts.length >= 2) { method = parts[0]; path = parts[1]; }
                }
                byte[] response = handle(method, path).getBytes(StandardCharsets.UTF_8);
                OutputStream out = client.getOutputStream();
                out.write(response);
                out.flush();
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Mini HTTP Server (ServerSocket) ===");
        System.out.println("[in-process] GET /health ->\n" + handle("GET", "/health"));
        System.out.println("[in-process] GET /echo/hi ->\n" + handle("GET", "/echo/hi"));
        try {
            serveOnce(0);
            System.out.println("Bound a loopback socket and served one request.");
        } catch (Exception e) {
            System.out.println("Socket bind skipped (" + e.getClass().getSimpleName() + "): this is expected inside the studio sandbox.");
        }
    }
}

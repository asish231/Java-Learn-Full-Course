package backend_engineering;

import java.io.*;
import java.net.*;
import java.util.*;

/**
 * 01. Client-Server Architecture & HTTP message parsing.
 * Demonstrates HTTP Request/Response structure and message formatting using a hard-coded
 * request string. It does not open a server socket; the goal is to learn the wire format
 * before building a real server.
 */
public class HTTPClientServer {

    public static class HTTPRequest {
        public String method;
        public String path;
        public String version;
        public Map<String, String> headers = new HashMap<>();
        public String body = "";

        @Override
        public String toString() {
            return String.format("HTTPRequest [Method=%s, Path=%s, Headers=%d, BodyLength=%d]",
                    method, path, headers.size(), body.length());
        }
    }

    public static class HTTPResponse {
        public int statusCode;
        public String statusText;
        public Map<String, String> headers = new HashMap<>();
        public String body;

        public HTTPResponse(int statusCode, String statusText, String body) {
            this.statusCode = statusCode;
            this.statusText = statusText;
            this.body = body;
            headers.put("Content-Type", "application/json");
            headers.put("Content-Length", String.valueOf(body.length()));
            headers.put("Server", "CustomJavaBackend/1.0");
        }

        public String toRawString() {
            StringBuilder sb = new StringBuilder();
            sb.append("HTTP/1.1 ").append(statusCode).append(" ").append(statusText).append("\r\n");
            for (Map.Entry<String, String> h : headers.entrySet()) {
                sb.append(h.getKey()).append(": ").append(h.getValue()).append("\r\n");
            }
            sb.append("\r\n");
            sb.append(body);
            return sb.toString();
        }
    }

    public static HTTPRequest parseRawRequest(String raw) {
        HTTPRequest req = new HTTPRequest();
        String[] lines = raw.split("\r\n");
        if (lines.length == 0) return req;

        // Parse Request Line (e.g. "GET /api/v1/health HTTP/1.1")
        String[] requestLine = lines[0].split(" ");
        if (requestLine.length >= 3) {
            req.method = requestLine[0];
            req.path = requestLine[1];
            req.version = requestLine[2];
        }

        // Parse Headers
        int i = 1;
        while (i < lines.length && !lines[i].isEmpty()) {
            int colonIdx = lines[i].indexOf(":");
            if (colonIdx != -1) {
                String key = lines[i].substring(0, colonIdx).trim();
                String val = lines[i].substring(colonIdx + 1).trim();
                req.headers.put(key, val);
            }
            i++;
        }

        // Parse Body
        StringBuilder bodySb = new StringBuilder();
        i++; // Skip empty CRLF line
        while (i < lines.length) {
            bodySb.append(lines[i]).append("\n");
            i++;
        }
        req.body = bodySb.toString().trim();
        return req;
    }

    public static void main(String[] args) {
        System.out.println("=== 🌐 01. HTTP Client-Server Architecture ===");
        
        String sampleRawRequest = 
                "POST /api/v1/users HTTP/1.1\r\n" +
                "Host: localhost:3000\r\n" +
                "User-Agent: Mozilla/5.0\r\n" +
                "Content-Type: application/json\r\n" +
                "\r\n" +
                "{\"name\": \"Alice\", \"role\": \"Backend Engineer\"}";

        System.out.println("\n[1] Parsing Incoming HTTP Request...");
        HTTPRequest req = parseRawRequest(sampleRawRequest);
        System.out.println("Parsed Request: " + req);
        System.out.println("HTTP Method: " + req.method);
        System.out.println("Request Path: " + req.path);
        System.out.println("Header User-Agent: " + req.headers.get("User-Agent"));
        System.out.println("Payload Body: " + req.body);

        System.out.println("\n[2] Generating HTTP 201 Created Response...");
        HTTPResponse res = new HTTPResponse(201, "Created", "{\"status\":\"success\",\"message\":\"User created successfully\",\"id\":101}");
        System.out.println("\nRaw Transmitted Response:");
        System.out.println(res.toRawString());
    }
}

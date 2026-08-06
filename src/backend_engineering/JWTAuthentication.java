package backend_engineering;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;

/**
 * 04. Authentication & Security Engine simulator.
 * Demonstrates Password Hashing with Salt (SHA-256 / BCrypt concept) and JSON Web Token (JWT) Generation & Verification.
 */
public class JWTAuthentication {

    // Simple SHA-256 Password Hasher with Salt
    public static String hashPassword(String password, String salt) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest((password + salt).getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Hashing failed: " + e.getMessage());
        }
    }

    // JWT Token Generator (Header.Payload.Signature)
    public static class JWT {
        private static final String SECRET_KEY = "SuperSecretBackendKey!2026";

        public static String generateToken(int userId, String role, long ttlMs) {
            String header = Base64.getUrlEncoder().withoutPadding().encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes(StandardCharsets.UTF_8));
            long exp = System.currentTimeMillis() + ttlMs;
            String payloadJson = String.format("{\"userId\":%d,\"role\":\"%s\",\"exp\":%d}", userId, role, exp);
            String payload = Base64.getUrlEncoder().withoutPadding().encodeToString(payloadJson.getBytes(StandardCharsets.UTF_8));

            String signature = hashPassword(header + "." + payload, SECRET_KEY).substring(0, 32);
            return header + "." + payload + "." + signature;
        }

        public static boolean verifyToken(String token) {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return false;

            String header = parts[0];
            String payload = parts[1];
            String signature = parts[2];

            String expectedSig = hashPassword(header + "." + payload, SECRET_KEY).substring(0, 32);
            if (!expectedSig.equals(signature)) {
                System.out.println("❌ JWT Token Tampered! Signature mismatch.");
                return false;
            }

            // Check Expiration
            String payloadJson = new String(Base64.getUrlDecoder().decode(payload), StandardCharsets.UTF_8);
            System.out.println("Verified JWT Payload Claims: " + payloadJson);
            return true;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== 🔐 04. Authentication, Password Hashing & JWT Security ===");

        // 1. Password Hashing
        String salt = UUID.randomUUID().toString().substring(0, 8);
        String rawPassword = "mySecretPassword123";
        String hashedPassword = hashPassword(rawPassword, salt);

        System.out.println("\n[1] Password Hashing & Salting:");
        System.out.println("Raw Password: " + rawPassword);
        System.out.println("Random Salt: " + salt);
        System.out.println("Stored Hash (SHA-256): " + hashedPassword);

        // 2. JWT Generation
        System.out.println("\n[2] Generating Signed JWT Token:");
        String jwtToken = JWT.generateToken(42, "admin", 3600000); // 1 hour TTL
        System.out.println("Generated JWT Token: " + jwtToken);

        // 3. JWT Verification
        System.out.println("\n[3] Verifying Legitimate JWT Token:");
        boolean isValid = JWT.verifyToken(jwtToken);
        System.out.println("Token Valid: " + isValid);

        // 4. Tamper Test
        System.out.println("\n[4] Security Test: Tampering with JWT Token payload...");
        String tamperedToken = jwtToken.replace("admin", "superadmin");
        boolean isTamperedValid = JWT.verifyToken(tamperedToken);
        System.out.println("Tampered Token Valid: " + isTamperedValid);
    }
}

package backend_engineering;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.UUID;

/**
 * 04. Authentication & Security Engine simulator.
 * Demonstrates password hashing with salt and a real JWT-style token using HMAC-SHA256.
 *
 * IMPORTANT: This is a learning model. The ideas (salted hashing, signed tokens, and
 * expiration checks) are the same ones used in production. The JWT below uses HS256
 * for the algorithm header so the structure is real, but production services use a
 * JWT library and rotate the secret key.
 */
public class JWTAuthentication {

    private static final String SECRET_KEY = "SuperSecretBackendKey!2026";

    public static String hashPassword(String password, String salt) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest((password + salt).getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                String byteHex = Integer.toHexString(0xff & b);
                if (byteHex.length() == 1) hex.append('0');
                hex.append(byteHex);
            }
            return hex.toString();
        } catch (Exception e) {
            throw new RuntimeException("Hashing failed: " + e.getMessage());
        }
    }

    private static String hmacSha256(String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec key = new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(key);
            byte[] bytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        } catch (Exception e) {
            throw new RuntimeException("HMAC failed: " + e.getMessage());
        }
    }

    public static class JWT {

        public static String generateToken(int userId, String role, long ttlMs) {
            String header = Base64.getUrlEncoder().withoutPadding()
                    .encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes(StandardCharsets.UTF_8));
            long exp = System.currentTimeMillis() + ttlMs;
            String payloadJson = String.format("{\"userId\":%d,\"role\":\"%s\",\"exp\":%d}", userId, role, exp);
            String payload = Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(payloadJson.getBytes(StandardCharsets.UTF_8));
            String signature = hmacSha256(header + "." + payload);
            return header + "." + payload + "." + signature;
        }

        public static boolean verifyToken(String token) {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                System.out.println("Invalid token format.");
                return false;
            }

            String header = parts[0];
            String payload = parts[1];
            String signature = parts[2];

            String expected = hmacSha256(header + "." + payload);
            if (!expected.equals(signature)) {
                System.out.println("Signature mismatch: token has been tampered with.");
                return false;
            }

            String payloadJson = new String(Base64.getUrlDecoder().decode(payload), StandardCharsets.UTF_8);
            long exp = extractLong(payloadJson, "exp");
            if (exp > 0 && System.currentTimeMillis() > exp) {
                System.out.println("Token expired at " + exp);
                return false;
            }

            System.out.println("Verified JWT payload: " + payloadJson);
            return true;
        }

        private static long extractLong(String json, String key) {
            String needle = "\"" + key + "\":";
            int start = json.indexOf(needle);
            if (start < 0) return -1;
            int valueStart = start + needle.length();
            int end = json.indexOf(',', valueStart);
            if (end < 0) end = json.indexOf('}', valueStart);
            if (end < 0) return -1;
            try {
                return Long.parseLong(json.substring(valueStart, end).trim());
            } catch (NumberFormatException e) {
                return -1;
            }
        }
    }

    public static String tamperWithRole(String token, String newRole) {
        String[] parts = token.split("\\.");
        String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
        String tamperedPayloadJson = payloadJson.replaceAll("\"role\":\"[^\"]*\"", "\"role\":\"" + newRole + "\"");
        String tamperedPayload = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(tamperedPayloadJson.getBytes(StandardCharsets.UTF_8));
        return parts[0] + "." + tamperedPayload + "." + parts[2];
    }

    public static String createExpiredToken(int userId, String role) {
        return JWT.generateToken(userId, role, -1000);
    }

    public static void main(String[] args) {
        System.out.println("=== Authentication, Password Hashing & JWT Security ===");

        String salt = UUID.randomUUID().toString().substring(0, 8);
        String rawPassword = "mySecretPassword123";
        String hashed = hashPassword(rawPassword, salt);
        System.out.println("\n[1] Password Hashing & Salting:");
        System.out.println("Raw password: " + rawPassword);
        System.out.println("Salt: " + salt);
        System.out.println("Stored hash (SHA-256): " + hashed);

        String token = JWT.generateToken(42, "admin", 3600000);
        System.out.println("\n[2] Signed JWT (HS256):");
        System.out.println(token);

        System.out.println("\n[3] Verifying legitimate token:");
        System.out.println("Valid: " + JWT.verifyToken(token));

        System.out.println("\n[4] Tampering with the role (admin -> superadmin):");
        String tampered = tamperWithRole(token, "superadmin");
        System.out.println("Tampered token: " + tampered);
        System.out.println("Tampered token valid: " + JWT.verifyToken(tampered));

        System.out.println("\n[5] Expired token check:");
        String expired = createExpiredToken(42, "admin");
        System.out.println("Expired token valid: " + JWT.verifyToken(expired));

        System.out.println("\n[6] Broken signature check:");
        String broken = token.substring(0, token.length() - 1) + "X";
        System.out.println("Broken signature token valid: " + JWT.verifyToken(broken));
    }
}

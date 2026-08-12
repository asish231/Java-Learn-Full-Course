package module01_foundations;

/**
 * Number theory that shows up in coding interviews.
 *
 * Topics: GCD / Euclid, LCM, sieve of Eratosthenes, modular fast exponentiation,
 * and integer overflow awareness.
 */
public class NumberTheory {

    public static int gcd(int a, int b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b != 0) {
            int t = a % b;
            a = b;
            b = t;
        }
        return a;
    }

    public static int lcm(int a, int b) {
        if (a == 0 || b == 0) return 0;
        return Math.abs(a / gcd(a, b) * b);
    }

    public static boolean[] sieve(int n) {
        boolean[] prime = new boolean[n + 1];
        if (n >= 2) java.util.Arrays.fill(prime, true);
        if (n >= 0) prime[0] = false;
        if (n >= 1) prime[1] = false;
        for (int p = 2; p * p <= n; p++) {
            if (!prime[p]) continue;
            for (int m = p * p; m <= n; m += p) prime[m] = false;
        }
        return prime;
    }

    public static long modPow(long base, long exp, long mod) {
        long result = 1 % mod;
        base %= mod;
        while (exp > 0) {
            if ((exp & 1) == 1) result = (result * base) % mod;
            base = (base * base) % mod;
            exp >>= 1;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println("--- Number Theory ---");
        System.out.println("gcd(48, 18) = " + gcd(48, 18) + ", lcm(12, 18) = " + lcm(12, 18));
        boolean[] primes = sieve(20);
        StringBuilder sb = new StringBuilder("Primes <= 20: ");
        for (int i = 0; i < primes.length; i++) if (primes[i]) sb.append(i).append(' ');
        System.out.println(sb);
        System.out.println("2^10 mod 1000 = " + modPow(2, 10, 1000));
    }
}

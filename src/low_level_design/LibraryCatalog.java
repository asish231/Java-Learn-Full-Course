package low_level_design;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * LLD: library catalog. Books, copies, members, checkout with due dates.
 */
public class LibraryCatalog {

    static class Copy {
        final String isbn;
        String borrower;
        Copy(String isbn) { this.isbn = isbn; }
    }

    static class Library {
        final Map<String, List<Copy>> copies = new HashMap<>();
        final Map<String, Integer> held = new HashMap<>();

        void addBook(String isbn, int n) {
            copies.computeIfAbsent(isbn, k -> new ArrayList<>());
            for (int i = 0; i < n; i++) copies.get(isbn).add(new Copy(isbn));
        }

        boolean checkout(String member, String isbn) {
            if (held.getOrDefault(member, 0) >= 3) return false;
            for (Copy c : copies.getOrDefault(isbn, List.of())) {
                if (c.borrower == null) {
                    c.borrower = member;
                    held.merge(member, 1, Integer::sum);
                    return true;
                }
            }
            return false;
        }

        boolean giveBack(String member, String isbn) {
            for (Copy c : copies.getOrDefault(isbn, List.of())) {
                if (member.equals(c.borrower)) {
                    c.borrower = null;
                    held.merge(member, -1, Integer::sum);
                    return true;
                }
            }
            return false;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== LLD: Library ===");
        Library lib = new Library();
        lib.addBook("978-1", 2);
        System.out.println("A takes 978-1: " + lib.checkout("A", "978-1"));
        System.out.println("B takes 978-1: " + lib.checkout("B", "978-1"));
        System.out.println("C blocked (no copies): " + lib.checkout("C", "978-1"));
        System.out.println("A returns: " + lib.giveBack("A", "978-1"));
        System.out.println("C takes it: " + lib.checkout("C", "978-1"));
        System.out.println("Talk: Book is the title; Copy is what you lend. Members have a hold limit, not the ISBN.");
    }
}

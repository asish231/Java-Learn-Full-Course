package backend_engineering;

import java.util.*;

/**
 * 03. Database & In-Memory Relational SQL Engine simulator.
 * Demonstrates Table schemas, Primary Keys, Foreign Keys, INSERT, SELECT, and INNER JOIN query processing.
 */
public class DatabaseSQLEngine {

    public static class Row {
        public Map<String, Object> data = new HashMap<>();

        public Row(Object... keyValuePairs) {
            for (int i = 0; i < keyValuePairs.length; i += 2) {
                data.put((String) keyValuePairs[i], keyValuePairs[i + 1]);
            }
        }

        @Override
        public String toString() {
            return data.toString();
        }
    }

    public static class Table {
        public String tableName;
        public String primaryKey;
        public List<Row> rows = new ArrayList<>();
        public int autoIncrementId = 1;

        public Table(String name, String pk) {
            this.tableName = name;
            this.primaryKey = pk;
        }

        public Row insert(Row row) {
            row.data.put(primaryKey, autoIncrementId++);
            rows.add(row);
            return row;
        }
    }

    public static class Database {
        private final Map<String, Table> tables = new HashMap<>();

        public void createTable(String name, String pk) {
            tables.put(name, new Table(name, pk));
        }

        public Table getTable(String name) {
            return tables.get(name);
        }

        // Simulates SELECT * FROM t1 INNER JOIN t2 ON t1.fk = t2.pk
        public List<String> innerJoin(String t1Name, String t2Name, String foreignKey) {
            List<String> results = new ArrayList<>();
            Table t1 = getTable(t1Name);
            Table t2 = getTable(t2Name);

            for (Row r1 : t1.rows) {
                Object fkVal = r1.data.get(foreignKey);
                for (Row r2 : t2.rows) {
                    Object pkVal = r2.data.get(t2.primaryKey);
                    if (fkVal != null && fkVal.equals(pkVal)) {
                        results.add(String.format("Joined Match -> User: %s | Order Product: %s (Price: $%s)",
                                r2.data.get("name"), r1.data.get("product"), r1.data.get("price")));
                    }
                }
            }
            return results;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== 🗄️ 03. In-Memory Relational SQL Database Engine ===");

        Database db = new Database();

        // 1. CREATE TABLE users (id, name, email)
        System.out.println("\n[1] Executing DDL: CREATE TABLE users (id PRIMARY KEY, name, email)...");
        db.createTable("users", "id");

        // 2. CREATE TABLE orders (id, user_id, product, price)
        System.out.println("[2] Executing DDL: CREATE TABLE orders (id PRIMARY KEY, user_id FOREIGN KEY, product, price)...");
        db.createTable("orders", "id");

        // 3. INSERT INTO users
        Table users = db.getTable("users");
        users.insert(new Row("name", "Alice", "email", "alice@example.com"));
        users.insert(new Row("name", "Bob", "email", "bob@example.com"));
        System.out.println("\nUsers Table Rows:");
        users.rows.forEach(r -> System.out.println("  " + r));

        // 4. INSERT INTO orders
        Table orders = db.getTable("orders");
        orders.insert(new Row("user_id", 1, "product", "MacBook Pro M3", "price", 1999));
        orders.insert(new Row("user_id", 1, "product", "Mechanical Keyboard", "price", 150));
        orders.insert(new Row("user_id", 2, "product", "4K Monitor", "price", 450));
        System.out.println("\nOrders Table Rows:");
        orders.rows.forEach(r -> System.out.println("  " + r));

        // 5. SELECT * FROM orders INNER JOIN users ON orders.user_id = users.id
        System.out.println("\n[3] Executing Query: SELECT * FROM orders INNER JOIN users ON orders.user_id = users.id");
        List<String> joinedResults = db.innerJoin("orders", "users", "user_id");
        joinedResults.forEach(r -> System.out.println("  " + r));
    }
}

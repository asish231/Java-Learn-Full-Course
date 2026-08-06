# 🌐 Backend Engineering Master Curriculum (Zero-to-Hero Guide)

Welcome to the **Complete Backend Engineering Master Curriculum**! This guide assumes zero prior knowledge of backend servers and takes you step-by-step from client-server architecture to production-grade REST APIs, SQL databases, JWT authentication, Redis caching, and microservice message queues.

---

## 🗺️ Backend Engineering Curriculum Roadmap

```text
+---------------------------------------------------------------------------------------------------+
| BACKEND ENGINEERING CURRICULUM ROADMAP                                                            |
+---------------------------------------------------------------------------------------------------+
| 01. Client-Server Architecture & HTTP Basics    (Web protocols, Request/Response, Status Codes) |
| 02. RESTful API Design & Routing               (Routes, Middleware, Controllers, Error Handling)  |
| 03. Databases & SQL Mastery                    (Tables, Foreign Keys, JOINs, Indexes, ACID)       |
| 04. Authentication & Security (JWT & BCrypt)   (Sessions, JWT Tokens, Password Hashing, OWASP)   |
| 05. Caching & Performance Optimization         (Redis, Cache-Aside, LRU Eviction, TTL)            |
| 06. Message Queues & System Design Basics      (Async queues, Worker Threads, Microservices)      |
+---------------------------------------------------------------------------------------------------+
```

---

## 1. Client-Server Architecture & HTTP Basics

### What is Backend Engineering?
The **frontend** (browser, mobile app) is what users see and interact with. The **backend** is the engine running on remote servers that processes requests, enforces business rules, performs database lookups, and secures user data.

### The Request-Response Lifecycle
1. **Client** sends an **HTTP Request** over the network (IP Address & Port).
2. **Server** listens on a socket port (e.g., port 80 for HTTP, 443 for HTTPS, 3000/8080 for web apps).
3. **Server** processes request parameters, queries the database, and returns an **HTTP Response**.

### HTTP Methods (Verbs)
- `GET`: Retrieve data from server (safe, read-only).
- `POST`: Create a new resource on the server.
- `PUT`: Replace an existing resource completely.
- `PATCH`: Update specific fields of an existing resource.
- `DELETE`: Remove a resource from the server.

### HTTP Response Status Codes
- **2xx Success**: `200 OK`, `201 Created`, `204 No Content`
- **3xx Redirection**: `301 Moved Permanently`, `304 Not Modified`
- **4xx Client Errors**: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`
- **5xx Server Errors**: `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`

---

## 2. RESTful API Design & Controllers

### REST (Representational State Transfer) Rules
1. **Resource-based URLs**: Use nouns, not verbs (`/api/v1/users`, NOT `/api/v1/getUsers`).
2. **Stateless Communication**: Every HTTP request must contain all credentials & context required to process it.
3. **JSON Format**: Use standard JSON (`{"status": "success", "data": ...}`) for request and response payloads.

### Middleware Pipeline Pattern
Middleware functions execute sequentially before reaching the final request handler:
`Client Request -> Logging Middleware -> Auth Middleware -> Rate Limiter -> Controller Handler -> Response`

---

## 3. Databases & SQL Mastery

### Relational (SQL) vs NoSQL
- **SQL (PostgreSQL, MySQL, SQLite)**: Structured tables with fixed schemas, primary keys, foreign key relationships, and strict ACID transaction compliance.
- **NoSQL (MongoDB, Redis, Cassandra)**: Flexible document stores or key-value caches optimized for horizontal scaling and rapid schema iterations.

### Core SQL Operations & JOINs
```sql
-- Create Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- INNER JOIN Query
SELECT u.name, o.total_amount 
FROM users u 
INNER JOIN orders o ON u.id = o.user_id;
```

---

## 4. Authentication, Authorization & Security

### Authentication vs Authorization
- **Authentication**: Who are you? (e.g., verifying email & password).
- **Authorization**: What are you allowed to do? (e.g., admin vs regular user permissions).

### JWT (JSON Web Tokens)
JWT consists of 3 dot-separated Base64 parts:
`Header.Payload.Signature`
1. **Header**: Token type & signing algorithm (e.g. HS256).
2. **Payload**: User identity & claims (e.g. `{"userId": 42, "role": "admin"}`).
3. **Signature**: Cryptographic signature generated using a secret key on the backend to prevent tampering.

---

## 5. Caching & Performance Optimization

### Why Use In-Memory Caching (Redis)?
Reading from RAM takes ~100 nanoseconds, while reading from a disk database takes ~10 milliseconds (**100,000x slower**).

### Cache-Aside Strategy
1. App checks cache for key `user:42`.
2. If **Cache Hit**, return cached JSON immediately.
3. If **Cache Miss**, query database, store result in cache with Time-To-Live (TTL), and return response.

---

## 📂 Source Code Implementations

All Java backend tutorial implementations are available in `src/backend_engineering/`:
- `HTTPClientServer.java`: HTTP Server & Request Parser
- `RESTAPIRouter.java`: Custom REST Router & Middleware pipeline
- `DatabaseSQLEngine.java`: In-Memory Relational Database Engine
- `JWTAuthentication.java`: Password Hashing & JWT Security Engine
- `RedisCacheEngine.java`: In-Memory Redis Cache & LRU Eviction Engine

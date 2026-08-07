# Project Execution Plan — Java DSA Curriculum Restructuring

## Project Goals
Restructure and expand all 13 modules (`src/module01_*` to `src/module13_*`) into a smooth, step-by-step learning progression:
1. R1: Micro-Step Progressive Course Design across all 13 modules.
2. R2: Bite-Sized Learning Code Snippets & ASCII Diagrams for memory states, pointers, and execution flow.
3. R3: Compilation & Runtime Reliability — clean compilation with `javac` and working `main` demonstration outputs.

## Phase Strategy

### Phase 0: Survey & Scope Mapping
- Spawn 3 parallel Survey Explorers to analyze existing `src/module01_*` through `src/module13_*` files.
- Collect full file inventory, existing topics, gap identification, and file count.
- Generate `PROJECT.md` at root with Feature Inventory & Milestone Decomposition.

### Phase 1: E2E Test Infra Track
- Spawn E2E Testing Orchestrator / Test Writer track to establish automated verification harness for `javac` compilation and `java` execution testing across all modules.
- Produce `TEST_INFRA.md` and `TEST_READY.md`.

### Phase 2: Milestone Execution (Implementation Track)
Decompose modules into logical milestones:
- M1: Java Fundamentals & Language Basics (Modules 01-03)
- M2: Arrays, Strings, Searching & Sorting (Modules 04-06)
- M3: Linked Lists, Stacks, Queues, Trees & Graphs (Modules 07-09)
- M4: Advanced DSA, Heaps, Hash Tables & Dynamic Programming (Modules 10-12)
- M5: Complex Capstones & Advanced System Topics (Module 13)

For each milestone:
1. Spawn 3 Explorers for micro-step lesson breakdown.
2. Spawn Worker to create micro-step `.java` files with code + ASCII diagrams.
3. Spawn 2 Reviewers to verify micro-step structure, readability, and correctness.
4. Spawn 2 Challengers to run javac and java test verification.
5. Spawn Forensic Auditor (`teamwork_preview_auditor`) to verify zero cheating / genuine implementation.
6. Gate check.

### Phase 3: Final Verification & Capstone Audit
- Run 100% E2E test suite across all 13 modules.
- Hardening with Tier 5 adversarial coverage.
- Final user report generation.

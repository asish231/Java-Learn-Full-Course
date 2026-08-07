# End-to-End Test Infrastructure (`TEST_INFRA.md`)

## Overview

The **Java DSA Curriculum E2E Automated Test Harness** provides continuous verification for all Java lesson and step files across `src/module01_*` through `src/module13_*`.

The harness ensures that every Java file in the project:
1. **Compiles cleanly** using `javac` with zero syntax, import, or type errors.
2. **Executes its `public static void main(String[] args)` method** cleanly without runtime exceptions or non-zero exit codes.
3. **Produces educational output logs** demonstrating data structures and algorithms concepts.

---

## Architecture & Test Harness Components

### 1. Test Runner Script: `scripts/run_e2e_tests.sh`
- **Location**: `scripts/run_e2e_tests.sh`
- **Portability**: Compatible with macOS (Bash 3.2+ / Zsh) and Linux environments.
- **Workflow**:
  1. **Clean Workspace**: Prepares clean class output directory at `build/classes/`.
  2. **Dynamic File Discovery**: Recursively finds all `.java` files in `src/` (or matching an optional module filter).
  3. **Batch Compilation**: Compiles discovered files using `javac -d build/classes`.
  4. **Class Name Mapping**: Translates relative file paths (e.g. `src/module01_foundations/Step01_ConstantAndLinearTime.java`) into fully qualified Java package class names (`module01_foundations.Step01_ConstantAndLinearTime`).
  5. **Main Method Execution**: Invokes `java -cp build/classes <classname>` for each compiled class, capturing exit status and output.
  6. **Metrics & Reporting**: Calculates compilation and execution timings, tallies passed/failed counts, and displays a formatted summary report.

---

## Usage Instructions

### Running All End-to-End Tests
From the project root directory, run:
```bash
./scripts/run_e2e_tests.sh
```

### Running Tests for a Specific Module
Pass a module name or substring filter as the first argument:
```bash
./scripts/run_e2e_tests.sh module01
./scripts/run_e2e_tests.sh module02
```

---

## Initial Baseline Execution Results

```text
==============================================================================
          Java DSA Curriculum E2E Automated Test Suite Execution             
==============================================================================
Project Root : /Users/asishsharma/IdeaProjects/scannerxplaoit
Source Dir   : /Users/asishsharma/IdeaProjects/scannerxplaoit/src
Build Dir    : /Users/asishsharma/IdeaProjects/scannerxplaoit/build/classes
Timestamp    : 2026-08-06T07:07:31Z
------------------------------------------------------------------------------
Found 85 Java source file(s) across curriculum modules.

[PHASE 1] Compiling Java Source Files...
[COMPILATION SUCCESS] 85 file(s) compiled cleanly in 0s with zero errors.

[PHASE 2] Running E2E Execution Verification...
  [PASS] backend_engineering.DatabaseSQLEngine
  [PASS] backend_engineering.HTTPClientServer
  [PASS] backend_engineering.JWTAuthentication
  [PASS] backend_engineering.RESTAPIRouter
  [PASS] backend_engineering.RedisCacheEngine
  [PASS] micro.CreateArray
  ...
  [PASS] module13_graph_algorithms.ShortestPathAlgorithms
  [PASS] module13_graph_algorithms.TopologicalSort

==============================================================================
                         E2E TEST SUITE RESULTS                               
==============================================================================
Total Java Files Discovered : 85
Total Files Compiled        : 85
Total E2E Tests Executed   : 85
Passed                      : 85
Failed                      : 0
Compilation Time            : 0s
Execution Time              : 3s
------------------------------------------------------------------------------
SUCCESS: ALL 85 E2E TESTS PASSED CLEANLY!
```

---

## Continuous Integration & Milestone Support

As milestones M1 through M5 progress and legacy lesson files are restructured into micro-step files (e.g. `Step01_*.java`), `scripts/run_e2e_tests.sh` automatically discovers and validates all newly created step files without requiring manual script updates.

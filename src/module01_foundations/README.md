# 📘 Module 01: Foundations & Big-O Complexity Analysis

Welcome to **Module 01**! Master how to analyze runtime and memory behavior across 3 progressive tiers:

---

## 🚦 Progressive Learning Tiers

### 🟢 Level 1: Basic Foundations
- **Concepts**: Asymptotic bounds ($O, \Omega, \Theta$), single loop vs nested loop counting.
- **Source File**: [`Level1_BasicBigO.java`](file:///Users/asishsharma/IdeaProjects/scannerxplaoit/src/module01_foundations/Level1_BasicBigO.java)
- **Key Takeaway**: Learn why $O(1)$ constant time is instantaneous and $O(N^2)$ quadratic time explodes as $N$ grows.

### 🟡 Level 2: Intermediate Analysis & Amortized Cost
- **Concepts**: $O(\log N)$ logarithmic halving loops and Amortized $O(1)$ cost analysis for Dynamic Array resizing.
- **Source File**: [`Level2_IntermediateAmortized.java`](file:///Users/asishsharma/IdeaProjects/scannerxplaoit/src/module01_foundations/Level2_IntermediateAmortized.java)
- **Key Takeaway**: Understand why adding $N$ items into an `ArrayList` takes total $O(N)$ work, yielding $O(1)$ amortized cost per item.

### 🔴 Level 3: Advanced Stack Depth & Memory Space
- **Concepts**: JVM Heap vs Stack memory, call stack frame accumulation, Tail-Recursion optimization.
- **Source File**: [`Level3_AdvancedRecursionMemory.java`](file:///Users/asishsharma/IdeaProjects/scannerxplaoit/src/module01_foundations/Level3_AdvancedRecursionMemory.java)
- **Key Takeaway**: Differentiate Auxiliary Space (extra memory created during execution) from total Space Complexity.

---

## ⚡ Execution Commands
```bash
javac src/module01_foundations/*.java
java -cp src module01_foundations.Level1_BasicBigO
java -cp src module01_foundations.Level2_IntermediateAmortized
java -cp src module01_foundations.Level3_AdvancedRecursionMemory
```

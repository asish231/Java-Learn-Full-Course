import os
import glob
import re

src_dir = "/Users/asishsharma/IdeaProjects/scannerxplaoit/src"
java_files = sorted(glob.glob(os.path.join(src_dir, "**/*.java"), recursive=True))

print(f"Total Java files found: {len(java_files)}")

ascii_missing = []
tagged_log_missing = []
suspicious_stubs = []
missing_main = []

# Regex patterns for ASCII diagrams
ascii_patterns = [
    r"\+---+", r"\+===", r"\|", r"->", r"<--", r"\[\s*\]", r"\[\d+\]",
    r"ASCII", r"Diagram", r"<pre>"
]

# Regex patterns for tagged educational logs
log_patterns = [
    r'System\.out\.print.*"\[[A-Z_\s]+\]',
    r'System\.out\.format.*"\[[A-Z_\s]+\]',
    r'\[INIT\]', r'\[ACTION\]', r'\[STATE\]', r'\[MEMORY', r'\[TRACE\]',
    r'\[RESULT\]', r'\[STEP\]', r'\[LOG\]', r'\[PIVOT\]', r'\[CHOICE\]'
]

# Regex patterns for stubs or facade bypasses
stub_patterns = [
    r'throw\s+new\s+UnsupportedOperationException',
    r'//\s*TODO',
    r'//\s*FIXME',
    r'//\s*stub',
    r'return\s+null;\s*//\s*mock',
    r'return\s+false;\s*//\s*dummy',
    r'return\s+true;\s*//\s*dummy'
]

for filepath in java_files:
    rel_path = os.path.relpath(filepath, src_dir)
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Check ASCII diagram in top 50 lines / header comments
    lines = content.splitlines()[:50]
    header = "\n".join(lines)
    has_ascii = False
    if any(re.search(p, header) for p in ascii_patterns):
        has_ascii = True
    else:
        # Check whole file
        if any(re.search(p, content) for p in ascii_patterns):
            has_ascii = True

    if not has_ascii:
        ascii_missing.append(rel_path)

    # Check tagged logs
    has_tagged_log = any(re.search(p, content) for p in log_patterns)
    if not has_tagged_log:
        tagged_log_missing.append(rel_path)

    # Check for suspicious stubs
    for sp in stub_patterns:
        matches = re.findall(sp, content, re.IGNORECASE)
        if matches:
            suspicious_stubs.append((rel_path, sp, matches))

    # Check main method
    if "public static void main" not in content:
        missing_main.append(rel_path)

print(f"\n--- ASCII Diagram Check ---")
print(f"Files lacking ASCII diagram: {len(ascii_missing)}")
for f in ascii_missing:
    print(f"  - {f}")

print(f"\n--- Tagged Educational Log Check ---")
print(f"Files lacking tagged logs: {len(tagged_log_missing)}")
for f in tagged_log_missing:
    print(f"  - {f}")

print(f"\n--- Suspicious Stubs / Facade Check ---")
print(f"Suspicious occurrences: {len(suspicious_stubs)}")
for f, pattern, m in suspicious_stubs:
    print(f"  - {f} matches {pattern}: {m}")

print(f"\n--- Main Method Check ---")
print(f"Files missing main method: {len(missing_main)}")
for f in missing_main:
    print(f"  - {f}")

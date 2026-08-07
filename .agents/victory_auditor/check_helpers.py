import os, glob, re

def strip_comments(text):
    # remove single line and multi line comments
    pattern = r"//.*?$|/\*.*?\*/"
    return re.sub(pattern, "", text, flags=re.DOTALL | re.MULTILINE)

src_dir = "/Users/asishsharma/IdeaProjects/scannerxplaoit/src"
step_files = sorted(glob.glob(os.path.join(src_dir, "**/Step*.java"), recursive=True))

non_static_helpers = []

for f in step_files:
    content = open(f, "r", encoding="utf-8", errors="ignore").read()
    clean = strip_comments(content)
    
    # Matches class declarations
    lines = clean.splitlines()
    for line in lines:
        if "class " in line and not line.strip().startswith("import"):
            m = re.search(r"(?:(public|private|protected|static)\s+)*class\s+([A-Za-z0-9_]+)", line)
            if m:
                full_decl = m.group(0)
                cls_name = m.group(2)
                if not cls_name.startswith("Step"):
                    if "static" not in full_decl:
                        non_static_helpers.append((os.path.basename(f), cls_name, line.strip()))

print(f"Non-static helper classes found: {len(non_static_helpers)}")
for item in non_static_helpers:
    print(item)

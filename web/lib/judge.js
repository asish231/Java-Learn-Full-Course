/**
 * judge.js — Java compile & execute sandbox.
 *
 * Two execution modes:
 *   1. runFreeform(code)        → compiles the snippet and runs its main() method.
 *   2. runTests(code, tests)    → wraps the user's `Solution` class with a generated
 *                                 test harness and reports per-test-case results.
 *
 * The harness communicates with Node through single-line, base64 encoded records:
 *   @@CASE|<index>|<b64 name>|<b64 input>|<b64 expected>|<b64 actual>|<b64 error>
 */
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const TEMP_DIR = path.join(__dirname, '..', 'temp');
const COMPILE_TIMEOUT_MS = 20000;
const RUN_TIMEOUT_MS = 10000;

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// Source utilities
// ---------------------------------------------------------------------------

function stripPackages(code) {
  return code.replace(/^\s*package\s+[\w.]+;\s*$/gm, '');
}

/** Pull every `import ...;` line out of the source so it can be hoisted to the top. */
function extractImports(code) {
  const imports = [];
  const body = code.replace(/^\s*import\s+[^;]+;\s*$/gm, (line) => {
    imports.push(line.trim());
    return '';
  });
  return { imports, body };
}

/** Force the primary class of a submission to be a non-public class named `Solution`. */
function normalizeSolutionClass(code) {
  if (/\bclass\s+Solution\b/.test(code)) {
    return code.replace(/public\s+(?=(?:final\s+|abstract\s+)?class\s+Solution\b)/, '');
  }
  const match = code.match(/(?:public\s+)?(?:final\s+|abstract\s+)?class\s+([A-Za-z_]\w*)/);
  if (!match) return code;
  return code
    .replace(/public\s+(?=(?:final\s+|abstract\s+)?class\s+)/, '')
    .replace(new RegExp(`\\bclass\\s+${match[1]}\\b`), 'class Solution')
    .replace(new RegExp(`\\bnew\\s+${match[1]}\\s*\\(`, 'g'), 'new Solution(');
}

function cleanup(className) {
  try {
    for (const file of fs.readdirSync(TEMP_DIR)) {
      if (file.startsWith(className)) {
        try { fs.unlinkSync(path.join(TEMP_DIR, file)); } catch (_) { /* ignore */ }
      }
    }
  } catch (_) { /* ignore */ }
}

function dedupeImports(list) {
  const seen = new Set();
  const out = [];
  for (const imp of list) {
    const key = imp.replace(/\s+/g, ' ');
    if (!seen.has(key)) { seen.add(key); out.push(imp); }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Compile + run pipeline
// ---------------------------------------------------------------------------

/**
 * @param {number} lineOffset number of generated lines before the learner's own
 *        code, so compiler diagnostics can be reported in *their* coordinates.
 */
function compileAndRun(className, source, stdin, lineOffset = 0) {
  return new Promise((resolve) => {
    const filePath = path.join(TEMP_DIR, `${className}.java`);
    const started = Date.now();

    fs.writeFile(filePath, source, (writeErr) => {
      if (writeErr) {
        return resolve({ status: 'Internal Error', error: writeErr.message, elapsedMs: 0 });
      }

      exec(`javac -nowarn -d "${TEMP_DIR}" "${filePath}"`, { timeout: COMPILE_TIMEOUT_MS },
        (compileErr, _out, compileStderr) => {
          if (compileErr) {
            cleanup(className);
            return resolve({
              status: 'Compilation Error',
              error: humanizeCompileError(compileStderr || compileErr.message, className, lineOffset),
              elapsedMs: Date.now() - started
            });
          }

          const child = exec(`java -cp "${TEMP_DIR}" ${className}`,
            { timeout: RUN_TIMEOUT_MS, maxBuffer: 4 * 1024 * 1024 },
            (runErr, stdout, stderr) => {
              const elapsedMs = Date.now() - started;
              cleanup(className);
              if (runErr && runErr.killed) {
                return resolve({ status: 'Time Limit Exceeded', stdout, error: 'Execution exceeded the time limit (possible infinite loop).', elapsedMs });
              }
              if (runErr) {
                return resolve({ status: 'Runtime Error', stdout, error: stderr || runErr.message, elapsedMs });
              }
              resolve({ status: 'Success', stdout, error: stderr, elapsedMs });
            });

          if (stdin && child.stdin) {
            child.stdin.write(stdin);
            child.stdin.end();
          }
        });
    });
  });
}

/**
 * Rewrite compiler diagnostics so they point at the learner's file and at the
 * line number they actually see in the editor.
 */
function humanizeCompileError(raw, className, lineOffset = 0) {
  return String(raw)
    .split('\n')
    .map((line) => line.replace(
      new RegExp(`.*${className}\\.java:(\\d+)`, 'g'),
      (_match, number) => `Solution.java:${Math.max(1, Number(number) - lineOffset)}`))
    .map((line) => line.replace(new RegExp(`.*${className}\\.java`, 'g'), 'Solution.java'))
    .join('\n')
    .trim();
}

// ---------------------------------------------------------------------------
// Mode 1 — freeform snippet with a main() method
// ---------------------------------------------------------------------------

async function runFreeform(code, stdin) {
  const className = `Free_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  let src = stripPackages(code);
  const { imports, body } = extractImports(src);

  const importHeader = dedupeImports(['import java.util.*;', ...imports]).join('\n');
  let program;
  let lineOffset = 0;
  if (/\bclass\s+[A-Za-z_]\w*/.test(body)) {
    let renamed = body;
    const primary = body.match(/public\s+(?:final\s+|abstract\s+)?class\s+([A-Za-z_]\w*)/)
      || body.match(/(?:final\s+|abstract\s+)?class\s+([A-Za-z_]\w*)[^;]*\{[\s\S]*main\s*\(/)
      || body.match(/class\s+([A-Za-z_]\w*)/);
    if (primary) {
      renamed = body
        .replace(/public\s+(?=(?:final\s+|abstract\s+)?class\s+)/, '')
        .replace(new RegExp(`\\bclass\\s+${primary[1]}\\b`), `public class ${className}`)
        .replace(new RegExp(`\\bnew\\s+${primary[1]}\\s*\\(`, 'g'), `new ${className}(`)
        .replace(new RegExp(`\\b${primary[1]}\\s+(\\w+)\\s*=\\s*new\\s+${className}\\(`, 'g'), `${className} $1 = new ${className}(`);
    }
    program = `${importHeader}\n\n${renamed}\n`;
    lineOffset = importHeader.split('\n').length + 1;
  } else {
    program = `${importHeader}\n\n`
      + `public class ${className} {\n  public static void main(String[] args) throws Exception {\n${body}\n  }\n}\n`;
    lineOffset = importHeader.split('\n').length + 3;
  }

  return compileAndRun(className, program, stdin, lineOffset);
}

// ---------------------------------------------------------------------------
// Mode 2 — graded run against a problem's test cases
// ---------------------------------------------------------------------------

function javaStringLiteral(value) {
  return JSON.stringify(String(value == null ? '' : value));
}

function buildHarness(className, userCode, tests, helpers) {
  const src = stripPackages(userCode);
  const { imports, body } = extractImports(src);
  const solution = normalizeSolutionClass(body);

  const cases = tests.map((test, index) => `
    try {
      Solution sol = new Solution();
      ${test.setup || ''}
      String actual = String.valueOf(${test.expr});
      report(${index}, ${javaStringLiteral(test.name || `Case ${index + 1}`)}, ${javaStringLiteral(test.input || '')}, ${javaStringLiteral(test.expected)}, actual, "");
    } catch (Throwable t) {
      report(${index}, ${javaStringLiteral(test.name || `Case ${index + 1}`)}, ${javaStringLiteral(test.input || '')}, ${javaStringLiteral(test.expected)}, "", describe(t));
    }`).join('\n');

  const header = `${dedupeImports(['import java.util.*;', 'import java.util.function.*;', ...imports]).join('\n')}

public class ${className} {
${helpers ? `    // ---- problem specific helpers ----\n${helpers}\n` : ''}
    private static String enc(String s) {
        return Base64.getEncoder().encodeToString(String.valueOf(s).getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }

    private static void report(int i, String name, String input, String expected, String actual, String error) {
        System.out.println("@@CASE|" + i + "|" + enc(name) + "|" + enc(input) + "|" + enc(expected) + "|" + enc(actual) + "|" + enc(error));
    }

    private static String describe(Throwable t) {
        StringBuilder sb = new StringBuilder(t.getClass().getSimpleName());
        if (t.getMessage() != null) sb.append(": ").append(t.getMessage());
        StackTraceElement[] trace = t.getStackTrace();
        for (int i = 0; i < trace.length && i < 3; i++) {
            sb.append("\\n    at ").append(trace[i]);
        }
        return sb.toString();
    }

    public static void main(String[] args) {
${cases}
    }
}

`;

  return { source: header + solution + '\n', lineOffset: header.split('\n').length - 1 };
}

function decode(value) {
  return Buffer.from(value || '', 'base64').toString('utf8');
}

function normalizeAnswer(value, unordered) {
  let text = String(value == null ? '' : value).trim().replace(/\s+/g, ' ');
  if (unordered) {
    const inner = text.replace(/^\[|\]$/g, '');
    text = inner.split(',').map((t) => t.trim()).sort().join(',');
  }
  return text;
}

async function runTests(code, tests, helpers) {
  const className = `Judge_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const harness = buildHarness(className, code, tests, helpers);
  const result = await compileAndRun(className, harness.source, undefined, harness.lineOffset);

  if (result.status !== 'Success' && result.status !== 'Runtime Error') {
    return { ...result, results: [], passed: 0, total: tests.length };
  }

  const stdoutLines = String(result.stdout || '').split('\n');
  const logs = [];
  const byIndex = new Map();

  for (const line of stdoutLines) {
    if (line.startsWith('@@CASE|')) {
      const parts = line.split('|');
      const index = Number(parts[1]);
      const expected = decode(parts[4]);
      const actual = decode(parts[5]);
      const error = decode(parts[6]);
      const unordered = !!(tests[index] && tests[index].unordered);
      byIndex.set(index, {
        index,
        name: decode(parts[2]),
        input: decode(parts[3]),
        expected,
        actual,
        error,
        passed: !error && normalizeAnswer(actual, unordered) === normalizeAnswer(expected, unordered)
      });
    } else if (line.trim().length > 0) {
      logs.push(line);
    }
  }

  const results = tests.map((test, index) => byIndex.get(index) || {
    index,
    name: test.name || `Case ${index + 1}`,
    input: test.input || '',
    expected: String(test.expected),
    actual: '',
    error: 'Case did not finish — the program stopped early (timeout, crash or System.exit).',
    passed: false
  });

  const passed = results.filter((r) => r.passed).length;
  return {
    status: passed === results.length ? 'Accepted' : 'Wrong Answer',
    results,
    passed,
    total: results.length,
    stdout: logs.join('\n'),
    error: result.error,
    elapsedMs: result.elapsedMs
  };
}

module.exports = { runFreeform, runTests, TEMP_DIR };

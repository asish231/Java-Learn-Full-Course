const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure temp build directory exists
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Module display name map
const moduleNameMap = {
  'module01_foundations': '01. Foundations & Big-O',
  'module02_arrays_and_strings': '02. Arrays & Strings',
  'module03_linked_lists': '03. Linked Lists',
  'module04_stacks_and_queues': '04. Stacks & Queues',
  'module05_hashing': '05. Hashing & HashMaps',
  'module06_trees_and_bst': '06. Trees & BST',
  'module07_heaps_and_priority_queues': '07. Heaps & Priority Queues',
  'module08_disjoint_set_and_trie': '08. Trie & Disjoint Set',
  'module09_sorting_and_searching': '09. Sorting & Searching',
  'module10_recursion_and_backtracking': '10. Recursion & Backtracking',
  'module11_greedy_algorithms': '11. Greedy Algorithms',
  'module12_dynamic_programming': '12. Dynamic Programming',
  'module13_graph_algorithms': '13. Graph Algorithms',
  'backend_engineering': 'Backend Engineering Mastery',
  'quickstart': '00. Java Quickstart & Collections',
  'micro': '00. Micro Exercises'
};

function cleanTitle(filename) {
  let name = filename.replace(/\.java$/, '');
  name = name.replace(/^Level\d+_/i, '');
  name = name.replace(/([a-z])([A-Z])/g, '$1 $2');
  name = name.replace(/_/g, ' ');
  return name.trim();
}

function getDifficulty(filename) {
  if (/Level1/i.test(filename)) return 'Easy';
  if (/Level2/i.test(filename)) return 'Medium';
  if (/Level3/i.test(filename)) return 'Hard';
  if (/Quickstart/i.test(filename)) return 'Easy';
  return 'Medium';
}

function getCategory(dirName) {
  if (dirName === 'backend_engineering') return 'Backend Engineering';
  if (dirName === 'quickstart' || dirName === 'micro') return 'Java & OOPs';
  return 'Data Structures & Algorithms';
}

function parseJavadoc(content) {
  const match = content.match(/\/\*\*([\s\S]*?)\*\//);
  if (match) {
    const lines = match[1].split('\n')
      .map(line => line.replace(/^\s*\*\s?/, '').trim())
      .filter(line => line.length > 0 && !line.startsWith('@'));
    if (lines.length > 0) return lines.join(' ');
  }
  return null;
}

// CSV Line Parser supporting quotes
function parseCSVLine(line) {
  const row = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  row.push(current.trim());
  return row;
}

function parseCompanyCSV(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const results = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length >= 4) {
      results.push({
        id: cols[0],
        url: cols[1],
        title: cols[2],
        difficulty: cols[3] || 'Medium',
        acceptance: cols[4] || 'N/A',
        frequency: cols[5] || 'N/A'
      });
    }
  }
  return results;
}

function formatCompanyName(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const companyDir = path.join(__dirname, '..', 'leetcode_companywise');

// Helper to get available companies list
function getAvailableCompanies() {
  if (!fs.existsSync(companyDir)) return [];
  const entries = fs.readdirSync(companyDir, { withFileTypes: true });
  const companies = [];

  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      companies.push({
        id: entry.name,
        name: formatCompanyName(entry.name)
      });
    }
  }
  companies.sort((a, b) => a.name.localeCompare(b.name));
  return companies;
}

function scanWorkspaceSrc() {
  const srcDir = path.join(__dirname, '..', 'src');
  const catalog = [];

  if (fs.existsSync(srcDir)) {
    const dirs = fs.readdirSync(srcDir, { withFileTypes: true });

    for (const dir of dirs) {
      if (dir.isDirectory()) {
        const dirName = dir.name;
        const dirPath = path.join(srcDir, dirName);
        const category = getCategory(dirName);
        const moduleName = moduleNameMap[dirName] || dirName.replace(/_/g, ' ').toUpperCase();

        const files = fs.readdirSync(dirPath);
        for (const file of files) {
          if (file.endsWith('.java')) {
            const filePath = path.join(dirPath, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const id = `${dirName}-${file.replace(/\.java$/, '').toLowerCase()}`;
            const title = cleanTitle(file);
            const difficulty = getDifficulty(file);
            const javadocDesc = parseJavadoc(content);
            const description = javadocDesc || `Practice and explore implementation of ${title} in module ${moduleName}.`;

            catalog.push({
              id,
              category,
              moduleName,
              title: `${file.replace(/\.java$/, '')}`,
              difficulty,
              description,
              starterCode: content,
              solutionCode: content,
              filePath: `src/${dirName}/${file}`,
              examples: [],
              hints: [
                `💡 Source file location: src/${dirName}/${file}`,
                `💡 Inspect the Java code and run it in the terminal to observe primitive operations and outputs.`
              ]
            });
          }
        }
      }
    }
  }

  // Scan company questions from leetcode_companywise
  if (fs.existsSync(companyDir)) {
    const defaultCompanies = ['google', 'amazon', 'meta', 'microsoft', 'apple', 'bloomberg', 'goldman-sachs', 'uber', 'bytedance', 'atlassian', 'adobe', 'netflix', 'salesforce', 'nvidia'];
    
    for (const compSlug of defaultCompanies) {
      const compPath = path.join(companyDir, compSlug);
      if (fs.existsSync(compPath)) {
        const compName = formatCompanyName(compSlug);
        
        // Scan 30 days and 3 months for popular questions
        const periodFiles = [
          { file: 'thirty-days.csv', periodName: 'Last 30 Days' },
          { file: 'three-months.csv', periodName: 'Last 3 Months' }
        ];

        for (const pf of periodFiles) {
          const csvPath = path.join(compPath, pf.file);
          const questions = parseCompanyCSV(csvPath);

          for (const q of questions) {
            const problemId = `company-${compSlug}-${pf.file.replace('.csv','')}-${q.id}`;
            const starterCode = `import java.util.*;

/**
 * Company Track: ${compName} (${pf.periodName})
 * Problem: #${q.id} - ${q.title}
 * Difficulty: ${q.difficulty} | Frequency: ${q.frequency} | Acceptance: ${q.acceptance}
 * LeetCode URL: ${q.url}
 */
public class Solution {

    public static void main(String[] args) {
        System.out.println("=== Interview Practice: ${compName} ===");
        System.out.println("Problem #${q.id}: ${q.title.replace(/"/g, '\\"')} (${q.difficulty})");
        System.out.println("Interview Frequency: ${q.frequency} | Acceptance: ${q.acceptance}");
        System.out.println("-------------------------------------------------");
        
        // TODO: Implement solution for ${q.title.replace(/"/g, '\\"')}
        
    }
}
`;

            catalog.push({
              id: problemId,
              category: 'Company Tracks',
              companySlug: compSlug,
              companyName: compName,
              timeframe: pf.file.replace('.csv',''),
              moduleName: `🏢 ${compName} (${pf.periodName})`,
              title: `#${q.id} - ${q.title}`,
              difficulty: q.difficulty,
              description: `LeetCode Interview Question #${q.id}: ${q.title}. Frequently asked in ${compName} technical interviews (${pf.periodName}). Frequency: ${q.frequency}, Acceptance Rate: ${q.acceptance}.`,
              starterCode,
              solutionCode: starterCode,
              filePath: `leetcode_companywise/${compSlug}/${pf.file}`,
              leetcodeUrl: q.url,
              frequency: q.frequency,
              acceptance: q.acceptance,
              examples: [
                { input: `LeetCode #${q.id} - ${q.title}`, output: `Target Company: ${compName}` }
              ],
              hints: [
                `🎯 Company: ${compName} | Period: ${pf.periodName}`,
                `📊 Interview Frequency: ${q.frequency} | Acceptance: ${q.acceptance}`,
                `🔗 Direct LeetCode Link: ${q.url}`
              ]
            });
          }
        }
      }
    }
  }

  catalog.sort((a, b) => {
    if (a.moduleName !== b.moduleName) {
      return a.moduleName.localeCompare(b.moduleName);
    }
    return a.title.localeCompare(b.title);
  });

  return catalog;
}

// GET /api/companies - Return list of available companies
app.get('/api/companies', (req, res) => {
  res.json(getAvailableCompanies());
});

// GET /api/problems - Return all problems dynamically scanned
app.get('/api/problems', (req, res) => {
  try {
    const catalog = scanWorkspaceSrc();
    res.json(catalog);
  } catch (err) {
    console.error('[Scanner] Error scanning workspace:', err);
    res.status(500).json({ error: 'Failed to scan workspace source files' });
  }
});

// GET /api/company-problems?company=google&period=thirty-days
app.get('/api/company-problems', (req, res) => {
  const { company = 'google', period = 'thirty-days' } = req.query;
  const csvFile = period.endsWith('.csv') ? period : `${period}.csv`;
  const filePath = path.join(companyDir, company, csvFile);
  
  const questions = parseCompanyCSV(filePath);
  const compName = formatCompanyName(company);

  const formatted = questions.map(q => ({
    id: `company-${company}-${period}-${q.id}`,
    category: 'Company Tracks',
    companySlug: company,
    companyName: compName,
    timeframe: period,
    moduleName: `🏢 ${compName}`,
    title: `#${q.id} - ${q.title}`,
    difficulty: q.difficulty,
    description: `LeetCode Interview Question #${q.id}: ${q.title}. Asked in ${compName} technical interviews. Frequency: ${q.frequency}, Acceptance: ${q.acceptance}.`,
    starterCode: `import java.util.*;

/**
 * Company Track: ${compName} (${period})
 * Problem: #${q.id} - ${q.title}
 * Difficulty: ${q.difficulty} | Frequency: ${q.frequency} | Acceptance: ${q.acceptance}
 * LeetCode URL: ${q.url}
 */
public class Solution {

    public static void main(String[] args) {
        System.out.println("=== Interview Practice: ${compName} ===");
        System.out.println("Problem #${q.id}: ${q.title.replace(/"/g, '\\"')} (${q.difficulty})");
        System.out.println("Interview Frequency: ${q.frequency} | Acceptance: ${q.acceptance}");
        System.out.println("-------------------------------------------------");
        
        // TODO: Implement solution for ${q.title.replace(/"/g, '\\"')}
        
    }
}
`,
    solutionCode: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        System.out.println("Solution template for ${q.title.replace(/"/g, '\\"')} (${compName})");
    }
}
`,
    filePath: `leetcode_companywise/${company}/${csvFile}`,
    leetcodeUrl: q.url,
    frequency: q.frequency,
    acceptance: q.acceptance,
    hints: [
      `🎯 Company: ${compName}`,
      `📊 Frequency: ${q.frequency} | Acceptance: ${q.acceptance}`,
      `🔗 LeetCode URL: ${q.url}`
    ]
  }));

  res.json(formatted);
});

// POST /api/run - Compile and execute Java code
app.post('/api/run', (req, res) => {
  const { code } = req.body;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Java code string is required' });
  }

  const timestamp = Date.now();
  const className = `Solution_${timestamp}`;
  const filename = `${className}.java`;
  const filePath = path.join(tempDir, filename);

  // 1. Strip package declarations for flat temp compilation
  let modifiedCode = code.replace(/^\s*package\s+[\w.]+;/gm, '// package stripped for sandbox execution');

  // 2. Replace primary public class declaration with unique timestamp class name
  if (/public\s+class\s+([A-Za-z0-9_]+)/.test(modifiedCode)) {
    modifiedCode = modifiedCode.replace(/public\s+class\s+([A-Za-z0-9_]+)/, `public class ${className}`);
  } else if (/class\s+([A-Za-z0-9_]+)/.test(modifiedCode)) {
    modifiedCode = modifiedCode.replace(/class\s+([A-Za-z0-9_]+)/, `public class ${className}`);
  } else {
    modifiedCode = `public class ${className} {\n  public static void main(String[] args) {\n${code}\n  }\n}`;
  }

  fs.writeFile(filePath, modifiedCode, (err) => {
    if (err) {
      return res.status(500).json({ error: `File write error: ${err.message}` });
    }

    const compileCmd = `javac "${filePath}"`;
    const runCmd = `java -cp "${tempDir}" ${className}`;
    const startTime = Date.now();

    exec(compileCmd, { timeout: 10000 }, (compileErr, compileStdout, compileStderr) => {
      if (compileErr) {
        cleanupTempFiles(tempDir, className);
        return res.json({
          status: 'Compilation Error',
          error: compileStderr || compileErr.message,
          elapsedMs: Date.now() - startTime
        });
      }

      exec(runCmd, { timeout: 5000 }, (runErr, runStdout, runStderr) => {
        const elapsedMs = Date.now() - startTime;
        cleanupTempFiles(tempDir, className);

        if (runErr) {
          return res.json({
            status: 'Runtime Error',
            error: runStderr || runErr.message,
            elapsedMs
          });
        }

        res.json({
          status: 'Success',
          stdout: runStdout,
          error: runStderr,
          elapsedMs
        });
      });
    });
  });
});

function cleanupTempFiles(dir, className) {
  const files = [
    path.join(dir, `${className}.java`),
    path.join(dir, `${className}.class`)
  ];
  files.forEach(f => {
    if (fs.existsSync(f)) {
      try { fs.unlinkSync(f); } catch (e) {}
    }
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Java Backend & DSA Studio server running on http://localhost:${PORT}`);
});

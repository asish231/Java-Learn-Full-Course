/**
 * catalog.js — builds the studio's content catalog.
 *
 * Two sources feed the app:
 *   1. `src/` — the Java curriculum. Each folder becomes a chapter, each
 *      `.java` file becomes a lesson (runnable, with its Javadoc as the brief).
 *   2. `leetcode_companywise/` — company CSVs. Each row becomes a practice
 *      question; if the id exists in the curated problem bank the question is
 *      served fully specified (statement, examples, tests), otherwise it is
 *      served as a "lite" entry that still runs and links out.
 */
const fs = require('fs');
const path = require('path');
const { CHAPTERS, LEVEL_META, TOPICS, chaptersForTopics } = require('../data/curriculum');
const { getProblem, allProblems } = require('../data/problem-bank');

const ROOT = path.join(__dirname, '..', '..');
const SRC_DIR = path.join(ROOT, 'src');
const COMPANY_DIR = path.join(ROOT, 'leetcode_companywise');

// ---------------------------------------------------------------------------
// Lessons (src/**)
// ---------------------------------------------------------------------------

function humanizeFileName(fileName) {
  return fileName
    .replace(/\.java$/, '')
    .replace(/^Level\d+_/i, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .trim();
}

function parseJavadoc(content) {
  const match = content.match(/\/\*\*([\s\S]*?)\*\//);
  if (!match) return { summary: null, bullets: [] };
  const lines = match[1]
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').trim())
    .filter((line) => line.length > 0 && !line.startsWith('@'));
  if (lines.length === 0) return { summary: null, bullets: [] };
  const bullets = lines.filter((l) => /^\d+[.)]\s|^-\s/.test(l)).map((l) => l.replace(/^\d+[.)]\s|^-\s/, ''));
  const summary = lines.filter((l) => !bullets.includes(l.replace(/^\d+[.)]\s|^-\s/, ''))).join(' ');
  return { summary: summary || lines.join(' '), bullets };
}

/** Public method signatures — a quick "what's inside" outline for a lesson. */
function extractApi(content) {
  const api = [];
  const re = /(?:public|protected)\s+(?:static\s+)?(?:final\s+)?([\w<>\[\],\s?]+?)\s+(\w+)\s*\(([^)]*)\)\s*\{/g;
  let match;
  while ((match = re.exec(content)) !== null) {
    const [, returnType, name, args] = match;
    if (name === 'main') continue;
    api.push(`${returnType.trim()} ${name}(${args.replace(/\s+/g, ' ').trim()})`);
    if (api.length >= 12) break;
  }
  return api;
}

function levelOf(fileName) {
  const match = fileName.match(/^Level(\d)_/i);
  return match ? Number(match[1]) : 0;
}

function readChapterReadme(dir) {
  const file = path.join(SRC_DIR, dir, 'README.md');
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, 'utf8');
}

function buildLesson(chapter, fileName) {
  const filePath = path.join(SRC_DIR, chapter.dir, fileName);
  const content = fs.readFileSync(filePath, 'utf8');
  const level = levelOf(fileName);
  const meta = LEVEL_META[level];
  const doc = parseJavadoc(content);
  const lines = content.split('\n').length;

  return {
    id: `${chapter.id}/${fileName.replace(/\.java$/, '')}`,
    chapterId: chapter.id,
    fileName,
    filePath: `src/${chapter.dir}/${fileName}`,
    title: humanizeFileName(fileName),
    level,
    kind: level > 0 ? 'tier' : 'deep-dive',
    levelName: meta ? meta.name : 'Deep dive',
    difficulty: meta ? meta.difficulty : 'Reference',
    minutes: meta ? meta.minutes : Math.max(10, Math.round(lines / 12)),
    summary: doc.summary || `Runnable reference implementation: ${humanizeFileName(fileName)}.`,
    bullets: doc.bullets,
    api: extractApi(content),
    lines,
    code: content
  };
}

let lessonCache = null;

function buildChapters({ force = false } = {}) {
  if (lessonCache && !force) return lessonCache;

  const chapters = CHAPTERS
    .filter((chapter) => fs.existsSync(path.join(SRC_DIR, chapter.dir)))
    .map((chapter) => {
      const files = fs.readdirSync(path.join(SRC_DIR, chapter.dir))
        .filter((f) => f.endsWith('.java'))
        .sort((a, b) => {
          const la = levelOf(a);
          const lb = levelOf(b);
          if (la !== lb) return (la || 9) - (lb || 9);
          return a.localeCompare(b);
        });

      const lessons = files.map((file) => buildLesson(chapter, file));

      return {
        ...chapter,
        readme: readChapterReadme(chapter.dir),
        lessonCount: lessons.length,
        lessons
      };
    })
    .sort((a, b) => a.order - b.order);

  lessonCache = chapters;
  return chapters;
}

/** Chapter list without the (large) lesson source code — for list screens. */
function chapterSummaries() {
  return buildChapters().map((chapter) => ({
    ...chapter,
    readme: undefined,
    lessons: chapter.lessons.map(({ code, ...rest }) => rest)
  }));
}

function getChapterDetail(id) {
  return buildChapters().find((c) => c.id === id) || null;
}

function getLesson(lessonId) {
  for (const chapter of buildChapters()) {
    const lesson = chapter.lessons.find((l) => l.id === lessonId);
    if (lesson) return { ...lesson, chapterTitle: chapter.title, chapterIcon: chapter.icon };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Company question tracks (leetcode_companywise/**)
// ---------------------------------------------------------------------------

function parseCSVLine(line) {
  const row = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') inQuotes = !inQuotes;
    else if (char === ',' && !inQuotes) { row.push(current.trim()); current = ''; }
    else current += char;
  }
  row.push(current.trim());
  return row;
}

function parseCompanyCSV(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/).filter((l) => l.trim().length > 0);
  const out = [];
  const seen = new Set();
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length >= 4 && !seen.has(cols[0])) {
      seen.add(cols[0]);
      out.push({
        id: cols[0],
        url: cols[1],
        title: cols[2],
        difficulty: /^(Easy|Medium|Hard)$/.test(cols[3]) ? cols[3] : 'Medium',
        acceptance: cols[4] || '',
        frequency: cols[5] || ''
      });
    }
  }
  return out;
}

function formatCompanyName(slug) {
  const overrides = {
    'bytedance': 'ByteDance', 'tiktok': 'TikTok', 'linkedin': 'LinkedIn',
    'paypal': 'PayPal', 'ibm': 'IBM', 'sap': 'SAP', 'ey': 'EY', 'jpmorgan': 'JPMorgan',
    'nvidia': 'NVIDIA', 'ebay': 'eBay', 'openai': 'OpenAI', 'x': 'X'
  };
  if (overrides[slug]) return overrides[slug];
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

const PERIODS = [
  { id: 'thirty-days', label: 'Last 30 days' },
  { id: 'three-months', label: 'Last 3 months' },
  { id: 'six-months', label: 'Last 6 months' },
  { id: 'more-than-six-months', label: 'Older than 6 months' },
  { id: 'all', label: 'All time' }
];

let companyCache = null;

function listCompanies() {
  if (companyCache) return companyCache;
  if (!fs.existsSync(COMPANY_DIR)) return [];

  const bankIds = new Set(allProblems().map((p) => String(p.id)));

  companyCache = fs.readdirSync(COMPANY_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .map((entry) => {
      const periods = PERIODS.filter((p) => fs.existsSync(path.join(COMPANY_DIR, entry.name, `${p.id}.csv`)));
      const all = parseCompanyCSV(path.join(COMPANY_DIR, entry.name, 'all.csv'));
      const guided = all.filter((q) => bankIds.has(String(q.id))).length;
      return {
        id: entry.name,
        name: formatCompanyName(entry.name),
        questionCount: all.length,
        guidedCount: guided,
        periods: periods.map((p) => p.id),
        recent: all.slice(0, 3).map((q) => q.title)
      };
    })
    .filter((c) => c.questionCount > 0)
    .sort((a, b) => b.guidedCount - a.guidedCount || b.questionCount - a.questionCount || a.name.localeCompare(b.name));

  return companyCache;
}

/** Featured companies shown on the practice screen before any search. */
const FEATURED = ['google', 'amazon', 'meta', 'microsoft', 'apple', 'bloomberg', 'uber',
  'bytedance', 'goldman-sachs', 'adobe', 'netflix', 'nvidia', 'linkedin', 'oracle',
  'salesforce', 'atlassian', 'tiktok', 'paypal'];

function featuredCompanies() {
  const all = listCompanies();
  const byId = new Map(all.map((c) => [c.id, c]));
  return FEATURED.map((id) => byId.get(id)).filter(Boolean);
}

function fallbackStarter(question) {
  return `class Solution {
    // LeetCode #${question.id} — ${question.title} (${question.difficulty})
    // This question is not in the guided bank yet: open the LeetCode link for the
    // full statement, write your solution here and press Run to execute main().

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println("Testing #${question.id} ${question.title.replace(/"/g, '\\"')}");
    }
}`;
}

/** Merge a CSV row with the curated bank entry (when we have one). */
function decorateQuestion(question, companySlug) {
  const curated = getProblem(question.id);
  const companyName = companySlug ? formatCompanyName(companySlug) : null;

  const base = {
    id: `lc-${question.id}`,
    number: Number(question.id),
    title: question.title,
    difficulty: curated ? curated.difficulty : question.difficulty,
    leetcodeUrl: question.url,
    acceptance: question.acceptance,
    frequency: question.frequency,
    companySlug: companySlug || null,
    companyName,
    guided: !!curated
  };

  if (!curated) {
    return {
      ...base,
      topics: [],
      statement: `**LeetCode #${question.id} — ${question.title}**\n\nThis question comes from the ${companyName || 'company'} question list. It is not part of the guided bank yet, so there is no built-in test suite: read the full statement on LeetCode, implement your solution here and run it against your own \`main\` method.\n\nAsk the AI tutor to walk you through it — it can restate the problem, suggest a pattern and review your code.`,
      examples: [],
      constraints: [],
      hints: [
        'Open the LeetCode link and restate the problem in your own words first.',
        'Ask the tutor: "what pattern does this problem use?" before writing code.'
      ],
      approach: null,
      complexity: null,
      starterCode: fallbackStarter(question),
      solutionCode: null,
      tests: [],
      prerequisites: []
    };
  }

  return {
    ...base,
    slug: curated.slug,
    topics: curated.topics || [],
    statement: curated.statement,
    examples: curated.examples || [],
    constraints: curated.constraints || [],
    hints: curated.hints || [],
    approach: curated.approach,
    complexity: curated.complexity,
    starterCode: curated.starterCode,
    solutionCode: curated.solutionCode,
    tests: (curated.tests || []).map((t, i) => ({
      index: i,
      name: t.name || `Case ${i + 1}`,
      input: t.input || '',
      expected: String(t.expected),
      locked: i >= 3 // first three cases are visible samples, the rest are hidden
    })),
    prerequisites: prerequisitesFor(curated.topics || [])
  };
}

/** "Learn this before you solve it" — chapters covering the problem's topics. */
function prerequisitesFor(topics) {
  return chaptersForTopics(topics).map((chapter) => ({
    chapterId: chapter.id,
    icon: chapter.icon,
    title: chapter.title,
    summary: chapter.summary,
    topics: (chapter.topics || []).filter((t) => topics.includes(t)).map((t) => TOPICS[t] ? TOPICS[t].label : t)
  }));
}

function companyQuestions(companySlug, period = 'all') {
  const file = path.join(COMPANY_DIR, companySlug, `${period}.csv`);
  const rows = parseCompanyCSV(fs.existsSync(file) ? file : path.join(COMPANY_DIR, companySlug, 'all.csv'));
  return rows.map((row) => {
    const q = decorateQuestion(row, companySlug);
    // list view: drop heavy fields
    return {
      id: q.id, number: q.number, title: q.title, difficulty: q.difficulty,
      topics: q.topics, guided: q.guided, frequency: q.frequency,
      acceptance: q.acceptance, leetcodeUrl: q.leetcodeUrl,
      companySlug: q.companySlug, companyName: q.companyName,
      testCount: q.tests ? q.tests.length : 0
    };
  });
}

/** Every curated problem, regardless of company — the "guided" practice set. */
function guidedQuestions() {
  return allProblems()
    .sort((a, b) => a.id - b.id)
    .map((p) => ({
      id: `lc-${p.id}`,
      number: p.id,
      title: p.title,
      difficulty: p.difficulty,
      topics: p.topics || [],
      guided: true,
      companies: p.companies || [],
      testCount: (p.tests || []).length
    }));
}

/** Full detail for one question id (`lc-<number>` or a raw number). */
function getQuestion(id, companySlug) {
  const number = String(id).replace(/^lc-/, '');
  const curated = getProblem(number);
  if (curated) {
    return decorateQuestion({
      id: number,
      title: curated.title,
      difficulty: curated.difficulty,
      url: `https://leetcode.com/problems/${curated.slug}/`,
      acceptance: '',
      frequency: ''
    }, companySlug);
  }

  // Not curated — recover the row from the company CSV so we still have a title.
  if (companySlug) {
    const rows = parseCompanyCSV(path.join(COMPANY_DIR, companySlug, 'all.csv'));
    const row = rows.find((r) => String(r.id) === number);
    if (row) return decorateQuestion(row, companySlug);
  }
  return null;
}

/** Curated questions that practise a topic — used by the tutor and chapters. */
function questionsForTopic(topic, limit = 8) {
  return allProblems()
    .filter((p) => (p.topics || []).includes(topic))
    .sort((a, b) => ({ Easy: 0, Medium: 1, Hard: 2 }[a.difficulty] - { Easy: 0, Medium: 1, Hard: 2 }[b.difficulty]))
    .slice(0, limit)
    .map((p) => ({ id: `lc-${p.id}`, number: p.id, title: p.title, difficulty: p.difficulty, topics: p.topics }));
}

function questionsForChapter(chapterId, limit = 12) {
  const chapter = CHAPTERS.find((c) => c.id === chapterId);
  if (!chapter) return [];
  const topics = new Set(chapter.topics || []);
  return allProblems()
    .filter((p) => (p.topics || []).some((t) => topics.has(t)))
    .sort((a, b) => ({ Easy: 0, Medium: 1, Hard: 2 }[a.difficulty] - { Easy: 0, Medium: 1, Hard: 2 }[b.difficulty]))
    .slice(0, limit)
    .map((p) => ({ id: `lc-${p.id}`, number: p.id, title: p.title, difficulty: p.difficulty, topics: p.topics }));
}

function stats() {
  const chapters = buildChapters();
  return {
    chapters: chapters.length,
    lessons: chapters.reduce((sum, c) => sum + c.lessons.length, 0),
    guidedProblems: allProblems().length,
    companies: listCompanies().length,
    companyQuestions: listCompanies().reduce((sum, c) => sum + c.questionCount, 0)
  };
}

module.exports = {
  buildChapters, chapterSummaries, getChapterDetail, getLesson,
  listCompanies, featuredCompanies, companyQuestions, guidedQuestions,
  getQuestion, questionsForTopic, questionsForChapter, prerequisitesFor,
  formatCompanyName, PERIODS, stats
};

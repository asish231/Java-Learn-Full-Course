#!/usr/bin/env node
/**
 * smoke.js — end-to-end sanity check for the studio.
 *
 *   node tools/smoke.js
 *
 * Checks, in order:
 *   1. every front-end module parses as an ES module,
 *   2. the catalog loads chapters, lessons, companies and guided problems,
 *   3. the judge accepts a correct submission and rejects a wrong one,
 *   4. the server boots and every important route answers.
 *
 * Exits non-zero when anything fails, so it is CI friendly.
 */
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = process.env.SMOKE_PORT || 3487;

let failures = 0;

function check(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✓ ${label}`);
  } else {
    failures++;
    console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

// ---------------------------------------------------------------------------

function checkFrontendSyntax() {
  console.log('\nFront-end modules');
  const files = walk(path.join(ROOT, 'public', 'js')).filter((f) => f.endsWith('.js'));
  for (const file of files) {
    // `--input-type=module` makes node parse the source as an ES module
    const result = spawnSync(process.execPath, ['--input-type=module', '--check'], {
      input: fs.readFileSync(file, 'utf8'),
      encoding: 'utf8'
    });
    const message = (result.stderr || '').split('\n').find((line) => /Error/.test(line)) || '';
    check(path.relative(ROOT, file), result.status === 0, message);
  }
}

function checkCatalog() {
  console.log('\nCatalog');
  const catalog = require('../lib/catalog');
  const stats = catalog.stats();
  check(`${stats.chapters} chapters`, stats.chapters > 0);
  check(`${stats.lessons} lessons`, stats.lessons > 0);
  check(`${stats.guidedProblems} guided problems`, stats.guidedProblems > 0);
  check(`${stats.companies} companies / ${stats.companyQuestions} questions`, stats.companies > 0);

  const question = catalog.getQuestion('lc-1');
  check('question #1 is fully specified',
    !!(question && question.statement && question.examples.length && question.tests.length && question.solutionCode));
  check('question #1 lists prerequisites', question.prerequisites.length > 0);
}

async function checkJudge() {
  console.log('\nJudge');
  const { runTests } = require('../lib/judge');
  const { getProblem } = require('../data/problem-bank');
  const problem = getProblem(1);

  const good = await runTests(problem.solutionCode, problem.tests, problem.testHelpers);
  check('reference solution is Accepted', good.status === 'Accepted', good.error);

  const wrong = 'class Solution { public int[] twoSum(int[] nums, int target) { return new int[]{0, 1}; } }';
  const bad = await runTests(wrong, problem.tests, problem.testHelpers);
  check('wrong solution is rejected with per-case detail',
    bad.status === 'Wrong Answer' && bad.results.some((r) => !r.passed && r.expected && r.actual));

  const broken = 'class Solution { public int[] twoSum(int[] nums, int target) { return oops; } }';
  const compileError = await runTests(broken, problem.tests, problem.testHelpers);
  check('compile errors are reported against Solution.java',
    compileError.status === 'Compilation Error' && /Solution\.java/.test(compileError.error || ''));
}

function get(url) {
  return fetch(url).then(async (res) => ({ status: res.status, body: await res.json() }));
}

async function waitForServer(url, attempts = 40) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch (_) { /* not up yet */ }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Server did not start in time');
}

async function checkServer() {
  console.log('\nServer routes');
  const server = spawn(process.execPath, [path.join(ROOT, 'server.js')], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'ignore'
  });

  try {
    await waitForServer(`http://localhost:${PORT}/api/bootstrap`);

    const boot = await get(`http://localhost:${PORT}/api/bootstrap`);
    check('GET /api/bootstrap', boot.status === 200 && boot.body.chapters.length > 0);

    const chapters = await get(`http://localhost:${PORT}/api/chapters`);
    check('GET /api/chapters', chapters.status === 200 && chapters.body.length > 0);

    const lesson = chapters.body[0].lessons[0];
    const lessonRes = await get(`http://localhost:${PORT}/api/lessons/${lesson.id}`);
    check(`GET /api/lessons/${lesson.id}`, lessonRes.status === 200 && !!lessonRes.body.code);

    const companies = await get(`http://localhost:${PORT}/api/companies?search=goo`);
    check('GET /api/companies?search=goo', companies.status === 200 && companies.body.companies.length > 0);

    const questions = await get(`http://localhost:${PORT}/api/companies/google/questions?period=thirty-days`);
    check('GET /api/companies/google/questions', questions.status === 200 && questions.body.questions.length > 0);

    const detail = await get(`http://localhost:${PORT}/api/questions/lc-1`);
    check('GET /api/questions/lc-1 hides the solution',
      detail.status === 200 && detail.body.hasSolution && detail.body.solutionCode === undefined);

    const plan = await get(`http://localhost:${PORT}/api/questions/lc-1/plan`);
    check('GET /api/questions/lc-1/plan', plan.status === 200 && plan.body.chapters.length > 0);

    const next = await get(`http://localhost:${PORT}/api/next-up`);
    check('GET /api/next-up', next.status === 200 && !!next.body.path);

    const tutor = await get(`http://localhost:${PORT}/api/tutor/status`);
    check(`GET /api/tutor/status (ready: ${tutor.body.ready})`, tutor.status === 200);
  } finally {
    server.kill();
  }
}

(async function main() {
  console.log('Java DSA Studio — smoke test');
  checkFrontendSyntax();
  checkCatalog();
  await checkJudge();
  await checkServer();

  console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
  process.exit(failures === 0 ? 0 : 1);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

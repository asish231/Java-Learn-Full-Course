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
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = process.env.SMOKE_PORT || 3487;
// The smoke server must never write into the learner's real progress file.
const SMOKE_STORE = path.join(os.tmpdir(), `dsa-studio-smoke-${process.pid}.json`);

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
  const { privateTestsFor } = require('../lib/assessment');
  const { getProblem } = require('../data/problem-bank');
  const problem = getProblem(1);
  const privateTests = privateTestsFor('lc-1');

  const good = await runTests(problem.solutionCode, [...problem.tests, ...privateTests], problem.testHelpers);
  check('reference solution passes public and generated private cases', good.status === 'Accepted', good.error);
  check('private results reveal no inputs or answers', good.results.filter((r) => r.hidden)
    .every((r) => !r.input && !r.expected && !r.actual));

  const wrong = 'class Solution { public int[] twoSum(int[] nums, int target) { return new int[]{0, 1}; } }';
  const bad = await runTests(wrong, [...problem.tests, ...privateTests], problem.testHelpers);
  check('targeted wrong solution is rejected by private coverage',
    bad.status === 'Wrong Answer' && bad.results.some((r) => r.hidden && !r.passed));

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
    env: { ...process.env, PORT: String(PORT), DSA_STORE_FILE: SMOKE_STORE },
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
    const learning = lessonRes.body.activeLearning;
    check('lesson includes active-learning checkpoints without answers', learning
      && learning.checkpoints.length > 0
      && learning.checkpoints.every((row) => row.answerIndex === undefined && row.explanation === undefined));

    const companies = await get(`http://localhost:${PORT}/api/companies?search=goo`);
    check('GET /api/companies?search=goo', companies.status === 200 && companies.body.companies.length > 0);

    const questions = await get(`http://localhost:${PORT}/api/companies/google/questions?period=thirty-days`);
    check('GET /api/companies/google/questions', questions.status === 200 && questions.body.questions.length > 0);

    const detail = await get(`http://localhost:${PORT}/api/questions/lc-1`);
    check('GET /api/questions/lc-1 hides the solution',
      detail.status === 200 && detail.body.hasSolution && detail.body.solutionCode === undefined);
    check('GET /api/questions/lc-1 keeps locked cases private',
      detail.body.tests.filter((t) => t.locked).every((t) => t.input === undefined && t.expected === undefined));

    const plan = await get(`http://localhost:${PORT}/api/questions/lc-1/plan`);
    check('GET /api/questions/lc-1/plan', plan.status === 200 && plan.body.chapters.length > 0);

    const next = await get(`http://localhost:${PORT}/api/next-up`);
    check('GET /api/next-up', next.status === 200 && !!next.body.path);

    const tutor = await get(`http://localhost:${PORT}/api/tutor/status`);
    check(`GET /api/tutor/status (ready: ${tutor.body.ready})`, tutor.status === 200);

    const post = async (url, body) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      return { status: res.status, body: await res.json() };
    };

    if (learning && learning.checkpoints.length) {
      const checkpoint = await post(
        `http://localhost:${PORT}/api/lessons/${lesson.id}/checkpoints/${learning.checkpoints[0].id}`,
        { answerIndex: 0 });
      check('POST lesson checkpoint returns grounded feedback', checkpoint.status === 200
        && checkpoint.body.correct === true && typeof checkpoint.body.explanation === 'string');
      const lessonAfter = await get(`http://localhost:${PORT}/api/progress`);
      check('retrieval checkpoint is not a solved lesson',
        (lessonAfter.body.progress.lessons[lesson.id] || {}).status !== 'completed');
    }

    const shortReflection = await post(`http://localhost:${PORT}/api/lessons/${lesson.id}/reflection`, { text: 'short' });
    check('reflection rejects content without learning value', shortReflection.status === 400);
    const reflection = await post(`http://localhost:${PORT}/api/lessons/${lesson.id}/reflection`, {
      text: 'I would explain the invariant first, then trace one edge case.'
    });
    check('POST lesson reflection persists', reflection.status === 200 && reflection.body.reflection.text.includes('invariant'));

    const ev = await post(`http://localhost:${PORT}/api/events`, {
      events: [{ type: 'open_lesson', payload: { lessonId: 'smoke-test' } }]
    });
    check('POST /api/events', ev.status === 200 && ev.body.accepted >= 1);

    await post(`http://localhost:${PORT}/api/events`, {
      events: [{ type: 'code_activity', payload: { problemId: 'lc-206', activeMs: 60000, idleMs: 20000, keystrokes: 40 } }]
    });
    const logged = await get(`http://localhost:${PORT}/api/events?type=code_activity&limit=5`);
    check('POST /api/events resolves topics server-side',
      logged.status === 200 && (logged.body.events.at(-1).payload.topics || []).includes('linked-list'));

    const insights = await get(`http://localhost:${PORT}/api/insights`);
    check('GET /api/insights returns company readiness', insights.status === 200
      && insights.body.formulaVersion && Array.isArray(insights.body.companyReadiness));

    const diagnostics = await get(`http://localhost:${PORT}/api/diagnostics`);
    check('GET /api/diagnostics uses retrieval evidence without inventing coding attempts',
      diagnostics.status === 200 && diagnostics.body.topics.length > 0
      && diagnostics.body.topics.every((topic) => topic.evidence.attempts === 0));

    const diagnostic = await post(`http://localhost:${PORT}/api/diagnostics`, { count: 6 });
    check('POST /api/diagnostics builds a balanced deterministic test', diagnostic.status === 200
      && diagnostic.body.items.length === 6 && diagnostic.body.blueprint.selected === 6);

    const revisionPlan = await get(`http://localhost:${PORT}/api/revision-plan?days=7`);
    check('GET /api/revision-plan returns seven days grounded in recorded evidence', revisionPlan.status === 200
      && revisionPlan.body.days.length === 7 && revisionPlan.body.evidenceTopics === diagnostics.body.topics.length);

    const graph = await get(`http://localhost:${PORT}/api/graph`);
    check('GET /api/graph', graph.status === 200 && Array.isArray(graph.body.nodes));

    const revise = await get(`http://localhost:${PORT}/api/revise`);
    check('GET /api/revise', revise.status === 200 && Array.isArray(revise.body.dueTopics));

    const goals = await get(`http://localhost:${PORT}/api/goals/today`);
    check('GET /api/goals/today', goals.status === 200 && Array.isArray(goals.body.items));

    const records = await get(`http://localhost:${PORT}/api/records`);
    check('GET /api/records', records.status === 200);

    const placementEmpty = await get(`http://localhost:${PORT}/api/placement`);
    check('GET /api/placement has no seeded hiring prediction', placementEmpty.status === 200
      && placementEmpty.body.empty === true && placementEmpty.body.calibration.hiringProbability === null);
    const invalidEvidence = await post(`http://localhost:${PORT}/api/placement/evidence`, {
      trackId: 'system-design', itemId: 'not-real', rating: 5
    });
    check('POST /api/placement/evidence validates rubric inputs', invalidEvidence.status === 400);
    const evidence = await post(`http://localhost:${PORT}/api/placement/evidence`, {
      trackId: 'system-design', itemId: 'api-data-model', rating: 3, note: 'Smoke evidence'
    });
    check('POST /api/placement/evidence records a real track item', evidence.status === 201 && evidence.body.trackId === 'system-design');
    const simulation = await post(`http://localhost:${PORT}/api/placement/simulations`, {
      scores: { problemFraming: 4, technicalDepth: 3, structure: 2, evidence: 4, reflection: 3 }
    });
    check('POST /api/placement/simulations scores the complete rubric', simulation.status === 201 && simulation.body.score === 80);
    const placementAfter = await get(`http://localhost:${PORT}/api/placement`);
    check('placement dashboard derives progress from evidence only', placementAfter.body.tracks
      .find((track) => track.id === 'system-design').percent === 20);

    const exported = await get(`http://localhost:${PORT}/api/data/export`);
    check('GET /api/data/export is checksummed', exported.status === 200
      && exported.body.format === 'java-dsa-studio-export' && exported.body.checksum.length === 64);
    const tampered = structuredClone(exported.body);
    tampered.data.profile.name = 'tampered';
    const rejectedImport = await post(`http://localhost:${PORT}/api/data/import`, tampered);
    check('POST /api/data/import rejects tampering', rejectedImport.status === 400
      && rejectedImport.body.code === 'INVALID_EXPORT');
    const imported = await post(`http://localhost:${PORT}/api/data/import`, exported.body);
    check('POST /api/data/import accepts valid backup', imported.status === 200 && imported.body.imported === true);
    const storage = await get(`http://localhost:${PORT}/api/data/health`);
    check('GET /api/data/health reports atomic backups', storage.status === 200
      && storage.body.atomicWrites === true && storage.body.backups >= 1);

    const counsel = await get(`http://localhost:${PORT}/api/counsel/next`);
    check('GET /api/counsel/next', counsel.status === 200 && typeof counsel.body.readinessBlurb === 'string');

    const mockStart = await post(`http://localhost:${PORT}/api/mocks`, {
      count: 1, minutes: 10, strict: true, purpose: 'diagnostic'
    });
    check('POST /api/mocks persists its diagnostic blueprint', mockStart.status === 200
      && mockStart.body.id && mockStart.body.purpose === 'diagnostic' && mockStart.body.blueprint.selected === 1);

    if (mockStart.body.id) {
      const live = await get(`http://localhost:${PORT}/api/mocks/${mockStart.body.id}`);
      check('GET /api/mocks/:id reports the exam clock', live.status === 200 && live.body.remainingMs > 0);

      const finished = await post(`http://localhost:${PORT}/api/mocks/${mockStart.body.id}/finish`, {});
      check('POST /api/mocks/:id/finish', finished.status === 200 && typeof finished.body.score === 'number');

      const again = await post(`http://localhost:${PORT}/api/mocks/${mockStart.body.id}/finish`, {});
      check('finishing twice is idempotent', again.status === 200 && again.body.score === finished.body.score);

      const late = await post(`http://localhost:${PORT}/api/mocks/${mockStart.body.id}/answer`,
        { problemId: mockStart.body.itemIds[0], code: 'class Solution {}' });
      check('answering a finished mock is refused', late.status === 400);

      const active = await get(`http://localhost:${PORT}/api/mocks/active`);
      check('GET /api/mocks/active is empty once scored', active.status === 200 && active.body.mock === null);
    }

    // ai:false keeps the smoke run offline (and free) even with a Mercury key set.
    const session = await post(`http://localhost:${PORT}/api/sessions/end`, {
      context: { lessonId: 'smoke-test' },
      outcomes: { status: 'smoke' },
      ai: false
    });
    check('POST /api/sessions/end', session.status === 200 && session.body.note);
  } finally {
    server.kill();
    try {
      fs.unlinkSync(SMOKE_STORE);
    } catch { /* the scratch store may not exist */ }
    fs.rmSync(`${SMOKE_STORE}.backups`, { recursive: true, force: true });
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

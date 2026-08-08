/**
 * mock.js — timed practice tests from guided bank + weak/expiring topics.
 * "Mock" = exam session, not fake data. Scoring uses the real Java judge.
 */
const store = require('./store');
const catalog = require('./catalog');
const judge = require('./judge');
const srs = require('./srs');
const analytics = require('./analytics');
const assessment = require('./assessment');

function pickItems({ count = 3, topicSlugs = [], strict = true, purpose = 'practice' } = {}) {
  if (purpose === 'diagnostic') {
    return assessment.buildDiagnostic({ count, topicSlugs }).items;
  }
  let guided = [];
  try {
    guided = catalog.guidedQuestions() || [];
  } catch {
    guided = [];
  }

  const revise = srs.reviseQueue({ limit: 50 });
  const prefer = new Set([
    ...topicSlugs,
    ...revise.dueTopics.map((t) => t.slug)
  ]);

  const scored = guided.map((q) => {
    const tops = q.topics || [];
    const hit = tops.some((t) => prefer.has(t)) ? 2 : 0;
    const weakBoost = tops.reduce((s, t) => {
      const row = store.getTopics()[t];
      if (row && row.mastery < 0.5) return s + 1;
      return s;
    }, 0);
    return { q, score: hit + weakBoost };
  });

  scored.sort((a, b) => b.score - a.score || Number(a.q.number) - Number(b.q.number));
  let picked = scored.slice(0, Math.max(1, Math.min(count, guided.length))).map((x) => x.q);

  // Fallback: any guided if learner has no signal yet
  if (!picked.length && guided.length) {
    picked = guided.slice(0, Math.min(count, guided.length));
  }

  return picked.map((q) => ({
    id: q.id,
    title: q.title,
    difficulty: q.difficulty,
    topics: q.topics || [],
    testCount: q.testCount || 0
  }));
}

function startMock({ count = 3, minutes = 45, strict = true, topicSlugs = [], purpose = 'practice' } = {}) {
  const items = pickItems({ count, topicSlugs, strict, purpose });
  if (!items.length) {
    const err = new Error('No guided problems available to build a mock test yet.');
    err.code = 'EMPTY_BANK';
    throw err;
  }
  const id = store.newId('mock');
  const startedAt = new Date();
  const endsAt = new Date(startedAt.getTime() + minutes * 60000);
  const difficulties = {};
  const blueprintTopics = new Set();
  for (const item of items) {
    difficulties[item.difficulty] = (difficulties[item.difficulty] || 0) + 1;
    for (const slug of item.topics || []) blueprintTopics.add(slug);
  }
  const mock = {
    id,
    startedAt: startedAt.toISOString(),
    endsAt: endsAt.toISOString(),
    mode: 'timed',
    purpose: purpose === 'diagnostic' ? 'diagnostic' : 'practice',
    strict: !!strict,
    itemIds: items.map((i) => i.id),
    items,
    results: {},
    score: null,
    status: 'active',
    blueprint: {
      version: '1.0.0',
      selected: items.length,
      itemIds: items.map((item) => item.id),
      difficulties,
      topics: [...blueprintTopics].sort()
    }
  };
  store.saveMock(mock);
  store.appendEvents([{ type: 'mock_start', payload: { mockId: id, count: items.length, strict, purpose: mock.purpose } }]);
  return mock;
}

/** Milliseconds left on the exam clock (0 once the deadline passed). */
function remainingMs(mock) {
  if (!mock || !mock.endsAt) return 0;
  const ends = Date.parse(mock.endsAt);
  if (!Number.isFinite(ends)) return 0;
  return Math.max(0, ends - Date.now());
}

function isExpired(mock) {
  return !!mock && mock.status === 'active' && remainingMs(mock) === 0;
}

/** Auto-submit a session whose clock ran out. Returns the finished mock or null. */
function expireIfDue(mock) {
  if (!isExpired(mock)) return null;
  return finishMock(mock.id, { reason: 'timeout' });
}

async function answerMock(mockId, { problemId, code }) {
  const mock = store.getMock(mockId);
  if (!mock) {
    const err = new Error('Mock not found');
    err.code = 'NOT_FOUND';
    throw err;
  }
  if (expireIfDue(mock)) {
    const err = new Error('Time is up — this timed test was submitted automatically.');
    err.code = 'EXPIRED';
    throw err;
  }
  if (mock.status !== 'active') {
    const err = new Error('Mock is already finished');
    err.code = 'FINISHED';
    throw err;
  }
  if (!mock.itemIds.includes(problemId)) {
    const err = new Error('Problem not part of this mock');
    err.code = 'BAD_ITEM';
    throw err;
  }

  const question = catalog.getQuestion(problemId);
  if (!question || !question.guided) {
    const err = new Error('Guided problem required for mock grading');
    err.code = 'NOT_GUIDED';
    throw err;
  }

  const bank = require('../data/problem-bank').getProblem(question.number);
  const publicTests = (bank && bank.tests) || question.tests || [];
  const tests = [...publicTests, ...assessment.privateTestsFor(question.id)];
  const helpers = (bank && bank.testHelpers) || question.testHelpers;
  const result = await judge.runTests(code || question.starterCode || '', tests, helpers);
  const passed = result.passed || 0;
  const total = result.total || 0;
  const ok = result.status === 'Accepted' || (total > 0 && passed === total);

  mock.results[problemId] = {
    passed,
    total,
    status: result.status,
    ok,
    at: new Date().toISOString()
  };
  store.saveMock(mock);

  const itemRow = (mock.items || []).find((i) => i.id === problemId) || {};
  const topics = question.topics || itemRow.topics || [];
  store.recordAttempt(problemId, {
    passed,
    total,
    status: ok ? 'Accepted' : (result.status || 'Wrong Answer'),
    code: code || '',
    elapsedMs: result.elapsedMs || 0,
    topics
  });
  srs.applyProblemResult(topics, { solved: ok });

  store.appendEvents([{
    type: 'mock_answer',
    payload: { mockId, problemId, ok, passed, total }
  }]);

  // Answering the last item ends the session immediately, like a real exam.
  const answeredAll = mock.itemIds.every((id) => mock.results[id]);
  const finished = answeredAll ? finishMock(mockId) : mock;

  return { mock: finished, result, remainingMs: remainingMs(finished) };
}

function finishMock(mockId, { reason = 'submitted' } = {}) {
  const mock = store.getMock(mockId);
  if (!mock) {
    const err = new Error('Mock not found');
    err.code = 'NOT_FOUND';
    throw err;
  }
  // Idempotent: finishing twice must not double-count XP or personal records.
  if (mock.status === 'finished') return mock;

  const total = mock.itemIds.length || 1;
  let correct = 0;
  for (const id of mock.itemIds) {
    if (mock.results[id] && mock.results[id].ok) correct += 1;
  }
  const score = Math.round((correct / total) * 100);
  mock.score = score;
  mock.status = 'finished';
  mock.finishedAt = new Date().toISOString();
  mock.finishReason = reason;
  store.saveMock(mock);
  store.updateBestMock(score);
  store.appendEvents([{ type: 'mock_finish', payload: { mockId, score, correct, total, reason } }]);
  store.invalidateInsights();
  analytics.computeInsights({ useCache: false });
  return mock;
}

/**
 * The session still on the clock. Never mutates the stored order, and sweeps
 * away sessions whose timer expired while the app was closed.
 */
function getActiveMock() {
  const mocks = store.getMocks();
  for (let i = mocks.length - 1; i >= 0; i--) {
    const mock = mocks[i];
    if (mock.status !== 'active') continue;
    if (expireIfDue(mock)) continue;
    return { ...mock, remainingMs: remainingMs(mock) };
  }
  return null;
}

module.exports = {
  pickItems,
  startMock,
  answerMock,
  finishMock,
  getActiveMock,
  remainingMs,
  expireIfDue
};

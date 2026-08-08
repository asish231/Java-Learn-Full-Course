/**
 * assessment.js — deterministic diagnostics and evidence-backed revision plans.
 * Scores come only from the learner's store; catalog content supplies questions,
 * never progress. Private generated cases stay server-side.
 */
const store = require('./store');
const catalog = require('./catalog');
const analytics = require('./analytics');
const { TOPICS } = require('../data/curriculum');

const DIFFICULTY_ORDER = { Easy: 0, Medium: 1, Hard: 2 };

function stableQuestions(topicSlugs = []) {
  const wanted = new Set(topicSlugs.filter(Boolean));
  let questions = catalog.guidedQuestions() || [];
  if (wanted.size) {
    const matching = questions.filter((q) => (q.topics || []).some((t) => wanted.has(t)));
    if (matching.length) questions = matching;
  }
  return [...questions].sort((a, b) => {
    const diff = (DIFFICULTY_ORDER[a.difficulty] ?? 9) - (DIFFICULTY_ORDER[b.difficulty] ?? 9);
    return diff || Number(a.number) - Number(b.number);
  });
}

function buildDiagnostic({ count = 6, topicSlugs = [] } = {}) {
  const limit = Math.max(1, Math.min(20, Number(count) || 6));
  const questions = stableQuestions(topicSlugs);
  const buckets = ['Easy', 'Medium', 'Hard'].map((difficulty) =>
    questions.filter((q) => q.difficulty === difficulty));
  const items = [];

  while (items.length < limit && buckets.some((bucket) => bucket.length)) {
    for (const bucket of buckets) {
      if (bucket.length && items.length < limit) items.push(bucket.shift());
    }
  }

  const compact = items.map((q) => ({
    id: q.id,
    number: q.number,
    title: q.title,
    difficulty: q.difficulty,
    topics: q.topics || [],
    testCount: q.testCount || 0
  }));
  const difficulties = {};
  const topics = new Set();
  for (const item of compact) {
    difficulties[item.difficulty] = (difficulties[item.difficulty] || 0) + 1;
    for (const slug of item.topics) topics.add(slug);
  }

  return {
    kind: 'topic-diagnostic',
    items: compact,
    blueprint: { requested: limit, selected: compact.length, difficulties, topics: [...topics].sort() }
  };
}

function readinessLabel(mastery, attempts, passes) {
  if (!attempts) return 'Needs evidence';
  if (!passes || mastery < 0.35) return 'Foundation';
  if (mastery < 0.65 || attempts < 3) return 'Developing';
  return 'Topic ready';
}

function topicDiagnostics() {
  const rows = store.getTopics();
  const events = store.getEvents({ limit: 2000 });
  const topics = Object.entries(rows)
    .filter(([, row]) => row.attempts || row.mastery || row.lastSeenAt)
    .map(([slug, row]) => {
      const score = analytics.topicFeatures(slug, row, events);
      const attempts = Number(row.attempts) || 0;
      const passes = Number(row.passes) || 0;
      const evidence = {
        attempts,
        passes,
        accuracy: attempts ? Math.round((passes / attempts) * 100) : null,
        tutorAssists: Number(row.tutorAssists) || 0,
        activeCodingMeasured: !!score.features.activeCodingMeasured,
        lastSeenAt: row.lastSeenAt || null,
        nextReviewAt: row.nextReviewAt || null
      };
      return {
        slug,
        label: readinessLabel(score.mastery, attempts, passes),
        topic: (TOPICS[slug] && TOPICS[slug].label) || slug,
        readiness: score.mastery,
        percent: Math.round(score.mastery * 100),
        confidence: attempts >= 5 ? 'high' : attempts >= 2 ? 'medium' : 'low',
        evidence,
        explain: score.explain
      };
    })
    .sort((a, b) => a.readiness - b.readiness || a.slug.localeCompare(b.slug));
  return { empty: topics.length === 0, topics };
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function revisionPlan({ days = 7, now = new Date() } = {}) {
  const dayCount = Math.max(1, Math.min(14, Number(days) || 7));
  const diagnostics = topicDiagnostics().topics;
  const guided = stableQuestions();
  const planDays = Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(now.getTime() + index * 86400000);
    return { date: isoDate(date), focus: index === dayCount - 1 ? 'retest' : 'practice', items: [] };
  });

  diagnostics.forEach((topic, index) => {
    const question = guided.find((q) => (q.topics || []).includes(topic.slug));
    if (!question) return;
    const firstDay = index % Math.max(1, dayCount - 1);
    planDays[firstDay].items.push({
      kind: topic.evidence.nextReviewAt && Date.parse(topic.evidence.nextReviewAt) <= now.getTime() ? 'review' : 'practice',
      topicSlug: topic.slug,
      topic: topic.topic,
      problemId: question.id,
      title: question.title,
      reason: `${topic.label}: ${topic.evidence.attempts} attempt${topic.evidence.attempts === 1 ? '' : 's'}, ${topic.evidence.accuracy == null ? 'no graded accuracy' : topic.evidence.accuracy + '% accuracy'}`
    });
    if (dayCount > 1) {
      planDays[dayCount - 1].items.push({
        kind: 'retest', topicSlug: topic.slug, topic: topic.topic,
        problemId: question.id, title: question.title,
        reason: 'Retest after spaced practice without tutor help.'
      });
    }
  });

  return {
    generatedFor: isoDate(now),
    empty: diagnostics.length === 0,
    evidenceTopics: diagnostics.length,
    days: planDays
  };
}

const PRIVATE_GENERATORS = {
  'lc-1': () => [
    { expr: 'Arrays.toString(sol.twoSum(new int[]{3, 3}, 6))', expected: '[0, 1]' },
    { expr: 'Arrays.toString(sol.twoSum(new int[]{-8, 4, 11, -3}, 3))', expected: '[0, 2]' }
  ],
  'lc-53': () => [
    { expr: 'sol.maxSubArray(new int[]{-8, -3, -6, -2, -5, -4})', expected: '-2' },
    { expr: 'sol.maxSubArray(new int[]{5, -9, 6, 7, -2})', expected: '13' }
  ],
  'lc-121': () => [
    { expr: 'sol.maxProfit(new int[]{9, 7, 4, 3, 1})', expected: '0' },
    { expr: 'sol.maxProfit(new int[]{8, 1, 2, 10})', expected: '9' }
  ],
  'lc-125': () => [
    { expr: 'sol.isPalindrome(".,")', expected: 'true' },
    { expr: 'sol.isPalindrome("0P")', expected: 'false' }
  ],
  'lc-206': () => [
    { expr: 'listToString(sol.reverseList(buildList(9, -1, 9, 0)))', expected: '[0, 9, -1, 9]' },
    { expr: 'listToString(sol.reverseList(buildList(42)))', expected: '[42]' }
  ],
  'lc-704': () => [
    { expr: 'sol.search(new int[]{-10, -2, 0, 7, 99}, -10)', expected: '0' },
    { expr: 'sol.search(new int[]{-10, -2, 0, 7, 99}, 8)', expected: '-1' }
  ]
};

function privateTestsFor(problemId) {
  const id = String(problemId).startsWith('lc-') ? String(problemId) : `lc-${problemId}`;
  const generate = PRIVATE_GENERATORS[id];
  if (!generate) return [];
  return generate().map((test, index) => ({
    ...test,
    name: `Private generated case ${index + 1}`,
    input: '',
    private: true
  }));
}

module.exports = {
  buildDiagnostic,
  topicDiagnostics,
  revisionPlan,
  privateTestsFor,
  readinessLabel
};
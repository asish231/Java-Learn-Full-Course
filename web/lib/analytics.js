/**
 * analytics.js — explainable feature engine (Learning OS).
 * Scores mastery and company fit only from this learner's real events/progress.
 * Formula version is bumped when weights change; never seeds fake history.
 */
const store = require('./store');
const catalog = require('./catalog');
const { TOPICS, CHAPTERS } = require('../data/curriculum');

const FORMULA_VERSION = '1.1.0';
const CACHE_TTL_MS = 5 * 60_000;

const WEIGHTS = {
  accuracy: 1.4,
  recency: 1.1,
  logAttempts: -0.35,
  tutorRatio: -0.55,
  consistency: 0.45,
  difficultySolve: 0.6,
  intercept: -0.2
};

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

function daysSince(iso) {
  if (!iso) return 999;
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return 999;
  return Math.max(0, (Date.now() - t) / 86400000);
}

function topicFeatures(slug, topicRow, events) {
  const attempts = topicRow.attempts || 0;
  const passes = topicRow.passes || 0;
  const accuracy = attempts ? passes / attempts : 0;
  const tutorAssists = topicRow.tutorAssists || 0;
  const tutorRatio = attempts ? tutorAssists / Math.max(attempts, 1) : (tutorAssists > 0 ? 1 : 0);
  const recencyDays = daysSince(topicRow.lastSeenAt);
  const recencyHalflife = Math.exp(-recencyDays / Math.max(1, topicRow.stabilityDays || 3));
  const logAttempts = Math.log1p(attempts);
  const avgAttempts = topicRow.avgAttempts || attempts || 0;

  const topicEvents = events.filter((e) => {
    const p = e.payload || {};
    const tops = p.topics || [];
    return tops.includes(slug) || p.topicSlug === slug;
  });
  const thrash = topicEvents.filter((e) => e.type === 'run' || e.type === 'submit_fail').length;

  // Real typing-vs-idle time when the editor reported it; otherwise fall back
  // to a thrash-based proxy so the factor stays explainable either way.
  const activeMs = Number(topicRow.activeMs) || 0;
  const idleMs = Number(topicRow.idleMs) || 0;
  const measuredMs = activeMs + idleMs;
  const activeCodingRatio = measuredMs > 0
    ? clamp01(activeMs / measuredMs)
    : (attempts ? clamp01(1 - Math.min(1, thrash / 20)) : 0);

  const z =
    WEIGHTS.intercept +
    WEIGHTS.accuracy * accuracy +
    WEIGHTS.recency * recencyHalflife +
    WEIGHTS.logAttempts * (logAttempts / 5) +
    WEIGHTS.tutorRatio * tutorRatio +
    WEIGHTS.consistency * activeCodingRatio +
    WEIGHTS.difficultySolve * (topicRow.mastery || 0) * 0.3;

  const modelMastery = attempts || topicRow.mastery ? sigmoid(z) : 0;
  const mastery = clamp01(0.55 * (topicRow.mastery || 0) + 0.45 * modelMastery);

  return {
    slug,
    label: (TOPICS[slug] && TOPICS[slug].label) || slug,
    chapter: (TOPICS[slug] && TOPICS[slug].chapter) || null,
    mastery,
    features: {
      accuracy: round4(accuracy),
      logAttempts: round4(logAttempts),
      recencyHalflife: round4(recencyHalflife),
      tutorRatio: round4(tutorRatio),
      activeCodingRatio: round4(activeCodingRatio),
      activeCodingMeasured: measuredMs > 0,
      activeMs,
      idleMs,
      avgAttempts: round4(avgAttempts),
      attempts,
      passes,
      tutorAssists,
      lastSeenAt: topicRow.lastSeenAt,
      nextReviewAt: topicRow.nextReviewAt,
      stabilityDays: topicRow.stabilityDays || 1
    },
    explain: [
      { factor: 'accuracy', weight: WEIGHTS.accuracy, value: round4(accuracy) },
      { factor: 'recency', weight: WEIGHTS.recency, value: round4(recencyHalflife) },
      { factor: 'tutor dependence', weight: WEIGHTS.tutorRatio, value: round4(tutorRatio) },
      { factor: 'active coding', weight: WEIGHTS.consistency, value: round4(activeCodingRatio) }
    ]
  };
}

function round4(n) {
  return Math.round(n * 10000) / 10000;
}

function codingPatterns(events) {
  const runs = events.filter((e) => e.type === 'run' || e.type === 'submit_fail' || e.type === 'submit_pass');
  const fails = events.filter((e) => e.type === 'submit_fail').length;
  const passes = events.filter((e) => e.type === 'submit_pass').length;
  const tutor = events.filter((e) => e.type === 'tutor_msg').length;
  const focusEvents = events.filter((e) => e.type === 'focus_ms');
  const focusMs = focusEvents.reduce((s, e) => s + (Number(e.payload.ms) || 0), 0);
  const activity = events.filter((e) => e.type === 'code_activity');
  const activeMs = activity.reduce((s, e) => s + (Number(e.payload.activeMs) || 0), 0);
  const idleMs = activity.reduce((s, e) => s + (Number(e.payload.idleMs) || 0), 0);
  const thrashRuns = runs.length >= 8 && fails > passes * 2;
  const patterns = [];
  if (thrashRuns) {
    patterns.push({
      id: 'thrash_runs',
      severity: 'warn',
      title: 'Run thrash',
      detail: 'Many failed submits relative to passes — slow down and trace before re-running.'
    });
  }
  if (tutor > 10 && passes < 3) {
    patterns.push({
      id: 'tutor_heavy',
      severity: 'info',
      title: 'High tutor use',
      detail: 'You lean on the tutor more than independent solves. Try one unaided attempt first.'
    });
  }
  if (focusMs > 0 && focusMs < 5 * 60000 && runs.length > 5) {
    patterns.push({
      id: 'short_focus',
      severity: 'info',
      title: 'Short focus bursts',
      detail: 'Lots of activity in short windows — longer deep-work blocks may help retention.'
    });
  }
  if (activeMs + idleMs > 10 * 60000 && idleMs > (activeMs + idleMs) * 0.7) {
    patterns.push({
      id: 'idle_heavy',
      severity: 'info',
      title: 'Long idle stretches',
      detail: `Only ${Math.round((activeMs / (activeMs + idleMs)) * 100)}% of your editor time was active typing — read the problem, then code in one focused pass.`
    });
  }
  if (!patterns.length && (passes > 0 || runs.length > 0)) {
    patterns.push({
      id: 'steady',
      severity: 'ok',
      title: 'Steady practice',
      detail: 'No strong anti-patterns detected from your recent log.'
    });
  }
  return patterns;
}

function companyReadinessList(topicScores) {
  const bySlug = Object.fromEntries(topicScores.map((t) => [t.slug, t]));
  const featured = catalog.featuredCompanies() || [];
  let companies = [];
  try {
    companies = (catalog.listCompanies() || []).slice(0, 40);
  } catch {
    companies = featured.slice(0, 40);
  }
  if (!companies.length) companies = featured.slice(0, 40);
  const fits = [];

  for (const co of companies) {
    const slug = co.id || co.slug;
    let questions = [];
    try {
      questions = catalog.companyQuestions(slug, 'all') || [];
    } catch {
      questions = [];
    }
    const guided = questions.filter((q) => q.guided);
    const topicHits = {};
    for (const q of guided) {
      for (const t of q.topics || []) {
        topicHits[t] = (topicHits[t] || 0) + 1;
      }
    }
    const topTopics = Object.entries(topicHits)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([t]) => t);

    let masterySum = 0;
    let w = 0;
    for (const t of topTopics) {
      const row = bySlug[t];
      if (!row) continue;
      masterySum += row.mastery;
      w += 1;
    }
    const avgMastery = w ? masterySum / w : 0;
    const coverage = questions.length ? guided.length / Math.min(questions.length, 80) : 0;
    const recentMocks = store.getMocks().filter((m) => m.score != null).slice(-3);
    const mockFactor = recentMocks.length
      ? recentMocks.reduce((s, m) => s + (m.score || 0), 0) / (recentMocks.length * 100)
      : null;

    const assessedTopics = topTopics.filter((t) => bySlug[t] && bySlug[t].features.attempts > 0);
    const totalAttempts = assessedTopics.reduce((sum, t) => sum + (bySlug[t] ? bySlug[t].features.attempts : 0), 0);

    const hasSufficientEvidence = assessedTopics.length > 0 && totalAttempts >= 3;
    const rawReadiness = clamp01(avgMastery * (0.55 + 0.45 * clamp01(coverage)) * (mockFactor == null ? 0.7 : 0.7 + 0.3 * mockFactor));
    const readiness = hasSufficientEvidence ? rawReadiness : 0;
    const label = !hasSufficientEvidence ? 'Needs evidence'
      : readiness < 0.35 ? 'Foundation'
        : readiness < 0.65 ? 'Developing' : 'Topic ready';
    fits.push({
      company: slug,
      name: co.name || slug,
      readiness: round4(readiness),
      fit: round4(readiness),
      percent: Math.round(readiness * 100),
      label,
      confidence: hasSufficientEvidence && assessedTopics.length >= 5 && recentMocks.length ? 'high' : hasSufficientEvidence && assessedTopics.length >= 2 ? 'medium' : 'low',
      guidedCount: guided.length,
      questionCount: questions.length || co.questionCount || 0,
      topTopics,
      coverage: { representedTopics: topTopics.length, assessedTopics: assessedTopics.length },
      evidence: assessedTopics.map((slug) => ({
        topicSlug: slug,
        attempts: bySlug[slug].features.attempts,
        mastery: bySlug[slug].mastery,
        lastSeenAt: bySlug[slug].features.lastSeenAt || null
      })),
      limitations: recentMocks.length ? [] : ['No recent timed assessment'],
      explain: [
        { factor: 'topic mastery', value: round4(avgMastery) },
        { factor: 'guided coverage', value: round4(coverage) },
        { factor: 'recent timed assessments', value: mockFactor == null ? null : round4(mockFactor) }
      ]
    });
  }

  fits.sort((a, b) => b.fit - a.fit);
  return fits;
}

function buildGraph() {
  const topics = store.getTopics();
  const nodes = [];
  const edges = [];
  const seenEdge = new Set();

  for (const [slug, meta] of Object.entries(TOPICS)) {
    const row = topics[slug] || {};
    nodes.push({
      id: `topic:${slug}`,
      kind: 'topic',
      slug,
      label: meta.label,
      mastery: row.mastery || 0,
      chapter: meta.chapter
    });
    if (meta.chapter) {
      const eid = `ch:${meta.chapter}->topic:${slug}`;
      if (!seenEdge.has(eid)) {
        seenEdge.add(eid);
        edges.push({ id: eid, from: `chapter:${meta.chapter}`, to: `topic:${slug}`, kind: 'teaches' });
      }
    }
  }

  for (const ch of CHAPTERS) {
    nodes.push({
      id: `chapter:${ch.id}`,
      kind: 'chapter',
      slug: ch.id,
      label: ch.title,
      icon: ch.icon
    });
    for (const pre of ch.prerequisites || []) {
      const eid = `pre:${pre}->${ch.id}`;
      if (!seenEdge.has(eid)) {
        seenEdge.add(eid);
        edges.push({ id: eid, from: `chapter:${pre}`, to: `chapter:${ch.id}`, kind: 'prereq' });
      }
    }
  }

  // Co-practice: problems sharing topics (sample guided bank)
  let guided = [];
  try {
    guided = catalog.guidedQuestions() || [];
  } catch {
    guided = [];
  }
  for (const q of guided.slice(0, 80)) {
    const tops = q.topics || [];
    for (let i = 0; i < tops.length; i++) {
      for (let j = i + 1; j < tops.length; j++) {
        const a = tops[i];
        const b = tops[j];
        const eid = `co:${[a, b].sort().join('|')}`;
        if (seenEdge.has(eid)) continue;
        seenEdge.add(eid);
        edges.push({ id: eid, from: `topic:${a}`, to: `topic:${b}`, kind: 'co-practice' });
      }
    }
  }

  return { nodes, edges, updatedAt: new Date().toISOString() };
}

function computeInsights({ useCache = true } = {}) {
  const rev = store.analyticsRev();
  if (useCache) {
    const cached = store.getInsightsCache();
    // The cached snapshot is valid until the learner does something new.
    if (cached && cached.rev === rev && cached.at && Date.now() - Date.parse(cached.at) < CACHE_TTL_MS) {
      return cached;
    }
  }

  const topicsMap = store.getTopics();
  const events = store.getEvents({ limit: 2000 });
  const topicScores = Object.keys({ ...TOPICS, ...topicsMap }).map((slug) =>
    topicFeatures(slug, topicsMap[slug] || {}, events)
  ).filter((t) => (topicsMap[t.slug] && (topicsMap[t.slug].attempts || topicsMap[t.slug].mastery || topicsMap[t.slug].lastSeenAt))
    || t.features.attempts > 0
    || t.mastery > 0);

  // Include only topics with signal for strengths/focus; empty learner → empty lists
  const ranked = [...topicScores].sort((a, b) => b.mastery - a.mastery);
  const strengths = ranked.filter((t) => t.mastery >= 0.55).slice(0, 8);
  const focus = [...topicScores].sort((a, b) => a.mastery - b.mastery)
    .filter((t) => t.features.attempts > 0 || (t.features.nextReviewAt && Date.parse(t.features.nextReviewAt) <= Date.now()))
    .slice(0, 8);

  const companyReadiness = companyReadinessList(topicScores);
  const patterns = codingPatterns(events);
  const graph = buildGraph();
  const summary = store.summary();
  const records = store.getRecords();
  const empty = topicScores.length === 0 && summary.problemsAttempted === 0 && summary.lessonsCompleted === 0;

  const payload = {
    at: new Date().toISOString(),
    rev,
    formulaVersion: FORMULA_VERSION,
    empty,
    topics: topicScores,
    strengths: strengths.map((t) => ({ slug: t.slug, label: t.label, mastery: t.mastery, explain: t.explain })),
    focus: focus.map((t) => ({ slug: t.slug, label: t.label, mastery: t.mastery, explain: t.explain })),
    companyReadiness: companyReadiness.slice(0, 15),
    companyFit: companyReadiness.slice(0, 15),
    codingPatterns: patterns,
    graphSummary: {
      nodeCount: graph.nodes.length,
      edgeCount: graph.edges.length,
      topicsWithSignal: topicScores.length
    },
    records,
    summary,
    targetCompany: store.getProfile().targetCompany || null
  };

  store.setInsightsCache(payload);
  return payload;
}

function getGraph() {
  return buildGraph();
}

module.exports = {
  FORMULA_VERSION,
  WEIGHTS,
  topicFeatures,
  computeInsights,
  getGraph,
  companyReadinessList,
  // companyReadinessList is the canonical name; companyFitList was a stale alias, now removed.
  clamp01,
  sigmoid
};

/**
 * srs.js — spaced repetition / mastery expiry for topics.
 */
const store = require('./store');
const { TOPICS, CHAPTERS } = require('../data/curriculum');
const catalog = require('./catalog');

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

function scheduleAfterSuccess(stabilityDays) {
  const next = Math.min(60, Math.max(1, Math.round(stabilityDays * 1.8)));
  return next;
}

function scheduleAfterFail(stabilityDays) {
  return Math.max(1, Math.round((stabilityDays || 1) * 0.5));
}

function applyLessonComplete(lessonId) {
  let chapterTopics = [];
  try {
    chapterTopics = catalog.topicsForContext({ lessonId });
    if (!chapterTopics.length) {
      // Lesson ids are `<chapterDir>/<File>` — fall back to the prefix.
      const prefix = String(lessonId).split('/')[0];
      const chapter = CHAPTERS.find((c) => c.id === prefix || c.dir === prefix);
      chapterTopics = (chapter && chapter.topics) || [];
    }
  } catch {
    chapterTopics = [];
  }

  const now = new Date();
  for (const slug of chapterTopics) {
    bumpTopic(slug, { success: true, source: 'lesson', lessonId, at: now });
  }
  return chapterTopics;
}

function applyProblemResult(topics, { solved }) {
  const now = new Date();
  const list = Array.isArray(topics) ? topics : [];
  for (const slug of list) {
    bumpTopic(slug, { success: !!solved, source: 'problem', at: now });
  }
}

function bumpTopic(slug, { success, source, lessonId, at = new Date() }) {
  if (!slug) return null;
  const row = store.ensureTopic(slug);
  const stability = row.stabilityDays || 1;
  let mastery = row.mastery || 0;

  if (success) {
    mastery = clamp01(mastery + (mastery < 0.3 ? 0.25 : 0.12));
    const stab = scheduleAfterSuccess(stability);
    const next = new Date(at.getTime() + stab * 86400000);
    store.setTopic(slug, {
      mastery,
      stabilityDays: stab,
      lastSeenAt: at.toISOString(),
      nextReviewAt: next.toISOString()
    });
  } else {
    mastery = clamp01(mastery * 0.85 - 0.05);
    const stab = scheduleAfterFail(stability);
    const next = new Date(at.getTime() + stab * 86400000);
    store.setTopic(slug, {
      mastery,
      stabilityDays: stab,
      lastSeenAt: at.toISOString(),
      nextReviewAt: next.toISOString()
    });
  }
  return store.ensureTopic(slug);
}

function decayTick() {
  const topics = store.getTopics();
  const now = Date.now();
  for (const [slug, row] of Object.entries(topics)) {
    if (!row.lastSeenAt) continue;
    const days = (now - Date.parse(row.lastSeenAt)) / 86400000;
    const half = Math.max(1, row.stabilityDays || 1);
    if (days <= 0) continue;
    const factor = Math.pow(0.5, days / (half * 2));
    const mastery = clamp01((row.mastery || 0) * factor);
    if (Math.abs(mastery - (row.mastery || 0)) > 0.01) {
      store.setTopic(slug, { mastery });
    }
  }
}

function reviseQueue({ limit = 20 } = {}) {
  decayTick();
  const topics = store.getTopics();
  const now = Date.now();
  const due = [];

  for (const [slug, row] of Object.entries(topics)) {
    const next = row.nextReviewAt ? Date.parse(row.nextReviewAt) : null;
    const overdue = next != null && next <= now;
    const weak = (row.mastery || 0) > 0 && (row.mastery || 0) < 0.45;
    if (!overdue && !weak) continue;
    due.push({
      slug,
      label: (TOPICS[slug] && TOPICS[slug].label) || slug,
      mastery: row.mastery || 0,
      nextReviewAt: row.nextReviewAt,
      overdue: !!overdue,
      chapter: (TOPICS[slug] && TOPICS[slug].chapter) || null
    });
  }

  due.sort((a, b) => {
    if (a.overdue !== b.overdue) return a.overdue ? -1 : 1;
    return a.mastery - b.mastery;
  });

  let problems = [];
  try {
    const guided = catalog.guidedQuestions() || [];
    const dueSlugs = new Set(due.map((d) => d.slug));
    problems = guided
      .filter((q) => (q.topics || []).some((t) => dueSlugs.has(t)))
      .slice(0, limit)
      .map((q) => ({
        id: q.id,
        title: q.title,
        difficulty: q.difficulty,
        topics: q.topics,
        status: q.status
      }));
  } catch {
    problems = [];
  }

  return {
    dueTopics: due.slice(0, limit),
    problems,
    empty: due.length === 0
  };
}

module.exports = {
  applyLessonComplete,
  applyProblemResult,
  bumpTopic,
  reviseQueue,
  decayTick
};

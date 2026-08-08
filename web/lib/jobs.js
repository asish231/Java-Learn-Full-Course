/**
 * jobs.js — lightweight hook-driven jobs: goals, session notes, counsel helpers.
 * Mercury is used only for narrative notes/counsel; scores stay local.
 */
const store = require('./store');
const srs = require('./srs');
const analytics = require('./analytics');
const tutor = require('./tutor');
const { PATHS, getPath, TOPICS } = require('../data/curriculum');
const catalog = require('./catalog');

function ensureTodayGoals() {
  const profile = store.getProfile();
  const today = store.today();
  const existing = store.getGoals();
  if (existing && existing.date === today) return existing;

  const path = getPath(profile.pathId) || PATHS[0];
  const daily = profile.dailyMinutes || 30;
  const revise = srs.reviseQueue({ limit: 5 });
  const progress = store.getProgress();

  let nextLessonLabel = 'Complete one lesson on your path';
  if (path) {
    const chapters = catalog.chapterSummaries();
    for (const chId of path.chapters || []) {
      const ch = chapters.find((c) => c.id === chId);
      if (!ch) continue;
      const pending = (ch.lessons || []).find((l) => (progress.lessons[l.id] || {}).status !== 'completed');
      if (pending) {
        nextLessonLabel = `Lesson: ${pending.title}`;
        break;
      }
    }
  }

  const items = [
    { id: 'lesson', label: nextLessonLabel, done: false, kind: 'lesson' },
    { id: 'problem', label: 'Solve one guided problem', done: false, kind: 'problem' },
    { id: 'minutes', label: `Study ~${daily} minutes`, done: false, kind: 'time' }
  ];
  if (!revise.empty) {
    items.push({
      id: 'revise',
      label: `Revise ${revise.dueTopics.length} due topic(s)`,
      done: false,
      kind: 'revise'
    });
  }
  items.push({ id: 'mock', label: 'Optional: start a timed mock', done: false, kind: 'mock' });

  const goals = { date: today, items, xp: 0 };
  store.setGoals(goals);
  return goals;
}

function syncGoalsWithProgress() {
  const goals = ensureTodayGoals();
  const summary = store.summary();
  const day = summary.activity[store.today()] || {};
  const items = goals.items.map((it) => {
    const copy = { ...it };
    if (it.kind === 'lesson' && (day.lessons || 0) > 0) copy.done = true;
    if (it.kind === 'problem' && (day.solved || 0) > 0) copy.done = true;
    if (it.kind === 'time' && (day.minutes || 0) >= (store.getProfile().dailyMinutes || 30) * 0.8) copy.done = true;
    if (it.kind === 'mock') {
      const mocks = store.getMocks().filter((m) => (m.startedAt || '').startsWith(store.today()));
      if (mocks.length) copy.done = true;
    }
    if (it.kind === 'revise') {
      const r = srs.reviseQueue({ limit: 5 });
      if (r.empty) copy.done = true;
    }
    return copy;
  });
  const next = { ...goals, items };
  store.setGoals(next);
  return next;
}

async function writeSessionNote({ context = {}, outcomes = {}, useAi = true } = {}) {
  const insights = analytics.computeInsights({ useCache: true });
  const topicSlugs = catalog.topicsForContext({
    problemId: context.problemId || outcomes.problemId,
    lessonId: context.lessonId || outcomes.lessonId,
    chapterId: context.chapterId,
    topics: outcomes.topics || context.topics || []
  });
  const titleBits = [];
  if (context.problemId) titleBits.push(`Problem ${context.problemId}`);
  if (context.lessonId) titleBits.push(`Lesson ${context.lessonId}`);
  if (!titleBits.length) titleBits.push('Study session');

  let bodyMd = '';
  let aiGenerated = false;
  if (useAi && tutor.isConfigured()) {
    try {
      const prompt =
        `Write a concise markdown session note (max 180 words) for a Java DSA learner.\n` +
        `Context: ${JSON.stringify(context)}\n` +
        `Outcomes: ${JSON.stringify(outcomes)}\n` +
        `Topics touched: ${topicSlugs.map((s) => (TOPICS[s] && TOPICS[s].label) || s).join(', ') || 'none recorded'}\n` +
        `Focus topics: ${insights.focus.map((f) => f.label).join(', ') || 'none yet'}\n` +
        `Strengths: ${insights.strengths.map((f) => f.label).join(', ') || 'none yet'}\n` +
        `Be specific, no fake stats. If little data, say what to do next.`;
      bodyMd = await tutor.narrate(prompt, { mode: 'notes', maxTokens: 500 });
      aiGenerated = !!bodyMd;
    } catch (err) {
      console.warn('[jobs] session note fell back to the local template:', err.message);
      bodyMd = '';
    }
  }

  if (!bodyMd) {
    const lines = [
      `### ${titleBits.join(' · ')}`,
      '',
      outcomes.status ? `- Result: **${outcomes.status}**` : '- Session ended.',
      topicSlugs.length ? `- Topics: ${topicSlugs.map((s) => (TOPICS[s] && TOPICS[s].label) || s).join(', ')}` : '',
      insights.empty
        ? '- No analytics signal yet — complete a lesson or guided problem to build your map.'
        : `- Top focus: ${insights.focus.slice(0, 3).map((f) => f.label).join(', ') || '—'}`,
      ''
    ].filter(Boolean);
    bodyMd = lines.join('\n');
  }

  const note = store.addNote({
    source: aiGenerated ? 'session-ai' : 'session',
    title: titleBits.join(' · ').slice(0, 100),
    bodyMd,
    topicSlugs
  });

  const fact = outcomes.status
    ? `Session on ${titleBits.join(' ')}: ${outcomes.status}`
    : `Studied ${titleBits.join(' ')}`;
  store.rememberFact(fact.slice(0, 200), 'session');

  store.appendEvents([{ type: 'session_end', payload: { noteId: note.id, context, outcomes } }]);
  return note;
}

function counselNext() {
  const profile = store.getProfile();
  const counsel = store.getCounsel();
  const days = counsel.daysOfWeek || profile.counselDays || [3, 0];
  const now = new Date();
  const todayDow = now.getDay();
  const isCounselDay = days.includes(todayDow);

  let daysUntil = 0;
  for (let i = 0; i < 7; i++) {
    if (days.includes((todayDow + i) % 7)) {
      daysUntil = i;
      break;
    }
  }

  const insights = analytics.computeInsights({ useCache: true });
  const target = profile.targetCompany;
  const fit = insights.companyReadiness || insights.companyFit || [];
  const targetFit = target ? fit.find((c) => c.company === target) : null;
  const shortlist = fit.slice(0, 5);

  return {
    isCounselDay,
    daysUntil,
    daysOfWeek: days,
    lastSessionAt: counsel.lastSessionAt,
    // The model forgets between sessions; the learner should not have to.
    history: (counsel.history || []).slice(-6),
    targetCompany: target,
    targetFit: targetFit || null,
    shortlist,
    focus: insights.focus.slice(0, 5),
    empty: insights.empty,
    readinessBlurb: insights.empty
      ? 'Complete lessons and guided problems so readiness is based on your real work — nothing is invented.'
      : targetFit
        ? `Target ${targetFit.name}: ${targetFit.label} (${targetFit.percent}% topic readiness, ${targetFit.confidence} confidence). This is not a hiring probability.`
        : `Strongest company-topic overlap right now: ${shortlist[0] ? `${shortlist[0].name} (${shortlist[0].label}, ${shortlist[0].percent}% readiness)` : 'n/a'}.`
  };
}

function reminder() {
  const goals = syncGoalsWithProgress();
  const incomplete = goals.items.filter((i) => !i.done);
  const profile = store.getProfile();
  const day = store.summary().activity[store.today()] || {};
  const minutes = day.minutes || 0;
  const target = profile.dailyMinutes || 30;
  return {
    show: incomplete.length > 0 || minutes < target * 0.5,
    goals,
    minutes,
    targetMinutes: target,
    message: incomplete.length
      ? `${incomplete.length} daily goal(s) still open.`
      : minutes < target
        ? `You've logged ${minutes}/${target} minutes today.`
        : 'Daily goals look good.'
  };
}

module.exports = {
  ensureTodayGoals,
  syncGoalsWithProgress,
  writeSessionNote,
  counselNext,
  reminder
};

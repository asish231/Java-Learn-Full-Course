/**
 * Java DSA Studio — server.
 *
 * Layers:
 *   data/curriculum.js   what can be learned (chapters, topics, paths)
 *   data/bank/*.js       curated problems with real statements + test cases
 *   lib/catalog.js       merges src/ lessons and company CSVs into a catalog
 *   lib/judge.js         compiles and grades Java submissions
 *   lib/store.js         profile, progress, streaks, tutor memory (on disk)
 *   lib/tutor.js         Mercury 2 tutor with context and memory
 */
const express = require('express');
const cors = require('cors');
const path = require('path');

const catalog = require('./lib/catalog');
const judge = require('./lib/judge');
const store = require('./lib/store');
const tutor = require('./lib/tutor');
const analytics = require('./lib/analytics');
const srs = require('./lib/srs');
const mock = require('./lib/mock');
const jobs = require('./lib/jobs');
const assessment = require('./lib/assessment');
const learning = require('./lib/learning');
const placement = require('./lib/placement');
const { CHAPTERS, PATHS, TOPICS, getPath } = require('./data/curriculum');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const asyncRoute = (handler) => (req, res) => {
  Promise.resolve(handler(req, res)).catch((err) => {
    console.error(`[api] ${req.method} ${req.path}:`, err.message);
    if (!res.headersSent) res.status(500).json({ error: err.message });
  });
};

// ===========================================================================
// Bootstrap — everything the SPA needs for its first paint
// ===========================================================================

app.get('/api/bootstrap', asyncRoute((req, res) => {
  res.json({
    profile: store.getProfile(),
    paths: PATHS,
    chapters: catalog.chapterSummaries().map((c) => ({
      id: c.id, icon: c.icon, title: c.title, track: c.track, order: c.order,
      minutes: c.minutes, summary: c.summary, why: c.why, topics: c.topics,
      objectives: c.objectives, prerequisites: c.prerequisites,
      lessonCount: c.lessonCount,
      lessons: c.lessons.map((l) => ({
        id: l.id, title: l.title, level: l.level, levelName: l.levelName,
        difficulty: l.difficulty, minutes: l.minutes, summary: l.summary, kind: l.kind
      }))
    })),
    topics: TOPICS,
    stats: catalog.stats(),
    progress: store.getProgress(),
    summary: store.summary(),
    tutorReady: tutor.isConfigured(),
    featuredCompanies: catalog.featuredCompanies(),
    periods: catalog.PERIODS
  });
}));

// ===========================================================================
// Profile & progress
// ===========================================================================

app.get('/api/profile', asyncRoute((req, res) => res.json(store.getProfile())));

app.post('/api/profile', asyncRoute((req, res) => {
  res.json(store.saveProfile(req.body || {}));
}));

app.get('/api/progress', asyncRoute((req, res) => {
  res.json({ progress: store.getProgress(), summary: store.summary() });
}));

app.post('/api/progress/lesson', asyncRoute((req, res) => {
  const { lessonId, status = 'completed', minutes = 0 } = req.body || {};
  if (!lessonId) return res.status(400).json({ error: 'lessonId is required' });
  const lesson = store.markLesson(lessonId, status, minutes);
  if (status === 'completed') srs.applyLessonComplete(lessonId);
  res.json({ lesson, summary: store.summary() });
}));

app.post('/api/progress/draft', asyncRoute((req, res) => {
  const { problemId, code } = req.body || {};
  if (!problemId) return res.status(400).json({ error: 'problemId is required' });
  store.saveDraft(problemId, code || '');
  res.json({ ok: true });
}));

app.post('/api/progress/reset', asyncRoute((req, res) => {
  store.resetAll();
  res.json({ ok: true, profile: store.getProfile(), summary: store.summary() });
}));

app.get('/api/data/export', asyncRoute((req, res) => {
  res.setHeader('Content-Disposition', `attachment; filename="java-dsa-studio-${store.today()}.json"`);
  res.json(store.exportState());
}));

app.post('/api/data/import', asyncRoute((req, res) => {
  try {
    res.json(store.importState(req.body));
  } catch (err) {
    res.status(400).json({ error: err.message, code: 'INVALID_EXPORT' });
  }
}));

app.get('/api/data/health', asyncRoute((req, res) => res.json(store.storageHealth())));

app.get('/api/placement', asyncRoute((req, res) => res.json(placement.dashboard())));

function placementWrite(handler) {
  return asyncRoute((req, res) => {
    try {
      res.status(201).json(handler(req.body || {}));
    } catch (err) {
      res.status(400).json({ error: err.message, code: 'INVALID_PLACEMENT_EVIDENCE' });
    }
  });
}

app.post('/api/placement/evidence', placementWrite(placement.addEvidence));
app.post('/api/placement/applications', placementWrite(placement.addApplication));
app.post('/api/placement/simulations', placementWrite(placement.addSimulation));
app.post('/api/placement/outcomes', placementWrite(placement.addOutcome));

/** Personalised "what next" queue: unfinished path chapters + due problems. */
app.get('/api/next-up', asyncRoute((req, res) => {
  const profile = store.getProfile();
  const progress = store.getProgress();
  const activePath = getPath(profile.pathId) || PATHS[0];

  const chapters = activePath.chapters
    .map((id) => catalog.chapterSummaries().find((c) => c.id === id))
    .filter(Boolean)
    .map((chapter) => {
      const lessons = chapter.lessons;
      const done = lessons.filter((l) => (progress.lessons[l.id] || {}).status === 'completed').length;
      return {
        id: chapter.id, icon: chapter.icon, title: chapter.title,
        summary: chapter.summary, minutes: chapter.minutes,
        total: lessons.length, done,
        percent: lessons.length ? Math.round((done / lessons.length) * 100) : 0,
        nextLesson: lessons.find((l) => (progress.lessons[l.id] || {}).status !== 'completed') || null
      };
    });

  const currentChapter = chapters.find((c) => c.percent < 100) || chapters[0] || null;

  const attempted = Object.entries(progress.problems)
    .filter(([, p]) => p.status !== 'solved')
    .sort((a, b) => new Date(b[1].lastAttemptAt || 0) - new Date(a[1].lastAttemptAt || 0))
    .slice(0, 5)
    .map(([id, p]) => ({ id, attempts: p.attempts, passed: p.passed, total: p.total }));

  const recommended = currentChapter
    ? catalog.questionsForChapter(currentChapter.id, 6)
      .map((q) => ({ ...q, status: (progress.problems[q.id] || {}).status || 'not-started' }))
      .filter((q) => q.status !== 'solved')
      .slice(0, 4)
    : [];

  res.json({
    path: { id: activePath.id, title: activePath.title, icon: activePath.icon },
    chapters,
    currentChapter,
    resumeProblems: attempted,
    recommended,
    summary: store.summary()
  });
}));

// ===========================================================================
// Curriculum
// ===========================================================================

app.get('/api/paths', asyncRoute((req, res) => res.json(PATHS)));

app.get('/api/chapters', asyncRoute((req, res) => {
  const progress = store.getProgress();
  res.json(catalog.chapterSummaries().map((chapter) => {
    const done = chapter.lessons.filter((l) => (progress.lessons[l.id] || {}).status === 'completed').length;
    return { ...chapter, done, percent: chapter.lessons.length ? Math.round((done / chapter.lessons.length) * 100) : 0 };
  }));
}));

app.get('/api/chapters/:id', asyncRoute((req, res) => {
  const chapter = catalog.getChapterDetail(req.params.id);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

  const progress = store.getProgress();
  res.json({
    ...chapter,
    lessons: chapter.lessons.map(({ code, ...lesson }) => ({
      ...lesson,
      status: (progress.lessons[lesson.id] || {}).status || 'not-started'
    })),
    practice: catalog.questionsForChapter(chapter.id, 12).map((q) => ({
      ...q, status: (progress.problems[q.id] || {}).status || 'not-started'
    }))
  });
}));

app.get('/api/lessons/:chapterId/:lessonName', asyncRoute((req, res) => {
  const lessonId = `${req.params.chapterId}/${req.params.lessonName}`;
  const lesson = catalog.getLesson(lessonId);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  const progress = store.getProgress();
  const chapter = catalog.getChapterDetail(lesson.chapterId);
  const siblings = chapter.lessons.map((l) => ({
    id: l.id, title: l.title, level: l.level, levelName: l.levelName,
    status: (progress.lessons[l.id] || {}).status || 'not-started'
  }));
  const index = siblings.findIndex((l) => l.id === lessonId);

  store.markLesson(lessonId, (progress.lessons[lessonId] || {}).status === 'completed' ? 'completed' : 'in-progress');

  res.json({
    ...lesson,
    chapter: { id: chapter.id, icon: chapter.icon, title: chapter.title, objectives: chapter.objectives, why: chapter.why },
    siblings,
    prev: index > 0 ? siblings[index - 1] : null,
    next: index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null,
    practice: catalog.questionsForChapter(lesson.chapterId, 6),
    status: (progress.lessons[lessonId] || {}).status || 'in-progress',
    activeLearning: learning.publicActivities(learning.lessonActivities(lessonId))
  });
}));

app.post('/api/lessons/:chapterId/:lessonName/checkpoints/:checkpointId', asyncRoute((req, res) => {
  const lessonId = `${req.params.chapterId}/${req.params.lessonName}`;
  const result = learning.answerCheckpoint(lessonId, req.params.checkpointId, req.body && req.body.answerIndex);
  if (!result) return res.status(404).json({ error: 'Lesson checkpoint not found' });
  res.json(result);
}));

app.post('/api/lessons/:chapterId/:lessonName/reflection', asyncRoute((req, res) => {
  const lessonId = `${req.params.chapterId}/${req.params.lessonName}`;
  const text = String((req.body && req.body.text) || '').trim();
  if (text.length < 10) return res.status(400).json({ error: 'Write at least 10 characters for a useful reflection.' });
  const reflection = learning.saveReflection(lessonId, text);
  if (!reflection) return res.status(404).json({ error: 'Lesson not found' });
  res.json({ reflection });
}));

// ===========================================================================
// Practice — companies & questions
// ===========================================================================

app.get('/api/companies', asyncRoute((req, res) => {
  const search = String(req.query.search || '').toLowerCase().trim();
  let companies = catalog.listCompanies();
  if (search) companies = companies.filter((c) => c.name.toLowerCase().includes(search) || c.id.includes(search));
  res.json({
    total: catalog.listCompanies().length,
    featured: catalog.featuredCompanies(),
    companies: companies.slice(0, Number(req.query.limit) || 120)
  });
}));

app.get('/api/companies/:slug/questions', asyncRoute((req, res) => {
  const { slug } = req.params;
  const period = String(req.query.period || 'all');
  const questions = catalog.companyQuestions(slug, period);
  if (!questions.length) return res.status(404).json({ error: 'No questions for this company/period' });

  const progress = store.getProgress();
  res.json({
    company: { id: slug, name: catalog.formatCompanyName(slug) },
    period,
    questions: questions.map((q) => ({ ...q, status: (progress.problems[q.id] || {}).status || 'not-started' }))
  });
}));

app.get('/api/questions', asyncRoute((req, res) => {
  const progress = store.getProgress();
  const topic = req.query.topic;
  let questions = catalog.guidedQuestions();
  if (topic) questions = questions.filter((q) => q.topics.includes(topic));
  res.json(questions.map((q) => ({ ...q, status: (progress.problems[q.id] || {}).status || 'not-started' })));
}));

app.get('/api/questions/:id', asyncRoute((req, res) => {
  const question = catalog.getQuestion(req.params.id, req.query.company);
  if (!question) return res.status(404).json({ error: 'Question not found' });

  const entry = store.getProgress().problems[question.id] || null;
  res.json({
    ...question,
    solutionCode: undefined,          // revealed through a separate, deliberate call
    hasSolution: !!question.solutionCode,
    progress: entry ? {
      status: entry.status, attempts: entry.attempts, passed: entry.passed,
      total: entry.total, solvedAt: entry.solvedAt, draft: entry.lastCode || ''
    } : null
  });
}));

app.get('/api/questions/:id/solution', asyncRoute((req, res) => {
  const question = catalog.getQuestion(req.params.id, req.query.company);
  if (!question || !question.solutionCode) return res.status(404).json({ error: 'No reference solution for this question yet' });
  res.json({
    solutionCode: question.solutionCode,
    approach: question.approach,
    complexity: question.complexity
  });
}));

app.get('/api/questions/:id/plan', asyncRoute((req, res) => {
  const plan = tutor.prepPlan(req.params.id, req.query.company);
  if (!plan) return res.status(404).json({ error: 'Question not found' });
  res.json(plan);
}));

// ===========================================================================
// Execution
// ===========================================================================

/** Run arbitrary Java (lesson files, scratch code) and stream back stdout. */
app.post('/api/run', asyncRoute(async (req, res) => {
  const { code, stdin, lessonId } = req.body || {};
  if (!code || typeof code !== 'string') return res.status(400).json({ error: 'Java code is required' });

  const result = await judge.runFreeform(code, stdin);
  if (lessonId) store.recordLessonRun(lessonId);
  res.json(result);
}));

/** Grade a submission against the question's test cases. */
app.post('/api/submit', asyncRoute(async (req, res) => {
  const { problemId, code, company, runSamplesOnly } = req.body || {};
  if (!problemId || !code) return res.status(400).json({ error: 'problemId and code are required' });

  const question = catalog.getQuestion(problemId, company);
  if (!question) return res.status(404).json({ error: 'Question not found' });

  if (!question.guided || !question.tests.length) {
    const result = await judge.runFreeform(code);
    store.saveDraft(question.id, code);
    return res.json({ ...result, graded: false });
  }

  const bank = require('./data/problem-bank').getProblem(question.number);
  const tests = runSamplesOnly
    ? bank.tests.slice(0, 3)
    : [...bank.tests, ...assessment.privateTestsFor(question.id)];

  const result = await judge.runTests(code, tests, bank.testHelpers);

  // Running the samples is practice; only a real submit counts as an attempt.
  const entry = runSamplesOnly
    ? store.recordSampleRun(question.id, {
      passed: result.passed, total: result.total, status: result.status,
      code, elapsedMs: result.elapsedMs, topics: question.topics
    })
    : store.recordAttempt(question.id, {
      passed: result.passed, total: result.total, status: result.status,
      code, elapsedMs: result.elapsedMs, topics: question.topics
    });
  if (!runSamplesOnly) {
    srs.applyProblemResult(question.topics || [], { solved: result.status === 'Accepted' });
  }

  res.json({
    ...result,
    graded: true,
    sampleOnly: !!runSamplesOnly,
    progress: { status: entry.status, attempts: entry.attempts, solvedAt: entry.solvedAt },
    summary: store.summary()
  });
}));

// ===========================================================================
// AI Tutor
// ===========================================================================

app.get('/api/tutor/status', asyncRoute((req, res) => {
  res.json({ ready: tutor.isConfigured(), model: tutor.MODEL });
}));

app.get('/api/tutor/thread', asyncRoute((req, res) => {
  const key = tutor.contextKey({
    problemId: req.query.problemId, lessonId: req.query.lessonId, chapterId: req.query.chapterId
  });
  res.json({ contextKey: key, messages: store.getChat(key) });
}));

app.delete('/api/tutor/thread', asyncRoute((req, res) => {
  const key = tutor.contextKey({
    problemId: req.query.problemId, lessonId: req.query.lessonId, chapterId: req.query.chapterId
  });
  store.clearChat(key);
  res.json({ ok: true });
}));

/**
 * Tutor usage is a first-class behaviour signal (tutor-dependence in the
 * feature engine), so every answered question is logged against its topics.
 */
function trackTutorUse(context = {}, mode = 'chat') {
  try {
    store.appendEvents([{
      type: 'tutor_msg',
      payload: {
        mode,
        problemId: context.problemId || null,
        lessonId: context.lessonId || null,
        topics: catalog.topicsForContext(context)
      }
    }]);
  } catch (err) {
    console.warn('[events] could not log tutor usage:', err.message);
  }
}

/** Streaming chat (Server-Sent Events). */
app.post('/api/tutor/ask', asyncRoute(async (req, res) => {
  const { message = '', context = {}, mode = 'chat', stream = true } = req.body || {};

  if (!tutor.isConfigured()) {
    return res.status(503).json({ error: 'AI tutor is not configured. Add MERCURY_API_KEY to web/.env and restart.' });
  }

  if (!stream) {
    const { reply, visualization } = await tutor.ask({ message, context, mode });
    trackTutorUse(context, mode);
    return res.json({ reply, visualization });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });

  const send = (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  try {
    const { reply, visualization } = await tutor.ask({ message, context, mode }, (chunk) => send('chunk', { text: chunk }));
    trackTutorUse(context, mode);
    send('done', { reply, visualization });
  } catch (err) {
    send('error', { error: err.message });
  }
  res.end();
}));

app.get('/api/tutor/memory', asyncRoute((req, res) => {
  res.json({ memory: store.getMemory(), summary: store.summary() });
}));

app.post('/api/tutor/memory', asyncRoute((req, res) => {
  const { text, kind = 'user' } = req.body || {};
  if (!text) return res.status(400).json({ error: 'text is required' });
  res.json(store.rememberFact(text, kind));
}));

app.delete('/api/tutor/memory/:index', asyncRoute((req, res) => {
  res.json(store.forgetFact(Number(req.params.index)));
}));

// ===========================================================================
// Learning OS — events, insights, SRS, goals, mocks, notes, counsel
// ===========================================================================

app.post('/api/events', asyncRoute((req, res) => {
  const body = req.body || {};
  const batch = Array.isArray(body.events) ? body.events : (body.type ? [body] : []);
  if (!batch.length) return res.status(400).json({ error: 'events array required' });

  // The client only knows what it is looking at; topics are resolved here so
  // time and typing land on the right nodes of the knowledge map.
  const capped = batch.slice(0, 50).map((ev) => {
    const payload = ev && ev.payload && typeof ev.payload === 'object' ? { ...ev.payload } : {};
    if (!Array.isArray(payload.topics) || !payload.topics.length) {
      const topics = catalog.topicsForContext(payload);
      if (topics.length) payload.topics = topics;
    }
    return { ...ev, payload };
  });
  res.json(store.appendEvents(capped));
}));

app.get('/api/events', asyncRoute((req, res) => {
  res.json({
    events: store.getEvents({
      limit: Math.min(Number(req.query.limit) || 100, 500),
      type: req.query.type,
      since: req.query.since
    })
  });
}));

app.get('/api/insights', asyncRoute((req, res) => {
  res.json(analytics.computeInsights({ useCache: req.query.refresh !== '1' }));
}));

app.get('/api/graph', asyncRoute((req, res) => {
  res.json(analytics.getGraph());
}));

app.get('/api/revise', asyncRoute((req, res) => {
  const queue = srs.reviseQueue({ limit: Number(req.query.limit) || 20 });
  const days = Number(req.query.days) || 0;
  res.json(days ? { ...queue, plan: assessment.revisionPlan({ days }) } : queue);
}));

app.get('/api/diagnostics', asyncRoute((req, res) => {
  res.json(assessment.topicDiagnostics());
}));

app.get('/api/revision-plan', asyncRoute((req, res) => {
  res.json(assessment.revisionPlan({ days: Number(req.query.days) || 7 }));
}));

app.post('/api/diagnostics', asyncRoute((req, res) => {
  const { count = 6, topicSlugs = [] } = req.body || {};
  res.json(assessment.buildDiagnostic({ count, topicSlugs }));
}));

app.get('/api/goals/today', asyncRoute((req, res) => {
  res.json(jobs.syncGoalsWithProgress());
}));

app.post('/api/goals/today', asyncRoute((req, res) => {
  const { id, done } = req.body || {};
  if (!id) return res.status(400).json({ error: 'id is required' });
  jobs.ensureTodayGoals();
  const goals = store.patchGoalItem(id, done);
  if (!goals) return res.status(404).json({ error: 'goal item not found' });
  res.json(goals);
}));

app.get('/api/reminder', asyncRoute((req, res) => {
  res.json(jobs.reminder());
}));

app.post('/api/mocks', asyncRoute((req, res) => {
  const { count = 3, minutes = 45, strict = true, topicSlugs = [], purpose = 'practice' } = req.body || {};
  try {
    const session = mock.startMock({ count, minutes, strict, topicSlugs, purpose });
    res.json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}));

app.get('/api/mocks/active', asyncRoute((req, res) => {
  res.json({ mock: mock.getActiveMock() });
}));

app.get('/api/mocks/:id', asyncRoute((req, res) => {
  const m = store.getMock(req.params.id);
  if (!m) return res.status(404).json({ error: 'Mock not found' });
  mock.expireIfDue(m);
  res.json({ ...store.getMock(req.params.id), remainingMs: mock.remainingMs(m) });
}));

app.post('/api/mocks/:id/answer', asyncRoute(async (req, res) => {
  const { problemId, code } = req.body || {};
  if (!problemId) return res.status(400).json({ error: 'problemId is required' });
  try {
    const out = await mock.answerMock(req.params.id, { problemId, code });
    res.json(out);
  } catch (err) {
    const codeStatus = err.code === 'NOT_FOUND' ? 404 : err.code === 'EXPIRED' ? 409 : 400;
    res.status(codeStatus).json({
      error: err.message,
      code: err.code || 'ERROR',
      mock: store.getMock(req.params.id)
    });
  }
}));

app.post('/api/mocks/:id/finish', asyncRoute((req, res) => {
  try {
    res.json(mock.finishMock(req.params.id));
  } catch (err) {
    res.status(err.code === 'NOT_FOUND' ? 404 : 400).json({ error: err.message });
  }
}));

app.get('/api/notes', asyncRoute((req, res) => {
  res.json({ notes: store.getNotes(Number(req.query.limit) || 40) });
}));

app.post('/api/sessions/end', asyncRoute(async (req, res) => {
  const { context = {}, outcomes = {}, ai = true } = req.body || {};
  const note = await jobs.writeSessionNote({ context, outcomes, useAi: ai !== false });
  res.json({ note });
}));

app.get('/api/counsel/next', asyncRoute((req, res) => {
  res.json(jobs.counselNext());
}));

app.post('/api/counsel/chat', asyncRoute(async (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'message is required' });
  if (!tutor.isConfigured()) return res.status(503).json({ error: 'Tutor not configured' });

  const snapshot = jobs.counselNext();
  const insights = analytics.computeInsights({ useCache: true });
  const grounding = JSON.stringify({
    readinessBlurb: snapshot.readinessBlurb,
    shortlist: snapshot.shortlist,
    focus: snapshot.focus,
    targetCompany: snapshot.targetCompany,
    records: insights.records,
    empty: insights.empty
  });

  const out = await tutor.ask({
    message,
    grounding,
    context: { kind: 'counsel' },
    mode: 'career'
  });
  const replyText = (out && out.reply) || '';
  store.saveCounsel({ lastSessionAt: new Date().toISOString() });
  const counsel = store.getCounsel();
  counsel.history = (counsel.history || []).concat([{
    at: new Date().toISOString(),
    message: String(message).slice(0, 500),
    reply: String(replyText).slice(0, 4000)
  }]).slice(-30);
  store.saveCounsel({ history: counsel.history });
  res.json({ reply: replyText, snapshot });
}));

app.get('/api/records', asyncRoute((req, res) => {
  res.json(store.getRecords());
}));

// ===========================================================================
// Fallback: single-page app
// ===========================================================================

app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Unknown endpoint' });
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  const stats = catalog.stats();
  console.log(`\n    Java DSA Studio  →  http://localhost:${PORT}\n`);
  console.log(`      ${stats.chapters} chapters · ${stats.lessons} lessons`);
  console.log(`      ${stats.guidedProblems} guided problems with test cases`);
  console.log(`      ${stats.companies} companies · ${stats.companyQuestions} interview questions`);
  console.log(`      AI tutor: ${tutor.isConfigured() ? `${tutor.MODEL} ready` : 'disabled (set MERCURY_API_KEY in web/.env)'}\n`);
});

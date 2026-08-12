#!/usr/bin/env node
/**
 * test-analytics.js — fixture tests for the Learning OS pure logic.
 *
 *   node tools/test-analytics.js
 *
 * Runs against a scratch state file (DSA_STORE_FILE) so the learner's real
 * progress is never touched, and never calls Mercury or the Java judge:
 * every score here must be reproducible offline.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const SCRATCH = path.join(os.tmpdir(), `dsa-studio-test-${process.pid}.json`);
process.env.DSA_STORE_FILE = SCRATCH;
process.env.MERCURY_DISABLED = '1';      // notes must fall back to the template

const store = require('../lib/store');
const analytics = require('../lib/analytics');
const srs = require('../lib/srs');
const mock = require('../lib/mock');
const jobs = require('../lib/jobs');
const catalog = require('../lib/catalog');
const assessment = require('../lib/assessment');
const learning = require('../lib/learning');
const placement = require('../lib/placement');

let failures = 0;
let checks = 0;

function check(label, condition, detail = '') {
  checks++;
  if (condition) {
    console.log(`  ✓ ${label}`);
  } else {
    failures++;
    console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

function reset() {
  store.resetAll();
}

function topic(slug) {
  return store.getTopics()[slug] || {};
}

// ---------------------------------------------------------------------------

function testEmptyLearner() {
  console.log('\nEmpty learner');
  reset();
  const insights = analytics.computeInsights({ useCache: false });
  check('insights report empty', insights.empty === true);
  check('no invented topics', insights.topics.length === 0);
  check('no invented strengths', insights.strengths.length === 0);
  check('company fit is all zero', insights.companyFit.every((c) => c.percent === 0));
  check('records start at zero', insights.records.bestStreak === 0 && insights.records.bestMockScore === null);
}

function testAttemptFeatures() {
  console.log('\nAttempt features');
  reset();

  // two failed attempts, then a pass — accuracy 1/3, attempts-to-solve 3
  for (const passed of [1, 2]) {
    store.recordAttempt('lc-206', { passed, total: 5, status: 'Wrong Answer', topics: ['linked-list'] });
  }
  store.recordAttempt('lc-206', { passed: 5, total: 5, status: 'Accepted', topics: ['linked-list'] });
  srs.applyProblemResult(['linked-list'], { solved: true });

  const row = topic('linked-list');
  check('3 attempts recorded', row.attempts === 3, `got ${row.attempts}`);
  check('1 pass recorded', row.passes === 1, `got ${row.passes}`);
  check('attempts-to-solve is per problem', row.avgAttempts === 3, `got ${row.avgAttempts}`);

  const features = analytics.topicFeatures('linked-list', row, store.getEvents({ limit: 500 }));
  check('accuracy is 1/3', Math.abs(features.features.accuracy - 1 / 3) < 0.001, `got ${features.features.accuracy}`);
  check('tutor dependence is 0 without tutor use', features.features.tutorRatio === 0);
  check('mastery is positive after solving', features.mastery > 0);
  check('factors are explained', features.explain.length >= 4);
}

function testSampleRunsAreNotAttempts() {
  console.log('\nSample runs vs graded submits');
  reset();
  store.recordSampleRun('lc-206', { passed: 1, total: 3, status: 'Wrong Answer', topics: ['linked-list'] });
  check('sample run does not add a topic attempt', (topic('linked-list').attempts || 0) === 0);
  check('sample run logs a run event', store.getEvents({ type: 'run' }).length === 1);

  store.recordAttempt('lc-206', { passed: 3, total: 3, status: 'Accepted', topics: ['linked-list'] });
  check('graded submit adds the attempt', topic('linked-list').attempts === 1);
}

function testTutorDependence() {
  console.log('\nTutor dependence');
  reset();
  store.recordAttempt('lc-200', { passed: 4, total: 4, status: 'Accepted', topics: ['graph', 'dfs'] });
  store.appendEvents([{ type: 'tutor_msg', payload: { topics: ['graph', 'dfs'] } }]);

  check('every topic in the payload is credited', topic('graph').tutorAssists === 1 && topic('dfs').tutorAssists === 1);
  const features = analytics.topicFeatures('graph', topic('graph'), store.getEvents({ limit: 500 }));
  check('tutorRatio is no longer stuck at 0', features.features.tutorRatio === 1, `got ${features.features.tutorRatio}`);

  const unaided = analytics.topicFeatures('graph', { ...topic('graph'), tutorAssists: 0 }, store.getEvents({ limit: 500 }));
  check('leaning on the tutor lowers mastery', features.mastery < unaided.mastery);
}

function testActiveCodingRatio() {
  console.log('\nActive vs idle coding');
  reset();
  store.recordAttempt('lc-206', { passed: 5, total: 5, status: 'Accepted', topics: ['linked-list'] });
  store.appendEvents([{
    type: 'code_activity',
    payload: { topics: ['linked-list'], activeMs: 60000, idleMs: 180000, keystrokes: 220 }
  }]);

  const row = topic('linked-list');
  check('editor time is accumulated', row.activeMs === 60000 && row.idleMs === 180000);
  const features = analytics.topicFeatures('linked-list', row, store.getEvents({ limit: 500 }));
  check('ratio uses measured time', features.features.activeCodingMeasured === true);
  check('ratio is active/(active+idle)', Math.abs(features.features.activeCodingRatio - 0.25) < 0.001,
    `got ${features.features.activeCodingRatio}`);
}

function testSrsAndReviseQueue() {
  console.log('\nSpaced repetition');
  reset();
  const lessonId = catalog.chapterSummaries()[0].lessons[0].id;
  const touched = srs.applyLessonComplete(lessonId);
  check('lesson resolves to its chapter topics', touched.length > 0, `lesson ${lessonId}`);
  check('topic gets a review date', !!topic(touched[0]).nextReviewAt);

  const queue = srs.reviseQueue({ limit: 10 });
  check('freshly learned topic is not due yet', !queue.dueTopics.some((t) => t.slug === touched[0] && t.overdue));

  // Force the review date into the past — the topic must become due.
  store.setTopic(touched[0], { nextReviewAt: new Date(Date.now() - 86400000).toISOString() });
  const overdue = srs.reviseQueue({ limit: 10 });
  check('overdue topic enters the revise queue', overdue.dueTopics.some((t) => t.slug === touched[0] && t.overdue));
  check('queue suggests real guided problems', Array.isArray(overdue.problems));
}

function testMockRules() {
  console.log('\nTimed mock rules');
  reset();
  const session = mock.startMock({ count: 2, minutes: 30 });
  check('mock uses real guided problems', session.itemIds.length === 2 && session.itemIds.every((id) => !!catalog.getQuestion(id)));
  check('active mock is found without reordering history', mock.getActiveMock().id === session.id);
  check('history order is untouched', store.getMocks()[store.getMocks().length - 1].id === session.id);
  check('remaining time is reported', mock.remainingMs(session) > 0);

  // Expire the clock: answering must be refused and the session auto-scored.
  const stored = store.getMock(session.id);
  stored.endsAt = new Date(Date.now() - 1000).toISOString();
  store.saveMock(stored);

  check('expired session reports no time left', mock.remainingMs(store.getMock(session.id)) === 0);
  return mock.answerMock(session.id, { problemId: session.itemIds[0], code: 'class Solution {}' })
    .then(() => check('expired answer is rejected', false, 'the call resolved'))
    .catch((err) => {
      check('expired answer is rejected', err.code === 'EXPIRED', err.message);
      const after = store.getMock(session.id);
      check('expired session was auto-submitted', after.status === 'finished' && after.finishReason === 'timeout');
      check('auto-submitted score is 0 with no answers', after.score === 0);

      const before = store.getRecords().thisWeek.xp;
      mock.finishMock(session.id);
      check('finishing twice does not double-count', store.getRecords().thisWeek.xp === before);
    });
}

function testRecordsAndGoals() {
  console.log('\nRecords and daily goals');
  reset();
  store.updateBestMock(40);
  store.updateBestMock(80);
  store.updateBestMock(60);
  check('best mock score keeps the maximum', store.getRecords().bestMockScore === 80);

  const goals = jobs.syncGoalsWithProgress();
  check('a checklist exists for today', goals.date === store.today() && goals.items.length >= 3);
  check('nothing is pre-ticked', goals.items.every((i) => i.done === false || i.kind === 'revise'));

  store.patchGoalItem('problem', true);
  check('completing a goal awards xp', store.getGoals().xp === 10);
}

function testNotesWithoutMercury() {
  console.log('\nSession notes without the tutor');
  reset();
  return jobs.writeSessionNote({
    context: { problemId: 'lc-206' },
    outcomes: { status: 'solved' }
  }).then((note) => {
    check('a note is written offline', !!note && note.bodyMd.length > 0);
    check('note falls back to the local template', note.source === 'session');
    check('note is attributed to real topics', note.topicSlugs.includes('linked-list'));
    check('note reaches the tutor memory', store.getMemory().facts.some((f) => f.kind === 'session'));
  });
}

function testInsightsCache() {
  console.log('\nInsights cache');
  reset();
  store.recordAttempt('lc-206', { passed: 5, total: 5, status: 'Accepted', topics: ['linked-list'] });
  const first = analytics.computeInsights({ useCache: false });
  const second = analytics.computeInsights({ useCache: true });
  check('cache is reused while nothing changes', second.at === first.at);

  store.appendEvents([{ type: 'open_problem', payload: { problemId: 'lc-21' } }]);
  const third = analytics.computeInsights({ useCache: true });
  check('new behaviour invalidates the cache', third.at !== first.at);
  check('formula version is reported', typeof third.formulaVersion === 'string');
}

function testAssessmentBlueprint() {
  console.log('\nAssessment blueprint');
  reset();
  const first = assessment.buildDiagnostic({ count: 6, topicSlugs: ['array', 'linked-list'] });
  const second = assessment.buildDiagnostic({ count: 6, topicSlugs: ['array', 'linked-list'] });
  check('diagnostic selection is deterministic', first.items.map((q) => q.id).join() === second.items.map((q) => q.id).join());
  check('diagnostic contains real guided questions', first.items.length > 0 && first.items.every((q) => catalog.getQuestion(q.id)?.guided));
  check('blueprint reports topic and difficulty coverage', !!first.blueprint && !!first.blueprint.difficulties && Array.isArray(first.blueprint.topics));

  const privateCases = assessment.privateTestsFor('lc-206');
  check('generated private cases exist for supported diagnostics', privateCases.length >= 2);
  check('private cases never expose a public label', privateCases.every((t) => t.private === true && !t.input));

  const detail = catalog.getQuestion('lc-206');
  const locked = detail.tests.filter((t) => t.locked);
  check('locked catalog cases hide inputs and answers', locked.length > 0 && locked.every((t) => !('input' in t) && !('expected' in t)));
}

function testEvidenceAndRevisionPlan() {
  console.log('\nEvidence-backed readiness and revision plan');
  reset();
  const empty = assessment.topicDiagnostics();
  check('empty learner has no invented diagnostic score', empty.empty === true && empty.topics.length === 0);

  store.recordAttempt('lc-206', { passed: 2, total: 5, status: 'Wrong Answer', topics: ['linked-list'] });
  store.appendEvents([{ type: 'tutor_msg', payload: { topics: ['linked-list'] } }]);
  store.setTopic('linked-list', { nextReviewAt: new Date(Date.now() - 86400000).toISOString() });

  const diagnostics = assessment.topicDiagnostics();
  const linked = diagnostics.topics.find((t) => t.slug === 'linked-list');
  check('diagnostic uses an honest readiness label', linked && ['Needs evidence', 'Foundation', 'Developing', 'Topic ready'].includes(linked.label));
  check('diagnostic cites exact learner evidence', linked && linked.evidence.attempts === 1 && linked.evidence.tutorAssists === 1);

  const now = new Date('2026-08-07T12:00:00.000Z');
  const first = assessment.revisionPlan({ days: 7, now });
  const second = assessment.revisionPlan({ days: 7, now });
  check('revision plan spans seven dated days', first.days.length === 7 && first.days.every((d) => d.date));
  check('revision plan is stable for the same evidence', JSON.stringify(first) === JSON.stringify(second));
  check('weak topic is scheduled with a real problem', first.days.some((d) => d.items.some((i) => i.topicSlug === 'linked-list' && i.problemId)));
}

function testActiveLearning() {
  console.log('\nActive-learning lessons');
  reset();
  const lesson = catalog.chapterSummaries().flatMap((chapter) => chapter.lessons)
    .find((row) => learning.lessonActivities(row.id).checkpoints.length > 0);
  const activities = learning.lessonActivities(lesson.id);
  const publicView = learning.publicActivities(activities);
  check('lesson provides retrieval checkpoints', publicView.checkpoints.length > 0);
  check('checkpoint answers are server-only', publicView.checkpoints.every((row) => row.answerIndex === undefined && row.explanation === undefined));

  const checkpoint = activities.checkpoints[0];
  const wrongIndex = checkpoint.answerIndex === 0 ? 1 : 0;
  const wrong = learning.answerCheckpoint(lesson.id, checkpoint.id, wrongIndex);
  check('wrong retrieval answer is recorded honestly', wrong.correct === false && wrong.progress.attempts === 1);
  check('checkpoint does not complete the lesson', (store.getProgress().lessons[lesson.id] || {}).status !== 'completed');

  const correct = learning.answerCheckpoint(lesson.id, checkpoint.id, checkpoint.answerIndex);
  check('retry can establish retrieval evidence', correct.correct === true && correct.progress.attempts === 2);
  const topicRows = activities.topics.map((slug) => store.getTopics()[slug]).filter(Boolean);
  check('retrieval has separate topic counters', topicRows.some((row) => row.checkpointAttempts === 2 && row.checkpointCorrect === 1));
  check('retrieval does not count as a coding attempt', topicRows.every((row) => (row.attempts || 0) === 0));

  const reflection = learning.saveReflection(lesson.id, 'I would teach the invariant first and then trace one edge case.');
  check('post-lesson reflection persists', reflection.text.includes('invariant') && store.lessonLearning(lesson.id));
}

function testDurableStorage() {
  console.log('\nDurable learner storage');
  reset();
  store.saveProfile({ name: 'Recovery learner' });
  store.flush();
  store.appendEvents([{ type: 'storage_fixture', payload: {} }]);
  store.flush();
  check('atomic writes create a rotating backup', store.storageHealth().backups >= 1);

  const exported = store.exportState();
  check('export is versioned and checksummed', exported.schemaVersion === 2 && /^[a-f0-9]{64}$/.test(exported.checksum));
  const tampered = structuredClone(exported);
  tampered.data.profile.name = 'Tampered';
  let rejected = false;
  try { store.importState(tampered); } catch (err) { rejected = /checksum/.test(err.message); }
  check('tampered import is rejected', rejected);
  check('valid export imports successfully', store.importState(exported).imported === true);

  fs.writeFileSync(SCRATCH, '{broken json');
  const child = spawnSync(process.execPath, ['-e',
    `const s=require(${JSON.stringify(path.join(__dirname, '../lib/store'))}); process.stdout.write(s.getProfile().name);`], {
    env: { ...process.env, DSA_STORE_FILE: SCRATCH },
    encoding: 'utf8'
  });
  check('corrupt primary recovers from latest valid backup', child.status === 0 && child.stdout === 'Recovery learner', child.stderr);
  check('recovery rewrites a valid primary file', (() => { try { return JSON.parse(fs.readFileSync(SCRATCH, 'utf8')).version === 2; } catch { return false; } })());
}

function testPlacementEvidence() {
  console.log('\nComplete placement preparation');
  reset();
  const empty = placement.dashboard();
  check('placement starts without fabricated progress', empty.empty === true && empty.tracks.every((track) => track.percent === 0));
  check('hiring probability is never invented', empty.calibration.hiringProbability === null
    && empty.calibration.status === 'insufficient-real-outcomes');

  let invalid = false;
  try { placement.addEvidence({ trackId: 'system-design', itemId: 'api-data-model', rating: 5 }); } catch { invalid = true; }
  check('invalid self-rating is rejected', invalid);
  placement.addEvidence({ trackId: 'system-design', itemId: 'api-data-model', rating: 3, note: 'Designed the mock API and data model.' });
  const design = placement.dashboard().tracks.find((track) => track.id === 'system-design');
  check('real evidence moves only its track', design.completedItems === 1 && design.percent === 20);

  invalid = false;
  try { placement.addSimulation({ scores: { problemFraming: 4 } }); } catch { invalid = true; }
  check('incomplete interview rubric is rejected', invalid);
  const simulation = placement.addSimulation({ scores: {
    problemFraming: 4, technicalDepth: 3, structure: 2, evidence: 4, reflection: 3
  }, note: 'Practised a cache design interview.' });
  check('simulation score is transparent rubric math', simulation.score === 80);

  const round = placement.addInterviewRound({
    company: 'Example Co', role: 'Backend Engineer', stage: 'TECH_SCREENING',
    scores: { problemFraming: 4, technicalDepth: 3, structure: 3, evidence: 3, reflection: 3 }
  });
  check('interview round uses a named stage', round.stage === 'TECH_SCREENING' && round.passed === true);

  const application = placement.addApplication({ company: 'Example Co', role: 'Backend Engineer', status: 'applied' });
  placement.addOutcome({ company: application.company, role: application.role, result: 'rejected', applicationId: application.id });
  const dashboard = placement.dashboard();
  check('application and real outcome persist', dashboard.applications.length === 1 && dashboard.outcomes.length === 1);
  check('one outcome still cannot claim calibrated hiring odds', dashboard.calibration.hiringProbability === null && dashboard.calibration.sampleCount === 1);
}

// ---------------------------------------------------------------------------

async function main() {
  console.log('Learning OS fixtures (scratch store, no AI, no judge)');
  testEmptyLearner();
  testAttemptFeatures();
  testSampleRunsAreNotAttempts();
  testTutorDependence();
  testActiveCodingRatio();
  testSrsAndReviseQueue();
  await testMockRules();
  testRecordsAndGoals();
  await testNotesWithoutMercury();
  testInsightsCache();
  testAssessmentBlueprint();
  testEvidenceAndRevisionPlan();
  testActiveLearning();
  testDurableStorage();
  testPlacementEvidence();

  store.flush();
  try {
    fs.unlinkSync(SCRATCH);
  } catch { /* scratch file may already be gone */ }
  fs.rmSync(`${SCRATCH}.backups`, { recursive: true, force: true });

  console.log(`\n${checks - failures}/${checks} checks passed`);
  if (failures) {
    console.log(`${failures} FAILED`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

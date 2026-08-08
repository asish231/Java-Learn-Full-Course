/**
 * store.js — the learner's persistent state (Learning OS v2).
 *
 * Everything personal lives in one JSON document on disk (git-ignored):
 *   profile, progress, activity, memory, chats (v1)
 *   events, topics, goals, notes, mocks, records, counsel, insightsCache (v2)
 *
 * No seeded learner analytics — empty until the real learner acts.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// DSA_STORE_FILE lets the unit tests point at a scratch file instead of the
// learner's real state — never set it in normal use.
const STORE_FILE = process.env.DSA_STORE_FILE || path.join(__dirname, '..', 'data', 'store', 'state.json');
const STORE_DIR = path.dirname(STORE_FILE);
const BACKUP_DIR = `${STORE_FILE}.backups`;
const BACKUP_COUNT = 3;

const MAX_EVENTS = 8000;
const EVENT_TTL_MS = 90 * 86400000;

const EMPTY = {
  version: 2,
  profile: {
    name: '',
    goal: null,
    level: null,
    pathId: null,
    targetCompany: null,
    dailyMinutes: 30,
    counselDays: [3, 0], // Wed, Sun
    onboardedAt: null
  },
  progress: {
    lessons: {},
    problems: {},
    checkpoints: {}
  },
  activity: {},
  memory: {
    facts: [],
    strengths: {},
    weaknesses: {}
  },
  chats: {},
  events: [],
  topics: {},
  goals: null,
  notes: [],
  mocks: [],
  records: {
    bestStreak: 0,
    bestMockScore: null,
    weeks: {}
  },
  counsel: {
    daysOfWeek: [3, 0],
    lastSessionAt: null,
    history: []
  },
  placement: {
    evidence: [],
    applications: [],
    simulations: [],
    outcomes: []
  },
  insightsCache: null,
  analyticsRev: 0
};

let state = null;
let writeTimer = null;
let recoveryInfo = null;

function ensureDir() {
  if (!fs.existsSync(STORE_DIR)) fs.mkdirSync(STORE_DIR, { recursive: true });
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function backupPath(index) {
  return path.join(BACKUP_DIR, `state.${index}.json`);
}

function rotateBackups() {
  if (!fs.existsSync(STORE_FILE)) return;
  try {
    JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));
  } catch {
    return;
  }
  for (let index = BACKUP_COUNT; index > 1; index--) {
    const previous = backupPath(index - 1);
    if (fs.existsSync(previous)) fs.copyFileSync(previous, backupPath(index));
  }
  fs.copyFileSync(STORE_FILE, backupPath(1));
}

function atomicWrite(data, { backup = true } = {}) {
  ensureDir();
  if (backup) rotateBackups();
  const temp = path.join(STORE_DIR, `.state.${process.pid}.${crypto.randomBytes(4).toString('hex')}.tmp`);
  const fd = fs.openSync(temp, 'wx', 0o600);
  try {
    fs.writeFileSync(fd, data, 'utf8');
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  fs.renameSync(temp, STORE_FILE);
}

function readRecoverableState() {
  const candidates = [STORE_FILE, ...Array.from({ length: BACKUP_COUNT }, (_, index) => backupPath(index + 1))];
  const errors = [];
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    try {
      const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (file !== STORE_FILE) {
        recoveryInfo = { recoveredAt: new Date().toISOString(), source: path.basename(file), errors };
        atomicWrite(JSON.stringify(migrate(raw), null, 2), { backup: false });
      }
      return raw;
    } catch (err) {
      errors.push({ file: path.basename(file), error: err.message });
    }
  }
  if (errors.length) recoveryInfo = { recoveredAt: null, source: null, errors };
  return null;
}

function migrate(raw) {
  const base = structuredClone(EMPTY);
  if (!raw || typeof raw !== 'object') return base;

  const merged = {
    ...base,
    ...raw,
    profile: { ...base.profile, ...(raw.profile || {}) },
    progress: {
      lessons: { ...(raw.progress && raw.progress.lessons) || {} },
      problems: { ...(raw.progress && raw.progress.problems) || {} },
      checkpoints: { ...(raw.progress && raw.progress.checkpoints) || {} }
    },
    activity: { ...(raw.activity || {}) },
    memory: {
      facts: Array.isArray(raw.memory && raw.memory.facts) ? raw.memory.facts : [],
      strengths: { ...(raw.memory && raw.memory.strengths) || {} },
      weaknesses: { ...(raw.memory && raw.memory.weaknesses) || {} }
    },
    chats: { ...(raw.chats || {}) },
    events: Array.isArray(raw.events) ? raw.events : [],
    topics: { ...(raw.topics || {}) },
    goals: raw.goals || null,
    notes: Array.isArray(raw.notes) ? raw.notes : [],
    mocks: Array.isArray(raw.mocks) ? raw.mocks : [],
    records: {
      bestStreak: (raw.records && raw.records.bestStreak) || 0,
      bestMockScore: raw.records ? raw.records.bestMockScore : null,
      weeks: { ...(raw.records && raw.records.weeks) || {} }
    },
    counsel: {
      daysOfWeek: (raw.counsel && raw.counsel.daysOfWeek) || (raw.profile && raw.profile.counselDays) || [3, 0],
      lastSessionAt: (raw.counsel && raw.counsel.lastSessionAt) || null,
      history: Array.isArray(raw.counsel && raw.counsel.history) ? raw.counsel.history : []
    },
    placement: {
      evidence: Array.isArray(raw.placement && raw.placement.evidence) ? raw.placement.evidence : [],
      applications: Array.isArray(raw.placement && raw.placement.applications) ? raw.placement.applications : [],
      simulations: Array.isArray(raw.placement && raw.placement.simulations) ? raw.placement.simulations : [],
      outcomes: Array.isArray(raw.placement && raw.placement.outcomes) ? raw.placement.outcomes : []
    },
    insightsCache: raw.insightsCache || null,
    analyticsRev: Number(raw.analyticsRev) || 0,
    version: 2
  };

  if (!Array.isArray(merged.profile.counselDays)) {
    merged.profile.counselDays = merged.counsel.daysOfWeek.slice();
  }
  return merged;
}

function load() {
  if (state) return state;
  ensureDir();
  const raw = readRecoverableState();
  state = raw ? migrate(raw) : structuredClone(EMPTY);
  if (!raw && recoveryInfo) console.error('[store] No valid state or backup was recoverable.');
  return state;
}

function persist() {
  if (writeTimer) clearTimeout(writeTimer);
  writeTimer = setTimeout(() => {
    ensureDir();
    try {
      atomicWrite(JSON.stringify(state, null, 2));
    } catch (err) {
      console.error('[store] Failed to save state:', err.message);
    }
  }, 150);
}

function flush() {
  if (writeTimer) {
    clearTimeout(writeTimer);
    writeTimer = null;
  }
  ensureDir();
  atomicWrite(JSON.stringify(load(), null, 2));
}

function exportState() {
  // Export is also a persistence barrier: the downloaded copy and the primary
  // file must describe the same learner state before an import can replace it.
  flush();
  const data = structuredClone(load());
  const payload = JSON.stringify(data);
  return {
    format: 'java-dsa-studio-export',
    schemaVersion: 2,
    exportedAt: new Date().toISOString(),
    checksum: crypto.createHash('sha256').update(payload).digest('hex'),
    data
  };
}

function importState(envelope) {
  if (!envelope || envelope.format !== 'java-dsa-studio-export' || !envelope.data) {
    throw new Error('Invalid Java DSA Studio export.');
  }
  if (Number(envelope.schemaVersion) > 2) throw new Error('Export schema is newer than this app.');
  const payload = JSON.stringify(envelope.data);
  const checksum = crypto.createHash('sha256').update(payload).digest('hex');
  if (checksum !== envelope.checksum) throw new Error('Export checksum does not match its data.');
  const next = migrate(envelope.data);
  if (!next.profile || !next.progress || !Array.isArray(next.events)) throw new Error('Export is missing required learner data.');
  state = next;
  atomicWrite(JSON.stringify(state, null, 2));
  return { imported: true, version: state.version, events: state.events.length };
}

function storageHealth() {
  return {
    file: STORE_FILE,
    atomicWrites: true,
    backups: Array.from({ length: BACKUP_COUNT }, (_, index) => backupPath(index + 1)).filter(fs.existsSync).length,
    recovery: recoveryInfo
  };
}

function getPlacement() {
  return structuredClone(load().placement);
}

function addPlacementRecord(kind, payload = {}) {
  if (!['evidence', 'applications', 'simulations', 'outcomes'].includes(kind)) throw new Error('Unknown placement record kind.');
  const s = load();
  const row = {
    id: newId(kind.slice(0, 3)),
    createdAt: new Date().toISOString(),
    ...payload
  };
  s.placement[kind].push(row);
  appendEvents([{ type: `placement_${kind}`, payload: { id: row.id, trackId: row.trackId || null } }]);
  persist();
  return structuredClone(row);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function isoWeekKey(d = new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function bumpActivity(patch) {
  const s = load();
  const day = today();
  const entry = s.activity[day] || { minutes: 0, lessons: 0, solved: 0, attempts: 0 };
  for (const [key, value] of Object.entries(patch)) {
    entry[key] = (entry[key] || 0) + value;
  }
  s.activity[day] = entry;
}

/**
 * Bump the analytics revision instead of dropping the cached snapshot: the
 * cache stays readable but analytics.js sees the stale revision and recomputes.
 */
function invalidateInsights() {
  const s = load();
  s.analyticsRev = (s.analyticsRev || 0) + 1;
  return s.analyticsRev;
}

function analyticsRev() {
  return load().analyticsRev || 0;
}

function newId(prefix = 'e') {
  return `${prefix}_${Date.now().toString(36)}_${crypto.randomBytes(3).toString('hex')}`;
}

function rotateEvents(s) {
  const cutoff = Date.now() - EVENT_TTL_MS;
  let events = s.events.filter((e) => {
    const t = Date.parse(e.ts || 0);
    return !Number.isFinite(t) || t >= cutoff;
  });
  if (events.length > MAX_EVENTS) events = events.slice(events.length - MAX_EVENTS);
  s.events = events;
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

function getProfile() {
  return load().profile;
}

function saveProfile(patch) {
  const s = load();
  s.profile = { ...s.profile, ...patch };
  if (!s.profile.onboardedAt && patch.goal) s.profile.onboardedAt = new Date().toISOString();
  if (Array.isArray(patch.counselDays)) {
    s.counsel.daysOfWeek = patch.counselDays.slice();
  }
  persist();
  return s.profile;
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

function appendEvents(batch = []) {
  const s = load();
  const accepted = [];
  const list = Array.isArray(batch) ? batch : [batch];
  for (const raw of list) {
    if (!raw || !raw.type) continue;
    const ev = {
      id: raw.id || newId('ev'),
      ts: raw.ts || new Date().toISOString(),
      type: String(raw.type).slice(0, 64),
      payload: raw.payload && typeof raw.payload === 'object' ? raw.payload : {}
    };
    s.events.push(ev);
    accepted.push(ev);
    applyEventSideEffects(s, ev);
  }
  rotateEvents(s);
  invalidateInsights();
  persist();
  return { accepted: accepted.length, total: s.events.length };
}

function applyEventSideEffects(s, ev) {
  const p = ev.payload || {};
  if (ev.type === 'focus_ms' && p.ms) {
    const mins = Math.min(30, Math.round(Number(p.ms) / 60000));
    if (mins > 0) bumpActivity({ minutes: mins });
  }
  if (ev.type === 'tutor_msg') {
    const slugs = new Set([p.topicSlug, ...(Array.isArray(p.topics) ? p.topics : [])].filter(Boolean));
    for (const slug of slugs) {
      const t = ensureTopic(s, slug);
      t.tutorAssists = (t.tutorAssists || 0) + 1;
    }
  }
  if (ev.type === 'code_activity') {
    const slugs = Array.isArray(p.topics) ? p.topics : [];
    for (const slug of slugs.filter(Boolean)) {
      const t = ensureTopic(s, slug);
      t.activeMs = (t.activeMs || 0) + (Number(p.activeMs) || 0);
      t.idleMs = (t.idleMs || 0) + (Number(p.idleMs) || 0);
      t.keystrokes = (t.keystrokes || 0) + (Number(p.keystrokes) || 0);
    }
  }
}

function getEvents({ since, limit = 200, type } = {}) {
  const s = load();
  let list = s.events;
  if (since) {
    const t = Date.parse(since);
    if (Number.isFinite(t)) list = list.filter((e) => Date.parse(e.ts) >= t);
  }
  if (type) list = list.filter((e) => e.type === type);
  return list.slice(-limit);
}

// ---------------------------------------------------------------------------
// Topics rollup helpers
// ---------------------------------------------------------------------------

function ensureTopic(s, slug) {
  if (!s.topics[slug]) {
    s.topics[slug] = {
      mastery: 0,
      stabilityDays: 1,
      lastSeenAt: null,
      nextReviewAt: null,
      attempts: 0,
      passes: 0,
      tutorAssists: 0,
      avgAttempts: 0,
      sumAttemptsToPass: 0,
      passCount: 0
    };
  }
  return s.topics[slug];
}

function getTopics() {
  return load().topics;
}

function setTopic(slug, patch) {
  const s = load();
  const t = ensureTopic(s, slug);
  Object.assign(t, patch);
  invalidateInsights();
  persist();
  return t;
}

function touchTopicsFromAttempt(topics, { passed, total, solved, attemptsForProblem = 1 }) {
  const s = load();
  const list = Array.isArray(topics) ? topics : [];
  for (const slug of list) {
    if (!slug) continue;
    const t = ensureTopic(s, slug);
    t.attempts += 1;
    t.lastSeenAt = new Date().toISOString();
    if (passed > 0 && total > 0 && passed === total) t.passes += 1;
    if (solved) {
      // attempts-to-solve is per problem, not the topic's lifetime attempt count
      t.passCount = (t.passCount || 0) + 1;
      t.sumAttemptsToPass = (t.sumAttemptsToPass || 0) + Math.max(1, attemptsForProblem);
      t.avgAttempts = t.sumAttemptsToPass / t.passCount;
    }
  }
  invalidateInsights();
  persist();
}

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------

function markLesson(lessonId, status = 'in-progress', minutes = 0) {
  const s = load();
  const entry = s.progress.lessons[lessonId] || { status: 'not-started', runs: 0, viewedAt: null, completedAt: null };
  entry.status = status;
  entry.viewedAt = entry.viewedAt || new Date().toISOString();
  if (status === 'completed' && !entry.completedAt) {
    entry.completedAt = new Date().toISOString();
    bumpActivity({ lessons: 1, minutes });
  } else if (minutes) {
    bumpActivity({ minutes });
  }
  s.progress.lessons[lessonId] = entry;
  appendEvents([{
    type: status === 'completed' ? 'complete_lesson' : 'open_lesson',
    payload: { lessonId, status, minutes }
  }]);
  invalidateInsights();
  persist();
  return entry;
}

function recordLessonRun(lessonId) {
  const s = load();
  const entry = s.progress.lessons[lessonId] || { status: 'in-progress', runs: 0, viewedAt: new Date().toISOString(), completedAt: null };
  entry.runs += 1;
  if (entry.status === 'not-started') entry.status = 'in-progress';
  s.progress.lessons[lessonId] = entry;
  bumpActivity({ minutes: 2 });
  appendEvents([{ type: 'run', payload: { lessonId, kind: 'lesson' } }]);
  persist();
  return entry;
}

function recordAttempt(problemId, { passed = 0, total = 0, status = 'attempted', code = '', elapsedMs = 0, topics = [] } = {}) {
  const s = load();
  const entry = s.progress.problems[problemId] || {
    status: 'attempted', attempts: 0, solvedAt: null, bestMs: null, passed: 0, total: 0, lastCode: '', topics: []
  };
  entry.attempts += 1;
  entry.passed = passed;
  entry.total = total;
  entry.lastCode = code;
  entry.topics = topics.length ? topics : entry.topics;
  entry.lastAttemptAt = new Date().toISOString();

  const solved = status === 'Accepted';
  if (solved) {
    if (!entry.solvedAt) {
      entry.solvedAt = entry.lastAttemptAt;
      bumpActivity({ solved: 1, minutes: 10 });
      for (const topic of entry.topics) {
        s.memory.strengths[topic] = (s.memory.strengths[topic] || 0) + 1;
      }
    }
    entry.status = 'solved';
    entry.bestMs = entry.bestMs == null ? elapsedMs : Math.min(entry.bestMs, elapsedMs);
  } else {
    entry.status = entry.status === 'solved' ? 'solved' : 'attempted';
    bumpActivity({ attempts: 1, minutes: 3 });
    if (entry.attempts >= 3 && entry.status !== 'solved') {
      for (const topic of entry.topics) {
        s.memory.weaknesses[topic] = (s.memory.weaknesses[topic] || 0) + 1;
      }
    }
  }

  s.progress.problems[problemId] = entry;
  touchTopicsFromAttempt(entry.topics, { passed, total, solved, attemptsForProblem: entry.attempts });
  appendEvents([{
    type: solved ? 'submit_pass' : 'submit_fail',
    payload: {
      problemId,
      passed,
      total,
      status,
      elapsedMs,
      topics: entry.topics,
      attempts: entry.attempts
    }
  }]);
  bumpWeekly({ solved: solved ? 1 : 0, attempts: 1, accuracyPass: passed, accuracyTotal: total });
  invalidateInsights();
  persist();
  return entry;
}

function saveDraft(problemId, code) {
  const s = load();
  const entry = s.progress.problems[problemId] || {
    status: 'attempted', attempts: 0, solvedAt: null, bestMs: null, passed: 0, total: 0, lastCode: '', topics: []
  };
  entry.lastCode = code;
  s.progress.problems[problemId] = entry;
  persist();
}

/**
 * Running the sample cases is practice, not a graded attempt: it keeps the
 * draft and logs a `run` event for behaviour analytics, but never moves
 * accuracy, attempts-to-solve or mastery.
 */
function recordSampleRun(problemId, { passed = 0, total = 0, status = 'ran', code = '', elapsedMs = 0, topics = [] } = {}) {
  const s = load();
  const entry = s.progress.problems[problemId] || {
    status: 'attempted', attempts: 0, solvedAt: null, bestMs: null, passed: 0, total: 0, lastCode: '', topics: []
  };
  if (code) entry.lastCode = code;
  if (topics.length) entry.topics = topics;
  entry.lastRunAt = new Date().toISOString();
  s.progress.problems[problemId] = entry;
  bumpActivity({ minutes: 1 });
  appendEvents([{
    type: 'run',
    payload: { problemId, kind: 'samples', passed, total, status, elapsedMs, topics: entry.topics }
  }]);
  persist();
  return entry;
}

function getProgress() {
  return load().progress;
}

function recordCheckpoint(lessonId, checkpointId, { correct, answerIndex, topics = [] } = {}) {
  const s = load();
  const key = `${lessonId}:${checkpointId}`;
  const previous = s.progress.checkpoints[key] || { attempts: 0, correct: false };
  const row = {
    ...previous,
    lessonId,
    checkpointId,
    attempts: previous.attempts + 1,
    correct: previous.correct || !!correct,
    lastAnswerIndex: Number(answerIndex),
    updatedAt: new Date().toISOString()
  };
  s.progress.checkpoints[key] = row;
  for (const slug of topics.filter(Boolean)) {
    const topic = ensureTopic(s, slug);
    topic.checkpointAttempts = (topic.checkpointAttempts || 0) + 1;
    if (correct) topic.checkpointCorrect = (topic.checkpointCorrect || 0) + 1;
    topic.lastSeenAt = row.updatedAt;
  }
  appendEvents([{ type: 'checkpoint_answer', payload: { lessonId, checkpointId, correct: !!correct, topics } }]);
  persist();
  return row;
}

function saveReflection(lessonId, text, topics = []) {
  const s = load();
  const value = String(text || '').trim().slice(0, 1000);
  const key = `${lessonId}:reflection`;
  s.progress.checkpoints[key] = {
    lessonId,
    checkpointId: 'reflection',
    text: value,
    updatedAt: new Date().toISOString()
  };
  appendEvents([{ type: 'lesson_reflection', payload: { lessonId, topics, length: value.length } }]);
  persist();
  return s.progress.checkpoints[key];
}

function lessonLearning(lessonId) {
  const rows = load().progress.checkpoints;
  return Object.fromEntries(Object.entries(rows).filter(([, row]) => row.lessonId === lessonId));
}

function streak() {
  const s = load();
  const days = Object.keys(s.activity).filter((d) => {
    const a = s.activity[d];
    return a && (a.minutes > 0 || a.lessons > 0 || a.solved > 0);
  }).sort().reverse();
  if (days.length === 0) return { current: 0, longest: 0, activeDays: 0 };

  const dayMs = 86400000;
  const startOf = (d) => new Date(`${d}T00:00:00Z`).getTime();
  const todayMs = startOf(today());

  let current = 0;
  if (days[0] === today() || startOf(days[0]) === todayMs - dayMs) {
    current = 1;
    for (let i = 1; i < days.length; i++) {
      if (startOf(days[i - 1]) - startOf(days[i]) === dayMs) current++;
      else break;
    }
  }

  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    if (startOf(days[i - 1]) - startOf(days[i]) === dayMs) { run++; longest = Math.max(longest, run); }
    else run = 1;
  }

  if (current > (s.records.bestStreak || 0)) {
    s.records.bestStreak = current;
    persist();
  }

  return { current, longest: Math.max(longest, s.records.bestStreak || 0), activeDays: days.length };
}

function summary() {
  const s = load();
  const problems = Object.values(s.progress.problems);
  const lessons = Object.values(s.progress.lessons);
  const solved = problems.filter((p) => p.status === 'solved');

  return {
    lessonsCompleted: lessons.filter((l) => l.status === 'completed').length,
    lessonsStarted: lessons.length,
    problemsSolved: solved.length,
    problemsAttempted: problems.length,
    totalAttempts: problems.reduce((sum, p) => sum + p.attempts, 0),
    minutes: Object.values(s.activity).reduce((sum, a) => sum + (a.minutes || 0), 0),
    streak: streak(),
    activity: s.activity,
    strengths: s.memory.strengths,
    weaknesses: s.memory.weaknesses
  };
}

// ---------------------------------------------------------------------------
// Weekly records
// ---------------------------------------------------------------------------

function bumpWeekly({ xp = 0, solved = 0, attempts = 0, accuracyPass = 0, accuracyTotal = 0 } = {}) {
  const s = load();
  const key = isoWeekKey();
  const w = s.records.weeks[key] || { xp: 0, solved: 0, attempts: 0, accuracyPass: 0, accuracyTotal: 0 };
  w.xp += xp;
  w.solved += solved;
  w.attempts += attempts;
  w.accuracyPass += accuracyPass;
  w.accuracyTotal += accuracyTotal;
  s.records.weeks[key] = w;
}

function getRecords() {
  const s = load();
  const st = streak();
  const keys = Object.keys(s.records.weeks).sort();
  const thisKey = isoWeekKey();
  const prevKey = keys.filter((k) => k < thisKey).pop();
  const thisWeek = s.records.weeks[thisKey] || { xp: 0, solved: 0, attempts: 0 };
  const lastWeek = (prevKey && s.records.weeks[prevKey]) || { xp: 0, solved: 0, attempts: 0 };
  return {
    bestStreak: Math.max(s.records.bestStreak || 0, st.longest || 0),
    bestMockScore: s.records.bestMockScore,
    thisWeek,
    lastWeek,
    weeks: s.records.weeks,
    currentStreak: st.current
  };
}

function updateBestMock(score) {
  const s = load();
  if (s.records.bestMockScore == null || score > s.records.bestMockScore) {
    s.records.bestMockScore = score;
  }
  bumpWeekly({ xp: Math.round(score), solved: 0 });
  persist();
  return s.records;
}

// ---------------------------------------------------------------------------
// Goals
// ---------------------------------------------------------------------------

function getGoals() {
  return load().goals;
}

function setGoals(goals) {
  const s = load();
  s.goals = goals;
  persist();
  return s.goals;
}

function patchGoalItem(id, done) {
  const s = load();
  if (!s.goals || !Array.isArray(s.goals.items)) return null;
  const item = s.goals.items.find((g) => g.id === id);
  if (!item) return null;
  item.done = !!done;
  if (item.done) {
    s.goals.xp = (s.goals.xp || 0) + 10;
    bumpWeekly({ xp: 10 });
  }
  persist();
  return s.goals;
}

// ---------------------------------------------------------------------------
// Notes / mocks / counsel / insights cache
// ---------------------------------------------------------------------------

function getNotes(limit = 50) {
  return load().notes.slice(-limit).reverse();
}

function addNote(note) {
  const s = load();
  const row = {
    id: note.id || newId('note'),
    ts: note.ts || new Date().toISOString(),
    source: note.source || 'session',
    title: (note.title || 'Session note').slice(0, 120),
    bodyMd: (note.bodyMd || '').slice(0, 8000),
    topicSlugs: Array.isArray(note.topicSlugs) ? note.topicSlugs : []
  };
  s.notes.push(row);
  if (s.notes.length > 200) s.notes = s.notes.slice(-200);
  persist();
  return row;
}

function getMocks() {
  return load().mocks;
}

function getMock(id) {
  return load().mocks.find((m) => m.id === id) || null;
}

function saveMock(mock) {
  const s = load();
  const idx = s.mocks.findIndex((m) => m.id === mock.id);
  if (idx >= 0) s.mocks[idx] = mock;
  else s.mocks.push(mock);
  if (s.mocks.length > 100) s.mocks = s.mocks.slice(-100);
  invalidateInsights();
  persist();
  return mock;
}

function getCounsel() {
  return load().counsel;
}

function saveCounsel(patch) {
  const s = load();
  s.counsel = { ...s.counsel, ...patch };
  persist();
  return s.counsel;
}

function getInsightsCache() {
  return load().insightsCache;
}

function setInsightsCache(cache) {
  const s = load();
  s.insightsCache = cache;
  persist();
  return cache;
}

// ---------------------------------------------------------------------------
// Tutor memory & chats
// ---------------------------------------------------------------------------

function getMemory() {
  return load().memory;
}

function rememberFact(text, kind = 'note') {
  const s = load();
  if (!text || !text.trim()) return s.memory;
  const clean = text.trim().slice(0, 400);
  if (!s.memory.facts.some((f) => f.text === clean)) {
    s.memory.facts.push({ text: clean, kind, createdAt: new Date().toISOString() });
    if (s.memory.facts.length > 60) s.memory.facts.shift();
    persist();
  }
  return s.memory;
}

function forgetFact(index) {
  const s = load();
  s.memory.facts.splice(index, 1);
  persist();
  return s.memory;
}

function getChat(contextKey) {
  return load().chats[contextKey] || [];
}

function appendChat(contextKey, message) {
  const s = load();
  const thread = s.chats[contextKey] || [];
  thread.push({ ...message, at: new Date().toISOString() });
  s.chats[contextKey] = thread.slice(-40);
  persist();
  return s.chats[contextKey];
}

function clearChat(contextKey) {
  const s = load();
  delete s.chats[contextKey];
  persist();
}

function resetAll() {
  state = structuredClone(EMPTY);
  flush();
  return state;
}

function getRawState() {
  return load();
}

module.exports = {
  getProfile, saveProfile,
  markLesson, recordLessonRun, recordAttempt, recordSampleRun, saveDraft, getProgress, recordCheckpoint, saveReflection, lessonLearning, summary, streak,
  getMemory, rememberFact, forgetFact,
  getChat, appendChat, clearChat,
  resetAll, STORE_FILE, flush,
  appendEvents, getEvents,
  getTopics, setTopic, ensureTopic: (slug) => ensureTopic(load(), slug),
  getGoals, setGoals, patchGoalItem,
  getNotes, addNote,
  getMocks, getMock, saveMock,
  getRecords, updateBestMock, bumpWeekly, isoWeekKey,
  getCounsel, saveCounsel,
  getInsightsCache, setInsightsCache, invalidateInsights, analyticsRev,
  getRawState, exportState, importState, storageHealth, getPlacement, addPlacementRecord, today, newId
};

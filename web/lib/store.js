/**
 * store.js — the learner's persistent state.
 *
 * Everything personal lives in one JSON document on disk (git-ignored):
 *   profile   — onboarding answers: goal, level, daily minutes, target company
 *   progress  — per lesson / per problem status, attempts, timestamps
 *   activity  — day → minutes + counts, used for the streak and heatmap
 *   memory    — what the AI tutor remembers about the learner
 *   chats     — tutor conversations, keyed by context (problem/lesson/global)
 */
const fs = require('fs');
const path = require('path');

const STORE_DIR = path.join(__dirname, '..', 'data', 'store');
const STORE_FILE = path.join(STORE_DIR, 'state.json');

const EMPTY = {
  version: 1,
  profile: {
    name: '',
    goal: null,            // 'interview' | 'fundamentals' | 'backend' | 'contest'
    level: null,           // 'beginner' | 'some-java' | 'confident'
    pathId: null,
    targetCompany: null,
    dailyMinutes: 30,
    onboardedAt: null
  },
  progress: {
    lessons: {},           // lessonId  -> { status, viewedAt, completedAt, runs }
    problems: {}           // problemId -> { status, attempts, solvedAt, bestMs, lastCode, passed, total }
  },
  activity: {},            // 'YYYY-MM-DD' -> { minutes, lessons, solved, attempts }
  memory: {
    facts: [],             // [{ text, kind, createdAt }]
    strengths: {},         // topic -> score
    weaknesses: {}         // topic -> score
  },
  chats: {}                // contextKey -> [{ role, content, at }]
};

let state = null;
let writeTimer = null;

function ensureDir() {
  if (!fs.existsSync(STORE_DIR)) fs.mkdirSync(STORE_DIR, { recursive: true });
}

function load() {
  if (state) return state;
  ensureDir();
  if (fs.existsSync(STORE_FILE)) {
    try {
      state = { ...structuredClone(EMPTY), ...JSON.parse(fs.readFileSync(STORE_FILE, 'utf8')) };
    } catch (err) {
      console.error('[store] Corrupt state file, starting fresh:', err.message);
      state = structuredClone(EMPTY);
    }
  } else {
    state = structuredClone(EMPTY);
  }
  return state;
}

function persist() {
  if (writeTimer) clearTimeout(writeTimer);
  writeTimer = setTimeout(() => {
    ensureDir();
    try {
      fs.writeFileSync(STORE_FILE, JSON.stringify(state, null, 2));
    } catch (err) {
      console.error('[store] Failed to save state:', err.message);
    }
  }, 150);
}

function today() {
  return new Date().toISOString().slice(0, 10);
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
  persist();
  return s.profile;
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

function getProgress() {
  return load().progress;
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

  return { current, longest, activeDays: days.length };
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
  // keep threads bounded — the long-term memory lives in `memory.facts`
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
  persist();
  return state;
}

module.exports = {
  getProfile, saveProfile,
  markLesson, recordLessonRun, recordAttempt, saveDraft, getProgress, summary, streak,
  getMemory, rememberFact, forgetFact,
  getChat, appendChat, clearChat,
  resetAll, STORE_FILE
};

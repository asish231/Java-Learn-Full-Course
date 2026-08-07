/**
 * tutor.js — the AI tutor (Mercury 2, Inception Labs).
 *
 * The tutor is deliberately more than a chat box:
 *   • it knows the learner (profile + progress + long-term memory facts),
 *   • it knows the current context (chapter/lesson or problem + editor code +
 *     the exact test cases that just failed),
 *   • it can pull real questions out of the local question bank, and
 *   • it can build a "learn this first" plan from the curriculum before the
 *     learner attempts a problem.
 *
 * Conversations and memory are persisted by lib/store.js, so the tutor still
 * remembers you after a restart.
 */
const https = require('https');
const fs = require('fs');
const path = require('path');
const store = require('./store');
const catalog = require('./catalog');
const { topicLabel, getChapter } = require('../data/curriculum');

// ---------------------------------------------------------------------------
// Configuration — never hardcode the key, read it from the environment/.env
// ---------------------------------------------------------------------------

function loadDotEnv() {
  const envFile = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envFile)) return;
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }
}
loadDotEnv();

const API_HOST = process.env.MERCURY_API_HOST || 'api.inceptionlabs.ai';
const API_PATH = '/v1/chat/completions';
const MODEL = process.env.MERCURY_MODEL || 'mercury-2';

function apiKey() {
  return process.env.MERCURY_API_KEY || '';
}

function isConfigured() {
  return apiKey().length > 0;
}

// ---------------------------------------------------------------------------
// HTTP plumbing
// ---------------------------------------------------------------------------

function request(payload, { onChunk } = {}) {
  return new Promise((resolve, reject) => {
    if (!isConfigured()) {
      return reject(new Error('AI tutor is not configured: set MERCURY_API_KEY in web/.env'));
    }

    const body = JSON.stringify(payload);
    const req = https.request({
      hostname: API_HOST,
      port: 443,
      path: API_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey()}`,
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let raw = '';
      let text = '';
      let buffer = '';

      res.on('data', (chunk) => {
        const str = chunk.toString('utf8');
        if (!payload.stream) { raw += str; return; }

        buffer += str;
        const parts = buffer.split('\n\n');
        buffer = parts.pop();
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith('data:')) continue;
          const data = line.slice(5).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices && parsed.choices[0] && parsed.choices[0].delta;
            if (delta && delta.content) {
              text += delta.content;
              if (onChunk) onChunk(delta.content);
            }
          } catch (_) { /* partial frame — ignore */ }
        }
      });

      res.on('end', () => {
        if (payload.stream) return resolve(text);
        try {
          const parsed = JSON.parse(raw);
          if (parsed.error) return reject(new Error(parsed.error.message || 'Mercury API error'));
          const choice = parsed.choices && parsed.choices[0];
          resolve(choice && choice.message ? choice.message.content : '');
        } catch (err) {
          reject(new Error(`Could not parse the Mercury response: ${err.message}`));
        }
      });
    });

    req.on('error', (err) => reject(new Error(`Mercury connection failed: ${err.message}`)));
    req.setTimeout(90000, () => { req.destroy(); reject(new Error('Mercury request timed out.')); });
    req.write(body);
    req.end();
  });
}

// ---------------------------------------------------------------------------
// Prompt construction
// ---------------------------------------------------------------------------

const PERSONA = `You are "Mercury", the in-editor coding tutor of Java DSA Studio.

How you teach:
- Socratic first. Nudge with a question or the next smallest idea; never dump a full solution unless the learner explicitly asks for it (or has clearly failed several attempts).
- Be concrete and short. Prefer 3-8 sentences plus a small Java snippet over an essay.
- Always connect the problem to a named pattern (two pointers, sliding window, monotonic stack, BFS, bottom-up DP, ...) and to Big-O.
- When the learner's code is provided, review THEIR code: point at the exact line/idea that breaks, not at a generic solution.
- When a test case failed, reason about that specific input.
- If the learner is missing a prerequisite, say so plainly and name the chapter to read first.
- Use Markdown: **bold** for key terms, \`code\` inline, fenced \`\`\`java blocks for code.
- Never invent LeetCode problems: only reference questions that appear in the provided context.`;

const MODE_INSTRUCTIONS = {
  chat: '',
  explain: 'Restate the current problem in plain language: what the input is, what the output must be, and one tiny worked example. Do NOT reveal the algorithm yet — end by asking the learner what approach they would try.',
  hint: 'Give exactly ONE next hint, the smallest useful one, based on how far the learner already got in their code. Do not give the full algorithm and do not write the solution.',
  review: 'Review the learner\'s current code. State (1) what is correct, (2) the first real bug or inefficiency with the exact line, (3) the fix as a short snippet, (4) the resulting time/space complexity. If tests failed, explain the failing case concretely.',
  prep: 'Build a short, ordered study plan that gets the learner ready for this problem: which chapter/lesson to read, which easier questions from the provided list to solve first, and what to be able to do before trying the target problem. Use a numbered list, max 6 steps, one line each.',
  debrief: 'The learner just solved the problem. In under 120 words: name the pattern, state the optimal complexity, mention one alternative approach and one closely related question they should try next (only from the provided list).'
};

function memoryBlock() {
  const memory = store.getMemory();
  const profile = store.getProfile();
  const stats = store.summary();

  const lines = [];
  lines.push('[LEARNER PROFILE]');
  if (profile.name) lines.push(`Name: ${profile.name}`);
  if (profile.goal) lines.push(`Goal: ${profile.goal}`);
  if (profile.level) lines.push(`Self-declared level: ${profile.level}`);
  if (profile.pathId) lines.push(`Active learning path: ${profile.pathId}`);
  if (profile.targetCompany) lines.push(`Target company: ${profile.targetCompany}`);
  lines.push(`Daily budget: ${profile.dailyMinutes} min`);
  lines.push(`Progress: ${stats.problemsSolved} problems solved, ${stats.lessonsCompleted} lessons completed, ${stats.streak.current}-day streak.`);

  const strong = Object.entries(stats.strengths).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const weak = Object.entries(stats.weaknesses).sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (strong.length) lines.push(`Comfortable with: ${strong.map(([t]) => topicLabel(t)).join(', ')}`);
  if (weak.length) lines.push(`Struggles with: ${weak.map(([t]) => topicLabel(t)).join(', ')}`);

  if (memory.facts.length) {
    lines.push('');
    lines.push('[WHAT YOU REMEMBER ABOUT THIS LEARNER]');
    for (const fact of memory.facts.slice(-15)) lines.push(`- ${fact.text}`);
  }
  return lines.join('\n');
}

function contextBlock(context = {}) {
  const lines = [];

  if (context.problemId) {
    const question = catalog.getQuestion(context.problemId, context.companySlug);
    if (question) {
      lines.push('[CURRENT PROBLEM]');
      lines.push(`#${question.number} ${question.title} (${question.difficulty})${question.companyName ? ` — asked at ${question.companyName}` : ''}`);
      if (question.topics.length) lines.push(`Topics: ${question.topics.map(topicLabel).join(', ')}`);
      lines.push(question.statement);
      if (question.examples.length) {
        lines.push('Examples:');
        for (const ex of question.examples.slice(0, 3)) {
          lines.push(`  input: ${ex.input} -> output: ${ex.output}`);
        }
      }
      if (question.constraints.length) lines.push(`Constraints: ${question.constraints.join('; ')}`);

      const progress = store.getProgress().problems[question.id];
      if (progress) {
        lines.push(`Learner history on this problem: ${progress.attempts} attempt(s), status ${progress.status}, last score ${progress.passed}/${progress.total}.`);
      }

      if (question.prerequisites && question.prerequisites.length) {
        lines.push(`Chapters covering the required background: ${question.prerequisites.map((p) => p.title).join(' | ')}`);
      }

      const related = question.topics.flatMap((t) => catalog.questionsForTopic(t, 4));
      const unique = [...new Map(related.map((q) => [q.id, q])).values()]
        .filter((q) => q.id !== question.id).slice(0, 8);
      if (unique.length) {
        lines.push(`Questions available in this app on the same topics: ${unique.map((q) => `#${q.number} ${q.title} (${q.difficulty})`).join(', ')}`);
      }
    }
  }

  if (context.lessonId) {
    const lesson = catalog.getLesson(context.lessonId);
    if (lesson) {
      lines.push('[CURRENT LESSON]');
      lines.push(`${lesson.chapterTitle} → ${lesson.title} (${lesson.levelName})`);
      lines.push(lesson.summary);
      if (lesson.api.length) lines.push(`Methods in this file: ${lesson.api.join(', ')}`);
      lines.push('Lesson source (truncated):');
      lines.push('```java');
      lines.push(String(lesson.code).slice(0, 3000));
      lines.push('```');
    }
  }

  if (context.chapterId) {
    const chapter = getChapter(context.chapterId);
    if (chapter) {
      lines.push('[CURRENT CHAPTER]');
      lines.push(`${chapter.title}: ${chapter.summary}`);
      lines.push(`Objectives: ${chapter.objectives.join('; ')}`);
    }
  }

  if (context.code && context.code.trim()) {
    lines.push('[LEARNER CODE IN THE EDITOR]');
    lines.push('```java');
    lines.push(String(context.code).slice(0, 4000));
    lines.push('```');
  }

  if (context.lastRun) {
    const run = context.lastRun;
    lines.push('[LAST RUN RESULT]');
    lines.push(`Status: ${run.status}${run.total ? ` (${run.passed}/${run.total} cases passed)` : ''}`);
    if (run.error) lines.push(`Error: ${String(run.error).slice(0, 800)}`);
    for (const result of (run.results || []).filter((r) => !r.passed).slice(0, 3)) {
      lines.push(`Failing case "${result.name}": input ${result.input} → expected ${result.expected}, got ${result.actual || '(nothing)'}${result.error ? ` [${result.error.split('\n')[0]}]` : ''}`);
    }
  }

  return lines.join('\n');
}

function buildMessages({ message, context = {}, mode = 'chat', history = [] }) {
  // One consolidated system message: several models weight only the first one.
  const system = [PERSONA, '', memoryBlock()];
  const modeInstruction = MODE_INSTRUCTIONS[mode] || '';
  if (modeInstruction) system.push('', `[MODE: ${mode}] ${modeInstruction}`);

  const messages = [{ role: 'system', content: system.join('\n') }];

  for (const turn of history.slice(-10)) {
    if (turn.role === 'user' || turn.role === 'assistant') {
      messages.push({ role: turn.role, content: turn.content });
    }
  }

  // The live context travels with the *user* turn so it is never treated as
  // background chatter — this is what the learner is looking at right now.
  const ctx = contextBlock(context);
  messages.push({
    role: 'user',
    content: ctx
      ? `${ctx}\n\n---\nLearner asks: ${message}\n(Answer using the context above. Do not ask them to paste code that is already shown.)`
      : message
  });

  return messages;
}

function contextKey(context = {}) {
  if (context.problemId) return `problem:${context.problemId}`;
  if (context.lessonId) return `lesson:${context.lessonId}`;
  if (context.chapterId) return `chapter:${context.chapterId}`;
  return 'global';
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const DEFAULT_PROMPTS = {
  explain: 'Explain this problem to me in plain language.',
  hint: 'Give me the next hint based on what I have written so far.',
  review: 'Review my current code.',
  prep: 'What should I learn before solving this? Build me a plan.',
  debrief: 'I solved it — what should I take away, and what should I do next?'
};

/**
 * Ask the tutor. When `onChunk` is supplied the answer is streamed.
 */
async function ask({ message, context = {}, mode = 'chat' }, onChunk) {
  const key = contextKey(context);
  const history = store.getChat(key);
  const prompt = (message && message.trim()) || DEFAULT_PROMPTS[mode] || 'Help me with this.';

  const reply = await request({
    model: MODEL,
    messages: buildMessages({ message: prompt, context, mode, history }),
    max_tokens: 1400,
    temperature: mode === 'review' ? 0.3 : 0.6,
    stream: !!onChunk
  }, { onChunk });

  store.appendChat(key, { role: 'user', content: prompt, mode });
  store.appendChat(key, { role: 'assistant', content: reply, mode });

  // Every few turns, distil durable facts about the learner (fire and forget).
  const thread = store.getChat(key);
  if (thread.length % 8 === 0) distilMemory(thread).catch(() => {});

  return { reply, contextKey: key };
}

/** Ask the model for durable notes about the learner and store them. */
async function distilMemory(thread) {
  const transcript = thread.slice(-10)
    .map((m) => `${m.role === 'user' ? 'Learner' : 'Tutor'}: ${m.content}`)
    .join('\n')
    .slice(0, 6000);

  const raw = await request({
    model: MODEL,
    max_tokens: 300,
    temperature: 0.2,
    messages: [
      {
        role: 'system',
        content: 'Extract durable facts about the learner from this tutoring transcript: misconceptions, preferences, goals, topics they struggle with or have mastered. Ignore anything transient. Reply with JSON only: {"facts": ["...", "..."]} — at most 3 short facts, or an empty array.'
      },
      { role: 'user', content: transcript }
    ]
  });

  const match = String(raw).match(/\{[\s\S]*\}/);
  if (!match) return;
  const parsed = JSON.parse(match[0]);
  for (const fact of parsed.facts || []) store.rememberFact(fact, 'distilled');
}

/**
 * Deterministic study plan: curriculum chapters + easier questions on the same
 * topics, assembled from local data (no model call needed).
 */
function prepPlan(problemId, companySlug) {
  const question = catalog.getQuestion(problemId, companySlug);
  if (!question) return null;

  const progress = store.getProgress();
  const chapters = (question.prerequisites || []).map((prereq) => {
    const chapter = getChapter(prereq.chapterId);
    const lessons = (catalog.getChapterDetail(prereq.chapterId) || { lessons: [] }).lessons
      .filter((l) => l.level > 0)
      .map((l) => ({
        id: l.id, title: l.title, level: l.level, levelName: l.levelName,
        minutes: l.minutes,
        status: (progress.lessons[l.id] || {}).status || 'not-started'
      }));
    return {
      chapterId: prereq.chapterId,
      icon: chapter ? chapter.icon : '📘',
      title: prereq.title,
      summary: prereq.summary,
      why: chapter ? chapter.why : '',
      topics: prereq.topics,
      lessons
    };
  });

  const difficultyRank = { Easy: 0, Medium: 1, Hard: 2 };
  const warmups = [...new Map(
    (question.topics || [])
      .flatMap((topic) => catalog.questionsForTopic(topic, 6))
      .map((q) => [q.id, q])
  ).values()]
    .filter((q) => q.id !== question.id && difficultyRank[q.difficulty] < difficultyRank[question.difficulty])
    .sort((a, b) => difficultyRank[a.difficulty] - difficultyRank[b.difficulty])
    .slice(0, 5)
    .map((q) => ({ ...q, status: (progress.problems[q.id] || {}).status || 'not-started' }));

  return {
    problem: {
      id: question.id, number: question.number, title: question.title,
      difficulty: question.difficulty, topics: question.topics
    },
    chapters,
    warmups,
    ready: chapters.every((c) => c.lessons.some((l) => l.status === 'completed')) && warmups.every((w) => w.status === 'solved')
  };
}

module.exports = { ask, prepPlan, isConfigured, contextKey, MODEL };

/** Thin API client for the studio backend. */

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    // Keep the server's status/code so callers can react (e.g. an expired mock).
    const error = new Error(data.error || `Request failed (${res.status})`);
    error.status = res.status;
    error.code = data.code || '';
    error.data = data;
    throw error;
  }
  return data;
}

export const api = {
  bootstrap: () => request('/api/bootstrap'),

  saveProfile: (patch) => request('/api/profile', { method: 'POST', body: patch }),
  progress: () => request('/api/progress'),
  nextUp: () => request('/api/next-up'),
  markLesson: (lessonId, status = 'completed', minutes = 0) =>
    request('/api/progress/lesson', { method: 'POST', body: { lessonId, status, minutes } }),
  saveDraft: (problemId, code) =>
    request('/api/progress/draft', { method: 'POST', body: { problemId, code } }),
  resetProgress: () => request('/api/progress/reset', { method: 'POST', body: {} }),
  exportData: () => request('/api/data/export'),
  importData: (envelope) => request('/api/data/import', { method: 'POST', body: envelope }),
  storageHealth: () => request('/api/data/health'),
  placement: () => request('/api/placement'),
  addPlacementEvidence: (body) => request('/api/placement/evidence', { method: 'POST', body }),
  addApplication: (body) => request('/api/placement/applications', { method: 'POST', body }),
  addSimulation: (body) => request('/api/placement/simulations', { method: 'POST', body }),
  addOutcome: (body) => request('/api/placement/outcomes', { method: 'POST', body }),

  chapters: () => request('/api/chapters'),
  chapter: (id) => request(`/api/chapters/${encodeURIComponent(id)}`),
  lesson: (lessonId) => request(`/api/lessons/${lessonId}`),
  answerCheckpoint: (lessonId, checkpointId, answerIndex) => request(
    `/api/lessons/${lessonId}/checkpoints/${encodeURIComponent(checkpointId)}`,
    { method: 'POST', body: { answerIndex } }),
  saveReflection: (lessonId, text) => request(`/api/lessons/${lessonId}/reflection`, { method: 'POST', body: { text } }),

  companies: (search = '') => request(`/api/companies?search=${encodeURIComponent(search)}`),
  companyQuestions: (slug, period = 'all') =>
    request(`/api/companies/${encodeURIComponent(slug)}/questions?period=${encodeURIComponent(period)}`),
  guidedQuestions: (topic) => request(`/api/questions${topic ? `?topic=${encodeURIComponent(topic)}` : ''}`),
  question: (id, company) => request(`/api/questions/${encodeURIComponent(id)}${company ? `?company=${company}` : ''}`),
  solution: (id, company) => request(`/api/questions/${encodeURIComponent(id)}/solution${company ? `?company=${company}` : ''}`),
  plan: (id, company) => request(`/api/questions/${encodeURIComponent(id)}/plan${company ? `?company=${company}` : ''}`),

  run: (code, { stdin, lessonId } = {}) => request('/api/run', { method: 'POST', body: { code, stdin, lessonId } }),
  submit: (problemId, code, { company, runSamplesOnly } = {}) =>
    request('/api/submit', { method: 'POST', body: { problemId, code, company, runSamplesOnly } }),

  tutorThread: (context = {}) => {
    const params = new URLSearchParams(Object.entries(context).filter(([, v]) => v));
    return request(`/api/tutor/thread?${params}`);
  },
  clearTutorThread: (context = {}) => {
    const params = new URLSearchParams(Object.entries(context).filter(([, v]) => v));
    return request(`/api/tutor/thread?${params}`, { method: 'DELETE' });
  },
  memory: () => request('/api/tutor/memory'),
  remember: (text) => request('/api/tutor/memory', { method: 'POST', body: { text } }),
  forget: (index) => request(`/api/tutor/memory/${index}`, { method: 'DELETE' }),

  postEvents: (events) => request('/api/events', { method: 'POST', body: { events } }),
  insights: (refresh = false) => request(`/api/insights${refresh ? '?refresh=1' : ''}`),
  graph: () => request('/api/graph'),
  revise: () => request('/api/revise'),
  diagnostics: () => request('/api/diagnostics'),
  buildDiagnostic: (body = {}) => request('/api/diagnostics', { method: 'POST', body }),
  revisionPlan: (days = 7) => request(`/api/revision-plan?days=${encodeURIComponent(days)}`),
  goalsToday: () => request('/api/goals/today'),
  patchGoal: (id, done) => request('/api/goals/today', { method: 'POST', body: { id, done } }),
  reminder: () => request('/api/reminder'),
  startMock: (body = {}) => request('/api/mocks', { method: 'POST', body }),
  activeMock: () => request('/api/mocks/active'),
  getMock: (id) => request(`/api/mocks/${encodeURIComponent(id)}`),
  answerMock: (id, body) => request(`/api/mocks/${encodeURIComponent(id)}/answer`, { method: 'POST', body }),
  finishMock: (id) => request(`/api/mocks/${encodeURIComponent(id)}/finish`, { method: 'POST', body: {} }),
  notes: () => request('/api/notes'),
  sessionEnd: ({ context, outcomes } = {}) =>
    request('/api/sessions/end', { method: 'POST', body: { context, outcomes } }),
  counselNext: () => request('/api/counsel/next'),
  counselChat: (message) => request('/api/counsel/chat', { method: 'POST', body: { message } }),
  records: () => request('/api/records'),

  /**
   * Streaming tutor call. `onChunk` receives partial text as it arrives.
   * Resolves with the clean reply and an optional validated visualization.
   */
  async askTutor({ message, context, mode }, onChunk) {
    const res = await fetch('/api/tutor/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context, mode, stream: true })
    });

    if (!res.ok || !res.body) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'The tutor is unavailable right now.');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let reply = '';
    let visualization = null;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const frames = buffer.split('\n\n');
      buffer = frames.pop();
      for (const frame of frames) {
        const eventLine = frame.match(/^event:\s*(.+)$/m);
        const dataLine = frame.match(/^data:\s*([\s\S]+)$/m);
        if (!dataLine) continue;
        const payload = JSON.parse(dataLine[1]);
        const event = eventLine ? eventLine[1].trim() : 'chunk';
        if (event === 'chunk') { reply += payload.text; onChunk && onChunk(payload.text, reply); }
        else if (event === 'error') throw new Error(payload.error);
        else if (event === 'done') {
          reply = payload.reply || reply;
          visualization = payload.visualization || null;
        }
      }
    }
    return { reply, visualization };
  }
};

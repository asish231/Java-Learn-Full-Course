/** Thin API client for the studio backend. */

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
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

  chapters: () => request('/api/chapters'),
  chapter: (id) => request(`/api/chapters/${encodeURIComponent(id)}`),
  lesson: (lessonId) => request(`/api/lessons/${lessonId}`),

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

  /**
   * Streaming tutor call. `onChunk` receives partial text as it arrives.
   * Resolves with the complete reply.
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
        else if (event === 'done') reply = payload.reply || reply;
      }
    }
    return reply;
  }
};

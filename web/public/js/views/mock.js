/**
 * mock.js — timed practice exam UI (real guided bank + judge).
 * Strict mode: no tutor deep-links until finished.
 */
import { h, difficultyClass, toast } from '../util.js';
import { pageHeader, pageBody, loading, errorBox, progressBar } from '../shell.js';
import { api } from '../api.js';
import { navigate } from '../state.js';
import { track } from '../track.js';

export async function render(root, route) {
  const mockId = route.parts[1];
  if (mockId) return renderSession(root, mockId);
  return renderLobby(root);
}

async function renderLobby(root) {
  root.append(pageHeader({
    title: 'Timed mock',
    crumb: 'Real problems · real judge',
    back: '#/insights'
  }));
  const body = pageBody(loading());
  root.append(body);
  const pad = body.firstChild;

  let active;
  try {
    active = await api.activeMock();
  } catch (err) {
    pad.replaceChildren(errorBox(err.message));
    return;
  }

  const nodes = [];
  nodes.push(h('section', { class: 'hero' },
    h('h2', {}, 'Build a strict timed test'),
    h('p', {}, 'Questions come from the guided bank, preferring weak or due topics. Scores write into mastery and personal records — nothing is simulated.'),
    h('div', { class: 'hero-actions' },
      h('button', {
        class: 'btn btn-primary btn-lg',
        onClick: async () => {
          try {
            const m = await api.startMock({ count: 3, minutes: 45, strict: true });
            track('mock_start', { mockId: m.id });
            navigate(`#/mock/${m.id}`);
          } catch (e) {
            toast(e.message, 'error');
          }
        }
      }, 'Start 3-question mock (45 min)'),
      h('button', {
        class: 'btn btn-lg',
        onClick: async () => {
          try {
            const m = await api.startMock({ count: 5, minutes: 75, strict: true });
            navigate(`#/mock/${m.id}`);
          } catch (e) {
            toast(e.message, 'error');
          }
        }
      }, 'Longer mock (5 · 75 min)'),
      h('button', {
        class: 'btn btn-lg',
        onClick: async () => {
          try {
            const m = await api.startMock({ count: 6, minutes: 60, strict: true, purpose: 'diagnostic' });
            track('diagnostic_start', { mockId: m.id, blueprint: m.blueprint });
            navigate(`#/mock/${m.id}`);
          } catch (e) {
            toast(e.message, 'error');
          }
        }
      }, 'Topic diagnostic (6 · 60 min)'))));

  if (active && active.mock) {
    nodes.push(h('div', { class: 'card mt' },
      h('strong', {}, 'Active session'),
      h('p', { class: 'muted' }, `Ends ${new Date(active.mock.endsAt).toLocaleString()}`),
      h('button', {
        class: 'btn btn-primary',
        onClick: () => { navigate(`#/mock/${active.mock.id}`); }
      }, 'Resume')));
  }

  pad.replaceChildren(...nodes);
}

let activeTimer = null;

async function renderSession(root, id) {
  if (activeTimer) { clearTimeout(activeTimer); activeTimer = null; }
  root.append(pageHeader({
    title: 'Assessment in progress',
    back: '#/mock',
    actions: [
      h('button', {
        class: 'btn btn-sm btn-primary',
        id: 'mock-finish-btn',
        onClick: async () => {
          if (!confirm('Finish the mock exam? You cannot re-enter once it is scored.')) return;
          try {
            const m = await api.finishMock(id);
            toast(`Score: ${m.score}%`, 'success');
            navigate(`#/mock/${id}`);
          } catch (e) {
            toast(e.message, 'error');
          }
        }
      }, 'Finish & score')
    ]
  }));

  const body = pageBody(loading('Loading mock…'));
  root.append(body);
  const pad = body.firstChild;

  let mock;
  try {
    mock = await api.getMock(id);
  } catch (err) {
    pad.replaceChildren(errorBox(err.message));
    return;
  }

  const timerEl = h('div', { class: 'stat-card' }, h('div', { class: 'stat-value', id: 'mock-timer' }, '—'), h('div', { class: 'stat-label' }, 'time left'));
  const nodes = [timerEl];
  if (mock.purpose === 'diagnostic') {
    nodes.push(h('p', { class: 'muted' },
      `Diagnostic blueprint: ${Object.entries((mock.blueprint || {}).difficulties || {}).map(([level, count]) => `${count} ${level}`).join(' · ')}. Private cases are graded without exposing their answers.`));
  }

  if (mock.status === 'finished') {
    nodes.push(h('section', { class: 'hero' },
      h('h2', {}, `Score: ${mock.score}%`),
      h('p', {}, mock.finishReason === 'timeout'
        ? 'The clock ran out, so the session was submitted automatically.'
        : 'Saved to personal records and topic mastery.'),
      h('button', { class: 'btn btn-primary', onClick: () => { navigate('#/insights'); } }, 'Open insights')));
  } else if (mock.strict) {
    nodes.push(h('p', { class: 'muted' }, 'Strict mode: open each problem, solve, then mark answered here. Tutor is for practice mode — finish the mock first.'));
  }

  const answered = Object.keys(mock.results || {}).length;
  nodes.push(h('div', { class: 'dim' }, `${answered} / ${mock.itemIds.length} answered`));
  nodes.push(progressBar((answered / Math.max(1, mock.itemIds.length)) * 100));

  for (const item of mock.items || []) {
    const r = (mock.results || {})[item.id];
    nodes.push(h('div', { class: 'card mt-s' },
      h('div', { class: 'row' },
        h('strong', {}, item.title),
        h('span', { class: difficultyClass(item.difficulty) }, item.difficulty),
        r ? h('span', {}, r.ok ? '✓' : `${r.passed}/${r.total}`) : h('span', { class: 'dim' }, 'pending')),
      h('div', { class: 'dim' }, (item.topics || []).join(' · ')),
      mock.status === 'active' ? h('div', { class: 'hero-actions mt-s' },
        h('button', {
          class: 'btn btn-sm',
          onClick: () => { navigate(`#/problem/${item.id}?mock=${id}${mock.strict ? '&exam=1' : ''}`); }
        }, 'Open in workspace'),
        h('button', {
          class: 'btn btn-sm btn-primary',
          onClick: async () => {
            try {
              const q = await api.question(item.id);
              const code = (q.progress && q.progress.draft) || q.starterCode || '';
              const out = await api.answerMock(id, { problemId: item.id, code });
              toast(out.result.status || 'Graded', out.result.status === 'Accepted' ? 'success' : 'error');
              if (out.mock && out.mock.status === 'finished') toast(`All answered · ${out.mock.score}%`, 'success');
              navigate(`#/mock/${id}`);
            } catch (e) {
              // The server owns the exam clock: a 409 means it already scored us.
              toast(e.message, e.code === 'EXPIRED' ? 'info' : 'error');
              if (e.code === 'EXPIRED') navigate(`#/mock/${id}`);
            }
          }
        }, 'Grade draft')
      ) : null));
  }

  pad.replaceChildren(...nodes.filter(Boolean));

  if (mock.status === 'active' && mock.endsAt) {
    // Trust the server's remaining time (it is what actually enforces the exam).
    const deadline = typeof mock.remainingMs === 'number'
      ? Date.now() + mock.remainingMs
      : Date.parse(mock.endsAt);
    const tick = () => {
      activeTimer = null;
      const el = document.getElementById('mock-timer');
      if (!el) return;
      const ms = deadline - Date.now();
      if (ms <= 0) {
        el.textContent = '0:00';
        api.finishMock(id).then((m) => {
          toast(`Time up · ${m.score}%`, 'success');
          navigate(`#/mock/${id}`);
        }).catch(() => {});
        return;
      }
      const m = Math.floor(ms / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      el.textContent = `${m}:${String(s).padStart(2, '0')}`;
      activeTimer = setTimeout(tick, 1000);
    };
    tick();
  }
}

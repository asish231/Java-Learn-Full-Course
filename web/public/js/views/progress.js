/**
 * progress.js — the tracker: streak, activity, per-chapter completion,
 * strong/weak topics and the notes the AI tutor keeps about you.
 */
import { h, formatMinutes, formatMinutes as fmt, toast } from '../util.js';
import { pageHeader, pageBody, statCard, progressBar, loading, errorBox } from '../shell.js';
import { api } from '../api.js';
import { state } from '../state.js';

export async function render(root, route) {
  root.append(pageHeader({
    title: 'Progress',
    crumb: state.profile.goal ? `goal: ${state.profile.goal}` : '',
    actions: [
      h('button', { class: 'btn btn-ghost btn-sm', onClick: () => resetAll(root, route) }, 'Reset progress')
    ]
  }));

  const body = pageBody(loading('Crunching your numbers…'));
  root.append(body);
  const pad = body.firstChild;

  let data;
  let memory;
  try {
    [data, memory] = await Promise.all([api.progress(), api.memory().catch(() => ({ memory: { facts: [] } }))]);
  } catch (err) {
    pad.replaceChildren(errorBox(err.message));
    return;
  }

  const { progress, summary } = data;
  const topics = state.boot.topics || {};
  const nodes = [];

  nodes.push(h('div', { class: 'grid grid-4' },
    statCard(summary.problemsSolved, 'problems solved'),
    statCard(summary.lessonsCompleted, 'lessons completed'),
    statCard(`${summary.streak.current}🔥`, `day streak (best ${summary.streak.longest})`),
    statCard(formatMinutes(summary.minutes), 'time invested')));

  // ---- activity heatmap --------------------------------------------------
  nodes.push(h('div', { class: 'section-title mt' }, 'Last 12 weeks'));
  nodes.push(h('div', { class: 'card' }, buildHeatmap(summary.activity)));

  // ---- strengths & weaknesses -------------------------------------------
  const strengths = Object.entries(summary.strengths || {}).sort((a, b) => b[1] - a[1]);
  const weaknesses = Object.entries(summary.weaknesses || {}).sort((a, b) => b[1] - a[1]);

  if (strengths.length || weaknesses.length) {
    nodes.push(h('div', { class: 'section-title mt' }, 'Topic signal'));
    nodes.push(h('div', { class: 'grid grid-2' },
      h('div', { class: 'card' },
        h('div', { style: { fontWeight: '600', marginBottom: '8px' } }, '💪 Comfortable with'),
        strengths.length
          ? h('div', { class: 'row wrap' }, ...strengths.slice(0, 10).map(([slug, count]) => topicChip(topics, slug, count)))
          : h('div', { class: 'dim' }, 'Solve a few problems and this fills in.')),
      h('div', { class: 'card' },
        h('div', { style: { fontWeight: '600', marginBottom: '8px' } }, '🎯 Needs work'),
        weaknesses.length
          ? h('div', { class: 'row wrap' }, ...weaknesses.slice(0, 10).map(([slug, count]) => topicChip(topics, slug, count)))
          : h('div', { class: 'dim' }, 'Nothing flagged yet — a topic lands here after several failed attempts.'))));
  }

  // ---- chapters ----------------------------------------------------------
  nodes.push(h('div', { class: 'section-title mt' }, 'Curriculum'));
  nodes.push(h('div', { class: 'grid' },
    ...state.chapters.map((chapter) => {
      const done = chapter.lessons.filter((lesson) => (progress.lessons[lesson.id] || {}).status === 'completed').length;
      const percent = chapter.lessons.length ? Math.round((done / chapter.lessons.length) * 100) : 0;
      return h('div', {
        class: 'lesson-row',
        onClick: () => { location.hash = `#/learn/${chapter.id}`; }
      },
      h('div', { class: 'lesson-num' }, chapter.icon),
      h('div', { style: { flex: '1', minWidth: '0' } },
        h('div', { class: 'lesson-title' }, chapter.title),
        h('div', { style: { marginTop: '6px' } }, progressBar(percent, percent === 100))),
      h('span', { class: 'dim' }, `${done}/${chapter.lessons.length}`));
    })));

  // ---- attempted problems ------------------------------------------------
  const problems = Object.entries(progress.problems || {});
  if (problems.length) {
    nodes.push(h('div', { class: 'section-title mt' }, 'Problem history'));
    nodes.push(h('div', { class: 'q-table' },
      ...problems
        .sort((a, b) => new Date(b[1].lastAttemptAt || 0) - new Date(a[1].lastAttemptAt || 0))
        .slice(0, 40)
        .map(([id, entry]) => h('div', {
          class: 'q-row',
          onClick: () => { location.hash = `#/problem/${id}`; }
        },
        h('div', { class: `q-status ${entry.status}` }, entry.status === 'solved' ? '✓' : '•'),
        h('div', { class: 'q-title' }, id.replace('lc-', '#')),
        h('span', { class: 'dim' }, `${entry.passed}/${entry.total} cases`),
        h('span', { class: 'dim' }, `${entry.attempts} attempt${entry.attempts === 1 ? '' : 's'}`)))));
  }

  // ---- tutor memory ------------------------------------------------------
  nodes.push(h('div', { class: 'section-title mt' }, 'What the tutor remembers'));
  const memoryHost = h('div', {});
  const paintMemory = (facts) => {
    memoryHost.replaceChildren(
      h('p', { class: 'dim', style: { marginBottom: '10px' } },
        'These notes travel with every tutor conversation so it does not ask you the same thing twice. Delete anything that is wrong.'),
      ...(facts.length
        ? facts.map((fact, index) => h('div', { class: 'memory-item' },
          h('span', { style: { flex: '1' } }, fact.text),
          h('button', {
            title: 'Forget this',
            onClick: async () => {
              const updated = await api.forget(index);
              paintMemory(updated.facts || []);
              toast('Forgotten.', 'info');
            }
          }, '✕')))
        : [h('div', { class: 'dim' }, 'Nothing yet — the tutor writes notes as you work with it.')]));
  };
  paintMemory((memory.memory && memory.memory.facts) || []);
  nodes.push(memoryHost);

  if (!summary.problemsAttempted && !summary.lessonsStarted) {
    nodes.push(h('div', { class: 'empty mt' },
      'Nothing tracked yet. ',
      h('a', { href: '#/learn' }, 'Open a chapter'),
      ' or ',
      h('a', { href: '#/practice' }, 'solve a guided problem'),
      ' and this page comes alive.'));
  }

  pad.replaceChildren(...nodes);
}

function topicChip(topics, slug, count) {
  const meta = topics[slug];
  return h('button', {
    class: 'chip chip-btn',
    title: meta ? `Open ${meta.label}` : slug,
    onClick: () => { if (meta) location.hash = `#/learn/${meta.chapter}`; }
  }, `${meta ? meta.label : slug} · ${count}`);
}

function buildHeatmap(activity = {}) {
  const days = 84;
  const cells = [];
  const today = new Date();

  for (let offset = days - 1; offset >= 0; offset--) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const key = date.toISOString().slice(0, 10);
    const entry = activity[key];
    const minutes = entry ? entry.minutes || 0 : 0;
    const level = minutes >= 60 ? 4 : minutes >= 30 ? 3 : minutes >= 15 ? 2 : minutes > 0 ? 1 : 0;
    cells.push(h('div', {
      class: `heat-cell${level ? ` heat-${level}` : ''}`,
      title: entry
        ? `${key}: ${fmt(minutes)} · ${entry.solved || 0} solved · ${entry.lessons || 0} lessons`
        : `${key}: nothing yet`
    }));
  }

  return h('div', {},
    h('div', { class: 'heat' }, ...cells),
    h('div', { class: 'dim', style: { marginTop: '8px' } }, 'Each square is a day. Darker means more time in the studio.'));
}

async function resetAll(root, route) {
  if (!confirm('Delete all progress, streaks and tutor memory? This cannot be undone.')) return;
  await api.resetProgress();
  toast('Progress cleared.', 'warn');
  root.replaceChildren();
  render(root, route);
}

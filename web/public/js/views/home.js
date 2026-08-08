/**
 * home.js — the dashboard: pick a path, resume where you stopped, see what to
 * do next. Everything here is one click away from actually learning something.
 */
import { h, formatMinutes, difficultyClass, toast } from '../util.js';
import { pageHeader, pageBody, statCard, progressBar, loading, errorBox } from '../shell.js';
import { api } from '../api.js';
import { state, navigate } from '../state.js';

export async function render(root, _route) {
  root.append(pageHeader({
    title: 'Java DSA Studio',
    crumb: state.profile && state.profile.name ? `Hi, ${state.profile.name}` : '',
    actions: [
      h('button', { class: 'btn btn-sm', onClick: () => { location.hash = '#/insights'; } }, 'Insights'),
      h('button', { class: 'btn btn-sm', onClick: () => { location.hash = '#/learn'; } }, 'Browse curriculum'),
      h('button', { class: 'btn btn-primary btn-sm', onClick: () => { location.hash = '#/practice'; } }, 'Practise')
    ]
  }));

  const body = pageBody(loading('Building your dashboard…'));
  root.append(body);
  const pad = body.firstChild;

  let next, goals;
  try {
    [next, goals] = await Promise.all([api.nextUp(), api.goalsToday().catch(() => null)]);
  } catch (err) {
    pad.replaceChildren(errorBox(err.message));
    return;
  }

  const summary = next.summary;
  const stats = state.stats || {};
  const nodes = [];

  if (goals && goals.items) {
    const xp = h('span', { class: 'dim' }, `${goals.xp || 0} XP today`);
    nodes.push(h('div', { class: 'card' },
      h('div', { class: 'row' },
        h('strong', {}, "Today's goals"),
        h('span', { class: 'spacer' }),
        xp,
        h('button', { class: 'btn btn-ghost btn-sm', onClick: () => navigate('#/insights') }, 'Open Insights')),
      h('div', { class: 'goal-strip mt-s' },
        ...goals.items.slice(0, 5).map((item) => {
          const label = h('span', {}, item.label);
          const row = h('label', { class: `goal-item${item.done ? ' done' : ''}` },
            h('input', {
              type: 'checkbox',
              checked: !!item.done,
              // Ticked here or on Insights — same server-side checklist.
              onChange: async (e) => {
                try {
                  const updated = await api.patchGoal(item.id, e.target.checked);
                  row.classList.toggle('done', e.target.checked);
                  xp.textContent = `${updated.xp || 0} XP today`;
                } catch (err) {
                  e.target.checked = !e.target.checked;
                  toast(err.message, 'error');
                }
              }
            }),
            label);
          return row;
        }))));
  }

  // ---- hero --------------------------------------------------------------
  const current = next.currentChapter;
  nodes.push(h('section', { class: 'hero' },
    h('h2', {}, current ? `Continue: ${current.title}` : 'Start your first chapter'),
    h('p', {}, current
      ? `${current.done} of ${current.total} lessons done. ${current.summary}`
      : 'Pick a learning path and the studio will sequence the chapters, lessons and interview questions for you.'),
    h('div', { class: 'hero-actions' },
      current && current.nextLesson
        ? h('button', {
          class: 'btn btn-primary btn-lg',
          onClick: () => { location.hash = `#/lesson/${current.nextLesson.id}`; }
        }, `▶ ${current.done ? 'Continue' : 'Start'}: ${current.nextLesson.title}`)
        : h('button', { class: 'btn btn-primary btn-lg', onClick: () => { location.hash = '#/learn'; } }, 'Choose a chapter'),
      h('button', { class: 'btn btn-lg', onClick: () => { location.hash = '#/practice'; } }, 'Solve a question'),
      current ? h('div', { style: { flex: '1 1 220px', alignSelf: 'center' } }, progressBar(current.percent)) : null)));

  // ---- stats -------------------------------------------------------------
  nodes.push(h('div', { class: 'grid grid-4' },
    statCard(summary.problemsSolved, 'problems solved'),
    statCard(summary.lessonsCompleted, 'lessons completed'),
    statCard(`${summary.streak.current}🔥`, 'day streak'),
    statCard(formatMinutes(summary.minutes), 'time invested')));

  // ---- learning paths ----------------------------------------------------
  nodes.push(h('div', { class: 'section-title mt' }, 'What do you want to learn?'));
  nodes.push(h('div', { class: 'grid grid-2' },
    ...(state.boot.paths || []).map((path) => h('div', {
      class: `card card-hover path-card${state.profile.pathId === path.id ? ' active' : ''}`,
      onClick: async () => {
        state.profile = await api.saveProfile({ pathId: path.id });
        toast(`Path set to ${path.title} — your dashboard now follows it.`, 'success');
        navigate('#/');
      }
    },
    h('div', { class: 'row' },
      h('span', { class: 'path-icon' }, path.icon),
      h('div', {},
        h('div', { style: { fontWeight: '600' } }, path.title),
        h('div', { class: 'dim' }, `${path.tagline} · ~${path.weeks} weeks`))),
    h('p', { class: 'muted mt-s' }, path.description),
    h('div', { class: 'dim mt-s' }, `${path.chapters.length} chapters`)))));

  // ---- recommended questions ---------------------------------------------
  if (next.recommended.length) {
    nodes.push(h('div', { class: 'section-title mt' }, `Questions that practise ${current ? current.title : 'your current chapter'}`));
    nodes.push(h('div', { class: 'q-table' },
      ...next.recommended.map((q) => h('div', {
        class: 'q-row',
        onClick: () => { location.hash = `#/problem/${q.id}`; }
      },
      h('div', { class: `q-status ${q.status}` }, q.status === 'solved' ? '✓' : ''),
      h('div', { class: 'q-title' }, h('span', { class: 'num' }, `#${q.number}`), q.title),
      h('span', { class: 'dim' }, (q.topics || []).slice(0, 2).join(' · ')),
      h('span', { class: difficultyClass(q.difficulty) }, q.difficulty)))));
  }

  // ---- resume ------------------------------------------------------------
  if (next.resumeProblems.length) {
    nodes.push(h('div', { class: 'section-title mt' }, 'Unfinished business'));
    nodes.push(h('div', { class: 'q-table' },
      ...next.resumeProblems.map((p) => h('div', {
        class: 'q-row',
        onClick: () => { location.hash = `#/problem/${p.id}`; }
      },
      h('div', { class: 'q-status attempted' }, '•'),
      h('div', { class: 'q-title' }, p.id.replace('lc-', '#')),
      h('span', { class: 'dim' }, `${p.passed}/${p.total} cases`),
      h('span', { class: 'dim' }, `${p.attempts} attempts`)))));
  }

  // ---- path map ----------------------------------------------------------
  nodes.push(h('div', { class: 'section-title mt' }, `Your path — ${next.path.icon} ${next.path.title}`));
  nodes.push(h('div', { class: 'grid grid-2' },
    ...next.chapters.map((chapter) => h('div', {
      class: 'card card-hover chapter-card',
      onClick: () => { location.hash = `#/learn/${chapter.id}`; }
    },
    h('div', { class: 'ch-head' },
      h('span', { class: 'ch-icon' }, chapter.icon),
      h('div', { style: { flex: '1' } },
        h('h3', {}, chapter.title),
        h('div', { class: 'dim' }, `${chapter.done}/${chapter.total} lessons · ${formatMinutes(chapter.minutes)}`))),
    progressBar(chapter.percent, chapter.percent === 100),
    h('p', { class: 'muted' }, chapter.summary)))));

  // ---- library footprint --------------------------------------------------
  nodes.push(h('div', { class: 'dim mt' },
    `Library: ${stats.chapters} chapters · ${stats.lessons} runnable lessons · ${stats.guidedProblems} guided problems with test cases · ${stats.companyQuestions.toLocaleString()} interview questions from ${stats.companies} companies.`));

  pad.replaceChildren(...nodes.filter(Boolean));
}

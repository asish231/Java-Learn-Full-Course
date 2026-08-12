/**
 * app.js — application shell.
 *
 * Owns the navigation rail, the first-run onboarding, the command palette and
 * the router. Views are lazy-loaded ES modules exporting `render(root, route)`.
 */
import { h, toast, esc } from './util.js';
import { api } from './api.js';
import { state, loadBootstrap, applyTheme, onRoute, navigate, parseRoute } from './state.js';
import { startFocus, track, endFocus, setTrackContext } from './track.js';
import { icon, iconHTML } from './icons.js';

const NAV = [
  { id: 'home', iconName: 'home', label: 'Home', hash: '#/' },
  { id: 'learn', iconName: 'learn', label: 'Learn', hash: '#/learn' },
  { id: 'practice', iconName: 'practice', label: 'Practice', hash: '#/practice' },
  { id: 'insights', iconName: 'insights', label: 'Insights', hash: '#/insights' },
  { id: 'mock', iconName: 'mock', label: 'Mock', hash: '#/mock' },
  { id: 'career', iconName: 'career', label: 'Career', hash: '#/career' },
  { id: 'placement', iconName: 'placement', label: 'Placement', hash: '#/placement' },
  { id: 'progress', iconName: 'progress', label: 'Progress', hash: '#/progress' }
];

const VIEWS = {
  home: () => import('./views/home.js'),
  learn: () => import('./views/learn.js'),
  lesson: () => import('./views/lesson.js'),
  practice: () => import('./views/practice.js'),
  problem: () => import('./views/workspace.js'),
  progress: () => import('./views/progress.js'),
  insights: () => import('./views/insights.js'),
  mock: () => import('./views/mock.js'),
  career: () => import('./views/career.js'),
  placement: () => import('./views/placement.js')
};

const appEl = document.getElementById('app');
let mainEl;
let railEl;

// ===========================================================================
// Boot
// ===========================================================================

(async function boot() {
  applyTheme(state.theme);

  try {
    await loadBootstrap();
  } catch (err) {
    appEl.innerHTML = `<div class="empty">${iconHTML('warning', { size: 20 })} Could not reach the server: ${esc(err.message)}<br><br>Start it with <code>npm start</code> in the <code>web</code> folder.</div>`;
    return;
  }

  renderShell();
  registerShortcuts();
  startFocus();
  track('app_open', {});

  if (!state.profile || !state.profile.onboardedAt) startOnboarding();

  onRoute(renderRoute);
})();

// ===========================================================================
// Shell
// ===========================================================================

function renderShell() {
  railEl = h('nav', { class: 'rail', 'aria-label': 'Primary navigation' },
    h('a', { class: 'rail-brand', href: '#/', 'aria-label': 'Java DSA Studio home' },
      h('div', { class: 'rail-logo' }, icon('logo', { size: 22 })),
      h('span', { class: 'rail-wordmark' }, 'DSA Studio')),
    h('div', { class: 'rail-nav' },
      ...NAV.map((item) => h('button', {
        class: 'rail-btn', dataset: { nav: item.id },
        'aria-label': item.label, title: item.label,
        onClick: () => { location.hash = item.hash; }
      }, icon(item.iconName, { size: 18 }), h('span', { class: 'rail-label' }, item.label)))),
    h('div', { class: 'rail-spacer' }),
    h('div', { class: 'rail-utils' },
      h('button', {
        class: 'rail-btn', 'aria-label': 'Search', title: 'Search (⌘K)',
        onClick: () => openPalette()
      }, icon('search', { size: 18 }), h('span', { class: 'rail-label' }, 'Search')),
      h('button', {
        class: 'rail-btn', 'aria-label': 'Toggle theme', title: 'Toggle theme',
        onClick: () => applyTheme(state.theme === 'dark' ? 'light' : 'dark')
      }, icon('theme', { size: 18 }), h('span', { class: 'rail-label' }, 'Theme')),
      h('button', {
        class: 'rail-btn', 'aria-label': 'Preferences', title: 'Preferences',
        onClick: () => startOnboarding(true)
      }, icon('gear', { size: 18 }), h('span', { class: 'rail-label' }, 'Prefs')))
  );

  mainEl = h('main', { class: 'main', id: 'main-content', tabindex: '-1' });
  appEl.replaceChildren(railEl, mainEl);
}

function setActiveNav(name) {
  const active = {
    home: 'home', learn: 'learn', lesson: 'learn', practice: 'practice', problem: 'practice',
    progress: 'progress', insights: 'insights', mock: 'mock', career: 'career', placement: 'placement'
  }[name];
  railEl.querySelectorAll('[data-nav]').forEach((node) => {
    const selected = node.dataset.nav === active;
    node.classList.toggle('active', selected);
    if (selected) node.setAttribute('aria-current', 'page');
    else node.removeAttribute('aria-current');
  });
}

let routeGeneration = 0;

async function renderRoute(route) {
  const gen = ++routeGeneration;
  setActiveNav(route.name);
  endFocus({ reason: 'navigate' });
  setTrackContext({});
  mainEl.replaceChildren();

  const loader = VIEWS[route.name] || VIEWS.home;
  try {
    const view = await loader();
    if (gen !== routeGeneration) return;
    await view.render(mainEl, route);
    if (gen !== routeGeneration) return;
    document.title = `${mainEl.querySelector('h1')?.textContent || 'Java DSA Studio'} — Java DSA Studio`;
  } catch (err) {
    if (gen !== routeGeneration) return;
    console.error(err);
    mainEl.replaceChildren(h('div', { class: 'empty' }, `⚠️ ${err.message}`));
  }
  mainEl.scrollTop = 0;
}

// ===========================================================================
// Onboarding
// ===========================================================================

const GOALS = [
  { id: 'interview', icon: '🎯', title: 'Crack interviews', desc: 'Patterns and company questions, fastest route to an offer.', path: 'interview-sprint' },
  { id: 'fundamentals', icon: '🧱', title: 'Learn DSA properly', desc: 'Understand every structure from first principles, in order.', path: 'zero-to-hero' },
  { id: 'backend', icon: '🏗️', title: 'Build backend systems', desc: 'HTTP server, REST, JWT, caching — written by hand in Java.', path: 'backend-builder' },
  { id: 'contest', icon: '⚡', title: 'Get faster', desc: 'Drill the patterns I already know until they are automatic.', path: 'interview-sprint' }
];

const LEVELS = [
  { id: 'beginner', icon: '🌱', title: 'New to Java', desc: 'Start with collections and syntax drills.', path: 'absolute-beginner' },
  { id: 'some-java', icon: '🧩', title: 'I know Java, not DSA', desc: 'Skip the syntax, go straight to structures and patterns.' },
  { id: 'confident', icon: '⚡', title: 'Comfortable with both', desc: 'Jump to medium/hard interview questions.' }
];

const MINUTES = [
  { id: 15, icon: '☕', title: '15 min a day', desc: 'One tier or one easy question.' },
  { id: 30, icon: '📗', title: '30 min a day', desc: 'A lesson plus a question — the sweet spot.' },
  { id: 60, icon: '🔥', title: '60 min a day', desc: 'A full chapter tier and two questions.' },
  { id: 120, icon: '🏁', title: '2h+ a day', desc: 'Interview in a few weeks — go hard.' }
];

function startOnboarding(isSettings = false) {
  const host = document.getElementById('onboarding');
  const p = state.profile || {};
  const draft = {
    name: p.name || '',
    goal: p.goal,
    level: p.level,
    dailyMinutes: p.dailyMinutes || 30,
    pathId: p.pathId
  };
  let step = 0;

  const steps = [
    {
      title: isSettings ? 'Your goal' : 'What brings you here?',
      sub: 'This decides which chapters the studio puts in front of you.',
      options: GOALS,
      key: 'goal',
      onPick: (option) => { draft.goal = option.id; if (!isSettings) draft.pathId = option.path; }
    },
    {
      title: 'Where are you starting from?',
      sub: 'Be honest — nobody sees this but you and the tutor.',
      options: LEVELS,
      key: 'level',
      onPick: (option) => { draft.level = option.id; if (option.path && !isSettings) draft.pathId = option.path; }
    },
    {
      title: 'How much time per day?',
      sub: 'Used for your daily plan and streak targets.',
      options: MINUTES,
      key: 'dailyMinutes',
      onPick: (option) => { draft.dailyMinutes = option.id; }
    }
  ];

  function paint() {
    const current = steps[step];
    host.replaceChildren(h('div', { class: 'ob-card' },
      h('div', { class: 'ob-steps' }, ...steps.map((_, index) => h('div', { class: `ob-step${index <= step ? ' done' : ''}` }))),
      h('h2', {}, current.title),
      h('p', { class: 'ob-sub' }, current.sub),
      h('div', { class: 'ob-options' },
        ...current.options.map((option) => h('button', {
          class: `ob-option${draft[current.key] === option.id ? ' selected' : ''}`,
          onClick: () => { current.onPick(option); paint(); }
        },
        h('div', { class: 'ob-title' }, option.icon, option.title),
        h('div', { class: 'ob-desc' }, option.desc)))),
      step === 0 ? h('div', { class: 'mt' },
        h('label', { class: 'dim' }, 'What should the tutor call you? (optional)'),
        h('input', {
          class: 'input mt-s', value: draft.name, placeholder: 'Your name',
          onInput: (event) => { draft.name = event.target.value; }
        })) : null,
      h('div', { class: 'ob-actions' },
        h('button', {
          class: 'btn btn-ghost',
          onClick: () => { if (step === 0) finish(true); else { step--; paint(); } }
        }, step === 0 ? (isSettings ? 'Cancel' : 'Skip setup') : '← Back'),
        h('button', {
          class: 'btn btn-primary btn-lg',
          disabled: draft[current.key] == null,
          onClick: () => { if (step === steps.length - 1) finish(false); else { step++; paint(); } }
        }, step === steps.length - 1 ? 'Start learning →' : 'Continue →'))));
    host.classList.remove('hidden');
  }

  async function finish(skipped) {
    try {
      if (skipped && !isSettings) {
        state.profile = await api.saveProfile({ goal: 'fundamentals', pathId: 'zero-to-hero' });
      } else if (!skipped) {
        state.profile = await api.saveProfile(draft);
      } else {
        host.classList.add('hidden');
        return;
      }
    } catch (err) {
      toast(err.message || 'Could not save your plan.', 'error');
      return;
    }
    host.classList.add('hidden');
    if (!skipped) toast(`You are on the ${draft.pathId || 'zero-to-hero'} path. Let's go.`, 'success');
    navigate('#/');
  }

  paint();
}

// ===========================================================================
// Command palette (⌘K)
// ===========================================================================

let paletteItems = null;
let paletteClose = null;

async function buildPaletteItems() {
  if (paletteItems) return paletteItems;
  const items = [];

  for (const item of NAV) items.push({ label: item.label, kind: 'Go to', hash: item.hash });

  for (const chapter of state.chapters) {
    items.push({ label: `${chapter.icon} ${chapter.title}`, kind: 'Chapter', hash: `#/learn/${chapter.id}` });
    for (const lesson of chapter.lessons) {
      items.push({ label: lesson.title, kind: `Lesson · ${chapter.title}`, hash: `#/lesson/${lesson.id}` });
    }
  }

  try {
    for (const question of await api.guidedQuestions()) {
      items.push({ label: `#${question.number} ${question.title}`, kind: `Problem · ${question.difficulty}`, hash: `#/problem/${question.id}` });
    }
  } catch (_) { /* offline is fine */ }

  try {
    const { companies } = await api.companies('');
    for (const company of companies.slice(0, 80)) {
      items.push({ label: company.name, kind: `Company · ${company.questionCount} questions`, hash: `#/practice/${company.id}` });
    }
  } catch (_) { /* ignore */ }

  paletteItems = items;
  return items;
}

async function openPalette() {
  if (paletteClose) paletteClose();
  const items = await buildPaletteItems();
  let filtered = items.slice(0, 40);
  let cursor = 0;

  const list = h('div', { class: 'palette-list', id: 'palette-results' });
  const input = h('input', {
    placeholder: 'Search chapters, lessons, problems, companies…',
    autofocus: 'true',
    'aria-label': 'Search the studio',
    'aria-controls': 'palette-results'
  });
  const panel = h('div', { class: 'palette', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Command palette' }, input, list);
  const backdrop = h('div', { class: 'palette-backdrop', onClick: (e) => { if (e.target === backdrop) close(); } }, panel);

  function paint() {
    list.replaceChildren(...filtered.map((item, index) => h('div', {
      class: `palette-item${index === cursor ? ' active' : ''}`,
      onClick: () => { location.hash = item.hash; close(); }
    }, item.label, h('span', { class: 'palette-kind' }, item.kind))));
  }

  function close() {
    backdrop.remove();
    document.removeEventListener('keydown', onKey);
    if (paletteClose === close) paletteClose = null;
  }
  paletteClose = close;

  function onKey(event) {
    if (event.key === 'Escape') { close(); }
    else if (event.key === 'ArrowDown') { cursor = Math.min(cursor + 1, filtered.length - 1); paint(); event.preventDefault(); }
    else if (event.key === 'ArrowUp') { cursor = Math.max(cursor - 1, 0); paint(); event.preventDefault(); }
    else if (event.key === 'Enter' && filtered[cursor]) { location.hash = filtered[cursor].hash; close(); }
  }

  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    filtered = (query
      ? items.filter((item) => item.label.toLowerCase().includes(query) || item.kind.toLowerCase().includes(query))
      : items).slice(0, 40);
    cursor = 0;
    paint();
  });

  document.addEventListener('keydown', onKey);
  document.body.append(backdrop);
  input.focus();
  paint();
}

// ===========================================================================
// Global shortcuts
// ===========================================================================

function registerShortcuts() {
  document.addEventListener('keydown', (event) => {
    const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openPalette();
      return;
    }
    if (typing) return;
    if (event.key === 'g') {
      const once = (next) => {
        document.removeEventListener('keydown', once);
        const map = { h: '#/', l: '#/learn', p: '#/practice', s: '#/progress' };
        if (map[next.key]) location.hash = map[next.key];
      };
      document.addEventListener('keydown', once);
    }
  });
}

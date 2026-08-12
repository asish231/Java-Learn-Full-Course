/**
 * practice.js — pick what to solve: guided problems (real test cases) first,
 * then any of the company question lists.
 */
import { h, difficultyClass, debounce, toast, withToast } from '../util.js';
import { pageHeader, pageBody, loading, errorBox } from '../shell.js';
import { api } from '../api.js';
import { state } from '../state.js';

const PERIOD_LABELS = {
  'thirty-days': 'Last 30 days',
  'three-months': 'Last 3 months',
  'six-months': 'Last 6 months',
  'more-than-six-months': 'Older than 6 months',
  all: 'All time'
};

export async function render(root, route) {
  if (route.parts.length > 1) return renderCompany(root, route.parts[1]);
  return renderIndex(root);
}

// ---------------------------------------------------------------------------
// Landing: guided set + company picker
// ---------------------------------------------------------------------------

async function renderIndex(root) {
  const searchInput = h('input', { class: 'input topbar-search', placeholder: 'Search companies…', 'aria-label': 'Search companies' });

  root.append(pageHeader({
    title: 'Practice',
    crumb: `${state.stats.guidedProblems} guided · ${state.stats.companyQuestions.toLocaleString()} from companies`,
    actions: [searchInput]
  }));

  const body = pageBody(loading('Loading the question bank…'));
  root.append(body);
  const pad = body.firstChild;

  let guided;
  let companyData;
  try {
    [guided, companyData] = await Promise.all([api.guidedQuestions(), api.companies('')]);
  } catch (err) {
    pad.replaceChildren(errorBox(err.message));
    return;
  }

  const filters = { topic: 'all', difficulty: 'all' };
  const topics = [...new Set(guided.flatMap((q) => q.topics || []))].sort();

  const guidedTable = h('div', { class: 'q-table' });
  const companyGrid = h('div', { class: 'grid grid-3' });

  function paintGuided() {
    const visible = guided.filter((q) =>
      (filters.topic === 'all' || (q.topics || []).includes(filters.topic))
      && (filters.difficulty === 'all' || q.difficulty === filters.difficulty));

    guidedTable.replaceChildren(...(visible.length
      ? visible.map((q) => h('div', {
        class: 'q-row',
        onClick: () => { location.hash = `#/problem/${q.id}`; }
      },
      h('div', { class: `q-status ${q.status}` }, q.status === 'solved' ? '✓' : q.status === 'attempted' ? '•' : ''),
      h('div', { class: 'q-title' },
        h('span', { class: 'num' }, `#${q.number}`),
        q.title,
        h('span', { class: 'q-badge-guided' }, `${q.testCount} tests`)),
      h('span', { class: 'dim' }, (q.topics || []).slice(0, 2).join(' · ')),
      h('span', { class: difficultyClass(q.difficulty) }, q.difficulty)))
      : [h('div', { class: 'empty' }, 'No guided question matches that filter.')]));
  }

  function chipRow(label, values, key) {
    return h('div', { class: 'row wrap', style: { marginBottom: '8px' } },
      h('span', { class: 'dim', style: { minWidth: '78px' } }, label),
      ...['all', ...values].map((value) => h('button', {
        class: `chip chip-btn${filters[key] === value ? ' active' : ''}`,
        onClick: (event) => {
          filters[key] = value;
          [...event.currentTarget.parentElement.children].forEach((node) => node.classList && node.classList.remove('active'));
          event.currentTarget.classList.add('active');
          paintGuided();
        }
      }, value === 'all' ? 'All' : value)));
  }

  function paintCompanies(companies) {
    companyGrid.replaceChildren(...companies.slice(0, 60).map((company) => h('div', {
      class: 'card card-hover company-card',
      onClick: () => { location.hash = `#/practice/${company.id}`; }
    },
    h('div', { class: 'row' },
      h('div', { class: 'company-logo' }, company.name.charAt(0)),
      h('div', {},
        h('div', { class: 'co-name' }, company.name),
        h('div', { class: 'dim' }, `${company.questionCount} questions · ${company.guidedCount} guided`))),
    company.recent && company.recent.length
      ? h('div', { class: 'dim', style: { marginTop: '6px' } }, company.recent.slice(0, 2).join(' · '))
      : null)));
  }

  const searchNote = h('div', { class: 'dim', style: { marginBottom: '10px' } },
    `${companyData.total} companies in the library — the ones people ask about most are shown first.`);

  searchInput.addEventListener('input', debounce(async () => {
    const query = searchInput.value.trim();
    try {
      const result = await api.companies(query);
      paintCompanies(query ? result.companies : result.featured);
      searchNote.textContent = query
        ? `${result.companies.length} companies match “${query}”.`
        : `${result.total} companies in the library — the ones people ask about most are shown first.`;
    } catch (err) {
      toast(err.message, 'error');
    }
  }, 250));

  pad.replaceChildren(
    h('div', { class: 'section-title' }, 'Guided problems — full statement, hints, editorial and real test cases'),
    chipRow('Topic', topics, 'topic'),
    chipRow('Difficulty', ['Easy', 'Medium', 'Hard'], 'difficulty'),
    guidedTable,
    h('div', { class: 'section-title mt' }, 'Or pick the company you are preparing for'),
    searchNote,
    companyGrid);

  paintGuided();
  paintCompanies(companyData.featured.length ? companyData.featured : companyData.companies);
}

// ---------------------------------------------------------------------------
// One company's list
// ---------------------------------------------------------------------------

async function renderCompany(root, slug) {
  let period = 'all';
  let data;

  const table = h('div', { class: 'q-table' });
  const summaryLine = h('div', { class: 'dim', style: { marginBottom: '10px' } });
  const filters = { difficulty: 'all', guidedOnly: false, text: '' };

  const textInput = h('input', { class: 'input', placeholder: 'Filter by title…', style: { width: '200px' } });

  root.append(pageHeader({
    title: 'Loading…',
    back: '#/practice',
    actions: [textInput]
  }));

  const body = pageBody(loading('Loading the question list…'));
  root.append(body);
  const pad = body.firstChild;

  async function load() {
    try {
      data = await api.companyQuestions(slug, period);
    } catch (err) {
      pad.replaceChildren(errorBox(err.message));
      return false;
    }
    return true;
  }

  if (!await load()) return;

  root.firstChild.replaceWith(pageHeader({
    title: data.company.name,
    crumb: `${data.questions.length} questions`,
    back: '#/practice',
    actions: [
      h('button', {
        class: 'btn btn-sm',
      onClick: withToast(async () => {
        state.profile = await api.saveProfile({ targetCompany: slug });
      }, { success: `${data.company.name} is now your target company.` })
      }, '🎯 Set as my target'),
      textInput
    ]
  }));

  function paint() {
    const visible = data.questions.filter((q) =>
      (filters.difficulty === 'all' || q.difficulty === filters.difficulty)
      && (!filters.guidedOnly || q.guided)
      && (!filters.text || q.title.toLowerCase().includes(filters.text)));

    const guidedCount = data.questions.filter((q) => q.guided).length;
    summaryLine.textContent =
      `${guidedCount} of ${data.questions.length} questions are fully guided with built-in test cases; the rest open with a starter file and a LeetCode link. Showing ${Math.min(visible.length, 150)}.`;

    table.replaceChildren(...(visible.length
      ? visible.slice(0, 150).map((q) => h('div', {
        class: 'q-row',
        onClick: () => { location.hash = `#/problem/${q.id}?company=${slug}`; }
      },
      h('div', { class: `q-status ${q.status}` }, q.status === 'solved' ? '✓' : q.status === 'attempted' ? '•' : ''),
      h('div', { class: 'q-title' },
        h('span', { class: 'num' }, `#${q.number}`),
        q.title,
        q.guided
          ? h('span', { class: 'q-badge-guided' }, `Guided · ${q.testCount} tests`)
          : h('span', { class: 'q-badge-lite' }, 'LeetCode')),
      h('span', { class: 'dim' }, q.frequency ? `freq ${Number(q.frequency).toFixed(1)}` : (q.acceptance || '')),
      h('span', { class: difficultyClass(q.difficulty) }, q.difficulty)))
      : [h('div', { class: 'empty' }, 'Nothing matches those filters.')]));
  }

  const periodChips = h('div', { class: 'row wrap', style: { marginBottom: '8px' } },
    h('span', { class: 'dim', style: { minWidth: '78px' } }, 'Asked in'),
    ...Object.keys(PERIOD_LABELS).map((id) => h('button', {
      class: `chip chip-btn${period === id ? ' active' : ''}`,
      onClick: async (event) => {
        period = id;
        const localPeriod = id;
        [...event.currentTarget.parentElement.children].forEach((node) => node.classList && node.classList.remove('active'));
        event.currentTarget.classList.add('active');
        table.replaceChildren(loading('Loading…'));
        if (await load() && localPeriod === period) paint();
      }
    }, PERIOD_LABELS[id])));

  const difficultyChips = h('div', { class: 'row wrap', style: { marginBottom: '8px' } },
    h('span', { class: 'dim', style: { minWidth: '78px' } }, 'Difficulty'),
    ...['all', 'Easy', 'Medium', 'Hard'].map((value) => h('button', {
      class: `chip chip-btn${filters.difficulty === value ? ' active' : ''}`,
      onClick: (event) => {
        filters.difficulty = value;
        [...event.currentTarget.parentElement.children].forEach((node) => node.classList && node.classList.remove('active'));
        event.currentTarget.classList.add('active');
        paint();
      }
    }, value === 'all' ? 'All' : value)),
    h('button', {
      class: 'chip chip-btn',
      onClick: (event) => {
        filters.guidedOnly = !filters.guidedOnly;
        event.currentTarget.classList.toggle('active', filters.guidedOnly);
        paint();
      }
    }, 'Guided only'));

  textInput.addEventListener('input', debounce(() => {
    filters.text = textInput.value.toLowerCase().trim();
    paint();
  }, 200));

  pad.replaceChildren(periodChips, difficultyChips, summaryLine, table);
  paint();
}

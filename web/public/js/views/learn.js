/**
 * learn.js — the curriculum: a browsable table of contents and a chapter page
 * that lists every lesson in the order it should be read.
 */
import { h, markdown, formatMinutes, difficultyClass, plural } from '../util.js';
import { pageHeader, pageBody, progressBar, loading, errorBox } from '../shell.js';
import { api } from '../api.js';
import { state } from '../state.js';

export async function render(root, route) {
  if (route.parts.length > 1) return renderChapter(root, route.parts[1]);
  return renderIndex(root);
}

// ---------------------------------------------------------------------------
// Table of contents
// ---------------------------------------------------------------------------

const TRACKS = [
  { id: 'all', label: 'Everything' },
  { id: 'foundations', label: 'Java foundations' },
  { id: 'dsa', label: 'Data structures & algorithms' },
  { id: 'backend', label: 'Backend engineering' },
  { id: 'career', label: 'Interview prep' },
  { id: 'cs', label: 'CS fundamentals' },
  { id: 'lld', label: 'Low-level design' }
];

async function renderIndex(root) {
  root.append(pageHeader({
    title: 'Learn',
    crumb: `${state.stats.chapters} chapters · ${state.stats.lessons} runnable lessons`,
    actions: [h('button', { class: 'btn btn-primary btn-sm', onClick: () => { location.hash = '#/practice'; } }, 'Practise instead')]
  }));

  const body = pageBody(loading('Loading the curriculum…'));
  root.append(body);
  const pad = body.firstChild;

  let chapters;
  try {
    chapters = await api.chapters();
  } catch (err) {
    pad.replaceChildren(errorBox(err.message));
    return;
  }

  let track = 'all';
  const grid = h('div', { class: 'grid grid-2' });

  const filters = h('div', { class: 'row wrap', style: { marginBottom: '18px' } },
    ...TRACKS.map((option) => h('button', {
      class: `chip chip-btn${track === option.id ? ' active' : ''}`,
      onClick: (event) => {
        track = option.id;
        [...event.currentTarget.parentElement.children].forEach((node) => node.classList.remove('active'));
        event.currentTarget.classList.add('active');
        paint();
      }
    }, option.label)));

  function paint() {
    const visible = chapters.filter((chapter) => track === 'all' || chapter.track === track);
    grid.replaceChildren(...visible.map(chapterCard));
  }

  pad.replaceChildren(
    h('p', { class: 'muted', style: { marginBottom: '16px' } },
      'Every chapter is a folder of runnable Java. Read the brief, run the code, then solve the questions that use it.'),
    filters,
    grid);
  paint();
}

function chapterCard(chapter) {
  return h('div', {
    class: 'card card-hover chapter-card',
    onClick: () => { location.hash = `#/learn/${chapter.id}`; }
  },
  h('div', { class: 'ch-head' },
    h('span', { class: 'ch-icon' }, chapter.icon),
    h('div', { style: { flex: '1' } },
      h('h3', {}, chapter.title),
      h('div', { class: 'dim' }, `${chapter.done}/${chapter.lessonCount} lessons · ${formatMinutes(chapter.minutes)}`))),
  progressBar(chapter.percent, chapter.percent === 100),
  h('p', { class: 'muted' }, chapter.summary),
  h('div', { class: 'row wrap' }, ...(chapter.topics || []).slice(0, 4).map((topic) => h('span', { class: 'chip' }, topic))));
}

// ---------------------------------------------------------------------------
// Chapter page
// ---------------------------------------------------------------------------

async function renderChapter(root, chapterId) {
  root.append(pageHeader({ title: 'Chapter', crumb: 'Loading…', back: '#/learn' }));
  const body = pageBody(loading('Loading this chapter…'));
  root.append(body);

  let chapter;
  try {
    chapter = await api.chapter(chapterId);
  } catch (err) {
    body.firstChild.replaceChildren(errorBox(err.message));
    return;
  }

  root.replaceChildren();

  const nextLesson = chapter.lessons.find((lesson) => lesson.status !== 'completed') || chapter.lessons[0];
  const done = chapter.lessons.filter((lesson) => lesson.status === 'completed').length;
  const percent = chapter.lessons.length ? Math.round((done / chapter.lessons.length) * 100) : 0;

  root.append(pageHeader({
    title: `${chapter.icon} ${chapter.title}`,
    crumb: `${done}/${chapter.lessons.length} done`,
    back: '#/learn',
    actions: [nextLesson ? h('button', {
      class: 'btn btn-primary btn-sm',
      onClick: () => { location.hash = `#/lesson/${nextLesson.id}`; }
    }, done ? 'Continue →' : 'Start →') : null].filter(Boolean)
  }));

  const tiers = chapter.lessons.filter((lesson) => lesson.level > 0);
  const deepDives = chapter.lessons.filter((lesson) => lesson.level === 0);

  const nodes = [
    h('div', { class: 'card', style: { marginBottom: '20px' } },
      h('p', { class: 'muted' }, chapter.why || chapter.summary),
      h('div', { class: 'mt-s' }, progressBar(percent, percent === 100)),
      chapter.objectives && chapter.objectives.length
        ? h('div', { class: 'mt-s' },
          h('div', { class: 'section-title', style: { marginTop: '14px' } }, 'By the end you can'),
          h('ul', { class: 'objectives' }, ...chapter.objectives.map((objective) => h('li', {}, objective))))
        : null)
  ];

  if (tiers.length) {
    nodes.push(h('div', { class: 'section-title mt' }, 'Guided tiers — read in this order'));
    nodes.push(h('div', { class: 'grid' }, ...tiers.map(lessonRow)));
  }

  if (deepDives.length) {
    nodes.push(h('div', { class: 'section-title mt' }, `Deep dives — ${plural(deepDives.length, 'reference file')}`));
    nodes.push(h('div', { class: 'grid' }, ...deepDives.map(lessonRow)));
  }

  if (chapter.practice && chapter.practice.length) {
    nodes.push(h('div', { class: 'section-title mt' }, 'Practise what this chapter teaches'));
    nodes.push(h('div', { class: 'q-table' },
      ...chapter.practice.map((question) => h('div', {
        class: 'q-row',
        onClick: () => { location.hash = `#/problem/${question.id}`; }
      },
      h('div', { class: `q-status ${question.status}` }, question.status === 'solved' ? '✓' : ''),
      h('div', { class: 'q-title' }, h('span', { class: 'num' }, `#${question.number}`), question.title),
      h('span', { class: 'dim' }, (question.topics || []).slice(0, 2).join(' · ')),
      h('span', { class: difficultyClass(question.difficulty) }, question.difficulty)))));
  }

  if (chapter.readme) {
    nodes.push(h('details', { class: 'hint mt' },
      h('summary', {}, 'Module README'),
      h('div', { class: 'hint-body prose', html: markdown(chapter.readme) })));
  }

  root.append(pageBody(...nodes.filter(Boolean)));
}

function lessonRow(lesson) {
  return h('div', {
    class: `lesson-row ${lesson.status}`,
    onClick: () => { location.hash = `#/lesson/${lesson.id}`; }
  },
  h('div', { class: 'lesson-num' }, lesson.status === 'completed' ? '✓' : String(lesson.level || '·')),
  h('div', { style: { flex: '1', minWidth: '0' } },
    h('div', { class: 'lesson-title' }, lesson.title),
    h('div', { class: 'lesson-meta' }, lesson.summary && lesson.summary.length < 120 ? lesson.summary : `${lesson.levelName} · ${lesson.lines || ''} lines`)),
  h('span', { class: difficultyClass(lesson.difficulty) }, lesson.difficulty),
  h('span', { class: 'dim' }, `${lesson.minutes}m`));
}

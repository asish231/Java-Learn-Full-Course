/**
 * insights.js — Learning OS dashboard: mastery, company readiness, graph, records, notes.
 * Empty learner → CTAs only (no seeded metrics).
 */
import { h, formatMinutes, markdown } from '../util.js';
import { pageHeader, pageBody, statCard, progressBar, loading, errorBox } from '../shell.js';
import { api } from '../api.js';
import { navigate } from '../state.js';

export async function render(root) {
  root.append(pageHeader({
    title: 'Insights',
    crumb: 'Learning OS',
    actions: [
      h('button', { class: 'btn btn-sm', onClick: () => navigate('#/mock') }, 'Timed mock'),
      h('button', { class: 'btn btn-primary btn-sm', onClick: () => navigate('#/career') }, 'Career')
    ]
  }));

  const body = pageBody(loading('Computing from your real activity…'));
  root.append(body);
  const pad = body.firstChild;

  await renderDashboard(pad);
}

async function renderDashboard(pad) {
  let insights, revise, notes, goals, reminder, graph, diagnostics, revisionPlan;
  try {
    [insights, revise, notes, goals, reminder, graph, diagnostics, revisionPlan] = await Promise.all([
      api.insights(true),
      api.revise(),
      api.notes(),
      api.goalsToday(),
      api.reminder(),
      api.graph(),
      api.diagnostics(),
      api.revisionPlan(7)
    ]);
  } catch (err) {
    pad.replaceChildren(errorBox(err.message));
    return;
  }

  const nodes = [];

  if (reminder && reminder.show) {
    nodes.push(h('div', { class: 'card', style: { borderColor: 'var(--accent, #6c8cff)' } },
      h('strong', {}, 'Reminder'),
      h('p', { class: 'muted' }, reminder.message),
      h('div', { class: 'dim' }, `${reminder.minutes || 0} / ${reminder.targetMinutes || 30} min today`)));
  }

  // Goals
  nodes.push(h('div', { class: 'section-title' }, "Today's goals"));
  if (goals && goals.items) {
    nodes.push(h('div', { class: 'card' },
      ...goals.items.map((item) => h('label', {
        class: 'row',
        style: { gap: '10px', padding: '6px 0', cursor: 'pointer' }
      },
      h('input', {
        type: 'checkbox',
        checked: !!item.done,
        onChange: async (e) => {
          try {
            await api.patchGoal(item.id, e.target.checked);
            await renderDashboard(pad);
          } catch (err) {
            e.target.checked = !e.target.checked;
          }
        }
      }),
      h('span', { class: item.done ? 'dim' : '' }, item.label))),
      h('div', { class: 'dim mt-s' }, `XP today: ${goals.xp || 0}`)));
  }

  if (insights.empty) {
    nodes.push(h('section', { class: 'hero' },
      h('h2', {}, 'Your map starts empty on purpose'),
      h('p', {}, 'No demo scores. Complete a lesson or pass a guided problem — mastery, company readiness, and patterns appear from your real log only.'),
      h('div', { class: 'hero-actions' },
        h('button', { class: 'btn btn-primary', onClick: () => navigate('#/learn') }, 'Start learning'),
        h('button', { class: 'btn', onClick: () => navigate('#/practice') }, 'Guided practice'))));
    pad.replaceChildren(...nodes.filter(Boolean));
    return;
  }

  const rec = insights.records || {};
  nodes.push(h('div', { class: 'grid grid-4' },
    statCard(rec.currentStreak ?? insights.summary?.streak?.current ?? 0, 'streak'),
    statCard(rec.bestMockScore != null ? `${rec.bestMockScore}%` : '—', 'best mock'),
    statCard(rec.thisWeek?.xp ?? 0, 'XP this week'),
    statCard(formatMinutes(insights.summary?.minutes || 0), 'time')));

  // Strengths / focus
  nodes.push(h('div', { class: 'grid grid-2 mt' },
    h('div', { class: 'card' },
      h('div', { class: 'section-title' }, 'Strengths'),
      ...(insights.strengths || []).length
        ? insights.strengths.map((t) => topicRow(t))
        : [h('p', { class: 'muted' }, 'Keep solving to surface strengths.')]),
    h('div', { class: 'card' },
      h('div', { class: 'section-title' }, 'Focus next'),
      ...(insights.focus || []).length
        ? insights.focus.map((t) => topicRow(t))
        : [h('p', { class: 'muted' }, 'No weak topics yet.')])));

  // Company readiness is topic evidence, never a hiring-probability claim.
  nodes.push(h('div', { class: 'section-title mt' }, 'Company topic readiness'));
  nodes.push(h('p', { class: 'dim' }, `Evidence from graded attempts, topic mastery, guided coverage and timed assessments (formula ${insights.formulaVersion}).`));
  const fits = (insights.companyReadiness || insights.companyFit || []).slice(0, 8);
  nodes.push(h('div', { class: 'grid grid-2' },
    ...fits.map((c) => h('div', {
      class: 'card card-hover',
      onClick: () => navigate(`#/practice/${c.company}`)
    },
    h('div', { class: 'row' },
      h('strong', {}, c.name),
      h('span', { class: 'spacer' }),
      h('span', {}, `${c.label} · ${c.percent}%`)),
    progressBar(c.percent),
    h('div', { class: 'dim mt-s' }, (c.explain || []).map((e) =>
      `${e.factor}: ${e.value == null ? 'not measured' : Math.round(e.value * 100) + '%'}`).join(' · ')),
    ...(c.limitations || []).map((text) => h('div', { class: 'dim mt-s' }, text))))));

  nodes.push(h('div', { class: 'section-title mt' }, 'Evidence-backed topic diagnostics'));
  nodes.push(h('div', { class: 'grid grid-2' },
    ...(diagnostics.topics || []).slice(0, 8).map((t) => h('div', { class: 'card' },
      h('div', { class: 'row' }, h('strong', {}, t.topic), h('span', { class: 'spacer' }), h('span', {}, t.label)),
      h('p', { class: 'dim' }, `${t.evidence.attempts} graded attempts · ${t.evidence.passes} passes · ${t.evidence.tutorAssists} tutor assists · ${t.confidence} confidence`)))));

  nodes.push(h('div', { class: 'section-title mt' }, 'Your next 7 days'));
  nodes.push(h('div', { class: 'grid grid-2' },
    ...(revisionPlan.days || []).map((day) => h('div', { class: 'card' },
      h('strong', {}, new Date(`${day.date}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })),
      day.items.length
        ? day.items.map((item) => h('p', { class: 'dim' }, `${item.kind}: ${item.topic} — ${item.title}`))
        : h('p', { class: 'dim' }, 'Recovery / continue your current lesson.')))));

  // Patterns
  if ((insights.codingPatterns || []).length) {
    nodes.push(h('div', { class: 'section-title mt' }, 'Coding behaviour'));
    nodes.push(h('div', { class: 'grid grid-2' },
      ...insights.codingPatterns.map((p) => h('div', { class: 'card' },
        h('strong', {}, p.title),
        h('p', { class: 'muted' }, p.detail)))));
  }

  // Revise
  nodes.push(h('div', { class: 'section-title mt' }, 'Due for revision'));
  if (revise.empty) {
    nodes.push(h('p', { class: 'muted' }, 'Nothing overdue — complete lessons/problems to schedule reviews.'));
  } else {
    nodes.push(h('div', { class: 'chip-row' },
      ...revise.dueTopics.map((t) => h('span', {
        class: 'chip',
        title: t.nextReviewAt ? `Due ${new Date(t.nextReviewAt).toLocaleDateString()}` : '',
        onClick: () => { if (t.chapter) navigate(`#/learn/${t.chapter}`); }
      }, `${t.label} · ${Math.round(t.mastery * 100)}%`))));
    if (revise.problems?.length) {
      nodes.push(h('div', { class: 'q-table mt-s' },
        ...revise.problems.slice(0, 8).map((q) => h('div', {
          class: 'q-row',
          onClick: () => navigate(`#/problem/${q.id}`)
        },
        h('div', { class: 'q-title' }, q.title),
        h('span', { class: 'dim' }, (q.topics || []).slice(0, 2).join(', '))))));
    }
  }

  // Knowledge map
  const gs = insights.graphSummary || {};
  nodes.push(h('div', { class: 'section-title mt' }, 'Knowledge map'));
  nodes.push(h('p', { class: 'muted' },
    `${gs.topicsWithSignal || 0} topics with signal · ${gs.nodeCount || 0} nodes · ${gs.edgeCount || 0} edges (curriculum + co-practice).`));
  const map = knowledgeMap(graph, insights);
  if (map) nodes.push(map);

  const topicBars = (insights.topics || []).slice(0, 12);
  if (topicBars.length) {
    nodes.push(h('div', { class: 'card' },
      ...topicBars.map((t) => h('div', { class: 'mt-s' },
        h('div', { class: 'row' },
          h('span', {}, t.label),
          h('span', { class: 'dim' }, `${Math.round(t.mastery * 100)}%`)),
        progressBar(t.mastery * 100)))));
  }

  // Notes
  nodes.push(h('div', { class: 'section-title mt' }, 'Session notes'));
  const noteList = notes.notes || [];
  if (!noteList.length) {
    nodes.push(h('p', { class: 'muted' }, 'Notes appear when you end a lesson/workspace session.'));
  } else {
    nodes.push(h('div', { class: 'grid grid-2' },
      ...noteList.slice(0, 6).map((n) => h('div', { class: 'card' },
        h('div', { class: 'row' },
          h('strong', {}, n.title),
          h('span', { class: 'spacer' }),
          n.source === 'session-ai' ? h('span', { class: 'chip' }, 'AI') : null),
        h('div', { class: 'dim' }, new Date(n.ts).toLocaleString()),
        h('div', { class: 'prose', html: markdown(n.bodyMd || '') })))));
  }

  // Personal records vs last week
  nodes.push(h('div', { class: 'section-title mt' }, 'Personal records'));
  const tw = rec.thisWeek || {};
  const lw = rec.lastWeek || {};
  nodes.push(h('div', { class: 'card' },
    h('p', {}, `Best streak: ${rec.bestStreak || 0} days · Best mock: ${rec.bestMockScore != null ? rec.bestMockScore + '%' : '—'}`),
    h('p', { class: 'dim' },
      `This week XP ${tw.xp || 0} (solved ${tw.solved || 0}) vs last week XP ${lw.xp || 0} (solved ${lw.solved || 0}).`)));

  pad.replaceChildren(...nodes.filter(Boolean));
}

/**
 * Force-free map: topics are laid out on a circle, ordered by chapter, with an
 * SVG edge for every curriculum/co-practice link. Node size and colour come
 * from real mastery, so an untouched topic simply looks empty.
 */
function knowledgeMap(graph, insights) {
  const nodes = (graph && graph.nodes || []).filter((n) => n.kind === 'topic');
  if (nodes.length < 3) return null;

  const mastery = new Map((insights.topics || []).map((t) => [t.slug, t.mastery]));
  const size = 520;
  const radius = size / 2 - 46;
  const centre = size / 2;
  const points = new Map();

  const ordered = [...nodes].sort((a, b) => String(a.chapter).localeCompare(String(b.chapter)));
  ordered.forEach((node, i) => {
    const angle = (i / ordered.length) * Math.PI * 2 - Math.PI / 2;
    points.set(node.id, { x: centre + radius * Math.cos(angle), y: centre + radius * Math.sin(angle), node });
  });

  const svgNs = 'http://www.w3.org/2000/svg';
  const el = (name, attrs = {}) => {
    const node = document.createElementNS(svgNs, name);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    return node;
  };

  const svg = el('svg', { viewBox: `0 0 ${size} ${size}`, class: 'kmap' });

  for (const edge of (graph.edges || [])) {
    const from = points.get(edge.from);
    const to = points.get(edge.to);
    if (!from || !to) continue;
    svg.appendChild(el('line', {
      x1: from.x.toFixed(1), y1: from.y.toFixed(1), x2: to.x.toFixed(1), y2: to.y.toFixed(1),
      class: 'kmap-edge'
    }));
  }

  for (const { x, y, node } of points.values()) {
    const value = mastery.get(node.slug) || 0;
    const group = el('g', { class: 'kmap-node', tabindex: '0' });
    const circle = el('circle', {
      cx: x.toFixed(1), cy: y.toFixed(1), r: (6 + value * 12).toFixed(1),
      class: value >= 0.55 ? 'kmap-strong' : value > 0 ? 'kmap-weak' : 'kmap-idle'
    });
    circle.appendChild(el('title')).textContent =
      `${node.label} — ${value > 0 ? `${Math.round(value * 100)}% mastery` : 'not practised yet'}`;
    const label = el('text', {
      x: x.toFixed(1),
      y: (y - 12 - value * 12).toFixed(1),
      class: 'kmap-label',
      'text-anchor': 'middle'
    });
    label.textContent = node.label;
    group.appendChild(circle);
    group.appendChild(label);
    group.addEventListener('click', () => { if (node.chapter) navigate(`#/learn/${node.chapter}`); });
    svg.appendChild(group);
  }

  const wrap = h('div', { class: 'card kmap-wrap' });
  wrap.appendChild(svg);
  wrap.appendChild(h('div', { class: 'dim mt-s' },
    'Bigger, brighter nodes = higher mastery; lines join topics that appear together in the same problems. Click a topic to open its chapter.'));
  return wrap;
}

function topicRow(t) {
  return h('div', { class: 'mt-s' },
    h('div', { class: 'row' },
      h('span', {}, t.label),
      h('span', { class: 'dim' }, `${Math.round((t.mastery || 0) * 100)}%`)),
    progressBar((t.mastery || 0) * 100),
    t.explain ? h('div', { class: 'dim' }, t.explain.slice(0, 2).map((e) => e.factor).join(' · ')) : null);
}

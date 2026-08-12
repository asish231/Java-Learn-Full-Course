/**
 * career.js — 2×/week counselling surface grounded on real insights.
 */
import { h, toast, markdown } from '../util.js';
import { pageHeader, pageBody, loading, errorBox, progressBar } from '../shell.js';
import { api } from '../api.js';
import { state, navigate } from '../state.js';

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export async function render(root) {
  root.append(pageHeader({
    title: 'Career path',
    crumb: 'Counselling',
    back: '#/insights'
  }));
  const body = pageBody(loading());
  root.append(body);
  const pad = body.firstChild;

  await renderCounsel(pad);
}

async function renderCounsel(pad) {
  let next;
  try {
    next = await api.counselNext();
  } catch (err) {
    pad.replaceChildren(errorBox(err.message));
    return;
  }

  const nodes = [];
  nodes.push(h('section', { class: 'hero' },
    h('h2', {}, next.isCounselDay ? 'Counselling day' : 'Career readiness'),
    h('p', {}, next.readinessBlurb),
    h('p', { class: 'dim' },
      `Slots: ${(next.daysOfWeek || []).map((d) => DOW[d]).join(' & ')}` +
      (next.daysUntil === 0 ? ' · today' : ` · next in ${next.daysUntil} day(s)`))));

  if (next.empty) {
    nodes.push(h('div', { class: 'card' },
      h('p', {}, 'Company topic readiness stays empty until you practice — we never invent hiring probabilities.'),
      h('button', { class: 'btn btn-primary', onClick: () => navigate('#/practice') }, 'Build signal')));
    pad.replaceChildren(...nodes);
    return;
  }

  nodes.push(h('div', { class: 'section-title' }, 'Company shortlist'));
  nodes.push(h('div', { class: 'grid grid-2' },
    ...(next.shortlist || []).map((c) => h('div', {
      class: `card card-hover${next.targetCompany === c.company ? ' active' : ''}`,
      onClick: async () => {
        try {
          await api.saveProfile({ targetCompany: c.company });
          toast(`Target: ${c.name}`, 'success');
          await renderCounsel(pad);
        } catch (e) {
          toast(e.message, 'error');
        }
      }
    },
    h('div', { class: 'row' }, h('strong', {}, c.name), h('span', {}, `${c.percent}%`)),
    progressBar(c.percent),
    h('div', { class: 'dim mt-s' }, (c.topTopics || []).slice(0, 4).join(' · '))))));

  nodes.push(h('div', { class: 'section-title mt' }, 'Focus for next 14 days'));
  nodes.push(h('div', { class: 'chip-row' },
    ...(next.focus || []).map((t) => h('span', { class: 'chip' }, `${t.label} · ${Math.round(t.mastery * 100)}%`))));

  // Chat
  nodes.push(h('div', { class: 'section-title mt' }, 'Counsel chat'));
  if (!state.tutorReady) {
    nodes.push(h('p', { class: 'muted' }, 'Mercury tutor offline — readiness numbers still work. Set MERCURY_API_KEY for narrative counselling.'));
  } else {
    const log = h('div', { class: 'card', id: 'counsel-log', style: { minHeight: '120px' } });

    const appendTurn = (who, text, asMarkdown) => {
      const wrap = h('div', { class: asMarkdown ? 'prose' : '' });
      if (asMarkdown) wrap.innerHTML = markdown(text || '');
      else wrap.textContent = text;
      log.append(h('div', { class: 'mt-s' }, h('strong', {}, `${who}: `), wrap));
      log.scrollTop = log.scrollHeight;
    };

    // Past sessions come from the store: the model forgets, the record does not.
    for (const turn of next.history || []) {
      appendTurn('You', turn.message, false);
      appendTurn('Counsel', turn.reply, true);
    }
    if (!(next.history || []).length) {
      log.append(h('div', { class: 'dim' }, 'No counselling sessions yet. Ask what to target and why.'));
    }

    const input = h('textarea', {
      class: 'input',
      rows: 3,
      placeholder: 'Ask about targets, timeline, or what to study…'
    });
    const send = h('button', { class: 'btn btn-primary mt-s' }, 'Send');
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send.click(); }
    });
    send.onclick = async () => {
      const message = input.value.trim();
      if (!message || send.disabled) return;
      appendTurn('You', message, false);
      input.value = '';
      send.disabled = true;
      send.textContent = 'Thinking…';
      try {
        const { reply } = await api.counselChat(message);
        appendTurn('Counsel', reply || '', true);
      } catch (e) {
        toast(e.message, 'error');
      } finally {
        send.disabled = false;
        send.textContent = 'Send';
      }
    };
    nodes.push(log);
    nodes.push(h('div', { class: 'mt-s' }, input));
    nodes.push(send);
  }

  pad.replaceChildren(...nodes.filter(Boolean));
}

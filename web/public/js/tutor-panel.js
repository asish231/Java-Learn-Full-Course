/**
 * tutor-panel.js — the AI tutor sidebar.
 *
 * It is context-aware: the panel is constructed with a `context` provider so
 * every question also ships the current problem/lesson, the code in the editor
 * and the last run result. Quick actions map to the tutor's server-side modes.
 */
import { h, markdown, toast } from './util.js';
import { api } from './api.js';
import { AlgorithmVisualizer } from './algorithm-visualizer.js';
import { icon } from './icons.js';

const QUICK_ACTIONS = [
  { mode: 'explain', label: 'Explain', title: 'Restate the problem in plain language' },
  { mode: 'prep', label: 'What to learn first', title: 'Build a study plan before solving' },
  { mode: 'hint', label: 'Hint', title: 'The smallest next nudge' },
  { mode: 'review', label: 'Review my code', title: 'Feedback on what is in the editor' },
  { mode: 'visualize', label: 'Visualize', title: 'Play a step-by-step algorithm trace' },
  { mode: 'debrief', label: 'Debrief', title: 'Takeaways after solving' }
];

export class TutorPanel {
  /**
   * @param {object} options
   * @param {() => object} options.getContext  returns { problemId, lessonId, chapterId, companySlug, code, lastRun }
   * @param {boolean} options.ready            whether the API key is configured
   * @param {string[]} options.actions         quick action modes to show
   */
  constructor({ getContext, ready = true, actions = ['explain', 'hint', 'review'], subtitle = '', onVisualizationStep } = {}) {
    this.getContext = getContext || (() => ({}));
    this.ready = ready;
    this.busy = false;
    this.onVisualizationStep = onVisualizationStep;
    this.visualizers = [];

    this.dot = h('span', { class: `ai-dot${ready ? '' : ' off'}` });
    this.messagesEl = h('div', { class: 'tutor-msgs' });
    this.inputEl = h('textarea', {
      placeholder: ready ? 'Ask anything about this problem…' : 'Tutor disabled — add MERCURY_API_KEY to web/.env',
      rows: '1', disabled: !ready
    });
    this.sendBtn = h('button', { class: 'btn btn-primary btn-sm', disabled: !ready, onClick: () => this.send() }, icon('bot', { size: 14 }), ' Ask');

    this.inputEl.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); this.send(); }
    });
    this.inputEl.addEventListener('input', () => {
      this.inputEl.style.height = 'auto';
      this.inputEl.style.height = `${Math.min(130, this.inputEl.scrollHeight)}px`;
    });

    this.actionsEl = h('div', { class: 'tutor-actions' },
      ...QUICK_ACTIONS.filter((a) => actions.includes(a.mode)).map((action) =>
        h('button', {
          class: 'chip chip-btn', title: action.title, disabled: !ready,
          onClick: () => this.send('', action.mode)
        }, action.mode === 'visualize' ? icon('eye', { size: 13 }) : (action.mode === 'hint' ? icon('hint', { size: 13 }) : null), ' ', action.label)),
      h('button', {
        class: 'chip chip-btn', title: 'Clear this conversation',
        onClick: () => this.clear()
      }, icon('reset', { size: 13 }), ' Clear')
    );

    this.el = h('aside', { class: 'tutor' },
      h('div', { class: 'tutor-head' },
        this.dot,
        icon('bot', { size: 18, class: 'tutor-avatar-icon' }),
        h('div', {},
          h('div', { style: { fontWeight: '600', fontSize: '13.5px' } }, 'Mercury · AI tutor'),
          h('div', { class: 'dim' }, ready ? (subtitle || 'Knows this problem, your code and your history') : 'Not configured')),
      ),
      this.actionsEl,
      this.messagesEl,
      h('div', { class: 'tutor-input' }, this.inputEl, this.sendBtn)
    );

    this.loadThread();
  }

  contextForRequest() {
    const ctx = this.getContext() || {};
    return {
      problemId: ctx.problemId, lessonId: ctx.lessonId, chapterId: ctx.chapterId,
      companySlug: ctx.companySlug, code: ctx.code, lastRun: ctx.lastRun
    };
  }

  async loadThread() {
    const ctx = this.getContext() || {};
    try {
      const { messages } = await api.tutorThread({
        problemId: ctx.problemId, lessonId: ctx.lessonId, chapterId: ctx.chapterId
      });
      this.messagesEl.replaceChildren();
      if (!messages.length) this.renderWelcome();
      else messages.forEach((m) => this.appendMessage(m.role === 'user' ? 'user' : 'ai', m.content, m.mode, m.visualization));
      this.scrollDown();
    } catch (_) {
      this.renderWelcome();
    }
  }

  renderWelcome() {
    const ctx = this.getContext() || {};
    const lines = this.ready
      ? [
        'I can see the problem, your editor and your last test run.',
        'Try **What to learn first** if the topic is new, **Hint** when you are stuck, or **Review my code** once something runs.'
      ]
      : ['The tutor is switched off because no API key is configured. Add `MERCURY_API_KEY` to `web/.env` and restart the server.'];
    this.appendMessage('ai', lines.join('\n\n'));
    if (ctx.problemId) this.appendMessage('ai', 'I also remember what you have solved so far, so ask me what to practise next.');
  }

  appendMessage(role, content, mode, visualization = null) {
    const node = h('div', { class: `msg ${role}` });
    if (mode && mode !== 'chat' && role === 'ai') node.append(h('div', { class: 'msg-mode' }, mode));
    
    let cleanContent = content;
    if (role === 'ai' && typeof content === 'string') {
      cleanContent = content.replace(/```(?:dsa-visualization|json|visualization)?\s*\n?\{\s*"(?:version|category|title|steps)"[\s\S]*?```/gi, '').trim();
      cleanContent = cleanContent.replace(/\{\s*"(?:version|category)"[\s\S]*?\}\s*$/i, '').trim();
    }

    const body = h('div', { class: 'prose', html: markdown(cleanContent) });
    node.append(body);
    if (role === 'ai' && visualization) {
      const visualizer = new AlgorithmVisualizer({
        visualization,
        onStep: (step, index) => this.onVisualizationStep && this.onVisualizationStep(step, index, visualization)
      });
      this.visualizers.push(visualizer);
      node.append(visualizer.el);
    }
    this.messagesEl.append(node);
    return { node, body };
  }

  scrollDown() {
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  async send(explicitMessage, mode = 'chat') {
    if (!this.ready || this.busy) return;
    const message = explicitMessage != null && explicitMessage !== ''
      ? explicitMessage
      : (mode === 'chat' ? this.inputEl.value.trim() : '');
    if (mode === 'chat' && !message) return;

    this.busy = true;
    this.dot.classList.add('busy');
    this.sendBtn.disabled = true;
    this.inputEl.value = '';
    this.inputEl.style.height = 'auto';

    if (message) this.appendMessage('user', message);
    const placeholder = this.appendMessage('ai', '_thinking…_', mode !== 'chat' ? mode : null);
    this.scrollDown();

    try {
      let streamed = '';
      const result = await api.askTutor({ message, context: this.contextForRequest(), mode }, (_chunk, full) => {
        streamed = full;
        const cleaned = full.replace(/```(?:dsa-visualization|json|visualization)?\s*\n?\{\s*"(?:version|category|title|steps)"[\s\S]*$/i, '').trim();
        placeholder.body.innerHTML = markdown(cleaned || '_building visualization…_');
        this.scrollDown();
      });
      placeholder.body.innerHTML = markdown(result.reply || '_(no answer)_');
      if (result.visualization) {
        const visualizer = new AlgorithmVisualizer({
          visualization: result.visualization,
          onStep: (step, index) => this.onVisualizationStep && this.onVisualizationStep(step, index, result.visualization)
        });
        this.visualizers.push(visualizer);
        placeholder.node.append(visualizer.el);
      }
    } catch (err) {
      placeholder.body.innerHTML = markdown(`⚠️ ${err.message}`);
      toast(err.message, 'error');
    } finally {
      this.busy = false;
      this.dot.classList.remove('busy');
      this.sendBtn.disabled = false;
      this.scrollDown();
    }
  }

  async clear() {
    const ctx = this.getContext() || {};
    await api.clearTutorThread({
      problemId: ctx.problemId, lessonId: ctx.lessonId, chapterId: ctx.chapterId
    });
    this.visualizers.forEach((visualizer) => visualizer.destroy());
    this.visualizers = [];
    this.messagesEl.replaceChildren();
    this.renderWelcome();
    toast('Conversation cleared — long-term memory kept.', 'info');
  }
}

/**
 * workspace.js — the coding session.
 *
 * Three panes: the problem (description / prep plan / editorial), the editor
 * with a real test runner, and the AI tutor that can see both.
 */
import { h, markdown, esc, toast, difficultyClass, debounce } from '../util.js';
import { pageHeader, fullBody, loading, errorBox } from '../shell.js';
import { api } from '../api.js';
import { CodeEditor } from '../editor.js';
import { TutorPanel } from '../tutor-panel.js';
import { state, refreshSummary } from '../state.js';

import { makeResizable } from '../splitter.js';

export async function render(root, route) {
  const questionId = route.parts[1];
  const company = route.query.company || '';

  root.append(pageHeader({ title: 'Loading…', back: company ? `#/practice/${company}` : '#/practice' }));
  const body = fullBody(loading('Fetching the problem…'));
  root.append(body);

  let question;
  try {
    question = await api.question(questionId, company);
  } catch (err) {
    body.replaceChildren(errorBox(err.message));
    return;
  }

  new Workspace(root, body, question, company).mount();
}

class Workspace {
  constructor(root, body, question, company) {
    this.root = root;
    this.body = body;
    this.question = question;
    this.company = company;
    this.lastRun = null;
    this.tab = 'description';
    this.solutionRevealed = false;
    this.solution = null;
    this.tutorOpen = false;
  }

  mount() {
    const q = this.question;

    // ---- header ----------------------------------------------------------
    this.root.replaceChildren(pageHeader({
      title: `#${q.number} · ${q.title}`,
      crumb: q.companyName ? `asked at ${q.companyName}` : (q.guided ? 'guided problem' : 'LeetCode list'),
      back: this.company ? `#/practice/${this.company}` : '#/practice',
      actions: [
        h('span', { class: difficultyClass(q.difficulty) }, q.difficulty),
        q.leetcodeUrl ? h('a', { class: 'btn btn-ghost btn-sm', href: q.leetcodeUrl, target: '_blank', rel: 'noopener' }, 'LeetCode ↗') : null,
        h('button', { class: 'btn btn-ghost btn-sm', onClick: () => this.toggleTutor() }, '🤖 Tutor')
      ].filter(Boolean)
    }), this.body);

    // ---- panes -----------------------------------------------------------
    this.problemPane = h('section', { class: 'pane' });
    this.editorPane = h('section', { class: 'pane editor-pane' });

    this.tutor = new TutorPanel({
      ready: state.tutorReady,
      actions: ['explain', 'prep', 'hint', 'review', 'debrief'],
      getContext: () => ({
        problemId: this.question.id,
        companySlug: this.company || undefined,
        code: this.editor ? this.editor.value : '',
        lastRun: this.lastRun
      })
    });
    this.tutor.el.style.display = 'none';

    this.grid = h('div', { class: 'workspace' }, this.problemPane, this.editorPane, this.tutor.el);
    this.body.replaceChildren(this.grid);

    this.splitterControl = makeResizable({
      container: this.grid,
      leftPane: this.problemPane,
      rightPane: this.editorPane,
      tutorPane: this.tutor.el,
      key: 'studio.split.workspace'
    });

    this.renderProblemPane();
    this.renderEditorPane();
  }

  toggleTutor() {
    this.tutorOpen = !this.tutorOpen;
    this.tutor.el.style.display = this.tutorOpen ? '' : 'none';
    if (this.splitterControl) {
      this.splitterControl.update();
    }
  }

  // =========================================================================
  // Problem pane
  // =========================================================================

  renderProblemPane() {
    const q = this.question;
    const tabs = [
      ['description', 'Description'],
      ['plan', 'Learn first'],
      ['tests', `Test cases${q.tests.length ? ` (${q.tests.length})` : ''}`],
      ['editorial', 'Editorial']
    ];

    this.tabsEl = h('nav', { class: 'tabs' },
      ...tabs.map(([id, label]) => h('button', {
        class: `tab${this.tab === id ? ' active' : ''}`,
        onClick: () => { this.tab = id; this.renderProblemPane(); }
      }, label)));

    this.tabBody = h('div', { class: 'tab-body' });
    this.problemPane.replaceChildren(this.tabsEl, this.tabBody);

    if (this.tab === 'description') this.renderDescription();
    else if (this.tab === 'plan') this.renderPlan();
    else if (this.tab === 'tests') this.renderTests();
    else this.renderEditorial();
  }

  renderDescription() {
    const q = this.question;
    const nodes = [];

    nodes.push(h('div', { class: 'row wrap', style: { marginBottom: '14px' } },
      ...(q.topics || []).map((t) => h('span', { class: 'chip' }, t)),
      q.guided
        ? h('span', { class: 'q-badge-guided' }, `${q.tests.length} test cases`)
        : h('span', { class: 'q-badge-lite' }, 'no local tests yet')));

    nodes.push(h('div', { class: 'prose', html: markdown(q.statement) }));

    if (q.examples.length) {
      nodes.push(h('div', { class: 'section-title mt' }, 'Examples'));
      q.examples.forEach((example, index) => {
        nodes.push(h('div', { class: 'example-box' },
          h('div', { class: 'ex-label' }, `Example ${index + 1}`),
          h('div', { html: `<span class="ex-key">Input:</span> ${esc(example.input)}` }),
          h('div', { html: `<span class="ex-key">Output:</span> ${esc(example.output)}` }),
          example.explanation ? h('div', { class: 'ex-note' }, example.explanation) : null));
      });
    }

    if (q.constraints.length) {
      nodes.push(h('div', { class: 'section-title mt' }, 'Constraints'));
      nodes.push(h('ul', { class: 'constraint-list' }, ...q.constraints.map((c) => h('li', {}, c))));
    }

    if (q.hints.length) {
      nodes.push(h('div', { class: 'section-title mt' }, 'Hints — open one at a time'));
      q.hints.forEach((hint, index) => {
        nodes.push(h('details', { class: 'hint' },
          h('summary', {}, `Hint ${index + 1}`),
          h('div', { class: 'hint-body prose', html: markdown(hint) })));
      });
    }

    if (!q.guided) {
      nodes.push(h('div', { class: 'prereq mt' },
        h('h4', {}, 'This one is not guided yet'),
        h('div', { class: 'muted' }, 'There is no built-in test suite for this question. Write a `main` method, press Run to execute it, and ask the tutor to check your reasoning.')));
    }

    this.tabBody.replaceChildren(...nodes.filter(Boolean));
  }

  async renderPlan() {
    this.tabBody.replaceChildren(loading('Building your plan…'));
    let plan;
    try {
      plan = await api.plan(this.question.id, this.company);
    } catch (err) {
      this.tabBody.replaceChildren(errorBox(err.message));
      return;
    }

    const nodes = [h('div', { class: 'prose' },
      h('p', {}, `Before solving #${plan.problem.number}, make sure these are solid. Everything below comes from your own curriculum and question bank.`))];

    if (!plan.chapters.length && !plan.warmups.length) {
      nodes.push(h('div', { class: 'empty' }, 'No prerequisites recorded for this question — dive straight in.'));
    }

    plan.chapters.forEach((chapter) => {
      const lessons = chapter.lessons.slice(0, 6);
      nodes.push(h('div', { class: 'card', style: { marginBottom: '12px' } },
        h('div', { class: 'row-between' },
          h('div', { class: 'row' },
            h('span', { style: { fontSize: '20px' } }, chapter.icon),
            h('div', {},
              h('div', { style: { fontWeight: '600' } }, chapter.title),
              h('div', { class: 'dim' }, chapter.topics.join(' · ')))),
          h('button', {
            class: 'btn btn-sm',
            onClick: () => { location.hash = `#/learn/${chapter.chapterId}`; }
          }, 'Open chapter')),
        h('p', { class: 'muted mt-s' }, chapter.why || chapter.summary),
        ...lessons.map((lesson) => h('div', {
          class: `lesson-row ${lesson.status}`,
          style: { marginTop: '8px' },
          onClick: () => { location.hash = `#/lesson/${lesson.id}`; }
        },
        h('div', { class: 'lesson-num' }, lesson.status === 'completed' ? '✓' : String(lesson.level || '·')),
        h('div', { style: { flex: '1' } },
          h('div', { class: 'lesson-title' }, lesson.title),
          h('div', { class: 'lesson-meta' }, `${lesson.levelName} · ${lesson.minutes}m`))))));
    });

    if (plan.warmups.length) {
      nodes.push(h('div', { class: 'section-title mt' }, 'Warm-up questions first'));
      nodes.push(h('div', { class: 'q-table' },
        ...plan.warmups.map((warmup) => h('div', {
          class: 'q-row',
          onClick: () => { location.hash = `#/problem/${warmup.id}`; }
        },
        h('div', { class: `q-status ${warmup.status}` }, warmup.status === 'solved' ? '✓' : ''),
        h('div', { class: 'q-title' }, h('span', { class: 'num' }, `#${warmup.number}`), warmup.title),
        h('span', { class: difficultyClass(warmup.difficulty) }, warmup.difficulty)))));
    }

    nodes.push(h('button', {
      class: 'btn btn-primary mt',
      onClick: () => { this.tutor.send('', 'prep'); }
    }, '🤖 Ask the tutor to turn this into a step-by-step plan'));

    this.tabBody.replaceChildren(...nodes);
  }

  renderTests() {
    const q = this.question;
    if (!q.tests.length) {
      this.tabBody.replaceChildren(h('div', { class: 'empty' },
        'This question has no built-in test cases yet — use Run to execute your own main().'));
      return;
    }

    const nodes = [h('p', { class: 'muted' },
      `Your submission runs against ${q.tests.length} cases. The first three are visible samples; the rest are hidden until you submit.`)];

    q.tests.forEach((test, index) => {
      nodes.push(h('div', { class: 'case-detail', style: { marginBottom: '10px' } },
        h('div', { class: 'row-between' },
          h('strong', {}, `${index + 1}. ${test.name}`),
          test.locked ? h('span', { class: 'q-badge-lite' }, 'hidden') : h('span', { class: 'q-badge-guided' }, 'sample')),
        test.locked
          ? h('div', { class: 'dim mt-s' }, 'Revealed after you submit.')
          : h('div', {},
            h('span', { class: 'k' }, 'Input'), h('div', { class: 'v' }, test.input || '—'),
            h('span', { class: 'k' }, 'Expected'), h('div', { class: 'v good' }, test.expected))));
    });

    this.tabBody.replaceChildren(...nodes);
  }

  async renderEditorial() {
    const q = this.question;
    const solved = q.progress && q.progress.status === 'solved';

    if (!q.hasSolution) {
      this.tabBody.replaceChildren(h('div', { class: 'empty' },
        'No reference solution for this question yet. Ask the tutor for the approach instead.'));
      return;
    }

    if (!solved && !this.solutionRevealed) {
      this.tabBody.replaceChildren(
        h('div', { class: 'prereq' },
          h('h4', {}, 'Locked — on purpose'),
          h('div', { class: 'muted' }, 'Reading the answer now is the fastest way to not learn this pattern. Try the hints, or ask the tutor for one nudge at a time.')),
        h('div', { class: 'row wrap' },
          h('button', { class: 'btn btn-primary', onClick: () => this.tutor.send('', 'hint') }, 'Give me a hint instead'),
          h('button', {
            class: 'btn',
            onClick: () => {
              if (confirm('Reveal the full reference solution and editorial?')) {
                this.solutionRevealed = true;
                this.renderProblemPane();
              }
            }
          }, 'Reveal anyway')));
      return;
    }

    this.tabBody.replaceChildren(loading('Loading the editorial…'));
    try {
      this.solution = this.solution || await api.solution(q.id, this.company);
    } catch (err) {
      this.tabBody.replaceChildren(errorBox(err.message));
      return;
    }

    const complexity = this.solution.complexity || {};
    this.tabBody.replaceChildren(
      h('div', { class: 'row wrap', style: { marginBottom: '12px' } },
        h('span', { class: 'chip' }, `Time ${complexity.time || '—'}`),
        h('span', { class: 'chip' }, `Space ${complexity.space || '—'}`)),
      h('div', { class: 'prose', html: markdown(this.solution.approach || '') }),
      h('div', { class: 'section-title mt' }, 'Reference implementation'),
      h('div', { class: 'prose', html: markdown(`\`\`\`java\n${this.solution.solutionCode}\n\`\`\``) }),
      h('button', {
        class: 'btn mt',
        onClick: () => { this.editor.setValue(this.solution.solutionCode); toast('Reference solution loaded into the editor.', 'info'); }
      }, 'Load into editor'),
      h('button', {
        class: 'btn btn-primary mt',
        style: { marginLeft: '8px' },
        onClick: () => this.tutor.send('Compare my code with the reference solution and tell me what I should have seen.', 'chat')
      }, '🤖 Compare with my code'));
  }

  // =========================================================================
  // Editor pane
  // =========================================================================

  renderEditorPane() {
    const q = this.question;
    const draft = (q.progress && q.progress.draft) || '';

    this.runBtn = h('button', { class: 'btn', onClick: () => this.execute(true) }, '▶ Run samples');
    this.submitBtn = h('button', { class: 'btn btn-primary', onClick: () => this.execute(false) }, 'Submit');
    this.timing = h('span', { class: 'dim' });

    const toolbar = h('div', { class: 'editor-toolbar' },
      q.guided ? this.runBtn : null,
      q.guided ? this.submitBtn : h('button', { class: 'btn btn-primary', onClick: () => this.execute(false) }, '▶ Run'),
      h('button', {
        class: 'btn btn-ghost btn-sm',
        onClick: () => {
          if (confirm('Reset the editor to the starter code?')) { this.editor.setValue(q.starterCode); toast('Editor reset.', 'info'); }
        }
      }, 'Reset'),
      h('div', { style: { flex: '1' } }),
      this.timing
    );

    const autosave = debounce((code) => api.saveDraft(q.id, code).catch(() => {}), 1200);

    this.editor = new CodeEditor({
      value: draft || q.starterCode,
      filename: 'Solution.java',
      onChange: autosave,
      onRun: () => this.execute(q.guided),
      onSave: () => { api.saveDraft(q.id, this.editor.value); toast('Draft saved.', 'success', 1400); }
    });

    this.resultsHead = h('div', { class: 'results-head', onClick: () => this.resultsEl.classList.toggle('collapsed') },
      h('span', { class: 'verdict pending' }, 'Ready'),
      h('span', { class: 'dim' }, q.guided ? 'Run the samples, then submit against every case.' : 'Runs your main() method.'));
    this.resultsBody = h('div', { class: 'results-body' });
    this.resultsEl = h('div', { class: 'results collapsed' }, this.resultsHead, this.resultsBody);

    this.editorPane.replaceChildren(toolbar, this.editor.el, this.resultsEl);
  }

  setVerdict(text, kind, note = '') {
    this.resultsHead.replaceChildren(
      h('span', { class: `verdict ${kind}` }, text),
      note ? h('span', { class: 'dim' }, note) : null);
  }

  async execute(samplesOnly) {
    const q = this.question;
    this.runBtn && (this.runBtn.disabled = true);
    this.submitBtn && (this.submitBtn.disabled = true);
    this.resultsEl.classList.remove('collapsed');
    this.setVerdict('Compiling…', 'pending');
    this.resultsBody.replaceChildren(h('div', { class: 'empty' }, h('span', { class: 'spinner' }), ' Running Java…'));

    try {
      const result = q.guided
        ? await api.submit(q.id, this.editor.value, { company: this.company, runSamplesOnly: samplesOnly })
        : await api.run(this.editor.value);

      this.lastRun = result;
      this.timing.textContent = result.elapsedMs ? `${result.elapsedMs} ms` : '';

      if (result.graded) this.renderGraded(result, samplesOnly);
      else this.renderFreeform(result);

      if (result.status === 'Accepted' && !samplesOnly) await this.onSolved();
    } catch (err) {
      this.setVerdict('Error', 'fail');
      this.resultsBody.replaceChildren(h('div', { class: 'console-out error' }, err.message));
    } finally {
      this.runBtn && (this.runBtn.disabled = false);
      this.submitBtn && (this.submitBtn.disabled = false);
    }
  }

  renderFreeform(result) {
    const ok = result.status === 'Success';
    this.setVerdict(ok ? 'Ran successfully' : result.status, ok ? 'pass' : 'fail', `${result.elapsedMs || 0} ms`);
    this.resultsBody.replaceChildren(
      result.stdout ? h('div', { class: 'console-out' }, result.stdout) : null,
      result.error ? h('div', { class: 'console-out error', style: { marginTop: '8px' } }, result.error) : null,
      !result.stdout && !result.error ? h('div', { class: 'dim' }, 'No output.') : null);
  }

  renderGraded(result, samplesOnly) {
    if (result.status === 'Compilation Error' || result.status === 'Internal Error') {
      this.setVerdict('Compilation error', 'fail');
      this.resultsBody.replaceChildren(h('div', { class: 'console-out error' }, result.error || 'The compiler rejected your code.'),
        this.askTutorRow('Why does my code not compile?'));
      return;
    }

    const passed = result.passed;
    const total = result.total;
    const allPassed = passed === total;
    this.setVerdict(
      allPassed ? (samplesOnly ? 'Samples passed' : 'Accepted') : 'Wrong answer',
      allPassed ? 'pass' : 'fail',
      `${passed}/${total} cases · ${result.elapsedMs} ms`);

    const detail = h('div', { class: 'case-detail' });
    const showCase = (index) => {
      const c = result.results[index];
      detail.replaceChildren(
        h('span', { class: 'k' }, 'Input'), h('div', { class: 'v' }, c.input || '—'),
        h('span', { class: 'k' }, 'Expected'), h('div', { class: 'v good' }, c.expected),
        h('span', { class: 'k' }, 'Your output'), h('div', { class: `v ${c.passed ? 'good' : 'bad'}` }, c.actual || '—'),
        c.error ? h('span', { class: 'k' }, 'Error') : null,
        c.error ? h('div', { class: 'v bad' }, c.error) : null);
      [...tabs.children].forEach((node, i) => node.classList.toggle('active', i === index));
    };

    const tabs = h('div', { class: 'case-tabs' },
      ...result.results.map((c, index) => h('button', {
        class: `case-tab ${c.passed ? 'pass' : 'fail'}`,
        onClick: () => showCase(index)
      }, `${c.passed ? '✓' : '✕'} ${c.name}`)));

    this.resultsBody.replaceChildren(
      tabs,
      detail,
      result.stdout ? h('div', { class: 'console-out', style: { marginTop: '10px' } }, result.stdout) : null,
      allPassed ? null : this.askTutorRow('My submission failed — what is wrong with my approach?'));

    const firstFailure = result.results.findIndex((c) => !c.passed);
    showCase(firstFailure === -1 ? 0 : firstFailure);
  }

  askTutorRow(prompt) {
    return h('div', { class: 'row mt-s' },
      h('button', { class: 'btn btn-sm', onClick: () => this.tutor.send(prompt, 'review') }, '🤖 Ask the tutor about this failure'));
  }

  async onSolved() {
    toast(`Solved #${this.question.number} ${this.question.title} 🎉`, 'success', 4200);
    this.question.progress = { ...(this.question.progress || {}), status: 'solved' };
    await refreshSummary().catch(() => {});
    this.resultsBody.append(h('div', { class: 'row mt-s wrap' },
      h('button', { class: 'btn btn-sm', onClick: () => { this.tab = 'editorial'; this.renderProblemPane(); } }, 'Read the editorial'),
      h('button', { class: 'btn btn-sm', onClick: () => this.tutor.send('', 'debrief') }, '🤖 Debrief me'),
      h('button', { class: 'btn btn-sm', onClick: () => { location.hash = '#/practice'; } }, 'Next question')));
  }
}

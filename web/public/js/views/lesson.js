/**
 * lesson.js — read a lesson on the left, run and edit it on the right,
 * with the tutor one click away.
 */
import { h, markdown, toast, difficultyClass } from '../util.js';
import { pageHeader, fullBody, loading, errorBox } from '../shell.js';
import { api } from '../api.js';
import { CodeEditor } from '../editor.js';
import { TutorPanel } from '../tutor-panel.js';
import { state } from '../state.js';
import { icon } from '../icons.js';

import { makeResizable } from '../splitter.js';
import { track, setTrackContext, startFocus, endSession } from '../track.js';

export async function render(root, route) {
  const lessonId = route.parts.slice(1).join('/');

  root.append(pageHeader({ title: 'Loading lesson…', back: '#/learn' }));
  const body = fullBody(loading('Opening the file…'));
  root.append(body);

  let lesson;
  try {
    lesson = await api.lesson(lessonId);
  } catch (err) {
    body.replaceChildren(errorBox(err.message));
    return;
  }

  new LessonView(root, body, lesson).mount();
}

class LessonView {
  constructor(root, body, lesson) {
    this.root = root;
    this.body = body;
    this.lesson = lesson;
    this.completed = lesson.status === 'completed';
    this.tutorOpen = false;
  }

  mount() {
    const lesson = this.lesson;
    setTrackContext({ lessonId: lesson.id, chapterId: lesson.chapterId });
    track('open_lesson', { lessonId: lesson.id });
    startFocus();

    this.completeBtn = h('button', {
      class: `btn btn-sm ${this.completed ? '' : 'btn-primary'}`,
      onClick: () => this.markComplete()
    }, this.completed ? 'Completed ✓' : 'Mark complete');

    this.root.replaceChildren(pageHeader({
      title: lesson.title,
      crumb: `${lesson.chapter.icon} ${lesson.chapter.title}`,
      back: `#/learn/${lesson.chapterId}`,
      actions: [
        lesson.prev ? h('button', { class: 'btn btn-ghost btn-sm', title: lesson.prev.title, onClick: () => { location.hash = `#/lesson/${lesson.prev.id}`; } }, '← Prev') : null,
        lesson.next ? h('button', { class: 'btn btn-ghost btn-sm', title: lesson.next.title, onClick: () => { location.hash = `#/lesson/${lesson.next.id}`; } }, 'Next →') : null,
        this.completeBtn,
        h('button', { class: 'btn btn-ghost btn-sm', onClick: () => this.toggleTutor() }, icon('tutor', { size: 15 }), ' AI Tutor')
      ].filter(Boolean)
    }), this.body);

    this.tutor = new TutorPanel({
      ready: state.tutorReady,
      actions: ['explain', 'hint'],
      subtitle: 'Ask about this file, line by line',
      getContext: () => ({
        lessonId: this.lesson.id,
        chapterId: this.lesson.chapterId,
        code: this.editor ? this.editor.value : '',
        lastRun: this.lastRun
      })
    });
    this.tutor.el.style.display = 'none';

    this.docPane = this.buildDoc();
    this.runnerPane = this.buildRunner();
    this.layout = h('div', { class: 'lesson-layout' }, this.docPane, this.runnerPane, this.tutor.el);
    this.body.replaceChildren(this.layout);

    this.splitterControl = makeResizable({
      container: this.layout,
      leftPane: this.docPane,
      rightPane: this.runnerPane,
      tutorPane: this.tutor.el,
      key: 'studio.split.lesson'
    });
  }

  toggleTutor() {
    this.tutorOpen = !this.tutorOpen;
    this.tutor.el.style.display = this.tutorOpen ? '' : 'none';
    if (this.splitterControl) {
      this.splitterControl.update();
    }
  }

  buildDoc() {
    const lesson = this.lesson;
    const nodes = [
      h('div', { class: 'row wrap', style: { marginBottom: '12px' } },
        h('span', { class: difficultyClass(lesson.difficulty) }, lesson.levelName),
        h('span', { class: 'chip' }, `${lesson.minutes} min`),
        h('span', { class: 'chip' }, lesson.filePath)),
      h('div', { class: 'prose', html: markdown(lesson.summary) })
    ];

    if (lesson.bullets && lesson.bullets.length) {
      nodes.push(h('div', { class: 'section-title mt' }, 'In this file'));
      nodes.push(h('ul', { class: 'objectives' }, ...lesson.bullets.map((bullet) => h('li', {}, bullet))));
    }

    if (lesson.api && lesson.api.length) {
      nodes.push(h('div', { class: 'section-title mt' }, 'Methods you can call'));
      nodes.push(h('div', { class: 'prose' },
        ...lesson.api.map((signature) => h('div', { style: { marginBottom: '4px' } }, h('code', {}, signature)))));
    }

    if (lesson.chapter.objectives && lesson.chapter.objectives.length) {
      nodes.push(h('div', { class: 'prereq mt' },
        h('h4', {}, `Why this chapter matters`),
        h('div', { class: 'muted' }, lesson.chapter.why || ''),
        h('ul', { class: 'objectives mt-s' }, ...lesson.chapter.objectives.map((objective) => h('li', {}, objective)))));
    }

    const active = lesson.activeLearning;
    if (active && active.prerequisites.length) {
      nodes.push(h('div', { class: 'section-title mt' }, 'Prerequisite check'));
      nodes.push(h('div', { class: 'grid' }, ...active.prerequisites.map((item) => h('div', {
        class: 'card card-hover',
        onClick: () => { location.hash = `#/learn/${item.id}`; }
      }, h('strong', {}, `${item.complete ? '✓' : '○'} ${item.title}`),
      h('div', { class: 'dim' }, `${item.progress.done}/${item.progress.total} lessons complete`)))));
    }

    if (active && active.misconceptions.length) {
      nodes.push(h('div', { class: 'section-title mt' }, 'Common traps'));
      nodes.push(h('div', { class: 'prereq' }, ...active.misconceptions.map((text) => h('p', {}, `⚠ ${text}`))));
    }

    if (active && active.checkpoints.length) {
      nodes.push(h('div', { class: 'section-title mt' }, 'Retrieval checkpoints'));
      for (const checkpoint of active.checkpoints) {
        const saved = Object.values(active.progress || {}).find((row) => row.checkpointId === checkpoint.id);
        const feedback = h('p', { class: 'dim mt-s' }, saved && saved.correct ? 'Previously answered correctly.' : 'Choose without looking back at the code.');
        nodes.push(h('div', { class: 'card mt-s' },
          h('strong', {}, checkpoint.prompt),
          h('div', { class: 'grid mt-s' }, ...checkpoint.choices.map((choice, answerIndex) => h('button', {
            class: 'btn btn-sm',
            onClick: async (event) => {
              const button = event.currentTarget;
              try {
                const result = await api.answerCheckpoint(lesson.id, checkpoint.id, answerIndex);
                button.className = `btn btn-sm ${result.correct ? 'btn-primary' : ''}`;
                feedback.textContent = `${result.correct ? 'Correct.' : 'Not yet.'} ${result.explanation}`;
              } catch (err) {
                toast(err.message, 'error');
              }
            }
          }, choice))), feedback));
      }
    }

    if (active) {
      const existing = Object.values(active.progress || {}).find((row) => row.checkpointId === 'reflection');
      const reflection = h('textarea', {
        class: 'input',
        rows: 3,
        placeholder: active.reflectionPrompt,
        value: existing ? existing.text : ''
      });
      nodes.push(h('div', { class: 'section-title mt' }, 'Post-lesson reflection'));
      nodes.push(h('div', { class: 'card' }, reflection, h('button', {
        class: 'btn btn-sm mt-s',
        onClick: async () => {
          try {
            await api.saveReflection(lesson.id, reflection.value);
            toast('Reflection saved as learning evidence.', 'success');
          } catch (err) {
            toast(err.message, 'error');
          }
        }
      }, 'Save reflection')));
    }

    if (lesson.practice && lesson.practice.length) {
      nodes.push(h('div', { class: 'section-title mt' }, 'Questions that use this'));
      nodes.push(h('div', { class: 'q-table' },
        ...lesson.practice.map((question) => h('div', {
          class: 'q-row',
          onClick: () => { location.hash = `#/problem/${question.id}`; }
        },
        h('div', { class: 'q-status' }),
        h('div', { class: 'q-title' }, h('span', { class: 'num' }, `#${question.number}`), question.title),
        h('span', { class: 'dim' }, (question.topics || []).slice(0, 2).join(' · ')),
        h('span', { class: difficultyClass(question.difficulty) }, question.difficulty)))));
    }

    if (lesson.siblings && lesson.siblings.length > 1) {
      nodes.push(h('div', { class: 'section-title mt' }, 'Rest of the chapter'));
      nodes.push(h('div', { class: 'grid' },
        ...lesson.siblings.map((sibling) => h('div', {
          class: `lesson-row ${sibling.status}${sibling.id === lesson.id ? ' in-progress' : ''}`,
          onClick: () => { location.hash = `#/lesson/${sibling.id}`; }
        },
        h('div', { class: 'lesson-num' }, sibling.status === 'completed' ? '✓' : String(sibling.level || '·')),
        h('div', { style: { flex: '1' } },
          h('div', { class: 'lesson-title' }, sibling.title),
          h('div', { class: 'lesson-meta' }, sibling.levelName))))));
    }

    return h('div', { class: 'lesson-doc' }, ...nodes.filter(Boolean));
  }

  buildRunner() {
    const lesson = this.lesson;

    this.runBtn = h('button', { class: 'btn btn-primary', onClick: () => this.run() }, '▶ Run file');
    this.timing = h('span', { class: 'dim' });

    const toolbar = h('div', { class: 'editor-toolbar' },
      this.runBtn,
      h('button', {
        class: 'btn btn-ghost btn-sm',
        onClick: () => { this.editor.setValue(lesson.code); toast('Restored the original file.', 'info'); }
      }, 'Reset'),
      h('span', { class: 'dim' }, 'Edit freely — nothing on disk changes.'),
      h('div', { style: { flex: '1' } }),
      this.timing);

    this.editor = new CodeEditor({
      value: lesson.code,
      filename: lesson.fileName,
      onRun: () => this.run(),
      onSave: () => toast('Lesson files are read-only — your edits stay in the browser.', 'info')
    });

    this.resultsHead = h('div', { class: 'results-head', onClick: () => this.resultsEl.classList.toggle('collapsed') },
      h('span', { class: 'verdict pending' }, 'Output'),
      h('span', { class: 'dim' }, 'Runs the file\'s main() method'));
    this.resultsBody = h('div', { class: 'results-body' },
      h('div', { class: 'dim' }, 'Press Run (or ⌘/Ctrl + Enter) to execute this lesson.'));
    this.resultsEl = h('div', { class: 'results' }, this.resultsHead, this.resultsBody);

    return h('div', { class: 'lesson-run' }, toolbar, this.editor.el, this.resultsEl);
  }

  async run() {
    this.runBtn.disabled = true;
    this.resultsEl.classList.remove('collapsed');
    setTimeout(() => this.editor.scrollToCursor(), 50);
    this.resultsHead.replaceChildren(h('span', { class: 'verdict pending' }, 'Compiling…'));
    this.resultsBody.replaceChildren(h('div', { class: 'empty' }, h('span', { class: 'spinner' }), ' Running Java…'));

    try {
      const result = await api.run(this.editor.value, { lessonId: this.lesson.id });
      this.lastRun = result;
      const ok = result.status === 'Success';
      this.timing.textContent = `${result.elapsedMs} ms`;

      this.resultsHead.replaceChildren(
        h('span', { class: `verdict ${ok ? 'pass' : 'fail'}` }, ok ? 'Ran successfully' : result.status),
        h('span', { class: 'dim' }, `${result.elapsedMs} ms`));

      this.resultsBody.replaceChildren(
        result.stdout ? h('div', { class: 'console-out' }, result.stdout) : null,
        result.error ? h('div', { class: 'console-out error', style: { marginTop: '8px' } }, result.error) : null,
        !result.stdout && !result.error ? h('div', { class: 'dim' }, 'No output — this file has no main() method, or it printed nothing.') : null,
        !ok ? h('button', {
          class: 'btn btn-sm mt-s',
          onClick: () => { if (!this.tutorOpen) this.toggleTutor(); this.tutor.send('This lesson file failed to run — what does the error mean?', 'chat'); }
        }, icon('tutor', { size: 14 }), ' Ask tutor about this error') : null,
        ok && !this.completed ? h('div', { class: 'row mt-s' },
          h('span', { class: 'muted' }, 'Ran cleanly — got it?'),
          h('button', { class: 'btn btn-sm btn-success', onClick: () => this.markComplete() }, 'Mark complete')) : null);
    } catch (err) {
      this.resultsHead.replaceChildren(h('span', { class: 'verdict fail' }, 'Error'));
      this.resultsBody.replaceChildren(h('div', { class: 'console-out error' }, err.message));
    } finally {
      this.runBtn.disabled = false;
    }
  }

  async markComplete() {
    if (this.completed) return;
    await api.markLesson(this.lesson.id, 'completed', this.lesson.minutes);
    this.completed = true;
    this.completeBtn.textContent = 'Completed ✓';
    this.completeBtn.classList.remove('btn-primary');
    toast(`“${this.lesson.title}” marked complete.`, 'success');
    track('complete_lesson', { lessonId: this.lesson.id });
    endSession({ status: 'lesson_complete', lessonId: this.lesson.id }).catch(() => {});
    if (this.lesson.next) {
      toast(`Up next: ${this.lesson.next.title}`, 'info', 4000);
    }
  }
}

/**
 * editor.js — the code editor.
 *
 * A transparent <textarea> sits on top of a highlighted <pre> mirror, which
 * gives native typing/undo/IME behaviour plus syntax colours. On top of that:
 *   • smart auto-indentation (blocks, closing braces, continuation)
 *   • bracket / quote auto-closing, type-over and paired backspace
 *   • Tab / Shift-Tab indent for the current line or the whole selection
 *   • Cmd/Ctrl + / comment toggle, Alt+↑/↓ move line, Cmd/Ctrl + D duplicate
 *   • Cmd/Ctrl + Enter run, Cmd/Ctrl + S save, Cmd/Ctrl + Shift + F format
 *   • active-line highlight, live line/column readout, autosave
 */
import { h, highlightJava } from './util.js';

const INDENT = '    ';
const PAIRS = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" };
const CLOSERS = new Set(Object.values(PAIRS));

export class CodeEditor {
  constructor({ value = '', onChange, onRun, onSave, filename = 'Solution.java' } = {}) {
    this.onChange = onChange;
    this.onRun = onRun;
    this.onSave = onSave;

    this.textarea = h('textarea', {
      class: 'ce-input', spellcheck: 'false', autocomplete: 'off',
      autocapitalize: 'off', autocorrect: 'off', wrap: 'off',
      'aria-label': `${filename || 'Java'} code editor`
    });
    this.highlight = h('pre', { class: 'ce-highlight', 'aria-hidden': 'true' });
    this.executionLineEl = h('div', { class: 'ce-execution-line', 'aria-hidden': 'true' });
    this.gutter = h('div', { class: 'ce-gutter' });
    this.statusEl = h('div', { class: 'ce-status' });
    this.filenameEl = h('span', { class: 'ce-filename' }, filename);

    this.el = h('div', { class: 'code-editor' },
      h('div', { class: 'ce-topbar' },
        this.filenameEl,
        h('span', { class: 'ce-lang' }, 'Java'),
        h('div', { class: 'ce-spacer' }),
        h('button', { class: 'ce-mini', title: 'Decrease font size', onClick: () => this.zoom(-1) }, 'A-'),
        h('button', { class: 'ce-mini', title: 'Increase font size', onClick: () => this.zoom(1) }, 'A+'),
        h('button', { class: 'ce-mini', title: 'Re-indent the whole file (⌘⇧F)', onClick: () => this.format() }, 'Format')
      ),
      h('div', { class: 'ce-body' }, this.gutter, h('div', { class: 'ce-scroll' }, this.executionLineEl, this.highlight, this.textarea)),
      this.statusEl
    );

    this.fontSize = Number(localStorage.getItem('studio.editor.fontSize')) || 13.5;
    this.applyFontSize();

    this.textarea.addEventListener('input', () => this.sync());
    this.textarea.addEventListener('keydown', (e) => this.onKeyDown(e));
    this.textarea.addEventListener('scroll', () => this.syncScroll());
    this.textarea.addEventListener('click', () => this.updateStatus());
    this.textarea.addEventListener('keyup', () => this.updateStatus());

    if (typeof ResizeObserver !== 'undefined') {
      this.ro = new ResizeObserver(() => this.syncScroll());
      this.ro.observe(this.el);
    }

    this.setValue(value);
    this.el.__codeEditor = this;
  }

  destroy() {
    if (this.ro) { this.ro.disconnect(); this.ro = null; }
  }

  // -- value -----------------------------------------------------------------

  get value() { return this.textarea.value; }

  setValue(code, { keepCursor = false } = {}) {
    const pos = this.textarea.selectionStart;
    this.textarea.value = code || '';
    if (keepCursor) this.textarea.selectionStart = this.textarea.selectionEnd = Math.min(pos, this.textarea.value.length);
    this.sync(false);
  }

  focus() { this.textarea.focus(); }

  setFilename(name) { this.filenameEl.textContent = name; }

  highlightExecutionLine(line) {
    const next = Number(line);
    const count = this.textarea.value.split('\n').length;
    this.executionLine = Number.isInteger(next) && next >= 1 && next <= count ? next : null;
    this.updateExecutionLine();
  }

  clearExecutionLine() { this.executionLine = null; this.updateExecutionLine(); }

  updateExecutionLine() {
    for (const row of this.gutter.children) {
      const active = Number(row.textContent) === this.executionLine;
      if (active) row.dataset.executionLine = 'true';
      else delete row.dataset.executionLine;
    }
    if (!this.executionLine) {
      this.executionLineEl.style.display = 'none';
      return;
    }
    const lineHeight = parseFloat(getComputedStyle(this.el).getPropertyValue('--ce-line-height')) || 21;
    this.executionLineEl.style.display = 'block';
    this.executionLineEl.style.transform = `translateY(${12 + (this.executionLine - 1) * lineHeight - this.textarea.scrollTop}px)`;
  }

  // -- rendering -------------------------------------------------------------

  sync(notify = true) {
    const code = this.textarea.value;
    this.highlight.innerHTML = `${highlightJava(code)}\n`;

    const lines = code.split('\n').length;
    if (this.renderedLines !== lines) {
      this.gutter.innerHTML = Array.from({ length: lines }, (_, i) => `<span>${i + 1}</span>`).join('');
      this.renderedLines = lines;
    }
    if (this.executionLine && this.executionLine > lines) this.executionLine = null;
    this.updateExecutionLine();
    this.syncScroll();
    this.updateStatus();
    if (notify && this.onChange) this.onChange(code);
  }

  syncScroll() {
    this.highlight.style.transform = `translate(${-this.textarea.scrollLeft}px, ${-this.textarea.scrollTop}px)`;
    this.gutter.scrollTop = this.textarea.scrollTop;
    this.updateExecutionLine();
  }

  updateStatus() {
    const pos = this.textarea.selectionStart;
    const before = this.textarea.value.slice(0, pos);
    const line = before.split('\n').length;
    const column = pos - before.lastIndexOf('\n');
    const selected = this.textarea.selectionEnd - this.textarea.selectionStart;
    this.statusEl.textContent =
      `Ln ${line}, Col ${column}${selected ? ` · ${selected} selected` : ''} · ${this.textarea.value.split('\n').length} lines`
      + '   —   ⌘/Ctrl+Enter run · ⌘/Ctrl+S save · ⌘/Ctrl+/ comment';
  }

  zoom(direction) {
    this.fontSize = Math.min(20, Math.max(10, this.fontSize + direction * 0.5));
    localStorage.setItem('studio.editor.fontSize', String(this.fontSize));
    this.applyFontSize();
  }

  applyFontSize() {
    this.el.style.setProperty('--ce-font-size', `${this.fontSize}px`);
    this.el.style.setProperty('--ce-line-height', `${Math.round(this.fontSize * 1.55)}px`);
  }

  scrollToCursor() {
    const pos = this.textarea.selectionStart;
    const before = this.textarea.value.slice(0, pos);
    const line = before.split('\n').length;
    const lineHeight = Math.round(this.fontSize * 1.55);
    const cursorY = (line - 1) * lineHeight;
    const clientHeight = this.textarea.clientHeight;
    if (clientHeight > 0 && (cursorY < this.textarea.scrollTop || cursorY > this.textarea.scrollTop + clientHeight - lineHeight * 2)) {
      this.textarea.scrollTop = Math.max(0, cursorY - Math.floor(clientHeight / 3));
      this.syncScroll();
    }
  }

  // -- editing primitives ----------------------------------------------------

  /** Insert text preserving the native undo stack when possible. */
  insert(text) {
    this.textarea.focus();
    if (!document.execCommand || !document.execCommand('insertText', false, text)) {
      const { selectionStart: s, selectionEnd: e, value } = this.textarea;
      this.textarea.value = value.slice(0, s) + text + value.slice(e);
      this.textarea.selectionStart = this.textarea.selectionEnd = s + text.length;
    }
    this.sync();
  }

  replaceRange(start, end, text, cursor) {
    this.textarea.setSelectionRange(start, end);
    if (!document.execCommand || !document.execCommand('insertText', false, text)) {
      const value = this.textarea.value;
      this.textarea.value = value.slice(0, start) + text + value.slice(end);
    }
    if (cursor != null) this.textarea.setSelectionRange(cursor, cursor);
    this.sync();
  }

  lineBounds(pos) {
    const value = this.textarea.value;
    const start = value.lastIndexOf('\n', pos - 1) + 1;
    let end = value.indexOf('\n', pos);
    if (end === -1) end = value.length;
    return { start, end, text: value.slice(start, end) };
  }

  indentOf(line) {
    const match = line.match(/^[ \t]*/);
    return match ? match[0] : '';
  }

  // -- keyboard --------------------------------------------------------------

  onKeyDown(event) {
    const mod = event.metaKey || event.ctrlKey;
    const { selectionStart: start, selectionEnd: end, value } = this.textarea;

    if (mod && event.key === 'Enter') { event.preventDefault(); this.onRun && this.onRun(); return; }
    if (mod && event.key.toLowerCase() === 's') { event.preventDefault(); this.onSave && this.onSave(); return; }
    if (mod && event.shiftKey && event.key.toLowerCase() === 'f') { event.preventDefault(); this.format(); return; }
    if (mod && event.key === '/') { event.preventDefault(); this.toggleComment(); return; }
    if (mod && event.key.toLowerCase() === 'd') { event.preventDefault(); this.duplicateLine(); return; }
    if (event.altKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      event.preventDefault(); this.moveLine(event.key === 'ArrowUp' ? -1 : 1); return;
    }

    if (event.key === 'Tab') {
      if (event.shiftKey || this.textarea.dataset.tabMode === 'indent') {
        event.preventDefault();
        if (start !== end || event.shiftKey) this.indentSelection(event.shiftKey ? -1 : 1);
        else this.insert(INDENT.slice(0, INDENT.length - ((this.columnOf(start) - 1) % INDENT.length)));
        return;
      }
      // Press Esc to toggle between tab-as-focus and tab-as-indent; default is focus.
      return;
    }
    if (event.key === 'Escape') {
      this.textarea.dataset.tabMode = this.textarea.dataset.tabMode === 'indent' ? 'focus' : 'indent';
      return;
    }

    if (event.key === 'Enter') { event.preventDefault(); this.smartNewline(); return; }

    // Auto-close pairs
    if (PAIRS[event.key] && !event.metaKey && !event.ctrlKey) {
      const closing = PAIRS[event.key];
      const nextChar = value[end] || '';
      const selected = value.slice(start, end);

      if (selected) { // wrap the selection
        event.preventDefault();
        this.replaceRange(start, end, event.key + selected + closing, null);
        this.textarea.setSelectionRange(start + 1, start + 1 + selected.length);
        return;
      }
      if ((event.key === '"' || event.key === "'") && /[\w"']/.test(nextChar)) return;
      if (/[\w$]/.test(nextChar)) return;

      event.preventDefault();
      this.insert(event.key + closing);
      this.textarea.setSelectionRange(start + 1, start + 1);
      this.updateStatus();
      return;
    }

    // Type over a closing character we inserted
    if (CLOSERS.has(event.key) && start === end && value[start] === event.key) {
      event.preventDefault();
      this.textarea.setSelectionRange(start + 1, start + 1);
      this.updateStatus();
      return;
    }

    // Backspace removes both halves of an empty pair
    if (event.key === 'Backspace' && start === end && start > 0) {
      const before = value[start - 1];
      const after = value[start];
      if (PAIRS[before] && PAIRS[before] === after) {
        event.preventDefault();
        this.replaceRange(start - 1, start + 1, '', start - 1);
        return;
      }
      // Backspace over a full indent step
      const { start: lineStart } = this.lineBounds(start);
      const prefix = value.slice(lineStart, start);
      if (prefix.length && /^ +$/.test(prefix) && prefix.length % INDENT.length === 0) {
        event.preventDefault();
        this.replaceRange(start - INDENT.length, start, '', start - INDENT.length);
      }
    }
  }

  columnOf(pos) {
    const value = this.textarea.value;
    return pos - (value.lastIndexOf('\n', pos - 1) + 1) + 1;
  }

  /** Enter: keep the indent, add one level after `{`, and expand `{|}`. */
  smartNewline() {
    const { selectionStart: start, selectionEnd: end, value } = this.textarea;
    const line = this.lineBounds(start);
    const beforeCursor = value.slice(line.start, start);
    let indent = this.indentOf(line.text);

    const opensBlock = /[{([]\s*$/.test(beforeCursor.trim()) || /\{\s*$/.test(beforeCursor);
    const startsCase = /^\s*(case\b|default\b)/.test(beforeCursor.trim());
    if (opensBlock || startsCase) indent += INDENT;

    const nextChar = value[end] || '';
    if (opensBlock && (nextChar === '}' || nextChar === ')' || nextChar === ']')) {
      const closingIndent = indent.slice(0, Math.max(0, indent.length - INDENT.length));
      this.insert(`\n${indent}\n${closingIndent}`);
      const pos = start + 1 + indent.length;
      this.textarea.setSelectionRange(pos, pos);
      this.sync();
      return;
    }

    this.insert(`\n${indent}`);
  }

  indentSelection(direction) {
    const { selectionStart: start, selectionEnd: end, value } = this.textarea;
    const from = value.lastIndexOf('\n', start - 1) + 1;
    let to = value.indexOf('\n', end);
    if (to === -1) to = value.length;

    const block = value.slice(from, to);
    const updated = block.split('\n').map((line) => {
      if (direction > 0) return INDENT + line;
      return line.replace(new RegExp(`^( {1,${INDENT.length}}|\t)`), '');
    }).join('\n');

    this.replaceRange(from, to, updated);
    this.textarea.setSelectionRange(from, from + updated.length);
    this.updateStatus();
  }

  toggleComment() {
    const { selectionStart: start, selectionEnd: end, value } = this.textarea;
    const from = value.lastIndexOf('\n', start - 1) + 1;
    let to = value.indexOf('\n', end);
    if (to === -1) to = value.length;

    const lines = value.slice(from, to).split('\n');
    const allCommented = lines.every((l) => !l.trim() || /^\s*\/\//.test(l));
    const updated = lines.map((line) => {
      if (!line.trim()) return line;
      if (allCommented) return line.replace(/^(\s*)\/\/ ?/, '$1');
      const indent = this.indentOf(line);
      return `${indent}// ${line.slice(indent.length)}`;
    }).join('\n');

    this.replaceRange(from, to, updated);
    this.textarea.setSelectionRange(from, from + updated.length);
  }

  duplicateLine() {
    const { selectionStart: start } = this.textarea;
    const line = this.lineBounds(start);
    this.replaceRange(line.end, line.end, `\n${line.text}`, start + line.text.length + 1);
  }

  moveLine(direction) {
    const { selectionStart: start, value } = this.textarea;
    const line = this.lineBounds(start);
    const column = start - line.start;

    if (direction < 0) {
      if (line.start === 0) return;
      const prev = this.lineBounds(line.start - 1);
      const swapped = `${line.text}\n${prev.text}`;
      this.replaceRange(prev.start, line.end, swapped, prev.start + column);
    } else {
      if (line.end >= value.length) return;
      const next = this.lineBounds(line.end + 1);
      const swapped = `${next.text}\n${line.text}`;
      this.replaceRange(line.start, next.end, swapped, line.start + next.text.length + 1 + column);
    }
  }

  /** Re-indent the whole buffer from its brace structure. */
  format() {
    const lines = this.value.split('\n');
    let depth = 0;
    const formatted = lines.map((raw) => {
      const line = raw.trim();
      if (!line) return '';
      const startsWithCloser = /^[}\])]/.test(line);
      if (startsWithCloser) depth = Math.max(0, depth - 1);
      const result = INDENT.repeat(depth) + line;
      const opens = (line.match(/[{[(]/g) || []).length;
      const closes = (line.match(/[}\])]/g) || []).length;
      // the leading closer was already accounted for above
      depth = Math.max(0, depth + opens - closes + (startsWithCloser ? 1 : 0));
      return result;
    }).join('\n');

    const pos = this.textarea.selectionStart;
    this.replaceRange(0, this.value.length, formatted, Math.min(pos, formatted.length));
  }
}

/** Tiny DOM + formatting helpers shared by every view. */

export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (value == null || value === false) continue;
    if (key === 'class') el.className = value;
    else if (key === 'html') el.innerHTML = value;
    else if (key === 'dataset') Object.assign(el.dataset, value);
    else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2).toLowerCase(), value);
    else if (key === 'style' && typeof value === 'object') Object.assign(el.style, value);
    else el.setAttribute(key, value);
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
  return node;
}

export function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ---------------------------------------------------------------------------
// Java syntax highlighting (used by the editor overlay and by <pre> blocks)
// ---------------------------------------------------------------------------

const JAVA_KEYWORDS = new Set(['abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
  'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally',
  'float', 'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native',
  'new', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp', 'super',
  'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'var', 'void', 'volatile',
  'while', 'true', 'false', 'null', 'record', 'sealed', 'yield']);

const JAVA_TYPES = new Set(['String', 'Integer', 'Character', 'Boolean', 'Double', 'Long', 'Object', 'List',
  'ArrayList', 'LinkedList', 'Map', 'HashMap', 'TreeMap', 'LinkedHashMap', 'Set', 'HashSet', 'TreeSet',
  'LinkedHashSet', 'Deque', 'ArrayDeque', 'Queue', 'PriorityQueue', 'Stack', 'Arrays', 'Collections',
  'Math', 'StringBuilder', 'Comparator', 'Iterator', 'Optional', 'Stream', 'System', 'Exception',
  'ListNode', 'TreeNode', 'Solution', 'Node']);

/** Returns highlighted HTML for a Java source string. */
export function highlightJava(source) {
  const tokens = String(source).split(/(\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?[LlFfDd]?\b|\w+|\s+|.)/g);
  let out = '';
  for (const token of tokens) {
    if (!token) continue;
    const safe = esc(token);
    if (/^\/[/*]/.test(token)) out += `<span class="tk-comment">${safe}</span>`;
    else if (/^["']/.test(token)) out += `<span class="tk-string">${safe}</span>`;
    else if (/^\d/.test(token)) out += `<span class="tk-number">${safe}</span>`;
    else if (JAVA_KEYWORDS.has(token)) out += `<span class="tk-keyword">${safe}</span>`;
    else if (JAVA_TYPES.has(token) || /^[A-Z][A-Za-z0-9_]*$/.test(token)) out += `<span class="tk-type">${safe}</span>`;
    else if (/^[{}()[\];,.]$/.test(token)) out += `<span class="tk-punct">${safe}</span>`;
    else if (/^[+\-*/%=<>!&|^~?:]+$/.test(token)) out += `<span class="tk-operator">${safe}</span>`;
    else out += safe;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Minimal Markdown → HTML (statements, editorials, tutor replies)
// ---------------------------------------------------------------------------

export function markdown(text) {
  if (!text) return '';
  const blocks = String(text).split(/```/);
  let html = '';

  blocks.forEach((block, index) => {
    if (index % 2 === 1) {
      const [firstLine, ...rest] = block.split('\n');
      const lang = /^[a-z]+$/i.test(firstLine.trim()) ? firstLine.trim() : null;
      const code = (lang ? rest.join('\n') : block).replace(/^\n|\n$/g, '');
      const body = lang === 'java' || !lang ? highlightJava(code) : esc(code);
      html += `<pre class="code-block"><button class="copy-btn" data-copy="${esc(code)}">Copy</button><code>${body}</code></pre>`;
      return;
    }

    const subBlocks = block.split(/\n{2,}/);
    subBlocks.forEach((paragraph) => {
      const lines = paragraph.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
      if (!lines.length) return;

      // Check for markdown table
      const hasTableLines = lines.some((l) => /^\s*\|.*\|\s*$/.test(l));
      const hasSepLine = lines.some((l) => /^\s*\|(?:\s*:?-+:?\s*\|)+\s*$/.test(l));
      if (hasTableLines && hasSepLine) {
        const tableHtml = renderTable(lines);
        if (tableHtml) {
          html += tableHtml;
          return;
        }
      }

      if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
        html += `<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ''))}</li>`).join('')}</ul>`;
        return;
      }
      if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
        html += `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\s*\d+[.)]\s+/, ''))}</li>`).join('')}</ol>`;
        return;
      }
      const heading = lines[0].match(/^(#{1,4})\s+(.*)$/);
      if (heading && lines.length === 1) {
        const level = Math.min(heading[1].length + 2, 6);
        html += `<h${level}>${inline(heading[2])}</h${level}>`;
        return;
      }
      html += `<p>${lines.map(inline).join('<br>')}</p>`;
    });
  });

  return html;
}

function renderTable(lines) {
  const tableLines = lines.filter((l) => /^\s*\|.*\|\s*$/.test(l));
  if (tableLines.length < 2) return null;

  const isSeparator = (l) => /^\s*\|(?:\s*:?-+:?\s*\|)+\s*$/.test(l);
  const rows = [];
  let headerRow = null;

  for (const line of tableLines) {
    if (isSeparator(line)) continue;
    const cells = line
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((c) => c.trim());

    if (!headerRow) {
      headerRow = cells;
    } else {
      rows.push(cells);
    }
  }

  if (!headerRow || !headerRow.length) return null;

  const thead = `<thead><tr>${headerRow.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${rows.map((row) => `<tr>${row.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody>`;

  return `<div class="table-wrap"><table class="md-table">${thead}${tbody}</table></div>`;
}

function inline(text) {
  if (!text) return '';
  const withBreakPlaceholders = String(text).replace(/<br\s*\/?>/gi, '___BR_TAG___');
  const safe = esc(withBreakPlaceholders);
  return safe
    .replace(/___BR_TAG___/g, '<br>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

// ---------------------------------------------------------------------------
// Misc formatting
// ---------------------------------------------------------------------------

export function plural(count, word, suffix = 's') {
  return `${count} ${word}${count === 1 ? '' : suffix}`;
}

export function formatMinutes(minutes) {
  if (!minutes) return '0m';
  const hours = Math.floor(minutes / 60);
  const rest = Math.round(minutes % 60);
  return hours ? `${hours}h ${rest ? `${rest}m` : ''}`.trim() : `${rest}m`;
}

export function difficultyClass(difficulty) {
  return `diff diff-${String(difficulty || '').toLowerCase()}`;
}

export function debounce(fn, wait = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

// ---------------------------------------------------------------------------
// Toasts
// ---------------------------------------------------------------------------

export function toast(message, kind = 'info', ms = 3200) {
  let host = document.getElementById('toastHost');
  if (!host) {
    host = h('div', { id: 'toastHost', class: 'toast-host' });
    document.body.append(host);
  }
  const node = h('div', { class: `toast toast-${kind}` }, message);
  host.append(node);
  requestAnimationFrame(() => node.classList.add('in'));
  setTimeout(() => {
    node.classList.remove('in');
    setTimeout(() => node.remove(), 250);
  }, ms);
}

/** Delegated copy-to-clipboard for markdown code blocks. */
document.addEventListener('click', (event) => {
  const button = event.target.closest('.copy-btn');
  if (!button) return;
  navigator.clipboard.writeText(button.dataset.copy || '').then(() => {
    button.textContent = 'Copied';
    setTimeout(() => { button.textContent = 'Copy'; }, 1400);
  });
});

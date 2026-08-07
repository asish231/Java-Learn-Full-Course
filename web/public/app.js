document.addEventListener('DOMContentLoaded', () => {
  let problemCatalog = [];
  let currentProblem = null;
  let activeCategory = 'all';
  let activeFilter = 'all';
  let searchQuery = '';
  let selectedCompany = 'all';
  let tutorHistory = [];

  // DOM References
  const onboardingOverlay = document.getElementById('onboardingOverlay');
  const startLearningBtn = document.getElementById('startLearningBtn');
  const sidebarEl = document.getElementById('sidebar');
  const problemPaneEl = document.getElementById('problemPane');
  const consolePaneEl = document.getElementById('consolePane');
  const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
  const toggleProblemPaneBtn = document.getElementById('toggleProblemPaneBtn');
  const expandProblemPaneBtn = document.getElementById('expandProblemPaneBtn');
  const toggleConsoleBtn = document.getElementById('toggleConsoleBtn');
  const consoleHeaderEl = document.getElementById('consoleHeader');
  const problemListEl = document.getElementById('problemList');
  const problemCounterEl = document.getElementById('problemCounter');
  const searchInputEl = document.getElementById('searchInput');
  const companySelectContainer = document.getElementById('companySelectContainer');
  const companySelectEl = document.getElementById('companySelect');
  const titleEl = document.getElementById('problemTitle');
  const diffEl = document.getElementById('problemDiff');
  const descEl = document.getElementById('problemDesc');
  const examplesEl = document.getElementById('examplesContainer');
  const hintsEl = document.getElementById('hintsContainer');
  const editorEl = document.getElementById('codeEditor');
  const lineNumbersEl = document.getElementById('lineNumbers');
  const editorFilenameEl = document.getElementById('editorFilename');
  const revealCardEl = document.getElementById('solutionRevealCard');
  const revealBtnEl = document.getElementById('revealSolutionBtn');
  const solCodeContainerEl = document.getElementById('solutionCodeContainer');
  const solDisplayEl = document.getElementById('solutionCodeDisplay');
  const consoleBodyEl = document.getElementById('consoleBody');
  const statusIndicatorEl = document.getElementById('statusIndicator');
  const statusTextEl = document.getElementById('statusText');
  const elapsedTimeTextEl = document.getElementById('elapsedTimeText');
  const runBtn = document.getElementById('runBtn');
  const resetBtn = document.getElementById('resetBtn');
  const solutionBtn = document.getElementById('solutionBtn');

  // Tutor Elements
  const openTutorBtn = document.getElementById('openTutorBtn');
  const closeTutorBtn = document.getElementById('closeTutorBtn');
  const tutorDrawer = document.getElementById('tutorDrawer');
  const tutorMessages = document.getElementById('tutorMessages');
  const tutorInput = document.getElementById('tutorInput');
  const tutorSendBtn = document.getElementById('tutorSendBtn');

  // === ONBOARDING ===
  if (localStorage.getItem('dsa-studio-onboarded')) {
    onboardingOverlay.classList.add('hidden');
  }

  startLearningBtn.addEventListener('click', () => {
    onboardingOverlay.classList.add('hidden');
    localStorage.setItem('dsa-studio-onboarded', 'true');
  });

  // === SIDEBAR TOGGLE ===
  toggleSidebarBtn.addEventListener('click', () => {
    sidebarEl.classList.toggle('collapsed');
    toggleSidebarBtn.textContent = sidebarEl.classList.contains('collapsed') ? '▶' : '◀';
  });

  // === PROBLEM PANE TOGGLE ===
  toggleProblemPaneBtn.addEventListener('click', () => {
    problemPaneEl.classList.add('collapsed');
    expandProblemPaneBtn.style.display = 'inline-flex';
  });

  expandProblemPaneBtn.addEventListener('click', () => {
    problemPaneEl.classList.remove('collapsed');
    expandProblemPaneBtn.style.display = 'none';
  });

  // === CONSOLE TOGGLE ===
  function toggleConsole() {
    consolePaneEl.classList.toggle('minimized');
    const isMin = consolePaneEl.classList.contains('minimized');
    toggleConsoleBtn.textContent = isMin ? '▲' : '▼';
  }

  toggleConsoleBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleConsole(); });
  consoleHeaderEl.addEventListener('click', (e) => { if (e.target !== toggleConsoleBtn) toggleConsole(); });

  // === SOLUTION REVEAL ===
  revealBtnEl.addEventListener('click', () => {
    revealCardEl.style.display = 'none';
    solCodeContainerEl.style.display = 'block';
  });

  // === SEARCH ===
  searchInputEl.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderProblemList();
  });

  // === LINE NUMBERS ===
  function updateLineNumbers() {
    const lines = editorEl.value.split('\n').length;
    lineNumbersEl.innerHTML = Array.from({ length: Math.max(lines, 1) }, (_, i) => i + 1).join('<br>');
  }

  editorEl.addEventListener('input', updateLineNumbers);
  editorEl.addEventListener('scroll', () => { lineNumbersEl.scrollTop = editorEl.scrollTop; });

  // Tab key
  editorEl.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = editorEl.selectionStart;
      editorEl.value = editorEl.value.substring(0, s) + '    ' + editorEl.value.substring(editorEl.selectionEnd);
      editorEl.selectionStart = editorEl.selectionEnd = s + 4;
      updateLineNumbers();
    }
  });

  // === FETCH COMPANIES ===
  fetch('/api/companies')
    .then(r => r.json())
    .then(companies => {
      if (companySelectEl && companies.length > 0) {
        let html = '<option value="all">— All Companies —</option>';
        companies.forEach(c => { html += `<option value="${c.id}">${esc(c.name)}</option>`; });
        companySelectEl.innerHTML = html;
      }
    }).catch(() => {});

  companySelectEl.addEventListener('change', (e) => {
    selectedCompany = e.target.value;
    if (selectedCompany !== 'all') {
      // Set category to Company Tracks
      document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
      const ct = document.querySelector('.category-chip[data-cat="Company Tracks"]');
      if (ct) ct.classList.add('active');
      activeCategory = 'Company Tracks';

      // Fetch full company questions on-demand
      fetch(`/api/company-problems?company=${selectedCompany}&period=all`)
        .then(r => r.json())
        .then(data => {
          // Remove old entries for this company, add new
          problemCatalog = problemCatalog.filter(p => p.companySlug !== selectedCompany);
          problemCatalog.push(...data);
          renderProblemList();
        })
        .catch(() => renderProblemList());
    } else {
      renderProblemList();
    }
  });

  // === FETCH PROBLEMS ===
  fetch('/api/problems')
    .then(r => r.json())
    .then(data => {
      problemCatalog = data;
      renderProblemList();
      if (problemCatalog.length > 0) selectProblem(problemCatalog[0].id);
    })
    .catch(err => {
      consoleBodyEl.innerHTML = `<span class="log-error">Server connection failed: ${err.message}</span>`;
    });

  // === CATEGORY CHIPS ===
  document.querySelectorAll('.category-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.dataset.cat;
      companySelectContainer.style.display = activeCategory === 'Company Tracks' ? 'block' : 'none';
      renderProblemList();
    });
  });

  // === DIFFICULTY CHIPS ===
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.dataset.diff;
      renderProblemList();
    });
  });

  // === TAB SWITCHING ===
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.getElementById('tabDesc').style.display = target === 'desc' ? 'block' : 'none';
      document.getElementById('tabSol').style.display = target === 'sol' ? 'block' : 'none';
    });
  });

  // === RENDER PROBLEM LIST ===
  function renderProblemList() {
    problemListEl.innerHTML = '';
    const filtered = problemCatalog.filter(p => {
      const catMatch = activeCategory === 'all' || p.category === activeCategory;
      const diffMatch = activeFilter === 'all' || p.difficulty === activeFilter;
      const compMatch = selectedCompany === 'all' || !p.companySlug || p.companySlug === selectedCompany;
      const searchMatch = !searchQuery ||
        p.title.toLowerCase().includes(searchQuery) ||
        p.moduleName.toLowerCase().includes(searchQuery) ||
        (p.description && p.description.toLowerCase().includes(searchQuery)) ||
        (p.companyName && p.companyName.toLowerCase().includes(searchQuery));
      return catMatch && diffMatch && compMatch && searchMatch;
    });

    if (problemCounterEl) problemCounterEl.textContent = `${filtered.length} items`;

    if (filtered.length === 0) {
      problemListEl.innerHTML = '<div style="padding: 20px; color: var(--text-muted); text-align: center; font-size: 0.82rem;">No matching problems found.</div>';
      return;
    }

    const grouped = {};
    filtered.forEach(p => {
      const mod = p.moduleName || 'Other';
      if (!grouped[mod]) grouped[mod] = [];
      grouped[mod].push(p);
    });

    Object.keys(grouped).forEach(modName => {
      const header = document.createElement('div');
      header.className = 'module-group-header';
      header.textContent = modName;
      problemListEl.appendChild(header);

      grouped[modName].forEach(p => {
        const card = document.createElement('div');
        card.className = `problem-card${currentProblem && currentProblem.id === p.id ? ' active' : ''}`;
        const freq = p.frequency && p.frequency !== 'N/A' ? `<span class="freq-badge">⚡${esc(p.frequency)}</span>` : '';
        card.innerHTML = `
          <div class="problem-card-title">${esc(p.title)} ${freq}</div>
          <div class="problem-card-meta">
            <span>${esc(p.filePath || '')}</span>
            <span class="badge badge-${p.difficulty.toLowerCase()}">${p.difficulty}</span>
          </div>`;
        card.addEventListener('click', () => selectProblem(p.id));
        problemListEl.appendChild(card);
      });
    });
  }

  // === SELECT PROBLEM ===
  function selectProblem(problemId) {
    currentProblem = problemCatalog.find(p => p.id === problemId);
    if (!currentProblem) return;

    renderProblemList();

    titleEl.textContent = currentProblem.title;
    diffEl.textContent = currentProblem.difficulty;
    diffEl.className = `badge badge-${currentProblem.difficulty.toLowerCase()}`;
    descEl.textContent = currentProblem.description;
    if (editorFilenameEl) editorFilenameEl.textContent = `${currentProblem.title.replace(/[^A-Za-z0-9_]/g, '')}.java`;

    // LeetCode link + examples
    let html = '';
    if (currentProblem.leetcodeUrl) {
      html += `<div class="leetcode-link-box">🔗 <strong>LeetCode:</strong> <a href="${currentProblem.leetcodeUrl}" target="_blank" rel="noopener">${currentProblem.leetcodeUrl}</a></div>`;
    }

    const examples = currentProblem.examples || [];
    if (examples.length > 0) {
      examples.forEach((ex, i) => {
        html += `<div class="example-box"><strong>Example ${i + 1}:</strong><br><code>Input:  ${esc(ex.input)}</code><br><code>Output: ${esc(ex.output)}</code></div>`;
      });
    } else if (!currentProblem.leetcodeUrl) {
      html += `<div class="example-box" style="color: var(--accent-cyan);">📍 <strong>Source:</strong> <code>${esc(currentProblem.filePath || 'src/')}</code></div>`;
    }
    examplesEl.innerHTML = html;

    // Hints
    const hints = currentProblem.hints || [];
    hintsEl.innerHTML = hints.map((hint, i) => `
      <div class="hint-accordion">
        <div class="hint-header" onclick="this.parentElement.classList.toggle('open')">
          <span>💡 ${i + 1}. Hint</span><span>▼</span>
        </div>
        <div class="hint-body">${esc(hint)}</div>
      </div>`).join('');

    editorEl.value = currentProblem.starterCode || '';
    if (solDisplayEl.querySelector('code')) {
      solDisplayEl.querySelector('code').textContent = currentProblem.solutionCode || '';
    }
    revealCardEl.style.display = 'block';
    solCodeContainerEl.style.display = 'none';
    updateLineNumbers();

    consoleBodyEl.innerHTML = '<span style="color: var(--text-muted);">Ready to execute...</span>';
    statusIndicatorEl.className = 'status-indicator';
    statusTextEl.textContent = 'Console';
    elapsedTimeTextEl.textContent = '';
  }

  // === BUTTONS ===
  resetBtn.addEventListener('click', () => {
    if (currentProblem) { editorEl.value = currentProblem.starterCode; updateLineNumbers(); }
  });

  solutionBtn.addEventListener('click', () => {
    document.querySelector('.tab[data-tab="sol"]').click();
  });

  // === RUN CODE ===
  runBtn.addEventListener('click', () => {
    const code = editorEl.value;
    if (!code.trim()) return;
    if (consolePaneEl.classList.contains('minimized')) toggleConsole();

    statusIndicatorEl.className = 'status-indicator';
    statusTextEl.textContent = 'Compiling...';
    consoleBodyEl.innerHTML = '<span style="color: var(--accent-orange);">⏳ Compiling & executing...</span>';
    runBtn.disabled = true;

    fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
    .then(r => r.json())
    .then(data => {
      runBtn.disabled = false;
      elapsedTimeTextEl.textContent = `${data.elapsedMs || 0}ms`;
      if (data.status === 'Success') {
        statusIndicatorEl.className = 'status-indicator status-success';
        statusTextEl.textContent = 'Success';
        consoleBodyEl.innerHTML = `<span class="log-stdout">${esc(data.stdout || 'No output.')}</span>`;
      } else {
        statusIndicatorEl.className = 'status-indicator status-error';
        statusTextEl.textContent = data.status || 'Error';
        consoleBodyEl.innerHTML = `<span class="log-error">${esc(data.error || 'Unknown error.')}</span>`;
      }
    })
    .catch(err => {
      runBtn.disabled = false;
      statusIndicatorEl.className = 'status-indicator status-error';
      statusTextEl.textContent = 'Network Error';
      consoleBodyEl.innerHTML = `<span class="log-error">Connection failed: ${err.message}</span>`;
    });
  });

  // === AI TUTOR ===
  openTutorBtn.addEventListener('click', () => { tutorDrawer.classList.add('open'); tutorInput.focus(); });
  closeTutorBtn.addEventListener('click', () => { tutorDrawer.classList.remove('open'); });

  tutorInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendTutorMessage(); }
  });
  tutorSendBtn.addEventListener('click', sendTutorMessage);

  function sendTutorMessage() {
    const msg = tutorInput.value.trim();
    if (!msg) return;

    // Add user message
    appendTutorMsg(msg, 'user');
    tutorInput.value = '';
    tutorSendBtn.disabled = true;

    // Build context
    const systemPrompt = `You are a helpful Java DSA tutor. You explain data structures, algorithms, and coding concepts clearly and concisely. Use code examples in Java when helpful. Keep answers focused and educational. If the student shares code, review it and give constructive feedback.`;

    const contextMsg = currentProblem
      ? `[Current Problem Context]\nTitle: ${currentProblem.title}\nDifficulty: ${currentProblem.difficulty}\nDescription: ${currentProblem.description}\nCurrent code in editor:\n\`\`\`java\n${editorEl.value.substring(0, 1500)}\n\`\`\``
      : '';

    tutorHistory.push({ role: 'user', content: msg });

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(contextMsg ? [{ role: 'user', content: contextMsg }] : []),
      ...tutorHistory.slice(-10)
    ];

    // Show typing indicator
    const typingEl = document.createElement('div');
    typingEl.className = 'tutor-typing';
    typingEl.textContent = 'Thinking...';
    tutorMessages.appendChild(typingEl);
    tutorMessages.scrollTop = tutorMessages.scrollHeight;

    fetch('/api/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    })
    .then(r => r.json())
    .then(data => {
      typingEl.remove();
      tutorSendBtn.disabled = false;
      const reply = data.reply || data.error || 'Sorry, I could not generate a response.';
      tutorHistory.push({ role: 'assistant', content: reply });
      appendTutorMsg(reply, 'ai');
    })
    .catch(err => {
      typingEl.remove();
      tutorSendBtn.disabled = false;
      appendTutorMsg(`Error connecting to tutor: ${err.message}`, 'ai');
    });
  }

  function appendTutorMsg(text, role) {
    const div = document.createElement('div');
    div.className = `tutor-msg ${role}`;
    // Basic markdown-ish formatting for AI responses
    if (role === 'ai') {
      let formatted = esc(text);
      // Code blocks
      formatted = formatted.replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
      // Inline code
      formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
      // Bold
      formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      // Line breaks
      formatted = formatted.replace(/\n/g, '<br>');
      div.innerHTML = formatted;
    } else {
      div.textContent = text;
    }
    tutorMessages.appendChild(div);
    tutorMessages.scrollTop = tutorMessages.scrollHeight;
  }

  function esc(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
});

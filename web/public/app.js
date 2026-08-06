document.addEventListener('DOMContentLoaded', () => {
  let problemCatalog = [];
  let currentProblem = null;
  let activeCategory = 'all';
  let activeFilter = 'all';
  let searchQuery = '';
  let selectedCompany = 'all';

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

  // 1. Sidebar Toggle
  toggleSidebarBtn.addEventListener('click', () => {
    sidebarEl.classList.toggle('collapsed');
    const isCollapsed = sidebarEl.classList.contains('collapsed');
    toggleSidebarBtn.textContent = isCollapsed ? '▶ Sidebar' : '◀ Sidebar';
    toggleSidebarBtn.title = isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar';
  });

  // 2. Problem Description Pane Toggle
  toggleProblemPaneBtn.addEventListener('click', () => {
    problemPaneEl.classList.add('collapsed');
    expandProblemPaneBtn.style.display = 'inline-flex';
  });

  expandProblemPaneBtn.addEventListener('click', () => {
    problemPaneEl.classList.remove('collapsed');
    expandProblemPaneBtn.style.display = 'none';
  });

  // 3. Console Panel Toggle
  function toggleConsole() {
    consolePaneEl.classList.toggle('minimized');
    const isMin = consolePaneEl.classList.contains('minimized');
    toggleConsoleBtn.textContent = isMin ? '▲' : '▼';
    toggleConsoleBtn.title = isMin ? 'Maximize Console' : 'Minimize Console';
  }

  toggleConsoleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleConsole();
  });

  consoleHeaderEl.addEventListener('click', (e) => {
    if (e.target !== toggleConsoleBtn) {
      toggleConsole();
    }
  });

  // 4. Reveal Solution Button
  revealBtnEl.addEventListener('click', () => {
    revealCardEl.style.display = 'none';
    solCodeContainerEl.style.display = 'block';
  });

  // Search Input listener
  if (searchInputEl) {
    searchInputEl.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderProblemList();
    });
  }

  // Fetch full company dropdown list
  fetch('/api/companies')
    .then(res => res.json())
    .then(companies => {
      if (companySelectEl && companies.length > 0) {
        let html = '<option value="all">-- All Companies --</option>';
        companies.forEach(c => {
          html += `<option value="${c.id}">${escapeHtml(c.name)}</option>`;
        });
        companySelectEl.innerHTML = html;
      }
    })
    .catch(err => console.warn('Failed to load company list:', err));

  if (companySelectEl) {
    companySelectEl.addEventListener('change', (e) => {
      selectedCompany = e.target.value;
      if (selectedCompany !== 'all' && activeCategory !== 'Company Tracks') {
        // Automatically switch category chip to Company Tracks if a company is selected
        document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
        const compChip = document.querySelector('.category-chip[data-cat="Company Tracks"]');
        if (compChip) compChip.classList.add('active');
        activeCategory = 'Company Tracks';
      }
      renderProblemList();
    });
  }

  // Line Numbers Synchronization
  function updateLineNumbers() {
    const lines = editorEl.value.split('\n').length;
    lineNumbersEl.innerHTML = Array.from({ length: Math.max(lines, 1) }, (_, i) => i + 1).join('<br>');
  }

  editorEl.addEventListener('input', updateLineNumbers);
  editorEl.addEventListener('scroll', () => {
    lineNumbersEl.scrollTop = editorEl.scrollTop;
  });

  // Tab key handling inside textarea
  editorEl.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editorEl.selectionStart;
      const end = editorEl.selectionEnd;
      editorEl.value = editorEl.value.substring(0, start) + "    " + editorEl.value.substring(end);
      editorEl.selectionStart = editorEl.selectionEnd = start + 4;
      updateLineNumbers();
    }
  });

  // Fetch Problem Catalog
  fetch('/api/problems')
    .then(res => res.json())
    .then(data => {
      problemCatalog = data;
      renderProblemList();
      if (problemCatalog.length > 0) {
        selectProblem(problemCatalog[0].id);
      }
    })
    .catch(err => {
      consoleBodyEl.innerHTML = `<span class="log-error">Failed to connect to backend server: ${err.message}</span>`;
    });

  // Category Chips
  document.querySelectorAll('.category-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.dataset.cat;

      if (activeCategory === 'Company Tracks') {
        companySelectContainer.style.display = 'block';
      } else {
        companySelectContainer.style.display = 'none';
      }

      renderProblemList();
    });
  });

  // Level Chips
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.dataset.diff;
      renderProblemList();
    });
  });

  // Tab Switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.tab;
      document.getElementById('tabDesc').style.display = target === 'desc' ? 'block' : 'none';
      document.getElementById('tabSol').style.display = target === 'sol' ? 'block' : 'none';
    });
  });

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

    if (problemCounterEl) {
      problemCounterEl.textContent = `${filtered.length} files`;
    }

    if (filtered.length === 0) {
      problemListEl.innerHTML = '<div style="padding: 16px; color: #888; text-align: center;">No matching interview problems found.</div>';
      return;
    }

    // Group items by moduleName
    const grouped = {};
    filtered.forEach(p => {
      const mod = p.moduleName || 'Other Practice Files';
      if (!grouped[mod]) grouped[mod] = [];
      grouped[mod].push(p);
    });

    Object.keys(grouped).forEach(modName => {
      const moduleHeader = document.createElement('div');
      moduleHeader.className = 'module-group-header';
      moduleHeader.style.cssText = 'padding: 8px 12px; font-size: 11px; font-weight: bold; color: var(--accent-orange, #ff9800); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.2); margin-top: 8px;';
      moduleHeader.textContent = modName;
      problemListEl.appendChild(moduleHeader);

      grouped[modName].forEach(p => {
        const card = document.createElement('div');
        card.className = `problem-card ${currentProblem && currentProblem.id === p.id ? 'active' : ''}`;
        
        const freqBadge = p.frequency && p.frequency !== 'N/A' ? `<span style="font-size: 10px; color: #64ffda; margin-left: 6px;">⚡ Freq: ${escapeHtml(p.frequency)}</span>` : '';

        card.innerHTML = `
          <div class="problem-card-title">${escapeHtml(p.title)} ${freqBadge}</div>
          <div class="problem-card-meta">
            <span style="font-size: 10px; opacity: 0.7;">${escapeHtml(p.filePath || p.moduleName)}</span>
            <span class="badge badge-${p.difficulty.toLowerCase()}">${p.difficulty}</span>
          </div>
        `;
        card.addEventListener('click', () => selectProblem(p.id));
        problemListEl.appendChild(card);
      });
    });
  }

  function selectProblem(problemId) {
    currentProblem = problemCatalog.find(p => p.id === problemId);
    if (!currentProblem) return;

    renderProblemList();

    titleEl.textContent = currentProblem.title;
    diffEl.textContent = currentProblem.difficulty;
    diffEl.className = `badge badge-${currentProblem.difficulty.toLowerCase()}`;
    descEl.textContent = currentProblem.description;

    if (editorFilenameEl) {
      editorFilenameEl.textContent = `${currentProblem.title.replace(/[^A-Za-z0-9_]/g, '') || 'Solution'}.java`;
    }

    // LeetCode Direct Link badge
    const leetCodeLinkHtml = currentProblem.leetcodeUrl ? `
      <div style="margin-top: 10px; padding: 10px; background: rgba(100, 255, 218, 0.08); border-radius: 6px; border: 1px solid rgba(100, 255, 218, 0.2);">
        🔗 <strong>LeetCode Problem Link:</strong> <a href="${currentProblem.leetcodeUrl}" target="_blank" style="color: #64ffda; text-decoration: underline;">${currentProblem.leetcodeUrl}</a>
      </div>
    ` : '';

    // Examples
    const examples = currentProblem.examples || [];
    if (examples.length > 0) {
      examplesEl.innerHTML = leetCodeLinkHtml + examples.map((ex, i) => `
        <div class="example-box" style="margin-top: 8px;">
          <strong>Information ${i + 1}:</strong><br>
          <code>Input:  ${escapeHtml(ex.input)}</code><br>
          <code>Output: ${escapeHtml(ex.output)}</code>
        </div>
      `).join('');
    } else {
      examplesEl.innerHTML = leetCodeLinkHtml + `
        <div class="example-box" style="font-size: 12px; color: var(--accent-blue, #64ffda); margin-top: 8px;">
          📍 <strong>Source Path:</strong> <code>${escapeHtml(currentProblem.filePath || 'src/')}</code>
        </div>
      `;
    }

    // Hints
    const hints = currentProblem.hints || [];
    hintsEl.innerHTML = hints.map((hint, i) => `
      <div class="hint-accordion">
        <div class="hint-header" onclick="this.parentElement.classList.toggle('open')">
          <span>💡 Info / Strategy ${i + 1}</span>
          <span>▼</span>
        </div>
        <div class="hint-body">${escapeHtml(hint)}</div>
      </div>
    `).join('');

    // Load starter code
    editorEl.value = currentProblem.starterCode || '';
    if (solDisplayEl.querySelector('code')) {
      solDisplayEl.querySelector('code').textContent = currentProblem.solutionCode || currentProblem.starterCode || '';
    }
    
    revealCardEl.style.display = 'block';
    solCodeContainerEl.style.display = 'none';
    
    updateLineNumbers();

    // Reset console
    consoleBodyEl.innerHTML = '<span style="color: #666;">Ready to execute code...</span>';
    statusIndicatorEl.className = 'status-indicator';
    statusTextEl.textContent = 'Console Ready';
    elapsedTimeTextEl.textContent = '';
  }

  // Buttons
  resetBtn.addEventListener('click', () => {
    if (currentProblem) {
      editorEl.value = currentProblem.starterCode;
      updateLineNumbers();
    }
  });

  solutionBtn.addEventListener('click', () => {
    document.querySelector('.tab[data-tab="sol"]').click();
  });

  runBtn.addEventListener('click', () => {
    const code = editorEl.value;
    if (!code.trim()) return;

    if (consolePaneEl.classList.contains('minimized')) {
      toggleConsole();
    }

    statusIndicatorEl.className = 'status-indicator';
    statusTextEl.textContent = 'Compiling & Running...';
    consoleBodyEl.innerHTML = '<span style="color: var(--accent-orange);">Executing javac & java on Mac...</span>';
    runBtn.disabled = true;

    fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
    .then(res => res.json())
    .then(data => {
      runBtn.disabled = false;
      elapsedTimeTextEl.textContent = `${data.elapsedMs || 0} ms`;

      if (data.status === 'Success') {
        statusIndicatorEl.className = 'status-indicator status-success';
        statusTextEl.textContent = 'Execution Success';
        consoleBodyEl.innerHTML = `<span class="log-stdout">${escapeHtml(data.stdout || 'Finished with no output.')}</span>`;
      } else {
        statusIndicatorEl.className = 'status-indicator status-error';
        statusTextEl.textContent = data.status || 'Error';
        consoleBodyEl.innerHTML = `<span class="log-error">${escapeHtml(data.error || 'Unknown error occurred.')}</span>`;
      }
    })
    .catch(err => {
      runBtn.disabled = false;
      statusIndicatorEl.className = 'status-indicator status-error';
      statusTextEl.textContent = 'Network Error';
      consoleBodyEl.innerHTML = `<span class="log-error">Failed to connect: ${err.message}</span>`;
    });
  });

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
});

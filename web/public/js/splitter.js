/**
 * splitter.js — resizable panels with draggable resizer handles.
 *
 * Allows dragging between left (doc/problem) pane, center (editor/runner) pane,
 * and right (tutor) panel with smooth auto-alignment and persistent widths.
 */
import { h } from './util.js';

export function makeResizable({ container, leftPane, rightPane, tutorPane, key = 'studio.split' }) {
  const leftKey = `${key}.leftRatio`;
  const tutorKey = `${key}.tutorWidth`;

  let leftRatio = parseFloat(localStorage.getItem(leftKey)) || 0.42;
  let tutorWidth = parseInt(localStorage.getItem(tutorKey), 10) || 340;

  // Ensure panes have correct layout classes/styles
  container.classList.add('resizable-container');
  leftPane.classList.add('resizable-left');
  rightPane.classList.add('resizable-right');

  // Create middle splitter handle
  const middleSplitter = h('div', { class: 'splitter middle-splitter', title: 'Drag to resize panels' });
  
  // Insert middle splitter between left and right panes
  if (leftPane.nextSibling !== middleSplitter) {
    container.insertBefore(middleSplitter, rightPane);
  }

  // Create tutor splitter if tutorPane exists
  let tutorSplitter = null;
  if (tutorPane) {
    tutorPane.classList.add('resizable-tutor');
    tutorSplitter = h('div', { class: 'splitter tutor-splitter', title: 'Drag to resize tutor panel' });
    if (tutorPane.previousSibling !== tutorSplitter) {
      container.insertBefore(tutorSplitter, tutorPane);
    }
  }

  function applyLayout() {
    const isTutorVisible = tutorPane && tutorPane.style.display !== 'none';
    if (tutorSplitter) {
      tutorSplitter.style.display = isTutorVisible ? 'flex' : 'none';
    }

    const containerWidth = container.clientWidth || window.innerWidth - 68;
    const currentTutorW = isTutorVisible ? tutorWidth : 0;
    const splittersW = isTutorVisible ? 16 : 8;
    const availableW = Math.max(400, containerWidth - currentTutorW - splittersW);

    const leftW = Math.max(260, Math.min(availableW - 280, availableW * leftRatio));

    leftPane.style.flex = `0 0 ${leftW}px`;
    leftPane.style.width = `${leftW}px`;

    rightPane.style.flex = '1 1 0%';
    rightPane.style.minWidth = '280px';

    if (tutorPane && isTutorVisible) {
      tutorPane.style.flex = `0 0 ${tutorWidth}px`;
      tutorPane.style.width = `${tutorWidth}px`;
    }

    window.dispatchEvent(new Event('resize'));
  }

  // --- Middle Splitter Drag ---
  let isDraggingMiddle = false;
  let startX = 0;
  let startLeftW = 0;

  middleSplitter.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    isDraggingMiddle = true;
    startX = e.clientX;
    startLeftW = leftPane.getBoundingClientRect().width;

    middleSplitter.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    middleSplitter.setPointerCapture(e.pointerId);
  });

  middleSplitter.addEventListener('pointermove', (e) => {
    if (!isDraggingMiddle) return;
    const isTutorVisible = tutorPane && tutorPane.style.display !== 'none';
    const containerWidth = container.clientWidth;
    const currentTutorW = isTutorVisible ? tutorWidth : 0;
    const splittersW = isTutorVisible ? 16 : 8;
    const availableW = Math.max(400, containerWidth - currentTutorW - splittersW);

    const deltaX = e.clientX - startX;
    const newLeftW = Math.max(260, Math.min(availableW - 280, startLeftW + deltaX));
    leftRatio = newLeftW / availableW;

    leftPane.style.flex = `0 0 ${newLeftW}px`;
    leftPane.style.width = `${newLeftW}px`;
    window.dispatchEvent(new Event('resize'));
  });

  const stopMiddleDrag = (e) => {
    if (!isDraggingMiddle) return;
    isDraggingMiddle = false;
    middleSplitter.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    localStorage.setItem(leftKey, String(leftRatio));
    if (e.pointerId) {
      try { middleSplitter.releasePointerCapture(e.pointerId); } catch (_) {}
    }
  };

  middleSplitter.addEventListener('pointerup', stopMiddleDrag);
  middleSplitter.addEventListener('pointercancel', stopMiddleDrag);

  // --- Tutor Splitter Drag ---
  if (tutorSplitter) {
    let isDraggingTutor = false;
    let startTutorX = 0;
    let startTutorW = 0;

    tutorSplitter.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      isDraggingTutor = true;
      startTutorX = e.clientX;
      startTutorW = tutorPane.getBoundingClientRect().width;

      tutorSplitter.classList.add('dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      tutorSplitter.setPointerCapture(e.pointerId);
    });

    tutorSplitter.addEventListener('pointermove', (e) => {
      if (!isDraggingTutor) return;
      const deltaX = startTutorX - e.clientX;
      const newTutorW = Math.max(240, Math.min(550, startTutorW + deltaX));
      tutorWidth = newTutorW;

      tutorPane.style.flex = `0 0 ${newTutorW}px`;
      tutorPane.style.width = `${newTutorW}px`;

      // Re-adjust left pane to fit nicely
      const containerWidth = container.clientWidth;
      const splittersW = 16;
      const availableW = Math.max(400, containerWidth - tutorWidth - splittersW);
      const newLeftW = Math.max(260, Math.min(availableW - 280, availableW * leftRatio));

      leftPane.style.flex = `0 0 ${newLeftW}px`;
      leftPane.style.width = `${newLeftW}px`;

      window.dispatchEvent(new Event('resize'));
    });

    const stopTutorDrag = (e) => {
      if (!isDraggingTutor) return;
      isDraggingTutor = false;
      tutorSplitter.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      localStorage.setItem(tutorKey, String(tutorWidth));
      if (e.pointerId) {
        try { tutorSplitter.releasePointerCapture(e.pointerId); } catch (_) {}
      }
    };

    tutorSplitter.addEventListener('pointerup', stopTutorDrag);
    tutorSplitter.addEventListener('pointercancel', stopTutorDrag);
  }

  // Initial layout application
  applyLayout();

  // Return helper to re-apply layout on visibility toggle or window resize
  return {
    update: applyLayout
  };
}

/**
 * track.js — batched behaviour beacons for the Learning OS.
 * Never invents metrics; only sends real UI/lifecycle events.
 *
 * A "focus bucket" is one stretch of time on one screen. While it runs we split
 * the wall clock into *active* time (gaps between real interactions) and *idle*
 * time (gaps longer than IDLE_GAP_MS), which is what the feature engine uses
 * for the active-coding factor instead of a proxy.
 */
import { api } from './api.js';

const IDLE_GAP_MS = 45000;      // longer than this between actions counts as idle
const BUCKET_MS = 5 * 60000;    // never let one bucket grow past 5 minutes

const queue = [];
let flushTimer = null;
let bucketTimer = null;
let context = {};

let focusStarted = 0;
let lastActivityAt = 0;
let activeMs = 0;
let idleMs = 0;
let keystrokes = 0;

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(flush, 1200);
}

export function track(type, payload = {}) {
  if (!type) return;
  queue.push({
    type: String(type).slice(0, 64),
    ts: new Date().toISOString(),
    payload: { ...payload }
  });
  if (queue.length >= 12) flush();
  else scheduleFlush();
}

export async function flush() {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (!queue.length) return;
  const batch = queue.splice(0, 50);
  try {
    await api.postEvents(batch);
  } catch {
    // drop on failure — analytics must not block learning
  }
}

/**
 * Replaces the context (it is not merged): leaving a problem for a lesson must
 * not keep attributing time to the problem's topics.
 */
export function setTrackContext(next = {}) {
  context = { ...next };
}

/** Fold the time since the last interaction into the active/idle split. */
function markActivity({ typing = false } = {}) {
  if (!focusStarted) return;
  const now = Date.now();
  const gap = now - lastActivityAt;
  if (gap > 0) {
    if (gap <= IDLE_GAP_MS) activeMs += gap;
    else idleMs += gap;
  }
  lastActivityAt = now;
  if (typing) keystrokes += 1;
}

/** Start a new focus bucket. Any bucket still open is closed first. */
export function startFocus() {
  if (focusStarted) endFocus({ reason: 'restart' });
  const now = Date.now();
  focusStarted = now;
  lastActivityAt = now;
  activeMs = 0;
  idleMs = 0;
  keystrokes = 0;
  if (bucketTimer) clearInterval(bucketTimer);
  bucketTimer = setInterval(() => {
    // Long single-screen sessions still report time while they happen.
    endFocus({ reason: 'tick' });
    startFocus();
  }, BUCKET_MS);
}

export function endFocus(extra = {}) {
  if (!focusStarted) return;
  markActivity();
  const ms = Date.now() - focusStarted;
  const bucket = { activeMs, idleMs, keystrokes };
  focusStarted = 0;
  lastActivityAt = 0;
  activeMs = 0;
  idleMs = 0;
  keystrokes = 0;
  if (bucketTimer && extra.reason !== 'restart') {
    clearInterval(bucketTimer);
    bucketTimer = null;
  }
  if (ms < 2000) return;

  track('focus_ms', { ms, activeMs: bucket.activeMs, idleMs: bucket.idleMs, ...context, ...extra });
  if (bucket.keystrokes > 0) {
    track('code_activity', {
      keystrokes: bucket.keystrokes,
      activeMs: bucket.activeMs,
      idleMs: bucket.idleMs,
      ...context,
      ...extra
    });
  }
}

export async function endSession(outcomes = {}) {
  endFocus({ reason: 'session_end' });
  await flush();
  try {
    await api.sessionEnd({ context, outcomes });
  } catch {
    /* optional */
  }
}

if (typeof window !== 'undefined') {
  const isEditor = (node) => !!(node && node.closest && node.closest('.code-editor'));

  document.addEventListener('keydown', (e) => markActivity({ typing: isEditor(e.target) }), { passive: true });
  document.addEventListener('pointerdown', () => markActivity(), { passive: true });
  document.addEventListener('wheel', () => markActivity(), { passive: true });

  window.addEventListener('visibilitychange', () => {
    if (document.hidden) endFocus({ reason: 'hidden' });
    else startFocus();
  });

  const sendOnExit = () => {
    endFocus({ reason: 'unload' });
    if (queue.length && navigator.sendBeacon) {
      try {
        navigator.sendBeacon('/api/events', new Blob([JSON.stringify({ events: queue.splice(0) })], { type: 'application/json' }));
      } catch { /* ignore */ }
    }
  };
  window.addEventListener('pagehide', sendOnExit);
  window.addEventListener('beforeunload', sendOnExit);
}

/** Shared client state + a tiny hash router. */
import { api } from './api.js';

let savedTheme = 'dark';
try { savedTheme = localStorage.getItem('studio.theme') || 'dark'; } catch (_) {}

export const state = {
  boot: null,          // /api/bootstrap payload
  profile: null,
  chapters: [],
  stats: {},
  summary: {},
  tutorReady: false,
  theme: savedTheme
};

export async function loadBootstrap() {
  const boot = await api.bootstrap();
  state.boot = boot;
  state.profile = boot.profile;
  state.chapters = boot.chapters;
  state.stats = boot.stats;
  state.summary = boot.summary;
  state.tutorReady = boot.tutorReady;
  return boot;
}

export async function refreshSummary() {
  const { summary, progress } = await api.progress();
  state.summary = summary;
  if (state.boot) state.boot.progress = progress;
  return summary;
}

export function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('studio.theme', theme); } catch (_) {}
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

export function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [pathPart, queryPart] = raw.split('?');
  const parts = pathPart.split('/').filter(Boolean).map(decodeURIComponent);
  const query = Object.fromEntries(new URLSearchParams(queryPart || ''));
  return { name: parts[0] || 'home', parts, query };
}

export function navigate(hash) {
  if (location.hash === hash) window.dispatchEvent(new HashChangeEvent('hashchange'));
  else location.hash = hash;
}

export function onRoute(handler) {
  window.addEventListener('hashchange', () => handler(parseRoute()));
  handler(parseRoute());
}

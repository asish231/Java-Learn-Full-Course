/** Shared chrome used by every view: page header, scroll body, small widgets. */
import { h } from './util.js';

/** Sticky page header. `back` is a hash route string. */
export function pageHeader({ title, crumb, back, actions = [] } = {}) {
  return h('header', { class: 'topbar' },
    back ? h('button', { class: 'btn btn-ghost btn-sm', 'aria-label': 'Go back', onClick: () => { location.hash = back; } }, '←') : null,
    h('h1', {}, title || ''),
    crumb ? h('span', { class: 'crumb' }, crumb) : null,
    h('div', { class: 'spacer' }),
    ...actions
  );
}

/** Scrollable page body with comfortable max width. */
export function pageBody(...children) {
  return h('div', { class: 'view', role: 'region', 'aria-label': 'Page content' }, h('div', { class: 'view-pad' }, ...children));
}

/** Full-height body (workspace-style views that manage their own scrolling). */
export function fullBody(...children) {
  return h('div', { class: 'view', style: { overflow: 'hidden' } }, ...children);
}

export function statCard(value, label) {
  return h('div', { class: 'stat-card' },
    h('div', { class: 'stat-value' }, String(value)),
    h('div', { class: 'stat-label' }, label));
}

export function progressBar(percent, done = false) {
  const value = Math.round(Math.max(0, Math.min(100, percent)));
  return h('div', { class: 'progress-track', role: 'progressbar', 'aria-label': `${value}% complete`, 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': value },
    h('div', { class: `progress-fill${done ? ' done' : ''}`, style: { width: `${Math.max(0, Math.min(100, percent))}%` } }));
}

export function loading(text = 'Loading…') {
  return h('div', { class: 'empty', role: 'status', 'aria-live': 'polite' }, h('span', { class: 'spinner', 'aria-hidden': 'true' }), ' ', text);
}

export function errorBox(message) {
  return h('div', { class: 'empty', role: 'alert' }, `⚠️ ${message}`);
}

export function statusDot(status) {
  const icon = status === 'solved' ? '✓' : status === 'attempted' ? '•' : '';
  return h('div', { class: `q-status ${status || ''}` }, icon);
}

/**
 * icons.js — SVG icons for Java DSA Studio.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl(name, attrs = {}, innerHTML = '') {
  const el = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, String(value));
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

export function iconHTML(name, options = {}) {
  return icon(name, options).outerHTML;
}

/** SVG icon generator returns an <svg> DOM element */
export function icon(name, { class: className = 'icon', size = 18, strokeWidth = 2, color = 'currentColor' } = {}) {
  const attrs = {
    viewBox: '0 0 24 24',
    width: size,
    height: size,
    fill: 'none',
    stroke: color,
    'stroke-width': strokeWidth,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    class: `icon icon-${name}${className ? ` ${className}` : ''}`,
    'aria-hidden': 'true'
  };

  switch (name) {
    case 'logo':
    case 'octopus': {
      const img = document.createElement('img');
      img.src = 'icon.png';
      img.width = size;
      img.height = size;
      img.className = `icon icon-${name}${className ? ` ${className}` : ''}`;
      img.alt = 'Logo';
      return img;
    }

    case 'home':
      return svgEl('svg', attrs, '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>');

    case 'learn':
      return svgEl('svg', attrs, '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="14" y2="10"/>');

    case 'practice':
      return svgEl('svg', attrs, '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/>');

    case 'insights':
      return svgEl('svg', attrs, '<path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/><path d="M9 21h6"/>');

    case 'mock':
      return svgEl('svg', attrs, '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/><path d="M12 2v2"/>');

    case 'career':
      return svgEl('svg', attrs, '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>');

    case 'placement':
      return svgEl('svg', attrs, '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>');

    case 'progress':
      return svgEl('svg', attrs, '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>');

    case 'bot':
    case 'robot':
    case 'tutor':
      return svgEl('svg', attrs, '<rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="15" x2="8" y2="15.01"/><line x1="16" y1="15" x2="16" y2="15.01"/><path d="M9 18h6"/>');

    case 'hint':
    case 'lightbulb':
      return svgEl('svg', attrs, '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14A6 6 0 0 0 18 9a6 6 0 0 0-12 0 6 6 0 0 0 2.91 5"/>');

    case 'search':
      return svgEl('svg', attrs, '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>');

    case 'gear':
    case 'settings':
      return svgEl('svg', attrs, '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>');

    case 'theme':
    case 'moon':
      return svgEl('svg', attrs, '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>');

    case 'play':
    case 'run':
      return svgEl('svg', { ...attrs, fill: 'currentColor' }, '<polygon points="5 3 19 12 5 21 5 3"/>');

    case 'pause':
      return svgEl('svg', { ...attrs, fill: 'currentColor' }, '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>');

    case 'check':
    case 'success':
      return svgEl('svg', attrs, '<polyline points="20 6 9 17 4 12"/>');

    case 'check-circle':
      return svgEl('svg', attrs, '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>');

    case 'alert':
    case 'warning':
      return svgEl('svg', attrs, '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>');

    case 'arrow-left':
    case 'back':
      return svgEl('svg', attrs, '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>');

    case 'arrow-right':
    case 'next':
      return svgEl('svg', attrs, '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>');

    case 'refresh':
    case 'reset':
      return svgEl('svg', attrs, '<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>');

    case 'star':
      return svgEl('svg', attrs, '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>');

    case 'eye':
    case 'visualize':
      return svgEl('svg', attrs, '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>');

    case 'file-code':
      return svgEl('svg', attrs, '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 13l-2 2 2 2"/><path d="M14 13l2 2-2 2"/>');

    case 'cpu':
      return svgEl('svg', attrs, '<rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/>');

    case 'sparkles':
      return svgEl('svg', attrs, '<path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"/>');

    case 'plus':
    case 'add':
      return svgEl('svg', attrs, '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>');

    case 'book':
      return svgEl('svg', attrs, '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>');

    default:
      return svgEl('svg', attrs, '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>');
  }
}

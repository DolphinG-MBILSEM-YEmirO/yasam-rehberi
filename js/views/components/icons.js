// Inline SVG icons (paths from the Lucide icon set, ISC license).
// Icons are decorative, so they are hidden from screen readers.

const SVG_NS = 'http://www.w3.org/2000/svg';

const PATHS = {
  compass: ['<circle cx="12" cy="12" r="10"/>', '<path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/>'],
  truck: [
    '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>',
    '<path d="M15 18H9"/>',
    '<path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>',
    '<circle cx="17" cy="18" r="2"/>',
    '<circle cx="7" cy="18" r="2"/>',
  ],
  baby: [
    '<path d="M9 12h.01"/>',
    '<path d="M15 12h.01"/>',
    '<path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/>',
    '<path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/>',
  ],
  car: [
    '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>',
    '<circle cx="7" cy="17" r="2"/>',
    '<path d="M9 17h6"/>',
    '<circle cx="17" cy="17" r="2"/>',
  ],
  heart: [
    '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  ],
  briefcase: ['<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>', '<rect width="20" height="14" x="2" y="6" rx="2"/>'],
  sun: [
    '<circle cx="12" cy="12" r="4"/>',
    '<path d="M12 2v2"/>',
    '<path d="M12 20v2"/>',
    '<path d="m4.93 4.93 1.41 1.41"/>',
    '<path d="m17.66 17.66 1.41 1.41"/>',
    '<path d="M2 12h2"/>',
    '<path d="M20 12h2"/>',
    '<path d="m6.34 17.66-1.41 1.41"/>',
    '<path d="m19.07 4.93-1.41 1.41"/>',
  ],
  feather: [
    '<path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"/>',
    '<path d="M16 8 2 22"/>',
    '<path d="M17.5 15H9"/>',
  ],
  shield: [
    '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  ],
  calendar: [
    '<path d="M8 2v4"/>',
    '<path d="M16 2v4"/>',
    '<rect width="18" height="18" x="3" y="4" rx="2"/>',
    '<path d="M3 10h18"/>',
  ],
  arrowUp: ['<path d="m5 12 7-7 7 7"/>', '<path d="M12 19V5"/>'],
};

/** Create an SVG icon element by name, e.g. icon('car', 'card-icon__svg'). */
export function icon(name, className = 'icon') {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('class', className);
  // Paths are static strings defined above, never user data.
  svg.innerHTML = (PATHS[name] || PATHS.compass).join('');
  return svg;
}

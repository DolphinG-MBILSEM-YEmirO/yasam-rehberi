// Entry point: a tiny hash router that renders the matching view into #app.
// Hash routing keeps the site fully static (no server configuration needed).

import { mount } from './lib/dom.js';
import { renderHome } from './views/home.js';
import { renderGuide } from './views/guide.js';
import { renderCalendar } from './views/calendar.js';
import { findGuide } from './data/guides/index.js';

const SITE_NAME = 'Yaşam Rehberi';

const routes = [
  { pattern: /^\/$/, nav: 'guides', title: () => null, render: () => renderHome() },
  {
    pattern: /^\/rehber\/([a-z0-9-]+)$/,
    nav: 'guides',
    title: ([id]) => findGuide(id)?.title ?? 'Rehber',
    render: ([id]) => renderGuide(id),
  },
  { pattern: /^\/takvim$/, nav: 'calendar', title: () => 'Resmî takvim', render: () => renderCalendar() },
];

function currentPath() {
  const hash = window.location.hash.replace(/^#/, '');
  return hash || '/';
}

function updateNav(activeNav) {
  document.querySelectorAll('[data-nav]').forEach((link) => {
    if (link.dataset.nav === activeNav) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

let isFirstRender = true;

function render() {
  const app = document.getElementById('app');
  const path = currentPath();

  for (const route of routes) {
    const match = path.match(route.pattern);
    if (!match) continue;

    const params = match.slice(1);
    mount(app, route.render(params));
    updateNav(route.nav);
    const title = route.title(params);
    document.title = title ? `${title} – ${SITE_NAME}` : SITE_NAME;
    window.scrollTo(0, 0);

    // Move focus to the new content so screen readers announce the page change.
    if (!isFirstRender) app.focus({ preventScroll: true });
    isFirstRender = false;
    return;
  }

  // Unknown route: fall back to the home page.
  window.location.hash = '#/';
}

// The skip link targets #app, which would otherwise be read as a route.
document.querySelector('.skip-link')?.addEventListener('click', (event) => {
  event.preventDefault();
  document.getElementById('app').focus();
});

window.addEventListener('hashchange', render);
render();

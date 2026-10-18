// Home page: introduces the site and lists available and upcoming guides.

import { el } from '../lib/dom.js';
import { guides, upcomingGuides } from '../data/guides/index.js';

export function renderHome() {
  return [
    el(
      'section',
      { class: 'hero' },
      el('h1', { text: 'Hayatın resmî işleri, sıralı ve size özel' }),
      el('p', {
        class: 'hero__lead',
        text: 'Birkaç soruyu yanıtlayın; hangi kuruma, hangi belgeyle, hangi tarihe kadar gitmeniz gerektiğini adım adım gösterelim.',
      }),
      el(
        'div',
        { class: 'fact-strip', 'aria-label': 'Örnek süreler' },
        el('span', { class: 'fact', text: 'Adres bildirimi: 20 iş günü' }),
        el('span', { class: 'fact', text: 'MTV: Ocak ve Temmuz' }),
        el('span', { class: 'fact', text: 'Emlak vergisi: Mayıs ve Kasım' }),
      ),
      el(
        'div',
        { class: 'button-row' },
        el(
          'button',
          {
            class: 'button',
            type: 'button',
            onclick: () => {
              const heading = document.getElementById('guides-heading');
              heading?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              heading?.focus({ preventScroll: true });
            },
          },
          'Rehberleri gör',
        ),
        el('a', { class: 'button button--secondary', href: '#/takvim' }, 'Resmî takvimi aç'),
      ),
    ),

    el('h2', { id: 'guides-heading', tabindex: -1, text: 'Rehberler' }),
    el(
      'div',
      { class: 'card-grid' },
      guides.map((guide) =>
        el(
          'a',
          { class: 'card-link', href: `#/rehber/${guide.id}` },
          el('div', { class: 'card' }, el('span', { class: 'badge', text: 'Hazır' }), el('h3', { text: guide.title }), el('p', { class: 'muted', text: guide.summary })),
        ),
      ),
      upcomingGuides.map((guide) =>
        el('div', { class: 'card' }, el('span', { class: 'badge badge--soon', text: 'Yakında' }), el('h3', { text: guide.title }), el('p', { class: 'muted', text: guide.summary })),
      ),
    ),

    el('h2', { text: 'Kişisel resmî takvim' }),
    el(
      'a',
      { class: 'card-link', href: '#/takvim' },
      el(
        'div',
        { class: 'card' },
        el('h3', { text: 'Unutulan tarihlere son' }),
        el('p', {
          class: 'muted',
          text: 'MTV, emlak vergisi, araç muayenesi, sigorta yenilemeleri ve belge süreleri; telefonunuzun takvimine tek dosyayla eklenir.',
        }),
      ),
    ),
  ];
}

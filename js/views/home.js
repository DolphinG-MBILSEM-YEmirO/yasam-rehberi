// Home page: introduces the site and lists available and upcoming guides.

import { el } from '../lib/dom.js';
import { guides, upcomingGuides } from '../data/guides/index.js';
import { icon } from './components/icons.js';

// Presentation for each guide card: icon name and accent color.
const GUIDE_VISUALS = {
  tasinma: { icon: 'truck', accent: 'teal' },
  'bebek-dogumu': { icon: 'baby', accent: 'amber' },
  'arac-satin-alma': { icon: 'car', accent: 'ink' },
  evlilik: { icon: 'heart', accent: 'rust' },
  'isten-ayrilma': { icon: 'briefcase', accent: 'teal' },
  emeklilik: { icon: 'sun', accent: 'amber' },
  vefat: { icon: 'feather', accent: 'ink' },
};

const UPCOMING_ICONS = {
  Askerlik: 'shield',
};

/** Stagger entrance animations so hero parts appear one after another. */
const delay = (index) => `animation-delay: ${index * 60}ms`;

function cardIcon(name, accent) {
  return el('span', { class: `card-icon card-icon--${accent}` }, icon(name));
}

export function renderHome() {
  return [
    el(
      'section',
      { class: 'hero' },
      el('div', { class: 'hero__blobs', 'aria-hidden': 'true' }),
      el('p', { class: 'eyebrow fade-up', style: delay(0) }, icon('compass'), 'Türkiye\'deki resmî işler için'),
      el('h1', { class: 'fade-up', style: delay(1), text: 'Hayatın resmî işleri, sıralı ve size özel' }),
      el('p', {
        class: 'hero__lead fade-up',
        style: delay(2),
        text: 'Birkaç soruyu yanıtlayın; hangi kuruma, hangi belgeyle, hangi tarihe kadar gitmeniz gerektiğini adım adım gösterelim.',
      }),
      el(
        'div',
        { class: 'button-row fade-up', style: delay(3) },
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
      el(
        'dl',
        { class: 'stats fade-up', style: delay(4), 'aria-label': 'Örnek süreler' },
        renderStat(String(guides.length), 'Hazır rehber'),
        renderStat('20 iş günü', 'Adres bildirimi süresi'),
        renderStat('4 ay', 'Veraset beyannamesi süresi'),
        renderStat('Ücretsiz', 'Kayıt yok, veriler cihazınızda'),
      ),
    ),

    el(
      'div',
      { class: 'section-intro' },
      el('p', { class: 'eyebrow', text: 'Rehberler' }),
      el('h2', { id: 'guides-heading', tabindex: -1, text: 'Hangi hayat olayını yaşıyorsunuz?' }),
      el('p', {
        class: 'muted',
        text: 'Her rehber durumunuza göre yalnızca size uyan adımları ve yasal son tarihleri gösterir.',
      }),
    ),
    el(
      'div',
      { class: 'card-grid' },
      guides.map((guide) => {
        const visual = GUIDE_VISUALS[guide.id] || { icon: 'compass', accent: 'ink' };
        return el(
          'a',
          { class: 'card-link', href: `#/rehber/${guide.id}` },
          el(
            'div',
            { class: 'card' },
            el('div', { class: 'card__top' }, cardIcon(visual.icon, visual.accent), el('span', { class: 'badge', text: 'Hazır' })),
            el('h3', { text: guide.title }),
            el('p', { class: 'muted', text: guide.summary }),
          ),
        );
      }),
      upcomingGuides.map((guide) =>
        el(
          'div',
          { class: 'card card--soon' },
          el(
            'div',
            { class: 'card__top' },
            cardIcon(UPCOMING_ICONS[guide.title] || 'compass', 'ink'),
            el('span', { class: 'badge badge--soon', text: 'Yakında' }),
          ),
          el('h3', { text: guide.title }),
          el('p', { class: 'muted', text: guide.summary }),
        ),
      ),
    ),

    el(
      'div',
      { class: 'section-intro' },
      el('p', { class: 'eyebrow', text: 'Takvim' }),
      el('h2', { text: 'Kişisel resmî takvim' }),
    ),
    el(
      'a',
      { class: 'card-link', href: '#/takvim' },
      el(
        'div',
        { class: 'card card--feature' },
        cardIcon('calendar', 'teal'),
        el(
          'div',
          {},
          el('h3', { text: 'Unutulan tarihlere son' }),
          el('p', {
            class: 'muted',
            text: 'MTV, emlak vergisi, araç muayenesi, sigorta yenilemeleri ve belge süreleri; telefonunuzun takvimine tek dosyayla eklenir.',
          }),
        ),
      ),
    ),
  ];
}

function renderStat(value, label) {
  return el('div', { class: 'stat' }, el('dt', { text: value }), el('dd', { text: label }));
}

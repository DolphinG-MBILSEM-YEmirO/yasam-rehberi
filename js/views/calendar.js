// Personal official calendar page: collects a few dates, lists upcoming
// official deadlines and exports them as an .ics file.

import { el, remount, externalLink, downloadText } from '../lib/dom.js';
import { loadJSON, saveJSON } from '../lib/storage.js';
import { addMonths, formatDate, relativeLabel, toISODate, today } from '../lib/dates.js';
import { buildCalendar } from '../lib/ics.js';
import { calendarFields, buildCalendarEvents } from '../data/calendar-rules.js';
import { renderField } from './components/form-field.js';

const STORAGE_KEY = 'calendar';
const WINDOW_MONTHS = 24;

export function renderCalendar() {
  const root = el('div');
  let answers = loadJSON(STORAGE_KEY, {});

  const setAnswer = (id, value) => {
    answers = { ...answers, [id]: value };
    saveJSON(STORAGE_KEY, answers);
    draw();
  };

  const draw = () => {
    const from = today();
    const until = addMonths(from, WINDOW_MONTHS);
    const events = buildCalendarEvents(answers, from, until);
    remount(root, renderForm(answers, setAnswer), renderEvents(events));
  };

  draw();
  return [
    el('h1', { text: 'Kişisel resmî takvim' }),
    el('p', {
      class: 'muted',
      text: `Bildiğiniz tarihleri girin; önümüzdeki ${WINDOW_MONTHS} ayın resmî son tarihleri anında hesaplanır.`,
    }),
    root,
  ];
}

function renderForm(answers, setAnswer) {
  return el(
    'div',
    { class: 'card no-print' },
    calendarFields.map((section) => [
      el('h2', { text: section.group }),
      section.fields
        .filter((field) => !field.showIf || field.showIf(answers))
        .map((field) => renderField(field, answers[field.id], setAnswer)),
    ]),
  );
}

function renderEvents(events) {
  if (!events.length) {
    return el('div', { class: 'card' }, el('p', { class: 'muted', text: 'Henüz gösterilecek bir tarih yok. Yukarıdaki soruları yanıtladıkça liste dolacak.' }));
  }

  return el(
    'div',
    { class: 'card' },
    el('h2', { text: `Yaklaşan tarihler (${events.length})` }),
    el(
      'ul',
      { class: 'event-list' },
      events.map((event) =>
        el(
          'li',
          {},
          el('time', { datetime: toISODate(event.date), text: formatDate(event.date) }),
          el(
            'div',
            {},
            el('strong', { text: event.title }),
            el('span', { class: 'event-list__relative', text: relativeLabel(event.date) }),
            el('p', { class: 'muted', text: event.description }),
            event.link && externalLink(event.link.url, event.link.label),
          ),
        ),
      ),
    ),
    el(
      'div',
      { class: 'button-row' },
      el(
        'button',
        {
          class: 'button',
          type: 'button',
          onclick: () => downloadText('resmi-takvim.ics', buildCalendar(events), 'text/calendar;charset=utf-8'),
        },
        'Takvimime ekle (.ics)',
      ),
      el('button', { class: 'button button--secondary', type: 'button', onclick: () => window.print() }, 'Yazdır'),
    ),
    el('p', {
      class: 'form-hint',
      text: 'İndirilen dosyayı açtığınızda tarihler hatırlatıcılarıyla birlikte Google, Apple veya Outlook takviminize eklenir.',
    }),
  );
}

// Life-event guide page: asks the guide's questions, then shows a personal,
// phased checklist with deadlines. Answers and progress persist per guide.

import { el, remount, externalLink } from '../lib/dom.js';
import { loadJSON, saveJSON } from '../lib/storage.js';
import { formatDate, relativeLabel, today } from '../lib/dates.js';
import { findGuide, isComplete } from '../data/guides/index.js';
import { renderField } from './components/form-field.js';

const storageKey = (guideId) => `guide:${guideId}`;
const HEADING_ID = 'guide-heading';
const EMPTY_STATE = { answers: {}, done: [], showChecklist: false };

function loadState(guideId) {
  return loadJSON(storageKey(guideId), EMPTY_STATE);
}

/** Bring a freshly swapped view into view and move focus to its heading. */
function focusHeading() {
  window.scrollTo(0, 0);
  document.getElementById(HEADING_ID)?.focus({ preventScroll: true });
}

export function renderGuide(guideId) {
  const guide = findGuide(guideId);
  if (!guide) {
    return [el('h1', { text: 'Rehber bulunamadı' }), el('a', { href: '#/', text: 'Ana sayfaya dön' })];
  }

  const root = el('div');
  let state = loadState(guide.id);
  // State saved right before "Baştan başla", so the reset can be undone.
  let undoState = null;

  const actions = {
    update(changes) {
      undoState = null;
      state = { ...state, ...changes };
      saveJSON(storageKey(guide.id), state);
      draw();
    },
    showChecklist(show) {
      actions.update({ showChecklist: show });
      focusHeading();
    },
    reset() {
      undoState = state;
      state = EMPTY_STATE;
      saveJSON(storageKey(guide.id), state);
      draw();
      focusHeading();
    },
    undoReset() {
      if (!undoState) return;
      state = undoState;
      undoState = null;
      saveJSON(storageKey(guide.id), state);
      draw();
      focusHeading();
    },
  };

  const draw = () => {
    const showChecklist = state.showChecklist && isComplete(guide, state.answers);
    remount(
      root,
      showChecklist ? renderChecklist(guide, state, actions) : renderQuestions(guide, state, actions, Boolean(undoState)),
    );
  };

  draw();
  return [root];
}

// ---------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------

function renderQuestions(guide, state, actions, canUndo) {
  const remaining = guide.questions.filter((q) => !state.answers[q.id]).length;
  const complete = remaining === 0;

  return [
    el('h1', { id: HEADING_ID, tabindex: -1, text: guide.title }),
    el('p', { class: 'muted', text: guide.summary }),
    canUndo &&
      el(
        'div',
        { class: 'notice notice--info', role: 'status' },
        'Liste sıfırlandı. ',
        el('button', { class: 'link-button', type: 'button', id: 'undo-reset', onclick: actions.undoReset }, 'Geri al'),
      ),
    el(
      'form',
      {
        class: 'card',
        onsubmit: (event) => {
          event.preventDefault();
          if (complete) actions.showChecklist(true);
        },
      },
      guide.questions.map((question) =>
        renderField(question, state.answers[question.id], (id, value) =>
          actions.update({ answers: { ...state.answers, [id]: value } }),
        ),
      ),
      el(
        'div',
        { class: 'button-row' },
        el(
          'button',
          {
            class: 'button',
            type: 'submit',
            id: 'build-list',
            disabled: !complete,
            'aria-describedby': complete ? null : 'build-list-hint',
          },
          'Listemi oluştur',
        ),
      ),
      !complete &&
        el('p', {
          class: 'form-hint',
          id: 'build-list-hint',
          text: `Listeyi oluşturmak için tüm soruları yanıtlayın: ${remaining} soru kaldı.`,
        }),
    ),
  ];
}

// ---------------------------------------------------------------------------
// Checklist
// ---------------------------------------------------------------------------

function renderChecklist(guide, state, actions) {
  const steps = guide.steps.filter((step) => !step.appliesTo || step.appliesTo(state.answers));
  const doneSet = new Set(state.done);
  const doneCount = steps.filter((step) => doneSet.has(step.id)).length;
  const percent = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;
  const progressText = `${steps.length} adımdan ${doneCount} tanesi tamamlandı.`;

  const toggleStep = (stepId, checked) => {
    const next = new Set(state.done);
    if (checked) next.add(stepId);
    else next.delete(stepId);
    actions.update({ done: [...next] });
  };

  return [
    el('h1', { id: HEADING_ID, tabindex: -1, text: guide.title }),
    el('p', { class: 'muted', text: progressText }),
    el(
      'div',
      {
        class: 'progress',
        role: 'progressbar',
        'aria-label': 'İlerleme',
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': percent,
        'aria-valuetext': progressText,
      },
      el('div', { class: 'progress__bar', style: `width: ${percent}%` }),
    ),
    renderNextStep(steps, doneSet, state.answers),
    el('div', {
      class: 'notice',
      text: 'Tarihler hafta sonlarını ve sabit resmî tatilleri hesaba katar; dinî bayramları katmaz. Kurumların güncel kuralları önceliklidir.',
    }),

    guide.phases.map((phase) => {
      const phaseSteps = steps.filter((step) => step.phase === phase.id);
      if (!phaseSteps.length) return null;
      const phaseDone = phaseSteps.filter((step) => doneSet.has(step.id)).length;
      return [
        el(
          'h2',
          { class: 'phase-title' },
          phase.title,
          el('span', { class: 'phase-title__count', text: `${phaseDone}/${phaseSteps.length}` }),
        ),
        phaseSteps.map((step) =>
          renderStep(step, steps.indexOf(step) + 1, state.answers, doneSet.has(step.id), toggleStep),
        ),
      ];
    }),

    el(
      'div',
      { class: 'button-row' },
      el('button', { class: 'button button--secondary', type: 'button', onclick: () => actions.showChecklist(false) }, 'Yanıtlarımı değiştir'),
      el('button', { class: 'button button--secondary', type: 'button', onclick: () => window.print() }, 'Yazdır'),
      el('button', { class: 'button button--danger', type: 'button', onclick: actions.reset }, 'Baştan başla'),
    ),
  ];
}

/** Card pointing at the nearest unfinished step that has a deadline. */
function renderNextStep(steps, doneSet, answers) {
  const next = steps
    .filter((step) => step.deadline && !doneSet.has(step.id))
    .map((step) => ({ step, deadline: step.deadline(answers) }))
    .sort((a, b) => a.deadline.date - b.deadline.date)[0];

  if (!next) return null;

  const goToStep = () => {
    const row = document.getElementById(`step-row-${next.step.id}`);
    row?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById(`step-${next.step.id}`)?.focus({ preventScroll: true });
  };

  return el(
    'div',
    { class: 'card next-step' },
    el('span', { class: 'next-step__label', text: 'Sıradaki' }),
    el('button', { class: 'next-step__title link-button', type: 'button', onclick: goToStep }, next.step.title),
    el('span', {
      class: 'next-step__date',
      text: `${formatDate(next.deadline.date)} (${relativeLabel(next.deadline.date)})`,
    }),
  );
}

function renderStep(step, number, answers, isDone, onToggle) {
  const checkboxId = `step-${step.id}`;
  const titleId = `${checkboxId}-title`;
  const deadline = step.deadline ? step.deadline(answers) : null;

  return el(
    'div',
    { class: `card step${isDone ? ' step--done' : ''}`, id: `step-row-${step.id}` },
    el('span', { class: 'step__number', text: String(number).padStart(2, '0') }),
    el('input', {
      class: 'step__check',
      type: 'checkbox',
      id: checkboxId,
      checked: isDone,
      'aria-labelledby': titleId,
      onchange: (event) => onToggle(step.id, event.target.checked),
    }),
    el(
      'div',
      {},
      el('h3', { class: 'step__title', id: titleId }, el('label', { for: checkboxId, text: step.title })),
      deadline && renderDeadline(deadline, isDone),
      el('p', { text: step.description }),
      step.documents && [
        el('strong', { text: 'Gerekli belgeler' }),
        el('ul', { class: 'step__docs' }, step.documents.map((doc) => el('li', { text: doc }))),
      ],
      step.link && renderStepLink(step.link),
    ),
    el('span', { class: 'step__stamp', 'aria-hidden': 'true', text: 'TAMAMLANDI' }),
  );
}

/** Links to this site (hash routes) stay in the tab; others open a new one. */
function renderStepLink({ url, label }) {
  return url.startsWith('#') ? el('a', { href: url, text: label }) : externalLink(url, label);
}

function renderDeadline({ date, kind }, isDone) {
  const overdue = !isDone && date < today();
  const prefix = kind === 'legal' ? 'Yasal son tarih' : 'Önerilen tarih';
  return el(
    'div',
    { class: 'step__meta' },
    el('span', {
      class: `deadline${overdue ? ' deadline--overdue' : ''}`,
      text: `${prefix}: ${formatDate(date)}${isDone ? '' : ` (${relativeLabel(date)})`}`,
    }),
  );
}

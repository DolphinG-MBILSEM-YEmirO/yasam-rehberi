// Renders a single question/field definition as a form control.
// Supported types: "choice" (radio buttons) and "date".

import { el } from '../../lib/dom.js';

/**
 * @param {Object} field  {id, type, label, hint?, options?}
 * @param {*} value       Current answer.
 * @param {(id: string, value: string) => void} onChange
 */
export function renderField(field, value, onChange) {
  const hint = field.hint ? el('span', { class: 'form-hint', id: `${field.id}-hint`, text: field.hint }) : null;

  if (field.type === 'choice') {
    return el(
      'fieldset',
      { class: 'form-field', 'aria-describedby': hint ? `${field.id}-hint` : null },
      el('legend', { text: field.label }),
      el(
        'div',
        { class: 'choice-group' },
        field.options.map((option) =>
          el(
            'label',
            { class: 'choice' },
            el('input', {
              type: 'radio',
              id: `${field.id}-${option.value}`,
              name: field.id,
              value: option.value,
              checked: value === option.value,
              onchange: () => onChange(field.id, option.value),
            }),
            option.label,
          ),
        ),
      ),
      hint,
    );
  }

  if (field.type === 'date') {
    const inputId = `field-${field.id}`;
    return el(
      'div',
      { class: 'form-field' },
      el('label', { for: inputId, text: field.label }),
      el('input', {
        type: 'date',
        id: inputId,
        value: value || '',
        'aria-describedby': hint ? `${field.id}-hint` : null,
        onchange: (event) => onChange(field.id, event.target.value),
      }),
      hint,
    );
  }

  throw new Error(`Unknown field type: ${field.type}`);
}

// Minimal iCalendar (.ics) generator for all-day events with a reminder.
// The output can be imported into Google Calendar, Apple Calendar and Outlook.

import { addDays } from './dates.js';

function formatICSDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

function formatICSTimestamp(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escapeText(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

const encoder = new TextEncoder();

// RFC 5545 limits lines to 75 octets; longer lines are folded with a space.
function foldLine(line) {
  const parts = [];
  let current = '';
  let currentBytes = 0;
  for (const char of line) {
    const charBytes = encoder.encode(char).length;
    if (currentBytes + charBytes > 73) {
      parts.push(current);
      current = ' ' + char;
      currentBytes = 1 + charBytes;
    } else {
      current += char;
      currentBytes += charBytes;
    }
  }
  parts.push(current);
  return parts.join('\r\n');
}

/**
 * Build an .ics calendar.
 * @param {Array<{id: string, date: Date, title: string, description?: string, remindDaysBefore?: number}>} events
 */
export function buildCalendar(events, calendarName = 'Resmî Takvim') {
  const stamp = formatICSTimestamp(new Date());
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Yasam Rehberi//Resmi Takvim//TR',
    'CALSCALE:GREGORIAN',
    `X-WR-CALNAME:${escapeText(calendarName)}`,
  ];

  for (const event of events) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${event.id}-${formatICSDate(event.date)}@yasam-rehberi`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${formatICSDate(event.date)}`,
      `DTEND;VALUE=DATE:${formatICSDate(addDays(event.date, 1))}`,
      `SUMMARY:${escapeText(event.title)}`,
    );
    if (event.description) {
      lines.push(`DESCRIPTION:${escapeText(event.description)}`);
    }
    if (event.remindDaysBefore) {
      lines.push(
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        `DESCRIPTION:${escapeText(event.title)}`,
        `TRIGGER:-P${event.remindDaysBefore}D`,
        'END:VALARM',
      );
    }
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.map(foldLine).join('\r\n') + '\r\n';
}

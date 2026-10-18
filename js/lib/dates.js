// Date helpers. All dates are handled as local calendar days (no time part)
// and serialized as ISO strings "YYYY-MM-DD".

// Fixed-date national holidays in Turkey (month, day). Religious holidays move
// every year and are not included; deadlines mention this to the user.
const FIXED_HOLIDAYS = [
  [1, 1],   // Yılbaşı
  [4, 23],  // Ulusal Egemenlik ve Çocuk Bayramı
  [5, 1],   // Emek ve Dayanışma Günü
  [5, 19],  // Atatürk'ü Anma, Gençlik ve Spor Bayramı
  [7, 15],  // Demokrasi ve Milli Birlik Günü
  [8, 30],  // Zafer Bayramı
  [10, 29], // Cumhuriyet Bayramı
];

export function parseISODate(value) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function today() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMonths(date, months) {
  const result = new Date(date);
  const day = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  // Clamp to the last day of the target month (e.g. 31 Jan + 1 month).
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(day, lastDay));
  return result;
}

export function addYears(date, years) {
  return addMonths(date, years * 12);
}

export function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isFixedHoliday(date) {
  return FIXED_HOLIDAYS.some(([m, d]) => date.getMonth() + 1 === m && date.getDate() === d);
}

export function isBusinessDay(date) {
  return !isWeekend(date) && !isFixedHoliday(date);
}

/** Add business days, skipping weekends and fixed national holidays. */
export function addBusinessDays(date, businessDays) {
  let result = new Date(date);
  let remaining = businessDays;
  while (remaining > 0) {
    result = addDays(result, 1);
    if (isBusinessDay(result)) remaining -= 1;
  }
  return result;
}

/** If a deadline falls on a non-business day, move it to the next business day. */
export function nextBusinessDayIfClosed(date) {
  let result = new Date(date);
  while (!isBusinessDay(result)) result = addDays(result, 1);
  return result;
}

export function lastDayOfMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0);
}

export function daysBetween(from, to) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.round((to - from) / MS_PER_DAY);
}

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatDate(date) {
  return dateFormatter.format(date);
}

/** Human-friendly relative label, e.g. "12 gün kaldı" or "3 gün geçti". */
export function relativeLabel(date, reference = today()) {
  const diff = daysBetween(reference, date);
  if (diff === 0) return 'bugün';
  if (diff > 0) return `${diff} gün kaldı`;
  return `${Math.abs(diff)} gün geçti`;
}

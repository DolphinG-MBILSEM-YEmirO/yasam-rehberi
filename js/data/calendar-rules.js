// Rules for the personal official calendar. Each rule turns the user's
// answers into dated events. Rules only produce events inside the window
// [from, until] so the list stays focused on what is coming up.

import {
  addMonths,
  addYears,
  lastDayOfMonth,
  nextBusinessDayIfClosed,
  parseISODate,
} from '../lib/dates.js';

const EDEVLET = 'https://www.turkiye.gov.tr';

export const calendarFields = [
  {
    group: 'Araç',
    fields: [
      { id: 'hasCar', type: 'choice', label: 'Aracınız var mı?', options: [{ value: 'yes', label: 'Evet' }, { value: 'no', label: 'Hayır' }] },
      { id: 'carRegistrationDate', type: 'date', label: 'Aracın ilk tescil tarihi', hint: 'Ruhsatta yazar.', showIf: (a) => a.hasCar === 'yes' },
      { id: 'lastInspectionDate', type: 'date', label: 'Son muayene tarihi', hint: 'Araç hiç muayene olmadıysa boş bırakın.', showIf: (a) => a.hasCar === 'yes' },
      { id: 'trafficInsuranceEnd', type: 'date', label: 'Trafik sigortası bitiş tarihi', showIf: (a) => a.hasCar === 'yes' },
      { id: 'kaskoEnd', type: 'date', label: 'Kasko bitiş tarihi', hint: 'Kasko yoksa boş bırakın.', showIf: (a) => a.hasCar === 'yes' },
    ],
  },
  {
    group: 'Konut',
    fields: [
      { id: 'isHomeowner', type: 'choice', label: 'Konut sahibi misiniz?', options: [{ value: 'yes', label: 'Evet' }, { value: 'no', label: 'Hayır' }] },
      { id: 'daskEnd', type: 'date', label: 'DASK poliçesi bitiş tarihi', showIf: (a) => a.isHomeowner === 'yes' },
    ],
  },
  {
    group: 'Kimlik ve belgeler',
    fields: [
      { id: 'passportExpiry', type: 'date', label: 'Pasaport geçerlilik bitişi', hint: 'Pasaportunuz yoksa boş bırakın.' },
      { id: 'licenseExpiry', type: 'date', label: 'Sürücü belgesi geçerlilik bitişi' },
      { id: 'idCardExpiry', type: 'date', label: 'Kimlik kartı geçerlilik bitişi' },
    ],
  },
];

/** Roll a yearly date forward until it is on or after `from`. */
function nextYearlyOccurrence(date, from) {
  let result = new Date(date);
  while (result < from) result = addYears(result, 1);
  return result;
}

function inWindow(date, from, until) {
  return date >= from && date <= until;
}

/** Month-end deadlines that repeat every year (e.g. taxes paid in two installments). */
function yearlyMonthEndEvents({ id, months, title, description, link, from, until }) {
  const events = [];
  for (let year = from.getFullYear(); year <= until.getFullYear(); year += 1) {
    months.forEach((monthIndex, i) => {
      const date = nextBusinessDayIfClosed(lastDayOfMonth(year, monthIndex));
      if (inWindow(date, from, until)) {
        events.push({
          id: `${id}-${i + 1}`,
          date,
          title: `${title} (${i + 1}. taksit)`,
          description,
          link,
          remindDaysBefore: 10,
        });
      }
    });
  }
  return events;
}

function vehicleInspectionEvents(a, from, until) {
  const registration = parseISODate(a.carRegistrationDate);
  const lastInspection = parseISODate(a.lastInspectionDate);
  if (!registration && !lastInspection) return [];

  // Private cars: first inspection when the car turns 3, then every 2 years.
  let next = lastInspection ? addYears(lastInspection, 2) : addYears(registration, 3);
  while (next < from) next = addYears(next, 2);

  const events = [];
  while (next <= until) {
    events.push({
      id: 'vehicle-inspection',
      date: next,
      title: 'Araç muayenesi son günü',
      description: 'Hususi otomobiller ilk 3 yıldan sonra 2 yılda bir muayene olur. Randevuyu birkaç hafta önceden alın.',
      link: { label: 'e-Devlet: TÜVTÜRK Muayene Randevu', url: `${EDEVLET}/muayene-randevu-kayit` },
      remindDaysBefore: 30,
    });
    next = addYears(next, 2);
  }
  return events;
}

function yearlyRenewal({ id, dateValue, title, description, from, until, remindDaysBefore = 15 }) {
  const date = parseISODate(dateValue);
  if (!date) return [];
  const next = nextYearlyOccurrence(date, from);
  return inWindow(next, from, until) ? [{ id, date: next, title, description, remindDaysBefore }] : [];
}

function expiryEvents({ id, dateValue, title, description, warnMonthsBefore, from, until, link }) {
  const expiry = parseISODate(dateValue);
  if (!expiry) return [];
  const events = [];

  if (warnMonthsBefore) {
    const warnDate = addMonths(expiry, -warnMonthsBefore);
    if (inWindow(warnDate, from, until)) {
      events.push({
        id: `${id}-renew`,
        date: warnDate,
        title: `${title}: yenileme zamanı`,
        description,
        link,
        remindDaysBefore: 7,
      });
    }
  }
  if (inWindow(expiry, from, until)) {
    events.push({ id: `${id}-expiry`, date: expiry, title: `${title} geçerliliği bitiyor`, description, link, remindDaysBefore: 30 });
  }
  return events;
}

/**
 * Build the sorted list of calendar events for the given answers.
 * @param {Object} a Answers keyed by field id.
 * @param {Date} from Start of the window (usually today).
 * @param {Date} until End of the window.
 */
export function buildCalendarEvents(a, from, until) {
  const events = [];

  if (a.hasCar === 'yes') {
    events.push(
      ...yearlyMonthEndEvents({
        id: 'mtv',
        months: [0, 6], // January and July
        title: 'Motorlu Taşıtlar Vergisi',
        description: 'MTV yılda iki taksitte, Ocak ve Temmuz ayları sonuna kadar ödenir. Son gün hafta sonuna denk gelirse sonraki iş gününe kayar.',
        link: { label: 'e-Devlet: Araçlarım', url: `${EDEVLET}/araclarim` },
        from,
        until,
      }),
      ...vehicleInspectionEvents(a, from, until),
      ...yearlyRenewal({
        id: 'traffic-insurance',
        dateValue: a.trafficInsuranceEnd,
        title: 'Trafik sigortası yenileme',
        description: 'Zorunlu trafik sigortası olmadan araç trafiğe çıkamaz. Teklifleri bitişten önce karşılaştırın.',
        from,
        until,
      }),
      ...yearlyRenewal({
        id: 'kasko',
        dateValue: a.kaskoEnd,
        title: 'Kasko yenileme',
        description: 'Kasko isteğe bağlıdır; yenilemeden önce teklifleri karşılaştırın.',
        from,
        until,
      }),
    );
  }

  if (a.isHomeowner === 'yes') {
    events.push(
      ...yearlyMonthEndEvents({
        id: 'property-tax',
        months: [4, 10], // May and November
        title: 'Emlak vergisi',
        description: 'Emlak vergisi yılda iki taksitte, Mayıs ve Kasım ayları sonuna kadar belediyeye ödenir.',
        from,
        until,
      }),
      ...yearlyRenewal({
        id: 'dask',
        dateValue: a.daskEnd,
        title: 'DASK yenileme',
        description: 'Zorunlu deprem sigortası yıllıktır; süresi biten poliçe abonelik ve tapu işlemlerinde sorun çıkarır.',
        from,
        until,
      }),
    );
  }

  events.push(
    ...expiryEvents({
      id: 'passport',
      dateValue: a.passportExpiry,
      title: 'Pasaport',
      description: 'Birçok ülke, girişte pasaportun en az 6 ay daha geçerli olmasını ister. Randevuyu erken alın.',
      warnMonthsBefore: 6,
      from,
      until,
    }),
    ...expiryEvents({
      id: 'license',
      dateValue: a.licenseExpiry,
      title: 'Sürücü belgesi',
      description: 'Yenileme için nüfus müdürlüğünden randevu alınır.',
      warnMonthsBefore: 1,
      from,
      until,
    }),
    ...expiryEvents({
      id: 'id-card',
      dateValue: a.idCardExpiry,
      title: 'Kimlik kartı',
      description: 'Yenileme için nüfus müdürlüğünden randevu alınır.',
      warnMonthsBefore: 1,
      from,
      until,
    }),
  );

  return events.sort((x, y) => x.date - y.date);
}

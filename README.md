# Yaşam Rehberi

A static website that turns life events (starting with moving house) into a personal, ordered checklist of official tasks in Turkey, plus a personal official calendar with `.ics` export.

## Run locally

No build step. Serve the folder with any static server (ES modules need `http://`, not `file://`):

```bash
cd website
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

```
index.html                     Page shell (header, nav, footer)
css/styles.css                 Design tokens, components, print styles
js/main.js                     Hash router (#/, #/rehber/<id>, #/takvim)
js/lib/                        Framework-free helpers
  dom.js                       el(), mount(), downloadText()
  dates.js                     Date math, business days, Turkish formatting
  storage.js                   Guarded localStorage with in-memory fallback
  ics.js                       iCalendar (.ics) generator
js/data/
  guides/index.js              Guide registry + upcoming guides
  guides/moving.js             "Taşınma" questions, phases and steps
  guides/new-baby.js           "Bebek doğumu" questions, phases and steps
  guides/buying-car.js         "Araç satın alma" questions, phases and steps
  guides/marriage.js           "Evlilik" questions, phases and steps
  guides/leaving-job.js        "İşten ayrılma" questions, phases and steps
  guides/retirement.js         "Emeklilik" questions, phases and steps
  guides/bereavement.js        "Vefat sonrası işlemler" questions, phases and steps
  calendar-rules.js            Official calendar fields and date rules
js/views/
  home.js, guide.js, calendar.js
  components/form-field.js     Shared question renderer (choice, date)
  components/icons.js          Inline Lucide SVG icons for cards and buttons
```

## Design

Based on the user's Bolt template (warm paper palette, green accent, Fraunces headings, Inter body, rounded cards with soft shadows), rebuilt in plain CSS so the site keeps working without a build step. Card icons and accent colors per guide live in `js/views/home.js` (`GUIDE_VISUALS`).

## Adding a new life-event guide

1. Create `js/data/guides/<name>.js` exporting an object with `id`, `title`, `summary`, `questions`, `phases`, `steps` (same shape as `moving.js`).
2. Import it in `js/data/guides/index.js` and add it to `guides` (remove it from `upcomingGuides`).
3. Give it an icon and accent in `GUIDE_VISUALS` in `js/views/home.js`.

Steps support optional `appliesTo(answers)`, `deadline(answers) -> { date, kind: 'legal' | 'suggested' }`, `documents` and `link`.

## Content sources (checked 2026-10-18)

- Address change within 20 business days (Law 5490), e-Devlet flows: [Milli Gazete](https://www.milligazete.com.tr/e-devletten-ikametgah-degistirme-nasil-yapilir-bos-eve-adres-nasil-alinir-muvafakat-gerekir-mi-sure-kac-gun)
- After buying a home (tapu harcı, emlak vergisi bildirimi by year end, DASK, subscriptions): [HesapKurdu](https://www.hesapkurdu.com/konut-kredisi/rehber/ev-aldiktan-sonra)
- Car inspection: first at 3 years, then every 2 years: [arabam.com](https://www.arabam.com/blog/danisman/arac-muayene-tarihi-nasil-sorgulanir/)
- Birth notification within 30 days, e-Devlet application: [NTV](https://www.ntv.com.tr/turkiye/dogum-bildirimi-e-devlet-uzerinden-yapilabilecek,QK1G-I_SnU6WBZfuIXDJFA)
- Maternity leave 24 weeks (8 + 16) and 10-day paternity leave, April 2026 law: [GZT](https://www.gzt.com/gundem/resmi-gazete-dogum-izni-son-dakika-babalik-izni-resmi-gazetede-yayinlandi-mi-2026-dogum-izni-ne-zaman-yasalasacak-4218938) (confirm against Resmî Gazete)
- Vehicle sale: buyer's traffic insurance before notary transfer, no 15-day grace since 5 Dec 2024: [Allianz](https://www.allianz.com.tr/tr_TR/seninle-guzel/ikinci-el-arac-alirken-trafik-sigortasi-ne-zaman-nasil-yapilir.html); notary fee 0.2% (min 1,000 TL) in 2026: [Allianz](https://www.allianz.com.tr/tr_TR/seninle-guzel/arac-alim-satimi-noter-islemleri-rehberi.html); mandatory secure payment system: [HesapKurdu](https://www.hesapkurdu.com/tasit-kredisi/rehber/arac-satisinda-guvenli-odeme-sistemi-nasil-kullanilir)
- Interest-free marriage loan (apply 2–6 months before nikâh, 250k/200k TL, under 30), Aug 2026: [GZT](https://www.gzt.com/ekonomi/250-bin-tl-faizsiz-evlilik-kredisi-nasil-alinir-iste-basvuru-sartlari-4252344)
- Married woman's surname after the Constitutional Court annulled TMK 187: [Tahancı Hukuk](https://www.tahanci.av.tr/kadinin-soyadi-evlilikle-degismeyecek-tmk-m-187/) (practice still settling)
- Unemployment benefit (600 days in 3 years, last 120 days, apply within 30 days, 180/240/300 days, 40% capped at 80% of gross minimum wage): [İş Bankası](https://www.isbank.com.tr/blog/issizlik-maasi-nasil-alinir)
- Retirement: pension starts the month after the written application, 4A workers must leave the job first: [Cottgroup](https://cottgroup.com/tr/mevzuat/item/emekli-olmak-icin-isten-ayrilma-ve-yazili-talep-sartlari); last-7-years rule for merged service: [Memurlar.net](https://www.memurlar.net/haber/1178184/); application and status tracking: [Kariyer.net](https://www.kariyer.net/ik-blog/?p=14488)
- After a death (heirship certificate, 3-month inheritance rejection, 4-month inheritance tax return): [Or Hukuk](https://or.av.tr/olumden-sonra-yapilmasi-gereken-resmi-islemler-2025-guncel-rehber/); 2026 inheritance tax exemption (2,907,136 TL per child or spouse): [Hukukçular Evi](https://hukukcularevi.com/veraset-ve-intikal-vergisi-beyan-ve-odeme/)
- e-Devlet service URLs taken from turkiye.gov.tr search results.

Known limitation: business-day math skips weekends and fixed national holidays but not religious holidays.

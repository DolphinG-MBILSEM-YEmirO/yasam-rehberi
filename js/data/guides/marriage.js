// Life-event guide: getting married (evlilik).
//
// Same shape as moving.js; see that file for the step fields.
// Sources were checked on 2026-10-18; see README.md for the list.

import { addDays, addMonths, addYears, parseISODate } from '../../lib/dates.js';

const EDEVLET = 'https://www.turkiye.gov.tr';

const weddingDateOf = (a) => parseISODate(a.weddingDate);
const isEmployed = (a) => a.employed === 'yes';
const surnameChanges = (a) => a.surnameChange === 'yes';

export const marriageGuide = {
  id: 'evlilik',
  title: 'Evlilik rehberi',
  summary: 'Nikâh başvurusu, sağlık raporu, faizsiz evlilik kredisi, soyadı ve belge güncellemeleri.',

  questions: [
    {
      id: 'weddingDate',
      type: 'date',
      label: 'Nikâh tarihi',
      hint: 'Henüz kesin değilse hedeflediğiniz tarihi seçin.',
    },
    {
      id: 'under30',
      type: 'choice',
      label: 'İkiniz de 30 yaşından küçük müsünüz?',
      hint: 'Faizsiz evlilik kredisi için gerekir.',
      options: [
        { value: 'yes', label: 'Evet' },
        { value: 'no', label: 'Hayır' },
      ],
    },
    {
      id: 'employed',
      type: 'choice',
      label: 'Sigortalı çalışan biriniz var mı?',
      options: [
        { value: 'yes', label: 'Evet' },
        { value: 'no', label: 'Hayır' },
      ],
    },
    {
      id: 'surnameChange',
      type: 'choice',
      label: 'Birinizin soyadı değişecek mi?',
      options: [
        { value: 'yes', label: 'Evet' },
        { value: 'no', label: 'Hayır, ikimiz de kendi soyadımızı koruyacağız' },
      ],
    },
  ],

  phases: [
    { id: 'before', title: 'Nikâhtan önce' },
    { id: 'wedding-day', title: 'Nikâh günü' },
    { id: 'after', title: 'Nikâhtan sonra' },
  ],

  steps: [
    // ----- Before the wedding --------------------------------------------------
    {
      id: 'marriage-loan',
      phase: 'before',
      title: 'Faizsiz evlilik kredisine başvurun',
      description:
        'Aile ve Gençlik Fonu, nikâhtan 2 ile 6 ay önce başvuran çiftlere 48 ay vadeli, ilk 24 ayı ödemesiz faizsiz kredi verir. Ağustos 2026 itibarıyla tutar, ikiniz de 18–25 yaşındaysanız 250.000 TL, biriniz 26–29 yaşındaysa 200.000 TL\'dir. Gelir sınırı ve evlilik öncesi eğitim şartı vardır.',
      appliesTo: (a) => a.under30 === 'yes',
      deadline: (a) => ({ date: addMonths(weddingDateOf(a), -2), kind: 'legal' }),
    },
    {
      id: 'wedding-application',
      phase: 'before',
      title: 'Belediyeye nikâh başvurusu yapın ve tarih alın',
      description:
        'Başvuru, çiftlerden birinin yaşadığı yerdeki belediyenin evlendirme memurluğuna yapılır. Popüler tarihler aylar önceden dolabildiği için erken başvurun. Bazı belediyeler online ön başvuru da kabul eder.',
      documents: ['İkinizin kimlik kartları', 'Vesikalık fotoğraflar (sayısını belediyenize sorun)', 'Evlenme sağlık raporu'],
      deadline: (a) => ({ date: addMonths(weddingDateOf(a), -2), kind: 'suggested' }),
    },
    {
      id: 'health-report',
      phase: 'before',
      title: 'Evlenme sağlık raporu alın',
      description:
        'Rapor aile hekiminizden ya da devlet hastanesinden alınır. Bazı tahliller istenebileceği için başvurudan birkaç hafta önce randevu alın.',
      link: { label: 'e-Devlet: Aile Hekim Bilgisi Sorgulama', url: `${EDEVLET}/aile-hekim-bilgisi` },
      deadline: (a) => ({ date: addDays(addMonths(weddingDateOf(a), -2), -14), kind: 'suggested' }),
    },
    {
      id: 'surname-choice',
      phase: 'before',
      title: 'Soyadı tercihinizi başvuruda belirtin',
      description:
        'Anayasa Mahkemesi, kadının evlenince kocasının soyadını almak zorunda olduğu kuralı iptal etti. Kendi soyadını korumak, eşinin soyadını almak ya da ikisini birlikte kullanmak isteyenler tercihini nikâh başvurusunda yazılı olarak bildirmeli. Uygulama yeni olduğu için seçenekleri evlendirme memurluğundan teyit edin.',
    },
    {
      id: 'marriage-leave',
      phase: 'before',
      title: 'Evlilik iznini işverene bildirin',
      description:
        'İşçiler evlendiklerinde 3 gün ücretli izin hakkına sahiptir; kamu çalışanlarının süresi farklıdır. İzni yıllık izninizle birleştirmek istiyorsanız önceden konuşun.',
      appliesTo: isEmployed,
      deadline: (a) => ({ date: addDays(weddingDateOf(a), -14), kind: 'suggested' }),
    },

    // ----- Wedding day -----------------------------------------------------------
    {
      id: 'witnesses',
      phase: 'wedding-day',
      title: 'Şahitlerinizi kimlikleriyle getirin',
      description:
        'Nikâhta reşit iki şahit bulunmalıdır ve kimliklerini yanlarında getirmelidir. Nikâhtan sonra aile cüzdanınız size verilir.',
      documents: ['İkinizin ve şahitlerin kimlik kartları'],
      deadline: (a) => ({ date: weddingDateOf(a), kind: 'suggested' }),
    },

    // ----- After the wedding -----------------------------------------------------
    {
      id: 'new-id-card',
      phase: 'after',
      title: 'Soyadı değiştiyse kimlik kartını yenileyin',
      description:
        'Nüfus kaydı nikâhla birlikte güncellenir, ancak kimlik kartınızdaki soyadı eski kalır. Nüfus müdürlüğünden randevu alıp kartınızı yenileyin; ardından pasaport ve sürücü belgesini de güncelleyin.',
      link: { label: 'e-Devlet: nüfus müdürlüğü randevusu', url: `${EDEVLET}/arama?aranan=kimlik+kart%C4%B1+randevu` },
      appliesTo: surnameChanges,
      deadline: (a) => ({ date: addDays(weddingDateOf(a), 30), kind: 'suggested' }),
    },
    {
      id: 'update-records',
      phase: 'after',
      title: 'Banka ve işyeri kayıtlarını güncelleyin',
      description:
        'Kamu kurumları yeni soyadınızı nüfus kaydından görür, ama bankalar, işvereniniz, sigorta şirketleri ve aboneliklerin çoğu sizin bildirmenizi bekler.',
      appliesTo: surnameChanges,
    },
    {
      id: 'move-in',
      phase: 'after',
      title: 'Yeni eve taşınıyorsanız taşınma rehberini açın',
      description:
        'Adres bildirimi, abonelikler ve son tarihler için taşınma rehberi size ayrı bir liste çıkarır.',
      link: { label: 'Taşınma rehberini aç', url: '#/rehber/tasinma' },
    },
    {
      id: 'dowry-account',
      phase: 'after',
      title: 'Çeyiz hesabınız varsa devlet katkısına başvurun',
      description:
        'Devlet destekli çeyiz hesabında birikim yaptıysanız, evlendikten sonra devlet katkısı için hesabın bulunduğu bankaya başvurun. Şartları bankanızdan öğrenin.',
    },
    {
      id: 'severance-right',
      phase: 'after',
      title: 'Evlilik sonrası kıdem tazminatı hakkını bilin',
      description:
        'Kadın çalışanlar, evlendikleri tarihten itibaren 1 yıl içinde kendi istekleriyle işten ayrılırlarsa kıdem tazminatı alabilir. Bu bir zorunluluk değil, ihtiyaç halinde kullanılacak bir haktır.',
      appliesTo: isEmployed,
      deadline: (a) => ({ date: addYears(weddingDateOf(a), 1), kind: 'legal' }),
    },
  ],
};

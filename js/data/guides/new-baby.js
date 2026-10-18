// Life-event guide: having a baby (bebek doğumu).
//
// Same shape as moving.js; see that file for the step fields.
// Sources were checked on 2026-10-18; see README.md for the list.

import { addDays, parseISODate } from '../../lib/dates.js';

const EDEVLET = 'https://www.turkiye.gov.tr';

const birthDateOf = (a) => parseISODate(a.birthDate);
const motherEmployed = (a) => a.motherEmployed === 'yes';
const fatherEmployed = (a) => a.fatherEmployed === 'yes';

export const newBabyGuide = {
  id: 'bebek-dogumu',
  title: 'Bebek doğumu rehberi',
  summary: 'Doğum izni, nüfus kaydı, doğum yardımı, sağlık güvencesi ve ilk ayın resmî işleri.',

  questions: [
    {
      id: 'birthDate',
      type: 'date',
      label: 'Doğum tarihi',
      hint: 'Bebek henüz doğmadıysa beklenen tarihi seçin. Son tarihler bu güne göre hesaplanır.',
    },
    {
      id: 'motherEmployed',
      type: 'choice',
      label: 'Anne sigortalı olarak çalışıyor mu?',
      options: [
        { value: 'yes', label: 'Evet' },
        { value: 'no', label: 'Hayır' },
      ],
    },
    {
      id: 'fatherEmployed',
      type: 'choice',
      label: 'Baba sigortalı olarak çalışıyor mu?',
      options: [
        { value: 'yes', label: 'Evet' },
        { value: 'no', label: 'Hayır' },
      ],
    },
  ],

  phases: [
    { id: 'before', title: 'Doğumdan önce' },
    { id: 'first-month', title: 'İlk ay' },
    { id: 'first-year', title: 'İlk yıl' },
  ],

  steps: [
    // ----- Before birth -------------------------------------------------------
    {
      id: 'maternity-leave',
      phase: 'before',
      title: 'Doğum izninizi planlayın',
      description:
        'Nisan 2026 düzenlemesiyle doğum izni toplam 24 haftadır: doğumdan önce 8, sonra 16 hafta. Doktor onayıyla doğumdan önceki 2 haftaya kadar çalışabilir, kullanmadığınız süreyi doğum sonrasına ekleyebilirsiniz. Tarihleri işvereninizle önceden konuşun.',
      documents: ['Doktor raporu (doğumdan önce çalışmaya devam edecekseniz)'],
      appliesTo: motherEmployed,
      deadline: (a) => ({ date: addDays(birthDateOf(a), -8 * 7), kind: 'suggested' }),
    },
    {
      id: 'paternity-leave',
      phase: 'before',
      title: 'Babalık iznini işverene bildirin',
      description:
        'Nisan 2026 düzenlemesiyle babalık izni özel sektörde de 10 gündür. Doğum tarihine yakın bir zamanda işvereninize yazılı olarak haber verin.',
      appliesTo: fatherEmployed,
      deadline: (a) => ({ date: addDays(birthDateOf(a), -14), kind: 'suggested' }),
    },
    {
      id: 'hospital-documents',
      phase: 'before',
      title: 'Hastane çantasına belgeleri koyun',
      description:
        'Doğum bildirimi çoğu hastanede doğumdan hemen sonra yapılabildiği için gerekli belgeleri yanınızda bulundurun.',
      documents: ['Anne ve babanın kimlik kartları', 'Bebeğe verilecek ad (önceden kararlaştırın)'],
    },

    // ----- First month ----------------------------------------------------------
    {
      id: 'birth-registration',
      phase: 'first-month',
      title: 'Doğumu nüfusa bildirin',
      description:
        'Doğum, 30 gün içinde bildirilmelidir. Birçok devlet hastanesi kaydı doğumhanede yapar. Yapılmadıysa doğum raporu sisteme düştükten sonra anne ya da baba e-Devlet\'ten başvurabilir. Bu başvuruda bebeğin kimlik kartının gönderileceği adres de seçilir.',
      link: { label: 'e-Devlet: Doğum Bildirimi Başvurusu', url: `${EDEVLET}/nvi-dogum-bildirimi-basvurusu` },
      deadline: (a) => ({ date: addDays(birthDateOf(a), 30), kind: 'legal' }),
    },
    {
      id: 'family-doctor',
      phase: 'first-month',
      title: 'Bebeği aile hekimine kaydettirin',
      description:
        'Nüfus kaydından sonra bebek genellikle annenin aile hekimine bağlanır. Aile hekimi ilk izlemleri ve aşı takvimini yürütür. Topuk kanı ve işitme taramalarının yapıldığını da sorun.',
      link: { label: 'e-Devlet: Aile Hekim Bilgisi Sorgulama', url: `${EDEVLET}/aile-hekim-bilgisi` },
      deadline: (a) => ({ date: addDays(birthDateOf(a), 7), kind: 'suggested' }),
    },
    {
      id: 'health-coverage',
      phase: 'first-month',
      title: 'Bebeğin sağlık güvencesini kontrol edin',
      description:
        'Bebek, sigortalı anne ya da babanın üzerinden sağlık hizmeti alır. Nüfus kaydı tamamlandıktan sonra e-Devlet\'te bebeğin bakmakla yükümlü olunan kişi olarak göründüğünü kontrol edin.',
      link: { label: 'e-Devlet: sağlık güvencesi hizmetleri', url: `${EDEVLET}/arama?aranan=bakmakla+y%C3%BCk%C3%BCml%C3%BC` },
    },
    {
      id: 'birth-allowance',
      phase: 'first-month',
      title: 'Doğum yardımına başvurun',
      description:
        'Devletin tek seferlik doğum yardımı, sigortalı olup olmamanızdan bağımsızdır. Başvuru e-Devlet üzerinden anne tarafından yapılır.',
      link: { label: 'e-Devlet: Doğum Yardımı Başvuru', url: `${EDEVLET}/ashb-dogum-yardimi-8663` },
      deadline: (a) => ({ date: addDays(birthDateOf(a), 30), kind: 'suggested' }),
    },
    {
      id: 'nursing-allowance',
      phase: 'first-month',
      title: 'SGK emzirme ödeneğine başvurun',
      description:
        'Sigortalı anneye ya da sigortalı babanın sigortasız eşine tek seferlik emzirme ödeneği verilir. Bebeğin canlı doğması ve nüfusa kaydedilmesi gerekir.',
      link: { label: 'e-Devlet: emzirme ödeneği', url: `${EDEVLET}/arama?aranan=emzirme+%C3%B6dene%C4%9Fi` },
      appliesTo: (a) => motherEmployed(a) || fatherEmployed(a),
    },

    // ----- First year -----------------------------------------------------------
    {
      id: 'vaccinations',
      phase: 'first-year',
      title: 'Aşı takvimini telefonunuza kaydedin',
      description:
        'Aşılar aile hekiminde ücretsiz yapılır. Takvimi aile hekiminden alın ve hatırlatma kurun; kaçırılan aşılar için yeniden randevu gerekir.',
    },
    {
      id: 'birth-credit',
      phase: 'first-year',
      title: 'Doğum borçlanmasını değerlendirin',
      description:
        'Sigortalı kadınlar, doğumdan sonra çalışmadıkları süreleri her çocuk için en fazla 2 yıl borçlanarak emeklilik hizmetine ekletebilir. Hemen yapmak zorunda değilsiniz, ancak bilmeniz iyi olur.',
      link: { label: 'e-Devlet: 4A Doğum Borçlanması Başvurusu', url: `${EDEVLET}/sosyal-guvenlik-4a-dogum-borclanmasi-basvurusu` },
      appliesTo: motherEmployed,
    },
    {
      id: 'return-to-work',
      phase: 'first-year',
      title: 'İşe dönüş tarihinizi netleştirin',
      description:
        'Doğum izni bitmeden işvereninizle dönüş tarihini, süt izni saatlerini ve varsa ücretsiz izin ya da yarı zamanlı çalışma seçeneklerini konuşun.',
      appliesTo: motherEmployed,
      deadline: (a) => ({ date: addDays(birthDateOf(a), 16 * 7 - 14), kind: 'suggested' }),
    },
  ],
};

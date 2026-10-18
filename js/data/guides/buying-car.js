// Life-event guide: buying a car (araç satın alma).
//
// Same shape as moving.js; see that file for the step fields.
// Sources were checked on 2026-10-18; see README.md for the list.

import { addDays, parseISODate } from '../../lib/dates.js';

const EDEVLET = 'https://www.turkiye.gov.tr';

const saleDateOf = (a) => parseISODate(a.saleDate);
const isUsed = (a) => a.condition === 'used';
const isNew = (a) => a.condition === 'new';

export const buyingCarGuide = {
  id: 'arac-satin-alma',
  title: 'Araç satın alma rehberi',
  summary: 'Hasar ve borç sorgusu, güvenli ödeme, trafik sigortası, noter devri ve sonrasında takip edilecek tarihler.',

  questions: [
    {
      id: 'saleDate',
      type: 'date',
      label: 'Noterde satış için planladığınız tarih',
      hint: 'Kesin değilse tahmini bir gün seçin.',
    },
    {
      id: 'condition',
      type: 'choice',
      label: 'Araç sıfır mı, ikinci el mi?',
      options: [
        { value: 'new', label: 'Sıfır' },
        { value: 'used', label: 'İkinci el' },
      ],
    },
    {
      id: 'seller',
      type: 'choice',
      label: 'Kimden alıyorsunuz?',
      options: [
        { value: 'dealer', label: 'Bayi veya galeri' },
        { value: 'individual', label: 'Bireysel satıcı' },
      ],
    },
    {
      id: 'loan',
      type: 'choice',
      label: 'Taşıt kredisi kullanacak mısınız?',
      options: [
        { value: 'yes', label: 'Evet' },
        { value: 'no', label: 'Hayır' },
      ],
    },
  ],

  phases: [
    { id: 'before', title: 'Satıştan önce' },
    { id: 'sale-day', title: 'Satış günü' },
    { id: 'after', title: 'Satıştan sonra' },
  ],

  steps: [
    // ----- Before the sale ------------------------------------------------------
    {
      id: 'vehicle-history',
      phase: 'before',
      title: 'Hasar kaydını ve kilometre geçmişini sorgulayın',
      description:
        'Plaka ya da şasi numarasıyla geçmiş hasar kayıtlarını, değişen parçaları ve muayenede kaydedilen kilometreleri kontrol edin. Kilometre geçmişi tutarsızsa satıcıya sorun.',
      link: { label: 'e-Devlet: araç sorgulama hizmetleri', url: `${EDEVLET}/arama?aranan=ara%C3%A7+hasar` },
      appliesTo: isUsed,
      deadline: (a) => ({ date: addDays(saleDateOf(a), -7), kind: 'suggested' }),
    },
    {
      id: 'expertise',
      phase: 'before',
      title: 'Ekspertiz raporu alın',
      description:
        'Galeriden alınan ikinci el araçlarda ekspertiz raporu verilmesi zorunludur. Bireysel satıcıdan alıyorsanız da bağımsız bir ekspertize götürmeniz, gizli kusurlara karşı en güçlü korumadır.',
      appliesTo: isUsed,
      deadline: (a) => ({ date: addDays(saleDateOf(a), -3), kind: 'suggested' }),
    },
    {
      id: 'debts',
      phase: 'before',
      title: 'MTV borcunu, trafik cezalarını ve rehin kaydını kontrol edin',
      description:
        'Satıcının araçla ilgili vergi ve ceza borcu olmamalı. Araçta rehin ya da haciz kaydı varsa satış yapılamaz veya sorun çıkar; bunu noterde değil, önceden öğrenin.',
      link: { label: 'e-Devlet: MTV borç sorgulama', url: `${EDEVLET}/arama?aranan=motorlu+ta%C5%9F%C4%B1tlar+vergisi` },
      appliesTo: isUsed,
      deadline: (a) => ({ date: addDays(saleDateOf(a), -3), kind: 'suggested' }),
    },
    {
      id: 'inspection-status',
      phase: 'before',
      title: 'Muayene süresini kontrol edin',
      description:
        'Muayenesi geçmiş ya da yakında dolacak bir araç için masrafı pazarlıkta hesaba katın.',
      link: { label: 'e-Devlet: TÜVTÜRK Muayene Durum Sorgulama', url: `${EDEVLET}/muayene-durum-sorgulama` },
      appliesTo: isUsed,
    },
    {
      id: 'car-loan',
      phase: 'before',
      title: 'Kredi onayını satıştan önce alın',
      description:
        'Kredi kullanılan araçlarda banka genellikle kasko ister ve araç üzerine rehin koyar. Kredi kullandırımı noter günüyle aynı güne denk gelecek şekilde bankayla planlayın.',
      appliesTo: (a) => a.loan === 'yes',
      deadline: (a) => ({ date: addDays(saleDateOf(a), -7), kind: 'suggested' }),
    },
    {
      id: 'traffic-insurance',
      phase: 'before',
      title: 'Trafik sigortasını kendi adınıza yaptırın',
      description:
        'Alıcı, noter devrinden önce aracı kendi adına sigortalatmak zorundadır; 5 Aralık 2024\'ten beri 15 günlük geçiş süresi yoktur. Satıcının poliçesi size geçmez. Satış gerçekleşmezse poliçe baştan iptal edilip prim iade edilir.',
      documents: ['Kimlik kartı', 'Aracın plakası ve ruhsat bilgileri'],
      deadline: (a) => ({ date: saleDateOf(a), kind: 'legal' }),
    },
    {
      id: 'secure-payment',
      phase: 'before',
      title: 'Ödemeyi güvenli ödeme sistemiyle yapın',
      description:
        'İkinci el araç alım satımında güvenli ödeme sistemi zorunludur. Satıcı, bankasında işlemi başlatır; siz referans numarasıyla ödersiniz. Para, noter devri tamamlanınca satıcıya geçer; satış olmazsa size iade edilir. Hizmet ücretini kimin ödeyeceğini önceden konuşun.',
      appliesTo: isUsed,
      deadline: (a) => ({ date: saleDateOf(a), kind: 'suggested' }),
    },

    // ----- Sale day ---------------------------------------------------------------
    {
      id: 'notary-sale',
      phase: 'sale-day',
      title: 'Noterde satışı tamamlayın',
      description:
        'Alıcı ve satıcı noterde birlikte bulunur ya da vekâletname ile temsil edilir. 2026 için noter harcı satış bedelinin binde 2\'sidir ve 1.000 TL\'den az olamaz; buna devir ücreti ve ruhsat bedeli eklenir. Plaka değişikliği isteğe bağlıdır.',
      documents: ['Kimlik kartı', 'Alıcı adına trafik sigortası poliçesi', 'Güvenli ödeme referans numarası (ikinci elde)'],
      appliesTo: isUsed,
      deadline: (a) => ({ date: saleDateOf(a), kind: 'suggested' }),
    },
    {
      id: 'dealer-registration',
      phase: 'sale-day',
      title: 'Fatura, tescil ve ruhsatı teslim alın',
      description:
        'Sıfır araçta tescil işlemleri genellikle bayi tarafından yürütülür. Teslimde fatura, ruhsat, garanti belgesi ve yedek anahtarı aldığınızı kontrol edin.',
      documents: ['Kimlik kartı', 'Trafik sigortası poliçesi'],
      appliesTo: isNew,
      deadline: (a) => ({ date: saleDateOf(a), kind: 'suggested' }),
    },

    // ----- After the sale -----------------------------------------------------------
    {
      id: 'kasko',
      phase: 'after',
      title: 'Kasko yaptırmayı değerlendirin',
      description:
        'Trafik sigortası yalnızca karşı tarafın zararını karşılar. Kendi aracınızın hasarı için kasko gerekir; kredi kullandıysanız banka bunu zaten şart koşar.',
    },
    {
      id: 'hgs',
      phase: 'after',
      title: 'HGS etiketi alın',
      description:
        'Köprü ve otoyol geçişleri plakaya bağlı HGS ile yapılır. Önceki sahibin etiketi size geçmez; yeni etiketi PTT\'den ya da bankanızdan alın, yoksa geçişlerde ceza oluşabilir.',
      deadline: (a) => ({ date: addDays(saleDateOf(a), 1), kind: 'suggested' }),
    },
    {
      id: 'official-calendar',
      phase: 'after',
      title: 'Aracın tarihlerini resmî takviminize ekleyin',
      description:
        'MTV taksitleri, muayene, trafik sigortası ve kasko yenileme tarihlerini resmî takvimde hesaplatın ve telefonunuza ekleyin.',
      link: { label: 'Resmî takvimi aç', url: '#/takvim' },
    },
  ],
};

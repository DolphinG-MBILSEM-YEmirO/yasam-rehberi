// Life-event guide: moving house (taşınma).
//
// Each step can declare:
//   appliesTo(answers) -> boolean     show the step only for matching answers
//   deadline(answers)  -> {date, kind} kind is "legal" (law) or "suggested"
// Sources were checked on 2026-10-18; see README.md for the list.

import { addBusinessDays, addDays, parseISODate } from '../../lib/dates.js';

const EDEVLET = 'https://www.turkiye.gov.tr';

const isOwner = (a) => a.housing === 'owner';
const isTenant = (a) => a.housing === 'tenant';
const moveDateOf = (a) => parseISODate(a.moveDate);

export const movingGuide = {
  id: 'tasinma',
  title: 'Taşınma rehberi',
  summary:
    'Yeni bir eve taşınırken yapılacak resmî işler, abonelikler ve son tarihler; size özel ve sıralı.',

  questions: [
    {
      id: 'moveDate',
      type: 'date',
      label: 'Taşınma tarihiniz',
      hint: 'Son tarihler bu güne göre hesaplanır. Bilmiyorsanız tahmini bir gün seçin.',
    },
    {
      id: 'housing',
      type: 'choice',
      label: 'Yeni evde durumunuz',
      options: [
        { value: 'tenant', label: 'Kiracıyım' },
        { value: 'owner', label: 'Ev sahibiyim (satın aldım)' },
      ],
    },
    {
      id: 'cityChange',
      type: 'choice',
      label: 'Şehir değiştiriyor musunuz?',
      options: [
        { value: 'yes', label: 'Evet' },
        { value: 'no', label: 'Hayır' },
      ],
    },
    {
      id: 'naturalGas',
      type: 'choice',
      label: 'Yeni evde doğalgaz var mı?',
      options: [
        { value: 'yes', label: 'Evet' },
        { value: 'no', label: 'Hayır' },
      ],
    },
    {
      id: 'schoolChildren',
      type: 'choice',
      label: 'Okula giden çocuğunuz var mı?',
      options: [
        { value: 'yes', label: 'Evet' },
        { value: 'no', label: 'Hayır' },
      ],
    },
    {
      id: 'car',
      type: 'choice',
      label: 'Aracınız var mı?',
      options: [
        { value: 'yes', label: 'Evet' },
        { value: 'no', label: 'Hayır' },
      ],
    },
  ],

  phases: [
    { id: 'before', title: 'Taşınmadan önce' },
    { id: 'moving-day', title: 'Taşınma günü' },
    { id: 'after', title: 'Taşındıktan sonra' },
  ],

  steps: [
    // ----- Before moving -----------------------------------------------------
    {
      id: 'rental-contract',
      phase: 'before',
      title: 'Kira sözleşmesini imzalayın ve evi belgeleyin',
      description:
        'Sözleşmede kira bedeli, artış koşulu, depozito ve teslim tarihi yazılı olsun. Evin mevcut durumunu tarihli fotoğraflarla kaydedin; çıkışta depozito tartışmasını önler.',
      documents: ['Kimlik kartı', 'Depozito ödemesinin banka dekontu'],
      appliesTo: isTenant,
    },
    {
      id: 'title-deed',
      phase: 'before',
      title: 'Tapu devrini tamamlayın',
      description:
        'Tapu randevusu Web Tapu üzerinden alınır. Tapu harcı satış bedelinin %4\'üdür ve genellikle alıcı ile satıcı arasında yarı yarıya paylaşılır. Gerçek satış bedelini beyan edin.',
      documents: ['Kimlik kartı', 'Güncel tarihli DASK poliçesi', 'Fotoğraf (tapu müdürlüğünün istediği sayıda)'],
      link: { label: 'Web Tapu', url: 'https://webtapu.tkgm.gov.tr' },
      appliesTo: isOwner,
    },
    {
      id: 'dask',
      phase: 'before',
      title: 'Zorunlu deprem sigortası (DASK) yaptırın',
      description:
        'DASK, konut sahipleri için zorunludur ve tapu ile abonelik işlemlerinde istenir. Krediyle aldıysanız banka genellikle bunu sizin için yapar.',
      link: { label: 'DASK', url: 'https://www.dask.gov.tr' },
      appliesTo: isOwner,
    },
    {
      id: 'internet-transfer',
      phase: 'before',
      title: 'İnternet aboneliğinizi taşıyın',
      description:
        'Nakil talebini taşınmadan en az iki hafta önce verin; yeni adreste altyapı sorgusu yapılması ve teknisyen randevusu zaman alabilir. Nakil, taahhüdünüzü genellikle bozmaz.',
      link: { label: 'e-Devlet: Abonelik Nakil Başvurusu', url: `${EDEVLET}/btk-abonelik-nakil-basvurusu` },
      deadline: (a) => ({ date: addDays(moveDateOf(a), -14), kind: 'suggested' }),
    },
    {
      id: 'electricity-new',
      phase: 'before',
      title: 'Yeni evde elektrik aboneliği açın',
      description:
        'Başvuru, bölgenizdeki elektrik perakende satış şirketine e-Devlet ya da şirketin kendi sitesi üzerinden yapılır. Güvence bedeli alınabilir.',
      documents: [
        'Kimlik kartı',
        'Kira sözleşmesi veya tapu',
        'DASK poliçesi (ev sahibiyseniz)',
        'Eski bir fatura ya da abone numarası (ikinci el evde)',
        'IBAN',
      ],
      link: { label: 'e-Devlet: elektrik abonelik hizmetleri', url: `${EDEVLET}/arama?aranan=elektrik+abonelik` },
      deadline: (a) => ({ date: addDays(moveDateOf(a), -7), kind: 'suggested' }),
    },
    {
      id: 'water-new',
      phase: 'before',
      title: 'Yeni evde su aboneliği açın',
      description:
        'Su aboneliği belediyenin su idaresinden alınır (örneğin İSKİ, ASKİ, İZSU). Çoğu idare online başvuru kabul eder.',
      documents: ['Kimlik kartı', 'Kira sözleşmesi veya tapu', 'DASK poliçesi (ev sahibiyseniz)'],
      link: { label: 'e-Devlet: su abonelik hizmetleri', url: `${EDEVLET}/arama?aranan=su+abonelik` },
      deadline: (a) => ({ date: addDays(moveDateOf(a), -7), kind: 'suggested' }),
    },
    {
      id: 'gas-new',
      phase: 'before',
      title: 'Doğalgaz aboneliği açın ve gaz açma randevusu alın',
      description:
        'Abonelikten sonra gazın açılması için ayrıca randevu gerekir; kış aylarında randevular dolabilir. Güvence bedeli alınır.',
      documents: ['Kimlik kartı', 'Kira sözleşmesi veya tapu', 'DASK poliçesi (ev sahibiyseniz)'],
      link: { label: 'e-Devlet: doğalgaz abonelik hizmetleri', url: `${EDEVLET}/arama?aranan=do%C4%9Falgaz+abonelik` },
      appliesTo: (a) => a.naturalGas === 'yes',
      deadline: (a) => ({ date: addDays(moveDateOf(a), -7), kind: 'suggested' }),
    },

    // ----- Moving day ----------------------------------------------------------
    {
      id: 'meter-readings',
      phase: 'moving-day',
      title: 'Eski ve yeni evde sayaçların fotoğrafını çekin',
      description:
        'Elektrik, su ve doğalgaz sayaçlarının tarihli fotoğrafı, son fatura ve ilk fatura tartışmalarında kanıt olur.',
    },
    {
      id: 'old-home-handover',
      phase: 'moving-day',
      title: 'Eski evi teslim edin',
      description:
        'Anahtar teslimini ve evin durumunu yazılı bir tutanakla kayda geçirin. Kiracıysanız depozito iadesinin tarihini de yazdırın.',
    },

    // ----- After moving --------------------------------------------------------
    {
      id: 'old-utilities-close',
      phase: 'after',
      title: 'Eski evdeki abonelikleri kapatın',
      description:
        'Elektrik, su ve doğalgaz aboneliklerini sonlandırın; son faturayı ödeyin ve güvence bedelinin iadesini isteyin. Kapatmazsanız sonraki kullanıcının tüketimi size yazılabilir.',
      documents: ['Kimlik kartı', 'IBAN (güvence bedeli iadesi için)'],
      link: { label: 'e-Devlet: abonelik fesih hizmetleri', url: `${EDEVLET}/arama?aranan=abonelik+fesih` },
      deadline: (a) => ({ date: addDays(moveDateOf(a), 3), kind: 'suggested' }),
    },
    {
      id: 'address-change',
      phase: 'after',
      title: 'Adres değişikliğini bildirin',
      description:
        'Kanunen taşınmadan sonraki 20 iş günü içinde yapılmalıdır; geciken bildirime idari para cezası uygulanabilir. Boş bir eve taşındıysanız tek başınıza yapabilirsiniz. Evde başka biri oturuyorsa önce o kişinin e-Devlet\'ten muvafakat vermesi gerekir. Bildirim yapılınca seçmen kaydınız da yeni adrese geçer.',
      documents: ['Yeni adrese ait elektrik, su, doğalgaz veya internet aboneliği (sistem adresi doğrulayamazsa)'],
      link: { label: 'e-Devlet: Adres Değişikliği Bildirimi', url: `${EDEVLET}/adres-degisikligi-bildirimi` },
      deadline: (a) => ({ date: addBusinessDays(moveDateOf(a), 20), kind: 'legal' }),
    },
    {
      id: 'school-transfer',
      phase: 'after',
      title: 'Çocuğunuzun okul naklini yapın',
      description:
        'Okul kaydı adrese göre belirlendiği için önce adres değişikliğini tamamlayın. Nakil işlemi yeni okulun müdürlüğü üzerinden yürütülür.',
      documents: ['Veli ve öğrenci kimlik kartı', 'Güncel yerleşim yeri belgesi (e-Devlet\'ten)'],
      appliesTo: (a) => a.schoolChildren === 'yes',
    },
    {
      id: 'family-doctor',
      phase: 'after',
      title: 'Aile hekiminizi yeni adrese yakın biriyle değiştirin',
      description: 'Değişiklik e-Devlet üzerinden yapılır ve yakınınızdaki hekimlerin listesini gösterir.',
      link: { label: 'e-Devlet: Aile Hekimi Değiştirme', url: `${EDEVLET}/saglik-aile-hekimi-degistirme` },
      appliesTo: (a) => a.cityChange === 'yes',
    },
    {
      id: 'property-tax',
      phase: 'after',
      title: 'Emlak vergisi bildirimi verin',
      description:
        'Satın aldığınız konutu bulunduğu belediyeye bildirin. Bildirim, konutun alındığı yılın sonuna kadar yapılmalıdır.',
      documents: ['Kimlik kartı', 'Tapu'],
      appliesTo: isOwner,
      deadline: (a) => ({ date: new Date(moveDateOf(a).getFullYear(), 11, 31), kind: 'legal' }),
    },
    {
      id: 'car-insurance-address',
      phase: 'after',
      title: 'Araç sigortası ve kaskoda adresinizi güncelleyin',
      description:
        'Poliçedeki adres değiştiğinde sigorta şirketinize bildirin; şehir değiştiyseniz prim etkilenebilir.',
      appliesTo: (a) => a.car === 'yes',
    },
    {
      id: 'home-insurance',
      phase: 'after',
      title: 'Eşyalarınız için konut sigortası düşünün',
      description:
        'DASK yalnızca binayı depreme karşı korur. Yangın, su baskını ve hırsızlık gibi riskler için isteğe bağlı konut sigortası gerekir; kiracılar da eşyaları için yaptırabilir.',
    },
    {
      id: 'other-addresses',
      phase: 'after',
      title: 'Diğer adres kayıtlarını güncelleyin',
      description:
        'Bankalar, işvereniniz, alışveriş siteleri ve kargo uygulamaları adresinizi kendiliğinden öğrenmez. Kredi kartı ekstresi ve resmî tebligatlar için bankadaki adres önemlidir.',
    },
  ],
};

// Life-event guide: after the death of a family member (vefat sonrası işlemler).
//
// Same shape as moving.js; see that file for the step fields.
// Sources were checked on 2026-10-18; see README.md for the list.

import { addDays, addMonths, parseISODate } from '../../lib/dates.js';

const EDEVLET = 'https://www.turkiye.gov.tr';

const deathDateOf = (a) => parseISODate(a.deathDate);
const wasInsured = (a) => a.insured === 'yes';
const ownsProperty = (a) => a.property === 'yes';

export const bereavementGuide = {
  id: 'vefat',
  title: 'Vefat sonrası işlemler rehberi',
  summary: 'Mirasçılık belgesi, mirasın reddi, veraset vergisi, ölüm aylığı, banka hesapları ve tapu intikali.',

  questions: [
    {
      id: 'deathDate',
      type: 'date',
      label: 'Vefat tarihi',
      hint: 'Yasal süreler bu tarihten başlar.',
    },
    {
      id: 'insured',
      type: 'choice',
      label: 'Vefat eden kişi emekli ya da sigortalı mıydı?',
      options: [
        { value: 'yes', label: 'Evet' },
        { value: 'no', label: 'Hayır' },
      ],
    },
    {
      id: 'property',
      type: 'choice',
      label: 'Adına kayıtlı ev, arsa veya araç var mı?',
      options: [
        { value: 'yes', label: 'Evet' },
        { value: 'no', label: 'Hayır' },
      ],
    },
    {
      id: 'debts',
      type: 'choice',
      label: 'Borçlarının mal varlığından fazla olma ihtimali var mı?',
      options: [
        { value: 'yes', label: 'Evet' },
        { value: 'unsure', label: 'Bilmiyorum' },
        { value: 'no', label: 'Hayır' },
      ],
    },
  ],

  phases: [
    { id: 'first-days', title: 'İlk günler' },
    { id: 'first-months', title: 'İlk 4 ay' },
    { id: 'later', title: 'Sonrası' },
  ],

  steps: [
    // ----- First days ------------------------------------------------------------
    {
      id: 'death-certificate',
      phase: 'first-days',
      title: 'Ölüm belgesini alın ve defin işlemlerini tamamlayın',
      description:
        'Ölüm belgesini hastane ya da hastane dışındaki ölümlerde belediyenin görevlendirdiği doktor düzenler; ölüm nüfus kaydına bu belgeyle işlenir. Defin işlemleri için belediyenin cenaze hizmetlerini arayın. Sonraki tüm işlemler bu belgeye dayanır.',
      documents: ['Vefat eden kişinin kimlik kartı', 'Başvuran yakının kimlik kartı'],
      deadline: (a) => ({ date: deathDateOf(a), kind: 'suggested' }),
    },
    {
      id: 'asset-inquiry',
      phase: 'first-days',
      title: 'Mal varlığını ve borçları e-Devlet\'ten sorgulayın',
      description:
        'Mirasçılar e-Devlet\'te vefat eden kişinin banka hesaplarını, tapu ve araç kayıtlarını görebilir. Borçların mal varlığından fazla olup olmadığını erkenden görmek, mirası reddetme kararı için önemlidir.',
      link: { label: 'e-Devlet: vefat eden kişiye ait sorgulamalar', url: `${EDEVLET}/arama?aranan=vefat+eden` },
      deadline: (a) => ({ date: addDays(deathDateOf(a), 14), kind: 'suggested' }),
    },
    {
      id: 'heirship-certificate',
      phase: 'first-days',
      title: 'Mirasçılık belgesi (veraset ilamı) alın',
      description:
        'Belge herhangi bir noterden ya da sulh hukuk mahkemesinden alınır; mirasçılar arasında anlaşmazlık varsa mahkeme yolu gerekir. Banka, tapu, araç ve vergi işlemlerinin hepsinde istendiği için birkaç onaylı nüsha alın.',
      documents: ['Mirasçının kimlik kartı', 'Vefat eden kişinin kimlik bilgileri'],
      deadline: (a) => ({ date: addDays(deathDateOf(a), 14), kind: 'suggested' }),
    },

    // ----- First four months -------------------------------------------------------
    {
      id: 'reject-inheritance',
      phase: 'first-months',
      title: 'Mirası reddetmeyi değerlendirin',
      description:
        'Borçlar mal varlığından fazlaysa mirası reddederek borçlardan sorumlu olmaktan kurtulabilirsiniz. Ret, sulh hukuk mahkemesine 3 ay içinde bildirilir. Bu süre içinde mirastaki malları satmayın ya da harcamayın; bu davranış reddi geçersiz kılabilir. Bir avukata danışmanız önerilir.',
      appliesTo: (a) => a.debts === 'yes' || a.debts === 'unsure',
      deadline: (a) => ({ date: addMonths(deathDateOf(a), 3), kind: 'legal' }),
    },
    {
      id: 'survivor-pension',
      phase: 'first-months',
      title: 'Ölüm aylığına başvurun',
      description:
        'Eş, çocuklar ve belirli şartlarla anne ile baba ölüm aylığı alabilir. Aylık başvuruyu izleyen ayın başından bağlanır, bu yüzden geciktirmeyin. Vefat eden kişi emekliyse aylığı kesilir; ölümden sonra hesabına yatan aylık geri istenir, bu parayı çekmeyin.',
      link: { label: 'e-Devlet: ölüm aylığı başvurusu', url: `${EDEVLET}/arama?aranan=%C3%B6l%C3%BCm+ayl%C4%B1%C4%9F%C4%B1` },
      appliesTo: wasInsured,
      deadline: (a) => ({ date: addDays(deathDateOf(a), 30), kind: 'suggested' }),
    },
    {
      id: 'funeral-allowance',
      phase: 'first-months',
      title: 'SGK cenaze ödeneğine başvurun',
      description:
        'Sigortalı ya da emekli birinin vefatında SGK tek seferlik cenaze ödeneği öder. Başvuruyu hak sahipleri ya da cenaze masrafını yapan kişi yapabilir.',
      link: { label: 'e-Devlet: cenaze ödeneği', url: `${EDEVLET}/arama?aranan=cenaze+%C3%B6dene%C4%9Fi` },
      appliesTo: wasInsured,
      deadline: (a) => ({ date: addDays(deathDateOf(a), 30), kind: 'suggested' }),
    },
    {
      id: 'inheritance-tax',
      phase: 'first-months',
      title: 'Veraset ve intikal vergisi beyannamesi verin',
      description:
        'Ölüm Türkiye\'de olduysa beyanname 4 ay içinde, vefat eden kişinin son ikametgâhının bağlı olduğu vergi dairesine verilir. Miras istisna tutarının altında kalsa bile beyanname gerekir. 2026\'daki ölümler için eş ve çocukların her biri için istisna 2.907.136 TL\'dir. Çıkan vergi 3 yılda, Mayıs ve Kasım aylarında 6 eşit taksitle ödenir.',
      documents: ['Mirasçılık belgesi', 'Banka hesaplarının ölüm tarihindeki bakiyeleri', 'Tapu ve araç bilgileri'],
      link: { label: 'GİB İnteraktif Vergi Dairesi', url: 'https://ivd.gib.gov.tr' },
      deadline: (a) => ({ date: addMonths(deathDateOf(a), 4), kind: 'legal' }),
    },

    // ----- Later -------------------------------------------------------------------
    {
      id: 'bank-accounts',
      phase: 'later',
      title: 'Banka hesaplarını mirasçılar adına kapatın',
      description:
        'Bankalar, vergi dairesinden alınan ilişik kesme yazısı olmadan mirasçılara ödeme yapmaz. Beyanname verildikten sonra bu yazıyı alın ve her bankaya mirasçılık belgesiyle birlikte götürün.',
      documents: ['Mirasçılık belgesi', 'Vergi dairesinden ilişik kesme yazısı', 'Mirasçıların kimlik kartları'],
    },
    {
      id: 'property-transfer',
      phase: 'later',
      title: 'Tapu ve araç intikalini yapın',
      description:
        'Taşınmazlar tapu müdürlüğünde, araçlar noterde mirasçılar adına geçirilir. İntikal yapılmadan mal satılamaz. Vergi borcu olmadığını gösteren yazı ve mirasçılık belgesi istenir.',
      documents: ['Mirasçılık belgesi', 'Vergi dairesinden borcu yoktur yazısı', 'Mirasçıların kimlik kartları'],
      link: { label: 'Web Tapu', url: 'https://webtapu.tkgm.gov.tr' },
      appliesTo: ownsProperty,
    },
    {
      id: 'property-tax',
      phase: 'later',
      title: 'Belediyeye emlak vergisi bildirimi verin',
      description:
        'Taşınmaz mirasçılara geçtikten sonra yeni sahipler belediyeye emlak vergisi bildirimi vermelidir. Geç kalınan bildirimler cezaya yol açabilir.',
      documents: ['Kimlik kartı', 'Yeni tapu'],
      appliesTo: ownsProperty,
    },
    {
      id: 'subscriptions',
      phase: 'later',
      title: 'Abonelikleri ve hatları kapatın ya da devralın',
      description:
        'Elektrik, su, doğalgaz, internet ve telefon hatlarını kapatın ya da bir mirasçı adına devredin; aksi halde fatura borcu birikir. Sosyal medya ve e-posta hesapları için platformların vefat başvuru formlarını kullanın.',
      deadline: (a) => ({ date: addDays(deathDateOf(a), 60), kind: 'suggested' }),
    },
  ],
};

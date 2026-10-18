// Life-event guide: leaving a job (işten ayrılma).
//
// Same shape as moving.js; see that file for the step fields.
// Sources were checked on 2026-10-18; see README.md for the list.

import { addDays, parseISODate } from '../../lib/dates.js';

const EDEVLET = 'https://www.turkiye.gov.tr';

const leaveDateOf = (a) => parseISODate(a.leaveDate);
const lostJobNotByChoice = (a) => a.reason === 'dismissed' || a.reason === 'just-cause';
const resigned = (a) => a.reason === 'resigned';

export const leavingJobGuide = {
  id: 'isten-ayrilma',
  title: 'İşten ayrılma rehberi',
  summary: 'İşsizlik maaşı başvurusu, kıdem ve ihbar hakları, son maaş, sağlık güvencesi ve iş arama.',

  questions: [
    {
      id: 'leaveDate',
      type: 'date',
      label: 'Son iş gününüz',
      hint: 'İşsizlik maaşı için 30 günlük süre bu tarihten başlar.',
    },
    {
      id: 'reason',
      type: 'choice',
      label: 'İşten nasıl ayrılıyorsunuz?',
      options: [
        { value: 'dismissed', label: 'İşveren çıkardı' },
        { value: 'just-cause', label: 'Haklı nedenle ben feshettim' },
        { value: 'resigned', label: 'İstifa ettim' },
      ],
    },
    {
      id: 'tenure',
      type: 'choice',
      label: 'Bu işyerinde ne kadar çalıştınız?',
      options: [
        { value: 'under-1', label: '1 yıldan az' },
        { value: '1-plus', label: '1 yıl veya daha fazla' },
      ],
    },
  ],

  phases: [
    { id: 'leaving', title: 'Ayrılırken' },
    { id: 'first-month', title: 'İlk 30 gün' },
    { id: 'later', title: 'Sonrası' },
  ],

  steps: [
    // ----- While leaving ---------------------------------------------------------
    {
      id: 'resignation-terms',
      phase: 'leaving',
      title: 'İstifanın sonuçlarını bilin',
      description:
        'Kendi isteğinizle istifa ettiğinizde genellikle işsizlik maaşı ve kıdem tazminatı alamazsınız. Ücretiniz ödenmiyorsa, sağlığınız tehlikedeyse ya da taciz gibi ağır bir durum varsa haklı nedenle fesih seçeneğini bir uzmana danışın. İstifada ihbar süresine uymazsanız işveren sizden ihbar tazminatı isteyebilir.',
      appliesTo: resigned,
    },
    {
      id: 'final-pay',
      phase: 'leaving',
      title: 'Son maaşınızı ve kullanmadığınız izin ücretini kontrol edin',
      description:
        'Ayrılırken çalıştığınız son günlerin ücreti ve kullanmadığınız yıllık izin günlerinin ücreti ödenmelidir. Bordronuzu isteyin ve hesaplamayı kontrol edin.',
      documents: ['Son bordro', 'Kalan yıllık izin gün sayısı'],
      deadline: (a) => ({ date: leaveDateOf(a), kind: 'suggested' }),
    },
    {
      id: 'severance',
      phase: 'leaving',
      title: 'Kıdem tazminatınızı hesaplayın',
      description:
        'En az 1 yıl çalıştıysanız ve işveren sizi haklı bir neden olmadan çıkardıysa ya da siz haklı nedenle feshettiyseniz, her tam yıl için 30 günlük brüt ücret tutarında kıdem tazminatı alırsınız. Tazminat, devletin belirlediği tavanı aşamaz.',
      appliesTo: (a) => lostJobNotByChoice(a) && a.tenure === '1-plus',
      deadline: (a) => ({ date: leaveDateOf(a), kind: 'suggested' }),
    },
    {
      id: 'notice-pay',
      phase: 'leaving',
      title: 'İhbar süresine uyulup uyulmadığını kontrol edin',
      description:
        'İşveren, sözleşmeyi bitirmeden önce kıdeminize göre 2 ile 8 hafta arasında önceden haber vermek zorundadır. Haber vermeden çıkardıysa bu sürenin ücreti ihbar tazminatı olarak ödenir.',
      appliesTo: (a) => a.reason === 'dismissed',
    },
    {
      id: 'exit-code',
      phase: 'leaving',
      title: 'SGK çıkış kodunuzu kontrol edin',
      description:
        'İşveren, işten ayrılışınızı SGK\'ya bir çıkış koduyla bildirir. İşsizlik maaşı alıp alamayacağınızı bu kod belirler; istifa kodu girilmişse maaş bağlanmaz. Yanlış kod girildiyse hemen işverenden düzeltmesini isteyin.',
      link: { label: 'e-Devlet: İşe Giriş/İşten Ayrılış Bildirgeleri', url: `${EDEVLET}/sgk-esgkuyg-esgksifre-ise-giris-isten-ayrilis` },
      deadline: (a) => ({ date: addDays(leaveDateOf(a), 10), kind: 'suggested' }),
    },

    // ----- First 30 days ----------------------------------------------------------
    {
      id: 'unemployment-benefit',
      phase: 'first-month',
      title: 'İşsizlik maaşına başvurun',
      description:
        'Son 3 yılda en az 600 gün prim ödediyseniz ve son 120 gün kesintisiz çalıştıysanız işsizlik maaşı alabilirsiniz. Başvuru, işten ayrıldıktan sonraki 30 gün içinde yapılmalı; geciktiğiniz her gün ödeme süresinden düşülür. Prim gününüze göre 180, 240 veya 300 gün ödeme yapılır. Tutar, son 4 ayın ortalama brüt ücretinin %40\'ıdır ve brüt asgari ücretin %80\'ini geçemez.',
      documents: ['Kimlik kartı', 'IBAN'],
      link: { label: 'e-Devlet: İşsizlik Ödeneği Başvurusu', url: `${EDEVLET}/issizlik-odenegi-basvurusu` },
      appliesTo: lostJobNotByChoice,
      deadline: (a) => ({ date: addDays(leaveDateOf(a), 30), kind: 'legal' }),
    },
    {
      id: 'iskur-membership',
      phase: 'first-month',
      title: 'İŞKUR\'a iş arayan olarak kaydolun',
      description:
        'Kayıt, işsizlik maaşı için de gereklidir. Size uygun ilanları ve ücretsiz kursları buradan görebilirsiniz.',
      link: { label: 'e-Devlet: İŞKUR İş Arayan Üyelik', url: `${EDEVLET}/iskur-is-arayan-uyelik` },
      deadline: (a) => ({ date: addDays(leaveDateOf(a), 30), kind: 'suggested' }),
    },
    {
      id: 'health-coverage',
      phase: 'first-month',
      title: 'Sağlık güvencenizin devam ettiğinden emin olun',
      description:
        'İşsizlik maaşı alırken genel sağlık sigortası priminiz fondan ödenir. Maaş almıyorsanız ve eşiniz ya da ebeveyniniz üzerinden sağlık güvenceniz yoksa, prim borcu oluşmaması için GSS gelir testine başvurun.',
      link: { label: 'e-Devlet: GSS gelir testi', url: `${EDEVLET}/arama?aranan=gelir+testi` },
      deadline: (a) => ({ date: addDays(leaveDateOf(a), 30), kind: 'suggested' }),
    },

    // ----- Later --------------------------------------------------------------------
    {
      id: 'service-record',
      phase: 'later',
      title: 'Hizmet dökümünüzü kontrol edin',
      description:
        'Son işyerindeki çalışma günlerinizin ve ücretinizin SGK kaydına eksiksiz yansıdığını kontrol edin. Eksik gün varsa emeklilik hesabınızı etkiler.',
      link: { label: 'e-Devlet: SGK hizmet dökümü', url: `${EDEVLET}/arama?aranan=hizmet+d%C3%B6k%C3%BCm%C3%BC` },
    },
    {
      id: 'mediation',
      phase: 'later',
      title: 'Haklarınız ödenmezse önce arabulucuya başvurun',
      description:
        'Kıdem, ihbar ya da ücret alacağı için dava açmadan önce arabulucuya başvurmak zorunludur. Başvuru adliyedeki arabuluculuk bürosuna yapılır ve ücretsizdir.',
      appliesTo: lostJobNotByChoice,
    },
  ],
};

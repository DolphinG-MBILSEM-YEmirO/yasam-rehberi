// Life-event guide: retiring (emeklilik).
//
// Same shape as moving.js; see that file for the step fields.
// Sources were checked on 2026-10-18; see README.md for the list.

import { addDays, parseISODate } from '../../lib/dates.js';

const EDEVLET = 'https://www.turkiye.gov.tr';

const applicationDateOf = (a) => parseISODate(a.applicationDate);
const isWorker = (a) => a.status === '4a';
const isSelfEmployed = (a) => a.status === '4b';
const isCivilServant = (a) => a.status === '4c';

export const retirementGuide = {
  id: 'emeklilik',
  title: 'Emeklilik rehberi',
  summary: 'Hizmet dökümü kontrolü, hizmet birleştirme, işten ayrılma, emeklilik başvurusu ve ilk maaş.',

  questions: [
    {
      id: 'applicationDate',
      type: 'date',
      label: 'Emeklilik başvurusu için planladığınız tarih',
      hint: 'Aylık, başvuruyu izleyen ayın başından bağlanır. Kesin değilse tahmini bir gün seçin.',
    },
    {
      id: 'status',
      type: 'choice',
      label: 'Son dönemde hangi statüde çalışıyorsunuz?',
      options: [
        { value: '4a', label: 'İşçi (SSK, 4A)' },
        { value: '4b', label: 'Esnaf veya serbest meslek (Bağ-Kur, 4B)' },
        { value: '4c', label: 'Memur (Emekli Sandığı, 4C)' },
      ],
    },
    {
      id: 'mixedService',
      type: 'choice',
      label: 'Farklı statülerde çalıştığınız dönemler oldu mu?',
      hint: 'Örneğin bir süre işçi, bir süre esnaf olarak.',
      options: [
        { value: 'yes', label: 'Evet' },
        { value: 'no', label: 'Hayır' },
      ],
    },
    {
      id: 'keepWorking',
      type: 'choice',
      label: 'Emekli olduktan sonra çalışmayı düşünüyor musunuz?',
      options: [
        { value: 'yes', label: 'Evet' },
        { value: 'no', label: 'Hayır' },
      ],
    },
  ],

  phases: [
    { id: 'before', title: 'Başvurudan önce' },
    { id: 'application', title: 'Başvuru' },
    { id: 'after', title: 'Emekli olduktan sonra' },
  ],

  steps: [
    // ----- Before applying -------------------------------------------------------
    {
      id: 'eligibility',
      phase: 'before',
      title: 'Hizmet dökümünüzü ve emeklilik şartlarınızı kontrol edin',
      description:
        'Prim gününüzü, sigortalılık başlangıç tarihinizi ve yaş şartınızı e-Devlet\'te görün. Eksik ya da hatalı görünen dönemler varsa başvurudan önce düzeltilmesini isteyin; sonradan düzeltmek aylığınızı geciktirir.',
      link: { label: 'e-Devlet: emeklilik şartları sorgulama', url: `${EDEVLET}/arama?aranan=ne+zaman+emekli+olabilirim` },
      deadline: (a) => ({ date: addDays(applicationDateOf(a), -60), kind: 'suggested' }),
    },
    {
      id: 'buy-back',
      phase: 'before',
      title: 'Eksik gün varsa borçlanmayı değerlendirin',
      description:
        'Askerlik, doğum sonrası çalışılmayan süreler ve yurt dışı çalışmaları gibi bazı dönemler borçlanılarak hizmete eklenebilir. Borçlanma bedeli ödendiği gün hizmetinize sayılır, bu yüzden emeklilik tarihinizi öne çekebilir.',
      link: { label: 'e-Devlet: SGK borçlanma hizmetleri', url: `${EDEVLET}/arama?aranan=bor%C3%A7lanma` },
    },
    {
      id: 'service-merge',
      phase: 'before',
      title: 'Hizmet birleştirmenin hangi statüden emekli edeceğini öğrenin',
      description:
        'Farklı statülerdeki hizmetleriniz birleştirilir. Genel kural, son 7 yılda en çok hangi statüde çalıştıysanız o statünün şartlarıyla emekli olmanızdır. Kurallar ayrıntılı olduğu ve birleştirme işlemi başvuruyu uzatabildiği için durumunuzu önceden SGK\'ya teyit ettirin.',
      appliesTo: (a) => a.mixedService === 'yes',
      deadline: (a) => ({ date: addDays(applicationDateOf(a), -60), kind: 'suggested' }),
    },
    {
      id: 'premium-debt',
      phase: 'before',
      title: 'Bağ-Kur prim borcunuzu kapatın',
      description:
        'Bağ-Kur\'dan emekli aylığı bağlanabilmesi için prim ve diğer borçlarınızın ödenmiş olması gerekir. Borcunuz varsa başvurudan önce ödeyin ya da o dönem açık bir yapılandırma imkânı varsa değerlendirin.',
      link: { label: 'e-Devlet: 4B borç sorgulama', url: `${EDEVLET}/arama?aranan=4b+bor%C3%A7` },
      appliesTo: isSelfEmployed,
      deadline: (a) => ({ date: addDays(applicationDateOf(a), -14), kind: 'suggested' }),
    },
    {
      id: 'severance',
      phase: 'before',
      title: 'Kıdem tazminatınızı isteyin',
      description:
        'Emekli olmak için işten ayrılan işçi, aynı işverende en az 1 yıl çalıştıysa kıdem tazminatı alır. Yalnızca yaş şartını bekleyenler de SGK\'dan alacakları yazıyla işverene başvurarak tazminatlı ayrılabilir. Ayrılış dilekçenizde nedenin emeklilik olduğunu yazın.',
      link: { label: 'e-Devlet: kıdem tazminatı alabilir yazısı', url: `${EDEVLET}/arama?aranan=k%C4%B1dem+tazminat%C4%B1+alabilir` },
      appliesTo: isWorker,
      deadline: (a) => ({ date: addDays(applicationDateOf(a), -14), kind: 'suggested' }),
    },
    {
      id: 'leave-job',
      phase: 'before',
      title: 'Başvurudan önce işten ayrılın',
      description:
        'İşçilerde aylık bağlanması için önce işten ayrılmak, sonra yazılı başvuru yapmak gerekir. Çalışırken yapılan başvuruda ödenen aylıklar sonradan geri istenebilir. Emekli olduktan sonra yeniden çalışmanız mümkündür.',
      appliesTo: isWorker,
      deadline: (a) => ({ date: applicationDateOf(a), kind: 'legal' }),
    },
    {
      id: 'civil-servant-petition',
      phase: 'before',
      title: 'Kurumunuza emeklilik dilekçesi verin',
      description:
        'Memurlar emekliliğe ayrılma isteklerini çalıştıkları kuruma dilekçeyle bildirir; kurum görevden ayrılışınızı SGK\'ya iletir. Dilekçede ayrılmak istediğiniz tarihi açıkça yazın ve kurumunuzun emeklilik ikramiyesi hesabını kontrol edin.',
      appliesTo: isCivilServant,
      deadline: (a) => ({ date: addDays(applicationDateOf(a), -30), kind: 'suggested' }),
    },

    // ----- Application -----------------------------------------------------------
    {
      id: 'apply',
      phase: 'application',
      title: 'Emeklilik başvurusunu yapın',
      description:
        'Başvuru e-Devlet\'ten ya da SGK merkezinden yapılır. Aylık, şartları taşıdığınız ve başvurduğunuz tarihi izleyen ayın başından itibaren bağlanır; geç başvurmak kaçırılan ayları geri getirmez. Başvuruda aylığın yatırılacağı bankayı da seçersiniz.',
      documents: ['Kimlik kartı', 'Aylığın yatırılmasını istediğiniz banka'],
      link: { label: 'e-Devlet: SGK emeklilik başvurusu', url: `${EDEVLET}/arama?aranan=emeklilik+ba%C5%9Fvurusu` },
      deadline: (a) => ({ date: applicationDateOf(a), kind: 'suggested' }),
    },
    {
      id: 'track',
      phase: 'application',
      title: 'Başvurunuzun durumunu takip edin',
      description:
        'Sonuç genellikle başvuruyu izleyen ay içinde çıkar; hizmet birleştirme gerekiyorsa üç aya kadar uzayabilir. Evrak takibini e-Devlet\'ten ya da Alo 170\'ten yapabilirsiniz.',
      link: { label: 'e-Devlet: SGK evrak takibi', url: `${EDEVLET}/arama?aranan=evrak+takip` },
      deadline: (a) => ({ date: addDays(applicationDateOf(a), 45), kind: 'suggested' }),
    },

    // ----- After retiring --------------------------------------------------------
    {
      id: 'first-pension',
      phase: 'after',
      title: 'İlk maaşınızı ve banka promosyonunu kontrol edin',
      description:
        'İlk aylık, başvurunuzun onaylanmasından sonra seçtiğiniz bankaya toplu olarak yatar. Bankalar emekli maaşını taşıyanlara promosyon öder; teklifleri ve taahhüt sürelerini karşılaştırın.',
    },
    {
      id: 'health-coverage',
      phase: 'after',
      title: 'Ailenizin sağlık güvencesini kontrol edin',
      description:
        'Emekliler genel sağlık sigortası kapsamında kalır. Çalışmayan eşinizin ve çocuklarınızın sizin üzerinizden bakmakla yükümlü olunan kişi olarak göründüğünü e-Devlet\'ten kontrol edin.',
      link: { label: 'e-Devlet: bakmakla yükümlü olunan kişiler', url: `${EDEVLET}/arama?aranan=bakmakla+y%C3%BCk%C3%BCml%C3%BC` },
    },
    {
      id: 'work-after-retirement',
      phase: 'after',
      title: 'Emekliyken çalışmanın kurallarını bilin',
      description:
        'İşçi ya da esnaf olarak çalışmaya devam ederseniz aylığınız kesilmez; bunun yerine sosyal güvenlik destek primi ödenir. Kamuda memur olarak yeniden göreve başlamak ise aylığınızın durdurulmasına yol açar.',
      appliesTo: (a) => a.keepWorking === 'yes',
    },
  ],
};

'use client';

import SiblingPageLink from '@/components/SiblingPageLink';
import HomeLinkPill from '@/components/HomeLinkPill';

// Gizlilik — hangi veri saklanıyor, nerede, ne kadar süre.
//
// 2026-10-25'te eklendi. Dış bir değerlendirme raporu sitenin gizlilik
// sayfası olmadığını bildirdi; incelerken daha ağır bir sorun çıktı:
// "Kur'an'a Sor" bölümü "Hiçbir kişisel veri saklanmaz" diyordu, oysa
// sorgular kalıcı olarak saklanıyor. Beyan düzeltildi ve bu sayfa yazıldı.
//
// Buradaki her satır koddan OKUNARAK yazıldı, tahmin yok:
//   · saklanan alanlar      → api/concierge/route.js logQuery çağrıları
//   · geri bildirim alanları → api/concierge/feedback/route.js
//   · önbellek süresi       → lib/concierge-kv.js CACHE_TTL_SECONDS
//   · sayaç süresi          → lib/concierge-budget.js COUNTER_TTL_SECONDS
//   · IP işleme biçimi      → lib/concierge-budget.js hashIp
// Kod değişirse bu sayfa da değişmeli.
//
// Bu sayfa hukuki metin DEĞİLDİR; ne olduğunu düz anlatır. KVKK ve benzeri
// yükümlülükler için uzman görüşü gerekir, bu sayfa onun yerine geçmez.

import { useLanguage } from '@/i18n/LanguageContext';
import { COLORS, FONTS, GLASS_CARD, SEMANTIC } from '@/tokens';
import useNavbarOffset from '@/components/useNavbarOffset';

const BOLUMLER = [
  {
    id: 'soru',
    titleTr: 'Sorduğun soru',
    titleEn: 'The question you ask',
    rows: [
      {
        tr: 'Kur\'an\'a Sor bölümüne yazdığın metin sunucuya gönderilir ve cevabı üretmek için kullanılır. Sorular, günlük kayıt sınırı aşılmadıkça site kayıtlarına yazılır. Kaydedilen sorular için otomatik silme süresi belirlenmemiştir. Bu kayıtlar neyin sorulduğunu görüp siteyi geliştirmek içindir.',
        en: 'The text you type into the Ask the Quran section is sent to the server and used to produce an answer. Unless the daily record limit has been reached, questions are written to the site records. No automatic deletion period has been set for stored questions. They exist so we can see what is asked and improve the site.',
      },
      {
        tr: 'Sorduğun metin adres çubuğuna da yazılır. Tarayıcı geçmişinde görünür, bağlantıyı ya da ekranını paylaşırsan karşı tarafa geçer; yapılandırmaya bağlı olarak erişim kayıtlarına ve yönlendiren adres bilgisine de yansıyabilir. Lütfen kendine veya başkalarına ait kimlik, iletişim ya da sağlık bilgisi gibi hassas bilgileri yazma.',
        en: 'Your question is also written into the address bar. It appears in your browser history and travels with the link if you share the link or your screen; depending on configuration it may also reach access logs and referrer information. Please do not type sensitive details such as identity, contact or health information, whether your own or someone else\'s.',
      },
      {
        tr: 'Kayda giren alanlar: sorunun kendisi, soruya karşılık gelen kısa bir kimlik, dil tercihi, arama kipi, cevabın hangi yoldan üretildiği, kaç sonuç döndüğü, zaman damgası ve ağ adresinden türetilmiş kısa bir karşılık.',
        en: 'The fields recorded are: the question itself, a short identifier derived from it, the language, the search mode, how the answer was produced, how many results came back, a timestamp, and a short value derived from the network address.',
      },
    ],
  },
  {
    id: 'ag-adresi',
    titleTr: 'Ağ adresin',
    titleEn: 'Your network address',
    rows: [
      {
        tr: 'Soru kayıtlarına IP adresinin kendisi değil, bu adresten türetilen kısa bir değer yazılır. Bu işlem anonimlik garantisi sağlamaz. Amacı tek bir kaynağın hizmeti aşırı kullanmasını sınırlamaktır. Barındırma ve güvenlik hizmetlerinin kendi kayıtlarını tutup tutmadığı bu sayfanın kapsamı dışındadır.',
        en: 'The question records hold not the IP address itself but a short value derived from it. This does not amount to a guarantee of anonymity. Its purpose is to limit any single source from overusing the service. Whether the hosting and security services keep records of their own is outside the scope of this page.',
      },
      {
        tr: 'Aynı karşılık günlük sayaçlarda da kullanılır: dakikalık istek sınırı, günlük harcama sınırı ve kayıt yazma sınırı. Bu sayaçlar iki gün sonra kendiliğinden silinir.',
        en: 'The same value is used in daily counters: the per-minute request limit, the daily spending limit and the record-writing limit. These counters are deleted automatically after two days.',
      },
    ],
  },
  {
    id: 'geri-bildirim',
    titleTr: 'Geri bildirim düğmeleri',
    titleEn: 'The feedback buttons',
    rows: [
      {
        tr: 'Bir sonucu beğendiğini ya da beğenmediğini işaretlersen şunlar kaydedilir: soruya karşılık gelen kısa kimlik, işaretlediğin sonucun kimliği, beğeni yönü, dil ve zaman damgası. Adın, e-postan ya da hesabın istenmez; zaten hesap sistemi yoktur.',
        en: 'If you mark a result as helpful or unhelpful, the following are recorded: the short identifier of the question, the identifier of the result you marked, the direction of the rating, the language and a timestamp. No name, email or account is requested; there is no account system.',
      },
    ],
  },
  {
    id: 'sure',
    titleTr: 'Süreler',
    titleEn: 'Retention',
    rows: [
      {
        tr: 'Soru kayıtları ve geri bildirimler için otomatik silme süresi belirlenmemiştir. Üretilen cevap yedi gün önbellekte kalır, sonra düşer. Kullanım sayaçları iki gün sonra silinir.',
        en: 'No automatic deletion period has been set for question records and feedback. A produced answer stays in the cache for seven days, then expires. Usage counters are deleted after two days.',
      },
      {
        tr: 'Günde aynı kaynaktan gelen kayıt sayısının bir üst sınırı vardır. Sınır aşıldığında sorular yine cevaplanır, yalnız kayda yazılmaz. Bu sınır kaynak başına büyümeyi yavaşlatır; arşivin toplam büyüklüğünü sınırlamaz.',
        en: 'There is an upper limit on how many records a single source can write in a day. Once it is reached, questions are still answered; they are simply not recorded. This slows growth per source; it does not cap the total size of the archive.',
      },
    ],
  },
  {
    id: 'tarayici',
    titleTr: 'Tarayıcında kalanlar',
    titleEn: 'What stays in your browser',
    rows: [
      {
        tr: 'Okuma tercihleri, yer imleri ve kütüphanen tarayıcının kendi deposunda tutulur. Bunlar sunucuya gönderilmez; tarayıcı verisini temizlersen silinirler.',
        en: 'Reading preferences, bookmarks and your library are kept in the browser\'s own storage. They are not sent to the server; clearing your browser data removes them.',
      },
    ],
  },
  {
    id: 'hizmetler',
    titleTr: 'Kullanılan hizmetler',
    titleEn: 'Services used',
    rows: [
      {
        tr: 'Site Vercel üzerinde barındırılır ve kayıtlar Vercel\'in veri deposunda tutulur. Cevap metnini oluşturmak için bir dil modeli sağlayıcısına istek gönderilir; gönderilen şey sorunun kendisi ve site içeriğinden seçilmiş adaylardır. Meal metinleri için dış Kur\'an API\'leri kullanılır.',
        en: 'The site is hosted on Vercel and records are kept in Vercel\'s data store. To compose the answer text a request is sent to a language model provider; what is sent is the question itself and candidates selected from the site\'s own content. External Quran APIs are used for translation texts.',
      },
    ],
  },
  {
    id: 'sinir',
    titleTr: 'Kaydının silinmesi',
    titleEn: 'Removing your record',
    rows: [
      {
        tr: 'Bir kaydın silinmesini istersen talebini sitedeki geri bildirim düğmesinden iletebilirsin. Mevcut sistemde hesap bulunmadığı için bir kaydın sana ait olduğunu doğrulamak her durumda mümkün olmayabilir.',
        en: 'If you want a record removed, you can send the request using the feedback button on the site. Because there are no accounts, it may not always be possible to confirm that a record is yours.',
      },
      {
        tr: 'Bir sorun görürsen aynı düğmeden yazabilirsin. Talebinde ek kişisel bilgi paylaşmana gerek yok.',
        en: 'If you see a problem you can write using the same button. There is no need to share further personal details in your message.',
      },
    ],
  },
];

export default function GizlilikRoute() {
  const { language } = useLanguage();
  const tr = language === 'tr';
  useNavbarOffset(0, 62);

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - var(--qc-nav-h, 84px))',
      paddingTop: 'var(--qc-nav-h, 84px)',
    }}>
      <div className="mq-box" style={{
        maxWidth: '860px', margin: '0 auto',
        '--pt-d': '40px', '--pt-m': '28px',
        '--pr-d': '32px', '--pr-m': '16px',
        '--pb-d': '64px', '--pb-m': '48px',
        '--pl-d': '32px', '--pl-m': '16px',
      }}>
        <HomeLinkPill language={language} />

        <h1 className="mq-fs" style={{
          '--fs-d': '2rem', '--fs-m': '1.5rem',
          fontFamily: FONTS.display, color: COLORS.offWhite,
          fontWeight: 700, margin: '20px 0 10px', lineHeight: 1.25,
        }}>
          {tr ? 'Gizlilik' : 'Privacy'}
        </h1>

        <p style={{
          color: SEMANTIC.textMuted, fontFamily: FONTS.body,
          fontSize: '1rem', lineHeight: 1.8, margin: '0 0 32px', maxWidth: '62ch',
        }}>
          {tr
            ? 'Bu sayfa, sitede hangi verinin saklandığını, nerede tutulduğunu ve ne kadar süre kaldığını anlatır. Hesap sistemi yoktur; adın ya da e-postan hiçbir yerde istenmez.'
            : 'This page explains what the site stores, where it is kept and for how long. There is no account system; your name or email is never requested.'}
        </p>

        {BOLUMLER.map((b) => (
          <section key={b.id} style={{ ...GLASS_CARD, padding: '22px 24px', marginBottom: '16px' }}>
            <h2 style={{
              fontFamily: FONTS.body, color: COLORS.gold,
              fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              margin: '0 0 14px',
            }}>
              {tr ? b.titleTr : b.titleEn}
            </h2>
            {b.rows.map((r, i) => (
              <p key={i} style={{
                color: SEMANTIC.textMuted, fontFamily: FONTS.body,
                fontSize: '0.92rem', lineHeight: 1.8,
                margin: i === b.rows.length - 1 ? 0 : '0 0 12px',
                maxWidth: '62ch',
              }}>
                {tr ? r.tr : r.en}
              </p>
            ))}
          </section>
        ))}

        <p style={{
          color: SEMANTIC.textFaint, fontFamily: FONTS.body,
          fontSize: '0.78rem', lineHeight: 1.7, margin: '24px 0 0',
        }}>
          {tr ? 'Son güncelleme: 25 Ekim 2026' : 'Last updated: October 25, 2026'}
        </p>

        <SiblingPageLink
          href={`/${language}/hakkinda`}
          labelTr="Hakkında: yöntem ve kaynaklar"
          labelEn="About: method and sources"
          language={language}
        />
      </div>
    </div>
  );
}

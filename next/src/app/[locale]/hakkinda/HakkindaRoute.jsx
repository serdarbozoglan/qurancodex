'use client';

import SiblingPageLink from '@/components/SiblingPageLink';
import HomeLinkPill from '@/components/HomeLinkPill';

// Hakkında / Metodoloji — QuranCodex'in amacı, epistemik duruşu, kaynakları ve sınırları.
// İçerik component-içi (i18n JSON'a key eklenmedi). Pattern: KaynakcaRoute ile aynı
// (glass card bölümler, altın eyebrow, bilingual useLanguage).
//
// Kalp bölüm: "Epistemik Duruş" — Kur'an üstünlüğü ilkesi
// (memory: quran-supremacy-framing). Kullanıcı direktifi 2026-07-24.

import { useLanguage } from '@/i18n/LanguageContext';
import { COLORS, FONTS, GLASS_CARD } from '@/tokens';
import useNavbarOffset from '@/components/useNavbarOffset';

// "Son güncelleme" tarihi — CLAUDE.md kuralı: her `git push`'ta en son push
// gününe elle güncellenir (2026-08-17'de eklendi, kullanıcı direktifi).
const LAST_UPDATED_TR = '26 Ağustos 2026';
const LAST_UPDATED_EN = 'August 26, 2026';

const SECTIONS = [
  {
    id: 'amac',
    eyebrowTr: 'Amaç', eyebrowEn: 'Purpose',
    titleTr: 'Bu Çalışma Nedir?',
    titleEn: 'What Is This Work?',
    bodyTr: [
      "QuranCodex, Kur'ân-ı Kerîm'in görünmeyen mimarisini — dilsel örüntülerini, yapısal simetrilerini, seslerinin anlamla ilişkisini ve tematik derinliğini — sinematik ve etkileşimli araçlarla keşfe açan bağımsız bir çalışmadır.",
      "Amaç, akademik bilgiyi kuru bir ders değil, bir keşif yolculuğuna dönüştürmektir. Her araç, klasik tefsir ve modern akademik literatüre dayanarak bir örüntüyü görünür kılar; okuyanı yalnızca bilgilendirmeyi değil, tefekküre davet etmeyi hedefler.",
    ],
    bodyEn: [
      "QuranCodex is an independent work that opens the invisible architecture of the Qur'an — its linguistic patterns, structural symmetries, the relationship between its sounds and meanings, and its thematic depth — to exploration through cinematic, interactive tools.",
      "The aim is to turn scholarship into a journey of discovery rather than a dry lecture. Each tool makes a pattern visible on the basis of classical tafsir and modern academic literature — inviting not just information, but reflection.",
    ],
  },
  {
    id: 'durus',
    star: true,
    eyebrowTr: 'Epistemik Duruş', eyebrowEn: 'Epistemic Stance',
    titleTr: 'Kur\'ân Hakikatin Ölçüsüdür',
    titleEn: 'The Qur\'an Is the Measure of Truth',
    bodyTr: [
      "Kur'ân-ı Kerîm Allah'ın kelâmıdır; söylediği harfi harfine doğrudur. Bu, sitedeki tüm içeriğin dayandığı temel ilkedir.",
      "Bu sitedeki hiçbir bilimsel, tarihsel veya akademik veri, bir Kur'ân ifadesinin doğruluğunu \"kanıtlamaz\" ya da \"onaylamaz\" — çünkü Kur'ân, hakikatin ölçüsüdür; bilimin onayına muhtaç değildir. Modern bir bulgunun Kur'ân ile örtüşmesi bir \"kanıt\" değil, bir tefekkür vesilesidir.",
      "Bir konunun modern bilimle henüz örtüşmemesi de Kur'ân'ın eksik ya da yanlış olduğu anlamına gelmez. Böyle bir durumda kusur ya bilimin henüz o noktaya ulaşamamış olmasındadır, ya da bizim o âyeti anlayışımızdadır (tefsir/yorum). Kur'ân metni tartışılmaz; tartışılan, daima insanın yorumudur.",
    ],
    bodyEn: [
      "The Qur'an is the word of Allah; what it says is true to the letter. This is the foundational principle on which all content here rests.",
      "No scientific, historical or academic datum on this site \"proves\" or \"confirms\" the truth of a Qur'anic statement — for the Qur'an is the measure of truth and needs no validation from science. A modern finding aligning with the Qur'an is not a \"proof\" but an occasion for reflection.",
      "Nor does a matter not yet aligning with modern science mean the Qur'an is deficient or mistaken. In such a case the shortfall lies either in science not yet having reached that point, or in our own understanding of the verse (its interpretation). The text of the Qur'an is not in question; what is discussed is always the human reading of it.",
    ],
  },
  {
    id: 'metodoloji',
    eyebrowTr: 'Metodoloji', eyebrowEn: 'Methodology',
    titleTr: 'Kaynaklar ve Yöntem',
    titleEn: 'Sources and Method',
    listTr: [
      ["Kur'ân metni & kıraat", "Hafs an Âsım kıraati (Diyanet resmî mushaf standardı). Âyet numaralandırması ve sayımı Hafs sayımına göredir."],
      ["Meâl (çeviri)", "Kullanıcı seçebilir: Diyanet İşleri, Elmalılı Hamdi Yazır, Suat Yıldırım, Yaşar Nuri Öztürk, Süleymaniye Vakfı, Edip Yüksel. Tek meâlin kelime seçimine bağlı kalmamak için çok-meâlli yaklaşım benimsenir."],
      ["Tefsir", "Elmalılı Hamdi Yazır (Türkçe) ve İbn Kesîr (İngilizce) esas alınır; içerik notlarında Taberî, Zemahşerî, Râzî, Kurtubî gibi klasik kaynaklara atıf yapılır."],
      ["Arapça metin", "Standart Unicode + KFGQPC hattı; her metin gösterim öncesi encoding açısından normalize edilir (font uyumu için)."],
    ],
    listEn: [
      ["Qur'anic text & reading", "Ḥafṣ ʿan ʿĀṣim reading (the Diyanet official muṣḥaf standard). Verse numbering and counts follow the Ḥafṣ count."],
      ["Translation (meal)", "Selectable by the user: Diyanet, Elmalılı Hamdi Yazır, Suat Yıldırım, Yaşar Nuri Öztürk, Süleymaniye Vakfı, Edip Yüksel. A multi-translation approach avoids over-reliance on a single rendering's word choices."],
      ["Tafsir", "Elmalılı Hamdi Yazır (Turkish) and Ibn Kathīr (English) are the base; content notes cite classical sources such as al-Ṭabarī, al-Zamakhsharī, al-Rāzī, and al-Qurṭubī."],
      ["Arabic text", "Standard Unicode + KFGQPC typeface; every text is normalized for encoding before display (for font compatibility)."],
    ],
    afterTr: "Tam ve kategorize kaynakça için ",
    afterEn: "For the full, categorized bibliography see ",
    linkLabelTr: "Kaynakça sayfası", linkLabelEn: "the Bibliography page",
    linkHref: '/kaynakca',
  },
  {
    id: 'sinirlar',
    eyebrowTr: 'Sınırlar & Dürüstlük', eyebrowEn: 'Limits & Honesty',
    titleTr: 'Neyi İddia Ederiz, Neyi Etmeyiz',
    titleEn: 'What We Claim, What We Don\'t',
    bodyTr: [
      "\"Bilimsel işaretler\" ve \"tarihsel izler\" bir örtüşme düzeyinde sunulur — kesin bilimsel kanıt olarak değil. Tartışmalı yorumlar sayfa içinde açık notlarla (criticalNote) işaretlenir.",
      "İstatistikler iki türlüdür: kanonik metinden doğrudan sayılanlar kesindir; hesaplanmış ya da tahmini olanlar açıkça belirtilir.",
      "Tefsir yorumları âlimler arasında farklılık gösterebilir; sunulan bir okuma imkânıdır, tek doğru değil. Yorumun tartışmalı olması Kur'ân metnini değil, insanın anlayışını ilgilendirir — metin sabittir.",
    ],
    bodyEn: [
      "\"Scientific signs\" and \"historical traces\" are presented at the level of alignment — not as conclusive scientific proof. Disputed interpretations are flagged inline with explicit critical notes.",
      "Statistics are of two kinds: those counted directly from the canonical text are exact; those computed or estimated are clearly marked as such.",
      "Tafsir interpretations can differ among scholars; what is offered is a possible reading, not the sole truth. That an interpretation is debated concerns human understanding, not the Qur'anic text — the text is fixed.",
    ],
  },
  {
    id: 'yazar',
    eyebrowTr: 'Yazar & İletişim', eyebrowEn: 'Authorship & Contact',
    titleTr: 'Kim Hazırlıyor?',
    titleEn: 'Who Prepares This?',
    bodyTr: [
      "QuranCodex bağımsız bir çalışmadır. İçerik, klasik tefsir ve akademik kaynaklara dayanılarak hazırlanır; kullanılan kaynaklar Kaynakça sayfasında listelenir.",
      "Bir hata fark ederseniz — özellikle bir âyet, referans ya da bilgi hatası — lütfen bildirin; içerik doğruluğu bu çalışmanın en önemli önceliğidir. Geri bildirim için sitedeki geri bildirim özelliklerini veya info@qurancodex.com adresini kullanabilirsiniz.",
    ],
    bodyEn: [
      "QuranCodex is an independent work. Its content is prepared on the basis of classical tafsir and academic sources, listed on the Bibliography page.",
      "If you notice an error — especially in a verse, a reference, or a fact — please report it; content accuracy is the highest priority of this work. For feedback, use the site's feedback features or write to info@qurancodex.com.",
    ],
  },
];

export default function HakkindaRoute() {
  // Navbar yüksekliği dile/genişliğe göre değişiyor — ölç, tahmin etme.
  // 1024px'te İngilizce navbar 104px sabitini aşıyor ve başlığı örtüyordu.
  const navPad = useNavbarOffset(24, 104);
  const { language } = useLanguage();
  const isEn = language === 'en';

  return (
    // ÜST PADDING 64 -> 104px (2026-08-13). Navbar `position: fixed` ve alt
    // kenarı 82px'te; sayfa içeriği 64px'ten başlıyordu, yani eyebrow satırı
    // 18px navbar'ın ALTINDA kalıyordu. Görsel olarak fark edilmiyordu çünkü
    // orada tıklanabilir bir şey yoktu; "← Anasayfa" eklenince Playwright
    // tıklamayı navbar'ın yuttuğunu gösterdi. Bu ÖNCEDEN VAR OLAN bir hataydı.
    <div style={{ minHeight: 'calc(100vh - 54px)', background: COLORS.cosmicBlack, padding: `${navPad}px 0 96px` }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 20px' }}>
        {/* Header */}
        <header style={{ marginBottom: '48px' }}>
          {/* Eyebrow + "← Anasayfa" (2026-08-13). Tool sayfalarında bu buton
              ToolHeader içinde zaten vardı; bu sayfa ToolHeader kullanmadığı
              için yoktu — site geneliyle tutarsızdı. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              {isEn ? 'About & Methodology' : 'Hakkında & Metodoloji'}
            </div>
            <span style={{ flex: 1 }} />
            <HomeLinkPill language={language} />
          </div>
          <h2 style={{ fontFamily: FONTS.display, color: COLORS.offWhite, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.75rem)', margin: '0 0 18px', lineHeight: 1.15 }}>
            {isEn ? 'About QuranCodex' : 'QuranCodex Hakkında'}
          </h2>
          <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '68ch' }}>
            {isEn
              ? 'Its purpose, epistemic stance, sources, and limits — stated openly.'
              : 'Amacı, epistemik duruşu, kaynakları ve sınırları — açıkça.'}
          </p>
          {/* Son güncelleme tarihi — LAST_UPDATED sabitinden (dosya başında).
              CLAUDE.md §13.28-benzeri kural: her push'ta en son push gününe
              güncellenir (bkz. CLAUDE.md "Hakkında sayfası güncelleme tarihi"). */}
          <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.78rem', opacity: 0.65, margin: '14px 0 0' }}>
            {isEn ? `Last updated: ${LAST_UPDATED_EN}` : `Son güncelleme: ${LAST_UPDATED_TR}`}
          </p>

          {/* Kardeş sayfa geçişi (2026-08-13). Kaynakça bağlantısı sayfada
              zaten vardı ama y=1530px'te (sayfanın %64'ü) gövde metninin
              içinde gömülüydü — pratikte görünmüyordu. Başlığın altına alındı;
              aşağıdaki satır içi atıf da yerinde duruyor. */}
          <div style={{ marginTop: '26px' }}>
            <SiblingPageLink
              href={`/${language}/kaynakca`}
              labelTr="Kaynakça"
              labelEn="Bibliography"
              language={language}
            />
          </div>
        </header>

        {SECTIONS.map((s) => (
          <section
            key={s.id}
            style={{
              ...GLASS_CARD,
              padding: '28px 28px 24px',
              marginBottom: '20px',
              borderColor: s.star ? `${COLORS.gold}55` : GLASS_CARD.borderColor,
              background: s.star ? `${COLORS.gold}0d` : GLASS_CARD.background,
            }}
          >
            <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px', opacity: s.star ? 1 : 0.85 }}>
              {isEn ? s.eyebrowEn : s.eyebrowTr}
            </div>
            <h3 style={{ fontFamily: FONTS.display, color: COLORS.offWhite, fontWeight: 700, fontSize: 'clamp(1.3rem, 2.4vw, 1.6rem)', margin: '0 0 16px', lineHeight: 1.25 }}>
              {isEn ? s.titleEn : s.titleTr}
            </h3>

            {(isEn ? s.bodyEn : s.bodyTr)?.map((p, i) => (
              <p key={i} style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '1rem', lineHeight: 1.8, margin: '0 0 14px' }}>
                {p}
              </p>
            ))}

            {(isEn ? s.listEn : s.listTr) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
                {(isEn ? s.listEn : s.listTr).map(([label, val], i) => (
                  <div key={i}>
                    <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>{label}</div>
                    <div style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.98rem', lineHeight: 1.7 }}>{val}</div>
                  </div>
                ))}
              </div>
            )}

            {s.linkHref && (
              <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.98rem', lineHeight: 1.7, margin: '18px 0 0' }}>
                {isEn ? s.afterEn : s.afterTr}
                <a href={`/${language}${s.linkHref}`} style={{ color: COLORS.gold, borderBottom: `1px dashed ${COLORS.gold}55`, textDecoration: 'none' }}>
                  {isEn ? s.linkLabelEn : s.linkLabelTr}
                </a>.
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

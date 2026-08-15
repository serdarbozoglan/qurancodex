'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';
import ParticleBackground from './ParticleBackground';
import Link from 'next/link';

export default function Hero() {
  const { t, language } = useLanguage();
  const reduced = useReducedMotion();

  // SSR-safe mobile detection (§16.6) — initial false, hydrate post-mount.
  // Particle count is throttled on mobile for battery + scroll smoothness (W21-P7).
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── Cinematic intro — tek seferlik (sessionStorage ile) ──────────────────
  // İlk girişte: Bismillah glow pulse + light sweep + Arapça letter reveal
  // Sonraki ziyaretlerde (geri scroll, navigation): mevcut basit fade-up.
  // Reduced-motion'da da kapalı — accessibility.
  const [showIntro, setShowIntro] = useState(false);
  useEffect(() => {
    if (reduced) return;
    try {
      const seen = sessionStorage.getItem('qcHeroIntroSeen');
      if (!seen) {
        setShowIntro(true);
        sessionStorage.setItem('qcHeroIntroSeen', '1');
      }
    } catch (e) { /* sessionStorage erişimi engellenmişse sade fade-up göster */ }
  }, [reduced]);

  // Helper: spread onto a motion element. When reduced-motion is active,
  // mounts at final state with zero duration — choreography collapses cleanly.
  const entrance = (initial, animate, transition) =>
    reduced
      ? { initial: false, transition: { duration: 0 } }
      : { initial, animate, transition };

  // Anchor verse text — Alak 96:1-2 ayrı ayet, mobile'da her birini ayrı satırda
  // göstermek için ayrı tutuluyor (random wrap yerine semantik line break).
  // Desktop'ta tek satırda ' · ' ile birleşik render olur.
  const verse1Ar = 'اِقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ';
  const verse2Ar = 'خَلَقَ الْاِنْسَانَ مِنْ عَلَقٍ';
  const verse1Chars = [...verse1Ar];
  const verse2Chars = [...verse2Ar];

  // Chevron tıklanınca sahne 2'ye smooth scroll (scroll edenlerin de doğal
  // olarak ineceği yer). 2026-06-16 iki-sahne refactor.
  const scrollToScene2 = () => {
    document.getElementById('hero-scene-2')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-cosmic-black"
    >
      {/* Auditor #3 (2026-07-22) — Nihai (tur 3):
          Hero özel = mihrap ritüeli. Kur'ânî yıldız motifi zaten sitewide
          atmosfer (P1 grain + P2 candlelight + P3 watermark) ile karşılanıyor;
          Hero'da noktalar mihrap sakinliğini "startup starfield"e çeviriyor.
          Nihai: %100 glyph — sadece semantic mukattaa harfleri.
          Sayım: 26 desktop (14 harf setinden zengin varyans) / 16 mobile.
          Glyph opacity + twinkle ayrıca ParticleBackground.jsx'te dial-up
          (harfler artık hep görünür, sadece hafif parıldar). */}
      <ParticleBackground
        particleCount={isMobile ? 16 : 26}
        glyphRatio={1}
      />

      {/* Slow-rotating Islamic pattern overlay — felt, not seen */}
      <div className="absolute inset-0 islamic-pattern-bg opacity-[0.04] animate-rotate-slow origin-center" />

      {/* Centered radial glow — keeps the eye drawn to title */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,165,116,0.06)_0%,transparent_65%)]" />

      {/* Lower-center warm halo — adds depth beneath the CTA, evokes a quiet
          horizon line. Static (no rotation) so it reads as ground, not motion. */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '55%',
          background:
            'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(212,165,116,0.08) 0%, rgba(212,165,116,0.025) 38%, transparent 70%)',
        }}
      />

      {/* ═══ SAHNE 1 — Reverence ═══════════════════════════════════════════
          Kutsal kelime nefes alır: bismillah + Alak ayeti + çeviri + referans.
          Sayfanın açılış vurgusu site adıyla ("görünmeyen mimari") rezonans
          kurar; başlık/CTA aşağıdaki sahne 2'ye iner. Animated chevron alt
          tarafta hem tıklanabilir hem scroll-cue rolü oynar. */}
      <div
        id="hero-scene-1"
        className="relative z-10 flex flex-col items-center justify-center px-6"
        // 100svh — tam viewport, peek yok. 92svh denendi (2026-06-16) ama
        // mobile'da sahne 2 title'ının ("KUR'AN-I K...") üst kısmı sızıp
        // truncation/bug izlenimi veriyordu. Chevron tek başına yeterli
        // scroll-davet (40px SVG + bounce + büyük DEVAM text).
        style={{ minHeight: '100svh' }}
      >
        <div className="text-center max-w-4xl mx-auto w-full">

        {/* Bismillah ornament — cinematic intro (showIntro ? yazılma açılışı : sade).
            Reverence sinyali; meta-discovery framing'i bozmadan ekler.
            2026-08-13: glow nabzı ve ışık süpürmesi kaldırıldı; yerine
            metnin kendisinin sağdan sola belirmesi geldi. Gerekçe aşağıda. */}
        <motion.div className="mq-box"
          dir="rtl"
          lang="ar"
          aria-label="Bismillāh"
          style={{
            position: 'relative',
            display: 'inline-block',
            fontFamily: FONTS.bismillah,
            fontSize: isMobile ? '1.8rem' : '2.6rem',
            color: COLORS.gold,
            lineHeight: 1,
            // Sahne 1 flex-center: marginTop sadece Navbar visual compensation.
            // Mobile'da chevron'a yer bırakmak için kısaltıldı.
            '--mt-d': '60px', '--mt-m': '24px',
            '--mb-d': '52px', '--mb-m': '24px',
          }}
          initial={reduced ? false : (showIntro ? { opacity: 0, scale: 0.94 } : { opacity: 0, y: 12 })}
          animate={reduced ? false : (showIntro
            ? {
                opacity: 0.85,
                scale: 1,
                // 2026-08-13 — NABIZ KALDIRILDI. Öncesinde üç kareli bir
                // textShadow dizisiydi: besmele 2,2 saniye boyunca parlayıp
                // sönüyordu. GPT-5.4: "Harflerin parlayıp sönmesi kutsal metni
                // 'loading screen' estetiğine sokar." Giriş belirmesi kalıyor,
                // nefes alma efekti gidiyor — tek sabit değer.
                textShadow: `0 0 24px ${COLORS.gold}30`,
              }
            : { opacity: 0.85, y: 0, textShadow: `0 0 22px ${COLORS.gold}28` })}
          transition={reduced
            ? { duration: 0 }
            : (showIntro
              ? { duration: 1.6, delay: 0.3, ease: 'easeOut' }
              : { duration: 1.1, delay: 0.15, ease: 'easeOut' })}
        >
          {/* ─── Yazılma açılışı (2026-08-13) ──────────────────────────────
              ÖNCESİ: besmelenin ÜZERİNDEN geçen `mixBlendMode: screen`
              parlaklık bandı vardı. Yorumu "kalem ucundan harf doğar hissi"
              diyordu ama yaptığı iş bu değildi — harfler zaten oradaydı,
              üstlerinden bir parıltı geçiyordu. Yani niyet "yazı", çıktı
              "parıltı"ydı. Üzerinden geçen shimmer bandı ayrıca yükleme
              iskeletlerinin ve parlayan CTA butonlarının deyimi; ﷽ üzerine
              uygulanınca o kelime dağarcığı ödünç alınıyordu.

              ŞİMDİ: glyph'in KENDİSİ sağdan sola beliriyor — Arapçanın
              yazılma yönü. Metnin üstüne yeni bir ışık kaynağı eklenmiyor;
              metin var oluyor. Hemen altındaki Alak 96:1 zaten harf harf
              beliriyordu; ikisi artık aynı şeyi söylüyor: metin yazılıyor.

              Maske mekaniği (ilk denemem YANLIŞTI, kare kare ölçünce görüldü:
              %25 ve %50'de glyph zaten tamamen görünüyordu):
              mask 300% geniş, geçiş %33 → %67 arasında.
              `background-position` formülü offset = (1 − S)·X olduğu için
              S=3'te element, maskenin [2X/3, (1+2X)/3] aralığını görür:
                X=0   → [0, 0.33]  tamamı şeffaf  → glyph GİZLİ
                X=0.5 → [0.33, 0.67] geçiş        → sağ yarı görünür
                X=1   → [0.67, 1]  tamamı opak    → glyph TAM
              Yani görünür alan sağ kenardan başlayıp sola büyüyor.
              `reduced` veya `showIntro` yoksa maske hiç uygulanmaz. */}
          {showIntro && !reduced ? (
            <motion.span
              style={{
                display: 'inline-block',
                WebkitMaskImage: 'linear-gradient(90deg, transparent 33%, #000 67%)',
                maskImage: 'linear-gradient(90deg, transparent 33%, #000 67%)',
                WebkitMaskSize: '300% 100%',
                maskSize: '300% 100%',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
              }}
              initial={{ WebkitMaskPosition: '0% 0%', maskPosition: '0% 0%' }}
              animate={{ WebkitMaskPosition: '100% 0%', maskPosition: '100% 0%' }}
              transition={{ duration: 1.9, delay: 0.9, ease: [0.32, 0.72, 0, 1] }}
            >
              ﷽
            </motion.span>
          ) : (
            '﷽'
          )}
        </motion.div>

        {/* Anchor verse — Alak 96:1 (Kur'an'ın ilk inen vahyi: "Oku!").
            Site CTA "Kur'an'ı Oku" ile doğrudan rezonans + "Yaratan Rabbi"
            kavramı Conclusion köprüsünün ("Yaratıcıyı tanıyın") temelini atar. */}
        {/* Anchor verse — showIntro'da char-by-char RTL letter reveal (kalem yazıyor hissi).
            Aksi takdirde sade tek seferde fade-up. */}
        <motion.p
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: FONTS.quran,
            fontSize: isMobile ? 'clamp(1.5rem, 6.6vw, 2.1rem)' : 'clamp(1.6rem, 3.4vw, 2.5rem)',
            color: COLORS.gold,
            lineHeight: 2.1,
            margin: '0 auto 24px',
            maxWidth: '920px',
            // 2026-08-13 — dekoratif glow kaldırıldı (bkz. PortalCard notu).
          }}
          {...(showIntro && !reduced
            ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
            : entrance({ opacity: 0, y: 16 }, { opacity: 1, y: 0 }, { duration: 1.0, delay: 0.45 }))}
        >
          {showIntro && !reduced ? (
            <>
              {verse1Chars.map((c, i) => (
                <motion.span
                  key={`v1-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.05, delay: 1.9 + i * 0.022 }}
                >
                  {c}
                </motion.span>
              ))}
              {isMobile ? (
                <br />
              ) : (
                <motion.span
                  key="sep"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.05, delay: 1.9 + verse1Chars.length * 0.022 }}
                >
                  {' · '}
                </motion.span>
              )}
              {verse2Chars.map((c, i) => (
                <motion.span
                  key={`v2-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.05, delay: 1.9 + (verse1Chars.length + (isMobile ? 0 : 1) + i) * 0.022 }}
                >
                  {c}
                </motion.span>
              ))}
            </>
          ) : (
            <>
              {verse1Ar}
              {isMobile ? <br /> : ' · '}
              {verse2Ar}
            </>
          )}
        </motion.p>

        <motion.p
          style={{
            color: 'rgba(232,230,227,0.92)',
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontSize: isMobile ? '1.1rem' : 'clamp(1.05rem, 1.85vw, 1.3rem)',
            lineHeight: 1.7,
            margin: '0 auto 10px',
            maxWidth: '740px',
          }}
          {...entrance(
            { opacity: 0, y: 12 },
            { opacity: 0.92, y: 0 },
            { duration: 0.9, delay: showIntro ? 3.1 : 0.7 }
          )}
        >
          &quot;{language === 'tr'
            ? 'Yaratan Rabbinin adıyla oku. O, insanı bir alaktan yarattı.'
            : 'Read in the name of your Lord who created. He created man from a clinging clot.'}&quot;
        </motion.p>

        <motion.p
          style={{
            color: COLORS.silver,
            fontFamily: FONTS.body,
            fontSize: isMobile ? '0.72rem' : '0.84rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            margin: '0 0 36px',
            // .65 → 3.79, AA altı. Ölçülen eşik: silver .75.
            opacity: 0.78,
          }}
          {...entrance(
            { opacity: 0 },
            { opacity: 0.78 },
            { duration: 0.7, delay: showIntro ? 3.5 : 0.85 }
          )}
        >
          — {language === 'tr' ? 'Alak 96:1-2 · İlk İnen Ayetler' : 'al-ʿAlaq 96:1-2 · The First Revealed Verses'}
        </motion.p>

        {/* Konumlandırma satırı (2026-08-13).
            Ölçüm: 1440×900 ilk ekranda <h1> GÖRÜNMÜYOR — "KUR'AN-I KERİM'İN
            GÖRÜNMEYEN MİMARİSİ" DOM'da var ama hero-scene-1/2 içinde, yani
            ancak kaydırınca geliyor. Açılış cesur ve güzel; fakat ilk gelen
            ziyaretçi sitenin ne olduğunu ilk ekranda öğrenemiyordu.
            Bismillah + âyet + çeviri hiyerarşisini bozmamak için bir başlık
            değil, âyetin altında duran sessiz tek satır olarak eklendi. */}
        <motion.p
          style={{
            fontFamily: FONTS.body,
            fontSize: 'clamp(0.72rem, 1.5vw, 0.8rem)',
            fontWeight: 400,
            color: COLORS.silver,
            letterSpacing: '0.06em',
            lineHeight: 1.7,
            maxWidth: '540px',
            margin: '-22px auto 34px',
            // .55 → 3.02, AA'nın çok altı. Ölçülen eşik: silver .75.
            opacity: 0.78,
          }}
          {...entrance(
            { opacity: 0 },
            { opacity: 0.78 },
            { duration: 0.8, delay: showIntro ? 3.9 : 1.05 }
          )}
        >
          {language === 'tr'
            ? "Kur'an'ın dilsel, sayısal ve yapısal mimarisi — 6.236 âyet, interaktif görsellerle."
            : "The linguistic, numerical and structural architecture of the Qur'an — 6,236 verses, explored interactively."}
        </motion.p>

        {/* Mobil CTA — navbar "Kur'an'ı Oku" mobilde hamburger'da gizli olduğu
            için hero'da 2 net aksiyon (GPT-5.2 review A3). Desktop'ta chevron
            scroll-cue yeterli; butonlar yalnız mobilde. Tap hedefi ≥44px. */}
        {isMobile && (
          <motion.div
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              margin: '4px 0 0',
            }}
            {...entrance(
              { opacity: 0, y: 8 },
              { opacity: 1, y: 0 },
              { duration: 0.7, delay: showIntro ? 3.7 : 1.0 }
            )}
          >
            <Link
              href={`/${language}/oku`}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '44px', padding: '11px 20px',
                background: `${COLORS.gold}1c`,
                border: `1px solid ${COLORS.gold}66`,
                borderRadius: '999px',
                color: COLORS.gold,
                fontFamily: FONTS.body, fontSize: '0.86rem', fontWeight: 600,
                letterSpacing: '0.03em', textDecoration: 'none',
              }}
            >
              {language === 'tr' ? "Kur'an'ı Oku" : 'Read the Qur’an'}
            </Link>
            <button
              onClick={scrollToScene2}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '44px', padding: '11px 20px',
                background: 'transparent',
                border: `1px solid ${COLORS.gold}2e`,
                borderRadius: '999px',
                color: COLORS.offWhite,
                fontFamily: FONTS.body, fontSize: '0.86rem', fontWeight: 600,
                letterSpacing: '0.03em', cursor: 'pointer',
              }}
            >
              {language === 'tr' ? 'Keşfe Başla' : 'Start Exploring'}
            </button>
          </motion.div>
        )}

        </div>

        {/* Animated chevron — hem tıklanabilir buton hem scroll-cue.
            Sahne 2'ye smooth scroll yapar.
            ─ Centering pattern: dış wrapper `left:0; right:0; flex justify-center`
              (translateX(-50%) bazı browser/safe-area kombinasyonlarında shift
              veriyordu; bu pattern bulletproof).
            ─ Wrapper pointer-events-none, button pointer-events-auto: tüm bottom
              şerit tıklanabilir olmasın diye.
            ─ Bottom: iOS safe-area-inset-bottom + 28px ile home indicator/Safari
              toolbar arkasında kalmaz. */}
        <div
          className="dsp-flex"
          style={{
            position: 'absolute',
            bottom: isMobile ? 'calc(24px + env(safe-area-inset-bottom, 0px))' : '40px',
            left: 0,
            right: 0,
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <motion.button
            onClick={scrollToScene2}
            aria-label={language === 'tr' ? 'Aşağıya in — site neyi açıyor?' : 'Continue down — what this site opens'}
            style={{
              pointerEvents: 'auto',
              background: 'transparent',
              border: 'none',
              color: COLORS.gold,
              cursor: 'pointer',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
            {...entrance(
              { opacity: 0, y: -8 },
              { opacity: 0.88, y: 0 },
              { duration: 0.9, delay: showIntro ? 4.0 : 1.4 }
            )}
            whileHover={reduced ? undefined : { opacity: 1, scale: 1.1 }}
            whileTap={reduced ? undefined : { scale: 0.95 }}
          >
            <span
              style={{
                fontFamily: FONTS.body,
                fontSize: '0.7rem',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                opacity: 0.82,
                marginBottom: '4px',
              }}
            >
              {language === 'tr' ? 'Devam' : 'More'}
            </span>
            {/* aria-hidden: butonun metni ("DEVAM") zaten adı veriyor.
                NOT: `<motion.svg>` — codemod yalnız `<svg` arıyordu ve bunu
                kaçırmıştı; sitedeki iki `motion.svg`'den biri buydu. */}
            <motion.svg
              aria-hidden="true"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={reduced ? undefined : { y: [0, 8, 0] }}
              transition={reduced ? undefined : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path d="M6 9l6 6 6-6" />
            </motion.svg>
          </motion.button>
        </div>
      </div>

      {/* ═══ SAHNE 2 — Meta-discovery ═════════════════════════════════════
          Site neyi açıyor: başlık + alt-başlık + 3 paragraf giriş + "İlk
          Kapıyı Aç" CTA. Sahne 1'den scroll edilince veya chevron'a tıklayınca
          ulaşılır. Hareketler whileInView ile tetiklenir (sessionStorage'tan
          bağımsız — her ziyarette yeniden canlı görünüm). */}
      <div
        id="hero-scene-2"
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pb-16"
      >
        <div className="text-center max-w-4xl mx-auto">

        {/* Filigree divider — sahne 2'nin açılış eşiği */}
        <motion.div
          aria-hidden="true"
          style={{
            width: '160px',
            height: '1px',
            background: `linear-gradient(to right, transparent, ${COLORS.gold}70, transparent)`,
            margin: '0 auto 36px',
          }}
          initial={reduced ? false : { scaleX: 0, opacity: 0 }}
          whileInView={reduced ? undefined : { scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={reduced ? { duration: 0 } : { duration: 0.9, delay: 0.05 }}
        />

        {/* Title — softened a notch (lg: 7xl → 6xl) and looser leading,
            so the headline invites rather than declares.

            Auditor #5 (2026-07-21): H1 arkasına manuscript cadre/kartuş.
            Klasik Islamic ilüminasyon: 4 köşede altın kartuş marker'ı +
            H1 arkasında hafif altın-tint dikdörtgen zemin. mihrap ritüelini
            bozmayacak kadar subtle (opacity 5%). */}
        <div style={{ position: 'relative', display: 'inline-block', padding: '18px 32px', marginBottom: '24px' }}>
          {/* Cadre zemin — çok soluk altın tint dikdörtgen */}
          <motion.div
            aria-hidden="true"
            initial={reduced ? false : { opacity: 0 }}
            whileInView={reduced ? undefined : { opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={reduced ? { duration: 0 } : { duration: 1.6, delay: 0.3, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 85% 70% at 50% 50%, rgba(212, 165, 116, 0.045), transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          {/* 4 köşe kartuş marker'ı — Islamic manuscript ilüminasyon */}
          {[
            { top: 0, left: 0, rotate: 0 },
            { top: 0, right: 0, rotate: 90 },
            { bottom: 0, right: 0, rotate: 180 },
            { bottom: 0, left: 0, rotate: 270 },
          ].map((pos, i) => (
            <motion.svg
              key={i}
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              initial={reduced ? false : { opacity: 0, scale: 0.6 }}
              whileInView={reduced ? undefined : { opacity: 0.55, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={reduced ? { duration: 0 } : { duration: 0.8, delay: 0.5 + i * 0.06, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                ...pos,
                transform: `rotate(${pos.rotate}deg)`,
                pointerEvents: 'none',
              }}
            >
              <path
                d="M2 8 L2 2 L8 2 M2 2 L5 5"
                fill="none"
                stroke="rgba(212, 165, 116, 0.55)"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
            </motion.svg>
          ))}
          <motion.h1
            className="font-display text-4xl sm:text-5xl md:text-[3.25rem] lg:text-6xl font-black text-off-white leading-[1.15] tracking-[-0.015em] sm:tracking-tight"
            style={{ position: 'relative', margin: 0 }}
            initial={reduced ? false : { opacity: 0, y: 40 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={reduced ? { duration: 0 } : { duration: 1.2, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {t('hero.title')}
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          className="font-display text-gold text-lg sm:text-xl md:text-2xl mb-4 italic tracking-wide"
          initial={reduced ? false : { opacity: 0, y: 25 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={reduced ? { duration: 0 } : { duration: 0.9, delay: 0.4 }}
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Decorative line */}
        <motion.div
          className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6"
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={reduced ? undefined : { scaleX: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={reduced ? { duration: 0 } : { duration: 0.8, delay: 0.6 }}
        />

        {/* Description — 3-paragraph narrative. Rendered as separate blocks
            so paragraph spacing is controlled (tighter than line-height*2). */}
        <motion.div
          className="max-w-2xl mx-auto mb-10 font-body tracking-[0.01em]"
          style={{
            color: 'rgba(232,230,227,0.78)',
            fontSize: 'clamp(0.95rem, 1.6vw, 1.0625rem)',
            lineHeight: 1.7,
          }}
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={reduced ? { duration: 0 } : { duration: 0.9, delay: 0.75 }}
        >
          {t('hero.description').split('\n\n').map((para, i, arr) => (
            <p key={i} style={{ margin: i === arr.length - 1 ? 0 : '0 0 0.7em' }}>
              {para}
            </p>
          ))}
        </motion.div>

        {/* Single CTA — "Kur'an'ı Oku" lives in the Navbar, so the Hero
            keeps only the primary discovery action. */}
        <motion.div
          className="flex items-center justify-center"
          initial={reduced ? false : { opacity: 0, y: 10 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={reduced ? { duration: 0 } : { duration: 0.8, delay: 1.0 }}
        >
          <motion.button
            onClick={() =>
              document.getElementById('six-gates')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="btn-primary-gold font-body font-semibold text-sm uppercase cursor-pointer"
            style={{
              padding: 'clamp(13px, 1.5vw, 15px) clamp(44px, 7vw, 68px)',
              letterSpacing: '0.18em',
              boxShadow: `0 0 28px 4px ${COLORS.btnGoldGlow15}`,
              transition: 'all 200ms ease',
            }}
            whileHover={reduced ? undefined : { scale: 1.04, boxShadow: `0 0 56px 14px ${COLORS.btnGoldGlow25}` }}
            whileTap={reduced ? undefined : { scale: 0.97 }}
          >
            {t('hero.cta')}
          </motion.button>
        </motion.div>
        </div>
      </div>
    </section>
  );
}

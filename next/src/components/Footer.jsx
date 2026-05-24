'use client';

import Link from 'next/link';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

const SITEMAP_LINKS = {
  tr: {
    atlas: {
      label: 'Atlas',
      items: [
        { href: '/atlas/kissa',      text: "Kıssa Atlası — peygamber kıssaları" },
        { href: '/atlas/peygamber',  text: "Peygamberler Atlası — 25 nebi, kronoloji" },
        { href: '/atlas/kavim',      text: "Kavimler Atlası — Âd, Semûd, Sebe'" },
        { href: '/atlas/mesel',      text: "Mesel Atlası — 50 sembolik anlatı" },
        { href: '/atlas/doga',       text: "Doğa Atlası — bulut, yağmur, dağ" },
      ],
    },
    graf: {
      label: 'Graf & Veri',
      items: [
        { href: '/graf/ayet',        text: "Ayet Grafiği — 6236 ayet 3D haritası" },
        { href: '/graf/kavram',      text: "Kavram Grafiği — tövbe, sabır, iman" },
        { href: '/graf/kelime-isi',  text: "Kelime Isı Haritası — yoğunluk analizi" },
        { href: '/graf/diyalog',     text: "Diyalog Ağı — Kur'an'daki konuşmalar" },
        { href: '/graf/zaman',       text: "Nüzul Kronolojisi — 23 yıllık vahiy" },
      ],
    },
    arac: {
      label: 'Araçlar',
      items: [
        { href: '/arac/dualar',       text: "Kur'an'dan Dualar koleksiyonu" },
        { href: '/arac/yeminler',     text: "Kur'an'ın Yeminleri — kasem yapıları" },
        { href: '/arac/wow',          text: "Şaşırtıcı Olgular — bilim & ayet" },
        { href: '/arac/esma-frekans', text: "Esmâ'ül-Hüsnâ Frekansı" },
        { href: '/arac/tum-araclar',  text: "Tüm Araçlar — kapsamlı katalog" },
      ],
    },
    sureler: {
      label: 'Popüler Sureler',
      items: [
        { href: '/oku/1',   text: "Fâtiha Suresi'ni oku (Sure 1)" },
        { href: '/oku/2',   text: "Bakara Suresi'ni oku (Sure 2)" },
        { href: '/oku/36',  text: "Yâ-Sîn Suresi'ni oku (Sure 36)" },
        { href: '/oku/55',  text: "Rahmân Suresi'ni oku (Sure 55)" },
        { href: '/oku/67',  text: "Mülk Suresi'ni oku (Sure 67)" },
        { href: '/oku/112', text: "İhlâs Suresi'ni oku (Sure 112)" },
      ],
    },
  },
  en: {
    atlas: {
      label: 'Atlas',
      items: [
        { href: '/atlas/kissa',      text: "Story Atlas — prophet narratives" },
        { href: '/atlas/peygamber',  text: "Prophet Atlas — 25 prophets, timeline" },
        { href: '/atlas/kavim',      text: "Tribes Atlas — Ad, Thamud, Saba'" },
        { href: '/atlas/mesel',      text: "Parable Atlas — 50 symbolic motifs" },
        { href: '/atlas/doga',       text: "Nature Atlas — cloud, rain, mountain" },
      ],
    },
    graf: {
      label: 'Graph & Data',
      items: [
        { href: '/graf/ayet',        text: "Verse Graph — 6236 verses in 3D" },
        { href: '/graf/kavram',      text: "Concept Graph — repentance, patience, faith" },
        { href: '/graf/kelime-isi',  text: "Word Heatmap — density analysis" },
        { href: '/graf/diyalog',     text: "Dialogue Network — Quranic conversations" },
        { href: '/graf/zaman',       text: "Revelation Timeline — 23-year arc" },
      ],
    },
    arac: {
      label: 'Tools',
      items: [
        { href: '/arac/dualar',       text: "Quranic Prayers collection" },
        { href: '/arac/yeminler',     text: "Quranic Oaths — qasam structures" },
        { href: '/arac/wow',          text: "Wow Facts — science & verses" },
        { href: '/arac/esma-frekans', text: "Names of Allah Frequency" },
        { href: '/arac/tum-araclar',  text: "All Tools — full catalog" },
      ],
    },
    sureler: {
      label: 'Popular Surahs',
      items: [
        { href: '/oku/1',   text: "Read Surah Al-Fatiha (Surah 1)" },
        { href: '/oku/2',   text: "Read Surah Al-Baqara (Surah 2)" },
        { href: '/oku/36',  text: "Read Surah Ya-Sin (Surah 36)" },
        { href: '/oku/55',  text: "Read Surah Ar-Rahman (Surah 55)" },
        { href: '/oku/67',  text: "Read Surah Al-Mulk (Surah 67)" },
        { href: '/oku/112', text: "Read Surah Al-Ikhlas (Surah 112)" },
      ],
    },
  },
};

export default function Footer() {
  const { t, language } = useLanguage();
  const sources = t('footer.sources');
  const links = SITEMAP_LINKS[language] || SITEMAP_LINKS.tr;
  const exploreHeading = language === 'tr' ? 'Sayfaları Keşfet' : 'Explore Pages';

  return (
    <footer className="relative bg-cosmic-black border-t border-white/5 py-16 px-6">
      {/* Gold gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Title & methodology — footer-scale (not section H2). Methodology
            paragraph uses Hero baseline body color (offWhite/78) instead of
            silver, so footer reads warm rather than cool-gray. */}
        <div className="text-center mb-12">
          <h3 className="font-display text-gold text-xl mb-4">
            {t('footer.title')}
          </h3>
          <p
            className="max-w-2xl mx-auto"
            style={{
              color: COLORS.offWhiteAlpha78,
              fontFamily: FONTS.body,
              fontSize: '0.9rem',
              lineHeight: 1.7,
              letterSpacing: '0.01em',
            }}
          >
            {t('footer.methodology')}
          </p>
        </div>

        {/* Internal links — Faz 7.8 */}
        <nav aria-label={exploreHeading} className="glass-card p-8 mb-12">
          <h4 className="text-off-white font-body font-semibold mb-6 text-xs uppercase tracking-[0.2em]">
            {exploreHeading}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {['atlas', 'graf', 'arac', 'sureler'].map((key) => {
              const col = links[key];
              return (
                <div key={key}>
                  <h5 className="text-gold font-body font-semibold mb-3 text-xs uppercase tracking-[0.15em]">
                    {col.label}
                  </h5>
                  <ul className="space-y-2 text-silver text-sm leading-relaxed">
                    {col.items.map((item, i) => (
                      <li key={i}>
                        <Link
                          href={`/${language}${item.href}`}
                          className="hover:text-gold transition-colors"
                        >
                          {item.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Sources */}
        <div className="glass-card p-8 mb-12">
          <h4 className="text-off-white font-body font-semibold mb-4 text-xs uppercase tracking-[0.2em]">
            {t('footer.sourcesTitle')}
          </h4>
          <ul className="text-silver text-sm space-y-2 leading-relaxed columns-1 md:columns-2 gap-8">
            {Array.isArray(sources) &&
              sources.map((source, i) => {
                const name = typeof source === 'object' ? source.name : source;
                const section = typeof source === 'object' ? source.section : null;
                const link = typeof source === 'object' ? source.link : null;
                return (
                  <li key={i} className="flex items-start gap-2 break-inside-avoid mb-2">
                    <span className="text-gold/60 mt-0.5 shrink-0">•</span>
                    <span>
                      {link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-gold transition-colors"
                        >
                          {name}
                        </a>
                      ) : (
                        name
                      )}
                      {section && (
                        <span className="text-silver/75 text-xs ml-1.5">· {section}</span>
                      )}
                      {source.note && (
                        <span className="block text-silver/75 text-xs italic mt-0.5 leading-relaxed">
                          ⚠ {source.note}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
          </ul>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-silver/75 text-xs">
          <p>© 2026 — {t('footer.copyright')}</p>
          <div className="flex flex-col items-center gap-1">
            <span className="text-silver/80 text-xs">qurancodex.com</span>
            <a
              href="mailto:info@qurancodex.com"
              className="text-silver/60 hover:text-gold transition-colors text-xs"
            >
              info@qurancodex.com
            </a>
          </div>
          <p className="font-arabic text-sm text-gold/30" dir="rtl" lang="ar"
            style={{ fontFamily: FONTS.quran }}>
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
        </div>
      </div>
    </footer>
  );
}

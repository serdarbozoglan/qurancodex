// ─── Alanına Göre Keşfet — disiplin kayıt defteri ────────────────────────────
// "Alanına Göre Keşfet" navigasyon katmanının tek kaynağı. Her disiplin, SİTEDE
// VAR OLAN araç/içeriği gruplayan bir KEŞİF KAPISIDIR — yeni bir Kur'anî iddia
// taşımaz. Blurb'lar bilinçli olarak "şu temaları İŞLEYEN araçlar" biçimindedir
// (araç koleksiyonunu betimler), "Kur'an şunu söyler" türü bir iddia DEĞİL.
//
// ÇERÇEVE (memory feedback_quran_certainty_framing · CLAUDE.md §13.24/§13.35):
// Kur'an kesin hakikattir; disiplin ona bakış kapısıdır, hakemi değildir. Derin
// kaynaklı içerik (her disiplinin "çapa" bölümü) ayrı üretilir ve gpt-6-astra
// + §13.24/§13.34 denetiminden geçer. Taksonomi gerekçesi:
// tasks/disiplin-taksonomisi-v2.md.

export const DISCIPLINES = [
  { id: 'iman-itikad',     titleTr: 'İman & İtikad',          titleEn: 'Faith & Creed',
    blurbTr: 'Tevhid, melekler, âhiret ve Allah\'ın isimleri gibi itikadî temaları işleyen araçlar.',
    blurbEn: 'Tools on creedal themes: tawhīd, angels, the hereafter, and the names of God.' },
  { id: 'psikoloji-nefs',  titleTr: 'Psikoloji & Nefs',       titleEn: 'Psychology & the Self',
    blurbTr: 'İnsanın iç dünyası: nefs, kalp, korku, iyileşme ve fıtrat üzerine araçlar.',
    blurbEn: 'The inner human world: the self (nafs), heart, fear, healing, and fiṭra.',
    noteTr: 'Modern psikoloji ile Kur\'an\'ın insan/nefs tasavvuru özdeş değildir; tasnifler âyetlerden sistemleştirilmiştir.',
    noteEn: 'Modern psychology and the Qur\'an\'s conception of the self are not identical; the classifications are systematized from the verses.' },
  { id: 'ahlak-karakter',  titleTr: 'Ahlâk & Karakter',       titleEn: 'Ethics & Character',
    blurbTr: 'Erdem, niyet, sabır, şükür ve davranış üzerine araçlar.',
    blurbEn: 'Tools on virtue, intention, patience, gratitude, and conduct.' },
  { id: 'liderlik-yonetim',titleTr: 'Liderlik & Yönetim',      titleEn: 'Leadership & Governance',
    blurbTr: 'Şûra, emanet, adalet ve otorite temalarını işleyen içerikler.',
    blurbEn: 'Content on consultation (shūrā), trust (amāna), justice, and authority.' },
  { id: 'adalet-hukuk',    titleTr: 'Adalet & Hukuk',         titleEn: 'Justice & Law',
    blurbTr: 'Ahkâm, mîzan, şahitlik ve haklar üzerine araçlar.',
    blurbEn: 'Tools on rulings (aḥkām), the balance (mīzān), testimony, and rights.' },
  { id: 'sosyoloji-toplum',titleTr: 'Sosyoloji & Toplum',      titleEn: 'Society & Social Order',
    blurbTr: 'Kavimler, toplumsal değişim ve ilâhî sünnetler (sünnetullah) üzerine araçlar.',
    blurbEn: 'Tools on peoples, social change, and the divine patterns (sunnatullāh).' },
  { id: 'iktisat-ticaret', titleTr: 'İktisat & Ticaret Ahlâkı',titleEn: 'Economic & Trade Ethics',
    blurbTr: 'İnfak, zekât, ölçü-tartı, faiz ve emanet gibi iktisadî-ahlâkî temalar.',
    blurbEn: 'Economic-ethical themes: charity, zakāt, fair measure, usury, and trust.',
    noteTr: 'Normatif ilkelerden çağdaş bir finans ürünü veya yatırım tavsiyesi türetilmez.',
    noteEn: 'No contemporary financial product or investment advice is derived from the normative principles.' },
  { id: 'dil-belagat',     titleTr: 'Dil & Belâgat & Yapı',   titleEn: 'Language, Rhetoric & Structure',
    blurbTr: 'Belâgat, ritim, ses, yapı ve kelime örüntüleri üzerine araçlar.',
    blurbEn: 'Tools on rhetoric, rhythm, sound, structure, and word patterns.' },
  { id: 'kuran-ilimleri',  titleTr: 'Kur\'an İlimleri',       titleEn: 'Qur\'anic Sciences',
    blurbTr: 'Kıraat, sebeb-i nüzûl, nüzul kronolojisi ve münâsebât gibi yardımcı keşif alanları.',
    blurbEn: 'Auxiliary areas: readings (qirāʾāt), occasions of revelation, chronology, and coherence (munāsabāt).' },
  { id: 'tarih-medeniyet', titleTr: 'Tarih & Medeniyet',      titleEn: 'History & Civilization',
    blurbTr: 'Kıssalar, kronoloji ve metnin korunma tarihi üzerine araçlar.',
    blurbEn: 'Tools on narratives, chronology, and the preservation history of the text.' },
  { id: 'maneviyat-ibadet',titleTr: 'Maneviyat & İbadet',      titleEn: 'Spirituality & Worship',
    blurbTr: 'Namaz, oruç, zekât, hac, dua ve zikir gibi kulluk temaları.',
    blurbEn: 'Worship themes: prayer, fasting, zakāt, pilgrimage, supplication, and remembrance.' },
  { id: 'tabiat-afak',     titleTr: 'Tabiat & Âfâk Tefekkürü', titleEn: 'Nature & Cosmos Reflection',
    blurbTr: 'Göklerde ve yerde (âfâk) tefekküre açılan âyetler üzerine araçlar.',
    blurbEn: 'Tools on verses inviting reflection on the heavens and the earth (āfāq).',
    // §13.24 — bu disiplin için ZORUNLU üst-uyarı.
    warnTr: 'Bu başlık Kur\'an\'ı bir bilim kitabı gibi sunmaz; bilimsel bulgular tefekküre vesiledir, Kur\'an\'ın hakemi değildir. Âyet–teori eşleştirmesi yapılmaz.',
    warnEn: 'This area does not present the Qur\'an as a science textbook; scientific findings are occasions for reflection, not arbiters of the Qur\'an. No verse-to-theory matching is made.' },
];

export const DISCIPLINE_BY_ID = Object.fromEntries(DISCIPLINES.map(d => [d.id, d]));

// Corpus Quran (Leeds) POS tag → TR/EN labels
// Source: https://corpus.quran.com/documentation/morphology.jsp
// Compound tags use '+' separator (e.g., "P+PRON" = preposition + pronoun).

const POS_LABELS = {
  // Nouns
  N:    { tr: 'İsim',                  en: 'Noun' },
  PN:   { tr: 'Özel İsim',             en: 'Proper Noun' },
  ADJ:  { tr: 'Sıfat',                 en: 'Adjective' },
  IMPN: { tr: 'Emir/Tepki İsmi',       en: 'Imperative Noun' },
  // Pronouns
  PRON: { tr: 'Zamir',                 en: 'Pronoun' },
  DEM:  { tr: 'İşaret Zamiri',         en: 'Demonstrative Pronoun' },
  REL:  { tr: 'İlgi Zamiri (mevsûl)',  en: 'Relative Pronoun' },
  // Verbs
  V:    { tr: 'Fiil',                  en: 'Verb' },
  // Particles / Function words
  P:    { tr: 'Edat (cer harfi)',      en: 'Preposition' },
  T:    { tr: 'Zaman Zarfı',           en: 'Time Adverb' },
  LOC:  { tr: 'Mekân Zarfı',           en: 'Location Adverb' },
  CONJ: { tr: 'Bağlaç',                en: 'Conjunction' },
  SUB:  { tr: 'Bağlaç (yan cümle)',    en: 'Subordinating Conjunction' },
  ACC:  { tr: 'İnne ve Benzeri',       en: 'Accusative Particle' },
  AMD:  { tr: 'Yemin Edatı',           en: 'Amendment Particle' },
  ANS:  { tr: 'Cevap Edatı',           en: 'Answer Particle' },
  AVR:  { tr: 'Çağırma Edatı',         en: 'Aversion Particle' },
  CAUS: { tr: 'Sebep Edatı',           en: 'Causal Particle' },
  CERT: { tr: 'Tahkik Edatı',          en: 'Certainty Particle' },
  CIRC: { tr: 'Hâl Edatı',             en: 'Circumstantial Particle' },
  COM:  { tr: 'Birliktelik Edatı',     en: 'Comitative Particle' },
  COND: { tr: 'Şart Edatı',            en: 'Conditional Particle' },
  EQ:   { tr: 'Denklik Edatı',         en: 'Equalisation Particle' },
  EXH:  { tr: 'Teşvik Edatı',          en: 'Exhortation Particle' },
  EXL:  { tr: 'Açıklama Edatı',        en: 'Explanation Particle' },
  EXP:  { tr: 'Açıklayıcı Edat',       en: 'Expository Particle' },
  FUT:  { tr: 'Gelecek Zaman Edatı',   en: 'Future Particle' },
  IMPV: { tr: 'Emir Edatı',            en: 'Imperative Particle' },
  INC:  { tr: 'İstifham Cevabı',       en: 'Inceptive Particle' },
  INL:  { tr: 'Mukattaa Harfi',        en: 'Quranic Initials' },
  INT:  { tr: 'Tahkik Edatı',          en: 'Particle of Interpretation' },
  INTG: { tr: 'Soru Edatı',            en: 'Interrogative Particle' },
  NEG:  { tr: 'Olumsuzluk Edatı',      en: 'Negative Particle' },
  PREV: { tr: 'Önleme Edatı',          en: 'Preventive Particle' },
  PRO:  { tr: 'Yasaklama Edatı',       en: 'Prohibition Particle' },
  REM:  { tr: 'Atıf Edatı',            en: 'Resumption Particle' },
  RES:  { tr: 'Hasr Edatı',            en: 'Restriction Particle' },
  RET:  { tr: 'Geri Dönüş Edatı',      en: 'Retraction Particle' },
  RSLT: { tr: 'Sonuç Edatı',           en: 'Result Particle' },
  SUP:  { tr: 'İlâve Edatı',           en: 'Supplemental Particle' },
  SUR:  { tr: 'Şaşırtma Edatı',        en: 'Surprise Particle' },
  VOC:  { tr: 'Nida Edatı',            en: 'Vocative Particle' },
};

/**
 * Convert a POS tag (possibly compound, e.g., "P+PRON") to TR/EN label.
 * @param {string} pos - POS tag from Corpus
 * @param {'tr'|'en'} lang
 * @returns {string}
 */
export function posLabel(pos, lang = 'tr') {
  if (!pos) return '';
  // Compound tags joined with +
  return pos.split('+')
    .map(p => POS_LABELS[p.trim()]?.[lang] ?? p)
    .join(' + ');
}

export default POS_LABELS;

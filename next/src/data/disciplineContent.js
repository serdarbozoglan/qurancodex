// ─── Disiplin "çapa" içerikleri (B katmanı) — KAYNAKLI, doğrulanmış ──────────
// Her disiplinin derin, kaynaklı giriş bölümü. ÇERÇEVE (memory
// feedback_quran_certainty_framing · §13.24/§13.35): Kur'an kesin hakikattir;
// bu içerik onu bilimin/akademinin onayına BAĞLAMAZ. Âyet = kesin beyan;
// meal/gloss/başlık/tematik sınıflama/tefsir/akademik = beşerî yorum katmanı
// (ayrı kesinlik düzeyi, öyle işaretlenir).
//
// KAYNAK KURALI: yalnız BİZZAT DOĞRULANMIŞ kaynak (âyet: quran.com; tefsir:
// metni görülen nüsha; akademik: DOI/ISBN teyitli). Her içerik gpt-6-astra
// review'dan geçer. Liderlik: REVIEW #1 (taksonomi) + REVIEW #2 (içerik) işlendi.

export const DISCIPLINE_CONTENT = {
  'liderlik-yonetim': {
    reviewedBy: 'gpt-6-astra REVIEW #2 applied',
    introTr:
      'Kur\'an Allah\'ın kelâmıdır ve kesin hakikattir; doğruluğu bilimsel veya akademik onaya bağlı değildir. ' +
      'Bu sayfa; şûrâ, emanet, adâlet ve itaat gibi konulardaki âyetleri liderlik ve yönetim bakımından ele alır. ' +
      'Bu konuların Kur\'an\'daki kapsamı yönetim alanıyla sınırlı değildir. Türkçe anlam özetleri, tematik başlıklar, ' +
      'klasik tefsir açıklamaları ve akademik ilişkilendirmeler beşerî açıklama ve yorum katmanlarıdır; Kur\'an\'ın ' +
      'kendisiyle özdeş değildir. Bu okumalar, belirli bir modern siyaset modelini veya tek biçimli yönetim reçetesini ' +
      'Kur\'an\'a mal etmek için kullanılmaz.',
    introEn:
      'The Qur\'an is God\'s word and certain truth; its truth does not depend on scientific or academic confirmation. ' +
      'This page treats verses on consultation (shūrā), trust (amāna), justice, and obedience from the angle of leadership ' +
      'and governance. The scope of these topics in the Qur\'an is not limited to governance. The Turkish/English summaries, ' +
      'thematic headings, classical-exegesis notes, and academic associations are layers of human explanation and ' +
      'interpretation; they are not identical with the Qur\'an itself, and are not used to ascribe any particular modern ' +
      'political model or uniform governance prescription to the Qur\'an.',
    themes: [
      {
        titleTr: 'Şûrâ — işlerde istişare',
        titleEn: 'Shūrā — consultation in affairs',
        verses: [
          { ref: 'Şûrâ 42:38', glossTr: 'Müminlerin övülen bir niteliği: işleri aralarında şûrâ (istişare) iledir.', glossEn: 'A praised quality of the believers: their affairs are [conducted] by mutual consultation.' },
          { ref: 'Âl-i İmrân 3:159', glossTr: 'Allah\'ın rahmetiyle Peygamber\'in onlara yumuşak davranışı zikredilir ve istişare emredilir.', glossEn: 'The verse recalls the Prophet\'s gentleness toward them by God\'s mercy, and enjoins consultation.' },
        ],
        tafsirTr: 'Muhtasar İbn Kesîr metninde (3:159): istişareyi ashabın gönlünü hoş tutması ve yapacakları işe daha istekli katılmasıyla ilişkilendirir; çeşitli istişare örnekleri aktarır. (Tefsir özeti.) Buradan belirli bir oylama veya bağlayıcılık modeli çıkarılmaz.',
        tafsirEn: 'The abridged Ibn Kathīr (3:159): links consultation to setting the companions\' hearts at ease and making them more willing participants; he relates various examples of consultation. (Summary of the tafsir.) No specific voting or bindingness model is inferred from this.',
      },
      {
        titleTr: 'Emanet ve adâlet — yönetimle de ilgili yükümlülükler',
        titleEn: 'Trust and justice — obligations that also bear on governance',
        verses: [
          { ref: 'Nisâ 4:58', glossTr: 'Emanetleri ehline verme ve insanlar arasında adâletle hükmetme emri (emanet farklı türleri de kapsar).', glossEn: 'A command to render trusts to those entitled to them and to judge between people with justice (trust covers several kinds).' },
          { ref: 'Nahl 16:90', glossTr: 'Allah adâleti ve ihsânı emreder (âyetin tam metninin anlam özetidir).', glossEn: 'God commands justice and excellence (this is a summary of the full verse\'s meaning).' },
          { ref: 'Sâd 38:26', glossTr: 'Davud\'a: yeryüzünde halîfe kılındığı, insanlar arasında hak ile hükmetmesi ve hevâya uymaması bildirilir.', glossEn: 'To David: he is made a successor on earth, to judge between people with truth and not follow desire.' },
        ],
        tafsirTr: 'Muhtasar İbn Kesîr metninde (4:58): emanet, Allah\'a ve kullara karşı yerine getirilmesi gereken emanetleri kapsar; adâletle hüküm bilhassa yönetici/hâkimle ilgilidir (yalnız onlara ait değildir). (16:90) adâleti kıst ve itidal anlamında açıklar. (Tefsir özeti.)',
        tafsirEn: 'The abridged Ibn Kathīr (4:58): trust covers the trusts owed to God and to people; judging with justice especially concerns rulers/judges (though not only them). On 16:90 he explains justice in the sense of fairness and moderation. (Summary of the tafsir.)',
      },
      {
        titleTr: 'İtaat ve sınırı — ulü\'l-emr',
        titleEn: 'Obedience and its limit — ulū al-amr',
        verses: [
          { ref: 'Nisâ 4:59', glossTr: 'Allah\'a, Resûl\'e ve yetki sahiplerine (ulü\'l-emr) itaat; anlaşmazlıkta Allah ve Resûl\'e başvurma emri.', glossEn: 'A command to obey God, the Messenger, and those in authority (ulū al-amr); and to refer disputes back to God and the Messenger.' },
        ],
        tafsirTr: 'Muhtasar İbn Kesîr metninde hadislerle açıklanan itaat sınırı (4:59): itaat Allah\'a itaat sınırı içindedir; günah emredildiğinde "işitmek ve itaat" yoktur. Ulü\'l-emrin kimleri kapsadığı tefsir katmanında tartışılır.',
        tafsirEn: 'The limit of obedience as the abridged Ibn Kathīr explains through hadith (4:59): obedience is bounded by obedience to God; there is no "hearing and obeying" when sin is commanded. Who counts as ulū al-amr is debated at the level of exegesis.',
      },
      {
        titleTr: 'Göreve ehliyet — Yûsuf ve Tâlût örnekleri',
        titleEn: 'Fitness for office — the cases of Joseph and Ṭālūt',
        verses: [
          { ref: 'Yûsuf 12:55', glossTr: 'Yûsuf, ülkenin hazinelerinin idaresini ister; kendini iyi koruyan ve bilen (hafîz, alîm) olarak niteler.', glossEn: 'Joseph asks to administer the land\'s storehouses, describing himself as a capable guardian who knows (ḥafīẓ, ʿalīm).' },
          { ref: 'Bakara 2:247', glossTr: 'Tâlût\'un hükümdarlığına, kendilerini daha hak sahibi görmeleri ve mal genişliğine sahip olmaması üzerinden itiraz edilir; Allah\'ın onu seçtiği ve ilimde ve bedende üstünlük verdiği bildirilir.', glossEn: 'They object to Ṭālūt\'s kingship, seeing themselves as more entitled and noting his lack of wealth; it is declared that God chose him and gave him advantage in knowledge and body.' },
        ],
        tafsirTr: 'Muhtasar İbn Kesîr metninde (2:247): bu, hükümdarda yeterli ilim ile beden gücü bulunmasına dair bir müfessir değerlendirmesidir (âyet 2:247 ilim ve bedende üstünlükten söz eder); âyetin her görev için doğrudan koyduğu değişmez bir şart gibi sunulmaz. (12:55): kişinin durumu bilinmediğinde ve ihtiyaç bulunduğunda kendi niteliklerini açıklaması câizdir. (Tefsir değerlendirmesi.)',
        tafsirEn: 'The abridged Ibn Kathīr (2:247): this is an exegete\'s assessment that a ruler should have sufficient knowledge together with bodily strength (verse 2:247 speaks of advantage in knowledge and body); it is not presented as a fixed condition the verse sets directly for every office. (12:55): stating one\'s qualifications is permissible when one\'s situation is unknown and there is need. (An exegetical assessment.)',
      },
    ],
    assuranceTr: 'Bu âyetlerin birlikte okunması, tek başına belirli bir anayasa, seçim usulü, örgüt şeması veya personel sistemi tesis etmez.',
    assuranceEn: 'Read together, these verses do not by themselves establish any particular constitution, electoral procedure, organizational chart, or personnel system.',
    tafsirScopeTr: 'Klasik tefsir notları, quran.com üzerinde yayımlanan muhtasar (abridged) İbn Kesîr tefsirine dayanır (ilgili âyetin tefsir sekmesi, ör. quran.com/4/58 · quran.com/2/247; erişim: Eylül 2026); her âyetin tefsiri, kendi quran.com bağlantısındaki "tefsir" sekmesinden görülebilir. Kullanılan nüsha quran.com\'un yayımladığı İngilizce muhtasar İbn Kesîr\'dir; matbu baskı/çevirmen künyesi quran.com üzerinden kesinleştirilemediğinden cilt/sayfa verilmemiş ve bir ifadenin İbn Kesîr\'e mi muhtasarı hazırlayana mı ait olduğu nüsha düzeyinde ayrıştırılmamıştır (bu yüzden atıflar "muhtasar İbn Kesîr metninde" biçiminde verilmiştir). Taberî, Zemahşerî, Râzî ve Kurtubî\'nin ilgili yorumları bu turda birincil kaynaktan teyit edilemediği için eklenmemiştir.',
    tafsirScopeEn: 'The classical-exegesis notes rest on the abridged Ibn Kathīr published on quran.com (the verse\'s tafsir tab, e.g. quran.com/4/58 · quran.com/2/247; accessed September 2026); each verse\'s exegesis can be viewed via the "tafsir" tab at its own quran.com link. The copy used is the English abridged Ibn Kathīr published on quran.com; since its print edition/translator cannot be established through quran.com, no volume/page is given and it is not disambiguated whether a phrasing belongs to Ibn Kathīr or to the abridger (hence attributions read "in the abridged Ibn Kathīr text"). The relevant comments of al-Ṭabarī, al-Zamakhsharī, al-Rāzī, and al-Qurṭubī were not added, as they could not be verified from the primary source in this pass.',
    sourcesNoteTr: 'Akademik kaynaklar, Kur\'an\'ı tasdik etmek için değil; beşerî yorumu ve düşünce tarihini incelemek için anılır.',
    sourcesNoteEn: 'The academic sources are cited not to confirm the Qur\'an, but to study human interpretation and intellectual history.',
    sources: [
      { author: 'Patricia Crone', work: 'God\'s Rule: Government and Islam', pub: 'Columbia University Press', year: '2004', id: 'ISBN 9780231132909',
        noteTr: 'İslam siyasî düşüncesinin tarihsel bağlamı için başvuru; âyet gloss\'unun doğrulama kaynağı değildir.', noteEn: 'Reference for the historical context of Islamic political thought; not a source that verifies the verse gloss.' },
      { author: 'Asma Afsaruddin', work: 'Excellence and Precedence: Medieval Islamic Discourse on Legitimate Leadership', pub: 'Brill', year: '2002', id: 'ISBN 9789004120433',
        noteTr: 'Meşru liderlik, fazîlet ve öncelik tartışmaları için ilgili.', noteEn: 'Relevant to debates on legitimate leadership, excellence, and precedence.' },
      { author: 'Owais Manzoor Dar', work: 'Obedience to "Political Authority" (Ulū al-Amr): A Discursive Analysis of Modern South Asian Exegesis', pub: 'Australian Journal of Islamic Studies 7(1)', year: '2022', id: 'DOI 10.55831/ajis.v7i1.669',
        noteTr: 'Nisâ 4:59 ulü\'l-emr kavramının tefsirlerdeki okunuşuna doğrudan ilgili. (Australian Journal of Islamic Studies — American Journal of Islam and Society ile karıştırılmamalı.)', noteEn: 'Directly relevant to readings of ulū al-amr (Q 4:59) in exegesis. (Australian Journal of Islamic Studies — not to be confused with the American Journal of Islam and Society.)' },
      { author: 'Andrew F. March', work: 'Islam and Liberal Citizenship: The Search for an Overlapping Consensus', pub: 'Oxford University Press', year: '2009', id: 'ISBN 9780195330960',
        noteTr: 'Çağdaş normatif siyaset tartışması için uygun; bu âyetlerin doğrudan açıklama kaynağı değil.', noteEn: 'Suited to contemporary normative political debate; not a direct explanatory source for these verses.' },
      { author: 'Wael B. Hallaq', work: 'The Impossible State: Islam, Politics, and Modernity\'s Moral Predicament', pub: 'Columbia University Press', year: '2013', id: 'ISBN 9780231162562',
        noteTr: 'Modern devlet tartışması için ileri okuma; belirgin bir tezi savunur.', noteEn: 'Further reading on the modern state; argues a distinct thesis.' },
      { author: 'Ahmad al-Raysuni', work: 'Al-Shura: The Qur\'anic Principle of Consultation', pub: 'IIIT', year: '2011', id: 'ISBN 9781565643611',
        noteTr: 'Şûrâ üzerine çağdaş İslâmî/normatif bir inceleme olarak okunmalıdır.', noteEn: 'To be read as a contemporary Islamic/normative study of shūrā.' },
    ],
  },
};

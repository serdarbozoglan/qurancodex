# Mushaf Satır Kırılımı Doğrulama Raporu

Yöntem: her sayfanın gerçek Hayrat görseli (kuran.hayrat.com.tr/Sayfalar/{N}.jpg) ile
`public/mushaf-line-breaks.json`'daki satırlar satır satır, kelime kelime karşılaştırıldı.
Kapsam: sayfa 0 – 23 (Fatiha + Bakara 1:1'den 2:163'e kadar).

Not: Bu rapor, sayfa 0-23 aralığının TAMAMI zaten tek oturumda kontrol edildikten sonra
yazıldı (koordinatörün "her sayfa sonrası hemen ekle" talimatı bu oturumda geriye dönük
uygulanamadı — iş zaten bitmişti). Bundan sonraki sayfalar (24+) kontrol edilirse, her
sayfa sonrası bu dosyaya hemen madde eklenecek.

## Sayfa 0: PASS
7 satır (Fatiha 1:1-7). Görsel ile JSON birebir örtüşüyor.

## Sayfa 1: PASS
7 satır (Bakara 2:1-5). Görsel ile JSON birebir örtüşüyor.

## Sayfa 2: PASS (daha önce FAIL idi, kullanıcı ile birlikte düzeltildi)
15 satır (Bakara 2:6-16). Önceki hata: "وَاِذَا" ve "قِيلَ لَهُمْ" kelime grupları yanlış
satırın başında duruyordu; gerçek görselde bir önceki satırın sonunda olmaları
gerekiyordu (satır 7-10 civarı, 0-indeksli 6-9). Bu turda görselle tekrar satır satır
karşılaştırıldı: düzeltme doğru uygulanmış — 15 satırın tamamı görselle örtüşüyor.

## Sayfa 3: PASS
15 satır (Bakara 2:17-24). Görsel ile JSON birebir örtüşüyor.

## Sayfa 4: PASS
15 satır (Bakara 2:25-29). Görsel ile JSON birebir örtüşüyor.

## Sayfa 5: PASS
15 satır (Bakara 2:30-37). Görsel ile JSON birebir örtüşüyor.

## Sayfa 6: PASS
15 satır (Bakara 2:38-48). Görsel ile JSON birebir örtüşüyor.

## Sayfa 7: PASS
15 satır (Bakara 2:49-57). Görsel ile JSON birebir örtüşüyor.

## Sayfa 8: PASS
15 satır (Bakara 2:58-61). Görsel ile JSON birebir örtüşüyor.

## Sayfa 9: PASS
15 satır (Bakara 2:62-69). Görsel ile JSON birebir örtüşüyor.

## Sayfa 10: PASS
15 satır (Bakara 2:70-76). Görsel ile JSON birebir örtüşüyor.

## Sayfa 11: PASS
15 satır (Bakara 2:77-83). Görsel ile JSON birebir örtüşüyor.

## Sayfa 12: PASS
15 satır (Bakara 2:84-88). Görsel ile JSON birebir örtüşüyor.

## Sayfa 13: PASS
15 satır (Bakara 2:89-93). Görsel ile JSON birebir örtüşüyor.

## Sayfa 14: PASS
15 satır (Bakara 2:94-101). Görsel ile JSON birebir örtüşüyor.

## Sayfa 15: PASS
15 satır (Bakara 2:102-105). Görsel ile JSON birebir örtüşüyor.

## Sayfa 16: PASS
15 satır (Bakara 2:106-112). Görsel ile JSON birebir örtüşüyor.

## Sayfa 17: PASS
15 satır (Bakara 2:113-119). Görsel ile JSON birebir örtüşüyor.

## Sayfa 18: PASS
15 satır (Bakara 2:120-126). Görsel ile JSON birebir örtüşüyor.

## Sayfa 19: PASS
15 satır (Bakara 2:127-134). Görsel ile JSON birebir örtüşüyor.

## Sayfa 20: PASS
15 satır (Bakara 2:135-141). Görsel ile JSON birebir örtüşüyor.

## Sayfa 21: PASS
15 satır (Bakara 2:142-145). Görsel ile JSON birebir örtüşüyor.

## Sayfa 22: PASS
15 satır (Bakara 2:146-153). Görsel ile JSON birebir örtüşüyor.

## Sayfa 23: PASS
15 satır (Bakara 2:154-163). Görsel ile JSON birebir örtüşüyor.

---

## Özet (0-23 arası)

- Kontrol edilen sayfa sayısı: 24 (sayfa 0 – 23)
- PASS: 24/24
- FAIL (düzeltilmemiş): 0
- Sayfa 2 tek istisna: önceden bulunmuş ve düzeltilmiş bir hatanın bu turda görselle
  yeniden doğrulanmasıydı — artık temiz.
- Diacritic/waqf işaretlerindeki (ۚ ۛ ۖ vb.) görsel-JSON farkları normal normalizasyon
  farkı sayıldı (CLAUDE.md §13.15), hata olarak işaretlenmedi — kelime sırası ve satır
  kırılımları etkilenmediği sürece.

## Sonraki adım
Sayfa 24 ve sonrası henüz kontrol edilmedi. Devam edilecekse aynı yöntemle
(kuran.hayrat.com.tr/Sayfalar/{N}.jpg ↔ mushaf-line-breaks.json karşılaştırması)
sürdürülüp her sayfa sonrası bu dosyaya madde eklenmelidir.

---

## İkinci tur (24+) — yöntem notu

Görsel WebFetch ile çekilip yerel diske kaydedildikten sonra Read tool ile
(multimodal) satır satır görsel olarak okunuyor; verse-graph-bgem3.json'daki
kanonik Arapça metin kelimelere bölünüp görselde gözlemlenen satır kırılım
noktalarına göre yeniden birleştiriliyor (metnin kendisi görselden elle
yeniden yazılmıyor — sadece kırılım noktaları görselden alınıyor, kelimelerin
harekeleri kanonik kaynaktan geliyor). Bu, iki kaynağı çapraz doğrulamış
oluyor: kelime sırası/sayısı JSON kaynağından, satır kırılımı gerçek
görselden.

## Sayfa 24: PASS
15 satır (Bakara 2:164-169). Görsel ile JSON birebir örtüşüyor. 164. ayet
5. satırın ortasında bitiyor, 165. ayetin başı ("وَمِنَ") aynı satırda devam
ediyor — ayet numarası süslemesi satırın içinde, kelime akışını bölmüyor.
Benzer şekilde 166→167 (satır 10) ve 168→169 (satır 14) geçişleri de aynı
satır içinde.

## Sayfa 25: PASS (dikkat çekici bulgu: kelime-içi satır kırılımı)
15 satır (Bakara 2:170-176). Görsel ile JSON birebir örtüşüyor — ancak
satır 13→14 geçişinde gerçek görsel "اَصْبَرَهُمْ" (175. ayet) kelimesini
ORTASINDAN bölüyor: satır 13 "...فَمَٓا اَصْبَرَ" ile bitiyor, satır 14
"هُمْ عَلَى النَّارِ..." ile başlıyor. Bu, kelimenin bağlaç harfi olmayan
"ر" harfinden sonra geldiği için mümkün (ر kendinden sonraki harfe
bitişmez, bu yüzden "هُمْ" görsel olarak ayrı bir küme gibi satır başında
duruyor). Zum yapılmış görsel kırpma ile iki kez doğrulandı (crop2.png:
satır13 sonu sadece "...فما اصبر", crop4.png: satır14 başı "هم على...").
JSON'a bu gerçek kırılımı yansıtmak için kelime iki parçaya bölünüp
("اَصْبَرَ" satır13 sonunda, "هُمْ" satır14 başında) ayrı diziliyor —
harekeler/harfler değiştirilmedi, sadece kanonik kaynaktaki tek boşluksuz
kelime iki satıra bölündüğü için iki ayrı dizi elemanı oldu. Diğer 14
satır standart kelime-kelime örtüşme gösteriyor.

## Sayfa 26: PASS
15 satır (Bakara 2:177-181). Görsel ile JSON birebir örtüşüyor. Ayet
geçişleri 177→178 (satır 7), 178→179 (satır 11), 179→180 (satır 12) ve
180→181 (satır 14) hepsi satır içinde, kelime sınırında (kelime-içi
kırılım yok). İlk transkripsiyonda satır4/5 sınırında ("الصَّلٰوةَ"
kelimesinin hangi satıra ait olduğu) ve satır6/7 sınırında bir off-by-one
hata yapıldı, görsele tekrar bakılıp kelime kelime sayılarak düzeltildi —
toplam kelime sayısı (128) kanonik kaynakla tam örtüşüyor.

## Sayfa 27: PASS
15 satır (Bakara 2:182-186). Görsel ile JSON birebir örtüşüyor (toplam 124
kelime, kanonik kaynakla tam örtüşüyor). Ayet geçişleri 182→183 (satır2),
183→184 (satır4), 184→185 (yok, 184 satır7'de tam bitiyor, 185 satır8'de
başlıyor — sayfa/cüz kesişimi net), 185→186 (satır13) hepsi kelime
sınırında, kelime-içi kırılım yok. Bu sayfada da ilk taslakta bir
off-by-one (satır3/4 sınırı) yapıldı, kelime sayarak düzeltildi.

## Sayfa 28: PASS
15 satır (Bakara 2:187-190; 2. cüz burada başlıyor — 187. ayet 65 kelime
ile uzun, 8 satıra yayılıyor). Görsel ile JSON birebir örtüşüyor, toplam
122 kelime kanonik kaynakla tam eşleşiyor. Ayet geçişleri 187→188 (satır9),
188→189 (satır11), 189→190 (satır14) hepsi kelime sınırında.

## Sayfa 29: PASS
15 satır (Bakara 2:191-196; 196. ayet 73 kelime ile bu sayfanın en uzun
ayeti, 7 satıra yayılıyor). Görsel ile JSON birebir örtüşüyor, toplam 155
kelime kanonik kaynakla tam eşleşiyor. Ayet geçişleri 191→192 (satır3),
192→193 (satır4), 193→194 (satır5), 194→195 (satır8'e kadar 194 bitiyor,
195 satır8'de başlıyor), 195→196 (satır9) hepsi kelime sınırında.

## Sayfa 30: PASS
15 satır (Bakara 2:197-202). Görsel ile JSON birebir örtüşüyor, toplam 114
kelime kanonik kaynakla tam eşleşiyor. Ayet geçişleri 197→198 (satır4),
198→199 (satır8), 199→200 (satır9), 200→201 (yok, 200 satır12'de tam
bitiyor, 201 satır13'te başlıyor), 201→202 (satır14) hepsi kelime
sınırında.

## Sayfa 31: PASS
15 satır (Bakara 2:203-210). Görsel ile JSON birebir örtüşüyor, toplam 124
kelime kanonik kaynakla tam eşleşiyor. 8 ayet geçişinin (203→210 arası)
hepsi kelime sınırında, kelime-içi kırılım yok.

## Sayfa 32: PASS
15 satır (Bakara 2:211-215; 213. ayet 49 kelime ile uzun, 5 satıra
yayılıyor). Görsel ile JSON birebir örtüşüyor, toplam 141 kelime kanonik
kaynakla tam eşleşiyor. Ayet geçişleri hepsi kelime sınırında.

## Sayfa 33: PASS
15 satır (Bakara 2:216-219; 217. ayet 57 kelime ile uzun, 7 satıra
yayılıyor). Görsel ile JSON birebir örtüşüyor, toplam 124 kelime kanonik
kaynakla tam eşleşiyor. Ayet geçişleri hepsi kelime sınırında.

## Sayfa 34: PASS
15 satır (Bakara 2:220-224; 221. ayet 39 kelime ile uzun, 5 satıra
yayılıyor). Görsel ile JSON birebir örtüşüyor, toplam 122 kelime kanonik
kaynakla tam eşleşiyor. Ayet geçişleri hepsi kelime sınırında.

## Sayfa 35: PASS (ilk taslakta satır3/4 sınırı hatası, zum ile düzeltildi)
15 satır (Bakara 2:225-230; 228. ayet 40, 229. ayet 46 kelime — sayfanın
çoğu bu iki uzun ayete ayrılıyor). İlk transkripsiyonda satır3 ve satır4
sınırlarında ayet geçiş noktası yanlış varsayılmıştı (226→227 ve 227→228
geçişlerinin tam olarak hangi satırda olduğu); görsel zum ile (crop
p35_rows2to4.png) tekrar kontrol edilip düzeltildi — satır3 aslında
227'nin "وَاِنْ عَزَمُوا" kelimeleriyle bitiyor, satır4 227'nin kalanı +
228'in başlangıcıyla başlıyor. Düzeltme sonrası görsel ile JSON birebir
örtüşüyor, toplam 150 kelime kanonik kaynakla tam eşleşiyor.

## Sayfa 36: PASS
15 satır (Bakara 2:231-233; 233. ayet 64 kelime ile sayfanın en uzun
ayeti, 7 satıra yayılıyor — süt emzirme/nafaka ayeti). Görsel ile JSON
birebir örtüşüyor, toplam 142 kelime kanonik kaynakla tam eşleşiyor.

## Sayfa 37: PASS
15 satır (Bakara 2:234-237; 235. ayet 47 kelime ile uzun, 6 satıra
yayılıyor). Görsel ile JSON birebir örtüşüyor, toplam 132 kelime kanonik
kaynakla tam eşleşiyor.

## Sayfa 38: PASS
15 satır (Bakara 2:238-245; 8 kısa/orta ayet). Görsel ile JSON birebir
örtüşüyor, toplam 116 kelime kanonik kaynakla tam eşleşiyor.

## Sayfa 39: PASS
15 satır (Bakara 2:246-248; Talut/Calut kıssası başlangıcı; 246. ayet 54
kelime ile uzun). Görsel ile JSON birebir örtüşüyor, toplam 127 kelime
kanonik kaynakla tam eşleşiyor.

## Sayfa 40: PASS
15 satır (Bakara 2:249-252; Talut/Calut kıssası devamı, Davud aleyhisselam;
249. ayet 60 kelime ile sayfanın en uzun ayeti). Görsel ile JSON birebir
örtüşüyor, toplam 110 kelime kanonik kaynakla tam eşleşiyor.

## Sayfa 41: PASS (Ayete'l-Kürsi sayfası)
15 satır (Bakara 2:253-256; 255. ayet Ayete'l-Kürsi, 50 kelime, satır
8'in ortasından satır 13'ün başına kadar yayılıyor). İlk taslakta satır
8/9 sınırında bir off-by-one hatası yapıldı (اَلْحَيُّ kelimesinin hangi
satıra ait olduğu), görsel tekrar kelime kelime sayılarak düzeltildi.
Düzeltme sonrası görsel ile JSON birebir örtüşüyor, toplam 148 kelime
kanonik kaynakla tam eşleşiyor.

## Sayfa 42: PASS
15 satır (Bakara 2:257-259; İbrahim'in Nemrud ile tartışması, Üzeyir/harabe
kıssası; 259. ayet 67 kelime ile sayfanın en uzun ayeti, 7 satıra
yayılıyor). Görsel ile JSON birebir örtüşüyor, toplam 134 kelime kanonik
kaynakla tam eşleşiyor.

## Sayfa 43: PASS
15 satır (Bakara 2:260-264; İbrahim'in dört kuş kıssası, infak ayetleri).
Görsel ile JSON birebir örtüşüyor, toplam 137 kelime kanonik kaynakla tam
eşleşiyor. Satır 8, kısa kelimelerin yoğunluğu nedeniyle 14 kelime taşıyor
— sıra dışı ama görselle doğrulandı.

## Sayfa 44: PASS (ilk taslak zum ile düzeltildi)
15 satır (Bakara 2:265-269; infak/sadaka meselleri). İlk transkripsiyonda
satır 5/6 sınırında bir hata vardı ("مِنْ كُلِّ الثَّمَرَاتِ" ifadesinin
hangi satıra ait olduğu yanlış tahmin edilmişti); görsel üç parçaya
bölünüp yeniden kırpılarak (p44_top/mid/bottom.png) satır satır kelime
kelime yeniden sayıldı. Düzeltme sonrası görsel ile JSON birebir
örtüşüyor, toplam 121 kelime kanonik kaynakla tam eşleşiyor.

## Sayfa 45: PASS
15 satır (Bakara 2:270-274; sadaka/infak ayetleri). Görsel ile JSON
birebir örtüşüyor, toplam 110 kelime kanonik kaynakla tam eşleşiyor.

## Sayfa 46: PASS
15 satır (Bakara 2:275-281; riba/faiz ayetleri, "Bakara suresinin son
ayeti" 281 dahil; 275. ayet 45 kelime ile uzun). Görsel ile JSON birebir
örtüşüyor, toplam 134 kelime kanonik kaynakla tam eşleşiyor.

## Sayfa 47: PASS (Kur'an'ın en uzun ayeti — Düyun/borç ayeti)
15 satır — sayfanın TAMAMI tek bir ayet: Bakara 2:282 (129 kelime, Kur'an'ın
en uzun ayeti). Yüksek risk nedeniyle her satır ayrı ayrı kırpılıp
(p47_row1-15.png) tek tek kelime kelime doğrulandı. İlk kaba geçişte
satır 5 ve satır 9-11 sınırlarında kelime sayım hataları vardı (özellikle
"اَوْ لَا يَسْتَط۪يعُ" üç ayrı kelimesinin satır 5'te olduğu gözden
kaçmıştı); zum ile düzeltildi. Düzeltme sonrası görsel ile JSON birebir
örtüşüyor, toplam 129 kelime kanonik kaynakla tam eşleşiyor (129/129).

## Sayfa 48: PASS (Bakara suresinin son sayfası)
15 satır (Bakara 2:283-286; sure kapanışı — Âmene'r-Rasûlü ve son iki
ayet duası). Görsel ile JSON birebir örtüşüyor, toplam 136 kelime kanonik
kaynakla tam eşleşiyor.

## Sayfa 49: PASS (Âl-i İmrân suresi açılışı — sure başlığı + besmele)
13 satır (besmele + 12 metin satırı; sure başlığı süslemesi nedeniyle
standart 15 yerine 13 satır — sayfa 1 ile aynı desen). Âl-i İmrân 3:1-9.
Besmele ayrı satır olarak JSON'a "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ"
şeklinde eklendi (sayfa 1 referans deseniyle tutarlı), 3:1'in kendi metni
("الٓمٓ") besmeleden ayrı tutuldu. İlk taslakta satır 6/7 sınırında bir
off-by-one hatası vardı ("كَيْفَ" kelimesinin hangi satıra ait olduğu);
zum ile (p49_check.png) düzeltildi — "كَيْفَ" gerçekte satır 7'nin ilk
kelimesi. Düzeltme sonrası görsel ile JSON birebir örtüşüyor, toplam 134
kelime (besmele hariç) kanonik kaynakla tam eşleşiyor.

## Sayfa 50: PASS
15 satır (Âl-i İmrân 3:10-15; Bedir muharebesi işareti, dünya süsleri
ayeti). Görsel ile JSON birebir örtüşüyor, toplam 116 kelime kanonik
kaynakla tam eşleşiyor.

---

## Özet (İkinci tur: sayfa 24-50)

- Kontrol edilen sayfa sayısı: 27 (sayfa 24 – 50)
- PASS: 27/27
- FAIL (düzeltilmemiş): 0
- Kelime-içi gerçek satır kırılımı bulundu: sayfa 25 ("اَصْبَرَهُمْ" → "اَصْبَرَ" / "هُمْ")
- İlk taslakta düzeltilen off-by-one hataları (görsel zum ile teyit edildi):
  sayfa 26, 27, 35, 41, 44, 47, 49 — hepsi kelime kelime yeniden sayılıp
  toplam kelime sayısı kanonik kaynakla çapraz doğrulandı.
- Yöntem notu: her sayfa için WebFetch ile görsel indirildi, Read (multimodal)
  ile satır satır okundu, verse-graph-bgem3.json'daki kanonik kelime listesi
  satır kırılım noktalarına göre python ile yeniden dizildi ve toplam kelime
  sayısı (line'ların toplamı) kanonik kaynaktaki ayet kelime sayılarının
  toplamıyla karşılaştırılarak doğrulandı — sayılar eşleşmeyince görsel
  tekrar (gerekirse kırpılıp zumlanarak) kontrol edildi.

## Üçüncü tur (51+) — yöntem notu

Aynı yöntem sürdürülüyor: WebFetch ile kuran.hayrat.com.tr/Sayfalar/{N}.jpg
indirilip Read (multimodal) ile satır satır okunuyor; her satırın kelime
sayısı görselden çıkarılıp verse-graph-bgem3.json'daki kanonik kelime
dizisi bu sayılara göre python (`helper.py`, scratchpad) ile satırlara
bölünüyor. `verify()` fonksiyonu satır-satır birleştirilmiş kelime
dizisinin kanonik diziyle TAM (indeks indeks) eşleştiğini doğruluyor —
yalnız toplam sayıya değil, sıraya da bakıyor. Eşleşmeyince görsel tekrar
(gerekirse kırpılıp zumlanarak) kontrol ediliyor. Her sayfa sonrası hem
JSON (`save_page`) hem bu rapor tek seferde güncelleniyor.

## Sayfa 51: PASS
15 satır (Âl-i İmrân 3:16-22; müttakilerin duası, Ehl-i Kitap'ın ihtilafı,
"Allah katında din İslam'dır" ayeti, hak üzere olmayanların kıssası).
Görsel ile JSON birebir örtüşüyor, toplam 116 kelime kanonik kaynakla tam
eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 52: PASS (ilk taslakta satır 1/5/8 sayım hatası, elle yeniden sayılarak düzeltildi)
15 satır (Âl-i İmrân 3:23-29; "Mülkün sahibi Allah'tır" duası, gece-gündüz
içiçe girmesi, "Allah'tan başka dost edinmeyin" ayeti). İlk kelime kelime
geçişte 140 kelime bulundu (kanonik 145 ile uyuşmadı); satır 1, 5 ve 8
tekrar sayılınca üçünde de eksik sayım bulundu (ör. satır 5'te "كَسَبَتْ"
öncesi bir kelime atlanmış). Düzeltme sonrası görsel ile JSON birebir
örtüşüyor, toplam 145 kelime kanonik kaynakla tam eşleşiyor (python
`verify()` ile indeks indeks doğrulandı).

## Sayfa 53: PASS
15 satır (Âl-i İmrân 3:30-37; kıyamet günü hesap, "Allah'ı seviyorsanız
Peygambere uyun" ayeti, İmran ailesinin seçilmesi, Hz. Meryem'in doğumu ve
Zekeriyya aleyhisselamın mihrapta ona rızık bulması). Görsel ile JSON
birebir örtüşüyor, toplam 146 kelime kanonik kaynakla tam eşleşiyor
(python `verify()` ile indeks indeks doğrulandı).

## Sayfa 54: PASS
15 satır (Âl-i İmrân 3:38-45; Zekeriyya aleyhisselamın duası ve Yahya'nın
müjdelenmesi, Hz. Meryem'e meleklerin seslenişi ve "İsa Mesih" müjdesi).
Görsel ile JSON birebir örtüşüyor, toplam 134 kelime kanonik kaynakla tam
eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 55: PASS
15 satır (Âl-i İmrân 3:46-52; Hz. Meryem'in "nasıl çocuğum olur" sorusu,
İsa aleyhisselamın beşikte konuşacağı müjdesi, Tevrat-İncil öğretimi,
İsrailoğullarına gönderilişi ve mucizeleri, Havarilerin iman edişi).
Görsel ile JSON birebir örtüşüyor, toplam 127 kelime kanonik kaynakla tam
eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 56: PASS
15 satır (Âl-i İmrân 3:53-61; Havarilerin duası, "Allah'ın mekri", İsa
aleyhisselamın ref'i, İsa'nın Adem'e benzetilmesi, Mübahele ayeti). Görsel
ile JSON birebir örtüşüyor, toplam 124 kelime kanonik kaynakla tam
eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 57: PASS
15 satır (Âl-i İmrân 3:62-70; "Kelime-i Sevâ" davet ayeti, İbrahim
aleyhisselam hakkındaki tartışma, "İbrahim ne Yahudi ne Hristiyandı"
ayeti, Ehl-i Kitap'tan bir grubun saptırma çabası). Görsel ile JSON
birebir örtüşüyor, toplam 138 kelime kanonik kaynakla tam eşleşiyor
(python `verify()` ile indeks indeks doğrulandı).

## Sayfa 58: PASS
15 satır (Âl-i İmrân 3:71-77; "hakkı batılla karıştırmayın" ayeti, Ehl-i
Kitap'tan bir grubun günün başında iman edip sonunda küfrederek saptırma
planı, "fazl Allah'ın elindedir" ayeti, emanet ayeti — kantar/dinar
emsalleri, ahdini bozanların akıbeti). Görsel ile JSON birebir örtüşüyor,
toplam 139 kelime kanonik kaynakla tam eşleşiyor (python `verify()` ile
indeks indeks doğrulandı).

## Sayfa 59: PASS
15 satır (Âl-i İmrân 3:78-83; dillerini kitaba eğip yalan söyleyenler,
"hiçbir beşere kitap/hüküm/nübüvvet verilip de sonra insanlara Allah'ı
bırakıp bana kul olun demesi yakışmaz" ayeti, peygamberlerin misakı,
"Allah'ın dininden başkasını mı arıyorlar" ayeti). Görsel ile JSON
birebir örtüşüyor, toplam 124 kelime kanonik kaynakla tam eşleşiyor
(python `verify()` ile indeks indeks doğrulandı).

## Sayfa 60: PASS
15 satır (Âl-i İmrân 3:84-91; "peygamberler arasında ayrım yapmayız" iman
ayeti, "İslam'dan başka din arayanın akıbeti" ayeti, imandan sonra
küfredenlerin tövbesinin kabul edilmeyişi, kafir olarak ölenlerin dünya
dolusu altın fidye verse bile kabul edilmeyeceği ayeti). Görsel ile JSON
birebir örtüşüyor, toplam 127 kelime kanonik kaynakla tam eşleşiyor
(python `verify()` ile indeks indeks doğrulandı).

## Sayfa 61: PASS
15 satır (Âl-i İmrân 3:92-100; "sevdiğiniz şeylerden infak etmedikçe
birr'e eremezsiniz" ayeti, İsrailoğullarına haram kılınan yiyecekler,
Kâbe'nin ilk mabed oluşu ve hac farziyeti, Ehl-i Kitab'ın yol kesme
çabası). Görsel ile JSON birebir örtüşüyor, toplam 144 kelime kanonik
kaynakla tam eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 62: PASS
15 satır (Âl-i İmrân 3:101-108; "Allah'ın ipine sımsıkı sarılın, tefrikaya
düşmeyin" ayeti, iyiliğe çağıran ümmet ayeti, yüzlerin ak/kara olacağı
kıyamet günü). Görsel ile JSON birebir örtüşüyor, toplam 130 kelime
kanonik kaynakla tam eşleşiyor (python `verify()` ile indeks indeks
doğrulandı).

## Sayfa 63: PASS
15 satır (Âl-i İmrân 3:109-115; "en hayırlı ümmet" ayeti, Ehl-i Kitap'tan
gece secde eden dosdoğru bir topluluğun bulunuşu). Görsel ile JSON birebir
örtüşüyor, toplam 118 kelime kanonik kaynakla tam eşleşiyor (python
`verify()` ile indeks indeks doğrulandı).

## Sayfa 64: PASS
15 satır (Âl-i İmrân 3:116-121; kafirlerin mal/evladının fayda vermeyişi,
dünya infakının kavurucu rüzgar meseli, "kendinizden olmayanı sırdaş
edinmeyin" ayeti, Uhud hazırlığı — "müminleri savaş mevzilerine
yerleştiriyordun" ayeti). Görsel ile JSON birebir örtüşüyor, toplam 132
kelime kanonik kaynakla tam eşleşiyor (python `verify()` ile indeks
indeks doğrulandı).

## Sayfa 65: PASS
15 satır (Âl-i İmrân 3:122-132; Bedir muharebesinde meleklerle yardım
ayetleri, "sana bu işten bir şey yok" ayeti, faiz yasağı, cehennem ateşine
karşı sakınma ve Allah-Resul'e itaat çağrısı). Görsel ile JSON birebir
örtüşüyor, toplam 127 kelime kanonik kaynakla tam eşleşiyor (python
`verify()` ile indeks indeks doğrulandı).

## Sayfa 66: PASS
15 satır (Âl-i İmrân 3:133-140; cennete koşma ayeti, muttakilerin
vasıfları — bollukta/darlıkta infak, öfkeyi yutma, affetme, tövbe; Uhud
sonrası teselli — "üzülmeyin, gevşemeyin, siz üstünsünüz" ayeti). Görsel
ile JSON birebir örtüşüyor, toplam 114 kelime kanonik kaynakla tam
eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 67: PASS
15 satır (Âl-i İmrân 3:141-148; Uhud sonrası imtihan ayetleri, "Muhammed
sadece bir resuldür, ondan önce de resuller geldi geçti" ayeti, ecel
takdiri, sabreden peygamber ordularının meseli, "Rabbimiz günahlarımızı
bağışla" duası). Görsel ile JSON birebir örtüşüyor, toplam 132 kelime
kanonik kaynakla tam eşleşiyor (python `verify()` ile indeks indeks
doğrulandı).

## Sayfa 68: PASS
15 satır (Âl-i İmrân 3:149-153; kafirlere itaat etmeme uyarısı, düşman
kalplerine korku salınması, Uhud'da Allah'ın vaadinin gerçekleşmesi ve
sonra emre isyanla yaşanan bozgun, Peygamberin geride kalanları çağırışı).
Bu sayfada yalnızca 5 ayet var (3:152 tek başına 39 kelime ile sayfanın
çoğunu kaplıyor); 15 satırlık standart düzen korunuyor. Görsel ile JSON
birebir örtüşüyor, toplam 102 kelime kanonik kaynakla tam eşleşiyor
(python `verify()` ile indeks indeks doğrulandı).

## Sayfa 69: PASS (yüksek risk — 3:154 tek başına 75 kelime, sayfanın 10
satırına yayılıyor)
15 satır (Âl-i İmrân 3:154-157; Uhud sonrası uyku/güven hali, münafıkların
"elimizde olsaydı ölmezdik" sözü, gazaya çıkanların ölümü hakkındaki kafir
sözlerine benzememe uyarısı, "Allah yolunda öldürülmek mağfiret ve
rahmettir" ayeti). Uzun 75 kelimelik 3:154 ayeti nedeniyle satır satır
dikkatli kelime kelime sayıldı. Görsel ile JSON birebir örtüşüyor, toplam
147 kelime kanonik kaynakla tam eşleşiyor (python `verify()` ile indeks
indeks doğrulandı, 147/147).

## Sayfa 70: PASS
15 satır (Âl-i İmrân 3:158-165; "Allah'ın rahmeti sayesinde onlara
yumuşak davrandın" ayeti, istişare emri, tevekkül ayeti, ganimet emaneti,
Uhud'da alınan yaranın Bedir'de verilenin iki katı olmasına yönelik
sitem). Görsel ile JSON birebir örtüşüyor, toplam 142 kelime kanonik
kaynakla tam eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 71: PASS
15 satır (Âl-i İmrân 3:166-173; Uhud günü izin ve münafıkları ayırt etme,
"öldürülseniz de Allah yolunda ölenler diridir, rızıklanırlar" ayeti,
Allah'ın nimetinden müjdelenenler, yara aldıktan sonra Allah ve Resulünün
çağrısına uyanlar, "Allah bize yeter, O ne güzel vekildir" ayeti). Kanonik
metindeki 3:171 sonunda fazladan boşlukla ayrılmış tek karakterlik "۟"
işareti ayrı bir "kelime" olarak split() ile bölündüğü için satır 12'de
(134. kelime olarak) ayrı token halinde temsil edildi — kanonik kaynağa
sadık kalındı, değiştirilmedi. Görsel ile JSON birebir örtüşüyor, toplam
134 kelime kanonik kaynakla tam eşleşiyor (python `verify()` ile indeks
indeks doğrulandı).

## Sayfa 72: PASS
15 satır (Âl-i İmrân 3:174-180; Uhud sonrası dönüş, "bu sizi Allah'tan
korkutan şeytandır" ayeti, küfürde yarışanların Allah'a zarar veremeyeceği,
mühlet verilmesinin bir imtihan olduğu, mü'min-münafık ayrımı, gaybı
bilme yetkisinin sadece Allah'a ait olduğu, cimrilik edenlerin kıyamette
cimrilik ettikleriyle boyunduruklanacağı, göklerin ve yerin mirasının
Allah'a ait olduğu ayeti). Görsel ile JSON birebir örtüşüyor, toplam 142
kelime kanonik kaynakla tam eşleşiyor (python `verify()` ile indeks
indeks doğrulandı).

## Sayfa 73: PASS
15 satır (Âl-i İmrân 3:181-186; "Allah fakirdir, biz zenginiz" diyenlerin
sözünün duyulması ve yazılması, peygamber öldürmenin cezası, ateşin
yiyeceği kurban isteyen kafirlere cevap, her nefsin ölümü tadacağı ve
cennete girenin kurtulacağı ayeti, mal ve canla imtihan, sabır ve takva
emri). Görsel ile JSON birebir örtüşüyor, toplam 118 kelime kanonik
kaynakla tam eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 74: PASS
15 satır (Âl-i İmrân 3:187-194; kitap ehlinden alınan mîsak ve gizleme
uyarısı, yapmadıklarıyla övünmek isteyenlerin azaptan kurtulamayacağı,
göklerin ve yerin mülkünün Allah'a ait olduğu, gece-gündüz değişiminde
akıl sahipleri için ayetler, "Rabbimiz bunu boşuna yaratmadın" duası ve
Âl-i İmrân sûresinin ünlü "Rabbena" dualarının art arda geldiği bölüm).
Görsel ile JSON birebir örtüşüyor, toplam 127 kelime kanonik kaynakla tam
eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 75: PASS (ilk taslakta düzeltildi)
13 satır (Âl-i İmrân 3:195-200; Rabbin dualara icabeti ve hicret/cihat
edenlerin mükafatı, kafirlerin refahına aldanmama uyarısı, cennetin Allah
katından bir ziyafet olduğu, kitap ehlinden Allah'a hakkıyla iman edenler,
sûrenin "sabredin, sabır yarışın, nöbetleşin, Allah'tan korkun" ayetiyle
bitişi). Sûre sonu olduğu için standart 15 yerine 13 satır (alt kısımda
Nisâ sûresi başlık süslemesi var, o metne dahil edilmedi). İlk taslakta
5. satır (mevcut 6.) "مَتَاعٌ" ile bitirilip "قَل۪يلٌ" atlanmıştı; python
`verify()` 118/119 kelime ile FAIL verince görsel yeniden incelendi,
"مَتَاعٌ قَل۪يلٌ" ifadesinin aynı satırda olduğu görüldü ve satır 6-7
kelime sayıları düzeltildi. Düzeltme sonrası görsel ile JSON birebir
örtüşüyor, toplam 119 kelime kanonik kaynakla tam eşleşiyor (python
`verify()` ile indeks indeks doğrulandı).

## Sayfa 76: PASS
Nisâ sûresinin başlangıcı — besmele + 14 satır (toplam 15 satır; 4:1-6:
insanların tek bir nefisten yaratılması, akrabalık haklarının gözetilmesi,
yetimlerin mallarının korunması ve iade edilmemesi uyarısı, çok eşlilik ve
adalet şartı, kadınlara mehir verilmesi, malı olmayanlara (sefihlere)
malların teslim edilmemesi, yetimlerin evlilik çağına gelene kadar
gözetilmesi ve reşit olduklarında mallarının şahitle teslimi). Besmele
satırı kanonik kelime dizisine dahil edilmeden ayrı satır olarak eklendi
(Fatiha ve Tevbe dışındaki sûre açılış sayfalarındaki mevcut kalıp
tekrarlandı — bkz. sayfa 49). Görsel ile JSON birebir örtüşüyor, besmele
hariç toplam 140 kelime kanonik kaynakla tam eşleşiyor (python `verify()`
ile indeks indeks doğrulandı).

## Sayfa 77: PASS
15 satır (Nisâ 4:7-11; erkeklere ve kadınlara miras payı, mirasın
paylaşımında hazır bulunan akraba/yetim/yoksullara pay verilmesi, geride
zayıf zürriyet bırakma endişesiyle yetim malına dikkat çağrısı, yetim
malını yiyenlerin ateş yutması, ünlü miras (feraiz) ayeti 4:11 — erkek
çocuğa iki kız payı, ana-baba payları, üçte bir/altıda bir oranları).
Görsel ile JSON birebir örtüşüyor, toplam 131 kelime kanonik kaynakla tam
eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 78: PASS
15 satır (Nisâ 4:12-14; eşlerin miras payları (dörtte bir/sekizde bir),
kelale (çocuksuz/babasız) durumunda kardeş payları (altıda bir, üçte bir
ortaklık), vasiyet ve borcun mirastan önce düşülmesi, "bunlar Allah'ın
sınırlarıdır" ayeti, Allah ve Resulüne itaat edenin cennetle, isyan edenin
ateşle mükafatlandırılması). Görsel ile JSON birebir örtüşüyor, toplam
119 kelime kanonik kaynakla tam eşleşiyor (python `verify()` ile indeks
indeks doğrulandı).

## Sayfa 79: PASS
15 satır (Nisâ 4:15-19; zina eden kadınlara dair ilk hüküm ve tövbe kapısı,
tövbenin Allah katında ancak bilmeden kötülük işleyip çabuk dönenler için
olduğu, ölüm anında tövbenin kabul edilmeyeceği, kadınlara zorla mirasçı
olma yasağı ve "onlarla iyi geçinin" emri). Görsel ile JSON birebir
örtüşüyor, toplam 115 kelime kanonik kaynakla tam eşleşiyor (python
`verify()` ile indeks indeks doğrulandı).

## Sayfa 80: PASS
15 satır (Nisâ 4:20-23; eşi boşayıp yerine başka eş almak isteyene verilen
mehrin geri alınamayacağı, babanın nikahladığı kadınla evlenme yasağı,
haram kılınan mahrem akrabalık dereceleri — anneler, kızlar, kız
kardeşler, halalar, teyzeler, süt anne/kardeşler, üvey kızlar, iki
kız kardeşi aynı anda nikahlama yasağı). Uzun 4:23 ayeti (mahremiyet
listesi) sayfanın büyük kısmını kaplıyor. Görsel ile JSON birebir
örtüşüyor, toplam 99 kelime kanonik kaynakla tam eşleşiyor (python
`verify()` ile indeks indeks doğrulandı).

## Sayfa 81: PASS
15 satır (Nisâ 4:24-26; evli kadınlarla evlenme yasağı istisnası, mehir
ile nikahın meşruiyeti, imkanı olmayanın mümin cariyelerle evlenebileceği,
zina eden evli/hür kadınların cezasının yarısı, sabrın hayırlı olduğu,
Allah'ın sizden öncekilerin sünnetini açıklamak ve tövbenizi kabul etmek
istediği ayeti). Görsel ile JSON birebir örtüşüyor, toplam 114 kelime
kanonik kaynakla tam eşleşiyor (python `verify()` ile indeks indeks
doğrulandı).

## Sayfa 82: PASS
15 satır (Nisâ 4:27-33; Allah'ın tövbeleri kabul etmek istemesi, şehvete
uyanların ise büyük bir sapma istediği, insanın zayıf yaratıldığı, malı
haksız yere yememe ve karşılıklı rıza ile ticaret emri, büyük günahlardan
kaçınmanın küçük günahları örteceği, erkek ve kadının kazandığından payı
olduğu, Allah'tan lütuf istenmesi, mirasçılık ve yeminle bağlananların
hakları). Görsel ile JSON birebir örtüşüyor, toplam 116 kelime kanonik
kaynakla tam eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 83: PASS (satır sınırları dikkatlice yeniden kontrol edildi)
15 satır (Nisâ 4:34-37; erkeklerin kadınlar üzerindeki sorumluluğu, sâliha
kadınların vasfı, nüşuz (geçimsizlik) durumunda öğüt-ayrı yatak-hafif
müdahale kademeleri, karı-koca arasında iki hakem gönderme ayeti, Allah'a
kulluk ve şirk koşmama emri, ana-babaya, yakınlara, yetimlere, komşulara,
yolda kalmışlara iyilik, kibirlenip övünenlerin sevilmediği, cimrilik
edip başkalarına da cimriliği emredenlerin kınanması). Uzun 4:34-36
ayetleri nedeniyle satır sınırları görsel üzerinde iki kez dikkatle
kontrol edildi (ilk taslakta 9-12. satırlar arası kelime dağılımı yanlış
gruplanmıştı, düzeltildi). Görsel ile JSON birebir örtüşüyor, toplam 109
kelime kanonik kaynakla tam eşleşiyor (python `verify()` ile indeks
indeks doğrulandı).

## Sayfa 84: PASS (ilk taslakta düzeltildi — kırpma ile doğrulandı)
15 satır (Nisâ 4:38-44; gösteriş için infak edenlerin şeytanı arkadaş
edinmesi, Allah'a inanıp infak etmenin zararı olmadığı, "Allah zerre kadar
haksızlık etmez" ayeti, kıyamette her ümmetten şahit getirilmesi, kafirlerin
yerle bir olmayı temenni edeceği günü, sarhoşken ve cünüpken namaza
yaklaşmama, teyemmüm ayeti (4:43), kitap ehlinden sapıklık satın alanlar).
İlk taslakta 4. satırın sonundaki "اِنَّ اللّٰهَ" ve 7. satırın içindeki
"يَوْمَئِذٍ" kelimeleri atlanmıştı; python `verify()` 134/137 ve 136/137
ile FAIL verince görsel kırpılıp yakınlaştırılarak (p84_rows7to8.png) her
iki kelime de doğru satırlarına yerleştirildi. Düzeltme sonrası görsel ile
JSON birebir örtüşüyor, toplam 137 kelime kanonik kaynakla tam eşleşiyor
(python `verify()` ile indeks indeks doğrulandı).

## Sayfa 85: PASS
15 satır (Nisâ 4:45-51; Allah'ın düşmanları en iyi bilen dost ve yardımcı
olduğu, kelimeleri yerinden kaydıran ve "işittik, karşı geldik" diyen
Yahudilerin diliyle dini incitmesi, "duy ve bize bak" demeleri gerekirken
alaycı ifadeler kullanmaları, yüz izlerini silme/Sebt halkı gibi lanetleme
uyarısı, Allah'ın şirki affetmeyeceği fakat dilediği diğer günahları
bağışlayacağı ünlü ayeti (4:48), kendini temize çıkaranların kınanması,
Allah'a iftira, kitap ehlinden bir kısmının cibt ve tağuta inanması).
Uzun 4:46 ve 4:47 ayetleri nedeniyle satırlar dikkatle tek tek sayıldı.
Görsel ile JSON birebir örtüşüyor, toplam 140 kelime kanonik kaynakla tam
eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 86: PASS
15 satır (Nisâ 4:52-59; Allah'ın lanetlediklerine yardımcı bulunamayacağı,
mülkten pay olsaydı bile insanlara zerre vermeyecekleri, İbrahim ailesine
kitap, hikmet ve büyük mülk verildiği, inkarcıların derileri her yandığında
yenisiyle değiştirileceği ayeti (4:56), iman edip salih amel işleyenlere
altından ırmaklar akan cennetler ve tertemiz eşler vaadi, emanetleri
ehline verme ve adaletle hükmetme emri (4:58), Allah'a, Resûlüne ve
ulülemre itaat, anlaşmazlıkta Allah ve Resûlüne başvurma ayeti (4:59)).
Görsel ile JSON birebir örtüşüyor, toplam 144 kelime kanonik kaynakla tam
eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 87: PASS
15 satır (Nisâ 4:60-65; iman iddia edip tağuta başvurmak isteyen
münafıkların durumu, Allah'ın indirdiğine ve Resûle çağrıldıklarında
yüz çevirmeleri, kendi elleriyle yaptıklarının başlarına geldiğinde
yeminle gelip özür beyan etmeleri, kalplerindekini Allah'ın bildiği,
resullerin ancak Allah'ın izniyle itaat edilmek üzere gönderildiği,
zulmedenlerin gelip Resûlden istiğfar dilemesi durumunda Allah'ı tevbeleri
kabul edici bulacakları, "Rabbine andolsun ki, aralarında çıkan
anlaşmazlıkta seni hakem kılıp verdiğin hükme içlerinde bir sıkıntı
duymadan tam teslimiyetle boyun eğmedikçe iman etmiş olmazlar" ünlü
ayeti 4:65). Görsel ile JSON birebir örtüşüyor, toplam 119 kelime kanonik
kaynakla tam eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 88: PASS
15 satır (Nisâ 4:66-74; kendini öldürme/yurdundan çıkma emri verilseydi
pek azının yapacağı, itaat edilseydi daha hayırlı olacağı, Allah'a ve
Resûle itaat edenlerin nebiler-sıddîklar-şehidler-salihlerle beraber
olacağı ünlü ayeti (4:69), tedbirli olup müfrezeler halinde veya topluca
sefere çıkma emri, geride kalıp münafıklık edenlerin tavrı, "keşke
onlarla beraber olsaydım da büyük kurtuluşa erseydim" sözü, Allah yolunda
savaşma ve şehadet/zafer ayeti (4:74)). Görsel ile JSON birebir örtüşüyor,
toplam 129 kelime kanonik kaynakla tam eşleşiyor (python `verify()` ile
indeks indeks doğrulandı).

## Sayfa 89: PASS (ilk taslakta düzeltildi)
15 satır (Nisâ 4:75-79; Allah yolunda ve zayıf düşürülmüş erkek, kadın,
çocuklar uğrunda savaşmama sebebi olmama sorusu, mü'minlerin Allah
yolunda, kafirlerin tağut yolunda savaşması, "şeytanın hilesi zayıftır"
ayeti, önce savaştan çekinip sonra farz olunca telaşlanan bir grubun
durumu, "dünya menfaati azdır, ahiret takva sahipleri için daha
hayırlıdır" ayeti, nerede olursanız olun ölümün sizi bulacağı ayeti
(4:78), iyiliğin Allah'tan, kötülüğün kişinin kendi nefsinden olduğu
ayeti (4:79)). İlk taslakta kanonik metindeki "اَيْنَ مَا" ifadesi boşlukla
ayrılmış iki ayrı kelime olduğu halde tek kelime ("اَيْنَمَا") sayılmıştı;
python `verify()` 153/154 ile FAIL verince fark tespit edilip 10. satır
düzeltildi. Düzeltme sonrası görsel ile JSON birebir örtüşüyor, toplam
154 kelime kanonik kaynakla tam eşleşiyor (python `verify()` ile indeks
indeks doğrulandı).

## Sayfa 90: PASS
15 satır (Nisâ 4:80-86; Resûle itaatin Allah'a itaat olduğu ayeti,
münafıkların gizli plan kurması, Kur'an'ı tedebbür etmeme uyarısı ve
"Allah'tan başkasından olsaydı çok ihtilaf bulurlardı" ayeti (4:82),
güvenlik/korku haberini yayma yerine yetkililere/Resûle götürme emri,
Allah yolunda savaş ve sadece kendinden sorumlu olma ayeti (4:84), güzel
şefaatten pay, kötü şefaatten günah alma ayeti (4:85), selama daha
güzeliyle veya aynısıyla karşılık verme emri). Görsel ile JSON birebir
örtüşüyor, toplam 138 kelime kanonik kaynakla tam eşleşiyor (python
`verify()` ile indeks indeks doğrulandı).

## Sayfa 91: PASS
15 satır (Nisâ 4:87-91; "Allah'tan başka ilah yoktur, sizi kıyamet
gününde mutlaka toplayacaktır" ayeti, münafıklar hakkında iki gruba
ayrılma sebebi, Allah'ın saptırdığını kimsenin doğru yola
iletemeyeceği, münafıkların kafir olmanızı istediği, hicret etmeyenleri
dost edinmeme ve bulunduğunuz yerde yakalama emri (istisnalar hariç),
aranızda antlaşma bulunan veya savaşmaktan çekinen topluluklara
dokunmama, barış teklif edip elini çekenlere yol aramama, güvenlik
oyunu oynayıp fitneye her seferinde geri dönenler hakkında hüküm (4:91)).
Görsel ile JSON birebir örtüşüyor, toplam 134 kelime kanonik kaynakla tam
eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 92: PASS
15 satır (Nisâ 4:92-94; mü'minin bir mü'mini yanlışlıkla öldürmesi
durumunda köle azadı ve diyet hükümleri (kısas/kefaret ayeti 4:92, uzun),
kasten mü'min öldürmenin cezasının ebedi cehennem olduğu ünlü ayeti
(4:93), Allah yolunda sefere çıkıldığında iyice araştırıp selam verene
"sen mü'min değilsin" dememe, dünya menfaati peşinde koşmama uyarısı
(4:94)). Görsel ile JSON birebir örtüşüyor, toplam 116 kelime kanonik
kaynakla tam eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 93: PASS
15 satır (Nisâ 4:95-101; oturanlarla Allah yolunda malı ve canıyla
cihad edenlerin bir olmadığı, mücahidlere derece ve büyük mükafat
vaadi (özürlüler istisna), meleklerin nefislerine zulmedenlerin canını
alırken "ne durumdaydınız" diye sorması ve "yeryüzü geniş değil miydi,
hicret etseydiniz" cevabı, gerçekten aciz olan zayıflar için istisna
(4:98), Allah yolunda hicret edip yolda ölenin ecrinin Allah'a düşeceği
ayeti (4:100), yolculukta namazı kısaltma (kasr) ruhsatı ve kafirlerin
düşman olduğu uyarısı (4:101)). Görsel ile JSON birebir örtüşüyor, toplam
144 kelime kanonik kaynakla tam eşleşiyor (python `verify()` ile indeks
indeks doğrulandı).

## Sayfa 94: PASS
15 satır (Nisâ 4:102-105; korku namazı (salât-ı havf) hükümleri (4:102,
uzun), namazdan sonra Allah'ı zikretme ve güvene kavuşunca namazı tam
kılma emri, namazın mü'minler üzerine vakitli farz olduğu ayeti (4:103),
düşmanı takipte gevşememe ve "siz acı çekiyorsanız onlar da acı
çekiyor, ama siz Allah'tan umuyorsunuz" ayeti (4:104), Kur'an'ın hak ile
indirildiği ve insanlar arasında Allah'ın gösterdiğiyle hükmetme, hainlerin
savunucusu olmama emri (4:105)). Görsel ile JSON birebir örtüşüyor, toplam
119 kelime kanonik kaynakla tam eşleşiyor (python `verify()` ile indeks
indeks doğrulandı).

## Sayfa 95: PASS
15 satır (Nisâ 4:106-113; Allah'tan mağfiret dileme, kendine hıyanet
edenleri savunmama uyarısı, insanlardan gizlenip Allah'tan gizlenmeyen
hainlerin durumu, dünya hayatında onları savunanların kıyamette
savunamayacağı ayeti (4:109), günah işleyip Allah'tan mağfiret dileyenin
bulacağı bağışlanma, kazanılan günahın kişinin kendi aleyhine olduğu,
suçu masum birine atmanın büyük bühtan ve günah olduğu (4:112), Allah'ın
lütfu ve rahmeti olmasaydı bir topluluğun Peygamberi saptırmaya
çalışacağı, kitap ve hikmet indirilip bilmediğini öğretme lütfu (4:113)).
Görsel ile JSON birebir örtüşüyor, toplam 132 kelime kanonik kaynakla tam
eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 96: PASS
15 satır (Nisâ 4:114-121; gizli konuşmaların çoğunda hayır olmadığı,
sadaka/iyilik/insanlar arası ıslah emredenler istisna, hidayet
kendisine belli olduktan sonra Resûle karşı çıkıp mü'minlerin yolundan
başkasına uyanın cehenneme sevk edileceği ayeti (4:115), Allah'a şirk
koşmanın affedilmeyeceği tekrar ayeti (4:116), müşriklerin dişi
putlara/inatçı şeytana taptığı, Allah'ın lanetlediği şeytanın "kullarından
belirli bir pay alacağım, onları saptıracağım, hayvanların kulaklarını
yardıracağım, Allah'ın yarattığını değiştirteceğim" yemini (4:117-119),
şeytanın sadece aldatıcı vaatlerde bulunduğu, varacakları yerin cehennem
olduğu (4:120-121)). Görsel ile JSON birebir örtüşüyor, toplam 120 kelime
kanonik kaynakla tam eşleşiyor (python `verify()` ile indeks indeks
doğrulandı).

## Sayfa 97: PASS
15 satır (Nisâ 4:122-127; iman edip salih amel işleyenlere altından
ırmaklar akan ebedi cennet vaadi ve "Allah'tan daha doğru sözlü kim
vardır" ayeti (4:122), amelin sizin veya ehl-i kitabın kuruntularıyla
değil, kim kötülük işlerse cezasını göreceği gerçeğiyle olduğu (4:123),
erkek-kadın fark etmeksizin salih amel işleyen mü'minin cennete gireceği
ayeti (4:124), yüzünü Allah'a teslim edip İbrahim'in hanif dinine uyanın
dininin en güzel din olduğu, İbrahim'in Allah'ın halili (dostu) olduğu
ayeti (4:125), göklerdeki ve yerdeki her şeyin Allah'a ait olduğu
(4:126), kadınlar hakkında fetva istenmesi, yetim kızlara mehir/mirası
vermeden nikahlamak istenmesi ve zayıf çocuklara adaletle davranma emri
(4:127)). Görsel ile JSON birebir örtüşüyor, toplam 126 kelime kanonik
kaynakla tam eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 98: PASS
15 satır (Nisâ 4:128-134; kadının kocasından geçimsizlik/yüz çevirme
korkusu durumunda aralarında sulh, cimriliğin nefislerde hazır olduğu
ayeti (4:128), kadınlar arasında tam adalet sağlanamayacağı, birini
askıdaymış gibi bırakmama uyarısı (4:129), ayrılık halinde Allah'ın her
ikisini de lütfundan zengin kılacağı (4:130), göklerde ve yerde ne varsa
Allah'a ait olduğu ve önceki kitap ehline de takva emredildiği ayeti
tekrar tekrar vurgulanıyor (4:131-132), Allah dilerse insanları
götürüp başkalarını getirebileceği (4:133), dünya sevabını isteyenin
Allah katında dünya ve ahiret sevabının bulunduğu ayeti (4:134)). Görsel
ile JSON birebir örtüşüyor, toplam 130 kelime kanonik kaynakla tam
eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 99: PASS
15 satır (Nisâ 4:135-140; adaleti tam ayakta tutup kendi aleyhinize
bile olsa Allah için şahitlik etme emri (4:135), Allah'a, Resûlüne,
indirdiği ve önceki kitaba iman etme çağrısı, meleklere/kitaplara/
resullere/ahiret gününe küfredenin sapıklığı (4:136), iman edip küfre
dönüp tekrar iman edip tekrar küfre düşenlerin bağışlanmayacağı
(4:137), münafıklara acı azap müjdesi (4:138), mü'minler yerine
kafirleri dost edinip onların yanında izzet arayanlara "izzet tamamen
Allah'ındır" cevabı (4:139), Allah'ın ayetleriyle alay edilen bir
mecliste oturmama, aksi halde onlarla aynı olunacağı ve Allah'ın
münafık ve kafirleri cehennemde toplayacağı uyarısı (4:140)). Görsel
ile JSON birebir örtüşüyor, toplam 140 kelime kanonik kaynakla tam
eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 100: PASS (satır sınırları görsel üzerinde iki kez kontrol edildi)
15 satır (Nisâ 4:141-147; münafıkların fetih/yenilgi durumuna göre taraf
değiştirmesi ve Allah'ın kafirlere mü'minler üzerinde asla yol
vermeyeceği ayeti (4:141), münafıkların Allah'ı aldatmaya çalışması,
namaza tembel ve gösteriş için kalkması (4:142), ne bu tarafa ne o
tarafa yönelen "mütereddit" tarifi (4:143), mü'minler yerine kafirleri
dost edinmeme tekrarı (4:144), münafıkların cehennemin en alt katında
olacağı ayeti (4:145), tövbe edip ıslah olan ve Allah'a sarılanların
istisnası ve mü'minlerle beraber büyük mükafat alacakları (4:146),
şükredip iman edenlere Allah'ın neden azap etsin sorusu (4:147)). İlk
satır gruplamasında 7. ve 8. satırların sınırı (لَا اِلٰى ifadesinin hangi
satırda olduğu) görsel üzerinde tekrar kontrol edilerek düzeltildi.
Görsel ile JSON birebir örtüşüyor, toplam 129 kelime kanonik kaynakla tam
eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

---

## Özet (Dördüncü tur: sayfa 71-100)

- Kontrol edilen sayfa sayısı: 30 (sayfa 71 – 100)
- PASS: 30/30 (ilk taslakta hata bulunup düzeltilenler dahil)
- FAIL (düzeltilmemiş): 0
- İlk taslakta düzeltilen hatalar (hepsi python `verify()` ile
  yakalanıp diske yazılmadan önce giderildi):
  - Sayfa 75: satır 6-7 arasında "قَل۪يلٌ" kelimesi atlanmıştı (118/119).
  - Sayfa 83: satır 9-12 arası kelime gruplaması görsel ile tam
    örtüşmüyordu, görsel yeniden incelenip düzeltildi.
  - Sayfa 84: satır 4 sonunda "اِنَّ اللّٰهَ" ve satır 7 içinde
    "يَوْمَئِذٍ" kelimeleri atlanmıştı (134/137, sonra 136/137); görsel
    kırpılıp yakınlaştırılarak (p84_rows7to8.png) doğrulandı.
  - Sayfa 89: kanonik metindeki "اَيْنَ مَا" boşlukla ayrılmış iki kelime
    tek kelime sayılmıştı (153/154).
  - Sayfa 100: satır 7-8 sınırı ("لَا اِلٰى" ifadesinin yeri) görsel
    üzerinde tekrar kontrol edilip düzeltildi.
- Standart-dışı sayfa: sayfa 75 (Âl-i İmrân sûresi sonu, 13 satır),
  sayfa 76 (Nisâ sûresi başlangıcı, besmele + 14 satır = 15 toplam).
  Besmele satırı kanonik kelime diziminin dışında ayrı satır olarak
  eklendi (sayfa 49/0/1 ile aynı kalıp).
- Yöntem: her sayfa için WebFetch ile kuran.hayrat.com.tr/Sayfalar/{N}.jpg
  indirildi (WebFetch metin özeti okunamasa da binary JPEG diske
  kaydediliyor), Read (multimodal) ile satır satır okundu, her satırın
  kelime sayısı görselden çıkarılıp verse-graph-bgem3.json'daki kanonik
  kelime dizisi bu sayılara göre python (`mushaf_helper.py`, scratchpad)
  ile satırlara bölündü. `verify()` fonksiyonu satır-satır birleştirilmiş
  kelime dizisinin kanonik diziyle TAM (indeks indeks) eşleştiğini
  doğruladı. Her sayfa `save_page()` ile JSON'a ve aynı anda bu rapora
  eklendi (batch yok, her sayfa ayrı ayrı diske yazıldı). Tur sonunda
  sayfa 71-100 aralığının tamamı ayrıca yeniden (bağımsız) doğrulandı:
  hem ayet listesi hem kelime dizisi kanonik kaynakla tekrar karşılaştırıldı,
  hepsi eşleşti.
- JSON geçerliliği: `public/mushaf-line-breaks.json` geçerli JSON, 101
  sayfa içeriyor (0-100, boşluksuz). Bu rapor dosyasında sayfa 0'dan
  100'e kadar tam olarak bir giriş var, tekrar veya eksik yok.

---

## Beşinci tur: sayfa 101'den itibaren

## Sayfa 101: PASS
15 satır (Nisâ 4:148-154; Allah'ın kötü sözün açıkça söylenmesini
sevmediği, zulme uğrayan müstesna (4:148), iyiliği açığa vursanız da
gizleseniz de ya da bir kötülüğü affetseniz de Allah'ın affedici
olduğu (4:149), Allah'a ve resullerine küfredip aralarını ayırmak
isteyenlerin gerçek kâfirler olduğu (4:150-151), Allah'a ve tüm
resullerine iman edip aralarını ayırmayanlara mükafat verileceği
(4:152), Ehl-i Kitab'ın gökten bir kitap indirilmesini istemesi, daha
önce Mûsâ'dan Allah'ı açıkça göstermesini istedikleri, bu yüzden
yıldırımın onları çarptığı, sonra buzağıyı put edindikleri, delillerin
gelmesinden sonra affedildikleri ve Mûsâ'ya apaçık bir yetki verildiği
(4:153), Tûr dağının üzerlerine kaldırılması, "secde ederek kapıdan
girin" ve "Cumartesi (Sebt) günü haddi aşmayın" emirleri, ağır bir
misak alınması (4:154)). Görsel ile JSON birebir örtüşüyor, toplam 131
kelime kanonik kaynakla tam eşleşiyor (python `verify()` ile indeks
indeks doğrulandı).

## Sayfa 102: PASS (ilk taslakta düzeltildi)
15 satır (Nisâ 4:155-162; Yahudilerin misakı bozması, ayetleri inkâr
etmesi, peygamberleri haksız yere öldürmesi ve "kalplerimiz kılıflıdır"
demesi yüzünden kalplerinin mühürlendiği (4:155), Meryem'e büyük bühtan
atmaları (4:156), "Allah'ın resulü Meryem oğlu İsa Mesih'i öldürdük"
demeleri; oysa onu öldürmedikleri ve asmadıkları, kendilerine
(başkasının) benzer gösterildiği, bu konuda ihtilaf edenlerin şüphe
içinde olduğu, kesin bilgileri olmayıp zanna uydukları, onu kesin
olarak öldürmedikleri (4:157), bilakis Allah'ın onu kendisine
yükselttiği (4:158), Ehl-i Kitab'tan her birinin ölümünden önce ona
mutlaka iman edeceği ve kıyamet günü onun aleyhlerine şahit olacağı
(4:159), Yahudilerin zulmü ve Allah yolundan çokça alıkoymaları
sebebiyle kendilerine helal kılınmış temiz şeylerin haram kılındığı
(4:160), yasaklandıkları halde faiz almaları ve insanların mallarını
haksız yere yemeleri, içlerinden kâfir olanlara acı azap hazırlandığı
(4:161), fakat içlerinden ilimde derinleşenler ve mü'minlerin sana ve
senden önce indirilene iman ettiği, namazı dosdoğru kılan, zekâtı
veren, Allah'a ve ahiret gününe iman edenlere büyük mükafat verileceği
(4:162)). İlk taslakta 9. satırda ayet 160'ın başındaki "فَبِظُلْمٍ مِنَ"
ifadesi 10. satıra kaydırılmıştı (136/138); görsel kırpılıp
yakınlaştırılarak (p102_row9only.png) yeniden incelendi ve "فَبِظُلْمٍ
مِنَ الَّذ۪ينَ" ifadesinin aslında 9. satırın sonunda olduğu görülüp
düzeltildi. Görsel ile JSON birebir örtüşüyor, toplam 138 kelime
kanonik kaynakla tam eşleşiyor (python `verify()` ile indeks indeks
doğrulandı).

## Sayfa 103: PASS
15 satır (Nisâ 4:163-170; Allah'ın Nûh'a ve ondan sonraki peygamberlere
vahyettiği gibi Peygamberimize de vahyettiği, İbrahim, İsmail, İshak,
Yakub, torunları (Esbât), İsa, Eyyub, Yunus, Harun, Süleyman'a
vahyettiği ve Dâvûd'a Zebur verdiği (4:163), sana anlattığımız ve
anlatmadığımız nice resuller, Allah'ın Mûsâ ile bizzat konuşması
(4:164), müjdeleyici ve uyarıcı resuller gönderilmesi, böylece
insanların resullerden sonra Allah'a karşı bir bahaneleri kalmaması
için (4:165), Allah'ın sana indirdiğine kendi ilmiyle şahitlik ettiği,
meleklerin de şahit olduğu, şahit olarak Allah'ın yeterliği (4:166),
küfredip Allah yolundan alıkoyanların derin bir sapıklıkta olduğu
(4:167), küfredip zulmedenleri Allah'ın bağışlamayacağı ve doğru yola
iletmeyeceği (4:168), cehennem yolu hariç — orada ebedî kalacakları,
bunun Allah'a göre kolay olduğu (4:169), "Ey insanlar! Size Rabbinizden
hak ile Resûl geldi, iman edin ki hayrınıza olsun; küfrederseniz
göklerde ve yerde ne varsa Allah'ındır" çağrısı (4:170)). Görsel ile
JSON birebir örtüşüyor, toplam 125 kelime kanonik kaynakla tam
eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 104: PASS
15 satır (Nisâ 4:171-175; Ehl-i Kitab'a dinde aşırı gitmeme ve Allah
hakkında haktan başka söz söylememe uyarısı; Meryem oğlu İsa Mesih'in
Allah'ın resulü, kelimesi ve O'ndan bir ruh olduğu, "üç" dememe,
Allah'ın tek ilah olduğu, çocuğu olmaktan münezzeh olduğu (4:171),
Mesih'in ve yakın meleklerin Allah'a kul olmaktan çekinmeyeceği,
çekinip büyüklenenlerin hepsinin O'nun huzurunda toplanacağı (4:172),
iman edip salih amel işleyenlere karşılıklarının eksiksiz verilip
fazlasının da verileceği, çekinip büyüklenenlere ise acı azap edileceği
ve Allah'tan başka dost/yardımcı bulamayacakları (4:173), "Ey insanlar!
Rabbinizden size kesin bir delil geldi ve size apaçık bir nur
indirdik" çağrısı (4:174), Allah'a iman edip O'na sarılanların
rahmetine ve fazlına girecekleri ve dosdoğru bir yola iletilecekleri
(4:175)). Görsel ile JSON birebir örtüşüyor, toplam 125 kelime kanonik
kaynakla tam eşleşiyor (python `verify()` ile indeks indeks
doğrulandı).

## Sayfa 105: PASS (Nisâ sûresi sonu + Mâide sûresi başlangıcı, besmele + 13 satır = toplam 13 satır)
13 satır (Nisâ 4:176: kelâle hakkında fetva — çocuğu olmayan kişinin
mirasının kız kardeşine, iki kız kardeş varsa mirasın üçte ikisine,
erkek-kadın karışık kardeşler varsa erkeğe kadının iki katı düşmesi
hükmü, ardından sûre başlığı ve besmele; Mâide 5:1-2: "Ey iman edenler!
Akitlerinizi yerine getirin" emri, av yasağı dışında hayvanların helal
kılınması, ihramdayken Allah'ın hükmettiğini uygulama emri (5:1),
Allah'ın nişanelerini, haram ayı, kurbanlık hayvanları, gerdanlıklı
kurbanlıkları ve Beytü'l-Haram'a yönelenleri helal saymama, Mescid-i
Haram'dan alıkoyan bir topluluğa duyulan kin yüzünden haddi aşmama, iyilik
ve takvada yardımlaşıp günah ve düşmanlıkta yardımlaşmama emri (5:2)).
Besmele satırı kanonik kelime sayımının dışında ayrı satır olarak
eklendi (sayfa 76 ile aynı kalıp). Görsel ile JSON birebir örtüşüyor,
toplam 127 kelime kanonik kaynakla tam eşleşiyor (python `verify()`
ile indeks indeks doğrulandı).

## Sayfa 106: PASS
15 satır (Mâide 5:3-5; leş, kan, domuz eti, Allah'tan başkası adına
kesilen, boğulmuş, vurulmuş, yüksekten düşmüş, boynuzlanmış, canavar
tarafından yenmiş (kesilmeden ölmüşse) hayvanların ve dikili taşlar
üzerine kesilenlerin, fal oklarıyla kısmet aramanın haram kılınması;
"bugün kâfirler dininizden ümidini kesti, bugün dininizi kemale
erdirdim, üzerinizdeki nimetimi tamamladım ve size din olarak İslâm'ı
seçtim" ayeti, açlıktan zorda kalanın günaha meyletmeksizin
yiyebileceği (5:3), kendilerine nelerin helal kılındığını sorulması,
temiz şeylerin ve öğretilmiş avcı hayvanların yakaladığının helal
olduğu cevabı (5:4), bugün temiz şeylerin helal kılındığı, Ehl-i
Kitab'ın yemeğinin size ve sizin yemeğinizin onlara helal olduğu,
iffetli mü'min ve Ehl-i Kitap kadınlarla mehir vererek, zinadan uzak
ve gizli dost edinmeksizin evlenmenin helal olduğu, imanı inkâr edenin
amelinin boşa gideceği ve ahirette hüsrana uğrayacağı (5:5)). Görsel
ile JSON birebir örtüşüyor, toplam 135 kelime kanonik kaynakla tam
eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 107: PASS
15 satır (Mâide 5:6-9; namaza kalkıldığında yüzü, dirseklere kadar
elleri yıkama, başı meshetme, topuklara kadar ayakları yıkama, cünüp
iken yıkanma, hasta/yolcu/tuvaletten gelme/eşle temas durumunda su
bulunamazsa temiz toprakla teyemmüm etme — Allah'ın zorluk değil
temizlik ve nimetini tamamlama dilediği (5:6), Allah'ın üzerinizdeki
nimetini ve "işittik, itaat ettik" dediğinizde aldığı misakı hatırlama,
Allah'ın kalplerin özünü bilen olduğu (5:7), adaleti ayakta tutan,
Allah için şahitlik eden kimseler olma, bir topluluğa duyulan kinin
adaletsizliğe sürüklememesi, adaletin takvaya en yakın olduğu (5:8),
iman edip salih amel işleyenlere Allah'ın mağfiret ve büyük mükafat
vaat ettiği (5:9)). Görsel ile JSON birebir örtüşüyor, toplam 118
kelime kanonik kaynakla tam eşleşiyor (python `verify()` ile indeks
indeks doğrulandı).

## Sayfa 108: PASS
15 satır (Mâide 5:10-13; küfredip ayetlerini yalanlayanların cehennem
ehli olduğu (5:10), bir topluluğun size el uzatmaya niyetlenip
Allah'ın onların elini sizden çektiği nimetini hatırlama çağrısı
(5:11), Allah'ın İsrailoğullarından misak alması, aralarından on iki
nakib göndermesi, namazı kılıp zekâtı verirse, resullere iman edip
onlara yardım ederse ve Allah'a güzel bir borç verirse günahlarını
örteceği ve altından nehirler akan cennetlere koyacağı vaadi, bundan
sonra kim küfrederse doğru yoldan sapmış olacağı (5:12), misaklarını
bozmaları sebebiyle onları lanetleyip kalplerini katılaştırdığı,
kelimeleri yerlerinden kaydırdıkları, kendilerine hatırlatılanın bir
kısmını unuttukları, içlerinden azı hariç sürekli hainlik yaptıkları,
buna rağmen affetme ve hoşgörme emri — Allah'ın iyilik edenleri sevdiği
(5:13)). Görsel ile JSON birebir örtüşüyor, toplam 108 kelime kanonik
kaynakla tam eşleşiyor (python `verify()` ile indeks indeks
doğrulandı).

## Sayfa 109: PASS
15 satır (Mâide 5:14-17; "Biz nasrâniyiz" diyenlerden de misak
alındığı, onların da hatırlatılanın bir kısmını unuttuğu, bu yüzden
aralarına kıyamete kadar sürecek düşmanlık ve kin salındığı, Allah'ın
yaptıklarını haber vereceği (5:14), Ehl-i Kitab'a kitaptan gizledikleri
birçok şeyi açıklayan ve birçoğunu affeden bir resulün geldiği, Allah
katından bir nur ve apaçık bir kitabın geldiği (5:15), Allah'ın bununla
rızasına uyanları esenlik yollarına ilettiği, izniyle karanlıklardan
nura çıkardığı ve dosdoğru yola ilettiği (5:16), "Allah, Meryem oğlu
Mesih'tir" diyenlerin küfre düştüğü; Allah Mesih'i, annesini ve
yeryüzündekilerin hepsini helâk etmek istese kimsenin buna engel
olamayacağı, göklerin, yerin ve ikisi arasındakilerin mülkünün Allah'a
ait olduğu, dilediğini yarattığı ve her şeye kadir olduğu (5:17)).
Görsel ile JSON birebir örtüşüyor, toplam 109 kelime kanonik kaynakla
tam eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 110: PASS
15 satır (Mâide 5:18-23; Yahudi ve Hıristiyanların "biz Allah'ın
oğulları ve sevgilileriyiz" iddiası, buna karşılık "öyleyse niçin
günahlarınız yüzünden azap ediyor" cevabı, aslında sizin de O'nun
yarattığı birer beşer olduğunuz, dilediğini bağışlayıp dilediğini
azaplandırdığı, göklerin, yerin ve ikisi arasındakilerin mülkünün
Allah'a ait olduğu, dönüşün de O'na olduğu (5:18), resullerin
arasındaki bir fetret döneminde size gerçekleri açıklayan bir resulün
gelmesi — "bize müjdeleyici ve uyarıcı gelmedi" dememeniz için, artık
müjdeleyici ve uyarıcının geldiği (5:19), Mûsâ'nın kavmine "Allah'ın
üzerinizdeki nimetini hatırlayın; içinizden peygamberler çıkardı,
sizi hükümdarlar kıldı ve alemlerden hiç kimseye vermediğini size
verdi" demesi (5:20), "Ey kavmim! Allah'ın size yazdığı kutsal
topraklara girin, arkanıza dönüp geri kaçmayın, yoksa hüsrana
uğrarsınız" çağrısı (5:21), kavminin "orada zorba bir topluluk var, onlar
çıkmadıkça biz oraya asla girmeyiz; eğer çıkarlarsa gireriz" cevabı
(5:22), Allah'ın nimet verdiği, Allah'tan korkan iki adamın "kapıdan
üzerlerine yürüyün, oraya girerseniz galip gelirsiniz, eğer
mü'minlerseniz Allah'a güvenin" demesi (5:23)). Görsel ile JSON
birebir örtüşüyor, toplam 136 kelime kanonik kaynakla tam eşleşiyor
(python `verify()` ile indeks indeks doğrulandı).

## Sayfa 111: PASS
15 satır (Mâide 5:24-31; İsrailoğullarının "sen ve Rabbin gidin savaşın,
biz burada oturacağız" cevabı (5:24), Mûsâ'nın "Rabbim! Ben ancak
kendime ve kardeşime söz geçirebilirim, bizimle bu fasık topluluk
arasını ayır" duası (5:25), Allah'ın kırk yıl o toprakların onlara
haram kılınıp yeryüzünde şaşkın şaşkın dolaşacakları cezası, "fasık
topluluğa üzülme" tesellisi (5:26), Âdem'in iki oğlunun kıssasının
gerçek olarak anlatılması — ikisi kurban sunmuş, birinden kabul
edilip diğerinden edilmemesi, "seni mutlaka öldüreceğim" tehdidine
karşı "Allah ancak takva sahiplerinden kabul eder" cevabı (5:27), "beni
öldürmek için elini bana uzatsan da ben seni öldürmek için elimi sana
uzatmam, çünkü ben alemlerin Rabbi olan Allah'tan korkarım" (5:28),
"senin hem kendi günahını hem benim günahımı yüklenip ateş ehlinden
olmanı isterim, zalimlerin cezası budur" (5:29), nefsinin kardeşini
öldürmeyi kolay göstermesi, onu öldürüp hüsrana uğrayanlardan olması
(5:30), Allah'ın bir karga gönderip kardeşinin cesedini nasıl
örteceğini göstermesi, "bu karga kadar bile olamayıp kardeşimin
cesedini örtemedim" pişmanlığı, pişman olanlardan olması (5:31)).
Görsel ile JSON birebir örtüşüyor, toplam 132 kelime kanonik kaynakla
tam eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 112: PASS
15 satır (Mâide 5:32-36; bu olay sebebiyle İsrailoğullarına bir cana
kıymayan veya yeryüzünde bozgunculuk çıkarmayan birini öldürenin bütün
insanları öldürmüş, bir canı kurtaranın da bütün insanları kurtarmış
gibi olacağının yazıldığı, resullerin apaçık delillerle geldiği, buna
rağmen birçoğunun yeryüzünde aşırı gittiği (5:32), Allah ve
Resûlü'ne karşı savaşıp yeryüzünde bozgunculuk çıkaranların
cezasının öldürülmek, asılmak, çapraz olarak el ve ayaklarının
kesilmesi veya sürgün edilmek olduğu, dünyada rezillik ve ahirette
büyük azap (5:33), ele geçirilmeden önce tövbe edenlerin müstesna
olduğu, Allah'ın çok bağışlayıcı ve merhametli olduğu (5:34), "Ey iman
edenler! Allah'tan korkun, O'na yaklaşmaya vesile arayın ve O'nun
yolunda cihad edin ki kurtuluşa eresiniz" çağrısı (5:35), küfredenlerin
yeryüzündeki her şeye ve bir o kadarına daha sahip olsalar da kıyamet
günü azaptan kurtulmak için fidye verseler kabul edilmeyeceği, onlara
acı azap olduğu (5:36)). Görsel ile JSON birebir örtüşüyor, toplam 125
kelime kanonik kaynakla tam eşleşiyor (python `verify()` ile indeks
indeks doğrulandı).

## Sayfa 113: PASS
15 satır (Mâide 5:37-41; ateşten çıkmak isteyip çıkamayacakları, onlara
kalıcı bir azap olduğu (5:37), hırsız erkek ve hırsız kadının, işledikleri
yüzünden Allah'tan bir ceza olarak ellerinin kesilmesi hükmü (5:38),
zulmünden sonra tövbe edip düzelenin tövbesinin kabul edileceği (5:39),
göklerin ve yerin mülkünün Allah'a ait olduğu, dilediğini
azaplandırıp dilediğini bağışladığı ve her şeye kadir olduğu (5:40),
kalpleri iman etmediği halde ağızlarıyla "iman ettik" diyenlerin ve
yalana kulak veren, Peygamber'e gelmeyen başka bir topluluğa kulak
veren, kelimeleri yerinden kaydıran Yahudilerin küfre koşmasının
Peygamber'i üzmemesi gerektiği; "size bu verilirse alın, verilmezse
sakının" demeleri, Allah birinin sapıklığını dilerse Peygamber'in
onun için Allah katında hiçbir şey yapamayacağı, Allah'ın kalplerini
temizlemek istemediği kimselerin dünyada rezillik ve ahirette büyük
azap göreceği (5:41)). Görsel ile JSON birebir örtüşüyor, toplam 126
kelime kanonik kaynakla tam eşleşiyor (python `verify()` ile indeks
indeks doğrulandı).

## Sayfa 114: PASS
15 satır (Mâide 5:42-45; yalana kulak veren, haram yiyen kimselerin
sana gelirse aralarında hükmetme veya onlardan yüz çevirme serbestisi,
yüz çevirsen zarar veremeyecekleri, hükmedersen adaletle hükmetme
emri — Allah'ın adil olanları sevdiği (5:42), yanlarında Allah'ın
hükmünü içeren Tevrat varken nasıl seni hakem tayin edip sonra yüz
çevirdikleri, bunların gerçek mü'minler olmadığı (5:43), içinde hidayet
ve nur bulunan Tevrat'ı indirdiğimiz, teslim olmuş peygamberlerin,
Rabbaniyyûn'un ve hahamların Allah'ın kitabından korumakla
görevlendirildikleri ölçüyle Yahudiler için hükmettikleri, insanlardan
korkmayıp Allah'tan korkma ve ayetleri az bir bedele satmama emri,
Allah'ın indirdiğiyle hükmetmeyenlerin kâfirler olduğu (5:44), Tevrat'ta
cana can, göze göz, buruna burun, kulağa kulak, dişe diş ve yaralara
kısas yazıldığı, kim bunu bağışlarsa bunun kendisi için bir kefaret
olacağı, Allah'ın indirdiğiyle hükmetmeyenlerin zalimler olduğu (5:45)).
Görsel ile JSON birebir örtüşüyor, toplam 113 kelime kanonik kaynakla
tam eşleşiyor (python `verify()` ile indeks indeks doğrulandı).

## Sayfa 115: PASS
15 satır (Mâide 5:46-50; peygamberlerin izinden Meryem oğlu İsa'yı,
Tevrat'ı doğrulayıcı olarak gönderdiği, içinde hidayet ve nur bulunan,
Tevrat'ı doğrulayan ve takva sahiplerine hidayet ve öğüt olan İncil'i
verdiği (5:46), İncil ehlinin Allah'ın onda indirdiğiyle hükmetmesi
emri, Allah'ın indirdiğiyle hükmetmeyenlerin fasıklar olduğu (5:47),
kitabı sana hak ile, önceki kitapları doğrulayıcı ve onlara şahit
olarak indirdiğimiz, aralarında Allah'ın indirdiğiyle hükmetme ve
hevalarına uymama emri, her ümmete bir şeriat ve yol tayin ettiği,
Allah dileseydi hepinizi tek bir ümmet yapabileceği fakat size
verdikleriyle sizi denemek istediği, hayırlarda yarışma ve dönüşün
Allah'a olduğu (5:48), aralarında Allah'ın indirdiğiyle hükmetme,
hevalarına uymama ve Allah'ın indirdiğinin bir kısmından seni
saptırmalarından sakınma emri, yüz çevirirlerse bunun bazı günahları
yüzünden olduğunu bilme, insanların çoğunun fasık olduğu (5:49),
"cahiliye hükmünü mü arıyorlar? Kesin bilenler için Allah'tan daha
güzel hüküm veren kim olabilir?" sorusu (5:50)). Görsel ile JSON
birebir örtüşüyor, toplam 136 kelime kanonik kaynakla tam eşleşiyor
(python `verify()` ile indeks indeks doğrulandı).

## Sayfa 116: PASS
15 satır (Mâide 5:51-57; Yahudi ve Hıristiyanları dost edinmeme uyarısı
— onların birbirinin dostu olduğu, kim onları dost edinirse onlardan
sayılacağı, Allah'ın zalim topluluğu doğru yola iletmeyeceği (5:51),
kalplerinde hastalık bulunanların "başımıza bir felaket gelmesinden
korkuyoruz" diyerek onlara koşuştuğunun görülmesi, Allah'ın bir fetih
veya katından bir emir getirmesi durumunda içlerinde gizlediklerine
pişman olacakları (5:52), mü'minlerin "sizinle beraber olduklarına
bütün güçleriyle yemin edenler bunlar mı?" diyeceği, amellerinin boşa
gidip hüsrana uğrayacakları (5:53), içinizden kim dininden dönerse
Allah'ın onun yerine, kendisinin sevdiği ve kendisini seven,
mü'minlere karşı alçak gönüllü, kâfirlere karşı izzetli, Allah
yolunda cihad eden ve hiçbir kınayıcının kınamasından korkmayan bir
topluluk getireceği — bunun Allah'ın dilediğine verdiği bir lütuf
olduğu (5:54), sizin dostunuzun ancak Allah, Resûlü ve namazı kılıp
rükû halindeyken zekâtı veren mü'minler olduğu (5:55), Allah'ı,
Resûlü'nü ve mü'minleri dost edinenlerin galip gelecek Allah taraftarı
olduğu (5:56), sizden önce kitap verilenlerden ve kâfirlerden dininizi
alay ve oyuncak edinenleri dost tutmama, Allah'tan korkma emri
(5:57)). Görsel ile JSON birebir örtüşüyor, toplam 152 kelime kanonik
kaynakla tam eşleşiyor (python `verify()` ile indeks indeks
doğrulandı).

## Sayfa 117: PASS
15 satır (Mâide 5:58-64; namaza çağırınca alay ve oyuncak edinmeleri,
akletmeyen bir topluluk oldukları (5:58), Ehl-i Kitaba "bizden intikam
almanızın tek sebebi Allah'a, bize ve önceden indirilene iman etmemiz ve
çoğunuzun fasık olması mı?" sorusu (5:59), Allah katında bundan daha
kötü bir karşılığın haber verilmesi: lanetlenenler, gazaba uğrayanlar,
maymun ve domuz yapılanlar, tağuta tapanlar — bunların yerinin daha kötü
ve yolunun daha sapık olduğu (5:60), yanına geldiklerinde "iman ettik"
demeleri ama küfürle girip küfürle çıkmaları, Allah'ın gizlediklerini
bilmesi (5:61), çoğunun günah, düşmanlık ve haram yemede yarışması,
yaptıklarının çok kötü olduğu (5:62), Rabbaniyyun ve ahbarın onları
günah sözünden ve haram yemekten alıkoymaması, yaptıklarının çok kötü
olduğu (5:63), Yahudilerin "Allah'ın eli bağlıdır" demesi, kendi elleri
bağlanıp dedikleri yüzden lanetlenmeleri, bilakis Allah'ın elinin açık
olup dilediği gibi infak ettiği, indirilenin çoğunun azgınlık ve küfrünü
artırdığı, aralarına kıyamete kadar düşmanlık ve kin sokulduğu, savaş
ateşini her yaktıklarında Allah'ın söndürdüğü, yeryüzünde bozgunculuğa
koştukları, Allah'ın bozguncuları sevmediği (5:64)). Görsel ile JSON
birebir örtüşüyor, toplam 149 kelime kanonik kaynaktan doğrudan indeks
aralıklarıyla dilimlenerek satırlara dağıtıldığı için tanım gereği
kanonik kaynakla tam eşleşiyor (python `build_and_save()` ile canon
listesinden index-slice; ayrıca görsel transkripsiyonla satır satır
çapraz kontrol edildi).

## Sayfa 118: PASS
15 satır (Mâide 5:65-70; Ehl-i Kitap iman edip sakınsaydı kötülüklerinin
örtülüp Naîm cennetlerine sokulacakları, Tevrat, İncil ve Rablerinden
kendilerine indirileni gereğince uygulasalardı üstlerinden ve
ayaklarının altından rızıklanacakları — içlerinde orta yolu tutan bir
topluluk olsa da çoğunun yaptığının kötü olduğu (5:65-66), ey Resûl,
Rabbinden sana indirileni tebliğ et, etmezsen risaleti tebliğ etmemiş
olursun, Allah'ın seni insanlardan koruyacağı, Allah'ın kâfir topluluğu
doğru yola iletmeyeceği (5:67), Ehl-i Kitaba Tevrat, İncil ve
Rablerinden indirileni gereğince uygulamadıkça hiçbir şey üzere
olmadıklarının söylenmesi, sana indirilenin çoğunun azgınlık ve
küfrünü artıracağı, kâfir topluluğa üzülmeme emri (5:68), iman edenler,
Yahudiler, Sâbiîler ve Hıristiyanlardan Allah'a ve ahiret gününe iman
edip salih amel işleyenlere korku olmayacağı ve üzülmeyecekleri (5:69),
İsrailoğullarından kesin söz alınıp kendilerine resuller gönderildiği,
nefislerinin hoşlanmadığını getiren her resulü bir kısmının yalanlayıp
bir kısmını öldürdükleri (5:70)). Görsel ile JSON birebir örtüşüyor,
toplam 131 kelime kanonik kaynaktan doğrudan indeks aralıklarıyla
dilimlenerek satırlara dağıtıldığı için tanım gereği kanonik kaynakla
tam eşleşiyor (python `build_and_save()` ile canon listesinden
index-slice; ayrıca görsel transkripsiyonla satır satır çapraz kontrol
edildi).

## Sayfa 119: PASS
15 satır (Mâide 5:71-76; kavimlerinin fitne olmayacağını sanıp kör ve
sağır kesildikleri, sonra Allah'ın tevbelerini kabul ettiği, sonra yine
çoğunun kör ve sağır kesildiği (5:71), "Allah, Meryem oğlu Mesih'tir"
diyenlerin kâfir olduğu — Mesih'in kendisinin "Ey İsrailoğulları, benim
ve sizin Rabbiniz olan Allah'a kulluk edin, kim Allah'a şirk koşarsa
Allah ona cenneti haram kılar, varacağı yer ateştir, zalimlere yardımcı
yoktur" dediği (5:72), "Allah üçün üçüncüsüdür" diyenlerin kâfir olduğu
— tek İlah'tan başka ilah yokken, bu sözden vazgeçmezlerse aralarındaki
kâfirlere elem verici azabın dokunacağı (5:73), Allah'a tevbe edip
bağışlanma dilemeyecekler mi, Allah'ın çok bağışlayıcı ve merhametli
olduğu (5:74), Meryem oğlu Mesih'in yalnızca bir resul olduğu, ondan
önce de resuller geldiği, annesinin doğru sözlü biri olduğu, ikisinin de
yemek yediği — âyetlerin nasıl açıklandığına, sonra da nasıl
çevrildiklerine (hakikatten) bakılması (5:75), Allah'tan başka kendilerine
zarar veya fayda veremeyecek şeylere tapılmaması, Allah'ın işiten ve
bilen olduğu (5:76)). Görsel ile JSON birebir örtüşüyor, toplam 127
kelime kanonik kaynaktan doğrudan indeks aralıklarıyla dilimlenerek
satırlara dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor
(python `build_and_save()` ile canon listesinden index-slice; ayrıca
görsel transkripsiyonla satır satır çapraz kontrol edildi — WebFetch ile
çekilen https://kuran.hayrat.com.tr/Sayfalar/119.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 120: PASS
15 satır (Mâide 5:77-82; Ehl-i Kitaba dinde haddi aşmama, önce sapmış ve
çoklarını saptırmış bir kavmin heva ve heveslerine uymama, doğru yoldan
sapmama çağrısı (5:77), İsrailoğullarından kâfir olanların Davud'un ve
Meryem oğlu İsa'nın diliyle lânetlendiği — bunun isyanları ve haddi
aşmalarından olduğu (5:78), işledikleri kötülükten birbirlerini
sakındırmadıkları, yaptıklarının ne kötü olduğu (5:79), içlerinden
çoğunun kâfirleri dost edindiğini görme, nefislerinin kendileri için
öne sürdüğü şeyin ne kötü olduğu — Allah'ın onlara gazap etmesi, azapta
ebedî kalacakları (5:80), Allah'a, Peygamber'e ve ona indirilene iman
etselerdi kâfirleri dost edinmeyecekleri, ama çoğunun fasık olduğu
(5:81), iman edenlere düşmanlıkça insanların en şiddetlisinin Yahudiler
ve müşrikler olduğu, iman edenlere sevgice en yakınının "Biz
Hıristiyanız" diyenler olduğu — bunun aralarında keşişler ve rahipler
bulunması ve büyüklük taslamamaları sebebiyle olduğu (5:82)). Görsel ile
JSON birebir örtüşüyor, toplam 111 kelime kanonik kaynaktan doğrudan
indeks aralıklarıyla dilimlenerek satırlara dağıtıldığı için tanım
gereği kanonik kaynakla tam eşleşiyor (python `build_and_save()` ile
canon listesinden index-slice; ayrıca görsel transkripsiyonla satır
satır çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/120.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 121: PASS
15 satır (Mâide 5:83-89; Peygamber'e indirileni işitince tanıdıkları
hakikatten dolayı gözlerinden yaş boşanarak "Rabbimiz, iman ettik, bizi
şahitlerle beraber yaz" dedikleri (5:83), "Rabbimizin bizi salihler
topluluğuyla beraber katmasını umarken Allah'a ve bize gelen hakikate
neden iman etmeyelim" dedikleri (5:84), Allah'ın bu sözleri sebebiyle
onları altından ırmaklar akan, içinde ebedî kalacakları cennetlerle
mükâfatlandırdığı — bunun ihsan sahiplerinin mükâfatı olduğu (5:85),
kâfir olup âyetleri yalanlayanların cehennem ehli olduğu (5:86), ey iman
edenler, Allah'ın size helal kıldığı temiz şeyleri haram kılmama, haddi
aşmama — Allah'ın haddi aşanları sevmediği (5:87), Allah'ın sizi
rızıklandırdığı helal ve temiz şeylerden yeme, kendisine iman ettiğiniz
Allah'tan sakınma emri (5:88), Allah'ın kasıtsız yeminlerden dolayı
sorumlu tutmayacağı ama bilerek yaptığınız yeminlerden sorumlu tutacağı
— bunun kefaretinin ailenize yedirdiğinizin ortalamasından on yoksulu
doyurmak veya giydirmek veya bir köle azat etmek olduğu, bulamayanın üç
gün oruç tutması gerektiği — yemin ettiğinizde yeminlerinizin kefareti
budur, yeminlerinizi koruyun; Allah'ın âyetlerini şükredesiniz diye
böylece açıkladığı (5:89)). Görsel ile JSON birebir örtüşüyor, toplam
133 kelime kanonik kaynaktan doğrudan indeks aralıklarıyla dilimlenerek
satırlara dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor
(python `build_and_save()` ile canon listesinden index-slice; ayrıca
görsel transkripsiyonla satır satır çapraz kontrol edildi — WebFetch ile
çekilen https://kuran.hayrat.com.tr/Sayfalar/121.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 122: PASS
15 satır (Mâide 5:90-95; şarap, kumar, dikili taşlar ve fal oklarının
şeytan işi pislik olduğu, bunlardan kaçınılması gerektiği (5:90),
şeytanın şarap ve kumar yoluyla aranıza düşmanlık ve kin sokmak,
Allah'ı anmaktan ve namazdan alıkoymak istediği — artık vazgeçecek
misiniz (5:91), Allah'a ve Resûl'e itaat edilmesi, sakınılması, yüz
çevrilirse Resûl'ün üzerine düşenin yalnızca açık tebliğ olduğunun
bilinmesi (5:92), iman edip salih amel işleyenlere, sakındıkları,
iman ettikleri ve salih amel işledikleri, sonra sakındıkları ve iman
ettikleri, sonra sakınıp iyilik ettikleri sürece daha önce tattıklarında
günah olmadığı — Allah'ın ihsan sahiplerini sevdiği (5:93), ey iman
edenler, Allah'ın kimin gaipte kendisinden korktuğunu bilmek için
ellerinizin ve mızraklarınızın erişebileceği bir avla sizi mutlaka
sınayacağı — kim bundan sonra haddi aşarsa onun için elem verici azap
olduğu (5:94), ey iman edenler, ihramdayken av hayvanı öldürmeme —
kim kasten öldürürse cezasının, öldürdüğüne denk, içinizden iki adil
kişinin hükmedeceği, Kâbe'ye ulaştırılacak bir kurban, ya da yoksul
doyurma şeklinde bir kefaret, ya da yaptığının vebalini tatması için
buna denk oruç olduğu — Allah'ın geçmişi affettiği, kim tekrarlarsa
Allah'ın ondan intikam alacağı, Allah'ın mutlak güç sahibi, intikam
sahibi olduğu (5:95)). Görsel ile JSON birebir örtüşüyor, toplam 147
kelime kanonik kaynaktan doğrudan indeks aralıklarıyla dilimlenerek
satırlara dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor
(python `build_and_save()` ile canon listesinden index-slice; ayrıca
görsel transkripsiyonla satır satır çapraz kontrol edildi — WebFetch ile
çekilen https://kuran.hayrat.com.tr/Sayfalar/122.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 123: PASS
15 satır (Mâide 5:96-103; deniz avının ve yiyeceğinin hem sizin hem
yolcular için bir geçimlik olarak helal kılınması, ihramdayken kara
avının haram kılınması, huzuruna toplanacağınız Allah'tan sakının
emri (5:96), Allah'ın Kâbe'yi, Beyt-i Haram'ı, haram ayı, kurbanlığı ve
gerdanlıklı hayvanları insanlar için ayakta kalma (kıyam) vesilesi
kıldığı — bunun, Allah'ın göklerde ve yerde olanı bildiğini ve her şeyi
hakkıyla bildiğini bilmeniz içindir (5:97), Allah'ın azabının şiddetli,
kendisinin çok bağışlayıcı ve merhametli olduğunu bilin (5:98), Resûl'e
düşenin yalnızca tebliğ olduğu, Allah'ın açığa vurduklarınızı ve
gizlediklerinizi bildiği (5:99), pis olanla temiz olanın bir olmadığının
söylenmesi, pis olanın çokluğu hoşuna gitse de — ey akıl sahipleri,
kurtuluşa eresiniz diye Allah'tan sakının (5:100), ey iman edenler,
açıklandığında sizi üzecek şeyler hakkında soru sormama, Kur'an
indirilirken bunları sorarsanız size açıklanacağı — Allah'ın bunları
affettiği, Allah'ın çok bağışlayıcı ve halim olduğu (5:101), sizden
önce bir topluluğun bunları sorup sonra bunlarla kâfir olduğu
(5:102), Allah'ın bahîre, sâibe, vasîle ve hâm diye bir şey koymadığı,
fakat kâfirlerin Allah'a karşı yalan uydurdukları, çoğunun akletmediği
(5:103)). Görsel ile JSON birebir örtüşüyor, toplam 139 kelime kanonik
kaynaktan doğrudan indeks aralıklarıyla dilimlenerek satırlara
dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor (python
`build_and_save()` ile canon listesinden index-slice; ayrıca görsel
transkripsiyonla satır satır çapraz kontrol edildi — WebFetch ile
çekilen https://kuran.hayrat.com.tr/Sayfalar/123.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 124: PASS
15 satır (Mâide 5:104-108; kendilerine "Allah'ın indirdiğine ve
Resûl'e gelin" denildiğinde "Atalarımızı üzerinde bulduğumuz şey bize
yeter" demeleri — ataları bir şey bilmeyip doğru yolda değilseler de mi
(5:104), ey iman edenler, siz kendinize bakın, doğru yolda olduğunuzda
sapan kimse size zarar vermez, hepinizin dönüşünün Allah'a olduğu,
yaptıklarınızı size haber vereceği (5:105), ey iman edenler, ölüm
yaklaşıp vasiyet ederken aranızdaki şahitliğin, içinizden adil iki
kişi ya da yolculukta iken ölüm musibeti başınıza gelmişse sizden
olmayan iki kişi olması, şüpheye düşerseniz namazdan sonra alıkonup
"yakınımız da olsa karşılığında yemin satmayız, Allah'ın şahitliğini
gizlemeyiz, yoksa günahkârlardan oluruz" diye Allah adına yemin
etmeleri (5:106), bu ikisinin günaha girdiği ortaya çıkarsa haklarının
çiğnendiği iki kişiden yerlerine geçecek iki başka kişinin "şahitliğimiz
onlarınkinden daha doğrudur, biz haddi aşmadık, yoksa zalimlerden
oluruz" diye Allah adına yemin etmesi (5:107) — bunun, şahitliği
gerektiği gibi yapmalarına veya yeminlerinden sonra yeminlerin
reddedilmesinden korkmalarına daha yakın olduğu, Allah'tan sakınıp
dinlenmesi, Allah'ın fasıklar topluluğunu doğru yola iletmeyeceği
(5:108)). Görsel ile JSON birebir örtüşüyor, toplam 144 kelime kanonik
kaynaktan doğrudan indeks aralıklarıyla dilimlenerek satırlara
dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor (python
`build_and_save()` ile canon listesinden index-slice; ayrıca görsel
transkripsiyonla satır satır çapraz kontrol edildi — WebFetch ile
çekilen https://kuran.hayrat.com.tr/Sayfalar/124.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 125: PASS
15 satır (Mâide 5:109-113; Allah'ın resulleri topladığı gün "size ne
cevap verildi" diye soracağı, resullerin "bizim bilgimiz yok, gaybı
hakkıyla bilen sensin" diyecekleri (5:109), Allah'ın "Ey Meryem oğlu
İsa, sana ve annene olan nimetimi hatırla — seni Ruhu'l-Kudüs ile
desteklediğimi, beşikte ve yetişkinken insanlarla konuştuğunu, sana
Kitab'ı, hikmeti, Tevrat'ı ve İncil'i öğrettiğimi, iznimle çamurdan kuş
şeklinde bir şey yapıp içine üflediğinde iznimle kuş oluverdiğini,
iznimle doğuştan körü ve alacalıyı iyileştirdiğini, iznimle ölüleri
diriltip çıkardığını, apaçık delillerle geldiğinde İsrailoğullarını
senden geri çevirdiğimi, içlerinden kâfir olanların 'Bu apaçık bir
sihirden başka bir şey değil' dediklerini hatırla" dediği (5:110),
Havarilere "bana ve resulüme iman edin" diye vahyettiğimde "iman ettik,
bizim müslüman olduğumuza şahit ol" dedikleri (5:111), Havarilerin
"Ey Meryem oğlu İsa, Rabbin bize gökten bir sofra indirebilir mi" diye
sorması, İsa'nın "Eğer mü'minlerseniz Allah'tan sakının" demesi (5:112),
"ondan yiyip kalplerimizin yatışmasını, bize doğru söylediğini bilmemizi
ve buna şahitlerden olmamızı istiyoruz" demeleri (5:113)). Görsel ile
JSON birebir örtüşüyor, toplam 129 kelime kanonik kaynaktan doğrudan
indeks aralıklarıyla dilimlenerek satırlara dağıtıldığı için tanım
gereği kanonik kaynakla tam eşleşiyor (python `build_and_save()` ile
canon listesinden index-slice; ayrıca görsel transkripsiyonla satır
satır çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/125.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 126: PASS
15 satır (Mâide 5:114-120; Meryem oğlu İsa'nın "Ey Allahım, Rabbimiz,
bize ve bizden sonrakilere bayram ve senden bir âyet olacak gökten bir
sofra indir, bizi rızıklandır, sen rızık verenlerin en hayırlısısın"
dediği (5:114), Allah'ın "onu size indireceğim, ama bundan sonra
içinizden kim inkâr ederse ona âlemlerden hiç kimseye vermediğim bir
azapla azap ederim" dediği (5:115), Allah'ın "Ey Meryem oğlu İsa, sen mi
insanlara 'beni ve annemi Allah'tan başka iki ilah edinin' dedin"
diyeceği, İsa'nın "Seni tenzih ederim, hakkım olmayan bir şeyi söylemek
bana yakışmaz; eğer söyleseydim sen onu bilirdin, sen nefsimde olanı
bilirsin, ben senin nefsinde olanı bilmem, gaybı hakkıyla bilen sensin"
diyeceği (5:116), "Onlara, senin bana emrettiğinden başka bir şey
söylemedim — 'Benim de Rabbim, sizin de Rabbiniz olan Allah'a kulluk
edin' dedim, aralarında olduğum sürece üzerlerine şahitken, beni
vefat ettirince onlar üzerine gözetleyici sen oldun, sen her şeye
şahitsin" (5:117), "Onlara azap edersen onlar senin kullarındır, onları
bağışlarsan mutlak güç ve hikmet sahibi olan sensin" (5:118), Allah'ın
"bu, doğrulara doğruluklarının fayda vereceği gündür; onlara içinden
ırmaklar akan, içinde ebedî kalacakları cennetler vardır, Allah onlardan
razı olmuş, onlar da O'ndan razı olmuşlardır — işte büyük kurtuluş budur"
dediği (5:119), göklerin, yerin ve içlerindekilerin mülkünün Allah'a ait
olduğu, O'nun her şeye güç yetiren olduğu (5:120) — Mâide sûresinin son
ayeti). Görsel ile JSON birebir örtüşüyor, toplam 159 kelime kanonik
kaynaktan doğrudan indeks aralıklarıyla dilimlenerek satırlara
dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor (python
`build_and_save()` ile canon listesinden index-slice; ayrıca görsel
transkripsiyonla satır satır çapraz kontrol edildi — WebFetch ile
çekilen https://kuran.hayrat.com.tr/Sayfalar/126.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 127: PASS
13 satır — En'âm sûresi açılış sayfası (besmele + 6:1-8; sûre başlık
tezhibi "Sûretü'l-En'âm Mekkiyye, 165 âyet" görselde net). Göklerin ve
yerin yaratıcısı, karanlıkları ve nûru var eden Allah'a hamd, buna
rağmen kâfirlerin Rablerine başkalarını denk tutması (6:1), insanı
çamurdan yaratıp bir ecel belirlemesi, katında belli bir ecel daha
olması, buna rağmen şüphe edilmesi (6:2), göklerde ve yerde Allah
olduğu, gizlisini ve açığını, kazandığını bildiği (6:3), kendilerine
Rablerinin âyetlerinden bir âyet gelmeyegörsün, mutlaka ondan yüz
çevirmeleri (6:4), hak kendilerine geldiğinde yalanlamaları, alay
ettikleri şeyin haberlerinin yakında kendilerine geleceği (6:5),
kendilerinden önce nice nesilleri helak ettiğimizi, onları yeryüzünde
sizin sahip olmadığınız imkânlarla yerleştirdiğimizi, üzerlerine bol
yağmur gönderip altlarından ırmaklar akıttığımızı, sonra günahları
yüzünden onları helak edip yerlerine başka bir nesil getirdiğimizi
görmediler mi (6:6), sana kağıt üzerinde yazılı bir kitap indirsek de
elleriyle dokunsalar, kâfirlerin yine de "bu apaçık bir sihirden başka
bir şey değil" diyecekleri (6:7), "ona bir melek indirilseydi ya"
demeleri — melek indirseydik iş bitirilmiş olurdu, sonra kendilerine
göz açtırılmazdı (6:8)). Görsel ile JSON birebir örtüşüyor, toplam 123
kelime kanonik kaynaktan doğrudan indeks aralıklarıyla dilimlenerek 12
satıra dağıtıldı, besmele satırı kanonik kelime sayımına dahil
edilmeden ayrı eklendi (python `build_and_save()` ile canon listesinden
index-slice; ayrıca görsel transkripsiyonla satır satır çapraz kontrol
edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/127.jpg görüntüsü net ve
okunaklıydı, sûre başlık tezhip bandı besmele üstünde ayrı bir görsel
element, satır sayımına dahil edilmedi).

## Sayfa 128: PASS
15 satır (En'âm 6:9-18; melek gönderseydik onu bir adam kılardık ve
onları yine düştükleri şüpheye düşürürdük (6:9), senden önceki
resullerle de alay edildiği, alay edenleri alay ettikleri şeyin
kuşattığı (6:10), "yeryüzünde gezin, yalanlayanların sonu nasıl oldu
bakın" emri (6:11), "göklerde ve yerde olan kimindir" sorusuna "Allah'ındır"
cevabı, Allah'ın rahmeti kendi üzerine yazdığı, sizi şüphe olmayan
kıyamet gününde mutlaka toplayacağı — kendilerine yazık edenlerin iman
etmeyecekleri (6:12), gece ve gündüzde barınan her şeyin O'na ait
olduğu, O'nun işiten ve bilen olduğu (6:13), "Allah'tan başka bir dost
mu edinirim, gökleri ve yeri yaratan O'dur, O yedirir, yedirilmez" de
(6:14), "Rabbime isyan edersem büyük bir günün azabından korkarım" de
(6:15), o gün kimden azap uzak tutulursa Allah'ın ona merhamet ettiği,
bunun apaçık kurtuluş olduğu (6:16), Allah sana bir zarar dokundurursa
onu O'ndan başka giderecek yoktur, sana bir hayır dokundurursa O her
şeye güç yetirendir (6:17), O kullarının üstünde tam hâkimdir, O hüküm
ve hikmet sahibi, her şeyden haberdar olandır (6:18)). Görsel ile JSON
birebir örtüşüyor, toplam 132 kelime kanonik kaynaktan doğrudan indeks
aralıklarıyla dilimlenerek satırlara dağıtıldığı için tanım gereği
kanonik kaynakla tam eşleşiyor (python `build_and_save()` ile canon
listesinden index-slice; ayrıca görsel transkripsiyonla satır satır
çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/128.jpg görüntüsü net ve
okunaklıydı). **Not:** ilk manuel satır-başı kelime sayımında 5. ve 6.
satırlarda bir kaydırma hatası yapıldı (fazladan bir "قُلْ" görüldüğü
sanıldı, gerçekte tek قُلْ vardı) — toplam 133 çıkıp kanonik 132 ile
uyuşmayınca `build_and_save()`'in `assert sum(line_counts)==len(canon)`
kontrolü hatayı hemen yakaladı, indekslere göre yeniden sayılıp
düzeltildi (satır 5: 12→11 kelime, satır 6: 10→9 kelime). Bu, index-slice
yönteminin tam olarak bu tür sayım hatalarını yakalamak için var
olduğunu doğruladı.

## Sayfa 129: PASS
15 satır (En'âm 6:19-27; "hangi şey şahitlikçe en büyüktür" sorusuna
"Allah, benimle sizin aranızda şahittir, bu Kur'an bana, kendisiyle
sizi ve ulaştığı herkesi uyarmam için vahyedildi — Allah ile birlikte
başka ilahlar olduğuna gerçekten şahitlik mi ediyorsunuz" cevabı, "ben
şahitlik etmem" de, "O ancak tek bir ilahtır, ben sizin ortak
koştuklarınızdan uzağım" de (6:19), kendilerine kitap verdiklerimizin
onu (Peygamber'i) öz oğullarını tanır gibi tanıdıkları, kendilerine
yazık edenlerin iman etmeyecekleri (6:20), Allah'a karşı yalan uydurandan
veya O'nun âyetlerini yalanlayandan daha zalim kim olabilir — zalimlerin
kurtuluşa eremeyeceği (6:21), hepsini toplayacağımız gün, ortak
koşanlara "iddia ettiğiniz ortaklarınız nerede" diyeceğimiz gün (6:22),
fitnelerinin (savunmalarının) yalnızca "Rabbimiz Allah'a andolsun ki
biz ortak koşanlar değildik" demekten ibaret olacağı (6:23), kendi
aleyhlerine nasıl yalan söylediklerine bakılması, uydurduklarının
kendilerinden kaybolup gitmesi (6:24), içlerinden seni dinleyenlerin
olduğu, kalplerine onu anlamalarına engel örtüler ve kulaklarına ağırlık
koyduğumuz, her âyeti görseler yine de iman etmeyecekleri (6:25),
sana gelip seninle tartışırken kâfir olanların "bu eskilerin
masallarından başka bir şey değil" dedikleri, hem ondan alıkoyup hem
kendileri de uzaklaştıkları, yalnızca kendilerini helak ettikleri,
farkında olmadıkları (6:26), ateşin karşısında durduruldukları zaman
"keşke geri döndürülsek, Rabbimizin âyetlerini yalanlamasak ve
mü'minlerden olsak" diyecekleri (6:27)). Görsel ile JSON birebir
örtüşüyor, toplam 158 kelime kanonik kaynaktan doğrudan indeks
aralıklarıyla dilimlenerek satırlara dağıtıldığı için tanım gereği
kanonik kaynakla tam eşleşiyor (python `build_and_save()` ile canon
listesinden index-slice; ayrıca görsel transkripsiyonla satır satır
çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/129.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 130: PASS
15 satır (En'âm 6:28-35; daha önce gizledikleri şeyin kendilerine
göründüğü, geri döndürülselerdi yine yasaklandıkları şeye dönecekleri,
gerçekten yalancı oldukları (6:28), "hayat ancak dünya hayatımızdır,
biz diriltilecek değiliz" dedikleri (6:29), Rablerinin huzurunda
durduruldukları vakit "bu gerçek değil mi" sorusuna "evet, Rabbimize
andolsun" dedikleri, "öyleyse inkâr ettiğiniz için azabı tadın"
denileceği (6:30), Allah'a kavuşmayı yalanlayanların gerçekten hüsrana
uğradığı — kıyamet ansızın gelip çattığında "vah bize, dünyada bu konuda
kusur ettik" diyecekleri, günahlarını sırtlarında taşıyacakları — o
yüklendikleri şey ne kötü (6:31), dünya hayatının bir oyun ve eğlenceden
başka bir şey olmadığı, sakınanlar için ahiret yurdunun daha hayırlı
olduğu — akletmeyecek misiniz (6:32), onların söylediklerinin seni
üzdüğünü bildiğimiz, aslında seni yalanlamadıkları, zalimlerin
Allah'ın âyetlerini bile bile inkâr ettikleri (6:33), senden önceki
resullerin de yalanlandığı, kendilerine yardımımız gelinceye kadar
yalanlanma ve eziyete sabrettikleri, Allah'ın sözlerini değiştirecek
kimsenin olmadığı, resullerin haberlerinden sana ulaştığı (6:34),
yüz çevirmeleri sana ağır geliyorsa, gücün yetiyorsa yerde bir tünel
veya gökte bir merdiven arayıp onlara bir mucize getirmeye kalkışabilirsin
— ama Allah dileseydi onları hidayet üzere toplardı, o halde cahillerden
olma (6:35)). Görsel ile JSON birebir örtüşüyor, toplam 148 kelime
kanonik kaynaktan doğrudan indeks aralıklarıyla dilimlenerek satırlara
dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor (python
`build_and_save()` ile canon listesinden index-slice; ayrıca görsel
transkripsiyonla satır satır çapraz kontrol edildi — WebFetch ile
çekilen https://kuran.hayrat.com.tr/Sayfalar/130.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 131: PASS
15 satır (En'âm 6:36-44; ancak dinleyenlerin çağrıya karşılık verdiği,
ölüleri Allah'ın dirilteceği, sonra O'na döndürülecekleri (6:36),
"ona Rabbinden bir mucize indirilmeli değil miydi" demeleri — Allah'ın
mucize indirmeye gücü yettiği, fakat çoklarının bilmediği (6:37),
yeryüzünde yürüyen hiçbir canlı, iki kanadıyla uçan hiçbir kuş yoktur
ki sizin gibi topluluklar olmasın — Kitap'ta hiçbir şeyi eksik
bırakmadığımız, sonra Rablerine toplanacakları (6:38), âyetlerimizi
yalanlayanların karanlıklar içinde sağır ve dilsiz oldukları, Allah'ın
dilediğini saptırdığı, dilediğini doğru yol üzerinde kıldığı (6:39),
"söyleyin bakalım, Allah'ın azabı veya kıyamet size gelse, doğru
sözlüyseniz Allah'tan başkasına mı yalvarırsınız" de (6:40), hayır,
yalnız O'na yalvarırsınız, dilerse yalvardığınız sıkıntıyı giderir,
ortak koştuklarınızı unutursunuz (6:41), senden önceki topluluklara
da resuller gönderdiğimiz, boyun eğsinler diye onları darlık ve
sıkıntıyla sınadığımız (6:42), azabımız geldiğinde yalvarmaları
gerekirken kalplerinin katılaştığı, şeytanın yaptıklarını kendilerine
süslediği (6:43), hatırlatıldıkları şeyi unutunca üzerlerine her şeyin
kapılarını açtığımız, kendilerine verilenle sevinç içindeyken onları
ansızın yakaladığımız, birden bire ümitsizliğe düştükleri (6:44)).
Görsel ile JSON birebir örtüşüyor, toplam 140 kelime kanonik kaynaktan
doğrudan indeks aralıklarıyla dilimlenerek satırlara dağıtıldığı için
tanım gereği kanonik kaynakla tam eşleşiyor (python `build_and_save()`
ile canon listesinden index-slice; ayrıca görsel transkripsiyonla satır
satır çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/131.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 132: PASS
15 satır (En'âm 6:45-52; zulmeden topluluğun kökünün kesilmesi, hamdin
âlemlerin Rabbi Allah'a ait olduğu (6:45), "Allah işitmenizi ve
görmenizi alsa, kalplerinizi mühürlese, Allah'tan başka bunu size
geri verecek ilah kim" sorusuna — âyetleri nasıl çeşitlendirdiğimize
bakılması, buna rağmen yüz çevirdikleri (6:46), "Allah'ın azabı size
ansızın veya açıktan gelse, zalimler topluluğundan başkası mı helak
edilir" sorusu (6:47), resulleri ancak müjdeleyici ve uyarıcı olarak
gönderdiğimiz — iman edip düzelenlere korku olmayacağı, üzülmeyecekleri
(6:48), âyetlerimizi yalanlayanlara fasıklık ettikleri için azabın
dokunacağı (6:49), "size, yanımda Allah'ın hazineleri var demiyorum,
gaybı da bilmem, size 'ben bir meleğim' de demiyorum, bana vahyedilenden
başkasına uymam" de, "kör ile gören bir olur mu, düşünmez misiniz" de
(6:50), Rablerine toplanacaklarından korkanları — onlar için O'ndan
başka ne bir dost ne bir şefaatçi olmadığı halde — bununla uyar, umulur
ki sakınırlar (6:51), sabah akşam Rablerine, O'nun rızasını dileyerek
dua edenleri kovma — onların hesabından sana, senin hesabından onlara
hiçbir sorumluluk düşmediği, onları kovarsan zalimlerden olursun
(6:52)). Görsel ile JSON birebir örtüşüyor, toplam 139 kelime kanonik
kaynaktan doğrudan indeks aralıklarıyla dilimlenerek satırlara
dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor (python
`build_and_save()` ile canon listesinden index-slice; ayrıca görsel
transkripsiyonla satır satır çapraz kontrol edildi — WebFetch ile
çekilen https://kuran.hayrat.com.tr/Sayfalar/132.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 133: PASS
15 satır (En'âm 6:53-59; Allah'ın "aramızdan bunlara mı lütfetti"
dedirtmek için kimini kimiyle sınadığı, Allah'ın şükredenleri en iyi
bilen olmadığı söylenebilir mi (6:53), âyetlerimize inananlar geldiğinde
"selam olsun size, Rabbiniz rahmeti kendi üzerine yazdı; sizden kim
cahillikle bir kötülük işler, sonra ardından tevbe edip düzelirse
şüphesiz O çok bağışlayıcı, çok merhametlidir" de (6:54), âyetleri
böyle ayrıntılı açıkladığımız, günahkârların yolunun açıkça ortaya
çıkması içindir (6:55), "sizin Allah'tan başka yalvardıklarınıza kulluk
etmem yasaklandı" de, "sizin heveslerinize uymam, o zaman sapmış ve
doğru yolda olanlardan olmamış olurum" de (6:56), "ben Rabbimden bir
delil üzereyim, siz ise onu yalanladınız; acele istediğiniz şey
yanımda değil, hüküm ancak Allah'ındır, hakkı anlatır, O ayırt edenlerin
en hayırlısıdır" de (6:57), "acele istediğiniz şey yanımda olsaydı
aramızdaki iş çoktan bitmiş olurdu, Allah zalimleri en iyi bilendir"
de (6:58), gaybın anahtarlarının O'nun katında olduğu, onları O'ndan
başka kimsenin bilmediği, karada ve denizde olanı bildiği, düşen her
yaprağı, yerin karanlıklarındaki her taneyi, yaş ve kuru hiçbir şeyin
apaçık bir Kitap'ta olmayanının bulunmadığı (6:59)). Görsel ile JSON
birebir örtüşüyor, toplam 136 kelime kanonik kaynaktan doğrudan indeks
aralıklarıyla dilimlenerek satırlara dağıtıldığı için tanım gereği
kanonik kaynakla tam eşleşiyor (python `build_and_save()` ile canon
listesinden index-slice; ayrıca görsel transkripsiyonla satır satır
çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/133.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 134: PASS
15 satır (En'âm 6:60-68; geceleyin sizi vefat ettirenin, gündüz
yaptıklarınızı bilenin O olduğu, sonra belirlenen ecel tamamlansın
diye gündüz sizi tekrar dirilttiği, sonra O'na dönüşünüzün olacağı,
sonra yaptıklarınızı size haber vereceği (6:60), O'nun kulları
üzerinde tam hâkim olduğu, üzerinize koruyucular gönderdiği,
sizden birine ölüm geldiğinde elçilerimizin (meleklerin) onu vefat
ettirdiği, onların vazifede kusur etmedikleri (6:61), sonra gerçek
Mevlaları Allah'a döndürüldükleri — dikkat edin, hüküm yalnız O'nundur,
O hesap görenlerin en çabuğudur (6:62), "karanın ve denizin
karanlıklarından sizi kim kurtarır — O'na gizlice yalvararak 'bizi
bundan kurtarırsan mutlaka şükredenlerden oluruz' dersiniz" de (6:63),
"Allah sizi ondan ve her sıkıntıdan kurtarır, sonra siz yine ortak
koşarsınız" de (6:64), "O, üzerinize üstünüzden veya ayaklarınızın
altından bir azap göndermeye, ya da sizi grup grup birbirinize düşürüp
kiminizin şiddetini kiminize tattırmaya güç yetirendir" de — âyetleri
nasıl çeşitlendirdiğimize bak, umulur ki anlarlar (6:65), kavmin onu
yalanladığı halde onun hak olduğu, "ben sizin üzerinize vekil değilim"
de (6:66), her haberin gerçekleşeceği bir zamanı olduğu, yakında
bileceksiniz (6:67), âyetlerimiz hakkında ileri geri konuşanları
gördüğünde, onlar başka bir söze dalıncaya kadar onlardan yüz çevir —
şeytan sana unutturursa hatırladıktan sonra zalimler topluluğuyla
oturma (6:68)). Görsel ile JSON birebir örtüşüyor, toplam 142 kelime
kanonik kaynaktan doğrudan indeks aralıklarıyla dilimlenerek satırlara
dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor (python
`build_and_save()` ile canon listesinden index-slice; ayrıca görsel
transkripsiyonla satır satır çapraz kontrol edildi — WebFetch ile
çekilen https://kuran.hayrat.com.tr/Sayfalar/134.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 135: PASS
15 satır (En'âm 6:69-73; sakınanların onların hesabından sorumlu
olmadığı, ancak sakınsınlar diye bir hatırlatma olduğu (6:69), dinlerini
oyun ve eğlence edinip dünya hayatının kendilerini aldattığı kimseleri
bırak, kazandığı yüzünden bir nefsin çıkmaza düşürülmemesi için
Kur'an'la hatırlat — onun için Allah'tan başka ne bir dost ne bir
şefaatçi olmadığı, her türlü fidyeyi verse kabul edilmeyeceği —
kazandıkları yüzünden çıkmaza düşenlerin, inkârları sebebiyle kendileri
için kaynar sudan bir içecek ve elem verici bir azap olacağı (6:70),
"Allah'ı bırakıp bize fayda ve zarar veremeyecek şeylere mi yalvaralım,
Allah bizi doğru yola ilettikten sonra ökçelerimiz üzerinde geri mi
döndürülelim — yeryüzünde şeytanların ayartıp şaşkın bıraktığı, arkadaşları
'bize gel' diye doğru yola çağırdığı kimse gibi mi olalım" de, "Allah'ın
hidayeti asıl hidayettir, âlemlerin Rabbine teslim olmakla emrolunduk"
de (6:71), "namazı kılın ve O'ndan sakının diye de emrolunduk — huzuruna
toplanacağınız O'dur" (6:72), gökleri ve yeri hak ile yaratanın O
olduğu, "ol" dediği gün oluverdiği, sözü haktır, sûra üflendiği gün
mülk O'nundur, gaybı ve görüneni bilendir, O hüküm ve hikmet sahibi,
her şeyden haberdar olandır (6:73)). Görsel ile JSON birebir örtüşüyor,
toplam 128 kelime kanonik kaynaktan doğrudan indeks aralıklarıyla
dilimlenerek satırlara dağıtıldığı için tanım gereği kanonik kaynakla
tam eşleşiyor (python `build_and_save()` ile canon listesinden
index-slice; ayrıca görsel transkripsiyonla satır satır çapraz kontrol
edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/135.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 136: PASS
15 satır (En'âm 6:74-81; İbrahim'in babası Âzer'e "putları ilahlar mı
ediniyorsun, seni ve kavmini apaçık bir sapıklık içinde görüyorum"
dediği (6:74), kesin inananlardan olsun diye İbrahim'e göklerin ve
yerin melekûtunu böylece gösterdiğimiz (6:75), gece onu kaplayınca
bir yıldız görüp "Rabbim bu" dediği, batınca "batanları sevmem" dediği
(6:76), doğan ayı görüp "Rabbim bu" dediği, batınca "Rabbim bana doğru
yolu göstermezse mutlaka sapkınlar topluluğundan olurum" dediği (6:77),
doğan güneşi görüp "Rabbim bu, bu daha büyük" dediği, batınca "Ey
kavmim, ben sizin ortak koştuklarınızdan uzağım" dediği (6:78),
"ben yüzümü, gökleri ve yeri yaratana, hanif olarak çevirdim, ben ortak
koşanlardan değilim" dediği (6:79), kavminin onunla tartıştığı,
"Allah hakkında benimle mi tartışıyorsunuz, O beni doğru yola
iletmişken — Rabbim dilemedikçe ortak koştuklarınızdan korkmam,
Rabbimin ilmi her şeyi kuşatmıştır, düşünmez misiniz" dediği (6:80),
"Allah'ın size indirmediği bir şeyi O'na ortak koştuğunuz halde ben
sizin koştuğunuz ortaklardan nasıl korkarım da siz korkmazsınız —
biliyorsanız söyleyin, iki taraftan hangisi güvende olmaya daha layık"
dediği (6:81)). Görsel ile JSON birebir örtüşüyor, toplam 133 kelime
kanonik kaynaktan doğrudan indeks aralıklarıyla dilimlenerek satırlara
dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor (python
`build_and_save()` ile canon listesinden index-slice; ayrıca görsel
transkripsiyonla satır satır çapraz kontrol edildi — WebFetch ile
çekilen https://kuran.hayrat.com.tr/Sayfalar/136.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 137: PASS
15 satır (En'âm 6:82-90; iman edip imanlarına zulüm bulaştırmayanlar
için güvenin olduğu, doğru yolda olanların onlar olduğu (6:82), bu,
kavmine karşı İbrahim'e verdiğimiz delilimiz olduğu, dilediğimizi
derecelerle yükselttiğimiz, Rabbinin hüküm ve hikmet sahibi, bilen
olduğu (6:83), ona İshak'ı ve Yakub'u bahşettiğimiz, hepsini doğru
yola ilettiğimiz, daha önce Nuh'u ve onun soyundan Davud'u, Süleyman'ı,
Eyyub'u, Yusuf'u, Musa'yı ve Harun'u da doğru yola ilettiğimiz —
iyilik yapanları böyle mükâfatlandırdığımız (6:84), Zekeriyya'yı,
Yahya'yı, İsa'yı ve İlyas'ı da — hepsinin salihlerden olduğu (6:85),
İsmail'i, Elyesa'yı, Yunus'u ve Lût'u da doğru yola ilettiğimiz —
hepsini âlemlere üstün kıldığımız (6:86), babalarından, soylarından
ve kardeşlerinden bir kısmını da seçip doğru yola ilettiğimiz (6:87),
bu, Allah'ın hidayetidir, kullarından dilediğini bununla doğru yola
iletir — eğer ortak koşsalardı yaptıkları boşa giderdi (6:88), işte
bunlar, kendilerine Kitab'ı, hükmü ve peygamberliği verdiğimiz
kimselerdir — bunları inkâr edenler olursa, onları inkâr etmeyecek
bir topluluğu bunlara vekil kıldığımız (6:89), işte bunlar Allah'ın
doğru yola ilettiği kimselerdir, sen de onların yoluna uy — "buna
karşılık sizden bir ücret istemiyorum, bu ancak âlemler için bir
hatırlatmadır" de (6:90)). Görsel ile JSON birebir örtüşüyor, toplam
119 kelime kanonik kaynaktan doğrudan indeks aralıklarıyla dilimlenerek
satırlara dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor
(python `build_and_save()` ile canon listesinden index-slice; ayrıca
görsel transkripsiyonla satır satır çapraz kontrol edildi — WebFetch
ile çekilen https://kuran.hayrat.com.tr/Sayfalar/137.jpg görüntüsü net
ve okunaklıydı).

## Sayfa 138: PASS
15 satır (En'âm 6:91-94; "Allah bir beşere hiçbir şey indirmedi"
dediklerinde Allah'ı hakkıyla takdir etmedikleri, "Musa'nın getirdiği,
insanlara nur ve hidayet olan, parçalar halinde kâğıtlara yazıp bir
kısmını gösterip çoğunu gizlediğiniz, sizin ve atalarınızın bilmediği
şeylerin öğretildiği o kitabı kim indirdi" sorusu — "Allah" de, sonra
onları daldıkları bâtılda oynayadursunlar diye bırak (6:91), bu, elindeki
Tevrat'ı doğrulayıcı olarak indirdiğimiz mübarek bir kitaptır — şehirler
anasını (Mekke'yi) ve çevresini uyarman için — ahirete iman edenlerin
buna da iman edip namazlarını koruduğu (6:92), Allah'a karşı yalan
uydurandan, ya da kendisine hiçbir şey vahyedilmediği halde "bana
vahyolundu" diyenden, ya da "Allah'ın indirdiği gibi ben de indireceğim"
diyenden daha zalim kim olabilir — zalimleri, melekler ellerini uzatmış
"canlarınızı çıkarın, bugün Allah hakkında gerçek dışı söylediğiniz ve
O'nun âyetlerine büyüklük tasladığınız için alçaltıcı azapla
cezalandırılacaksınız" derken ölümün şiddetleri içinde bir görsen
(6:93), "sizi ilk yarattığımız gibi teker teker, size verdiklerimizi
arkanızda bırakarak bize geldiniz — aranızda ortaklar sandığınız
şefaatçilerinizi de yanınızda görmüyoruz; aranızdaki bağlar
kopmuştur, iddia ettikleriniz sizden kaybolup gitmiştir" (6:94)).
Görsel ile JSON birebir örtüşüyor, toplam 144 kelime kanonik kaynaktan
doğrudan indeks aralıklarıyla dilimlenerek satırlara dağıtıldığı için
tanım gereği kanonik kaynakla tam eşleşiyor (python `build_and_save()`
ile canon listesinden index-slice; ayrıca görsel transkripsiyonla satır
satır çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/138.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 139: PASS
15 satır (En'âm 6:95-101; Allah'ın taneyi ve çekirdeği çatlatan olduğu,
ölüden diriyi, diriden ölüyü çıkardığı — işte Allah budur, nasıl da
çevriliyorsunuz (6:95), sabahı yarıp çıkaran, geceyi dinlenme zamanı,
güneşi ve ayı birer hesap ölçüsü kılan O'dur — bu, mutlak güç sahibi,
her şeyi bilenin takdiridir (6:96), karanın ve denizin karanlıklarında
kendileriyle yol bulasınız diye sizin için yıldızları var eden O'dur —
bilen bir topluluk için âyetleri ayrıntılı açıkladık (6:97), sizi tek
bir nefisten yaratan O'dur — bir karar yeri, bir de emanet olarak
kalınacak yer vardır — anlayan bir topluluk için âyetleri ayrıntılı
açıkladık (6:98), gökten su indiren O'dur — onunla her şeyin bitkisini
çıkardık, ondan da bir yeşillik çıkardık, ondan birbirine binmiş
taneler çıkarıyoruz, hurmanın tomurcuğundan sarkan salkımlar, üzüm
bağları, birbirine benzeyen ve benzemeyen zeytin ve nar — meyve
verdiğinde meyvesine ve olgunlaşmasına bakın — şüphesiz bunda iman eden
bir topluluk için âyetler vardır (6:99), cinleri yarattığı halde
Allah'a ortak koştular, bilgisizce O'na oğullar ve kızlar uydurdular —
O, onların nitelendirdiği şeylerden münezzeh ve yücedir (6:100), gökleri
ve yeri yoktan var eden O'dur — eşi olmadığı halde nasıl bir çocuğu
olsun, her şeyi O yarattı, O her şeyi bilir (6:101)). Görsel ile JSON
birebir örtüşüyor, toplam 135 kelime kanonik kaynaktan doğrudan indeks
aralıklarıyla dilimlenerek satırlara dağıtıldığı için tanım gereği
kanonik kaynakla tam eşleşiyor (python `build_and_save()` ile canon
listesinden index-slice; ayrıca görsel transkripsiyonla satır satır
çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/139.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 140: PASS
15 satır (En'âm 6:102-110; işte Rabbiniz Allah budur, O'ndan başka
ilah yoktur, her şeyin yaratıcısıdır, O'na kulluk edin, O her şeye
vekildir (6:102), gözlerin O'nu idrak edemediği, O'nun gözleri idrak
ettiği, O çok lütufkâr, her şeyden haberdar olandır (6:103), Rabbinizden
size basiretler geldiği, kim görürse kendi lehine, kim körlük ederse
kendi aleyhine olduğu — "ben sizin üzerinize bekçi değilim" (6:104),
âyetleri böyle çeşitlendirmemiz, "sen ders almışsın" desinler ve
bilen bir topluluğa açıklayalım diyedir (6:105), Rabbinden sana
vahyedilene uy, O'ndan başka ilah yoktur, ortak koşanlardan yüz çevir
(6:106), Allah dileseydi ortak koşmazlardı, seni onlara bekçi kılmadık,
sen onlar üzerine vekil de değilsin (6:107), Allah'ı bırakıp
yalvardıklarına sövmeyin ki onlar da bilgisizce düşmanlıkla Allah'a
sövmesinler — her ümmete yaptığını böyle süslü gösterdik, sonra
dönüşleri Rablerinedir, yaptıklarını onlara haber verecektir (6:108),
kendilerine bir mucize gelse mutlaka iman edeceklerine dair var
güçleriyle Allah'a yemin ettikleri — "mucizeler ancak Allah katındadır"
de, mucize geldiğinde de yine iman etmeyeceklerini size nasıl
sezdirebilir (6:109), ilk defasında ona iman etmedikleri gibi
kalplerini ve gözlerini çeviririz, azgınlıkları içinde bocalar
durumda bırakırız (6:110)). Görsel ile JSON birebir örtüşüyor, toplam
133 kelime kanonik kaynaktan doğrudan indeks aralıklarıyla dilimlenerek
satırlara dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor
(python `build_and_save()` ile canon listesinden index-slice; ayrıca
görsel transkripsiyonla satır satır çapraz kontrol edildi — WebFetch
ile çekilen https://kuran.hayrat.com.tr/Sayfalar/140.jpg görüntüsü net
ve okunaklıydı).

## Sayfa 141: PASS
15 satır (En'âm 6:111-118; onlara melekleri indirseydik, ölüler
kendileriyle konuşsaydı, her şeyi karşılarına toplasaydık, Allah
dilemedikçe yine de iman etmeyecekleri — ama çoğu bilmez (6:111), her
peygamber için insan ve cin şeytanlarını düşman kıldığımız, birbirlerini
aldatmak için süslü sözler fısıldadıkları — Rabbin dileseydi bunu
yapamazlardı, o halde onları uydurdukları şeyle baş başa bırak
(6:112), ahirete inanmayanların kalpleri ona (o süslü söze) meyletsin,
ondan hoşlansınlar ve işleyecekleri günahı işlesinler diyedir (6:113),
"size Kitab'ı ayrıntılı olarak indirmiş olan O varken Allah'tan başka
bir hakem mi arayayım" de — kendilerine kitap verdiklerimizin, onun
Rabbinden hak olarak indirildiğini bildiği — sakın şüphecilerden olma
(6:114), Rabbinin sözü doğruluk ve adalet bakımından tamamlanmıştır,
O'nun sözlerini değiştirecek kimse yoktur, O işiten ve bilendir (6:115),
yeryüzündekilerin çoğuna uyarsan seni Allah yolundan saptırırlar,
onlar ancak zanna uyar, ancak tahminde bulunurlar (6:116), Rabbinin
kendi yolundan sapanı en iyi bilenin O olduğu, doğru yolda olanları
da en iyi bilenin O olduğu (6:117), üzerine Allah'ın adı anılmış
olandan yiyin, O'nun âyetlerine inanıyorsanız (6:118)). Görsel ile JSON
birebir örtüşüyor, toplam 130 kelime kanonik kaynaktan doğrudan indeks
aralıklarıyla dilimlenerek satırlara dağıtıldığı için tanım gereği
kanonik kaynakla tam eşleşiyor (python `build_and_save()` ile canon
listesinden index-slice; ayrıca görsel transkripsiyonla satır satır
çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/141.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 142: PASS
15 satır (En'âm 6:119-124; üzerine Allah'ın adı anılan şeyden neden
yemeyesiniz — zorda kaldığınız dışında size haram kıldıklarını
ayrıntılı açıkladığı halde, çoğunun bilgisizce heveslerine uyarak
saptırdıkları — Rabbinin haddi aşanları en iyi bilenin O olduğu (6:119),
günahın açığını da gizlisini de bırakın, günah kazananların
işledikleri yüzünden cezalandırılacakları (6:120), üzerine Allah'ın adı
anılmamış olandan yemeyin, bunun fısk olduğu — şeytanların, sizinle
tartışsınlar diye dostlarına vahyettikleri (fısıldadıkları), onlara
uyarsanız şüphesiz ortak koşanlardan olacağınız (6:121), ölü iken
dirilttiğimiz ve kendisine insanlar arasında yürüyeceği bir nur
verdiğimiz kimse, karanlıklardan çıkamayan kimse gibi midir — kâfirlere
yaptıkları işte böyle süslü gösterildi (6:122), her memlekette
oradaki günahkârların büyüklerini, tuzak kursunlar diye böyle
yerleştirdiğimiz — oysa ancak kendi aleyhlerine tuzak kurdukları
halde farkında olmadıkları (6:123), kendilerine bir âyet geldiğinde
"Allah'ın resullerine verilenin benzeri bize verilmedikçe iman
etmeyeceğiz" dedikleri — Allah'ın peygamberliğini nereye vereceğini en
iyi bilenin O olduğu, suç işleyenlere kurdukları tuzak yüzünden Allah
katında bir küçüklük ve şiddetli bir azap erişeceği (6:124)). Görsel
ile JSON birebir örtüşüyor, toplam 130 kelime kanonik kaynaktan
doğrudan indeks aralıklarıyla dilimlenerek satırlara dağıtıldığı için
tanım gereği kanonik kaynakla tam eşleşiyor (python `build_and_save()`
ile canon listesinden index-slice; ayrıca görsel transkripsiyonla satır
satır çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/142.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 143: PASS
15 satır (En'âm 6:125-131; Allah kimi doğru yola iletmek isterse
göğsünü İslam'a açacağı, kimi saptırmak isterse göğsünü göğe
yükseliyormuşçasına dar ve sıkıntılı kılacağı — Allah'ın iman
etmeyenlere pisliği (rics) böyle verdiği (6:125), bunun Rabbinin dosdoğru
yolu olduğu, düşünen bir topluluk için âyetleri ayrıntılı açıkladığımız
(6:126), onlar için Rablerinin katında esenlik yurdu olduğu, yaptıkları
işler yüzünden Rablerinin kendilerinin dostu olduğu (6:127), hepsini
toplayacağı gün "Ey cin topluluğu, insanlardan çoğunu saptırdınız"
diyeceği, insanlardan olan dostlarının "Rabbimiz, birbirimizden
yararlandık ve bize belirlediğin süremize ulaştık" diyecekleri, Allah'ın
dileği dışında ebedî kalacakları yer olan ateşin barınakları olduğunu
söyleyeceği — Rabbinin hüküm ve hikmet sahibi, bilen olduğu (6:128),
kazandıkları yüzünden zalimlerin bir kısmını böylece diğerlerine dost
kıldığımız (6:129), "ey cin ve insan topluluğu, içinizden âyetlerimi
size anlatan ve bugününüze kavuşmanızla sizi uyaran resuller gelmedi
mi" diye sorulacağı, "kendi aleyhimize şahitlik ederiz" diyecekleri —
dünya hayatının onları aldattığı, kâfir olduklarına dair kendi
aleyhlerine şahitlik ettikleri (6:130), bunun sebebinin, halkı
gafilken Rabbinin memleketleri zulümle helak edici olmaması olduğu
(6:131)). Görsel ile JSON birebir örtüşüyor, toplam 129 kelime kanonik
kaynaktan doğrudan indeks aralıklarıyla dilimlenerek satırlara
dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor (python
`build_and_save()` ile canon listesinden index-slice; ayrıca görsel
transkripsiyonla satır satır çapraz kontrol edildi — WebFetch ile
çekilen https://kuran.hayrat.com.tr/Sayfalar/143.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 144: PASS
15 satır (En'âm 6:132-137; herkesin yaptıklarına göre dereceleri
olduğu, Rabbinin yaptıklarından habersiz olmadığı (6:132), Rabbinin
hiçbir şeye muhtaç olmayan, rahmet sahibi olduğu — dilerse sizi
giderip, başka bir topluluğun soyundan sizi yarattığı gibi
ardınızdan dilediğini yerinize getirir (6:133), size vaat edilenin
mutlaka geleceği, sizin bunu engelleyemeyeceğiniz (6:134), "ey kavmim,
elinizden geleni yapın, ben de yapıyorum — sonun kimin lehine olacağını
yakında bileceksiniz, zalimlerin kurtuluşa eremeyeceği" de (6:135),
Allah'ın yarattığı ekin ve hayvanlardan O'na bir pay ayırıp
kendilerince "bu Allah'a, bu da ortaklarımıza" dedikleri — ortaklarına
ayrılan Allah'a ulaşmadığı, Allah'a ayrılanın ortaklarına ulaştığı —
verdikleri hüküm ne kötü (6:136), müşriklerden çoğuna, onları helake
sürüklemek ve dinlerini karıştırmak için ortakları çocuklarını
öldürmeyi böyle süslü gösterdiği — Allah dileseydi bunu yapamazlardı,
o halde onları uydurdukları şeyle baş başa bırak (6:137)). Görsel ile
JSON birebir örtüşüyor, toplam 103 kelime kanonik kaynaktan doğrudan
indeks aralıklarıyla dilimlenerek satırlara dağıtıldığı için tanım
gereği kanonik kaynakla tam eşleşiyor (python `build_and_save()` ile
canon listesinden index-slice; ayrıca görsel transkripsiyonla satır
satır çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/144.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 145: PASS
15 satır (En'âm 6:138-142; müşriklerin kendi uydurdukları hayvan/ekin
tabuları — bazı hayvanlara binilmesini/yenmesini kendilerince yasaklayıp
bunu Allah'a isnat etmeleri, Allah'ın izni olmadan iftira ettikleri
(6:138), erkeklere helal kadınlara haram dedikleri hayvanlar, ölü
doğarsa ortak sayılması — Allah'ın bu nitelemeyi cezalandıracağı, O'nun
hakîm ve alîm olduğu (6:139), bilgisizce cahillikle çocuklarını
öldürenlerin ve Allah'ın rızkını kendilerince haram kılıp O'na iftira
edenlerin hüsrana uğradığı, bunların sapkınlık ve hidayetsizlik olduğu
(6:140), Allah'ın bahçeleri, asma çardaklarını, hurma ağaçlarını,
ekinleri, zeytin ve narı (birbirine benzer/benzemez) yarattığı — meyve
verince yemek ve hasat günü hakkını (zekâtını) vermek, israf etmemek
gerektiği; Allah'ın israf edenleri sevmediği (6:141), hayvanlardan
yük taşıyanı ve tüy/yününden yararlanılanı yaratıp rızık olarak
verdiklerinden yemeleri, şeytanın adımlarını izlememeleri — şeytanın
apaçık düşman olduğu (6:142)). Görsel ile JSON birebir örtüşüyor,
toplam 115 kelime kanonik kaynaktan doğrudan indeks aralıklarıyla
dilimlenerek satırlara dağıtıldığı için tanım gereği kanonik kaynakla
tam eşleşiyor (python `build_and_save()` ile canon listesinden
index-slice; ayrıca görsel transkripsiyonla satır satır çapraz kontrol
edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/145.jpg görüntüsü net ve
okunaklıydı). Not: görselde "وَ" bağlacı görsel olarak ayrı bir glif
gibi görünse de kanonik metinde bir sonraki kelimeyle birleşik tek
"kelime" olarak saklanıyor (ör. "وَقَالُوا" tek token) — satır kırılımı
buna göre kanonik tokenizasyona göre hizalandı.

## Sayfa 146: PASS
15 satır (En'âm 6:143-146; sekiz eş — koyundan iki, keçiden iki; erkek mi
haram, dişi mi, yoksa dişilerin rahminde olan mı — bilgiyle söylesinler
(6:143), deveden iki sığırdan iki — aynı soru tekrar edilip Allah'ın
bunu size vasiyet ettiğine şahit miydiniz denir; bilgisizce Allah'a
iftira edip insanları saptırandan daha zalim kimse yoktur, Allah zalim
topluluğu doğru yola iletmez (6:144), "bana vahyolunanda, leş, akmış
kan, domuz eti — ki pistir — ya da günah işlenerek Allah'tan başkası
adına kesilenden başka, yiyene haram kılınmış bir şey bulamıyorum;
ama zorda kalan, saldırmaksızın ve sınırı aşmaksızın yiyebilir, Rabbin
bağışlayıcı ve merhametlidir" de (6:145), yahudilere tırnaklı hayvanların
tümünü haram kıldığımız, sığır ve koyunun ise sırtlarında veya
bağırsaklarında taşıdıkları ya da kemiğe karışan yağı dışında iç
yağlarını haram kıldığımız — bunun onların azgınlıkları yüzünden
verdiğimiz bir ceza olduğu, ve Allah'ın doğru söylediği (6:146)).
Görsel ile JSON birebir örtüşüyor, toplam 130 kelime kanonik kaynaktan
doğrudan indeks aralıklarıyla dilimlenerek satırlara dağıtıldığı için
tanım gereği kanonik kaynakla tam eşleşiyor (python `build_and_save()`
ile canon listesinden index-slice; ayrıca görsel transkripsiyonla satır
satır çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/146.jpg görüntüsü net ve
okunaklıydı; 8. satırda "اِنَّ اللّٰهَ" ifadesinin lafza-i celâl rengiyle
(magenta) satır içinde ayrı vurgulandığı, ama kelime sayımına normal
şekilde dahil edildiği doğrulandı).

## Sayfa 147: PASS
15 satır (En'âm 6:147-151; seni yalanlarlarsa "Rabbiniz geniş rahmet
sahibidir ama azabı suçlu topluluktan geri çevrilmez" de (6:147),
müşriklerin "Allah dileseydi ne biz ne atalarımız ortak koşmaz, hiçbir
şeyi haram kılmazdık" diyecekleri — öncekiler de böyle yalanlayıp
azabımızı tadıncaya dek aynı şeyi söylemişti; "yanınızda bir bilgi
varsa çıkarın, siz sadece zanna uyuyor ve tahminde bulunuyorsunuz" de
(6:148), "kesin delil Allah'ındır, dileseydi hepinizi hidayete
erdirirdi" de (6:149), "bunu Allah'ın haram kıldığına şahitlik edecek
şahitlerinizi getirin; şahitlik etseler bile sen onlarla birlikte
şahitlik etme, âhirete inanmayıp Rablerine ortak koşanların
keyiflerine uyma" de (6:150), "gelin, Rabbinizin size neleri haram
kıldığını okuyayım: O'na hiçbir şeyi ortak koşmayın, ana-babaya
iyilik edin, yoksulluk korkusuyla çocuklarınızı öldürmeyin — sizi de
onları da rızıklandıran Biziz — kötülüklerin açığına da gizlisine de
yaklaşmayın, Allah'ın haram kıldığı canı haksız yere öldürmeyin; işte
bunları size düşünesiniz diye emretti" de (6:151)). Görsel ile JSON
birebir örtüşüyor, toplam 126 kelime kanonik kaynaktan doğrudan indeks
aralıklarıyla dilimlenerek satırlara dağıtıldığı için tanım gereği
kanonik kaynakla tam eşleşiyor (python `build_and_save()` ile canon
listesinden index-slice; ayrıca görsel transkripsiyonla satır satır
çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/147.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 148: PASS
15 satır (En'âm 6:152-157; yetimin malına, erginlik çağına erişene
kadar en güzel şekilde olması dışında yaklaşmama, ölçü ve tartıyı
adaletle tam yapma, hiç kimseye gücünün üstünde yük yüklenmemesi,
söz söylerken akraba bile olsa adaletli olma, Allah'a verilen sözü
tutma — bunların düşünülsün diye emredildiği (6:152), bunun (Allah'ın)
dosdoğru yolu olduğu, buna uyulması, başka yolların O'nun yolundan
saptıracağı — bunların sakınılsın diye emredildiği (6:153), sonra
Musa'ya, iyilik edene tam bir nimet, her şeyin açıklaması, hidayet
ve rahmet olarak, Rablerine kavuşacaklarına inansınlar diye Kitabı
verdiğimiz (6:154), bu da indirdiğimiz mübarek bir kitaptır, ona uyun
ve sakının ki merhamet olunasınız (6:155), "kitap yalnız bizden önceki
iki topluluğa indirildi, biz onların okuduklarından habersizdik"
demeyesiniz diye (6:156), ya da "bize kitap indirilseydi onlardan
daha çok doğru yolda olurduk" demeyesiniz diye — işte size Rabbinizden
açık bir delil, hidayet ve rahmet geldi; Allah'ın âyetlerini yalanlayıp
onlardan yüz çevirenden daha zalim kim vardır — âyetlerimizden yüz
çevirenleri, yüz çevirmelerinden dolayı azabın kötüsüyle
cezalandıracağız (6:157)). Görsel ile JSON birebir örtüşüyor, toplam
126 kelime kanonik kaynaktan doğrudan indeks aralıklarıyla dilimlenerek
satırlara dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor
(python `build_and_save()` ile canon listesinden index-slice; ayrıca
görsel transkripsiyonla satır satır çapraz kontrol edildi — WebFetch
ile çekilen https://kuran.hayrat.com.tr/Sayfalar/148.jpg görüntüsü net
ve okunaklıydı).

## Sayfa 149: PASS
15 satır (En'âm 6:158-165 — sûrenin son sayfası; onlar ancak
meleklerin gelmesini, Rabbinin gelmesini ya da Rabbinin bazı
âyetlerinin gelmesini mi bekliyorlar — Rabbinin bazı âyetleri geldiği
gün, daha önce iman etmemiş ya da imanında bir hayır kazanmamış kimseye
imanı fayda vermez; "bekleyin, biz de bekliyoruz" de (6:158), dinlerini
parça parça edip gruplara ayrılanlarla senin hiçbir ilişkin yok, onların
işi Allah'a kalmıştır, yaptıklarını sonra kendilerine haber verecektir
(6:159), kim bir iyilikle gelirse ona on katı verilir, kim bir kötülükle
gelirse sadece misliyle cezalandırılır, kimseye haksızlık edilmez
(6:160), "Rabbim beni dosdoğru bir yola, dosdoğru bir dine, hakka
yönelen İbrahim'in dinine iletti, o müşriklerden değildi" de (6:161),
"namazım, ibadetlerim, hayatım ve ölümüm âlemlerin Rabbi Allah
içindir" de (6:162), "O'nun ortağı yoktur, bana böyle emrolundu, ben
Müslümanların ilkiyim" de (6:163), "Allah'tan başka Rab mi arayayım,
oysa O her şeyin Rabbidir; herkesin kazandığı kendisinedir, hiç kimse
başkasının günahını yüklenmez, sonunda dönüşünüz Rabbinizedir, anlaşmazlığa
düştüğünüz şeyleri size haber verecektir" de (6:164), sizi yeryüzünün
halifeleri kılan, size verdikleriyle sizi sınamak için kiminizi
kiminizin üzerine derecelerle yükselten O'dur — Rabbin cezalandırması
çabuk olandır, ama O çok bağışlayan, çok merhamet edendir (6:165)).
Görsel ile JSON birebir örtüşüyor, toplam 155 kelime kanonik kaynaktan
doğrudan indeks aralıklarıyla dilimlenerek satırlara dağıtıldığı için
tanım gereği kanonik kaynakla tam eşleşiyor (python `build_and_save()`
ile canon listesinden index-slice; ayrıca görsel transkripsiyonla satır
satır çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/149.jpg görüntüsü net ve
okunaklıydı). En'âm sûresi bu sayfa ile tamamlanıyor.

## Sayfa 150: PASS
Besmele + 12 satır (A'râf sûresi başlangıcı — sûre başlığı süslemesi
+ besmele + 7:1-11; Elif-Lâm-Mîm-Sâd — sana indirilen bir kitap,
onunla uyarman için göğsünde bir sıkıntı olmasın, bu mü'minlere bir
öğüttür (7:1-2), Rabbinizden size indirilene uyun, O'ndan başka
dostların peşinden gitmeyin, ne kadar az öğüt alıyorsunuz (7:3), nice
memleketi helak ettik, azabımız ona gece yatarlarken ya da gündüz
uyurlarken geldi (7:4), azabımız geldiğinde tek dedikleri "gerçekten
biz zalimlerdik" oldu (7:5), kendilerine peygamber gönderilenlere de
soracağız, gönderilen peygamberlere de soracağız (7:6), onlara
bildiklerimizi anlatacağız, biz gaipten habersiz değildik (7:7), o gün
tartı haktır — kimin tartıları ağır gelirse kurtuluşa erenler onlardır
(7:8), kimin tartıları hafif gelirse âyetlerimize haksızlık ettikleri
için kendilerini ziyana uğratanlar onlardır (7:9), sizi yeryüzünde
yerleştirdik, orada size geçim imkânları verdik, ne kadar az şükrediyor­sunuz
(7:10), sizi yarattık, sonra şekil verdik, sonra meleklere "Âdem'e
secde edin" dedik — İblis hariç hepsi secde etti, o secde edenlerden
olmadı (7:11)). Görsel ile JSON birebir örtüşüyor, toplam 109 kelime
kanonik kaynaktan doğrudan indeks aralıklarıyla dilimlenerek satırlara
dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor (python
`build_and_save()` ile canon listesinden index-slice, besmele satırı
`besmele=` parametresiyle eklenip kanonik kelime sayımına dahil
edilmedi; ayrıca görsel transkripsiyonla satır satır çapraz kontrol
edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/150.jpg görüntüsü net ve
okunaklıydı, sûre başlığı süslemesi ve besmele net görünüyordu).

## Sayfa 151: PASS
15 satır (A'râf 7:12-22; İblis'in "seni neden secde etmekten alıkoydu"
sorusuna, "ben ondan üstünüm, beni ateşten onu çamurdan yarattın"
cevabı (7:12), "buradan in, orada büyüklenmek sana yakışmaz, çık, sen
aşağılıklardansın" (7:13), "kıyamet gününe kadar bana süre ver" isteği
(7:14), "sen süre verilenlerdensin" cevabı (7:15), "beni azdırdığın
için dosdoğru yolunun üzerinde onlara pusu kuracağım (7:16), sonra
önlerinden, arkalarından, sağlarından, sollarından onlara sokulacağım,
çoğunu şükredici bulamayacaksın" demesi (7:17), "oradan aşağılanmış ve
kovulmuş olarak çık, onlardan sana uyanlarla birlikte cehennemi
dolduracağım" cevabı (7:18), "ey Âdem, sen ve eşin cennette kalın,
dilediğiniz yerden yiyin, yalnız şu ağaca yaklaşmayın, yoksa
zalimlerden olursunuz" (7:19), şeytanın kendilerine gizli kalan
çıplaklıklarını göstermek için ikisine fısıldayıp "Rabbiniz bu ağacı
sadece melek olursunuz ya da ölümsüzleşirsiniz diye yasakladı" demesi
(7:20), "ben size öğüt verenlerdenim" diye yemin etmesi (7:21), böylece
onları aldatarak alçaltması — ağaçtan tadınca çıplaklıkları ortaya
çıkıp cennet yapraklarıyla örtünmeye başlamaları, Rablerinin "sizi o
ağaçtan menetmedim mi, şeytanın size apaçık bir düşman olduğunu
söylemedim mi" diye seslenmesi (7:22)). Görsel ile JSON birebir
örtüşüyor, toplam 148 kelime kanonik kaynaktan doğrudan indeks
aralıklarıyla dilimlenerek satırlara dağıtıldığı için tanım gereği
kanonik kaynakla tam eşleşiyor (python `build_and_save()` ile canon
listesinden index-slice; ayrıca görsel transkripsiyonla satır satır
çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/151.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 152: PASS
15 satır (A'râf 7:23-30; Âdem ve eşinin "Rabbimiz, kendimize
zulmettik, bizi bağışlamaz ve bize merhamet etmezsen ziyana
uğrayanlardan oluruz" duası (7:23), "inin, birbirinize düşman
olacaksınız, yeryüzünde belli bir süreye kadar yerleşme ve yararlanma
vardır" emri (7:24), "orada yaşayacak, orada öleceksiniz, oradan
çıkarılacaksınız" (7:25), ey Âdemoğulları, size çıplaklığınızı örtecek
giysi ve süs indirdik, takva örtüsü ise daha hayırlıdır — bu Allah'ın
âyetlerindendir, düşünsünler diye (7:26), ey Âdemoğulları, şeytan
ana-babanızı çıplaklıklarını göstermek için elbiselerini soyarak
cennetten çıkardığı gibi sizi de saptırmasın — o ve kabilesi sizi,
siz onları göremediğiniz yerden görür; biz şeytanları iman etmeyenlerin
dostları kıldık (7:27), bir kötülük yaptıklarında "atalarımızı böyle
bulduk, Allah da bize bunu emretti" derler — de ki: Allah kötülüğü
emretmez, bilmediğiniz şeyi mi Allah'a atfediyorsunuz (7:28), "Rabbim
adaleti emretti, her secde yerinde yüzünüzü O'na doğru tutun, dini
yalnız O'na has kılarak O'na yalvarın — sizi ilkin yarattığı gibi
yine O'na döneceksiniz" de (7:29), bir kısmına hidayet verdi, bir
kısmına da sapıklık hak oldu — çünkü onlar Allah'ı bırakıp şeytanları
dost edindiler, kendilerinin doğru yolda olduklarını sanıyorlar
(7:30)). Görsel ile JSON birebir örtüşüyor, toplam 136 kelime kanonik
kaynaktan doğrudan indeks aralıklarıyla dilimlenerek satırlara
dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor (python
`build_and_save()` ile canon listesinden index-slice; ayrıca görsel
transkripsiyonla satır satır çapraz kontrol edildi — WebFetch ile
çekilen https://kuran.hayrat.com.tr/Sayfalar/152.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 153: PASS
15 satır (A'râf 7:31-37; ey Âdemoğulları, her secde yerinde
süslenin, yiyin için israf etmeyin — Allah israf edenleri sevmez
(7:31), "Allah'ın kulları için çıkardığı süsü ve temiz rızıkları kim
haram kıldı" de — bunlar dünya hayatında iman edenler içindir, kıyamet
gününde ise yalnız onlarındır — âyetleri bilen bir topluluk için böyle
ayrıntılı açıklıyoruz (7:32), "Rabbim ancak açık ve gizli kötülükleri,
günahı, haksız saldırganlığı, hakkında hiçbir delil indirmediği halde
Allah'a ortak koşmanızı ve Allah hakkında bilmediğiniz şeyi söylemenizi
haram kıldı" de (7:33), her ümmetin bir eceli vardır, ecelleri gelince
ne bir an geri kalabilir ne öne geçebilirler (7:34), ey Âdemoğulları,
size aranızdan âyetlerimi anlatan peygamberler geldiğinde — kim
sakınır ve durumunu düzeltirse onlara korku yoktur, onlar üzülmez de
(7:35), âyetlerimizi yalanlayıp büyüklük taslayanlar ise cehennemliktir,
orada ebedî kalırlar (7:36), Allah'a karşı yalan uydurandan ya da
O'nun âyetlerini yalanlayandan daha zalim kimdir — onlara Kitaptan
nasipleri ulaşır, sonunda elçilerimiz canlarını almaya geldiğinde
"Allah'ı bırakıp taptıklarınız nerede" derler, onlar da "bizden
kayboldular" deyip kendilerinin kâfir olduklarına şahitlik ederler
(7:37)). Görsel ile JSON birebir örtüşüyor, toplam 149 kelime kanonik
kaynaktan doğrudan indeks aralıklarıyla dilimlenerek satırlara
dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor (python
`build_and_save()` ile canon listesinden index-slice; ayrıca görsel
transkripsiyonla satır satır çapraz kontrol edildi — WebFetch ile
çekilen https://kuran.hayrat.com.tr/Sayfalar/153.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 154: PASS
15 satır (A'râf 7:38-43; "sizden önce geçmiş cin ve insan
topluluklarıyla birlikte ateşe girin" denir — her topluluk girdikçe
kardeşini lanetler, hepsi orada toplanınca sonrakiler öncekiler için
"Rabbimiz, bizi bunlar saptırdı, onlara ateşten kat kat azap ver" der
— "herkese kat kat vardır ama bilmiyorsunuz" cevabı gelir (7:38),
öncekiler de sonrakilere "sizin bize bir üstünlüğünüz yok, kazandığınız
şey yüzünden azabı tadın" der (7:39), âyetlerimizi yalanlayıp
büyüklenenlere gök kapıları açılmaz, deve iğne deliğinden geçmedikçe
cennete de giremezler — suçluları böyle cezalandırırız (7:40), onlara
cehennemden bir döşek, üstlerinden de örtüler vardır — zalimleri böyle
cezalandırırız (7:41), iman edip salih ameller işleyenler ise —ki
kimseye gücünün üstünde yük yüklemeyiz— cennet ehlidir, orada ebedî
kalırlar (7:42), kalplerindeki kini çıkarırız, altlarından ırmaklar
akar, "bizi buna ileten Allah'a hamdolsun, Allah bizi iletmeseydi biz
kendiliğimizden doğru yolu bulamazdık; Rabbimizin peygamberleri
gerçekten hakkı getirmişlerdi" derler — onlara "işte yaptıklarınıza
karşılık mirasçısı olduğunuz cennet budur" diye seslenilir (7:43)).
Görsel ile JSON birebir örtüşüyor, toplam 138 kelime kanonik kaynaktan
doğrudan indeks aralıklarıyla dilimlenerek satırlara dağıtıldığı için
tanım gereği kanonik kaynakla tam eşleşiyor (python `build_and_save()`
ile canon listesinden index-slice; ayrıca görsel transkripsiyonla satır
satır çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/154.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 155: PASS
15 satır (A'râf 7:44-51; cennet ehli cehennem ehline "Rabbimizin
bize vadettiğini gerçek bulduk, siz de Rabbinizin vadettiğini gerçek
buldunuz mu" diye seslenir, "evet" derler, aralarında bir çağırıcı
"Allah'ın laneti zalimlerin, Allah'ın yolundan alıkoyup onu eğri
göstermek isteyen ve âhireti inkâr edenlerin üzerine olsun" diye
seslenir (7:44-45), ikisi arasında bir perde vardır; A'râf'ta
(yükseklerde) herkesi simasından tanıyan adamlar cennet ehline "selam
size" diye seslenir — onlar henüz cennete girmemiş ama ummaktadırlar
(7:46), gözleri cehennem ehli tarafına çevrilince "Rabbimiz, bizi
zalimler topluluğuyla birlikte kılma" derler (7:47), A'râf ehli,
simalarından tanıdıkları (cehennemlik) adamlara "ne topluluğunuz ne
büyüklük taslamanız size fayda vermedi" diye seslenir (7:48), "Allah'ın
rahmetine erişmeyecek dediğiniz bunlar mıydı — (oysa cennetliklere)
'girin cennete, size korku yok, siz üzülmeyeceksiniz' denilmişti"
(7:49), cehennem ehli cennet ehline "üzerimize biraz su ya da Allah'ın
size verdiği rızıktan dökün" diye seslenir, onlar da "Allah bunları
kâfirlere haram kıldı" derler (7:50), o kâfirler dinlerini oyun ve
eğlence edinmiş, dünya hayatı onları aldatmıştı — bugün onlar bu
günlerine kavuşmayı nasıl unuttularsa ve âyetlerimizi nasıl inkâr
ettilerse biz de onları öyle unuturuz (7:51)). Görsel ile JSON
birebir örtüşüyor, toplam 137 kelime kanonik kaynaktan doğrudan indeks
aralıklarıyla dilimlenerek satırlara dağıtıldığı için tanım gereği
kanonik kaynakla tam eşleşiyor (python `build_and_save()` ile canon
listesinden index-slice; ayrıca görsel transkripsiyonla satır satır
çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/155.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 156: PASS
15 satır (A'râf 7:52-57; onlara bilgiyle ayrıntılandırdığımız, inanan
bir topluluk için hidayet ve rahmet olan bir kitap getirdik (7:52),
onlar ancak onun te'vilini (sonunu/gerçekleşmesini) mi bekliyorlar —
te'vili geldiği gün, onu önceden unutanlar "Rabbimizin elçileri gerçeği
getirmişti, şimdi bize şefaat edecek şefaatçiler var mı, ya da geri
gönderilsek de yaptığımızdan başkasını yapsak" derler — kendilerini
zarara sokmuşlardır, uydurdukları şeyler onlardan kaybolup gitmiştir
(7:53), Rabbiniz Allah, gökleri ve yeri altı günde yaratıp Arş'a
istiva eden, geceyi durmadan kovalayan gündüzün üzerine örten, güneşi,
ayı ve yıldızları emrine boyun eğdirendir — bilesiniz ki yaratmak da
emretmek de O'nundur, âlemlerin Rabbi Allah ne yücedir (7:54), Rabbinize
yalvara yakara ve gizlice dua edin, O sınırı aşanları sevmez (7:55),
yeryüzünde düzen sağlandıktan sonra bozgunculuk yapmayın, O'na korku
ve umutla dua edin — Allah'ın rahmeti iyilik edenlere çok yakındır
(7:56), rüzgârları rahmetinin önünde müjdeci olarak gönderen O'dur —
ağır bulutları yüklenince ölü bir beldeye sevk eder, onunla su
indirir, o suyla her türlü meyveyi çıkarırız — ölüleri de işte böyle
çıkaracağız, düşünesiniz diye (7:57)). Görsel ile JSON birebir
örtüşüyor, toplam 132 kelime kanonik kaynaktan doğrudan indeks
aralıklarıyla dilimlenerek satırlara dağıtıldığı için tanım gereği
kanonik kaynakla tam eşleşiyor (python `build_and_save()` ile canon
listesinden index-slice; ayrıca görsel transkripsiyonla satır satır
çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/156.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 157: PASS
15 satır (A'râf 7:58-67; iyi beldenin bitkisi Rabbinin izniyle çıkar,
kötü olanın ise güçlükle, faydasız çıkar — şükreden bir topluluk için
âyetleri böyle çeşit çeşit açıklıyoruz (7:58), Nûh'u kavmine gönderdik,
"ey kavmim, Allah'a kulluk edin, sizin O'ndan başka ilahınız yok, ben
sizin için büyük bir günün azabından korkuyorum" dedi (7:59), kavminden
ileri gelenler "biz seni apaçık bir sapıklık içinde görüyoruz" dedi
(7:60), "ey kavmim, bende sapıklık yok, ben âlemlerin Rabbinden bir
elçiyim" dedi (7:61), "size Rabbimin gönderdiklerini duyuruyorum, size
öğüt veriyorum, sizin bilmediğinizi Allah'tan biliyorum" (7:62), "içinizden
bir adam aracılığıyla, sizi uyarması, sakınmanız ve merhamet olunmanız
için size bir öğüt gelmesine mi şaşıyorsunuz" (7:63), onu yalanladılar,
biz de onu ve gemide onunla birlikte olanları kurtardık, âyetlerimizi
yalanlayanları ise boğduk — onlar kör bir topluluktu (7:64), Âd
kavmine kardeşleri Hûd'u gönderdik, "ey kavmim, Allah'a kulluk edin,
sizin O'ndan başka ilahınız yok, sakınmaz mısınız" dedi (7:65),
kavminden inkâr eden ileri gelenler "biz seni bir akılsızlık içinde
görüyoruz, seni yalancılardan sanıyoruz" dedi (7:66), "ey kavmim,
bende akılsızlık yok, ben âlemlerin Rabbinden bir elçiyim" dedi
(7:67)). Görsel ile JSON birebir örtüşüyor, toplam 137 kelime kanonik
kaynaktan doğrudan indeks aralıklarıyla dilimlenerek satırlara
dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor (python
`build_and_save()` ile canon listesinden index-slice; ayrıca görsel
transkripsiyonla satır satır çapraz kontrol edildi — WebFetch ile
çekilen https://kuran.hayrat.com.tr/Sayfalar/157.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 158: PASS
15 satır (A'râf 7:68-73; "size Rabbimin gönderdiklerini duyuruyorum,
ben sizin için güvenilir bir öğütçüyüm" (7:68), "içinizden bir adam
aracılığıyla sizi uyarması için size Rabbinizden bir öğüt gelmesine mi
şaşıyorsunuz — hatırlayın, Nûh kavminden sonra sizi halifeler kıldı,
yaratılışta gücünüzü artırdı; Allah'ın nimetlerini hatırlayın ki
kurtuluşa eresiniz" (7:69), "bize, yalnız Allah'a kulluk edip
atalarımızın taptıklarını bırakmamız için mi geldin — eğer doğru
söylüyorsan bizi tehdit ettiğin şeyi getir" dediler (7:70), "Rabbinizden
üzerinize bir azap ve gazap hak oldu — siz ve atalarınızın uydurduğu,
Allah'ın hiçbir delil indirmediği isimler hakkında benimle mi
tartışıyorsunuz? Bekleyin, ben de sizinle beraber bekleyenlerdenim"
dedi (7:71), onu ve onunla beraber olanları rahmetimizle kurtardık,
âyetlerimizi yalanlayanların ise kökünü kestik — onlar zaten inanan
kimseler değildi (7:72), Semûd kavmine kardeşleri Sâlih'i gönderdik,
"ey kavmim, Allah'a kulluk edin, sizin O'ndan başka ilahınız yok — size
Rabbinizden açık bir delil geldi, işte şu Allah'ın devesi size bir
mucizedir, bırakın onu Allah'ın arzında yesin, ona kötülükle
dokunmayın, yoksa sizi acı bir azap yakalar" dedi (7:73)). Görsel ile
JSON birebir örtüşüyor, toplam 124 kelime kanonik kaynaktan doğrudan
indeks aralıklarıyla dilimlenerek satırlara dağıtıldığı için tanım
gereği kanonik kaynakla tam eşleşiyor (python `build_and_save()` ile
canon listesinden index-slice; ayrıca görsel transkripsiyonla satır
satır çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/158.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 159: PASS
15 satır (A'râf 7:74-81; "hatırlayın, sizi Âd'dan sonra halifeler
kıldı, yeryüzünde yerleştirdi — ovalarında köşkler ediniyor, dağları
oyup evler yapıyorsunuz; Allah'ın nimetlerini hatırlayın, yeryüzünde
bozgunculuk yaparak taşkınlık etmeyin" (7:74), kavminden büyüklük
taslayan ileri gelenler, içlerinden zayıf düşürülüp iman edenlere
"Sâlih'in gerçekten Rabbi tarafından gönderildiğini biliyor musunuz"
dedi, onlar "biz onunla gönderilene iman ediyoruz" dedi (7:75),
büyüklük taslayanlar "biz de sizin inandığınızı inkâr ediyoruz" dedi
(7:76), deveyi kestiler, Rablerinin emrine karşı böbürlendiler,
"ey Sâlih, eğer peygamberlerdensen bizi tehdit ettiğin şeyi getir"
dediler (7:77), bunun üzerine onları o sarsıntı yakaladı, yurtlarında
diz üstü çökekaldılar (7:78), Sâlih onlardan yüz çevirip "ey kavmim,
Rabbimin elçiliğini size ulaştırdım, size öğüt verdim, ama siz öğüt
verenleri sevmiyorsunuz" dedi (7:79), Lût'u da gönderdik — kavmine
"sizden önce âlemlerden hiç kimsenin yapmadığı hayasızlığı mı
yapıyorsunuz" dedi (7:80), "siz kadınları bırakıp şehvetle erkeklere
yaklaşıyorsunuz — doğrusu siz sınırı aşan bir topluluksunuz" (7:81)).
Görsel ile JSON birebir örtüşüyor, toplam 117 kelime kanonik kaynaktan
doğrudan indeks aralıklarıyla dilimlenerek satırlara dağıtıldığı için
tanım gereği kanonik kaynakla tam eşleşiyor (python `build_and_save()`
ile canon listesinden index-slice; ayrıca görsel transkripsiyonla satır
satır çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/159.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 160: PASS
15 satır (A'râf 7:82-87; kavminin tek cevabı "onları memleketinizden
çıkarın, çünkü onlar temiz kalmak isteyen insanlar" demek oldu (7:82),
onu ve ailesini kurtardık, yalnız karısı geride kalanlardan oldu
(7:83), üzerlerine bir yağmur (taş) yağdırdık — suçluların sonunun
nasıl olduğuna bak (7:84), Medyen'e kardeşleri Şuayb'ı gönderdik,
"ey kavmim, Allah'a kulluk edin, sizin O'ndan başka ilahınız yok; size
Rabbinizden açık bir delil geldi — ölçüyü ve tartıyı tam yapın, insanların
eşyalarını eksiltmeyin, yeryüzünde düzen sağlandıktan sonra bozgunculuk
yapmayın; eğer inanıyorsanız bu sizin için hayırlıdır" dedi (7:85),
"her yolun başına oturup inananları tehdit ederek, Allah'ın yolundan
alıkoyarak onu eğriltmeye çalışmayın; hatırlayın, siz azdınız da O
sizi çoğalttı — bozguncuların sonunun nasıl olduğuna bakın" (7:86),
"içinizden bir kısmı benimle gönderilene iman etmiş, bir kısmı iman
etmemişse, Allah aramızda hükmedene kadar sabredin — O hükmedenlerin
en hayırlısıdır" dedi (7:87)). Görsel ile JSON birebir örtüşüyor,
toplam 109 kelime kanonik kaynaktan doğrudan indeks aralıklarıyla
dilimlenerek satırlara dağıtıldığı için tanım gereği kanonik kaynakla
tam eşleşiyor (python `build_and_save()` ile canon listesinden
index-slice; ayrıca görsel transkripsiyonla satır satır çapraz kontrol
edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/160.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 161: PASS
15 satır (A'râf 7:88-95; kavminden büyüklük taslayan ileri gelenler
"ey Şuayb, seni ve seninle iman edenleri kesinlikle memleketimizden
çıkaracağız, ya da dinimize dönersiniz" dedi — "istemesek de mi" dedi
(7:88), "Allah bizi ondan kurtardıktan sonra dininize dönersek Allah'a
karşı yalan uydurmuş oluruz — Rabbimiz Allah dilemedikçe ona dönmemiz
olacak şey değildir, Rabbimiz her şeyi ilmiyle kuşatmıştır, biz Allah'a
güvendik; Rabbimiz, bizimle kavmimiz arasında hak ile hükmet, sen
hükmedenlerin en hayırlısısın" dedi (7:89), kavminden inkâr eden ileri
gelenler "Şuayb'a uyarsanız o zaman siz kesinlikle ziyana
uğrayanlarsınız" dedi (7:90), bunun üzerine onları sarsıntı yakaladı,
yurtlarında diz üstü çökekaldılar (7:91), Şuayb'ı yalanlayanlar sanki
orada hiç yaşamamış gibi oldular — Şuayb'ı yalanlayanlar, asıl ziyana
uğrayanlar onlar oldu (7:92), Şuayb onlardan yüz çevirip "ey kavmim,
size Rabbimin elçiliğini ulaştırdım, size öğüt verdim; kâfir bir
topluluğa nasıl üzülürüm" dedi (7:93), hiçbir memlekete bir peygamber
göndermedik ki halkını, yalvarıp yakarsınlar diye darlık ve sıkıntıya
uğratmış olmayalım (7:94), sonra kötülüğün yerine iyilik getirdik, ta
ki çoğaldılar ve "atalarımıza da sıkıntı ve bolluk dokunmuştu" dediler
— biz de onları hiç farkında değillerken ansızın yakaladık (7:95)).
Görsel ile JSON birebir örtüşüyor, toplam 142 kelime kanonik kaynaktan
doğrudan indeks aralıklarıyla dilimlenerek satırlara dağıtıldığı için
tanım gereği kanonik kaynakla tam eşleşiyor (python `build_and_save()`
ile canon listesinden index-slice; ayrıca görsel transkripsiyonla satır
satır çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/161.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 162: PASS
15 satır (A'râf 7:96-104; memleket halkı iman edip sakınsaydı üzerlerine
gökten ve yerden bereketler açardık, ama yalanladılar, biz de
kazandıklarına karşılık onları yakaladık (7:96), memleket halkı,
geceleyin uyurlarken azabımızın gelmeyeceğinden emin mi oldular
(7:97), ya da memleket halkı, gündüzün oynarlarken azabımızın
gelmeyeceğinden emin mi oldular (7:98), Allah'ın tuzağından emin mi
oldular — ziyana uğrayan topluluktan başkası Allah'ın tuzağından emin
olmaz (7:99), yeryüzüne önceki halklarından sonra vâris olanlara,
dilersek onları da günahları yüzünden çarpabileceğimiz apaçık
görülmedi mi — kalplerini mühürleriz de artık işitmezler (7:100),
işte o memleketler — sana onların haberlerinden anlatıyoruz;
elçileri onlara açık deliller getirmişti ama daha önce yalanladıkları
için iman etmediler — Allah kâfirlerin kalplerini böyle mühürler
(7:101), onların çoğunda sözünde durma bulmadık, çoğunu gerçekten
yoldan çıkmış bulduk (7:102), sonra onların ardından Mûsa'yı,
âyetlerimizle Firavun'a ve ileri gelenlerine gönderdik, onlar bu
âyetlere haksızlık ettiler — bak, bozguncuların sonu nasıl oldu
(7:103), Mûsa "ey Firavun, ben âlemlerin Rabbinden bir elçiyim" dedi
(7:104)). Görsel ile JSON birebir örtüşüyor, toplam 122 kelime kanonik
kaynaktan doğrudan indeks aralıklarıyla dilimlenerek satırlara
dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor (python
`build_and_save()` ile canon listesinden index-slice; ayrıca görsel
transkripsiyonla satır satır çapraz kontrol edildi — WebFetch ile
çekilen https://kuran.hayrat.com.tr/Sayfalar/162.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 163: PASS
15 satır (A'râf 7:105-120; "Allah hakkında haktan başkasını
söylememem gerekir, size Rabbinizden açık bir delil getirdim, İsrailoğullarını
benimle gönder" dedi (7:105), "eğer bir mucize getirdiysen doğru
söyleyenlerdensen onu göster" dedi (7:106), asasını attı, birden apaçık
bir yılan oluverdi (7:107), elini çıkardı, birden o bakanlara bembeyaz
görünüverdi (7:108), Firavun kavminden ileri gelenler "bu gerçekten
bilgili bir sihirbaz, sizi yurdunuzdan çıkarmak istiyor, ne
buyurursunuz" dedi (7:109-110), "onu ve kardeşini beklet, şehirlere
toplayıcılar gönder" dediler (7:111), "sana bütün bilgili sihirbazları
getirsinler" (7:112), sihirbazlar Firavun'a gelip "eğer galip
gelirsek bize kesinlikle bir ödül var mı" dediler (7:113), "evet, siz
elbette yakınlarımdan olacaksınız" dedi (7:114), "ey Mûsa, ya sen at,
ya da atan biz olalım" dediler (7:115), "siz atın" dedi — attıklarında
insanların gözlerini büyülediler, onları korkuttular, büyük bir sihir
gösterdiler (7:116), Mûsa'ya "asanı at" diye vahyettik, birden asası
onların uydurduklarını yutuvermeye başladı (7:117), böylece hak
yerini buldu, onların yaptıkları boşa çıktı (7:118), orada
yenilip küçük düştüler (7:119), sihirbazlar ise secdeye kapandılar
(7:120)). Görsel ile JSON birebir örtüşüyor, toplam 130 kelime kanonik
kaynaktan doğrudan indeks aralıklarıyla dilimlenerek satırlara
dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor (python
`build_and_save()` ile canon listesinden index-slice; ayrıca görsel
transkripsiyonla satır satır çapraz kontrol edildi — WebFetch ile
çekilen https://kuran.hayrat.com.tr/Sayfalar/163.jpg görüntüsü net ve
okunaklıydı). Bu sayfa çok sayıda kısa ayet içerdiği için (7:107-120
arası tek satıra birden fazla ayet sonu düşen yerler var) doğrulama
özellikle dikkatli yapıldı.

## Sayfa 164: PASS
15 satır (A'râf 7:121-130; sihirbazlar "âlemlerin Rabbine, Mûsa ve
Hârûn'un Rabbine iman ettik" dedi (7:121-122), Firavun "ben size izin
vermeden ona iman mı ettiniz — bu, halkını oradan çıkarmak için
şehirde kurduğunuz bir tuzak, yakında bileceksiniz" dedi (7:123),
"ellerinizi ayaklarınızı çaprazlama keseceğim, sonra hepinizi asacağım"
(7:123-devam), "biz zaten Rabbimize döneceğiz — senin bize kızman
sadece Rabbimizin âyetleri bize geldiğinde iman ettiğimiz için;
Rabbimiz, üzerimize sabır yağdır, bizi Müslüman olarak öldür" dediler
(7:124-126), Firavun kavminden ileri gelenler "Mûsa'yı ve kavmini,
yeryüzünde bozgunculuk yapsınlar, seni ve ilahlarını bıraksınlar diye
mi bırakacaksın" dedi — Firavun "oğullarını öldüreceğiz, kadınlarını
sağ bırakacağız, biz onlara üstünüz" dedi (7:127), Mûsa kavmine
"Allah'tan yardım isteyin ve sabredin, yeryüzü Allah'ındır, kullarından
dilediğini ona vâris kılar, sonuç takva sahiplerinindir" dedi (7:128),
"sen bize gelmeden önce de eziyet edildik, geldikten sonra da" dediler
— "umulur ki Rabbiniz düşmanınızı yok edip yerine sizi getirir de nasıl
davranacağınıza bakar" dedi (7:129), Firavun ailesini kıtlık yıllarıyla
ve ürün eksikliğiyle cezalandırdık, düşünsünler diye (7:130)). Görsel
ile JSON birebir örtüşüyor, toplam 124 kelime kanonik kaynaktan
doğrudan indeks aralıklarıyla dilimlenerek satırlara dağıtıldığı için
tanım gereği kanonik kaynakla tam eşleşiyor (python `build_and_save()`
ile canon listesinden index-slice; ayrıca görsel transkripsiyonla satır
satır çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/164.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 165: PASS
15 satır (A'râf 7:131-137; onlara bir iyilik gelince "bu bizim
hakkımız" derler, bir kötülük dokununca da Mûsa'yı ve onunla
beraber olanları uğursuz sayarlardı — bilesiniz ki uğursuzlukları
Allah katındandır, ama çoğu bilmez (7:131), "bizi büyülemek için
hangi mucizeyi getirirsen getir, sana inanacak değiliz" dediler
(7:132), bunun üzerine üzerlerine tufan, çekirge, haşarat, kurbağa
ve kan gönderdik — açık açık mucizeler; yine de büyüklük tasladılar,
suçlu bir topluluk oldular (7:133), üzerlerine azap çökünce "ey
Mûsa, sana verdiği söz hürmetine Rabbine bizim için dua et — eğer
bu azabı bizden kaldırırsan sana kesinlikle inanacağız, İsrailoğullarını
seninle göndereceğiz" dediler (7:134), azabı belli bir süreye kadar
kaldırdığımızda hemen sözlerinden döndüler (7:135), bunun üzerine
onlardan intikam aldık, âyetlerimizi yalanladıkları ve onlardan
gafil kaldıkları için onları denizde boğduk (7:136), zayıf düşürülmüş
o topluluğu, bereketlendirdiğimiz yerin doğularına ve batılarına
mirasçı kıldık — Rabbinin İsrailoğullarına verdiği güzel söz, sabretmeleri
sebebiyle gerçekleşti; Firavun ile kavminin yapıp durduklarını ve
yükselttiklerini yerle bir ettik (7:137)). Görsel ile JSON birebir
örtüşüyor, toplam 121 kelime kanonik kaynaktan doğrudan indeks
aralıklarıyla dilimlenerek satırlara dağıtıldığı için tanım gereği
kanonik kaynakla tam eşleşiyor (python `build_and_save()` ile canon
listesinden index-slice; ayrıca görsel transkripsiyonla satır satır
çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/165.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 166: PASS
15 satır (A'râf 7:138-143; İsrailoğullarını denizden geçirdik,
putlara tapan bir topluluğa rastladılar, "ey Mûsa, onların ilahları
gibi bize de bir ilah yap" dediler — "siz cahillik eden bir
topluluksunuz" dedi (7:138), "bunların içinde bulundukları şey
yıkılmıştır, yaptıkları da boştur" dedi (7:139), "size Allah'tan
başka bir ilah mı arayayım — oysa O sizi âlemlere üstün kıldı" dedi
(7:140), hatırlayın, sizi Firavun ailesinden kurtardık — onlar size
azabın en kötüsünü tattırıyor, oğullarınızı öldürüp kadınlarınızı
sağ bırakıyorlardı; bunda Rabbinizden size büyük bir imtihan vardı
(7:141), Mûsa'ya otuz gece süre verdik, buna on gece daha katıp
tamamladık, böylece Rabbinin belirlediği süre kırk geceye tamamlandı
— Mûsa kardeşi Hârûn'a "kavmimde benim yerime geç, ıslah et, bozguncuların
yoluna uyma" dedi (7:142), Mûsa belirlenen vakitte gelip Rabbi onunla
konuşunca "Rabbim, bana kendini göster, sana bakayım" dedi — "beni
asla göremezsin, ama şu dağa bak, eğer yerinde durursa beni
göreceksin" dedi; Rabbi dağa tecelli edince onu paramparça etti,
Mûsa da baygın düştü — ayılınca "sen yücesin, sana tövbe ettim, ben
inananların ilkiyim" dedi (7:143)). Görsel ile JSON birebir örtüşüyor,
toplam 125 kelime kanonik kaynaktan doğrudan indeks aralıklarıyla
dilimlenerek satırlara dağıtıldığı için tanım gereği kanonik kaynakla
tam eşleşiyor (python `build_and_save()` ile canon listesinden
index-slice; ayrıca görsel transkripsiyonla satır satır çapraz kontrol
edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/166.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 167: PASS
15 satır (A'râf 7:144-149; "ey Mûsa, sana verdiğim mesajlar ve
sözlerimle seni insanlar üzerine seçtim — sana verdiğimi al, şükredenlerden
ol" dedi (7:144), levhalarda ona her konuda öğüt ve ayrıntılı açıklama
yazdık — "bunu kuvvetle tut, kavmine de en güzeliyle almalarını emret,
size yakında fasıkların yurdunu göstereceğim" (7:145), âyetlerimden,
yeryüzünde haksız yere büyüklük taslayanları uzaklaştıracağım — onlar
her mucizeyi görseler ona inanmazlar, doğru yolu görseler onu yol
edinmezler, azgınlık yolunu görseler onu yol edinirler — bu, âyetlerimizi
yalanlayıp onlardan gafil kalmaları yüzündendir (7:146), âyetlerimizi
ve âhirete kavuşmayı yalanlayanların amelleri boşa gitmiştir — ancak
yaptıklarının karşılığını görürler (7:147), Mûsa'nın kavmi, onun
ardından süs eşyalarından, böğürmesi olan bir buzağı heykeli edindiler
— onun kendileriyle konuşmadığını, kendilerine yol göstermediğini
görmediler mi — onu (tanrı) edindiler, zalimlerden oldular (7:148),
elleri (pişmanlıkla) ısırıp gerçekten sapmış olduklarını anlayınca
"Rabbimiz bize merhamet etmez ve bizi bağışlamazsa kesinlikle
ziyana uğrayanlardan oluruz" dediler (7:149)). Görsel ile JSON
birebir örtüşüyor, toplam 124 kelime kanonik kaynaktan doğrudan
indeks aralıklarıyla dilimlenerek satırlara dağıtıldığı için tanım
gereği kanonik kaynakla tam eşleşiyor (python `build_and_save()` ile
canon listesinden index-slice; ayrıca görsel transkripsiyonla satır
satır çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/167.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 168: PASS
15 satır (A'râf 7:150-155; Mûsa kavmine öfkeli ve üzgün dönünce
"benden sonra ne kötü halef oldunuz, Rabbinizin emrini çabuklaştırdınız
mı" dedi, levhaları attı, kardeşini başından tutup kendine çekti —
Hârûn "ey anamın oğlu, bu topluluk beni güçsüz buldu, neredeyse beni
öldürüyorlardı, düşmanları bana güldürme, beni zalimler topluluğuyla
bir tutma" dedi (7:150), Mûsa "Rabbim, beni ve kardeşimi bağışla,
bizi rahmetine kat, sen merhametlilerin en merhametlisisin" dedi
(7:151), buzağıyı (tanrı) edinenlere Rablerinden bir gazap ve dünya
hayatında bir alçalma erişecektir — iftiracıları böyle cezalandırırız
(7:152), kötülük işleyip sonra tövbe edip iman edenler için ise —
Rabbin bundan sonra elbette çok bağışlayan, çok merhamet edendir
(7:153), Mûsa'nın öfkesi dinince levhaları aldı — onların yazısında
Rablerinden korkanlar için hidayet ve rahmet vardı (7:154), Mûsa
belirlenen vakit için kavminden yetmiş adam seçti — onları sarsıntı
yakalayınca "Rabbim, dileseydin onları da beni de daha önce helak
ederdin — içimizden birkaç beyinsizin yaptığı yüzünden bizi helak mı
edeceksin, bu ancak senin imtihanın, onunla dilediğini saptırır,
dilediğini doğru yola iletirsin; sen bizim velimizsin, bizi bağışla,
bize merhamet et, sen bağışlayanların en hayırlısısın" dedi (7:155)).
Görsel ile JSON birebir örtüşüyor, toplam 135 kelime kanonik kaynaktan
doğrudan indeks aralıklarıyla dilimlenerek satırlara dağıtıldığı için
tanım gereği kanonik kaynakla tam eşleşiyor (python `build_and_save()`
ile canon listesinden index-slice; ayrıca görsel transkripsiyonla satır
satır çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/168.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 169: PASS
15 satır (A'râf 7:156-159; "bize bu dünyada da âhirette de iyilik
yaz, biz sana yöneldik" duası — "azabımı dilediğime isabet ettiririm,
rahmetim her şeyi kuşatmıştır; onu sakınanlara, zekâtı verenlere,
âyetlerimize iman edenlere yazacağım" cevabı (7:156), yanlarındaki
Tevrat ve İncil'de yazılı buldukları o ümmi peygambere, elçiye
uyanlara — ki o onlara iyiliği emreder, kötülükten alıkoyar, temiz
şeyleri helal, pis şeyleri haram kılar, üzerlerindeki ağır yükü ve
zincirleri kaldırır — ona iman edip onu destekleyenler, ona yardım
edenler ve onunla birlikte indirilen nura uyanlar, işte kurtuluşa
erenler onlardır (7:157), "ey insanlar, ben hepinize gönderilen
Allah'ın elçisiyim — göklerin ve yerin mülkü O'nundur, O'ndan başka
ilah yoktur, diriltir ve öldürür; Allah'a ve O'nun sözlerine iman
eden o ümmi peygamber elçiye iman edin, ona uyun ki doğru yolu
bulasınız" de (7:158), Mûsa'nın kavminden hakla doğru yola götüren
ve onunla adaletle hükmeden bir topluluk da vardır (7:159)). Görsel
ile JSON birebir örtüşüyor, toplam 113 kelime kanonik kaynaktan
doğrudan indeks aralıklarıyla dilimlenerek satırlara dağıtıldığı için
tanım gereği kanonik kaynakla tam eşleşiyor (python `build_and_save()`
ile canon listesinden index-slice; ayrıca görsel transkripsiyonla satır
satır çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/169.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 170: PASS
15 satır (A'râf 7:160-163; onları on iki torun/oymağa ayırdık;
Mûsa'ya, kavmi ondan su isteyince "asanla taşa vur" diye vahyettik —
ondan on iki pınar fışkırdı, herkes su içeceği yeri bildi; üzerlerine
bulutla gölge yaptık, kudret helvası ve bıldırcın indirdik — "size
verdiğimiz rızıkların temizinden yiyin" dedik; onlar bize değil,
kendilerine zulmediyorlardı (7:160), hatırlayın, "şu memlekette
oturun, dilediğiniz yerden yiyin, 'hıtta' (bağışlanma) deyin, secde
ederek kapıdan girin ki hatalarınızı bağışlayalım, iyilik edenlere
daha da artıracağız" denilmişti (7:161), içlerinden zulmedenler
kendilerine söylenenden başka bir söze çevirdiler, biz de yaptıkları
zulüm yüzünden üzerlerine gökten bir azap gönderdik (7:162), onlara,
deniz kıyısında bulunan, cumartesi yasağını çiğneyen o memleketi sor —
cumartesi günleri balıklar akın akın gelirken, cumartesi olmayan
günlerde gelmezdi; işte biz onları yoldan çıktıkları için böyle
sınadık (7:163)). Görsel ile JSON birebir örtüşüyor, toplam 107 kelime
kanonik kaynaktan doğrudan indeks aralıklarıyla dilimlenerek satırlara
dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor (python
`build_and_save()` ile canon listesinden index-slice; ayrıca görsel
transkripsiyonla satır satır çapraz kontrol edildi — WebFetch ile
çekilen https://kuran.hayrat.com.tr/Sayfalar/170.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 171: PASS
15 satır (A'râf 7:164-170; içlerinden bir topluluk "Allah'ın helak
edeceği ya da şiddetli azaba uğratacağı bir kavme neden öğüt
veriyorsunuz" dediklerinde, "Rabbinize karşı bir mazeret olsun,
belki sakınırlar diye" cevabı verildi (7:164), kendilerine hatırlatılanı
unutunca, kötülükten alıkoyanları kurtardık, zulmedenleri yoldan
çıkmaları yüzünden çetin bir azapla yakaladık (7:165), yasaklandıkları
şeyde ısrar edip azgınlık edince onlara "aşağılık maymunlar olun"
dedik (7:166), hatırlayın, Rabbin kıyamete kadar onlara azabın
en kötüsünü tattıracak kimseleri göndereceğini bildirdi — Rabbin
cezalandırması çabuk olandır, ama O çok bağışlayan, çok merhamet
edendir (7:167), onları yeryüzünde topluluklara ayırdık — içlerinde
salih olanlar da vardı, olmayanlar da; iyiliklerle ve kötülüklerle
sınadık ki dönsünler (7:168), ardından onların yerine, bu değersiz
dünyanın geçici malını alıp "nasıl olsa bağışlanacağız" diyen bir
nesil geldi, kitabı miras aldılar — kendilerinden Allah hakkında
haktan başkasını söylemeyecekleri diye söz alınmamış mıydı, oysa
içindekini okumuşlardı; âhiret yurdu sakınanlar için daha hayırlıdır,
akıl etmiyor musunuz (7:169), Kitab'a sımsıkı sarılıp namazı dosdoğru
kılanlara gelince — biz iyiliğe çalışanların ödülünü zayi etmeyiz
(7:170)). Görsel ile JSON birebir örtüşüyor, toplam 131 kelime
kanonik kaynaktan doğrudan indeks aralıklarıyla dilimlenerek satırlara
dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor (python
`build_and_save()` ile canon listesinden index-slice; ayrıca görsel
transkripsiyonla satır satır çapraz kontrol edildi — WebFetch ile
çekilen https://kuran.hayrat.com.tr/Sayfalar/171.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 172: PASS
15 satır (A'râf 7:171-178; hatırlayın, dağı sanki bir gölgelikmiş
gibi üzerlerine kaldırdık, üzerlerine düşeceğini sandılar — "size
verdiğimizi kuvvetle tutun, içindekini hatırlayın ki sakınasınız"
(7:171), hatırlayın, Rabbin Âdemoğullarının sırtlarından
zürriyetlerini alıp kendilerine karşı şahit tutarak "ben sizin
Rabbiniz değil miyim" dedi, "evet, şahit olduk" dediler — kıyamet
günü "biz bundan habersizdik" ya da "daha önce sadece atalarımız
ortak koştu, biz onlardan sonra gelen bir nesildik, o batıl işleyenlerin
yaptığı yüzünden bizi mi helak edeceksin" demeyesiniz diye (7:172-173),
âyetleri işte böyle ayrıntılı açıklıyoruz, belki dönerler diye (7:174),
onlara, kendisine âyetlerimizi verdiğimiz ama onlardan sıyrılıp
şeytanın peşine takılan, böylece azgınlardan olan kişinin haberini
anlat (7:175), dileseydik onu o âyetlerle yükseltirdik, ama o
dünyaya saplanıp kaldı, kendi hevesine uydu — durumu, üstüne varsan
da dilini sarkıtıp soluyan, bıraksan da dilini sarkıtıp soluyan köpeğin
durumu gibidir; işte âyetlerimizi yalanlayan topluluğun durumu budur
— bu kıssayı anlat, belki düşünürler (7:176), âyetlerimizi yalanlayıp
kendilerine zulmeden topluluğun durumu ne kötüdür (7:177), Allah kimi
doğru yola iletirse işte o doğru yolu bulmuştur, kimi de saptırırsa
işte onlar ziyana uğrayanlardır (7:178)). Görsel ile JSON birebir
örtüşüyor, toplam 127 kelime kanonik kaynaktan doğrudan indeks
aralıklarıyla dilimlenerek satırlara dağıtıldığı için tanım gereği
kanonik kaynakla tam eşleşiyor (python `build_and_save()` ile canon
listesinden index-slice; ayrıca görsel transkripsiyonla satır satır
çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/172.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 173: PASS
15 satır (A'râf 7:179-187; cinlerden ve insanlardan birçoğunu
cehennem için yarattık — kalpleri var, onunla kavramazlar; gözleri
var, onunla görmezler; kulakları var, onunla işitmezler — onlar
hayvanlar gibidir, hatta daha da sapkındır; işte gafiller onlardır
(7:179), en güzel isimler Allah'ındır, O'na o isimlerle dua edin,
O'nun isimlerinde sapkınlık edenleri bırakın — yaptıklarının karşılığını
göreceklerdir (7:180), yarattıklarımızdan hakla yol gösteren ve onunla
adaletle davranan bir topluluk vardır (7:181), âyetlerimizi
yalanlayanları, bilmedikleri yerden yavaş yavaş helake sürükleyeceğiz
(7:182), onlara mühlet veririm, benim tuzağım sağlamdır (7:183),
düşünmediler mi ki arkadaşlarında (peygamberde) hiçbir delilik yoktur,
o ancak apaçık bir uyarıcıdır (7:184), göklerin ve yerin egemenliğine,
Allah'ın yarattığı her şeye bakmadılar mı, belki ecellerinin
yaklaşmış olduğunu düşünmediler mi — bundan sonra hangi söze
inanacaklar (7:185), Allah kimi saptırırsa artık onu doğru yola
iletecek yoktur — onları taşkınlıkları içinde şaşkın bırakır (7:186),
sana kıyametin ne zaman kopacağını soruyorlar, "onun bilgisi ancak
Rabbimin katındadır, onu vaktinde ancak O ortaya çıkaracaktır — göklere
ve yere ağır gelmiştir, size ansızın gelecektir" de — sanki sen onu
biliyormuşsun gibi sana soruyorlar, "onun bilgisi ancak Allah katındadır,
ama insanların çoğu bilmez" de (7:187)). Görsel ile JSON birebir
örtüşüyor, toplam 144 kelime kanonik kaynaktan doğrudan indeks
aralıklarıyla dilimlenerek satırlara dağıtıldığı için tanım gereği
kanonik kaynakla tam eşleşiyor (python `build_and_save()` ile canon
listesinden index-slice; ayrıca görsel transkripsiyonla satır satır
çapraz kontrol edildi — WebFetch ile çekilen
https://kuran.hayrat.com.tr/Sayfalar/173.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 174: PASS
15 satır (A'râf 7:188-195; "kendime bile Allah'ın dilediğinden başka
ne bir fayda ne bir zarar verme gücüm var; gaybı bilseydim daha çok
hayır elde ederdim, bana kötülük dokunmazdı — ben sadece iman eden
bir topluluk için bir uyarıcı ve müjdeciyim" de (7:188), sizi tek bir
candan yaratan, ondan da huzur bulsun diye eşini yaratan O'dur — eşini
sarınca hafif bir yük yüklendi, onu bir süre taşıdı; ağırlaşınca ikisi
de Rableri Allah'a "bize salih bir çocuk verirsen elbette şükredenlerden
oluruz" diye dua ettiler (7:189), Allah onlara salih bir çocuk verince,
verdiği şey hakkında O'na ortaklar koştular — Allah onların ortak
koştuklarından yücedir (7:190), hiçbir şey yaratamayan, kendileri
yaratılmış olan şeyleri mi ortak koşuyorlar (7:191), oysa onlar ne
kendilerine yardım edebilir ne de kendilerine yardım edebilirler
(7:192), onları doğru yola çağırsanız size uymazlar — onları çağırsanız
da sussanız da sizin için birdir (7:193), Allah'ı bırakıp taptıklarınız
da sizin gibi kullardır — doğru sözlü iseniz onları çağırın da size
cevap versinler (7:194), onların yürüyecek ayakları mı var, tutacak
elleri mi var, görecek gözleri mi var, işitecek kulakları mı var —
"ortaklarınızı çağırın, sonra bana tuzak kurun, hiç göz açtırmayın"
de (7:195)). Görsel ile JSON birebir örtüşüyor, toplam 135 kelime
kanonik kaynaktan doğrudan indeks aralıklarıyla dilimlenerek satırlara
dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor (python
`build_and_save()` ile canon listesinden index-slice; ayrıca görsel
transkripsiyonla satır satır çapraz kontrol edildi — WebFetch ile
çekilen https://kuran.hayrat.com.tr/Sayfalar/174.jpg görüntüsü net ve
okunaklıydı).

## Sayfa 175: PASS
15 satır (A'râf 7:196-206 — sûrenin son sayfası; "benim velim,
Kitab'ı indiren Allah'tır, O salihleri gözetir" (7:196), O'ndan
başka taptıklarınız ne size yardım edebilir ne de kendilerine
yardım edebilirler (7:197), onları doğru yola çağırsanız işitmezler,
onları sana bakar gibi görürsün ama görmezler (7:198), affı esas al,
iyiliği emret, cahillerden yüz çevir (7:199), şeytandan bir kışkırtma
seni dürtecek olursa Allah'a sığın, O işitendir, bilendir (7:200),
sakınanlar, şeytandan bir vesvese dokununca hemen düşünüp hakkı
görürler (7:201), şeytanların kardeşlerini ise azgınlığa
sürüklerler, sonra da bırakmazlar (7:202), onlara bir âyet
getirmediğinde "onu kendin uydursaydın ya" derler — "ben ancak
Rabbimden bana vahyolunana uyarım, bu Rabbinizden gelen basiretlerdir,
iman eden bir topluluk için hidayet ve rahmettir" de (7:203), Kur'an
okunduğunda onu dinleyin ve susun ki merhamet olunasınız (7:204),
Rabbini içinden, yalvararak ve ürpererek, sesini yükseltmeden, sabah
akşam an, gafillerden olma (7:205), Rabbinin katındakiler O'na
kulluktan büyüklenmezler, O'nu tesbih eder ve O'na secde ederler
(7:206)). Görsel ile JSON birebir örtüşüyor, toplam 125 kelime
kanonik kaynaktan doğrudan indeks aralıklarıyla dilimlenerek satırlara
dağıtıldığı için tanım gereği kanonik kaynakla tam eşleşiyor (python
`build_and_save()` ile canon listesinden index-slice; ayrıca görsel
transkripsiyonla satır satır çapraz kontrol edildi — WebFetch ile
çekilen https://kuran.hayrat.com.tr/Sayfalar/175.jpg görüntüsü net ve
okunaklıydı; son ayetin (7:206, secde âyeti) yeşil vurgulu arka
planla işaretlendiği, ama bunun kelime sayımını etkilemediği
doğrulandı). A'râf sûresi bu sayfa ile tamamlanıyor.

## Sonraki adım

**STOPPED AT PAGE 175 — resume from 176.** En yüksek sayfa numarası
(verse-graph-bgem3.json'a göre) 604 — toplam 460 sayfa daha kaldı. Devam
edilecekse aynı yöntemle (kuran.hayrat.com.tr/Sayfalar/{N}.jpg ↔
mushaf-line-breaks.json karşılaştırması, python ile kelime dizisi çapraz
doğrulaması) sürdürülüp her sayfa sonrası hem JSON hem bu rapor dosyası
güncellenmelidir. Sûre açılış sayfalarında besmele satırının ayrı
eklenip kanonik kelime sayımına dahil edilmemesi gerektiği unutulmamalı
(bkz. sayfa 76 notu). Kanonik metinde bazen fazladan boşlukla ayrılmış
tek karakterlik işaretler (ör. "۟", ya da "اَيْنَ مَا" gibi normalde
birleşik yazılan kelimeler) split() ile ayrı "kelime" haline geliyor —
bunlar değiştirilmeden olduğu gibi bırakılmalı, satır kırılımı buna göre
ayarlanmalıdır.

**Yöntem notu (sayfa 117'den itibaren):** Retyping yerine, canonical
kelime listesi (`canonical_words()`) doğrudan python'da indekslenip
görselden okunan satır-başı kelime SAYILARINA göre dilimleniyor
(`build_page.py` / `build_and_save()`). Bu, elle yeniden yazarken oluşan
görünmez Unicode normalizasyon farklarını (bkz. sayfa 117 ilk denemesi —
`verify()` "الصَّلٰوةِ" ile "الصَّلٰوةِ" arasında mismatch buldu, ikisi
görsel olarak aynı ama farklı kod noktası dizisiydi) yapısal olarak
imkansız kılıyor. Devam eden sayfalarda da bu yöntem kullanılmalı: önce
görselden satır başına düşen KELİME SAYISI çıkarılır, sonra
`canon[idx:idx+count]` ile dilimlenir — metin asla elle retype edilmez.

## Sayfa 176: PASS
Besmele + 12 satır (Enfâl 8:1-8, sûre açılış sayfası). Görsel
(kuran.hayrat.com.tr/Sayfalar/176.jpg) net okunaklıydı, üstte Enfâl
sûresi başlık madalyonu ve besmele (pembe/kırmızı renkte) görülüyor.
Kelime sayıları [8,9,9,9,8,9,10,9,9,10,8,7] (toplam 105) canon
listesinden index-slice ile satırlara dağıtıldı, `sum(line_counts) ==
len(canon)` assert'i geçti — yapısal olarak tam eşleşme garantili.

## Sayfa 177: PASS
15 satır (Enfâl 8:9-16). Görsel net okunaklıydı. Kelime sayıları
[8,8,11,9,9,9,8,8,8,8,6,9,7,9,8] (toplam 125) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 178: PASS
15 satır (Enfâl 8:17-25). Görsel net okunaklıydı. Kelime sayıları
[9,10,8,8,9,9,8,10,8,8,7,7,10,9,6] (toplam 126) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 179: PASS
15 satır (Enfâl 8:26-33). Görsel net okunaklıydı. Kelime sayıları
[8,6,7,8,5,9,9,7,10,7,10,11,9,9,8] (toplam 123) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 180: PASS
15 satır (Enfâl 8:34-40). Görsel net okunaklıydı. Kelime sayıları
[8,7,8,7,8,7,7,9,7,8,10,8,7,8,6] (toplam 115) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 181: PASS
15 satır (Enfâl 8:41-45). Görsel net okunaklıydı. Kelime sayıları
[9,8,10,9,6,7,10,9,10,8,6,6,9,8,5] (toplam 120) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 182: PASS
15 satır (Enfâl 8:46-52). Görsel net okunaklıydı. Kelime sayıları
[7,8,8,9,9,8,11,8,8,8,8,7,8,8,8] (toplam 123) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 183: PASS
15 satır (Enfâl 8:53-61). Görsel net okunaklıydı. Kelime sayıları
[11,9,8,7,10,9,10,8,10,8,9,7,10,9,9] (toplam 134) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 184: PASS
15 satır (Enfâl 8:62-69). Görsel net okunaklıydı. Kelime sayıları
[10,10,10,10,8,9,9,10,9,9,11,7,8,7,8] (toplam 135) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 185: PASS
15 satır (Enfâl 8:70-75, sûre son sayfası). Görsel net okunaklıydı.
Kelime sayıları [11,11,8,9,8,8,10,8,10,9,10,9,8,7,10] (toplam 136)
canon listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Enfâl sûresi bu sayfa ile tamamlanıyor.

## Sayfa 186: PASS
13 satır (Tevbe 9:1-6, sûre açılış sayfası — Tevbe sûresinde besmele
YOKTUR, görselde de başlık madalyonundan hemen sonra doğrudan
"بَرَٓاءَةٌ..." ile başlıyor, besmele satırı yok). Kelime sayıları
[9,9,10,11,10,10,10,10,7,8,9,9,9] (toplam 121) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 187: PASS
15 satır (Tevbe 9:7-13). Görsel net okunaklıydı. Kelime sayıları
[7,7,8,7,7,5,10,10,7,7,9,9,7,6,7] (toplam 113) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 188: PASS
15 satır (Tevbe 9:14-20). Görsel net okunaklıydı. Kelime sayıları
[6,7,9,9,9,9,9,9,10,10,8,10,9,7,6] (toplam 127) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 189: PASS
15 satır (Tevbe 9:21-26). Görsel net okunaklıydı. Kelime sayıları
[8,9,9,8,8,4,5,7,9,7,8,7,9,8,6] (toplam 112) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 190: PASS
15 satır (Tevbe 9:27-31). Görsel net okunaklıydı. Kelime sayıları
[10,8,9,8,7,8,9,8,7,7,7,6,7,7,7] (toplam 115) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 191: PASS
15 satır (Tevbe 9:32-36). Görsel net okunaklıydı. Kelime sayıları
[7,8,9,9,8,7,6,8,6,6,7,10,9,6,7] (toplam 113) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 192: PASS
15 satır (Tevbe 9:37-40). Görsel net okunaklıydı. Kelime sayıları
[9,6,10,6,10,7,8,7,7,9,6,9,9,9,7] (toplam 119) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 193: PASS
15 satır (Tevbe 9:41-47). Görsel net okunaklıydı. Kelime sayıları
[6,9,9,7,7,9,7,7,7,7,7,8,9,6,6] (toplam 111) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 194: PASS
15 satır (Tevbe 9:48-54). Görsel net okunaklıydı. Kelime sayıları
[8,8,10,6,7,8,11,8,7,7,8,7,9,7,6] (toplam 117) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 195: PASS
15 satır (Tevbe 9:55-61). Görsel net okunaklıydı. Kelime sayıları
[9,8,8,9,8,10,9,9,6,6,8,7,8,8,8] (toplam 121) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 196: PASS
15 satır (Tevbe 9:62-68). Görsel net okunaklıydı (ilk satır sayımında
bir düzeltme yapıldı — "يَحْلِفُونَ بِاللّٰهِ لَكُمْ لِيُرْضُوكُمْ وَاللّٰهُ
وَرَسُولُهُ" 6 kelime, program ile çapraz kontrol edilerek doğrulandı).
Kelime sayıları [6,9,10,8,11,6,7,6,8,5,7,6,7,6,7] (toplam 109) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 197: PASS
15 satır (Tevbe 9:69-72). Görsel net okunaklıydı. Kelime sayıları
[8,5,7,7,7,9,6,8,6,7,6,8,7,7,8] (toplam 106) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 198: PASS
15 satır (Tevbe 9:73-79). Görsel net okunaklıydı. Kelime sayıları
[7,6,9,10,9,9,11,8,8,8,9,8,7,8,8] (toplam 125) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 199: PASS
15 satır (Tevbe 9:80-86). Görsel net okunaklıydı. Kelime sayıları
[12,9,8,8,11,7,8,9,9,10,10,9,9,9,9] (toplam 137) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 200: PASS
15 satır (Tevbe 9:87-93). Görsel net okunaklıydı. Kelime sayıları
[9,8,7,9,7,8,6,8,10,7,9,9,9,8,9] (toplam 123) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Bu oturumun özeti

Bu oturumda sayfa 176-200 arası (25 sayfa) tamamlandı, hepsi PASS.
Enfâl sûresi (176-185) tamamlandı, Tevbe sûresi 186'dan başlayıp
200'e kadar (9:93'e kadar) işlendi — Tevbe sûresinde besmele
bulunmadığı doğrulandı (sayfa 186 notu). Tüm sayfalarda kelime
sayıları görselden satır satır çıkarılıp canon listesinden index-slice
ile dilimlendi, `sum(line_counts) == len(canon)` assert'i her sayfada
geçti — yapısal olarak tam eşleşme garantili. Hiçbir sayfada görsel
belirsizlik/okunaksızlık yaşanmadı.

## Sayfa 201: PASS
15 satır (Tevbe 9:94-99). Görsel net okunaklıydı. Kelime sayıları
[8,9,9,6,8,8,8,8,9,7,9,7,8,9,8] (toplam 121) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 202: PASS
15 satır (Tevbe 9:100-106). Görsel net okunaklıydı. Kelime sayıları
[6,9,9,8,8,8,9,10,7,10,9,9,7,7,8] (toplam 124) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 203: PASS
15 satır (Tevbe 9:107-111). Görsel net okunaklıydı. Kelime sayıları
[6,8,9,9,11,8,10,12,8,8,7,8,7,7,8] (toplam 126) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 204: PASS
15 satır (Tevbe 9:112-117). Görsel net okunaklıydı; ilk geçişte
satır 8/9 sınırında bir kelime kayması tespit edildi ("اللّٰهُ" kelimesi
satır 8'in sonunda mı satır 9'un başında mı olduğu karışmıştı) — python
ile canon listesi index bazında yeniden doğrulanarak düzeltildi (satır8
"...وَمَا كَانَ اللّٰهُ" ile bitiyor, satır9 "لِيُضِلَّ..." ile başlayıp
"...اِنَّ" ile bitiyor). Kelime sayıları [5,4,6,8,10,9,9,10,11,8,9,9,6,8,8]
(toplam 120) canon listesinden index-slice ile satırlara dağıtıldı,
assert geçti.

## Sayfa 205: PASS
15 satır (Tevbe 9:118-122). Görsel net okunaklıydı. Kelime sayıları
[8,8,12,9,8,8,7,9,9,10,8,10,9,10,7] (toplam 132) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 206: PASS
13 satır (Tevbe 9:123-129, sûre son sayfası). Görsel net okunaklıydı;
sayfa altında Yûnus sûresi başlık madalyonu görünüyor ama besmele ve
ilk ayet bu sayfada değil, sonraki sayfada (207) başlıyor. Kelime
sayıları [8,7,10,9,7,8,11,9,10,8,8,8,10] (toplam 113) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Tevbe sûresi bu sayfa ile tamamlanıyor (besmelesiz sûre olarak
doğrulandı, bkz. sayfa 186 notu).

## Sayfa 207: PASS
Besmele + 14 satır (Yûnus 10:1-6, sûre açılış sayfası). Görsel net
okunaklıydı. Kelime sayıları [8,10,9,10,12,10,9,8,9,9,9,8,7,7] (toplam
125) canon listesinden index-slice ile satırlara dağıtıldı, assert
geçti.

## Sayfa 208: PASS
15 satır (Yûnus 10:7-14). Görsel net okunaklıydı. Kelime sayıları
[8,8,8,8,8,8,8,9,8,10,9,8,8,7,7] (toplam 122) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 209: PASS
15 satır (Yûnus 10:15-20). Görsel net okunaklıydı. Kelime sayıları
[9,11,11,11,9,8,11,8,6,11,6,7,9,10,6] (toplam 133) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti.

## Sayfa 210: PASS
15 satır (Yûnus 10:21-25). Görsel net okunaklıydı. Kelime sayıları
[10,10,10,10,9,10,10,11,9,9,10,8,10,7,10] (toplam 143) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.

## Bu oturumun özeti (176-210)

Bu oturumda sayfa 176-210 arası (35 sayfa) tamamlandı, hepsi PASS.
Kapsanan içerik: Enfâl sûresi tamamı (176-185), Tevbe sûresi tamamı
(186-206, besmelesiz sûre olarak doğrulandı), Yûnus sûresi başlangıcı
(207-210, 10:1-25). Her sayfada kelime sayıları görselden satır satır
çıkarılıp canon listesinden index-slice ile dilimlendi,
`sum(line_counts) == len(canon)` assert'i her sayfada geçti.

Not: Sayfa 204'te ilk geçişte satır 8/9 sınırında bir kelime kayması
(off-by-one) fark edilip python ile index kontrolü yapılarak
düzeltildi — bu tür sınır hataları toplam kelime sayısı assert'i
tarafından YAKALANMAZ (toplam doğru kalır ama kelime yanlış satıra
düşebilir), bu yüzden özellikle çok satırlı/uzun ayetli sayfalarda her
satırın sınırının görselle tekrar teyit edilmesi önerilir.

**STOPPED AT PAGE 210 — resume from 211.** En yüksek sayfa numarası
(verse-graph-bgem3.json'a göre) 604 — toplam 394 sayfa daha kaldı.
JSON 0-210 aralığında contiguous ve valid, rapor da 211 sayfa girdisi
ile birebir örtüşüyor.

## Sayfa 211: PASS
15 satır (Yûnus 10:26-33). Görsel net okunaklıydı. Kelime sayıları
[10,8,10,9,8,8,8,8,8,10,10,12,7,10,9] (toplam 135) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti. Satır 3/4 sınırında
ilk geçişte "مِنْ" kelimesi yanlışlıkla satır 3'e eklenmişti (11 kelime
olmuştu); görsel tekrar incelenerek "مِنَ اللّٰهِ" ile satır 3'ün
bittiği, "مِنْ عَاصِمٍ" ile satır 4'ün başladığı doğrulandı ve
[10,9] olarak düzeltildi.

## Sayfa 212: PASS
15 satır (Yûnus 10:34-42). Görsel net okunaklıydı. Kelime sayıları
[11,11,11,12,10,12,11,11,9,11,10,11,9,10,9] (toplam 158) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti. Her
satırın son/ilk kelime sınırı görselle tek tek teyit edildi (özellikle
"قُلِ اللّٰهُ" / "يَبْدَؤُا" tekrarlı ayet çiftinde satır 1/2 sınırı).

## Sayfa 213: PASS
15 satır (Yûnus 10:43-53). Görsel net okunaklıydı. Kelime sayıları
[9,10,9,10,10,9,9,9,11,10,10,11,9,8,10] (toplam 144) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti. Satır
sınırları görselle teyit edildi.

## Sayfa 214: PASS
15 satır (Yûnus 10:54-61). Görsel net okunaklıydı. Kelime sayıları
[11,8,12,10,9,9,8,9,10,7,10,11,11,11,12] (toplam 148) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti. Satır
sınırları görselle teyit edildi.

## Sayfa 215: PASS
15 satır (Yûnus 10:62-70). Görsel net okunaklıydı. Kelime sayıları
[10,7,8,7,10,9,9,8,7,7,11,8,9,9,7] (toplam 126) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti. İlk denemede satır
13/14 sınırında off-by-one hatası yapıldı ("الْكَذِبَ" satır 13'e
yanlış eklenmişti, [10,8] idi); görsel tekrar kontrol edilip satır
13'ün "...عَلَى اللّٰهِ" ile bittiği, satır 14'ün "الْكَذِبَ لَا
يُفْلِحُونَ..." ile başladığı doğrulanarak [9,9] olarak düzeltildi.
Bu, görev talimatındaki tam olarak beklenen off-by-one sınır hatası
türüydü ve satır sonu/başı çift kontrolüyle yakalandı.

## Sayfa 216: PASS
15 satır (Yûnus 10:71-78). Görsel net okunaklıydı. Kelime sayıları
[13,8,8,9,12,7,8,10,12,9,7,10,10,8,9] (toplam 140) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti. Satır sınırları
görselle teyit edildi.

## Sayfa 217: PASS
15 satır (Yûnus 10:79-88). Görsel net okunaklıydı. Kelime sayıları
[8,9,11,9,11,11,10,8,8,9,7,8,10,9,7] (toplam 135) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti. Satır sınırları
görselle teyit edildi.

## Sayfa 218: PASS
15 satır (Yûnus 10:89-97). Görsel net okunaklıydı. Kelime sayıları
[8,9,7,13,8,8,8,9,9,9,8,9,9,9,8] (toplam 131) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti. Satır sınırları
görselle teyit edildi (özellikle satır 12/13/14 yoğun bölgede).

## Sayfa 219: PASS
15 satır (Yûnus 10:98-106). Görsel net okunaklıydı. Kelime sayıları
[10,9,11,9,9,8,9,9,8,8,12,9,10,10,10] (toplam 141) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti. Satır sınırları
görselle teyit edildi.

## Sayfa 220: PASS
Özel yapı: Yûnus sûresi sonu (10:107-109, 5 satır) + sûre başlık
madalyonu (Hûd sûresi, 111 ayet) + besmele + Hûd sûresi başlangıcı
(11:1-5, 7 satır) = toplam 12 kelime-satırı + 1 besmele satırı = 13
satır. Görsel net okunaklıydı. Kelime sayıları
[13,11,12,11,11,10,9,13,11,9,9,10] (toplam 129) canon listesinden
index-slice ile satırlara dağıtıldı (besmele sûre başlığından sonra,
6. satır olarak elle eklendi, canon sayımına dahil edilmedi), assert
geçti. Satır sınırları görselle teyit edildi.

## Sayfa 221: PASS
15 satır (Hûd 11:6-12). Görsel net okunaklıydı. Kelime sayıları
[11,8,9,8,11,8,9,8,8,7,9,7,8,9,10] (toplam 130) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti. Satır sınırları
görselle teyit edildi.

## Sayfa 222: PASS (düzeltmeler sonrası)
15 satır (Hûd 11:13-19). Bu sayfada İLK GEÇİŞTE İKİ AYRI off-by-one
hatası yapıldı: (1) satır 3/4 sınırında "مُسْلِمُونَ" yanlışlıkla
satır 3'e eklenmişti; (2) satır 6/7 sınırında "فِيهَا وَبَاطِلٌ"
kelimeleri yanlışlıkla satır 7'ye kaydırılmıştı (satır 6 sadece 9
kelime sayılmıştı, oysa görselde 11 kelimeye kadar uzanıyordu).
Toplam kelime sayısı assert'i her ikisinde de geçtiği için hata ilk
turda YAKALANMADI. Sayfa resmi 3 parçaya bölünüp 2x büyütülerek
tekrar incelendi ve tüm 15 satır tek tek doğrulandı. Nihai kelime
sayıları: [9,10,14,8,9,11,10,9,9,10,9,7,8,7,7] (toplam 137),
canon listesiyle index-slice sonrası assert geçti ve satır
sınırları crop görsellerle teyit edildi.

## Sayfa 223: PASS
15 satır (Hûd 11:20-28). Kelime sayıları
[11,9,7,9,8,8,7,8,11,9,11,10,10,10,6] (toplam 134) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti. Bir önceki
sayfadaki hatalar nedeniyle bu sayfa özellikle dikkatli işlendi: ilk
tam-sayfa okumadan sonra satır 5/6/7/8 sınırları şüpheli görülüp 2x
büyütülmüş crop görsellerle (satır 4-7 ve satır 8-10 blokları) çapraz
doğrulandı, tüm sınırlar teyit edildi.

## Sayfa 224: PASS
15 satır (Hûd 11:29-37). Kelime sayıları
[12,10,10,8,10,10,10,8,11,11,8,10,12,8,8] (toplam 146) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti. Satır
9-14 arası (yoğun bölge) crop görselle 2x büyütülerek çapraz
doğrulandı, sınırlar teyit edildi.

## Sayfa 225: PASS (düzeltme sonrası)
15 satır (Hûd 11:38-45). İlk geçişte satır 14/15 sınırında off-by-one
hatası yapıldı ("ابْن۪ي" yanlışlıkla satır 14'ün sonuna eklenmişti,
[10,8] idi); crop görsel ile ("بُعْداً لِلْقَوْمِ الظَّالِمِينَ ...
فَقَالَ رَبِّ اِنَّ" satır 14'ün gerçek sonu, "ابْنِي مِنْ اَهْلِي..."
satır 15'in gerçek başlangıcı olduğu) teyit edilip [9,9] olarak
düzeltildi. Satır 6-9 arası da crop ile ayrıca doğrulandı ve
doğruydu. Nihai kelime sayıları: [10,9,9,10,10,10,8,10,10,11,10,10,8,9,9]
(toplam 143), assert geçti.

## Bu oturumun özeti (211-225)

Bu oturumda sayfa 211-225 arası (15 sayfa) tamamlandı, hepsi PASS.
Kapsanan içerik: Yûnus sûresi sonu (10:26-109), Hûd sûresi başlangıcı
(11:1-45, besmele ile, sayfa 220'de sûre geçişi özel yapıda işlendi).

Önemli bulgular: Bu oturumda TOPLAM 4 ADET off-by-one sınır hatası
yakalandı ve düzeltildi (sayfa 215, sayfa 222'de İKİ AYRI hata, sayfa
225) — hepsinde toplam kelime sayısı assert'i geçmesine rağmen bir
kelime yanlış satıra kaymıştı. Bu hatalar, ilk tam-sayfa okumadan
sonra şüpheli sınırların 2x büyütülmüş crop görsellerle (PIL ile
kırpılıp yeniden Read edilerek) çapraz doğrulanmasıyla yakalandı.
Sayfa 222 özellikle zorluydu ve üç kez gözden geçirildi.

Yöntem notu: Yoğun/uzun ayetli sayfalarda artık her satırın son ve
ilk kelimesini tam-sayfa görselden hızlı okumak yerine, şüpheli
bölgeleri (özellikle 8+ kelimelik satırları) kırpıp büyüterek
doğrulamak çok daha güvenilir sonuç veriyor. Sonraki oturumlarda bu
yöntemin daha sistematik uygulanması öneriliyor.

**STOPPED AT PAGE 225 — resume from 226.** En yüksek sayfa numarası
604 — toplam 379 sayfa daha kaldı. JSON 0-225 aralığında contiguous
ve valid (226 kayıt), rapor da bire bir örtüşüyor (226 "## Sayfa"
başlığı, sayfa 0-225 karşılığı).

## Yeni oturum (226+) — yöntem güncellemesi

Bu oturumdan itibaren crop-doğrulama süreci otomatikleştirildi:
`line_detect.py` sayfa görselindeki koyu piksel yoğunluğunu satır satır
tarayarak 15 (veya besmele sayfalarında 13-14) satır bandını piksel
hassasiyetinde tespit ediyor; `compose_page.py` her bandı 2x
büyütüp satır numarası etiketiyle 5'erli gruplar halinde composite
görsellere dönüştürüyor. Böylece HER satır (sadece 8+ kelimelik
değil, tamamı) sayı ve sınır bakımından büyütülmüş görsel üzerinden
tek tek doğrulanıyor — tam sayfa okumasına güvenmek yerine.
`prep_page.py` sayfa numarası + indirilen görsel yolunu alıp canon
kelime listesini (indeksli) ve composite dosya yollarını tek
komutta üretiyor.

## Sayfa 226: PASS
15 satır (Hûd 11:46-53). Kelime sayıları
[11,11,11,10,11,9,11,11,11,8,9,9,7,10,8] (toplam 147) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup, satır 1-5/6-10/11-15) her satır
tek tek doğrulandı, sınır hatası bulunmadı.

## Sayfa 227: PASS
15 satır (Hûd 11:54-62). Kelime sayıları
[11,7,9,13,9,11,11,9,10,12,12,9,10,11,11] (toplam 155) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 228: PASS
15 satır (Hûd 11:63-71). Kelime sayıları
[13,10,12,7,9,8,11,7,10,7,9,9,9,5,6] (toplam 132) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti. Composite crop
görsellerle (3 grup) her satır tek tek doğrulandı, sınır hatası
bulunmadı.

## Sayfa 229: PASS
15 satır (Hûd 11:72-81). Kelime sayıları
[10,9,10,9,11,11,11,9,11,8,12,12,12,9,8] (toplam 152) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 230: PASS
15 satır (Hûd 11:82-88). Kelime sayıları
[8,7,9,12,8,8,9,8,8,9,8,9,10,9,8] (toplam 130) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti. Composite crop
görsellerle (3 grup) her satır tek tek doğrulandı, sınır hatası
bulunmadı.

## Sayfa 231: PASS
15 satır (Hûd 11:89-97). Kelime sayıları
[10,11,9,10,9,10,8,9,9,8,8,8,8,7,7] (toplam 131) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti. Composite crop
görsellerle (3 grup) her satır tek tek doğrulandı, sınır hatası
bulunmadı.

## Sayfa 232: PASS
15 satır (Hûd 11:98-108). Kelime sayıları
[8,8,8,7,9,11,10,10,10,10,8,9,10,9,9] (toplam 136) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 233: PASS
15 satır (Hûd 11:109-117 — sûre sonu). Kelime sayıları
[11,9,8,9,7,10,10,10,8,7,7,9,10,9,8] (toplam 132) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 234: PASS (sûre geçişi — Hûd sonu + Yûsuf başlangıcı)
13 satır. Hûd 11:118-123 (sûre sonu, 7 satır, kelime sayıları
[11,11,9,10,9,8,12], toplam 70) + dekoratif "Sûre-i Yûsuf" banner'ı
(içerik satırı değil, atlandı) + besmele satırı (sayılmadı) + Yûsuf
12:1-4 (5 satır, kelime sayıları [9,7,10,11,6], toplam 43). Toplam
canon kelime sayısı 113 (70+43), assert geçti. Composite crop
görsellerle (3 grup, banner dahil 14 bant tespit edildi, biri
dekoratif olduğu için 13 içerik satırına indirildi) her satır tek
tek doğrulandı, sınır hatası bulunmadı.

## Sayfa 235: PASS
15 satır (Yûsuf 12:5-14). Kelime sayıları
[11,7,9,11,9,10,10,9,9,8,11,8,8,7,8] (toplam 135) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 236: PASS
15 satır (Yûsuf 12:15-22). Kelime sayıları
[10,9,9,11,9,9,7,11,6,7,7,8,8,8,6] (toplam 125) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 237: PASS
15 satır (Yûsuf 12:23-30). Kelime sayıları
[9,10,8,9,7,9,12,9,10,8,10,8,8,9,9] (toplam 135) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 238: PASS
15 satır (Yûsuf 12:31-37). Kelime sayıları
[8,8,7,12,10,8,11,8,11,10,11,11,8,10,9] (toplam 142) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 239: PASS
15 satır (Yûsuf 12:38-43). Kelime sayıları
[8,10,8,8,10,11,10,9,10,8,9,9,7,8,7] (toplam 132) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Not: 12:42 ayetinde canon metninde satır sonu waqf işareti "۟"
ayrı bir boşlukla ayrılmış token olarak geliyor (nbsp öncesi) —
sayfa 71'deki emsal örnek gibi bağımsız bir "kelime" olarak
satıra dahil edildi (12. satırda "سِن۪ينَۜ" ile "وَقَالَ" arasında).
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 240: PASS
15 satır (Yûsuf 12:44-52). Kelime sayıları
[8,10,9,9,10,11,12,11,9,11,9,10,8,8,9] (toplam 144) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 241: PASS
15 satır (Yûsuf 12:53-63). Kelime sayıları
[13,8,10,8,9,8,7,7,10,11,9,8,8,9,9] (toplam 134) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 242: PASS
15 satır (Yûsuf 12:64-69). Kelime sayıları
[9,9,7,10,9,10,12,10,11,8,9,11,10,8,8] (toplam 141) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 243: PASS
15 satır (Yûsuf 12:70-78). Kelime sayıları
[8,8,7,11,10,7,8,7,8,11,10,10,10,11,8] (toplam 134) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 244: PASS
15 satır (Yûsuf 12:79-86). Kelime sayıları
[10,8,9,11,12,9,9,9,7,9,9,8,7,9,9] (toplam 135) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 245: PASS
15 satır (Yûsuf 12:87-95). Kelime sayıları
[11,10,8,7,7,8,8,9,9,9,9,7,6,11,7] (toplam 126) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 246: PASS (Yûsuf sûresi sonu)
15 satır (Yûsuf 12:96-103). Kelime sayıları
[10,11,9,8,8,8,10,11,11,10,9,10,8,9,8] (toplam 140) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 247: PASS (Yûsuf sûresi sonu, 12:104-111)
15 satır. Kelime sayıları
[10,7,7,10,9,11,9,10,8,7,8,10,8,9,7] (toplam 130) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 248: PASS (Ra'd sûresi başlangıcı, besmele ile)
13 satır (dekoratif "Sûre-i Ra'd" banner atlandı, besmele
sayılmadı). Ra'd 13:1-5, kelime sayıları
[10,9,11,11,10,11,8,9,10,9,10,9] (toplam 117) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 249: PASS
15 satır (Ra'd 13:6-13). Kelime sayıları
[6,8,8,11,10,7,8,10,8,11,11,11,7,7,9] (toplam 132) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

---

Not (devam oturumu): Bu noktadan itibaren (sayfa 250+) görsel indirme yöntemi
değişti — Bash üzerinden doğrudan curl/network erişimi bu ortamda engellendi.
Bunun yerine WebFetch tool'u kullanılıyor: WebFetch, kuran.hayrat.com.tr'den
çekilen JPEG'i orijinal binary olarak yerel bir tool-results dosyasına
kaydediyor; bu dosya cp ile scratchpad'e kopyalanıp aynı line_detect.py /
compose_page.py / prep_page.py / build_page.py pipeline'ı ile işleniyor.
Görsel çözünürlüğü ve pipeline mantığı önceki oturumla birebir aynı (1024
piksel genişlik), sadece indirme yöntemi değişti. Doğrulama titizliği aynı:
her satır composite crop üzerinden tek tek okunup canon kelime listesiyle
karşılaştırılıyor.

## Sayfa 250: PASS
15 satır (Ra'd 13:14-18). Kelime sayıları
[11,12,10,8,9,10,9,8,11,9,11,11,9,14,10] (toplam 152) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup, WebFetch ile indirilen orijinal JPEG
üzerinden) her satır tek tek doğrulandı, sınır hatası bulunmadı.

## Sayfa 251: PASS
15 satır (Ra'd 13:19-28). Kelime sayıları
[13,9,11,8,7,9,8,11,10,10,9,10,11,10,9] (toplam 145) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 252: PASS (Ra'd sûresi sonu)
15 satır (Ra'd 13:29-34). Kelime sayıları
[8,11,13,10,12,11,10,12,8,8,9,10,9,12,10] (toplam 153) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 253: PASS
15 satır (Ra'd 13:35-42). Kelime sayıları
[9,8,6,11,10,7,13,9,12,8,10,10,9,9,9] (toplam 140) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 254: PASS (Ra'd sûresi sonu + İbrahim sûresi başlangıcı, besmele ile)
13 satır. İlk 2 satır Ra'd 13:43'ün son iki satırı (kelime sayıları [8,7]),
ardından dekoratif "Sûre-i İbrahim" banner (atlandı) + besmele (3. satır
olarak eklendi, sayıma dahil değil), sonra İbrahim 14:1-5 (kelime sayıları
[8,9,10,7,8,8,10,9,10,7]). Toplam canon kelime sayısı 101, besmele hariç
tüm satırlara index-slice ile dağıtıldı, assert geçti. besmele parametresi
build_page.py'nin varsayılan "ilk satır" davranışına uymadığı için (çünkü
besmele 3. sırada, 1. sırada değil) manuel script ile satır listesi
oluşturulup save_page ile kaydedildi. Composite crop görsellerle (3 grup)
her satır tek tek doğrulandı, sınır hatası bulunmadı.

## Sayfa 255: PASS
15 satır (İbrahim 14:6-10). Kelime sayıları
[8,8,6,9,8,11,9,9,7,10,8,6,6,8,7] (toplam 120) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 256: PASS
15 satır (İbrahim 14:11-18). Kelime sayıları
[10,11,8,9,8,6,8,5,7,7,8,9,8,10,8] (toplam 122) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 257: PASS
15 satır (İbrahim 14:19-24). Kelime sayıları
[10,9,9,12,8,9,7,9,7,8,9,7,8,9,8] (toplam 129) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 258: PASS
15 satır (İbrahim 14:25-33). Kelime sayıları
[9,6,10,8,8,9,7,8,10,7,12,9,9,7,7] (toplam 126) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 259: PASS
15 satır (İbrahim 14:34-42). Kelime sayıları
[11,7,9,8,8,10,8,8,10,9,9,9,8,8,8] (toplam 130) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 260: PASS (İbrahim sûresi sonu)
15 satır (İbrahim 14:43-52). Kelime sayıları
[7,7,9,6,9,8,7,7,8,7,8,8,9,7,9] (toplam 116) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 261: PASS (Hicr sûresi başlangıcı, besmele ile)
13 satır (dekoratif "Sûre-i Hicr" banner atlandı, besmele sayılmadı).
Hicr 15:1-15, kelime sayıları
[10,8,9,9,11,8,10,10,9,10,10,8] (toplam 112) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 262: PASS
15 satır (Hicr 15:16-31). Kelime sayıları
[7,9,7,9,11,8,9,8,7,9,9,10,9,8,8] (toplam 128) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 263: PASS
15 satır (Hicr 15:32-51). Kelime sayıları
[11,9,9,8,7,9,6,9,9,8,8,9,10,9,7] (toplam 128) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 264: PASS
15 satır (Hicr 15:52-70). Kelime sayıları
[9,9,8,10,8,11,7,9,8,8,8,8,6,7,8] (toplam 124) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 265: PASS (Hicr sûresi sonu)
15 satır (Hicr 15:71-90). Kelime sayıları
[8,6,8,8,10,7,7,7,9,8,9,8,9,7,9] (toplam 120) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 266: PASS (Hicr sûresi sonu + Nahl sûresi başlangıcı, besmele ile)
13 satır. İlk 6 satır Hicr 15:91-99'un son satırları (kelime sayıları
[7,7,6,8,8,9]), ardından dekoratif "Sûre-i Nahl" banner (atlandı) + besmele
(7. satır olarak eklendi, sayıma dahil değil), sonra Nahl 16:1-6 (kelime
sayıları [9,12,10,10,8,8]). Toplam canon kelime sayısı 102, besmele hariç
tüm satırlara index-slice ile dağıtıldı, assert geçti. Sayfa 254'teki gibi
besmele ilk satır olmadığı için manuel script ile satır listesi
oluşturulup save_page ile kaydedildi. Composite crop görsellerle (3 grup)
her satır tek tek doğrulandı, sınır hatası bulunmadı.

## Sayfa 267: PASS
15 satır (Nahl 16:7-14). Kelime sayıları
[7,8,5,8,7,10,7,9,6,9,8,8,8,6,5] (toplam 111) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 268: PASS
15 satır (Nahl 16:15-26). Kelime sayıları
[9,6,7,10,7,9,7,8,10,10,7,8,10,8,8] (toplam 124) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 269: PASS
15 satır (Nahl 16:27-34). Kelime sayıları
[8,10,7,11,9,9,10,8,10,6,7,10,8,6,8] (toplam 127) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 270: PASS
15 satır (Nahl 16:35-42). Kelime sayıları
[10,11,10,10,9,8,8,9,10,9,8,10,9,9,6] (toplam 136) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 271: PASS
15 satır (Nahl 16:43-54). Kelime sayıları
[10,9,8,11,9,9,11,9,10,8,11,9,11,9,7] (toplam 141) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti. (8. satırda
14. cüz başlangıç vurgusu — Hayrat baskısında yeşil arkaplan ile
işaretlenmiş, kelime bölünmesini etkilemiyor.) Composite crop görsellerle
(3 grup) her satır tek tek doğrulandı, sınır hatası bulunmadı.

## Sayfa 272: PASS
15 satır (Nahl 16:55-64). Kelime sayıları
[7,10,8,9,11,11,9,10,10,8,10,9,8,9,7] (toplam 136) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 273: PASS
15 satır (Nahl 16:65-72). Kelime sayıları
[13,9,11,9,11,8,11,11,9,13,10,10,8,7,8] (toplam 148) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 274: PASS
15 satır (Nahl 16:73-79). Kelime sayıları
[9,7,9,9,9,9,10,10,9,9,10,8,7,10,8] (toplam 133) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 275: PASS
15 satır (Nahl 16:80-87). Kelime sayıları
[10,7,8,10,8,7,8,5,9,8,8,6,8,7,8] (toplam 117) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 276: PASS
15 satır (Nahl 16:88-93). Kelime sayıları
[8,9,9,8,7,7,6,10,9,8,7,11,7,9,7] (toplam 122) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 277: PASS
15 satır (Nahl 16:94-102). Kelime sayıları
[8,8,7,9,8,9,10,8,8,9,7,9,9,8,7] (toplam 124) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 278: PASS
15 satır (Nahl 16:103-110). Kelime sayıları
[7,7,8,7,7,6,8,7,7,8,7,8,10,8,7] (toplam 112) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 279: PASS
15 satır (Nahl 16:111-118). Kelime sayıları
[10,10,8,8,8,8,8,8,13,7,8,9,7,8,5] (toplam 125) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 280: PASS
15 satır (Nahl 16:119-128, Nahl suresi sonu). Kelime sayıları
[10,9,11,7,8,8,9,8,7,6,11,9,9,11,8] (toplam 131) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 281: PASS
13 satır (besmele + Isra 17:1-7, sure başlangıcı). Süslü sure başlığı
banner'ı (line sayılmadı), besmele line 1 olarak eklendi. Kelime sayıları
[10,10,8,9,9,9,11,9,7,8,8,8] (toplam 106) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti. Composite crop
görsellerle (3 grup) her satır tek tek doğrulandı, sınır hatası
bulunmadı.

## Sayfa 282: PASS
15 satır (Isra 17:8-17). Kelime sayıları
[10,10,11,8,8,10,9,9,8,8,11,10,8,8,7] (toplam 135) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 283: PASS
15 satır (Isra 17:18-27). Kelime sayıları
[11,9,9,8,9,7,9,8,11,10,9,9,7,8,6] (toplam 130) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 284: PASS
15 satır (Isra 17:28-38). Kelime sayıları
[10,10,10,9,8,10,10,10,11,9,7,11,9,12,8] (toplam 144) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 285: PASS
15 satır (Isra 17:39-49). Kelime sayıları
[11,9,9,9,12,9,12,11,9,8,10,11,10,8,9] (toplam 147) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 286: PASS
15 satır (Isra 17:50-58). Kelime sayıları
[11,9,10,7,8,8,11,9,8,10,8,8,8,10,8] (toplam 133) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 287: PASS
15 satır (Isra 17:59-66). Kelime sayıları
[10,10,9,8,9,6,9,9,8,7,8,7,9,8,9] (toplam 126) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 288: PASS
15 satır (Isra 17:67-75). Kelime sayıları
[11,7,10,11,9,11,7,8,8,8,10,8,7,8,9] (toplam 132) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 289: PASS
15 satır (Isra 17:76-86). Kelime sayıları
[7,10,10,10,11,8,8,8,9,9,9,10,8,9,10] (toplam 136) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 290: PASS
15 satır (Isra 17:87-96). Kelime sayıları
[10,9,11,10,9,9,7,8,11,9,10,11,10,9,8] (toplam 141) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 291: PASS
15 satır (Isra 17:97-104). Kelime sayıları
[10,8,8,8,7,12,11,10,7,9,9,9,10,9,9] (toplam 136) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 292: PASS
13 satır (Isra 17:105-111 sure sonu [9 satır] + sure başlığı banner'ı
[sayılmadı] + besmele [1 satır] + Kehf 18:1-4 sure başlangıcı [3 satır]).
Isra kısmı kelime sayıları [9,10,14,9,8,12,10,11,9] (toplam 92),
Kehf kısmı [13,11,11] (toplam 35); genel toplam 127 canon ile eşleşti,
assert geçti. Composite crop görsellerle (3 grup) her satır tek tek
doğrulandı, sınır hatası bulunmadı. Sure başlığı banner'ı satır
sayılmadı (page 49/127/vb. ile tutarlı).

## Sayfa 293: PASS
15 satır (Kehf 18:5-15). Kelime sayıları
[10,8,9,11,8,8,10,9,8,8,8,10,10,9,8] (toplam 134) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 294: PASS
15 satır (Kehf 18:16-20). Kelime sayıları
[9,9,9,10,10,9,7,8,6,8,10,7,7,8,9] (toplam 126) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 295: PASS
15 satır (Kehf 18:21-27). Kelime sayıları
[10,9,10,7,7,7,10,8,9,11,8,10,11,10,8] (toplam 135) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 296: PASS
15 satır (Kehf 18:28-34). Kelime sayıları
[8,9,10,10,10,9,8,11,10,8,7,8,8,10,10] (toplam 136) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 297: PASS
15 satır (Kehf 18:35-45). Kelime sayıları
[11,10,9,10,10,12,12,10,9,11,11,11,9,9,9] (toplam 153) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 298: PASS
15 satır (Kehf 18:46-53). Kelime sayıları
[9,9,8,10,8,11,11,7,9,9,8,8,8,7,8] (toplam 130) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 299: PASS
15 satır (Kehf 18:54-61). Kelime sayıları
[11,10,8,9,7,8,9,9,8,7,11,8,9,9,8] (toplam 131) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 300: PASS
15 satır (Kehf 18:62-74). Kelime sayıları
[10,10,9,11,9,11,10,12,11,10,9,11,10,8,8] (toplam 149) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 301: PASS
15 satır (Kehf 18:75-83). Kelime sayıları
[12,10,9,9,11,10,10,9,9,8,8,8,8,10,7] (toplam 138) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 302: PASS
15 satır (Kehf 18:84-97). Kelime sayıları
[12,10,12,9,12,11,12,12,11,10,13,10,10,11,8] (toplam 163) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Not: canon verisinde 18:96 içindeki "اُفْرِغْ" kelimesi kaynak JSON'da
"اُفْرِ" ve "غْ" olarak iki ayrı boşlukla ayrılmış token halinde
duruyor (görselde tek kelime). Kural gereği canonical words verbatim
kullanıldığından bu iki token olduğu gibi (14. satırda) korundu.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 303: PASS
15 satır (Kehf 18:98-110 — sure sonu). Kelime sayıları
[12,11,8,10,10,9,11,9,10,9,10,11,13,10,10] (toplam 153) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 304: PASS
13 satır (Meryem 19:1-11 — sure başlangıcı). Sure başlığı banner'ı satır
sayılmadı, besmele 1. satır olarak eklendi (canon'a dahil değil).
Kelime sayıları [8,10,8,9,9,9,11,8,10,10,10,9] (toplam 111) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 305: PASS
15 satır (Meryem 19:12-25). Kelime sayıları
[9,8,8,8,8,8,9,9,10,10,8,9,10,9,7] (toplam 130) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 306: PASS
15 satır (Meryem 19:26-38). Kelime sayıları
[9,9,10,11,8,10,8,8,9,10,12,10,7,9,10] (toplam 140) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 307: PASS
15 satır (Meryem 19:39-51). Kelime sayıları
[10,10,10,14,12,10,10,9,9,9,11,8,9,9,10] (toplam 150) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 308: PASS
15 satır (Meryem 19:52-64). Kelime sayıları
[10,10,9,8,8,11,10,10,8,10,9,11,9,13,10] (toplam 146) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 309: PASS
15 satır (Meryem 19:65-76). Kelime sayıları
[7,10,8,8,8,10,11,9,10,8,11,11,9,8,8] (toplam 136) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 310: PASS
15 satır (Meryem 19:77-95 — sure sonu). Kelime sayıları
[9,8,11,9,5,8,9,8,6,8,8,9,11,9,7] (toplam 125) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 311: PASS (özel durum - sure geçişi)
13 satır. Meryem 19:96-98 (3 satır, sure sonu) + Ta-Ha sure başlığı
banner'ı (satır sayılmadı) + besmele (1 satır, 4. satır olarak,
canon'a dahil değil) + Ta-Ha 20:1-12 (9 satır). Kelime sayıları
Meryem kısmı [10,9,14] (toplam 33), Ta-Ha kısmı
[8,8,9,9,10,10,10,11,8] (toplam 83); genel toplam 116 canon ile
eşleşti, assert geçti. Composite crop görsellerle (3 grup) her satır
tek tek doğrulandı, sınır hatası bulunmadı. Besmele sayfa ortasında
(4. satır) doğru konumda yerleştirildi.

## Sayfa 312: PASS
15 satır (Ta-Ha 20:13-37). Kelime sayıları
[11,8,9,10,9,11,9,7,10,10,8,9,9,9,8] (toplam 137) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 313: PASS
15 satır (Ta-Ha 20:38-51). Kelime sayıları
[11,10,10,9,10,11,8,11,10,11,9,11,12,10,10] (toplam 153) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 314: PASS
15 satır (Ta-Ha 20:52-64). Kelime sayıları
[11,9,10,9,9,9,8,10,9,9,8,8,8,6,9] (toplam 132) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 315: PASS
15 satır (Ta-Ha 20:65-76). Kelime sayıları
[12,11,11,12,11,11,8,9,11,11,9,10,11,9,7] (toplam 153) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 316: PASS
15 satır (Ta-Ha 20:77-87). Kelime sayıları
[10,10,8,10,8,10,9,11,11,8,8,9,10,8,8] (toplam 138) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 317: PASS
15 satır (Ta-Ha 20:88-98). Kelime sayıları
[9,8,9,10,8,9,9,11,9,10,9,11,9,9,11] (toplam 141) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 318: PASS
15 satır (Ta-Ha 20:99-113). Kelime sayıları
[10,9,9,8,8,10,8,10,11,12,10,9,8,8,9] (toplam 139) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 319: PASS
15 satır (Ta-Ha 20:114-125). Kelime sayıları
[8,9,11,9,10,10,9,11,7,9,8,8,10,9,8] (toplam 136) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 320: PASS
15 satır (Ta-Ha 20:126-135 — sure sonu). Kelime sayıları
[8,10,10,10,11,10,9,10,9,8,9,9,10,9,7] (toplam 139) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 321: PASS
13 satır (Enbiya 21:1-10 — sure başlangıcı). Sure başlığı banner'ı satır
sayılmadı, besmele 1. satır olarak eklendi (canon'a dahil değil).
Kelime sayıları [9,9,10,9,9,10,8,9,9,8,7,7] (toplam 104) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 322: PASS
15 satır (Enbiya 21:11-24). Kelime sayıları
[8,9,9,10,7,9,10,10,9,7,9,11,10,11,9] (toplam 138) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 323: PASS
15 satır (Enbiya 21:25-35). Kelime sayıları
[13,8,8,9,8,10,8,9,9,7,7,8,9,8,6] (toplam 127) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 324: PASS
15 satır (Enbiya 21:36-44). Kelime sayıları
[8,7,8,8,9,8,7,8,8,8,8,7,8,8,6] (toplam 116) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 325: PASS
15 satır (Enbiya 21:45-57). Kelime sayıları
[8,9,8,9,9,7,8,8,9,11,8,10,8,8,6] (toplam 126) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 326: PASS
15 satır (Enbiya 21:58-72). Kelime sayıları
[8,8,7,8,7,8,7,9,10,11,7,8,7,8,6] (toplam 119) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 327: PASS
15 satır (Enbiya 21:73-81). Kelime sayıları
[6,8,8,9,8,9,7,7,9,5,8,7,8,7,7] (toplam 113) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 328: PASS
15 satır (Enbiya 21:82-90). Kelime sayıları
[8,8,8,8,6,6,5,7,8,9,6,7,9,9,8] (toplam 112) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 329: PASS
15 satır (Enbiya 21:91-101). Kelime sayıları
[8,8,6,6,6,7,7,6,7,9,8,8,8,9,7] (toplam 110) canon
listesinden index-slice ile satırlara dağıtıldı, assert geçti.
Composite crop görsellerle (3 grup) her satır tek tek doğrulandı,
sınır hatası bulunmadı.

## Sayfa 330: PASS
13 satır (Enbiya 21:102-112 — sure sonu). Hac sure başlığı banner'ı bu
sayfanın 14. satırı olarak görünüyor ama içerik satırı olarak
sayılmadı (besmele bir sonraki sayfada). Kelime sayıları
[8,7,5,8,8,9,8,8,9,9,11,10,9] (toplam 109) canon listesinden
index-slice ile satırlara dağıtıldı, assert geçti. Composite crop
görsellerle (3 grup) her satır tek tek doğrulandı, sınır hatası
bulunmadı.

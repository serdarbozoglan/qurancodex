# Ayet Grafiği — Embedding ve Skor Metodolojisi

Bu belge, `public/verse-graph-bgem3.json` dosyasının nasıl üretildiğini, hangi modelin kullanıldığını ve bağlantı skorlarının ne anlama geldiğini açıklar.

---

## 1. Genel Mimari

Pipeline iki aşamadan oluşur: **Stage 1** (pahalı, ~10 dk GPU) embedding üretir ve cache'e kaydeder; **Stage 2** (ucuz, ~40 sn) cache'den yükleyip farklı ağırlıklarla JSON üretir.

```
Stage 1: generate-embeddings-bgem3.py  (bir kez çalışır)
─────────────────────────────────────────────────────────
Ham Kur'an verisi
  ├── Arapça metin  →  embedding + BM25 için kullanılır
  └── Türkçe / İngilizce meal  →  JSON'a kaydedilir, display için kullanılır
        ↓
Bağlam-zenginleştirilmiş Arapça metin (±2 ayet penceresi)
        ↓
BGE-M3 dense embedding  →  1024 boyutlu vektör
        ↓
Cache'e kaydet:
  cache/embeddings-bgem3.npy   (24 MB — 6236×1024 float vektörler)
  cache/verses-bgem3.json      (3.7 MB — ham ayet verileri)

Stage 2: rescore.py  (istediğin kadar çalışır, embedding yeniden hesaplanmaz)
─────────────────────────────────────────────────────────
Cache'den yükle  →  embeddingsler + ayetler
        ↓
BM25 leksikal indeks oluştur
        ↓
Hibrit skor (parametrik: --sem / --lex ağırlıkları)
        ↓
Her ayet için top-20 bağlantı  →  UMAP 3D koordinat
        ↓
verse-graph-bgem3.json
  ├── Benzerlik bağlantıları  (Arapça'dan hesaplandı)
  └── Türkçe / İngilizce meal  (gösterim için eklendi)
```

---

## 2. Model: BAAI/bge-m3

**Model:** [`BAAI/bge-m3`](https://huggingface.co/BAAI/bge-m3)  
**Boyut:** ~2.2 GB  
**Embedding boyutu:** 1024  
**Desteklenen diller:** 100+ (Arapça ve Türkçe dahil)  
**Kullanılan dil:** Arapça — benzerlikler yalnızca Arapça metin üzerinden hesaplanır; Türkçe ve İngilizce meal gösterim amaçlıdır

### Neden BGE-M3?

| Özellik | multilingual-e5-large (önceki) | BAAI/bge-m3 (mevcut) |
|---|---|---|
| Çapraz dil eşleşmesi | İyi | Daha güçlü |
| Arapça semantik temsil | Yeterli | Güçlü |
| Bağlamsal tutarlılık | Orta | Yüksek |
| Task prefix gereksinimi | `"passage: "` zorunlu | Gerekmez |

Pratik fark: BGE-M3 aynı sure içindeki tematik devam ayetlerini ve çapraz sure anlam akrabalığını daha isabetli yakalar. Karşılaştırma testlerinde `89:27` ("Ey huzura kavuşmuş insan") için E5 cinayet ve kısas ayetlerine bağ kurarken BGE-M3 aynı surenin anlam bütünlüğünü (89:28–30) doğru tespit etti.

### Nasıl Çalışır?

BGE-M3, 100+ dilde fine-tune edilmiş bir **dense retrieval** modelidir. Her metin parçasını, anlamsal içeriğini temsil eden bir vektöre dönüştürür. İki metnin anlamca yakınlığı, bu vektörler arasındaki **kosinüs benzerliği** ile ölçülür:

```
cos(A, B) = (A · B) / (|A| × |B|)    →   0 (ilgisiz) ile 1 (özdeş) arası
```

L2-normalizasyon uygulandığı için nokta çarpımı doğrudan kosinüs benzerliğine eşittir.

---

## 3. Bağlam Penceresi

Her ayet, tek başına değil **±2 komşu ayet** ile birlikte encode edilir. Hedef ayet `>> ... <<` işaretleriyle belirtilir:

```
[2:3] ... | >> [2:4] hedef ayet << | [2:5] ... | [2:6] ...
```

**Neden:** Kur'an'da anlam çoğu zaman bağlam gerektiren bir akış izler. Tek ayet encode edilirse kısa ayetler (tek kelime gibi) yeterli semantik sinyal taşımaz. Bağlam penceresi bu sorunu giderir.

**Sınır:** Pencere sure sınırını geçmez. Bir surenin son ayetinden bir sonraki surenin ilk ayetine bağlam aktarılmaz.

**Dikkat — bağlam penceresi yan etkisi:** Aynı sure içindeki komşu ayetler bağlam pencerelerini paylaştığı için semantik skor yapay olarak yüksek çıkabilir. Örneğin 1:1 (Bismillah) ve 1:3 (Rahman ve Rahim) arasındaki 0.97 semantik skor, gerçek anlam benzerliğinden ziyade ortak bağlam penceresinden kaynaklanır. Bu etki, hibrit skorda BM25 ağırlığının artırılmasıyla dengelenir (bkz. Bölüm 5: Ağırlık Kalibrasyonu).

---

## 4. BM25 Leksikal İndeks

Anlam benzerliğinin yanı sıra, **kelime örtüşmesi** de önemlidir. Örneğin 1:1 (Bismillah) ve 27:30 (Hz. Süleyman'ın mektubunun Bismillah ile başlaması) aynı Arapça kelimeleri paylaşır; semantik model bağlam penceresi yüzünden bunu her zaman en üste çıkaramayabilir. BM25 bu tür kelimesi kelimesine eşleşmeleri yakalar.

Bu nedenle **BM25Okapi** (Okapi BM25 algoritması) ile bir leksikal skor da hesaplanır:

- Arapça hareke (diacritic) karakterleri temizlenir: `أُنزِلَ → انزل`
- Her ayet kelimelerine ayrılır (tokenize)
- BM25 ile ayet-i sorguya karşı tüm külliyat skorlanır
- Skorlar 0–1 aralığına normalize edilir

---

## 5. Hibrit Skor

Son bağlantı skoru iki bileşenin ağırlıklı toplamıdır:

```
hybrid_score = SEMANTIC_W × semantic_cosine + LEXICAL_W × bm25_normalized
```

| Parametre | Değer | Açıklama |
|---|---|---|
| `SEMANTIC_W` | **0.50** | BGE-M3 kosinüs benzerliği ağırlığı |
| `LEXICAL_W` | **0.50** | BM25 leksikal skor ağırlığı |
| `MIN_SCORE` | 0.40 | Bu eşiğin altındaki bağlantılar atılır |
| `TOP_N` | 20 | Ayet başına saklanan maksimum bağlantı sayısı |

Her JSON kaydında `score` (hibrit), `sem` (sadece semantik), `lex` (sadece leksikal) ayrı ayrı saklanır:

```json
{
  "id": "2:255",
  "connections": [
    { "id": "42:4", "score": 0.7332, "sem": 0.7210, "lex": 0.0362 },
    { "id": "20:110", "score": 0.7203, "sem": 0.7089, "lex": 0.0398 }
  ]
}
```

### Ağırlık Kalibrasyonu

Ağırlıklar deneysel olarak test edilerek seçilmiştir. Temel gözlem: bağlam penceresi (±2 ayet) aynı suredeki komşu ayetlerin semantik skorunu yapay olarak şişirir. BM25 ağırlığını artırmak, kelimesi kelimesine eşleşen ayetlerin sıralamada hak ettiği yere çıkmasını sağlar.

**1:1 (Bismillah) örneğinde ağırlık etkisi:**

| Ağırlık (sem/lex) | 1:3 skoru | 27:30 skoru | 1. sıra |
|---|---|---|---|
| %65 / %35 | 0.84 | 0.80 | 1:3 (bağlam penceresi etkisi) |
| %55 / %45 | 0.80 | 0.80 | Eşit |
| **%50 / %50** | **0.79** | **0.80** | **27:30** (doğru sonuç) |

27:30 (`بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ` — Hz. Süleyman'ın Bismillah ile başlayan mektubu) 1:1 ile kelimesi kelimesine aynıdır. %50/%50 ağırlıkta bu ayet hak ettiği 1. sıraya çıkar.

### Ağırlıkları değiştirmek

`rescore.py` ile embedding yeniden hesaplanmadan farklı ağırlıklar denenebilir (~40 saniye):

```bash
python3 scripts/rescore.py --sem 0.50 --lex 0.50   # mevcut (aktif)
python3 scripts/rescore.py --sem 0.55 --lex 0.45   # biraz daha semantik ağır
python3 scripts/rescore.py --sem 0.65 --lex 0.35   # orijinal ağırlıklar
python3 scripts/rescore.py --out verse-graph-test.json  # test dosyasına yaz
```

---

## 6. UMAP 3D Koordinatları

Her ayetin `x, y, z` koordinatı, embedding matrisine uygulanan **UMAP** (Uniform Manifold Approximation and Projection) ile üretilir:

```python
UMAP(n_components=3, n_neighbors=15, min_dist=0.1, metric="cosine")
```

UMAP, 1024 boyutlu yüksek boyutlu uzayı 3 boyuta indirgerken yerel yapıyı (birbirine yakın ayetler aynı kümede kalır) korur. Bu koordinatlar VerseGraph'taki 3D küme görselleştirmesinde kullanılır.

---

## 7. Skor Dağılımı

### BGE-M3 (%50/%50 ağırlık)

| Metrik | Değer |
|---|---|
| Toplam ayet | 6.236 |
| Toplam bağlantı | 124.720 |
| Ayet başına max bağlantı | 20 |

### E5 → BGE-M3 Model Karşılaştırması (500 ayet örneklem)

| Metrik | E5-large (%65/%35) | BGE-M3 (%65/%35) |
|---|---|---|
| Ortalama Jaccard overlap (top-10) | — | %53 |
| Yüksek overlap (≥ %70) | — | %16.8 |
| Düşük overlap (< %30) | — | %10.8 |
| Ortalama skor | 0.689 | 0.657 |

İki model ayetlerin yaklaşık yarısında farklı bağlantı buluyor. E5'in ortalaması daha yüksek görünmesinin nedeni skor enflasyonu olabilir: model daha az ayrışan embeddingler üretip her şeyi "benzer" olarak değerlendirebilir. BGE-M3'ün daha düşük fakat daha seçici skorları, bağlantı kalitesinin daha yüksek olduğuna işaret eder.

---

## 8. Dosyalar

| Dosya | Açıklama |
|---|---|
| `scripts/generate-embeddings-bgem3.py` | Stage 1: BGE-M3 embedding üret + cache'e kaydet |
| `scripts/rescore.py` | Stage 2: Cache'den yükle, ağırlıkları değiştir, JSON üret |
| `scripts/generate-embeddings.py` | E5-large pipeline (arşiv, dokunulmaz) |
| `scripts/compare-graphs.py` | İki model/ağırlık çıktısını karşılaştırır |
| `cache/embeddings-bgem3.npy` | Embedding cache (24 MB, 6236×1024 float) |
| `cache/verses-bgem3.json` | Ham ayet verisi cache (3.7 MB) |
| `public/verse-graph-bgem3.json` | Aktif graph (10.6 MB) |
| `public/verse-graph.json` | E5-large grafiği (arşiv, dokunulmaz) |

### Pipeline kullanımı

```bash
# ─── İlk kurulum veya model değişikliği (bir kez, ~10 dk GPU) ───
python3 scripts/generate-embeddings-bgem3.py
# → cache/embeddings-bgem3.npy + cache/verses-bgem3.json oluşur
# → public/verse-graph-bgem3.json da üretilir (varsayılan ağırlıklarla)

# ─── Ağırlık denemeleri (tekrar tekrar, ~40 sn, GPU gerekmez) ───
python3 scripts/rescore.py --sem 0.50 --lex 0.50
python3 scripts/rescore.py --sem 0.55 --lex 0.45 --out verse-graph-test.json

# ─── Karşılaştırma ───
python3 scripts/compare-graphs.py
python3 scripts/compare-graphs.py --verse 2:255 36:82 24:35 1:1
```

---

## 9. Gelecek İyileştirmeler

- **Türkçe metni de embed et:** Şu an sadece Arapça encode ediliyor. Arayüzdeki keyword tabanlı Türkçe arama embedding kullanmadığından bu değişiklik mevcut sisteme etki etmez; ancak ileride embedding-based semantic search eklenirse Türkçe meali de dahil etmek faydalı olur.
- **MIN_SCORE ayarı:** Daha sıkı bağlantılar için 0.40 → 0.50 yükseltilerek gürültü azaltılabilir.
- **CONTEXT_W artırımı:** ±2 yerine ±3 denenerek uzun sureler için bağlam kalitesi test edilebilir.
- **Bağlam penceresi olmadan ikinci embedding seti:** Komşu ayet skor şişmesini tamamen ortadan kaldırmak için `CONTEXT_W=0` ile ayrı bir embedding üretilip mevcut embedding ile ortalaması alınabilir.

#!/usr/bin/env python3
"""
generate-embeddings-bgem3.py

BGE-M3 variant of the embedding pipeline.
Drop-in replacement for generate-embeddings.py — produces the same
verse-graph JSON format, just with a different model.

Key differences vs E5:
  - Model: BAAI/bge-m3  (dense+sparse+multi-vector, ~2.2 GB)
  - No "passage: " prefix required
  - Slightly better cross-lingual alignment (Arabic ↔ Turkish)
  - Output: public/verse-graph-bgem3.json  (original untouched)

To switch the frontend to this graph, change the fetch URL in
src/components/VerseGraph.jsx from:
    /verse-graph.json  →  /verse-graph-bgem3.json

Requirements:
  pip install transformers torch sentence-transformers umap-learn rank-bm25 numpy tqdm requests

GPU recommended. CPU works but takes ~60 min (BGE-M3 is slightly heavier than E5).

Usage:
  python scripts/generate-embeddings-bgem3.py
"""

import json
import re
import sys
import numpy as np
import requests
from pathlib import Path
from tqdm import tqdm

import torch
from transformers import AutoTokenizer, AutoModel
from umap import UMAP
from rank_bm25 import BM25Okapi

# ── Config ────────────────────────────────────────────────────────────────────

MODEL_NAME  = "BAAI/bge-m3"
# BGE-M3: multilingual, 1024-dim, trained on 100+ languages including Arabic.
# Dense retrieval mode used here (same as E5 workflow).
# Does NOT require task-specific prefixes ("passage: ", "query: ").
# Stronger cross-lingual alignment than E5-large — better Arabic ↔ Turkish
# semantic matching for same-concept verses.

TOP_N       = 20      # connections stored per verse
CONTEXT_W   = 2       # context window: N verses before + N after (same surah)
BATCH_SIZE  = 16      # reduce to 8 if OOM
SEMANTIC_W  = 0.65    # weight for BGE-M3 cosine similarity
LEXICAL_W   = 0.35    # BM25 lexical weight
MIN_SCORE   = 0.40    # minimum hybrid score to keep a connection
OUT_PATH    = Path(__file__).parent.parent / "public" / "verse-graph-bgem3.json"
CACHE_DIR   = Path(__file__).parent.parent / "cache"
EMB_CACHE   = CACHE_DIR / "embeddings-bgem3.npy"
VERSES_CACHE = CACHE_DIR / "verses-bgem3.json"

DEVICE = (
    "cuda" if torch.cuda.is_available()
    else "mps" if getattr(torch.backends, "mps", None) and torch.backends.mps.is_available()
    else "cpu"
)

# ── 1. Fetch Quran data ───────────────────────────────────────────────────────

def fetch_quran():
    print("Fetching Arabic + English (quran-json)...")
    r = requests.get("https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_en.json", timeout=60)
    r.raise_for_status()
    en_data = r.json()

    print("Fetching Turkish translation (Vakıf)...")
    r = requests.get("https://api.alquran.cloud/v1/quran/tr.vakfi", timeout=60)
    r.raise_for_status()
    tr_data = r.json()

    tr_lookup = {}
    if tr_data.get("status") == "OK":
        for surah in tr_data["data"]["surahs"]:
            for ayah in surah["ayahs"]:
                tr_lookup[f"{surah['number']}:{ayah['numberInSurah']}"] = ayah["text"]
    else:
        print("  Warning: Turkish API failed, falling back to empty strings.")

    verses = []
    for surah in en_data:
        for verse in surah["verses"]:
            vid = f"{surah['id']}:{verse['id']}"
            verses.append({
                "id":          vid,
                "surah":       surah["id"],
                "ayah":        verse["id"],
                "surahName":   surah["name"],
                "surahNameEn": surah["translation"],
                "arabic":      verse["text"],
                "english":     verse["translation"],
                "turkish":     tr_lookup.get(vid, ""),
            })

    print(f"  Loaded {len(verses)} verses.\n")
    return verses

# ── 2. Embeddings (BAAI/bge-m3) ──────────────────────────────────────────────
# BGE-M3 does NOT require any task prefix — feed the text directly.
# Mean pooling of last hidden states (same as E5).

def load_model():
    print(f"Loading model: {MODEL_NAME}  (device={DEVICE})")
    print("  First run: downloads ~2.2 GB from HuggingFace — please wait.\n")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModel.from_pretrained(MODEL_NAME).to(DEVICE)
    model.eval()
    return tokenizer, model

def _avg_pool(last_hidden, attention_mask):
    """Mean pool token embeddings, ignoring padding."""
    hidden = last_hidden.masked_fill(~attention_mask.unsqueeze(-1).bool(), 0.0)
    return hidden.sum(dim=1) / attention_mask.sum(dim=1).unsqueeze(-1)

def build_context_texts(verses):
    """
    Same context-window approach as E5 pipeline:
    include ±CONTEXT_W verses from the same surah around the target.
    Target verse is marked with >> ... << so the model attends to it.
    Cross-surah context excluded to preserve structural boundaries.
    """
    surah_indices = {}
    for idx, v in enumerate(verses):
        surah_indices.setdefault(v["surah"], []).append(idx)

    texts = []
    for idx, v in enumerate(verses):
        siblings = surah_indices[v["surah"]]
        pos_in_surah = siblings.index(idx)
        window = siblings[max(0, pos_in_surah - CONTEXT_W) : pos_in_surah + CONTEXT_W + 1]

        parts = []
        for w_idx in window:
            wv = verses[w_idx]
            tag   = f">> [{wv['id']}]" if w_idx == idx else f"[{wv['id']}]"
            close = " <<" if w_idx == idx else ""
            parts.append(f"{tag} {wv['arabic']}{close}")

        texts.append(" | ".join(parts))
    return texts

def embed_texts(texts, tokenizer, model):
    # BGE-M3: no prefix needed — pass text as-is
    all_embs = []
    for i in tqdm(range(0, len(texts), BATCH_SIZE), desc="  Embedding batches"):
        batch = texts[i : i + BATCH_SIZE]
        enc = tokenizer(batch, padding=True, truncation=True, max_length=512, return_tensors="pt").to(DEVICE)
        with torch.no_grad():
            out = model(**enc)
        emb = _avg_pool(out.last_hidden_state, enc["attention_mask"])
        emb = torch.nn.functional.normalize(emb, p=2, dim=1)
        all_embs.append(emb.cpu().float().numpy())
    return np.vstack(all_embs)   # shape: (N, 1024)

# ── 3. BM25 lexical index ─────────────────────────────────────────────────────

_HARAKAT = re.compile(r'[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]')

def _tokenize(text):
    return _HARAKAT.sub("", text).split()

def build_bm25(verses):
    print("  Building BM25 index (stripped diacritics)...")
    corpus = [_tokenize(v["arabic"]) for v in verses]
    bm25 = BM25Okapi(corpus)
    print("  BM25 ready.\n")
    return bm25, corpus

def bm25_row(idx, bm25, corpus):
    """Normalized BM25 scores for verse[idx] vs all others (0–1)."""
    scores = np.array(bm25.get_scores(corpus[idx]), dtype=np.float32)
    mx = scores.max()
    if mx > 0:
        scores /= mx
    scores[idx] = 0.0
    return scores

# ── 4. UMAP 3D ────────────────────────────────────────────────────────────────

def run_umap(embeddings):
    print("Running UMAP (3D, cosine metric)...")
    umap = UMAP(
        n_components=3, n_neighbors=15, min_dist=0.1,
        spread=1.0, metric="cosine", random_state=42, verbose=True,
    )
    coords = umap.fit_transform(embeddings)
    print("UMAP done.\n")
    return coords

# ── 5. Hybrid scoring & graph assembly ───────────────────────────────────────

def assemble(verses, coords, emb, bm25, corpus):
    n = len(verses)
    print(f"Computing semantic similarity matrix ({n}×{n})...")
    sem_matrix = (emb @ emb.T).astype(np.float32)
    np.fill_diagonal(sem_matrix, 0.0)
    print("  Similarity matrix done.")

    print(f"Assembling graph with TOP_N={TOP_N}, hybrid {SEMANTIC_W:.0%}/{LEXICAL_W:.0%}...")
    graph = []
    for i in tqdm(range(n), desc="  Verses"):
        sem_row = sem_matrix[i]
        lex_row = bm25_row(i, bm25, corpus)
        hybrid  = SEMANTIC_W * sem_row + LEXICAL_W * lex_row

        top_idx = np.argsort(hybrid)[::-1][:TOP_N]
        conns = []
        for j in top_idx:
            score = float(hybrid[j])
            if score < MIN_SCORE:
                break
            conns.append({
                "id":    verses[j]["id"],
                "score": round(score, 4),
                "sem":   round(float(sem_row[j]), 4),
                "lex":   round(float(lex_row[j]), 4),
            })

        v = verses[i]
        graph.append({
            "id":          v["id"],
            "surah":       v["surah"],
            "ayah":        v["ayah"],
            "surahName":   v["surahName"],
            "surahNameEn": v["surahNameEn"],
            "arabic":      v["arabic"],
            "english":     v["english"],
            "turkish":     v["turkish"],
            "x": round(float(coords[i][0]), 4),
            "y": round(float(coords[i][1]), 4),
            "z": round(float(coords[i][2]), 4),
            "connections": conns,
        })

    return graph

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("  Quran Verse Graph — BGE-M3 Hybrid Pipeline")
    print(f"  Model   : {MODEL_NAME}  [multilingual dense retrieval]")
    print(f"  TopN    : {TOP_N}  |  Min score: {MIN_SCORE}")
    print(f"  Weights : {SEMANTIC_W:.0%} semantic  +  {LEXICAL_W:.0%} lexical (BM25)")
    print(f"  Context : ±{CONTEXT_W} verses (same-surah window)")
    print(f"  Output  : {OUT_PATH}")
    print("=" * 60 + "\n")

    # ── Embedding cache ───────────────────────────────────────────────────────
    CACHE_DIR.mkdir(parents=True, exist_ok=True)

    if EMB_CACHE.exists() and VERSES_CACHE.exists():
        print(f"Cache found — loading embeddings from {EMB_CACHE} ...")
        embeddings = np.load(EMB_CACHE)
        with open(VERSES_CACHE, encoding="utf-8") as f:
            verses = json.load(f)
        print(f"  Loaded {embeddings.shape} embeddings + {len(verses)} verses from cache.\n")
    else:
        verses           = fetch_quran()
        tokenizer, model = load_model()

        print(f"Building context texts (window ±{CONTEXT_W} verses, same-surah only)...")
        context_texts = build_context_texts(verses)
        print(f"  Example: {context_texts[1][:120]}...\n")

        print("Generating embeddings from context-enriched Arabic text...")
        embeddings = embed_texts(context_texts, tokenizer, model)
        print(f"  Embedding matrix: {embeddings.shape}\n")

        print(f"Saving embedding cache to {EMB_CACHE} ...")
        np.save(EMB_CACHE, embeddings)
        with open(VERSES_CACHE, "w", encoding="utf-8") as f:
            json.dump(verses, f, ensure_ascii=False, separators=(",", ":"))
        print(f"  Cache saved. Future runs will skip embedding step.\n")

    bm25, corpus = build_bm25(verses)
    coords       = run_umap(embeddings)
    graph        = assemble(verses, coords, embeddings, bm25, corpus)

    print(f"\nWriting {OUT_PATH} ...")
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(graph, f, ensure_ascii=False, separators=(",", ":"))

    size_mb = OUT_PATH.stat().st_size / 1024 / 1024
    print(f"Done!  {size_mb:.1f} MB  |  {len(graph)} verses  |  up to {TOP_N} connections each")
    print(f"\nTo rescore with different weights (no re-embedding): python3 scripts/rescore.py")

if __name__ == "__main__":
    main()

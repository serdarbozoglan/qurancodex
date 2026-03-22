#!/usr/bin/env python3
"""
generate-embeddings.py

Replaces the OpenAI-based pipeline with:
  - intfloat/multilingual-e5-large  (1024-dim, SOTA multilingual similarity)
  - BM25 lexical scoring             (catches near-identical verses like 2:4 ↔ 4:162)
  - Hybrid score: 65% semantic + 35% lexical

Requirements:
  pip install transformers torch sentence-transformers umap-learn rank-bm25 numpy tqdm requests

GPU recommended but CPU works (~45 min on a modern CPU).

Usage:
  python scripts/generate-embeddings.py
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

MODEL_NAME  = "intfloat/multilingual-e5-large"
# Fine-tuned for semantic similarity (not just MLM), 1024-dim embeddings.
# Works well for Arabic despite being multilingual — produces discriminated
# sentence vectors unlike untuned BERT (which collapses all texts to ~1.0 cosine).
# BM25 component catches near-identical verses like 2:4 ↔ 4:162 that share
# exact vocabulary but may differ slightly in thematic context.

TOP_N       = 20      # connections stored per verse
CONTEXT_W   = 2       # context window: N verses before + N verses after (same surah only)
BATCH_SIZE  = 16      # reduce to 8 if you run out of memory
SEMANTIC_W  = 0.65    # weight for multilingual-e5 cosine similarity
LEXICAL_W   = 0.35    # BM25 lexical weight for exact vocabulary matches
MIN_SCORE   = 0.40    # minimum hybrid score to keep a connection
OUT_PATH    = Path(__file__).parent.parent / "public" / "verse-graph.json"

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

# ── 2. Embeddings (multilingual-e5-large) ────────────────────────────────────
# multilingual-e5-large is fine-tuned for similarity tasks, NOT just masked LM.
# It requires a "passage: " prefix on all texts to be encoded as documents.
# (Use "query: " prefix when encoding a search query, "passage: " for corpus.)
# Sentence vector = mean pool of last hidden states (excluding padding).

def load_model():
    print(f"Loading model: {MODEL_NAME}  (device={DEVICE})")
    print("  First run: downloads ~2 GB from HuggingFace — please wait.\n")
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
    For each verse, build a context string that includes CONTEXT_W verses
    before and after it within the same surah.

    Format: "[S:A] arabic_text | [S:A+1] ... | >> [S:A+2] target << | ..."
    The ">>" / "<<" markers highlight the target verse so the model learns
    which verse is being represented while still seeing its neighbours.
    Cross-surah context is intentionally excluded so structural boundaries
    (end-of-surah) are not blurred.
    """
    # Group verse indices by surah for fast neighbour lookup
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
            tag = f">> [{wv['id']}]" if w_idx == idx else f"[{wv['id']}]"
            close = " <<" if w_idx == idx else ""
            parts.append(f"{tag} {wv['arabic']}{close}")

        texts.append(" | ".join(parts))
    return texts

def embed_texts(texts, tokenizer, model):
    # multilingual-e5-large requires "passage: " prefix for corpus documents
    prefixed = [f"passage: {t}" for t in texts]
    all_embs = []
    for i in tqdm(range(0, len(prefixed), BATCH_SIZE), desc="  Embedding batches"):
        batch = prefixed[i : i + BATCH_SIZE]
        enc = tokenizer(batch, padding=True, truncation=True, max_length=512, return_tensors="pt").to(DEVICE)
        with torch.no_grad():
            out = model(**enc)
        emb = _avg_pool(out.last_hidden_state, enc["attention_mask"])
        emb = torch.nn.functional.normalize(emb, p=2, dim=1)
        all_embs.append(emb.cpu().float().numpy())
    return np.vstack(all_embs)   # shape: (N, 1024)

# ── 3. BM25 lexical index ─────────────────────────────────────────────────────
# Strip harakat (diacritics) so أُنزِلَ and انزل match the same tokens.

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
    # emb is L2-normalised → dot product = cosine similarity
    sem_matrix = (emb @ emb.T).astype(np.float32)
    np.fill_diagonal(sem_matrix, 0.0)
    print("  Similarity matrix done.")

    print(f"Assembling graph with TOP_N={TOP_N}, hybrid {SEMANTIC_W:.0%}/{LEXICAL_W:.0%}...")
    graph = []
    for i in tqdm(range(n), desc="  Verses"):
        sem_row  = sem_matrix[i]
        lex_row  = bm25_row(i, bm25, corpus)
        hybrid   = SEMANTIC_W * sem_row + LEXICAL_W * lex_row

        top_idx  = np.argsort(hybrid)[::-1][:TOP_N]
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
    print("  Quran Verse Graph — Hybrid Embedding Pipeline")
    print(f"  Model   : {MODEL_NAME}  [multilingual similarity-tuned]")
    print(f"  TopN    : {TOP_N}  |  Min score: {MIN_SCORE}")
    print(f"  Weights : {SEMANTIC_W:.0%} semantic  +  {LEXICAL_W:.0%} lexical (BM25)")
    print(f"  Context : ±{CONTEXT_W} verses (same-surah window)")
    print(f"  Output  : {OUT_PATH}")
    print("=" * 60 + "\n")

    verses            = fetch_quran()
    tokenizer, model  = load_model()

    print(f"Building context texts (window ±{CONTEXT_W} verses, same-surah only)...")
    context_texts = build_context_texts(verses)
    print(f"  Example: {context_texts[1][:120]}...\n")

    print("Generating embeddings from context-enriched Arabic text...")
    embeddings = embed_texts(context_texts, tokenizer, model)
    print(f"  Embedding matrix: {embeddings.shape}\n")

    bm25, corpus = build_bm25(verses)
    coords       = run_umap(embeddings)
    graph        = assemble(verses, coords, embeddings, bm25, corpus)

    print(f"\nWriting {OUT_PATH} ...")
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(graph, f, ensure_ascii=False, separators=(",", ":"))

    size_mb = OUT_PATH.stat().st_size / 1024 / 1024
    print(f"Done!  {size_mb:.1f} MB  |  {len(graph)} verses  |  up to {TOP_N} connections each")

if __name__ == "__main__":
    main()

'use client';
import { useEffect, useRef, useState } from 'react';

// Quran.com qdc audio API — returns per-surah mp3 + per-verse word timings.
// Endpoint: api.qurancdn.com/api/qdc/audio/reciters/{id}/audio_files?chapter={N}&segments=true

const API_BASE = 'https://api.qurancdn.com/api/qdc/audio/reciters';
const LS_PREFIX = 'qurancodex_timings_';
const LS_INDEX_KEY = 'qurancodex_timings_lru';
const LS_MAX_ENTRIES = 20;

const memCache = new Map(); // key = `${reciterId}:${surah}` -> normalized data

function lsKey(reciterId, surah) {
  return `${LS_PREFIX}${reciterId}_${surah}`;
}

function lruTouch(key) {
  let order = [];
  try { order = JSON.parse(localStorage.getItem(LS_INDEX_KEY) || '[]'); } catch {/* ignore */}
  order = order.filter(k => k !== key);
  order.push(key);
  while (order.length > LS_MAX_ENTRIES) {
    const evict = order.shift();
    try { localStorage.removeItem(evict); } catch {/* ignore */}
  }
  try { localStorage.setItem(LS_INDEX_KEY, JSON.stringify(order)); } catch {/* ignore */}
}

function normalize(rawResponse) {
  const file = rawResponse?.audio_files?.[0];
  if (!file || !Array.isArray(file.verse_timings)) return null;
  const verses = {};
  for (const t of file.verse_timings) {
    if (!t?.verse_key) continue;
    // Filter marker segments — Quran.com returns single-element arrays as recitation markers
    // for some verses (e.g. 1:3, 2:255 trailing segment). Keep only [wordIdx, startMs, endMs].
    const segments = Array.isArray(t.segments)
      ? t.segments
          .filter(s => Array.isArray(s) && s.length === 3 && Number.isFinite(s[1]) && Number.isFinite(s[2]))
          .map(s => [Math.round(s[0]), Math.round(s[1]), Math.round(s[2])])
      : [];
    verses[t.verse_key] = {
      from: Math.round(t.timestamp_from || 0),
      to: Math.round(t.timestamp_to || 0),
      segments,
    };
  }
  return {
    audioUrl: file.audio_url || null,
    duration: Math.round(file.duration || 0),
    verses,
  };
}

async function fetchTimings(reciterId, surah, signal) {
  const url = `${API_BASE}/${reciterId}/audio_files?chapter=${surah}&segments=true`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`qdc audio_files HTTP ${res.status}`);
  const raw = await res.json();
  const data = normalize(raw);
  if (!data || !data.audioUrl) throw new Error('qdc audio_files invalid payload');
  return data;
}

function readLocal(reciterId, surah) {
  try {
    const raw = localStorage.getItem(lsKey(reciterId, surah));
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.audioUrl || !data?.verses) return null;
    return data;
  } catch {
    return null;
  }
}

function writeLocal(reciterId, surah, data) {
  const key = lsKey(reciterId, surah);
  try {
    localStorage.setItem(key, JSON.stringify(data));
    lruTouch(key);
  } catch {/* quota — silently skip */}
}

/**
 * Load word-level timing + per-surah audio URL from Quran.com qdc API.
 * Returns { timings, audioUrl, loading, error }. timings/audioUrl are null while loading.
 *
 * `enabled = false` short-circuits the request (e.g. karaoke off or reciter unsupported).
 * `reciterId` is the Quran.com qdc reciter id (e.g. 7 for Alafasy). When null/undefined,
 * the hook does nothing.
 */
const EMPTY = Object.freeze({ timings: null, audioUrl: null, loading: false, error: null });

export default function useWordTimings({ reciterId, surah, enabled }) {
  const [state, setState] = useState(EMPTY);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!enabled || !reciterId || !surah) {
      abortRef.current?.abort();
      abortRef.current = null;
      return;
    }

    const key = `${reciterId}:${surah}`;
    const mem = memCache.get(key);
    if (mem) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- cache-hit fast path; avoids redundant fetch.
      setState({ timings: mem.verses, audioUrl: mem.audioUrl, loading: false, error: null });
      return;
    }

    const local = readLocal(reciterId, surah);
    if (local) {
      memCache.set(key, local);
      lruTouch(lsKey(reciterId, surah));
      setState({ timings: local.verses, audioUrl: local.audioUrl, loading: false, error: null });
      return;
    }

    const ctrl = new AbortController();
    abortRef.current?.abort();
    abortRef.current = ctrl;
    setState({ timings: null, audioUrl: null, loading: true, error: null });

    fetchTimings(reciterId, surah, ctrl.signal)
      .then(data => {
        if (ctrl.signal.aborted) return;
        memCache.set(key, data);
        writeLocal(reciterId, surah, data);
        setState({ timings: data.verses, audioUrl: data.audioUrl, loading: false, error: null });
      })
      .catch(err => {
        if (ctrl.signal.aborted) return;
        setState({ timings: null, audioUrl: null, loading: false, error: err });
      });

    return () => ctrl.abort();
  }, [reciterId, surah, enabled]);

  // Derived: when the hook is disabled, always surface the empty state without
  // setStating from the effect (avoids cascading renders flagged by
  // react-hooks/set-state-in-effect).
  if (!enabled || !reciterId || !surah) return EMPTY;
  return state;
}

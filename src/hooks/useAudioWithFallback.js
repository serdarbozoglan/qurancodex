import { useState, useEffect, useRef, useCallback } from 'react';

const pad = (n, w) => String(n).padStart(w, '0');

/**
 * Fallback chain for each verse.
 * Tries everyayah.com first, then audio.qurancdn.com mirror,
 * then repeats for Abdul Basit and Husarî.
 * If all 6 URLs fail the play button greys out.
 */
const CHAIN = [
  (s, a) => `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`,
  (s, a) => `https://audio.qurancdn.com/Alafasy_128kbps/${s}${a}.mp3`,
  (s, a) => `https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/${s}${a}.mp3`,
  (s, a) => `https://audio.qurancdn.com/Abdul_Basit_Murattal_192kbps/${s}${a}.mp3`,
  (s, a) => `https://everyayah.com/data/Husary_128kbps/${s}${a}.mp3`,
  (s, a) => `https://audio.qurancdn.com/Husary_128kbps/${s}${a}.mp3`,
];

/** Build the full 6-URL fallback array for a given verse. */
export function buildFallbackUrls(surah, ayah) {
  const s = pad(surah, 3);
  const a = pad(ayah, 3);
  return CHAIN.map(fn => fn(s, a));
}

/**
 * Build a fallback chain that starts from a specific everyayah reciter ID,
 * tries its qurancdn mirror next, then continues with the remaining
 * reciters from the standard chain.
 * Used by VerseGraph and ReadingMode which expose explicit reciter selection.
 */
export function buildFallbackUrlsFromReciter(reciterId, surah, ayah) {
  const s = pad(surah, 3);
  const a = pad(ayah, 3);
  const file = `${s}${a}.mp3`;

  // All supported reciters in priority order
  const reciters = [
    'Alafasy_128kbps',
    'Abdul_Basit_Murattal_192kbps',
    'Husary_128kbps',
    'Ghamadi_40kbps',
    'Minshawy_Murattal_128kbps',
    'Muhammad_Jibreel_128kbps',
  ];

  // Start from the selected reciter, wrap around
  const startIdx = reciters.indexOf(reciterId);
  const ordered = startIdx >= 0
    ? [...reciters.slice(startIdx), ...reciters.slice(0, startIdx)]
    : reciters;

  const urls = [];
  for (const r of ordered) {
    urls.push(`https://everyayah.com/data/${r}/${file}`);
    urls.push(`https://audio.qurancdn.com/${r}/${file}`);
  }
  return urls;
}

/**
 * React hook: play a single verse with automatic CDN/reciter fallback.
 *
 * Returns { playing, loading, failed, toggle, stop }
 * - playing: true while audio is playing
 * - loading: true while trying to start (including fallback retries)
 * - failed: true when all URLs exhausted — caller should grey the button
 * - toggle: call to start/stop
 * - stop: call to stop unconditionally (e.g. on unmount or verse change)
 */
export function useAudioWithFallback(surah, ayah) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  // Single ref object avoids stale closures in nested callbacks
  const ctx = useRef({ surah, ayah, audio: null, active: false });
  ctx.current.surah = surah;
  ctx.current.ayah = ayah;

  const stop = useCallback(() => {
    ctx.current.active = false;
    const a = ctx.current.audio;
    if (a) {
      a.onerror = null;
      a.onended = null;
      a.pause();
      ctx.current.audio = null;
    }
    setPlaying(false);
    setLoading(false);
  }, []);

  // Reset when verse changes
  useEffect(() => {
    stop();
    setFailed(false);
  }, [surah, ayah, stop]);

  // Cleanup on unmount
  useEffect(() => () => stop(), [stop]);

  const tryUrl = useCallback((urlIdx) => {
    const { surah, ayah } = ctx.current;
    const urls = buildFallbackUrls(surah, ayah);

    if (urlIdx >= urls.length) {
      ctx.current.active = false;
      setFailed(true);
      setLoading(false);
      setPlaying(false);
      return;
    }

    const audio = new Audio(urls[urlIdx]);
    ctx.current.audio = audio;

    audio.onended = () => {
      if (ctx.current.audio !== audio) return;
      ctx.current.active = false;
      ctx.current.audio = null;
      setPlaying(false);
      setLoading(false);
    };

    audio.onerror = () => {
      if (ctx.current.audio !== audio) return;
      audio.onerror = null;
      audio.onended = null;
      tryUrl(urlIdx + 1);
    };

    audio.play()
      .then(() => {
        if (ctx.current.audio !== audio) return;
        setPlaying(true);
        setLoading(false);
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        if (ctx.current.audio !== audio) return;
        audio.onerror = null;
        tryUrl(urlIdx + 1);
      });
  }, []);

  const toggle = useCallback(() => {
    if (ctx.current.active) { stop(); return; }
    stop();
    setFailed(false);
    setLoading(true);
    ctx.current.active = true;
    tryUrl(0);
  }, [stop, tryUrl]);

  return { playing, loading, failed, toggle, stop };
}

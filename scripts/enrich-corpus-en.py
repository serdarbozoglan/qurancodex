#!/usr/bin/env python3
"""
Fetch word-by-word English translation + transliteration from quran.com API
and merge into existing public/corpus/{N}.json files.

Adds 'en' (English meaning) and 'translit' (Latin transliteration) per word.
Skips Fatiha (already hand-curated with both tr/en).

Usage:
  python3 scripts/enrich-corpus-en.py [START_SURAH END_SURAH]
"""
import json
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

API_BASE = 'https://api.quran.com/api/v4'

def fetch_surah_words(surah: int) -> dict:
    """Fetch all verses + words for one surah. Return {ayah_num: [{position, en, translit}, ...]}."""
    result = {}
    page = 1
    while True:
        url = f'{API_BASE}/verses/by_chapter/{surah}?words=true&per_page=50&page={page}'
        req = urllib.request.Request(url, headers={'User-Agent': 'qurancodex-enrich/1.0'})
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
        verses = data.get('verses', [])
        if not verses:
            break
        for v in verses:
            ayah_num = v['verse_number']
            words = []
            for w in v.get('words', []):
                if w.get('char_type_name') != 'word':
                    continue  # skip end-of-verse markers
                words.append({
                    'position': w.get('position'),
                    'en': (w.get('translation') or {}).get('text'),
                    'translit': (w.get('transliteration') or {}).get('text'),
                })
            result[ayah_num] = words
        meta = data.get('pagination', {})
        if page >= meta.get('total_pages', 1):
            break
        page += 1
        time.sleep(0.15)  # gentle throttle
    return result

def merge_into_corpus(surah: int, en_data: dict) -> tuple[int, int]:
    """Merge English data into existing corpus JSON. Returns (matched, total)."""
    path = Path(f'public/corpus/{surah}.json')
    if not path.exists():
        return 0, 0
    with open(path, encoding='utf-8') as f:
        corpus = json.load(f)
    matched = 0
    total = 0
    for ayah_str, words in corpus['verses'].items():
        ayah_num = int(ayah_str)
        en_words = en_data.get(ayah_num, [])
        en_by_pos = {w['position']: w for w in en_words}
        for word in words:
            total += 1
            ew = en_by_pos.get(word['idx'])
            if ew:
                if ew.get('en'):
                    word['en'] = ew['en']
                if ew.get('translit'):
                    word['translit'] = ew['translit']
                matched += 1
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(corpus, f, ensure_ascii=False, indent=2)
    return matched, total

def main():
    args = sys.argv[1:]
    start = int(args[0]) if len(args) >= 1 else 2  # skip Fatiha by default
    end = int(args[1]) if len(args) >= 2 else 114
    print(f'Enriching surahs {start}..{end} with English word data', file=sys.stderr)
    for s in range(start, end + 1):
        try:
            print(f'  [{s:3d}] fetch...', end=' ', file=sys.stderr, flush=True)
            en_data = fetch_surah_words(s)
            matched, total = merge_into_corpus(s, en_data)
            print(f'matched {matched}/{total} words', file=sys.stderr)
        except urllib.error.HTTPError as e:
            print(f'HTTP {e.code} — skip', file=sys.stderr)
        except Exception as e:
            print(f'ERROR: {e}', file=sys.stderr)
        time.sleep(0.25)  # between surahs

if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
Merge Diyanet word-by-word Turkish translations into Leeds-based corpus JSONs.

Source: QuranWBW.com static CDN (resource_id 77 = "Turkish Translation (Diyanet)")
URL: https://static.quranwbw.com/data/v4/words-data/translations/6.json
Schema: {"<surah>": {"<ayah>": [[word1_tr, word2_tr, ...]]}}

Adds `tr` field to each word in public/corpus/{N}.json (skips Fatiha — already curated).

Usage:
  python3 scripts/merge-turkish-wbw.py /tmp/wbw_tr.json
"""
import json
import sys
from pathlib import Path

def main():
    if len(sys.argv) < 2:
        print('Usage: merge-turkish-wbw.py <wbw_tr.json>', file=sys.stderr)
        sys.exit(1)

    wbw_path = sys.argv[1]
    with open(wbw_path, encoding='utf-8') as f:
        wbw = json.load(f)

    out_dir = Path('public/corpus')
    total_matched = 0
    total_words = 0
    total_misaligned = 0

    for surah in range(2, 115):  # skip Fatiha (1) — hand-curated
        path = out_dir / f'{surah}.json'
        if not path.exists():
            continue
        with open(path, encoding='utf-8') as f:
            corpus = json.load(f)

        wbw_surah = wbw.get(str(surah), {})

        for ayah_str, words in corpus['verses'].items():
            wbw_words = wbw_surah.get(ayah_str, [[]])[0] or []
            for word in words:
                total_words += 1
                # idx is 1-based, position is 0-based in WBW array
                tr = wbw_words[word['idx'] - 1] if word['idx'] - 1 < len(wbw_words) else None
                if tr:
                    word['tr'] = tr
                    total_matched += 1
                else:
                    total_misaligned += 1

        # Add Diyanet attribution to source block
        corpus['source']['turkish'] = {
            'name': 'Diyanet İşleri Başkanlığı (kelime meal)',
            'via': 'QuranWBW.com (resource #77)',
            'url': 'https://quranwbw.com',
        }

        with open(path, 'w', encoding='utf-8') as f:
            json.dump(corpus, f, ensure_ascii=False, indent=2)

    print(f'Matched: {total_matched}/{total_words} words ({total_misaligned} misaligned)',
          file=sys.stderr)

if __name__ == '__main__':
    main()

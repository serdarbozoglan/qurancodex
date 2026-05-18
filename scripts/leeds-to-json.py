#!/usr/bin/env python3
"""
Parse Leeds Quranic Arabic Corpus (morphology v0.4) → per-surah JSON
matching the format of public/corpus/fatiha.json.

Usage:
  python3 scripts/leeds-to-json.py /tmp/qc-morph.txt [SURAH_NUM ...]

Without surah arguments, processes all 114 surahs.
With arguments, processes only those (used for pilot validation).

Output: public/corpus/{N}.json (or {N}-pilot.json with --pilot flag).

Includes per word: idx, ar (Buckwalter→Arabic), pos, root, lemma,
features (English), featuresTr (Turkish — classical sarf terminology).
Does NOT include tr/en word translations — those require a separate
source (e.g. quran.com word-by-word API) and can be merged later.
"""
import re
import json
import sys
from pathlib import Path

# ── Buckwalter → Arabic Unicode mapping ─────────────────────────────────
BW = {
    'A': 'ا', 'b': 'ب', 't': 'ت', 'v': 'ث', 'j': 'ج', 'H': 'ح', 'x': 'خ',
    'd': 'د', '*': 'ذ', 'r': 'ر', 'z': 'ز', 's': 'س', '$': 'ش', 'S': 'ص',
    'D': 'ض', 'T': 'ط', 'Z': 'ظ', 'E': 'ع', 'g': 'غ', 'f': 'ف', 'q': 'ق',
    'k': 'ك', 'l': 'ل', 'm': 'م', 'n': 'ن', 'h': 'ه', 'w': 'و', 'y': 'ي',
    'Y': 'ى', 'p': 'ة', "'": 'ء', '>': 'أ', '<': 'إ', '&': 'ؤ', '}': 'ئ',
    '|': 'آ', '{': 'ٱ',
    'a': '\u064E', 'u': '\u064F', 'i': '\u0650', 'o': '\u0652',
    '~': '\u0651',
    # Tanwins: F = fathatan (-an), N = dammatan (-un), K = kasratan (-in)
    'F': '\u064B', 'N': '\u064C', 'K': '\u064D',
    '`': '\u0670', '^': '\u0653',
}

# Editorial / annotation chars that appear in the FORM column but are not
# part of the actual Arabic word (Leeds occasionally uses these for
# linguistic notes; they have no glyph and must be stripped).
NOISE = set(',[];()')

def bw_to_ar(s: str) -> str:
    return ''.join(BW.get(c, c) for c in s if c not in NOISE)

def root_to_dashed(root_bw: str) -> str:
    """smw → س-م-و"""
    return '-'.join(BW.get(c, c) for c in root_bw)

# ── POS tag → label (Leeds documentation) ──────────────────────────────
POS_EN = {
    'N': 'noun', 'PN': 'proper noun', 'ADJ': 'adjective',
    'IMPN': 'imperative noun', 'PRON': 'pronoun', 'DEM': 'demonstrative',
    'REL': 'relative pronoun', 'V': 'verb', 'P': 'preposition',
    'T': 'time adverb', 'LOC': 'location adverb', 'CONJ': 'conjunction',
    'SUB': 'subordinating conjunction', 'NEG': 'negative particle',
    'INTG': 'interrogative', 'COND': 'conditional particle',
    'CERT': 'certainty particle', 'RES': 'restriction particle',
    'AMD': 'amendment particle', 'ANS': 'answer particle',
    'EXP': 'expository particle', 'AVR': 'aversion particle',
    'INL': 'Quranic initials', 'CIRC': 'circumstantial particle',
    'COM': 'comitative particle', 'EQ': 'equalisation particle',
    'EXH': 'exhortation particle', 'EXL': 'explanation particle',
    'FUT': 'future particle', 'IMPV': 'imperative particle',
    'INC': 'inceptive particle', 'INT': 'interpretation particle',
    'CAUS': 'causal particle', 'PREV': 'preventive particle',
    'PRO': 'prohibition particle', 'REM': 'resumption particle',
    'RET': 'retraction particle', 'RSLT': 'result particle',
    'SUP': 'supplemental particle', 'SUR': 'surprise particle',
    'VOC': 'vocative particle', 'DET': 'determiner', 'ACC': 'accusative particle',
}

POS_TR = {
    'N': 'isim', 'PN': 'özel isim', 'ADJ': 'sıfat',
    'IMPN': 'emir/tepki ismi', 'PRON': 'zamir', 'DEM': 'işaret zamiri',
    'REL': 'ilgi zamiri (mevsûl)', 'V': 'fiil', 'P': 'edat (cer harfi)',
    'T': 'zaman zarfı', 'LOC': 'mekân zarfı', 'CONJ': 'bağlaç',
    'SUB': 'bağlaç (yan cümle)', 'NEG': 'olumsuzluk edatı',
    'INTG': 'soru edatı', 'COND': 'şart edatı', 'CERT': 'tahkik edatı',
    'RES': 'hasr edatı', 'AMD': 'yemin edatı', 'ANS': 'cevap edatı',
    'EXP': 'açıklayıcı edat', 'AVR': 'çağırma edatı',
    'INL': 'mukatta harfi', 'CIRC': 'hâl edatı',
    'COM': 'birliktelik edatı', 'EQ': 'denklik edatı',
    'EXH': 'teşvik edatı', 'EXL': 'açıklama edatı',
    'FUT': 'gelecek zaman edatı', 'IMPV': 'emir edatı',
    'INC': 'istifham cevabı', 'INT': 'tahkik edatı',
    'CAUS': 'sebep edatı', 'PREV': 'önleme edatı',
    'PRO': 'yasaklama edatı', 'REM': 'atıf edatı',
    'RET': 'geri dönüş edatı', 'RSLT': 'sonuç edatı',
    'SUP': 'ilâve edatı', 'SUR': 'şaşırtma edatı',
    'VOC': 'nida edatı', 'DET': 'belirleyici (al-)',
    'ACC': 'inne ve benzeri',
}

# ── Morphological features ────────────────────────────────────────────
FEAT_EN = {
    'NOM': 'nominative', 'GEN': 'genitive', 'ACC': 'accusative',
    'M': 'masculine', 'F': 'feminine',
    'MS': 'masculine singular', 'FS': 'feminine singular',
    'MP': 'masculine plural', 'FP': 'feminine plural',
    'MD': 'masculine dual', 'FD': 'feminine dual',
    'S': 'singular', 'P': 'plural', 'D': 'dual',
    '1S': '1st person singular', '2MS': '2nd person masculine singular',
    '2FS': '2nd person feminine singular', '3MS': '3rd person masculine singular',
    '3FS': '3rd person feminine singular',
    '1P': '1st person plural', '2MP': '2nd person masculine plural',
    '2FP': '2nd person feminine plural', '3MP': '3rd person masculine plural',
    '3FP': '3rd person feminine plural',
    '2D': '2nd person dual', '3MD': '3rd person masculine dual',
    '3FD': '3rd person feminine dual',
    'INDEF': 'indefinite', 'DEF': 'definite',
    'PERF': 'perfect', 'IMPF': 'imperfect', 'IMPV': 'imperative',
    'PASS': 'passive', 'ACT': 'active',
    'MOOD:IND': 'indicative mood', 'MOOD:SUBJ': 'subjunctive mood',
    'MOOD:JUS': 'jussive mood', 'JUS': 'jussive',
    'VF:1': 'verb form I', 'VF:2': 'verb form II', 'VF:3': 'verb form III',
    'VF:4': 'verb form IV', 'VF:5': 'verb form V', 'VF:6': 'verb form VI',
    'VF:7': 'verb form VII', 'VF:8': 'verb form VIII', 'VF:9': 'verb form IX',
    'VF:10': 'verb form X', 'VF:11': 'verb form XI', 'VF:12': 'verb form XII',
}

FEAT_TR = {
    'NOM': 'merfu', 'GEN': 'mecrur', 'ACC': 'mansub',
    'M': 'müzekker', 'F': 'müennes',
    'MS': 'müzekker müfred', 'FS': 'müennes müfred',
    'MP': 'müzekker çoğul', 'FP': 'müennes çoğul',
    'MD': 'müzekker tesniye', 'FD': 'müennes tesniye',
    'S': 'müfred', 'P': 'çoğul', 'D': 'tesniye',
    '1S': 'mütekellim müfred', '2MS': 'muhâtab müzekker müfred',
    '2FS': 'muhâtab müennes müfred', '3MS': 'gâib müzekker müfred',
    '3FS': 'gâib müennes müfred',
    '1P': 'mütekellim cem', '2MP': 'muhâtab müzekker cem',
    '2FP': 'muhâtab müennes cem', '3MP': 'gâib müzekker cem',
    '3FP': 'gâib müennes cem',
    '2D': 'muhâtab tesniye', '3MD': 'gâib müzekker tesniye',
    '3FD': 'gâib müennes tesniye',
    'INDEF': 'nekira', 'DEF': 'marife',
    'PERF': 'mâzi', 'IMPF': 'muzâri', 'IMPV': 'emir',
    'PASS': 'meçhul', 'ACT': 'mâlum',
    'MOOD:IND': 'merfu (muzâri)', 'MOOD:SUBJ': 'mansub (muzâri)',
    'MOOD:JUS': 'meczum (muzâri)', 'JUS': 'meczum',
    'VF:1': 'I. bab (sülâsî mücerred)', 'VF:2': 'II. bab (tef\'îl)',
    'VF:3': 'III. bab (mufâ\'ale)', 'VF:4': 'IV. bab (if\'âl)',
    'VF:5': 'V. bab (tefe\'\'ul)', 'VF:6': 'VI. bab (tefâ\'ul)',
    'VF:7': 'VII. bab (infi\'âl)', 'VF:8': 'VIII. bab (ifti\'âl)',
    'VF:9': 'IX. bab (if\'ilâl)', 'VF:10': 'X. bab (istif\'âl)',
}

def parse_features(feature_str: str) -> list[str]:
    """Split features string by | and return list."""
    return feature_str.split('|')

def parse_corpus(path: str, surah_filter: set | None = None) -> dict:
    """
    Parse Leeds corpus → dict {(surah, ayah, word): list of segment dicts}.
    Each segment dict: {seg, tag, form, feats}.
    """
    words: dict = {}
    with open(path, encoding='utf-8') as f:
        for line in f:
            line = line.rstrip('\n')
            if not line or line.startswith('#') or line.startswith('LOCATION'):
                continue
            parts = line.split('\t')
            if len(parts) < 4:
                continue
            loc, form, tag, feature_str = parts[0], parts[1], parts[2], parts[3]
            m = re.match(r'\((\d+):(\d+):(\d+):(\d+)\)', loc)
            if not m:
                continue
            s, a, w, seg = int(m.group(1)), int(m.group(2)), int(m.group(3)), int(m.group(4))
            if surah_filter is not None and s not in surah_filter:
                continue
            words.setdefault((s, a, w), []).append({
                'seg': seg, 'tag': tag, 'form': form,
                'feats': parse_features(feature_str),
            })
    return words

def find_stem(segments: list[dict]) -> dict:
    """Find the segment that carries the stem (POS-bearing) info."""
    for seg in segments:
        if 'STEM' in seg['feats']:
            return seg
    # Fallback to first non-prefix/suffix segment
    for seg in segments:
        if not any(f in ('PREFIX', 'SUFFIX') or f.startswith('PREFIX') or f.startswith('SUFFIX')
                   for f in seg['feats']):
            return seg
    return segments[0]

def extract_word(segments: list[dict]) -> dict:
    """Extract POS, root, lemma, raw features from word's segments."""
    stem = find_stem(segments)
    pos = root_bw = lemma_bw = None
    raw = []
    for f in stem['feats']:
        if f.startswith('POS:'):
            pos = f.split(':', 1)[1]
        elif f.startswith('ROOT:'):
            root_bw = f.split(':', 1)[1]
        elif f.startswith('LEM:'):
            lemma_bw = f.split(':', 1)[1]
        elif f in ('STEM',) or f.startswith('PREFIX') or f.startswith('SUFFIX'):
            continue
        else:
            raw.append(f)
    return {
        'pos': pos,
        'root': root_to_dashed(root_bw) if root_bw else None,
        'lemma': bw_to_ar(lemma_bw) if lemma_bw else None,
        'raw': raw,
    }

def features_to_label(raw: list[str], pos: str | None, lang: str) -> str:
    """Build a readable feature string. Order: features then POS."""
    table = FEAT_EN if lang == 'en' else FEAT_TR
    pos_table = POS_EN if lang == 'en' else POS_TR
    parts = [table[f] for f in raw if f in table]
    if pos and pos in pos_table:
        parts.append(pos_table[pos])
    return ' '.join(parts) if parts else (pos_table.get(pos, pos or '') if pos else '')

def reconstruct_arabic(segments: list[dict]) -> str:
    """Concatenate all segment forms (in segment order) → Arabic word."""
    sorted_segs = sorted(segments, key=lambda s: s['seg'])
    return ''.join(bw_to_ar(s['form']) for s in sorted_segs)

# ── Surah metadata ─────────────────────────────────────────────────────
SURAH_NAMES = {
    1: ('Al-Fatiha', 'الفاتحة', 'Fâtiha'),
    36: ('Ya-Sin', 'يس', 'Yâ-Sîn'),
    112: ('Al-Ikhlas', 'الإخلاص', 'İhlâs'),
    # Full table elsewhere — populate when scaling beyond pilot
}

def main():
    args = sys.argv[1:]
    if not args:
        print('Usage: leeds-to-json.py <corpus_path> [SURAH_NUM ...]', file=sys.stderr)
        sys.exit(1)
    corpus_path = args[0]
    surah_filter = set(int(s) for s in args[1:]) if len(args) > 1 else None

    print(f'Parsing {corpus_path}...', file=sys.stderr)
    words = parse_corpus(corpus_path, surah_filter)

    by_surah: dict = {}
    for (s, a, w), segments in words.items():
        by_surah.setdefault(s, {}).setdefault(a, {})[w] = segments

    out_dir = Path('public/corpus')
    out_dir.mkdir(exist_ok=True)

    for s in sorted(by_surah.keys()):
        ayahs = by_surah[s]
        name_en, name_ar, name_tr = SURAH_NAMES.get(s, (f'Surah {s}', '', ''))
        out = {
            'surah': s,
            'name': name_en,
            'nameAr': name_ar,
            'nameTr': name_tr,
            'source': {
                'name': 'Quranic Arabic Corpus',
                'author': 'Kais Dukes',
                'institution': 'Leeds University',
                'url': 'https://corpus.quran.com',
                'license': 'GPL — atıfla / with attribution',
                'fetchedAt': '2026-05-04',
            },
            'verses': {},
        }
        for a in sorted(ayahs.keys()):
            words_in_ayah = []
            for w in sorted(ayahs[a].keys()):
                segments = ayahs[a][w]
                d = extract_word(segments)
                words_in_ayah.append({
                    'idx': w,
                    'ar': reconstruct_arabic(segments),
                    'pos': d['pos'],
                    'root': d['root'],
                    'lemma': d['lemma'],
                    'features': features_to_label(d['raw'], d['pos'], 'en'),
                    'featuresTr': features_to_label(d['raw'], d['pos'], 'tr'),
                })
            out['verses'][str(a)] = words_in_ayah

        # Pilot output uses -pilot suffix to avoid clobbering existing fatiha.json
        suffix = '-pilot' if surah_filter else ''
        outpath = out_dir / f'{s}{suffix}.json'
        with open(outpath, 'w', encoding='utf-8') as f:
            json.dump(out, f, ensure_ascii=False, indent=2)
        print(f'  → {outpath} ({len(ayahs)} ayet, {sum(len(ws) for ws in ayahs.values())} kelime)',
              file=sys.stderr)

if __name__ == '__main__':
    main()

#!/usr/bin/env node
// ─── pre-push-guard — CLAUDE.md'nin push-öncesi kurallarını ZORUNLU kılar ───
//
// 14 Ağustos 2026, kullanıcı isteği: bir agent CLAUDE.md'deki "dikkat
// edilecekler" (§13.0, §13.25, §13.26, §13.27) kısmını okumadan/uygulamadan
// yeni kod push etmesin. "Okudu mu" hook'la doğrulanamaz — ama CLAUDE.md'nin
// KENDİSİ zaten iki zorunlu, script'li kontrol tanımlıyor (§13.25 renk
// sistemi, §13.27 iç mimari sızıntısı). Bu hook o ikisini gerçekten
// ZORUNLU kılar: `git push` denemesini yakalar, ikisini de otomatik
// çalıştırır, biri bile kırmızıysa push'u ENGELLER.
//
// Kontrast (§13.26) buraya DAHİL DEĞİL — çalışan bir prod/dev sunucu ve
// Playwright/Chromium ister, bir PreToolUse hook'unda güvenle koşturulamaz
// (sunucu ayakta olmayabilir, birkaç dakika sürebilir). Onun yerine push
// izin verilse bile bir HATIRLATMA yazdırılır.
//
// Kayıt: `.claude/settings.local.json` → hooks.PreToolUse, matcher "Bash".
// Format: stdin'den JSON `{ tool_input: { command }, cwd }` okur.
// Exit 2 = engelle (stderr agent'a gerekçe olarak döner). Exit 0 = izin ver.
// ────────────────────────────────────────────────────────────────────────────

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

let payload = '';
process.stdin.on('data', (d) => { payload += d; });
process.stdin.on('end', () => {
  let input;
  try { input = JSON.parse(payload); } catch { process.exit(0); }

  const command = input?.tool_input?.command || '';
  // Yalnız gerçek bir push denemesini yakala — "git push" alt dizesi geçen
  // ama push OLMAYAN komutları (örn. bir grep, bir yorum) tetiklemesin diye
  // kelime sınırlarıyla eşleştir.
  if (!/(^|[;&|]\s*)git\s+push\b/.test(command)) process.exit(0);

  const cwd = input.cwd || process.cwd();
  const candidates = [path.join(cwd, 'next'), cwd, path.join(cwd, '..', 'next')];
  const nextDir = candidates.find((d) => fs.existsSync(path.join(d, 'scripts/audit-colors.mjs')));
  if (!nextDir) {
    // Bu repo'ya ait bir push değil (script'ler bulunamadı) — dokunma.
    process.exit(0);
  }

  const checks = [
    ['renk sistemi — §13.25', 'node scripts/audit-colors.mjs --ci'],
    ['iç mimari sızıntısı — §13.27', 'node scripts/audit-internal-leak.mjs --ci'],
  ];

  const failures = [];
  for (const [label, cmd] of checks) {
    try {
      execSync(cmd, { cwd: nextDir, stdio: 'pipe', timeout: 60_000 });
    } catch (e) {
      const out = (e.stdout?.toString() || '') + (e.stderr?.toString() || '');
      failures.push(`✗ ${label}\n${out.trim().slice(-1200)}`);
    }
  }

  if (failures.length) {
    console.error(
      '🚫 PUSH ENGELLENDİ — CLAUDE.md zorunlu kontrollerinden biri kırmızı:\n\n' +
      failures.join('\n\n') +
      '\n\n──────────────────────────────────────────────────────────\n' +
      'Bunlar CLAUDE.md §13.0 kontrol listesinin ZATEN yazdığı kurallardır —\n' +
      'yeni kod bunları kırdıysa önce düzelt, sonra tekrar push dene.\n' +
      'Kullanıcı açıkça "atla" derse bu hook\'u --no-verify DEĞİL, kullanıcının\n' +
      'kendi onayıyla geçebilirsin; onsuz atlama.'
    );
    process.exit(2);
  }

  console.error(
    '✓ renk sistemi (§13.25) + iç mimari sızıntısı (§13.27) kontrolleri geçti.\n' +
    "⚠ Bu hook'un KAPSAMADIĞI, elle doğrulanması gereken iki şey:\n" +
    '  · Kontrast (§13.26) — sunucu gerektirir, otomatik çalışmadı:\n' +
    '      node scripts/audit-contrast.mjs --ci\n' +
    '  · Yeni bir sayfa/bileşen eklendiyse CLAUDE.md §13.0 kontrol listesi\n' +
    '    (kategori renkleri AA\'ya tabi mi, isMobile düzen için kullanılmış mı,\n' +
    '    JSON\'a yazılan renk/Arapça doğrulandı mı, vb.) gözden geçirildi mi?'
  );
  process.exit(0);
});

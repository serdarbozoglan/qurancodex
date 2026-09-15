import { chromium } from 'playwright'; import fs from 'fs'; import path from 'path';
// Tum rotalari MOBILDE tarar: yatay tasma, ekran disina kirpilan metin,
// cakisan blok metinler, ikinci satira saran navbar. Uretim sunucusuna (:3000)
// karsi kosar. sr-only ogeler ve kapali <details> icerigi olcum disi.
const BASE = process.env.BASE || 'http://localhost:3000'; const OUT = '/tmp/mob'; fs.mkdirSync(OUT, { recursive: true });
function allRoutes() { const dir = path.join(process.cwd(), 'src/app/[locale]'); const out = [];
  (function walk(d, rel = '') { for (const f of fs.readdirSync(d)) { const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) { if (f.startsWith('[')) continue; walk(p, rel + '/' + f); } else if (f === 'page.js') out.push(rel || ''); } })(dir); return out.sort(); }
const only = process.argv.slice(2);
const routes = only.length ? only : ['tr', 'en'].flatMap(l => allRoutes().map(r => `/${l}${r}`));
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 734 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const rows = [];
for (const u of routes) { const p = await ctx.newPage();
  try { await p.goto(BASE + u, { waitUntil: 'networkidle', timeout: 90000 }); await p.waitForTimeout(1500);
    await p.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(e => e.classList.add('is-revealed')));
    const r = await p.evaluate(() => {
      const vw = innerWidth; const de = document.documentElement;
      const hOverflow = Math.max(0, de.scrollWidth - de.clientWidth);
      const nav = document.querySelector('nav'); const navH = nav ? nav.getBoundingClientRect().height : 0;
      const hiddenByAncestor = (e) => { for (let a = e; a && a !== document.body; a = a.parentElement) { const ac = getComputedStyle(a);
        if ((ac.position === 'absolute' && parseFloat(ac.width) <= 1 && parseFloat(ac.height) <= 1) || ac.clip === 'rect(0px, 0px, 0px, 0px)') return true; } return false; };
      const leaves = [...document.querySelectorAll('body *')].filter(e => { if (e.children.length) return false; const t = (e.textContent || '').trim(); if (t.length < 3) return false;
        const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.05) return false;
        if (e.closest('[aria-hidden="true"],nav,script,style,noscript')) return false;
        const dt = e.closest('details'); if (dt && !dt.open && !e.closest('summary')) return false;
        if (hiddenByAncestor(e)) return false;
        const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
      const inScroller = (e) => { for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) { const cs = getComputedStyle(a); if (/(auto|scroll)/.test(cs.overflowX + cs.overflow)) return true; } return false; };
      const clipped = leaves.filter(e => { const r = e.getBoundingClientRect(); return (r.right > vw + 2 || r.left < -2) && !inScroller(e); }).map(e => (e.textContent || '').trim().slice(0, 40));
      const blockish = leaves.filter(e => !/^inline/.test(getComputedStyle(e).display));
      const rects = blockish.slice(0, 400).map(e => ({ e, r: e.getBoundingClientRect() }));
      const overl = [];
      for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) { const a = rects[i].r, c = rects[j].r;
        const ix = Math.min(a.right, c.right) - Math.max(a.left, c.left), iy = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top);
        if (ix > 0 && iy > 0) { const fx = ix / Math.min(a.width, c.width), fy = iy / Math.min(a.height, c.height);
          if (fx > 0.3 && fy > 0.5 && Math.min(a.height, c.height) > 8 && !rects[i].e.contains(rects[j].e) && !rects[j].e.contains(rects[i].e)) overl.push([(rects[i].e.textContent || '').trim().slice(0, 28), (rects[j].e.textContent || '').trim().slice(0, 28)]); } }
      return { hOverflow, navH: Math.round(navH), clipped: clipped.slice(0, 5), overl: overl.slice(0, 5), nClipped: clipped.length, nOverl: overl.length }; });
    const bad = r.hOverflow > 2 || r.nClipped > 0 || r.nOverl > 0 || r.navH > 100;
    const name = u.replace(/\//g, '_') || '_root';
    if (bad) await p.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
    rows.push({ u, ...r, bad });
    console.log(`${bad ? '⛔' : '✓ '} ${u.padEnd(38)} tasma=${r.hOverflow} kirpik=${r.nClipped} cakisma=${r.nOverl} nav=${r.navH}${r.clipped.length ? '  KIRPIK: ' + JSON.stringify(r.clipped) : ''}${r.overl.length ? '  CAKISMA: ' + JSON.stringify(r.overl) : ''}`);
  } catch (e) { console.log('HATA', u, e.message.slice(0, 60)); rows.push({ u, err: true, bad: true }); }
  await p.close(); }
await b.close();
fs.writeFileSync(OUT + '/_rapor.json', JSON.stringify(rows, null, 1));
console.log(`\nTOPLAM ${rows.length} rota, sorunlu ${rows.filter(r => r.bad).length}`);

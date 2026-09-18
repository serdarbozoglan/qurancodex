import { chromium } from 'playwright';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:3000/tr/oku/102',{waitUntil:'networkidle'});await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>({
  dugmeler:[...document.querySelectorAll('button')].map(b=>(b.textContent||'').trim()).filter(Boolean).slice(0,25),
  rmPage:document.querySelectorAll('[data-rm-page]').length,
  rmSurah:document.querySelectorAll('[data-rm-surah]').length,
  rmVerse:document.querySelectorAll('[id^="rm-verse-"]').length,
})));

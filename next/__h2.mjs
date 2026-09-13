import { chromium } from 'playwright';
import { CONTRAST_PROBE } from './tests/lib/contrast.mjs';
const R=process.argv.slice(2);
const b=await chromium.launch(); const combos={}; let tot=0;
for(const r of R){
  const ctx=await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  const pg=await ctx.newPage();
  try{
    await pg.goto('http://localhost:3000'+r,{waitUntil:'networkidle',timeout:90000});
    await pg.waitForTimeout(2000);
    const seen=new Map(); const h=await pg.evaluate(()=>document.body.scrollHeight);
    for(let y=0;y<h;y+=700){ await pg.evaluate(yy=>window.scrollTo(0,yy),y); await pg.waitForTimeout(700);
      for(const f of await pg.evaluate(CONTRAST_PROBE)) seen.set(`${f.color}|${f.px}|${f.bg}|${f.opacity}`,f); }
    const real=[...seen.values()].filter(f=>f.px<24);
    tot+=real.length; console.log(`  ${String(real.length).padStart(3)}  ${r}`);
    for(const f of real){ const k=`${f.color} @${f.opacity}`; (combos[k]=combos[k]||[]).push({...f,route:r}); }
  }catch(e){ console.log('  HATA',r,e.message.slice(0,50)); }
  await ctx.close();
}
console.log('\nTOPLAM:',tot,'\n--- kombinasyonlar:');
for(const [k,v] of Object.entries(combos).sort((a,b)=>b[1].length-a[1].length).slice(0,14))
  console.log(`  ${String(v.length).padStart(3)}x oran~${v[0].ratio}  ${k}\n        "${(v[0].text||'').slice(0,46)}"  [${v[0].route}]`);
await b.close();

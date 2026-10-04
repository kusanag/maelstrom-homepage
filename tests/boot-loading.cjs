const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
let browser;
(async()=>{
 browser=await chromium.launch();
 let failures=0;
 const check=async(name,fn)=>{try{await fn();console.log('PASS',name)}catch(e){failures++;console.error('FAIL',name,e.message)}};
 async function setup(options={}){
  const p=await browser.newPage({viewport:{width:1440,height:900},...options});
  let release;const gate=new Promise(r=>release=r);
  if(process.env.HOMEPAGE_LOCAL_THEME)await p.route('**/api/config/custom.css*',r=>r.fulfill({body:fs.readFileSync(path.join(__dirname,'../theme/custom.css')),contentType:'text/css'}));
  await p.route('**/api/config/custom.js*',async r=>{await gate;if(!process.env.HOMEPAGE_LOCAL_THEME)await r.continue();else await r.fulfill({body:fs.readFileSync(path.join(__dirname,'../theme/custom.js')),contentType:'application/javascript'});});
  await p.goto(process.env.HOMEPAGE_URL||'http://localhost:3000',{waitUntil:'domcontentloaded'});
  await p.locator('.service-card').first().waitFor();
  return {p,release};
 }
 const curtain=p=>p.evaluate(()=>{const s=getComputedStyle(document.documentElement,'::before');return s.content!=='none'&&s.visibility!=='hidden'&&s.position==='fixed'&&s.backgroundColor==='rgb(5, 2, 3)'&&s.opacity==='1'&&parseFloat(s.width)>=innerWidth&&parseFloat(s.height)>=innerHeight;});
 const first=await setup();
 await check('dashboard is covered while the intro script is delayed',async()=>assert.ok(await curtain(first.p)));
 first.release();
 await check('curtain hands directly into Samurai and skip reveals the dashboard',async()=>{
  await first.p.locator('#nw-boot').waitFor();assert.equal(await curtain(first.p),false);
  await first.p.keyboard.press('Escape');await first.p.locator('#nw-boot').waitFor({state:'detached'});
  assert.equal(await curtain(first.p),false);await first.p.getByRole('tab',{name:'VITALS',exact:true}).click();
 });
 await check('seen intro does not replay or leave a curtain after reload',async()=>{
  await first.p.reload({waitUntil:'domcontentloaded'});await first.p.waitForFunction(()=>window.__maelstromDeck);
  assert.equal(await first.p.locator('#nw-boot').count(),0);assert.equal(await curtain(first.p),false);
 });
 await first.p.close();
 const reduced=await setup({reducedMotion:'reduce'});
 await check('reduced motion bypasses the loading curtain and intro',async()=>{
  assert.equal(await curtain(reduced.p),false);reduced.release();await reduced.p.waitForFunction(()=>window.__maelstromDeck);assert.equal(await reduced.p.locator('#nw-boot').count(),0);
 });await reduced.p.close();
 const late=await setup();
 await check('failed or very late script cannot leave a curtain or start a late intro',async()=>{
  await late.p.waitForTimeout(6500);assert.equal(await curtain(late.p),false);
  await late.p.getByRole('tab').nth(1).click();
  late.release();await late.p.waitForFunction(()=>window.__maelstromDeck);
  assert.equal(await late.p.locator('#nw-boot').count(),0);
 });late.release();await late.p.close();
 await browser.close();process.exitCode=failures?1:0;
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1});

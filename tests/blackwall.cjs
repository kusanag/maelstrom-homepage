const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const output=process.env.ARTIFACT_DIR||'test-results';
fs.mkdirSync(output,{recursive:true});
let browser;
(async()=>{
 browser=await chromium.launch();
 const p=await browser.newPage({viewport:{width:3440,height:1340}});
 p.setDefaultTimeout(3000);
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 if(process.env.HOMEPAGE_LOCAL_THEME)for(const ext of ['css','js'])await p.route(`**/api/config/custom.${ext}*`,r=>r.fulfill({body:fs.readFileSync(path.join(__dirname,`../theme/custom.${ext}`)),contentType:ext==='css'?'text/css':'application/javascript'}));
 // Record production delays; shorten only the long idle waits in this browser.
 await p.addInitScript(()=>{
  sessionStorage.setItem('ms_boot_samurai_v2','1');
  window.__msScheduledDelays=[];
  // A legal RAF timestamp can be slightly older than the event starting a burst.
  const raf=requestAnimationFrame;let firstPaint=true;
  window.requestAnimationFrame=fn=>raf(time=>{
   if(fn.name==='paint'&&firstPaint){firstPaint=false;time-=50;}
   fn(time);
  });
  const native=setTimeout;
  window.setTimeout=(fn,delay,...args)=>{
   if(typeof fn==='function'&&fn.name==='burst'){window.__msScheduledDelays.push(delay);delay=5000;}
   return native(fn,delay,...args);
  };
 });
 await p.goto(process.env.HOMEPAGE_URL||'http://localhost:3000',{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>window.__maelstromDeck);
 await p.evaluate(()=>document.fonts.ready);
 let failures=0;
 const check=async(name,fn)=>{try{await fn();console.log('PASS',name)}catch(e){failures++;console.error('FAIL',name,e.message)}};
 await check('Rajdhani typography and crimson label plates render',async()=>{
  const styles=await p.evaluate(()=>['#myTab button[aria-selected="true"]','.service-group-name','.service-name'].map(s=>{const c=getComputedStyle(document.querySelector(s));return {font:c.fontFamily,size:parseFloat(c.fontSize),background:c.backgroundColor}}));
  for(const s of styles)assert.ok(s.font.includes('Rajdhani'));
  assert.equal(styles[1].background,'rgb(255, 41, 61)');
  assert.equal(styles[1].size,16);
 });
 await check('first glitch waits at least 30 seconds',async()=>{
  const delays=await p.evaluate(()=>window.__msScheduledDelays);
  assert.ok(delays.length>0);assert.ok(delays[0]>=30000&&delays[0]<=150000);
 });
 await check('Blackwall effect runs then clears without moving launcher hit targets',async()=>{
  await p.waitForFunction(()=>!document.querySelector('.ms-enter'));
  const link=p.locator('[data-ms-group="core"] .service-card a[href]').first();const before=await link.boundingBox();
  await p.waitForFunction(()=>document.body.classList.contains('ms-blackwall-active'),{},{timeout:20000});
  assert.deepEqual(await link.boundingBox(),before);
  assert.equal(await p.locator('#ms-blackwall').getAttribute('aria-hidden'),'true');
  assert.equal(await p.locator('#ms-blackwall').evaluate(e=>getComputedStyle(e).pointerEvents),'none');
  await p.evaluate(()=>{window.__msStrength=[];window.__msProbe=setInterval(()=>window.__msStrength.push(+document.querySelector('#ms-frame-corruption feDisplacementMap').getAttribute('scale')),20);});
  await p.waitForTimeout(400);
  assert.ok(await p.locator('.ms-signal-hit').first().evaluate(e=>getComputedStyle(e).filter.includes('ms-frame-corruption')));
  assert.ok(await p.locator('#ms-blackwall canvas').evaluate(e=>{const d=e.getContext('2d').getImageData(0,0,e.width,e.height).data;let n=0;for(let i=3;i<d.length;i+=4)if(d[i])n++;return n>10000;}),'corruption must render substantial visible pixels');
  assert.ok(await p.locator('#ms-blackwall canvas').evaluate(e=>{const d=e.getContext('2d').getImageData(0,0,e.width,e.height).data;let blue=0;for(let i=0;i<d.length;i+=4)if(d[i+2]>120&&d[i+1]>100&&d[i]<80&&d[i+3]>12)blue++;return blue>500;}),'terminal-blue trails must be visibly present');
  await p.screenshot({path:path.join(output,'blackwall-burst.png')});
  await p.waitForFunction(()=>!document.body.classList.contains('ms-blackwall-active'));
  assert.equal(await p.locator('.ms-signal-hit').count(),0);
  assert.equal(await p.locator('#page_wrapper').evaluate(e=>getComputedStyle(e).filter),'none');
  await p.evaluate(()=>clearInterval(window.__msProbe));
 });
 await check('distortion eases through intermediate strengths and has irregular long gaps',async()=>{
  const {strength,delays}=await p.evaluate(()=>({strength:window.__msStrength,delays:window.__msScheduledDelays}));
  assert.ok(new Set(strength.map(n=>n.toFixed(2))).size>12,'smooth motion needs more than stepped poses');
  assert.ok(Math.max(...strength.slice(1).map((n,i)=>Math.abs(n-strength[i])))<5,'no abrupt strength jumps');
  assert.ok(delays.length>=2);assert.ok(delays.every(d=>d>=30000&&d<=150000));assert.notEqual(delays[0],delays[1]);
 });
 await check('an early first animation timestamp cannot crash or stick the effect',async()=>assert.deepEqual(errors,[]));
 await check('ordinary keyboard focus does not restart the interference cadence',async()=>{
  await p.getByRole('tab',{name:'GRID',exact:true}).focus();
  await p.waitForTimeout(1700);
  assert.equal(await p.evaluate(()=>document.body.classList.contains('ms-blackwall-active')),false);
 });
 await check('FX switch persists off across reload',async()=>{
  await p.getByRole('button',{name:'Blackwall visual effects'}).click();
  assert.equal(await p.getByRole('button',{name:'Blackwall visual effects'}).getAttribute('aria-pressed'),'false');
  await p.reload({waitUntil:'domcontentloaded'});
  await p.getByRole('button',{name:'Blackwall visual effects'}).waitFor();
  assert.equal(await p.getByRole('button',{name:'Blackwall visual effects'}).getAttribute('aria-pressed'),'false');
  await p.getByRole('button',{name:'Blackwall visual effects'}).click();
 });
 await check('typing and password dialog suppress interference',async()=>{
  await p.locator('.information-widget-search input').focus();
  assert.equal(await p.locator('#ms-blackwall').getAttribute('data-running'),'false');
  await p.keyboard.press('Control+Shift+L');
  assert.equal(await p.locator('#ms-blackwall').getAttribute('data-running'),'false');
  assert.equal(await p.locator('.ms-signal-hit').count(),0);
  assert.equal(await p.locator('#page_wrapper').evaluate(e=>getComputedStyle(e).filter),'none');
  await p.keyboard.press('Escape');await p.locator('.information-widget-search input').evaluate(e=>e.blur());
  await p.waitForFunction(()=>document.querySelector('#ms-blackwall').dataset.running==='true');
 });
 await check('reduced motion disables interference immediately and restores on preference change',async()=>{
  await p.emulateMedia({reducedMotion:'reduce'});
  await p.waitForFunction(()=>document.querySelector('#ms-blackwall').dataset.running==='false');
  assert.equal(await p.locator('#ms-blackwall').evaluate(e=>getComputedStyle(e).display),'none');
  assert.ok(await p.getByRole('button',{name:'Blackwall visual effects'}).isDisabled());
  await p.emulateMedia({reducedMotion:'no-preference'});
  await p.waitForFunction(()=>document.querySelector('#ms-blackwall').dataset.running==='true');
 });
 await check('background tabs stop interference and resume on return',async()=>{
  await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
  assert.equal(await p.locator('#ms-blackwall').getAttribute('data-running'),'false');
  assert.equal(await p.evaluate(()=>document.body.classList.contains('ms-blackwall-active')),false);
  await p.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
  await p.waitForFunction(()=>document.querySelector('#ms-blackwall').dataset.running==='true');
 });
 await check('FX control does not cover ultrawide bookmarks',async()=>{
  assert.ok(await p.locator('.bookmark a').evaluateAll(es=>es.every(e=>{const r=e.getBoundingClientRect(),t=document.querySelector('#ms-fx-toggle').getBoundingClientRect();return r.right<=t.left||r.left>=t.right||r.bottom<=t.top||r.top>=t.bottom;})));
 });
 await p.screenshot({path:path.join(output,'readable-grid.png')});
 await p.setViewportSize({width:390,height:844});
 await p.screenshot({path:path.join(output,'readable-mobile.png')});
 await browser.close();process.exitCode=failures?1:0;
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1});

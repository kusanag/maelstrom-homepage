const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const base = process.env.HOMEPAGE_URL || 'http://localhost:3000';
const output = process.env.ARTIFACT_DIR || 'test-results';
fs.mkdirSync(output, {recursive:true});
let browser;
(async () => {
  browser = await chromium.launch();
  const p = await browser.newPage({viewport:{width:1920,height:1080}});
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  let failures = 0;
  const check = async (name, fn) => {try {await fn();console.log('PASS',name)} catch(e) {failures++;console.error('FAIL',name,e.message)}};
  await p.goto(base, {waitUntil:'domcontentloaded'});
  await check('Samurai intro mounts and is skippable', async () => {
    await p.locator('#nw-boot .nw-ascii').waitFor();
    assert.ok((await p.locator('#nw-boot .nw-ascii').textContent()).length > 1000);
    await p.keyboard.press('Escape');
    await p.locator('#nw-boot').waitFor({state:'detached'});
  });
  await p.evaluate(() => document.fonts.ready);
  await check('demo has five launcher groups and a background strip', async () => {
    assert.equal(await p.locator('.services-group').count(), 6);
    assert.equal(await p.locator('.service-card').count(), 27);
    assert.ok(await p.locator('.service-card a[href]').evaluateAll(es => es.every(e => new URL(e.href).hostname==='example.com')));
    assert.ok(await p.locator('.ms-emblem').evaluate(e => e.complete && e.naturalWidth > 0));
  });
  await check('compact GRID fits a desktop screen', async () => {
    assert.ok(await p.locator('.service-card a[href],.bookmark a').evaluateAll(es => es.every(e => e.getBoundingClientRect().bottom<=innerHeight)));
  });
  await p.screenshot({path:path.join(output,'dashboard.png')});
  await check('PRIVATE is concealed; VITALS and GRID remain native tabs', async () => {
    assert.equal(await p.getByRole('tab',{name:'PRIVATE',exact:true}).isVisible(),false);
    await p.getByRole('tab',{name:'VITALS',exact:true}).click();
    assert.equal(await p.locator('.services-group').count(),4);
    await p.screenshot({path:path.join(output,'vitals.png')});
    await p.getByRole('tab',{name:'GRID',exact:true}).click();
    assert.equal(await p.locator('.service-card').count(),27);
  });
  for (const width of [3440,1920,1440,1024,768,390,320]) {
    await check(`layout has no horizontal overflow at ${width}px`, async () => {
      await p.setViewportSize({width,height:width>1500?1080:844});
      assert.ok(await p.evaluate(() => document.documentElement.scrollWidth<=innerWidth));
    });
  }
  await p.setViewportSize({width:390,height:844});
  await p.screenshot({path:path.join(output,'mobile.png')});
  await p.setViewportSize({width:1920,height:1080});
  await check('unconfigured private key cannot unlock and input stays masked', async () => {
    await p.keyboard.press('Control+Shift+L');
    await p.getByRole('dialog',{name:'PRIVATE',exact:true}).waitFor();
    assert.equal(await p.locator('#ms-vault-key').getAttribute('type'),'password');
    assert.ok(await p.locator('#ms-vault-key').evaluate(e => e===document.activeElement));
    await p.screenshot({path:path.join(output,'private-tab.png')});
    await p.locator('#ms-vault-key').fill('fixture-only');
    await p.locator('#ms-vault-key').press('Enter');
    await p.getByRole('status').filter({hasText:'No local key configured'}).waitFor();
    assert.equal(await p.locator('#ms-vault-key').inputValue(),'');
    assert.equal(await p.getByRole('tab',{name:'PRIVATE',exact:true}).isVisible(),false);
    await p.keyboard.press('Escape');
  });
  const key = 'browser-test-fixture-only';
  const hash = crypto.createHash('sha256').update(key).digest('hex');
  await p.route('**/api/config/custom.js*', async route => {
    const response = await route.fetch();
    await route.fulfill({response,body:(await response.text()).replace(/var HASH = "[a-f0-9]*";/,`var HASH = "${hash}";`)});
  });
  await p.reload({waitUntil:'domcontentloaded'});
  await p.waitForFunction(() => window.__maelstromDeck);
  await check('intro does not replay on reload', async () => assert.equal(await p.locator('#nw-boot').count(),0));
  await check('wrong key is rejected and cleared', async () => {
    await p.keyboard.press('Control+Shift+L');
    await p.locator('#ms-vault-key').fill('wrong-fixture');
    await p.locator('#ms-vault-key').press('Enter');
    await p.getByRole('status').filter({hasText:'Access key rejected'}).waitFor();
    assert.equal(await p.locator('#ms-vault-key').inputValue(),'');
    await p.keyboard.press('Escape');
  });
  await check('configured key unlocks PRIVATE and shortcut re-locks it', async () => {
    await p.keyboard.press('Control+Shift+L');
    await p.locator('#ms-vault-key').fill(key);
    await p.locator('#ms-vault-key').press('Enter');
    await p.getByRole('tab',{name:'PRIVATE',exact:true}).waitFor();
    assert.equal(await p.getByRole('tab',{name:'PRIVATE',exact:true}).getAttribute('aria-selected'),'true');
    assert.equal(await p.locator('#ms-vault-key').inputValue(),'');
    assert.equal(await p.evaluate(k => JSON.stringify(sessionStorage).includes(k),key),false);
    await p.keyboard.press('Control+Shift+L');
    assert.equal(await p.getByRole('tab',{name:'PRIVATE',exact:true}).isVisible(),false);
  });
  await check('canceling in-flight verification cannot unlock', async () => {
    await p.evaluate(() => {const digest=crypto.subtle.digest.bind(crypto.subtle);crypto.subtle.digest=async (...args)=>{await new Promise(r=>setTimeout(r,250));return digest(...args)}});
    await p.keyboard.press('Control+Shift+L');
    await p.locator('#ms-vault-key').fill(key);
    await p.locator('#ms-vault-key').press('Enter');
    await p.keyboard.press('Escape');
    await p.waitForTimeout(400);
    assert.equal(await p.getByRole('tab',{name:'PRIVATE',exact:true}).isVisible(),false);
  });
  await check('runtime has no page errors', async () => assert.deepEqual(errors,[]));
  await browser.close();
  process.exitCode = failures ? 1 : 0;
})().catch(async error => {console.error(error);await browser?.close();process.exitCode=1});
